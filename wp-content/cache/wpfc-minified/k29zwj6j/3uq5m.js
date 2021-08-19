(function($){
"use strict";
$(document).ready(function(){
$('.revo-portfolio').each(function(){
var $this=$(this);
var $id=this.id;
var $pf_id=('#' + this.id);
var $ajax_url=ya_portfolio.ajax_url;
var $ya_style=$this.data('style');
var $categories=$this.data('categories');
var $max_page=$this.data('max_page');
var $attributes=$this.data('attributes');
var $number=$this.data('number');
var $offset=$this.data('offset');
var $orderby=$this.data('orderby');
var $order=$this.data('order');
var $container_id=$('#container_'+ $id);
var $tab_id=$('#tab_'+ $id);
var $container=$container_id;
if($ya_style=='fitRows'){
$container.imagesLoaded().progress(function(){
$container.isotope({
layoutMode:'fitRows'
});
});
}else{
$container.imagesLoaded().progress(function(){
$container.isotope({
layoutMode:'masonry',
percentPosition: true,
masonry: {
columnWidth: '.portfolio-item'
}});
});
}
var $optionSets=$tab_id,
$optionLinks=$optionSets.find('li');
$optionLinks.click(function(){
var $this=$(this);
if($this.hasClass('selected')){
return false;
}
var $optionSet=$this.parents($tab_id);
$optionSets.find('.selected').removeClass('selected');
$this.addClass('selected');
var selector=$(this).attr('data-portfolio-filter');
$container.isotope({ filter: selector });
return false;
});
var $page=1;
var $btn_loadmore=$($pf_id + ' .btn-loadmore');
$btn_loadmore.on("click", function(){
if($page >=$max_page){
return false;
}
$(this).addClass('btn-loading');
jQuery.ajax({
type: "POST",
url: $ajax_url,
data: ({
action:"sw_portfolio_ajax",
catid:$categories,
numb:$number,
orderby: $orderby,
order:$order,
page:$page,
style:$ya_style,
attributes: $attributes
}),
success: function(data){
console.log(data);
var $newItems=$(data);
if($newItems.length > 0){
$newItems.imagesLoaded(function(){
setTimeout(function(){
$container_id.isotope('reloadItems').isotope("insert",$newItems);
}, 500);
});
$btn_loadmore.removeClass('btn-loading');
$page=$page + 1;
if($newItems.length < $number){
$btn_loadmore.addClass('btn-loaded');
}
if($page >=$max_page){
$btn_loadmore.addClass('btn-loaded');
}}else{
$btn_loadmore.removeClass('btn-loading').addClass('btn-loaded');
}}
});
});
});
$('.item-popup').fancybox({
helpers:{
title:{
type:'over'
}}
});
});
})(jQuery);
(function(g,j){var b=function(a){return new i(a)};b.version="0.1.3";var c=g.fxSetup||{rates:{},base:""};b.rates=c.rates;b.base=c.base;b.settings={from:c.from||b.base,to:c.to||b.base};var h=b.convert=function(a,e){if("object"===typeof a&&a.length){for(var d=0;d<a.length;d++)a[d]=h(a[d],e);return a}e=e||{};if(!e.from)e.from=b.settings.from;if(!e.to)e.to=b.settings.to;var d=e.to,c=e.from,f=b.rates;f[b.base]=1;if(!f[d]||!f[c])throw"fx error";d=c===b.base?f[d]:d===b.base?1/f[c]:f[d]*(1/f[c]);return a*d},i=function(a){"string"===typeof a?(this._v=parseFloat(a.replace(/[^0-9-.]/g,"")),this._fx=a.replace(/([^A-Za-z])/g,"")):this._v=a},c=b.prototype=i.prototype;c.convert=function(){var a=Array.prototype.slice.call(arguments);a.unshift(this._v);return h.apply(b,a)};c.from=function(a){a=b(h(this._v,{from:a,to:b.base}));a._fx=b.base;return a};c.to=function(a){return h(this._v,{from:this._fx?this._fx:b.settings.from,to:a})};if("undefined"!==typeof exports){if("undefined"!==typeof module&&module.exports)exports=module.exports=b;exports.fx=fx}else"function"===typeof define&&define.amd?define([],function(){return b}):(b.noConflict=function(a){return function(){g.fx=a;b.noConflict=j;return b}}(g.fx),g.fx=b)})(this);
(function(p,z){function q(a){return!!(""===a||a&&a.charCodeAt&&a.substr)}function m(a){return u?u(a):"[object Array]"===v.call(a)}function r(a){return"[object Object]"===v.call(a)}function s(a,b){var d,a=a||{},b=b||{};for(d in b)b.hasOwnProperty(d)&&null==a[d]&&(a[d]=b[d]);return a}function j(a,b,d){var c=[],e,h;if(!a)return c;if(w&&a.map===w)return a.map(b,d);for(e=0,h=a.length;e<h;e++)c[e]=b.call(d,a[e],e,a);return c}function n(a,b){a=Math.round(Math.abs(a));return isNaN(a)?b:a}function x(a){var b=c.settings.currency.format;"function"===typeof a&&(a=a());return q(a)&&a.match("%v")?{pos:a,neg:a.replace("-","").replace("%v","-%v"),zero:a}:!a||!a.pos||!a.pos.match("%v")?!q(b)?b:c.settings.currency.format={pos:b,neg:b.replace("%v","-%v"),zero:b}:a}var c={version:"0.3.2",settings:{currency:{symbol:"$",format:"%s%v",decimal:".",thousand:",",precision:2,grouping:3},number:{precision:0,grouping:3,thousand:",",decimal:"."}}},w=Array.prototype.map,u=Array.isArray,v=Object.prototype.toString,o=c.unformat=c.parse=function(a,b){if(m(a))return j(a,function(a){return o(a,b)});a=a||0;if("number"===typeof a)return a;var b=b||".",c=RegExp("[^0-9-"+b+"]",["g"]),c=parseFloat((""+a).replace(/\((.*)\)/,"-$1").replace(c,"").replace(b,"."));return!isNaN(c)?c:0},y=c.toFixed=function(a,b){var b=n(b,c.settings.number.precision),d=Math.pow(10,b);return(Math.round(c.unformat(a)*d)/d).toFixed(b)},t=c.formatNumber=function(a,b,d,i){if(m(a))return j(a,function(a){return t(a,b,d,i)});var a=o(a),e=s(r(b)?b:{precision:b,thousand:d,decimal:i},c.settings.number),h=n(e.precision),f=0>a?"-":"",g=parseInt(y(Math.abs(a||0),h),10)+"",l=3<g.length?g.length%3:0;return f+(l?g.substr(0,l)+e.thousand:"")+g.substr(l).replace(/(\d{3})(?=\d)/g,"$1"+e.thousand)+(h?e.decimal+y(Math.abs(a),h).split(".")[1]:"")},A=c.formatMoney=function(a,b,d,i,e,h){if(m(a))return j(a,function(a){return A(a,b,d,i,e,h)});var a=o(a),f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format);return(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal))};c.formatColumn=function(a,b,d,i,e,h){if(!a)return[];var f=s(r(b)?b:{symbol:b,precision:d,thousand:i,decimal:e,format:h},c.settings.currency),g=x(f.format),l=g.pos.indexOf("%s")<g.pos.indexOf("%v")?!0:!1,k=0,a=j(a,function(a){if(m(a))return c.formatColumn(a,f);a=o(a);a=(0<a?g.pos:0>a?g.neg:g.zero).replace("%s",f.symbol).replace("%v",t(Math.abs(a),n(f.precision),f.thousand,f.decimal));if(a.length>k)k=a.length;return a});return j(a,function(a){return q(a)&&a.length<k?l?a.replace(f.symbol,f.symbol+Array(k-a.length+1).join(" ")):Array(k-a.length+1).join(" ")+a:a})};if("undefined"!==typeof exports){if("undefined"!==typeof module&&module.exports)exports=module.exports=c;exports.accounting=c}else"function"===typeof define&&define.amd?define([],function(){return c}):(c.noConflict=function(a){return function(){p.accounting=a;c.noConflict=z;return c}}(p.accounting),p.accounting=c)})(this);