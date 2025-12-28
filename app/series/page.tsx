import { createClient } from "@/lib/supabase/server";
import MediaCarousel from "@/components/MediaCarousel";

export const metadata = {
  title: "Séries - Movio TV",
  description: "Découvrez notre collection de séries TV",
};

export default async function SeriesPage() {
  const supabase = createClient();

  const { data: series } = await supabase
    .from("media")
    .select("*")
    .eq("type", "tv")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Séries TV</h1>

      {series && series.length > 0 ? (
        <div className="space-y-12">
          <MediaCarousel title="Toutes les séries" items={series} />

          <MediaCarousel
            title="Les mieux notées"
            items={[...series].sort(
              (a, b) => (b.rating || 0) - (a.rating || 0)
            )}
          />

          <MediaCarousel
            title="Ajoutées récemment"
            items={series.slice(0, 12)}
          />
        </div>
      ) : (
        <p className="text-muted-foreground">
          Aucune série disponible pour le moment.
        </p>
      )}
    </div>
  );
}
