# AGENTS.md - DevPortal Frontend

## Visão Geral
Aplicação frontend do DevPortal construída com Angular 17 (standalone components), TypeScript e Tailwind CSS.
Comunica-se com o `devportal-api` (porta 3001) via cookies httpOnly para autenticação JWT.

## Stack Técnico
- **Framework:** Angular 17 (standalone components)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + @tailwindcss/forms
- **Autenticação:** AuthService com cookies httpOnly (JWT)
- **HTTP Client:** Angular HttpClient (withCredentials)
- **Formulários:** Angular Reactive Forms
- **Ícones:** lucide-angular
- **Testes E2E:** Playwright

## Estrutura do Projeto
```
src/
├── app/
│   ├── core/           # Modelos, services, guards, interceptors
│   ├── shared/         # Componentes reutilizáveis (ui/ e domain/)
│   ├── layouts/        # Layout do dashboard (Sidebar + Header)
│   └── pages/          # Componentes de página roteados
├── environments/       # Configurações de ambiente
└── styles.css          # Estilos globais (Tailwind)
```

## Comandos Essenciais
```bash
npm run dev        # Servidor de desenvolvimento (porta 3000)
npm run build      # Build de produção
npm run lint       # Verificação de lint (ng lint)
npm run test:e2e   # Testes E2E com Playwright
```

## Variáveis de Ambiente
Configuradas em `src/environments/`:
- `environment.ts` - Desenvolvimento (`apiUrl: http://localhost:3001`)
- `environment.prod.ts` - Produção

## Convenções
- Idioma dos comentários e commits: Português (BR)
- Branch naming: `feature/<escopo-da-alteracao>` (kebab-case)
- Componentes standalone com PascalCase
- Validação de formulários com Angular Reactive Forms (Validators)

## Testes
- Testes E2E em `e2e/` usando Playwright
- Credenciais de teste: `dev@devportal.local` / `DevPortal123!`
- Gravar vídeo e screenshots em todos os testes para evidência

## CI/CD
- GitHub Actions: lint + build em cada PR
- E2E roda após o build com serviços PostgreSQL e Redis
- Artefatos Playwright salvos por 7 dias
