import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SecurityMiddleware } from '@/lib/middleware/security-middleware';

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

    const pathname = request.nextUrl.pathname;
    const isAvailabilityAdminPath =
      pathname === '/admin/disponibilidad' || pathname.startsWith('/admin/disponibilidad/');
    const isLegacyAdminPage = (pathname === '/admin' || pathname.startsWith('/admin/')) && !pathname.startsWith('/api/');
    if (isLegacyAdminPage && !isAvailabilityAdminPath) {
      const redirectResponse = NextResponse.redirect(new URL('/', request.url));
      SecurityMiddleware.securityHeaders(redirectResponse);
      return redirectResponse;
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
