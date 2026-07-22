import Link from 'next/link';
import Image from 'next/image';
import { Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background border-t">
      <div className="container max-w-7xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand & About */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo-white.png"
                alt="Go Aventura Logo"
                width={183}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-background/80 leading-relaxed mb-6">
              Diseñamos experiencias auténticas y memorables en Villa Unión, La Rioja. Excursiones, transfers y alojamientos con la calidad que merecés.
            </p>
            <div className="bg-background/10 rounded-lg p-4 inline-block">
              <p className="text-xs font-semibold text-background mb-1">Agencia de Viajes Autorizada</p>
              <p className="text-xs text-background/70 mb-2">Legajo Min. Turismo: 20019</p>
              <a
                href="https://www.agenciasdeviajes.ar/agencias/S7D8sTXk?preview=true"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Verificar Legajo Habilitante &rarr;
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-headline font-bold text-background mb-6">
              Contacto
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="https://wa.me/5493825575566" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-background/80 hover:text-primary transition-colors group">
                  <Phone className="w-5 h-5 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-background group-hover:text-primary">WhatsApp / Teléfono</p>
                    <p className="text-sm">+54 9 3825 575566</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:info@goaventura.com.ar" className="flex items-start gap-3 text-background/80 hover:text-primary transition-colors group">
                  <Mail className="w-5 h-5 mt-0.5 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-medium text-background group-hover:text-primary">Email</p>
                    <p className="text-sm">info@goaventura.com.ar</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-background/80">
                  <MapPin className="w-5 h-5 mt-0.5" />
                  <div>
                    <p className="font-medium text-background">Ubicación</p>
                    <p className="text-sm">Villa Unión, La Rioja, Argentina</p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-3 text-background/80">
                  <Clock className="w-5 h-5 mt-0.5" />
                  <div>
                    <p className="font-medium text-background">Atención</p>
                    <p className="text-sm">Lunes a Domingos, 24hs online</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-headline font-bold text-background mb-6">
              Descubrí
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/viajes?filter=Excursion" className="text-background/80 hover:text-primary transition-colors inline-block">Excursiones en 4x4</Link>
              </li>
              <li>
                <Link href="/alojamientos" className="text-background/80 hover:text-primary transition-colors inline-block">Alojamientos recomendados</Link>
              </li>
              <li>
                <Link href="/viajes?filter=Transfer" className="text-background/80 hover:text-primary transition-colors inline-block">Transfers y Traslados</Link>
              </li>
              <li>
                <Link href="/nosotros" className="text-background/80 hover:text-primary transition-colors inline-block">Nuestra Historia</Link>
              </li>
              <li>
                <Link href="/blog" className="text-background/80 hover:text-primary transition-colors inline-block">Blog de Viajes</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-lg font-headline font-bold text-background mb-6">
              Legal & Social
            </h3>
            <ul className="space-y-3 mb-8">
              <li><Link href="/faq" className="text-sm text-background/70 hover:text-primary transition-colors">Preguntas Frecuentes (FAQ)</Link></li>
              <li><Link href="/legal/terminos-y-condiciones" className="text-sm text-background/70 hover:text-primary transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/legal/politica-de-privacidad" className="text-sm text-background/70 hover:text-primary transition-colors">Política de Privacidad</Link></li>
            </ul>
            
            <h4 className="text-sm font-bold text-background mb-4 uppercase tracking-wider">Seguinos</h4>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/goaventura.ok"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                aria-label="Instagram de Go Aventura"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/60">
            &copy; {currentYear} Go Aventura. Todos los derechos reservados.
          </p>
          <div className="text-sm text-background/60 flex items-center gap-1">
            Hecho con <span className="text-primary">&hearts;</span> en La Rioja
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
