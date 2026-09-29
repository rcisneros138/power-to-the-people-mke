import type { Metadata } from "next";
import { AnimateOnScroll, Header, Footer, CTABanner, CalendarBrowser } from "../components";
import { getCalendarSessions } from "../lib/calendar";

// If the feed is down at build time the page still ships — it just points at
// the chapter's own calendar instead.
const SOLIDARITY_TECH_PUBLIC_URL = "https://dsamke.solidarity.tech/event-calendar";

export const metadata: Metadata = {
  title: "Events & Calendar",
  description:
    "Upcoming meetings, rallies, canvassing, and community forums for public power in Milwaukee. RSVP for events directly through our Solidarity Tech calendar.",
  alternates: { canonical: "/calendar" },
  openGraph: {
    url: "/calendar",
    title: "Events & Calendar | Power to the People MKE",
    description: "Upcoming events for the Milwaukee public power campaign.",
    images: ["/opengraph-image"],
  },
};

export default async function CalendarPage() {
  const feed = await getCalendarSessions();

  // Descriptions are ~1.5KB of accessibility boilerplate apiece and nothing on
  // this page renders them; images are remote S3 URLs this export can't serve.
  // Strip both so 89 sessions don't become 130KB of dead JSON in the HTML.
  const sessions = feed.map((s) => ({
    ...s,
    description: "",
    imageUrl: null,
    tags: [],
  }));

  return (
    <>
      <Header />

      <main id="main-content" className="bg-cream">
        <section className="bg-cream pt-14 pb-10 sm:pt-20 sm:pb-12 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #133020 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 hero-entrance">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl text-navy mb-6">Calendar</h1>
            <div className="w-24 h-1.5 bg-coral mb-8 rounded-full" aria-hidden="true" />
            <p className="text-xl sm:text-2xl text-navy/80 leading-relaxed max-w-2xl">
              Phone banks, canvasses and working group meetings for public power in
              Milwaukee. Pick a date to RSVP — Solidarity Tech sends you a reminder
              before it comes round.
            </p>
          </div>
        </section>

        {sessions.length === 0 ? (
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
            <AnimateOnScroll animation="fade-up">
              <div className="border-2 border-navy bg-white p-8 sm:p-10">
                <h2 className="text-navy text-2xl sm:text-3xl mb-4">
                  The calendar isn&apos;t loading
                </h2>
                <p className="text-navy/80 leading-relaxed mb-3">
                  We couldn&apos;t reach Solidarity Tech when this page was last built, so
                  the event list is missing. Nothing is cancelled — the events are still
                  there.
                </p>
                <p className="text-navy/80 leading-relaxed mb-7">
                  Open the Milwaukee DSA calendar to see every upcoming phone bank, canvass
                  and meeting, and to RSVP.
                </p>
                <a
                  href={SOLIDARITY_TECH_PUBLIC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-coral px-8 py-3.5 text-white font-bold text-xl uppercase tracking-wider hover:bg-coral-dark transition-colors"
                >
                  Open the calendar
                  <span className="sr-only"> on Solidarity Tech (opens in a new tab)</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              </div>
            </AnimateOnScroll>
          </div>
        ) : (
          <CalendarBrowser sessions={sessions} />
        )}

        <CTABanner
          title="Want to host an event?"
          description="We'll help you organize a community forum, house party, or canvassing event in your neighborhood."
          buttonText="Get in Touch"
          buttonHref="/get-involved"
        />
      </main>

      <Footer />
    </>
  );
}
