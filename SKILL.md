# Skills - DevPortal Frontend

## Setup do Ambiente de Desenvolvimento

```bash
# 1. Clonar repositório
git clone https://github.com/joliveira-abaqus/devportal-frontend.git
cd devportal-frontend

# 2. Instalar dependências
npm install

# 3. Iniciar servidor de desenvolvimento
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
```

## Docker

```bash
docker build -t devportal-frontend .
docker run -p 80:80 devportal-frontend
```

## Pré-requisitos
- Node.js 20+
- Backend `devportal-api` rodando na porta 3001
- Infraestrutura `devportal-infra` (PostgreSQL, Redis, LocalStack) ativa
