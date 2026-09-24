# Task: Curate Accommodation Galleries

## Objective
Curate the accommodation galleries in `src/lib/data/accommodations.ts`: exactly 15 useful, non-redundant photos for Loft Centro, Casa I, and Casa III; retain Casa II's 14 authentic photos without duplicate paths. Every selected image needs accurate descriptive alt text, and the strongest suitable cover goes first.

## Problem and Why
The accommodation galleries have inconsistent lengths and include repeated or low-contribution photos. Visitors need a concise, representative gallery that communicates the property and its amenities before contacting or booking.

## Scope and Constraints
- Authorized scope: the four accommodation `images` arrays in `src/lib/data/accommodations.ts` and this task document.
- Preserve all physical image assets; do not delete or rewrite image files.
- Do not modify UI or copy outside gallery entries.
- Preserve all unrelated local changes and do not commit.
- Engram mirror: **pending** (unavailable for this task, as instructed).
- Route: delegated direct work in the current writer task; multi-gallery inventory/selection is the implementation unit.
- TDD setting: enabled by project instructions. This is a data-only curation task; use the requested typecheck and structural checks rather than adding an unrelated behavior test.

## Selection Criteria
- Exactly 15 distinct image references for Loft Centro, Casa I, and Casa III; keep all 14 authentic Casa II references without duplicate paths.
- First image is the clearest, strongest representative cover for that property.
- Favor a balanced, truthful mix of exterior/overview, bedrooms, bathrooms, kitchen, and social/common spaces where the available inventory permits.
- Exclude duplicate angles, near-identical frames, poor crops/quality, and photos that add little property information.
- Keep alt text accurate to the actual selected image, concise, and descriptive; do not infer amenities not visibly supported by the image.

## Acceptance Criteria
- [x] Loft Centro, Casa I, and Casa III each contain exactly 15 unique photo paths; Casa II retains its 14 distinct authentic photo paths.
- [x] The first photo of each gallery is its strongest appropriate cover.
- [x] Alt text accurately describes each selected image.
- [x] Physical image assets and all content outside gallery arrays remain untouched.
- [x] `npm run typecheck` and `git diff --check` pass.

## Stable Task Checklist
- [x] T1 — Inventory all four galleries and visually inspect the existing image candidates.
- [x] T2 — Select 15 distinct images for Loft Centro, Casa I, and Casa III; curate Casa II's 14 existing photos, order each gallery with its strongest cover first, and update only gallery data/alt text.
- [x] T3 — Verify each gallery has exactly 15 unique paths and no assets/UI/copy outside the gallery was changed.
- [x] T4 — Run `npm run typecheck` and `git diff --check`, then record observed results.

## Progress
- T1 — Inventory complete. Initial array/file counts: Loft Centro 38/38; Altos del Talampaya Casa I 30/32 (includes six prior authorized Casa I photos); Casa II 14/14; Casa III 19/19.
- Scope update authorized: retain 14 authentic Casa II photos; curate its paths without duplicates, while the other three galleries must have 15 unique photos.
- T2 — Complete. Curated the arrays with representative covers first and balanced selections across visible exterior, bedrooms, baths, kitchens, and shared living/dining spaces where the source inventory permits. Casa II retains its 14 authentic unique file paths, as authorized.
- T3 — Structural readback confirms Loft Centro 15/15 unique paths, Casa I 15/15, Casa II 14/14, and Casa III 15/15. Every path resolves to an existing public image and every item has non-empty alt text.
- T4 — Complete. `npm run typecheck` and `git diff --check` both passed.
- Engram mirror: pending.

## Verification Evidence
- Candidate inventories were read from `src/lib/data/accommodations.ts` and `public/images/alojamientos`; visual contact sheets were inspected for all four property inventories.
- Structural validation: all four array counts, unique paths, non-empty alt text, and local file references passed.
- `npm run typecheck`: passed (`tsc --noEmit`, exit 0).
- `git diff --check`: passed (exit 0).

## Next Step
No further implementation tasks remain. No commit was made; ordinary repository policy owns later delivery.
