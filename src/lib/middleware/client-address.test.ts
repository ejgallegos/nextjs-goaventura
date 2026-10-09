import { describe, expect, it } from 'vitest';
import { getTrustedClientAddress } from './client-address';

describe('trusted client address boundary', () => {
  it('accepts a valid X-Real-IP address', () => {
    expect(getTrustedClientAddress(new Headers({ 'x-real-ip': '203.0.113.7' }))).toBe('203.0.113.7');
    expect(getTrustedClientAddress(new Headers({ 'x-real-ip': '2001:db8::7' }))).toBe('2001:db8::7');
  });

  it('uses one stable unknown bucket when the address is missing or malformed', () => {
    expect(getTrustedClientAddress(new Headers())).toBe('unknown');
    expect(getTrustedClientAddress(new Headers({ 'x-real-ip': '999.1.1.1' }))).toBe('unknown');
    expect(getTrustedClientAddress(new Headers({ 'x-forwarded-for': '203.0.113.7' }))).toBe('unknown');
  });

  it('rejects oversized values before they reach middleware state', () => {
    expect(getTrustedClientAddress(new Headers({ 'x-real-ip': '1'.repeat(65) }))).toBe('unknown');
  });
});
