# AGENTS.md - DevPortal Frontend

## Visão Geral
Aplicação frontend do DevPortal construída com Angular 18 (standalone components), TypeScript e Tailwind CSS.
Comunica-se com o `devportal-api` (porta 3001) via JWT para autenticação.

## Stack Técnico
- **Framework:** Angular 18 (standalone components)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + @tailwindcss/forms
- **Autenticação:** JWT via AuthService (localStorage + HttpInterceptor)
- **HTTP Client:** HttpClient nativo do Angular
- **Formulários:** Reactive Forms (Angular Forms)
- **Ícones:** lucide-angular
- **Testes E2E:** Playwright

## Estrutura do Projeto
```
src/
├── app/
│   ├── core/           # Services globais, interceptors, guards
│   │   ├── services/   # AuthService, ThemeService
│   │   ├── interceptors/# ApiInterceptor
│   │   └── guards/     # AuthGuard
│   ├── shared/         # Models, utils, UI components
│   │   ├── models/     # Interfaces TypeScript
│   │   ├── utils/      # Funções utilitárias
│   │   └── components/ # Componentes reutilizáveis (Button, Input, etc.)
│   ├── layout/         # Header, Sidebar, ThemeToggle
│   └── features/       # Módulos de funcionalidade
│       ├── auth/       # Login, Register
│       ├── dashboard/  # Dashboard page e layout
│       └── requests/   # CRUD de solicitações
├── environments/       # Configurações por ambiente
└── styles.css          # Estilos globais (Tailwind)
```

## Comandos Essenciais
```bash
npm run dev        # Servidor de desenvolvimento (porta 4200)
npm run build      # Build de produção
npm run lint       # Verificação de lint (ng lint)
npm run test:e2e   # Testes E2E com Playwright
```

## Variáveis de Ambiente
Configuradas em `src/environments/environment.ts`:
- `apiUrl` - URL do backend (padrão: http://localhost:3001)

## Convenções
- Idioma dos comentários e commits: Português (BR)
- Branch naming: `feature/<escopo-da-alteracao>` (kebab-case)
- Componentes standalone Angular 18+
- Validação de formulários com Reactive Forms + Validators

## Testes
- Testes E2E em `e2e/` usando Playwright
- Credenciais de teste: `dev@devportal.local` / `DevPortal123!`
- Gravar vídeo e screenshots em todos os testes para evidência

## CI/CD
- GitHub Actions: lint + test + build em cada PR
- E2E roda após o build com serviços PostgreSQL e Redis
- Artefatos Playwright salvos por 7 dias
