import 'server-only';

import { createHash } from 'node:crypto';
import { and, desc, eq, sql } from 'drizzle-orm';

import { getDb, type Database } from '../db';
import { calendarSources, emptyFeedApprovals, occupancyPeriods, syncRuns } from '../db/schema';
import type { OccupancyPeriod } from './ics-parser';

export type AvailabilityImportErrorCode = 'INVALID_PERIODS' | 'SOURCE_NOT_ACTIVE';

export class AvailabilityImportError extends Error {
  readonly code: AvailabilityImportErrorCode;

  constructor(code: AvailabilityImportErrorCode, message: string) {
    super(message);
    this.name = 'AvailabilityImportError';
    this.code = code;
  }
}

export type AvailabilityImportResult =
  | { status: 'busy' }
  | { status: 'succeeded' | 'no_data' | 'failed' | 'stale'; syncRunId: string; imported: number };

function importError(code: AvailabilityImportErrorCode): AvailabilityImportError {
  const messages: Record<AvailabilityImportErrorCode, string> = {
    INVALID_PERIODS: 'Availability periods are invalid',
    SOURCE_NOT_ACTIVE: 'Calendar source is not active',
  };
  return new AvailabilityImportError(code, messages[code]);
}

function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10) === value;
}

export function validateImportPeriods(periods: readonly OccupancyPeriod[]): OccupancyPeriod[] {
  const validated = periods.map((period) => {
    const uid = period.uid?.trim();
    if (!uid || !validDate(period.checkIn) || !validDate(period.checkOut) || period.checkOut <= period.checkIn) {
      throw importError('INVALID_PERIODS');
    }
    return { checkIn: period.checkIn, checkOut: period.checkOut, uid };
  });
  return validated;
}

export function deriveOccurrenceId(period: OccupancyPeriod): string {
  const uid = period.uid?.trim();
  if (!uid) throw importError('INVALID_PERIODS');
  return createHash('sha256').update(`${uid}\u0000${period.checkIn}\u0000${period.checkOut}`).digest('hex');
}

function isLockAcquired(result: unknown): boolean {
  const row = (result as Array<{ locked?: boolean }>)[0];
  return row?.locked === true;
}

export async function importAvailabilityPeriods(
  sourceId: string,
  periods: readonly OccupancyPeriod[],
  dependencies: { db?: Database } = {},
  attemptId?: string,
): Promise<AvailabilityImportResult> {
  const validated = validateImportPeriods(periods);
  const db = dependencies.db ?? getDb();

  return db.transaction(async (tx) => {
    const lock = await tx.execute(sql`select pg_try_advisory_xact_lock(hashtextextended(${sourceId}, 0)) as locked`);
    if (!isLockAcquired(lock)) return { status: 'busy' };

    const source = await tx
      .select({ id: calendarSources.id })
      .from(calendarSources)
      .where(and(eq(calendarSources.id, sourceId), eq(calendarSources.status, 'active')))
      .limit(1);
    if (source.length === 0) throw importError('SOURCE_NOT_ACTIVE');

    let runId: string;
    if (attemptId) {
      const [latest] = await tx.select({ id: syncRuns.id }).from(syncRuns)
        .where(eq(syncRuns.calendarSourceId, sourceId)).orderBy(desc(syncRuns.reservationSequence)).limit(1);
      if (latest?.id !== attemptId) {
        await tx.update(syncRuns).set({ status: 'failed', completedAt: new Date(), error: 'ICS import superseded' })
          .where(eq(syncRuns.id, attemptId));
        return { status: 'stale', syncRunId: attemptId, imported: 0 };
      }
      runId = latest.id;
    } else {
      const [run] = await tx.insert(syncRuns).values({
        calendarSourceId: sourceId,
        status: 'running',
        eventsSeen: validated.length,
        periodsImported: 0,
      }).returning({ id: syncRuns.id });
      if (!run) throw new Error('Import run could not be created');
      runId = run.id;
    }

    try {
      await tx.transaction(async (snapshotTx) => {
        if (validated.length > 0) {
          await snapshotTx.delete(occupancyPeriods).where(eq(occupancyPeriods.calendarSourceId, sourceId));
          await snapshotTx.insert(occupancyPeriods).values(validated.map((period) => ({
            calendarSourceId: sourceId,
            externalEventId: deriveOccurrenceId(period),
            checkIn: period.checkIn,
            checkOut: period.checkOut,
          })));
        }
        const status = validated.length === 0 ? 'no_data' : 'succeeded';
        await snapshotTx.update(syncRuns).set({
          status,
          eventsSeen: validated.length,
          periodsImported: validated.length,
          completedAt: new Date(),
        }).where(eq(syncRuns.id, runId));
        if (status === 'no_data') {
          const [countRow] = await snapshotTx.select({ count: sql<number>`count(*)` })
            .from(occupancyPeriods).where(eq(occupancyPeriods.calendarSourceId, sourceId));
          await snapshotTx.insert(emptyFeedApprovals).values({
            syncRunId: runId,
            syncRunStatus: 'no_data',
            status: 'pending',
            previousPeriodCount: Number(countRow?.count ?? 0),
            proposedPeriodCount: 0,
          }).onConflictDoNothing();
        }
      });
      const status = validated.length === 0 ? 'no_data' : 'succeeded';
      return { status, syncRunId: runId, imported: validated.length };
    } catch {
      await tx.update(syncRuns).set({
        status: 'failed',
        completedAt: new Date(),
        error: 'ICS import failed',
      }).where(eq(syncRuns.id, runId));
      return { status: 'failed', syncRunId: runId, imported: 0 };
    }
  });
}
