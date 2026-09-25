"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HomeHeroSlide {
  id: string;
  type: 'Alojamiento' | 'Experiencia' | 'Promoción';
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface HomeHeroSliderProps {
  slides: HomeHeroSlide[];
  statusMessage?: string;
}

export default function HomeHeroSlider({ slides, statusMessage }: HomeHeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (slides.length === 0) return null;

  const activeSlide = slides[activeIndex] ?? slides[0];
  const showPrevious = () => setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % slides.length);

  return (
    <section
      className="relative isolate overflow-hidden bg-[#1D2D44] text-[#EAF2F8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9DCE8] focus-visible:outline-offset-[-4px]"
      aria-label="Alojamientos y experiencias en Villa Unión"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          showPrevious();
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          showNext();
        }
      }}
    >
      <Image
        key={activeSlide.id}
        src={activeSlide.image}
        alt={activeSlide.imageAlt}
        fill
        priority={activeIndex === 0}
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover object-center"
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#1D2D44]/95 via-[#1D2D44]/75 to-[#1D2D44]/25" aria-hidden="true" />

      <div className="section-container relative z-20 flex min-h-[34rem] items-center py-16 sm:min-h-[39rem] lg:min-h-[42rem]">
        <div className="max-w-3xl py-8">
          <p className="mb-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#C9DCE8]">
            Villa Unión, La Rioja <span aria-hidden="true">·</span> {activeSlide.type}
          </p>
          <div role="group" aria-roledescription="slide" aria-label={`${activeIndex + 1} de ${slides.length}`} aria-live="polite">
            <h1 className="max-w-[13ch] font-headline text-4xl font-extrabold leading-[1.04] tracking-tight text-balance sm:text-6xl lg:text-7xl">
              {activeSlide.title}
            </h1>
            <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-[#EAF2F8]/90 sm:text-lg">
              {activeSlide.description}
            </p>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <span className="mr-1 text-sm font-medium text-[#C9DCE8]" aria-hidden="true">
              {String(activeIndex + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Ver contenido anterior"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#C9DCE8]/70 bg-[#1D2D44]/45 text-[#EAF2F8] transition-colors hover:bg-[#3E5C76] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAF2F8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D2D44] motion-reduce:transition-none"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Ver contenido siguiente"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#C9DCE8]/70 bg-[#1D2D44]/45 text-[#EAF2F8] transition-colors hover:bg-[#3E5C76] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAF2F8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1D2D44] motion-reduce:transition-none"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            {statusMessage && <p role="status" className="basis-full text-sm text-[#C9DCE8]">{statusMessage}</p>}
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-16 bg-gradient-to-t from-[#1D2D44]/30 to-transparent" aria-hidden="true" />
    </section>
  );
}
