import type { AvailabilityResult, AvailabilityStatus } from './availability-engine';

const statusOrder: Record<AvailabilityStatus, number> = {
  DISPONIBLE: 0,
  OCUPADO: 1,
  NO_VERIFICABLE: 2,
  CAPACIDAD_INSUFICIENTE: 3,
};

const catalogOrder = [
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

export function validateAvailabilityForm(input: { checkIn: string; checkOut: string; guests: string }): string | null {
  if (!input.checkIn || !input.checkOut || !input.guests) return 'Completá las fechas y la cantidad de huéspedes.';
  if (!Number.isSafeInteger(Number(input.guests)) || Number(input.guests) <= 0) return 'La cantidad de huéspedes debe ser positiva.';
  if (input.checkOut <= input.checkIn) return 'El check-out debe ser posterior al check-in.';
  return null;
}

export function safeAvailabilityMessage(error?: unknown): string {
  void error;
  return 'No se pudo completar la consulta. Intentá nuevamente.';
}
