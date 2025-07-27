
import type { Product } from '@/lib/types';

export const mockExcursions: Product[] = [
  {
    id: 'exc001',
    name: 'Reserva Provincial Laguna Brava',
    slug: 'reserva-provincial-laguna-brava',
    description: `Excursión de día completo, saliendo desde Villa Unión, visitando los Refugios históricos de la ruta de los arrieros a Chile, Valles y Quebradas multicolores, avistaje de fauna autóctona (vicuñas, guanacos, zorros) y de flamencos rosados en la laguna.

Llegamos hasta los 4300 msnm, recorriendo la imponente Cordillera de los Andes.

### Detalles
* **Salidas:** Todos los días.
* **Horarios:** Salida 08:00 hs – Regreso 18:00 hs.
* **Recorrido:** 350 km.
* **Incluye:** Vehículo 4×4, guía profesional, box lunch, seguro.
* **No Incluye:** Ingreso a la reserva.

### Itinerario
Salimos desde Villa Unión por la mañana, por ruta 76 hacia el oeste, pasando por las localidades de Villa Castelli y Vinchina, donde haremos una breve parada para conocer la “Estrella Diaguita” y la Iglesia de adobe.

Continuamos por la Quebrada de la Troya, pasando por la “Pirámide” y el paraje de Jagüé. Desde allí comenzamos el ascenso a la Cordillera, por la quebrada del Peñón, visitando los refugios históricos de arrieros: El Peñón, del Veladero, y Barrancas Blancas. Durante el recorrido haremos paradas para observar la flora y fauna del lugar.

Al mediodía arribaremos a la Laguna Brava, donde almorzaremos (Box Lunch). Luego haremos un recorrido por la laguna para el avistaje de flamencos y vicuñas. Por la tarde emprendemos el regreso a Villa Unión.

### Recomendaciones
* Llevar ropa cómoda, abrigo, gorro, protector solar y lentes de sol.
* Personas con problemas cardíacos, consultar a su médico.
* No apto para menores de 5 años.`,
    shortDescription: 'Excursión 4x4 de día completo a la Cordillera de los Andes, avistaje de fauna y paisajes únicos.',
    price: 60000,
    currency: 'ARS',
    imageUrl: '/slider/lb-slider-3.png',
    imageHint: 'lagoon mountains andes',
    category: 'Excursion',
    tags: ['Día Completo', '4x4', 'Fauna', 'Cordillera', 'Aventura'],
    imageGallery: [
      { src: '/slider/lb-slider-1.png', alt: 'Paisaje 1 de Laguna Brava', hint: 'andes lagoon landscape' },
      { src: '/slider/lb-slider-2.png', alt: 'Vicuñas en Laguna Brava', hint: 'vicunas wildlife andes' },
      { src: '/slider/lb-slider-3.png', alt: 'Refugio en la montaña', hint: 'mountain shelter stone' },
      { src: '/slider/lb-slider-4.png', alt: 'Camioneta 4x4 en la cordillera', hint: '4x4 truck mountains' },
      { src: '/slider/lb-slider-5.png', alt: 'Flamencos en la laguna', hint: 'flamingos lagoon' },
    ],
    isFeatured: true,
  },
  {
    id: 'exc002',
    name: 'Excursión al Parque Nacional Talampaya',
    slug: 'excursion-parque-nacional-talampaya',
    description: `Excursión de medio día. En esta excursión visitaremos el imponente Cañón de Talampaya, recorriendo en combis del concesionario del parque, un circuito de 2,5 hs de duración, donde conoceremos las geoformas y la historia del lugar.`,
    shortDescription: 'Visita guiada al imponente cañón, sus geoformas e historia.',
    price: 30000,
    currency: 'ARS',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'talampaya canyon red rocks',
    category: 'Excursion',
    tags: ['Medio Día', 'Geología', 'Cultura', 'Cañón'],
    isFeatured: true,
  },
  {
    id: 'exc003',
    name: 'Cañon del Triasico',
    slug: 'canon-del-triasico',
    description: 'Recorrido por el lecho de un río seco, visitando paredones de más de 100 mts de altura, variedad de colores en los estratos de la tierra, petroglifos y morteros comunitarios. Un viaje en el tiempo de más de 250 millones de años.',
    shortDescription: 'Viaje en el tiempo a la era de los dinosaurios.',
    price: 25000,
    currency: 'ARS',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'triassic canyon geology',
    category: 'Excursion',
    tags: ['Medio Día', 'Geología', 'Aventura'],
    isFeatured: false,
  }
];
