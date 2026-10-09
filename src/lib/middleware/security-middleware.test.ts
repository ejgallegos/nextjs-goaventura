import { afterEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { SECURITY_CONFIG } from '../config/security-config';
import { SecurityMiddleware } from './security-middleware';

describe('CSRF origin boundary', () => {
  const originalRequireToken = SECURITY_CONFIG.csrf.requireToken;

  afterEach(() => {
    SECURITY_CONFIG.csrf.requireToken = originalRequireToken;
  });

  it('accepts an exact configured origin and rejects missing or malformed origins', () => {
    SECURITY_CONFIG.csrf.requireToken = true;
    const allowed = new NextRequest('https://goaventura.com.ar/api/admin/disponibilidad/login', {
      method: 'POST',
      headers: { origin: 'https://goaventura.com.ar' },
    });
    const missing = new NextRequest('https://goaventura.com.ar/api/admin/disponibilidad/login', { method: 'POST' });
    const malformed = new NextRequest('https://goaventura.com.ar/api/admin/disponibilidad/login', {
      method: 'POST',
      headers: { origin: 'not a url' },
    });

    expect(SecurityMiddleware.csrfProtection(allowed)).toBeNull();
    expect(SecurityMiddleware.csrfProtection(missing)?.status).toBe(403);
    expect(SecurityMiddleware.csrfProtection(malformed)?.status).toBe(403);
  });

  it('rejects prefix-lookalike origins rather than using string prefixes', () => {
    SECURITY_CONFIG.csrf.requireToken = true;
    const foreign = new NextRequest('https://goaventura.com.ar/api/admin/disponibilidad/login', {
      method: 'POST',
      headers: { origin: 'https://goaventura.com.ar.evil.example' },
    });

    expect(SecurityMiddleware.csrfProtection(foreign)?.status).toBe(403);
  });
});
