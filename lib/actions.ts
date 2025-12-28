"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMedia(formData: FormData) {
  const supabase = await createClient();

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    type: formData.get("type") as "movie" | "tv",
    poster_url: formData.get("poster_url") as string,
    backdrop_url: formData.get("backdrop_url") as string,
    embed_url: formData.get("embed_url") as string | null,
    year: formData.get("year")
      ? parseInt(formData.get("year") as string)
      : null,
    rating: formData.get("rating")
      ? parseFloat(formData.get("rating") as string)
      : null,
    duration: formData.get("duration")
      ? parseInt(formData.get("duration") as string)
      : null,
    status: formData.get("status") as "draft" | "published" | "archived",
  };

  const { data: media, error } = await supabase
    .from("media")
    .insert(data as any)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/media");
  return media;
}

export async function updateMedia(id: string, formData: FormData) {
  const supabase = await createClient();

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    poster_url: formData.get("poster_url") as string,
    backdrop_url: formData.get("backdrop_url") as string,
    embed_url: formData.get("embed_url") as string | null,
    year: formData.get("year")
      ? parseInt(formData.get("year") as string)
      : null,
    rating: formData.get("rating")
      ? parseFloat(formData.get("rating") as string)
      : null,
    duration: formData.get("duration")
      ? parseInt(formData.get("duration") as string)
      : null,
    status: formData.get("status") as "draft" | "published" | "archived",
  };

  const { error } = await supabase.from("media").update(data as any).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/media");
  revalidatePath(`/watch/${formData.get("slug")}`);
}

export async function deleteMedia(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("media").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/media");
  redirect("/admin/media");
}

export async function createSeason(mediaId: string, formData: FormData) {
  const supabase = await createClient();

  const data = {
    media_id: mediaId,
    season_number: parseInt(formData.get("season_number") as string),
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    poster_url: formData.get("poster_url") as string,
  };

  const { data: season, error } = await supabase
    .from("seasons")
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/media/${mediaId}`);
  return season;
}

export async function createEpisode(seasonId: string, formData: FormData) {
  const supabase = await createClient();

  const data = {
    season_id: seasonId,
    episode_number: parseInt(formData.get("episode_number") as string),
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    embed_url: formData.get("embed_url") as string,
    duration: formData.get("duration")
      ? parseInt(formData.get("duration") as string)
      : null,
    thumbnail_url: formData.get("thumbnail_url") as string,
  };

  const { data: episode, error } = await supabase
    .from("episodes")
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/seasons/${seasonId}`);
  return episode;
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
