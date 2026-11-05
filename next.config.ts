import type { NextConfig } from "next";

// Set by `npm run build:static` (see scripts/build-static.mjs). GitHub Pages only serves static
// files, so that script builds with `/admin` and `/api` temporarily moved out of `app/` — neither
// can run without a server (cookies, Server Actions, a live route handler) — and this flag swaps
// in `output: "export"` plus an unoptimized image loader, both required for a static export.
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  // Cache Components implements Partial Prerendering by default, and PPR can't be combined with
  // `output: "export"` — Next rejects that combination outright. A static export has no server to
  // stream a dynamic shell into anyway, so both are off for the export build; `'use cache'` and
  // `cacheTag` calls just run once, like any other `async` call, while the pages are generated.
  cacheComponents: !isStaticExport,
  images: {
    qualities: [75, 90],
    // Admin thumbnails on the static site load from the commit directly. The public pages keep
    // using `/media/uploads/...`, which exists only after GitHub Pages rebuilds.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/Amarkharvi/amarkharvi.github.io/**",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
      {
        protocol: "https",
        hostname: "*.blob.vercel-storage.com",
      },
    ],
    ...(isStaticExport ? { unoptimized: true } : {}),
  },
  ...(isStaticExport
    ? { output: "export" }
    : {
        outputFileTracingIncludes: {
          "/api/shop/download": ["./private/luts/**/*"],
        },
      }),
  partialPrefetching: !isStaticExport,
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
