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

export interface GuideRecommendation {
  category: 'Gastronomía' | 'Bodegas' | 'Artesanías' | 'Localidades' | 'Excursiones';
  label: string;
  description: string;
  address?: string;
  phone?: string;
  reservationPhone?: string;
  href: string;
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
      description: 'Ideal para alimentos, bebidas, panificados frescos y artículos esenciales.',
      address: 'Villa Unión centro',
      href: 'https://www.google.com/maps/search/?api=1&query=Supermercado+El+Negro%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Supermercado',
      label: 'Autoservicio Valle del Bermejo',
      description: 'Supermercado y abastecimiento sobre acceso.',
      address: 'Ruta Nacional 76 - Acceso Sur',
      phone: '3825 479700',
      href: 'https://www.google.com/maps/search/?api=1&query=Autoservicio+Valle+del+Bermejo%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
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
    {
      category: 'Gastronomía',
      label: '1883 Bistró',
      description: 'Excelente propuesta gourmet y regional en Villa Unión. Ideal para almorzar o cenar.',
      address: 'Hipólito Irigoyen 13, Villa Unión',
      phone: '3825 80529',
      href: 'https://www.google.com/maps/search/?api=1&query=1883+Bistr%C3%B3%2C+Hip%C3%B3lito+Irigoyen+13%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
      badge: 'Recomendado',
    },
    {
      category: 'Gastronomía',
      label: 'Campo Base',
      description: 'Platos sabrosos, minutas y ambiente distendido para cenar o almorzar.',
      address: 'Av. Nicolás Dávila Sur s/n, Villa Unión',
      phone: '3825 671014',
      href: 'https://www.google.com/maps/search/?api=1&query=Campo+Base%2C+Av+Nicol%C3%A1s+D%C3%A1vila+Sur%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
      badge: 'Recomendado',
    },
    {
      category: 'Gastronomía',
      label: 'Parrilla Ruta 40',
      description: 'Carnes a la parrilla y cocina criolla tradicional sobre el cruce de rutas.',
      address: 'Ruta Nac. 76 y Ruta Nac. 40, Villa Unión',
      phone: '3825 410686',
      href: 'https://www.google.com/maps/search/?api=1&query=Parrilla+Ruta+40%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'Guadalupe Resto-Bar',
      description: 'Pizzería, pastas, empanadas y minutas en el centro de la localidad.',
      address: 'San Martín esq. Honorato Guerrero, Villa Unión',
      phone: '3825 674569',
      href: 'https://www.google.com/maps/search/?api=1&query=Guadalupe+Resto+Bar%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'La Palmera Restaurante',
      description: 'Comedor clásico riojano con amplia carta regional.',
      address: 'Ruta Nac. 76 y Ruta Nac. 40, Villa Unión',
      phone: '3804 278216',
      href: 'https://www.google.com/maps/search/?api=1&query=Restaurante+La+Palmera%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Gastronomía',
      label: 'Sabores Riojanos',
      description: 'Comidas típicas, empanadas y opciones para llevar.',
      address: 'Bvar. Illanes 50, Villa Unión',
      phone: '3825 614576',
      href: 'https://www.google.com/maps/search/?api=1&query=Sabores+Riojanos%2C+Bvar+Illanes+50%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Bodegas',
      label: 'Bodega Familia Sacavino Arrieta',
      description: 'Bodega exclusiva de Torrontés Riojano en Los Palacios. Visita guiada por viñedos y bodega, tapeo y venta de vinos.',
      address: 'Calle Principal, Los Palacios (a 6 km de Villa Unión)',
      reservationPhone: '+54 9 351 618 6283',
      href: 'https://www.google.com/maps/search/?api=1&query=Bodega+Sacavino+Arrieta%2C+Los+Palacios%2C+La+Rioja',
      badge: 'Visita imperdible',
    },
    {
      category: 'Bodegas',
      label: 'Bodega Aicuña',
      description: 'Vino artesanal de altura en el pintoresco pueblo de Aicuña. Visita técnica, degustación y venta directa.',
      address: 'Ruta Prov. 17 (a 1 km del arco de entrada al pueblo)',
      reservationPhone: '+54 9 3825 45 6563',
      href: 'https://www.google.com/maps/search/?api=1&query=Bodega+Aicu%C3%B1a%2C+La+Rioja',
      badge: 'Vinos de altura',
    },
    {
      category: 'Bodegas',
      label: 'Bodega Haras San José',
      description: 'Complejo enoturístico con vinos artesanales, degustaciones guiadas y venta.',
      address: 'Ruta Nac. 76 - Pasaje Los Minué - Barrio San José, Villa Unión',
      reservationPhone: '+54 9 3825 66 9382',
      href: 'https://www.google.com/maps/search/?api=1&query=Haras+San+Jos%C3%A9%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Bodegas',
      label: 'Bodega Cooperativa La Riojana',
      description: 'Vinos premiados, visita guiada por instalaciones y salón de degustación.',
      address: 'Ruta Nac. 76, Villa Unión',
      reservationPhone: '+54 9 3825 67 5313',
      href: 'https://www.google.com/maps/search/?api=1&query=Cooperativa+La+Riojana%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Bodegas',
      label: 'Bodega Otra Vuelta',
      description: 'Vinos artesanales en Banda Florida con atención cálida y personalizada.',
      address: 'Calle Sarmiento s/n, Banda Florida',
      reservationPhone: '+54 9 341 202 0061',
      href: 'https://www.google.com/maps/search/?api=1&query=Bodega+Otra+Vuelta%2C+Banda+Florida%2C+La+Rioja',
    },
    {
      category: 'Bodegas',
      label: 'Bodega Las Jarillas',
      description: 'Vinos artesanales y comedor regional en el histórico pueblo de Guandacol.',
      address: 'Mariano Moreno s/n, Guandacol',
      reservationPhone: '+54 9 11 5635 5341',
      href: 'https://www.google.com/maps/search/?api=1&query=Bodega+Las+Jarillas%2C+Guandacol%2C+La+Rioja',
    },
    {
      category: 'Artesanías',
      label: 'Regionales del Oeste',
      description: 'Dulces caseros, nueces, alfajores, vinos y artesanías locales sobre el cruce de rutas.',
      address: 'Intersección Ruta Nac. 76 y Ruta Nac. 40',
      phone: '3825 660792',
      href: 'https://www.google.com/maps/search/?api=1&query=Regionales+del+Oeste%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Artesanías',
      label: 'Regionales Milor',
      description: 'Productos típicos riojanos, tejidos y recuerdos frente a la plaza principal.',
      address: 'San Martín s/n (frente a Plaza Principal), Villa Unión',
      phone: '3825 666801',
      href: 'https://www.google.com/maps/search/?api=1&query=Regionales+Milor%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Artesanías',
      label: 'Regionales Don Dámaso',
      description: 'Elaboración tradicional de dulces, conservas y productos del Bermejo.',
      address: 'Ruta Nac. 76 Km 111, Villa Unión',
      phone: '3804 370745',
      href: 'https://www.google.com/maps/search/?api=1&query=Regionales+Don+Damaso%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
    {
      category: 'Artesanías',
      label: 'La Salamanca Artesanías',
      description: 'Tejidos en telar, cerámicas y artículos regionales en el centro cívico.',
      address: 'Joaquín V. González frente a la Plaza San Martín, Villa Unión',
      href: 'https://www.google.com/maps/search/?api=1&query=La+Salamanca%2C+Joaqu%C3%ADn+V+Gonz%C3%A1lez%2C+Villa+Uni%C3%B3n%2C+La+Rioja',
    },
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
    {
      category: 'Excursiones',
      label: 'Excursiones Go Aventura',
      description: 'Salidas guiadas personalizadas: Parque Nacional Talampaya (Cañón del Arco Iris, Ciudad Perdida, Cañón de Talampaya), Cañón del Triásico, Laguna Brava y Cuesta de Miranda.',
      address: 'Villa Unión, La Rioja',
      phone: '5493804509885',
      href: 'https://goaventura.com.ar/viajes',
      badge: 'Exclusivo huéspedes',
    },
    {
      category: 'Excursiones',
      label: 'Transfers y Traslados Go Aventura',
      description: 'Traslados privados in/out a aeropuertos (La Rioja, San Juan, Catamarca) y servicios de transporte personalizado para tus excursiones.',
      phone: '5493804509885',
      href: 'https://wa.me/5493804509885?text=Hola%2C%20estoy%20alojado%20en%20Altos%20del%20Talampaya%20Dpto%20y%20quiero%20consultar%20por%20traslados',
      badge: 'Atención personalizada',
    },
  ],
};
