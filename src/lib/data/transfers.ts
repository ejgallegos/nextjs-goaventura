
import type { Product } from '@/lib/types';

export const mockTransfers: Product[] = [
    {
    id: 'trn001',
    name: 'Transfer Aeropuerto La Rioja - Villa Unión',
    slug: 'transfer-aeropuerto-lr-villa-union',
    description: 'Servicio de transfer privado desde el aeropuerto de La Rioja (Capitán Vicente Almandos Almonacid) hasta tu alojamiento en Villa Unión. Comodidad, seguridad y puntualidad garantizadas para que comiences tu aventura sin preocupaciones.',
    shortDescription: 'Privado desde el aeropuerto de La Rioja a Villa Unión.',
    price: 150,
    currency: 'USD',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'airport shuttle van',
    category: 'Transfer',
    tags: ['aeropuerto', 'hotel', 'privado', 'villa union'],
    isFeatured: false,
  },
  {
    id: 'trn002',
    name: 'Transfer Villa Unión - Parque Nacional Talampaya',
    slug: 'transfer-villa-union-talampaya',
    description: 'Te llevamos desde tu hotel en Villa Unión hasta la entrada del Parque Nacional Talampaya. Viaja cómodo y a tiempo para tu excursión.',
    shortDescription: 'Desde Villa Unión al Parque Nacional Talampaya.',
    price: 25000,
    currency: 'ARS',
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'van talampaya entrance',
    category: 'Transfer',
    tags: ['parque nacional', 'talampaya', 'villa union', 'seguro'],
    isFeatured: false,
  },
];
