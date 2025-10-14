# <API Name>

Doc File: `docs/apis/<file-name>.md`
Status: draft | active | deprecated

## Purpose
Briefly describe what this API is used for in the app.

## Endpoint
- Method: GET|POST|PUT|DELETE
- Path: `/path/to/resource`
- Auth: none | bearer | session | other

## Request
```json
{
  "example": "request-shape"
}
```

## Response
```json
{
  "example": "response-shape"
}
```

## Data Sources
List where the data comes from (mock file, external service, DB table, etc.).
- Mock: `packages/api/src/mock.ts` (or specific mock file)
- External: `<system/service>`
- Database: `<schema.table>`

## Errors
Document known error cases and shapes.

## Notes
Add any constraints, rate limits, pagination, versioning details.