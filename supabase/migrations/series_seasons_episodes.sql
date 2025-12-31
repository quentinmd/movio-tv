-- Table pour les saisons
CREATE TABLE IF NOT EXISTS public.seasons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  media_id UUID REFERENCES public.media(id) ON DELETE CASCADE NOT NULL,
  season_number INTEGER NOT NULL,
  title TEXT,
  description TEXT,
  poster_url TEXT,
  release_date DATE,
  episode_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(media_id, season_number)
);

-- Table pour les épisodes
CREATE TABLE IF NOT EXISTS public.episodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE NOT NULL,
  episode_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  embed_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER, -- durée en minutes
  release_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(season_id, episode_number)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_seasons_media ON public.seasons(media_id);
CREATE INDEX IF NOT EXISTS idx_episodes_season ON public.episodes(season_id);
CREATE INDEX IF NOT EXISTS idx_seasons_number ON public.seasons(season_number);
CREATE INDEX IF NOT EXISTS idx_episodes_number ON public.episodes(episode_number);

-- RLS Policies
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut voir les saisons et épisodes
CREATE POLICY "Seasons are viewable by everyone"
  ON public.seasons FOR SELECT
  USING (true);

CREATE POLICY "Episodes are viewable by everyone"
  ON public.episodes FOR SELECT
  USING (true);

-- Fonction pour mettre à jour le compteur d'épisodes
CREATE OR REPLACE FUNCTION update_season_episode_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.seasons
  SET episode_count = (
    SELECT COUNT(*)
    FROM public.episodes
    WHERE season_id = COALESCE(NEW.season_id, OLD.season_id)
  )
  WHERE id = COALESCE(NEW.season_id, OLD.season_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger pour recalculer le nombre d'épisodes
DROP TRIGGER IF EXISTS recalculate_episode_count ON public.episodes;
CREATE TRIGGER recalculate_episode_count
  AFTER INSERT OR DELETE ON public.episodes
  FOR EACH ROW
  EXECUTE FUNCTION update_season_episode_count();
