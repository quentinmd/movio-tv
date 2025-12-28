import Image from "next/image";
import Link from "next/link";
import { Play, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import MediaCarousel from "@/components/MediaCarousel";
import HeroCarousel from "@/components/HeroCarousel";

export const revalidate = 60; // Revalider toutes les 60 secondes

export default async function HomePage() {
  const supabase = await createClient();

  // Récupérer tous les médias publiés
  const { data: allMedia } = await supabase
    .from("media")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .returns<any[]>();

  // Récupérer les catégories pour les carrousels
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")
    .returns<any[]>();

  // Films tendances pour le hero (top 5 par rating et récents)
  const trendingMedia =
    allMedia
      ?.filter((m) => m.rating && m.rating >= 7) // Minimum 7/10
      .sort((a, b) => {
        // Trier par rating puis par date
        const ratingDiff = (b.rating || 0) - (a.rating || 0);
        if (ratingDiff !== 0) return ratingDiff;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      })
      .slice(0, 5) || [];

  // Si pas assez de films avec rating élevé, prendre les plus récents
  if (trendingMedia.length < 3) {
    const recentMedia = allMedia?.slice(0, 5) || [];
    trendingMedia.push(
      ...recentMedia.filter((m) => !trendingMedia.includes(m))
    );
  }

  // Grouper les médias par type
  const movies = allMedia?.filter((m) => m.type === "movie") || [];
  const tvShows = allMedia?.filter((m) => m.type === "tv") || [];

  // Grouper par catégories avec les médias réels
  const mediaByCategory = await Promise.all(
    categories?.map(async (cat) => {
      const { data: mediaCategories } = await supabase
        .from("media_categories")
        .select(
          `
          media (
            id,
            title,
            slug,
            description,
            poster_url,
            type,
            year,
            rating,
            status
          )
        `
        )
        .eq("category_id", cat.id)
        .limit(12);

      const items =
        mediaCategories
          ?.map((mc: any) => mc.media)
          .filter((m: any) => m && m.status === "published") || [];

      return {
        category: cat,
        items,
      };
    }) || []
  );

  return (
    <div className="animate-fade-in">
      {/* Hero Banner avec carousel */}
      {trendingMedia.length > 0 && <HeroCarousel items={trendingMedia} />}

      {/* Carrousels de contenu */}
      <div className="container mx-auto px-4 space-y-12 py-12">
        {/* Films */}
        {movies.length > 0 && <MediaCarousel title="Films" items={movies} />}

        {/* Séries */}
        {tvShows.length > 0 && (
          <MediaCarousel title="Séries TV" items={tvShows} />
        )}

        {/* Par catégorie */}
        {mediaByCategory?.map(
          (cat) =>
            cat.items.length > 0 && (
              <MediaCarousel
                key={cat.category.id}
                title={cat.category.name}
                items={cat.items}
                viewAllHref={`/category/${cat.category.slug}`}
              />
            )
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
