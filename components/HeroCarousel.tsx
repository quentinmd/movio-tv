"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";

interface Media {
  id: string;
  title: string;
  slug: string;
  description?: string;
  backdrop_url?: string;
  poster_url?: string;
  type: "movie" | "tv";
  year?: number;
  duration?: number;
  rating?: number;
}

interface HeroCarouselProps {
  items: Media[];
}

export default function HeroCarousel({ items }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const currentMedia = items[currentIndex];

  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000); // Change toutes les 8 secondes

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setIsAutoPlaying(false);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  if (!currentMedia) return null;

  return (
    <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] min-h-[400px] md:min-h-[500px] w-full overflow-hidden group">
      {/* Images avec transition */}
      {items.map((media, index) => (
        <div
          key={media.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={media.backdrop_url || media.poster_url || "/placeholder.jpg"}
            alt={media.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* Overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
      ))}

      {/* Boutons navigation */}
      {items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 p-3 rounded-full transition-all opacity-0 group-hover:opacity-100"
            aria-label="Suivant"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>
        </>
      )}

      {/* Contenu avec transition */}
      <div className="relative z-20 container mx-auto px-4 h-full flex items-center">
        <div
          key={currentIndex}
          className="max-w-2xl space-y-2 sm:space-y-3 md:space-y-4 animate-fade-in"
        >
          <div className="inline-block px-2 sm:px-3 py-1 bg-red-600 text-white text-xs sm:text-sm font-semibold rounded">
            {currentMedia.type === "movie" ? "Film" : "Série"} tendance
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
            {currentMedia.title}
          </h1>

          {currentMedia.description && (
            <p className="text-sm sm:text-base md:text-lg text-gray-300 line-clamp-2 md:line-clamp-3">
              {currentMedia.description}
            </p>
          )}

          <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 text-xs sm:text-sm">
            {currentMedia.year && (
              <span className="text-gray-300">{currentMedia.year}</span>
            )}
            {currentMedia.duration && (
              <span className="text-gray-300 hidden sm:inline">
                {currentMedia.duration} min
              </span>
            )}
            {currentMedia.rating && (
              <span className="flex items-center space-x-1 text-yellow-500">
                <span>★</span>
                <span>{currentMedia.rating.toFixed(1)}</span>
              </span>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 md:space-x-4 pt-2 sm:pt-3 md:pt-4">
            <Link
              href={`/watch/${currentMedia.slug}`}
              className="flex items-center justify-center space-x-2 bg-white text-black px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-200 transition-colors"
            >
              <Play className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" />
              <span className="hidden sm:inline">Regarder maintenant</span>
              <span className="sm:hidden">Regarder</span>
            </Link>

            <Link
              href={`/watch/${currentMedia.slug}`}
              className="flex items-center justify-center space-x-2 bg-white/20 backdrop-blur text-white px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-white/30 transition-colors"
            >
              <Info className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Plus d'infos</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Indicateurs de pagination */}
      {items.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 z-20 flex justify-center space-x-1.5 sm:space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-0.5 sm:h-1 rounded-full transition-all ${
                index === currentIndex
                  ? "w-6 sm:w-8 bg-white"
                  : "w-3 sm:w-4 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
