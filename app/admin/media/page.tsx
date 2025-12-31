import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import MediaList from "@/components/MediaList";

export const metadata = {
  title: "Gestion des médias - Admin",
};

export default async function MediaListPage() {
  const supabase = await createClient();

  const { data: media } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<any[]>();

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des médias</h1>
          <p className="text-muted-foreground">
            Gérez tous vos films et séries
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/media/new?type=movie"
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Ajouter un film</span>
          </Link>
          <Link
            href="/admin/media/new?type=tv"
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Ajouter une série</span>
          </Link>
        </div>
      </div>

      {/* Liste des médias */}
      <MediaList initialMedia={media || []} />
    </div>
  );
}
