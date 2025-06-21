
"use client";

import { useState } from 'react';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ViajesList({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('all');

  const filteredProducts = products.filter(product => {
    if (filter === 'all') {
      return true;
    }
    return product.category === filter;
  });

  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 md:mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">Todos Nuestros Viajes</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Aquí encontrarás todas las aventuras que ofrecemos, desde emocionantes excursiones hasta cómodos transfers.
          </p>
        </header>

        <div className="flex justify-center mb-10">
          <Tabs defaultValue="all" onValueChange={(value) => setFilter(value)} className="w-full max-w-sm">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="Excursion">Excursiones</TabsTrigger>
              <TabsTrigger value="Transfer">Transfers</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No hay resultados para esta categoría.</p>
          </div>
        )}
      </div>
    </div>
  );
}
