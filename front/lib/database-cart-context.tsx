// lib/database-cart-context.tsx
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useAuth } from './backend-auth';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface DatabaseCartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  isLoading: boolean;
  error: string | null;
}

const DatabaseCartContext = createContext<DatabaseCartContextType | undefined>(undefined);

export function DatabaseCartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  // Load cart from database on mount and when user changes
  useEffect(() => {
    const fetchCart = async () => {
      if (!user || !token) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/cart', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data.items || []);
        } else {
          const errorData = await response.text();
          setError(errorData || 'Failed to fetch cart');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cart');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [user, token]);

  // Add item to cart
  const addToCart = async (productId: string, quantity: number) => {
    if (!user || !token) {
      setError('Please login to add items to cart');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      } else {
        const errorData = await response.text();
        setError(errorData || 'Failed to add to cart');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId: string) => {
    if (!user || !token) {
      setError('Please login to remove items from cart');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      } else {
        const errorData = await response.text();
        setError(errorData || 'Failed to remove from cart');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user || !token) {
      setError('Please login to clear cart');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      } else {
        const errorData = await response.text();
        setError(errorData || 'Failed to clear cart');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user || !token) {
      setError('Please login to update cart');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId, quantity }),
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.items || []);
      } else {
        const errorData = await response.text();
        setError(errorData || 'Failed to update cart');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Get cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Get item count
  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <DatabaseCartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
        isLoading,
        error,
      }}
    >
      {children}
    </DatabaseCartContext.Provider>
  );
}

export function useDatabaseCart() {
  const context = useContext(DatabaseCartContext);
  if (context === undefined) {
    throw new Error('useDatabaseCart must be used within a DatabaseCartProvider');
  }
  return context;
}
