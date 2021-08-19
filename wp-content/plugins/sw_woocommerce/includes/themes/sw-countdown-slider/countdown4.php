<?php 
/**
	* Layout Countdown Default
	* @version     1.0.0
**/

strtotime( date_i18n('Y-m-d H:i' ) );

$term_name = esc_html__( 'All Categories', 'sw_woocommerce' );
$default = array(
	'post_type' => 'product',	
	'meta_query' => array(		
		array(
			'key' => '_sale_price',
			'value' => 0,
			'compare' => '>',
			'type' => 'DECIMAL(10,5)'
		),
		array(
			'key' => '_sale_price_dates_from',
			'value' => time(),
			'compare' => '<',
			'type' => 'NUMERIC'
		),
		array(
			'key' => '_sale_price_dates_to',
			'value' => time(),
			'compare' => '>',
			'type' => 'NUMERIC'
		)
	),
	'orderby' => $orderby,
	'order' => $order,
	'post_status' => 'publish',
	'showposts' => $numberposts	
);
if( $category != '' ){
	$term = get_term_by( 'slug', $category, 'product_cat' );
	if( $term ) :
		$term_name = $term->name;
	endif; 
	
	$default['tax_query'] = array(
		array(
			'taxonomy'  => 'product_cat',
			'field'     => 'slug',
			'terms'     => $category 
		)
	);
}
$default = sw_check_product_visiblity( $default );
$id = 'sw_countdown_'.$this->generateID();
$list = new WP_Query( $default );
if ( $list -> have_posts() ){ ?>
	<div id="<?php echo $category.'_'.$id; ?>" class="countdown-slider4" data-lg="<?php echo esc_attr( $columns ); ?>" data-md="<?php echo esc_attr( $columns1 ); ?>" data-sm="<?php echo esc_attr( $columns2 ); ?>" data-xs="<?php echo esc_attr( $columns3 ); ?>" data-mobile="<?php echo esc_attr( $columns4 ); ?>" data-speed="<?php echo esc_attr( $speed ); ?>" data-scroll="<?php echo esc_attr( $scroll ); ?>" data-interval="<?php echo esc_attr( $interval ); ?>"  data-autoplay="<?php echo esc_attr( $autoplay ); ?>" data-circle="false"> 
		<?php if( $title1 != '' ){?>
			<div class="block-title clearfix">
				<h3><?php echo ( $title1 != '' ) ? $title1 : $term_name; ?></h3>
				<div class="description"><?php echo ( $description1 != '' ) ? ''. esc_html( $description1 ) .'' : ''; ?></div>
			</div>
		<?php } ?>
		<div class="countdown-resp-slider-container clearfix">			
			<div class="countdown-responsive">			
			<?php 
				$content_array = $list->posts;
				$pf = new WC_Product_Factory();					
				self::addOtherItem( $content_array, array( 'empty' ), 3, $items );
				self::addOtherItem( $items, array( 'empty' ), 5, $items1 );
				
				foreach ($items1 as $key => $item) {					
				global $product, $post;		
				
				if( $key % 3 == 0 ){
					$class = '';
					$class = ( $items1[$key] != 'empty' ) ? 'col-md-4 item-sidebar' : 'col-md-4 item-center';			
			?>
				<div class="item-countdown <?php echo esc_attr( $class ); ?>">
						<?php } ?>
						<?php 
							if ($items1[$key] != 'empty') {
							$product = $pf->get_product( $item->ID );
							$start_time 	= get_post_meta( $item->ID, '_sale_price_dates_from', true );
							$countdown_date = get_post_meta( $item->ID, '_sale_price_dates_to', true );	
						?>	
							<?php if( $class == 'col-md-4 item-center' ) { ?>
								<div class="item-wrap">
									<div class="item-detail">			
										<div class="item-inner">							
											<div class="item-img products-thumb">			
												<a href="<?php the_permalink( $item->ID ); ?>" title="<?php echo get_the_title( $item->ID );?>">
													<?php echo get_the_post_thumbnail( $item->ID, 'shop_single' ); ?>
												</a>
												<?php echo sw_label_sales(); ?>
											</div>										
											<div class="item-content">
												<h4>
													<a href="<?php echo get_the_permalink( $item->ID ); ?>" title="<?php echo get_the_title( $item->ID );?>">
														<?php echo get_the_title( $item->ID ); ?>
													</a>
												</h4>
												<div class="item-bot">
												<!-- add to cart -->
												<?php woocommerce_template_loop_add_to_cart(); ?>
												<?php if ( $price_html = $product->get_price_html() ){?>
													<div class="item-price">
														<span>
															<?php echo $price_html; ?>
														</span>
													</div>
												<?php } ?>	
												</div>
												<div class="product-countdown" data-date="<?php echo esc_attr( $countdown_date ); ?>"  data-starttime="<?php echo esc_attr( $start_time ); ?>"></div>
											</div>
										</div>								
									</div>
								</div>
							<?php } else { ?>
								<div class="item-wrap clearfix">
									<div class="item-detail clearfix">											
										<div class="item-img pull-left">			
											<a href="<?php the_permalink( $item->ID ); ?>" title="<?php echo get_the_title( $item->ID );?>">
												<?php echo get_the_post_thumbnail( $item->ID, 'shop_catalog' ); ?>
											</a>
											<?php echo sw_label_sales(); ?>
										</div>										
										<div class="item-content">
											<h4>
												<a href="<?php echo get_the_permalink( $item->ID ); ?>" title="<?php echo get_the_title( $item->ID );?>">
													<?php echo get_the_title( $item->ID ); ?>
												</a>
											</h4>
											<div class="product-countdown" data-date="<?php echo esc_attr( $countdown_date ); ?>"  data-starttime="<?php echo esc_attr( $start_time ); ?>"></div>
											<div class="item-bot">
											<!-- add to cart -->
											<?php woocommerce_template_loop_add_to_cart(); ?>
											<?php if ( $price_html = $product->get_price_html() ){?>
												<div class="item-price">
													<span>
														<?php echo $price_html; ?>
													</span>
												</div>
											<?php } ?>
											</div>
										</div>
									</div>
								</div>
						<?php } }?>
					<?php if ( ( $key + 1 ) % 3 == 0 || ( $key+1 ) == count( $items1 )  ) { ?>	
				</div>
			<?php } } ?>
			</div>
		</div>       
	</div>
<?php
	} 
?>