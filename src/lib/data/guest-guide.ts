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
  href: string;
  category: 'Salud' | 'Supermercado' | 'Seguridad' | 'Servicios';
}

export type RecommendationCategory =
  | 'Gastronomía'
  | 'Bodegas'
  | 'Artesanías'
  | 'Localidades'
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
    'https://www.google.com/maps/d/viewer?mid=1F3VQHqOqyy6tlGwqeVPG6ExZXu4snwY&ll=-29.539943300244904%2C-68.10310008030167&z=9',
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
    {
      category: 'Salud',
      label: 'Hospital Dr. Eduardo Neira',
      description: 'Atención de salud y emergencias médicas en Villa Unión.',
      address: 'Villa Unión, La Rioja',
      phone: '107',
      href: 'https://www.google.com/maps/search/?api=1&query=Hospital+Dr.+Eduardo+Neira%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Salud',
      label: 'Farmacias de turno en Villa Unión',
      description: 'Consultá ubicación y turnos vigentes antes de trasladarte.',
      address: 'Centro comercial Villa Unión',
      href: 'https://www.google.com/maps/search/?api=1&query=farmacia%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Supermercado',
      label: 'Supermercado El Negro',
      description: 'Alimentos, bebidas, panificados frescos y artículos de primera necesidad.',
      address: 'Villa Unión centro',
      href: 'https://www.google.com/maps/search/?api=1&query=Supermercado+El+Negro%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Supermercado',
      label: 'Valle del Bermejo Autoservicio',
      description: 'Supermercado, cafetería y abastecimiento sobre acceso sur.',
      address: 'Ruta Nacional N° 76 – Acceso Sur',
      phone: '3825 479700',
      href: 'https://www.google.com/maps/search/?api=1&query=Valle+del+Bermejo+Autoservicio%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Seguridad',
      label: 'Comisaría Villa Unión',
      description: 'Destacamento policial del Valle del Bermejo.',
      address: 'Villa Unión, La Rioja',
      phone: '101',
      href: 'https://www.google.com/maps/search/?api=1&query=Comisar%C3%ADa+Villa+Uni%C3%B3n%2C+La+Rioja',
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
      label: 'Regionales del Oeste',
      description: 'Dulces caseros, nueces, alfajores, vinos y artesanías locales sobre el cruce de rutas.',
      address: 'Intersección Ruta Nac. N° 76 y Ruta Nac. N° 40, Villa Unión',
      phone: '3825 660792',
      badge: 'Productos regionales',
      href: 'https://www.google.com/maps/search/?api=1&query=Regionales+del+Oeste%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Artesanías',
      label: 'Regionales Milor',
      description: 'Productos típicos riojanos, tejidos y recuerdos frente a la plaza principal.',
      address: 'San Martín s/n (frente a Plaza Principal), Villa Unión',
      phone: '3825 666801',
      badge: 'Centro cívico',
      href: 'https://www.google.com/maps/search/?api=1&query=Regionales+Milor%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
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
       AGENCIAS DE VIAJE Y EXCURSIONES (Fuente: Servicios Turísticos)
       ========================================================== */
    {
      category: 'Excursiones',
      label: 'Go Aventura',
      description: 'Excursiones guiadas en 4x4: Talampaya (Cañón, Arco Iris, Ciudad Perdida), Cañón del Triásico, Laguna Brava y transfers privados.',
      phone: '5493804509885',
      badge: 'Exclusivo huéspedes',
      href: 'https://goaventura.com.ar/viajes',
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
      label: 'DS Uno Viajes',
      description: 'Agencia de viajes habilitada (Leg. 13.278) con salidas turísticas.',
      address: 'Nicolás Dávila N° 60, Villa Unión',
      phone: '3804 560844',
      badge: 'Leg. 13.278',
      href: 'https://www.google.com/maps/search/?api=1&query=DS+Uno+Viajes%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
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

    /* ==========================================================
       LOCALIDADES PARA DESCUBRIR (Fuente: Corredor del Bermejo)
       ========================================================== */
    {
      category: 'Localidades',
      label: 'Banda Florida',
      description: 'Cruzando el río Bermejo: paredones de arenisca roja, senderismo, petroglifos milenarios, bodegas y talleres artesanales.',
      address: 'A 3 km del centro de Villa Unión',
      href: 'https://www.google.com/maps/search/?api=1&query=Banda+Florida%2C+La+Rioja',
    },
    {
      category: 'Localidades',
      label: 'Los Palacios',
      description: 'Pintoresca localidad rural con calle principal arbolada, acequias, bodegas familiares de Torrontés y tranquilidad absoluta.',
      address: 'A 6 km de Villa Unión sobre RN 76',
      href: 'https://www.google.com/maps/search/?api=1&query=Los+Palacios%2C+La+Rioja',
    },
    {
      category: 'Localidades',
      label: 'Aicuña',
      description: 'Mágico poblado entre quebradas de la precordillera, con arquitectura tradicional de adobe, nogales centenarios y microclima fresco.',
      address: 'Acceso por Ruta Prov. 17 desde RN 76',
      href: 'https://www.google.com/maps/search/?api=1&query=Aicu%C3%B1a%2C+La+Rioja',
    },
    {
      category: 'Localidades',
      label: 'Guandacol',
      description: 'Cuna del caudillo Felipe Varela: visitá su casa histórica, el Dique Los Tambillos, olivares centenarios y bodegas artesanales.',
      address: 'A 45 km al sur de Villa Unión por RN 40',
      href: 'https://www.google.com/maps/search/?api=1&query=Guandacol%2C+La+Rioja',
    },
    {
      category: 'Localidades',
      label: 'Pagancillo',
      description: 'Tranquilo pueblo previo al Parque Nacional Talampaya; punto de partida para adquirir productos locales y descansar.',
      address: 'A 30 km de Villa Unión por RN 76',
      href: 'https://www.google.com/maps/search/?api=1&query=Pagancillo%2C+La+Rioja',
    },
  ],
};
