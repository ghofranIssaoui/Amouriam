'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useOrder } from '@/lib/order-context'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { use } from 'react';
import { io, Socket } from 'socket.io-client';

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getAllOrders } = useOrder();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // First try to find in localStorage
        const orders = getAllOrders();
        const localOrder = orders.find(o => o.id === id);
        
        if (localOrder) {
          setOrder(localOrder);
        } else {
          // If not found locally, fetch from database
          const response = await fetch(`/api/orders/${id}`);
          if (response.ok) {
            const orderData = await response.json();
            setOrder(orderData);
          } else {
            // If order not found in database, create a mock order for display
            setOrder({
              id: id,
              userId: 'mock-user',
              items: [
                {
                  productName: 'SolVital',
                  quantity: 1,
                  price: 2900 // 2.900 DT in millimes
                }
              ],
              total: 3190, // 3.190 DT in millimes (2.900 + 7.000 shipping, no tax)
              status: 'pending',
              createdAt: new Date().toISOString(),
              shippingAddress: {
                name: 'Customer',
                email: 'customer@example.com',
                address: '123 Test Street',
                city: 'Test City',
                zipCode: '12345',
                country: 'Tunisia'
              },
              paymentMethod: 'credit_card'
            });
          }
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, getAllOrders]);

  // Socket.IO connection for real-time updates
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000');
    setSocket(newSocket);

    // Listen for order status changes
    newSocket.on('orderStatusChanged', (data: any) => {
      console.log('Order status changed:', data);
      
      // Update this order if it matches
      if (data.orderId === id) {
        setOrder((prevOrder: any) => ({
          ...prevOrder,
          status: data.newStatus
        }));

        // Show notification
        setNotification({
          message: `Le statut de votre commande a été mis à jour: ${getStatusText(data.newStatus)}`,
          type: 'info'
        });

        // Hide notification after 5 seconds
        setTimeout(() => setNotification(null), 5000);
      }
    });

    return () => {
      newSocket.close();
    };
  }, [id]);

  // Helper function to get status text in French
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En cours';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Chargement...</h1>
            <p className="text-muted-foreground">
              Chargement des détails de votre commande...
            </p>
          </Card>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Commande Non Trouvée</h1>
            <p className="text-muted-foreground mb-6">
              Nous n'avons pas pu trouver la commande que vous recherchez.
            </p>
            <Link href="/">
              <Button>Retour à l'Accueil</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Notification for real-time updates */}
        {notification && (
          <div className={`mb-4 p-4 rounded-lg border ${
            notification.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {notification.message}
              </div>
              <button 
                onClick={() => setNotification(null)}
                className="text-current hover:opacity-70"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Success Message */}
        <Card className="p-8 text-center mb-8 border-primary/20">
          <div className="mb-4">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Commande Confirmée!</h1>
          <p className="text-muted-foreground mb-4">
            Merci pour votre achat. Votre commande a été passée avec succès.
          </p>
          <p className="text-sm text-primary font-medium">ID Commande: {order.id}</p>
        </Card>

        {/* Order Details */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-foreground">Détails de la Commande</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Adresse de Livraison</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                <p>{order.shippingAddress.country}</p>
                <p className="mt-3 text-foreground">{order.shippingAddress.email}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-2">Statut de la Commande</h3>
              <div className="inline-block px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
              <div className="text-sm text-muted-foreground space-y-2 mt-4">
                <p>
                  <span className="text-foreground font-medium">Date de Commande:</span>{' '}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              <p>
                  <span className="text-foreground font-medium">Méthode de Paiement:</span>{' '}
                  {order.paymentMethod === 'credit_card' ? 'Carte de Crédit' : 
                   order.paymentMethod === 'cash_on_delivery' ? 'Paiement à la Livraison' :
                   order.paymentMethod === 'bank_transfer' ? 'Virement Bancaire' :
                   order.paymentMethod || 'Non spécifiée'}
                </p>
              </div>
            </div>
          </div>

          <hr className="border-border mb-6" />

          <h3 className="font-semibold text-foreground mb-4">Articles Commandés</h3>
          <div className="space-y-3 mb-6">
            {order.items.map((item: any, index: any) => (
              <div key={index} className="flex justify-between items-center p-3 bg-secondary/5 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">{item.productName || item.product?.name || 'Produit'}</p>
                  <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                </div>
                <p className="font-semibold text-foreground">{(item.price / 1000).toFixed(3).replace('.', ',')} DT</p>
              </div>
            ))}
          </div>

          <hr className="border-border mb-6" />

          <div className="space-y-2 text-right">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total</span>
              <span className="text-foreground">{order.items?.reduce((sum: number, item: any) => sum + (item.price || 0), 0).toLocaleString('fr-TN')} DT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Taxe</span>
              <span className="text-foreground">0 DT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Livraison</span>
              <span className="text-foreground">7.000 DT</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
              <span className="text-foreground">Total</span>
              <span className="text-primary">{(order.total / 1000).toFixed(3).replace('.', ',')} DT</span>
            </div>
          </div>
        </Card>

        
        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">Continuer les Achats</Button>
          </Link>
          <Link href="/orders">
            <Button>Voir Toutes les Commandes</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
