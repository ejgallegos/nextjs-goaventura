"use client";

import Link from 'next/link';
import { Button, type ButtonProps } from '@/components/ui/button';
import { WHATSAPP_NUMBER, WHATSAPP_API_BASE_URL } from '@/lib/constants';
import { WhatsAppIcon } from './icons/whatsapp-icon';

interface WhatsAppCtaButtonProps extends Omit<ButtonProps, 'asChild' | 'href'> {
  phoneNumber?: string;
  predefinedText: string;
  buttonText?: string;
  showIcon?: boolean;
}

const WhatsAppCtaButton: React.FC<WhatsAppCtaButtonProps> = ({
  phoneNumber = WHATSAPP_NUMBER,
  predefinedText,
  buttonText = "Consultar por WhatsApp",
  showIcon = true,
  variant = "whatsapp",
  size = "default",
  className,
  ...props
}) => {
  const encodedText = encodeURIComponent(predefinedText);
  const whatsappUrl = `${WHATSAPP_API_BASE_URL}${phoneNumber}?text=${encodedText}`;

  return (
    <Button asChild variant={variant} size={size} className={className} {...props}>
      <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
        {showIcon && <WhatsAppIcon className="mr-2 h-5 w-5" />}
        {buttonText}
      </Link>
    </Button>
  );
};

export default WhatsAppCtaButton;
