
"use client";

import { useState, useEffect } from 'react';
import type { Promotion } from '@/lib/types';
import { getPromotions } from '@/lib/data/promotions';
import { Loader2, Star, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function PromocionesPage() {
  const [promotions, setPromotions] = useState<Promotion[] | null>(null);

  useEffect(() => {
    const fetchPromotions = async () => {
      const allPromos = await getPromotions();
      const publishedPromos = allPromos.filter(p => p.status === 'published');
      setPromotions(publishedPromos);
    };
    fetchPromotions();
  }, []);

  const renderContent = () => {
    if (promotions === null) {
      return (
        <div className="text-center py-12 flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    if (promotions.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No hay promociones disponibles en este momento. ¡Vuelve pronto!</p>
        </div>
      );
    }

    return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {promotions.map((promo) => (
            <Card key={promo.id} className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
                <CardHeader className="p-0 relative">
                    <Link href={`/promociones/${promo.slug}`} aria-label={`Ver detalles de ${promo.title}`}>
                    <Image
                        src={promo.imageUrl}
                        alt={`Imagen de ${promo.title}`}
                        width={600}
                        height={400}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                        data-ai-hint={promo.imageHint}
                    />
                    </Link>
                    {promo.isFeatured && (
                         <Badge variant="secondary" className="absolute top-2 left-2 text-sm font-semibold bg-amber-500 text-white flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            <span>Destacado</span>
                        </Badge>
                    )}
                </CardHeader>
                <CardContent className="flex-grow p-4 space-y-3">
                    <Link href={`/promociones/${promo.slug}`} aria-label={`Ver detalles de ${promo.title}`}>
                    <CardTitle className="font-headline text-xl hover:text-primary transition-colors line-clamp-2">{promo.title}</CardTitle>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-3">{promo.description}</p>
                     {promo.validity && (
                        <p className="text-xs text-primary font-medium">{promo.validity}</p>
                    )}
                </CardContent>
                <CardFooter className="p-4 flex items-center justify-between gap-2 border-t">
                    {promo.price ? (
                        <div className="font-semibold text-lg text-primary">
                            {promo.currency} ${promo.price.toLocaleString('es-AR')}
                        </div>
                    ) : (
                        <div className="font-semibold text-muted-foreground">Consultar</div>
                    )}
                    <Button variant="outline" size="sm" asChild>
                    <Link href={`/promociones/${promo.slug}`}>
                        Ver Paquete <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    );
  }

  return (
    <>
    <title>Promociones | Go Aventura</title>
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 md:mb-12">
          <Star className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">Nuestras Promociones</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre paquetes y ofertas especiales para vivir una experiencia inolvidable al mejor precio.
          </p>
        </header>
        {renderContent()}
      </div>
    </div>
    </>
  );
}
