# Production Readiness Remediation

## Objective

Address the approved production-readiness findings for Docker/Compose, the home accommodation-card keyboard focus state, and deployment documentation without changing unrelated application behavior.

## Authorized scope and constraints

- Configure Docker builds to receive public external service configurationconfiguration only through build arguments; fail fast only for the three variables required by `src/lib/external service configuration.ts`.
- Exclude `.env.production` from the Docker build context. Never print or commit environment values or credentials.
- Keep the production container's root filesystem read-only while enabling only the Next.js image optimizer cache path to write, using the runtime UID/GID confirmed from the Dockerfile.
- Restore a visible keyboard focus indicator on home accommodation cards without changing card layout or behavior.
- Correct deployment documentation to match actual npm scripts and describe the secure Docker Compose build/run mechanism.
- Do not modify environment files, unrelated product behavior, user changes, remote services, or deployment state.
- Conventional commits only; no AI attribution.

## Route and TDD

- Route: delegated direct implementation. Mapping trigger: work spans Dockerfile, Compose, ignore rules, deployment docs, Next configuration, external service configurationconfiguration, and home UI.
- Strict TDD: enabled. No general project test runner exists for these configuration/UI changes; RED cannot be evidenced and no test will be invented.
- Engram mirror: synchronized under `odd/production-readiness/tasks`; update the mirror whenever this document changes.

## Stable tasks

- [x] PR-01 — Pass required/optional public configuration securely to Docker builds; exclude `.env.production`; document actual scripts and exact Compose invocation. Compose config accepted the local production env file; an isolated missing-required check returned nonzero with the missing external service configurationvariable name.
- [x] PR-02 — Make only the image optimizer cache writable in the read-only runtime using the actual runtime UID/GID; document validation limits. Runtime UID/GID `1001:1001` is the tmpfs owner; actual write verification is documented as a post-deploy command and intentionally not run because deployment/container execution is out of scope.
- [x] PR-03 — Add a visible `focus-visible` indicator to home accommodation card links. Added accent focus ring with offset; no layout/behavior changes.

## Acceptance criteria

- Compose rejects missing `external service configuration`, `external service configuration`, or `external service configuration` with a clear error, and forwards optional public settings when supplied.
- No external service configurationvalues are hardcoded into the Dockerfile; `.env.production` is not included in the Docker build context.
- Compose syntax/config validation succeeds without printing environment values; image cache is writable by the configured non-root runtime while other filesystem paths remain read-only.
- Home accommodation card keyboard focus is visibly distinguishable and existing interaction/layout is preserved.
- Deployment docs name only real package scripts and specify a safe build/run command.
- `git diff --check`, `npm run typecheck`, `npm run lint`, and `npm run build` complete; report any environmental failure precisely.

## Verification and rollback evidence

- Run `docker compose --env-file .env.production -f docker-compose.production.yml config --quiet` without rendering resolved values, plus an expected-failure missing-required-variable check.
- Run `git diff --check`, `npm run typecheck`, `npm run lint`, and `npm run build`.
- Do not build or run an image or contact a registry/remote service. If mount ownership cannot be tested without running a container, document the exact remaining runtime verification and limitation.
- Roll back by reverting only the relevant conventional work-unit commit(s); preserve `.env.production` and all unrelated working-tree files.

## Progress and evidence

- Initial inspection: branch `codex/accommodation-first`, clean worktree, `HEAD=4c0a272`; Docker 29.8.1 and Compose 5.3.1 available.
- Confirmed from `src/lib/external service configuration.ts` that project ID, app ID, and API key are required; other public external service configurationfields are optional.
- Confirmed Dockerfile runtime UID/GID is `1001:1001`, root filesystem is configured read-only in Compose, and Next image optimizer writes `.next/cache/images`.
- Confirmed `.dockerignore` re-includes `.env.production` while Dockerfile uses `COPY . .`; documentation references stale npm script names.
- Implemented Docker build args for the seven known `external service configuration` values, `NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY`, and `NEXT_PUBLIC_SITE_URL`; Compose requires only external service configurationproject ID, app ID, and API key. Removed mock public config and fake Admin credential values from builder environment.
- Removed `.env.production` re-inclusion from `.dockerignore`. Deployment docs now use actual npm scripts and the Compose `--env-file ... up -d --build` command, with owner-only file permissions and public-vs-server config guidance.
- Added an explicit UID/GID-owned `/app/.next/cache/images` tmpfs while preserving `read_only: true`; documented the post-deployment write probe because no container was started.
- Added a visible `focus-visible:ring-2` indicator to home accommodation links.
- `docker compose --env-file .env.production -f docker-compose.production.yml config --quiet`: passed without output; a fully isolated missing-variable check exited 1 naming missing `external service configuration`.
- `npm run typecheck`: passed (exit 0).
- `npm run lint`: passed (exit 0), with 219 warnings reported in unrelated existing source files; no changed source file was named in the warning output.
- `npm run build`: passed (exit 0), with dependency warnings for missing `@opentelemetry/exporter-jaeger` and Handlebars `require.extensions` webpack support; static pages and route output completed.
- `git diff --check`: passed (exit 0). Docker image/container runtime write probe intentionally not run; the exact post-deploy command is in `DEPLOYMENT.md`.

## Commit evidence

- `94eb8e2` — `fix(production): harden Docker and home accessibility` (Docker/Compose configuration, deployment docs, home focus indicator, and this task record).
