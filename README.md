# DevPortal Frontend (Angular)

Aplicação frontend do DevPortal construída com Angular 18, TypeScript e Tailwind CSS.
Comunica-se com o `devportal-api` (porta 3001) via cookies httpOnly para autenticação JWT.

## Stack Técnico

- **Framework:** Angular 18 (Standalone Components, Signals-ready)
- **Linguagem:** TypeScript 5.5
- **Estilização:** Tailwind CSS + @tailwindcss/forms
- **HTTP Client:** Angular HttpClient com interceptors
- **Formulários:** Angular Reactive Forms
- **Ícones:** SVG inline (equivalente ao Lucide usado anteriormente)
- **Testes E2E:** Playwright

## Estrutura do Projeto

```
src/
├── app/
│   ├── auth/           # Módulo de autenticação (Login, Register)
│   ├── core/           # Services, Guards, Interceptors
│   ├── dashboard/      # Módulo do dashboard
│   ├── layout/         # Layout (Sidebar, Header, ThemeToggle)
│   ├── models/         # TypeScript interfaces/types
│   ├── requests/       # Módulo de solicitações (New, Detail, Timeline)
│   └── shared/         # Componentes UI reutilizáveis + utils
├── environments/       # Configurações de ambiente
└── styles.css          # Estilos globais (Tailwind)
```

## Pré-requisitos

- Node.js 20+
- npm 10+

## Instalação

```bash
npm install
```

## Comandos

```bash
npm run dev          # Servidor de desenvolvimento (porta 4200)
npm run build        # Build de produção
npm run lint         # Verificação de lint (ESLint + Angular)
npm run test:e2e     # Testes E2E com Playwright
```

## Variáveis de Ambiente

Configuradas em `src/environments/environment.ts`:

- `apiUrl` - URL do backend (padrão: `http://localhost:3001`)

## Convenções

- Idioma dos comentários e commits: Português (BR)
- Branch naming: `feature/<escopo-da-alteracao>` (kebab-case)
- Componentes standalone (sem NgModules)
- Validação de formulários com Angular Reactive Forms + Validators

## Testes

- Testes E2E em `e2e/` usando Playwright
- Credenciais de teste: `dev@devportal.local` / `DevPortal123!`
