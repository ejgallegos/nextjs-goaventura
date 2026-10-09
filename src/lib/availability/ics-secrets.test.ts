import { beforeAll, afterAll, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { decryptIcsUrl, encryptIcsUrl } from './ics-secrets';

const encryptionKey = Buffer.alloc(32, 7).toString('base64');
const testUrl = 'https://calendar.example.test/feed.ics';
const originalKey = process.env.AVAILABILITY_ICS_ENCRYPTION_KEY;

describe('ICS secret payloads', () => {
  beforeAll(() => {
    process.env.AVAILABILITY_ICS_ENCRYPTION_KEY = encryptionKey;
  });

  afterAll(() => {
    if (originalKey === undefined) delete process.env.AVAILABILITY_ICS_ENCRYPTION_KEY;
    else process.env.AVAILABILITY_ICS_ENCRYPTION_KEY = originalKey;
  });

  it('round-trips v1 AES-GCM payloads and rejects tamper, version, and key failures', () => {
    const encrypted = encryptIcsUrl(testUrl);
    expect(encrypted.split('.')).toHaveLength(4);
    expect(decryptIcsUrl(encrypted)).toBe(testUrl);

    const [version, iv, tag, ciphertext] = encrypted.split('.');
    const tampered = [version, iv, tag, `${ciphertext.startsWith('A') ? 'B' : 'A'}${ciphertext.slice(1)}`].join('.');
    expect(() => decryptIcsUrl(tampered)).toThrow('Invalid ICS encryption payload');
    try {
      decryptIcsUrl(tampered);
    } catch (error) {
      expect(String(error)).not.toContain(testUrl);
      expect(String(error)).not.toContain(encrypted);
      expect(String(error)).not.toContain(encryptionKey);
    }
    expect(() => decryptIcsUrl(encrypted.replace('v1.', 'v2.'))).toThrow('Invalid ICS encryption payload');

    process.env.AVAILABILITY_ICS_ENCRYPTION_KEY = Buffer.alloc(32, 8).toString('base64');
    expect(() => decryptIcsUrl(encrypted)).toThrow('Invalid ICS encryption payload');
    process.env.AVAILABILITY_ICS_ENCRYPTION_KEY = encryptionKey;
  });
});
