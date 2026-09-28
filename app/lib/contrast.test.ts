import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Guards the palette's WCAG 2.1 AA floors. Tokens are read out of globals.css
// so retuning a brand color fails here instead of silently on the live site.
const css = readFileSync(join(__dirname, "../globals.css"), "utf8");

function token(name: string): string {
  const hex = css.match(new RegExp(`--color-${name}:\\s*(#[0-9A-Fa-f]{6})`))?.[1];
  if (!hex) throw new Error(`token --color-${name} not found in globals.css`);
  return hex;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

const WHITE = "#FFFFFF";

describe("palette contrast (WCAG 2.1 AA)", () => {
  // SC 1.4.3 — text under 18.66px bold needs 4.5:1. The Header/Footer petition
  // CTAs and the skip link are all 14px bold, so they sit on coral-deep.
  it("white on coral-deep clears 4.5:1 for normal text", () => {
    expect(ratio(WHITE, token("coral-deep"))).toBeGreaterThanOrEqual(4.5);
  });

  it("white on coral-deep-dark stays passing on hover", () => {
    expect(ratio(WHITE, token("coral-deep-dark"))).toBeGreaterThanOrEqual(4.5);
  });

  it("hover is darker than rest, not lighter", () => {
    expect(luminance(token("coral-deep-dark"))).toBeLessThan(
      luminance(token("coral-deep"))
    );
  });

  // SC 1.4.11 — a control's fill needs 3:1 against the page behind it.
  it("coral-deep clears 3:1 against the cream page", () => {
    expect(ratio(token("coral-deep"), token("cream"))).toBeGreaterThanOrEqual(3);
  });

  // SC 1.4.3 large-text exemption (>=18.66px bold) needs only 3:1. Hero,
  // CTABanner, MobileMenu and get-involved keep plain coral at text-xl bold.
  it("white on plain coral still clears the 3:1 large-text floor", () => {
    expect(ratio(WHITE, token("coral"))).toBeGreaterThanOrEqual(3);
  });

  // The regression this whole change exists to prevent: plain coral is NOT
  // safe under small text, in either direction.
  it("documents why small text cannot sit on plain coral", () => {
    expect(ratio(WHITE, token("coral"))).toBeLessThan(4.5);
    expect(ratio(token("navy"), token("coral"))).toBeLessThan(4.5);
  });

  // Announcement bar: white label on each urgency background.
  it.each(["navy", "coral-deep", "urgent"])(
    "announcement variant %s carries its label",
    (bg) => {
      expect(ratio(WHITE, token(bg))).toBeGreaterThanOrEqual(4.5);
    }
  );
});
