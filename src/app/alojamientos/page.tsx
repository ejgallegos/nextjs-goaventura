import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { accommodations } from '@/lib/data/accommodations';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import { MapPin, BedDouble, Users, Bath, ArrowDown } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Alojamientos en Villa Unión',
  description: 'Loft, casas y departamentos cerca del Parque Nacional Talampaya. La mejor ubicación para tu estadía en La Rioja.',
};

const isFamilySuitable = (accommodation: (typeof accommodations)[number]) =>
  /ideal para familias/i.test(accommodation.shortDescription);

const acceptsPets = (accommodation: (typeof accommodations)[number]) =>
  accommodation.services.some((service) => /se admiten mascotas/i.test(service));

const hasPool = (accommodation: (typeof accommodations)[number]) =>
  accommodation.images.some((image) => /\bpileta\b/i.test(image.alt));

const AlojamientosPage = () => {
  return (
    <div className="bg-background">
      <section className="grid min-h-[30rem] bg-secondary lg:grid-cols-2">
        <div className="relative order-1 min-h-64 sm:min-h-80 lg:order-2 lg:min-h-[34rem]">
          <Image
            src={accommodations[0].images[0].src}
            alt={accommodations[0].images[0].alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-[center_62%]"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
          <p className="absolute bottom-5 left-5 text-sm font-medium text-white sm:left-8">Alojamiento en Villa Unión</p>
        </div>
        <div className="order-2 flex items-center lg:order-1">
          <div className="w-full max-w-xl px-5 py-12 sm:px-8 sm:py-16 lg:ml-auto lg:px-12 xl:px-16">
            <p className="mb-5 text-sm font-semibold text-accent">Alojamientos en Villa Unión</p>
            <h1 className="max-w-[12ch] font-headline text-[clamp(2.6rem,5vw,4.8rem)] font-extrabold leading-[1.06] tracking-tight text-foreground">
              Tu descanso empieza acá.
            </h1>
            <p className="mt-6 max-w-[50ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
              Elegí entre {accommodations.length} alojamientos en Villa Unión y encontrá tu base para recorrer la región.
            </p>
            <a href="#opciones" className="mt-8 inline-flex min-h-12 items-center gap-2 border-b-2 border-accent pb-1 text-sm font-semibold text-foreground hover:text-accent">
              Ver opciones disponibles <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section id="opciones" className="section-container scroll-mt-20 py-14 md:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5 md:mb-10">
          <h2 className="font-headline text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Encontrá tu lugar</h2>
          <p className="text-sm text-muted-foreground">{accommodations.length} opciones para descansar en Villa Unión</p>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
          {accommodations.map((acc) => (
            <Link
              key={acc.id}
              href={`/alojamientos/${acc.slug}`}
              className="group block min-w-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-secondary">
                {acc.images[0] && (
                  <Image
                    src={acc.images[0].src}
                    alt={acc.images[0].alt}
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
                </div>
                <div className="flex items-start gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 break-words">{acc.location}</span>
                </div>
                <ul aria-label={`Características de ${acc.name}`} className="flex flex-wrap gap-2">
                  <li className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-accent/20 bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
                    <Users className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                    {acc.capacity}
                  </li>
                  {isFamilySuitable(acc) && (
                    <li className="inline-flex min-h-7 items-center rounded-full border border-accent/20 bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
                      Ideal para familias
                    </li>
                  )}
                  {acceptsPets(acc) && (
                    <li className="inline-flex min-h-7 items-center rounded-full border border-accent/20 bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
                      Se admiten mascotas
                    </li>
                  )}
                  {hasPool(acc) && (
                    <li className="inline-flex min-h-7 items-center rounded-full border border-accent/20 bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
                      Pileta
                    </li>
                  )}
                </ul>
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

        <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-border pt-8 md:flex-row md:items-center">
          <div>
            <p className="font-headline text-xl font-semibold text-foreground">¿No sabés cuál elegir?</p>
            <p className="mt-1 text-base text-muted-foreground">Contanos cuántas personas viajan y te ayudamos a encontrar lugar.</p>
          </div>
          <WhatsAppCtaButton
            predefinedText="Hola, necesito información sobre los alojamientos en Villa Unión."
            buttonText="Consultar por WhatsApp"
            variant="whatsapp"
            className="min-h-12"
          />
        </div>
      </section>
    </div>
  );
};

export default AlojamientosPage;
