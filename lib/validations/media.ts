import { z } from "zod";

export const movieSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  poster_url: z.string().url("URL invalide").optional().or(z.literal("")),
  backdrop_url: z.string().url("URL invalide").optional().or(z.literal("")),
  embed_url: z.string().min(1, "Le lien de lecture est requis"),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  rating: z.coerce.number().min(0).max(10).optional(),
  duration: z.coerce.number().int().min(1).optional(),
  status: z.enum(["draft", "published", "archived"]),
  categories: z.array(z.string()).min(1, "Au moins une catégorie est requise"),
});

export const tvShowSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  poster_url: z.string().url("URL invalide").optional().or(z.literal("")),
  backdrop_url: z.string().url("URL invalide").optional().or(z.literal("")),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  rating: z.coerce.number().min(0).max(10).optional(),
  status: z.enum(["draft", "published", "archived"]),
  categories: z.array(z.string()).min(1, "Au moins une catégorie est requise"),
});

export const seasonSchema = z.object({
  season_number: z.coerce
    .number()
    .int()
    .min(1, "Le numéro de saison est requis"),
  title: z.string().optional(),
  description: z.string().optional(),
  poster_url: z.string().url("URL invalide").optional().or(z.literal("")),
});

export const episodeSchema = z.object({
  episode_number: z.coerce
    .number()
    .int()
    .min(1, "Le numéro d'épisode est requis"),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  embed_url: z.string().min(1, "Le lien de lecture est requis"),
  duration: z.coerce.number().int().min(1).optional(),
  thumbnail_url: z.string().url("URL invalide").optional().or(z.literal("")),
});

export type MovieFormData = z.infer<typeof movieSchema>;
export type TVShowFormData = z.infer<typeof tvShowSchema>;
export type SeasonFormData = z.infer<typeof seasonSchema>;
export type EpisodeFormData = z.infer<typeof episodeSchema>;
