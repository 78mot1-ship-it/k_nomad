import { describe, expect, it, vi } from "vitest";
import { refresh } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseMock } from "@/test/mocks/supabase";
import { toggleReaction } from "./reactions";

vi.mock("next/cache", () => import("@/test/mocks/next-cache"));
vi.mock("next/navigation", () => import("@/test/mocks/next-navigation"));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

function setup(user: { id: string } | null = { id: "u1" }) {
  const sb = createSupabaseMock();
  sb.setUser(user);
  vi.mocked(createClient).mockResolvedValue(sb.client);
  return sb;
}

describe("toggleReaction", () => {
  it("R-01: 로그인하지 않으면 unauthenticated 에러를 반환하고 DB/refresh를 호출하지 않음", async () => {
    const sb = setup(null);

    const result = await toggleReaction("seoul", "like");

    expect(result).toEqual({ error: "unauthenticated" });
    expect(sb.from).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
  });

  it("R-02: 기존 반응이 없으면 like를 upsert하고 like 반환", async () => {
    const sb = setup();
    sb.queue("city_reactions", { data: null }, { error: null });

    const result = await toggleReaction("seoul", "like");

    expect(result).toEqual({ reaction: "like" });
    expect(sb.builders.city_reactions[1].upsert).toHaveBeenCalledWith(
      { user_id: "u1", city_id: "seoul", reaction_type: "like" },
      { onConflict: "user_id,city_id" }
    );
  });

  it("R-03: 기존 반응이 없으면 dislike를 upsert하고 dislike 반환", async () => {
    const sb = setup();
    sb.queue("city_reactions", { data: null }, { error: null });

    const result = await toggleReaction("seoul", "dislike");

    expect(result).toEqual({ reaction: "dislike" });
    expect(sb.builders.city_reactions[1].upsert).toHaveBeenCalledWith(
      { user_id: "u1", city_id: "seoul", reaction_type: "dislike" },
      { onConflict: "user_id,city_id" }
    );
  });

  it("R-04: 같은 반응을 다시 누르면 삭제하고 null 반환", async () => {
    const sb = setup();
    sb.queue("city_reactions", { data: { id: "r1", reaction_type: "like" } }, { error: null });

    const result = await toggleReaction("seoul", "like");

    expect(result).toEqual({ reaction: null });
    const deleteBuilder = sb.builders.city_reactions[1];
    expect(deleteBuilder.delete).toHaveBeenCalled();
    expect(deleteBuilder.eq).toHaveBeenCalledWith("id", "r1");
    expect(deleteBuilder.upsert).not.toHaveBeenCalled();
  });

  it("R-05: 반대 반응이 있으면 delete 없이 upsert로 전환", async () => {
    const sb = setup();
    sb.queue("city_reactions", { data: { id: "r1", reaction_type: "dislike" } }, { error: null });

    const result = await toggleReaction("seoul", "like");

    expect(result).toEqual({ reaction: "like" });
    const builders = sb.builders.city_reactions;
    expect(builders[1].upsert).toHaveBeenCalledWith(
      { user_id: "u1", city_id: "seoul", reaction_type: "like" },
      { onConflict: "user_id,city_id" }
    );
    for (const b of builders) expect(b.delete).not.toHaveBeenCalled();
  });

  it("R-06: 조회 쿼리는 select/eq(user_id)/eq(city_id)/maybeSingle을 사용", async () => {
    const sb = setup();
    sb.queue("city_reactions", { data: null }, { error: null });

    await toggleReaction("seoul", "like");

    const lookup = sb.builders.city_reactions[0];
    expect(lookup.select).toHaveBeenCalledWith("id, reaction_type");
    expect(lookup.eq).toHaveBeenCalledWith("user_id", "u1");
    expect(lookup.eq).toHaveBeenCalledWith("city_id", "seoul");
    expect(lookup.maybeSingle).toHaveBeenCalledTimes(1);
  });

  it("R-07: 조회 에러 시 에러 메시지를 반환하고 변경/refresh를 하지 않음", async () => {
    const sb = setup();
    sb.queue("city_reactions", { error: { message: "lookup failed" } });

    const result = await toggleReaction("seoul", "like");

    expect(result).toEqual({ error: "lookup failed" });
    expect(sb.from).toHaveBeenCalledTimes(1);
    expect(sb.builders.city_reactions[0].upsert).not.toHaveBeenCalled();
    expect(sb.builders.city_reactions[0].delete).not.toHaveBeenCalled();
    expect(refresh).not.toHaveBeenCalled();
  });

  it("R-08: 삭제 에러 시 에러 메시지를 반환하고 refresh를 호출하지 않음", async () => {
    const sb = setup();
    sb.queue(
      "city_reactions",
      { data: { id: "r1", reaction_type: "like" } },
      { error: { message: "delete failed" } }
    );

    const result = await toggleReaction("seoul", "like");

    expect(result).toEqual({ error: "delete failed" });
    expect(refresh).not.toHaveBeenCalled();
  });

  it("R-09: upsert 에러 시 에러 메시지를 반환하고 refresh를 호출하지 않음", async () => {
    const sb = setup();
    sb.queue("city_reactions", { data: null }, { error: { message: "upsert failed" } });

    const result = await toggleReaction("seoul", "like");

    expect(result).toEqual({ error: "upsert failed" });
    expect(refresh).not.toHaveBeenCalled();
  });

  describe("R-10: 성공 경로마다 refresh를 정확히 한 번 호출 (카운트 미갱신 회귀 방지)", () => {
    it("R-10a: 신규 등록", async () => {
      const sb = setup();
      sb.queue("city_reactions", { data: null }, { error: null });
      await toggleReaction("seoul", "like");
      expect(refresh).toHaveBeenCalledTimes(1);
    });

    it("R-10b: 반응 전환", async () => {
      const sb = setup();
      sb.queue("city_reactions", { data: { id: "r1", reaction_type: "dislike" } }, { error: null });
      await toggleReaction("seoul", "like");
      expect(refresh).toHaveBeenCalledTimes(1);
    });

    it("R-10c: 반응 삭제", async () => {
      const sb = setup();
      sb.queue("city_reactions", { data: { id: "r1", reaction_type: "like" } }, { error: null });
      await toggleReaction("seoul", "like");
      expect(refresh).toHaveBeenCalledTimes(1);
    });
  });
});
