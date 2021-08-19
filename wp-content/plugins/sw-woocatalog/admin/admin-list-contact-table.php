<?php 

class SW_Contact_List_Table {

	// class instance
	static $instance;

	// customer WP_List_Table object
	public $customers_obj;

	// class constructor
	public function __construct() {
		add_filter( 'set-screen-option', [ __CLASS__, 'set_screen' ], 10, 3 );
		add_action( 'admin_menu', [ $this, 'plugin_menu' ] );
	}
	public static function set_screen( $status, $option, $value ) {
		return $value;
	}

	public function plugin_menu() {

		$hook = add_menu_page(
			esc_html__( 'WooCatalog Contact', 'sw-woocatalog' ),
			esc_html__( 'WooCatalog Contact', 'sw-woocatalog' ),
			'manage_options',
			'wp_list_table_class',
			[ $this, 'plugin_settings_page' ]
		);

		add_action( "load-$hook", [ $this, 'screen_option' ] );

	}
	
	/**
	* Screen options
	*/
	public function screen_option() {

		$option = 'per_page';
		$args   = [
			'label'   => esc_html__( 'Contact', 'sw-woocatalog' ),
			'default' => 5,
			'option'  => 'contact_per_page'
		];

		add_screen_option( $option, $args );

		$this->customers_obj = new sw_woocatalog_table();
	}
	/**
	* Plugin settings page
	*/
	public function plugin_settings_page() {
		?>
		<div class="wrap">
			<h2><?php echo esc_html__( 'SW Contact List Table', 'sw-woocatalog' ); ?></h2>

			<div id="poststuff">
				<div id="post-body" class="metabox-holder">
					<div id="post-body-content">
						<div class="meta-box-sortables ui-sortable">
							<form method="post">
								<?php
								$this->customers_obj->prepare_items();
								$this->customers_obj->display(); ?>
							</form>
						</div>
					</div>
				</div>
				<br class="clear">
			</div>
		</div>
	<?php
	}
	
	/** Singleton instance */
	public static function get_instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}
}
SW_Contact_List_Table::get_instance();