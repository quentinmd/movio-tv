"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Film } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push(redirect);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erreur de connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg">
              <Film className="h-8 w-8 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              Movio TV
            </span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold">Connexion</h2>
          <p className="mt-2 text-muted-foreground">
            Accédez à votre compte administrateur
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="bg-secondary p-6 rounded-lg border border-border space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-2"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
