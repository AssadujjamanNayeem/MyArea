<?php 
global $wpdb;
	$widget_id = isset( $widget_id ) ? $widget_id : 'category_slide_'.$this->generateID();
	$max_page = $this->sw_count_category( $numberposts );
?>
<div id="<?php echo 'ajax_listing_' . $widget_id; ?>" class="sw-ajax-categories">
	<?php	if( $title1 != '' ){ ?>
	<div class="block-title">
		<h3><span><?php echo $title1; ?></span></h3>
	</div>
	<?php } ?>
	<div class="resp-listing-container clearfix">
	<?php
		$terms = get_terms( 'product_cat', array( 'parent' => 0, 'hide_empty' => false, 'number' => $numberposts ) );
		foreach( $terms as $term ){
			if( $term ) :
				$thumbnail_id 	= get_term_meta( $term->term_id, 'thumbnail_id', true );
				$thumb = wp_get_attachment_image_src( $thumbnail_id, 'full' );
				$width  = ( $img_w ) ? $img_w : 210;
				$height = ( $img_h ) ? $img_h : 270;
	?>
			<div class="item item-product-cat">
				<?php if( $thumb && isset( $thumb[0] ) ) { ?>
				<div class="item-image">
					<a href="<?php echo get_term_link( $term->term_id, 'product_cat' ); ?>">
					<?php 						
						$image = sw_image_resize( $thumb[0], $width, $height, $crop );
						echo '<img src="'. esc_url( $image['url'] ) .'" alt="'. esc_attr( $term->title ) .'">';
					?>
					</a>
				</div>
				<?php } ?>
				<div class="item-content">
					<h3><a href="<?php echo get_term_link( $term->term_id, 'product_cat' ); ?>"><?php echo esc_html( $term->name ); ?></a></h3>
				</div>
			</div>
		<?php endif; ?>
	<?php } ?>
	</div>
	<a href="javascript:void(0)" class="btn-loadmore" data-maxpage="<?php echo esc_attr( $max_page ); ?>" data-length="<?php echo esc_attr( $title_length ) ?>" data-ajaxurl="<?php echo esc_url( sw_ajax_url() ) ?>" data-number="<?php echo esc_attr( $numberposts ) ?>" data-title="<?php esc_html_e( 'More Categories', 'sw_woocommerce' ) ?>" data-title_loaded="<?php esc_html_e( 'All Categories Loaded', 'sw_woocommerce' ) ?>"></a>
</div>		