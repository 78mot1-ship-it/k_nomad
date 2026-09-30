import { describe, expect, it } from "vitest";
import { getCities, getUserReactions } from "@/lib/cities";
import { makeCityRow } from "@/test/fixtures/cities";
import { createSupabaseMock } from "@/test/mocks/supabase";

describe("getCities", () => {
  it("C-01: snake_case 행 필드를 City camelCase 필드로 매핑한다", async () => {
    const sb = createSupabaseMock();
    sb.queue("cities", {
      data: [
        makeCityRow({
          id: "gangneung",
          name: "강릉",
          region: "강원도 강릉시",
          region_group: "강원도",
          monthly_cost_manwon: 150,
          budget: "100~200만원",
          environment: ["자연친화", "카페작업"],
          best_season: "여름",
          emoji: "🌊",
          gradient: "from-a to-b",
        }),
      ],
    });
    const cities = await getCities(sb.client);
    expect(cities).toEqual([
      {
        id: "gangneung",
        name: "강릉",
        region: "강원도 강릉시",
        regionGroup: "강원도",
        likeCount: 0,
        dislikeCount: 0,
        monthlyCostManwon: 150,
        budget: "100~200만원",
        environment: ["자연친화", "카페작업"],
        bestSeason: "여름",
        emoji: "🌊",
        gradient: "from-a to-b",
      },
    ]);
  });

  it("C-02: counts 행이 있는 도시는 likeCount/dislikeCount를 가진다", async () => {
    const sb = createSupabaseMock();
    sb.queue("cities", { data: [makeCityRow({ id: "seoul" })] });
    sb.queue("city_reaction_counts", {
      data: [{ city_id: "seoul", like_count: 12, dislike_count: 3 }],
    });
    const [city] = await getCities(sb.client);
    expect(city.likeCount).toBe(12);
    expect(city.dislikeCount).toBe(3);
  });

  it("C-03: counts 행이 없는 도시는 0/0이다", async () => {
    const sb = createSupabaseMock();
    sb.queue("cities", { data: [makeCityRow({ id: "seoul" }), makeCityRow({ id: "jeju" })] });
    sb.queue("city_reaction_counts", {
      data: [{ city_id: "seoul", like_count: 5, dislike_count: 1 }],
    });
    const cities = await getCities(sb.client);
    expect(cities[1].likeCount).toBe(0);
    expect(cities[1].dislikeCount).toBe(0);
  });

  it("C-04: like_count/dislike_count가 null이면 0이다", async () => {
    const sb = createSupabaseMock();
    sb.queue("cities", { data: [makeCityRow({ id: "seoul" })] });
    sb.queue("city_reaction_counts", {
      data: [{ city_id: "seoul", like_count: null, dislike_count: null }],
    });
    const [city] = await getCities(sb.client);
    expect(city.likeCount).toBe(0);
    expect(city.dislikeCount).toBe(0);
  });

  it("C-05: city_id가 null인 counts 행은 오류 없이 무시된다", async () => {
    const sb = createSupabaseMock();
    sb.queue("cities", { data: [makeCityRow({ id: "seoul" })] });
    sb.queue("city_reaction_counts", {
      data: [
        { city_id: null, like_count: 99, dislike_count: 99 },
        { city_id: "seoul", like_count: 2, dislike_count: 1 },
      ],
    });
    const cities = await getCities(sb.client);
    expect(cities).toHaveLength(1);
    expect(cities[0].likeCount).toBe(2);
    expect(cities[0].dislikeCount).toBe(1);
  });

  it("C-06: cities를 select('*')와 order('display_order')로 조회하고 반환 순서를 유지한다", async () => {
    const sb = createSupabaseMock();
    sb.queue("cities", {
      data: [makeCityRow({ id: "b" }), makeCityRow({ id: "a" }), makeCityRow({ id: "c" })],
    });
    const cities = await getCities(sb.client);
    const builder = sb.builders["cities"][0];
    expect(builder.select).toHaveBeenCalledWith("*");
    expect(builder.order).toHaveBeenCalledWith("display_order");
    expect(cities.map((c) => c.id)).toEqual(["b", "a", "c"]);
  });

  it("C-07: cities와 city_reaction_counts 두 테이블을 모두 조회한다", async () => {
    const sb = createSupabaseMock();
    await getCities(sb.client);
    expect(sb.from).toHaveBeenCalledWith("cities");
    expect(sb.from).toHaveBeenCalledWith("city_reaction_counts");
  });

  it("C-08: cities 조회 오류는 해당 오류를 throw한다", async () => {
    const sb = createSupabaseMock();
    const error = { message: "cities failed" };
    sb.queue("cities", { data: null, error });
    await expect(getCities(sb.client)).rejects.toBe(error);
  });

  it("C-09: counts 조회 오류는 해당 오류를 throw한다", async () => {
    const sb = createSupabaseMock();
    const error = { message: "counts failed" };
    sb.queue("cities", { data: [makeCityRow()] });
    sb.queue("city_reaction_counts", { data: null, error });
    await expect(getCities(sb.client)).rejects.toBe(error);
  });

  it("C-10: data가 null이면 빈 배열을 반환한다", async () => {
    const sb = createSupabaseMock();
    sb.queue("cities", { data: null });
    await expect(getCities(sb.client)).resolves.toEqual([]);
  });
});

describe("getUserReactions", () => {
  it("C-11: 여러 행을 { [city_id]: reaction_type } 형태로 변환한다", async () => {
    const sb = createSupabaseMock();
    sb.queue("city_reactions", {
      data: [
        { city_id: "seoul", reaction_type: "like" },
        { city_id: "jeju", reaction_type: "dislike" },
      ],
    });
    await expect(getUserReactions(sb.client, "user-1")).resolves.toEqual({
      seoul: "like",
      jeju: "dislike",
    });
  });

  it("C-12: city_reactions를 eq('user_id', userId)로 필터링한다", async () => {
    const sb = createSupabaseMock();
    await getUserReactions(sb.client, "user-42");
    expect(sb.from).toHaveBeenCalledWith("city_reactions");
    expect(sb.builders["city_reactions"][0].eq).toHaveBeenCalledWith("user_id", "user-42");
  });

  it("C-13: 행이 없거나 data가 null이면 빈 객체를 반환한다", async () => {
    const sb = createSupabaseMock();
    sb.queue("city_reactions", { data: [] }, { data: null });
    await expect(getUserReactions(sb.client, "u")).resolves.toEqual({});
    await expect(getUserReactions(sb.client, "u")).resolves.toEqual({});
  });

  it("C-14: 오류가 있으면 해당 오류를 throw한다", async () => {
    const sb = createSupabaseMock();
    const error = { message: "reactions failed" };
    sb.queue("city_reactions", { data: null, error });
    await expect(getUserReactions(sb.client, "u")).rejects.toBe(error);
  });
});
