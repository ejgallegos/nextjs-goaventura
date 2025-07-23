
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { mockExcursions } from '@/lib/data/excursions';
import { mockTransfers } from '@/lib/data/transfers';
import type { Product } from '@/lib/types';
import { productSchema } from './data/schema';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';


// Simulate fetching data. In a real app, this would be from a database.
async function getTasks(): Promise<(Product & {status: string})[]> {
    const allProducts = [...mockExcursions, ...mockTransfers];
    allProducts.sort((a, b) => a.name.localeCompare(b.name));
    return allProducts.map(p => ({...p, status: 'published'})); // Add dummy status
}

export default function TaskPage() {
  const [tasks, setTasks] = useState<(Product & {status: string})[]>([]);
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
    getTasks().then(data => setTasks(data));
  }, []);
  
  if (!tasks.length) {
    return (
        <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
             <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">¡Bienvenido de nuevo!</h2>
                <p className="text-muted-foreground">
                  Aquí está la lista de tus viajes.
                </p>
              </div>
            </div>
            <p>Cargando viajes...</p>
        </div>
    )
  }

  return (
    <>
      <title>Gestor de Contenido - Viajes</title>
      <div className="md:hidden">
        <div className="w-full h-full flex items-center justify-center p-8">
            <p>El gestor de contenido no está disponible en dispositivos móviles.</p>
        </div>
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">¡Bienvenido de nuevo!</h2>
            <p className="text-muted-foreground">
              Aquí está la lista de tus viajes.
            </p>
          </div>
          <div className="flex items-center space-x-2">
             <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
