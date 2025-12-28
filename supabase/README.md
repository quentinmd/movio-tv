# Schéma de Base de Données Movio TV

## Instructions de Configuration

1. **Créer un projet Supabase** sur [supabase.com](https://supabase.com)

2. **Exécuter le schéma SQL**

   - Allez dans le SQL Editor de votre projet Supabase
   - Copiez et collez le contenu de `schema.sql`
   - Exécutez le script

3. **Configurer les variables d'environnement**

   - Copiez `.env.local.example` vers `.env.local`
   - Remplissez avec vos clés Supabase (disponibles dans Project Settings > API)

4. **Créer un compte admin**
   - Inscrivez-vous via l'interface Supabase Auth
   - Dans le SQL Editor, exécutez :
   ```sql
   UPDATE public.profiles
   SET is_admin = true
   WHERE email = 'votre-email@example.com';
   ```

## Structure des Tables

### `profiles`

Gère les utilisateurs et leurs rôles.

- `id`: UUID (référence auth.users)
- `email`: Adresse email
- `is_admin`: Boolean pour les droits admin

### `categories`

Genres de films/séries.

- `id`: UUID
- `name`: Nom du genre
- `slug`: URL-friendly identifier

### `media`

Films et Séries (table unifiée).

- `type`: 'movie' ou 'tv'
- `embed_url`: Lien Lulustream (pour les films)
- `status`: 'draft', 'published', 'archived'

### `media_categories`

Table de liaison Many-to-Many entre media et categories.

### `seasons`

Saisons d'une série TV.

- `media_id`: Référence vers media (type='tv')
- `season_number`: Numéro de saison

### `episodes`

Épisodes d'une saison.

- `season_id`: Référence vers seasons
- `episode_number`: Numéro d'épisode
- `embed_url`: Lien Lulustream spécifique à l'épisode

## Sécurité (RLS)

- **Public** : Lecture seule des médias publiés
- **Authentifié** : Gestion de son propre profil
- **Admin** : CRUD complet sur toutes les tables

## Vues Utiles

- `media_with_categories` : Médias avec leurs catégories agrégées
- `tv_shows_complete` : Séries avec saisons et épisodes dénormalisés
