import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Film, Tv, Edit, Trash2 } from "lucide-react";

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

      {/* Tableau des médias */}
      <div className="bg-secondary rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">Titre</th>
              <th className="text-left px-6 py-4 font-semibold">Type</th>
              <th className="text-left px-6 py-4 font-semibold">Statut</th>
              <th className="text-left px-6 py-4 font-semibold">Année</th>
              <th className="text-left px-6 py-4 font-semibold">Note</th>
              <th className="text-right px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {media && media.length > 0 ? (
              media.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border last:border-0 hover:bg-background/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      {item.type === "movie" ? (
                        <Film className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Tv className="h-5 w-5 text-purple-500" />
                      )}
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">
                      {item.type === "movie" ? "Film" : "Série"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs rounded-full ${
                        item.status === "published"
                          ? "bg-green-500/10 text-green-500"
                          : item.status === "draft"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-gray-500/10 text-gray-500"
                      }`}
                    >
                      {item.status === "published"
                        ? "Publié"
                        : item.status === "draft"
                        ? "Brouillon"
                        : "Archivé"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{item.year || "-"}</td>
                  <td className="px-6 py-4 text-sm">
                    {item.rating ? `${item.rating.toFixed(1)}/10` : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/admin/media/${item.id}/edit`}
                        className="p-2 hover:bg-background rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  Aucun média pour le moment. Commencez par en ajouter un !
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
