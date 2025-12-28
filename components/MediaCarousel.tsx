"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import Link from "next/link";
import MediaCard from "./MediaCard";
import { Media } from "@/lib/types";

interface MediaCarouselProps {
  title: string;
  items: Media[];
  viewAllHref?: string;
}

export default function MediaCarousel({ title, items, viewAllHref }: MediaCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      const newScrollLeft =
        direction === "left"
          ? carouselRef.current.scrollLeft - scrollAmount
          : carouselRef.current.scrollLeft + scrollAmount;

      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      setTimeout(checkScroll, 300);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="relative group">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-sm text-red-500 hover:text-red-400 font-medium transition-colors"
          >
            Voir tout →
          </Link>
        )}
      </div>

      {/* Bouton gauche */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Défiler vers la gauche"
        >
          <ChevronLeft className="h-6 w-6 text-white" />
        </button>
      )}

      {/* Carousel */}
      <div
        ref={carouselRef}
        onScroll={checkScroll}
        className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, index) => (
          <div key={item.id} className="flex-none w-[150px] md:w-[200px]">
            <MediaCard media={item} priority={index < 6} />
          </div>
        ))}
      </div>

      {/* Bouton droit */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Défiler vers la droite"
        >
          <ChevronRight className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  );
}
