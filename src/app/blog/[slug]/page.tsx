
"use client"
import { Metadata } from 'next';
import Image from 'next/image';
import type { BlogPost } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarDays, UserCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getBlogPosts } from '@/lib/data/blog-posts';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goaventura.com.ar';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

export default function BlogPostPage() {
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const params = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      const slug = params.slug as string;
      if (slug) {
        const allPosts = await getBlogPosts();
        const foundPost = allPosts.find((p) => p.slug === slug);
        setPost(foundPost || null);
      }
    };
    fetchPost();
  }, [params.slug]);
  
  if (post === undefined) {
    return (
      <div className="container mx-auto py-12 px-4 text-center flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl ? new URL(post.imageUrl, siteUrl).toString() : undefined,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Go aventura',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    datePublished: post.date,
    dateModified: post.date,
  };

  return (
    <>
      <title>{`${post.title} | Go aventura`}</title>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="bg-background py-8 sm:py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <header className="mb-8">
            <div className="mb-4 text-sm">
              <Link href="/blog" className="text-muted-foreground hover:text-primary">
                <ArrowLeft className="inline-block mr-1 h-4 w-4" /> Volver al Blog
              </Link>
            </div>
            <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">{post.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarDays className="mr-1.5 h-4 w-4" />
                <time dateTime={post.date}>Publicado el {formatDate(post.date)}</time>
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

          <div className="prose prose-lg max-w-none text-foreground prose-headings:font-headline prose-headings:text-foreground prose-a:text-accent prose-strong:text-foreground prose-a:font-semibold prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </article>
    </>
  );
}
