import Link from "next/link";
import {
  type CalendarSession,
  formatSessionDate,
  formatSessionTime,
  splitLocation,
} from "../lib/calendar";

/**
 * A short teaser of the next few sessions, for pages that aren't the calendar.
 *
 * Deliberately NOT the calendar page's component. That one groups 89 sessions
 * into series with date tiles and a filter, which is the right shape for
 * browsing and the wrong shape for "here are the next three". What the two
 * share is what's expensive and easy to get wrong — the feed parsing and the
 * pinned America/Chicago formatters — and that already lives in lib/calendar.
 */
export default function UpcomingEvents({ sessions }: { sessions: CalendarSession[] }) {
  const next = sessions.slice(0, 3);

  if (next.length === 0) {
    return (
      <p className="text-navy/70">
        No dates are on the calendar right now.{" "}
        <Link href="/calendar" className="text-navy underline decoration-coral hover:text-coral transition-colors">
          Check the calendar
        </Link>{" "}
        for the latest.
      </p>
    );
  }

  return (
    <div>
      <ul className="border-t border-navy/15">
        {next.map((s) => {
          const place = s.isVirtual || !s.location ? null : splitLocation(s.location);
          return (
            <li key={s.id} className="border-b border-navy/15">
              <a
                href={s.url ?? "/calendar"}
                target={s.url ? "_blank" : undefined}
                rel={s.url ? "noopener noreferrer" : undefined}
                className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 py-5 transition-colors hover:bg-navy/[0.03]"
              >
                <time
                  dateTime={s.start}
                  className="font-display text-2xl leading-none text-navy tabular-nums"
                >
                  {formatSessionDate(s.start)}
                </time>
                <span className="font-spectral font-bold text-navy group-hover:text-coral transition-colors">
                  {s.eventTitle}
                </span>
                <span className="w-full text-sm text-navy/75">
                  {formatSessionTime(s.start)}
                  {place ? ` · ${place.venue}` : s.isVirtual ? " · Online" : ""}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
      <Link
        href="/calendar"
        className="mt-6 inline-flex items-center gap-2 font-bold uppercase tracking-wider text-sm text-navy underline decoration-coral underline-offset-4 hover:text-coral transition-colors"
      >
        See the full calendar
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
