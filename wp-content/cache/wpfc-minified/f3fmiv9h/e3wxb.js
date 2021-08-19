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