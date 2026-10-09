'use client';

import { FormEvent, useState } from 'react';

export function AvailabilityLoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/disponibilidad/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ username, password }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setError(body.error || 'No se pudo iniciar sesión.');
        return;
      }

      window.location.assign('/admin/disponibilidad');
    } catch {
      setError('No se pudo iniciar sesión. Intentá nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium" htmlFor="availability-username">Usuario</label>
        <input
          autoComplete="username"
          className="mt-2 w-full rounded border px-3 py-2"
          id="availability-username"
          name="username"
          onChange={(event) => setUsername(event.target.value)}
          required
          value={username}
        />
      </div>
      <div>
        <label className="block text-sm font-medium" htmlFor="availability-password">Contraseña</label>
        <input
          autoComplete="current-password"
          className="mt-2 w-full rounded border px-3 py-2"
          id="availability-password"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          required
          type="password"
          value={password}
        />
      </div>
      {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
      <button
        className="w-full rounded bg-primary px-4 py-2 font-medium text-primary-foreground disabled:opacity-50"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  );
}
