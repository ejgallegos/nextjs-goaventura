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
- T6 | S1-S3 | inline | completed | a9a9966 | Habilitar clave de Wi-Fi como clave de acceso a la guía privada y actualizar formulario.
- T7 | S4-S5 | inline | completed | 44411c0 | Ampliar comercios de Villa Unión (supermercados, 24hs, polirubro, farmacias y paradores).
- T8 | S4-S5 | inline | completed | f886b9d | Incorporar bancos, hospital, bomberos, parroquia, plaza principal y estaciones en Útil y SOS.
- T9 | S4-S5 | inline | completed | d9793c4 | Quitar Farmacia Talampaya, Farmacias de turno y Comisaría; corregir dirección de Oficina de Turismo a Nicolás Dávila Sur.
- T10 | S4-S5 | inline | completed | fa9d0ff | Remover indicación de 24 horas a Supermercado Valeriana en Comercios.
- T11 | S4-S5 | inline | completed | e0f3d39 | Renombrar sección Lugares a Atractivos y cargar catálogo curado de 20 atractivos turísticos con mapas y coordenadas.
- T12 | S4-S5 | inline | completed | c86d261 | Incorporar Farmacia Emanuel y Farmacia San Luis con coordenadas de Google Maps y teléfono de contacto.
- T13 | S4-S5 | inline | completed | 2730afb | Remover enlace 'Ver lámina A4 con QR para imprimir' y acción de impresión del dashboard del huésped.
- T14 | S4-S5 | inline | completed | 71b66cd | Desactivar y ocultar el proveedor y badge de reCAPTCHA en las rutas de la guía privada.
- T15 | S4-S5 | inline | completed | 10409f9 | Actualizar enlace de mapa regional al nuevo mapa personalizado Go Aventura (mid=1bL8uHR6ugFs35-SvQ2epju3hBQlXkzk).
- T16 | S4-S5 | inline | completed | 986cceb | Actualizar teléfono de Go Aventura a +54 9 3825 52-6275 y destacar DS Uno Viajes como Recomendado en Excursiones.
- T17 | S4-S5 | inline | completed | 4e80909 | Quitar Regionales Milor de la categoría Artesanías en el catálogo de recomendaciones.
- T18 | S4-S5 | inline | completed | 7769c64 | Remover la palabra 'cívico' de los títulos y descripciones de la guía.
- T19 | S4-S5 | inline | completed | a3d0512 | Mejorar botón flotante de WhatsApp con icono oficial WhatsAppIcon, color de marca #25D366 y soporte pointer-events para clics.

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
- L12 (2026-11-09): User request: "en la sección comercios agrega más, solo aparecen dos.". Added verified supermarkets, 24hs convenience store, central grocery, polirubro, pharmacies, service station minimarkets and beverage distributor in Villa Unión (10 total commercial spots) (commit 44411c0).
- L13 (2026-11-09): User request: "en información Util agrega los Bancos, el hospital, bomberos, iglesias, plaza principal, estacion de servicios, etc.". Enriched Útil y SOS view with structured sub-sections: emergency dials, Banco Nación (BNA) and Banco Rioja with 24hs Link ATMs, Hospital Dr. Eduardo Neira with 24hs emergency guard, Cuartel de Bomberos Voluntarios, historic Parroquia Nuestra Señora del Rosario, Plaza San Martín, Tourist Office, Bus Terminal, and 24hs YPF and Gulf service stations with direct Google Maps links (commit f886b9d).
- L14 (2026-11-09): User request: "quita estas farmacias, Farmacia Talampaya y Farmacias de turno en Villa Union; quita tambien Comisaria de Villa Union; Corrige la dirección de la Oficina de Turismo, es Nicolas Dávila Sur". Removed Farmacia Talampaya, Farmacias de turno and Comisaría cards; updated Oficina de Informes Turísticos Municipal address and Google Maps query to Nicolás Dávila Sur (commit d9793c4).
- L15 (2026-11-09): User request: "A supermercado Valeriana quitale el 24 horas abierto.". Removed 24hs label and description from Supermercado Valeriana; updated badge to "Almacén y Carnes" (commit fa9d0ff).
- L16 (2026-11-09): User request: "bien! ahora vamos a revisar estos documentos y registrar lo que sea necesario, sobre todo en la seccion 'Lugares' que quiero que lo cambier por 'Atractivos'". Renamed view, tile, and headings from "Lugares" to "Atractivos" (maintaining backward-compatible hash routing). Curated 20 tourist attractions from primary sources (official Felipe Varela guide, folleto 2025, and geographical points CSV) with badges, descriptions, locations, and precise Google Maps links. Verified with 38 test assertions passing, 0 TypeScript errors, 0 ESLint errors, and full production build succeeded.
- L17 (2026-11-09): User request: "faltan dos farmacias, identificalas en el mapa y carga la información. Son: Farmacia Emanuel y Farmacia San Luis". Added Farmacia Emanuel (Hipólito Yrigoyen esq. Av. Perón, tel. 03825-470383) and Farmacia San Luis (Zona centro, tel. 03825-477702) under Salud and Comercios with verified direct Google Maps search URLs. 44 assertions passed, 0 type errors, 0 lint errors.
- L18 (2026-11-09): User request: "quita 'Ver lámina A4 con QR para imprimir'". Removed footer link to printable sheet and header print icon from GuestGuideDashboard. Verified 44 unit tests pass, typecheck 0 errors.
- L19 (2026-11-09): User request: "oculta el recaptcha de la guia.". Excluded GoogleReCaptchaProvider from mounting on `/guia` routes and added CSS hide rules for `.grecaptcha-badge` under `.guide-active` and `:has(.is-guide-page)`. Verified 44 unit tests pass, typecheck 0 errors.
- L20 (2026-11-11): User request: "ya cree el mapa, quiero que pongas éste en la guia. Solo este vamos a usar. https://www.google.com/maps/d/u/0/edit?mid=1bL8uHR6ugFs35-SvQ2epju3hBQlXkzk&usp=sharing". Replaced `touristMapUrl` with the clean viewer URL for mid `1bL8uHR6ugFs35-SvQ2epju3hBQlXkzk`. Verified 45 unit tests pass, typecheck 0 errors.
- L21 (2026-11-13): User request: "en Excursiones, cambia el nro de telefono de Go Aventura por éste +54 9 3825 52-6275; Y a DS Uno tambien agregalo como recomendado.". Updated Go Aventura phone and WhatsApp reservation phone in Excursiones to +54 9 3825 52-6275. Set DS Uno Viajes badge to 'Recomendado' with direct WhatsApp reservation button. 47 tests pass, 0 type errors.
- L22 (2026-11-13): User request: "de Artesanías quita Regionales Milor". Removed Regionales Milor from Artesanías in guest-guide.ts. Verified with 48 unit tests passing, typecheck 0 errors.
- L23 (2026-11-13): User request: "quita la palabra 'cívico' de todos lados donde aparezca. Por ej donde dice 'Centro cívico' dejar 'Centro'.". Replaced "Plaza Principal y Servicios Cívicos" with "Plaza Principal y Centro" in dashboard and guide data, removed "cívico" from Plaza San Martín description. Verified 50 tests pass, 0 occurrences of cívico in src/.
- L24 (2026-11-13): User request: "mejora el botón flotante de 'Consultar por WhatsApp', agregale el icono original y mejoralo.". Integrated official SVG WhatsAppIcon, set official brand color #25D366 (hover: #20BD5A), added drop-shadow and pointer-events-none on gradient wrapper to allow pass-through scrolling/clicks. Also updated WhatsApp buttons in ItemCard and login view. Verified 51 tests pass, typecheck 0 errors.
