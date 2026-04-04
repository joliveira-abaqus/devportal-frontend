# AGENTS.md - DevPortal Frontend

## Visão Geral
Aplicação frontend do DevPortal construída com Next.js 14 (App Router), TypeScript e Tailwind CSS.
Comunica-se com o `devportal-api` (porta 3001) via cookies httpOnly para autenticação JWT.

## Stack Técnico
- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + @tailwindcss/forms
- **Autenticação:** NextAuth.js (CredentialsProvider)
- **HTTP Client:** Axios (withCredentials)
- **Formulários:** react-hook-form + zod
- **Ícones:** lucide-react
- **Testes E2E:** Playwright

## Estrutura do Projeto
```
src/
├── app/           # Páginas e rotas (App Router)
├── components/    # Componentes React (ui/ para base)
├── lib/           # Utilidades e configurações
├── hooks/         # Custom hooks
├── types/         # TypeScript types
└── middleware.ts   # Proteção de rotas
```

## Comandos Essenciais
```bash
npm run dev        # Servidor de desenvolvimento (porta 3000)
npm run build      # Build de produção
npm run lint       # Verificação de lint
npm run test:e2e   # Testes E2E com Playwright
```

## Variáveis de Ambiente
Copie `.env.local.example` para `.env.local` e configure:
- `NEXT_PUBLIC_API_URL` - URL do backend (padrão: http://localhost:3001)
- `NEXTAUTH_SECRET` - Secret do NextAuth
- `NEXTAUTH_URL` - URL da aplicação (padrão: http://localhost:3000)
- `BACKEND_URL` - URL do backend para chamadas server-side

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
