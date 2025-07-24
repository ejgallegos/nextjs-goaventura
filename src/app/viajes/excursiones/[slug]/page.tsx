
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/data/products';
import TripDetailPageContent from '../../components/trip-detail-page';

export default function ExcursionDetailPage() {
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const params = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      const slug = params.slug as string;
      if (slug) {
        const products = await getProducts();
        const foundProduct = products.find(p => p.slug === slug && p.category === 'Excursion');
        setProduct(foundProduct || null);
      }
    };
    fetchProduct();
  }, [params.slug]);

  return <TripDetailPageContent product={product} productType="Excursión" />;
}
