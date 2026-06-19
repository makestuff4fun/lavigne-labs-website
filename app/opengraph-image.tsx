import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const dynamic = "force-static"; // needed for `output: export`
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b1220",
          color: "white",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "white",
              color: "#0b1220",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            L
          </div>
          <div style={{ fontSize: 30, fontWeight: 600 }}>{site.name}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: 980,
            }}
          >
            <span>Manufacture in China without the&nbsp;</span>
            <span style={{ color: "#93c5fd" }}>costly mistakes.</span>
          </div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.65)", maxWidth: 820 }}>
            Electronics, prototyping &amp; on-the-ground production management for
            US &amp; Canadian hardware teams.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
