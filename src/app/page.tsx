
"use client";

import { useState, useEffect } from 'react';
import HeroSection from '@/components/hero-section';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Award, MessageSquareText, Users, BedDouble, Mountain, ShieldCheck, CreditCard, Clock, Tag, Loader2 } from 'lucide-react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducts } from '@/lib/data/products';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const allProducts = await getProducts();
      // Logic to select featured products based on isFeatured flag
      const featured = allProducts.filter(p => p.isFeatured && p.status === 'published');
      setFeaturedProducts(featured);
    };
    fetchProducts();
  }, []);

  const renderFeaturedProducts = () => {
    if (featuredProducts === null) {
      return (
         <div className="text-center col-span-full py-8 flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    if (featuredProducts.length === 0) {
      return (
        <p className="text-center col-span-3 text-muted-foreground">
          No hay servicios destacados en este momento. Vuelve a consultar más tarde.
        </p>
      );
    }
    return featuredProducts.map((product) => (
      <ProductCard key={product.id} product={product} />
    ));
  }

  return (
    <div className="flex flex-col">
      <HeroSection />

      {/* Featured Services Section */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Servicios Destacados</h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora nuestras ofertas más populares y prepárate para una experiencia inolvidable.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {renderFeaturedProducts()}
          </div>
          <div className="mt-12 text-center">
            <Button size="lg" asChild variant="outline">
              <Link href="/viajes">
                Ver Todos los Viajes <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Accommodation Section */}
      <section className="py-12 lg:py-20 bg-muted">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-12">
            <BedDouble className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Alojamientos Destacados</h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Descansa en lugares únicos. Te presentamos una opción excepcional cerca del Parque Nacional Talampaya.
            </p>
          </div>
          <div className="flex justify-center">
            <Card className="max-w-2xl w-full shadow-xl overflow-hidden">
              <CardHeader className="p-0">
                <Image
                  src="https://placehold.co/800x450.png"
                  alt="Cabañas Altos del Talampaya"
                  width={800}
                  height={450}
                  className="w-full h-64 object-cover"
                  data-ai-hint="cabin mountains talampaya"
                />
              </CardHeader>
              <CardContent className="p-6 text-center">
                <Mountain className="h-10 w-10 text-accent mx-auto mb-3" />
                <CardTitle className="font-headline text-2xl text-foreground mb-2">Altos del Talampaya</CardTitle>
                <CardDescription className="text-base text-muted-foreground mb-4">
                  Disfruta de una estadía inolvidable en nuestras cabañas con vistas impresionantes al Parque Nacional Talampaya. Comodidad, naturaleza y aventura te esperan.
                </CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-center">
                <Button size="lg" asChild variant="default">
                  <Link href="http://altosdeltalampaya.goaventura.com.ar/" target="_blank" rel="noopener noreferrer">
                    Explorar Alojamientos <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">¿Por Qué Elegir Go aventura?</h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Nos dedicamos a crear experiencias de viaje únicas y memorables para ti.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center">
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
              <Award className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-headline text-xl font-semibold text-foreground mb-2">Experiencia y Calidad</h3>
              <p className="text-sm text-muted-foreground">
                Años de experiencia en el sector turístico garantizan servicios de alta calidad y atención personalizada.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-headline text-xl font-semibold text-foreground mb-2">Guías Expertos</h3>
              <p className="text-sm text-muted-foreground">
                Nuestros guías locales son apasionados y conocedores, listos para mostrarte lo mejor de cada destino.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
              <MessageSquareText className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-headline text-xl font-semibold text-foreground mb-2">Soporte Personalizado</h3>
              <p className="text-sm text-muted-foreground">
                Estamos aquí para ayudarte antes, durante y después de tu viaje. Tu satisfacción es nuestra prioridad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <ShieldCheck className="h-10 w-10 text-primary" />
              <p className="font-semibold text-foreground text-base">Tu reserva protegida</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <CreditCard className="h-10 w-10 text-primary" />
              <p className="font-semibold text-foreground text-base">Todos los medios de pago</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Clock className="h-10 w-10 text-primary" />
              <p className="font-semibold text-foreground text-base">Comunicación las 24hs</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Tag className="h-10 w-10 text-primary" />
              <p className="font-semibold text-foreground text-base">Consulta por las promos</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
