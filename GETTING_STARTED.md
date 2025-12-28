# Guide de Démarrage Rapide - Movio TV

## 🚀 Installation en 5 minutes

### 1. Cloner et installer

```bash
# Si vous avez cloné le repo
npm install

# Ou créer depuis zéro
npx create-next-app@latest movio-tv --typescript --tailwind --app
cd movio-tv
```

### 2. Configurer Supabase

#### a. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL et votre clé anonyme

#### b. Exécuter le schéma SQL

1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Copiez le contenu de `supabase/schema.sql`
3. Cliquez sur **Run**

#### c. Configurer les variables d'environnement

```bash
cp .env.local.example .env.local
```

Éditez `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 3. Créer votre compte admin

#### Option 1 : Via l'interface Supabase

1. Allez dans **Authentication** > **Users**
2. Créez un nouveau user
3. Notez l'email utilisé

#### Option 2 : Via l'application

1. Lancez `npm run dev`
2. Créez un compte sur `/login`

#### Donner les droits admin

Dans le **SQL Editor** de Supabase :

```sql
UPDATE public.profiles
SET is_admin = true
WHERE email = 'votre-email@example.com';
```

### 4. Lancer l'application

```bash
npm run dev
```

Accédez à :

- **Front** : http://localhost:3000
- **Admin** : http://localhost:3000/admin
- **Login** : http://localhost:3000/login

## 📝 Premiers pas

### Ajouter des catégories

1. Allez sur `/admin/categories`
2. Créez quelques genres : Action, Drame, Comédie, etc.

### Ajouter un film

1. Allez sur `/admin/media`
2. Cliquez sur **"Ajouter un film"**
3. Remplissez :
   - **Titre** : Ex: "Matrix"
   - **Description** : Synopsis du film
   - **Poster URL** : Lien vers l'affiche (ex: depuis TMDB)
   - **Backdrop URL** : Lien vers l'image de fond
   - **Embed URL** : Votre lien Lulustream
   - **Année** : 1999
   - **Note** : 8.7
   - **Durée** : 136 minutes
   - **Catégories** : Sélectionnez "Action" et "Science-Fiction"
   - **Statut** : "Publié"
4. Enregistrez

### Ajouter une série

1. Cliquez sur **"Ajouter une série"**
2. Remplissez les infos de base (sans embed_url pour les séries)
3. Après création, ajoutez des saisons
4. Pour chaque saison, ajoutez des épisodes avec leurs liens

## 🎨 Où trouver des images ?

### TMDB (The Movie Database)

```
https://www.themoviedb.org/
```

1. Cherchez votre film/série
2. Clic droit sur le poster > Copier l'adresse de l'image
3. Utilisez le lien complet

### Format recommandé

- **Poster** : 2:3 (ex: 400x600px)
- **Backdrop** : 16:9 (ex: 1920x1080px)

## 🔧 Personnalisation

### Changer les couleurs

Éditez `tailwind.config.ts` :

```typescript
colors: {
  primary: {
    DEFAULT: 'hsl(var(--primary))',
    // Changez la valeur de --primary dans globals.css
  },
}
```

### Modifier le logo

Remplacez l'icône dans `components/Navbar.tsx` et `components/Footer.tsx`

### Ajouter une page

Créez un fichier dans `app/` :

```typescript
// app/about/page.tsx
export default function AboutPage() {
  return <div>À propos</div>;
}
```

## 🐛 Résolution de problèmes

### Erreur de connexion Supabase

- Vérifiez vos clés dans `.env.local`
- Assurez-vous que le fichier est à la racine
- Redémarrez le serveur (`npm run dev`)

### Pas d'accès à l'admin

```sql
-- Vérifiez votre statut admin
SELECT email, is_admin FROM public.profiles WHERE email = 'votre-email';

-- Si is_admin est false
UPDATE public.profiles SET is_admin = true WHERE email = 'votre-email';
```

### Images ne s'affichent pas

- Vérifiez que les URLs sont valides
- Vérifiez `next.config.js` pour les domaines autorisés

### Erreur RLS (Row Level Security)

- Assurez-vous d'avoir exécuté tout le schéma SQL
- Vérifiez que les policies sont activées dans Supabase

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)

## 🎯 Prochaines étapes

1. ✅ Configurez votre base de données
2. ✅ Créez votre compte admin
3. ✅ Ajoutez des catégories
4. ✅ Ajoutez votre premier contenu
5. 🚀 Partagez avec vos utilisateurs !

## 💡 Conseils

- Commencez avec le statut "Brouillon" pour tester
- Utilisez des images de qualité pour un meilleur rendu
- Testez sur mobile avant de publier
- Sauvegardez régulièrement votre base de données

Bon streaming ! 🎬
