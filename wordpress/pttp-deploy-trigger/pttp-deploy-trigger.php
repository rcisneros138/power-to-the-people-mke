<?php
/**
 * Plugin Name: PTTP Deploy Trigger
 * Description: Triggers a GitHub Actions repository_dispatch (event type: wordpress_update) whenever a post transitions to or from "publish" so the static Next.js site rebuilds automatically.
 * Version: 1.0.0
 * Author: Power to the People MKE
 * Text Domain: pttp-deploy-trigger
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'PTTP_DEPLOY_TRIGGER_VERSION', '1.0.0' );
define( 'PTTP_DEPLOY_TRIGGER_CRON_HOOK', 'pttp_deploy_trigger_fire' );
define( 'PTTP_DEPLOY_TRIGGER_DEBOUNCE_SECONDS', 30 );

// ──────────────────────────────────────────────
// 1. Config helpers
// ──────────────────────────────────────────────

/**
 * Resolve the GitHub PAT.
 * Constant in wp-config.php takes precedence over the database option.
 * Returns the raw token string, or '' if not configured.
 */
function pttp_deploy_trigger_get_pat() {
    if ( defined( 'PTTP_DEPLOY_TRIGGER_PAT' ) && PTTP_DEPLOY_TRIGGER_PAT ) {
        return (string) PTTP_DEPLOY_TRIGGER_PAT;
    }
    $stored = get_option( 'pttp_deploy_trigger_pat', '' );
    if ( ! $stored ) {
        return '';
    }
    // Stored base64-encoded for casual obscurity (not real encryption).
    $decoded = base64_decode( $stored, true );
    return is_string( $decoded ) ? $decoded : '';
}

function pttp_deploy_trigger_pat_source() {
    if ( defined( 'PTTP_DEPLOY_TRIGGER_PAT' ) && PTTP_DEPLOY_TRIGGER_PAT ) {
        return 'wp-config constant';
    }
    if ( get_option( 'pttp_deploy_trigger_pat', '' ) ) {
        return 'database';
    }
    return 'not configured';
}

function pttp_deploy_trigger_get_repo() {
    return (string) get_option( 'pttp_deploy_trigger_repo', '' );
}

function pttp_deploy_trigger_get_event_type() {
    $event = (string) get_option( 'pttp_deploy_trigger_event_type', 'wordpress_update' );
    return $event ?: 'wordpress_update';
}

function pttp_deploy_trigger_get_post_types() {
    $defaults = [ 'post', 'page', 'pttp_event', 'pttp_partner', 'pttp_faq', 'pttp_announcement' ];
    $stored   = get_option( 'pttp_deploy_trigger_post_types', $defaults );
    if ( ! is_array( $stored ) || empty( $stored ) ) {
        $stored = $defaults;
    }
    /**
     * Filter which post types trigger a rebuild on publish/unpublish.
     *
     * @param string[] $post_types Array of post type slugs.
     */
    return (array) apply_filters( 'pttp_deploy_trigger_post_types', $stored );
}

// ──────────────────────────────────────────────
// 2. Status-transition hook (schedules debounced dispatch)
// ──────────────────────────────────────────────

add_action( 'transition_post_status', 'pttp_deploy_trigger_on_transition', 10, 3 );

function pttp_deploy_trigger_on_transition( $new_status, $old_status, $post ) {
    if ( ! ( $post instanceof WP_Post ) ) {
        return;
    }
    if ( wp_is_post_revision( $post ) || wp_is_post_autosave( $post ) ) {
        return;
    }
    if ( ! in_array( $post->post_type, pttp_deploy_trigger_get_post_types(), true ) ) {
        return;
    }
    // Only care about transitions involving "publish" — that's what affects the live site.
    if ( $new_status !== 'publish' && $old_status !== 'publish' ) {
        return;
    }
    // Skip if no real change (e.g. publish→publish from a quick-edit) UNLESS it's a publish save
    // — we still want to rebuild when an editor updates an already-published post.
    if ( $new_status === $old_status && $new_status !== 'publish' ) {
        return;
    }

    pttp_deploy_trigger_schedule_dispatch();
}

/**
 * Schedule a single debounced dispatch. No-op if one is already pending.
 */
function pttp_deploy_trigger_schedule_dispatch() {
    if ( wp_next_scheduled( PTTP_DEPLOY_TRIGGER_CRON_HOOK ) ) {
        return;
    }
    wp_schedule_single_event( time() + PTTP_DEPLOY_TRIGGER_DEBOUNCE_SECONDS, PTTP_DEPLOY_TRIGGER_CRON_HOOK );
}

// ──────────────────────────────────────────────
// 3. Dispatch handler (the actual HTTP POST to GitHub)
// ──────────────────────────────────────────────

add_action( PTTP_DEPLOY_TRIGGER_CRON_HOOK, 'pttp_deploy_trigger_fire_dispatch' );

function pttp_deploy_trigger_fire_dispatch( $is_test = false ) {
    $pat  = pttp_deploy_trigger_get_pat();
    $repo = pttp_deploy_trigger_get_repo();

    if ( ! $pat ) {
        pttp_deploy_trigger_record_result( 'error', 0, 'No GitHub PAT configured.' );
        return;
    }
    if ( ! preg_match( '#^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$#', $repo ) ) {
        pttp_deploy_trigger_record_result( 'error', 0, 'Repository not configured or invalid (expected owner/repo).' );
        return;
    }

    $url     = sprintf( 'https://api.github.com/repos/%s/dispatches', $repo );
    $payload = [
        'event_type'     => pttp_deploy_trigger_get_event_type(),
        'client_payload' => [
            'source'       => 'wordpress',
            'site_url'     => home_url(),
            'triggered_at' => gmdate( 'c' ),
            'test'         => (bool) $is_test,
        ],
    ];

    $response = wp_remote_post(
        $url,
        [
            'method'   => 'POST',
            'timeout'  => 15,
            'blocking' => true,
            'headers'  => [
                'Authorization'        => 'Bearer ' . $pat,
                'Accept'               => 'application/vnd.github+json',
                'X-GitHub-Api-Version' => '2022-11-28',
                'User-Agent'           => 'PTTP-Deploy-Trigger/' . PTTP_DEPLOY_TRIGGER_VERSION,
                'Content-Type'         => 'application/json',
            ],
            'body'     => wp_json_encode( $payload ),
        ]
    );

    if ( is_wp_error( $response ) ) {
        $msg = $response->get_error_message();
        pttp_deploy_trigger_record_result( 'error', 0, 'WP_Error: ' . $msg );
        error_log( '[pttp-deploy-trigger] WP_Error during dispatch: ' . $msg );
        return;
    }

    $code = (int) wp_remote_retrieve_response_code( $response );
    if ( $code === 204 ) {
        pttp_deploy_trigger_record_result( 'success', $code, $is_test ? 'Test dispatch sent.' : 'Dispatch sent.' );
        return;
    }

    $body = wp_remote_retrieve_body( $response );
    pttp_deploy_trigger_record_result( 'error', $code, 'GitHub responded ' . $code . ': ' . substr( (string) $body, 0, 240 ) );
    error_log( sprintf( '[pttp-deploy-trigger] GitHub dispatch failed (%d): %s', $code, $body ) );
}

function pttp_deploy_trigger_record_result( $status, $code, $message ) {
    update_option(
        'pttp_deploy_trigger_last',
        [
            'timestamp' => gmdate( 'c' ),
            'status'    => $status,
            'http_code' => (int) $code,
            'message'   => (string) $message,
        ],
        false
    );
}

// ──────────────────────────────────────────────
// 4. Admin settings page
// ──────────────────────────────────────────────

add_action( 'admin_menu', 'pttp_deploy_trigger_register_settings_page' );

function pttp_deploy_trigger_register_settings_page() {
    add_options_page(
        'Deploy Trigger',
        'Deploy Trigger',
        'manage_options',
        'pttp-deploy-trigger',
        'pttp_deploy_trigger_render_settings_page'
    );
}

function pttp_deploy_trigger_render_settings_page() {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    $constant_defined = defined( 'PTTP_DEPLOY_TRIGGER_PAT' ) && PTTP_DEPLOY_TRIGGER_PAT;
    $repo             = pttp_deploy_trigger_get_repo();
    $event_type       = pttp_deploy_trigger_get_event_type();
    $tracked          = pttp_deploy_trigger_get_post_types();
    $last             = get_option( 'pttp_deploy_trigger_last' );
    $scheduled        = wp_next_scheduled( PTTP_DEPLOY_TRIGGER_CRON_HOOK );
    $all_post_types   = [ 'post', 'page', 'pttp_event', 'pttp_partner', 'pttp_faq', 'pttp_announcement' ];
    ?>
    <div class="wrap">
        <h1>Deploy Trigger</h1>
        <p>
            Fires a <code>repository_dispatch</code> event to GitHub Actions whenever a post is published, updated,
            or unpublished — triggering a fresh deploy of the static site. Debounced to <?php echo (int) PTTP_DEPLOY_TRIGGER_DEBOUNCE_SECONDS; ?>s
            so rapid edits coalesce into a single rebuild.
        </p>

        <?php settings_errors( 'pttp_deploy_trigger' ); ?>

        <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
            <input type="hidden" name="action" value="pttp_deploy_trigger_save" />
            <?php wp_nonce_field( 'pttp_deploy_trigger_save', 'pttp_deploy_trigger_nonce' ); ?>

            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="pttp_repo">GitHub repository</label></th>
                    <td>
                        <input type="text" id="pttp_repo" name="pttp_repo"
                               value="<?php echo esc_attr( $repo ); ?>"
                               placeholder="owner/repo"
                               class="regular-text" />
                        <p class="description">Format: <code>owner/repo</code> (e.g. <code>rcisneros138/power-to-the-people-mke</code>).</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="pttp_event_type">Event type</label></th>
                    <td>
                        <input type="text" id="pttp_event_type" name="pttp_event_type"
                               value="<?php echo esc_attr( $event_type ); ?>"
                               class="regular-text" />
                        <p class="description">Must match the <code>repository_dispatch.types</code> value in the workflow. Default: <code>wordpress_update</code>.</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="pttp_pat">GitHub fine-grained PAT</label></th>
                    <td>
                        <?php if ( $constant_defined ) : ?>
                            <input type="password" id="pttp_pat" value="••••••••••••••••" disabled class="regular-text" />
                            <p class="description">Managed via <code>PTTP_DEPLOY_TRIGGER_PAT</code> in <code>wp-config.php</code> (recommended). The database field is ignored.</p>
                        <?php else : ?>
                            <input type="password" id="pttp_pat" name="pttp_pat" value=""
                                   placeholder="<?php echo pttp_deploy_trigger_get_pat() ? 'Stored — leave blank to keep' : 'github_pat_...'; ?>"
                                   class="regular-text" autocomplete="new-password" />
                            <p class="description">
                                Fine-grained token scoped to the target repo with <strong>Contents: Read &amp; Write</strong>.
                                Storing in <code>wp-config.php</code> as <code>PTTP_DEPLOY_TRIGGER_PAT</code> is more secure than the database.
                            </p>
                        <?php endif; ?>
                    </td>
                </tr>
                <tr>
                    <th scope="row">Tracked post types</th>
                    <td>
                        <fieldset>
                            <?php foreach ( $all_post_types as $pt ) : ?>
                                <label style="display:block;margin-bottom:4px;">
                                    <input type="checkbox" name="pttp_post_types[]" value="<?php echo esc_attr( $pt ); ?>"
                                        <?php checked( in_array( $pt, $tracked, true ) ); ?> />
                                    <code><?php echo esc_html( $pt ); ?></code>
                                </label>
                            <?php endforeach; ?>
                            <p class="description">Only status transitions for these post types trigger a rebuild.</p>
                        </fieldset>
                    </td>
                </tr>
            </table>

            <?php submit_button( 'Save settings' ); ?>
        </form>

        <hr style="margin:2rem 0;" />

        <h2>Status</h2>
        <table class="form-table" role="presentation">
            <tr>
                <th scope="row">PAT source</th>
                <td><code><?php echo esc_html( pttp_deploy_trigger_pat_source() ); ?></code></td>
            </tr>
            <tr>
                <th scope="row">Last triggered</th>
                <td>
                    <?php if ( ! $last ) : ?>
                        <em>Never.</em>
                    <?php else : ?>
                        <code><?php echo esc_html( $last['timestamp'] ?? '' ); ?></code> —
                        <strong><?php echo esc_html( $last['status'] ?? '' ); ?></strong>
                        <?php if ( ! empty( $last['http_code'] ) ) : ?>
                            (HTTP <?php echo (int) $last['http_code']; ?>)
                        <?php endif; ?>
                        <?php if ( ! empty( $last['message'] ) ) : ?>
                            <br /><span style="color:#666;"><?php echo esc_html( $last['message'] ); ?></span>
                        <?php endif; ?>
                    <?php endif; ?>
                </td>
            </tr>
            <tr>
                <th scope="row">Scheduled dispatch</th>
                <td>
                    <?php if ( $scheduled ) : ?>
                        Pending — fires at <code><?php echo esc_html( gmdate( 'c', (int) $scheduled ) ); ?></code>
                        (in <?php echo (int) max( 0, $scheduled - time() ); ?>s).
                    <?php else : ?>
                        <em>None pending.</em>
                    <?php endif; ?>
                </td>
            </tr>
        </table>

        <h2>Manual actions</h2>
        <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:inline-block;margin-right:8px;">
            <input type="hidden" name="action" value="pttp_deploy_trigger_now" />
            <input type="hidden" name="mode" value="real" />
            <?php wp_nonce_field( 'pttp_deploy_trigger_now', 'pttp_deploy_trigger_nonce' ); ?>
            <?php submit_button( 'Trigger rebuild now', 'primary', 'submit', false ); ?>
        </form>
        <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:inline-block;">
            <input type="hidden" name="action" value="pttp_deploy_trigger_now" />
            <input type="hidden" name="mode" value="test" />
            <?php wp_nonce_field( 'pttp_deploy_trigger_now', 'pttp_deploy_trigger_nonce' ); ?>
            <?php submit_button( 'Send test ping', 'secondary', 'submit', false ); ?>
        </form>
    </div>
    <?php
}

// ──────────────────────────────────────────────
// 5. Form handlers (admin-post.php)
// ──────────────────────────────────────────────

add_action( 'admin_post_pttp_deploy_trigger_save', 'pttp_deploy_trigger_handle_save' );

function pttp_deploy_trigger_handle_save() {
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_die( 'Insufficient permissions.', 403 );
    }
    check_admin_referer( 'pttp_deploy_trigger_save', 'pttp_deploy_trigger_nonce' );

    $repo = isset( $_POST['pttp_repo'] ) ? sanitize_text_field( wp_unslash( $_POST['pttp_repo'] ) ) : '';
    if ( $repo && ! preg_match( '#^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$#', $repo ) ) {
        add_settings_error( 'pttp_deploy_trigger', 'pttp_repo_invalid', 'Repository must be in <code>owner/repo</code> format.', 'error' );
    } else {
        update_option( 'pttp_deploy_trigger_repo', $repo, false );
    }

    $event_type = isset( $_POST['pttp_event_type'] ) ? sanitize_text_field( wp_unslash( $_POST['pttp_event_type'] ) ) : 'wordpress_update';
    update_option( 'pttp_deploy_trigger_event_type', $event_type ?: 'wordpress_update', false );

    if ( ! ( defined( 'PTTP_DEPLOY_TRIGGER_PAT' ) && PTTP_DEPLOY_TRIGGER_PAT ) ) {
        $pat_raw = isset( $_POST['pttp_pat'] ) ? trim( (string) wp_unslash( $_POST['pttp_pat'] ) ) : '';
        if ( $pat_raw !== '' ) {
            update_option( 'pttp_deploy_trigger_pat', base64_encode( $pat_raw ), false );
        }
    }

    $allowed_types = [ 'post', 'page', 'pttp_event', 'pttp_partner', 'pttp_faq', 'pttp_announcement' ];
    $submitted     = isset( $_POST['pttp_post_types'] ) && is_array( $_POST['pttp_post_types'] )
        ? array_map( 'sanitize_text_field', wp_unslash( $_POST['pttp_post_types'] ) )
        : [];
    $clean         = array_values( array_intersect( $allowed_types, $submitted ) );
    if ( empty( $clean ) ) {
        $clean = $allowed_types;
    }
    update_option( 'pttp_deploy_trigger_post_types', $clean, false );

    add_settings_error( 'pttp_deploy_trigger', 'pttp_saved', 'Settings saved.', 'updated' );
    set_transient( 'settings_errors', get_settings_errors(), 30 );

    wp_safe_redirect( add_query_arg( [ 'page' => 'pttp-deploy-trigger', 'settings-updated' => 'true' ], admin_url( 'options-general.php' ) ) );
    exit;
}

add_action( 'admin_post_pttp_deploy_trigger_now', 'pttp_deploy_trigger_handle_manual' );

function pttp_deploy_trigger_handle_manual() {
    if ( ! current_user_can( 'manage_options' ) ) {
        wp_die( 'Insufficient permissions.', 403 );
    }
    check_admin_referer( 'pttp_deploy_trigger_now', 'pttp_deploy_trigger_nonce' );

    $is_test = isset( $_POST['mode'] ) && $_POST['mode'] === 'test';
    pttp_deploy_trigger_fire_dispatch( $is_test );

    wp_safe_redirect( add_query_arg( [ 'page' => 'pttp-deploy-trigger', 'manual-trigger' => $is_test ? 'test' : 'real' ], admin_url( 'options-general.php' ) ) );
    exit;
}

// ──────────────────────────────────────────────
// 6. Activation / deactivation
// ──────────────────────────────────────────────

register_deactivation_hook( __FILE__, 'pttp_deploy_trigger_deactivate' );

function pttp_deploy_trigger_deactivate() {
    $timestamp = wp_next_scheduled( PTTP_DEPLOY_TRIGGER_CRON_HOOK );
    if ( $timestamp ) {
        wp_unschedule_event( $timestamp, PTTP_DEPLOY_TRIGGER_CRON_HOOK );
    }
}
