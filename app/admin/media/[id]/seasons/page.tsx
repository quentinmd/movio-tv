import { createClient } from "@/lib/supabase/server";
import { Film, Plus, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ManageSeasonsPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Récupérer la série
  const { data: series } = await supabase
    .from("media")
    .select("*")
    .eq("id", id)
    .eq("type", "tv")
    .single();

  if (!series) {
    notFound();
  }

  // Récupérer les saisons avec leurs épisodes
  const { data: seasons } = await supabase
    .from("seasons")
    .select(
      `
      *,
      episodes:episodes(*)
    `
    )
    .eq("media_id", id)
    .order("season_number", { ascending: true });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg">
            <Film className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{series.title}</h1>
            <p className="text-muted-foreground">
              Gestion des saisons et épisodes
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href={`/admin/media/${id}/seasons/new`}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Ajouter une saison</span>
          </Link>
          <Link
            href="/admin/media"
            className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors"
          >
            ← Retour
          </Link>
        </div>
      </div>

      {/* Liste des saisons */}
      {!seasons || seasons.length === 0 ? (
        <div className="text-center py-20">
          <Film className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Aucune saison</h2>
          <p className="text-muted-foreground mb-6">
            Commencez par ajouter la première saison de cette série
          </p>
          <Link
            href={`/admin/media/${id}/seasons/new`}
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
          >
            Ajouter la Saison 1
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {seasons.map((season: any) => (
            <div
              key={season.id}
              className="bg-secondary/50 p-6 rounded-lg border border-border"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Saison {season.season_number}
                    {season.title && ` - ${season.title}`}
                  </h3>
                  {season.description && (
                    <p className="text-muted-foreground mb-3">
                      {season.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {season.release_date && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(season.release_date).toLocaleDateString(
                            "fr-FR"
                          )}
                        </span>
                      </div>
                    )}
                    <span>
                      {season.episode_count || 0} épisode
                      {season.episode_count !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/media/${id}/seasons/${season.id}/episodes/new`}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Ajouter épisode</span>
                  </Link>
                  <Link
                    href={`/admin/media/${id}/seasons/${season.id}/edit`}
                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
                  >
                    Modifier
                  </Link>
                </div>
              </div>

              {/* Liste des épisodes */}
              {season.episodes && season.episodes.length > 0 ? (
                <div className="grid gap-3 mt-4">
                  {season.episodes
                    .sort(
                      (a: any, b: any) => a.episode_number - b.episode_number
                    )
                    .map((episode: any) => (
                      <div
                        key={episode.id}
                        className="bg-background p-4 rounded-lg flex items-start justify-between"
                      >
                        <div className="flex items-start space-x-4">
                          {episode.thumbnail_url && (
                            <img
                              src={episode.thumbnail_url}
                              alt={episode.title}
                              className="w-32 h-20 object-cover rounded"
                            />
                          )}
                          <div>
                            <h4 className="font-semibold">
                              Épisode {episode.episode_number} - {episode.title}
                            </h4>
                            {episode.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {episode.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-3 text-xs text-muted-foreground mt-2">
                              {episode.duration && (
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{episode.duration} min</span>
                                </div>
                              )}
                              {episode.release_date && (
                                <span>
                                  {new Date(
                                    episode.release_date
                                  ).toLocaleDateString("fr-FR")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/admin/media/${id}/seasons/${season.id}/episodes/${episode.id}/edit`}
                          className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded text-sm transition-colors"
                        >
                          Modifier
                        </Link>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-background rounded-lg mt-4">
                  <p className="text-muted-foreground text-sm">
                    Aucun épisode dans cette saison
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
