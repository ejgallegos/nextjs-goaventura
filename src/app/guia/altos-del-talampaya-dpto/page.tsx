import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Image from 'next/image';
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
  title: 'Guía privada de estadía',
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
    <main className="min-h-[calc(100vh-5rem)] bg-[#F6F0E2] px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_70px_rgba(29,45,68,0.16)] md:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-64 bg-[#1D2D44] p-8 text-white sm:p-10">
          <Image src={altosDptoGuide.coverImage} alt="Interior de Altos del Talampaya Dpto" fill priority sizes="(min-width: 768px) 55vw, 100vw" className="object-cover opacity-35" />
          <div className="relative flex h-full flex-col justify-end">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#C9DCE8]">Guía de bienvenida</p>
            <h1 className="mt-3 font-headline text-4xl font-black leading-none">Altos del Talampaya Dpto</h1>
            <p className="mt-4 max-w-sm leading-7 text-white/85">Tu información de estadía y una selección para descubrir Villa Unión.</p>
          </div>
        </div>
        <div className="p-7 sm:p-10">
          <h2 className="font-headline text-3xl font-black text-[#1D2D44]">Bienvenido</h2>
          <p className="mt-3 text-sm leading-6 text-[#3E5C76]">Ingresá el PIN que recibiste para acceder a la información privada del departamento.</p>
          <div className="mt-8">
            {isConfigured ? <GuestGuideAccessForm /> : <p role="status" className="rounded-2xl bg-[#EAF2F8] p-4 text-sm leading-6 text-[#1D2D44]">La guía se está preparando para tu estadía. Solicitá asistencia al anfitrión.</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
