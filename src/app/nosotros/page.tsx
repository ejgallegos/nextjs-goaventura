import { Metadata } from 'next';
import { Mountain, BedDouble, Car, ShieldCheck, Heart, Map, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conoce más sobre Go Aventura, nuestra misión, visión y el equipo que hace posibles tus aventuras en La Rioja.',
};

const AboutUsPage = () => {
  return (
    <div className="bg-background pb-20">
      
      {/* Hero Section Editorial */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/nosotros.png"
            alt="Paisaje de aventura en La Rioja"
            fill
            className="object-cover scale-105"
            priority
            data-ai-hint="canyon landscape riojas"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 container max-w-5xl mx-auto px-4 text-center text-white">
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
            Go Aventura
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto text-white/90 text-balance leading-snug">
            Tu puerta de entrada a la aventura en la Región del Bermejo. Una experiencia auténtica, segura y memorable.
          </p>
        </div>
      </section>

      {/* Storytelling Content */}
      <section className="py-16 md:py-24 container max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Nuestra Historia</span>
          <h2 className="font-headline text-4xl md:text-5xl font-bold text-foreground text-balance">
            Pasión por nuestra tierra, compromiso con tu viaje
          </h2>
        </div>

        <div className="prose prose-lg md:prose-xl mx-auto text-muted-foreground leading-relaxed">
          <p className="first-letter:text-7xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left">
            Somos <strong>Go Aventura</strong> (Agencia de Viajes - Leg. 20019), un emprendimiento familiar nacido y criado en Villa Unión, La Rioja. Nuestra pasión es compartir la belleza incomparable de nuestra región con viajeros de todo el mundo.
          </p>
          <p>
            No nos dedicamos a vender viajes; nos dedicamos a diseñar <em>experiencias inolvidables</em>. Entendemos que cuando visitas el Talampaya o Laguna Brava, estás buscando una conexión real con la naturaleza, combinada con la tranquilidad de estar en buenas manos.
          </p>
        </div>
      </section>

      {/* Bento Grid - Mission & Stats */}
      <section className="container max-w-6xl mx-auto px-4 mb-24">
        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 bg-primary/5 rounded-[2rem] p-8 md:p-12 flex flex-col justify-center border border-primary/10">
            <Heart className="w-10 h-10 text-primary mb-6" />
            <h3 className="font-headline text-3xl font-bold text-foreground mb-4">Nuestra Misión</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Queremos que tu visita a nuestra región sea mucho más que un simple recorrido turístico. Buscamos que te sumerjas en la cultura, los paisajes y la esencia de este destino único. Desde alojamientos confortables hasta traslados seguros y excursiones emocionantes.
            </p>
          </div>

          <div className="bg-card rounded-[2rem] p-8 flex flex-col justify-center items-center text-center shadow-lg border">
             <Star className="w-12 h-12 text-yellow-400 mb-4 fill-yellow-400" />
             <span className="text-5xl font-extrabold text-foreground mb-2">+500</span>
             <span className="text-muted-foreground font-medium">Viajeros felices este año</span>
          </div>

        </div>
      </section>

      {/* What we offer */}
      <section className="bg-muted/30 py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-headline text-4xl font-bold text-foreground mb-4">¿Qué ofrecemos?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Resolvemos toda la logística para que vos solo te preocupes por disfrutar.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-3xl shadow-sm border group hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Mountain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-headline text-2xl font-bold mb-3">Excursiones 4x4</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">Explora paisajes inaccesibles y maravíllate con la belleza natural de la región, acompañado por nuestros guías expertos.</p>
              <Link href="/viajes?filter=Excursion" className="text-primary font-medium hover:underline">Ver excursiones &rarr;</Link>
            </div>
            
            <div className="bg-background p-8 rounded-3xl shadow-sm border group hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BedDouble className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-headline text-2xl font-bold mb-3">Alojamientos</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">Espacios diseñados para tu comodidad, garantizando un descanso reparador después de un día de intensa exploración.</p>
              <Link href="/alojamientos" className="text-primary font-medium hover:underline">Ver alojamientos &rarr;</Link>
            </div>

            <div className="bg-background p-8 rounded-3xl shadow-sm border group hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Car className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-headline text-2xl font-bold mb-3">Transfers</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">Te llevamos a donde necesites con un servicio de traslado seguro y confiable, operando en toda la provincia y aeropuertos.</p>
              <Link href="/viajes?filter=Transfer" className="text-primary font-medium hover:underline">Ver traslados &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* The Promise */}
      <section className="container max-w-4xl mx-auto px-4 pt-24 text-center">
        <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-6" />
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-foreground mb-6">
          Nuestra Promesa
        </h2>
        <p className="text-xl text-muted-foreground leading-relaxed mb-8 text-balance">
          En Go Aventura trabajamos día a día para mejorar y asegurar que vivas una experiencia sin igual. Cada detalle de tu viaje importa, y estamos aquí para que disfrutes cada momento al máximo.
        </p>
        <div className="inline-flex items-center gap-3 bg-card px-6 py-4 rounded-full border shadow-sm font-medium text-foreground">
          <Map className="w-5 h-5 text-primary" />
          Déjanos ser tu guía en esta travesía. ¡Te esperamos!
        </div>
      </section>

    </div>
  );
};

export default AboutUsPage;
