# Despliegue de GoAventura

Guía para desplegar la aplicación Next.js y su PostgreSQL interno con Docker Compose. PostgreSQL no publica ningún puerto al host: solo la aplicación y el servicio temporal de migraciones pueden alcanzarlo por `availability-internal`.

Para la operación diaria de disponibilidad, backups/restores y registro seguro
de fuentes ICS, consultá el [runbook operativo](docs/availability-operations.md).

## Requisitos y configuración

- Docker Engine y Docker Compose v2.
- Una red externa de Docker llamada `traefik-net` si se mantienen las etiquetas de Traefik.
- Un archivo `.env.production` privado, basado en `.env.example`.

La aplicación escucha únicamente en `127.0.0.1:3003` y Traefik es el único
ingress público. El middleware de Traefik debe mantener
`forwardedHeaders.insecure` deshabilitado; si existe un proxy upstream
confiable, configurá explícitamente sus `trustedIPs` y no aceptes cabeceras
reenviadas arbitrarias desde Internet. La aplicación usa solamente el
`X-Real-IP` que Traefik agrega después de esa configuración para el límite de
intentos de login; una cabecera ausente o inválida cae en un bucket estable.

```bash
cp .env.example .env.production
chmod 600 .env.production
```

Definí `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` y `DATABASE_URL`. En `DATABASE_URL`, el host debe ser `postgres` (el nombre del servicio Compose), nunca `localhost`. Usá un password aleatorio y único; no lo subas al repositorio ni lo imprimas en logs.

## Build, migración y arranque

La imagen final de la aplicación es standalone y no incluye npm ni Drizzle Kit. El target `db-migrate` del Dockerfile reutiliza la capa de dependencias ya instalada durante el build y copia la configuración Drizzle, el schema, las migraciones versionadas y los archivos necesarios para ejecutar el seed. El servicio aplica únicamente las migraciones ya presentes en `drizzle/`; no monta el código ni instala paquetes durante el despliegue.

```bash
# Validar la interpolación sin mostrar valores
docker compose --env-file .env.production -f docker-compose.production.yml config --quiet

# Construir la aplicación y la imagen de migraciones sin iniciarlas todavía
docker compose --env-file .env.production -f docker-compose.production.yml build goaventura db-migrate

# Arrancar únicamente PostgreSQL y esperar su healthcheck
docker compose --env-file .env.production -f docker-compose.production.yml up -d postgres

# Aplicar migraciones versionadas (perfil de herramientas)
docker compose --env-file .env.production -f docker-compose.production.yml --profile tools run --rm db-migrate

# Crear o actualizar las cinco fuentes sin configurar URLs ICS reales
docker compose --env-file .env.production -f docker-compose.production.yml --profile tools run --rm db-seed

# Iniciar la aplicación solamente después de una migración exitosa
docker compose --env-file .env.production -f docker-compose.production.yml up -d goaventura
```

Para un despliegue desde cero, ejecutá la migración antes de enviar tráfico. `goaventura` depende de `postgres` saludable y se reinicia automáticamente, pero el orden migración → aplicación lo controla explícitamente este procedimiento.

Las nuevas tablas se generan durante el desarrollo con `npm run db:generate` y
los archivos resultantes de `drizzle/` se revisan y versionan junto con el
cambio. El despliegue no modifica el árbol de migraciones. El seed es idempotente,
mantiene las URLs ICS sin configurar y no reemplaza una URL administrada.

## Comprobaciones

```bash
npm run typecheck
npm run lint
npm run build
docker compose --env-file .env.production -f docker-compose.production.yml ps
docker compose --env-file .env.production -f docker-compose.production.yml logs --tail=100 postgres
```

Verificá manualmente la portada, alojamientos, viajes, formulario de contacto, enlaces de WhatsApp y navegación móvil. La caché de imágenes continúa siendo el único destino escribible de la imagen de aplicación:

```bash
docker compose --env-file .env.production -f docker-compose.production.yml exec goaventura sh -c 'touch /app/.next/cache/images/.write-check && rm /app/.next/cache/images/.write-check'
```

## Operación y persistencia

```bash
docker compose --env-file .env.production -f docker-compose.production.yml ps
docker compose --env-file .env.production -f docker-compose.production.yml logs -f goaventura
docker compose --env-file .env.production -f docker-compose.production.yml restart goaventura
docker compose --env-file .env.production -f docker-compose.production.yml restart postgres
```

Los datos viven en el volumen nombrado `goaventura-postgres-data`. No borres ese volumen durante un reinicio normal.

## Backup y restore

Usá primero el preflight no destructivo del [runbook operativo](docs/availability-operations.md): valida el archivo custom-format con `pg_restore --list`, exige una confirmación explícita para restaurar y conserva el volumen nombrado durante la recuperación normal.

No ejecutes `.env.production` como shell: Compose debe leerlo mediante
`--env-file`, porque su sintaxis dotenv no es necesariamente sintaxis shell.

Ejecutá el backup desde el contenedor para no exponer el puerto de PostgreSQL:

```bash
mkdir -p backups
BACKUP_FILE="backups/goaventura-$(date +%Y%m%d-%H%M%S).dump"
docker compose --env-file .env.production -f docker-compose.production.yml exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --file=-' > "$BACKUP_FILE"
test -s "$BACKUP_FILE"
docker compose --env-file .env.production -f docker-compose.production.yml exec -T postgres pg_restore --list < "$BACKUP_FILE" >/dev/null
```

Para restaurar, detené la aplicación, recreá el esquema destino y usá el dump desde stdin. Confirmá el archivo y el entorno antes de ejecutar una operación destructiva:

```bash
set -eu
BACKUP_FILE="backups/REEMPLAZAR.dump"
test -s "$BACKUP_FILE"
docker compose --env-file .env.production -f docker-compose.production.yml exec -T postgres pg_restore --list < "$BACKUP_FILE" >/dev/null
: "${CONFIRM_RESTORE:?Set CONFIRM_RESTORE=YES after inspecting the archive}"
test "$CONFIRM_RESTORE" = YES
docker compose --env-file .env.production -f docker-compose.production.yml stop goaventura
docker compose --env-file .env.production -f docker-compose.production.yml exec -T postgres sh -c 'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --exit-on-error' < "$BACKUP_FILE"
docker compose --env-file .env.production -f docker-compose.production.yml start goaventura
```

`set -eu` stops the sequence on a failed archive check or restore; the
application is never restarted after a failed `pg_restore`.

Conservá varias copias fuera del host y verificá periódicamente que una copia pueda restaurarse en un entorno aislado.
