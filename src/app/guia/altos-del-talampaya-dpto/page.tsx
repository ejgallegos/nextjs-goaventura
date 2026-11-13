import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Image from 'next/image';
import { Shield } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
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
    <div className="min-h-screen min-h-dvh overflow-x-hidden bg-[#F9F5EB] px-4 py-6 text-[#2D4059] sm:py-10">
      <div className="mx-auto max-w-[480px] space-y-4">
        {/* Cabecera / Tarjeta fotográfica estilo App */}
        <header className="relative min-h-[240px] overflow-hidden rounded-[20px] border border-[#2D4059]/10 bg-[#002B5B] text-center text-white shadow-sm sm:min-h-[260px]">
          <Image
            src={altosDptoGuide.coverImage}
            alt="Altos del Talampaya Dpto"
            fill
            priority
            sizes="(max-width: 640px) 100vw, 480px"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#002B5B]/90 via-[#002B5B]/50 to-transparent" />
          <div className="relative flex min-h-[240px] flex-col justify-end p-5 sm:min-h-[260px] sm:p-7">
            {altosDptoGuide.logo && (
              <div className="mx-auto mb-3 flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white/95 p-2 shadow-lg backdrop-blur-sm">
                <Image
                  src={altosDptoGuide.logo}
                  alt="Logo Altos del Talampaya"
                  width={72}
                  height={72}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <h1 className="font-headline text-xl font-bold uppercase tracking-wide text-white drop-shadow-md sm:text-2xl md:text-3xl">
              {altosDptoGuide.propertyName}
            </h1>
            <div className="mx-auto my-2.5 h-0.5 w-16 rounded-full bg-[#EA5455]" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
              Guía de bienvenida · Villa Unión
            </p>
          </div>
        </header>

        {/* Tarjeta de Acceso con PIN */}
        <main className="rounded-[18px] border border-[#2D4059]/15 bg-white p-5 shadow-xs sm:p-7">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#EA5455]/10 text-[#EA5455]">
              <Shield className="h-4 w-4" aria-hidden="true" />
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#002B5B]">
              Acceso privado
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[#2D4059]/85">
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
            rel="noopener noreferrer"
            className="touch-manipulation inline-flex min-h-[44px] items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#2D4059] hover:text-[#002B5B] transition active:scale-[0.98]"
          >
            <WhatsAppIcon className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
            ¿Dudas con tu clave? Consultá por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
