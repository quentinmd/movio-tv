import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MediaCard from "@/components/MediaCard";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("name")
    .eq("slug", slug)
    .single();

  if (!category) {
    return {
      title: "Catégorie introuvable",
    };
  }

  return {
    title: `${category.name} - Movio TV`,
    description: `Découvrez tous les films et séries dans la catégorie ${category.name}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Récupérer la catégorie
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) {
    notFound();
  }

  // Récupérer les médias de cette catégorie
  const { data: mediaCategories } = await supabase
    .from("media_categories")
    .select(
      `
      media (
        id,
        title,
        slug,
        description,
        poster_url,
        type,
        year,
        rating,
        status
      )
    `
    )
    .eq("category_id", category.id);

  const media =
    mediaCategories
      ?.map((mc: any) => mc.media)
      .filter((m: any) => m && m.status === "published") || [];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* En-tête de la catégorie */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xl text-muted-foreground max-w-3xl">
              {category.description}
            </p>
          )}
          <div className="mt-4 text-muted-foreground">
            {media.length} {media.length > 1 ? "résultats" : "résultat"}
          </div>
        </div>

        {/* Grille des médias */}
        {media.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {media.map((item: any) => (
              <MediaCard key={item.id} media={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">
              Aucun contenu disponible dans cette catégorie pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
