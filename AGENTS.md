# AGENTS.md - DevPortal Frontend

## Visão Geral
Aplicação frontend do DevPortal construída com Angular 19, TypeScript e Tailwind CSS.
Comunica-se com o `devportal-api` (porta 3001) via cookies httpOnly para autenticação JWT.

## Stack Técnico
- **Framework:** Angular 19 (Standalone Components, SSR via @angular/ssr)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + @tailwindcss/forms
- **Autenticação:** AuthService customizado com JWT/cookie
- **HTTP Client:** Angular HttpClient com interceptor
- **Formulários:** Angular Reactive Forms
- **Ícones:** lucide-angular
- **Testes E2E:** Playwright
- **Testes unitários:** Karma/Jasmine

## Estrutura do Projeto
```
src/
├── app/
│   ├── components/    # Componentes Angular (ui/ para base)
│   ├── guards/        # Route guards (auth)
│   ├── interceptors/  # HTTP interceptors
│   ├── models/        # TypeScript types/interfaces
│   ├── pages/         # Componentes de página (lazy loaded)
│   └── services/      # Serviços (auth, requests, theme, utils)
├── environments/      # Configuração de ambiente (apiUrl)
├── index.html         # HTML principal
├── main.ts            # Bootstrap do app (browser)
├── main.server.ts     # Bootstrap do app (SSR)
├── server.ts          # Express server para SSR
└── styles.css         # Estilos globais (Tailwind)
```

## Comandos Essenciais
```bash
npm run dev        # Servidor de desenvolvimento (porta 3000)
npm run build      # Build de produção
npm run lint       # Verificação de lint (angular-eslint)
npm run test       # Testes unitários (Karma/Jasmine)
npm run test:e2e   # Testes E2E com Playwright
npm run serve:ssr  # Servir build SSR de produção
```

## Variáveis de Ambiente
- A URL da API é configurada em `src/environments/environment.ts` (padrão: http://localhost:3001)
- Para produção, edite `src/environments/environment.prod.ts`

## Convenções
- Idioma dos comentários e commits: Português (BR)
- Branch naming: `feature/<escopo-da-alteracao>` (kebab-case)
- Componentes standalone com PascalCase
- Validação de formulários com Angular Reactive Forms + Validators

## Testes
- Testes E2E em `e2e/` usando Playwright
- Credenciais de teste: `dev@devportal.local` / `DevPortal123!`
- Gravar vídeo e screenshots em todos os testes para evidência

## CI/CD
- GitHub Actions: lint + test + build em cada PR
- E2E roda após o build com serviços PostgreSQL e Redis
- Artefatos Playwright salvos por 7 dias
