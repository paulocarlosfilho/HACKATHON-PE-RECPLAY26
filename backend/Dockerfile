# ==========================================
# ESTÁGIO 1: Builder (Instalação limpa)
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas os manifestos primeiro para otimizar cache
COPY package*.json ./

# Instala apenas dependências de produção de forma determinística
RUN npm ci --omit=dev && npm cache clean --force

# ==========================================
# ESTÁGIO 2: Runtime (Imagem final endurecida)
# ==========================================
FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Copia os módulos instalados no estágio anterior e toda a estrutura src (db, routes, services)
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package*.json server.js ./
COPY --chown=node:node src ./src

# Executa com usuário não-privilegiado (Exigência Checkov CKV_DOCKER_3)
USER node

EXPOSE 3001

# Validação de saúde do container (Exigência Checkov CKV_DOCKER_2)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", "server.js"]