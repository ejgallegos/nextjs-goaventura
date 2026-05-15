
"use client";

import { Button, buttonVariants, type ButtonProps } from '@/components/ui/button';
import { WHATSAPP_NUMBER, WHATSAPP_API_BASE_URL } from '@/lib/constants';
import { WhatsAppIcon } from './icons/whatsapp-icon';
import { trackWhatsappClick } from '@/lib/data/statistics';

interface WhatsAppCtaButtonProps extends Omit<ButtonProps, 'asChild' | 'href'> {
  phoneNumber?: string;
  predefinedText: string;
  buttonText?: string;
  showIcon?: boolean;
  productId?: string;
  productName?: string;
  productType?: 'accommodation' | 'excursion' | 'transfer';
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
  productType = "accommodation",
  ...props
}) => {
  const encodedText = encodeURIComponent(predefinedText);
  const whatsappUrl = `${WHATSAPP_API_BASE_URL}${phoneNumber}?text=${encodedText}`;

  const handleClick = () => {
    // Track internal statistics
    if (productId && productName) {
        const clickedKey = `clicked-whatsapp-${productId}`;
        if (!localStorage.getItem(clickedKey)) {
            trackWhatsappClick(productId, productName);
            localStorage.setItem(clickedKey, 'true');
        }
    }

    // Track Google Analytics 4 event
    if (typeof window !== "undefined" && typeof window.gtag !== "undefined" && productId && productName) {
      window.gtag("event", "whatsapp_click", {
        product_id: productId,
        product_name: productName,
        product_type: productType,
        page_location: window.location.href,
      });
    }
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
