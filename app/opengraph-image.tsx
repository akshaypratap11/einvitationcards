import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "निमंत्रण Utsav - Royal Indian Digital Invitation Card Maker";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at center, #54142d 0%, #360a1c 60%, #1e0510 100%)",
          color: "#fff",
          position: "relative",
          padding: "48px",
          fontFamily: "serif",
        }}
      >
        {/* Ornate Gold Border */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: "2px solid #d4af37",
            borderRadius: 16,
            display: "flex",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 32,
            right: 32,
            bottom: 32,
            border: "1px dashed rgba(212, 175, 55, 0.4)",
            borderRadius: 12,
            display: "flex",
            pointerEvents: "none",
          }}
        />

        {/* Diya Emblem */}
        <div
          style={{
            fontSize: 64,
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          🪔
        </div>

        {/* Brand Name */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: "4px",
            color: "#f5d77f",
            textTransform: "uppercase",
            marginBottom: 8,
            display: "flex",
          }}
        >
          निमंत्रण UTSAV
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 26,
            color: "#fdf8ee",
            fontWeight: 400,
            letterSpacing: "2px",
            marginBottom: 28,
            display: "flex",
            textAlign: "center",
          }}
        >
          Royal Indian Digital Invitation Card Maker
        </div>

        {/* Badges / Pillars */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              padding: "10px 22px",
              background: "rgba(212, 175, 55, 0.18)",
              border: "1px solid #d4af37",
              borderRadius: "9999px",
              color: "#f7e5a9",
              fontSize: 18,
              fontWeight: 600,
              display: "flex",
            }}
          >
            ✦ Royal Weddings
          </div>
          <div
            style={{
              padding: "10px 22px",
              background: "rgba(212, 175, 55, 0.18)",
              border: "1px solid #d4af37",
              borderRadius: "9999px",
              color: "#f7e5a9",
              fontSize: 18,
              fontWeight: 600,
              display: "flex",
            }}
          >
            ✦ Festive Birthdays
          </div>
          <div
            style={{
              padding: "10px 22px",
              background: "rgba(212, 175, 55, 0.18)",
              border: "1px solid #d4af37",
              borderRadius: "9999px",
              color: "#f7e5a9",
              fontSize: 18,
              fontWeight: 600,
              display: "flex",
            }}
          >
            ✦ Griha Pravesh & Pujas
          </div>
        </div>

        {/* Highlights Bar */}
        <div
          style={{
            fontSize: 16,
            color: "rgba(253, 248, 238, 0.75)",
            display: "flex",
            gap: "24px",
            letterSpacing: "1px",
          }}
        >
          <span>Door Reveal Animations</span>
          <span>•</span>
          <span>Shehnai Music</span>
          <span>•</span>
          <span>Google Maps Venue</span>
          <span>•</span>
          <span>WhatsApp Share & RSVP</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
