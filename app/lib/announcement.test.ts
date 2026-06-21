import { describe, it, expect } from "vitest";
import { shouldShow } from "./announcement";

// A fixed "now" so tests are deterministic.
const NOW = Date.parse("2026-06-21T12:00:00Z");

describe("shouldShow", () => {
  it("shows a banner with no time bounds and no dismissal", () => {
    expect(
      shouldShow({ now: NOW, currentKey: "1:abc" })
    ).toBe(true);
  });

  it("hides a banner whose showFrom is in the future", () => {
    expect(
      shouldShow({ now: NOW, currentKey: "1:abc", showFrom: "2026-06-22T00:00:00Z" })
    ).toBe(false);
  });

  it("shows a banner once showFrom has passed", () => {
    expect(
      shouldShow({ now: NOW, currentKey: "1:abc", showFrom: "2026-06-20T00:00:00Z" })
    ).toBe(true);
  });

  it("hides a banner whose showUntil is in the past", () => {
    expect(
      shouldShow({ now: NOW, currentKey: "1:abc", showUntil: "2026-06-20T00:00:00Z" })
    ).toBe(false);
  });

  it("shows a banner still within its showUntil window", () => {
    expect(
      shouldShow({ now: NOW, currentKey: "1:abc", showUntil: "2026-06-30T00:00:00Z" })
    ).toBe(true);
  });

  it("shows a banner inside a from/until window", () => {
    expect(
      shouldShow({
        now: NOW,
        currentKey: "1:abc",
        showFrom: "2026-06-20T00:00:00Z",
        showUntil: "2026-06-30T00:00:00Z",
      })
    ).toBe(true);
  });

  it("hides when dismissible and the dismissed value matches the current key", () => {
    expect(
      shouldShow({
        now: NOW,
        currentKey: "1:abc",
        dismissible: true,
        dismissedValue: "1:abc",
      })
    ).toBe(false);
  });

  it("shows again when the dismissed value is stale (content changed)", () => {
    expect(
      shouldShow({
        now: NOW,
        currentKey: "1:def",
        dismissible: true,
        dismissedValue: "1:abc",
      })
    ).toBe(true);
  });

  it("ignores a stored dismissal when the banner is not dismissible", () => {
    expect(
      shouldShow({
        now: NOW,
        currentKey: "1:abc",
        dismissible: false,
        dismissedValue: "1:abc",
      })
    ).toBe(true);
  });

  it("treats malformed dates as no bound (shows)", () => {
    expect(
      shouldShow({ now: NOW, currentKey: "1:abc", showFrom: "not-a-date", showUntil: "" })
    ).toBe(true);
  });
});
