# Add Altos del Talampaya - Dpto

## Objective
Add the Altos del Talampaya apartment as a complete accommodation listing across GoAventura, using only verified property facts and the supplied photo set.

## Authorized scope and constraints
- Add accommodation `altos-del-talampaya-dpto` to the accommodation catalog and all catalog-driven surfaces.
- Confirmed facts: capacity 2; air conditioning, heating, bedding, garage, and Wi-Fi; Villa Unión, La Rioja; coordinates `-29.323099, -68.225492`; Plus Code `MQGF+QR6`; map link `https://maps.app.goo.gl/5xrf25XARQmeipwW6`.
- No Booking URL, bedroom/bathroom count, pet policy, kitchen, or any unconfirmed amenities. Unknown bedroom/bathroom fields must be omitted in UI and structured data.
- Keep the 15 curated images and add the two newly approved supplied images 1 and 2 with stable names and accurate Spanish alt text, for a 17-photo set. Do not edit `public/data/shorts.json`.
- Home catalog must include the new listing; the hero slider maps source photo 1; the detail-page cover maps source photo 2 while catalog cards continue using the existing facade cover.
- Record each implementation and its checks here before its work-unit commit. Engram mirror status must remain truthful.

## Route and TDD
- Route: delegated direct implementation. Mapping trigger: accommodation model, home, catalog, detail/JSON-LD, sitemap, and source photo folder span 4+ files. Writer trigger: multiple non-trivial source surfaces plus image assets.
- Strict TDD: enabled. No general project test runner is configured, so RED cannot be evidenced; do not invent a test command. Use the checks below.

## Acceptance criteria
- [x] New accommodation appears on `/alojamientos`, the home accommodation catalog, hero slider, and `/alojamientos/altos-del-talampaya-dpto`.
- [x] Metadata and sitemap include the new slug; JSON-LD omits unsupported facts.
- [x] Capacity and verified services are accurate; unavailable bedrooms/bathrooms, pets, Booking, and unsupported amenities are omitted.
- [x] The 17-photo set has stable names and truthful Spanish alt text; catalog cards use the clean wide facade (source 4).
- [x] WhatsApp remains the contact path; no Booking CTA appears for this property.
- [x] `public/data/shorts.json` remains untouched and unstaged.

## Checklist and evidence
- [x] Create this task document before source/photo writes.
- [x] Add data and safe optional bedroom/bathroom rendering/JSON-LD handling.
- [x] Copy and curate the original 15 supplied photos; wire home catalog and initial hero mapping.
- [x] Run `git diff --check`, `npm run typecheck`, `npm run lint`, and `npm run build`.
- [x] Review staged paths and commit only feature files with `feat(accommodations): add talampaya apartment`.

### Implementation evidence
- Added the listing to the static accommodation data source; the catalog/detail metadata, static params, and sitemap consume that source automatically.
- Made `bedrooms` and `bathrooms` optional and omit both from catalog/detail UI and LodgingBusiness JSON-LD when unknown.
- Homepage lists the complete accommodation catalog. Initial hero mapping used interior image `altos-del-talampaya-dpto-02.jpg`.
- Initial photo selection order: `4, 7, 3, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17`. Source `4.jpeg` is the clean landscape catalog cover. The later follow-up intentionally adds car-visible sources 1 and 2 for designated hero positions while preserving the initial 15.
- Listing contains only the confirmed two-person capacity, air conditioning, heating, bedding, garage, Wi-Fi, location, coordinates, and map. No Booking URL, bedrooms/bathrooms, pet policy, kitchen, or other unconfirmed feature is asserted. WhatsApp uses the existing project contact number.
- Engram mirror: synchronized under `odd/add-talampaya-dpto/tasks` with the follow-up commit evidence.
- Checks: `git diff --check` passed; `npm run typecheck` passed; `npm run lint` passed with pre-existing project-wide warnings; `npm run build` passed (Next emitted existing warnings for the unavailable optional Jaeger exporter and `handlebars` `require.extensions`). No general test runner is configured, so no RED result was fabricated.
- Build output confirmed `/alojamientos/[slug]` static params include the added accommodation (two additional paths beyond the four printed in the abbreviated route summary).

## Commit evidence
- Initial implementation: `385032b feat(accommodations): add talampaya apartment`.
- Follow-up: `7b3f9d3 feat(accommodations): add garage photos to apartment`.
- Follow-up files: `src/lib/data/accommodations.ts`, `src/app/page.tsx`, `src/app/alojamientos/[slug]/page.tsx`, `odd/tasks/add-talampaya-dpto.md`, and `public/images/alojamientos/altos-del-talampaya-dpto-16.jpg` / `-17.jpg`.
- Follow-up checks: `git diff --check`, `npm run typecheck`, `npm run lint`, and `npm run build` passed.

## Follow-up: approved garage-photo placement
- [x] Copy supplied source photos 1 and 2 to stable project names; retain the original 15 files and gallery entries.
- [x] Route source photo 1 to the Dpto home hero slide and source photo 2 to its detail-page hero, keeping catalog cards on the facade image.
- [x] Run `git diff --check`, `npm run typecheck`, `npm run lint`, and `npm run build`.
- [x] Commit only follow-up files with `feat(accommodations): add garage photos to apartment` (`7b3f9d3`).
- Scope: only the Dpto listing/detail/home hero and its task evidence; preserve all unrelated work and prior Shorts commit.
- Strict TDD remains enabled; no general project test runner exists, so RED cannot be evidenced and no test will be invented.
- Engram mirror status: synchronized under `odd/add-talampaya-dpto/tasks` with post-commit evidence.
- Initial listing work-unit commit: `385032b feat(accommodations): add talampaya apartment`.
- Follow-up implementation adds `detailHeroImageSrc`, used only by the detail hero. Catalog cards intentionally continue using `images[0]`; other listings fall back to their first image.
- Copied source `1.jpeg` to `altos-del-talampaya-dpto-16.jpg` (home hero: facade/garage with parked car) and source `2.jpeg` to `altos-del-talampaya-dpto-17.jpg` (detail hero: brick facade and car beneath the covered garage). Both remain in the full gallery.
- Follow-up verification: `git diff --check` passed; `npm run typecheck` passed after a serial rerun (the first parallel run raced with `next build` recreating `.next/types`); `npm run lint` passed with existing project-wide warnings; `npm run build` passed with existing optional Jaeger exporter and Handlebars warnings.
