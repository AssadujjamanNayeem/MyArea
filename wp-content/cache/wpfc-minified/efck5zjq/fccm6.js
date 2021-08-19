!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){"use strict";function b(a){if(a instanceof Date)return a;if(String(a).match(g))return String(a).match(/^[0-9]*$/)&&(a=Number(a)),String(a).match(/\-/)&&(a=String(a).replace(/\-/g,"/")),new Date(a);throw new Error("Couldn't cast `"+a+"` to a date object.")}function c(a){var b=a.toString().replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1");return new RegExp(b)}function d(a){return function(b){var d=b.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);if(d)for(var f=0,g=d.length;g>f;++f){var h=d[f].match(/%(-|!)?([a-zA-Z]{1})(:[^;]+;)?/),j=c(h[0]),k=h[1]||"",l=h[3]||"",m=null;h=h[2],i.hasOwnProperty(h)&&(m=i[h],m=Number(a[m])),null!==m&&("!"===k&&(m=e(l,m)),""===k&&10>m&&(m="0"+m.toString()),b=b.replace(j,m.toString()))}return b=b.replace(/%%/,"%")}}function e(a,b){var c="s",d="";return a&&(a=a.replace(/(:|;|\s)/gi,"").split(/\,/),1===a.length?c=a[0]:(d=a[0],c=a[1])),1===Math.abs(b)?d:c}var f=[],g=[],h={precision:100,elapse:!1};g.push(/^[0-9]*$/.source),g.push(/([0-9]{1,2}\/){2}[0-9]{4}([0-9]{1,2}(:[0-9]{2}){2})?/.source),g.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}([0-9]{1,2}(:[0-9]{2}){2})?/.source),g=new RegExp(g.join("|"));var i={Y:"years",m:"months",w:"weeks",d:"days",D:"totalDays",H:"hours",M:"minutes",S:"seconds"},j=function(b,c,d){this.el=b,this.$el=a(b),this.interval=null,this.offset={},this.options=a.extend({},h),this.instanceNumber=f.length,f.push(this),this.$el.data("countdown-instance",this.instanceNumber),d&&("function"==typeof d?(this.$el.on("update.countdown",d),this.$el.on("stoped.countdown",d),this.$el.on("finish.countdown",d)):this.options=a.extend({},h,d)),this.setFinalDate(c),this.start()};a.extend(j.prototype,{start:function(){null!==this.interval&&clearInterval(this.interval);var a=this;this.update(),this.interval=setInterval(function(){a.update.call(a)},this.options.precision)},stop:function(){clearInterval(this.interval),this.interval=null,this.dispatchEvent("stoped")},toggle:function(){this.interval?this.stop():this.start()},pause:function(){this.stop()},resume:function(){this.start()},remove:function(){this.stop.call(this),f[this.instanceNumber]=null,delete this.$el.data().countdownInstance},setFinalDate:function(a){this.finalDate=b(a)},update:function(){if(0===this.$el.closest("html").length)return void this.remove();var b,c=void 0!==a._data(this.el,"events"),d=new Date;b=this.finalDate.getTime()-d.getTime(),b=Math.ceil(b/1e3),b=!this.options.elapse&&0>b?0:Math.abs(b),this.totalSecsLeft!==b&&c&&(this.totalSecsLeft=b,this.elapsed=d>=this.finalDate,this.offset={seconds:this.totalSecsLeft%60,minutes:Math.floor(this.totalSecsLeft/60)%60,hours:Math.floor(this.totalSecsLeft/60/60)%24,days:Math.floor(this.totalSecsLeft/60/60/24)%7,totalDays:Math.floor(this.totalSecsLeft/60/60/24),weeks:Math.floor(this.totalSecsLeft/60/60/24/7),months:Math.floor(this.totalSecsLeft/60/60/24/30),years:Math.floor(this.totalSecsLeft/60/60/24/365)},this.options.elapse||0!==this.totalSecsLeft?this.dispatchEvent("update"):(this.stop(),this.dispatchEvent("finish")))},dispatchEvent:function(b){var c=a.Event(b+".countdown");c.finalDate=this.finalDate,c.elapsed=this.elapsed,c.offset=a.extend({},this.offset),c.strftime=d(this.offset),this.$el.trigger(c)}}),a.fn.countdown=function(){var b=Array.prototype.slice.call(arguments,0);return this.each(function(){var c=a(this).data("countdown-instance");if(void 0!==c){var d=f[c],e=b[0];j.prototype.hasOwnProperty(e)?d[e].apply(d,b.slice(1)):null===String(e).match(/^[$A-Z_][0-9A-Z_$]*$/i)?(d.setFinalDate.call(d,e),d.start()):a.error("Method %s does not exist on jQuery.countdown".replace(/\%s/gi,e))}else new j(this,b[0],b[1])})}});
(function ($){
$(document).on('ready', function(){
var days=sw_countdown_text.day, hours=sw_countdown_text.hour, mins=sw_countdown_text.min, secs=sw_countdown_text.sec;
$('.product-countdown').each(function(event){
var $this=$(this);
var $current_time=new Date().getTime();
var $cd_date=$(this).data('date');
var $start_time=$(this).data('starttime') * 1000;
var $countdown_time=$cd_date * 1000;
var $austDay=new Date($cd_date * 1000);
if($start_time > $current_time){
$this.remove();
return ;
}
if($countdown_time > 0&&$current_time > $countdown_time){
$this.remove();
return ;
}
if($countdown_time <=0){
$this.remove();
return ;
}
$this.countdown($austDay, function(event){
$(this).html(event.strftime('<span class="countdown-row countdown-show4"><span class="countdown-section days"><span class="countdown-amount">%D</span><span class="countdown-period">'+days+'</span></span><span class="countdown-section hours"><span class="countdown-amount">%H</span><span class="countdown-period">'+hours+'</span></span><span class="countdown-section mins"><span class="countdown-amount">%M</span><span class="countdown-period">'+mins+'</span></span><span class="countdown-section secs"><span class="countdown-amount">%S</span><span class="countdown-period">'+secs+'</span></span></span>')
);
}).on('finish.countdown', function(event){
$(this).hide('slow', function(){ $(this).remove(); });
location.reload();
});
});
});
$('.best-selling-product3 .item-countdown2').each(function(event){
$this=$(this);
$current_time=new Date().getTime();
$countdown_time=$(this).data('cdtime');
var $austDay=new Date();
$austDay=new Date($countdown_time * 1000);
if($countdown_time.length > 0&&$current_time > $countdown_time){
$this.parent().hide();
return ;
}
if($countdown_time.length <=0){
$this.parent().hide();
return ;
}
$this.countdown($austDay, function(event){
$(this).html(event.strftime('<span class="countdown-row countdown-show4"><span class="countdown-section icon-clock"></span><span class="countdown-section days"><span class="countdown-amount">%D</span></span><span class="countdown-section hours"><span class="countdown-amount">%H</span></span><span class="countdown-section mins"><span class="countdown-amount">%M</span></span><span class="countdown-section secs"><span class="countdown-amount">%S</span></span></span>')
);
}).on('finish.countdown', function(event){
$this.parent().hide();
});
});
$('.banner-countdown').each(function(event){
$this=$(this);
$current_time=new Date().getTime();
$countdown_time=$(this).data('cdtime');
var $austDay=new Date();
$austDay=new Date($countdown_time *1000);
if($countdown_time.length > 0&&$current_time > $countdown_time){
$this.parent().hide();
return ;
}
if($countdown_time.length <=0){
$this.parent().hide();
return ;
}
$this.countdown($austDay, function(event){
$(this).html(event.strftime('<span class="countdown-row countdown-show4"><span class="countdown-section days"><span class="countdown-amount">%D</span><span class="countdown-period">D</span></span><span class="countdown-section hours"><span class="countdown-amount">%H</span><span class="countdown-period">H</span></span><span class="countdown-section mins"><span class="countdown-amount">%M</span><span class="countdown-period">M</span></span><span class="countdown-section secs"><span class="countdown-amount">%S</span><span class="countdown-period">S</span></span></span>')
);
}).on('finish.countdown', function(event){
$this.parent().hide();
});
});
$('.tab-countdown-slide2 .product-countdown2').each(function(event){
$this=$(this);
$id=this.id;
$current_time=new Date().getTime();
$start_time=$(this).data('starttime');
$countdown_time=$(this).data('cdtime');
var $austDay=new Date();
$austDay=new Date($countdown_time * 1000);
if($start_time > $current_time){
$this.remove();
return ;
}
if($countdown_time.length > 0&&$current_time > $countdown_time){
$this.remove();
return ;
}
if($countdown_time.length <=0){
$this.remove();
return ;
}
$this.countdown($austDay, function(event){
$(this).html(event.strftime('<span class="countdown-row countdown-show4"><span class="countdown-section days"><span class="countdown-amount">%D</span><span class="countdown-period">'+days+'</span></span><span class="countdown-section hours"><span class="countdown-amount">%H</span><span class="countdown-period">'+hours+'</span></span><span class="countdown-section mins"><span class="countdown-amount">%M</span><span class="countdown-period">'+mins+'</span></span><span class="countdown-section secs"><span class="countdown-amount">%S</span><span class="countdown-period">'+secs+'</span></span></span>')
);
}).on('finish.countdown', function(event){
$(this).remove();
$id=$(this).data('id');
$target=this;
$(this).hide('slow', function(){ $(this).remove(); });
$price=$(this).data('price');
$('#' + $id + ' .item-price > span').hide('slow', function(){ $('#' + $id + ' .item-price > span').remove(); });
$('#' + $id + ' .item-price').append('<span><span class="amount">' + $price + '</span></span>');
});
});
})(jQuery);