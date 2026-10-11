# Production Go-Live Checklist

## Code package
- [ ] Existing source preserved.
- [ ] Existing Firebase Rules preserved.
- [ ] No secret credential added to frontend files.
- [ ] App Check initialization remains present.
- [ ] Build and type-check completed successfully in the deployment environment.

## Firebase Console
- [ ] Correct Firebase project selected.
- [ ] Correct web app selected.
- [ ] App Check registered.
- [ ] App Check enforcement enabled after verification.
- [ ] Firestore rules deployed.
- [ ] Storage rules deployed.
- [ ] Owner account has 2-Step Verification.

## Final verification
- [ ] Admin can perform intended admin operations.
- [ ] Ordinary visitor cannot perform admin writes.
- [ ] Unpublished/private data is not publicly readable.
- [ ] Storage deny-by-default behavior is confirmed.
- [ ] Offline master ZIP exists.

A completed checklist is evidence of a controlled deployment, not a promise of absolute security.
