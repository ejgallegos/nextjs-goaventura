import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Información sobre el uso de cookies en el sitio web de GoAventura.',
};

export default function PoliticaCookiesPage() {
  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 md:mb-12">
          <Cookie className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">Política de Cookies</h1>
          <p className="mt-4 text-lg text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>

        <div className="prose prose-lg max-w-none text-foreground prose-headings:font-headline prose-headings:text-primary">
          <p>Esta es la Política de Cookies para GoAventura, accesible desde https://goaventura.com.ar</p>

          <h2>¿Qué Son las Cookies?</h2>
          <p>Como es práctica común en casi todos los sitios web profesionales, este sitio utiliza cookies, que son pequeños archivos que se descargan en tu computadora, para mejorar tu experiencia. Esta página describe qué información recopilan, cómo la usamos y por qué a veces necesitamos almacenar estas cookies. También compartiremos cómo puedes evitar que estas cookies se almacenen, sin embargo, esto puede degradar o 'romper' ciertos elementos de la funcionalidad del sitio.</p>

          <h2>¿Cómo Usamos las Cookies?</h2>
          <p>Utilizamos cookies por diversas razones detalladas a continuación. Desafortunadamente, en la mayoría de los casos, no existen opciones estándar de la industria para deshabilitar las cookies sin deshabilitar completamente la funcionalidad y las características que agregan a este sitio. Se recomienda que dejes todas las cookies si no estás seguro de si las necesitas o no en caso de que se utilicen para proporcionar un servicio que utilizas.</p>

          <h2>Deshabilitar Cookies</h2>
          <p>Puedes evitar la configuración de cookies ajustando la configuración de tu navegador (consulta la Ayuda de tu navegador para saber cómo hacerlo). Ten en cuenta que deshabilitar las cookies afectará la funcionalidad de este y muchos otros sitios web que visites. Deshabilitar las cookies generalmente resultará también en la deshabilitación de ciertas funcionalidades y características de este sitio. Por lo tanto, se recomienda que no deshabilites las cookies.</p>

          <h2>Las Cookies que Establecemos</h2>
          <ul>
            <li>
              <strong>Cookies relacionadas con la cuenta:</strong> Si creas una cuenta con nosotros, utilizaremos cookies para la gestión del proceso de registro y la administración general. Estas cookies generalmente se eliminarán cuando cierres sesión, sin embargo, en algunos casos, pueden permanecer después para recordar las preferencias de tu sitio cuando cierres sesión.
            </li>
            <li>
              <strong>Cookies relacionadas con el inicio de sesión:</strong> Utilizamos cookies cuando inicias sesión para que podamos recordar este hecho. Esto evita que tengas que iniciar sesión cada vez que visitas una nueva página. Estas cookies normalmente se eliminan o borran cuando cierras sesión para garantizar que solo puedas acceder a áreas y funciones restringidas cuando inicies sesión.
            </li>
            <li>
              <strong>Cookies de preferencias del sitio:</strong> Para brindarte una gran experiencia en este sitio, proporcionamos la funcionalidad para establecer tus preferencias sobre cómo se ejecuta este sitio cuando lo usas. Para recordar tus preferencias, necesitamos establecer cookies para que esta información pueda ser llamada cada vez que interactúas con una página afectada por tus preferencias.
            </li>
          </ul>

          <h2>Cookies de Terceros</h2>
          <p>En algunos casos especiales, también utilizamos cookies proporcionadas por terceros de confianza. La siguiente sección detalla qué cookies de terceros puedes encontrar a través de este sitio.</p>
          <ul>
            <li>
              Este sitio utiliza Google Analytics, que es una de las soluciones de análisis más extendidas y confiables en la web para ayudarnos a comprender cómo usas el sitio y las formas en que podemos mejorar tu experiencia. Estas cookies pueden rastrear cosas como cuánto tiempo pasas en el sitio y las páginas que visitas para que podamos seguir produciendo contenido atractivo. Para obtener más información sobre las cookies de Google Analytics, consulta la página oficial de Google Analytics.
            </li>
          </ul>
          
          <h2>Más Información</h2>
          <p>Esperamos que esto haya aclarado las cosas para ti y, como se mencionó anteriormente, si hay algo de lo que no estás seguro si necesitas o no, generalmente es más seguro dejar las cookies habilitadas en caso de que interactúe con una de las funciones que utilizas en nuestro sitio.</p>
          <p>Sin embargo, si aún buscas más información, puedes contactarnos a través de uno de nuestros métodos de contacto preferidos: Correo electrónico: info@goaventura.com.ar</p>
          
          <p className="mt-8 font-semibold">Por favor, reemplaza este contenido de ejemplo con la política de cookies real y legalmente compatible de GoAventura.</p>
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
