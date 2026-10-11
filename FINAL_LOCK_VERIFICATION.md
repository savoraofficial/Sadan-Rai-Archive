# SADAN RAI — FINAL LOCK VERIFICATION

This package is based on the supplied `Sadan-Rai-Archive-FINAL-100.zip` baseline.

## 🔒 Preserved project rules
- Existing Firebase, Authentication, Firestore, Storage, archive sections and admin workflows are preserved.
- No required archive feature was intentionally removed.
- History, Culture, Civilization, Places & Local History, and Oral History remain separate public sections.
- All 18 existing Civilization topic sections remain in `CIVILIZATION_SECTIONS` and `CivilizationView`.
- Admin remains owner-only.
- Public visitors do not receive admin write controls.
- Public copy/selection deterrence remains enabled; the authorized owner session remains unrestricted for admin/editorial work.

## Final UI corrections in this package
- Explicit two-button language selector (`नेपाली` / `English`) in the global header.
- Language choice remains persisted through the existing archive language state/localStorage.
- Admin Console labels/forms use the existing `adminText()` translation architecture; missing admin UI key `नेपाल` was added.
- Admin → Home is now explicitly labeled `Home / Public Archive` (or `गृहपृष्ठ / सार्वजनिक अभिलेख`).
- Public → Admin is explicitly labeled `Admin Console` for the authorized owner; mobile owner access is also labeled as Admin Console.
- Owner copy/paste behavior remains unrestricted in authenticated owner sessions.
- Public protection owner-email comparison is normalized to lowercase.

## Verification performed in this environment
- TS/TSX source parse check: PASS (51 files).
- Admin translation-key audit: PASS (no missing `adminText()` keys).
- Existing Civilization source contains all 18 sections.

## Build note
The included source was not re-built in this Linux runtime because the archived `node_modules` native Rolldown binding was incomplete and a fresh `npm ci` could not complete within the runtime. Therefore this package does **not** claim a post-edit `npm run build` PASS from this environment.

The source changes are intentionally limited and syntax-checked. On the normal project environment, run the existing project build (`npm install` then `npm run build`) before deployment.
