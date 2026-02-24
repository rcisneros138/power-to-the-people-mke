import type { Metadata } from "next";
import { Header, Footer, CTABanner } from "../components";
import { getEvents, WPEvent } from "../lib/wordpress";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming meetings, rallies, canvassing events, and community forums for public power in Milwaukee.",
  openGraph: {
    title: "Events | Power to the People MKE",
    description:
      "Upcoming events for the Milwaukee public power campaign.",
  },
};

const defaultEvents: WPEvent[] = [
  {
    id: "1",
    slug: "community-meeting-march",
    title: "Community Meeting: The Case for Public Power",
    content: "Join us for a community discussion about why Milwaukee should replace We Energies with a municipally owned utility. Learn about Wisconsin Chapter 197 and how other cities have successfully transitioned to public power.",
    date: "2026-03-15T18:00:00",
    eventDate: "2026-03-15T18:00:00",
    location: "Milwaukee Public Library - Central Branch, 814 W Wisconsin Ave",
  },
  {
    id: "2",
    slug: "canvassing-kickoff",
    title: "Neighborhood Canvassing Kickoff",
    content: "Help us spread the word door-to-door in Milwaukee neighborhoods. Training provided for new volunteers. We'll cover talking points, FAQ responses, and canvassing best practices.",
    date: "2026-03-22T10:00:00",
    eventDate: "2026-03-22T10:00:00",
    location: "Cesar Chavez Community Center, 2221 S Cesar Chavez Dr",
  },
  {
    id: "3",
    slug: "town-hall-energy-costs",
    title: "Town Hall: Milwaukee Energy Costs",
    content: "A public forum examining We Energies rate increases and their impact on Milwaukee families. Featuring presentations from energy policy experts and community testimony.",
    date: "2026-04-05T14:00:00",
    eventDate: "2026-04-05T14:00:00",
    location: "Sherman Phoenix, 3536 W Fond du Lac Ave",
  },
  {
    id: "4",
    slug: "coalition-planning-session",
    title: "Coalition Planning Session",
    content: "Monthly coalition meeting for partner organizations. We'll discuss campaign strategy, upcoming actions, and coordinate efforts across the movement.",
    date: "2026-04-12T17:30:00",
    eventDate: "2026-04-12T17:30:00",
    location: "Milwaukee DSA Office",
  },
];

function formatEventDate(dateString: string): { month: string; day: string; time: string } {
  const date = new Date(dateString);
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate().toString(),
    time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
  };
}

function EventCard({ event }: { event: WPEvent }) {
  const dateStr = event.eventDate || event.date;
  const { month, day, time } = formatEventDate(dateStr);

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-navy/5 hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row">
      {/* Date badge */}
      <div className="flex-shrink-0 sm:w-24 bg-coral text-white flex sm:flex-col items-center justify-center p-3 sm:p-4 gap-2 sm:gap-0">
        <span className="text-sm font-bold tracking-wider">{month}</span>
        <span className="text-3xl font-spectral font-extrabold leading-none">{day}</span>
        <span className="text-xs mt-1 opacity-80">{time}</span>
      </div>

      {/* Event details */}
      <div className="p-6 flex-1">
        <h3 className="text-xl font-spectral font-bold text-navy mb-2">
          {event.title}
        </h3>
        {event.location && (
          <p className="text-sm text-navy/60 mb-3 flex items-start gap-1.5">
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {event.location}
          </p>
        )}
        <p className="text-navy/70 text-sm leading-relaxed line-clamp-2">
          {event.content.replace(/<[^>]*>/g, "")}
        </p>
      </div>
    </div>
  );
}

export default async function EventsPage() {
  const wpEvents = await getEvents(20);
  const events = wpEvents.length > 0 ? wpEvents : defaultEvents;

  // Split into upcoming and past based on current date
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.eventDate || e.date) >= now);
  const past = events.filter((e) => new Date(e.eventDate || e.date) < now);

  return (
    <>
      <Header />

      <main className="bg-cream min-h-screen" id="main-content">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-spectral font-bold text-navy text-center mb-4">
            Events
          </h1>
          <p className="text-center text-navy/70 max-w-2xl mx-auto mb-12 text-lg">
            Join us at meetings, rallies, canvassing events, and community forums across Milwaukee.
          </p>

          {/* Upcoming events */}
          {upcoming.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl sm:text-3xl font-spectral font-bold text-navy mb-6">
                Upcoming Events
              </h2>
              <div className="space-y-4">
                {upcoming.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* No upcoming events fallback */}
          {upcoming.length === 0 && (
            <div className="text-center py-12 mb-16 bg-white rounded-xl border border-navy/5">
              <p className="text-navy/50 text-lg mb-2">No upcoming events scheduled.</p>
              <p className="text-navy/40 text-sm">Check back soon or sign up for our newsletter to stay informed.</p>
            </div>
          )}

          {/* Past events */}
          {past.length > 0 && (
            <section>
              <h2 className="text-2xl sm:text-3xl font-spectral font-bold text-navy mb-6 opacity-60">
                Past Events
              </h2>
              <div className="space-y-4 opacity-60">
                {past.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}
        </div>

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
