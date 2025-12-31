"use client";

import { Suspense } from "react";
import SearchPageClient from "@/components/SearchPageClient";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">Chargement...</div>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
}
