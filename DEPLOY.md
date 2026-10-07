# Sadan Rai Archive — Deployment

## Firebase Hosting

Project:
- Firebase project ID: `sadan-rai-archive`
- Hosting site: `sadan-rai-archive`
- Visitor: `https://sadan-rai-archive.web.app/`
- Admin login: `https://sadan-rai-archive.web.app/#/admin`

Install dependencies:

```powershell
npm install
```

Build:

```powershell
npm run build
```

Deploy hosting:

```powershell
firebase use sadan-rai-archive
firebase deploy --only hosting
```

Deploy Firebase rules:

```powershell
firebase deploy --only firestore:rules,storage
```

Deploy Functions:

```powershell
firebase deploy --only functions
```

## Authentication

Firebase Authentication must have **Google** enabled.

Authorized domains must include:
- `localhost`
- `sadan-rai-archive.firebaseapp.com`
- `sadan-rai-archive.web.app`

The admin login uses Firebase's redirect OAuth flow so Android/iOS browsers do not depend on popup behavior.

## Google Drive media backup

Firebase Storage is the primary media store. The trusted Function `backupArchiveMediaToDrive` mirrors newly finalized media under:

- `archive/photos/`
- `archive/videos/`
- `archive/research/`

to a designated Google Drive folder.

Configure the backend-only Firebase Functions secrets described in `GOOGLE_DRIVE_BACKUP_SETUP.md` before expecting Drive copies. Never put the service-account JSON in the frontend or repository.

## Production hardening

Before production:
1. Enable owner Google 2-Step Verification.
2. Configure Firebase App Check with reCAPTCHA Enterprise.
3. Verify App Check traffic, then enforce it for Firestore/Storage.
4. Deploy and test Firestore/Storage rules.
5. Keep independent backups and test restore.
6. Keep secrets out of GitHub and frontend environment variables.

No browser application can honestly guarantee 100% security; Firebase Authentication, Firestore/Storage rules, App Check, server-side functions and protected originals are the security boundaries.
