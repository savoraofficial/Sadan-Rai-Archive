# Sadan Rai Archive — Final Cross-Check Record

Applied against the project Master Rules and current Home/Admin content baseline.

## Locked UI/Workflow checks
- LOCK 1: `सदन राई — नयाँ खोज` is placed directly above/adjacent to `सदन राई — अनुसन्धान कार्यप्रवाह` on the public Home and the Admin console.
- LOCK 2: Original Research actions remain real buttons wired to the existing Original Research workspace/form.
- LOCK 3: New Findings and Research Workflow use the same polished dark/gold palette with distinct hierarchy.
- LOCK 5: visual containment guards prevent text/image/card overflow and bleed; relevant research containers are isolated.
- LOCK 6: Home major archive labels are mirrored in the Admin public↔admin map, with History & Civilization and Civilization connected to the existing category/research editing workspace; Places and Oral History retain their dedicated workspaces.

## Integrity checks
- Nepali spelling scan: no `सदान राई` occurrences remain under `src/`.
- `ArrowRight` is explicitly imported in `AdminPortalView.tsx`.
- Home contains an explicit `सदन राई — नयाँ खोज` heading.
- Admin contains `सदन राई — नयाँ खोज` and the shared research workflow.
- 20-section Kirat master research code remains present.
- Research Library source remains present.
- Existing Firebase/service imports and upload code were not removed.
- Root `package.json` is present.
- `node_modules` is excluded.

## Verification limitation
The runtime environment used for packaging does not contain the project's installed npm dependencies and network installation timed out. TypeScript transpile parsing of the changed `HomeView.tsx` and `AdminPortalView.tsx` completed without syntax diagnostics. A full Vite build/browser/console verification could therefore not be honestly claimed in this environment.
