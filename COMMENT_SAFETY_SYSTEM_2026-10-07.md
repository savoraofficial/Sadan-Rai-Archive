# COMMENT SAFETY ADD-ON — 2026-10-07

This add-on preserves the existing Like, Save, Google Comment, Firebase, and admin architecture.

## Safety layers

1. Google-authenticated users only can create comments.
2. Browser-side early screening catches obvious abusive, explicit, threat, spam, and suspicious-link patterns.
3. Firestore rules allow visitors to create only `pending` or `blocked` comments; the browser cannot directly publish a comment.
4. A trusted Firebase Firestore trigger re-checks every pending comment and automatically changes it to:
   - `approved` for low-risk comments
   - `pending` for suspicious/uncertain comments
   - `blocked` for clear dangerous/explicit/threat content
5. A per-Google-account Firestore rate document enforces a 30-second minimum interval between comment submissions. The comment and rate update must be atomic.
6. Published comments have a Report action. Reports are stored privately for owner review.
7. Only the owner/admin account can approve/reject/block comments or resolve reports.

## Deployment requirement

The new `functions/` package must be installed and deployed to Firebase for trusted automatic moderation to operate in production. Firestore rules should also be deployed.

The automatic filter is intentionally conservative and cannot guarantee detection of every harmful comment. Pending moderation and user reports remain part of the safety model.
