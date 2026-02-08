'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/backend-auth';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login, register, loading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      await login(email, password);
    } else {
      await register(email, password, name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-2 text-foreground">
            {isLogin ? 'Bon Retour' : 'Rejoindre Amourium'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isLogin
              ? 'Connectez-vous pour accéder à votre compte et vos commandes'
              : 'Créez un compte pour commencer à acheter'
            }
          </p>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                  Nom Complet
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  placeholder="Jean Dupont"
                  disabled={loading}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="vous@exemple.com"
                disabled={loading}
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Mot de passe
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={loading}
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>
            {isLogin && (
              <div className="flex justify-between items-center">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? 'Connexion...' : 'Création du compte...'}
                </>
              ) : isLogin ? (
                'Se Connecter'
              ) : (
                'Créer un Compte'
              )}
            </Button>
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Vous n'avez pas de compte? " : 'Vous avez déjà un compte? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  {isLogin ? 'S\'inscrire' : 'Se connecter'}
                </button>
              </p>
          </div>

          {/* <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-4">
              Identifiants de démonstration
            </p>
            <div className="space-y-2 text-xs">
              <p className="text-muted-foreground">
                <strong>Admin:</strong> admin@amourium.com / password
              </p>
              <p className="text-muted-foreground">
                <strong>Utilisateur:</strong> user@example.com / password
              </p>
            </div>
          </div> */}

          <Link
            href="/"
            className="block text-center text-sm text-primary hover:underline mt-6"
          >
            Retour à l'accueil
          </Link>
          </form>
        </div>
      </Card>
    </div>
  );
}
