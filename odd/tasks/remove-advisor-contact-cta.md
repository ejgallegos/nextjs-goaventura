# Remove Advisor Contact CTA

## Objective
Remove the user-facing “Que un asesor te contacte” CTA and equivalent advisor-contact CTA copy from the public product detail pages.

## Scope and constraints
- Authorized: the accommodation detail page, trip detail page, and the advisor-contact UI component exclusively used by those pages, plus this task document.
- Preserve unrelated booking, WhatsApp, routes, and data; keep page layouts coherent.
- Do not modify `public/data/shorts.json`.
- Remove component imports/usages and the component itself only after confirming it has no remaining callers. Keep unrelated API/analytics/service code unchanged.
- No commit; parent owns commit decisions.
- Route: delegated — three non-trivial source files (two call sites plus the CTA component).
- Strict TDD is enabled; no general test runner is registered for this text/UI removal. Do not invent tests; run the required checks.
- Engram mirror `odd/remove-advisor-contact-cta/tasks`: pending/unavailable.

## Acceptance criteria
- No user-facing instance of “Que un asesor te contacte” or same-intent variants remains in the project UI.
- No dead imports, props, or component remain from this CTA.
- Booking/WhatsApp controls and coherent spacing remain on both product detail layouts.
- `public/data/shorts.json` is untouched.

## Tasks
- [x] ADVISOR-01: Remove the CTA from both detail pages and remove the now-unused UI component.
- [x] ADVISOR-02: Search for remaining matching UI copy and run `npm run typecheck`, `npm run lint`, and `git diff --check`.

## Progress / evidence
- Initial inspection found the exact heading, a “Que un asesor me contacte” default trigger variant, and related form copy in `src/components/contact-advisor-button.tsx`; its only callers were the accommodation detail and trip detail pages.
- Removed both UI call sites and the now-unused `src/components/contact-advisor-button.tsx`. The accommodation page retains WhatsApp and Booking; the trip page retains its WhatsApp CTA. The advisor API/analytics implementation remains outside the public UI cleanup scope.
- Search verification found no remaining advisor-contact CTA copy or component references in `src`; the lone broad-match result is an internal webhook comment in `src/lib/constants.ts`, not user-facing text.
- `npm run typecheck` passed; `npm run lint` passed with existing project-wide warnings; `git diff --check` passed.
- Engram mirror remains pending.
