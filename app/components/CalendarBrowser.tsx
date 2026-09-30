"use client";

import { useMemo, useState } from "react";
import {
  formatSessionDate,
  formatSessionTime,
  formatDayNumber,
  formatWeekday,
  groupByMonth,
  type CalendarSession,
  splitLocation,
} from "../lib/calendar";

const CHAPTER_CALENDAR_URL = "https://dsamke.solidarity.tech/event-calendar";

type View = "campaign" | "all";

/**
 * Session titles carry the occurrence date ("… Phone Bank 10/08", "Membership
 * Phonebank on 10/11"). The date is on the tile, so the suffix is noise.
 */
// The `on` must be its own word — without the leading \s+ this ate the tail of
// "Socialism: An Introduction 01/16" and rendered "Socialism: An Introducti".
const DATE_SUFFIX = /(?:\s+on)?\s+\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\s*$/;
const squash = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

/** What a lone occurrence adds beyond the series name, if anything. */
function sessionNote(s: CalendarSession): string | null {
  const stripped = s.title.replace(DATE_SUFFIX, "").trim();
  if (!stripped || squash(stripped) === squash(s.eventTitle)) return null;
  return stripped;
}

/** "Venue - 123 Street, City, ST 00000, USA" → venue and a shorter address. */
const WEEKDAY_NAME: Record<string, string> = {
  Sun: "Sunday", Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday",
  Thu: "Thursday", Fri: "Friday", Sat: "Saturday",
};

/**
 * "Thu, Oct 1" → "Oct". Derived from the pinned formatter rather than a new
 * one so the month can never disagree with the day number beside it.
 */
const shortMonth = (iso: string) => formatSessionDate(iso).split(", ")[1].split(" ")[0];

/** Clock without the zone suffix, so a series that crosses CDT→CST stays one series. */
const clockOnly = (iso: string) => formatSessionTime(iso).split(" ").slice(0, 2).join(" ");

interface Series {
  key: string;
  eventId: string;
  title: string;
  /** The heading is the accessible description for every date tile below it. */
  headingId: string;
  isCampaignEvent: boolean;
  venue: string | null;
  address: string | null;
  /** Full time of the next occurrence, zone included. */
  time: string;
  /** "Thursdays" / "Saturday", or null when the dates land on different days. */
  weekday: string | null;
  note: string | null;
  sessions: CalendarSession[];
}

/**
 * The feed's display unit is the occurrence, but the page's unit is the thing
 * you can show up to. Nineteen campaign sessions are three standing dates; 89
 * chapter sessions are ~34. Grouping on event + place + clock means every fact
 * in the block header is true of every date in it, with no per-row hedging —
 * a series that moves venue or time simply splits into two honest blocks.
 */
function toSeries(sessions: CalendarSession[]): Series[] {
  const groups = new Map<string, CalendarSession[]>();
  // Earliest date per event, so the two halves of a split series stay side by
  // side instead of drifting apart on their own next dates.
  const eventStart = new Map<string, number>();
  for (const s of sessions) {
    const key = `${s.eventId}|${s.location ?? ""}|${clockOnly(s.start)}`;
    const list = groups.get(key);
    if (list) list.push(s);
    else groups.set(key, [s]);
    if (!eventStart.has(s.eventId)) eventStart.set(s.eventId, Date.parse(s.start));
  }

  const rank = (s: Series) => eventStart.get(s.eventId) ?? Date.parse(s.sessions[0].start);

  return [...groups.entries()]
    .map(([key, group]) => {
      const first = group[0];
      const weekdays = new Set(group.map((s) => formatWeekday(s.start)));
      const place =
        first.isVirtual || !first.location ? null : splitLocation(first.location);
      const name = WEEKDAY_NAME[[...weekdays][0]];
      return {
        key,
        eventId: first.eventId,
        title: first.eventTitle,
        headingId: `series-${key.replace(/[^a-zA-Z0-9]+/g, "-")}`,
        isCampaignEvent: group.some((s) => s.isCampaignEvent),
        venue: place?.venue ?? null,
        address: place?.address || null,
        time: formatSessionTime(first.start),
        weekday: weekdays.size === 1 && name ? (group.length > 1 ? `${name}s` : name) : null,
        // Only meaningful when there is one date to attach it to.
        note: group.length === 1 ? sessionNote(first) : null,
        sessions: group,
      };
    })
    .sort(
      (a, b) =>
        rank(a) - rank(b) ||
        Date.parse(a.sessions[0].start) - Date.parse(b.sessions[0].start)
    );
}

/** One date. The tile is the RSVP link — there is no separate button. */
function DateTile({
  session,
  showWeekday,
  describedBy,
}: {
  session: CalendarSession;
  showWeekday: boolean;
  describedBy: string;
}) {
  const stack = (
    <>
      {showWeekday && (
        <span className="block text-[0.65rem] font-bold uppercase tracking-[0.1em] opacity-75">
          {formatWeekday(session.start)}
        </span>
      )}
      <time dateTime={session.start} className="font-display text-2xl leading-none tracking-wide">
        {formatDayNumber(session.start)}
      </time>
    </>
  );

  const box =
    "flex min-h-[3rem] min-w-[3rem] flex-col items-center justify-center gap-0.5 px-2.5 py-1.5";

  if (!session.url) {
    return (
      <li>
        <span className={`${box} border border-dashed border-navy/60 text-navy`}>{stack}</span>
      </li>
    );
  }

  return (
    <li>
      <a
        href={session.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby={describedBy}
        className={`${box} border border-navy/60 text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white focus-visible:bg-navy focus-visible:text-white`}
      >
        {stack}
        <span className="sr-only">
          RSVP for {formatSessionDate(session.start)}, {formatSessionTime(session.start)} (opens in
          a new tab)
        </span>
      </a>
    </li>
  );
}

function SeriesBlock({ series, flagged }: { series: Series; flagged: boolean }) {
  const months = groupByMonth(series.sessions);
  const firstYear = series.sessions[0] && months[0].month.split(" ")[1];

  return (
    <article
      aria-labelledby={series.headingId}
      className="grid gap-x-10 gap-y-5 border-t border-navy/20 py-7 sm:py-8 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]"
    >
      <div className="min-w-0">
        {flagged && (
          <p className="mb-2">
            <span className="bg-coral-deep px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-wide text-white">
              Power to the People
            </span>
          </p>
        )}
        <h2
          id={series.headingId}
          className="text-navy text-lg sm:text-xl leading-snug normal-case tracking-normal break-words"
        >
          {series.title}
        </h2>
        {series.note && <p className="mt-1 text-navy/75 break-words">{series.note}</p>}
        <p className="mt-1.5 text-navy/80">
          {series.weekday ? `${series.weekday}, ${series.time}` : series.time}
        </p>
        {series.venue ? (
          <address className="not-italic mt-1 text-sm leading-snug text-navy/75 break-words">
            {series.venue}
            {series.address && <span className="block">{series.address}</span>}
          </address>
        ) : (
          <p className="mt-1 text-sm text-navy/75">Online</p>
        )}
      </div>

      <div className="flex min-w-0 flex-wrap items-start gap-x-7 gap-y-4">
        {months.map((group) => {
          const year = group.month.split(" ")[1];
          return (
            <div key={group.month} className="flex items-start gap-2.5">
              <span className="mt-3.5 shrink-0 text-xs font-bold uppercase tracking-[0.12em] text-navy/75">
                {shortMonth(group.sessions[0].start)}
                {year !== firstYear && <span className="ml-1">{year}</span>}
              </span>
              <ul className="flex flex-wrap gap-1.5">
                {group.sessions.map((session) => (
                  <DateTile
                    key={session.id}
                    session={session}
                    showWeekday={series.weekday === null}
                    describedBy={series.headingId}
                  />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </article>
  );
}

export default function CalendarBrowser({ sessions }: { sessions: CalendarSession[] }) {
  const [view, setView] = useState<View>("campaign");

  const campaign = useMemo(() => sessions.filter((s) => s.isCampaignEvent), [sessions]);
  const active = view === "campaign" ? campaign : sessions;
  const series = useMemo(() => toSeries(active), [active]);

  const options: Array<{ id: View; label: string; count: number }> = [
    { id: "campaign", label: "Power to the People", count: campaign.length },
    { id: "all", label: "All Milwaukee DSA", count: sessions.length },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
      <div className="js-only">
        <fieldset className="border-0 p-0 m-0">
          <legend className="font-spectral font-bold uppercase tracking-wide text-navy text-sm mb-3">
            Which events to show
          </legend>
          <div className="flex flex-wrap gap-2.5">
            {options.map((option) => {
              const selected = view === option.id;
              return (
                <label key={option.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="calendar-view"
                    value={option.id}
                    checked={selected}
                    onChange={() => setView(option.id)}
                    className="sr-only peer"
                  />
                  <span
                    className={`inline-flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-colors
                      peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-coral
                      ${
                        selected
                          ? "bg-navy text-white border border-navy"
                          : "bg-white text-navy border border-navy/55 hover:border-navy"
                      }`}
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden="true">
                      {selected ? (
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 10.5l4 4 8-9" />
                      ) : (
                        <circle cx="10" cy="10" r="7" strokeWidth={1.6} />
                      )}
                    </svg>
                    {option.label}
                    <span className={selected ? "text-white/70" : "text-navy/70"}>{option.count}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <p aria-live="polite" className="mt-3.5 text-navy/80">
          {active.length} {active.length === 1 ? "date" : "dates"} across {series.length}{" "}
          {series.length === 1 ? "event" : "events"}
          {view === "campaign" ? ". Switch to all Milwaukee DSA for every chapter meeting, class and social." : "."}
        </p>
      </div>

      <p className="no-js-only text-navy/80">
        {campaign.length} Power to the People dates. The full Milwaukee DSA calendar is on{" "}
        <a
          href={CHAPTER_CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-navy underline decoration-coral decoration-2 underline-offset-2 hover:decoration-4"
        >
          Solidarity Tech
        </a>
        .
      </p>

      {series.length === 0 ? (
        <div className="mt-10 border-2 border-navy bg-white p-8 sm:p-10">
          <h2 className="text-navy text-2xl mb-3">No campaign events are scheduled yet</h2>
          <p className="text-navy/80 leading-relaxed max-w-prose">
            Nothing is on the Power to the People calendar right now. The chapter is still
            meeting, so switch to all Milwaukee DSA events to see what&apos;s coming up.
          </p>
          <button
            type="button"
            onClick={() => setView("all")}
            className="js-only mt-6 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-white font-bold text-sm uppercase tracking-wide hover:bg-navy-dark transition-colors"
          >
            Show all Milwaukee DSA events
          </button>
        </div>
      ) : (
        <div className="mt-8 border-b border-navy/20">
          {series.map((s) => (
            <SeriesBlock
              key={s.key}
              series={s}
              flagged={view === "all" && s.isCampaignEvent}
            />
          ))}
        </div>
      )}

      <p className="mt-10 max-w-prose text-navy/75 text-sm leading-relaxed">
        Every date opens its own RSVP page on Solidarity Tech, which sends you a reminder
        and, for anything online, the joining link. Times are Central.{" "}
        <a
          href={CHAPTER_CALENDAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-navy underline decoration-coral decoration-2 underline-offset-2 hover:decoration-4"
        >
          Open the chapter calendar
        </a>
        .
      </p>
    </div>
  );
}
