# DevPortal Frontend

Aplicação frontend do DevPortal construída com **Angular 18**, TypeScript e Tailwind CSS.

Comunica-se com o `devportal-api` (porta 3001) via cookies HTTP-only para autenticação JWT.

## Stack Técnico

- **Framework:** Angular 18 (Standalone Components)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS 3
- **HTTP:** HttpClient com interceptors
- **Formulários:** Reactive Forms
- **Ícones:** lucide-angular
- **Testes E2E:** Playwright

## Pré-requisitos

- Node.js 20+
- npm 10+

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
# ou
ng serve --port 3000
```

Acesse http://localhost:3000

## Build de Produção

```bash
npm run build
```

Os artefatos ficam em `dist/devportal-frontend/`.

## Testes

```bash
# Testes unitários
npm test

# Testes E2E (requer backend rodando)
npm run test:e2e
```

## Lint

```bash
npm run lint
```

## Docker

```bash
docker build -t devportal-frontend .
docker run -p 3000:3000 devportal-frontend
```

## Configuração da API

A URL da API é configurada em `src/environments/`:

- **Desenvolvimento:** `http://localhost:3001` (`environment.ts`)
- **Produção:** `/api` (`environment.prod.ts`)

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/              # Models, services, guards, interceptors
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── services/
│   ├── features/          # Módulos de funcionalidades
│   │   ├── auth/          # Login e Registro
│   │   ├── dashboard/     # Dashboard e listagem
│   │   └── requests/      # Criação e detalhe de requests
│   ├── layout/            # Header, Sidebar, Dashboard Layout
│   └── shared/            # Componentes UI reutilizáveis
│       └── components/
├── environments/          # Configuração por ambiente
└── styles.scss            # Estilos globais (Tailwind)
```

## Variáveis de Ambiente

As configurações são geridas via `src/environments/`:

| Variável | Descrição | Padrão (dev) |
|----------|-----------|--------------|
| `apiUrl` | URL do backend | `http://localhost:3001` |
| `production` | Flag de produção | `false` |
