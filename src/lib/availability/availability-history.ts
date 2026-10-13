import 'server-only';

import { desc, eq } from 'drizzle-orm';

import { getDb, type Database } from '../db';
import { calendarSources, syncRuns } from '../db/schema';

export interface SyncHistoryView {
  id: string;
  status: 'running' | 'succeeded' | 'failed' | 'no_data';
  startedAt: string;
  completedAt: string | null;
  eventsSeen: number;
  periodsImported: number;
  warning?: 'SYNC_FAILED' | 'SYNC_WARNING';
}

export class AvailabilityHistoryError extends Error {
  readonly code = 'SOURCE_NOT_FOUND';
  constructor() { super('SOURCE_NOT_FOUND'); }
}

export async function listSyncHistory(sourceId: string, dependencies: { db?: Database } = {}): Promise<SyncHistoryView[]> {
  const db = dependencies.db ?? getDb();
  const [source] = await db.select({ id: calendarSources.id }).from(calendarSources).where(eq(calendarSources.id, sourceId)).limit(1);
  if (!source) throw new AvailabilityHistoryError();
  const rows = await db.select({
    id: syncRuns.id, status: syncRuns.status, startedAt: syncRuns.startedAt, completedAt: syncRuns.completedAt,
    eventsSeen: syncRuns.eventsSeen, periodsImported: syncRuns.periodsImported, warning: syncRuns.warning,
  }).from(syncRuns).where(eq(syncRuns.calendarSourceId, sourceId)).orderBy(desc(syncRuns.reservationSequence));
  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    startedAt: row.startedAt.toISOString(),
    completedAt: row.completedAt?.toISOString() ?? null,
    eventsSeen: row.eventsSeen,
    periodsImported: row.periodsImported,
    ...(row.status === 'failed' ? { warning: 'SYNC_FAILED' as const } : row.warning ? { warning: 'SYNC_WARNING' as const } : {}),
  }));
}
