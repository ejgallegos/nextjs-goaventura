"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BedDouble, Bath, MapPin, Play, ShieldCheck, Users } from 'lucide-react';
import { accommodations } from '@/lib/data/accommodations';
import { getFeaturedAccommodation } from '@/lib/data/featured-accommodation';
import { getProducts } from '@/lib/data/products';
import { getPromotions } from '@/lib/data/promotions';
import type { FeaturedAccommodation, Product, Promotion, Testimonial } from '@/lib/types';
import { testimonials } from '@/lib/data/testimonials';
import ProductCard from '@/components/product-card';
import StayExperienceSlider, { type StayExperienceSlide } from '@/components/stay-experience-slider';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import TestimonialSlider from '@/components/testimonial-slider';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type PromotionProduct = Omit<Product, 'category'> & { category: 'Promocion' };

interface JourneyOffer {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  href: string;
  typeLabel: string;
  accommodationName?: string;
}

function toPromotionProduct(promotion: Promotion): PromotionProduct {
  return {
    id: promotion.id,
    name: promotion.title,
    slug: `/promociones/${promotion.slug}`,
    description: promotion.description,
    shortDescription: promotion.description,
    imageUrl: promotion.imageUrl,
    imageHint: promotion.imageHint,
    category: 'Promocion',
    price: promotion.price,
    currency: promotion.currency,
    status: promotion.status,
    isFeatured: promotion.isFeatured,
  };
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[] | null>(null);
  const [publishedProducts, setPublishedProducts] = useState<Product[] | null>(null);
  const [featuredAccommodation, setFeaturedAccommodation] = useState<FeaturedAccommodation | null>(null);
  const [promotions, setPromotions] = useState<Promotion[] | null>(null);
  const [dataError, setDataError] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const [allProducts, accommodationData, allPromotions] = await Promise.all([
          getProducts(),
          getFeaturedAccommodation(),
          getPromotions(),
        ]);
        if (!active) return;
        const featured = allProducts
          .filter((product) => product.isFeatured && product.status === 'published')
          .sort((a, b) => (a.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (b.featuredOrder ?? Number.MAX_SAFE_INTEGER));
        setPublishedProducts(allProducts.filter((product) => product.status === 'published'));
        setFeaturedProducts(featured);
        setFeaturedAccommodation(accommodationData);
        setPromotions(allPromotions.filter((promotion) => promotion.status === 'published'));
      } catch {
        if (!active) return;
        setFeaturedProducts([]);
        setPublishedProducts([]);
        setFeaturedAccommodation(null);
        setPromotions([]);
        setDataError(true);
      }
    };
    void fetchData();
    return () => { active = false; };
  }, []);

  const topProducts = featuredProducts ?? [];
  const topPromotion = (promotions ?? []).slice(0, 1).map(toPromotionProduct);
  const initialComplementaryOffers = topPromotion.length > 0
    ? [...topProducts.slice(0, 2), ...topPromotion]
    : topProducts.slice(0, 3);
  const journeyOffers: JourneyOffer[] = [
    ...(publishedProducts ?? []).map((product) => ({
      id: product.id,
      title: product.name,
      description: product.shortDescription || product.description,
      imageUrl: product.imageUrl,
      href: `/viajes/${product.slug}`,
      typeLabel: product.category === 'Transfer' ? 'Transfer' : 'Excursión',
    })),
    ...(promotions ?? []).map((promotion) => ({
      id: promotion.id,
      title: promotion.title,
      description: promotion.description,
      imageUrl: promotion.imageUrl,
      href: `/promociones/${promotion.slug}`,
      typeLabel: 'Promoción',
      accommodationName: promotion.accommodationName,
    })),
  ];
  const orderedJourneyOffers = [
    journeyOffers.find((offer) => offer.typeLabel !== 'Promoción'),
    journeyOffers.find((offer) => offer.typeLabel === 'Promoción'),
    ...journeyOffers,
  ].filter((offer, index, offers): offer is JourneyOffer => Boolean(offer) && offers.findIndex((candidate) => candidate?.id === offer?.id) === index).slice(0, 2);
  const journeySlides: StayExperienceSlide[] = orderedJourneyOffers.length >= 2
    ? orderedJourneyOffers.map((offer, index) => {
      const accommodationName = offer.accommodationName?.trim().toLocaleLowerCase();
      const linkedAccommodation = accommodationName
        ? accommodations.find((accommodation) => accommodation.name.toLocaleLowerCase().includes(accommodationName) || accommodationName.includes(accommodation.name.toLocaleLowerCase()))
        : undefined;
      const accommodation = linkedAccommodation ?? accommodations[index % accommodations.length];
      return {
        id: offer.id,
        stay: {
          name: accommodation.name,
          href: `/alojamientos/${accommodation.slug}`,
          imageUrl: accommodation.images[0].src,
          imageAlt: accommodation.images[0].alt,
        },
        experience: {
          title: offer.title,
          href: offer.href,
          imageUrl: offer.imageUrl,
          imageAlt: `Imagen de ${offer.title}`,
          description: offer.description,
          typeLabel: offer.typeLabel,
        },
      };
    })
    : [];
  const sliderOfferIds = new Set(journeySlides.map((slide) => slide.id));
  const complementaryOffers = journeySlides.length > 0
    ? initialComplementaryOffers.filter((offer) => !sliderOfferIds.has(offer.id)).slice(0, 3 - journeySlides.length)
    : initialComplementaryOffers;
  const heroImage = accommodations[0]?.images[0];

  return (
    <div className="flex flex-col">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white" aria-labelledby="home-heading">
        {heroImage && (
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover object-center"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/20" />
        <div className="section-container flex min-h-[34rem] items-center py-16 sm:min-h-[39rem] lg:min-h-[42rem]">
          <div className="max-w-2xl py-8">
            <p className="mb-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
              <MapPin className="h-4 w-4" aria-hidden="true" /> Villa Unión, La Rioja
            </p>
            <h1 id="home-heading" className="max-w-[13ch] font-headline text-4xl font-extrabold leading-[1.04] tracking-tight text-balance sm:text-6xl lg:text-7xl">
              Tu estadía empieza cerca de todo.
            </h1>
            <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-white/85 sm:text-lg">
              Elegí tu alojamiento en Villa Unión y descubrí Talampaya, la Cuesta de Miranda y los paisajes de La Rioja a tu ritmo.
            </p>
            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="min-h-12 rounded-xl bg-white px-6 text-slate-950 hover:bg-white/90">
                <Link href="/alojamientos">Ver alojamientos <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
              </Button>
              <WhatsAppCtaButton
                predefinedText="Hola, quiero consultar disponibilidad de alojamientos en Villa Unión."
                buttonText="Consultar disponibilidad"
                variant="outline"
                size="lg"
                className="min-h-12 border-white/60 bg-white/10 px-6 text-white hover:bg-white/20 hover:text-white"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background/30 to-transparent" />
      </section>

      <section className="section-padding bg-background" aria-labelledby="stays-heading">
        <div className="section-container">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-label">Alojamientos en Villa Unión</span>
              <h2 id="stays-heading" className="section-title">Encontrá tu lugar para descansar</h2>
              <p className="section-description">Lofts, casas y departamentos para hacer base cerca de Talampaya.</p>
            </div>
            <Link href="/alojamientos" className="inline-flex min-h-11 items-center gap-2 self-start border-b-2 border-accent text-sm font-semibold text-accent hover:text-foreground sm:self-auto">
              Ver todos los alojamientos <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {accommodations.slice(0, 4).map((accommodation) => (
              <Link key={accommodation.id} href={`/alojamientos/${accommodation.slug}`} className="group min-w-0 rounded-2xl focus-visible:outline-none">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
                  <Image
                    src={accommodation.images[0].src}
                    alt={accommodation.images[0].alt}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
                  />
                </div>
                <div className="pt-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="min-w-0 font-headline text-lg font-bold leading-tight text-foreground group-hover:text-accent">{accommodation.name}</h3>
                    <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground"><Users className="h-4 w-4" aria-hidden="true" />{accommodation.capacity}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{accommodation.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 grid min-w-0 overflow-hidden rounded-3xl border border-border bg-secondary/50 md:grid-cols-2">
            <div className="relative aspect-[4/3] min-w-0 md:aspect-auto md:min-h-[21rem]">
              {featuredAccommodation ? (
                <Image src={featuredAccommodation.imageUrl} alt={featuredAccommodation.title} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
              ) : heroImage ? (
                <Image src={heroImage.src} alt={heroImage.alt} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-cover" />
              ) : null}
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
              <span className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-accent"><BedDouble className="h-4 w-4" aria-hidden="true" /> Alojamiento destacado</span>
              <h3 className="font-headline text-2xl font-bold text-foreground sm:text-3xl">{featuredAccommodation?.title ?? 'Alojamiento en Villa Unión'}</h3>
              <p className="mt-4 max-w-[55ch] text-base leading-relaxed text-muted-foreground">
                {featuredAccommodation?.description ?? 'Conocé nuestras opciones de alojamiento y encontrá la estadía que mejor se adapta a tu viaje.'}
              </p>
              <Button asChild className="mt-6 min-h-11 self-start rounded-xl">
                <Link href={featuredAccommodation?.buttonLink || '/alojamientos'}>{featuredAccommodation?.buttonText || 'Ver alojamientos'} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {publishedProducts !== null && promotions !== null && journeySlides.length > 0 && (
        <StayExperienceSlider slides={journeySlides} />
      )}

      <section className="section-padding bg-secondary/40" aria-labelledby="complement-heading">
        <div className="section-container">
          <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-label">Después de elegir dónde dormir</span>
              <h2 id="complement-heading" className="section-title">Completá tu estadía</h2>
              <p className="section-description">Sumá una excursión, un transfer o una promoción para recorrer la región.</p>
            </div>
            <Link href="/viajes" className="inline-flex min-h-11 items-center gap-2 self-start border-b-2 border-accent text-sm font-semibold text-accent hover:text-foreground sm:self-auto">
              Ver excursiones y viajes <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          {featuredProducts === null || publishedProducts === null || promotions === null ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Cargando experiencias complementarias">
              {[0, 1, 2].map((item) => <Skeleton key={item} className="aspect-[3/2] rounded-2xl" />)}
            </div>
          ) : complementaryOffers.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {complementaryOffers.map((product) => <ProductCard key={`${product.category}-${product.id}`} product={product} />)}
            </div>
          ) : (
            <p role="status" className="border-t border-border py-8 text-muted-foreground">
              {dataError ? 'No pudimos cargar las experiencias en este momento. Podés verlas en la sección de viajes.' : journeySlides.length > 0 ? 'Ya viste algunas ideas para completar tu estadía. Explorá el catálogo para descubrir más opciones.' : 'Próximamente vas a encontrar excursiones, transfers y promociones para completar tu estadía.'}
            </p>
          )}
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="section-container">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-5">
              <span className="section-label">Shorts turísticos</span>
              <h2 className="section-title">Mirá La Rioja en segundos</h2>
              <p className="max-w-[52ch] text-base leading-relaxed text-muted-foreground sm:text-lg">Talampaya, Laguna Brava, la Cuesta de Miranda y más. Videos cortos para inspirar tu próxima estadía.</p>
              <Button asChild className="min-h-11 rounded-xl"><Link href="/shorts">Ver Shorts <Play className="ml-2 h-4 w-4 fill-current" aria-hidden="true" /></Link></Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Talampaya', emoji: '🏜️' },
                { label: 'Laguna Brava', emoji: '🏔️' },
                { label: 'Cuesta Miranda', emoji: '🛣️' },
              ].map((item) => (
                <Link key={item.label} href="/shorts" className="group flex aspect-[9/14] min-w-0 flex-col items-center justify-center gap-3 rounded-2xl bg-secondary p-2 text-center transition-colors hover:bg-secondary/70">
                  <span className="text-4xl" aria-hidden="true">{item.emoji}</span>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-accent">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="section-container">
          <div className="mb-10 text-center">
            <span className="section-label">Testimonios</span>
            <h2 className="section-title">Lo que dicen nuestros viajeros</h2>
          </div>
          <TestimonialSlider testimonials={testimonials as Testimonial[]} />
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="section-container">
          <div className="mb-12 text-center">
            <span className="section-label">Por qué Go Aventura</span>
            <h2 className="section-title">La Rioja es nuestra casa</h2>
            <p className="section-description mx-auto">Somos locales, conocemos cada rincón y nos importa que tu experiencia sea perfecta.</p>
          </div>
          <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: '🏔️', title: 'Guías expertos locales', desc: 'Conocemos cada rincón de La Rioja. Te llevamos a los lugares que no vas a encontrar en ninguna guía.' },
              { icon: '🚗', title: 'Vehículos preparados', desc: '4x4 en perfecto estado, seguros y conductores profesionales. Tu seguridad no es negociable.' },
              { icon: '💬', title: 'Atención personalizada', desc: 'Cada viajero es único. Adaptamos cada experiencia a tus gustos, tiempos y necesidades.' },
              { icon: '💳', title: 'Todos los medios de pago', desc: 'Efectivo, transferencia, Mercado Pago y tarjetas. Elegí la opción que más te convenga.' },
              { icon: '📞', title: 'Soporte 24/7', desc: 'Estamos disponibles por WhatsApp antes, durante y después de tu viaje.' },
              { icon: '✨', title: 'Experiencias únicas', desc: 'No somos un catálogo genérico. Creamos experiencias a medida para cada visitante.' },
            ].map((item) => (
              <article key={item.title} className="space-y-3 text-center">
                <span className="text-4xl" aria-hidden="true">{item.icon}</span>
                <h3 className="font-headline text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mx-auto max-w-xs text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
        <div className="section-container">
          <div className="mb-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: ShieldCheck, label: 'Reserva protegida' },
              { icon: Users, label: 'Atención personalizada' },
              { icon: MapPin, label: 'Guías locales' },
              { icon: Bath, label: 'Alojamiento confortable' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-3 text-center">
                <item.icon className="h-8 w-8 text-accent" aria-hidden="true" />
                <p className="text-sm font-medium text-foreground">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-border bg-background p-7 text-center sm:p-12 lg:p-16">
            <h2 className="font-headline text-3xl font-bold text-foreground sm:text-4xl">¿Listo para tu próxima estadía?</h2>
            <p className="mx-auto mb-7 mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">Elegí dónde descansar y te ayudamos a planear el resto del viaje.</p>
            <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="min-h-12 rounded-xl"><Link href="/alojamientos">Ver alojamientos</Link></Button>
              <WhatsAppCtaButton predefinedText="Hola, quiero consultar sobre alojamientos en Villa Unión." buttonText="Consultar por WhatsApp" size="lg" className="min-h-12 px-6" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
