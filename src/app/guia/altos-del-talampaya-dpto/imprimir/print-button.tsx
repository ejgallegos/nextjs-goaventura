'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-xl bg-[#1D2D44] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#3E5C76] focus:outline-none focus:ring-2 focus:ring-[#3E5C76]"
      aria-label="Imprimir lámina en papel o guardar como PDF"
    >
      <Printer className="h-4 w-4" aria-hidden="true" />
      Imprimir lámina (A4)
    </button>
  );
}
