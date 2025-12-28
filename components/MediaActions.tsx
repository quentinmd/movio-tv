"use client";

import { useState, useEffect } from "react";
import { Heart, Check, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface MediaActionsProps {
  mediaId: string;
}

export default function MediaActions({ mediaId }: MediaActionsProps) {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isLoading, setIsLoading] = useState({
    favorite: false,
    watched: false,
  });

  useEffect(() => {
    loadUserData();
  }, [mediaId]);

  async function loadUserData() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setUserId(user.id);

    // Vérifier si c'est un favori
    const { data: favoriteData } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("media_id", mediaId)
      .single();

    setIsFavorite(!!favoriteData);

    // Vérifier si déjà vu
    const { data: watchData } = await supabase
      .from("watch_history")
      .select("completed")
      .eq("user_id", user.id)
      .eq("media_id", mediaId)
      .single();

    setIsWatched(watchData?.completed || false);
  }

  async function toggleFavorite() {
    if (!userId) {
      window.location.href = "/login?redirect=" + window.location.pathname;
      return;
    }

    setIsLoading({ ...isLoading, favorite: true });

    try {
      if (isFavorite) {
        // Retirer des favoris
        await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", userId)
          .eq("media_id", mediaId);
        setIsFavorite(false);
      } else {
        // Ajouter aux favoris
        await supabase.from("user_favorites").insert({
          user_id: userId,
          media_id: mediaId,
        });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setIsLoading({ ...isLoading, favorite: false });
    }
  }

  async function toggleWatched() {
    if (!userId) {
      window.location.href = "/login?redirect=" + window.location.pathname;
      return;
    }

    setIsLoading({ ...isLoading, watched: true });

    try {
      if (isWatched) {
        // Retirer de l'historique
        await supabase
          .from("watch_history")
          .delete()
          .eq("user_id", userId)
          .eq("media_id", mediaId);
        setIsWatched(false);
      } else {
        // Marquer comme vu
        await supabase.from("watch_history").upsert({
          user_id: userId,
          media_id: mediaId,
          completed: true,
          watched_at: new Date().toISOString(),
        });
        setIsWatched(true);
      }
    } catch (err) {
      console.error("Error toggling watched:", err);
    } finally {
      setIsLoading({ ...isLoading, watched: false });
    }
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Bouton Favoris */}
      <button
        onClick={toggleFavorite}
        disabled={isLoading.favorite}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
          isFavorite
            ? "bg-red-600 text-white hover:bg-red-700"
            : "bg-secondary hover:bg-secondary/80"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Heart className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`} />
        <span>{isFavorite ? "Favoris" : "Ma liste"}</span>
      </button>

      {/* Bouton Vu */}
      <button
        onClick={toggleWatched}
        disabled={isLoading.watched}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
          isWatched
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-secondary hover:bg-secondary/80"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isWatched ? "Marquer comme non vu" : "Marquer comme vu"}
      >
        {isWatched ? (
          <>
            <Check className="h-5 w-5" />
            <span>Vu</span>
          </>
        ) : (
          <>
            <Plus className="h-5 w-5" />
            <span>Marquer vu</span>
          </>
        )}
      </button>
    </div>
  );
}
