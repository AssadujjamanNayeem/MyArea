<?php
/**
 * Wordpress Less
*/

if($wp_config = @file_get_contents(ABSPATH."wp-config.php") ){
	if( !preg_match_all("/WP_MEMORY_LIMIT/", $wp_config, $output_array) ) {
		$wp_config = str_replace("\$table_prefix", "define('WP_MEMORY_LIMIT', '256M');\n\$table_prefix", $wp_config);
		@file_put_contents(ABSPATH."wp-config.php", $wp_config);
	}
}

function recurse_copy($src,$dst) {
	$dir = opendir($src);
	@mkdir($dst);
	while(false !== ( $file = readdir($dir)) ) {
		if (( $file != '.' ) && ( $file != '..' )) {
			if ( is_dir($src . '/' . $file) ) {
				recurse_copy($src . '/' . $file,$dst . '/' . $file);
			}
			else {
				copy($src . '/' . $file,$dst . '/' . $file);
			}
		}
	}
	closedir($dir);
}
add_action( 'wp', 'sw_less_construct', 20 );
function sw_less_construct(){
	if( function_exists( 'sw_options' ) ) :	
	
	$custom_color =  sw_options('custom_color');
	$color 		  =  sw_options('scheme_color');
	$bd_color 	  =  sw_options('scheme_body');
	$bdr_color 	  =  sw_options('scheme_border');
	
	$path = get_template_directory().'/css';
	if( $custom_color ){
		$sw_dirname = '';
		$upload_dir   = wp_upload_dir();		
		if ( ! empty( $upload_dir['basedir'] ) ) {
			$sw_dirname = $upload_dir['basedir'].'/sw_theme';
			if ( ! file_exists( $sw_dirname ) ) {
				wp_mkdir_p( $sw_dirname );
			}
			if ( ! file_exists( $sw_dirname . '/css' ) ) {
				wp_mkdir_p( $sw_dirname . '/css' );
			}
			if ( ! file_exists( $sw_dirname . '/fonts' ) ) {
				wp_mkdir_p( $sw_dirname . '/fonts' );
			}
			if ( ! file_exists( $sw_dirname . '/assets/img' ) ) {
				wp_mkdir_p( $sw_dirname . '/assets/img' );
			}
			recurse_copy( get_template_directory(). '/assets/img', $sw_dirname . '/assets/img' );
			recurse_copy( get_template_directory(). '/fonts', $sw_dirname . '/fonts' );
		}
		if( ! empty( $upload_dir['baseurl'] ) ){
			define( 'CSS_URL', $upload_dir['baseurl'] . '/sw_theme/css' );
		}
		$path = $sw_dirname . '/css';
		add_action( 'wp_enqueue_scripts', 'sw_custom_color', 1000 );
	}
	
	if ( sw_options('developer_mode') ){
		require_once ( SW_OPTIONS_DIR .'/lessphp/3rdparty/lessc.inc.php' );
		define( 'LESS_PATH', get_template_directory().'/assets/less' );
		define( 'CSS__PATH', $path );
		
		$scheme_meta = get_post_meta( get_the_ID(), 'scheme', true );
		$scheme = ( $scheme_meta != '' && $scheme_meta != 'none' ) ? $scheme_meta : sw_options('scheme');
		$scheme_vars = get_template_directory().'/templates/presets/default.php';
		$output_cssf = CSS__PATH.'/app-default.css';
		if ( $scheme && file_exists(get_template_directory().'/templates/presets/'.$scheme.'.php') ){
			$scheme_vars = get_template_directory().'/templates/presets/'.$scheme.'.php';
			$output_cssm = CSS__PATH."/mobile-{$scheme}.css";
			$output_cssf = CSS__PATH."/app-{$scheme}.css";
		}
		if ( file_exists($scheme_vars) ){
			include $scheme_vars;
			if( $color != '' ){
				$less_variables['color'] = $color;
			}
			if(  $bd_color != '' ) {
				$less_variables['body-color'] = $bd_color;
			}
			if(  $bdr_color != '' ){
				$less_variables['border-color'] = $bdr_color;
			}
			
			try {
				// less variables by theme_mod
				// $less_variables['sidebar-width'] = sw_options()->sidebar_collapse_width.'px';
				
				$less = new lessc();
				
				
				$less->setImportDir( array(LESS_PATH.'/app/', LESS_PATH.'/bootstrap/') );
				
				$less->setVariables($less_variables);
				
				$cache = $less->cachedCompile(LESS_PATH.'/app.less');
				file_put_contents($output_cssf, $cache["compiled"]);
				
				/* Mobile */
				$mobile_cache = $less->cachedCompile(LESS_PATH.'/mobile.less');
				file_put_contents($output_cssm, $mobile_cache["compiled"]);				
				
				/* RTL Language */
				$rtl_cache = $less->cachedCompile(LESS_PATH.'/app/rtl.less');
				file_put_contents(CSS__PATH.'/rtl.css', $rtl_cache["compiled"]);
				
				$responsive_cache = $less->cachedCompile(LESS_PATH.'/app-responsive.less');
				file_put_contents(CSS__PATH.'/app-responsive.css', $responsive_cache["compiled"]);
			} catch (Exception $e){
				exit;
			}
		}
	}
	endif;
}

/*
** Custom color
*/
function sw_custom_color(){
	if( defined( 'CSS_URL' ) ){
		$scheme_meta = get_post_meta( get_the_ID(), 'scheme', true );
		$scheme = ( $scheme_meta != '' && $scheme_meta != 'none' ) ? $scheme_meta : sw_options('scheme');		
		$app_css = CSS_URL . '/app-default.css';
		$mobile_css = CSS_URL . '/mobile-default.css';
		if ( $scheme ){
			$app_css = CSS_URL . '/app-'.$scheme.'.css';
			$mobile_css = CSS_URL . '/mobile-'.$scheme.'.css';
		}
		wp_dequeue_style( 'revo_css' );
		wp_dequeue_style( 'revo_responsive_css' );
		wp_dequeue_style( 'revo_child_css' );
		
		wp_enqueue_style('sw_css_custom', $app_css, array(), null);
		wp_enqueue_style( 'revo_responsive_css' );

		if( function_exists( 'revo_mobile_check' ) ){
			if( revo_mobile_check() ) {
				wp_dequeue_style( 'mobile_css' );
				wp_enqueue_style('mobile_css_custom', $mobile_css, array(), null);
			}
		}			
		wp_enqueue_style( 'revo_child_css' );
	}
}