"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Film, Tv, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

function EditMediaForm({ id }: { id: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    type: "movie" as "movie" | "tv",
    year: "",
    duration: "",
    rating: "",
    poster_url: "",
    backdrop_url: "",
    embed_url: "",
    status: "published" as "published" | "draft",
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    loadMedia();
    loadCategories();
  }, [id]);

  async function loadMedia() {
    const { data: media } = await supabase
      .from("media")
      .select("*")
      .eq("id", id)
      .single();

    if (media) {
      setFormData({
        title: media.title || "",
        slug: media.slug || "",
        description: media.description || "",
        type: media.type || "movie",
        year: media.year?.toString() || "",
        duration: media.duration?.toString() || "",
        rating: media.rating?.toString() || "",
        poster_url: media.poster_url || "",
        backdrop_url: media.backdrop_url || "",
        embed_url: media.embed_url || "",
        status: media.status || "published",
      });

      // Charger les catégories du média
      const { data: mediaCategories } = await supabase
        .from("media_categories")
        .select("category_id")
        .eq("media_id", id);

      if (mediaCategories) {
        setSelectedCategories(mediaCategories.map((mc: any) => mc.category_id));
      }
    }
  }

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    if (data) setCategories(data);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Préparer les données avec conversion des nombres
      const mediaData = {
        ...formData,
        year: formData.year ? parseInt(formData.year) : null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        rating: formData.rating ? parseFloat(formData.rating) : null,
      };

      // Mettre à jour le média
      const { error: mediaError } = await supabase
        .from("media")
        .update(mediaData)
        .eq("id", id);

      if (mediaError) throw mediaError;

      // Supprimer les anciennes associations de catégories
      await supabase.from("media_categories").delete().eq("media_id", id);

      // Ajouter les nouvelles catégories
      if (selectedCategories.length > 0) {
        const categoryInserts = selectedCategories.map((categoryId) => ({
          media_id: id,
          category_id: categoryId,
        }));

        const { error: categoriesError } = await supabase
          .from("media_categories")
          .insert(categoryInserts);

        if (categoriesError) throw categoriesError;
      }

      alert("Média modifié avec succès !");
      router.push("/admin/media");
    } catch (error: any) {
      alert("Erreur : " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/admin/media"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Link>
        <h1 className="text-3xl font-bold">Modifier le média</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        {/* Type */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "movie" })}
            className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
              formData.type === "movie"
                ? "border-red-500 bg-red-500/10"
                : "border-border hover:border-red-500/50"
            }`}
          >
            <Film className="h-8 w-8 mx-auto mb-2" />
            <span className="font-semibold">Film</span>
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: "tv" })}
            className={`flex-1 p-4 rounded-lg border-2 transition-colors ${
              formData.type === "tv"
                ? "border-red-500 bg-red-500/10"
                : "border-border hover:border-red-500/50"
            }`}
          >
            <Tv className="h-8 w-8 mx-auto mb-2" />
            <span className="font-semibold">Série TV</span>
          </button>
        </div>

        {/* Informations de base */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Titre *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug *</label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full px-4 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Année (ex: 2025)
              </label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className="w-full px-4 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Durée (en minutes, ex: 150)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                className="w-full px-4 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Note (ex: 8.5)
            </label>
            <input
              type="text"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: e.target.value })
              }
              className="w-full px-4 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>

        {/* URLs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              URL du poster *
            </label>
            <input
              type="url"
              required
              value={formData.poster_url}
              onChange={(e) =>
                setFormData({ ...formData, poster_url: e.target.value })
              }
              className="w-full px-4 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              URL du backdrop
            </label>
            <input
              type="url"
              value={formData.backdrop_url}
              onChange={(e) =>
                setFormData({ ...formData, backdrop_url: e.target.value })
              }
              className="w-full px-4 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              URL de la vidéo (embed)
            </label>
            <input
              type="url"
              value={formData.embed_url}
              onChange={(e) =>
                setFormData({ ...formData, embed_url: e.target.value })
              }
              className="w-full px-4 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Laisser vide pour conserver l'URL actuelle"
            />
          </div>
        </div>

        {/* Catégories */}
        <div>
          <label className="block text-sm font-medium mb-2">Catégories</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryToggle(category.id)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategories.includes(category.id)
                    ? "bg-red-500 text-white"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-medium mb-2">Statut</label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as "published" | "draft",
              })
            }
            className="w-full px-4 py-2 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
          </select>
        </div>

        {/* Boutons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <Save className="h-5 w-5 mr-2" />
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
          <Link
            href="/admin/media"
            className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg font-semibold transition-colors"
          >
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function EditMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <p>Chargement du formulaire...</p>
        </div>
      }
    >
      <EditMediaForm id={id} />
    </Suspense>
  );
}
