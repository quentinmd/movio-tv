"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Lightbulb, Check, X, Plus, Film, Tv, ThumbsUp, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";

interface Suggestion {
  id: string;
  title: string;
  type: "movie" | "series";
  description: string | null;
  year: number | null;
  imdb_link: string | null;
  votes: number;
  status: string;
  created_at: string;
  user_id: string;
  profiles?: { username: string };
}

export default function AdminSuggestionsPage() {
  const supabase = createClient();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "added">("pending");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSuggestions();
  }, [filter]);

  async function loadSuggestions() {
    setIsLoading(true);
    
    const { data } = await supabase
      .from("content_suggestions")
      .select(`
        *,
        profiles:user_id (username)
      `)
      .eq("status", filter)
      .order("votes", { ascending: false });

    setSuggestions(data || []);
    setIsLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("content_suggestions")
      .update({ status })
      .eq("id", id);

    if (!error) {
      loadSuggestions();
    }
  }

  async function deleteSuggestion(id: string) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette suggestion ?")) {
      const { error } = await supabase
        .from("content_suggestions")
        .delete()
        .eq("id", id);

      if (!error) {
        loadSuggestions();
      }
    }
  }

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500",
    approved: "bg-green-500/10 text-green-500 border-green-500",
    rejected: "bg-red-500/10 text-red-500 border-red-500",
    added: "bg-blue-500/10 text-blue-500 border-blue-500",
  };

  const statusLabels = {
    pending: "En attente",
    approved: "Approuvée",
    rejected: "Rejetée",
    added: "Ajoutée",
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Suggestions de Contenu</h1>
            <p className="text-muted-foreground">
              Gérer les demandes des utilisateurs
            </p>
          </div>
        </div>

        <Link
          href="/admin"
          className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors"
        >
          ← Retour Admin
        </Link>
      </div>

      {/* Filtres par statut */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "pending" ? "bg-yellow-500 text-black" : "bg-secondary hover:bg-secondary/80"
          }`}
        >
          En attente
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "approved" ? "bg-green-500 text-black" : "bg-secondary hover:bg-secondary/80"
          }`}
        >
          Approuvées
        </button>
        <button
          onClick={() => setFilter("added")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "added" ? "bg-blue-500 text-black" : "bg-secondary hover:bg-secondary/80"
          }`}
        >
          Ajoutées
        </button>
        <button
          onClick={() => setFilter("rejected")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "rejected" ? "bg-red-500 text-black" : "bg-secondary hover:bg-secondary/80"
          }`}
        >
          Rejetées
        </button>
      </div>

      {/* Liste des suggestions */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto" />
        </div>
      ) : suggestions.length === 0 ? (
        <div className="text-center py-20">
          <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Aucune suggestion</h2>
          <p className="text-muted-foreground">
            Aucune suggestion avec le statut "{statusLabels[filter]}"
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="bg-secondary/50 p-6 rounded-lg border border-border"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {suggestion.type === "movie" ? (
                      <Film className="h-5 w-5 text-red-500" />
                    ) : (
                      <Tv className="h-5 w-5 text-red-500" />
                    )}
                    <h3 className="text-xl font-bold">{suggestion.title}</h3>
                    {suggestion.year && (
                      <span className="text-sm text-muted-foreground">({suggestion.year})</span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded border ${statusColors[suggestion.status as keyof typeof statusColors]}`}>
                      {statusLabels[suggestion.status as keyof typeof statusLabels]}
                    </span>
                  </div>

                  {suggestion.description && (
                    <p className="text-muted-foreground mb-3">{suggestion.description}</p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-2">
                      <ThumbsUp className="h-4 w-4" />
                      <span className="font-bold text-foreground">{suggestion.votes}</span>
                      <span>votes</span>
                    </div>
                    <span>•</span>
                    <span>
                      Par <span className="text-foreground font-medium">{suggestion.profiles?.username || "Anonyme"}</span>
                    </span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(suggestion.created_at).toLocaleDateString("fr-FR")}</span>
                    </div>
                    {suggestion.imdb_link && (
                      <>
                        <span>•</span>
                        <a
                          href={suggestion.imdb_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-red-500 hover:text-red-400"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>IMDb</span>
                        </a>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {filter === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(suggestion.id, "approved")}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                        >
                          <Check className="h-4 w-4" />
                          <span>Approuver</span>
                        </button>
                        <button
                          onClick={() => updateStatus(suggestion.id, "rejected")}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                        >
                          <X className="h-4 w-4" />
                          <span>Rejeter</span>
                        </button>
                      </>
                    )}
                    
                    {filter === "approved" && (
                      <>
                        <Link
                          href={`/admin/media/new?title=${encodeURIComponent(suggestion.title)}&type=${suggestion.type}&year=${suggestion.year || ""}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Ajouter au catalogue</span>
                        </Link>
                        <button
                          onClick={() => updateStatus(suggestion.id, "added")}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Marquer comme ajouté
                        </button>
                      </>
                    )}

                    {filter !== "pending" && (
                      <button
                        onClick={() => updateStatus(suggestion.id, "pending")}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        Remettre en attente
                      </button>
                    )}

                    <button
                      onClick={() => deleteSuggestion(suggestion.id)}
                      className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors text-red-500"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {(["pending", "approved", "added", "rejected"] as const).map((status) => (
          <div key={status} className={`p-4 rounded-lg border ${statusColors[status]}`}>
            <p className="text-2xl font-bold">
              {suggestions.filter(s => s.status === status).length}
            </p>
            <p className="text-sm">{statusLabels[status]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
