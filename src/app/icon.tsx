import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1a1a1a",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: 7,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 0 }}>
          <span
            style={{
              color: "#e0e0e0",
              fontSize: 17,
              fontWeight: 800,
              fontFamily: "sans-serif",
              letterSpacing: "-1px",
              lineHeight: 1,
            }}
          >
            k
          </span>
          <span
            style={{
              color: "#555555",
              fontSize: 17,
              fontWeight: 800,
              fontFamily: "sans-serif",
              letterSpacing: "-1px",
              lineHeight: 1,
            }}
          >
            .
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
