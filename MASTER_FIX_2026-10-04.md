# Sadan Rai Archive — Master Workflow Fix

## Applied in this source package

- Corrected Nepali spelling to **सदन राई** in the Admin Original Research primary workspace.
- Reduced the Admin **सदन राई — नयाँ खोज** primary panel to a compact hierarchy (approximately 50% of the previous visual height).
- Added the same **Sadan Rai — Research Workflow** information architecture to both Public Home and Admin:
  1. Source / Lead
  2. Evidence
  3. Independent Cross-check
  4. Research Analysis
  5. Conclusion → Publish
- Added a direct Public Home button to the Research Workspace.
- Kept the Original Research layer separate from ordinary source/oral-history records.
- Added explicit interactive-layer CSS so Admin buttons/links remain pointer-interactive above decorative layers.
- Existing 20 Kirat research sections, research library, existing records, uploads, and other modules were not intentionally removed or replaced.

## Verification status

This package was source-inspected after the change. A full Vite build could not be completed in this Linux validation environment because the existing `node_modules` tree lacks the Linux Rolldown native optional binding. No dependency/configuration change was made to work around that environment issue.

Therefore this ZIP must **not** be described as a 100% build/browser-verified final release until it is rebuilt and clicked through in the target environment.
