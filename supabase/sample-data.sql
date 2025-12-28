-- ============================================
-- DONNÉES DE TEST - Movio TV
-- À exécuter APRÈS schema.sql
-- ============================================

-- Note : Remplacez les URLs d'images et embed_url par vos propres liens

-- ============================================
-- 1. FILMS D'EXEMPLE
-- ============================================

-- Film 1 : Action
INSERT INTO public.media (
  title,
  slug,
  description,
  poster_url,
  backdrop_url,
  type,
  embed_url,
  year,
  rating,
  duration,
  status
) VALUES (
  'Inception',
  'inception',
  'Un voleur qui s''infiltre dans les rêves des gens pour voler leurs secrets se voit confier la mission inverse : implanter une idée dans l''esprit d''un PDG.',
  'https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg',
  'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
  'movie',
  'https://lulustream.com/e/xxxxx', -- REMPLACEZ par votre lien
  2010,
  8.8,
  148,
  'published'
);

-- Film 2 : Science-Fiction
INSERT INTO public.media (
  title,
  slug,
  description,
  poster_url,
  backdrop_url,
  type,
  embed_url,
  year,
  rating,
  duration,
  status
) VALUES (
  'Interstellar',
  'interstellar',
  'Une équipe d''explorateurs voyage à travers un trou de ver dans l''espace pour assurer la survie de l''humanité.',
  'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
  'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
  'movie',
  'https://lulustream.com/e/xxxxx', -- REMPLACEZ
  2014,
  8.6,
  169,
  'published'
);

-- Film 3 : Comédie
INSERT INTO public.media (
  title,
  slug,
  description,
  poster_url,
  backdrop_url,
  type,
  embed_url,
  year,
  rating,
  duration,
  status
) VALUES (
  'The Grand Budapest Hotel',
  'the-grand-budapest-hotel',
  'Les aventures de Gustave H, concierge légendaire d''un grand hôtel européen.',
  'https://image.tmdb.org/t/p/w500/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
  'https://image.tmdb.org/t/p/original/nP6RliHjxsz4irTKsxe4FRhbZdl.jpg',
  'movie',
  'https://lulustream.com/e/xxxxx', -- REMPLACEZ
  2014,
  8.1,
  99,
  'published'
);

-- ============================================
-- 2. SÉRIES D'EXEMPLE
-- ============================================

-- Série 1 : Breaking Bad
INSERT INTO public.media (
  title,
  slug,
  description,
  poster_url,
  backdrop_url,
  type,
  year,
  rating,
  status
) VALUES (
  'Breaking Bad',
  'breaking-bad',
  'Un professeur de chimie atteint d''un cancer se lance dans la fabrication de méthamphétamine pour assurer l''avenir de sa famille.',
  'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  'https://image.tmdb.org/t/p/original/9faGSFi5jam6pDWGNd0p8JcJgXQ.jpg',
  'tv',
  2008,
  9.5,
  'published'
) RETURNING id;

-- Récupérer l'ID de Breaking Bad pour les saisons
-- Note : En production, utilisez les retours de requête

-- Saison 1 de Breaking Bad
INSERT INTO public.seasons (
  media_id,
  season_number,
  title,
  description
) VALUES (
  (SELECT id FROM public.media WHERE slug = 'breaking-bad'),
  1,
  'Saison 1',
  'Walter White, un professeur de chimie, découvre qu''il a un cancer. Pour assurer l''avenir de sa famille, il se lance dans la fabrication de méthamphétamine.'
);

-- Episodes Saison 1
INSERT INTO public.episodes (
  season_id,
  episode_number,
  title,
  description,
  embed_url,
  duration
) VALUES 
(
  (SELECT id FROM public.seasons WHERE media_id = (SELECT id FROM public.media WHERE slug = 'breaking-bad') AND season_number = 1),
  1,
  'Chute libre',
  'Walter White apprend qu''il a un cancer du poumon incurable.',
  'https://lulustream.com/e/xxxxx', -- REMPLACEZ
  58
),
(
  (SELECT id FROM public.seasons WHERE media_id = (SELECT id FROM public.media WHERE slug = 'breaking-bad') AND season_number = 1),
  2,
  'Le Choix',
  'Walt et Jesse se lancent dans leur première production de meth.',
  'https://lulustream.com/e/xxxxx', -- REMPLACEZ
  48
);

-- ============================================
-- 3. ASSOCIATIONS CATÉGORIES
-- ============================================

-- Inception : Action, Science-Fiction, Thriller
INSERT INTO public.media_categories (media_id, category_id) VALUES
  ((SELECT id FROM public.media WHERE slug = 'inception'), 
   (SELECT id FROM public.categories WHERE slug = 'action')),
  ((SELECT id FROM public.media WHERE slug = 'inception'), 
   (SELECT id FROM public.categories WHERE slug = 'science-fiction')),
  ((SELECT id FROM public.media WHERE slug = 'inception'), 
   (SELECT id FROM public.categories WHERE slug = 'thriller'));

-- Interstellar : Science-Fiction, Aventure, Drame
INSERT INTO public.media_categories (media_id, category_id) VALUES
  ((SELECT id FROM public.media WHERE slug = 'interstellar'), 
   (SELECT id FROM public.categories WHERE slug = 'science-fiction')),
  ((SELECT id FROM public.media WHERE slug = 'interstellar'), 
   (SELECT id FROM public.categories WHERE slug = 'aventure')),
  ((SELECT id FROM public.media WHERE slug = 'interstellar'), 
   (SELECT id FROM public.categories WHERE slug = 'drame'));

-- The Grand Budapest Hotel : Comédie, Aventure
INSERT INTO public.media_categories (media_id, category_id) VALUES
  ((SELECT id FROM public.media WHERE slug = 'the-grand-budapest-hotel'), 
   (SELECT id FROM public.categories WHERE slug = 'comedie')),
  ((SELECT id FROM public.media WHERE slug = 'the-grand-budapest-hotel'), 
   (SELECT id FROM public.categories WHERE slug = 'aventure'));

-- Breaking Bad : Drame, Thriller
INSERT INTO public.media_categories (media_id, category_id) VALUES
  ((SELECT id FROM public.media WHERE slug = 'breaking-bad'), 
   (SELECT id FROM public.categories WHERE slug = 'drame')),
  ((SELECT id FROM public.media WHERE slug = 'breaking-bad'), 
   (SELECT id FROM public.categories WHERE slug = 'thriller'));

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Vérifier les médias créés
SELECT 
  m.title,
  m.type,
  m.year,
  m.rating,
  m.status,
  COUNT(DISTINCT mc.category_id) as categories_count
FROM public.media m
LEFT JOIN public.media_categories mc ON m.id = mc.media_id
GROUP BY m.id, m.title, m.type, m.year, m.rating, m.status
ORDER BY m.created_at DESC;

-- Vérifier les séries avec saisons/épisodes
SELECT 
  m.title as serie,
  s.season_number,
  COUNT(e.id) as episodes_count
FROM public.media m
JOIN public.seasons s ON m.id = s.media_id
LEFT JOIN public.episodes e ON s.id = e.season_id
WHERE m.type = 'tv'
GROUP BY m.title, s.season_number
ORDER BY m.title, s.season_number;

-- ============================================
-- NOTES IMPORTANTES
-- ============================================

/*
1. IMAGES :
   - Utilisez des URLs d'images publiques (TMDB, IMDb, etc.)
   - Format recommandé : JPEG ou PNG
   - Poster : ratio 2:3 (ex: 500x750px)
   - Backdrop : ratio 16:9 (ex: 1920x1080px)

2. EMBED URLs :
   - Remplacez TOUS les liens 'https://lulustream.com/e/xxxxx' 
   - Utilisez vos vrais liens de streaming
   - Format iframe compatible

3. SLUG :
   - Auto-généré par le trigger si non fourni
   - Peut être personnalisé manuellement

4. STATUT :
   - 'draft' : Non visible publiquement
   - 'published' : Visible sur le site
   - 'archived' : Masqué mais conservé

5. POUR AJOUTER PLUS DE CONTENU :
   - Utilisez l'interface admin à /admin/media
   - Ou dupliquez ces exemples et modifiez les valeurs
*/
