import {
  check,
  date,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const calendarSourceStatus = pgEnum('calendar_source_status', [
  'active',
  'inactive',
]);

export const syncRunStatus = pgEnum('sync_run_status', [
  'running',
  'succeeded',
  'failed',
  'no_data',
]);

export const emptyFeedApprovalStatus = pgEnum('empty_feed_approval_status', [
  'pending',
  'approved',
  'rejected',
]);

export const calendarSources = pgTable(
  'calendar_sources',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    // Stable identity from the TypeScript catalog; the catalog is not duplicated in PostgreSQL.
    accommodationSlug: varchar('accommodation_slug', { length: 120 }).notNull(),
    icsUrl: text('ics_url'),
    status: calendarSourceStatus('status').default('inactive').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    accommodationSlugUnique: unique('calendar_sources_accommodation_slug_unique').on(
      table.accommodationSlug,
    ),
    accommodationLookup: index('calendar_sources_accommodation_lookup').on(
      table.accommodationSlug,
      table.status,
    ),
    accommodationSlugNotBlank: check(
      'calendar_sources_accommodation_slug_not_blank',
      sql`length(trim(${table.accommodationSlug})) > 0`,
    ),
    icsUrlNotBlank: check(
      'calendar_sources_ics_url_not_blank',
      sql`${table.icsUrl} is null or length(trim(${table.icsUrl})) > 0`,
    ),
    activeSourceRequiresUrl: check(
      'calendar_sources_active_requires_url',
      sql`${table.status} <> 'active' or (${table.icsUrl} is not null and length(trim(${table.icsUrl})) > 0)`,
    ),
  }),
);

export const occupancyPeriods = pgTable(
  'occupancy_periods',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    calendarSourceId: uuid('calendar_source_id')
      .notNull()
      .references(() => calendarSources.id, { onDelete: 'cascade' }),
    externalEventId: varchar('external_event_id', { length: 255 }).notNull(),
    // Occupancy uses the half-open interval [checkIn, checkOut).
    checkIn: date('check_in').notNull(),
    checkOut: date('check_out').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    sourceEventUnique: unique('occupancy_periods_source_event_unique').on(
      table.calendarSourceId,
      table.externalEventId,
    ),
    sourceRangeLookup: index('occupancy_periods_source_range_lookup').on(
      table.calendarSourceId,
      table.checkIn,
      table.checkOut,
    ),
    validHalfOpenInterval: check(
      'occupancy_periods_valid_half_open_interval',
      sql`${table.checkOut} > ${table.checkIn}`,
    ),
    externalEventIdNotBlank: check(
      'occupancy_periods_external_event_id_not_blank',
      sql`length(trim(${table.externalEventId})) > 0`,
    ),
  }),
);

export const syncRuns = pgTable(
  'sync_runs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    calendarSourceId: uuid('calendar_source_id')
      .notNull()
      .references(() => calendarSources.id, { onDelete: 'cascade' }),
    status: syncRunStatus('status').default('running').notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    eventsSeen: integer('events_seen').default(0).notNull(),
    periodsImported: integer('periods_imported').default(0).notNull(),
    warning: text('warning'),
    error: text('error'),
  },
  (table) => ({
    sourceHistoryLookup: index('sync_runs_source_history_lookup').on(
      table.calendarSourceId,
      table.startedAt,
    ),
    retentionLookup: index('sync_runs_retention_lookup').on(table.startedAt),
    nonNegativeCounters: check(
      'sync_runs_non_negative_counters',
      sql`${table.eventsSeen} >= 0 and ${table.periodsImported} >= 0`,
    ),
    completedAfterStart: check(
      'sync_runs_completed_after_start',
      sql`${table.completedAt} is null or ${table.completedAt} >= ${table.startedAt}`,
    ),
    lifecycleStatusMatchesCompletion: check(
      'sync_runs_lifecycle_status_matches_completion',
      sql`(${table.status} = 'running' and ${table.completedAt} is null) or (${table.status} <> 'running' and ${table.completedAt} is not null)`,
    ),
    idStatusUnique: unique('sync_runs_id_status_unique').on(table.id, table.status),
  }),
);

export const emptyFeedApprovals = pgTable(
  'empty_feed_approvals',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    syncRunId: uuid('sync_run_id')
      .notNull(),
    syncRunStatus: syncRunStatus('sync_run_status').default('no_data').notNull(),
    status: emptyFeedApprovalStatus('status').default('pending').notNull(),
    detectedAt: timestamp('detected_at', { withTimezone: true }).defaultNow().notNull(),
    previousPeriodCount: integer('previous_period_count').notNull(),
    proposedPeriodCount: integer('proposed_period_count').default(0).notNull(),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    reviewNotes: text('review_notes'),
  },
  (table) => ({
    syncRunUnique: unique('empty_feed_approvals_sync_run_unique').on(table.syncRunId),
    syncRunNoDataForeignKey: foreignKey({
      columns: [table.syncRunId, table.syncRunStatus],
      foreignColumns: [syncRuns.id, syncRuns.status],
      name: 'empty_feed_approvals_sync_run_no_data_fk',
    }).onDelete('cascade'),
    pendingApprovalLookup: index('empty_feed_approvals_pending_lookup').on(
      table.status,
      table.detectedAt,
    ),
    nonNegativeCounts: check(
      'empty_feed_approvals_non_negative_counts',
      sql`${table.previousPeriodCount} >= 0 and ${table.proposedPeriodCount} >= 0`,
    ),
    syncRunMustBeNoData: check(
      'empty_feed_approvals_sync_run_must_be_no_data',
      sql`${table.syncRunStatus} = 'no_data'`,
    ),
    lifecycleStatusMatchesReview: check(
      'empty_feed_approvals_lifecycle_status_matches_review',
      sql`(${table.status} = 'pending' and ${table.reviewedAt} is null) or (${table.status} <> 'pending' and ${table.reviewedAt} is not null)`,
    ),
  }),
);

export const schema = {
  calendarSources,
  occupancyPeriods,
  syncRuns,
  emptyFeedApprovals,
};
