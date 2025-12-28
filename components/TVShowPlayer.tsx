"use client";

import { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import { Episode, Season } from "@/lib/types";

interface TVShowPlayerProps {
  title: string;
  seasons: (Season & { episodes: Episode[] })[];
}

export default function TVShowPlayer({ title, seasons }: TVShowPlayerProps) {
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState(0);

  const currentSeason = seasons[selectedSeasonIndex];
  const currentEpisode = currentSeason?.episodes[selectedEpisodeIndex];

  if (!currentSeason || !currentEpisode) {
    return (
      <div className="bg-secondary p-8 rounded-lg text-center">
        <p className="text-muted-foreground">Aucun épisode disponible</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lecteur vidéo */}
      <VideoPlayer
        embedUrl={currentEpisode.embed_url}
        title={`${title} - S${currentSeason.season_number}E${currentEpisode.episode_number}`}
      />

      {/* Informations de l'épisode actuel */}
      <div className="bg-secondary p-6 rounded-lg">
        <div className="flex items-center space-x-4 mb-2">
          <h2 className="text-2xl font-bold">{currentEpisode.title}</h2>
          <span className="text-muted-foreground">
            S{currentSeason.season_number} E{currentEpisode.episode_number}
          </span>
        </div>
        {currentEpisode.description && (
          <p className="text-muted-foreground">{currentEpisode.description}</p>
        )}
      </div>

      {/* Sélecteur de saison */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Saisons</h3>
        <div className="flex flex-wrap gap-2">
          {seasons.map((season, index) => (
            <button
              key={season.id}
              onClick={() => {
                setSelectedSeasonIndex(index);
                setSelectedEpisodeIndex(0);
              }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                index === selectedSeasonIndex
                  ? "bg-red-600 text-white"
                  : "bg-secondary hover:bg-secondary/70"
              }`}
            >
              Saison {season.season_number}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des épisodes */}
      <div>
        <h3 className="text-lg font-semibold mb-3">
          Épisodes - Saison {currentSeason.season_number}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentSeason.episodes.map((episode, index) => (
            <button
              key={episode.id}
              onClick={() => setSelectedEpisodeIndex(index)}
              className={`text-left p-4 rounded-lg transition-all ${
                index === selectedEpisodeIndex
                  ? "bg-red-600 text-white ring-2 ring-red-500"
                  : "bg-secondary hover:bg-secondary/70"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold">
                  Épisode {episode.episode_number}
                </span>
                {episode.duration && (
                  <span className="text-xs opacity-70">
                    {episode.duration} min
                  </span>
                )}
              </div>
              <h4 className="font-medium line-clamp-1 mb-1">{episode.title}</h4>
              {episode.description && (
                <p className="text-sm opacity-70 line-clamp-2">
                  {episode.description}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
