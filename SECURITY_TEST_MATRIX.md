# Security Test Matrix 🔒

Run these checks after every rules or authentication change.

| Test | Expected result |
|---|---|
| Unauthenticated visitor reads unpublished research | Denied |
| Unauthenticated visitor writes archive content | Denied |
| Non-admin authenticated user writes archive content | Denied |
| Admin writes archive content | Allowed |
| Visitor updates/deletes a like | Denied |
| Visitor reads pending comment | Denied |
| Admin reads/moderates comments | Allowed |
| Visitor reads earnings | Denied |
| Non-admin reads earnings | Denied |
| Non-admin writes earnings | Denied |
| Unauthenticated Storage write outside allowed contact path | Denied |
| Non-admin reads archive masters | Denied |
| Admin reads archive masters | Allowed |
| Storage path not explicitly listed | Denied |
| Firestore `test/*` access | Denied |

These are acceptance expectations derived from the current rules; execute them against the deployed Firebase project before declaring production ready.
