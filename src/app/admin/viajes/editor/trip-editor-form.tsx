
"use client";

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useRouter } from 'next/navigation';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { getProducts, saveProducts } from '@/lib/data/products';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const tripSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  shortDescription: z.string().optional(),
  category: z.enum(['Excursion', 'Transfer']),
  status: z.enum(['draft', 'published', 'archived']),
  price: z.coerce.number().optional(),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  imageUrl: z.string().optional(), // Added for image handling
  tags: z.string().optional(), // Represent tags as a comma-separated string for simplicity in form
  isFeatured: z.boolean().default(false).optional(),
});

const generateSlug = (text: string) => {
    return text
        .toString()
        .normalize('NFD') // split an accented letter into the base letter and the accent
        .replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // replace spaces with -
        .replace(/[^\w-]+/g, '') // remove all non-word chars
        .replace(/--+/g, '-'); // replace multiple - with single -
};

// Simulate fetching data for editing - now from our localStorage-aware function
const getTripBySlug = async (slug: string): Promise<Product | undefined> => {
  const allTrips = await getProducts();
  return allTrips.find(trip => trip.slug === slug);
};

const ImageUpload = ({ value, onChange, onRemove }: { value?: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onRemove: () => void }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Imagen del Viaje</CardTitle>
                <CardDescription>
                    Sube una imagen representativa para tu excursión o transfer.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {value ? (
                        <div className="relative group">
                            <Image
                                alt="Imagen de producto"
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
                                    <p className="text-xs text-muted-foreground">PNG, JPG, o WEBP (MAX. 800x400px)</p>
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


export default function TripEditorForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [tripId, setTripId] = useState<string | null>(null);
  
  const slug = searchParams.get('slug');

  const form = useForm<z.infer<typeof tripSchema>>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
        name: '',
        shortDescription: '',
        category: 'Excursion',
        status: 'draft',
        price: undefined,
        description: '',
        imageUrl: '',
        tags: '',
        isFeatured: false,
    },
  });

  useEffect(() => {
    if (slug) {
      const fetchTrip = async () => {
        const tripData = await getTripBySlug(slug);
        if (tripData) {
          setIsEditing(true);
          setTripId(tripData.id);
          form.reset({
              name: tripData.name,
              shortDescription: tripData.shortDescription,
              category: tripData.category,
              status: tripData.status,
              price: tripData.price,
              description: tripData.description,
              imageUrl: tripData.imageUrl,
              tags: tripData.tags?.join(', '),
              isFeatured: tripData.isFeatured,
          });
        }
      }
      fetchTrip();
    }
  }, [slug, form]);

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

  const onSubmit = async (values: z.infer<typeof tripSchema>) => {
    const allTrips = await getProducts(); // UPDATED
    let updatedTrips;
    const productTags = values.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];

    if (isEditing && tripId) {
        updatedTrips = allTrips.map(trip => {
            if (trip.id === tripId) {
                return {
                    ...trip,
                    ...values,
                    slug: generateSlug(values.name), // Update slug if name changes
                    tags: productTags,
                };
            }
            return trip;
        });
    } else {
        const newTrip: Product = {
            id: `prod_${Date.now()}`,
            slug: generateSlug(values.name),
            ...values,
            tags: productTags,
            imageUrl: values.imageUrl || 'https://placehold.co/600x400.png',
        };
        updatedTrips = [...allTrips, newTrip];
    }
    
    await saveProducts(updatedTrips); // UPDATED

    toast({
      title: `Viaje ${isEditing ? 'Actualizado' : 'Creado'}`,
      description: `El viaje "${values.name}" ha sido guardado exitosamente.`,
    });

    router.push('/admin/viajes');
    router.refresh(); // Tell Next.js to refresh the data on the target page
  };
  
  const isLoading = form.formState.isSubmitting;
  const imageUrl = form.watch('imageUrl');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 grid gap-6">
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
                            <Input placeholder="Un subtítulo atractivo" {...field} value={field.value ?? ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                            <Input type="number" placeholder="Dejar en blanco si no aplica" {...field} value={field.value ?? ''} onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)} />
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
                                    <SelectItem value="archived">Archivado</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>
            
            <div className="grid gap-6">
                <ImageUpload 
                  value={imageUrl}
                  onChange={handleImageChange}
                  onRemove={handleRemoveImage}
                />
                 <Card>
                    <CardHeader>
                        <CardTitle>Opciones Adicionales</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel>Marcar como Destacado</FormLabel>
                                        <FormDescription>
                                            El viaje aparecerá en la página de inicio.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            </div>
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

         <div className="grid gap-3">
            <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Etiquetas</FormLabel>
                    <FormControl>
                        <Input placeholder="4x4, Aventura, Cordillera" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormDescription>
                        Separa las etiquetas con comas.
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
