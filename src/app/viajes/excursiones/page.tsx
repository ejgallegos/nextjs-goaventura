import { Metadata } from 'next';
import ProductCard from '@/components/product-card';
import { mockExcursions } from '@/lib/data/excursions';
import type { Product } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Excursiones',
  description: 'Descubre nuestra selección de emocionantes excursiones. Aventura y naturaleza te esperan con Go aventua.',
};

// This function would typically fetch data in a real app
async function getExcursions(): Promise<Product[]> {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 500));
  return mockExcursions;
}

export default async function ExcursionesPage() {
  const excursions = await getExcursions();

  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 md:mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">Excursiones Únicas</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Vive la aventura con nuestras excursiones cuidadosamente seleccionadas. Desde trekkings en montañas hasta exploraciones culturales.
          </p>
        </header>

        {excursions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {excursions.map((excursion) => (
              <ProductCard key={excursion.id} product={excursion} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No hay excursiones disponibles en este momento. Vuelve pronto.</p>
          </div>
        )}
      </div>
    </div>
  );
}
