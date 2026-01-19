import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-server';
import admin from 'firebase-admin';

// Type guards for Firebase
function isAdminApp(app: any): app is admin.app.App {
  return app && typeof app.credential === 'function';
}

// User roles and permissions
export enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

export enum Permission {
  READ_CONTENT = 'read_content',
  WRITE_CONTENT = 'write_content',
  DELETE_CONTENT = 'delete_content',
  MANAGE_USERS = 'manage_users',
  VIEW_ANALYTICS = 'view_analytics'
}

export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    Permission.READ_CONTENT,
    Permission.WRITE_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.MANAGE_USERS,
    Permission.VIEW_ANALYTICS
  ],
  [UserRole.EDITOR]: [
    Permission.READ_CONTENT,
    Permission.WRITE_CONTENT,
    Permission.VIEW_ANALYTICS
  ],
  [UserRole.VIEWER]: [
    Permission.READ_CONTENT,
    Permission.VIEW_ANALYTICS
  ]
};

interface AuthenticatedUser {
  uid: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
}

// Firebase Admin initialization (server-side only)
let adminApp: admin.app.App | null = null;

function getAdminApp() {
  if (!adminApp) {
    if (typeof window !== 'undefined') {
      throw new Error('Firebase Admin can only be used server-side');
    }

    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    adminApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.projectId,
    });
  }
  return adminApp;
}

// Authentication middleware for API routes
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
    const adminApp = getAdminApp();
    const decodedToken = await adminApp.auth().verifyIdToken(token);

    // Get user role from Firestore or custom claims
    const userDoc = await adminApp.firestore()
      .collection('users')
      .doc(decodedToken.uid)
      .get();

    const userData = userDoc.data();
    const role = userData?.role as UserRole || UserRole.VIEWER;
    const permissions = ROLE_PERMISSIONS[role];

    const user: AuthenticatedUser = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      role,
      permissions
    };

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

// Permission checking middleware
export function requirePermission(permission: Permission) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const auth = await authenticateRequest(request);
    
    if (auth.error) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status || 500 }
      );
    }

    if (!auth.user?.permissions.includes(permission)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Add user info to request headers for downstream use
    const response = NextResponse.next();
    response.headers.set('x-user-id', auth.user.uid);
    response.headers.set('x-user-role', auth.user.role);
    
    return response;
  };
}

// Role-based access control
export function requireRole(role: UserRole) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const auth = await authenticateRequest(request);
    
    if (auth.error) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status || 500 }
      );
    }

    if (auth.user?.role !== role) {
      return NextResponse.json(
        { error: 'Insufficient role privileges' },
        { status: 403 }
      );
    }

    return NextResponse.next();
  };
}

// Helper to get current user from request
export function getCurrentUser(request: NextRequest): AuthenticatedUser | null {
  const userId = request.headers.get('x-user-id');
  const userRole = request.headers.get('x-user-role') as UserRole;
  
  if (!userId || !userRole) {
    return null;
  }

  return {
    uid: userId,
    email: '', // Would need to be passed separately
    role: userRole,
    permissions: ROLE_PERMISSIONS[userRole]
  };
}