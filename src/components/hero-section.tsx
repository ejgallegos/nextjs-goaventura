
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ImageSlider from './image-slider';
import { ArrowRight } from 'lucide-react';
import { getSlides } from '@/lib/data/slides';
import { HeroSlide } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

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
      <div className="relative flex items-center justify-center bg-secondary h-[70vh] sm:h-auto sm:py-24 lg:py-32 overflow-hidden">
        <Skeleton className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-foreground/75"></div>
      </div>
    );
  }
  
  const heroImages = slides.map(slide => ({
    src: slide.imageUrl,
    alt: slide.title,
    hint: slide.imageHint || 'adventure landscape',
  }));

  return (
    <div className="relative flex items-center justify-center bg-secondary text-secondary-foreground h-[70vh] sm:h-auto sm:py-24 lg:py-32 overflow-hidden">
      {heroImages.length > 0 && (
        <>
          <div className="absolute inset-0">
            <ImageSlider images={heroImages} className="h-full w-full" />
          </div>
          <div className="absolute inset-0 bg-foreground/75"></div>
        </>
      )}

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {slides.length > 0 && slides[0] ? (
          <>
            <h1
              className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary-foreground [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]"
              dangerouslySetInnerHTML={{ __html: slides[0].title }} // Allow basic HTML like spans
            ></h1>
            {slides[0].subtitle && (
              <p className="mt-6 max-w-xl mx-auto text-lg sm:text-xl text-primary-foreground opacity-90 hidden sm:block [text-shadow:0_2px_4px_rgba(0,0,0,0.4)]">
                {slides[0].subtitle}
              </p>
            )}
            {slides[0].buttonText && slides[0].buttonLink && (
              <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button
                  size="lg"
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105"
                >
                  <Link href={slides[0].buttonLink}>
                    {slides[0].buttonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            )}
          </>
        ) : (
           <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
