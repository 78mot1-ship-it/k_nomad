import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CityListSection } from "@/components/home/city-list-section";
import { makeCity, sampleCities } from "@/test/fixtures/cities";

vi.mock("next/navigation", () => import("@/test/mocks/next-navigation"));
vi.mock("@/app/actions/reactions", () => ({ toggleReaction: vi.fn() }));

function cardNames() {
  return screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
}

function queryCardNames() {
  return screen.queryAllByRole("heading", { level: 3 }).map((h) => h.textContent);
}

/** 도시 이름(h3)으로 해당 카드의 좋아요 버튼(첫 번째 반응 버튼)을 찾는다. */
function likeButtonOf(cityName: string) {
  const heading = screen.getByRole("heading", { level: 3, name: cityName });
  const card = heading.closest("[data-slot='card']") as HTMLElement;
  return within(card).getAllByRole("button")[0];
}

describe("CityListSection", () => {
  it("S-L-01: 모든 도시를 좋아요 수 내림차순으로 카드 렌더링한다", () => {
    render(<CityListSection cities={sampleCities} initialReactions={{}} isLoggedIn={false} />);

    // 강릉/제주는 모두 30으로 동률이며 안정 정렬로 원래 순서를 유지한다.
    expect(cardNames()).toEqual(["강릉", "제주", "부산", "서울", "여수", "대전"]);
  });

  it("S-L-02: 환경 필터 버튼을 클릭하면 해당 환경을 가진 카드만 남는다", async () => {
    const user = userEvent.setup();
    render(<CityListSection cities={sampleCities} initialReactions={{}} isLoggedIn={false} />);

    await user.click(screen.getByRole("button", { name: "코워킹 필수" }));

    expect(cardNames()).toEqual(["서울", "대전"]);
  });

  it("S-L-03: initialReactions의 반응이 해당 도시 카드에만 반영된다", () => {
    render(
      <CityListSection
        cities={sampleCities}
        initialReactions={{ gangneung: "like" }}
        isLoggedIn
      />
    );

    for (const city of sampleCities) {
      expect(likeButtonOf(city.name)).toHaveAttribute(
        "aria-pressed",
        city.id === "gangneung" ? "true" : "false"
      );
    }
  });

  it("S-L-04: 어떤 도시와도 일치하지 않는 필터 조합이면 카드가 0개다", async () => {
    const user = userEvent.setup();
    const cities = [
      makeCity({ id: "a", name: "도시A", environment: ["도심선호"] }),
      makeCity({ id: "b", name: "도시B", environment: ["카페작업"] }),
    ];
    render(<CityListSection cities={cities} initialReactions={{}} isLoggedIn={false} />);
    expect(cardNames()).toHaveLength(2);

    await user.click(screen.getByRole("button", { name: "자연친화" }));

    expect(queryCardNames()).toHaveLength(0);
  });
});
