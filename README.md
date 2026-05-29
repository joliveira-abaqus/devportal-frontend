# DevPortal Frontend

Interface web do DevPortal — portal de solicitações de desenvolvimento (bug fixes, features e migrations) construído com Next.js 14, TypeScript e Tailwind CSS.

---

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Quick Start](#quick-start)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Autenticação](#autenticação)
- [Dark Mode](#dark-mode)
- [Testes E2E](#testes-e2e)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Repositórios Relacionados](#repositórios-relacionados)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Pré-requisitos

| Ferramenta | Versão mínima |
|------------|---------------|
| Node.js    | 20            |
| npm        | 10            |

O frontend depende do **devportal-api** (porta 3001) que, por sua vez, depende dos serviços de infraestrutura provisionados pelo **devportal-infra** (PostgreSQL, Redis e LocalStack). Consulte a seção [Repositórios Relacionados](#repositórios-relacionados) para a ordem de inicialização completa.

---

## Quick Start

```bash
# 1. Clone o repositório
git clone https://github.com/joliveira-abaqus/devportal-frontend.git
cd devportal-frontend

# 2. Configure as variáveis de ambiente
cp .env.local.example .env.local

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em **http://localhost:3000**.

> **Nota:** Certifique-se de que o `devportal-api` esteja rodando na porta 3001 antes de iniciar o frontend.

---

## Variáveis de Ambiente

Copie `.env.local.example` para `.env.local` e ajuste conforme necessário:

| Variável               | Descrição                                  | Padrão                    |
|------------------------|--------------------------------------------|---------------------------|
| `NEXT_PUBLIC_API_URL`  | URL pública do backend (client-side)       | `http://localhost:3001`   |
| `BACKEND_URL`          | URL do backend (server-side only)          | `http://localhost:3001`   |
| `NEXTAUTH_SECRET`      | Secret usado pelo NextAuth.js para JWT     | —                         |
| `NEXTAUTH_URL`         | URL base da aplicação                      | `http://localhost:3000`   |

---

## Scripts Disponíveis

| Comando             | Descrição                                  |
|---------------------|--------------------------------------------|
| `npm run dev`       | Servidor de desenvolvimento (porta 3000)   |
| `npm run build`     | Build de produção (output standalone)      |
| `npm start`         | Inicia o servidor de produção              |
| `npm run lint`      | Verificação de lint (ESLint + Next.js)     |
| `npm run format`    | Verifica formatação (Prettier)             |
| `npm run format:fix`| Corrige formatação automaticamente         |
| `npm run test:e2e`  | Executa testes E2E com Playwright          |

---

## Estrutura do Projeto

```
src/
├── app/                    # Páginas e rotas (Next.js App Router)
│   ├── api/auth/           # Route handler do NextAuth.js
│   ├── dashboard/          # Painel principal (listagem de solicitações)
│   ├── login/              # Página de login
│   ├── register/           # Página de registro
│   ├── requests/           # Criação e detalhe de solicitações
│   ├── layout.tsx          # Layout raiz (font Inter, providers)
│   ├── providers.tsx       # ThemeProvider + SessionProvider
│   └── globals.css         # Estilos globais Tailwind
├── components/             # Componentes React reutilizáveis
│   ├── ui/                 # Componentes base (Button, Input, Card, etc.)
│   ├── Header.tsx          # Cabeçalho da aplicação
│   ├── Sidebar.tsx         # Menu lateral
│   ├── RequestCard.tsx     # Card de solicitação
│   ├── RequestForm.tsx     # Formulário de nova solicitação
│   ├── RequestTimeline.tsx # Timeline de eventos
│   ├── FileUpload.tsx      # Upload de arquivos
│   ├── StatusBadge.tsx     # Badge de status
│   └── ThemeToggle.tsx     # Alternador dark/light mode
├── hooks/                  # Custom hooks
│   ├── useRequests.ts      # Listagem de solicitações com filtros
│   └── useRequest.ts       # Detalhe de uma solicitação
├── lib/                    # Utilitários e configurações
│   ├── api-client.ts       # Cliente Axios (withCredentials)
│   ├── auth.ts             # Configuração NextAuth.js
│   └── utils.ts            # Helpers (cn, formatDate, labels)
├── types/                  # Definições TypeScript
│   └── index.ts            # Request, User, RequestEvent, etc.
└── middleware.ts            # Proteção de rotas (/dashboard, /requests)
```

---

## Autenticação

A autenticação usa uma estratégia dual:

1. **Cookie backend** — O login chama diretamente `POST /auth/login` no `devportal-api`, que define um cookie `httpOnly` com o JWT.
2. **Sessão NextAuth** — Em seguida, o `NextAuth.js` (CredentialsProvider) cria uma sessão JWT para que o middleware de proteção de rotas funcione.

Rotas protegidas (`/dashboard/*` e `/requests/*`) são guardadas pelo middleware em `src/middleware.ts`. Usuários não autenticados são redirecionados para `/login`.

---

## Dark Mode

O suporte a dark mode é implementado via [next-themes](https://github.com/paetzoldthomas/next-themes) com a estratégia `class`. O componente `ThemeToggle` permite alternar entre os temas claro, escuro e sistema. O Tailwind CSS está configurado com `darkMode: 'class'`.

---

## Testes E2E

Os testes end-to-end utilizam [Playwright](https://playwright.dev/) e estão localizados no diretório `e2e/`:

```bash
# Instalar browsers do Playwright (primeira vez)
npx playwright install --with-deps

# Executar testes
npm run test:e2e

# Executar com interface gráfica
npm run test:e2e:ui
```

> Os testes E2E requerem que o ecossistema completo (infra + api + frontend) esteja rodando.

---

## Docker

O projeto inclui um `Dockerfile` multi-stage otimizado para produção, usando a configuração `output: 'standalone'` do Next.js:

```bash
# Build da imagem
docker build -t devportal-frontend .

# Executar o container
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=sua-secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3001 \
  -e BACKEND_URL=http://localhost:3001 \
  devportal-frontend
```

A imagem base é `node:20-alpine` e o servidor de produção roda na porta **3000**.

---

## CI/CD

O pipeline de CI ([GitHub Actions](.github/workflows/ci.yml)) é executado em cada push e pull request para `main`:

| Job               | Etapas                                    |
|-------------------|-------------------------------------------|
| `lint-test-build` | `npm ci` → `lint` → `test` → `build`     |
| `e2e`             | Build + Playwright (com PostgreSQL e Redis) |

Os artefatos do Playwright (relatórios, screenshots, vídeos) são salvos por **7 dias**.

---

## Repositórios Relacionados

O DevPortal é composto por três repositórios que devem ser iniciados nesta ordem:

| #  | Repositório | Descrição | Porta |
|----|-------------|-----------|-------|
| 1  | [devportal-infra](https://github.com/joliveira-abaqus/devportal-infra) | Infraestrutura local (PostgreSQL, Redis, LocalStack) | 5432, 6379, 4566 |
| 2  | [devportal-api](https://github.com/joliveira-abaqus/devportal-api) | Backend Express + Prisma | 3001 |
| 3  | **devportal-frontend** (este repositório) | Frontend Next.js | 3000 |

---

## Contribuição

1. Crie uma branch a partir de `main` seguindo o padrão: `feature/<escopo-da-alteracao>`
2. Escreva comentários e mensagens de commit em **Português (BR)**
3. Valide com `npm run lint` e `npm run format` antes de abrir o PR
4. Abra um Pull Request para `main`

---

## Licença

Este projeto é de uso interno. Consulte o administrador do repositório para informações sobre licenciamento.

---

_Originally written and maintained by contributors and [Devin](https://app.devin.ai), with updates from the core team._
