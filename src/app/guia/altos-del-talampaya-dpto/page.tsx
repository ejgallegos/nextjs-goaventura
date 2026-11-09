import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { MessageCircle, Shield } from 'lucide-react';
import GuestGuideAccessForm from '@/components/guest-guide-access-form';
import GuestGuideDashboard from '@/components/guest-guide-dashboard';
import {
  getGuestGuidePrivateDetails,
  guestGuideSessionCookie,
  isGuestGuideConfigured,
  isGuestGuideSessionValid,
} from '@/lib/guest-guide-config';
import { altosDptoGuide } from '@/lib/data/guest-guide';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Guía privada de estadía — Altos del Talampaya Dpto',
  description: 'Acceso privado para huéspedes de Altos del Talampaya Dpto.',
  robots: { index: false, follow: false, nocache: true },
  referrer: 'no-referrer',
  openGraph: { images: [] },
  twitter: { images: [] },
};

export default async function AltosDptoGuestGuidePage() {
  const cookieStore = await cookies();
  const hasValidSession = isGuestGuideSessionValid(cookieStore.get(guestGuideSessionCookie)?.value);
  const privateDetails = hasValidSession ? getGuestGuidePrivateDetails() : null;

  if (privateDetails) {
    return <GuestGuideDashboard privateDetails={privateDetails} />;
  }

  const isConfigured = isGuestGuideConfigured();

  return (
    <div className="min-h-screen bg-[#F1EDE4] px-4 py-6 text-[#262622] sm:py-10">
      <div className="mx-auto max-w-[480px] space-y-4">
        {/* Cabecera / Tarjeta fotográfica estilo App */}
        <header className="relative min-h-[220px] overflow-hidden rounded-[20px] border border-black/5 bg-[#1A1A1A] text-center text-white shadow-sm sm:min-h-[240px]">
          <Image
            src={altosDptoGuide.coverImage}
            alt="Altos del Talampaya Dpto"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 480px"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
          <div className="relative flex min-h-[220px] flex-col justify-end p-6 sm:min-h-[240px] sm:p-7">
            <h1 className="font-headline text-2xl font-bold uppercase tracking-wide text-white drop-shadow-md sm:text-3xl">
              {altosDptoGuide.propertyName}
            </h1>
            <div className="mx-auto my-2.5 h-px w-20 bg-white/40" />
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/90">
              Guía de bienvenida · Villa Unión
            </p>
          </div>
        </header>

        {/* Tarjeta de Acceso con PIN */}
        <main className="rounded-[18px] border border-[#E1E1E0] bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#E5FBFC] text-[#2F6F73]">
              <Shield className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#2F6F73]">
              Acceso privado
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#676764]">
            Ingresá la clave de Wi-Fi del departamento provista para tu estadía para consultar llaves, climatización y recomendaciones locales.
          </p>

          <div className="mt-6">
            {isConfigured ? (
              <GuestGuideAccessForm />
            ) : (
              <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
                La guía se está preparando para tu estadía. Por favor, solicitá asistencia al anfitrión.
              </div>
            )}
          </div>
        </main>

        {/* Ayuda o contacto directo */}
        <div className="text-center pt-2">
          <a
            href={`https://wa.me/${altosDptoGuide.contactPhone}?text=${encodeURIComponent(
              'Hola, necesito ayuda para ingresar a la guía de Altos del Talampaya Dpto.'
            )}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#676764] hover:text-[#262622] transition"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#1F9D55]" aria-hidden="true" />
            ¿Dudas con tu clave? Consultá por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
