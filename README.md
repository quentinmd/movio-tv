# 🎬 Movio TV - Plateforme de Streaming VOD

Une plateforme de streaming moderne et complète construite avec **Next.js 14**, **Supabase**, et **Tailwind CSS**.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## ✨ Fonctionnalités

### 🎥 Front-Office (Public)

- **Page d'accueil** avec hero banner dynamique et carrousels par catégories
- **Navigation fluide** avec filtres Films/Séries et recherche
- **Lecteur vidéo** responsive avec intégration iframe (Lulustream)
- **Gestion des séries** : sélecteur de saisons/épisodes dynamique sans rechargement
- **Design dark mode** inspiré Netflix/Disney+ par défaut
- **Responsive** : optimisé pour mobile, tablette et desktop

### 🔐 Back-Office (Admin)

- **Dashboard** avec statistiques en temps réel
- **CRUD Médias** : gestion complète des films et séries
- **Gestion des catégories** : ajout/modification/suppression des genres
- **Protection RBAC** : middleware Next.js pour sécuriser les routes `/admin`
- **Interface moderne** avec sidebar et navigation intuitive
- **Formulaires validés** avec React Hook Form + Zod

## 🛠️ Stack Technique

### Frontend

- **Next.js 14** (App Router)
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le design
- **Lucide React** pour les icônes

### Backend & Base de données

- **Supabase** (PostgreSQL, Auth, Storage)
- **Row Level Security (RLS)** pour la sécurité
- **API REST** auto-générée

### Validation & Formulaires

- **React Hook Form** pour la gestion des formulaires
- **Zod** pour la validation des schémas

## 📦 Installation

### Prérequis

- Node.js 18+ et npm/yarn
- Un compte Supabase (gratuit sur [supabase.com](https://supabase.com))

### Étapes

1. **Installer les dépendances**

```bash
npm install
```

2. **Configurer Supabase**

   a. Créez un nouveau projet sur [supabase.com](https://supabase.com)

   b. Dans le SQL Editor de Supabase, exécutez le fichier `supabase/schema.sql`

   c. Copiez `.env.local.example` vers `.env.local` et remplissez vos clés :

   ```bash
   cp .env.local.example .env.local
   ```

   Éditez `.env.local` :

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon
   ```

3. **Créer un compte admin**

   Après avoir créé votre compte via Supabase Auth, exécutez dans le SQL Editor :

   ```sql
   UPDATE public.profiles
   SET is_admin = true
   WHERE email = 'votre-email@example.com';
   ```

4. **Lancer le serveur de développement**

```bash
npm run dev
```

5. **Accéder à l'application**
   - Front-office : [http://localhost:3000](http://localhost:3000)
   - Admin : [http://localhost:3000/admin](http://localhost:3000/admin)
   - Login : [http://localhost:3000/login](http://localhost:3000/login)

## 📁 Structure du Projet

```
movio-tv/
├── app/                      # App Router Next.js 14
│   ├── (public)/            # Routes publiques
│   │   ├── page.tsx         # Page d'accueil
│   │   ├── movies/          # Liste des films
│   │   ├── series/          # Liste des séries
│   │   └── watch/[slug]/    # Page de lecture
│   ├── admin/               # Routes admin (protégées)
│   │   ├── layout.tsx       # Layout admin avec sidebar
│   │   ├── page.tsx         # Dashboard
│   │   ├── media/           # Gestion des médias
│   │   └── categories/      # Gestion des catégories
│   ├── login/               # Page de connexion
│   ├── layout.tsx           # Layout racine
│   └── globals.css          # Styles globaux
├── components/              # Composants réutilisables
│   ├── admin/               # Composants admin
│   │   └── AdminSidebar.tsx
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── MediaCard.tsx
│   ├── MediaCarousel.tsx
│   ├── VideoPlayer.tsx
│   └── TVShowPlayer.tsx
├── lib/                     # Utilitaires et configuration
│   ├── supabase/            # Clients Supabase
│   │   ├── client.ts        # Client côté navigateur
│   │   └── server.ts        # Client côté serveur
│   ├── database.types.ts    # Types générés depuis Supabase
│   ├── types.ts             # Types personnalisés
│   ├── utils.ts             # Fonctions utilitaires
│   └── validations/         # Schémas Zod
│       └── media.ts
├── supabase/
│   ├── schema.sql           # Schéma de base de données
│   └── README.md            # Documentation DB
├── middleware.ts            # Middleware de protection des routes
├── tailwind.config.ts       # Configuration Tailwind
├── next.config.js           # Configuration Next.js
└── package.json
```

## 🗄️ Schéma de Base de Données

### Tables principales

- **profiles** : Utilisateurs avec rôles (is_admin)
- **categories** : Genres de films/séries
- **media** : Films et séries (type: 'movie' | 'tv')
- **media_categories** : Liaison many-to-many
- **seasons** : Saisons des séries TV
- **episodes** : Épisodes avec liens de lecture

### Sécurité (RLS)

- **Public** : Lecture seule des médias publiés
- **Authentifié** : Gestion de son propre profil
- **Admin** : CRUD complet sur toutes les ressources

## 🎨 Design

- **Thème** : Dark mode obligatoire (inspiration Netflix/Disney+)
- **Couleurs** : Palette rouge principale avec dégradés
- **Typographie** : Inter (sans-serif moderne)
- **Animations** : Transitions douces et effets hover
- **Responsive** : Mobile-first avec breakpoints Tailwind

## 🔒 Sécurité

- **Middleware Next.js** : Protection automatique des routes `/admin`
- **RLS Supabase** : Sécurité au niveau de la base de données
- **Validation** : Schémas Zod pour toutes les entrées utilisateur
- **Types TypeScript** : Sécurité des types à la compilation

## 📝 Utilisation

### Ajouter un film

1. Allez dans `/admin/media`
2. Cliquez sur "Ajouter un film"
3. Remplissez le formulaire :
   - Titre, description
   - URLs des images (poster, backdrop)
   - **Lien Lulustream** pour la lecture
   - Métadonnées (année, note, durée)
   - Catégories
   - Statut (brouillon/publié)
4. Enregistrez

### Ajouter une série

1. Allez dans `/admin/media`
2. Cliquez sur "Ajouter une série"
3. Remplissez les informations de base
4. Ajoutez des saisons
5. Pour chaque saison, ajoutez des épisodes avec leurs liens Lulustream

### Gérer les catégories

1. Allez dans `/admin/categories`
2. Ajoutez des genres (Action, Comédie, etc.)
3. Modifiez ou supprimez les catégories existantes

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

Configurez les variables d'environnement dans le dashboard Vercel.

### Autres plateformes

Le projet est compatible avec toute plateforme supportant Next.js 14 :

- Netlify
- Railway
- AWS Amplify
- Cloudflare Pages

## 📊 Statistiques

- **Tables** : 6 tables principales
- **Vues** : 2 vues SQL optimisées
- **Policies** : 20+ règles RLS
- **Composants** : 10+ composants React
- **Routes** : 8 routes publiques + 5 routes admin

## 🤝 Contribution

Ce projet est un template complet. N'hésitez pas à :

- Forker le projet
- Créer des issues pour les bugs
- Proposer des améliorations via PR

## 📄 Licence

MIT License - Libre d'utilisation pour vos projets personnels et commerciaux.

## 🙏 Remerciements

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Développé avec ❤️ pour la communauté des développeurs**

Pour toute question : ouvrez une issue sur GitHub
# movio-tv
