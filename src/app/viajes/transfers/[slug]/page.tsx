
"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/data/products';
import TripDetailPageContent from '../../components/trip-detail-page';

export default function TransferDetailPage() {
  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const params = useParams();
  
  useEffect(() => {
    const fetchTransfer = async () => {
      const slug = params.slug as string;
      if (slug) {
        const products = await getProducts();
        const foundTransfer = products.find(p => p.slug === slug && p.category === 'Transfer');
        setProduct(foundTransfer || null);
      }
    };
    fetchTransfer();
  }, [params.slug]);

  return <TripDetailPageContent product={product} productType="Transfer" />;
}
