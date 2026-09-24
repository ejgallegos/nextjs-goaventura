"use client";

import { useEffect } from "react";
import { trackAnalyticsEvent } from '@/lib/analytics';

type ProductType = "accommodation" | "excursion" | "transfer";

interface ProductPageTrackerProps {
  productId: string;
  productName?: string;
  productType: ProductType;
}

/**
 * Componente para tracking de Google Analytics 4 en páginas de productos.
 * Envía un evento de page_view con parámetros personalizados para GA4.
 * 
 * Usage: Incluir en la página de producto (alojamiento, excursion, transfer)
 * pasando el id, nombre y tipo del producto.
 */
export default function ProductPageTracker({
  productId,
  productType,
}: ProductPageTrackerProps) {
  useEffect(() => {
    // Only run on client side
    const eventNameMap: Record<ProductType, string> = {
      accommodation: 'accommodation_view',
      excursion: 'excursion_view',
      transfer: 'transfer_view',
    };

    trackAnalyticsEvent(eventNameMap[productType], {
      product_id: productId,
      product_type: productType,
    });
  }, [productId, productType]);

  // This component doesn't render anything
  return null;
}
