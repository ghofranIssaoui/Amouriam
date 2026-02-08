'use client';

import { Header } from '@/components/header';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { products, getProductById } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useState, useContext } from 'react';
import { formatPriceWithSeparator as formatPrice } from '@/lib/format';
import { useAuth } from '@/lib/backend-auth';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { user } = useAuth();

  const total = getCartTotal();
  const cartItemsWithProducts = cartItems.map((item) => ({
    ...item,
    product: getProductById(item.id),
  }));

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth');
      return;
    }
    setIsCheckingOut(true);
    router.push('/checkout');
  };

  if (cartItemsWithProducts.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-6 py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto" />
            <h1 className="text-3xl font-bold text-foreground">Votre panier est vide</h1>
            <p className="text-lg text-muted-foreground">
              Commencez à acheter pour ajouter d\'incroyables produits biologiques à votre panier!
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Continuer les Achats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-8">Panier d\'Achat</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItemsWithProducts.map((item) => {
              if (!item.product) return null;
              return (
                <div
                  key={item.id}
                  className="flex gap-4 border border-border rounded-lg p-4 bg-card"
                >
                  {/* Product Image */}
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-card-foreground">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} par unité
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <div className="text-lg font-semibold">Total: {formatPrice(total)}</div>
                      <span className="text-sm font-semibold w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <span className="text-lg font-bold text-primary">
                      <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg bg-muted/50 p-6 space-y-6 sticky top-24">
              <h2 className="text-2xl font-bold text-foreground">Résumé de la Commande</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Sous-total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Livraison</span>
                  <span>{formatPrice(7)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxe</span>
                  <span>{formatPrice(0)}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex justify-between">
                <span className="text-xl font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(total + 7)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut || cartItemsWithProducts.length === 0}
                className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? 'Traitement...' : 'Procéder au Paiement'}
              </button>

              <button
                onClick={clearCart}
                className="w-full border border-border text-foreground font-semibold py-3 rounded-lg hover:bg-muted transition-colors"
              >
                Vider le Panier
              </button>

              <Link
                href="/"
                className="block text-center text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                Continuer les Achats
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2024 Amourium. Tous droits réservés. | Solutions Agricoles Biologiques Premium</p>
        </div>
      </footer>
    </div>
  );
}
