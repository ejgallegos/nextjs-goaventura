
import type { Product } from '@/lib/types';
import { mockExcursions } from './excursions';

const PRODUCTS_STORAGE_KEY = 'goaventura_products';

const mockTransfers: Product[] = [
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


// This function now handles getting data from localStorage or falling back to mocks
export async function getProducts(): Promise<(Product)[]> {
    // If on the client-side, try to use localStorage
    if (typeof window !== 'undefined') {
        const storedTasks = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (storedTasks) {
            try {
                // If we have data in localStorage, use it
                return JSON.parse(storedTasks);
            } catch (e) {
                console.error("Failed to parse products from localStorage", e);
                // Fallback to mocks if parsing fails
            }
        }
    }
    
    // On the server OR if localStorage is empty/corrupt, use mock data
    const allProducts = [...mockExcursions, ...mockTransfers];
    allProducts.sort((a, b) => a.name.localeCompare(b.name));
    const tasks = allProducts.map(p => ({...p, status: 'published'}));
    
    // If on client, save initial mock data to localStorage if it wasn't there
    if (typeof window !== 'undefined' && !localStorage.getItem(PRODUCTS_STORAGE_KEY)) {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(tasks));
    }

    return tasks;
}

// New function to save tasks to localStorage
export async function saveProducts(tasks: (Product)[]): Promise<void> {
    if (typeof window !== 'undefined') {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(tasks));
    }
}
