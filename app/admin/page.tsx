import { createClient } from "@/lib/supabase/server";
import { Film, Tv, FolderOpen, Users, TrendingUp, Eye } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Dashboard Admin - Movio TV",
  description: "Panneau d'administration Movio TV",
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Statistiques
  const [
    { count: moviesCount },
    { count: seriesCount },
    { count: categoriesCount },
    { count: usersCount },
    { data: recentMedia },
  ] = await Promise.all([
    supabase
      .from("media")
      .select("*", { count: "exact", head: true })
      .eq("type", "movie"),
    supabase
      .from("media")
      .select("*", { count: "exact", head: true })
      .eq("type", "tv"),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("media")
      .select("id, title, type, created_at, status")
      .order("created_at", { ascending: false })
      .limit(5)
      .returns<any[]>(),
  ]);

  const stats = [
    {
      label: "Films",
      value: moviesCount || 0,
      icon: Film,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      href: "/admin/media/movies",
    },
    {
      label: "Séries",
      value: seriesCount || 0,
      icon: Tv,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      href: "/admin/media/series",
    },
    {
      label: "Catégories",
      value: categoriesCount || 0,
      icon: FolderOpen,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      href: "/admin/categories",
    },
    {
      label: "Utilisateurs",
      value: usersCount || 0,
      icon: Users,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      href: "/admin/users",
    },
  ];

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre plateforme de streaming
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="bg-secondary p-6 rounded-lg border border-border hover:border-red-500 transition-all hover:shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Contenu récent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Médias récents */}
        <div className="bg-secondary p-6 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Médias récents</h2>
            <Link
              href="/admin/media"
              className="text-sm text-red-500 hover:underline"
            >
              Voir tout
            </Link>
          </div>
          <div className="space-y-4">
            {recentMedia && recentMedia.length > 0 ? (
              recentMedia.map((media) => (
                <div
                  key={media.id}
                  className="flex items-center justify-between p-4 bg-background rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg ${
                        media.type === "movie"
                          ? "bg-blue-500/10"
                          : "bg-purple-500/10"
                      }`}
                    >
                      {media.type === "movie" ? (
                        <Film
                          className={`h-5 w-5 ${
                            media.type === "movie"
                              ? "text-blue-500"
                              : "text-purple-500"
                          }`}
                        />
                      ) : (
                        <Tv className="h-5 w-5 text-purple-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{media.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {media.type === "movie" ? "Film" : "Série"} •{" "}
                        {new Date(media.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      media.status === "published"
                        ? "bg-green-500/10 text-green-500"
                        : media.status === "draft"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-gray-500/10 text-gray-500"
                    }`}
                  >
                    {media.status === "published"
                      ? "Publié"
                      : media.status === "draft"
                      ? "Brouillon"
                      : "Archivé"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                Aucun média pour le moment
              </p>
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-secondary p-6 rounded-lg border border-border">
          <h2 className="text-xl font-bold mb-6">Actions rapides</h2>
          <div className="space-y-3">
            <Link
              href="/admin/media/new?type=movie"
              className="flex items-center space-x-3 p-4 bg-background rounded-lg hover:bg-red-600 hover:text-white transition-colors group"
            >
              <Film className="h-5 w-5" />
              <div>
                <p className="font-medium">Ajouter un film</p>
                <p className="text-sm text-muted-foreground group-hover:text-white/70">
                  Créer une nouvelle fiche film
                </p>
              </div>
            </Link>

            <Link
              href="/admin/media/new?type=tv"
              className="flex items-center space-x-3 p-4 bg-background rounded-lg hover:bg-red-600 hover:text-white transition-colors group"
            >
              <Tv className="h-5 w-5" />
              <div>
                <p className="font-medium">Ajouter une série</p>
                <p className="text-sm text-muted-foreground group-hover:text-white/70">
                  Créer une nouvelle série TV
                </p>
              </div>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center space-x-3 p-4 bg-background rounded-lg hover:bg-red-600 hover:text-white transition-colors group"
            >
              <FolderOpen className="h-5 w-5" />
              <div>
                <p className="font-medium">Gérer les catégories</p>
                <p className="text-sm text-muted-foreground group-hover:text-white/70">
                  Ajouter ou modifier des genres
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="flex items-center space-x-3 p-4 bg-background rounded-lg hover:bg-red-600 hover:text-white transition-colors group"
            >
              <Eye className="h-5 w-5" />
              <div>
                <p className="font-medium">Voir le site</p>
                <p className="text-sm text-muted-foreground group-hover:text-white/70">
                  Vue publique de la plateforme
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
