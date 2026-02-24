import type { Metadata } from "next";
import { Source_Sans_3, Bebas_Neue, Spectral } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const talina = localFont({
  src: "./fonts/Talina.otf",
  variable: "--font-talina",
  display: "swap",
});

const creamCake = localFont({
  src: "./fonts/CreamCakeBold.otf",
  variable: "--font-cream-cake",
  display: "swap",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const spectral = Spectral({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-spectral",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://powertothepeoplemke.org"),
  title: {
    default: "Power to the People Milwaukee",
    template: "%s | Power to the People MKE",
  },
  description:
    "A campaign to replace We Energies with a municipally owned utility. Lower bills. Better service. A cleaner future for Milwaukee.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Power to the People Milwaukee",
    title: "Power to the People Milwaukee",
    description:
      "A campaign to replace We Energies with a municipally owned utility. Lower bills. Better service. A cleaner future for Milwaukee.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Power to the People Milwaukee",
    description:
      "A campaign to replace We Energies with a municipally owned utility. Lower bills. Better service. A cleaner future for Milwaukee.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sourceSans3.variable} ${bebasNeue.variable} ${spectral.variable} ${talina.variable} ${creamCake.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-coral focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
