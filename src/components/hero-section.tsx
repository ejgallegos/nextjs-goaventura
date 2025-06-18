
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import WhatsAppCtaButton from './whatsapp-cta-button';
import ImageSlider from './image-slider'; // Import the new slider
import { ArrowRight } from 'lucide-react';

const heroImages = [
	{
		src: "/slider/lb-slider-3.png",
		alt: "Paisaje de aventura inspirador 2",
		hint: "serene beach sunset",
	},
	{
    src: "/slider/slider-0.png",
		alt: "Paisaje de aventura inspirador 1",
		hint: "adventure landscape mountains",
	},
	{
    src: "/slider/canon.png",
		alt: "Paisaje de aventura inspirador 1",
		hint: "adventure landscape mountains",
	},
  {
    src: "/slider/zorro.png",
    alt: "Paisaje de aventura inspirador 2",
    hint: "serene beach sunset",
  },
];

const HeroSection = () => {
  return (
    <div className="relative bg-secondary text-secondary-foreground py-16 sm:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <ImageSlider images={heroImages} className="h-full w-full" />
        {/* Overlay removed */}
      </div>
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary">
          Reserva tu Próxima <span className="text-primary">Aventura</span>
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-lg sm:text-xl text-foreground">
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
            variant="secondary" // Changed variant
            size="lg"
            className="shadow-lg transition-transform hover:scale-105" // Removed explicit text color classes
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

