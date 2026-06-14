# PTTP Domain Migration — Dreamhost WP → Cloudflare (headless) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate `powertothepeoplemke.org` from the legacy Dreamhost-hosted WordPress site to the new Cloudflare Workers-hosted Next.js site, while preserving WordPress as a headless CMS backend reachable at `admin.powertothepeoplemke.org`.

**Architecture:** Move authoritative DNS from Dreamhost to Cloudflare. Keep the existing WordPress install in place on Dreamhost's servers but expose it under a new hostname (`admin.powertothepeoplemke.org`). Point the apex + `www` at the Cloudflare Worker that serves the static Next.js build. Next.js fetches content from the WP GraphQL endpoint at `https://admin.powertothepeoplemke.org/graphql`.

**Tech Stack:** Cloudflare DNS / Workers (static assets) / Wrangler v4, WordPress (hosted on Dreamhost) + WPGraphQL + PTTP Custom Types + PTTP Deploy Trigger plugins, GitHub Actions deploy, Next.js 15 static export.

**Confirmed inputs (last reviewed 2026-06-14):**
- Current production domain: `powertothepeoplemke.org` — live on Dreamhost WP.
- New WP admin hostname: `admin.powertothepeoplemke.org`.
- DNS today: registrar + DNS at Dreamhost. Cloudflare zone does **not** yet exist for this domain.
- Downtime tolerance: short maintenance window OK (≤ 1 hour visible disruption).
- **Deploy Trigger plugin installed and verified**: test ping returns HTTP 204; auto-rebuilds fire on post status changes.
- **SEO surfaces shipped**: `/robots.txt`, `/sitemap.xml`, `/opengraph-image` PNG, Organization + WebSite + NewsArticle JSON-LD all generated at build time. Verified locally; need final re-verification post-cutover (Task 5 Step 10).

**Out of scope:**
- Email DNS records (MX, SPF, DKIM, DMARC) are migrated as part of the nameserver swap, but new email infrastructure choices are explicitly out of scope. We copy existing email records as-is.
- Phase 7 calendar API custom domain (separate Worker, separate plan).

---

## Day-of go-live TL;DR

Run these in this order on cutover day. Each links to its detailed task below.

1. **Pre-flight checklist** complete (all items below ✓).
2. **Task 4** TTL verified at 300s for apex + www (DreamHost default; no manual action needed unless `dig` shows otherwise).
3. **Task 5 Step 1**: enable WP maintenance mode.
4. **Task 5 Step 2**: swap nameservers at Dreamhost → Cloudflare.
5. **Task 5 Steps 3–5**: wait for delegation, verify admin. resolves to Dreamhost.
6. **Task 5 Steps 6–7**: update WP `home`/`siteurl`; run `wp search-replace`.
7. **Task 5 Step 8**: update `WORDPRESS_GRAPHQL_URL` secret, run `gh workflow run deploy.yml`.
8. **Task 5 Steps 9–10**: verify CF custom domains attached; run full smoke test (SEO surfaces, content, console errors).
9. **Task 5 Step 11**: take WP out of maintenance.
10. **Task 6**: enable `www → apex` 301 redirect.
11. **Task 7**: lock down `/wp-admin/` via Cloudflare Access; disable GraphQL introspection.
12. **Task 8**: load Bulk Redirects from old WP URLs.
13. **Task 9**: re-verify Search Console, submit `/sitemap.xml`.
14. **Task 10**: re-confirm deploy webhook fires from admin., publish test post end-to-end.

Target wall-clock: 60–90 min from Step 3 to Step 11.

---

## Pre-flight: information to gather before Task 1

Before any DNS or WP changes, collect and write into a scratch file `migration-notes.md` (parent dir, not committed):

1. **Dreamhost account access** — login URL, panel access, SSH or SFTP creds for the WP install, WP admin login.
2. **Current DNS export** — log into Dreamhost panel → Domains → Manage Domains → DNS → copy every record (A, AAAA, CNAME, MX, TXT, SRV). Paste into `migration-notes.md` under "Current DNS records". This is the snapshot we restore from if rollback is needed.
3. **Current WP "site health" snapshot** — log into WP admin, screenshot Settings → General (WordPress Address + Site Address), Permalink structure, the WPGraphQL plugin version, and Tools → Site Health.
4. **Email MX records** — explicitly note whether email is delivered via Dreamhost mail, Google Workspace, or elsewhere. These records MUST be replicated verbatim in Cloudflare or mail will break at cutover.
5. **TTL audit** — confirm the apex + www A records report TTL 300s via `dig +nocmd powertothepeoplemke.org A +noall +answer`. DreamHost serves all records at 300s by default and doesn't allow editing TTL, so this should already be correct. If it's not 300, file a Dreamhost support ticket BEFORE proceeding.
6. **Cloudflare account** — confirm the chosen Cloudflare account, plan tier (Free is fine), and that the account has Workers + the `pttp` Worker already deployed (`wrangler.jsonc` confirms it).
7. **Search Console / Analytics access** — note whether Google Search Console, GA4, or any other property is registered for this domain. These need re-verification post-cutover. **Note**: sitemap is now generated at `/sitemap.xml` (via `app/sitemap.ts`) — submit this URL in Search Console post-cutover (Task 9).
8. **Deploy Trigger plugin status** — confirm in WP admin → Settings → Deploy Trigger:
   - Plugin is active
   - Repository field is `rcisneros138/power-to-the-people-mke`
   - PAT source is `wp-config constant` (preferred) or `database`
   - "Send test ping" returns success + HTTP 204 (do this within 24 h of cutover to confirm the PAT hasn't expired)
9. **GitHub repo + secrets**:
   - `WORDPRESS_GRAPHQL_URL` secret currently points at the old hostname; you'll change it in Task 5 Step 8 to `https://admin.powertothepeoplemke.org/graphql`
   - `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets exist and the last deploy workflow ran successfully
   - Confirm you can run `gh workflow run deploy.yml` from CLI (auth-wise) — this is the manual rebuild fallback during cutover
10. **Pre-cutover content freeze**: agree with editors that no posts/edits will be published during the maintenance window. Mention timing in the standing chapter channel.
11. **URL inventory for Task 8 (do this AHEAD of cutover, not during)** — build the list of old WP URLs that need 301 redirects to new Next.js URLs. Two sources:
    - The live WP sitemap at `https://powertothepeoplemke.org/wp-sitemap.xml` — fetch it and extract every `<loc>`.
    - Google Search Console → Pages report → "Indexed" pages and "Crawled - currently not indexed" pages.
    - De-duplicate, then in `migration-notes.md` build a table mapping `old URL → new Next.js URL → redirect type`. This becomes the source CSV for Task 8 Step 2. Doing it during the cutover window wastes the maintenance window.

These are written by hand, not by Claude. They are inputs the next tasks rely on.

---

## Task 1: Add `powertothepeoplemke.org` zone to Cloudflare (no nameserver swap yet)

**Files:**
- Modify: `migration-notes.md` (scratch, parent dir) — record CF-assigned nameservers.

**Step 1: Create the zone**

In Cloudflare dashboard → Add a site → enter `powertothepeoplemke.org` → choose Free plan. Cloudflare will scan existing DNS at Dreamhost and import what it can find.

**Step 2: Reconcile imported records against the DNS export from pre-flight**

Compare Cloudflare's auto-import against the Dreamhost snapshot in `migration-notes.md`. Add any missing records by hand. Critical categories to verify:
- `MX` records (mail delivery)
- `TXT` records for SPF (`v=spf1 ...`), DKIM (`*._domainkey`), DMARC (`_dmarc`)
- Any subdomains in active use (e.g., `webmail.`, `mail.`, `ftp.`)
- Any verification TXT records (Google Search Console `google-site-verification=...`)

Every record that exists at Dreamhost today must exist in Cloudflare before we swap nameservers, **except** the records we're intentionally changing (apex `A`/`AAAA` and `www`).

**Step 3: Proxy / DNS-only flags**

For now, set every record's proxy status to **DNS only** (gray cloud). We'll flip the apex + www to proxied (orange cloud) at cutover. Mail records (MX) and verification records must remain DNS-only forever.

**Step 4: Note the assigned Cloudflare nameservers**

Cloudflare assigns two NS hostnames (e.g., `xxx.ns.cloudflare.com`, `yyy.ns.cloudflare.com`). Copy them to `migration-notes.md`. We need them in Task 5.

**Step 5: Do NOT click "Check nameservers" yet**

Leave the zone in "Pending nameserver update" state. The actual nameserver swap happens later (Task 5) so that any mistakes in steps above can be fixed while Dreamhost is still authoritative.

**Verification:** Cloudflare dashboard shows the zone with status "Pending" and the imported + manually-added records all present. Run `dig +short NS powertothepeoplemke.org` from your terminal — it should still return Dreamhost's nameservers. That's correct at this stage.

---

## Task 2: Add `admin.powertothepeoplemke.org` as a fully-hosted domain on Dreamhost

**Files:**
- Modify: `migration-notes.md` — record the Dreamhost server hostname/IP the WP install is on.

**Critical ordering note:** Let's Encrypt validates by checking DNS. While Dreamhost is still authoritative for the zone (pre-Task 5), adding the subdomain in the Dreamhost panel auto-creates a DNS record for `admin.` in Dreamhost's zone — that's what makes cert issuance work. **Do steps 1–2 fully and verify the cert is live BEFORE staging anything in Cloudflare** (Step 3). Otherwise you risk attempting validation against a DNS state that doesn't exist yet.

**Step 1: Add the subdomain in Dreamhost**

Dreamhost panel → Domains → Manage Domains → Add Hosting to a Domain / Subdomain → enter `admin.powertothepeoplemke.org`. Choose "Fully Hosted". Point it at the **same web directory** as the existing WP install (so it serves the existing WordPress files, not a new install).

This action also adds an `admin` A record to Dreamhost's currently-authoritative zone, pointing at the same Dreamhost server. That's required for the next step.

**Step 2: Request a Let's Encrypt certificate for `admin.` (and verify)**

In Dreamhost panel → Manage Domains → SSL/TLS Certificates → add a free Let's Encrypt cert for `admin.powertothepeoplemke.org`. Wait for issuance (usually ≤ 15 min; Dreamhost's panel will show "Certificate active" when done).

Verify from your terminal:
```bash
# DNS resolves to Dreamhost (via Dreamhost's still-authoritative nameservers)
dig +short admin.powertothepeoplemke.org

# WP serves on the new hostname with a valid Let's Encrypt cert
curl -I https://admin.powertothepeoplemke.org/
```
Expected: a 200 or 301 from WordPress, TLS handshake succeeds, no cert-name-mismatch error. **If the cert hasn't issued yet, do not proceed — the cutover will fail.**

**Step 3: Stage the DNS record in Cloudflare (post-cert)**

Only after Step 2's verification succeeds, add the matching CNAME (or A record) inside the Cloudflare zone from Task 1:
- Name: `admin`
- Target: the Dreamhost-assigned hostname (e.g., `<account>.dreamhost.com`) or the IP of the WP server. Dreamhost's panel shows this on the domain detail page — use whatever matches the record Dreamhost just created for itself.
- Proxy: **DNS only** (gray cloud) — Cloudflare must not terminate TLS; the Let's Encrypt cert lives on Dreamhost.
- TTL: 5 min (Cloudflare default; immaterial since DNS-only).

This record is staged but invisible to the public until Task 5's nameserver swap.

**Step 4: Verify the staged Cloudflare record**

Query Cloudflare directly to make sure the record will work the moment Cloudflare becomes authoritative:
```bash
dig +short admin.powertothepeoplemke.org @<cloudflare-ns-1>
```
Where `<cloudflare-ns-1>` is one of the nameservers from Task 1. Expected: it returns the same Dreamhost hostname / IP. If it returns nothing, fix the record before continuing.

**Verification:** The Let's Encrypt cert for `admin.` is issued and live (curl returns 200/301 with valid TLS). The matching CNAME exists in the CF zone and resolves correctly against CF's nameservers directly.

---

## Task 3: Pre-stage Next.js + Cloudflare Worker for the apex + www

**Files:**
- Modify: `pttp/wrangler.jsonc` — add a `routes` block for the custom domain (do not deploy yet).
- Modify: `pttp/next.config.ts` — add `images.remotePatterns` for the new admin hostname (only matters if we ever switch off static export with `<Image>`; harmless to add now).

**Step 1: Update `wrangler.jsonc` to declare the custom domain**

Add a `routes` array. The "custom_domain" form binds a Cloudflare-managed hostname to the Worker once DNS resolves:

```jsonc
{
  "name": "pttp",
  "compatibility_date": "2026-01-17",
  "assets": {
    "directory": "./out",
    "html_handling": "drop-trailing-slash",
    "not_found_handling": "404-page"
  },
  "routes": [
    { "pattern": "powertothepeoplemke.org", "custom_domain": true },
    { "pattern": "www.powertothepeoplemke.org", "custom_domain": true }
  ]
}
```

**Step 2: Do NOT deploy yet**

The Worker can't bind these custom domains until DNS is on Cloudflare. We commit the config now, but the next deploy will fail the route binding step until Task 5 completes. That's expected.

**Step 3: Commit**

```bash
cd /Users/rc/Projects/pttp/pttp
git add wrangler.jsonc
git commit -m "chore(deploy): declare apex + www custom domains for Worker"
```

**Verification:** Local `pnpm exec wrangler deploy --dry-run` succeeds (no actual deploy). The routes show up in the dry-run output.

**Alternative: attach via Cloudflare dashboard (no wrangler.jsonc change)**

Instead of declaring routes in `wrangler.jsonc`, you can attach the apex + www at the Cloudflare dashboard → Workers & Pages → `pttp` → Settings → Domains & Routes → Add custom domain. Cloudflare manages the binding metadata server-side, so it survives Worker re-deploys without needing config to be perfect.

Either approach works for this migration; pick one (mixing both can create binding conflicts). The `wrangler.jsonc` approach has the advantage of being version-controlled; the dashboard approach is faster for one-off bindings and is what `2026-05-02-pttp-launch-readiness.md` Task 6 noted as cleaner for static-asset Workers.

---

## Task 4: Verify DNS TTL on Dreamhost (no action expected)

**This is a verify-only step.** DreamHost's nameservers serve all records at a fixed **300-second (5-minute) TTL** by default, and they do not expose TTL editing in their panel. Records are already at the lowest practical value — nothing to manually lower 24–48 h ahead.

**Step 1: Confirm the apex A record is actually at 300s**

From any machine:
```bash
dig +nocmd powertothepeoplemke.org A +noall +answer
dig +nocmd www.powertothepeoplemke.org +noall +answer
```

The number between the hostname and `IN` is the TTL in seconds. Expected: `300` for both.

If the TTL is anything other than 300 (e.g., a custom value carried over from a previous DNS provider), open a Dreamhost support ticket BEFORE cutover and ask them to reset it. This is rare but possible.

**Step 2: Note that NS-record TTL is separate**

The `.org` TLD's TTL on the **NS records** (which tells resolvers "the nameservers for powertothepeoplemke.org are ns1.dreamhost.com, ...") is controlled by the TLD, not by DreamHost — typically 1–2 days. This is what introduces the small tail of cached resolvers during a nameserver swap. There's no way to lower this ahead of time. The compensating factor is that major recursive resolvers (Cloudflare 1.1.1.1, Google 8.8.8.8, Quad9) usually pick up nameserver changes within minutes of the registrar publishing them.

**Verification:** Both `dig` queries return `TTL = 300`. If true, no further pre-cutover action — proceed to Task 5 when ready.

---

## Task 5: Cutover window — swap nameservers and verify

**Pre-cutover checklist (run through this before starting):**
- [ ] All records from Task 1 reconciled (especially MX + TXT).
- [ ] `admin.` CNAME staged in Cloudflare (Task 2).
- [ ] Let's Encrypt cert for `admin.` issued and valid (Task 2).
- [ ] `wrangler.jsonc` updated and committed (Task 3).
- [ ] Apex + www TTL confirmed at 300s via `dig` (Task 4 — already the DreamHost default, just verify).
- [ ] WP backup taken (Dreamhost backup + database export via phpMyAdmin or WP-CLI `wp db export`).
- [ ] Maintenance window communicated to the chapter.

**Step 1: Enable maintenance mode on WordPress**

Easiest path: install the **WP Maintenance Mode** plugin (or equivalent), activate, set a short "we're updating, back in an hour" message. This prevents users from making content edits during cutover — the content is about to be addressed by a different hostname and any edits mid-flight risk being lost.

**Step 2: Swap nameservers at Dreamhost (registrar side)**

Dreamhost panel → Domains → Registrations → manage `powertothepeoplemke.org` → set custom nameservers → enter the two Cloudflare nameservers from Task 1. Save.

**Step 3: Wait for Cloudflare to detect the change**

Cloudflare sends a confirmation email when it sees the nameserver update and the zone goes "Active". Typical: 5–60 minutes. While waiting, **do not** touch DNS records — the zone is in a transitional state.

**Step 4: Verify nameserver delegation has propagated**

Run from your terminal until the answer is Cloudflare's nameservers, not Dreamhost's:
```bash
dig +short NS powertothepeoplemke.org
```
Expected (eventually): the two `*.ns.cloudflare.com` hostnames from Task 1. If it still shows Dreamhost, wait and retry.

**Step 5: Verify `admin.` resolves to Dreamhost and serves WP**

```bash
dig +short admin.powertothepeoplemke.org
curl -I https://admin.powertothepeoplemke.org/
```
Expected: a 200 or 301 response from WordPress, and `Server: Apache` (Dreamhost) in the headers. If the TLS handshake fails, the Let's Encrypt cert from Task 2 was not issued correctly — go fix that before proceeding.

**Step 6: Update WP siteurl + home**

There are two equivalent ways. Pick one.

**Option A — WP admin UI:**

Visit `https://admin.powertothepeoplemke.org/wp-admin/` → Settings → General → set:
- WordPress Address (URL): `https://admin.powertothepeoplemke.org`
- Site Address (URL): `https://admin.powertothepeoplemke.org`

Save.

**Option B — WP-CLI (faster, less error-prone):**

```bash
# SSH to Dreamhost first.
wp option update home 'https://admin.powertothepeoplemke.org'
wp option update siteurl 'https://admin.powertothepeoplemke.org'
```

**Step 7: Rewrite absolute URLs stored in post content**

Always run `--dry-run` first, review the count, then re-run for real. This is the standard WP-CLI safety pattern.

```bash
# Still on Dreamhost via SSH.

# 1. DRY RUN — counts changes, modifies nothing.
wp search-replace 'https://powertothepeoplemke.org' 'https://admin.powertothepeoplemke.org' \
  --skip-columns=guid --report-changed-only --precise --dry-run

# 2. Review the output — the row counts per table should look plausible
#    (e.g., wp_posts will have hits in post_content; wp_options will have a few; etc.)
#    If a table you don't recognize shows millions of changes, stop and investigate.

# 3. Run for real (remove --dry-run):
wp search-replace 'https://powertothepeoplemke.org' 'https://admin.powertothepeoplemke.org' \
  --skip-columns=guid --report-changed-only --precise
```

Flag notes:
- **`--skip-columns=guid`** — critical. GUIDs are permanent identifiers; changing them breaks RSS feed deduplication and can cause subscribers' readers to re-show every post as new.
- **`--precise`** — forces PHP-based replacement instead of SQL. Slower, but correctly handles serialized data (option arrays, transients, widget settings). Recommended for any host migration.
- **`--report-changed-only`** — keeps output to just the tables that actually changed. Easier to scan.

If the old domain is also referenced without a scheme (`//powertothepeoplemke.org`), run a second pass for that pattern. Same dry-run-first discipline.

**Step 8: Re-deploy the Next.js site against the new admin GraphQL endpoint**

Update the `WORDPRESS_GRAPHQL_URL` secret in GitHub → Settings → Secrets → Actions:
- New value: `https://admin.powertothepeoplemke.org/graphql`

Then trigger a redeploy:
```bash
gh workflow run deploy.yml --repo <org>/<repo>
```

Watch the run — confirm it completes and the Worker upload succeeds. Now that DNS is on Cloudflare, the `custom_domain` route bindings from Task 3 will also succeed.

**Step 9: Verify Cloudflare attached the apex + www custom domains**

Cloudflare dashboard → Workers & Pages → `pttp` → Settings → Domains & Routes. Expected: `powertothepeoplemke.org` and `www.powertothepeoplemke.org` listed and TLS provisioned. Cloudflare automatically issues an edge certificate for both.

**Step 10: Smoke-test the public site**

**Edge + content checks:**
```bash
# Core pages — expect HTTP/2 200, Server: cloudflare on every one
for path in / /about /calendar /get-involved /partners /resources /news; do
  echo "=== $path ==="
  curl -sI "https://powertothepeoplemke.org$path" | head -5
done

# Both apex + www reachable
curl -I https://powertothepeoplemke.org/
curl -I https://www.powertothepeoplemke.org/   # 200 here; www→apex 301 not configured until Task 6
```

**SEO surface checks (new — these did not exist when this plan was first written):**
```bash
# robots.txt — should reference sitemap and allow all
curl -s https://powertothepeoplemke.org/robots.txt
# Expect: User-Agent: *, Allow: /, Sitemap: https://powertothepeoplemke.org/sitemap.xml

# sitemap.xml — should list all 7 static routes plus any WP news post slugs
curl -s https://powertothepeoplemke.org/sitemap.xml | head -40
# Expect: <urlset> with /, /about, /calendar, /get-involved, /news, /partners, /resources

# Open Graph image — should be a 1200x630 PNG
curl -sI https://powertothepeoplemke.org/opengraph-image | head -5
# Expect: HTTP 200, content-type: image/png

# Per-page canonical + OG tags + JSON-LD
curl -s https://powertothepeoplemke.org/about | \
  grep -oE 'rel="canonical"[^>]*|property="og:[a-z:]+"[^>]*|application/ld\+json'
# Expect: canonical to /about, og:url/title/description/image, multiple ld+json blocks
```

**Browser walkthrough** — open `https://powertothepeoplemke.org/` and click through every nav link. Confirm:
- Homepage renders, hero + three story tiles animate on scroll (rising-line chart, handshake, outage clocks)
- Partners + FAQ content loads from WP (visible in `/get-involved` and homepage)
- News page renders (either posts list or "No news articles yet" empty state)
- Calendar page loads the Solidarity Tech iframe
- No console errors about CORS or mixed content
- Footer + Header render correctly
- Favicon loads (`/icon.svg`)

**Sharing preview (do this once on a phone or via debugger):**
- Open [opengraph.xyz](https://www.opengraph.xyz/) or Facebook's [Sharing Debugger](https://developers.facebook.com/tools/debug/) → paste `https://powertothepeoplemke.org/` → confirm the OG image preview renders (1200×630 peach background with the campaign typography). If Facebook caches the old preview, click "Scrape Again".
- Repeat for `/about` and `/news` to confirm per-page OG inheritance works.

**Structured data validation:**
- Paste `https://powertothepeoplemke.org/` into [search.google.com/test/rich-results](https://search.google.com/test/rich-results) → confirm Organization + WebSite schemas detected with no errors.

**Step 11: Take WP out of maintenance mode**

Disable the WP Maintenance Mode plugin (or whichever method was used in step 1).

**Verification:** Both `powertothepeoplemke.org` and `www.powertothepeoplemke.org` serve the Next.js site through Cloudflare. `admin.powertothepeoplemke.org/wp-admin/` serves WordPress through Dreamhost. The Next.js site successfully fetches content from `https://admin.powertothepeoplemke.org/graphql`.

---

## Task 6: Redirect `www` → apex at the edge

Best practice is a single canonical hostname.

**Step 1: Create a Cloudflare Bulk Redirect**

Cloudflare dashboard → Rules → Redirect Rules → "Create rule":
- When: hostname equals `www.powertothepeoplemke.org`
- Then: dynamic redirect → `concat("https://powertothepeoplemke.org", http.request.uri.path)` with query string preserved.
- Status: 301.

**Step 2: Verify**

```bash
curl -I https://www.powertothepeoplemke.org/about
```
Expected: `HTTP/2 301`, `Location: https://powertothepeoplemke.org/about`.

**Verification:** Any `www.` URL 301s to apex with path + query preserved.

---

## Task 7: Restrict access to `admin.` (security hardening)

The headless WP install should not be casually discoverable. At minimum, harden `wp-admin/` and `wp-login.php`.

**Step 1: Restrict by Cloudflare Access (recommended) or IP allowlist**

Two options — pick one.

**Option A — Cloudflare Access (Zero Trust, free for ≤ 50 users):**

Cloudflare Zero Trust dashboard → Access → Applications → Add an application → Self-hosted. Configure with **both** entry points (either as one app with multiple paths, or two separate apps with the same policy):
- `admin.powertothepeoplemke.org/wp-admin*`
- `admin.powertothepeoplemke.org/wp-login.php`

**Both paths must be protected.** `wp-login.php` is a direct entry point that bypasses `/wp-admin/` rules if left open — anyone hitting `https://admin.powertothepeoplemke.org/wp-login.php` directly would still get the login form.

- Authentication method: enable **One-time PIN** (email codes) so editors authenticate with their email — no SSO setup required.
- Policy: allow specific emails (the chapter's WP editors). Add a service-account exception only if you have a CI job that needs to hit `wp-admin` paths (we don't today).

This forces a login at the Cloudflare edge before WP is ever reached. WP admin requests now route through Cloudflare. **This requires switching `admin.` to proxied (orange cloud) in DNS.** Dreamhost will see Cloudflare's IPs.

**Do NOT put `admin-ajax.php` behind Access.** If any plugin/theme uses AJAX requests from the public site (rare for headless WP, but possible), Access will block them. Leave `admin-ajax.php` public and rely on rate-limiting / bot protection there. If you're sure the headless setup doesn't use it publicly, you can include it.

**Option B — `.htaccess` IP allowlist (simpler, no CF proxy needed):**

In Dreamhost, edit `/wp-admin/.htaccess` AND add equivalent rules for `/wp-login.php` to allow only known IPs. Brittle if editors are mobile or work from coffee shops.

**Step 2: Confirm GraphQL public introspection is disabled**

`/graphql` must remain publicly reachable — Next.js needs it. But public schema introspection should be off so the schema isn't trivially discoverable.

In WP admin → GraphQL → Settings → confirm **"Enable Public Introspection" is NOT checked.** Current WPGraphQL versions disable this by default, so the box should already be unchecked. The only reason to verify: someone may have enabled it for development.

Authenticated GraphQL requests still work for normal queries; only schema introspection by unauthenticated clients is blocked.

**Step 3: Confirm GraphQL still works from a public client**

```bash
curl -X POST https://admin.powertothepeoplemke.org/graphql \
  -H 'content-type: application/json' \
  -d '{"query":"{ partners(first: 1) { nodes { title } } }"}'
```
Expected: JSON response with one partner. The Next.js GitHub Actions build does exactly this kind of request.

**Step 4: Confirm the Deploy Trigger webhook still fires through Cloudflare Access**

Cloudflare Access protects inbound traffic to `/wp-admin/`. The Deploy Trigger plugin makes **outbound** POSTs to `api.github.com` — Access does not interfere with outbound. But verify after enabling Access:

1. WP admin (sign in through CF Access) → Settings → Deploy Trigger → click **Send test ping**.
2. Confirm "Last triggered" shows `success` + HTTP 204 and a new workflow run appears at github.com/rcisneros138/power-to-the-people-mke/actions.

If Access is configured to block service tokens / API access too aggressively, the WP admin login itself may not work for non-Access-aware browsers. Test from a fresh browser session with the editor's email.

**Verification:** `wp-admin` requires Cloudflare Access (or IP allow), `/graphql` is reachable, introspection is disabled, Deploy Trigger test ping still returns 204.

---

## Task 8: Redirects from old WP URLs to new Next.js URLs

The old WP site had pages at specific paths. Anything indexed by Google must redirect cleanly to the equivalent Next.js page.

**Step 1: Inventory old URLs**

Two sources:
- WP's existing sitemap (`https://admin.powertothepeoplemke.org/wp-sitemap.xml` — visit it, copy URLs).
- Google Search Console (Coverage report) — any URL Google has indexed for `powertothepeoplemke.org`.

Write the list into `migration-notes.md` under "URLs to redirect", along with the Next.js equivalent. Common patterns:

| Old WP URL                                      | New Next.js URL              |
| ----------------------------------------------- | ---------------------------- |
| `/about-us/` or `/about/`                       | `/about`                     |
| `/events/`                                      | `/events`                    |
| `/get-involved/` or `/volunteer/`               | `/get-involved`              |
| `/category/news/<slug>/` or `/<year>/<slug>/`   | `/news/<slug>`               |
| `/partners/`                                    | `/partners`                  |
| `/resources/`                                   | `/resources`                 |

(Adjust based on the actual sitemap.)

**Step 2: Implement via Cloudflare Bulk Redirects**

Cloudflare dashboard → Rules → Bulk Redirects → create a list → upload a CSV. Cloudflare's current CSV format is **7 columns** in this exact order:

```csv
SOURCE_URL,TARGET_URL,STATUS_CODE,PRESERVE_QUERY_STRING,INCLUDE_SUBDOMAINS,SUBPATH_MATCHING,PRESERVE_PATH_SUFFIX
https://powertothepeoplemke.org/about-us/,https://powertothepeoplemke.org/about,301,TRUE,FALSE,FALSE,FALSE
https://powertothepeoplemke.org/volunteer/,https://powertothepeoplemke.org/get-involved,301,TRUE,FALSE,FALSE,FALSE
https://powertothepeoplemke.org/events/,https://powertothepeoplemke.org/calendar,301,TRUE,FALSE,FALSE,FALSE
```

Column reference:
- **SOURCE_URL / TARGET_URL** — required. Full URLs with scheme.
- **STATUS_CODE** — default 301 (permanent). Use 302 only if you might revert.
- **PRESERVE_QUERY_STRING** — `TRUE` for almost every redirect; preserves `?utm_*` and other query strings.
- **INCLUDE_SUBDOMAINS** — `FALSE` for these rules (they're already apex-specific).
- **SUBPATH_MATCHING** — `FALSE` unless you want `/category/news/*` style wildcards (would also need `PRESERVE_PATH_SUFFIX=TRUE`).
- **PRESERVE_PATH_SUFFIX** — only matters when `SUBPATH_MATCHING=TRUE`.

For wildcard patterns (e.g., redirect every `/<year>/<slug>/` to `/news/<slug>` if old WP used year-based permalinks), set both `SUBPATH_MATCHING=TRUE` and `PRESERVE_PATH_SUFFIX=TRUE` on those rows.

Boolean values must be uppercase `TRUE`/`FALSE` or lowercase `true`/`false` — not `1`/`0`. Blank value (empty between commas) means `FALSE`.

Attach the list to a Bulk Redirect rule applied to the zone.

**Step 3: Verify each redirect**

```bash
curl -I https://powertothepeoplemke.org/about-us/
```
Expected: `HTTP/2 301`, `Location: https://powertothepeoplemke.org/about`.

Repeat for every entry in the list.

**Verification:** Every URL from Search Console's index page either resolves to a live Next.js page (200) or 301-redirects to one.

---

## Task 9: Search Console + analytics re-verification

**Step 1: Re-verify Google Search Console**

Search Console may have used a TXT record for verification — that record was copied over in Task 1, so verification should still hold. Confirm by visiting Search Console → Settings → Ownership verification.

If the property was verified via a meta tag on the old WP homepage, the new Next.js homepage does not contain that tag and verification will fail. In that case, re-verify via DNS TXT record (preferred) added in Cloudflare.

**Step 2: Submit the new sitemap**

The Next.js build now generates `/sitemap.xml` automatically (via `app/sitemap.ts`). After cutover:

1. Open Search Console → property `powertothepeoplemke.org` → **Sitemaps** in the left nav.
2. Enter `sitemap.xml` in the "Add a new sitemap" field → Submit.
3. Within a few hours, status should flip to "Success" with the count of discovered URLs (≥ 7 static routes + any WP news posts).
4. Remove the old WP sitemap from Search Console: same page → click the existing `wp-sitemap.xml` entry → "Remove sitemap". Otherwise Google keeps fetching a 404 and surfaces it as a crawl error.
5. Also submit to Bing Webmaster Tools (bing.com/webmasters) → Sitemaps → enter the same URL.

**Step 3: Validate structured data**

Each page now ships JSON-LD (Organization + WebSite from `app/layout.tsx`; NewsArticle on each `/news/[slug]`). Validate:

1. [search.google.com/test/rich-results](https://search.google.com/test/rich-results) → paste `https://powertothepeoplemke.org/` → expect Organization + WebSite detected, no errors.
2. Repeat with one news article URL once posts exist → expect NewsArticle detected.

**Step 4: Analytics**

Depends on the Phase 6 decision (Cloudflare Web Analytics vs Plausible vs GA4). Whichever it is, point it at the apex domain post-cutover. If GA4 was on the old WP site, the property's tracking ID needs to be added to the Next.js `app/layout.tsx` head, or you'll lose continuity.

**Verification:** Search Console ownership confirmed, new sitemap submitted + indexed, old sitemap removed, structured data validates with no errors, analytics events arriving from the new site.

---

## Task 10: End-to-end content flow verification + documentation

The migration isn't truly done until an editor can publish a post from the new admin URL and watch it appear on the live site without developer intervention.

**Step 1: Publish a test post end-to-end**

From a fresh browser, log into `https://admin.powertothepeoplemke.org/wp-admin/` (through Cloudflare Access if Task 7 Option A was chosen):

1. Posts → Add New → title: `Cutover test — DELETE`, body: a sentence, featured image: any.
2. Click **Publish**.
3. Within 30 seconds, watch [github.com/rcisneros138/power-to-the-people-mke/actions](https://github.com/rcisneros138/power-to-the-people-mke/actions) for a new workflow run kicked off by `repository_dispatch`.
4. After ~2 min the build completes. Refresh `https://powertothepeoplemke.org/news` — the test post should appear.
5. Click into `/news/cutover-test-delete/` and confirm the body, image, and JSON-LD all render.
6. Trash the post in WP → another rebuild fires → ~2 min later the post is gone from `/news` and `/news/cutover-test-delete/` returns 404.

If any step fails: check Settings → Deploy Trigger → "Last triggered" for the error message. Most common cause is the PAT in `wp-config.php` not surviving a host migration (unlikely here, but check).

**Step 2: Confirm the WP site URL change didn't break the deploy webhook**

Settings → Deploy Trigger → confirm:
- "PAT source" is unchanged from pre-cutover
- "Last triggered" shows the test publish from Step 1
- The dispatch payload's `site_url` field (visible in the GitHub workflow run details under "Triggered via repository_dispatch") now shows `https://admin.powertothepeoplemke.org` — cosmetic confirmation that `home_url()` is reading the post-cutover value.

**Step 3: Update `task_plan.md`**

Open `/Users/rc/Projects/pttp/task_plan.md` and find the unchecked launch checkboxes (current wording uses a `?` suffix on the domain one). Mark these completed and add an SEO line if it doesn't exist:
- `[x] Custom domain (powertothepeoplemke.org) configured in Cloudflare` (drop the `?` from the current wording)
- `[x] Verify production GraphQL endpoint and repository_dispatch webhook from WP`
- `[x] Final smoke test against deployed URL`
- `[x] SEO surfaces verified (sitemap, robots, OG image, JSON-LD) on production hostname` ← may need to be added; the SEO surfaces section didn't exist in task_plan.md when this plan was first written.
- `[x] Editor onboarding doc published (pttp/docs/editing-news.md)` ← may need to be added.

Add a new section under "Decisions Made":
> Domain migration completed 2026-MM-DD. `powertothepeoplemke.org` apex/www served by Cloudflare Worker (Next.js static). WordPress headless backend at `admin.powertothepeoplemke.org`, access-restricted via Cloudflare Access. DNS authoritative on Cloudflare. Auto-rebuild on WP publish via PTTP Deploy Trigger plugin → `repository_dispatch: wordpress_update` → GitHub Actions deploy. End-to-end editor-to-live latency: ~3 min.

**Step 4: Point editors at the docs**

Share `pttp/docs/editing-news.md` with anyone who has WP author/editor access. The doc covers publishing flow, image guidance, auto-rebuild timing, and how to troubleshoot when a post doesn't appear.

**Step 5: Save an auto-memory**

Save a `project` memory recording the post-migration topology (apex → CF Worker, admin → Dreamhost WP, DNS on Cloudflare, Deploy Trigger plugin → GitHub repository_dispatch) so future sessions don't have to rediscover it.

**Step 6: Commit any code changes (none expected at this step)**

If Tasks 1–9 left any uncommitted code, commit it now. The only code changes from this plan are:
- `pttp/wrangler.jsonc` (Task 3 — already committed pre-cutover)
- The `WORDPRESS_GRAPHQL_URL` secret update happens in GitHub UI, not in the repo

**Verification:** Test post published, rebuilt, visible at `/news/cutover-test-delete/`, then trashed and gone. `task_plan.md` updated, memory saved, editor docs distributed.

---

## Rollback plan

Rollback complexity grows with each step of Task 5. Choose based on where you bailed:

**Bail before Task 5 Step 6 (WP siteurl update)** — easy rollback:
- In Cloudflare DNS, point the apex `A` record back to the Dreamhost IP.
- Within 5 minutes the public site is back on Dreamhost WP. Nameservers stay on Cloudflare.

**Bail after Task 5 Step 6 (WP siteurl was updated)** — extra step:
- SSH to Dreamhost and undo via WP-CLI:
  ```bash
  wp option update home 'https://powertothepeoplemke.org'
  wp option update siteurl 'https://powertothepeoplemke.org'
  wp search-replace 'https://admin.powertothepeoplemke.org' 'https://powertothepeoplemke.org' \
    --skip-columns=guid --report-changed-only
  ```
- Point apex DNS in Cloudflare back at the Dreamhost IP.

**Bail after Task 5 Step 8 (GitHub secret was flipped to admin. URL)** — also revert the secret:
- GitHub → repo Settings → Secrets and variables → Actions → edit `WORDPRESS_GRAPHQL_URL` back to `https://powertothepeoplemke.org/graphql`.
- Re-run the deploy workflow so the rolled-back state matches.

**Disable the Deploy Trigger plugin if rollback is in progress** — to prevent editors' publishes from firing rebuilds against a half-migrated state:
- WP admin → Plugins → Deactivate "PTTP Deploy Trigger".
- Re-activate after rollback is verified clean.

**Full nameserver rollback** (switch nameservers back to Dreamhost) is a **last resort** — it carries the same 24–48 h propagation delay as the original swap and is rarely the right move. Prefer fixing forward via CF DNS edits.

---

## Open questions / explicit assumptions

1. **Email DNS records** — this plan assumes mail is delivered through Dreamhost and the MX/SPF/DKIM/DMARC records will be copied as-is in Task 1. If mail is handled by Google Workspace or a third party, that's still fine — copy whatever exists. If we discover during Task 1 that there are no mail records at all, confirm whether mail is in use before deciding what to do.
2. **WPGraphQL public availability** — the plan assumes `/graphql` must remain publicly reachable for the Next.js build to query it during deploys. If we want to lock it down further (e.g., require an auth header), we'd need to add an `Authorization` header to `app/lib/wordpress.ts` and a corresponding secret to GitHub Actions. Out of scope here.
3. **Existing WP plugins/themes that hard-code the domain** — the `wp search-replace` in Task 5 handles content + options, but PHP files in themes/plugins that hard-code `https://powertothepeoplemke.org/...` (uncommon but possible) won't be touched. If found, edit manually.
4. **Calendar API custom domain** — the `calendar-api/` Worker exists in the repo (`/Users/rc/Projects/pttp/pttp/calendar-api/`) as a separate Worker with its own `wrangler.jsonc`. It may eventually want `calendar.powertothepeoplemke.org` or `api.powertothepeoplemke.org`. Not addressed here, and not required for the cutover. **Once DNS is on Cloudflare (post-Task 5), attaching a subdomain to the calendar-api Worker is a one-time job**: add a `routes` block to `calendar-api/wrangler.jsonc` (or attach via the dashboard, same way as Task 3's alternative), redeploy. No further DNS reconfiguration needed since Cloudflare is authoritative.

---

## Summary of touched files

The only repo file modified by this plan is `pttp/wrangler.jsonc` (Task 3) — and that's done pre-cutover, not on the day. Everything else is infra changes outside the repo:

- Cloudflare dashboard (zone, DNS records, Worker custom domains, Access policies, Bulk Redirects)
- Dreamhost panel (subdomain hosting, Let's Encrypt cert, nameserver swap)
- WP admin (maintenance mode, siteurl/home, search-replace, Deploy Trigger settings)
- GitHub repo Settings → Secrets (`WORDPRESS_GRAPHQL_URL` value swap)
- Manual `gh workflow run` invocation during cutover

Repo artifacts that EXIST and need to behave correctly post-cutover (not modified during this plan):
- `pttp/app/sitemap.ts` → `/sitemap.xml`
- `pttp/app/robots.ts` → `/robots.txt`
- `pttp/app/opengraph-image.tsx` → `/opengraph-image` (1200×630 PNG)
- `pttp/app/layout.tsx` → Organization + WebSite JSON-LD on every page
- `pttp/app/news/[slug]/page.tsx` → NewsArticle JSON-LD per post
- `pttp/wordpress/pttp-deploy-trigger/pttp-deploy-trigger.php` → WP-side auto-rebuild webhook
- `pttp/docs/editing-news.md` → editor onboarding doc
