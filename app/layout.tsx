import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://movio-tv.vercel.app'),
  title: {
    default: "Movio TV - Streaming de Films et Séries en HD",
    template: "%s | Movio TV"
  },
  description:
    "Découvrez des milliers de films et séries en streaming haute qualité. Profitez d'un catalogue varié avec les dernières sorties et les classiques incontournables.",
  keywords: ["streaming", "films", "séries", "VOD", "vidéo à la demande", "HD", "Movio TV"],
  authors: [{ name: "Movio TV" }],
  creator: "Movio TV",
  publisher: "Movio TV",
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://movio-tv.vercel.app',
    title: 'Movio TV - Streaming de Films et Séries en HD',
    description: 'Découvrez des milliers de films et séries en streaming haute qualité',
    siteName: 'Movio TV',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Movio TV - Streaming de Films et Séries en HD',
    description: 'Découvrez des milliers de films et séries en streaming haute qualité',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Ajoutez vos codes de vérification ici plus tard
    // google: 'votre-code-google',
    // yandex: 'votre-code-yandex',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
