# Worldwide Research Framework CMS — Admin Workflow

## Where to open it
1. Sign in with the archive owner's Admin account.
2. Open the Editorial Console.
3. Choose **Worldwide Research CMS**.

## First setup
- Choose **Create 9 collection starters** to create draft workspaces for the nine archive collections.
- Each starter contains the 50 universal section headings as editable, initially blank sections.
- Existing collection workspaces are not overwritten by this action.
- These are empty research templates, not completed or verified research.

## Create and edit
- Use **New research** to create a separate topic record.
- Set the collection, title, specific topic and research question.
- Edit the initial sections, add any of the 50 universal sections, or create custom sections for future needs.
- Record source URLs and exact page/folio references, counter-evidence and evidence-bounded conclusions.
- Save to Firebase. Each save increments the version and creates an entry in `revisions`.
- Keep the record as `draft` until reviewed. Use `published` only when the content is ready for public use.

## Security and publication notes
- The CMS checks the owner account in the client and Firestore rules restrict writes to the owner email.
- Draft records are not readable by public visitors under the added Firestore rule.
- This CMS stores the records in `research_frameworks`. A separate public-page renderer is needed before these records automatically appear on public research pages; saving or selecting `published` alone does not guarantee public display.
- Firebase rules must be deployed for the new collection to work in production. Do not change existing Authentication or unrelated security rules.

## Research integrity
A framework, template, source catalogue entry or saved status does not independently verify a historical claim. Every substantive claim still requires source-level review, exact locators, independent comparison where available, fair treatment of disagreements, rights/consent review, and an evidence-bounded conclusion.
