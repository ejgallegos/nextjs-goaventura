import { Metadata } from 'next';
import Image from 'next/image';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import { ShieldCheck, Mountain, BedDouble, Car, Users, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Somos Go Aventura, agencia familiar en Villa Unión del Talampaya. Excursiones 4x4, alojamientos y transfers en La Rioja.',
};

export default function AboutUsPage() {
  return (
    <div className="bg-background">
      {/* Header */}
      <section className="section-padding bg-secondary/30">
        <div className="section-container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance">
              Go Aventura
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Tu puerta de entrada a la aventura en la Región del Bermejo
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-container py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image src="/nosotros.png" alt="Paisaje de aventura en La Rioja" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p className="text-lg">
              Somos <strong className="font-semibold text-foreground">Go Aventura</strong> (Agencia de Viajes — Leg. 20019), un emprendimiento familiar apasionado por brindar experiencias auténticas y memorables en Villa Unión, La Rioja.
            </p>
            <p>
              Nos dedicamos a ofrecerte no solo un viaje, sino una aventura inolvidable, combinando comodidad, seguridad y emoción en cada servicio que brindamos.
            </p>
          </div>
        </div>
      </section>

      {/* What we offer */}
      <section className="section-padding bg-secondary/30">
        <div className="section-container">
          <h2 className="font-headline text-3xl sm:text-4xl font-bold text-center text-foreground mb-10">¿Qué ofrecemos?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Mountain, title: 'Excursiones en 4x4', desc: 'Explora paisajes inaccesibles y maravíllate con la belleza natural de la región, acompañado por nuestros guías expertos.' },
              { icon: BedDouble, title: 'Alojamiento', desc: 'Espacios diseñados para tu comodidad, garantizando un descanso reparador después de un día de exploración.' },
              { icon: Car, title: 'Transfers', desc: 'Te llevamos a donde necesites con un servicio de traslado seguro y confiable.' },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border p-6 space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <item.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-headline text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="section-container py-12 md:py-16">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <ShieldCheck className="h-12 w-12 text-accent mx-auto" />
          <h2 className="font-headline text-3xl font-bold text-foreground">Nuestra Promesa</h2>
          <p className="text-muted-foreground leading-relaxed">
            En Go Aventura, trabajamos día a día para mejorar y ampliar nuestros servicios, asegurándonos de que vivas una experiencia sin igual en Villa Unión y sus alrededores. Cada detalle de tu viaje importa, y estamos aquí para que disfrutes cada momento al máximo.
          </p>
          <WhatsAppCtaButton
            predefinedText="Hola! Quiero saber más sobre los servicios de Go Aventura."
            buttonText="Escribinos"
            variant="whatsapp"
            size="lg"
          />
        </div>
      </section>
    </div>
  );
}
