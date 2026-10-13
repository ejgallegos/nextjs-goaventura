import 'server-only';

import { and, desc, eq, sql } from 'drizzle-orm';

import { getDb, type Database } from '../db';
import { calendarSources, syncRuns } from '../db/schema';
import { fetchIcsDocument } from './safe-fetch';
import { importAvailabilityPeriods, type AvailabilityImportResult } from './ics-import';
import { parseIcsCalendar, type OccupancyPeriod } from './ics-parser';
import { isWithinSyncCooldown, resolveSyncConcurrency } from './sync-cooldown';

export interface SyncSource {
  id: string;
  icsUrl: string | null;
}

export interface SyncDataAccess {
  listActiveSources: () => Promise<SyncSource[]>;
  findActiveSource: (sourceId: string) => Promise<SyncSource | null>;
  latestAttempt: (sourceId: string) => Promise<Date | null>;
  reserveSyncAttempt?: (sourceId: string, startedAt: Date, force: boolean) => Promise<string | null>;
  recordPreImportFailure?: (sourceId: string, completedAt: Date, attemptId?: string) => Promise<void>;
}

export interface SyncDependencies {
  data?: SyncDataAccess;
  fetchDocument?: typeof fetchIcsDocument;
  parseCalendar?: typeof parseIcsCalendar;
  importPeriods?: (sourceId: string, periods: readonly OccupancyPeriod[], attemptId?: string) => Promise<AvailabilityImportResult>;
  now?: () => Date;
  concurrency?: number;
}

export interface SyncOptions {
  force?: boolean;
}

export type SyncOutcome = {
  sourceId: string;
  status: 'succeeded' | 'no_data' | 'busy' | 'cooldown' | 'failed' | 'stale';
  imported?: number;
  code?: 'COOLDOWN' | 'BUSY' | 'SOURCE_NOT_ACTIVE' | 'SOURCE_NOT_CONFIGURED' | 'SYNC_FAILED' | 'IMPORT_FAILED' | 'STALE_ATTEMPT';
};

function dbDataAccess(db: Database): SyncDataAccess {
  return {
    listActiveSources: async () => db.select({ id: calendarSources.id, icsUrl: calendarSources.icsUrl })
      .from(calendarSources)
      .where(eq(calendarSources.status, 'active'))
      .orderBy(calendarSources.id),
    findActiveSource: async (sourceId) => {
      const [source] = await db.select({ id: calendarSources.id, icsUrl: calendarSources.icsUrl })
        .from(calendarSources)
        .where(and(eq(calendarSources.id, sourceId), eq(calendarSources.status, 'active')))
        .limit(1);
      return source?.icsUrl !== undefined ? source : null;
    },
    latestAttempt: async (sourceId) => {
      const [run] = await db.select({ startedAt: syncRuns.startedAt })
        .from(syncRuns)
        .where(eq(syncRuns.calendarSourceId, sourceId))
        .orderBy(desc(syncRuns.startedAt))
        .limit(1);
      return run?.startedAt ?? null;
    },
    reserveSyncAttempt: async (sourceId, startedAt, force) => db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtextextended(${sourceId}, 0))`);
      const [latest] = await tx.select({ startedAt: syncRuns.startedAt })
        .from(syncRuns).where(eq(syncRuns.calendarSourceId, sourceId))
        .orderBy(desc(syncRuns.startedAt)).limit(1);
      if (!force && latest && isWithinSyncCooldown(startedAt, latest.startedAt)) return null;
      const [run] = await tx.insert(syncRuns).values({
        calendarSourceId: sourceId, status: 'running', startedAt, eventsSeen: 0, periodsImported: 0,
      }).returning({ id: syncRuns.id });
      return run?.id ?? null;
    }),
    recordPreImportFailure: async (sourceId, completedAt, attemptId) => {
      if (attemptId) {
        await db.update(syncRuns).set({ status: 'failed', completedAt, error: 'ICS synchronization failed' })
          .where(and(eq(syncRuns.id, attemptId), eq(syncRuns.calendarSourceId, sourceId)));
        return;
      }
      await db.insert(syncRuns).values({
        calendarSourceId: sourceId,
        status: 'failed',
        startedAt: completedAt,
        completedAt,
        eventsSeen: 0,
        periodsImported: 0,
        error: 'ICS synchronization failed',
      });
    },
  };
}

function dependenciesWithDefaults(dependencies: SyncDependencies): Required<Pick<SyncDependencies, 'data' | 'fetchDocument' | 'parseCalendar' | 'importPeriods' | 'now'>> & { concurrency?: number } {
  const data = dependencies.data ?? dbDataAccess(getDb());
  return {
    data,
    fetchDocument: dependencies.fetchDocument ?? fetchIcsDocument,
    parseCalendar: dependencies.parseCalendar ?? parseIcsCalendar,
    importPeriods: dependencies.importPeriods ?? ((sourceId, periods, attemptId) => importAvailabilityPeriods(sourceId, periods, {}, attemptId)),
    now: dependencies.now ?? (() => new Date()),
    concurrency: dependencies.concurrency,
  };
}

export async function syncSource(sourceId: string, options: SyncOptions = {}, dependencies: SyncDependencies = {}): Promise<SyncOutcome> {
  const resolved = dependenciesWithDefaults(dependencies);
  const now = resolved.now();
  const source = await resolved.data.findActiveSource(sourceId);
  if (!source) return { sourceId, status: 'failed', code: 'SOURCE_NOT_ACTIVE' };

  if (!options.force && isWithinSyncCooldown(now, await resolved.data.latestAttempt(sourceId))) {
    return { sourceId, status: 'cooldown', code: 'COOLDOWN' };
  }
  if (!source.icsUrl) return { sourceId, status: 'failed', code: 'SOURCE_NOT_CONFIGURED' };
  const attemptId = await resolved.data.reserveSyncAttempt?.(sourceId, now, options.force === true);
  if (resolved.data.reserveSyncAttempt && !attemptId) return { sourceId, status: 'cooldown', code: 'COOLDOWN' };

  let periods: OccupancyPeriod[];
  try {
    const document = await resolved.fetchDocument(source.icsUrl);
    periods = resolved.parseCalendar(document.document, { synchronizationDate: now });
  } catch {
    try {
      await resolved.data.recordPreImportFailure?.(sourceId, now, attemptId ?? undefined);
    } catch {
      // Preserve the original sanitized synchronization failure.
    }
    return { sourceId, status: 'failed', code: 'SYNC_FAILED' };
  }

  try {
    const imported = await resolved.importPeriods(sourceId, periods, attemptId ?? undefined);
    if (imported.status === 'busy') return { sourceId, status: 'busy', code: 'BUSY' };
    if (imported.status === 'failed') return { sourceId, status: 'failed', code: 'IMPORT_FAILED' };
    if (imported.status === 'stale') return { sourceId, status: 'stale', code: 'STALE_ATTEMPT' };
    return { sourceId, status: imported.status, imported: imported.imported };
  } catch {
    return { sourceId, status: 'failed', code: 'SYNC_FAILED' };
  }
}

export async function syncAllSources(options: SyncOptions = {}, dependencies: SyncDependencies = {}): Promise<SyncOutcome[]> {
  const resolved = dependenciesWithDefaults(dependencies);
  const sources = (await resolved.data.listActiveSources()).slice().sort((left, right) => left.id.localeCompare(right.id));
  const results = new Array<SyncOutcome>(sources.length);
  let nextIndex = 0;
  const worker = async () => {
    while (true) {
      const index = nextIndex++;
      if (index >= sources.length) return;
      try {
        results[index] = await syncSource(sources[index].id, options, resolved);
      } catch {
        results[index] = { sourceId: sources[index].id, status: 'failed', code: 'SYNC_FAILED' };
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(resolveSyncConcurrency(dependencies.concurrency), sources.length) }, worker));
  return results;
}
