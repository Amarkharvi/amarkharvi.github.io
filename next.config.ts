import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    qualities: [75, 90],
  },
  outputFileTracingIncludes: {
    "/api/shop/download": ["./private/luts/**/*"],
  },
  partialPrefetching: true,
  experimental: {
    serverActions: {
      // the admin media library uploads images/reels through a Server Action
      bodySizeLimit: "80mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
