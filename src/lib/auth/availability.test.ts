import { describe, expect, it } from 'vitest';
import {
  createAvailabilitySessionToken,
  createSessionSecretForTests,
  getAvailabilityLogoutCookieOptions,
  getAvailabilitySessionCookieOptions,
  SESSION_TTL_SECONDS,
  verifyAvailabilitySessionToken,
} from './availability';
import { createLoginRateLimiter, getPrivacySafeLoginIdentifier } from './availability-rate-limit';

describe('availability authentication boundaries', () => {
  it('accepts a signed eight-hour session and rejects tampering or expiry', () => {
    const secret = createSessionSecretForTests();
    const issuedAt = 1_700_000_000;
    const token = createAvailabilitySessionToken('availability-admin', secret, issuedAt);

    expect(verifyAvailabilitySessionToken(token, secret, issuedAt + 1)?.expiresAt).toBe(
      issuedAt + SESSION_TTL_SECONDS,
    );
    expect(verifyAvailabilitySessionToken(`${token}tampered`, secret, issuedAt + 1)).toBeNull();
    expect(verifyAvailabilitySessionToken(token, secret, issuedAt + SESSION_TTL_SECONDS)).toBeNull();
  });

  it('returns deterministic retry metadata after the login threshold', () => {
    const limiter = createLoginRateLimiter({ maxAttempts: 2, windowMs: 10_000, maxEntries: 2 });
    expect(limiter.consume('hashed-client', 1_000)).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(limiter.consume('hashed-client', 2_000)).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(limiter.consume('hashed-client', 3_000)).toEqual({ allowed: false, retryAfterSeconds: 8 });
    limiter.reset('hashed-client');
    expect(limiter.consume('hashed-client', 3_001)).toEqual({ allowed: true, retryAfterSeconds: 0 });
    expect(limiter.consume('hashed-client', 11_000)).toEqual({ allowed: true, retryAfterSeconds: 0 });
  });

  it('expires stale entries and deterministically bounds memory', () => {
    const limiter = createLoginRateLimiter({ maxAttempts: 2, windowMs: 10_000, maxEntries: 2 });
    limiter.consume('client-a', 1_000);
    limiter.consume('client-b', 2_000);
    limiter.consume('client-c', 3_000);

    expect(limiter.size()).toBe(2);
    expect(limiter.consume('client-a', 4_000)).toEqual({ allowed: true, retryAfterSeconds: 0 });

    const expiryLimiter = createLoginRateLimiter({ maxAttempts: 2, windowMs: 10_000, maxEntries: 3 });
    expiryLimiter.consume('stale-client', 1_000);
    expiryLimiter.consume('active-client', 5_000);
    expect(expiryLimiter.size()).toBe(2);
    expiryLimiter.consume('active-client', 11_000);
    expect(expiryLimiter.size()).toBe(1);
  });

  it('uses only valid trusted X-Real-IP values for the privacy-safe bucket', () => {
    const secret = createSessionSecretForTests();
    const request = (headers: Record<string, string>) => ({ headers: new Headers(headers) });

    const baseline = getPrivacySafeLoginIdentifier(request({ 'x-real-ip': '203.0.113.10', 'user-agent': 'one' }), secret);
    expect(getPrivacySafeLoginIdentifier(request({ 'x-real-ip': '203.0.113.10', 'user-agent': 'two', 'x-forwarded-for': '198.51.100.4' }), secret)).toBe(baseline);
    expect(getPrivacySafeLoginIdentifier(request({ 'x-real-ip': '203.0.113.11', 'user-agent': 'one' }), secret)).not.toBe(baseline);
    expect(getPrivacySafeLoginIdentifier(request({ 'x-real-ip': 'not-an-ip', 'x-forwarded-for': '198.51.100.99', 'user-agent': 'one' }), secret)).toBe(
      getPrivacySafeLoginIdentifier(request({ 'x-real-ip': 'also-invalid', 'x-forwarded-for': '198.51.100.1', 'user-agent': 'other' }), secret),
    );
  });

  it('builds secure production cookie options with the exact session lifetime', () => {
    const issuedAt = 1_700_000_000;
    const options = getAvailabilitySessionCookieOptions(issuedAt, true);

    expect(options).toMatchObject({
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
    });
    expect(options.expires.getTime()).toBe((issuedAt + SESSION_TTL_SECONDS) * 1000);
  });

  it('builds logout options that expire the cookie immediately', () => {
    expect(getAvailabilityLogoutCookieOptions(true)).toMatchObject({
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });
    expect(getAvailabilityLogoutCookieOptions(true).expires.getTime()).toBe(0);
  });
});
