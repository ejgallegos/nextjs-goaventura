
"use client";

import { useState, useEffect } from 'react';
import type { Product, Promotion } from '@/lib/types';
import ViajesList from './viajes-list';
import { getProducts } from '@/lib/data/products';
import { getPromotions } from '@/lib/data/promotions';
import { Loader2 } from 'lucide-react';

export default function ViajesPage() {
  const [items, setItems] = useState<Product[] | null>(null);

  useEffect(() => {
    const fetchAllItems = async () => {
      const [allProducts, allPromotions] = await Promise.all([
        getProducts(),
        getPromotions(),
      ]);

      const publishedProducts = allProducts.filter(p => p.status === 'published');
      
      const publishedPromotions = allPromotions
        .filter(p => p.status === 'published')
        .map(promo => ({
          ...promo,
          id: promo.id,
          name: promo.title,
          slug: `/promociones/${promo.slug}`, // Point to promotion detail page
          shortDescription: promo.description,
          category: 'Promocion' as const, // Assign a category for filtering
        }));

      const combinedItems = [...publishedProducts, ...publishedPromotions];

      setItems(combinedItems as Product[]);
    };
    fetchAllItems();
  }, []);

  if (items === null) {
     return (
       <div className="container mx-auto py-12 px-4 text-center flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return <ViajesList products={items} />;
}
