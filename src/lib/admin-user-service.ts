import { getFirebaseAdmin, getFirebaseAuth, getFirebaseFirestore } from '@/lib/firebase-admin';
import { 
  createAdminUserSchema, 
  AdminUser, 
  CreateAdminUserData, 
  AdminUserCreationResult,
  AdminUserListResult,
  UserRole,
  Permission,
  getDefaultPermissionsForRole,
  validateEmailDomain,
  AdminAuditLog,
  BatchAdminOperation,
  BatchOperationResult,
  DEFAULT_ADMIN_PERMISSIONS
} from '@/lib/admin-types';
import { sanitizeString } from '@/lib/security';

/**
 * Admin User Management Service
 * Handles creation, update, and management of admin users in Firebase
 */
export class AdminUserService {
  private static instance: AdminUserService;
  private auth = getFirebaseAuth();
  private firestore = getFirebaseFirestore();

  private constructor() {}

  static getInstance(): AdminUserService {
    if (!AdminUserService.instance) {
      AdminUserService.instance = new AdminUserService();
    }
    return AdminUserService.instance;
  }

  /**
   * Create a new admin user with proper role and permissions
   */
  async createAdminUser(userData: CreateAdminUserData): Promise<AdminUserCreationResult> {
    try {
      // Validate input data
      const validatedData = createAdminUserSchema.parse(userData);
      
      // Sanitize inputs
      const sanitizedData = {
        email: sanitizeString(validatedData.email.toLowerCase()),
        displayName: sanitizeString(validatedData.displayName),
        role: validatedData.role || UserRole.ADMIN,
        permissions: validatedData.permissions || getDefaultPermissionsForRole(validatedData.role || UserRole.ADMIN),
        isActive: validatedData.isActive ?? true,
        createdBy: validatedData.createdBy,
        notes: validatedData.notes ? sanitizeString(validatedData.notes) : undefined
      };

      // Check if user already exists in Firebase Auth
      let userRecord;
      try {
        userRecord = await this.auth.getUserByEmail(sanitizedData.email);
        
        // User exists, check if they already have admin role
        const userDoc = await this.firestore.collection('users').doc(userRecord.uid).get();
        const existingUserData = userDoc.data();

        if (existingUserData?.role === UserRole.ADMIN) {
          return {
            success: false,
            error: 'User already has admin privileges',
            requiresAction: 'user_exists'
          };
        }

        // Update existing user with admin role
        await this.updateUserClaims(userRecord.uid, sanitizedData.role, sanitizedData.permissions);
        
        const adminUser: AdminUser = {
          uid: userRecord.uid,
          email: sanitizedData.email,
          displayName: sanitizedData.displayName,
          role: sanitizedData.role,
          permissions: sanitizedData.permissions,
          isActive: sanitizedData.isActive,
          createdAt: existingUserData?.createdAt?.toDate() || new Date(),
          updatedAt: new Date(),
          createdBy: sanitizedData.createdBy,
          notes: sanitizedData.notes,
          metadata: {
            source: 'manual',
            version: 1
          }
        };

        await this.firestore.collection('users').doc(userRecord.uid).set({
          ...adminUser,
          createdAt: adminUser.createdAt,
          updatedAt: adminUser.updatedAt
        }, { merge: true });

        await this.logAuditEvent({
          userId: sanitizedData.createdBy || 'system',
          action: 'create_user',
          targetUserId: userRecord.uid,
          details: { email: sanitizedData.email, role: sanitizedData.role },
          environment: process.env.NODE_ENV as any
        });

        return {
          success: true,
          user: adminUser,
          requiresAction: 'manual_setup'
        };

      } catch (error: any) {
        if (error.code !== 'auth/user-not-found') {
          throw error;
        }

        // User doesn't exist, create new user
        userRecord = await this.auth.createUser({
          email: sanitizedData.email,
          displayName: sanitizedData.displayName,
          emailVerified: false, // Require email verification for new admin users
          disabled: false
        });

        // Set custom claims for role and permissions
        await this.updateUserClaims(userRecord.uid, sanitizedData.role, sanitizedData.permissions);

        const adminUser: AdminUser = {
          uid: userRecord.uid,
          email: sanitizedData.email,
          displayName: sanitizedData.displayName,
          role: sanitizedData.role,
          permissions: sanitizedData.permissions,
          isActive: sanitizedData.isActive,
          createdAt: new Date(),
          createdBy: sanitizedData.createdBy,
          notes: sanitizedData.notes,
          metadata: {
            source: 'manual',
            version: 1
          }
        };

        // Store user data in Firestore
        await this.firestore.collection('users').doc(userRecord.uid).set({
          ...adminUser,
          createdAt: adminUser.createdAt
        });

        // Send password reset email to set up the account
        await this.auth.generatePasswordResetLink(sanitizedData.email);

        await this.logAuditEvent({
          userId: sanitizedData.createdBy || 'system',
          action: 'create_user',
          targetUserId: userRecord.uid,
          details: { email: sanitizedData.email, role: sanitizedData.role, newUser: true },
          environment: process.env.NODE_ENV as any
        });

        return {
          success: true,
          user: adminUser,
          requiresAction: 'invitation_sent'
        };
      }

    } catch (error: any) {
      console.error('Error creating admin user:', error);
      
      // Log security event for failed attempts
      await this.logAuditEvent({
        userId: userData.createdBy || 'unknown',
        action: 'create_user',
        details: { 
          email: userData.email, 
          error: error.message,
          failed: true 
        },
        environment: process.env.NODE_ENV as any
      });

      return {
        success: false,
        error: `Failed to create admin user: ${error.message}`
      };
    }
  }

  /**
   * Update user custom claims with role and permissions
   */
  private async updateUserClaims(uid: string, role: UserRole, permissions: Permission[]): Promise<void> {
    const customClaims = {
      role,
      permissions,
      isAdmin: role === UserRole.ADMIN,
      updated_at: new Date().toISOString()
    };

    await this.auth.setCustomUserClaims(uid, customClaims);
  }

  /**
   * Get admin user by UID
   */
  async getAdminUser(uid: string): Promise<AdminUser | null> {
    try {
      const userDoc = await this.firestore.collection('users').doc(uid).get();
      
      if (!userDoc.exists) {
        return null;
      }

      const data = userDoc.data();
      if (!data) return null;
      
      return {
        uid: userDoc.id,
        email: data.email,
        displayName: data.displayName,
        role: data.role,
        permissions: data.permissions || [],
        isActive: data.isActive ?? true,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate(),
        lastLoginAt: data.lastLoginAt?.toDate(),
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
        notes: data.notes,
        metadata: data.metadata
      };

    } catch (error: any) {
      console.error(`Error getting admin user ${uid}:`, error);
      throw new Error(`Failed to get admin user: ${error.message}`);
    }
  }

  /**
   * List all admin users with pagination
   */
  async listAdminUsers(
    limit: number = 50,
    nextPageToken?: string,
    filters?: {
      role?: UserRole;
      isActive?: boolean;
      search?: string;
    }
  ): Promise<AdminUserListResult> {
    try {
      let query = this.firestore
        .collection('users')
        .where('role', 'in', [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER]);

      // Apply filters
      if (filters?.role) {
        query = query.where('role', '==', filters.role);
      }

      if (filters?.isActive !== undefined) {
        query = query.where('isActive', '==', filters.isActive);
      }

      if (filters?.search) {
        // Note: Firestore doesn't support full-text search, this is a basic implementation
        query = query.where('displayName', '>=', filters.search)
                    .where('displayName', '<=', filters.search + '\uf8ff');
      }

      // Apply pagination
      if (nextPageToken) {
        query = query.startAfter(nextPageToken);
      }

      query = query.orderBy('createdAt', 'desc').limit(limit);

      const snapshot = await query.get();
      
      const users: AdminUser[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        users.push({
          uid: doc.id,
          email: data.email,
          displayName: data.displayName,
          role: data.role,
          permissions: data.permissions || [],
          isActive: data.isActive ?? true,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate(),
          lastLoginAt: data.lastLoginAt?.toDate(),
          createdBy: data.createdBy,
          updatedBy: data.updatedBy,
          notes: data.notes,
          metadata: data.metadata
        });
      });

      // Get total count (this is inefficient for large datasets, consider using a counter collection)
      const countSnapshot = await this.firestore
        .collection('users')
        .where('role', 'in', [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER])
        .count()
        .get();

      return {
        users,
        totalCount: countSnapshot.data().count,
        hasMore: users.length === limit,
        nextPageToken: snapshot.docs[snapshot.docs.length - 1]?.id
      };

    } catch (error: any) {
      console.error('Error listing admin users:', error);
      throw new Error(`Failed to list admin users: ${error.message}`);
    }
  }

  /**
   * Update admin user
   */
  async updateAdminUser(
    uid: string, 
    updates: Partial<AdminUser>,
    updatedBy: string
  ): Promise<AdminUser> {
    try {
      const existingUser = await this.getAdminUser(uid);
      if (!existingUser) {
        throw new Error('Admin user not found');
      }

      // Validate update data
      const validatedUpdates = createAdminUserSchema.partial().parse(updates);

      // Prepare update data
      const updateData = {
        ...validatedUpdates,
        updatedAt: new Date(),
        updatedBy: sanitizeString(updatedBy)
      };

      // Update Firestore document
      await this.firestore.collection('users').doc(uid).update(updateData);

      // Update custom claims if role or permissions changed
      if (validatedUpdates.role || validatedUpdates.permissions) {
        const newRole = validatedUpdates.role || existingUser.role;
        const newPermissions = validatedUpdates.permissions || existingUser.permissions;
        
        await this.updateUserClaims(uid, newRole, newPermissions);
      }

      // Get updated user
      const updatedUser = await this.getAdminUser(uid);
      if (!updatedUser) {
        throw new Error('Failed to retrieve updated user');
      }

      // Log audit event
      await this.logAuditEvent({
        userId: updatedBy,
        action: 'update_user',
        targetUserId: uid,
        details: { 
          changes: validatedUpdates,
          previousRole: existingUser.role,
          newRole: updatedUser.role
        },
        environment: process.env.NODE_ENV as any
      });

      return updatedUser;

    } catch (error: any) {
      console.error(`Error updating admin user ${uid}:`, error);
      throw new Error(`Failed to update admin user: ${error.message}`);
    }
  }

  /**
   * Delete admin user
   */
  async deleteAdminUser(uid: string, deletedBy: string): Promise<void> {
    try {
      const existingUser = await this.getAdminUser(uid);
      if (!existingUser) {
        throw new Error('Admin user not found');
      }

      // Prevent self-deletion
      if (uid === deletedBy) {
        throw new Error('Cannot delete your own account');
      }

      // Delete from Firestore
      await this.firestore.collection('users').doc(uid).delete();

      // Delete from Firebase Auth (optional - you might want to keep the auth record)
      // await this.auth.deleteUser(uid);

      // Log audit event
      await this.logAuditEvent({
        userId: deletedBy,
        action: 'delete_user',
        targetUserId: uid,
        details: { 
          email: existingUser.email,
          role: existingUser.role 
        },
        environment: process.env.NODE_ENV as any
      });

    } catch (error: any) {
      console.error(`Error deleting admin user ${uid}:`, error);
      throw new Error(`Failed to delete admin user: ${error.message}`);
    }
  }

  /**
   * Enable/disable admin user
   */
  async toggleAdminUserStatus(
    uid: string, 
    isActive: boolean, 
    updatedBy: string
  ): Promise<AdminUser> {
    try {
      const existingUser = await this.getAdminUser(uid);
      if (!existingUser) {
        throw new Error('Admin user not found');
      }

      // Update in Firestore
      await this.firestore.collection('users').doc(uid).update({
        isActive,
        updatedAt: new Date(),
        updatedBy
      });

      // Update Firebase Auth disabled status
      await this.auth.updateUser(uid, { disabled: !isActive });

      // Get updated user
      const updatedUser = await this.getAdminUser(uid);
      if (!updatedUser) {
        throw new Error('Failed to retrieve updated user');
      }

      // Log audit event
      await this.logAuditEvent({
        userId: updatedBy,
        action: isActive ? 'enable_user' : 'disable_user',
        targetUserId: uid,
        details: { 
          email: existingUser.email,
          previousStatus: existingUser.isActive,
          newStatus: isActive
        },
        environment: process.env.NODE_ENV as any
      });

      return updatedUser;

    } catch (error: any) {
      console.error(`Error toggling admin user status ${uid}:`, error);
      throw new Error(`Failed to toggle admin user status: ${error.message}`);
    }
  }

  /**
   * Batch operations for admin users
   */
  async batchAdminOperations(
    operations: BatchAdminOperation[],
    operatedBy: string
  ): Promise<BatchOperationResult> {
    const results: BatchOperationResult['results'] = [];
    const errors: BatchOperationResult['errors'] = [];

    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i];

      try {
        let result: any = { index: i, success: false };

        switch (operation.type) {
          case 'create':
            if (operation.email) {
              const createResult = await this.createAdminUser({
                email: operation.email,
                displayName: operation.userData?.displayName || operation.email.split('@')[0],
                role: operation.userData?.role || UserRole.ADMIN,
                permissions: operation.userData?.permissions || DEFAULT_ADMIN_PERMISSIONS,
                createdBy: operatedBy
              });
              
              result.success = createResult.success;
              result.userId = createResult.user?.uid;
            }
            break;

          case 'update':
            if (operation.userId && operation.userData) {
              const updatedUser = await this.updateAdminUser(
                operation.userId, 
                operation.userData, 
                operatedBy
              );
              result.success = true;
              result.userId = updatedUser.uid;
            }
            break;

          case 'delete':
            if (operation.userId) {
              await this.deleteAdminUser(operation.userId, operatedBy);
              result.success = true;
              result.userId = operation.userId;
            }
            break;

          case 'enable':
            if (operation.userId) {
              await this.toggleAdminUserStatus(operation.userId, true, operatedBy);
              result.success = true;
              result.userId = operation.userId;
            }
            break;

          case 'disable':
            if (operation.userId) {
              await this.toggleAdminUserStatus(operation.userId, false, operatedBy);
              result.success = true;
              result.userId = operation.userId;
            }
            break;
        }

        results.push(result);

      } catch (error: any) {
        errors.push({
          index: i,
          error: error.message,
          userId: operation.userId,
          email: operation.email
        });
      }
    }

    return {
      success: errors.length === 0,
      processed: operations.length,
      failed: errors.length,
      errors,
      results
    };
  }

  /**
   * Log audit events
   */
  private async logAuditEvent(event: Omit<AdminAuditLog, 'id' | 'timestamp'>): Promise<void> {
    try {
      const auditLog: AdminAuditLog = {
        ...event,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date()
      };

      await this.firestore.collection('admin_audit_logs').add(auditLog);

    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw error for audit logging failures
    }
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(uid: string): Promise<void> {
    try {
      await this.firestore.collection('users').doc(uid).update({
        lastLoginAt: new Date()
      });

      await this.logAuditEvent({
        userId: uid,
        action: 'login',
        details: { timestamp: new Date() },
        environment: process.env.NODE_ENV as any
      });

    } catch (error) {
      console.error('Failed to update last login:', error);
    }
  }
}

// Export singleton instance
export const adminUserService = AdminUserService.getInstance();