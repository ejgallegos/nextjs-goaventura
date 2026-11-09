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
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="guest-guide-pin" className="block text-xs font-bold uppercase tracking-wider text-[#676764]">
          Clave de acceso (Wi-Fi)
        </label>
        <input
          id="guest-guide-pin"
          name="pin"
          type="text"
          value={pin}
          onChange={(event) => setPin(event.target.value)}
          placeholder="Ingresá la clave de Wi-Fi"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          minLength={4}
          maxLength={64}
          required
          className="mt-1.5 h-12 w-full rounded-xl border border-[#D7D3CB] bg-[#F4F4F4] px-4 text-center font-mono text-base font-bold tracking-wider text-[#262622] transition focus:border-[#2F6F73] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6F73]/20"
          aria-describedby={error ? 'guest-guide-pin-error' : undefined}
        />
      </div>
      {error ? (
        <p id="guest-guide-pin-error" role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-800">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#2F6F73] px-5 font-bold text-white shadow-sm transition hover:bg-[#255B5E] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-[#2F6F73] focus:ring-offset-2"
      >
        {isSubmitting ? (
          <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <KeyRound className="h-4 w-4" aria-hidden="true" />
        )}
        <span>{isSubmitting ? 'Validando…' : 'Abrir mi guía'}</span>
      </button>
    </form>
  );
}
