import { CityCard } from "@/components/home/city-card";
import { popularCities } from "@/lib/mock-data";

export function PopularCitiesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
        <span aria-hidden>🔥</span> 지금 인기있는 도시
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {popularCities.map((city) => (
          <CityCard key={city.id} city={city} />
        ))}
      </div>
    </section>
  );
}
