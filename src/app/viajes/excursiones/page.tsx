
"use client";

import { useState, useEffect } from 'react';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/data/products';

export default function ExcursionesPage() {
  const [excursions, setExcursions] = useState<Product[]>([]);

  useEffect(() => {
    const fetchExcursions = async () => {
      const allProducts = await getProducts();
      const excursionProducts = allProducts.filter(p => p.category === 'Excursion' && p.status === 'published');
      setExcursions(excursionProducts);
    };
    fetchExcursions();
  }, []);

  return (
    <>
    <title>Excursiones | Go Aventura</title>
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 md:mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">Excursiones Únicas</h1>
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
            <p className="text-xl text-muted-foreground">Cargando excursiones...</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
