'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import { getProducts, Product } from '@/lib/api/products';
import { Leaf, Sprout, Droplets } from 'lucide-react';
import Link from 'next/link';
import { fetchFromApi } from './lib/api';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        console.log('Loading products...');
        
        // Test basic API connection first
        console.log('Testing API connection...');
        const testResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/test`);
        const testData = await testResponse.json();
        console.log('API test response:', testData);
        
        // Now try to get products
        const fetchedProducts = await getProducts();
        console.log('Fetched products:', fetchedProducts);
        console.log('Products length:', fetchedProducts.length);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

    return (
    <div className="min-h-screen bg-background">
      <Header />

      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground text-balance">
                Cultivez <span className="text-primary">Naturellement</span> avec Amourium
              </h1>
              <p className="text-lg text-muted-foreground text-balance">
                Exploitez la puissance de la nature avec nos stimulants de croissance biologiques premium et engrais liquides. Cultivez des plantes plus saines, des sols plus riches et des récoltes durables.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="#products"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                > 
                  Acheter Maintenant
                </Link>
                <Link
                  href="#about"
                  className="inline-flex items-center justify-center rounded-lg border border-primary px-8 py-3 text-primary font-semibold hover:bg-primary/5 transition-colors"
                >
                  En Savoir Plus
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative h-96">
              <div className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center p-4">
                <img 
                  src="/123.png" 
                  alt="Amourium Logo" 
                  className="h-full w-full max-h-80 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pourquoi Choisir Amourium?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Nos produits sont fabriqués à partir d\'ingrédients naturels soigneusement sélectionnés pour offrir des résultats exceptionnels
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: '100% Biologique',
                description: 'Fabriqué à partir d\'ingrédients naturels et biodégradables sans aucun additif synthétique.'
              },
              {
                icon: Sprout,
                title: 'Résultats Prouvés',
                description: 'Augmentez les taux de croissance jusqu\'à 40% avec des compositions formulées scientifiquement.'
              },
              {
                icon: Droplets,
                title: 'Durable',
                description: 'Des produits écologiques qui nourrissent les plantes tout en protégeant notre planète.'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-card p-6 text-center hover:shadow-md transition-shadow"
                >
                  <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos Produits
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explorez notre gamme de produits biologiques premium conçus pour tous les besoins de jardinage
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {productsLoading ? (
              <div className="col-span-2 text-center py-8">
                <p>Chargement des produits...</p>
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p>Aucun produit trouvé</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              À Propos d\'Amourium
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Amourium est dédié à la révolution de l\'agriculture durable par l\'innovation et la nature. Nos produits sont méticuleusement fabriqués en utilisant des flux de déchets organiques et des minéraux naturels, les transformant en puissants stimulants de croissance pour vos plantes.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Nous croyons à la symbiose entre la nature et l\'agriculture, assurant que chaque produit que nous créons contribue à des plantes plus saines, des sols plus riches et une planète plus durable. Rejoignez des milliers de producteurs dans le monde qui font confiance à Amourium pour des résultats exceptionnels.
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link
                href="#products"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Commencer à Cultiver
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          {/* <p>&copy; 2024 Amourium. Tous droits réservés. | Solutions Agricoles Biologiques Premium</p> */}
        </div>
      </footer>
    </div>
  );
}
