import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.fullName} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default OG card for the home page (and fallback for any page that doesn't
 * provide its own). Carries the editorial design language: warm oatmeal
 * background, taupe accent, serif name, italic tagline.
 *
 * No external fonts are fetched — `serif` and `sans-serif` system stacks
 * render reliably across the various platforms that scrape OG cards
 * (LinkedIn, Twitter/X, Slack, Discord, iMessage). Custom fonts via
 * loadGoogleFont add flake risk for marginal aesthetic gain.
 */
export default async function Image() {
  // Split "SunJung Ko (Evelyn)" → name + parenthetical
  const fullName = siteConfig.fullName;
  const baseName = fullName.replace(/\s*\(.+\)\s*$/, "");
  const aka = fullName.match(/\(([^)]+)\)/)?.[1];

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#F7F3EB",
        color: "#3A3530",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        fontFamily: "serif",
      }}
    >
      {/* Top — role label */}
      <div
        style={{
          fontFamily: "sans-serif",
          fontSize: 18,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#8A8480",
        }}
      >
        {siteConfig.role}
      </div>

      {/* Middle — name + tagline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div
          style={{
            fontSize: 110,
            fontWeight: 400,
            letterSpacing: "-0.025em",
            lineHeight: 1.02,
            display: "flex",
            alignItems: "baseline",
            flexWrap: "wrap",
          }}
        >
          <span>{baseName}</span>
          {aka && (
            <span
              style={{
                fontStyle: "italic",
                color: "#9C7B5C",
                marginLeft: 24,
                fontSize: 68,
                fontWeight: 300,
              }}
            >
              ({aka})
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 38,
            fontStyle: "italic",
            fontWeight: 300,
            color: "#5A5450",
            maxWidth: 900,
            lineHeight: 1.25,
            display: "flex",
          }}
        >
          {`“${siteConfig.tagline}”`}
        </div>
      </div>

      {/* Bottom — meta */}
      <div
        style={{
          fontFamily: "sans-serif",
          fontSize: 18,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#8A8480",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{siteConfig.location}</span>
        <span>evelynsjko.com</span>
      </div>
    </div>,
    { ...size },
  );
}
