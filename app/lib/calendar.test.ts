import { describe, it, expect } from "vitest";
import {
  parseCalendarFeed, collectTags, groupByMonth, formatSessionTime,
  formatSessionDate, formatMonthLabel, CAMPAIGN_TZ, PTTP_TAG,
} from "./calendar";

const NOW = new Date("2026-09-29T00:00:00Z");

function feed(inner: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<events scope="chapter" name="Milwaukee" generated_at="2026-09-29T02:27:58Z">${inner}</events>`;
}

const phoneBank = `
  <event id="8714">
    <title>Power to the People Phone Bank</title>
    <description>Come join the campaign.</description>
    <url>https://dsamke.solidarity.tech/power-to-the-people-phone-bank</url>
    <image_url>https://example.com/img.jpg</image_url>
    <tags><tag>${PTTP_TAG}</tag></tags>
    <sessions>
      <session id="70185">
        <title>Power to the People Phone Bank 10/08</title>
        <start_time>2026-10-08T19:30:00-04:00</start_time>
        <end_time>2026-10-08T21:00:00-04:00</end_time>
        <timezone>America/New_York</timezone>
        <event_type>in_person</event_type>
        <location>Central United Methodist Church - 639 N 25th St, Milwaukee, WI 53233, USA</location>
        <tags><tag>Outreach</tag></tags>
      </session>
    </sessions>
  </event>`;

describe("timezone handling", () => {
  // The feed labels every Milwaukee session "America/New_York". Verified against
  // Solidarity Tech's own UI on 2026-09-28: it renders 19:30-04:00 as 6:30 PM CDT.
  // The offset is authoritative; the <timezone> element is not.
  it("renders a session at its Central wall-clock time, not the declared zone", () => {
    const [s] = parseCalendarFeed(feed(phoneBank), NOW);
    expect(formatSessionTime(s.start)).toBe("6:30 PM CDT");
  });

  it("ignores the misleading <timezone> element entirely", () => {
    const [s] = parseCalendarFeed(feed(phoneBank), NOW);
    expect(JSON.stringify(s)).not.toContain("America/New_York");
  });

  it("keeps the offset in the stored value so it can be re-formatted correctly", () => {
    const [s] = parseCalendarFeed(feed(phoneBank), NOW);
    expect(s.start).toBe("2026-10-08T19:30:00-04:00");
  });

  // The build runs on a UTC CI runner. Unpinned Intl formatting would bake UTC
  // clock times into the HTML, so every formatter pins CAMPAIGN_TZ.
  it("formats in Central regardless of the machine's local zone", () => {
    expect(CAMPAIGN_TZ).toBe("America/Chicago");
    expect(formatSessionDate("2026-10-08T19:30:00-04:00")).toBe("Thu, Oct 8");
    // 00:30 UTC on the 9th is still the evening of Thu the 8th in Milwaukee —
    // the date rolls over in UTC but not in Central.
    expect(formatSessionDate("2026-10-09T00:30:00+00:00")).toBe("Thu, Oct 8");
  });

  it("handles the CST/CDT boundary", () => {
    // US DST ended 2026-11-01. A session after it is CST, not CDT.
    expect(formatSessionTime("2026-11-10T19:30:00-05:00")).toBe("6:30 PM CST");
  });
});

describe("filtering", () => {
  it("drops sessions that already finished", () => {
    const past = phoneBank
      .replace("2026-10-08T19:30:00-04:00", "2026-09-03T19:30:00-04:00")
      .replace("2026-10-08T21:00:00-04:00", "2026-09-03T21:00:00-04:00");
    expect(parseCalendarFeed(feed(past), NOW)).toHaveLength(0);
  });

  it("keeps a session that started but has not ended", () => {
    const running = phoneBank
      .replace("2026-10-08T19:30:00-04:00", "2026-09-28T19:30:00-04:00")
      .replace("2026-10-08T21:00:00-04:00", "2026-09-29T03:00:00-04:00");
    expect(parseCalendarFeed(feed(running), NOW)).toHaveLength(1);
  });

  it("drops the chapter's test and cancelled entries", () => {
    const noisy = feed(`
      <event id="1"><title>for testing purposes</title><sessions><session id="a">
        <start_time>2026-10-08T19:30:00-04:00</start_time></session></sessions></event>
      <event id="2"><title>CANCELLED Fall Electoral Working Group Meeting</title><sessions><session id="b">
        <start_time>2026-10-09T19:30:00-04:00</start_time></session></sessions></event>`);
    expect(parseCalendarFeed(noisy, NOW)).toHaveLength(0);
  });

  it("survives a session with no end_time", () => {
    const noEnd = phoneBank.replace(/<end_time>.*?<\/end_time>/, "");
    const [s] = parseCalendarFeed(feed(noEnd), NOW);
    expect(s.end).toBeNull();
    expect(s.start).toBe("2026-10-08T19:30:00-04:00");
  });
});

describe("normalisation", () => {
  it("flattens event and session tags and flags campaign events", () => {
    const [s] = parseCalendarFeed(feed(phoneBank), NOW);
    expect(s.tags).toEqual(expect.arrayContaining([PTTP_TAG, "Outreach"]));
    expect(s.isCampaignEvent).toBe(true);
  });

  it("does not flag untagged chapter events as campaign events", () => {
    const other = feed(`
      <event id="9"><title>Pickup Soccer</title><sessions><session id="c">
        <start_time>2026-10-08T19:30:00-04:00</start_time>
        <event_type>in_person</event_type></session></sessions></event>`);
    expect(parseCalendarFeed(other, NOW)[0].isCampaignEvent).toBe(false);
  });

  it("reads virtual vs in-person", () => {
    const [inPerson] = parseCalendarFeed(feed(phoneBank), NOW);
    expect(inPerson.isVirtual).toBe(false);
    const virtual = phoneBank.replace("<event_type>in_person</event_type>", "<event_type>virtual</event_type>");
    expect(parseCalendarFeed(feed(virtual), NOW)[0].isVirtual).toBe(true);
  });

  it("falls back to the series title when a session has none", () => {
    const untitled = phoneBank.replace(/<title>Power to the People Phone Bank 10\/08<\/title>/, "");
    expect(parseCalendarFeed(feed(untitled), NOW)[0].title).toBe("Power to the People Phone Bank");
  });

  it("returns sessions in chronological order", () => {
    const two = feed(`
      <event id="1"><title>Later</title><sessions><session id="x">
        <start_time>2026-11-08T19:30:00-05:00</start_time></session></sessions></event>
      <event id="2"><title>Sooner</title><sessions><session id="y">
        <start_time>2026-10-08T19:30:00-04:00</start_time></session></sessions></event>`);
    expect(parseCalendarFeed(two, NOW).map((s) => s.eventTitle)).toEqual(["Sooner", "Later"]);
  });

  it("tolerates a single session not wrapped in an array", () => {
    expect(parseCalendarFeed(feed(phoneBank), NOW)).toHaveLength(1);
  });

  it("returns an empty list for a feed with no events", () => {
    expect(parseCalendarFeed(feed(""), NOW)).toEqual([]);
  });
});

describe("helpers", () => {
  it("orders tags by frequency", () => {
    const sessions = parseCalendarFeed(feed(phoneBank), NOW);
    expect(collectTags(sessions)).toContain(PTTP_TAG);
  });

  it("groups by Central month, chronologically", () => {
    const two = feed(`
      <event id="1"><title>A</title><sessions><session id="x">
        <start_time>2026-10-08T19:30:00-04:00</start_time></session></sessions></event>
      <event id="2"><title>B</title><sessions><session id="y">
        <start_time>2026-11-08T19:30:00-05:00</start_time></session></sessions></event>`);
    const groups = groupByMonth(parseCalendarFeed(two, NOW));
    expect(groups.map((g) => g.month)).toEqual(["October 2026", "November 2026"]);
  });

  it("puts a late-UTC session in the correct Central month", () => {
    // 2026-11-01T02:00Z is still 31 October in Milwaukee.
    expect(formatMonthLabel("2026-11-01T02:00:00+00:00")).toBe("October 2026");
  });
});
