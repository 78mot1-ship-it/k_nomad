"use client";

import { useState } from "react";
import { CityCard } from "@/components/home/city-card";
import { CityFilterBar } from "@/components/home/city-filter-bar";
import type { City } from "@/lib/mock-data";
import type { ReactionType } from "@/lib/cities";
import { defaultCityFilters, filterCities, sortCitiesByLikeCount } from "@/lib/city-filters";

export function CityListSection({
  cities: allCities,
  initialReactions,
  isLoggedIn,
}: {
  cities: City[];
  initialReactions: Record<string, ReactionType>;
  isLoggedIn: boolean;
}) {
  const [filters, setFilters] = useState(defaultCityFilters);
  const cities = sortCitiesByLikeCount(filterCities(allCities, filters));

  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex flex-col gap-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <span aria-hidden>🌍</span> 도시 리스트
          </h2>
          <CityFilterBar filters={filters} onChange={setFilters} />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cities.map((city) => (
            <CityCard
              key={city.id}
              city={city}
              initialReaction={initialReactions[city.id] ?? null}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
