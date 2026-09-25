'use client';

import { useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export interface StayExperienceSlide {
  id: string;
  stay: {
    name: string;
    href: string;
    imageUrl: string;
    imageAlt: string;
  };
  experience: {
    title: string;
    href: string;
    imageUrl: string;
    imageAlt: string;
    description: string;
    typeLabel: string;
  };
}

interface StayExperienceSliderProps {
  slides: StayExperienceSlide[];
}

export default function StayExperienceSlider({ slides }: StayExperienceSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (slides.length < 2) return null;

  const currentSlide = slides[activeIndex];
  const showPrevious = () => setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  const showNext = () => setActiveIndex((index) => (index + 1) % slides.length);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNext();
    }
  };

  return (
    <section
      aria-labelledby="stay-experience-heading"
      aria-roledescription="carousel"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="section-padding bg-[#1D2D44] text-[#EAF2F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9DCE8] focus-visible:ring-inset"
    >
      <div className="section-container">
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="section-label text-[#EAF2F8]/80">Una base para tu viaje</span>
            <h2 id="stay-experience-heading" className="section-title max-w-[18ch] text-[#EAF2F8]">Dormí en Villa Unión. Salí a descubrir.</h2>
            <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-[#EAF2F8]/80 sm:text-base">Elegí dónde descansar y sumá una salida para conocer los paisajes riojanos.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto" role="group" aria-label="Controles del carrusel">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Ver combinación anterior"
              aria-controls="stay-experience-slide"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#C9DCE8]/40 text-[#EAF2F8] transition-colors hover:bg-[#3E5C76] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9DCE8] motion-reduce:transition-none"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Ver combinación siguiente"
              aria-controls="stay-experience-slide"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#C9DCE8]/40 text-[#EAF2F8] transition-colors hover:bg-[#3E5C76] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9DCE8] motion-reduce:transition-none"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="ml-2 min-w-[3.5rem] text-right text-sm tabular-nums text-[#EAF2F8]/80" aria-hidden="true">
              {activeIndex + 1} <span aria-hidden="true">/</span> {slides.length}
            </span>
          </div>
        </div>

        <p className="sr-only" aria-live="polite" aria-atomic="true">
          Combinación {activeIndex + 1} de {slides.length}: {currentSlide.stay.name} y {currentSlide.experience.title}.
        </p>

        <article
          id="stay-experience-slide"
          role="group"
          aria-roledescription="diapositiva"
          aria-label={`${activeIndex + 1} de ${slides.length}: ${currentSlide.stay.name} y ${currentSlide.experience.title}`}
          className="grid overflow-hidden rounded-3xl border border-[#8AA9C4]/40 bg-[#3E5C76]/35 shadow-2xl md:grid-cols-[1.05fr_0.95fr]"
        >
          <div className="relative grid grid-cols-2 gap-2 p-2 sm:gap-3 sm:p-3">
            <Link
              href={currentSlide.stay.href}
              aria-label={`Ver alojamiento ${currentSlide.stay.name}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-[#3E5C76] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9DCE8] focus-visible:ring-inset md:aspect-[4/5]"
            >
              <Image
                src={currentSlide.stay.imageUrl}
                alt={currentSlide.stay.imageAlt}
                fill
                sizes="(max-width: 639px) 46vw, (max-width: 767px) 44vw, (max-width: 1279px) 25vw, 340px"
                quality={80}
                className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03] motion-reduce:transition-none"
              />
              <span className="absolute inset-x-2 bottom-2 rounded-lg bg-[#1D2D44]/90 px-2 py-2 text-center text-xs font-semibold text-[#EAF2F8] backdrop-blur-sm sm:inset-x-3 sm:bottom-3 sm:text-sm">
                {currentSlide.stay.name}
              </span>
            </Link>
            <Link
              href={currentSlide.experience.href}
              aria-label={`Ver experiencia ${currentSlide.experience.title}`}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-[#3E5C76] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9DCE8] focus-visible:ring-inset md:aspect-[4/5]"
            >
              <Image
                src={currentSlide.experience.imageUrl}
                alt={currentSlide.experience.imageAlt}
                fill
                sizes="(max-width: 639px) 46vw, (max-width: 767px) 44vw, (max-width: 1279px) 25vw, 340px"
                quality={80}
                className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03] motion-reduce:transition-none"
              />
              <span className="absolute inset-x-2 bottom-2 rounded-lg bg-[#1D2D44]/90 px-2 py-2 text-center text-xs font-semibold text-[#EAF2F8] backdrop-blur-sm sm:inset-x-3 sm:bottom-3 sm:text-sm">
                {currentSlide.experience.typeLabel}
              </span>
            </Link>
            <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#8AA9C4]/60 bg-[#1D2D44] text-[#C9DCE8] shadow-lg">
              <Plus className="h-5 w-5" />
            </span>
          </div>

          <div className="flex min-w-0 flex-col justify-center p-5 sm:p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#C9DCE8]">Tu estadía + una salida</p>
            <h3 className="mt-3 font-headline text-2xl font-bold leading-tight text-[#EAF2F8] sm:text-3xl">{currentSlide.experience.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[#EAF2F8]/80 sm:text-base">{currentSlide.experience.description}</p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Link
                href={currentSlide.stay.href}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#C9DCE8]/40 px-4 text-center text-sm font-semibold text-[#EAF2F8] transition-colors hover:bg-[#3E5C76] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9DCE8] motion-reduce:transition-none"
              >
                Ver alojamiento <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={currentSlide.experience.href}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#EAF2F8] px-4 text-center text-sm font-semibold text-[#1D2D44] transition-colors hover:bg-[#C9DCE8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9DCE8] motion-reduce:transition-none"
              >
                Ver experiencia <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-5 text-xs text-[#EAF2F8]/80">Combiná tu descanso con la aventura que más te guste.</p>
          </div>
        </article>
      </div>
    </section>
  );
}
