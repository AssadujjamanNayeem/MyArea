<?php
/**
 * Single Product Price, including microdata for SEO
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/single-product/price.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see     https://docs.woocommerce.com/document/template-structure/
 * @author  WooThemes
 * @package WooCommerce/Templates
 * @version 3.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $product;
$wc_price = ( function_exists( 'wc_get_price_to_display' ) ) ? wc_get_price_to_display( $product ) : $product->get_display_price();

?>
<div itemprop="offers">
	<p class="price"><?php echo sprintf( '%s', $product->get_price_html() ); ?></p>
</div>
<?php if( !revo_mobile_check() ) :?>
<div class="product-info product_meta">
	<?php if ( wc_product_sku_enabled() && ( $product->get_sku() || $product->is_type( 'variable' ) ) ) : ?>

		<span class="sku_wrapper"><?php esc_html_e( 'SKU:', 'revo' ); ?> <span class="sku"><?php echo sprintf( ( $sku = $product->get_sku() ) ? '%s' : esc_html__( 'N/A', 'revo' ), $sku ); ?></span></span>

	<?php endif; ?>
</div>
<?php endif; ?>
