import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";
import { getCaseStudy } from "@/lib/case-studies";

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

  if (!study) {
    // Render a minimal fallback rather than throwing — keeps the build healthy
    // even if a slug is requested that doesn't exist on disk.
    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F7F3EB",
          color: "#3A3530",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          fontSize: 48,
        }}
      >
        {siteConfig.fullName}
      </div>,
      { ...size },
    );
  }

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
      {/* Top — category + period */}
      <div
        style={{
          fontFamily: "sans-serif",
          fontSize: 18,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#8A8480",
          display: "flex",
          gap: 24,
        }}
      >
        <span>{study.category}</span>
        <span style={{ color: "#C2BAB0" }}>·</span>
        <span>{study.period}</span>
      </div>

      {/* Middle — title + summary */}
      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div
          style={{
            fontSize: 84,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            maxWidth: 1040,
          }}
        >
          {study.title}
        </div>
        <div
          style={{
            fontSize: 30,
            fontStyle: "italic",
            fontWeight: 300,
            color: "#5A5450",
            maxWidth: 1000,
            lineHeight: 1.3,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {study.summary}
        </div>
      </div>

      {/* Bottom — author + domain */}
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
        <span>{siteConfig.fullName}</span>
        <span style={{ color: "#9C7B5C" }}>evelynsjko.com</span>
      </div>
    </div>,
    { ...size },
  );
}
