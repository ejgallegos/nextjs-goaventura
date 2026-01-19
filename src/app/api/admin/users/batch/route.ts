import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, Permission } from '@/lib/auth-rbac';
import { adminUserService } from '@/lib/admin-user-service';
import { sanitizeUserInput, getSecurityHeaders } from '@/lib/security';
import { z } from 'zod';

// Validation schema for batch operations
const batchOperationSchema = z.object({
  operations: z.array(z.object({
    type: z.enum(['create', 'update', 'delete', 'enable', 'disable']),
    userId: z.string().optional(),
    email: z.string().email().optional(),
    userData: z.object({
      displayName: z.string().min(2).max(100).optional(),
      role: z.enum(['admin', 'editor', 'viewer']).optional(),
      permissions: z.array(z.enum([
        'read_content', 'write_content', 'delete_content', 
        'manage_users', 'view_analytics'
      ])).optional(),
      isActive: z.boolean().optional(),
      notes: z.string().optional()
    }).optional()
  }))
});

/**
 * POST /api/admin/users/batch - Perform batch operations on admin users
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
        { error: 'Insufficient permissions to perform batch operations' },
        { status: 403, headers: getSecurityHeaders() }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const sanitizedBody = sanitizeUserInput(body);
    const validatedData = batchOperationSchema.parse(sanitizedBody);

    // Perform batch operations
    const result = await adminUserService.batchAdminOperations(
      validatedData.operations.map(op => ({
        ...op,
        userData: op.userData ? {
          ...op.userData,
          role: op.userData.role as any,
          permissions: op.userData.permissions as any
        } : undefined
      })),
      auth.user.uid
    );

    if (result.success) {
      return NextResponse.json(
        { 
          success: true,
          message: `Successfully processed ${result.processed} operations`,
          processed: result.processed,
          failed: result.failed,
          results: result.results
        },
        { status: 200, headers: getSecurityHeaders() }
      );
    } else {
      return NextResponse.json(
        { 
          success: false,
          error: 'Some operations failed',
          processed: result.processed,
          failed: result.failed,
          errors: result.errors,
          results: result.results
        },
        { status: 207, headers: getSecurityHeaders() } // Multi-Status
      );
    }

  } catch (error: any) {
    console.error('Error in POST /api/admin/users/batch:', error);
    
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
 * OPTIONS /api/admin/users/batch - Handle CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getSecurityHeaders(),
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}