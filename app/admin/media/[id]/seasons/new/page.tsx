"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Film, Calendar, FileText, Image } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NewSeasonPage({ params }: PageProps) {
  const [seriesId, setSeriesId] = useState<string>("");
  const [seasonNumber, setSeasonNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Récupérer l'ID de la série depuis les params
  useState(() => {
    params.then((p) => setSeriesId(p.id));
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase.from("seasons").insert({
        media_id: seriesId,
        season_number: parseInt(seasonNumber),
        title: title || null,
        description: description || null,
        poster_url: posterUrl || null,
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
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg">
          <Film className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Nouvelle saison</h1>
          <p className="text-muted-foreground">Ajouter une saison à la série</p>
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
              <span>Numéro de saison</span>
            </label>
            <input
              type="number"
              min="1"
              value={seasonNumber}
              onChange={(e) => setSeasonNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="1, 2, 3..."
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 mb-2 font-medium">
              <FileText className="h-4 w-4" />
              <span>Titre (optionnel)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Ex: La première saison"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Si vide, s&apos;affichera comme &quot;Saison X&quot;
            </p>
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
              placeholder="Synopsis de la saison..."
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 mb-2 font-medium">
              <Image className="h-4 w-4" />
              <span>URL du poster</span>
            </label>
            <input
              type="url"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="https://..."
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

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !seasonNumber}
            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {loading ? "Création..." : "Créer la saison"}
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
