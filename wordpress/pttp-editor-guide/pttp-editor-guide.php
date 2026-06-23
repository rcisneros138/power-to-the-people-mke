<?php
/**
 * Plugin Name: PTTP Editor Guide
 * Description: Adds a "How publishing works" widget to the WordPress dashboard home and a full content-editor guide page. Helps non-technical editors understand that the public site is a static build that rebuilds on publish.
 * Version: 1.3.0
 * Author: Power to the People MKE
 * Text Domain: pttp-editor-guide
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'PTTP_EDITOR_GUIDE_VERSION', '1.3.0' );

/**
 * URL of the Deploy Trigger settings page (where editors check rebuild status),
 * or '' if that plugin isn't active.
 */
function pttp_editor_guide_deploy_trigger_url() {
    // The Deploy Trigger plugin registers options-general.php?page=pttp-deploy-trigger.
    global $submenu;
    $has_page = false;
    if ( isset( $submenu['options-general.php'] ) ) {
        foreach ( $submenu['options-general.php'] as $item ) {
            if ( isset( $item[2] ) && $item[2] === 'pttp-deploy-trigger' ) {
                $has_page = true;
                break;
            }
        }
    }
    return $has_page ? admin_url( 'options-general.php?page=pttp-deploy-trigger' ) : '';
}

// ──────────────────────────────────────────────
// 1. Dashboard widget (shows on the wp-admin home)
// ──────────────────────────────────────────────

add_action( 'wp_dashboard_setup', 'pttp_editor_guide_register_widget' );

function pttp_editor_guide_register_widget() {
    if ( ! current_user_can( 'edit_posts' ) ) {
        return;
    }
    wp_add_dashboard_widget(
        'pttp_editor_guide_widget',
        '📣 How publishing works on this site',
        'pttp_editor_guide_render_widget',
        null,
        null,
        'normal',
        'high' // put it near the top of the dashboard
    );
}

function pttp_editor_guide_render_widget() {
    $guide_url   = admin_url( 'index.php?page=pttp-editor-guide' );
    $deploy_url  = pttp_editor_guide_deploy_trigger_url();
    ?>
    <style>
        #pttp_editor_guide_widget .pttp-eg-lead { font-size: 13px; }
        #pttp_editor_guide_widget ul { margin: 10px 0 12px 18px; list-style: disc; }
        #pttp_editor_guide_widget li { margin-bottom: 6px; }
        #pttp_editor_guide_widget .pttp-eg-callout {
            border-left: 4px solid #d63638; background: #fcf0f1;
            padding: 8px 12px; margin: 12px 0; border-radius: 0 4px 4px 0;
        }
        #pttp_editor_guide_widget .pttp-eg-actions { margin-top: 12px; }
        #pttp_editor_guide_widget .pttp-eg-actions a { margin-right: 8px; }
    </style>

    <p class="pttp-eg-lead">
        The public site is a <strong>static build</strong> — your edits are <strong>not instant</strong>.
        When you publish or update, the site rebuilds itself automatically, and your change goes live in
        <strong>about 2–4 minutes</strong>.
    </p>

    <ul>
        <li><strong>Publishing or updating</strong> a Post, Page, Partner, FAQ, or Announcement rebuilds the site automatically.</li>
        <li><strong>Saving a draft does nothing</strong> to the live site — only published changes go out.</li>
        <li><strong>Unpublishing</strong> (Draft/Trash) removes the item from the live site on the next rebuild.</li>
        <li>Several quick edits are <strong>batched into one rebuild</strong> (~30s window), so finish your batch.</li>
    </ul>

    <div class="pttp-eg-callout">
        <strong>The Calendar is different.</strong> Public calendar events come from <strong>Solidarity Tech</strong>,
        not WordPress. Editing "Events" in WordPress will <em>not</em> change the public calendar.
    </div>

    <p style="font-size:13px;">
        <strong>Change not showing after 5 minutes?</strong> Confirm the item is Published, hard-refresh
        (Cmd/Ctrl + Shift + R)<?php if ( $deploy_url ) : ?>, then check the rebuild status under Deploy Trigger<?php endif; ?>.
    </p>

    <p class="pttp-eg-actions">
        <a href="<?php echo esc_url( $guide_url ); ?>" class="button button-primary">Read the full guide</a>
        <?php if ( $deploy_url ) : ?>
            <a href="<?php echo esc_url( $deploy_url ); ?>" class="button">Check rebuild status</a>
        <?php endif; ?>
    </p>
    <?php
}

// ──────────────────────────────────────────────
// 2. Full guide page (under Dashboard menu)
// ──────────────────────────────────────────────

add_action( 'admin_menu', 'pttp_editor_guide_register_page' );

function pttp_editor_guide_register_page() {
    add_submenu_page(
        'index.php',                 // parent: Dashboard
        'Editor Guide',              // page title
        'Editor Guide',              // menu label (appears under Dashboard)
        'edit_posts',                // capability: any editor/author
        'pttp-editor-guide',         // slug
        'pttp_editor_guide_render_page'
    );
}

function pttp_editor_guide_render_page() {
    if ( ! current_user_can( 'edit_posts' ) ) {
        return;
    }
    $deploy_url = pttp_editor_guide_deploy_trigger_url();
    ?>
    <div class="wrap pttp-eg-page">
        <h1>Content Editor Guide</h1>

        <style>
            .pttp-eg-page { max-width: 820px; }
            .pttp-eg-page h2 { margin-top: 1.8em; border-bottom: 1px solid #dcdcde; padding-bottom: 6px; }
            .pttp-eg-page table.widefat { margin: 12px 0; }
            .pttp-eg-page td, .pttp-eg-page th { vertical-align: top; }
            .pttp-eg-warn {
                border-left: 4px solid #d63638; background: #fcf0f1;
                padding: 12px 16px; margin: 16px 0; border-radius: 0 4px 4px 0;
            }
            .pttp-eg-note {
                border-left: 4px solid #2271b1; background: #f0f6fc;
                padding: 12px 16px; margin: 16px 0; border-radius: 0 4px 4px 0;
            }
        </style>

        <p><em>The everyday guide for updating content on powertothepeoplemke.org. No code, no developer needed for routine updates.</em></p>

        <h2>What you can edit (and where it lives in the admin)</h2>
        <p>You can edit these parts of the site directly in WordPress — each has its <strong>own section in the left sidebar</strong>. Publish or update, and the site rebuilds itself (see below).</p>
        <table class="widefat striped" style="max-width:640px;">
            <thead><tr><th>Part of the site</th><th>Where to edit it</th></tr></thead>
            <tbody>
                <tr><td>The <strong>announcement banner</strong> across the top of every page</td><td><strong>Announcements</strong></td></tr>
                <tr><td>The <strong>News</strong> section — the index at <code>/news</code> and each article</td><td><strong>Posts</strong></td></tr>
                <tr><td>The <strong>FAQ</strong> — the homepage FAQ section <em>and</em> the standalone FAQ page (<code>/faq</code>)</td><td><strong>FAQs</strong></td></tr>
                <tr><td>The <strong>Partners</strong> — the <code>/partners</code> page <em>and</em> the homepage logo strip</td><td><strong>Partners</strong></td></tr>
            </tbody>
        </table>
        <p style="color:#646970;"><em>Everything else — the homepage, the page layouts and designs, the navigation menu and footer, and the Calendar (which comes from Solidarity Tech, not WordPress) — is set in code. Ask a developer to change those.</em></p>

        <h2>The one thing to understand: the site is <em>rebuilt</em>, not live</h2>
        <p>
            The public site is a <strong>static site</strong>. WordPress doesn't serve pages to visitors directly —
            instead, a build process reads everything out of WordPress and bakes it into fast static files served from Cloudflare.
        </p>
        <ul>
            <li><strong>Your edits are not instant.</strong> A rebuild has to run first (a few minutes).</li>
            <li><strong>The live site is a snapshot</strong> of WordPress as of the last build.</li>
            <li><strong>Drafts and previews never reach the public site</strong> — only published content gets built in.
                (WordPress "Preview" shows the WordPress render so you can proof your work; it is not the live site.)</li>
        </ul>
        <div class="pttp-eg-note">
            <strong>Mental model:</strong> WordPress is the kitchen; the public site is the printed menu.
            Changing a recipe doesn't change the menu until someone reprints it. Publishing reprints it
            automatically — but it takes a few minutes.
        </div>

        <h2>What triggers a rebuild</h2>
        <p>A rebuild fires <strong>automatically</strong> when you make a publish-related change to a tracked content type. This is handled by the <strong>PTTP Deploy Trigger</strong> plugin.</p>

        <p><strong>Tracked content types:</strong></p>
        <table class="widefat striped" style="max-width:560px;">
            <thead><tr><th>In the sidebar</th><th>Feeds on the site</th></tr></thead>
            <tbody>
                <tr><td>Posts</td><td>News &amp; Updates (<code>/news</code>)</td></tr>
                <tr><td>Pages</td><td>Standard content pages</td></tr>
                <tr><td>Events</td><td>Custom type — <em>see Calendar caveat below</em></td></tr>
                <tr><td>Partners</td><td>Partners section</td></tr>
                <tr><td>FAQs</td><td>The homepage FAQ section <strong>and</strong> the standalone FAQ page (<code>/faq</code>)</td></tr>
                <tr><td>Announcements</td><td>The banner across the top of every page</td></tr>
            </tbody>
        </table>

        <p><strong>What counts as a publish-related change (rebuilds the site):</strong></p>
        <ul>
            <li>✅ Publishing a new item</li>
            <li>✅ Updating something already published</li>
            <li>✅ Unpublishing — moving a published item to <strong>Draft</strong></li>
            <li>✅ Trashing a published item</li>
        </ul>
        <p><strong>What does NOT rebuild:</strong></p>
        <ul>
            <li>❌ Saving a draft (it was never live)</li>
            <li>❌ Editing a draft that stays a draft</li>
            <li>❌ Autosaves and revisions</li>
        </ul>
        <p>In short: if the change affects what a visitor sees, it rebuilds. Working privately on a draft does not.</p>
        <p><strong>Rapid edits are batched.</strong> Multiple changes within ~30 seconds coalesce into a single rebuild, so finish your batch and they go out together.</p>

        <div class="pttp-eg-note">
            <strong>News is currently hidden.</strong> Because there are no posts yet, the <strong>News</strong> link has been
            removed from the top menu and <code>/news</code> is hidden from search engines. This clears itself when you publish —
            but the menu link won't reappear on its own. If you're launching the News section, give a developer a heads-up to
            restore the menu link.
        </div>

        <h2>How long until my change is live?</h2>
        <p>Roughly <strong>2–4 minutes</strong>: you publish → the plugin waits ~30s to batch edits → the build runs (reads WordPress, builds static files, deploys to Cloudflare) → live.</p>
        <div class="pttp-eg-note">
            <strong>Tip:</strong> a hard refresh (Cmd/Ctrl + Shift + R) clears your own browser cache.
            Sometimes the build finished and you're just looking at a cached copy.
        </div>

        <h2>⚠️ The Calendar is the exception — it does NOT come from WordPress</h2>
        <div class="pttp-eg-warn">
            <p>The public <strong>Calendar</strong> pulls events from <strong>Solidarity Tech</strong>, which is the source of truth.</p>
            <ul style="margin-bottom:0;">
                <li><strong>Adding an "Event" in WordPress will not put it on the public calendar.</strong> Edit events in Solidarity Tech.</li>
                <li>Calendar updates don't depend on the WordPress publish-and-rebuild flow described above.</li>
            </ul>
        </div>

        <h2>Posting an announcement banner</h2>
        <p>The bar across the very top of every page is controlled from <strong>Announcements</strong> in the sidebar.</p>
        <ul>
            <li><strong>Announcements &rarr; Add New.</strong> The <em>Title</em> is an internal label only — visitors never see it.</li>
            <li>Fill in <strong>Message</strong>, an optional <strong>Button</strong> (label + URL — both needed for it to appear), an <strong>Urgency / color</strong> (Info = navy, Event = coral, Urgent = red), and optionally <strong>Show from / Show until</strong>.</li>
            <li><strong>Only the most recently published</strong> announcement shows. To take the banner down, move it to <strong>Draft</strong> or <strong>Trash</strong>.</li>
            <li><strong>Show from / Show until</strong> are checked in the visitor's browser, so a banner can appear and disappear on schedule <em>without</em> a rebuild. Times use the visitor's local clock (effectively Central for a Milwaukee audience).</li>
            <li><strong>Dismissible</strong> lets visitors close the bar; editing the message re-shows it to everyone.</li>
        </ul>

        <h2>Things to consider before you publish</h2>
        <ul>
            <li><strong>Fill in the excerpt and featured image</strong> for news posts — blank excerpts produce awkward auto-summaries on cards and in Google/social previews.</li>
            <li><strong>Set alt text on every image</strong> — used for accessibility and SEO.</li>
            <li><strong>Compress big images</strong> before uploading (aim under ~300&nbsp;KB; <a href="https://tinypng.com/" target="_blank" rel="noopener">TinyPNG</a> works well).</li>
            <li><strong>Check the slug/URL</strong> before publishing news — it's hard to change cleanly after a page is shared or indexed.</li>
            <li><strong>Use WordPress Preview</strong> to proof content before publishing.</li>
            <li><strong>Batch your edits</strong> so they go out in one rebuild.</li>
            <li><strong>Unpublishing removes content</strong> — Draft/Trash makes an item disappear on the next rebuild (its URL will 404).</li>
        </ul>

        <h2>Troubleshooting</h2>
        <p><strong>My change isn't showing up after 5+ minutes:</strong></p>
        <ol>
            <li>Hard refresh your browser (Cmd/Ctrl + Shift + R) — you may be seeing a cached copy.</li>
            <li>Confirm the item is actually <strong>Published</strong> (not Draft, not Scheduled for the future, not in Trash).</li>
            <li>Check the rebuild status:
                <?php if ( $deploy_url ) : ?>
                    <a href="<?php echo esc_url( $deploy_url ); ?>">Settings → Deploy Trigger</a>.
                <?php else : ?>
                    <strong>Settings → Deploy Trigger</strong>.
                <?php endif; ?>
                Look at <strong>"Last triggered"</strong>:
                <ul>
                    <li><strong>success / HTTP 204</strong> → the rebuild was requested fine; it's building or just needs another minute.</li>
                    <li><strong>error</strong> → the message explains why (often an expired GitHub token). A developer needs to fix it.</li>
                </ul>
            </li>
            <li>Force it: on that page click <strong>"Trigger rebuild now"</strong> to skip the 30-second wait.</li>
        </ol>

        <p><strong>The <code>/news</code> page says "No news articles available yet":</strong> either nothing is published yet, or the build couldn't reach WordPress (a developer issue). If you do have published posts and still see this, ping a developer.</p>

        <p><strong>A calendar event is wrong or missing:</strong> the calendar comes from <strong>Solidarity Tech</strong>, not WordPress. Editing WordPress won't fix it.</p>

        <p><strong>Something looks broken on the page:</strong> check the WordPress preview looks correct first. If it's fine in WordPress but broken live, note the URL and reach out to a developer.</p>

        <h2>Quick reference</h2>
        <table class="widefat striped">
            <thead><tr><th>Situation</th><th>What happens</th></tr></thead>
            <tbody>
                <tr><td>Publish a new post/page/partner/FAQ</td><td>Site rebuilds (~2–4 min), content goes live</td></tr>
                <tr><td>Update an already-published item</td><td>Site rebuilds, change goes live</td></tr>
                <tr><td>Move published item to Draft / Trash</td><td>Site rebuilds, item removed from live site</td></tr>
                <tr><td>Save a draft / edit a draft</td><td><strong>No rebuild</strong> — nothing changes live</td></tr>
                <tr><td>Several edits within ~30s</td><td>Batched into <strong>one</strong> rebuild</td></tr>
                <tr><td>Add/edit a calendar event</td><td>Do it in <strong>Solidarity Tech</strong>, not WordPress</td></tr>
                <tr><td>Nothing showing after 5 min</td><td>Check Deploy Trigger → Last triggered; "Trigger rebuild now" if needed</td></tr>
            </tbody>
        </table>

        <p style="margin-top:1.5em;color:#646970;"><em>For anything beyond routine updates — broken layouts, build errors, or an <code>error</code> status on Deploy Trigger — reach out to a developer.</em></p>
    </div>
    <?php
}
