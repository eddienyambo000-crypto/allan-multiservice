import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Allan Multiservice Group — verified property, land & cars in Rwanda";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "#fff",
          fontFamily: "sans-serif",
          background: "linear-gradient(135deg, #0C8CE0 0%, #0A6FC0 55%, #064E8C 120%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 36 }}>
          <div style={{ display: "flex", width: 64, height: 64, borderRadius: 18, background: "#fff", color: "#0C8CE0", alignItems: "center", justifyContent: "center", fontSize: 40, fontWeight: 800 }}>A</div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>ALLAN Multiservice Group</div>
        </div>
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
          Verified homes, land &amp; cars in Rwanda.
        </div>
        <div style={{ marginTop: 28, fontSize: 30, color: "rgba(255,255,255,0.85)" }}>
          Buy · Rent · Diaspora-friendly · Prices in RWF &amp; USD
        </div>
        <div style={{ position: "absolute", right: 64, bottom: 56, display: "flex", background: "#FF4D8D", color: "#fff", padding: "14px 28px", borderRadius: 999, fontSize: 26, fontWeight: 700 }}>
          allan-multiservice.vercel.app
        </div>
      </div>
    ),
    size,
  );
}
