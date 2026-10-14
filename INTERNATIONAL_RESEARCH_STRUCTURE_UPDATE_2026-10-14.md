# International Research Structure Update — 2026-10-14

## Scope
This update extends the existing universal 50-section research framework. It does not replace the project identity, Firebase project, owner identity, security rules, Home CMS, or existing archive records.

## Added to Worldwide Research Framework CMS
- Structured source register: stable source ID, source type, author, title, publication/institution, year, edition, exact page/folio, URL/DOI, catalogue/archive ID, quoted source statement, provenance, reliability/limitations notes, rights/permissions.
- Structured claim register: stable claim ID, exact claim, claim type, date/period, supporting source IDs, opposing source IDs, assessment/reasoning, claim status.
- Structured evidence object register: stable evidence ID, evidence type, title, location, date/period, catalogue/inventory ID, linked source ID, description, linked claim IDs, limitations/authentication, verification status, media reference, rights/access.
- Research workflow states: Draft, Further research needed, Evidence pending, Cross-check pending, Ready to publish, Published. Public page still queries only `workflowStatus == 'published'`.
- Owner-confirmed deletion of a research framework record. Existing revision snapshots are retained; delete is not a cascade delete of unrelated records.
- Existing 50 universal sections and custom section add/remove behavior are preserved. Existing collection starters are preserved.

## Public Research view
Published framework records can now display the structured source, claim, and evidence registers. Drafts and non-published workflow stages remain excluded by the existing published-only query and Firestore rule.

## Security and preservation
- Owner check remains `raiktosadan@gmail.com` in the CMS.
- Existing Firestore and Storage rules are unchanged.
- No Firebase project IDs, secrets, environment files, deployment config, or owner settings were changed.
- Revision snapshots continue to be written to the existing `revisions` collection.
- Existing legacy free-text source/evidence fields remain for compatibility.

## QA
- TypeScript/TSX transpilation syntax check: 72 files, 0 syntax diagnostics.
- ZIP integrity: checked after packaging.
- Production build: UNVERIFIED in this environment because dependencies are not installed and `vite` is unavailable. `npm install` did not complete in the available execution window.
- Full semantic typecheck, Firebase save/read/publish, browser/device, App Check, and live deployment behavior: NOT VERIFIED here.

## Important data-model limitation
Structured source/claim/evidence registers currently live as arrays within each `research_frameworks` document for compatibility with the existing CMS and revision snapshots. Very large records can approach Firestore's 1 MiB document limit; before importing large-scale archival corpora, migrate these registers to dedicated related documents/subcollections with corresponding owner-only Firestore rules and revision strategy. Do not treat the interface itself as proof of historical claims.
