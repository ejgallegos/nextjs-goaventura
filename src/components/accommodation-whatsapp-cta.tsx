"use client";

import { useEffect, useRef, useState } from 'react';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';

interface AccommodationWhatsAppCtaProps {
  accommodationId: string;
  accommodationName: string;
  phoneNumber: string;
}

const MOBILE_QUERY = '(max-width: 1023px)';

export default function AccommodationWhatsAppCta({
  accommodationId,
  accommodationName,
  phoneNumber,
}: AccommodationWhatsAppCtaProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isNearViewportCenter, setIsNearViewportCenter] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    let observer: IntersectionObserver | null = null;

    const updateObserver = () => {
      observer?.disconnect();
      observer = null;
      setIsNearViewportCenter(false);

      if (!mediaQuery.matches || !buttonRef.current) return;

      observer = new IntersectionObserver(
        ([entry]) => setIsNearViewportCenter(entry.isIntersecting),
        {
          rootMargin: '-35% 0px -35% 0px',
          threshold: 0,
        },
      );
      observer.observe(buttonRef.current);
    };

    updateObserver();
    mediaQuery.addEventListener('change', updateObserver);

    return () => {
      observer?.disconnect();
      mediaQuery.removeEventListener('change', updateObserver);
    };
  }, []);

  const mobilePulseClass = isNearViewportCenter ? 'accommodation-whatsapp-pulse' : '';

  return (
    <div ref={buttonRef} className="absolute bottom-3 right-3 z-10">
      <WhatsAppCtaButton
        phoneNumber={phoneNumber}
        predefinedText={`Hola, quiero consultar por ${accommodationName}.`}
        buttonText="Contactar"
        ariaLabel={`Consultar ${accommodationName} por WhatsApp`}
        size="icon"
        className={`group relative size-11 ${mobilePulseClass} overflow-hidden rounded-xl p-0 shadow-lg shadow-black/30 ring-1 ring-black/15 transition-[width,transform,box-shadow] duration-300 ease-out motion-reduce:transition-none hover:-translate-y-0.5 lg:hover:w-36 focus-visible:w-36 [&>svg]:absolute [&>svg]:left-3 [&>svg]:top-3`}
        textClassName="absolute left-11 top-1/2 hidden -translate-y-1/2 whitespace-nowrap text-sm opacity-0 transition-opacity duration-200 ease-out motion-reduce:transition-none lg:block lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
        productId={accommodationId}
        productName={accommodationName}
        productType="accommodation"
      />
    </div>
  );
}
