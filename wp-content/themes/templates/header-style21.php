<?php
	/* 
	** Content Header
	*/
	$revo_page_header = get_post_meta( get_the_ID(), 'page_header_style', true );
	$revo_colorset = sw_options('scheme');
	$sticky_menu 		= sw_options( 'sticky_menu' );
	$revo_page_header  = ( get_post_meta( get_the_ID(), 'page_header_style', true ) != '' ) ? get_post_meta( get_the_ID(), 'page_header_style', true ) : sw_options('header_style');
?>
<header id="header" class="header header-<?php echo esc_attr( $revo_page_header );?>">
	<div class="header-top">
		<div class="container">
			<!-- Sidebar Top Menu -->
			<?php if (is_active_sidebar('top20')) {?>
				<div class="top-header">
					<?php dynamic_sidebar('top20'); ?>
				</div>
			<?php }?>
		</div>
	</div>
	<div class="header-mid">
		<div class="container">
			<div class="row">
				<?php if (is_active_sidebar('header-left')) {?>
					<div class="header-left col-lg-4 col-md-4 col-sm-4 col-xs-4">
						<?php dynamic_sidebar('header-left'); ?>
					</div>
				<?php }?>
				<!-- Logo -->
				<div class="center-header col-lg-4 col-md-4 col-sm-4 col-xs-4">
					<div class="revo-logo">
						<?php revo_logo(); ?>
					</div>
				</div>
				<?php if (is_active_sidebar('header-right')) {?>
					<div  class="header-right col-lg-4 col-md-4 col-sm-4 col-xs-4">
						<?php dynamic_sidebar('header-right'); ?>
					</div>
				<?php }?>
			</div>
		</div>
	</div>
	<div class="header-bottom">
		<div class="container">
			<div class="row">
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
				<!-- /Primary navbar -->
			</div>
		</div>
	</div>
</header>