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
1. Home opens with a Villa Unión accommodation hero and primary `Ver alojamientos` CTA plus secondary WhatsApp availability CTA; accommodation catalog and featured stay appear before any travel content.
2. Complementary travel/promotions/transfers appear under `Completá tu estadía`; home shows no more than three complementary experiences/promotions and has honest loading/empty states.
3. Header desktop/mobile and footer use the exact order: Inicio, Alojamientos, Excursiones y viajes, Shorts, Nosotros, Contacto. Travel remains at `/viajes` with its content intact.
4. Accommodation catalog/details emphasize stays. Each detail page places compact cross-selling after reservation CTAs, limited to published trips/promotions, with a clear empty state.
5. Existing travel pages frame products as completing the stay without changing routes or breaking metadata/SEO.
6. Analytics track accommodation-detail views, Booking clicks, WhatsApp inquiries, and experience clicks from details; send no personal data and no-op safely when analytics is unavailable.
7. Touched layouts remain usable at 375/768/1024/1440px without horizontal overflow, use correctly sized `next/image`, visible focus, >=44px touch targets, and honor reduced motion.

## Tasks
- [x] AF-01 — Reorder the home page around accommodation-first conversion and bounded complementary offers. Added a Villa Unión accommodation hero, listing-first cards and feature panel, then one complementary section capped at three published offers; loading and failure/empty states are explicit.
- [x] AF-02 — Align shared header/footer navigation and accommodation/travel page positioning. Header desktop/mobile and footer now share the required order and `/viajes` is unchanged; accommodation catalog hero uses a listing photo and travel list copy frames offers as stay add-ons.
- [x] AF-03 — Add published-only post-reservation cross-selling and resilient conversion analytics. Detail pages render up to two published trips/promotions after reservation CTAs, with an explicit empty state; analytics uses a guarded GA4 helper for accommodation views, Booking, WhatsApp, and cross-sell clicks.
- [x] AF-04 — Run available project checks and record inaccessible visual/runtime verification as blocked by the sandbox.
- [x] AF-05 — Move Booking click tracking into a Client Component compatible with the Server Component detail route and correct hero image `sizes` to reflect its full viewport width.

## Checks
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `git diff --check`
- General unit/integration tests: unavailable (no general test runner/test script in `package.json`).
- Runtime/browser checks at 375/768/1024/1440px if a local preview can be safely run.

## Progress and Evidence
- Initial state: branch `codex/accommodation-first`; worktree reported clean.
- Before source changes: verified no general test script in `package.json`; strict TDD RED phase cannot run with the available project test configuration.
- AF-01 implementation: `src/app/page.tsx` now places accommodation discovery and the featured stay before the capped `Completá tu estadía` section; legacy Shorts, testimonials, trust, and brand sections remain after the primary stay journey.
- AF-02 implementation: `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`, `src/app/alojamientos/page.tsx`, and `src/app/viajes/viajes-list.tsx` keep routes intact while establishing the specified labels/order and lodging-first catalog imagery.
- AF-03 implementation: `src/app/alojamientos/[slug]/page.tsx`, `src/components/accommodation-experience-card.tsx`, `src/components/accommodation-page-tracker.tsx`, `src/components/whatsapp-cta-button.tsx`, `src/components/product-card.tsx`, and `src/lib/analytics.ts` implement published-only cross-selling and fail-safe event dispatch with non-identifying parameters.
- Follow-up defects fixed: Booking click tracking now lives in reusable Client Component `src/components/booking-cta-link.tsx`, keeping the accommodation route a valid Server Component; the full-bleed home hero declares `sizes="100vw"`.
- Verification: final `git diff --check`, `npm run typecheck`, and `npm run lint` passed; lint exited 0 with repository warnings, none naming the touched files. No general test runner is configured. The first two `npm run build` attempts failed during `Generating static pages (12/50)` with `Next.js build worker exited with code: 1 and signal: null`; after the RSC correction, the latest `npm run build` passed and generated all 50 static pages. A dev-server attempt for viewport checks failed before startup with `listen EPERM: operation not permitted 0.0.0.0:9002`, so 375/768/1024/1440 browser verification could not run.
- Delivery: `e419b7a feat(home): prioritize accommodation discovery` and `8a70e5f feat(accommodations): add complementary travel suggestions` preserve the first two verified work units locally. The remaining navigation and positioning work is staged as the final local work unit; no branch has been pushed and no pull request exists.
- Persistence: the runtime did expose Engram, contrary to the initial handoff assumption; the complete task document was mirrored under `odd/accommodation-first/tasks`.

## Next Step
Review the committed-state-independent diff and perform visual checks at 375/768/1024/1440px when a local browser preview is available.
