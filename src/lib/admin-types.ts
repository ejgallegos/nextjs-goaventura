import { z } from 'zod';
import { UserRole, Permission } from '@/lib/auth-rbac';

// Re-export for convenience
export { UserRole, Permission };

// Admin user creation schema
export const createAdminUserSchema = z.object({
  email: z.string().email('Email inválido'),
  displayName: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
  role: z.nativeEnum(UserRole).default(UserRole.ADMIN),
  permissions: z.array(z.nativeEnum(Permission)).optional(),
  isActive: z.boolean().default(true),
  createdBy: z.string().optional(),
  notes: z.string().optional()
});

// Admin user update schema
export const updateAdminUserSchema = z.object({
  displayName: z.string().min(2).max(100).optional(),
  role: z.nativeEnum(UserRole).optional(),
  permissions: z.array(z.nativeEnum(Permission)).optional(),
  isActive: z.boolean().optional(),
  updatedBy: z.string().optional(),
  notes: z.string().optional()
});

// Types for admin user management
export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
  lastLoginAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  notes?: string;
  metadata?: {
    source: 'manual' | 'import' | 'api';
    version: number;
  };
}

export interface CreateAdminUserData {
  email: string;
  displayName: string;
  role?: UserRole;
  permissions?: Permission[];
  isActive?: boolean;
  createdBy?: string;
  notes?: string;
}

export interface AdminUserCreationResult {
  success: boolean;
  user?: AdminUser;
  error?: string;
  requiresAction?: 'user_exists' | 'invitation_sent' | 'manual_setup';
}

export interface AdminUserListResult {
  users: AdminUser[];
  totalCount: number;
  hasMore: boolean;
  nextPageToken?: string;
}

// Default admin permissions
export const DEFAULT_ADMIN_PERMISSIONS: Permission[] = [
  Permission.READ_CONTENT,
  Permission.WRITE_CONTENT,
  Permission.DELETE_CONTENT,
  Permission.MANAGE_USERS,
  Permission.VIEW_ANALYTICS
];

// Role-based default permissions
export const ROLE_DEFAULT_PERMISSIONS = {
  [UserRole.ADMIN]: DEFAULT_ADMIN_PERMISSIONS,
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

// Validation helper functions
export function validateAdminPermissions(permissions: Permission[]): boolean {
  const allPermissions = Object.values(Permission);
  return permissions.every(permission => allPermissions.includes(permission));
}

export function getDefaultPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_DEFAULT_PERMISSIONS[role] || [];
}

// Security validation for admin operations
export function validateEmailDomain(email: string, allowedDomains?: string[]): boolean {
  if (!allowedDomains || allowedDomains.length === 0) {
    return true; // Allow any domain if not restricted
  }
  
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? allowedDomains.includes(domain) : false;
}

// Audit log types
export interface AdminAuditLog {
  id: string;
  userId: string;
  action: 'create_user' | 'update_user' | 'delete_user' | 'disable_user' | 'enable_user' | 'login' | 'logout';
  targetUserId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  environment: 'development' | 'staging' | 'production';
}

// Batch operation types
export interface BatchAdminOperation {
  type: 'create' | 'update' | 'delete' | 'enable' | 'disable';
  userId?: string;
  userData?: Partial<AdminUser>;
  email?: string; // For create operations
}

export interface BatchOperationResult {
  success: boolean;
  processed: number;
  failed: number;
  errors: Array<{
    index: number;
    error: string;
    userId?: string;
    email?: string;
  }>;
  results?: Array<{
    index: number;
    success: boolean;
    userId?: string;
    user?: AdminUser;
  }>;
}