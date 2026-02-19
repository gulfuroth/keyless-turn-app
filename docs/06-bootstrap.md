# Bootstrap

## 1) Install

```bash
npm install
```

## 2) API

```bash
npm run dev:api
```

Health:

```bash
curl -s http://localhost:8081/health
```

Mock eligible sync:

```bash
curl -s -X POST http://localhost:8081/api/tenants/sync/eligible \
  -H 'content-type: application/json' \
  -d '{
    "mygServer":"my.geotab.com",
    "mygDatabase":"demo",
    "mygUserName":"user@example.com",
    "mygPassword":"***",
    "mode":"mock"
  }'
```

## 3) Web

```bash
npm run dev:web
```

## 4) Prisma (next step)

```bash
npx prisma generate
npx prisma migrate dev --name init
```
