# Auditoría de seguridad

La aplicación usa validación Zod, sanitización de entradas, cabeceras de seguridad y ejecución Docker sin privilegios.

## Verificaciones

- `npm run typecheck`
- `npm run lint`
- `npm audit --audit-level=moderate`
- `npm run security-test http://localhost:9002`

Las credenciales de correo y servicios externos se inyectan mediante variables de entorno y no forman parte de la imagen Docker.
