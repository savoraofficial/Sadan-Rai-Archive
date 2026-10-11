# Clean Archive Manifest — 2026-10-03

## Master-rule preservation

- Universal History / Civilization / Culture / Religion / Oral History / Evidence / Research structure is preserved.
- Kirat is retained as a civilization/tradition family alongside the other civilization families already defined in the application.
- Existing application source files were not deleted.
- Existing Research Library folders were not deleted; duplicate/legacy archive branches remain where they are part of the preserved master structure.

## Removed only from the ZIP because they are generated/local artifacts

- `node_modules/` — reinstallable dependencies; not source code.
- `dist/` — generated build output; not source code.
- `.git/` — repository metadata; GitHub remains the source-control location.
- `tatus` and `tatus -sb` — accidental local status-output files.

## Research publication layer

Current controlled counts:

- 52 bibliography/hunting-list entries.
- 45 structured source-register records.
- 12 controlled claims.
- 12 prepared publication records.

The 12 publication records are marked `published` in the bundled seed and are used as a public Research-page fallback when Firestore has no published records. The Admin Editorial Console contains a one-time owner action to write the same 12 records into Firestore `research_records`; cross-check/evidence/researcher working notes are kept separately in `research_admin_notes`.

This is not a claim that all world literature on Kirat has been exhausted or that all 52 bibliography entries are claim-level verified.

## Verification note

TypeScript checking of the new publication seed passed; the project still has two pre-existing TypeScript errors outside the new seed (`deletePhoto` reference in `AdminPortalView.tsx` and a `useBilingualAutoTranslate` call). Production build was not marked as passed because the supplied local dependency tree has the existing Vite/Rolldown native-binding problem.
