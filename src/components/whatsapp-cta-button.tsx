
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
  ...props
}) => {
  const encodedText = encodeURIComponent(predefinedText);
  const whatsappUrl = `${WHATSAPP_API_BASE_URL}${phoneNumber}?text=${encodedText}`;

  const handleClick = () => {
    if (productId && productName) {
        const clickedKey = `clicked-whatsapp-${productId}`;
        if (!localStorage.getItem(clickedKey)) {
            trackWhatsappClick(productId, productName);
            localStorage.setItem(clickedKey, 'true');
        }
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
