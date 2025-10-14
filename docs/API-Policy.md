# API-First Policy

We build dynamic applications where all data flows through API calls.
UI must not rely on hardcoded or embedded data. Even during prototyping,
apps consume data strictly via API clients.

## Current Phase: Dummy Data via API
- The API layer returns dummy/mocked data to unblock app development.
- Mocks live alongside service definitions; swap them for real sources later.
- Keep request/response contracts stable; avoid breaking changes to the app.

## Responsibilities
- App teams: consume data via `packages/api` client functions only.
- API package: expose typed clients and services; implement mocks now.
- Documentation: every endpoint must have a doc file and a catalog entry.

## Required Documentation for New Endpoints
When creating an endpoint, you must:
1. Create a doc file in `docs/apis/` using `templates/api-doc-template.md`.
2. Add a row to `docs/api-catalog.md` with: endpoint, doc file name, purpose, data sources.
3. Maintain schema sections (request/response) and note any upstream data sources.

## Versioning and Changes
- Prefer additive changes; deprecate instead of breaking.
- Document changes and data source impacts in the endpoint’s doc file.
- Update `api-catalog.md` when status changes (draft, active, deprecated).

## Error Handling
- Return structured errors with stable shapes.
- Document error cases in each endpoint doc.