# Content editor guide — powertothepeoplemke.org

This is the everyday guide for people who **update content** on the site from the WordPress admin. You don't need to touch code, run anything, or ask a developer for routine updates — you write in WordPress, hit **Publish/Update**, and the site rebuilds itself.

For the deeper how-to on writing news posts specifically (images, slugs, excerpts), see [`editing-news.md`](./editing-news.md). This guide covers the bigger picture: **how the site works, what triggers it to update, and what to do when something looks wrong.**

---

## What you can edit (and where it lives in the admin)

You can edit these parts of the site directly in WordPress — each has its **own section in the left sidebar**. Publish or update, and the site rebuilds itself (see below).

| Part of the site | Where to edit it in WordPress |
|---|---|
| The **announcement banner** across the top of every page | **Announcements** |
| The **News** section — the index at `/news` and each article | **Posts** |
| The **FAQ** — both the homepage FAQ section *and* the standalone FAQ page (`/faq`) | **FAQs** |
| The **Partners** — the `/partners` page *and* the logo strip on the homepage | **Partners** |

*Everything else — the homepage, the page layouts and designs, the navigation menu and footer, and the Calendar (which comes from Solidarity Tech, not WordPress) — is set in code. Ask a developer to change those.*

---

## The one thing to understand first: the site is *rebuilt*, not live

The public site is a **static site**. WordPress is not serving your pages to visitors directly — instead, a build process periodically reads everything out of WordPress and bakes it into fast, static files that get served from Cloudflare.

What this means in practice:

- **Your edits are not instant.** When you publish or update, nothing changes on the public site for a few minutes. That's normal — a rebuild has to run first.
- **The live site is a snapshot.** It reflects WordPress *as of the last build*. If you make a change but no rebuild runs, visitors keep seeing the old version.
- **Drafts and previews never reach the public site.** Only published content gets built in. (WordPress's own "Preview" button shows you the WordPress render, which is useful for checking your work, but it is not the live site.)

> **Mental model:** WordPress is the kitchen. The public site is the printed menu. Changing a recipe in the kitchen doesn't change the menu until someone reprints it. Publishing reprints the menu automatically — but it takes a few minutes.

---

## What triggers a rebuild (this is the important part)

A rebuild fires **automatically** when you make a **publish-related change** to one of the tracked content types. This is handled by the **PTTP Deploy Trigger** plugin.

### Content types that trigger a rebuild

Editing and publishing any of these will rebuild the site:

| In WordPress sidebar | What it feeds on the site |
|---|---|
| **Posts** | The News & Updates section (`/news`) |
| **Pages** | Standard content pages |
| **Events** | (Custom type — see the Calendar caveat below) |
| **Partners** | The Partners section |
| **FAQs** | The homepage FAQ section **and** the standalone FAQ page (`/faq`) |

> **Note — News is currently hidden.** Because there are no posts yet, the **News** link has been removed from the top menu and `/news` is hidden from search engines. This clears itself when you publish — but the menu link won't reappear on its own. If you're launching the News section, see [`editing-news.md`](./editing-news.md) and give a developer a heads-up to restore the menu link.

### What counts as a "publish-related change"

The rebuild fires when a published item's live state changes — specifically:

- **Publishing** a new post/page/partner/FAQ/event ✅
- **Updating** something that is already published ✅
- **Unpublishing** — moving a published item to **Draft** ✅
- **Trashing** a published item ✅

What does **not** trigger a rebuild:

- **Saving a draft** (it was never live, so the public site doesn't change) ❌
- **Editing a draft** that's still a draft ❌
- Autosaves and revisions ❌

In short: if the change affects what a visitor would see, it rebuilds. If you're just working privately on a draft, it doesn't.

### Rapid edits are batched

If you publish several things in quick succession (or save the same post a few times), the plugin **waits ~30 seconds and coalesces them into a single rebuild** rather than rebuilding once per click. So if you're doing a batch of updates, just finish them all — they'll go out together.

---

## How long until my change is live?

Roughly **2–4 minutes** end to end:

1. You hit **Publish / Update**.
2. The plugin waits ~30 seconds (to batch rapid edits), then pings the build system.
3. The build runs (reads all WordPress content → builds static files → deploys to Cloudflare). This is the bulk of the time, usually a couple of minutes.
4. Your change is live.

If you don't see it after ~5 minutes, see **Troubleshooting** below.

> Tip: a hard refresh (Cmd/Ctrl + Shift + R) clears your browser cache. Sometimes the build *did* finish and you're just looking at a cached copy in your own browser.

---

## ⚠️ The Calendar is the exception — it does NOT come from WordPress

The **Calendar / events page** on the public site is **not** powered by WordPress. It pulls events from **Solidarity Tech**, which is the source of truth for the public calendar.

This has two consequences:

- **Adding an "Event" in WordPress will not put it on the public calendar.** To change what appears on the calendar, edit the event in **Solidarity Tech**, not WordPress.
- **Calendar updates may behave differently from the rest of the site** — they don't depend on the WordPress publish-and-rebuild flow described above.

If you're trying to add or fix something on the calendar and editing WordPress isn't working, that's why. Go to Solidarity Tech. If you're unsure, ask a developer before spending time editing Events in WordPress.

---

## Things to consider before you publish

- **Fill in the excerpt and featured image** for news posts. Blank excerpts produce awkward auto-summaries on cards and in Google/social previews. (Details in [`editing-news.md`](./editing-news.md).)
- **Set alt text on every image** — it's used for accessibility and SEO, and it's quick to do in the media uploader.
- **Compress big images** before uploading (aim under ~300 KB; [TinyPNG](https://tinypng.com/) works well). Large images slow the page and bloat the build.
- **Check the slug/URL** before publishing news. The slug is derived from the title and is hard to change cleanly after the page has been shared or indexed. Keep it short and meaningful.
- **Use WordPress's Preview** to proof your content before publishing — it's the fastest way to catch a broken link or a weird quote without waiting on a rebuild.
- **Batch your edits.** If you have several updates, do them in one sitting so they go out in a single rebuild rather than triggering several.
- **Unpublishing removes content.** Moving a published item to Draft or Trash will make it disappear from the live site on the next rebuild (and its direct URL will 404). That's the correct way to take something down.

---

## Posting an announcement banner

The bar across the very top of every page (e.g. "City Council vote Tuesday 6pm — pack the room!") is controlled from **Announcements** in the WordPress sidebar.

**To post one:**
1. **Announcements → Add New.**
2. **Title** — an internal label only (e.g. "June council vote"). Visitors never see it.
3. Fill in the **Announcement** box:
   - **Message** — the text visitors see.
   - **Button label** + **Button URL** — optional. The button only appears if *both* are filled in. URLs can be external (`https://…`) or internal (`/calendar`).
   - **Urgency / color** — `Info` (navy), `Event` (coral), or `Urgent` (red).
   - **Show from / Show until** — optional. See timing note below.
   - **Dismissible** — let visitors close the bar.
4. **Publish.** A rebuild fires automatically (~2–4 min) and the bar appears.

**Only one banner shows at a time** — the most recently published one. To swap the message, publish a new announcement (or edit the current one). **To take the bar down, move the announcement to Draft or Trash** (this rebuilds and removes it).

### Scheduling (the useful part)

**Show from** and **Show until** are evaluated in the *visitor's browser*, so a banner can **appear and disappear on its own without a rebuild**:
- Set **Show until** to your event's end time → the bar vanishes by itself afterward.
- Set **Show from** to a future time → it stays hidden until then, appearing on the next page load after that time.
- Leave both blank → it shows until you unpublish it.

Times use the **visitor's local clock**. For a Milwaukee audience that's effectively Central time; don't rely on it for minute-precise cutoffs.

### Dismissible behavior

If you tick **Dismissible**, a visitor who closes the bar won't see it again — *until you change the message*, at which point it reappears for everyone. So editing the text is the way to re-surface an updated announcement to people who dismissed the old one.

---

## Troubleshooting

### My change isn't showing up after 5+ minutes

Work through these in order:

1. **Hard refresh your browser** (Cmd/Ctrl + Shift + R). You may be seeing a cached copy.
2. **Confirm the item is actually Published** in WordPress (not Draft, not Scheduled for a future date, not in Trash). A scheduled post won't trigger a rebuild until its publish time arrives.
3. **Check the plugin status page:** in WP admin, go to **Settings → Deploy Trigger**.
   - Look at **"Last triggered."**
     - **`success` / HTTP `204`** → the rebuild was requested successfully. The hold-up is on the build/deploy side (or it simply hasn't finished yet — give it another minute). If it's been much longer, ping a developer.
     - **`error`** → the message explains why. The most common cause is an expired or misconfigured GitHub token. A developer needs to fix this.
   - Look at **"Scheduled dispatch."** If it says a dispatch is *pending* (e.g. "fires in 18s"), the rebuild just hasn't been sent yet — wait for it.
4. **Force it manually:** on that same **Settings → Deploy Trigger** page, click **"Trigger rebuild now."** This re-runs the build immediately, skipping the 30-second wait. Use this if you're confident your content is published correctly but a rebuild didn't run.

### The `/news` page says "No news articles available yet"

Either no posts are published yet (publish one), **or** the site couldn't read from WordPress during the build (a developer issue — the WordPress/GraphQL endpoint may be unreachable). If you *do* have published posts and still see this, ping a developer.

### I published a batch but only some changes appeared

Because edits are batched into one rebuild, it's possible a later edit landed *after* the build already started reading content. Fix: make a trivial save on the affected item, or hit **"Trigger rebuild now"** on the Deploy Trigger page, to kick a fresh build.

### A calendar event is wrong / missing

The calendar comes from **Solidarity Tech**, not WordPress — see the Calendar section above. Editing WordPress won't fix it.

### Something looks broken on the page (broken image, weird quotes, layout off)

1. Check that the **WordPress draft/preview looks correct first** — if it's wrong in WordPress, it'll be wrong on the site.
2. If it looks fine in WordPress but broken on the live site, note the URL and what's wrong, and reach out to a developer.

### Emergency: force a rebuild without WordPress

If the plugin can't reach GitHub for some reason, anyone with repo access can trigger a build from **GitHub → Actions → "Deploy to Cloudflare" → Run workflow**. This is a developer/admin fallback, not part of the normal flow.

---

## Quick reference

| Situation | What happens |
|---|---|
| Publish a new post/page/partner/FAQ | Site rebuilds (~2–4 min), content goes live |
| Update an already-published item | Site rebuilds, change goes live |
| Move published item to Draft / Trash | Site rebuilds, item is removed from live site |
| Save a draft / edit a draft | **No rebuild** — nothing changes on the live site |
| Several edits within ~30s | Batched into **one** rebuild |
| Add/edit an Event for the calendar | Do it in **Solidarity Tech**, not WordPress |
| Post the top-of-site banner | **Announcements → Add New** → Publish (only the newest shows) |
| Take the banner down | Move the announcement to Draft / Trash |
| Nothing showing after 5 min | Check **Settings → Deploy Trigger → Last triggered**; "Trigger rebuild now" if needed |

---

## Who to contact

For anything beyond routine content updates — broken layouts, build errors, token/`error` statuses on the Deploy Trigger page, or calendar source questions — reach out to a developer. For routine publishing, you've got everything you need above.
