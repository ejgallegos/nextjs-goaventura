import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import AccommodationGallery from '@/components/accommodation-gallery';
import { accommodations, getAccommodationBySlug } from '@/lib/data/accommodations';
import { ArrowLeft, MapPin, Users, BedDouble, Bath, CheckCircle, Car, Wifi, Tv, Flame, Snowflake, UtensilsCrossed, Landmark } from 'lucide-react';

interface AccommodationPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return accommodations.map((accommodation) => ({
    slug: accommodation.slug,
  }));
}

export async function generateMetadata({ params }: AccommodationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const accommodation = getAccommodationBySlug(slug);

  if (!accommodation) {
    return {
      title: 'Alojamiento no encontrado',
    };
  }

  return {
    title: `${accommodation.name} - Alojamiento en Villa Unión | GoAventura`,
    description: accommodation.description,
  };
}

const serviceIcons: Record<string, React.ReactNode> = {
  '🛁': <Bath className="h-5 w-5" />,
  '🛏️': <BedDouble className="h-5 w-5" />,
  '🔥': <Flame className="h-5 w-5" />,
  '❄️': <Snowflake className="h-5 w-5" />,
  '📶': <Wifi className="h-5 w-5" />,
  '📺': <Tv className="h-5 w-5" />,
  '🚗': <Car className="h-5 w-5" />,
  '🍳': <UtensilsCrossed className="h-5 w-5" />,
  '🏔️': <Landmark className="h-5 w-5" />,
};

export default async function AccommodationPage({ params }: AccommodationPageProps) {
  const { slug } = await params;
  const accommodation = getAccommodationBySlug(slug);

  if (!accommodation) {
    notFound();
  }

  const otherAccommodations = accommodations.filter((a) => a.id !== accommodation.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[35vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh]">
        <Image
          src={accommodation.images[0].src}
          alt={accommodation.images[0].alt}
          fill
          sizes="100vw"
          quality={80}
          className="object-cover"
          priority
          data-ai-hint={accommodation.images[0].hint}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-black/30" />
        
        <div className="absolute top-3 left-3 md:top-4 md:left-4">
          <Button variant="ghost" asChild className="bg-background/80 backdrop-blur-sm hover:bg-background/90 text-foreground text-sm md:text-base min-h-[44px] min-w-[44px]">
            <Link href="/alojamientos">
              <ArrowLeft className="mr-1 md:mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Volver a Alojamientos</span>
              <span className="sm:hidden">Volver</span>
            </Link>
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 container max-w-7xl mx-auto px-3 md:px-4 pb-6 md:pb-8">
          <div className="text-white">
            <div className="flex items-center gap-2 text-xs md:text-sm text-primary-foreground/80 mb-1 md:mb-2">
              <MapPin className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
              <span className="font-medium">{accommodation.location}</span>
            </div>
            <h1 className="font-headline text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 md:mb-2 leading-tight">
              {accommodation.name}
            </h1>
            <p className="text-sm md:text-lg lg:text-xl text-primary-foreground/90 max-w-2xl line-clamp-2">
              {accommodation.tagline}
            </p>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-10 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Quick Info */}
            <div className="flex flex-wrap gap-2 md:gap-4">
              <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg text-xs md:text-sm min-h-[44px]">
                <Users className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                <span className="font-medium whitespace-nowrap">{accommodation.capacity}</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg text-xs md:text-sm min-h-[44px]">
                <BedDouble className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                <span className="font-medium whitespace-nowrap">{accommodation.bedrooms} {accommodation.bedrooms === 1 ? 'hab.' : 'hab.'}</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg text-xs md:text-sm min-h-[44px]">
                <Bath className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />
                <span className="font-medium whitespace-nowrap">{accommodation.bathrooms} {accommodation.bathrooms === 1 ? 'baño' : 'baños'}</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none">
              <h2 className="font-headline text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">
                ✨ Sobre el alojamiento
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {accommodation.description}
              </p>
              <div className="mt-4 md:mt-6 space-y-2 md:space-y-3">
                {accommodation.longDescription.split('\n').filter(line => line.trim()).map((line, index) => (
                  <p key={index} className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="font-headline text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">
                🌟 Lo que te va a encantar
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {accommodation.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-2 md:gap-3 bg-card p-3 md:p-4 rounded-lg">
                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base font-medium">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div>
              <h2 className="font-headline text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">
                🛎️ Servicios incluidos
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {accommodation.services.map((service, index) => (
                  <div key={index} className="flex items-center gap-2 md:gap-3 bg-muted/50 p-2 md:p-3 rounded-lg">
                    {serviceIcons[service.charAt(0)] || <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" />}
                    <span className="text-xs md:text-sm">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h2 className="font-headline text-xl md:text-2xl font-bold text-foreground mb-3 md:mb-4">
                📍 Ubicación
              </h2>
              <div className="bg-muted rounded-lg overflow-hidden h-48 md:h-64 lg:h-80">
                <iframe
                  src={accommodation.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa de ${accommodation.name}`}
                />
              </div>
            </div>

            {/* Gallery */}
            <AccommodationGallery images={accommodation.images} />
          </div>

          {/* Sidebar - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4 md:space-y-6">
              <div className="bg-card rounded-xl p-4 md:p-6 shadow-lg border">
                <h3 className="font-headline text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4">
                  📅 Reservar {accommodation.name}
                </h3>
                
                <div className="space-y-3 md:space-y-4">
                  <WhatsAppCtaButton
                    predefinedText={`Hola! Me interesa el alojamiento "${accommodation.name}". ¿Qué disponibilidad tienen para las fechas que me interesan?`}
                    buttonText="Consultar por WhatsApp"
                    phoneNumber={accommodation.whatsapp}
                    variant="whatsapp"
                    size="lg"
                    className="w-full min-h-[48px]"
                  />

                  {accommodation.booking && (
                    <a
                      href={accommodation.booking}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-booking text-booking-foreground hover:bg-booking/90 h-12 px-4 md:px-8 min-h-[48px]"
                    >
                      Reservar en Booking
                    </a>
                  )}
                </div>

                <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t">
                  <p className="text-xs md:text-sm text-muted-foreground text-center">
                    🕐 Respondemos en menos de 24hs
                  </p>
                </div>
              </div>

              {/* Other Accommodations */}
              {otherAccommodations.length > 0 && (
                <div className="bg-card rounded-xl p-4 md:p-6 shadow-lg border">
                  <h3 className="font-headline text-base md:text-lg font-bold text-foreground mb-3 md:mb-4">
                    🏠 Otros alojamientos
                  </h3>
                  <div className="space-y-3 md:space-y-4">
                    {otherAccommodations.map((other) => (
                      <Link
                        key={other.id}
                        href={`/alojamientos/${other.slug}`}
                        className="flex gap-2 md:gap-3 group"
                      >
                        <div className="relative w-16 h-12 md:w-20 md:h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                          <Image
                            src={other.images[0].src}
                            alt={other.name}
                            fill
                            sizes="80px"
                            className="object-cover group-hover:scale-105 transition-transform"
                            data-ai-hint={other.images[0].hint}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm md:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {other.name}
                          </h4>
                          <p className="text-[10px] md:text-xs text-muted-foreground">
                            {other.capacity}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
