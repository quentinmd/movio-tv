"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface RatingSystemProps {
  mediaId: string;
  currentRating?: number;
  totalRatings?: number;
}

export default function RatingSystem({
  mediaId,
  currentRating = 0,
  totalRatings = 0,
}: RatingSystemProps) {
  const supabase = createClient();
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(currentRating);
  const [ratingCount, setRatingCount] = useState(totalRatings);

  useEffect(() => {
    loadUserRating();
    loadRatingStats();
  }, [mediaId]);

  async function loadUserRating() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    setUserId(user.id);

    const { data } = await supabase
      .from("user_ratings")
      .select("rating")
      .eq("user_id", user.id)
      .eq("media_id", mediaId)
      .single();

    if (data) {
      setUserRating(data.rating);
    }
  }

  async function loadRatingStats() {
    // Récupérer toutes les notes pour ce média
    const { data, count } = await supabase
      .from("user_ratings")
      .select("rating", { count: "exact" })
      .eq("media_id", mediaId);

    if (data && data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      setAverageRating(avg);
      setRatingCount(count || 0);
    }
  }

  async function handleRate(rating: number) {
    if (!userId) {
      // Rediriger vers la page de connexion
      window.location.href = "/login?redirect=" + window.location.pathname;
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.from("user_ratings").upsert({
        user_id: userId,
        media_id: mediaId,
        rating: rating,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setUserRating(rating);
      await loadRatingStats(); // Recharger les stats
    } catch (err) {
      console.error("Error rating media:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const displayRating = hoveredRating || userRating || 0;

  return (
    <div className="space-y-3">
      {/* Note moyenne */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
          <span className="text-2xl font-bold">
            {averageRating > 0 ? averageRating.toFixed(1) : "—"}
          </span>
          <span className="text-muted-foreground text-sm">/ 10</span>
        </div>
        {ratingCount > 0 && (
          <span className="text-sm text-muted-foreground">
            ({ratingCount} {ratingCount > 1 ? "notes" : "note"})
          </span>
        )}
      </div>

      {/* Interface de notation */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          {userRating
            ? "Votre note"
            : userId
            ? "Notez ce contenu"
            : "Connectez-vous pour noter"}
        </p>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
            <button
              key={rating}
              onClick={() => handleRate(rating)}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(null)}
              disabled={isLoading}
              className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
              aria-label={`Noter ${rating} sur 10`}
            >
              <Star
                className={`h-5 w-5 transition-colors ${
                  rating <= displayRating
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-400"
                }`}
              />
            </button>
          ))}
        </div>
        {userRating && (
          <p className="text-xs text-muted-foreground mt-1">
            Vous avez noté {userRating}/10
          </p>
        )}
      </div>
    </div>
  );
}
