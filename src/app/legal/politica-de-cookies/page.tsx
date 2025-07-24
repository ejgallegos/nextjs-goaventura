import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Información sobre el uso de cookies en el sitio web de Go aventura.',
};

export default function PoliticaCookiesPage() {
  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 md:mb-12">
          <Cookie className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">Política de Cookies</h1>
          <p className="mt-4 text-lg text-muted-foreground">Última actualización: 1 de Agosto de 2024</p>
        </header>

        <div className="prose prose-lg max-w-none text-foreground prose-headings:font-headline prose-headings:text-foreground">
          <h2>¿Qué Son las Cookies?</h2>
          <p>Como es práctica común en casi todos los sitios web profesionales, este sitio utiliza cookies, que son pequeños archivos que se descargan en tu dispositivo para mejorar tu experiencia. Esta página describe qué información recopilan, cómo la usamos y por qué a veces necesitamos almacenar estas cookies. También compartiremos cómo puedes evitar que estas cookies se almacenen, aunque esto puede degradar o 'romper' ciertos elementos de la funcionalidad del sitio.</p>
          <p>De acuerdo con la Ley de Protección de Datos Personales N° 25.326, el uso de cookies que no sean estrictamente necesarias para el funcionamiento del sitio requiere su consentimiento.</p>

          <h2>¿Cómo Usamos las Cookies?</h2>
          <p>Utilizamos cookies por diversas razones detalladas a continuación. Se recomienda que dejes todas las cookies si no estás seguro de si las necesitas o no, en caso de que se utilicen para proporcionar un servicio que utilizas.</p>
          
          <h3>Cookies Esenciales</h3>
          <p>Estas cookies son estrictamente necesarias para proporcionarle los servicios disponibles a través de nuestro sitio web y para utilizar algunas de sus funciones. Debido a que estas cookies son estrictamente necesarias, no puede rechazarlas sin afectar el funcionamiento de nuestro sitio.</p>

          <h3>Cookies de Terceros (Análisis y Rendimiento)</h3>
          <p>En algunos casos especiales, también utilizamos cookies proporcionadas por terceros de confianza. La siguiente sección detalla qué cookies de terceros puedes encontrar a través de este sitio.</p>
          <ul>
            <li>
              Este sitio utiliza Google Analytics, una de las soluciones de análisis más extendidas y confiables en la web, para ayudarnos a comprender cómo usas el sitio y las formas en que podemos mejorar tu experiencia. Estas cookies pueden rastrear datos anónimos como cuánto tiempo pasas en el sitio y las páginas que visitas, para que podamos seguir produciendo contenido atractivo. Para más información sobre las cookies de Google Analytics, consulta la página oficial de Google Analytics y su política de privacidad.
            </li>
          </ul>
          <p>El uso de estas cookies nos ayuda a analizar el tráfico y el rendimiento del sitio, pero no son esenciales para su funcionamiento básico. Usted puede aceptarlas o rechazarlas.</p>

          <h2>Cómo Gestionar y Deshabilitar Cookies</h2>
          <p>Puedes gestionar tus preferencias de cookies a través del banner de consentimiento que aparece en tu primera visita. Además, puedes evitar la configuración de cookies ajustando la configuración de tu navegador (consulta la Ayuda de tu navegador para saber cómo hacerlo). Ten en cuenta que deshabilitar las cookies afectará la funcionalidad de este y muchos otros sitios web que visites.</p>

          <h2>Más Información</h2>
          <p>Esperamos que esto haya aclarado el uso de cookies en nuestro sitio. Si tienes alguna duda, puedes contactarnos a través de los medios proporcionados en nuestra <Link href="/contacto">página de contacto</Link>.</p>
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
