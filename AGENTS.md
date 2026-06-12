# AGENTS.md - DevPortal Frontend

## Visão Geral
Aplicação frontend do DevPortal construída com Angular 18 (standalone components), TypeScript e Tailwind CSS.
Comunica-se com o `devportal-api` (porta 3001) via cookies httpOnly e Bearer token para autenticação JWT.

## Stack Técnico
- **Framework:** Angular 18 (standalone components)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + @tailwindcss/forms
- **Autenticação:** JWT via localStorage + HttpInterceptor
- **HTTP Client:** Angular HttpClient
- **Formulários:** Angular Reactive Forms
- **Testes:** Jasmine/Karma (unitários)

## Estrutura do Projeto
```
src/
├── app/
│   ├── core/           # Guards, interceptors, services, models
│   ├── shared/         # Componentes reutilizáveis (ui)
│   └── features/       # Módulos de funcionalidade
│       ├── auth/       # Login e registro
│       ├── dashboard/  # Dashboard principal
│       └── requests/   # CRUD de solicitações
├── environments/       # Configurações de ambiente
└── styles.css          # Estilos globais (Tailwind)
```

## Comandos Essenciais
```bash
npm start              # Servidor de desenvolvimento (porta 4200)
npm run build          # Build de produção
npm run lint           # Verificação de lint
npm test               # Testes unitários com Karma
```

## Variáveis de Ambiente
Configurar em `src/environments/environment.ts`:
- `apiUrl` - URL do backend (padrão: http://localhost:3001)

## Convenções
- Idioma dos comentários e commits: Português (BR)
- Branch naming: `feature/<escopo-da-alteracao>` (kebab-case)
- Componentes standalone com PascalCase
- Validação de formulários com Angular Reactive Forms

## Testes
- Testes unitários com Jasmine/Karma
- Credenciais de teste: `dev@devportal.local` / `DevPortal123!`

## CI/CD
- GitHub Actions: lint + test + build em cada PR
- Deploy via Docker (nginx) para produção
