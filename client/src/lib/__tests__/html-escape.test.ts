import { describe, expect, it } from "vitest";
import { escapeHtml } from "../html-escape";

describe("escapeHtml", () => {
  it("escapes the characters that can break out of HTML text or attributes", () => {
    expect(escapeHtml(`<a href="x" onclick='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;",
    );
  });

  it("escapes & first so entities aren't double-escaped incorrectly", () => {
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });
});
