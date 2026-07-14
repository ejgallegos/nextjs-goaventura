import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { guestRegistrationSchema, getSecurityHeaders } from '@/lib/security';
import { ADVISOR_WEBHOOK_URL } from '@/lib/constants';
import { getAccommodationBySlug } from '@/lib/data/accommodations';

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
      error: 'Has alcanzado el límite de solicitudes. Intenta de nuevo más tarde.',
    };
  }

  entry.count++;
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for') ||
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
            'Retry-After': '900',
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = guestRegistrationSchema.parse(body);
    const { nombre, telefono, slug } = validatedData;

    // Look up accommodation for productName
    const accommodation = getAccommodationBySlug(slug);
    if (!accommodation) {
      return NextResponse.json(
        { error: 'Alojamiento no encontrado' },
        { status: 404, headers: getSecurityHeaders() }
      );
    }

    // Fire webhook — never block the response
    try {
      await fetch(ADVISOR_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          telefono,
          productId: slug,
          productName: accommodation.name,
          productType: 'accommodation',
          pageUrl: request.url,
          cliente: 'inquilino',
          consent: true,
          source: 'guest_registration',
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (webhookError) {
      console.error('[Guest Registration] Webhook failed:', webhookError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Registro completado correctamente',
      },
      { status: 200, headers: getSecurityHeaders() }
    );
  } catch (error) {
    console.error('[Guest Registration] Error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Error de validación',
          details: error.errors.map((e) => e.message),
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
