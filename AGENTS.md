# AGENTS.md - DevPortal Frontend

## Visão Geral
Aplicação frontend do DevPortal construída com Angular 19 (standalone components), TypeScript e Tailwind CSS.
Comunica-se com o `devportal-api` (porta 3001) via cookies httpOnly para autenticação JWT.

## Stack Técnico
- **Framework:** Angular 19 (standalone components)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + @tailwindcss/forms
- **Autenticação:** AuthService customizado (cookies httpOnly do backend)
- **HTTP Client:** Angular HttpClient com interceptor
- **Formulários:** Angular Reactive Forms
- **Ícones:** lucide-angular
- **Testes E2E:** Playwright

## Estrutura do Projeto
```
src/
├── app/
│   ├── components/      # Componentes reutilizáveis (ui/ para base)
│   ├── core/            # Services, guards e interceptors
│   ├── layouts/         # Componentes de layout (dashboard)
│   ├── lib/             # Utilitários (utils.ts)
│   ├── pages/           # Componentes de página (login, register, dashboard, etc.)
│   ├── types/           # TypeScript types
│   ├── app.component.ts # Componente raiz
│   ├── app.config.ts    # Configuração da aplicação
│   └── app.routes.ts    # Definição de rotas
├── environments/        # Variáveis de ambiente (apiUrl)
├── index.html           # HTML principal
├── main.ts              # Bootstrap da aplicação
└── styles.css           # Estilos globais (Tailwind)
```

## Comandos Essenciais
```bash
npm run dev        # Servidor de desenvolvimento (porta 3000)
npm run build      # Build de produção
npm run lint       # Verificação de lint (ESLint + angular-eslint)
npm run test:e2e   # Testes E2E com Playwright
```

## Variáveis de Ambiente
Configurar em `src/environments/environment.ts`:
- `apiUrl` - URL do backend (padrão: http://localhost:3001)

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
