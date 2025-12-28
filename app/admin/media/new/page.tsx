"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import {
  movieSchema,
  tvShowSchema,
  MovieFormData,
  TVShowFormData,
} from "@/lib/validations/media";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewMediaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mediaType = (searchParams.get("type") as "movie" | "tv") || "movie";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MovieFormData | TVShowFormData>({
    resolver: zodResolver(mediaType === "movie" ? movieSchema : tvShowSchema),
    defaultValues: {
      status: "draft",
      categories: [],
    },
  });

  // Charger les catégories
  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      setCategories(data || []);
    }
    loadCategories();
  }, []);

  const selectedCategories = watch("categories") || [];

  const toggleCategory = (categoryId: string) => {
    const current = selectedCategories as string[];
    if (current.includes(categoryId)) {
      setValue(
        "categories",
        current.filter((id) => id !== categoryId)
      );
    } else {
      setValue("categories", [...current, categoryId]);
    }
  };

  const onSubmit = async (data: MovieFormData | TVShowFormData) => {
    setIsSubmitting(true);
    try {
      // Créer le média
      const { data: media, error: mediaError } = await supabase
        .from("media")
        .insert({
          ...data,
          type: mediaType,
          embed_url:
            mediaType === "movie" ? (data as MovieFormData).embed_url : null,
          duration:
            mediaType === "movie" ? (data as MovieFormData).duration : null,
        })
        .select()
        .single();

      if (mediaError) throw mediaError;

      // Associer les catégories
      if (media && data.categories.length > 0) {
        const mediaCategories = data.categories.map((categoryId) => ({
          media_id: media.id,
          category_id: categoryId,
        }));

        await supabase.from("media_categories").insert(mediaCategories);
      }

      router.push("/admin/media");
      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/media"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </Link>
          <h1 className="text-3xl font-bold">
            Ajouter un {mediaType === "movie" ? "film" : "série"}
          </h1>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-secondary p-6 rounded-lg border border-border space-y-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              type="text"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Entrez le titre"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Entrez la description"
            />
          </div>

          {/* URLs des images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                URL du poster
              </label>
              <input
                {...register("poster_url")}
                type="url"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="https://..."
              />
              {errors.poster_url && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.poster_url.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                URL du backdrop
              </label>
              <input
                {...register("backdrop_url")}
                type="url"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="https://..."
              />
              {errors.backdrop_url && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.backdrop_url.message}
                </p>
              )}
            </div>
          </div>

          {/* Embed URL (films uniquement) */}
          {mediaType === "movie" && (
            <div>
              <label className="block text-sm font-semibold mb-2">
                Lien de lecture (Lulustream){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                {...register("embed_url" as any)}
                type="url"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="https://lulustream.com/..."
              />
              {errors.embed_url && (
                <p className="mt-1 text-sm text-red-500">
                  {(errors as any).embed_url.message}
                </p>
              )}
            </div>
          )}

          {/* Métadonnées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Année</label>
              <input
                {...register("year")}
                type="number"
                min="1900"
                max="2100"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="2024"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Note (/10)
              </label>
              <input
                {...register("rating")}
                type="number"
                step="0.1"
                min="0"
                max="10"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="7.5"
              />
            </div>

            {mediaType === "movie" && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Durée (minutes)
                </label>
                <input
                  {...register("duration" as any)}
                  type="number"
                  min="1"
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="120"
                />
              </div>
            )}
          </div>

          {/* Catégories */}
          <div>
            <label className="block text-sm font-semibold mb-3">
              Catégories <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategories.includes(category.id)
                      ? "bg-red-600 text-white"
                      : "bg-background hover:bg-background/70"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            {errors.categories && (
              <p className="mt-2 text-sm text-red-500">
                {errors.categories.message}
              </p>
            )}
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Statut <span className="text-red-500">*</span>
            </label>
            <select
              {...register("status")}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/media"
            className="px-6 py-2 bg-secondary hover:bg-secondary/70 rounded-lg transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            <span>{isSubmitting ? "Enregistrement..." : "Enregistrer"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
