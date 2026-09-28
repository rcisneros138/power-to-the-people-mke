import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Static export has no image optimizer at runtime; without this next/image
  // emits /_next/image?... URLs that 404 in `out/`.
  images: { unoptimized: true },
};

export default nextConfig;
