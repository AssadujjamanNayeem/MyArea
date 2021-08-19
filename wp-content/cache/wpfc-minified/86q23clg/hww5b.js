(function(){function t(){var t,e;return(e=document.createElement("script")).src=_zxcvbnSettings.src,e.type="text/javascript",e.async=!0,(t=document.getElementsByTagName("script")[0]).parentNode.insertBefore(e,t)}null!=window.attachEvent?window.attachEvent("onload",t):window.addEventListener("load",t,!1)}).call(this);
(function($){
'use strict';
$(document).ready(function (){
$('body').on('adding_to_cart', function(event, $button, data){
if($button&&$button.hasClass('vc_gitem-link')){
$button
.addClass('vc-gitem-add-to-cart-loading-btn')
.parents('.vc_grid-item-mini')
.addClass('vc-woocommerce-add-to-cart-loading')
.append($('<div class="vc_wc-load-add-to-loader-wrapper"><div class="vc_wc-load-add-to-loader"></div></div>'));
}}).on('added_to_cart', function(event, fragments, cart_hash, $button){
if('undefined'===typeof ($button)){
$button=$('.vc-gitem-add-to-cart-loading-btn');
}
if($button&&$button.hasClass('vc_gitem-link')){
$button
.removeClass('vc-gitem-add-to-cart-loading-btn')
.parents('.vc_grid-item-mini')
.removeClass('vc-woocommerce-add-to-cart-loading')
.find('.vc_wc-load-add-to-loader-wrapper').remove();
}});
});
})(window.jQuery);