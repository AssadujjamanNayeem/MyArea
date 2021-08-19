(function($){
"use strict";
$(window).resize(function(){
var $width=$(this).width();
if($width < 1199){
$('.primary-menu .nav .dropdown-toggle').each(function(){
$(this).attr('data-toggle', 'dropdown');
});
}});
if($('body').hasClass('sw-wooswatches')){
$('.sw-wooswatches .product-type-variable').each(function(){
var h_swatches=$(this).find('.sw-variation-wrapper').height() + 20;
$(this).find('.item-bottom').css('bottom', h_swatches);
});
}
$(window).load(function(){
if($.isFunction($.isotope)){
$('body').find('.blog-content-grid').isotope({
layoutMode:'masonry'
});
}});
$('.header-style6 .search-cate .search-home6').on('click', function(){
$('.top-form.top-search').toggleClass("open");
});
$(".revo_top .icon-search").on('click', function(){
$(".revo_top .top-form").fadeToggle();
$('.revo_top .icon-search').toggleClass("closex");
});
$('.header-style9 .search-home9 h3').on('click', function(){
$('.top-form.top-search').toggleClass("open");
});
$('.header-style7 .vertical_megamenu .mega-left-title').on('click', function(){
$('.header-style7 .vertical_megamenu').toggleClass("open");
});
$('.header-style8 .vertical_megamenu .mega-left-title').on('click', function(){
$('.header-style8 .vertical_megamenu').toggleClass("open");
});
$('.header-right .menu-confirmation .text-confirmation').on('click', function(){
$('.header-right .menu-confirmation').toggleClass("open");
});
$('.main-menu .header-close').on('click', function(){
$('.main-menu').removeClass("open");
});
$('.header-open').on('click', function(){
$('.main-menu').toggleClass("open");
});
$('.header-menu-categories .open-menu').on('click', function(){
$('.main-menu').toggleClass("open");
});
$('.footer-mstyle1 .footer-menu .footer-search a').on('click', function(){
$('.top-form.top-search').toggleClass("open");
});
$('.footer-mstyle1 .footer-menu .footer-more a').on('click', function(){
$('.menu-item-hidden').toggleClass("open");
});
$('.single-product.mobile-layout .social-share .title-share').on('click', function(){
$('.single-product.mobile-layout .social-share').toggleClass("open");
});
$('.single-post.mobile-layout .social-share .title-share').on('click', function(){
$('.single-post.mobile-layout .social-share').toggleClass("open");
});
$('.single-post.mobile-layout .social-share.open .title-share').on('click', function(){
$('.single-post.mobile-layout .social-share').removeClass("open");
});
$('.products-nav .filter-product').on('click', function(){
$('.products-wrapper .filter-mobile').toggleClass("open");
$('.products-wrapper').toggleClass('show-modal');
});
$('.products-nav .filter-product').on('click', function(){
if($(".products-wrapper .products-nav .filter-product").not(".filter-mobile")){
$('.products-wrapper').removeClass('show-modal');
}});
$('.header-mobile-style5 .header-top-mobile .header-right .search-mobile').on('click', function(){
$('.header-mobile-style5 .header-top-mobile .mobile-search').toggleClass('open');
});
$('.header-mobile-style5 .header-top-mobile .header-menu-categories .show_menu ').on('click', function(){
$('.header-mobile-style5 .header-top-mobile .header-menu-categories .vertical_megamenu').toggleClass('open');
});
$('.mobile-layout .back-history').on('click', function(){
window.history.back();
});
$('.footer-mstyle2 .footer-container .footer-open').on('click', function(){
$('.footer-mstyle2').toggleClass('open');
});
$('.footer-mstyle2 .mobile_menu2')
.find('li:gt(7)') 
.hide()
.end()
.each(function(){
if($(this).children('li').length > 8){
$(this).append($('<li><a><span class="menu-title">See more</span><span class="menu-img"></span></a></li>')
.addClass('showMore')
.on('click',function(){
if($(this).siblings(':hidden').length > 0){
$(this).html('<a><span class="menu-title">See less</span><span class="menu-img"></span></a>').siblings(':hidden').show(400);
}else{
$(this).html('<a><span class="menu-title">See more</span><span class="menu-img"></span></a>').show().siblings('li:gt(7)').hide(400);
}})
);
}});
$('.header-style1 .header-mid .sticky-search .fa-search').on('click', function(){
$('.header-style1 .header-mid .sticky-search').toggleClass("open");
});
$('.header-style2 .header-bottom .sticky-search .fa-search').on('click', function(){
$('.header-style2 .header-bottom .sticky-search').toggleClass("open");
});
$('.header-style5 .header-bottom .sticky-search .fa-search').on('click', function(){
$('.header-style5 .header-bottom .sticky-search').toggleClass("open");
});
$('.header-style14 .header-bottom .sticky-search .fa-search').on('click', function(){
$('.header-style14 .header-bottom .sticky-search').toggleClass("open");
});
$('.header-style8 .header-bottom .sticky-search').on('click', function(){
$('.header-style8 .header-mid .search-cate').slideToggle("slow");
});
$('.header-style9 .header-top .text-header-top .remove-banner').on('click', function(){
$('.header-style9 .header-top').toggleClass("close");
});
$('.header-style11 .header-mid .search-icon .fa-search').on('click', function(){
$('.header-style11 .header-mid .search-cate .revo_top .top-form.top-search').slideToggle();
});
$('.header-style10 .header-bottom .fa-search').on('click', function(){
$('.header-style10 .header-bottom .sticky-search').toggleClass("open");
});
$('.header-style7 .header-bottom .fa-search').on('click', function(){
$('.header-style7 .header-bottom .sticky-search').toggleClass("open");
});
$('.header-style12 .sw-setting').on('click', function(){
$('.header-style12 .sw-setting .mid-header3').slideToggle("open");
});
$('.header-style12 .banner-close').on('click', function(){
$('.header-style12 .top-banner').slideToggle("open");
});
$('.header-style12 .sticky-search i').on('click', function(){
$('.header-style12 .sticky-search .sticky-search-content').slideToggle("open");
});
$('.header-style21 .banner-close').on('click', function(){
$('.header-style21 .header-top').slideToggle("open");
});
$("a.compare").attr('title', custom_text.compare_text);
$(".yith-wcwl-add-button a").attr('title', custom_text.wishlist_text);
$("a.fancybox").attr('title', custom_text.quickview_text);
$("a.add_to_cart_button").attr('title', custom_text.cart_text);
$(document).ready(function(){
$('[data-toggle="tooltip"]').tooltip();
});
$('ul.orderby.order-dropdown li ul').hide();
$("ul.order-dropdown > li").each(function(){
$(this).hover(function(){
$('.products-wrapper').addClass('show-modal');
$(this).find('> ul').stop().fadeIn("fast");
}, function(){
$('.products-wrapper').removeClass('show-modal');
$(this).find('> ul').stop().fadeOut("fast");
});
});
$('.catalog-ordering .sort-count .current-li a').html($('.catalog-ordering .sort-count ul li.current a').html());
$(document).ready(function(){
$('.product-images').each(function(){
var $rtl=$('body').hasClass('rtl');
var $vertical=$(this).data('vertical');
var $img_slider=$(this).find('.product-responsive');
var video_link=$(this).data('video');
var $thumb_slider=$(this).find('.product-responsive-thumbnail');
var number_slider=($vertical) ? 4: 5;
var number_mobile=($vertical) ? 2: 4;
$img_slider.slick({
slidesToShow: 1,
slidesToScroll: 1,
fade: true,
arrows: false,
rtl: $rtl,
asNavFor: $thumb_slider,
infinite: false
});
$thumb_slider.slick({
slidesToShow: number_slider,
slidesToScroll: 1,
asNavFor: $img_slider,
arrows: true,
rtl: $rtl,
infinite: false,
vertical: $vertical,
verticalSwiping: $vertical,
focusOnSelect: true,
responsive: [
{
breakpoint: 480,
settings: {
slidesToShow: number_mobile
}},
{
breakpoint: 360,
settings: {
slidesToShow: 2 
}}
]
});
var el=$(this);
setTimeout(function(){
el.removeClass("loading");
var height=el.find('.product-responsive').outerHeight();
var target=el.find(' .item-video');
target.css({'height': height,'padding-top': (height - target.outerHeight())/2 });
var thumb_height=el.find('.product-responsive-thumbnail').outerHeight();
var thumb_target=el.find('.item-video-thumb');
thumb_target.css({ height: thumb_height,'padding-top':(thumb_height - thumb_target.outerHeight())/2 });
}, 1000);
if(video_link!=''){
$img_slider.append('<button data-type="popup" class="featured-video-button fa fa-video-camera" data-video="'+ video_link +'"></button>');
}});
});
$('.product-categories').each(function(){
var number=$(this).data('number') - 1;
var lesstext=$(this).data('lesstext');
var moretext=$(this).data('moretext');
if(number > 0){
$(this).find('> li:gt('+ number +')').hide().end();
if($(this).children('li').length > number){
$(this).append($('<li><a>'+ moretext +'   +</a></li>')
.addClass('showMore')
.on('click',function(){
if($(this).siblings(':hidden').length > 0){
$(this).html('<a>'+ lesstext +'   -</a>').siblings(':hidden').show(400);
}else{
$(this).html('<a>'+ moretext +'   +</a>').show().siblings(':gt('+ number +')').hide(400);
}})
);
}}
if($(this).hasClass('accordion-categories')){
$(this).find('li.cat-parent').append('<span class="child-category-more"></span>');
}});
$(document).on('click', '.child-category-more', function(){
$(this).parent().toggleClass('active');
$(this).parent().find('> ul.children').toggle(200);
});
var w_width=$(window).width();
if(w_width <=480){
jQuery('.mobile-layout .header-mobile-style5 .revo_resmenu')
.find(' > li:gt(6) ')
.hide()
.end()
.each(function(){
if($(this).children('li').length > 6){
$(this).append($('<li><a class="open-more-cat">More Categories</a></li>')
.addClass('showMore')
.on('click', function(){
if($(this).siblings(':hidden').length > 0){
$(this).html('<a class="close-more-cat">Close Categories</a>').siblings(':hidden').show(400);
}else{
$(this).html('<a class="open-more-cat">More Categories</a>').show().siblings('li:gt(6)').hide(400);
}})
);
}});
}
$('.accordion-heading').each(function(){
var $this=$(this), $body=$this.siblings('.accordion-body');
if(!$body.hasClass('in')){
$this.find('.accordion-toggle').addClass('collapsed');
}});
if($(window).width() < 768){
$('.footer .widget_nav_menu h2.widgettitle').append('<span class="icon-footer"></span>');
$('.footer .wpb_content_element .info-footer h3').append('<span class="icon-footer"></span>');
$(".footer .widget_nav_menu h2.widgettitle").each(function(){
$(this).on('click', function(){
$(this).parent().find("ul.menu").slideToggle();
});
});
$(".footer .wpb_content_element .info-footer h3").each(function(){
$(this).on('click', function(){
$(this).parent().find("ul").slideToggle();
});
});
}
if($(window).width() < 768){
$('.footer .footer-style7 .wpb_content_element .newletter h3').append('<span class="icon-footer"></span>');
$(".footer .footer-style7 .wpb_content_element h3").each(function(){
$(this).on('click', function(){
$(this).parent().find(".wrapper-footer").slideToggle();
});
});
$('.footer .footer-home10 .wpb_content_element h3').append('<span class="icon-footer"></span>');
$(".footer .footer-home10 .wpb_content_element h3").each(function(){
$(this).on('click', function(){
$(this).parent().find(".wrapper-footer").slideToggle();
});
});
}
$("#revo-totop").hide();
var wh=$(window).height();
var whtml=$(document).height();
$(window).scroll(function (){
if($(this).scrollTop() > whtml/10){
$('#revo-totop').fadeIn();
}else{
$('#revo-totop').fadeOut();
}});
$('#revo-totop').click(function (){
$('body,html').animate({
scrollTop: 0
}, 800);
return false;
});
$('.wpb_map_wraper').on('click', function (){
$('.wpb_map_wraper iframe').css("pointer-events", "auto");
});
$(".wpb_map_wraper").on('mouseleave', function(){
$('.wpb_map_wraper iframe').css("pointer-events", "none");
});
$(window).load(function(){
if($('body').hasClass('tax-product_cat')||$('body').hasClass('post-type-archive-product')||$('body').hasClass('tax-dc_vendor_shop')){
$('.grid-view').on('click',function(){
$('.list-view').removeClass('active');
$('.grid-view').addClass('active');
jQuery("ul.products-loop").fadeOut(300, function(){
$(this).removeClass("list").fadeIn(300).addClass('grid');
});
});
$('.list-view').on('click',function(){
$('.grid-view').removeClass('active');
$('.list-view').addClass('active');
$("ul.products-loop").fadeOut(300, function(){
jQuery(this).addClass("list").fadeIn(300).removeClass('grid');
});
});
}});
$(window).scroll(function(){
var whtop=$(window).scrollTop();
if(whtop > 0){
$(".header-style4").addClass("header-ontop");
}else{
$(".header-style4").removeClass("header-ontop");
}});
$(".sw-woo-tab").fadeIn(300, function(){
var el=$(this);
setTimeout(function(){
el.removeClass("loading");
}, 1000);
});
$(".responsive-slider").fadeIn(300, function(){
var el=$(this);
setTimeout(function(){
el.removeClass("loading");
}, 1000);
});
}(jQuery));
function submitform(){
if(document.commentform.comment.value==''||document.commentform.author.value==''||document.commentform.email.value==''){
alert('Please fill the required field.');
return false;
} else return true;
}
(function($){
if(!($('#header').hasClass('header-style7'))){
$('.vertical-megamenu').each(function(){
var number=$(this).parent().data('number') - 1;
var lesstext=$(this).parent().data('lesstext');
var moretext=$(this).parent().data('moretext');
$(this).find(' > li:gt('+ number +')').hide().end();
if($(this).children('li').length > number){
$(this).append($('<li><a class="open-more-cat">'+ moretext +'</a></li>')
.addClass('showMore')
.on('click', function(){
if($(this).siblings(':hidden').length > 0){
$(this).html('<a class="close-more-cat">'+ lesstext +'</a>').siblings(':hidden').show(400);
}else{
$(this).html('<a class="open-more-cat">'+ moretext +'</a>').show().siblings(':gt('+ number +')').hide(400);
}})
);
}});
}
$(".widget_nav_menu li.menu-compare a").hover(function(){
$(this).css('cursor','pointer').attr('title', custom_text.compare_text);
}, function(){
$(this).css('cursor','auto');
});
$(".widget_nav_menu li.menu-wishlist a").hover(function(){
$(this).css('cursor','pointer').attr('title', custom_text.wishlist_text);
}, function(){
$(this).css('cursor','auto');
});
var w_width=$(window).width();
if($('#header').hasClass('header-style7')&&w_width >=1024){
function h7_vertical_align(){
var w_height=$(window).outerHeight();
var h7_vtarget=$('.header-style7 .vertical_megamenu .wrapper_vertical_menu');
var h7_offset=w_height - h7_vtarget.height();
return h7_vtarget.parents('.vertical_megamenu').css('top',(h7_offset/2 + 50));
}
$(document).ready(function(){
h7_vertical_align();
});
$(window).on('resize', function(){
h7_vertical_align();
});
var h7_rtl=$('body').hasClass('rtl');
$('.header-style7 .vertical_megamenu .mega-left-title').on('click', function(e){
var parent=$('.header-style7 .vertical_megamenu');
var width=parent.width();
if(!h7_rtl){
left=parent.css('left');
if(parseFloat(left) < -10){
parent.animate({
left: '0px',
}, "slow");
parent.find(' .mega-left-title').animate({
left:  width ,
}, "slow");
}else{
parent.animate({
left: '-' + width ,
}, "slow");
parent.find(' .mega-left-title').animate({
left: '0px',
}, "slow");
}}else{
right=parent.css('right');
if(parseFloat(right) < -10){
parent.animate({
right: '0px',
}, "slow");
parent.find(' .mega-left-title').animate({
right:  width ,
}, "slow");
}else{
parent.animate({
right: '-' + width ,
}, "slow");
parent.find(' .mega-left-title').animate({
right: '0px',
}, "slow");
}}
if($(this).hasClass('active')){
$(this).removeClass('active');
}
e.preventDefault();
});
}
$(window).scroll(function(){
if($('body').hasClass('mobile-layout')){
var target=$('.mobile-layout #header-page');
var sticky_nav_mobile_offset=$(".mobile-layout #header-page").offset();
if(sticky_nav_mobile_offset!=null){
var sticky_nav_mobile_offset_top=sticky_nav_mobile_offset.top;
var scroll_top=$(window).scrollTop();
if(scroll_top > sticky_nav_mobile_offset_top){
$(".mobile-layout #header-page").addClass('sticky-mobile');
}else{
$(".mobile-layout #header-page").removeClass('sticky-mobile');
}}
}});
var w_width=$(window).width();
if($('#header').hasClass('header-style8')&&w_width >=1024){
function h8_vertical_align(){
var w_height=$(window).outerHeight();
var h8_vtarget=$('.header-style8 .vertical_megamenu .wrapper_vertical_menu');
var h8_offset=w_height - h8_vtarget.height();
return h8_vtarget.parents('.vertical_megamenu').css('top',(h8_offset/2 + 50));
}
$(document).ready(function(){
h8_vertical_align();
});
$(window).on('resize', function(){
h8_vertical_align();
});
var h8_rtl=$('body').hasClass('rtl');
$('.header-style8 .vertical_megamenu .mega-left-title').on('click', function(e){
var parent=$('.header-style8 .vertical_megamenu');
var width=parent.width();
if(!h8_rtl){
left=parent.css('left');
if(parseFloat(left) < -10){
parent.animate({
left: '0px',
}, "slow");
parent.find(' .mega-left-title').animate({
left:  width ,
}, "slow");
}else{
parent.animate({
left: '-' + width ,
}, "slow");
parent.find(' .mega-left-title').animate({
left: '0px',
}, "slow");
}}else{
right=parent.css('right');
if(parseFloat(right) < -10){
parent.animate({
right: '0px',
}, "slow");
parent.find(' .mega-left-title').animate({
right:  width ,
}, "slow");
}else{
parent.animate({
right: '-' + width ,
}, "slow");
parent.find(' .mega-left-title').animate({
right: '0px',
}, "slow");
}}
if($(this).hasClass('active')){
$(this).removeClass('active');
}
e.preventDefault();
});
}
$('form#login_ajax').on('submit', function(e){
var target=$(this);
var usename=target.find('#username').val();
var pass=target.find('#password').val();
if(usename.length==0||pass.length==0){
target.find('#login_message').addClass('error').html(custom_text.message);
return false;
}
target.addClass('loading');
$.ajax({
type: 'POST',
dataType: 'json',
url: custom_text.ajax_url,
headers: { 'api-key':target.find('#woocommerce-login-nonce').val() },
data: {
'action': 'revo_custom_login_user',
'username': target.find('#username').val(),
'password': target.find('#password').val(),
'security': target.find('#woocommerce-login-nonce').val()
},
success: function(data){
target.removeClass('loading');
target.find('#login_message').html(data.message);
if(data.loggedin==false){
target.find('#username').css('border-color', 'red');
target.find('#password').css('border-color', 'red');
target.find('#login_message').addClass('error');
}
if(data.loggedin==true){
target.find('#username').removeAttr('style');
target.find('#password').removeAttr('style');
document.location.href=data.redirect;
target.find('#login_message').removeClass('error');
}}
});
e.preventDefault();
});
$('.resmenu-container-sidebar .more-menu > a').on('click', function(e){
$(this).parent().find('>ul').toggle();
e.preventDefault();
});
function sw_buynow_variation_product(){
var element=$('.single-product');
var target=$('.single-product .variations_form');
var bt_addcart=target.find('.single_add_to_cart_button');
var variation=target.find('.variation_id').val();
var bt_buynow=element.find('.button-buynow');
var url=bt_buynow.data('url');
var qty=$('.single-product input.qty').val();
if(typeof variation!='undefined'){
if(variation==0){
bt_buynow.addClass('disabled');
}else{
bt_buynow.removeClass('disabled');
}
if(variation!=''){
bt_buynow.attr('href', url + '='+variation + '&quantity='+ qty);
}else{
bt_buynow.attr('href', url + '&quantity='+ qty);
}}else{
bt_buynow.attr('href', url + '&quantity='+ qty);
}}
$(window).on('change', function(){
sw_buynow_variation_product();
});
$(document).ready(function(){
sw_buynow_variation_product();
});
})(jQuery);
jQuery(document).ready(function ($){
$('.header-style9 .header-top .text-header-top .remove-banner').on('click', function(){
$('.header-style9 .header-top').toggleClass("hidden");
});
});