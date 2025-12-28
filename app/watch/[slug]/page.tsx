import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, Calendar, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import VideoPlayer from "@/components/VideoPlayer";
import TVShowPlayer from "@/components/TVShowPlayer";
import { formatDuration } from "@/lib/utils";

interface WatchPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: WatchPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: media } = (await supabase
    .from("media")
    .select("title, description, poster_url, backdrop_url, year, rating, type")
    .eq("slug", slug)
    .single()) as { data: any };

  if (!media) {
    return {
      title: "Contenu non trouvé - Movio TV",
    };
  }

  const title = `${media.title} - Movio TV`;
  const description = media.description || `Regardez ${media.title} sur Movio TV`;
  const imageUrl = media.backdrop_url || media.poster_url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'video.movie',
      url: `https://movio-tv.vercel.app/watch/${slug}`,
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: media.title,
        }
      ] : [],
      siteName: 'Movio TV',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Récupérer le média
  const { data: media } = (await supabase
    .from("media")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()) as { data: any };

  if (!media) {
    notFound();
  }

  // Si c'est une série, récupérer les saisons et épisodes
  let seasons: any[] = [];
  if (media.type === "tv") {
    const { data: seasonsData } = await supabase
      .from("seasons")
      .select(
        `
        *,
        episodes (
          *
        )
      `
      )
      .eq("media_id", media.id)
      .order("season_number", { ascending: true })
      .returns<any[]>();

    seasons = seasonsData || [];

    // Trier les épisodes dans chaque saison
    seasons = seasons.map((season) => ({
      ...season,
      episodes: (season.episodes || []).sort(
        (a: any, b: any) => a.episode_number - b.episode_number
      ),
    }));
  }

  // Récupérer les catégories
  const { data: mediaCategories } = await supabase
    .from("media_categories")
    .select(
      `
      categories (
        id,
        name,
        slug
      )
    `
    )
    .eq("media_id", media.id);

  const categories = mediaCategories?.map((mc: any) => mc.categories) || [];

  // JSON-LD pour SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': media.type === 'movie' ? 'Movie' : 'TVSeries',
    name: media.title,
    description: media.description,
    image: media.poster_url,
    datePublished: media.year ? `${media.year}-01-01` : undefined,
    aggregateRating: media.rating ? {
      '@type': 'AggregateRating',
      ratingValue: media.rating,
      bestRating: 10,
    } : undefined,
    genre: categories.map((c: any) => c.name),
  };

  return (
    <>
      {/* Données structurées JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen">
      {/* Backdrop header */}
      <div className="relative w-full h-[300px] md:h-[400px]">
        {media.backdrop_url && (
          <>
            <Image
              src={media.backdrop_url}
              alt={media.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          </>
        )}
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster (sur mobile seulement) */}
          <div className="lg:hidden">
            {media.poster_url && (
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={media.poster_url}
                  alt={media.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Zone de lecture */}
          <div className="lg:col-span-2 space-y-6">
            {media.type === "movie" && media.embed_url ? (
              <VideoPlayer embedUrl={media.embed_url} title={media.title} />
            ) : media.type === "tv" && seasons.length > 0 ? (
              <TVShowPlayer title={media.title} seasons={seasons} />
            ) : (
              <div className="bg-secondary p-8 rounded-lg text-center">
                <p className="text-muted-foreground">
                  Contenu non disponible pour le moment
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - Informations */}
          <div className="space-y-6">
            {/* Poster (desktop) */}
            <div className="hidden lg:block">
              {media.poster_url && (
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                  <Image
                    src={media.poster_url}
                    alt={media.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Détails */}
            <div className="bg-secondary p-6 rounded-lg space-y-4">
              <h1 className="text-3xl font-bold">{media.title}</h1>

              {/* Métadonnées */}
              <div className="flex flex-wrap gap-4 text-sm">
                {media.year && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{media.year}</span>
                  </div>
                )}
                {media.duration && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDuration(media.duration)}</span>
                  </div>
                )}
                {media.rating && (
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>{media.rating.toFixed(1)}/10</span>
                  </div>
                )}
              </div>

              {/* Type */}
              <div>
                <span className="inline-block px-3 py-1 bg-red-600 text-white text-sm rounded-full">
                  {media.type === "movie" ? "Film" : "Série TV"}
                </span>
              </div>

              {/* Catégories */}
              {categories.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat: any) => (
                      <span
                        key={cat.id}
                        className="px-3 py-1 bg-background rounded-full text-sm"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {media.description && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-muted-foreground">
                    Synopsis
                  </h3>
                  <p className="text-sm leading-relaxed">{media.description}</p>
                </div>
              )}

              {/* Statistiques pour les séries */}
              {media.type === "tv" && seasons.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-red-500">
                        {seasons.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {seasons.length > 1 ? "Saisons" : "Saison"}
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-500">
                        {seasons.reduce(
                          (acc, s) => acc + (s.episodes?.length || 0),
                          0
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Épisodes
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
