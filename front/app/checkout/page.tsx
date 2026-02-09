'use client';

import React, { useState, useEffect } from "react"
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/backend-auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatPriceWithSeparator } from '@/lib/format';
import OrderConfirmationForm from '@/components/OrderConfirmationForm';
import { products } from '@/lib/products';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check } from 'lucide-react';
import { Header } from '@/components/header';

export default function CheckoutPage() {
const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: '',
    city: '',
    zipCode: '',
    country: 'USA',
  });

  // Handle authentication errors
  const handleAuthError = () => {
    localStorage.removeItem('auth_token');
    setIsRedirecting(true);
    router.push('/auth?returnTo=/checkout');
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && (!token || !user) && !isRedirecting) {
      setIsRedirecting(true);
      router.push('/auth?returnTo=/checkout');
    }
  }, [loading, token, user, router, isRedirecting]);

  // Show loading or redirecting state
  if (loading || !token || !user || isRedirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground mb-4">Authentication required</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 mb-2">
              <strong>⚠️ Authentication Issue Detected</strong>
            </p>
            <p className="text-xs text-red-700 mb-3">
              Your session has expired or the token is invalid. You must clear the token and log in again.
            </p>
            <div className="space-y-2">
              <button 
                onClick={handleAuthError}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium"
              >
                🔄 Clear Token & Login Again
              </button>
              <div className="text-xs text-red-600">
                <p>Token status: {token ? 'Invalid ❌' : 'Missing ❌'}</p>
                <p>User status: {user ? 'Loaded ✅' : 'Not loaded ❌'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Votre Panier est Vide</h1>
            <p className="text-muted-foreground mb-6">
              Ajoutez des produits avant de passer la commande.
            </p>
            <Link href="/">
              <Button>Continuer les Achats</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateShipping = () => {
    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.zipCode) {
      setError('Veuillez remplir tous les détails de livraison');
      return false;
    }
    setError('');
    return true;
  };

  const validatePayment = () => true;

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateShipping()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    

    // Prepare order data for confirmation
    const preparedOrderData = {
      items: cartItems.map(item => ({
        product: item.id, // Backend expects 'product' field
        quantity: item.quantity,
        price: item.price
      })),
      total: finalTotal,
      shippingAddress: {
        street: formData.address,
        city: formData.city,
        postalCode: formData.zipCode,
        country: formData.country,
      },
      paymentMethod: 'cod' // Cash on Delivery
    };

    setOrderData(preparedOrderData);
    setShowConfirmation(true);
  };

// app/checkout/page.tsx
const handleConfirmOrder = async (confirmedOrderData: any) => {
  try {
    setSubmitting(true);
    setError('');

    console.log('User object:', user);
    console.log('Token:', token);

    // Validate token before making order request
    if (!token) {
      console.log('No token found, redirecting to login');
      handleAuthError();
      return;
    }

    // Verify token is valid by checking user session
    try {
      const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!authResponse.ok) {
        console.log('Token validation failed, clearing token and redirecting');
        handleAuthError();
        return;
      }
    } catch (authError) {
      console.log('Auth verification failed, clearing token and redirecting');
      handleAuthError();
      return;
    }

    console.log('Token validated successfully, proceeding with order creation');

    // Get user ID from the user object
    console.log('Full user object:', user);
    console.log('User ID:', user?.id);
    console.log('User _id:', (user as any)?._id);
    console.log('User object keys:', user ? Object.keys(user) : 'No user object');
    
    const userId = user?.id;
    if (!userId) {
      console.error('User ID is missing. User object:', user);
      throw new Error('User information is missing. Please login again.');
    }

    // Transform items to match backend expectations
    const orderData = {
      userId, // Include the user ID in the order data
      items: confirmedOrderData.items.map((item: any) => {
        const product = products.find(p => p.id === (item.id || item.product));
        return {
          product: item.id || item.product,
          name: product?.name || item.name || 'Product',
          image: product?.image || item.image || '',
          quantity: item.quantity,
          price: item.price
        };
      }),
      // Include other required fields from confirmedOrderData
      total: confirmedOrderData.totalAmount || confirmedOrderData.total,
      shippingAddress: confirmedOrderData.shippingAddress,
      paymentMethod: confirmedOrderData.paymentMethod || 'cod'
    };

    console.log('Sending order data:', JSON.stringify(orderData, null, 2));
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const fullUrl = `${apiUrl}/api/orders`;
    console.log('API URL after replace:', apiUrl);
    console.log('Final Order API URL:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error('Failed to parse response JSON:', parseError);
      result = { message: 'Invalid response from server' };
    }
    
    if (!response.ok) {
      console.error('Order creation failed:', {
        status: response.status,
        statusText: response.statusText,
        result: result,
        url: fullUrl
      });
      
      // Handle 401 Unauthorized - clear token and redirect to login
      if (response.status === 401) {
        console.error('Authentication failed - clearing token and redirecting to login');
        
        // Check if backend requires reauthentication
        if (result.requiresReauth) {
          console.log('Backend requires fresh authentication - clearing token automatically');
          localStorage.removeItem('auth_token');
          // Clear any other auth-related data
          localStorage.removeItem('user');
          sessionStorage.clear();
        }
        
        handleAuthError();
        return;
      }
      
      throw new Error(result.message || `Failed to create order (${response.status})`);
    }

    console.log('Order created successfully:', result);
    clearCart();
    
    // Get order ID for redirect
    const orderId = result._id || result.order?._id || result.id;
    console.log('Redirecting to order confirmation with ID:', orderId);
    
    if (orderId) {
      router.push(`/order-confirmation/${orderId}`);
    } else {
      console.error('No order ID found in response');
      setError('Order created but unable to get confirmation. Please check your orders.');
    }

  } catch (err) {
    console.error('Order error:', err);
    setError(
      err instanceof Error 
        ? err.message 
        : 'Failed to create order. Please try again later.'
    );
  } finally {
    setSubmitting(false);
  }
};

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
    setOrderData(null);
  };

const transformedCartItems = cartItems.map((item) => {
  const product = products.find(p => p.id === item.id);
  return {
    ...item,
    name: product?.name || 'Produit',
    price: product?.price || 0,
  };
});


  const shippingCost = 7.000; // Fixed delivery cost
  const tax = 0; // No tax as requested
  const subtotal = getCartTotal();
  const finalTotal = subtotal + shippingCost + tax;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
          <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">Commande</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {[
              { step: 1, label: 'Livraison' },
              { step: 2, label: 'Vérification' },
              { step: 3, label: 'Confirmation' }
            ].map((item, index) => (
              <div key={item.step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                  currentStep >= item.step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep > item.step ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    item.step
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= item.step ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {item.label}
                </span>
                {index < 2 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    currentStep > item.step ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            {error && (
              <Alert className="border-destructive mb-6">
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Shipping */}
            {currentStep === 1 && (
              <Card className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-foreground mb-6">Adresse de Livraison</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Nom Complet</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jean Dupont"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jean@exemple.com"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Adresse</label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Rue Principale"
                      disabled={loading}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Ville</label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Paris"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Code Postal</label>
                      <Input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="75001"
                        disabled={loading}
                      />
                    </div>
                  </div>

                   {/* <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">Pays</label>
                    <Select value={formData.country} onValueChange={(value) => handleSelectChange('country', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USA">États-Unis</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="UK">Royaume-Uni</SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}
                </div> 

                <button
                  onClick={handleNextStep}
                  disabled={loading}
                  className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-6"
                >
                  Continuer au Paiement
                </button>
              </Card>
            )}
{/*  */}
            {/* Step 2: Order Review */}
            {currentStep === 2 && (
              <Card className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Vérification de la Commande</h2>

                <div className="space-y-4">
                  <div className="border-b border-border pb-4">
                    <h3 className="font-semibold text-foreground mb-2">Adresse de Livraison</h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.name}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.zipCode}<br />
                      {formData.country}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    disabled={loading}
                    className="flex-1 border border-border text-foreground font-semibold py-3 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    Retour
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={loading}
                    className="flex-1 bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Confirmer la Commande
                  </button>
                </div>
              </Card>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <Card className="p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Confirmation de la Commande</h2>

                <div className="space-y-4">
                  <div className="border-b border-border pb-4">
                    <h3 className="font-semibold text-foreground mb-2">Adresse de Livraison</h3>
                    <p className="text-sm text-muted-foreground">
                      {formData.name}<br />
                      {formData.address}<br />
                      {formData.city}, {formData.zipCode}<br />
                      {formData.country}
                    </p>
                  </div>

                  <div className="border-b border-border pb-4">
                    <h3 className="font-semibold text-foreground mb-2">Méthode de Paiement</h3>
                    <p className="text-sm text-muted-foreground">
                      Paiement à la livraison
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-4">
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    disabled={loading}
                    className="flex-1 border border-border text-foreground font-semibold py-3 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submitting ? 'Traitement...' : 'Confirmer la Commande'}
                  </button>
                </form>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-20 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Résumé de la Commande</h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} <span className="text-xs">x{item.quantity}</span>
                    </span>
                    <span className="font-medium text-foreground">
                      {formatPriceWithSeparator(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Sous-total</span>
                  <span>{formatPriceWithSeparator(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Livraison</span>
                  <span>{formatPriceWithSeparator(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Taxe</span>
                  <span>{formatPriceWithSeparator(tax)}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex justify-between">
                <span className="text-xl font-bold text-foreground">Total</span>
                <span className="text-xl font-bold text-primary">{formatPriceWithSeparator(finalTotal)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

    

      {/* Confirmation Form Modal */}
      {showConfirmation && orderData && (
        <OrderConfirmationForm
          orderData={orderData}
          onConfirm={handleConfirmOrder}
          onCancel={handleCancelConfirmation}
        />
      )}
    </div>
  );
}
  {/* Footer */}
      <footer className="border-t border-border bg-background py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <p>&copy; 2024 Amourium. Tous droits réservés. | Solutions Agricoles Biologiques Premium</p>
        </div>
      </footer>
