import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, requirePermission, Permission } from '@/lib/auth-rbac';
import { getSecurityHeaders } from '@/lib/security';

// Example protected API route for admin operations
export async function GET(request: NextRequest) {
  // Check authentication and permissions
  const authResult = await authenticateRequest(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status, headers: getSecurityHeaders() }
    );
  }

  // Additional permission check
  if (!authResult.user?.permissions.includes(Permission.READ_CONTENT)) {
    return NextResponse.json(
      { error: 'Insufficient permissions' },
      { status: 403, headers: getSecurityHeaders() }
    );
  }

  // Return protected data
  return NextResponse.json(
    { 
      message: 'Access granted to protected resource',
      user: authResult.user.email,
      data: { sensitive: 'admin data' }
    },
    { headers: getSecurityHeaders() }
  );
}

export async function POST(request: NextRequest) {
  const authResult = await authenticateRequest(request);
  if (authResult.error) {
    return NextResponse.json(
      { error: authResult.error },
      { status: authResult.status, headers: getSecurityHeaders() }
    );
  }

  // Check write permissions
  if (!authResult.user?.permissions.includes(Permission.WRITE_CONTENT)) {
    return NextResponse.json(
      { error: 'Write permission required' },
      { status: 403, headers: getSecurityHeaders() }
    );
  }

  try {
    const body = await request.json();
    
    // Process the request
    return NextResponse.json(
      { 
        message: 'Data updated successfully',
        updatedBy: authResult.user.email
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400, headers: getSecurityHeaders() }
    );
  }
}