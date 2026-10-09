import 'server-only';

import { cookies } from 'next/headers';
import {
  createAvailabilitySessionToken,
  getAvailabilityAuthConfig,
  getAvailabilityLogoutCookieOptions,
  getAvailabilitySessionCookieOptions,
  SESSION_COOKIE,
  verifyAvailabilitySessionToken,
} from './availability';
import type { AvailabilitySession } from './availability';

export * from './availability';

export async function getAvailabilitySession(): Promise<AvailabilitySession | null> {
  const config = getAvailabilityAuthConfig();
  const cookieStore = await cookies();
  const session = verifyAvailabilitySessionToken(cookieStore.get(SESSION_COOKIE)?.value, config.sessionSecret);
  if (!session || session.subject !== config.username) return null;
  return session;
}

export async function setAvailabilitySessionCookie(subject: string): Promise<void> {
  const config = getAvailabilityAuthConfig();
  const issuedAt = Math.floor(Date.now() / 1000);
  const token = createAvailabilitySessionToken(subject, config.sessionSecret, issuedAt);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, getAvailabilitySessionCookieOptions(issuedAt));
}

export async function clearAvailabilitySessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, '', getAvailabilityLogoutCookieOptions());
}
