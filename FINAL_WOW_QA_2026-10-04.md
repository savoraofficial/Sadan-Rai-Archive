# Sadan Rai — FINAL WOW International QA

## Master Locks applied
- LOCK 1: Research Proximity & Visual Continuity
- LOCK 2: Sadan Rai — New Findings is a dedicated first-class functional workspace
- LOCK 3: Visitor Home copy/select/paste remains enabled
- LOCK 4: International Admin Command Center + Public Home/Admin parity

## Implemented in this revision
- Added a dedicated **Home Content CMS** workspace in Admin.
- All major Home archive-section content records are represented through the CMS data layer, including About, Contact, Research Integrity and Accuracy.
- Home Content CMS supports edit, Save Draft, Preview, Publish and Revision History routing.
- Preserved existing Research, Original Research, Places & Villages, Oral History, Research Library, Sources, Evidence, Media, Articles, Kirat 20-section and other workspaces.
- Original Research and Research Workflow use the same dark/gold archival visual family.
- Original Research retains its own first-class workflow: Field Finding → Original Observation → Original Evidence → Existing Research Link → Independent Cross-check → Evidence Assessment → Analysis/Conclusion → Publication → Version History.
- Main Research uses the shared Master workflow with source/evidence/cross-check/assessment/analysis/conclusion/publication/version history.
- Responsive layout rules added for desktop/tablet/mobile Admin workspace navigation and workflow cards.
- Visitor Home copy protection remains disabled; no public copy-blocking code was added.
- Nepali spelling scan found no `सदान राई` occurrences in `src`.
- Root `package.json` is present.

## Verification
- AdminPortalView.tsx TypeScript/JSX transpile check: PASS (0 diagnostics).
- ZIP root package.json: PASS.
- `node_modules` excluded from final ZIP.
- Full Vite production build: NOT VERIFIED in this environment because dependency installation did not complete; `vite` was unavailable after the install timeout. No claim of browser/build completion is made.
