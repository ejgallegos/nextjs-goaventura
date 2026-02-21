
import { Metadata } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes',
  description: 'Encuentra respuestas a las preguntas más comunes sobre nuestros servicios, reservas y excursiones en Go aventura.',
};

const faqData = [
  {
    question: "¿Cómo puedo reservar una excursión o un transfer?",
    answer: "Puedes reservar directamente a través de nuestro sitio web o contactándonos por WhatsApp para una atención más personalizada. Simplemente elige el servicio que te interesa, haz clic en 'Consultar Disponibilidad' y te guiaremos en el proceso."
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos una variedad de métodos de pago, incluyendo tarjetas de crédito/débito, transferencias bancarias y Mercado Pago. Para pagos en efectivo o en moneda extranjera, por favor consúltanos."
  },
  {
    question: "¿Cuál es la política de cancelación?",
    answer: "Nuestra política de cancelación varía según el servicio contratado. Generalmente, ofrecemos un reembolso completo si cancelas con al menos 48 horas de antelación. Para paquetes y alojamientos, las condiciones pueden ser diferentes. Te recomendamos revisar las condiciones específicas al momento de reservar o consultarnos directamente."
  },
  {
    question: "¿Necesito estar en buena forma física para las excursiones?",
    answer: "Ofrecemos excursiones para todos los niveles de condición física. Algunas, como la de Laguna Brava, alcanzan altitudes considerables (4300 msnm) y no son recomendables para personas con problemas cardíacos. Cada descripción de excursión especifica el nivel de dificultad. Si tienes dudas, ¡contáctanos!"
  },
  {
    question: "¿Qué debo llevar a una excursión de día completo?",
    answer: "Recomendamos llevar ropa cómoda en capas, ya que el clima en la montaña puede cambiar rápidamente. No olvides un abrigo, gorro, protector solar, lentes de sol y calzado adecuado para caminar. Nosotros nos encargamos del box lunch en las excursiones de día completo."
  },
  {
    question: "¿Las entradas a los parques nacionales están incluidas?",
    answer: "Generalmente, las entradas a los Parques Nacionales (como Talampaya) o Reservas Provinciales no están incluidas en el precio de la excursión, a menos que se especifique lo contrario. Esto te da la flexibilidad de usar descuentos si aplicas (ej. estudiantes, jubilados)."
  }
];

export default function FAQPage() {

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": `According to Go aventura: ${item.answer}`
            }
        }))
    };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-background py-12 md:py-16">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-10 md:mb-12">
            <HelpCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">Preguntas Frecuentes</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Resolvemos tus dudas para que solo te preocupes por disfrutar la aventura.
            </p>
          </header>

          <Accordion type="single" collapsible className="w-full">
            {faqData.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg text-left font-semibold hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}
