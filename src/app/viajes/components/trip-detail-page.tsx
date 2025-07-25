
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import ImageSlider from '@/components/image-slider';
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


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-background">
        <div className="container max-w-7xl mx-auto py-8 sm:py-12 px-4">
          <div className="mb-6 text-sm font-body">
            <Link href="/" className="text-muted-foreground hover:text-primary">Inicio</Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <Link href="/viajes" className="text-muted-foreground hover:text-primary">Viajes</Link>
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{product.name}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="md:col-span-2 relative aspect-video rounded-lg overflow-hidden shadow-xl">
              {product.imageGallery && product.imageGallery.length > 0 ? (
                <ImageSlider images={product.imageGallery} className="w-full h-full" />
              ) : (
                <Image
                  src={product.imageUrl}
                  alt={`Imagen de ${product.name}`}
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint={product.imageHint}
                />
              )}
            </div>

            <div className="md:col-span-3 space-y-6">
              <h1 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">{product.name}</h1>
              
              <div className="flex flex-wrap gap-2 items-center">
                <Badge variant="secondary" className="text-sm">{product.category}</Badge>
                {product.price && product.price > 0 && (
                   <Badge variant="secondary" className="text-base font-semibold bg-primary text-primary-foreground flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{product.currency} ${product.price.toLocaleString('es-AR')}</span>
                  </Badge>
                )}
              </div>

              {product.shortDescription && (
                <p className="text-lg text-muted-foreground font-body">{product.shortDescription}</p>
              )}

              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="font-headline text-lg font-semibold mb-2">Etiquetas:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-4">
                <WhatsAppCtaButton 
                  predefinedText={whatsappText} 
                  buttonText="Consultar Disponibilidad" 
                  size="lg" 
                  className="w-full sm:w-auto"
                  productId={product.id}
                  productName={product.name}
                />
              </div>

               <div className="mt-8">
                <Button variant="outline" asChild>
                  <Link href="/viajes">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver a todos los viajes
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-16 pt-8 border-t">
            <div className="prose prose-lg max-w-none text-foreground prose-headings:font-headline prose-headings:text-foreground prose-a:text-accent prose-strong:text-foreground prose-a:font-semibold prose-a:no-underline hover:prose-a:underline">
              <ReactMarkdown>{product.description}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
