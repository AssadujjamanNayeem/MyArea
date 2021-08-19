<?php
/* 
** Content Header
*/
$revo_page_header = get_post_meta( get_the_ID(), 'page_header_style', true );
$revo_colorset = sw_options('scheme');
$revo_logo = sw_options('sitelogo');
$sticky_menu 		= sw_options( 'sticky_menu' );
$revo_page_header  = ( get_post_meta( get_the_ID(), 'page_header_style', true ) != '' ) ? get_post_meta( get_the_ID(), 'page_header_style', true ) : sw_options('header_style');
$revo_menu_item 	= ( sw_options( 'menu_number_item' ) ) ? sw_options( 'menu_number_item' ) : 9;
$revo_more_text 	= ( sw_options( 'menu_more_text' ) )	 ? sw_options( 'menu_more_text' )		: esc_html__( 'See More', 'revo' );
$revo_less_text 	= sw_options( 'menu_less_text' )			 ? sw_options( 'menu_less_text' )		: esc_html__( 'See Less', 'revo' );
$revo_menu_text 	= ( sw_options( 'menu_title_text' ) )	 ? sw_options( 'menu_title_text' )	: esc_html__( 'All Categories', 'revo' );
$disable_search =  sw_options( 'disable_search' );
?>
<header id="header" class="header header-<?php echo esc_attr( $revo_page_header );?>">
	<div class="header-mid clearfix">
		<div class="container">
			<!-- Logo -->
			<div class="top-header clearfix">
				<div class="revo-logo">
					<?php revo_logo(); ?>
				</div>
			</div>
			<!-- Primary navbar -->
			<?php if ( has_nav_menu('primary_menu') ) { ?>
			<div id="main-menu" class="main-menu clearfix">
				<nav id="primary-menu" class="primary-menu">
					<div class="mid-header clearfix">
						<div class="navbar-inner navbar-inverse">
							<?php
							$revo_menu_class = 'nav nav-pills';
							if ( 'mega' == sw_options('menu_type') ){
								$revo_menu_class .= ' nav-mega';
							} else $revo_menu_class .= ' nav-css';
							?>
							<?php wp_nav_menu(array('theme_location' => 'primary_menu', 'menu_class' => $revo_menu_class)); ?>
						</div>
					</div>
				</nav>
			</div>
			<?php } ?>
			<?php if (is_active_sidebar('contact-us')) {?>
			<div class="header-news">
				<?php dynamic_sidebar('contact-us'); ?>
			</div>
			<?php }?>
		</div>
	</div>
</header>
<div class="revoheader-top-menu clearfix">
	<?php if (is_active_sidebar('top20')) {?>
		<?php dynamic_sidebar('top20'); ?>
	<?php }?>
	<!-- Sidebar Top Menu -->
	<?php if( !sw_options( 'disable_cart' ) ) : ?>
		<?php get_template_part( 'woocommerce/minicart-ajax-style6' ); ?>
	<?php endif; ?>
	<?php if (is_active_sidebar('header-right14')) {?>
	<div class="header-right2 pull-right">
		<?php dynamic_sidebar('header-right14'); ?>
	</div>
	<?php }?>
	<?php if (is_active_sidebar('header-right4')) {?>
	<div  class="header-right pull-right">
		<?php dynamic_sidebar('header-right4'); ?>
	</div>
	<?php }?>
	<?php if( !$disable_search ) : ?>
		<div class="search-cate pull-right">
			<?php if( is_active_sidebar( 'search' ) && class_exists( 'sw_woo_search_widget' ) ): ?>
				<?php dynamic_sidebar( 'search' ); ?>
			<?php else : ?>
				<div class="widget revo_top-3 revo_top non-margin">
					<div class="widget-inner">
						<?php get_template_part( 'widgets/sw_top/searchcate' ); ?>
					</div>
				</div>
			<?php endif; ?>
		</div>
	<?php endif; ?>
</div>