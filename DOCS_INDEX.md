# 🎬 Movio TV - Index de Documentation

Bienvenue dans la documentation complète de Movio TV ! Voici où trouver l'information dont vous avez besoin.

## 🚀 Démarrage Rapide

**Vous débutez avec le projet ?** Commencez ici :

1. [README.md](README.md) - Vue d'ensemble du projet
2. [GETTING_STARTED.md](GETTING_STARTED.md) - Installation en 5 minutes
3. [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Checklist de mise en prod

## 📚 Documentation par Rôle

### Pour les Développeurs

#### Configuration initiale

- [package.json](package.json) - Dépendances et scripts
- [tsconfig.json](tsconfig.json) - Configuration TypeScript
- [tailwind.config.ts](tailwind.config.ts) - Configuration Tailwind
- [next.config.js](next.config.js) - Configuration Next.js
- [middleware.ts](middleware.ts) - Protection des routes admin

#### Base de données

- [supabase/schema.sql](supabase/schema.sql) - Schéma complet
- [supabase/sample-data.sql](supabase/sample-data.sql) - Données de test
- [supabase/README.md](supabase/README.md) - Guide de configuration DB
- [lib/database.types.ts](lib/database.types.ts) - Types TypeScript

#### Architecture technique

- [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) - Documentation technique complète
- [lib/types.ts](lib/types.ts) - Types personnalisés
- [lib/validations/media.ts](lib/validations/media.ts) - Schémas Zod
- [lib/actions.ts](lib/actions.ts) - Server Actions

### Pour les Administrateurs

#### Guides d'utilisation

- [GETTING_STARTED.md](GETTING_STARTED.md) - Configuration et premiers pas
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Checklist de déploiement
- [supabase/README.md](supabase/README.md) - Gestion de la base de données

#### Pages admin

- `/admin` - Dashboard principal
- `/admin/media` - Gestion des médias
- `/admin/categories` - Gestion des catégories
- `/admin/media/new` - Ajouter un média

### Pour les Designers

#### Styles et composants

- [app/globals.css](app/globals.css) - Styles globaux et thème dark
- [tailwind.config.ts](tailwind.config.ts) - Configuration des couleurs
- [components/](components/) - Composants UI réutilisables

## 📁 Structure du Projet

```
movio-tv/
├── 📄 Documentation
│   ├── README.md (Vue d'ensemble)
│   ├── GETTING_STARTED.md (Guide démarrage)
│   ├── TECHNICAL_DOCS.md (Documentation technique)
│   ├── DEPLOYMENT_CHECKLIST.md (Checklist déploiement)
│   └── DOCS_INDEX.md (Ce fichier)
│
├── 🎨 Configuration
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   └── middleware.ts
│
├── 🗄️ Base de données
│   └── supabase/
│       ├── schema.sql
│       ├── sample-data.sql
│       └── README.md
│
├── 📱 Application
│   ├── app/ (Routes Next.js 14)
│   │   ├── page.tsx (Accueil)
│   │   ├── movies/ (Films)
│   │   ├── series/ (Séries)
│   │   ├── watch/[slug]/ (Lecteur)
│   │   ├── admin/ (Backoffice)
│   │   └── login/ (Connexion)
│   │
│   ├── components/ (Composants React)
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── MediaCard.tsx
│   │   ├── MediaCarousel.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── TVShowPlayer.tsx
│   │   └── admin/
│   │
│   └── lib/ (Utilitaires)
│       ├── supabase/ (Clients)
│       ├── database.types.ts
│       ├── types.ts
│       ├── utils.ts
│       ├── actions.ts
│       └── validations/
│
└── 🎨 Styles
    └── app/globals.css
```

## 🔍 Recherche Rapide

### Je veux...

#### ...installer le projet

→ [GETTING_STARTED.md](GETTING_STARTED.md) - Section "Installation"

#### ...configurer Supabase

→ [supabase/README.md](supabase/README.md)
→ [GETTING_STARTED.md](GETTING_STARTED.md) - Section "Configurer Supabase"

#### ...créer un compte admin

→ [GETTING_STARTED.md](GETTING_STARTED.md) - Section "Créer votre compte admin"

#### ...ajouter du contenu

→ [GETTING_STARTED.md](GETTING_STARTED.md) - Section "Premiers pas"

#### ...déployer en production

→ [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

#### ...comprendre l'architecture

→ [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)

#### ...modifier le design

→ [app/globals.css](app/globals.css)
→ [tailwind.config.ts](tailwind.config.ts)

#### ...ajouter une fonctionnalité

→ [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) - Section "Extensions futures"

#### ...résoudre un problème

→ [GETTING_STARTED.md](GETTING_STARTED.md) - Section "Résolution de problèmes"
→ [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Section "Résolution rapide"

## 📊 Flux de Travail Typique

### 1. Développement local

```bash
# Installation
npm install

# Configuration
cp .env.local.example .env.local
# Éditer .env.local avec vos clés Supabase

# Lancement
npm run dev
```

### 2. Ajout de contenu

1. Accéder à `/admin`
2. Créer des catégories
3. Ajouter des médias (films/séries)
4. Tester sur le front

### 3. Déploiement

```bash
# Build local
npm run build
npm start

# Déploiement Vercel
vercel --prod
```

## 🎯 Ressources par Cas d'Usage

### Cas 1 : Nouveau sur le projet

1. [README.md](README.md) - Comprendre le projet
2. [GETTING_STARTED.md](GETTING_STARTED.md) - Installation
3. Interface admin pour ajouter du contenu

### Cas 2 : Développeur rejoignant l'équipe

1. [README.md](README.md) - Vue d'ensemble
2. [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) - Architecture
3. [lib/](lib/) - Code utilitaire
4. [components/](components/) - Composants UI

### Cas 3 : Déploiement en production

1. [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Checklist complète
2. Configuration des variables d'environnement
3. Test de toutes les fonctionnalités

### Cas 4 : Maintenance et évolution

1. [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) - Extensions futures
2. [lib/actions.ts](lib/actions.ts) - Server Actions existantes
3. [supabase/schema.sql](supabase/schema.sql) - Schéma DB

## 🔗 Liens Externes Utiles

### Next.js

- [Documentation officielle](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [API Reference](https://nextjs.org/docs/app/api-reference)

### Supabase

- [Documentation](https://supabase.com/docs)
- [Dashboard](https://supabase.com/dashboard)
- [SQL Editor](https://supabase.com/dashboard/project/_/sql)

### Tailwind CSS

- [Documentation](https://tailwindcss.com/docs)
- [Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)

### React & TypeScript

- [React Docs](https://react.dev/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## 📞 Support

### Problème technique

1. Consulter [GETTING_STARTED.md](GETTING_STARTED.md) - "Résolution de problèmes"
2. Vérifier [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - "Résolution rapide"
3. Consulter les logs (Vercel/Supabase)

### Question sur l'architecture

→ [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)

### Besoin d'aide

- GitHub Issues
- Stack Overflow
- Discord Next.js / Supabase

---

**💡 Conseil :** Ajoutez cette page à vos favoris pour un accès rapide à toute la documentation !

**Dernière mise à jour :** Décembre 2025
