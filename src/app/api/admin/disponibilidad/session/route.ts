import { NextResponse } from 'next/server';
import { getAvailabilitySession } from '@/lib/auth/availability-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getAvailabilitySession();
  if (!session) {
    return NextResponse.json(
      { error: 'No autorizado.' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  return NextResponse.json(
    { authenticated: true, expiresAt: session.expiresAt },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
