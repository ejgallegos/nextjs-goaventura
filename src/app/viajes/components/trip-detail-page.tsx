
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, DollarSign, Tag, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useEffect } from 'react';
import { trackView } from '@/lib/data/statistics';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goaventura.com.ar';

interface TripDetailPageContentProps {
  product: Product;
}

export default function TripDetailPageContent({ product }: TripDetailPageContentProps) {
  
  useEffect(() => {
    // Unique view tracking using localStorage
    const viewedKey = `viewed-product-${product.id}`;
    if (!localStorage.getItem(viewedKey)) {
        trackView(product.id, product.name);
        localStorage.setItem(viewedKey, 'true');
    }
  }, [product.id, product.name]);

  const whatsappText = `Hola, estoy interesado/a en ${product.category.toLowerCase()} "${product.name}". Quisiera más información.`;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl ? new URL(product.imageUrl, siteUrl).toString() : undefined,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Go aventura',
    },
    offers: product.price && product.price > 0 ? {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'ARS',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/viajes/${product.slug}`,
    } : undefined,
  };

  const mainImageUrl = product.imageGallery && product.imageGallery.length > 0
    ? product.imageGallery[0].src
    : product.imageUrl;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-background">
        <div className="container max-w-7xl mx-auto py-8 sm:py-12 px-4">
          <div className="mb-6 text-sm font-body">
            <Link href="/viajes" className="text-muted-foreground hover:text-primary flex items-center w-fit">
                <ArrowLeft className="inline-block mr-1 h-4 w-4" /> Volver a todos los viajes
             </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Column: Image Gallery */}
             <div className="w-full relative aspect-video rounded-lg overflow-hidden shadow-xl lg:sticky lg:top-24">
               <Image
                  src={mainImageUrl}
                  alt={`Imagen de ${product.name}`}
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint={product.imageHint}
                />
            </div>


            {/* Right Column: Product Info & CTA */}
            <div className="space-y-6">
               <Badge variant="secondary" className="text-sm font-medium">{product.category}</Badge>
              
              <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">{product.name}</h1>
              
              {product.shortDescription && (
                <p className="text-lg text-muted-foreground">{product.shortDescription}</p>
              )}

              {product.price && product.price > 0 && (
                 <div className="text-4xl font-bold text-primary flex items-baseline gap-2">
                    <span>{product.currency} ${product.price.toLocaleString('es-AR')}</span>
                    <span className="text-lg font-normal text-muted-foreground">/ por persona</span>
                 </div>
                )}
              
              <div className="pt-4 border-t">
                 <h3 className="font-headline text-lg font-semibold mb-3 flex items-center gap-2">
                    <Info className="h-5 w-5"/>
                    Detalles
                 </h3>
                {product.tags && product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-sm">{tag}</Badge>
                        ))}
                    </div>
                )}
              </div>
              
              <div className="pt-4">
                <WhatsAppCtaButton 
                  predefinedText={whatsappText} 
                  buttonText="Consultar Disponibilidad" 
                  size="lg" 
                  className="w-full text-lg"
                  productId={product.id}
                  productName={product.name}
                />
              </div>

            </div>
          </div>

          <div className="mt-12 lg:mt-16 pt-8 border-t">
            <h2 className="font-headline text-3xl font-semibold text-foreground mb-4">Descripción Completa</h2>
            <div className="prose prose-lg max-w-none text-foreground prose-headings:font-headline prose-headings:text-foreground prose-a:text-accent prose-strong:text-foreground prose-a:font-semibold prose-a:no-underline hover:prose-a:underline">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
