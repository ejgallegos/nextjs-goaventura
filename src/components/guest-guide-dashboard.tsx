'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  CarFront,
  Check,
  Clock3,
  Coffee,
  Compass,
  Copy,
  ExternalLink,
  Flame,
  KeyRound,
  MapPin,
  MapPinned,
  Phone,
  Printer,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Tv,
  UtensilsCrossed,
  Wifi,
  Wind,
} from 'lucide-react';
import type { GuestGuidePrivateDetails } from '@/lib/guest-guide-config';
import { altosDptoGuide, type GuideRecommendation } from '@/lib/data/guest-guide';

interface GuestGuideDashboardProps {
  privateDetails: GuestGuidePrivateDetails;
}

type TabCategory = 'Todas' | 'Gastronomía' | 'Bodegas' | 'Artesanías' | 'Localidades' | 'Excursiones';

const categoryIcons = {
  Gastronomía: UtensilsCrossed,
  Bodegas: Coffee,
  Artesanías: Sparkles,
  Localidades: MapPinned,
  Excursiones: Compass,
};

export default function GuestGuideDashboard({ privateDetails }: GuestGuideDashboardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TabCategory>('Todas');

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2500);
    } catch {
      // Fallback if clipboard API fails
      setCopiedField(null);
    }
  };

  const whatsappHelpUrl = `https://wa.me/${altosDptoGuide.contactPhone}?text=${encodeURIComponent(
    'Hola, estoy alojado en Altos del Talampaya Dpto y necesito ayuda.'
  )}`;

  const filteredRecommendations =
    selectedCategory === 'Todas'
      ? altosDptoGuide.recommendations
      : altosDptoGuide.recommendations.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F6F0E2] pb-32 text-[#1D2D44]">
      {/* Accesibilidad: salto de navegación */}
      <a
        href="#contenido-guia"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:font-bold focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#3E5C76]"
      >
        Saltar al contenido principal
      </a>

      {/* Hero / Portada */}
      <header className="relative overflow-hidden bg-[#1D2D44] text-white">
        <div className="absolute inset-0 opacity-25">
          <Image
            src={altosDptoGuide.coverImage}
            alt="Departamento Altos del Talampaya en Villa Unión"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-7 sm:px-8 sm:pb-16 sm:pt-10">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C9DCE8] transition hover:text-white focus:outline-none focus:ring-2 focus:ring-[#C9DCE8] focus:ring-offset-2 focus:ring-offset-[#1D2D44]"
            >
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              Go Aventura
            </Link>
            <Link
              href="/guia/altos-del-talampaya-dpto/imprimir"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <Printer className="h-3.5 w-3.5" aria-hidden="true" />
              Lámina QR
            </Link>
          </div>

          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[#C9DCE8]">
            Guía privada del huésped
          </p>
          <h1 className="mt-2 font-headline text-3xl font-black leading-tight sm:text-5xl">
            {altosDptoGuide.propertyName}
          </h1>
          <p className="mt-3 text-sm font-medium text-white/80 sm:text-base">
            {altosDptoGuide.capacity}
          </p>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
            ¡Te damos la bienvenida a Villa Unión! Diseñamos esta guía interactiva para que tengas
            a mano los accesos clave de tu departamento y una cuidada selección local.
          </p>
        </div>
      </header>

      {/* Barra de accesos rápidos horizontales (sticky) */}
      <nav
        aria-label="Accesos rápidos a secciones"
        className="sticky top-0 z-30 border-b border-[#8AA9C4]/30 bg-[#F6F0E2]/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-8">
          {[
            ['Llegada y salida', '#llegada'],
            ['Claves y Wi‑Fi', '#acceso-wifi'],
            ['Equipamiento', '#equipamiento'],
            ['Convivencia', '#reglas'],
            ['Emergencias', '#emergencias'],
            ['Descubrir Villa Unión', '#descubrir'],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="shrink-0 rounded-full border border-transparent bg-white/70 px-3.5 py-1.5 text-xs font-bold text-[#1D2D44] shadow-sm transition hover:border-[#8AA9C4] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#3E5C76]"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      {/* Contenido principal */}
      <main id="contenido-guia" className="mx-auto max-w-3xl space-y-10 px-5 py-8 sm:px-8 sm:py-12">
        {/* Módulo: Claves y Wi-Fi (Privado y prioritario) */}
        <section
          aria-labelledby="acceso-wifi"
          id="acceso-wifi"
          className="scroll-mt-24 rounded-3xl border border-[#C9DCE8] bg-white p-6 shadow-[0_16px_40px_rgba(29,45,68,0.08)] sm:p-8"
        >
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#EAF2F8] text-[#1D2D44]">
              <KeyRound className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#3E5C76]">
              Datos privados de tu estadía
            </span>
          </div>
          <h2 className="mt-2 font-headline text-2xl font-black text-[#1D2D44] sm:text-3xl">
            Acceso autónomo y Wi‑Fi
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#3E5C76]">
            Esta información se encuentra activa exclusivamente para los huéspedes de tu estadía.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {/* Caja de Llaves */}
            <div className="rounded-2xl border border-[#C9DCE8]/80 bg-[#F9FBFC] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1D2D44] px-2.5 py-0.5 text-xs font-bold text-white">
                    <KeyRound className="h-3 w-3" aria-hidden="true" />
                    Caja de llaves
                  </span>
                  <h3 className="mt-2 text-base font-black text-[#1D2D44]">Código de ingreso</h3>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(privateDetails.keyBoxCode, 'keybox')}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-[#1D2D44] shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#3E5C76]"
                  aria-label="Copiar código de la caja de llaves"
                >
                  {copiedField === 'keybox' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
                      <span className="text-green-700">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
              <div className="mt-3">
                <p className="font-mono text-3xl font-black tracking-widest text-[#1D2D44]">
                  {privateDetails.keyBoxCode}
                </p>
                <p className="mt-2 text-xs leading-5 text-[#3E5C76]">
                  {altosDptoGuide.arrival.keyBoxLocation}{' '}
                  <strong className="text-[#1D2D44]">{altosDptoGuide.arrival.keyDescription}</strong>
                </p>
              </div>
            </div>

            {/* Red Wi-Fi */}
            <div className="rounded-2xl border border-[#C9DCE8]/80 bg-[#F9FBFC] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3E5C76] px-2.5 py-0.5 text-xs font-bold text-white">
                    <Wifi className="h-3 w-3" aria-hidden="true" />
                    Internet Wi‑Fi
                  </span>
                  <h3 className="mt-2 text-base font-black text-[#1D2D44]">Red de alta velocidad</h3>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(privateDetails.wifiPassword, 'wifi')}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-[#1D2D44] shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#3E5C76]"
                  aria-label="Copiar contraseña de Wi-Fi"
                >
                  {copiedField === 'wifi' ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
                      <span className="text-green-700">¡Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                      <span>Copiar clave</span>
                    </>
                  )}
                </button>
              </div>
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#3E5C76]">
                  Red: <strong className="font-mono text-sm text-[#1D2D44]">{privateDetails.wifiName}</strong>
                </p>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#3E5C76]">
                  Clave: <strong className="font-mono text-base text-[#1D2D44]">{privateDetails.wifiPassword}</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Módulo: Llegada, check-in, estacionamiento y salida */}
        <section
          aria-labelledby="llegada"
          id="llegada"
          className="scroll-mt-24 rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(29,45,68,0.08)] sm:p-8"
        >
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#3E5C76]">
            Operativa del departamento
          </span>
          <h2 className="mt-2 font-headline text-2xl font-black text-[#1D2D44] sm:text-3xl">
            Llegada y salida
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#EAF2F8] p-4">
              <Clock3 className="h-5 w-5 text-[#3E5C76]" aria-hidden="true" />
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[#3E5C76]">Check-in</p>
              <p className="mt-1 text-base font-black text-[#1D2D44]">{altosDptoGuide.arrival.checkIn}</p>
            </div>
            <div className="rounded-2xl bg-[#EAF2F8] p-4">
              <Clock3 className="h-5 w-5 text-[#3E5C76]" aria-hidden="true" />
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[#3E5C76]">Check-out</p>
              <p className="mt-1 text-base font-black text-[#1D2D44]">{altosDptoGuide.arrival.checkOut}</p>
            </div>
            <div className="rounded-2xl bg-[#EAF2F8] p-4">
              <CarFront className="h-5 w-5 text-[#3E5C76]" aria-hidden="true" />
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[#3E5C76]">Estacionamiento</p>
              <p className="mt-1 text-base font-black text-[#1D2D44]">Cochera cubierta</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#3E5C76]" aria-hidden="true" />
              <div>
                <p className="text-sm font-bold text-[#1D2D44]">{altosDptoGuide.arrival.address}</p>
                <p className="mt-1 text-xs leading-5 text-[#3E5C76]">{altosDptoGuide.arrival.parking}</p>
                <a
                  href={altosDptoGuide.propertyMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-[#1D2D44] underline decoration-[#8AA9C4] underline-offset-4 transition hover:text-[#3E5C76]"
                >
                  Abrir en Google Maps
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Instrucciones de salida */}
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
            <h3 className="text-sm font-bold text-amber-950">
              Instrucciones para el Check-out (hasta las {altosDptoGuide.departure.limitTime})
            </h3>
            <ul className="mt-3 space-y-2 text-xs leading-5 text-amber-900">
              {altosDptoGuide.departure.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-bold text-amber-800">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Módulo: Climatización, Smart TV y Equipamiento */}
        <section
          aria-labelledby="equipamiento"
          id="equipamiento"
          className="scroll-mt-24 space-y-6"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#3E5C76]">
              Confort y uso
            </span>
            <h2 className="mt-2 font-headline text-2xl font-black text-[#1D2D44] sm:text-3xl">
              Equipamiento y climatización
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Piso Radiante */}
            <article className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-orange-50 text-orange-600">
                  <Flame className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="font-bold text-[#1D2D44]">Piso Radiante (Calefacción)</h3>
              </div>
              <p className="mt-1 text-xs text-[#3E5C76]">
                Cajitas blancas junto a la puerta principal y en dormitorio.
              </p>
              <ul className="mt-3 space-y-1.5 text-xs leading-5 text-[#1D2D44]">
                <li>• <strong>ON:</strong> presionar botón de encendido en el panel.</li>
                <li>• <strong>Temperatura:</strong> regular con flechas arriba/abajo.</li>
                <li>• <strong>Set:</strong> presionar para fijar los grados deseados.</li>
                <li>• <strong>Apagado:</strong> apagar al retirarse o al templarse el ambiente.</li>
              </ul>
            </article>

            {/* Aire acondicionado */}
            <article className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky-50 text-sky-600">
                  <Wind className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="font-bold text-[#1D2D44]">Aire Acondicionado</h3>
              </div>
              <p className="mt-1 text-xs text-[#3E5C76]">
                Refrigeración para jornadas cálidas.
              </p>
              <p className="mt-3 text-xs leading-5 text-[#1D2D44]">
                Operalo con el control remoto provisto. <strong>Uso consciente:</strong> por favor apagalo al salir del departamento para cuidar la energía del valle.
              </p>
            </article>

            {/* Smart TV */}
            <article className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50 text-purple-600">
                  <Tv className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="font-bold text-[#1D2D44]">Smart TV · Televisión en vivo</h3>
              </div>
              <p className="mt-1 text-xs text-[#3E5C76]">
                Canales por cable y aplicaciones de streaming.
              </p>
              <p className="mt-3 text-xs leading-5 text-[#1D2D44]">
                Para ver cable en vivo, encendé la pantalla y seleccioná la aplicación <strong>View</strong>. Podés usar tus cuentas de streaming (recordá cerrar sesión antes de partir).
              </p>
            </article>

            {/* Tarifa y medios de pago */}
            <article className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="font-bold text-[#1D2D44]">Tarifa y medios de pago</h3>
              </div>
              <p className="mt-1 text-xs text-[#3E5C76]">
                {altosDptoGuide.payment.currencyDescription}
              </p>
              <div className="mt-3 rounded-xl bg-[#EAF2F8] p-3 text-xs leading-5 text-[#1D2D44]">
                <p>Efectivo o transferencia bancaria:</p>
                <p className="font-bold">Alias: {altosDptoGuide.payment.bankAlias}</p>
                <p className="text-[#3E5C76]">Titular: {altosDptoGuide.payment.accountHolder}</p>
              </div>
            </article>
          </div>
        </section>

        {/* Módulo: Reglas de convivencia */}
        <section
          aria-labelledby="reglas"
          id="reglas"
          className="scroll-mt-24 rounded-3xl border border-[#C9DCE8] bg-[#EAF2F8] p-6 sm:p-8"
        >
          <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#3E5C76]">
            Estadía armónica
          </span>
          <h2 className="mt-2 font-headline text-2xl font-black text-[#1D2D44] sm:text-3xl">
            Normas de convivencia
          </h2>
          <ul className="mt-6 space-y-3">
            {altosDptoGuide.houseRules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-3 rounded-2xl bg-white/80 p-4 text-xs leading-5 text-[#1D2D44]">
                <span className="mt-0.5 text-base">🌿</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Módulo: Emergencias y Servicios Útiles */}
        <section
          aria-labelledby="emergencias"
          id="emergencias"
          className="scroll-mt-24 rounded-3xl bg-[#1D2D44] p-6 text-white shadow-xl sm:p-8"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#C9DCE8]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9DCE8]">
              Seguridad y asistencia
            </span>
          </div>
          <h2 className="mt-2 font-headline text-2xl font-black sm:text-3xl">
            Emergencias y servicios útiles
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-white/80">
            {altosDptoGuide.emergencies.firstAidKitLocation}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {altosDptoGuide.emergencies.contacts.map((contact) => (
              <div
                key={contact.label}
                className="flex items-center justify-between rounded-2xl bg-white/10 p-4 backdrop-blur transition hover:bg-white/15"
              >
                <div>
                  <p className="text-xs font-bold text-white">{contact.label}</p>
                  <p className="mt-0.5 text-[11px] text-white/70">{contact.note}</p>
                </div>
                <a
                  href={`tel:${contact.number.replace(/\s+/g, '')}`}
                  className="shrink-0 rounded-xl bg-white px-3 py-1.5 text-xs font-black text-[#1D2D44] transition hover:bg-[#C9DCE8] focus:outline-none focus:ring-2 focus:ring-white"
                >
                  {contact.number}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#C9DCE8]">
              Farmacias y abastecimiento
            </h3>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {altosDptoGuide.usefulServices.map((service) => (
                <a
                  key={service.label}
                  href={service.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl bg-white/5 p-3.5 transition hover:bg-white/10"
                >
                  <div className="min-w-0 pr-3">
                    <p className="truncate text-xs font-bold text-white group-hover:text-[#C9DCE8]">
                      {service.label}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-white/60">
                      {service.description}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-white/60 group-hover:text-white" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Módulo: Descubrí Villa Unión y alrededores */}
        <section
          aria-labelledby="descubrir"
          id="descubrir"
          className="scroll-mt-24 space-y-6"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#3E5C76]">
              Recomendaciones curadas
            </span>
            <h2 className="mt-2 font-headline text-2xl font-black text-[#1D2D44] sm:text-3xl">
              Descubrí Villa Unión y el Valle del Bermejo
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#3E5C76]">
              Selección confirmada para tu viaje. <em>Aviso importante:</em> horarios, teléfonos y
              condiciones pueden variar según la temporada; sugerimos consultar antes de dirigirte.
            </p>
          </div>

          {/* Filtros por Categoría */}
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Categorías turísticas">
            {(['Todas', 'Gastronomía', 'Bodegas', 'Artesanías', 'Localidades', 'Excursiones'] as TabCategory[]).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition focus:outline-none focus:ring-2 focus:ring-[#3E5C76] ${
                    selectedCategory === cat
                      ? 'bg-[#1D2D44] text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-[#3E5C76] hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Lista de Recomendaciones */}
          <div className="grid gap-3">
            {filteredRecommendations.map((item) => {
              const Icon = categoryIcons[item.category] || MapPinned;
              return (
                <RecommendationCard key={item.label} item={item} icon={<Icon className="h-4 w-4" aria-hidden="true" />} />
              );
            })}
          </div>

          {/* Enlace destacado al Mapa Turístico Completo */}
          <div className="rounded-3xl border border-[#C9DCE8] bg-white p-6 text-center shadow-sm sm:p-8">
            <MapPinned className="mx-auto h-8 w-8 text-[#3E5C76]" aria-hidden="true" />
            <h3 className="mt-3 font-headline text-xl font-black text-[#1D2D44]">
              Mapa turístico interactivo de la región
            </h3>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-[#3E5C76]">
              Accedé a todos los atractivos naturales, bodegas, miradores, rutas y servicios en el mapa de Google oficial del Valle del Bermejo.
            </p>
            <a
              href={altosDptoGuide.touristMapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#1D2D44] px-6 py-3 text-xs font-bold text-white shadow-lg shadow-[#1D2D44]/15 transition hover:bg-[#3E5C76] focus:outline-none focus:ring-4 focus:ring-[#C9DCE8]"
            >
              <MapPinned className="h-4 w-4" aria-hidden="true" />
              Abrir Mapa Turístico Completo
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>

      {/* Botón flotante persistente de WhatsApp */}
      <aside aria-label="Asistencia al huésped">
        <a
          href={whatsappHelpUrl}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-5 left-1/2 z-40 flex min-h-14 w-[calc(100%-2.5rem)] max-w-md -translate-x-1/2 items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-5 py-3.5 font-bold text-white shadow-2xl shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-[#1faa56] focus:outline-none focus:ring-4 focus:ring-emerald-300"
          aria-label="Contactar al anfitrión por WhatsApp"
        >
          <Phone className="h-5 w-5 fill-current" aria-hidden="true" />
          <span>Consultar por WhatsApp</span>
        </a>
      </aside>
    </div>
  );
}

function RecommendationCard({
  item,
  icon,
}: {
  item: GuideRecommendation;
  icon: React.ReactNode;
}) {
  return (
    <article className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#8AA9C4] hover:shadow-md">
      <div className="flex items-start gap-3.5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#EAF2F8] text-[#3E5C76]">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-[#1D2D44]">{item.label}</h3>
            {item.badge ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                {item.badge}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[#3E5C76]">{item.description}</p>

          {item.address ? (
            <p className="mt-2 text-[11px] text-slate-500">
              📍 {item.address}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {item.reservationPhone || item.phone ? (
              <a
                href={`tel:${(item.reservationPhone || item.phone || '').replace(/[\s+-]/g, '')}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1D2D44] underline decoration-slate-300 underline-offset-2 hover:text-[#3E5C76]"
              >
                <Phone className="h-3 w-3" aria-hidden="true" />
                {item.reservationPhone ? `Reserva: ${item.reservationPhone}` : `Tel: ${item.phone}`}
              </a>
            ) : null}

            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#3E5C76] transition group-hover:text-[#1D2D44]"
            >
              <span>Ver en mapa</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
