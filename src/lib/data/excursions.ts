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
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'lagoon mountains andes',
    category: 'Excursion',
    tags: ['Día Completo', '4x4', 'Fauna', 'Cordillera', 'Aventura'],
    imageGallery: [
      { src: 'https://placehold.co/800x600.png', alt: 'Paisaje 1 de Laguna Brava', hint: 'andes lagoon landscape' },
      { src: 'https://placehold.co/800x600.png', alt: 'Vicuñas en Laguna Brava', hint: 'vicunas wildlife andes' },
      { src: 'https://placehold.co/800x600.png', alt: 'Refugio en la montaña', hint: 'mountain shelter stone' },
      { src: 'https://placehold.co/800x600.png', alt: 'Camioneta 4x4 en la cordillera', hint: '4x4 truck mountains' },
      { src: 'https://placehold.co/800x600.png', alt: 'Flamencos en la laguna', hint: 'flamingos lagoon' },
    ],
  },
];
