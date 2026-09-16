import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SortSelect } from "@/components/home/sort-select";

const filters = ["비용", "인터넷", "계절"];

export function HeroSection() {
  return (
    <section className="border-b border-border bg-gradient-to-b from-accent/40 to-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-20">
        <p className="text-3xl" aria-hidden>
          🌏
        </p>
        <h1 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          당신에게 맞는 노마드 도시를 찾아보세요
        </h1>
        <p className="max-w-xl text-balance text-muted-foreground">
          강릉부터 제주까지, 실제 노마드들의 리얼 리뷰와 데이터
        </p>

        <div className="flex w-full max-w-xl items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="도시, 지역, 키워드로 검색..."
              className="h-11 rounded-full pl-9"
            />
          </div>
          <Button size="lg" className="h-11 rounded-full px-5">
            검색
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <SortSelect />

          <span className="mx-1 hidden h-4 w-px bg-border sm:block" aria-hidden />

          {filters.map((filter) => (
            <Button
              key={filter}
              variant="outline"
              size="sm"
              className="rounded-full bg-background"
            >
              {filter}
            </Button>
          ))}
          <Button variant="ghost" size="sm" className="rounded-full">
            <SlidersHorizontal data-icon="inline-start" />
            더보기
          </Button>
        </div>
      </div>
    </section>
  );
}
