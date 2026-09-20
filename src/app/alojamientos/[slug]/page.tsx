import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import ContactAdvisorButton from '@/components/contact-advisor-button';
import AccommodationGallery from '@/components/accommodation-gallery';
import AccommodationPageTracker from '@/components/accommodation-page-tracker';
import { accommodations, getAccommodationBySlug } from '@/lib/data/accommodations';
import { ArrowLeft, MapPin, Users, BedDouble, Bath, CheckCircle, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

interface AccommodationPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return accommodations.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: AccommodationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const acc = getAccommodationBySlug(slug);
  if (!acc) return { title: 'Alojamiento no encontrado' };
  return {
    title: `${acc.name} — Alojamiento en Villa Unión`,
    description: acc.description,
    openGraph: {
      title: `${acc.name} — Go Aventura`,
      description: acc.tagline,
      images: acc.images.slice(0, 3).map(i => ({ url: i.src, width: 1200, height: 630, alt: i.alt })),
    },
  };
}

export default async function AccommodationPage({ params }: AccommodationPageProps) {
  const { slug } = await params;
  const accommodation = getAccommodationBySlug(slug);
  if (!accommodation) notFound();

  const others = accommodations.filter((a) => a.id !== accommodation.id);
  const descriptionSections = accommodation.longDescription.trim().split(/\n\s*\n/).map((block) => {
    const [heading, ...paragraphs] = block.trim().split('\n').filter(Boolean);
    return { heading: heading.replace(/\*\*/g, '').replace(/^[\p{Extended_Pictographic}\uFE0F\s]+/u, ''), body: paragraphs.join(' ') };
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: accommodation.name,
    description: accommodation.description,
    image: accommodation.images.map(i => i.src),
    address: { '@type': 'PostalAddress', addressLocality: 'Villa Unión', addressRegion: 'La Rioja', addressCountry: 'AR' },
    ...(accommodation.coordinates ? {
      geo: { '@type': 'GeoCoordinates', latitude: accommodation.coordinates.lat, longitude: accommodation.coordinates.lng },
    } : {}),
    numberOfRooms: accommodation.bedrooms,
  };

  return (
    <div className="min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AccommodationPageTracker productId={accommodation.id} productName={accommodation.name} productType="accommodation" />

      {/* Hero */}
      <section className="relative min-h-[28rem] md:h-[55vh] lg:h-[65vh]">
        <Image src={accommodation.images[0].src} alt={accommodation.images[0].alt} fill sizes="100vw" quality={85} className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
          <Button variant="ghost" asChild className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-0">
            <Link href="/alojamientos" aria-label="Ver todos los alojamientos">
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span>Todos los alojamientos</span>
            </Link>
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 section-container pb-8 md:pb-10">
          <div className="flex items-center gap-2 text-sm text-white/90 mb-3">
            <MapPin className="h-4 w-4" />
            {accommodation.location}
          </div>
          <h1 className="max-w-[18ch] font-headline text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">{accommodation.name}</h1>
          <p className="mt-3 max-w-2xl text-base text-white/90 md:text-lg">{accommodation.tagline}</p>
          <a href="#reservar" className="mt-6 inline-flex min-h-11 items-center border-b-2 border-white pb-1 text-sm font-semibold text-white lg:hidden">
            Consultar disponibilidad
          </a>
        </div>
      </section>

      <div className="section-container py-10 md:py-14">
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick info */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-border pb-6">
              {[
                { icon: Users, label: accommodation.capacity },
                { icon: BedDouble, label: `${accommodation.bedrooms} hab` },
                { icon: Bath, label: `${accommodation.bathrooms} baño${accommodation.bathrooms > 1 ? 's' : ''}` },
              ].map((item, i) => (
                <div key={i} className="inline-flex items-center gap-2 text-sm font-medium">
                  <item.icon className="h-4 w-4 text-accent" />
                  {item.label}
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="max-w-[70ch]">
              <h2 className="font-headline text-2xl font-bold text-foreground mb-4">Sobre este alojamiento</h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-7">{accommodation.description}</p>
              <div className="space-y-6">
                {descriptionSections.map((section) => (
                  <div key={section.heading}>
                    <h3 className="font-headline text-lg font-semibold text-foreground">{section.heading}</h3>
                    <p className="mt-2 text-base text-muted-foreground leading-relaxed">{section.body}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h2 className="font-headline text-2xl font-bold text-foreground mb-4">Servicios incluidos</h2>
              <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {accommodation.services.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 border-b border-border py-3 text-sm text-foreground">
                    <CheckCircle className="h-4 w-4 text-accent shrink-0" aria-hidden="true" />
                    <span>{s.replace(/^[^\w\s]+\s*/, '')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <AccommodationGallery images={accommodation.images} />

            {/* Map */}
            <div>
              <h2 className="font-headline text-2xl font-bold text-foreground mb-4">Ubicación</h2>
              <div className="rounded-2xl overflow-hidden h-64 md:h-80 bg-secondary/30">
                <iframe src={accommodation.mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title={`Mapa de ${accommodation.name}`} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Booking */}
              <div id="reservar" className="scroll-mt-24 space-y-4 rounded-xl border border-border bg-secondary p-6">
                <h3 className="font-headline text-lg font-bold text-foreground">Reservar</h3>
                <WhatsAppCtaButton
                  predefinedText={`Hola! Me interesa "${accommodation.name}". ¿Qué disponibilidad tienen?`}
                  buttonText="Consultar por WhatsApp"
                  phoneNumber={accommodation.whatsapp}
                  variant="whatsapp"
                  size="lg"
                  className="w-full"
                  productId={accommodation.id}
                  productName={accommodation.name}
                  productType="accommodation"
                />
                {accommodation.booking && (
                  <a href={accommodation.booking} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-booking text-booking-foreground hover:bg-booking/90 h-12 px-4 text-sm font-semibold transition-colors">
                    Reservar en Booking
                  </a>
                )}
                <ContactAdvisorButton productId={accommodation.id} productName={accommodation.name} productType="accommodation" />
                <div className="pt-3 border-t space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5 text-green-500" /> Respondemos en menos de 24hs</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5 text-green-500" /> Reserva segura</div>
                </div>
              </div>

              {/* Others */}
              {others.length > 0 && (
                <div className="rounded-2xl border p-5 space-y-3">
                  <h3 className="font-headline text-base font-bold text-foreground">Otros alojamientos</h3>
                  {others.map((other) => (
                    <Link key={other.id} href={`/alojamientos/${other.slug}`} className="flex gap-3 group items-center rounded-xl p-2 hover:bg-secondary/50 transition-colors">
                      <div className="relative w-14 h-12 rounded-lg overflow-hidden shrink-0 bg-secondary">
                        <Image src={other.images[0].src} alt={other.name} fill sizes="60px" className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate group-hover:text-accent transition-colors">{other.name}</p>
                        <p className="text-xs text-muted-foreground">{other.capacity}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </Link>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
