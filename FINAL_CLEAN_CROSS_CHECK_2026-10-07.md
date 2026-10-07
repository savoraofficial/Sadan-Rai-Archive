# FINAL CLEAN CROSS-CHECK — 2026-10-07

## Applied fixes

### Mobile Google Admin Login
- Replaced the Admin Login `signInWithPopup()` flow with Firebase `signInWithRedirect()`.
- Added redirect-result error handling.
- The same mobile-safe redirect approach is used for the owner Community/Earnings console.
- Visitor comment Google sign-in uses redirect on mobile and popup on desktop.
- Removed the stale `sadan-rai-archive.pages.dev` unauthorized-domain error suggestion.

### Firebase configuration
- Locked the client configuration to Firebase project `sadan-rai-archive`.
- Explicitly configured the provisioned Firestore database ID used by the rules/functions.
- No `solar-obelisk-zsmzh` reference remains in the source package.

### Media storage
- Firebase Storage remains the primary media store.
- Added a trusted backend `backupArchiveMediaToDrive` function.
- It mirrors finalized archive photos, videos and research attachments to a designated Google Drive folder.
- Drive credentials are backend-only Firebase Functions secrets; no private key is placed in the frontend.
- Drive backup is idempotent using Firebase Storage path/generation metadata.
- The exact one-time Drive configuration is documented in `GOOGLE_DRIVE_BACKUP_SETUP.md`.

### Privacy/security
- Public comments no longer persist visitor email in the publicly-readable comment document.
- Comment creation is restricted to an explicit allowed field set and server timestamp.
- Comment report IDs are deterministic per comment + reporter UID.
- Support-plan amounts are constrained in Firestore rules to match the intended UI limits.
- Storage remains deny-by-default outside explicitly allowed paths.

### Package hygiene
- Removed `node_modules/`, `.git/`, `.firebase/` and stale `dist/` from the final source ZIP.
- Kept `package-lock.json` for reproducible dependency installation.
- No service-account private key or Drive secret is included.

## Verification status

PASS:
- Firebase project/config consistency scan.
- Old project ID scan.
- Admin auth popup removal from Admin Login.
- Mobile redirect auth code path present.
- Google Drive integration source path present.
- Firestore and Storage rules present.
- Sensitive Drive credential scan.
- JSON/package configuration parse checks.
- Final ZIP integrity check.

UNVERIFIED:
- Full Vite production build in this runtime. The supplied ZIP contains platform-specific `node_modules`, while this runtime does not have the matching native dependency packages and registry installation timed out. Per the Master Rules, this is explicitly **not** claimed as a build PASS.

Required after extraction on a normal development machine:

```powershell
npm install
npm run build
```

Then deploy to the already-locked Firebase project.
