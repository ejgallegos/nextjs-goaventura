# Accommodation Capacity Filter

## Objective
Add an accessible guest-count filter to `/alojamientos` so visitors can find stays that accommodate their party while keeping the page's metadata and hero server-rendered.

## Scope and constraints
- Authorized: the accommodations page, a focused client-side catalog/filter component, and this task document.
- Preserve existing accommodation data, card content/links, responsive catalog layout, metadata, and hero.
- Do not modify `public/data/shorts.json` or unrelated routes/content.
- No commit; parent will inspect and create the conventional work-unit commit.
- Route: `delegated` — writer trigger is the page plus the new client catalog/filter component (two non-trivial files).
- Strict TDD: enabled, but no general test runner is registered for this UI behavior. Do not invent RED evidence or tests; perform the listed verification commands.
- Engram mirror `odd/accommodation-capacity-filter/tasks`: pending/unavailable; local document is source of truth until synchronized.

## Acceptance criteria
- A native select is visibly labeled “¿Cuántas personas viajan?” and offers “Cualquier capacidad” plus useful numeric choices covering the catalog.
- Capacity parsing handles the catalog's present exact and ranged strings; a stay matches when its maximum capacity is at least the selected party size.
- Cards and links remain intact, with responsive layout and visible keyboard focus.
- The page announces the current result count politely, shows a clear no-results state, and provides a reset action.
- Page metadata and hero remain server-rendered.

## Tasks
- [x] CAP-01: Add the guest-count filter and filtered catalog with capacity parsing, result announcement, empty state, and reset.
- [x] CAP-02: Run and record `npm run typecheck`, `npm run lint`, `npm run build`, and `git diff --check`.

## Progress / evidence
- Exploration confirmed `src/app/alojamientos/page.tsx` is a Server Component and accommodation `capacity` values currently include `2-4 personas`, `6-8 personas`, `2 personas`, and `4 personas`.
- No general test runner is registered for this UI behavior; strict TDD RED cannot be evidenced without inventing a test harness.
- Implemented `src/components/accommodation-capacity-list.tsx` with a native guest-count select (1–8), maximum-capacity parsing, polite result count, filtered empty state, and reset controls; existing cards/links and responsive columns are retained with visible focus and reduced-motion handling.
- Kept route metadata and hero in the Server Component. The page passes only card-rendering fields to the Client Component to avoid serializing full accommodation records.
- Verification: `npm run typecheck` passed after the build generated `.next/types`; the initial concurrent run raced with Next.js build cleanup and failed on missing `.next/types`, then the rerun passed. `npm run lint` passed (repo-wide pre-existing warnings, none reported for the changed files). `npm run build` passed with existing warnings for missing optional `@opentelemetry/exporter-jaeger` and Handlebars `require.extensions`. `git diff --check` passed.
- Engram mirror `odd/accommodation-capacity-filter/tasks` remains pending; no mirror write was claimed.
