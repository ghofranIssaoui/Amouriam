'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface OrderConfirmationFormProps {
  orderData: {
    items: Array<{
      id: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    shippingAddress: {
      name: string;
      email: string;
      address: string;
      city: string;
      zipCode: string;
      country: string;
    };
    paymentMethod: string;
  };
  onConfirm: (confirmedOrderData: any) => void;
  onCancel: () => void;
}

export default function OrderConfirmationForm({ orderData, onConfirm, onCancel }: OrderConfirmationFormProps) {
  const [formData, setFormData] = useState({
    confirmEmail: orderData?.shippingAddress?.email || '',
    confirmPhone: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    specialInstructions: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean, name: string) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms || !formData.agreeToPrivacy) {
      alert('Veuillez accepter les termes et conditions et la politique de confidentialité');
      return;
    }

    // Auto-fill the confirmation email with the shipping email
    // This ensures they always match

    setIsSubmitting(true);
    
    try {
      const confirmedOrderData = {
        ...orderData,
        confirmationDetails: {
          confirmEmail: formData.confirmEmail,
          confirmPhone: formData.confirmPhone,
          specialInstructions: formData.specialInstructions,
          confirmedAt: new Date().toISOString()
        }
      };
      
      await onConfirm(confirmedOrderData);
    } catch (error) {
      console.error('Order confirmation failed:', error);
      alert('Erreur lors de la confirmation de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toFixed(3).replace('.', ',') + ' DT';
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Confirmation de Commande</h1>
          <p className="text-muted-foreground">
            Veuillez vérifier et confirmer les détails de votre commande
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-foreground">Résumé de la Commande</h2>
            
            <div className="space-y-4 mb-6">
              {orderData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-secondary/5 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.id}</p>
                    <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-foreground">{formatPrice(item.price)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total</span>
                <span>{formatPrice(orderData.total - 7.000)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Livraison</span>
                <span>7.000 DT</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Taxe</span>
                <span>0 DT</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-primary">{formatPrice(orderData.total)}</span>
              </div>
            </div>
          </Card>

          {/* Confirmation Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 text-foreground">Détails de Confirmation</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Address Review */}
              <div className="p-4 bg-secondary/5 rounded-lg">
                <h3 className="font-semibold text-foreground mb-3">Adresse de Livraison</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">{orderData.shippingAddress.name}</p>
                  <p>{orderData.shippingAddress.address}</p>
                  <p>{orderData.shippingAddress.city}, {orderData.shippingAddress.zipCode}</p>
                  <p>{orderData.shippingAddress.country}</p>
                  <p className="mt-2 text-foreground">{orderData.shippingAddress.email}</p>
                </div>
              </div>

              {/* Confirmation Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="confirmEmail">Email de Confirmation *</Label>
                  <Input
                    id="confirmEmail"
                    name="confirmEmail"
                    type="email"
                    value={formData.confirmEmail}
                    onChange={handleInputChange}
                    placeholder="Confirmez votre email"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Doit correspondre à l'email de livraison
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPhone">Téléphone (Optionnel)</Label>
                  <Input
                    id="confirmPhone"
                    name="confirmPhone"
                    type="tel"
                    value={formData.confirmPhone}
                    onChange={handleInputChange}
                    placeholder="+216 XX XXX XXX"
                  />
                </div>

                <div>
                  <Label htmlFor="specialInstructions">Instructions Spéciales (Optionnel)</Label>
                  <textarea
                    id="specialInstructions"
                    name="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={handleInputChange}
                    className="w-full min-h-[100px] px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Instructions pour la livraison..."
                  />
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'agreeToTerms')}
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                    J'accepte les{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      termes et conditions
                    </Link>{' '}
                    de vente
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agreeToPrivacy"
                    checked={formData.agreeToPrivacy}
                    onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, 'agreeToPrivacy')}
                  />
                  <Label htmlFor="agreeToPrivacy" className="text-sm leading-relaxed">
                    J'accepte la{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      politique de confidentialité
                    </Link>
                  </Label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Retour
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Confirmation...' : 'Confirmer la Commande'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
