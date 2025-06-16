import { Metadata } from 'next';
import Image from 'next/image';
import { mockBlogPosts } from '@/lib/data/blog';
import type { BlogPost } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarDays, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface BlogPostPageProps {
  params: { slug: string };
}

async function getPost(slug: string): Promise<BlogPost | undefined> {
  return mockBlogPosts.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) {
    return { title: 'Artículo no encontrado' };
  }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: post.imageUrl ? [{ url: post.imageUrl, alt: post.title }] : [],
    },
  };
}

export async function generateStaticParams() {
  return mockBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Artículo no encontrado</h1>
        <p className="text-muted-foreground">Lo sentimos, el artículo que buscas no existe o ha sido movido.</p>
        <Button asChild className="mt-6">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Blog
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="bg-background py-8 sm:py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <header className="mb-8">
          <div className="mb-4 text-sm">
            <Link href="/blog" className="text-muted-foreground hover:text-primary">
              <ArrowLeft className="inline-block mr-1 h-4 w-4" /> Volver al Blog
            </Link>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4">{post.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="mr-1.5 h-4 w-4" />
              <span>Publicado el {formatDate(post.date)}</span>
            </div>
            <div className="flex items-center">
              <UserCircle className="mr-1.5 h-4 w-4" />
              <span>Por {post.author}</span>
            </div>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
        </header>

        {post.imageUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg mb-8">
            <Image
              src={post.imageUrl}
              alt={`Imagen principal de ${post.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
              priority
              data-ai-hint={post.imageHint}
            />
          </div>
        )}

        {/* Using dangerouslySetInnerHTML for mock Markdown content. In a real app, use a Markdown parser like react-markdown. */}
        <div 
            className="prose prose-lg max-w-none text-foreground prose-headings:font-headline prose-headings:text-primary prose-a:text-accent prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} // Basic replacement for newlines
        />
        
        {/* A more robust solution would be:
        <ReactMarkdown components={{...}} remarkPlugins={[...]} rehypePlugins={[...]}>
            {post.content}
        </ReactMarkdown> 
        But this requires installing react-markdown and its ecosystem.
        For now, this basic HTML rendering will do for the mock data.
        */}
      </div>
    </article>
  );
}
