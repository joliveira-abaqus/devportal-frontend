# devportal-frontend

Frontend do DevPortal construído com Angular 19 (standalone components), TypeScript e Tailwind CSS.

## Pré-requisitos

- Node.js 20+
- Backend `devportal-api` rodando na porta 3001
- Infraestrutura `devportal-infra` (PostgreSQL, Redis, LocalStack) ativa

## Setup

```bash
npm install
npm run dev
```

A aplicação estará disponível em http://localhost:3000.

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (porta 3000) |
| `npm run build` | Build de produção |
| `npm run lint` | Verificação de lint (ESLint + Angular) |
| `npm run test` | Testes unitários (Karma/Jasmine) |
| `npm run test:e2e` | Testes E2E com Playwright |
| `npm run format` | Verificação de formatação (Prettier) |
| `npm run format:fix` | Correção automática de formatação |

## Estrutura do Projeto

```
src/
├── app/
│   ├── components/     # Componentes reutilizáveis
│   │   ├── ui/         # Componentes base (Button, Input, Card, etc.)
│   │   └── shared/     # Componentes de feature (Header, Sidebar, etc.)
│   ├── guards/         # Route guards (autenticação)
│   ├── interceptors/   # HTTP interceptors
│   ├── layouts/        # Layouts de página (DashboardLayout)
│   ├── models/         # TypeScript interfaces e tipos
│   ├── pages/          # Componentes de página
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   └── requests/
│   ├── services/       # Serviços Angular (API, Auth, Theme, Requests)
│   └── utils/          # Funções utilitárias
├── environments/       # Configurações de ambiente
└── styles.css          # Estilos globais (Tailwind)
```

## Variáveis de Ambiente

A URL da API é configurada em `src/environments/environment.ts` (dev) e `src/environments/environment.production.ts` (produção).

## Docker

```bash
docker build -t devportal-frontend .
docker run -p 80:80 devportal-frontend
```

A imagem utiliza nginx para servir os assets estáticos da build Angular.
