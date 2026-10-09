import 'server-only';

import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const ENCRYPTION_KEY_ENV = 'AVAILABILITY_ICS_ENCRYPTION_KEY';
const PAYLOAD_VERSION = 'v1';
const IV_BYTES = 12;
const AUTH_TAG_BYTES = 16;

function invalidPayload(): Error {
  return new Error('Invalid ICS encryption payload');
}

function decodeBase64(value: string): Buffer {
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) {
    throw invalidPayload();
  }
  return Buffer.from(value, 'base64');
}

function decodeKey(): Buffer {
  const encodedKey = process.env[ENCRYPTION_KEY_ENV];
  if (!encodedKey) throw new Error('ICS encryption is not configured');

  const key = decodeBase64(encodedKey);
  if (key.length !== 32) throw new Error('ICS encryption is not configured');
  return key;
}

function encodeBase64Url(value: Buffer): string {
  return value.toString('base64url');
}

function decodeBase64Url(value: string): Buffer {
  if (!/^[A-Za-z0-9_-]+$/.test(value) || value.length === 0) throw invalidPayload();
  try {
    return Buffer.from(value, 'base64url');
  } catch {
    throw invalidPayload();
  }
}

export function encryptIcsUrl(url: string): string {
  if (typeof url !== 'string' || url.length === 0) throw new Error('Invalid ICS URL');

  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv('aes-256-gcm', decodeKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(url, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [PAYLOAD_VERSION, encodeBase64Url(iv), encodeBase64Url(tag), encodeBase64Url(ciphertext)].join('.');
}

export function decryptIcsUrl(payload: string): string {
  if (typeof payload !== 'string') throw invalidPayload();

  const parts = payload.split('.');
  if (parts.length !== 4 || parts[0] !== PAYLOAD_VERSION) throw invalidPayload();

  const iv = decodeBase64Url(parts[1]);
  const tag = decodeBase64Url(parts[2]);
  const ciphertext = decodeBase64Url(parts[3]);
  if (iv.length !== IV_BYTES || tag.length !== AUTH_TAG_BYTES || ciphertext.length === 0) throw invalidPayload();

  try {
    const decipher = createDecipheriv('aes-256-gcm', decodeKey(), iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return new TextDecoder('utf-8', { fatal: true }).decode(plaintext);
  } catch {
    throw invalidPayload();
  }
}
