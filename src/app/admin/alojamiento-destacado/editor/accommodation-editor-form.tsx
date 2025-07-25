
"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { getFeaturedAccommodation, saveFeaturedAccommodation } from '@/lib/data/featured-accommodation';
import type { FeaturedAccommodation } from '@/lib/types';


const accommodationSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres.'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  imageUrl: z.string().url('Debe ser una URL válida.'),
  imageHint: z.string().optional(),
  buttonText: z.string().min(3, 'El texto del botón debe tener al menos 3 caracteres.'),
  buttonLink: z.string().url('Debe ser una URL válida.'),
});

const ImageUpload = ({ value, onChange, onRemove }: { value?: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onRemove: () => void }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Imagen de Fondo</CardTitle>
                <CardDescription>
                    Sube una imagen para la tarjeta.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {value ? (
                        <div className="relative group">
                            <Image
                                alt="Imagen de alojamiento"
                                className="aspect-video w-full rounded-md object-cover"
                                height="200"
                                src={value || 'https://placehold.co/300x200.png'}
                                width="300"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:opacity-100 opacity-0 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={onRemove}
                                >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Eliminar imagen</span>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center w-full">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground">
                                        <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                                    </p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, o WEBP (MAX. 800x450px)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" onChange={onChange} accept="image/*" />
                            </label>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}


export default function AccommodationEditorForm() {
  const router = useRouter();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof accommodationSchema>>({
    resolver: zodResolver(accommodationSchema),
    defaultValues: {
        title: '',
        description: '',
        imageUrl: '',
        imageHint: '',
        buttonText: '',
        buttonLink: '',
    },
  });

  useEffect(() => {
      const fetchAccommodationData = async () => {
        const data = await getFeaturedAccommodation();
        if (data) {
          form.reset(data);
        }
      }
      fetchAccommodationData();
  }, [form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    form.setValue('imageUrl', '');
  }

  const onSubmit = async (values: z.infer<typeof accommodationSchema>) => {
    await saveFeaturedAccommodation(values);

    toast({
      title: "Alojamiento Destacado Actualizado",
      description: "La información ha sido guardada exitosamente.",
    });

    router.push('/admin');
    router.refresh();
  };
  
  const isLoading = form.formState.isSubmitting;
  const imageUrl = form.watch('imageUrl');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 grid gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título de la tarjeta" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Descripción para la tarjeta" {...field} rows={5} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <FormField
                      control={form.control}
                      name="buttonText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Texto del Botón</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Ver Más" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="buttonLink"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Enlace del Botón</FormLabel>
                          <FormControl>
                            <Input placeholder="URL completa (https://...)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
            </div>
            
            <div className="grid gap-3">
                <ImageUpload 
                  value={imageUrl}
                  onChange={handleImageChange}
                  onRemove={handleRemoveImage}
                />
                 <FormField
                  control={form.control}
                  name="imageHint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pista para Imagen (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: cabin mountains" {...field} />
                      </FormControl>
                      <FormDescription>
                        Dos palabras clave para IA.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
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
