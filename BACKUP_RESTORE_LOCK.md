# Offline Master Backup & Restore Lock

The laptop is the offline master/backup device. It does not need to remain online for the Firebase-hosted application to operate.

## Keep at least three independent copies

1. Current working source archive.
2. Offline master backup.
3. Separate backup copy kept away from the working machine.

## Preserve together

- application source
- `firestore.rules`
- `storage.rules`
- `firebase-applet-config.json`
- environment-variable template
- archive master files
- metadata
- deployment instructions
- security checklist

## Restore principle

Restore from a known-good dated ZIP. After restoration, verify rules before opening public writes or uploads.

## Never do

- Never store secrets inside the ZIP.
- Never overwrite the only master copy.
- Never disable rules globally just to troubleshoot.
- Never treat a successful UI login as proof that backend authorization is correct.
