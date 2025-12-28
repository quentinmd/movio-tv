import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import VideoPlayer from "@/components/VideoPlayer";
import TVShowPlayer from "@/components/TVShowPlayer";
import RatingSystem from "@/components/RatingSystem";
import MediaActions from "@/components/MediaActions";
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
  const description =
    media.description || `Regardez ${media.title} sur Movio TV`;
  const imageUrl = media.backdrop_url || media.poster_url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "video.movie",
      url: `https://movio-tv.vercel.app/watch/${slug}`,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: media.title,
            },
          ]
        : [],
      siteName: "Movio TV",
    },
    twitter: {
      card: "summary_large_image",
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
    "@context": "https://schema.org",
    "@type": media.type === "movie" ? "Movie" : "TVSeries",
    name: media.title,
    description: media.description,
    image: media.poster_url,
    datePublished: media.year ? `${media.year}-01-01` : undefined,
    aggregateRating: media.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: media.rating,
          bestRating: 10,
        }
      : undefined,
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
        {/* Backdrop header avec titre */}
        <div className="relative w-full h-[400px] md:h-[500px]">
          {media.backdrop_url && (
            <>
              <Image
                src={media.backdrop_url}
                alt={media.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
            </>
          )}

          {/* Titre et métadonnées en overlay */}
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-2xl">
                {media.title}
              </h1>

              {/* Métadonnées principales */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {media.year && (
                  <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">{media.year}</span>
                  </div>
                )}
                {media.duration && (
                  <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {formatDuration(media.duration)}
                    </span>
                  </div>
                )}
                {media.rating && (
                  <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-medium">
                      {media.rating.toFixed(1)}/10
                    </span>
                  </div>
                )}
                <span className="inline-block px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-full">
                  {media.type === "movie" ? "Film" : "Série TV"}
                </span>
              </div>

              {/* Genres */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat: any) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm hover:bg-white/20 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Colonne principale - Vidéo et description */}
            <div className="lg:col-span-3 space-y-6">
              {/* Lecteur vidéo */}
              <div className="w-full">
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

              {/* Synopsis */}
              {media.description && (
                <div className="bg-secondary p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-3">Synopsis</h2>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {media.description}
                  </p>
                </div>
              )}

              {/* Actions utilisateur */}
              <div className="bg-secondary p-6 rounded-lg space-y-6">
                <h2 className="text-xl font-bold">Actions</h2>
                <MediaActions mediaId={media.id} />
              </div>

              {/* Système de notation */}
              <div className="bg-secondary p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Votre avis</h2>
                <RatingSystem
                  mediaId={media.id}
                  currentRating={media.rating}
                />
              </div>
            </div>

            {/* Sidebar - Poster et statistiques */}
            <div className="space-y-6">
              {/* Poster */}
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

              {/* Statistiques pour les séries */}
              {media.type === "tv" && seasons.length > 0 && (
                <div className="bg-secondary p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-4">Statistiques</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Saisons</span>
                      <span className="text-2xl font-bold text-red-500">
                        {seasons.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Épisodes</span>
                      <span className="text-2xl font-bold text-red-500">
                        {seasons.reduce(
                          (acc, s) => acc + (s.episodes?.length || 0),
                          0
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
