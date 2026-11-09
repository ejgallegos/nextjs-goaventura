# Private guest guide

Objective: create a private, QR-accessible welcome guide for Altos del Talampaya Dpto.
Branch: codex/private-guest-guide. Delivery: feature branch work units. Runner: npm run typecheck && npm run lint && npm run build.

## Specs

S1. "Crear una guía móvil privada en `/guia/altos-del-talampaya-dpto`, accesible desde un QR impreso. Tendrá un PIN activo configurado manualmente por variables de entorno, con vencimiento, y estará enfocada en facilitar la estadía y descubrir Villa Unión."

S2. "Crear acceso protegido por PIN: validación server-side, hash bcrypt, vencimiento configurable, cookie `httpOnly` firmada y límite de intentos." "Excluir la guía de navegación, sitemap e indexación (`noindex, nofollow`); el QR contendrá únicamente la URL, nunca el PIN."

S3. "Mantener Wi‑Fi y código de caja de llaves exclusivamente detrás de la sesión autenticada; no incluirlos en JavaScript, HTML público ni datos estáticos." "El código de caja de llaves se mostrará luego de ingresar el PIN."

S4. "Diseñar una experiencia mobile-first inspirada en las referencias, sin copiarlas: portada del departamento, acceso rápido y barra de contacto." Incluir: "Llegada, check-in, estacionamiento y salida." "Wi‑Fi, Smart TV, climatización y reglas de convivencia." "Botón persistente de WhatsApp para consultas." "Emergencias, farmacia, supermercado y servicios útiles." "Gastronomía, bodegas, artesanías, localidades, excursiones y transfers seleccionados." "Mapa con puntos curados, enlaces directos a Google Maps y enlace al mapa turístico completo."

S5. "Excluir alojamientos de las guías turísticas externas. Los contactos y horarios se mostrarán solo cuando estén confirmados y con aviso de consultar vigencia." "Centralizar el contenido en una estructura tipada y reutilizable para futuras guías, aunque esta primera publicación será solo para el Dpto."

S6. "Generar un QR en SVG/PNG de alta resolución y una lámina A4 imprimible con instrucciones breves para huéspedes."

S7. "Probar acceso sin sesión, PIN válido, inválido, vencido y exceso de intentos." "Confirmar que el PIN, Wi‑Fi y código de llaves no aparecen en el HTML público ni en el bundle cliente." "Verificar enlaces de WhatsApp, teléfono y Google Maps." "Revisar navegación por teclado, foco visible, reducción de movimiento y vistas móvil vertical/horizontal." "Ejecutar `npm run typecheck`, `npm run lint` y `npm run build`." "Renderizar y revisar visualmente la lámina QR antes de imprimirla."

## Tasks

- T1 | S1-S3 | inline | completed | 44e3f0e | Create server-only configuration, access validation and protected session route.
- T2 | S4-S5 | inline | completed | 44e3f0e | Build reusable data model and mobile-first guide interface.
- T3 | S6 | inline | completed | 44e3f0e | Produce QR assets and print layout.
- T4 | S7 | inline | completed | 44e3f0e | Run checks and validate privacy/access behavior.
- T5 | S4-S5 | inline | completed | 76fce41 | Highlight Go Aventura as recommended with official web data and direct booking buttons.
- T6 | S1-S3 | inline | completed | pending | Habilitar clave de Wi-Fi como clave de acceso a la guía privada y actualizar formulario.

## Log

- L1 (2026-11-06): User request: "PLEASE IMPLEMENT THIS PLAN" followed by the complete Private Guest Guide plan.
- L2 (2026-11-06): The user selected a manually configured single active PIN and requested that the key-box code be displayed only after successful PIN authentication.
- L3 (2026-11-06): CodeGraph initialization was attempted as required but the codegraph executable is unavailable; implementation will use targeted repository inspection.
- L4 (2026-11-06): Implemented server-only runtime configuration with bcrypt validation, HMAC-SHA256 session tokens, rate limiting, and private details retrieval.
- L5 (2026-11-06): Implemented mobile-first dashboard with operational data from Altos del Talampaya PDF and curated tourism recommendations from primary source PDFs (excluding external accommodations).
- L6 (2026-11-06): Generated high-resolution SVG and PNG QR assets, created printable A4 sheet at `/guia/altos-del-talampaya-dpto/imprimir`, and added robots.txt exclusions.
- L7 (2026-11-06): Executed comprehensive test suite (`scripts/test-guest-guide.ts`) passing all 22 assertions; confirmed zero-leak of private credentials; executed `npm run typecheck`, `npm run lint`, and `npm run build` with zero errors.
- L8 (2026-11-06): User requested cleaner mobile design inspired by https://tualojamiento.netlify.app/ and removing nav & footer from the main website. Implemented SiteLayoutWrapper to isolate `/guia` routes from root Header and Footer; restructured dashboard into clean mobile 12-tile app view with subview navigation and bottom WhatsApp bar (commit b45d233).
- L9 (2026-11-06): Added all remaining tourist services from the official General Felipe Varela guide (excluding accommodations): 18 gastronomy venues, 9 travel agencies (EVTs), 4 campings, 7 wineries, 5 artisan/regional shops, and 5 localities with phone, maps, web, and email contacts (commit 321a4e6).
- L10 (2026-11-06): Highlighted Go Aventura as "Recomendado" and incorporated complete details from goaventura.com.ar (Leg. 20019, 4x4 expeditions to Laguna Brava, Talampaya, Cañón del Triásico, private transfers, direct WhatsApp reservation buttons, and teal-accented cards) (commit 76fce41).
- L11 (2026-11-09): User request: "quiero que el acceso a la guia sea con la misma clave del wifi y te consulto, es posible restringir el acceso según la mac del rooter que acceda? de esta manera le agrego mayor seguridad o que recomendarias?". Enabled constant-time validation with accommodation's Wi-Fi password (`GUEST_GUIDE_ALTOS_DPTO_WIFI_PASSWORD`); made PIN_HASH optional; updated form input and copy; verified 25 test cases passing. Addressed router MAC restriction consultation and security recommendations.
