import 'server-only';

import { and, desc, eq, sql } from 'drizzle-orm';

import { getDb, type Database } from '../db';
import { emptyFeedApprovals, occupancyPeriods, syncRuns } from '../db/schema';

export type EmptyFeedApprovalResult =
  | { status: 'approved'; syncRunId: string; cleared: number }
  | { status: 'rejected'; code: 'BUSY' | 'INVALID_RUN' | 'STALE_RUN' | 'ALREADY_REVIEWED' };

function lockAcquired(result: unknown): boolean {
  return (result as Array<{ locked?: boolean }>)[0]?.locked === true;
}

export async function approveEmptyFeed(
  sourceId: string,
  syncRunId: string,
  dependencies: { db?: Database; now?: () => Date } = {},
): Promise<EmptyFeedApprovalResult> {
  const db = dependencies.db ?? getDb();
  const now = dependencies.now ?? (() => new Date());

  return db.transaction(async (tx) => {
    const lock = await tx.execute(sql`select pg_try_advisory_xact_lock(hashtextextended(${sourceId}, 0)) as locked`);
    if (!lockAcquired(lock)) return { status: 'rejected', code: 'BUSY' };

    const [run] = await tx.select({ id: syncRuns.id, status: syncRuns.status })
      .from(syncRuns)
      .where(and(eq(syncRuns.id, syncRunId), eq(syncRuns.calendarSourceId, sourceId)))
      .limit(1);
    if (!run || run.status !== 'no_data') return { status: 'rejected', code: 'INVALID_RUN' };

    const [latest] = await tx.select({ id: syncRuns.id })
      .from(syncRuns).where(eq(syncRuns.calendarSourceId, sourceId))
      .orderBy(desc(syncRuns.reservationSequence)).limit(1);
    if (latest?.id !== syncRunId) return { status: 'rejected', code: 'STALE_RUN' };

    const [approval] = await tx.select({ id: emptyFeedApprovals.id, previousPeriodCount: emptyFeedApprovals.previousPeriodCount })
      .from(emptyFeedApprovals)
      .where(and(eq(emptyFeedApprovals.syncRunId, syncRunId), eq(emptyFeedApprovals.status, 'pending')))
      .limit(1);
    if (!approval) return { status: 'rejected', code: 'ALREADY_REVIEWED' };

    await tx.delete(occupancyPeriods).where(eq(occupancyPeriods.calendarSourceId, sourceId));
    const [reviewed] = await tx.update(emptyFeedApprovals).set({ status: 'approved', reviewedAt: now() })
      .where(and(eq(emptyFeedApprovals.id, approval.id), eq(emptyFeedApprovals.status, 'pending')))
      .returning({ id: emptyFeedApprovals.id });
    if (!reviewed) return { status: 'rejected', code: 'ALREADY_REVIEWED' };
    return { status: 'approved', syncRunId, cleared: approval.previousPeriodCount };
  });
}
