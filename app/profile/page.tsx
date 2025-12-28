import { redirect } from "next/navigation";
import Link from "next/link";
import { Film, Heart, Clock, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import MediaCard from "@/components/MediaCard";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Récupérer le profil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Récupérer les favoris
  const { data: favorites } = await supabase
    .from("user_favorites")
    .select(
      `
      media (
        id,
        title,
        slug,
        poster_url,
        type,
        year,
        rating,
        status
      )
    `
    )
    .eq("user_id", user.id)
    .order("added_at", { ascending: false });

  // Récupérer l'historique
  const { data: watchHistory } = await supabase
    .from("watch_history")
    .select(
      `
      media (
        id,
        title,
        slug,
        poster_url,
        type,
        year,
        rating,
        status
      ),
      watched_at,
      completed
    `
    )
    .eq("user_id", user.id)
    .order("watched_at", { ascending: false })
    .limit(12);

  // Récupérer les notes de l'utilisateur
  const { data: userRatings, count: ratingsCount } = await supabase
    .from("user_ratings")
    .select("rating", { count: "exact" })
    .eq("user_id", user.id);

  const avgUserRating =
    userRatings && userRatings.length > 0
      ? userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length
      : 0;

  const favoriteMedia = favorites?.map((f: any) => f.media).filter((m) => m) || [];
  const watchedMedia =
    watchHistory?.map((w: any) => w.media).filter((m) => m) || [];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header du profil */}
        <div className="bg-secondary p-8 rounded-lg mb-8">
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {(profile?.username || user.email || "U")[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {profile?.username || user.email}
              </h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-background p-4 rounded-lg text-center">
              <Heart className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{favoriteMedia.length}</div>
              <div className="text-sm text-muted-foreground">Favoris</div>
            </div>
            <div className="bg-background p-4 rounded-lg text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{watchedMedia.length}</div>
              <div className="text-sm text-muted-foreground">Vus</div>
            </div>
            <div className="bg-background p-4 rounded-lg text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{ratingsCount || 0}</div>
              <div className="text-sm text-muted-foreground">Notes</div>
            </div>
            <div className="bg-background p-4 rounded-lg text-center">
              <Film className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">
                {avgUserRating > 0 ? avgUserRating.toFixed(1) : "—"}
              </div>
              <div className="text-sm text-muted-foreground">Moy. notes</div>
            </div>
          </div>
        </div>

        {/* Mes favoris */}
        {favoriteMedia.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Ma liste</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {favoriteMedia.map((media: any) => (
                <MediaCard key={media.id} media={media} />
              ))}
            </div>
          </div>
        )}

        {/* Historique de visionnage */}
        {watchedMedia.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Récemment vus</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {watchedMedia.map((media: any) => (
                <MediaCard key={media.id} media={media} />
              ))}
            </div>
          </div>
        )}

        {/* État vide */}
        {favoriteMedia.length === 0 && watchedMedia.length === 0 && (
          <div className="text-center py-20">
            <Film className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">
              Votre profil est encore vide
            </h3>
            <p className="text-muted-foreground mb-6">
              Commencez à explorer notre catalogue et ajoutez des contenus à
              votre liste !
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              Découvrir le catalogue
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
