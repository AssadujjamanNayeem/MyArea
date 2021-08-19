(function($) {
	"use strict";
	
	$('.woocatalog-contact > a').on( 'click', function(e){
		var target = $(this).attr( 'href' );
		$('html,body').animate({
			scrollTop: $(target).parents('.tabs').offset().top - 150
		}, 'slow');
		var tab_wrapper = $( '.single-product .tabs' );
		if( $('body').hasClass( 'single-product-style2' ) || $('body').hasClass( 'single-product-style3' ) ){
			tab_wrapper.find( '.panel .accordion-toggle' ).addClass( 'collapsed' );
			tab_wrapper.find( '.panel .panel-collapse' ).removeClass( 'in' ).css( 'height', 0 );
			tab_wrapper.find( '.panel a[href="'+ target +'"]' ).removeClass( 'collapsed' );
			$( target ).addClass( 'in' ).css( 'height', 'auto' );
		}else{
			tab_wrapper.find( 'ul > li' ).removeClass( 'active' );
			tab_wrapper.find( 'ul > li > a[href="'+ target +'"]' ).parent().addClass( 'active' );
			tab_wrapper.find( '.tab-pane' ).removeClass( 'active' );
			tab_wrapper.find( '.wc-tab' ).css( 'display', 'none' );
			$( target ).addClass( 'active' );
			$( target ).css( 'display', 'block' );
		}
		e.preventDefault();
	});
	
	$(document).on('submit', 'form#woocatalog_contact', function(e){
		var $this = $(this);
		$this.addClass( 'loading' );
		var elements = $(this).find('input, select, textarea').serialize();
		var ajaxurl = woocatalog.ajaxurl;
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: ajaxurl,
			headers: { 'api-key': 'sw_woocatalog_ajax_api' },
			data: {
				action: 'sw_woocatalog_send_contact',
				data_values: elements,
			},
			success: function(result){
				$this.removeClass( 'loading' );
				var messages = ( result.error == 0 ) ? '<span class="booking-success">' + result.message + '</span>' : '<span class="booking-error">' + result.message + '</span>';
				$( '#woocatalog_alert' ).html( messages );
				if( result.error == 0 ){
					setTimeout(function(){
						location.reload();
					}, 1500);
				}
			}
		});	
		e.preventDefault();
	});
})(jQuery);