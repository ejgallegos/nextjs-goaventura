import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import WhatsAppCtaButton from './whatsapp-cta-button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative bg-secondary text-secondary-foreground py-16 sm:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Paisaje de aventura inspirador"
          layout="fill"
          objectFit="cover"
          className="opacity-30"
          priority
          data-ai-hint="adventure landscape mountains"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
          Reserva tu Próxima <span className="text-primary">Aventura</span>
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg sm:text-xl text-muted-foreground">
          Descubre excursiones emocionantes, transfers confiables y los mejores alojamientos con GoAventura. Tu viaje soñado comienza aquí.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-transform hover:scale-105">
            <Link href="/viajes/excursiones">
              Explorar Viajes <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <WhatsAppCtaButton
            predefinedText="Hola, me gustaría obtener más información sobre los servicios de GoAventura."
            buttonText="Contactar por WhatsApp"
            variant="accent"
            size="lg"
            className="shadow-lg transition-transform hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
