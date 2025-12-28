import { HelpCircle } from "lucide-react";

export const metadata = {
  title: "FAQ - Movio TV",
  description: "Questions fréquemment posées sur Movio TV.",
};

export default function FAQPage() {
  const faqs = [
    {
      category: "Compte et Inscription",
      questions: [
        {
          q: "Comment créer un compte sur Movio TV ?",
          a: "Cliquez sur 'S'inscrire' en haut à droite, remplissez le formulaire avec votre email, un nom d'utilisateur et un mot de passe. Vous serez automatiquement connecté après validation.",
        },
        {
          q: "J'ai oublié mon mot de passe, que faire ?",
          a: "Sur la page de connexion, cliquez sur 'Mot de passe oublié ?'. Entrez votre email et suivez les instructions qui vous seront envoyées par email pour réinitialiser votre mot de passe.",
        },
        {
          q: "Puis-je changer mon nom d'utilisateur ?",
          a: "Oui, rendez-vous sur votre page de profil, cliquez sur 'Modifier le profil' et changez votre nom d'utilisateur. N'oubliez pas de sauvegarder vos modifications.",
        },
        {
          q: "Comment supprimer mon compte ?",
          a: "Pour supprimer votre compte, contactez-nous via la page de contact. Notez que cette action est irréversible et toutes vos données (historique, favoris, notes) seront effacées.",
        },
      ],
    },
    {
      category: "Lecture et Streaming",
      questions: [
        {
          q: "La vidéo ne se charge pas, que faire ?",
          a: "Vérifiez votre connexion internet, actualisez la page (F5), videz le cache de votre navigateur, ou essayez un autre navigateur. Si le problème persiste, contactez notre support.",
        },
        {
          q: "Quelle est la qualité de streaming disponible ?",
          a: "Nous proposons plusieurs qualités de streaming (SD, HD, Full HD) qui s'adaptent automatiquement à votre connexion internet pour une expérience optimale.",
        },
        {
          q: "Puis-je télécharger des vidéos pour les regarder hors ligne ?",
          a: "Le téléchargement hors ligne n'est pas encore disponible mais fait partie de nos fonctionnalités prévues pour une prochaine mise à jour.",
        },
        {
          q: "Comment activer les sous-titres ?",
          a: "Pendant la lecture, cliquez sur l'icône 'CC' ou 'Sous-titres' dans le lecteur vidéo et sélectionnez votre langue préférée.",
        },
        {
          q: "La vidéo est saccadée, que faire ?",
          a: "Vérifiez votre vitesse de connexion internet, fermez les autres onglets ou applications consommant de la bande passante, et essayez de réduire la qualité vidéo dans les paramètres du lecteur.",
        },
      ],
    },
    {
      category: "Fonctionnalités",
      questions: [
        {
          q: "Comment ajouter un film ou une série à mes favoris ?",
          a: "Sur la page du contenu, cliquez sur l'icône cœur ou le bouton 'Ajouter aux favoris'. Vous devez être connecté pour utiliser cette fonctionnalité.",
        },
        {
          q: "Comment noter un film ou une série ?",
          a: "Sur la page du contenu, cliquez sur les étoiles sous le titre pour donner votre note de 1 à 10. Votre note contribue à la note moyenne affichée.",
        },
        {
          q: "Où puis-je voir mon historique de visionnage ?",
          a: "Rendez-vous sur votre page de profil. Vous y trouverez un onglet 'Historique' avec tous les contenus que vous avez regardés.",
        },
        {
          q: "Comment rechercher un film ou une série ?",
          a: "Utilisez la barre de recherche en haut de la page (icône loupe). Tapez le titre, un acteur ou un réalisateur, et les résultats s'afficheront en temps réel.",
        },
        {
          q: "Comment sont organisés les contenus ?",
          a: "Les contenus sont organisés par catégories (Action, Comédie, Drame, etc.) et par type (Films, Séries). Vous pouvez également parcourir les nouveautés et les contenus populaires.",
        },
      ],
    },
    {
      category: "Technique et Compatibilité",
      questions: [
        {
          q: "Sur quels appareils puis-je regarder Movio TV ?",
          a: "Movio TV fonctionne sur ordinateur (Windows, Mac, Linux), tablette et smartphone (iOS, Android). Il vous suffit d'un navigateur web moderne.",
        },
        {
          q: "Quels navigateurs sont compatibles ?",
          a: "Nous recommandons les dernières versions de Chrome, Firefox, Safari ou Edge. Pour une expérience optimale, utilisez un navigateur à jour.",
        },
        {
          q: "Puis-je regarder sur plusieurs appareils en même temps ?",
          a: "Oui, vous pouvez vous connecter sur plusieurs appareils avec le même compte et regarder différents contenus simultanément.",
        },
        {
          q: "Le site ne s'affiche pas correctement, que faire ?",
          a: "Essayez de vider le cache de votre navigateur, désactivez temporairement les extensions (bloqueurs de pub), ou essayez un autre navigateur.",
        },
      ],
    },
    {
      category: "Contenu",
      questions: [
        {
          q: "À quelle fréquence de nouveaux contenus sont ajoutés ?",
          a: "Nous ajoutons régulièrement de nouveaux films et séries. Consultez la section 'Nouveautés' pour découvrir les derniers ajouts.",
        },
        {
          q: "Puis-je suggérer un film ou une série à ajouter ?",
          a: "Oui ! Contactez-nous via la page de contact avec vos suggestions. Nous essayons d'ajouter les contenus les plus demandés par notre communauté.",
        },
        {
          q: "Les contenus sont-ils en version originale ?",
          a: "Nous proposons les contenus en version originale avec sous-titres et, quand disponible, en version doublée française.",
        },
        {
          q: "Y a-t-il du contenu pour enfants ?",
          a: "Oui, nous avons une sélection de contenus adaptés à tous les âges. Utilisez les filtres de recherche pour trouver du contenu familial.",
        },
      ],
    },
    {
      category: "Confidentialité et Sécurité",
      questions: [
        {
          q: "Mes données personnelles sont-elles protégées ?",
          a: "Oui, nous prenons la sécurité très au sérieux. Toutes vos données sont chiffrées et nous ne les partageons jamais avec des tiers. Consultez notre politique de confidentialité pour plus de détails.",
        },
        {
          q: "Puis-je modifier mes informations personnelles ?",
          a: "Oui, rendez-vous sur votre page de profil pour modifier votre email, nom d'utilisateur et autres informations.",
        },
        {
          q: "Comment puis-je me déconnecter ?",
          a: "Cliquez sur l'icône de profil en haut à droite, puis sur 'Déconnexion'. Vous serez redirigé vers la page d'accueil.",
        },
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg">
          <HelpCircle className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold">Foire Aux Questions</h1>
          <p className="text-muted-foreground mt-2">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-12">
        <input
          type="text"
          placeholder="Rechercher une question..."
          className="w-full px-6 py-4 bg-secondary rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Questions par catégorie */}
      <div className="space-y-12">
        {faqs.map((category) => (
          <section key={category.category}>
            <h2 className="text-2xl font-bold mb-6 text-red-500">
              {category.category}
            </h2>
            <div className="space-y-4">
              {category.questions.map((faq, index) => (
                <details
                  key={index}
                  className="group bg-secondary/50 rounded-lg border border-border overflow-hidden"
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between p-5 hover:bg-secondary transition-colors">
                    <span className="font-semibold pr-4">{faq.q}</span>
                    <span className="text-red-500 transition-transform group-open:rotate-180 flex-shrink-0">
                      ▼
                    </span>
                  </summary>
                  <div className="px-5 pb-5 pt-2 text-muted-foreground leading-relaxed border-t border-border">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Contact */}
      <div className="mt-16 text-center bg-red-500/10 border border-red-500 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-3 text-red-500">
          Vous n'avez pas trouvé votre réponse ?
        </h2>
        <p className="text-muted-foreground mb-6">
          Notre équipe support est disponible pour vous aider
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
        >
          Contactez-nous
        </a>
      </div>
    </div>
  );
}
