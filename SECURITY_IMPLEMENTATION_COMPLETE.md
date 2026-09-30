# Estado de seguridad

La aplicación utiliza las utilidades de `src/lib/security.ts` y `src/lib/security-production.ts` para validación de entradas, sanitización, cabeceras y respuestas seguras. Las operaciones administrativas basadas en un proveedor externo fueron deshabilitadas; el panel debe integrarse con un mecanismo de autenticación independiente antes de volver a habilitarse.
