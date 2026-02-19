# API Contract (Draft)

## Tenants
- `POST /tenants`
- `POST /tenants/:tenantId/test-connection`

## Sync
- `POST /api/tenants/sync/eligible`
  - Input: credenciales MyGeotab + `mode` + `persist`
  - Output: `devices`, `users` y bloque `persisted` con `tenantId` y contadores

## Catalogs
- `GET /tenants/:tenantId/devices`
- `GET /tenants/:tenantId/users?eligible=true`

## Reservations
- `POST /tenants/:tenantId/reservations`
- `GET /tenants/:tenantId/reservations`
- `PATCH /tenants/:tenantId/reservations/:id/cancel`

## Key Issuance
- `POST /tenants/:tenantId/reservations/:id/issue-key`

Body example:

```json
{
  "userReference": "myg-driver-123",
  "beginningTimestamp": "2026-02-20T09:00:00Z",
  "endingTimestamp": "2026-02-20T18:00:00Z"
}
```

## Monitor
- `GET /tenants/:tenantId/reservations/:id/status`
- `GET /tenants/:tenantId/commands-log`
