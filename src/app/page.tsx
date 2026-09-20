"use client";

import { useState, useEffect } from 'react';
import HeroSection from '@/components/hero-section';
import ProductCard from '@/components/product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, BedDouble, Play, ChevronRight, ShieldCheck, CreditCard, Clock, Tag } from 'lucide-react';
import Image from 'next/image';
import type { Product, FeaturedAccommodation, Promotion } from '@/lib/types';
import { getProducts } from '@/lib/data/products';
import { getFeaturedAccommodation } from '@/lib/data/featured-accommodation';
import { getPromotions } from '@/lib/data/promotions';
import { testimonials } from '@/lib/data/testimonials';
import { accommodations } from '@/lib/data/accommodations';
import { Skeleton } from '@/components/ui/skeleton';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import TestimonialSlider from '@/components/testimonial-slider';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[] | null>(null);
  const [featuredAccommodation, setFeaturedAccommodation] = useState<FeaturedAccommodation | null>(null);
  const [promotions, setPromotions] = useState<Promotion[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [allProducts, accommodationData, allPromotions] = await Promise.all([
        getProducts(),
        getFeaturedAccommodation(),
        getPromotions(),
      ]);
      const featured = allProducts
        .filter(p => p.isFeatured && p.status === 'published')
        .sort((a, b) => {
          if (a.featuredOrder === undefined && b.featuredOrder === undefined) return 0;
          if (a.featuredOrder === undefined) return 1;
          if (b.featuredOrder === undefined) return -1;
          return a.featuredOrder - b.featuredOrder;
        });
      setFeaturedProducts(featured);
      setFeaturedAccommodation(accommodationData);
      setPromotions(allPromotions.filter(p => p.status === 'published'));
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <HeroSection />

      {/* ====== SERVICES ====== */}
      <section className="section-padding bg-background">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
            <div>
              <span className="section-label">Experiencias</span>
              <h2 className="section-title">Descubrí lo que tenemos para vos</h2>
              <p className="section-description">
                Excursiones y transfers para recorrer La Rioja a tu manera.
              </p>
            </div>
            <Button variant="ghost" asChild className="mt-4 sm:mt-0 text-accent hover:text-accent/80">
              <Link href="/viajes">
                Ver todos <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts === null
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              : featuredProducts.length === 0
              ? (
                  <p className="text-center col-span-full py-16 text-muted-foreground">
                    Próximamente nuevas experiencias.
                  </p>
                )
              : featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}

          </div>
        </div>
      </section>

      {/* ====== PROMOTIONS ====== */}
      <section className="section-padding bg-secondary/40" aria-labelledby="promotions-heading">
        <div className="section-container">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="promotions-heading" className="section-title">Promociones de viajes</h2>
              <p className="section-description">Paquetes y experiencias para aprovechar tu viaje por La Rioja.</p>
            </div>
            <Link href="/promociones" className="inline-flex min-h-11 items-center self-start border-b-2 border-accent text-sm font-semibold text-accent hover:text-foreground sm:self-auto">
              Ver todas las promociones
            </Link>
          </div>

          {promotions === null ? (
            <div className="grid gap-6 md:grid-cols-2 lg:gap-8" aria-label="Cargando promociones">
              {[0, 1].map((item) => <Skeleton key={item} className="aspect-[16/10] w-full rounded-2xl" />)}
            </div>
          ) : promotions.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
              {promotions.map((promo) => (
                <article key={promo.id} className="flex min-w-0 flex-col">
                  <Link href={`/promociones/${promo.slug}`} className="group block overflow-hidden rounded-2xl focus-visible:ring-offset-secondary">
                    <div className="relative aspect-[16/10] bg-background">
                      <Image
                        src={promo.imageUrl}
                        alt={promo.title}
                        fill
                        sizes="(max-width: 767px) 100vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col border-b border-border pb-5 pt-5">
                    <h3 className="font-headline text-xl font-bold leading-tight text-foreground sm:text-2xl">{promo.title}</h3>
                    <p className="mb-5 mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{promo.description}</p>
                    <Link href={`/promociones/${promo.slug}`} className="mt-auto inline-flex min-h-11 items-center self-start border-b-2 border-accent text-sm font-semibold text-accent hover:text-foreground">
                      Ver promoción <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="border-t border-border py-8 text-muted-foreground">Por ahora no hay promociones disponibles. Podés explorar nuestras excursiones y transfers.</p>
          )}
        </div>
      </section>

      {/* ====== ACCOMMODATION ====== */}
      <section className="section-padding bg-background">
        <div className="section-container">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
            <div>
              <span className="section-label">Alojamientos</span>
              <h2 className="section-title">Tu base en Villa Unión</h2>
              <p className="section-description">
                Loft, casas y departamentos cerca del Parque Nacional Talampaya.
              </p>
            </div>
            <Button variant="ghost" asChild className="mt-4 sm:mt-0 text-accent hover:text-accent/80">
              <Link href="/alojamientos">
                Ver todos <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {featuredAccommodation === null ? (
            <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
          ) : (
            <div className="grid md:grid-cols-5 gap-0 rounded-3xl overflow-hidden bg-card border">
              <div className="md:col-span-3 relative aspect-[4/3] md:aspect-auto md:min-h-[420px]">
                <Image
                  src={featuredAccommodation.imageUrl}
                  alt={featuredAccommodation.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              <div className="md:col-span-2 p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 mb-5">
                  <BedDouble className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-headline text-2xl lg:text-3xl font-bold text-foreground mb-3">
                  {featuredAccommodation.title}
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {featuredAccommodation.description}
                </p>
                <Button asChild className="btn-primary self-start">
                  <Link href={featuredAccommodation.buttonLink}>
                    {featuredAccommodation.buttonText}
                    <ArrowRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-x-7 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {accommodations.map((acc) => (
              <Link
                key={acc.slug}
                href={`/alojamientos/${acc.slug}`}
                className="group flex min-h-16 items-center gap-3 border-b border-border py-2 hover:border-accent"
              >
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                  <Image src={acc.images[0].src} alt="" fill sizes="48px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold leading-tight text-foreground group-hover:text-accent">{acc.name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{acc.capacity}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== SHORTS ====== */}
      <section className="section-padding bg-background">
        <div className="section-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                  <Play className="h-5 w-5 fill-accent text-accent" />
                </div>
                <span className="section-label mb-0">Shorts Turísticos</span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground text-balance">
                Mirá La Rioja en segundos
              </h2>
              <p className="text-lg text-muted-foreground max-w-lg">
                Talampaya, Laguna Brava, la Cuesta de Miranda y más. Videos cortos que te van a hacer querer venir.
              </p>
              <Button asChild className="btn-primary">
                <Link href="/shorts">
                  Ver Shorts
                  <Play className="ml-1 h-4 w-4 fill-current" />
                </Link>
              </Button>
            </div>

            {/* Preview */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Talampaya', emoji: '🏜️' },
                { label: 'Laguna Brava', emoji: '🏔️' },
                { label: 'Cuesta Miranda', emoji: '🛣️' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href="/shorts"
                  className="group relative aspect-[9/14] rounded-2xl overflow-hidden bg-foreground/5 hover:bg-foreground/10 transition-colors"
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
                    <span className="text-4xl">{item.emoji}</span>
                    <span className="text-xs font-medium text-muted-foreground group-hover:text-accent transition-colors">
                      {item.label}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== TESTIMONIALS ====== */}
      <section className="section-padding bg-secondary/30">
        <div className="section-container">
          <div className="text-center mb-12">
            <span className="section-label">Testimonios</span>
            <h2 className="section-title">Lo que dicen nuestros viajeros</h2>
          </div>
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

      {/* ====== WHY US ====== */}
      <section className="section-padding bg-background">
        <div className="section-container">
          <div className="text-center mb-14">
            <span className="section-label">Por qué Go Aventura</span>
            <h2 className="section-title">La Rioja es nuestra casa</h2>
            <p className="section-description mx-auto">
              Somos locales, conocemos cada rincón y nos importa que tu experiencia sea perfecta.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: '🏔️', title: 'Guías expertos locales', desc: 'Conocemos cada rincón de La Rioja. Te llevamos a los lugares que no vas a encontrar en ninguna guía.' },
              { icon: '🚗', title: 'Vehículos preparados', desc: '4x4 en perfecto estado, seguros y conductores profesionales. Tu seguridad no es negociable.' },
              { icon: '💬', title: 'Atención personalizada', desc: 'Cada viajero es único. Adaptamos cada experiencia a tus gustos, tiempos y necesidades.' },
              { icon: '💳', title: 'Todos los medios de pago', desc: 'Efectivo, transferencia, Mercado Pago y tarjetas. Elegí la opción que más te convenga.' },
              { icon: '📞', title: 'Soporte 24/7', desc: 'Estamos disponibles por WhatsApp antes, durante y después de tu viaje.' },
              { icon: '✨', title: 'Experiencias únicas', desc: 'No somos un catálogo genérico. Creamos experiencias a medida para cada visitante.' },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-4">
                <span className="text-4xl">{item.icon}</span>
                <h3 className="font-headline text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== TRUST + CTA ====== */}
      <section className="section-padding bg-secondary/30">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {[
              { icon: ShieldCheck, label: 'Reserva protegida' },
              { icon: CreditCard, label: 'Todos los medios de pago' },
              { icon: Clock, label: 'Atención 24/7' },
              { icon: Tag, label: 'Mejor precio garantizado' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-3 text-center">
                <item.icon className="h-8 w-8 text-accent" />
                <p className="text-sm font-medium text-foreground">{item.label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="rounded-3xl border border-border bg-secondary p-10 text-center md:p-14 lg:p-20">
            <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
              ¿Listo para tu próxima aventura?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-lg">
              Reservá y asegurá tu lugar. Respondemos en menos de 24 horas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WhatsAppCtaButton
                predefinedText="Hola! Quiero consultar sobre los servicios de Go Aventura."
                buttonText="Consultar por WhatsApp"
                size="lg"
                className="!bg-primary !text-primary-foreground hover:!bg-primary/90 min-h-[48px] px-8"
              />
              <Button size="lg" variant="outline" asChild className="border-foreground/40 bg-transparent text-foreground hover:bg-background hover:text-foreground min-h-[48px] px-8">
                <Link href="/viajes">
                  Explorar Viajes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
