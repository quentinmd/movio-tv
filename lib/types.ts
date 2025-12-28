import { Database } from "./database.types";

export type Media = Database["public"]["Tables"]["media"]["Row"];
export type MediaInsert = Database["public"]["Tables"]["media"]["Insert"];
export type MediaUpdate = Database["public"]["Tables"]["media"]["Update"];

export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type CategoryInsert =
  Database["public"]["Tables"]["categories"]["Insert"];

export type Season = Database["public"]["Tables"]["seasons"]["Row"];
export type SeasonInsert = Database["public"]["Tables"]["seasons"]["Insert"];

export type Episode = Database["public"]["Tables"]["episodes"]["Row"];
export type EpisodeInsert = Database["public"]["Tables"]["episodes"]["Insert"];

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

// Types étendus pour les vues et jointures
export interface MediaWithCategories extends Media {
  categories: Category[];
}

export interface SeasonWithEpisodes extends Season {
  episodes: Episode[];
}

export interface TVShowComplete extends Media {
  seasons: SeasonWithEpisodes[];
}
