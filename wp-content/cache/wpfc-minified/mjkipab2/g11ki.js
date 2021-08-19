var UapPasswordStrength={
colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
labels: [],
init: function(args){
var obj=this;
obj.setAttributes(obj, args);
obj.labels=jQuery.parseJSON(window.uapPasswordStrengthLabels);
jQuery(document).ready(function(){
jQuery(document).on('keyup', jQuery('[name=pass1]'), function (evt){
obj.handleTypePassword(obj, evt);
})
jQuery(document).on('keyup', jQuery('[name=pass2]'), function (evt){
obj.handleTypePassword(obj, evt);
})
})
},
setAttributes: function(obj, args){
for (var key in args){
obj[key]=args[key];
}},
handleTypePassword: function(obj, evt){
var rules=jQuery(evt.target).attr('data-rules');
if(!rules){
return;
}
rules=rules.split(',');
var strength=obj.mesureStrength(evt.target.value, rules);
var color=obj.getColor(strength);
var ul=jQuery(evt.target).parent().find('ul');
ul.children('li').css({ "background": "#DDD" }).slice(0, color.idx).css({ "background": color.col });
newLabel=obj.labels[0];
if(strength>10&&strength<21){
newLabel=obj.labels[1];
}else if(strength>20&&strength<31){
newLabel=obj.labels[2];
}else if(strength>30){
newLabel=obj.labels[3];
}
jQuery(evt.target).parent().find('.uap-strength-label').html(newLabel);
},
mesureStrength: function (p, rules){
var _force=0;
var _regex=/[$-/:-?{-~!"^_`\[\]]/g;
var _letters=/[a-zA-Z]+/.test(p);
var _lowerLetters=/[a-z]+/.test(p);
var _upperLetters=/[A-Z]+/.test(p);
var _numbers=/[0-9]+/.test(p);
var _symbols=_regex.test(p);
if(p.length<rules[0]){
return 0;
}
if(rules[1]==2&&(!_numbers||!_letters)){
return 0;
}else if(rules[1]==3&&(!_numbers||!_letters||!_upperLetters)){
return 0;
}
var _flags=[_lowerLetters, _upperLetters, _numbers, _symbols];
var _passedMatches=jQuery.grep(_flags, function (el){ return el===true; }).length;
_force +=2 * p.length + ((p.length >=10) ? 1:0);
_force +=_passedMatches * 10;
_force=(p.length <=6) ? Math.min(_force, 10):_force;
_force=(_passedMatches==1) ? Math.min(_force, 10):_force;
_force=(_passedMatches==2) ? Math.min(_force, 20):_force;
_force=(_passedMatches==3) ? Math.min(_force, 40):_force;
return _force;
},
getColor: function (s){
var idx=0;
if(s <=10){ idx=0; }
else if(s <=20){ idx=1; }
else if(s <=30){ idx=2; }
else if(s <=40){ idx=3; }else{ idx=4; }
return { idx: idx + 1, col: this.colors[idx] };}}
UapPasswordStrength.init({});
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});
(function (window, document){
Croppic=function (id, options){
var that=this;
that.id=id;
that.obj=jQuery('#' + id);
that.outputDiv=that.obj;
that.options={
uploadUrl:'',
uploadData:{},
cropUrl:'',
cropData:{},
outputUrlId:'',
imgEyecandy:true,
imgEyecandyOpacity:0.2,
initialZoom:40,
zoomFactor:10,
rotateFactor:5,
doubleZoomControls:true,
rotateControls: true,
modal:false,
customUploadButtonId:'',
loaderHtml:'',
scaleToFill: true,
processInline: false,
loadPicture:'',
onReset: null,
enableMousescroll: false,
onBeforeImgUpload: null,
onAfterImgUpload: null,
onImgDrag: null,
onImgZoom: null,
onImgRotate: null,
onBeforeImgCrop: null,
onAfterImgCrop: null,
onBeforeRemoveCroppedImg: null,
onAfterRemoveCroppedImg: null,
onError: null,
imgInitW:0,
imgInitH:0,
imgW:0,
imgH:0,
objW:0,
objH:0,
imageAppendAfter:true,
customIdentificator:'',
};
for (i in options) that.options[i]=options[i];
that.init();
};
Croppic.prototype={
id:'',
imgInitW:0,
imgInitH:0,
imgW:0,
imgH:0,
objW:0,
objH:0,
actualRotation: 0,
windowW:0,
windowH:jQuery(window).height(),
obj:{},
outputDiv:{},
outputUrlObj:{},
img:{},
defaultImg:{},
croppedImg:{},
imgEyecandy:{},
form:{},
iframeform: {},
iframeobj: {},
cropControlsUpload:{},
cropControlsCrop:{},
cropControlZoomMuchIn:{},
cropControlZoomMuchOut:{},
cropControlZoomIn:{},
cropControlZoomOut:{},
cropControlCrop:{},
cropControlReset:{},
cropControlRemoveCroppedImage:{},
modal:{},
loader:{},
uploadId:0,
init: function (){
var that=this;
that.objW=that.obj.width();
that.objH=that.obj.height();
that.setSizes()
that.actualRotation=0;
if(that.isEmptyObject(that.defaultImg)){ that.defaultImg=that.obj.find('img'); }
that.createImgUploadControls();
if(that.isEmptyObject(that.options.loadPicture)){
that.bindImgUploadControl();
}else{
that.loadExistingImage();
}},
setSizes: function(){
var that=this
var options={
imgInitW:0,
imgInitH:0,
imgW:0,
imgH:0,
objW:0,
objH:0,
customIdentificator:0,
}
for (i in options){
if(that.options[i] > 0){
that[i]=that.options[i]
}}
},
isEmptyObject: function(param){
for (var prop in param){
if(param.hasOwnProperty(prop))
return false
}
return true
},
createImgUploadControls: function(){
var that=this;
var cropControlUpload='';
if(that.options.customUploadButtonId===''){ cropControlUpload='<i class="cropControlUpload"></i>'; }
var cropControlRemoveCroppedImage='<i class="cropControlRemoveCroppedImage"></i>';
if(that.isEmptyObject(that.croppedImg)){ cropControlRemoveCroppedImage=''; }
if(!that.isEmptyObject(that.options.loadPicture)){ cropControlUpload='';}
var html='<div class="cropControls cropControlsUpload"> ' + cropControlUpload + cropControlRemoveCroppedImage + ' </div>';
that.outputDiv.append(html);
that.cropControlsUpload=that.outputDiv.find('.cropControlsUpload');
if(that.options.customUploadButtonId===''){ that.imgUploadControl=that.outputDiv.find('.cropControlUpload'); }else{	that.imgUploadControl=jQuery('#'+that.options.customUploadButtonId); that.imgUploadControl.show();	}
if(!that.isEmptyObject(that.croppedImg)){
that.cropControlRemoveCroppedImage=that.outputDiv.find('.cropControlRemoveCroppedImage');
}},
bindImgUploadControl: function(){
var that=this;
var formHtml='<form class="' + that.id + '_imgUploadForm" style="visibility: hidden;">  <input type="file" name="img" id="' + that.id + '_imgUploadField">  </form>';
that.outputDiv.append(formHtml);
that.form=that.outputDiv.find('.'+that.id+'_imgUploadForm');
var fileUploadId=that.CreateFallbackIframe();
that.imgUploadControl.off('click');
that.imgUploadControl.on('click',function(){
if(fileUploadId===""){
that.form.find('input[type="file"]').trigger('click');
}else{
that.iframeform.find('input[type="file"]').trigger('click');
}});
if(!that.isEmptyObject(that.croppedImg)){
that.cropControlRemoveCroppedImage.on('click',function(){
if(typeof (that.options.onBeforeRemoveCroppedImg)===typeof(Function)){
that.options.onBeforeRemoveCroppedImg.call(that);
}
that.croppedImg.remove();
that.croppedImg={};
jQuery(this).hide();
if(typeof (that.options.onAfterRemoveCroppedImg)===typeof(Function)){
that.options.onAfterRemoveCroppedImg.call(that);
}
if(!that.isEmptyObject(that.defaultImg)){
that.obj.append(that.defaultImg);
}
if(that.options.outputUrlId!==''){	jQuery('#'+that.options.outputUrlId).val('');	}});
}
that.form.find('input[type="file"]').change(function(){
if(that.options.onBeforeImgUpload) that.options.onBeforeImgUpload.call(that);
that.showLoader();
that.imgUploadControl.hide();
if(that.options.processInline){
if(typeof FileReader=="undefined"){
if(that.options.onError) that.options.onError.call(that,"processInline is not supported by your Browser");
that.reset();
}else{
var reader=new FileReader();
reader.onload=function (e){
var image=new Image();
image.src=e.target.result;
image.onload=function(){
that.imgInitW=that.imgW=image.width;
that.imgInitH=that.imgH=image.height;
if(that.options.modal){	that.createModal(); }
if(!that.isEmptyObject(that.croppedImg)){ that.croppedImg.remove(); }
that.imgUrl=image.src;
that.obj.append('<img src="'+image.src+'">');
that.initCropper();
that.hideLoader();
if(that.options.onAfterImgUpload) that.options.onAfterImgUpload.call(that);
}};
reader.readAsDataURL(that.form.find('input[type="file"]')[0].files[0]);
}}else{
try {
formData=new FormData(that.form[0]);
} catch(e){
formData=new FormData();
formData.append('img', that.form.find("input[type=file]")[0].files[0]);
}
for (var key in that.options.uploadData){
if(that.options.uploadData.hasOwnProperty(key)){
formData.append(key , that.options.uploadData[key]);
}}
jQuery.ajax({
url: that.options.uploadUrl,
data: formData,
context: document.body,
cache: false,
contentType: false,
processData: false,
type: 'POST'
}).always(function (data){
that.afterUpload(data);
});
}});
},
loadExistingImage: function(){
var that=this;
if(that.isEmptyObject(that.croppedImg)){
if(that.options.onBeforeImgUpload) that.options.onBeforeImgUpload.call(that);
that.showLoader();
if(that.options.modal){	that.createModal(); }
if(!that.isEmptyObject(that.croppedImg)){ that.croppedImg.remove(); }
that.imgUrl=that.options.loadPicture ;
var img=jQuery('<img src="'+ that.options.loadPicture +'">');
that.obj.append(img);
img.load(function(){
that.imgInitW=that.imgW=this.width;
that.imgInitH=that.imgH=this.height;
that.initCropper();
that.hideLoader();
if(that.options.onAfterImgUpload) that.options.onAfterImgUpload.call(that);
});
}else{
that.cropControlRemoveCroppedImage.on('click',function(){
that.croppedImg.remove();
jQuery(this).hide();
if(!that.isEmptyObject(that.defaultImg)){
that.obj.append(that.defaultImg);
}
if(that.options.outputUrlId!==''){	jQuery('#'+that.options.outputUrlId).val('');	}
that.croppedImg='';
that.reset();
});
}},
afterUpload: function(data){
var that=this;
response=typeof data=='object' ? data:jQuery.parseJSON(data);
if(response.status=='success'){
that.uploadId=response.uploadId
that.imgInitW=that.imgW=response.width;
that.imgInitH=that.imgH=response.height;
if(that.options.modal){ that.createModal(); }
if(!that.isEmptyObject(that.croppedImg)){ that.croppedImg.remove(); }
that.imgUrl=response.url;
var img=jQuery('<img src="'+response.url+'">')
that.obj.append(img);
img.load(function(){
that.initCropper();
that.hideLoader();
if(that.options.onAfterImgUpload) that.options.onAfterImgUpload.call(that, response);
});
if(that.options.onAfterImgUpload) that.options.onAfterImgUpload.call(that);
}
if(response.status=='error'){
alert(response.message);
if(that.options.onError) that.options.onError.call(that,response.message);
that.hideLoader();
setTimeout(function(){ that.reset(); },2000)
}},
createModal: function(){
var that=this;
var marginTop=that.windowH/2-that.objH/2;
var modalHTML='<div id="croppicModal">'+'<div id="croppicModalObj" style="width:'+ that.objW +'px; height:'+ that.objH +'px; margin:0 auto; margin-top:'+ marginTop +'px; position: relative; max-width:100%;"> </div>'+'</div>';
jQuery('body').append(modalHTML);
that.modal=jQuery('#croppicModal');
that.obj=jQuery('#croppicModalObj');
},
destroyModal: function(){
var that=this;
that.obj=that.outputDiv;
that.modal.remove();
that.modal={};},
initCropper: function(){
var that=this;
that.img=that.obj.find('img');
that.img.wrap('<div class="cropImgWrapper" style="overflow:hidden; z-index:1; position:absolute; width:'+that.objW+'px; height:'+that.objH+'px;"></div>');
that.createCropControls();
if(that.options.imgEyecandy){ that.createEyecandy(); }
that.initDrag();
that.initialScaleImg();
},
createEyecandy: function(){
var that=this;
that.imgEyecandy=that.img.clone();
that.imgEyecandy.css({'z-index':'0','opacity':that.options.imgEyecandyOpacity}).appendTo(that.obj);
},
destroyEyecandy: function(){
var that=this;
that.imgEyecandy.remove();
},
initialScaleImg:function(){
var that=this;
that.zoom(-that.imgInitW);
that.zoom(that.options.initialZoom);
if(that.options.enableMousescroll){
that.img.on('mousewheel', function(event){
event.preventDefault();
that.zoom(that.options.zoomFactor*event.deltaY);
});
}
that.img.css({'left': -(that.imgW -that.objW)/2, 'top': -(that.imgH -that.objH)/2, 'position':'relative'});
if(that.options.imgEyecandy){ that.imgEyecandy.css({'left': -(that.imgW -that.objW)/2, 'top': -(that.imgH -that.objH)/2, 'position':'relative'});}},
createCropControls: function(){
var that=this;
var cropControlZoomMuchIn='';
var cropControlZoomIn='<i class="cropControlZoomIn"></i>';
var cropControlZoomOut='<i class="cropControlZoomOut"></i>';
var cropControlZoomMuchOut='';
var cropControlRotateLeft='';
var cropControlRotateRight='';
var cropControlCrop='<i class="cropControlCrop"></i>';
var cropControlReset='<i class="cropControlReset"></i>';
var html;
if(that.options.doubleZoomControls){
cropControlZoomMuchIn='<i class="cropControlZoomMuchIn"></i>';
cropControlZoomMuchOut='<i class="cropControlZoomMuchOut"></i>';
}
if(that.options.rotateControls){
cropControlRotateLeft='<i class="cropControlRotateLeft"></i>';
cropControlRotateRight='<i class="cropControlRotateRight"></i>';
}
html='<div class="cropControls cropControlsCrop">'+ cropControlZoomMuchIn + cropControlZoomIn + cropControlZoomOut + cropControlZoomMuchOut + cropControlRotateLeft + cropControlRotateRight + cropControlCrop + cropControlReset + '</div>';
that.obj.append(html);
that.cropControlsCrop=that.obj.find('.cropControlsCrop');
if(that.options.doubleZoomControls){
that.cropControlZoomMuchIn=that.cropControlsCrop.find('.cropControlZoomMuchIn');
that.cropControlZoomMuchIn.on('click',function(){ that.zoom(that.options.zoomFactor*10); });
that.cropControlZoomMuchOut=that.cropControlsCrop.find('.cropControlZoomMuchOut');
that.cropControlZoomMuchOut.on('click',function(){ that.zoom(-that.options.zoomFactor*10); });
}
that.cropControlZoomIn=that.cropControlsCrop.find('.cropControlZoomIn');
that.cropControlZoomIn.on('click',function(){ that.zoom(that.options.zoomFactor); });
that.cropControlZoomOut=that.cropControlsCrop.find('.cropControlZoomOut');
that.cropControlZoomOut.on('click',function(){ that.zoom(-that.options.zoomFactor); });
that.cropControlZoomIn=that.cropControlsCrop.find('.cropControlRotateLeft');
that.cropControlZoomIn.on('click', function(){ that.rotate(-that.options.rotateFactor); });
that.cropControlZoomOut=that.cropControlsCrop.find('.cropControlRotateRight');
that.cropControlZoomOut.on('click', function(){ that.rotate(that.options.rotateFactor); });
that.cropControlCrop=that.cropControlsCrop.find('.cropControlCrop');
that.cropControlCrop.on('click',function(){ that.crop(); });
that.cropControlReset=that.cropControlsCrop.find('.cropControlReset');
that.cropControlReset.on('click',function(){ that.reset(); });
},
initDrag:function(){
var that=this;
that.img.on("mousedown touchstart", function(e){
e.preventDefault();
var pageX;
var pageY;
var userAgent=window.navigator.userAgent;
if(userAgent.match(/iPad/i)||userAgent.match(/iPhone/i)||userAgent.match(/android/i)||(e.pageY&&e.pageX)==undefined){
pageX=e.originalEvent.touches[0].pageX;
pageY=e.originalEvent.touches[0].pageY;
}else{
pageX=e.pageX;
pageY=e.pageY;
}
var z_idx=that.img.css('z-index'),
drg_h=that.img.outerHeight(),
drg_w=that.img.outerWidth(),
pos_y=that.img.offset().top + drg_h - pageY,
pos_x=that.img.offset().left + drg_w - pageX;
that.img.css('z-index', 1000).on("mousemove touchmove", function(e){
var imgTop;
var imgLeft;
if(userAgent.match(/iPad/i)||userAgent.match(/iPhone/i)||userAgent.match(/android/i)||(e.pageY&&e.pageX)==undefined){
imgTop=e.originalEvent.touches[0].pageY + pos_y - drg_h;
imgLeft=e.originalEvent.touches[0].pageX + pos_x - drg_w;
}else{
imgTop=e.pageY + pos_y - drg_h;
imgLeft=e.pageX + pos_x - drg_w;
}
that.img.offset({
top:imgTop,
left:imgLeft
}).on("mouseup", function(){
jQuery(this).removeClass('draggable').css('z-index', z_idx);
});
if(that.options.imgEyecandy){ that.imgEyecandy.offset({ top:imgTop, left:imgLeft });}
if(that.objH < that.imgH){
if(parseInt(that.img.css('top')) > 0){ that.img.css('top', 0); if(that.options.imgEyecandy){ that.imgEyecandy.css('top', 0);}}
var maxTop=-(that.imgH - that.objH); if(parseInt(that.img.css('top')) < maxTop){ that.img.css('top', maxTop); if(that.options.imgEyecandy){ that.imgEyecandy.css('top', maxTop); }}}else{
if(parseInt(that.img.css('top')) < 0){ that.img.css('top', 0); if(that.options.imgEyecandy){ that.imgEyecandy.css('top', 0); }}
var maxTop=that.objH - that.imgH; if(parseInt(that.img.css('top')) > maxTop){ that.img.css('top', maxTop);if(that.options.imgEyecandy){that.imgEyecandy.css('top', maxTop); }}}
if(that.objW < that.imgW){
if(parseInt(that.img.css('left')) > 0){ that.img.css('left',0); if(that.options.imgEyecandy){ that.imgEyecandy.css('left', 0); }}
var maxLeft=-(that.imgW-that.objW); if(parseInt(that.img.css('left')) < maxLeft){ that.img.css('left', maxLeft); if(that.options.imgEyecandy){ that.imgEyecandy.css('left', maxLeft); }}
}else{
if(parseInt(that.img.css('left')) < 0){ that.img.css('left',0); if(that.options.imgEyecandy){ that.imgEyecandy.css('left', 0); }}
var maxLeft=(that.objW - that.imgW); if(parseInt(that.img.css('left')) > maxLeft){ that.img.css('left', maxLeft); if(that.options.imgEyecandy){ that.imgEyecandy.css('left', maxLeft); }}
}
if(that.options.onImgDrag) that.options.onImgDrag.call(that);
});
}).on("mouseup", function(){
that.img.off("mousemove");
}).on("mouseout", function(){
that.img.off("mousemove");
});
},
rotate: function(x){
var that=this;
that.actualRotation +=x;
that.img.css({
'-webkit-transform': 'rotate(' + that.actualRotation + 'deg)',
'-moz-transform': 'rotate(' + that.actualRotation + 'deg)',
'transform': 'rotate(' + that.actualRotation + 'deg)',
});
if(that.options.imgEyecandy){
that.imgEyecandy.css({
'-webkit-transform': 'rotate(' + that.actualRotation + 'deg)',
'-moz-transform': 'rotate(' + that.actualRotation + 'deg)',
'transform': 'rotate(' + that.actualRotation + 'deg)',
});
}
if(typeof that.options.onImgRotate=='function')
that.options.onImgRotate.call(that);
},
zoom :function(x){
var that=this;
var ratio=that.imgW / that.imgH;
var newWidth=that.imgW+x;
var newHeight=newWidth/ratio;
var doPositioning=true;
if(newWidth < that.objW||newHeight < that.objH){
if(newWidth - that.objW < newHeight - that.objH){
newWidth=that.objW;
newHeight=newWidth/ratio;
}else{
newHeight=that.objH;
newWidth=ratio * newHeight;
}
doPositioning=false;
}
if(!that.options.scaleToFill&&(newWidth > that.imgInitW||newHeight > that.imgInitH)){
if(newWidth - that.imgInitW < newHeight - that.imgInitH){
newWidth=that.imgInitW;
newHeight=newWidth/ratio;
}else{
newHeight=that.imgInitH;
newWidth=ratio * newHeight;
}
doPositioning=false;
}
that.imgW=newWidth;
that.img.width(newWidth);
that.imgH=newHeight;
that.img.height(newHeight);
var newTop=parseInt(that.img.css('top')) - x/2;
var newLeft=parseInt(that.img.css('left')) - x/2;
if(newTop>0){ newTop=0;}
if(newLeft>0){ newLeft=0;}
var maxTop=-(newHeight-that.objH); if(newTop < maxTop){	newTop=maxTop;	}
var maxLeft=-(newWidth-that.objW); if(newLeft < maxLeft){	newLeft=maxLeft;	}
if(doPositioning){
that.img.css({'top':newTop, 'left':newLeft});
}
if(that.options.imgEyecandy){
that.imgEyecandy.width(newWidth);
that.imgEyecandy.height(newHeight);
if(doPositioning){
that.imgEyecandy.css({'top':newTop, 'left':newLeft});
}}
if(that.options.onImgZoom) that.options.onImgZoom.call(that);
},
crop:function(){
var that=this;
if(that.options.onBeforeImgCrop) that.options.onBeforeImgCrop.call(that);
that.cropControlsCrop.hide();
that.showLoader();
var cropData={
imgUrl:that.imgUrl,
imgInitW:that.imgInitW,
imgInitH:that.imgInitH,
imgW:that.imgW,
imgH:that.imgH,
imgY1:Math.abs(parseInt(that.img.css('top'))),
imgX1:Math.abs(parseInt(that.img.css('left'))),
cropH:that.objH,
cropW:that.objW,
rotation:that.actualRotation,
customIdentificator: that.options.customIdentificator,
uploadId:that.uploadId
};
var formData;
if(typeof FormData=='undefined'){
var XHR=new XMLHttpRequest();
var urlEncodedData="";
var urlEncodedDataPairs=[];
for(var key in cropData){
urlEncodedDataPairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(cropData[key]));
}
for(var key in that.options.cropData){
urlEncodedDataPairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(that.options.cropData[key]));
}
urlEncodedData=urlEncodedDataPairs.join('&').replace(/%20/g, '+');
XHR.addEventListener('error', function(event){
if(that.options.onError) that.options.onError.call(that,"XHR Request failed");
});
XHR.onreadystatechange=function(){
if(XHR.readyState==4&&XHR.status==200){
that.afterCrop(XHR.responseText);
}}
XHR.open('POST', that.options.cropUrl);
XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
XHR.setRequestHeader('Content-Length', urlEncodedData.length);
XHR.send(urlEncodedData);
}else{
formData=new FormData();
for (var key in cropData){
if(cropData.hasOwnProperty(key)){
formData.append(key , cropData[key]);
}}
for (var key in that.options.cropData){
if(that.options.cropData.hasOwnProperty(key)){
formData.append(key , that.options.cropData[key]);
}}
jQuery.ajax({
url: that.options.cropUrl,
data: formData,
context: document.body,
cache: false,
contentType: false,
processData: false,
type: 'POST'
}).always(function (data){
that.afterCrop(data);
});
}},
afterCrop: function (data){
var that=this;
try {
response=jQuery.parseJSON(data);
}
catch(err){
response=typeof data=='object' ? data:jQuery.parseJSON(data);
}
if(response.status=='success'){
if(that.options.imgEyecandy)
that.imgEyecandy.hide();
that.destroy();
if(that.options.imageAppendAfter){
that.obj.append('<img class="croppedImg" src="' + response.url + '">');
}
if(that.options.outputUrlId!==''){ jQuery('#' + that.options.outputUrlId).val(response.url); }
that.croppedImg=that.obj.find('.croppedImg');
that.init();
that.hideLoader();
}
if(response.status=='error'){
if(that.options.onError) that.options.onError.call(that,response.message);
that.hideLoader();
setTimeout(function(){ that.reset(); },2000)
}
if(that.options.onAfterImgCrop) that.options.onAfterImgCrop.call(that, response);
},
showLoader:function(){
var that=this;
that.obj.append(that.options.loaderHtml);
that.loader=that.obj.find('.loader');
},
hideLoader:function(){
var that=this;
that.loader.remove();
},
reset:function(){
var that=this;
that.destroy();
if(!that.isEmptyObject(that.croppedImg)){
that.obj.append(that.croppedImg);
if(that.options.outputUrlId!==''){	jQuery('#'+that.options.outputUrlId).val(that.croppedImg.attr('url'));	}}
if(typeof that.options.onReset=='function')
that.options.onReset.call(that);
that.init();
},
destroy:function(){
var that=this;
if(that.options.modal&&!that.isEmptyObject(that.modal)){ that.destroyModal(); }
if(that.options.imgEyecandy&&!that.isEmptyObject(that.imgEyecandy)){  that.destroyEyecandy(); }
if(!that.isEmptyObject(that.cropControlsUpload)){  that.cropControlsUpload.remove(); }
if(!that.isEmptyObject(that.cropControlsCrop)){   that.cropControlsCrop.remove(); }
if(!that.isEmptyObject(that.loader)){   that.loader.remove(); }
if(!that.isEmptyObject(that.form)){   that.form.remove(); }
that.obj.html('');
},
isAjaxUploadSupported: function (){
var input=document.createElement("input");
input.type="file";
return (
"multiple" in input &&
typeof File!="undefined" &&
typeof FormData!="undefined" &&
typeof (new XMLHttpRequest()).upload!="undefined");
},
CreateFallbackIframe: function (){
var that=this;
if(!that.isAjaxUploadSupported()){
if(that.isEmptyObject(that.iframeobj)){
var iframe=document.createElement("iframe");
iframe.setAttribute("id", that.id + "_upload_iframe");
iframe.setAttribute("name", that.id + "_upload_iframe");
iframe.setAttribute("width", "0");
iframe.setAttribute("height", "0");
iframe.setAttribute("border", "0");
iframe.setAttribute("src", "javascript:false;");
iframe.style.display="none";
document.body.appendChild(iframe);
}else{
iframe=that.iframeobj[0];
}
var myContent='<!DOCTYPE html>'
+ '<html><head><title>Uploading File</title></head>'
+ '<body>'
+ '<form '
+ 'class="' + that.id + '_upload_iframe_form" '
+ 'name="' + that.id + '_upload_iframe_form" '
+ 'action="' + that.options.uploadUrl + '" method="post" '
+ 'enctype="multipart/form-data" encoding="multipart/form-data" style="display:none;">'
+ jQuery("#" + that.id + '_imgUploadField')[0].outerHTML
+ '</form></body></html>';
iframe.contentWindow.document.open('text/htmlreplace');
iframe.contentWindow.document.write(myContent);
iframe.contentWindow.document.close();
that.iframeobj=jQuery("#" + that.id + "_upload_iframe");
that.iframeform=that.iframeobj.contents().find("html").find("." + that.id + "_upload_iframe_form");
that.iframeform.on("change", "input", function (){
that.SubmitFallbackIframe(that);
});
that.iframeform.find("input")[0].attachEvent("onchange", function (){
that.SubmitFallbackIframe(that);
});
var eventHandlermyFile=function (){
if(iframe.detachEvent)
iframe.detachEvent("onload", eventHandlermyFile);
else
iframe.removeEventListener("load", eventHandlermyFile, false);
var response=that.getIframeContentJSON(iframe);
if(that.isEmptyObject(that.modal)){
that.afterUpload(response);
}}
if(iframe.addEventListener)
iframe.addEventListener("load", eventHandlermyFile, true);
if(iframe.attachEvent)
iframe.attachEvent("onload", eventHandlermyFile);
return "#" + that.id + '_imgUploadField';
}else{
return "";
}},
SubmitFallbackIframe: function (that){
that.showLoader();
if(that.options.processInline&&!that.options.uploadUrl){
if(that.options.onError){
that.options.onError.call(that,"processInline is not supported by your browser ");
that.hideLoader();
}}else{
if(that.options.onBeforeImgUpload) that.options.onBeforeImgUpload.call(that);
that.iframeform[0].submit();
}},
getIframeContentJSON: function (iframe){
try {
var doc=iframe.contentDocument ? iframe.contentDocument:iframe.contentWindow.document,
response;
var innerHTML=doc.body.innerHTML;
if(innerHTML.slice(0, 5).toLowerCase()=="<pre>"&&innerHTML.slice(-6).toLowerCase()=="</pre>"){
innerHTML=doc.body.firstChild.firstChild.nodeValue;
}
response=jQuery.parseJSON(innerHTML);
} catch (err){
response={ success: false };}
return response;
}};})(window, document);
var UapAvatarCroppic={
triggerId:'',
saveImageTarget:'',
cropImageTarget:'',
hiddenInputSelector:'',
standardImage:'',
buttonId:'',
buttonLabel:'',
init: function(args){
var obj=this;
obj.setAttributes(obj, args);
jQuery(document).ready(function(){
cropperHeader=obj.initCroppic(obj);
jQuery(obj.removeImageSelector).on('click', function(){
cropperHeader.reset();
obj.handleRemove(obj);
});
});
},
setAttributes: function(obj, args){
for (var key in args){
obj[key]=args[key];
}},
initCroppic: function(obj){
var options={
uploadUrl:obj.saveImageTarget,
cropUrl:obj.cropImageTarget,
modal:true,
imgEyecandyOpacity:0.4,
loaderHtml:'<div class="loader cssload-wrapper"><div id="floatingCirclesG"><div class="f_circleG" id="frotateG_01"></div><div class="f_circleG" id="frotateG_02"></div><div class="f_circleG" id="frotateG_03"></div><div class="f_circleG" id="frotateG_04"></div><div class="f_circleG" id="frotateG_05"></div><div class="f_circleG" id="frotateG_06"></div><div class="f_circleG" id="frotateG_07"></div><div class="f_circleG" id="frotateG_08"></div></div>',
onBeforeImgUpload:function(){},
onAfterImgUpload:function(response){ obj.handleImgUpload(obj, response); },//obj.handleImgUpload(obj, response) },
onImgDrag:function(){},
onImgZoom:function(){},
onBeforeImgCrop:function(){},
onAfterImgCrop:function(response){ obj.handleAfterImageCrop(obj, response); },
onAfterRemoveCroppedImg:function(){ obj.handleRemove(obj, false); },
onReset:function(){ obj.handleRemove(obj, true); },
onError:function(e){ console.log('onError:' + e); },
imgW:450,
imgH:450,
objW:250,
objH:250,
imgInitH:120,
imgInitW:120,
imageAppendAfter:false,
customIdentificator:'image',
customUploadButtonId:obj.buttonId,
}
var cropperHeader=new Croppic(obj.triggerId, options);
return cropperHeader;
},
handleAfterImageCrop: function(obj, response){
if(response.status=='success'){
jQuery(obj.imageSelectorWrapper).html('');
jQuery(obj.hiddenInputSelector).val(response.uploadId);
jQuery(obj.imageSelectorWrapper).append('<img src="' + response.url + '" class="' + obj.imageClass + '" />');
jQuery(obj.removeImageSelector).css('visibility', 'visible');
}},
handleRemove: function(obj, isReset){
var newUser=jQuery(obj.hiddenInputSelector).attr('data-new_user');
if(newUser){
jQuery.ajax({
type:"post",
url:decodeURI(ajax_url),
data:{
action:'uap_remove_media_post',
postId:jQuery(obj.hiddenInputSelector).val()
},
success:function (response){
}});
}
jQuery(obj.imageSelectorWrapper).html('');
jQuery(obj.imageSelectorWrapper).append('<div class="uap-no-avatar uap-member-photo"></div>');
jQuery(obj.removeImageSelector).css('visibility', 'hidden');
jQuery(obj.hiddenInputSelector).val('');
if(isReset)
jQuery('#' + obj.triggerId).append('<div id="uap-avatar-button" class="uap-upload-avatar">'+obj.buttonLabel+'</div>');
if(obj.standardImage){
jQuery(obj.imageSelectorWrapper).append('<img src="' + obj.standardImage + '" class="' + obj.imageClass + '" />');
jQuery('.' + obj.avatarClass).css('background-image', 'url(' + obj.standardImage + ')');
}},
handleImgUpload: function(obj, response){
if(typeof(response)!='undefined'&&response.uploadId){
jQuery(obj.hiddenInputSelector).val(response.uploadId);
}
jQuery(obj.removeImageSelector).css('visibility', 'visible');
},
};
! function(a){
"function"==typeof define&&define.amd ? define(["jquery"], a):a("object"==typeof exports ? require("jquery"):jQuery)
}(function(a){
var b=function(){
if(a&&a.fn&&a.fn.select2&&a.fn.select2.amd) var b=a.fn.select2.amd;
var b;
return function(){
if(!b||!b.requirejs){
b ? c=b:b={};
var a, c, d;
! function(b){
function e(a, b){
return u.call(a, b)
}
function f(a, b){
var c, d, e, f, g, h, i, j, k, l, m, n=b&&b.split("/"),
o=s.map,
p=o&&o["*"]||{};
if(a&&"."===a.charAt(0))
if(b){
for (a=a.split("/"), g=a.length - 1, s.nodeIdCompat&&w.test(a[g])&&(a[g]=a[g].replace(w, "")), a=n.slice(0, n.length - 1).concat(a), k=0; k < a.length; k +=1)
if(m=a[k], "."===m) a.splice(k, 1), k -=1;
else if(".."===m){
if(1===k&&(".."===a[2]||".."===a[0])) break;
k > 0&&(a.splice(k - 1, 2), k -=2)
}
a=a.join("/")
} else 0===a.indexOf("./")&&(a=a.substring(2));
if((n||p)&&o){
for (c=a.split("/"), k=c.length; k > 0; k -=1){
if(d=c.slice(0, k).join("/"), n)
for (l=n.length; l > 0; l -=1)
if(e=o[n.slice(0, l).join("/")], e&&(e=e[d])){
f=e, h=k;
break
}
if(f) break;
!i&&p && p[d]&&(i=p[d], j=k)
}!f&&i && (f=i, h=j), f&&(c.splice(0, h, f), a=c.join("/"))
}
return a
}
function g(a, c){
return function(){
var d=v.call(arguments, 0);
return "string"!=typeof d[0]&&1===d.length&&d.push(null), n.apply(b, d.concat([a, c]))
}}
function h(a){
return function(b){
return f(b, a)
}}
function i(a){
return function(b){
q[a]=b
}}
function j(a){
if(e(r, a)){
var c=r[a];
delete r[a], t[a] = !0, m.apply(b, c)
}
if(!e(q, a)&&!e(t, a)) throw new Error("No " + a);
return q[a]
}
function k(a){
var b, c=a ? a.indexOf("!"):-1;
return c > -1&&(b=a.substring(0, c), a=a.substring(c + 1, a.length)), [b, a]
}
function l(a){
return function(){
return s&&s.config&&s.config[a]||{}}
}
var m, n, o, p, q={},
r={},
s={},
t={},
u=Object.prototype.hasOwnProperty,
v=[].slice,
w=/\.js$/;
o=function(a, b){
var c, d=k(a),
e=d[0];
return a=d[1], e&&(e=f(e, b), c=j(e)), e ? a=c&&c.normalize ? c.normalize(a, h(b)):f(a, b):(a=f(a, b), d=k(a), e=d[0], a=d[1], e&&(c=j(e))), {
f: e ? e + "!" + a:a,
n: a,
pr: e,
p: c
}}, p={
require: function(a){
return g(a)
},
exports: function(a){
var b=q[a];
return "undefined"!=typeof b ? b:q[a]={}},
module: function(a){
return {
id: a,
uri: "",
exports: q[a],
config: l(a)
}}
}, m=function(a, c, d, f){
var h, k, l, m, n, s, u=[],
v=typeof d;
if(f=f||a, "undefined"===v||"function"===v){
for (c = !c.length&&d.length ? ["require", "exports", "module"]:c, n=0; n < c.length; n +=1)
if(m=o(c[n], f), k=m.f, "require"===k) u[n]=p.require(a);
else if("exports"===k) u[n]=p.exports(a), s = !0;
else if("module"===k) h=u[n]=p.module(a);
else if(e(q, k)||e(r, k)||e(t, k)) u[n]=j(k);
else {
if(!m.p) throw new Error(a + " missing " + k);
m.p.load(m.n, g(f, !0), i(k), {}), u[n]=q[k]
}
l=d ? d.apply(q[a], u):void 0, a&&(h&&h.exports!==b&&h.exports!==q[a] ? q[a]=h.exports:l===b&&s||(q[a]=l))
} else a&&(q[a]=d)
}, a=c = n=function(a, c, d, e, f){
if("string"==typeof a) return p[a] ? p[a](c):j(o(a, c).f);
if(!a.splice){
if(s=a, s.deps&&n(s.deps, s.callback), !c) return;
c.splice ? (a=c, c=d, d=null):a=b
}
return c=c||function(){}, "function"==typeof d&&(d=e, e=f), e ? m(b, a, c, d):setTimeout(function(){
m(b, a, c, d)
}, 4), n
}, n.config=function(a){
return n(a)
}, a._defined=q, d=function(a, b, c){
if("string"!=typeof a) throw new Error("See almond README: incorrect module build, no module name");
b.splice||(c=b, b=[]), e(q, a)||e(r, a)||(r[a]=[a, b, c])
}, d.amd={
jQuery: !0
}}(), b.requirejs=a, b.require=c, b.define=d
}}(), b.define("almond", function(){}), b.define("jquery", [], function(){
var b=a||$;
return null==b&&console&&console.error&&console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."), b
}), b.define("select2/utils", ["jquery"], function(a){
function b(a){
var b=a.prototype,
c=[];
for (var d in b){
var e=b[d];
"function"==typeof e&&"constructor"!==d&&c.push(d)
}
return c
}
var c={};
c.Extend=function(a, b){
function c(){
this.constructor=a
}
var d={}.hasOwnProperty;
for (var e in b) d.call(b, e)&&(a[e]=b[e]);
return c.prototype=b.prototype, a.prototype=new c, a.__super__=b.prototype, a
}, c.Decorate=function(a, c){
function d(){
var b=Array.prototype.unshift,
d=c.prototype.constructor.length,
e=a.prototype.constructor;
d > 0&&(b.call(arguments, a.prototype.constructor), e=c.prototype.constructor), e.apply(this, arguments)
}
function e(){
this.constructor=d
}
var f=b(c),
g=b(a);
c.displayName=a.displayName, d.prototype=new e;
for (var h=0; h < g.length; h++){
var i=g[h];
d.prototype[i]=a.prototype[i]
}
for (var j=(function(a){
var b=function(){};
a in d.prototype&&(b=d.prototype[a]);
var e=c.prototype[a];
return function(){
var a=Array.prototype.unshift;
return a.call(arguments, b), e.apply(this, arguments)
}}), k=0; k < f.length; k++){
var l=f[k];
d.prototype[l]=j(l)
}
return d
};
var d=function(){
this.listeners={}};
return d.prototype.on=function(a, b){
this.listeners=this.listeners||{}, a in this.listeners ? this.listeners[a].push(b):this.listeners[a]=[b]
}, d.prototype.trigger=function(a){
var b=Array.prototype.slice,
c=b.call(arguments, 1);
this.listeners=this.listeners||{}, null==c&&(c=[]), 0===c.length&&c.push({}), c[0]._type=a, a in this.listeners&&this.invoke(this.listeners[a], b.call(arguments, 1)), "*" in this.listeners&&this.invoke(this.listeners["*"], arguments)
}, d.prototype.invoke=function(a, b){
for (var c=0, d=a.length; d > c; c++) a[c].apply(this, b)
}, c.Observable=d, c.generateChars=function(a){
for (var b="", c=0; a > c; c++){
var d=Math.floor(36 * Math.random());
b +=d.toString(36)
}
return b
}, c.bind=function(a, b){
return function(){
a.apply(b, arguments)
}}, c._convertData=function(a){
for (var b in a){
var c=b.split("-"),
d=a;
if(1!==c.length){
for (var e=0; e < c.length; e++){
var f=c[e];
f=f.substring(0, 1).toLowerCase() + f.substring(1), f in d||(d[f]={}), e==c.length - 1&&(d[f]=a[b]), d=d[f]
}
delete a[b]
}}
return a
}, c.hasScroll=function(b, c){
var d=a(c),
e=c.style.overflowX,
f=c.style.overflowY;
return e!==f||"hidden"!==f&&"visible"!==f ? "scroll"===e||"scroll"===f ? !0:d.innerHeight() < c.scrollHeight||d.innerWidth() < c.scrollWidth:!1
}, c.escapeMarkup=function(a){
var b={
"\\": "&#92;",
"&": "&amp;",
"<": "&lt;",
">": "&gt;",
'"': "&quot;",
"'": "&#39;",
"/": "&#47;"
};
return "string"!=typeof a ? a:String(a).replace(/[&<>"'\/\\]/g, function(a){
return b[a]
})
}, c.appendMany=function(b, c){
if("1.7"===a.fn.jquery.substr(0, 3)){
var d=a();
a.map(c, function(a){
d=d.add(a)
}), c=d
}
b.append(c)
}, c
}), b.define("select2/results", ["jquery", "./utils"], function(a, b){
function c(a, b, d){
this.$element=a, this.data=d, this.options=b, c.__super__.constructor.call(this)
}
return b.Extend(c, b.Observable), c.prototype.render=function(){
var b=a('<ul class="select2-results__options" role="tree"></ul>');
return this.options.get("multiple")&&b.attr("aria-multiselectable", "true"), this.$results=b, b
}, c.prototype.clear=function(){
this.$results.empty()
}, c.prototype.displayMessage=function(b){
var c=this.options.get("escapeMarkup");
this.clear(), this.hideLoading();
var d=a('<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'),
e=this.options.get("translations").get(b.message);
d.append(c(e(b.args))), d[0].className +=" select2-results__message", this.$results.append(d)
}, c.prototype.hideMessages=function(){
this.$results.find(".select2-results__message").remove()
}, c.prototype.append=function(a){
this.hideLoading();
var b=[];
if(null==a.results||0===a.results.length) return void(0===this.$results.children().length&&this.trigger("results:message", {
message: "noResults"
}));
a.results=this.sort(a.results);
for (var c=0; c < a.results.length; c++){
var d=a.results[c],
e=this.option(d);
b.push(e)
}
this.$results.append(b)
}, c.prototype.position=function(a, b){
var c=b.find(".select2-results");
c.append(a)
}, c.prototype.sort=function(a){
var b=this.options.get("sorter");
return b(a)
}, c.prototype.highlightFirstItem=function(){
var a=this.$results.find(".select2-results__option[aria-selected]"),
b=a.filter("[aria-selected=true]");
b.length > 0 ? b.first().trigger("mouseenter"):a.first().trigger("mouseenter"), this.ensureHighlightVisible()
}, c.prototype.setClasses=function(){
var b=this;
this.data.current(function(c){
var d=a.map(c, function(a){
return a.id.toString()
}),
e=b.$results.find(".select2-results__option[aria-selected]");
e.each(function(){
var b=a(this),
c=a.data(this, "data"),
e="" + c.id;
null!=c.element&&c.element.selected||null==c.element&&a.inArray(e, d) > -1 ? b.attr("aria-selected", "true"):b.attr("aria-selected", "false")
})
})
}, c.prototype.showLoading=function(a){
this.hideLoading();
var b=this.options.get("translations").get("searching"),
c={
disabled: !0,
loading: !0,
text: b(a)
},
d=this.option(c);
d.className +=" loading-results", this.$results.prepend(d)
}, c.prototype.hideLoading=function(){
this.$results.find(".loading-results").remove()
}, c.prototype.option=function(b){
var c=document.createElement("li");
c.className="select2-results__option";
var d={
role: "treeitem",
"aria-selected": "false"
};
b.disabled&&(delete d["aria-selected"], d["aria-disabled"]="true"), null==b.id&&delete d["aria-selected"], null!=b._resultId&&(c.id=b._resultId), b.title&&(c.title=b.title), b.children&&(d.role="group", d["aria-label"]=b.text, delete d["aria-selected"]);
for (var e in d){
var f=d[e];
c.setAttribute(e, f)
}
if(b.children){
var g=a(c),
h=document.createElement("strong");
h.className="select2-results__group";
a(h);
this.template(b, h);
for (var i=[], j=0; j < b.children.length; j++){
var k=b.children[j],
l=this.option(k);
i.push(l)
}
var m=a("<ul></ul>", {
"class": "select2-results__options select2-results__options--nested"
});
m.append(i), g.append(h), g.append(m)
} else this.template(b, c);
return a.data(c, "data", b), c
}, c.prototype.bind=function(b, c){
var d=this,
e=b.id + "-results";
this.$results.attr("id", e), b.on("results:all", function(a){
d.clear(), d.append(a.data), b.isOpen()&&(d.setClasses(), d.highlightFirstItem())
}), b.on("results:append", function(a){
d.append(a.data), b.isOpen()&&d.setClasses()
}), b.on("query", function(a){
d.hideMessages(), d.showLoading(a)
}), b.on("select", function(){
b.isOpen()&&(d.setClasses(), d.highlightFirstItem())
}), b.on("unselect", function(){
b.isOpen()&&(d.setClasses(), d.highlightFirstItem())
}), b.on("open", function(){
d.$results.attr("aria-expanded", "true"), d.$results.attr("aria-hidden", "false"), d.setClasses(), d.ensureHighlightVisible()
}), b.on("close", function(){
d.$results.attr("aria-expanded", "false"), d.$results.attr("aria-hidden", "true"), d.$results.removeAttr("aria-activedescendant")
}), b.on("results:toggle", function(){
var a=d.getHighlightedResults();
0!==a.length&&a.trigger("mouseup")
}), b.on("results:select", function(){
var a=d.getHighlightedResults();
if(0!==a.length){
var b=a.data("data");
"true"==a.attr("aria-selected") ? d.trigger("close", {}):d.trigger("select", {
data: b
})
}}), b.on("results:previous", function(){
var a=d.getHighlightedResults(),
b=d.$results.find("[aria-selected]"),
c=b.index(a);
if(0!==c){
var e=c - 1;
0===a.length&&(e=0);
var f=b.eq(e);
f.trigger("mouseenter");
var g=d.$results.offset().top,
h=f.offset().top,
i=d.$results.scrollTop() + (h - g);
0===e ? d.$results.scrollTop(0):0 > h - g&&d.$results.scrollTop(i)
}}), b.on("results:next", function(){
var a=d.getHighlightedResults(),
b=d.$results.find("[aria-selected]"),
c=b.index(a),
e=c + 1;
if(!(e >=b.length)){
var f=b.eq(e);
f.trigger("mouseenter");
var g=d.$results.offset().top + d.$results.outerHeight(!1),
h=f.offset().top + f.outerHeight(!1),
i=d.$results.scrollTop() + h - g;
0===e ? d.$results.scrollTop(0):h > g&&d.$results.scrollTop(i)
}}), b.on("results:focus", function(a){
a.element.addClass("select2-results__option--highlighted")
}), b.on("results:message", function(a){
d.displayMessage(a)
}), a.fn.mousewheel&&this.$results.on("mousewheel", function(a){
var b=d.$results.scrollTop(),
c=d.$results.get(0).scrollHeight - b + a.deltaY,
e=a.deltaY > 0&&b - a.deltaY <=0,
f=a.deltaY < 0&&c <=d.$results.height();
e ? (d.$results.scrollTop(0), a.preventDefault(), a.stopPropagation()):f&&(d.$results.scrollTop(d.$results.get(0).scrollHeight - d.$results.height()), a.preventDefault(), a.stopPropagation())
}), this.$results.on("mouseup", ".select2-results__option[aria-selected]", function(b){
var c=a(this),
e=c.data("data");
return "true"===c.attr("aria-selected") ? void(d.options.get("multiple") ? d.trigger("unselect", {
originalEvent: b,
data: e
}):d.trigger("close", {})):void d.trigger("select", {
originalEvent: b,
data: e
})
}), this.$results.on("mouseenter", ".select2-results__option[aria-selected]", function(b){
var c=a(this).data("data");
d.getHighlightedResults().removeClass("select2-results__option--highlighted"), d.trigger("results:focus", {
data: c,
element: a(this)
})
})
}, c.prototype.getHighlightedResults=function(){
var a=this.$results.find(".select2-results__option--highlighted");
return a
}, c.prototype.destroy=function(){
this.$results.remove()
}, c.prototype.ensureHighlightVisible=function(){
var a=this.getHighlightedResults();
if(0!==a.length){
var b=this.$results.find("[aria-selected]"),
c=b.index(a),
d=this.$results.offset().top,
e=a.offset().top,
f=this.$results.scrollTop() + (e - d),
g=e - d;
f -=2 * a.outerHeight(!1), 2 >=c ? this.$results.scrollTop(0):(g > this.$results.outerHeight()||0 > g)&&this.$results.scrollTop(f)
}}, c.prototype.template=function(b, c){
var d=this.options.get("templateResult"),
e=this.options.get("escapeMarkup"),
f=d(b, c);
null==f ? c.style.display="none":"string"==typeof f ? c.innerHTML=e(f):a(c).append(f)
}, c
}), b.define("select2/keys", [], function(){
var a={
BACKSPACE: 8,
TAB: 9,
ENTER: 13,
SHIFT: 16,
CTRL: 17,
ALT: 18,
ESC: 27,
SPACE: 32,
PAGE_UP: 33,
PAGE_DOWN: 34,
END: 35,
HOME: 36,
LEFT: 37,
UP: 38,
RIGHT: 39,
DOWN: 40,
DELETE: 46
};
return a
}), b.define("select2/selection/base", ["jquery", "../utils", "../keys"], function(a, b, c){
function d(a, b){
this.$element=a, this.options=b, d.__super__.constructor.call(this)
}
return b.Extend(d, b.Observable), d.prototype.render=function(){
var b=a('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');
return this._tabindex=0, null!=this.$element.data("old-tabindex") ? this._tabindex=this.$element.data("old-tabindex"):null!=this.$element.attr("tabindex")&&(this._tabindex=this.$element.attr("tabindex")), b.attr("title", this.$element.attr("title")), b.attr("tabindex", this._tabindex), this.$selection=b, b
}, d.prototype.bind=function(a, b){
var d=this,
e=(a.id + "-container", a.id + "-results");
this.container=a, this.$selection.on("focus", function(a){
d.trigger("focus", a)
}), this.$selection.on("blur", function(a){
d._handleBlur(a)
}), this.$selection.on("keydown", function(a){
d.trigger("keypress", a), a.which===c.SPACE&&a.preventDefault()
}), a.on("results:focus", function(a){
d.$selection.attr("aria-activedescendant", a.data._resultId)
}), a.on("selection:update", function(a){
d.update(a.data)
}), a.on("open", function(){
d.$selection.attr("aria-expanded", "true"), d.$selection.attr("aria-owns", e), d._attachCloseHandler(a)
}), a.on("close", function(){
d.$selection.attr("aria-expanded", "false"), d.$selection.removeAttr("aria-activedescendant"), d.$selection.removeAttr("aria-owns"), d.$selection.focus(), d._detachCloseHandler(a)
}), a.on("enable", function(){
d.$selection.attr("tabindex", d._tabindex)
}), a.on("disable", function(){
d.$selection.attr("tabindex", "-1")
})
}, d.prototype._handleBlur=function(b){
var c=this;
window.setTimeout(function(){
document.activeElement==c.$selection[0]||a.contains(c.$selection[0], document.activeElement)||c.trigger("blur", b)
}, 1)
}, d.prototype._attachCloseHandler=function(b){
a(document.body).on("mousedown.select2." + b.id, function(b){
var c=a(b.target),
d=c.closest(".select2"),
e=a(".select2.select2-container--open");
e.each(function(){
var b=a(this);
if(this!=d[0]){
var c=b.data("element");
c.select2("close")
}})
})
}, d.prototype._detachCloseHandler=function(b){
a(document.body).off("mousedown.select2." + b.id)
}, d.prototype.position=function(a, b){
var c=b.find(".selection");
c.append(a)
}, d.prototype.destroy=function(){
this._detachCloseHandler(this.container)
}, d.prototype.update=function(a){
throw new Error("The `update` method must be defined in child classes.")
}, d
}), b.define("select2/selection/single", ["jquery", "./base", "../utils", "../keys"], function(a, b, c, d){
function e(){
e.__super__.constructor.apply(this, arguments)
}
return c.Extend(e, b), e.prototype.render=function(){
var a=e.__super__.render.call(this);
return a.addClass("select2-selection--single"), a.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'), a
}, e.prototype.bind=function(a, b){
var c=this;
e.__super__.bind.apply(this, arguments);
var d=a.id + "-container";
this.$selection.find(".select2-selection__rendered").attr("id", d), this.$selection.attr("aria-labelledby", d), this.$selection.on("mousedown", function(a){
1===a.which&&c.trigger("toggle", {
originalEvent: a
})
}), this.$selection.on("focus", function(a){}), this.$selection.on("blur", function(a){}), a.on("focus", function(b){
a.isOpen()||c.$selection.focus()
}), a.on("selection:update", function(a){
c.update(a.data)
})
}, e.prototype.clear=function(){
this.$selection.find(".select2-selection__rendered").empty()
}, e.prototype.display=function(a, b){
var c=this.options.get("templateSelection"),
d=this.options.get("escapeMarkup");
return d(c(a, b))
}, e.prototype.selectionContainer=function(){
return a("<span></span>")
}, e.prototype.update=function(a){
if(0===a.length) return void this.clear();
var b=a[0],
c=this.$selection.find(".select2-selection__rendered"),
d=this.display(b, c);
c.empty().append(d), c.prop("title", b.title||b.text)
}, e
}), b.define("select2/selection/multiple", ["jquery", "./base", "../utils"], function(a, b, c){
function d(a, b){
d.__super__.constructor.apply(this, arguments)
}
return c.Extend(d, b), d.prototype.render=function(){
var a=d.__super__.render.call(this);
return a.addClass("select2-selection--multiple"), a.html('<ul class="select2-selection__rendered"></ul>'), a
}, d.prototype.bind=function(b, c){
var e=this;
d.__super__.bind.apply(this, arguments), this.$selection.on("click", function(a){
e.trigger("toggle", {
originalEvent: a
})
}), this.$selection.on("click", ".select2-selection__choice__remove", function(b){
if(!e.options.get("disabled")){
var c=a(this),
d=c.parent(),
f=d.data("data");
e.trigger("unselect", {
originalEvent: b,
data: f
})
}})
}, d.prototype.clear=function(){
this.$selection.find(".select2-selection__rendered").empty()
}, d.prototype.display=function(a, b){
var c=this.options.get("templateSelection"),
d=this.options.get("escapeMarkup");
return d(c(a, b))
}, d.prototype.selectionContainer=function(){
var b=a('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>');
return b
}, d.prototype.update=function(a){
if(this.clear(), 0!==a.length){
for (var b=[], d=0; d < a.length; d++){
var e=a[d],
f=this.selectionContainer(),
g=this.display(e, f);
f.append(g), f.prop("title", e.title||e.text), f.data("data", e), b.push(f)
}
var h=this.$selection.find(".select2-selection__rendered");
c.appendMany(h, b)
}}, d
}), b.define("select2/selection/placeholder", ["../utils"], function(a){
function b(a, b, c){
this.placeholder=this.normalizePlaceholder(c.get("placeholder")), a.call(this, b, c)
}
return b.prototype.normalizePlaceholder=function(a, b){
return "string"==typeof b&&(b={
id: "",
text: b
}), b
}, b.prototype.createPlaceholder=function(a, b){
var c=this.selectionContainer();
return c.html(this.display(b)), c.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"), c
}, b.prototype.update=function(a, b){
var c=1==b.length&&b[0].id!=this.placeholder.id,
d=b.length > 1;
if(d||c) return a.call(this, b);
this.clear();
var e=this.createPlaceholder(this.placeholder);
this.$selection.find(".select2-selection__rendered").append(e)
}, b
}), b.define("select2/selection/allowClear", ["jquery", "../keys"], function(a, b){
function c(){}
return c.prototype.bind=function(a, b, c){
var d=this;
a.call(this, b, c), null==this.placeholder&&this.options.get("debug")&&window.console&&console.error&&console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."), this.$selection.on("mousedown", ".select2-selection__clear", function(a){
d._handleClear(a)
}), b.on("keypress", function(a){
d._handleKeyboardClear(a, b)
})
}, c.prototype._handleClear=function(a, b){
if(!this.options.get("disabled")){
var c=this.$selection.find(".select2-selection__clear");
if(0!==c.length){
b.stopPropagation();
for (var d=c.data("data"), e=0; e < d.length; e++){
var f={
data: d[e]
};
if(this.trigger("unselect", f), f.prevented) return
}
this.$element.val(this.placeholder.id).trigger("change"), this.trigger("toggle", {})
}}
}, c.prototype._handleKeyboardClear=function(a, c, d){
d.isOpen()||(c.which==b.DELETE||c.which==b.BACKSPACE)&&this._handleClear(c)
}, c.prototype.update=function(b, c){
if(b.call(this, c), !(this.$selection.find(".select2-selection__placeholder").length > 0||0===c.length)){
var d=a('<span class="select2-selection__clear">&times;</span>');
d.data("data", c), this.$selection.find(".select2-selection__rendered").prepend(d)
}}, c
}), b.define("select2/selection/search", ["jquery", "../utils", "../keys"], function(a, b, c){
function d(a, b, c){
a.call(this, b, c)
}
return d.prototype.render=function(b){
var c=a('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>');
this.$searchContainer=c, this.$search=c.find("input");
var d=b.call(this);
return this._transferTabIndex(), d
}, d.prototype.bind=function(a, b, d){
var e=this;
a.call(this, b, d), b.on("open", function(){
e.$search.trigger("focus")
}), b.on("close", function(){
e.$search.val(""), e.$search.removeAttr("aria-activedescendant"), e.$search.trigger("focus")
}), b.on("enable", function(){
e.$search.prop("disabled", !1), e._transferTabIndex()
}), b.on("disable", function(){
e.$search.prop("disabled", !0)
}), b.on("focus", function(a){
e.$search.trigger("focus")
}), b.on("results:focus", function(a){
e.$search.attr("aria-activedescendant", a.id)
}), this.$selection.on("focusin", ".select2-search--inline", function(a){
e.trigger("focus", a)
}), this.$selection.on("focusout", ".select2-search--inline", function(a){
e._handleBlur(a)
}), this.$selection.on("keydown", ".select2-search--inline", function(a){
a.stopPropagation(), e.trigger("keypress", a), e._keyUpPrevented=a.isDefaultPrevented();
var b=a.which;
if(b===c.BACKSPACE&&""===e.$search.val()){
var d=e.$searchContainer.prev(".select2-selection__choice");
if(d.length > 0){
var f=d.data("data");
e.searchRemoveChoice(f), a.preventDefault()
}}
});
var f=document.documentMode,
g=f&&11 >=f;
this.$selection.on("input.searchcheck", ".select2-search--inline", function(a){
return g ? void e.$selection.off("input.search input.searchcheck"):void e.$selection.off("keyup.search")
}), this.$selection.on("keyup.search input.search", ".select2-search--inline", function(a){
if(g&&"input"===a.type) return void e.$selection.off("input.search input.searchcheck");
var b=a.which;
b!=c.SHIFT&&b!=c.CTRL&&b!=c.ALT&&b!=c.TAB&&e.handleSearch(a)
})
}, d.prototype._transferTabIndex=function(a){
this.$search.attr("tabindex", this.$selection.attr("tabindex")), this.$selection.attr("tabindex", "-1")
}, d.prototype.createPlaceholder=function(a, b){
this.$search.attr("placeholder", b.text)
}, d.prototype.update=function(a, b){
var c=this.$search[0]==document.activeElement;
this.$search.attr("placeholder", ""), a.call(this, b), this.$selection.find(".select2-selection__rendered").append(this.$searchContainer), this.resizeSearch(), c&&this.$search.focus()
}, d.prototype.handleSearch=function(){
if(this.resizeSearch(), !this._keyUpPrevented){
var a=this.$search.val();
this.trigger("query", {
term: a
})
}
this._keyUpPrevented = !1
}, d.prototype.searchRemoveChoice=function(a, b){
this.trigger("unselect", {
data: b
}), this.$search.val(b.text), this.handleSearch()
}, d.prototype.resizeSearch=function(){
this.$search.css("width", "25px");
var a="";
if(""!==this.$search.attr("placeholder")) a=this.$selection.find(".select2-selection__rendered").innerWidth();
else {
var b=this.$search.val().length + 1;
a=.75 * b + "em"
}
this.$search.css("width", a)
}, d
}), b.define("select2/selection/eventRelay", ["jquery"], function(a){
function b(){}
return b.prototype.bind=function(b, c, d){
var e=this,
f=["open", "opening", "close", "closing", "select", "selecting", "unselect", "unselecting"],
g=["opening", "closing", "selecting", "unselecting"];
b.call(this, c, d), c.on("*", function(b, c){
if(-1!==a.inArray(b, f)){
c=c||{};
var d=a.Event("select2:" + b, {
params: c
});
e.$element.trigger(d), -1!==a.inArray(b, g)&&(c.prevented=d.isDefaultPrevented())
}})
}, b
}), b.define("select2/translation", ["jquery", "require"], function(a, b){
function c(a){
this.dict=a||{}}
return c.prototype.all=function(){
return this.dict
}, c.prototype.get=function(a){
return this.dict[a]
}, c.prototype.extend=function(b){
this.dict=a.extend({}, b.all(), this.dict)
}, c._cache={}, c.loadPath=function(a){
if(!(a in c._cache)){
var d=b(a);
c._cache[a]=d
}
return new c(c._cache[a])
}, c
}), b.define("select2/diacritics", [], function(){
var a={};
return a
}), b.define("select2/data/base", ["../utils"], function(a){
function b(a, c){
b.__super__.constructor.call(this)
}
return a.Extend(b, a.Observable), b.prototype.current=function(a){
throw new Error("The `current` method must be defined in child classes.")
}, b.prototype.query=function(a, b){
throw new Error("The `query` method must be defined in child classes.")
}, b.prototype.bind=function(a, b){}, b.prototype.destroy=function(){}, b.prototype.generateResultId=function(b, c){
var d=b.id + "-result-";
return d +=a.generateChars(4), d +=null!=c.id ? "-" + c.id.toString():"-" + a.generateChars(4)
}, b
}), b.define("select2/data/select", ["./base", "../utils", "jquery"], function(a, b, c){
function d(a, b){
this.$element=a, this.options=b, d.__super__.constructor.call(this)
}
return b.Extend(d, a), d.prototype.current=function(a){
var b=[],
d=this;
this.$element.find(":selected").each(function(){
var a=c(this),
e=d.item(a);
b.push(e)
}), a(b)
}, d.prototype.select=function(a){
var b=this;
if(a.selected = !0, c(a.element).is("option")) return a.element.selected = !0, void this.$element.trigger("change");
if(this.$element.prop("multiple")) this.current(function(d){
var e=[];
a=[a], a.push.apply(a, d);
for (var f=0; f < a.length; f++){
var g=a[f].id; - 1===c.inArray(g, e)&&e.push(g)
}
b.$element.val(e), b.$element.trigger("change")
});
else {
var d=a.id;
this.$element.val(d), this.$element.trigger("change")
}}, d.prototype.unselect=function(a){
var b=this;
if(this.$element.prop("multiple")) return a.selected = !1, c(a.element).is("option") ? (a.element.selected = !1, void this.$element.trigger("change")):void this.current(function(d){
for (var e=[], f=0; f < d.length; f++){
var g=d[f].id;
g!==a.id&&-1===c.inArray(g, e)&&e.push(g)
}
b.$element.val(e), b.$element.trigger("change")
})
}, d.prototype.bind=function(a, b){
var c=this;
this.container=a, a.on("select", function(a){
c.select(a.data)
}), a.on("unselect", function(a){
c.unselect(a.data)
})
}, d.prototype.destroy=function(){
this.$element.find("*").each(function(){
c.removeData(this, "data")
})
}, d.prototype.query=function(a, b){
var d=[],
e=this,
f=this.$element.children();
f.each(function(){
var b=c(this);
if(b.is("option")||b.is("optgroup")){
var f=e.item(b),
g=e.matches(a, f);
null!==g&&d.push(g)
}}), b({
results: d
})
}, d.prototype.addOptions=function(a){
b.appendMany(this.$element, a)
}, d.prototype.option=function(a){
var b;
a.children ? (b=document.createElement("optgroup"), b.label=a.text):(b=document.createElement("option"), void 0!==b.textContent ? b.textContent=a.text:b.innerText=a.text), a.id&&(b.value=a.id), a.disabled&&(b.disabled = !0), a.selected&&(b.selected = !0), a.title&&(b.title=a.title);
var d=c(b),
e=this._normalizeItem(a);
return e.element=b, c.data(b, "data", e), d
}, d.prototype.item=function(a){
var b={};
if(b=c.data(a[0], "data"), null!=b) return b;
if(a.is("option")) b={
id: a.val(),
text: a.text(),
disabled: a.prop("disabled"),
selected: a.prop("selected"),
title: a.prop("title")
};
else if(a.is("optgroup")){
b={
text: a.prop("label"),
children: [],
title: a.prop("title")
};
for (var d=a.children("option"), e=[], f=0; f < d.length; f++){
var g=c(d[f]),
h=this.item(g);
e.push(h)
}
b.children=e
}
return b=this._normalizeItem(b), b.element=a[0], c.data(a[0], "data", b), b
}, d.prototype._normalizeItem=function(a){
c.isPlainObject(a)||(a={
id: a,
text: a
}), a=c.extend({}, {
text: ""
}, a);
var b={
selected: !1,
disabled: !1
};
return null!=a.id&&(a.id=a.id.toString()), null!=a.text&&(a.text=a.text.toString()), null==a._resultId&&a.id&&null!=this.container&&(a._resultId=this.generateResultId(this.container, a)), c.extend({}, b, a)
}, d.prototype.matches=function(a, b){
var c=this.options.get("matcher");
return c(a, b)
}, d
}), b.define("select2/data/array", ["./select", "../utils", "jquery"], function(a, b, c){
function d(a, b){
var c=b.get("data")||[];
d.__super__.constructor.call(this, a, b), this.addOptions(this.convertToOptions(c))
}
return b.Extend(d, a), d.prototype.select=function(a){
var b=this.$element.find("option").filter(function(b, c){
return c.value==a.id.toString()
});
0===b.length&&(b=this.option(a), this.addOptions(b)), d.__super__.select.call(this, a)
}, d.prototype.convertToOptions=function(a){
function d(a){
return function(){
return c(this).val()==a.id
}}
for (var e=this, f=this.$element.find("option"), g=f.map(function(){
return e.item(c(this)).id
}).get(), h=[], i=0; i < a.length; i++){
var j=this._normalizeItem(a[i]);
if(c.inArray(j.id, g) >=0){
var k=f.filter(d(j)),
l=this.item(k),
m=c.extend(!0, {}, j, l),
n=this.option(m);
k.replaceWith(n)
}else{
var o=this.option(j);
if(j.children){
var p=this.convertToOptions(j.children);
b.appendMany(o, p)
}
h.push(o)
}}
return h
}, d
}), b.define("select2/data/ajax", ["./array", "../utils", "jquery"], function(a, b, c){
function d(a, b){
this.ajaxOptions=this._applyDefaults(b.get("ajax")), null!=this.ajaxOptions.processResults&&(this.processResults=this.ajaxOptions.processResults), d.__super__.constructor.call(this, a, b)
}
return b.Extend(d, a), d.prototype._applyDefaults=function(a){
var b={
data: function(a){
return c.extend({}, a, {
q: a.term
})
},
transport: function(a, b, d){
var e=c.ajax(a);
return e.then(b), e.fail(d), e
}};
return c.extend({}, b, a, !0)
}, d.prototype.processResults=function(a){
return a
}, d.prototype.query=function(a, b){
function d(){
var d=f.transport(f, function(d){
var f=e.processResults(d, a);
e.options.get("debug")&&window.console&&console.error&&(f&&f.results&&c.isArray(f.results)||console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")), b(f)
}, function(){
d.status&&"0"===d.status||e.trigger("results:message", {
message: "errorLoading"
})
});
e._request=d
}
var e=this;
null!=this._request&&(c.isFunction(this._request.abort)&&this._request.abort(), this._request=null);
var f=c.extend({
type: "GET"
}, this.ajaxOptions);
"function"==typeof f.url&&(f.url=f.url.call(this.$element, a)), "function"==typeof f.data&&(f.data=f.data.call(this.$element, a)), this.ajaxOptions.delay&&null!=a.term ? (this._queryTimeout&&window.clearTimeout(this._queryTimeout), this._queryTimeout=window.setTimeout(d, this.ajaxOptions.delay)):d()
}, d
}), b.define("select2/data/tags", ["jquery"], function(a){
function b(b, c, d){
var e=d.get("tags"),
f=d.get("createTag");
void 0!==f&&(this.createTag=f);
var g=d.get("insertTag");
if(void 0!==g&&(this.insertTag=g), b.call(this, c, d), a.isArray(e))
for (var h=0; h < e.length; h++){
var i=e[h],
j=this._normalizeItem(i),
k=this.option(j);
this.$element.append(k)
}}
return b.prototype.query=function(a, b, c){
function d(a, f){
for (var g=a.results, h=0; h < g.length; h++){
var i=g[h],
j=null!=i.children&&!d({
results: i.children
}, !0),
k=i.text===b.term;
if(k||j) return f ? !1:(a.data=g, void c(a))
}
if(f) return !0;
var l=e.createTag(b);
if(null!=l){
var m=e.option(l);
m.attr("data-select2-tag", !0), e.addOptions([m]), e.insertTag(g, l)
}
a.results=g, c(a)
}
var e=this;
return this._removeOldTags(), null==b.term||null!=b.page ? void a.call(this, b, c):void a.call(this, b, d)
}, b.prototype.createTag=function(b, c){
var d=a.trim(c.term);
return ""===d ? null:{
id: d,
text: d
}}, b.prototype.insertTag=function(a, b, c){
b.unshift(c)
}, b.prototype._removeOldTags=function(b){
var c=(this._lastTag, this.$element.find("option[data-select2-tag]"));
c.each(function(){
this.selected||a(this).remove()
})
}, b
}), b.define("select2/data/tokenizer", ["jquery"], function(a){
function b(a, b, c){
var d=c.get("tokenizer");
void 0!==d&&(this.tokenizer=d), a.call(this, b, c)
}
return b.prototype.bind=function(a, b, c){
a.call(this, b, c), this.$search=b.dropdown.$search||b.selection.$search||c.find(".select2-search__field")
}, b.prototype.query=function(b, c, d){
function e(b){
var c=g._normalizeItem(b),
d=g.$element.find("option").filter(function(){
return a(this).val()===c.id
});
if(!d.length){
var e=g.option(c);
e.attr("data-select2-tag", !0), g._removeOldTags(), g.addOptions([e])
}
f(c)
}
function f(a){
g.trigger("select", {
data: a
})
}
var g=this;
c.term=c.term||"";
var h=this.tokenizer(c, this.options, e);
h.term!==c.term&&(this.$search.length&&(this.$search.val(h.term), this.$search.focus()), c.term=h.term), b.call(this, c, d)
}, b.prototype.tokenizer=function(b, c, d, e){
for (var f=d.get("tokenSeparators")||[], g=c.term, h=0, i=this.createTag||function(a){
return {
id: a.term,
text: a.term
}}; h < g.length;){
var j=g[h];
if(-1!==a.inArray(j, f)){
var k=g.substr(0, h),
l=a.extend({}, c, {
term: k
}),
m=i(l);
null!=m ? (e(m), g=g.substr(h + 1)||"", h=0):h++
} else h++
}
return {
term: g
}}, b
}), b.define("select2/data/minimumInputLength", [], function(){
function a(a, b, c){
this.minimumInputLength=c.get("minimumInputLength"), a.call(this, b, c)
}
return a.prototype.query=function(a, b, c){
return b.term=b.term||"", b.term.length < this.minimumInputLength ? void this.trigger("results:message", {
message: "inputTooShort",
args: {
minimum: this.minimumInputLength,
input: b.term,
params: b
}}):void a.call(this, b, c)
}, a
}), b.define("select2/data/maximumInputLength", [], function(){
function a(a, b, c){
this.maximumInputLength=c.get("maximumInputLength"), a.call(this, b, c)
}
return a.prototype.query=function(a, b, c){
return b.term=b.term||"", this.maximumInputLength > 0&&b.term.length > this.maximumInputLength ? void this.trigger("results:message", {
message: "inputTooLong",
args: {
maximum: this.maximumInputLength,
input: b.term,
params: b
}}):void a.call(this, b, c)
}, a
}), b.define("select2/data/maximumSelectionLength", [], function(){
function a(a, b, c){
this.maximumSelectionLength=c.get("maximumSelectionLength"), a.call(this, b, c)
}
return a.prototype.query=function(a, b, c){
var d=this;
this.current(function(e){
var f=null!=e ? e.length:0;
return d.maximumSelectionLength > 0&&f >=d.maximumSelectionLength ? void d.trigger("results:message", {
message: "maximumSelected",
args: {
maximum: d.maximumSelectionLength
}}):void a.call(d, b, c)
})
}, a
}), b.define("select2/dropdown", ["jquery", "./utils"], function(a, b){
function c(a, b){
this.$element=a, this.options=b, c.__super__.constructor.call(this)
}
return b.Extend(c, b.Observable), c.prototype.render=function(){
var b=a('<span class="select2-dropdown"><span class="select2-results"></span></span>');
return b.attr("dir", this.options.get("dir")), this.$dropdown=b, b
}, c.prototype.bind=function(){}, c.prototype.position=function(a, b){}, c.prototype.destroy=function(){
this.$dropdown.remove()
}, c
}), b.define("select2/dropdown/search", ["jquery", "../utils"], function(a, b){
function c(){}
return c.prototype.render=function(b){
var c=b.call(this),
d=a('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" /></span>');
return this.$searchContainer=d, this.$search=d.find("input"), c.prepend(d), c
}, c.prototype.bind=function(b, c, d){
var e=this;
b.call(this, c, d), this.$search.on("keydown", function(a){
e.trigger("keypress", a), e._keyUpPrevented=a.isDefaultPrevented()
}), this.$search.on("input", function(b){
a(this).off("keyup")
}), this.$search.on("keyup input", function(a){
e.handleSearch(a)
}), c.on("open", function(){
e.$search.attr("tabindex", 0), e.$search.focus(), window.setTimeout(function(){
e.$search.focus()
}, 0)
}), c.on("close", function(){
e.$search.attr("tabindex", -1), e.$search.val("")
}), c.on("focus", function(){
c.isOpen()&&e.$search.focus()
}), c.on("results:all", function(a){
if(null==a.query.term||""===a.query.term){
var b=e.showSearch(a);
b ? e.$searchContainer.removeClass("select2-search--hide"):e.$searchContainer.addClass("select2-search--hide")
}})
}, c.prototype.handleSearch=function(a){
if(!this._keyUpPrevented){
var b=this.$search.val();
this.trigger("query", {
term: b
})
}
this._keyUpPrevented = !1
}, c.prototype.showSearch=function(a, b){
return !0
}, c
}), b.define("select2/dropdown/hidePlaceholder", [], function(){
function a(a, b, c, d){
this.placeholder=this.normalizePlaceholder(c.get("placeholder")), a.call(this, b, c, d)
}
return a.prototype.append=function(a, b){
b.results=this.removePlaceholder(b.results), a.call(this, b)
}, a.prototype.normalizePlaceholder=function(a, b){
return "string"==typeof b&&(b={
id: "",
text: b
}), b
}, a.prototype.removePlaceholder=function(a, b){
for (var c=b.slice(0), d=b.length - 1; d >=0; d--){
var e=b[d];
this.placeholder.id===e.id&&c.splice(d, 1)
}
return c
}, a
}), b.define("select2/dropdown/infiniteScroll", ["jquery"], function(a){
function b(a, b, c, d){
this.lastParams={}, a.call(this, b, c, d), this.$loadingMore=this.createLoadingMore(), this.loading = !1
}
return b.prototype.append=function(a, b){
this.$loadingMore.remove(), this.loading = !1, a.call(this, b), this.showLoadingMore(b)&&this.$results.append(this.$loadingMore)
}, b.prototype.bind=function(b, c, d){
var e=this;
b.call(this, c, d), c.on("query", function(a){
e.lastParams=a, e.loading = !0
}), c.on("query:append", function(a){
e.lastParams=a, e.loading = !0
}), this.$results.on("scroll", function(){
var b=a.contains(document.documentElement, e.$loadingMore[0]);
if(!e.loading&&b){
var c=e.$results.offset().top + e.$results.outerHeight(!1),
d=e.$loadingMore.offset().top + e.$loadingMore.outerHeight(!1);
c + 50 >=d&&e.loadMore()
}})
}, b.prototype.loadMore=function(){
this.loading = !0;
var b=a.extend({}, {
page: 1
}, this.lastParams);
b.page++, this.trigger("query:append", b)
}, b.prototype.showLoadingMore=function(a, b){
return b.pagination&&b.pagination.more
}, b.prototype.createLoadingMore=function(){
var b=a('<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'),
c=this.options.get("translations").get("loadingMore");
return b.html(c(this.lastParams)), b
}, b
}), b.define("select2/dropdown/attachBody", ["jquery", "../utils"], function(a, b){
function c(b, c, d){
this.$dropdownParent=d.get("dropdownParent")||a(document.body), b.call(this, c, d)
}
return c.prototype.bind=function(a, b, c){
var d=this,
e = !1;
a.call(this, b, c), b.on("open", function(){
d._showDropdown(), d._attachPositioningHandler(b), e||(e = !0, b.on("results:all", function(){
d._positionDropdown(), d._resizeDropdown()
}), b.on("results:append", function(){
d._positionDropdown(), d._resizeDropdown()
}))
}), b.on("close", function(){
d._hideDropdown(), d._detachPositioningHandler(b)
}), this.$dropdownContainer.on("mousedown", function(a){
a.stopPropagation()
})
}, c.prototype.destroy=function(a){
a.call(this), this.$dropdownContainer.remove()
}, c.prototype.position=function(a, b, c){
b.attr("class", c.attr("class")), b.removeClass("select2"), b.addClass("select2-container--open"), b.css({
position: "absolute",
top: -999999
}), this.$container=c
}, c.prototype.render=function(b){
var c=a("<span></span>"),
d=b.call(this);
return c.append(d), this.$dropdownContainer=c, c
}, c.prototype._hideDropdown=function(a){
this.$dropdownContainer.detach()
}, c.prototype._attachPositioningHandler=function(c, d){
var e=this,
f="scroll.select2." + d.id,
g="resize.select2." + d.id,
h="orientationchange.select2." + d.id,
i=this.$container.parents().filter(b.hasScroll);
i.each(function(){
a(this).data("select2-scroll-position", {
x: a(this).scrollLeft(),
y: a(this).scrollTop()
})
}), i.on(f, function(b){
var c=a(this).data("select2-scroll-position");
a(this).scrollTop(c.y)
}), a(window).on(f + " " + g + " " + h, function(a){
e._positionDropdown(), e._resizeDropdown()
})
}, c.prototype._detachPositioningHandler=function(c, d){
var e="scroll.select2." + d.id,
f="resize.select2." + d.id,
g="orientationchange.select2." + d.id,
h=this.$container.parents().filter(b.hasScroll);
h.off(e), a(window).off(e + " " + f + " " + g)
}, c.prototype._positionDropdown=function(){
var b=a(window),
c=this.$dropdown.hasClass("select2-dropdown--above"),
d=this.$dropdown.hasClass("select2-dropdown--below"),
e=null,
f=this.$container.offset();
f.bottom=f.top + this.$container.outerHeight(!1);
var g={
height: this.$container.outerHeight(!1)
};
g.top=f.top, g.bottom=f.top + g.height;
var h={
height: this.$dropdown.outerHeight(!1)
},
i={
top: b.scrollTop(),
bottom: b.scrollTop() + b.height()
},
j=i.top < f.top - h.height,
k=i.bottom > f.bottom + h.height,
l={
left: f.left,
top: g.bottom
},
m=this.$dropdownParent;
"static"===m.css("position")&&(m=m.offsetParent());
var n=m.offset();
l.top -=n.top, l.left -=n.left, c||d || (e="below"), k||!j||c ? !j&&k && c&&(e="below"):e="above", ("above"==e||c&&"below"!==e)&&(l.top=g.top - n.top - h.height), null!=e&&(this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--" + e), this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--" + e)), this.$dropdownContainer.css(l)
}, c.prototype._resizeDropdown=function(){
var a={
width: this.$container.outerWidth(!1) + "px"
};
this.options.get("dropdownAutoWidth")&&(a.minWidth=a.width, a.position="relative", a.width="auto"), this.$dropdown.css(a)
}, c.prototype._showDropdown=function(a){
this.$dropdownContainer.appendTo(this.$dropdownParent), this._positionDropdown(), this._resizeDropdown()
}, c
}), b.define("select2/dropdown/minimumResultsForSearch", [], function(){
function a(b){
for (var c=0, d=0; d < b.length; d++){
var e=b[d];
e.children ? c +=a(e.children):c++
}
return c
}
function b(a, b, c, d){
this.minimumResultsForSearch=c.get("minimumResultsForSearch"), this.minimumResultsForSearch < 0&&(this.minimumResultsForSearch=1 / 0), a.call(this, b, c, d)
}
return b.prototype.showSearch=function(b, c){
return a(c.data.results) < this.minimumResultsForSearch ? !1:b.call(this, c)
}, b
}), b.define("select2/dropdown/selectOnClose", [], function(){
function a(){}
return a.prototype.bind=function(a, b, c){
var d=this;
a.call(this, b, c), b.on("close", function(a){
d._handleSelectOnClose(a)
})
}, a.prototype._handleSelectOnClose=function(a, b){
if(b&&null!=b.originalSelect2Event){
var c=b.originalSelect2Event;
if("select"===c._type||"unselect"===c._type) return
}
var d=this.getHighlightedResults();
if(!(d.length < 1)){
var e=d.data("data");
null!=e.element&&e.element.selected||null==e.element&&e.selected||this.trigger("select", {
data: e
})
}}, a
}), b.define("select2/dropdown/closeOnSelect", [], function(){
function a(){}
return a.prototype.bind=function(a, b, c){
var d=this;
a.call(this, b, c), b.on("select", function(a){
d._selectTriggered(a)
}), b.on("unselect", function(a){
d._selectTriggered(a)
})
}, a.prototype._selectTriggered=function(a, b){
var c=b.originalEvent;
c&&c.ctrlKey||this.trigger("close", {
originalEvent: c,
originalSelect2Event: b
})
}, a
}), b.define("select2/i18n/en", [], function(){
return {
errorLoading: function(){
return "The results could not be loaded."
},
inputTooLong: function(a){
var b=a.input.length - a.maximum,
c="Please delete " + b + " character";
return 1!=b&&(c +="s"), c
},
inputTooShort: function(a){
var b=a.minimum - a.input.length,
c="Please enter " + b + " or more characters";
return c
},
loadingMore: function(){
return "Loading more results..."
},
maximumSelected: function(a){
var b="You can only select " + a.maximum + " item";
return 1!=a.maximum&&(b +="s"), b
},
noResults: function(){
return "No results found"
},
searching: function(){
return "Searching..."
}}
}), b.define("select2/defaults", ["jquery", "require", "./results", "./selection/single", "./selection/multiple", "./selection/placeholder", "./selection/allowClear", "./selection/search", "./selection/eventRelay", "./utils", "./translation", "./diacritics", "./data/select", "./data/array", "./data/ajax", "./data/tags", "./data/tokenizer", "./data/minimumInputLength", "./data/maximumInputLength", "./data/maximumSelectionLength", "./dropdown", "./dropdown/search", "./dropdown/hidePlaceholder", "./dropdown/infiniteScroll", "./dropdown/attachBody", "./dropdown/minimumResultsForSearch", "./dropdown/selectOnClose", "./dropdown/closeOnSelect", "./i18n/en"], function(a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C){
function D(){
this.reset()
}
D.prototype.apply=function(l){
if(l=a.extend(!0, {}, this.defaults, l), null==l.dataAdapter){
if(null!=l.ajax ? l.dataAdapter=o:null!=l.data ? l.dataAdapter=n:l.dataAdapter=m, l.minimumInputLength > 0&&(l.dataAdapter=j.Decorate(l.dataAdapter, r)), l.maximumInputLength > 0&&(l.dataAdapter=j.Decorate(l.dataAdapter, s)), l.maximumSelectionLength > 0&&(l.dataAdapter=j.Decorate(l.dataAdapter, t)), l.tags&&(l.dataAdapter=j.Decorate(l.dataAdapter, p)), (null!=l.tokenSeparators||null!=l.tokenizer)&&(l.dataAdapter=j.Decorate(l.dataAdapter, q)), null!=l.query){
var C=b(l.amdBase + "compat/query");
l.dataAdapter=j.Decorate(l.dataAdapter, C)
}
if(null!=l.initSelection){
var D=b(l.amdBase + "compat/initSelection");
l.dataAdapter=j.Decorate(l.dataAdapter, D)
}}
if(null==l.resultsAdapter&&(l.resultsAdapter=c, null!=l.ajax&&(l.resultsAdapter=j.Decorate(l.resultsAdapter, x)), null!=l.placeholder&&(l.resultsAdapter=j.Decorate(l.resultsAdapter, w)), l.selectOnClose&&(l.resultsAdapter=j.Decorate(l.resultsAdapter, A))), null==l.dropdownAdapter){
if(l.multiple) l.dropdownAdapter=u;
else {
var E=j.Decorate(u, v);
l.dropdownAdapter=E
}
if(0!==l.minimumResultsForSearch&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter, z)), l.closeOnSelect&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter, B)), null!=l.dropdownCssClass||null!=l.dropdownCss||null!=l.adaptDropdownCssClass){
var F=b(l.amdBase + "compat/dropdownCss");
l.dropdownAdapter=j.Decorate(l.dropdownAdapter, F)
}
l.dropdownAdapter=j.Decorate(l.dropdownAdapter, y)
}
if(null==l.selectionAdapter){
if(l.multiple ? l.selectionAdapter=e:l.selectionAdapter=d, null!=l.placeholder&&(l.selectionAdapter=j.Decorate(l.selectionAdapter, f)), l.allowClear&&(l.selectionAdapter=j.Decorate(l.selectionAdapter, g)), l.multiple&&(l.selectionAdapter=j.Decorate(l.selectionAdapter, h)), null!=l.containerCssClass||null!=l.containerCss||null!=l.adaptContainerCssClass){
var G=b(l.amdBase + "compat/containerCss");
l.selectionAdapter=j.Decorate(l.selectionAdapter, G)
}
l.selectionAdapter=j.Decorate(l.selectionAdapter, i)
}
if("string"==typeof l.language)
if(l.language.indexOf("-") > 0){
var H=l.language.split("-"),
I=H[0];
l.language=[l.language, I]
} else l.language=[l.language];
if(a.isArray(l.language)){
var J=new k;
l.language.push("en");
for (var K=l.language, L=0; L < K.length; L++){
var M=K[L],
N={};
try {
N=k.loadPath(M)
} catch (O){
try {
M=this.defaults.amdLanguageBase + M, N=k.loadPath(M)
} catch (P){
l.debug&&window.console&&console.warn&&console.warn('Select2: The language file for "' + M + '" could not be automatically loaded. A fallback will be used instead.');
continue
}}
J.extend(N)
}
l.translations=J
}else{
var Q=k.loadPath(this.defaults.amdLanguageBase + "en"),
R=new k(l.language);
R.extend(Q), l.translations=R
}
return l
}, D.prototype.reset=function(){
function b(a){
function b(a){
return l[a]||a
}
return a.replace(/[^\u0000-\u007E]/g, b)
}
function c(d, e){
if(""===a.trim(d.term)) return e;
if(e.children&&e.children.length > 0){
for (var f=a.extend(!0, {}, e), g=e.children.length - 1; g >=0; g--){
var h=e.children[g],
i=c(d, h);
null==i&&f.children.splice(g, 1)
}
return f.children.length > 0 ? f:c(d, f)
}
var j=b(e.text).toUpperCase(),
k=b(d.term).toUpperCase();
return j.indexOf(k) > -1 ? e:null
}
this.defaults={
amdBase: "./",
amdLanguageBase: "./i18n/",
closeOnSelect: !0,
debug: !1,
dropdownAutoWidth: !1,
escapeMarkup: j.escapeMarkup,
language: C,
matcher: c,
minimumInputLength: 0,
maximumInputLength: 0,
maximumSelectionLength: 0,
minimumResultsForSearch: 0,
selectOnClose: !1,
sorter: function(a){
return a
},
templateResult: function(a){
return a.text
},
templateSelection: function(a){
return a.text
},
theme: "default",
width: "resolve"
}}, D.prototype.set=function(b, c){
var d=a.camelCase(b),
e={};
e[d]=c;
var f=j._convertData(e);
a.extend(this.defaults, f)
};
var E=new D;
return E
}), b.define("select2/options", ["require", "jquery", "./defaults", "./utils"], function(a, b, c, d){
function e(b, e){
if(this.options=b, null!=e&&this.fromElement(e), this.options=c.apply(this.options), e&&e.is("input")){
var f=a(this.get("amdBase") + "compat/inputData");
this.options.dataAdapter=d.Decorate(this.options.dataAdapter, f)
}}
return e.prototype.fromElement=function(a){
var c=["select2"];
null==this.options.multiple&&(this.options.multiple=a.prop("multiple")), null==this.options.disabled&&(this.options.disabled=a.prop("disabled")), null==this.options.language&&(a.prop("lang") ? this.options.language=a.prop("lang").toLowerCase():a.closest("[lang]").prop("lang")&&(this.options.language=a.closest("[lang]").prop("lang"))), null==this.options.dir&&(a.prop("dir") ? this.options.dir=a.prop("dir"):a.closest("[dir]").prop("dir") ? this.options.dir=a.closest("[dir]").prop("dir"):this.options.dir="ltr"), a.prop("disabled", this.options.disabled), a.prop("multiple", this.options.multiple), a.data("select2Tags")&&(this.options.debug&&window.console&&console.warn&&console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'), a.data("data", a.data("select2Tags")), a.data("tags", !0)), a.data("ajaxUrl")&&(this.options.debug&&window.console&&console.warn&&console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."), a.attr("ajax--url", a.data("ajaxUrl")), a.data("ajax--url", a.data("ajaxUrl")));
var e={};
e=b.fn.jquery&&"1."==b.fn.jquery.substr(0, 2)&&a[0].dataset ? b.extend(!0, {}, a[0].dataset, a.data()):a.data();
var f=b.extend(!0, {}, e);
f=d._convertData(f);
for (var g in f) b.inArray(g, c) > -1||(b.isPlainObject(this.options[g]) ? b.extend(this.options[g], f[g]):this.options[g]=f[g]);
return this
}, e.prototype.get=function(a){
return this.options[a]
}, e.prototype.set=function(a, b){
this.options[a]=b
}, e
}), b.define("select2/core", ["jquery", "./options", "./utils", "./keys"], function(a, b, c, d){
var e=function(a, c){
null!=a.data("select2")&&a.data("select2").destroy(), this.$element=a, this.id=this._generateId(a), c=c||{}, this.options=new b(c, a), e.__super__.constructor.call(this);
var d=a.attr("tabindex")||0;
a.data("old-tabindex", d), a.attr("tabindex", "-1");
var f=this.options.get("dataAdapter");
this.dataAdapter=new f(a, this.options);
var g=this.render();
this._placeContainer(g);
var h=this.options.get("selectionAdapter");
this.selection=new h(a, this.options), this.$selection=this.selection.render(), this.selection.position(this.$selection, g);
var i=this.options.get("dropdownAdapter");
this.dropdown=new i(a, this.options), this.$dropdown=this.dropdown.render(), this.dropdown.position(this.$dropdown, g);
var j=this.options.get("resultsAdapter");
this.results=new j(a, this.options, this.dataAdapter), this.$results=this.results.render(), this.results.position(this.$results, this.$dropdown);
var k=this;
this._bindAdapters(), this._registerDomEvents(), this._registerDataEvents(), this._registerSelectionEvents(), this._registerDropdownEvents(), this._registerResultsEvents(), this._registerEvents(), this.dataAdapter.current(function(a){
k.trigger("selection:update", {
data: a
})
}), a.addClass("select2-hidden-accessible"), a.attr("aria-hidden", "true"), this._syncAttributes(), a.data("select2", this)
};
return c.Extend(e, c.Observable), e.prototype._generateId=function(a){
var b="";
return b=null!=a.attr("id") ? a.attr("id"):null!=a.attr("name") ? a.attr("name") + "-" + c.generateChars(2):c.generateChars(4), b=b.replace(/(:|\.|\[|\]|,)/g, ""), b="select2-" + b
}, e.prototype._placeContainer=function(a){
a.insertAfter(this.$element);
var b=this._resolveWidth(this.$element, this.options.get("width"));
null!=b&&a.css("width", b)
}, e.prototype._resolveWidth=function(a, b){
var c=/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;
if("resolve"==b){
var d=this._resolveWidth(a, "style");
return null!=d ? d:this._resolveWidth(a, "element")
}
if("element"==b){
var e=a.outerWidth(!1);
return 0 >=e ? "auto":e + "px"
}
if("style"==b){
var f=a.attr("style");
if("string"!=typeof f) return null;
for (var g=f.split(";"), h=0, i=g.length; i > h; h +=1){
var j=g[h].replace(/\s/g, ""),
k=j.match(c);
if(null!==k&&k.length >=1) return k[1]
}
return null
}
return b
}, e.prototype._bindAdapters=function(){
this.dataAdapter.bind(this, this.$container), this.selection.bind(this, this.$container), this.dropdown.bind(this, this.$container), this.results.bind(this, this.$container)
}, e.prototype._registerDomEvents=function(){
var b=this;
this.$element.on("change.select2", function(){
b.dataAdapter.current(function(a){
b.trigger("selection:update", {
data: a
})
})
}), this.$element.on("focus.select2", function(a){
b.trigger("focus", a)
}), this._syncA=c.bind(this._syncAttributes, this), this._syncS=c.bind(this._syncSubtree, this), this.$element[0].attachEvent&&this.$element[0].attachEvent("onpropertychange", this._syncA);
var d=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;
null!=d ? (this._observer=new d(function(c){
a.each(c, b._syncA), a.each(c, b._syncS)
}), this._observer.observe(this.$element[0], {
attributes: !0,
childList: !0,
subtree: !1
})):this.$element[0].addEventListener&&(this.$element[0].addEventListener("DOMAttrModified", b._syncA, !1), this.$element[0].addEventListener("DOMNodeInserted", b._syncS, !1), this.$element[0].addEventListener("DOMNodeRemoved", b._syncS, !1))
}, e.prototype._registerDataEvents=function(){
var a=this;
this.dataAdapter.on("*", function(b, c){
a.trigger(b, c)
})
}, e.prototype._registerSelectionEvents=function(){
var b=this,
c=["toggle", "focus"];
this.selection.on("toggle", function(){
b.toggleDropdown()
}), this.selection.on("focus", function(a){
b.focus(a)
}), this.selection.on("*", function(d, e){
-1===a.inArray(d, c)&&b.trigger(d, e)
})
}, e.prototype._registerDropdownEvents=function(){
var a=this;
this.dropdown.on("*", function(b, c){
a.trigger(b, c)
})
}, e.prototype._registerResultsEvents=function(){
var a=this;
this.results.on("*", function(b, c){
a.trigger(b, c)
})
}, e.prototype._registerEvents=function(){
var a=this;
this.on("open", function(){
a.$container.addClass("select2-container--open")
}), this.on("close", function(){
a.$container.removeClass("select2-container--open")
}), this.on("enable", function(){
a.$container.removeClass("select2-container--disabled")
}), this.on("disable", function(){
a.$container.addClass("select2-container--disabled")
}), this.on("blur", function(){
a.$container.removeClass("select2-container--focus")
}), this.on("query", function(b){
a.isOpen()||a.trigger("open", {}), this.dataAdapter.query(b, function(c){
a.trigger("results:all", {
data: c,
query: b
})
})
}), this.on("query:append", function(b){
this.dataAdapter.query(b, function(c){
a.trigger("results:append", {
data: c,
query: b
})
})
}), this.on("keypress", function(b){
var c=b.which;
a.isOpen() ? c===d.ESC||c===d.TAB||c===d.UP&&b.altKey ? (a.close(), b.preventDefault()):c===d.ENTER ? (a.trigger("results:select", {}), b.preventDefault()):c===d.SPACE&&b.ctrlKey ? (a.trigger("results:toggle", {}), b.preventDefault()):c===d.UP ? (a.trigger("results:previous", {}), b.preventDefault()):c===d.DOWN&&(a.trigger("results:next", {}), b.preventDefault()):(c===d.ENTER||c===d.SPACE||c===d.DOWN&&b.altKey)&&(a.open(), b.preventDefault())
})
}, e.prototype._syncAttributes=function(){
this.options.set("disabled", this.$element.prop("disabled")), this.options.get("disabled") ? (this.isOpen()&&this.close(), this.trigger("disable", {})):this.trigger("enable", {})
}, e.prototype._syncSubtree=function(a, b){
var c = !1,
d=this;
if(!a||!a.target||"OPTION"===a.target.nodeName||"OPTGROUP"===a.target.nodeName){
if(b)
if(b.addedNodes&&b.addedNodes.length > 0)
for (var e=0; e < b.addedNodes.length; e++){
var f=b.addedNodes[e];
f.selected&&(c = !0)
} else b.removedNodes&&b.removedNodes.length > 0&&(c = !0);
else c = !0;
c&&this.dataAdapter.current(function(a){
d.trigger("selection:update", {
data: a
})
})
}}, e.prototype.trigger=function(a, b){
var c=e.__super__.trigger,
d={
open: "opening",
close: "closing",
select: "selecting",
unselect: "unselecting"
};
if(void 0===b&&(b={}), a in d){
var f=d[a],
g={
prevented: !1,
name: a,
args: b
};
if(c.call(this, f, g), g.prevented) return void(b.prevented = !0)
}
c.call(this, a, b)
}, e.prototype.toggleDropdown=function(){
this.options.get("disabled")||(this.isOpen() ? this.close():this.open())
}, e.prototype.open=function(){
this.isOpen()||this.trigger("query", {})
}, e.prototype.close=function(){
this.isOpen()&&this.trigger("close", {})
}, e.prototype.isOpen=function(){
return this.$container.hasClass("select2-container--open")
}, e.prototype.hasFocus=function(){
return this.$container.hasClass("select2-container--focus")
}, e.prototype.focus=function(a){
this.hasFocus()||(this.$container.addClass("select2-container--focus"), this.trigger("focus", {}))
}, e.prototype.enable=function(a){
this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'), (null==a||0===a.length)&&(a=[!0]);
var b = !a[0];
this.$element.prop("disabled", b)
}, e.prototype.data=function(){
this.options.get("debug")&&arguments.length > 0&&window.console&&console.warn&&console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');
var a=[];
return this.dataAdapter.current(function(b){
a=b
}), a
}, e.prototype.val=function(b){
if(this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'), null==b||0===b.length) return this.$element.val();
var c=b[0];
a.isArray(c)&&(c=a.map(c, function(a){
return a.toString()
})), this.$element.val(c).trigger("change")
}, e.prototype.destroy=function(){
this.$container.remove(), this.$element[0].detachEvent&&this.$element[0].detachEvent("onpropertychange", this._syncA), null!=this._observer ? (this._observer.disconnect(), this._observer=null):this.$element[0].removeEventListener&&(this.$element[0].removeEventListener("DOMAttrModified", this._syncA, !1), this.$element[0].removeEventListener("DOMNodeInserted", this._syncS, !1), this.$element[0].removeEventListener("DOMNodeRemoved", this._syncS, !1)), this._syncA=null, this._syncS=null, this.$element.off(".select2"), this.$element.attr("tabindex", this.$element.data("old-tabindex")), this.$element.removeClass("select2-hidden-accessible"), this.$element.attr("aria-hidden", "false"), this.$element.removeData("select2"), this.dataAdapter.destroy(), this.selection.destroy(), this.dropdown.destroy(), this.results.destroy(), this.dataAdapter=null, this.selection=null, this.dropdown=null, this.results=null;
}, e.prototype.render=function(){
var b=a('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');
return b.attr("dir", this.options.get("dir")), this.$container=b, this.$container.addClass("select2-container--" + this.options.get("theme")), b.data("element", this.$element), b
}, e
}), b.define("jquery-mousewheel", ["jquery"], function(a){
return a
}), b.define("jquery.select2", ["jquery", "jquery-mousewheel", "./select2/core", "./select2/defaults"], function(a, b, c, d){
if(null==a.fn.select2){
var e=["open", "close", "destroy"];
a.fn.select2=function(b){
if(b=b||{}, "object"==typeof b) return this.each(function(){
var d=a.extend(!0, {}, b);
new c(a(this), d)
}), this;
if("string"==typeof b){
var d, f=Array.prototype.slice.call(arguments, 1);
return this.each(function(){
var c=a(this).data("select2");
null==c&&window.console&&console.error&&console.error("The select2('" + b + "') method was called on an element that is not using Select2."), d=c[b].apply(c, f)
}), a.inArray(b, e) > -1 ? this:d
}
throw new Error("Invalid arguments for Select2: " + b)
}}
return null==a.fn.select2.defaults&&(a.fn.select2.defaults=d), c
}), {
define: b.define,
require: b.require
}}(),
c=b.require("jquery.select2");
return a.fn.select2.amd=b, c
});
document.documentElement.className+=" js_active ",document.documentElement.className+="ontouchstart"in document.documentElement?" vc_mobile ":" vc_desktop ",function(){for(var prefix=["-webkit-","-moz-","-ms-","-o-",""],i=0;i<prefix.length;i++)prefix[i]+"transform"in document.documentElement.style&&(document.documentElement.className+=" vc_transform ")}(),function(){"function"!=typeof window.vc_js&&(window.vc_js=function(){"use strict";vc_toggleBehaviour(),vc_tabsBehaviour(),vc_accordionBehaviour(),vc_teaserGrid(),vc_carouselBehaviour(),vc_slidersBehaviour(),vc_prettyPhoto(),vc_pinterest(),vc_progress_bar(),vc_plugin_flexslider(),vc_gridBehaviour(),vc_rowBehaviour(),vc_prepareHoverBox(),vc_googleMapsPointer(),vc_ttaActivation(),jQuery(document).trigger("vc_js"),window.setTimeout(vc_waypoints,500)}),"function"!=typeof window.vc_plugin_flexslider&&(window.vc_plugin_flexslider=function($parent){($parent?$parent.find(".wpb_flexslider"):jQuery(".wpb_flexslider")).each(function(){var this_element=jQuery(this),sliderTimeout=1e3*parseInt(this_element.attr("data-interval"),10),sliderFx=this_element.attr("data-flex_fx"),slideshow=!0;0==sliderTimeout&&(slideshow=!1),this_element.is(":visible")&&this_element.flexslider({animation:sliderFx,slideshow:slideshow,slideshowSpeed:sliderTimeout,sliderSpeed:800,smoothHeight:!0})})}),"function"!=typeof window.vc_googleplus&&(window.vc_googleplus=function(){0<jQuery(".wpb_googleplus").length&&function(){var po=document.createElement("script");po.type="text/javascript",po.async=!0,po.src="https://apis.google.com/js/plusone.js";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(po,s)}()}),"function"!=typeof window.vc_pinterest&&(window.vc_pinterest=function(){0<jQuery(".wpb_pinterest").length&&function(){var po=document.createElement("script");po.type="text/javascript",po.async=!0,po.src="https://assets.pinterest.com/js/pinit.js";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(po,s)}()}),"function"!=typeof window.vc_progress_bar&&(window.vc_progress_bar=function(){void 0!==jQuery.fn.vcwaypoint&&jQuery(".vc_progress_bar").each(function(){var $el=jQuery(this);$el.vcwaypoint(function(){$el.find(".vc_single_bar").each(function(index){var bar=jQuery(this).find(".vc_bar"),val=bar.data("percentage-value");setTimeout(function(){bar.css({width:val+"%"})},200*index)})},{offset:"85%"})})}),"function"!=typeof window.vc_waypoints&&(window.vc_waypoints=function(){void 0!==jQuery.fn.vcwaypoint&&jQuery(".wpb_animate_when_almost_visible:not(.wpb_start_animation)").each(function(){var $el=jQuery(this);$el.vcwaypoint(function(){$el.addClass("wpb_start_animation animated")},{offset:"85%"})})}),"function"!=typeof window.vc_toggleBehaviour&&(window.vc_toggleBehaviour=function($el){function event(e){e&&e.preventDefault&&e.preventDefault();var element=jQuery(this).closest(".vc_toggle"),content=element.find(".vc_toggle_content");element.hasClass("vc_toggle_active")?content.slideUp({duration:300,complete:function(){element.removeClass("vc_toggle_active")}}):content.slideDown({duration:300,complete:function(){element.addClass("vc_toggle_active")}})}$el?$el.hasClass("vc_toggle_title")?$el.unbind("click").on("click",event):$el.find(".vc_toggle_title").off("click").on("click",event):jQuery(".vc_toggle_title").off("click").on("click",event)}),"function"!=typeof window.vc_tabsBehaviour&&(window.vc_tabsBehaviour=function($tab){if(jQuery.ui){var $call=$tab||jQuery(".wpb_tabs, .wpb_tour"),ver=jQuery.ui&&jQuery.ui.version?jQuery.ui.version.split("."):"1.10",old_version=1===parseInt(ver[0],10)&&parseInt(ver[1],10)<9;$call.each(function(index){var $tabs,interval=jQuery(this).attr("data-interval"),tabs_array=[];if($tabs=jQuery(this).find(".wpb_tour_tabs_wrapper").tabs({show:function(event,ui){wpb_prepare_tab_content(event,ui)},activate:function(event,ui){wpb_prepare_tab_content(event,ui)}}),interval&&0<interval)try{$tabs.tabs("rotate",1e3*interval)}catch(err){window.console&&window.console.warn&&console.warn("tabs behaviours error",err)}jQuery(this).find(".wpb_tab").each(function(){tabs_array.push(this.id)}),jQuery(this).find(".wpb_tabs_nav li").on("click",function(e){return e&&e.preventDefault&&e.preventDefault(),old_version?$tabs.tabs("select",jQuery("a",this).attr("href")):$tabs.tabs("option","active",jQuery(this).index()),!1}),jQuery(this).find(".wpb_prev_slide a, .wpb_next_slide a").on("click",function(e){var index,length;e&&e.preventDefault&&e.preventDefault(),old_version?(index=$tabs.tabs("option","selected"),jQuery(this).parent().hasClass("wpb_next_slide")?index++:index--,index<0?index=$tabs.tabs("length")-1:index>=$tabs.tabs("length")&&(index=0),$tabs.tabs("select",index)):(index=$tabs.tabs("option","active"),length=$tabs.find(".wpb_tab").length,index=jQuery(this).parent().hasClass("wpb_next_slide")?length<=index+1?0:index+1:index-1<0?length-1:index-1,$tabs.tabs("option","active",index))})})}}),"function"!=typeof window.vc_accordionBehaviour&&(window.vc_accordionBehaviour=function(){jQuery(".wpb_accordion").each(function(index){var $tabs,active_tab,collapsible,$this=jQuery(this);$this.attr("data-interval"),collapsible=!1===(active_tab=!isNaN(jQuery(this).data("active-tab"))&&0<parseInt($this.data("active-tab"),10)&&parseInt($this.data("active-tab"),10)-1)||"yes"===$this.data("collapsible"),$tabs=$this.find(".wpb_accordion_wrapper").accordion({header:"> div > h3",autoHeight:!1,heightStyle:"content",active:active_tab,collapsible:collapsible,navigation:!0,activate:vc_accordionActivate,change:function(event,ui){void 0!==jQuery.fn.isotope&&ui.newContent.find(".isotope").isotope("layout"),vc_carouselBehaviour(ui.newPanel)}}),!0===$this.data("vcDisableKeydown")&&($tabs.data("uiAccordion")._keydown=function(){})})}),"function"!=typeof window.vc_teaserGrid&&(window.vc_teaserGrid=function(){var layout_modes={fitrows:"fitRows",masonry:"masonry"};jQuery(".wpb_grid .teaser_grid_container:not(.wpb_carousel), .wpb_filtered_grid .teaser_grid_container:not(.wpb_carousel)").each(function(){var $container=jQuery(this),$thumbs=$container.find(".wpb_thumbnails"),layout_mode=$thumbs.attr("data-layout-mode");$thumbs.isotope({itemSelector:".isotope-item",layoutMode:void 0===layout_modes[layout_mode]?"fitRows":layout_modes[layout_mode]}),$container.find(".categories_filter a").data("isotope",$thumbs).on("click",function(e){e&&e.preventDefault&&e.preventDefault();var $thumbs=jQuery(this).data("isotope");jQuery(this).parent().parent().find(".active").removeClass("active"),jQuery(this).parent().addClass("active"),$thumbs.isotope({filter:jQuery(this).attr("data-filter")})}),jQuery(window).bind("load resize",function(){$thumbs.isotope("layout")})})}),"function"!=typeof window.vc_carouselBehaviour&&(window.vc_carouselBehaviour=function($parent){($parent?$parent.find(".wpb_carousel"):jQuery(".wpb_carousel")).each(function(){var $this=jQuery(this);if(!0!==$this.data("carousel_enabled")&&$this.is(":visible")){$this.data("carousel_enabled",!0);getColumnsCount(jQuery(this));jQuery(this).hasClass("columns_count_1")&&0;var carousel_li=jQuery(this).find(".wpb_thumbnails-fluid li");carousel_li.css({"margin-right":carousel_li.css("margin-left"),"margin-left":0});var fluid_ul=jQuery(this).find("ul.wpb_thumbnails-fluid");fluid_ul.width(fluid_ul.width()+300),jQuery(window).on("resize",function(){screen_size!=(screen_size=getSizeName())&&window.setTimeout(function(){location.reload()},20)})}})}),"function"!=typeof window.vc_slidersBehaviour&&(window.vc_slidersBehaviour=function(){jQuery(".wpb_gallery_slides").each(function(index){var $imagesGrid,this_element=jQuery(this);if(this_element.hasClass("wpb_slider_nivo")){var sliderTimeout=1e3*this_element.attr("data-interval");0===sliderTimeout&&(sliderTimeout=9999999999),this_element.find(".nivoSlider").nivoSlider({effect:"boxRainGrow,boxRain,boxRainReverse,boxRainGrowReverse",slices:15,boxCols:8,boxRows:4,animSpeed:800,pauseTime:sliderTimeout,startSlide:0,directionNav:!0,directionNavHide:!0,controlNav:!0,keyboardNav:!1,pauseOnHover:!0,manualAdvance:!1,prevText:"Prev",nextText:"Next"})}else this_element.hasClass("wpb_image_grid")&&(jQuery.fn.imagesLoaded?$imagesGrid=this_element.find(".wpb_image_grid_ul").imagesLoaded(function(){$imagesGrid.isotope({itemSelector:".isotope-item",layoutMode:"fitRows"})}):this_element.find(".wpb_image_grid_ul").isotope({itemSelector:".isotope-item",layoutMode:"fitRows"}))})}),"function"!=typeof window.vc_prettyPhoto&&(window.vc_prettyPhoto=function(){try{jQuery&&jQuery.fn&&jQuery.fn.prettyPhoto&&jQuery('a.prettyphoto, .gallery-icon a[href*=".jpg"]').prettyPhoto({animationSpeed:"normal",hook:"data-rel",padding:15,opacity:.7,showTitle:!0,allowresize:!0,counter_separator_label:"/",hideflash:!1,deeplinking:!1,modal:!1,callback:function(){-1<location.href.indexOf("#!prettyPhoto")&&(location.hash="")},social_tools:""})}catch(err){window.console&&window.console.warn&&window.console.warn("vc_prettyPhoto initialize error",err)}}),"function"!=typeof window.vc_google_fonts&&(window.vc_google_fonts=function(){return window.console&&window.console.warn&&window.console.warn("function vc_google_fonts is deprecated, no need to use it"),!1}),window.vcParallaxSkroll=!1,"function"!=typeof window.vc_rowBehaviour&&(window.vc_rowBehaviour=function(){var vcSkrollrOptions,callSkrollInit,$=window.jQuery;function fullWidthRow(){var $elements=$('[data-vc-full-width="true"]');$.each($elements,function(key,item){var $el=$(this);$el.addClass("vc_hidden");var $el_full=$el.next(".vc_row-full-width");if($el_full.length||($el_full=$el.parent().next(".vc_row-full-width")),$el_full.length){var padding,paddingRight,el_margin_left=parseInt($el.css("margin-left"),10),el_margin_right=parseInt($el.css("margin-right"),10),offset=0-$el_full.offset().left-el_margin_left,width=$(window).width();if("rtl"===$el.css("direction")&&(offset-=$el_full.width(),offset+=width,offset+=el_margin_left,offset+=el_margin_right),$el.css({position:"relative",left:offset,"box-sizing":"border-box",width:width}),!$el.data("vcStretchContent"))"rtl"===$el.css("direction")?((padding=offset)<0&&(padding=0),(paddingRight=offset)<0&&(paddingRight=0)):((padding=-1*offset)<0&&(padding=0),(paddingRight=width-padding-$el_full.width()+el_margin_left+el_margin_right)<0&&(paddingRight=0)),$el.css({"padding-left":padding+"px","padding-right":paddingRight+"px"});$el.attr("data-vc-full-width-init","true"),$el.removeClass("vc_hidden"),$(document).trigger("vc-full-width-row-single",{el:$el,offset:offset,marginLeft:el_margin_left,marginRight:el_margin_right,elFull:$el_full,width:width})}}),$(document).trigger("vc-full-width-row",$elements)}function fullHeightRow(){var windowHeight,offsetTop,fullHeight,$element=$(".vc_row-o-full-height:first");$element.length&&(windowHeight=$(window).height(),(offsetTop=$element.offset().top)<windowHeight&&(fullHeight=100-offsetTop/(windowHeight/100),$element.css("min-height",fullHeight+"vh")));$(document).trigger("vc-full-height-row",$element)}$(window).off("resize.vcRowBehaviour").on("resize.vcRowBehaviour",fullWidthRow).on("resize.vcRowBehaviour",fullHeightRow),fullWidthRow(),fullHeightRow(),(0<window.navigator.userAgent.indexOf("MSIE ")||navigator.userAgent.match(/Trident.*rv\:11\./))&&$(".vc_row-o-full-height").each(function(){"flex"===$(this).css("display")&&$(this).wrap('<div class="vc_ie-flexbox-fixer"></div>')}),vc_initVideoBackgrounds(),callSkrollInit=!1,window.vcParallaxSkroll&&window.vcParallaxSkroll.destroy(),$(".vc_parallax-inner").remove(),$("[data-5p-top-bottom]").removeAttr("data-5p-top-bottom data-30p-top-bottom"),$("[data-vc-parallax]").each(function(){var skrollrSize,skrollrStart,$parallaxElement,parallaxImage,youtubeId;callSkrollInit=!0,"on"===$(this).data("vcParallaxOFade")&&$(this).children().attr("data-5p-top-bottom","opacity:0;").attr("data-30p-top-bottom","opacity:1;"),skrollrSize=100*$(this).data("vcParallax"),($parallaxElement=$("<div />").addClass("vc_parallax-inner").appendTo($(this))).height(skrollrSize+"%"),parallaxImage=$(this).data("vcParallaxImage"),(youtubeId=vcExtractYoutubeId(parallaxImage))?insertYoutubeVideoAsBackground($parallaxElement,youtubeId):void 0!==parallaxImage&&$parallaxElement.css("background-image","url("+parallaxImage+")"),skrollrStart=-(skrollrSize-100),$parallaxElement.attr("data-bottom-top","top: "+skrollrStart+"%;").attr("data-top-bottom","top: 0%;")}),callSkrollInit&&window.skrollr&&(vcSkrollrOptions={forceHeight:!1,smoothScrolling:!1,mobileCheck:function(){return!1}},window.vcParallaxSkroll=skrollr.init(vcSkrollrOptions),window.vcParallaxSkroll)}),"function"!=typeof window.vc_gridBehaviour&&(window.vc_gridBehaviour=function(){jQuery.fn.vcGrid&&jQuery("[data-vc-grid]").vcGrid()}),"function"!=typeof window.getColumnsCount&&(window.getColumnsCount=function(el){for(var find=!1,i=1;!1===find;){if(el.hasClass("columns_count_"+i))return find=!0,i;i++}});var screen_size=getSizeName();function getSizeName(){var screen_w=jQuery(window).width();return 1170<screen_w?"desktop_wide":960<screen_w&&screen_w<1169?"desktop":768<screen_w&&screen_w<959?"tablet":300<screen_w&&screen_w<767?"mobile":screen_w<300?"mobile_portrait":""}"function"!=typeof window.wpb_prepare_tab_content&&(window.wpb_prepare_tab_content=function(event,ui){var $ui_panel,$google_maps,panel=ui.panel||ui.newPanel,$pie_charts=panel.find(".vc_pie_chart:not(.vc_ready)"),$round_charts=panel.find(".vc_round-chart"),$line_charts=panel.find(".vc_line-chart"),$carousel=panel.find('[data-ride="vc_carousel"]');if(vc_carouselBehaviour(),vc_plugin_flexslider(panel),ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").length&&ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function(){var grid=jQuery(this).data("vcGrid");grid&&grid.gridBuilder&&grid.gridBuilder.setMasonry&&grid.gridBuilder.setMasonry()}),panel.find(".vc_masonry_media_grid, .vc_masonry_grid").length&&panel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function(){var grid=jQuery(this).data("vcGrid");grid&&grid.gridBuilder&&grid.gridBuilder.setMasonry&&grid.gridBuilder.setMasonry()}),$pie_charts.length&&jQuery.fn.vcChat&&$pie_charts.vcChat(),$round_charts.length&&jQuery.fn.vcRoundChart&&$round_charts.vcRoundChart({reload:!1}),$line_charts.length&&jQuery.fn.vcLineChart&&$line_charts.vcLineChart({reload:!1}),$carousel.length&&jQuery.fn.carousel&&$carousel.carousel("resizeAction"),$ui_panel=panel.find(".isotope, .wpb_image_grid_ul"),$google_maps=panel.find(".wpb_gmaps_widget"),0<$ui_panel.length&&$ui_panel.isotope("layout"),$google_maps.length&&!$google_maps.is(".map_ready")){var $frame=$google_maps.find("iframe");$frame.attr("src",$frame.attr("src")),$google_maps.addClass("map_ready")}panel.parents(".isotope").length&&panel.parents(".isotope").each(function(){jQuery(this).isotope("layout")})}),"function"!=typeof window.vc_ttaActivation&&(window.vc_ttaActivation=function(){jQuery("[data-vc-accordion]").on("show.vc.accordion",function(e){var $=window.jQuery,ui={};ui.newPanel=$(this).data("vc.accordion").getTarget(),window.wpb_prepare_tab_content(e,ui)})}),"function"!=typeof window.vc_accordionActivate&&(window.vc_accordionActivate=function(event,ui){if(ui.newPanel.length&&ui.newHeader.length){var $pie_charts=ui.newPanel.find(".vc_pie_chart:not(.vc_ready)"),$round_charts=ui.newPanel.find(".vc_round-chart"),$line_charts=ui.newPanel.find(".vc_line-chart"),$carousel=ui.newPanel.find('[data-ride="vc_carousel"]');void 0!==jQuery.fn.isotope&&ui.newPanel.find(".isotope, .wpb_image_grid_ul").isotope("layout"),ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").length&&ui.newPanel.find(".vc_masonry_media_grid, .vc_masonry_grid").each(function(){var grid=jQuery(this).data("vcGrid");grid&&grid.gridBuilder&&grid.gridBuilder.setMasonry&&grid.gridBuilder.setMasonry()}),vc_carouselBehaviour(ui.newPanel),vc_plugin_flexslider(ui.newPanel),$pie_charts.length&&jQuery.fn.vcChat&&$pie_charts.vcChat(),$round_charts.length&&jQuery.fn.vcRoundChart&&$round_charts.vcRoundChart({reload:!1}),$line_charts.length&&jQuery.fn.vcLineChart&&$line_charts.vcLineChart({reload:!1}),$carousel.length&&jQuery.fn.carousel&&$carousel.carousel("resizeAction"),ui.newPanel.parents(".isotope").length&&ui.newPanel.parents(".isotope").each(function(){jQuery(this).isotope("layout")})}}),"function"!=typeof window.initVideoBackgrounds&&(window.initVideoBackgrounds=function(){return window.console&&window.console.warn&&window.console.warn("this function is deprecated use vc_initVideoBackgrounds"),vc_initVideoBackgrounds()}),"function"!=typeof window.vc_initVideoBackgrounds&&(window.vc_initVideoBackgrounds=function(){jQuery("[data-vc-video-bg]").each(function(){var youtubeUrl,youtubeId,$element=jQuery(this);$element.data("vcVideoBg")?(youtubeUrl=$element.data("vcVideoBg"),(youtubeId=vcExtractYoutubeId(youtubeUrl))&&($element.find(".vc_video-bg").remove(),insertYoutubeVideoAsBackground($element,youtubeId)),jQuery(window).on("grid:items:added",function(event,$grid){$element.has($grid).length&&vcResizeVideoBackground($element)})):$element.find(".vc_video-bg").remove()})}),"function"!=typeof window.insertYoutubeVideoAsBackground&&(window.insertYoutubeVideoAsBackground=function($element,youtubeId,counter){if("undefined"==typeof YT||void 0===YT.Player)return 100<(counter=void 0===counter?0:counter)?void console.warn("Too many attempts to load YouTube api"):void setTimeout(function(){insertYoutubeVideoAsBackground($element,youtubeId,counter++)},100);var $container=$element.prepend('<div class="vc_video-bg vc_hidden-xs"><div class="inner"></div></div>').find(".inner");new YT.Player($container[0],{width:"100%",height:"100%",videoId:youtubeId,playerVars:{playlist:youtubeId,iv_load_policy:3,enablejsapi:1,disablekb:1,autoplay:1,controls:0,showinfo:0,rel:0,loop:1,wmode:"transparent"},events:{onReady:function(event){event.target.mute().setLoop(!0)}}}),vcResizeVideoBackground($element),jQuery(window).bind("resize",function(){vcResizeVideoBackground($element)})}),"function"!=typeof window.vcResizeVideoBackground&&(window.vcResizeVideoBackground=function($element){var iframeW,iframeH,marginLeft,marginTop,containerW=$element.innerWidth(),containerH=$element.innerHeight();containerW/containerH<16/9?(iframeW=containerH*(16/9),iframeH=containerH,marginLeft=-Math.round((iframeW-containerW)/2)+"px",marginTop=-Math.round((iframeH-containerH)/2)+"px"):(iframeH=(iframeW=containerW)*(9/16),marginTop=-Math.round((iframeH-containerH)/2)+"px",marginLeft=-Math.round((iframeW-containerW)/2)+"px"),iframeW+="px",iframeH+="px",$element.find(".vc_video-bg iframe").css({maxWidth:"1000%",marginLeft:marginLeft,marginTop:marginTop,width:iframeW,height:iframeH})}),"function"!=typeof window.vcExtractYoutubeId&&(window.vcExtractYoutubeId=function(url){if(void 0===url)return!1;var id=url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);return null!==id&&id[1]}),"function"!=typeof window.vc_googleMapsPointer&&(window.vc_googleMapsPointer=function(){var $=window.jQuery,$wpbGmapsWidget=$(".wpb_gmaps_widget");$wpbGmapsWidget.on("click",function(){$("iframe",this).css("pointer-events","auto")}),$wpbGmapsWidget.on("mouseleave",function(){$("iframe",this).css("pointer-events","none")}),$(".wpb_gmaps_widget iframe").css("pointer-events","none")}),"function"!=typeof window.vc_setHoverBoxPerspective&&(window.vc_setHoverBoxPerspective=function(hoverBox){hoverBox.each(function(){var $this=jQuery(this),perspective=4*$this.width()+"px";$this.css("perspective",perspective)})}),"function"!=typeof window.vc_setHoverBoxHeight&&(window.vc_setHoverBoxHeight=function(hoverBox){hoverBox.each(function(){var $this=jQuery(this),hoverBoxInner=$this.find(".vc-hoverbox-inner");hoverBoxInner.css("min-height",0);var frontHeight=$this.find(".vc-hoverbox-front-inner").outerHeight(),backHeight=$this.find(".vc-hoverbox-back-inner").outerHeight(),hoverBoxHeight=backHeight<frontHeight?frontHeight:backHeight;hoverBoxHeight<250&&(hoverBoxHeight=250),hoverBoxInner.css("min-height",hoverBoxHeight+"px")})}),"function"!=typeof window.vc_prepareHoverBox&&(window.vc_prepareHoverBox=function(){var hoverBox=jQuery(".vc-hoverbox");vc_setHoverBoxHeight(hoverBox),vc_setHoverBoxPerspective(hoverBox)}),jQuery(document).ready(window.vc_prepareHoverBox),jQuery(window).resize(window.vc_prepareHoverBox),jQuery(document).ready(function($){window.vc_js()})}(window.jQuery);
!function a(o,s,u){function c(t,e){if(!s[t]){if(!o[t]){var r="function"==typeof require&&require;if(!e&&r)return r(t,!0);if(l)return l(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=s[t]={exports:{}};o[t][0].call(i.exports,function(e){return c(o[t][1][e]||e)},i,i.exports,a,o,s,u)}return s[t].exports}for(var l="function"==typeof require&&require,e=0;e<u.length;e++)c(u[e]);return c}({1:[function(e,t,r){"use strict";var n=window.mc4wp||{},i=e("./forms/forms.js");function a(e,t){i.trigger(t[0].id+"."+e,t),i.trigger(e,t)}function o(e,n){document.addEventListener(e,function(e){if(e.target){var t=e.target,r=!1;"string"==typeof t.className&&(r=-1<t.className.indexOf("mc4wp-form")),r||"function"!=typeof t.matches||(r=t.matches(".mc4wp-form *")),r&&n.call(e,e)}},!0)}if(e("./forms/conditional-elements.js"),o("submit",function(e){var t=i.getByElement(e.target);e.defaultPrevented||i.trigger(t.id+".submit",[t,e]),e.defaultPrevented||i.trigger("submit",[t,e])}),o("focus",function(e){var t=i.getByElement(e.target);t.started||(a("started",[t,e]),t.started=!0)}),o("change",function(e){a("change",[i.getByElement(e.target),e])}),n.listeners){for(var s=n.listeners,u=0;u<s.length;u++)i.on(s[u].event,s[u].callback);delete n.listeners}n.forms=i,window.mc4wp=n},{"./forms/conditional-elements.js":2,"./forms/forms.js":4}],2:[function(e,t,r){"use strict";function n(e){for(var t=!!e.getAttribute("data-show-if"),r=t?e.getAttribute("data-show-if").split(":"):e.getAttribute("data-hide-if").split(":"),n=r[0],i=(1<r.length?r[1]:"*").split("|"),a=function(e,t){for(var r=[],n=e.querySelectorAll('input[name="'+t+'"],select[name="'+t+'"],textarea[name="'+t+'"]'),i=0;i<n.length;i++){var a=n[i];("radio"!==a.type&&"checkbox"!==a.type||a.checked)&&r.push(a.value)}return r}(function(e){for(var t=e;t.parentElement;)if("FORM"===(t=t.parentElement).tagName)return t;return null}(e),n),o=!1,s=0;s<a.length;s++){var u=a[s];if(o=-1<i.indexOf(u)||-1<i.indexOf("*")&&0<u.length)break}e.style.display=t?o?"":"none":o?"none":"";var c=e.querySelectorAll("input,select,textarea");[].forEach.call(c,function(e){(o||t)&&e.getAttribute("data-was-required")&&(e.required=!0,e.removeAttribute("data-was-required")),o&&t||!e.required||(e.setAttribute("data-was-required","true"),e.required=!1)})}function i(){var e=document.querySelectorAll(".mc4wp-form [data-show-if],.mc4wp-form [data-hide-if]");[].forEach.call(e,n)}function a(e){if(e.target&&e.target.form&&!(e.target.form.className.indexOf("mc4wp-form")<0)){var t=e.target.form.querySelectorAll("[data-show-if],[data-hide-if]");[].forEach.call(t,n)}}document.addEventListener("keyup",a,!0),document.addEventListener("change",a,!0),document.addEventListener("mc4wp-refresh",i,!0),window.addEventListener("load",i),i()},{}],3:[function(e,t,r){"use strict";function n(e,t){this.id=e,this.element=t||document.createElement("form"),this.name=this.element.getAttribute("data-name")||"Form #"+this.id,this.errors=[],this.started=!1}var i=e("form-serialize"),a=e("populate.js");n.prototype.setData=function(e){try{a(this.element,e)}catch(e){console.error(e)}},n.prototype.getData=function(){return i(this.element,{hash:!0,empty:!0})},n.prototype.getSerializedData=function(){return i(this.element,{hash:!1,empty:!0})},n.prototype.setResponse=function(e){this.element.querySelector(".mc4wp-response").innerHTML=e},n.prototype.reset=function(){this.setResponse(""),this.element.querySelector(".mc4wp-form-fields").style.display="",this.element.reset()},t.exports=n},{"form-serialize":5,"populate.js":6}],4:[function(e,t,r){"use strict";var n=e("./form.js"),i=[],a={};function o(e,t){a[e]=a[e]||[],a[e].forEach(function(e){return e.apply(null,t)})}function s(e,t){t=t||parseInt(e.getAttribute("data-id"))||0;var r=new n(t,e);return i.push(r),r}t.exports={get:function(e){e=parseInt(e);for(var t=0;t<i.length;t++)if(i[t].id===e)return i[t];return s(document.querySelector(".mc4wp-form-"+e),e)},getByElement:function(e){for(var t=e.form||e,r=0;r<i.length;r++)if(i[r].element===t)return i[r];return s(t)},on:function(e,t){a[e]=a[e]||[],a[e].push(t)},off:function(e,t){a[e]=a[e]||[],a[e]=a[e].filter(function(e){return e!==t})},trigger:function(e,t){"submit"===e||0<e.indexOf(".submit")?o(e,t):window.setTimeout(function(){o(e,t)},1)}}},{"./form.js":3}],5:[function(e,t,r){var v=/^(?:submit|button|image|reset|file)$/i,g=/^(?:input|select|textarea|keygen)/i,i=/(\[[^\[\]]*\])/g;function y(e,t,r){if(t.match(i)){!function e(t,r,n){if(0===r.length)return t=n;var i=r.shift(),a=i.match(/^\[(.+?)\]$/);if("[]"===i)return t=t||[],Array.isArray(t)?t.push(e(null,r,n)):(t._values=t._values||[],t._values.push(e(null,r,n))),t;if(a){var o=a[1],s=+o;isNaN(s)?(t=t||{})[o]=e(t[o],r,n):(t=t||[])[s]=e(t[s],r,n)}else t[i]=e(t[i],r,n);return t}(e,function(e){var t=[],r=new RegExp(i),n=/^([^\[\]]*)/.exec(e);for(n[1]&&t.push(n[1]);null!==(n=r.exec(e));)t.push(n[1]);return t}(t),r)}else{var n=e[t];n?(Array.isArray(n)||(e[t]=[n]),e[t].push(r)):e[t]=r}return e}function w(e,t,r){return r=r.replace(/(\r)?\n/g,"\r\n"),r=(r=encodeURIComponent(r)).replace(/%20/g,"+"),e+(e?"&":"")+encodeURIComponent(t)+"="+r}t.exports=function(e,t){"object"!=typeof t?t={hash:!!t}:void 0===t.hash&&(t.hash=!0);for(var r=t.hash?{}:"",n=t.serializer||(t.hash?y:w),i=e&&e.elements?e.elements:[],a=Object.create(null),o=0;o<i.length;++o){var s=i[o];if((t.disabled||!s.disabled)&&s.name&&(g.test(s.nodeName)&&!v.test(s.type))){var u=s.name,c=s.value;if("checkbox"!==s.type&&"radio"!==s.type||s.checked||(c=void 0),t.empty){if("checkbox"!==s.type||s.checked||(c=""),"radio"===s.type&&(a[s.name]||s.checked?s.checked&&(a[s.name]=!0):a[s.name]=!1),null==c&&"radio"==s.type)continue}else if(!c)continue;if("select-multiple"!==s.type)r=n(r,u,c);else{c=[];for(var l=s.options,f=!1,m=0;m<l.length;++m){var d=l[m],p=t.empty&&!d.value,h=d.value||p;d.selected&&h&&(f=!0,r=t.hash&&"[]"!==u.slice(u.length-2)?n(r,u+"[]",d.value):n(r,u,d.value))}!f&&t.empty&&(r=n(r,u,""))}}}if(t.empty)for(var u in a)a[u]||(r=n(r,u,""));return r}},{}],6:[function(e,t,r){void 0!==t&&t.exports&&(t.exports=function e(t,r,n){for(var i in r)if(r.hasOwnProperty(i)){var a=i,o=r[i];if(void 0===o&&(o=""),null===o&&(o=""),void 0!==n&&(a=n+"["+i+"]"),o.constructor===Array)a+="[]";else if("object"==typeof o){e(t,o,a);continue}var s=t.elements.namedItem(a);if(s)switch(s.type||s[0].type){default:s.value=o;break;case"radio":case"checkbox":for(var u=o.constructor===Array?o:[o],c=0;c<s.length;c++)s[c].checked=-1<u.indexOf(s[c].value);break;case"select-multiple":u=o.constructor===Array?o:[o];for(var l=0;l<s.options.length;l++)s.options[l].selected=-1<u.indexOf(s.options[l].value);break;case"select":case"select-one":s.value=o.toString()||o;break;case"date":s.value=new Date(o).toISOString().split("T")[0]}}})},{}]},{},[1]);