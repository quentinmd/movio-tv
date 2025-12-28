-- ============================================
-- MOVIO TV - Schéma de Base de Données Supabase
-- ============================================

-- Extension pour UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. TABLE PROFILES (Utilisateurs)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger pour créer automatiquement un profil après inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. TABLE CATEGORIES (Genres)
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- ============================================
-- 3. TABLE MEDIA (Films et Séries)
-- ============================================
CREATE TABLE IF NOT EXISTS public.media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  poster_url TEXT,
  backdrop_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('movie', 'tv')),
  embed_url TEXT, -- Pour les films uniquement
  year INTEGER,
  rating DECIMAL(3,1) DEFAULT 0,
  duration INTEGER, -- En minutes (pour les films)
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_media_slug ON public.media(slug);
CREATE INDEX IF NOT EXISTS idx_media_type ON public.media(type);
CREATE INDEX IF NOT EXISTS idx_media_status ON public.media(status);

-- ============================================
-- 4. TABLE MEDIA_CATEGORIES (Liaison Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS public.media_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  media_id UUID REFERENCES public.media(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(media_id, category_id)
);

-- Index pour jointures rapides
CREATE INDEX IF NOT EXISTS idx_media_categories_media ON public.media_categories(media_id);
CREATE INDEX IF NOT EXISTS idx_media_categories_category ON public.media_categories(category_id);

-- ============================================
-- 5. TABLE SEASONS (Saisons pour Séries TV)
-- ============================================
CREATE TABLE IF NOT EXISTS public.seasons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  media_id UUID REFERENCES public.media(id) ON DELETE CASCADE NOT NULL,
  season_number INTEGER NOT NULL,
  title TEXT,
  description TEXT,
  poster_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(media_id, season_number)
);

-- Trigger pour vérifier que media_id est de type 'tv'
CREATE OR REPLACE FUNCTION public.check_season_media_type()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.media 
    WHERE id = NEW.media_id AND type = 'tv'
  ) THEN
    RAISE EXCEPTION 'Les saisons ne peuvent être créées que pour des médias de type "tv"';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS check_season_media_type_trigger ON public.seasons;
CREATE TRIGGER check_season_media_type_trigger
  BEFORE INSERT OR UPDATE ON public.seasons
  FOR EACH ROW EXECUTE FUNCTION public.check_season_media_type();

CREATE INDEX IF NOT EXISTS idx_seasons_media ON public.seasons(media_id);

-- ============================================
-- 6. TABLE EPISODES (Épisodes pour chaque Saison)
-- ============================================
CREATE TABLE IF NOT EXISTS public.episodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  season_id UUID REFERENCES public.seasons(id) ON DELETE CASCADE NOT NULL,
  episode_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  embed_url TEXT NOT NULL, -- Lien Lulustream spécifique
  duration INTEGER, -- En minutes
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(season_id, episode_number)
);

CREATE INDEX IF NOT EXISTS idx_episodes_season ON public.episodes(season_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES PUBLIQUES (Lecture pour tous)
-- ============================================

-- Lecture publique des médias publiés
CREATE POLICY "Public media read" ON public.media
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public categories read" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Public media_categories read" ON public.media_categories
  FOR SELECT USING (true);

CREATE POLICY "Public seasons read" ON public.seasons
  FOR SELECT USING (
    (SELECT status FROM public.media WHERE id = media_id) = 'published'
  );

CREATE POLICY "Public episodes read" ON public.episodes
  FOR SELECT USING (
    (SELECT m.status FROM public.media m 
     JOIN public.seasons s ON s.media_id = m.id 
     WHERE s.id = season_id) = 'published'
  );

-- ============================================
-- POLICIES ADMIN (CRUD complet)
-- ============================================

-- Fonction helper pour vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profils : Les admins peuvent tout faire
CREATE POLICY "Admin profiles full access" ON public.profiles
  FOR ALL USING (is_admin());

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Catégories : Admin CRUD
CREATE POLICY "Admin categories insert" ON public.categories
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admin categories update" ON public.categories
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admin categories delete" ON public.categories
  FOR DELETE USING (is_admin());

-- Média : Admin CRUD
CREATE POLICY "Admin media insert" ON public.media
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admin media update" ON public.media
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admin media delete" ON public.media
  FOR DELETE USING (is_admin());

CREATE POLICY "Admin media read all" ON public.media
  FOR SELECT USING (is_admin());

-- Media_Categories : Admin CRUD
CREATE POLICY "Admin media_categories insert" ON public.media_categories
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admin media_categories delete" ON public.media_categories
  FOR DELETE USING (is_admin());

-- Seasons : Admin CRUD
CREATE POLICY "Admin seasons insert" ON public.seasons
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admin seasons update" ON public.seasons
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admin seasons delete" ON public.seasons
  FOR DELETE USING (is_admin());

-- Episodes : Admin CRUD
CREATE POLICY "Admin episodes insert" ON public.episodes
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admin episodes update" ON public.episodes
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admin episodes delete" ON public.episodes
  FOR DELETE USING (is_admin());

-- ============================================
-- DONNÉES INITIALES (Sample Data)
-- ============================================

-- Insérer des catégories par défaut
INSERT INTO public.categories (name, slug) VALUES
  ('Action', 'action'),
  ('Comédie', 'comedie'),
  ('Drame', 'drame'),
  ('Science-Fiction', 'science-fiction'),
  ('Horreur', 'horreur'),
  ('Romance', 'romance'),
  ('Thriller', 'thriller'),
  ('Animé', 'anime'),
  ('Documentaire', 'documentaire'),
  ('Aventure', 'aventure')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- VUES UTILES
-- ============================================

-- Vue complète des médias avec leurs catégories
CREATE OR REPLACE VIEW public.media_with_categories AS
SELECT 
  m.*,
  COALESCE(
    json_agg(
      json_build_object(
        'id', c.id,
        'name', c.name,
        'slug', c.slug
      )
    ) FILTER (WHERE c.id IS NOT NULL),
    '[]'
  ) as categories
FROM public.media m
LEFT JOIN public.media_categories mc ON m.id = mc.media_id
LEFT JOIN public.categories c ON mc.category_id = c.id
GROUP BY m.id;

-- Vue des séries avec saisons et épisodes
CREATE OR REPLACE VIEW public.tv_shows_complete AS
SELECT 
  m.id as media_id,
  m.title as show_title,
  m.slug as show_slug,
  m.description as show_description,
  m.poster_url,
  m.backdrop_url,
  s.id as season_id,
  s.season_number,
  s.title as season_title,
  e.id as episode_id,
  e.episode_number,
  e.title as episode_title,
  e.embed_url,
  e.duration
FROM public.media m
JOIN public.seasons s ON m.id = s.media_id
JOIN public.episodes e ON s.id = e.season_id
WHERE m.type = 'tv' AND m.status = 'published'
ORDER BY m.title, s.season_number, e.episode_number;

-- ============================================
-- FONCTIONS UTILITAIRES
-- ============================================

-- Fonction pour créer un slug depuis un titre
CREATE OR REPLACE FUNCTION public.slugify(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        translate(text_input, 'àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ', 'aaaaaaeceeeeiiiidnooooouuuuyty'),
        '[^a-z0-9]+', '-', 'gi'
      ),
      '(^-|-$)', '', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger pour auto-générer les slugs
CREATE OR REPLACE FUNCTION public.generate_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := slugify(NEW.title) || '-' || substr(md5(random()::text), 1, 6);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS media_slug_trigger ON public.media;
CREATE TRIGGER media_slug_trigger
  BEFORE INSERT ON public.media
  FOR EACH ROW EXECUTE FUNCTION public.generate_slug();

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_media_updated_at ON public.media;
CREATE TRIGGER update_media_updated_at
  BEFORE UPDATE ON public.media
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
