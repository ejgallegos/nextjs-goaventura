import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { compare as compareBcrypt } from 'bcryptjs';
import { z } from 'zod';

const SESSION_COOKIE = 'goaventura_availability_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const PASSWORD_HASH_PATTERN = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
const SESSION_SECRET_MIN_LENGTH = 32;

export interface AvailabilityCookieOptions {
  httpOnly: true;
  secure: boolean;
  sameSite: 'strict';
  path: '/';
  expires: Date;
  maxAge: number;
}

const authConfigSchema = z.object({
  username: z.string().trim().min(1).max(100),
  passwordHash: z.string().regex(PASSWORD_HASH_PATTERN),
  sessionSecret: z.string().min(SESSION_SECRET_MIN_LENGTH),
});

const sessionPayloadSchema = z.object({
  subject: z.string().min(1).max(100),
  issuedAt: z.number().int().positive(),
  expiresAt: z.number().int().positive(),
});

export type AvailabilitySession = z.infer<typeof sessionPayloadSchema>;
export type AvailabilityAuthConfig = z.infer<typeof authConfigSchema>;

export function getAvailabilityAuthConfig(): AvailabilityAuthConfig {
  return authConfigSchema.parse({
    username: process.env.AVAILABILITY_ADMIN_USERNAME,
    passwordHash: process.env.AVAILABILITY_ADMIN_PASSWORD_HASH,
    sessionSecret: process.env.AVAILABILITY_SESSION_SECRET,
  });
}

function encode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function signEncodedPayload(encodedPayload: string, secret: string): string {
  return createHmac('sha256', secret).update(encodedPayload).digest('base64url');
}

function isBase64Url(value: string): boolean {
  return /^[A-Za-z0-9_-]+$/.test(value);
}

export function createAvailabilitySessionToken(
  subject: string,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): string {
  const payload: AvailabilitySession = {
    subject,
    issuedAt: nowSeconds,
    expiresAt: nowSeconds + SESSION_TTL_SECONDS,
  };
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${signEncodedPayload(encodedPayload, secret)}`;
}

export function verifyAvailabilitySessionToken(
  token: string | null | undefined,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): AvailabilitySession | null {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 2 || !isBase64Url(parts[0]) || !isBase64Url(parts[1])) return null;

  const expectedSignature = signEncodedPayload(parts[0], secret);
  const receivedSignature = parts[1];
  const expectedBytes = Buffer.from(expectedSignature, 'utf8');
  const receivedBytes = Buffer.from(receivedSignature, 'utf8');
  if (expectedBytes.length !== receivedBytes.length || !timingSafeEqual(expectedBytes, receivedBytes)) return null;

  let payload: unknown;
  try {
    payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  const parsed = sessionPayloadSchema.safeParse(payload);
  if (!parsed.success) return null;
  if (parsed.data.expiresAt - parsed.data.issuedAt !== SESSION_TTL_SECONDS) return null;
  if (parsed.data.issuedAt > nowSeconds || nowSeconds >= parsed.data.expiresAt) return null;

  return parsed.data;
}

export async function verifyAvailabilityCredentials(username: string, password: string): Promise<boolean> {
  const config = getAvailabilityAuthConfig();
  const passwordMatches = await compareBcrypt(password, config.passwordHash);
  return username.trim() === config.username && passwordMatches;
}

export function getAvailabilitySessionCookieOptions(
  issuedAt: number,
  secure = process.env.NODE_ENV === 'production',
): AvailabilityCookieOptions {
  return {
    httpOnly: true,
    secure,
    sameSite: 'strict',
    path: '/',
    expires: new Date((issuedAt + SESSION_TTL_SECONDS) * 1000),
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function getAvailabilityLogoutCookieOptions(
  secure = process.env.NODE_ENV === 'production',
): AvailabilityCookieOptions {
  return {
    httpOnly: true,
    secure,
    sameSite: 'strict',
    path: '/',
    expires: new Date(0),
    maxAge: 0,
  };
}

export function createSessionSecretForTests(): string {
  return randomBytes(32).toString('base64url');
}

export { SESSION_COOKIE, SESSION_TTL_SECONDS };
