import { Sparkles, Clock } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Nouveautés - Movio TV",
  description: "Découvrez les derniers films et séries ajoutés sur Movio TV.",
};

export default async function NewPage() {
  const supabase = await createClient();

  // Récupérer les derniers contenus ajoutés (30 derniers jours)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: recentMedia } = await supabase
    .from("media")
    .select("*")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: false })
    .limit(24);

  const movies = recentMedia?.filter((m) => m.type === "movie") || [];
  const series = recentMedia?.filter((m) => m.type === "series") || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Nouveautés</h1>
          <p className="text-muted-foreground mt-2">
            Les derniers contenus ajoutés sur Movio TV
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Ajoutés dans les 30 derniers jours</span>
        </div>
      </div>

      {/* Nouveaux Films */}
      {movies.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-red-500">
            Nouveaux Films ({movies.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <Link
                key={movie.id}
                href={`/watch/${movie.slug}`}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
                  {movie.poster_url ? (
                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground text-sm text-center p-4">
                        {movie.title}
                      </span>
                    </div>
                  )}

                  {/* Badge Nouveau */}
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    NOUVEAU
                  </div>

                  {/* Info au survol */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <div>
                      <p className="font-semibold text-sm line-clamp-2 mb-1">
                        {movie.title}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {movie.year && <span>{movie.year}</span>}
                        {movie.rating && (
                          <>
                            <span>•</span>
                            <span>⭐ {movie.rating.toFixed(1)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Nouvelles Séries */}
      {series.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-red-500">
            Nouvelles Séries ({series.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {series.map((show) => (
              <Link
                key={show.id}
                href={`/watch/${show.slug}`}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary">
                  {show.poster_url ? (
                    <img
                      src={show.poster_url}
                      alt={show.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-muted-foreground text-sm text-center p-4">
                        {show.title}
                      </span>
                    </div>
                  )}

                  {/* Badge Nouveau */}
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    NOUVEAU
                  </div>

                  {/* Info au survol */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <div>
                      <p className="font-semibold text-sm line-clamp-2 mb-1">
                        {show.title}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        {show.year && <span>{show.year}</span>}
                        {show.rating && (
                          <>
                            <span>•</span>
                            <span>⭐ {show.rating.toFixed(1)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Message si aucun contenu récent */}
      {(!recentMedia || recentMedia.length === 0) && (
        <div className="text-center py-20">
          <Sparkles className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Aucune nouveauté récente</h2>
          <p className="text-muted-foreground mb-6">
            Revenez bientôt pour découvrir les derniers ajouts !
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      )}
    </div>
  );
}
