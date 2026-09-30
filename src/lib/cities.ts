import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { Budget, City, Environment, RegionGroup, Season } from "@/lib/mock-data";

type CityRow = Database["public"]["Tables"]["cities"]["Row"];
export type ReactionType = "like" | "dislike";

function toCity(row: CityRow, counts: { like: number; dislike: number } | undefined): City {
  return {
    id: row.id,
    name: row.name,
    region: row.region,
    regionGroup: row.region_group as RegionGroup,
    likeCount: counts?.like ?? 0,
    dislikeCount: counts?.dislike ?? 0,
    monthlyCostManwon: row.monthly_cost_manwon,
    budget: row.budget as Budget,
    environment: row.environment as Environment[],
    bestSeason: row.best_season as Season,
    emoji: row.emoji,
    gradient: row.gradient,
  };
}

export async function getCities(supabase: SupabaseClient<Database>): Promise<City[]> {
  const [{ data: cityRows, error: citiesError }, { data: countRows, error: countsError }] = await Promise.all([
    supabase.from("cities").select("*").order("display_order"),
    supabase.from("city_reaction_counts").select("*"),
  ]);

  if (citiesError) throw citiesError;
  if (countsError) throw countsError;

  const countsById = new Map(
    (countRows ?? [])
      .filter((row): row is { city_id: string; like_count: number | null; dislike_count: number | null } =>
        row.city_id !== null
      )
      .map((row) => [row.city_id, { like: row.like_count ?? 0, dislike: row.dislike_count ?? 0 }])
  );

  return (cityRows ?? []).map((row) => toCity(row, countsById.get(row.id)));
}

export async function getUserReactions(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<Record<string, ReactionType>> {
  const { data, error } = await supabase
    .from("city_reactions")
    .select("city_id, reaction_type")
    .eq("user_id", userId);

  if (error) throw error;

  return Object.fromEntries((data ?? []).map((row) => [row.city_id, row.reaction_type as ReactionType]));
}
