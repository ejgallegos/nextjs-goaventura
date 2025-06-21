
import { Metadata } from 'next';
import { mockExcursions } from '@/lib/data/excursions';
import { mockTransfers } from '@/lib/data/transfers';
import type { Product } from '@/lib/types';
import ViajesList from './viajes-list';

export const metadata: Metadata = {
  title: 'Todos los Viajes',
  description: 'Explora todas nuestras excursiones y transfers. Tu próxima aventura te espera con Go aventura.',
};

async function getProducts(): Promise<Product[]> {
  const allProducts = [...mockExcursions, ...mockTransfers];
  // Sort products alphabetically by name for a consistent order
  allProducts.sort((a, b) => a.name.localeCompare(b.name));
  return allProducts;
}

export default async function ViajesPage() {
  const products = await getProducts();

  return <ViajesList products={products} />;
}
