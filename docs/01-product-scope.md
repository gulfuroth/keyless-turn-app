# Product Scope (V1 OTA Web)

## Objetivo

Permitir a administradores de flota crear reservas y emitir llaves virtuales OTA para acceso keyless.

## Incluye

- Multi-tenant MyGeotab (por database/tenant).
- Sync de usuarios elegibles (Driver o grupo Keyless_Driver).
- Sync de vehículos (Device + serial).
- Creación y gestión de reservas por rango temporal.
- Emisión OTA de virtual key al confirmar reserva.
- Monitor de comandos y estado operativo.

## Excluye (fase posterior)

- BLE y Mobile SDK.
- App móvil nativa.
- Workflows avanzados de check-in documental.

## Criterios de aceptación

1. Se puede crear reserva válida sin solapes.
2. Se emite comando OTA con `userReference`, `beginningTimestamp`, `endingTimestamp`.
3. Se guarda `virtualKeyId` y log de request/response.
4. Solo aparecen usuarios elegibles por regla definida.
