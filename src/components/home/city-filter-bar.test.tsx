import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CityFilterBar } from "@/components/home/city-filter-bar";
import { defaultCityFilters, type CityFilterState } from "@/lib/city-filters";

const environmentLabels = ["자연친화", "도심선호", "카페작업", "코워킹 필수"] as const;

function renderBar(filters: CityFilterState = defaultCityFilters) {
  const onChange = vi.fn<(filters: CityFilterState) => void>();
  render(<CityFilterBar filters={filters} onChange={onChange} />);
  return { onChange };
}

describe("CityFilterBar", () => {
  describe("환경 필터 버튼", () => {
    it("B-01: 기본 필터에서 환경 버튼 4개가 모두 aria-pressed=false로 렌더된다", () => {
      renderBar();
      for (const label of environmentLabels) {
        expect(screen.getByRole("button", { name: label })).toHaveAttribute(
          "aria-pressed",
          "false"
        );
      }
    });

    it("B-02: 비활성 환경 버튼 클릭 시 해당 환경을 추가하고 나머지 필드는 유지한 채 onChange를 호출한다", async () => {
      const user = userEvent.setup();
      const filters: CityFilterState = {
        budget: "100만원",
        regionGroup: "강원도",
        environment: ["자연친화"],
        bestSeason: "여름",
      };
      const { onChange } = renderBar(filters);

      await user.click(screen.getByRole("button", { name: "카페작업" }));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({
        ...filters,
        environment: ["자연친화", "카페작업"],
      });
    });

    it("B-03: 활성 환경 버튼 클릭 시 해당 환경을 제거한 채 onChange를 호출한다", async () => {
      const user = userEvent.setup();
      const filters: CityFilterState = {
        ...defaultCityFilters,
        environment: ["자연친화", "카페작업"],
      };
      const { onChange } = renderBar(filters);

      await user.click(screen.getByRole("button", { name: "자연친화" }));

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({ ...filters, environment: ["카페작업"] });
    });

    it("B-04: environment에 카페작업만 선택되어 있으면 해당 버튼만 aria-pressed=true", () => {
      renderBar({ ...defaultCityFilters, environment: ["카페작업"] });
      for (const label of environmentLabels) {
        expect(screen.getByRole("button", { name: label })).toHaveAttribute(
          "aria-pressed",
          label === "카페작업" ? "true" : "false"
        );
      }
    });
  });

  describe("Select 필터", () => {
    it("B-05-0: 기본 필터에서 Select 트리거가 '예산 전체' / '지역 전체' / '계절 전체' 라벨을 표시한다", () => {
      renderBar();
      const triggers = screen.getAllByRole("combobox");
      expect(triggers).toHaveLength(3);
      const labels = triggers.map(
        (trigger) => trigger.querySelector("[data-slot='select-value']")?.textContent
      );
      expect(labels).toEqual(["예산 전체", "지역 전체", "계절 전체"]);
    });

    it("B-05-0b: 선택된 값이 있으면 트리거에 해당 옵션 라벨을 표시한다", () => {
      renderBar({ ...defaultCityFilters, budget: "100만원", regionGroup: "제주도", bestSeason: "겨울" });
      const labels = screen
        .getAllByRole("combobox")
        .map((trigger) => trigger.querySelector("[data-slot='select-value']")?.textContent);
      expect(labels).toEqual(["100만원", "제주도", "겨울"]);
    });

    const selectCases: {
      index: number;
      field: keyof CityFilterState;
      option: string;
    }[] = [
      { index: 0, field: "budget", option: "100~200만원" },
      { index: 1, field: "regionGroup", option: "제주도" },
      { index: 2, field: "bestSeason", option: "겨울" },
    ];

    it.each(selectCases)(
      "B-05: $field Select에서 '$option' 선택 시 해당 필드만 바꿔 onChange를 호출한다",
      async ({ index, field, option }) => {
        const user = userEvent.setup();
        const filters: CityFilterState = {
          ...defaultCityFilters,
          environment: ["카페작업"],
        };
        const { onChange } = renderBar(filters);

        await user.click(screen.getAllByRole("combobox")[index]);
        await user.click(await screen.findByRole("option", { name: option }));

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith({ ...filters, [field]: option });
      }
    );
  });
});
