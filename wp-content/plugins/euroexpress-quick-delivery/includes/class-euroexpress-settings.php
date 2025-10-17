<?php
/**
 * Handles plugin settings registration and rendering.
 */
class Euroexpress_QD_Settings {
    /**
     * Initializes hooks.
     */
    public static function init() {
        add_action( 'admin_menu', array( __CLASS__, 'register_settings_page' ) );
        add_action( 'admin_init', array( __CLASS__, 'register_settings' ) );
    }

    /**
     * Registers the plugin settings page.
     */
    public static function register_settings_page() {
        add_options_page(
            __( 'Euroexpress Settings', 'euroexpress-quick-delivery' ),
            __( 'Euroexpress Settings', 'euroexpress-quick-delivery' ),
            'manage_options',
            'euroexpress-quick-delivery-settings',
            array( __CLASS__, 'render_settings_page' )
        );
    }

    /**
     * Registers settings and sections.
     */
    public static function register_settings() {
        register_setting( 'euroexpress_qd_settings_group', 'euroexpress_qd_settings', array( __CLASS__, 'sanitize_settings' ) );

        add_settings_section(
            'euroexpress_qd_credentials',
            __( 'Credentials', 'euroexpress-quick-delivery' ),
            '__return_false',
            'euroexpress-quick-delivery-settings'
        );

        add_settings_field(
            'euroexpress_qd_username',
            __( 'Username', 'euroexpress-quick-delivery' ),
            array( __CLASS__, 'render_username_field' ),
            'euroexpress-quick-delivery-settings',
            'euroexpress_qd_credentials'
        );

        add_settings_field(
            'euroexpress_qd_password',
            __( 'Password', 'euroexpress-quick-delivery' ),
            array( __CLASS__, 'render_password_field' ),
            'euroexpress-quick-delivery-settings',
            'euroexpress_qd_credentials'
        );

        add_settings_field(
            'euroexpress_qd_environment',
            __( 'Environment', 'euroexpress-quick-delivery' ),
            array( __CLASS__, 'render_environment_field' ),
            'euroexpress-quick-delivery-settings',
            'euroexpress_qd_credentials'
        );
    }

    /**
     * Sanitizes the settings values.
     *
     * @param array $settings Raw settings.
     *
     * @return array
     */
    public static function sanitize_settings( $settings ) {
        $sanitized = array(
            'username'    => isset( $settings['username'] ) ? sanitize_text_field( $settings['username'] ) : '',
            'password'    => isset( $settings['password'] ) ? sanitize_text_field( $settings['password'] ) : '',
            'environment' => isset( $settings['environment'] ) && in_array( $settings['environment'], array( 'test', 'production' ), true ) ? $settings['environment'] : 'test',
        );

        return $sanitized;
    }

    /**
     * Outputs the username field.
     */
    public static function render_username_field() {
        $options  = get_option( 'euroexpress_qd_settings', array() );
        $username = isset( $options['username'] ) ? $options['username'] : '';
        printf( '<input type="text" name="euroexpress_qd_settings[username]" value="%s" class="regular-text" />', esc_attr( $username ) );
    }

    /**
     * Outputs the password field.
     */
    public static function render_password_field() {
        $options  = get_option( 'euroexpress_qd_settings', array() );
        $password = isset( $options['password'] ) ? $options['password'] : '';
        printf( '<input type="password" name="euroexpress_qd_settings[password]" value="%s" class="regular-text" autocomplete="new-password" />', esc_attr( $password ) );
    }

    /**
     * Outputs the environment select field.
     */
    public static function render_environment_field() {
        $options      = get_option( 'euroexpress_qd_settings', array() );
        $environment  = isset( $options['environment'] ) ? $options['environment'] : 'test';
        $environments = array(
            'test'       => __( 'Test', 'euroexpress-quick-delivery' ),
            'production' => __( 'Production', 'euroexpress-quick-delivery' ),
        );
        echo '<select name="euroexpress_qd_settings[environment]">';
        foreach ( $environments as $value => $label ) {
            printf( '<option value="%s" %s>%s</option>', esc_attr( $value ), selected( $environment, $value, false ), esc_html( $label ) );
        }
        echo '</select>';
    }

    /**
     * Renders the settings page.
     */
    public static function render_settings_page() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        ?>
        <div class="wrap">
            <h1><?php esc_html_e( 'Euroexpress Quick Delivery Settings', 'euroexpress-quick-delivery' ); ?></h1>
            <form action="options.php" method="post">
                <?php
                settings_fields( 'euroexpress_qd_settings_group' );
                do_settings_sections( 'euroexpress-quick-delivery-settings' );
                submit_button();
                ?>
            </form>
        </div>
        <?php
    }
}
