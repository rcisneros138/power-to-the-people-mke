<?php
/**
 * Plugin Name: PTTP Custom Post Types
 * Description: Registers Events, Partners, and FAQs custom post types with WPGraphQL support for Power to the People MKE.
 * Version: 1.1.0
 * Author: Power to the People MKE
 * Text Domain: pttp
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ──────────────────────────────────────────────
// 1. Register Custom Post Types
// ──────────────────────────────────────────────

add_action( 'init', 'pttp_register_post_types' );

function pttp_register_post_types() {

    // Events — public since they have front-end archive/single views
    register_post_type( 'pttp_event', [
        'labels' => [
            'name'               => 'Events',
            'singular_name'      => 'Event',
            'all_items'          => 'All Events',
            'add_new_item'       => 'Add New Event',
            'edit_item'          => 'Edit Event',
            'new_item'           => 'New Event',
            'view_item'          => 'View Event',
            'search_items'       => 'Search Events',
            'not_found'          => 'No events found',
            'not_found_in_trash' => 'No events found in Trash',
            'menu_name'          => 'Events',
        ],
        'public'       => true,
        'has_archive'  => true,
        'menu_icon'    => 'dashicons-calendar-alt',
        'menu_position' => 25,
        'supports'     => [ 'title', 'editor', 'thumbnail' ],
        'rewrite'      => [ 'slug' => 'events' ],
        'show_in_rest' => true,
        'show_in_graphql'      => true,
        'graphql_single_name'  => 'event',
        'graphql_plural_name'  => 'events',
    ] );

    // Partners — no WP front-end pages, but queryable via GraphQL
    register_post_type( 'pttp_partner', [
        'labels' => [
            'name'               => 'Partners',
            'singular_name'      => 'Partner',
            'all_items'          => 'All Partners',
            'add_new_item'       => 'Add New Partner',
            'edit_item'          => 'Edit Partner',
            'new_item'           => 'New Partner',
            'view_item'          => 'View Partner',
            'search_items'       => 'Search Partners',
            'not_found'          => 'No partners found',
            'not_found_in_trash' => 'No partners found in Trash',
            'menu_name'          => 'Partners',
        ],
        'public'              => false,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'has_archive'         => false,
        'menu_icon'           => 'dashicons-groups',
        'menu_position'       => 26,
        'supports'            => [ 'title', 'editor', 'thumbnail' ],
        'show_in_rest'        => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'partner',
        'graphql_plural_name' => 'partners',
    ] );

    // FAQs — no WP front-end pages, but queryable via GraphQL
    register_post_type( 'pttp_faq', [
        'labels' => [
            'name'               => 'FAQs',
            'singular_name'      => 'FAQ',
            'all_items'          => 'All FAQs',
            'add_new_item'       => 'Add New FAQ',
            'edit_item'          => 'Edit FAQ',
            'new_item'           => 'New FAQ',
            'view_item'          => 'View FAQ',
            'search_items'       => 'Search FAQs',
            'not_found'          => 'No FAQs found',
            'not_found_in_trash' => 'No FAQs found in Trash',
            'menu_name'          => 'FAQs',
        ],
        'public'              => false,
        'publicly_queryable'  => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'has_archive'         => false,
        'menu_icon'           => 'dashicons-editor-help',
        'menu_position'       => 27,
        'supports'            => [ 'title', 'editor' ],
        'show_in_rest'        => true,
        'show_in_graphql'     => true,
        'graphql_single_name' => 'faq',
        'graphql_plural_name' => 'faqs',
    ] );
}

// ──────────────────────────────────────────────
// 2. Register Meta Boxes (Admin UI for custom fields)
// ──────────────────────────────────────────────

add_action( 'add_meta_boxes', 'pttp_add_meta_boxes' );

function pttp_add_meta_boxes() {

    // Event fields: date, time, location, event URL
    add_meta_box(
        'pttp_event_details',
        'Event Details',
        'pttp_event_meta_box_html',
        'pttp_event',
        'normal',
        'high'
    );

    // Partner fields: short name, website URL, display order
    add_meta_box(
        'pttp_partner_details',
        'Partner Details',
        'pttp_partner_meta_box_html',
        'pttp_partner',
        'normal',
        'high'
    );

    // FAQ fields: display order
    add_meta_box(
        'pttp_faq_details',
        'FAQ Details',
        'pttp_faq_meta_box_html',
        'pttp_faq',
        'side',
        'default'
    );
}

function pttp_event_meta_box_html( $post ) {
    wp_nonce_field( 'pttp_event_nonce', 'pttp_event_nonce_field' );

    $event_date = get_post_meta( $post->ID, '_pttp_event_date', true );
    $event_time = get_post_meta( $post->ID, '_pttp_event_time', true );
    $location   = get_post_meta( $post->ID, '_pttp_event_location', true );
    $event_url  = get_post_meta( $post->ID, '_pttp_event_url', true );
    ?>
    <table class="form-table">
        <tr>
            <th><label for="pttp_event_date">Event Date</label></th>
            <td><input type="date" id="pttp_event_date" name="pttp_event_date" value="<?php echo esc_attr( $event_date ); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="pttp_event_time">Event Time</label></th>
            <td><input type="time" id="pttp_event_time" name="pttp_event_time" value="<?php echo esc_attr( $event_time ); ?>" class="regular-text" /></td>
        </tr>
        <tr>
            <th><label for="pttp_event_location">Location</label></th>
            <td><input type="text" id="pttp_event_location" name="pttp_event_location" value="<?php echo esc_attr( $location ); ?>" class="large-text" placeholder="e.g. Milwaukee Public Library - Central Branch" /></td>
        </tr>
        <tr>
            <th><label for="pttp_event_url">Event URL</label></th>
            <td><input type="url" id="pttp_event_url" name="pttp_event_url" value="<?php echo esc_url( $event_url ); ?>" class="large-text" placeholder="e.g. link to RSVP or event page" /></td>
        </tr>
    </table>
    <?php
}

function pttp_partner_meta_box_html( $post ) {
    wp_nonce_field( 'pttp_partner_nonce', 'pttp_partner_nonce_field' );

    $short_name    = get_post_meta( $post->ID, '_pttp_partner_short_name', true );
    $website_url   = get_post_meta( $post->ID, '_pttp_partner_website', true );
    $display_order = get_post_meta( $post->ID, '_pttp_partner_order', true );
    ?>
    <table class="form-table">
        <tr>
            <th><label for="pttp_partner_short_name">Short Name</label></th>
            <td><input type="text" id="pttp_partner_short_name" name="pttp_partner_short_name" value="<?php echo esc_attr( $short_name ); ?>" class="regular-text" placeholder="e.g. MTEA" /></td>
        </tr>
        <tr>
            <th><label for="pttp_partner_website">Website URL</label></th>
            <td><input type="url" id="pttp_partner_website" name="pttp_partner_website" value="<?php echo esc_url( $website_url ); ?>" class="large-text" /></td>
        </tr>
        <tr>
            <th><label for="pttp_partner_order">Display Order</label></th>
            <td><input type="number" id="pttp_partner_order" name="pttp_partner_order" value="<?php echo esc_attr( $display_order ); ?>" class="small-text" min="0" /></td>
        </tr>
    </table>
    <?php
}

function pttp_faq_meta_box_html( $post ) {
    wp_nonce_field( 'pttp_faq_nonce', 'pttp_faq_nonce_field' );

    $display_order = get_post_meta( $post->ID, '_pttp_faq_order', true );
    ?>
    <p>
        <label for="pttp_faq_order"><strong>Display Order</strong></label><br />
        <input type="number" id="pttp_faq_order" name="pttp_faq_order" value="<?php echo esc_attr( $display_order ); ?>" class="small-text" min="0" />
    </p>
    <?php
}

// ──────────────────────────────────────────────
// 3. Save Meta Fields
// ──────────────────────────────────────────────

add_action( 'save_post_pttp_event', 'pttp_save_event_meta' );

function pttp_save_event_meta( $post_id ) {
    if ( ! isset( $_POST['pttp_event_nonce_field'] ) || ! wp_verify_nonce( $_POST['pttp_event_nonce_field'], 'pttp_event_nonce' ) ) {
        return;
    }
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }
    if ( ! current_user_can( 'edit_post', $post_id ) ) {
        return;
    }

    if ( isset( $_POST['pttp_event_date'] ) ) {
        update_post_meta( $post_id, '_pttp_event_date', sanitize_text_field( $_POST['pttp_event_date'] ) );
    }
    if ( isset( $_POST['pttp_event_time'] ) ) {
        update_post_meta( $post_id, '_pttp_event_time', sanitize_text_field( $_POST['pttp_event_time'] ) );
    }
    if ( isset( $_POST['pttp_event_location'] ) ) {
        update_post_meta( $post_id, '_pttp_event_location', sanitize_text_field( $_POST['pttp_event_location'] ) );
    }
    if ( isset( $_POST['pttp_event_url'] ) ) {
        update_post_meta( $post_id, '_pttp_event_url', esc_url_raw( $_POST['pttp_event_url'] ) );
    }
}

add_action( 'save_post_pttp_partner', 'pttp_save_partner_meta' );

function pttp_save_partner_meta( $post_id ) {
    if ( ! isset( $_POST['pttp_partner_nonce_field'] ) || ! wp_verify_nonce( $_POST['pttp_partner_nonce_field'], 'pttp_partner_nonce' ) ) {
        return;
    }
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }
    if ( ! current_user_can( 'edit_post', $post_id ) ) {
        return;
    }

    if ( isset( $_POST['pttp_partner_short_name'] ) ) {
        update_post_meta( $post_id, '_pttp_partner_short_name', sanitize_text_field( $_POST['pttp_partner_short_name'] ) );
    }
    if ( isset( $_POST['pttp_partner_website'] ) ) {
        update_post_meta( $post_id, '_pttp_partner_website', esc_url_raw( $_POST['pttp_partner_website'] ) );
    }
    if ( isset( $_POST['pttp_partner_order'] ) ) {
        update_post_meta( $post_id, '_pttp_partner_order', absint( $_POST['pttp_partner_order'] ) );
    }
}

add_action( 'save_post_pttp_faq', 'pttp_save_faq_meta' );

function pttp_save_faq_meta( $post_id ) {
    if ( ! isset( $_POST['pttp_faq_nonce_field'] ) || ! wp_verify_nonce( $_POST['pttp_faq_nonce_field'], 'pttp_faq_nonce' ) ) {
        return;
    }
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
        return;
    }
    if ( ! current_user_can( 'edit_post', $post_id ) ) {
        return;
    }

    if ( isset( $_POST['pttp_faq_order'] ) ) {
        update_post_meta( $post_id, '_pttp_faq_order', absint( $_POST['pttp_faq_order'] ) );
    }
}

// ──────────────────────────────────────────────
// 4. Register Meta in REST API (for Gutenberg)
// ──────────────────────────────────────────────

add_action( 'init', 'pttp_register_meta_fields' );

function pttp_register_meta_fields() {
    // Event meta
    register_post_meta( 'pttp_event', '_pttp_event_date', [
        'show_in_rest'      => true,
        'single'            => true,
        'type'              => 'string',
        'sanitize_callback' => 'sanitize_text_field',
    ] );
    register_post_meta( 'pttp_event', '_pttp_event_time', [
        'show_in_rest'      => true,
        'single'            => true,
        'type'              => 'string',
        'sanitize_callback' => 'sanitize_text_field',
    ] );
    register_post_meta( 'pttp_event', '_pttp_event_location', [
        'show_in_rest'      => true,
        'single'            => true,
        'type'              => 'string',
        'sanitize_callback' => 'sanitize_text_field',
    ] );
    register_post_meta( 'pttp_event', '_pttp_event_url', [
        'show_in_rest'      => true,
        'single'            => true,
        'type'              => 'string',
        'sanitize_callback' => 'esc_url_raw',
    ] );

    // Partner meta
    register_post_meta( 'pttp_partner', '_pttp_partner_short_name', [
        'show_in_rest'      => true,
        'single'            => true,
        'type'              => 'string',
        'sanitize_callback' => 'sanitize_text_field',
    ] );
    register_post_meta( 'pttp_partner', '_pttp_partner_website', [
        'show_in_rest'      => true,
        'single'            => true,
        'type'              => 'string',
        'sanitize_callback' => 'esc_url_raw',
    ] );
    register_post_meta( 'pttp_partner', '_pttp_partner_order', [
        'show_in_rest'      => true,
        'single'            => true,
        'type'              => 'integer',
        'sanitize_callback' => 'absint',
    ] );

    // FAQ meta
    register_post_meta( 'pttp_faq', '_pttp_faq_order', [
        'show_in_rest'      => true,
        'single'            => true,
        'type'              => 'integer',
        'sanitize_callback' => 'absint',
    ] );
}

// ──────────────────────────────────────────────
// 5. Expose Custom Fields to WPGraphQL
// ──────────────────────────────────────────────

add_action( 'graphql_register_types', 'pttp_register_graphql_fields' );

function pttp_register_graphql_fields() {

    // -- Event custom fields --
    register_graphql_object_type( 'EventFields', [
        'description' => 'Custom fields for events',
        'fields'      => [
            'eventDate' => [ 'type' => 'String', 'description' => 'Event date (YYYY-MM-DD)' ],
            'eventTime' => [ 'type' => 'String', 'description' => 'Event time (HH:MM)' ],
            'location'  => [ 'type' => 'String', 'description' => 'Event location' ],
            'eventUrl'  => [ 'type' => 'String', 'description' => 'External event URL' ],
        ],
    ] );

    register_graphql_field( 'Event', 'eventFields', [
        'type'        => 'EventFields',
        'description' => 'Event custom fields',
        'resolve'     => function( $post ) {
            $id = $post->databaseId;
            return [
                'eventDate' => get_post_meta( $id, '_pttp_event_date', true ) ?: null,
                'eventTime' => get_post_meta( $id, '_pttp_event_time', true ) ?: null,
                'location'  => get_post_meta( $id, '_pttp_event_location', true ) ?: null,
                'eventUrl'  => get_post_meta( $id, '_pttp_event_url', true ) ?: null,
            ];
        },
    ] );

    // -- Partner custom fields --
    register_graphql_object_type( 'PartnerFields', [
        'description' => 'Custom fields for partners',
        'fields'      => [
            'shortName'  => [ 'type' => 'String', 'description' => 'Short display name' ],
            'websiteUrl' => [ 'type' => 'String', 'description' => 'Partner website URL' ],
            'order'      => [ 'type' => 'Int',    'description' => 'Display order' ],
        ],
    ] );

    register_graphql_field( 'Partner', 'partnerFields', [
        'type'        => 'PartnerFields',
        'description' => 'Partner custom fields',
        'resolve'     => function( $post ) {
            $id = $post->databaseId;
            $order = get_post_meta( $id, '_pttp_partner_order', true );
            return [
                'shortName'  => get_post_meta( $id, '_pttp_partner_short_name', true ) ?: null,
                'websiteUrl' => get_post_meta( $id, '_pttp_partner_website', true ) ?: null,
                'order'      => $order !== '' ? intval( $order ) : 0,
            ];
        },
    ] );

    // -- FAQ custom fields --
    register_graphql_field( 'Faq', 'faqOrder', [
        'type'        => 'Int',
        'description' => 'Display order for FAQ',
        'resolve'     => function( $post ) {
            $order = get_post_meta( $post->databaseId, '_pttp_faq_order', true );
            return $order !== '' ? intval( $order ) : 0;
        },
    ] );
}

// ──────────────────────────────────────────────
// 6. Admin Columns (Events, Partners, FAQs)
// ──────────────────────────────────────────────

// -- Event columns --
add_filter( 'manage_pttp_event_posts_columns', 'pttp_event_columns' );

function pttp_event_columns( $columns ) {
    $new = [];
    foreach ( $columns as $key => $label ) {
        $new[ $key ] = $label;
        if ( $key === 'title' ) {
            $new['event_date']     = 'Event Date';
            $new['event_location'] = 'Location';
        }
    }
    return $new;
}

add_action( 'manage_pttp_event_posts_custom_column', 'pttp_event_column_content', 10, 2 );

function pttp_event_column_content( $column, $post_id ) {
    if ( $column === 'event_date' ) {
        $date = get_post_meta( $post_id, '_pttp_event_date', true );
        $time = get_post_meta( $post_id, '_pttp_event_time', true );
        echo esc_html( $date ? $date . ( $time ? ' ' . $time : '' ) : '—' );
    }
    if ( $column === 'event_location' ) {
        echo esc_html( get_post_meta( $post_id, '_pttp_event_location', true ) ?: '—' );
    }
}

// -- Partner columns --
add_filter( 'manage_pttp_partner_posts_columns', 'pttp_partner_columns' );

function pttp_partner_columns( $columns ) {
    $new = [];
    foreach ( $columns as $key => $label ) {
        $new[ $key ] = $label;
        if ( $key === 'title' ) {
            $new['partner_short_name'] = 'Short Name';
            $new['partner_order']      = 'Order';
        }
    }
    return $new;
}

add_action( 'manage_pttp_partner_posts_custom_column', 'pttp_partner_column_content', 10, 2 );

function pttp_partner_column_content( $column, $post_id ) {
    if ( $column === 'partner_short_name' ) {
        echo esc_html( get_post_meta( $post_id, '_pttp_partner_short_name', true ) ?: '—' );
    }
    if ( $column === 'partner_order' ) {
        echo esc_html( get_post_meta( $post_id, '_pttp_partner_order', true ) ?: '0' );
    }
}

// -- FAQ columns --
add_filter( 'manage_pttp_faq_posts_columns', 'pttp_faq_columns' );

function pttp_faq_columns( $columns ) {
    $new = [];
    foreach ( $columns as $key => $label ) {
        $new[ $key ] = $label;
        if ( $key === 'title' ) {
            $new['faq_order'] = 'Order';
        }
    }
    return $new;
}

add_action( 'manage_pttp_faq_posts_custom_column', 'pttp_faq_column_content', 10, 2 );

function pttp_faq_column_content( $column, $post_id ) {
    if ( $column === 'faq_order' ) {
        echo esc_html( get_post_meta( $post_id, '_pttp_faq_order', true ) ?: '0' );
    }
}

// ──────────────────────────────────────────────
// 7. WPGraphQL Dependency Notice
// ──────────────────────────────────────────────

add_action( 'admin_notices', 'pttp_check_wpgraphql' );

function pttp_check_wpgraphql() {
    if ( ! class_exists( 'WPGraphQL' ) ) {
        echo '<div class="notice notice-warning"><p><strong>PTTP Custom Post Types</strong> requires the <a href="https://www.wpgraphql.com/" target="_blank">WPGraphQL</a> plugin for full functionality.</p></div>';
    }
}

// ──────────────────────────────────────────────
// 8. Flush Rewrite Rules on Activation
// ──────────────────────────────────────────────

register_activation_hook( __FILE__, 'pttp_activate' );

function pttp_activate() {
    pttp_register_post_types();
    flush_rewrite_rules();
}

register_deactivation_hook( __FILE__, 'pttp_deactivate' );

function pttp_deactivate() {
    flush_rewrite_rules();
}
