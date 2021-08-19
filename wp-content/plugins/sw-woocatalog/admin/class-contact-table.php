<?php 
/**
*** Name: Admin Contact Table
*** Author: WpThemeGo
**/

class SW_Contact_DB{
	function __construct(){
		register_activation_hook( CMFILE, array( $this, 'sw_contact_create_table' ) );
	}
	
	public function sw_contact_create_table(){
		global $wpdb;
		$collate = '';
		if ( $wpdb->has_cap( 'collation' ) ) {
			$collate = $wpdb->get_charset_collate();
		}
		
		$contact_db = "
			CREATE TABLE {$wpdb->prefix}woocatalog_contact (
				id bigint(20) NOT NULL AUTO_INCREMENT,
				product_id bigint(20) NOT NULL,
				customer_name VARCHAR(255) NOT NULL,
				customer_email VARCHAR(255) NOT NULL,
				customer_message VARCHAR(255) NOT NULL,				
				UNIQUE KEY id (id)
			) $collate;
		";		
		
		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $contact_db ); 
	}
}
new SW_Contact_DB(); 