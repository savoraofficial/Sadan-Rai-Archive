# MASTER RULES 🔒 — Final QA Record

## Locked public identity
- SADAN RAI · सदन राई
- इतिहास, सभ्यता तथा संस्कृति अभिलेखालय
- History, Civilization & Culture Archive
- इतिहास · संस्कृति · सभ्यता · मौखिक परम्परा
- Hero statement: इतिहास · सभ्यता · सम्पदाका प्रमाण — हामीसँग
- Tagline: हाम्रो पहिचान: इतिहास, सभ्यता र संस्कृतिको साझा संरक्षण।

## Final homepage contract
1. Hero / archive identity
2. Archive dashboard + credibility principles
3. History & Civilization
4. Culture, Religion & Traditions
5. Places & Village Archives
6. Oral History
7. Archaeological & Historical Photographic Archive
8. Historical, Cultural & Documentary Video Archive
9. Sources & References
10. About Sadan Rai
11. Support / Contact
12. Minimal footer + rights notice

Homepage does not use Malbase as an identity block, does not expose public research-management controls, and does not use unfinished "content coming soon" placeholders.

## Owner / visitor contract
- Owner: raiktosadan@gmail.com
- Visitor: read, search, like, comment, correction/contact flows.
- Owner only: create, edit, delete, review, publish, archive, evidence/source management, moderation and administrative operations.
- Owner sessions retain normal copy/paste/selection/editing.
- Public sessions receive client-side copy/selection deterrence; editable fields remain usable.

## Archive metadata contract
Universal structure supports Record ID, title, category, date/period, geographic hierarchy, people, description/claim, evidence, source/reference, rights/permission, research status, notes and revision history.

## Photo / audiovisual contract
- Public photo title: पुरातात्त्विक तथा ऐतिहासिक तस्बिर अभिलेख / Archaeological & Historical Photographic Archive.
- Photo records support location, date/period, photographer, source, evidence, rights/permission and related metadata.
- Public video title: ऐतिहासिक, सांस्कृतिक तथा दस्तावेजी भिडियो अभिलेख / Historical, Cultural & Documentary Video Archive.
- Video/audio records support location, date, creator, interviewee where applicable, source, evidence, rights/permission and transcript/notes where applicable.
- Private masters are protected by Storage rules.

## Support / contact
- Membership/paid-plan cards are not shown in the public Support view.
- Support opens the Contact chat box.
- No card, CVV, password or payment credential is collected by this application.

## Copyright / rights
Footer includes a copyright and rights notice reserving appropriate remedies under applicable law and distinguishing third-party rights.

## Verification performed for this ZIP
- TypeScript/TSX type-check: PASS (51 source files checked with TypeScript 5.8.3).
- Old public identity / forbidden homepage phrase scan: PASS.
- Homepage Malbase identity scan: PASS.
- Public admin-control visibility scan: PASS for the final Header/Footer/Home components.
- Public/admin copy-protection logic: PASS by source inspection.
- Public homepage admin-control scan: PASS; the homepage no longer exposes an “Add to the Archive” control, even for an owner session.
- `/admin` security boundary: PASS; the admin portal renders the dedicated login view until the owner account is authenticated.
- Initial Firestore-load race: PASS; archive loading now starts from the Firebase Auth state callback to avoid duplicate anonymous/authenticated reads.
- Firebase owner-only write rules and private-master Storage rules: present and source-checked.
- ZIP integrity: pending final packaging check.

## Build boundary
TypeScript type-check: **PASS** using the installed global TypeScript 5.8.3 compiler.
Production Vite build: **UNVERIFIED** in this runtime because the supplied `node_modules` came from a different platform and the runtime has no npm registry/network access to install the Linux-native optional Vite/Rolldown dependencies. The final clean ZIP therefore excludes `node_modules` and `dist`; on the user’s Windows/VS Code environment, `npm install` is the intended dependency setup before the normal Vite build. No build PASS is claimed here.

## Important security boundary
Browser copy protection is a deterrence layer, not a cryptographic guarantee that web content can never be copied or photographed.
