# MASTER SECURITY FINAL LOCK 🔒

This file is additive documentation. Existing application code, rules, content, and files must not be deleted or replaced merely to apply this checklist.

## Security position

No web application can honestly be guaranteed 100% safe. This archive is designed to be strongly hardened, with Firebase Security Rules as the authoritative backend authorization layer.

## Mandatory Firebase Console actions before production

1. Enable Google account 2-Step Verification for the owner account.
2. Register the production web app in Firebase App Check using reCAPTCHA Enterprise and set the production site key as `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY`.
3. After verifying the app works with valid App Check tokens, enable App Check enforcement for Firestore and Storage. Roll out enforcement carefully and monitor rejected requests.
4. Confirm Firestore Rules are deployed from `firestore.rules`.
5. Confirm Storage Rules are deployed from `storage.rules`.
6. Keep the owner/admin account limited to the intended administrator.
7. Do not place service-account private keys, Firebase Admin SDK credentials, or other secrets in the frontend repository.
8. Keep Firebase API keys public only as intended by Firebase; do not confuse a public web API key with a secret credential.
9. Configure billing/budget alerts if the project later moves to a paid plan.
10. Keep offline master backups of source code, rules, archive masters, and important metadata.

## Authorization model

- Backend authorization is enforced by Firebase Rules, not by the React UI.
- Admin writes are restricted to the configured owner email in the current rules.
- Public reads are limited according to each collection's rule.
- Immutable likes cannot be updated or deleted by visitors.
- Pending comments are not publicly readable.
- Support intents and earnings are restricted to authenticated/admin workflows as defined in the rules.
- Storage is deny-by-default outside explicitly defined paths.

## Operational rule

Never weaken a Firebase rule merely to make a feature work. If a new feature needs access, add the narrowest possible rule for the exact collection/path, fields, operation, and user role.
