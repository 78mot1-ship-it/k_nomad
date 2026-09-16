import { Map, BarChart3, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { CityCard } from "@/components/home/city-card";
import { allCities } from "@/lib/mock-data";

export function AllCitiesSection() {
  return (
    <section id="cities" className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <Tabs defaultValue="grid">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <span aria-hidden>🌍</span> 전체 도시
            </h2>
            <TabsList>
              <TabsTrigger value="grid">
                <LayoutGrid data-icon="inline-start" />
                그리드
              </TabsTrigger>
              <TabsTrigger value="map">
                <Map data-icon="inline-start" />
                지도
              </TabsTrigger>
              <TabsTrigger value="chart">
                <BarChart3 data-icon="inline-start" />
                차트
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {allCities.map((city) => (
                <CityCard key={city.id} city={city} />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Button variant="outline">더 보기</Button>
            </div>
          </TabsContent>

          <TabsContent value="map" className="mt-0">
            <div className="flex h-80 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground">
              <Map className="size-8" />
              <p className="text-sm">지도 뷰는 준비 중입니다</p>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="mt-0">
            <div className="flex h-80 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border text-muted-foreground">
              <BarChart3 className="size-8" />
              <p className="text-sm">차트 뷰는 준비 중입니다</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
