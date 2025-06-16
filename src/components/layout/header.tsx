
"use client";

import { forwardRef, useState, ElementRef, ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Added Image import
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sparkles, ShoppingCart } from 'lucide-react'; // Removed MountainSnow and X
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  {
    label: "Viajes",
    subLinks: [
      { href: "/viajes/excursiones", label: "Excursiones", description: "Aventuras y tours guiados." },
      { href: "/viajes/transfers", label: "Transfers", description: "Transporte cómodo y seguro." },
    ],
  },
  { href: "/alojamientos", label: "Alojamientos" },
  { href: "/blog", label: "Blog" },
  { href: "/contacto", label: "Contacto" },
];

const ListItem = forwardRef<
  ElementRef<"a">,
  ComponentPropsWithoutRef<"a"> & { title: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-20 items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="GoAventura Logo"
            width={183}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {navLinks.map((link) =>
              link.subLinks ? (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuTrigger className="font-body text-base">{link.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                      {link.subLinks.map((subLink) => (
                        <ListItem key={subLink.label} href={subLink.href} title={subLink.label}>
                          {subLink.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={link.label}>
                  <Link href={link.href} legacyBehavior passHref>
                    <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "font-body text-base")}>
                      {link.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )
            )}
             <NavigationMenuItem>
                <Link href="/ai/enhance-summary" legacyBehavior passHref>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "font-body text-base bg-accent text-accent-foreground hover:bg-accent/90 flex items-center")}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    AI Summary
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Carrito">
                <ShoppingCart className="h-5 w-5" />
            </Button>
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
            <div className="flex justify-between items-center p-4 border-b">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="GoAventura Logo"
                  width={128}
                  height={28}
                  className="h-7 w-auto"
                  priority
                />
              </Link>
            </div>
            <nav className="py-4 px-2 flex flex-col h-[calc(100vh-130px)]"> {/* Adjusted height to account for potential header/footer within sheet */}
              <ul className="flex flex-col space-y-1 flex-grow">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    {link.subLinks ? (
                      <div className="flex flex-col space-y-1">
                        <span className="font-body text-base font-medium text-muted-foreground px-3 py-2">{link.label}</span>
                        <ul className="pl-3 space-y-1">
                          {link.subLinks.map((subLink) => (
                            <li key={subLink.label}>
                              <Link
                                href={subLink.href}
                                className="block rounded-md px-3 py-2 text-base text-foreground hover:bg-accent hover:text-accent-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subLink.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <Link
                        href={link.href}
                        className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
                 <li>
                    <div className="border-t mt-3 pt-3">
                        <Link
                            href="/ai/enhance-summary"
                            className="flex items-center rounded-md px-3 py-2 text-base font-medium bg-accent text-accent-foreground hover:bg-accent/90"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            AI Summary
                        </Link>
                    </div>
                </li>
              </ul>
              <div className="mt-auto border-t pt-4 space-y-2 px-2">
                 <div className="flex justify-between items-center px-1">
                    <span className="text-base font-medium text-foreground">Cambiar Tema</span>
                    <ThemeToggle />
                  </div>
                <Button variant="outline" size="lg" aria-label="Carrito" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Carrito
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

