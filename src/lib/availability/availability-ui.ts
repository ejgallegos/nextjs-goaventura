import type { AvailabilityResult, AvailabilityStatus } from './availability-engine';

const statusOrder: Record<AvailabilityStatus, number> = {
  DISPONIBLE: 0,
  OCUPADO: 1,
  NO_VERIFICABLE: 2,
  CAPACIDAD_INSUFICIENTE: 3,
};

export const catalogOrder = [
  'loft-centro',
  'altos-del-talampaya-casa',
  'altos-del-talampaya-casa-ii',
  'casa-altos-del-talampaya-iii',
  'altos-del-talampaya-dpto',
];

export function sortAvailabilityResults(results: readonly AvailabilityResult[]): AvailabilityResult[] {
  return results
    .map((result, index) => ({ result, index }))
    .sort((a, b) => (statusOrder[a.result.status] - statusOrder[b.result.status])
      || ((catalogOrder.indexOf(a.result.accommodationSlug) < 0 ? catalogOrder.length : catalogOrder.indexOf(a.result.accommodationSlug))
        - (catalogOrder.indexOf(b.result.accommodationSlug) < 0 ? catalogOrder.length : catalogOrder.indexOf(b.result.accommodationSlug)))
      || a.index - b.index)
    .map(({ result }) => result);
}

export function localCalendarDate(now: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Argentina/La_Rioja', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function validateAvailabilityForm(
  input: { checkIn: string; checkOut: string; guests: string },
  today?: string,
): string | null {
  if (!input.checkIn || !input.checkOut || !input.guests) return 'Completá las fechas y la cantidad de huéspedes.';
  if (today && (input.checkIn < today || input.checkOut < today)) return 'No se permiten fechas anteriores a hoy.';
  if (!Number.isSafeInteger(Number(input.guests)) || Number(input.guests) <= 0) return 'La cantidad de huéspedes debe ser positiva.';
  if (input.checkOut <= input.checkIn) return 'El check-out debe ser posterior al check-in.';
  return null;
}

export interface CalendarDayForRows {
  date: string;
  results: readonly AvailabilityResult[];
}

export interface CalendarAccommodationRow {
  accommodationId: string;
  accommodationSlug: string;
  maxCapacity?: number;
  days: Array<{ date: string; status: AvailabilityStatus }>;
}

export function calendarAccommodationRows(days: readonly CalendarDayForRows[]): CalendarAccommodationRow[] {
  const rows = new Map<string, CalendarAccommodationRow>();
  for (const slug of catalogOrder) {
    rows.set(slug, { accommodationId: slug, accommodationSlug: slug, days: [] });
  }
  for (const row of rows.values()) {
    for (const day of days) {
      const result = day.results.find((candidate) => candidate.accommodationSlug === row.accommodationSlug);
      row.maxCapacity ??= result?.maxCapacity;
      row.days.push({ date: day.date, status: result?.status ?? 'NO_VERIFICABLE' });
    }
  }
  return [...rows.values()];
}

export function safeAvailabilityMessage(error?: unknown): string {
  void error;
  return 'No se pudo completar la consulta. Intentá nuevamente.';
}
