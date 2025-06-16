import { Metadata } from 'next';
import Image from 'next/image';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import { Users, Target, ShieldCheck, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conoce más sobre GoAventura, nuestra misión, visión y el equipo que hace posibles tus aventuras.',
};

const AboutUsPage = () => {
  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">Sobre GoAventura</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Tu puerta de entrada a experiencias inolvidables. Creamos viajes que inspiran y conectan.
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16">
          <div>
            <h2 className="font-headline text-3xl font-semibold text-foreground mb-4">Nuestra Historia</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              GoAventura nació de la pasión por explorar y compartir las maravillas del mundo. Desde nuestros inicios, nos hemos dedicado a diseñar itinerarios que van más allá de lo convencional, ofreciendo a nuestros viajeros autenticidad, aventura y un servicio excepcional. Creemos que viajar es una forma de crecer, aprender y conectar con otras culturas y con la naturaleza.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Con años de experiencia en la industria del turismo y un profundo conocimiento de los destinos que ofrecemos, nuestro equipo está comprometido con la excelencia y la satisfacción de cada cliente. Nos enorgullece ser parte de tus recuerdos más preciados.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <Image
              src="https://placehold.co/600x400.png"
              alt="Equipo de GoAventura en una expedición"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
              data-ai-hint="travel agency team"
            />
          </div>
        </section>

        <section className="mb-12 md:mb-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-headline text-2xl font-semibold text-foreground mb-2">Nuestra Misión</h3>
              <p className="text-sm text-muted-foreground">
                Ofrecer experiencias de viaje transformadoras que enriquezcan la vida de nuestros clientes, promoviendo un turismo responsable y sostenible.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-headline text-2xl font-semibold text-foreground mb-2">Nuestro Equipo</h3>
              <p className="text-sm text-muted-foreground">
                Un grupo de profesionales apasionados por los viajes, dedicados a brindarte la mejor atención y asesoramiento personalizado.
              </p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <ShieldCheck className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-headline text-2xl font-semibold text-foreground mb-2">Nuestros Valores</h3>
              <p className="text-sm text-muted-foreground">
                Pasión, integridad, innovación, sostenibilidad y compromiso con la satisfacción del cliente. Leg. 20019.
              </p>
            </div>
          </div>
        </section>

        <section className="text-center bg-secondary p-8 md:p-12 rounded-lg shadow-md">
          <h2 className="font-headline text-3xl font-semibold text-secondary-foreground mb-4">¿Listo para tu Próxima Aventura?</h2>
          <p className="text-secondary-foreground mb-6 max-w-xl mx-auto">
            Nuestro equipo de expertos está listo para ayudarte a planificar el viaje de tus sueños. Contáctanos hoy mismo.
          </p>
          <WhatsAppCtaButton
            predefinedText="Hola GoAventura, me gustaría saber más sobre sus servicios."
            buttonText="Habla con un Experto"
            size="lg"
            className="text-lg"
          />
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;
