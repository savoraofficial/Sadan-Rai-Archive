<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f97e2084-1a3e-41da-84c9-e299d849fe7a

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Final security architecture
- Firebase is the live backend; Supabase is intentionally not required.
- Mobile administration uses Firebase Authentication and server-enforced Firestore/Storage rules.
- The laptop can remain offline and hold master/original backup copies. It is not required to stay online.
- Production App Check uses reCAPTCHA Enterprise via `VITE_RECAPTCHA_ENTERPRISE_SITE_KEY`.
- No web application can honestly guarantee 100% security; this build is hardened with layered controls and still requires correct Firebase-console configuration and ongoing backups/updates.
