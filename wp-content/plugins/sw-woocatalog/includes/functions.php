<?php 
/**
** Functions
**/

if( get_option( 'sw_woocatalog_enable' ) === 'no' ) :
	return;
endif;

/**
* check override template
**/
function woocatalog_override_check( $path, $file ){
	$paths = '';

	if( locate_template( 'sw-woocatalog/'.$path . '/' . $file . '.php' ) ){
		$paths = locate_template( 'sw-woocatalog/'.$path . '/' . $file . '.php' );		
	}else{
		$paths = CMTHEME . '/' . $path . '/' . $file . '.php';
	}
	return $paths;
}

/*
** Get root theme name
*/
function woocatalog_get_current_theme_name(){
	$theme_name = wp_get_theme()->get( 'Name' );
	if( wp_get_theme()->parent() ){
		$theme_name = wp_get_theme()->parent()->get( 'Name' );
	}
	return strtolower( $theme_name );
}

/*
** Hook to add or remove some action, filter
*/
add_action( 'after_setup_theme', 'sw_woocatalog_custom_hooks_sw_theme', 100 );
function sw_woocatalog_custom_hooks_sw_theme(){
	$action_remove = woocatalog_get_current_theme_name() . '_product_deal';
	remove_action( 'woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10 );
	remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
	remove_action( 'woocommerce_before_shop_loop_item_title', $action_remove, 20 );
	remove_action( 'woocommerce_single_product_summary', $action_remove, 10 );
	remove_action( 'woocommerce_single_product_summary', woocatalog_get_current_theme_name() .'_woocommerce_single_price', 10 );
	
	add_action( 'woocommerce_single_product_summary', 'sw_woocatalog_contact_button', 30 );
	add_filter( 'woocommerce_get_price_html', 'sw_woocatalog_custom_price_html', 10, 1 );
	add_filter( 'sw_label_sales', 'sw_woocatalog_custom_label_sales', 10, 1 );	
	add_filter( 'woocommerce_product_tabs', 'sw_woocatalog_contact_tab', 99 );
	add_filter( 'woocommerce_loop_add_to_cart_link', 'sw_custom_add_to_cart_catalog' );
	add_filter( 'sw_sale_bar_total_sales', '__return_false' );

	if( get_option( 'sw_woocatalog_review_disable' ) == 'yes' ){
		add_filter( 'woocommerce_product_tabs', 'sw_woocatalog_remove_review_tabs', 98 );
		add_filter( 'body_class', 'sw_woocatalog_disable_review_class' );
		remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_rating', 10 );
	}
}

function sw_woocatalog_custom_price_html( $price ){
	return '';
}

function sw_woocatalog_custom_label_sales( $html ){
	return '';
}

function sw_custom_add_to_cart_catalog( $content ){
	return '';
}

function sw_woocatalog_contact_button(){
?>
	<div class="woocatalog-contact">
		<a href="#tab-woocatalog_contact"><?php echo esc_html__( 'Contact Now', 'sw-woocatalog' ); ?></a>
	</div>
<?php 
}

function sw_woocatalog_contact_tab($tabs){
	$tabs['woocatalog_contact'] = array(
		'title'    => esc_html__( 'Contact', 'sw-woocatalog' ),
		'priority' => 999,
		'callback' => 'sw_woocatalog_contact_tab_callback'
	);
	return $tabs;
}

function sw_woocatalog_contact_tab_callback(){
	include( woocatalog_override_check( '', 'contact-form' ) );
}

/*
** Disable reviews
*/
function sw_woocatalog_remove_review_tabs($tabs) {
	unset($tabs['reviews']); 
	return $tabs;
}

function sw_woocatalog_disable_review_class( $classes ){
	$classes[] = 'disabled-reviews';
	return $classes;
}

/*
** Ajax Call
*/
add_action( 'wp_ajax_sw_woocatalog_send_contact', 'sw_woocatalog_send_contact_callback' );
add_action( 'wp_ajax_nopriv_sw_woocatalog_send_contact', 'sw_woocatalog_send_contact_callback' );
function sw_woocatalog_send_contact_callback(){
	$woocatalog_id = isset( $_POST['woocatalog_id'] ) ? strip_tags( $_POST['woocatalog_id'] ) : false;
	$data = ( isset( $_POST['data_values'] ) ) ? $_POST['data_values'] : '';
	parse_str( $data,$new_data );
	$error = 1;
	$message = esc_html__( 'There is error with send request, please try again after few minutes', 'sw-woocatalog' );
	if( is_array( $new_data ) && count( $new_data ) ){
		$woocatalog_name = isset( $new_data['woocatalog_name'] ) ? strip_tags( $new_data['woocatalog_name'] ) : '';
		$woocatalog_email = isset( $new_data['woocatalog_email'] ) ? sanitize_email( $new_data['woocatalog_email'] ) : '';
		$woocatalog_message = isset( $new_data['woocatalog_message'] ) ? sanitize_textarea_field( $new_data['woocatalog_message'] ) : '';
		$woocatalog_productid = isset( $new_data['woocatalog_productid'] ) ? intval( $new_data['woocatalog_productid'] ) : 0;
		
		global $wpdb;
		$wpdb->insert( 
			$wpdb->prefix. 'woocatalog_contact', 
			array( 
				'id' => $woocatalog_id,
				'product_id' => $woocatalog_productid, 
				'customer_name' => $woocatalog_name,
				'customer_email' => $woocatalog_email,
				'customer_message' => $woocatalog_message			
			),
			array( '%d', '%d', '%s', '%s', '%s' )
		);		
		
		/*
		** Send email
		*/
		$subject = apply_filters( 'sw_woocatalog_title_to', esc_html__( 'You have new request from ', 'sw-woocatalog' ) . get_the_title( $woocatalog_productid ) );
		$content_header = "Content-type: text/html; charset=iso-8859-1\r\n";
		$from = get_option( 'admin_email' );
		$headers[] = "From: ".$from." <".$from.">\r\n";
		$headers[] = $content_header;
		
		ob_start();
		include( woocatalog_override_check( '', 'user-email-form' ) );
		$content = ob_get_clean();
		if( wp_mail( $woocatalog_email, $subject, $content, $headers ) ){
			$error = 0;
			$message = esc_html__( 'Your message were sent successful! Redirecting...', 'sw-woocatalog' );
		}
		
		/*
		** Email to admin
		*/		
		$subject1 = apply_filters( 'sw_woocatalog_title_from', esc_html__( 'You have new request from ', 'sw-woocatalog' ) . site_url('/') );
		$headers1[] = "From: ".$woocatalog_name." <".$woocatalog_email.">\r\n";
		$headers1[] = $content_header;
		ob_start();
		include( woocatalog_override_check( '', 'admin-email-form' ) );
		$content1 = ob_get_clean();
		if( wp_mail( $from, $subject1, $content1, $headers1 ) ){
			$error = 0;
			$message = esc_html__( 'Your message were sent successful! Redirecting...', 'sw-woocatalog' );
		}
	}
	echo json_encode(array( 'message'=> $message, 'error' => $error ) );
	exit();
}