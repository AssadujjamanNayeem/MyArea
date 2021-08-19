<?php

/**
 *
 * @link              https://agilestorelocator.com
 * @since             1.0.0
 * @package           AgileStoreLocator
 *
 * @wordpress-plugin
 * Plugin Name:       Agile Store Locator
 * Plugin URI:        https://agilestorelocator.com
 * Description:       Agile Store Locator is a WordPress Store Finder/Locator Plugin that renders stores list with Location markers on Google Maps v3, it supports GeoLocation and render nearest stores with direction over google maps.
 * Version:           1.2.3
 * Author:            AGILELOGIX
 * Author URI:        https://agilestorelocator.com/
 * License:           Copyrights 2020
 * License URI:       
 * Text Domain:       asl_locator
 * Domain Path:       /languages/
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}



if ( !class_exists( 'ASL_Store_locator' ) ) {


  class ASL_Store_locator {
        
        /**
         * Class constructor
         */          
        function __construct() {
                                    
            $this->define_constants();
            $this->includes();


            register_activation_hook( __FILE__, array( $this, 'activate') );
            register_deactivation_hook( __FILE__, array( $this, 'deactivate') );

            //add_filter('auto_update_plugin', array($this, 'asl_upgrade_process'), 10, 2);
            add_action('upgrader_process_complete', array($this, 'asl_upgrade_process'), 10, 2);
        }
        
        /**
         * Setup plugin constants.
         *
         * @since 1.0.0
         * @return void
         */
        public function define_constants() {

          global $wpdb;


          define( 'ASL_URL_PATH', plugin_dir_url( __FILE__ ) );
          define( 'ASL_PLUGIN_PATH', plugin_dir_path(__FILE__) );
          define( 'ASL_BASE_PATH', dirname( plugin_basename( __FILE__ ) ) );
          define( 'ASL_PREFIX', $wpdb->prefix."asl_" );
          define( 'ASL_CVERSION', "1.2.3" );
        }
        
        /**
         * Include the required files.
         *
         * @since 1.0.0
         * @return void
         */
        public function includes() {

          require_once ASL_PLUGIN_PATH . 'includes/class-agile-store-locator.php';
          
          $asl_core = new AgileStoreLocator();
          $asl_core->run();
        }
        

        /**
         * The code that runs during plugin activation.
         * This action is documented in includes/class-agile-store-locator-activator.php
         */
        public function activate() {
          
          require_once ASL_PLUGIN_PATH . 'includes/class-agile-store-locator-activator.php';
          AgileStoreLocator_Activator::activate();
        }

        /**
         * The code that runs during plugin deactivation.
         * This action is documented in includes/class-agile-store-locator-deactivator.php
         */
        public function deactivate() {
          
          require_once ASL_PLUGIN_PATH . 'includes/class-agile-store-locator-deactivator.php';
          AgileStoreLocator_Deactivator::deactivate();
        }


        /**
         * [asl_upgrade_process WordPress upgrade]
         * @param  [type] $upgrader_object [description]
         * @param  [type] $options         [description]
         * @return [type]                  [description]
         */
        function asl_upgrade_process( $upgrader_object, $options ) {

					require_once ASL_PLUGIN_PATH . 'includes/class-agile-store-locator-activator.php';
          
          //  Run the script to add missing tables
          AgileStoreLocator_Activator::activate();
				  
				}
  }


  $asl_instance = new ASL_Store_locator();
}

