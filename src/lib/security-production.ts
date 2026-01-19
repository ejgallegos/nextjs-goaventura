import { NextRequest, NextResponse } from 'next/server';

export function getSecurityHeaders() {
  const headers = new Headers();

  // Basic Security Headers
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // HSTS (HTTPS Only)
  if (process.env.NODE_ENV === 'production') {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // Permissions Policy
  headers.set('Permissions-Policy', 
    'geolocation=(), ' +
    'microphone=(), ' +
    'camera=(), ' +
    'payment=(), ' +
    'usb=(), ' +
    'magnetometer=(), ' +
    'gyroscope=(), ' +
    'accelerometer=(), ' +
    'autoplay=(), ' +
    'encrypted-media=(), ' +
    'fullscreen=(self), ' +
    'picture-in-picture=(self)'
  );

  // Content Security Policy (Production)
  if (process.env.NODE_ENV === 'production') {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com",
      "img-src 'self' data: blob: https: www.googletagmanager.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://firebaseremoteconfig.googleapis.com https://firebasedatabase.googleapis.com https://firebase.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://storage.googleapis.com",
      "frame-src 'self' https://www.google.com https://www.recaptcha.net https://recaptcha.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "manifest-src 'self'",
      "worker-src 'self' blob:",
      "child-src 'self' blob:"
    ].join('; ');
    
    headers.set('Content-Security-Policy', csp);
  }

  // Development CSP (more permissive)
  else {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' ws: wss:",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self' ws: wss: https:",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "manifest-src 'self'",
      "worker-src 'self' blob:",
      "child-src 'self' blob:"
    ].join('; ');
    
    headers.set('Content-Security-Policy', csp);
  }

  // Rate Limiting Headers
  headers.set('X-RateLimit-Limit', '100');
  headers.set('X-RateLimit-Remaining', '99');
  headers.set('X-RateLimit-Reset', new Date(Date.now() + 900000).toISOString());

  // CORS Headers
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:9002'];
  const origin = allowedOrigins.includes('http://localhost:9002') ? '*' : allowedOrigins.join(', ');
  
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  headers.set('Access-Control-Allow-Credentials', 'false');
  headers.set('Access-Control-Max-Age', '86400');

  // Cache Control
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');

  // Server Info
  headers.set('Server', 'GoAventura Secure Server');
  headers.set('X-Powered-By', 'Next.js');

  return headers;
}

export function getPublicSecurityHeaders() {
  const headers = new Headers();

  // Public-facing security headers (less restrictive)
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Public CSP (allows more external resources)
  if (process.env.NODE_ENV === 'production') {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://www.recaptcha.net https://recaptcha.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com",
      "img-src 'self' data: blob: https: *.googleusercontent.com *.gstatic.com www.googletagmanager.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://firebaseremoteconfig.googleapis.com https://firebasedatabase.googleapis.com https://firebase.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://storage.googleapis.com",
      "frame-src 'self' https://www.google.com https://www.recaptcha.net https://recaptcha.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "manifest-src 'self'",
      "worker-src 'self' blob:",
      "child-src 'self' blob:"
    ].join('; ');
    
    headers.set('Content-Security-Policy', csp);
  }

  // Cache Control for static assets
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  return headers;
}

export function addSecurityHeaders(response: NextResponse) {
  const securityHeaders = getSecurityHeaders();
  
  securityHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });
  
  return response;
}

export function createSecureResponse(data: any, status: number = 200, init?: ResponseInit): NextResponse {
  const headers = getSecurityHeaders();
  
  return NextResponse.json(data, {
    status,
    headers,
    ...init
  });
}