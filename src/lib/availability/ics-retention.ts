import 'server-only';

import { and, lt, ne } from 'drizzle-orm';

import { getDb, type Database } from '../db';
import { syncRuns } from '../db/schema';

const RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

export async function purgeSyncRuns(
  cutoff = new Date(Date.now() - RETENTION_MS),
  dependencies: { db?: Database } = {},
): Promise<{ deleted: number }> {
  const db = dependencies.db ?? getDb();
  const deleted = await db.delete(syncRuns)
    .where(and(ne(syncRuns.status, 'running'), lt(syncRuns.startedAt, cutoff)))
    .returning({ id: syncRuns.id });
  return { deleted: deleted.length };
}
