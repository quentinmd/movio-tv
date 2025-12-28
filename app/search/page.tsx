import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import MediaCard from "@/components/MediaCard";
import { Film } from "lucide-react";

async function SearchResults({ query }: { query: string }) {
  const supabase = await createClient();

  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Entrez un terme de recherche pour trouver des films et séries
        </p>
      </div>
    );
  }

  const { data: media } = await supabase
    .from("media")
    .select("*")
    .eq("status", "published")
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .returns<any[]>();

  if (!media || media.length === 0) {
    return (
      <div className="text-center py-12">
        <Film className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Aucun résultat</h2>
        <p className="text-muted-foreground">
          Aucun contenu trouvé pour &quot;{query}&quot;
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="text-muted-foreground mb-8">
        {media.length} résultat{media.length > 1 ? "s" : ""} pour &quot;{query}
        &quot;
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {media.map((item) => (
          <MediaCard key={item.id} media={item} />
        ))}
      </div>
    </>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Résultats de recherche
        {query && ` : "${query}"`}
      </h1>

      <Suspense
        fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-secondary rounded-lg animate-pulse"
              />
            ))}
          </div>
        }
      >
        <SearchResults query={query} />
      </Suspense>
    </div>
  );
}
