"use client";

import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function FloatingWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar el botón después de scrollear un poco hacia abajo
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // No mostrar en páginas específicas si es necesario, por ejemplo en /contacto
  if (pathname === '/contacto') return null;

  const phoneNumber = "5493825575566"; // El número principal de la agencia
  const defaultMessage = "Hola! Estaba viendo la web y me gustaría recibir más información.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-whatsapp text-whatsapp-foreground rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-whatsapp/90 focus:outline-none focus:ring-4 focus:ring-whatsapp/50 group ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
      </span>
      {/* Tooltip on hover */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-foreground text-background text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-xl">
        ¡Escribinos!
        <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-4 border-transparent border-l-foreground"></div>
      </div>
    </a>
  );
}
