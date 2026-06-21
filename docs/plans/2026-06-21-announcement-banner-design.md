# Design: Public Announcement Banner

**Date:** 2026-06-21
**Status:** Approved design — ready for implementation
**Author:** Power to the People MKE

## Summary

Add a site-wide announcement bar to the top of powertothepeoplemke.org that editors
control entirely from the WordPress admin. It carries one important message or event at a
time (e.g. "City Council vote Tuesday 6pm — pack the room!"), with an optional button,
an urgency color, optional start/end dates, and optional dismissal.

It follows the existing headless pattern: a WordPress custom post type exposed over
GraphQL, read at build time by the static Next.js site, with the PTTP Deploy Trigger
plugin rebuilding the site on publish.

## Goals

- Editors can post a banner without a developer, the same way they post News.
- One active banner shows at the top of every page.
- Time-sensitive banners can appear and disappear **on their own**, without waiting for an
  unrelated rebuild (handled in the browser — see Front-end behavior).
- Visitors can dismiss a banner (if allowed) and not be nagged, but a *new or edited*
  banner re-shows.
- A banner failure can never break the build or a page.

## Non-goals (YAGNI)

- No stacking / multiple simultaneous banners. One bar, one message.
- No per-page or per-section targeting. It's site-wide.
- No A/B testing, analytics, or click tracking in v1.
- No rich text in the bar — plain message + optional single button.

---

## Architecture overview

```
WordPress (admin.powertothepeoplemke.org)
  └─ CPT: pttp_announcement  ──exposed via WPGraphQL──┐
                                                       │  (build time)
PTTP Deploy Trigger plugin                             ▼
  └─ publish/update/unpublish ──repository_dispatch──► GitHub Actions build
                                                       │
Next.js static export                                  ▼
  └─ app/layout.tsx (async, server)
       └─ getActiveAnnouncement()  ── bakes data into HTML
            └─ <AnnouncementBar> (client)
                 └─ decides show/hide against the VISITOR's clock + localStorage
```

---

## Section 1 — WordPress side (data model)

New custom post type **`pttp_announcement`** ("Announcements"), registered in the existing
`wordpress/pttp-custom-types/pttp-custom-types.php` alongside Events/Partners/FAQs, and
exposed over GraphQL (`show_in_graphql: true`, `graphql_single_name: announcement`,
`graphql_plural_name: announcements`).

Fields:

| Field | Type | Purpose |
|---|---|---|
| **Title** | built-in post title | Internal label only — not shown publicly (e.g. "June council vote") |
| **Message** | text | The banner text visitors see |
| **Button label** | text (optional) | e.g. "RSVP". Omit for no button |
| **Button URL** | text (optional) | Destination for the button |
| **Urgency** | select: `info` / `event` / `urgent` | Drives the banner color |
| **Show from** | datetime (optional) | Banner hidden until this time |
| **Show until** | datetime (optional) | Banner auto-hides after this time |
| **Dismissible** | boolean | If on, visitors can close it and it stays closed for them |

The custom fields are implemented with the same field mechanism already used by the other
CPTs (ACF-style field group exposed to GraphQL as `announcementFields`). Datetimes are
stored/returned as ISO 8601 strings.

**Selection rule:** "the active banner" = the **most recently published** announcement.
The time window (`showFrom`/`showUntil`) is *not* used to pick the banner at build time;
it is evaluated in the browser (see Section 2). So the build always bakes in the newest
published announcement, and the browser decides whether it's currently within its window.

**Deploy Trigger wiring:** add `pttp_announcement` to
`wordpress/pttp-deploy-trigger/pttp-deploy-trigger.php`:
- the `$defaults` array in `pttp_deploy_trigger_get_post_types()`, and
- the `$all_post_types` arrays in the settings render + save handlers.

So publishing, editing, or unpublishing a banner rebuilds the site automatically, exactly
like other content.

---

## Section 2 — Front-end behavior

### Placement
`app/layout.tsx` becomes an async server component. It calls `getActiveAnnouncement()`
once at build time and renders `<AnnouncementBar announcement={...} />` as the first child
of `<body>`, above the skip-link and `<Header>`, so the bar sits at the very top of every
page.

### The static-build timing problem and fix
The site is a static export: HTML is frozen at build time. If "is this banner active?"
were decided only on the server, a banner with **Show until 6pm Tuesday** would remain in
the page until some later unrelated rebuild. To avoid that, the final show/hide decision
happens in the **browser**:

- The build bakes `message`, `buttonLabel`, `buttonUrl`, `urgency`, `showFrom`,
  `showUntil`, `dismissible`, and a stable `id` + `contentHash` into the page.
- `<AnnouncementBar>` is a **client component**. On mount it checks the current time:
  - before `showFrom` → render nothing
  - after `showUntil` → render nothing
  - within the window (or no bounds) → show
- Result: an expired banner **vanishes on its own** on the next page load; a scheduled one
  **appears on its own** when its time arrives — neither needs a rebuild.

### Dismissal
If `dismissible` is true, a × button stores `"${id}:${contentHash}"` in `localStorage`
under a fixed key (e.g. `pttp-dismissed-announcement`). On load, if the stored value
matches the current banner, it stays hidden. Keying on `id` + `contentHash` means:
- publishing a **new** announcement → new id → re-shows;
- **editing the message** of an existing one → new hash → re-shows.

### No-flash
The bar starts hidden (server renders it collapsed/`hidden`) and reveals after the
client-side time + dismissal check — a single tick. This prevents a dismissed or expired
banner from flashing in. Content remains in the HTML for crawlers/no-JS.

### Styling
Full-width bar, centered message, optional button, optional × on the right. Urgency maps
to the existing palette (see `globals.css` / Tailwind theme):
- `info` → navy background, cream text
- `event` → coral background, navy text
- `urgent` → strong red background, white text

Mobile: message wraps, button drops below the text. Respects `prefers-reduced-motion`
(no slide animation when reduced motion is requested).

---

## Section 3 — Error handling, edge cases, testing

### Error handling & graceful degradation
- `getActiveAnnouncement()` mirrors the existing fetchers in `app/lib/wordpress.ts`:
  try/catch, returns `null` on any GraphQL error or when `WORDPRESS_GRAPHQL_URL` is unset.
  `null` → the bar renders nothing. A banner failure cannot break the build or a page.
- No active/published announcement → renders nothing; no reserved empty space.
- Missing button label **or** URL → button omitted (both required to render it).
- Malformed/missing dates → treated as "no bound" (open-ended), so a dateless banner shows
  until it is unpublished.

### Edge cases
- `showFrom` after `showUntil` (editor typo) → never shows. Add an inline warning in the
  WP editor (or a `description` note on the fields) so editors catch it.
- Long message → bar grows, text wraps, no horizontal scroll.
- Dismiss persistence across edits → handled by the `id` + `contentHash` key.
- No-JS / pre-hydration → bar hidden until the client check runs. Acceptable for a
  non-critical announcement; message text still present in HTML.

### Testing — current reality
**The project has no test runner today** (no Jest/Vitest/Testing Library in
`package.json`, no test files, no `test` script). Two options:

1. **Recommended — minimal, logic-only tests.** Extract the pure decision into a
   standalone function, e.g.
   `shouldShow({ showFrom, showUntil, now, dismissedKey, currentKey }) → boolean`, in a
   plain `.ts` module with no React/DOM. Add **Vitest** (one dev dependency) and a
   `"test": "vitest"` script to cover just this function: before-window, after-window,
   in-window, no-bounds, dismissed-match, dismissed-stale (id/hash changed). This is the
   only genuinely risky logic; it needs no DOM harness and keeps setup tiny.
2. **Match the repo as-is.** Ship with TypeScript types + manual verification only,
   consistent with the current no-test codebase. Lower effort, no safety net on the time
   logic.

Default to option 1 unless we want to keep the repo test-free. Either way, do the manual
smoke test below.

**Manual smoke test (required regardless):**
1. Publish an announcement in WP → confirm a rebuild fires (Settings → Deploy Trigger →
   "Last triggered" = success) → confirm the bar appears on the live site.
2. Set **Show until** in the past → reload the live page → confirm the bar self-hides with
   no rebuild.
3. Set **Show from** a few minutes out → confirm it's hidden, then appears after that time
   on reload.
4. Toggle **Dismissible** on → click × → reload → confirm it stays closed; edit the message
   → reload → confirm it re-shows.

---

## File-by-file change list

| File | Change |
|---|---|
| `wordpress/pttp-custom-types/pttp-custom-types.php` | Register `pttp_announcement` CPT + `announcementFields` (GraphQL-exposed). Re-zip `pttp-custom-types.zip`. |
| `wordpress/pttp-deploy-trigger/pttp-deploy-trigger.php` | Add `pttp_announcement` to default tracked types + settings checkboxes. Re-zip `pttp-deploy-trigger.zip`. |
| `app/lib/wordpress.ts` | Add `WPAnnouncement` interface, `GET_ACTIVE_ANNOUNCEMENT` query, `getActiveAnnouncement()`. |
| `app/components/AnnouncementBar.tsx` | **New** client component: time gate + dismissal + urgency styling. |
| `app/components/index.ts` | Export `AnnouncementBar`. |
| `app/layout.tsx` | Make async; fetch announcement; render `<AnnouncementBar>` at top of `<body>`. |
| `app/lib/announcement.ts` *(if testing option 1)* | **New** pure `shouldShow()` helper for unit testing. |
| `package.json` *(if testing option 1)* | Add `vitest` dev dep + `"test": "vitest"` script. |
| `docs/content-editor-guide.md` + `wordpress/pttp-editor-guide/pttp-editor-guide.php` | Add a "Posting an announcement banner" section. |

## Open decisions for implementation kickoff

1. **Testing:** option 1 (add minimal Vitest for `shouldShow`) or option 2 (manual only)?
2. **`urgent` red:** introduce a new token in the Tailwind theme, or reuse an existing red?
3. **Field mechanism:** confirm the other CPTs use ACF (the GraphQL field groups
   `partnerFields`/`eventFields` suggest ACF) so the announcement fields are built the same
   way.
