import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, UserRole } from '@/lib/auth-rbac';

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    
    if (auth.error) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status || 401 }
      );
    }

    if (!auth.user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Check if user has admin or editor role
    const hasAdminAccess = auth.user.role === UserRole.ADMIN || auth.user.role === UserRole.EDITOR;
    
    if (!hasAdminAccess) {
      return NextResponse.json(
        { 
          error: 'Access denied',
          requiredRole: 'ADMIN or EDITOR',
          userRole: auth.user.role
        },
        { status: 403 }
      );
    }

    // User has sufficient privileges
    return NextResponse.json({
      success: true,
      user: {
        uid: auth.user.uid,
        email: auth.user.email,
        role: auth.user.role,
        permissions: auth.user.permissions
      },
      message: 'Access granted'
    });

  } catch (error) {
    console.error('Error in verify-access:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}