import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, Permission } from '@/lib/auth-rbac';
import { validateFile, allowedImageTypes, maxImageSize } from '@/lib/security';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    // Authenticate and check permissions
    const auth = await authenticateRequest(request);
    
    if (auth.error) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status || 401 }
      );
    }

    if (!auth.user || !auth.user.permissions.includes(Permission.WRITE_CONTENT)) {
      return NextResponse.json(
        { error: 'No tienes permisos para subir archivos' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validate file security
    const validation = validateFile(file, {
      maxSize: maxImageSize,
      allowedTypes: allowedImageTypes
    });

    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: validation.error,
          details: validation.metadata
        },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    const uploadDir = 'uploads/blog';
    await mkdir(uploadDir, { recursive: true });

    // Sanitize filename
    const sanitizedFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase();

    const filePath = join(uploadDir, `${Date.now()}-${sanitizedFileName}`);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filePath, buffer);

    // Return file information
    return NextResponse.json({
      success: true,
      message: 'Archivo subido exitosamente',
      file: {
        name: file.name,
        size: file.size,
        type: file.type,
        path: filePath
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al subir archivo',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Authenticate and check permissions
    const auth = await authenticateRequest(request);
    
    if (auth.error) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status || 401 }
      );
    }

    if (!auth.user || !auth.user.permissions.includes(Permission.READ_CONTENT)) {
      return NextResponse.json(
        { error: 'No tienes permisos para ver archivos' },
        { status: 403 }
      );
    }

    // List uploaded files
    const uploadDir = 'uploads/blog';
    const fs = await import('fs').then(m => m.default);
    
    try {
      const files = fs.readdirSync(uploadDir);
      const fileInfos = files.map(file => {
        const filePath = join(uploadDir, file);
        const stats = fs.statSync(filePath);
        
        return {
          name: file,
          size: stats.size,
          type: file.split('.').pop(),
          created: stats.birthtime.toISOString(),
          path: filePath
        };
      });

      return NextResponse.json({
        success: true,
        files: fileInfos
      });

    } catch (error) {
      return NextResponse.json({
        success: true,
        files: [] // No files directory
      });
    }

  } catch (error) {
    console.error('List files error:', error);
    
    return NextResponse.json(
      { 
        error: 'Error al listar archivos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}