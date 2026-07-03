# DevPortal Frontend

Interface web para gerenciamento de solicitações de desenvolvimento (bugs, features e migrações), construída com Next.js 14, TypeScript e Tailwind CSS.

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Início Rápido](#início-rápido)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Arquitetura](#arquitetura)
- [Testes E2E](#testes-e2e)
- [Docker](#docker)
- [Convenções](#convenções)
- [Repositórios Relacionados](#repositórios-relacionados)

## Pré-requisitos

| Ferramenta | Versão mínima |
| ---------- | ------------- |
| Node.js    | 20.x          |
| npm        | 10.x          |

O backend (`devportal-api`) deve estar rodando na porta **3001** para que login, listagem e criação de solicitações funcionem. Para subir toda a infraestrutura local (PostgreSQL, Redis, LocalStack), consulte o repositório [devportal-infra](https://github.com/joliveira-abaqus/devportal-infra).

## Início Rápido

```bash
# 1. Clone o repositório
git clone https://github.com/joliveira-abaqus/devportal-frontend.git
cd devportal-frontend

# 2. Instale as dependências
npm ci

# 3. Configure as variáveis de ambiente
cp .env.local.example .env.local

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## Variáveis de Ambiente

Copie `.env.local.example` para `.env.local`. As variáveis disponíveis são:

| Variável              | Descrição                                         | Padrão                  |
| --------------------- | ------------------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | URL pública do backend (chamadas client-side)     | `http://localhost:3001` |
| `BACKEND_URL`         | URL do backend (chamadas server-side)             | `http://localhost:3001` |
| `NEXTAUTH_SECRET`     | Secret usado pelo NextAuth.js para assinar tokens | _(obrigatório)_         |
| `NEXTAUTH_URL`        | URL canônica da aplicação                         | `http://localhost:3000` |

## Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento (porta 3000)
npm run build        # Build de produção (output standalone)
npm run start        # Inicia o servidor de produção após o build
npm run lint         # Verificação de lint (ESLint + Next.js)
npm run format       # Verificação de formatação (Prettier)
npm run format:fix   # Correção automática de formatação
npm run test:e2e     # Testes E2E com Playwright
npm run test:e2e:ui  # Testes E2E com interface visual do Playwright
```

## Estrutura do Projeto

```
src/
├── app/                    # Rotas e páginas (Next.js App Router)
│   ├── api/auth/           # Rota da API NextAuth.js
│   ├── dashboard/          # Dashboard principal (listagem e filtros)
│   ├── login/              # Tela de login
│   ├── register/           # Tela de registro
│   ├── requests/           # Criação e detalhes de solicitações
│   │   ├── [id]/           # Detalhe de uma solicitação (timeline)
│   │   └── new/            # Formulário de nova solicitação
│   ├── layout.tsx          # Layout raiz (fonte Inter, providers)
│   ├── providers.tsx       # SessionProvider + ThemeProvider
│   └── globals.css         # Estilos globais (Tailwind)
├── components/             # Componentes React reutilizáveis
│   ├── ui/                 # Primitivos (Button, Card, Input, etc.)
│   ├── Header.tsx          # Cabeçalho com info do usuário
│   ├── Sidebar.tsx         # Navegação lateral fixa
│   ├── RequestCard.tsx     # Card de solicitação na listagem
│   ├── RequestForm.tsx     # Formulário com validação Zod
│   ├── RequestTimeline.tsx # Linha do tempo de eventos
│   ├── StatusBadge.tsx     # Indicador visual de status
│   ├── FileUpload.tsx      # Upload de anexos
│   └── ThemeToggle.tsx     # Alternância dark/light mode
├── hooks/                  # Custom hooks
│   ├── useRequest.ts       # Busca uma solicitação por ID
│   └── useRequests.ts      # Listagem com filtros (status, tipo)
├── lib/                    # Utilitários e configurações
│   ├── api-client.ts       # Cliente Axios (withCredentials)
│   ├── auth.ts             # Configuração do NextAuth.js
│   └── utils.ts            # Funções auxiliares (cn, etc.)
├── types/                  # Definições TypeScript
│   └── index.ts            # Request, User, RequestEvent, etc.
└── middleware.ts           # Proteção de rotas via JWT
e2e/                        # Testes end-to-end (Playwright)
```

## Arquitetura

### Autenticação (Dual-Layer)

O login utiliza duas camadas para manter sincronia entre backend e frontend:

1. **Cookie httpOnly** — a API (`/auth/login`) define um cookie `token` com o JWT, usado nas chamadas Axios subsequentes.
2. **Sessão NextAuth.js** — o `CredentialsProvider` cria uma sessão no lado do Next.js, permitindo que o middleware proteja rotas `/dashboard` e `/requests` sem chamadas extras ao backend.

### Comunicação com o Backend

Todas as chamadas ao `devportal-api` passam pelo cliente Axios em `src/lib/api-client.ts`, configurado com `withCredentials: true`. Respostas 401 redirecionam automaticamente para `/login`.

### Tema (Dark/Light Mode)

Gerenciado pelo `next-themes` com estratégia `class`. O tema padrão segue a preferência do sistema operacional. O componente `ThemeToggle` na sidebar permite alternar manualmente.

### Tipos de Solicitação

| Tipo        | Descrição                           |
| ----------- | ----------------------------------- |
| `bug_fix`   | Correção de defeito                 |
| `feature`   | Nova funcionalidade                 |
| `migration` | Migração de dados ou infraestrutura |

### Status de uma Solicitação

`pending` → `in_progress` → `review` → `done` (ou `failed` em qualquer etapa)

## Testes E2E

Os testes end-to-end utilizam [Playwright](https://playwright.dev/) e estão em `e2e/`.

```bash
# Instalar navegadores do Playwright (primeira vez)
npx playwright install --with-deps

# Executar testes
npm run test:e2e

# Executar com interface visual
npm run test:e2e:ui
```

Os testes exigem que o backend e a infraestrutura local estejam rodando. Consulte o [devportal-infra](https://github.com/joliveira-abaqus/devportal-infra) para configuração.

Na CI (GitHub Actions), os testes rodam automaticamente após o build, com PostgreSQL e Redis provisionados como services. Relatórios do Playwright são salvos como artefatos por 7 dias.

## Docker

A aplicação pode ser executada em container usando o Dockerfile multi-stage incluído:

```bash
# Build da imagem
docker build -t devportal-frontend .

# Executar o container
docker run -p 3000:3000 \
  -e NEXTAUTH_SECRET=sua-secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3001 \
  devportal-frontend
```

A imagem utiliza Node.js 20 Alpine com [standalone output](https://nextjs.org/docs/app/api-reference/next-config-js/output) para mínimo tamanho em produção.

## Convenções

- **Idioma**: comentários, commits e PRs em português (BR).
- **Branches**: `feature/<escopo-da-alteracao>` (kebab-case).
- **Componentes**: PascalCase; hooks com prefixo `use`.
- **Formulários**: validação com Zod via `zodResolver`.
- **Formatação**: Prettier (semi, singleQuote, trailingComma: all) + ESLint (next/core-web-vitals).
- **Imports**: `@/*` mapeia para `src/*`.

## Repositórios Relacionados

| Repositório                                                            | Descrição                                          |
| ---------------------------------------------------------------------- | -------------------------------------------------- |
| [devportal-api](https://github.com/joliveira-abaqus/devportal-api)     | Backend API (Node.js, Express, Prisma, PostgreSQL) |
| [devportal-infra](https://github.com/joliveira-abaqus/devportal-infra) | Infraestrutura local (Docker Compose, LocalStack)  |

---

_Originally written and maintained by contributors and [Devin](https://devin.ai), with updates from the core team._
