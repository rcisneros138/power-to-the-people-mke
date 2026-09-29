import { describe, it, expect, vi, afterEach } from "vitest";

// site.ts reads process.env at module load, so each case needs a fresh module
// registry rather than a re-import of the cached one.
async function loadWith(siteUrl?: string) {
  vi.resetModules();
  if (siteUrl === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = siteUrl;
  return {
    site: await import("./site"),
    robots: (await import("../robots")).default,
  };
}

const STAGING = "https://staging.powertothepeoplemke.org";

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
});

describe("site origin", () => {
  it("defaults to production when the env var is absent", async () => {
    const { site } = await loadWith();
    expect(site.SITE_URL).toBe(site.PRODUCTION_URL);
    expect(site.IS_PRODUCTION).toBe(true);
  });

  it("treats an explicit production URL as production", async () => {
    const { site } = await loadWith("https://powertothepeoplemke.org");
    expect(site.IS_PRODUCTION).toBe(true);
  });

  it("treats any other origin as non-production", async () => {
    const { site } = await loadWith(STAGING);
    expect(site.SITE_URL).toBe(STAGING);
    expect(site.IS_PRODUCTION).toBe(false);
  });
});

describe("robots.txt", () => {
  // The whole point of the staging environment: it is built from the same
  // WordPress content as production, so an indexed copy competes with the live
  // site. If this test ever goes green-to-red, staging is leaking into search.
  it("disallows everything on staging and advertises no sitemap", async () => {
    const { robots } = await loadWith(STAGING);
    const out = robots();
    expect(out.rules).toEqual([{ userAgent: "*", disallow: "/" }]);
    expect(out.sitemap).toBeUndefined();
    expect(out.host).toBeUndefined();
  });

  it("allows crawling and points at the sitemap in production", async () => {
    const { robots } = await loadWith();
    const out = robots();
    expect(out.rules).toEqual([{ userAgent: "*", allow: "/" }]);
    expect(out.sitemap).toBe("https://powertothepeoplemke.org/sitemap.xml");
  });
});
