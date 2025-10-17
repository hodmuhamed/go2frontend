<?php
/**
 * Renders the custom admin pages for Euroexpress integration.
 */
class Euroexpress_QD_Admin_Pages {
    /**
     * Initializes hooks.
     */
    public static function init() {
        add_action( 'admin_menu', array( __CLASS__, 'register_menu' ) );
        add_action( 'admin_post_euroexpress_qd_refresh_data', array( __CLASS__, 'handle_refresh_data' ) );
        add_action( 'admin_post_euroexpress_qd_create_shipment', array( __CLASS__, 'handle_create_shipment' ) );
        add_action( 'admin_post_euroexpress_qd_track_shipment', array( __CLASS__, 'handle_track_shipment' ) );
    }

    /**
     * Registers menu pages.
     */
    public static function register_menu() {
        add_menu_page(
            __( 'Euroexpress Delivery', 'euroexpress-quick-delivery' ),
            __( 'Euroexpress', 'euroexpress-quick-delivery' ),
            'manage_options',
            'euroexpress-quick-delivery',
            array( __CLASS__, 'render_locations_page' ),
            'dashicons-admin-site'
        );

        add_submenu_page(
            'euroexpress-quick-delivery',
            __( 'Cached Cities & Locations', 'euroexpress-quick-delivery' ),
            __( 'Cached Data', 'euroexpress-quick-delivery' ),
            'manage_options',
            'euroexpress-quick-delivery',
            array( __CLASS__, 'render_locations_page' )
        );

        add_submenu_page(
            'euroexpress-quick-delivery',
            __( 'Create Shipment', 'euroexpress-quick-delivery' ),
            __( 'Create Shipment', 'euroexpress-quick-delivery' ),
            'manage_options',
            'euroexpress-quick-delivery-create',
            array( __CLASS__, 'render_create_shipment_page' )
        );

        add_submenu_page(
            'euroexpress-quick-delivery',
            __( 'Track Shipments', 'euroexpress-quick-delivery' ),
            __( 'Track Shipments', 'euroexpress-quick-delivery' ),
            'manage_options',
            'euroexpress-quick-delivery-track',
            array( __CLASS__, 'render_track_shipment_page' )
        );
    }

    /**
     * Handles refreshing cached data.
     */
    public static function handle_refresh_data() {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'You do not have permission to perform this action.', 'euroexpress-quick-delivery' ) );
        }

        check_admin_referer( 'euroexpress_qd_refresh_data' );

        if ( isset( $_POST['refresh_cities'] ) ) {
            $response = Euroexpress_QD_API_Service::get_cities();
            if ( ! $response['error'] ) {
                update_option( 'euroexpress_qd_cached_cities', $response['data'] );
                add_settings_error( 'euroexpress_qd_messages', 'cities-refreshed', __( 'Cities cache updated.', 'euroexpress-quick-delivery' ), 'updated' );
            } else {
                add_settings_error( 'euroexpress_qd_messages', 'cities-error', $response['message'], 'error' );
            }
        }

        if ( isset( $_POST['refresh_locations'] ) ) {
            $response = Euroexpress_QD_API_Service::get_locations();
            if ( ! $response['error'] ) {
                update_option( 'euroexpress_qd_cached_locations', $response['data'] );
                add_settings_error( 'euroexpress_qd_messages', 'locations-refreshed', __( 'Locations cache updated.', 'euroexpress-quick-delivery' ), 'updated' );
            } else {
                add_settings_error( 'euroexpress_qd_messages', 'locations-error', $response['message'], 'error' );
            }
        }

        wp_safe_redirect( wp_get_referer() );
        exit;
    }

    /**
     * Handles shipment creation submission.
     */
    public static function handle_create_shipment() {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'You do not have permission to perform this action.', 'euroexpress-quick-delivery' ) );
        }

        check_admin_referer( 'euroexpress_qd_create_shipment' );

        $shipment = array(
            'sender'    => array(
                'name'    => sanitize_text_field( wp_unslash( $_POST['sender_name'] ) ),
                'address' => sanitize_text_field( wp_unslash( $_POST['sender_address'] ) ),
                'city'    => sanitize_text_field( wp_unslash( $_POST['sender_city'] ) ),
            ),
            'recipient' => array(
                'name'    => sanitize_text_field( wp_unslash( $_POST['recipient_name'] ) ),
                'address' => sanitize_text_field( wp_unslash( $_POST['recipient_address'] ) ),
                'city'    => sanitize_text_field( wp_unslash( $_POST['recipient_city'] ) ),
            ),
            'package'   => array(
                'weight' => isset( $_POST['package_weight'] ) ? floatval( wp_unslash( $_POST['package_weight'] ) ) : 0,
                'units'  => 'kg',
            ),
            'reference' => sanitize_text_field( wp_unslash( $_POST['reference_number'] ) ),
        );

        $preannounce = Euroexpress_QD_API_Service::preannounce_shipment( $shipment );
        if ( $preannounce['error'] ) {
            add_settings_error( 'euroexpress_qd_messages', 'preannounce-error', $preannounce['message'], 'error' );
            wp_safe_redirect( wp_get_referer() );
            exit;
        }

        $announce = Euroexpress_QD_API_Service::announce_shipment( array_merge( $shipment, array( 'preannounce' => $preannounce['data'] ) ) );
        if ( $announce['error'] ) {
            add_settings_error( 'euroexpress_qd_messages', 'announce-error', $announce['message'], 'error' );
            wp_safe_redirect( wp_get_referer() );
            exit;
        }

        add_settings_error( 'euroexpress_qd_messages', 'shipment-success', __( 'Shipment announced successfully.', 'euroexpress-quick-delivery' ), 'updated' );

        if ( isset( $_POST['request_label'] ) ) {
            $print = Euroexpress_QD_API_Service::print_shipment( array( 'reference' => $shipment['reference'] ) );
            if ( $print['error'] ) {
                add_settings_error( 'euroexpress_qd_messages', 'print-error', $print['message'], 'error' );
            } else {
                set_transient( 'euroexpress_qd_last_label', $print['raw_body'], MINUTE_IN_SECONDS * 30 );
            }
        }

        wp_safe_redirect( wp_get_referer() );
        exit;
    }

    /**
     * Handles tracking form submission.
     */
    public static function handle_track_shipment() {
        if ( ! current_user_can( 'manage_options' ) ) {
            wp_die( esc_html__( 'You do not have permission to perform this action.', 'euroexpress-quick-delivery' ) );
        }

        check_admin_referer( 'euroexpress_qd_track_shipment' );

        $params = array();
        if ( ! empty( $_POST['tracking_code'] ) ) {
            $params['code'] = sanitize_text_field( wp_unslash( $_POST['tracking_code'] ) );
        }

        if ( ! empty( $_POST['reference_number'] ) ) {
            $params['reference'] = sanitize_text_field( wp_unslash( $_POST['reference_number'] ) );
        }

        $response = Euroexpress_QD_API_Service::get_shipment_status( $params );
        if ( $response['error'] ) {
            set_transient( 'euroexpress_qd_tracking_result', array( 'error' => true, 'message' => $response['message'] ), MINUTE_IN_SECONDS * 5 );
        } else {
            set_transient( 'euroexpress_qd_tracking_result', array( 'error' => false, 'data' => $response['data'] ), MINUTE_IN_SECONDS * 5 );
        }

        wp_safe_redirect( wp_get_referer() );
        exit;
    }

    /**
     * Outputs the cached data page.
     */
    public static function render_locations_page() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        $cities    = get_option( 'euroexpress_qd_cached_cities', array() );
        $locations = get_option( 'euroexpress_qd_cached_locations', array() );

        settings_errors( 'euroexpress_qd_messages' );
        ?>
        <div class="wrap">
            <h1><?php esc_html_e( 'Cached Cities and Locations', 'euroexpress-quick-delivery' ); ?></h1>
            <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                <?php wp_nonce_field( 'euroexpress_qd_refresh_data' ); ?>
                <input type="hidden" name="action" value="euroexpress_qd_refresh_data" />
                <p>
                    <button type="submit" name="refresh_cities" class="button button-primary"><?php esc_html_e( 'Refresh Cities', 'euroexpress-quick-delivery' ); ?></button>
                    <button type="submit" name="refresh_locations" class="button"><?php esc_html_e( 'Refresh Locations', 'euroexpress-quick-delivery' ); ?></button>
                </p>
            </form>

            <h2><?php esc_html_e( 'Cities', 'euroexpress-quick-delivery' ); ?></h2>
            <table class="widefat striped">
                <thead>
                    <tr>
                        <th><?php esc_html_e( 'Name', 'euroexpress-quick-delivery' ); ?></th>
                        <th><?php esc_html_e( 'Code', 'euroexpress-quick-delivery' ); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ( ! empty( $cities ) ) : ?>
                        <?php foreach ( $cities as $city ) : ?>
                            <tr>
                                <td><?php echo isset( $city['name'] ) ? esc_html( $city['name'] ) : ''; ?></td>
                                <td><?php echo isset( $city['code'] ) ? esc_html( $city['code'] ) : ''; ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else : ?>
                        <tr>
                            <td colspan="2"><?php esc_html_e( 'No cached cities found. Refresh to fetch data.', 'euroexpress-quick-delivery' ); ?></td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>

            <h2><?php esc_html_e( 'Locations', 'euroexpress-quick-delivery' ); ?></h2>
            <table class="widefat striped">
                <thead>
                    <tr>
                        <th><?php esc_html_e( 'Name', 'euroexpress-quick-delivery' ); ?></th>
                        <th><?php esc_html_e( 'City', 'euroexpress-quick-delivery' ); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ( ! empty( $locations ) ) : ?>
                        <?php foreach ( $locations as $location ) : ?>
                            <tr>
                                <td><?php echo isset( $location['name'] ) ? esc_html( $location['name'] ) : ''; ?></td>
                                <td><?php echo isset( $location['city'] ) ? esc_html( $location['city'] ) : ''; ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else : ?>
                        <tr>
                            <td colspan="2"><?php esc_html_e( 'No cached locations found. Refresh to fetch data.', 'euroexpress-quick-delivery' ); ?></td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
        <?php
    }

    /**
     * Outputs the create shipment page.
     */
    public static function render_create_shipment_page() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        settings_errors( 'euroexpress_qd_messages' );
        $last_label = get_transient( 'euroexpress_qd_last_label' );
        ?>
        <div class="wrap">
            <h1><?php esc_html_e( 'Create Shipment', 'euroexpress-quick-delivery' ); ?></h1>
            <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                <?php wp_nonce_field( 'euroexpress_qd_create_shipment' ); ?>
                <input type="hidden" name="action" value="euroexpress_qd_create_shipment" />
                <h2><?php esc_html_e( 'Sender Details', 'euroexpress-quick-delivery' ); ?></h2>
                <table class="form-table">
                    <tr>
                        <th scope="row"><?php esc_html_e( 'Name', 'euroexpress-quick-delivery' ); ?></th>
                        <td><input type="text" name="sender_name" class="regular-text" required /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php esc_html_e( 'Address', 'euroexpress-quick-delivery' ); ?></th>
                        <td><input type="text" name="sender_address" class="regular-text" required /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php esc_html_e( 'City', 'euroexpress-quick-delivery' ); ?></th>
                        <td><input type="text" name="sender_city" class="regular-text" required /></td>
                    </tr>
                </table>

                <h2><?php esc_html_e( 'Recipient Details', 'euroexpress-quick-delivery' ); ?></h2>
                <table class="form-table">
                    <tr>
                        <th scope="row"><?php esc_html_e( 'Name', 'euroexpress-quick-delivery' ); ?></th>
                        <td><input type="text" name="recipient_name" class="regular-text" required /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php esc_html_e( 'Address', 'euroexpress-quick-delivery' ); ?></th>
                        <td><input type="text" name="recipient_address" class="regular-text" required /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php esc_html_e( 'City', 'euroexpress-quick-delivery' ); ?></th>
                        <td><input type="text" name="recipient_city" class="regular-text" required /></td>
                    </tr>
                </table>

                <h2><?php esc_html_e( 'Package Details', 'euroexpress-quick-delivery' ); ?></h2>
                <table class="form-table">
                    <tr>
                        <th scope="row"><?php esc_html_e( 'Weight (kg)', 'euroexpress-quick-delivery' ); ?></th>
                        <td><input type="number" min="0" step="0.1" name="package_weight" class="regular-text" required /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php esc_html_e( 'Reference Number', 'euroexpress-quick-delivery' ); ?></th>
                        <td><input type="text" name="reference_number" class="regular-text" required /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php esc_html_e( 'Request Label', 'euroexpress-quick-delivery' ); ?></th>
                        <td><label><input type="checkbox" name="request_label" value="1" /> <?php esc_html_e( 'Retrieve printable shipment label after announcing.', 'euroexpress-quick-delivery' ); ?></label></td>
                    </tr>
                </table>

                <?php submit_button( __( 'Create Shipment', 'euroexpress-quick-delivery' ) ); ?>
            </form>

            <?php if ( $last_label ) : ?>
                <h2><?php esc_html_e( 'Latest Label (Base64)', 'euroexpress-quick-delivery' ); ?></h2>
                <textarea readonly rows="5" class="large-text code"><?php echo esc_textarea( $last_label ); ?></textarea>
            <?php endif; ?>
        </div>
        <?php
    }

    /**
     * Outputs the tracking page.
     */
    public static function render_track_shipment_page() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        settings_errors( 'euroexpress_qd_messages' );
        $result = get_transient( 'euroexpress_qd_tracking_result' );
        delete_transient( 'euroexpress_qd_tracking_result' );
        ?>
        <div class="wrap">
            <h1><?php esc_html_e( 'Track Shipments', 'euroexpress-quick-delivery' ); ?></h1>
            <form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
                <?php wp_nonce_field( 'euroexpress_qd_track_shipment' ); ?>
                <input type="hidden" name="action" value="euroexpress_qd_track_shipment" />
                <table class="form-table">
                    <tr>
                        <th scope="row"><?php esc_html_e( 'Tracking Code', 'euroexpress-quick-delivery' ); ?></th>
                        <td><input type="text" name="tracking_code" class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><?php esc_html_e( 'Reference Number', 'euroexpress-quick-delivery' ); ?></th>
                        <td><input type="text" name="reference_number" class="regular-text" /></td>
                    </tr>
                </table>
                <?php submit_button( __( 'Track Shipment', 'euroexpress-quick-delivery' ) ); ?>
            </form>

            <?php if ( $result ) : ?>
                <h2><?php esc_html_e( 'Tracking Result', 'euroexpress-quick-delivery' ); ?></h2>
                <?php if ( $result['error'] ) : ?>
                    <p class="notice notice-error"><?php echo esc_html( $result['message'] ); ?></p>
                <?php else : ?>
                    <pre class="notice notice-success"><?php echo esc_html( wp_json_encode( $result['data'], JSON_PRETTY_PRINT ) ); ?></pre>
                <?php endif; ?>
            <?php endif; ?>
        </div>
        <?php
    }
}
