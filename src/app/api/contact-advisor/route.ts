import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { contactAdvisorSchema, getSecurityHeaders } from '@/lib/security';
import { WebhookLeadService } from '@/lib/services/lead-service';
import { ADVISOR_WEBHOOK_URL } from '@/lib/constants';
import { trackAsesorClick } from '@/lib/data/statistics';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): { allowed: boolean; error?: string } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 5;

  const entry = rateLimitStore.get(ip);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { allowed: true };
  }

  if (entry.count >= maxRequests) {
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    return { 
      allowed: false, 
      error: 'Has alcanzado el límite de solicitudes. Intenta de nuevo más tarde.' 
    };
  }

  entry.count++;
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Check rate limiting
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.error },
        { 
          status: 429, 
          headers: {
            ...getSecurityHeaders(),
            'Retry-After': '900'
          }
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactAdvisorSchema.parse(body);

    // Submit lead via webhook
    const leadService = new WebhookLeadService(ADVISOR_WEBHOOK_URL);
    await leadService.submit(validatedData);

    // Track statistics server-side
    await trackAsesorClick(
      validatedData.productId,
      validatedData.productName,
      validatedData.productType
    );

    return NextResponse.json(
      { success: true, message: 'Solicitud recibida correctamente' },
      { status: 200, headers: getSecurityHeaders() }
    );

  } catch (error) {
    console.error('Contact advisor error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Error de validación', 
          details: error.errors.map(e => e.message) 
        },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getSecurityHeaders(),
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS?.split(',')[0] || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}
