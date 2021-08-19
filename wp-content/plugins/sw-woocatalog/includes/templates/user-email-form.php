<?php 
/**
* Form send email to user
**/
?>

<div>
	<h4><?php echo sprintf( esc_html__( 'Dear %s', 'sw-woocatalog' ), $woocatalog_name ) ?>,</h4>
	<p><?php echo esc_html__( 'We have recieved a request a quote price of product with information', 'sw-woocatalog' ) ?>:</p>
	<div style="background: #eee; padding: 20px;border:1px solid #999">
		<p><span style="font-weight: bold;"><?php echo esc_html__( 'Product Name', 'sw-woocatalog' ) ?>: </span><a href="<?php echo get_permalink( $woocatalog_productid ); ?>"><?php echo get_the_title( $woocatalog_productid ); ?></a></p>
		<p><span style="font-weight: bold;"><?php echo esc_html__( 'Customer Name', 'sw-woocatalog' ) ?>: </span><?php echo esc_html( $woocatalog_name ); ?></p>
		<p><span style="font-weight: bold;"><?php echo esc_html__( 'Customer Email', 'sw-woocatalog' ) ?>: </span><?php echo esc_html( $woocatalog_email ); ?></p>
		<p><span style="font-weight: bold;"><?php echo esc_html__( 'Customer Message', 'sw-woocatalog' ) ?>: </span><?php echo esc_html( $woocatalog_message ); ?></p>
	</div>
	<p><?php echo sprintf( __( 'We will contact with you on 24 hours working day. If you have any question, please feel free contact us at email: %s ', 'sw-woocatalog' ), $from ); ?></p>
	<hr/>
	<p><?php echo esc_html__( 'Thanks and Best Regard!', 'sw-woocatalog' ) ?></p>
</div>