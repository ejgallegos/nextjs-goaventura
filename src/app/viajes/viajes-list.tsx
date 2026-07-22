"use client";

import { useState, useMemo } from 'react';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import { Compass, Filter, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ViajesList({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (filter === 'all') {
        return true;
      }
      return product.category === filter;
    });
  }, [products, filter]);

  const categories = [
    { id: 'all', label: 'Todas las Aventuras' },
    { id: 'Excursion', label: 'Excursiones' },
    { id: 'Transfer', label: 'Transfers' },
    { id: 'Promocion', label: 'Promociones' },
  ];

  return (
    <>
      <title>Nuestros Viajes y Promociones | Go Aventura</title>
      
      {/* Hero Header */}
      <div className="relative bg-secondary/20 pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium mb-6">
            <Compass className="w-5 h-5" />
            <span>Descubrí La Rioja</span>
          </div>
          <h1 className="font-headline text-5xl sm:text-6xl font-extrabold text-foreground tracking-tight text-balance mb-6">
            Elegí tu próxima <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">aventura</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Explorá el Talampaya, Laguna Brava y todos nuestros destinos con guías expertos. Encontrá excursiones, transfers y promos exclusivas.
          </p>
        </div>
      </div>

      <div className="bg-background py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Pill Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-muted-foreground font-medium hidden sm:flex">
               <Filter className="w-5 h-5" /> Filtrar por:
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 bg-muted/30 p-2 rounded-2xl border border-border/50">
               {categories.map((cat) => (
                 <button
                   key={cat.id}
                   onClick={() => setFilter(cat.id)}
                   className={cn(
                     "px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-300",
                     filter === cat.id 
                       ? "bg-primary text-primary-foreground shadow-md scale-105" 
                       : "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                   )}
                 >
                   {cat.id === 'Promocion' && filter === cat.id && <Sparkles className="inline-block w-4 h-4 mr-1.5 -mt-0.5" />}
                   {cat.label}
                 </button>
               ))}
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-[1fr]">
              {filteredProducts.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-[2rem] border border-dashed">
              <Compass className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-xl text-muted-foreground font-medium">No hay aventuras disponibles en esta categoría.</p>
              <button onClick={() => setFilter('all')} className="mt-4 text-primary hover:underline font-semibold">
                Ver todas las aventuras
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
