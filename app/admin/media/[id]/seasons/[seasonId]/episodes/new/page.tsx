"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Film, FileText, Link as LinkIcon, Image, Calendar, Clock } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string; seasonId: string }>;
}

export default function NewEpisodePage({ params }: PageProps) {
  const [seriesId, setSeriesId] = useState<string>("");
  const [seasonId, setSeasonId] = useState<string>("");
  const [episodeNumber, setEpisodeNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [embedUrl, setEmbedUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Récupérer les params
  useState(() => {
    params.then((p) => {
      setSeriesId(p.id);
      setSeasonId(p.seasonId);
    });
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase.from("episodes").insert({
        season_id: seasonId,
        episode_number: parseInt(episodeNumber),
        title,
        description: description || null,
        embed_url: embedUrl,
        thumbnail_url: thumbnailUrl || null,
        duration: duration ? parseInt(duration) : null,
        release_date: releaseDate || null,
      });

      if (insertError) throw insertError;

      router.push(`/admin/media/${seriesId}/seasons`);
      router.refresh();
    } catch (err: any) {
      console.error("Erreur:", err);
      setError(err.message || "Une erreur est survenue");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gradient-to-r from-green-600 to-green-500 p-3 rounded-lg">
          <Film className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Nouvel épisode</h1>
          <p className="text-muted-foreground">
            Ajouter un épisode à la saison
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-secondary/50 p-6 rounded-lg space-y-4">
          <div>
            <label className="flex items-center space-x-2 mb-2 font-medium">
              <span className="text-red-500">*</span>
              <span>Numéro d&apos;épisode</span>
            </label>
            <input
              type="number"
              min="1"
              value={episodeNumber}
              onChange={(e) => setEpisodeNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="1, 2, 3..."
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 mb-2 font-medium">
              <FileText className="h-4 w-4" />
              <span className="text-red-500">*</span>
              <span>Titre de l&apos;épisode</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Ex: Le début de l'aventure"
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 mb-2 font-medium">
              <FileText className="h-4 w-4" />
              <span>Description</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-red-600 h-32 resize-none"
              placeholder="Résumé de l'épisode..."
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 mb-2 font-medium">
              <LinkIcon className="h-4 w-4" />
              <span className="text-red-500">*</span>
              <span>Lien vidéo (embed)</span>
            </label>
            <input
              type="url"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="https://voe.sx/e/abc123 ou https://doodstream.com/e/xyz789"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              URL d&apos;embed pour la vidéo (VidGuard, Voe, Doodstream, etc.)
            </p>
          </div>

          <div>
            <label className="flex items-center space-x-2 mb-2 font-medium">
              <Image className="h-4 w-4" />
              <span>Miniature</span>
            </label>
            <input
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 mb-2 font-medium">
                <Clock className="h-4 w-4" />
                <span>Durée (minutes)</span>
              </label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="45"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 mb-2 font-medium">
                <Calendar className="h-4 w-4" />
                <span>Date de sortie</span>
              </label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !episodeNumber || !title || !embedUrl}
            className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {loading ? "Création..." : "Créer l'épisode"}
          </button>
          <Link
            href={`/admin/media/${seriesId}/seasons`}
            className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}
