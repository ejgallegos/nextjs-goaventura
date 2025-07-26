
"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from 'lucide-react';
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/viajes", label: "Viajes" },
  { href: "https://altosdeltalampaya.goaventura.com.ar/", label: "Alojamientos" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md">
      <div className="container flex h-20 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Go aventura Logo"
            width={183}
            height={40}
            className="h-15 w-auto dark:hidden"
          />
          <Image
            src="/logo-white.png"
            alt="Go aventura Logo"
            width={183}
            height={40}
            className="h-15 w-auto hidden dark:block"
          />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.label}>
                <NavigationMenuLink asChild>
                  <Link
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={cn(navigationMenuTriggerStyle(), "font-body text-base hover:bg-transparent")}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
        </div>

        {/* Mobile Navigation */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Abrir menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm p-0">
            <SheetTitle className="sr-only">Menú de Navegación</SheetTitle>
            <div className="flex justify-between items-center p-4 border-b">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                 <Image
                  src="/logo.png"
                  alt="Go aventura Logo"
                  width={128} 
                  height={28} 
                  className="h-7 w-auto dark:hidden" 
                />
                 <Image
                  src="/logo-white.png"
                  alt="Go aventura Logo"
                  width={128} 
                  height={28} 
                  className="h-7 w-auto hidden dark:block" 
                />
              </Link>
            </div>
            <nav className="py-4 px-2 flex flex-col h-[calc(100vh-130px)]">
              <ul className="flex flex-col space-y-1 flex-grow">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-auto border-t pt-4 space-y-2 px-2">
                 <div className="flex justify-between items-center px-1">
                    <span className="text-base font-medium text-foreground">Cambiar Tema</span>
                    <ThemeToggle />
                  </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
