import { afterEach, describe, expect, it, vi } from "vitest";
import { unsubscribeToken } from "../unsubscribe-token";

afterEach(() => vi.unstubAllEnvs());

describe("unsubscribeToken", () => {
  it("is stable for the same email and secret", () => {
    vi.stubEnv("CRON_SECRET", "secret-a");
    expect(unsubscribeToken("a@example.com")).toBe(unsubscribeToken("a@example.com"));
  });

  it("differs per email and per secret, so tokens can't be guessed or reused", () => {
    vi.stubEnv("CRON_SECRET", "secret-a");
    const a = unsubscribeToken("a@example.com");
    expect(unsubscribeToken("b@example.com")).not.toBe(a);
    vi.stubEnv("CRON_SECRET", "secret-b");
    expect(unsubscribeToken("a@example.com")).not.toBe(a);
  });

  it("refuses to sign without a secret", () => {
    vi.stubEnv("CRON_SECRET", "");
    expect(() => unsubscribeToken("a@example.com")).toThrow();
  });
});
