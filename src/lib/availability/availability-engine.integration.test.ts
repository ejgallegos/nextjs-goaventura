import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

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

import { eq, sql } from 'drizzle-orm';
import { getDb } from '../db';
import { calendarSources, occupancyPeriods, syncRuns } from '../db/schema';
import { queryAvailability } from './availability-engine';

const runtime = process.env.AVAILABILITY_RUNTIME_TEST === '1' ? describe : describe.skip;
let db: ReturnType<typeof getDb>;
let sourceIds: Record<string, string>;

beforeEach(async () => {
  if (process.env.AVAILABILITY_RUNTIME_TEST !== '1') return;
  db = getDb();
  await db.execute(sql`truncate table calendar_sources cascade`);
  const rows = await db.insert(calendarSources).values([
    'loft-centro',
    'altos-del-talampaya-casa',
    'altos-del-talampaya-casa-ii',
    'casa-altos-del-talampaya-iii',
    'altos-del-talampaya-dpto',
  ].map((accommodationSlug) => ({
    accommodationSlug,
    icsUrl: 'runtime-placeholder',
    status: 'active' as const,
  }))).returning({ id: calendarSources.id, slug: calendarSources.accommodationSlug });
  sourceIds = Object.fromEntries(rows.map((row) => [row.slug, row.id]));
  await db.insert(syncRuns).values(rows.map((row) => ({
    calendarSourceId: row.id,
    status: 'succeeded' as const,
    startedAt: new Date('2026-10-01T11:00:00Z'),
    completedAt: new Date('2026-10-01T12:00:00Z'),
  })));
});

afterAll(async () => {
  if (process.env.AVAILABILITY_RUNTIME_TEST === '1') await db.execute(sql`truncate table calendar_sources cascade`);
});

runtime('availability engine PostgreSQL boundary', () => {
  it('uses PostgreSQL half-open overlap and returns stable order with capacity precedence', async () => {
    await db.insert(occupancyPeriods).values({
      calendarSourceId: sourceIds['loft-centro'],
      externalEventId: 'runtime-overlap',
      checkIn: '2026-10-10',
      checkOut: '2026-10-12',
    });
    const shared = await queryAvailability(
      { checkIn: '2026-10-12', checkOut: '2026-10-13', guests: 1 },
      { clock: () => new Date('2026-10-01T12:00:00Z') },
    );
    expect(shared.map((item) => item.accommodationSlug)).toHaveLength(5);
    expect(shared[0].status).toBe('DISPONIBLE');

    const overlap = await queryAvailability(
      { checkIn: '2026-10-11', checkOut: '2026-10-13', guests: 1 },
      { clock: () => new Date('2026-10-01T12:00:00Z') },
    );
    expect(overlap[0].status).toBe('OCUPADO');
    expect((await queryAvailability(
      { checkIn: '2026-10-10', checkOut: '2026-10-11', guests: 3 },
      { clock: () => new Date('2026-10-01T12:00:00Z') },
    ))[0].status).toBe('CAPACIDAD_INSUFICIENTE');
  });

  it('fails closed for missing, failed, running, and no-data source state', async () => {
    await db.delete(calendarSources).where(eq(calendarSources.id, sourceIds['loft-centro']));
    await db.update(syncRuns).set({ status: 'failed', completedAt: new Date('2026-10-01T13:00:00Z') })
      .where(eq(syncRuns.calendarSourceId, sourceIds['altos-del-talampaya-casa']));
    await db.update(syncRuns).set({ status: 'running', completedAt: null })
      .where(eq(syncRuns.calendarSourceId, sourceIds['altos-del-talampaya-casa-ii']));
    await db.update(syncRuns).set({ status: 'no_data', completedAt: new Date('2026-10-01T13:00:00Z') })
      .where(eq(syncRuns.calendarSourceId, sourceIds['casa-altos-del-talampaya-iii']));

    const result = await queryAvailability(
      { checkIn: '2026-10-01', checkOut: '2026-10-02', guests: 1 },
      { clock: () => new Date('2026-10-01T02:30:00Z') },
    );
    expect(result.map((item) => item.status)).toEqual([
      'NO_VERIFICABLE',
      'NO_VERIFICABLE',
      'NO_VERIFICABLE',
      'NO_VERIFICABLE',
      'DISPONIBLE',
    ]);
  });
});
