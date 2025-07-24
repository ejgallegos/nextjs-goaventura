
"use client";

import { useState, useEffect } from 'react';
import type { Product } from '@/lib/types';
import ViajesList from './viajes-list';
import { getProducts } from '@/lib/data/products';
import { Loader2 } from 'lucide-react';

export default function ViajesPage() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getProducts();
      const publishedProducts = allProducts.filter(p => p.status === 'published');
      setProducts(publishedProducts);
    };
    fetchProducts();
  }, []);

  if (products === null) {
     return (
       <div className="container mx-auto py-12 px-4 text-center flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return <ViajesList products={products} />;
}
