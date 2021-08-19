<?php 
/**
* Form send email to admin
**/
?>
<div style="">
	<h4><?php echo esc_html__( 'Dear Admin', 'sw-woocatalog' ) ?>,</h4>
	<p><?php echo esc_html__( 'You have recieved a contact email to request a quote price of product with information', 'sw-woocatalog' ) ?>:</p>
	<div style="background: #eee; padding: 20px;border:1px solid #ccc; display: inline-block;">
		<p><span style="font-weight: bold;"><?php echo esc_html__( 'Product Name', 'sw-woocatalog' ) ?>: </span><a href="<?php echo get_permalink( $woocatalog_productid ); ?>"><?php echo get_the_title( $woocatalog_productid ); ?></a></p>
		<p><span style="font-weight: bold;"><?php echo esc_html__( 'Customer Name', 'sw-woocatalog' ) ?>: </span><?php echo esc_html( $woocatalog_name ); ?></p>
		<p><span style="font-weight: bold;"><?php echo esc_html__( 'Customer Email', 'sw-woocatalog' ) ?>: </span><?php echo esc_html( $woocatalog_email ); ?></p>
		<p><span style="font-weight: bold;"><?php echo esc_html__( 'Customer Message', 'sw-woocatalog' ) ?>: </span><?php echo esc_html( $woocatalog_message ); ?></p>
	</div>
</div>