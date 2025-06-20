import { Metadata } from 'next';
import ProductCard from '@/components/product-card';
import { mockTransfers } from '@/lib/data/transfers';
import type { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Transfers',
  description: 'Servicios de transfer cómodos y seguros para tus viajes. Go aventura te lleva a tu destino.',
};

async function getTransfers(): Promise<Product[]> {
  return mockTransfers;
}

export default async function TransfersPage() {
  const transfers = await getTransfers();

  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 md:mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">Transfers Confiables</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Viaja con tranquilidad. Ofrecemos transfers eficientes y seguros para aeropuertos, hoteles y más.
          </p>
        </header>

        {transfers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {transfers.map((transfer) => (
              <ProductCard key={transfer.id} product={transfer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No hay servicios de transfer disponibles en este momento. Vuelve pronto.</p>
          </div>
        )}
      </div>
    </div>
  );
}
