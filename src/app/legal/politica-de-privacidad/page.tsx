import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Conoce cómo Go aventua recopila, usa y protege tu información personal.',
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 md:mb-12">
          <ShieldCheck className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">Política de Privacidad</h1>
          <p className="mt-4 text-lg text-muted-foreground">Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </header>

        <div className="prose prose-lg max-w-none text-foreground prose-headings:font-headline prose-headings:text-primary">
          <p>En Go aventua, accesible desde https://goaventua.com.ar, una de nuestras principales prioridades es la privacidad de nuestros visitantes. Este documento de Política de Privacidad contiene tipos de información que son recopilados y registrados por Go aventua y cómo los usamos.</p>

          <h2>1. Información que Recopilamos</h2>
          <p>La información personal que se te pide que proporciones, y las razones por las que se te pide que la proporciones, se te aclararán en el momento en que te pidamos que proporciones tu información personal.</p>
          <p>Si nos contactas directamente, podemos recibir información adicional sobre ti, como tu nombre, dirección de correo electrónico, número de teléfono, el contenido del mensaje y/o archivos adjuntos que nos puedas enviar, y cualquier otra información que elijas proporcionar.</p>
          <p>Cuando te registras para una Cuenta, podemos pedir tu información de contacto, incluyendo elementos como nombre, nombre de la compañía, dirección, dirección de correo electrónico y número de teléfono.</p>

          <h2>2. Cómo Usamos tu Información</h2>
          <p>Usamos la información que recopilamos de varias maneras, incluyendo para:</p>
          <ul>
            <li>Proveer, operar y mantener nuestro sitio web</li>
            <li>Mejorar, personalizar y expandir nuestro sitio web</li>
            <li>Entender y analizar cómo usas nuestro sitio web</li>
            <li>Desarrollar nuevos productos, servicios, características y funcionalidades</li>
            <li>Comunicarnos contigo, ya sea directamente o a través de uno de nuestros socios, incluyendo para servicio al cliente, para proporcionarte actualizaciones y otra información relacionada con el sitio web, y para fines de marketing y promoción</li>
            <li>Enviarte correos electrónicos</li>
            <li>Encontrar y prevenir el fraude</li>
          </ul>

          <h2>3. Archivos de Registro (Log Files)</h2>
          <p>Go aventua sigue un procedimiento estándar de uso de archivos de registro. Estos archivos registran a los visitantes cuando visitan sitios web. Todas las empresas de hosting hacen esto y una parte de los análisis de los servicios de hosting. La información recopilada por los archivos de registro incluye direcciones de protocolo de internet (IP), tipo de navegador, proveedor de servicios de Internet (ISP), sello de fecha y hora, páginas de referencia/salida, y posiblemente el número de clics. Estos no están vinculados a ninguna información que sea personalmente identificable. El propósito de la información es analizar tendencias, administrar el sitio, rastrear el movimiento de los usuarios en el sitio web y recopilar información demográfica.</p>
          
          <h2>4. Cookies y Web Beacons</h2>
          <p>Como cualquier otro sitio web, Go aventua usa 'cookies'. Estas cookies se utilizan para almacenar información, incluidas las preferencias de los visitantes, y las páginas del sitio web a las que el visitante accedió o visitó. La información se utiliza para optimizar la experiencia de los usuarios personalizando el contenido de nuestra página web según el tipo de navegador de los visitantes y/u otra información.</p>

          <h2>5. Derechos de Privacidad (No Vender Mi Información Personal)</h2>
          <p>[Información sobre derechos específicos de privacidad como CCPA o GDPR, si aplica. ESTE ES UN CONTENIDO DE EJEMPLO.]</p>

          <h2>6. Derechos de Protección de Datos GDPR</h2>
          <p>[Información sobre los derechos GDPR para usuarios de la UE. ESTE ES UN CONTENIDO DE EJEMPLO.]</p>
          
          <h2>7. Información para Niños</h2>
          <p>Otra parte de nuestra prioridad es agregar protección para los niños mientras usan internet. Alentamos a los padres y tutores a observar, participar y/o monitorear y guiar su actividad en línea.</p>
          <p>Go aventua no recopila conscientemente ninguna Información de Identificación Personal de niños menores de 13 años. Si crees que tu hijo proporcionó este tipo de información en nuestro sitio web, te instamos encarecidamente a que te pongas en contacto con nosotros de inmediato y haremos nuestros mejores esfuerzos para eliminar rápidamente dicha información de nuestros registros.</p>
          
          <p className="mt-8 font-semibold">Por favor, reemplaza este contenido de ejemplo con la política de privacidad real y legalmente compatible de Go aventua.</p>
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
