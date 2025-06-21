
import { Metadata } from 'next';
import Image from 'next/image';
import { mockExcursions } from '@/lib/data/excursions';
import type { Product } from '@/lib/types';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CalendarDays, DollarSign, Tag, Info } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import ImageSlider from '@/components/image-slider';

interface ExcursionDetailPageProps {
  params: { slug: string };
}

// This function would typically fetch data in a real app
async function getExcursion(slug: string): Promise<Product | undefined> {
  return mockExcursions.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: ExcursionDetailPageProps): Promise<Metadata> {
  const excursion = await getExcursion(params.slug);
  if (!excursion) {
    return { title: 'Excursión no encontrada' };
  }
  return {
    title: excursion.name,
    description: excursion.shortDescription || excursion.description.substring(0, 160),
    openGraph: {
      title: excursion.name,
      description: excursion.shortDescription || excursion.description.substring(0, 160),
      images: [{ url: excursion.imageUrl, alt: excursion.name }],
    },
  };
}

export async function generateStaticParams() {
  return mockExcursions.map((excursion) => ({
    slug: excursion.slug,
  }));
}

export default async function ExcursionDetailPage({ params }: ExcursionDetailPageProps) {
  const excursion = await getExcursion(params.slug);

  if (!excursion) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Excursión no encontrada</h1>
        <p className="text-muted-foreground">Lo sentimos, la excursión que buscas no existe o ha sido movida.</p>
        <Button asChild className="mt-6">
          <Link href="/viajes/excursiones">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Excursiones
          </Link>
        </Button>
      </div>
    );
  }

  const whatsappText = `Hola, estoy interesado/a en la excursión "${excursion.name}". Quisiera más información.`;

  return (
    <div className="bg-background">
      <div className="container max-w-7xl mx-auto py-8 sm:py-12 px-4">
        {/* Breadcrumbs (optional) */}
        <div className="mb-6 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-primary">Inicio</Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <Link href="/viajes/excursiones" className="text-muted-foreground hover:text-primary">Excursiones</Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground font-medium">{excursion.name}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12 items-start">
          <div className="md:col-span-2 relative aspect-video rounded-lg overflow-hidden shadow-xl">
            {excursion.imageGallery && excursion.imageGallery.length > 0 ? (
              <ImageSlider images={excursion.imageGallery} className="w-full h-full" />
            ) : (
              <Image
                src={excursion.imageUrl}
                alt={`Imagen de ${excursion.name}`}
                fill
                className="object-cover"
                priority
                data-ai-hint={excursion.imageHint}
              />
            )}
          </div>

          <div className="md:col-span-3 space-y-6">
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">{excursion.name}</h1>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-sm"><Info className="mr-1.5 h-4 w-4"/>{excursion.category}</Badge>
              {excursion.price && (
                <Badge variant="secondary" className="text-sm bg-accent text-accent-foreground">
                  <DollarSign className="mr-1.5 h-4 w-4" /> {excursion.currency} ${excursion.price.toLocaleString('es-AR')}
                </Badge>
              )}
            </div>

            {excursion.shortDescription && (
              <p className="text-lg text-muted-foreground">{excursion.shortDescription}</p>
            )}

            {excursion.tags && excursion.tags.length > 0 && (
              <div>
                <h3 className="font-headline text-lg font-semibold mb-2">Etiquetas:</h3>
                <div className="flex flex-wrap gap-2">
                  {excursion.tags.map((tag) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <WhatsAppCtaButton predefinedText={whatsappText} buttonText="Consultar Disponibilidad" size="lg" className="w-full sm:w-auto" />
            </div>

             <div className="mt-8">
              <Button variant="outline" asChild>
                <Link href="/viajes/excursiones">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Volver a todas las excursiones
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 lg:mt-16 pt-8 border-t">
          <div className="prose prose-lg max-w-none text-foreground prose-headings:font-headline prose-headings:text-foreground prose-a:text-accent prose-strong:text-foreground">
            <ReactMarkdown>{excursion.description}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
