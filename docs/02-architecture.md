# Arquitectura

## Stack recomendado

- Web: Next.js
- API: Node.js + TypeScript + Fastify
- DB: PostgreSQL + Prisma
- Queue/jobs: BullMQ + Redis (sync/reintentos)

## Integraciones

- MyGeotab API
  - Authenticate
  - Get(Device)
  - Get(Driver/User + grupos)
- Geotab Keyless API
  - Comandos OTA (`/tenants/{database}/devices/{serialNumber}/commands`)

## Componentes

1. Tenant Service
- Alta tenant
- Health checks de conectividad

2. Sync Service
- Importa Devices
- Importa usuarios elegibles por regla

3. Reservation Service
- Crea/actualiza/cancela reservas
- Valida conflictos de horario

4. Keyless Service
- Emite comandos OTA
- Guarda `virtualKeyId`
- Reintentos y errores

5. Audit Service
- Traza de acciones y logs técnicos
