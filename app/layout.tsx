import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Source_Sans_3, Bebas_Neue, Spectral } from "next/font/google";
import localFont from "next/font/local";
import { AnnouncementBar } from "./components";
import { getActiveAnnouncement } from "./lib/wordpress";
import "./globals.css";

const SITE_URL = "https://powertothepeoplemke.org";
const SITE_NAME = "Power to the People Milwaukee";
const SITE_DESCRIPTION =
  "A Milwaukee campaign to replace We Energies with a publicly owned municipal utility. Lower bills, better reliability, and a cleaner future for Milwaukee.";

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Public Power for Milwaukee`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "public power Milwaukee",
    "municipal utility Milwaukee",
    "We Energies alternative",
    "Milwaukee energy democracy",
    "Chapter 197 Wisconsin",
    "Power to the People MKE",
    "Milwaukee DSA",
    "publicly owned utility",
    "energy justice Milwaukee",
  ],
  category: "politics",
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Public Power for Milwaukee`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Public Power for Milwaukee`,
    description: SITE_DESCRIPTION,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#133020",
  colorScheme: "light",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "Power to the People MKE",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg`,
  description: SITE_DESCRIPTION,
  areaServed: {
    "@type": "City",
    name: "Milwaukee",
    containedInPlace: {
      "@type": "State",
      name: "Wisconsin",
    },
  },
  sameAs: [
    "https://milwaukeedsa.org",
    "https://dsamke.solidarity.tech/event-calendar",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "en-US",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const announcement = await getActiveAnnouncement();

  return (
    <html lang="en">
      <body className={`${sourceSans3.variable} ${bebasNeue.variable} ${spectral.variable} ${talina.variable} ${creamCake.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-coral focus:text-navy focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-bold"
        >
          Skip to main content
        </a>
        <AnnouncementBar announcement={announcement} />
        {children}
        <Script
          id="schema-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script
          id="schema-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
