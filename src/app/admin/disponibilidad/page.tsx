import { redirect } from 'next/navigation';
import { getAvailabilitySession } from '@/lib/auth/availability-server';
import { AvailabilityLogoutButton } from './logout-button';

export const dynamic = 'force-dynamic';

export default async function AvailabilityPage() {
  const session = await getAvailabilitySession();
  if (!session) redirect('/admin/disponibilidad/login');

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Módulo interno</p>
            <h1 className="mt-2 text-3xl font-bold">Disponibilidad</h1>
          </div>
          <AvailabilityLogoutButton />
        </div>
        <section className="mt-10 rounded-lg border p-6">
          <h2 className="text-xl font-semibold">Calendario en preparación</h2>
          <p className="mt-2 text-muted-foreground">
            La sincronización y el calendario de alojamientos se incorporarán en la próxima etapa.
          </p>
        </section>
      </div>
    </main>
  );
}
