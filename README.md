# DevPortal — Frontend

Interface web do DevPortal, um portal de gestão de solicitações técnicas para desenvolvedores. Construído com **Next.js 14** (App Router), **TypeScript** e **Tailwind CSS**.

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Quick Start](#quick-start)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Autenticação](#autenticação)
- [Temas (Dark/Light)](#temas-darklight)
- [Testes E2E](#testes-e2e)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Repositórios Relacionados](#repositórios-relacionados)
- [Licença](#licença)

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 20
- [npm](https://www.npmjs.com/) >= 10
- [devportal-infra](https://github.com/joliveira-abaqus/devportal-infra) rodando (PostgreSQL, Redis, LocalStack)
- [devportal-api](https://github.com/joliveira-abaqus/devportal-api) rodando na porta 3001

> A ordem de inicialização do ecossistema é: **infra → api → frontend**.

## Quick Start

```bash
# 1. Instalar dependências
npm ci

# 2. Configurar variáveis de ambiente
cp .env.local.example .env.local

# 3. Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

**Credenciais de teste:** `dev@devportal.local` / `DevPortal123!`

## Variáveis de Ambiente

Copie `.env.local.example` para `.env.local` e ajuste conforme necessário:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NEXT_PUBLIC_API_URL` | URL pública do backend (client-side) | `http://localhost:3001` |
| `NEXTAUTH_SECRET` | Secret para assinar tokens NextAuth | — |
| `NEXTAUTH_URL` | URL base da aplicação | `http://localhost:3000` |
| `BACKEND_URL` | URL do backend (server-side) | `http://localhost:3001` |

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (porta 3000) |
| `npm run build` | Build de produção |
| `npm start` | Inicia o build de produção |
| `npm run lint` | Verificação de lint (ESLint) |
| `npm run format` | Verificação de formatação (Prettier) |
| `npm run format:fix` | Corrigir formatação automaticamente |
| `npm run test:e2e` | Testes E2E com Playwright |
| `npm run test:e2e:ui` | Testes E2E com interface visual |

## Estrutura do Projeto

```
src/
├── app/                    # Páginas e rotas (App Router)
│   ├── api/auth/           # Rota de autenticação NextAuth
│   ├── dashboard/          # Painel principal
│   ├── login/              # Página de login
│   ├── register/           # Página de cadastro
│   ├── requests/           # Solicitações (listagem, detalhe, criação)
│   ├── layout.tsx          # Layout raiz
│   ├── providers.tsx       # Providers (sessão, tema)
│   └── globals.css         # Estilos globais
├── components/             # Componentes React reutilizáveis
│   ├── ui/                 # Componentes base (Button, Card, Input, etc.)
│   ├── Header.tsx          # Cabeçalho
│   ├── Sidebar.tsx         # Menu lateral
│   ├── RequestCard.tsx     # Card de solicitação
│   ├── RequestForm.tsx     # Formulário de solicitação
│   ├── RequestTimeline.tsx # Timeline de eventos
│   ├── StatusBadge.tsx     # Badge de status
│   ├── FileUpload.tsx      # Upload de arquivos
│   └── ThemeToggle.tsx     # Alternador de tema
├── hooks/                  # Custom hooks
│   ├── useRequest.ts       # Hook para uma solicitação
│   └── useRequests.ts      # Hook para listagem de solicitações
├── lib/                    # Utilitários e configurações
│   ├── api-client.ts       # Cliente Axios (withCredentials)
│   ├── auth.ts             # Configuração NextAuth
│   └── utils.ts            # Funções auxiliares
├── types/                  # Definições TypeScript
│   └── index.ts            # Interfaces e tipos
└── middleware.ts           # Proteção de rotas (autenticação)
```

## Autenticação

A autenticação usa **NextAuth.js** com `CredentialsProvider`:

1. O usuário envia email/senha para o `devportal-api` (porta 3001).
2. O backend retorna um cookie httpOnly com o JWT.
3. O NextAuth cria uma sessão local com estratégia JWT stateless.

O `middleware.ts` protege as rotas `/dashboard` e `/requests`, redirecionando para `/login` quando não há sessão ativa.

## Temas (Dark/Light)

O suporte a temas é implementado via `next-themes` com a estratégia `class` do Tailwind CSS. O componente `ThemeToggle` permite alternar entre modo claro e escuro, respeitando a preferência do sistema operacional como padrão.

## Testes E2E

Os testes end-to-end utilizam [Playwright](https://playwright.dev/) e ficam no diretório `e2e/`:

```bash
# Executar testes E2E (requer infra + api rodando)
npm run test:e2e

# Executar com interface visual
npm run test:e2e:ui
```

Os testes cobrem fluxos de autenticação e gerenciamento de solicitações.

## Docker

O projeto inclui um `Dockerfile` multi-stage otimizado para produção com output `standalone` do Next.js:

```bash
# Build da imagem
docker build -t devportal-frontend .

# Executar o container
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=sua-secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e BACKEND_URL=http://host.docker.internal:3001 \
  devportal-frontend
```

A imagem usa `node:20-alpine` e roda na porta 3000.

## CI/CD

O pipeline de CI (GitHub Actions) é executado em push e PRs para `main`:

1. **Lint + Test + Build** — `npm run lint`, `npm run test`, `npm run build`
2. **E2E** — Testes Playwright com serviços PostgreSQL e Redis (artefatos salvos por 7 dias)

## Repositórios Relacionados

| Repositório | Descrição |
|-------------|-----------|
| [devportal-infra](https://github.com/joliveira-abaqus/devportal-infra) | Infraestrutura local (Docker Compose) |
| [devportal-api](https://github.com/joliveira-abaqus/devportal-api) | Backend Express + Prisma |

## Licença

Uso interno.

---

_Originalmente escrito e mantido por contribuidores e [Devin](https://app.devin.ai), com atualizações do time principal._
