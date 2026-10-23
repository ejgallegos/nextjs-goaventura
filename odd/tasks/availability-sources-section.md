# Availability sources section

## Objective
Move ICS source configuration out of the daily availability dashboard into a dedicated protected section.

## Scope
- Remove the full Fuentes ICS management block from the dashboard and keep a compact navigation/status link.
- Add `/admin/disponibilidad/fuentes` with the existing source configuration, sync, and history controls.
- Preserve the protected session boundary and responsive accessibility.

## Authorized edit surfaces
- `src/app/admin/disponibilidad/availability-dashboard.tsx`
- `src/app/admin/disponibilidad/fuentes/page.tsx`
- `src/app/admin/disponibilidad/fuentes/sources-admin.tsx`

## Acceptance criteria
- Main dashboard focuses on availability queries and calendar.
- Sources page supports configure, activate/deactivate, manual sync, force sync, history, and empty-feed approval.
- Both routes require the existing availability session.
- `npm run typecheck` passes.

## Progress
- ✅ Extracted source administration into `src/app/admin/disponibilidad/fuentes/sources-admin.tsx`.
- ✅ Added protected `src/app/admin/disponibilidad/fuentes/page.tsx`.
- ✅ Dashboard now exposes only a summary and link to source administration.
- ✅ `npm run typecheck` passed.
- ✅ `npm run lint` passed with pre-existing warnings.
- ✅ `npm run build` passed with pre-existing warnings.
- ✅ Docker image rebuilt and route verified with HTTP 307 redirect when unauthenticated.
