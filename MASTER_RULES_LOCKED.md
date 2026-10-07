# SADAN RAI — MASTER RULES 🔒

## 1. Locked identity
- SADAN RAI · सदन राई
- इतिहास, सभ्यता तथा संस्कृति अभिलेखालय
- History, Civilization & Culture Archive
- इतिहास · संस्कृति · सभ्यता · मौखिक परम्परा

Old institutional names and the phrase “History & Culture Archive” must not appear anywhere in public UI, metadata, SEO, tooltips or accessibility labels.

## 2. Locked homepage identity
Hero statement:
- इतिहास · सभ्यता · सम्पदाका प्रमाण — हामीसँग

Locked tagline:
- हाम्रो पहिचान: इतिहास, सभ्यता र संस्कृतिको साझा संरक्षण।

Do not use:
- इतिहास खोजौँ · प्रमाण बुझौँ · सम्पदा जोडौँ
- सभ्यता र सम्पदा
- कथाहरू as the archive identity
- “मेरो गाउँ: माल्बासे–१, पात्लेपानी” as a homepage identity block

## 3. Public homepage structure
1. Hero
2. Archive credibility / evidence principles
3. History & Civilization
4. Culture, Religion & Traditions
5. Places & Village Archives
6. Oral History
7. Archaeological & Historical Photographic Archive
8. Historical, Cultural & Documentary Video Archive
9. Sources & References
10. About Sadan Rai
11. Support / Contact
12. Minimal footer

No unfinished “content coming soon” boxes.
No public author-management section.
No public admin dashboard controls.
No public “Start Research” button.

## 4. About
About is the clean Sadan Rai profile. It contains:
- Sadan Rai identity
- archive mission
- research standards
- broad archive scope
- Malbase–1, Patlepani as local research foundation
- Sadan Rai Research Conclusion framework

Malbase is not the homepage identity.

## 5. Universal archive structure
The same record structure must work for history, civilization, culture, religion, places, communities, oral history, archaeology, documents, photos, audio and video.

Core metadata:
- Record ID
- Title
- Category
- Date / period
- Country → Province/State → District → Municipality → Ward → Village/Place
- People
- Description / historical claim
- Evidence
- Source / reference
- Rights / permission
- Research status
- Notes
- Revision history

## 6. Research method
Claim → Source Statements → Comparative Analysis → Agreements → Contradictions → Missing/Unverified Evidence → Field Research → Oral History → Research Notes → Alternative Interpretations → Sadan Rai Research Conclusion → Evidence Status → References.

## 7. Photo archive
Public name:
- पुरातात्त्विक तथा ऐतिहासिक तस्बिर अभिलेख
- Archaeological & Historical Photographic Archive

Each photo should support location, date/period, photographer, source, evidence, rights/permission and related record metadata.
Original masters remain private.

## 8. Video archive
Public name:
- ऐतिहासिक, सांस्कृतिक तथा दस्तावेजी भिडियो अभिलेख
- Historical, Cultural & Documentary Video Archive

Each video should support location, date, creator/videographer, interviewee where applicable, source, evidence, rights/permission and transcript/notes where applicable.
Original masters remain private.

## 9. Visitor vs owner
Owner/admin:
- raiktosadan@gmail.com

Visitors:
- Read
- Search
- Like
- Comment
- Suggest correction
- Contact / support

Owner only:
- Create
- Edit
- Delete
- Review
- Publish
- Archive
- Evidence/source management
- Comment moderation
- Earnings confirmation
- Backup/admin operations

## 10. Likes, comments and earnings
- One like per Firebase visitor UID per record.
- Comments are pending until owner moderation.
- Support intent is not payment and is never automatically counted as earnings.
- Earnings are owner-confirmed only after checking the real payment provider transaction.
- Never store card numbers, CVV, passwords or payment credentials in this application.

## 11. Copy/paste protection
- Owner session: normal copy, paste, selection and editing remain enabled.
- Public session: strong client-side deterrence blocks selection, right-click, copy, cut, common copy shortcuts, drag and common save/print/dev-tool shortcuts.
- Editable fields remain usable.
- This is a deterrence layer, not a cryptographic guarantee that web content can never be copied or photographed.

## 12. Security
- Firebase Authentication is authoritative for owner access.
- Firestore rules enforce owner-only writes.
- Storage rules protect private archive masters.
- Browser localStorage is not the archive database.
- Revisions are immutable.
- Production should enable Firebase App Check, quotas, monitoring, backups and restore testing.

## 13. Design
International archival/research dashboard style:
- Obsidian / warm ivory / restrained antique gold / subtle sage
- clean hierarchy
- generous whitespace
- mobile-first and desktop polished
- no clutter
- no repeated empty placeholders

## 14. Final QA rule
Before any final ZIP:
1. Project-wide old-identity scan.
2. Public/admin visibility scan.
3. Security rules scan.
4. Copy-protection owner/public scan.
5. No public unfinished placeholders.
6. ZIP integrity test.
7. TypeScript/TSX syntax check.
8. Production build must be explicitly reported as PASS or UNVERIFIED; never claim a build was run when dependencies prevent it.

## 15. Universal history & civilization structure — permanent
- The archive is not limited to Kirat History.
- The same complete archival standard applies to Kirat, Buddhist, Himalayan, Nepalese, Indigenous, Ancient, Medieval, Modern, Local, Regional, Comparative and other civilizations/histories.
- Categories are broad and extensible; existing categories are preserved and new custom categories/topics can be added by the administrator.
- Research, Sources, Authors, Evidence, Oral History, Articles, Photos and Videos use the same universal archival quality model.

## 16. International professional WOW standard — permanent
- Clean, premium, museum/research-archive-grade presentation.
- Strong hierarchy, consistent typography, spacing, cards, controls and responsive behavior.
- English and Nepali preserve the same layout, feature placement and information architecture.
- No raw code artifacts or technical conditional expressions may appear in the visible UI.
- “100% international/WOW” is a design target; actual release quality requires browser/device and functional QA.

## 17. Structured oral history — permanent
- Oral history is a dedicated structured record, not a loose Research text field.
- It includes informant, interviewer, context, date/location, recording/media details, testimony, transcript/translation, documentary evidence, verification, consent, rights/privacy, source/reference and workflow/audit metadata.

## 18. Media upload rules — permanent
- Photos use local/file upload with PNG/JPG/JPEG/WebP validation, preview, sensible size validation, replacement/edit and removal controls.
- Photo URL is not a mandatory user-entered field.
- Videos use archival metadata and local upload rather than a mandatory URL field.
- Video duration is constrained to 15 seconds through 5 minutes; creator/videographer, evidence and rights/permission are required.


## Additional Locked Rules — 2026-10-03

- **Custom Category UI:** do not leave a custom-category text field visible by default. Show a compact `+ Custom` action; only after clicking it should the text input appear. Existing categories remain intact.
- **Bilingual Auto-Translation:** where paired English/Nepali title or name fields exist, typing in one side should automatically generate the other side through the configured translation service. Generated text must remain fully editable; manual corrections must never be overwritten.
- **Typing/Focus Stability:** every admin input/textarea must accept continuous typing after one click; focus must not be lost after the first character or state update.
- **Public Protection Route Lock:** an authenticated owner session must NOT unlock the public Home/archive. Public protection stays active on all public routes. Only the dedicated editorial console routes may unlock full owner editing/copy/paste behavior.

## 🔒 Bilingual Auto-Translation + Typing Focus — Added 2026-10-03
- Wherever the admin archive has a paired English/Nepali title, name, topic, translation, explanation, article, photo, video, evidence, research or oral-history field, entering one language automatically generates the other language through the translation bridge.
- Example behavior: English `Nepal` → Nepali `नेपाल`.
- Generated translations remain fully editable by the owner.
- Manual corrections must not be overwritten by later automatic translation requests.
- Translation requests are debounced so typing remains continuous and responsive.
- Admin text inputs/textareas must retain focus: one click must allow continuous typing; the owner must never need to click again after every character.
- Local Vite development exposes the same `/api/translate` route when `GEMINI_API_KEY` is present in the local environment; Cloudflare Pages uses the server-side Pages Function without exposing the key to the browser.
