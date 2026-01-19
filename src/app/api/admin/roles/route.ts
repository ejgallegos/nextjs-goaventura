import { NextRequest, NextResponse } from 'next/server';
import getAdminApp from '@/lib/firebase-admin';
import { UserRole, Permission, ROLE_PERMISSIONS } from '@/lib/auth-rbac';
import { createSecureResponse } from '@/lib/security-production';
import { authenticateRequest } from '@/lib/auth-production';

interface CreateUserData {
  email: string;
  role: UserRole;
  status?: 'active' | 'inactive' | 'disabled';
  customClaims?: any;
}

interface UpdateUserData {
  email: string;
  role?: UserRole;
  status?: 'active' | 'inactive' | 'disabled';
  customClaims?: any;
}

// Create or update user with role
export async function POST(request: NextRequest) {
  try {
    // Verify admin permissions
    const auth = await authenticateRequest(request);
    if (auth.error) {
      return createSecureResponse({ error: auth.error }, auth.status || 401);
    }

    const { email, role, status = 'active', customClaims = {} }: CreateUserData = await request.json();

    if (!email || !role) {
      return createSecureResponse(
        { error: 'Email and role are required' },
        400
      );
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return createSecureResponse(
        { error: 'Invalid role specified' },
        400
      );
    }

    const adminApp = getAdminApp();
    const db = adminApp.firestore();

    // Check if user exists in Firebase Auth
    try {
      const userRecord =       await adminApp.auth()!.getUserByEmail(email);
      
      // Set custom claims with role
      await adminApp.auth()!.setCustomUserClaims(userRecord.uid, {
        role,
        ...customClaims
      });

      // Update user document in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        email,
        role,
        status,
        customClaims,
        createdAt: userRecord.metadata.creationTime,
        lastModified: new Date().toISOString(),
        permissions: ROLE_PERMISSIONS[role]
      }, { merge: true });

      return createSecureResponse({
        success: true,
        message: `User ${email} assigned role: ${role}`,
        user: {
          uid: userRecord.uid,
          email,
          role,
          status,
          permissions: ROLE_PERMISSIONS[role]
        }
      });

    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        return createSecureResponse(
          { error: 'User not found in Firebase Auth. User must exist first.' },
          404
        );
      }
      throw error;
    }

  } catch (error: any) {
    console.error('Error creating user role:', error);
    return createSecureResponse(
      { error: 'Failed to assign user role', details: error.message },
      500
    );
  }
}

// Get user role and permissions
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth.error) {
      return createSecureResponse({ error: auth.error }, auth.status || 401);
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return createSecureResponse(
        { error: 'Email parameter is required' },
        400
      );
    }

    const adminApp = getAdminApp();
    const db = adminApp.firestore();

    // Get user from Firestore
    const userSnapshot = await db
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return createSecureResponse(
        { error: 'User not found' },
        404
      );
    }

    const userData = userSnapshot.docs[0].data();
    
    return createSecureResponse({
      success: true,
      user: {
        uid: userSnapshot.docs[0].id,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        permissions: userData.permissions,
        lastModified: userData.lastModified
      }
    });

  } catch (error: any) {
    console.error('Error getting user role:', error);
    return createSecureResponse(
      { error: 'Failed to get user role', details: error.message },
      500
    );
  }
}

// Update user role
export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth.error) {
      return createSecureResponse({ error: auth.error }, auth.status || 401);
    }

    const { email, role, status, customClaims }: UpdateUserData = await request.json();

    if (!email) {
      return createSecureResponse(
        { error: 'Email is required' },
        400
      );
    }

    const adminApp = getAdminApp();
    const db = adminApp.firestore();

    // Get user from Firestore
    const userSnapshot = await db
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return createSecureResponse(
        { error: 'User not found' },
        404
      );
    }

    const userDoc = userSnapshot.docs[0];
    const uid = userDoc.id;
    const currentData = userDoc.data();

    // Prepare update data
    const updateData: any = {
      lastModified: new Date().toISOString()
    };

    if (role && Object.values(UserRole).includes(role)) {
      updateData.role = role;
      updateData.permissions = ROLE_PERMISSIONS[role];
      
      // Update Firebase Auth custom claims
      await adminApp.auth()!.setCustomUserClaims(uid, {
        role,
        ...currentData.customClaims,
        ...customClaims
      });
    }

    if (status) {
      updateData.status = status;
    }

    if (customClaims) {
      updateData.customClaims = { ...currentData.customClaims, ...customClaims };
    }

    // Update Firestore document
    await db.collection('users').doc(uid).update(updateData);

    return createSecureResponse({
      success: true,
      message: `User ${email} updated successfully`,
      user: {
        uid,
        email,
        role: updateData.role || currentData.role,
        status: updateData.status || currentData.status,
        permissions: updateData.permissions || currentData.permissions,
        lastModified: updateData.lastModified
      }
    });

  } catch (error: any) {
    console.error('Error updating user role:', error);
    return createSecureResponse(
      { error: 'Failed to update user role', details: error.message },
      500
    );
  }
}

// Delete/disable user
export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth.error) {
      return createSecureResponse({ error: auth.error }, auth.status || 401);
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return createSecureResponse(
        { error: 'Email parameter is required' },
        400
      );
    }

    const adminApp = getAdminApp();
    const db = adminApp.firestore();

    // Get user from Firestore
    const userSnapshot = await db
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (userSnapshot.empty) {
      return createSecureResponse(
        { error: 'User not found' },
        404
      );
    }

    const uid = userSnapshot.docs[0].id;

    // Disable user in Firebase Auth
    await adminApp.auth()!.updateUser(uid, { disabled: true });

    // Update Firestore status
    await db.collection('users').doc(uid).update({
      status: 'disabled',
      disabledAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    });

    // Revoke all tokens
    await adminApp.auth()!.revokeRefreshTokens(uid);

    return createSecureResponse({
      success: true,
      message: `User ${email} has been disabled`
    });

  } catch (error: any) {
    console.error('Error disabling user:', error);
    return createSecureResponse(
      { error: 'Failed to disable user', details: error.message },
      500
    );
  }
}

// Get all users (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth.error) {
      return createSecureResponse({ error: auth.error }, auth.status || 401);
    }

    const adminApp = getAdminApp();
    const db = adminApp.firestore();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const role = searchParams.get('role');

    let query: any = db.collection('users');

    if (status) {
      query = query.where('status', '==', status);
    }

    if (role) {
      query = query.where('role', '==', role);
    }

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset((page - 1) * limit)
      .get();

    const users = snapshot.docs.map((doc: any) => ({
      uid: doc.id,
      ...doc.data()
    }));

    return createSecureResponse({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total: snapshot.size
      }
    });

  } catch (error: any) {
    console.error('Error getting users:', error);
    return createSecureResponse(
      { error: 'Failed to get users', details: error.message },
      500
    );
  }
}