import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SecurityMiddleware } from '@/lib/middleware/security-middleware';

// Enhanced rate limiting with security logging
const rateLimit = new Map();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // Cleanup every 5 minutes
const MAX_ENTRIES = 10000; // Maximum number of IP entries

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Security headers configuration
const isProduction = process.env.NODE_ENV === 'production';

const securityHeaders = {
  'Content-Security-Policy': [
    "default-src 'self'",
    isProduction 
      ? "script-src 'self' 'nonce-{nonce}' 'strict-dynamic'"
      : "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.google.com https://www.gstatic.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com ws://*.firebaseio.com wss://*.firebaseio.com",
    isProduction ? "frame-src 'none'" : "frame-src 'self' https://www.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; '),
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'https://goaventura.com.ar',
  'https://www.goaventura.com.ar',
  'http://localhost:9002'
];

// Rate limiting middleware with automatic cleanup
function rateLimitMiddleware(request: NextRequest): NextResponse | null {
  const ip = request.headers.get('x-forwarded-for') || 
            request.headers.get('x-real-ip') || 
            'unknown';
  const now = Date.now();
  const windowMs = parseInt(process.env.API_WINDOW_MS || '900000'); // 15 minutes
  const maxRequests = parseInt(process.env.API_RATE_LIMIT || '100');

  // Periodic cleanup to prevent memory growth
  if (now - lastCleanup > CLEANUP_INTERVAL || rateLimit.size > MAX_ENTRIES) {
    for (const [key, value] of rateLimit.entries()) {
      if (now > value.resetTime) {
        rateLimit.delete(key);
      }
    }
    lastCleanup = now;
    // Emergency cleanup if still too many entries
    if (rateLimit.size > MAX_ENTRIES) {
      const entries = Array.from(rateLimit.entries());
      entries.sort((a, b) => a[1].resetTime - b[1].resetTime);
      const toDelete = entries.slice(0, entries.length - MAX_ENTRIES / 2);
      toDelete.forEach(([key]) => rateLimit.delete(key));
    }
  }

  const entry = rateLimit.get(ip) as RateLimitEntry | undefined;
  
  if (!entry || now > entry.resetTime) {
    rateLimit.set(ip, {
      count: 1,
      resetTime: now + windowMs
    });
    return null;
  }

  if (entry.count >= maxRequests) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((entry.resetTime - now) / 1000).toString()
        }
      }
    );
  }

  entry.count++;
  return null;
}

// CSRF protection for API routes
function csrfProtection(request: NextRequest): NextResponse | null {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    // Check for API routes
    if (request.nextUrl.pathname.startsWith('/api/')) {
      if (!origin && !referer) {
        return new NextResponse(
          JSON.stringify({ error: 'CSRF protection: Origin required' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const checkOrigin = origin || referer;
      if (checkOrigin && !allowedOrigins.some(allowed => checkOrigin!.startsWith(allowed))) {
        return new NextResponse(
          JSON.stringify({ error: 'CSRF protection: Invalid origin' }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }
  return null;
}

// Main middleware
export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  try {
    // Apply enhanced rate limiting with security logging
    const rateLimitResponse = await SecurityMiddleware.rateLimit(request);
    if (rateLimitResponse) return rateLimitResponse;

    // Apply enhanced CSRF protection
    const csrfResponse = SecurityMiddleware.csrfProtection(request);
    if (csrfResponse) return csrfResponse;

    // Apply enhanced security headers
    SecurityMiddleware.securityHeaders(response);

    // Apply CORS headers
    SecurityMiddleware.corsHandler(request, response);

    // CSP headers for API routes (stricter for API)
    if (request.nextUrl.pathname.startsWith('/api/')) {
      response.headers.set('Content-Security-Policy', "default-src 'self'; object-src 'none'; frame-ancestors 'none';");
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    '/api/:path*'
  ]
};