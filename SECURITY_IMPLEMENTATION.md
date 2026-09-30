# Implementación de seguridad

La aplicación mantiene una base de seguridad independiente de proveedores de identidad externos.

- Validación y sanitización de formularios con Zod y DOMPurify.
- Cabeceras HTTP restrictivas mediante middleware.
- Protección de archivos y límites de tamaño para uploads.
- Contenedor Docker no-root con filesystem de solo lectura.
- Variables sensibles fuera del repositorio y del build context.

Ejecutá `npm run typecheck`, `npm run lint` y `npm run build` antes de cada despliegue.
