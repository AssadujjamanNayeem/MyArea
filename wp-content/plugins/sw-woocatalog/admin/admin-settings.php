<?php 
/**
* Admin Settings for SW WooCommerce Catalog
**/

include( 'class-contact-table.php' );
include( 'admin-list-contact.php' );
include( 'admin-list-contact-table.php' );

class SW_Woocatalog_Admin_Settings{
	public static function init(){
		add_filter( 'woocommerce_settings_tabs_array', __CLASS__ . '::add_settings_tab', 50 );
		add_action( 'woocommerce_settings_tabs_settings_sw_woocatalog', __CLASS__ . '::settings_tab' );
		add_action( 'woocommerce_update_options_settings_sw_woocatalog', __CLASS__ . '::update_settings' );
		
	}
	
	public static function sw_woocatalog_admin_script(){
		global $post_type;	
		if( 'product' == $post_type ){
			wp_enqueue_script( 'swatches_admin_js', CMURL . '/js/admin/swatches-admin.js' , array(), null, true );
			wp_enqueue_style( 'swatches_admin_style', CMURL . '/css/admin/woocatalog-style.css' , array(), null );
			wp_enqueue_script('category_color_picker_js', CMURL . '/js/admin/category_color_picker.js', array( 'wp-color-picker' ), false, true);
		}
	}
	
	/**
		* Add a new settings tab to the WooCommerce settings tabs array.
		*
		* @param array $settings_tabs Array of WooCommerce setting tabs & their labels, excluding the Subscription tab.
		* @return array $settings_tabs Array of WooCommerce setting tabs & their labels, including the Subscription tab.
	*/
	public static function add_settings_tab($settings_tabs ) {
		$settings_tabs['settings_sw_woocatalog'] = __( 'Sw Woocatalog', 'sw-woocatalog' );
		return $settings_tabs;
	}
	
	/**
		* Uses the WooCommerce admin fields API to output settings via the @see woocommerce_admin_fields() function.
		*
		* @uses woocommerce_admin_fields()
		* @uses self::get_settings()
	*/
	public static function settings_tab(){
		woocommerce_admin_fields( self::get_settings() );
	}
	
	/**
	 * Uses the WooCommerce options API to save settings via the @see woocommerce_update_options() function.
	 *
	 * @uses woocommerce_update_options()
	 * @uses self::get_settings()
	*/
	public static function update_settings() {
		woocommerce_update_options( self::get_settings() );			
	}
	
	/**
	* Declare option for Sw Woocatalog Settings
	**/
	public static function get_settings(){
		$settings = array(
			'section_title' => array(
				'name'     => __( 'SW WooCommerce Catalog Settings', 'sw-woocatalog' ),
				'type'     => 'title',
				'desc'     => '',
				'id'       => 'wc_setting_section_title'
			),
			
			array(
				'title'         => __( 'Enable Catalog Mode', 'sw-woocatalog' ),
				'desc'          => __( 'Uncheck this checkbox to disable WooCommerce Catalog Mode', 'sw-woocatalog' ),
				'id'            => 'sw_woocatalog_enable',
				'default'       => 'yes',
				'type'          => 'checkbox',
				'autoload'      => true,
			),
			
			/* array(
				'title'         => __( 'Enable Catalog Listing', 'sw-woocatalog' ),
				'desc'          => __( 'Check this field to enable catalog on product listing.', 'sw-woocatalog' ),
				'id'            => 'sw_woocatalog_enable_listing',
				'default'       => 'no',
				'type'          => 'checkbox',
			), */
			
			array(
				'title'         => __( 'Disbled Review', 'sw-woocatalog' ),
				'desc'          => __( 'Uncheck this checkbox to disable review', 'sw-woocatalog' ),
				'id'            => 'sw_woocatalog_review_disable',
				'default'       => 'yes',
				'type'          => 'checkbox',
				'autoload'      => false,
			),
			
			array( 'type' => 'sectionend', 'id' => 'wc_setting_section_endpoint' ),
		);
		return apply_filters( 'sw_woocatalog_settings', $settings );
	}
	
	/**
		* Uses the WooCommerce admin fields API to output settings via the @see woocommerce_product_data_tabs() function.
	*/
	public static function add_woocatalog_product_data_tab( $product_data_tabs ){
		
		$product_data_tabs['sw-woocatalog'] = array(
			'label' => __( 'Sw Woocatalog', 'sw-woocatalog' ),
			'target' => 'sw_woocatalog_data',
			'priority' => 999,
			'class'    => array( 'show_if_variable' ),
		);
		return $product_data_tabs;
	}
}

SW_Woocatalog_Admin_Settings::init();