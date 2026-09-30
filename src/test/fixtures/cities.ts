import type { City } from "@/lib/mock-data";
import type { Database } from "@/lib/supabase/database.types";

export type CityRow = Database["public"]["Tables"]["cities"]["Row"];

export function makeCity(overrides: Partial<City> = {}): City {
  return {
    id: "seoul",
    name: "서울",
    region: "서울특별시",
    regionGroup: "수도권",
    likeCount: 0,
    dislikeCount: 0,
    monthlyCostManwon: 250,
    budget: "200만원",
    environment: ["도심선호", "코워킹 필수"],
    bestSeason: "가을",
    emoji: "🏙️",
    gradient: "from-sky-200 to-indigo-300",
    ...overrides,
  };
}

/** Covers every budget, several region groups, all seasons, and single/double environments. */
export const sampleCities: City[] = [
  makeCity({ id: "seoul", name: "서울", likeCount: 12, dislikeCount: 3 }),
  makeCity({
    id: "gangneung",
    name: "강릉",
    region: "강원도 강릉시",
    regionGroup: "강원도",
    likeCount: 30,
    dislikeCount: 1,
    monthlyCostManwon: 150,
    budget: "100~200만원",
    environment: ["자연친화", "카페작업"],
    bestSeason: "여름",
  }),
  makeCity({
    id: "jeju",
    name: "제주",
    region: "제주특별자치도 제주시",
    regionGroup: "제주도",
    likeCount: 30,
    dislikeCount: 5,
    monthlyCostManwon: 180,
    budget: "100~200만원",
    environment: ["자연친화"],
    bestSeason: "봄",
  }),
  makeCity({
    id: "yeosu",
    name: "여수",
    region: "전라남도 여수시",
    regionGroup: "전라도",
    likeCount: 7,
    dislikeCount: 0,
    monthlyCostManwon: 90,
    budget: "100만원",
    environment: ["자연친화", "카페작업"],
    bestSeason: "여름",
  }),
  makeCity({
    id: "busan",
    name: "부산",
    region: "부산광역시",
    regionGroup: "경상도",
    likeCount: 20,
    dislikeCount: 2,
    monthlyCostManwon: 170,
    budget: "100~200만원",
    environment: ["도심선호", "카페작업"],
    bestSeason: "여름",
  }),
  makeCity({
    id: "daejeon",
    name: "대전",
    region: "대전광역시",
    regionGroup: "충청도",
    likeCount: 0,
    dislikeCount: 0,
    monthlyCostManwon: 95,
    budget: "100만원",
    environment: ["코워킹 필수"],
    bestSeason: "겨울",
  }),
];

export function makeCityRow(overrides: Partial<CityRow> = {}): CityRow {
  return {
    id: "seoul",
    name: "서울",
    region: "서울특별시",
    region_group: "수도권",
    monthly_cost_manwon: 250,
    budget: "200만원",
    environment: ["도심선호", "코워킹 필수"],
    best_season: "가을",
    emoji: "🏙️",
    gradient: "from-sky-200 to-indigo-300",
    display_order: 0,
    created_at: "2026-09-22T00:00:00.000Z",
    ...overrides,
  };
}
