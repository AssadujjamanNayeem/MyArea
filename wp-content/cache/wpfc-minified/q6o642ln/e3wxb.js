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
window.Modernizr=function(a,b,c){function d(a){t.cssText=a}function e(a,b){return d(x.join(a+";")+(b||""))}function f(a,b){return typeof a===b}function g(a,b){return!!~(""+a).indexOf(b)}function h(a,b){for(var d in a){var e=a[d];if(!g(e,"-")&&t[e]!==c)return"pfx"==b?e:!0}return!1}function i(a,b,d){for(var e in a){var g=b[a[e]];if(g!==c)return d===!1?a[e]:f(g,"function")?g.bind(d||b):g}return!1}function j(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+z.join(d+" ")+d).split(" ");return f(b,"string")||f(b,"undefined")?h(e,b):(e=(a+" "+A.join(d+" ")+d).split(" "),i(e,b,c))}function k(){o.input=function(c){for(var d=0,e=c.length;e>d;d++)E[c[d]]=!!(c[d]in u);return E.list&&(E.list=!(!b.createElement("datalist")||!a.HTMLDataListElement)),E}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),o.inputtypes=function(a){for(var d,e,f,g=0,h=a.length;h>g;g++)u.setAttribute("type",e=a[g]),d="text"!==u.type,d&&(u.value=v,u.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(e)&&u.style.WebkitAppearance!==c?(q.appendChild(u),f=b.defaultView,d=f.getComputedStyle&&"textfield"!==f.getComputedStyle(u,null).WebkitAppearance&&0!==u.offsetHeight,q.removeChild(u)):/^(search|tel)$/.test(e)||(d=/^(url|email)$/.test(e)?u.checkValidity&&u.checkValidity()===!1:u.value!=v)),D[a[g]]=!!d;return D}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var l,m,n="2.7.1",o={},p=!0,q=b.documentElement,r="modernizr",s=b.createElement(r),t=s.style,u=b.createElement("input"),v=":)",w={}.toString,x=" -webkit- -moz- -o- -ms- ".split(" "),y="Webkit Moz O ms",z=y.split(" "),A=y.toLowerCase().split(" "),B={svg:"http://www.w3.org/2000/svg"},C={},D={},E={},F=[],G=F.slice,H=function(a,c,d,e){var f,g,h,i,j=b.createElement("div"),k=b.body,l=k||b.createElement("body");if(parseInt(d,10))for(;d--;)h=b.createElement("div"),h.id=e?e[d]:r+(d+1),j.appendChild(h);return f=["&#173;",'<style id="s',r,'">',a,"</style>"].join(""),j.id=r,(k?j:l).innerHTML+=f,l.appendChild(j),k||(l.style.background="",l.style.overflow="hidden",i=q.style.overflow,q.style.overflow="hidden",q.appendChild(l)),g=c(j,a),k?j.parentNode.removeChild(j):(l.parentNode.removeChild(l),q.style.overflow=i),!!g},I=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b).matches;var d;return H("@media "+b+" { #"+r+" { position: absolute; }}",function(b){d="absolute"==(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle).position}),d},J=function(){function a(a,e){e=e||b.createElement(d[a]||"div"),a="on"+a;var g=a in e;return g||(e.setAttribute||(e=b.createElement("div")),e.setAttribute&&e.removeAttribute&&(e.setAttribute(a,""),g=f(e[a],"function"),f(e[a],"undefined")||(e[a]=c),e.removeAttribute(a))),e=null,g}var d={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return a}(),K={}.hasOwnProperty;m=f(K,"undefined")||f(K.call,"undefined")?function(a,b){return b in a&&f(a.constructor.prototype[b],"undefined")}:function(a,b){return K.call(a,b)},Function.prototype.bind||(Function.prototype.bind=function(a){var b=this;if("function"!=typeof b)throw new TypeError;var c=G.call(arguments,1),d=function(){if(this instanceof d){var e=function(){};e.prototype=b.prototype;var f=new e,g=b.apply(f,c.concat(G.call(arguments)));return Object(g)===g?g:f}return b.apply(a,c.concat(G.call(arguments)))};return d}),C.flexbox=function(){return j("flexWrap")},C.flexboxlegacy=function(){return j("boxDirection")},C.canvas=function(){var a=b.createElement("canvas");return!(!a.getContext||!a.getContext("2d"))},C.canvastext=function(){return!(!o.canvas||!f(b.createElement("canvas").getContext("2d").fillText,"function"))},C.webgl=function(){return!!a.WebGLRenderingContext},C.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:H(["@media (",x.join("touch-enabled),("),r,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=9===a.offsetTop}),c},C.geolocation=function(){return"geolocation"in navigator},C.postmessage=function(){return!!a.postMessage},C.websqldatabase=function(){return!!a.openDatabase},C.indexedDB=function(){return!!j("indexedDB",a)},C.hashchange=function(){return J("hashchange",a)&&(b.documentMode===c||b.documentMode>7)},C.history=function(){return!(!a.history||!history.pushState)},C.draganddrop=function(){var a=b.createElement("div");return"draggable"in a||"ondragstart"in a&&"ondrop"in a},C.websockets=function(){return"WebSocket"in a||"MozWebSocket"in a},C.rgba=function(){return d("background-color:rgba(150,255,150,.5)"),g(t.backgroundColor,"rgba")},C.hsla=function(){return d("background-color:hsla(120,40%,100%,.5)"),g(t.backgroundColor,"rgba")||g(t.backgroundColor,"hsla")},C.multiplebgs=function(){return d("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(t.background)},C.backgroundsize=function(){return j("backgroundSize")},C.borderimage=function(){return j("borderImage")},C.borderradius=function(){return j("borderRadius")},C.boxshadow=function(){return j("boxShadow")},C.textshadow=function(){return""===b.createElement("div").style.textShadow},C.opacity=function(){return e("opacity:.55"),/^0.55$/.test(t.opacity)},C.cssanimations=function(){return j("animationName")},C.csscolumns=function(){return j("columnCount")},C.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return d((a+"-webkit- ".split(" ").join(b+a)+x.join(c+a)).slice(0,-a.length)),g(t.backgroundImage,"gradient")},C.cssreflections=function(){return j("boxReflect")},C.csstransforms=function(){return!!j("transform")},C.csstransforms3d=function(){var a=!!j("perspective");return a&&"webkitPerspective"in q.style&&H("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(b){a=9===b.offsetLeft&&3===b.offsetHeight}),a},C.csstransitions=function(){return j("transition")},C.fontface=function(){var a;return H('@font-face {font-family:"font";src:url("https://")}',function(c,d){var e=b.getElementById("smodernizr"),f=e.sheet||e.styleSheet,g=f?f.cssRules&&f.cssRules[0]?f.cssRules[0].cssText:f.cssText||"":"";a=/src/i.test(g)&&0===g.indexOf(d.split(" ")[0])}),a},C.generatedcontent=function(){var a;return H(["#",r,"{font:0/0 a}#",r,':after{content:"',v,'";visibility:hidden;font:3px/1 a}'].join(""),function(b){a=b.offsetHeight>=3}),a},C.video=function(){var a=b.createElement("video"),c=!1;try{(c=!!a.canPlayType)&&(c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,""))}catch(d){}return c},C.audio=function(){var a=b.createElement("audio"),c=!1;try{(c=!!a.canPlayType)&&(c=new Boolean(c),c.ogg=a.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),c.mp3=a.canPlayType("audio/mpeg;").replace(/^no$/,""),c.wav=a.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),c.m4a=(a.canPlayType("audio/x-m4a;")||a.canPlayType("audio/aac;")).replace(/^no$/,""))}catch(d){}return c},C.localstorage=function(){try{return localStorage.setItem(r,r),localStorage.removeItem(r),!0}catch(a){return!1}},C.sessionstorage=function(){try{return sessionStorage.setItem(r,r),sessionStorage.removeItem(r),!0}catch(a){return!1}},C.webworkers=function(){return!!a.Worker},C.applicationcache=function(){return!!a.applicationCache},C.svg=function(){return!!b.createElementNS&&!!b.createElementNS(B.svg,"svg").createSVGRect},C.inlinesvg=function(){var a=b.createElement("div");return a.innerHTML="<svg/>",(a.firstChild&&a.firstChild.namespaceURI)==B.svg},C.smil=function(){return!!b.createElementNS&&/SVGAnimate/.test(w.call(b.createElementNS(B.svg,"animate")))},C.svgclippaths=function(){return!!b.createElementNS&&/SVGClipPath/.test(w.call(b.createElementNS(B.svg,"clipPath")))};for(var L in C)m(C,L)&&(l=L.toLowerCase(),o[l]=C[L](),F.push((o[l]?"":"no-")+l));return o.input||k(),o.addTest=function(a,b){if("object"==typeof a)for(var d in a)m(a,d)&&o.addTest(d,a[d]);else{if(a=a.toLowerCase(),o[a]!==c)return o;b="function"==typeof b?b():b,"undefined"!=typeof p&&p&&(q.className+=" "+(b?"":"no-")+a),o[a]=b}return o},d(""),s=u=null,function(a,b){function c(a,b){var c=a.createElement("p"),d=a.getElementsByTagName("head")[0]||a.documentElement;return c.innerHTML="x<style>"+b+"</style>",d.insertBefore(c.lastChild,d.firstChild)}function d(){var a=s.elements;return"string"==typeof a?a.split(" "):a}function e(a){var b=r[a[p]];return b||(b={},q++,a[p]=q,r[q]=b),b}function f(a,c,d){if(c||(c=b),k)return c.createElement(a);d||(d=e(c));var f;return f=d.cache[a]?d.cache[a].cloneNode():o.test(a)?(d.cache[a]=d.createElem(a)).cloneNode():d.createElem(a),!f.canHaveChildren||n.test(a)||f.tagUrn?f:d.frag.appendChild(f)}function g(a,c){if(a||(a=b),k)return a.createDocumentFragment();c=c||e(a);for(var f=c.frag.cloneNode(),g=0,h=d(),i=h.length;i>g;g++)f.createElement(h[g]);return f}function h(a,b){b.cache||(b.cache={},b.createElem=a.createElement,b.createFrag=a.createDocumentFragment,b.frag=b.createFrag()),a.createElement=function(c){return s.shivMethods?f(c,a,b):b.createElem(c)},a.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+d().join().replace(/[\w\-]+/g,function(a){return b.createElem(a),b.frag.createElement(a),'c("'+a+'")'})+");return n}")(s,b.frag)}function i(a){a||(a=b);var d=e(a);return!s.shivCSS||j||d.hasCSS||(d.hasCSS=!!c(a,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),k||h(a,d),a}var j,k,l="3.7.0",m=a.html5||{},n=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,o=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,p="_html5shiv",q=0,r={};!function(){try{var a=b.createElement("a");a.innerHTML="<xyz></xyz>",j="hidden"in a,k=1==a.childNodes.length||function(){b.createElement("a");var a=b.createDocumentFragment();return"undefined"==typeof a.cloneNode||"undefined"==typeof a.createDocumentFragment||"undefined"==typeof a.createElement}()}catch(c){j=!0,k=!0}}();var s={elements:m.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:l,shivCSS:m.shivCSS!==!1,supportsUnknownElements:k,shivMethods:m.shivMethods!==!1,type:"default",shivDocument:i,createElement:f,createDocumentFragment:g};a.html5=s,i(b)}(this,b),o._version=n,o._prefixes=x,o._domPrefixes=A,o._cssomPrefixes=z,o.mq=I,o.hasEvent=J,o.testProp=function(a){return h([a])},o.testAllProps=j,o.testStyles=H,o.prefixed=function(a,b,c){return b?j(a,b,c):j(a,"pfx")},q.className=q.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(p?" js "+F.join(" "):""),o}(this,this.document);
(function(k,m){var g="3.7.0";var d=k.html5||{};var h=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;var c=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;var q;var i="_html5shiv";var a=0;var o={};var e;(function(){try{var t=m.createElement("a");t.innerHTML="<xyz></xyz>";q=("hidden" in t);e=t.childNodes.length==1||(function(){(m.createElement)("a");var v=m.createDocumentFragment();return(typeof v.cloneNode=="undefined"||typeof v.createDocumentFragment=="undefined"||typeof v.createElement=="undefined")}())}catch(u){q=true;e=true}}());function f(t,v){var w=t.createElement("p"),u=t.getElementsByTagName("head")[0]||t.documentElement;w.innerHTML="x<style>"+v+"</style>";return u.insertBefore(w.lastChild,u.firstChild)}function l(){var t=j.elements;return typeof t=="string"?t.split(" "):t}function p(t){var u=o[t[i]];if(!u){u={};a++;t[i]=a;o[a]=u}return u}function n(w,t,v){if(!t){t=m}if(e){return t.createElement(w)}if(!v){v=p(t)}var u;if(v.cache[w]){u=v.cache[w].cloneNode()}else{if(c.test(w)){u=(v.cache[w]=v.createElem(w)).cloneNode()}else{u=v.createElem(w)}}return u.canHaveChildren&&!h.test(w)&&!u.tagUrn?v.frag.appendChild(u):u}function r(v,x){if(!v){v=m}if(e){return v.createDocumentFragment()}x=x||p(v);var y=x.frag.cloneNode(),w=0,u=l(),t=u.length;for(;w<t;w++){y.createElement(u[w])}return y}function s(t,u){if(!u.cache){u.cache={};u.createElem=t.createElement;u.createFrag=t.createDocumentFragment;u.frag=u.createFrag()}t.createElement=function(v){if(!j.shivMethods){return u.createElem(v)}return n(v,t,u)};t.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+l().join().replace(/[\w\-:]+/g,function(v){u.createElem(v);u.frag.createElement(v);return'c("'+v+'")'})+");return n}")(j,u.frag)}function b(t){if(!t){t=m}var u=p(t);if(j.shivCSS&&!q&&!u.hasCSS){u.hasCSS=!!f(t,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")}if(!e){s(t,u)}return t}var j={elements:d.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:g,shivCSS:(d.shivCSS!==false),supportsUnknownElements:e,shivMethods:(d.shivMethods!==false),type:"default",shivDocument:b,createElement:n,createDocumentFragment:r};k.html5=j;b(m)}(this,document));
var homebrew={};
(function($){
var method,
noop=function (){},
methods=[
'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
'timeStamp', 'trace', 'warn'
],
length=methods.length,
console=(window.console=window.console||{});
while (length--){
method=methods[length];
if(!console[method]){
console[method]=noop;
}}
var root=$('html');
$.extend(homebrew, {
browser:{
ie:root.hasClass('ie'),
ie9:root.hasClass('ie9'),
lt9:root.hasClass('lt9'),
ie8:root.hasClass('ie8'),
lt8:root.hasClass('lt8'),
ie7:root.hasClass('ie7'),
firefox:(window.mozIndexedDB!==undefined)
},
events:{
transitionEnd:'oTransitionEnd otransitionend webkitTransitionEnd transitionend'
},
classes:{
transitionable: 'is-transitionable'
},
screenSize:{
small:false,
medium:false,
large:true
},
mediaQueries:{
small:'only screen and (max-width: 40em)',
medium:'only screen and (min-width: 40.063em)',
large:'only screen and (min-width: 64.063em)'
},
mediaQueriesIE9:{
small:{ size:640, method:'max-width' },
medium:{ size:641, method:'min-width' },
large:{ size:1025, method:'min-width' }}
});
$.extend(homebrew, {
utils:{
throttle:function(func, delay){
var timer=null;
return function (){
var context=this,
args=arguments;
clearTimeout(timer);
timer=setTimeout(function (){
func.apply(context, args);
}, delay);
};},
debounce:function(func, delay, immediate){
var timeout, result;
return function(){
var context=this,
args=arguments,
later=function(){
timeout=null;
if(!immediate) result=func.apply(context, args);
};
var callNow=immediate&&!timeout;
clearTimeout(timeout);
timeout=setTimeout(later, delay);
if(callNow) result=func.apply(context, args);
return result;
};}
},
makePlugin:function(plugin){
var pluginName=plugin.prototype.name;
$.fn[pluginName]=function(options){
var args=$.makeArray(arguments),
after=args.slice(1);
return this.each(function(){
var instance=$.data(this, pluginName);
if(instance){
if(typeof options==='string'){
instance[options].apply(instance, after);
}else if(instance.update){
instance.update.apply(instance, args);
}}else{
new plugin(this, options);
}});
};},
generateUniqueID:function(){
return String(new Date().getTime()) + String(Math.round(Math.random()*100000, 10));
},
getSelectorsFromHTMLString:function(str){
if(typeof str!=='string'){
console.error('homebrew.getSelectorsFromHTMLString(): Expecting a string as the first argument. Please check:');
console.log(str);
return {};}
var tagMatch=str.match(/<(.*?) /g),
attributesMatch=str.match(/ (.*?)=("|')(.*?)("|')/g),
selectorsObj={};
if(tagMatch){
selectorsObj.tag=tagMatch[0].replace(/(<|)/g, '');
}
if(attributesMatch){
var attributeSplitArray,
classesArray;
while(attributesMatch.length){
attributeSplitArray=$.trim(attributesMatch.shift()).split('=');
switch(attributeSplitArray[0]){
case 'class' :
classesArray=attributeSplitArray[1].replace(/("|')/g, '').split(' ');
for(var i=classesArray.length-1; i > -1; i--){
if(classesArray[i]===''){
classesArray.splice(i, 1);
}}
selectorsObj.classes=classesArray;
break;
default :
selectorsObj[attributeSplitArray[0]]=attributeSplitArray[1].replace(/("|')/g, '');
break;
}}
}
return selectorsObj;
},
getClassFromHTMLString:function(str){
var selectorsObj=this.getSelectorsFromHTMLString(str);
if(selectorsObj.classes&&selectorsObj.classes.length){
return selectorsObj.classes;
}else{
return [];
}},
getKeyValuePairsFromString:function(str, pairSeparator, keyValueSeparator){
pairSeparator=pairSeparator||';';
keyValueSeparator=keyValueSeparator||':';
var splitArray=str.split(pairSeparator),
keyValuePairs={},
currentPair;
while(splitArray.length){
currentPair=splitArray.shift();
if(!currentPair) continue;
currentPair=currentPair.split(keyValueSeparator);
currentPair=currentPair.map(function(str){
return $.trim(str);
});
if(currentPair[1]==='true'){
currentPair[1]=true;
}else if(currentPair[1]==='false'){
currentPair[1]=false;
}
keyValuePairs[currentPair[0]]=currentPair[1];
}
return keyValuePairs;
},
watchSize:function(mediaQuery, callback){
var self=this,
_mediaQuery=self.mediaQueries[mediaQuery];
if(typeof _mediaQuery==='undefined'){
throw new Error('homebrew.watchSize(): No match media query. mediaQuery provided is ' + mediaQuery);
}
if(typeof matchMedia==='function'&&matchMedia.addListener){
var matchMediaObj=matchMedia(_mediaQuery);
callback(matchMediaObj.matches);
matchMediaObj.addListener(function(mq){
callback(mq.matches);
});
}else if(!self.browser.lt9){
var mediaQueryProps=self.mediaQueriesIE9[mediaQuery];
if(typeof mediaQueryProps==='undefined') return;
var currentScreen,
getCurrentScreen;
if(mediaQueryProps.method==='min-width'){
getCurrentScreen=function(){
return ($(window).width() >=mediaQueryProps.size);
};}else if(mediaQueryProps.method==='max-width'){
getCurrentScreen=function(){
return ($(window).width() <=mediaQueryProps.size);
};}
currentScreen=getCurrentScreen();
callback(currentScreen);
$(window).on('resize.watchMedia', self.utils.throttle(function(){
if(currentScreen!==getCurrentScreen()){
currentScreen = !currentScreen;
callback(currentScreen);
}}, 100));
}else{
if(mediaQuery==='small'||mediaQuery==='xsmall'){
callback(false);
}else{
callback(true);
}}
}
});
homebrew.watchSize('small', function(isMediumScreen){
homebrew.screenSize.small=isMediumScreen;
homebrew.screenSize.medium = !isMediumScreen;
});
homebrew.watchSize('large', function(isLargeScreen){
homebrew.screenSize.medium = !isLargeScreen;
homebrew.screenSize.large=isLargeScreen;
});
homebrew.Carousel=function(el, args){
if(!el) return;
this.init(el, args);
};
$.extend(homebrew.Carousel.prototype, {
name:'carouselify',
options:{
items:'.carousel-item',
activeItem:null,
classes:{
active:'is-active',
hidden:'is-hidden'
},
loop:true,
transitions:{
enable:true,
classes:{
transitionIn:'is-transitioning-in',
transitionOut:'is-transitioning-out',
reverse:'is-reverse'
},
onStart:null,
onEnd:null
},
switchers:{
enable:true,
markups:{
nextSwitcher:'<div class="carousel__switcher carousel__switcher--next" />',
prevSwitcher:'<div class="carousel__switcher carousel__switcher--prev" />'
}},
pagers:{
enable:true,
markup:'<a href="#/" class="carousel__pager" />',
holder:'<div class="carousel__pagers" />'
},
timer:{
enable:true,
duration:10000,
showBar:true,
barMarkup:'<div class="carousel__timer-bar" />'
},
onSwitch:null
},
init:function(el, args){
var instance=this,
options=$.extend(true, {}, instance.options, args);
if(typeof options.items!=='string'){
console.error('$.fn.carouselify: Expecting String type from `items` argument. Please check:');
console.log(options.items);
return;
}
var $el=$(el),
$items=$el.find(options.items);
if(!$items.length) return;
instance.$el=$el;
instance.$items=$items;
instance.totalItems=$items.length;
instance.options=options;
if(typeof options.activeItem==='number'){
$items.eq(instance.activeItem).addClass(options.classes.active);
instance.activeItem=options.activeItem;
}else if(instance.$items.filter(options.classes.active).length){
instance.activeItem=instance.$items.filter(options.classes.active).index();
}else{
instance.activeItem=0;
}
if(options.switchers.enable){
var $nextSwitcher,
nextSwitcherClasses=homebrew.getClassFromHTMLString(options.switchers.markups.nextSwitcher);
if(nextSwitcherClasses.length){
$nextSwitcher=$el.find('.' + nextSwitcherClasses.join('.'));
}
if(!$nextSwitcher||!$nextSwitcher.length){
$nextSwitcher=$(options.switchers.markups.nextSwitcher);
$el.append($prevSwitcher);
instance.addDestroyable($nextSwitcher);
}
instance.$nextSwitcher=$nextSwitcher;
var $prevSwitcher,
prevSwitcherClasses=homebrew.getClassFromHTMLString(options.switchers.markups.prevSwitcher);
if(prevSwitcherClasses.length){
$prevSwitcher=$el.find('.' + prevSwitcherClasses.join('.'));
}
if(!$prevSwitcher||!$prevSwitcher.length){
$prevSwitcher=$(options.switchers.markups.prevSwitcher);
$el.prepend($prevSwitcher);
instance.addDestroyable($prevSwitcher);
}
instance.$prevSwitcher=$prevSwitcher;
}
if(options.pagers.enable){
var $holders,
$pagers,
pagerClasses=homebrew.getClassFromHTMLString(options.pagers.markup);
if(typeof options.pagers.holder==='string'
&& options.pagers.holder!==''){
var holderClasses=homebrew.getClassFromHTMLString(options.pagers.holder);
if(holderClasses.length){
$holders=$el.find('.' + holderClasses.join('.'));
}
if(!$holders||!$holders.length){
$holders=$(options.pagers.holder).appendTo($el);
}}
if(!$holders||!$holders.length){
$holders=$el;
}
if(pagerClasses.length){
$pagers=$holders.find('.' + pagerClasses.join('.'));
}
if(!$pagers||!$pagers.length){
var finalPagersStr=[];
for(var i=instance.totalItems-1; i > -1; i--){
finalPagersStr.push(options.pagers.markup);
}
$pagers=$(finalPagersStr.join('')).appendTo($holders);
instance.addDestroyable($pagers);
}
$pagers.eq(instance.activeItem).addClass(options.classes.active);
instance.$pagers=$pagers;
}
if(options.timer.enable&&options.showBar){
var $timerBar,
timerBarClasses=homebrew.getClassFromHTMLString(options.timer.barMarkup);
if(timerBarClasses.length){
$timerBar=$el.find('.' + timerBarClasses.join('.'));
}
if(!$timerBar||!$timerBar.length){
$timerBar=$(options.timer.barMarkup);
instance.addDestroyable($timerBar);
}
instance.$timerBar=$timerBar;
if(typeof options.timer.duration!=='number'){
console.error('$.fn.carouselify(): Expecting a number for the timer duration. Please check:');
console.log(options.timer.duration);
console.error('Reverting back to default.');
options.timer.duration=homebrew.Carousel.prototype.options.timer.duration;
}}
instance.enable();
$.data(el, instance.name, instance);
return instance;
},
enable:function(){
var instance=this;
if(instance.$nextSwitcher&&instance.$prevSwitcher){
instance.$nextSwitcher.on('click.' + instance.name, function(){
instance.switchTo('next');
});
instance.$prevSwitcher.on('click.' + instance.name, function(){
instance.switchTo('prev');
});
}
if(instance.$pagers){
instance.$pagers.each(function(index){
$(this).on('click.' + instance.name, function(e){
e.preventDefault();
instance.switchTo(index);
});
});
}
instance.runTimer();
if(instance.options.timer.enable){
$(window)
.on('focus.' + instance.name, function(){
instance.runTimer();
})
.on('blur.' + instance.name, function(){
clearTimeout(instance.timer);
});
}
return instance;
},
disable:function(){
var instance=this;
clearTimeout(instance.timer);
if(instance.$nextSwitcher&&instance.$prevSwitcher){
instance.$nextSwitcher.add(instance.$prevSwitcher).off('click.'  + instance.name);
}
if(instance.$pagers){
instance.$pagers.off('click.' + instance.name);
}
return instance;
},
switchTo:function(itemIndex){
var instance=this;
if(instance.isSwitching===true) return instance;
instance.isSwitching=true;
var activeItem=instance.activeItem,
options=instance.options;
if(typeof itemIndex==='string'){
switch(itemIndex){
case 'next' :
activeItem++;
if(activeItem >=instance.totalItems){
activeItem=0;
}
break;
case 'prev' :
activeItem--;
if(activeItem < 0){
activeItem=instance.totalItems - 1;
}
break;
default:
console.error('Homebrew.Carousel.switchTo(): Unrecognised string method `' + itemIndex + '`.');
return;
break;
}}else if(typeof itemIndex==='number'){
activeItem=itemIndex;
}else{
console.error('Homebrew.Carousel.switchTo(): Unsupported argument type: `' + typeof itemIndex + '`.');
console.log(itemIndex);
return;
}
if(activeItem===instance.activeItem) return instance;
var $currentItem=instance.$items.eq(activeItem),
$prevItem=instance.$items.eq(instance.activeItem),
activeClass=options.classes.active;
if(typeof options.onSwitch==='function'){
options.onSwitch.call(instance.$el[0], $currentItem, $prevItem);
}
instance.runTimer();
if(options.transitions.enable){
var transitionEvent=homebrew.events.transitionEnd,
transitionClass=homebrew.classes.transitionable,
transitionInClass=options.transitions.classes.transitionIn,
transitionOutClass=options.transitions.classes.transitionOut,
reverseClass=options.transitions.classes.reverse;
instance.$items.removeClass([
reverseClass,
transitionClass
].join(' '));
instance.$items.not($prevItem).removeClass(activeClass);
$currentItem
.one(transitionEvent, function(){
$currentItem
.off(transitionEvent)
.add($prevItem)
.removeClass([
transitionInClass,
transitionOutClass,
reverseClass,
transitionClass,
activeClass
].join(' '))
.end()
.addClass(activeClass);
instance.isSwitching=false;
if(typeof options.transitions.onEnd==='function'){
options.transitions.onEnd.call(instance.$el[0], $currentItem, $prevItem);
}});
if(itemIndex==='prev'&&instance.activeItem===0&&activeItem===instance.totalItems-1
|| itemIndex!=='next'&&instance.activeItem > activeItem){
$prevItem.add($currentItem).addClass(reverseClass);
}
setTimeout(function(){
$prevItem.add($currentItem).addClass(transitionClass);
$prevItem.addClass(transitionOutClass);
$currentItem.addClass(transitionInClass);
if(typeof options.transitions.onStart==='function'){
options.transitions.onStart.call(instance.$el[0], $currentItem, $prevItem);
}}, 10);
}else{
instance.$items.removeClass(activeClass);
$currentItem.addClass(activeClass);
instance.isSwitching=false;
}
instance.$pagers.removeClass(activeClass)
.eq(activeItem)
.addClass(activeClass);
instance.activeItem=activeItem;
return instance;
},
runTimer:function(){
var instance=this,
options=instance.options;
if(!options.timer.enable) return instance;
clearTimeout(instance.timer);
if(options.loop||activeItem < instance.totalItems-1){
instance.timer=setTimeout(function(){
instance.switchTo('next');
}, options.timer.duration);
}
return instance;
},
addDestroyable:function($obj){
var instance=this;
if(!instance.destroyables) instance.destroyables=[];
instance.destroyables.push($obj);
return instance;
},
destroy:function(){
var instance=this;
instance.disable();
if(instance.destroyable){
while(instance.destroyable.length){
instance.destoryable.shift().remove();
}}
$.removeData(instance.$el[0], instance.name);
}});
homebrew.makePlugin(homebrew.Carousel);
homebrew.HeightSyncer=function(el, args){
if(!el) return;
this.init(el, args);
};
$.extend(homebrew.HeightSyncer.prototype, {
name:'heightSyncify',
init:function(el, args){
args=args||{};
var instance=this;
instance.$el=$(el);
instance.uniqueID=homebrew.generateUniqueID();
instance.update(args)
.enable();
$.data(el, instance.name, instance);
return instance;
},
update:function(args){
args=args||{};
var instance=this;
instance.items=args.items.slice(0);
for(var i=instance.items.length-1; i > -1; i--){
if(typeof instance.items[i]==='string'){
instance.items[i]=instance.$el.find(instance.items[i]);
}
instance.items[i].find('img').each(function(){
if(this.complete) return;
$(this).one('load', function(){
clearTimeout(instance.timer);
instance.timer=setTimeout(function(){
instance.sync();
}, 100);
});
});
}
if(args.options){
$.extend(instance, args.options);
}
instance.sync();
return instance;
},
enable:function(){
var instance=this;
if(instance.enabled) return instance;
instance.enabled=true;
$(window).on('resize.' + instance.uniqueID, homebrew.utils.throttle(function(){
instance.sync();
}, 30));
return instance;
},
disable:function(){
this.enabled=false;
$(window).off('.' + this.uniqueID);
return this;
},
sync:function(){
var instance=this,
$currentCollection,
$items=$(),
leftOffset,
currentLeftThreshold,
heights,
tallestHeight;
if(!instance.items||!instance.items.length) return instance;
for(var i=0, ii=instance.items.length; i < ii; i++){
leftOffset=currentLeftThreshold=-9999;
$currentCollection=instance.items[i];
$currentCollection.each(function(index){
$items=$items.add($(this));
leftOffset=$(this).offset().left;
if(!$currentCollection.eq(index+1).length
|| $currentCollection.eq(index+1).offset().left <=leftOffset){
heights=[];
$items.css('height', '');
$items.each(function(){
heights.push($(this).outerHeight());
});
tallestHeight=Math.max.apply(null, heights);
$items.outerHeight(tallestHeight);
$items=$();
}});
}
instance.$el.trigger('afterSync');
return instance;
},
destroy:function(){
var instance=this;
while(instance.items.length){
instance.items.shift().css('height', '');
}
instance.disable();
$.removeData(instance.$el[0], instance.name);
}});
homebrew.makePlugin(homebrew.HeightSyncer);
/**---- Tooltipify ---**\
*  Initialise a custom tooltip on the element.
*
*  Arguments:
*      $('.my-element').tooltipify({
*          appendTo:'body',
*          classes:{
*              active:'is-active'
*          },
*          markups:{
*              tooltip:'<div class="tooltip" />'
*          },
*          contents:function(){
*              var instance=this,
*                  title=instance.$el.attr('title');
*
*              instance.$el.data(instance.name + '-title', title);
*              instance.$el.removeAttr('title');
*
*              return title;
*          },
*          transitions:{
*              enable:true,
*              classes:{
*                  transitionIn:'is-transitioning-in',
*                  transitionOut:'is-transitioning-out'
*              }
*          },
*          hoverDuration:400
*      });
*
*  - appendTo
*      |-- Type: Object | String
*      |-- Default: 'body'
*      |-- Determines where the tooltip will be appended to when it is
*          is created to be shown.
*      |-- You can pass in either a string, a Node element or a jQuery
*          object. If what you passed in results in nothing being selected,
*          the plugin will fallback to appending to the <body> element.
*  - classes
*      |-- An Object that contains strings of general classes to be used
*          in the plugin. The classes are:
*          - active
*              |-- Default: 'is-active'
*              |-- The class that will be added to the tooltip after it is
*                  created and shown.
*  - markups
*      |-- An Object that contains strings of markups to be used in
*          the plugin. The markups are:
*          - tooltip
*              |-- Default: '<div class="tooltip" />'
*              |-- The markup used to contain the tooltip.
*  - contents
*      |-- Type: Function | String
*      |-- Default: function(){
*              var instance=this,
*                  title=instance.$el.attr('title');
*
*              instance.$el.data(instance.name + '-title', title);
*              instance.$el.removeAttr('title');
*
*              return title;
*          }
*      |-- Determines the content of the tooltip. There are two ways
*          to set the content:
*          (1) Use a function that returns the content string when it is
*              run. This is useful if the element itself has a title
*              attribute, as you can use this function to save the value
*              and then proceed to remove the attribute (to prevent the
*              default tooltip),
*              OR
*          (2) Directly pass in the content string itself.
*      |-- The content string is inserted using the `.html()` method.
*  - hoverDuration
*      |-- Type: Number
*      |-- Default: 400
*      |-- Determines how long the mouse needs to hover over the element
*          in order to trigger the tooltip. Lower number means a shorter
*          duration to trigger.
*  - transitions
*      |-- An Object that contains the various properties to be used
*          in the plugin. The properties are:
*          - enable
*              |-- Type: Boolean
*              |-- Default: true
*              |-- Determines whether or not the plugin should attempt
*                  to leverage CSS transitions.
*          - classes
*              |-- An Object that contains strings of transition classes
*                  to be used in the plugin. The classes are:
*                  - transition
*                      |-- Default: homebrew.classes.transition
*                      |-- This class is used to enable the transition
*                          effect on the element.
*                  - transitionIn
*                      |-- Default: 'is-transitioning-in'
*                      |-- This class is used to make the tooltip
*                          transition in.
*                  - transitionOut
*                      |-- Default: 'is-transitioning-out'
*                      |-- This class is used to make the tooltip
*                          transition out.
*/
homebrew.Tooltip=function(el, args){
if(!el) return;
this.init(el, args);
};
$.extend(homebrew.Tooltip.prototype, {
name:'tooltipify',
options:{
appendTo:'body',
markups:{
tooltip:'<div class="tooltip" />',
closer:'<a href="#/" class="tooltip__closer" />'
},
classes:{
active:'is-active'
},
contents:function(){
var instance=this,
title=instance.$el.attr('title');
instance.$el.data(instance.name + '-title', title);
instance.$el.removeAttr('title');
return title;
},
hoverDuration:400,
transitions:{
enable:true,
classes:{
transition:homebrew.classes.transitionable,
transitionIn:'is-transitioning-in',
transitionOut:'is-transitioning-out'
}}
},
init:function(el, args){
var instance=this,
options=$.extend({}, instance.options, args);
instance.$el=$(el).addClass(instance.name);
instance.uniqueID=homebrew.generateUniqueID();
instance.options=options;
instance.$appendTo=$(options.appendTo);
if(!instance.$appendTo.length){
instance.$appendTo='body';
}
if(typeof options.contents==='function'){
options.contents=options.contents.call(instance);
}
instance.enable();
$.data(el, instance.name, instance);
},
enable:function(){
var instance=this,
$el=instance.$el,
options=instance.options;
$el.on('click.' + instance.uniqueID, function(e){
e.preventDefault();
clearTimeout(instance.timer);
instance.open();
});
$el.on('mouseenter.' + instance.uniqueID, function(e){
clearTimeout(instance.timer);
instance.timer=setTimeout(function(){
instance.open();
}, options.hoverDuration);
});
$el.on('mouseleave.' + instance.uniqueID, function(e){
clearTimeout(instance.timer);
instance.timer=setTimeout(function(){
instance.close();
}, options.hoverDuration);
});
return instance;
},
disable:function(){
this.$el.off('.' + instance.uniqueID);
return this;
},
getAltRender:function(){
return Modernizr.touch&&homebrew.screenSize.small;
},
open:function(){
var instance=this;
if(instance.$tooltip) return;
var $el=instance.$el,
options=instance.options,
$tooltip=$(options.markups.tooltip).appendTo(instance.$appendTo).html(options.contents),
activeClass=options.classes.active,
altRender=instance.getAltRender();
instance.$tooltip=$tooltip;
if(altRender){
var $closer=$('.' + homebrew.getClassFromHTMLString(options.markups.closer).join('.'));
if(!$closer.length){
$closer=$(options.markups.closer).prependTo($tooltip);
}
$closer.on('click', function(e){
e.preventDefault();
instance.close();
});
}else{
if(homebrew.screenSize.small){
if($tooltip.outerWidth() + parseInt($tooltip.css('margin-left'), 10)===$(window).width()){
$tooltip.css({
left:'0px',
marginLeft:'0px'
});
}else if($el.offset().left + $tooltip.outerWidth() > $(window).width()){
$tooltip.css('right', '0px');
}else{
$tooltip
.css('left', $el.offset().left + 'px');
}}else{
if($el.offset().left + $tooltip.outerWidth() > $(window).width()){
$tooltip
.addClass('is-opposite')
.css('right', '0px');
}else{
$tooltip
.css('left', $el.offset().left + 'px');
}}
$tooltip.css('top', $el.offset().top - $('#mainContent').offset().top - $tooltip.outerHeight() + 'px')
}
if(options.transitions.enable){
var transitionEvent=homebrew.events.transitionEnd,
transitionClass=homebrew.classes.transitionable,
transitionInClass=options.transitions.classes.transitionIn;
$tooltip
.one(transitionEvent, function(){
$tooltip.removeClass([transitionClass, transitionInClass].join(' '))
.addClass(activeClass);
$(document).on([
'click.fauxBlur.', instance.uniqueID,
' touchstart.fauxBlur.', instance.uniqueID
].join(''), function(e){
if(!$tooltip.is(e.target)&&$tooltip.has(e.target).length===0){
instance.close();
}});
})
.on({
mouseenter:function(){
clearTimeout(instance.timer);
},
mouseleave:function(){
clearTimeout(instance.timer);
instance.timer=setTimeout(function(){
instance.close();
}, options.hoverDuration);
}});
setTimeout(function(){
$tooltip.addClass(transitionClass);
if(altRender){
$tooltip.css('margin-top', -$tooltip.outerHeight() + 'px');
}else{
$tooltip.addClass(transitionInClass);
}}, 10);
}else{
$tooltip.addClass(activeClass);
}
return instance;
},
close:function(args){
args=args||{};
var instance=this,
$tooltip=instance.$tooltip;
if(!$tooltip) return;
var options=instance.options,
activeClass=options.classes.active,
altRender=instance.getAltRender();
$(document).off('.fauxBlur.' + instance.uniqueID);
if(options.transitions.enable){
var transitionEvent=homebrew.events.transitionEnd,
transitionClass=homebrew.classes.transitionable,
transitionOutClass=options.transitions.classes.transitionOut;
$tooltip
.trigger(transitionEvent)
.off('mouseenter mouseleave')
.one(transitionEvent, function(){
$tooltip.removeClass([transitionClass, transitionOutClass].join(' '))
.removeClass(activeClass)
.remove();
instance.$tooltip=null;
if(typeof args.onCloseEnd==='function'){
args.onCloseEnd();
}});
setTimeout(function(){
$tooltip.addClass(transitionClass);
if(altRender){
$tooltip.css('margin-top', '');
}else{
$tooltip.addClass(transitionOutClass);
}}, 10);
}else{
$tooltip.removeClass(activeClass);
instance.$tooltip=null;
if(typeof args.onClose==='function'){
args.onClose();
}}
return instance;
},
destroy:function(){
var instance=this,
el=instance.$el[0],
options=instance.options;
instance.disable().close();
$.removeData(el, instance.name);
if($.data(el, instance.name + '-title')){
el.title=$.data(el, instance.name + '-title');
$.removeData(el, instance.name + '-title');
}}
});
homebrew.makePlugin(homebrew.Tooltip);
$.fn.extend({
dropdownify:function(){
var pluginName='dropdownify',
options={
markups:{
holder:'<div />',
button:'<div />',
arrow:'<div><i /></div>',
label:'<span />'
},
classes:{
holder:'dropdown',
button:'dropdown-btn',
arrow:'dropdown-arrow',
label:'dropdown-label'
}},
methods={
create: function(){
var forms=this.parents('form');
if(forms.length){
forms.off('.' + pluginName).on('reset.' + pluginName, function(){
var _this=$(this);
setTimeout(function(){
_this.find('select').trigger('change');
}, 25);
});
}
this.each(function(){
var $this=$(this),
dropdown=($this.is('select')) ? $this:$this.children('select');
if(!dropdown.length||typeof dropdown.data(pluginName)!=='undefined') return;
var dropdownAttr;
if($this.is('select')){
dropdownAttr=$this.data('dropdown-attributes');
}else{
dropdownAttr=$this.getAttributes();
dropdown.unwrap();
}
var holder=dropdown.closest('.' + options.classes.holder);
if(holder.length < 1){
holder=$(options.markups.holder).addClass(options.classes.holder);
dropdown.after(holder).prependTo(holder);
}
if(typeof dropdownAttr==='object'){
$.each(dropdownAttr, function(key, value){
if(key==='class'){
holder.addClass(value);
}else{
holder.attr(key, value);
}});
}
var btn=holder.find('.' + options.classes.button);
if(btn.length < 1) btn=$(options.markups.button).addClass(options.classes.button).appendTo(holder);
var arrow=btn.find('.' + options.classes.arrow);
if(arrow.length < 1) arrow=$(options.markups.arrow).addClass(options.classes.arrow).appendTo(btn);
var label=btn.find('.' + options.classes.label);
if(label.length < 1) label=$(options.markups.label).addClass(options.classes.label).text(dropdown.find('option:checked').text()).appendTo(btn);
dropdown.data(pluginName, {
activate: function(){
var _this=this;
dropdown.on('change.' + pluginName, function(){
_this.refresh();
});
return _this;
},
deactivate: function(){
dropdown.off('.' + pluginName);
return this;
},
refresh: function(){
var checkedText=dropdown.find('option:checked').text();
if(!dropdown.data('ignore-asterisk')&&checkedText.lastIndexOf('*')===checkedText.length-1){
checkedText=[
checkedText.substr(0, checkedText.length-1),
'<span class="text-red">*</span>'
].join('');
}
label.html(checkedText);
btn.toggleClass('is-placeholder', Boolean(dropdown.val()===''));
return this;
},
destroy: function(){
dropdown
.insertBefore(holder)
.off('.' + pluginName)
.removeData(pluginName)
.closest('form')
.off('.' + pluginName);
holder.remove();
},
$elems: {
arrow: arrow,
button: btn,
holder: holder,
label: label
}});
dropdown.data(pluginName).activate().refresh();
});
},
activate: function(){
runElemMethod.call(this, pluginName, 'activate');
},
deactivate: function(){
runElemMethod.call(this, pluginName, 'deactivate');
},
refresh: function(){
runElemMethod.call(this, pluginName, 'refresh');
},
destroy: function(){
runElemMethod.call(this, pluginName, 'destroy');
}},
_arguments=arguments;
for(var i=_arguments.length-1; i > -1; i--){
if(typeof _arguments[i]==='object') $.extend(true, options, _arguments[i]);
}
if(typeof _arguments[0]==='string'&&typeof methods[_arguments[0]]==='function'){
methods[_arguments[0]].call(this);
}else{
methods.create.call(this);
}
return this;
},
getAttributes:function(){
var elem=this,
attr={};
if(elem.length){
$.each(elem.get(0).attributes, function(v,n){
n=n.nodeName||n.name;
v=elem.attr(n);
if(v!==undefined&&v!==false) attr[n]=v;
});
}
return attr;
},
inputify:function(_options){
var pluginName='inputify',
options={
inputIconClass:'icon--input',
radioClass:'icon--radio-btn',
checkboxClass:'icon--checkbox',
checkedClass:'is-checked',
hiddenClass:'hidden-accessible',
inputVisualMarkupArray:['<div class="icon ', 'inputIconClass', ' ', 'inputTypeClass', '"><i /></div>'],
labelMarkupArray:['<label for="', 'inputID', '">', 'inputVisualMarkupArray', '</label>']
},
methods={
create: function(){
var labels=$('label');
this.each(function(index){
var input=$(this);
if(typeof input.data(pluginName)!=='undefined') return;
var inputType=input.attr('type'),
inputTypeClass=getInputTypeClass(input.attr('type')),
inputID=input.attr('id'),
label=labels.filter('[for="' + inputID + '"]');
if(!label.length) label=input.closest('label');
if(!label.length){
if(typeof inputID!=='string'||inputID===''){
input.attr('id', index + new Date().getTime());
inputID=input.attr('id');
}
options.labelMarkupArray[1]=inputID;
options.labelMarkupArray[3]=options.inputVisualMarkupArray.join('');
label=$(options.labelMarkupArray.join(''));
label.data(pluginName, {
destroyable: true
});
input.after(label);
}
var inputVisual=label.find('.' + inputTypeClass);
if(!inputVisual.length){
options.inputVisualMarkupArray[1]=options.inputIconClass;
options.inputVisualMarkupArray[3]=inputTypeClass;
if(input.is(':checked')) options.inputVisualMarkupArray[3] +=' is-checked';
if(input.parents('label').length){
$(options.inputVisualMarkupArray.join('')).insertAfter(input);
}else{
$(options.inputVisualMarkupArray.join('')).prependTo(label);
}}
input
.addClass(options.hiddenClass)
.data(pluginName, {
'$els':{
'label':label
},
refresh:function(){
var $inputVisual=this.$els.label.find('.' + options.inputIconClass);
if(input.is(':checked')){
$inputVisual.addClass(options.checkedClass);
}else{
$inputVisual.removeClass(options.checkedClass);
}
return this;
}});
});
var radioInputs=this.filter('[type="radio"]');
if(radioInputs.length){
var radioGroupNames=[];
radioInputs.each(function(){
var radioInput=$(this),
radioInputName=radioInput.attr('name');
if(typeof radioInputName!=='string') return;
if(radioGroupNames.length < 1&&radioInputName!==''){
radioGroupNames.push(radioInputName);
}else{
for(var i=radioGroupNames.length-1; i > -1; i--){
if(radioGroupNames[i]==radioInputName){
break;
}else if(i===0){
radioGroupNames.push(radioInputName);
}}
}});
for(var i=radioGroupNames.length; i > -1; i--){
(function(){
var $radioGroupInputs=radioInputs.filter('[name="' + radioGroupNames[i] + '"]');
$radioGroupInputs
.off('change.' + pluginName)
.on('change.' + pluginName, function(){
$radioGroupInputs.each(function(){
$(this).data(pluginName).refresh();
});
});
})();
}}
var checkboxInputs=this.filter('[type="checkbox"]');
if(checkboxInputs.length){
checkboxInputs
.off('change.' + pluginName)
.on('change.' + pluginName, function(){
$(this).data(pluginName).refresh();
});
}
var forms=this.closest('form'),
inputs=this;
if(forms.length){
forms
.off('reset.inputify')
.on('reset.inputify', function(){
setTimeout(function(){
inputs.trigger('change');
}, 25);
});
}},
destroy: function(){
var labels=$('label');
this.each(function(){
var $this=$(this),
inputId=$this.attr('id');
if(typeof label.data(pluginName)!=='object'
&& label.data(pluginName).destroyable){
label.remove();
}});
var forms=this.closest('form');
this.off('.' + pluginName);
forms.off('.' + pluginName);
},
refresh: function(){
runElemMethod.call(this, pluginName, 'refresh');
}},
_arguments=arguments;
function getInputTypeClass(type){
switch(type){
case 'radio':      return options.radioClass;
case 'checkbox':   return options.checkboxClass;
default:           return undefined;
}}
for(var i=_arguments.length-1; i > -1; i--){
if(typeof _arguments[i]==='object') $.extend(options, _arguments[i]);
}
if(typeof _arguments[0]==='string'&&typeof methods[_arguments[0]]==='function'){
methods[_arguments[0]].call(this);
}else{
methods.create.call(this);
}
return this;
},
/**---- Popupify ----**\
* Call this `$('.foo').popupify()` function on your desired popups and
* popup togglers.
* Sample popup toggler node:
<a href="#corporateProfile" class="foo">Toggle popup</a>
<div id="corporateProfile" />
* `href` should be a hash, followed by the ID of the target popup.
* Alternatively, you may pass a function into the `content` parameter to
* programmatically select the element whose contents will be used as the
* popup contents. For example:
<button type="button" id="popupToggler">Click me to show popup</button>
<div class="foobar-con">
<div class="hello-world"> ... </div>
<div class="popup-content"> ... </div>
</div>
<script>$(function(){
$('#popupToggler').popupify({
content:function(){
return $(this).next().find('.popup-content');
}});
});</script>
* While invoking this function, it is possible to specify a `height`
* argument to create popups that have a set height:
$('.foobar').popupify({ height:500 });
* Alternatively, you may also specify the height through the
* `data-popup-height` attribute:
<a href="#corporateProfile" data-popup-height="500">Toggle popup</a>
* The height value MUST be a NUMBER.
* If the popup contents is taller than its set height, default
* scrollbars will appear on the popup.
* If the popup itself is taller than the page, then scrollbars
* will appear on the popup holder.
**/
popupify:function(_options){
var pluginName='popupify',
$body=$('body'),
options={
classes:{
mainPopupHolder:'main-popup-holder',
shown:'is-shown'
},
ids:{
mainPopupHolder:'mainPopupHolder'
},
$elems:{
mainPopupHolder:null
},
markups:{
closeBtn:'<a href="#close" data-hide-popup="true" class="popup-closer">Back</a>'
},
content:undefined,
addCloseBtns:true,
closeOnOverlay:true
},
methods={
create:function(){
var $mainPopupHolder=options.$elems.mainPopupHolder;
if(!thisObjectExists($mainPopupHolder)) $mainPopupHolder=$('#' + options.ids.mainPopupHolder);
if($mainPopupHolder.length < 1){
$mainPopupHolder=$([
'<div class="', options.classes.mainPopupHolder, '" id="', options.ids.mainPopupHolder, '" ></div>'
].join('')).appendTo($body);
options.$elems.mainPopupHolder=$mainPopupHolder;
}else{
$mainPopupHolder.appendTo('body');
}
if(!thisDataIsValidObject($mainPopupHolder, pluginName)){
$mainPopupHolder.data(pluginName, {
reveal:function(){
$body.addClass('popup-is-shown');
setTimeout(function(){
$mainPopupHolder.addClass(options.classes.shown);
}, 10);
return this;
},
conceal:function(){
$body.removeClass('popup-is-shown');
setTimeout(function(){
$mainPopupHolder.removeClass(options.classes.shown);
}, 10);
return this;
},
activate:function(){
var _dataMethods=this;
_dataMethods.deactivate();
$mainPopupHolder.on("click." + pluginName, function(){
if($.fn.popupify.closeOnOverlay===true){
_dataMethods.conceal();
}});
$mainPopupHolder.on('click.' + pluginName, '.popup', function(e){
e.stopPropagation();
});
$mainPopupHolder.on('click.' + pluginName, '[data-hide-popup]', function(e){
e.preventDefault();
_dataMethods.conceal();
});
return _dataMethods;
},
deactivate:function(){
$mainPopupHolder.off('.' + pluginName);
return this;
},
destroy:function(){
this.deactivate();
$mainPopupHolder.removeData(pluginName);
}});
$mainPopupHolder.data(pluginName).activate();
if(homebrew.browser.ie7) $mainPopupHolder.pseudofy({ method:'before' });
}
if(this.length < 1) return;
this.each(function(){
var $this=$(this),
dataTargetPopup=$this.data('target-popup'),
target;
if(typeof options.content==='function'){
target=options.content.call(this);
}else if(typeof dataTargetPopup==='string'){
target=$($this.data('target-popup'));
}else if(typeof dataTargetPopup==='object'&&dataTargetPopup instanceof jQuery){
target=dataTargetPopup;
}else if(typeof $this.attr('href')!=='undefined'){
target=$($this.attr('href'));
}
if(thisObjectExists(target)){
if(!thisDataIsValidObject($this, pluginName)){
$this.data(pluginName, {
reveal:function(){
target.data(pluginName).reveal();
return this;
},
conceal:function(){
$mainPopupHolder.data(pluginName).conceal();
return this;
},
activate:function(){
var _dataMethods=this;
_dataMethods.deactivate();
$this.on('click.' + pluginName, function(e){
e.preventDefault();
_dataMethods.reveal();
});
return $this;
},
deactivate:function(){
$this.off('.' + pluginName);
return $this;
},
destroy:function(){
this.deactivate();
target.data(pluginName).destroy();
$this.removeData(pluginName);
}});
$this.data(pluginName).activate();
}}else{
target=$(this);
}
if(!target.parent().is($mainPopupHolder)){
target.appendTo($mainPopupHolder);
}
if(options.addCloseBtns&&target.find('.popup-closer').length < 1){
target.prepend(options.markups.closeBtn);
}
if(typeof target.data(pluginName)==='undefined'){
target.data(pluginName, {
reveal:function(){
$mainPopupHolder.find('.popup').removeClass(options.classes.shown);
target.addClass(options.classes.shown);
$mainPopupHolder.data(pluginName).reveal();
$.fn.popupify.closeOnOverlay=options.closeOnOverlay;
if(homebrew.browser.ie){
target.trigger('revealed');
}else{
$mainPopupHolder.on(homebrew.events.transitionEnd, function(){
$mainPopupHolder.off(homebrew.events.transitionEnd);
target.trigger('revealed');
});
}
return this;
},
conceal:function(){
$mainPopupHolder.data(pluginName).conceal();
return this;
},
destroy:function(){
target.removeData(pluginName);
}});
}});
},
activate:function(){
runElemMethod.call(this, pluginName, 'activate');
},
deactivate:function(){
runElemMethod.call(this, pluginName, 'deactivate');
},
destroy:function(){
var $mainPopupHolder=options.$elems.mainPopupHolder;
if(!thisObjectExists($mainPopupHolder)) $mainPopupHolder=$('#' + options.ids.mainPopupHolder);
if($mainPopupHolder.length&&typeof $mainPopupHolder.data(pluginName)!=='undefined'){
$mainPopupHolder.data(pluginName).destroy();
}
runElemMethod.call(this, pluginName, 'destroy');
}},
_arguments=arguments;
for(var i=_arguments.length-1; i > -1; i--){
if(typeof _arguments[i]==='object') $.extend(options, _arguments[i]);
}
if(typeof _arguments[0]==='string'&&typeof methods[_arguments[0]]==='function'){
methods[_arguments[0]].call(this);
}else{
methods.create.call(this);
}
return this;
},
placeholderify:function(_options){
var options=$.extend({}, _options, {
placeholderClass:'is-placeholder'
});
return this.each(function(){
var input=$(this),
placeholderText=input.attr('placeholder');
if(input.val()===''){
if(input.attr('type')==='password'){
input.attr('type', 'text');
input.data('was-password', true);
}
input.val(placeholderText).addClass(options.placeholderClass);
}
input.on({
'focus.placeholder':function(){
if(input.val()===placeholderText){
if(input.data('was-password')){
input.attr('type', 'password');
}
input.val('').removeClass(options.placeholderClass);
}},
'blur.placeholder':function(){
if(input.val()===''){
if(input.data('was-password')){
input.attr('type', 'text');
}
input.val(placeholderText).addClass(options.placeholderClass);
}}
});
});
},
queryStr:function(key){
var searchStr=window.location.search;
if(searchStr==='') return false;
var queryArr=window.location.search.substr(1).split('&'),
tempArr;
if(typeof key==='string'){
for(var i=0, ii=queryArr.length; i < ii; i++){
tempArr=queryArr[i].split('=');
if(tempArr[0]===key) return tempArr[1];
}
return false;
}else{
var resultValue={};
for(var i=0, ii=queryArr.length; i < ii; i++){
tempArr=queryArr[i].split('=');
resultValue[tempArr[0]]=tempArr[1];
}
return resultValue;
}},
/**---- Togglerify ----**\
* `$('.togglers').togglerify()` turns its target nodes into
* togglers; by default, it is a simple class toggler that
* adds/removes a class on its corresponding target node.
* An example:
<a class="togglers" data-togglerify-target="togglerContentID">Toggler</a>
<div id="togglerContentID" />
* `data-togglerify-target` determines which element the function
* will toggle the class on. The value should be the ID of the
* desired node. Alternatively, you can pass in a function to the
* `content` argument, which will be used to select the desired
* element. For example:
<a class="togglers">Toggler</a>
<div class="contents" />
$('.togglers').togglerify({
content: function(index){
return $(this).next('.contents);
}});
* The `this` keyword refers to the toggler element that's being
* iterated over. You're also given the toggler's index to make use.
* By default, the class toggled is `is-toggled`. You may pass
* in your own class to toggle, as follows:
$('.foo').togglerify({ toggledClass:'is-triggered' });
* The parameters that let you adjust the behaviour:
*   - `singleActive`
*=Default value: false
*=Setting this to `true` ensures that there is only
*            one active toggler at any given time in each
*            iterated group
*   - `selfToggleable`
*=Default value: true
*=Setting this to `false` removes the toggler's
*            ability to toggle itself off.
*   - `slide`
*=Default value: false
*=Setting this to `true` causes the function to
*            add a sliding transition effect, using CSS Transitions
*            if available, and falling back to jQuery's slide
*            methods otherwise.
*   - `pretoggle`
*=Default value: undefined
*=Assigning an index to this parameter causes the
*            function to immediately activate the toggler in
*            question. Index should be zero-based.
*   - `content`
*=Default value: undefined
*=Assigning a function to this parameter causes the
*            function to run this in order to find its target
*            content. If this parameter is provided, the function
*            will ignore the `data-togglerify-target` attribute.
**/
togglerify:function(){
var pluginName='togglerify',
options={
toggledClass:'is-toggled',
singleActive:false,
selfToggleable:true,
slide:false,
slideDuration:300,
pretoggle:undefined,
content:undefined,
useCSSTransitions:!homebrew.browser.ie&&root.hasClass('csstransitions'),
classes:{
transitionable: homebrew.classes.transitionable
}},
methods={
create: function(){
var togglers=this;
togglers.each(function(index){
var thisToggler=$(this),
targetData=thisToggler.data('togglerify-target'),
target;
if(typeof options.content==='function'){
target=options.content.call(this, index);
}else if(typeof targetData==='string'){
target=$('#' + targetData);
}else{
target=$(thisToggler.attr('href'));
}
if(!target.length) return;
var togglerAndTarget=thisToggler.add(target);
togglerAndTarget.data(pluginName, {
activate:function(){
this.deactivate();
thisToggler.on('click.' + pluginName, function(e){
e.preventDefault();
if(thisToggler.hasClass(options.toggledClass)){
if(options.selfToggleable===false) return;
thisToggler.data(pluginName).toggleOff();
return;
}
thisToggler.data(pluginName).toggleOn();
});
return this;
},
deactivate:function(){
thisToggler.off('click.' + pluginName);
return this;
},
toggleOn:function(methodSettings){
methodSettings=methodSettings||{};
togglerAndTarget
.trigger('toggleOn', [thisToggler, target])
.trigger('toggle', [thisToggler, target]);
thisToggler.addClass(options.toggledClass);
target.addClass(options.toggledClass);
if(options.singleActive){
togglers.not(thisToggler).togglerify('toggleOff');
}
if(options.slide&&!methodSettings.noSlide){
var targetHeight=methodSettings.contentHeight;
if(options.useCSSTransitions){
if(typeof targetHeight!=='number'){
target.css('height', 'auto');
targetHeight=target.get(0).clientHeight;
}
target.css('height', '0px').addClass(options.classes.transitionable);
setTimeout(function(){
target
.off(homebrew.events.transitionEnd)
.on(homebrew.events.transitionEnd, function(){
target
.off(homebrew.events.transitionEnd)
.removeClass(options.classes.transitionable);
if(typeof methodSettings.contentHeight!=='number'){
target.css('height', '');
}
togglerAndTarget
.trigger('afterToggleOn', [thisToggler, target])
.trigger('afterToggle', [thisToggler, target]);
})
.css('height', targetHeight + 'px');
}, 5);
}else{
if(typeof targetHeight!=='number'){
target.show();
targetHeight=target.get(0).clientHeight;
}
target.hide();
target.slideDown(options.slideDuration, function(){
togglerAndTarget
.trigger('afterToggleOn', [thisToggler, target])
.trigger('afterToggle', [thisToggler, target]);
});
}}else{
togglerAndTarget
.trigger('afterToggleOn', [thisToggler, target])
.trigger('afterToggle', [thisToggler, target]);
}
return this;
},
toggleOff:function(methodSettings){
if(!thisToggler.hasClass(options.toggledClass)) return;
methodSettings=methodSettings||{};
togglerAndTarget
.trigger('toggleOff', [thisToggler, target])
.trigger('toggle', [thisToggler, target]);
thisToggler.removeClass(options.toggledClass);
if(options.slide&&!methodSettings.noSlide){
if(options.useCSSTransitions){
var targetHeight=target.get(0).clientHeight;
target
.css('height', targetHeight + 'px')
.removeClass(options.toggledClass);
setTimeout(function(){
target
.addClass(options.classes.transitionable)
.off(homebrew.events.transitionEnd)
.on(homebrew.events.transitionEnd, function(){
target
.off(homebrew.events.transitionEnd)
.removeClass(options.classes.transitionable)
.css('height', '');
togglerAndTarget
.trigger('afterToggleOff', [thisToggler, target])
.trigger('afterToggle', [thisToggler, target]);
})
.css('height', '0px');
}, 5);
}else{
target
.slideUp(options.slideDuration, function(){
togglerAndTarget
.trigger('afterToggleOff', [thisToggler, target])
.trigger('afterToggle', [thisToggler, target]);
})
.removeClass(options.toggledClass);
}}else{
target.removeClass(options.toggledClass);
togglerAndTarget
.trigger('afterToggleOff', [thisToggler, target])
.trigger('afterToggle', [thisToggler, target]);
}
return this;
},
set:function(key, value){
if(typeof arguments[0]==='object'){
$.extend(true, options, arguments[0]);
}else{
options[key]=value;
}
return this;
},
destroy:function(){
this.deactivate();
togglerAndTarget.removeData(pluginName);
}});
thisToggler.data(pluginName).activate();
if(typeof options.pretoggle==='number'&&index===options.pretoggle){
thisToggler.addClass(options.toggledClass);
if(options.slide) target.addClass(options.toggledClass);
if(!options.useCSSTransitions) target.show();
}});
},
activate: function(){
runElemMethod.call(this, pluginName, 'activate', arguments);
},
deactivate: function(){
runElemMethod.call(this, pluginName, 'deactivate', arguments);
},
toggleOn: function(){
runElemMethod.call(this, pluginName, 'toggleOn', arguments);
},
toggleOff: function(){
runElemMethod.call(this, pluginName, 'toggleOff', arguments);
},
set: function(){
runElemMethod.call(this, pluginName, 'set', arguments);
},
destroy:function(){
runElemMethod.call(this, pluginName, 'destroy', arguments);
}},
_arguments=arguments;
if(typeof _arguments[0]==='string'&&_arguments[0]!=='create'&&typeof methods[_arguments[0]]==='function'){
methods[_arguments[0]].apply(this, $.makeArray(_arguments).slice(1));
}else{
for(var i=_arguments.length-1; i > -1; i--){
if(typeof _arguments[i]==='object') $.extend(options, _arguments[i]);
}
methods.create.call(this);
}
return this;
},
validify:function(_options){
var pluginName='validify',
options={
selectors:{
all:'input[data-validify], textarea[data-validify], select[data-validify]',
fields:'input[data-validify], textarea[data-validify], select[data-validify]',
groups:'[data-validify-group]',
textFields:'input[type="text"], input[type="tel"], input[type="number"], input[type="email"], input[type="password"], textarea',
checkButtons:'input[type="radio"], input[type="checkbox"]',
dropdowns:'select'
},
classes:[
{ key:'success',      className:'is-success' },
{ key:'hovered',      className:'is-hovered' },
{ key:'focused',      className:'is-focused' },
{ key:'failed',       className:'is-failed' },
{ key:'pattern',      className:'is-failed-pattern' },
{ key:'minlength',    className:'is-failed-minlength' },
{ key:'required',     className:'is-failed-required' },
{ key:'compare-with', className:'is-failed-compare-with' },
{ key:'minchecked',   className:'is-failed-minchecked' },
{ key:'custom',       className:'is-failed-custom' }
],
regexes:[
{ key:'name', pattern:  /^[^\d<>!@#$%^&*()=+|{}:;"',.`~_\/\\\]]+$/i },
{ key:'alphabet', pattern:  /^[a-z\s]+$/i },
{ key:'alphanumeric', pattern:/^[a-z0-9\s]+$/i },
{ key:'email', pattern:/^[^\s@]+@[^\s@]+\.[^\s@]+$/i },
{ key:'dob', pattern:/^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/ },
{ key:'numbers', pattern:/^\s*\d+\s*$/ },
{ key:'phone', pattern:/^[\+\-0-9\s]+$/ },
{ key:'mobile-number', pattern:/^01(|[\d]+)$/ },
{ key:'full-mobile-number', pattern:/^601(|[\d]+)$/ },
{ key:'basic', pattern:/^[^<>]+$/i }
],
validationTimerDuration:250,
debug: false
},
allClasses=(function(){
var tempArr=[];
for(var i=options.classes.length-1; i > -1; i--){
if(options.classes[i].key==='focused') continue;
tempArr.push(options.classes[i].className);
}
return tempArr.join(' ');
})(),
methods={
create: function(){
this.each(function(){
var thisForm=$(this),
allInputs=thisForm.find(options.selectors.all);
thisForm.data(pluginName, {
valid: false,
strict: false,
debug: options.debug,
allInputs: allInputs,
validate: function(){
var _this=this;
debugMsg.call(thisForm, [
' 
allInputs.each(function(){
$(this).data(pluginName).validate();
});
_this.refresh();
debugMsg.call(thisForm, 'Form validation: ' + _this.valid);
debugMsg.call(thisForm, [
' ------------------------------------------------------- ',
'         Form validation status update complete          ',
' \\*===================================================*/ ',
''
], 'end');
},
refresh: function(){
var _this=this;
_this.valid=true;
allInputs.each(function(){
if($(this).data(pluginName).valid===false){
_this.valid=false;
return false;
}});
},
set: function(key, value){
this[key]=value;
return this;
},
destroy: function(){
runElemMethod.call(this.allInputs, pluginName, 'destroy');
thisForm.removeData(pluginName);
}});
if(thisForm.is('form')){
thisForm.off('.' + pluginName).on('reset.' + pluginName, function(){
setTimeout(thisForm.data(pluginName).validate, 100);
});
}
allInputs.each(function(index){
var thisInput=$(this),
validifyData=typeCast(convertCSVtoObject(thisInput.data(pluginName))),
inputPluginObj={
group:thisInput.closest('[data-validify-group]')
},
triggerEvents;
inputPluginObj.isInHolder=Boolean(thisInput.parent('.field-holder').length);
if(thisObjectExists(inputPluginObj.group)){
var nestedGroupInputs=inputPluginObj.group.find(options.selectors.groups).find(options.selectors.all),
groupValidifyData=typeCast(convertCSVtoObject(inputPluginObj.group.data(pluginName + '-group')));
if(thisIsJSON(groupValidifyData)){
if(typeof groupValidifyData==='string'){
$.extend(inputPluginObj, JSON.parse(groupValidifyData));
}else{
$.extend(inputPluginObj, groupValidifyData);
}}
inputPluginObj.groupInputs=inputPluginObj.group.find(options.selectors.all).not(nestedGroupInputs);
}
if(thisIsJSON(validifyData)){
if(typeof validifyData==='string'){
$.extend(true, inputPluginObj, JSON.parse(validifyData));
}else{
$.extend(true, inputPluginObj, validifyData);
}}
if(thisInput.data('validify-pattern')){
inputPluginObj.pattern=thisInput.data('validify-pattern');
}
if(typeof inputPluginObj.pattern==='undefined'){
if(thisInput.attr('type')==='email'){
inputPluginObj.pattern='email';
}else{
inputPluginObj.pattern='basic';
}}
if(typeof inputPluginObj.compareWith==='string'){
inputPluginObj.$compareWith=$(inputPluginObj.compareWith);
}
if(typeof inputPluginObj.response==='string'){
inputPluginObj.$response=$(inputPluginObj.response);
}
if(typeof inputPluginObj.groupResponse==='string'){
inputPluginObj.$groupResponse=$(inputPluginObj.groupResponse);
}
if(typeof inputPluginObj.floater==='string'){
inputPluginObj.$floater=$(inputPluginObj.floater);
if(inputPluginObj.$floater.length){
inputPluginObj.$floater.data('floater', {
$popup:inputPluginObj.$floater.closest('.popup')
});
if(inputPluginObj.$floater.data('floater').$popup.length){
inputPluginObj.$floater.appendTo($('#mainPopupHolder'));
}else{
inputPluginObj.$floater.appendTo('body');
}
$.extend(inputPluginObj.$floater.data('floater'), {
refresh:function(){
var topPos=thisInput.offset().top - inputPluginObj.$floater.outerHeight();
if(this.$popup.length) topPos +=$('#mainPopupHolder').scrollTop() - $(window).scrollTop();
inputPluginObj.$floater
.off(FE.events.transitionEnd)
.css({
width:thisInput.outerWidth() + 'px',
marginTop:'',
top:topPos + 'px',
left:thisInput.offset().left + 'px'
})
.addClass('is-shown');
return this;
},
reveal:function(){
var self=this;
self.refresh();
inputPluginObj.$floater.addClass('is-shown');
$(window)
.off('.' + inputPluginObj.eventID)
.on('resize.' + pluginName + '.' + inputPluginObj.eventID, homebrew.utils.throttle(function(){
self.refresh();
}, 100));
return self;
},
conceal:function(){
/*inputPluginObj.$floater
.on(FE.events.transitionEnd, function(){
inputPluginObj.$floater
.off(FE.events.transitionEnd)
.css({
top:'',
left:''
});
})
.removeClass('is-shown')
.css('margin-top', '');*/
inputPluginObj.$floater
.removeClass('is-shown')
.css({
marginTop:'',
top:'',
left:''
});
$(window).off('resize.' + inputPluginObj.eventID);
return this;
}});
}else{
debugMsg.call(thisForm, 'A floater ID `' + inputPluginObj.floater + '` has been provided, but selection returns nothing.', 'error');
inputPluginObj.$floater=undefined;
}}
if(thisInput.is(options.selectors.checkButtons)){
triggerEvents='change.' + pluginName;
}else if(thisInput.is(options.selectors.textFields)){
triggerEvents=['input.' + pluginName, 'blur.' + pluginName].join(' ');
}else if(thisInput.is(options.selectors.dropdowns)){
triggerEvents=['change.' + pluginName, 'blur.' + pluginName].join(' ');
}
thisInput.data(pluginName, $.extend(validifyData, {
eventID:new Date().getTime() + index,
parentForm: thisForm,
validate: function(){
var _this=this;
debugMsg.call(thisForm, thisInput);
$.extend(_this, validateInput(thisInput, thisForm));
reflectValidity(thisInput, thisForm);
debugMsg.call(thisForm, ' ');
thisInput.trigger('validate');
thisForm.data(pluginName).refresh();
return _this;
},
activate: function(){
var _this=this;
_this.deactivate();
thisInput.on(triggerEvents, function(){
clearTimeout(_this.timer);
_this.timer=setTimeout(function(){
if(thisInput.attr('type')==='radio'||thisInput.attr('type')==='checkbox'){
allInputs.filter('[name="' + thisInput.attr('name') + '"]').each(function(){
$(this).data('validify').validate();
});
}else{
_this.validate();
}}, options.validationTimerDuration);
});
if(thisObjectExists(_this.$response)){
thisInput.on('focus.' + pluginName, function(){
_this.$response.addClass(getClassFromString('focused'));
});
thisInput.on('blur.' + pluginName, function(){
_this.$response.removeClass(getClassFromString('focused'));
});
}
if(thisObjectExists(_this.$groupResponse)){
thisInput.on('focus.' + pluginName, function(){
_this.$groupResponse.addClass(getClassFromString('focused'));
});
thisInput.on('blur.' + pluginName, function(){
_this.$groupResponse.removeClass(getClassFromString('focused'));
});
}
if(thisObjectExists(_this.$compareWith)){
_this.$compareWith.on('validate.' + pluginName, function(){
_this.validate();
});
}
if(thisObjectExists(_this.$floater)){
thisInput
.on('focus.' + pluginName, function(){
_this.$floater.addClass(getClassFromString('focused'));
toggleFloater(_this);
})
.on('blur.' + pluginName, function(){
_this.$floater
.removeClass(getClassFromString('focused'))
.data('floater').conceal();
});
var mouseTarget=(_this.isInHolder) ? thisInput.parent('.field-holder'):thisInput;
mouseTarget
.on('mouseenter.' + pluginName, function(){
_this.$floater.addClass(getClassFromString('hovered'));
toggleFloater(_this);
})
.on('mouseleave.' + pluginName, function(){
_this.$floater.removeClass(getClassFromString('hovered'));
if(_this.$floater.hasClass(getClassFromString('focused'))) return;
_this.$floater.data('floater').conceal();
});
}
return _this;
},
deactivate: function(){
var _this=this;
thisInput.off('.' + pluginName);
if(thisObjectExists(_this.$compareWith)){
_this.$compareWith.off('validate.' + pluginName);
}
return _this;
},
forceValidate: function(){
this.set('valid', true).set('error', false);
clearTimeout(this.timer);
reflectValidity(thisInput, thisForm);
return this;
},
forceInvalidate: function(errorCode){
this.set('valid', false).set('error', errorCode);
clearTimeout(this.timer);
reflectValidity(thisInput, thisForm);
return this;
},
forceNeutral: function(){
this.set('valid', 'neutral').set('error', false);
clearTimeout(this.timer);
reflectValidity(thisInput, thisForm);
return this;
},
excludeFromValidation: function(){
return this.set('required', false);
},
includeInValidation: function(){
return this.set('required', true);
},
destroy: function(){
thisInput.removeData(pluginName);
},
set: function(key, value){
this[key]=value;
return this;
}}, inputPluginObj));
});
allInputs.each(function(){
var thisInput=$(this),
dataObj=thisInput.data(pluginName);
if(typeof dataObj.valid==='undefined'||dataObj.valid===null||dataObj.valid==='neutral'){
dataObj.validate();
}else{
dataObj.originalState={
val:thisInput.val(),
valid:dataObj.valid,
error:dataObj.error
};}
reflectValidity(thisInput, thisForm);
dataObj.activate();
});
});
},
activate: function(){
runElemMethod.call(this, pluginName, 'activate');
},
deactivate: function(){
runElemMethod.call(this, pluginName, 'deactivate');
},
forceValidate: function(){
runElemMethod.call(this, pluginName, 'forceValidate');
},
forceInvalidate: function(){
runElemMethod.call(this, pluginName, 'forceInvalidate');
},
forceNeutral: function(){
runElemMethod.call(this, pluginName, 'forceNeutral');
},
excludeFromValidation: function(){
runElemMethod.call(this, pluginName, 'excludeFromValidation');
},
includeInValidation: function(){
runElemMethod.call(this, pluginName, 'includeInValidation');
},
destroy: function(){
runElemMethod.call(this, pluginName, 'destroy');
},
set: function(){
runElemMethod.call(this, pluginName, 'set', arguments);
}},
_arguments=arguments;
for(var i=_arguments.length-1; i > -1; i--){
if(typeof _arguments[i]==='object') $.extend(options, _arguments[i]);
}
if(typeof _arguments[0]==='string'&&typeof methods[_arguments[0]]==='function'){
methods[_arguments[0]].call(this);
}else{
methods.create.call(this);
}
function validateInput(targetInput, targetForm){
var dataObj=targetInput.data(pluginName),
formDataObj=targetForm.data(pluginName),
inputValue=targetInput.val();
if(targetInput.is(options.selectors.checkButtons)){
debugMsg.call(targetForm, 'Input is a :checked element (radio button / checkbox.)');
if(thisObjectExists(dataObj.group)){
debugMsg.call(targetForm, ':checked element is in a group.');
var inputName=targetInput.attr('name'),
inputGroup=dataObj.groupInputs.filter('[name="' + inputName + '"]'),
minChecked=dataObj.minChecked,
maxChecked=dataObj.maxChecked;
var maxChecked=getDataAttr(dataObj.group, 'validify-max-checked');
if(typeof maxChecked==='number'){
targetInput.on('change.' + pluginName, function(){
var isMaxed=(inputGroup.filter(':checked').length >=maxChecked);
inputGroup.not(':checked').prop('disabled', isMaxed);
});
}
if(typeof minChecked==='number'){
debugMsg.call(targetForm, [
indentStr(0) + 'The group requires at least ' + minChecked + ':checked elements.',
indentStr(1) + 'Number of :checked elements in the group: ' + inputGroup.filter(':checked').length
]);
if(inputGroup.filter(':checked').length < minChecked){
debugMsg.call(targetForm, indentStr(2) + 'Group does not meet the minimum number of :checked elements.');
if(formDataObj.strict){
debugMsg.call(targetForm, indentStr(3) + 'Strict mode on. Input fails validation.', 'error');
return { valid: false, error: 'min-checked' };}else{
debugMsg.call(targetForm, indentStr(3) + 'Strict mode off. Input is in neutral validation.', 'neutral');
return { valid: 'neutral', error: false };}}else{
debugMsg.call(targetForm, indentStr(2) + 'Group meets the minimm number of :checked elements.');
}}
}
if(!targetInput.is(':checked')){
debugMsg.call(targetForm, [
":checked element isn't checked.",
indentStr(0) + 'Validation type: required.'
]);
if(typeof dataObj.required==='boolean'&&dataObj.required===true){
debugMsg.call(targetForm, indentStr(1) + ":checked element is required.");
debugMsg.call(targetForm, indentStr(2) + 'Check to see if any other buttons in its group has been checked.');
if(targetForm.data('validify').allInputs.filter('[name="' + targetInput.attr('name') + '"]').is(':checked')){
debugMsg.call(targetForm, indentStr(3) + 'There is a checked input in the group. Validation passes.', 'success');
return { valid: true, error: false };}else{
debugMsg.call(targetForm, indentStr(3) + 'There are no checked inputs in the group.');
if(formDataObj.strict){
debugMsg.call(targetForm, indentStr(4) + 'Strict mode on; Validation fails.', 'error');
return { valid: false, error: 'required' };}else{
debugMsg.call(targetForm, indentStr(4) + 'Strict mode off; node is in neutral validation.', 'neutral');
return { valid: 'neutral', error: false };}}
}else{
debugMsg.call(targetForm, indentStr(1) + ":checked element isn't required.");
debugMsg.call(targetForm, indentStr(2) + "Neutral validation.", 'neutral');
return { valid: 'neutral', error: false };}}
debugMsg.call(targetForm, ":checked element is checked.");
}else{
if(typeof dataObj.originalState!=='undefined'){
debugMsg.call(targetForm, "Input has an original state cached, checking to see if its value matches its original state.");
if(inputValue===dataObj.originalState.val){
debugMsg.call(targetForm, indentStr(1) + "Value matches its original state. Returning to how it was.");
return { valid: dataObj.originalState.valid, error: dataObj.originalState.error };}}
if(inputValue===''){
debugMsg.call(targetForm, [
"Input is empty.",
indentStr(0) + 'Validation type: required.'
]);
if(typeof dataObj.required==='boolean'&&dataObj.required===true){
if(formDataObj.strict){
debugMsg.call(targetForm, indentStr(1) + 'Input is required. Strict mode on; input has failed validation', 'error');
return { valid: false, error: 'required' };}else{
debugMsg.call(targetForm, indentStr(1) + 'Input is required. Strict mode off; input is in neutral validation', 'neutral');
return { valid: 'neutral', error: false };}}else{
debugMsg.call(targetForm, indentStr(1) + "Input isn't required. Neutral validation.", 'neutral');
return { valid: 'neutral', error: false };}}else if(thisObjectExists(dataObj.$compareWith)){
debugMsg.call(targetForm, "Input needs to be compared to: " + dataObj.compareWith);
var targetComparison=dataObj.$compareWith;
if(targetComparison.length < 1){
throw new Error('$.validify(): A target for comparison has been provided, but selection has returned with nothing. Please check your spelling, or make sure both this input and the target comparison input exist on the same page at the same time.');
}
if(targetComparison.data(pluginName).valid!==true){
debugMsg.call(targetForm, indentStr(0) + "The input to compare with hasn't passed validation yet. Neutral validation.", 'neutral');
return { valid: 'neutral', error: false };}else if(targetInput.val()!==targetComparison.val()){
debugMsg.call(targetForm, indentStr(0) + "Comparison failed. Input has failed validation.", 'error');
return { valid: false, error: 'compare-with' };}
}else{
debugMsg.call(targetForm, "Input isn't empty.");
if(typeof dataObj.pattern==='string'){
debugMsg.call(targetForm, [
indentStr(0) + 'Validation type: pattern.',
indentStr(1) + 'Pattern provided: ' + dataObj.pattern
]);
var regExp;
regExp=getRegexFromString(dataObj.pattern);
if(typeof regExp==='string'){
var patternArray=dataObj.pattern.split('/');
if(patternArray.length > 2){
regExp=new RegExp(patternArray[1], patternArray[2]);
}else{
regExp=new RegExp(dataObj.pattern);
}}
if(typeof regExp==='object'){
if(regExp.test(inputValue)){
debugMsg.call(targetForm, indentStr(1) + "Input value matches the requierd pattern.", 'success');
}else{
debugMsg.call(targetForm, indentStr(1) + "Input value doesn't match the required pattern. Input has failed validation.", 'error');
return { valid: false, error: 'pattern' };}}else{
debugMsg.call(targetForm, indentStr(1) + "A pattern has been provided, but it doesn't seem to result in a valid RegExp object. Please check again.", 'error');
}}
if(typeof dataObj.minlength==='number'){
debugMsg.call(targetForm, indentStr(0) + 'Validation type: minlength.');
var minlengthNum=parseInt(dataObj.minlength, 10);
if(inputValue.length < minlengthNum){
if(formDataObj.strict){
debugMsg.call(targetForm, indentStr(1) + 'Input value hasn\'t reached the minimum length. Strict mode on; input has failed validation.', 'error');
return { valid: false, error: 'minlength' };}else{
debugMsg.call(targetForm, indentStr(1) + 'Input value hasn\'t reached the minimum length. Strict mode off; input is in neutral validation.', 'neutral');
return { valid: 'neutral', error: false };}}else{
debugMsg.call(targetForm, indentStr(1) + "Input value has reached the minimum length.");
}}
}}
debugMsg.call(targetForm, 'Input has passed validation.', 'success');
return { valid: true, error: false };}
function reflectValidity(targetInput, targetForm){
var dataObj=targetInput.data(pluginName),
isInGroup=thisObjectExists(dataObj.group),
$response=$(dataObj.$response),
$floater=$(dataObj.$floater),
$groupResponse=$(dataObj.$groupResponse);
targetInput.add($response).add($floater).add($groupResponse).removeClass(allClasses);
if(isInGroup){
var groupStatus=true;
debugMsg.call(targetForm, 'Input is in a group. Checking through all inputs in the group.');
dataObj.groupInputs.each(function(){
var thisInput=$(this),
thisDataObj=thisInput.data(pluginName),
$validifyResponses=thisInput.add($(thisDataObj.$response)).add($(thisDataObj.$floater)),
thisInputStatus=thisDataObj.valid,
thisIsCheckInput=(targetInput.is(options.selectors.checkButtons));
if(thisInputStatus===true){
if(thisIsCheckInput&&!thisInput.is(':checked')){
$validifyResponses.removeClass(getClassFromString('success'));
return;
}
$validifyResponses.addClass(getClassFromString('success'));
}else if(thisInputStatus===false){
$validifyResponses.addClass(getClassFromString('failed'));
if(typeof thisDataObj.error==='string'){
$validifyResponses.add($groupResponse).addClass(getClassFromString(thisDataObj.error));
}
groupStatus=false;
}else if(typeof thisInputStatus==='undefined'||thisInputStatus==='neutral'){
if(groupStatus!==false) groupStatus='neutral';
}
toggleFloater.call(thisInput, thisDataObj);
});
if(groupStatus===true){
debugMsg.call(targetForm, indentStr(0) + 'Input group has passed validation. Applying success classes onto the group response element.', 'success');
$groupResponse.addClass(getClassFromString('success'));
}else if(groupStatus===false){
debugMsg.call(targetForm, indentStr(0) + 'Input group has failed validation. Applying failed classes onto the group response element.', 'error');
$groupResponse.addClass(getClassFromString('failed'));
}else if(groupStatus==='neutral'){
debugMsg.call(targetForm, indentStr(0) + 'Input group has neutral validation. Group response element will not be modified.', 'neutral');
}}else{
var $validifyResponses=targetInput.add($response).add($floater);
if(dataObj.valid===false){
$validifyResponses.addClass(getClassFromString('failed'));
if(typeof dataObj.error==='string'){
$validifyResponses.addClass(getClassFromString(dataObj.error));
}}else if(dataObj.valid===true){
if(dataObj.noSuccess){
debugMsg.call(targetForm, 'Input has `noSuccess` set to true. Leaving response in its neutral state.', 'neutral');
}else{
$validifyResponses.addClass(getClassFromString('success'));
}}
toggleFloater.call(targetInput, dataObj);
}}
function getRegexFromString(string){
for(var i=options.regexes.length-1; i > -1; i--){
if(string===options.regexes[i].key) return options.regexes[i].pattern;
}
return '';
}
function getClassFromString(string){
var returnClass;
for(var i=options.classes.length-1; i > -1; i--){
if(string===options.classes[i].key) return options.classes[i].className;
}
return '';
}
function getDataAttr(target, key){
if(typeof target==='undefined'||target===null) return;
return target.data(key, null).data(key);
}
function toggleFloater(dataObj){
var $theFloater=dataObj.$floater;
if(typeof $theFloater==='undefined') return;
if($theFloater.hasClass(getClassFromString('failed'))){
if($theFloater.hasClass(getClassFromString('focused'))||$theFloater.hasClass(getClassFromString('hovered'))){
$theFloater.data('floater').reveal();
}}else{
$theFloater.data('floater').conceal();
}}
function indentStr(levels){
var indentationStrArr=[];
if(typeof levels==='number'&&levels > 0){
for(var i=0, ii=levels; i < ii; i++){
indentationStrArr.push('   ');
}}
indentationStrArr.push('`- ');
return indentationStrArr.join('');
}
function thisIsJSON(value){
if(typeof value==='string'){
return (value.substr(0,1)==='{'&&value.substr(value.length-1, value.length)==='}');
}else{
return (typeof value==='object'&&value!==null&&value!==undefined);
}}
function debugMsg(message, styles){
if(!this.data(pluginName).debug) return;
switch(styles){
case 'error':
styles='color: #ff8201;';
break;
case 'neutral':
styles='color: #999;';
break;
case 'success':
styles='color: #5cb21d;';
break;
case 'start':
styles='background-color: #6b3269; color: #fff;';
break;
case 'end':
styles='background-color: #444; color: #fff;';
break;
default:
styles='';
break;
}
if(message instanceof Array){
while(message.length){
if(typeof message[0]==='string'){
console.log('%c' + message[0], styles);
}else{
console.log(message[0]);
}
message.shift();
}}else{
if(typeof message[0]==='string'){
console.log('%c' + message, styles);
}else{
console.log(message);
}}
}
function typeCast(keyValueObj){
$.each(keyValueObj, function(key, value){
switch(key){
case 'valid':
case 'required':
keyValueObj[key]=(value==='true') ? true:false;
break;
case 'minlength':
case 'maxlength':
case 'minchecked':
case 'maxchecked':
keyValueObj[key]=parseInt(value, 10);
break;
}});
return keyValueObj;
}
return this;
/* function destroyValidify(){
forms.each(function(){
var form=$(this),
allInputs=thisForm.find(options.selectors.all);
allInputs.each(function(){
var currentInput=$(this);
currentInput
.off('.validify')
.removeData('validify-status')
.removeClass(allClasses)
.prop('disabled', false);
$('#' + currentInput.data('validify-response-id')).removeClass(allClasses);
});
thisForm.find('fieldset').each(function(){
$('#' + $(this).data('validify-response-id')).removeClass(allClasses);
});
thisForm.off('.validify');
});
} */
}});
function runElemMethod(pluginName, methodName, _args){
this.each(function(){
var $this=$(this),
pluginData=$this.data(pluginName);
if(typeof pluginData==='object'
&& typeof pluginData[methodName]==='function'){
pluginData[methodName].apply(pluginData, _args);
}});
}
function thisObjectExists(target){
return (typeof target==='object'&&target!==null&&target.length);
}
function thisDataIsValidObject($elem, dataName){
var elemData=$elem.data(dataName);
return (typeof elemData==='object'&&elemData!==null&&elemData!==undefined);
}
function convertCSVtoObject(csv){
if(csv==='') return {};
var splitArray=csv.split(','),
keyValuesArray=[],
keyValuesObj={};
while(splitArray.length){
keyValuesArray.push($.trim(splitArray[0]).split(':'));
splitArray.shift();
}
while(keyValuesArray.length){
keyValuesObj[$.trim(keyValuesArray[0][0])]=$.trim(keyValuesArray[0][1]);
keyValuesArray.shift();
}
return keyValuesObj;
}})(jQuery);
function FastClick(a){"use strict";var b,c=this;if(this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=10,this.layer=a,!a||!a.nodeType)throw new TypeError("Layer must be a document node");this.onClick=function(){return FastClick.prototype.onClick.apply(c,arguments)},this.onMouse=function(){return FastClick.prototype.onMouse.apply(c,arguments)},this.onTouchStart=function(){return FastClick.prototype.onTouchStart.apply(c,arguments)},this.onTouchMove=function(){return FastClick.prototype.onTouchMove.apply(c,arguments)},this.onTouchEnd=function(){return FastClick.prototype.onTouchEnd.apply(c,arguments)},this.onTouchCancel=function(){return FastClick.prototype.onTouchCancel.apply(c,arguments)},FastClick.notNeeded(a)||(this.deviceIsAndroid&&(a.addEventListener("mouseover",this.onMouse,!0),a.addEventListener("mousedown",this.onMouse,!0),a.addEventListener("mouseup",this.onMouse,!0)),a.addEventListener("click",this.onClick,!0),a.addEventListener("touchstart",this.onTouchStart,!1),a.addEventListener("touchmove",this.onTouchMove,!1),a.addEventListener("touchend",this.onTouchEnd,!1),a.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(a.removeEventListener=function(b,c,d){var e=Node.prototype.removeEventListener;"click"===b?e.call(a,b,c.hijacked||c,d):e.call(a,b,c,d)},a.addEventListener=function(b,c,d){var e=Node.prototype.addEventListener;"click"===b?e.call(a,b,c.hijacked||(c.hijacked=function(a){a.propagationStopped||c(a)}),d):e.call(a,b,c,d)}),"function"==typeof a.onclick&&(b=a.onclick,a.addEventListener("click",function(a){b(a)},!1),a.onclick=null))}FastClick.prototype.deviceIsAndroid=navigator.userAgent.indexOf("Android")>0,FastClick.prototype.deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent),FastClick.prototype.deviceIsIOS4=FastClick.prototype.deviceIsIOS&&/OS 4_\d(_\d)?/.test(navigator.userAgent),FastClick.prototype.deviceIsIOSWithBadTarget=FastClick.prototype.deviceIsIOS&&/OS ([6-9]|\d{2})_\d/.test(navigator.userAgent),FastClick.prototype.needsClick=function(a){"use strict";switch(a.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(a.disabled)return!0;break;case"input":if(this.deviceIsIOS&&"file"===a.type||a.disabled)return!0;break;case"label":case"video":return!0}return/\bneedsclick\b/.test(a.className)},FastClick.prototype.needsFocus=function(a){"use strict";switch(a.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!this.deviceIsAndroid;case"input":switch(a.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!a.disabled&&!a.readOnly;default:return/\bneedsfocus\b/.test(a.className)}},FastClick.prototype.sendClick=function(a,b){"use strict";var c,d;document.activeElement&&document.activeElement!==a&&document.activeElement.blur(),d=b.changedTouches[0],c=document.createEvent("MouseEvents"),c.initMouseEvent(this.determineEventType(a),!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null),c.forwardedTouchEvent=!0,a.dispatchEvent(c)},FastClick.prototype.determineEventType=function(a){"use strict";return this.deviceIsAndroid&&"select"===a.tagName.toLowerCase()?"mousedown":"click"},FastClick.prototype.focus=function(a){"use strict";var b;this.deviceIsIOS&&a.setSelectionRange&&0!==a.type.indexOf("date")&&"time"!==a.type?(b=a.value.length,a.setSelectionRange(b,b)):a.focus()},FastClick.prototype.updateScrollParent=function(a){"use strict";var b,c;if(b=a.fastClickScrollParent,!b||!b.contains(a)){c=a;do{if(c.scrollHeight>c.offsetHeight){b=c,a.fastClickScrollParent=c;break}c=c.parentElement}while(c)}b&&(b.fastClickLastScrollTop=b.scrollTop)},FastClick.prototype.getTargetElementFromEventTarget=function(a){"use strict";return a.nodeType===Node.TEXT_NODE?a.parentNode:a},FastClick.prototype.onTouchStart=function(a){"use strict";var b,c,d;if(a.targetTouches.length>1)return!0;if(b=this.getTargetElementFromEventTarget(a.target),c=a.targetTouches[0],this.deviceIsIOS){if(d=window.getSelection(),d.rangeCount&&!d.isCollapsed)return!0;if(!this.deviceIsIOS4){if(c.identifier===this.lastTouchIdentifier)return a.preventDefault(),!1;this.lastTouchIdentifier=c.identifier,this.updateScrollParent(b)}}return this.trackingClick=!0,this.trackingClickStart=a.timeStamp,this.targetElement=b,this.touchStartX=c.pageX,this.touchStartY=c.pageY,a.timeStamp-this.lastClickTime<200&&a.preventDefault(),!0},FastClick.prototype.touchHasMoved=function(a){"use strict";var b=a.changedTouches[0],c=this.touchBoundary;return Math.abs(b.pageX-this.touchStartX)>c||Math.abs(b.pageY-this.touchStartY)>c?!0:!1},FastClick.prototype.onTouchMove=function(a){"use strict";return this.trackingClick?((this.targetElement!==this.getTargetElementFromEventTarget(a.target)||this.touchHasMoved(a))&&(this.trackingClick=!1,this.targetElement=null),!0):!0},FastClick.prototype.findControl=function(a){"use strict";return void 0!==a.control?a.control:a.htmlFor?document.getElementById(a.htmlFor):a.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},FastClick.prototype.onTouchEnd=function(a){"use strict";var b,c,d,e,f,g=this.targetElement;if(!this.trackingClick)return!0;if(a.timeStamp-this.lastClickTime<200)return this.cancelNextClick=!0,!0;if(this.cancelNextClick=!1,this.lastClickTime=a.timeStamp,c=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,this.deviceIsIOSWithBadTarget&&(f=a.changedTouches[0],g=document.elementFromPoint(f.pageX-window.pageXOffset,f.pageY-window.pageYOffset)||g,g.fastClickScrollParent=this.targetElement.fastClickScrollParent),d=g.tagName.toLowerCase(),"label"===d){if(b=this.findControl(g)){if(this.focus(g),this.deviceIsAndroid)return!1;g=b}}else if(this.needsFocus(g))return a.timeStamp-c>100||this.deviceIsIOS&&window.top!==window&&"input"===d?(this.targetElement=null,!1):(this.focus(g),this.deviceIsIOS4&&"select"===d||(this.targetElement=null,a.preventDefault()),!1);return this.deviceIsIOS&&!this.deviceIsIOS4&&(e=g.fastClickScrollParent,e&&e.fastClickLastScrollTop!==e.scrollTop)?!0:(this.needsClick(g)||(a.preventDefault(),this.sendClick(g,a)),!1)},FastClick.prototype.onTouchCancel=function(){"use strict";this.trackingClick=!1,this.targetElement=null},FastClick.prototype.onMouse=function(a){"use strict";return this.targetElement?a.forwardedTouchEvent?!0:a.cancelable?!this.needsClick(this.targetElement)||this.cancelNextClick?(a.stopImmediatePropagation?a.stopImmediatePropagation():a.propagationStopped=!0,a.stopPropagation(),a.preventDefault(),!1):!0:!0:!0},FastClick.prototype.onClick=function(a){"use strict";var b;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===a.target.type&&0===a.detail?!0:(b=this.onMouse(a),b||(this.targetElement=null),b)},FastClick.prototype.destroy=function(){"use strict";var a=this.layer;this.deviceIsAndroid&&(a.removeEventListener("mouseover",this.onMouse,!0),a.removeEventListener("mousedown",this.onMouse,!0),a.removeEventListener("mouseup",this.onMouse,!0)),a.removeEventListener("click",this.onClick,!0),a.removeEventListener("touchstart",this.onTouchStart,!1),a.removeEventListener("touchmove",this.onTouchMove,!1),a.removeEventListener("touchend",this.onTouchEnd,!1),a.removeEventListener("touchcancel",this.onTouchCancel,!1)},FastClick.notNeeded=function(a){"use strict";var b,c;if("undefined"==typeof window.ontouchstart)return!0;if(c=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!FastClick.prototype.deviceIsAndroid)return!0;if(b=document.querySelector("meta[name=viewport]")){if(-1!==b.content.indexOf("user-scalable=no"))return!0;if(c>31&&window.innerWidth<=window.screen.width)return!0}}return"none"===a.style.msTouchAction?!0:!1},FastClick.attach=function(a){"use strict";return new FastClick(a)},"undefined"!=typeof define&&define.amd?define(function(){"use strict";return FastClick}):"undefined"!=typeof module&&module.exports?(module.exports=FastClick.attach,module.exports.FastClick=FastClick):window.FastClick=FastClick;
var FE={};
jQuery(function(){
homebrew.Carousel.prototype.options.transitions.enable=Modernizr.csstransitions;
homebrew.Tooltip.prototype.options.appendTo='#mainContent';
homebrew.Tooltip.prototype.options.transitions.enable=Modernizr.csstransitions;
jQuery.extend(FE, {
$els:{
backToTop:jQuery('#globalBackToTop'),
body:jQuery('body'),
mainSite:jQuery('#mainSite'),
pageOverlay:jQuery('#pageOverlay'),
root:jQuery('html')
},
events: {
transitionEnd:homebrew.events.transitionEnd||'transitionend oTransitionEnd otransitionend webkitTransitionEnd msTransitionEnd',
animationEnd: homebrew.events.animationEnd||'animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd'
},
browser:homebrew.browser,
baseURL:(typeof fileUrl==='string')
? fileUrl
: (window.location.href.indexOf('') > -1)
? ''
: ''
});
if(!FE.$els.pageOverlay.length){
FE.$els.pageOverlay=jQuery('<div class="page-overlay" id="pageOverlay" />').appendTo(FE.$els.mainSite);
}
if(!FE.$els.backToTop.length){
FE.$els.backToTop=jQuery('<a href="#top" title="Back To Top" class="main-back-to-top" id="mainBackToTop" />').appendTo('#mainContent');
FE.$els.backToTop.on('click', function(e){
e.preventDefault();
jQuery('html, body').animate({
scrollTop:0
}, 400);
});
jQuery(window).on('scroll.toggleBackToTop', homebrew.utils.throttle(function(){
FE.$els.backToTop.toggleClass('is-shown', jQuery(window).scrollTop() > jQuery(window).height()*0.5);
}, 50));
}
if(typeof FE.browser==='undefined'){
FE.browser={
ie:FE.$els.root.hasClass('ie'),
ie9:FE.$els.root.hasClass('ie9'),
lt9:FE.$els.root.hasClass('lt9'),
ie8:FE.$els.root.hasClass('ie8'),
lt8:FE.$els.root.hasClass('lt8'),
ie7:FE.$els.root.hasClass('ie7'),
firefox:(window.mozIndexedDB!==undefined)
}}
jQuery.extend(true, FE, {
alert:function(args){
this.showAlertPopup(args, 'alert');
},
confirm:function(args){
this.showAlertPopup(args, 'confirm');
},
showAlertPopup:function(args, method){
args=args||{};
var $popup=jQuery('#FE__alertPopup');
if(!$popup.length){
$popup=jQuery([
'<div class="ssf-popup text-center" id="FE__alertPopup">',
'<h2 class="title space-bottom-2x" />',
'<div class="popup-message" />',
'<div class="space-top-2x">',
'<a href="#/" class="button padded xlarge okay-button">Okay</a>',
'<a href="#/" class="button padded xlarge space-left cancel-button" style="display: none;">Cancel</a>',
'</div>',
'</div>'
].join('')).appendTo('body');
$popup.popupify({
addCloseBtns:false,
closeOnOverlay:false
});
}
if(jQuery('body').hasClass('popup-is-shown')
&& $popup.hasClass('is-shown')){
return;
}
var $title=$popup.find('.title'),
$message=$popup.find('.popup-message'),
$prevPopup=jQuery('.popup-is-shown').find('.ssf-popup.is-shown');
if(args.title) $title.html(args.title);
if(args.message) $message.html(args.message);
$popup.find('.cancel-button').toggle(method==='confirm');
$popup.find('.okay-button, .cancel-button')
.off('.alert')
.on('click.alert', function(){
if($prevPopup.length
&& typeof $prevPopup.eq(0).data('popupify')!=='undefined'){
$prevPopup.data('popupify').reveal();
}else{
$popup.data('popupify').conceal();
}
if(typeof args.onConfirm==='function'){
if(method==='confirm'){
args.onConfirm(jQuery(this).is('.okay-button'));
}else{
args.onConfirm();
}}
});
$popup.data('popupify').reveal();
},
FootnoteAnchor:function(){
this.init.apply(this, arguments);
},
Hasher:function(options){
this.options=options;
},
HeightSlider:function(heightSlider){
if(typeof heightSlider==='string') heightSlider=jQuery(heightSlider);
var self=this;
jQuery.extend(self, {
reveal:function(){
if(Modernizr.csstransitions){
if(heightSlider.height()!==0) return;
var targetHeight=0;
heightSlider.css('height', 'auto');
targetHeight=heightSlider.height();
heightSlider.css('height', '');
setTimeout(function(){
heightSlider
.off(FE.events.transitionEnd)
.on(FE.events.transitionEnd, function(){
heightSlider
.off(FE.events.transitionEnd)
.removeClass('is-transitionable')
.css('height', '')
.addClass('is-toggled');
})
.addClass('is-transitionable')
.css('height', targetHeight + 'px');
}, 1);
}else{
if(heightSlider.css('display')!=='none') return;
heightSlider.slideDown(400, function(){
jQuery(this).addClass('is-toggled');
});
}},
conceal:function(){
if(Modernizr.csstransitions){
if(heightSlider.height()===0) return;
heightSlider
.css('height', heightSlider.height() + 'px')
.removeClass('is-toggled');
setTimeout(function(){
heightSlider
.off(FE.events.transitionEnd)
.on(FE.events.transitionEnd, function(){
heightSlider.off(FE.events.transitionEnd);
heightSlider.removeClass('is-transitionable');
heightSlider.css('height', '');
})
.addClass('is-transitionable')
.css('height', '0px');
}, 1);
}else{
if(heightSlider.css('display')==='none') return;
heightSlider
.removeClass('is-toggled')
.slideUp(400);
}},
toggle:function(){
if(Modernizr.csstransitions){
heightSlider.trigger((heightSlider.height()===0) ? 'reveal':'conceal');
}else{
heightSlider.trigger((heightSlider.css('display')==='none') ? 'reveal':'conceal');
}}
});
heightSlider.data('height-slider', self);
},
StickyColumn:function(){
this.load.apply(this, arguments);
},
getHash:function(){
var hash=window.location.hash;
if(hash===''||hash.substr(1,1)==='.'){
return '';
}else{
return hash;
}},
getQueryStr: function(str){
var search=window.location.search;
if(!search) return false;
if(search.substr(0,1)==='?'){
search=search.substr(1);
}
var splitSearch=search.split('&');
keyValuePairs={};
splitSearch.map(function(searchStr){
var splitSearchStr=searchStr.split('=');
splitSearchStr=splitSearchStr.map(function(str){
return jQuery.trim(str);
});
keyValuePairs[splitSearchStr[0]]=splitSearchStr[1];
});
if(typeof str==='string'){
return (typeof keyValuePairs[str]==='undefined') ? false:keyValuePairs[str];
}else{
return keyValuePairs;
}},
initContentTabbers:function(){
jQuery('.js-togglerify-tabs').each(function(){
var $this=jQuery(this),
$nestedTabs=$this.find('.js-togglerify-tabs').find('.tab'),
$tabs=$this.find('.tab').not($nestedTabs),
$nestedContents=$this.find('.js-togglerify-tabs').find('.tab-content'),
$contents=$this.find('.tab-content').not($nestedContents);
$tabs
.togglerify('destroy')
.togglerify({
toggledClass: 'current',
selfToggleable: false,
singleActive: true,
content: function(index){
return $contents.eq(index);
}})
.on('afterToggleOn', function(){
jQuery(window).trigger('resize');
})
.on('toggleOff', function(e, $thisTab, $thisContent){
$thisContent.find('.video-holder').find('iframe').each(function(){
this.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
});
});
});
},
initContentShowers:function(){
var types={
TAB: 'tab',
TOGGLER: 'toggler',
NOTES: 'notes'
},
$notesToggler=jQuery('#notesToggler'),
$notesContent=jQuery('#notesContent');
jQuery('.js-show-content').each(function(){
var $this=jQuery(this),
thisHref=$this.attr('href');
if(typeof thisHref!=='string'){
console.log($this);
console.error("No target specified. Set the target's ID as the `href` attribute on the element.");
return
}
var $target=jQuery($this.attr('href'));
if(!$target.length){
console.log($this);
console.error("Target `" + $this.attr('href') + "` does not exist.");
return;
}
var data=$this.data('show-content-options');
if(!data){
console.log($this);
console.error('Options undeclared. Declare the options using the `data-show-content-options` attribute on the element.');
return;
}
var options=(typeof data==='string')
? homebrew.getKeyValuePairsFromString(data)
: {};
if(!options.type){
console.log($this);
console.error('Options declared, but no type specified.');
return;
}
var scrollArgs=[$target];
if(options.smoothScroll!==true){
scrollArgs.push('snap');
}
switch(options.type){
case types.TAB:
$this.on('click', function(e){
e.preventDefault();
var $tabContent=$target.closest('.tab-content'),
$heightSyncers=$tabContent.find('.js-sync-height-wrapper');
if($tabContent.hasClass('current')){
FE.scrollTo.apply(null, scrollArgs);
}else{
if($heightSyncers.length){
$heightSyncers.last().one('afterSync', function(){
FE.scrollTo.apply(null, scrollArgs);
});
$tabContent.data('togglerify').toggleOn();
}else{
$tabContent.data('togglerify').toggleOn();
FE.scrollTo.apply(null, scrollArgs);
}}
});
break;
case types.NOTES:
if(!$notesToggler.length||!$notesContent.length){
return;
}
$this.on('click', function(e){
e.preventDefault();
if(!$notesToggler.hasClass('is-toggled')){
$notesToggler.togglerify('toggleOn', { noSlide:true });
}
FE.scrollTo($target);
});
break;
default:
console.log($this);
var errorMsg=[
'The type `', options.type, '` is not supported. Our currently supported types are: '
];
jQuery.each(types, function(key, value){
errorMsg.push('\n' + value);
});
errorMsg.push('\n\nCheck the type again.');
console.error(errorMsg.join(''));
break;
}});
},
initDropdownSwitchers:function($scope){
var $holders=($scope&&$scope.length)
? $scope.find('.dropdown-switcher-holder')
: jQuery('.dropdown-switcher-holder');
if(!$holders.length) return;
$holders.each(function(){
var $dropdown=jQuery(this).find('.dropdown-switcher'),
$contents=jQuery(this).find('.dropdown-content');
$dropdown
.on('change', function(){
$contents
.hide()
.eq(this.selectedIndex)
.show();
})
.trigger('change');
});
},
initNumberTabbers:function(){
jQuery('.number-tabber').each(function(){
var $tabs=jQuery(this).find('.number-tabber__tabs').children('li'),
$contents=jQuery(this).find('.number-tabber__contents').children('li');
$tabs
.togglerify('destroy')
.togglerify({
toggledClass: 'current',
singleActive: true,
selfToggleable: false,
content: function(index){
return $contents.eq(index);
}});
});
},
initPage:function(){
jQuery('.js-dropdownify').dropdownify();
jQuery('.js-inputify').inputify();
jQuery.each(FE, function(key, value){
if(key.indexOf('init')===0&&key!=='initPage') value();
});
FE.loadXMLForm(jQuery('.js-xml-form-holder'));
FE.loadXMLTable(jQuery('.js-xml-tbl-holder'));
FE.loadXMLLocations(jQuery('.js-xml-locations-holder'));
if(FE.browser.ie) jQuery('[placeholder]').placeholderify();
},
initSectionSnap:function(){
if(!Modernizr.touch) return;
var hash=FE.getHash();
if(!hash||hash.indexOf('#/') > -1) return;
var $hash=jQuery(hash);
if(!$hash.length||!$hash.is('.section')) return;
setTimeout(function(){
FE.scrollTo($hash);
}, 25);
},
initSelfTogglers:function(){
jQuery('.self-toggler__toggler').togglerify({
singleActive: false,
slide: true,
content: function(){
return jQuery(this).next();
}});
},
initSectionContentToggler:function(){
var $sectionContentTogglers=jQuery('.section-content-toggler');
if(!$sectionContentTogglers.length) return;
var $sectionToggleableContents=jQuery('.section-toggleable-content'),
$sectionDropdown=jQuery('<select>'),
optionsStrArray=[];
$sectionContentTogglers
.togglerify({
selfToggleable: false,
singleActive:true,
content:function(index){
return $sectionToggleableContents.eq(index);
}})
.each(function(index){
var $dropdownOption=jQuery(['<option>', jQuery.trim(jQuery(this).find('.toggler__title').text()), '</option>'].join(''));
$dropdownOption.data('section-content-toggler', jQuery(this));
$dropdownOption.appendTo($sectionDropdown);
});
jQuery('<div class="column show-for-small-down" />')
.prepend($sectionDropdown)
.prependTo($sectionContentTogglers.eq(0).closest('.row'));
$sectionDropdown
.dropdownify({
markups:{
holder:'<div class="expand space-bottom" />'
}})
.on('change', function(){
var $thisToggler=jQuery(this).find('option:checked').data('section-content-toggler');
$thisToggler.togglerify('toggleOn');
});
FE.watchSize('small', function(isSmallScreen){
var method=(isSmallScreen) ? 'deactivate':'activate';
$sectionContentTogglers.togglerify(method);
});
},
initSmallNav:function(){
if(Modernizr.touch||jQuery('#mainSmallNav').data('initSmallNav')===true) return;
jQuery('#mainSmallNav').data('initSmallNav', true);
var prevScrollTop=jQuery(window).scrollTop(),
navHeight=jQuery('#mainSmallNav').height() + jQuery('#mainNav').height();
jQuery(window)
.on('resize.navHider', function(){
navHeight=jQuery('#mainSmallNav').height() + jQuery('#mainNav').height();
})
.trigger('resize.navHider')
.on('scroll.navHider', function(){
var currentScrollTop=jQuery(window).scrollTop(),
partialHiddenBool=currentScrollTop > 47,
hiddenBool=currentScrollTop >=prevScrollTop&&currentScrollTop > navHeight&&!FE.$els.body.hasClass('mobile-nav-is-shown');
jQuery('body').toggleClass('main-header-is-partially-hidden', partialHiddenBool);
jQuery('body').toggleClass('main-header-is-hidden', hiddenBool);
prevScrollTop=currentScrollTop;
})
.trigger('scroll.navHider');
},
initSyncHeightWrappers:function($scope){
var $syncHeightWrappers=jQuery('.js-sync-height-wrapper');
if(!$syncHeightWrappers.length) return;
$syncHeightWrappers.each(function(){
var selectors=jQuery(this).data('sync-height-selector');
if(!selectors) return;
var selectorsSplitArray=selectors.split(',');
for(var i=selectorsSplitArray.length-1; i > -1; i--){
selectorsSplitArray[i]=jQuery.trim(selectorsSplitArray[i]);
}
jQuery(this).heightSyncify({
items:selectorsSplitArray
});
});
},
initTooltips:function(){
var $els=jQuery('.icon--question[title], .js-tooltipify');
$els.tooltipify();
},
initQuickLinks:function(){
var $quicklinksToggler=jQuery('#mainNav__quicklinksToggler'),
$quicklinks=jQuery('#mainNav__quicklinks');
if(!$quicklinksToggler.length||!$quicklinks.length) return;
if($quicklinksToggler.data('initQuickLinks')===true) return;
$quicklinksToggler.data('initQuickLinks', true);
var mouseupEv='mouseup.mainNavQuicklinksFauxBlur',
resizeEv='resize.limitQuicklinksHeight';
$quicklinksToggler
.togglerify({
slide: true,
content: function(){
return $quicklinks;
}})
.togglerify('deactivate')
.on({
click:function(e){
e.preventDefault();
var $thisToggler=jQuery(this);
if($thisToggler.hasClass('is-toggled')){
$thisToggler.togglerify('toggleOff');
}else{
var heightLimit=jQuery(window).height() - jQuery('#mainNav').height(),
contentHeight;
$quicklinks.css('height', 'auto');
contentHeight=$quicklinks.height();
$quicklinks.css('height', '');
if(contentHeight >=heightLimit){
$thisToggler.togglerify('toggleOn', { contentHeight:heightLimit });
}else{
$thisToggler.togglerify('toggleOn');
}}
},
toggleOn:function(e, $thisToggler, $target){
jQuery(document).on(mouseupEv, function(e){
var container=$thisToggler.add($target);
if(!container.is(e.target)&&container.has(e.target).length===0){
jQuery(document).off(mouseupEv);
$target.data('togglerify').toggleOff();
}});
jQuery(window).on(resizeEv, function(){
if(!$thisToggler.hasClass('is-toggled')) return;
var heightLimit=jQuery(window).height() - jQuery('#mainNav').height();
$quicklinks.css('height', '');
if($quicklinks.height() >=heightLimit){
$quicklinks.height(heightLimit);
}});
},
toggleOff:function(){
jQuery(document).off(mouseupEv);
jQuery(window).off(resizeEv);
}});
},
loadXMLForm:function($holders){
$holders=jQuery($holders);
if(!$holders.length) return;
$holders.each(function(){
var $thisHolder=jQuery(this);
if(jQuery.data(this, 'loaded-xml-form')===true) return;
var xmlURL=$thisHolder.data('xml-form-url');
if(typeof xmlURL!=='string') return;
jQuery.ajax({
type: 'GET',
url: xmlURL,
dataType: 'xml',
success: function(data){
makeXMLForm(data, $thisHolder);
FE.initFancyPlaceholders($thisHolder);
FE.initInputFocus($thisHolder);
$thisHolder.find('.js-inputify').inputify();
$thisHolder.find('.js-dropdownify').dropdownify();
$thisHolder.data('loaded-xml-form', true);
},
error: function(d){
console.log(d);
}});
});
function makeXMLForm(data, $holder){
var $data=jQuery(data),
$inputs=$data.find('formInput'),
uniqueID=new Date().getTime() + '_' + Math.round(Math.random()*10000),
$xmlForm=jQuery([
'<form action="https://docs.google.com/forms/d/', getText($data.find('formID')), '/formResponse"',
'target="hiddenIframe_', uniqueID, '"',
'method="post" class="xml-form-asset xml-form-contents" />'
].join('')).prependTo($holder),
xmlFormStrArray=[];
xmlFormStrArray.push([
'<div class="row collapse   space-bottom medium-space-bottom-2x">',
makeTitle($data.find('formTitle')),
'</div>'
].join(''));
$inputs.each(function(index){
var $thisInput=jQuery(this),
uniqueInputID=new Date().getTime() + '_' + index,
name=getText($thisInput.find('name')),
label=getText($thisInput.find('label')),
type=getText($thisInput.find('type')).toLowerCase(),
required=getText($thisInput.find('required')).toLowerCase(),
pattern=getText($thisInput.find('pattern')),
tooltip=getText($thisInput.find('tooltip'));
switch(type){
case 'text':
case 'number':
case 'email':
case 'textarea':
var validifyStrArray=['response: #response_' + uniqueInputID],
floaterStrArray=[];
if(!pattern){
if(type==='number'){
validifyStrArray.unshift('pattern: numbers');
}else if(type==='email'){
validifyStrArray.unshift('pattern: email');
}}
if(required==='yes'){
validifyStrArray.unshift('required: true');
}
validifyStrArray.push('floater: #floater_roi_' + uniqueInputID);
floaterStrArray.push('<div class="validify-floater" id="floater_roi_', uniqueInputID, '">');
if(required==='yes'){
floaterStrArray.push([
'<span class="validify-floater__message validify-floater__message--failed-required">',
'This input is required.',
'</span>'
].join(''));
}
var errorMessage=getText($thisInput.find('errorMessage'));
if(type==='number'){
errorMessage='This input should consist of numbers only.'
}else if(type==='email'){
errorMessage='The address should be in this format: username@youremail.com'
}else if(!errorMessage){
errorMessage='Invalid input.'
}
floaterStrArray.push([
'<span class="validify-floater__message validify-floater__message--failed-pattern">',
errorMessage,
'</span>'
].join(''));
floaterStrArray.push('</div>');
var elementStr;
if(type==='textarea'){
elementStr=[
'<textarea'
];
}else{
elementStr=[
'<input',
' type="', (type==='email') ? 'email':'text', '"'
];
}
elementStr.push(' data-validify="', validifyStrArray.join(', '), '"',
(pattern)
? ' data-validify-pattern="' + pattern + '"'
: '',
' name="', name, '"',
' class="field expand"',
' id="roi_', uniqueInputID ,'"',
(type==='textarea')
? '></textarea>'
: ' />'
);
xmlFormStrArray.push([
'<div class="form-obj', (tooltip) ? ' form-obj--with-tooltip':'', '">',
'<div class="field-holder expand">',
elementStr.join(''),
'<label for="roi_', uniqueInputID, '" class="field-holder__label">',
label, (required==='yes') ? '<span class="text-red">*</span>':'',
'</label>',
'</div>',
'<span class="validify-responses  form-obj__icon" id="response_', uniqueInputID, '">',
'<span class="validify-response validify-response--success">',
'<i class="icon icon--success-tick"></i>',
'</span>',
'</span>',
(tooltip)
? '<i title="' + tooltip + '" class="icon icon--question round-circle   form-obj__icon"></i>'
: '',
floaterStrArray.join(''),
'</div>'
].join(''));
break;
case 'dropdown':
var validifyStrArray=['response: #response_' + uniqueInputID],
floaterStr='';
if(required==='yes'){
validifyStrArray.unshift('required: true');
validifyStrArray.push('floater: #floater_roi_' + uniqueInputID);
floaterStr=[
'<div class="validify-floater" id="floater_roi_', uniqueInputID, '">',
'<span class="validify-floater__message validify-floater__message--failed-required">',
'This input is required.',
'</span>',
'</div>'
].join('');
}
var optionsArray=getText($thisInput.find('options')).split('\n'),
options=[];
while(optionsArray.length){
options.push([
'<option value="', optionsArray[0], '">',
optionsArray[0],
'</option>'
].join(''));
optionsArray.shift();
}
xmlFormStrArray.push([
'<div class="form-obj', (tooltip) ? ' form-obj--with-tooltip':'', '">',
'<span class="expand js-dropdownify">',
'<select data-validify="', validifyStrArray.join(', '), '" name="', name, '">',
'<option value="">', label, (required==='yes') ? '*':'', '</option>',
options.join(''),
'</select>',
'</span>',
'<span class="validify-responses  form-obj__icon" id="response_', uniqueInputID, '">',
'<span class="validify-response validify-response--success">',
'<i class="icon icon--success-tick"></i>',
'</span>',
'</span>',
(tooltip)
? '<i title="' + tooltip + '" class="icon icon--question round-circle   form-obj__icon"></i>'
: '',
floaterStr,
'</div>'
].join(''));
break;
case 'radio':
case 'checkbox':
var validifyStrArray=['groupResponse: #response_' + uniqueInputID],
validifyRequiredStr='';
if(required==='yes'){
validifyStrArray.unshift('required: true');
validifyRequiredStr=[
'<span class="validify-response validify-response--failed-required">',
'<br />This input is required.',
'</span>'
].join('');
}
var optionsArray=getText($thisInput.find('options')).split('\n'),
optionsLabelsArray=getText($thisInput.find('optionsLabels')).split('\n'),
options=[],
currentOption;
for(var i=0, ii=optionsArray.length; i < ii; i++){
if(optionsArray[i]==='__other_option__'){
}else{
options.push([
'<label>',
'<input type="', type, '" name="', name, '" data-validify value="', optionsArray[i], '" class="js-inputify" /> ',
(typeof optionsLabelsArray[i]==='string'
&& optionsLabelsArray[i])
? optionsLabelsArray[i]
: optionsArray[i],
'</label>'
].join(''));
}}
xmlFormStrArray.push([
'<div class="form-obj" data-validify-group="', validifyStrArray.join(', '), '">',
'<p class="form-obj__label">',
label, (required==='yes') ? '<span class="text-red">*</span>':'',
(tooltip)
? ' <i title="' + tooltip + '" class="icon icon--question round-circle"></i>'
: '',
' <span class="validify-responses" id="response_', uniqueInputID, '">',
'<span class="validify-response validify-response--success">',
'<i class="icon icon--success-tick"></i>',
'</span>',
validifyRequiredStr,
'</span>',
'</p>',
options.join(''),
'</div>'
].join(''));
break;
}});
xmlFormStrArray.push([
'<div class="text-center space-top medium-space-top-2x">',
'<input type="submit" value="Submit" class="button padded xlarge" />',
'</div>'
].join(''));
$xmlForm.append(xmlFormStrArray.join(''));
$xmlForm.find('.icon--question[title]').tooltipify();
var $hiddenIframe=jQuery('<iframe data-submitted="false" name="hiddenIframe_' + uniqueID + '" style="display: none;" />').appendTo($xmlForm);
$hiddenIframe.on('load', function(){
if(jQuery(this).data('submitted')!==true) return;
$xmlForm.addClass('is-hidden');
$holder.find('.xml-form-thanks').addClass('is-shown');
FE.scrollTo($holder.find('.xml-form-thanks'));
});
$xmlForm.validify().on('submit', function(e){
var validifyData=jQuery.data(this, 'validify');
validifyData.set('strict', true).validate();
if(validifyData.valid!==true){
var $errorInput=jQuery(this).find('.is-failed').eq(0);
FE.scrollTo($errorInput, function(){
$errorInput.focus().select();
});
e.preventDefault();
}else{
$hiddenIframe.data('submitted', true);
$xmlForm.find('input[type="submit"]').addClass('is-loading').prop('disabled', true);
}});
}
function getText($node){
return ($node.length) ? jQuery.trim($node.text()):'';
}
function makeTitle($title){
var title=getText($title);
if(title){
return [
'<div class="large-6 column">',
'<h3>', title, '</h3>',
'</div>',
'<div class="large-6 column   medium-down-pad-vertical large-text-right align-to-h3 text-dark-grey">',
'<span class="text-red">*</span> Please fill in the mandatory fields.',
'</div>'
].join('');
}else{
return [
'<div class="column   medium-down-pad-vertical large-text-right text-dark-grey">',
'<span class="text-red">*</span> Please fill in the mandatory fields.',
'</div>'
].join('');
}}
},
loadXMLTable:function($holders){
$holders=jQuery($holders);
if(!$holders.length) return;
var worksheets={},
xmlSerializer=new XMLSerializer();
$holders.each(function(){
var $thisHolder=jQuery(this);
if($thisHolder.data('loaded-xml-table')===true) return;
var xmlURL=$thisHolder.data('xml-table-url');
if(typeof xmlURL!=='string') return;
jQuery.ajax({
type: 'GET',
url: xmlURL,
dataType: 'xml',
success: function(data){
var xmlStyles=getXMLStyles(data);
makeXMLTable(data, xmlStyles, $thisHolder);
attachRowHoverers();
$thisHolder.data('loaded-xml-table', true);
},
error: function(d){
console.log(d);
}});
});
function makeXMLTable(data, xmlStyles, $holder){
var $data=jQuery(data),
$worksheets=$data.find('Worksheet'),
dropdown={},
finalTableStrArr=[];
worksheets={};
$worksheets.each(function(){
var $thisWorksheet=jQuery(this),
thisWorksheetName=$thisWorksheet.attr('ss:Name').toLowerCase();
if(thisWorksheetName.indexOf('dropdown')===0){
$thisWorksheet.find('Data').each(function(){
var $Data=jQuery(this),
DataIndex=$Data.index(),
DataText=jQuery(this).text().toLowerCase();
switch(DataText){
case 'dropdown label':
dropdown.__label=jQuery(this).closest('Row').next('Row').find('Data').text();
break;
case 'option label':
jQuery(this).closest('Row').nextUntil().each(function(){
var optionLabelText=jQuery(this).find('Data').eq(DataIndex).text();
if(optionLabelText==='') return;
dropdown[jQuery(this).find('Data').eq(DataIndex).text()]=jQuery(this).find('Data').eq(DataIndex+1).text().toLowerCase();
});
break;
}});
}else{
worksheets[thisWorksheetName]=$thisWorksheet;
}});
if(jQuery.isEmptyObject(dropdown)){
var worksheetNames=[];
jQuery.each(worksheets, function(key, value){
worksheetNames.push(key);
});
finalTableStrArr.push(iterateWorksheetsArray(worksheetNames, xmlStyles));
}else{
var dropdownOptionsArray=[],
dropdownContentsArray=[];
jQuery.each(dropdown, function(key, value){
if(key==='__label') return;
dropdownOptionsArray.push(key);
var dropdownWorksheets={},
valueSplitArray=value.split('\n');
if(valueSplitArray.length===1){
valueSplitArray=valueSplitArray[0].split(',');
}
for(var i=valueSplitArray.length-1; i > -1; i--){
valueSplitArray[i]=jQuery.trim(valueSplitArray[i]);
}
dropdownContentsArray.push(iterateWorksheetsArray(valueSplitArray, xmlStyles));
});
var dropdownOptionsStrArray=[],
dropdownContentsStrArray=[];
while(dropdownOptionsArray.length){
dropdownOptionsStrArray.push([
'<option>', dropdownOptionsArray.shift(), '</option>'
].join(''));
}
while(dropdownContentsArray.length){
dropdownContentsStrArray.push([
'<div class="dropdown-content">',
dropdownContentsArray.shift(),
'</div>'
].join(''));
}
finalTableStrArr.push([
'<div class="dropdown-switcher-holder">',
'<div class="text-center text-large">',
dropdown.__label,
'<span class="js-dropdownify tbl-dropdown">',
'<select class="dropdown-switcher">',
dropdownOptionsStrArray.join(''),
'</select>',
'</span>',
'</div>',
'<div class="dropdown-contents-holder">',
dropdownContentsStrArray.join(''),
'</div>',
'</div>'
].join(''));
}
$holder.append(finalTableStrArr.join(''));
FE.initFootnotes($holder);
if(!$holder.find('.js-dropdownify').length) return;
$holder.find('.js-dropdownify').dropdownify();
FE.initDropdownSwitchers($holder);
}
function iterateWorksheetsArray(worksheetNames, xmlStyles){
var worksheetStrArr=[],
currentWorksheetName,
mediaClass;
while(worksheetNames.length){
currentWorksheetName=worksheetNames.shift();
if(typeof worksheets[currentWorksheetName]==='undefined'){
console.error("FE.loadXMLTable(): Can't find the worksheet '" + currentWorksheetName + "'");
continue;
}
if(currentWorksheetName.indexOf('desktop')===0){
mediaClass='show-for-large-up';
}else if(currentWorksheetName.indexOf('tabletup')===0){
mediaClass='show-for-medium-up';
}else if(currentWorksheetName.indexOf('tabletonly')===0){
mediaClass='show-for-medium-only';
}else if(currentWorksheetName.indexOf('tabletdown')===0){
mediaClass='show-for-medium-down';
}else if(currentWorksheetName.indexOf('mobile')===0){
mediaClass='show-for-small-down';
}
worksheetStrArr.push([
'<div class="tbl-holder', (typeof mediaClass==='string') ? ' ' + mediaClass:'', '">'
].join(''));
worksheetStrArr.push(makeTableString(worksheets[currentWorksheetName], xmlStyles));
worksheetStrArr.push('</div>');
}
return (worksheetStrArr.length) ? worksheetStrArr.join(''):false;
}
function getColumnCount($worksheet){
var $worksheetRows=$worksheet.find('Row'),
_columnCount=[];
$worksheetRows.each(function(){
var $cells=jQuery(this).find('Cell');
$cells.each(function(){
if(!jQuery(this).text()){
$cells=$cells.not(jQuery(this));
}});
_columnCount.push($cells.length);
});
return Math.max.apply(null, _columnCount);
}
function getXMLStyles(data){
var $styles=jQuery(data).find('Style'),
styleObj={};
$styles.each(function(){
var $thisStyle=jQuery(this),
$alignment=$thisStyle.find('Alignment'),
$interior=$thisStyle.find('Interior'),
$numberFormat=$thisStyle.find('NumberFormat'),
$font=$thisStyle.find('Font'),
thisStyleObj={};
if($alignment.length&&hasAttributes($alignment, ['ss:Horizontal', 'ss:Vertical'])){
var verticalAlignment, horizontalAlignment;
switch($alignment.attr('ss:Vertical')){
case 'Top':verticalAlignment='top'; break;
case 'Center':verticalAlignment='middle'; break;
case 'Bottom':verticalAlignment='bottom'; break;
}
switch($alignment.attr('ss:Horizontal')){
case 'Top':horizontalAlignment='top'; break;
case 'Center':horizontalAlignment='center'; break;
case 'Bottom':horizontalAlignment='bottom'; break;
}
thisStyleObj.alignment={
'vertical':verticalAlignment,
'horizontal':horizontalAlignment
};}
if($interior.length&&hasAttributes($interior, ['ss:Color'])){
thisStyleObj.bgColor=$interior.attr('ss:Color');
}
if($font.length&&hasAttributes($font, ['ss:Italic', 'ss:Bold', 'ss:Underline', 'ss:Color', 'ss:Size'])){
thisStyleObj.font={
'italic':$font.attr('ss:Italic'),
'bold':$font.attr('ss:Bold'),
'underline':$font.attr('ss:Underline'),
'color':$font.attr('ss:Color'),
'size':$font.attr('ss:Size')
};}
if($numberFormat.length&&hasAttributes($numberFormat, ['ss:Format'])){
thisStyleObj.numberFormat=$numberFormat.attr('ss:Format');
}
styleObj[$thisStyle.attr('ss:ID')]=thisStyleObj;
});
return styleObj;
}
function makeTableString($worksheet, xmlStyles){
var $rows=filterOutEmptyRows($worksheet.find('Row'));
if(!$rows.length) return '';
var totalColumns=parseInt(getColumnCount($worksheet), 10),
totalRows=$rows.length,
i, ii, j, jj,
tableLayout=[];
for(i=$rows.length-1; i >-1; i--){
tableLayout.push(new Array(totalColumns));
}
$rows.each(function(rowIndex){
var cellCount=0;
jQuery(this).find('Cell').each(function(cellIndex){
if(cellCount >=totalColumns) return;
var $thisCell=jQuery(this),
cellMergeDown=parseInt($thisCell.attr('ss:MergeDown'), 10)||0,
cellMergeAcross=parseInt($thisCell.attr('ss:MergeAcross'), 10)||0;
while(typeof tableLayout[rowIndex][cellCount]==='number'){
cellCount++;
}
tableLayout[rowIndex][cellCount]=$thisCell;
if(cellMergeAcross){
for(i=cellCount, ii=cellCount+cellMergeAcross; i < ii; i++){
tableLayout[rowIndex][i+1]=0;
}
cellCount +=cellMergeAcross;
}
if(cellMergeDown){
for(i=rowIndex+1, ii=rowIndex+cellMergeDown; i <=ii; i++){
tableLayout[i][cellCount]=0;
if(cellMergeAcross){
for(j=cellCount+1, jj=cellCount+cellMergeAcross; j <=jj; j++){
tableLayout[i][j]=0;
}}
}}
cellCount++;
});
});
var tableStrArr=[],
tableStyleID=$worksheet.find('Table').attr('ss:StyleID'),
defaultStyle=(xmlStyles[tableStyleID]) ? xmlStyles[tableStyleID]:{};
tableStrArr.push('<table class="default-tbl">');
var cellStrArr, cellArray, cell, k, kk;
while(tableLayout.length){
cellStrArr=[];
cellArray=tableLayout.shift();
for(k=0, kk=cellArray.length; k < kk; k++){
if(typeof cellArray[k]==='undefined'){
cellStrArr.push('<td></td>');
}else if(typeof cellArray[k]==='object'){
cellStrArr.push(makeCellString(cellArray[k], k));
}}
if(cellStrArr.length){
cellStrArr.unshift('<tr>');
cellStrArr.push('</tr>');
tableStrArr.push(cellStrArr.join(''));
}}
tableStrArr.push('</table>');
return tableStrArr.join('');
function makeCellString($cell, cellIndex, log){
var $thisCell=$cell,
cellContent=$thisCell.text();
if(cellContent===''){
if(cellIndex % 2===1){
return '<td class="alt"></td>';
}else{
return '<td></td>';
}}
var cellStyle=jQuery.extend({}, defaultStyle),
cellData=$thisCell.find('Data'),
cellDataType=cellData.attr('ss:Type');
if(cellDataType==='Number'){
var decimalSplit=cellContent.split('.');
if(decimalSplit.length > 1&&decimalSplit[1].length > 2){
cellContent=parseFloat(cellContent, 10).toFixed(2);
}}
if(xmlStyles[$thisCell.attr('ss:StyleID')]){
jQuery.extend(cellStyle, xmlStyles[$thisCell.attr('ss:StyleID')]);
}
var cellNumberFormat=cellStyle.numberFormat,
cellMergeDown=parseInt($thisCell.attr('ss:MergeDown'), 10)||0,
cellMergeAcross=parseInt($thisCell.attr('ss:MergeAcross'), 10)||0,
cellSSData=$thisCell.children('ss\\:Data'),
cellInlineTags={
'italic':0,
'bold':0,
'underline':0
},
cellTagName=(cellStyle.bgColor&&cellStyle.bgColor!=='#FFFFFF') ? 'th':'td',
cellClassNames=[],
cellClassName='',
cellRowspan='',
cellColspan='',
cellInlineStyles=[];
if(cellIndex % 2===1){
cellClassNames.push('alt');
}
if(cellSSData.length){
cellInlineTags={
'bold':cellSSData.find('B').length,
'italic':cellSSData.find('I').length,
'underline':cellSSData.find('U').length
};
cellContent=makeCellInlineFormats(cellSSData);
}
if(typeof cellStyle.bgColor==='string'){
cellInlineStyles.push('background-color: ' + cellStyle.bgColor);
}
if(typeof cellStyle.alignment==='object'){
if(typeof cellStyle.alignment.horizontal==='string'){
cellInlineStyles.push('text-align: ' + cellStyle.alignment.horizontal);
}
if(typeof cellStyle.alignment.vertical==='string'){
cellInlineStyles.push('vertical-align: ' + cellStyle.alignment.vertical);
}}
if(typeof cellStyle.font==='object'){
if(typeof cellStyle.font.italic!=='undefined'){
cellInlineStyles.push('font-style: italic');
}
if(typeof cellStyle.font.bold!=='undefined'){
cellInlineStyles.push('font-weight: bold');
}
if(typeof cellStyle.font.underline!=='undefined'){
cellInlineStyles.push('text-decoration: underline');
}
if(typeof cellStyle.font.color!=='undefined'){
cellInlineStyles.push('color: ' + cellStyle.font.color);
}}
if(cellClassNames.length){
cellClassName=[' class="', cellClassNames.join(' '), '"'].join('');
}
if(cellMergeDown){
cellRowspan=[' rowspan="', cellMergeDown+1, '"'].join('');
}
if(cellMergeAcross){
cellColspan=[' colspan="', cellMergeAcross+1, '"'].join('');
}
if(typeof cellNumberFormat!=='undefined'){
cellContent=makeCellCurrency(cellNumberFormat, cellContent);
}
if(cellInlineStyles.length){
cellInlineStyles=[' style="', cellInlineStyles.join('; '), '"'].join('');
}else{
cellInlineStyles='';
}
cellContent=cellContent.replace(/\n/g, '<br />');
if(typeof cellStyle.font==='object'
&& typeof cellStyle.font.size!=='undefined'
&& cellStyle.font.size!=='11'){
cellContent=[
'<span style="font-size: ', Math.round(parseFloat(cellStyle.font.size, 10) / 11 * 100, 10), '%;">',
cellContent,
'</span>'
].join('');
}
return [
'<', cellTagName, cellClassName, cellRowspan, cellColspan, cellInlineStyles, '>',
cellContent,
'</', cellTagName, '>'
].join('');
}}
function makeCellInlineFormats($ssData){
var ssDataChildNodes=jQuery.makeArray($ssData[0].childNodes),
contentsStr=[];
while(ssDataChildNodes.length){
contentsStr.push(xmlSerializer.serializeToString(ssDataChildNodes.shift()));
}
contentsStr=contentsStr.join('');
var cellContentStr=contentsStr,
fontMatchArray=cellContentStr.match(/<Font+(.*?)>/g);
var inlineStyles;
for(var i=0, ii=fontMatchArray.length; i < ii; i++){
inlineStyles=getInlineStyles(fontMatchArray[i]);
if(inlineStyles===''){
cellContentStr=cellContentStr
.replace(fontMatchArray[i], '')
.replace('</Font>', '');
}else{
cellContentStr=cellContentStr
.replace(fontMatchArray[i], '<span style="' + inlineStyles + '">')
.replace('</Font>', '</span>');
}}
var inlineTags=['b', 'i', 'u', 'sup'],
tagName;
while(inlineTags.length){
tagName=inlineTags.shift();
cellContentStr=cellContentStr
.replace(new RegExp('<' + tagName + '+(.*?)>', 'gi'), '<' + tagName + '>')
.replace(new RegExp('<\/' + tagName + '+(.*?)>', 'gi'), '</' + tagName + '>');
}
return cellContentStr;
function getInlineStyles(fontHTMLStr){
var splitArray=fontHTMLStr.substring(1, fontHTMLStr.length-1).split(' '),
attrStr,
splitAttrArray,
inlineStylesArray=[];
while(splitArray.length){
attrStr=splitArray.shift();
if(attrStr.indexOf('html:')===-1) continue;
splitAttrArray=attrStr.replace(/(html\:)|"/g, '').toLowerCase().split('=');
switch(splitAttrArray[0]){
case 'color':
if(splitAttrArray[1]==='#000000') continue;
inlineStylesArray.push(['color: ', splitAttrArray[1]].join(''));
break;
case 'size':
inlineStylesArray.push(['font-size: ', Math.round((parseFloat(splitAttrArray[1], 10) / 11 * 100), 10), '%'].join(''));
break;
}}
return inlineStylesArray.join('; ');
}}
function makeCellCurrency(cellNumberFormat, cellContent){
if(cellNumberFormat==='@'
|| cellNumberFormat==='0') return cellContent;
var splitCellContentArray;
if(cellNumberFormat==='Currency'){
splitCellContentArray=parseFloat(cellContent, 10).toFixed(2).split('.');
cellContent='RM' + contentWithcommas();
if(splitCellContentArray.length > 1){
cellContent +='.' + splitCellContentArray[1];
}}else if(cellNumberFormat==='Fixed'){
splitCellContentArray=parseFloat(cellContent, 10).toFixed(2).split('.');
cellContent=contentWithcommas();
if(splitCellContentArray.length > 1){
cellContent +='.' + splitCellContentArray[1];
}}else{
var currencyFormatArray=cellNumberFormat.split(';')[0].split(','),
currency=currencyFormatArray[0].replace(/\[|\]| |#|\\|"/g, '').replace(/\$/, '').split('-'),
decimals=currencyFormatArray[1].split('.');
if(currency.length > 1) currency=currency[0];
if(decimals.length===1){
decimals=0;
}else{
decimals=decimals[1].replace(/_\)/g, '').length;
}
splitCellContentArray=parseFloat(cellContent, 10).toFixed(decimals).split('.');
cellContent=currency + contentWithcommas();
if(splitCellContentArray.length > 1){
cellContent +='.' + splitCellContentArray[1];
}}
return cellContent;
function contentWithcommas(){
return splitCellContentArray[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}}
function attachRowHoverers(){
$holders.find('[rowspan]').each(function(){
var $thisCell=jQuery(this),
rowspan=$thisCell.attr('rowspan');
if(typeof rowspan!=='string') return;
rowspan=parseInt(rowspan, 10);
var $thisRow=$thisCell.closest('tr'),
$nextRows=$thisRow.nextAll('tr').slice(0, rowspan-1);
$nextRows.each(function(){
jQuery(this).on({
mouseenter:function(){
$thisCell.addClass('is-hovered');
},
mouseleave:function(){
$thisCell.removeClass('is-hovered');
}});
});
});
}
function filterOutEmptyRows($rows){
$rows.each(function(){
var empty=true;
jQuery(this).find('Cell').each(function(){
if(jQuery(this).text()!=='') empty=false;
return false;
});
if(empty) $rows=$rows.not(jQuery(this));
});
return $rows;
}
function hasAttributes($obj, attrArr){
while(attrArr.length){
if(typeof $obj.attr(attrArr.shift())!=='undefined'){
return true;
}}
return false;
}},
loadXMLLocations:function($holders){
$holders=jQuery($holders);
if(!$holders.length) return;
$holders.each(function(){
var $thisHolder=jQuery(this);
if($thisHolder.data('loaded-xml-locations')===true) return;
var xmlURL=$thisHolder.data('xml-locations-url');
if(typeof xmlURL!=='string') return;
jQuery.ajax({
type: 'GET',
url: xmlURL,
dataType: 'xml',
success: function(data){
makeLocationsList(data, $thisHolder);
$thisHolder.data('loaded-xml-locations', true);
},
error: function(d){
console.log(d);
}});
});
function makeLocationsList(data, $holder){
var $locations=jQuery(data).find('obj'),
regions=[];
$locations.each(function(){
var $region=jQuery(this).find('region'),
regionStr=jQuery.trim($region.text());
regionStr=(regionStr) ? regionStr:'Default';
if(regions.length){
for(var i=regions.length-1; i > -1; i--){
if(regions[i].name===regionStr){
regions[i].$els.push(jQuery(this));
return;
}}
}
regions.push({
'name':regionStr,
'$els':[jQuery(this)]
});
});
regions.sort(function(a,b){
var strA=a.name.toLowerCase(),
strB=b.name.toLowerCase();
if(strA < strB) return -1;
if(strA > strB) return 1;
return 0;
});
var output=[],
switcherStrArr=['<span class="location-dropdown"><select>', '', '</select></span>'],
rowMarkup=['<div class="row location-list', 1, '"><div class="row__flexi-width ', 3, '">'],
i, ii, totalLocationsInRegion;
for(i=0, ii=regions.length; i < ii; i++){
rowMarkup[1]=(i===0) ? ' current':'';
totalLocationsInRegion=regions[i].$els.length;
if(totalLocationsInRegion < 2){
rowMarkup[3]='has-1-item';
}else if(totalLocationsInRegion===2){
rowMarkup[3]='has-2-items';
}else if(totalLocationsInRegion===3){
rowMarkup[3]='has-3-items';
}else{
rowMarkup[3]='more-than-3-items';
}
output.push(rowMarkup.join(''));
while(regions[i].$els.length){
output.push([
'<div class="column">',
'<div class="location">',
'<div class="location__name">',
jQuery.trim(regions[i].$els[0].find('storeName').text()),
'</div>',
'<div class="location__address">',
jQuery.trim(regions[i].$els[0].find('storeAddress').text()),
'</div>',
'<div class="location__footer">',
'<a href="https://maps.google.com/maps?daddr=',
jQuery.trim(regions[i].$els[0].find('storeLat').text()), ',',
jQuery.trim(regions[i].$els[0].find('storeLng').text()), '" target="_blank">',
'Get Directions',
'</a>',
'</div>',
'</div>',
'</div>'
].join(''));
regions[i].$els.shift();
}
output.push('</div></div>');
}
$holder.html(output.join(''));
if(regions.length > 1){
for(i=0, ii=regions.length; i < ii; i++){
switcherStrArr[1] +=[
'<option value="', i, '">', regions[i].name, '</option>'
].join('');
}
var $switcher=jQuery(switcherStrArr.join(''));
jQuery('<div class="text-center" />')
.prependTo($holder)
.append($switcher);
$switcher.dropdownify();
var $locationLists=$holder.find('.location-list');
$holder.find('select').on('change', function(){
var targetIndex=parseInt(jQuery(this).val(), 10);
$locationLists.each(function(index){
if(index===targetIndex){
jQuery(this)
.addClass('current')
.heightSyncify('enable')
.heightSyncify('sync');
}else{
jQuery(this)
.removeClass('current')
.heightSyncify('disable');
}});
});
}
var syncHeightSelectors=['.location__name', '.location__address'];
$holder.find('.location-list').heightSyncify({
items:syncHeightSelectors
});
}},
scrollTo:function($obj, callback){
if(typeof $obj!=='object'
|| !$obj instanceof jQuery
|| !$obj.length){
return;
}
var targetScrollPos=$obj.offset().top - 50;
if(targetScrollPos < jQuery(window).scrollTop()){
targetScrollPos -=jQuery('#mainNav').outerHeight();
if(jQuery('#mainSmallNav').css('display')!=='none'
&& !jQuery('#mainHeader').hasClass('is-partially-hidden')){
targetScrollPos -=jQuery('#mainSmallNav').outerHeight();
}}
if(callback==='snap'){
jQuery(window).scrollTop(targetScrollPos);
}else{
jQuery('html, body').animate({
scrollTop:targetScrollPos
}, 400, callback);
}},
watchSize:function(){
homebrew.watchSize.apply(homebrew, arguments);
}
});
jQuery.extend(FE.FootnoteAnchor.prototype, {
init:function($el, $footnote){
if(!$el.length||!$footnote.length) return;
var instance=this;
instance.$el=$el;
instance.$footnote=$footnote;
$el.tooltipify({
contents:$footnote.html()
});
instance.$el.data('footnote-anchor', this);
instance.enable();
},
enable:function(){
if(Modernizr.touch) return this;
var instance=this;
instance.$el.on({
'click.footnotesTooltip':function(e){
e.preventDefault();
e.stopPropagation();
var $thisFootnote=instance.$footnote;
if(!jQuery('#notesToggler').hasClass('is-toggled')){
jQuery('#notesToggler').togglerify('toggleOn', { noSlide:true });
}
FE.scrollTo($thisFootnote);
$thisFootnote.addClass('is-active');
jQuery(document)
.off('mouseup.notesFauxBlur')
.on('mouseup.notesFauxBlur', function(e){
if(!$thisFootnote.is(e.target)&&$thisFootnote.has(e.target).length===0){
jQuery(document).off('mouseup.notesFauxBlur');
$thisFootnote.removeClass('is-active');
}});
}});
return this;
},
disable:function(){
var instance=this;
instance.$el.off('click.footnotesTooltip');
instance.$el.tooltipify('disable');
return instance;
}});
jQuery.extend(FE.Hasher.prototype, {
get:function(args){
var instance=this,
hash=window.location.hash;
if(hash===''
|| hash==='#/'
|| hash.substr(0,2)!=='#/'){
instance.data={};
return instance;
}
var splitHash=hash.substring(2).split('&'),
keyValuePairs,
dataObj={};
while(splitHash.length){
keyValuePairs=splitHash.shift().split('=');
dataObj[jQuery.trim(keyValuePairs[0])]=decodeURIComponent(jQuery.trim(keyValuePairs[1]));
}
instance.data=dataObj;
return instance;
},
setData:function(data){
if(!data||!jQuery.isPlainObject(data)) return this;
this.data=jQuery.extend({}, data);
return this;
},
extendData:function(data){
if(!data||!jQuery.isPlainObject(data)) return this;
if(this.data){
jQuery.extend(this.data, data);
}else{
this.data=data;
}
return this;
},
set:function(args){
args=args||{};
var instance=this,
options=jQuery.extend(instance.options, args);
if(options.ignoreDefault&&!instance.data) return instance;
instance.data=instance.data||{};
var hashKeys=[],
hash=[],
sequence=options.sequence;
if(sequence==='alphabetical'
|| typeof sequence==='function'){
jQuery.each(instance.data, function(key, value){
if(key===''||value==='') return;
hashKeys.push(key);
});
var sorter;
if(sequence==='alphabetical'){
sorter=function(a, b){
var _a=a.toLowerCase(),
_b=b.toLowerCase();
if(_a < _b) return -1;
if(_a > _b) return 1;
return 0;
};}else if(typeof sequence==='function'){
sorter=sequence;
}
hashKeys.sort(sorter);
var currentHashKey;
while(hashKeys.length){
currentHashKey=hashKeys.shift();
hash.push([currentHashKey, encodeURIComponent(instance.data[currentHashKey])].join('='));
}}else if(typeof sequence==='string'){
var splitSequence=sequence.split(','),
i, ii, currentSequenceKey;
for(i=0, ii=splitSequence.length; i < ii; i++){
currentSequenceKey=splitSequence[i];
if(instance.data[currentSequenceKey]){
hash.push([currentSequenceKey, encodeURIComponent(instance.data[currentSequenceKey])].join('='));
}}
jQuery.each(instance.data, function(key, value){
if(key===''||value==='') return;
for(i=splitSequence.length-1; i > -1; i--){
if(key===splitSequence[i]) return;
}
hash.push([key, encodeURIComponent(value)].join('='));
});
}else{
jQuery.each(instance.data, function(key, value){
if(key===''||value==='') return;
hash.push([key, encodeURIComponent(value)].join('='));
});
}
window.location.hash='#/' + hash.join('&');
},
isSameWith:function(data){
if(!data) return false;
var same=true,
count=0,
instance=this;
jQuery.each(data, function(key, value){
if(typeof instance.data[key]==='undefined'
|| instance.data[key]!==value){
same=false;
return false;
}else{
count++;
}});
if(same){
var refCount=0;
jQuery.each(instance.data, function(){
refCount++;
});
same=(count===refCount);
}
return same;
}});
jQuery.extend(FE.StickyColumn.prototype, {
callbacks:jQuery({}),
hasMousewheel:Boolean(jQuery.fn.mousewheel),
classes:{
stickyColumn:'sticky-column',
sticky:'is-sticky',
stickBottom:'is-stick-to-bottom'
},
load:function(args){
var instance=this,
proto=FE.StickyColumn.prototype;
if(!proto.hasMousewheel){
if(!proto.loadingMousewheel){
proto.loadingMousewheel=true;
jQuery.getScript(FE.baseURL + 'js/plugins/jquery.mousewheel.min.js', function(){
FE.StickyColumn.prototype.hasMousewheel=true;
proto.callbacks.dequeue('mousewheelLoaded');
});
}
proto.callbacks.queue('mousewheelLoaded', function(next){
instance.init(args);
if(typeof next==='function') next();
});
}},
init:function(args){
var $el=args.$el,
$comparee=args.$comparee;
if(!$el||!$comparee
|| !$el instanceof jQuery||!$comparee instanceof jQuery
|| !$el.length||!$comparee.length){
return;
}
var instance=this,
proto=FE.StickyColumn.prototype;
instance.$el=$el;
instance.$comparee=$comparee;
instance.uniqueID=homebrew.generateUniqueID();
$el.addClass(instance.classes.stickyColumn);
FE.watchSize('large', function(isLargeScreen){
if(isLargeScreen){
instance.watch();
}else{
instance.rest();
instance.unstick();
instance.updatePosition();
}});
return instance;
},
determineState:function(){
if(!homebrew.screenSize.large) return 'should-be-unstuck';
var instance=this,
$stickyCol=instance.$el,
$comparee=instance.$comparee,
windowTop=jQuery(window).scrollTop(),
stickyColMarginTop=parseInt($stickyCol.css('margin-top'), 10);
instance.offsetTop=(jQuery('#mainHeader').css('position')==='fixed') ?  0:0;
instance.offsetBottom=parseInt($comparee.find('.column').css('margin-bottom'), 10)*2;
if(!$comparee.is(':visible')||$stickyCol.height() >=$comparee.height()){
return 'should-be-unstuck';
}else if($stickyCol.hasClass(instance.classes.stickBottom)&&$stickyCol.offset().top >=windowTop + instance.offsetTop){
return 'should-be-stuck';
}else if((windowTop + $stickyCol.height() + stickyColMarginTop + instance.offsetTop) > ($comparee.offset().top + $comparee.height() - instance.offsetBottom)){
return 'should-be-stuck-to-bottom';
}else if($comparee.offset().top <=windowTop + instance.offsetTop){
return 'should-be-stuck';
}else{
return 'should-be-unstuck';
}},
updatePosition:function(){
var instance=this,
$el=instance.$el;
if($el.hasClass(instance.classes.stickBottom)||!$el.hasClass(instance.classes.sticky)){
$el.css('top', '');
}else{
$el.css('top', jQuery(window).scrollTop() - instance.$comparee.offset().top + instance.offsetTop + 'px');
}
return instance;
},
stick:function(){
var instance=this;
instance.$el
.addClass(instance.classes.sticky)
.removeClass(instance.classes.stickBottom);
return instance;
},
stickToBottom:function(){
var instance=this;
instance.$el
.addClass([
instance.classes.sticky,
instance.classes.stickBottom
].join(' '))
.css('margin-top', '');
return instance;
},
unstick:function(){
var instance=this;
instance.$el
.removeClass([
instance.classes.sticky,
instance.classes.stickBottom
].join(' '))
.css('margin-top', '');
return instance;
},
watch:function(){
var instance=this;
jQuery(window).on([
'scroll.', instance.uniqueID,
' resize.', instance.uniqueID
].join(''), function(){
var state=instance.determineState();
switch(state){
case 'should-be-stuck':instance.stick();         break;
case 'should-be-stuck-to-bottom':instance.stickToBottom(); break;
case 'should-be-unstuck':instance.unstick();       break;
}
instance.updatePosition();
}).trigger('scroll');
instance.$el.on('mousewheel', function(e){
if(instance.determineState()!=='should-be-stuck') return;
var vector;
if(e.deltaY < 0){
var bottomDiff=jQuery(window).scrollTop() + jQuery(window).height() - jQuery(this).offset().top - jQuery(this).height();
if(bottomDiff >=0){
return;
}else if(Math.abs(bottomDiff) < 100){
vector=bottomDiff;
}else{
vector=-100;
}}else if(e.deltaY > 0){
var topDiff=jQuery(window).scrollTop() + instance.offsetTop - jQuery(this).offset().top;
if(topDiff===0){
return;
}else if(topDiff < 100){
vector=topDiff;
}else{
vector=100;
}}
e.preventDefault();
instance.$el.css('margin-top', [parseInt(instance.$el.css('margin-top'), 10) + vector, 'px'].join(''));
});
return instance;
},
rest:function(){
jQuery(window).off('.' + this.uniqueID);
return this;
}});
FE.initPage();
if(typeof FE__callbacks==='object'
&& FE__callbacks instanceof Array
&& FE__callbacks.length){
while(FE__callbacks.length){
FE__callbacks.shift()();
}}
});
var $infoToggler=jQuery('.info__toggler'),
$infoTogglerContents=jQuery('.info__toggler-contents');
$infoToggler.togglerify({
singleActive: true,
slide: true,
content: function(index){
return $infoTogglerContents.eq(index);
}});
function SendMail(rcvEmail){
var emailRegex=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
var name=document.form.ssf_cont_name.value,
email=document.form.ssf_cont_email.value,
phone=document.form.ssf_cont_phone.value,
message=document.form.ssf_cont_msg.value;
email=email.trim();
var storename=jQuery('#storeLocatorInfobox .store-location').html();
if(name==""){
document.form.ssf_cont_name.focus() ;
document.getElementById("ssf-msg-status").innerHTML="<span style='color:red;'>"+contact_plc_name+"</span>"
return false;
}
if(email==""){
document.form.ssf_cont_email.focus() ;
document.getElementById("ssf-msg-status").innerHTML="<span style='color:red;'>"+contact_plc_email+"</span>";
return false;
}
else if(!emailRegex.test(email)){
document.form.ssf_cont_email.focus();
document.getElementById("ssf-msg-status").innerHTML="<span style='color:red;'>"+contact_plc_email+" </span>";
return false;
}
if(message==""){
document.form.ssf_cont_msg.focus() ;
document.getElementById("ssf-msg-status").innerHTML="<span style='color:red;'>"+contact_plc_msg+"  </span>";
return false;
}
if(jQuery('#ssf_gdpr_check').length>0){
if(jQuery('input#ssf_gdpr_check').is(':checked')){
}else{
jQuery('input#ssf_gdpr_check').addClass('ssf_invalid');
return false;
}}
var name_lbl=ssf_cont_us_name;
var email_lbl=ssf_cont_us_email;
var msg_lbl=ssf_cont_us_msg;
var phone_lbl=contact_plc_phone;
jQuery.ajax({
type: "POST",
url: ssf_wp_base + '/sendMail.php?t='+d.getTime(),
data: {name: name, email: email, phone: phone, message:message, rcvEmail: rcvEmail,subject: storename,name_lbl:name_lbl, email_lbl:email_lbl, msg_lbl:msg_lbl, phone_lbl:phone_lbl},
cache: false,
success: function (html){
document.getElementById("ssf-contact-form").reset();
document.getElementById("ssf-msg-status").innerHTML="<span style='color:green;' id='imageMsgAlert'>"+ssf_msg_sucess+"</span>";
jQuery('#imageMsgAlert').fadeOut(5000);
}});
}
jQuery(document).ready(function(){
jQuery("input#ssf_gdpr_check").click(function(){
var s_checked=jQuery(this).is(':checked');
if(s_checked){
jQuery('input#ssf_gdpr_check').removeClass('ssf_invalid');
}});
});
var initStoreLocator;
var d=new Date();
var geocoder;
var street;
var placeholdersearch='';
var initTheMap='';
var _map;
var lastid='';
var defualtLatLong;
var calltodefualt=false;
var contact_us_email;
if(typeof YourSearchLocation=='undefined'||YourSearchLocation==""){
var YourSearchLocation="Your search location";
var YourCurrentlocation="Your current location";
}
jQuery(function(){
if(document.getElementById('storeLocator__searchBar')!=null){
placeholdersearch=document.getElementById('storeLocator__searchBar').placeholder;
}else{
return;
}
var baseURL=FE.baseURL,
urls={
pathToJS:ssf_wp_base+'/js/',
pathToIcons:ssf_wp_uploads_base+'/images/icons/',
pathToXML:baseURL + '',
pins:{
regular:custom_marker,
active:custom_marker_active,
skeuomorph:'youarehere.png'
}},
map={
el:document.getElementById('storeLocatorMap'),
infobox:{
el:document.getElementById('storeLocatorInfobox')
},
status:{
$el:jQuery('#storeLocator__mapStatus'),
$label:jQuery('#storeLocator__mapStatus__inner'),
$closer:jQuery('#storeLocator__mapStatus__closer'),
messages:{
loadingGoogleMap:ssf_wp_loadingGoogleMap,
loadingGoogleMapUtilities:ssf_wp_loadingGoogleMapUtilities,
startSearch:ssf_wp_startSearch,
gettingUserLocation:ssf_wp_gettingUserLocation,
lookingForNearbyStores:ssf_wp_lookingForNearbyStores,
lookingForStoresNearLocation:ssf_wp_lookingForStoresNearLocation,
filteringStores:ssf_wp_filteringStores,
cantLocateUser:ssf_wp_cantLocateUser,
notAllowedUserLocation:ssf_wp_notAllowedUserLocation,
noStoresNearSearchLocation:ssf_wp_noStoresNearSearchLocation,
noStoresNearUser:ssf_wp_noStoresNearUser,
noStoresFromFilter:ssf_wp_noStoresFromFilter,
cantGetStoresInfo:ssf_wp_cantGetStoresInfo,
noStoresFoundNearUser:ssf_noStoresFound,
noStoresFound:ssf_noStoresFound,
storesFound:ssf_storesFound,
generalError:ssf_generalError
},
duration:5000
}},
autocompleter={
el:document.getElementById('storeLocator__searchBar'),
placeholderMediumUp:placeholdersearch,
placeholderSmallDown:placeholdersearch
},
geolocator={
$el:jQuery('#geolocator'),
currentState:'neutral',
states:{
NEUTRAL:'neutral',
RUNNING:'running'
}},
$els={
map:jQuery('#storeLocatorMap'),
storeList:jQuery('#storeLocator__storeList'),
topHalf:jQuery('#storeLocator__topHalf'),
currentStoreCount:jQuery('#storeLocator__currentStoreCount'),
totalStoreCount:jQuery('#storeLocator__totalStoreCount'),
storeLocatorInfoBox:{
self:jQuery('#storeLocatorInfobox'),
init:function(){
this.storeimage=this.self.find('.store-image');
this.location=this.self.find('.store-location');
this.address=this.self.find('.store-address');
this.website=this.self.find('.store-website');
this.exturl=this.self.find('.store-exturl');
this.embedvideo=this.self.find('.store-embedvideo');
this.defaultmedia=this.self.find('.store-defaultmedia');
this.email=this.self.find('.store-email');
this.contactus=this.self.find('.store-contactus');
this.telephone=this.self.find('.store-tel');
this.fax=this.self.find('.store-fax');
this.description=this.self.find('.store-description');
this.operatingHours=this.self.find('.store-operating-hours');
this.productsServices=this.self.find('.store-products-services');
this.directions=this.self.find('.infobox__cta');
this.streetview=this.self.find('.infobox__stv');
this.custmmarker=this.self.find('.store-custom-marker');
this.zip=this.self.find('.store-zip');
this.state=this.self.find('.store-state');
}},
mobileStoreLocatorInfobox:{
self:jQuery('#mobileStoreLocatorInfobox'),
init:function(){
this.storeimage=this.self.find('.store-image');
this.location=this.self.find('.store-location');
this.address=this.self.find('.store-address');
this.website=this.self.find('.store-website');
this.exturl=this.self.find('.store-exturl');
this.embedvideo=this.self.find('.store-embedvideo');
this.defaultmedia=this.self.find('.store-defaultmedia');
this.email=this.self.find('.store-email');
this.contactus=this.self.find('.store-contactus');
this.telephone=this.self.find('.store-tel');
this.fax=this.self.find('.store-fax');
this.description=this.self.find('.store-description');
this.operatingHours=this.self.find('.store-operating-hours');
this.productsServices=this.self.find('.store-products-services');
this.directions=this.self.find('.infobox__cta');
this.streetview=this.self.find('.infobox__stv');
this.custmmarker=this.self.find('.store-custom-marker');
this.zip=this.self.find('.store-zip');
this.state=this.self.find('.store-state');
}},
filters:{
init:function(){
this.states=jQuery('#filter__states').find('input[name="storesState"]');
this.outletTypes=jQuery('#filter__outlets').find('input[name="storesOutletType"]');
this.productsServices=jQuery('#filter__services').find('input[name="storesProductsServices"]');
this.countryVal=jQuery('#filter__country').find('input[name="storesCountry"]');
return this;
}}
},
legend,
xml={
filename:ssf_wp_base+'/ssf-wp-xml.php?wpml_lang='+wmpl_ssf_lang+'&t='+d.getTime()
},
json={
filename:ssf_wp_uploads_base +"/ssf-data.json?t="+d.getTime()
},
jsonwpml={
filename:ssf_wp_base+'/ssf-wp-json-wpml.php?wpml_lang='+wmpl_ssf_lang+'&t='+d.getTime()
},
isLocal=(window.location.hostname===''||window.location.hostname==='localhost'),
isLargeScreen=true,
isMediumScreen=true;
setupMapStatus();
var $filterTogglers=jQuery('.filter__toggler'),
$filterTogglerContents=jQuery('.filter__toggler-contents');
$filterTogglers.togglerify({
singleActive: true,
slide: true,
content: function(index){
return $filterTogglerContents.eq(index);
}});
FE.watchSize('large', function(isLargeScreen){
var settings=(isLargeScreen) ? [true, 'toggleOff', 'activate']:[false, 'toggleOn', 'deactivate'];
$filterTogglers
.togglerify('set', 'singleActive', settings[0])
.togglerify(settings[1], { noSlide:true })
.togglerify(settings[2]);
if(placeholdersearch!=''){
autocompleter.el.placeholder=(isLargeScreen) ? autocompleter.placeholderMediumUp:autocompleter.placeholderMediumUp;
}});
var $storeLocatorFilterToggler=jQuery('#storeLocatorFilterToggler'),
$filterPanel=$els.topHalf.find('.filter-radio');
$filterPanel.data('filter-popup', {
reveal:function(){
jQuery('body').addClass('filter-popup-is-shown');
},
conceal:function(){
jQuery('body').removeClass('filter-popup-is-shown');
}});
$filterPanel.find('[data-close-popup]').on('click', function(e){
e.preventDefault();
$filterPanel.data('filter-popup').conceal();
});
$storeLocatorFilterToggler.on('click', function(e){
e.preventDefault();
$filterPanel.data('filter-popup').reveal();
});
map.status.notify({
message:'loadingGoogleMap',
loadingIndicator:true
});
var googleApi='';
if(google_api_key!=''&&google_api_key!='undefined'){
googleApi='key='+google_api_key+'&';
}
jQuery.getScript('https://maps.googleapis.com/maps/api/js?'+googleApi+'sensor=false&libraries=places&v=3.15&language='+ssf_m_lang+'&region='+ssf_m_rgn+'&callback=initStoreLocator');
initStoreLocator=function(){
map.status.notify({
message:'loadingGoogleMapUtilities',
loadingIndicator:true
});
jQuery.getScript(ssf_wp_base +'/js/plugins/google-maps-utility-library/marker-with-label.packed.js', onLoad);
jQuery.getScript(ssf_wp_base +'/js/plugins/google-maps-utility-library/infobox.packed.js', onLoad);
var loadCounter=0;
function onLoad(){
loadCounter++;
if(loadCounter < 2) return;
map.status.notify({
message: 'startSearch',
autoclose: true
});
jQuery.extend(true, map, {
markers:{
user:{},
stores:{
list:[]
}}
});
$els.storeLocatorInfoBox.init();
$els.mobileStoreLocatorInfobox.init();
setupMediaQueries();
setupGeolocator();
setupAutocompleter();
setupEventHandlers();
if(typeof xml.data==='undefined'){
if(typeof ssf_data_source==='undefined'||ssf_data_source=='false'){
jQuery.ajax({
type: "GET",
url: urls.pathToXML + xml.filename,
dataType: "xml",
success: function(data){
xml.data=data;
continueInit();
}});
}else{
if(typeof wmpl_ssf_lang!='undefined'&&wmpl_ssf_lang!='en'&&wmpl_ssf_lang!=''){
var jsonssfurl=jsonwpml.filename;
}else{
var jsonssfurl=json.filename;
}
jQuery.getJSON(jsonssfurl, function(data){
xml.data=data;
continueInit();
});
}}else{
continueInit();
}
function continueInit(){
legend={};
var radiosStrArray=[];
if(typeof ssf_data_source==='undefined'||ssf_data_source=='false'){
jQuery(xml.data).find('label').each(function(){
var tag=jQuery(this).find('tag').text().trim();
var copy=jQuery(this).find('copy').text().trim();
legend[tag]=copy;
radiosStrArray.push([
'<label class="label--vertical-align ssflabel">',
'<div class="label__input-icon">',
'<i class="icon icon--input icon--radio-btn"></i>',
'</div>',
'<div class="label__contents">',
'<input type="radio" name="storesProductsServices"  value="', tag, '" /> ', copy,
'</div>',
'</label>'
].join(''));
});
}else{
jQuery(xml.data.tags).each(function(){
var tag=this.tag;
var copy=this.copy;
legend[tag]=copy;
radiosStrArray.push([
'<label class="label--vertical-align ssflabel">',
'<div class="label__input-icon">',
'<i class="icon icon--input icon--radio-btn"></i>',
'</div>',
'<div class="label__contents">',
'<input type="radio" name="storesProductsServices"  value="', tag, '" /> ', copy,
'</div>',
'</label>'
].join(''));
});
}
jQuery('#productsServicesFilterOptions').append(radiosStrArray.join(''));
if(ssf_default_category!=''&&ssf_default_category!=undefined){
jQuery(function(){
setTimeout(function(){
jQuery('input[value='+ssf_default_category+']').trigger('click');
jQuery('#filter__services .filter__toggler').trigger('click');
},3000);
});
}
$els.filters.init().productsServices.inputify();
if(typeof ssf_data_source==='undefined'||ssf_data_source=='false'){
$els.totalStoreCount.text(jQuery(xml.data).find('item').length);
}else{
$els.totalStoreCount.text(jQuery(xml.data.item).length);
}
startMap();
}}
function startMap(){
jQuery('#ssf-overlay').css('display','none');
jQuery('#ssf-dummy-blck').css('display','none');
jQuery('#ssf-preloader').css('display','none');
jQuery('#store-locator-section-bg').css('display','block');
jQuery('#mainPopupContat').css('display','block');
jQuery('#mainPopupHolder').css('display','block');
jQuery('#storeLocator__topHalf').css('display','block');
setTimeout(function(){
jQuery('#store-locator-section-bg').addClass('store-locator-section-bg');
}, 1000);
var defaultLatLng
if(default_location!=''&&default_location!==undefined&&ssf_wp_map_settings=='geo'){
geocoder=new google.maps.Geocoder();
geocoder.geocode({'address':default_location,'region':''}, function(results, status){
if(status==google.maps.GeocoderStatus.OK){
defaultLatLng=results[0].geometry.location;
loadDefaultMap(defaultLatLng);
}});
}else{
defaultLatLng=new google.maps.LatLng(40.705, -74.0139);
loadDefaultMap(defaultLatLng);
}}
function loadDefaultMap(defaultLatLng){
defualtLatLong=defaultLatLng;
var scrollset=false;
if(map_mouse_scroll==1){
scrollset=true;
}
var mobile_gesture;
if(ssf_mobile_gesture=='true'){
mobile_gesture='cooperative';
}else{
mobile_gesture='greedy';
}
mapWithStyle={
center: defaultLatLng,
styles:ssf_wp_map_code,
streetViewControl: true,
streetViewControlOptions: {
position: google.maps.ControlPosition.RIGHT_TOP
},
zoom: init_zoom,
zoomControl: true,
gestureHandling: mobile_gesture,
zoomControlOptions: {
position: google.maps.ControlPosition.RIGHT_TOP
},
mapTypeId: google.maps.MapTypeId.ROADMAP,
scrollwheel: scrollset
};
mapWithoutStyle={
center: defaultLatLng,
streetViewControl: true,
gestureHandling: mobile_gesture,
streetViewControlOptions: {
position: google.maps.ControlPosition.RIGHT_TOP
},
zoom: init_zoom,
zoomControl: true,
zoomControlOptions: {
position: google.maps.ControlPosition.RIGHT_TOP
},
mapTypeId: google.maps.MapTypeId.ROADMAP,
scrollwheel: scrollset
};
if(ssf_wp_map_code!=""&&ssf_wp_map_code!=undefined){
map.self=new google.maps.Map(map.el, mapWithStyle);
}else{
map.self=new google.maps.Map(map.el, mapWithoutStyle);
}
map.infobox.self=new InfoBox({
content: map.infobox.el,
pixelOffset: new google.maps.Size(35, -240),
closeBoxMargin: "10px 10px 0 0",
closeBoxURL:  ssf_wp_base+"/images/icons/cross-white.png"
});
$els.storeLocatorInfoBox.self.find('.infobox__closer').on('click', function(e){
e.preventDefault();
map.infobox.self.close();
});
geolocator.watch();
}
function setupGeolocator(){
jQuery.extend(true, geolocator, {
watch:function(){
var self=this;
self.currentState=self.states.RUNNING;
map.status.notify({
message: 'gettingUserLocation',
loadingIndicator: true
});
self.$el.addClass('is-loading');
if(initTheMap==''&&ssf_wp_map_settings=='showall'){
searchForStores({productsServices:ssf_default_category});
}else if(initTheMap==''&&default_location!=''&&ssf_wp_map_settings=='specific'){
jQuery('input#storeLocator__searchBar').val(default_location);
jQuery('.icon--search').trigger('click');
}else{
map.watcher=navigator.geolocation.watchPosition(
function(position){
if(self.currentState!==self.states.RUNNING) return;
self.rest();
calltodefualt==true;
var coordinates=position.coords,
userLatLng=new google.maps.LatLng(coordinates.latitude, coordinates.longitude);
setMainMapMarker(userLatLng, YourCurrentlocation);
map.status.notify({
message:'lookingForNearbyStores',
loadingIndicator:true
});
var categories=$els.filters.productsServices.filter(':checked').val();
if(typeof categories!=='undefined'&&categories!=''){
categories=categories;
}else{
categories=ssf_default_category;
}
searchForStores({
latLng:userLatLng,
distance:ssf_distance_limit,
productsServices:categories,
centerOnUser:true,
onError:function(){
map.status.notify({
message:'noStoresNearUser',
closeable:true
});
}});
},
function(error){
if(self.currentState!==self.states.RUNNING) return;
self.rest();
switch(error.code){
case error.TIMEOUT:
map.status.notify({
message:'cantLocateUser',
closeable:true
});
break;
default:
locationNotAvailable();
break;
}},
{
enableHighAccuracy: true,
maximumAge: 30000,
timeout: 15000 
}
);
}
initTheMap='1';
setTimeout(function(){
navigator.geolocation.clearWatch(map.watcher);
}, 20000)
geolocator.timer=setTimeout(function(){
if(ssf_wp_map_settings=='geo'&&calltodefualt==false){ defaultLocationStore(); }
self.rest();
locationNotAvailable();
}, 20000);
},
rest:function(){
if(!navigator.geolocation) return;
geolocator.currentState=geolocator.states.NEUTRAL;
navigator.geolocation.clearWatch(map.watcher);
clearTimeout(geolocator.timer);
geolocator.$el.removeClass('is-loading');
}});
}
function defaultLocationStore(){
searchForStores({
latLng:defualtLatLong,
distance:ssf_distance_limit,
productsServices:ssf_default_category,
centerOnUser:true,
onError:function(){
map.status.notify({
message:'noStoresNearUser',
closeable:true
});
}});
}
function setupMediaQueries(){
FE.watchSize('large', function(mq){
isLargeScreen=mq;
if(typeof map.markers.stores.current==='undefined'
|| map.markers.stores.current===null){
return;
}
if(isLargeScreen){
map.infobox.self.open(map.self, map.markers.stores.current);
}});
FE.watchSize('medium', function(mq){
isMediumScreen=mq;
if(typeof map.markers.stores.current==='undefined'
|| map.markers.stores.current===null){
return;
}
if(isMediumScreen){
map.infobox.self.open(map.self, map.markers.stores.current);
}else{
setMapCenter(map.markers.stores.current.position);
map.infobox.self.close();
}});
}
function setupAutocompleter(){
if(ssf_defualt_region=='false'){
var _autocompleter=new google.maps.places.Autocomplete(autocompleter.el, {
componentRestrictions: {'country': ssf_m_rgn}});
}else{
var _autocompleter=new google.maps.places.Autocomplete(autocompleter.el, {
});
}
google.maps.event.addListener(_autocompleter, 'place_changed', function(){
jQuery('div[jsaction="closeControl.click"]').trigger('click');
var searchPlace=jQuery('#storeLocator__searchBar').val();
if(searchPlace!=''){
geocoder=new google.maps.Geocoder();
geocoder.geocode({'address':searchPlace+', '+ssf_m_rgn}, function(results, status){
if(status==google.maps.GeocoderStatus.OK){
placeLocation=results[0].geometry.location;
setMainMapMarker(placeLocation, YourSearchLocation+': ' + searchPlace);
var categories=$els.filters.productsServices.filter(':checked').val();
if(typeof categories!=='undefined'&&categories!=''){
categories=categories;
}else{
categories=ssf_default_category;
}
searchForStores({
latLng:placeLocation,
distance:ssf_distance_limit,
productsServices:categories,
centerOnUser:true,
onError:function(){
map.status.notify({
message:'noStoresNearSearchLocation',
closeable:true
});
}});
}else{
}});
}});
jQuery(".icon--search").click(function(){
jQuery('div[jsaction="closeControl.click"]').trigger('click');
var searchPlace=jQuery('#storeLocator__searchBar').val();
if(searchPlace!=''){
geocoder=new google.maps.Geocoder();
geocoder.geocode({'address':searchPlace+','+ssf_m_rgn}, function(results, status){
if(status==google.maps.GeocoderStatus.OK){
placeLocation=results[0].geometry.location;
setMainMapMarker(placeLocation, YourSearchLocation+': ' + searchPlace);
var categories=$els.filters.productsServices.filter(':checked').val();
if(typeof categories!=='undefined'&&categories!=''){
categories=categories;
}else{
categories=ssf_default_category;
}
searchForStores({
latLng:placeLocation,
distance:ssf_distance_limit,
productsServices:categories,
centerOnUser:true,
onError:function(){
map.status.notify({
message:'noStoresNearSearchLocation',
closeable:true
});
}});
}else{
}});
}});
jQuery("input[name='storesRegion']").click(function(){
jQuery('div[jsaction="closeControl.click"]').trigger('click');
jQuery('#storesProductsServices').trigger('click');
var searchPlace=jQuery("input[name=storesRegion]:checked").val()
jQuery('input#storeLocator__searchBar').val(searchPlace);
if(searchPlace!=''){
geocoder=new google.maps.Geocoder();
geocoder.geocode({'address':searchPlace,'region':ssf_m_rgn}, function(results, status){
if(status==google.maps.GeocoderStatus.OK){
placeLocation=results[0].geometry.location;
setMainMapMarker(placeLocation, YourSearchLocation+': ' + searchPlace);
var categories=$els.filters.productsServices.filter(':checked').val();
if(typeof categories!=='undefined'&&categories!=''){
categories=categories;
}else{
categories=ssf_default_category;
}
searchForStores({
latLng:placeLocation,
distance:ssf_distance_limit,
productsServices:categories,
centerOnUser:true,
onError:function(){
map.status.notify({
message:'noStoresNearSearchLocation',
closeable:true
});
}});
}else{
}});
}});
jQuery(document).on({
'DOMNodeInserted': function(){
jQuery('.pac-item, .pac-item span', this).addClass('needsclick');
}}, '.pac-container');
}
function setupEventHandlers(){
geolocator.$el.on('click', function(e){
e.preventDefault();
jQuery('div[jsaction="closeControl.click"]').trigger('click');
if(!jQuery(this).hasClass('is-loading')){
geolocator.watch();
}});
jQuery('#filterOptionsClearer').on('click', function(e){
e.preventDefault();
jQuery('.icon--radio-btn').removeClass('is-checked');
jQuery.each($els.filters, function(key, value){
if(typeof value!=='object'||!value instanceof jQuery) return;
value.prop('checked', false).inputify('refresh');
});
});
jQuery('#filterShowAll').on('click', function(e){
e.preventDefault();
$filterPanel.data('filter-popup').conceal();
searchForStores();
});
jQuery('#applyFilterOptions').on('click', function(e){
var filterProps={
latLng:(map.markers.user.self)
? map.markers.user.self.position
: undefined,
state:$els.filters.states.filter(':checked').val(),
country:$els.filters.countryVal.filter(':checked').val(),
productsServices:$els.filters.productsServices.filter(':checked').val(),
onError:function(){
map.status.notify({
message:'noStoresFromFilter',
closeable:true
});
}};
if(typeof filterProps.country==='undefined'){
jQuery.extend(filterProps, {
distance:ssf_distance_limit,
centerOnUser:true
});
}
searchForStores(filterProps);
});
$els.mobileStoreLocatorInfobox.self.find('.infobox__closer').on('click', function(e){
e.preventDefault();
$els.mobileStoreLocatorInfobox.self.removeClass('is-shown');
});
$els.storeList.on('click', '.store-locator__infobox', function(e){
e.preventDefault();
setCurrentStoreDetails(jQuery(this));
});
map.status.$closer.on('click', function(e){
e.preventDefault();
map.status.conceal();
});
$els.storeList.on('click', 'a', function(e){
e.stopPropagation();
});
}
function makeStoreDetailsString($storeXMLElem, index, useLabel){
if(typeof ssf_data_source==='undefined'||ssf_data_source=='false'){
var _store={
lat:getText($storeXMLElem.find('latitude')),
lng:getText($storeXMLElem.find('longitude')),
storeimage:getText($storeXMLElem.find('storeimage')),
custmmarker:getText($storeXMLElem.find('custmmarker')),
location:getText($storeXMLElem.find('location')),
address:getText($storeXMLElem.find('address')),
website:getText($storeXMLElem.find('website')),
exturl:getText($storeXMLElem.find('exturl')),
embedvideo:getText($storeXMLElem.find('embedvideo')),
defaultmedia:getText($storeXMLElem.find('defaultmedia')),
email:getText($storeXMLElem.find('email')),
contactus:getText($storeXMLElem.find('contactus')),
telephone:getText($storeXMLElem.find('telephone')),
fax:getText($storeXMLElem.find('fax')),
description:getText($storeXMLElem.find('description')),
operatingHours:getText($storeXMLElem.find('operatingHours')),
zip:getText($storeXMLElem.find('zip')),
state:getText($storeXMLElem.find('state')),
productsServices:getText($storeXMLElem.find('productsServices'))
};}else{
var _store={
lat:$storeXMLElem.latitude,
lng:$storeXMLElem.longitude,
storeimage:$storeXMLElem.storeimage,
custmmarker:$storeXMLElem.custmmarker,
location:$storeXMLElem.location,
address:$storeXMLElem.address,
website:$storeXMLElem.website,
exturl:$storeXMLElem.exturl,
embedvideo:$storeXMLElem.embedvideo,
defaultmedia:$storeXMLElem.defaultmedia,
email:$storeXMLElem.email,
contactus:$storeXMLElem.contactus,
telephone:$storeXMLElem.telephone,
fax:$storeXMLElem.fax,
description:$storeXMLElem.description,
operatingHours:$storeXMLElem.operatingHours,
zip:$storeXMLElem.zip,
state:$storeXMLElem.state,
productsServices:$storeXMLElem.productsServices
};}
var  letter='',
clearClass='',
getDirections='<div class="infobox__row infobox__cta">&nbsp;</div>';
getStreetView='<div class="infobox__row infobox__stv">&nbsp;</div>';
if(_store.lat&&_store.lng){
letter=translateIntoLetter(index);
getDirections=[
'<a href="https://maps.google.com/maps?',
(map.markers.user.self)
? 'saddr=' + map.markers.user.self.getPosition() + '&'
: '',
'daddr=(', _store.lat, ', ', _store.lng, ')"',
' target="new"',
' class="infobox__row infobox__cta ssflinks">',
ssf_wp_direction_label,
'</a>'
].join('');
getStreetView=[
'<a href="javascript:streetView(',_store.lat, ', ', _store.lng, ')"',
' class="infobox__row infobox__stv">',
ssf_wp_streetview_label,
'</a>'
].join('');
}
if(index!==0&&index % 3===0){
clearClass +=' medium-clear-left';
}
var ext_url;
var ext_url_link;
if(_store.exturl!=''&&_store.exturl!=undefined){
ext_url="<div class='btn-super-info'>"+ ssf_wp_ext_url_label +"</div>";
}else{
ext_url='';
}
var ssf_image_video='';
var ssf_image_image='';
if(ssf_show_image_list=='showboth'&&_store.defaultmedia=='video'&&_store.embedvideo!=''){
ssf_image_video=base64.decode(_store.embedvideo);
}
else if(ssf_show_image_list=='showboth'&&_store.defaultmedia!='video'){
ssf_image_image=(_store.storeimage!='')? _store.storeimage:ssf_wp_base+'/images/NoImage.png';
}
if(ssf_tel_fax_link=='true'){
if(_store.telephone!=''){
_store.telephone='<a href="tel:'+ _store.telephone+'">'+ _store.telephone+'</a>';
}
if(_store.fax!=''){
_store.fax='<a href="tel:'+ _store.fax+'">'+ _store.fax+'</a>';
}}
return [
'<div class="medium-4', clearClass, ' ssf-column">',
'<div class="store-locator__infobox" id="store', index, '">',
'<div class="infobox__row infobox__row--marker">',
'<div class="infobox__marker', (letter.length > 1) ? ' infobox__marker--small':'', '">',
letter,
'</div>',
'</div>',
'<div class="infobox__body">',
'<div class="infobox__title ssf_image_setting" style="background-image: url(',ssf_image_image,');">',
ssf_image_video,
'</div>',
'<div class="infobox__row infobox__title   store-image"  style="display:none;">',
_store.storeimage,
'</div>',
'<div class="infobox__row infobox__title   store-location">',
_store.location,
'</div>',
'<div class="infobox__row   store-address">',
_store.address,
'</div>',
'<div class="infobox__row store-products-services">',
_store.productsServices ,
'</div>',
'<div class="infobox__row   store-website" style="display:none;"><a target="new" href="',_store.website.replace(/(http:\/\/)\1/, '$1'),'">',
_store.website,
'</a></div>',
'<div class="infobox__row   store-exturl" style="display:none;"><a ',((ssf_wp_exturl_link=='true') ? "target='new'":""),'  href="',_store.exturl.replace(/(http:\/\/)\1/, '$1'),'">',
ext_url,
'</a></div>',
'<div class="infobox__row   store-email" style="display:none;"><a href="mailto:',_store.email,'">',
_store.email,
'</a></div>',
'<div class="infobox__row   store-tel" style="display:none;">',
_store.telephone,
'</div>',
'<div class="infobox__row   store-fax" style="display:none;">',
_store.fax,
'</div>',
'<div class="infobox__row   store-contactus" style="display:none;">',
_store.contactus,
'</div>',
'<div class="infobox__row   store-description" style="display:none;">',
_store.description,
'</div>',
'<div class="infobox__row   store-embedvideo" style="display:none;">',
_store.embedvideo,
'</div>',
'<div class="infobox__row   store-defaultmedia" style="display:none;">',
_store.defaultmedia,
'</div>',
'<div class="infobox__row   store-custom-marker" style="display:none;">',
_store.custmmarker,
'</div>',
'<div class="infobox__row   store-operating-hours" style="display:none;">',
_store.operatingHours,
'</div>',
'<div class="infobox__row   store-zip" style="display:none;">',
_store.zip,
'</div>',
'<div class="infobox__row   store-state" style="display:none;">',
_store.state,
'</div>',
'</div>',
getDirections,
'<div style="display:none;">',
getStreetView,
'</div>',
'</div>',
'</div>'
].join('');
}
function makeStoreProductsServicesString($storeXMLElem){
var servicesStrArr=[];
jQuery.each(legend, function(tag, copy){
var $service=$storeXMLElem.find(tag);
if(!$service.length) return;
var serviceBoolStr=$service.text().trim();
if(serviceBoolStr!=='true') return;
servicesStrArr.push([
'<li>', copy, '</li>'
].join(''));
});
return servicesStrArr.join('');
}
function searchForStores(settings){
settings=settings||{};
_map=map.self;
if(ssf_wp_map_code!=""&&ssf_wp_map_code!=undefined){
_map.setOptions({styles: ssf_wp_map_code});
}else{
if(style_map_color!=""){
var styles=[
{
stylers: [
{ hue: style_map_color },
{ saturation: 0 },
{ lightness: 50 },
{ gamma: 1 },
]
}
];
_map.setOptions({styles: styles});
}}
geolocator.rest();
map.infobox.self.close();
$els.topHalf.addClass('has-searched');
if(typeof xml.data==='undefined'){
jQuery.ajax({
type: "GET",
url: xml.url,
dataType: "xml",
success: function(data){
xml.data=data;
addStores();
},
error:function(){
hideMapFeedback();
showStatusFeedback(messages.cantGetStoresInfo);
}});
}else{
addStores();
}
function addStores(){
var targetItems,
storesXMLArray=[];
map.markers.stores.current=null;
jQuery('#page_navigation').html('');
while(map.markers.stores.list.length){
map.markers.stores.list.shift().setMap(null);
}
$els.mobileStoreLocatorInfobox.self.removeClass('is-shown');
if(typeof settings.state==='string'&&settings.state!=='default'){
if(typeof ssf_data_source==='undefined'||ssf_data_source=='false'){
targetItems=jQuery(xml.data).find(settings.state).find('item');
}else{
targetItems=jQuery(xml.data.item);
}}else{
if(typeof ssf_data_source==='undefined'||ssf_data_source=='false'){
targetItems=jQuery(xml.data).find('item');
}else{
targetItems=jQuery(xml.data.item);
}}
if(typeof ssf_data_source==='undefined'||ssf_data_source=='false'){
targetItems.each(function(indexs){
var $thisStore=jQuery(this),
storeLatNode=$thisStore.find('latitude'),
storeLngNode=$thisStore.find('longitude'),
storeMrkNode=$thisStore.find('custmmarker').text().trim(),
storeLatLng='nope',
storeDistance='nope';
if(storeLatNode.length&&storeLngNode.length){
storeLatLng=new google.maps.LatLng(parseFloat(storeLatNode.text()), parseFloat(storeLngNode.text()));
storeDistance=(typeof settings.latLng==='undefined') ? 0:distHaversine(settings.latLng, storeLatLng);
if(typeof settings.distance==='number'
&& storeDistance > settings.distance){
return;
}}else if(!settings.state
|| !$thisStore.parent().is(jQuery.trim(settings.state))){
return;
}
if(typeof settings.country==='string'
&& settings.country!=='default'
&& $thisStore.find('country').text()!==settings.country){
return;
}
if(typeof settings.productsServices==='string'
&& settings.productsServices!=='default'&&settings.productsServices!==''
&& $thisStore.find(settings.productsServices).text()!=='true'){
return;
}
if(storeLatLng!=='nope'){
map.markers.stores.list.push({
latLng:storeLatLng,
distance:storeDistance,
sortord:$thisStore.find('sortord').text().trim(),
storeMNode:storeMrkNode,
storeLocation:$thisStore.find('location').text().trim()
})
}
storesXMLArray.push({
'$xml':$thisStore,
distance:storeDistance,
sortord:$thisStore.find('sortord').text().trim()
});
});
}else{
jQuery(targetItems).each(function (indexes){
var $thisStore=this;
var storeLatNode=$thisStore.latitude,
storeLngNode=$thisStore.longitude,
storeMrkNode=$thisStore.custmmarker,
storeLatLng='nope',
storeDistance='nope';
if(storeLatNode.length&&storeLngNode.length){
storeLatLng=new google.maps.LatLng(parseFloat(storeLatNode), parseFloat(storeLngNode));
storeDistance=(typeof settings.latLng==='undefined') ? 0:distHaversine(settings.latLng, storeLatLng);
if(typeof settings.distance==='number'
&& storeDistance > settings.distance){
return;
}}else if(!settings.state
|| !$thisStore.parent().is(jQuery.trim(settings.state))){
return;
}
if(settings.country!==undefined&&settings.country!=='default'&&settings.country!==''&&$thisStore.country!=settings.country){
return;
}
if(settings.productsServices!==undefined&&settings.productsServices!=='default'&&settings.productsServices!==''){
var found=1;
for (var i=0; i < $thisStore.category.length; i++){
if($thisStore.category[i]==settings.productsServices){
found=0;
}}
if(found!=0){
return;
}}
if(storeLatLng!=='nope'){
map.markers.stores.list.push({
latLng:storeLatLng,
distance:storeDistance,
sortord:$thisStore.sortord,
storeMNode:storeMrkNode,
storeLocation:$thisStore.location
})
}
storesXMLArray.push({
'$xml':$thisStore,
distance:storeDistance,
sortord:$thisStore.sortord
});
});
}
if(!storesXMLArray.length){
var errorMessage=map.status.messages[settings.errorMessage]||settings.errorMessage;
if(typeof settings.onError==='function') settings.onError('noResults');
$els.storeList.html('<div class="text-large text-center">' + map.status.messages.noStoresFound + '</div>');
$els.currentStoreCount.text('0');
return;
}
$els.currentStoreCount.text(storesXMLArray.length);
if(settings.distance!==undefined&&settings.distance!==''){
storesXMLArray.sort(distanceAscendingSorter);
map.markers.stores.list.sort(distanceAscendingSorter);
}else{
storesXMLArray.sort(sortordAscendingSorter);
map.markers.stores.list.sort(sortordAscendingSorter);
}
var maximumNumberOfLabels=25,
storesStrArr=[];
for(var i=0, ii=storesXMLArray.length; i < ii; i++){
storesStrArr.push(makeStoreDetailsString(storesXMLArray[i].$xml, i));
}
$els.storeList.html(storesStrArr.join(''));
$els.storeList.heightSyncify({
items:['.infobox__body']
});
map.status.notify({
message:'storesFound',
autoclose: true
});
map.markers.bounds=new google.maps.LatLngBounds();
var markerLabelClass,
markerLabelContent;
for(var j=0, jj=map.markers.stores.list.length; j < jj; j++){
if(labeled_marker=='1'){
markerLabelContent=translateIntoLetter(j);
}else{
markerLabelContent='';
}
if(map.markers.stores.list[j].storeMNode!=''){
customMarkersUrl=map.markers.stores.list[j].storeMNode;
}else{
customMarkersUrl=urls.pathToIcons + urls.pins.regular;
}
markerLabelClass='store-locator__map-pin';
if(j > maximumNumberOfLabels){
markerLabelClass +='  store-locator__map-pin--small';
}else if(j > maximumNumberOfLabels + 9){
markerLabelClass +='  store-locator__map-pin--xsmall';
}
map.markers.bounds.extend(map.markers.stores.list[j].latLng);
map.markers.stores.list[j]=new MarkerWithLabel({
position: map.markers.stores.list[j].latLng,
map: map.self,
title: ssfDecode(map.markers.stores.list[j].storeLocation),
icon: customMarkersUrl,
zIndex: jj-j,
labelContent: markerLabelContent,
labelClass: markerLabelClass,
originalLabelClass: markerLabelClass,
labelInBackground: false
});
map.markers.stores.list[j].originalZIndex=jj-j;
(function(){
var $targetStore=jQuery('#store' + j);
$targetStore.data('storeMarker', map.markers.stores.list[j]);
google.maps.event.addListener(map.markers.stores.list[j], 'click', function(){
setCurrentStoreDetails($targetStore);
});
})();
}
if(storesXMLArray.length===1){
setCurrentStoreDetails(jQuery('#store0'));
}
if(ssf_map_position=='false'){
map.self.fitBounds(map.markers.bounds);
map.self.setZoom(map.self.getZoom());
}
else if(settings.centerOnUser&&ssf_map_position=='true'){
if(zoom_level=='auto'){
map.self.fitBounds(map.markers.bounds);
}
if(typeof map.markers.user.self!=='undefined'){
setMapCenter(map.markers.user.self.position, true);
}}else{
map.self.setCenter(map.markers.bounds.getCenter());
if(zoom_level=='auto'){
map.self.fitBounds(map.markers.bounds);
}
map.self.setZoom(map.self.getZoom());
}
ssf_ifrane_vedio();
if(ssf_pagination>0&&storesXMLArray.length>ssf_pagination){  pagging(ssf_pagination);  }
if(typeof settings.onSuccess==='function') settings.onSuccess();
}}
var imgToggleS=function(v,v2){
jQuery('div .info-img').css('height','150px');
jQuery('div .info-img').css('background-image','url('+v+')');
jQuery('#storeLocatorInfobox').children('div .info-img').click(function(){
showPopup(v,v2);
});
};
var imgToggleH=function(){
jQuery('div .info-img').css('background-image','url("")');
jQuery('#storeLocatorInfobox').children('div .info-img').unbind();
jQuery('div .info-img').css('height','0px');
};
function ssfDecode(txt){
var sp=document.createElement('span');
sp.innerHTML=txt;
return sp.innerHTML.replace("&amp;","&").replace("&gt;",">").replace("&lt;","<").replace("&quot;",'"');
}
jQuery('#modernBrowserConatct').on('click', '#contact-submit', function(){
SendMail(contact_us_email);
})
function setCurrentStoreDetails($targetStoreElem){
setTimeout(function(){
if($targetStoreElem.find('.store-tel').html()==""){
jQuery('#info-tel').css('display','none');
if(jQuery('#info-tel').is(":visible")){
jQuery('#info-tel').css('display','none');
}}else{
jQuery('#info-tel').css('display','block');
}
if($targetStoreElem.find('.store-description').html()==""){
jQuery('#info-description').css('display','none');
}else{
jQuery('#info-description').css('display','block');
}
if($targetStoreElem.find('.store-contactus').html()==""){
jQuery('.store-contact-us').css('display','none');
}else{
jQuery('.store-contact-us').css('display','block');
}
if($targetStoreElem.find('.store-operating-hours').html()==""){
jQuery('.info-operatinghour').css('display','none');
}else{
jQuery('.info-operatinghour').css('display','block');
}
if($targetStoreElem.find('.store-website').html()==""||$targetStoreElem.find('.store-website').html()=='<a target="new" href="http://"></a>'||$targetStoreElem.find('.store-website').html()=='<a target="new" href=""></a>'||$targetStoreElem.find('.store-website').html().indexOf('href=""')!==-1){
jQuery('#info-website').css('display','none');
}else{
jQuery('#info-website').css('display','block');
}
if($targetStoreElem.find('.store-exturl').html()==""||$targetStoreElem.find('.store-exturl').html()=='<a target="new" href="http://"></a>'||$targetStoreElem.find('.store-exturl').html()=='<a target="new" href=""></a>'){
jQuery('#info-exturl').css('display','none');
}else{
jQuery('#info-exturl').css('display','block');
}
if($targetStoreElem.find('.store-email').html()==""||$targetStoreElem.find('.store-email').html()=='<a href="mailto:"></a>'){
jQuery('#info-email').css('display','none');
}else{
jQuery('#info-email').css('display','block');
}
if($targetStoreElem.find('.store-fax').html()==""){
jQuery('#info-fax').css('display','none');
}else{
jQuery('#info-fax').css('display','block');
}
if($targetStoreElem.find('.store-zip').html()==""){
jQuery('#info-zip').css('display','none');
}else{
jQuery('#info-zip').css('display','block');
}
if($targetStoreElem.find('.store-state').html()==""){
jQuery('#info-state').css('display','none');
}else{
jQuery('#info-state').css('display','block');
}
jQuery('.info__toggler').addClass('actives');
jQuery('.info__toggler').removeClass('is-toggled');
jQuery('.info__toggler-contents').removeClass('is-toggled');
},200);
jQuery('div[jsaction="closeControl.click"]').trigger('click');
var _store={
storeimage:$targetStoreElem.find('.store-image').html(),
location:$targetStoreElem.find('.store-location').html(),
custmmarker:$targetStoreElem.find('.store-custom-marker').html(),
address:$targetStoreElem.find('.store-address').html(),
website:$targetStoreElem.find('.store-website').html(),
exturl:$targetStoreElem.find('.store-exturl').html(),
embedvideo:$targetStoreElem.find('.store-embedvideo').html(),
defaultmedia:$targetStoreElem.find('.store-defaultmedia').html(),
email:$targetStoreElem.find('.store-email').html(),
telephone:$targetStoreElem.find('.store-tel').html(),
fax:$targetStoreElem.find('.store-fax').html(),
contactus:$targetStoreElem.find('.store-contactus').html(),
description:$targetStoreElem.find('.store-description').html(),
zip:$targetStoreElem.find('.store-zip').html(),
state:$targetStoreElem.find('.store-state').html(),
operatingHours:$targetStoreElem.find('.store-operating-hours').html(),
productsServices:$targetStoreElem.find('.store-products-services').html(),
directions:$targetStoreElem.find('.infobox__cta').attr('href'),
streetview:$targetStoreElem.find('.infobox__stv').attr('href')
};
var custm='';
var custm=_store.custmmarker;
if(_store.defaultmedia=='image'||_store.defaultmedia==''){
if(_store.storeimage!=''){
var splitstr=_store.storeimage.split("/");
var ori_img=splitstr[splitstr.length-1];
var imgpath='';
for(i=0;i<splitstr.length-1;i++){
imgpath +=splitstr[i]+"/";
}
setTimeout(function(){
jQuery('div .info-img').css('height','150px');
jQuery('div .info-img').html('');
jQuery('#storeLocatorInfobox').children('div .info-img').click(function(){
showPopup(_store.location,imgpath+ori_img);
});
jQuery('.info-img').css('background-image','url('+_store.storeimage+')');
},200);
}else{
jQuery('div .info-img').html('');
jQuery('div .info-img').css('background-image','url("")');
jQuery('#storeLocatorInfobox').children('div .info-img').unbind();
jQuery('div .info-img').css('height','0px');
setTimeout(imgToggleH, 200);
}}else{
if(_store.embedvideo!=''){
var video=base64.decode(_store.embedvideo);
setTimeout(function(){
jQuery('div .info-img').css('background-image','url("")');
jQuery('div .info-img').css('height','250px');
jQuery('div .info-img').html(video);
var jQueryallVideos=jQuery(".ssf-content-section iframe[src^='http']");
jQueryallVideos.each(function(){
jQuery(this)
.data('aspectRatio', this.height / this.width)
.removeAttr('height')
.removeAttr('width');
});
var newWidth="100%";
jQueryallVideos.each(function(){
var jQueryel=jQuery(this);
jQueryel
.width(newWidth)
.height(newWidth);
});
},200);
}else{
jQuery('div .info-img').html('');
jQuery('div .info-img').css('background-image','url("")');
jQuery('#storeLocatorInfobox').children('div .info-img').unbind();
jQuery('div .info-img').css('height','0px');
setTimeout(imgToggleH, 200);
}}
if(_store.contactus!=''){
contact_us_email=_store.contactus;
}
if(typeof(ssf_anatrac)!=='undefined'){
if(ssf_anatrac=='true'){
jQuery.ajax
({
type: "POST",
url: ssf_wp_base + '/tracking.php?t='+d.getTime(),
data: {ssf_wp_trk_store: _store.location},
cache: false,
success: function (html){
}});
}}
if(typeof map.markers.stores.current!=='undefined'
&& map.markers.stores.current!==null){
map.markers.stores.current.set('labelClass', map.markers.stores.current.originalLabelClass);
if(lastid!=''){
map.markers.stores.current.setIcon(lastid);
}else{
map.markers.stores.current.setIcon(urls.pathToIcons + urls.pins.regular);
}
map.markers.stores.current.setZIndex(map.markers.stores.current.originalZIndex);
}
map.markers.stores.current=$targetStoreElem.data('storeMarker');
var thereIsCurrentStore=(typeof map.markers.stores.current!=='undefined'
&& map.markers.stores.current!==null);
if(thereIsCurrentStore){
map.markers.stores.current.set('labelClass', map.markers.stores.current.originalLabelClass + ' is-active');
if(custm!=''){
lastid=custm;
jQuery('.gmnoprint').children('img').unbind();
map.markers.stores.current.setIcon(custm);
}else{
lastid='';
map.markers.stores.current.setIcon(urls.pathToIcons + urls.pins.active); 
}
map.markers.stores.current.setZIndex(999); 
setMapCenter(map.markers.stores.current.position);
}
$els.storeList.find('.store-locator__infobox').removeClass('is-active');
$targetStoreElem.addClass('is-active');
if(isMediumScreen){
if(thereIsCurrentStore){
map.infobox.self.open(map.self, map.markers.stores.current);
}else{
var mapCenter=map.self.getCenter(),
fauxMarker=new google.maps.Marker({
position:mapCenter
});
map.infobox.self.open(map.self, fauxMarker);
}}
var infoboxArray=[$els.storeLocatorInfoBox, $els.mobileStoreLocatorInfobox];
while(infoboxArray.length){
infoboxArray[0].self.toggleClass('store-locator__infobox--no-pointer', !thereIsCurrentStore);
infoboxArray[0].location.html(_store.storeimage);
infoboxArray[0].location.html(_store.location);
infoboxArray[0].address.html(_store.address);
infoboxArray[0].website.html(_store.website);
infoboxArray[0].exturl.html(_store.exturl);
infoboxArray[0].email.html(_store.email);
infoboxArray[0].telephone.html(_store.telephone);
infoboxArray[0].fax.html(_store.fax);
infoboxArray[0].zip.html(_store.zip);
infoboxArray[0].state.html(_store.state);
infoboxArray[0].description.html(_store.description);
infoboxArray[0].operatingHours.html(_store.operatingHours);
infoboxArray[0].productsServices.html(_store.productsServices);
if(_store.directions){
infoboxArray[0].directions.attr('href', _store.directions);
infoboxArray[0].directions.css('display', '');
}else{
infoboxArray[0].directions.hide();
}
if(_store.streetview){
infoboxArray[0].streetview.attr('href', _store.streetview);
infoboxArray[0].streetview.css('display', '');
}else{
infoboxArray[0].streetview.hide();
}
infoboxArray.shift();
}
$els.mobileStoreLocatorInfobox.self.addClass('is-shown');
if(scroll_setting=='0'){
if(isLargeScreen){
jQuery('html, body').animate({scrollTop:jQuery('#mainContent').offset().top-scroll_to_top}, 'fast');
}else if(isMediumScreen||thereIsCurrentStore){
jQuery('html, body').animate({scrollTop:jQuery('#mainContent').offset().top}, 'fast');
}else{
jQuery('html, body').animate({scrollTop:jQuery('#mainContent').offset().top}, 'fast');
}}else if(scroll_setting=='1'){
jQuery("html,body").animate({scrollTop:0}, 'fast');
}}
function setMainMapMarker(latLng, markerTitle){
setMapCenter(latLng, true);
if(typeof map.markers.user.self!=='undefined') map.markers.user.self.setMap(null);
map.markers.user.self=new MarkerWithLabel({
position: latLng,
map: map.self,
animation: google.maps.Animation.DROP,
title: markerTitle,
zIndex: 98,
icon: urls.pathToIcons + urls.pins.skeuomorph
});
google.maps.event.removeListener(map.markers.user.clicker);
map.markers.user.clicker=google.maps.event.addListener(map.markers.user.self, 'click', function(){
setMapCenter(map.markers.user.self.getPosition());
});
}
function setMapCenter(latLng, fitBounds){
_map=map.self;
if(ssf_wp_map_code!=""&&ssf_wp_map_code!=undefined){
_map.setOptions({styles: ssf_wp_map_code});
}else{
if(style_map_color!=""){
var styles=[
{
stylers: [
{ hue: style_map_color },
{ saturation: 0 },
{ lightness: 50 },
{ gamma: 1 },
]
}
];
_map.setOptions({styles: styles});
}}
_map.setCenter(latLng);
if(isLargeScreen&&ssf_pan_by_map=='true') _map.panBy(-100, 0);
if(_map.getZoom() < 13&&fitBounds!==true) _map.setZoom(14);
}
function translateIntoLetter(index){
if(index < 26){
switch(index){
case 0:  return 'A'; break;
case 1:  return 'B'; break;
case 2:  return 'C'; break;
case 3:  return 'D'; break;
case 4:  return 'E'; break;
case 5:  return 'F'; break;
case 6:  return 'G'; break;
case 7:  return 'H'; break;
case 8:  return 'I'; break;
case 9:  return 'J'; break;
case 10: return 'K'; break;
case 11: return 'L'; break;
case 12: return 'M'; break;
case 13: return 'N'; break;
case 14: return 'O'; break;
case 15: return 'P'; break;
case 16: return 'Q'; break;
case 17: return 'R'; break;
case 18: return 'S'; break;
case 19: return 'T'; break;
case 20: return 'U'; break;
case 21: return 'V'; break;
case 22: return 'W'; break;
case 23: return 'X'; break;
case 24: return 'Y'; break;
case 25: return 'Z'; break;
}}else{
return '' + (index-25);
}}
function distanceAscendingSorter(a, b){
var distA=a.distance,
distB=b.distance;
if(distA==='nope') distA=9999999;
if(distB==='nope') distB=9999999;
return (distA - distB);
}
function sortordAscendingSorter(a, b){
var distA=a.sortord,
distB=b.sortord;
if(distA==='nope') distA=9999999;
if(distB==='nope') distB=9999999;
return (distA - distB);
}
function distHaversine(p1, p2){
var R=6371;
var dLat=rad(p2.lat() - p1.lat());
var dLong=rad(p2.lng() - p1.lng());
var a=Math.sin(dLat/2) * Math.sin(dLat/2) +
Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong/2) * Math.sin(dLong/2);
var c=2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
var d=R * c;
return d.toFixed(3);
}
function rad(x){
return x*Math.PI/180;
}
function getText($obj){
if(!$obj.length) return '';
return jQuery.trim($obj.text());
}
function locationNotAvailable(){
map.status.notify({
message:'notAllowedUserLocation',
closeable:true
});
jQuery('<a href="#/" class="inline-space-left inline-space-right">'+ssfContinueAnyway+'</a>')
.appendTo(map.status.$label)
.on('click', function(e){
e.preventDefault();
map.status.conceal();
});
map.status.$label.append('|');
jQuery('<a href="#/" class="inline-space-left inline-space-right">'+ssfShareLocation+'</a>')
.appendTo(map.status.$label)
.on('click', function(e){
e.preventDefault();
geolocator.watch();
});
}};
function setupMapStatus(){
jQuery.extend(map.status, {
notify:function(settings){
var self=this;
clearTimeout(self.timer);
if(settings.message){
var statusMessage=self.messages[settings.message]||settings.message;
self.$label.find('a').off();
self.$label.html(statusMessage);
}
self.$el.toggleClass('is-loading', Boolean(settings.loadingIndicator));
self.$el.toggleClass('is-closeable', Boolean(settings.closeable));
self.reveal();
if(settings.autoclose){
self.timer=setTimeout(function(){
self.conceal();
}, self.duration);
}},
reveal:function(){
var $statusEl=this.$el,
targetHeight;
if($statusEl.hasClass('is-shown')) return;
$statusEl.css('height', 'auto');
targetHeight=$statusEl.height();
$statusEl
.css('height', '')
.addClass('is-shown');
setTimeout(function(){
$statusEl
.off(FE.events.transitionEnd)
.on(FE.events.transitionEnd, function(){
jQuery(this)
.off(FE.events.transitionEnd)
.removeClass('is-transitionable')
.css('height', 'auto');
})
.addClass('is-transitionable')
.css('height', targetHeight + 'px');
}, 5);
},
conceal:function(){
var $statusEl=map.status.$el;
$statusEl
.css('height', $statusEl.height())
.removeClass('is-shown');
setTimeout(function(){
$statusEl
.off(FE.events.transitionEnd)
.on(FE.events.transitionEnd, function(){
jQuery(this)
.off(FE.events.transitionEnd)
.removeClass('is-transitionable');
})
.addClass('is-transitionable')
.css('height', '');
}, 5);
}});
}});
jQuery(".info__toggler").on("click", function(e){
var id=this.id;
if(jQuery('#'+id).hasClass('actives')){
jQuery('.info__toggler').addClass('actives');
jQuery('#'+id).removeClass('actives');
}else{
jQuery('.info__toggler').addClass('actives');
}})
function streetView(lat,lng){
if(scroll_setting=='0'){
jQuery('html, body').animate({scrollTop:jQuery('#mainContent').offset().top-scroll_to_top}, 'fast');
}else if(scroll_setting=='1'){
jQuery("html,body").animate({scrollTop:0}, 'fast');
}
street=new google.maps.StreetViewPanorama(document.getElementById("storeLocatorMap"), {
position: new google.maps.LatLng(lat, lng),
zoomControl: false,
enableCloseButton: true,
addressControl: false,
panControl: true,
linksControl: true
});
}
var base64={};
base64.PADCHAR='=';
base64.ALPHA='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
base64.makeDOMException=function(){
var e, tmp;
try {
return new DOMException(DOMException.INVALID_CHARACTER_ERR);
} catch (tmp){
var ex=new Error("DOM Exception 5");
ex.code=ex.number=5;
ex.name=ex.description="INVALID_CHARACTER_ERR";
ex.toString=function(){ return 'Error: ' + ex.name + ': ' + ex.message; };
return ex;
}}
base64.getbyte64=function(s,i){
var idx=base64.ALPHA.indexOf(s.charAt(i));
if(idx===-1){
throw base64.makeDOMException();
}
return idx;
}
base64.decode=function(s){
s='' + s;
var getbyte64=base64.getbyte64;
var pads, i, b10;
var imax=s.length
if(imax===0){
return s;
}
if(imax % 4!==0){
throw base64.makeDOMException();
}
pads=0
if(s.charAt(imax - 1)===base64.PADCHAR){
pads=1;
if(s.charAt(imax - 2)===base64.PADCHAR){
pads=2;
}
imax -=4;
}
var x=[];
for (i=0; i < imax; i +=4){
b10=(getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) |
(getbyte64(s,i+2) << 6) | getbyte64(s,i+3);
x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
}
switch (pads){
case 1:
b10=(getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12) | (getbyte64(s,i+2) << 6);
x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
break;
case 2:
b10=(getbyte64(s,i) << 18) | (getbyte64(s,i+1) << 12);
x.push(String.fromCharCode(b10 >> 16));
break;
}
return x.join('');
}
base64.getbyte=function(s,i){
var x=s.charCodeAt(i);
if(x > 255){
throw base64.makeDOMException();
}
return x;
}
base64.encode=function(s){
if(arguments.length!==1){
throw new SyntaxError("Not enough arguments");
}
var padchar=base64.PADCHAR;
var alpha=base64.ALPHA;
var getbyte=base64.getbyte;
var i, b10;
var x=[];
s='' + s;
var imax=s.length - s.length % 3;
if(s.length===0){
return s;
}
for (i=0; i < imax; i +=3){
b10=(getbyte(s,i) << 16) | (getbyte(s,i+1) << 8) | getbyte(s,i+2);
x.push(alpha.charAt(b10 >> 18));
x.push(alpha.charAt((b10 >> 12) & 0x3F));
x.push(alpha.charAt((b10 >> 6) & 0x3f));
x.push(alpha.charAt(b10 & 0x3f));
}
switch (s.length - imax){
case 1:
b10=getbyte(s,i) << 16;
x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
padchar + padchar);
break;
case 2:
b10=(getbyte(s,i) << 16) | (getbyte(s,i+1) << 8);
x.push(alpha.charAt(b10 >> 18) + alpha.charAt((b10 >> 12) & 0x3F) +
alpha.charAt((b10 >> 6) & 0x3f) + padchar);
break;
}
return x.join('');
}
function ssf_ifrane_vedio(){
var jQueryallVideos=jQuery(".ssf-content-section iframe[src^='http']");
jQueryallVideos.each(function(){
jQuery(this)
.data('aspectRatio', this.height / this.width)
.removeAttr('height')
.removeAttr('width');
});
var newWidth="100%";
jQueryallVideos.each(function(){
var jQueryel=jQuery(this);
jQueryel
.width(newWidth)
.height(newWidth);
});
}
var number_of_pages;
function pagging(ssf_pagination){
var show_per_page=ssf_pagination;
var number_of_items=jQuery('#storeLocator__storeList').children().size();
number_of_pages=Math.ceil(number_of_items/show_per_page);
jQuery('#current_page').val(0);
jQuery('#show_per_page').val(show_per_page);
jQuery('#storeLocator__currentStoreCount').html(number_of_items);
if(number_of_pages>1){
var navigation_html='<a class="previous_link arrow-toggler-left pagination-btn paginationgrey" id="ssf_previous_link" href="javascript:previous();">&nbsp; &nbsp; '+ssf_prev_label+'</a>';
var current_link=0;
while(number_of_pages > current_link){
navigation_html +='<a class="page_link" style="display:none;" href="javascript:go_to_page(' + current_link +')" longdesc="' + current_link +'">'+ (current_link + 1) +'</a>';
current_link++;
}
navigation_html +='<a class="next_link arrow-toggler-right pagination-btn ssf-button" id="ssf_next_link" href="javascript:next();">'+ssf_next_label+' &nbsp; &nbsp;</a>';
}else{ var navigation_html=''; }
jQuery('#page_navigation').html(navigation_html);
jQuery('#page_navigation .page_link:first').addClass('active_page');
jQuery('#storeLocator__storeList').children().css('display', 'none');
jQuery('#storeLocator__storeList').children().slice(0, show_per_page).css('display', 'block');
}
function previous(){
new_page=parseInt(jQuery('#current_page').val()) - 1;
if(jQuery('.active_page').prev('.page_link').length==true){
go_to_page(new_page);
}}
function next(){
new_page=parseInt(jQuery('#current_page').val()) + 1;
if(jQuery('.active_page').next('.page_link').length==true){
go_to_page(new_page);
}}
function go_to_page(page_num){
var show_per_page=parseInt(jQuery('#show_per_page').val());
if(page_num==number_of_pages-1){
jQuery('#ssf_next_link').addClass('paginationgrey');
jQuery('#ssf_next_link').removeClass('ssf-button');
}else{
jQuery('#ssf_next_link').removeClass('paginationgrey');
jQuery('#ssf_next_link').addClass('ssf-button');
}
if(page_num>0){
jQuery('#ssf_previous_link').removeClass('paginationgrey');
jQuery('#ssf_previous_link').addClass('ssf-button');
}else{
jQuery('#ssf_previous_link').addClass('paginationgrey');
jQuery('#ssf_previous_link').removeClass('ssf-button');
}
start_from=page_num * show_per_page;
end_on=start_from + show_per_page;
jQuery('#storeLocator__storeList').children().css('display', 'none').slice(start_from, end_on).css('display', 'block');
jQuery('.page_link[longdesc=' + page_num +']').addClass('active_page').siblings('.active_page').removeClass('active_page');
jQuery('#current_page').val(page_num);
jQuery('#storeLocator__storeList').heightSyncify({
items:['.infobox__body']
});
if(ssf_pan_by_map=='true'){
jQuery("html,body").animate({scrollTop:jQuery("#storeLocator__storeListRow").offset().top-100}, 'slow');
}else{
jQuery("#super-left-panel").animate({scrollTop:0}, 'slow');
}};
jQuery(document).ready(function(){
var d=new Date();
var $mobile=jQuery('#storeLocatorInfobox .store-tel a');
var $ssfemail=jQuery('#storeLocatorInfobox .store-email a');
jQuery('#storeLocatorInfobox .store-tel,#mobileStoreLocatorInfobox .store-tel').on('click', function(e){
var location=jQuery('.store-locator__infobox--main .store-location').html();
jQuery.ajax({
type: "POST",
url: ssf_wp_base + '/tracking.php?t='+d.getTime(),
data: {ssf_store_name: location},
cache: false,
success: function (html){
}});
});
/*jQuery(document).on('click', $mobile, function(event){
event.stopPropagation();
var location=jQuery('.store-locator__infobox--main .store-location').text();
jQuery.ajax({
type: "POST",
url: ssf_wp_base + '/tracking.php?t='+d.getTime(),
data: {ssf_store_name: location},
cache: false,
success: function (html){
console.log('thanks tel');
}});
});
jQuery(document).on('click', $ssfemail, function(event){
event.stopPropagation();
var location=jQuery('.store-locator__infobox--main .store-location').text();
jQuery.ajax({
type: "POST",
url: ssf_wp_base + '/tracking.php?t='+d.getTime(),
data: {ssf_email_name: location},
cache: false,
success: function (html){
console.log('thanks email');
}});
});
*/
jQuery('#storeLocatorInfobox .store-email, #mobileStoreLocatorInfobox .store-email').on('click', function(e){
var location=jQuery('.store-locator__infobox--main .store-location').html();
jQuery.ajax({
type: "POST",
url: ssf_wp_base + '/tracking.php?t='+d.getTime(),
data: {ssf_email_name: location},
cache: false,
success: function (html){
}});
});
/*
jQuery(document).on('click', '#storeLocator__storeList .store-locator__infobox,.store-locator__map-pin', function(event){
var location=jQuery('.store-locator__infobox--main .store-location').html();
jQuery.ajax({
type: "POST",
url: ssf_wp_base + '/tracking.php?t='+d.getTime(),
data: {ssf_wp_trk_store: location},
cache: false,
success: function (html){
}});
event.preventDefault();
});
*/
var typingTimer;
var doneTypingInterval=3000;
var $input=jQuery('#storeLocator__searchBar');
$input.on('keyup', function (){
clearTimeout(typingTimer);
typingTimer=setTimeout(doneTyping, doneTypingInterval);
});
$input.on('keydown', function (){
clearTimeout(typingTimer);
});
function doneTyping (){
var searchPlace=jQuery('#storeLocator__searchBar').val();
if(searchPlace!=''){
jQuery.ajax({
type: "POST",
url: ssf_wp_base + '/tracking.php?t='+d.getTime(),
data: {ssf_wp_track_add: searchPlace},
cache: false,
success: function (html){
}});
}}
});
document.documentElement.className+=" js_active ",document.documentElement.className+="ontouchstart"in document.documentElement?" vc_mobile ":" vc_desktop ",function(){for(var prefix=["-webkit-","-moz-","-ms-","-o-",""],i=0;i<prefix.length;i++)prefix[i]+"transform"in document.documentElement.style&&(document.documentElement.className+=" vc_transform ")}(),function(){"function"!=typeof window.vc_js&&(window.vc_js=function(){"use strict";vc_toggleBehaviour(),vc_tabsBehaviour(),vc_accordionBehaviour(),vc_teaserGrid(),vc_carouselBehaviour(),vc_slidersBehaviour(),vc_prettyPhoto(),vc_pinterest(),vc_progress_bar(),vc_plugin_flexslider(),vc_gridBehaviour(),vc_rowBehaviour(),vc_prepareHoverBox(),vc_googleMapsPointer(),vc_ttaActivation(),jQuery(document).trigger("vc_js"),window.setTimeout(vc_waypoints,500)}),"function"!=typeof window.vc_plugin_flexslider&&(window.vc_plugin_flexslider=function($parent){($parent?$parent.find(".wpb_flexslider"):jQuery(".wpb_flexslider")).each(function(){var this_element=jQuery(this),sliderTimeout=1e3*parseInt(this_element.attr("data-interval"),10),sliderFx=this_element.attr("data-flex_fx"),slideshow=!0;0==sliderTimeout&&(slideshow=!1),this_element.is(":visible")&&this_element.flexslider({animation:sliderFx,slideshow:slideshow,slideshowSpeed:sliderTimeout,sliderSpeed:800,smoothHeight:!0})})}),"function"!=typeof window.vc_googleplus&&(window.vc_googleplus=function(){0<jQuery(".wpb_googleplus").length&&function(){var po=document.createElement("script");po.type="text/javascript",po.async=!0,po.src="https://apis.google.com/js/plusone.js";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(po,s)}()}),"function"!=typeof window.vc_pinterest&&(window.vc_pinterest=function(){0<jQuery(".wpb_pinterest").length&&function(){var po=document.createElement("script");po.type="text/javascript",po.async=!0,po.src="https://assets.pinterest.com/js/pinit.js";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(po,s)}()}),"function"!=typeof window.vc_progress_bar&&(window.vc_progress_bar=function(){void 0!==jQuery.fn.vcwaypoint&&jQuery(".vc_progress_bar").each(function(){var $el=jQuery(this);$el.vcwaypoint(function(){$el.find(".vc_single_bar").each(function(index){var bar=jQuery(this).find(".vc_bar"),val=bar.data("percentage-value");setTimeout(function(){bar.css({width:val+"%"})},200*index)})},{offset:"85%"})})}),"function"!=typeof window.vc_waypoints&&(window.vc_waypoints=function(){void 0!==jQuery.fn.vcwaypoint&&jQuery(".wpb_animate_when_almost_visible:not(.wpb_start_animation)").each(function(){var $el=jQuery(this);$el.vcwaypoint(function(){$el.addClass("wpb_start_animation animated")},{offset:"85%"})})}),"function"!=typeof window.vc_toggleBehaviour&&(window.vc_toggleBehaviour=function($el){function event(e){e&&e.preventDefault&&e.preventDefault();var element=jQuery(this).closest(".vc_toggle"),content=element.find(".vc_toggle_content");element.hasClass("vc_toggle_active")?content.slideUp({duration:300,complete:function(){element.removeClass("vc_toggle_active")}}):content.slideDown({duration:300,complete:function(){element.addClass("vc_toggle_active")}})}$el?$el.hasClass("vc_toggle_title")?$el.unbind("click").on("click",event):$el.find(".vc_toggle_title").off("click").on("click",event):jQuery(".vc_toggle_title").off("click").on("click",event)}),"function"!=typeof window.vc_tabsBehaviour&&(window.vc_tabsBehaviour=function($tab){if(jQuery.ui){var $call=$tab||jQuery(".wpb_tabs, .wpb_tour"),ver=jQuery.ui&&jQuery.ui.version?jQuery.ui.version.split("."):"1.10",old_version=1===parseInt(ver[0],10)&&parseInt(ver[1],10)<9;$call.each(function(index){var $tabs,interval=jQuery(this).attr("data-interval"),tabs_array=[];if($tabs=jQuery(this).find(".wpb_tour_tabs_wrapper").tabs({show:function(event,ui){wpb_prepare_tab_content(event,ui)},activate:function(event,ui){wpb_prepare_tab_content(event,ui)}}),interval&&0<interval)try{$tabs.tabs("rotate",1e3*interval)}catch(err){window.console&&window.console.warn&&console.warn("tabs behaviours error",err)}jQuery(this).find(".wpb_tab").each(function(){tabs_array.push(this.id)}),jQuery(this).find(".wpb_tabs_nav li").on("click",function(e){return e&&e.preventDefault&&e.preventDefault(),old_version?$tabs.tabs("select",jQuery("a",this).attr("href")):$tabs.tabs("option","active",jQuery(this).index()),!1}),jQuery(this).find(".wpb_prev_slide a, .wpb_next_slide a").on("click",function(e){var index,length;e&&e.preventDefault&&e.preventDefault(),old_version?(index=$tabs.tabs("option","selected"),jQuery(this).parent().hasClass("wpb_next_slide")?index++:index--,index<0?index=$tabs.tabs("length")-1:index>=$tabs.tabs("length")&&(index=0),$tabs.tabs("select",index)):(index=$tabs.tabs("option","active"),length=$tabs.find(".wpb_tab").length,index=jQuery(this).parent().hasClass("wpb_next_slide")?length<=index+1?0:index+1:index-1<0?length-1:index-1,$tabs.tabs("option","active",index))})})}}),"function"!=typeof window.vc_accordionBehaviour&&(window.vc_accordionBehaviour=function(){jQuery(".wpb_accordion").each(function(index){var $tabs,active_tab,collapsible,$this=jQuery(this);$this.attr("data-interval"),collapsible=!1===(active_tab=!isNaN(jQuery(this).data("active-tab"))&&0<parseInt($this.data("active-tab"),10)&&parseInt($this.data("active-tab"),10)-1)||"yes"===$this.data("collapsible"),$tabs=$this.find(".wpb_accordion_wrapper").accordion({header:"> div > h3",autoHeight:!1,heightStyle:"content",active:active_tab,collapsible:collapsible,navigation:!0,activate:vc_accordionActivate,change:function(event,ui){void 0!==jQuery.fn.isotope&&ui.newContent.find(".isotope").isotope("layout"),vc_carouselBehaviour(ui.newPanel)}}),!0===$this.data("vcDisableKeydown")&&($tabs.data("uiAccordion")._keydown=function(){})})}),"function"!=typeof window.vc_teaserGrid&&(window.vc_teaserGrid=function(){var layout_modes={fitrows:"fitRows",masonry:"masonry"};jQuery(".wpb_grid .teaser_grid_container:not(.wpb_carousel), .wpb_filtered_grid .teaser_grid_container:not(.wpb_carousel)").each(function(){var $container=jQuery(this),$thumbs=$container.find(".wpb_thumbnails"),layout_mode=$thumbs.attr("data-layout-mode");$thumbs.isotope({itemSelector:".isotope-item",layoutMode:void 0===layout_modes[layout_mode]?"fitRows":layout_modes[layout_mode]}),$container.find(".categories_filter a").data("isotope",$thumbs).on("click",function(e){e&&e.preventDefault&&e.preventDefault();var $thumbs=jQuery(this).data("isotope");jQuery(this).parent().parent().find(".active").removeClass("active"),jQuery(this).parent().addClass("active"),$thumbs.isotope({filter:jQuery(this).attr("data-filter")})}),jQuery(window).bind("load resize",function(){$thumbs.isotope("layout")})})}),"function"!=typeof window.vc_carouselBehaviour&&(window.vc_carouselBehaviour=function($parent){($parent?$parent.find(".wpb_carousel"):jQuery(".wpb_carousel")).each(function(){var $this=jQuery(this);if(!0!==$this.data("carousel_enabled")&&$this.is(":visible")){$this.data("carousel_enabled",!0);getColumnsCount(jQuery(this));jQuery(this).hasClass("columns_count_1")&&0;var carousel_li=jQuery(this).find(".wpb_thumbnails-fluid li");carousel_li.css({"margin-right":carousel_li.css("margin-left"),"margin-left":0});var fluid_ul=jQuery(this).find("ul.wpb_thumbnails-fluid");fluid_ul.width(fluid_ul.width()+300),jQuery(window).on("resize",function(){screen_size!=(screen_size=getSizeName())&&window.setTimeout(function(){location.reload()},20)})}})}),"function"!=typeof window.vc_slidersBehaviour&&(window.vc_slidersBehaviour=function(){jQuery(".wpb_gallery_slides").each(function(index){var $imagesGrid,this_element=jQuery(this);if(this_element.hasClass("wpb_slider_nivo")){var sliderTimeout=1e3*this_element.attr("data-interval");0===sliderTimeout&&(sliderTimeout=9999999999),this_element.find(".nivoSlider").nivoSlider({effect:"boxRainGrow,boxRain,boxRainReverse,boxRainGrowReverse",slices:15,boxCols:8,boxRows:4,animSpeed:800,pauseTime:sliderTimeout,startSlide:0,directionNav:!0,directionNavHide:!0,controlNav:!0,keyboardNav:!1,pauseOnHover:!0,manualAdvance:!1,prevText:"Prev",nextText:"Next"})}else this_element.hasClass("wpb_image_grid")&&(jQuery.fn.imagesLoaded?$imagesGrid=this_element.find(".wpb_image_grid_ul").imagesLoaded(function(){$imagesGrid.isotope({itemSelector:".isotope-item",layoutMode:"fitRows"})}):this_element.find(".wpb_image_grid_ul").isotope({itemSelector:".isotope-item",layoutMode:"fitRows"}))})}),"function"!=typeof window.vc_prettyPhoto&&(window.vc_prettyPhoto=function(){try{jQuery&&jQuery.fn&&jQuery.fn.prettyPhoto&&jQuery('a.prettyphoto, .gallery-icon a[href*=".jpg"]').prettyPhoto({animationSpeed:"normal",hook:"data-rel",padding:15,opacity:.7,showTitle:!0,allowresize:!0,counter_separator_label:"/",hideflash:!1,deeplinking:!1,modal:!1,callback:function(){-1<location.href.indexOf("#!prettyPhoto")&&(location.hash="")},social_tools:""})}catch(err){window.console&&window.console.warn&&window.console.warn("vc_prettyPhoto initialize error",err)}}),"function"!=typeof window.vc_google_fonts&&(window.vc_google_fonts=function(){return window.console&&window.console.warn&&window.console.warn("function vc_google_fonts is deprecated, no need to use it"),!1}),window.vcParallaxSkroll=!1,"function"!=typeof window.vc_rowBehaviour&&(window.vc_rowBehaviour=function(){var vcSkrollrOptions,callSkrollInit,$=window.jQuery;function fullWidthRow(){var $elements=$('[data-vc-full-width="true"]');$.each($elements,function(key,item){var $el=$(this);$el.addClass("vc_hidden");var $el_full=$el.next(".vc_row-full-width");if($el_full.length||($el_full=$el.parent().next(".vc_row-full-width")),$el_full.length){var padding,paddingRight,el_margin_left=parseInt($el.css("margin-left"),10),el_margin_right=parseInt($el.css("margin-right"),10),offset=0-$el_full.offset().left-el_margin_left,width=$(window).width();if("rtl"===$el.css("direction")&&(offset-=$el_full.width(),offset+=width,offset+=el_margin_left,offset+=el_margin_right),$el.css({position:"relative",left:offset,"box-sizing":"border-box",width:width}),!$el.data("vcStretchContent"))"rtl"===$el.css("direction")?((padding=offset)<0&&(padding=0),(paddingRight=offset)<0&&(paddingRight=0)):((padding=-1*offset)<0&&(padding=0),(paddingRight=width-padding-$el_full.width()+el_margin_left+el_margin_right)<0&&(paddingRight=0)),$el.css({"padding-left":padding+"px","padding-right":paddingRight+"px"});$el.attr("data-vc-full-width-init","true"),$el.removeClass("vc_hidden"),$(document).trigger("vc-full-width-row-single",{el:$el,offset:offset,marginLeft:el_margin_left,marginRight:el_margin_right,elFull:$el_full,width:width})}}),$(document).trigger("vc-full-width-row",$elements)}function fullHeightRow(){var windowHeight,offsetTop,fullHeight,$element=$(".vc_row-o-full-height:first");$element.length&&(windowHeight=$(window).height(),(offsetTop=$element.offset().top)<windowHeight&&(fullHeight=100-offsetTop/(windowHeight/100),$element.css("min-height",fullHeight+"vh")));$(document).trigger("vc-full-height-row",$element)}$(window).off("resize.vcRowBehaviour").on("resize.vcRowBehaviour",fullWidthRow).on("resize.vcRowBehaviour",fullHeightRow),fullWidthRow(),fullHeightRow(),(0<window.navigator.userAgent.indexOf("MSIE ")||navigator.userAgent.match(/Trident.*rv\:11\./))&&$(".vc_row-o-full-height").each(function(){"flex"===$(this).css("display")&&$(this).wrap('<div class="vc_ie-flexbox-fixer"></div>')}),vc_initVideoBackgrounds(),callSkrollInit=!1,window.vcParallaxSkroll&&window.vcParallaxSkroll.destroy(),$(".vc_parallax-inner").remove(),$("[data-5p-top-bottom]").removeAttr("data-5p-top-bottom data-30p-top-bottom"),$("[data-vc-parallax]").each(function(){var skrollrSize,skrollrStart,$parallaxElement,parallaxImage,youtubeId;callSkrollInit=!0,"on"===$(this).data("vcParallaxOFade")&&$(this).children().attr("data-5p-top-bottom","opacity:0;").attr("data-30p-top-bottom","opacity:1;"),skrollrSize=100*$(this).data("vcParallax"),($parallaxElement=$("<div />").addClass("vc_parallax-inner").appendTo($(this))).height(skrollrSize+"%"),parallaxImage=$(this).data("vcParallaxImage"),(youtubeId=vcExtractYoutubeId(parallaxImage))?insertYoutubeVideoAsBackground($parallaxElement,youtubeId):void 0!==parallaxImage&&$parallaxElement.css("background-image","url("+parallaxImage+")"),skrollrStart=-(skrollrSize-100),$parallaxElement.attr("data-bottom-top","top: "+skrollrStart+"%;").attr("data-top-bottom","top: 0%;")}),callSkrollInit&&window.skrollr&&(vcSkrollrOptions={forceHeight:!1,smoothScrolling:!1,mobileCheck:function(){return!1}},window.vcParallaxSkroll=skrollr.init(vcSkrollrOptions),window.vcParallaxSkroll)}),"function"!=typeof window.vc_gridBehaviour&&(window.vc_gridBehaviour=function(){jQuery.fn.vcGrid&&jQuery("[data-vc-grid]").vcGrid()}),"function"!=typeof window.getColumnsCount&&(window.getColumnsCount=function(el){for(var find=!1,i=1;!1===find;){if(el.hasClass("columns_count_"+i))return find=!0,i;i++}});var screen_size=getSizeName();function getSizeName(){var screen_w=jQuery(window).width();return 1170<screen_w?"desktop_wide":960<screen_w&&screen_w<1169?"desktop":768<screen_w&&screen_w<959?"tablet":300<screen_w&&screen_w<767?"mobile":screen_w<300?"mobile_portrait":""}"function"!=typeof window.wpb_prepare_tab_content&&(window.wpb_prepare_tab_content=function(event,ui){var $ui_panel,$google_maps,panel=ui.panel||ui.newPanel,$pie_charts=panel.find(".vc_pie_chart:not(.vc_ready)"),$round_charts=panel.find(".vc_round-chart"),$line_charts=panel.find(".vc_line-chart"),$carousel=panel.find('[data-ride="vc_carousel"]');if(vc_carouselBehaviour(),vc_plugin_flexslider(panel),ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").length&&ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function(){var grid=jQuery(this).data("vcGrid");grid&&grid.gridBuilder&&grid.gridBuilder.setMasonry&&grid.gridBuilder.setMasonry()}),panel.find(".vc_masonry_media_grid, .vc_masonry_grid").length&&panel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function(){var grid=jQuery(this).data("vcGrid");grid&&grid.gridBuilder&&grid.gridBuilder.setMasonry&&grid.gridBuilder.setMasonry()}),$pie_charts.length&&jQuery.fn.vcChat&&$pie_charts.vcChat(),$round_charts.length&&jQuery.fn.vcRoundChart&&$round_charts.vcRoundChart({reload:!1}),$line_charts.length&&jQuery.fn.vcLineChart&&$line_charts.vcLineChart({reload:!1}),$carousel.length&&jQuery.fn.carousel&&$carousel.carousel("resizeAction"),$ui_panel=panel.find(".isotope, .wpb_image_grid_ul"),$google_maps=panel.find(".wpb_gmaps_widget"),0<$ui_panel.length&&$ui_panel.isotope("layout"),$google_maps.length&&!$google_maps.is(".map_ready")){var $frame=$google_maps.find("iframe");$frame.attr("src",$frame.attr("src")),$google_maps.addClass("map_ready")}panel.parents(".isotope").length&&panel.parents(".isotope").each(function(){jQuery(this).isotope("layout")})}),"function"!=typeof window.vc_ttaActivation&&(window.vc_ttaActivation=function(){jQuery("[data-vc-accordion]").on("show.vc.accordion",function(e){var $=window.jQuery,ui={};ui.newPanel=$(this).data("vc.accordion").getTarget(),window.wpb_prepare_tab_content(e,ui)})}),"function"!=typeof window.vc_accordionActivate&&(window.vc_accordionActivate=function(event,ui){if(ui.newPanel.length&&ui.newHeader.length){var $pie_charts=ui.newPanel.find(".vc_pie_chart:not(.vc_ready)"),$round_charts=ui.newPanel.find(".vc_round-chart"),$line_charts=ui.newPanel.find(".vc_line-chart"),$carousel=ui.newPanel.find('[data-ride="vc_carousel"]');void 0!==jQuery.fn.isotope&&ui.newPanel.find(".isotope, .wpb_image_grid_ul").isotope("layout"),ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").length&&ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function(){var grid=jQuery(this).data("vcGrid");grid&&grid.gridBuilder&&grid.gridBuilder.setMasonry&&grid.gridBuilder.setMasonry()}),vc_carouselBehaviour(ui.newPanel),vc_plugin_flexslider(ui.newPanel),$pie_charts.length&&jQuery.fn.vcChat&&$pie_charts.vcChat(),$round_charts.length&&jQuery.fn.vcRoundChart&&$round_charts.vcRoundChart({reload:!1}),$line_charts.length&&jQuery.fn.vcLineChart&&$line_charts.vcLineChart({reload:!1}),$carousel.length&&jQuery.fn.carousel&&$carousel.carousel("resizeAction"),ui.newPanel.parents(".isotope").length&&ui.newPanel.parents(".isotope").each(function(){jQuery(this).isotope("layout")})}}),"function"!=typeof window.initVideoBackgrounds&&(window.initVideoBackgrounds=function(){return window.console&&window.console.warn&&window.console.warn("this function is deprecated use vc_initVideoBackgrounds"),vc_initVideoBackgrounds()}),"function"!=typeof window.vc_initVideoBackgrounds&&(window.vc_initVideoBackgrounds=function(){jQuery("[data-vc-video-bg]").each(function(){var youtubeUrl,youtubeId,$element=jQuery(this);$element.data("vcVideoBg")?(youtubeUrl=$element.data("vcVideoBg"),(youtubeId=vcExtractYoutubeId(youtubeUrl))&&($element.find(".vc_video-bg").remove(),insertYoutubeVideoAsBackground($element,youtubeId)),jQuery(window).on("grid:items:added",function(event,$grid){$element.has($grid).length&&vcResizeVideoBackground($element)})):$element.find(".vc_video-bg").remove()})}),"function"!=typeof window.insertYoutubeVideoAsBackground&&(window.insertYoutubeVideoAsBackground=function($element,youtubeId,counter){if("undefined"==typeof YT||void 0===YT.Player)return 100<(counter=void 0===counter?0:counter)?void console.warn("Too many attempts to load YouTube api"):void setTimeout(function(){insertYoutubeVideoAsBackground($element,youtubeId,counter++)},100);var $container=$element.prepend('<div class="vc_video-bg vc_hidden-xs"><div class="inner"></div></div>').find(".inner");new YT.Player($container[0],{width:"100%",height:"100%",videoId:youtubeId,playerVars:{playlist:youtubeId,iv_load_policy:3,enablejsapi:1,disablekb:1,autoplay:1,controls:0,showinfo:0,rel:0,loop:1,wmode:"transparent"},events:{onReady:function(event){event.target.mute().setLoop(!0)}}}),vcResizeVideoBackground($element),jQuery(window).bind("resize",function(){vcResizeVideoBackground($element)})}),"function"!=typeof window.vcResizeVideoBackground&&(window.vcResizeVideoBackground=function($element){var iframeW,iframeH,marginLeft,marginTop,containerW=$element.innerWidth(),containerH=$element.innerHeight();containerW/containerH<16/9?(iframeW=containerH*(16/9),iframeH=containerH,marginLeft=-Math.round((iframeW-containerW)/2)+"px",marginTop=-Math.round((iframeH-containerH)/2)+"px"):(iframeH=(iframeW=containerW)*(9/16),marginTop=-Math.round((iframeH-containerH)/2)+"px",marginLeft=-Math.round((iframeW-containerW)/2)+"px"),iframeW+="px",iframeH+="px",$element.find(".vc_video-bg iframe").css({maxWidth:"1000%",marginLeft:marginLeft,marginTop:marginTop,width:iframeW,height:iframeH})}),"function"!=typeof window.vcExtractYoutubeId&&(window.vcExtractYoutubeId=function(url){if(void 0===url)return!1;var id=url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);return null!==id&&id[1]}),"function"!=typeof window.vc_googleMapsPointer&&(window.vc_googleMapsPointer=function(){var $=window.jQuery,$wpbGmapsWidget=$(".wpb_gmaps_widget");$wpbGmapsWidget.on("click",function(){$("iframe",this).css("pointer-events","auto")}),$wpbGmapsWidget.on("mouseleave",function(){$("iframe",this).css("pointer-events","none")}),$(".wpb_gmaps_widget iframe").css("pointer-events","none")}),"function"!=typeof window.vc_setHoverBoxPerspective&&(window.vc_setHoverBoxPerspective=function(hoverBox){hoverBox.each(function(){var $this=jQuery(this),perspective=4*$this.width()+"px";$this.css("perspective",perspective)})}),"function"!=typeof window.vc_setHoverBoxHeight&&(window.vc_setHoverBoxHeight=function(hoverBox){hoverBox.each(function(){var $this=jQuery(this),hoverBoxInner=$this.find(".vc-hoverbox-inner");hoverBoxInner.css("min-height",0);var frontHeight=$this.find(".vc-hoverbox-front-inner").outerHeight(),backHeight=$this.find(".vc-hoverbox-back-inner").outerHeight(),hoverBoxHeight=backHeight<frontHeight?frontHeight:backHeight;hoverBoxHeight<250&&(hoverBoxHeight=250),hoverBoxInner.css("min-height",hoverBoxHeight+"px")})}),"function"!=typeof window.vc_prepareHoverBox&&(window.vc_prepareHoverBox=function(){var hoverBox=jQuery(".vc-hoverbox");vc_setHoverBoxHeight(hoverBox),vc_setHoverBoxPerspective(hoverBox)}),jQuery(document).ready(window.vc_prepareHoverBox),jQuery(window).resize(window.vc_prepareHoverBox),jQuery(document).ready(function($){window.vc_js()})}(window.jQuery);