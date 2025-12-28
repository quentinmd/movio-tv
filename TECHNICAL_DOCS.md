# 📚 Documentation Technique - Movio TV

## Architecture

### Structure de l'application

```
Frontend (Next.js 14)
    ↓
Middleware (Auth & RBAC)
    ↓
Server Components / Server Actions
    ↓
Supabase Client (SSR / Browser)
    ↓
Supabase Backend (PostgreSQL + RLS)
```

## Schéma de Base de Données

### Diagramme relationnel

```
profiles (1) ←→ auth.users
    ↓
    │ is_admin
    ↓

categories (M) ←→ media_categories ←→ (M) media
                                           ↓
                                       type: movie | tv
                                           ↓
                                    ┌──────┴──────┐
                                    │             │
                              movie.embed_url   seasons
                                                  ↓
                                              episodes
                                                  ↓
                                           episode.embed_url
```

### Tables détaillées

#### `profiles`

```sql
id              UUID PRIMARY KEY (FK → auth.users)
email           TEXT NOT NULL
full_name       TEXT
is_admin        BOOLEAN DEFAULT false
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

#### `categories`

```sql
id              UUID PRIMARY KEY
name            TEXT UNIQUE
slug            TEXT UNIQUE
created_at      TIMESTAMP
```

#### `media`

```sql
id              UUID PRIMARY KEY
title           TEXT NOT NULL
slug            TEXT UNIQUE
description     TEXT
poster_url      TEXT
backdrop_url    TEXT
type            TEXT ('movie' | 'tv')
embed_url       TEXT (pour films uniquement)
year            INTEGER
rating          DECIMAL(3,1)
duration        INTEGER (minutes)
status          TEXT ('draft' | 'published' | 'archived')
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

#### `media_categories` (Table de liaison)

```sql
id              UUID PRIMARY KEY
media_id        UUID (FK → media)
category_id     UUID (FK → categories)
UNIQUE(media_id, category_id)
```

#### `seasons`

```sql
id              UUID PRIMARY KEY
media_id        UUID (FK → media WHERE type='tv')
season_number   INTEGER
title           TEXT
description     TEXT
poster_url      TEXT
created_at      TIMESTAMP
UNIQUE(media_id, season_number)
```

#### `episodes`

```sql
id              UUID PRIMARY KEY
season_id       UUID (FK → seasons)
episode_number  INTEGER
title           TEXT NOT NULL
description     TEXT
embed_url       TEXT NOT NULL
duration        INTEGER
thumbnail_url   TEXT
created_at      TIMESTAMP
UNIQUE(season_id, episode_number)
```

## Sécurité (RLS)

### Policies publiques (SELECT)

```sql
-- Lecture des médias publiés
CREATE POLICY "Public media read"
ON media FOR SELECT
USING (status = 'published');

-- Lecture des catégories
CREATE POLICY "Public categories read"
ON categories FOR SELECT
USING (true);

-- Lecture des saisons (si média publié)
CREATE POLICY "Public seasons read"
ON seasons FOR SELECT
USING (
  (SELECT status FROM media WHERE id = media_id) = 'published'
);

-- Lecture des épisodes (si média publié)
CREATE POLICY "Public episodes read"
ON episodes FOR SELECT
USING (
  (SELECT m.status FROM media m
   JOIN seasons s ON s.media_id = m.id
   WHERE s.id = season_id) = 'published'
);
```

### Policies admin (ALL)

```sql
-- Fonction helper
CREATE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Exemple de policy admin
CREATE POLICY "Admin media full access"
ON media FOR ALL
USING (is_admin());
```

## Routes

### Publiques

- `/` - Accueil avec hero banner et carrousels
- `/movies` - Liste des films
- `/series` - Liste des séries
- `/watch/[slug]` - Page de lecture (film ou série)
- `/login` - Connexion

### Admin (protégées par middleware)

- `/admin` - Dashboard avec stats
- `/admin/media` - Liste des médias
- `/admin/media/new` - Ajouter un média
- `/admin/media/[id]/edit` - Modifier un média
- `/admin/categories` - Gérer les catégories

## Middleware

Le middleware `middleware.ts` protège toutes les routes `/admin` :

```typescript
// 1. Vérifier l'authentification
const {
  data: { user },
} = await supabase.auth.getUser();
if (!user) redirect("/login");

// 2. Vérifier le rôle admin
const { data: profile } = await supabase
  .from("profiles")
  .select("is_admin")
  .eq("id", user.id)
  .single();

if (!profile?.is_admin) redirect("/");
```

## Composants clés

### `VideoPlayer`

Lecteur iframe responsive pour les films et épisodes.

```typescript
<VideoPlayer embedUrl="https://lulustream.com/..." title="Titre du film" />
```

### `TVShowPlayer`

Gestion complète des séries avec sélecteur de saisons/épisodes.

```typescript
<TVShowPlayer title="Titre de la série" seasons={seasonsWithEpisodes} />
```

### `MediaCard`

Carte de média avec hover effects et informations.

```typescript
<MediaCard media={mediaData} priority={false} />
```

### `MediaCarousel`

Carrousel horizontal scrollable.

```typescript
<MediaCarousel title="Films" items={moviesList} />
```

## Validation (Zod)

### Film

```typescript
movieSchema = z.object({
  title: z.string().min(1),
  embed_url: z.string().min(1), // Requis
  duration: z.number().int().min(1).optional(),
  categories: z.array(z.string()).min(1),
  // ...
});
```

### Série TV

```typescript
tvShowSchema = z.object({
  title: z.string().min(1),
  // Pas d'embed_url pour les séries
  categories: z.array(z.string()).min(1),
  // ...
});
```

### Épisode

```typescript
episodeSchema = z.object({
  episode_number: z.number().int().min(1),
  title: z.string().min(1),
  embed_url: z.string().min(1), // Requis pour chaque épisode
  // ...
});
```

## Server Actions

```typescript
"use server";

// Créer un média
export async function createMedia(formData: FormData) {
  const supabase = createClient();
  // Insert + revalidatePath
}

// Créer une saison
export async function createSeason(mediaId: string, data: SeasonFormData) {
  // Insert + revalidatePath
}

// Créer un épisode
export async function createEpisode(seasonId: string, data: EpisodeFormData) {
  // Insert + revalidatePath
}
```

## Performances

### Stratégies de cache

- `revalidate: 60` sur les pages publiques
- ISR (Incremental Static Regeneration)
- Server Components par défaut

### Images

```typescript
// next.config.js
images: {
  remotePatterns: [{ protocol: "https", hostname: "**" }];
}
```

### Optimisations SQL

- Index sur `slug`, `type`, `status`
- Vues matérialisées pour les requêtes complexes
- Jointures optimisées

## Déploiement

### Variables d'environnement requises

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### Build

```bash
npm run build
npm start
```

### Vercel

```bash
vercel --prod
```

## Tests

### Tester le middleware

1. Essayez d'accéder à `/admin` sans être connecté
2. Connectez-vous avec un compte non-admin
3. Vérifiez la redirection

### Tester RLS

```sql
-- Se connecter en tant qu'anonymous
SET ROLE anon;

-- Essayer de lire des médias draft (devrait échouer)
SELECT * FROM media WHERE status = 'draft';
```

## Maintenance

### Backup de la base de données

Dans Supabase Dashboard : **Database** → **Backups**

### Logs

Dans Supabase Dashboard : **Logs** → **API Logs**

### Monitoring

- Vercel Analytics
- Supabase Dashboard Metrics

## Extensions futures

### Suggestions d'améliorations

- [ ] Système de commentaires
- [ ] Watchlist utilisateur
- [ ] Recherche full-text
- [ ] Recommandations basées sur l'IA
- [ ] Notifications push
- [ ] Support multi-langues
- [ ] Upload de fichiers vidéo
- [ ] Statistiques de visionnage

---

Pour toute question technique, consultez les fichiers de code ou ouvrez une issue.
