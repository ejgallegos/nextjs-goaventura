import 'server-only';

import { NextResponse } from 'next/server';

import { getAvailabilitySession } from '../auth/availability-server';
import { SourceAdminError } from './source-admin';

const defaultOrigins = ['https://goaventura.com.ar', 'https://www.goaventura.com.ar', 'http://localhost:9002'];

export function apiJson(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function exactOrigin(value: string | null): boolean {
  if (!value) return false;
  try {
    const requested = new URL(value).origin;
    return (process.env.ALLOWED_ORIGINS?.split(',').map((item) => item.trim()).filter(Boolean) ?? defaultOrigins)
      .some((allowed) => new URL(allowed).origin === requested);
  } catch {
    return false;
  }
}

export async function availabilityGuard(request: Request, mutation = false): Promise<NextResponse | null> {
  try {
    if (!(await getAvailabilitySession())) return apiJson({ error: 'UNAUTHORIZED' }, 401);
  } catch {
    return apiJson({ error: 'UNAUTHORIZED' }, 401);
  }
  if (mutation && !exactOrigin(request.headers.get('origin') ?? request.headers.get('referer'))) {
    return apiJson({ error: 'INVALID_ORIGIN' }, 403);
  }
  return null;
}

export function sourceError(error: unknown): NextResponse {
  if (error instanceof SourceAdminError) {
    const status = error.code === 'SOURCE_NOT_FOUND' ? 404 : error.code === 'SOURCE_NOT_CONFIGURED' ? 409 : 400;
    return apiJson({ error: error.code }, status);
  }
  return apiJson({ error: 'REQUEST_FAILED' }, 500);
}

export function invalidInput(): NextResponse {
  return apiJson({ error: 'INVALID_INPUT' }, 400);
}
