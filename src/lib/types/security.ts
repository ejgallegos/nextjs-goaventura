export interface SecurityConfig {
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
    algorithm: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
  };
  cors: {
    allowedOrigins: string[];
    allowedMethods: string[];
    allowedHeaders: string[];
    credentials: boolean;
    maxAge: number;
  };
  fileUpload: {
    maxSize: number;
    maxImageSize: number;
    allowedTypes: string[];
    allowedImageTypes: string[];
    uploadDir: string;
  };
  csrf: {
    tokenExpiry: number;
    requireToken: boolean;
  };
  session: {
    secret: string;
    maxAge: number;
    secure: boolean;
    httpOnly: boolean;
    sameSite: 'strict' | 'lax' | 'none';
  };
}

export interface AuthenticatedUser {
  uid: string;
  email: string;
  role: UserRole;
  permissions: Permission[];
}

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

export interface SecurityEvent {
  type: 'auth_failure' | 'csrf_attempt' | 'xss_attempt' | 'sql_injection_attempt' | 'rate_limit_exceeded' | 'file_upload_blocked' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip?: string;
  userAgent?: string;
  details: Record<string, any>;
  timestamp: Date;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  metadata?: {
    size: number;
    type: string;
    name: string;
  };
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
}