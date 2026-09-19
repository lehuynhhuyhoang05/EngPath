# EngPath API — M4 first slice

This NestJS/REST service currently supports a narrow content-report persistence flow. It is **not** a production backend and is not yet connected to the mobile app. Do not expose it publicly: account migration, rate limiting, report triage, deletion, and offline upload are still pending.

## Local development

Requires Node 24.15+ and PostgreSQL 17. Create a disposable database, set `DATABASE_URL`, then from `apps/api` run:

```powershell
npm ci
npm run migrate:up
npm run typecheck
npm test
npm run build
npm run test:integration
npm run dev
```

`npm run migrate:down` drops the two M4 prototype tables; use it **only** against a disposable test database. CI starts its own PostgreSQL service, verifies the migration up/down path and runs the HTTP integration test. Local unit tests do not need a database; `test:integration` does.

## Contract v1

- `GET /v1/health` → `{ "status": "ok", "apiVersion": 1 }`.
- `POST /v1/guest-sessions` → one-time `{ guestId, accessToken }`. Only the SHA-256 hash of the random token is stored; the client must keep the token private.
- `POST /v1/content-reports` with `Authorization: Bearer <accessToken>` and the locally stored report fields `contentId`, `contentVersion`, `reason`, `createdAt` → `{ id, duplicate }`.

Repeating the same report for a guest, content ID, version and reason returns the existing ID instead of inserting another row. The API uses a server receive timestamp separately from the original client report time. It does not yet verify that the content ID exists in a published catalogue; do not deploy this collector until authentication, abuse limits and triage are complete.
