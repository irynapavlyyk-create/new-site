import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EnergyForge — Discover your energy phenotype";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #F59E0B 0%, #FF6B35 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          fontFamily: "sans-serif",
          color: "#0A0A0F",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "rgba(10, 10, 15, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              fontWeight: 700,
            }}
          >
            ⚡
          </div>
          <div
            style={{
              fontSize: "40px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            EnergyForge
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "104px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            Tired of being tired?
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 500,
              opacity: 0.8,
              lineHeight: 1.3,
              maxWidth: "900px",
            }}
          >
            AI builds your personalized 30-day energy protocol.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            fontSize: "24px",
            fontWeight: 600,
            opacity: 0.7,
          }}
        >
          energyforge.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
