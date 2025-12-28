import { HelpCircle, Play, User, CreditCard, Settings, AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Centre d'Aide - Movio TV",
  description: "Trouvez des réponses à vos questions sur Movio TV.",
};

export default function HelpPage() {
  const helpCategories = [
    {
      icon: Play,
      title: "Lecture et Streaming",
      description: "Résolution des problèmes de lecture, qualité vidéo, sous-titres",
      topics: [
        "La vidéo ne se charge pas",
        "Problèmes de qualité vidéo",
        "Activer les sous-titres",
        "Vidéo saccadée ou qui se fige",
      ],
    },
    {
      icon: User,
      title: "Compte et Profil",
      description: "Gestion de votre compte, mot de passe, profil utilisateur",
      topics: [
        "Créer un compte",
        "Réinitialiser mon mot de passe",
        "Modifier mon profil",
        "Supprimer mon compte",
      ],
    },
    {
      icon: Settings,
      title: "Paramètres",
      description: "Configuration, préférences, notifications",
      topics: [
        "Changer la langue",
        "Gérer les notifications",
        "Préférences de lecture",
        "Confidentialité",
      ],
    },
    {
      icon: AlertCircle,
      title: "Problèmes Techniques",
      description: "Erreurs, bugs, compatibilité",
      topics: [
        "Erreur de connexion",
        "Le site ne s'affiche pas correctement",
        "Problèmes sur mobile",
        "Compatibilité navigateur",
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg">
          <HelpCircle className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Centre d'Aide</h1>
          <p className="text-muted-foreground mt-2">
            Comment pouvons-nous vous aider aujourd'hui ?
          </p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-12">
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Rechercher dans l'aide..."
            className="w-full px-6 py-4 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
          />
          <HelpCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
        </div>
      </div>

      {/* Catégories d'aide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {helpCategories.map((category) => {
          const Icon = category.icon;
          return (
            <div
              key={category.title}
              className="bg-secondary/50 p-6 rounded-lg border border-border hover:border-red-500 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-red-500/10 p-3 rounded-lg">
                  <Icon className="h-6 w-6 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.description}
                  </p>
                  <ul className="space-y-2">
                    {category.topics.map((topic) => (
                      <li key={topic}>
                        <a
                          href="#"
                          className="text-sm text-muted-foreground hover:text-red-500 transition-colors flex items-center"
                        >
                          <span className="mr-2">•</span>
                          {topic}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ rapide */}
      <div className="bg-secondary/30 p-8 rounded-lg border border-border">
        <h2 className="text-2xl font-bold mb-6">Questions Fréquentes</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer list-none flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
              <span className="font-semibold">Comment créer un compte ?</span>
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div className="p-4 text-muted-foreground">
              Cliquez sur le bouton "S'inscrire" en haut à droite, remplissez le formulaire avec 
              votre email et mot de passe, puis validez. Vous serez automatiquement connecté.
            </div>
          </details>

          <details className="group">
            <summary className="cursor-pointer list-none flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
              <span className="font-semibold">Puis-je regarder sur plusieurs appareils ?</span>
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div className="p-4 text-muted-foreground">
              Oui ! Movio TV fonctionne sur ordinateur, tablette et smartphone. Connectez-vous 
              simplement avec vos identifiants sur n'importe quel appareil.
            </div>
          </details>

          <details className="group">
            <summary className="cursor-pointer list-none flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
              <span className="font-semibold">La vidéo ne se charge pas, que faire ?</span>
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div className="p-4 text-muted-foreground">
              Vérifiez votre connexion internet, actualisez la page, videz le cache de votre 
              navigateur, ou essayez un autre navigateur. Si le problème persiste, contactez-nous.
            </div>
          </details>

          <details className="group">
            <summary className="cursor-pointer list-none flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
              <span className="font-semibold">Comment noter un film ou une série ?</span>
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div className="p-4 text-muted-foreground">
              Sur la page du contenu, cliquez sur les étoiles sous le titre pour donner votre note. 
              Vous devez être connecté pour noter.
            </div>
          </details>
        </div>
      </div>

      {/* Contact */}
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Vous ne trouvez pas votre réponse ?</h2>
        <p className="text-muted-foreground mb-6">
          Notre équipe support est là pour vous aider
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/contact"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
          >
            Nous Contacter
          </Link>
          <Link
            href="/faq"
            className="px-6 py-3 bg-secondary hover:bg-secondary/80 rounded-lg font-medium transition-colors"
          >
            Voir toutes les FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
