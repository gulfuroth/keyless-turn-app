# Modelo de Datos (V1)

## tenants
- id
- name
- mygServer
- mygDatabase
- keylessTenantRef
- encryptedMygCredentials
- encryptedKeylessCredentials
- status
- createdAt/updatedAt

## devices
- id
- tenantId
- mygDeviceId
- serialNumber
- name
- keylessCapable
- firmwareVersion
- lastSeenAt

## keyless_users
- id
- tenantId
- mygUserId (nullable)
- mygDriverId (nullable)
- userReference
- email
- name
- isDriver
- inKeylessGroup
- active

## reservations
- id
- tenantId
- userId
- deviceId
- startAt
- endAt
- status (draft/scheduled/key_issued/active/completed/cancelled)
- createdBy
- notes

## virtual_keys
- id
- tenantId
- reservationId
- deviceSerial
- userReference
- beginningTimestamp
- endingTimestamp
- virtualKeyId
- status
- requestPayload
- responsePayload

## commands_log
- id
- tenantId
- reservationId (nullable)
- deviceSerial
- commandType
- requestPayload
- responsePayload
- status
- sentAt
