import type { NextConfig } from "next";

// Bookmark thumbnails/images are always proxied through Next's own
// /_next/image route (every <img> in this app goes through next/image —
// see src/components/BookmarkCard.tsx etc.), so the browser never fetches
// arbitrary hosts directly. That keeps img-src scoped to 'self' below even
// though the scraped thumbnails originate from any bookmarked site.
const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://*.supabase.co";

// The layout has one inline <script> (theme-flash prevention, runs before
// hydration) and the app uses inline style={{}} throughout — both need
// 'unsafe-inline' rather than a stricter nonce-based CSP, which would need
// per-request nonce plumbing through middleware. Documented tradeoff, not
// an oversight: this still blocks the common cases (foreign script/object
// injection, clickjacking, protocol-relative asset loads).
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseOrigin} https://vitals.vercel-insights.com https://va.vercel-scripts.com`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
