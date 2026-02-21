# Dockerfile Production Optimizado para GoAventura
# Build stage - instalación de todas las dependencias para build
FROM node:20-alpine AS deps

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package.json package-lock.json* ./

# Instalar TODAS las dependencias (incl devDependencies para builduye)
RUN npm ci

# Build stage - compilar la aplicación
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar todas las dependencias instaladas
COPY --from=deps /app/node_modules ./node_modules

# Crear archivo .env con valores válidos para build (modo mock Firebase)
ENV MOCK_FIREBASE=true
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=mock-project
ENV NEXT_PUBLIC_FIREBASE_APP_ID=1:mock:web:mock
ENV NEXT_PUBLIC_FIREBASE_API_KEY=mock-api-key
ENV FIREBASE_PROJECT_ID=mock-project
ENV FIREBASE_CLIENT_EMAIL=mock@mock.iam.gserviceaccount.com
ENV FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----\n"

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# Production stage - ejecutar la aplicación
FROM node:20-alpine AS runner

# Instalar dumb-init para manejo correcto de señales
RUN apk add --no-cache dumb-init

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

# Copiar archivos necesarios del build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Iniciar la aplicación
CMD ["node", "server.js"]
