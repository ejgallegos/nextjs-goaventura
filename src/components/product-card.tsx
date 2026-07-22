import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import WhatsAppCtaButton from './whatsapp-cta-button';
import { ArrowRight, User, MapPin, Tag } from 'lucide-react';
import { Button } from './ui/button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isPromotion = (product.category as any) === 'Promocion';
  // If slug starts with '/', it's an internal link for promotions
  const productPageUrl = product.slug.startsWith('/') ? product.slug : `/viajes/${product.slug}`;
  const whatsappText = `Hola, me interesa ${isPromotion ? 'la promoción' : (product.category === 'Excursion' ? 'la excursión' : 'el transfer')} "${product.name}".`;
  const detailsButtonText = isPromotion ? "Ver Paquete" : "Ver Detalles";

  return (
    <Card className="group flex flex-col overflow-hidden h-full shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[1.5rem] border-transparent hover:border-primary/20 bg-card/50 backdrop-blur-sm">
      <CardHeader className="p-0 relative overflow-hidden">
        <Link href={productPageUrl} aria-label={`Ver detalles de ${product.name}`}>
          <Image
            src={product.imageUrl}
            alt={`Imagen de ${product.name}`}
            width={600}
            height={400}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={85}
            className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
            data-ai-hint={product.imageHint}
          />
        </Link>
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
           <Badge variant="secondary" className="bg-white/90 text-foreground backdrop-blur-md shadow-sm border-none font-bold uppercase tracking-wider text-[10px] px-2 py-1">
             {product.category}
           </Badge>
           {isPromotion && (
             <Badge className="bg-amber-500 text-white shadow-sm border-none flex items-center gap-1 w-fit">
                <Tag className="h-3 w-3" />
                <span className="font-bold uppercase text-[10px]">Promo</span>
             </Badge>
           )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-6 space-y-4">
        <Link href={productPageUrl} aria-label={`Ver detalles de ${product.name}`}>
         <CardTitle className="font-headline text-2xl hover:text-primary transition-colors line-clamp-2 leading-tight">{product.name}</CardTitle>
        </Link>
        <p className="text-base text-muted-foreground line-clamp-3 leading-relaxed">{product.shortDescription || product.description}</p>
        
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-muted/30 text-muted-foreground border-border/50">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-col border-t border-border/40 mt-auto bg-gradient-to-b from-transparent to-muted/20">
        <div className="flex w-full items-end justify-between mb-4 mt-4">
            <div>
              <span className="text-sm text-muted-foreground block mb-1">Precio por persona</span>
              {product.price && product.price > 0 ? (
                  <div className="font-bold text-2xl text-foreground flex items-center gap-1">
                      {product.currency} ${product.price.toLocaleString('es-AR')}
                  </div>
              ) : (
                  <div className="font-semibold text-lg text-primary">Consultar</div>
              )}
            </div>
            {product.price && product.price > 0 && (
                <div className="text-right">
                    <User className="h-5 w-5 text-muted-foreground inline-block mb-1" />
                </div>
            )}
        </div>
        
        <div className="flex flex-col sm:flex-row w-full gap-3 mt-2">
          <WhatsAppCtaButton 
            predefinedText={whatsappText} 
            buttonText="Consultar"
            size="default"
            className="w-full sm:w-1/2 font-semibold shadow-md"
            productId={product.id}
            productName={product.name}
          />
          <Button variant="default" size="default" asChild className="w-full sm:w-1/2 group/btn">
            <Link href={productPageUrl}>
              {detailsButtonText} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
