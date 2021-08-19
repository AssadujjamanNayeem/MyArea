<?php

/**
 * Adds WP_Customize_Textarea_Control
 */

if ( class_exists( 'WP_Customize_Control' ) ) {
	class WP_Customize_Textarea_Control extends WP_Customize_Control {
		public $type = 'textarea';

    	public function render_content() { ?>
			<label>
				<span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
				<textarea rows="5" style="width:100%;" <?php $this->link(); ?>><?php echo esc_textarea( $this->value() ); ?></textarea>
			</label>
			<?php
		}
  	}
}
class SW_Customize{
	/**
	 * Adds sections to the customizer
	 * @param WP_Customize_Control $wp_customize
	 */
	public static function register ( $wp_customize ) {
	
		$priority = 200;
		$sections = array();
		$sw_options = revo_Options_Setup();	
		foreach( $sw_options as $key => $sw_option ){
			if( in_array( $key, array( 0,2,3,5,8,9,10,11 ) ) ){
				unset( $sw_options[$key] );
			}
		}
		$i = 0;
		$wp_customize->add_panel( 'sw_theme_options', array(
			'priority'       => 200,
			'capability'     => 'edit_theme_options',
			'theme_supports' => '',
			'title'          => __( 'Theme Options', 'revo' ),
		) );
		foreach ( $sw_options as $section) {
			
			if ( isset($section['fields']) && is_array($section['fields']) ) {
				
				foreach ($section['fields'] as $field ){
										
						if ( isset($field['options']) ) $field['choices'] = $field['options'];
						
						if ($field['type'] == 'upload') $field['type'] = 'image';
						
						if ($field['type'] == 'radio_img') {
							$field['type'] = 'select';
							$field['choices'] = array();
			
							foreach ( $field['options'] as $key => $choices ) {
								$field['choices'][$key] = $choices['title']; 
							}
						}
						
						if ($field['type'] == 'pages_select') {
							$field['type'] = 'dropdown-pages';
						}
						
						$field['label'] = $field['title'];
						$field['section'] = sanitize_title($section['title']);
						$field['settings'] = SW_THEME.'['.$field['id'].']';
						$field['priority'] = $priority++;
						$sections[$i]['fields'][] = $field;
				} 
				
				if ( isset($sections[$i]['fields']) ) {
					$sections[$i]['title'] = $section['title'];
					$sections[$i]['priority'] = $priority++;
					$sections[$i]['panel'] = 'sw_theme_options';
					$sections[$i]['capability'] = 'edit_theme_options';
					$i++;
				}
			}
		}
		foreach ( $sections as $section ) {
				
			// Add Section
			$wp_customize->add_section( sanitize_title($section['title']), $section );
			
			foreach ($section['fields'] as $field ){ 

				//Add Setting
				$wp_customize->add_setting( 
						SW_THEME.'['.$field['id'].']', 
						array(
							'default'  	=> sw_options($field['id']),
							'type' 		=> 'option',
							'transport' => 'postMessage',
							'capability' => 'edit_theme_options'
						)
					);
					
				// Add Control
				switch( $field['type'] ){
					case 'color':
						$wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, $field['id'], $field ) );
						break;
					case 'image':
						$wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, $field['id'], $field ) );
						break;
					case 'textarea':
						$wp_customize->add_control( new WP_Customize_Textarea_Control( $wp_customize, $field['id'], $field ) );
						break;
					default:
						$wp_customize->add_control( SW_THEME.'['.$field['id'].']', $field );
				}
			}		
		}
		$wp_customize -> get_setting( 'blogname' )-> transport = 'postMessage';
		$wp_customize -> get_setting( 'blogdescription' )-> transport = 'postMessage';
	}
	
	public static function live_preview() {
		wp_enqueue_script( 
			'sw-themecustomizer', // Give the script a unique ID
			get_template_directory_uri() . '/js/customizer.js', // Define the path to the JS file
			array(  'jquery', 'customize-preview' ), // Define dependencies
			'', // Define a version (optional) 
			true // Specify whether to put in footer (leave this true)
		);
		$sw_customize = array(
			'shop' => esc_url( wc_get_page_permalink( 'shop' ) )
		);
		wp_localize_script( 'sw-themecustomizer', 'sw_customize', $sw_customize );
	}
	
	public function add_scripts() {
		$min_rows    = wc_get_theme_support( 'product_grid::min_rows', 1 );
		$max_rows    = wc_get_theme_support( 'product_grid::max_rows', '' );
		$min_columns = wc_get_theme_support( 'product_grid::min_columns', 1 );
		$max_columns = wc_get_theme_support( 'product_grid::max_columns', '' );

		/* translators: %d: Setting value */
		$min_notice = __( 'The minimum allowed setting is %d', 'revo' );
		/* translators: %d: Setting value */
		$max_notice = __( 'The maximum allowed setting is %d', 'revo' );
		?>
		<script type="text/javascript">
			jQuery( document ).ready( function( $ ) {

				wp.customize.section( 'product-options', function( section ) {
					section.expanded.bind( function( isExpanded ) {
						if ( isExpanded ) {
							wp.customize.previewer.previewUrl.set( '<?php echo esc_js( wc_get_page_permalink( 'shop' ) ); ?>' );
						}
					} );
				} );
			} );
		</script>
		<?php
	}
}

new SW_Customize();

// Setup the Theme Customizer settings and controls...
add_action( 'customize_register' , array( 'SW_Customize' , 'register' ) );

// Enqueue live preview javascript in Theme Customizer admin screen
add_action( 'customize_controls_print_scripts', array( 'SW_Customize', 'add_scripts' ), 30 );
add_action( 'customize_preview_init' , array( 'SW_Customize' , 'live_preview' ), 100 );