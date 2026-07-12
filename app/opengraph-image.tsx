import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Power to the People Milwaukee — A campaign for a publicly owned utility";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [talina, creamCake] = await Promise.all([
    readFile(join(process.cwd(), "app/fonts/Talina.otf")),
    readFile(join(process.cwd(), "app/fonts/CreamCakeBold.otf")),
  ]);

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
          background: "#FFB966",
          color: "#133020",
          padding: "48px 64px",
        }}
      >
        <div
          style={{
            fontFamily: "Talina",
            fontSize: 148,
            lineHeight: 0.85,
            letterSpacing: "-0.02em",
            textShadow: "7px 7px 0 #FF4715",
          }}
        >
          POWER
        </div>
        <div
          style={{
            fontFamily: "Talina",
            fontSize: 44,
            letterSpacing: "0.05em",
            margin: "18px 0",
          }}
        >
          TO THE
        </div>
        <div
          style={{
            fontFamily: "Talina",
            fontSize: 148,
            lineHeight: 0.85,
            letterSpacing: "-0.02em",
            textShadow: "7px 7px 0 #FF4715",
          }}
        >
          PEOPLE
        </div>
        <div
          style={{
            fontFamily: "CreamCake",
            fontSize: 38,
            marginTop: 36,
            opacity: 0.85,
          }}
        >
          A Milwaukee Democratic Socialists of America Campaign
        </div>
        <div
          style={{
            fontSize: 26,
            fontFamily: "Talina",
            letterSpacing: "0.08em",
            padding: "14px 36px",
            marginTop: 36,
            background: "#FF4715",
            color: "#FFFFFF",
            borderRadius: 999,
          }}
        >
          POWERTOTHEPEOPLEMKE.ORG
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Talina", data: talina, weight: 400, style: "normal" },
        { name: "CreamCake", data: creamCake, weight: 700, style: "normal" },
      ],
    },
  );
}
