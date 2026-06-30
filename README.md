# DevPortal Frontend

Interface web do DevPortal — portal de solicitações de desenvolvimento (bug fixes, features e migrações) com autenticação, dashboard e acompanhamento de status em tempo real.

## Sumário

- [Stack Técnico](#stack-técnico)
- [Pré-requisitos](#pré-requisitos)
- [Início Rápido](#início-rápido)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Autenticação](#autenticação)
- [Testes](#testes)
- [Docker](#docker)
- [CI/CD](#cicd)
- [Repositórios Relacionados](#repositórios-relacionados)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Stack Técnico

| Tecnologia | Versão | Uso |
|---|---|---|
| [Next.js](https://nextjs.org/) | 14 | Framework React (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | 5.4+ | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4+ | Estilização utility-first |
| [NextAuth.js](https://next-auth.js.org/) | 4.x | Autenticação (CredentialsProvider + JWT) |
| [Axios](https://axios-http.com/) | 1.7+ | Cliente HTTP (cookies httpOnly) |
| [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) | — | Validação de formulários |
| [Lucide React](https://lucide.dev/) | — | Ícones |
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4+ | Dark mode |
| [Playwright](https://playwright.dev/) | 1.43+ | Testes E2E |

## Pré-requisitos

- **Node.js** >= 20
- **npm** >= 10
- Backend [devportal-api](https://github.com/joliveira-abaqus/devportal-api) rodando na porta `3001`
- Infraestrutura local via [devportal-infra](https://github.com/joliveira-abaqus/devportal-infra) (PostgreSQL, Redis, LocalStack)

## Início Rápido

### 1. Subir a infraestrutura e o backend

```bash
# No repositório devportal-infra
cd devportal-infra && ./scripts/setup-dev.sh

# No repositório devportal-api
cd devportal-api && cp .env.example .env && npx prisma migrate dev && npm run dev
```

### 2. Configurar e iniciar o frontend

```bash
# Clonar e instalar
git clone https://github.com/joliveira-abaqus/devportal-frontend.git
cd devportal-frontend
npm install

# Copiar variáveis de ambiente
cp .env.local.example .env.local

# Iniciar o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em **http://localhost:3000**.

> Credenciais de teste disponíveis em `.env.local.example`.

## Variáveis de Ambiente

Copie `.env.local.example` para `.env.local` e ajuste conforme necessário:

| Variável | Descrição | Padrão |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL pública do backend (client-side) | `http://localhost:3001` |
| `BACKEND_URL` | URL do backend (server-side) | `http://localhost:3001` |
| `NEXTAUTH_SECRET` | Secret para assinatura JWT do NextAuth | — |
| `NEXTAUTH_URL` | URL da aplicação | `http://localhost:3000` |

## Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento (porta 3000)
npm run build        # Build de produção (output standalone)
npm run start        # Servidor de produção
npm run lint         # ESLint (next/core-web-vitals)
npm run format       # Verificação de formatação (Prettier)
npm run format:fix   # Correção automática de formatação
npm run test:e2e     # Testes E2E com Playwright
npm run test:e2e:ui  # Testes E2E com interface visual
```

## Estrutura do Projeto

```
src/
├── app/                    # Páginas e rotas (Next.js App Router)
│   ├── api/auth/           # Rota NextAuth (/api/auth/[...nextauth])
│   ├── dashboard/          # Dashboard principal (protegido)
│   ├── login/              # Página de login
│   ├── register/           # Página de cadastro
│   ├── requests/           # CRUD de solicitações (protegido)
│   │   ├── new/            # Nova solicitação
│   │   └── [id]/           # Detalhes da solicitação
│   ├── layout.tsx          # Layout raiz (fonte Inter, Providers)
│   ├── providers.tsx       # SessionProvider + ThemeProvider
│   └── globals.css         # Estilos globais (Tailwind)
├── components/             # Componentes React reutilizáveis
│   ├── ui/                 # Primitivos (Button, Input, Select, Card, Badge, Modal)
│   ├── Header.tsx          # Cabeçalho com navegação
│   ├── Sidebar.tsx         # Menu lateral
│   ├── RequestCard.tsx     # Card de solicitação
│   ├── RequestForm.tsx     # Formulário de criação/edição
│   ├── RequestTimeline.tsx # Linha do tempo de eventos
│   ├── FileUpload.tsx      # Upload de anexos
│   ├── StatusBadge.tsx     # Badge de status
│   └── ThemeToggle.tsx     # Alternador dark/light mode
├── hooks/                  # Custom hooks
│   ├── useRequests.ts      # Listagem de solicitações
│   └── useRequest.ts       # Detalhes de uma solicitação
├── lib/                    # Utilitários e configurações
│   ├── api-client.ts       # Instância Axios configurada
│   ├── auth.ts             # Configuração NextAuth (JWT + Credentials)
│   └── utils.ts            # Helpers (cn, formatDate, labels)
├── types/                  # Definições TypeScript
│   └── index.ts            # Request, RequestEvent, User, etc.
└── middleware.ts            # Proteção de rotas (/dashboard/*, /requests/*)
```

## Autenticação

A autenticação utiliza uma estratégia dual:

1. **Login no backend** — `POST /auth/login` na API (porta 3001), que define um cookie `token` httpOnly no navegador.
2. **Sessão NextAuth** — `CredentialsProvider` cria uma sessão JWT client-side para o middleware de proteção de rotas.

Rotas protegidas pelo middleware: `/dashboard/*` e `/requests/*`. Usuários não autenticados são redirecionados para `/login` com `callbackUrl`.

## Testes

### E2E (Playwright)

Os testes end-to-end estão em `e2e/` e cobrem fluxos de autenticação (`auth.spec.ts`) e gerenciamento de solicitações (`requests.spec.ts`).

```bash
# Requer devportal-infra + devportal-api rodando
npm run test:e2e

# Com interface visual para debugging
npm run test:e2e:ui
```

## Docker

Build multi-stage com output `standalone` do Next.js:

```bash
docker build -t devportal-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3001 \
  -e NEXTAUTH_SECRET=sua-secret \
  -e NEXTAUTH_URL=http://localhost:3000 \
  -e BACKEND_URL=http://api:3001 \
  devportal-frontend
```

## CI/CD

O pipeline de CI (GitHub Actions) executa em cada push/PR para `main`:

1. **lint-test-build** — `npm ci` → `npm run lint` → `npm test` → `npm run build`
2. **e2e** — Build + Playwright com serviços PostgreSQL e Redis; artefatos salvos por 7 dias.

Além disso, uma auditoria semanal de dependências (`npm audit` + `npm outdated`) roda toda segunda-feira.

## Repositórios Relacionados

| Repositório | Descrição |
|---|---|
| [devportal-api](https://github.com/joliveira-abaqus/devportal-api) | Backend Express + Prisma (porta 3001) |
| [devportal-infra](https://github.com/joliveira-abaqus/devportal-infra) | Docker Compose — PostgreSQL, Redis, LocalStack |

## Contribuição

1. Crie uma branch: `feature/<escopo-da-alteracao>` (kebab-case)
2. Commits e comentários em **português (BR)**
3. Validação de formulários sempre com **Zod**
4. Componentes em **PascalCase**, hooks com prefixo `use`
5. Execute `npm run lint` e `npm run format` antes de abrir o PR

## Licença

Projeto privado. Todos os direitos reservados.

---

_Originalmente escrito e mantido por contribuidores e [Devin](https://app.devin.ai), com atualizações do time principal._
