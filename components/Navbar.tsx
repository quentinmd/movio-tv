"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Film, Tv, Search, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    loadCategories();
    loadUser();

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  }

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    setCategories(data || []);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { href: "/", label: "Accueil", icon: null },
    { href: "/movies", label: "Films", icon: Film },
    { href: "/series", label: "Séries", icon: Tv },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo - Caché sur mobile */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="hidden sm:block bg-gradient-to-r from-red-600 to-red-500 p-2 rounded-lg">
              <Film className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
              Movio TV
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 transition-colors hover:text-red-500 text-sm lg:text-base ${
                    pathname === link.href
                      ? "text-red-500 font-semibold"
                      : "text-muted-foreground"
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Menu Catégories */}
            <div className="relative">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                onBlur={() => setTimeout(() => setIsCategoriesOpen(false), 200)}
                className={`flex items-center space-x-2 transition-colors hover:text-red-500 ${
                  pathname.startsWith("/category")
                    ? "text-red-500 font-semibold"
                    : "text-muted-foreground"
                }`}
              >
                <span>Catégories</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* Dropdown */}
              {isCategoriesOpen && categories.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg py-2 max-h-96 overflow-y-auto">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1.5 sm:p-2 hover:bg-secondary rounded-full transition-colors"
              aria-label="Rechercher"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* User Menu - Différent selon l'état de connexion */}
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="p-1.5 sm:p-2 hover:bg-secondary rounded-full transition-colors"
                  aria-label="Profil"
                >
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-1.5 sm:p-2 hover:bg-secondary rounded-full transition-colors"
                  aria-label="Déconnexion"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium hover:text-red-500 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/signup"
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="pb-4 animate-fade-in">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un film, une série..."
                className="w-full px-4 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                autoFocus
              />
            </form>
          </div>
        )}
      </div>
    </nav>
  );
}
