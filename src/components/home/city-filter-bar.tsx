"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Budget, Environment, RegionGroup, Season } from "@/lib/mock-data";
import type { CityFilterState } from "@/lib/city-filters";
import { cn } from "cn";

type SelectOption<T extends string> = { value: T | "전체"; label: string };

// "전체" is shared by every select, so each one needs its own label for it (e.g. "예산 전체").
// Passing these to <Select items> lets the trigger show the label instead of the raw value.
function withAllOption<T extends string>(allLabel: string, options: T[]): SelectOption<T>[] {
  return [
    { value: "전체", label: allLabel },
    ...options.map((option) => ({ value: option, label: option })),
  ];
}

const budgetItems = withAllOption<Budget>("예산 전체", ["100만원", "100~200만원", "200만원"]);
const regionItems = withAllOption<RegionGroup>("지역 전체", [
  "수도권",
  "경상도",
  "전라도",
  "강원도",
  "제주도",
  "충청도",
]);
const seasonItems = withAllOption<Season>("계절 전체", ["봄", "여름", "가을", "겨울"]);
const environmentOptions: Environment[] = [
  "자연친화",
  "도심선호",
  "카페작업",
  "코워킹 필수",
];

export function CityFilterBar({
  filters,
  onChange,
}: {
  filters: CityFilterState;
  onChange: (filters: CityFilterState) => void;
}) {
  function toggleEnvironment(option: Environment) {
    const isActive = filters.environment.includes(option);
    onChange({
      ...filters,
      environment: isActive
        ? filters.environment.filter((value) => value !== option)
        : [...filters.environment, option],
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <FilterSelect
        items={budgetItems}
        value={filters.budget}
        onValueChange={(budget) => onChange({ ...filters, budget })}
      />
      <FilterSelect
        items={regionItems}
        value={filters.regionGroup}
        onValueChange={(regionGroup) => onChange({ ...filters, regionGroup })}
      />
      <FilterSelect
        items={seasonItems}
        value={filters.bestSeason}
        onValueChange={(bestSeason) => onChange({ ...filters, bestSeason })}
      />

      <span className="mx-1 hidden h-4 w-px bg-border sm:block" aria-hidden />

      {environmentOptions.map((option) => {
        const isActive = filters.environment.includes(option);
        return (
          <Button
            key={option}
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={isActive}
            onClick={() => toggleEnvironment(option)}
            className={cn(
              "rounded-full bg-background",
              isActive && "border-primary bg-primary/10 text-primary"
            )}
          >
            {option}
          </Button>
        );
      })}
    </div>
  );
}

function FilterSelect<T extends string>({
  items,
  value,
  onValueChange,
}: {
  items: SelectOption<T>[];
  value: T | "전체";
  onValueChange: (value: T | "전체") => void;
}) {
  return (
    <Select<T | "전체">
      items={items}
      value={value}
      onValueChange={(next) => onValueChange(next as T | "전체")}
    >
      <SelectTrigger size="sm" className="rounded-full bg-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
