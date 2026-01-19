import { NextRequest, NextResponse } from 'next/server';
import { SECURITY_CONFIG } from '@/lib/config/security-config';
import { SecurityLogger } from '@/lib/monitoring/security-logger';
import { getClientIP } from '@/lib/security';

export class SecurityMiddleware {
  // Rate limiting with Map for development, Redis for production
  private static rateLimitStore = new Map<string, { count: number; resetTime: number }>();

  static async rateLimit(request: NextRequest): Promise<NextResponse | null> {
    const ip = getClientIP(request);
    const now = Date.now();
    const config = SECURITY_CONFIG.rateLimit;

    const entry = this.rateLimitStore.get(ip);
    
    if (!entry || now > entry.resetTime) {
      this.rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return null;
    }

    if (entry.count >= config.maxRequests) {
      await SecurityLogger.log({
        type: 'rate_limit_exceeded',
        severity: 'medium',
        ip,
        userAgent: request.headers.get('user-agent') || undefined,
        details: { count: entry.count, maxRequests: config.maxRequests }
      });

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

  static csrfProtection(request: NextRequest): NextResponse | null {
    const config = SECURITY_CONFIG.csrf;
    
    if (!config.requireToken) return null;

    if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
      const origin = request.headers.get('origin');
      const referer = request.headers.get('referer');
      
      if (request.nextUrl.pathname.startsWith('/api/')) {
        if (!origin && !referer) {
          SecurityLogger.log({
            type: 'csrf_attempt',
            severity: 'high',
            ip: getClientIP(request),
            userAgent: request.headers.get('user-agent') || undefined,
            details: { path: request.nextUrl.pathname, method: request.method }
          }).catch(console.error);

          return new NextResponse(
            JSON.stringify({ error: 'CSRF protection: Origin required' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }

        const checkOrigin = origin || referer;
        if (checkOrigin && !SECURITY_CONFIG.cors.allowedOrigins.some(allowed => checkOrigin!.startsWith(allowed))) {
          return new NextResponse(
            JSON.stringify({ error: 'CSRF protection: Invalid origin' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
    }
    return null;
  }

  static securityHeaders(response: NextResponse): NextResponse {
    const headers: Record<string, string> = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'same-origin',
      'Cross-Origin-Opener-Policy': 'same-origin'
    };

    if (process.env.NODE_ENV === 'production') {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
    }

    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  }

  static corsHandler(request: NextRequest, response: NextResponse): NextResponse {
    if (!request.nextUrl.pathname.startsWith('/api/')) return response;

    const origin = request.headers.get('origin');
    const config = SECURITY_CONFIG.cors;

    if (origin && config.allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', config.allowedMethods.join(', '));
      response.headers.set('Access-Control-Allow-Headers', config.allowedHeaders.join(', '));
      response.headers.set('Access-Control-Allow-Credentials', config.credentials.toString());
      response.headers.set('Access-Control-Max-Age', config.maxAge.toString());
    }

    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }

    return response;
  }
}