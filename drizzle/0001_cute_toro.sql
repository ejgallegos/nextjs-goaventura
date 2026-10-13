ALTER TABLE "sync_runs" ADD COLUMN "reservation_sequence" bigserial NOT NULL;--> statement-breakpoint
CREATE INDEX "sync_runs_source_reservation_lookup" ON "sync_runs" USING btree ("calendar_source_id","reservation_sequence");--> statement-breakpoint
ALTER TABLE "sync_runs" ADD CONSTRAINT "sync_runs_reservation_sequence_unique" UNIQUE("reservation_sequence");