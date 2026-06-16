# AGENTS.md - DevPortal Frontend

## Visão Geral
Aplicação frontend do DevPortal construída com Angular 18 (Standalone Components), TypeScript e Tailwind CSS.
Comunica-se com o `devportal-api` (porta 3001) via cookies httpOnly para autenticação JWT.

## Stack Técnico
- **Framework:** Angular 18 (Standalone Components)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS 3
- **HTTP:** HttpClient com interceptors
- **Formulários:** Reactive Forms
- **Ícones:** lucide-angular
- **Testes E2E:** Playwright

## Estrutura do Projeto
```
src/
├── app/
│   ├── core/              # Models, services, guards, interceptors
│   │   ├── guards/        # Auth guard funcional
│   │   ├── interceptors/  # HTTP interceptors (auth, withCredentials)
│   │   ├── models/        # Interfaces TypeScript
│   │   └── services/      # ApiService, AuthService, RequestService, ThemeService
│   ├── features/          # Módulos de funcionalidades
│   │   ├── auth/          # LoginComponent, RegisterComponent
│   │   ├── dashboard/     # DashboardComponent, RequestCardComponent
│   │   └── requests/      # RequestNewComponent, RequestDetailComponent, RequestTimelineComponent
│   ├── layout/            # HeaderComponent, SidebarComponent, DashboardLayoutComponent
│   └── shared/            # Componentes UI reutilizáveis
│       └── components/    # Button, Input, Select, Card, Badge, Modal, StatusBadge, ThemeToggle, FileUpload
├── environments/          # Configuração por ambiente
└── styles.scss            # Estilos globais (Tailwind)
```

## Comandos Essenciais
```bash
npm run dev        # Servidor de desenvolvimento (porta 3000)
npm run build      # Build de produção
npm run lint       # Verificação de lint
npm run test:e2e   # Testes E2E com Playwright
```

## Configuração da API
As configurações são geridas via `src/environments/`:
- `environment.ts` — Desenvolvimento: `apiUrl: 'http://localhost:3001'`
- `environment.prod.ts` — Produção: `apiUrl: '/api'`

## Convenções
- Idioma dos comentários e commits: Português (BR)
- Branch naming: `feature/<escopo-da-alteracao>` (kebab-case)
- Componentes standalone em PascalCase
- Validação de formulários com Angular Reactive Forms + Validators

## Testes
- Testes E2E em `e2e/` usando Playwright
- Credenciais de teste: `dev@devportal.local` / `DevPortal123!`
- Gravar vídeo e screenshots em todos os testes para evidência

## CI/CD
- GitHub Actions: lint + test + build em cada PR
- E2E roda após o build com serviços PostgreSQL e Redis
- Artefatos Playwright salvos por 7 dias
