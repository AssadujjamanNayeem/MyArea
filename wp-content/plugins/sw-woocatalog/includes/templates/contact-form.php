<?php global $product; ?>
<form action="" id="woocatalog_contact">
	<div class="input-wrapper">
		<label for=""><?php echo esc_html__( 'Your Name', 'sw-woocatalog' ); ?> </label>
		<input type="text" name="woocatalog_name" class="input-text"/>
	</div>
	<div class="input-wrapper">
		<label for=""><?php echo esc_html__( 'Your Email', 'sw-woocatalog' ); ?> </label>
		<input type="email" name="woocatalog_email" class="input-text"/>
	</div>
	<div class="textarea-wrapper">
		<label for=""><?php echo esc_html__( 'Your Message', 'sw-woocatalog' ); ?> </label>
		<textarea name="woocatalog_message" rows="5"></textarea>
	</div>
	<button type="submit"><?php echo esc_html__( 'Send', 'sw-woocatalog' ); ?></button>
	<input type="hidden" name="woocatalog_productid" value="<?php echo esc_attr( $product->get_id() ); ?>"/>
	<div id="woocatalog_alert"></div>

</form>