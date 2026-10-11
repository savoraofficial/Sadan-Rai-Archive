# SADAN RAI — 12 MASTER RULES FINAL QA

## Locked scope
This package applies the 12 primary Master Rules from `MASTER_RULES_LOCKED.md` without replacing the existing archive architecture, records, research sections, or Firebase collections.

## 1–12 verification
1. **Locked identity** — public identity scan found no legacy `History & Culture Archive` identity and no wrong `सदान राई` spelling.
2. **Locked homepage identity** — required hero/tagline remain in `HomeView.tsx`; prohibited identity phrases were scanned.
3. **Public homepage structure** — core archive, research/sources, original research, visual/audiovisual, additional archive, integrity, about/contact remain routed; unfinished public “coming soon” placeholders were removed from public article/translation display paths.
4. **About** — existing About route and archive-section CMS key remain preserved.
5. **Universal archive structure** — existing universal record types and metadata remain intact; no collection replacement was introduced.
6. **Research method** — Home research method now renders fully Nepali in Nepali mode and fully English in English mode; dedicated Original Research keeps evidence/cross-check/assessment/conclusion separation.
7. **Photo archive** — existing photo upload/metadata workflow preserved.
8. **Video archive** — existing video metadata/upload workflow preserved.
9. **Visitor vs owner** — owner-only write paths remain Firebase-authenticated; public routes do not expose editorial controls.
10. **Likes/comments/earnings** — existing Firebase rules preserve immutable per-user likes, pending comment moderation, and owner-only earnings ledger writes.
11. **Copy/paste protection** — public protection is active again; dedicated owner editorial console remains unlocked for the verified owner. Editable form fields remain usable.
12. **Security** — Firestore owner-only writes, separate admin research notes, immutable revisions, and protected research storage paths remain in place.

## Important additive fixes in this package
- Added dedicated public route: `/original-research`.
- Home **“नयाँ खोज हेर्नुहोस् / Explore New Findings”** now opens the dedicated Original Research landing page, not generic Research & Evidence.
- Original Research landing communicates existing archive research + ongoing research and shows an honest empty state when no publishable original finding exists.
- Admin public↔admin map now points Original Research to `/original-research` while keeping the existing first-class Admin workspace.
- Removed startup auto-deletion of the legacy Hamilton source record; existing archive records are now preserved on load.
- Removed public “coming soon” wording from missing-article and source-translation display paths.
- No wrong `सदान राई` spelling found in source/public files.

## Source verification
- Changed TS/TSX files were syntax-transpiled with the installed global TypeScript compiler: **PASS**.
- Project-wide production build: **UNVERIFIED** in this environment because project dependencies could not be installed within the runtime timeout; no false build PASS is claimed.
- ZIP root check: `package.json` is at the archive root.
- `node_modules` and `dist` are excluded from the clean source ZIP.
