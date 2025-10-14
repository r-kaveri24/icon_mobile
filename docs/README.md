# Project Docs

This docs directory captures our API-first, dynamic data approach and a catalog of current/planned endpoints.

- See `API-Policy.md` for how we structure data flow (always via API) and how we mock data during early development.
- See `api-catalog.md` for a living index of endpoints, their doc files, purpose, and data sources.
- Use `templates/api-doc-template.md` when adding new endpoints; create a doc per endpoint under `docs/apis/`.

## Conventions
- All data in apps must be fetched via API clients; no hardcoded UI data.
- During prototyping, APIs return deterministic mock/dummy data. Replace mocks with real sources later without changing app surfaces.
- Every new endpoint must have an accompanying doc file created from the template and be listed in the catalog.

## Directory
- `API-Policy.md` — principles, lifecycle, and responsibilities
- `api-catalog.md` — index of endpoints and doc file references
- `apis/` — per-endpoint docs (one file per endpoint)
- `templates/api-doc-template.md` — copy/paste for new endpoint docs