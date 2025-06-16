import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BedDouble, ExternalLink } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Alojamientos',
  description: 'Encuentra el alojamiento perfecto para tu viaje. Colaboramos con los mejores proveedores.',
};

const AlojamientosPage = () => {
  const externalAccommodationLink = "#"; // Replace with actual external link or subdomain

  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <BedDouble className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-6">Encuentra tu Alojamiento Ideal</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Para ofrecerte la mejor selección y precios en alojamientos, colaboramos con plataformas especializadas.
          Haz clic en el botón de abajo para explorar una amplia gama de hoteles, apartamentos y más.
        </p>
        
        <div className="max-w-md mx-auto bg-card p-8 rounded-lg shadow-xl">
            <Image 
                src="https://placehold.co/600x300.png"
                alt="Imagen de alojamientos variados"
                width={600}
                height={300}
                className="rounded-md mb-6"
                data-ai-hint="hotel booking collage"
            />
          <p className="text-muted-foreground mb-6">
            Serás redirigido a nuestro portal de alojamientos asociado para completar tu búsqueda y reserva.
          </p>
          <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground w-full text-lg">
            <Link href={externalAccommodationLink} target="_blank" rel="noopener noreferrer">
              Buscar Alojamientos <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t">
            <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">¿Por qué reservar con nuestros partners?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="p-4 bg-card rounded-lg shadow-sm">
                    <h3 className="font-semibold text-primary mb-1">Amplia Selección</h3>
                    <p className="text-sm text-muted-foreground">Accede a miles de opciones en todo el mundo.</p>
                </div>
                <div className="p-4 bg-card rounded-lg shadow-sm">
                    <h3 className="font-semibold text-primary mb-1">Mejores Precios</h3>
                    <p className="text-sm text-muted-foreground">Ofertas competitivas y descuentos exclusivos.</p>
                </div>
                <div className="p-4 bg-card rounded-lg shadow-sm">
                    <h3 className="font-semibold text-primary mb-1">Reservas Seguras</h3>
                    <p className="text-sm text-muted-foreground">Proceso de reserva confiable y protegido.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AlojamientosPage;
