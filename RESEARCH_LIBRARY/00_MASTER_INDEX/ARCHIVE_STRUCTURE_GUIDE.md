# Archive Structure and Record-Keeping Guide

**Project:** Sadan Rai Archives  
**Purpose:** Consistent, understandable, maintainable personal research documentation  
**Status:** Working practice guide; not a claim of institutional accreditation

## Archive-wide principles

1. **Preserve first:** do not overwrite original photographs, scans, recordings, documents, or source files. Store enhanced copies as derivatives and label them clearly.
2. **One canonical record:** maintain one authoritative folder per site/project. Use links or cross-references rather than duplicate copies where possible.
3. **Stable identifiers:** use IDs such as `SRA-BHR-SNK-001`. An ID identifies a record; it does not certify the age or authenticity of an object.
4. **Traceable claims:** every historical claim should point to a specific source and, where possible, a page, inscription number, catalogue number, or URL and access date.
5. **Separate evidence levels:** clearly label `Direct observation`, `Published source`, `Interpretation`, and `Unverified / requires verification`.
6. **Unknown means unknown:** use `unknown` or `not yet verified`; do not fill gaps with guesses.
7. **Rights-aware use:** note who created each item, any permission restrictions, and whether public sharing is allowed.
8. **Maintainable structure:** add future projects within the existing taxonomy. Do not rename established application folders or alter code paths merely to improve labels.

## Recommended record fields

- Record ID (unique and stable)
- Preferred title and alternate title(s)
- Creator / photographer / recorder
- Date created and date documented (keep separate; unknown is acceptable)
- Place / site and location precision appropriate to safety and sensitivity
- Item type and file format
- Description of what is directly visible/audible
- Source citation and source URL; date accessed for web sources
- Rights / permission statement
- Related records and related sites
- Verification status and reviewer/date, if applicable
- Derivative/edit history
- Checksum (SHA-256 recommended) for preservation copies

These fields are inspired by widely used descriptive-metadata concepts such as Dublin Core, adapted for a small personal archive. They do not mean the collection is Dublin Core certified or compliant in every technical respect.

## Recommended site-record package

For a new site under `RESEARCH_LIBRARY/04_SITE_SPECIFIC_HERITAGE/`:
- `README.md` — plain-language entry point and record status
- `01_FIELD_REPORT.md` — field observations and limitations
- `02_EVIDENCE_REGISTER.csv` — one row per photo/video/object record
- `03_SOURCE_REGISTER.md` — full citations and claim/source mapping
- `04_VERIFICATION_CHECKLIST.md` — questions still to verify
- `05_RIGHTS_AND_MEDIA.md` — rights, publication and media links
- `originals/` — unmodified source captures
- `derivatives/` — enhanced crops, contrast adjustments, transcriptions, or edited video, clearly labelled

Existing site folders need not be renamed solely to match this suggested package. Apply it to new records gradually without breaking existing paths.

## Quality-control checklist

- [ ] Main README explains the archive in plain language.
- [ ] Each record has a unique ID and descriptive title.
- [ ] Original files are preserved unchanged.
- [ ] File names match the register.
- [ ] Sources are cited and accessible where possible.
- [ ] Observations are not presented as proven historical interpretations.
- [ ] Unknown dates, authorship, and provenance are explicitly marked.
- [ ] Media rights and publication status are recorded.
- [ ] Backup exists in a separate location.
- [ ] Checksums are generated and checked periodically.

## References for good practice

- Dublin Core Metadata Initiative, *DCMI Metadata Terms*: https://www.dublincore.org/specifications/dublin-core/dcmi-terms/
- Library of Congress, *Recommended Formats Statement 2025–2026*: https://www.loc.gov/preservation/resources/rfs/index.html
- Library of Congress, *Sustainability of Digital Formats*: https://www.loc.gov/preservation/digital/formats/

Consult these resources as guidance; this personal archive has not undergone an external standards audit.
