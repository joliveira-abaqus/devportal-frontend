# devportal-frontend

DevPortal Frontend - Aplicação Angular 17 (standalone components)

## Stack Técnico

- **Framework:** Angular 17 (standalone components)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + @tailwindcss/forms
- **HTTP Client:** Angular HttpClient (withCredentials)
- **Formulários:** Angular Reactive Forms
- **Ícones:** lucide-angular
- **Testes E2E:** Playwright

## Comandos

```bash
npm run dev        # Servidor de desenvolvimento (porta 3000)
npm run build      # Build de produção
npm run lint       # Verificação de lint
npm run test:e2e   # Testes E2E com Playwright
```

## Variáveis de Ambiente

A URL da API é configurada em `src/environments/environment.ts` (development) e `src/environments/environment.prod.ts` (production).

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/           # Modelos, services, guards, interceptors
│   │   ├── models/     # Interfaces TypeScript
│   │   ├── services/   # AuthService, RequestsService, ThemeService
│   │   ├── guards/     # AuthGuard
│   │   └── interceptors/ # AuthInterceptor (redirect 401)
│   ├── shared/         # Componentes reutilizáveis
│   │   └── components/
│   │       ├── ui/     # Button, Input, Select, Card, Badge, Modal
│   │       └── domain/ # Header, Sidebar, RequestCard, RequestForm, etc.
│   ├── layouts/        # DashboardLayout (Sidebar + Header + router-outlet)
│   └── pages/          # Componentes de página (login, register, dashboard, requests)
├── environments/       # Configurações de ambiente (apiUrl)
└── styles.css          # Estilos globais (Tailwind)
```
