import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Power to the People Milwaukee — A campaign for a publicly owned utility";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#FFB966",
          color: "#133020",
          padding: "80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: 0.8,
          }}
        >
          A Milwaukee DSA Campaign
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            justifyContent: "center",
            marginTop: -40,
          }}
        >
          <div
            style={{
              fontSize: 180,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
            }}
          >
            Power
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              margin: "8px 0",
            }}
          >
            to the
          </div>
          <div
            style={{
              fontSize: 180,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
            }}
          >
            People
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginTop: 24,
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              maxWidth: 760,
              lineHeight: 1.2,
            }}
          >
            Replace We Energies with a publicly owned utility.
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              padding: "12px 24px",
              background: "#133020",
              color: "#F5EBD6",
              borderRadius: 999,
            }}
          >
            powertothepeoplemke.org
          </div>
        </div>
      </div>
    ),
    size,
  );
}
