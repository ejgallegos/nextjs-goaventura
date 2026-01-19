import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, Permission } from '@/lib/auth-rbac';
import { adminUserService } from '@/lib/admin-user-service';
import { sanitizeUserInput, getSecurityHeaders } from '@/lib/security';
import { z } from 'zod';

// Validation schema for updating admin users
const updateAdminSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  role: z.enum(['admin', 'editor', 'viewer']).optional(),
  permissions: z.array(z.enum([
    'read_content', 'write_content', 'delete_content', 
    'manage_users', 'view_analytics'
  ])).optional(),
  isActive: z.boolean().optional(),
  notes: z.string().optional()
});

interface RouteParams {
  params: Promise<{
    uid: string;
  }>;
}

/**
 * GET /api/admin/users/[uid] - Get specific admin user
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { uid } = await params;
    
    // Authenticate and authorize request
    const auth = await authenticateRequest(request);
    
    if (auth.error) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status || 401, headers: getSecurityHeaders() }
      );
    }

    if (!auth.user?.permissions.includes(Permission.MANAGE_USERS)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to view admin users' },
        { status: 403, headers: getSecurityHeaders() }
      );
    }

    // Get admin user
    const user = await adminUserService.getAdminUser(uid);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      { success: true, user },
      { status: 200, headers: getSecurityHeaders() }
    );

  } catch (error: any) {
    console.error(`Error in GET /api/admin/users/[uid]:`, error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

/**
 * PUT /api/admin/users/[uid] - Update admin user
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { uid } = await params;
    
    // Authenticate and authorize request
    const auth = await authenticateRequest(request);
    
    if (auth.error) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status || 401, headers: getSecurityHeaders() }
      );
    }

    if (!auth.user?.permissions.includes(Permission.MANAGE_USERS)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to update admin users' },
        { status: 403, headers: getSecurityHeaders() }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const sanitizedBody = sanitizeUserInput(body);
    const validatedData = updateAdminSchema.parse(sanitizedBody);

    // Update admin user
    const updatedUser = await adminUserService.updateAdminUser(
      uid,
      {
        displayName: validatedData.displayName,
        role: validatedData.role as any,
        permissions: validatedData.permissions as any,
        isActive: validatedData.isActive,
        notes: validatedData.notes
      },
      auth.user.uid
    );

    return NextResponse.json(
      { 
        success: true, 
        user: updatedUser,
        message: 'Usuario admin actualizado exitosamente.'
      },
      { status: 200, headers: getSecurityHeaders() }
    );

  } catch (error: any) {
    console.error(`Error in PUT /api/admin/users/[uid]:`, error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed', 
          details: error.errors.map(e => e.message) 
        },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

/**
 * DELETE /api/admin/users/[uid] - Delete admin user
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { uid } = await params;
    
    // Authenticate and authorize request
    const auth = await authenticateRequest(request);
    
    if (auth.error) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status || 401, headers: getSecurityHeaders() }
      );
    }

    if (!auth.user?.permissions.includes(Permission.MANAGE_USERS)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to delete admin users' },
        { status: 403, headers: getSecurityHeaders() }
      );
    }

    // Delete admin user
    await adminUserService.deleteAdminUser(uid, auth.user.uid);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Usuario admin eliminado exitosamente.'
      },
      { status: 200, headers: getSecurityHeaders() }
    );

  } catch (error: any) {
    console.error(`Error in DELETE /api/admin/users/[uid]:`, error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

/**
 * PATCH /api/admin/users/[uid]/toggle - Toggle user status
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { uid } = await params;
    
    // Authenticate and authorize request
    const auth = await authenticateRequest(request);
    
    if (auth.error) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status || 401, headers: getSecurityHeaders() }
      );
    }

    if (!auth.user?.permissions.includes(Permission.MANAGE_USERS)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to manage admin users' },
        { status: 403, headers: getSecurityHeaders() }
      );
    }

    // Parse request body
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'isActive field is required and must be boolean' 
        },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    // Toggle user status
    const updatedUser = await adminUserService.toggleAdminUserStatus(
      uid, 
      isActive, 
      auth.user.uid
    );

    return NextResponse.json(
      { 
        success: true, 
        user: updatedUser,
        message: `Usuario admin ${isActive ? 'activado' : 'desactivado'} exitosamente.`
      },
      { status: 200, headers: getSecurityHeaders() }
    );

  } catch (error: any) {
    console.error(`Error in PATCH /api/admin/users/[uid]:`, error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error' 
      },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

/**
 * OPTIONS /api/admin/users/[uid] - Handle CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getSecurityHeaders(),
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}