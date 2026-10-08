# Despliegue de GoAventura

Guía para desplegar la aplicación Next.js y su PostgreSQL interno con Docker Compose. PostgreSQL no publica ningún puerto al host: solo la aplicación y el servicio temporal de migraciones pueden alcanzarlo por `availability-internal`.

## Requisitos y configuración

- Docker Engine y Docker Compose v2.
- Una red externa de Docker llamada `traefik-net` si se mantienen las etiquetas de Traefik.
- Un archivo `.env.production` privado, basado en `.env.example`.

```bash
cp .env.example .env.production
chmod 600 .env.production
```

Definí `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` y `DATABASE_URL`. En `DATABASE_URL`, el host debe ser `postgres` (el nombre del servicio Compose), nunca `localhost`. Usá un password aleatorio y único; no lo subas al repositorio ni lo imprimas en logs.

## Build, migración y arranque

La imagen final de la aplicación es standalone y no incluye npm ni Drizzle Kit. El target `db-migrate` del Dockerfile reutiliza la capa de dependencias ya instalada durante el build y copia únicamente la configuración Drizzle, el schema y las migraciones versionadas. El servicio aplica únicamente las migraciones ya presentes en `drizzle/`; no monta el código ni instala paquetes durante el despliegue.

```bash
# Validar la interpolación sin mostrar valores
docker compose --env-file .env.production -f docker-compose.production.yml config --quiet

# Construir la aplicación y la imagen de migraciones sin iniciarlas todavía
docker compose --env-file .env.production -f docker-compose.production.yml build goaventura db-migrate

# Arrancar únicamente PostgreSQL y esperar su healthcheck
docker compose --env-file .env.production -f docker-compose.production.yml up -d postgres

# Aplicar migraciones versionadas (perfil de herramientas)
docker compose --env-file .env.production -f docker-compose.production.yml --profile tools run --rm db-migrate

# Iniciar la aplicación solamente después de una migración exitosa
docker compose --env-file .env.production -f docker-compose.production.yml up -d goaventura
```

Para un despliegue desde cero, ejecutá la migración antes de enviar tráfico. `goaventura` depende de `postgres` saludable y se reinicia automáticamente, pero el orden migración → aplicación lo controla explícitamente este procedimiento.

Las nuevas tablas se generan durante el desarrollo con `npm run db:generate` y
los archivos resultantes de `drizzle/` se revisan y versionan junto con el
cambio. El despliegue no modifica el árbol de migraciones.

## Comprobaciones

```bash
npm run typecheck
npm run lint
npm run build
docker compose --env-file .env.production -f docker-compose.production.yml ps
docker compose -f docker-compose.production.yml logs --tail=100 postgres
```

Verificá manualmente la portada, alojamientos, viajes, formulario de contacto, enlaces de WhatsApp y navegación móvil. La caché de imágenes continúa siendo el único destino escribible de la imagen de aplicación:

```bash
docker compose -f docker-compose.production.yml exec goaventura sh -c 'touch /app/.next/cache/images/.write-check && rm /app/.next/cache/images/.write-check'
```

## Operación y persistencia

```bash
docker compose -f docker-compose.production.yml ps
docker compose -f docker-compose.production.yml logs -f goaventura
docker compose -f docker-compose.production.yml restart goaventura
docker compose -f docker-compose.production.yml restart postgres
```

Los datos viven en el volumen nombrado `goaventura-postgres-data`. No borres ese volumen durante un reinicio normal.

## Backup y restore

Ejecutá el backup desde el contenedor para no exponer el puerto de PostgreSQL:

```bash
mkdir -p backups
set -a; . .env.production; set +a
docker compose -f docker-compose.production.yml exec -T postgres pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom > "backups/goaventura-$(date +%Y%m%d-%H%M%S).dump"
```

Para restaurar, detené la aplicación, recreá el esquema destino y usá el dump desde stdin. Confirmá el archivo y el entorno antes de ejecutar una operación destructiva:

```bash
set -a; . .env.production; set +a
docker compose -f docker-compose.production.yml stop goaventura
docker compose -f docker-compose.production.yml exec -T postgres pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists < backups/REEMPLAZAR.dump
docker compose -f docker-compose.production.yml start goaventura
```

Conservá varias copias fuera del host y verificá periódicamente que una copia pueda restaurarse en un entorno aislado.
