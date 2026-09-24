"use client";

import type { ReactNode } from 'react';
import { trackAnalyticsEvent } from '@/lib/analytics';

interface BookingCtaLinkProps {
  href: string;
  productId: string;
  className?: string;
  children: ReactNode;
}

export default function BookingCtaLink({ href, productId, className, children }: BookingCtaLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackAnalyticsEvent('booking_click', { product_id: productId, product_type: 'accommodation' })}
      className={className}
    >
      {children}
    </a>
  );
}
