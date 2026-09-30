import type { Budget, City, Environment, RegionGroup, Season } from "@/lib/mock-data";

export interface CityFilterState {
  budget: Budget | "전체";
  regionGroup: RegionGroup | "전체";
  environment: Environment[];
  bestSeason: Season | "전체";
}

export const defaultCityFilters: CityFilterState = {
  budget: "전체",
  regionGroup: "전체",
  environment: [],
  bestSeason: "전체",
};

export function filterCities(cities: City[], filters: CityFilterState): City[] {
  return cities.filter((city) => {
    if (filters.budget !== "전체" && city.budget !== filters.budget) return false;
    if (filters.regionGroup !== "전체" && city.regionGroup !== filters.regionGroup) return false;
    if (filters.bestSeason !== "전체" && city.bestSeason !== filters.bestSeason) return false;
    if (
      filters.environment.length > 0 &&
      !filters.environment.some((env) => city.environment.includes(env))
    ) {
      return false;
    }
    return true;
  });
}

export function sortCitiesByLikeCount(cities: City[]): City[] {
  return [...cities].sort((a, b) => b.likeCount - a.likeCount);
}
