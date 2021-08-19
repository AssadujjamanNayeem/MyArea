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
document.documentElement.className+=" js_active ",document.documentElement.className+="ontouchstart"in document.documentElement?" vc_mobile ":" vc_desktop ",function(){for(var prefix=["-webkit-","-moz-","-ms-","-o-",""],i=0;i<prefix.length;i++)prefix[i]+"transform"in document.documentElement.style&&(document.documentElement.className+=" vc_transform ")}(),function(){"function"!=typeof window.vc_js&&(window.vc_js=function(){"use strict";vc_toggleBehaviour(),vc_tabsBehaviour(),vc_accordionBehaviour(),vc_teaserGrid(),vc_carouselBehaviour(),vc_slidersBehaviour(),vc_prettyPhoto(),vc_pinterest(),vc_progress_bar(),vc_plugin_flexslider(),vc_gridBehaviour(),vc_rowBehaviour(),vc_prepareHoverBox(),vc_googleMapsPointer(),vc_ttaActivation(),jQuery(document).trigger("vc_js"),window.setTimeout(vc_waypoints,500)}),"function"!=typeof window.vc_plugin_flexslider&&(window.vc_plugin_flexslider=function($parent){($parent?$parent.find(".wpb_flexslider"):jQuery(".wpb_flexslider")).each(function(){var this_element=jQuery(this),sliderTimeout=1e3*parseInt(this_element.attr("data-interval"),10),sliderFx=this_element.attr("data-flex_fx"),slideshow=!0;0==sliderTimeout&&(slideshow=!1),this_element.is(":visible")&&this_element.flexslider({animation:sliderFx,slideshow:slideshow,slideshowSpeed:sliderTimeout,sliderSpeed:800,smoothHeight:!0})})}),"function"!=typeof window.vc_googleplus&&(window.vc_googleplus=function(){0<jQuery(".wpb_googleplus").length&&function(){var po=document.createElement("script");po.type="text/javascript",po.async=!0,po.src="https://apis.google.com/js/plusone.js";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(po,s)}()}),"function"!=typeof window.vc_pinterest&&(window.vc_pinterest=function(){0<jQuery(".wpb_pinterest").length&&function(){var po=document.createElement("script");po.type="text/javascript",po.async=!0,po.src="https://assets.pinterest.com/js/pinit.js";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(po,s)}()}),"function"!=typeof window.vc_progress_bar&&(window.vc_progress_bar=function(){void 0!==jQuery.fn.vcwaypoint&&jQuery(".vc_progress_bar").each(function(){var $el=jQuery(this);$el.vcwaypoint(function(){$el.find(".vc_single_bar").each(function(index){var bar=jQuery(this).find(".vc_bar"),val=bar.data("percentage-value");setTimeout(function(){bar.css({width:val+"%"})},200*index)})},{offset:"85%"})})}),"function"!=typeof window.vc_waypoints&&(window.vc_waypoints=function(){void 0!==jQuery.fn.vcwaypoint&&jQuery(".wpb_animate_when_almost_visible:not(.wpb_start_animation)").each(function(){var $el=jQuery(this);$el.vcwaypoint(function(){$el.addClass("wpb_start_animation animated")},{offset:"85%"})})}),"function"!=typeof window.vc_toggleBehaviour&&(window.vc_toggleBehaviour=function($el){function event(e){e&&e.preventDefault&&e.preventDefault();var element=jQuery(this).closest(".vc_toggle"),content=element.find(".vc_toggle_content");element.hasClass("vc_toggle_active")?content.slideUp({duration:300,complete:function(){element.removeClass("vc_toggle_active")}}):content.slideDown({duration:300,complete:function(){element.addClass("vc_toggle_active")}})}$el?$el.hasClass("vc_toggle_title")?$el.unbind("click").on("click",event):$el.find(".vc_toggle_title").off("click").on("click",event):jQuery(".vc_toggle_title").off("click").on("click",event)}),"function"!=typeof window.vc_tabsBehaviour&&(window.vc_tabsBehaviour=function($tab){if(jQuery.ui){var $call=$tab||jQuery(".wpb_tabs, .wpb_tour"),ver=jQuery.ui&&jQuery.ui.version?jQuery.ui.version.split("."):"1.10",old_version=1===parseInt(ver[0],10)&&parseInt(ver[1],10)<9;$call.each(function(index){var $tabs,interval=jQuery(this).attr("data-interval"),tabs_array=[];if($tabs=jQuery(this).find(".wpb_tour_tabs_wrapper").tabs({show:function(event,ui){wpb_prepare_tab_content(event,ui)},activate:function(event,ui){wpb_prepare_tab_content(event,ui)}}),interval&&0<interval)try{$tabs.tabs("rotate",1e3*interval)}catch(err){window.console&&window.console.warn&&console.warn("tabs behaviours error",err)}jQuery(this).find(".wpb_tab").each(function(){tabs_array.push(this.id)}),jQuery(this).find(".wpb_tabs_nav li").on("click",function(e){return e&&e.preventDefault&&e.preventDefault(),old_version?$tabs.tabs("select",jQuery("a",this).attr("href")):$tabs.tabs("option","active",jQuery(this).index()),!1}),jQuery(this).find(".wpb_prev_slide a, .wpb_next_slide a").on("click",function(e){var index,length;e&&e.preventDefault&&e.preventDefault(),old_version?(index=$tabs.tabs("option","selected"),jQuery(this).parent().hasClass("wpb_next_slide")?index++:index--,index<0?index=$tabs.tabs("length")-1:index>=$tabs.tabs("length")&&(index=0),$tabs.tabs("select",index)):(index=$tabs.tabs("option","active"),length=$tabs.find(".wpb_tab").length,index=jQuery(this).parent().hasClass("wpb_next_slide")?length<=index+1?0:index+1:index-1<0?length-1:index-1,$tabs.tabs("option","active",index))})})}}),"function"!=typeof window.vc_accordionBehaviour&&(window.vc_accordionBehaviour=function(){jQuery(".wpb_accordion").each(function(index){var $tabs,active_tab,collapsible,$this=jQuery(this);$this.attr("data-interval"),collapsible=!1===(active_tab=!isNaN(jQuery(this).data("active-tab"))&&0<parseInt($this.data("active-tab"),10)&&parseInt($this.data("active-tab"),10)-1)||"yes"===$this.data("collapsible"),$tabs=$this.find(".wpb_accordion_wrapper").accordion({header:"> div > h3",autoHeight:!1,heightStyle:"content",active:active_tab,collapsible:collapsible,navigation:!0,activate:vc_accordionActivate,change:function(event,ui){void 0!==jQuery.fn.isotope&&ui.newContent.find(".isotope").isotope("layout"),vc_carouselBehaviour(ui.newPanel)}}),!0===$this.data("vcDisableKeydown")&&($tabs.data("uiAccordion")._keydown=function(){})})}),"function"!=typeof window.vc_teaserGrid&&(window.vc_teaserGrid=function(){var layout_modes={fitrows:"fitRows",masonry:"masonry"};jQuery(".wpb_grid .teaser_grid_container:not(.wpb_carousel), .wpb_filtered_grid .teaser_grid_container:not(.wpb_carousel)").each(function(){var $container=jQuery(this),$thumbs=$container.find(".wpb_thumbnails"),layout_mode=$thumbs.attr("data-layout-mode");$thumbs.isotope({itemSelector:".isotope-item",layoutMode:void 0===layout_modes[layout_mode]?"fitRows":layout_modes[layout_mode]}),$container.find(".categories_filter a").data("isotope",$thumbs).on("click",function(e){e&&e.preventDefault&&e.preventDefault();var $thumbs=jQuery(this).data("isotope");jQuery(this).parent().parent().find(".active").removeClass("active"),jQuery(this).parent().addClass("active"),$thumbs.isotope({filter:jQuery(this).attr("data-filter")})}),jQuery(window).bind("load resize",function(){$thumbs.isotope("layout")})})}),"function"!=typeof window.vc_carouselBehaviour&&(window.vc_carouselBehaviour=function($parent){($parent?$parent.find(".wpb_carousel"):jQuery(".wpb_carousel")).each(function(){var $this=jQuery(this);if(!0!==$this.data("carousel_enabled")&&$this.is(":visible")){$this.data("carousel_enabled",!0);getColumnsCount(jQuery(this));jQuery(this).hasClass("columns_count_1")&&0;var carousel_li=jQuery(this).find(".wpb_thumbnails-fluid li");carousel_li.css({"margin-right":carousel_li.css("margin-left"),"margin-left":0});var fluid_ul=jQuery(this).find("ul.wpb_thumbnails-fluid");fluid_ul.width(fluid_ul.width()+300),jQuery(window).on("resize",function(){screen_size!=(screen_size=getSizeName())&&window.setTimeout(function(){location.reload()},20)})}})}),"function"!=typeof window.vc_slidersBehaviour&&(window.vc_slidersBehaviour=function(){jQuery(".wpb_gallery_slides").each(function(index){var $imagesGrid,this_element=jQuery(this);if(this_element.hasClass("wpb_slider_nivo")){var sliderTimeout=1e3*this_element.attr("data-interval");0===sliderTimeout&&(sliderTimeout=9999999999),this_element.find(".nivoSlider").nivoSlider({effect:"boxRainGrow,boxRain,boxRainReverse,boxRainGrowReverse",slices:15,boxCols:8,boxRows:4,animSpeed:800,pauseTime:sliderTimeout,startSlide:0,directionNav:!0,directionNavHide:!0,controlNav:!0,keyboardNav:!1,pauseOnHover:!0,manualAdvance:!1,prevText:"Prev",nextText:"Next"})}else this_element.hasClass("wpb_image_grid")&&(jQuery.fn.imagesLoaded?$imagesGrid=this_element.find(".wpb_image_grid_ul").imagesLoaded(function(){$imagesGrid.isotope({itemSelector:".isotope-item",layoutMode:"fitRows"})}):this_element.find(".wpb_image_grid_ul").isotope({itemSelector:".isotope-item",layoutMode:"fitRows"}))})}),"function"!=typeof window.vc_prettyPhoto&&(window.vc_prettyPhoto=function(){try{jQuery&&jQuery.fn&&jQuery.fn.prettyPhoto&&jQuery('a.prettyphoto, .gallery-icon a[href*=".jpg"]').prettyPhoto({animationSpeed:"normal",hook:"data-rel",padding:15,opacity:.7,showTitle:!0,allowresize:!0,counter_separator_label:"/",hideflash:!1,deeplinking:!1,modal:!1,callback:function(){-1<location.href.indexOf("#!prettyPhoto")&&(location.hash="")},social_tools:""})}catch(err){window.console&&window.console.warn&&window.console.warn("vc_prettyPhoto initialize error",err)}}),"function"!=typeof window.vc_google_fonts&&(window.vc_google_fonts=function(){return window.console&&window.console.warn&&window.console.warn("function vc_google_fonts is deprecated, no need to use it"),!1}),window.vcParallaxSkroll=!1,"function"!=typeof window.vc_rowBehaviour&&(window.vc_rowBehaviour=function(){var vcSkrollrOptions,callSkrollInit,$=window.jQuery;function fullWidthRow(){var $elements=$('[data-vc-full-width="true"]');$.each($elements,function(key,item){var $el=$(this);$el.addClass("vc_hidden");var $el_full=$el.next(".vc_row-full-width");if($el_full.length||($el_full=$el.parent().next(".vc_row-full-width")),$el_full.length){var padding,paddingRight,el_margin_left=parseInt($el.css("margin-left"),10),el_margin_right=parseInt($el.css("margin-right"),10),offset=0-$el_full.offset().left-el_margin_left,width=$(window).width();if("rtl"===$el.css("direction")&&(offset-=$el_full.width(),offset+=width,offset+=el_margin_left,offset+=el_margin_right),$el.css({position:"relative",left:offset,"box-sizing":"border-box",width:width}),!$el.data("vcStretchContent"))"rtl"===$el.css("direction")?((padding=offset)<0&&(padding=0),(paddingRight=offset)<0&&(paddingRight=0)):((padding=-1*offset)<0&&(padding=0),(paddingRight=width-padding-$el_full.width()+el_margin_left+el_margin_right)<0&&(paddingRight=0)),$el.css({"padding-left":padding+"px","padding-right":paddingRight+"px"});$el.attr("data-vc-full-width-init","true"),$el.removeClass("vc_hidden"),$(document).trigger("vc-full-width-row-single",{el:$el,offset:offset,marginLeft:el_margin_left,marginRight:el_margin_right,elFull:$el_full,width:width})}}),$(document).trigger("vc-full-width-row",$elements)}function fullHeightRow(){var windowHeight,offsetTop,fullHeight,$element=$(".vc_row-o-full-height:first");$element.length&&(windowHeight=$(window).height(),(offsetTop=$element.offset().top)<windowHeight&&(fullHeight=100-offsetTop/(windowHeight/100),$element.css("min-height",fullHeight+"vh")));$(document).trigger("vc-full-height-row",$element)}$(window).off("resize.vcRowBehaviour").on("resize.vcRowBehaviour",fullWidthRow).on("resize.vcRowBehaviour",fullHeightRow),fullWidthRow(),fullHeightRow(),(0<window.navigator.userAgent.indexOf("MSIE ")||navigator.userAgent.match(/Trident.*rv\:11\./))&&$(".vc_row-o-full-height").each(function(){"flex"===$(this).css("display")&&$(this).wrap('<div class="vc_ie-flexbox-fixer"></div>')}),vc_initVideoBackgrounds(),callSkrollInit=!1,window.vcParallaxSkroll&&window.vcParallaxSkroll.destroy(),$(".vc_parallax-inner").remove(),$("[data-5p-top-bottom]").removeAttr("data-5p-top-bottom data-30p-top-bottom"),$("[data-vc-parallax]").each(function(){var skrollrSize,skrollrStart,$parallaxElement,parallaxImage,youtubeId;callSkrollInit=!0,"on"===$(this).data("vcParallaxOFade")&&$(this).children().attr("data-5p-top-bottom","opacity:0;").attr("data-30p-top-bottom","opacity:1;"),skrollrSize=100*$(this).data("vcParallax"),($parallaxElement=$("<div />").addClass("vc_parallax-inner").appendTo($(this))).height(skrollrSize+"%"),parallaxImage=$(this).data("vcParallaxImage"),(youtubeId=vcExtractYoutubeId(parallaxImage))?insertYoutubeVideoAsBackground($parallaxElement,youtubeId):void 0!==parallaxImage&&$parallaxElement.css("background-image","url("+parallaxImage+")"),skrollrStart=-(skrollrSize-100),$parallaxElement.attr("data-bottom-top","top: "+skrollrStart+"%;").attr("data-top-bottom","top: 0%;")}),callSkrollInit&&window.skrollr&&(vcSkrollrOptions={forceHeight:!1,smoothScrolling:!1,mobileCheck:function(){return!1}},window.vcParallaxSkroll=skrollr.init(vcSkrollrOptions),window.vcParallaxSkroll)}),"function"!=typeof window.vc_gridBehaviour&&(window.vc_gridBehaviour=function(){jQuery.fn.vcGrid&&jQuery("[data-vc-grid]").vcGrid()}),"function"!=typeof window.getColumnsCount&&(window.getColumnsCount=function(el){for(var find=!1,i=1;!1===find;){if(el.hasClass("columns_count_"+i))return find=!0,i;i++}});var screen_size=getSizeName();function getSizeName(){var screen_w=jQuery(window).width();return 1170<screen_w?"desktop_wide":960<screen_w&&screen_w<1169?"desktop":768<screen_w&&screen_w<959?"tablet":300<screen_w&&screen_w<767?"mobile":screen_w<300?"mobile_portrait":""}"function"!=typeof window.wpb_prepare_tab_content&&(window.wpb_prepare_tab_content=function(event,ui){var $ui_panel,$google_maps,panel=ui.panel||ui.newPanel,$pie_charts=panel.find(".vc_pie_chart:not(.vc_ready)"),$round_charts=panel.find(".vc_round-chart"),$line_charts=panel.find(".vc_line-chart"),$carousel=panel.find('[data-ride="vc_carousel"]');if(vc_carouselBehaviour(),vc_plugin_flexslider(panel),ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").length&&ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function(){var grid=jQuery(this).data("vcGrid");grid&&grid.gridBuilder&&grid.gridBuilder.setMasonry&&grid.gridBuilder.setMasonry()}),panel.find(".vc_masonry_media_grid, .vc_masonry_grid").length&&panel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function(){var grid=jQuery(this).data("vcGrid");grid&&grid.gridBuilder&&grid.gridBuilder.setMasonry&&grid.gridBuilder.setMasonry()}),$pie_charts.length&&jQuery.fn.vcChat&&$pie_charts.vcChat(),$round_charts.length&&jQuery.fn.vcRoundChart&&$round_charts.vcRoundChart({reload:!1}),$line_charts.length&&jQuery.fn.vcLineChart&&$line_charts.vcLineChart({reload:!1}),$carousel.length&&jQuery.fn.carousel&&$carousel.carousel("resizeAction"),$ui_panel=panel.find(".isotope, .wpb_image_grid_ul"),$google_maps=panel.find(".wpb_gmaps_widget"),0<$ui_panel.length&&$ui_panel.isotope("layout"),$google_maps.length&&!$google_maps.is(".map_ready")){var $frame=$google_maps.find("iframe");$frame.attr("src",$frame.attr("src")),$google_maps.addClass("map_ready")}panel.parents(".isotope").length&&panel.parents(".isotope").each(function(){jQuery(this).isotope("layout")})}),"function"!=typeof window.vc_ttaActivation&&(window.vc_ttaActivation=function(){jQuery("[data-vc-accordion]").on("show.vc.accordion",function(e){var $=window.jQuery,ui={};ui.newPanel=$(this).data("vc.accordion").getTarget(),window.wpb_prepare_tab_content(e,ui)})}),"function"!=typeof window.vc_accordionActivate&&(window.vc_accordionActivate=function(event,ui){if(ui.newPanel.length&&ui.newHeader.length){var $pie_charts=ui.newPanel.find(".vc_pie_chart:not(.vc_ready)"),$round_charts=ui.newPanel.find(".vc_round-chart"),$line_charts=ui.newPanel.find(".vc_line-chart"),$carousel=ui.newPanel.find('[data-ride="vc_carousel"]');void 0!==jQuery.fn.isotope&&ui.newPanel.find(".isotope, .wpb_image_grid_ul").isotope("layout"),ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").length&&ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function(){var grid=jQuery(this).data("vcGrid");grid&&grid.gridBuilder&&grid.gridBuilder.setMasonry&&grid.gridBuilder.setMasonry()}),vc_carouselBehaviour(ui.newPanel),vc_plugin_flexslider(ui.newPanel),$pie_charts.length&&jQuery.fn.vcChat&&$pie_charts.vcChat(),$round_charts.length&&jQuery.fn.vcRoundChart&&$round_charts.vcRoundChart({reload:!1}),$line_charts.length&&jQuery.fn.vcLineChart&&$line_charts.vcLineChart({reload:!1}),$carousel.length&&jQuery.fn.carousel&&$carousel.carousel("resizeAction"),ui.newPanel.parents(".isotope").length&&ui.newPanel.parents(".isotope").each(function(){jQuery(this).isotope("layout")})}}),"function"!=typeof window.initVideoBackgrounds&&(window.initVideoBackgrounds=function(){return window.console&&window.console.warn&&window.console.warn("this function is deprecated use vc_initVideoBackgrounds"),vc_initVideoBackgrounds()}),"function"!=typeof window.vc_initVideoBackgrounds&&(window.vc_initVideoBackgrounds=function(){jQuery("[data-vc-video-bg]").each(function(){var youtubeUrl,youtubeId,$element=jQuery(this);$element.data("vcVideoBg")?(youtubeUrl=$element.data("vcVideoBg"),(youtubeId=vcExtractYoutubeId(youtubeUrl))&&($element.find(".vc_video-bg").remove(),insertYoutubeVideoAsBackground($element,youtubeId)),jQuery(window).on("grid:items:added",function(event,$grid){$element.has($grid).length&&vcResizeVideoBackground($element)})):$element.find(".vc_video-bg").remove()})}),"function"!=typeof window.insertYoutubeVideoAsBackground&&(window.insertYoutubeVideoAsBackground=function($element,youtubeId,counter){if("undefined"==typeof YT||void 0===YT.Player)return 100<(counter=void 0===counter?0:counter)?void console.warn("Too many attempts to load YouTube api"):void setTimeout(function(){insertYoutubeVideoAsBackground($element,youtubeId,counter++)},100);var $container=$element.prepend('<div class="vc_video-bg vc_hidden-xs"><div class="inner"></div></div>').find(".inner");new YT.Player($container[0],{width:"100%",height:"100%",videoId:youtubeId,playerVars:{playlist:youtubeId,iv_load_policy:3,enablejsapi:1,disablekb:1,autoplay:1,controls:0,showinfo:0,rel:0,loop:1,wmode:"transparent"},events:{onReady:function(event){event.target.mute().setLoop(!0)}}}),vcResizeVideoBackground($element),jQuery(window).bind("resize",function(){vcResizeVideoBackground($element)})}),"function"!=typeof window.vcResizeVideoBackground&&(window.vcResizeVideoBackground=function($element){var iframeW,iframeH,marginLeft,marginTop,containerW=$element.innerWidth(),containerH=$element.innerHeight();containerW/containerH<16/9?(iframeW=containerH*(16/9),iframeH=containerH,marginLeft=-Math.round((iframeW-containerW)/2)+"px",marginTop=-Math.round((iframeH-containerH)/2)+"px"):(iframeH=(iframeW=containerW)*(9/16),marginTop=-Math.round((iframeH-containerH)/2)+"px",marginLeft=-Math.round((iframeW-containerW)/2)+"px"),iframeW+="px",iframeH+="px",$element.find(".vc_video-bg iframe").css({maxWidth:"1000%",marginLeft:marginLeft,marginTop:marginTop,width:iframeW,height:iframeH})}),"function"!=typeof window.vcExtractYoutubeId&&(window.vcExtractYoutubeId=function(url){if(void 0===url)return!1;var id=url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);return null!==id&&id[1]}),"function"!=typeof window.vc_googleMapsPointer&&(window.vc_googleMapsPointer=function(){var $=window.jQuery,$wpbGmapsWidget=$(".wpb_gmaps_widget");$wpbGmapsWidget.on("click",function(){$("iframe",this).css("pointer-events","auto")}),$wpbGmapsWidget.on("mouseleave",function(){$("iframe",this).css("pointer-events","none")}),$(".wpb_gmaps_widget iframe").css("pointer-events","none")}),"function"!=typeof window.vc_setHoverBoxPerspective&&(window.vc_setHoverBoxPerspective=function(hoverBox){hoverBox.each(function(){var $this=jQuery(this),perspective=4*$this.width()+"px";$this.css("perspective",perspective)})}),"function"!=typeof window.vc_setHoverBoxHeight&&(window.vc_setHoverBoxHeight=function(hoverBox){hoverBox.each(function(){var $this=jQuery(this),hoverBoxInner=$this.find(".vc-hoverbox-inner");hoverBoxInner.css("min-height",0);var frontHeight=$this.find(".vc-hoverbox-front-inner").outerHeight(),backHeight=$this.find(".vc-hoverbox-back-inner").outerHeight(),hoverBoxHeight=backHeight<frontHeight?frontHeight:backHeight;hoverBoxHeight<250&&(hoverBoxHeight=250),hoverBoxInner.css("min-height",hoverBoxHeight+"px")})}),"function"!=typeof window.vc_prepareHoverBox&&(window.vc_prepareHoverBox=function(){var hoverBox=jQuery(".vc-hoverbox");vc_setHoverBoxHeight(hoverBox),vc_setHoverBoxPerspective(hoverBox)}),jQuery(document).ready(window.vc_prepareHoverBox),jQuery(window).resize(window.vc_prepareHoverBox),jQuery(document).ready(function($){window.vc_js()})}(window.jQuery);
!function a(o,s,u){function c(t,e){if(!s[t]){if(!o[t]){var r="function"==typeof require&&require;if(!e&&r)return r(t,!0);if(l)return l(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=s[t]={exports:{}};o[t][0].call(i.exports,function(e){return c(o[t][1][e]||e)},i,i.exports,a,o,s,u)}return s[t].exports}for(var l="function"==typeof require&&require,e=0;e<u.length;e++)c(u[e]);return c}({1:[function(e,t,r){"use strict";var n=window.mc4wp||{},i=e("./forms/forms.js");function a(e,t){i.trigger(t[0].id+"."+e,t),i.trigger(e,t)}function o(e,n){document.addEventListener(e,function(e){if(e.target){var t=e.target,r=!1;"string"==typeof t.className&&(r=-1<t.className.indexOf("mc4wp-form")),r||"function"!=typeof t.matches||(r=t.matches(".mc4wp-form *")),r&&n.call(e,e)}},!0)}if(e("./forms/conditional-elements.js"),o("submit",function(e){var t=i.getByElement(e.target);e.defaultPrevented||i.trigger(t.id+".submit",[t,e]),e.defaultPrevented||i.trigger("submit",[t,e])}),o("focus",function(e){var t=i.getByElement(e.target);t.started||(a("started",[t,e]),t.started=!0)}),o("change",function(e){a("change",[i.getByElement(e.target),e])}),n.listeners){for(var s=n.listeners,u=0;u<s.length;u++)i.on(s[u].event,s[u].callback);delete n.listeners}n.forms=i,window.mc4wp=n},{"./forms/conditional-elements.js":2,"./forms/forms.js":4}],2:[function(e,t,r){"use strict";function n(e){for(var t=!!e.getAttribute("data-show-if"),r=t?e.getAttribute("data-show-if").split(":"):e.getAttribute("data-hide-if").split(":"),n=r[0],i=(1<r.length?r[1]:"*").split("|"),a=function(e,t){for(var r=[],n=e.querySelectorAll('input[name="'+t+'"],select[name="'+t+'"],textarea[name="'+t+'"]'),i=0;i<n.length;i++){var a=n[i];("radio"!==a.type&&"checkbox"!==a.type||a.checked)&&r.push(a.value)}return r}(function(e){for(var t=e;t.parentElement;)if("FORM"===(t=t.parentElement).tagName)return t;return null}(e),n),o=!1,s=0;s<a.length;s++){var u=a[s];if(o=-1<i.indexOf(u)||-1<i.indexOf("*")&&0<u.length)break}e.style.display=t?o?"":"none":o?"none":"";var c=e.querySelectorAll("input,select,textarea");[].forEach.call(c,function(e){(o||t)&&e.getAttribute("data-was-required")&&(e.required=!0,e.removeAttribute("data-was-required")),o&&t||!e.required||(e.setAttribute("data-was-required","true"),e.required=!1)})}function i(){var e=document.querySelectorAll(".mc4wp-form [data-show-if],.mc4wp-form [data-hide-if]");[].forEach.call(e,n)}function a(e){if(e.target&&e.target.form&&!(e.target.form.className.indexOf("mc4wp-form")<0)){var t=e.target.form.querySelectorAll("[data-show-if],[data-hide-if]");[].forEach.call(t,n)}}document.addEventListener("keyup",a,!0),document.addEventListener("change",a,!0),document.addEventListener("mc4wp-refresh",i,!0),window.addEventListener("load",i),i()},{}],3:[function(e,t,r){"use strict";function n(e,t){this.id=e,this.element=t||document.createElement("form"),this.name=this.element.getAttribute("data-name")||"Form #"+this.id,this.errors=[],this.started=!1}var i=e("form-serialize"),a=e("populate.js");n.prototype.setData=function(e){try{a(this.element,e)}catch(e){console.error(e)}},n.prototype.getData=function(){return i(this.element,{hash:!0,empty:!0})},n.prototype.getSerializedData=function(){return i(this.element,{hash:!1,empty:!0})},n.prototype.setResponse=function(e){this.element.querySelector(".mc4wp-response").innerHTML=e},n.prototype.reset=function(){this.setResponse(""),this.element.querySelector(".mc4wp-form-fields").style.display="",this.element.reset()},t.exports=n},{"form-serialize":5,"populate.js":6}],4:[function(e,t,r){"use strict";var n=e("./form.js"),i=[],a={};function o(e,t){a[e]=a[e]||[],a[e].forEach(function(e){return e.apply(null,t)})}function s(e,t){t=t||parseInt(e.getAttribute("data-id"))||0;var r=new n(t,e);return i.push(r),r}t.exports={get:function(e){e=parseInt(e);for(var t=0;t<i.length;t++)if(i[t].id===e)return i[t];return s(document.querySelector(".mc4wp-form-"+e),e)},getByElement:function(e){for(var t=e.form||e,r=0;r<i.length;r++)if(i[r].element===t)return i[r];return s(t)},on:function(e,t){a[e]=a[e]||[],a[e].push(t)},off:function(e,t){a[e]=a[e]||[],a[e]=a[e].filter(function(e){return e!==t})},trigger:function(e,t){"submit"===e||0<e.indexOf(".submit")?o(e,t):window.setTimeout(function(){o(e,t)},1)}}},{"./form.js":3}],5:[function(e,t,r){var v=/^(?:submit|button|image|reset|file)$/i,g=/^(?:input|select|textarea|keygen)/i,i=/(\[[^\[\]]*\])/g;function y(e,t,r){if(t.match(i)){!function e(t,r,n){if(0===r.length)return t=n;var i=r.shift(),a=i.match(/^\[(.+?)\]$/);if("[]"===i)return t=t||[],Array.isArray(t)?t.push(e(null,r,n)):(t._values=t._values||[],t._values.push(e(null,r,n))),t;if(a){var o=a[1],s=+o;isNaN(s)?(t=t||{})[o]=e(t[o],r,n):(t=t||[])[s]=e(t[s],r,n)}else t[i]=e(t[i],r,n);return t}(e,function(e){var t=[],r=new RegExp(i),n=/^([^\[\]]*)/.exec(e);for(n[1]&&t.push(n[1]);null!==(n=r.exec(e));)t.push(n[1]);return t}(t),r)}else{var n=e[t];n?(Array.isArray(n)||(e[t]=[n]),e[t].push(r)):e[t]=r}return e}function w(e,t,r){return r=r.replace(/(\r)?\n/g,"\r\n"),r=(r=encodeURIComponent(r)).replace(/%20/g,"+"),e+(e?"&":"")+encodeURIComponent(t)+"="+r}t.exports=function(e,t){"object"!=typeof t?t={hash:!!t}:void 0===t.hash&&(t.hash=!0);for(var r=t.hash?{}:"",n=t.serializer||(t.hash?y:w),i=e&&e.elements?e.elements:[],a=Object.create(null),o=0;o<i.length;++o){var s=i[o];if((t.disabled||!s.disabled)&&s.name&&(g.test(s.nodeName)&&!v.test(s.type))){var u=s.name,c=s.value;if("checkbox"!==s.type&&"radio"!==s.type||s.checked||(c=void 0),t.empty){if("checkbox"!==s.type||s.checked||(c=""),"radio"===s.type&&(a[s.name]||s.checked?s.checked&&(a[s.name]=!0):a[s.name]=!1),null==c&&"radio"==s.type)continue}else if(!c)continue;if("select-multiple"!==s.type)r=n(r,u,c);else{c=[];for(var l=s.options,f=!1,m=0;m<l.length;++m){var d=l[m],p=t.empty&&!d.value,h=d.value||p;d.selected&&h&&(f=!0,r=t.hash&&"[]"!==u.slice(u.length-2)?n(r,u+"[]",d.value):n(r,u,d.value))}!f&&t.empty&&(r=n(r,u,""))}}}if(t.empty)for(var u in a)a[u]||(r=n(r,u,""));return r}},{}],6:[function(e,t,r){void 0!==t&&t.exports&&(t.exports=function e(t,r,n){for(var i in r)if(r.hasOwnProperty(i)){var a=i,o=r[i];if(void 0===o&&(o=""),null===o&&(o=""),void 0!==n&&(a=n+"["+i+"]"),o.constructor===Array)a+="[]";else if("object"==typeof o){e(t,o,a);continue}var s=t.elements.namedItem(a);if(s)switch(s.type||s[0].type){default:s.value=o;break;case"radio":case"checkbox":for(var u=o.constructor===Array?o:[o],c=0;c<s.length;c++)s[c].checked=-1<u.indexOf(s[c].value);break;case"select-multiple":u=o.constructor===Array?o:[o];for(var l=0;l<s.options.length;l++)s.options[l].selected=-1<u.indexOf(s.options[l].value);break;case"select":case"select-one":s.value=o.toString()||o;break;case"date":s.value=new Date(o).toISOString().split("T")[0]}}})},{}]},{},[1]);