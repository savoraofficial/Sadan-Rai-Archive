# Firebase Production Lockdown 🔒

## Required sequence

### A. Authentication
- Keep the owner Google account protected with 2-Step Verification.
- Use the exact intended admin account.
- Do not treat a client-side admin screen as authorization; Firestore/Storage rules remain authoritative.

### B. App Check
- Register `ai-studio-applet-webapp` in Firebase App Check.
- Use reCAPTCHA Enterprise for the production web app.
- Put the site key in the deployment environment as `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY`.
- Verify valid traffic first.
- Then enable enforcement for the Firebase products used by the app.

### C. Firestore
- Deploy `firestore.rules`.
- Confirm no unintended collection is readable/writable.
- Test admin and non-admin access separately.
- Keep the `test/*` collection denied.

### D. Storage
- Deploy `storage.rules`.
- Keep `archive-masters/*` owner-only.
- Keep contact submissions restricted by filename, size, and content type.
- Do not add public write access to a catch-all Storage path.

### E. Secrets
Never commit:
- service-account JSON private keys
- private API tokens
- passwords
- signing keys
- payment-provider secret keys
- Firebase Admin SDK credentials

## Important
Firebase web configuration values such as the web API key are not equivalent to server-side secrets. Security must come from Authentication, App Check, Firebase Rules, Storage Rules, and server-side controls where applicable.
