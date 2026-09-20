"use client";

import { useState, useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getSlides } from '@/lib/data/slides';
import { HeroSlide } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade } from 'swiper/modules';
import Image from 'next/image';
import { SafeHTML } from '@/components/ui/safe-html';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroSection = () => {
  const [slides, setSlides] = useState<HeroSlide[] | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      const allSlides = await getSlides();
      const publishedSlides = allSlides.filter(s => s.status === 'published');
      setSlides(publishedSlides);
    };
    fetchSlides();
  }, []);

  if (!slides) {
    return (
      <div className="relative h-[60vh] min-h-[480px] md:h-[70vh] overflow-hidden bg-secondary">
        <Skeleton className="absolute inset-0 w-full h-full" />
      </div>
    );
  }

  return (
    <section className="relative h-[65vh] min-h-[32rem] overflow-hidden md:h-[70vh] lg:h-[75vh]">
      <Swiper
        modules={[Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{ clickable: true }}
        loop={slides.length > 1}
        className="h-full w-full"
        style={{ '--swiper-theme-color': 'hsl(var(--primary))' } as CSSProperties}
      >
        {slides.length > 0 ? (
          slides.map((slide, idx) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full w-full">
                {/* Image */}
                <Image
                  src={slide.imageUrl}
                  alt={slide.title.replace(/<[^>]*>/g, '')}
                  fill
                  sizes="100vw"
                  quality={85}
                  className="object-cover"
                  priority={idx === 0}
                />

                <div className="absolute inset-0 bg-gradient-to-r from-[#1D2D44]/85 via-[#1D2D44]/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1D2D44]/55 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-20 lg:pb-24">
                  <div className="section-container">
                    <div className="max-w-3xl">
                      <p className="mb-5 text-sm font-semibold text-white/90">Desde Villa Unión, La Rioja</p>
                      <SafeHTML
                        html={slide.title}
                        tagName="h1"
                        className="max-w-[18ch] font-headline text-4xl font-extrabold tracking-tight text-white text-balance leading-[1.07] sm:text-5xl md:text-6xl lg:text-7xl"
                      />
                      {slide.subtitle && (
                        <p className="mt-5 max-w-[52ch] text-base leading-relaxed text-white/90 sm:text-lg md:text-xl">
                          {slide.subtitle}
                        </p>
                      )}
                      {slide.buttonText && slide.buttonLink && (
                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                          <Button size="lg" asChild className="btn-primary text-base">
                            <Link href={slide.buttonLink}>
                              {slide.buttonText}
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className="relative h-full w-full bg-primary">
              <div className="absolute inset-0 bg-gradient-to-r from-[#1D2D44] to-[#3E5C76]" />
              <div className="absolute inset-0 flex flex-col justify-end pb-16 md:pb-20 lg:pb-24">
                <div className="section-container">
                  <div className="max-w-3xl">
                    <p className="mb-5 text-sm font-semibold text-white/90">Desde Villa Unión, La Rioja</p>
                    <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white text-balance leading-[1.1]">
                      Villa Unión es el comienzo de tu viaje
                    </h1>
                    <p className="mt-4 md:mt-6 max-w-xl text-base sm:text-lg md:text-xl text-white/80">
                      Te ayudamos a elegir excursiones, traslados y dónde quedarte en el oeste riojano.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                      <Button size="lg" asChild className="btn-primary text-base">
                        <Link href="/viajes">
                          Ver excursiones
                        </Link>
                      </Button>
                      <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                        <Link href="/alojamientos">
                          Ver Alojamientos
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        )}
      </Swiper>

    </section>
  );
};

export default HeroSection;
