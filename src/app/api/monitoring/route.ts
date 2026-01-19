import { NextRequest, NextResponse } from 'next/server';
import { logger, logAuth, logSecurity } from '@/lib/logger';
import { createSecureResponse } from '@/lib/security-production';
import getAdminApp from '@/lib/firebase-admin';

// Performance monitoring middleware
export function withPerformanceMonitoring<T extends any[], R>(
  handler: (req: NextRequest, ...args: T) => Promise<R>,
  operationName: string
) {
  return async (req: NextRequest, ...args: T): Promise<R> => {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substr(2, 9);
    
    // Add request ID to headers for tracking
    const modifiedRequest = new Request(req, {
      headers: new Headers(req.headers)
    });
    modifiedRequest.headers.set('x-request-id', requestId);

    try {
      logger.request(req.method, req.url, undefined, getClientIP(req), req.headers.get('user-agent') || undefined);
      
      const result = await handler(modifiedRequest, ...args);
      
      const duration = Date.now() - startTime;
      logger.performance(operationName, duration, {
        method: req.method,
        url: req.url,
        requestId
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`Performance: ${operationName} failed`, error as Error, {
        duration,
        method: req.method,
        url: req.url,
        requestId
      });

      throw error;
    }
  };
}

// Security monitoring middleware
export function withSecurityMonitoring<T extends any[], R>(
  handler: (req: NextRequest, ...args: T) => Promise<R>,
  resource: string,
  action: string
) {
  return async (req: NextRequest, ...args: T): Promise<R> => {
    const clientIP = getClientIP(req);
    const userAgent = req.headers.get('user-agent') || '';
    
    // Log suspicious patterns
    if (isSuspiciousRequest(req, clientIP, userAgent)) {
      logSecurity.suspiciousActivity({
        url: req.url,
        method: req.method,
        userAgent,
        ip: clientIP,
        resource,
        action
      }, undefined, clientIP);
    }

    try {
      const result = await handler(req, ...args);
      return result;
    } catch (error: any) {
      // Log security-related errors
      if (error.status === 401 || error.status === 403) {
        logSecurity.permissionDenied(
          req.headers.get('x-user-id') || 'anonymous',
          resource,
          action
        );
      }
      
      throw error;
    }
  };
}

// Rate limiting middleware
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) {
  return function<T extends any[], R>(
    handler: (req: NextRequest, ...args: T) => Promise<R>
  ) {
    return async (req: NextRequest, ...args: T): Promise<R> => {
      const clientIP = getClientIP(req);
      const key = `rate-limit:${clientIP}`;
      const now = Date.now();

      // Clean up expired entries
      for (const [ipKey, data] of rateLimitStore.entries()) {
        if (now > data.resetTime) {
          rateLimitStore.delete(ipKey);
        }
      }

      // Check current rate limit
      const current = rateLimitStore.get(key);
      
      if (current && now < current.resetTime) {
        if (current.count >= maxRequests) {
          logger.warn(`Rate limit exceeded for ${clientIP}`, {
            ip: clientIP,
            count: current.count,
            resetTime: new Date(current.resetTime).toISOString()
          });

          return createSecureResponse(
            {
              error: 'Rate limit exceeded',
              resetTime: new Date(current.resetTime).toISOString(),
              retryAfter: Math.ceil((current.resetTime - now) / 1000)
            },
            429
          );
        }

        current.count++;
      } else {
        rateLimitStore.set(key, {
          count: 1,
          resetTime: now + windowMs
        });
      }

      return handler(req, ...args);
    };
  };
}

// Health check endpoint with monitoring
export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();
    
    // Basic health checks
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '2.0.0',
      environment: process.env.NODE_ENV,
      memory: process.memoryUsage(),
      checks: {
        database: await checkDatabaseHealth(),
        firebase: await checkFirebaseHealth(),
        rateLimit: checkRateLimitHealth()
      },
      performance: {
        responseTime: 0,
        logCount: logger.getLogs().length
      }
    };

    health.performance.responseTime = Date.now() - startTime;

    logger.info('Health check completed', health);

    return createSecureResponse(health);
  } catch (error) {
    logger.error('Health check failed', error as Error);
    
    return createSecureResponse({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 503);
  }
}

// Monitoring data endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, limit = 100 } = body;

    let data;
    
    switch (type) {
      case 'logs':
        data = logger.getLogs(body.level, limit);
        break;
      case 'security':
        data = logger.getLogsByTag('security', limit);
        break;
      case 'performance':
        data = logger.getLogsByTag('performance', limit);
        break;
      case 'errors':
        data = logger.getLogs('error', limit);
        break;
      default:
        data = logger.getLogs(undefined, limit);
    }

    return createSecureResponse({
      success: true,
      data,
      summary: {
        totalLogs: logger.getLogs().length,
        errorCount: logger.getLogs('error').length,
        securityEvents: logger.getLogsByTag('security').length,
        performanceEntries: logger.getLogsByTag('performance').length
      }
    });

  } catch (error) {
    logger.error('Failed to get monitoring data', error as Error);
    return createSecureResponse(
      { error: 'Failed to retrieve monitoring data' },
      500
    );
  }
}

// Clear logs endpoint
export async function DELETE(request: NextRequest) {
  try {
    logger.clearLogs();
    
    logger.info('Logs cleared by admin');
    
    return createSecureResponse({
      success: true,
      message: 'Logs cleared successfully'
    });

  } catch (error) {
    logger.error('Failed to clear logs', error as Error);
    return createSecureResponse(
      { error: 'Failed to clear logs' },
      500
    );
  }
}

// Helper functions
function getClientIP(request: NextRequest): string {
  return request.headers.get('x-forwarded-for') ||
         request.headers.get('x-real-ip') ||
         request.ip ||
         'unknown';
}

function isSuspiciousRequest(request: NextRequest, ip: string, userAgent: string): boolean {
  const url = request.url.toLowerCase();
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\.\./,  // Path traversal
    /<script/i,  // XSS attempt
    /union.*select/i,  // SQL injection
    /javascript:/i,  // JavaScript protocol
    /data:.*base64/i  // Data URI
  ];

  // Check URL patterns
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(url)) return true;
  }

  // Check for missing or bot-like user agent
  if (!userAgent || userAgent.length < 10) return true;

  // Check for known bot patterns
  const botPatterns = /bot|crawler|spider|scraper|cURL|wget/i;
  if (botPatterns.test(userAgent)) return true;

  return false;
}

async function checkDatabaseHealth(): Promise<{ status: string; latency?: number }> {
  try {
    const startTime = Date.now();
    const adminApp = getAdminApp();
    await adminApp.firestore().collection('_health').limit(1).get();
    const latency = Date.now() - startTime;
    
    return { status: 'healthy', latency };
  } catch (error) {
    logger.error('Database health check failed', error as Error);
    return { status: 'unhealthy' };
  }
}

async function checkFirebaseHealth(): Promise<{ status: string; latency?: number }> {
  try {
    const startTime = Date.now();
    const adminApp = getAdminApp();
    await adminApp.auth().getUserCount();
    const latency = Date.now() - startTime;
    
    return { status: 'healthy', latency };
  } catch (error) {
    logger.error('Firebase health check failed', error as Error);
    return { status: 'unhealthy' };
  }
}

function checkRateLimitHealth(): { status: string; entries: number } {
  return {
    status: rateLimitStore.size < 10000 ? 'healthy' : 'warning',
    entries: rateLimitStore.size
  };
}