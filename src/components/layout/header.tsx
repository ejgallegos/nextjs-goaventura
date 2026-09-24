"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WHATSAPP_NUMBER, WHATSAPP_API_BASE_URL } from '@/lib/constants';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/alojamientos", label: "Alojamientos" },
  { href: "/viajes", label: "Excursiones y viajes" },
  { href: "/shorts", label: "Shorts" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const whatsappUrl = `${WHATSAPP_API_BASE_URL}${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola! Quiero hacer una consulta.')}`;

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-[background-color,box-shadow,border-color] duration-300',
        scrolled
          ? 'border-b border-border bg-background/95 shadow-sm backdrop-blur-sm'
          : 'bg-background'
      )}
    >
      <div className={cn(
        'mx-auto flex max-w-7xl items-center justify-between px-5 transition-[height] duration-300 sm:px-6 lg:px-8',
        scrolled ? 'h-16' : 'h-20 lg:h-24'
      )}>
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            'relative z-10 flex shrink-0 items-center transition-[width] duration-300',
            scrolled ? 'w-[120px] sm:w-[135px] lg:w-[145px]' : 'w-[170px] sm:w-[190px] lg:w-[220px]'
          )}
        >
          <Image
            src="/logo.png"
            alt="Go Aventura"
            width={220}
            height={66}
            className="h-auto w-full dark:hidden"
            priority
          />
          <Image src="/logo-white.png" alt="" width={220} height={68} className="hidden h-auto w-full dark:block" aria-hidden="true" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative flex min-h-11 items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive(link.href)
                  ? 'text-primary bg-primary/10'
                  : 'text-foreground/75 hover:text-foreground hover:bg-muted'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground/75 hover:text-primary transition-colors"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>Contacto</span>
          </a>
        </div>

        {/* Mobile */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="min-h-11 min-w-11 text-foreground hover:text-foreground hover:bg-muted" aria-label="Menú">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-sm border-l-0 p-0 bg-background">
            <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
            <div className="flex items-center justify-between p-5 border-b">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Image src="/logo.png" alt="Go Aventura" width={120} height={27} className="h-7 w-auto" />
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} aria-label="Cerrar">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="py-3 px-3">
              <ul className="space-y-0.5">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition-colors',
                        isActive(link.href)
                          ? 'bg-accent/10 text-accent'
                          : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {link.label}
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="px-3 pb-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl bg-accent text-white px-5 py-3.5 font-medium transition-all hover:bg-accent/90 mx-2"
              >
                <WhatsAppIcon className="h-5 w-5 shrink-0" />
                Consultar por WhatsApp
              </a>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
