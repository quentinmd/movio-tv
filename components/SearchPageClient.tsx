"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SearchContent from "@/components/SearchContent";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        Résultats de recherche
        {query && ` : "${query}"`}
      </h1>

      <Suspense
        fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-secondary rounded-lg animate-pulse"
              />
            ))}
          </div>
        }
      >
        <SearchContent query={query} />
      </Suspense>
    </div>
  );
}
