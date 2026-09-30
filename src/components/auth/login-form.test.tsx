import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { login } from "@/app/auth/actions";
import { LoginForm } from "./login-form";

vi.mock("@/app/auth/actions", () => ({ login: vi.fn(), signup: vi.fn() }));

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("이메일"), "a@b.com");
  await user.type(screen.getByLabelText("비밀번호"), "password1");
  await user.click(screen.getByRole("button", { name: /로그인/ }));
}

describe("LoginForm", () => {
  it("LF-01: 이메일/비밀번호 입력, 로그인 버튼, 회원가입 링크를 렌더링한다", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("이메일")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "회원가입" })).toHaveAttribute(
      "href",
      "/register"
    );
  });

  it("LF-02: 액션이 formError를 반환하면 메시지를 표시한다", async () => {
    vi.mocked(login).mockResolvedValue({ formError: "이메일 또는 비밀번호가 올바르지 않습니다." });
    render(<LoginForm />);
    await fillAndSubmit();
    expect(
      await screen.findByText("이메일 또는 비밀번호가 올바르지 않습니다.")
    ).toBeInTheDocument();
  });

  it("LF-03: 제출 중에는 버튼이 비활성화되고 '로그인 중...'을 표시한다", async () => {
    let resolve!: (v: undefined) => void;
    vi.mocked(login).mockReturnValue(
      new Promise<undefined>((r) => {
        resolve = r;
      })
    );
    render(<LoginForm />);
    await fillAndSubmit();
    const button = await screen.findByRole("button", { name: "로그인 중..." });
    expect(button).toBeDisabled();
    resolve(undefined);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "로그인" })).toBeEnabled()
    );
  });
});
