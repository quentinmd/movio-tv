"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Lightbulb, ThumbsUp, Film, Tv, ExternalLink, TrendingUp, Clock } from "lucide-react";

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

export default function SuggestPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [myVotes, setMyVotes] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "movie" | "series">("all");
  const [sortBy, setSortBy] = useState<"votes" | "recent">("votes");

  const [formData, setFormData] = useState({
    title: "",
    type: "movie" as "movie" | "series",
    description: "",
    year: "",
    imdb_link: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadUser();
    loadSuggestions();
  }, [filter, sortBy]);

  async function loadUser() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      // Charger les votes de l'utilisateur
      const { data: votes } = await supabase
        .from("suggestion_votes")
        .select("suggestion_id")
        .eq("user_id", user.id);
      
      if (votes) {
        setMyVotes(new Set(votes.map(v => v.suggestion_id)));
      }
    }
  }

  async function loadSuggestions() {
    setIsLoading(true);
    
    let query = supabase
      .from("content_suggestions")
      .select(`
        *,
        profiles:user_id (username)
      `)
      .eq("status", "pending");

    if (filter !== "all") {
      query = query.eq("type", filter);
    }

    if (sortBy === "votes") {
      query = query.order("votes", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data } = await query.limit(50);
    setSuggestions(data || []);
    setIsLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      router.push("/login?redirect=/suggest");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("content_suggestions")
        .insert({
          user_id: user.id,
          title: formData.title,
          type: formData.type,
          description: formData.description || null,
          year: formData.year ? parseInt(formData.year) : null,
          imdb_link: formData.imdb_link || null,
        });

      if (error) throw error;

      setSuccess(true);
      setFormData({
        title: "",
        type: "movie",
        description: "",
        year: "",
        imdb_link: "",
      });
      setShowForm(false);
      loadSuggestions();

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting suggestion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (suggestionId: string) => {
    if (!user) {
      router.push("/login?redirect=/suggest");
      return;
    }

    const hasVoted = myVotes.has(suggestionId);

    if (hasVoted) {
      // Retirer le vote
      await supabase
        .from("suggestion_votes")
        .delete()
        .eq("suggestion_id", suggestionId)
        .eq("user_id", user.id);
      
      setMyVotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(suggestionId);
        return newSet;
      });
    } else {
      // Ajouter le vote
      await supabase
        .from("suggestion_votes")
        .insert({
          suggestion_id: suggestionId,
          user_id: user.id,
        });
      
      setMyVotes(prev => new Set(prev).add(suggestionId));
    }

    loadSuggestions();
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg">
            <Lightbulb className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Suggérer un Contenu</h1>
            <p className="text-muted-foreground mt-2">
              Aidez-nous à enrichir le catalogue avec vos suggestions
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
        >
          {showForm ? "Voir les suggestions" : "Suggérer un contenu"}
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500 text-green-500 rounded-lg">
          ✅ Merci pour votre suggestion ! Elle sera examinée par notre équipe.
        </div>
      )}

      {showForm ? (
        <div className="bg-secondary/50 p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-bold mb-6">Nouvelle Suggestion</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Titre du film ou de la série *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Ex: Inception, Breaking Bad..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "movie" | "series" })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="movie">Film</option>
                  <option value="series">Série</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Année</label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="2024"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Lien IMDb (optionnel)
                </label>
                <input
                  type="url"
                  value={formData.imdb_link}
                  onChange={(e) => setFormData({ ...formData, imdb_link: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="https://www.imdb.com/title/tt..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Description / Pourquoi voulez-vous voir ce contenu ?
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  placeholder="Parlez-nous brièvement de ce film/série..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 rounded-lg font-medium transition-colors"
              >
                {isSubmitting ? "Envoi..." : "Soumettre la suggestion"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {/* Filtres */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Type:</span>
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "all" ? "bg-red-600" : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilter("movie")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  filter === "movie" ? "bg-red-600" : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                <Film className="h-4 w-4" />
                <span>Films</span>
              </button>
              <button
                onClick={() => setFilter("series")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  filter === "series" ? "bg-red-600" : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                <Tv className="h-4 w-4" />
                <span>Séries</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-sm text-muted-foreground">Trier par:</span>
              <button
                onClick={() => setSortBy("votes")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  sortBy === "votes" ? "bg-red-600" : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Plus votés</span>
              </button>
              <button
                onClick={() => setSortBy("recent")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  sortBy === "recent" ? "bg-red-600" : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                <Clock className="h-4 w-4" />
                <span>Récents</span>
              </button>
            </div>
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
              <p className="text-muted-foreground mb-6">
                Soyez le premier à suggérer un contenu !
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="bg-secondary/50 p-6 rounded-lg border border-border hover:border-red-500/50 transition-colors"
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
                      </div>

                      {suggestion.description && (
                        <p className="text-muted-foreground mb-3">{suggestion.description}</p>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>
                          Suggéré par <span className="text-foreground font-medium">{suggestion.profiles?.username || "Anonyme"}</span>
                        </span>
                        <span>•</span>
                        <span>{new Date(suggestion.created_at).toLocaleDateString("fr-FR")}</span>
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
                    </div>

                    <button
                      onClick={() => handleVote(suggestion.id)}
                      disabled={!user}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        myVotes.has(suggestion.id)
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-secondary hover:bg-secondary/80"
                      }`}
                      title={!user ? "Connectez-vous pour voter" : ""}
                    >
                      <ThumbsUp className={`h-5 w-5 ${myVotes.has(suggestion.id) ? "fill-current" : ""}`} />
                      <span>{suggestion.votes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!user && (
        <div className="mt-8 p-6 bg-red-500/10 border border-red-500 rounded-lg text-center">
          <p className="text-muted-foreground">
            <a href="/login?redirect=/suggest" className="text-red-500 hover:text-red-400 font-medium">
              Connectez-vous
            </a>{" "}
            pour suggérer des contenus et voter pour vos favoris
          </p>
        </div>
      )}
    </div>
  );
}
