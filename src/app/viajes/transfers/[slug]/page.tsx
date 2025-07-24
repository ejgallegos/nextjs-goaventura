
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/data/products';
import TripDetailPageContent from '../../components/trip-detail-page';

type Props = {
  params: { slug: string };
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://goaventura.com.ar';

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const products = await getProducts();
  const product = products.find(p => p.slug === params.slug && p.category === 'Transfer' && p.status === 'published');

  if (!product) {
    return {
      title: 'Transfer no encontrado',
    }
  }

  const previousImages = (await parent).openGraph?.images || []
  const ogImage = product.imageUrl ? new URL(product.imageUrl, siteUrl).toString() : previousImages;

  return {
    title: product.name,
    description: product.shortDescription || product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description.substring(0, 160),
      url: `${siteUrl}/viajes/transfers/${product.slug}`,
      images: ogImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.shortDescription || product.description.substring(0, 160),
      images: [product.imageUrl || ''],
    },
  }
}

export async function generateStaticParams() {
  const products = await getProducts();
  const transfers = products.filter(p => p.category === 'Transfer' && p.status === 'published');
  return transfers.map((transfer) => ({
    slug: transfer.slug,
  }));
}

export default async function TransferDetailPage({ params }: Props) {
  const products = await getProducts();
  const product = products.find(p => p.slug === params.slug && p.category === 'Transfer' && p.status === 'published');

  if (!product) {
    notFound();
  }

  return <TripDetailPageContent product={product} productType="Transfer" />;
}
