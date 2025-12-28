-- Table pour les suggestions de contenu par les utilisateurs
CREATE TABLE IF NOT EXISTS public.content_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('movie', 'series')) NOT NULL,
  description TEXT,
  year INTEGER,
  imdb_link TEXT,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'added')) DEFAULT 'pending',
  votes INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les votes sur les suggestions
CREATE TABLE IF NOT EXISTS public.suggestion_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  suggestion_id UUID REFERENCES public.content_suggestions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(suggestion_id, user_id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_suggestions_user ON public.content_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_status ON public.content_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_suggestion_votes_suggestion ON public.suggestion_votes(suggestion_id);
CREATE INDEX IF NOT EXISTS idx_suggestion_votes_user ON public.suggestion_votes(user_id);

-- RLS Policies
ALTER TABLE public.content_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestion_votes ENABLE ROW LEVEL SECURITY;

-- Suggestions: Tout le monde peut voir, seul l'utilisateur peut créer/modifier les siennes
CREATE POLICY "Suggestions are viewable by everyone"
  ON public.content_suggestions FOR SELECT
  USING (true);

CREATE POLICY "Users can create suggestions"
  ON public.content_suggestions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own suggestions"
  ON public.content_suggestions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own suggestions"
  ON public.content_suggestions FOR DELETE
  USING (auth.uid() = user_id);

-- Votes: Les utilisateurs peuvent voir tous les votes et voter
CREATE POLICY "Votes are viewable by everyone"
  ON public.suggestion_votes FOR SELECT
  USING (true);

CREATE POLICY "Users can vote"
  ON public.suggestion_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their votes"
  ON public.suggestion_votes FOR DELETE
  USING (auth.uid() = user_id);

-- Fonction pour mettre à jour le compteur de votes
CREATE OR REPLACE FUNCTION update_suggestion_votes()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.content_suggestions
  SET votes = (
    SELECT COUNT(*)
    FROM public.suggestion_votes
    WHERE suggestion_id = COALESCE(NEW.suggestion_id, OLD.suggestion_id)
  )
  WHERE id = COALESCE(NEW.suggestion_id, OLD.suggestion_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger pour recalculer les votes
DROP TRIGGER IF EXISTS recalculate_suggestion_votes ON public.suggestion_votes;
CREATE TRIGGER recalculate_suggestion_votes
  AFTER INSERT OR DELETE ON public.suggestion_votes
  FOR EACH ROW
  EXECUTE FUNCTION update_suggestion_votes();
