import { describe, expect, it, vi } from "vitest";
import { createClient } from "@/lib/supabase/server";
import { createSupabaseMock } from "@/test/mocks/supabase";
import { catchRedirect } from "@/test/mocks/next-navigation";
import { GET } from "./route";

vi.mock("next/cache", () => import("@/test/mocks/next-cache"));
vi.mock("next/navigation", () => import("@/test/mocks/next-navigation"));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

function setup() {
  const sb = createSupabaseMock();
  vi.mocked(createClient).mockResolvedValue(sb.client);
  return sb;
}

const req = (query: string) => new Request(`http://localhost:3000/auth/confirm?${query}`);

describe("GET /auth/confirm", () => {
  it("V-01: token_hash가 없으면 invalid_confirmation_link로 리다이렉트하고 verifyOtp를 호출하지 않음", async () => {
    const sb = setup();

    const url = await catchRedirect(() => GET(req("type=email")));

    expect(url).toBe("/login?error=invalid_confirmation_link");
    expect(sb.auth.verifyOtp).not.toHaveBeenCalled();
  });

  it("V-02: type이 없으면 invalid_confirmation_link로 리다이렉트", async () => {
    const sb = setup();

    const url = await catchRedirect(() => GET(req("token_hash=abc")));

    expect(url).toBe("/login?error=invalid_confirmation_link");
    expect(sb.auth.verifyOtp).not.toHaveBeenCalled();
  });

  it("V-03: verifyOtp가 에러를 반환하면 confirmation_failed로 리다이렉트", async () => {
    const sb = setup();
    sb.auth.verifyOtp.mockResolvedValue({ data: {}, error: { message: "expired" } });

    const url = await catchRedirect(() => GET(req("token_hash=abc&type=email")));

    expect(url).toBe("/login?error=confirmation_failed");
  });

  it("V-04: 성공하고 next가 없으면 /로 리다이렉트", async () => {
    setup();

    const url = await catchRedirect(() => GET(req("token_hash=abc&type=email")));

    expect(url).toBe("/");
  });

  it("V-05: 성공하고 next=/mypage이면 /mypage로 리다이렉트", async () => {
    setup();

    const url = await catchRedirect(() => GET(req("token_hash=abc&type=email&next=/mypage")));

    expect(url).toBe("/mypage");
  });

  it("V-06: verifyOtp를 { type, token_hash }로 호출", async () => {
    const sb = setup();

    await catchRedirect(() => GET(req("token_hash=abc&type=email")));

    expect(sb.auth.verifyOtp).toHaveBeenCalledWith({ type: "email", token_hash: "abc" });
  });

  it.todo("V-07: 외부 URL next 파라미터는 차단해야 함 (오픈 리다이렉트)");
});
