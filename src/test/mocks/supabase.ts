import { vi, type Mock } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

export interface MockResult {
  data?: unknown;
  error?: { message: string } | null;
}

const CHAIN_METHODS = [
  "select",
  "insert",
  "update",
  "upsert",
  "delete",
  "eq",
  "neq",
  "in",
  "is",
  "match",
  "filter",
  "order",
  "limit",
  "range",
] as const;

type ChainMethod = (typeof CHAIN_METHODS)[number];

/**
 * One `supabase.from(table)` call. Every filter/modifier returns the same builder, so a test can
 * assert on any step (`builder.eq`, `builder.upsert`, ...). Awaiting the builder, or calling
 * `maybeSingle()` / `single()`, resolves to the queued `{ data, error }`.
 */
export type MockQueryBuilder = Record<ChainMethod, Mock> & {
  maybeSingle: Mock;
  single: Mock;
  then: PromiseLike<{ data: unknown; error: unknown }>["then"];
};

function createQueryBuilder(result: MockResult): MockQueryBuilder {
  const settled = { data: result.data ?? null, error: result.error ?? null };
  const builder = {} as MockQueryBuilder;
  for (const method of CHAIN_METHODS) {
    builder[method] = vi.fn(() => builder);
  }
  builder.maybeSingle = vi.fn(() => Promise.resolve(settled));
  builder.single = vi.fn(() => Promise.resolve(settled));
  builder.then = (onFulfilled, onRejected) => Promise.resolve(settled).then(onFulfilled, onRejected);
  return builder;
}

/**
 * Fake Supabase client.
 *
 * - `queue(table, ...results)`: results returned by successive `from(table)` calls, in order.
 *   The last queued result keeps being returned once the queue is down to one entry.
 *   A table with nothing queued resolves to `{ data: null, error: null }`.
 * - `builders[table][i]`: the builder created by the i-th `from(table)` call, for assertions.
 * - `auth.*`: vi.fn()s with harmless defaults; override with `mockResolvedValue` per test.
 * - `setUser(user)`: shorthand for making `auth.getUser()` return that user.
 */
export function createSupabaseMock() {
  const queues = new Map<string, MockResult[]>();
  const builders: Record<string, MockQueryBuilder[]> = {};

  const from = vi.fn((table: string) => {
    const queue = queues.get(table) ?? [];
    const result = (queue.length > 1 ? queue.shift() : queue[0]) ?? {};
    const builder = createQueryBuilder(result);
    (builders[table] ??= []).push(builder);
    return builder;
  });

  type AuthError = { message: string } | null;
  type AuthResult = Promise<{ data: { user: unknown; session: unknown }; error: AuthError }>;

  const auth = {
    getUser: vi.fn(async () => ({ data: { user: null as unknown }, error: null as unknown })),
    getClaims: vi.fn(async () => ({ data: null as unknown, error: null as unknown })),
    signInWithPassword: vi.fn<(credentials: unknown) => AuthResult>(async () => ({
      data: { user: null, session: null },
      error: null,
    })),
    signUp: vi.fn<(credentials: unknown) => AuthResult>(async () => ({
      data: { user: null, session: null },
      error: null,
    })),
    signOut: vi.fn(async () => ({ error: null as AuthError })),
    verifyOtp: vi.fn<(params: unknown) => Promise<{ data: unknown; error: AuthError }>>(async () => ({
      data: {},
      error: null,
    })),
  };

  const client = { from, auth };

  return {
    /** Pass this wherever a `SupabaseClient<Database>` is expected. */
    client: client as unknown as SupabaseClient<Database>,
    from,
    auth,
    builders,
    queue(table: string, ...results: MockResult[]) {
      queues.set(table, [...(queues.get(table) ?? []), ...results]);
    },
    setUser(user: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null) {
      auth.getUser.mockResolvedValue({ data: { user }, error: null });
    },
  };
}

export type SupabaseMock = ReturnType<typeof createSupabaseMock>;
