
"use client";

import { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/types';
import { mockExcursions } from '@/lib/data/excursions';
import { mockTransfers } from '@/lib/data/transfers';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

const tripSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  shortDescription: z.string().optional(),
  category: z.enum(['Excursion', 'Transfer']),
  status: z.enum(['draft', 'published']),
  price: z.coerce.number().optional(),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
});

// Simulate fetching data for editing
const getTripBySlug = (slug: string): Product | undefined => {
  const allTrips = [...mockExcursions, ...mockTransfers];
  return allTrips.find(trip => trip.slug === slug);
};

export default function TripEditorForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const slug = searchParams.get('slug');

  const form = useForm<z.infer<typeof tripSchema>>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
        name: '',
        shortDescription: '',
        category: 'Excursion',
        status: 'draft',
        price: 0,
        description: '',
    },
  });

  useEffect(() => {
    if (slug) {
      const tripData = getTripBySlug(slug);
      if (tripData) {
        setIsEditing(true);
        form.reset({
            name: tripData.name,
            shortDescription: tripData.shortDescription,
            category: tripData.category,
            status: 'published', // Assuming existing trips are published
            price: tripData.price,
            description: tripData.description,
        });
      }
    }
  }, [slug, form]);


  const onSubmit = (values: z.infer<typeof tripSchema>) => {
    // In a real app, you'd send this to your backend
    console.log('Trip data:', values);

    toast({
      title: `Viaje ${isEditing ? 'Actualizado' : 'Creado'} (Simulación)`,
      description: `El viaje "${values.name}" ha sido guardado.`,
    });

    router.push('/admin/viajes');
  };
  
  const isLoading = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Trekking a la Montaña" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
             <div className="grid gap-3">
                 <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo (Descripción Corta)</FormLabel>
                      <FormControl>
                        <Input placeholder="Un subtítulo atractivo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Viaje</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Excursion">Excursión</SelectItem>
                      <SelectItem value="Transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Ej: 5000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Estado</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="draft">Borrador</SelectItem>
                            <SelectItem value="published">Publicado</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>

        <div className="grid gap-3">
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (Texto Enriquecido)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe el viaje en detalle... Puedes usar Markdown para el formato." {...field} rows={10}/>
                  </FormControl>
                  <FormDescription>
                    Usa Markdown para agregar **negritas**, *itálicas*, listas y más.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
        
        <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
        </div>

      </form>
    </Form>
  );
}
