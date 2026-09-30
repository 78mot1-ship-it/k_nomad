import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CityCard } from "@/components/home/city-card";
import { makeCity } from "@/test/fixtures/cities";

vi.mock("next/navigation", () => import("@/test/mocks/next-navigation"));
vi.mock("@/app/actions/reactions", () => ({ toggleReaction: vi.fn() }));

describe("CityCard", () => {
  it("CC-01: 도시 이름, 지역, 월 생활비, 예산, 지역 그룹, 환경, 최고 계절을 표시한다", () => {
    const city = makeCity({
      name: "강릉",
      region: "강원도 강릉시",
      regionGroup: "강원도",
      monthlyCostManwon: 150,
      budget: "100~200만원",
      environment: ["자연친화", "카페작업"],
      bestSeason: "여름",
    });

    render(<CityCard city={city} initialReaction={null} isLoggedIn={false} />);

    expect(screen.getByRole("heading", { level: 3, name: "강릉" })).toBeInTheDocument();
    expect(screen.getByText("강원도 강릉시")).toBeInTheDocument();
    expect(screen.getByText("월 150만원")).toBeInTheDocument();
    expect(screen.getByText("· 100~200만원")).toBeInTheDocument();
    expect(screen.getByText("· 강원도")).toBeInTheDocument();
    expect(screen.getByText("· 자연친화, 카페작업")).toBeInTheDocument();
    expect(screen.getByText("· 여름")).toBeInTheDocument();
  });
});
