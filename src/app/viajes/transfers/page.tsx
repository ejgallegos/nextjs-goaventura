
"use client";

import { useState, useEffect } from 'react';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/data/products';

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Product[]>([]);

  useEffect(() => {
    const fetchTransfers = async () => {
      const allProducts = await getProducts();
      const transferProducts = allProducts.filter(p => p.category === 'Transfer' && p.status === 'published');
      setTransfers(transferProducts);
    };
    fetchTransfers();
  }, []);

  return (
    <>
    <title>Transfers | Go Aventura</title>
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
            <p className="text-xl text-muted-foreground">Cargando transfers...</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
