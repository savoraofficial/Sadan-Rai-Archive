# Sadan Rai Archive — CMS Parity Review Status

Date: 2026-10-14
Source baseline: user-provided `Sadan-Rai-Archive-corrected-small.zip`

## Changes applied in this review

- Fixed public `archive_content` reads to query only `workflowStatus == 'published'` for non-admin visitors. Firestore rules are not query filters; an unfiltered public query can fail when draft records exist.
- Expanded the About Sadan Rai CMS record with editable bilingual fields for the tagline, mission, research standards, local research foundation/place/address, and research conclusion.
- Added these About fields to the Admin editor and the CMS preview. They are persisted through the existing `archive_content` save and revision-history workflow.
- Made the About page render the editable main body and the additional CMS fields.
- Made the editable body content appear on the relevant public History, Culture, Civilization, Places/Village, Oral History, Research, Original Research, Additional Archive, Contact, and Standards pages where applicable.
- Corrected history-collection key normalization so hyphenated slugs such as `ancient-medieval` and `comparative-world` resolve to their underscore-based CMS keys.
- Added success/failure feedback to the public-content CMS Save Draft / Publish action.
- Rechecked the Nepali slogan in source: `हाम्रो पुर्खा` is present; the incorrect `हाम्रा पुर्खा` does not occur in `src`.

## Checks performed

PASS:
- TypeScript/TSX syntax transpile check for 14 changed source files.
- Static CMS parity check: 21 default archive-content records and 21 Admin CMS keys; no missing or extra keys.
- Static check for the corrected slogan.
- Static check confirming the public `archive_content` query is filtered to published records and Firestore writes remain owner-only in the existing rules.
- ZIP source was extracted and its documentation, routing, CMS state, data service, and Firestore rules inspected.

UNVERIFIED / BLOCKED:
- `npm ci --ignore-scripts --no-audit --no-fund` timed out in this environment and left dependencies incomplete.
- `npm run build` could not run: `vite: not found` (exit code 127).
- Full TypeScript type-check, browser/device interaction tests, live Firebase Authentication, Firestore Save Draft / Publish persistence, revision-history behavior against the production project, and public visitor reads were not verified live.
- No GitHub push or Firebase deployment was performed.

## Release status

The source-level CMS and query fixes are applied, but this package must not be described as fully production-verified until dependencies are installed and the production build plus authenticated Admin/public visitor end-to-end tests pass. Firebase/Firestore rules and deployment configuration were not changed.
