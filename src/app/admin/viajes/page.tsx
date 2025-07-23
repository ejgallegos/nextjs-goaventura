import { Metadata } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import {-productSchema } from './data/schema';
import { mockExcursions } from '@/lib/data/excursions';
import { mockTransfers } from '@/lib/data/transfers';
import type { Product } from '@/lib/types';
import { productSchema } from './data/schema';

export const metadata: Metadata = {
  title: 'Gestor de Contenido - Viajes',
  description: 'Administra las excursiones y transfers del sitio.',
};

// Simulate fetching data. In a real app, this would be from a database.
async function getTasks(): Promise<Product[]> {
    const allProducts = [...mockExcursions, ...mockTransfers];
    allProducts.sort((a, b) => a.name.localeCompare(b.name));
    return allProducts.map(p => ({...p, status: 'published'})); // Add dummy status
}

export default async function TaskPage() {
  const tasks = await getTasks();

  return (
    <>
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
            {/* UserNav />} */}
          </div>
        </div>
        <DataTable data={tasks} columns={columns} />
      </div>
    </>
  );
}
