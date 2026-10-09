import Link from 'next/link';
import { AvailabilityLoginForm } from './login-form';

export const dynamic = 'force-dynamic';

export default function AvailabilityLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <section className="w-full max-w-md rounded-lg border bg-background p-8 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">Go Aventura</p>
        <h1 className="mt-2 text-3xl font-bold">Disponibilidad</h1>
        <p className="mt-3 text-muted-foreground">Ingresá para administrar la disponibilidad de los alojamientos.</p>
        <div className="mt-8"><AvailabilityLoginForm /></div>
        <Link className="mt-6 inline-block text-sm underline" href="/">Volver al inicio</Link>
      </section>
    </main>
  );
}
