# Community, Comments, Support & Earnings Security

## Owner
- Authoritative owner/admin email: `raiktosadan@gmail.com`.
- Owner moderation and earnings ledger writes are protected by Firebase Security Rules.

## Visitor engagement
- Like is stored as one immutable document per Firebase UID per archive record.
- Visitors cannot update or delete likes.
- Comments are submitted as `pending` and are never automatically published.
- Only the owner can approve, reject, edit or delete comments.
- Anonymous Firebase authentication is used for Like, Comment and Support Intent submission.

## Support and earnings
- Public support opens the secure contact/chat box; the old membership card system is not shown publicly.
- The public support flow opens the owner-reviewed contact inbox; it is not a payment.
- The authoritative `earnings` collection is owner-write only.
- An earning can be recorded only by the owner after checking the actual transaction in the configured payment provider.
- Card numbers, CVV, passwords and payment credentials must never be stored in Firestore or this application.

## Copy protection
- Owner `raiktosadan@gmail.com` retains normal copy/paste/selection ability.
- Public visitors receive strong client-side copy/selection deterrence.
- Browser-side controls cannot provide a cryptographic 100% guarantee against copying, screenshots, browser tools or external recording.

## Production hardening
1. Deploy Firestore and Storage rules.
2. Enable Anonymous Authentication for visitor engagement.
3. Keep Google authentication for the owner.
4. Enable Firebase App Check.
5. Configure quotas and abuse monitoring.
6. Configure scheduled Firestore/Storage backups and test restoration.
7. Connect a real payment provider before accepting payments.
