import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signup } from "@/app/auth/actions";
import { RegisterForm } from "./register-form";

vi.mock("@/app/auth/actions", () => ({ login: vi.fn(), signup: vi.fn() }));

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("이름"), "홍길동");
  await user.type(screen.getByLabelText("이메일"), "a@b.com");
  await user.type(screen.getByLabelText("비밀번호", { exact: true }), "password1");
  await user.type(screen.getByLabelText("비밀번호 확인"), "password1");
  await user.click(screen.getByRole("button", { name: "회원가입" }));
}

describe("RegisterForm", () => {
  it("RF-01: 4개 입력을 렌더링하고 비밀번호 입력은 minLength 8이다", () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText("이름")).toBeInTheDocument();
    expect(screen.getByLabelText("이메일")).toBeInTheDocument();
    expect(screen.getByLabelText("비밀번호", { exact: true })).toHaveAttribute("minlength", "8");
    expect(screen.getByLabelText("비밀번호 확인")).toHaveAttribute("minlength", "8");
  });

  it("RF-02: fieldErrors.password를 표시한다", async () => {
    vi.mocked(signup).mockResolvedValue({
      fieldErrors: { password: "비밀번호는 8자 이상이어야 합니다." },
    });
    render(<RegisterForm />);
    await fillAndSubmit();
    expect(await screen.findByText("비밀번호는 8자 이상이어야 합니다.")).toBeInTheDocument();
  });

  it("RF-03: fieldErrors.passwordConfirm을 표시한다", async () => {
    vi.mocked(signup).mockResolvedValue({
      fieldErrors: { passwordConfirm: "비밀번호가 일치하지 않습니다." },
    });
    render(<RegisterForm />);
    await fillAndSubmit();
    expect(await screen.findByText("비밀번호가 일치하지 않습니다.")).toBeInTheDocument();
  });

  it("RF-04: formError를 표시한다", async () => {
    vi.mocked(signup).mockResolvedValue({ formError: "이미 가입된 이메일입니다." });
    render(<RegisterForm />);
    await fillAndSubmit();
    expect(await screen.findByText("이미 가입된 이메일입니다.")).toBeInTheDocument();
  });

  it("RF-05: check-email 상태면 폼 대신 이메일 안내와 로그인 링크를 표시한다", async () => {
    vi.mocked(signup).mockResolvedValue({ status: "check-email", email: "a@b.com" });
    render(<RegisterForm />);
    await fillAndSubmit();
    expect(await screen.findByText("a@b.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "로그인으로 돌아가기" })).toHaveAttribute(
      "href",
      "/login"
    );
    expect(screen.queryByLabelText("이름")).not.toBeInTheDocument();
  });

  it("RF-06: 제출 중에는 버튼이 비활성화되고 '가입 중...'을 표시한다", async () => {
    let resolve!: (v: undefined) => void;
    vi.mocked(signup).mockReturnValue(
      new Promise<undefined>((r) => {
        resolve = r;
      })
    );
    render(<RegisterForm />);
    await fillAndSubmit();
    const button = await screen.findByRole("button", { name: "가입 중..." });
    expect(button).toBeDisabled();
    resolve(undefined);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "회원가입" })).toBeEnabled()
    );
  });
});
