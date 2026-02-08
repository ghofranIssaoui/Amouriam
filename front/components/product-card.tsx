import Image from 'next/image';
import Link from 'next/link';
import { getProductById, Product } from '@/lib/api/products';
import { Badge } from '@/components/ui/badge';
import { formatPriceWithSeparator } from '@/lib/format';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <div className="relative overflow-hidden bg-muted aspect-square">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
            {product.type === 'powder' ? 'Powder' : 'Liquid'}
          </Badge>
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {product.description}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">{formatPriceWithSeparator(product.price)}</span>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
