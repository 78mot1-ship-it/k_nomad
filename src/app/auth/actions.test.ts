import { describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { catchRedirect } from "@/test/mocks/next-navigation";
import { setRequestHeaders } from "@/test/mocks/next-headers";
import { createSupabaseMock } from "@/test/mocks/supabase";
import { login, signOut, signup } from "./actions";

vi.mock("next/cache", () => import("@/test/mocks/next-cache"));
vi.mock("next/navigation", () => import("@/test/mocks/next-navigation"));
vi.mock("next/headers", () => import("@/test/mocks/next-headers"));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

function setup() {
  const sb = createSupabaseMock();
  vi.mocked(createClient).mockResolvedValue(sb.client);
  return sb;
}

function form(values: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return fd;
}

describe("login", () => {
  const ERR = "이메일과 비밀번호를 입력해주세요.";

  it("A-01: 이메일이 비어 있으면 formError를 반환하고 로그인을 호출하지 않는다", async () => {
    const sb = setup();
    const result = await login(undefined, form({ email: "", password: "pw" }));
    expect(result).toEqual({ formError: ERR });
    expect(sb.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("A-02: 비밀번호가 비어 있으면 동일한 formError를 반환한다", async () => {
    const sb = setup();
    const result = await login(undefined, form({ email: "a@b.com", password: "" }));
    expect(result).toEqual({ formError: ERR });
    expect(sb.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("A-03: 공백만 있는 이메일은 빈 값으로 취급한다", async () => {
    const sb = setup();
    const result = await login(undefined, form({ email: "   ", password: "pw" }));
    expect(result).toEqual({ formError: ERR });
    expect(sb.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("A-04: 이메일은 trim된 뒤 signInWithPassword에 전달된다", async () => {
    const sb = setup();
    await catchRedirect(() =>
      login(undefined, form({ email: "  a@b.com  ", password: "pw" }))
    );
    expect(sb.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "a@b.com",
      password: "pw",
    });
  });

  it("A-05: Invalid login credentials 에러를 한국어 메시지로 변환한다", async () => {
    const sb = setup();
    sb.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Invalid login credentials" },
    });
    const result = await login(undefined, form({ email: "a@b.com", password: "pw" }));
    expect(result).toEqual({ formError: "이메일 또는 비밀번호가 올바르지 않습니다." });
  });

  it("A-06: Email not confirmed 에러를 한국어 메시지로 변환한다", async () => {
    const sb = setup();
    sb.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Email not confirmed" },
    });
    const result = await login(undefined, form({ email: "a@b.com", password: "pw" }));
    expect(result).toEqual({
      formError: "이메일 인증이 필요합니다. 받은 편지함을 확인해주세요.",
    });
  });

  it("A-07: 알 수 없는 에러 메시지는 그대로 전달한다", async () => {
    const sb = setup();
    sb.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "Something exploded" },
    });
    const result = await login(undefined, form({ email: "a@b.com", password: "pw" }));
    expect(result).toEqual({ formError: "Something exploded" });
  });

  it("A-08: 성공하면 revalidatePath 후 '/'로 redirect 한다", async () => {
    setup();
    const url = await catchRedirect(() =>
      login(undefined, form({ email: "a@b.com", password: "pw" }))
    );
    expect(url).toBe("/");
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
    expect(redirect).toHaveBeenCalledWith("/");
  });
});

describe("signup", () => {
  const valid = {
    name: "홍길동",
    email: "a@b.com",
    password: "password1",
    passwordConfirm: "password1",
  };

  it.each([
    ["이름", { ...valid, name: "" }],
    ["이메일", { ...valid, email: "" }],
    ["비밀번호", { ...valid, password: "" }],
  ])("A-09: %s 누락 시 formError를 반환한다", async (_label, values) => {
    const sb = setup();
    const result = await signup(undefined, form(values));
    expect(result).toEqual({ formError: "모든 항목을 입력해주세요." });
    expect(sb.auth.signUp).not.toHaveBeenCalled();
  });

  it("A-10: 비밀번호가 7자면 password 필드 에러를 반환한다", async () => {
    const sb = setup();
    const result = await signup(
      undefined,
      form({ ...valid, password: "1234567", passwordConfirm: "1234567" })
    );
    expect(result).toEqual({
      fieldErrors: { password: "비밀번호는 8자 이상이어야 합니다." },
    });
    expect(sb.auth.signUp).not.toHaveBeenCalled();
  });

  it("A-11: 정확히 8자 비밀번호는 길이 검사를 통과한다", async () => {
    const sb = setup();
    setRequestHeaders({ origin: "http://localhost:3000" });
    const result = await signup(
      undefined,
      form({ ...valid, password: "12345678", passwordConfirm: "12345678" })
    );
    expect(sb.auth.signUp).toHaveBeenCalled();
    expect(result?.fieldErrors).toBeUndefined();
  });

  it("A-12: 비밀번호 확인이 다르면 passwordConfirm 필드 에러를 반환한다", async () => {
    const sb = setup();
    const result = await signup(
      undefined,
      form({ ...valid, passwordConfirm: "different1" })
    );
    expect(result).toEqual({
      fieldErrors: { passwordConfirm: "비밀번호가 일치하지 않습니다." },
    });
    expect(sb.auth.signUp).not.toHaveBeenCalled();
  });

  it("A-13: 검증 순서는 필수값 -> 길이 -> 확인 일치 순이다", async () => {
    setup();
    // 짧고 + 불일치 -> 길이 에러
    const lengthFirst = await signup(
      undefined,
      form({ ...valid, password: "short", passwordConfirm: "other" })
    );
    expect(lengthFirst).toEqual({
      fieldErrors: { password: "비밀번호는 8자 이상이어야 합니다." },
    });
    // 필수값 누락 + 짧음 -> 필수값 에러
    const requiredFirst = await signup(
      undefined,
      form({ ...valid, name: "", password: "short", passwordConfirm: "other" })
    );
    expect(requiredFirst).toEqual({ formError: "모든 항목을 입력해주세요." });
  });

  it("A-14: signUp에 email, password, full_name, emailRedirectTo를 전달한다", async () => {
    const sb = setup();
    setRequestHeaders({ origin: "http://localhost:3000" });
    await signup(undefined, form(valid));
    expect(sb.auth.signUp).toHaveBeenCalledWith({
      email: "a@b.com",
      password: "password1",
      options: {
        data: { full_name: "홍길동" },
        emailRedirectTo: "http://localhost:3000/auth/confirm",
      },
    });
  });

  it("A-15: User already registered 에러를 한국어 메시지로 변환한다", async () => {
    const sb = setup();
    setRequestHeaders({ origin: "http://localhost:3000" });
    sb.auth.signUp.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "User already registered" },
    });
    const result = await signup(undefined, form(valid));
    expect(result).toEqual({ formError: "이미 가입된 이메일입니다." });
  });

  it("A-16: 세션 없이 성공하면 check-email 상태를 반환하고 redirect 하지 않는다", async () => {
    setup();
    setRequestHeaders({ origin: "http://localhost:3000" });
    const result = await signup(undefined, form(valid));
    expect(result).toEqual({ status: "check-email", email: "a@b.com" });
    expect(redirect).not.toHaveBeenCalled();
  });

  it("A-17: 세션이 있으면 revalidatePath 후 '/'로 redirect 한다", async () => {
    const sb = setup();
    setRequestHeaders({ origin: "http://localhost:3000" });
    sb.auth.signUp.mockResolvedValue({
      data: { user: { id: "u1" }, session: { access_token: "t" } },
      error: null,
    } as never);
    const url = await catchRedirect(() => signup(undefined, form(valid)));
    expect(url).toBe("/");
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it.todo(
    "A-18: origin 헤더가 없을 때 emailRedirectTo가 'null/auth/confirm'이 되지 않아야 함"
  );
});

describe("signOut", () => {
  it("A-19: signOut 호출 후 revalidatePath 하고 '/'로 redirect 한다", async () => {
    const sb = setup();
    const url = await catchRedirect(() => signOut());
    expect(url).toBe("/");
    expect(sb.auth.signOut).toHaveBeenCalledTimes(1);
    expect(revalidatePath).toHaveBeenCalledWith("/", "layout");
  });
});
