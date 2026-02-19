# Bootstrap

## 1) Install

```bash
npm install
```

## 2) Prisma

```bash
cp .env.example .env
npm run db:generate
npm run db:migrate
```

## 3) API

```bash
npm run dev:api
```

Health:

```bash
curl -s http://localhost:8081/health
```

Mock eligible sync + persistencia:

```bash
curl -s -X POST http://localhost:8081/api/tenants/sync/eligible \
  -H 'content-type: application/json' \
  -d '{
    "mygServer":"my.geotab.com",
    "mygDatabase":"demo",
    "mygUserName":"user@example.com",
    "mygPassword":"***",
    "tenantName":"Demo Tenant",
    "mode":"mock",
    "persist":true
  }'
```

Real eligible sync (MyGeotab):

```bash
curl -s -X POST http://localhost:8081/api/tenants/sync/eligible \
  -H 'content-type: application/json' \
  -d '{
    "mygServer":"my.geotab.com",
    "mygDatabase":"your_db",
    "mygUserName":"admin@domain.com",
    "mygPassword":"***",
    "tenantName":"Your Tenant",
    "mode":"real",
    "persist":true
  }'
```

## 4) Web

```bash
npm run dev:web
```
