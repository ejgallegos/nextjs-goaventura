# 1. Instalar dependencias solo cuando sea necesario
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# 2. Construir la aplicación
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Ejecutar la aplicación
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Descomentar si tienes un puerto específico
# ENV PORT=3000

# Crear grupo y usuario con menos privilegios
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia automática de los archivos necesarios por Next.js standalone output
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Usuario con menos privilegios para seguridad
USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]