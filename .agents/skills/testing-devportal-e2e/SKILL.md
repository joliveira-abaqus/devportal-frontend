---
name: testing-devportal-e2e
description: How to bring up the full DevPortal stack (infra + api + frontend) locally and run end-to-end UI tests against it.
---

# Testing DevPortal end-to-end

DevPortal is split across three repos that must all run together:
`devportal-infra` (Docker services), `devportal-api` (:3001), `devportal-frontend` (:5173).

## Bring-up order

```bash
# 1. Infra (Postgres 5432, Redis 6379, LocalStack 4566)
cd ~/repos/devportal-infra && ./scripts/setup-dev.sh

# 2. API
cd ~/repos/devportal-api
cp -n .env.example .env
npm install            # NEVER npm ci in any of these repos
npx prisma generate
npx prisma migrate reset --force   # applies migrations + runs prisma/seed.ts (test user)
npm run dev            # :3001, verify with: curl -s -o /dev/null -w '%{http_code}' localhost:3001/health

# 3. Frontend
cd ~/repos/devportal-frontend
cp -n .env.local.example .env.local
npm install
npm run dev            # :5173
```

Test credentials: `dev@devportal.local` / `DevPortal123!` (also in `.env.local` as
`TEST_USER_EMAIL` / `TEST_USER_PASSWORD`).

## Proteção de rotas

- A proteção fica em `src/components/ProtectedRoute.tsx` e cobre `/dashboard/*` e
  `/requests/*`.
- Usuários sem sessão são enviados a `/login?callbackUrl=...`; após o login, retornam
  à rota original.

## Gotchas

- O Vite usa fallback de SPA para as rotas do React Router. Ao servir o build em
  produção, mantenha a configuração do servidor apontando rotas desconhecidas para
  `index.html`.
- Backgrounding `npm run dev` with `(cmd &)` inside a subshell can get the process reaped;
  prefer `nohup npm run dev > /tmp/fe.log 2>&1 &` and poll the port until it answers.
- `~/repos/devportal-infra/scripts/seed-db.sh` is idempotent and can be run either before
  or after `prisma migrate reset` — on an already-migrated DB it emits
  `NOTICE: relation ... already exists, skipping` and just upserts the test user.
  Use `PGDATABASE=<name>` to point it at a scratch database when you want to see it
  create the schema from scratch.
- `/login` lê `callbackUrl` via `useSearchParams`. URLs externas (qualquer coisa que
  não comece com uma única `/`) são convertidas intencionalmente para `/dashboard`.

## Known pre-existing issues (not regressions — do not chase)

- Request detail Timeline renders rows with an icon and date but **no label text**: the API
  returns `eventType` / `payload`, while `RequestTimeline.tsx` reads `event.type` /
  `event.description`.
- `GET /requests` is not author-scoped, so a freshly registered user sees other users'
  requests on their dashboard.

## Devin Secrets Needed

None for local e2e. `GITHUB_TOKEN` only if you need to interact with the GitHub repos.
