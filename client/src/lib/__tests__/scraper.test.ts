import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("dns/promises", () => ({
  lookup: vi.fn(async (host: string) => {
    if (host === "internal.test") return [{ address: "10.0.0.7", family: 4 }];
    return [{ address: "93.184.215.14", family: 4 }];
  }),
}));
vi.mock("open-graph-scraper", () => ({
  default: vi.fn(async ({ url }: { url: string }) => ({ result: { ogTitle: `Title of ${url}` } })),
}));

import { scrapeUrl, titleFromUrl } from "../scraper";

const redirect = (location: string) => new Response(null, { status: 302, headers: { location } });
afterEach(() => vi.unstubAllGlobals());

describe("scrapeUrl redirect checks", () => {
  it("follows public redirects and scrapes the final page", async () => {
    vi.stubGlobal("fetch", vi.fn()
      .mockResolvedValueOnce(redirect("https://www.example.com/a"))
      .mockResolvedValueOnce(new Response("ok", { status: 200 })));
    const meta = await scrapeUrl("https://example.com/a");
    expect(meta.title).toBe("Title of https://www.example.com/a");
  });

  it("refuses a redirect to a private address", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(redirect("http://internal.test/admin")));
    await expect(scrapeUrl("https://example.com/")).rejects.toThrow("private");
  });

  it("refuses a redirect to a private IP literal", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(redirect("http://169.254.169.254/latest/")));
    await expect(scrapeUrl("https://example.com/")).rejects.toThrow("private");
  });

  it("gives up after too many redirects", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => redirect("https://example.com/loop")));
    await expect(scrapeUrl("https://example.com/loop")).rejects.toThrow("too many");
  });
});

describe("titleFromUrl", () => {
  it("drops the query string and fragment", () => {
    expect(titleFromUrl("https://example.com/reset?token=secret#x")).toBe("example.com/reset");
    expect(titleFromUrl("https://example.com/")).toBe("example.com");
  });
});
