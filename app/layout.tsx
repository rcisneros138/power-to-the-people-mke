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
  title: "Power to the People Milwaukee",
  description: "A campaign to replace We Energies with a municipally owned utility",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sourceSans3.variable} ${bebasNeue.variable} ${spectral.variable} ${talina.variable} ${creamCake.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
