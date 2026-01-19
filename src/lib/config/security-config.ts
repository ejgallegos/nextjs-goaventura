import { SecurityConfig } from '@/lib/types/security';

export const SECURITY_CONFIG: SecurityConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    algorithm: 'HS256'
  },
  rateLimit: {
    windowMs: parseInt(process.env.API_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.API_RATE_LIMIT || '100'),
    skipSuccessfulRequests: false,
    skipFailedRequests: false
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
      'https://goaventura.com.ar',
      'https://www.goaventura.com.ar',
      'http://localhost:9002'
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400
  },
  fileUpload: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    maxImageSize: parseInt(process.env.MAX_IMAGE_SIZE || '2097152'), // 2MB
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg', 'image/png', 'image/webp', 'application/pdf'
    ],
    allowedImageTypes: process.env.ALLOWED_IMAGE_TYPES?.split(',') || [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif'
    ],
    uploadDir: process.env.UPLOAD_DIR || 'uploads'
  },
  csrf: {
    tokenExpiry: parseInt(process.env.CSRF_TOKEN_EXPIRY || '3600000'), // 1 hour
    requireToken: process.env.NODE_ENV === 'production'
  },
  session: {
    secret: process.env.NEXTAUTH_SECRET || 'your-session-secret-change-in-production',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000'), // 24 hours
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const
  }
};