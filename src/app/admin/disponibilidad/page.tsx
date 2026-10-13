import { redirect } from 'next/navigation';
import { getAvailabilitySession } from '@/lib/auth/availability-server';
import { AvailabilityDashboard } from './availability-dashboard';

export const dynamic = 'force-dynamic';

export default async function AvailabilityPage() {
  const session = await getAvailabilitySession();
  if (!session) redirect('/admin/disponibilidad/login');

  return <AvailabilityDashboard />;
}
