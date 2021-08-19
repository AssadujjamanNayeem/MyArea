<?php 
/***** Active Plugin ********/
require_once( get_template_directory().'/lib/class-tgm-plugin-activation.php' );

add_action( 'tgmpa_register', 'revo_register_required_plugins' );
function revo_register_required_plugins() {
    $plugins = array(
		array(
            'name'               => esc_html__( 'WooCommerce', 'revo' ), 
            'slug'               => 'woocommerce', 
            'required'           => true, 
			'version'			 => '4.1.1'
        ),

         array(
            'name'               => esc_html__( 'Revslider', 'revo' ), 
            'slug'               => 'revslider', 
            'source'             => esc_url( get_template_directory_uri() . '/lib/plugins/revslider.zip' ), 
            'required'           => true, 
            'version'            => '6.2.10'
        ),
		
		array(
            'name'     			 => esc_html__( 'SW Core', 'revo' ),
            'slug'      		 => 'sw_core',
			'source'         	 => esc_url( get_template_directory_uri() . '/lib/plugins/sw_core.zip' ), 
            'required'  		 => true,   
			'version'			 => '1.7.2'
		),
		
		array(
            'name'     			 => esc_html__( 'SW WooCommerce', 'revo' ),
            'slug'      		 => 'sw_woocommerce',
			'source'         	 => esc_url( get_template_directory_uri() . '/lib/plugins/sw_woocommerce.zip' ), 
            'required'  		 => true,
			'version'			 => '1.7.1'
        ),
		
		array(
            'name'     			 => esc_html__( 'SW Ajax Woocommerce Search', 'revo' ),
            'slug'      		 => 'sw_ajax_woocommerce_search',
			'source'         	 => esc_url( get_template_directory_uri() . '/lib/plugins/sw_ajax_woocommerce_search.zip' ), 
            'required'  		 => true,
			'version'			 => '1.2.4'
        ),
		
		array(
            'name'     			 => esc_html__( 'SW Wooswatches', 'revo' ),
            'slug'      		 => 'sw_wooswatches',
			'source'         	 => esc_url( get_template_directory_uri() . '/lib/plugins/sw_wooswatches.zip' ), 
            'required'  		 => true,
			'version'			 => '1.0.12'
        ),

        array(
            'name'               => esc_html__( 'Sw Product Bundles', 'revo' ),
            'slug'               => 'sw-product-bundles',
            'source'             => esc_url( get_template_directory_uri() . '/lib/plugins/sw-product-bundles.zip' ), 
            'required'           => true,
            'version'            => '2.0.21'
        ), 
		
        array(
            'name'               => esc_html__( 'Sw WooCommerce Catalog Mode', 'revo' ),
            'slug'               => 'sw-woocatalog',
            'source'             => esc_url( get_template_directory_uri() . '/lib/plugins/sw-woocatalog.zip' ), 
            'required'           => true,
            'version'            => '1.0.2'
        ),       
				
		array(
            'name'               => esc_html__( 'One Click Install', 'revo' ), 
            'slug'               => 'one-click-demo-import', 
            'source'             => esc_url( get_template_directory_uri() . '/lib/plugins/one-click-demo-import.zip' ), 
            'required'           => true, 
        ),
		array(
            'name'               => esc_html__( 'Visual Composer', 'revo' ), 
            'slug'               => 'js_composer', 
            'source'             => esc_url( get_template_directory_uri() . '/lib/plugins/js_composer.zip' ), 
            'required'           => true, 
            'version'            => '6.2.0'
        ),	
		array(
            'name'      		 => esc_html__( 'MailChimp for WordPress Lite', 'revo' ),
            'slug'     			 => 'mailchimp-for-wp',
            'required' 			 => false,
        ),
		array(
            'name'      		 => esc_html__( 'Contact Form 7', 'revo' ),
            'slug'     			 => 'contact-form-7',
            'required' 			 => false,
        ),
		array(
            'name'      		 => esc_html__( 'YITH Woocommerce Compare', 'revo' ),
            'slug'      		 => 'yith-woocommerce-compare',
            'required'			 => false
        ),
		 array(
            'name'     			 => esc_html__( 'YITH Woocommerce Wishlist', 'revo' ),
            'slug'      		 => 'yith-woocommerce-wishlist',
            'required' 			 => false
        ), 
		array(
            'name'     			 => esc_html__( 'WordPress Seo', 'revo' ),
            'slug'      		 => 'wordpress-seo',
            'required'  		 => false,
        ),

    );	
	
	if( class_exists( 'WCMp' ) || class_exists( 'WeDevs_Dokan' ) || class_exists( 'WC_Vendors' ) ): 
	 $plugins[] = array(
		'name'               => esc_html__( 'Sw Vendor Slider', 'revo' ),
		'slug'               => 'sw_vendor_slider',
		'source'             => esc_url( get_template_directory_uri() . '/lib/plugins/sw_vendor_slider.zip' ), 
		'required'           => true,
		'version'            => '1.0.6'
	);
	endif;
	
    $config = array();

    tgmpa( $plugins, $config );

}
add_action( 'vc_before_init', 'revo_vcSetAsTheme' );
function revo_vcSetAsTheme() {
    vc_set_as_theme();
}