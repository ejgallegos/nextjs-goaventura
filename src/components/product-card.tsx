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
    <article className="flex h-full min-w-0 flex-col rounded-2xl bg-card">
      <div className="relative isolate aspect-[3/2] w-full rounded-2xl bg-secondary">
        <Link
          href={productPageUrl}
          aria-label={`Ver detalles de ${product.name}`}
          className="group absolute inset-0 z-0 block overflow-hidden rounded-2xl focus-visible:z-20"
        >
          <Image
            src={product.imageUrl}
            alt={`Imagen de ${product.name}`}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1535px) 33vw, 400px"
            quality={75}
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
          />
        </Link>
        {product.price && product.price > 0 ? (
          <Badge variant="secondary" className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1 rounded-xl bg-white/90 text-sm font-semibold text-foreground backdrop-blur-sm">
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{product.currency} ${product.price.toLocaleString('es-AR')}</span>
          </Badge>
        ) : (
          <Badge variant="secondary" className="pointer-events-none absolute right-3 top-3 z-10 rounded-xl bg-white/90 text-sm font-semibold text-foreground backdrop-blur-sm">
            Consultar precio
          </Badge>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col space-y-2 pt-4">
        <Link href={productPageUrl} aria-label={`Ver detalles de ${product.name}`} className="rounded-sm focus-visible:outline-none">
          <h3 className="line-clamp-2 font-headline text-lg font-semibold text-foreground transition-colors hover:text-accent">{product.name}</h3>
        </Link>
        <p className="line-clamp-3 text-sm text-muted-foreground">{product.shortDescription || product.description}</p>
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-lg text-xs">{tag}</Badge>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto grid grid-cols-1 gap-2 border-t pt-4 sm:grid-cols-2">
        <Link
          href={productPageUrl}
          className="inline-flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl border px-3 text-center text-sm font-medium transition-colors hover:bg-secondary/50"
        >
          Ver Detalles <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
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
    </article>
  );
};

export default ProductCard;
