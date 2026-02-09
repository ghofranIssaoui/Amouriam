'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/backend-auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    type: 'powder',
    image: ''
  });

  // Fetch all orders from backend
  const fetchAllOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/admin/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Fetch all users from backend
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/users/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error('Failed to fetch users:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch all messages from backend
  const fetchAllMessages = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        console.error('Failed to fetch messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Fetch all products from backend
  const fetchAllProducts = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      
      if (response.ok) {
        const data = await response.json();
        setProducts(data || []);
      } else {
        console.error('Failed to fetch products:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  // Handle product form submission
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          ...productForm,
          price: parseFloat(productForm.price)
        })
      });
      
      if (response.ok) {
        alert('Produit ajouté avec succès!');
        setProductForm({
          name: '',
          price: '',
          description: '',
          category: '',
          type: 'powder',
          image: ''
        });
        setShowAddProduct(false);
      } else {
        alert('Erreur lors de l\'ajout du produit');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Erreur lors de l\'ajout du produit');
    }
  };

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      router.push('/auth');
      return;
    }

    if (!user.isAdmin) {
      router.push('/');
      return;
    }

    // Fetch both orders, users, messages, and products
    const fetchData = async () => {
      await Promise.all([
        fetchAllOrders(),
        fetchAllUsers(),
        fetchAllMessages(),
        fetchAllProducts()
      ]);
      setLoading(false);
    };

    fetchData();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4 text-foreground">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access this page.
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Refresh orders list
        await fetchAllOrders();
      } else {
        console.error('Failed to update order status:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const uniqueCustomers = new Set(orders.filter(o => o.user).map(o => o.user._id)).size;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Tableau de Bord Admin</h1>
            <p className="text-muted-foreground">Bienvenue, {user.name}</p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Store</Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Revenu Total</div>
            <div className="text-3xl font-bold text-primary">{totalRevenue.toFixed(2)} Dt</div>
            <p className="text-xs text-muted-foreground mt-2">Toutes périodes</p>
          </Card>

          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Total Commandes</div>
            <div className="text-3xl font-bold text-secondary">{totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-2">Commandes passées</p>
          </Card>

          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Commandes Terminées</div>
            <div className="text-3xl font-bold text-accent">{completedOrders}</div>
            <p className="text-xs text-muted-foreground mt-2">Livré</p>
          </Card>

          <Card className="p-6">
            <div className="text-sm text-muted-foreground mb-2">Commandes En Attente</div>
            <div className="text-3xl font-bold text-destructive">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground mt-2">En attente de livraison</p>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Commandes</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="analytics">Analytiques</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Commandes Récentes</h2>

              {orders.length === 0 ? (
                <p className="text-muted-foreground">Pas encore de commandes</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">ID Commande</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Client</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Total</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b border-border hover:bg-secondary/5">
                          <td className="py-3 px-4 font-mono text-xs text-primary">{order._id.substring(0, 12)}</td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-foreground">
                              {order.user ? order.user.name : 'Unknown User'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.user ? order.user.email : 'No email'}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 font-semibold text-foreground">
                            {new Intl.NumberFormat('fr-TN', {
                              style: 'currency',
                              currency: 'TND',
                            }).format(order.total)}
                          </td>
                          <td className="py-3 px-4">
                            <Select value={order.status} onValueChange={(value) => handleStatusChange(order._id, value)}>
                              <SelectTrigger className="w-32 h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">En Attente</SelectItem>
                                <SelectItem value="processing">En Traitement</SelectItem>
                                <SelectItem value="shipped">Expédiée</SelectItem>
                                <SelectItem value="delivered">Livrée</SelectItem>
                                <SelectItem value="cancelled">Annulée</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 px-4">
                            <Link href={`/order-confirmation/${order._id}`}>
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Utilisateurs</h2>

              {users.length === 0 ? (
                <p className="text-muted-foreground">Pas encore d'utilisateurs</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">ID Utilisateur</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Nom</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Rôle</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Date d'inscription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-b border-border hover:bg-secondary/5">
                          <td className="py-3 px-4 font-mono text-xs text-primary">{user._id.substring(0, 12)}</td>
                          <td className="py-3 px-4 font-medium text-foreground">{user.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{user.email}</td>
                          <td className="py-3 px-4">
                            <Badge variant={user.isAdmin ? "default" : "secondary"}>
                              {user.isAdmin ? 'Admin' : 'User'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Messages</h2>

              {messages.length === 0 ? (
                <p className="text-muted-foreground">Pas encore de messages</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">ID Message</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Nom</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Sujet</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Statut</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map((message) => (
                        <tr key={message._id} className="border-b border-border hover:bg-secondary/5">
                          <td className="py-3 px-4 font-mono text-xs text-primary">{message._id.substring(0, 12)}</td>
                          <td className="py-3 px-4 font-medium text-foreground">{message.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">{message.email}</td>
                          <td className="py-3 px-4">
                            <div className="max-w-xs truncate" title={message.subject}>
                              {message.subject}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={
                              message.status === 'pending' ? 'destructive' :
                              message.status === 'read' ? 'secondary' : 'default'
                            }>
                              {message.status === 'pending' ? 'En Attente' :
                               message.status === 'read' ? 'Lu' : 'Répondu'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-foreground">Produits</h2>
                <Button onClick={() => setShowAddProduct(true)}>
                  Ajouter un Produit
                </Button>
              </div>

              {products.length === 0 ? (
                <p className="text-muted-foreground">Pas encore de produits</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-foreground">ID Produit</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Nom</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Prix</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Catégorie</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Image</th>
                        <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product._id} className="border-b border-border hover:bg-secondary/5">
                          <td className="py-3 px-4 font-mono text-xs text-primary">{product.id.substring(0, 12)}</td>
                          <td className="py-3 px-4 font-medium text-foreground">{product.name}</td>
                          <td className="py-3 px-4">
                            <Badge variant={product.type === 'powder' ? 'default' : 'secondary'}>
                              {product.type === 'powder' ? 'Poudre' : 'Liquide'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 font-semibold text-foreground">{product.price.toFixed(2)} Dt</td>
                          <td className="py-3 px-4 text-muted-foreground">{product.category || 'Non défini'}</td>
                          <td className="py-3 px-4">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-8 h-8 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.src = '/products/placeholder.jpg';
                              }}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Modifier
                              </Button>
                              <Button variant="destructive" size="sm">
                                Supprimer
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Analytiques des Ventes</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Commandes par Statut</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'En Attente', count: pendingOrders, color: 'bg-destructive' },
                      { label: 'En Traitement', count: orders.filter(o => o.status === 'processing').length, color: 'bg-secondary' },
                      { label: 'Expédiée', count: orders.filter(o => o.status === 'shipped').length, color: 'bg-secondary' },
                      { label: 'Livrée', count: completedOrders, color: 'bg-accent' },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground font-medium">{stat.label}</span>
                          <span className="text-muted-foreground">{stat.count}</span>
                        </div>
                        <div className="w-full bg-border rounded-full h-2">
                          <div
                            className={`${stat.color} h-2 rounded-full`}
                            style={{ width: `${totalOrders > 0 ? (stat.count / totalOrders) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Principaux Métriques</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-secondary/5 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Valeur Moyenne Commande</p>
                      <p className="text-2xl font-bold text-primary">
                        {totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : '0.00'} Dt
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/5 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Taux de Réussite</p>
                      <p className="text-2xl font-bold text-accent">
                        {totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0}%
                      </p>
                    </div>
                    <div className="p-3 bg-secondary/5 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Total Clients</p>
                      <p className="text-2xl font-bold text-secondary">
                        {uniqueCustomers}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Paramètres Admin</h2>

              {/* <Alert className="mb-6">
                <AlertDescription>
                  Ceci est un panneau d'administration démo. Dans un environnement de production, vous géreriez l'inventaire, les promotions, les comptes utilisateurs, et plus.
                </AlertDescription>
              </Alert> */}

              <div className="space-y-6">
                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-2">Actions Rapides</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground mb-3">Gérer votre boutique</p>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => setShowAddProduct(true)}>Ajouter Produit</Button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-2">Informations Admin</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Nom:</span>{' '}
                      <span className="text-foreground font-medium">{user.name}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Email:</span>{' '}
                      <span className="text-foreground font-medium">{user.email}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Rôle:</span>{' '}
                      <Badge>Administrateur</Badge>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Ajouter un Produit</h2>
            
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom du produit</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Prix (Dt)</label>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Catégorie</label>
                <input
                  type="text"
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  value={productForm.type}
                  onChange={(e) => setProductForm({...productForm, type: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="powder">Poudre</option>
                  <option value="liquid">Liquide</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">URL de l'image</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="/products/image.jpg"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  Ajouter
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1"
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
