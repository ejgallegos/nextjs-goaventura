import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, requirePermission, Permission } from '@/lib/auth-production';
import { getSecurityHeaders } from '@/lib/security';

// Production-ready protected API route
export async function GET(request: NextRequest) {
  try {
    // Check authentication and permissions
    const auth = await requirePermission(request, Permission.READ_CONTENT);
    if (auth.error) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status, headers: getSecurityHeaders() }
      );
    }

    // Return protected data
    return NextResponse.json(
      { 
        success: true,
        message: 'Access granted to protected resource',
        user: {
          email: auth.user?.email,
          role: auth.user?.role,
          permissions: auth.user?.permissions
        },
        data: { 
          message: 'This is protected admin data',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV
        }
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error: any) {
    console.error('Protected route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check write permissions
    const auth = await requirePermission(request, Permission.WRITE_CONTENT);
    if (auth.error) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status, headers: getSecurityHeaders() }
      );
    }

    const body = await request.json();
    
    // Process the request
    return NextResponse.json(
      { 
        success: true,
        message: 'Data updated successfully',
        updatedBy: auth.user?.email,
        data: body
      },
      { headers: getSecurityHeaders() }
    );
  } catch (error: any) {
    console.error('Protected POST error:', error);
    return NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400, headers: getSecurityHeaders() }
    );
  }
}