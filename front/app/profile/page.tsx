'use client';
 
import { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '@/lib/backend-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import {
  Settings,
  ShoppingBag,
  MapPin,
  Heart,
  LogOut,
  User,
  ChevronRight,
  Camera,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type TabType = 'overview' | 'orders' | 'addresses' | 'wishlist' | 'settings';

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Accès Refusé
            </h1>
            <p className="text-muted-foreground mb-6">
              Vous devez être connecté pour accéder à cette page.
            </p>
            <Link href="/auth">
              <Button>Se Connecter</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/auth');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      // In a real app, you would upload the file to a server here
      // For now, we'll just create a local URL for the image
      const imageUrl = URL.createObjectURL(file);
      
      // Update the user's profile picture in localStorage
      const users = JSON.parse(localStorage.getItem('amourium-users') || '[]');
      const updatedUsers = users.map((u: any) => 
        u.id === user.id ? { ...u, profilePicture: imageUrl } : u
      );
      localStorage.setItem('amourium-users', JSON.stringify(updatedUsers));
      
      // Update the user in the auth context
      setUser({ ...user, profilePicture: imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Aperçu', icon: User },
    { id: 'orders', label: 'Commandes', icon: ShoppingBag },
    { id: 'addresses', label: 'Adresses', icon: MapPin },
    { id: 'wishlist', label: 'Liste de Souhaits', icon: Heart },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab user={user} />;
      case 'orders':
        return <OrdersTab />;
      case 'addresses':
        return <AddressesTab />;
      case 'wishlist':
        return <WishlistTab />;
      case 'settings':
        return <SettingsTab user={user} />;
      default:
        return <OverviewTab user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-20">
              {/* Profile Card */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 relative overflow-hidden">
                {user?.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-primary" />
                )}
                <button 
                  onClick={handleImageClick}
                  className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-primary-foreground hover:opacity-90 transition-opacity"
                  type="button"
                >
                  <Camera className="h-3 w-3" />
                </button>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />
              </div>
                <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as TabType)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                    </button>
                  );
                })}
              </nav>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 border border-destructive text-destructive px-4 py-3 rounded-lg hover:bg-destructive/10 transition-colors mt-6 font-medium"
              >
                <LogOut className="h-5 w-5" />
                Se Déconnecter
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {renderContent()}
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

function OverviewTab({ user }: { user: any }) {
  const [stats, setStats] = useState<{
    accountCreated: Date;
    totalOrders: number;
    totalSpent: number;
    savedAddresses: number;
    isLoading: boolean;
    error: string | null;
  }>({
    accountCreated: new Date(),
    totalOrders: 0,
    totalSpent: 0,
    savedAddresses: 0,
    isLoading: true,
    error: null,
  });
 
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setStats(prev => ({ ...prev, isLoading: true, error: null }));
        const response = await fetch('/api/user/statistics');
        const data = await response.json();
        
        // Always handle the response, even if not OK, as we return 200 with default values
        setStats({
          accountCreated: new Date(data.accountCreated || new Date()),
          totalOrders: data.totalOrders || 0,
          totalSpent: data.totalSpent || 0,
          savedAddresses: data.savedAddresses || 0,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching user statistics:', error);
        // Use default values on error
        setStats({
          accountCreated: new Date(),
          totalOrders: 0,
          totalSpent: 0,
          savedAddresses: 0,
          isLoading: false,
          error: null, // Don't show error to user, use defaults
        });
      }
    };

    fetchUserStats();
  }, []);
 
  if (stats.isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
 
  if (stats.error) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 text-center">
        <p className="text-destructive">{stats.error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-primary hover:underline"
        >
          Réessayer
        </button>
      </div>
    );
  }
 
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Aperçu du Compte</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Nom</p>
            <p className="text-lg font-semibold text-foreground">{user.name}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-lg font-semibold text-foreground">{user.email}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Compte Créé</p>
            <p className="text-lg font-semibold text-foreground">
              {stats.accountCreated
                ? format(new Date(stats.accountCreated), 'MMMM yyyy', { locale: fr })
                : 'N/A'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Statut</p>
            <p className="text-lg font-semibold text-primary">
              {user.isAdmin ? 'Administrateur' : 'Client'}
            </p>
          </div>
        </div>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Total Commandes</p>
          <p className="text-3xl font-bold text-primary">
            {stats.totalOrders?.toLocaleString() || '0'}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Dépenses Totales</p>
          <p className="text-3xl font-bold text-primary">
            {stats.totalSpent
              ? new Intl.NumberFormat('fr-TN', {
                  style: 'currency',
                  currency: 'TND',
                }).format(stats.totalSpent)
              : '0,000 DT'}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-sm text-muted-foreground mb-2">Adresses Sauvegardées</p>
          <p className="text-3xl font-bold text-primary">
            {stats.savedAddresses?.toLocaleString() || '0'}
          </p>
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('OrdersTab useEffect triggered');
    console.log('User:', user);
    console.log('Token:', token);
    
    const fetchOrders = async () => {
      if (!user) {
        console.log('No user, returning');
        return;
      }
      
      try {
        setIsLoading(true);
        setError('');
        
        console.log('Fetching orders with token:', token);
        
        const response = await fetch('/api/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        console.log('Orders data:', data);
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user, token]);

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Mes Commandes</h2>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Mes Commandes</h2>
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">Mes Commandes</h2>
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">Vous n'avez pas encore de commandes.</p>
          <Link href="/">
            <Button className="mt-4">Commencer à Acheter</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="border border-border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-foreground">Commande #{order.orderNumber || order._id?.substring(0, 8)}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{(order.total * 1.1).toFixed(2)} Dt</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status === 'completed' ? 'Terminée' :
                     order.status === 'processing' ? 'En traitement' :
                     order.status === 'pending' ? 'En attente' :
                     'Annulée'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 text-sm">
                    <img 
                      src={item.image || '/placeholder.svg'} 
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-muted-foreground">Quantité: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{item.price.toFixed(2)} Dt</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <Link href={`/order-confirmation/${order._id}`}>
                  <Button variant="outline" size="sm">
                    Voir les détails
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressesTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Mes Adresses</h2>
        <Button>Ajouter une Adresse</Button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 text-center py-12">
        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">Aucune adresse sauvegardée.</p>
      </div>
    </div>
  );
}

function WishlistTab() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-2xl font-bold text-foreground mb-4">Liste de Souhaits</h2>
      <div className="text-center py-12">
        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
        <p className="text-muted-foreground">Votre liste de souhaits est vide.</p>
      </div>
    </div>
  );
}

function SettingsTab({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Paramètres du Compte</h2>

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Informations Personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Prénom</label>
                <input
                  type="text"
                  defaultValue={user.name.split(' ')[0]}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
                <input
                  type="text"
                  defaultValue={user.name.split(' ').slice(1).join(' ')}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Informations de Contact</h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                defaultValue={user.email}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled
              />
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Sécurité</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Mot de Passe</p>
                  <p className="text-sm text-muted-foreground">Modifiez votre mot de passe régulièrement</p>
                </div>
                <Button variant="outline">Modifier</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Authentification à Deux Facteurs</p>
                  <p className="text-sm text-muted-foreground">Sécurisez votre compte avec 2FA</p>
                </div>
                <Button variant="outline">Activer</Button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Préférences</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-foreground">Recevoir les newsletters</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-foreground">Notifications de promotions</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={false}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-foreground">Notifications de commandes</span>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button className="flex-1">Enregistrer les Modifications</Button>
            <Button variant="outline">Annuler</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
