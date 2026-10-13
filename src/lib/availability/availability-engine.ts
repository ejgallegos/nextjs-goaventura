import 'server-only';

import { and, desc, gt, lt } from 'drizzle-orm';

import { accommodations } from '../data/accommodations';
import { getDb, type Database } from '../db';
import { calendarSources, occupancyPeriods, syncRuns } from '../db/schema';

const TARGET_TIME_ZONE = 'America/Argentina/La_Rioja';

export const availabilityStatuses = [
  'DISPONIBLE',
  'OCUPADO',
  'NO_VERIFICABLE',
  'CAPACIDAD_INSUFICIENTE',
] as const;

export type AvailabilityStatus = (typeof availabilityStatuses)[number];
export type SyncState = 'running' | 'succeeded' | 'failed' | 'no_data';

export interface AvailabilityQuery {
  checkIn: string;
  checkOut: string;
  guests: number;
}

export interface OccupancyRange {
  checkIn: string;
  checkOut: string;
}

export interface AvailabilitySourceState {
  accommodationSlug: string;
  sourceStatus: 'active' | 'inactive';
  maxCapacity: number;
  latestRunStatus?: SyncState;
  latestSuccessfulAt?: Date | null;
  overlappingPeriods: readonly OccupancyRange[];
}

export interface AvailabilityResult {
  accommodationSlug: string;
  accommodationId: string;
  maxCapacity: number;
  status: AvailabilityStatus;
  verification?: {
    lastSuccessfulSyncAt: string;
  };
}

export interface AvailabilityQueryDependencies {
  clock?: () => Date;
  readState?: (
    requested: Pick<AvailabilityQuery, 'checkIn' | 'checkOut'>,
  ) => Promise<readonly AvailabilitySourceState[]>;
}

export type AvailabilityQueryErrorCode =
  | 'INVALID_DATE'
  | 'PAST_DATE'
  | 'INVALID_RANGE'
  | 'INVALID_GUESTS'
  | 'QUERY_UNAVAILABLE';

export class AvailabilityQueryError extends Error {
  readonly code: AvailabilityQueryErrorCode;

  constructor(code: AvailabilityQueryErrorCode) {
    super(code);
    this.name = 'AvailabilityQueryError';
    this.code = code;
  }
}

function isCalendarDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function localDate(now: Date): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TARGET_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function validateQuery(query: AvailabilityQuery, now: Date): void {
  if (!query || typeof query !== 'object') throw new AvailabilityQueryError('INVALID_DATE');
  if (!isCalendarDate(query.checkIn) || !isCalendarDate(query.checkOut)) {
    throw new AvailabilityQueryError('INVALID_DATE');
  }
  if (query.checkIn < localDate(now)) {
    throw new AvailabilityQueryError('PAST_DATE');
  }
  if (query.checkOut <= query.checkIn) {
    throw new AvailabilityQueryError('INVALID_RANGE');
  }
  if (!Number.isSafeInteger(query.guests) || query.guests <= 0) {
    throw new AvailabilityQueryError('INVALID_GUESTS');
  }
}

function hasOverlap(period: OccupancyRange, requested: AvailabilityQuery): boolean {
  // Half-open overlap: existing.checkIn < requested.checkOut && requested.checkIn < existing.checkOut.
  return period.checkIn < requested.checkOut && requested.checkIn < period.checkOut;
}

async function readDatabaseState(
  requested: Pick<AvailabilityQuery, 'checkIn' | 'checkOut'>,
  db: Database,
): Promise<AvailabilitySourceState[]> {
  const [sources, runs, periods] = await Promise.all([
    db.select({
      id: calendarSources.id,
      accommodationSlug: calendarSources.accommodationSlug,
      status: calendarSources.status,
    }).from(calendarSources),
    db.select({
      calendarSourceId: syncRuns.calendarSourceId,
      status: syncRuns.status,
      completedAt: syncRuns.completedAt,
      reservationSequence: syncRuns.reservationSequence,
    }).from(syncRuns).orderBy(desc(syncRuns.reservationSequence)),
    db.select({
      calendarSourceId: occupancyPeriods.calendarSourceId,
      checkIn: occupancyPeriods.checkIn,
      checkOut: occupancyPeriods.checkOut,
    }).from(occupancyPeriods).where(and(
      lt(occupancyPeriods.checkIn, requested.checkOut),
      gt(occupancyPeriods.checkOut, requested.checkIn),
    )),
  ]);

  const sourceBySlug = new Map(sources.map((source) => [source.accommodationSlug, source]));
  const latestRunBySource = new Map<string, (typeof runs)[number]>();
  for (const run of runs) {
    if (!latestRunBySource.has(run.calendarSourceId)) latestRunBySource.set(run.calendarSourceId, run);
  }
  const periodsBySource = new Map<string, OccupancyRange[]>();
  for (const period of periods) {
    const sourcePeriods = periodsBySource.get(period.calendarSourceId) ?? [];
    sourcePeriods.push(period);
    periodsBySource.set(period.calendarSourceId, sourcePeriods);
  }

  return accommodations.map((accommodation) => {
    const source = sourceBySlug.get(accommodation.slug);
    const latestRun = source ? latestRunBySource.get(source.id) : undefined;
    return {
      accommodationSlug: accommodation.slug,
      sourceStatus: source?.status ?? 'inactive',
      maxCapacity: accommodation.maxCapacity,
      latestRunStatus: latestRun?.status,
      latestSuccessfulAt: latestRun?.status === 'succeeded' ? latestRun.completedAt : null,
      overlappingPeriods: source ? periodsBySource.get(source.id) ?? [] : [],
    };
  });
}

function trustworthy(source: AvailabilitySourceState): boolean {
  return source.sourceStatus === 'active'
    && source.latestRunStatus === 'succeeded'
    && source.latestSuccessfulAt instanceof Date;
}

export async function queryAvailability(
  query: AvailabilityQuery,
  dependencies: AvailabilityQueryDependencies = {},
): Promise<AvailabilityResult[]> {
  const clock = dependencies.clock ?? (() => new Date());
  validateQuery(query, clock());
  let states: readonly AvailabilitySourceState[];
  try {
    states = await (dependencies.readState ?? ((requested) => readDatabaseState(requested, getDb())))({
      checkIn: query.checkIn,
      checkOut: query.checkOut,
    });
  } catch {
    throw new AvailabilityQueryError('QUERY_UNAVAILABLE');
  }
  const stateBySlug = new Map(states.map((state) => [state.accommodationSlug, state]));

  return accommodations.map((accommodation) => {
    const source = stateBySlug.get(accommodation.slug);
    const maxCapacity = source?.maxCapacity ?? accommodation.maxCapacity;
    const isTrustworthy = source ? trustworthy(source) : false;
    let status: AvailabilityStatus;
    // Precedence is explicit: capacity, source trust, occupancy, then availability.
    if (query.guests > maxCapacity) status = 'CAPACIDAD_INSUFICIENTE';
    else if (!isTrustworthy) status = 'NO_VERIFICABLE';
    else if (source?.overlappingPeriods.some((period) => hasOverlap(period, query))) status = 'OCUPADO';
    else status = 'DISPONIBLE';

    return {
      accommodationSlug: accommodation.slug,
      accommodationId: accommodation.id,
      maxCapacity,
      status,
      ...(isTrustworthy && source?.latestSuccessfulAt
        ? { verification: { lastSuccessfulSyncAt: source.latestSuccessfulAt.toISOString() } }
        : {}),
    };
  });
}
