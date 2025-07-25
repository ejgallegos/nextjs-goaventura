
'use client'

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import type { Promotion } from '@/lib/types';
import { getPromotions } from '@/lib/data/promotions';
import Image from 'next/image';
import Link from 'next/link';
import WhatsAppCtaButton from '@/components/whatsapp-cta-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Calendar, DollarSign, Loader2, BedDouble, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function PromotionDetailPage() {
  const [promotion, setPromotion] = useState<Promotion | null | undefined>(null);
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      const fetchPromotion = async () => {
        const promos = await getPromotions();
        const foundPromo = promos.find(p => p.slug === slug && p.status === 'published');
        setPromotion(foundPromo);
      };
      fetchPromotion();
    }
  }, [slug]);

  if (promotion === null) {
    return (
       <div className="container mx-auto py-12 px-4 text-center flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (promotion === undefined) {
    notFound();
  }
  
  const whatsappText = `Hola, estoy interesado/a en la promoción "${promotion.title}". Quisiera más información.`;

  return (
    <>
    <title>{promotion.title} | Go aventura</title>
      <div className="bg-background">
        <div className="container max-w-7xl mx-auto py-8 sm:py-12 px-4">
           <div className="mb-6 text-sm">
             <Link href="/promociones" className="text-muted-foreground hover:text-primary flex items-center w-fit">
                <ArrowLeft className="inline-block mr-1 h-4 w-4" /> Volver a Promociones
             </Link>
            </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div className="space-y-6">
                <div className="relative aspect-video rounded-lg overflow-hidden shadow-xl">
                    <Image
                    src={promotion.imageUrl}
                    alt={`Imagen de ${promotion.title}`}
                    fill
                    className="object-cover"
                    priority
                    data-ai-hint={promotion.imageHint}
                    />
                </div>
                 {promotion.accommodationImageUrl && promotion.accommodationName && (
                     <Card className="bg-muted/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <BedDouble className="h-5 w-5 text-primary" />
                                Alojamiento Incluido
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-4">
                            <div className="sm:w-1/3 relative aspect-video rounded-md overflow-hidden">
                                <Image
                                    src={promotion.accommodationImageUrl}
                                    alt={`Imagen de ${promotion.accommodationName}`}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={promotion.accommodationImageHint}
                                />
                            </div>
                            <div className="sm:w-2/3">
                                <h4 className="font-semibold text-lg">{promotion.accommodationName}</h4>
                                {promotion.accommodationLink && (
                                     <Button variant="link" asChild className="p-0 h-auto mt-2">
                                        <Link href={promotion.accommodationLink} target="_blank" rel="noopener noreferrer">
                                            Ver Alojamiento <ExternalLink className="ml-1.5 h-4 w-4" />
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                 )}
            </div>

            <div className="space-y-6">
              <h1 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">{promotion.title}</h1>
              
              <div className="flex flex-wrap gap-2">
                 {promotion.price && promotion.price > 0 && (
                  <Badge variant="default" className="text-base">
                    <DollarSign className="mr-1.5 h-4 w-4"/>{promotion.currency} ${promotion.price.toLocaleString('es-AR')}
                  </Badge>
                )}
                 {promotion.validity && (
                  <Badge variant="secondary" className="text-base">
                    <Calendar className="mr-1.5 h-4 w-4"/>{promotion.validity}
                  </Badge>
                )}
              </div>

               <div className="prose prose-lg max-w-none text-foreground prose-p:my-2">
                    <ReactMarkdown>{promotion.description}</ReactMarkdown>
                </div>
              
               {promotion.included && promotion.included.length > 0 && (
                <div className="pt-4">
                  <h3 className="font-headline text-xl font-semibold mb-3">¿Qué incluye?</h3>
                  <ul className="space-y-2">
                    {promotion.included.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 mr-2 mt-1 text-green-500 shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="pt-4">
                <WhatsAppCtaButton 
                  predefinedText={whatsappText} 
                  buttonText="Consultar por esta Promoción" 
                  size="lg" 
                  className="w-full sm:w-auto"
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}
