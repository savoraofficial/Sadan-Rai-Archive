# Research Workspace Navigation Fix — 2026-10-04

## Purpose
Safe additive improvement to the Editorial Console research workspace.

## Preserved
- Existing Firebase `research_records` storage model.
- Existing research, source, evidence, oral-history, media, article, category, translation, draft, published and revision workflows.
- Existing 20-section Kirat master research architecture.
- Existing Original Research / Field Finding data embedded in `researchWorkflow.originalFinding`.
- Existing owner-only Firestore write model and public/admin separation.

## Added
- First-class `Original Research` workspace navigation tab.
- Dynamic Original Research count based on actual finding content/evidence.
- Dedicated Original Research workspace with finding cards, evidence counts, status, open/read and edit actions.
- `New Original Research` entry point from quick actions and workspace.
- Persistent breadcrumb/back-to-workspace navigation whenever a sub-workspace is open.
- A true Workspace Home state for easy in/out movement.
- Original Research form focus mode that jumps directly to the Original Research / Field Finding section.
- Clear workflow banner: Field Finding → Original Evidence → Provenance → Cross-check → Assessment → Analysis → Conclusion → Version History.

## Integrity
Original findings are not automatically treated as historical facts. Existing evidence/status/version rules remain authoritative. No new Firestore collection was invented and no existing records are migrated or deleted by this UI change.

## Verification note
The source tree was checked for TypeScript/TSX syntax diagnostics. A production Vite build could not be completed in the Linux verification container because the supplied Windows Rolldown native optional binding is not executable on Linux; this is an environment dependency issue, not a claim of build success.
