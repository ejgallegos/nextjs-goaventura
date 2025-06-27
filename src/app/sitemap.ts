import { MetadataRoute } from 'next';
import { mockBlogPosts } from '@/lib/data/blog';
import { mockExcursions } from '@/lib/data/excursions';
import { mockTransfers } from '@/lib/data/transfers';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goaventura.com.ar';

  const staticRoutes = [
    '/',
    '/nosotros',
    '/viajes',
    '/alojamientos',
    '/blog',
    '/contacto',
    '/ai/enhance-summary',
    '/legal/terminos-y-condiciones',
    '/legal/politica-de-privacidad',
    '/legal/politica-de-cookies',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.8,
  }));

  const blogPostRoutes = mockBlogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const excursionRoutes = mockExcursions.map((excursion) => ({
    url: `${siteUrl}/viajes/excursiones/${excursion.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));
  
  const transferRoutes = mockTransfers.map((transfer) => ({
    url: `${siteUrl}/viajes/transfers/${transfer.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));


  return [...staticRoutes, ...blogPostRoutes, ...excursionRoutes, ...transferRoutes];
}
