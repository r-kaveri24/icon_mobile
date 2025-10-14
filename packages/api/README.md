# API Package (`@icon/api`)

This package provides client functions and services for apps to fetch data.
During early development, responses are backed by deterministic mocks.

- Clients: `src/client.ts`, `src/services.ts`
- Mocks: `src/mock.ts` (replace with real sources later)

## Policy
- All app data must be fetched via clients exported here.
- Do not hardcode data in app components.
- When adding an endpoint, create a doc under `docs/apis/` and add it to `docs/api-catalog.md`.

## Next Steps
- Implement new client functions using mock data.
- Maintain the endpoint docs and update the catalog.

See `c:\ICON\icon_mobile\docs\API-Policy.md` for details.