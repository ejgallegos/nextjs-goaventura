import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { mockBlogPosts } from '@/lib/data/blog';
import type { BlogPost } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CalendarDays, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Blog de Viajes',
  description: 'Artículos, guías y consejos de viaje de Go aventura. Inspírate para tu próxima aventura.',
};

async function getBlogPosts(): Promise<BlogPost[]> {
  return mockBlogPosts;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="bg-background py-12 md:py-16">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-10 md:mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">Nuestro Blog de Aventuras</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Historias, consejos y guías para inspirar tus próximos viajes y ayudarte a planificar la aventura perfecta.
          </p>
        </header>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <Card key={post.id} className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
                {post.imageUrl && (
                  <CardHeader className="p-0 relative">
                    <Link href={`/blog/${post.slug}`} aria-label={`Leer más sobre ${post.title}`}>
                      <Image
                        src={post.imageUrl}
                        alt={`Imagen de ${post.title}`}
                        width={600}
                        height={338} // Aspect ratio 16:9 for 600px width
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                        data-ai-hint={post.imageHint}
                      />
                    </Link>
                  </CardHeader>
                )}
                <CardContent className="flex-grow p-4 space-y-3">
                   <Link href={`/blog/${post.slug}`} aria-label={`Leer más sobre ${post.title}`}>
                    <CardTitle className="font-headline text-xl hover:text-primary transition-colors line-clamp-2">{post.title}</CardTitle>
                  </Link>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                      <span>{formatDate(post.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <UserCircle className="mr-1.5 h-3.5 w-3.5" />
                      <span>{post.author}</span>
                    </div>
                  </div>
                  <CardDescription className="text-sm line-clamp-3">{post.excerpt}</CardDescription>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {post.tags.slice(0,3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 border-t">
                  <Button variant="link" asChild className="p-0 h-auto text-primary hover:text-primary/80">
                    <Link href={`/blog/${post.slug}`}>
                      Leer Más <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No hay artículos en el blog por el momento. ¡Vuelve pronto!</p>
          </div>
        )}

        {/* Pagination Placeholder */}
        {posts.length > 6 && ( // Show pagination if more than 6 posts (example)
            <div className="mt-12 flex justify-center">
                <Button variant="outline" className="mr-2">Anterior</Button>
                <Button variant="outline">Siguiente</Button>
            </div>
        )}
      </div>
    </div>
  );
}
