"use client";

import Image from "next/image";
import Link from "next/link";
import { Play, Info, Star } from "lucide-react";
import { Media } from "@/lib/types";

interface MediaCardProps {
  media: Media;
  priority?: boolean;
}

export default function MediaCard({ media, priority = false }: MediaCardProps) {
  const imageUrl = media.poster_url || "/placeholder-poster.jpg";

  return (
    <Link
      href={`/watch/${media.slug}`}
      className="group relative block rounded-lg overflow-hidden card-hover"
    >
      <div className="relative aspect-[2/3]">
        <Image
          src={imageUrl}
          alt={media.title}
          fill
          className="object-cover"
          priority={priority}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Overlay au hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <h3 className="font-bold text-white line-clamp-1">{media.title}</h3>

            <div className="flex items-center space-x-2 text-xs text-gray-300">
              {media.year && <span>{media.year}</span>}
              {media.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  <span>{media.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2 pt-2">
              <button className="flex items-center space-x-1 bg-white text-black px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-200 transition-colors">
                <Play className="h-3 w-3" fill="currentColor" />
                <span>Lire</span>
              </button>
              <button className="flex items-center space-x-1 bg-white/20 backdrop-blur text-white px-3 py-1 rounded-full text-xs hover:bg-white/30 transition-colors">
                <Info className="h-3 w-3" />
                <span>Info</span>
              </button>
            </div>
          </div>
        </div>

        {/* Badge type */}
        <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
          {media.type === "movie" ? "Film" : "Série"}
        </div>
      </div>
    </Link>
  );
}
