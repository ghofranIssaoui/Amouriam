'use client';

import React from "react"

import { Header } from '@/components/header';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Le sujet est requis';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });

        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      console.error('Failed to submit contact form:', error);
      setErrors({ submit: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Contactez-Nous
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Vous avez des questions sur nos produits? Nous sommes là pour vous aider. Contactez-nous et nous vous répondrons au plus vite.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Email</h3>
              <p className="text-muted-foreground">
                <a
                  href="mailto:hello@amourium.com"
                  className="hover:text-primary transition-colors"
                >
                  Amourium.monde@gmail.com
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                Nous vous répondrons dans les 24 heures
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Téléphone</h3>
              <p className="text-muted-foreground">
                <a
                  href="tel:+1234567890"
                  className="hover:text-primary transition-colors"
                >
                  +216 28 74 98 24
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                lun-dim 
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Localisation</h3>
              <p className="text-muted-foreground">
                Manouba 
                
              </p>
              <p className="text-sm text-muted-foreground">
                Visitez-nous ou programmez une visite
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Instagram className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Instagram</h3>
              <p className="text-muted-foreground">
                <a
                  href="https://www.instagram.com/amourium_monde?igsh=M3p4bnN1MWp0M2J1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  @amourium_monde
                </a>
              </p>
              <p className="text-sm text-muted-foreground">
                Suivez-nous pour nos dernières actualités
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-foreground mb-2">Envoyez-nous un Message</h2>
              <p className="text-muted-foreground mb-8">
                Remplissez le formulaire ci-dessous et nous vous répondrons bientôt.
              </p>

              {isSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-800 font-medium">Message envoyé avec succès!</p>
                    <p className="text-green-700 text-sm">
                      Merci de nous avoir contactés. Nous vous répondrons bientôt.
                    </p>
                  </div>
                </div>
              )}

              {errors.submit && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{errors.submit}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-foreground"
                    >
                      Nom Complet
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jean Dupont"
                      className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.name
                          ? 'border-red-500 bg-red-50'
                          : 'border-border bg-input'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-600 text-sm">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-foreground"
                    >
                      Adresse E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jean@exemple.com"
                      className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        errors.email
                          ? 'border-red-500 bg-red-50'
                          : 'border-border bg-input'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-sm">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-foreground"
                  >
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Comment pouvons-nous vous aider?"
                    className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      errors.subject
                        ? 'border-red-500 bg-red-50'
                        : 'border-border bg-input'
                    }`}
                  />
                  {errors.subject && (
                    <p className="text-red-600 text-sm">{errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-foreground"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Parlez-nous davantage de votre demande..."
                    rows={5}
                    className={`w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                      errors.message
                        ? 'border-red-500 bg-red-50'
                        : 'border-border bg-input'
                    }`}
                  />
                  {errors.message && (
                    <p className="text-red-600 text-sm">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity py-3 font-semibold flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Envoyer le Message
                    </>
                  )}
                </Button>
              </form>

              <p className="text-sm text-muted-foreground text-center mt-6">
                Nous respectons votre vie privée. Vos informations ne seront jamais partagées.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Questions Fréquemment Posées
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                Quel est votre délai de réponse typique?
              </h3>
              <p className="text-muted-foreground">
                Nous visons à répondre à toutes les demandes dans un délai de 24 heures ouvrables. Pour les questions urgentes, veuillez nous appeler directement.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                Proposez-vous des commandes en gros?
              </h3>
              <p className="text-muted-foreground">
                Oui! Nous proposons une tarification spéciale pour les commandes en gros. Contactez notre équipe de ventes pour plus d\'informations.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                Quelles méthodes de paiement acceptez-vous?
              </h3>
              <p className="text-muted-foreground">
                Nous acceptons toutes les principales cartes de crédit, cartes de débit et méthodes de paiement numériques via notre paiement sécurisé.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">
                Livrez-vous à l\'international?
              </h3>
              <p className="text-muted-foreground">
                Actuellement, nous livrons dans certains pays. Vérifiez votre localisation lors du paiement ou contactez-nous pour plus de détails.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
