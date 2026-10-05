
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
  textClassName?: string;
  showIcon?: boolean;
  ariaLabel?: string;
  productId?: string;
  productName?: string;
  productType?: 'accommodation' | 'excursion' | 'transfer' | 'promotion' | 'general';
}

const WhatsAppCtaButton: React.FC<WhatsAppCtaButtonProps> = ({
  phoneNumber = WHATSAPP_NUMBER,
  predefinedText,
  buttonText = "Consultar por WhatsApp",
  textClassName,
  showIcon = true,
  ariaLabel,
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

  const hasVisibleText = buttonText.trim().length > 0;
  const accessibleLabel = ariaLabel ?? (hasVisibleText ? undefined : 'Consultar por WhatsApp');

  return (
    <a 
      href={whatsappUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className={buttonVariants({ variant, size, className })}
      aria-label={accessibleLabel}
      onClick={handleClick}
    >
      {showIcon && <WhatsAppIcon className="h-5 w-5" />}
      {hasVisibleText ? <span className={textClassName}>{buttonText}</span> : null}
    </a>
  );
};

export default WhatsAppCtaButton;
