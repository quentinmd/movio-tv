-- Table pour les profils utilisateurs
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table pour les notations des utilisateurs
CREATE TABLE IF NOT EXISTS public.user_ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  media_id UUID REFERENCES public.media(id) ON DELETE CASCADE NOT NULL,
  rating DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, media_id)
);

-- Table pour l'historique de visionnage
CREATE TABLE IF NOT EXISTS public.watch_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  media_id UUID REFERENCES public.media(id) ON DELETE CASCADE NOT NULL,
  watched_at TIMESTAMPTZ DEFAULT NOW(),
  progress INTEGER DEFAULT 0, -- Progression en secondes
  completed BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, media_id)
);

-- Table pour la liste de favoris/watchlist
CREATE TABLE IF NOT EXISTS public.user_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  media_id UUID REFERENCES public.media(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, media_id)
);

-- Indexes pour performance
CREATE INDEX IF NOT EXISTS idx_user_ratings_user ON public.user_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ratings_media ON public.user_ratings(media_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_user ON public.watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_media ON public.watch_history(media_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON public.user_favorites(user_id);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Profiles: Tout le monde peut lire, seul l'utilisateur peut modifier le sien
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User ratings: Lecture publique, modification par propriétaire
CREATE POLICY "Ratings are viewable by everyone"
  ON public.user_ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can create own ratings"
  ON public.user_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON public.user_ratings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
  ON public.user_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- Watch history: Privé, seul l'utilisateur peut voir son historique
CREATE POLICY "Users can view own watch history"
  ON public.watch_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own watch history"
  ON public.watch_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own watch history"
  ON public.watch_history FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own watch history"
  ON public.watch_history FOR DELETE
  USING (auth.uid() = user_id);

-- Favorites: Privé, seul l'utilisateur peut voir ses favoris
CREATE POLICY "Users can view own favorites"
  ON public.user_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.user_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.user_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Fonction pour mettre à jour le rating moyen d'un média
CREATE OR REPLACE FUNCTION update_media_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.media
  SET rating = (
    SELECT AVG(rating)
    FROM public.user_ratings
    WHERE media_id = COALESCE(NEW.media_id, OLD.media_id)
  )
  WHERE id = COALESCE(NEW.media_id, OLD.media_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger pour recalculer le rating
DROP TRIGGER IF EXISTS recalculate_media_rating ON public.user_ratings;
CREATE TRIGGER recalculate_media_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.user_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_media_rating();

-- Fonction pour créer automatiquement un profil lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer le profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
