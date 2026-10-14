# SADAN RAI ARCHIVE — Implementation & QA Report

Date: 2026-10-14
Working baseline: `Sadan-Rai-Archive-cms-parity-fixed.zip`

## Additive changes in this pass

- Added an editable `Other & Future Civilizations` archive-content record and matching Admin Console editorial entry. The History & Civilization hub already exposes the matching `other` collection card; it now resolves to the editable record.
- Expanded the Worldwide Research Framework editor with bilingual Nepali/English research title, research question, summary and conclusion fields while preserving original generic fields for compatibility with existing records.
- Added structured fields for historical period, geography, researcher, methodology, source provenance, primary and secondary sources, exact page/folio/object references, oral-history notes, archaeological/material evidence, evidence assessment, alternative interpretations, unresolved questions, confidence/uncertainty, reviewer/review notes, rights/permissions and linked record IDs.
- Added an `Other & Future Civilizations` starter workspace to the universal research collection list and a custom/future collection-name field, without overwriting existing starter records.
- Integrated published `research_frameworks` records into the public Research & Sources page. The public reader queries only records with `workflowStatus == 'published'`, matching the existing Firestore rule; drafts remain owner-only.
- Public research cards now show bilingual title, research question, summary and conclusion when provided, with sensible fallback to legacy fields. Recorded source, evidence, review, rights and linked-record metadata is displayed when available.
- Normalized owner-email comparison in `src/services/dbService.ts` and the Worldwide Research Framework editor by trimming and lowercasing the authenticated email before comparison.
- Preserved the original 21 requested public-content entries and added the separate future-civilizations collection as an additional editable record (22 total CMS records including this extra collection).

## Changed source files

- `src/components/admin/ResearchFrameworkCMS.tsx`
- `src/components/views/ResearchView.tsx`
- `src/data/archiveSectionContent.ts`
- `src/components/views/AdminPortalView.tsx`
- `src/services/dbService.ts`

## Checks performed

- TypeScript/TSX syntax transpilation: PASS for 72 source files (0 syntax diagnostics).
- Public content parity static check: PASS — 22 default archive-content records match 22 Admin CMS entries, including the added future-civilizations record.
- Research metadata static check: PASS — all newly added bilingual research fields and source/evidence/review metadata exist in both the Admin editor and public Research view.
- Published framework public-query check: PASS at source level — public query filters `workflowStatus == 'published'` and Firestore rules permit published reads while retaining owner-only writes.
- Old-identity/slogan scan: PASS for forbidden old public identity strings in `src`, `index.html` and `public`; visible Nepali wording uses `हाम्रो पुर्खा`, not `हाम्रा पुर्खा`.
- ZIP integrity: PASS after packaging.

## Not verified in this environment

- `npm run build` is **UNVERIFIED/FAILED TO START** because project dependencies are not installed in this extracted source package (`vite: not found`).
- Full TypeScript semantic type-check is blocked by missing installed dependencies/types (React, Firebase, Lucide, Vite, Firebase Functions/Admin, and related packages). The errors produced by `tsc --noEmit` are dominated by these missing modules; this is not a successful type-check.
- Live Firebase Authentication, Firestore persistence, actual Save/Publish, browser/device rendering, App Check, and visitor-vs-owner end-to-end behavior were not tested because no live Firebase session/credentials were available in this runtime.
- GitHub push and Firebase deployment were not performed. This source ZIP has no `.git` repository metadata or deployment credentials; no remote changes were made. Deploying an unbuilt package would violate the Master Rules.

## Release note

This is a source-level improvement package, not a claim of 100% production verification. Before production release, install dependencies, obtain a successful production build, test owner and visitor workflows against Firebase, and deploy through the authorized repository/session. No production data, Firebase rules, project credentials, or hosting targets were intentionally changed in this pass.
