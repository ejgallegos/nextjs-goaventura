import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdmin } from '@/lib/firebase-admin';
import { UserRole, Permission, ROLE_PERMISSIONS } from './auth-rbac';

// Re-export Permission for API routes
export { Permission };
import { getSecurityHeaders } from '@/lib/security';

interface AuthenticatedUser {
  uid: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
  emailVerified: boolean;
  customClaims?: any;
}

export async function authenticateRequest(request: NextRequest): Promise<{
  user?: AuthenticatedUser;
  error?: string;
  status?: number;
}> {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return { error: 'Authorization header required', status: 401 };
    }

    const token = authHeader.substring(7);
    
    // Verify ID token with Firebase Admin
    const adminApp = getFirebaseAdmin();
    const decodedToken = await adminApp.auth()!.verifyIdToken(token);
    
    // Check if email is verified
    if (!decodedToken.email_verified) {
      return { error: 'Email not verified', status: 403 };
    }

    // Get user role and permissions from Firestore
    const db = adminApp.firestore();
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    
    const userData = userDoc.data();
    const role = userData?.role as UserRole || UserRole.VIEWER;
    const permissions = ROLE_PERMISSIONS[role];

    // Check if user is active
    if (userData?.status === 'disabled') {
      return { error: 'Account disabled', status: 403 };
    }

    const user: AuthenticatedUser = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      emailVerified: decodedToken.email_verified || false,
      role,
      permissions,
      customClaims: decodedToken
    };

    // Log authentication event for security
    console.log(`Authentication successful: ${user.email} (${user.role})`);

    return { user };
  } catch (error: any) {
    console.error('Authentication error:', error);
    
    if (error.code === 'auth/id-token-expired') {
      return { error: 'Token expired', status: 401 };
    }
    if (error.code === 'auth/id-token-revoked') {
      return { error: 'Token revoked', status: 401 };
    }
    if (error.code === 'auth/invalid-id-token') {
      return { error: 'Invalid token', status: 401 };
    }

    return { error: 'Authentication failed', status: 500 };
  }
}

export async function requirePermission(
  request: NextRequest, 
  requiredPermission: Permission
): Promise<{ user?: AuthenticatedUser; error?: string; status?: number }> {
  const auth = await authenticateRequest(request);
  
  if (auth.error) {
    return auth;
  }

  if (!auth.user?.permissions.includes(requiredPermission)) {
    // Log permission denied event
    console.warn(`Permission denied: ${auth.user?.email} attempted ${requiredPermission}`);
    
    return { 
      error: `Insufficient permissions. Required: ${requiredPermission}`, 
      status: 403 
    };
  }

  return { user: auth.user };
}

export async function requireRole(
  request: NextRequest, 
  requiredRole: UserRole
): Promise<{ user?: AuthenticatedUser; error?: string; status?: number }> {
  const auth = await authenticateRequest(request);
  
  if (auth.error) {
    return auth;
  }

  if (auth.user?.role !== requiredRole) {
    // Log role check failure
    console.warn(`Role check failed: ${auth.user?.email} (${auth.user?.role}) attempted ${requiredRole} action`);
    
    return { 
      error: `Insufficient role privileges. Required: ${requiredRole}`, 
      status: 403 
    };
  }

  return { user: auth.user };
}

export async function createUserSession(user: any, customClaims: any = {}) {
  try {
    const adminApp = getFirebaseAdmin();
    
    // Set custom claims
    await adminApp.auth()!.setCustomUserClaims(user.uid, {
      role: customClaims.role || UserRole.VIEWER,
      ...customClaims
    });

    // Update user document in Firestore
    const db = adminApp.firestore();
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      emailVerified: user.emailVerified,
      role: customClaims.role || UserRole.VIEWER,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      customClaims
    }, { merge: true });

    console.log(`User session created: ${user.email} (${customClaims.role})`);
    return true;
  } catch (error) {
    console.error('Error creating user session:', error);
    return false;
  }
}

export async function revokeUserSession(uid: string) {
  try {
    const adminApp = getFirebaseAdmin();
    
    // Revoke all tokens
    await adminApp.auth()!.revokeRefreshTokens(uid);
    
    // Clear custom claims
    await adminApp.auth()!.setCustomUserClaims(uid, null);
    
    // Update user status in Firestore
    const db = adminApp.firestore();
    await db.collection('users').doc(uid).update({
      status: 'disabled',
      lastModified: new Date().toISOString()
    });

    console.log(`User session revoked: ${uid}`);
    return true;
  } catch (error) {
    console.error('Error revoking user session:', error);
    return false;
  }
}