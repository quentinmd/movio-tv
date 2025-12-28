import { Film } from "lucide-react";

export const metadata = {
  title: "Notre Histoire - Movio TV",
  description: "Découvrez l'histoire de Movio TV et notre passion pour le streaming.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center space-x-3 mb-8">
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-3 rounded-lg">
          <Film className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold">Notre Histoire</h1>
      </div>

      <div className="prose prose-invert max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            Une Passion pour le Cinéma
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Movio TV est né de la passion de créer une plateforme de streaming moderne et accessible à tous. 
            Notre mission est de vous offrir une expérience de visionnage exceptionnelle avec les meilleurs 
            films et séries du moment.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            Notre Vision
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Nous croyons que le divertissement de qualité doit être accessible à tous. C'est pourquoi nous 
            travaillons sans relâche pour vous proposer un catalogue diversifié, une interface intuitive 
            et une qualité de streaming optimale.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            Nos Valeurs
          </h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span><strong className="text-foreground">Qualité :</strong> Des contenus soigneusement sélectionnés en haute définition</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span><strong className="text-foreground">Innovation :</strong> Une plateforme moderne avec les dernières technologies</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span><strong className="text-foreground">Communauté :</strong> Un espace pour partager et découvrir ensemble</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span><strong className="text-foreground">Accessibilité :</strong> Une expérience fluide sur tous vos appareils</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            L'Équipe
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Derrière Movio TV se trouve une équipe passionnée de développeurs, designers et cinéphiles 
            dévoués à créer la meilleure expérience de streaming possible. Nous écoutons nos utilisateurs 
            et améliorons constamment la plateforme.
          </p>
        </section>

        <section className="bg-secondary/50 p-6 rounded-lg border border-border mt-8">
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            Rejoignez-nous
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Faites partie de la communauté Movio TV et profitez d'une expérience de streaming 
            exceptionnelle. Inscrivez-vous dès aujourd'hui et découvrez des milliers de contenus !
          </p>
        </section>
      </div>
    </div>
  );
}
