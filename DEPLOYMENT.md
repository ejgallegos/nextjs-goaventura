# Despliegue de GoAventura

Guía de despliegue para la aplicación Next.js usando Docker Compose.

## Requisitos

- Docker Engine y Docker Compose v2.
- Una red externa de Docker llamada `traefik-net` si se mantienen las etiquetas de Traefik.
- Un archivo `.env.production` privado para la configuración del sitio y del correo.

## Configuración

Copiá `.env.example` como `.env.production` y completá únicamente los valores necesarios para el sitio, el correo y reCAPTCHA. No subas archivos `.env*` con credenciales al repositorio.

```bash
chmod 600 .env.production
```

## Build y ejecución

```bash
docker compose --env-file .env.production -f docker-compose.production.yml up -d --build
```

El servicio escucha en `127.0.0.1:3003` y se ejecuta como usuario no root con filesystem de solo lectura. El volumen de datos y los montajes temporales son los únicos destinos escribibles.

Verificá la caché de imágenes después de iniciar el contenedor:

```bash
docker compose -f docker-compose.production.yml exec goaventura \
  sh -c 'touch /app/.next/cache/images/.write-check && rm /app/.next/cache/images/.write-check'
```

## Comprobaciones

```bash
npm run typecheck
npm run lint
npm run build
docker compose --env-file .env.production -f docker-compose.production.yml config --quiet
```

También comprobá manualmente la portada, alojamientos, viajes, formulario de contacto, enlaces de WhatsApp y la navegación móvil.

## Operación

```bash
docker compose -f docker-compose.production.yml logs -f goaventura
docker compose -f docker-compose.production.yml ps
docker compose -f docker-compose.production.yml restart goaventura
```
