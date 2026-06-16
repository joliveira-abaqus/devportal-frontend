# DevPortal Frontend

Interface gráfica do DevPortal — portal onde desenvolvedores criam e acompanham solicitações técnicas (bugs, features e migrações) com autenticação integrada e tema dark/light.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Quick Start](#quick-start)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Arquitetura e Conceitos-Chave](#arquitetura-e-conceitos-chave)
- [Docker](#docker)
- [Testes](#testes)
- [CI/CD](#cicd)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Visão Geral

O DevPortal Frontend é uma aplicação [Next.js 14](https://nextjs.org/) (App Router) que consome a [devportal-api](https://github.com/joliveira-abaqus/devportal-api) para oferecer:

- **Autenticação** — login/registro com estratégia dual-auth (cookie backend + sessão NextAuth).
- **Dashboard** — listagem e filtragem de solicitações por status e tipo.
- **Gerenciamento de Solicitações** — criação, visualização de detalhes e timeline de eventos.
- **Tema Dark/Light** — alternância via `next-themes` com suporte a preferência do sistema.
- **Proteção de Rotas** — middleware global que redireciona usuários não autenticados.

---

## Tecnologias

| Categoria | Tecnologia |
|-----------|-----------|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript 5.4+ |
| UI | React 18, Tailwind CSS 3.4, Lucide React |
| Autenticação | NextAuth.js (CredentialsProvider, JWT) |
| Formulários | React Hook Form + Zod |
| HTTP Client | Axios (withCredentials) |
| Tema | next-themes |
| Utilitários | clsx, tailwind-merge, date-fns |
| Testes E2E | Playwright |
| Linting | ESLint (next/core-web-vitals), Prettier |

---

## Requisitos

- **Node.js** ≥ 20 (recomendado: 20 LTS)
- **npm** ≥ 9
- **devportal-api** rodando na porta `3001` (veja [devportal-api](https://github.com/joliveira-abaqus/devportal-api))
- **devportal-infra** para serviços de infraestrutura (PostgreSQL, Redis, LocalStack) — veja [devportal-infra](https://github.com/joliveira-abaqus/devportal-infra)

---

## Quick Start

### 1. Clone o repositório

```bash
git clone https://github.com/joliveira-abaqus/devportal-frontend.git
cd devportal-frontend
```

### 2. Instale as dependências

```bash
# npm
npm install

# yarn
yarn install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` conforme necessário (veja [Variáveis de Ambiente](#variáveis-de-ambiente)).

### 4. Inicie o servidor de desenvolvimento

```bash
# npm
npm run dev

# yarn
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

> **Nota:** o backend (`devportal-api`) e a infraestrutura (`devportal-infra`) devem estar rodando antes de iniciar o frontend. Consulte o [devportal-infra](https://github.com/joliveira-abaqus/devportal-infra) para instruções de inicialização.

---

## Variáveis de Ambiente

Copie `.env.local.example` para `.env.local` e configure:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NEXT_PUBLIC_API_URL` | URL pública da API (chamadas client-side) | `http://localhost:3001` |
| `BACKEND_URL` | URL da API para chamadas server-side | `http://localhost:3001` |
| `NEXTAUTH_SECRET` | Secret para assinar tokens JWT do NextAuth | — |
| `NEXTAUTH_URL` | URL base da aplicação | `http://localhost:3000` |

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento (porta 3000) |
| `npm run build` | Gera o build de produção (standalone) |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa verificação de lint (ESLint) |
| `npm run format` | Verifica formatação (Prettier) |
| `npm run format:fix` | Corrige formatação automaticamente |
| `npm run test` | Executa testes unitários |
| `npm run test:e2e` | Executa testes E2E com Playwright |
| `npm run test:e2e:ui` | Abre a UI do Playwright para testes interativos |

---

## Estrutura do Projeto

```
devportal-frontend/
├── public/                  # Arquivos estáticos (logo, ícones)
├── e2e/                     # Testes E2E (Playwright)
│   ├── auth.spec.ts         # Testes de autenticação
│   ├── requests.spec.ts     # Testes de solicitações
│   └── playwright.config.ts # Configuração do Playwright
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/auth/        # Route handler do NextAuth
│   │   ├── dashboard/       # Páginas do dashboard
│   │   ├── login/           # Página de login
│   │   ├── register/        # Página de registro
│   │   ├── requests/        # Páginas de solicitações (new, [id])
│   │   ├── layout.tsx       # Layout raiz (fonte Inter, providers)
│   │   ├── providers.tsx    # ThemeProvider + SessionProvider
│   │   ├── globals.css      # Estilos globais Tailwind
│   │   └── page.tsx         # Página inicial
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── ui/              # Componentes base (Button, Card, Input, Modal, Select, Badge)
│   │   ├── Header.tsx       # Cabeçalho com info do usuário e logout
│   │   ├── Sidebar.tsx      # Navegação lateral com links e ThemeToggle
│   │   ├── RequestCard.tsx  # Card de solicitação na listagem
│   │   ├── RequestForm.tsx  # Formulário de criação (Zod + React Hook Form)
│   │   ├── RequestTimeline.tsx # Timeline de eventos da solicitação
│   │   ├── FileUpload.tsx   # Componente de upload de arquivos
│   │   ├── StatusBadge.tsx  # Badge de status com cores
│   │   └── ThemeToggle.tsx  # Alternância dark/light
│   ├── hooks/               # Custom React hooks
│   │   ├── useRequests.ts   # Busca lista de solicitações com filtros
│   │   └── useRequest.ts    # Busca solicitação individual por ID
│   ├── lib/                 # Utilitários e configurações
│   │   ├── api-client.ts    # Instância Axios configurada
│   │   ├── auth.ts          # Configuração do NextAuth (CredentialsProvider)
│   │   └── utils.ts         # Helpers (cn, formatDate, labels)
│   ├── types/               # Definições de tipos TypeScript
│   │   └── index.ts         # Request, User, RequestEvent, payloads
│   └── middleware.ts        # Guard de autenticação (protege /dashboard e /requests)
├── Dockerfile               # Build multi-stage para produção
├── next.config.js           # Configuração do Next.js (standalone output)
├── tailwind.config.ts       # Tailwind CSS (dark mode, cores brand)
├── tsconfig.json            # Configuração TypeScript (strict, path aliases)
├── .eslintrc.json           # ESLint (next/core-web-vitals)
├── .prettierrc              # Prettier (semi, singleQuote, tailwindcss plugin)
└── package.json             # Dependências e scripts
```

---

## Arquitetura e Conceitos-Chave

### Autenticação Dual-Auth

O login utiliza uma estratégia em duas etapas:

1. **Cookie backend** — uma chamada direta ao endpoint `/auth/login` da API define o cookie `token` httpOnly no navegador, permitindo chamadas autenticadas via Axios.
2. **Sessão NextAuth** — em seguida, `signIn('credentials', ...)` cria uma sessão JWT no Next.js, usada pelo middleware para proteger rotas.

### Proteção de Rotas

O middleware (`src/middleware.ts`) intercepta requisições para `/dashboard/*` e `/requests/*`. Se o token JWT do NextAuth não existir, redireciona para `/login` com `callbackUrl` para retorno pós-autenticação.

### Validação de Formulários

Formulários utilizam **React Hook Form** com **Zod resolvers** para validação declarativa. Os schemas Zod definem regras de validação (comprimento mínimo, formato de email, etc.) e os erros são exibidos inline.

### Tema Dark/Light

Gerenciado pelo `next-themes` com `darkMode: 'class'` no Tailwind. O componente `ThemeToggle` permite alternância manual, e o tema do sistema é respeitado como padrão. Um pattern de `mounted` state previne mismatches de hidratação SSR.

### API Client

Instância Axios centralizada (`src/lib/api-client.ts`) com `withCredentials: true` para enviar cookies automaticamente. Um interceptor redireciona para `/login` em respostas `401`.

### Path Aliases

O projeto usa `@/*` mapeado para `./src/*` via `tsconfig.json`, permitindo imports como `@/components/ui/Button`.

---

## Docker

O projeto inclui um `Dockerfile` multi-stage otimizado para produção:

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

A imagem utiliza Node.js 20 Alpine com output `standalone` do Next.js para menor tamanho final.

---

## Testes

### Testes E2E (Playwright)

Os testes end-to-end estão em `e2e/` e cobrem fluxos de autenticação e gerenciamento de solicitações.

```bash
# Instalar browsers do Playwright
npx playwright install --with-deps

# Executar testes
npm run test:e2e

# Modo interativo
npm run test:e2e:ui
```

> **Nota:** os testes E2E requerem que a infraestrutura completa esteja rodando (devportal-infra + devportal-api + frontend).

---

## CI/CD

O projeto utiliza **GitHub Actions** com o workflow definido em `.github/workflows/ci.yml`:

1. **lint-test-build** — instala dependências, executa lint, testes e build.
2. **e2e** — após o build, executa testes Playwright com serviços PostgreSQL e Redis.

Artefatos do Playwright (relatórios, screenshots, vídeos) são salvos por **7 dias**.

---

## Contribuição

1. Faça um fork do repositório.
2. Crie uma branch com o prefixo `feature/`: `git checkout -b feature/minha-alteracao`.
3. Escreva commits e comentários em **português (BR)**.
4. Siga as convenções de código: componentes em PascalCase, hooks com prefixo `use`, validação de formulários com Zod.
5. Verifique lint e formatação antes de enviar:
   ```bash
   npm run lint
   npm run format
   ```
6. Abra um Pull Request para a branch `main`.

---

## Licença

Este projeto é distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.

---

_Originally written and maintained by contributors and [Devin](https://app.devin.ai), with updates from the core team._
