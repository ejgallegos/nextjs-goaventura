import type { BlogPost } from '@/lib/types';

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'blog001',
    slug: 'mejores-destinos-verano-2024',
    title: 'Los Mejores Destinos para Visitar en el Verano 2024',
    date: '2024-07-15T10:00:00Z',
    author: 'Ana Pérez',
    excerpt: 'Descubre los destinos más populares y emocionantes para tus vacaciones de verano este año. Desde playas paradisíacas hasta montañas imponentes.',
    content: `
## Introducción

El verano es la época perfecta para explorar nuevos lugares y vivir aventuras inolvidables. Si aún no has decidido tu próximo destino, aquí te presentamos algunas ideas que te inspirarán.

### 1. Costa Azul, Francia

Con sus playas glamorosas, pueblos encantadores y una gastronomía exquisita, la Costa Azul sigue siendo un clásico imperdible. Niza, Cannes y Saint-Tropez te esperan.

### 2. Patagonia Argentina

Para los amantes de la naturaleza y el trekking, la Patagonia ofrece paisajes de ensueño. El Chaltén, Ushuaia y el Parque Nacional Los Glaciares son paradas obligatorias.

### 3. Kyoto, Japón

Sumérgete en la cultura milenaria de Japón visitando Kyoto. Templos ancestrales, jardines zen y una atmósfera única te transportarán a otro tiempo.

## Conclusión

No importa cuál sea tu estilo de viaje, el verano 2024 tiene un destino perfecto para ti. ¡Empieza a planificar tu aventura con GoAventura!
    `,
    imageUrl: 'https://placehold.co/800x450.png',
    imageHint: 'summer travel collage',
    tags: ['verano', 'destinos', 'viajes', 'vacaciones'],
    status: 'published',
  },
  {
    id: 'blog002',
    slug: 'consejos-viajar-mochilero',
    title: '10 Consejos Esenciales para Viajar como Mochilero',
    date: '2024-06-20T14:30:00Z',
    author: 'Carlos López',
    excerpt: 'Si estás planeando tu primer viaje de mochilero, estos consejos te ayudarán a prepararte y disfrutar al máximo la experiencia.',
    content: `
Viajar como mochilero es una experiencia transformadora, pero requiere cierta preparación. Aquí tienes algunos consejos:

1. **Empaca ligero:** Lleva solo lo esencial.
2. **Investiga tu destino:** Conoce la cultura, moneda y transporte.
3. **Sé flexible:** Los planes pueden cambiar, ¡disfruta la espontaneidad!
4. **Presupuesto:** Lleva un control de tus gastos.
5. **Seguro de viaje:** Imprescindible para cualquier imprevisto.

Viajar con mochilero te enseñará a valorar la libertad y la simplicidad de la vida.
    `,
    imageUrl: 'https://placehold.co/800x450.png',
    imageHint: 'backpacking travel',
    tags: ['viajes', 'consejos', 'mochilero', 'aventura'],
    status: 'published',
  },
];
