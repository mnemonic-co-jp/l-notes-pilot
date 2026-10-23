import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Static export cannot combine a prerendered shell with streamed holes.
  // cacheComponents (PPR) and partialPrefetching require that runtime.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
