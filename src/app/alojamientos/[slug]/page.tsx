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
import AwinBookingBanner from '@/components/awin-booking-banner';
import { ArrowLeft, MapPin, Users, BedDouble, Bath, CheckCircle, Car, Wifi, Tv, Flame, Snowflake, UtensilsCrossed, Landmark, Star, Share, Heart, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
    title: `${accommodation.name} - Alojamiento en Villa Unión | Go Aventura`,
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

  // We take up to 5 images for the premium hero gallery
  const heroImages = accommodation.images.slice(0, 5);

  return (
    <div className="min-h-screen bg-background pb-20">
      <AccommodationPageTracker
        productId={accommodation.id}
        productName={accommodation.name}
        productType="accommodation"
      />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Breadcrumb & Back */}
        <div className="flex justify-between items-center mb-6">
           <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground pl-0">
            <Link href="/alojamientos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Volver a Alojamientos</span>
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex rounded-full">
              <Share className="mr-2 h-4 w-4" /> Compartir
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex rounded-full">
              <Heart className="mr-2 h-4 w-4" /> Guardar
            </Button>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-6">
           <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-2 tracking-tight">
            {accommodation.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-muted-foreground">
             <div className="flex items-center gap-1 font-medium text-foreground">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span>4.9</span>
                <span className="underline ml-1 cursor-pointer">(120 evaluaciones)</span>
             </div>
             <span>·</span>
             <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="underline cursor-pointer">{accommodation.location}</span>
             </div>
          </div>
        </div>

        {/* Premium Image Gallery (Airbnb Style) */}
        <div className="rounded-[1.5rem] overflow-hidden hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[500px] lg:h-[550px] mb-12">
            <div className="col-span-2 row-span-2 relative group cursor-pointer">
              <Image 
                src={heroImages[0]?.src} alt={heroImages[0]?.alt} fill sizes="50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" priority data-ai-hint={heroImages[0]?.hint}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            {heroImages.slice(1, 5).map((img, index) => (
              <div key={index} className="relative group cursor-pointer">
                <Image 
                  src={img.src} alt={img.alt} fill sizes="25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" data-ai-hint={img.hint}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>
            ))}
        </div>
        
        {/* Mobile single image */}
        <div className="md:hidden relative h-[300px] sm:h-[400px] rounded-2xl overflow-hidden mb-8">
           <Image 
              src={heroImages[0]?.src} alt={heroImages[0]?.alt} fill sizes="100vw" className="object-cover" priority data-ai-hint={heroImages[0]?.hint}
            />
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Info & Host */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b">
               <div>
                  <h2 className="font-headline text-2xl font-bold text-foreground mb-2">
                    Alojamiento entero
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-base">
                    <span>{accommodation.capacity}</span>
                    <span>·</span>
                    <span>{accommodation.bedrooms} {accommodation.bedrooms === 1 ? 'habitación' : 'habitaciones'}</span>
                    <span>·</span>
                    <span>{accommodation.bathrooms} {accommodation.bathrooms === 1 ? 'baño' : 'baños'}</span>
                  </div>
               </div>
               <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary shrink-0">
                  <span className="font-headline font-bold text-xl text-primary text-center leading-none">Go<br/>Av</span>
               </div>
            </div>

            {/* Highlights (Cards instead of plain text) */}
            <div className="grid sm:grid-cols-2 gap-4">
              {accommodation.highlights.slice(0,4).map((highlight, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-2xl bg-card border shadow-sm">
                  <div className="mt-1">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-base">Destacado</h4>
                    <span className="text-muted-foreground text-sm leading-snug block">{highlight}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="prose prose-lg max-w-none prose-p:text-muted-foreground prose-headings:font-headline">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Sobre este espacio
              </h2>
              <p className="text-lg font-medium text-foreground/80 mb-6 border-l-4 border-primary pl-4">
                {accommodation.tagline}
              </p>
              <p className="leading-relaxed">
                {accommodation.description}
              </p>
              <div className="mt-6 space-y-4">
                {accommodation.longDescription.split('\n').filter(line => line.trim()).map((line, index) => (
                  <p key={index} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* Services */}
            <div>
              <h2 className="font-headline text-2xl font-bold text-foreground mb-6">
                ¿Qué ofrece este lugar?
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
                {accommodation.services.map((service, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="text-muted-foreground">
                      {serviceIcons[service.charAt(0)] || <CheckCircle className="h-5 w-5" />}
                    </div>
                    <span className="text-base font-medium text-foreground/80">{service.substring(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-border" />

            {/* Map */}
            <div>
              <h2 className="font-headline text-2xl font-bold text-foreground mb-6">
                Ubicación
              </h2>
              <div className="bg-muted rounded-2xl overflow-hidden h-[400px] w-full shadow-inner">
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

            <hr className="border-border" />

            {/* Gallery (Full view) */}
            <AccommodationGallery images={accommodation.images} />
          </div>

          {/* Sidebar - Booking (Sticky CRO) */}
          <div className="lg:col-span-1 relative">
            <div className="sticky top-28 space-y-6">
              
              {/* Main Booking Card */}
              <div className="bg-card rounded-[1.5rem] p-6 lg:p-8 shadow-2xl border border-primary/10">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-3xl font-extrabold text-foreground tracking-tight">Consultar</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span>4.9</span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-4 mb-6 border">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-sm">Disponibilidad alta en temporada</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">Respondemos consultas y confirmamos reservas por WhatsApp casi al instante.</p>
                </div>
                
                <div className="space-y-4">
                  <WhatsAppCtaButton
                    predefinedText={`Hola! Me interesa el alojamiento "${accommodation.name}". ¿Qué disponibilidad tienen para las fechas que me interesan?`}
                    buttonText="Consultar por WhatsApp"
                    phoneNumber={accommodation.whatsapp}
                    variant="whatsapp"
                    size="lg"
                    className="w-full h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                    productId={accommodation.id}
                    productName={accommodation.name}
                    productType="accommodation"
                  />

                  {accommodation.booking && (
                    <a
                      href={accommodation.booking}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full rounded-xl text-sm font-bold transition-colors disabled:opacity-50 bg-booking text-booking-foreground hover:bg-booking/90 h-14 border shadow-sm"
                    >
                      Ver en Booking.com
                    </a>
                  )}

                  <ContactAdvisorButton
                    productId={accommodation.id}
                    productName={accommodation.name}
                    productType="accommodation"
                  />
                </div>

                <div className="mt-6 flex justify-center items-center gap-2 text-muted-foreground text-sm">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Reserva segura y sin cargos ocultos</span>
                </div>
              </div>

              {/* Banner Booking.com via Awin */}
              <div className="bg-muted/30 rounded-2xl p-4 border flex flex-col items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Promocionado</span>
                <AwinBookingBanner />
                <a
                  href="https://tidd.ly/4nGXFth"
                  target="_blank"
                  rel="sponsored"
                  className="text-xs font-medium text-primary hover:underline transition-colors"
                >
                  Conocé tu alojamiento más cercano
                </a>
              </div>

              {/* Other Accommodations Widget */}
              {otherAccommodations.length > 0 && (
                <div className="bg-card rounded-2xl p-6 shadow-md border">
                  <h3 className="font-headline text-lg font-bold text-foreground mb-4">
                    También te puede interesar
                  </h3>
                  <div className="space-y-4">
                    {otherAccommodations.map((other) => (
                      <Link
                        key={other.id}
                        href={`/alojamientos/${other.slug}`}
                        className="flex gap-4 group items-center"
                      >
                        <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={other.images[0].src}
                            alt={other.name}
                            fill
                            sizes="80px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            data-ai-hint={other.images[0].hint}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {other.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {other.capacity} · {other.bedrooms} {other.bedrooms === 1 ? 'hab.' : 'habs.'}
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
