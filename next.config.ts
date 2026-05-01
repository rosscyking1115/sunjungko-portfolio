import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy
 *
 * - script-src 'unsafe-inline': Next.js runtime injects small inline scripts
 *   for hydration. Drop 'unsafe-eval' in production.
 * - challenges.cloudflare.com: Cloudflare Turnstile widget on /contact.
 * - vercel.live: only used by the Vercel team-member preview-feedback widget.
 *   Real visitors don't load it. Allowing it avoids spurious CSP warnings
 *   when Ross/SunJung view their own deploy while logged in to Vercel.
 * - va.vercel-scripts.com + vitals.vercel-insights.com: anticipates Vercel
 *   Analytics + Speed Insights if we add them later. Harmless to allow now.
 */
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://challenges.cloudflare.com https://vercel.live https://va.vercel-scripts.com`,
  `style-src 'self' 'unsafe-inline'`,
  `font-src 'self' data:`,
  `img-src 'self' data: blob: https:`,
  `connect-src 'self' https://challenges.cloudflare.com https://vercel.live https://vitals.vercel-insights.com`,
  `frame-src 'self' https://challenges.cloudflare.com`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
