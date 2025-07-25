
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
import { Promotion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, BedDouble } from 'lucide-react';
import { getPromotions, savePromotions } from '@/lib/data/promotions';
import { Switch } from '@/components/ui/switch';

const promotionSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres.'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres.'),
  status: z.enum(['draft', 'published']),
  price: z.coerce.number().optional(),
  imageUrl: z.string().optional(),
  included: z.string().optional(),
  validity: z.string().optional(),
  isFeatured: z.boolean().default(false).optional(),
  accommodationName: z.string().optional(),
  accommodationLink: z.string().url('Debe ser una URL válida.').optional().or(z.literal('')),
  accommodationImageUrl: z.string().optional(),
});

const generateSlug = (text: string) => {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

const getPromotionBySlug = async (slug: string): Promise<Promotion | undefined> => {
  const allPromos = await getPromotions();
  return allPromos.find(promo => promo.slug === slug);
};

const ImageUpload = ({ value, onChange, onRemove, title, description, hint }: { value?: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onRemove: () => void, title: string, description: string, hint: string }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {value ? (
                        <div className="relative group">
                            <Image
                                alt="Imagen subida"
                                className="aspect-video w-full rounded-md object-cover"
                                height="200"
                                src={value || 'https://placehold.co/300x200.png'}
                                width="300"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:opacity-100 opacity-0 transition-opacity flex items-center justify-center">
                                <Button type="button" variant="destructive" size="icon" onClick={onRemove}>
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
                                    <p className="text-xs text-muted-foreground">{hint}</p>
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

export default function PromotionEditorForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [promoId, setPromoId] = useState<string | null>(null);
  
  const slug = searchParams.get('slug');

  const form = useForm<z.infer<typeof promotionSchema>>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
        title: '',
        description: '',
        status: 'draft',
        price: undefined,
        imageUrl: '',
        included: '',
        validity: '',
        isFeatured: false,
        accommodationName: '',
        accommodationLink: '',
        accommodationImageUrl: '',
    },
  });

  useEffect(() => {
    if (slug) {
      const fetchPromo = async () => {
        const promoData = await getPromotionBySlug(slug);
        if (promoData) {
          setIsEditing(true);
          setPromoId(promoData.id);
          form.reset({
              ...promoData,
              included: promoData.included?.join('\n'),
          });
        }
      }
      fetchPromo();
    }
  }, [slug, form]);

  const handleImageChange = (field: 'imageUrl' | 'accommodationImageUrl') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue(field, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (field: 'imageUrl' | 'accommodationImageUrl') => () => {
    form.setValue(field, '');
  }

  const onSubmit = async (values: z.infer<typeof promotionSchema>) => {
    const allPromos = await getPromotions();
    let updatedPromos;
    const includedItems = values.included?.split('\n').map(item => item.trim()).filter(Boolean) || [];

    if (isEditing && promoId) {
        updatedPromos = allPromos.map(promo => {
            if (promo.id === promoId) {
                return {
                    ...promo,
                    ...values,
                    slug: generateSlug(values.title),
                    included: includedItems,
                };
            }
            return promo;
        });
    } else {
        const newPromo: Promotion = {
            id: `promo_${Date.now()}`,
            slug: generateSlug(values.title),
            ...values,
            included: includedItems,
            imageUrl: values.imageUrl || 'https://placehold.co/600x400.png',
        };
        updatedPromos = [...allPromos, newPromo];
    }
    
    await savePromotions(updatedPromos);

    toast({
      title: `Promoción ${isEditing ? 'Actualizada' : 'Creada'}`,
      description: `La promoción "${values.title}" ha sido guardada exitosamente.`,
    });

    router.push('/admin/promociones');
    router.refresh();
  };
  
  const isLoading = form.formState.isSubmitting;
  const imageUrl = form.watch('imageUrl');
  const accommodationImageUrl = form.watch('accommodationImageUrl');

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
                        <Input placeholder="Ej: Paquete Aventura Total" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Precio</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Dejar en blanco si no aplica" {...field} onChange={event => field.onChange(event.target.value === '' ? undefined : +event.target.value)} value={field.value ?? ''}/>
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
                 <FormField
                    control={form.control}
                    name="validity"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Validez de la Oferta</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: Válido para viajar hasta el 31/12" {...field} value={field.value ?? ''}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            
            <div className="grid gap-6">
                <ImageUpload 
                  value={imageUrl}
                  onChange={handleImageChange('imageUrl')}
                  onRemove={handleRemoveImage('imageUrl')}
                  title="Imagen de la Promoción"
                  description="Sube una imagen representativa para el paquete."
                  hint="PNG, JPG, o WEBP (MAX. 800x400px)"
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
                                            La promoción aparecerá en la página de inicio.
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
                  <FormLabel>Descripción de la Promoción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe el paquete en detalle..." {...field} rows={8}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>

         <div className="grid gap-3">
            <FormField
                control={form.control}
                name="included"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>¿Qué Incluye?</FormLabel>
                    <FormControl>
                        <Textarea placeholder="2 noches de alojamiento&#10;Excursión a..." {...field} value={field.value ?? ''} rows={5} />
                    </FormControl>
                    <FormDescription>
                        Escribe cada elemento incluido en una nueva línea.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
                )}
            />
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BedDouble className="h-6 w-6" />
                    Detalles del Alojamiento (Opcional)
                </CardTitle>
                <CardDescription>
                    Añade información sobre el alojamiento incluido en la promoción.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 grid gap-6">
                    <FormField
                        control={form.control}
                        name="accommodationName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nombre del Alojamiento</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ej: Hotel de las Montañas" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="accommodationLink"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enlace del Alojamiento</FormLabel>
                                <FormControl>
                                    <Input placeholder="URL para ver o reservar el alojamiento" {...field} value={field.value ?? ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <div className="grid gap-6">
                     <ImageUpload
                        value={accommodationImageUrl}
                        onChange={handleImageChange('accommodationImageUrl')}
                        onRemove={handleRemoveImage('accommodationImageUrl')}
                        title="Imagen del Alojamiento"
                        description="Sube una foto del hotel o cabaña."
                        hint="PNG, JPG, o WEBP (MAX. 800x400px)"
                    />
                </div>
            </CardContent>
        </Card>
        
        <div className="flex justify-end mt-6">
            <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
        </div>

      </form>
    </Form>
  );
}
