"use client";

import { useState, useEffect } from 'react';
import HeroSection from '@/components/hero-section';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Award, MessageSquareText, Users, BedDouble, Mountain, ShieldCheck, CreditCard, Clock, Tag, Loader2, Star, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import type { Product, FeaturedAccommodation, Promotion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducts } from '@/lib/data/products';
import { getFeaturedAccommodation } from '@/lib/data/featured-accommodation';
import { getPromotions } from '@/lib/data/promotions';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { YouTubeShortsLogo } from '@/components/shorts/youtube-shorts-logo';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[] | null>(null);
  const [featuredAccommodation, setFeaturedAccommodation] = useState<FeaturedAccommodation | null>(null);
  const [featuredPromotions, setFeaturedPromotions] = useState<Promotion[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Products
      const allProducts = await getProducts();
      const featured = allProducts
        .filter(p => p.isFeatured && p.status === 'published')
        .sort((a, b) => {
            if (a.featuredOrder === undefined && b.featuredOrder === undefined) return 0;
            if (a.featuredOrder === undefined) return 1;
            if (b.featuredOrder === undefined) return -1;
            return a.featuredOrder - b.featuredOrder;
        });
      setFeaturedProducts(featured);
      
      // Accommodation
      const accommodationData = await getFeaturedAccommodation();
      setFeaturedAccommodation(accommodationData);

      // Promotions
      const allPromotions = await getPromotions();
      const featuredPromos = allPromotions.filter(p => p.isFeatured && p.status === 'published');
      setFeaturedPromotions(featuredPromos);
    };
    fetchData();
  }, []);

  const renderBentoProducts = () => {
    if (featuredProducts === null) {
      return (
         <div className="col-span-full py-20 flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }
    if (featuredProducts.length === 0) {
      return (
        <p className="text-center col-span-full text-muted-foreground">
          No hay servicios destacados en este momento.
        </p>
      );
    }

    // Implementación de Bento Grid: el primer producto ocupa más espacio en pantallas grandes
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-[1fr]">
        {featuredProducts.map((product, index) => (
          <div key={product.id} className={index === 0 ? "md:col-span-2 lg:col-span-2" : "col-span-1"}>
             <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
  }

  const renderFeaturedPromotions = () => {
    // Mantengo la lógica original pero con estilos actualizados
    if (featuredPromotions === null) return null;
    if (featuredPromotions.length === 0) return null;
    
    return (
       <section className="py-20 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left z-0"></div>
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 lg:mb-16">
                <Badge variant="secondary" className="mb-4 bg-amber-100 text-amber-700 hover:bg-amber-200 border-none px-4 py-1 text-sm">Ofertas de Temporada</Badge>
                <h2 className="font-headline text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight text-balance">Promociones Especiales</h2>
                <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
                  Aprovecha nuestros paquetes exclusivos y vive una aventura completa al mejor precio.
                </p>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPromotions.map((promo) => (
                  <Card key={promo.id} className="group flex flex-col overflow-hidden h-full shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[1.5rem] border-transparent hover:border-primary/20 bg-card/50 backdrop-blur-sm">
                    <CardHeader className="p-0 relative overflow-hidden">
                      <Link href={`/promociones/${promo.slug}`} aria-label={`Ver detalles de ${promo.title}`}>
                        <Image
                          src={promo.imageUrl}
                          alt={`Imagen de ${promo.title}`}
                          width={600}
                          height={400}
                          className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                          data-ai-hint={promo.imageHint}
                        />
                      </Link>
                       <div className="absolute top-4 left-4 z-10">
                         <Badge className="bg-amber-500 text-white shadow-lg border-none flex items-center gap-1.5 px-3 py-1">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-bold tracking-wide uppercase text-xs">Promo</span>
                        </Badge>
                       </div>
                    </CardHeader>
                    <CardContent className="flex-grow p-6 space-y-4">
                      <Link href={`/promociones/${promo.slug}`} aria-label={`Ver detalles de ${promo.title}`}>
                        <CardTitle className="font-headline text-2xl hover:text-primary transition-colors line-clamp-2 leading-tight">{promo.title}</CardTitle>
                      </Link>
                      <p className="text-base text-muted-foreground line-clamp-3 leading-relaxed">{promo.description}</p>
                    </CardContent>
                    <CardFooter className="p-6 pt-0 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground block mb-1">Desde</span>
                        {promo.price ? (
                            <div className="font-bold text-2xl text-foreground">
                                {promo.currency} ${promo.price.toLocaleString('es-AR')}
                            </div>
                        ) : (
                            <div className="font-semibold text-lg text-muted-foreground">Consultar</div>
                        )}
                      </div>
                      <Button size="icon" className="rounded-full h-12 w-12 shrink-0 group-hover:bg-primary transition-colors" asChild>
                        <Link href={`/promociones/${promo.slug}`}>
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
         </div>
      </section>
    );
  }

  const renderBentoAccommodation = () => {
    if (featuredAccommodation === null) {
        return (
            <div className="col-span-full py-12 flex justify-center">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-6">
          <Badge variant="outline" className="px-4 py-1 text-sm border-primary/30 text-primary">Estadía Perfecta</Badge>
          <h2 className="font-headline text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight text-balance">
            {featuredAccommodation.title}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {featuredAccommodation.description}
          </p>
          <div className="pt-4">
            <Button size="lg" asChild className="rounded-full px-8 h-14 text-lg shadow-lg hover:shadow-xl transition-all">
              <Link href={featuredAccommodation.buttonLink}>
                {featuredAccommodation.buttonText} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="lg:col-span-7 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-[2rem] transform translate-x-4 translate-y-4 -z-10"></div>
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group">
             <Image
                src={featuredAccommodation.imageUrl}
                alt={featuredAccommodation.title}
                width={1200}
                height={800}
                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                data-ai-hint={featuredAccommodation.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <HeroSection />

      {/* Featured Services Section - Bento Grid */}
      <section className="py-20 lg:py-32 bg-background relative">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="font-headline text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight">Experiencias Destacadas</h2>
              <p className="mt-4 text-xl text-muted-foreground">
                Seleccionamos las mejores aventuras para que tu visita al Talampaya sea inolvidable.
              </p>
            </div>
            <Button size="lg" asChild variant="ghost" className="hidden md:flex hover:bg-transparent hover:text-primary group">
              <Link href="/viajes">
                Ver todo el catálogo <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
          
          {renderBentoProducts()}
          
          <div className="mt-10 md:hidden text-center">
            <Button size="lg" asChild variant="outline" className="w-full">
              <Link href="/viajes">
                Explorar catálogo completo
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Promotions Section */}
      {renderFeaturedPromotions()}

      {/* Shorts Integration - High Retention Section */}
      <section className="py-20 bg-foreground text-background overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <YouTubeShortsLogo className="w-6 h-6 text-red-500" />
                <span className="font-medium">Formato Vertical</span>
              </div>
              <h2 className="font-headline text-4xl sm:text-6xl font-extrabold tracking-tight text-balance">
                Viví la experiencia antes de viajar
              </h2>
              <p className="text-xl text-muted-foreground/80 leading-relaxed text-balance">
                Nuestros videos cortos son el contenido favorito de nuestra comunidad. Descubrí rincones ocultos, tips de viaje y la magia de La Rioja en segundos.
              </p>
              <Button size="lg" asChild className="rounded-full px-8 h-14 bg-white text-foreground hover:bg-white/90">
                <Link href="/shorts">
                  <PlayCircle className="mr-2 h-5 w-5" /> Ver todos los Shorts
                </Link>
              </Button>
            </div>
            <div className="relative h-[600px] w-full max-w-[350px] mx-auto lg:ml-auto transform rotate-2 hover:rotate-0 transition-transform duration-500">
               {/* Mockup de Celular para Shorts */}
               <div className="absolute inset-0 bg-black rounded-[3rem] border-[8px] border-zinc-800 shadow-2xl overflow-hidden flex items-center justify-center">
                  <Image 
                    src="/slider/slider-0.png" 
                    alt="Shorts Preview" 
                    fill 
                    className="object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <PlayCircle className="w-20 h-20 text-white/80 absolute z-20" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Accommodation Section */}
      <section className="py-20 lg:py-32 bg-muted/50">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderBentoAccommodation()}
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-16 bg-background border-t">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/50">
            <div className="flex flex-col items-center gap-4 px-4">
              <div className="p-4 rounded-full bg-primary/10">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-lg tracking-tight">Reserva protegida</p>
            </div>
            <div className="flex flex-col items-center gap-4 px-4">
              <div className="p-4 rounded-full bg-primary/10">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-lg tracking-tight">Todos los medios de pago</p>
            </div>
            <div className="flex flex-col items-center gap-4 px-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-lg tracking-tight">Atención 24hs</p>
            </div>
            <div className="flex flex-col items-center gap-4 px-4">
              <div className="p-4 rounded-full bg-primary/10">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <p className="font-semibold text-foreground text-lg tracking-tight">Guías Locales Expertos</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
