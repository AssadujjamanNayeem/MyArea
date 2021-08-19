(function ($){
$(document).ready(function(){
$('[data-catload=ajax]').on('click', function(){
sw_tab_click_ajax($(this));
});
$('[data-catload=ajax_listing]').on('click', function(){
sw_tab_ajax_listing($(this));
});
$('[data-catload=so_ajax]').on('click', function(){
sw_tab_click_ajax($(this));
});
var SMobileSlider=function($target){
this.$target=$target;
var _target=$target.find('.responsive');
$target.append('<span class="res-button slick-prev slick-arrow" data-scroll="left"></span><span data-role="none" class="res-button slick-next slick-arrow" data-scroll="right"></span>');
$target.find('.res-button').on('click', function (){
var scroll=$(this).data('scroll');
var wli=$target.find('.responsive > div').outerWidth() + 4;
wli=('left'===scroll) ? - wli:wli;
var pos=_target.scrollLeft() + wli;
_target.animate({scrollLeft: pos}, 200);
});
}
$.fn.swp_mobile_scroll=function(){
new SMobileSlider(this);
return this;
};
function sw_tab_click_ajax(element){
var target=$(element.attr('href'));
var id=element.attr('href');
var length=element.data('length');
var ltype=element.data('type');
var layout=element.data('layout');
var orderby=element.data('orderby');
var order=element.data('order');
var item_row=element.data('row');
var sorder=element.data('sorder');
var catid=element.data('category');
var number=element.data('number');
var columns=element.data('lg');
var columns1=element.data('md');
var columns2=element.data('sm');
var columns3=element.data('xs');
var columns4=element.data('mobile');
var interval=element.data('interval');
var scroll=element.data('scroll');
var speed=element.data('speed');
var autoplay=element.data('autoplay');
var img_w=element.data('img_w');
var img_h=element.data('img_h');
var crop=element.data('crop');
var tg_append=element.parents('.sw-ajax').find(' .tab-content');
var action='';
if(ltype=='cat_ajax'){
action='sw_category_callback';
}else if(ltype=='so_ajax'){
action='sw_tab_category';
}else if(ltype=='tab_ajax'){
action='sw_ajax_tab';
}else if(ltype=='tab_ajax_listing'){
action='sw_ajax_tab_listing';
}
var ajaxurl=element.data('ajaxurl').replace('%%endpoint%%', action);
if(!element.parent().hasClass ('loaded')){
tg_append.addClass('loading');
var data={
action: action,
catid: catid,
number: number,
target: id,
title_length: length,
layout: layout,
item_row: item_row,
layout: layout,
sorder: sorder,
orderby: orderby,
order: order,
columns: columns,
columns1: columns1,
columns2: columns2,
columns3: columns3,
columns4: columns4,
interval: interval,
speed: speed,
scroll: scroll,
autoplay: autoplay,
img_w: img_w,
img_h: img_h,
crop: crop,
};
jQuery.post(ajaxurl, data, function(response){
element.parent().addClass('loaded');
tg_append.find('.tab-pane').removeClass('active');
tg_append.append(response);
sw_slider_ajax(id);
$(".add_to_cart_button").attr("title", "Add to cart");
$(".add_to_wishlist").attr("title", "Add to wishlist");
$(".compare").attr("title", "Add to compare");
$(".group").attr("title", "Quickview");
tg_append.removeClass('loading');
});
}}
function sw_slider_ajax(target){
var element=$(target).find('.responsive-slider');
var $col_lg=element.data('lg');
var $col_md=element.data('md');
var $col_sm=element.data('sm');
var $col_xs=element.data('xs');
var $col_mobile=element.data('mobile');
var $speed=element.data('speed');
var $interval=element.data('interval');
var $scroll=element.data('scroll');
var $autoplay=element.data('autoplay');
var $rtl=$('body').hasClass('rtl');
$target=$(target).find('.responsive');
$target.slick({
appendArrows: $(target),
prevArrow: '<span data-role="none" class="res-button slick-prev" aria-label="previous"></span>',
nextArrow: '<span data-role="none" class="res-button slick-next" aria-label="next"></span>',
dots: false,
infinite: true,
speed: $speed,
slidesToShow: $col_lg,
slidesToScroll: $scroll,
autoplay: $autoplay,
autoplaySpeed: $interval,
rtl: $rtl,
responsive: [
{
breakpoint: 1199,
settings: {
slidesToShow: $col_md,
slidesToScroll: $col_md
}},
{
breakpoint: 991,
settings: {
slidesToShow: $col_sm,
slidesToScroll: $col_sm
}},
{
breakpoint: 767,
settings: {
slidesToShow: $col_xs,
slidesToScroll: $col_xs
}},
{
breakpoint: 480,
settings: {
slidesToShow: $col_mobile,
slidesToScroll: $col_mobile
}}
]
});
setTimeout(function(){
element.removeClass("loading");
}, 500);
}
function sw_tab_ajax_listing(element){
var target=$(element.attr('href'));
var id=element.attr('href');
var ltype=element.data('type');
var layout=element.data('layout');
var catid=element.data('category');
var number=element.data('number');
var action='sw_ajax_tab_listing';
var ajaxurl=element.data('ajaxurl').replace('%%endpoint%%', action);
if(target.html()==''){
target.parent().addClass('loading');
var data={
action: action,
catid: catid,
number: number,
target: id,
layout: layout
};
jQuery.post(ajaxurl, data, function(response){
target.html(response);
target.parent().removeClass('loading');
});
}}
$('.sw-ajax-categories').each(function(){
var tparent=$(this);
var target=$(this).find('a.btn-loadmore');
var number=target.data('number');
var maxpage=target.data('maxpage');
var length=target.data('length');
var action='sw_category_ajax_listing';
var ajaxurl=target.data('ajaxurl').replace('%%endpoint%%', action);
var page=1;
if(page >=maxpage){
target.addClass('btn-loaded');
}
target.on('click',function(){
if(page >=maxpage){
return false;
}
target.addClass('btn-loading');
jQuery.ajax({
type: "POST",
url: ajaxurl,
data: ({
action:action,
number:number,
page:page,
title_length:length
}),
success: function(data){
target.removeClass('btn-loading');
var $newItems=$(data);
if($newItems.length > 0){
page=page + 1;
tparent.find('.resp-listing-container').append($newItems);
if(page >=maxpage){
target.addClass('btn-loaded');
}}else{
target.addClass('btn-loaded');
}}
});
});
});
});
})(jQuery);
!function(d,l){"use strict";var e=!1,o=!1;if(l.querySelector)if(d.addEventListener)e=!0;if(d.wp=d.wp||{},!d.wp.receiveEmbedMessage)if(d.wp.receiveEmbedMessage=function(e){var t=e.data;if(t)if(t.secret||t.message||t.value)if(!/[^a-zA-Z0-9]/.test(t.secret)){var r,a,i,s,n,o=l.querySelectorAll('iframe[data-secret="'+t.secret+'"]'),c=l.querySelectorAll('blockquote[data-secret="'+t.secret+'"]');for(r=0;r<c.length;r++)c[r].style.display="none";for(r=0;r<o.length;r++)if(a=o[r],e.source===a.contentWindow){if(a.removeAttribute("style"),"height"===t.message){if(1e3<(i=parseInt(t.value,10)))i=1e3;else if(~~i<200)i=200;a.height=i}if("link"===t.message)if(s=l.createElement("a"),n=l.createElement("a"),s.href=a.getAttribute("src"),n.href=t.value,n.host===s.host)if(l.activeElement===a)d.top.location.href=t.value}}},e)d.addEventListener("message",d.wp.receiveEmbedMessage,!1),l.addEventListener("DOMContentLoaded",t,!1),d.addEventListener("load",t,!1);function t(){if(!o){o=!0;var e,t,r,a,i=-1!==navigator.appVersion.indexOf("MSIE 10"),s=!!navigator.userAgent.match(/Trident.*rv:11\./),n=l.querySelectorAll("iframe.wp-embedded-content");for(t=0;t<n.length;t++){if(!(r=n[t]).getAttribute("data-secret"))a=Math.random().toString(36).substr(2,10),r.src+="#?secret="+a,r.setAttribute("data-secret",a);if(i||s)(e=r.cloneNode(!0)).removeAttribute("security"),r.parentNode.replaceChild(e,r)}}}}(window,document);
(function(g,j){var b=function(a){return new i(a)};b.version="0.1.3";var c=g.fxSetup||{rates:{},base:""};b.rates=c.rates;b.base=c.base;b.settings={from:c.from||b.base,to:c.to||b.base};var h=b.convert=function(a,e){if("object"===typeof a&&a.length){for(var d=0;d<a.length;d++)a[d]=h(a[d],e);return a}e=e||{};if(!e.from)e.from=b.settings.from;if(!e.to)e.to=b.settings.to;var d=e.to,c=e.from,f=b.rates;f[b.base]=1;if(!f[d]||!f[c])throw"fx error";d=c===b.base?f[d]:d===b.base?1/f[c]:f[d]*(1/f[c]);return a*d},i=function(a){"string"===typeof a?(this._v=parseFloat(a.replace(/[^0-9-.]/g,"")),this._fx=a.replace(/([^A-Za-z])/g,"")):this._v=a},c=b.prototype=i.prototype;c.convert=function(){var a=Array.prototype.slice.call(arguments);a.unshift(this._v);return h.apply(b,a)};c.from=function(a){a=b(h(this._v,{from:a,to:b.base}));a._fx=b.base;return a};c.to=function(a){return h(this._v,{from:this._fx?this._fx:b.settings.from,to:a})};if("undefined"!==typeof exports){if("undefined"!==typeof module&&module.exports)exports=module.exports=b;exports.fx=fx}else"function"===typeof define&&define.amd?define([],function(){return b}):(b.noConflict=function(a){return function(){g.fx=a;b.noConflict=j;return b}}(g.fx),g.fx=b)})(this);
(function(p,z){function q(a){return!!(""===a||a&&a.charCodeAt&&a.substr)}function m(a){return u?u(a):"[object Array]"===v.call(a)}function r(a){return"[object Object]"===v.call(a)}function s(a,b){var d,a=a||{},b=b||{};for(d in b)b.hasOwnProperty(d)&&null==a[d]&&(a[d]=b[d]);return a}function j(a,b,d){var c=[],e,h;if(!a)return c;if(w&&a.map===w)return a.map(b,d);for(e=0,h=a.length;e<h;e++)c[e]=b.call(d,a[e],e,a);return c}function n(a,b){a=Math.round(Math.abs(a));return isNaN(a)?b:a}function x(a){var b=c.settings.currency.format;"function"===typeof a&&(a=a());return q(a)&&a.match("%v")?{pos:a,neg:a.replace("-","").replace("%v","-%v"),zero:a}:!a||!a.pos||!a.pos.match("%v")?!q(b)?b:c.settings.currency.format={pos:b,neg:b.replace("%v","-%v"),zero:b}:a}var c={version:"0.3.2",settings:{currency:{symbol:"$",format:"%s%v",decimal:".",thousand:",",precision:2,grouping:3},number:{precision:0,grouping:3,thousand:",",decimal:"."}}},w=Array.prototype.map,u=Array.isArray,v=Object.prototype.toString,o=c.unformat=c.parse=function(a,b){if(m(a))return j(a,function(a){return o(a,b)});a=a||0;if("number"===typeof a)return a;var b=b||".",c=RegExp("[^0-9-"+b+"]",["g"]),c=parseFloat((""+a).replace(/\((.*)\)/,"-$1").replace(c,"").replace(b,"."));return!isNaN(c)?c:0},y=c.toFixed=function(a,b){var b=n(b,c.settings.number.precision),d=Math.pow(10,b);return(Math.round(c.unformat(a)*d)/d).toFixed(b)},t=c.formatNumber=function(a,b,d,i){if(m(a))return j(a,function(a){return t(a,b,d,i)});var a=o(a),e=s(r(b)?b:{precision:b,thousand:d,decimal:i},c.settings.number),h=n(e.precision),f=0>a?"-":"",g=parseInt(y(Math.abs(a||0),h),10)+"",l=3<g.length?g.length%3:0;return f+(l?g.substr(0,l)+e.thousand:"")+g.substr(l).replace(/(\d{3})(?=\d)/g,"$1"+e.thousand)+(h?e.decimal+y(Math.abs(a),h).split(".")[1]:"")},A=c.formatMoney=function(a,b,d,i,e,h){if(m(a))return j(a,function(a){return A(a,b,d,i,e,h)});var a=o(a),f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format);return(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal))};c.formatColumn=function(a,b,d,i,e,h){if(!a)return[];var f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format),l=g.pos.indexOf("%s")<g.pos.indexOf("%v")?!0:!1,k=0,a=j(a,function(a){if(m(a))return c.formatColumn(a,f);a=o(a);a=(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal));if(a.length>k)k=a.length;return a});return j(a,function(a){return q(a)&&a.length<k?l?a.replace(f.symbol,f.symbol+Array(k-a.length+1).join(" ")):Array(k-a.length+1).join(" ")+a:a})};if("undefined"!==typeof exports){if("undefined"!==typeof module&&module.exports)exports=module.exports=c;exports.accounting=c}else"function"===typeof define&&define.amd?define([],function(){return c}):(c.noConflict=function(a){return function(){p.accounting=a;c.noConflict=z;return c}}(p.accounting),p.accounting=c)})(this);