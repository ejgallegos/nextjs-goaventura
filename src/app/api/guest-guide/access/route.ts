import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createGuestGuideSession,
  getGuestGuideSessionMaxAge,
  guestGuideSessionCookie,
  isGuestGuideConfigured,
  isGuestGuidePinActive,
  verifyGuestGuidePin,
} from '@/lib/guest-guide-config';
import { getSecurityHeaders } from '@/lib/security';

const accessSchema = z.object({
  pin: z.string().trim().min(4).max(64),
});

const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function getClientKey(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  current.count += 1;
  return current.count > MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  const clientKey = getClientKey(request);

  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Esperá unos minutos antes de volver a probar.' },
      { status: 429, headers: { ...getSecurityHeaders(), 'Retry-After': '900' } }
    );
  }

  if (!isGuestGuideConfigured()) {
    return NextResponse.json(
      { error: 'La guía todavía no está disponible. Contactá al anfitrión.' },
      { status: 503, headers: getSecurityHeaders() }
    );
  }

  if (!isGuestGuidePinActive()) {
    return NextResponse.json(
      { error: 'El acceso de esta estadía venció. Contactá al anfitrión.' },
      { status: 403, headers: getSecurityHeaders() }
    );
  }

  try {
    const body = accessSchema.parse(await request.json());
    const isValid = await verifyGuestGuidePin(body.pin);

    if (!isValid) {
      return NextResponse.json(
        { error: 'La clave de acceso no es válida. Revisala e intentá nuevamente.' },
        { status: 401, headers: getSecurityHeaders() }
      );
    }

    const session = createGuestGuideSession();
    if (!session) {
      return NextResponse.json(
        { error: 'El acceso de esta estadía venció. Contactá al anfitrión.' },
        { status: 403, headers: getSecurityHeaders() }
      );
    }

    const response = NextResponse.json({ success: true }, { headers: getSecurityHeaders() });
    response.cookies.set({
      name: guestGuideSessionCookie,
      value: session.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/guia/altos-del-talampaya-dpto',
      maxAge: getGuestGuideSessionMaxAge(session.expiresAt),
    });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ingresá la clave de acceso provista para tu estadía.' },
        { status: 400, headers: getSecurityHeaders() }
      );
    }

    console.error('[Guest guide] Access error:', error);
    return NextResponse.json(
      { error: 'No se pudo validar el acceso. Intentá nuevamente.' },
      { status: 500, headers: getSecurityHeaders() }
    );
  }
}
