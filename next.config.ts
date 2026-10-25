import type { NextConfig } from "next";

// actions/configure-pages sets this to /<repo> for project sites, and empty for a user site.
const pagesBasePath = process.env.PAGES_BASE_PATH?.replace(/\/$/, "");

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
  ...(pagesBasePath ? { basePath: pagesBasePath } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
