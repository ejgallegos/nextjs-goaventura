
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
import { BlogPost } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { getBlogPosts, saveBlogPosts } from '@/lib/data/blog-posts';

const blogSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres.'),
  excerpt: z.string().min(10, 'El extracto debe tener al menos 10 caracteres.'),
  author: z.string().min(3, 'El autor debe tener al menos 3 caracteres.'),
  status: z.enum(['draft', 'published', 'archived']),
  content: z.string().min(50, 'El contenido debe tener al menos 50 caracteres.'),
  imageUrl: z.string().optional(),
  tags: z.string().optional(), // Represent tags as a comma-separated string for simplicity in form
});

const generateSlug = (title: string) => {
    return title
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};

const getPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  const allPosts = await getBlogPosts();
  return allPosts.find(post => post.slug === slug);
};

const ImageUpload = ({ value, onChange, onRemove }: { value?: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onRemove: () => void }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Imagen del Artículo</CardTitle>
                <CardDescription>
                    Sube una imagen destacada para el artículo.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    {value ? (
                        <div className="relative group">
                            <Image
                                alt="Imagen de artículo"
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

export default function BlogEditorForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);
  
  const slug = searchParams.get('slug');

  const form = useForm<z.infer<typeof blogSchema>>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
        title: '',
        excerpt: '',
        author: 'Go Aventura',
        status: 'draft',
        content: '',
        imageUrl: '',
        tags: '',
    },
  });

  useEffect(() => {
    if (slug) {
      const fetchPost = async () => {
        const postData = await getPostBySlug(slug);
        if (postData) {
          setIsEditing(true);
          setPostId(postData.id);
          form.reset({
              title: postData.title,
              excerpt: postData.excerpt,
              author: postData.author,
              status: (postData as any).status || 'published',
              content: postData.content,
              imageUrl: postData.imageUrl,
              tags: postData.tags?.join(', '),
          });
        }
      }
      fetchPost();
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

  const onSubmit = async (values: z.infer<typeof blogSchema>) => {
    const allPosts = await getBlogPosts();
    let updatedPosts;
    const postTags = values.tags?.split(',').map(tag => tag.trim()).filter(Boolean) || [];

    if (isEditing && postId) {
        updatedPosts = allPosts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    ...values,
                    slug: generateSlug(values.title), // Update slug if title changes
                    tags: postTags,
                };
            }
            return post;
        });
    } else {
        const newPost: BlogPost & { status: string } = {
            id: `blog_${Date.now()}`,
            slug: generateSlug(values.title),
            date: new Date().toISOString(),
            ...values,
            tags: postTags,
            imageUrl: values.imageUrl || 'https://placehold.co/800x450.png',
        };
        updatedPosts = [...allPosts, newPost];
    }
    
    await saveBlogPosts(updatedPosts);

    toast({
      title: `Artículo ${isEditing ? 'Actualizado' : 'Creado'}`,
      description: `El artículo "${values.title}" ha sido guardado exitosamente.`,
    });

    router.push('/admin/blog');
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
                        <Input placeholder="El título de tu artículo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extracto (Resumen)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Un resumen corto y atractivo para la vista previa del blog." {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Autor</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre del autor" {...field} />
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
            
            <div className="grid gap-3">
                <ImageUpload 
                  value={imageUrl}
                  onChange={handleImageChange}
                  onRemove={handleRemoveImage}
                />
            </div>
        </div>

        <div className="grid gap-3">
             <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenido del Artículo</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Escribe el contenido completo aquí... Puedes usar Markdown para el formato." {...field} rows={15}/>
                  </FormControl>
                  <FormDescription>
                    Usa Markdown para agregar **negritas**, *itálicas*, listas, enlaces y más.
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
                        <Input placeholder="aventura, trekking, patagonia" {...field} />
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
