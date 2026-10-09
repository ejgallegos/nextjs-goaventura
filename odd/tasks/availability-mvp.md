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
| Horizonte de recurrencias ICS | Desde la fecha de sincronización hasta 18 meses hacia adelante |

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
- Estrategia de cadena: `feature-branch-chain`; `codex/availability-mvp` funciona como rama integradora y cada slice coherente se implementa en una rama hija encadenada.
- Espejo Engram: pendiente porque las herramientas de memoria no están disponibles en esta sesión.

### Plan de implementación de la Fase 4

| Slice | Tareas | Ruta | Rama prevista | Presupuesto orientativo | Estado |
| --- | --- | --- | --- | ---: | --- |
| A1 — Cifrado de fuentes | `AV-400` | Delegada; criptografía y tests RED → GREEN | `codex/availability-ics-security` | 117 líneas | Completa (`d949b10`) |
| A2 — Política de red | `AV-401` | Delegada; validación SSRF/DNS y tests RED → GREEN | `codex/availability-ics-network-policy` | 294 líneas | Completa (`5d3bc6d`) |
| A3 — Transporte HTTPS | `AV-402` | Delegada; redirects, límites, cancelación y cleanup | `codex/availability-ics-fetch` | 462 líneas | Completa (`ab51327`); `size:exception` autorizada |
| B1 — Parser y normalización base | `AV-403`–`AV-404` | Delegada; dependencia nueva, fixtures, VEVENT y reglas de fecha/zona horaria | `codex/availability-ics-parser` | 311 líneas | Completa (`661f573`, `716e50e`); RDD `medium` bajo presupuesto |
| B2 — Recurrencias y excepciones | `AV-405` | Delegada; cancelaciones, overrides, exclusiones, fechas adicionales y deduplicación | `codex/availability-ics-recurrence` | 300–340 líneas | Pendiente |
| C — Importación y locking | `AV-406`–`AV-407` | Delegada; transacciones y bloqueo PostgreSQL | `codex/availability-ics-import` | 300 líneas | Pendiente |
| D — Orquestación y cooldown | `AV-408`–`AV-409` | Delegada; concurrencia y política temporal | `codex/availability-ics-sync` | 250 líneas | Pendiente |
| E — Fail-safe y retención | `AV-410`–`AV-412` | Delegada; protección de snapshots y limpieza | `codex/availability-ics-retention` | 320 líneas | Pendiente |

El forecast total de la fase es de aproximadamente 1.800 líneas después de la división preventiva de B. Cada slice mantiene sus pruebas y documentación junto con el comportamiento y constituye un límite de rollback independiente.

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

- [x] `AV-200` Incorporar capacidad máxima numérica al catálogo existente.
- [x] `AV-201` Crear `calendar_sources` sin duplicar el catálogo público.
- [x] `AV-202` Crear `occupancy_periods` con intervalos `[inicio, fin)` (sin texto libre de ICS).
- [x] `AV-203` Crear `sync_runs` con retención de 30 días.
- [x] `AV-204` Agregar índices y restricciones de integridad (regenerados tras la corrección de lifecycle).
- [x] `AV-205` Modelar vaciados pendientes de aprobación (FK compuesto exclusivo para sync runs `no_data`).
- [x] `AV-206` Crear y verificar la migración inicial.
- [x] `AV-207` Crear el seed idempotente de los cinco alojamientos.

### Fase 3 — Autenticación y autorización

- [x] `AV-300` Crear login exclusivo del módulo.
- [x] `AV-301` Verificar contraseña mediante bcrypt y variables de entorno.
- [x] `AV-302` Implementar cookie de sesión firmada de 8 horas.
- [x] `AV-303` Implementar logout e invalidación de cookie.
- [x] `AV-304` Proteger páginas y APIs del lado del servidor.
- [x] `AV-305` Aplicar rate limiting específico al login.
- [x] `AV-306` Confirmar que el panel heredado continúa deshabilitado.

### Fase 4 — Importación y sincronización ICS

- [x] `AV-400` Cifrar URLs ICS en reposo y ocultarlas en respuestas/logs.
- [x] `AV-401` Validar HTTPS, hosts, DNS, IPs y redirecciones contra SSRF.
- [x] `AV-402` Descargar con timeout, límite de tamaño y redirecciones acotadas.
- [x] `AV-403` Incorporar y encapsular el parser ICS.
- [x] `AV-404` Normalizar fechas completas, horarios y zonas horarias.
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
| 1 — Base técnica | Completa | Commit `28ef200`; RDD `medium` aprobado y reconocido en el linaje `review-12df1f3fdf32cf7e`; `postgres:16-alpine` inició saludable; un marcador persistió después de `docker compose restart postgres`; la imagen `goaventura-db-migrate:local` se construyó y aplicó correctamente las migraciones versionadas; se eliminaron el contenedor, red, volumen y archivo de entorno temporales. Además, `typecheck`, `lint`, tests sin archivos, Compose config con perfil `tools`, `db:generate` convergente y `git diff --check` correctos | Comenzar la fase 2; considerar por separado las advertencias informativas `R3-001` y `R3-002` |
| 2 — Modelo de datos | Completa | Commit `2f862c6`; RDD `medium` aprobado sin hallazgos y reconocido en el linaje `review-1d1745c69ab446bd`; ruta `delegated`; excepción test-first: el seam aprobado se verificó directamente contra PostgreSQL real. `maxCapacity` agregado a los cinco alojamientos; cuatro tablas sin campos de huéspedes, enums, checks, FKs e índices generados. La imagen Docker se construyó; la migración se aplicó dos veces; el seed se ejecutó tres veces y conservó cinco slugs únicos. Se preservaron una URL cifrada de prueba y el estado activo existentes. PostgreSQL rechazó intervalos inválidos, estados/timestamps inconsistentes, aprobaciones ajenas a `no_data` y aprobaciones duplicadas. `db:generate` repetido permaneció convergente. Cambio real: 1.198 líneas añadidas/eliminadas incluyendo snapshot/migración | Comenzar la fase 3 |
| 3 — Autenticación y autorización | Completa | Commit `139d46f`; ruta `delegated`; corrección RED → GREEN observada en limiter/CSRF/cookies/client-address: los focused runs iniciales fallaron por entradas sin límite, cabeceras manipulables, comparación por prefijo, opciones de cookie inexistentes y helper ausente; el run final pasó con 11 tests. El limiter ahora limpia expirados, tiene máximo configurable y eviction determinista, usa únicamente `X-Real-IP` válido detrás del Traefik sole-ingress, reinicia el bucket tras autenticación exitosa y mantiene un fallback estable. CSRF parsea URL y compara `.origin` exactamente. El middleware activo quedó en `src/middleware.ts`, con `/admin` y `/admin/**` bloqueados sin afectar `/administrator`; las opciones de cookie tienen seam determinista para Secure, HttpOnly, SameSite=Strict, Path=/, Max-Age 28800 y logout epoch/zero. El padre verificó HTTP exitosamente: redirects, 401/no-store, cuerpos idénticos de credenciales inválidas, login, atributos de cookie en desarrollo, página/API protegida, rechazo de tamper, 429/retry, logout, redirect de legacy page, legacy API 410 y `/administrator` 404. El build de producción finalizó con exit 0; solo permanecen advertencias no relacionadas de Genkit/OpenTelemetry. `typecheck`, `lint`, tests y `git diff --check` correctos. RDD `high` aprobado y reconocido en el linaje `review-0c0ded3894f1d3ac`; dejó cuatro advertencias informativas no bloqueantes sobre logout y validación IPv6 para trabajo posterior. Cambio real: 1.023 líneas añadidas/eliminadas | Comenzar la Fase 4 |
| 4 — Importación y sincronización ICS | En curso | `AV-400` completado en `d949b10`: AES-256-GCM versionado, clave base64 exacta de 32 bytes, errores sanitizados y tests dedicados. `AV-401` completado en `5d3bc6d`: HTTPS estricto, política conservadora de IP global, validación DNS completa y lookup fijado compatible con Node. El acumulado AV-400/401 recibió revisión RDD `medium`, aprobada y reconocida en `review-d4a79fa823a1d137`, con una advertencia informativa sobre literales IPv6 públicos. `AV-402` completado en `ab51327`: transporte HTTPS fijado, redirects acotados, timeout total, límite de bytes, content-types y cleanup. La `size:exception` de 62 líneas fue autorizada después de una única división cohesiva. Su revisión RDD `medium` fue aprobada, reconocida y consumida en `review-ff7942781a5e7e85`; dejó dos advertencias informativas no bloqueantes sobre opciones numéricas no finitas y el conteo de bytes tras decodificar UTF-8. `AV-403/404` completados en `661f573` y `716e50e`: `ical.js@2.2.1`, parser server-only, fechas estrictas, `DTSTART + DTEND/DURATION`, normalización DATE/UTC/floating/TZID y errores sanitizados | Evaluar RDD de B1 y comenzar AV-405 |

## Registro de commits

| Unidad | Commit | Verificación | Rollback |
| --- | --- | --- | --- |
| Fase 0 — Preparación | `a141fce` | `typecheck`, `lint` y `git diff --check` correctos | Revertir `a141fce` |
| Fase 1 — Base técnica | `28ef200` | Ruta `delegated`; excepción test-first: configuración/fundación sin RED conductual significativo; `npm run typecheck` ✅; `npm run lint` ✅ (warnings preexistentes); `npm test -- --run` ✅ (sin archivos, `passWithNoTests`); `npm run db:generate` ✅ y convergente (0 tablas, solo `drizzle/meta/_journal.json`); imagen `db-migrate` ✅; `npm run db:migrate` ✅ contra PostgreSQL temporal; `docker compose --profile tools ... config --quiet` ✅; `git diff --check` ✅; PostgreSQL saludable y persistencia tras reinicio ✅; RDD `medium` aprobado, reconocido y consumido (`review-12df1f3fdf32cf7e`) con dos advertencias informativas no bloqueantes | Revertir `28ef200`; aproximadamente 4.933 líneas añadidas/eliminadas (incluye lockfile) |
| Fase 2 — Modelo de datos | `2f862c6` | Ruta `delegated`; `typecheck` ✅; `lint` ✅ (warnings preexistentes); tests ✅ (sin archivos); `db:generate` convergente ✅; Compose config ✅; imagen Docker ✅; migración repetida ✅; seed repetido y preservación de configuración ✅; restricciones de integridad ejercitadas en PostgreSQL ✅; `git diff --check` ✅; `public/data/statistics.json` intacto ✅; RDD `medium` aprobado sin hallazgos, reconocido y consumido (`review-1d1745c69ab446bd`) | Revertir `2f862c6`; 1.198 líneas añadidas/eliminadas |
| Fase 3 — Autenticación y autorización | `139d46f` | Ruta `delegated`; focused RED → GREEN ✅ para bounded/expiring limiter, trusted `X-Real-IP`, bucket reset, exact CSRF origins, middleware relocation, cookie options y Edge-compatible client address; `typecheck` ✅; `lint` ✅ con warnings preexistentes; `npm test -- --run` ✅ (11 tests); `git diff --check` ✅; los tres warnings nuevos de `src/middleware.ts` desaparecieron; build de producción final ✅ exit 0 con advertencias no relacionadas; verificación HTTP final del padre ✅ para redirects, 401/no-store, credenciales inválidas idénticas, login, cookies, página/API protegida, tamper, 429/retry, logout, legacy page/API y `/administrator`; `public/data/statistics.json` intacto ✅; RDD `high` aprobado, reconocido y consumido (`review-0c0ded3894f1d3ac`) con cuatro advertencias informativas no bloqueantes (`R2-001`, `R3-001`, `R3-002`, `R4-logout-failure`) | Revertir `139d46f`; 1.023 líneas añadidas/eliminadas |
| Fase 4 / AV-400 — Cifrado de fuentes ICS | `d949b10` | Ruta `delegated`; AES-256-GCM `v1.iv.tag.ciphertext`; clave base64 de 32 bytes; roundtrip, tamper, versión y clave inválida verificados; suite completa 19/19 ✅; typecheck ✅; lint ✅ con warnings preexistentes; diff-check ✅; estadísticas intactas ✅ | Revertir `d949b10`; 117 líneas añadidas |
| Fase 4 / AV-401 — Política de red ICS | `5d3bc6d` | Ruta `delegated`; HTTPS/host/credenciales/fragmentos/puertos verificados; rangos IPv4/IPv6 no globales bloqueados; DNS completo y lookup fijado asíncrono cubiertos; suite completa 19/19 ✅; typecheck ✅; lint ✅; diff-check ✅; estadísticas intactas ✅; acumulado AV-400/401 aprobado, reconocido y consumido (`review-d4a79fa823a1d137`) con `R3-public-ipv6-literal` informativo | Revertir `5d3bc6d`; 294 líneas añadidas |
| Fase 4 / AV-402 — Transporte HTTPS ICS | `ab51327` | Ruta `delegated`; redirects seguros y máximo 3; timeout total cancelable; límite 2 MiB; content-types controlados; request/response/body limpiados; focused 5/5 ✅; suite completa 19/19 ✅; typecheck ✅; lint ✅; diff-check ✅; estadísticas intactas ✅; `size:exception` autorizada tras una sola pasada de slicing; RDD `medium` aprobado, reconocido y consumido (`review-ff7942781a5e7e85`) con `R3-001` (opciones numéricas no finitas) y `R3-002` (conteo de bytes recodificados) como advertencias informativas separadas | Revertir `ab51327`; 462 líneas añadidas |
| Fase 4 / AV-403–404 — Parser y normalización ICS | `661f573`, `716e50e` | Ruta `delegated`; RED → GREEN ✅ para rollover de fechas inválidas y soporte `DTSTART + DURATION`; `ical.js@2.2.1` encapsulado server-only; DATE, UTC, floating y TZID normalizados; fixture TZID cruza frontera de fecha; TZID custom rechazado sin reinterpretación; focused 5/5 ✅; suite completa 24/24 ✅; typecheck ✅; lint ✅ con warnings preexistentes; diff-check ✅; estadísticas intactas ✅; verificación independiente cerró los dos bloqueantes iniciales; el fixture de duración omitido del primer commit se agregó en `716e50e` antes de congelar la revisión; RDD `medium`, `under_budget` con 323 líneas acumuladas desde `9ac3af8` | Revertir `716e50e` y `661f573`; 311 líneas añadidas incluyendo 6 generadas de lockfile |
