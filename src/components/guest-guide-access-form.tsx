'use client';

import { FormEvent, useState } from 'react';
import { KeyRound, LoaderCircle } from 'lucide-react';

export default function GuestGuideAccessForm() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/guest-guide/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const result = (await response.json()) as { error?: string; success?: boolean };

      if (!response.ok || !result.success) {
        setError(result.error || 'No se pudo validar el acceso.');
        return;
      }

      window.location.reload();
    } catch {
      setError('No se pudo conectar. Revisá tu conexión e intentá nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <label htmlFor="guest-guide-pin" className="block text-sm font-semibold text-slate-900">
        PIN de la estadía
      </label>
      <input
        id="guest-guide-pin"
        name="pin"
        value={pin}
        onChange={(event) => setPin(event.target.value)}
        autoComplete="one-time-code"
        inputMode="numeric"
        minLength={4}
        maxLength={64}
        required
        className="min-h-12 w-full rounded-2xl border border-slate-300 bg-white px-4 text-lg tracking-[0.24em] text-slate-950 shadow-sm transition focus:border-[#3E5C76] focus:outline-none focus:ring-4 focus:ring-[#C9DCE8]"
        aria-describedby={error ? 'guest-guide-pin-error' : undefined}
      />
      {error ? (
        <p id="guest-guide-pin-error" role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#1D2D44] px-5 py-3 font-semibold text-white shadow-lg shadow-[#1D2D44]/20 transition hover:bg-[#3E5C76] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <KeyRound className="h-5 w-5" aria-hidden="true" />}
        {isSubmitting ? 'Validando acceso…' : 'Abrir mi guía'}
      </button>
    </form>
  );
}
