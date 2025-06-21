
import HeroSection from '@/components/hero-section';
import ProductCard from '@/components/product-card';
import { mockExcursions } from '@/lib/data/excursions';
import { mockTransfers } from '@/lib/data/transfers';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Award, MessageSquareText, Users, BedDouble, HomeIcon, Mountain, ShieldCheck, BookUser, Handshake } from 'lucide-react';
import Image from 'next/image';
import TestimonialSlider from '@/components/testimonial-slider';
import type { Testimonial } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const mockTestimonials: Testimonial[] = [
  {
    id: 'test001',
    quote: "Una experiencia increíble, superó todas mis expectativas. El equipo de Go aventura fue muy profesional y amable.",
    author: 'Laura Gómez',
    destination: 'Trekking al Cerro Encantado',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarHint: 'woman smiling'
  },
  {
    id: 'test002',
    quote: "El transfer fue puntual y el conductor muy servicial. ¡Recomendadísimo para empezar las vacaciones sin estrés!",
    author: 'Carlos Ruiz',
    destination: 'Transfer Aeropuerto',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarHint: 'man glasses'
  },
  {
    id: 'test003',
    quote: "La cabalgata por el valle fue mágica. Los paisajes son de ensueño y los caballos muy bien cuidados. Gracias Go aventura.",
    author: 'Sofía Fernández',
    destination: 'Cabalgata Valle Secreto',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarHint: 'woman nature'
  },
  {
    id: 'test004',
    quote: "El kayak en el Lago Esmeralda fue lo mejor de nuestro viaje. Aguas tranquilas y vistas impresionantes. ¡Volveremos!",
    author: 'Martín Herrera',
    destination: 'Kayak Lago Esmeralda',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarHint: 'man adventure'
  },
   {
    id: 'test005',
    quote: "Organización impecable y atención al detalle. Go aventura hizo que nuestro viaje fuera perfecto. Muy recomendables.",
    author: 'Ana Torres',
    destination: 'Paquete Patagonia Completa',
    avatarUrl: 'https://placehold.co/100x100.png',
    avatarHint: 'woman travel'
  }
];

export default function Home() {
  const featuredProducts = [...mockExcursions.slice(0, 2), ...mockTransfers.slice(0, 1)];

  return (
    <div className="flex flex-col">
      <HeroSection />

      {/* Featured Services Section */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Servicios Destacados</h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora nuestras ofertas más populares y prepárate para una experiencia inolvidable.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-12 text-center flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild variant="outline">
              <Link href="/viajes/excursiones">
                Ver Todas las Excursiones <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" asChild variant="outline">
              <Link href="/viajes/transfers">
                Ver Todos los Transfers <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Accommodation Section */}
      <section className="py-12 lg:py-20 bg-muted">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-12">
            <BedDouble className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Alojamientos Destacados</h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Descansa en lugares únicos. Te presentamos una opción excepcional cerca del Parque Nacional Talampaya.
            </p>
          </div>
          <div className="flex justify-center">
            <Card className="max-w-2xl w-full shadow-xl overflow-hidden">
              <CardHeader className="p-0">
                <Image
                  src="https://placehold.co/800x450.png"
                  alt="Cabañas Altos del Talampaya"
                  width={800}
                  height={450}
                  className="w-full h-64 object-cover"
                  data-ai-hint="cabin mountains talampaya"
                />
              </CardHeader>
              <CardContent className="p-6 text-center">
                <Mountain className="h-10 w-10 text-accent mx-auto mb-3" />
                <CardTitle className="font-headline text-2xl text-primary mb-2">Altos del Talampaya</CardTitle>
                <CardDescription className="text-base text-muted-foreground mb-4">
                  Disfruta de una estadía inolvidable en nuestras cabañas con vistas impresionantes al Parque Nacional Talampaya. Comodidad, naturaleza y aventura te esperan.
                </CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-center">
                <Button size="lg" asChild variant="default">
                  <Link href="/alojamientos">
                    Explorar Alojamientos <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">¿Por Qué Elegir Go aventura?</h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Nos dedicamos a crear experiencias de viaje únicas y memorables para ti.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 text-center">
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
              <Award className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-headline text-xl font-semibold text-foreground mb-2">Experiencia y Calidad</h3>
              <p className="text-sm text-muted-foreground">
                Años de experiencia en el sector turístico garantizan servicios de alta calidad y atención personalizada.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-headline text-xl font-semibold text-foreground mb-2">Guías Expertos</h3>
              <p className="text-sm text-muted-foreground">
                Nuestros guías locales son apasionados y conocedores, listos para mostrarte lo mejor de cada destino.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-md">
              <MessageSquareText className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-headline text-xl font-semibold text-foreground mb-2">Soporte Personalizado</h3>
              <p className="text-sm text-muted-foreground">
                Estamos aquí para ayudarte antes, durante y después de tu viaje. Tu satisfacción es nuestra prioridad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 lg:py-20 bg-secondary">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-secondary-foreground">Lo Que Dicen Nuestros Viajeros</h2>
             <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre por qué nuestros clientes aman viajar con Go aventura.
            </p>
          </div>
          <TestimonialSlider testimonials={mockTestimonials} />
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-8 lg:py-12 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-around items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="font-semibold text-foreground">Sello de Confianza</p>
                <p className="text-sm">Compra Segura</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookUser className="h-8 w-8 text-primary" />
               <div className="text-left">
                <p className="font-semibold text-foreground">Registro de Turismo</p>
                <p className="text-sm">Leg. 20019</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Handshake className="h-8 w-8 text-primary" />
               <div className="text-left">
                <p className="font-semibold text-foreground">Partners Oficiales</p>
                <p className="text-sm">Colaboradores de Confianza</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
