# Accommodation Need Badges

## Objective
Help visitors scan `/alojamientos` cards for capacity, explicit family suitability, pet admission, and pool availability without inventing amenities.

## Scope and constraints
- Authorized: accommodation listing card presentation and this task document only.
- Preserve current accommodation data, card links/content, responsive layout, and unrelated user changes.
- Do not modify `public/data/shorts.json` or accommodation data.
- No commit; parent owns the commit decision.
- Route: inline — one already-understood page component after inspecting its source and the accommodation data.
- Strict TDD: enabled; no general UI test runner is registered. Do not invent RED evidence or a test harness.
- Engram task mirror `odd/accommodation-need-badges/tasks`: pending; do not claim persistence.

## Acceptance criteria
- Restore `motion-reduce:transition-none` on the existing card-image hover transition.
- Each card has a compact, non-interactive capacity badge.
- Show family suitability only where source copy explicitly supports it; show pet-friendly only where admission is explicitly confirmed; show pool only where the same property's assets explicitly identify a pool.
- Keep badges readable and responsive; preserve focus visibility and card navigation.

## Tasks
- [x] NEED-01: Restore reduced-motion behavior for card image hover.
- [x] NEED-02: Add data-confirmed need badges to accommodation cards.
- [x] NEED-03: Run `npm run typecheck`, `npm run lint`, and `git diff --check`.

## Progress / evidence
- Catalog cards live in `src/app/alojamientos/page.tsx`; accommodation descriptions, services, capacity, and image alt text provide available evidence.
- NEED-01 complete: restored `motion-reduce:transition-none` on the accommodation card image transform transition.
- NEED-02 complete: every card displays its existing capacity in a compact badge; “Ideal para familias” appears only when source copy says so (Altos del Talampaya Casa), “Se admiten mascotas” only for Casa III's explicit service, and “Pileta” only when an image alt for that property names a pool (Altos del Talampaya Casa). No accommodation records were changed.
- NEED-03 verification: `npm run typecheck` passed; `npm run lint` passed with pre-existing project-wide warnings and no reported warnings for the changed page; `git diff --check` passed.
- `public/data/shorts.json` remains untouched. Engram task mirror remains pending.
