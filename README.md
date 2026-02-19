# Keyless Turn App

Web app (OTA-first) para planificar reservas y asignar credenciales Keyless a usuarios de MyGeotab.

## Alcance V1 (actual)

- Panel web de administración (sin BLE/móvil en esta fase).
- Multi-tenant MyGeotab.
- Sincronización de vehículos y usuarios elegibles.
- Planificador de reservas.
- Emisión OTA de virtual keys vía Geotab Keyless API.
- Monitor de estado y trazabilidad de comandos.

## Regla de elegibilidad de usuarios

Un usuario será seleccionable si cumple al menos una de estas condiciones:

1. Es `Driver` en MyGeotab.
2. Pertenece al grupo `Keyless_Driver`.

## Documentación de planificación

- `docs/01-product-scope.md`
- `docs/02-architecture.md`
- `docs/03-data-model.md`
- `docs/04-api-contract.md`
- `docs/05-delivery-plan.md`
- `docs/06-bootstrap.md`

## Scaffold inicial (creado)

- Monorepo npm workspaces:
  - `apps/web` (Next.js)
  - `apps/api` (Node.js + TypeScript + Fastify)
  - `packages/shared`
  - `prisma` (PostgreSQL schema base)

## Endpoint inicial disponible

- `POST /api/tenants/sync/eligible`
  - `mode=mock`: responde catálogo de ejemplo.
  - `mode=real`: preparado para MyGeotab real (authenticate + devices + users/drivers + grupo `Keyless_Driver`).
  - `persist=true`: guarda/upserta tenant, devices y keyless users en PostgreSQL.

## Siguiente hito

Persistencia de tenant/sync en DB + UI web de configuración del tenant y ejecución de sincronización.
