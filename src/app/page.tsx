import HeroSection from '@/components/hero-section';
import ProductCard from '@/components/product-card';
import { mockExcursions } from '@/lib/data/excursions';
import { mockTransfers } from '@/lib/data/transfers';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Award, MessageSquareText, Users } from 'lucide-react';
import Image from 'next/image';

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
          <div className="mt-12 text-center">
            <Button size="lg" asChild variant="outline">
              <Link href="/viajes/excursiones">
                Ver Todas las Excursiones <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 lg:py-20 bg-secondary">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">¿Por Qué Elegir GoAventura?</h2>
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

      {/* Testimonials Placeholder Section */}
      <section className="py-12 lg:py-20 bg-background">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Lo Que Dicen Nuestros Viajeros</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="p-6 bg-card rounded-lg shadow-md">
                <p className="text-muted-foreground italic">"Una experiencia increíble, superó todas mis expectativas. El equipo de GoAventura fue muy profesional y amable."</p>
                <p className="mt-4 font-semibold text-foreground">- Viajero Feliz {i}</p>
                <p className="text-sm text-primary">Destino Ejemplo {i}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators Placeholder Section */}
      <section className="py-8 lg:py-12 bg-secondary">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-around items-center gap-8">
            <Image src="https://placehold.co/150x60.png?text=Sello+Confianza" alt="Sello de Confianza" width={150} height={60} data-ai-hint="trust seal" className="opacity-70 hover:opacity-100 transition-opacity" />
            <Image src="https://placehold.co/150x60.png?text=Registro+Turismo" alt="Registro de Turismo" width={150} height={60} data-ai-hint="tourism registry" className="opacity-70 hover:opacity-100 transition-opacity" />
            <span className="font-semibold text-muted-foreground">Leg. 20019</span>
            <Image src="https://placehold.co/150x60.png?text=Partner+Logo" alt="Partner Logo" width={150} height={60} data-ai-hint="partner logo" className="opacity-70 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </section>
    </div>
  );
}
