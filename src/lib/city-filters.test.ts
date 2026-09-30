import { describe, expect, it } from "vitest";
import { defaultCityFilters, filterCities, sortCitiesByLikeCount } from "@/lib/city-filters";
import { makeCity, sampleCities } from "@/test/fixtures/cities";

const ids = (cities: { id: string }[]) => cities.map((c) => c.id);

describe("filterCities", () => {
  it("F-01: 기본 필터는 모든 도시를 원래 순서로 반환한다", () => {
    expect(ids(filterCities(sampleCities, defaultCityFilters))).toEqual(ids(sampleCities));
  });

  it("F-02: 빈 배열은 빈 배열을 반환한다", () => {
    expect(filterCities([], defaultCityFilters)).toEqual([]);
  });

  it("F-03: 예산만 지정하면 해당 예산의 도시만 반환한다", () => {
    const result = filterCities(sampleCities, { ...defaultCityFilters, budget: "100만원" });
    expect(ids(result)).toEqual(["yeosu", "daejeon"]);
  });

  it("F-04: 지역 그룹만 지정하면 해당 지역의 도시만 반환한다", () => {
    const result = filterCities(sampleCities, { ...defaultCityFilters, regionGroup: "강원도" });
    expect(ids(result)).toEqual(["gangneung"]);
  });

  it("F-05: 최적 계절만 지정하면 해당 계절의 도시만 반환한다", () => {
    const result = filterCities(sampleCities, { ...defaultCityFilters, bestSeason: "여름" });
    expect(ids(result)).toEqual(["gangneung", "yeosu", "busan"]);
  });

  it("F-06: 환경 1개 선택 시 해당 환경을 포함하는 도시만 반환한다", () => {
    const result = filterCities(sampleCities, { ...defaultCityFilters, environment: ["카페작업"] });
    expect(ids(result)).toEqual(["gangneung", "yeosu", "busan"]);
  });

  it("F-07: 환경 2개 선택 시 하나라도 포함되면 통과한다 (OR)", () => {
    const result = filterCities(sampleCities, {
      ...defaultCityFilters,
      environment: ["코워킹 필수", "자연친화"],
    });
    expect(ids(result)).toEqual(["seoul", "gangneung", "jeju", "yeosu", "daejeon"]);
  });

  it("F-08: 예산+지역+계절+환경을 함께 지정하면 모두 만족하는 도시만 반환한다 (AND)", () => {
    const result = filterCities(sampleCities, {
      budget: "100만원",
      regionGroup: "전라도",
      bestSeason: "여름",
      environment: ["카페작업"],
    });
    expect(ids(result)).toEqual(["yeosu"]);
  });

  it("F-09: 아무 도시도 만족하지 않는 조합은 빈 배열을 반환한다", () => {
    const result = filterCities(sampleCities, {
      budget: "200만원",
      regionGroup: "제주도",
      bestSeason: "겨울",
      environment: ["카페작업"],
    });
    expect(result).toEqual([]);
  });

  it("F-10: 입력 배열을 변경하지 않는다", () => {
    const input = [...sampleCities];
    const filters = { ...defaultCityFilters, budget: "100만원" as const };
    const result = filterCities(input, filters);
    expect(input).toEqual(sampleCities);
    expect(result).not.toBe(input);
    expect(filters.environment).toEqual([]);
  });
});

describe("sortCitiesByLikeCount", () => {
  it("F-11: 좋아요 수 내림차순으로 정렬한다", () => {
    const result = sortCitiesByLikeCount(sampleCities);
    expect(result.map((c) => c.likeCount)).toEqual([30, 30, 20, 12, 7, 0]);
  });

  it("F-12: 좋아요 수가 같으면 원래 상대 순서를 유지한다 (안정 정렬)", () => {
    const result = sortCitiesByLikeCount(sampleCities);
    expect(ids(result).slice(0, 2)).toEqual(["gangneung", "jeju"]);
    const reversed = sortCitiesByLikeCount([sampleCities[2], sampleCities[1]]);
    expect(ids(reversed)).toEqual(["jeju", "gangneung"]);
  });

  it("F-13: 새 배열을 반환하며 원본은 변경하지 않는다", () => {
    const input = [...sampleCities];
    const result = sortCitiesByLikeCount(input);
    expect(result).not.toBe(input);
    expect(ids(input)).toEqual(ids(sampleCities));
  });

  it("F-14: 빈 배열과 단일 요소 배열을 처리한다", () => {
    expect(sortCitiesByLikeCount([])).toEqual([]);
    const single = [makeCity({ id: "solo", likeCount: 4 })];
    const result = sortCitiesByLikeCount(single);
    expect(result).toEqual(single);
    expect(result).not.toBe(single);
  });
});

describe("defaultCityFilters", () => {
  it("F-15: 예산/지역/계절은 '전체'이고 환경은 빈 배열이다", () => {
    expect(defaultCityFilters.budget).toBe("전체");
    expect(defaultCityFilters.regionGroup).toBe("전체");
    expect(defaultCityFilters.bestSeason).toBe("전체");
    expect(defaultCityFilters.environment).toEqual([]);
  });
});
