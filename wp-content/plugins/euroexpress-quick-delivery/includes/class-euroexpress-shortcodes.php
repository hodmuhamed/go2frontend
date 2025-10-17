<?php
/**
 * Declares the public tracking shortcode.
 */
class Euroexpress_QD_Shortcodes {
    /**
     * Initializes hooks.
     */
    public static function init() {
        add_shortcode( 'euroexpress_tracking', array( __CLASS__, 'render_tracking_shortcode' ) );
        add_action( 'init', array( __CLASS__, 'handle_public_tracking_form' ) );
    }

    /**
     * Handles public tracking form submissions.
     */
    public static function handle_public_tracking_form() {
        if ( 'POST' !== $_SERVER['REQUEST_METHOD'] ) {
            return;
        }

        if ( empty( $_POST['euroexpress_qd_public_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['euroexpress_qd_public_nonce'] ) ), 'euroexpress_qd_public_tracking' ) ) {
            return;
        }

        $code      = isset( $_POST['tracking_code'] ) ? sanitize_text_field( wp_unslash( $_POST['tracking_code'] ) ) : '';
        $reference = isset( $_POST['reference_number'] ) ? sanitize_text_field( wp_unslash( $_POST['reference_number'] ) ) : '';

        if ( empty( $code ) && empty( $reference ) ) {
            set_transient( 'euroexpress_qd_public_tracking', array( 'error' => true, 'message' => __( 'Please provide a tracking code or reference number.', 'euroexpress-quick-delivery' ) ), MINUTE_IN_SECONDS * 5 );
            return;
        }

        $params = array();
        if ( ! empty( $code ) ) {
            $params['code'] = $code;
        }
        if ( ! empty( $reference ) ) {
            $params['reference'] = $reference;
        }

        $response = Euroexpress_QD_API_Service::get_shipment_status( $params );
        if ( $response['error'] ) {
            set_transient( 'euroexpress_qd_public_tracking', array( 'error' => true, 'message' => $response['message'] ), MINUTE_IN_SECONDS * 5 );
        } else {
            set_transient( 'euroexpress_qd_public_tracking', array( 'error' => false, 'data' => $response['data'] ), MINUTE_IN_SECONDS * 5 );
        }

        wp_safe_redirect( wp_get_referer() ? wp_get_referer() : home_url() );
        exit;
    }

    /**
     * Renders the shortcode output.
     *
     * @return string
     */
    public static function render_tracking_shortcode() {
        ob_start();
        $results = get_transient( 'euroexpress_qd_public_tracking' );
        delete_transient( 'euroexpress_qd_public_tracking' );
        ?>
        <form method="post" class="euroexpress-tracking-form">
            <?php wp_nonce_field( 'euroexpress_qd_public_tracking', 'euroexpress_qd_public_nonce' ); ?>
            <p>
                <label>
                    <?php esc_html_e( 'Tracking Code', 'euroexpress-quick-delivery' ); ?>
                    <input type="text" name="tracking_code" />
                </label>
            </p>
            <p>
                <label>
                    <?php esc_html_e( 'Reference Number', 'euroexpress-quick-delivery' ); ?>
                    <input type="text" name="reference_number" />
                </label>
            </p>
            <p>
                <button type="submit"><?php esc_html_e( 'Track Shipment', 'euroexpress-quick-delivery' ); ?></button>
            </p>
        </form>

        <?php if ( $results ) : ?>
            <div class="euroexpress-tracking-results">
                <?php if ( $results['error'] ) : ?>
                    <p class="euroexpress-error"><?php echo esc_html( $results['message'] ); ?></p>
                <?php else : ?>
                    <pre class="euroexpress-success"><?php echo esc_html( wp_json_encode( $results['data'], JSON_PRETTY_PRINT ) ); ?></pre>
                <?php endif; ?>
            </div>
        <?php endif; ?>
        <?php
        return ob_get_clean();
    }
}
