'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  Check,
  Compass,
  Copy,
  ExternalLink,
  Flame,
  Grape,
  Home,
  KeyRound,
  LifeBuoy,
  Mail,
  MapPin,
  MapPinned,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trees,
  Tv,
  Utensils,
  Wifi,
} from 'lucide-react';
import type { GuestGuidePrivateDetails } from '@/lib/guest-guide-config';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { altosDptoGuide } from '@/lib/data/guest-guide';

interface GuestGuideDashboardProps {
  privateDetails: GuestGuidePrivateDetails;
}

type GuideView =
  | 'menu'
  | 'inicio'
  | 'checkin'
  | 'wifi'
  | 'clima'
  | 'tv'
  | 'reglas'
  | 'util'
  | 'compras'
  | 'gastronomia'
  | 'bodegas'
  | 'artesanias'
  | 'campings'
  | 'atractivos'
  | 'lugares'
  | 'excursiones';

export default function GuestGuideDashboard({ privateDetails }: GuestGuideDashboardProps) {
  const [currentView, setCurrentView] = useState<GuideView>('menu');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Sincronizar hash con la vista activa para navegación nativa móvil
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as GuideView;
      const validViews: GuideView[] = [
        'inicio',
        'checkin',
        'wifi',
        'clima',
        'tv',
        'reglas',
        'util',
        'compras',
        'gastronomia',
        'bodegas',
        'artesanias',
        'campings',
        'atractivos',
        'lugares',
        'excursiones',
      ];
      if (validViews.includes(hash)) {
        setCurrentView(hash === 'lugares' ? 'atractivos' : hash);
      } else {
        setCurrentView('menu');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (view: GuideView) => {
    if (view === 'menu') {
      window.location.hash = '';
      setCurrentView('menu');
    } else {
      window.location.hash = view;
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const copyText = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setCopiedKey(null);
    }
  };

  const whatsappUrl = `https://wa.me/${altosDptoGuide.contactPhone}?text=${encodeURIComponent(
    'Hola, estoy alojado en Altos del Talampaya Dpto y tengo una consulta.'
  )}`;

  return (
    <div className="min-h-screen min-h-dvh overflow-x-hidden bg-[#F9F5EB] font-body text-[#2D4059] pb-28 pb-[max(7rem,calc(5.5rem+env(safe-area-inset-bottom)))] antialiased selection:bg-[#002B5B] selection:text-white">
      {currentView === 'menu' ? (
        /* VISTA PRINCIPAL: MENÚ EN MOSAICO (TILES) ESTILO DEMO */
        <div className="mx-auto max-w-[490px] px-3.5 py-3 sm:px-4 sm:py-6">
          {/* Tarjeta de Portada con Foto */}
          <header className="relative min-h-[240px] overflow-hidden rounded-[20px] bg-[#002B5B] text-center text-white shadow-sm sm:min-h-[260px]">
            <Image
              src={altosDptoGuide.coverImage}
              alt="Altos del Talampaya Dpto"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 490px"
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
              <h1 className="font-headline text-xl font-bold uppercase tracking-wider text-white drop-shadow-md sm:text-2xl md:text-3xl">
                {altosDptoGuide.propertyName}
              </h1>
              <div className="mx-auto my-2.5 h-0.5 w-16 rounded-full bg-[#EA5455]" />
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/90">
                Guía de bienvenida · Villa Unión
              </p>
            </div>
          </header>

          {/* Acceso Rápido Wi-Fi y Llaves */}
          <div className="my-3.5 flex items-center justify-between gap-2.5 rounded-[16px] border border-[#2D4059]/15 bg-white p-3 sm:px-4 sm:py-3.5 shadow-xs">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#EA5455]/10 text-[#EA5455]">
                <KeyRound className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#002B5B] truncate">
                  Caja de llaves: <span className="font-mono text-sm font-black text-[#EA5455]">{privateDetails.keyBoxCode}</span>
                </p>
                <p className="text-[11px] text-[#2D4059]/75 truncate">
                  Wi-Fi: <span className="font-mono font-semibold text-[#002B5B]">{privateDetails.wifiName}</span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyText(privateDetails.wifiPassword, 'quick-wifi')}
              className="touch-manipulation inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-xl bg-[#002B5B] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#2D4059] active:scale-95"
            >
              {copiedKey === 'quick-wifi' ? '¡Copiada!' : 'Copiar clave'}
            </button>
          </div>

          {/* Grilla de 15 Mosaicos (5 filas x 3 columnas) */}
          <nav aria-label="Secciones de la guía" className="grid grid-cols-3 gap-2 sm:gap-2.5">
            <MenuTile icon={Home} label="Bienvenida" onClick={() => navigateTo('inicio')} />
            <MenuTile icon={KeyRound} label="Check-in" onClick={() => navigateTo('checkin')} />
            <MenuTile icon={Wifi} label="WiFi" onClick={() => navigateTo('wifi')} />

            <MenuTile icon={Flame} label="Climatización" onClick={() => navigateTo('clima')} />
            <MenuTile icon={Tv} label="Smart TV" onClick={() => navigateTo('tv')} />
            <MenuTile icon={ShieldCheck} label="Reglas" onClick={() => navigateTo('reglas')} />

            <MenuTile icon={LifeBuoy} label="Útil y SOS" onClick={() => navigateTo('util')} />
            <MenuTile icon={ShoppingBag} label="Comercios" onClick={() => navigateTo('compras')} />
            <MenuTile icon={Utensils} label="Gastronomía" onClick={() => navigateTo('gastronomia')} />

            <MenuTile icon={Grape} label="Bodegas" onClick={() => navigateTo('bodegas')} />
            <MenuTile icon={Sparkles} label="Artesanías" onClick={() => navigateTo('artesanias')} />
            <MenuTile icon={Trees} label="Campings" onClick={() => navigateTo('campings')} />

            <MenuTile icon={MapPin} label="Atractivos" onClick={() => navigateTo('atractivos')} />
            <MenuTile icon={Compass} label="Excursiones" onClick={() => navigateTo('excursiones')} />
            <a
              href={altosDptoGuide.touristMapUrl}
              target="_blank"
              rel="noreferrer"
              className="touch-manipulation flex min-h-[84px] sm:min-h-[88px] flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-[14px] border border-[#EA5455]/30 bg-white p-2 text-center transition active:scale-95 hover:border-[#EA5455] hover:shadow-xs"
            >
              <MapPinned className="h-5 w-5 sm:h-6 sm:w-6 text-[#EA5455] shrink-0" />
              <span className="text-[11px] sm:text-[12px] font-semibold leading-tight text-[#002B5B] hyphens-auto break-words line-clamp-2">Mapa Región</span>
            </a>
          </nav>

          {/* Pie de página sutil */}
          <footer className="mt-8 text-center text-xs text-[#2D4059]/70">
            <p className="font-medium">Altos del Talampaya Dpto · Villa Unión, La Rioja</p>
          </footer>
        </div>
      ) : (
        /* VISTAS DETALLADAS CON BARRA SUPERIOR STICKY Y BOTÓN VOLVER */
        <div className="mx-auto max-w-[490px]">
          {/* Barra superior de navegación */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#2D4059]/15 bg-[#F9F5EB]/95 px-3 py-2.5 sm:px-4 sm:py-3 backdrop-blur-md pt-[max(0.625rem,env(safe-area-inset-top))]">
            <button
              type="button"
              onClick={() => navigateTo('menu')}
              className="touch-manipulation inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-xl border border-[#2D4059]/20 bg-white px-3.5 py-2 text-xs font-bold text-[#002B5B] shadow-xs transition hover:bg-[#F9F5EB] active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </button>
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#002B5B] text-center truncate max-w-[200px] sm:max-w-none">
              {getViewTitle(currentView)}
            </h2>
            {altosDptoGuide.logo ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white p-1 border border-[#2D4059]/15 shadow-2xs">
                <Image
                  src={altosDptoGuide.logo}
                  alt="Altos del Talampaya"
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="w-12 sm:w-16" />
            )}
          </header>

          {/* Contenido de la sección seleccionada */}
          <main className="space-y-4 px-4 py-5">
            {currentView === 'inicio' && (
              <>
                <SectionCard title="Datos de la estadía">
                  <KvRow label="Alojamiento" value={altosDptoGuide.propertyName} />
                  <KvRow label="Capacidad" value="2 personas (1 dormitorio con somier)" />
                  <KvRow label="Dirección" value={altosDptoGuide.arrival.address} />
                  <KvRow label="Estacionamiento" value="Cochera privada techada incluida" />
                </SectionCard>

                <div className="pt-1">
                  <a
                    href={altosDptoGuide.propertyMapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="touch-manipulation flex min-h-[48px] h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#002B5B] px-4 text-xs font-bold text-white shadow-xs transition hover:bg-[#2D4059] active:scale-[0.98]"
                  >
                    <MapPin className="h-4 w-4" />
                    Cómo llegar con Google Maps
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <SectionCard title="Tarifa y medios de pago">
                  <p className="text-xs leading-relaxed text-[#2D4059]/80">
                    {altosDptoGuide.payment.currencyDescription} Se abona preferentemente durante el primer día.
                  </p>
                  <div className="mt-3 rounded-xl border border-[#2D4059]/15 bg-[#F9F5EB]/60 p-3 text-xs space-y-1.5">
                    <p className="text-[#2D4059]/80">Transferencia bancaria o efectivo:</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[#002B5B] truncate">
                        Alias: <span className="font-mono">{altosDptoGuide.payment.bankAlias}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => copyText(altosDptoGuide.payment.bankAlias, 'alias')}
                        className="touch-manipulation inline-flex min-h-[38px] shrink-0 items-center justify-center rounded-lg bg-[#002B5B] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#2D4059] active:scale-95"
                      >
                        {copiedKey === 'alias' ? '¡Copiado!' : 'Copiar alias'}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#2D4059]/70">Titular: {altosDptoGuide.payment.accountHolder}</p>
                  </div>
                </SectionCard>
              </>
            )}

            {currentView === 'checkin' && (
              <>
                <SectionCard title="Horarios de la estadía">
                  <KvRow label="Check-in" value={altosDptoGuide.arrival.checkIn} />
                  <KvRow label="Check-out" value={altosDptoGuide.arrival.checkOut} />
                  <KvRow label="Estacionamiento" value="Cochera privada y techada" />
                </SectionCard>

                <SectionCard title="Acceso autónomo con caja de llaves">
                  <p className="text-xs text-[#2D4059]/80">{altosDptoGuide.arrival.keyBoxLocation}</p>
                  <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-[#2D4059]/15 bg-[#F9F5EB]/60 p-3.5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#2D4059]/80">Código de caja</p>
                      <p className="font-mono text-2xl font-black text-[#EA5455]">{privateDetails.keyBoxCode}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(privateDetails.keyBoxCode, 'keybox')}
                      className="touch-manipulation inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-xl bg-[#002B5B] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#2D4059] active:scale-95"
                    >
                      {copiedKey === 'keybox' ? '¡Copiado!' : 'Copiar código'}
                    </button>
                  </div>
                  <p className="mt-2.5 text-xs font-medium text-[#002B5B]">
                    🔑 {altosDptoGuide.arrival.keyDescription}
                  </p>
                </SectionCard>

                <SectionCard title="Instrucciones para el Check-out (hasta las 10:00 hs)">
                  <ol className="space-y-2.5 text-xs leading-relaxed text-[#2D4059]">
                    {altosDptoGuide.departure.instructions.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-lg bg-[#F07B3F]/15 text-[11px] font-bold text-[#F07B3F]">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </SectionCard>
              </>
            )}

            {currentView === 'wifi' && (
              <>
                <SectionCard title="Conexión Wi-Fi del departamento">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-[#2D4059]/15 bg-[#F9F5EB]/60 p-3.5">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#2D4059]/80">Nombre de red</p>
                        <p className="font-mono text-base font-bold text-[#002B5B] truncate">{privateDetails.wifiName}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText(privateDetails.wifiName, 'wifi-name')}
                        className="touch-manipulation inline-flex min-h-[38px] shrink-0 items-center justify-center rounded-lg bg-white border border-[#2D4059]/20 px-3 py-1.5 text-xs font-semibold text-[#002B5B] hover:bg-[#F9F5EB] active:scale-95"
                      >
                        {copiedKey === 'wifi-name' ? '¡Copiado!' : 'Copiar red'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 rounded-xl border border-[#2D4059]/15 bg-[#F9F5EB]/60 p-3.5">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#2D4059]/80">Contraseña</p>
                        <p className="font-mono text-base font-bold text-[#002B5B] truncate">{privateDetails.wifiPassword}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText(privateDetails.wifiPassword, 'wifi-pass')}
                        className="touch-manipulation inline-flex min-h-[38px] shrink-0 items-center justify-center rounded-lg bg-[#002B5B] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#2D4059] active:scale-95"
                      >
                        {copiedKey === 'wifi-pass' ? '¡Copiada!' : 'Copiar clave'}
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-[#2D4059]/75">
                    Red de fibra óptica exclusiva para huéspedes durante su estadía.
                  </p>
                </SectionCard>
              </>
            )}

            {currentView === 'clima' && (
              <>
                <SectionCard title="Piso Radiante (Calefacción)">
                  <p className="text-xs text-[#2D4059]/80">
                    Comandado por las pequeñas cajitas blancas ubicadas junto a la puerta principal y en el dormitorio.
                  </p>
                  <ol className="mt-3 space-y-2 text-xs leading-relaxed text-[#2D4059]">
                    <li className="flex items-start gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-lg bg-[#F07B3F]/15 text-[11px] font-bold text-[#F07B3F]">1</span>
                      <span><strong>Encendido:</strong> Presioná el botón <em>ON</em> en la cajita.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-lg bg-[#F07B3F]/15 text-[11px] font-bold text-[#F07B3F]">2</span>
                      <span><strong>Temperatura:</strong> Graduá el calor deseado con las flechas (arriba / abajo).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-lg bg-[#F07B3F]/15 text-[11px] font-bold text-[#F07B3F]">3</span>
                      <span><strong>Confirmar:</strong> Presioná el botón <em>Set</em> para guardar la temperatura.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-lg bg-[#F07B3F]/15 text-[11px] font-bold text-[#F07B3F]">4</span>
                      <span><strong>Apagado:</strong> Presioná el botón de apagado al retirarte o cuando el ambiente esté templado.</span>
                    </li>
                  </ol>
                </SectionCard>

                <SectionCard title="Aire Acondicionado">
                  <p className="text-xs leading-relaxed text-[#2D4059]">
                    Utilizá el equipo con el control remoto provisto.
                  </p>
                  <div className="mt-2.5 rounded-xl border border-sky-100 bg-sky-50/60 p-3 text-xs text-sky-950">
                    <strong>Uso consciente:</strong> Por favor verificá que tanto el aire acondicionado como la calefacción queden apagados cada vez que salgas del departamento para cuidar la energía del valle.
                  </div>
                </SectionCard>
              </>
            )}

            {currentView === 'tv' && (
              <>
                <SectionCard title="Smart TV · Televisión en vivo">
                  <p className="text-xs leading-relaxed text-[#2D4059]">
                    Para ver televisión por cable en vivo:
                  </p>
                  <ol className="mt-2.5 space-y-1.5 text-xs text-[#2D4059]">
                    <li>1. Encendé el televisor desde el control remoto.</li>
                    <li>2. Seleccioná la aplicación <strong>View</strong> en la pantalla principal.</li>
                    <li>3. Podés utilizar tus aplicaciones personales de streaming (recordá cerrar sesión antes de partir).</li>
                  </ol>
                </SectionCard>

                <SectionCard title="Cocina y equipamiento">
                  <p className="text-xs leading-relaxed text-[#2D4059]">
                    El departamento cuenta con vajilla, utensilios, heladera y pava eléctrica para que prepares tus desayunos y comidas con total comodidad.
                  </p>
                </SectionCard>
              </>
            )}

            {currentView === 'reglas' && (
              <SectionCard title="Normas de convivencia">
                <ul className="space-y-3 text-xs leading-relaxed text-[#2D4059]">
                  {altosDptoGuide.houseRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 border-b border-[#2D4059]/10 pb-2.5 last:border-b-0 last:pb-0">
                      <span className="mt-0.5 text-sm">🌿</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}

            {currentView === 'util' && (
              <div className="space-y-4">
                <SectionCard title="Botiquín y primeros auxilios">
                  <p className="text-xs leading-relaxed text-[#2D4059]">
                    {altosDptoGuide.emergencies.firstAidKitLocation}
                  </p>
                </SectionCard>

                <SectionCard title="Teléfonos de urgencia en Villa Unión">
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <a
                      href="tel:107"
                      className="touch-manipulation flex min-h-[72px] flex-col items-center justify-center rounded-xl border border-[#2D4059]/15 bg-white p-3 text-center transition hover:border-[#EA5455]/50 active:scale-[0.96]"
                    >
                      <span className="text-lg font-black text-[#EA5455]">107</span>
                      <span className="text-[11px] font-semibold text-[#2D4059]/75">Hospital Neira</span>
                    </a>
                    <a
                      href="tel:101"
                      className="touch-manipulation flex min-h-[72px] flex-col items-center justify-center rounded-xl border border-[#2D4059]/15 bg-white p-3 text-center transition hover:border-[#EA5455]/50 active:scale-[0.96]"
                    >
                      <span className="text-lg font-black text-[#EA5455]">101</span>
                      <span className="text-[11px] font-semibold text-[#2D4059]/75">Policía</span>
                    </a>
                    <a
                      href="tel:100"
                      className="touch-manipulation flex min-h-[72px] flex-col items-center justify-center rounded-xl border border-[#2D4059]/15 bg-white p-3 text-center transition hover:border-[#EA5455]/50 active:scale-[0.96]"
                    >
                      <span className="text-lg font-black text-[#EA5455]">100</span>
                      <span className="text-[11px] font-semibold text-[#2D4059]/75">Bomberos</span>
                    </a>
                    <a
                      href={`tel:${altosDptoGuide.contactPhone}`}
                      className="touch-manipulation flex min-h-[72px] flex-col items-center justify-center rounded-xl border border-[#2D4059]/15 bg-white p-3 text-center transition hover:border-[#EA5455]/50 active:scale-[0.96]"
                    >
                      <span className="text-xs font-black text-[#002B5B]">Anfitrión</span>
                      <span className="text-[11px] font-semibold text-[#2D4059]/75">Llamada directa</span>
                    </a>
                  </div>
                </SectionCard>

                {/* Bancos y Cajeros Automáticos */}
                <div className="space-y-2">
                  <h3 className="px-1 text-xs font-bold uppercase tracking-wider text-[#002B5B]">
                    Bancos y Cajeros Automáticos
                  </h3>
                  {altosDptoGuide.usefulServices
                    .filter((s) => s.category === 'Bancos')
                    .map((item) => (
                      <ItemCard
                        key={item.label}
                        title={item.label}
                        description={item.description}
                        address={item.address}
                        phone={item.phone}
                        badge={item.badge}
                        mapsUrl={item.href}
                      />
                    ))}
                </div>

                {/* Hospital y Farmacia */}
                <div className="space-y-2">
                  <h3 className="px-1 text-xs font-bold uppercase tracking-wider text-[#002B5B]">
                    Hospital y Farmacia
                  </h3>
                  {altosDptoGuide.usefulServices
                    .filter((s) => s.category === 'Salud')
                    .map((item) => (
                      <ItemCard
                        key={item.label}
                        title={item.label}
                        description={item.description}
                        address={item.address}
                        phone={item.phone}
                        badge={item.badge}
                        mapsUrl={item.href}
                      />
                    ))}
                </div>

                {/* Bomberos Voluntarios */}
                <div className="space-y-2">
                  <h3 className="px-1 text-xs font-bold uppercase tracking-wider text-[#002B5B]">
                    Bomberos Voluntarios
                  </h3>
                  {altosDptoGuide.usefulServices
                    .filter((s) => s.category === 'Seguridad')
                    .map((item) => (
                      <ItemCard
                        key={item.label}
                        title={item.label}
                        description={item.description}
                        address={item.address}
                        phone={item.phone}
                        badge={item.badge}
                        mapsUrl={item.href}
                      />
                    ))}
                </div>

                {/* Estaciones de Servicio y Combustible */}
                <div className="space-y-2">
                  <h3 className="px-1 text-xs font-bold uppercase tracking-wider text-[#002B5B]">
                    Estaciones de Servicio (Combustible)
                  </h3>
                  {altosDptoGuide.usefulServices
                    .filter((s) => s.category === 'Combustible')
                    .map((item) => (
                      <ItemCard
                        key={item.label}
                        title={item.label}
                        description={item.description}
                        address={item.address}
                        phone={item.phone}
                        badge={item.badge}
                        mapsUrl={item.href}
                      />
                    ))}
                </div>

                {/* Iglesias y Patrimonio Cultural */}
                <div className="space-y-2">
                  <h3 className="px-1 text-xs font-bold uppercase tracking-wider text-[#002B5B]">
                    Iglesias y Patrimonio Cultural
                  </h3>
                  {altosDptoGuide.usefulServices
                    .filter((s) => s.category === 'Iglesias')
                    .map((item) => (
                      <ItemCard
                        key={item.label}
                        title={item.label}
                        description={item.description}
                        address={item.address}
                        phone={item.phone}
                        badge={item.badge}
                        mapsUrl={item.href}
                      />
                    ))}
                </div>

                {/* Plaza Principal y Centro */}
                <div className="space-y-2">
                  <h3 className="px-1 text-xs font-bold uppercase tracking-wider text-[#002B5B]">
                    Plaza Principal y Centro
                  </h3>
                  {altosDptoGuide.usefulServices
                    .filter((s) => s.category === 'Servicios')
                    .map((item) => (
                      <ItemCard
                        key={item.label}
                        title={item.label}
                        description={item.description}
                        address={item.address}
                        phone={item.phone}
                        badge={item.badge}
                        mapsUrl={item.href}
                      />
                    ))}
                </div>
              </div>
            )}

            {currentView === 'compras' && (
              <div className="space-y-3">
                <NoticeBox text="Supermercados, autoservicios, farmacias y comercios esenciales para abastecerte en Villa Unión." />
                {altosDptoGuide.usefulServices
                  .filter((s) => s.category === 'Supermercado' || s.category === 'Comercios')
                  .map((item) => (
                    <ItemCard
                      key={item.label}
                      title={item.label}
                      description={item.description}
                      address={item.address}
                      phone={item.phone}
                      reservationPhone={item.reservationPhone}
                      badge={item.badge}
                      mapsUrl={item.href}
                    />
                  ))}
              </div>
            )}

            {currentView === 'gastronomia' && (
              <div className="space-y-3">
                <NoticeBox text="Opciones gastronómicas de Villa Unión y alrededores. Confirmar horarios y reservas por teléfono." />
                {altosDptoGuide.recommendations
                  .filter((r) => r.category === 'Gastronomía')
                  .map((item) => (
                    <ItemCard
                      key={item.label}
                      title={item.label}
                      description={item.description}
                      address={item.address}
                      phone={item.phone}
                      badge={item.badge}
                      mapsUrl={item.href}
                    />
                  ))}
              </div>
            )}

            {currentView === 'bodegas' && (
              <div className="space-y-3">
                <NoticeBox text="Ruta de bodegas y viñedos de Felipe Varela. Recomendamos consultar y coordinar visitas guiadas previamente." />
                {altosDptoGuide.recommendations
                  .filter((r) => r.category === 'Bodegas')
                  .map((item) => (
                    <ItemCard
                      key={item.label}
                      title={item.label}
                      description={item.description}
                      address={item.address}
                      reservationPhone={item.reservationPhone}
                      phone={item.phone}
                      badge={item.badge}
                      mapsUrl={item.href}
                      email={item.email}
                      web={item.web}
                    />
                  ))}
              </div>
            )}

            {currentView === 'artesanias' && (
              <div className="space-y-3">
                <NoticeBox text="Talleres artesanales, tejidos en telar, dulces caseros, vinos y productos regionales del Bermejo." />
                {altosDptoGuide.recommendations
                  .filter((r) => r.category === 'Artesanías')
                  .map((item) => (
                    <ItemCard
                      key={item.label}
                      title={item.label}
                      description={item.description}
                      address={item.address}
                      phone={item.phone}
                      badge={item.badge}
                      mapsUrl={item.href}
                    />
                  ))}
              </div>
            )}

            {currentView === 'campings' && (
              <div className="space-y-3">
                <NoticeBox text="Espacios de acampe, sombra, piletas y recreación familiar en Villa Unión y Los Palacios." />
                {altosDptoGuide.recommendations
                  .filter((r) => r.category === 'Campings')
                  .map((item) => (
                    <ItemCard
                      key={item.label}
                      title={item.label}
                      description={item.description}
                      address={item.address}
                      phone={item.phone}
                      badge={item.badge}
                      mapsUrl={item.href}
                      email={item.email}
                    />
                  ))}
              </div>
            )}

            {(currentView === 'atractivos' || currentView === 'lugares') && (
              <div className="space-y-3">
                <NoticeBox text="Atractivos naturales, paisajes geológicos y sitios históricos de Villa Unión, el Valle del Bermejo y la región." />
                {altosDptoGuide.recommendations
                  .filter((r) => r.category === 'Atractivos' || r.category === 'Localidades')
                  .map((item) => (
                    <ItemCard
                      key={item.label}
                      title={item.label}
                      description={item.description}
                      address={item.address}
                      badge={item.badge}
                      mapsUrl={item.href}
                      externalUrl={item.web}
                    />
                  ))}
              </div>
            )}

            {currentView === 'excursiones' && (
              <div className="space-y-3">
                <NoticeBox text="Agencias de viajes habilitadas (EVT) y prestadores autorizados para excursiones al Parque Talampaya y la región." />
                {altosDptoGuide.recommendations
                  .filter((r) => r.category === 'Excursiones')
                  .map((item) => (
                    <ItemCard
                      key={item.label}
                      title={item.label}
                      description={item.description}
                      address={item.address}
                      phone={item.phone}
                      reservationPhone={item.reservationPhone}
                      badge={item.badge}
                      mapsUrl={item.href}
                      email={item.email}
                      web={item.web}
                    />
                  ))}

                {/* Mapa Turístico Completo */}
                <div className="rounded-[18px] border border-[#2D4059]/15 bg-white p-5 text-center shadow-xs">
                  <MapPinned className="mx-auto h-7 w-7 text-[#EA5455]" />
                  <h3 className="mt-2 text-sm font-bold text-[#002B5B]">Mapa Turístico Oficial del Bermejo</h3>
                  <p className="mt-1 text-xs text-[#2D4059]/75">
                    Atractivos naturales, rutas, miradores y servicios en Google My Maps.
                  </p>
                  <a
                    href={altosDptoGuide.touristMapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="touch-manipulation mt-3.5 inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl bg-[#002B5B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#2D4059] active:scale-95"
                  >
                    <span>Ver mapa interactivo completo</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Botón flotante persistente de WhatsApp mejorado con ícono oficial */}
      <aside aria-label="Contacto por WhatsApp">
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#F9F5EB] via-[#F9F5EB]/95 to-transparent px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] pointer-events-none">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-manipulation pointer-events-auto mx-auto flex min-h-[48px] h-12 sm:h-13 max-w-[480px] items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] px-5 py-3 font-bold text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
          >
            <WhatsAppIcon className="h-5 w-5 text-white shrink-0 drop-shadow-sm" aria-hidden="true" />
            <span className="text-sm font-bold tracking-wide">Consultar por WhatsApp</span>
          </a>
        </div>
      </aside>
    </div>
  );
}

function MenuTile({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="touch-manipulation relative flex min-h-[84px] sm:min-h-[88px] flex-col items-center justify-center gap-1.5 sm:gap-2 rounded-[14px] border border-[#2D4059]/15 bg-white p-2 text-center transition active:scale-95 hover:border-[#EA5455]/50 hover:shadow-xs"
    >
      <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#002B5B] shrink-0" aria-hidden="true" />
      <span className="text-[11px] sm:text-[12px] font-semibold leading-tight text-[#002B5B] hyphens-auto break-words line-clamp-2">{label}</span>
    </button>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[18px] border border-[#2D4059]/15 bg-white p-5 shadow-xs">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#002B5B]">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function KvRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#2D4059]/10 py-2.5 last:border-b-0 last:pb-0">
      <span className="text-xs font-medium text-[#2D4059]/80">{label}</span>
      <span className="text-right text-xs font-bold text-[#002B5B]">{value}</span>
    </div>
  );
}

function NoticeBox({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-[#2D4059]/15 bg-white/90 p-3 text-xs text-[#2D4059]">
      ℹ️ {text}
    </div>
  );
}

function ItemCard({
  title,
  description,
  address,
  phone,
  reservationPhone,
  email,
  web,
  badge,
  mapsUrl,
  externalUrl,
}: {
  title: string;
  description: string;
  address?: string;
  phone?: string;
  reservationPhone?: string;
  email?: string;
  web?: string;
  badge?: string;
  mapsUrl?: string;
  externalUrl?: string;
}) {
  const contactNumber = reservationPhone || phone;
  const isRecommended = badge === 'Recomendado';

  return (
    <article
      className={`rounded-[18px] border bg-white p-4 shadow-xs transition hover:shadow-md ${
        isRecommended ? 'border-[#EA5455]/40 ring-1 ring-[#EA5455]/20 bg-[#EA5455]/[0.015]' : 'border-[#2D4059]/15'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold text-[#002B5B]">{title}</h4>
        {badge && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shrink-0 ${
              isRecommended
                ? 'bg-[#EA5455]/10 text-[#EA5455] border border-[#EA5455]/30 shadow-xs'
                : 'bg-[#F9F5EB] text-[#2D4059] border border-[#2D4059]/15'
            }`}
          >
            {isRecommended ? '★ Recomendado' : badge}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-[#2D4059]/85">{description}</p>
      {address && <p className="mt-1.5 text-[11px] text-[#2D4059]/70">📍 {address}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {contactNumber && (
          <a
            href={`tel:${contactNumber.replace(/[\s+-]/g, '')}`}
            className="touch-manipulation inline-flex min-h-[38px] items-center justify-center gap-1 rounded-lg border border-[#2D4059]/20 bg-[#F9F5EB]/60 px-3 py-1.5 text-xs font-semibold text-[#002B5B] hover:bg-[#F9F5EB] active:scale-95"
          >
            <Phone className="h-3 w-3 text-[#002B5B]" />
            Llamar
          </a>
        )}

        {reservationPhone && (
          <a
            href={`https://wa.me/${reservationPhone.replace(/[\s+-]/g, '')}?text=${encodeURIComponent(
              `Hola, estoy alojado en Altos del Talampaya Dpto y quisiera consultar sobre ${title}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-manipulation inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-lg border border-emerald-300 bg-[#E8F8EE] px-3 py-1.5 text-xs font-semibold text-emerald-900 hover:bg-[#D4F3DE] transition active:scale-95"
          >
            <WhatsAppIcon className="h-3.5 w-3.5 text-[#25D366]" />
            WhatsApp
          </a>
        )}

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="touch-manipulation inline-flex min-h-[38px] items-center justify-center gap-1 rounded-lg border border-[#2D4059]/20 bg-[#F9F5EB]/60 px-3 py-1.5 text-xs font-semibold text-[#002B5B] hover:bg-[#F9F5EB] active:scale-95"
          >
            <MapPin className="h-3 w-3 text-[#EA5455]" />
            Cómo llegar
            <ExternalLink className="h-3 w-3 text-[#2D4059]/60" />
          </a>
        )}

        {email && (
          <a
            href={`mailto:${email}`}
            className="touch-manipulation inline-flex min-h-[38px] items-center justify-center gap-1 rounded-lg border border-[#2D4059]/20 bg-[#F9F5EB]/60 px-3 py-1.5 text-xs font-semibold text-[#002B5B] hover:bg-[#F9F5EB] active:scale-95"
          >
            <Mail className="h-3 w-3 text-[#002B5B]" />
            Email
          </a>
        )}

        {web && (
          <a
            href={web.startsWith('http') ? web : `https://${web}`}
            target="_blank"
            rel="noreferrer"
            className={`touch-manipulation inline-flex min-h-[38px] items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold active:scale-95 ${
              isRecommended
                ? 'bg-[#002B5B] text-white hover:bg-[#2D4059]'
                : 'border border-[#2D4059]/20 bg-[#F9F5EB]/60 text-[#002B5B] hover:bg-[#F9F5EB]'
            }`}
          >
            <span>Ver web</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        )}

        {externalUrl && !web && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
            className="touch-manipulation inline-flex min-h-[38px] items-center justify-center gap-1 rounded-lg bg-[#002B5B] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#2D4059] active:scale-95"
          >
            Ver más
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </article>
  );
}

function getViewTitle(view: GuideView): string {
  switch (view) {
    case 'inicio':
      return 'Bienvenida';
    case 'checkin':
      return 'Check-in y Llaves';
    case 'wifi':
      return 'Internet Wi-Fi';
    case 'clima':
      return 'Climatización';
    case 'tv':
      return 'Smart TV y Cocina';
    case 'reglas':
      return 'Normas de la Casa';
    case 'util':
      return 'Útil y SOS';
    case 'compras':
      return 'Comercios';
    case 'gastronomia':
      return 'Gastronomía';
    case 'bodegas':
      return 'Bodegas y Sabores';
    case 'artesanias':
      return 'Artesanías y Regionales';
    case 'campings':
      return 'Campings y Recreación';
    case 'atractivos':
    case 'lugares':
      return 'Atractivos turísticos';
    case 'excursiones':
      return 'Agencias y Excursiones';
    default:
      return 'Guía';
  }
}
