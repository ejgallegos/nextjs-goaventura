"use client";

import { useEffect } from "react";

type ProductType = "accommodation" | "excursion" | "transfer";

interface ProductPageTrackerProps {
  productId: string;
  productName: string;
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
  productName,
  productType,
}: ProductPageTrackerProps) {
  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined" || typeof window.gtag === "undefined") {
      return;
    }

    // Map product type to GA4 event name
    const eventNameMap: Record<ProductType, string> = {
      accommodation: "accommodation_view",
      excursion: "excursion_view",
      transfer: "transfer_view",
    };

    const eventName = eventNameMap[productType];
    
    // Send enhanced page_view event for products
    window.gtag("event", eventName, {
      product_id: productId,
      product_name: productName,
      product_type: productType,
      page_location: window.location.href,
    });
  }, [productId, productName, productType]);

  // This component doesn't render anything
  return null;
}