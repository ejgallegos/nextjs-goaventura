"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, BedDouble, Mountain, MessageCircle } from 'lucide-react';
import { getSlides } from '@/lib/data/slides';
import { HeroSlide } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { SafeHTML } from '@/components/ui/safe-html';

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
      <div className="relative flex items-center justify-center bg-secondary h-[75vh] min-h-[600px] overflow-hidden">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-foreground/30"></div>
      </div>
    );
  }

  return (
    <section className="relative h-[75vh] min-h-[600px] bg-secondary text-secondary-foreground overflow-hidden">
        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            loop={slides.length > 1}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            className="h-full w-full absolute inset-0 z-0"
        >
            {slides.length > 0 ? (
                slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                       <div className="relative h-full w-full flex items-center justify-center text-center pb-24">
                         <div className="absolute inset-0">
                              <Image
                                src={slide.imageUrl}
                                alt={slide.title}
                                fill
                                sizes="100vw"
                                quality={85}
                                className="object-cover"
                                priority
                                data-ai-hint={slide.imageHint || 'adventure landscape'}
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
                         <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-12">
                            <SafeHTML
                                html={slide.title}
                                tagName="h1"
                                className="font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white drop-shadow-2xl"
                            />
                            {slide.subtitle && (
                                <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl lg:text-2xl text-white/95 hidden sm:block drop-shadow-lg font-medium leading-relaxed">
                                    {slide.subtitle}
                                </p>
                            )}
                            {slide.buttonText && slide.buttonLink && (
                                <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                                    <Button
                                        size="lg"
                                        asChild
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl transition-all hover:scale-105 hover:-translate-y-1 h-14 px-8 text-lg rounded-full"
                                    >
                                        <Link href={slide.buttonLink} target={slide.buttonLink.startsWith('http') ? '_blank' : undefined}>
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
                    <div className="relative h-full w-full flex items-center justify-center text-center pb-24">
                     <div className="absolute inset-0 bg-foreground/50"></div>
                     <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-12">
                         <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight text-white">
                            Descubrí <span className="text-primary">La Rioja</span>
                        </h1>
                      </div>
                    </div>
                 </SwiperSlide>
            )}
        </Swiper>

        {/* Floating Quick Actions Bar (CRO) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-8 pt-12 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
           <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 sm:p-3 shadow-2xl flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                 
                 <Link href="/alojamientos" className="flex-1 flex items-center justify-center gap-3 bg-black/40 hover:bg-primary/90 text-white rounded-2xl py-3 px-4 transition-all duration-300 group">
                    <BedDouble className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                       <span className="block font-bold text-sm sm:text-base leading-tight">Alojamientos</span>
                       <span className="block text-[10px] sm:text-xs text-white/70">Buscar disponibilidad</span>
                    </div>
                 </Link>

                 <Link href="/viajes?filter=Excursion" className="flex-1 flex items-center justify-center gap-3 bg-black/40 hover:bg-primary/90 text-white rounded-2xl py-3 px-4 transition-all duration-300 group">
                    <Mountain className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                       <span className="block font-bold text-sm sm:text-base leading-tight">Excursiones 4x4</span>
                       <span className="block text-[10px] sm:text-xs text-white/70">Talampaya y Laguna Brava</span>
                    </div>
                 </Link>

                 <a href="https://wa.me/5493825575566?text=Hola!%20Quiero%20planificar%20mi%20viaje." target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-3 bg-whatsapp/90 hover:bg-whatsapp text-white rounded-2xl py-3 px-4 transition-all duration-300 group shadow-lg shadow-whatsapp/20">
                    <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                       <span className="block font-bold text-sm sm:text-base leading-tight">Asesoría Gratis</span>
                       <span className="block text-[10px] sm:text-xs text-white/90">Escribinos por WhatsApp</span>
                    </div>
                 </a>

              </div>
           </div>
        </div>
    </section>
  );
};

export default HeroSection;
