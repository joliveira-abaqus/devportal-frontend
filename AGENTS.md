# AGENTS.md - DevPortal Frontend

## Visão Geral
Aplicação frontend do DevPortal construída com Angular 21 (Standalone Components), TypeScript e Tailwind CSS.
Comunica-se com o `devportal-api` (porta 3001) via JWT Bearer token para autenticação.

## Stack Técnico
- **Framework:** Angular 21 (Standalone Components, Lazy Loading)
- **Linguagem:** TypeScript (strict mode)
- **Estilização:** Tailwind CSS 3.4 + @tailwindcss/forms
- **Autenticação:** JWT via AuthService + AuthGuard + AuthInterceptor
- **HTTP Client:** HttpClient nativo do Angular
- **Formulários:** Reactive Forms (FormGroup, FormControl, Validators)
- **Testes E2E:** Playwright

## Estrutura do Projeto
```
src/
├── app/
│   ├── core/          # Services, guards e interceptors
│   ├── shared/        # Models e componentes UI reutilizáveis
│   ├── features/      # Módulos de funcionalidade (auth, dashboard, requests)
│   └── layout/        # Header e Sidebar
├── environments/      # Configurações de ambiente
└── styles.css         # Estilos globais (Tailwind)
```

## Comandos Essenciais
```bash
npm run dev        # Servidor de desenvolvimento (porta 4200) com proxy para API
npm start          # Servidor de desenvolvimento padrão
npm run build      # Build de produção
npm run lint       # Verificação de lint (@angular-eslint)
npm run format     # Verificação de formatação (Prettier)
npm run test:e2e   # Testes E2E com Playwright
```

## Variáveis de Ambiente
Configuração em `src/environments/`:
- `environment.ts` - Desenvolvimento (`apiUrl: 'http://localhost:3001'`)
- `environment.prod.ts` - Produção (`apiUrl: '/api'`)

## Convenções
- Idioma dos comentários e commits: Português (BR)
- Branch naming: `feature/<escopo-da-alteracao>` (kebab-case)
- Componentes standalone com PascalCase
- Validação de formulários com Reactive Forms + Validators

## Testes
- Testes E2E em `e2e/` usando Playwright
- Credenciais de teste: `dev@devportal.local` / `DevPortal123!`
- Gravar vídeo e screenshots em todos os testes para evidência

## CI/CD
- GitHub Actions: lint + test + build em cada PR
- E2E roda após o build com serviços PostgreSQL e Redis
- Artefatos Playwright salvos por 7 dias
