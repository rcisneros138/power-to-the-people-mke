import type { Metadata } from "next";
import Script from "next/script";
import { AnimateOnScroll, Header, Footer, CTABanner } from "../components";

// `event-calendar-embed` is a chrome-stripped clone of `event-calendar` —
// its Head HTML hides .pb-navigation / .pb-header / .pb-footer when the
// path ends in /embed or it's loaded inside a frame.
// `?breakout=true` makes RSVP form submissions redirect the parent page so
// the user can't get stuck inside the embed.
const SOLIDARITY_TECH_URL =
  "https://dsamke.solidarity.tech/event-calendar-embed/embed?breakout=true";

// Link-out goes to the fully-branded ST page, not the stripped clone — if a
// user's browser blocks the iframe (third-party cookies, etc.), the standalone
// DSA page is the better fallback experience.
const SOLIDARITY_TECH_PUBLIC_URL =
  "https://dsamke.solidarity.tech/event-calendar";

export const metadata: Metadata = {
  title: "Events & Calendar",
  description:
    "Upcoming meetings, rallies, canvassing, and community forums for public power in Milwaukee. RSVP for events directly through our Solidarity Tech calendar.",
  alternates: { canonical: "/calendar" },
  openGraph: {
    url: "/calendar",
    title: "Events & Calendar | Power to the People MKE",
    description:
      "Upcoming events for the Milwaukee public power campaign.",
    images: ["/opengraph-image"],
  },
};

export default function CalendarPage() {
  return (
    <>
      <Header />

      <main className="bg-cream min-h-screen" id="main-content">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <AnimateOnScroll animation="fade-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-spectral font-bold text-navy text-center mb-4">
              Calendar
            </h1>
            <p className="text-center text-navy/70 max-w-2xl mx-auto mb-12 text-lg">
              Join us at meetings, rallies, canvassing events, and community
              forums across Milwaukee. RSVP through any event below — you&apos;ll
              get a confirmation email and reminders as the date approaches.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-up">
            <div className="bg-white rounded-xl border border-navy/5 overflow-hidden shadow-sm">
              <iframe
                id="solidarity-calendar"
                src={SOLIDARITY_TECH_URL}
                title="Power to the People MKE — campaign calendar"
                className="w-full block border-0"
                // Small placeholder height to avoid jank during initial load —
                // the postMessage resize receiver below adjusts to actual content
                // (typically ~1000px) within ~200ms of iframe load.
                style={{ minHeight: 600 }}
                loading="lazy"
              />
            </div>

            <p className="mt-4 text-center text-sm text-navy/60">
              Having trouble viewing the calendar?{" "}
              <a
                href={SOLIDARITY_TECH_PUBLIC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-coral-dark transition-colors"
              >
                Open it in a new tab
              </a>
              .
            </p>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll animation="fade-up">
          <CTABanner
            title="Want to host an event?"
            description="We'll help you organize a community forum, house party, or canvassing event in your neighborhood."
            buttonText="Get in Touch"
            buttonHref="/get-involved"
          />
        </AnimateOnScroll>
      </main>

      <Footer />

      {/*
        Solidarity Tech sends `postMessage` height updates from inside the iframe.
        We target by id (not document.querySelector('iframe')) so this stays robust
        if another iframe is ever added to the page (YouTube embed, etc.).
        Buffer of +20px matches Solidarity Tech's recommended snippet.
      */}
      <Script id="solidarity-tech-resize-receiver" strategy="afterInteractive">
        {`
          window.addEventListener('message', function(event) {
            if (event.data && event.data.type === 'solidarity-tech-resize') {
              var iframe = document.getElementById('solidarity-calendar');
              if (iframe) {
                iframe.style.height = (event.data.height + 20) + 'px';
              }
            }
          });
        `}
      </Script>
    </>
  );
}
