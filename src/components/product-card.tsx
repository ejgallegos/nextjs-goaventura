import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import WhatsAppCtaButton from './whatsapp-cta-button';
import { ArrowRight, User } from 'lucide-react';

interface ProductCardProps {
  product: Product | (Omit<Product, 'category'> & { category: 'Promocion' });
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isPromotion = product.category === 'Promocion';
  const productPageUrl = product.slug.startsWith('/') ? product.slug : `/viajes/${product.slug}`;
  const whatsappText = `Hola, me interesa ${isPromotion ? 'la promoción' : product.category === 'Excursion' ? 'la excursión' : 'el transfer'} "${product.name}".`;

  return (
    <div className="card-airbnb flex h-full min-w-0 flex-col">
      <Link href={productPageUrl} aria-label={`Ver detalles de ${product.name}`} className="relative aspect-[3/2] overflow-hidden rounded-2xl">
        <Image
          src={product.imageUrl}
          alt={`Imagen de ${product.name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          className="object-cover transition-transform duration-500 hover:scale-105"
        />
        {product.price && product.price > 0 ? (
          <Badge variant="secondary" className="absolute top-3 right-3 text-sm font-semibold bg-white/90 text-foreground backdrop-blur-sm flex items-center gap-1 rounded-xl">
            <User className="h-3.5 w-3.5" />
            <span>{product.currency} ${product.price.toLocaleString('es-AR')}</span>
          </Badge>
        ) : (
          <Badge variant="secondary" className="absolute top-3 right-3 text-sm font-semibold bg-white/90 text-foreground backdrop-blur-sm rounded-xl">
            Consultar precio
          </Badge>
        )}
      </Link>
      <div className="pt-4 space-y-2 flex-grow">
        <Link href={productPageUrl} aria-label={`Ver detalles de ${product.name}`}>
          <h3 className="font-headline text-lg font-semibold text-foreground hover:text-accent transition-colors line-clamp-2">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-3">{product.shortDescription || product.description}</p>
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs rounded-lg">{tag}</Badge>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-2 border-t pt-4 lg:grid-cols-2">
        <Link
          href={productPageUrl}
          className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors hover:bg-secondary/50"
        >
          Ver Detalles <ArrowRight className="h-4 w-4" />
        </Link>
        <WhatsAppCtaButton
          predefinedText={whatsappText}
          buttonText="Consultar"
          size="sm"
          className="min-h-11 min-w-0 w-full"
          productId={product.id}
          productName={product.name}
          productType={isPromotion ? 'promotion' : product.category === 'Transfer' ? 'transfer' : 'excursion'}
        />
      </div>
    </div>
  );
};

export default ProductCard;
