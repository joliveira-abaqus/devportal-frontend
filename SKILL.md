# Skills - DevPortal Frontend

## Setup do Ambiente de Desenvolvimento

```bash
# 1. Clonar repositório
git clone https://github.com/joliveira-abaqus/devportal-frontend.git
cd devportal-frontend

# 2. Instalar dependências
npm install

# 3. Configurar variáveis de ambiente
cp .env.local.example .env.local

# 4. Iniciar servidor de desenvolvimento (Vite na porta 5173)
npm run dev
```

## Executar Testes E2E

```bash
# Instalar browsers do Playwright
npx playwright install --with-deps

# Executar testes
npm run test:e2e

# Executar testes com UI
npm run test:e2e:ui
```

## Build de Produção

```bash
npm run build
npm run start          # Preview Vite na porta 4173 por padrão
```

## Docker

```bash
docker build -t devportal-frontend .
docker run -p 5173:5173 devportal-frontend
```

## Pré-requisitos
- Node.js 20+
- Backend `devportal-api` rodando na porta 3001
- Infraestrutura `devportal-infra` (PostgreSQL, Redis, LocalStack) ativa
