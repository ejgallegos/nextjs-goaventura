import { z } from 'zod';
import DOMPurify from 'dompurify';

const crypto = require('crypto');

// Security validation schemas
export const emailSchema = z.string().email('Email inválido').max(254);
export const nameSchema = z.string().min(2, 'Mínimo 2 caracteres').max(100).regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/, 'Solo se permiten letras y espacios');
export const phoneSchema = z.string().regex(/^\+?[0-9\s\-\(\)]+$/, 'Formato de teléfono inválido');
export const messageSchema = z.string().min(10, 'Mínimo 10 caracteres').max(2000);
export const passwordSchema = z.string()
  .min(8, 'Mínimo 8 caracteres')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
         'Debe incluir mayúscula, minúscula, número y caracter especial');
export const urlSchema = z.string().url('URL inválida').max(2048);
export const slugSchema = z.string().regex(/^[a-z0-9-]+$/, 'Solo se permiten minúsculas, números y guiones').max(100);

// Sanitization functions
export const sanitizeString = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });
};

export const sanitizeHTML = (html: string, options?: {
  allowedTags?: string[];
  allowedAttributes?: string[];
}): string => {
  if (!html || typeof html !== 'string') return '';
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: options?.allowedTags || ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: options?.allowedAttributes || ['href', 'title', 'alt', 'class', 'id'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur'],
    ALLOW_DATA_ATTR: false,
    KEEP_CONTENT: true
  });
};

// SQL injection prevention for database queries
export const sanitizeSQLParam = (param: string): string => {
  if (!param || typeof param !== 'string') return '';
  
  // Remove dangerous characters and SQL keywords
  return param
    .replace(/['"\\;]/g, '')
    .replace(/\b(DROP|DELETE|INSERT|UPDATE|CREATE|ALTER|EXEC|UNION|SELECT|WHERE|OR|AND)\b/gi, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .trim();
};

// NoSQL injection prevention for MongoDB
export const sanitizeNoSQLParam = (param: any): any => {
  if (param && typeof param === 'object') {
    // Remove MongoDB operators
    const dangerousKeys = ['$where', '$ne', '$in', '$nin', '$gt', '$gte', '$lt', '$lte', '$regex', '$expr'];
    const sanitized: any = {};
    
    for (const [key, value] of Object.entries(param)) {
      if (!dangerousKeys.includes(key)) {
        sanitized[key] = sanitizeNoSQLParam(value);
      }
    }
    return sanitized;
  }
  
  if (typeof param === 'string') {
    return param.replace(/\$/g, '');
  }
  
  return param;
};

// File upload validation
export const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const allowedDocumentTypes = ['application/pdf', 'text/plain'];
export const allowedFileTypes = [...allowedImageTypes, ...allowedDocumentTypes];
export const maxFileSize = 5 * 1024 * 1024; // 5MB
export const maxImageSize = 2 * 1024 * 1024; // 2MB for images

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  metadata?: {
    size: number;
    type: string;
    name: string;
  };
}

export const validateFile = (file: File, options?: {
  maxSize?: number;
  allowedTypes?: string[];
}): FileValidationResult => {
  const maxSize = options?.maxSize || maxFileSize;
  const allowed = options?.allowedTypes || allowedFileTypes;
  
  const metadata = {
    size: file.size,
    type: file.type,
    name: file.name
  };

  // Check file type
  if (!allowed.includes(file.type)) {
    return { 
      valid: false, 
      error: `Tipo de archivo no permitido. Se permiten: ${allowed.join(', ')}`,
      metadata
    };
  }
  
  // Check file size
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `El archivo excede el tamaño máximo de ${Math.round(maxSize / 1024 / 1024)}MB`,
      metadata
    };
  }

  // Additional image validation
  if (allowedImageTypes.includes(file.type)) {
    // Check image dimensions asynchronously if needed
    if (file.size > maxImageSize) {
      return { 
        valid: false, 
        error: `Las imágenes no pueden exceder ${Math.round(maxImageSize / 1024 / 1024)}MB`,
        metadata
      };
    }
  }
  
  return { valid: true, metadata };
};

// Rate limiting utilities
export const createRateLimitKey = (identifier: string, action: string): string => {
  const cleanIdentifier = sanitizeString(identifier);
  const cleanAction = sanitizeString(action);
  return `rate_limit:${cleanAction}:${cleanIdentifier}`;
};

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

// CSRF protection utilities
export const generateCSRFToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  return token && sessionToken && crypto.timingSafeEqual(
    Buffer.from(token, 'hex'),
    Buffer.from(sessionToken, 'hex')
  );
};

// Password utilities
export const hashPassword = async (password: string): Promise<string> => {
  const bcrypt = require('bcryptjs');
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(password, hash);
};

// JWT utilities
export const generateSecureToken = (payload: any, expiresIn: string = '1h'): string => {
  const jwt = require('jsonwebtoken');
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
};

export const verifySecureToken = (token: string): any => {
  const jwt = require('jsonwebtoken');
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

// Security headers for API responses
export const getSecurityHeaders = (options?: {
  contentType?: string;
  maxAge?: number;
}): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': options?.contentType || 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    };
    
    if (options?.maxAge) {
      headers['Strict-Transport-Security'] = `max-age=${options.maxAge}`;
    }
    
    return headers;
};

// Input validation and sanitization
export const sanitizeUserInput = (input: any, options?: {
  allowHTML?: boolean;
  allowedTags?: string[];
  maxDepth?: number;
}): any => {
  const maxDepth = options?.maxDepth || 5;
  
  const sanitizeRecursive = (data: any, depth: number = 0): any => {
    if (depth > maxDepth) {
      throw new Error('Maximum nesting depth exceeded');
    }
    
    if (typeof data === 'string') {
      return options?.allowHTML 
        ? sanitizeHTML(data, { allowedTags: options?.allowedTags })
        : sanitizeString(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => sanitizeRecursive(item, depth + 1));
    }
    
    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        const cleanKey = sanitizeString(key);
        sanitized[cleanKey] = sanitizeRecursive(value, depth + 1);
      }
      return sanitized;
    }
    
    return data;
  };
  
  try {
    return sanitizeRecursive(input);
  } catch (error) {
    console.error('Error sanitizing input:', error);
    return null;
  }
};

// Form validation schemas
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(5, 'Mínimo 5 caracteres').max(200),
  message: messageSchema,
  recaptchaToken: z.string().min(1, 'Verificación reCAPTCHA requerida'),
  consent: z.boolean().refine((val: boolean) => val === true, 'Debe aceptar los términos y condiciones')
});

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  remember: z.boolean().optional()
});

export const registerFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  recaptchaToken: z.string().min(1, 'Verificación reCAPTCHA requerida'),
  consent: z.boolean().refine((val: boolean) => val === true, 'Debe aceptar los términos y condiciones')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

export const blogPostSchema = z.object({
  title: z.string().min(3, 'Mínimo 3 caracteres').max(200),
  slug: slugSchema.optional(),
  content: z.string().min(50, 'Mínimo 50 caracteres'),
  excerpt: z.string().min(10, 'Mínimo 10 caracteres').max(500),
  author: nameSchema,
  status: z.enum(['draft', 'published', 'archived']),
  tags: z.array(z.string().min(1).max(50)).optional(),
  imageUrl: urlSchema.optional(),
  seoTitle: z.string().max(60).optional(),
  seoDescription: z.string().max(160).optional()
});

// Security event logging
export interface SecurityEvent {
  type: 'auth_failure' | 'csrf_attempt' | 'xss_attempt' | 'sql_injection_attempt' | 'rate_limit_exceeded' | 'file_upload_blocked' | 'unauthorized_access';
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip?: string;
  userAgent?: string;
  details: Record<string, any>;
  timestamp: Date;
}

export const logSecurityEvent = (event: Omit<SecurityEvent, 'timestamp'>): void => {
  const securityEvent: SecurityEvent = {
    ...event,
    timestamp: new Date()
  };
  
  // Log to console in development, external service in production
  if (process.env.NODE_ENV === 'development') {
    console.warn('[SECURITY EVENT]', securityEvent);
  } else {
    // TODO: Send to security monitoring service
    // Example: Sentry, Datadog, custom webhook
    console.error('[SECURITY EVENT]', JSON.stringify(securityEvent));
  }
};

// IP and location utilities
export const getClientIP = (request: Request): string => {
  return request.headers.get('x-forwarded-for')?.split(',')[0] ||
         request.headers.get('x-real-ip') ||
         'unknown';
};

export const isSuspiciousIP = (ip: string): boolean => {
  // Basic suspicious IP detection
  if (ip === 'unknown') return true;
  
  // Check for private IPs that shouldn't access public APIs
  const privateRanges = [
    /^10\./,
    /^172\.(1[6-9]|2\d|3[0-1])\./,
    /^192\.168\./,
    /^127\./,
    /^169\.254\./,
    /^::1$/,
    /^fc00:/,
    /^fe80:/
  ];
  
  return privateRanges.some(range => range.test(ip));
};

// Content Security Policy generator
export const generateCSP = (options?: {
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  connectSrc?: string[];
  fontSrc?: string[];
  mediaSrc?: string[];
  objectSrc?: string[];
  childSrc?: string[];
  frameSrc?: string[];
  workerSrc?: string[];
  manifestSrc?: string[];
  upgradeInsecureRequests?: boolean;
}): string => {
  const directives: string[] = [];
  
  directives.push(`default-src 'self'`);
  
  const addDirective = (name: string, values?: string[]) => {
    if (values && values.length > 0) {
      directives.push(`${name} 'self' ${values.join(' ')}`);
    } else {
      directives.push(`${name} 'self'`);
    }
  };
  
  addDirective('script-src', options?.scriptSrc);
  addDirective('style-src', options?.styleSrc);
  addDirective('img-src', options?.imgSrc);
  addDirective('connect-src', options?.connectSrc);
  addDirective('font-src', options?.fontSrc);
  addDirective('media-src', options?.mediaSrc);
  directives.push(`object-src 'none'`);
  addDirective('child-src', options?.childSrc);
  addDirective('frame-src', options?.frameSrc);
  addDirective('worker-src', options?.workerSrc);
  addDirective('manifest-src', options?.manifestSrc);
  
  if (options?.upgradeInsecureRequests !== false) {
    directives.push('upgrade-insecure-requests');
  }
  
  directives.push("base-uri 'self'");
  directives.push("form-action 'self'");
  directives.push("frame-ancestors 'none'");
  
  return directives.join('; ');
};