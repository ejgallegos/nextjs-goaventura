
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
          <p className="mt-4 text-lg text-muted-foreground">Última actualización: 1 de Agosto de 2024</p>
        </header>

        <div className="prose prose-lg max-w-none text-foreground prose-headings:font-headline prose-headings:text-foreground">
          <p>Bienvenido a Go aventura. Estos términos y condiciones describen las reglas y regulaciones para el uso del sitio web y los servicios de Go aventura (EVyT Leg. 20019, <Link href="https://www.argentina.gob.ar/servicio/consultar-agencias-de-viajes" target="_blank" rel="noopener noreferrer">ver legajo</Link>), en adelante "la Agencia".</p>

          <h2>1. Aceptación de los Términos</h2>
          <p>Al acceder a este sitio web y/o contratar nuestros servicios, usted acepta estos términos y condiciones en su totalidad. No continúe usando el sitio web de Go aventura si no acepta todos los términos y condiciones establecidos en esta página.</p>

          <h2>2. Servicios Prestados</h2>
          <p>La Agencia ofrece servicios de intermediación en la reserva de excursiones, traslados y alojamientos, así como la organización y venta de paquetes turísticos. Los detalles, inclusiones y exclusiones de cada servicio se especifican en su respectiva descripción en el sitio web.</p>
          
          <h2>3. Precios y Pagos</h2>
          <p>Los precios publicados en el sitio web están expresados en Pesos Argentinos (ARS) o Dólares Estadounidenses (USD) según se indique, e incluyen los impuestos aplicables, salvo que se especifique lo contrario. La Agencia se reserva el derecho de modificar los precios sin previo aviso hasta que la reserva sea confirmada y el pago total o parcial haya sido efectuado.</p>

          <h2>4. Política de Cancelación y Modificación</h2>
          <p>Las políticas de cancelación y modificación varían según el servicio contratado (excursión, alojamiento, paquete, etc.) y el proveedor final. Dichas políticas específicas serán informadas al momento de realizar la consulta o la reserva. Es responsabilidad del cliente informarse sobre estas condiciones antes de confirmar su compra.</p>

          <h2>5. Derecho de Arrepentimiento</h2>
          <p>De conformidad con el Artículo 34 de la Ley N° 24.240 de Defensa del Consumidor y el Artículo 1110 del Código Civil y Comercial de la Nación, para las contrataciones de servicios realizadas a través de este sitio web, usted tiene el derecho irrenunciable de revocar la aceptación dentro de los diez (10) días corridos contados a partir de la fecha de celebración del contrato, sin responsabilidad alguna. Para ejercer este derecho, deberá notificar a la Agencia de manera fehaciente. Los costos de devolución, si los hubiere, correrán por cuenta de la Agencia. Este derecho no aplicará en los casos de excepción previstos por la ley, como los servicios de transporte o alojamiento para una fecha determinada.</p>
          
          <h2>6. Responsabilidad</h2>
          <p>La Agencia actúa como intermediario entre el cliente y los prestadores de los servicios (transportistas, hoteles, etc.), por lo que su responsabilidad se limita a la intermediación en la reserva y no se extiende a la ejecución del servicio en sí. No obstante, la Agencia velará por la correcta prestación de los servicios contratados.</p>
          <p>La Agencia no se hace responsable por eventos de fuerza mayor o caso fortuito (condiciones climáticas, desastres naturales, conflictos sociales, etc.) que puedan afectar la prestación de los servicios.</p>

          <h2>7. Propiedad Intelectual</h2>
          <p>A menos que se indique lo contrario, Go aventura y/o sus licenciantes poseen los derechos de propiedad intelectual de todo el material en este sitio web. No debe republicar, vender, alquilar, reproducir o redistribuir contenido de Go aventura sin consentimiento previo.</p>

          <h2>8. Ley Aplicable y Jurisdicción</h2>
          <p>Estos términos se regirán e interpretarán de acuerdo con las leyes de la República Argentina. Para cualquier controversia, las partes se someten a la jurisdicción de los Tribunales Ordinarios de la ciudad de Villa Unión, Provincia de La Rioja, renunciando a cualquier otro fuero que pudiera corresponderles.</p>

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
