# Sadan Rai Archive — Backup & Recovery Plan

## Authoritative data
- Firestore is the authoritative database for archive records and revisions.
- Firebase Storage `archive-masters/` is the authoritative location for private original evidence.
- Browser localStorage is **not** an archive database and is never used as a write fallback.

## Required production backups
1. Enable scheduled Firestore exports to a dedicated Cloud Storage backup bucket.
2. Keep at least two independent backup copies, including one outside the primary Firebase project.
3. Back up original media/evidence files and their metadata together.
4. Retain revision history and record IDs with each export.
5. Test a restore periodically rather than assuming backups work.
6. Protect backup buckets with owner-only access and retention rules.

## Important
Scheduled cloud backup jobs require configuration in the Firebase/Google Cloud project. This source package documents the required architecture but cannot create or verify a cloud scheduler without access to the production project.
