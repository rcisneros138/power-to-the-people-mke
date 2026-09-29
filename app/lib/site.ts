// Build-time origin for canonicals, OG tags, sitemap and robots.
//
// Production is the DEFAULT on purpose. The two failure modes are asymmetric:
// a staging build that forgets the env var becomes crawlable (recoverable, and
// Cloudflare Access blocks crawlers anyway), whereas a production build that
// forgets it would ship `noindex` to the live site and tank organic traffic.
// So the safe default is prod, and staging has to opt in explicitly.
export const PRODUCTION_URL = "https://powertothepeoplemke.org";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL;

export const IS_PRODUCTION = SITE_URL === PRODUCTION_URL;
