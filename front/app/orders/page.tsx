// app/orders/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

import { Card } from '@/components/ui/card';
import { useAuth } from '@/lib/backend-auth';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        setError('');
        
        const response = await fetch('/api/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
          credentials: 'include',
          cache: 'no-store',
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Unexpected response content type:', contentType, 'Response:', text);
          throw new Error('Réponse inattendue du serveur');
        }

        const data = await response.json();
        
        console.log('Orders received by user:', data);
        console.log('Current user ID:', user?.id);
        console.log('Current user:', user);
        
        if (!response.ok) {
          console.error('API Error Response:', data);
          throw new Error(data.message || 'Échec du chargement des commandes');
        }

        if (!Array.isArray(data)) {
          console.error('Expected array but got:', data);
          throw new Error('Format de données invalide');
        }

        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue lors du chargement des commandes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Socket.IO connection for real-time updates
  useEffect(() => {
    if (!user) return;

    console.log('Connecting to Socket.IO...');
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket.IO connected successfully:', newSocket.id);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    // Join user's personal room for notifications
    console.log('Joining user room for user ID:', user.id);
    newSocket.emit('joinUserRoom', user.id);

    // Listen for order status changes
    newSocket.on('orderStatusChanged', (data: any) => {
      console.log('Order status changed received:', data);
      
      // Update the specific order in the state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === data.orderId 
            ? { ...order, status: data.newStatus }
            : order
        )
      );

      // Show notification
      setNotification({
        message: `Le statut de votre commande #${data.orderId?.toString().slice(-6)} a été mis à jour: ${getStatusText(data.newStatus)}`,
        type: 'info'
      });

      // Hide notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    });

    return () => {
      console.log('Cleaning up Socket.IO connection');
      newSocket.close();
    };
  }, [user]);

  // Polling mechanism as fallback (every 30 seconds)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
          credentials: 'include',
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            // Check for status changes and show notifications
            data.forEach((updatedOrder: Order) => {
              const existingOrder = orders.find(o => o._id === updatedOrder._id);
              if (existingOrder && existingOrder.status !== updatedOrder.status) {
                setNotification({
                  message: `Le statut de votre commande #${updatedOrder._id?.toString().slice(-6)} a été mis à jour: ${getStatusText(updatedOrder.status)}`,
                  type: 'info'
                });
                setTimeout(() => setNotification(null), 5000);
              }
            });
            setOrders(data);
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [user, token, orders]);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Connexion requise</h1>
            <p className="text-muted-foreground mb-6">
              Veuillez vous connecter pour voir vos commandes.
            </p>
            <Link href="/auth">
              <Button>Se connecter</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mes Commandes</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-muted rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mes Commandes</h1>
        <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-lg">
          <p>{error}</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes Commandes</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Actualiser
          </Button>
          {/* Test button for debugging */}
          {orders.length > 0 && (
            <Button 
              variant="destructive" 
              onClick={() => {
                const testOrder = orders[0];
                console.log('Testing status change for order:', testOrder);
                fetch(`http://localhost:5000/api/orders/${testOrder._id}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({ status: 'processing' })
                }).then(response => {
                  console.log('Test status change response:', response);
                  return response.json();
                }).then(data => {
                  console.log('Test status change data:', data);
                }).catch(error => {
                  console.error('Test status change error:', error);
                });
              }}
            >
              Test Status Change
            </Button>
          )}
          <Link href="/">
            <Button variant="outline">Continuer mes achats</Button>
          </Link>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto h-16 w-16 text-muted-foreground"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground">Aucune commande trouvée</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            Vous n'avez pas encore passé de commande. Commencez vos achats dès maintenant!
          </p>
          <div className="flex gap-2 justify-center">
            <Button className="mt-4" asChild>
              <Link href="/">Parcourir les produits</Link>
            </Button>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/checkout">Voir le panier</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <div className="bg-muted/50 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-medium">Commande #{order.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), 'PPP', { locale: fr })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="font-medium">Total: </span>
                      {new Intl.NumberFormat('fr-TN', {
                        style: 'currency',
                        currency: 'TND',
                      }).format(order.total)}
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'processing'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status === 'completed'
                        ? 'Terminée'
                        : order.status === 'processing'
                        ? 'En cours'
                        : order.status === 'cancelled'
                        ? 'Annulée'
                        : 'En attente'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {order.items.map((item, index) => {
                    console.log("Order Item:", item);
                    return (
                    <div key={`${item.productId}-${index}`} className="flex items-center gap-4">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div className="h-full w-full bg-muted" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} ×{' '}
                          {new Intl.NumberFormat('fr-TN', {
                            style: 'currency',
                            currency: 'TND',
                          }).format(item.price)}
                        </p>
                      </div>
                    </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" asChild>
                    <Link href={`/order-confirmation/${order._id}`}>
                      Voir les détails
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}