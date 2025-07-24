
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import WhatsAppCtaButton from './whatsapp-cta-button';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const productTypePath = product.category === 'Excursion' ? 'excursiones' : 'transfers';
  const productPageUrl = `/viajes/${productTypePath}/${product.slug}`;
  const whatsappText = `Hola, me interesa ${product.category === 'Excursion' ? 'la excursión' : 'el transfer'} "${product.name}".`;

  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0 relative">
        <Link href={productPageUrl} aria-label={`Ver detalles de ${product.name}`}>
          <Image
            src={product.imageUrl}
            alt={`Imagen de ${product.name}`}
            width={600}
            height={400}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            data-ai-hint={product.imageHint}
          />
        </Link>
        {product.price && (
           <Badge variant="secondary" className="absolute top-2 right-2 text-base font-semibold bg-primary text-primary-foreground">
            {product.currency} ${product.price}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-3">
        <Link href={productPageUrl} aria-label={`Ver detalles de ${product.name}`}>
         <CardTitle className="font-headline text-xl hover:text-primary transition-colors line-clamp-2">{product.name}</CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-3">{product.shortDescription || product.description}</p>
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 flex flex-col sm:flex-row justify-between items-center gap-2 border-t">
        <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
          <Link href={productPageUrl}>
            Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <WhatsAppCtaButton 
          predefinedText={whatsappText} 
          buttonText="Consultar"
          size="sm"
          className="w-full sm:w-auto"
        />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;

    