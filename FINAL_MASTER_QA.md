# Sadan Rai — Final Master QA

Applied in this build:
- Universal archive structure across history, civilization, culture, religion, traditions, places, oral history, evidence, research and media.
- No single civilization/topic is the required architecture; custom categories remain supported.
- Public Home and authenticated Editorial Console remain separate.
- English/Nepali feature placement remains paired.
- Legacy Hamilton demo source is no longer part of the bundled archive data; owner-only runtime cleanup remains for an old Firestore demo record if it still exists remotely.
- History public view no longer renders the dedicated Hamilton record.
- Photo and video creation uses file upload rather than a visible user-entered URL field; existing edit records may retain their stored Firebase Storage URL internally.
- Video duration validation remains 15 seconds through 5 minutes.
- Photo formats remain PNG/JPG/JPEG/WebP with 10 MB validation.
- Evidence, rights/permission, creator/photographer, source and archival metadata remain enforced by the admin forms.
- Oral History remains structured for informant, interviewer, recording, testimony, transcript/translation, evidence, consent/rights and workflow.
- Raw JSX conditional-code artifacts are not present in the edited forms.
- TS/TSX syntax transpile check: PASS.

Environment limitation:
- A full dependency installation/build could not be completed in this environment because `npm ci` timed out. Therefore this document does not claim a production `vite build` pass.


### Latest Master-lock fixes (2026-10-03)
- Public Home protection is route-locked: owner authentication no longer unlocks copy/select/right-click/shortcut behavior on public routes. Only the dedicated editorial console unlocks owner editing.
- Custom Category controls use a compact `+ Custom` action; the text field appears only after clicking it. Existing category options are retained.
- Bilingual title/name fields use a debounced translation bridge and remain manually editable; manual corrections are protected from later automatic overwrites. The bridge first uses the secure `/api/translate` route, then an offline archive vocabulary fallback, then a public translation fallback, so common titles such as `short` → `छोटो` work locally even without an API key; full AI translation still uses `GEMINI_API_KEY`.
- Admin input state remains controlled without intentionally remounting form fields; continuous typing/focus is preserved.

### Latest bilingual/typing correction
- Paired bilingual fields now use the shared auto-translation hook across Research, Author Perspective, Evidence, Oral History, Article, Photo and Video creation flows, including translation/explanation pairs where applicable.
- Auto-generated translations remain manually editable and are protected from later overwrite after manual correction.
- Added an admin typing-focus guard so controlled React updates/remounts do not require re-clicking after each character.
- Local Vite development exposes `/api/translate` when `GEMINI_API_KEY` is present; the client also has offline/common-vocabulary and public translation fallbacks. Cloudflare Pages uses the server-side translation function when configured.
- Exact arbitrary-language translation still depends on a configured Gemini API key; no client-side secret is embedded.

## Final Cross-Check Patch — 2026-10-03
- Public desktop header navigation was hardened against text overlap at narrower desktop widths: navigation is now flex-contained, shrink-safe, horizontally overflow-safe, and action controls remain isolated.
- Public English/Nepali language selector remains persistent and authoritative; layout/feature placement is unchanged between languages.
- Admin Console now has an explicit Nepali / English language selector inside the authenticated console.
- Admin Login now also exposes the same language selector before authentication.
- Cross-checked every `adminText(language, ...)` key used by the Admin Console/forms: 0 missing English translation-map keys after this patch.
- Admin language selection uses the same global `ArchiveContext` language state and localStorage persistence as the public archive.
- No existing archive feature was intentionally deleted in this patch.
- TypeScript/TSX syntax transpile check: PASS (54 source files).
- Full Vite production build: NOT VERIFIED in this environment because the extracted `node_modules` does not contain the Vite executable and dependency installation previously timed out. Do not interpret this as a production-build success claim.
