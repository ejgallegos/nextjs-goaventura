# Availability operations

This runbook covers the PostgreSQL-backed availability module. It is written
for operators who already have access to the private production host and its
secret manager. Never place production passwords, ICS URLs, encrypted values,
or session keys in Git, tickets, shell history, or command output.

## Quick path

1. Copy `.env.example` to a mode-600 `.env.production` and fill it from the
   secret manager.
2. Validate Compose interpolation without printing values:
   `docker compose --env-file .env.production -f docker-compose.production.yml config --quiet`.
3. Build the application and migration target, start PostgreSQL, run committed
   migrations, run the idempotent seed, then start the application.
4. Configure and activate each ICS source, run a manual sync, and confirm a
   successful run before relying on availability results.

The complete deployment sequence and PostgreSQL backup commands are in
[`DEPLOYMENT.md`](../DEPLOYMENT.md). PostgreSQL is internal-only; the
application remains the only public service.

## AV-905: backup, restore, and consistency checks

### Non-destructive backup preflight

The commands below use the Compose service name and do not publish a database
port. Set `BACKUP_FILE` to a new path; do not overwrite the only known-good
copy.

```bash
set -a; . .env.production; set +a
mkdir -p backups
BACKUP_FILE="backups/goaventura-$(date +%Y%m%d-%H%M%S).dump"
docker compose --env-file .env.production -f docker-compose.production.yml \
  exec -T postgres pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  --format=custom --file=- > "$BACKUP_FILE"
test -s "$BACKUP_FILE"
docker compose --env-file .env.production -f docker-compose.production.yml \
  exec -T postgres pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"
docker compose --env-file .env.production -f docker-compose.production.yml \
  exec -T postgres pg_restore --list < "$BACKUP_FILE" >/dev/null
```

`pg_restore --list` validates that the custom-format archive can be read
without changing a database. Keep at least one copy outside the application
host and record its checksum with `sha256sum "$BACKUP_FILE"`.

### Restore with an explicit confirmation gate

First run the non-destructive preflight above and inspect the archive list.
The following command refuses to run unless the operator explicitly sets
`CONFIRM_RESTORE=YES`; it stops the application before replacing database
objects and starts it again only after `pg_restore` succeeds.

```bash
set -a; . .env.production; set +a
BACKUP_FILE="backups/REEMPLAZAR.dump"
test -s "$BACKUP_FILE"
docker compose --env-file .env.production -f docker-compose.production.yml \
  exec -T postgres pg_restore --list < "$BACKUP_FILE" >/dev/null
: "${CONFIRM_RESTORE:?Set CONFIRM_RESTORE=YES after inspecting the archive}"
test "$CONFIRM_RESTORE" = YES
docker compose --env-file .env.production -f docker-compose.production.yml stop goaventura
docker compose --env-file .env.production -f docker-compose.production.yml \
  exec -T postgres pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  --clean --if-exists --exit-on-error < "$BACKUP_FILE"
docker compose --env-file .env.production -f docker-compose.production.yml start goaventura
```

After a restore, verify `docker compose ... ps`, the PostgreSQL healthcheck,
the protected availability page, and a read-only availability query. Do not
delete `goaventura-postgres-data` during ordinary recovery; deleting the
named volume is a separate, destructive disaster-recovery decision.

## AV-906: register and activate a Booking ICS source

### Secret and URL requirements

- Obtain the private Booking calendar export URL through the operator's
  approved Booking account workflow. Do not invent or commit a URL.
- The URL must be HTTPS. The application rejects credentials in the URL,
  fragments, non-standard ports, local/private/link-local/multicast/metadata
  addresses, unsafe DNS answers, and unsafe redirect targets.
- Set `AVAILABILITY_ICS_ENCRYPTION_KEY` to a base64 value decoding to exactly
  32 bytes. Generate a value in a trusted secret-management session, for
  example `openssl rand -base64 32`, then store it directly in the secret
  manager. Never print it in logs or commit it.
- The encryption key must remain stable while existing encrypted sources are
  in use. Rotate it only with a planned re-encryption/migration procedure.

### Source ownership and activation

The database seed creates exactly one inactive source for each stable
accommodation slug. Source configuration is ownership-checked: the source ID
and accommodation slug must refer to the same catalog entry. URLs are accepted
only through the protected availability administration boundary and are never
returned after encryption; the UI shows only a configured/masked state.

Preferred operator flow:

1. Sign in at `/admin/disponibilidad`.
2. Open source administration, select the matching accommodation, and paste
   the private Booking ICS URL once. Submit and confirm that only `configured`
   state is shown.
3. Activate the source only after configuration succeeds. Activation without
   an encrypted URL is rejected.
4. Run a manual synchronization. Automatic retries respect the two-minute
   cooldown; a force operation does not bypass HTTPS, DNS-pinning, parsing, or
   transactional import safeguards.
5. Confirm the sanitized history reports `succeeded` or intentionally review a
   `no_data` run. Empty feeds preserve the last valid snapshot until explicit,
   source- and run-bound approval.

For scripted administration, use the protected endpoints from an authenticated
session and send the exact origin on mutations. The request body contains the
real URL only in the private request:

```text
GET  /api/admin/disponibilidad/sources
POST /api/admin/disponibilidad/sources
     {"sourceId":"<seeded-source-uuid>","accommodationSlug":"<catalog-slug>","icsUrl":"<private-https-booking-ics-url>"}
PATCH /api/admin/disponibilidad/sources/<sourceId>
      {"status":"active"}
POST /api/admin/disponibilidad/sources/<sourceId>/sync
      {"force":false}
```

Do not paste these bodies into shared logs. A failed request should expose only
the typed sanitized error code; it must not contain the URL, encryption key,
raw ICS, resolver output, or stack trace.

## AV-907: install, deploy, health, and rollback

### Installation and migration ordering

For local dependency installation use `npm ci`. For production use the
Compose migration target, which reuses the dependency layer built into the
Docker image. It does not run `npm ci` against the network at deployment time
and applies only committed files under `drizzle/`:

```bash
cp .env.example .env.production
chmod 600 .env.production
npm ci
npm run typecheck
npm run lint
docker compose --env-file .env.production -f docker-compose.production.yml config --quiet
docker compose --env-file .env.production -f docker-compose.production.yml build goaventura db-migrate
docker compose --env-file .env.production -f docker-compose.production.yml up -d postgres
docker compose --env-file .env.production -f docker-compose.production.yml --profile tools run --rm db-migrate
docker compose --env-file .env.production -f docker-compose.production.yml --profile tools run --rm db-seed
docker compose --env-file .env.production -f docker-compose.production.yml up -d goaventura
```

The application depends on a healthy PostgreSQL service, but migration order
is an explicit operator step. Do not send traffic until migration and seed
return successfully. Check readiness with:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml ps
docker compose --env-file .env.production -f docker-compose.production.yml \
  exec -T postgres pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"
```

### Rollback boundaries

- **Application-only regression:** redeploy the previous application image and
  keep the database volume. Do not remove `goaventura-postgres-data`.
- **Migration failure:** stop before starting the application, inspect the
  migration output, and fix or prepare a forward migration. Do not hand-edit
  committed migration history or blindly downgrade PostgreSQL tables.
- **Data recovery:** use the backup preflight and explicit restore gate above;
  verify the restored snapshot before reopening traffic.
- **Bad source configuration:** deactivate the affected source. Existing valid
  snapshots remain protected; do not delete them as a first response.

### Feature-branch commit chain

Availability was delivered as reviewable work units. Preserve this order when
cherry-picking or comparing a deployment candidate; the current operations
candidate follows the test boundary at `2a323a2`.

| Boundary | Commit | Purpose |
| --- | --- | --- |
| Engine | `7136147` | Database-backed availability query |
| Import | `b09b92d` | Transactional ICS snapshot import |
| Sync | `f1cb95b` | Safe synchronization orchestration |
| Retention | `5c3eac3` | Snapshot safety, approvals, and retention |
| API | `1bc7a6c`, `911df55` | Protected administration/query APIs |
| UI | `21d35b8`, `283f3a6` | Protected dashboard and source controls |
| Tests | `15c4cb3`, `2a323a2` | Boundary and security coverage |

Do not treat a green application build as proof that PostgreSQL backups or
live migration have been exercised; run the operational checks on the target
host and retain their outputs without secrets.
