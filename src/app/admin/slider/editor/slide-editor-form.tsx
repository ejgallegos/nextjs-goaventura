
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
import { HeroSlide } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { getSlides, saveSlides } from '@/lib/data/slides';

const slideSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres.'),
  subtitle: z.string().optional(),
  status: z.enum(['draft', 'published']),
  imageUrl: z.string().url('Debe ser una URL de imagen válida.'),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
});

const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/<[^>]*>?/gm, '') // Remove HTML tags
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};

const getSlideBySlug = async (slug: string): Promise<HeroSlide | undefined> => {
  const allSlides = await getSlides();
  return allSlides.find(slide => slide.slug === slug);
};

const ImageUpload = ({ value, onChange, onRemove }: { value?: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onRemove: () => void }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Imagen de la Diapositiva</CardTitle>
                <CardDescription>
                    Sube una imagen de fondo para la diapositiva.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {value ? (
                        <div className="relative group">
                            <Image
                                alt="Imagen de diapositiva"
                                className="aspect-video w-full rounded-md object-cover"
                                height="300"
                                src={value || 'https://placehold.co/1280x720.png'}
                                width="533"
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
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground">
                                        <span className="font-semibold">Haz clic para subir</span> o arrastra y suelta
                                    </p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, o WEBP (Recomendado: 1920x1080px)</p>
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

export default function SlideEditorForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [slideId, setSlideId] = useState<string | null>(null);
  
  const slug = searchParams.get('slug');

  const form = useForm<z.infer<typeof slideSchema>>({
    resolver: zodResolver(slideSchema),
    defaultValues: {
        title: '',
        subtitle: '',
        status: 'draft',
        imageUrl: '',
        buttonText: '',
        buttonLink: '',
    },
  });

  useEffect(() => {
    if (slug) {
      const fetchSlide = async () => {
        const slideData = await getSlideBySlug(slug);
        if (slideData) {
          setIsEditing(true);
          setSlideId(slideData.id);
          form.reset({
              title: slideData.title,
              subtitle: slideData.subtitle,
              status: slideData.status,
              imageUrl: slideData.imageUrl,
              buttonText: slideData.buttonText,
              buttonLink: slideData.buttonLink,
          });
        }
      }
      fetchSlide();
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

  const onSubmit = async (values: z.infer<typeof slideSchema>) => {
    const allSlides = await getSlides();
    let updatedSlides;

    if (isEditing && slideId) {
        updatedSlides = allSlides.map(slide => {
            if (slide.id === slideId) {
                return {
                    ...slide,
                    ...values,
                    slug: generateSlug(values.title), // Update slug if title changes
                };
            }
            return slide;
        });
    } else {
        const newSlide: HeroSlide = {
            id: `slide_${Date.now()}`,
            slug: generateSlug(values.title),
            ...values,
            imageUrl: values.imageUrl || 'https://placehold.co/1920x1080.png',
        };
        updatedSlides = [...allSlides, newSlide];
    }
    
    await saveSlides(updatedSlides);

    toast({
      title: `Diapositiva ${isEditing ? 'Actualizada' : 'Creada'}`,
      description: `La diapositiva ha sido guardada exitosamente.`,
    });

    router.push('/admin/slider');
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
                        <Input placeholder='Reserva tu próxima <span>aventura</span>' {...field} />
                      </FormControl>
                      <FormDescription>
                        Puedes usar `&lt;span&gt;` para estilizar parte del texto.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subtitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Un subtítulo atractivo para la diapositiva." {...field} rows={3} />
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
                            <Input placeholder="Ej: Explorar Viajes" {...field} />
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
                            <Input placeholder="Ej: /viajes" {...field} />
                          </FormControl>
                           <FormDescription>
                            Debe ser un enlace relativo (ej: /nosotros).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>
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
                <ImageUpload 
                  value={imageUrl}
                  onChange={handleImageChange}
                  onRemove={handleRemoveImage}
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
