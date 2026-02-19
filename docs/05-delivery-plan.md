# Delivery Plan

## Sprint 1

- Repo scaffold monorepo
- Auth admin básica
- Multi-tenant setup
- Sync devices/users elegibles

## Sprint 2

- Reservas + validación de conflictos
- Emisión OTA de virtual keys
- Logs de comandos

## Sprint 3

- Monitor de estado
- Reintentos de comandos
- QA funcional completa

## QA mínima obligatoria

1. Elegibilidad de usuario (Driver o Keyless_Driver).
2. Solapes bloqueados en reserva.
3. Emisión OTA exitosa y persistencia de `virtualKeyId`.
4. Trazabilidad completa request/response.
5. Flujo end-to-end con un tenant real.
