import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
    ],
  },
  // Empaqueta la base SQLite de solo lectura junto a cada función serverless:
  // se referencia por string en runtime, así que el tracing no la ve sola.
  outputFileTracingIncludes: {
    "/**": ["./local.db"],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "gsap"],
  },
};

export default nextConfig;
