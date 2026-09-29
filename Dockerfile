# Dockerfile Production Optimizado para Go Aventura
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

# Public Firebase configuration is supplied at build time by Compose. These
# values are public client configuration, not server credentials.
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY
ARG NEXT_PUBLIC_SITE_URL

ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID} \
    NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID} \
    NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY} \
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN} \
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET} \
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=${NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID} \
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID} \
    NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY} \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Use Firebase Admin's existing build-only mock path; no credentials are baked
# into the image.
ENV MOCK_FIREBASE=true

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

# Prevenir archivos core y heap dumps
RUN echo "ulimit -c 0" > /etc/profile.d/disable-coredumps.sh && \
    echo "ulimit -d $(ulimit -H -d)" >> /etc/profile.d/disable-coredumps.sh

# Copiar archivos necesarios del build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Limpiar archivos innecesarios del build
RUN rm -rf /app/.next/cache /app/.next/babel-loader 2>/dev/null || true && \
    mkdir -p /app/.next/cache/images && \
    chown -R nextjs:nodejs /app/.next/cache

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_OPTIONS="--max-old-space-size=512"
ENV TMPDIR="/var/tmp"

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Iniciar con dumb-init para manejar señales correctamente
CMD ["dumb-init", "node", "server.js"]
