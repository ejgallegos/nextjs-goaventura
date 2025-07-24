
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import type { HeroSlide } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getSlides } from '@/lib/data/slides';

export default function SliderAdminPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Sesión Cerrada",
        description: "Has cerrado sesión correctamente.",
      });
      router.push('/login');
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const fetchSlides = async () => {
      setIsLoading(true);
      const data = await getSlides();
      setSlides(data);
      setIsLoading(false);
    }
    fetchSlides();
  }, []);
  
  const renderContent = () => {
    if (isLoading) {
        return <p>Cargando diapositivas...</p>;
    }
    return <DataTable data={slides} columns={columns} />;
  }


  return (
    <>
      <title>Gestor de Contenido - Slider</title>
      <div className="md:hidden">
        <div className="w-full h-full flex items-center justify-center p-8">
            <p>El gestor de contenido no está disponible en dispositivos móviles.</p>
        </div>
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Gestor del Slider Principal</h2>
            <p className="text-muted-foreground">
              Aquí está la lista de todas tus diapositivas.
            </p>
          </div>
          <div className="flex items-center space-x-2">
             <Button asChild variant="outline" size="sm">
                <Link href="/admin">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver al Panel
                </Link>
            </Button>
             <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
        {renderContent()}
      </div>
    </>
  );
}
