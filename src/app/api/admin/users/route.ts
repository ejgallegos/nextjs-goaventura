import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, Permission } from '@/lib/auth-rbac';
import { adminUserService } from '@/lib/admin-user-service';
import { sanitizeUserInput, getSecurityHeaders } from '@/lib/security';
import { z } from 'zod';

// Validation schema for creating admin users
const createAdminSchema = z.object({
  email: z.string().email('Email inválido'),
  displayName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
  role: z.enum(['admin', 'editor', 'viewer']).optional(),
  permissions: z.array(z.enum([
    'read_content', 'write_content', 'delete_content', 
    'manage_users', 'view_analytics'
  ])).optional(),
  isActive: z.boolean().optional(),
  notes: z.string().optional()
});

/**
 * POST /api/admin/users - Create new admin user
 */
export async function POST(request: NextRequest) {
  try {
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
        { error: 'Insufficient permissions to create admin users' },
        { status: 403, headers: getSecurityHeaders() }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const sanitizedBody = sanitizeUserInput(body);
    const validatedData = createAdminSchema.parse(sanitizedBody);

    // Create admin user
    const result = await adminUserService.createAdminUser({
      email: validatedData.email,
      displayName: validatedData.displayName,
      role: validatedData.role as any,
      permissions: validatedData.permissions as any,
      isActive: validatedData.isActive,
      notes: validatedData.notes,
      createdBy: auth.user.uid
    });

    if (result.success) {
      return NextResponse.json(
        { 
          success: true, 
          user: result.user,
          requiresAction: result.requiresAction,
          message: result.requiresAction === 'invitation_sent' 
            ? 'Usuario admin creado exitosamente. Se ha enviado un correo de invitación.'
            : 'Usuario admin creado exitosamente.'
        },
        { status: 201, headers: getSecurityHeaders() }
      );
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error,
          requiresAction: result.requiresAction 
        },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

  } catch (error: any) {
    console.error('Error in POST /api/admin/users:', error);
    
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
        error: 'Internal server error' 
      },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

/**
 * GET /api/admin/users - List admin users
 */
export async function GET(request: NextRequest) {
  try {
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
        { error: 'Insufficient permissions to list admin users' },
        { status: 403, headers: getSecurityHeaders() }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const pageToken = searchParams.get('pageToken') || undefined;
    const role = searchParams.get('role') as any;
    const isActive = searchParams.get('isActive');
    const search = searchParams.get('search') || undefined;

    // Build filters object
    const filters: any = {};
    if (role) filters.role = role;
    if (isActive !== null) filters.isActive = isActive === 'true';
    if (search) filters.search = search;

    // Get admin users
    const result = await adminUserService.listAdminUsers(limit, pageToken, filters);

    return NextResponse.json(
      { 
        success: true, 
        users: result.users,
        totalCount: result.totalCount,
        hasMore: result.hasMore,
        nextPageToken: result.nextPageToken
      },
      { status: 200, headers: getSecurityHeaders() }
    );

  } catch (error: any) {
    console.error('Error in GET /api/admin/users:', error);
    
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
 * OPTIONS /api/admin/users - Handle CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getSecurityHeaders(),
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}