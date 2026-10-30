import { describe, expect, it, vi } from "vitest";

vi.mock("node:dns", () => ({
  lookup: (host: string, _opts: unknown, cb: (e: Error | null, a: { address: string; family: number }[]) => void) =>
    cb(null, host === "rebind.test" ? [{ address: "127.0.0.1", family: 4 }] : [{ address: "93.184.215.14", family: 4 }]),
}));

import { publicOnlyAgent } from "../safe-fetch";

// Reach into the agent's connect options to call its lookup the way a socket would
type Lookup = (h: string, o: object, cb: (...args: unknown[]) => void) => void;
const lookup = (publicOnlyAgent as unknown as { [k: symbol]: { connect?: { lookup: Lookup } } });
const connectLookup = (): Lookup => {
  for (const sym of Object.getOwnPropertySymbols(lookup)) {
    const opts = lookup[sym];
    if (opts && typeof opts === "object" && opts.connect?.lookup) return opts.connect.lookup;
  }
  throw new Error("lookup not found on agent");
};

describe("publicOnlyAgent lookup", () => {
  it("refuses a hostname that resolves to a private address at connect time", async () => {
    const err = await new Promise((resolve) => connectLookup()("rebind.test", {}, (e) => resolve(e)));
    expect(String(err)).toMatch(/private address/);
  });

  it("returns the address for a public hostname", async () => {
    const res = await new Promise<unknown[]>((resolve) => connectLookup()("example.com", {}, (...a) => resolve(a)));
    expect(res[0]).toBeNull();
    expect(res[1]).toBe("93.184.215.14");
  });
});
