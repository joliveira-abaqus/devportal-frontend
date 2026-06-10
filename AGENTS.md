# AGENTS.md - DevPortal Frontend

## Visão Geral
Aplicação frontend do DevPortal construída com Angular 18 (Standalone Components), TypeScript e Tailwind CSS.
Comunica-se com o `devportal-api` (porta 3001) via cookies httpOnly para autenticação JWT.

## Stack Técnico
- **Framework:** Angular 18 (Standalone Components)
- **Linguagem:** TypeScript 5.5
- **Estilização:** Tailwind CSS + @tailwindcss/forms
- **HTTP Client:** Angular HttpClient com interceptors
- **Formulários:** Angular Reactive Forms
- **Ícones:** SVG inline
- **Testes E2E:** Playwright

## Estrutura do Projeto
```
src/
├── app/
│   ├── auth/           # Login e Register
│   ├── core/           # Services, Guards, Interceptors
│   ├── dashboard/      # Dashboard e RequestCard
│   ├── layout/         # Layout, Sidebar, Header, ThemeToggle
│   ├── models/         # TypeScript interfaces/types
│   ├── requests/       # Nova solicitação, Detalhe, Timeline
│   └── shared/         # Componentes UI reutilizáveis + utils
├── environments/       # Configurações de ambiente
└── styles.css          # Estilos globais (Tailwind)
```

## Comandos Essenciais
```bash
npm run dev        # Servidor de desenvolvimento (porta 4200)
npm run build      # Build de produção
npm run lint       # Verificação de lint (ESLint + Angular)
npm run test:e2e   # Testes E2E com Playwright
```

## Variáveis de Ambiente
Configuradas em `src/environments/environment.ts`:
- `apiUrl` - URL do backend (padrão: http://localhost:3001)

## Convenções
- Idioma dos comentários e commits: Português (BR)
- Branch naming: `feature/<escopo-da-alteracao>` (kebab-case)
- Componentes standalone (sem NgModules)
- Validação de formulários com Angular Reactive Forms + Validators

## Testes
- Testes E2E em `e2e/` usando Playwright
- Credenciais de teste: `dev@devportal.local` / `DevPortal123!`
- Gravar vídeo e screenshots em todos os testes para evidência

## CI/CD
- GitHub Actions: lint + build em cada PR
- E2E roda após o build com serviços PostgreSQL e Redis
- Artefatos Playwright salvos por 7 dias
