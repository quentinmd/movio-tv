import { createClient } from "@/lib/supabase/server";
import MediaCarousel from "@/components/MediaCarousel";

export const metadata = {
  title: "Films - Movio TV",
  description: "Découvrez notre collection de films",
};

export default async function MoviesPage() {
  const supabase = await createClient();

  const { data: movies } = await supabase
    .from("media")
    .select("*")
    .eq("type", "movie")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .returns<any[]>();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Films</h1>

      {movies && movies.length > 0 ? (
        <div className="space-y-12">
          <MediaCarousel title="Tous les films" items={movies} />

          <MediaCarousel
            title="Les mieux notés"
            items={[...movies].sort(
              (a, b) => (b.rating || 0) - (a.rating || 0)
            )}
          />

          <MediaCarousel
            title="Ajoutés récemment"
            items={movies.slice(0, 12)}
          />
        </div>
      ) : (
        <p className="text-muted-foreground">
          Aucun film disponible pour le moment.
        </p>
      )}
    </div>
  );
}
