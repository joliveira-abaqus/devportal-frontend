# devportal-frontend

Frontend do DevPortal em React, Vite e React Router.

## Desenvolvimento

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

O servidor inicia na porta 5173. A API deve estar disponível em `http://localhost:3001`.

## Verificações

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run test:e2e
```
