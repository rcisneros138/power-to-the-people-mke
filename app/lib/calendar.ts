import { XMLParser } from "fast-xml-parser";

/**
 * Solidarity Tech chapter calendar feed.
 *
 * Shape: <events><event><sessions><session>…. An "event" is the recurring
 * series (e.g. "Power to the People Phone Bank"); a "session" is one dated
 * occurrence. Sessions are what people attend, so they are the display unit.
 */
const FEED_URL =
  process.env.NEXT_PUBLIC_ST_CALENDAR_FEED ??
  "https://www.solidarity.tech/calendar/c/lho8VZJxTm8uxGcHkRT5ZPelFyDBDdPuS__0VfPKOhM.xml";

/**
 * The chapter is in Milwaukee, which is US Central.
 *
 * The feed's <timezone> element says "America/New_York" on every session, which
 * is WRONG — verified 2026-09-28 against Solidarity Tech's own rendering, which
 * shows a 19:30-04:00 session as "6:30 PM CDT". The UTC offset carried in
 * start_time is correct and authoritative; the <timezone> element is not, and
 * is deliberately ignored. Trusting it would show every event an hour late.
 *
 * Formatting is pinned to this zone rather than left to the runtime, because
 * the build runs on a UTC CI runner — unpinned formatting bakes UTC clock times
 * into the HTML.
 */
export const CAMPAIGN_TZ = "America/Chicago";

/** Tag Solidarity Tech uses to mark campaign events. */
export const PTTP_TAG = "Power to the People Event";

export interface CalendarSession {
  /** Solidarity Tech session id — unique per occurrence. */
  id: string;
  eventId: string;
  /** Session title, which usually carries the date suffix; falls back to the series title. */
  title: string;
  /** Series title, for grouping and for the cleaner display label. */
  eventTitle: string;
  description: string;
  /** Public RSVP page on Solidarity Tech. */
  url: string | null;
  imageUrl: string | null;
  /** ISO 8601 WITH offset. Keep the offset — it is the only trustworthy time signal. */
  start: string;
  end: string | null;
  isVirtual: boolean;
  location: string | null;
  tags: string[];
  isCampaignEvent: boolean;
}

/** fast-xml-parser returns untyped nodes: text, attributes, or nested nodes. */
type XmlValue = string | number | boolean | null | undefined | XmlNode | XmlValue[];
interface XmlNode {
  [key: string]: XmlValue;
}

/** A node's child, when that child is itself a node (or nodes). */
function node(v: XmlValue): XmlNode | undefined {
  return v !== null && typeof v === "object" && !Array.isArray(v) ? v : undefined;
}

/** XML collapses a single repeated child to one value; normalise to a list. */
function asArray(v: XmlValue): XmlNode[] {
  if (v === undefined || v === null) return [];
  const list = Array.isArray(v) ? v : [v];
  return list.map(node).filter((n): n is XmlNode => n !== undefined);
}

function text(v: XmlValue): string {
  if (v === undefined || v === null) return "";
  if (typeof v === "object") return "";
  return String(v).trim();
}

/** Flatten <tags><tag>a</tag><tag>b</tag></tags> to ["a","b"]. */
function tagList(container: XmlValue): string[] {
  const tags = node(container)?.tag;
  if (tags === undefined || tags === null) return [];
  const list = Array.isArray(tags) ? tags : [tags];
  return list.map(text).filter(Boolean);
}

/** Entries the chapter leaves in the feed but nobody should see on a public site. */
function isNoise(eventTitle: string, sessionTitle: string): boolean {
  const t = `${eventTitle} ${sessionTitle}`.toLowerCase();
  return t.includes("for testing purposes") || t.includes("cancelled") || t.includes("canceled");
}

export function parseCalendarFeed(xml: string, now: Date = new Date()): CalendarSession[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    trimValues: true,
  });

  const doc = parser.parse(xml) as XmlNode;
  const events = asArray(node(doc.events)?.event);
  const sessions: CalendarSession[] = [];

  for (const event of events) {
    const eventTitle = text(event.title);
    const eventTags = tagList(event.tags);

    for (const session of asArray(node(event.sessions)?.session)) {
      const start = text(session.start_time);
      if (!start) continue;

      const startMs = Date.parse(start);
      if (Number.isNaN(startMs)) continue;

      const end = text(session.end_time) || null;
      const endMs = end ? Date.parse(end) : NaN;

      // Drop anything already finished. Use end when it parses, so an event
      // running right now stays visible for its duration.
      const finishedAt = Number.isNaN(endMs) ? startMs : endMs;
      if (finishedAt < now.getTime()) continue;

      const sessionTitle = text(session.title);
      if (isNoise(eventTitle, sessionTitle)) continue;

      const sessionTags = tagList(session.tags);
      const tags = Array.from(new Set([...eventTags, ...sessionTags]));

      sessions.push({
        id: text(session["@_id"]) || `${text(event["@_id"])}-${start}`,
        eventId: text(event["@_id"]),
        title: sessionTitle || eventTitle,
        eventTitle,
        description: text(event.description),
        url: text(event.url) || null,
        imageUrl: text(event.image_url) || null,
        start,
        end,
        isVirtual: text(session.event_type) === "virtual",
        location: text(session.location) || null,
        tags,
        isCampaignEvent: tags.includes(PTTP_TAG),
      });
    }
  }

  return sessions.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}

/**
 * Build-time fetch. Never throws: a feed outage should degrade the calendar to
 * an empty state, not fail a deploy that has nothing to do with the calendar.
 */
export async function getCalendarSessions(): Promise<CalendarSession[]> {
  try {
    const res = await fetch(FEED_URL, { headers: { accept: "application/xml" } });
    if (!res.ok) {
      console.error(`Calendar feed returned ${res.status} ${res.statusText}`);
      return [];
    }
    return parseCalendarFeed(await res.text());
  } catch (error) {
    console.error("Could not fetch the calendar feed:", error);
    return [];
  }
}

/** All distinct tags present, most frequent first — drives the filter UI. */
export function collectTags(sessions: CalendarSession[]): string[] {
  const counts = new Map<string, number>();
  for (const s of sessions) {
    for (const tag of s.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
}

const dateFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: CAMPAIGN_TZ, weekday: "short", month: "short", day: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: CAMPAIGN_TZ, hour: "numeric", minute: "2-digit", timeZoneName: "short",
});
const monthFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: CAMPAIGN_TZ, month: "long", year: "numeric",
});
const dayNumFmt = new Intl.DateTimeFormat("en-US", { timeZone: CAMPAIGN_TZ, day: "numeric" });
const weekdayFmt = new Intl.DateTimeFormat("en-US", { timeZone: CAMPAIGN_TZ, weekday: "short" });

export const formatSessionDate = (iso: string) => dateFmt.format(new Date(iso));
export const formatSessionTime = (iso: string) => timeFmt.format(new Date(iso));
export const formatMonthLabel = (iso: string) => monthFmt.format(new Date(iso));
export const formatDayNumber = (iso: string) => dayNumFmt.format(new Date(iso));
export const formatWeekday = (iso: string) => weekdayFmt.format(new Date(iso));

/** Chronological groups keyed by "October 2026", preserving order. */
export function groupByMonth(
  sessions: CalendarSession[]
): Array<{ month: string; sessions: CalendarSession[] }> {
  const groups: Array<{ month: string; sessions: CalendarSession[] }> = [];
  for (const s of sessions) {
    const month = formatMonthLabel(s.start);
    const last = groups[groups.length - 1];
    if (last && last.month === month) last.sessions.push(s);
    else groups.push({ month, sessions: [s] });
  }
  return groups;
}

/**
 * Solidarity Tech stores location as one string: "Venue - 123 St, City, ST 00000, USA".
 * Split it so a venue can be shown without the postal tail. Shared by the
 * calendar page and the Get Involved teaser.
 */
export function splitLocation(location: string): { venue: string; address: string } {
  const parts = location.split(" - ");
  return {
    venue: parts[0],
    address: parts.slice(1).join(" - ").replace(/,\s*USA\s*$/, ""),
  };
}
