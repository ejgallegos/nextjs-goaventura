import { describe, expect, it } from 'vitest';

import { vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('../data/accommodations', () => ({
  accommodations: [
    { id: 'loft-centro', slug: 'loft-centro', maxCapacity: 2 },
    { id: 'altos-del-talampaya-casa', slug: 'altos-del-talampaya-casa', maxCapacity: 8 },
    { id: 'altos-del-talampaya-casa-ii', slug: 'altos-del-talampaya-casa-ii', maxCapacity: 2 },
    { id: 'casa-altos-del-talampaya-iii', slug: 'casa-altos-del-talampaya-iii', maxCapacity: 4 },
    { id: 'altos-del-talampaya-dpto', slug: 'altos-del-talampaya-dpto', maxCapacity: 2 },
  ],
}));

import {
  queryAvailability,
  type AvailabilitySourceState,
} from './availability-engine';

const slugs = [
  'loft-centro',
  'altos-del-talampaya-casa',
  'altos-del-talampaya-casa-ii',
  'casa-altos-del-talampaya-iii',
  'altos-del-talampaya-dpto',
] as const;

const capacities = [2, 8, 2, 4, 2] as const;

function states(
  patch: Partial<AvailabilitySourceState> = {},
): AvailabilitySourceState[] {
  return slugs.map((accommodationSlug, index) => ({
    accommodationSlug,
    sourceStatus: 'active',
    latestRunStatus: 'succeeded',
    latestSuccessfulAt: new Date('2026-10-01T12:00:00Z'),
    maxCapacity: capacities[index],
    overlappingPeriods: [],
    ...patch,
  }));
}

const dependencies = (sourceStates: AvailabilitySourceState[], now = '2026-10-01T12:00:00Z') => ({
  clock: () => new Date(now),
  readState: async () => sourceStates,
});

describe('availability query engine', () => {
  it('returns all accommodations in stable catalog order', async () => {
    const result = await queryAvailability(
      { checkIn: '2026-10-10', checkOut: '2026-10-12', guests: 1 },
      dependencies(states()),
    );

    expect(result.map((item) => item.accommodationSlug)).toEqual(slugs);
    expect(result.map((item) => item.maxCapacity)).toEqual(capacities);
    expect(result.every((item) => item.status === 'DISPONIBLE')).toBe(true);
  });

  it('uses half-open overlap semantics, including shared checkout/checkin', async () => {
    const sourceStates = states();
    sourceStates[0].overlappingPeriods = [
      { checkIn: '2026-10-10', checkOut: '2026-10-12' },
    ];

    const sharedBoundary = await queryAvailability(
      { checkIn: '2026-10-12', checkOut: '2026-10-13', guests: 1 },
      dependencies(sourceStates),
    );
    expect(sharedBoundary[0].status).toBe('DISPONIBLE');

    const partialOverlap = await queryAvailability(
      { checkIn: '2026-10-11', checkOut: '2026-10-13', guests: 1 },
      dependencies(sourceStates),
    );
    expect(partialOverlap[0].status).toBe('OCUPADO');
  });

  it('gives capacity insufficiency precedence over occupancy', async () => {
    const sourceStates = states();
    sourceStates[0].overlappingPeriods = [
      { checkIn: '2026-10-10', checkOut: '2026-10-12' },
    ];

    const result = await queryAvailability(
      { checkIn: '2026-10-10', checkOut: '2026-10-11', guests: 3 },
      dependencies(sourceStates),
    );
    expect(result[0].status).toBe('CAPACIDAD_INSUFICIENTE');
  });

  it('fails closed when the source is missing, failed, running, or no-data', async () => {
    const sourceStates = states();
    sourceStates[0].sourceStatus = 'inactive';
    sourceStates[1].latestRunStatus = 'failed';
    sourceStates[2].latestRunStatus = 'running';
    sourceStates[3].latestRunStatus = 'no_data';
    sourceStates[4].latestRunStatus = undefined;

    const result = await queryAvailability(
      { checkIn: '2026-10-10', checkOut: '2026-10-11', guests: 1 },
      dependencies(sourceStates),
    );
    expect(result.map((item) => item.status)).toEqual([
      'NO_VERIFICABLE',
      'NO_VERIFICABLE',
      'NO_VERIFICABLE',
      'NO_VERIFICABLE',
      'NO_VERIFICABLE',
    ]);
  });

  it('rejects missing, invalid, past, and non-positive date ranges', async () => {
    const deps = dependencies(states());
    await expect(queryAvailability({ checkIn: '', checkOut: '2026-10-11', guests: 1 }, deps))
      .rejects.toMatchObject({ code: 'INVALID_DATE' });
    await expect(queryAvailability({ checkIn: '2026-02-29', checkOut: '2026-03-01', guests: 1 }, deps))
      .rejects.toMatchObject({ code: 'INVALID_DATE' });
    await expect(queryAvailability({ checkIn: '2026-09-30', checkOut: '2026-10-02', guests: 1 }, deps))
      .rejects.toMatchObject({ code: 'PAST_DATE' });
    await expect(queryAvailability({ checkIn: '2026-10-11', checkOut: '2026-10-11', guests: 1 }, deps))
      .rejects.toMatchObject({ code: 'INVALID_RANGE' });
    await expect(queryAvailability({ checkIn: '2026-10-10', checkOut: '2026-10-11', guests: 0 }, deps))
      .rejects.toMatchObject({ code: 'INVALID_GUESTS' });
    await expect(queryAvailability({ checkIn: '2026-10-10', checkOut: '2026-10-11', guests: 1.5 }, deps))
      .rejects.toMatchObject({ code: 'INVALID_GUESTS' });
  });

  it('uses the La Rioja local date independently of server timezone', async () => {
    const deps = dependencies(states(), '2026-10-01T02:30:00.000Z');
    await expect(queryAvailability(
      { checkIn: '2026-09-30', checkOut: '2026-10-01', guests: 1 },
      deps,
    )).resolves.toHaveLength(5);
    await expect(queryAvailability(
      { checkIn: '2026-09-29', checkOut: '2026-10-01', guests: 1 },
      deps,
    )).rejects.toMatchObject({ code: 'PAST_DATE' });
  });

  it('sanitizes database failures', async () => {
    await expect(queryAvailability(
      { checkIn: '2026-10-10', checkOut: '2026-10-11', guests: 1 },
      { ...dependencies(states()), readState: async () => { throw new Error('encrypted ICS URL'); } },
    )).rejects.toMatchObject({ code: 'QUERY_UNAVAILABLE', message: 'QUERY_UNAVAILABLE' });
  });
});
