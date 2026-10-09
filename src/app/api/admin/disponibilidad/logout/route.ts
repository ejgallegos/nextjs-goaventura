import { NextResponse } from 'next/server';
import { clearAvailabilitySessionCookie } from '@/lib/auth/availability-server';

export const runtime = 'nodejs';

export async function POST() {
  await clearAvailabilitySessionCookie();
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
