<?php 
/**
 * Plugin Name: Sw Woocommerce Catalog Mode
 * Plugin URI: http://www.wpthemego.com/
 * Description: A plugin help to display your woocommerce site as a catalog site.
 * Version: 1.0.2
 * Author: wpthemego
 * Author URI: http://www.wpthemego.com/
 * Requires at least: 4.1
 * Tested up to: WorPress 5.4.x and WooCommerce 4.1.x
 * WC tested up to: 4.1.0
 * Text Domain: sw-woocatalog
 * Domain Path: /languages/
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

if ( ! defined( 'CMFILE' ) ) {
	define( 'CMFILE', __FILE__ );
}

// define plugin path
if ( ! defined( 'CMPATH' ) ) {
	define( 'CMPATH', plugin_dir_path( __FILE__ ) );
}

// define plugin URL
if ( ! defined( 'CMURL' ) ) {
	define( 'CMURL', plugins_url(). '/sw-woocatalog' );
}

// define plugin theme path
if ( ! defined( 'CMTHEME' ) ) {
	define( 'CMTHEME', plugin_dir_path( __FILE__ ). 'includes/templates' );
}

require_once( CMPATH . '/admin/admin-settings.php' );
require_once( CMPATH . '/includes/functions.php' );

function sw_woocatalog_construct(){
	global $woocommerce;

	if ( ! isset( $woocommerce ) || ! function_exists( 'WC' ) ) {
		add_action( 'admin_notices', 'sw_woocatalog_admin_notice' );
		return;
	}
	
	/* Enqueue Script */
	add_action( 'wp_enqueue_scripts', 'sw_woocatalog_custom_script', 99 );
	
	/* Load text domain */
	load_plugin_textdomain( 'sw-woocatalog', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' ); 
}

add_action( 'plugins_loaded', 'sw_woocatalog_construct', 20 );


/*
** Load admin notice when WooCommerce not active
*/
function sw_woocatalog_admin_notice(){
	?>
	<div class="error">
		<p><?php _e( 'Sw WooCommerce Catalog is enabled but not effective. It requires WooCommerce in order to work.', 'sw-woocatalog' ); ?></p>
	</div>
<?php
}

function sw_woocatalog_custom_script(){
	wp_enqueue_style( 'sw-woocatalog', plugins_url('css/style.css', __FILE__) );
	if( is_singular( 'product' ) ){
		$args = array(
			'ajaxurl' => admin_url( 'admin-ajax.php', 'relative' )
		);
		wp_enqueue_script( 'google-captcha', esc_url( '//www.google.com/recaptcha/api.js' ),array(), null, true );	
		wp_register_script( 'woocatalog', plugins_url( 'js/woocatalog.js', __FILE__ ),array(), null, true );		
		wp_localize_script( 'woocatalog', 'woocatalog', $args );
		wp_enqueue_script( 'woocatalog' );
	}
}
