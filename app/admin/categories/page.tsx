"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "" });
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    setCategories(data || []);
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      name,
      slug: generateSlug(name),
    });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.slug) return;

    setIsLoading(true);
    try {
      if (editingId) {
        // Modifier
        await supabase.from("categories").update(formData).eq("id", editingId);
      } else {
        // Créer
        await supabase.from("categories").insert(formData);
      }

      await loadCategories();
      resetForm();
      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setFormData({ name: category.name, slug: category.slug });
    setIsAdding(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer la catégorie "${name}" ?`)) return;

    setIsLoading(true);
    try {
      await supabase.from("categories").delete().eq("id", id);
      await loadCategories();
      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de supprimer cette catégorie");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: "", slug: "" });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des catégories</h1>
          <p className="text-muted-foreground">
            Gérez les genres de votre plateforme
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Nouvelle catégorie</span>
          </button>
        )}
      </div>

      {/* Formulaire d'ajout/édition */}
      {isAdding && (
        <div className="bg-secondary p-6 rounded-lg border border-border space-y-4">
          <h3 className="text-lg font-semibold">
            {editingId ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ex: Action"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ex: action"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={resetForm}
              className="flex items-center space-x-2 px-4 py-2 bg-background hover:bg-background/70 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Annuler</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading || !formData.name || !formData.slug}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              <span>{isLoading ? "Enregistrement..." : "Enregistrer"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Liste des catégories */}
      <div className="bg-secondary rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="text-left px-6 py-4 font-semibold">Nom</th>
              <th className="text-left px-6 py-4 font-semibold">Slug</th>
              <th className="text-left px-6 py-4 font-semibold">
                Date de création
              </th>
              <th className="text-right px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-border last:border-0 hover:bg-background/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{category.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {new Date(category.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 hover:bg-background rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
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
                  colSpan={4}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  Aucune catégorie pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
