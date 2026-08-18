# AGENTS.md - DevPortal Frontend

## Visão Geral
Aplicação frontend do DevPortal construída com Vite, React Router, TypeScript e Tailwind CSS.
Comunica-se com o `devportal-api` (porta 3001) via cookies httpOnly para autenticação JWT.

## Stack Técnico
- **Framework:** Vite + React Router
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + @tailwindcss/forms
- **Autenticação:** Contexto React com cookie httpOnly do `devportal-api`
- **HTTP Client:** Axios (withCredentials)
- **Formulários:** react-hook-form + zod
- **Ícones:** lucide-react
- **Testes E2E:** Playwright

## Estrutura do Projeto
```
src/
├── pages/         # Páginas e layouts das rotas
├── contexts/      # Contextos de autenticação e tema
├── routes.tsx     # Configuração do React Router
├── components/    # Componentes React (ui/ para base)
├── lib/           # Utilidades e configurações
├── hooks/         # Custom hooks
├── types/         # TypeScript types
└── components/ProtectedRoute.tsx # Proteção de rotas
```

## Comandos Essenciais
```bash
npm run dev        # Servidor de desenvolvimento (porta 5173)
npm run build      # Build de produção
npm run lint       # Verificação de lint
npm run test:e2e   # Testes E2E com Playwright
```

## Variáveis de Ambiente
Copie `.env.local.example` para `.env.local` e configure:
- `VITE_API_URL` - URL do backend (padrão: http://localhost:3001)

## Convenções
- Idioma dos comentários e commits: Português (BR)
- Branch naming: `feature/<escopo-da-alteracao>` (kebab-case)
- Componentes em PascalCase, hooks com prefixo `use`
- Validação de formulários sempre com Zod

## Testes
- Testes E2E em `e2e/` usando Playwright
- Credenciais de teste: `dev@devportal.local` / `DevPortal123!`
- Gravar vídeo e screenshots em todos os testes para evidência

## CI/CD
- GitHub Actions: lint + test + build em cada PR
- E2E roda após o build com serviços PostgreSQL e Redis
- Artefatos Playwright salvos por 7 dias
