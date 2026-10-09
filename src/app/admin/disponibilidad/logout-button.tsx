'use client';

import { useState } from 'react';

export function AvailabilityLogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);
    try {
      await fetch('/api/admin/disponibilidad/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } finally {
      window.location.assign('/admin/disponibilidad/login');
    }
  }

  return (
    <button className="rounded border px-4 py-2 text-sm" disabled={isLoggingOut} onClick={logout} type="button">
      {isLoggingOut ? 'Saliendo…' : 'Cerrar sesión'}
    </button>
  );
}
