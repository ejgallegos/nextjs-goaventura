export interface GuideArrivalInfo {
  address: string;
  checkIn: string;
  checkOut: string;
  parking: string;
  keyBoxLocation: string;
  keyDescription: string;
}

export interface GuideDepartureInstruction {
  step: number;
  text: string;
}

export interface GuidePaymentInfo {
  currencyDescription: string;
  instructions: string;
  bankAlias: string;
  accountHolder: string;
}

export interface GuideApplianceGuide {
  title: string;
  subtitle: string;
  instructions: string[];
}

export interface GuideEmergencyContact {
  label: string;
  number: string;
  note: string;
  isCallOnly?: boolean;
}

export interface GuideUsefulService {
  label: string;
  description: string;
  address?: string;
  phone?: string;
  reservationPhone?: string;
  badge?: string;
  href: string;
  category:
    | 'Salud'
    | 'Supermercado'
    | 'Seguridad'
    | 'Servicios'
    | 'Comercios'
    | 'Bancos'
    | 'Iglesias'
    | 'Combustible';
}

export type RecommendationCategory =
  | 'Gastronomía'
  | 'Bodegas'
  | 'Artesanías'
  | 'Localidades'
  | 'Atractivos'
  | 'Excursiones'
  | 'Campings';

export interface GuideRecommendation {
  category: RecommendationCategory;
  label: string;
  description: string;
  address?: string;
  phone?: string;
  reservationPhone?: string;
  email?: string;
  web?: string;
  href?: string;
  badge?: string;
}

export interface PropertyGuestGuide {
  slug: string;
  propertyName: string;
  propertyType: string;
  location: string;
  capacity: string;
  coverImage: string;
  contactPhone: string;
  contactLabel: string;
  propertyMapUrl: string;
  touristMapUrl: string;
  arrival: GuideArrivalInfo;
  departure: {
    limitTime: string;
    instructions: string[];
  };
  appliances: GuideApplianceGuide[];
  houseRules: string[];
  payment: GuidePaymentInfo;
  emergencies: {
    firstAidKitLocation: string;
    contacts: GuideEmergencyContact[];
  };
  usefulServices: GuideUsefulService[];
  recommendations: GuideRecommendation[];
}

export const altosDptoGuide: PropertyGuestGuide = {
  slug: 'altos-del-talampaya-dpto',
  propertyName: 'Altos del Talampaya Dpto',
  propertyType: 'Departamento turístico exclusivo',
  location: 'Villa Unión, La Rioja',
  capacity: 'Exclusivo para 2 personas · 1 dormitorio sommier, baño y cocina equipada',
  coverImage: '/images/alojamientos/altos-del-talampaya-dpto-07.jpg',
  contactPhone: '5493804509885',
  contactLabel: 'Anfitrión Altos del Talampaya',
  propertyMapUrl:
    'https://www.google.com/maps/search/?api=1&query=Altos+del+Talampaya+Dpto%2C+Calle+Ing+Elio+Vergara%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
  touristMapUrl:
    'https://www.google.com/maps/d/viewer?mid=1bL8uHR6ugFs35-SvQ2epju3hBQlXkzk',
  arrival: {
    address: 'Calle Ing. Elio Vergara s/n, Villa Unión, La Rioja',
    checkIn: '15:00 hs',
    checkOut: '10:00 hs',
    parking: 'Cochera privada y techada en las instalaciones del departamento, incluida.',
    keyBoxLocation: 'Caja de seguridad ubicada en el ingreso al departamento por la puerta de la cochera.',
    keyDescription: 'Usar la llave identificada con cinta amarilla.',
  },
  departure: {
    limitTime: '10:00 hs',
    instructions: [
      'Apagar el equipo de aire acondicionado y las cajitas de control de calefacción / piso radiante.',
      'Dejar los residuos en el tacho interior y la vajilla utilizada limpia u ordenada.',
      'Cerrar la puerta principal y guardar la llave con cinta amarilla dentro de la caja de seguridad exterior, girando las ruedas del código para dejarla trabada.',
    ],
  },
  appliances: [
    {
      title: 'Piso Radiante (Calefacción)',
      subtitle: 'Comandado por paneles individuales (cajitas blancas)',
      instructions: [
        'Ubicación: pequeñas cajas blancas situadas junto a la puerta principal y en el dormitorio.',
        '1. Encendido: Presioná el botón "ON" en el panel.',
        '2. Temperatura: Graduá el calor deseado con los botones de flecha (arriba / abajo).',
        '3. Confirmación: Presioná el botón "Set" para guardar la temperatura seleccionada.',
        '4. Apagado: Presioná el botón de apagado al retirarte o cuando el ambiente esté templado.',
      ],
    },
    {
      title: 'Aire Acondicionado',
      subtitle: 'Refrigeración para jornadas calurosas',
      instructions: [
        'Operalo con el control remoto provisto en el departamento.',
        'Uso consciente: Por favor apagá el equipo cada vez que salgas para cuidar la energía del valle.',
      ],
    },
    {
      title: 'Smart TV y Entretenimiento',
      subtitle: 'Televisión en vivo por cable y streaming',
      instructions: [
        'Encendé el televisor con el control remoto.',
        'Para TV en vivo por cable, seleccioná la aplicación "View" en la pantalla principal.',
        'Podés ingresar a tus cuentas personales de streaming; recordá cerrar sesión antes de tu check-out.',
      ],
    },
    {
      title: 'Cocina y Estar',
      subtitle: 'Equipamiento completo para tu comodidad',
      instructions: [
        'Disponés de vajilla, utensilios de cocina, pava eléctrica y heladera.',
        'Agradecemos dejar la vajilla ordenada y limpia tras su uso.',
      ],
    },
  ],
  houseRules: [
    'Prohibido fumar en el interior: Agradecemos disfrutar del aire libre en el patio/exterior para fumar.',
    'Pet Friendly: Aceptamos mascotas con agrado. Solicitamos velar por el cuidado de la ropa de cama y el mobiliario.',
    'Manejo de residuos: Por favor depositá todos los residuos en el tacho interior provisto en el departamento.',
    'Descanso vecinal: No se aplican restricciones fijas de horarios de silencio; apelamos a la amabilidad y buen descanso de la vecindad.',
  ],
  payment: {
    currencyDescription:
      'Tomamos el valor de la noche a cotización del dólar oficial del Banco Nación del día de pago.',
    instructions:
      'El pago se realiza preferentemente durante el primer día de estadía, en efectivo o transferencia bancaria.',
    bankAlias: 'ericgallegos.bna',
    accountHolder: 'Gallegos Reinoso Eric Javier Jeremías',
  },
  emergencies: {
    firstAidKitLocation: 'Botiquín de primeros auxilios disponible en el baño para cualquier imprevisto menor.',
    contacts: [
      {
        label: 'Urgencias Médicas / Hospital Dr. Eduardo Neira',
        number: '107',
        note: 'Guardia médica de emergencias en Villa Unión (línea gratuita)',
        isCallOnly: true,
      },
      {
        label: 'Policía / Comisaría Villa Unión',
        number: '101',
        note: 'Guardia policial local ante incidentes o emergencias',
        isCallOnly: true,
      },
      {
        label: 'Bomberos Villa Unión',
        number: '100',
        note: 'Emergencias e incendios',
        isCallOnly: true,
      },
      {
        label: 'Anfitrión Altos del Talampaya',
        number: '+54 380 450-9885',
        note: 'Consultas directas, asistencia y coordinación de tu estadía',
      },
    ],
  },
  usefulServices: [
    /* ==========================================================
       SALUD Y FARMACIAS
       ========================================================== */
    {
      category: 'Salud',
      label: 'Hospital Dr. Eduardo Neira (Guardia 24 hs)',
      description: 'Hospital zonal y centro asistencial cabecera del Valle del Bermejo. Guardia médica permanente de urgencias las 24 horas y base del servicio de ambulancia 107.',
      address: 'Hipólito Yrigoyen s/n, Villa Unión, La Rioja',
      phone: '107',
      badge: 'Guardia 24 hs',
      href: 'https://www.google.com/maps/search/?api=1&query=Hospital+Dr.+Eduardo+Neira%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Salud',
      label: 'Farmanor XI · Farmacia y Perfumería',
      description: 'Farmacia céntrica con horario extendido frente a la plaza principal. Medicamentos, recetas, primeros auxilios y artículos de cuidado personal.',
      address: 'Av. Nicolás Dávila (frente a Plaza San Martín), Villa Unión',
      badge: 'Farmacia céntrica',
      href: 'https://www.google.com/maps/search/?api=1&query=Farmanor%2C+Nicol%C3%A1s+D%C3%A1vila%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Salud',
      label: 'Farmacia Emanuel',
      description: 'Farmacia y perfumería en Villa Unión. Venta de medicamentos recetados y de venta libre, primeros auxilios, obras sociales y delivery.',
      address: 'Hipólito Yrigoyen (esq. Av. Perón / zona céntrica), Villa Unión',
      phone: '03825-470383',
      badge: 'Farmacia y Perfumería',
      href: 'https://www.google.com/maps/search/?api=1&query=Farmacia+Emanuel%2C+Hip%C3%B3lito+Yrigoyen%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Salud',
      label: 'Farmacia San Luis',
      description: 'Dispensación de medicamentos, recetas, mutuales, artículos de cuidado personal y primeros auxilios en Villa Unión.',
      address: 'Zona centro, Villa Unión, La Rioja',
      phone: '03825-477702',
      badge: 'Farmacia',
      href: 'https://www.google.com/maps/search/?api=1&query=Farmacia+San+Luis%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },

    /* ==========================================================
       BOMBEROS
       ========================================================== */
    {
      category: 'Seguridad',
      label: 'Cuartel de Bomberos Voluntarios',
      description: 'Cuerpo activo de bomberos voluntarios para asistencia ante siniestros, rescates urbanos, apoyo en rutas y emergencias en todo el departamento.',
      address: 'Villa Unión, La Rioja',
      phone: '100',
      badge: 'Emergencias 100',
      href: 'https://www.google.com/maps/search/?api=1&query=Bomberos+Voluntarios%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },

    /* ==========================================================
       BANCOS Y CAJEROS AUTOMÁTICOS
       ========================================================== */
    {
      category: 'Bancos',
      label: 'Banco de la Nación Argentina (BNA)',
      description: 'Sucursal bancaria oficial con cajeros automáticos Red Link activos las 24 horas para extracción de dinero en efectivo y operaciones de débito/crédito.',
      address: 'Joaquín V. González N° 1 (esq. Plaza San Martín), Villa Unión',
      badge: 'Cajeros Link 24 hs',
      href: 'https://www.google.com/maps/search/?api=1&query=Banco+de+la+Naci%C3%B3n+Argentina%2C+Joaqu%C3%ADn+V.+Gonz%C3%A1lez%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Bancos',
      label: 'Banco Rioja · Cajeros Link',
      description: 'Sucursal bancaria provincial con cajeros automáticos Red Link en calle San Martín y punto de cajero adicional en la Terminal de Ómnibus.',
      address: 'San Martín esq. Nicolás Dávila / Terminal de Ómnibus',
      badge: 'Cajeros Link',
      href: 'https://www.google.com/maps/search/?api=1&query=Banco+Rioja%2C+San+Mart%C3%ADn%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },

    /* ==========================================================
       ESTACIONES DE SERVICIO Y COMBUSTIBLE
       ========================================================== */
    {
      category: 'Combustible',
      label: 'YPF Valle del Bermejo (Servicompras 24 hs)',
      description: 'Estación oficial YPF sobre la traza de la Ruta Nacional 76. Combustibles Infinia/Ultra, tienda Servicompras 24 hs, cafetería, agua caliente para termos y hielo.',
      address: 'Ruta Nacional N° 76, Villa Unión, La Rioja',
      badge: 'Combustible y 24 hs',
      href: 'https://www.google.com/maps/search/?api=1&query=YPF%2C+Ruta+Nacional+76%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Combustible',
      label: 'Estación de Servicio Gulf · Minimarket',
      description: 'Estación de servicio sobre la ruta nacional con minimarket, confitería, café, bebidas y artículos para el viajero.',
      address: 'Ruta Nacional N° 76, Villa Unión, La Rioja',
      badge: 'Combustible y Parador',
      href: 'https://www.google.com/maps/search/?api=1&query=Gulf%2C+Ruta+Nacional+76%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },

    /* ==========================================================
       IGLESIAS Y PATRIMONIO HISTÓRICO
       ========================================================== */
    {
      category: 'Iglesias',
      label: 'Parroquia Nuestra Señora del Rosario',
      description: 'Templo histórico y principal iglesia de Villa Unión, construido en 1895. En su interior se destaca un tradicional y valioso Vía Crucis tallado en algarrobo blanco por artesanos locales.',
      address: 'Hipólito Yrigoyen s/n (frente a Plaza San Martín), Villa Unión',
      badge: 'Templo Histórico',
      href: 'https://www.google.com/maps/search/?api=1&query=Parroquia+Nuestra+Se%C3%B1ora+del+Rosario%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },

    /* ==========================================================
       PLAZA PRINCIPAL Y CENTRO
       ========================================================== */
    {
      category: 'Servicios',
      label: 'Plaza Principal San Martín',
      description: 'Corazón urbano y social de Villa Unión. Espacio arbolado rodeado por la parroquia histórica, bancos, confiterías, restaurantes y ferias de artesanos.',
      address: 'Centro urbano de Villa Unión, La Rioja',
      badge: 'Plaza Principal',
      href: 'https://www.google.com/maps/search/?api=1&query=Plaza+San+Mart%C3%ADn%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Servicios',
      label: 'Oficina de Informes Turísticos Municipal',
      description: 'Oficina oficial de la Secretaría de Turismo departamental. Información sobre el Parque Nacional Talampaya, estado de rutas, clima y atractivos del Valle del Bermejo.',
      address: 'Nicolás Dávila Sur, Villa Unión, La Rioja',
      badge: 'Informes Oficiales',
      href: 'https://www.google.com/maps/search/?api=1&query=Secretaria+de+Turismo%2C+Nicol%C3%A1s+D%C3%A1vila+Sur%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Servicios',
      label: 'Terminal de Ómnibus Villa Unión (Larga y Media Distancia)',
      description: 'Punto neurálgico de llegada y salida en ómnibus con servicios diarios hacia La Rioja capital, Chilecito, Patquía, San Juan y conexiones a Córdoba/Buenos Aires (Empresas: 20 de Mayo, Facundo, Arce). Cuenta con boleterías, parador y cajero automático Banco Rioja (Red Link). Recomendamos reservar pasajes con anticipación en fines de semana largos.',
      address: 'Av. Nicolás Dávila Sur s/n, Villa Unión, La Rioja',
      badge: 'Ómnibus y Boleterías',
      href: 'https://www.google.com/maps/search/?api=1&query=Terminal+de+Omnibus%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Servicios',
      label: 'Parada de Taxis y Remises Villa Unión',
      description: 'Servicio de traslados urbanos e interurbanos para desplazamientos dentro de Villa Unión, traslados hacia la Terminal de Ómnibus y viajes hacia localidades cercanas (Banda Florida, Los Palacios, Pagancillo).',
      address: 'Plaza San Martín / Terminal de Ómnibus, Villa Unión',
      badge: 'Traslados Locales',
      href: 'https://www.google.com/maps/search/?api=1&query=Terminal+de+Omnibus%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },

    /* ==========================================================
       SUPERMERCADOS Y COMERCIOS (Sección Comercios)
       ========================================================== */
    {
      category: 'Supermercado',
      label: 'Supermercado El Negro',
      description: 'El autoservicio de referencia más completo de Villa Unión. Cuenta con carnicería, verdulería, fiambrería, almacén y panadería propia con productos frescos.',
      address: 'Ruta Nacional N° 76, Villa Unión',
      badge: 'Completo · Panadería',
      href: 'https://www.google.com/maps/search/?api=1&query=Supermercado+El+Negro%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Supermercado',
      label: 'Supermercado Valeriana',
      description: 'Tradicional comercio de proximidad en el centro de Villa Unión. Almacén completo, fiambrería, carnes, bebidas frías y artículos de primera necesidad.',
      address: 'Zona Céntrica, Villa Unión',
      badge: 'Almacén y Carnes',
      href: 'https://www.google.com/maps/search/?api=1&query=Supermercado+Valeriana%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Supermercado',
      label: 'Supermercado Centro',
      description: 'Autoservicio céntrico ideal para compras cotidianas. Lácteos, bebidas, comestibles, artículos de limpieza y abastecimiento diario.',
      address: 'Nicolás Dávila N° 88, Villa Unión',
      badge: 'Centro',
      href: 'https://www.google.com/maps/search/?api=1&query=Supermercado+Centro%2C+Nicol%C3%A1s+D%C3%A1vila+88%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Supermercado',
      label: 'Valle del Bermejo Autoservicio',
      description: 'Supermercado, cafetería y abastecimiento sobre acceso sur. Muy conveniente para abastecerse antes o después de visitar el Parque Nacional Talampaya.',
      address: 'Ruta Nacional N° 76 – Acceso Sur',
      phone: '3825 479700',
      badge: 'Acceso Sur',
      href: 'https://www.google.com/maps/search/?api=1&query=Valle+del+Bermejo+Autoservicio%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Comercios',
      label: 'Polirubro Santa Bárbara',
      description: 'Polirubro y autoservicio sobre el acceso de ruta. Variedad en bebidas frías, hielo, galletas, snacks, artículos de limpieza y almacén con horario extendido.',
      address: 'Ruta Nacional N° 76 (cerca del ingreso principal)',
      badge: 'Horario extendido',
      href: 'https://www.google.com/maps/search/?api=1&query=Polirubro+Santa+B%C3%A1rbara%2C+Ruta+76%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Comercios',
      label: 'Farmanor XI · Farmacia y Perfumería',
      description: 'Farmacia de cadena frente a la plaza céntrica con horario extendido. Medicamentos, primeros auxilios, perfumería y artículos de cuidado personal.',
      address: 'Av. Nicolás Dávila (frente a Plaza San Martín)',
      badge: 'Farmacia céntrica',
      href: 'https://www.google.com/maps/search/?api=1&query=Farmanor%2C+Nicol%C3%A1s+D%C3%A1vila%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Comercios',
      label: 'Farmacia Emanuel',
      description: 'Farmacia y perfumería céntrica. Medicamentos, primeros auxilios, artículos para bebés, perfumería y delivery en Villa Unión.',
      address: 'Hipólito Yrigoyen (esq. Av. Perón), Villa Unión',
      phone: '03825-470383',
      badge: 'Farmacia y Perfumería',
      href: 'https://www.google.com/maps/search/?api=1&query=Farmacia+Emanuel%2C+Hip%C3%B3lito+Yrigoyen%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Comercios',
      label: 'Farmacia San Luis',
      description: 'Medicamentos, recetas, atención de obras sociales, perfumería y atención farmacéutica en Villa Unión.',
      address: 'Zona centro, Villa Unión, La Rioja',
      phone: '03825-477702',
      badge: 'Farmacia',
      href: 'https://www.google.com/maps/search/?api=1&query=Farmacia+San+Luis%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Comercios',
      label: 'YPF Servicompras (24 horas)',
      description: 'Tienda de conveniencia abierta las 24 horas y combustible sobre la ruta. Bebidas frías, hielo, agua caliente para termos, cafetería, alfajores y minutas.',
      address: 'Ruta Nacional N° 76, Villa Unión',
      badge: 'Combustible y 24 hs',
      href: 'https://www.google.com/maps/search/?api=1&query=YPF%2C+Ruta+Nacional+76%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Comercios',
      label: 'Estación de Servicio Gulf · Minimarket',
      description: 'Estación de servicio con tienda de conveniencia, confitería, café, bebidas y artículos para el viajero sobre la ruta nacional.',
      address: 'Ruta Nacional N° 76, Villa Unión',
      badge: 'Combustible y Parador',
      href: 'https://www.google.com/maps/search/?api=1&query=Gulf%2C+Ruta+Nacional+76%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Comercios',
      label: 'Bebidas y Almacén Quilpe',
      description: 'Distribución y venta directa de bebidas, gaseosas, aguas minerales, vinos regionales y productos de almacén.',
      address: 'Calle Ing. Lorenz, Villa Unión',
      badge: 'Bebidas',
      href: 'https://www.google.com/maps/search/?api=1&query=Quilpe%2C+Ingeniero+Lorenz%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
  ],
  recommendations: [
    /* ==========================================================
       GASTRONOMÍA (Fuente: Folleto Felipe Varela Servicios Turísticos)
       ========================================================== */
    {
      category: 'Gastronomía',
      label: '1833 Bistró',
      description: 'Restaurante con propuesta gourmet y cocina regional.',
      address: 'Hipólito Irigoyen N° 13, Villa Unión',
      phone: '3825 80529',
      badge: 'Recomendado',
      href: 'https://www.google.com/maps/search/?api=1&query=1833+Bistr%C3%B3%2C+Hip%C3%B3lito+Irigoyen+13%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'Campo Base',
      description: 'Restaurante, platos sabrosos, minutas y ambiente distendido.',
      address: 'Av. Nicolás Dávila Sur s/n, Villa Unión',
      phone: '3825 671014',
      badge: 'Recomendado',
      href: 'https://www.google.com/maps/search/?api=1&query=Campo+Base%2C+Av+Nicol%C3%A1s+D%C3%A1vila+Sur%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'Ruta 40',
      description: 'Parrilla tradicional y cocina criolla sobre el cruce de rutas.',
      address: 'Ruta Nac. N° 76 y Ruta Nac. N° 40, Villa Unión',
      phone: '3825 410686',
      badge: 'Parrilla',
      href: 'https://www.google.com/maps/search/?api=1&query=Parrilla+Ruta+40%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'El Regiomontano',
      description: 'Parrilla tradicional con variedad de cortes y cocina local.',
      address: 'Av. Nicolás Dávila Sur s/n, Villa Unión',
      phone: '3825 416894',
      badge: 'Parrilla',
      href: 'https://www.google.com/maps/search/?api=1&query=El+Regiomontano+Parrilla%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'Don Edgardo',
      description: 'Restaurante de cocina tradicional sobre acceso sur.',
      address: 'Ruta Nac. N° 76 Km 204 – Acceso Sur, Villa Unión',
      phone: '3825 523752',
      href: 'https://www.google.com/maps/search/?api=1&query=Restaurante+Don+Edgardo%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'Doña Paula',
      description: 'Comedor casero y comida criolla.',
      address: 'Hipólito Irigoyen casi esq. Ing. Bolloli, Villa Unión',
      phone: '3825 552568',
      badge: 'Comedor',
      href: 'https://www.google.com/maps/search/?api=1&query=Comedor+Do%C3%B1a+Paula%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'Guadalupe',
      description: 'Resto-Bar, pizzería, minutas y comidas al paso.',
      address: 'San Martín esq. Honorato Guerrero, Villa Unión',
      phone: '3825 674569',
      badge: 'Resto-Bar / Pizzería',
      href: 'https://www.google.com/maps/search/?api=1&query=Guadalupe+Resto+Bar%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'La Palmera',
      description: 'Restaurante clásico riojano con amplia carta regional.',
      address: 'Ruta Nac. N° 76 y Ruta Nac. N° 40, Villa Unión',
      phone: '3804 278216',
      href: 'https://www.google.com/maps/search/?api=1&query=Restaurante+La+Palmera%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'Sabores Riojanos',
      description: 'Comedor regional, empanadas y minutas.',
      address: 'Bvar. Illanes 50, Villa Unión',
      phone: '3825 614576',
      badge: 'Comedor',
      href: 'https://www.google.com/maps/search/?api=1&query=Sabores+Riojanos%2C+Bvar+Illanes+50%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'La Parroquia',
      description: 'Confitería, cafetería y minutas en el centro.',
      address: 'Hipólito Irigoyen, Villa Unión',
      phone: '3825 676738',
      badge: 'Confitería',
      href: 'https://www.google.com/maps/search/?api=1&query=Confiter%C3%ADa+La+Parroquia%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'De la Cruz',
      description: 'Coffee-bar y punto de encuentro céntrico.',
      address: 'Hipólito Irigoyen, Villa Unión',
      phone: '3825 459166',
      badge: 'Coffee-Bar',
      href: 'https://www.google.com/maps/search/?api=1&query=De+la+Cruz+Coffee+Bar%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'Sabores de Casa',
      description: 'Rotisería con platos listos para llevar.',
      address: 'Av. Nicolás Dávila Norte s/n, Villa Unión',
      phone: '3825 674450',
      badge: 'Rotisería',
      href: 'https://www.google.com/maps/search/?api=1&query=Sabores+de+Casa+Rotiseria%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'La Nona',
      description: 'Rotisería tradicional con comidas caseras para retirar.',
      address: 'San Martín s/n, Villa Unión',
      phone: '3825 418281',
      badge: 'Rotisería',
      href: 'https://www.google.com/maps/search/?api=1&query=Rotiseria+La+Nona%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'La Terminal',
      description: 'Resto-bar ubicado en la terminal de ómnibus local.',
      address: 'Terminal de Ómnibus, Villa Unión',
      phone: '3825 459242',
      badge: 'Resto-Bar',
      href: 'https://www.google.com/maps/search/?api=1&query=Terminal+de+Omnibus%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'Cañón del Talampaya',
      description: 'Restaurante con servicio gastronómico sobre el acceso sur.',
      address: 'Ruta Nacional N° 76 – Acceso Sur, Villa Unión',
      phone: '3825 470753',
      href: 'https://www.google.com/maps/search/?api=1&query=Restaurante+Ca%C3%B1on+del+Talampaya%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'Pircas Negras',
      description: 'Restaurante abierto al público con opciones regionales y de autor.',
      address: 'Ruta Nacional N° 76 – Acceso Sur, Villa Unión',
      phone: '3825 470611',
      href: 'https://www.google.com/maps/search/?api=1&query=Restaurante+Pircas+Negras%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'Don Remo',
      description: 'Restaurante y comedor tradicional en Barrio San José.',
      address: 'Av. Nicolás Dávila – B° San José, Villa Unión',
      phone: '3825 576315',
      href: 'https://www.google.com/maps/search/?api=1&query=Don+Remo+Restaurante%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'DAPSA Restaurante',
      description: 'Restaurante y cafetería de parador céntrico.',
      address: 'Hipólito Yrigoyen esq. Joaquín V. González, Villa Unión',
      badge: 'Parador',
      href: 'https://www.google.com/maps/search/?api=1&query=Dapsa%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },

    /* ==========================================================
       BODEGAS Y SABORES (Fuente: Bodegas Felipe Varela + Guía)
       ========================================================== */
    {
      category: 'Bodegas',
      label: 'Bodega Familia Sacavino Arrieta',
      description: 'Bodega exclusiva de Torrontés Riojano en Los Palacios. Visita guiada por viñedos y bodega, tapeo y venta de vinos.',
      address: 'Calle Principal, Los Palacios (a 6 km de Villa Unión)',
      reservationPhone: '+54 9 351 618 6283',
      badge: 'Torrontés Riojano',
      href: 'https://www.google.com/maps/search/?api=1&query=Bodega+Sacavino+Arrieta%2C+Los+Palacios%2C+La+Rioja',
    },
    {
      category: 'Bodegas',
      label: 'Bodega Haras San José',
      description: 'Complejo enoturístico con vinos artesanales, degustaciones guiadas y venta directa.',
      address: 'Ruta Nacional N° 76 - Pasaje Los Minué - Barrio San José, Villa Unión',
      reservationPhone: '+54 9 3825 66 9382',
      phone: '3825 437402',
      email: 'info@harassanjose.com.ar',
      web: 'https://www.harassanjose.com.ar',
      badge: 'Enoturismo',
      href: 'https://www.google.com/maps/search/?api=1&query=Haras+San+Jos%C3%A9%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Bodegas',
      label: 'Bodega Aicuña',
      description: 'Vino artesanal de altura en el pintoresco pueblo de Aicuña. Visita técnica, degustación y venta directa.',
      address: 'Ruta Prov. N° 17 (a 1 km del arco de entrada), Aicuña',
      reservationPhone: '+54 9 3825 45 6563',
      badge: 'Vinos de altura',
      href: 'https://www.google.com/maps/search/?api=1&query=Bodega+Aicu%C3%B1a%2C+La+Rioja',
    },
    {
      category: 'Bodegas',
      label: 'Bodega Cooperativa La Riojana',
      description: 'Vinos premiados, visita guiada por instalaciones y salón de degustación.',
      address: 'Ruta Nacional N° 76, Villa Unión',
      reservationPhone: '+54 9 3825 67 5313',
      href: 'https://www.google.com/maps/search/?api=1&query=Cooperativa+La+Riojana%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Bodegas',
      label: 'Bodega Otra Vuelta',
      description: 'Vino artesanal en Banda Florida con atención cálida y personalizada.',
      address: 'Calle Sarmiento s/n, Banda Florida',
      reservationPhone: '+54 9 341 202 0061',
      badge: 'Vino artesanal',
      href: 'https://www.google.com/maps/search/?api=1&query=Bodega+Otra+Vuelta%2C+Banda+Florida%2C+La+Rioja',
    },
    {
      category: 'Bodegas',
      label: 'Bodega Las Jarillas',
      description: 'Vinos artesanales y comedor regional en el histórico pueblo de Guandacol.',
      address: 'Mariano Moreno s/n, Guandacol',
      reservationPhone: '+54 9 11 5635 5341',
      badge: 'Guandacol',
      href: 'https://www.google.com/maps/search/?api=1&query=Bodega+Las+Jarillas%2C+Guandacol%2C+La+Rioja',
    },
    {
      category: 'Bodegas',
      label: 'Bodega Tres Cruces',
      description: 'Visita guiada por viñedos, degustación, venta de vinos y gastronomía regional.',
      address: 'Calle La Hacienda s/n, Villa Unión',
      reservationPhone: '+54 9 3825 67 8003',
      href: 'https://www.google.com/maps/search/?api=1&query=Bodega+Tres+Cruces%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },

    /* ==========================================================
       ARTESANÍAS Y REGIONALES (Fuente: Folleto Servicios Turísticos)
       ========================================================== */
    {
      category: 'Artesanías',
      label: 'Teleras Tradicionales de Palo Plantado',
      description: 'Emblemático grupo de maestras teleras que mantienen vivo el tejido criollo ancestral en telar horizontal, hilado a mano en huso y rueca con pura lana de oveja y tintes naturales autóctonos (jarilla, algarrobo y cáscara de nuez). Mantas, ponchos y caminos rústicos de colección.',
      address: 'Palo Plantado (sobre RP, a 15 km de Villa Unión)',
      badge: 'Patrimonio Textil Criollo',
      href: 'https://www.google.com/maps/search/?api=1&query=Palo+Plantado%2C+La+Rioja',
    },
    {
      category: 'Artesanías',
      label: 'Regionales del Oeste',
      description: 'Dulces caseros, nueces, alfajores, vinos y artesanías locales sobre el cruce de rutas.',
      address: 'Intersección Ruta Nac. N° 76 y Ruta Nac. N° 40, Villa Unión',
      phone: '3825 660792',
      badge: 'Productos regionales',
      href: 'https://www.google.com/maps/search/?api=1&query=Regionales+del+Oeste%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Artesanías',
      label: 'Regionales Don Dámaso',
      description: 'Elaboración tradicional de dulces, conservas y productos del Bermejo.',
      address: 'Ruta Nac. N° 76 Km 111, Villa Unión',
      phone: '3804 370745',
      href: 'https://www.google.com/maps/search/?api=1&query=Regionales+Don+Damaso%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Artesanías',
      label: 'La Salamanca',
      description: 'Tejidos en telar, cerámicas y productos autóctonos frente a la plaza.',
      address: 'Joaquín V. González frente a la Plaza San Martín, Villa Unión',
      href: 'https://www.google.com/maps/search/?api=1&query=La+Salamanca%2C+Joaqu%C3%ADn+V+Gonz%C3%A1lez%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Artesanías',
      label: 'El Infiernillo',
      description: 'Artículos regionales, recuerdos y artesanías en cuero y madera.',
      address: 'San Martín s/n frente a Plaza San Martín, Villa Unión',
      href: 'https://www.google.com/maps/search/?api=1&query=El+Infiernillo%2C+San+Mart%C3%ADn%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },

    /* ==========================================================
       CAMPINGS Y RECREACIÓN (Fuente: Folleto Servicios Turísticos)
       ========================================================== */
    {
      category: 'Campings',
      label: 'Camping Liz Grey',
      description: 'Camping y pileta a 1 cuadra de la plaza principal de Villa Unión.',
      address: 'Pasaje Albornoz s/n, Villa Unión',
      phone: '3804 589741',
      badge: 'Pileta y sombra',
      href: 'https://www.google.com/maps/search/?api=1&query=Camping+Liz+Grey%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Campings',
      label: 'Camping El Puente',
      description: 'Predio arbolado con pileta para pasar el día y acampar en Los Palacios.',
      address: 'Calle Principal, Los Palacios',
      phone: '3825 550504',
      badge: 'Los Palacios',
      href: 'https://www.google.com/maps/search/?api=1&query=Camping+El+Puente%2C+Los+Palacios%2C+La+Rioja',
    },
    {
      category: 'Campings',
      label: 'Camping El Establo',
      description: 'Espacio de recreación al aire libre con pileta y asadores.',
      address: 'Calle La Hacienda s/n, Villa Unión',
      phone: '3825 670770',
      href: 'https://www.google.com/maps/search/?api=1&query=Camping+El+Establo%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Campings',
      label: 'El Viejo Carretón',
      description: 'Camping y espacio verde sobre el acceso sur.',
      address: 'Ruta 76 acceso sur Km 202, Villa Unión',
      phone: '3825 606944',
      email: 'elviejocarreton26@gmail.com',
      href: 'https://www.google.com/maps/search/?api=1&query=El+Viejo+Carreton%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },

    /* ==========================================================
       AGENCIAS DE VIAJE Y EXCURSIONES (Fuente: goaventura.com.ar + Servicios Turísticos)
       ========================================================== */
    {
      category: 'Excursiones',
      label: 'Go Aventura · Excursiones en 4x4',
      description: 'Agencia de viajes habilitada (Leg. 20019). Especialistas en turismo de naturaleza y circuitos de aventura en 4x4 con guías profesionales: Reserva Provincial Laguna Brava a 4.300 msnm (fauna autóctona, flamencos y refugios históricos), Parque Nacional Talampaya (Cañón de Talampaya, Arco Iris y Ciudad Perdida), Cañón del Triásico en Banda Florida y Cuesta de Miranda.',
      address: 'San Martín s/n, Villa Unión, La Rioja',
      phone: '5493825526275',
      reservationPhone: '+54 9 3825 52-6275',
      email: 'info@goaventura.com.ar',
      web: 'https://goaventura.com.ar/viajes',
      badge: 'Recomendado',
      href: 'https://www.google.com/maps/search/?api=1&query=Go+Aventura%2C+San+Mart%C3%ADn%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Excursiones',
      label: 'Go Aventura · Transfers Privados',
      description: 'Servicio de traslados seguros y confiables en el Valle del Bermejo: traslados in/out desde y hacia aeropuertos de La Rioja, San Juan y Catamarca, transfer directo al Parque Nacional Talampaya y transporte exclusivo para grupos y huéspedes.',
      address: 'San Martín s/n, Villa Unión, La Rioja',
      phone: '5493825526275',
      reservationPhone: '+54 9 3825 52-6275',
      email: 'info@goaventura.com.ar',
      web: 'https://goaventura.com.ar/viajes?filter=Transfer',
      badge: 'Recomendado',
      href: 'https://www.google.com/maps/search/?api=1&query=Go+Aventura%2C+San+Mart%C3%ADn%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Excursiones',
      label: 'DS Uno Viajes',
      description: 'Agencia de viajes habilitada (Leg. 13.278) con salidas turísticas y excursiones por la región.',
      address: 'Nicolás Dávila N° 60, Villa Unión',
      phone: '3804 560844',
      reservationPhone: '+54 9 380 456-0844',
      badge: 'Recomendado',
      href: 'https://www.google.com/maps/search/?api=1&query=DS+Uno+Viajes%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Excursiones',
      label: 'Cuesta de Miranda E.V.T',
      description: 'Agencia de viajes y turismo receptivo (Leg. 18.095). Salidas y excursiones al Bermejo.',
      address: 'San Martín s/n, Villa Unión',
      phone: '3825 677330',
      email: 'info@talampayaok.com',
      web: 'https://www.talampayaok.com',
      badge: 'Leg. 18.095',
      href: 'https://www.google.com/maps/search/?api=1&query=Cuesta+de+Miranda+EVT%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Excursiones',
      label: 'Samay Rioja',
      description: 'Viajes y turismo receptivo (Leg. 17.965). Circuitos en la provincia.',
      address: 'Ing. Bolloli s/n, Villa Unión',
      phone: '3825 677701',
      badge: 'Leg. 17.965',
      href: 'https://www.google.com/maps/search/?api=1&query=Samay+Rioja%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Excursiones',
      label: 'Runacay Servicios E.V.T',
      description: 'Turismo de encuentro y excursiones por la región (Leg. 13.232).',
      address: 'Joaquín V. González frente a la plaza, Villa Unión',
      phone: '3804 790000',
      email: 'runacay.evt@gmail.com',
      web: 'https://www.runacay.tur.ar',
      badge: 'Leg. 13.232',
      href: 'https://www.google.com/maps/search/?api=1&query=Runacay+Servicios+EVT%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Excursiones',
      label: 'Cuesta Vieja',
      description: 'Agencia de viajes y servicios turísticos (Leg. 13.375).',
      address: 'Dr. Eduardo Páez s/n, Villa Unión',
      phone: '3825 618425',
      badge: 'Leg. 13.375',
      href: 'https://www.google.com/maps/search/?api=1&query=Cuesta+Vieja+EVT%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Excursiones',
      label: 'Volterra',
      description: 'Concesionario de servicios turísticos del Parque Nacional Talampaya (Leg. 13.232).',
      address: 'San Martín 80, Villa Unión',
      phone: '0351 5709909',
      badge: 'PN Talampaya',
      href: 'https://www.google.com/maps/search/?api=1&query=Volterra%2C+San+Mart%C3%ADn+80%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Excursiones',
      label: 'Viví Viajando',
      description: 'Agencia de viajes con excursiones regionales (Leg. 14.19).',
      address: 'Juan D. Perón esq. Hipólito Irigoyen, Villa Unión',
      phone: '3825 416894',
      badge: 'Leg. 14.19',
      href: 'https://www.google.com/maps/search/?api=1&query=Vivi+Viajando+Agencia%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Excursiones',
      label: 'Triásico Aventura EVT',
      description: 'Excursiones en 4x4 y circuitos de aventura (Leg. 19.032).',
      address: 'Ruta N° 76 y Ruta N° 40, Villa Unión',
      phone: '3825 660792',
      badge: 'Leg. 19.032',
      href: 'https://www.google.com/maps/search/?api=1&query=Triasico+Aventura+EVT%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Excursiones',
      label: 'Runamayu · Turismo Aventura',
      description: 'Operador receptivo habilitado con amplia trayectoria en expediciones 4x4, trekking por cañones andinos, travesías guiadas al Cráter Corona del Inca y circuitos de alta montaña en el Bermejo.',
      address: 'Villa Unión, La Rioja',
      badge: 'Aventura y 4x4',
      href: 'https://www.google.com/maps/search/?api=1&query=Runamayu%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Excursiones',
      label: 'Cooperativa de Trabajo Talampaya',
      description: 'Asociación cooperativa de guías y transportistas locales habilitados para excursiones regulares, traslados al Parque Nacional Talampaya y paseos departamentales.',
      address: 'Villa Unión / Acceso a Talampaya, La Rioja',
      badge: 'Prestador Habilitado',
      href: 'https://www.google.com/maps/search/?api=1&query=Cooperativa+Talampaya%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Excursiones',
      label: 'Argentina Paisajes Viajes y Turismo',
      description: 'Agencia de viajes y turismo receptivo habilitada (Leg. 20.057). Salidas programadas por el corredor del Bermejo, Cuesta de Miranda y paquetes regionales.',
      address: 'Villa Unión, La Rioja',
      badge: 'Leg. 20.057',
      href: 'https://www.google.com/maps/search/?api=1&query=Argentina+Paisajes%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },

    /* ==========================================================
       ATRACTIVOS TURÍSTICOS (Fuente: Folletos y Estadísticas Oficiales Dpto. Gral. Felipe Varela)
       ========================================================== */
    {
      category: 'Atractivos',
      label: 'Parque Nacional Talampaya',
      description: 'Patrimonio Natural de la Humanidad UNESCO y una de las 7 Maravillas Naturales de Argentina. Imponentes murallones rojizos de 150 m, cañones geológicos, petroglifos milenarios, fauna andina y excursiones al Cañón de Talampaya, Quebrada de Don Eduardo, Safari Arco Iris y Ciudad Perdida.',
      address: 'RN 76 km 148 (a 59 km de Villa Unión)',
      badge: 'Top #1 Visitas · UNESCO',
      href: 'https://www.google.com/maps/search/?api=1&query=-29.784404%2C-67.993831',
      web: 'https://talampaya.com',
    },
    {
      category: 'Atractivos',
      label: 'Angelito Milagroso (Miguel Ángel Gaitán)',
      description: 'Mausoleo y centro de devoción popular de Miguel Ángel Gaitán en el cementerio de Villa Unión. Es el contenido y atractivo de fe más consultado del departamento: miles de promeseros y viajeros de todo el país se acercan a diario para agradecer favores y dejar flores, juguetes y placas recordatorias.',
      address: 'Cementerio municipal de Villa Unión (a 10 cuadras del centro)',
      badge: 'Top #1 Devoción y Fe Popular',
      href: 'https://www.google.com/maps/search/?api=1&query=-29.3059111%2C-68.2273528',
    },
    {
      category: 'Atractivos',
      label: 'Vallecito Encantado',
      description: 'Fascinante paisaje lunar sobre la Quebrada del Bermejo con tonalidades multicolores y esculturas naturales talladas por la erosión milenaria: la Copa del Mundo, El Sombrero, El Barco y El Perfil del Indio.',
      address: 'RN 40 km 3768 (entre Villa Unión y Guandacol)',
      badge: 'Top Visitas · Geoformas RN 40',
      href: 'https://www.google.com/maps/search/?api=1&query=-29.52%2C-68.45',
    },
    {
      category: 'Atractivos',
      label: 'Cañón del Triásico',
      description: 'Aventura geológica de 250 millones de años en la Reserva Cerros Colorados. Laberintos de arenisca roja, cárcavas y miradores panorámicos. Excursiones guiadas en vehículos 4x4, senderismo diurno y salidas de astroturismo nocturno bajo cielos pristinos.',
      address: 'Banda Florida (a 5 km de Villa Unión)',
      badge: 'Top Aventura 4x4 y Astroturismo',
      href: 'https://www.google.com/maps/search/?api=1&query=-29.2857832%2C-68.2614131',
    },
    {
      category: 'Atractivos',
      label: 'Cañón de Anchumbil',
      description: 'Conocido como el "pequeño Talampaya": laberintos de roca rojiza esculpidos por el agua y el viento, vertientes naturales de agua dulce, vegetación autóctona y antiguas pinturas rupestres en un entorno íntimo ideal para trekking.',
      address: 'A 7 km al este de Villa Unión',
      badge: 'Top Trekking y Pinturas Rupestres',
      href: 'https://www.google.com/maps/search/?api=1&query=-29.2904472%2C-68.1661487',
    },
    {
      category: 'Atractivos',
      label: 'Cuesta de Miranda',
      description: 'Uno de los tramos escénicos más bellos de la Argentina: 12 km de cornisa totalmente pavimentada con miradores espectaculares y cumbre en Bordo Atravesado a 2.040 msnm, serpenteando entre quebradas rojizas y el cauce del río Miranda.',
      address: 'RN 40 (tramo Villa Unión - Chilecito)',
      badge: 'Camino Escénico (2.040 msnm)',
      href: 'https://www.google.com/maps/search/?api=1&query=-29.3430926%2C-67.7621978',
    },
    {
      category: 'Atractivos',
      label: 'Mirador La Loma',
      description: 'Emblemático mirador urbano accesible mediante una escalinata de 136 peldaños con el monumento a la Virgen en su cumbre. Ofrece una vista panorámica 360° inigualable de la ciudad, los viñedos, el valle del río Bermejo y el imponente Cordón del Famatina.',
      address: 'A 5 cuadras de la plaza principal, Villa Unión',
      badge: 'Vista Panorámica 360°',
      href: 'https://www.google.com/maps/search/?api=1&query=-29.3144444%2C-68.2230889',
    },
    {
      category: 'Atractivos',
      label: 'Embalse Lateral',
      description: 'Gran espejo de agua y pulmón verde a minutos del centro, rodeado de serranías coloradas. Punto de encuentro tradicional para caminatas al atardecer, avistamiento de aves acuáticas, kayak y pesca deportiva de pejerrey.',
      address: 'Costanera de La Loma, Villa Unión',
      badge: 'Paseo Náutico y Pesca',
      href: 'https://www.google.com/maps/search/?api=1&query=-29.3032746%2C-68.2228968',
    },
    {
      category: 'Atractivos',
      label: 'Monumento Natural Cerro Bola',
      description: 'Singular plegamiento geológico doble que semeja una inmensa esfera partida emergiendo de la serranía. Hito paisajístico emblemático sobre la mítica Ruta Nacional 40, declarado área de protección geológica.',
      address: 'RN 40 (cercano al Vallecito Encantado)',
      badge: 'Monumento Geológico',
      href: 'https://www.google.com/maps/search/?api=1&query=-29.5204481%2C-68.3898283',
    },
    {
      category: 'Atractivos',
      label: 'Banda Florida y Petroglifos',
      description: 'Aldea tradicional al otro lado del río Bermejo protegida por farallones rojos. Famosa por sus senderos con petroglifos milenarios de culturas originarias, bodegas familiares, nogales, acequias y talleres de artesanías.',
      address: 'A 3 km de Villa Unión cruzando el Río Bermejo',
      badge: 'Cultura y Petroglifos',
      href: 'https://www.google.com/maps/search/?api=1&query=-29.3000%2C-68.2400',
    },
    {
      category: 'Atractivos',
      label: 'Aicuña',
      description: 'Mágico poblado precordillerano a 1.600 msnm resguardado entre quebradas. Conserva arquitectura tradicional de adobe, acequias coloniales con agua de vertiente, nogales centenarios, microclima templado y producción artesanal de nueces y vinos.',
      address: 'Acceso por RP 17 desde RN 76 (a 60 km de Villa Unión)',
      badge: 'Pueblo Tradicional de Adobe',
      href: 'https://www.google.com/maps/search/?api=1&query=-29.4485929%2C-67.8313983',
    },
    {
      category: 'Atractivos',
      label: 'Guandacol y Casa del Gral. Felipe Varela',
      description: 'Tierra de caudillos e historia federal al sur del departamento: visitá el solar histórico de adobe y algarrobo del General Felipe Varela, el santuario popular de Pancho de la Cuchilla, la centenaria iglesia de San Nicolás, olivares históricos y bodegas familiares artesanales.',
      address: 'Guandacol (a 45 km al sur de Villa Unión por RN 40)',
      badge: 'Historia y Caudillos',
      href: 'https://www.google.com/maps/search/?api=1&query=-29.5245519%2C-68.5584428',
    },
    {
      category: 'Atractivos',
      label: 'Casona de Los Fajardo (Santa Clara)',
      description: 'Monumento del turismo rural comunitario y la memoria artesanal riojana: taller centenario de tejido criollo en telar de doble faz, con hilado a mano y técnicas ancestrales de teñido natural con frutos y hierbas autóctonas.',
      address: 'Localidad de Santa Clara (al sur de Guandacol)',
      badge: 'Turismo Rural y Telar Criollo',
      href: 'https://www.google.com/maps/search/?api=1&query=-29.5585417%2C-68.5511722',
    },
    {
      category: 'Atractivos',
      label: 'Pagancillo Viejo y Circuito Rural',
      description: 'Encantador pueblo rural previo al ingreso al Parque Nacional Talampaya; cuenta con callejones antiguos de adobe, el mirador El Calvario con más de 100 años de devoción religiosa, paseos a caballo y puestos de alfajores y dulces regionales.',
      address: 'A 30 km de Villa Unión por RN 76',
      badge: 'Portal a Talampaya',
      href: 'https://www.google.com/maps/search/?api=1&query=-29.5447%2C-68.0400',
    },
    {
      category: 'Atractivos',
      label: 'Los Palacios',
      description: 'Cuna del Vino Artesanal riojano a 6 km de Villa Unión: pintoresco poblado agrícola arbolado con acequias, sede del Festival Nacional del Vino Patero y productores familiares de Torrontés con venta directa.',
      address: 'A 6 km de Villa Unión sobre RN 76',
      badge: 'Cuna del Vino Patero',
      href: 'https://www.google.com/maps/search/?api=1&query=Los+Palacios%2C+La+Rioja',
    },
    {
      category: 'Atractivos',
      label: 'Reserva Provincial Laguna Brava',
      description: 'Excursión cordillerana a 4.200 msnm protegida como Sitio Ramsar internacional. Majestuosas lagunas salobres andinas pobladas por flamencos rosados, vicuñas en libertad, volcanes de más de 6.000 m y refugios históricos de arrieros de piedra del siglo XIX (requiere guía habilitado).',
      address: 'Vinchina / Cordillera de los Andes',
      badge: 'Alta Montaña (4.200 msnm)',
      href: 'https://www.google.com/maps/search/?api=1&query=-28.3523739%2C-68.8695066',
    },
    {
      category: 'Atractivos',
      label: 'Cráter Corona del Inca',
      description: 'Impresionante laguna navegable de azul zafiro a 5.500 msnm dentro del cráter de un coloso volcánico andino. Una de las travesías 4x4 más altas y extremas del mundo, rodeada por los picos Monte Pissis y Bonete Chico (operativa de diciembre a abril con agencia habilitada).',
      address: 'Alta Cordillera riojana (exclusivo 4x4 guiada)',
      badge: 'Top 4x4 Extrema (5.500 msnm)',
      href: 'https://www.google.com/maps/search/?api=1&query=-27.91%2C-68.82',
    },
    {
      category: 'Atractivos',
      label: 'Quebrada de La Troya y La Pirámide',
      description: 'Impactante cañón geológico donde el río Vinchina corta estratos rocosos rojizos y ocres de millones de años. En el recorrido destaca La Pirámide, una geoforma geométrica casi perfecta esculpida por el viento.',
      address: 'RN 76 (entre Villa Castelli y Vinchina)',
      badge: 'Paso Cordillerano Escénico',
      href: 'https://www.google.com/maps/search/?api=1&query=-28.7242821%2C-68.2636496',
    },
    {
      category: 'Atractivos',
      label: 'Reserva Cerro El Toro y Fortaleza',
      description: 'Fortaleza defensiva y centro ceremonial de la cultura Aguada a 1.600 msnm en Villa Castelli. Cuenta con centro de visitantes, miradores panorámicos del valle del Bermejo y senderos arqueológicos de pircas prehispánicas.',
      address: 'Villa Castelli, Dpto. General Lamadrid',
      badge: 'Arqueología Precolombina',
      href: 'https://www.google.com/maps/search/?api=1&query=-28.999301%2C-68.2029905',
    },
    {
      category: 'Atractivos',
      label: 'Mina La Mejicana y Cañón del Ocre',
      description: 'Monumento histórico nacional en la Sierra de Famatina a más de 4.400 msnm: legendaria mina de oro conectada por el cablecarril más largo y alto del mundo, junto al asombroso Cañón del Ocre con aguas teñidas de amarillo oro por minerales naturales.',
      address: 'Sierra de Famatina (excursión 4x4 habilitada)',
      badge: 'Historia Minera y Montaña',
      href: 'https://www.google.com/maps/search/?api=1&query=-29.0119888%2C-67.7755594',
    },
  ],
};
