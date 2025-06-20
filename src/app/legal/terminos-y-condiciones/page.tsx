import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: 'Lee los términos y condiciones de uso de los servicios de Go aventura.',
};

export default function TerminosPage() {
  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 md:mb-12">
          <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">Términos y Condiciones</h1>
          <p className="mt-4 text-lg text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>

        <div className="prose prose-lg max-w-none text-foreground prose-headings:font-headline prose-headings:text-foreground">
          <p>Bienvenido a Go aventura. Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web de Go aventura.</p>

          <h2>1. Aceptación de los Términos</h2>
          <p>Al acceder a este sitio web, asumimos que aceptas estos términos y condiciones en su totalidad. No continúes usando el sitio web de Go aventura si no aceptas todos los términos y condiciones establecidos en esta página.</p>

          <h2>2. Licencia</h2>
          <p>A menos que se indique lo contrario, Go aventura y/o sus licenciantes poseen los derechos de propiedad intelectual de todo el material en Go aventura. Todos los derechos de propiedad intelectual son reservados. Puedes ver y/o imprimir páginas desde https://goaventura.com.ar para tu uso personal sujeto a las restricciones establecidas en estos términos y condiciones.</p>
          <p>No debes:</p>
          <ul>
            <li>Republicar material de https://goaventura.com.ar</li>
            <li>Vender, alquilar o sublicenciar material de https://goaventura.com.ar</li>
            <li>Reproducir, duplicar o copiar material de https://goaventura.com.ar</li>
            <li>Redistribuir contenido de Go aventura (a menos que el contenido esté específicamente hecho para la redistribución).</li>
          </ul>

          <h2>3. Reservas y Pagos</h2>
          <p>[Detalles sobre el proceso de reserva, políticas de pago, cancelación, reembolsos, etc. ESTE ES UN CONTENIDO DE EJEMPLO Y DEBE SER REEMPLAZADO POR LOS TÉRMINOS REALES DE Go aventura.]</p>
          
          <h2>4. Responsabilidad del Usuario</h2>
          <p>[Información sobre lo que se espera de los usuarios, comportamiento, información proporcionada, etc. ESTE ES UN CONTENIDO DE EJEMPLO.]</p>

          <h2>5. Limitación de Responsabilidad</h2>
          <p>[Cláusulas sobre la limitación de responsabilidad de Go aventura. ESTE ES UN CONTENIDO DE EJEMPLO.]</p>

          <h2>6. Modificaciones de los Términos</h2>
          <p>Go aventura se reserva el derecho de revisar estos términos y condiciones en cualquier momento. Al usar este sitio web, se espera que revises estos términos de forma regular para asegurarte de que comprendes todos los términos y condiciones que rigen el uso de este sitio web.</p>

          <h2>7. Ley Aplicable</h2>
          <p>Estos términos se regirán e interpretarán de acuerdo con las leyes de Argentina, y te sometes irrevocablemente a la jurisdicción exclusiva de los tribunales en esa Estado o ubicación.</p>

          <p className="mt-8 font-semibold">Por favor, reemplaza este contenido de ejemplo con los términos y condiciones legales reales de Go aventura.</p>
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
