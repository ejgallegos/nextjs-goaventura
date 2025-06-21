
import { Metadata } from 'next';
import ProductCard from '@/components/product-card';
import { mockExcursions } from '@/lib/data/excursions';
import { mockTransfers } from '@/lib/data/transfers';
import type { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Todos los Viajes',
  description: 'Explora todas nuestras excursiones y transfers. Tu próxima aventura te espera con Go aventura.',
};

async function getProducts(): Promise<Product[]> {
  const allProducts = [...mockExcursions, ...mockTransfers];
  // Simple shuffle to mix products
  for (let i = allProducts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allProducts[i], allProducts[j]] = [allProducts[j], allProducts[i]];
  }
  return allProducts;
}

export default async function ViajesPage() {
  const products = await getProducts();

  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 md:mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">Todos Nuestros Viajes</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Aquí encontrarás todas las aventuras que ofrecemos, desde emocionantes excursiones hasta cómodos transfers.
          </p>
        </header>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No hay viajes disponibles en este momento. Vuelve pronto.</p>
          </div>
        )}
      </div>
    </div>
  );
}
