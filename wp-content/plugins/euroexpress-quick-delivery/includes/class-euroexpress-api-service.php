<?php
/**
 * Euroexpress API service for making authenticated requests.
 */
class Euroexpress_QD_API_Service {
    /**
     * Base URLs for the Euroexpress environments.
     *
     * @var array
     */
    protected static $base_urls = array(
        'test'       => 'https://test-api.euroexpress.ba',
        'production' => 'https://api.euroexpress.ba',
    );

    /**
     * Performs an authenticated request against the Euroexpress API.
     *
     * @param string $endpoint API endpoint to call.
     * @param string $method   HTTP method.
     * @param array  $body     Optional body parameters.
     *
     * @return array
     */
    public static function request( $endpoint, $method = 'GET', $body = array() ) {
        $settings = get_option( 'euroexpress_qd_settings', array() );

        $environment = isset( $settings['environment'] ) && isset( self::$base_urls[ $settings['environment'] ] )
            ? $settings['environment']
            : 'test';

        $username = isset( $settings['username'] ) ? $settings['username'] : '';
        $password = isset( $settings['password'] ) ? $settings['password'] : '';

        $base_url = trailingslashit( self::$base_urls[ $environment ] );
        $url      = $base_url . ltrim( $endpoint, '/' );

        $args = array(
            'headers' => array(
                'Authorization' => 'Basic ' . base64_encode( $username . ':' . $password ),
                'Accept'        => 'application/json',
                'Content-Type'  => 'application/json',
            ),
            'body'    => ! empty( $body ) ? wp_json_encode( $body ) : null,
            'method'  => strtoupper( $method ),
            'timeout' => 20,
        );

        if ( 'GET' === $args['method'] ) {
            unset( $args['body'] );
        }

        $response = wp_remote_request( $url, $args );

        if ( is_wp_error( $response ) ) {
            return array(
                'error'   => true,
                'message' => $response->get_error_message(),
            );
        }

        $status_code = wp_remote_retrieve_response_code( $response );
        $body_raw    = wp_remote_retrieve_body( $response );
        $data        = json_decode( $body_raw, true );

        if ( $status_code >= 400 ) {
            return array(
                'error'   => true,
                'message' => isset( $data['message'] ) ? $data['message'] : __( 'Unexpected API error.', 'euroexpress-quick-delivery' ),
                'code'    => $status_code,
                'data'    => $data,
            );
        }

        return array(
            'error'    => false,
            'code'     => $status_code,
            'data'     => $data,
            'raw_body' => $body_raw,
        );
    }

    /**
     * Fetches all cities.
     *
     * @return array
     */
    public static function get_cities() {
        return self::request( '/basic/cities', 'GET' );
    }

    /**
     * Fetches all locations.
     *
     * @return array
     */
    public static function get_locations() {
        return self::request( '/basic/locations', 'GET' );
    }

    /**
     * Fetches shipment status by code or reference.
     *
     * @param array $params Request parameters.
     *
     * @return array
     */
    public static function get_shipment_status( $params ) {
        return self::request( '/shipment/status', 'POST', $params );
    }

    /**
     * Creates a shipment preannouncement.
     *
     * @param array $shipment Shipment data.
     *
     * @return array
     */
    public static function preannounce_shipment( $shipment ) {
        return self::request( '/shipment/preannounce', 'POST', $shipment );
    }

    /**
     * Announces a shipment.
     *
     * @param array $shipment Shipment data.
     *
     * @return array
     */
    public static function announce_shipment( $shipment ) {
        return self::request( '/shipment/announce', 'POST', $shipment );
    }

    /**
     * Retrieves printable shipment documents.
     *
     * @param array $params Request parameters.
     *
     * @return array
     */
    public static function print_shipment( $params ) {
        return self::request( '/shipment/print', 'POST', $params );
    }
}
