# Master Rules Addendum — Admin Reader & Category Navigation

## 🔒 Locked rules

### 1. Continuous admin typing / focus stability
Every admin search/input/textarea must support continuous keyboard entry after one click. React state updates or component re-renders must never force the owner to click again after each character. Existing data, forms and features must remain intact.

### 2. Admin category → research reading navigation
Every Admin Category card must be actionable. Selecting a category must expose the research records mapped to that category and provide clear actions to:

- open/read the complete research record;
- inspect source and direct-evidence details;
- inspect research synthesis;
- inspect the admin-only cross-check/researcher-analysis workspace;
- inspect final research conclusion and version/workflow information;
- open the editor without deleting or replacing the record.

The Full Research Library and the live Research records must remain distinct: the Library is the preserved research-file reader; Firebase is authoritative for live CMS counts and live research records.

### 3. No-regression / no-deletion
These fixes are additive. Do not delete existing research, evidence, source records, categories, files, folders, code, or features. Generated dependencies and build artifacts may be excluded from a clean distribution ZIP because they are reproducible/generated, but project source and archival research material must remain preserved.
