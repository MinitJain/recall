import { describe, expect, it } from "vitest";
import { monthsBefore } from "../examples";

describe("monthsBefore", () => {
  it("clamps to the last day of a shorter month", () => {
    expect(monthsBefore("2026-04-30T12:00:00Z", 2).toISOString().slice(0, 10)).toBe("2026-02-28");
  });

  it("keeps the day when the target month has it", () => {
    expect(monthsBefore("2026-10-31T12:00:00Z", 7).toISOString().slice(0, 10)).toBe("2026-03-31");
  });
});
