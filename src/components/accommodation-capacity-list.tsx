'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, BedDouble, Users, Bath } from 'lucide-react';

interface AccommodationCardData {
  id: string;
  slug: string;
  name: string;
  capacity: string;
  location: string;
  shortDescription: string;
  bedrooms: number;
  bathrooms: number;
  image: { src: string; alt: string } | null;
}

interface AccommodationCapacityListProps {
  accommodations: AccommodationCardData[];
}

const getMaximumCapacity = (capacity: string): number | null => {
  const match = capacity.trim().match(/^(\d+)(?:\s*-\s*(\d+))?\s*(?:personas?)?$/i);

  if (!match) return null;

  return Number(match[2] ?? match[1]);
};

const AccommodationCapacityList = ({ accommodations }: AccommodationCapacityListProps) => {
  const [guestCount, setGuestCount] = useState('any');
  const filteredAccommodations = useMemo(() => {
    if (guestCount === 'any') return accommodations;

    const requestedGuests = Number(guestCount);
    return accommodations.filter((accommodation) => {
      const maximumCapacity = getMaximumCapacity(accommodation.capacity);
      return maximumCapacity !== null && maximumCapacity >= requestedGuests;
    });
  }, [accommodations, guestCount]);

  const resetFilter = () => setGuestCount('any');
  const resultMessage = `${filteredAccommodations.length} ${filteredAccommodations.length === 1 ? 'alojamiento encontrado' : 'alojamientos encontrados'}`;

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 rounded-xl border border-border bg-secondary/40 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-5">
        <div className="w-full max-w-sm">
          <label htmlFor="guest-count" className="mb-2 block text-sm font-semibold text-foreground">
            ¿Cuántas personas viajan?
          </label>
          <select
            id="guest-count"
            value={guestCount}
            onChange={(event) => setGuestCount(event.target.value)}
            className="min-h-12 w-full rounded-lg border border-border bg-background px-3 text-base text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            <option value="any">Cualquier capacidad</option>
            {Array.from({ length: 8 }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>{count} {count === 1 ? 'persona' : 'personas'}</option>
            ))}
          </select>
        </div>
        <div className="flex min-h-12 flex-wrap items-center justify-between gap-3 sm:justify-end">
          <p role="status" aria-live="polite" aria-atomic="true" className="text-sm font-medium text-muted-foreground">
            {resultMessage}
          </p>
          {guestCount !== 'any' && (
            <button
              type="button"
              onClick={resetFilter}
              className="inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-sm font-semibold text-foreground underline decoration-border underline-offset-4 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Limpiar filtro
            </button>
          )}
        </div>
      </div>

      {filteredAccommodations.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
          {filteredAccommodations.map((acc) => (
            <Link
              key={acc.id}
              href={`/alojamientos/${acc.slug}`}
              className="group block min-w-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-secondary">
                {acc.image && (
                  <Image
                    src={acc.image.src}
                    alt={acc.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.03]"
                  />
                )}
              </div>
              <div className="space-y-3 pt-5">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <h3 className="min-w-0 max-w-[25ch] font-headline text-xl font-bold leading-tight text-foreground group-hover:text-accent sm:text-2xl">
                    {acc.name}
                  </h3>
                  <span className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-foreground">
                    <Users className="h-4 w-4 text-accent" aria-hidden="true" />
                    {acc.capacity}
                  </span>
                </div>
                <div className="flex items-start gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 break-words">{acc.location}</span>
                </div>
                <p className="max-w-[58ch] text-base leading-relaxed text-muted-foreground">{acc.shortDescription}</p>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-border pt-3 text-sm text-foreground">
                  <span className="inline-flex items-center gap-2">
                    <BedDouble className="h-4 w-4 text-accent" aria-hidden="true" />
                    {acc.bedrooms} {acc.bedrooms === 1 ? 'dormitorio' : 'dormitorios'}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Bath className="h-4 w-4 text-accent" aria-hidden="true" />
                    {acc.bathrooms} baño{acc.bathrooms > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="pt-1 text-sm font-semibold text-accent underline decoration-accent/40 underline-offset-4 group-hover:decoration-accent">Ver alojamiento</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-secondary/30 px-5 py-10 text-center">
          <p className="font-headline text-lg font-semibold text-foreground">No encontramos alojamientos para esa cantidad de personas.</p>
          <p className="mt-2 text-sm text-muted-foreground">Probá con otra cantidad o consultanos para ayudarte a elegir.</p>
          <button
            type="button"
            onClick={resetFilter}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Mostrar todos los alojamientos
          </button>
        </div>
      )}
    </>
  );
};

export default AccommodationCapacityList;
