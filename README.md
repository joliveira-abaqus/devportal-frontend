# DevPortal Frontend

Portal de solicitações de desenvolvimento construído com **Angular 21**, **TypeScript** e **Tailwind CSS 3.4**.

## Stack Técnico

- **Framework:** Angular 21 (Standalone Components)
- **Linguagem:** TypeScript (strict mode)
- **Estilização:** Tailwind CSS 3.4 + @tailwindcss/forms
- **HTTP Client:** HttpClient nativo do Angular
- **Formulários:** Reactive Forms
- **Testes E2E:** Playwright
- **Build:** Angular CLI

## Pré-requisitos

- Node.js >= 20
- npm >= 10
- Backend `devportal-api` rodando na porta 3001

## Setup

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (porta 4200)
npm run dev

# Ou sem proxy
npm start
```

## Comandos

```bash
npm run dev        # Servidor de dev com proxy para API (porta 4200)
npm start          # Servidor de dev padrão
npm run build      # Build de produção
npm run lint       # Verificação de lint
npm run format     # Verificação de formatação
npm run format:fix # Correção automática de formatação
npm run test:e2e   # Testes E2E com Playwright
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/               # Serviços, guards e interceptors
│   │   ├── guards/         # AuthGuard
│   │   ├── interceptors/   # AuthInterceptor
│   │   └── services/       # ApiService, AuthService, ThemeService, RequestService
│   ├── shared/
│   │   ├── models/         # Interfaces TypeScript
│   │   └── ui/             # Componentes UI reutilizáveis
│   ├── features/
│   │   ├── auth/           # Login e Register
│   │   ├── dashboard/      # Dashboard principal
│   │   └── requests/       # CRUD de solicitações
│   └── layout/             # Header e Sidebar
├── environments/           # Configurações de ambiente
└── styles.css              # Estilos globais (Tailwind)
```

## Variáveis de Ambiente

Configuração em `src/environments/`:

- `environment.ts` - Desenvolvimento (`apiUrl: 'http://localhost:3001'`)
- `environment.prod.ts` - Produção (`apiUrl: '/api'`)

## Docker

```bash
docker build -t devportal-frontend .
docker run -p 80:80 devportal-frontend
```

## Testes E2E

```bash
# Requer o backend e infra rodando
npm run test:e2e
```

Credenciais de teste: `dev@devportal.local` / `DevPortal123!`
