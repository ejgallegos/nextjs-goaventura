
import type { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { BlogPost } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarDays, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { getBlogPosts } from '@/lib/data/blog-posts';

type Props = {
  params: { slug: string };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goaventura.com.ar';

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const posts = await getBlogPosts();
  const post = posts.find(p => p.slug === params.slug && p.status === 'published');

  if (!post) {
    return {
      title: 'Artículo no encontrado'
    }
  }

  const previousImages = (await parent).openGraph?.images || []
  const ogImage = post.imageUrl ? new URL(post.imageUrl, siteUrl).toString() : previousImages;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: ogImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  }
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  const publishedPosts = posts.filter(p => p.status === 'published');
  return publishedPosts.map((post) => ({
    slug: post.slug,
  }));
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

export default async function BlogPostPage({ params }: Props) {
  const posts = await getBlogPosts();
  const post = posts.find((p) => p.slug === params.slug && p.status === 'published');

  if (!post) {
    notFound();
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
