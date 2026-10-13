import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AvailabilityDashboard } from '../../app/admin/disponibilidad/availability-dashboard';
import {
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
    expect(validateAvailabilityForm({ checkIn: '2026-10-10', checkOut: '2026-10-12', guests: '2' })).toBeNull();
    expect(safeAvailabilityMessage('https://secret.example/feed.ics raw stack')).toBe('No se pudo completar la consulta. Intentá nuevamente.');
  });

  it('renders an accessible, mobile-first blocking synchronization state', () => {
    const markup = renderToStaticMarkup(React.createElement(AvailabilityDashboard));
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('Esperando la sincronización inicial');
    expect(markup).toContain('for="availability-check-in"');
    expect(markup).toContain('focus-visible:ring-2');
    expect(markup).toContain('sm:grid-cols-3');
    expect(markup).toContain('motion-reduce:transition-none');
    expect(markup).not.toContain('feed.ics');
  });
});
