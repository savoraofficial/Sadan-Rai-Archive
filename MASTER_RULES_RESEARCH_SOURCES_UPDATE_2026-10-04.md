# Master Rules — Research & Sources / Original Research Update

Implemented additively on the existing archive baseline.

## Public Home
- Added a dedicated **Research & Sources** section before Original Research.
- Kept the public research presentation visitor-facing and removed the Admin/editorial workflow panel from Home.
- Added a compact research-method line: Source → Evidence → Cross-check → Analysis → Conclusion.
- Added a compact **Sadan Rai — Original Research & New Findings** feature directly after Research & Sources.
- Preserved visual evidence, audiovisual evidence, additional archive, integrity, accuracy, sources/references, About and Contact sections.
- Added Research to the primary public header navigation.

## Admin
- Research workspace is named **Research & Sources** to match the public information architecture.
- Original Research remains a separate first-class workspace.
- Original Research quick action uses the same archival charcoal/ivory/gold palette instead of a separate indigo palette.
- Original Research workspace card uses the same palette family.
- Admin retains full editorial workflow and controls; this is intentionally not copied into the public Home UI.

## Preservation checks
- Existing 20-section Kirat Master Research remains present.
- Existing research library remains present.
- Existing Firestore `archive_content` integration remains present.
- No `सदान राई` spelling found under `src`.
- Existing upload/research workflows were not removed.
- package.json remains at archive ZIP root.

## Verification limitation
- Changed TSX files pass TypeScript `transpileModule` syntax diagnostics.
- A full Vite build could not be completed in this environment because dependencies were not fully installed; `vite` was unavailable after an installation transport timeout. Therefore browser/build completion is not claimed as 100% verified here.
