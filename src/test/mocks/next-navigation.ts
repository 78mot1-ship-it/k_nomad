import { vi } from "vitest";

/** Thrown by the mocked `redirect()`, mirroring how Next.js aborts execution on redirect. */
export class RedirectError extends Error {
  constructor(public readonly url: string) {
    super(`NEXT_REDIRECT: ${url}`);
    this.name = "RedirectError";
  }
}

export const redirect = vi.fn((url: string): never => {
  throw new RedirectError(url);
});

export const permanentRedirect = vi.fn((url: string): never => {
  throw new RedirectError(url);
});

export const notFound = vi.fn((): never => {
  throw new Error("NEXT_NOT_FOUND");
});

/** Shared router returned by every `useRouter()` call; assert on `mockRouter.push` etc. */
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

export const useRouter = vi.fn(() => mockRouter);
export const usePathname = vi.fn(() => "/");
export const useSearchParams = vi.fn(() => new URLSearchParams());

/**
 * Runs `fn` and returns the URL it redirected to.
 * Fails if `fn` finishes without redirecting, or throws something else.
 */
export async function catchRedirect(fn: () => unknown): Promise<string> {
  try {
    await fn();
  } catch (error) {
    if (error instanceof RedirectError) return error.url;
    throw error;
  }
  throw new Error("Expected a redirect, but the function returned normally");
}
