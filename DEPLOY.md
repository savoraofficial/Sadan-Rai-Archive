# Sadan Rai Archive — Deployment

This project is configured for GitHub Pages at `/Sadan-Rai-Archive/`.

## Install
```powershell
npm install
```

## Local build
```powershell
npm run build
```

## Deploy to GitHub Pages
```powershell
npm run deploy
```

The `deploy` script publishes the Vite `dist` folder to the `gh-pages` branch.

## Firebase security rules (required before production use)
Install/login with the Firebase CLI, then deploy the rules from the project directory:

```powershell
firebase login
firebase use <your-firebase-project-id>
firebase deploy --only firestore:rules,storage

Before using public Like, Comment, or Support Request features, enable **Anonymous** sign-in in Firebase Console → Authentication → Sign-in method. Keep Google sign-in enabled for the owner account.

For production hardening, also enable/configure Firebase App Check for the web app and monitor Authentication/Firestore/Storage abuse limits.
```

The repository contains `firestore.rules` and `storage.rules`. Do not publish the site as a production archive until both rule sets are deployed to the correct Firebase project.

## Security model
- `raiktosadan@gmail.com` is the only application owner/admin identity.
- Firestore is the authoritative archive database; browser localStorage is never an archive write fallback.
- Private originals belong under Firebase Storage `archive-masters/` and are owner-only.
- Revisions are immutable from the client.
- Public copy protection is a deterrence layer only; it is not a guarantee that a determined user cannot extract browser-delivered content.
