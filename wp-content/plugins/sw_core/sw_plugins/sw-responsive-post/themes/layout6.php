<?php 
	/**
		** Theme: Responsive Slider
		** Author: Smartaddons
		** Version: 1.0
	**/
	$default = array(
			'category' => $category, 
			'orderby' => $orderby,
			'order' => $order, 
			'numberposts' => $numberposts,
	);
	$list = get_posts($default);
	do_action( 'before' ); 
	$id = 'sw_reponsive_post_slider_'.rand().time();
	if ( count($list) > 0 ){
?>
<div class="clear"></div>
<div id="<?php echo esc_attr( $id ) ?>" class="responsive-post-slider6 responsive-slider clearfix loading" data-lg="<?php echo esc_attr( $columns ); ?>" data-md="<?php echo esc_attr( $columns1 ); ?>" data-sm="<?php echo esc_attr( $columns2 ); ?>" data-xs="<?php echo esc_attr( $columns3 ); ?>" data-mobile="<?php echo esc_attr( $columns4 ); ?>" data-speed="<?php echo esc_attr( $speed ); ?>" data-scroll="<?php echo esc_attr( $scroll ); ?>" data-interval="<?php echo esc_attr( $interval ); ?>" data-autoplay="<?php echo esc_attr( $autoplay ); ?>">
	<div class="resp-slider-container">
		<div class="block-title">
		<?php echo ( $title2 != '' ) ? '<h3>'. esc_html( $title2 ) .'</h3>' : ''; ?>
		<?php echo ( $description != '' ) ? '<p>'. esc_html( $description ) .'</p>' : ''; ?>
		</div>
		<div class="slider responsive">
			<?php foreach ($list as $post){ ?>
				<?php if($post->post_content != Null) { ?>
				<div class="item widget-pformat-detail">
					<div class="item-inner">								
						<div class="item-detail">
							<?php 
								$feat_image_url = wp_get_attachment_url( get_post_thumbnail_id( $post->ID ) );
								if ( $feat_image_url ){ 
							?>
							<div class="img_over">
								<a href="<?php echo get_permalink($post->ID)?>" >
								<?php 								
									$width  = ( $img_w ) ? $img_w : 370;
									$height = ( $img_h ) ? $img_h : 240;
									$image = sw_image_resize( $feat_image_url, $width, $height, $crop );
									echo '<img src="'. esc_url( $image['url'] ) .'" alt="'. esc_attr( $post->post_title ) .'">';
								?>
								</a>								
							</div>
							<?php } ?>
							<div class="entry-content">
								<div class="entry-date">
									<div class="day-time"><?php echo get_the_time( 'd', $post->ID );?></div>
									<div class="month-time"><?php echo get_the_time( 'M', $post->ID );?></div>
								</div>
								<div class="item-title">
									<h4><a href="<?php echo get_permalink($post->ID)?>"><?php echo $post->post_title;?></a></h4>
								</div>
								<div class="entry-meta">
									<div class="entry-tag"><?php echo get_the_tag_list('<i class="fa fa-tags"></i>',', ','', $post->ID);?></div>
								</div>
								<div class="description">
									<?php 										
										$content = self::ya_trim_words($post->post_content, $length, ' ');							
										echo $content;
									?>
								</div>
								<div class="readmore"><a href="<?php echo get_permalink($post->ID);?>" title="View more" ><?php esc_html_e('Read more','sw_core');?></a></div>
							</div>
						</div>
					</div>
				</div>
				<?php } ?>
			<?php }?>
		</div>
	</div>
</div>
<?php } ?>