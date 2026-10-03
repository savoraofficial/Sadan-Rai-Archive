# Security Audit — Master Rules Final Pass

## Fixed in this build
- Frontend admin gate and Firestore admin rule now use the same owner identity: `raiktosadan@gmail.com`.
- Archive records no longer use browser localStorage as a database or write fallback.
- Article/photo/media/source mutations require owner authentication before Firestore writes.
- Firestore is authoritative for persistent archive records and revisions.
- Added `storage.rules` with owner-only access to `archive-masters/**` and owner-only read/delete for contact attachments.
- Hardened contact attachment names and allowed MIME types; other Storage paths remain deny-by-default.
- Added production Firebase App Check integration using reCAPTCHA Enterprise; enforcement/registration remains a Firebase-console step after the site key is created.
- Public archive reads are separated from owner-only writes; unpublished articles are not queried publicly.
- Added public copy/select/right-click/drag deterrence while preserving normal copy/paste for the authenticated owner.
- Owner clipboard contents are not modified by the archive's rights component.
- Added `BACKUP_PLAN.md` describing required Firestore/Storage backup and recovery architecture.
- Removed legacy identity terminology found during the final scan.

## Production hardening checklist
- Configure `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY` from the Firebase App Check Web registration.
- Register `ai-studio-applet-webapp` in Firebase App Check and monitor metrics before enforcing App Check.
- Keep the owner Google account protected with 2-Step Verification.
- Keep Firestore and Storage rules deployed from this repository and test them before changes.
- Maintain independent Firestore/Storage backups; the laptop is an offline master/backup, not a required server.

## Important production boundary
No browser application can make delivered web content 100% impossible to extract. The copy-protection layer is a deterrence measure; Firebase Authentication, Firestore rules, Storage rules, private originals, and backups are the actual security boundaries.

## Verification performed in this runtime
- TS/TSX transpile/syntax pass: PASS.
- Legacy identity scan: PASS.
- Archive localStorage fallback scan: PASS (only language preference remains in localStorage).
- Security rules files present: PASS.
- Final package excludes `node_modules/` and `dist/`.
- Full `npm install` / production Vite build could not be completed because this runtime has no cached npm package for the dependency tree. Therefore a production build is not claimed as verified here.
