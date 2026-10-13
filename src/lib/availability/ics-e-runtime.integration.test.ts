import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import { eq, sql } from 'drizzle-orm';
import { getDb } from '../db';
import { calendarSources, occupancyPeriods, syncRuns } from '../db/schema';
import { approveEmptyFeed } from './ics-approval';
import { importAvailabilityPeriods } from './ics-import';
import { purgeSyncRuns } from './ics-retention';

const runtime = process.env.AVAILABILITY_RUNTIME_TEST === '1' ? describe : describe.skip;
let db: ReturnType<typeof getDb>;
const period = { checkIn: '2026-10-10', checkOut: '2026-10-12', uid: 'runtime@example.test' };
let sourceId = '';

beforeEach(async () => {
  if (process.env.AVAILABILITY_RUNTIME_TEST !== '1') return;
  db = getDb();
  await db.execute(sql`truncate table calendar_sources cascade`);
  const [source] = await db.insert(calendarSources)
    .values({ accommodationSlug: 'runtime-test', icsUrl: 'runtime-placeholder', status: 'active' })
    .returning({ id: calendarSources.id });
  sourceId = source.id;
});

afterAll(async () => {
  if (process.env.AVAILABILITY_RUNTIME_TEST === '1') await db.execute(sql`truncate table calendar_sources cascade`);
});

runtime('ICS retention and approval runtime boundary', () => {
  it('preserves then explicitly clears a no-data snapshot and rejects stale or duplicate approval', async () => {
    const first = await importAvailabilityPeriods(sourceId, [period]);
    const empty = await importAvailabilityPeriods(sourceId, []);
    expect(first.status).toBe('succeeded');
    expect(empty.status).toBe('no_data');
    if (empty.status !== 'no_data') throw new Error('runtime import did not record no_data');
    expect(await db.select().from(occupancyPeriods).where(eq(occupancyPeriods.calendarSourceId, sourceId))).toHaveLength(1);
    expect((await approveEmptyFeed(sourceId, empty.syncRunId)).status).toBe('approved');
    expect(await db.select().from(occupancyPeriods).where(eq(occupancyPeriods.calendarSourceId, sourceId))).toHaveLength(0);
    expect((await approveEmptyFeed(sourceId, empty.syncRunId)).status).toBe('rejected');
    const old = await importAvailabilityPeriods(sourceId, []);
    const newer = await importAvailabilityPeriods(sourceId, []);
    if (old.status !== 'no_data' || newer.status !== 'no_data') throw new Error('runtime imports did not record no_data');
    expect((await approveEmptyFeed(sourceId, old.syncRunId)).status).toBe('rejected');
    expect(newer.status).toBe('no_data');
  });

  it('retains running and recent runs while deleting only old terminal runs', async () => {
    const old = new Date('2026-01-01T00:00:00Z');
    const recent = new Date('2026-10-01T00:00:00Z');
    await db.insert(syncRuns).values([
      { calendarSourceId: sourceId, status: 'failed', startedAt: old, completedAt: old, error: 'x' },
      { calendarSourceId: sourceId, status: 'running', startedAt: old },
      { calendarSourceId: sourceId, status: 'failed', startedAt: recent, completedAt: recent, error: 'x' },
    ]);
    expect(await purgeSyncRuns(new Date('2026-09-01T00:00:00Z'))).toEqual({ deleted: 1 });
    expect(await db.select({ status: syncRuns.status }).from(syncRuns)).toHaveLength(2);
  });
});
