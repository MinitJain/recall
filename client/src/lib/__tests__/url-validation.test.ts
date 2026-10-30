import { describe, expect, it, vi } from "vitest";

vi.mock("dns/promises", () => ({
  lookup: vi.fn(async (host: string) => {
    const table: Record<string, string[]> = {
      "example.com": ["93.184.215.14", "2606:2800:21f:cb07:6820:80da:af6b:8b2c"],
      "localtest.me": ["127.0.0.1"],
      "mixed.test": ["93.184.215.14", "10.0.0.5"],
    };
    const addrs = table[host];
    if (!addrs) throw new Error("ENOTFOUND");
    return addrs.map((address) => ({ address, family: address.includes(":") ? 6 : 4 }));
  }),
}));

import { isPrivateIp, isPublicHost, isSafeUrl } from "../url-validation";

// What URL() turns each input into, so tests cover the hostnames the route really sees
const hostOf = (url: string) => new URL(url).hostname;

describe("isPrivateIp", () => {
  it.each([
    "127.0.0.1",
    "10.1.2.3",
    "172.16.0.1",
    "172.31.255.255",
    "192.168.1.1",
    "169.254.169.254",
    "100.64.0.1",
    "0.0.0.0",
    "224.0.0.1",
    "::1",
    "::",
    "fe80::1",
    "fd00::1",
  ])("blocks %s", (ip) => expect(isPrivateIp(ip)).toBe(true));

  it.each(["8.8.8.8", "93.184.215.14", "172.32.0.1", "100.128.0.1", "2606:4700::1111"])(
    "allows %s",
    (ip) => expect(isPrivateIp(ip)).toBe(false),
  );

  it("handles bracketed IPv6 hostnames from URL()", () => {
    expect(isPrivateIp(hostOf("http://[::1]/"))).toBe(true);
  });

  it("handles IPv4-mapped IPv6, including URL()'s hex form", () => {
    expect(isPrivateIp("::ffff:127.0.0.1")).toBe(true);
    expect(isPrivateIp(hostOf("http://[::ffff:127.0.0.1]/"))).toBe(true);
    expect(isPrivateIp(hostOf("http://[::ffff:8.8.8.8]/"))).toBe(false);
  });

  it("handles numeric IPv4 forms that URL() normalises", () => {
    expect(isPrivateIp(hostOf("http://2130706433/"))).toBe(true);
    expect(isPrivateIp(hostOf("http://0x7f.1/"))).toBe(true);
  });
});

describe("isPublicHost", () => {
  it("allows a public name whose addresses are all public", async () => {
    expect(await isPublicHost("example.com")).toBe(true);
  });

  it("rejects names that resolve to private addresses", async () => {
    expect(await isPublicHost("localtest.me")).toBe(false);
    expect(await isPublicHost("mixed.test")).toBe(false);
  });

  it("rejects local names without resolving them", async () => {
    for (const h of ["localhost", "app.localhost", "printer.local", "db.internal"]) {
      expect(await isPublicHost(h)).toBe(false);
    }
  });

  it("rejects private IP literals and allows public ones", async () => {
    expect(await isPublicHost(hostOf("http://[::1]/"))).toBe(false);
    expect(await isPublicHost("169.254.169.254")).toBe(false);
    expect(await isPublicHost("8.8.8.8")).toBe(true);
  });

  it("rejects names that don't resolve", async () => {
    expect(await isPublicHost("does-not-exist.test")).toBe(false);
  });
});

describe("isSafeUrl", () => {
  it("allows public https URLs", () => {
    expect(isSafeUrl("https://example.com/image.png")).toBe(true);
  });

  it.each([
    "http://example.com/image.png",
    "https://localhost/x.png",
    "https://[::1]/x.png",
    "https://192.168.0.1/x.png",
    "javascript:alert(1)",
    "not a url",
  ])("rejects %s", (url) => expect(isSafeUrl(url)).toBe(false));
});
