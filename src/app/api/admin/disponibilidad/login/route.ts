import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getAvailabilityAuthConfig,
  setAvailabilitySessionCookie,
  verifyAvailabilityCredentials,
} from '@/lib/auth/availability-server';
import {
  availabilityLoginRateLimiter,
  getPrivacySafeLoginIdentifier,
} from '@/lib/auth/availability-rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  username: z.string().trim().min(1).max(100),
  password: z.string().min(1).max(256),
});

const genericInvalidCredentials = 'Usuario o contraseña inválidos.';

function jsonResponse(body: unknown, status: number, headers?: HeadersInit): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers,
    },
  });
}

export async function POST(request: Request) {
  let config;
  try {
    config = getAvailabilityAuthConfig();
  } catch {
    return jsonResponse({ error: 'La autenticación no está configurada.' }, 500);
  }

  const identifier = getPrivacySafeLoginIdentifier(request, config.sessionSecret);
  const rateLimit = availabilityLoginRateLimiter.consume(identifier);
  if (!rateLimit.allowed) {
    return jsonResponse(
      { error: 'Demasiados intentos. Intentá nuevamente más tarde.' },
      429,
      {
        'Retry-After': String(rateLimit.retryAfterSeconds),
        'X-RateLimit-Reset': String(Math.floor(Date.now() / 1000) + rateLimit.retryAfterSeconds),
      },
    );
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return jsonResponse({ error: genericInvalidCredentials }, 401);
  }

  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return jsonResponse({ error: genericInvalidCredentials }, 401);

  let valid = false;
  try {
    valid = await verifyAvailabilityCredentials(parsed.data.username, parsed.data.password);
  } catch {
    return jsonResponse({ error: 'La autenticación no está configurada.' }, 500);
  }

  if (!valid) return jsonResponse({ error: genericInvalidCredentials }, 401);

  availabilityLoginRateLimiter.reset(identifier);
  await setAvailabilitySessionCookie(config.username);
  return jsonResponse({ ok: true }, 200);
}
