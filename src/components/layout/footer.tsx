import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-foreground">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-block">
              <Image src="/logo.png" alt="Go Aventura" width={140} height={31} className="h-8 w-auto dark:hidden" />
              <Image src="/logo-white.png" alt="" width={140} height={31} className="hidden h-8 w-auto dark:block" aria-hidden="true" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Excursiones en 4x4, transfers y alojamientos premium en Villa Unión del Talampaya. La Rioja te espera.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/goaventura.ok"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/70 hover:bg-background transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Leg. 20019 ·{' '}
              <Link href="https://www.agenciasdeviajes.ar/agencias/S7D8sTXk?preview=true" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline">
                Legajo Habilitante
              </Link>
            </p>
          </div>

          {/* Nav */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Navegación</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/alojamientos', label: 'Alojamientos' },
                { href: '/viajes', label: 'Excursiones y viajes' },
                { href: '/shorts', label: 'Shorts' },
                { href: '/nosotros', label: 'Nosotros' },
                { href: '/contacto', label: 'Contacto' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Legal</h3>
            <ul className="space-y-2.5">
              {[
                { href: '/faq', label: 'FAQ' },
                { href: '/legal/terminos-y-condiciones', label: 'Términos' },
                { href: '/legal/politica-de-privacidad', label: 'Privacidad' },
                { href: '/legal/politica-de-cookies', label: 'Cookies' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Contacto</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+5493825575566" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 text-accent" />
                  +549 3825 575566
                </a>
              </li>
              <li>
                <a href="mailto:info@goaventura.com.ar" className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 text-accent" />
                  info@goaventura.com.ar
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-accent" />
                  Villa Unión, La Rioja
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="section-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} Go Aventura. Todos los derechos reservados.</p>
          <p>Diseñado con pasión para amantes de la aventura</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
