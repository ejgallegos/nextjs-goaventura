import { Metadata } from 'next';
import Image from 'next/image';
import { mockTransfers } from '@/lib/data/transfers';
import type { Product } from '@/lib/types';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, DollarSign, Tag, Info, Car } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface TransferDetailPageProps {
  params: { slug: string };
}

async function getTransfer(slug: string): Promise<Product | undefined> {
  return mockTransfers.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: TransferDetailPageProps): Promise<Metadata> {
  const transfer = await getTransfer(params.slug);
  if (!transfer) {
    return { title: 'Transfer no encontrado' };
  }
  return {
    title: transfer.name,
    description: transfer.shortDescription || transfer.description.substring(0, 160),
    openGraph: {
      title: transfer.name,
      description: transfer.shortDescription || transfer.description.substring(0, 160),
      images: [{ url: transfer.imageUrl, alt: transfer.name }],
    },
  };
}

export async function generateStaticParams() {
  return mockTransfers.map((transfer) => ({
    slug: transfer.slug,
  }));
}

export default async function TransferDetailPage({ params }: TransferDetailPageProps) {
  const transfer = await getTransfer(params.slug);

  if (!transfer) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Transfer no encontrado</h1>
        <p className="text-muted-foreground">Lo sentimos, el servicio de transfer que buscas no existe.</p>
        <Button asChild className="mt-6">
          <Link href="/viajes/transfers">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Transfers
          </Link>
        </Button>
      </div>
    );
  }

  const whatsappText = `Hola, estoy interesado/a en el transfer "${transfer.name}". Quisiera más información.`;

  return (
    <div className="bg-background">
      <div className="container max-w-7xl mx-auto py-8 sm:py-12 px-4">
        <div className="mb-6 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">Inicio</Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <Link href="/viajes/transfers" className="text-muted-foreground hover:text-primary">Transfers</Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground font-medium">{transfer.name}</span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="relative aspect-video md:aspect-auto md:h-full rounded-lg overflow-hidden shadow-xl">
            <Image
              src={transfer.imageUrl}
              alt={`Imagen de ${transfer.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              priority
              data-ai-hint={transfer.imageHint}
            />
          </div>

          <div className="space-y-6">
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary">{transfer.name}</h1>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm"><Info className="mr-1.5 h-4 w-4"/>{transfer.category}</Badge>
              {transfer.price && (
                <Badge variant="secondary" className="text-sm bg-accent text-accent-foreground">
                  <DollarSign className="mr-1.5 h-4 w-4" /> {transfer.currency} ${transfer.price}
                </Badge>
              )}
            </div>

            {transfer.shortDescription && (
              <p className="text-lg text-muted-foreground">{transfer.shortDescription}</p>
            )}
            
            <div className="prose prose-sm sm:prose-base max-w-none text-foreground">
              <h2 className="font-headline text-xl font-semibold border-b pb-2 mb-3">Detalles del Servicio</h2>
              <p>{transfer.description}</p>
            </div>

            {transfer.tags && transfer.tags.length > 0 && (
              <div>
                <h3 className="font-headline text-lg font-semibold mb-2">Características:</h3>
                <div className="flex flex-wrap gap-2">
                  {transfer.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <WhatsAppCtaButton predefinedText={whatsappText} buttonText="Solicitar Transfer" size="lg" className="w-full sm:w-auto" />
            </div>

             <div className="mt-8">
              <Button variant="outline" asChild>
                <Link href="/viajes/transfers">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Volver a todos los transfers
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

