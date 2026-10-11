# Upload & Media Workflow — 2026-10-03

## Direct upload model
The archive uses direct authenticated Firebase Storage uploads for archive media. It is not designed as an external-link-only system.

### Existing application upload paths verified in source
- Research/source evidence uploads: `src/components/admin/AdminResearchForm.tsx`
- Public archive photo uploads: `src/components/views/AdminPortalView.tsx`
- Public archive video uploads: `src/components/views/AdminPortalView.tsx`
- Firebase Storage initialization: `src/firebase.ts`

### Supported evidence/media types already present
PDF, JPEG, PNG, WebP, MP3/MPEG, WAV, MP4 and WebM are supported by the research evidence upload control. Public photo/video management also has direct file upload controls with size limits.

## Rights rule
Before publication, each uploaded object must have a rights status. Owner-uploaded original material, public-domain/reuse-permitted material and permission-granted material may be handled according to their rights. Restricted or unclear material remains a citation/catalogue target until lawful permission is established.

## No fake evidence
A URL, catalogue entry or filename never counts as an actual evidence attachment unless the actual lawful file has been uploaded and linked to the correct record.
