# Publishing news on powertothepeoplemke.org

The **News & Updates** section at [powertothepeoplemke.org/news](https://powertothepeoplemke.org/news) is powered by WordPress. To publish a news post, you write it in the WordPress admin, hit **Publish**, and (after a site rebuild — see below) it appears on the site automatically.

You do **not** need to ask a developer to add a post.

---

## What you can publish

Use this section for:
- Campaign announcements, milestones, and statements
- Long-form updates from organizers
- Calls to action tied to a specific moment (a hearing, a vote, an event)

This section is for **internal posts written by the campaign**. Coverage from outside outlets (Journal Sentinel, Urban Milwaukee, etc.) is not yet supported here — talk to a developer if you want that added.

---

## How to publish a post

1. Log in to the WordPress admin.
2. In the left sidebar, click **Posts → Add New**.
3. Fill in:
   - **Title** — this becomes the headline on the site and the URL slug. Example: *"Common Council schedules first hearing on public power"* → the page will live at `/news/common-council-schedules-first-hearing-on-public-power`.
   - **Body** — the article itself. Use headings, lists, links, and bold/italic as you normally would. Images dropped in the body will render inline.
   - **Featured image** (right sidebar) — required for the post to look right. This is the big image shown on the news index card and at the top of the article page.
   - **Excerpt** (right sidebar; if hidden, enable it under "Screen Options") — a 1–2 sentence summary. This is what shows on the news index card and in Google search results / social shares. If you leave it blank, WordPress generates one from the first lines of the body, which usually looks awkward — fill it in.
4. Set the **Publish date** if you want it dated something other than today.
5. Hit **Publish**.

### URL structure

Each post lives at `/news/<slug>`, where `<slug>` is the URL-friendly version of the title. You can edit the slug in the **Permalink** field that appears above the title after the first save.

Keep slugs short and meaningful — e.g., `first-hearing-scheduled` is better than `common-council-schedules-first-hearing-on-public-power-for-milwaukee-residents`.

---

## Image guidance

- **Featured image**: 1200 × 630 pixels is ideal. This is also the image that shows when your post is shared on Facebook, LinkedIn, or in iMessage.
- File size: aim for under 300 KB. Compress with [TinyPNG](https://tinypng.com/) before uploading if needed.
- Always set the image's **Alt Text** in the media uploader — describe what's in the picture for accessibility and SEO.

---

## How long until it shows up on the site?

Publishing in WordPress **automatically triggers a site rebuild** via the **PTTP Deploy Trigger** plugin. The flow:

1. You hit **Publish** in WP.
2. The plugin waits ~30 seconds (to coalesce rapid edits), then fires a webhook to GitHub Actions.
3. GitHub Actions rebuilds the site (fetches all WP content, builds static HTML, deploys to Cloudflare).
4. Your post is live at `/news/<slug>` — **typically 2–3 minutes after you clicked Publish.**

The same auto-rebuild fires when you **edit a published post**, **unpublish** (move back to Draft), or **trash** one. So your changes show up on the live site automatically in all of those cases too.

### If something doesn't show up

If you published and waited 5+ minutes with no visible change:

1. Check the plugin's status page in WP admin → **Settings → Deploy Trigger** → look at "Last triggered". If it says `success` and HTTP `204`, the webhook fired — the issue is on the build/deploy side. Ping a developer.
2. If it says `error`, the message explains why (usually an expired or wrong GitHub token).
3. As an emergency fallback, anyone with GitHub repo access can go to **Actions → Deploy to Cloudflare → Run workflow** and trigger a rebuild manually.

### Plugin setup (one-time, done by a developer)

The Deploy Trigger plugin lives in `wordpress/pttp-deploy-trigger/` in the repo. Install steps (do this once):

1. Upload the plugin folder to WP and activate it.
2. Generate a GitHub fine-grained personal access token:
   - Scope: only `rcisneros138/power-to-the-people-mke`
   - Permissions: **Contents: Read and write** (the minimum for `repository_dispatch`)
   - Expiration: ≤ 1 year; add a calendar reminder to rotate
3. Store the token either:
   - **Preferred**: in `wp-config.php` as `define('PTTP_DEPLOY_TRIGGER_PAT', 'github_pat_...');` (kept out of the database and out of source control)
   - Alternative: paste it into Settings → Deploy Trigger and save
4. Set repository to `rcisneros138/power-to-the-people-mke` in the settings page and save.
5. Click "Send test ping" to verify — a new workflow run should appear at GitHub Actions within seconds and "Last triggered" should show success.

---

## Editing or unpublishing a post

- **Editing**: edit the post in WordPress and save. A rebuild is required for the change to appear on the site (same options as above).
- **Unpublishing**: switch the post's status to **Draft** or **Trash**, then trigger a rebuild. The post will disappear from `/news` and its `/news/<slug>` page will return a 404 on the next build.

---

## What gets indexed and shared

Each published post automatically gets:
- A dedicated URL at `/news/<slug>`
- A listing on `/news`
- An entry in the site's `sitemap.xml` (submitted to Google Search Console)
- Open Graph and Twitter card tags for nice social previews (using your featured image)
- `NewsArticle` structured data for Google News eligibility

No additional setup needed on your end.

---

## What if the news page is empty?

If `/news` shows *"No news articles available yet"*, it means either no posts are published in WordPress yet, or the WordPress GraphQL endpoint isn't reachable. The former is fixed by publishing a post. The latter is a developer issue — ping the dev team.

---

## Need help?

If something looks wrong on the published page (a broken image, a weird-looking quote, the post not appearing after a rebuild), check that the WordPress draft looks correct first, then reach out to a developer.
