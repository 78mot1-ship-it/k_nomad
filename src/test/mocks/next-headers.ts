import { vi } from "vitest";

let requestHeaders = new Headers();

/** Sets the headers the mocked `headers()` returns for the rest of the current test. */
export function setRequestHeaders(init: Record<string, string>) {
  requestHeaders = new Headers(init);
}

export const headers = vi.fn(async () => requestHeaders);

export const cookies = vi.fn(async () => ({
  get: vi.fn(),
  getAll: vi.fn(() => []),
  set: vi.fn(),
  delete: vi.fn(),
}));

export function resetRequestHeaders() {
  requestHeaders = new Headers();
}
