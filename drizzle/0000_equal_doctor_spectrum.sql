CREATE TYPE "public"."calendar_source_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."empty_feed_approval_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."sync_run_status" AS ENUM('running', 'succeeded', 'failed', 'no_data');--> statement-breakpoint
CREATE TABLE "calendar_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"accommodation_slug" varchar(120) NOT NULL,
	"ics_url" text,
	"status" "calendar_source_status" DEFAULT 'inactive' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "calendar_sources_accommodation_slug_unique" UNIQUE("accommodation_slug"),
	CONSTRAINT "calendar_sources_accommodation_slug_not_blank" CHECK (length(trim("calendar_sources"."accommodation_slug")) > 0),
	CONSTRAINT "calendar_sources_ics_url_not_blank" CHECK ("calendar_sources"."ics_url" is null or length(trim("calendar_sources"."ics_url")) > 0),
	CONSTRAINT "calendar_sources_active_requires_url" CHECK ("calendar_sources"."status" <> 'active' or ("calendar_sources"."ics_url" is not null and length(trim("calendar_sources"."ics_url")) > 0))
);
--> statement-breakpoint
CREATE TABLE "empty_feed_approvals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sync_run_id" uuid NOT NULL,
	"sync_run_status" "sync_run_status" DEFAULT 'no_data' NOT NULL,
	"status" "empty_feed_approval_status" DEFAULT 'pending' NOT NULL,
	"detected_at" timestamp with time zone DEFAULT now() NOT NULL,
	"previous_period_count" integer NOT NULL,
	"proposed_period_count" integer DEFAULT 0 NOT NULL,
	"reviewed_at" timestamp with time zone,
	"review_notes" text,
	CONSTRAINT "empty_feed_approvals_sync_run_unique" UNIQUE("sync_run_id"),
	CONSTRAINT "empty_feed_approvals_non_negative_counts" CHECK ("empty_feed_approvals"."previous_period_count" >= 0 and "empty_feed_approvals"."proposed_period_count" >= 0),
	CONSTRAINT "empty_feed_approvals_sync_run_must_be_no_data" CHECK ("empty_feed_approvals"."sync_run_status" = 'no_data'),
	CONSTRAINT "empty_feed_approvals_lifecycle_status_matches_review" CHECK (("empty_feed_approvals"."status" = 'pending' and "empty_feed_approvals"."reviewed_at" is null) or ("empty_feed_approvals"."status" <> 'pending' and "empty_feed_approvals"."reviewed_at" is not null))
);
--> statement-breakpoint
CREATE TABLE "occupancy_periods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"calendar_source_id" uuid NOT NULL,
	"external_event_id" varchar(255) NOT NULL,
	"check_in" date NOT NULL,
	"check_out" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "occupancy_periods_source_event_unique" UNIQUE("calendar_source_id","external_event_id"),
	CONSTRAINT "occupancy_periods_valid_half_open_interval" CHECK ("occupancy_periods"."check_out" > "occupancy_periods"."check_in"),
	CONSTRAINT "occupancy_periods_external_event_id_not_blank" CHECK (length(trim("occupancy_periods"."external_event_id")) > 0)
);
--> statement-breakpoint
CREATE TABLE "sync_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"calendar_source_id" uuid NOT NULL,
	"status" "sync_run_status" DEFAULT 'running' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"events_seen" integer DEFAULT 0 NOT NULL,
	"periods_imported" integer DEFAULT 0 NOT NULL,
	"warning" text,
	"error" text,
	CONSTRAINT "sync_runs_id_status_unique" UNIQUE("id","status"),
	CONSTRAINT "sync_runs_non_negative_counters" CHECK ("sync_runs"."events_seen" >= 0 and "sync_runs"."periods_imported" >= 0),
	CONSTRAINT "sync_runs_completed_after_start" CHECK ("sync_runs"."completed_at" is null or "sync_runs"."completed_at" >= "sync_runs"."started_at"),
	CONSTRAINT "sync_runs_lifecycle_status_matches_completion" CHECK (("sync_runs"."status" = 'running' and "sync_runs"."completed_at" is null) or ("sync_runs"."status" <> 'running' and "sync_runs"."completed_at" is not null))
);
--> statement-breakpoint
ALTER TABLE "empty_feed_approvals" ADD CONSTRAINT "empty_feed_approvals_sync_run_no_data_fk" FOREIGN KEY ("sync_run_id","sync_run_status") REFERENCES "public"."sync_runs"("id","status") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "occupancy_periods" ADD CONSTRAINT "occupancy_periods_calendar_source_id_calendar_sources_id_fk" FOREIGN KEY ("calendar_source_id") REFERENCES "public"."calendar_sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_runs" ADD CONSTRAINT "sync_runs_calendar_source_id_calendar_sources_id_fk" FOREIGN KEY ("calendar_source_id") REFERENCES "public"."calendar_sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "calendar_sources_accommodation_lookup" ON "calendar_sources" USING btree ("accommodation_slug","status");--> statement-breakpoint
CREATE INDEX "empty_feed_approvals_pending_lookup" ON "empty_feed_approvals" USING btree ("status","detected_at");--> statement-breakpoint
CREATE INDEX "occupancy_periods_source_range_lookup" ON "occupancy_periods" USING btree ("calendar_source_id","check_in","check_out");--> statement-breakpoint
CREATE INDEX "sync_runs_source_history_lookup" ON "sync_runs" USING btree ("calendar_source_id","started_at");--> statement-breakpoint
CREATE INDEX "sync_runs_retention_lookup" ON "sync_runs" USING btree ("started_at");