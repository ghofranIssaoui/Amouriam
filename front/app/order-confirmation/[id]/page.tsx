'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useOrder } from '@/lib/order-context';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { use } from 'react';
import { io, Socket } from 'socket.io-client';

const SHIPPING_COST = 7;

// ===== Utils =====
const formatDT = (value: number) =>
  `${value.toFixed(3).replace('.', ',')} DT`;

const calcSubtotal = (items: any[]) =>
  items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

export default function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getAllOrders } = useOrder();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info';
  } | null>(null);

  // ===== Fetch Order =====
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orders = getAllOrders();
        const localOrder = orders.find((o) => o.id === id);

        if (localOrder) {
          setOrder(localOrder);
        } else {
          const token = localStorage.getItem('auth_token');
          const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`;

          const response = await fetch(apiUrl, {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setOrder(data);
          }
        }
      } catch (err) {
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, getAllOrders]);

  // ===== Socket.IO =====
  useEffect(() => {
    const newSocket = io(
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    );
    setSocket(newSocket);

    newSocket.on('orderStatusChanged', (data: any) => {
      if (data.orderId === id) {
        setOrder((prev: any) => ({
          ...prev,
          status: data.newStatus,
        }));

        setNotification({
          message: `Statut mis à jour: ${data.newStatus}`,
          type: 'info',
        });

        setTimeout(() => setNotification(null), 5000);
      }
    });

    return () => {
      newSocket.close();
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Commande introuvable
      </div>
    );
  }

  const subtotal = calcSubtotal(order.items);
  const total = subtotal + SHIPPING_COST;

  // ===== UI =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {notification && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
            {notification.message}
          </div>
        )}

        {/* Success */}
        <Card className="p-8 text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Commande Confirmée 🎉
          </h1>
          <p className="text-sm text-muted-foreground">
            ID Commande: {order.id}
          </p>
        </Card>

        {/* Details */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">
            Détails de la Commande
          </h2>

          {/* Items */}
          <h3 className="font-semibold mb-4">Articles</h3>
          <div className="space-y-3 mb-6">
            {order.items.map((item: any, i: number) => (
              <div
                key={i}
                className="flex justify-between p-3 bg-secondary/5 rounded"
              >
                <div>
                  <p className="font-medium">
                    {item.product?.name || item.name || 'Produit'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Quantité: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  {formatDT(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <hr className="mb-6" />

          {/* Totals */}
          <div className="space-y-2 text-right">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{formatDT(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxe</span>
              <span>0.000 DT</span>
            </div>
            <div className="flex justify-between">
              <span>Livraison</span>
              <span>{formatDT(SHIPPING_COST)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-3 border-t">
              <span>Total</span>
              <span className="text-primary">
                {formatDT(total)}
              </span>
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
