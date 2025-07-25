
'use client'

import { useState, useEffect } from 'react';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound, useParams } from 'next/navigation';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/data/products';
import TripDetailPageContent from '../components/trip-detail-page';
import { Loader2 } from 'lucide-react';

export default function TripDetailPage() {
  const [product, setProduct] = useState<Product | null | undefined>(null);
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      const fetchProduct = async () => {
        const products = await getProducts();
        const foundProduct = products.find(p => p.slug === slug && p.status === 'published');
        setProduct(foundProduct);
      };
      fetchProduct();
    }
  }, [slug]);

  if (product === null) {
    return (
       <div className="container mx-auto py-12 px-4 text-center flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (product === undefined) {
    notFound();
  }

  return (
    <>
      <title>{product.name} | Go aventura</title>
      <TripDetailPageContent product={product} />
    </>
  );
}
