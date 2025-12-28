import { Shield } from "lucide-react";

export const metadata = {
  title: "Politique de Confidentialité - Movio TV",
  description: "Politique de confidentialité et protection des données de Movio TV.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Politique de Confidentialité</h1>
      </div>

      <p className="text-sm text-muted-foreground mb-8">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>

      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            1. Collecte des Données
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Nous collectons les informations suivantes lorsque vous utilisez Movio TV :
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <strong className="text-foreground">Données de compte :</strong> email, nom d'utilisateur, mot de passe (crypté)</li>
            <li>• <strong className="text-foreground">Données d'utilisation :</strong> historique de visionnage, favoris, notations</li>
            <li>• <strong className="text-foreground">Données techniques :</strong> adresse IP, type de navigateur, appareil utilisé</li>
            <li>• <strong className="text-foreground">Cookies :</strong> pour améliorer votre expérience et mémoriser vos préférences</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            2. Utilisation des Données
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Nous utilisons vos données pour :
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Fournir et améliorer nos services</li>
            <li>• Personnaliser votre expérience de streaming</li>
            <li>• Vous envoyer des notifications importantes (changements de service, mises à jour)</li>
            <li>• Analyser l'utilisation de la plateforme pour l'optimiser</li>
            <li>• Détecter et prévenir les fraudes ou abus</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            3. Partage des Données
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations 
            uniquement dans les cas suivants :
          </p>
          <ul className="space-y-2 text-muted-foreground mt-3">
            <li>• Avec votre consentement explicite</li>
            <li>• Avec des prestataires de services qui nous aident à exploiter la plateforme (hébergement, analytics)</li>
            <li>• Pour se conformer à des obligations légales ou répondre à des demandes légales</li>
            <li>• Pour protéger nos droits, notre propriété ou notre sécurité</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            4. Sécurité des Données
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Nous prenons la sécurité de vos données très au sérieux. Nous utilisons des mesures 
            techniques et organisationnelles appropriées pour protéger vos informations personnelles 
            contre tout accès non autorisé, modification, divulgation ou destruction. Cela inclut :
          </p>
          <ul className="space-y-2 text-muted-foreground mt-3">
            <li>• Chiffrement SSL/TLS pour toutes les communications</li>
            <li>• Mots de passe cryptés avec des algorithmes sécurisés</li>
            <li>• Accès restreint aux données personnelles</li>
            <li>• Audits de sécurité réguliers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            5. Vos Droits
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="space-y-2 text-muted-foreground">
            <li>• <strong className="text-foreground">Droit d'accès :</strong> obtenir une copie de vos données personnelles</li>
            <li>• <strong className="text-foreground">Droit de rectification :</strong> corriger des données inexactes</li>
            <li>• <strong className="text-foreground">Droit à l'effacement :</strong> demander la suppression de vos données</li>
            <li>• <strong className="text-foreground">Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
            <li>• <strong className="text-foreground">Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
          </ul>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Pour exercer ces droits, contactez-nous via notre page de contact.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            6. Cookies
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Nous utilisons des cookies pour améliorer votre expérience. Les cookies sont de petits 
            fichiers texte stockés sur votre appareil. Vous pouvez configurer votre navigateur pour 
            refuser les cookies, mais cela peut affecter certaines fonctionnalités du site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            7. Conservation des Données
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos 
            services ou pour nous conformer à nos obligations légales. Lorsque vous supprimez votre 
            compte, vos données sont effacées sous 30 jours.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            8. Services Tiers
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Notre plateforme peut contenir des liens vers des sites tiers. Nous ne sommes pas 
            responsables de leurs pratiques de confidentialité. Nous vous encourageons à lire leur 
            politique de confidentialité.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            9. Modifications
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Nous pouvons mettre à jour cette politique de confidentialité. Les modifications seront 
            publiées sur cette page avec une nouvelle date de mise à jour. Nous vous encourageons à 
            consulter régulièrement cette page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            10. Contact
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Pour toute question concernant cette politique de confidentialité ou vos données personnelles, 
            contactez-nous via notre page de contact.
          </p>
        </section>
      </div>
    </div>
  );
}
