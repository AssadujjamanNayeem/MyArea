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
!function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)}(function(a){var e,t,n,i;function r(e,t){var n,i,r,o=e.nodeName.toLowerCase();return"area"===o?(i=(n=e.parentNode).name,!(!e.href||!i||"map"!==n.nodeName.toLowerCase())&&(!!(r=a("img[usemap='#"+i+"']")[0])&&s(r))):(/^(input|select|textarea|button|object)$/.test(o)?!e.disabled:"a"===o&&e.href||t)&&s(e)}function s(e){return a.expr.filters.visible(e)&&!a(e).parents().addBack().filter(function(){return"hidden"===a.css(this,"visibility")}).length}a.ui=a.ui||{},a.extend(a.ui,{version:"1.11.4",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),a.fn.extend({scrollParent:function(e){var t=this.css("position"),n="absolute"===t,i=e?/(auto|scroll|hidden)/:/(auto|scroll)/,r=this.parents().filter(function(){var e=a(this);return(!n||"static"!==e.css("position"))&&i.test(e.css("overflow")+e.css("overflow-y")+e.css("overflow-x"))}).eq(0);return"fixed"!==t&&r.length?r:a(this[0].ownerDocument||document)},uniqueId:(e=0,function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++e)})}),removeUniqueId:function(){return this.each(function(){/^ui-id-\d+$/.test(this.id)&&a(this).removeAttr("id")})}}),a.extend(a.expr[":"],{data:a.expr.createPseudo?a.expr.createPseudo(function(t){return function(e){return!!a.data(e,t)}}):function(e,t,n){return!!a.data(e,n[3])},focusable:function(e){return r(e,!isNaN(a.attr(e,"tabindex")))},tabbable:function(e){var t=a.attr(e,"tabindex"),n=isNaN(t);return(n||0<=t)&&r(e,!n)}}),a("<a>").outerWidth(1).jquery||a.each(["Width","Height"],function(e,n){var r="Width"===n?["Left","Right"]:["Top","Bottom"],i=n.toLowerCase(),o={innerWidth:a.fn.innerWidth,innerHeight:a.fn.innerHeight,outerWidth:a.fn.outerWidth,outerHeight:a.fn.outerHeight};function s(e,t,n,i){return a.each(r,function(){t-=parseFloat(a.css(e,"padding"+this))||0,n&&(t-=parseFloat(a.css(e,"border"+this+"Width"))||0),i&&(t-=parseFloat(a.css(e,"margin"+this))||0)}),t}a.fn["inner"+n]=function(e){return void 0===e?o["inner"+n].call(this):this.each(function(){a(this).css(i,s(this,e)+"px")})},a.fn["outer"+n]=function(e,t){return"number"!=typeof e?o["outer"+n].call(this,e):this.each(function(){a(this).css(i,s(this,e,!0,t)+"px")})}}),a.fn.addBack||(a.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),a("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(a.fn.removeData=(t=a.fn.removeData,function(e){return arguments.length?t.call(this,a.camelCase(e)):t.call(this)})),a.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),a.fn.extend({focus:(i=a.fn.focus,function(t,n){return"number"==typeof t?this.each(function(){var e=this;setTimeout(function(){a(e).focus(),n&&n.call(e)},t)}):i.apply(this,arguments)}),disableSelection:(n="onselectstart"in document.createElement("div")?"selectstart":"mousedown",function(){return this.bind(n+".ui-disableSelection",function(e){e.preventDefault()})}),enableSelection:function(){return this.unbind(".ui-disableSelection")},zIndex:function(e){if(void 0!==e)return this.css("zIndex",e);if(this.length)for(var t,n,i=a(this[0]);i.length&&i[0]!==document;){if(("absolute"===(t=i.css("position"))||"relative"===t||"fixed"===t)&&(n=parseInt(i.css("zIndex"),10),!isNaN(n)&&0!==n))return n;i=i.parent()}return 0}}),a.ui.plugin={add:function(e,t,n){var i,r=a.ui[e].prototype;for(i in n)r.plugins[i]=r.plugins[i]||[],r.plugins[i].push([t,n[i]])},call:function(e,t,n,i){var r,o=e.plugins[t];if(o&&(i||e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType))for(r=0;r<o.length;r++)e.options[o[r][0]]&&o[r][1].apply(e.element,n)}}});
!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)}(function(h){var s,i=0,a=Array.prototype.slice;return h.cleanData=(s=h.cleanData,function(t){var e,i,n;for(n=0;null!=(i=t[n]);n++)try{(e=h._data(i,"events"))&&e.remove&&h(i).triggerHandler("remove")}catch(t){}s(t)}),h.widget=function(t,i,e){var n,s,o,r,a={},u=t.split(".")[0];return t=t.split(".")[1],n=u+"-"+t,e||(e=i,i=h.Widget),h.expr[":"][n.toLowerCase()]=function(t){return!!h.data(t,n)},h[u]=h[u]||{},s=h[u][t],o=h[u][t]=function(t,e){if(!this._createWidget)return new o(t,e);arguments.length&&this._createWidget(t,e)},h.extend(o,s,{version:e.version,_proto:h.extend({},e),_childConstructors:[]}),(r=new i).options=h.widget.extend({},r.options),h.each(e,function(e,n){function s(){return i.prototype[e].apply(this,arguments)}function o(t){return i.prototype[e].apply(this,t)}h.isFunction(n)?a[e]=function(){var t,e=this._super,i=this._superApply;return this._super=s,this._superApply=o,t=n.apply(this,arguments),this._super=e,this._superApply=i,t}:a[e]=n}),o.prototype=h.widget.extend(r,{widgetEventPrefix:s&&r.widgetEventPrefix||t},a,{constructor:o,namespace:u,widgetName:t,widgetFullName:n}),s?(h.each(s._childConstructors,function(t,e){var i=e.prototype;h.widget(i.namespace+"."+i.widgetName,o,e._proto)}),delete s._childConstructors):i._childConstructors.push(o),h.widget.bridge(t,o),o},h.widget.extend=function(t){for(var e,i,n=a.call(arguments,1),s=0,o=n.length;s<o;s++)for(e in n[s])i=n[s][e],n[s].hasOwnProperty(e)&&void 0!==i&&(h.isPlainObject(i)?t[e]=h.isPlainObject(t[e])?h.widget.extend({},t[e],i):h.widget.extend({},i):t[e]=i);return t},h.widget.bridge=function(o,e){var r=e.prototype.widgetFullName||o;h.fn[o]=function(i){var t="string"==typeof i,n=a.call(arguments,1),s=this;return t?this.each(function(){var t,e=h.data(this,r);return"instance"===i?(s=e,!1):e?h.isFunction(e[i])&&"_"!==i.charAt(0)?(t=e[i].apply(e,n))!==e&&void 0!==t?(s=t&&t.jquery?s.pushStack(t.get()):t,!1):void 0:h.error("no such method '"+i+"' for "+o+" widget instance"):h.error("cannot call methods on "+o+" prior to initialization; attempted to call method '"+i+"'")}):(n.length&&(i=h.widget.extend.apply(null,[i].concat(n))),this.each(function(){var t=h.data(this,r);t?(t.option(i||{}),t._init&&t._init()):h.data(this,r,new e(i,this))})),s}},h.Widget=function(){},h.Widget._childConstructors=[],h.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,e){e=h(e||this.defaultElement||this)[0],this.element=h(e),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=h(),this.hoverable=h(),this.focusable=h(),e!==this&&(h.data(e,this.widgetFullName,this),this._on(!0,this.element,{remove:function(t){t.target===e&&this.destroy()}}),this.document=h(e.style?e.ownerDocument:e.document||e),this.window=h(this.document[0].defaultView||this.document[0].parentWindow)),this.options=h.widget.extend({},this.options,this._getCreateOptions(),t),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:h.noop,_getCreateEventData:h.noop,_create:h.noop,_init:h.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(h.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:h.noop,widget:function(){return this.element},option:function(t,e){var i,n,s,o=t;if(0===arguments.length)return h.widget.extend({},this.options);if("string"==typeof t)if(o={},t=(i=t.split(".")).shift(),i.length){for(n=o[t]=h.widget.extend({},this.options[t]),s=0;s<i.length-1;s++)n[i[s]]=n[i[s]]||{},n=n[i[s]];if(t=i.pop(),1===arguments.length)return void 0===n[t]?null:n[t];n[t]=e}else{if(1===arguments.length)return void 0===this.options[t]?null:this.options[t];o[t]=e}return this._setOptions(o),this},_setOptions:function(t){var e;for(e in t)this._setOption(e,t[e]);return this},_setOption:function(t,e){return this.options[t]=e,"disabled"===t&&(this.widget().toggleClass(this.widgetFullName+"-disabled",!!e),e&&(this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus"))),this},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_on:function(r,a,t){var u,d=this;"boolean"!=typeof r&&(t=a,a=r,r=!1),t?(a=u=h(a),this.bindings=this.bindings.add(a)):(t=a,a=this.element,u=this.widget()),h.each(t,function(t,e){function i(){if(r||!0!==d.options.disabled&&!h(this).hasClass("ui-state-disabled"))return("string"==typeof e?d[e]:e).apply(d,arguments)}"string"!=typeof e&&(i.guid=e.guid=e.guid||i.guid||h.guid++);var n=t.match(/^([\w:-]*)\s*(.*)$/),s=n[1]+d.eventNamespace,o=n[2];o?u.delegate(o,s,i):a.bind(s,i)})},_off:function(t,e){e=(e||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,t.unbind(e).undelegate(e),this.bindings=h(this.bindings.not(t).get()),this.focusable=h(this.focusable.not(t).get()),this.hoverable=h(this.hoverable.not(t).get())},_delay:function(t,e){var i=this;return setTimeout(function(){return("string"==typeof t?i[t]:t).apply(i,arguments)},e||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){h(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){h(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){h(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){h(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,e,i){var n,s,o=this.options[t];if(i=i||{},(e=h.Event(e)).type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),e.target=this.element[0],s=e.originalEvent)for(n in s)n in e||(e[n]=s[n]);return this.element.trigger(e,i),!(h.isFunction(o)&&!1===o.apply(this.element[0],[e].concat(i))||e.isDefaultPrevented())}},h.each({show:"fadeIn",hide:"fadeOut"},function(o,r){h.Widget.prototype["_"+o]=function(e,t,i){"string"==typeof t&&(t={effect:t});var n,s=t?!0===t||"number"==typeof t?r:t.effect||r:o;"number"==typeof(t=t||{})&&(t={duration:t}),n=!h.isEmptyObject(t),t.complete=i,t.delay&&e.delay(t.delay),n&&h.effects&&h.effects.effect[s]?e[o](t):s!==o&&e[s]?e[s](t.duration,t.easing,i):e.queue(function(t){h(this)[o](),i&&i.call(e[0]),t()})}}),h.widget});
!function(e){"function"==typeof define&&define.amd?define(["jquery","./widget"],e):e(jQuery)}(function(o){var u=!1;return o(document).mouseup(function(){u=!1}),o.widget("ui.mouse",{version:"1.11.4",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e)}).bind("click."+this.widgetName,function(e){if(!0===o.data(e.target,t.widgetName+".preventClickEvent"))return o.removeData(e.target,t.widgetName+".preventClickEvent"),e.stopImmediatePropagation(),!1}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&this.document.unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(e){if(!u){this._mouseMoved=!1,this._mouseStarted&&this._mouseUp(e),this._mouseDownEvent=e;var t=this,s=1===e.which,i=!("string"!=typeof this.options.cancel||!e.target.nodeName)&&o(e.target).closest(this.options.cancel).length;return!(s&&!i&&this._mouseCapture(e))||(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){t.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=!1!==this._mouseStart(e),!this._mouseStarted)?(e.preventDefault(),!0):(!0===o.data(e.target,this.widgetName+".preventClickEvent")&&o.removeData(e.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return t._mouseMove(e)},this._mouseUpDelegate=function(e){return t._mouseUp(e)},this.document.bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),e.preventDefault(),u=!0))}},_mouseMove:function(e){if(this._mouseMoved){if(o.ui.ie&&(!document.documentMode||document.documentMode<9)&&!e.button)return this._mouseUp(e);if(!e.which)return this._mouseUp(e)}return(e.which||e.button)&&(this._mouseMoved=!0),this._mouseStarted?(this._mouseDrag(e),e.preventDefault()):(this._mouseDistanceMet(e)&&this._mouseDelayMet(e)&&(this._mouseStarted=!1!==this._mouseStart(this._mouseDownEvent,e),this._mouseStarted?this._mouseDrag(e):this._mouseUp(e)),!this._mouseStarted)},_mouseUp:function(e){return this.document.unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,e.target===this._mouseDownEvent.target&&o.data(e.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(e)),u=!1},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}})});
!function(e){"function"==typeof define&&define.amd?define(["jquery","./core","./mouse","./widget"],e):e(jQuery)}(function(r){return r.widget("ui.slider",r.ui.mouse,{version:"1.11.4",widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null,change:null,slide:null,start:null,stop:null},numPages:5,_create:function(){this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this._calculateNewMax(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget ui-widget-content ui-corner-all"),this._refresh(),this._setOption("disabled",this.options.disabled),this._animateOff=!1},_refresh:function(){this._createRange(),this._createHandles(),this._setupEvents(),this._refreshValue()},_createHandles:function(){var e,t,i=this.options,s=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),a=[];for(t=i.values&&i.values.length||1,s.length>t&&(s.slice(t).remove(),s=s.slice(0,t)),e=s.length;e<t;e++)a.push("<span class='ui-slider-handle ui-state-default ui-corner-all' tabindex='0'></span>");this.handles=s.add(r(a.join("")).appendTo(this.element)),this.handle=this.handles.eq(0),this.handles.each(function(e){r(this).data("ui-slider-handle-index",e)})},_createRange:function(){var e=this.options,t="";e.range?(!0===e.range&&(e.values?e.values.length&&2!==e.values.length?e.values=[e.values[0],e.values[0]]:r.isArray(e.values)&&(e.values=e.values.slice(0)):e.values=[this._valueMin(),this._valueMin()]),this.range&&this.range.length?this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({left:"",bottom:""}):(this.range=r("<div></div>").appendTo(this.element),t="ui-slider-range ui-widget-header ui-corner-all"),this.range.addClass(t+("min"===e.range||"max"===e.range?" ui-slider-range-"+e.range:""))):(this.range&&this.range.remove(),this.range=null)},_setupEvents:function(){this._off(this.handles),this._on(this.handles,this._handleEvents),this._hoverable(this.handles),this._focusable(this.handles)},_destroy:function(){this.handles.remove(),this.range&&this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"),this._mouseDestroy()},_mouseCapture:function(e){var t,i,s,a,n,h,l,o=this,u=this.options;return!u.disabled&&(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),t={x:e.pageX,y:e.pageY},i=this._normValueFromMouse(t),s=this._valueMax()-this._valueMin()+1,this.handles.each(function(e){var t=Math.abs(i-o.values(e));(t<s||s===t&&(e===o._lastChangedValue||o.values(e)===u.min))&&(s=t,a=r(this),n=e)}),!1!==this._start(e,n)&&(this._mouseSliding=!0,this._handleIndex=n,a.addClass("ui-state-active").focus(),h=a.offset(),l=!r(e.target).parents().addBack().is(".ui-slider-handle"),this._clickOffset=l?{left:0,top:0}:{left:e.pageX-h.left-a.width()/2,top:e.pageY-h.top-a.height()/2-(parseInt(a.css("borderTopWidth"),10)||0)-(parseInt(a.css("borderBottomWidth"),10)||0)+(parseInt(a.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(e,n,i),this._animateOff=!0))},_mouseStart:function(){return!0},_mouseDrag:function(e){var t={x:e.pageX,y:e.pageY},i=this._normValueFromMouse(t);return this._slide(e,this._handleIndex,i),!1},_mouseStop:function(e){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(e,this._handleIndex),this._change(e,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1},_detectOrientation:function(){this.orientation="vertical"===this.options.orientation?"vertical":"horizontal"},_normValueFromMouse:function(e){var t,i,s,a;return 1<(i=("horizontal"===this.orientation?(t=this.elementSize.width,e.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(t=this.elementSize.height,e.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)))/t)&&(i=1),i<0&&(i=0),"vertical"===this.orientation&&(i=1-i),s=this._valueMax()-this._valueMin(),a=this._valueMin()+i*s,this._trimAlignValue(a)},_start:function(e,t){var i={handle:this.handles[t],value:this.value()};return this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._trigger("start",e,i)},_slide:function(e,t,i){var s,a,n;this.options.values&&this.options.values.length?(s=this.values(t?0:1),2===this.options.values.length&&!0===this.options.range&&(0===t&&s<i||1===t&&i<s)&&(i=s),i!==this.values(t)&&((a=this.values())[t]=i,n=this._trigger("slide",e,{handle:this.handles[t],value:i,values:a}),s=this.values(t?0:1),!1!==n&&this.values(t,i))):i!==this.value()&&!1!==(n=this._trigger("slide",e,{handle:this.handles[t],value:i}))&&this.value(i)},_stop:function(e,t){var i={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._trigger("stop",e,i)},_change:function(e,t){if(!this._keySliding&&!this._mouseSliding){var i={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._lastChangedValue=t,this._trigger("change",e,i)}},value:function(e){return arguments.length?(this.options.value=this._trimAlignValue(e),this._refreshValue(),void this._change(null,0)):this._value()},values:function(e,t){var i,s,a;if(1<arguments.length)return this.options.values[e]=this._trimAlignValue(t),this._refreshValue(),void this._change(null,e);if(!arguments.length)return this._values();if(!r.isArray(e))return this.options.values&&this.options.values.length?this._values(e):this.value();for(i=this.options.values,s=e,a=0;a<i.length;a+=1)i[a]=this._trimAlignValue(s[a]),this._change(null,a);this._refreshValue()},_setOption:function(e,t){var i,s=0;switch("range"===e&&!0===this.options.range&&("min"===t?(this.options.value=this._values(0),this.options.values=null):"max"===t&&(this.options.value=this._values(this.options.values.length-1),this.options.values=null)),r.isArray(this.options.values)&&(s=this.options.values.length),"disabled"===e&&this.element.toggleClass("ui-state-disabled",!!t),this._super(e,t),e){case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue(),this.handles.css("horizontal"===t?"bottom":"left","");break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":for(this._animateOff=!0,this._refreshValue(),i=0;i<s;i+=1)this._change(null,i);this._animateOff=!1;break;case"step":case"min":case"max":this._animateOff=!0,this._calculateNewMax(),this._refreshValue(),this._animateOff=!1;break;case"range":this._animateOff=!0,this._refresh(),this._animateOff=!1}},_value:function(){var e=this.options.value;return e=this._trimAlignValue(e)},_values:function(e){var t,i,s;if(arguments.length)return t=this.options.values[e],t=this._trimAlignValue(t);if(this.options.values&&this.options.values.length){for(i=this.options.values.slice(),s=0;s<i.length;s+=1)i[s]=this._trimAlignValue(i[s]);return i}return[]},_trimAlignValue:function(e){if(e<=this._valueMin())return this._valueMin();if(e>=this._valueMax())return this._valueMax();var t=0<this.options.step?this.options.step:1,i=(e-this._valueMin())%t,s=e-i;return 2*Math.abs(i)>=t&&(s+=0<i?t:-t),parseFloat(s.toFixed(5))},_calculateNewMax:function(){var e=this.options.max,t=this._valueMin(),i=this.options.step;e=Math.floor(+(e-t).toFixed(this._precision())/i)*i+t,this.max=parseFloat(e.toFixed(this._precision()))},_precision:function(){var e=this._precisionOf(this.options.step);return null!==this.options.min&&(e=Math.max(e,this._precisionOf(this.options.min))),e},_precisionOf:function(e){var t=e.toString(),i=t.indexOf(".");return-1===i?0:t.length-i-1},_valueMin:function(){return this.options.min},_valueMax:function(){return this.max},_refreshValue:function(){var t,i,e,s,a,n=this.options.range,h=this.options,l=this,o=!this._animateOff&&h.animate,u={};this.options.values&&this.options.values.length?this.handles.each(function(e){i=(l.values(e)-l._valueMin())/(l._valueMax()-l._valueMin())*100,u["horizontal"===l.orientation?"left":"bottom"]=i+"%",r(this).stop(1,1)[o?"animate":"css"](u,h.animate),!0===l.options.range&&("horizontal"===l.orientation?(0===e&&l.range.stop(1,1)[o?"animate":"css"]({left:i+"%"},h.animate),1===e&&l.range[o?"animate":"css"]({width:i-t+"%"},{queue:!1,duration:h.animate})):(0===e&&l.range.stop(1,1)[o?"animate":"css"]({bottom:i+"%"},h.animate),1===e&&l.range[o?"animate":"css"]({height:i-t+"%"},{queue:!1,duration:h.animate}))),t=i}):(e=this.value(),s=this._valueMin(),a=this._valueMax(),i=a!==s?(e-s)/(a-s)*100:0,u["horizontal"===this.orientation?"left":"bottom"]=i+"%",this.handle.stop(1,1)[o?"animate":"css"](u,h.animate),"min"===n&&"horizontal"===this.orientation&&this.range.stop(1,1)[o?"animate":"css"]({width:i+"%"},h.animate),"max"===n&&"horizontal"===this.orientation&&this.range[o?"animate":"css"]({width:100-i+"%"},{queue:!1,duration:h.animate}),"min"===n&&"vertical"===this.orientation&&this.range.stop(1,1)[o?"animate":"css"]({height:i+"%"},h.animate),"max"===n&&"vertical"===this.orientation&&this.range[o?"animate":"css"]({height:100-i+"%"},{queue:!1,duration:h.animate}))},_handleEvents:{keydown:function(e){var t,i,s,a=r(e.target).data("ui-slider-handle-index");switch(e.keyCode){case r.ui.keyCode.HOME:case r.ui.keyCode.END:case r.ui.keyCode.PAGE_UP:case r.ui.keyCode.PAGE_DOWN:case r.ui.keyCode.UP:case r.ui.keyCode.RIGHT:case r.ui.keyCode.DOWN:case r.ui.keyCode.LEFT:if(e.preventDefault(),!this._keySliding&&(this._keySliding=!0,r(e.target).addClass("ui-state-active"),!1===this._start(e,a)))return}switch(s=this.options.step,t=i=this.options.values&&this.options.values.length?this.values(a):this.value(),e.keyCode){case r.ui.keyCode.HOME:i=this._valueMin();break;case r.ui.keyCode.END:i=this._valueMax();break;case r.ui.keyCode.PAGE_UP:i=this._trimAlignValue(t+(this._valueMax()-this._valueMin())/this.numPages);break;case r.ui.keyCode.PAGE_DOWN:i=this._trimAlignValue(t-(this._valueMax()-this._valueMin())/this.numPages);break;case r.ui.keyCode.UP:case r.ui.keyCode.RIGHT:if(t===this._valueMax())return;i=this._trimAlignValue(t+s);break;case r.ui.keyCode.DOWN:case r.ui.keyCode.LEFT:if(t===this._valueMin())return;i=this._trimAlignValue(t-s)}this._slide(e,a,i)},keyup:function(e){var t=r(e.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(e,t),this._change(e,t),r(e.target).removeClass("ui-state-active"))}}})});
!function(o){function t(o,t){if(!(o.originalEvent.touches.length>1)){o.preventDefault();var e=o.originalEvent.changedTouches[0],u=document.createEvent("MouseEvents");u.initMouseEvent(t,!0,!0,window,1,e.screenX,e.screenY,e.clientX,e.clientY,!1,!1,!1,!1,0,null),o.target.dispatchEvent(u)}}if(o.support.touch="ontouchend"in document,o.support.touch){var e,u=o.ui.mouse.prototype,n=u._mouseInit,c=u._mouseDestroy;u._touchStart=function(o){var u=this;!e&&u._mouseCapture(o.originalEvent.changedTouches[0])&&(e=!0,u._touchMoved=!1,t(o,"mouseover"),t(o,"mousemove"),t(o,"mousedown"))},u._touchMove=function(o){e&&(this._touchMoved=!0,t(o,"mousemove"))},u._touchEnd=function(o){e&&(t(o,"mouseup"),t(o,"mouseout"),this._touchMoved||t(o,"click"),e=!1)},u._mouseInit=function(){var t=this;t.element.bind({touchstart:o.proxy(t,"_touchStart"),touchmove:o.proxy(t,"_touchMove"),touchend:o.proxy(t,"_touchEnd")}),n.call(t)},u._mouseDestroy=function(){var t=this;t.element.unbind({touchstart:o.proxy(t,"_touchStart"),touchmove:o.proxy(t,"_touchMove"),touchend:o.proxy(t,"_touchEnd")}),c.call(t)}}}(jQuery);
!function(n,r){function e(n){return!!(""===n||n&&n.charCodeAt&&n.substr)}function t(n){return p?p(n):"[object Array]"===l.call(n)}function o(n){return n&&"[object Object]"===l.call(n)}function a(n,r){var e;n=n||{},r=r||{};for(e in r)r.hasOwnProperty(e)&&null==n[e]&&(n[e]=r[e]);return n}function i(n,r,e){var t,o,a=[];if(!n)return a;if(f&&n.map===f)return n.map(r,e);for(t=0,o=n.length;t<o;t++)a[t]=r.call(e,n[t],t,n);return a}function u(n,r){return n=Math.round(Math.abs(n)),isNaN(n)?r:n}function c(n){var r=s.settings.currency.format;return"function"==typeof n&&(n=n()),e(n)&&n.match("%v")?{pos:n,neg:n.replace("-","").replace("%v","-%v"),zero:n}:n&&n.pos&&n.pos.match("%v")?n:e(r)?s.settings.currency.format={pos:r,neg:r.replace("%v","-%v"),zero:r}:r}var s={};s.version="0.4.1",s.settings={currency:{symbol:"$",format:"%s%v",decimal:".",thousand:",",precision:2,grouping:3},number:{precision:0,grouping:3,thousand:",",decimal:"."}};var f=Array.prototype.map,p=Array.isArray,l=Object.prototype.toString,m=s.unformat=s.parse=function(n,r){if(t(n))return i(n,function(n){return m(n,r)});if("number"==typeof(n=n||0))return n;r=r||s.settings.number.decimal;var e=new RegExp("[^0-9-"+r+"]",["g"]),o=parseFloat((""+n).replace(/\((.*)\)/,"-$1").replace(e,"").replace(r,"."));return isNaN(o)?0:o},d=s.toFixed=function(n,r){r=u(r,s.settings.number.precision);var e=Math.pow(10,r);return(Math.round(s.unformat(n)*e)/e).toFixed(r)},g=s.formatNumber=s.format=function(n,r,e,c){if(t(n))return i(n,function(n){return g(n,r,e,c)});n=m(n);var f=a(o(r)?r:{precision:r,thousand:e,decimal:c},s.settings.number),p=u(f.precision),l=n<0?"-":"",h=parseInt(d(Math.abs(n||0),p),10)+"",y=h.length>3?h.length%3:0;return l+(y?h.substr(0,y)+f.thousand:"")+h.substr(y).replace(/(\d{3})(?=\d)/g,"$1"+f.thousand)+(p?f.decimal+d(Math.abs(n),p).split(".")[1]:"")},h=s.formatMoney=function(n,r,e,f,p,l){if(t(n))return i(n,function(n){return h(n,r,e,f,p,l)});n=m(n);var d=a(o(r)?r:{symbol:r,precision:e,thousand:f,decimal:p,format:l},s.settings.currency),y=c(d.format);return(n>0?y.pos:n<0?y.neg:y.zero).replace("%s",d.symbol).replace("%v",g(Math.abs(n),u(d.precision),d.thousand,d.decimal))};s.formatColumn=function(n,r,f,p,l,d){if(!n)return[];var h=a(o(r)?r:{symbol:r,precision:f,thousand:p,decimal:l,format:d},s.settings.currency),y=c(h.format),b=y.pos.indexOf("%s")<y.pos.indexOf("%v"),v=0;return i(i(n,function(n,r){if(t(n))return s.formatColumn(n,h);var e=((n=m(n))>0?y.pos:n<0?y.neg:y.zero).replace("%s",h.symbol).replace("%v",g(Math.abs(n),u(h.precision),h.thousand,h.decimal));return e.length>v&&(v=e.length),e}),function(n,r){return e(n)&&n.length<v?b?n.replace(h.symbol,h.symbol+new Array(v-n.length+1).join(" ")):new Array(v-n.length+1).join(" ")+n:n})},"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=s),exports.accounting=s):"function"==typeof define&&define.amd?define([],function(){return s}):(s.noConflict=function(r){return function(){
return n.accounting=r,s.noConflict=void 0,s}}(n.accounting),n.accounting=s)}(this);