import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LikeDislikeButtons } from "@/components/home/like-dislike-buttons";
import { mockRouter } from "@/test/mocks/next-navigation";
import { deferred } from "@/test/deferred";
import { toggleReaction, type ToggleReactionResult } from "@/app/actions/reactions";

vi.mock("next/navigation", () => import("@/test/mocks/next-navigation"));
vi.mock("@/app/actions/reactions", () => ({ toggleReaction: vi.fn() }));

type Props = ComponentProps<typeof LikeDislikeButtons>;

const baseProps: Props = {
  cityId: "gangneung",
  initialLikeCount: 10,
  initialDislikeCount: 4,
  initialReaction: null,
  isLoggedIn: true,
};

function renderButtons(overrides: Partial<Props> = {}) {
  const props = { ...baseProps, ...overrides };
  const utils = render(<LikeDislikeButtons {...props} />);
  // 좋아요 버튼이 먼저, 싫어요 버튼이 나중에 렌더된다.
  const getButtons = () => {
    const [like, dislike] = screen.getAllByRole("button");
    return { like, dislike };
  };
  return { ...utils, props, getButtons };
}

describe("LikeDislikeButtons", () => {
  beforeEach(() => {
    vi.mocked(toggleReaction).mockResolvedValue({ reaction: "like" });
  });

  describe("초기 렌더링", () => {
    it("L-01: initialLikeCount와 initialDislikeCount를 표시한다", () => {
      const { getButtons } = renderButtons();
      const { like, dislike } = getButtons();
      expect(like).toHaveAccessibleName("10");
      expect(dislike).toHaveAccessibleName("4");
    });

    it("L-02: initialReaction이 like이면 좋아요만 aria-pressed=true", () => {
      const { getButtons } = renderButtons({ initialReaction: "like" });
      const { like, dislike } = getButtons();
      expect(like).toHaveAttribute("aria-pressed", "true");
      expect(dislike).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("비로그인", () => {
    it("L-03: 비로그인 상태에서 클릭하면 /login으로 이동하고 액션은 호출하지 않는다", async () => {
      const user = userEvent.setup();
      const { getButtons } = renderButtons({ isLoggedIn: false });

      await user.click(getButtons().like);
      await user.click(getButtons().dislike);

      expect(mockRouter.push).toHaveBeenCalledTimes(2);
      expect(mockRouter.push).toHaveBeenCalledWith("/login");
      expect(toggleReaction).not.toHaveBeenCalled();
      expect(getButtons().like).toHaveAccessibleName("10");
    });
  });

  describe("낙관적 업데이트 (액션 대기 중)", () => {
    it("L-04: 반응 없음에서 좋아요 클릭 시 좋아요 +1, aria-pressed=true, toggleReaction(cityId, like) 호출", async () => {
      const d = deferred<ToggleReactionResult>();
      vi.mocked(toggleReaction).mockReturnValue(d.promise);
      const user = userEvent.setup();
      const { getButtons } = renderButtons();

      await user.click(getButtons().like);

      const { like, dislike } = getButtons();
      expect(like).toHaveAccessibleName("11");
      expect(like).toHaveAttribute("aria-pressed", "true");
      expect(dislike).toHaveAccessibleName("4");
      expect(toggleReaction).toHaveBeenCalledWith("gangneung", "like");

      await act(async () => d.resolve({ reaction: "like" }));
    });

    it("L-05: like 상태에서 좋아요 클릭 시 좋아요 -1, aria-pressed=false", async () => {
      const d = deferred<ToggleReactionResult>();
      vi.mocked(toggleReaction).mockReturnValue(d.promise);
      const user = userEvent.setup();
      const { getButtons } = renderButtons({ initialReaction: "like" });

      await user.click(getButtons().like);

      const { like } = getButtons();
      expect(like).toHaveAccessibleName("9");
      expect(like).toHaveAttribute("aria-pressed", "false");
      expect(toggleReaction).toHaveBeenCalledWith("gangneung", "like");

      await act(async () => d.resolve({ reaction: null }));
    });

    it("L-06: like 상태에서 싫어요 클릭 시 좋아요 -1, 싫어요 +1", async () => {
      const d = deferred<ToggleReactionResult>();
      vi.mocked(toggleReaction).mockReturnValue(d.promise);
      const user = userEvent.setup();
      const { getButtons } = renderButtons({ initialReaction: "like" });

      await user.click(getButtons().dislike);

      const { like, dislike } = getButtons();
      expect(like).toHaveAccessibleName("9");
      expect(like).toHaveAttribute("aria-pressed", "false");
      expect(dislike).toHaveAccessibleName("5");
      expect(dislike).toHaveAttribute("aria-pressed", "true");
      expect(toggleReaction).toHaveBeenCalledWith("gangneung", "dislike");

      await act(async () => d.resolve({ reaction: "dislike" }));
    });
  });

  describe("액션 결과 처리", () => {
    it("L-07: 액션이 unauthenticated 오류를 반환하면 /login으로 이동한다", async () => {
      vi.mocked(toggleReaction).mockResolvedValue({ error: "unauthenticated" });
      const user = userEvent.setup();
      const { getButtons } = renderButtons();

      await user.click(getButtons().like);

      await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith("/login"));
    });

    it("L-08: 액션이 기타 오류를 반환하면 완료 후 카운트가 초기값으로 되돌아간다", async () => {
      const d = deferred<ToggleReactionResult>();
      vi.mocked(toggleReaction).mockReturnValue(d.promise);
      const user = userEvent.setup();
      const { getButtons } = renderButtons();

      await user.click(getButtons().like);
      expect(getButtons().like).toHaveAccessibleName("11");

      await act(async () => d.resolve({ error: "some db error" }));

      const { like, dislike } = getButtons();
      expect(like).toHaveAccessibleName("10");
      expect(like).toHaveAttribute("aria-pressed", "false");
      expect(dislike).toHaveAccessibleName("4");
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it("L-08b: 액션이 오류를 반환하면 저장 실패 안내를 표시한다", async () => {
      vi.mocked(toggleReaction).mockResolvedValue({ error: "some db error" });
      const user = userEvent.setup();
      const { getButtons } = renderButtons();

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      await user.click(getButtons().like);

      expect(await screen.findByRole("alert")).toHaveTextContent("반응을 저장하지 못했어요");
    });

    it("L-08c: 액션이 예외를 던져도 저장 실패 안내를 표시하고 카운트를 되돌린다", async () => {
      vi.mocked(toggleReaction).mockRejectedValue(new Error("network down"));
      const user = userEvent.setup();
      const { getButtons } = renderButtons();

      await user.click(getButtons().like);

      expect(await screen.findByRole("alert")).toHaveTextContent("반응을 저장하지 못했어요");
      expect(getButtons().like).toHaveAccessibleName("10");
      expect(getButtons().like).toHaveAttribute("aria-pressed", "false");
    });

    it("L-08d: 다시 클릭하면 이전 오류 안내가 사라진다", async () => {
      vi.mocked(toggleReaction).mockResolvedValueOnce({ error: "some db error" });
      const user = userEvent.setup();
      const { getButtons } = renderButtons();

      await user.click(getButtons().like);
      expect(await screen.findByRole("alert")).toBeInTheDocument();

      const d = deferred<ToggleReactionResult>();
      vi.mocked(toggleReaction).mockReturnValueOnce(d.promise);
      await user.click(getButtons().like);
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();

      await act(async () => d.resolve({ reaction: "like" }));
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("L-08e: unauthenticated 오류는 안내 대신 로그인 페이지로 이동한다", async () => {
      vi.mocked(toggleReaction).mockResolvedValue({ error: "unauthenticated" });
      const user = userEvent.setup();
      const { getButtons } = renderButtons();

      await user.click(getButtons().like);

      await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith("/login"));
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("L-09: 성공 후 갱신된 props로 리렌더되면 좋아요가 중복 집계되지 않는다", async () => {
      const d = deferred<ToggleReactionResult>();
      vi.mocked(toggleReaction).mockReturnValue(d.promise);
      const user = userEvent.setup();
      const { getButtons, rerender, props } = renderButtons();

      await user.click(getButtons().like);
      expect(getButtons().like).toHaveAccessibleName("11");

      await act(async () => d.resolve({ reaction: "like" }));
      // 서버 액션의 refresh()로 새 props가 내려온 상황을 재현한다.
      rerender(
        <LikeDislikeButtons
          {...props}
          initialLikeCount={props.initialLikeCount + 1}
          initialReaction="like"
        />
      );

      const { like, dislike } = getButtons();
      expect(like).toHaveAccessibleName("11");
      expect(like).toHaveAttribute("aria-pressed", "true");
      expect(dislike).toHaveAccessibleName("4");
    });
  });
});
