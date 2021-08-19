<?php 

/**
	* Layout Child Category 1
	* @version     1.0.0
**/
if( $category == '' ){
	return '<div class="alert alert-warning alert-dismissible" role="alert">
		<a class="close" data-dismiss="alert">&times;</a>
		<p>'. esc_html__( 'Please select a category for SW Woo Slider. Layout ', 'sw_woocommerce' ) . $layout .'</p>
	</div>';
}

$widget_id = isset( $widget_id ) ? $widget_id : $this->generateID();
$viewall = get_permalink( wc_get_page_id( 'shop' ) );
$default = array();
if( $category != '' ){
	$default = array(
		'post_type' => 'product',
		'tax_query' => array(
		array(
			'taxonomy'  => 'product_cat',
			'field'     => 'slug',
			'terms'     => $category ) ),
		'orderby' => $orderby,
		'order' => $order,
		'post_status' => 'publish',
		'showposts' => $numberposts
	);
}
$default = sw_check_product_visiblity( $default );

$term_name = '';
$term = get_term_by( 'slug', $category, 'product_cat' );
if( $term ) :
	$term_name = $term->name;
	$viewall = get_term_link( $term->term_id, 'product_cat' );
endif;

$list = new WP_Query( $default );
if ( $list -> have_posts() ){ 
	$x_array = array();
	$key = 0;
	foreach( $list->posts as $item ){
		$m_array = array();
		$terms = get_the_terms( $item->ID, 'product_brand' );
		if( $terms ){
			foreach( $terms as $x => $bterm ){
				$m_array[$x] = $bterm -> term_id;
			}
			$x_array[$key] = implode( $m_array );
			$key ++; 
		}		
	}
?>
	<div id="<?php echo 'slider_' . $widget_id; ?>" class="responsive-slider woo-slider-default sw-child-cat4 <?php echo esc_attr( $style );?> loading" >
		<div class="child-top clearfix" <?php echo ( $color != '' ) ? 'style="background: '. esc_attr( $color ) .'"' : ''; ?>>
			<div class="box-title clearfix">
				<h3><?php echo ( $title1 != '' ) ? $title1 : $term_name; ?></h3>
				<a class="view-all" href="<?php echo esc_url( $viewall ) ?>"><?php esc_html_e( 'view all', 'sw_woocommerce' ) ?></a>
				<button class="button-collapse collapsed pull-right" type="button" data-toggle="collapse" data-target="#<?php echo 'child_' . $widget_id; ?>"  aria-expanded="false">
					<span class="fa fa-bar"></span>
					<span class="fa fa-bar"></span>
					<span class="fa fa-bar"></span>					
				</button>
				<?php 
				if( $term ) :
					$termchild 		= get_terms( 'product_cat', array( 'parent' => $term->term_id, 'hide_empty' => 0, 'number' => $number_child ) );
					if( count( $termchild ) > 0 ){
				?>			
					<div class="childcat-content pull-right"  id="<?php echo 'child_' . $widget_id; ?>">				
					<?php 					
						echo '<ul>';
						foreach ( $termchild as $key => $child ) {
							echo '<li><a href="' . get_term_link( $child->term_id, 'product_cat' ) . '">' . $child->name . '</a></li>';
						}
						echo '</ul>';
					?>
					</div>
					<?php } ?>
				<?php endif; ?>				
			</div>
		</div>
		<div class="childcat-slider-content clearfix">
			<div class="child-top-left pull-left">
				<!-- Banner -->
				<?php 
				$banner_links = explode( ',', $banner_links );
				if( $img_banners != '' ) :
					$img_banners = explode( ',', $img_banners );	
				endif;
				?>
				<div class="banner-category clearfix">
					<div id="<?php echo esc_attr( 'banner_' . $widget_id ); ?>" class="banner-slider" data-lg="1" data-md="1" data-sm="1" data-xs="1" data-mobile="1" data-dots="true" data-arrow="false" data-fade="false">
						<div class="banner-responsive">
							<?php foreach( $img_banners as $key => $img ) : ?>
								<div class="item pull-left">
									<a href="<?php echo esc_url( $banner_links[$key] ); ?>"><?php echo wp_get_attachment_image( $img, 'full' ); ?></a>
								</div>
							<?php endforeach;?>
						</div>
					</div>									
				</div>
			</div>		
			<div class="resp-slider">
				<div class="slider">	
				<?php 
					$count_items 	= 0;
					$numb 			= ( $list->found_posts > 0 ) ? $list->found_posts : count( $list->posts );
					$count_items 	= ( $numberposts >= $numb ) ? $numb : $numberposts;
					$i 				= 0;
					while($list->have_posts()): $list->the_post();global $product, $post;
					$class = ( $product->get_price_html() ) ? '' : 'item-nonprice';
					if( $i % $item_row == 0 ){
				?>
					<div class="item pull-left">
				<?php } ?>
					<div class="item-wrap">
						<div class="item-detail">										
							<div class="item-img products-thumb">		
								<?php do_action( 'woocommerce_before_shop_loop_item_title' ); ?>
							</div>										
							<div class="item-content">
								<?php 
									$rating_count = $product->get_rating_count();
									$review_count = $product->get_review_count();
									$average      = $product->get_average_rating();
								?>
								<div class="reviews-content">
									<div class="star"><?php echo ( $average > 0 ) ?'<span style="width:'. ( $average*13 ).'px"></span>' : ''; ?></div>
								</div>
								<h4><a href="<?php the_permalink(); ?>" title="<?php the_title_attribute();?>"><?php sw_trim_words( get_the_title(), $title_length ); ?></a></h4>
								<!-- price -->
								<?php if ( $price_html = $product->get_price_html() ){?>
									<div class="item-price">
										<span>
											<?php echo $price_html; ?>
										</span>
									</div>
								<?php } ?>
								<?php do_action( 'woocommerce_after_shop_loop_item' ); ?>
							</div>								
						</div>
					</div>
					<?php if( ( $i+1 ) % $item_row == 0 || ( $i+1 ) == $count_items ){?> </div><?php } ?>
					<?php $i++; endwhile; wp_reset_postdata();?>
				</div>
			</div> 
		</div>
	</div>
	<?php
	}else{
		echo '<div class="alert alert-warning alert-dismissible" role="alert">
		<a class="close" data-dismiss="alert">&times;</a>
		<p>'. esc_html__( 'There is not product in this category', 'sw_woocommerce' ) .'</p>
	</div>';
	}
?>