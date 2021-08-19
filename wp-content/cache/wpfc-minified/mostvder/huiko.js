jQuery(document).ready(function($){
var money=fx.noConflict();
var current_currency=wc_currency_converter_params.current_currency;
var currency_codes=jQuery.parseJSON(wc_currency_converter_params.currencies);
var currency_position=wc_currency_converter_params.currency_pos;
var currency_decimals=wc_currency_converter_params.num_decimals;
var remove_zeros=wc_currency_converter_params.trim_zeros;
money.rates=wc_currency_converter_params.rates;
money.base=wc_currency_converter_params.base;
money.settings.from=wc_currency_converter_params.currency;
money=set_default_rate_on_missing_currency(money, wc_currency_converter_params.currency);
money=set_default_rate_on_missing_currency(money, wc_currency_converter_params.current_currency);
if(money.settings.from=='RMB'){
money.settings.from='CNY';
}
function set_default_rate_on_missing_currency(money, currency){
if(! money.rates[ currency ]){
money.rates[ currency ]=parseFloat(wc_currency_converter_params.currency_rate_default);
}
return money;
}
function switch_currency(to_currency){
if(wc_currency_converter_params.symbol_positions[ to_currency ]){
currency_position=wc_currency_converter_params.symbol_positions[ to_currency ];
}
money=set_default_rate_on_missing_currency(money, to_currency);
jQuery('span.amount').each(function(){
var original_code=jQuery(this).attr("data-original");
if(typeof original_code=='undefined'||original_code==false){
jQuery(this).attr("data-original", jQuery(this).html());
}
var original_price=jQuery(this).attr("data-price");
if(typeof original_price=='undefined'||original_price==false){
var original_price=jQuery(this).html();
jQuery('<del></del>' + original_price).find('del').remove();
original_price=original_price.replace(wc_currency_converter_params.currency_format_symbol, '');
original_price=original_price.replace(wc_currency_converter_params.thousand_sep, '');
original_price=original_price.replace(wc_currency_converter_params.decimal_sep, '.');
original_price=original_price.replace(/[^0-9\.]/g, '');
original_price=parseFloat(original_price);
jQuery(this).attr("data-price", original_price);
}
price=money(original_price).from(money.settings.from).to(to_currency);
price=price.toFixed(currency_decimals);
price=accounting.formatNumber(price, currency_decimals, wc_currency_converter_params.thousand_sep, wc_currency_converter_params.decimal_sep);
if(remove_zeros){
price=price.replace(wc_currency_converter_params.zero_replace, '');
}
if(currency_codes[ to_currency ]){
if(currency_position=='left'){
jQuery(this).html(currency_codes[ to_currency ] + price);
}else if(currency_position=='right'){
jQuery(this).html(price + "" + currency_codes[ to_currency ]);
}else if(currency_position=='left_space'){
jQuery(this).html(currency_codes[ to_currency ] + " " + price);
}else if(currency_position=='right_space'){
jQuery(this).html(price + " " + currency_codes[ to_currency ]);
}}else{
jQuery(this).html(price + " " + to_currency);
}
jQuery(this).attr('title', wc_currency_converter_params.i18n_oprice + original_price);
});
jQuery('#shipping_method option').each(function(){
var original_code=jQuery(this).attr("data-original");
if(typeof original_code=='undefined'||original_code==false){
original_code=jQuery(this).text();
jQuery(this).attr("data-original", original_code);
}
var current_option=original_code;
current_option=current_option.split(":");
if(!current_option[1]||current_option[1]=='') return;
price=current_option[1];
if(!price) return;
price=price.replace(wc_currency_converter_params.currency_format_symbol, '');
price=price.replace(wc_currency_converter_params.thousand_sep, '');
price=price.replace(wc_currency_converter_params.decimal_sep, '.');
price=price.replace(/[^0-9\.]/g, '');
price=parseFloat(price);
price=money(price).to(to_currency);
price=price.toFixed(currency_decimals);
price=accounting.formatNumber(price, currency_decimals, wc_currency_converter_params.thousand_sep, wc_currency_converter_params.decimal_sep);
if(remove_zeros){
price=price.replace(wc_currency_converter_params.zero_replace, '');
}
jQuery(this).html(current_option[0] + ": " + price  + " " + to_currency);
});
price_filter_update(to_currency);
jQuery('body').trigger('currency_converter_switch', [to_currency]);
jQuery('ul.currency_switcher li a').removeClass('active');
jQuery('ul.currency_switcher li a[data-currencycode="' + current_currency + '"]').addClass('active');
jQuery('select.currency_switcher').val(current_currency);
}
function price_filter_update(to_currency){
if(to_currency){
jQuery('.ui-slider').each(function(){
theslider=jQuery(this);
values=theslider.slider("values");
original_price="" + values[1];
original_price=original_price.replace(wc_currency_converter_params.currency_format_symbol, '');
original_price=original_price.replace(wc_currency_converter_params.thousand_sep, '');
original_price=original_price.replace(wc_currency_converter_params.decimal_sep, '.');
original_price=original_price.replace(/[^0-9\.]/g, '');
original_price=parseFloat(original_price);
price_max=money(original_price).to(to_currency);
original_price="" + values[0];
original_price=original_price.replace(wc_currency_converter_params.currency_format_symbol, '');
original_price=original_price.replace(wc_currency_converter_params.thousand_sep, '');
original_price=original_price.replace(wc_currency_converter_params.decimal_sep, '.');
original_price=original_price.replace(/[^0-9\.]/g, '');
original_price=parseFloat(original_price);
price_min=money(original_price).to(to_currency);
jQuery('.price_slider_amount').find('span.from').html(price_min.toFixed(2) + " " + to_currency);
jQuery('.price_slider_amount').find('span.to').html(price_max.toFixed(2) + " " + to_currency);
});
}}
jQuery(document).ready(function($){
jQuery('body').on("price_slider_create price_slider_slide price_slider_change", function(){
price_filter_update(current_currency);
});
price_filter_update(current_currency);
});
jQuery('body').bind('wc_fragments_refreshed wc_fragments_loaded show_variation updated_checkout updated_shipping_method added_to_cart cart_page_refreshed cart_widget_refreshed updated_addons', function(){
if(current_currency){
switch_currency(current_currency);
}});
jQuery(document.body).on('wc_booking_form_changed', function(){
if(current_currency){
switch_currency(current_currency);
}});
if(current_currency){
switch_currency(current_currency);
}else{
jQuery('ul.currency_switcher li a[data-currencycode="' + wc_currency_converter_params.currency + '"]').addClass('active');
jQuery('select.currency_switcher').val(wc_currency_converter_params.currency);
}
jQuery(document.body)
.on('click', 'a.wc-currency-converter-reset', function(){
jQuery('span.amount, #shipping_method option').each(function(){
var original_code=jQuery(this).attr("data-original");
if(typeof original_code!=='undefined'&&original_code!==false){
jQuery(this).html(original_code);
}});
jQuery('ul.currency_switcher li a').removeClass('active');
jQuery('ul.currency_switcher li a[data-currencycode="' + wc_currency_converter_params.currency + '"]').addClass('active');
jQuery('select.currency_switcher').val(wc_currency_converter_params.currency);
jQuery.cookie('woocommerce_current_currency', '', { expires: 7, path: '/' });
current_currency='';
jQuery('body').trigger('currency_converter_reset');
if(jQuery('.price_slider').size() > 0){
jQuery('body').trigger('price_slider_slide', [jQuery(".price_slider").slider("values", 0), jQuery(".price_slider").slider("values", 1)]);
}
return false;
})
.on('click', 'ul.currency_switcher li a:not(".reset")', function(){
current_currency=jQuery(this).attr('data-currencycode');
switch_currency(current_currency);
jQuery.cookie('woocommerce_current_currency', current_currency, { expires: 7, path: '/' });
return false;
})
.on('change', 'select.currency_switcher', function(){
current_currency=jQuery(this).val();
switch_currency(current_currency);
jQuery.cookie('woocommerce_current_currency', current_currency, { expires: 7, path: '/' });
return false;
});
$('.currency_switcher li a').on('click', function(){
$current=$(this).attr('data-currencycode');
$('.currency_w > li > a').html($current);
});
var currency_show=$('.currency_switcher > li > a.active').html();
$('.currency_w > li > a').html(currency_show);
});
(function($){
$.fn.megamenu=function(options){
options=jQuery.extend({
wrap:'.nav-mega',
speed: 0,
justify: "",
rtl: false,
mm_timeout: 0
}, options);
var menuwrap=$(this);
buildmenu(menuwrap);
function buildmenu(mwrap){
mwrap.find('.revo-mega > li').each(function(){
var menucontent=$(this).find(".dropdown-menu");
var menuitemlink=$(this).find(".item-link:first");
var menucontentinner=$(this).find(".nav-level1");
var mshow_timer=0;
var mhide_timer=0;
var li=$(this);
var islevel1=(li.hasClass('level1')) ?true:false;
var havechild=(li.hasClass('dropdown')) ?true:false;
var menu_event=$('body').hasClass('menu-click');
if(menu_event){
li.on('click', function(){
positionSubMenu(li, islevel1);
$(this).find('>ul').toggleClass('visible');
});
$(document).mouseup(function (e){
var container=li.find('>ul');
if(!container.is(e.target)&&container.has(e.target).length===0){
container.removeClass('visible');
}});
li.find('> a[data-toogle="dropdown"]').on('click', function(e){
e.preventDefault();
});
}else{
li.mouseenter(function(el){
li.find('>ul').addClass('visible');
if(havechild){
positionSubMenu(li, islevel1);
}}).mouseleave(function(el){
li.find('>ul').removeClass('visible');
});
}});
}
function positionSubMenu(el, islevel1){
menucontent=$(el).find(".dropdown-menu");
menuitemlink=$(el).find(".item-link");
menucontentinner=$(el).find(".nav-level1");
wrap_O=(options.rtl==false) ? menuwrap.offset().left:($(window).width() - (menuwrap.offset().left + menuwrap.outerWidth()));
wrap_W=menuwrap.outerWidth();
menuitemli_O=(options.rtl==false) ? menuitemlink.parent('li').offset().left:($(window).width() - (menuitemlink.parent('li').offset().left + menuitemlink.parent('li').outerWidth()));
menuitemli_W=menuitemlink.parent('li').outerWidth();
menuitemlink_H=menuitemlink.outerHeight();
menuitemlink_W=menuitemlink.outerWidth();
menuitemlink_O=(options.rtl==false) ? menuitemlink.offset().left:($(window).width() - (menuitemlink.offset().left + menuitemlink.outerWidth()));
menucontent_W=menucontent.outerWidth();
if(islevel1){
if(options.justify=="left"){
var wrap_RE=wrap_O + wrap_W;
var menucontent_RE=menuitemlink_O + menucontent_W;
if(menucontent_RE >=wrap_RE){
if(options.rtl==false){
menucontent.css({
'left':wrap_RE - menucontent_RE + menuitemlink_O - menuitemli_O + 'px'
});
}else{
menucontent.css({
'left': 'auto',
'right':wrap_RE - menucontent_RE + menuitemlink_O - menuitemli_O + 'px'
});
}}
}}else{
_leftsub=0;
menucontent.css({
'top': menuitemlink_H*0 +"px",
'left': menuitemlink_W + _leftsub + 'px'
})
if(options.justify=="left"){
var wrap_RE=wrap_O + wrap_W;
var menucontent_RE=menuitemli_O + menuitemli_W + _leftsub + menucontent_W;
if(menucontent_RE >=wrap_RE){
menucontent.css({
'left': _leftsub - menucontent_W + 'px'
});
}}else if(options.justify=="right"){
var wrap_LE=wrap_O;
var menucontent_LE=menuitemli_O - menucontent_W + _leftsub;
if(menucontent_LE <=wrap_LE){
menucontent.css({
'left': menuitemli_W - _leftsub + 'px'
});
}else{
menucontent.css({
'left':  - _leftsub - menucontent_W + 'px'
});
}}
}}
};
jQuery(function($){
var rtl=$('body').hasClass('rtl');
$('.header-mid > .container').megamenu({
wrap:'.nav-mega',
justify: 'left',
rtl: rtl
});
$('.header-bottom > .container').megamenu({
wrap:'.nav-mega',
justify: 'left',
rtl: rtl
});
});
})(jQuery);