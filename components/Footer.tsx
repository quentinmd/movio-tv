import Link from "next/link";
import { Film, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "À propos": [
      { label: "Notre histoire", href: "/about" },
      { label: "Conditions d'utilisation", href: "/terms" },
      { label: "Politique de confidentialité", href: "/privacy" },
    ],
    Support: [
      { label: "Centre d'aide", href: "/help" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
    Contenu: [
      { label: "Films", href: "/movies" },
      { label: "Séries", href: "/series" },
      { label: "Nouveautés", href: "/new" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "Youtube" },
  ];

  return (
    <footer className="bg-secondary/50 border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Logo et description */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-red-600 to-red-500 p-2 rounded-lg">
                <Film className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                Movio TV
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Votre destination ultime pour le streaming de films et séries.
              Découvrez des milliers de contenus en haute qualité.
            </p>

            {/* Réseaux sociaux */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-2 bg-background hover:bg-red-500 rounded-full transition-colors group"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5 group-hover:text-white" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Liens du footer */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Movio TV. Tous droits réservés.
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              Développé avec ❤️ par Movio Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
