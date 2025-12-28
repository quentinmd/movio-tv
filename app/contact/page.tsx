"use client";

import { Mail, MessageSquare, Phone, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simuler l'envoi
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
    setFormData({ name: "", email: "", subject: "", message: "" });

    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg">
          <Mail className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Contactez-nous</h1>
          <p className="text-muted-foreground mt-2">
            Nous sommes là pour vous aider
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaire de contact */}
        <div className="lg:col-span-2">
          <div className="bg-secondary/50 p-6 md:p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500 text-green-500 rounded-lg">
                Merci ! Votre message a été envoyé avec succès. Nous vous
                répondrons dans les plus brefs délais.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2"
                  >
                    Nom complet *
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="john@exemple.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-2"
                >
                  Sujet *
                </label>
                <select
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="support">Support technique</option>
                  <option value="account">Problème de compte</option>
                  <option value="content">Question sur le contenu</option>
                  <option value="billing">Facturation</option>
                  <option value="feedback">Feedback / Suggestions</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  placeholder="Décrivez votre demande en détail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Envoyer le message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Informations de contact */}
        <div className="space-y-6">
          {/* Moyens de contact */}
          <div className="bg-secondary/50 p-6 rounded-lg border border-border">
            <h3 className="text-xl font-bold mb-4">Autres moyens de contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href="mailto:support@movio-tv.com"
                    className="text-sm text-muted-foreground hover:text-red-500"
                  >
                    support@movio-tv.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MessageSquare className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Chat en direct</p>
                  <p className="text-sm text-muted-foreground">
                    Disponible 9h-18h du lun. au ven.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p className="text-sm text-muted-foreground">
                    Bientôt disponible
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Temps de réponse */}
          <div className="bg-red-500/10 border border-red-500 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2 text-red-500">
              Temps de réponse
            </h3>
            <p className="text-sm text-muted-foreground">
              Nous nous efforçons de répondre à toutes les demandes dans un
              délai de 24 à 48 heures.
            </p>
          </div>

          {/* FAQ */}
          <div className="bg-secondary/50 p-6 rounded-lg border border-border">
            <h3 className="text-xl font-bold mb-2">
              Besoin d'une réponse rapide ?
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Consultez notre FAQ, vous y trouverez peut-être déjà la réponse à
              votre question.
            </p>
            <a
              href="/faq"
              className="text-red-500 hover:text-red-400 text-sm font-medium"
            >
              Voir la FAQ →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
