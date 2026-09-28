import type { MetadataRoute } from "next";
import { SITE_URL, IS_PRODUCTION } from "./lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Staging serves unreleased work built from the same WordPress content as
  // production. An indexed copy would be duplicate content competing with the
  // live site, so it gets a blanket disallow and no sitemap pointer.
  if (!IS_PRODUCTION) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
