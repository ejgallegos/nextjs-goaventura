
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getSlides } from '@/lib/data/slides';
import { HeroSlide } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';


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
      <div className="relative flex items-center justify-center bg-secondary h-[70vh] overflow-hidden">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-foreground/75"></div>
      </div>
    );
  }

  return (
    <section className="relative h-[70vh] bg-secondary text-secondary-foreground overflow-hidden">
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={slides.length > 1}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="h-full w-full"
        >
            {slides.length > 0 ? (
                slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                       <div className="relative h-full w-full flex items-center justify-center text-center">
                         <div className="absolute inset-0">
                             <Image
                                src={slide.imageUrl}
                                alt={slide.title}
                                fill
                                className="object-cover"
                                priority
                                data-ai-hint={slide.imageHint || 'adventure landscape'}
                            />
                        </div>
                        <div className="absolute inset-0 bg-foreground/75"></div>
                         <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                            <h1
                                className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary-foreground [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]"
                                dangerouslySetInnerHTML={{ __html: slide.title }}
                            ></h1>
                            {slide.subtitle && (
                                <p className="mt-6 max-w-xl mx-auto text-lg sm:text-xl text-primary-foreground opacity-90 hidden sm:block [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]">
                                    {slide.subtitle}
                                </p>
                            )}
                            {slide.buttonText && slide.buttonLink && (
                                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                                    <Button
                                        size="lg"
                                        asChild
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105"
                                    >
                                        <Link href={slide.buttonLink}>
                                            {slide.buttonText}
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                       </div>
                    </SwiperSlide>
                ))
            ) : (
                 <SwiperSlide>
                    <div className="relative h-full w-full flex items-center justify-center text-center">
                     <div className="absolute inset-0 bg-foreground/75"></div>
                     <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                         <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary-foreground [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]">
                            Reserva tu próxima{" "}
                            <span className="text-primary-foreground">
                                ¡Go aventura!
                            </span>
                        </h1>
                         <p className="mt-6 max-w-xl mx-auto text-lg sm:text-xl text-primary-foreground opacity-90 hidden sm:block [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]">
                            Descubre excursiones emocionantes, transfers confiables y
                            los mejores alojamientos con Go aventura. Tu viaje soñado
                            comienza aquí.
                        </p>
                      </div>
                    </div>
                 </SwiperSlide>
            )}
        </Swiper>
    </section>
  );
};

export default HeroSection;
