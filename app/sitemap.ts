import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Récupérer tous les médias publiés
  const { data: media } = await supabase
    .from("media")
    .select("slug, updated_at")
    .eq("status", "published")
    .returns<any[]>();

  const baseUrl = "https://movio-tv.vercel.app";

  // Pages statiques
  const routes = ["", "/movies", "/series"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Pages de médias dynamiques
  const mediaRoutes = (media || []).map((item) => ({
    url: `${baseUrl}/watch/${item.slug}`,
    lastModified: new Date(item.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...routes, ...mediaRoutes];
}
