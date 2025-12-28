export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
      };
      media: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          poster_url: string | null;
          backdrop_url: string | null;
          type: "movie" | "tv";
          embed_url: string | null;
          year: number | null;
          rating: number | null;
          duration: number | null;
          status: "draft" | "published" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug?: string;
          description?: string | null;
          poster_url?: string | null;
          backdrop_url?: string | null;
          type: "movie" | "tv";
          embed_url?: string | null;
          year?: number | null;
          rating?: number | null;
          duration?: number | null;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          poster_url?: string | null;
          backdrop_url?: string | null;
          type?: "movie" | "tv";
          embed_url?: string | null;
          year?: number | null;
          rating?: number | null;
          duration?: number | null;
          status?: "draft" | "published" | "archived";
          created_at?: string;
          updated_at?: string;
        };
      };
      media_categories: {
        Row: {
          id: string;
          media_id: string;
          category_id: string;
        };
        Insert: {
          id?: string;
          media_id: string;
          category_id: string;
        };
        Update: {
          id?: string;
          media_id?: string;
          category_id?: string;
        };
      };
      seasons: {
        Row: {
          id: string;
          media_id: string;
          season_number: number;
          title: string | null;
          description: string | null;
          poster_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          media_id: string;
          season_number: number;
          title?: string | null;
          description?: string | null;
          poster_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          media_id?: string;
          season_number?: number;
          title?: string | null;
          description?: string | null;
          poster_url?: string | null;
          created_at?: string;
        };
      };
      episodes: {
        Row: {
          id: string;
          season_id: string;
          episode_number: number;
          title: string;
          description: string | null;
          embed_url: string;
          duration: number | null;
          thumbnail_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          season_id: string;
          episode_number: number;
          title: string;
          description?: string | null;
          embed_url: string;
          duration?: number | null;
          thumbnail_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          season_id?: string;
          episode_number?: number;
          title?: string;
          description?: string | null;
          embed_url?: string;
          duration?: number | null;
          thumbnail_url?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      media_with_categories: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          poster_url: string | null;
          backdrop_url: string | null;
          type: "movie" | "tv";
          embed_url: string | null;
          year: number | null;
          rating: number | null;
          duration: number | null;
          status: "draft" | "published" | "archived";
          categories: Json;
          created_at: string;
          updated_at: string;
        };
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      slugify: {
        Args: { text_input: string };
        Returns: string;
      };
    };
  };
}
