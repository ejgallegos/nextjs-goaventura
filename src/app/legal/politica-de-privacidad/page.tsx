import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Conoce cómo Go aventura recopila, usa y protege tu información personal de acuerdo con la Ley 25.326 de Argentina.',
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 md:mb-12">
          <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">Política de Privacidad</h1>
          <p className="mt-4 text-lg text-muted-foreground">Última actualización: 1 de Agosto de 2024</p>
        </header>

        <div className="prose prose-lg max-w-none text-foreground prose-headings:font-headline prose-headings:text-foreground">
          <p>En Go aventura (EVyT Leg. 20019), accesible desde https://goaventura.com.ar, la privacidad de nuestros visitantes es una de nuestras principales prioridades. Este documento de Política de Privacidad contiene los tipos de información que son recopilados y registrados por Go aventura y cómo los usamos, en cumplimiento con la Ley de Protección de Datos Personales N° 25.326 de la República Argentina.</p>

          <h2>1. Responsable de la Base de Datos</h2>
          <p>Go aventura, con domicilio en Joaquín V. González 125, Villa Unión, La Rioja, Argentina, es el responsable de las bases de datos con la información personal recopilada a través de este sitio web.</p>

          <h2>2. Información que Recopilamos</h2>
          <p>Recopilamos información personal que usted nos proporciona voluntariamente al contactarnos, solicitar un presupuesto, suscribirse a nuestro boletín o contratar nuestros servicios. Esta información puede incluir, entre otros:</p>
          <ul>
            <li>Nombre y Apellido</li>
            <li>Dirección de correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Cualquier otro dato que usted provea en el cuerpo de su mensaje o consulta.</li>
          </ul>
          
          <h2>3. Finalidad del Tratamiento de Datos</h2>
          <p>La información personal que recopilamos se utiliza con las siguientes finalidades:</p>
          <ul>
            <li>Proveer, operar y mantener nuestro sitio web y los servicios solicitados.</li>
            <li>Mejorar, personalizar y expandir nuestros servicios y la experiencia del usuario.</li>
            <li>Entender y analizar cómo usa nuestro sitio web para optimizar su funcionamiento.</li>
            <li>Comunicarnos con usted para fines de servicio al cliente, para proporcionarle actualizaciones sobre los servicios contratados y para fines de marketing y promoción, siempre que contemos con su consentimiento.</li>
            <li>Procesar sus reservas y pagos.</li>
            <li>Prevenir el fraude y garantizar la seguridad de nuestro sitio.</li>
          </ul>
          
          <h2>4. Consentimiento</h2>
          <p>Al proporcionar sus datos personales, usted otorga su consentimiento libre, expreso e informado para que su información sea utilizada con las finalidades mencionadas anteriormente. Puede retirar su consentimiento en cualquier momento, comunicándose con nosotros a través de los medios de contacto provistos.</p>

          <h2>5. Derechos de los Titulares de los Datos</h2>
          <p>Usted tiene derecho a ejercer los derechos de acceso, rectificación, actualización y supresión de sus datos personales, de forma gratuita y a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto.</p>
          <p>Para ejercer estos derechos, puede enviar un correo electrónico a info@goaventura.com.ar (Placeholder), acreditando su identidad. Su solicitud será procesada dentro de los plazos estipulados por la normativa vigente.</p>
          <p>La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.</p>

          <h2>6. Seguridad de los Datos</h2>
          <p>Go aventura adopta las medidas técnicas y organizativas necesarias para garantizar la seguridad y confidencialidad de sus datos personales, a fin de evitar su adulteración, pérdida, consulta o tratamiento no autorizado, y que permitan detectar desviaciones de información.</p>

          <h2>7. Cookies</h2>
          <p>Nuestro sitio utiliza cookies para mejorar su experiencia. Para más información, por favor consulte nuestra <Link href="/legal/politica-de-cookies">Política de Cookies</Link>.</p>
          
          <h2>8. Información para Niños</h2>
          <p>Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos de forma intencionada información de identificación personal de menores. Si usted es padre o tutor y sabe que su hijo nos ha proporcionado información personal, por favor contáctenos para que podamos tomar las medidas necesarias.</p>
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
