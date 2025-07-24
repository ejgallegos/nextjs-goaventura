
"use client";

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function AddSlideButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/admin/slider/editor');
  };

  return (
    <Button variant="default" size="sm" className="h-8" onClick={handleClick}>
      Añadir Diapositiva
    </Button>
  );
}
