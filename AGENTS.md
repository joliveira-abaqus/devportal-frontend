# AGENTS.md - DevPortal Frontend

## Visão Geral
Aplicação frontend do DevPortal construída com Angular 19 (standalone components), TypeScript e Tailwind CSS.
Comunica-se com o `devportal-api` (porta 3001) via cookies httpOnly para autenticação JWT.

## Stack Técnico
- **Framework:** Angular 19 (standalone components, Angular Router)
- **Linguagem:** TypeScript (strict mode)
- **Estilização:** Tailwind CSS + @tailwindcss/forms
- **Autenticação:** Cookie-based via HttpClient + AuthService
- **HTTP Client:** Angular HttpClient (withCredentials)
- **Formulários:** Angular Reactive Forms
- **Ícones:** lucide-angular
- **Testes E2E:** Playwright

## Estrutura do Projeto
```
src/
├── app/
│   ├── components/     # Componentes reutilizáveis (ui/ + shared/)
│   ├── guards/         # Route guards (CanActivate)
│   ├── interceptors/   # HTTP interceptors
│   ├── layouts/        # Layouts de página
│   ├── models/         # TypeScript interfaces e tipos
│   ├── pages/          # Componentes de página
│   ├── services/       # Serviços Angular
│   └── utils/          # Funções utilitárias
├── environments/       # Configurações de ambiente (dev/prod)
└── styles.css          # Estilos globais (Tailwind)
```

## Comandos Essenciais
```bash
npm run dev        # Servidor de desenvolvimento (porta 3000)
npm run build      # Build de produção
npm run lint       # Verificação de lint
npm run test       # Testes unitários
npm run test:e2e   # Testes E2E com Playwright
```

## Configuração de Ambiente
A URL da API backend é configurada em `src/environments/environment.ts` (dev) e
`src/environments/environment.production.ts` (produção). Padrão: `http://localhost:3001`.

## Convenções
- Idioma dos comentários e commits: Português (BR)
- Branch naming: `feature/<escopo-da-alteracao>` (kebab-case)
- Componentes standalone com PascalCase
- Serviços com sufixo `Service`
- Guards com sufixo `Guard`

## Testes
- Testes E2E em `e2e/` usando Playwright
- Credenciais de teste: `dev@devportal.local` / `DevPortal123!`
- Gravar vídeo e screenshots em todos os testes para evidência

## CI/CD
- GitHub Actions: lint + test + build em cada PR
- E2E roda após o build com serviços PostgreSQL e Redis
- Artefatos Playwright salvos por 7 dias

## Docker
- Build multi-stage: Node (build) + nginx (serve)
- Container expõe porta 80
- SPA routing via nginx try_files
