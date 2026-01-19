import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders, addSecurityHeaders } from '@/lib/security-production';

// Middleware for security headers
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add security headers to all responses
  addSecurityHeaders(response);
  
  // Custom security rules
  const url = request.nextUrl.pathname;
  
  // Protect admin routes
  if (url.startsWith('/admin') || url.startsWith('/api/admin')) {
    // Add admin-specific security headers
    response.headers.set('X-Admin-Route', 'true');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
  }
  
  // Protect API routes
  if (url.startsWith('/api/')) {
    // Remove information leakage
    response.headers.delete('x-powered-by');
    response.headers.set('Server', 'GoAventura API');
    
    // API-specific CSP
    response.headers.set('Content-Security-Policy', "default-src 'none'; connect-src 'self'");
  }
  
  // Rate limiting headers
  response.headers.set('X-RateLimit-Limit', '100');
  response.headers.set('X-RateLimit-Window', '15m');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};