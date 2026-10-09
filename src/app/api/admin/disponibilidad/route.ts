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
    { status: 'authenticated', message: 'El calendario de disponibilidad estará disponible próximamente.' },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
