<?php
/**
 * Plugin Name:       Euroexpress Quick Delivery
 * Description:       Integrates Euroexpress shipping services with WordPress, providing shipment creation and tracking tools.
 * Version:           1.0.0
 * Author:            Your Name
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       euroexpress-quick-delivery
 * Domain Path:       /languages
 */

define( 'EUROEXPRESS_QD_VERSION', '1.0.0' );
define( 'EUROEXPRESS_QD_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'EUROEXPRESS_QD_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

if ( ! class_exists( 'Euroexpress_Quick_Delivery' ) ) {
    /**
     * Main plugin class for wiring all hooks.
     */
    class Euroexpress_Quick_Delivery {
        /**
         * Bootstraps the plugin by adding WordPress hooks.
         */
        public static function init() {
            require_once EUROEXPRESS_QD_PLUGIN_DIR . 'includes/class-euroexpress-settings.php';
            require_once EUROEXPRESS_QD_PLUGIN_DIR . 'includes/class-euroexpress-api-service.php';
            require_once EUROEXPRESS_QD_PLUGIN_DIR . 'includes/class-euroexpress-admin-pages.php';
            require_once EUROEXPRESS_QD_PLUGIN_DIR . 'includes/class-euroexpress-shortcodes.php';

            Euroexpress_QD_Settings::init();
            Euroexpress_QD_Admin_Pages::init();
            Euroexpress_QD_Shortcodes::init();
        }
    }
}

/**
 * Activation callback. Creates default options.
 */
function euroexpress_qd_activate() {
    if ( false === get_option( 'euroexpress_qd_settings' ) ) {
        add_option( 'euroexpress_qd_settings', array(
            'username'    => '',
            'password'    => '',
            'environment' => 'test',
        ) );
    }

    if ( false === get_option( 'euroexpress_qd_cached_cities' ) ) {
        add_option( 'euroexpress_qd_cached_cities', array() );
    }

    if ( false === get_option( 'euroexpress_qd_cached_locations' ) ) {
        add_option( 'euroexpress_qd_cached_locations', array() );
    }
}
register_activation_hook( __FILE__, 'euroexpress_qd_activate' );

/**
 * Deactivation callback. Removes cached data but keeps credentials.
 */
function euroexpress_qd_deactivate() {
    delete_option( 'euroexpress_qd_cached_cities' );
    delete_option( 'euroexpress_qd_cached_locations' );
}
register_deactivation_hook( __FILE__, 'euroexpress_qd_deactivate' );

add_action( 'plugins_loaded', array( 'Euroexpress_Quick_Delivery', 'init' ) );
