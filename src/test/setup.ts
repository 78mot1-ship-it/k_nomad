import { afterEach, vi } from "vitest";
import { resetRequestHeaders } from "@/test/mocks/next-headers";

afterEach(() => {
  // Clears recorded calls and restores each vi.fn() to the implementation it was created with.
  vi.resetAllMocks();
  resetRequestHeaders();
});
