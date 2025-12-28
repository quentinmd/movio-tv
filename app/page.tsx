import Image from "next/image";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import MediaCarousel from "@/components/MediaCarousel";

export const revalidate = 60; // Revalider toutes les 60 secondes

export default async function HomePage() {
  const supabase = createClient();

  // Récupérer tous les médias publiés
  const { data: allMedia } = await supabase
    .from("media")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Récupérer les catégories pour les carrousels
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  // Media featured (le plus récent pour le hero)
  const featuredMedia = allMedia?.[0];

  // Grouper les médias par type
  const movies = allMedia?.filter((m) => m.type === "movie") || [];
  const tvShows = allMedia?.filter((m) => m.type === "tv") || [];

  // Grouper par catégories
  const mediaByCategory = categories?.map((cat) => ({
    category: cat,
    items:
      allMedia?.filter((media) => {
        // Note: Cette requête devrait idéalement utiliser une jointure
        // Pour simplifier, on va créer un carrousel "Tous les contenus" par catégorie
        return true;
      }) || [],
  }));

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      {featuredMedia && (
        <section className="relative h-[70vh] min-h-[500px] w-full">
          {/* Image de fond */}
          <div className="absolute inset-0">
            <Image
              src={
                featuredMedia.backdrop_url ||
                featuredMedia.poster_url ||
                "/placeholder.jpg"
              }
              alt={featuredMedia.title}
              fill
              className="object-cover"
              priority
            />
            {/* Overlay gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          </div>

          {/* Contenu */}
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl space-y-4">
              <div className="inline-block px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded">
                {featuredMedia.type === "movie" ? "Film" : "Série"} à la une
              </div>

              <h1 className="text-5xl md:text-6xl font-bold">
                {featuredMedia.title}
              </h1>

              {featuredMedia.description && (
                <p className="text-lg text-gray-300 line-clamp-3">
                  {featuredMedia.description}
                </p>
              )}

              <div className="flex items-center space-x-4 text-sm">
                {featuredMedia.year && (
                  <span className="text-gray-300">{featuredMedia.year}</span>
                )}
                {featuredMedia.duration && (
                  <span className="text-gray-300">
                    {featuredMedia.duration} min
                  </span>
                )}
                {featuredMedia.rating && (
                  <span className="flex items-center space-x-1 text-yellow-500">
                    <span>★</span>
                    <span>{featuredMedia.rating.toFixed(1)}</span>
                  </span>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="flex space-x-4 pt-4">
                <Link
                  href={`/watch/${featuredMedia.slug}`}
                  className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <Play className="h-5 w-5" fill="currentColor" />
                  <span>Regarder maintenant</span>
                </Link>

                <Link
                  href={`/watch/${featuredMedia.slug}`}
                  className="flex items-center space-x-2 bg-white/20 backdrop-blur text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 transition-colors"
                >
                  <Info className="h-5 w-5" />
                  <span>Plus d'infos</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Carrousels de contenu */}
      <div className="container mx-auto px-4 space-y-12 py-12">
        {/* Films */}
        {movies.length > 0 && <MediaCarousel title="Films" items={movies} />}

        {/* Séries */}
        {tvShows.length > 0 && (
          <MediaCarousel title="Séries TV" items={tvShows} />
        )}

        {/* Nouveautés */}
        {allMedia && allMedia.length > 0 && (
          <MediaCarousel title="Nouveautés" items={allMedia.slice(0, 12)} />
        )}

        {/* Tendances */}
        {allMedia && allMedia.length > 0 && (
          <MediaCarousel
            title="Tendances"
            items={[...allMedia]
              .sort((a, b) => (b.rating || 0) - (a.rating || 0))
              .slice(0, 12)}
          />
        )}
      </div>
    </div>
  );
}
