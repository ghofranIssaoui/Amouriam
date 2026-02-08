// app/products/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header } from '@/components/header';
import { getProductById, getProducts, Product } from '@/lib/api/products';
import { useCart } from '@/lib/cart-context';
import { Badge } from '@/components/ui/badge';
import { Check, Minus, Plus } from 'lucide-react';
import { formatPriceWithSeparator as formatPrice } from '@/lib/format';
import { ProductCard } from '@/components/product-card';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.id) {
        console.error('No product ID in URL');
        setError('Product ID is missing');
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching product with ID:', params.id);
        // Fetch product details
        const productData = await getProductById(params.id as string);
        console.log('Product data received:', productData);
        
        if (!productData) {
          console.error('No product found with ID:', params.id);
          router.push('/404');
          return;
        }
        
        setProduct(productData);
        
        // Fetch related products (same type, excluding current product)
        const products = await getProducts();
        setRelatedProducts(
          products
            .filter(p => p.type === productData.type && p.id !== productData.id)
            .slice(0, 4)
        );
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id, router]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      router.push('/cart');
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-gray-200 rounded-lg h-[500px]"></div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded w-2/3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
            <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Go back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg overflow-hidden flex items-center justify-center" style={{ height: '500px' }}>
            <div className="relative w-full h-full max-w-full max-h-full p-8">
              <div style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="object-contain max-w-full max-h-full"
                  priority
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {product.name}
              </h1>
              <div className="mt-2 flex items-center space-x-2">
                <Badge variant={product.type === 'powder' ? 'default' : 'secondary'}>
                  {product.type === 'powder' ? 'Poudre' : 'Liquide'}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xl text-muted-foreground leading-relaxed">
                {product.fullDescription}
              </p>
            </div>

            {/* Composition */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-foreground">Composition</h3>
              <ul className="mt-2 space-y-1">
                {product.composition.map((item: string, index: number) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    - {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-foreground">Bénéfices</h3>
              <ul className="mt-2 space-y-2">
                {product.benefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Usage */}
            <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-foreground">Mode d'emploi</h2>
              <p className="text-muted-foreground">{product.usage}</p>
            </div>

            {/* Add to Cart Section */}
            <div className="mt-8 space-y-4 border-t border-border pt-8">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <button
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                  isAdded
                    ? 'bg-green-600 text-white'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
                disabled={isAdded}
              >
                {isAdded ? (
                  <span className="flex items-center justify-center">
                    <Check className="h-5 w-5 mr-2" />
                    Ajouté au panier
                  </span>
                ) : (
                  'Ajouter au panier'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">Produits Similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}