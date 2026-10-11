# Master Rules — Public ↔ Admin CMS completion

Implemented as an additive change on the preserved Sadan Rai Archive baseline.

## Public ↔ Admin parity

The Admin console now has a dedicated **Public Content Management** workspace with matching entries for:

1. History & Civilization
2. Culture, Religion & Traditions
3. Civilization
4. Places & Village Archives
5. Oral History
6. Research & Evidence
7. Sadan Rai — Original Research & New Findings
8. Additional Archive
9. About Sadan Rai
10. Contact & Contribution
11. Research Integrity
12. Accuracy & Evidence Standards

Each public-content record supports bilingual title, bilingual description, bilingual body, Draft, Preview, Publish, status and versioned revision snapshots.

## Safe architecture

- Existing research records, 20 Kirat research sections, research library, source/evidence/oral-history/media workflows remain preserved.
- New public section content is stored in the explicit `archive_content` collection.
- Firestore rules restrict unpublished/admin content to the verified owner.
- Public views use the managed content with safe built-in defaults, so an empty new collection does not blank the website.
- About Sadan Rai, Contact & Contribution, Research Integrity and Accuracy Standards now have corresponding public/admin destinations.
- Additional Archive has a dedicated public destination for photos, audio/video, articles and sources.

## Verification performed

- Changed TS/TSX files transpile successfully with the available global TypeScript parser.
- Wrong Nepali spelling `सदान राई` was scanned out of `src`.
- `package.json` is preserved at project root.
- `node_modules` and `dist` are excluded from the source package.
- Full `tsc`/Vite build could not be completed because dependencies are not installed and the environment's npm cache is incomplete; an offline install fails on an uncached package. No build/browser success is claimed.
