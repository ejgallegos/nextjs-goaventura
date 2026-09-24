
"use client";

import { buttonVariants, type ButtonProps } from '@/components/ui/button';
import { WHATSAPP_NUMBER, WHATSAPP_API_BASE_URL } from '@/lib/constants';
import { WhatsAppIcon } from './icons/whatsapp-icon';
import { trackWhatsappClick } from '@/lib/data/statistics';
import { trackAnalyticsEvent } from '@/lib/analytics';

interface WhatsAppCtaButtonProps extends Omit<ButtonProps, 'asChild' | 'href'> {
  phoneNumber?: string;
  predefinedText: string;
  buttonText?: string;
  showIcon?: boolean;
  productId?: string;
  productName?: string;
  productType?: 'accommodation' | 'excursion' | 'transfer' | 'promotion' | 'general';
}

const WhatsAppCtaButton: React.FC<WhatsAppCtaButtonProps> = ({
  phoneNumber = WHATSAPP_NUMBER,
  predefinedText,
  buttonText = "Consultar por WhatsApp",
  showIcon = true,
  variant = "whatsapp",
  size = "default",
  className,
  productId,
  productName,
  productType = "general",
}) => {
  const encodedText = encodeURIComponent(predefinedText);
  const whatsappUrl = `${WHATSAPP_API_BASE_URL}${phoneNumber}?text=${encodedText}`;

  const handleClick = () => {
    if (productId && productName) {
      let shouldTrack = true;
      try {
        const clickedKey = `clicked-whatsapp-${productId}`;
        shouldTrack = !window.localStorage.getItem(clickedKey);
        if (shouldTrack) window.localStorage.setItem(clickedKey, 'true');
      } catch {
        // Storage may be unavailable; track the inquiry without blocking WhatsApp.
      }
      if (shouldTrack) void trackWhatsappClick(productId, productName).catch(() => undefined);
    }

    trackAnalyticsEvent('whatsapp_click', {
      ...(productId ? { product_id: productId } : {}),
      product_type: productType,
    });
  };

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className={buttonVariants({ variant, size, className })}
      onClick={handleClick}
    >
      {showIcon && <WhatsAppIcon className="mr-2 h-5 w-5" />}
      {buttonText}
    </a>
  );
};

export default WhatsAppCtaButton;
