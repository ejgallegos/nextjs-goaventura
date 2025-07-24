
import { Metadata } from 'next';
import ImageSlider from '@/components/image-slider';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import { Users, Target, ShieldCheck, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conoce más sobre Go aventura, nuestra misión, visión y el equipo que hace posibles tus aventuras.',
};

const aboutUsImages = [
  {
    src: "https://placehold.co/600x400.png",
    alt: "Paisaje de La Rioja con montañas",
    hint: "rioja landscape mountains",
  },
  {
    src: "https://placehold.co/600x400.png",
    alt: "Grupo de turistas en una excursión",
    hint: "tourist group hiking",
  },
  {
    src: "https://placehold.co/600x400.png",
    alt: "Vehículo 4x4 en un camino de tierra",
    hint: "4x4 offroad desert",
  },
  {
    src: "https://placehold.co/600x400.png",
    alt: "Vicuñas en su hábitat natural",
    hint: "vicunas andes wildlife",
  },
  {
    src: "https://placehold.co/600x400.png",
    alt: "Cañón del Talampaya al atardecer",
    hint: "talampaya canyon sunset",
  },
];

const AboutUsPage = () => {
  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">Nosotros</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Te ayudamos a programar tu viaje por el noroeste argentino, para que sea una experiencia inolvidable.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16">
          <div className="rounded-lg overflow-hidden shadow-xl h-full min-h-[400px]">
            <ImageSlider images={aboutUsImages} className="w-full h-full" />
          </div>
          <div className="order-first md:order-last">
            <h2 className="font-headline text-3xl font-semibold text-foreground mb-4">Nuestra Historia</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Go aventura EVyT Leg. 20019, es una empresa familiar que hace 2 años está en el rubro turístico de la provincia de La Rioja. Nos dedicamos a la venta de excursiones, traslados y alojamientos de los principales destinos turísticos de nuestra provincia, como así también a la venta de paquetes turísticos a nivel nacional e internacional.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nuestra oficina se encuentra en la localidad de Villa Unión, cabecera del Dpto. Cnel. Felipe Varela, a 60km del Parque Nacional Talampaya, y a 35km de Laguna Brava (sitio Ramsar). Como así también nos encontramos en un punto estratégico entre los principales atractivos de las provincias de San Juan y Catamarca, lo que nos permite combinar circuitos con estas provincias.
            </p>
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-headline text-2xl font-semibold text-foreground mb-2">Nuestra Misión</h3>
              <p className="text-sm text-muted-foreground">
                Nuestra misión es ayudar a nuestros clientes a planificar y reservar sus vacaciones soñadas. Somos una empresa comprometida con nuestros clientes, con la calidad de nuestros servicios y con el desarrollo turístico de nuestra provincia.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-headline text-2xl font-semibold text-foreground mb-2">Nuestro Equipo</h3>
              <p className="text-sm text-muted-foreground">
                Somos un equipo de profesionales apasionados por los viajes y el turismo, que trabajamos con dedicación y compromiso para brindarte la mejor experiencia.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-headline text-2xl font-semibold text-foreground mb-2">Nuestros Valores</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                 <p>Pasión, Compromiso, Calidad, Confianza y Responsabilidad.</p>
                 <p>Leg. 20019 - <Link href="https://www.argentina.gob.ar/servicio/consultar-agencias-de-viajes" target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primary/80">Legajo Habilitante</Link></p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center bg-secondary p-8 md:p-12 rounded-lg shadow-md">
          <h2 className="font-headline text-3xl font-semibold text-secondary-foreground mb-4">¿Estás listo para tu próxima aventura?</h2>
          <p className="text-secondary-foreground mb-6 max-w-xl mx-auto">
            Contactate con nosotros para que podamos ayudarte a planificar tu viaje.
          </p>
          <WhatsAppCtaButton
            predefinedText="Hola Go aventura, ¡estoy listo para mi próxima aventura!"
            buttonText="Contactanos"
            size="lg"
            className="text-lg"
          />
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
