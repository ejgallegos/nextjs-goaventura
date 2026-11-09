import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PrintButton from './print-button';

export const metadata: Metadata = {
  title: 'Lámina imprimible A4 — Altos del Talampaya Dpto',
  description: 'Lámina A4 con código QR e instrucciones para huéspedes.',
  robots: { index: false, follow: false, nocache: true },
};

export default function GuestGuidePrintSheetPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-6 sm:py-10 print:bg-white print:p-0">
      {/* Barra de control superior (no se imprime) */}
      <div className="mx-auto mb-6 flex max-w-2xl items-center justify-between px-4 print:hidden">
        <Link
          href="/guia/altos-del-talampaya-dpto"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-[#1D2D44] shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#3E5C76]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver a la guía
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500">Formato A4 optimizado</span>
          <PrintButton />
        </div>
      </div>

      {/* Hoja A4 para imprimir */}
      <main className="sheet-a4 mx-auto w-[210mm] max-w-full rounded-2xl border border-slate-200 bg-white p-[16mm] shadow-2xl print:m-0 print:w-full print:rounded-none print:border-none print:p-[12mm] print:shadow-none">
        <div className="flex h-full flex-col justify-between border-4 border-[#1D2D44] p-8 text-center sm:p-12 print:border-4 print:border-[#1D2D44] print:p-10">
          {/* Cabecera */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#1D2D44] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#C9DCE8]">
              Guía Digital de Bienvenida
            </div>
            <h1 className="mt-5 font-headline text-3xl font-black uppercase tracking-tight text-[#1D2D44] sm:text-4xl print:text-4xl">
              Altos del Talampaya Dpto
            </h1>
            <p className="mt-2 text-sm font-semibold tracking-wide text-[#3E5C76]">
              Villa Unión · La Rioja · Argentina
            </p>
            <div className="mx-auto mt-4 h-1 w-20 bg-[#3E5C76]" aria-hidden="true" />
          </div>

          {/* Bloque central: Código QR */}
          <div className="my-6">
            <p className="text-sm font-bold uppercase tracking-wider text-[#1D2D44]">
              Escaneá con tu celular para acceder
            </p>
            <div className="mx-auto mt-4 grid w-fit place-items-center rounded-3xl border-2 border-slate-200 bg-[#F9FBFC] p-4 shadow-sm print:border-2 print:border-slate-300">
              <Image
                src="/guest-guides/altos-del-talampaya-dpto/qr.svg"
                alt="Código QR de la guía privada Altos del Talampaya Dpto"
                width={260}
                height={260}
                priority
                className="h-56 w-56 sm:h-64 sm:w-64 print:h-64 print:w-64"
              />
            </div>
            <p className="mt-3 font-mono text-xs font-semibold text-slate-500">
              goaventura.com.ar/guia/altos-del-talampaya-dpto
            </p>
          </div>

          {/* Pasos / Instrucciones */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-left print:border print:border-slate-300">
            <h2 className="text-center font-headline text-sm font-black uppercase tracking-wider text-[#1D2D44]">
              Pasos para el huésped
            </h2>
            <ol className="mt-3 space-y-2.5 text-xs leading-relaxed text-[#1D2D44]">
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1D2D44] text-[11px] font-black text-white">
                  1
                </span>
                <span>
                  <strong>Escaneá el código QR</strong> apuntando con la cámara de tu smartphone.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1D2D44] text-[11px] font-black text-white">
                  2
                </span>
                <span>
                  <strong>Ingresá la clave de Wi-Fi</strong> provista para tu estadía.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#1D2D44] text-[11px] font-black text-white">
                  3
                </span>
                <span>
                  <strong>Consultá al instante</strong> la red Wi-Fi, caja de llaves, climatización, mapa y recomendaciones turísticas de Villa Unión.
                </span>
              </li>
            </ol>
          </div>

          {/* Pie de página con asistencia */}
          <div className="mt-6 border-t border-slate-200 pt-5 print:border-t print:border-slate-300">
            <p className="text-xs font-bold text-[#1D2D44]">
              ¿Dudas o consultas sobre tu estadía?
            </p>
            <p className="mt-1 text-sm font-black text-[#1D2D44]">
              WhatsApp anfitrión: <span className="font-mono text-base">+54 380 450-9885</span>
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Go Aventura · Experiencias y Alojamiento en el Valle del Bermejo
            </p>
          </div>
        </div>
      </main>

      {/* Estilos de impresión para forzar página A4 limpia */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }
        @media print {
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .sheet-a4 {
            box-shadow: none !important;
            border: none !important;
            min-height: 297mm;
            padding: 12mm !important;
          }
        }
      `}</style>
    </div>
  );
}
