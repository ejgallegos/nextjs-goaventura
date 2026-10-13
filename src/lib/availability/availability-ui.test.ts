import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AvailabilityDashboard } from '../../app/admin/disponibilidad/availability-dashboard';
import {
  calendarAccommodationRows,
  confirmEmptyFeedMessage,
  historyWarningLabel,
  sourceStatusLabel,
  validateSourceUrl,
  localCalendarDate,
  safeAvailabilityMessage,
  sortAvailabilityResults,
  validateAvailabilityForm,
} from './availability-ui';

describe('availability admin UI boundaries', () => {
  it('orders domain statuses first and preserves catalog order for ties', () => {
    const results = [
      { accommodationSlug: 'casa-iii', accommodationId: 'casa-iii', maxCapacity: 4, status: 'NO_VERIFICABLE' as const },
      { accommodationSlug: 'loft-centro', accommodationId: 'loft-centro', maxCapacity: 2, status: 'DISPONIBLE' as const },
      { accommodationSlug: 'casa-ii', accommodationId: 'casa-ii', maxCapacity: 2, status: 'DISPONIBLE' as const },
      { accommodationSlug: 'casa-altos', accommodationId: 'casa-altos', maxCapacity: 8, status: 'OCUPADO' as const },
    ];
    expect(sortAvailabilityResults(results).map((item) => item.accommodationSlug)).toEqual([
      'loft-centro', 'casa-ii', 'casa-altos', 'casa-iii',
    ]);
  });

  it('validates the search seam and never presents raw errors', () => {
    expect(validateAvailabilityForm({ checkIn: '', checkOut: '', guests: '' })).toBe('Completá las fechas y la cantidad de huéspedes.');
    expect(validateAvailabilityForm({ checkIn: '2026-10-12', checkOut: '2026-10-10', guests: '2' })).toBe('El check-out debe ser posterior al check-in.');
    expect(validateAvailabilityForm({ checkIn: '2026-10-09', checkOut: '2026-10-12', guests: '2' }, '2026-10-10')).toBe('No se permiten fechas anteriores a hoy.');
    expect(validateAvailabilityForm({ checkIn: '2026-10-10', checkOut: '2026-10-12', guests: '2' }, '2026-10-10')).toBeNull();
    expect(localCalendarDate(new Date('2026-10-10T02:00:00Z'))).toBe('2026-10-09');
    expect(safeAvailabilityMessage('https://secret.example/feed.ics raw stack')).toBe('No se pudo completar la consulta. Intentá nuevamente.');
  });

  it('groups calendar days into stable accommodation rows', () => {
    const result = { accommodationSlug: 'loft-centro', accommodationId: 'loft-centro', maxCapacity: 2, status: 'DISPONIBLE' as const };
    const rows = calendarAccommodationRows([{ date: '2026-10-10', results: [result] }]);
    expect(rows).toHaveLength(5);
    expect(rows[0]).toMatchObject({ accommodationSlug: 'loft-centro', days: [{ date: '2026-10-10', status: 'DISPONIBLE' }] });
    expect(rows[4].accommodationSlug).toBe('altos-del-talampaya-dpto');
    expect(rows[4].days).toEqual([{ date: '2026-10-10', status: 'NO_VERIFICABLE' }]);
  });

  it('validates source configuration and maps only sanitized administration labels', () => {
    expect(validateSourceUrl('http://calendar.example.test/feed.ics')).toBe('Usá una URL HTTPS válida sin credenciales.');
    expect(validateSourceUrl('https://user:secret@calendar.example.test/feed.ics')).toBe('Usá una URL HTTPS válida sin credenciales.');
    expect(validateSourceUrl('https://calendar.example.test/feed.ics')).toBeNull();
    expect(sourceStatusLabel('active', true)).toBe('Activa · configurada');
    expect(sourceStatusLabel('inactive', false)).toBe('Inactiva · sin configurar');
    expect(historyWarningLabel('failed')).toBe('Sincronización fallida');
    expect(confirmEmptyFeedMessage()).toContain('No se borrarán datos automáticamente');
  });

  it('renders an accessible, mobile-first blocking synchronization state', () => {
    const markup = renderToStaticMarkup(React.createElement(AvailabilityDashboard));
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('Esperando la sincronización inicial');
    expect(markup).toContain('for="availability-check-in"');
    expect(markup).toContain('focus-visible:ring-2');
    expect(markup).toContain('sm:grid-cols-3');
    expect(markup).toContain('min="');
    expect(markup).toContain('motion-reduce:transition-none');
    expect(markup).toContain('Información estimada');
    expect(markup).toContain('Fuentes ICS');
    expect(markup).toContain('Sincronizar todas');
    expect(markup).not.toContain('v1.secret-ciphertext');
    expect(markup).not.toContain('feed.ics');
  });
});
