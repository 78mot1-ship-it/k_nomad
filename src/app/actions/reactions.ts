"use server";

import { refresh } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ReactionType } from "@/lib/cities";

export type ToggleReactionResult =
  | { reaction: ReactionType | null }
  | { error: "unauthenticated" | string };

export async function toggleReaction(
  cityId: string,
  type: ReactionType
): Promise<ToggleReactionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "unauthenticated" };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("city_reactions")
    .select("id, reaction_type")
    .eq("user_id", user.id)
    .eq("city_id", cityId)
    .maybeSingle();

  if (fetchError) {
    return { error: fetchError.message };
  }

  if (existing?.reaction_type === type) {
    const { error } = await supabase.from("city_reactions").delete().eq("id", existing.id);
    if (error) return { error: error.message };
    refresh();
    return { reaction: null };
  }

  const { error } = await supabase
    .from("city_reactions")
    .upsert({ user_id: user.id, city_id: cityId, reaction_type: type }, { onConflict: "user_id,city_id" });

  if (error) return { error: error.message };
  refresh();
  return { reaction: type };
}
