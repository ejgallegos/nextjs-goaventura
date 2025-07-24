
import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/data/blog-posts';
import { getProducts } from '@/lib/data/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const posts = await getBlogPosts();
  const blogPostRoutes = posts
    .filter(post => post.status === 'published')
    .map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
  }));

  const products = await getProducts();
  const productRoutes = products
    .filter(product => product.status === 'published')
    .map((product) => ({
      url: `${siteUrl}/viajes/${product.category.toLowerCase()}es/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
  }));


  return [...staticRoutes, ...blogPostRoutes, ...productRoutes];
}
