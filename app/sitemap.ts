import type { MetadataRoute } from "next";
import { getAllPostSlugs } from "./lib/wordpress";

export const dynamic = "force-static";

const SITE_URL = "https://powertothepeoplemke.org";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.9 },
  { path: "/get-involved", changeFrequency: "weekly", priority: 0.9 },
  { path: "/calendar", changeFrequency: "daily", priority: 0.8 },
  { path: "/resources", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/partners", changeFrequency: "monthly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const postSlugs = await getAllPostSlugs().catch(() => []);
  const postEntries: MetadataRoute.Sitemap = postSlugs
    .filter((slug) => slug && slug !== "_")
    .map((slug) => ({
      url: `${SITE_URL}/news/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  return [...staticEntries, ...postEntries];
}
