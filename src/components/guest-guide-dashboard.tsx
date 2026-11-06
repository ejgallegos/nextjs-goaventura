'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  MapPin,
  MapPinned,
  MessageCircle,
  Phone,
  Printer,
  ShieldCheck,
  ShoppingBag,
  Tv,
  Utensils,
  Wifi,
} from 'lucide-react';
import type { GuestGuidePrivateDetails } from '@/lib/guest-guide-config';
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
        'lugares',
        'excursiones',
      ];
      if (validViews.includes(hash)) {
        setCurrentView(hash);
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
      // Fallback
      setCopiedKey(null);
    }
  };

  const whatsappUrl = `https://wa.me/${altosDptoGuide.contactPhone}?text=${encodeURIComponent(
    'Hola, estoy alojado en Altos del Talampaya Dpto y tengo una consulta.'
  )}`;

  return (
    <div className="min-h-screen bg-[#F1EDE4] font-body text-[#262622] pb-24 antialiased selection:bg-[#2F6F73] selection:text-white">
      {currentView === 'menu' ? (
        /* VISTA PRINCIPAL: MENÚ EN MOSAICO (TILES) ESTILO DEMO */
        <div className="mx-auto max-w-[490px] px-4 py-4 sm:py-6">
          {/* Tarjeta de Portada con Foto */}
          <header className="relative min-h-[220px] overflow-hidden rounded-[20px] bg-[#1A1A1A] text-center text-white shadow-sm sm:min-h-[240px]">
            <Image
              src={altosDptoGuide.coverImage}
              alt="Altos del Talampaya Dpto"
              fill
              priority
              sizes="(max-width: 640px) 100vw, 490px"
              className="object-cover opacity-65"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent" />
            <div className="relative flex min-h-[220px] flex-col justify-end p-6 sm:min-h-[240px] sm:p-7">
              <h1 className="font-headline text-2xl font-bold uppercase tracking-wider text-white drop-shadow-md sm:text-3xl">
                {altosDptoGuide.propertyName}
              </h1>
              <div className="mx-auto my-2.5 h-px w-20 bg-white/40" />
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/90">
                Guía de bienvenida · Villa Unión
              </p>
            </div>
          </header>

          {/* Acceso Rápido Wi-Fi y Llaves destacado */}
          <div className="my-3.5 flex items-center justify-between rounded-[16px] border border-[#E1E1E0] bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#E5FBFC] text-[#2F6F73]">
                <KeyRound className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#262622]">Caja de llaves: <span className="font-mono text-sm text-[#2F6F73]">{privateDetails.keyBoxCode}</span></p>
                <p className="text-[11px] text-[#676764]">Wi-Fi: <span className="font-mono font-semibold text-[#262622]">{privateDetails.wifiName}</span></p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyText(privateDetails.wifiPassword, 'quick-wifi')}
              className="rounded-xl bg-[#2F6F73] px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-[#255B5E]"
            >
              {copiedKey === 'quick-wifi' ? '¡Copiada!' : 'Copiar clave'}
            </button>
          </div>

          {/* Grilla de 12 Mosaicos (Tiles) estilo tualojamiento demo */}
          <nav aria-label="Secciones de la guía" className="grid grid-cols-3 gap-2.5">
            <MenuTile icon={Home} label="Bienvenida" onClick={() => navigateTo('inicio')} />
            <MenuTile icon={KeyRound} label="Check-in" onClick={() => navigateTo('checkin')} />
            <MenuTile icon={Wifi} label="WiFi" onClick={() => navigateTo('wifi')} />
            <MenuTile icon={Flame} label="Climatización" onClick={() => navigateTo('clima')} />
            <MenuTile icon={Tv} label="Smart TV" onClick={() => navigateTo('tv')} />
            <MenuTile icon={ShieldCheck} label="Reglas" onClick={() => navigateTo('reglas')} />
            <MenuTile icon={LifeBuoy} label="Útil y SOS" onClick={() => navigateTo('util')} isAlert />
            <MenuTile icon={ShoppingBag} label="Comercios" onClick={() => navigateTo('compras')} />
            <MenuTile icon={Utensils} label="Gastronomía" onClick={() => navigateTo('gastronomia')} />
            <MenuTile icon={Grape} label="Bodegas" onClick={() => navigateTo('bodegas')} />
            <MenuTile icon={MapPin} label="Lugares" onClick={() => navigateTo('lugares')} />
            <MenuTile icon={Compass} label="Excursiones" onClick={() => navigateTo('excursiones')} />
          </nav>

          {/* Pie de página sutil con acceso a lámina QR */}
          <footer className="mt-8 text-center text-xs text-[#676764] space-y-2">
            <p className="font-medium">Altos del Talampaya Dpto · Villa Unión, La Rioja</p>
            <div>
              <Link
                href="/guia/altos-del-talampaya-dpto/imprimir"
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#2F6F73] hover:underline"
              >
                <Printer className="h-3.5 w-3.5" />
                Ver lámina A4 con QR para imprimir
              </Link>
            </div>
          </footer>
        </div>
      ) : (
        /* VISTAS DETALLADAS CON BARRA SUPERIOR STICKY Y BOTÓN VOLVER */
        <div className="mx-auto max-w-[490px]">
          {/* Barra superior de navegación */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#D7D3CB] bg-[#F1EDE4]/95 px-4 py-3 backdrop-blur-md">
            <button
              type="button"
              onClick={() => navigateTo('menu')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#D7D3CB] bg-white px-3 py-1.5 text-xs font-bold text-[#262622] shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Volver</span>
            </button>
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#262622]">
              {getViewTitle(currentView)}
            </h2>
            <div className="w-16 text-right">
              <Link
                href="/guia/altos-del-talampaya-dpto/imprimir"
                className="inline-grid h-8 w-8 place-items-center rounded-xl text-[#676764] hover:text-[#262622]"
                title="Lámina QR"
              >
                <Printer className="h-4 w-4" />
              </Link>
            </div>
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
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2F6F73] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-[#255B5E]"
                  >
                    <MapPin className="h-4 w-4" />
                    Cómo llegar con Google Maps
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <SectionCard title="Tarifa y medios de pago">
                  <p className="text-xs leading-relaxed text-[#676764]">
                    {altosDptoGuide.payment.currencyDescription} Se abona preferentemente durante el primer día.
                  </p>
                  <div className="mt-3 rounded-xl border border-[#E1E1E0] bg-[#F4F4F4] p-3 text-xs space-y-1.5">
                    <p className="text-[#676764]">Transferencia bancaria o efectivo:</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#262622]">Alias: <span className="font-mono">{altosDptoGuide.payment.bankAlias}</span></span>
                      <button
                        type="button"
                        onClick={() => copyText(altosDptoGuide.payment.bankAlias, 'alias')}
                        className="rounded-lg bg-[#2F6F73] px-2 py-1 text-[10px] font-bold text-white"
                      >
                        {copiedKey === 'alias' ? '¡Copiado!' : 'Copiar alias'}
                      </button>
                    </div>
                    <p className="text-[11px] text-[#676764]">Titular: {altosDptoGuide.payment.accountHolder}</p>
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
                  <p className="text-xs text-[#676764]">
                    {altosDptoGuide.arrival.keyBoxLocation}
                  </p>
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-[#E1E1E0] bg-[#F4F4F4] p-3.5">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#676764]">Código de caja</p>
                      <p className="font-mono text-2xl font-black text-[#2F6F73]">{privateDetails.keyBoxCode}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyText(privateDetails.keyBoxCode, 'keybox')}
                      className="rounded-xl bg-[#2F6F73] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#255B5E]"
                    >
                      {copiedKey === 'keybox' ? '¡Copiado!' : 'Copiar código'}
                    </button>
                  </div>
                  <p className="mt-2.5 text-xs font-medium text-[#262622]">
                    🔑 {altosDptoGuide.arrival.keyDescription}
                  </p>
                </SectionCard>

                <SectionCard title="Instrucciones para el Check-out (hasta las 10:00 hs)">
                  <ol className="space-y-2.5 text-xs leading-relaxed text-[#262622]">
                    {altosDptoGuide.departure.instructions.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-lg bg-[#E5FBFC] text-[11px] font-bold text-[#2F6F73]">
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
                    <div className="flex items-center justify-between rounded-xl border border-[#E1E1E0] bg-[#F4F4F4] p-3.5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#676764]">Nombre de red</p>
                        <p className="font-mono text-base font-bold text-[#262622]">{privateDetails.wifiName}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText(privateDetails.wifiName, 'wifi-name')}
                        className="rounded-lg bg-white border border-[#D7D3CB] px-3 py-1.5 text-xs font-semibold text-[#262622] hover:bg-slate-50"
                      >
                        {copiedKey === 'wifi-name' ? '¡Copiado!' : 'Copiar red'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-[#E1E1E0] bg-[#F4F4F4] p-3.5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#676764]">Contraseña</p>
                        <p className="font-mono text-base font-bold text-[#2F6F73]">{privateDetails.wifiPassword}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText(privateDetails.wifiPassword, 'wifi-pass')}
                        className="rounded-lg bg-[#2F6F73] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#255B5E]"
                      >
                        {copiedKey === 'wifi-pass' ? '¡Copiada!' : 'Copiar clave'}
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-[#676764]">
                    Red de fibra óptica exclusiva para huéspedes durante su estadía.
                  </p>
                </SectionCard>
              </>
            )}

            {currentView === 'clima' && (
              <>
                <SectionCard title="Piso Radiante (Calefacción)">
                  <p className="text-xs text-[#676764]">
                    Comandado por las pequeñas cajitas blancas ubicadas junto a la puerta principal y en el dormitorio.
                  </p>
                  <ol className="mt-3 space-y-2 text-xs leading-relaxed text-[#262622]">
                    <li className="flex items-start gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-lg bg-[#E5FBFC] text-[11px] font-bold text-[#2F6F73]">1</span>
                      <span><strong>Encendido:</strong> Presioná el botón <em>ON</em> en la cajita.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-lg bg-[#E5FBFC] text-[11px] font-bold text-[#2F6F73]">2</span>
                      <span><strong>Temperatura:</strong> Graduá el calor deseado con las flechas (arriba / abajo).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-lg bg-[#E5FBFC] text-[11px] font-bold text-[#2F6F73]">3</span>
                      <span><strong>Confirmar:</strong> Presioná el botón <em>Set</em> para guardar la temperatura.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-lg bg-[#E5FBFC] text-[11px] font-bold text-[#2F6F73]">4</span>
                      <span><strong>Apagado:</strong> Presioná el botón de apagado al retirarte o cuando el ambiente esté templado.</span>
                    </li>
                  </ol>
                </SectionCard>

                <SectionCard title="Aire Acondicionado">
                  <p className="text-xs leading-relaxed text-[#262622]">
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
                  <p className="text-xs leading-relaxed text-[#262622]">
                    Para ver televisión por cable en vivo:
                  </p>
                  <ol className="mt-2.5 space-y-1.5 text-xs text-[#262622]">
                    <li>1. Encendé el televisor desde el control remoto.</li>
                    <li>2. Seleccioná la aplicación <strong>View</strong> en la pantalla principal.</li>
                    <li>3. Podés utilizar tus aplicaciones personales de streaming (recordá cerrar sesión antes de partir).</li>
                  </ol>
                </SectionCard>

                <SectionCard title="Cocina y equipamiento">
                  <p className="text-xs leading-relaxed text-[#262622]">
                    El departamento cuenta con vajilla, utensilios, heladera y pava eléctrica para que prepares tus desayunos y comidas con total comodidad.
                  </p>
                </SectionCard>
              </>
            )}

            {currentView === 'reglas' && (
              <SectionCard title="Normas de convivencia">
                <ul className="space-y-3 text-xs leading-relaxed text-[#262622]">
                  {altosDptoGuide.houseRules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 border-b border-[#F0ECE4] pb-2.5 last:border-b-0 last:pb-0">
                      <span className="mt-0.5 text-sm">🌿</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}

            {currentView === 'util' && (
              <>
                <SectionCard title="Botiquín y primeros auxilios">
                  <p className="text-xs leading-relaxed text-[#262622]">
                    {altosDptoGuide.emergencies.firstAidKitLocation}
                  </p>
                </SectionCard>

                <SectionCard title="Teléfonos de urgencia en Villa Unión">
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <a
                      href="tel:107"
                      className="flex flex-col items-center justify-center rounded-xl border border-[#E1E1E0] bg-[#F4F4F4] p-3 text-center transition hover:bg-white"
                    >
                      <span className="text-lg font-black text-[#2F6F73]">107</span>
                      <span className="text-[11px] font-semibold text-[#676764]">Hospital Neira</span>
                    </a>
                    <a
                      href="tel:101"
                      className="flex flex-col items-center justify-center rounded-xl border border-[#E1E1E0] bg-[#F4F4F4] p-3 text-center transition hover:bg-white"
                    >
                      <span className="text-lg font-black text-[#2F6F73]">101</span>
                      <span className="text-[11px] font-semibold text-[#676764]">Policía</span>
                    </a>
                    <a
                      href="tel:100"
                      className="flex flex-col items-center justify-center rounded-xl border border-[#E1E1E0] bg-[#F4F4F4] p-3 text-center transition hover:bg-white"
                    >
                      <span className="text-lg font-black text-[#2F6F73]">100</span>
                      <span className="text-[11px] font-semibold text-[#676764]">Bomberos</span>
                    </a>
                    <a
                      href={`tel:${altosDptoGuide.contactPhone}`}
                      className="flex flex-col items-center justify-center rounded-xl border border-[#E1E1E0] bg-[#F4F4F4] p-3 text-center transition hover:bg-white"
                    >
                      <span className="text-xs font-black text-[#2F6F73]">Anfitrión</span>
                      <span className="text-[11px] font-semibold text-[#676764]">Llamada directa</span>
                    </a>
                  </div>
                </SectionCard>

                <SectionCard title="Farmacias">
                  <p className="text-xs text-[#676764]">
                    Consultá turnos y horarios antes de trasladarte:
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=farmacia%2C+Villa+Uni%C3%B3n%2C+La+Rioja"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 flex items-center justify-between rounded-xl border border-[#E1E1E0] bg-[#F4F4F4] p-3 text-xs font-bold text-[#262622] hover:bg-white"
                  >
                    <span>Farmacias de turno en Google Maps</span>
                    <ExternalLink className="h-4 w-4 text-[#2F6F73]" />
                  </a>
                </SectionCard>
              </>
            )}

            {currentView === 'compras' && (
              <div className="space-y-3">
                {altosDptoGuide.usefulServices
                  .filter((s) => s.category === 'Supermercado')
                  .map((item) => (
                    <ItemCard
                      key={item.label}
                      title={item.label}
                      description={item.description}
                      address={item.address}
                      phone={item.phone}
                      mapsUrl={item.href}
                    />
                  ))}
              </div>
            )}

            {currentView === 'gastronomia' && (
              <div className="space-y-3">
                <NoticeBox text="Horarios y reservas sujetos a disponibilidad de temporada. Se recomienda comunicarse previamente." />
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
                <NoticeBox text="Coordinar visitas guiadas y degustaciones con anticipación." />
                {altosDptoGuide.recommendations
                  .filter((r) => r.category === 'Bodegas')
                  .map((item) => (
                    <ItemCard
                      key={item.label}
                      title={item.label}
                      description={item.description}
                      address={item.address}
                      reservationPhone={item.reservationPhone}
                      badge={item.badge}
                      mapsUrl={item.href}
                    />
                  ))}
              </div>
            )}

            {currentView === 'lugares' && (
              <div className="space-y-3">
                {altosDptoGuide.recommendations
                  .filter((r) => r.category === 'Localidades')
                  .map((item) => (
                    <ItemCard
                      key={item.label}
                      title={item.label}
                      description={item.description}
                      address={item.address}
                      mapsUrl={item.href}
                    />
                  ))}
              </div>
            )}

            {currentView === 'excursiones' && (
              <div className="space-y-3">
                {altosDptoGuide.recommendations
                  .filter((r) => r.category === 'Excursiones')
                  .map((item) => (
                    <ItemCard
                      key={item.label}
                      title={item.label}
                      description={item.description}
                      phone={item.phone}
                      badge={item.badge}
                      externalUrl={item.href}
                    />
                  ))}

                {/* Mapa Turístico Completo */}
                <div className="rounded-[18px] border border-[#E1E1E0] bg-white p-5 text-center shadow-sm">
                  <MapPinned className="mx-auto h-7 w-7 text-[#2F6F73]" />
                  <h3 className="mt-2 text-sm font-bold text-[#262622]">Mapa Turístico Oficial del Bermejo</h3>
                  <p className="mt-1 text-xs text-[#676764]">
                    Atractivos naturales, rutas, miradores y servicios en Google My Maps.
                  </p>
                  <a
                    href={altosDptoGuide.touristMapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-[#2F6F73] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#255B5E]"
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

      {/* Botón flotante persistente de WhatsApp estilo demo */}
      <aside aria-label="Contacto por WhatsApp">
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#F1EDE4] via-[#F1EDE4]/95 to-transparent px-4 pb-4 pt-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mx-auto flex h-13 max-w-[490px] items-center justify-center gap-2 rounded-2xl bg-[#1F9D55] px-4 font-bold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-[#1a8548] active:scale-[0.99]"
          >
            <MessageCircle className="h-5 w-5 fill-current" aria-hidden="true" />
            <span className="text-sm">Consultar por WhatsApp</span>
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
  isAlert,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  isAlert?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-[14px] border bg-white p-2 text-center transition active:scale-95 hover:border-[#2F6F73]/50 hover:shadow-sm ${
        isAlert ? 'border-[#C9A265]' : 'border-[#E1E1E0]'
      }`}
    >
      {isAlert && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#C9A265]" />}
      <Icon className="h-6 w-6 text-[#2F6F73]" aria-hidden="true" />
      <span className="text-[12px] font-semibold leading-tight text-[#262622]">{label}</span>
    </button>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[18px] border border-[#E1E1E0] bg-white p-5 shadow-sm">
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#2F6F73]">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function KvRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#F0ECE4] py-2.5 last:border-b-0 last:pb-0">
      <span className="text-xs font-medium text-[#676764]">{label}</span>
      <span className="text-right text-xs font-bold text-[#262622]">{value}</span>
    </div>
  );
}

function NoticeBox({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-[#E2DDD5] bg-white/70 p-3 text-xs text-[#676764]">
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
  badge,
  mapsUrl,
  externalUrl,
}: {
  title: string;
  description: string;
  address?: string;
  phone?: string;
  reservationPhone?: string;
  badge?: string;
  mapsUrl?: string;
  externalUrl?: string;
}) {
  const contactNumber = reservationPhone || phone;
  return (
    <article className="rounded-[18px] border border-[#E1E1E0] bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold text-[#262622]">{title}</h4>
        {badge && (
          <span className="rounded-full bg-[#EFE9DF] px-2 py-0.5 text-[10px] font-bold text-[#7C5B29]">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-[#676764]">{description}</p>
      {address && <p className="mt-1.5 text-[11px] text-slate-500">📍 {address}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        {contactNumber && (
          <a
            href={`tel:${contactNumber.replace(/[\s+-]/g, '')}`}
            className="inline-flex items-center gap-1 rounded-lg border border-[#D7D3CB] bg-[#F4F4F4] px-2.5 py-1 text-[11px] font-semibold text-[#262622] hover:bg-slate-100"
          >
            <Phone className="h-3 w-3 text-[#2F6F73]" />
            Llamar
          </a>
        )}

        {mapsUrl && (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-[#D7D3CB] bg-[#F4F4F4] px-2.5 py-1 text-[11px] font-semibold text-[#262622] hover:bg-slate-100"
          >
            <MapPin className="h-3 w-3 text-[#2F6F73]" />
            Cómo llegar
            <ExternalLink className="h-3 w-3 text-[#676764]" />
          </a>
        )}

        {externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg bg-[#2F6F73] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#255B5E]"
          >
            Consultar experiencia
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
    case 'lugares':
      return 'Lugares para descubrir';
    case 'excursiones':
      return 'Excursiones y Transfers';
    default:
      return 'Guía';
  }
}
