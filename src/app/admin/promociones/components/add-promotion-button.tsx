
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function AddPromotionButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/admin/promociones/editor');
  };

  return (
    <Button variant="default" size="sm" className="h-8" onClick={handleClick}>
      Añadir Promoción
    </Button>
  );
}
