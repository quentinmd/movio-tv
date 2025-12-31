"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import MediaCard from "@/components/MediaCard";
import { Film } from "lucide-react";
import { trackSearch } from "@/lib/analytics";

interface SearchContentProps {
  query: string;
}

export default function SearchContent({ query }: SearchContentProps) {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const supabase = createClient();

      const { data } = await supabase
        .from("media")
        .select("*")
        .eq("status", "published")
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order("created_at", { ascending: false })
        .returns<any[]>();

      setMedia(data || []);
      setLoading(false);

      // Tracker la recherche dans Google Analytics
      if (data) {
        trackSearch(query, data.length);
      }
    };

    fetchResults();
  }, [query]);

  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Entrez un terme de recherche pour trouver des films et séries
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] bg-secondary rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (media.length === 0) {
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
