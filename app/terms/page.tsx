import { FileText } from "lucide-react";

export const metadata = {
  title: "Conditions d'Utilisation - Movio TV",
  description: "Conditions d'utilisation de la plateforme Movio TV.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Conditions d'Utilisation</h1>
      </div>

      <p className="text-sm text-muted-foreground mb-8">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>

      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            1. Acceptation des Conditions
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            En accédant et en utilisant Movio TV, vous acceptez d'être lié par
            ces conditions d'utilisation. Si vous n'acceptez pas ces conditions,
            veuillez ne pas utiliser notre service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            2. Utilisation du Service
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Vous vous engagez à utiliser Movio TV uniquement à des fins légales
            et conformément à ces conditions. Il est interdit de :
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              • Télécharger, copier ou redistribuer le contenu sans autorisation
            </li>
            <li>
              • Utiliser le service pour des activités illégales ou non
              autorisées
            </li>
            <li>
              • Tenter d'accéder de manière non autorisée aux systèmes ou
              réseaux
            </li>
            <li>• Partager votre compte avec d'autres personnes</li>
            <li>• Utiliser des outils automatisés pour accéder au service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            3. Compte Utilisateur
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Vous êtes responsable de maintenir la confidentialité de vos
            identifiants de connexion et de toutes les activités effectuées sous
            votre compte. Vous devez nous informer immédiatement de toute
            utilisation non autorisée de votre compte.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            4. Contenu et Propriété Intellectuelle
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Tout le contenu disponible sur Movio TV, y compris les films,
            séries, textes, graphiques, logos et logiciels, est protégé par des
            droits d'auteur et d'autres droits de propriété intellectuelle. Vous
            ne pouvez pas copier, modifier ou distribuer ce contenu sans
            autorisation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            5. Disponibilité du Service
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Nous nous efforçons de maintenir le service disponible 24/7, mais
            nous ne garantissons pas qu'il sera ininterrompu ou exempt
            d'erreurs. Nous nous réservons le droit de modifier, suspendre ou
            interrompre tout ou partie du service à tout moment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            6. Limitation de Responsabilité
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Movio TV ne pourra être tenu responsable des dommages directs,
            indirects, accessoires ou consécutifs résultant de l'utilisation ou
            de l'impossibilité d'utiliser le service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            7. Modifications des Conditions
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Nous nous réservons le droit de modifier ces conditions à tout
            moment. Les modifications entreront en vigueur dès leur publication
            sur cette page. Votre utilisation continue du service après les
            modifications constitue votre acceptation des nouvelles conditions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            8. Résiliation
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Nous pouvons suspendre ou résilier votre compte à tout moment si
            vous violez ces conditions ou si nous estimons que votre utilisation
            du service est inappropriée.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">9. Contact</h2>
          <p className="text-muted-foreground leading-relaxed">
            Pour toute question concernant ces conditions d'utilisation,
            veuillez nous contacter via notre page de contact.
          </p>
        </section>
      </div>
    </div>
  );
}
