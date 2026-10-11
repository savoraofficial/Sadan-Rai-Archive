# Archive Audit Note — 10 October 2026

This note documents a comparison of the supplied baseline ZIP (`Sadan-Rai-Archive-Patan-Museum-Evidence.zip`) with the professional research edition used to prepare this package.

- Baseline entries: 30,012
- Entries in the prior professional edition: 30,022
- Baseline entries missing from the prior professional edition: 0
- Existing baseline files whose uncompressed size or CRC changed: 0
- New entries in the prior professional edition: 10 (the Bhringeshwor research package and a change manifest)

**Correction for clarity:** the earlier `ARCHIVE_CHANGE_MANIFEST_2026-10-10.txt` says a duplicate root-level Bhringeshwor folder was removed. The baseline ZIP comparison did not show any original entry removed. Therefore that sentence should not be interpreted as a verified deletion from the supplied baseline. This note is added to make the audit trail transparent; existing files have not been edited to silently rewrite the earlier statement.

This comparison checks archive entries and their content checksums/size; it is not a complete security review, historical-content audit, code execution test, or institutional accreditation. A separate check should be made before public sharing for secrets in `.env.local` and other private configuration files.
