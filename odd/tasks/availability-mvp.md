# MVP de disponibilidad de alojamientos

Documento de seguimiento del módulo interno de disponibilidad de Go Aventura. Este archivo es la fuente de verdad del alcance, las decisiones, el progreso y la evidencia de verificación.

## Objetivo

Construir un módulo protegido en `/admin/disponibilidad` que sincronice calendarios ICS de Booking, persista períodos ocupados en PostgreSQL y permita consultar disponibilidad por fechas y huéspedes sin administrar reservas localmente.

## Decisiones confirmadas

| Tema | Decisión |
| --- | --- |
| Rama | `codex/availability-mvp`, creada desde `develop` |
| Persistencia | PostgreSQL como servicio interno de Docker Compose |
| Acceso a datos | Drizzle ORM y migraciones versionadas |
| Administración | Un único usuario con usuario y contraseña |
| Sesión | Cookie firmada, HttpOnly y duración de 8 horas |
| Alcance administrativo | Solo Disponibilidad; el panel heredado continúa deshabilitado |
| Sincronización automática | Al entrar o recargar el módulo, con cooldown de 2 minutos |
| Sincronización manual | Siempre forzada mediante botón |
| Carga inicial | La pantalla espera a que termine la sincronización |
| Error de sincronización | Mostrar último dato válido, advertencia y estado `NO_VERIFICABLE` |
| Fuentes | Un ICS independiente por alojamiento, configurable posteriormente |
| Calendario | Mes actual por defecto y navegación mensual |
| Fechas | No permitir fechas anteriores al día actual |
| Historial | Retención de 30 días |
| Vaciado sospechoso | Conservar datos anteriores y requerir aprobación manual |
| Zona horaria | `America/Argentina/La_Rioja` |

## Capacidades máximas confirmadas

| Alojamiento | Huéspedes |
| --- | ---: |
| Loft Centro | 2 |
| Altos del Talampaya Casa | 8 |
| Altos del Talampaya Casa II | 2 |
| Altos del Talampaya Casa III | 4 |
| Altos del Talampaya Dpto | 2 |

## Alcance autorizado

- Módulo de disponibilidad, autenticación asociada y APIs exclusivas del módulo.
- Persistencia PostgreSQL, migraciones y configuración Docker necesaria.
- Normalización numérica mínima del catálogo existente.
- Pruebas, fixtures ICS y documentación de operación/despliegue.
- No reactivar ni ampliar el CMS administrativo heredado.
- No implementar reservas, pagos, tarifas, PMS, channel manager ni disponibilidad pública.
- Preservar cambios ajenos y no modificar `public/data/statistics.json`.

## Arquitectura objetivo

1. El catálogo TypeScript existente continúa siendo la fuente de identidad, nombre, imagen, slug y capacidad pública.
2. PostgreSQL conserva configuración cifrada de fuentes, ocupaciones normalizadas y ejecuciones de sincronización.
3. Las ocupaciones usan intervalos de fecha `[checkIn, checkOut)`.
4. La descarga ICS ocurre solo en el servidor y nunca durante una consulta ordinaria.
5. La importación valida completamente antes de reemplazar datos dentro de una transacción.
6. La interfaz espera la sincronización inicial, pero preserva y muestra el último snapshot válido si una fuente falla.
7. La autenticación del módulo es independiente del panel heredado y no concede acceso a otras rutas administrativas.

## Política de desarrollo y entrega

- Ruta: ODD delegado para unidades de implementación multarchivo.
- Evidencia del disparador: el MVP afecta persistencia, seguridad, backend, frontend, Docker y pruebas.
- Política test-first: RED → GREEN → REFACTOR cuando exista un test determinista y ejecutable; documentar excepciones cuando todavía no exista runner o el cambio sea pasivo.
- Estrategia de entrega: `ask-on-risk`.
- Presupuesto orientativo: 400 líneas por unidad/PR; el MVP completo superará ese tamaño y se dividirá por comportamiento coherente.
- Estrategia de cadena: pendiente hasta alcanzar el primer límite de entrega.
- Espejo Engram: pendiente porque las herramientas de memoria no están disponibles en esta sesión.

## Checklist

### Fase 0 — Preparación

- [x] `AV-000` Aclarar requisitos operativos con el usuario.
- [x] `AV-001` Auditar stack, administración, catálogo y despliegue existentes.
- [x] `AV-002` Definir autenticación, sincronización y política ante errores.
- [x] `AV-003` Crear la rama `codex/availability-mvp` desde `develop`.
- [x] `AV-004` Crear este checklist recuperable.
- [x] `AV-005` Registrar el commit y cerrar la fase 0.

### Fase 1 — Base técnica y PostgreSQL

- [x] `AV-100` Agregar Drizzle, PostgreSQL y Vitest.
- [x] `AV-101` Crear configuración server-only de base de datos.
- [x] `AV-102` Agregar PostgreSQL, healthcheck, red interna y volumen persistente a Compose.
- [x] `AV-103` Documentar variables de entorno sin secretos (requiere force-add de `.env.example` porque la regla actual lo ignora).
- [x] `AV-104` Crear un comando reproducible de migración.
- [x] `AV-105` Verificar arranque, healthcheck y persistencia después de reinicio.

### Fase 2 — Modelo de datos

- [ ] `AV-200` Incorporar capacidad máxima numérica al catálogo existente.
- [ ] `AV-201` Crear `calendar_sources` sin duplicar el catálogo público.
- [ ] `AV-202` Crear `occupancy_periods` con intervalos `[inicio, fin)`.
- [ ] `AV-203` Crear `sync_runs` con retención de 30 días.
- [ ] `AV-204` Agregar índices y restricciones de integridad.
- [ ] `AV-205` Modelar vaciados pendientes de aprobación.
- [ ] `AV-206` Crear y verificar la migración inicial.
- [ ] `AV-207` Crear el seed idempotente de los cinco alojamientos.

### Fase 3 — Autenticación y autorización

- [ ] `AV-300` Crear login exclusivo del módulo.
- [ ] `AV-301` Verificar contraseña mediante bcrypt y variables de entorno.
- [ ] `AV-302` Implementar cookie de sesión firmada de 8 horas.
- [ ] `AV-303` Implementar logout e invalidación de cookie.
- [ ] `AV-304` Proteger páginas y APIs del lado del servidor.
- [ ] `AV-305` Aplicar rate limiting específico al login.
- [ ] `AV-306` Confirmar que el panel heredado continúa deshabilitado.

### Fase 4 — Importación y sincronización ICS

- [ ] `AV-400` Cifrar URLs ICS en reposo y ocultarlas en respuestas/logs.
- [ ] `AV-401` Validar HTTPS, hosts, DNS, IPs y redirecciones contra SSRF.
- [ ] `AV-402` Descargar con timeout, límite de tamaño y redirecciones acotadas.
- [ ] `AV-403` Incorporar y encapsular el parser ICS.
- [ ] `AV-404` Normalizar fechas completas, horarios y zonas horarias.
- [ ] `AV-405` Procesar cancelaciones, modificaciones, duplicados y recurrencias soportadas.
- [ ] `AV-406` Implementar importación transaccional e idempotente.
- [ ] `AV-407` Evitar ejecuciones solapadas mediante bloqueo en PostgreSQL.
- [ ] `AV-408` Sincronizar fuentes en paralelo con concurrencia acotada.
- [ ] `AV-409` Implementar cooldown de 2 minutos y sincronización manual forzada.
- [ ] `AV-410` Preservar snapshots válidos ante errores.
- [ ] `AV-411` Detectar y aprobar manualmente vaciados sospechosos.
- [ ] `AV-412` Limpiar ejecuciones mayores a 30 días.

### Fase 5 — Motor de disponibilidad

- [ ] `AV-500` Implementar solapamiento `existing.start < requested.end && requested.start < existing.end`.
- [ ] `AV-501` Validar fechas presentes/futuras y check-out posterior.
- [ ] `AV-502` Validar huéspedes positivos y capacidad máxima.
- [ ] `AV-503` Implementar `DISPONIBLE`, `OCUPADO`, `NO_VERIFICABLE` y `CAPACIDAD_INSUFICIENTE`.
- [ ] `AV-504` Resolver consultas exclusivamente contra PostgreSQL.
- [ ] `AV-505` Verificar semántica de fechas `DATE` en `America/Argentina/La_Rioja`.

### Fase 6 — API protegida

- [ ] `AV-600` Configurar, listar, activar y desactivar fuentes ICS.
- [ ] `AV-601` Sincronizar una fuente.
- [ ] `AV-602` Sincronizar todas las fuentes al ingresar y manualmente.
- [ ] `AV-603` Consultar disponibilidad por fechas y huéspedes.
- [ ] `AV-604` Consultar calendario mensual.
- [ ] `AV-605` Consultar historial y errores sanitizados.
- [ ] `AV-606` Aprobar un vaciado sospechoso.
- [ ] `AV-607` Aplicar Zod, autorización, control de origen y `no-store`.

### Fase 7 — Interfaz

- [ ] `AV-700` Crear pantalla de login.
- [ ] `AV-701` Crear estado bloqueante para la sincronización inicial.
- [ ] `AV-702` Crear buscador por check-in, check-out y huéspedes.
- [ ] `AV-703` Mostrar resultados ordenados por estado.
- [ ] `AV-704` Mostrar capacidad, última sincronización y advertencias.
- [ ] `AV-705` Crear calendario mensual con filas por alojamiento.
- [ ] `AV-706` Crear representación móvil legible.
- [ ] `AV-707` Crear administración de fuentes ICS.
- [ ] `AV-708` Crear sincronización individual y general.
- [ ] `AV-709` Crear historial básico de ejecuciones.
- [ ] `AV-710` Crear confirmación de vaciado sospechoso.
- [ ] `AV-711` Mostrar la advertencia de disponibilidad estimada.

### Fase 8 — Pruebas obligatorias

- [ ] `AV-800` Calendario vacío válido.
- [ ] `AV-801` Evento único, eventos múltiples y duplicados.
- [ ] `AV-802` Check-out compartido con nuevo check-in.
- [ ] `AV-803` Solapamientos parciales y completos.
- [ ] `AV-804` Cancelaciones, modificaciones y recurrencias.
- [ ] `AV-805` ICS inválido y respuestas HTTP fallidas.
- [ ] `AV-806` Importación atómica, idempotente y preservación ante fallos.
- [ ] `AV-807` Detección y aprobación de vaciado sospechoso.
- [ ] `AV-808` Fechas, capacidades y zona horaria.
- [ ] `AV-809` Autenticación y autorización.
- [ ] `AV-810` Protección SSRF.
- [ ] `AV-811` Integración con PostgreSQL.

### Fase 9 — Verificación y despliegue

- [ ] `AV-900` Ejecutar `npm run typecheck`.
- [ ] `AV-901` Ejecutar `npm run lint`.
- [ ] `AV-902` Ejecutar tests automatizados.
- [ ] `AV-903` Ejecutar build de producción.
- [ ] `AV-904` Validar Compose, migraciones y persistencia desde cero.
- [ ] `AV-905` Validar backup y restauración de PostgreSQL.
- [ ] `AV-906` Documentar registro de ICS reales.
- [ ] `AV-907` Documentar instalación, despliegue y rollback.
- [ ] `AV-908` Confirmar que `public/data/statistics.json` no fue modificado.
- [ ] `AV-909` Ejecutar revisión final y registrar pendientes reales.

## Criterios de aceptación

- La aplicación arranca con PostgreSQL y migraciones reproducibles.
- Solo el administrador autenticado accede al módulo y sus APIs.
- Cada alojamiento admite una fuente ICS independiente.
- La sincronización inicial bloquea la pantalla hasta finalizar.
- Los errores conservan datos anteriores y nunca producen falsos disponibles.
- Las consultas usan datos locales y semántica `[checkIn, checkOut)`.
- El calendario funciona en escritorio y móvil.
- No se exponen URLs ICS ni datos personales.
- Los checks aplicables, el build y el despliegue Docker quedan verificados y documentados.

## Progreso y evidencia

| Fase | Estado | Evidencia | Próximo paso |
| --- | --- | --- | --- |
| 0 — Preparación | Completa | Rama creada; checklist `a141fce`; RDD `passive` | Iniciar la base técnica |
| 1 — Base técnica | Completa | `postgres:16-alpine` inició saludable; un marcador persistió después de `docker compose restart postgres`; la imagen `goaventura-db-migrate:local` se construyó y aplicó correctamente las migraciones versionadas; se eliminaron el contenedor, red, volumen y archivo de entorno temporales. Además, `typecheck`, `lint`, tests sin archivos, Compose config con perfil `tools`, `db:generate` convergente y `git diff --check` correctos | Registrar el commit y comenzar la fase 2 |

## Registro de commits

| Unidad | Commit | Verificación | Rollback |
| --- | --- | --- | --- |
| Fase 0 — Preparación | `a141fce` | `typecheck`, `lint` y `git diff --check` correctos | Revertir `a141fce` |
| Fase 1 — Base técnica | Sin commit | Ruta `delegated`; excepción test-first: configuración/fundación sin RED conductual significativo; `npm run typecheck` ✅; `npm run lint` ✅ (warnings preexistentes); `npm test -- --run` ✅ (sin archivos, `passWithNoTests`); `npm run db:generate` ✅ y convergente (0 tablas, solo `drizzle/meta/_journal.json`); imagen `db-migrate` ✅; `npm run db:migrate` ✅ contra PostgreSQL temporal; `docker compose --profile tools ... config --quiet` ✅; `git diff --check` ✅; PostgreSQL saludable y persistencia tras reinicio ✅ | Revertir los archivos de la fase 1; aproximadamente 4.933 líneas añadidas/eliminadas (incluye lockfile) |
