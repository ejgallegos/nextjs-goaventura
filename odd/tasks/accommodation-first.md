# Accommodation-First Repositioning

## Objective
Make Villa Unión accommodation the primary GoAventura offer across the home page, global navigation, accommodation catalog/detail pages, and travel pages while preserving existing data, Booking/WhatsApp destinations, routes, and SEO.

## Problem and Why
The home page currently leads with a generic hero and travel experiences before accommodation, weakening the primary stay-booking journey. The user approved an accommodation-first repositioning with concise cross-selling and conversion analytics.

## Authorized Scope
- Reorder and refine the home page, shared desktop/mobile/footer navigation, accommodation catalog and detail pages, and existing `/viajes` pages.
- Add privacy-safe, failure-tolerant analytics for accommodation views, Booking clicks, WhatsApp inquiries, and accommodation-detail experience clicks, reusing the current analytics mechanism.
- Improve responsive behavior, image sizing, focus visibility, touch target sizes, and reduced-motion handling in touched UI.
- Preserve all existing accommodation/travel/promotion data, booking and WhatsApp destinations, routes, and unrelated content/assets.
- Create local work-unit commits only; do not push or create a pull request.

## Constraints and TDD
- Strict TDD is enabled by project instructions.
- `package.json` has no general test runner or `test` script; only `test-admin` exists for the admin subsystem. Record this limitation rather than inventing RED evidence. Use applicable typecheck/lint/build and structural checks.
- Route: delegated direct implementation (single bounded writer).
- Delivery strategy: `ask-on-risk`; user explicitly requested no commits, so return suggested work-unit commit boundaries without committing.
- Engram mirror: synced to project topic `odd/accommodation-first/tasks` after confirming the runtime exposes the Engram save tool.

## Acceptance Criteria
1. Home opens with a Villa Unión accommodation-first hero; accommodation catalog and featured stay appear before any complementary travel content.
2. Complementary travel/promotions/transfers appear under `Completá tu estadía`; home shows no more than three complementary experiences/promotions and has honest loading/empty states.
3. Header desktop/mobile and footer use the exact order: Inicio, Alojamientos, Excursiones y viajes, Shorts, Nosotros, Contacto. Travel remains at `/viajes` with its content intact.
4. Accommodation catalog/details emphasize stays. Each detail page places compact cross-selling after reservation CTAs, limited to published trips/promotions, with a clear empty state.
5. Existing travel pages frame products as completing the stay without changing routes or breaking metadata/SEO.
6. Analytics track accommodation-detail views, Booking clicks, WhatsApp inquiries, and experience clicks from details; send no personal data and no-op safely when analytics is unavailable.
7. Touched layouts remain usable at 375/768/1024/1440px without horizontal overflow, use correctly sized `next/image`, visible focus, >=44px touch targets, and honor reduced motion.
8. The main home hero is a wide, accessible editorial slider with accommodation-first ordering and published complementary travel/promotions; each slide has at most one contextual CTA (`Ver alojamiento`, `Ver experiencia`, or `Ver promoción`) using existing internal routes, plus discreet navigation controls; no cards or autoplay.

## Tasks
- [x] AF-01 — Reorder the home page around accommodation-first conversion and bounded complementary offers. Added a Villa Unión accommodation hero, listing-first cards and feature panel, then one complementary section capped at three published offers; loading and failure/empty states are explicit.
- [x] AF-02 — Align shared header/footer navigation and accommodation/travel page positioning. Header desktop/mobile and footer now share the required order and `/viajes` is unchanged; accommodation catalog hero uses a listing photo and travel list copy frames offers as stay add-ons.
- [x] AF-03 — Add published-only post-reservation cross-selling and resilient conversion analytics. Detail pages render up to two published trips/promotions after reservation CTAs, with an explicit empty state; analytics uses a guarded GA4 helper for accommodation views, Booking, WhatsApp, and cross-sell clicks.
- [x] AF-04 — Run available project checks and record inaccessible visual/runtime verification as blocked by the sandbox.
- [x] AF-05 — Move Booking click tracking into a Client Component compatible with the Server Component detail route and correct hero image `sizes` to reflect its full viewport width.
- [x] AF-06 — Redesign shared travel cards with one bordered, rounded surface; contained media; a consistent-height content area; and separate, responsive actions without overlap or clipping.
- [x] AF-07 — Distinguish a genuinely empty cross-sell catalog from temporary product/promotion source failures while retaining offers from a successful source.
- [superseded/reverted] AF-08 — Earlier standalone stay/experience slider attempt was reverted; it is not part of the current implementation or acceptance evidence.
- [x] AF-09 — Replaced the static main home hero with an accommodation-first editorial slider sourced from existing accommodation assets and published experiences/promotions, without changing the home sections that follow.

## Checks
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `git diff --check`
- Focused lint for `src/app/page.tsx` and the new hero slider component.
- General unit/integration tests: unavailable (no general test runner/test script in `package.json`).
- Runtime/browser checks at 375/768/1024/1440px if a local preview can be safely run.

## Progress and Evidence
- Initial state: branch `codex/accommodation-first`; worktree reported clean.
- Before source changes: verified no general test script in `package.json`; strict TDD RED phase cannot run with the available project test configuration.
- AF-01 implementation: `src/app/page.tsx` now places accommodation discovery and the featured stay before the capped `Completá tu estadía` section; legacy Shorts, testimonials, trust, and brand sections remain after the primary stay journey.
- AF-02 implementation: `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`, `src/app/alojamientos/page.tsx`, and `src/app/viajes/viajes-list.tsx` keep routes intact while establishing the specified labels/order and lodging-first catalog imagery.
- AF-03 implementation: `src/app/alojamientos/[slug]/page.tsx`, `src/components/accommodation-experience-card.tsx`, `src/components/accommodation-page-tracker.tsx`, `src/components/whatsapp-cta-button.tsx`, `src/components/product-card.tsx`, and `src/lib/analytics.ts` implement published-only cross-selling and fail-safe event dispatch with non-identifying parameters.
- Follow-up defects fixed: Booking click tracking now lives in reusable Client Component `src/components/booking-cta-link.tsx`, keeping the accommodation route a valid Server Component; the full-bleed home hero declares `sizes="100vw"`.
- AF-06 implementation: `src/components/product-card.tsx` now has one card surface with a subtle border/shadow, top-only rounded media, aligned title/description slots, and an action footer inside the surface. Buttons stack on narrow cards and form two columns only at XL widths; the home uses this shared card for its complementary trip/promotion offers. Focus styling and reduced-motion behavior remain explicit.
- AF-07 implementation: `src/app/alojamientos/[slug]/page.tsx` now loads products and promotions with `Promise.allSettled`, keeps published offers from successful sources, and distinguishes a failed empty result from a genuinely empty catalog. When no published offer is available and at least one source fails, it presents a temporary-availability message and WhatsApp CTA; the true-empty message is unchanged. Strict TDD RED is unavailable because this project has no general test runner; no RED evidence is claimed.
- AF-07 checks: focused ESLint for `src/app/alojamientos/[slug]/page.tsx` passed with no warnings/errors; `npm run typecheck` passed; `npm run build` passed and generated all 50 static pages; `git diff --check` passed. Build reported existing dependency warnings for the optional `@opentelemetry/exporter-jaeger` module and Handlebars `require.extensions`, but exited successfully.
- AF-06 checks: `npm run lint -- --file src/components/product-card.tsx` passed with no warnings or errors; `npm run typecheck` passed; `git diff --check` passed. Visual preview remains blocked: `npm run dev -- --hostname 127.0.0.1` failed with `listen EPERM` on `127.0.0.1:9002`.
- Verification: final `git diff --check`, `npm run typecheck`, and `npm run lint` passed; lint exited 0 with repository warnings, none naming the touched files. No general test runner is configured. The first two `npm run build` attempts failed during `Generating static pages (12/50)` with `Next.js build worker exited with code: 1 and signal: null`; after the RSC correction, the latest `npm run build` passed and generated all 50 static pages. A dev-server attempt for viewport checks failed before startup with `listen EPERM: operation not permitted 0.0.0.0:9002`, so 375/768/1024/1440 browser verification could not run.
- Delivery: `e419b7a feat(home): prioritize accommodation discovery` and `8a70e5f feat(accommodations): add complementary travel suggestions` preserve the first two verified work units locally. The remaining navigation and positioning work is staged as the final local work unit; no branch has been pushed and no pull request exists.
- Persistence: the runtime did expose Engram, contrary to the initial handoff assumption; the complete task document was mirrored under `odd/accommodation-first/tasks`.
- AF-09 scope update: the earlier standalone AF-08 attempt was reverted. The approved slider replaces the main static hero, starts with a stay and keeps at least half of slides as accommodation. Initially CTAs were excluded; a subsequent authorized change allows one contextual internal Link CTA per slide. No cards or autoplay; navigation controls remain keyboard-accessible. Reuse existing imagery and packages, keep the other home content untouched, and use the established logo palette.
- Strict TDD remains enabled, but the repository has no general test runner/test script; do not invent RED evidence. Record focused lint/typecheck/build/diff results when observed.
- Route for AF-09: delegated direct (assigned single writer); task document created/reconciled before source edits. Delivery strategy remains `ask-on-risk`; no commit is authorized for this task.
- AF-09 starting-state note: the existing `public/data/shorts.json` worktree modification was unrelated to this task and was preserved without edits.
- AF-09 implementation: `src/components/home-hero-slider.tsx` provides a full-width, no-autoplay slider with image/type/title/description, one contextual CTA Link, and discreet previous/next controls; arrow keys work from the region or controls, focus is visible, targets are 44px, `prefers-reduced-motion` is honored, and image `sizes` is `100vw` with priority reserved for the initial slide. `src/app/page.tsx` feeds all local accommodation slides first and up to the same number of currently published product/promotion slides, interleaved so the first slide is a stay and stays are at least half; each href points to the existing accommodation, trip, or promotion detail route. Static stay slides remain while offers load or if fetching fails. Remaining home content is unchanged.
- AF-09 verification: repository `npm run lint` passed (pre-existing warnings elsewhere; no warnings in the touched files); `npm run typecheck` passed; `npm run build` passed and generated all 50 static pages, with existing optional Jaeger/Handlebars build warnings; `git diff --check` passed. Direct `npx eslint <files>` was unavailable because ESLint 9 cannot find an `eslint.config.*`; the project lint script (`next lint`) completed successfully. No general test runner exists, so strict TDD RED evidence is unavailable and was not invented. Visual viewport checks were not run because the local dev server previously failed with `listen EPERM` on port 9002.
- AF-09 layer correction: moved the hero image to `z-0`, placed the navy overlay and bottom fade above it at `z-10`, and kept all text and controls at `z-20`; removed negative image/overlay z-indexes so the opaque section background cannot conceal the image. Focused `npm run lint -- --file src/components/home-hero-slider.tsx` passed with no warnings/errors; `npm run typecheck`, `npm run build` (50 pages; existing optional Jaeger/Handlebars warnings), and `git diff --check` passed.
- AF-09 contextual CTA: added exactly one internal `Link` CTA per active slide, labeled by type (`Ver alojamiento`, `Ver experiencia`, `Ver promoción`). Accommodation links use `/alojamientos/{slug}`, products use their existing `/viajes/{slug}` route (or existing absolute path value), and promotions use `/promociones/{slug}`. The CTA has visible focus and a >=44px target; slider controls and no-autoplay behavior are unchanged. Focused lint for `src/components/home-hero-slider.tsx` and `src/app/page.tsx`, typecheck, build (50 pages), and diff check passed; build warnings remain the same pre-existing optional Jaeger/Handlebars warnings.

## Next Step
AF-09 is complete. Perform visual checks at 375/768/1024/1440px when a local browser preview is available; no commit was made.
