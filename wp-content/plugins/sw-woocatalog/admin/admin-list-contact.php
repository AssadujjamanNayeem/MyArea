<?php 
/**
* Custom contact list table
* Author: WpThemeGo 
**/

if ( ! class_exists( 'WP_List_Table' ) ) {
	require_once( ABSPATH . 'wp-admin/includes/class-wp-list-table.php' );
}

class sw_woocatalog_table extends WP_List_Table {
	public function __construct() {
		parent::__construct(
			array(
				'plural'   => esc_html__('Bookings', 'sw-woocatalog'),
				'singular' => esc_html__('Booking', 'sw-woocatalog'),
				'ajax'     => false
			)
		);
	}
	
	public static function get_contact_data( $per_page = 5, $page_number = 1 ) {

		global $wpdb;

		$sql = "SELECT * FROM {$wpdb->prefix}woocatalog_contact";
		$sql .= ' ORDER BY id DESC';
		
		$sql .= " LIMIT $per_page";
		$sql .= ' OFFSET ' . ( $page_number - 1 ) * $per_page;
		
		$result = $wpdb->get_results( $sql, 'ARRAY_A' );
		return $result;
	}
	
	/**
	* Delete a customer record.
	* @param int $id customer ID
	*/
	public static function delete_contact( $id ) {
		global $wpdb;

		$wpdb->delete(
			"{$wpdb->prefix}woocatalog_contact",
			[ 'id' => $id ],
			[ '%d' ]
		);
	}
	
	/**
	* Returns the count of records in the database.
	* @return null|string
	*/
	public static function record_count() {
		global $wpdb;

		$sql = "SELECT COUNT(*) FROM {$wpdb->prefix}woocatalog_contact";

		return $wpdb->get_var( $sql );
	}
	
	
	/**
	* Text displayed when no contact data is available 
	*/
	public function no_items() {
		echo esc_html__( 'No contact available.', 'sw-woocatalog' );
	}

	/**
	 * Method for name column
	 * @param array $item an array of DB data
	 * @return string
	 */
	function column_name( $item ) {

		// create a nonce
		$delete_nonce = wp_create_nonce( 'sw_delete_contact' );

		$title = '<strong>' . $item['name'] . '</strong>';

		$actions = [
			'delete' => sprintf( '<a href="?page=%s&action=%s&contact=%s&_wpnonce=%s">'. esc_html__( 'Delete', 'sw-woocatalog' ).'</a>', esc_attr( $_REQUEST['page'] ), 'delete', absint( $item['id'] ), $delete_nonce )
		];

		return $title . $this->row_actions( $actions );
	}
	
	/**
	* Render a column when no column specific method exists.
	*
	* @param array $item
	* @param string $column_name
	*
	* @return mixed
	*/
	public function column_default( $item, $column_name ) {
		switch ( $column_name ) {			
			case 'id':
				echo '<p>#'. $item['id'] .'</a></p>';
				break;
			case 'product_id':
				echo '<p><a href="'. get_permalink( $item['product_id'] ) .'">'. get_the_title( $item['product_id'] ) .'</a></p>';
				break;
			case 'contact_name':
				echo '<p>'. esc_html( $item['customer_name'] ) .'</p>';
				break;
			case 'contact_email':
				echo '<p>'. esc_html( $item['customer_email'] ) .'</p>';
				break;
			case 'contact_message':
				echo '<p>'. stripslashes( $item['customer_message'] ) .'</p>';
				break;
			default:
			return print_r( $item, true ); //Show the whole array for troubleshooting purposes
		}
	}
	
	/**
	 * Render the bulk edit checkbox
	 * @param array $item
	 * @return string
	 */
	function column_cb( $item ) {
		return sprintf(
			'<input type="checkbox" name="sw-bulk-delete[]" value="%s" />', $item['id']
		);
	}	
	
	function get_columns() {
		$columns = array(
			'cb'              => '<input type="checkbox" />', //Render a checkbox instead of text
			'id'   			  => esc_html__( 'ID', 'sw-woocatalog' ),
			'product_id'   	  => esc_html__( 'Product Name', 'sw-woocatalog' ),
			'contact_name'    => esc_html__( 'Contact Name', 'sw-woocatalog' ),			
			'contact_email'   => esc_html__( 'Email', 'sw-woocatalog' ),
			'contact_message' => esc_html__( 'Message', 'sw-woocatalog' )			
		);

		return $columns;
	}
	
	/**
	* Columns to make sortable.
	*
	* @return array
	*/
	public function get_sortable_columns() {
		$sortable_columns = array(
			'contact_name'   => array( 'contact_name', true ),
			'contact_email' => array( 'contact_email', false )
		);

	return $sortable_columns;
	}
	
	/**
	* Returns an associative array containing the bulk action
	*
	* @return array
	*/
	public function get_bulk_actions() {
		$actions = [
			'sw-bulk-delete' => esc_html__( 'Delete', 'sw-woocatalog' )
		];

	return $actions;
	}
	
	/**
	* Handles data query and filter, sorting, and pagination.
	*/
	public function prepare_items() {

		$this->_column_headers = $this->get_column_info();

		/** Process bulk action */
		$this->process_bulk_action();

		$per_page     = $this->get_items_per_page( 'contact_per_page', 5 );
		$current_page = $this->get_pagenum();
		$total_items  = self::record_count();

		$this->set_pagination_args( [
			'total_items' => $total_items, //WE have to calculate the total number of items
			'per_page'    => $per_page //WE have to determine how many items to show on a page
		] );


		$this->items = self::get_contact_data( $per_page, $current_page );
	}
	
	public function process_bulk_action() {

		//Detect when a bulk action is being triggered...
		if ( 'delete' === $this->current_action() ) {

			// In our file that handles the request, verify the nonce.
			$nonce = esc_attr( $_REQUEST['_wpnonce'] );

			if ( ! wp_verify_nonce( $nonce, 'sw_delete_contact' ) ) {
				die( 'Go get a life script kiddies' );
			}
		}

		// If the delete bulk action is triggered
		if ( ( isset( $_POST['action'] ) && $_POST['action'] == 'sw-bulk-delete' )	|| ( isset( $_POST['action2'] ) && $_POST['action2'] == 'sw-bulk-delete' )	) {

			$delete_ids = esc_sql( $_POST['sw-bulk-delete'] );

			// loop over the array of record IDs and delete them
			foreach ( $delete_ids as $id ) {
				self::delete_contact( $id );
			}

			wp_redirect( esc_url( add_query_arg() ) );
			exit;
		}
	}
}