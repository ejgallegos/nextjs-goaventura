'use client';

import { useState, useEffect } from 'react';
import { WHATSAPP_NUMBER, WHATSAPP_API_BASE_URL } from '@/lib/constants';
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon';
import { cn } from '@/lib/utils';

export function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.5);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = `${WHATSAPP_API_BASE_URL}${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola! Quiero hacer una consulta sobre los servicios de Go Aventura.')}`;

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 transition-all duration-500',
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-4 opacity-0 pointer-events-none'
      )}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-14 w-14 items-center justify-center rounded-2xl bg-accent shadow-lg shadow-accent/30 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-accent/40 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        aria-label="Consultar por WhatsApp"
      >
        <WhatsAppIcon className="h-6 w-6 text-white" />
      </a>
    </div>
  );
}
