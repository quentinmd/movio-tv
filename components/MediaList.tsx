"use client";

import { useState } from "react";
import Link from "next/link";
import { Film, Tv, Edit, Trash2, List } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Media {
  id: string;
  title: string;
  type: "movie" | "tv";
  status: "published" | "draft" | "archived";
  year?: number;
  rating?: number;
}

interface MediaListProps {
  initialMedia: Media[];
}

export default function MediaList({ initialMedia }: MediaListProps) {
  const [media, setMedia] = useState(initialMedia);
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (item: Media) => {
    const confirmed = confirm(
      `Êtes-vous sûr de vouloir supprimer "${item.title}" ?\n\n` +
        `${
          item.type === "tv"
            ? "⚠️ Toutes les saisons et épisodes seront également supprimés."
            : ""
        }`
    );

    if (!confirmed) return;

    setDeleting(item.id);

    try {
      const supabase = createClient();

      const { error } = await supabase.from("media").delete().eq("id", item.id);

      if (error) throw error;

      // Mettre à jour la liste locale
      setMedia(media.filter((m) => m.id !== item.id));

      // Rafraîchir la page
      router.refresh();
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression: " + error.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
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
                    {item.type === "tv" && (
                      <Link
                        href={`/admin/media/${item.id}/seasons`}
                        className="p-2 hover:bg-purple-500/10 hover:text-purple-500 rounded-lg transition-colors"
                        title="Gérer les saisons"
                      >
                        <List className="h-4 w-4" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/media/${item.id}/edit`}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item)}
                      disabled={deleting === item.id}
                      className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Supprimer"
                    >
                      {deleting === item.id ? (
                        <span className="inline-block animate-spin">⏳</span>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
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
  );
}
