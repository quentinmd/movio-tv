# 📋 Checklist de Mise en Production - Movio TV

## ✅ Avant le déploiement

### Configuration Supabase

- [ ] Projet Supabase créé
- [ ] Schéma SQL exécuté (`supabase/schema.sql`)
- [ ] Données de test ajoutées (optionnel : `supabase/sample-data.sql`)
- [ ] Au moins un compte admin créé
- [ ] RLS (Row Level Security) activé et testé
- [ ] Policies vérifiées pour tous les rôles

### Configuration Next.js

- [ ] Variables d'environnement configurées (`.env.local`)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` défini
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` défini
- [ ] Build local réussi (`npm run build`)
- [ ] Tests en mode production (`npm start`)

### Contenu initial

- [ ] Au moins 3 catégories créées
- [ ] Au moins 1 film ajouté avec toutes les infos
- [ ] Au moins 1 série avec saisons et épisodes
- [ ] Images testées (poster et backdrop fonctionnels)
- [ ] Liens de streaming vérifiés

### Sécurité

- [ ] Middleware admin testé (redirection si non-admin)
- [ ] Page de login fonctionnelle
- [ ] Déconnexion fonctionnelle
- [ ] Routes publiques accessibles sans auth
- [ ] Routes admin protégées

### Design & UX

- [ ] Dark mode actif par défaut
- [ ] Responsive testé (mobile, tablette, desktop)
- [ ] Carrousels fonctionnels avec scroll
- [ ] Lecteur vidéo responsive
- [ ] Navigation fluide sans rechargement

### Performance

- [ ] Images optimisées (Next.js Image)
- [ ] Pages en cache (revalidate configuré)
- [ ] Pas d'erreurs console
- [ ] Temps de chargement < 3s

## 🚀 Déploiement

### Option 1 : Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer
vercel --prod
```

**Configuration Vercel Dashboard :**

- [ ] Variables d'environnement ajoutées
- [ ] Build settings vérifiés
- [ ] Domain personnalisé configuré (optionnel)

### Option 2 : Autre plateforme

- [ ] Plateforme compatible Next.js 14
- [ ] Node.js 18+ supporté
- [ ] Variables d'environnement configurées
- [ ] Build command : `npm run build`
- [ ] Start command : `npm start`

## ✅ Après le déploiement

### Tests de production

- [ ] Page d'accueil accessible
- [ ] Carrousels chargent correctement
- [ ] Page `/watch/[slug]` fonctionne
- [ ] Vidéos se chargent (iframe)
- [ ] Login admin fonctionnel
- [ ] Dashboard admin accessible
- [ ] CRUD médias opérationnel
- [ ] Gestion catégories OK

### Monitoring

- [ ] Logs Vercel/Platform configurés
- [ ] Logs Supabase consultés
- [ ] Erreurs 404 gérées
- [ ] Erreurs 500 tracées

### SEO & Meta

- [ ] Titles personnalisés par page
- [ ] Meta descriptions ajoutées
- [ ] OG tags configurés (optionnel)
- [ ] Favicon présent
- [ ] Sitemap généré (optionnel)

## 📊 Maintenance continue

### Hebdomadaire

- [ ] Vérifier les logs d'erreur
- [ ] Ajouter du nouveau contenu
- [ ] Répondre aux feedbacks utilisateurs

### Mensuel

- [ ] Backup de la base de données
- [ ] Mise à jour des dépendances
- [ ] Analyse des performances
- [ ] Optimisation des images

### Annuel

- [ ] Migration Next.js (si nouvelle version)
- [ ] Audit de sécurité
- [ ] Refonte design (si nécessaire)

## 🐛 Résolution rapide

### Site ne charge pas

1. Vérifier les variables d'environnement
2. Consulter les logs de build
3. Vérifier la connexion Supabase

### Admin inaccessible

1. Vérifier `is_admin = true` dans la DB
2. Tester le middleware localement
3. Clear cookies et reconnecter

### Images ne s'affichent pas

1. Vérifier `next.config.js` remotePatterns
2. Tester les URLs en direct
3. Vérifier les CORS

### Vidéos ne chargent pas

1. Vérifier les embed_url
2. Tester les iframes manuellement
3. Vérifier les attributs `allow`

## 📞 Support

### Ressources

- Documentation : [README.md](README.md)
- Guide démarrage : [GETTING_STARTED.md](GETTING_STARTED.md)
- Docs techniques : [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md)

### Communauté

- Next.js Discord
- Supabase Discord
- Stack Overflow

---

**Note finale :** Prenez le temps de tester chaque fonctionnalité avant de partager le lien avec vos utilisateurs. Une bonne première impression est essentielle ! 🎬
