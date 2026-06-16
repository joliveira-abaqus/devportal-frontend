# AGENTS.md - DevPortal Frontend

## Visão Geral
Aplicação frontend do DevPortal construída com Angular 18, TypeScript e Tailwind CSS.
Comunica-se com o `devportal-api` (porta 3001) via cookies httpOnly para autenticação JWT.

## Stack Técnico
- **Framework:** Angular 18 (standalone components)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v3 + @tailwindcss/forms + SCSS
- **HTTP Client:** Angular HttpClient (withCredentials)
- **Ícones:** lucide-angular
- **Datas:** date-fns (locale ptBR)
- **Testes E2E:** Playwright

## Estrutura do Projeto
```
src/
├── app/
│   ├── core/
│   │   ├── guards/      # Route guards (auth)
│   │   ├── models/      # TypeScript interfaces
│   │   ├── services/    # ApiService, AuthService, RequestsService
│   │   └── utils/       # Funções utilitárias e constantes
│   ├── features/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── new-request/
│   │   └── request-detail/
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/
└── styles.scss
```

## Comandos Essenciais
```bash
npm start          # Servidor de desenvolvimento (porta 4200)
npm run build      # Build de produção
npm test           # Testes unitários (Karma)
```

## Variáveis de Ambiente
- `src/environments/environment.ts` — `apiUrl: 'http://localhost:3001'`

## Convenções
- Idioma dos comentários e commits: Português (BR)
- Branch naming: `feature/<escopo-da-alteracao>` (kebab-case)
- Componentes standalone (Angular 18 padrão)
- Lazy loading via `loadComponent` nas rotas

## Testes
- Testes E2E em `e2e/` usando Playwright
- Credenciais de teste: `dev@devportal.local` / `DevPortal123!`
