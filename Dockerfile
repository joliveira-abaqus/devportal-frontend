FROM node:20-alpine AS base

# Instalar dependencias apenas quando necessario
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Build do codigo fonte
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Imagem de producao com SSR
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 angular

COPY --from=builder --chown=angular:nodejs /app/dist/devportal-frontend ./dist/devportal-frontend

USER angular

EXPOSE 3000

ENV PORT=3000

CMD ["node", "dist/devportal-frontend/server/server.mjs"]
