import 'server-only';

import { createHmac, timingSafeEqual } from 'crypto';
import { comparePassword } from '@/lib/security';

const GUIDE_ID = 'altos-del-talampaya-dpto';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 48;

export const guestGuideSessionCookie = 'go_aventura_guest_guide';

export interface GuestGuidePrivateDetails {
  wifiName: string;
  wifiPassword: string;
  keyBoxCode: string;
}

interface GuestGuideRuntimeConfig {
  pinHash: string;
  pinExpiresAt: Date;
  sessionSecret: string;
  privateDetails: GuestGuidePrivateDetails;
}

function getRequiredEnvironment(name: string): string | null {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

function getRuntimeConfig(): GuestGuideRuntimeConfig | null {
  const pinHash = getRequiredEnvironment('GUEST_GUIDE_ALTOS_DPTO_PIN_HASH');
  const expiresAt = getRequiredEnvironment('GUEST_GUIDE_ALTOS_DPTO_PIN_EXPIRES_AT');
  const sessionSecret = getRequiredEnvironment('GUEST_GUIDE_ALTOS_DPTO_SESSION_SECRET');
  const wifiName = getRequiredEnvironment('GUEST_GUIDE_ALTOS_DPTO_WIFI_NAME');
  const wifiPassword = getRequiredEnvironment('GUEST_GUIDE_ALTOS_DPTO_WIFI_PASSWORD');
  const keyBoxCode = getRequiredEnvironment('GUEST_GUIDE_ALTOS_DPTO_KEYBOX_CODE');

  if (!pinHash || !expiresAt || !sessionSecret || !wifiName || !wifiPassword || !keyBoxCode) {
    return null;
  }

  const pinExpiresAt = new Date(expiresAt);
  if (Number.isNaN(pinExpiresAt.getTime()) || sessionSecret.length < 32) {
    return null;
  }

  return {
    pinHash,
    pinExpiresAt,
    sessionSecret,
    privateDetails: { wifiName, wifiPassword, keyBoxCode },
  };
}

function createSignature(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function isGuestGuideConfigured(): boolean {
  return getRuntimeConfig() !== null;
}

export function isGuestGuidePinActive(): boolean {
  const config = getRuntimeConfig();
  return Boolean(config && config.pinExpiresAt.getTime() > Date.now());
}

export async function verifyGuestGuidePin(pin: string): Promise<boolean> {
  const config = getRuntimeConfig();
  if (!config || config.pinExpiresAt.getTime() <= Date.now()) {
    return false;
  }

  return comparePassword(pin, config.pinHash);
}

export function createGuestGuideSession(): { token: string; expiresAt: Date } | null {
  const config = getRuntimeConfig();
  if (!config || config.pinExpiresAt.getTime() <= Date.now()) {
    return null;
  }

  const expiresAt = new Date(
    Math.min(config.pinExpiresAt.getTime(), Date.now() + SESSION_MAX_AGE_SECONDS * 1000)
  );
  const payload = `${GUIDE_ID}.${expiresAt.getTime()}`;
  const signature = createSignature(payload, config.sessionSecret);

  return { token: `${payload}.${signature}`, expiresAt };
}

export function isGuestGuideSessionValid(token: string | undefined): boolean {
  const config = getRuntimeConfig();
  if (!config || !token) {
    return false;
  }

  const [guideId, expiration, signature, ...rest] = token.split('.');
  const expiresAt = Number(expiration);
  if (
    guideId !== GUIDE_ID ||
    !signature ||
    rest.length > 0 ||
    !Number.isFinite(expiresAt) ||
    expiresAt <= Date.now() ||
    expiresAt > config.pinExpiresAt.getTime()
  ) {
    return false;
  }

  const payload = `${guideId}.${expiration}`;
  const expectedSignature = createSignature(payload, config.sessionSecret);
  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(signature);

  return (
    expectedBuffer.length === receivedBuffer.length &&
    timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export function getGuestGuidePrivateDetails(): GuestGuidePrivateDetails | null {
  return getRuntimeConfig()?.privateDetails ?? null;
}

export function getGuestGuideSessionMaxAge(expiresAt: Date): number {
  return Math.max(1, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
}
