import { redirect } from 'next/navigation';
import { getAvailabilitySession } from '../../../../lib/auth/availability-server';
import { SourcesAdmin } from './sources-admin';

export const dynamic = 'force-dynamic';

export default async function AvailabilitySourcesPage() {
  const session = await getAvailabilitySession();
  if (!session) redirect('/admin/disponibilidad/login');

  return <SourcesAdmin />;
}
