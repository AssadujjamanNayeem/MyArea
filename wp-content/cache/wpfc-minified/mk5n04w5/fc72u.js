(function(){}());
function CanvasLayerOptions(){}
CanvasLayerOptions.prototype.animate;
CanvasLayerOptions.prototype.map;
CanvasLayerOptions.prototype.paneName;
CanvasLayerOptions.prototype.resizeHandler;
CanvasLayerOptions.prototype.resolutionScale;
CanvasLayerOptions.prototype.updateHandler;
function CanvasLayer(opt_options){
this.isAdded_=false;
this.isAnimated_=false;
this.paneName_=CanvasLayer.DEFAULT_PANE_NAME_;
this.updateHandler_=null;
this.resizeHandler_=null;
this.topLeft_=null;
this.centerListener_=null;
this.resizeListener_=null;
this.needsResize_=true;
this.requestAnimationFrameId_=null;
var canvas=document.createElement('canvas');
canvas.style.position='absolute';
canvas.style.top=0;
canvas.style.left=0;
canvas.style.pointerEvents='none';
this.canvas=canvas;
this.canvasCssWidth_=300;
this.canvasCssHeight_=150;
this.resolutionScale_=1;
function simpleBindShim(thisArg, func){
return function(){ func.apply(thisArg); };}
this.repositionFunction_=simpleBindShim(this, this.repositionCanvas_);
this.resizeFunction_=simpleBindShim(this, this.resize_);
this.requestUpdateFunction_=simpleBindShim(this, this.update_);
if(opt_options){
this.setOptions(opt_options);
}}
if(window.google)
CanvasLayer.prototype=new google.maps.OverlayView();
CanvasLayer.DEFAULT_PANE_NAME_='overlayLayer';
CanvasLayer.CSS_TRANSFORM_=(function(){
var div=document.createElement('div');
var transformProps=[
'transform',
'WebkitTransform',
'MozTransform',
'OTransform',
'msTransform'
];
for (var i=0; i < transformProps.length; i++){
var prop=transformProps[i];
if(div.style[prop]!==undefined){
return prop;
}}
return transformProps[0];
})();
CanvasLayer.prototype.requestAnimFrame_ =
window.requestAnimationFrame ||
window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame ||
window.oRequestAnimationFrame ||
window.msRequestAnimationFrame ||
function(callback){
return window.setTimeout(callback, 1000 / 60);
};
CanvasLayer.prototype.cancelAnimFrame_ =
window.cancelAnimationFrame ||
window.webkitCancelAnimationFrame ||
window.mozCancelAnimationFrame ||
window.oCancelAnimationFrame ||
window.msCancelAnimationFrame ||
function(requestId){};
CanvasLayer.prototype.setOptions=function(options){
if(options.animate!==undefined){
this.setAnimate(options.animate);
}
if(options.paneName!==undefined){
this.setPaneName(options.paneName);
}
if(options.updateHandler!==undefined){
this.setUpdateHandler(options.updateHandler);
}
if(options.resizeHandler!==undefined){
this.setResizeHandler(options.resizeHandler);
}
if(options.resolutionScale!==undefined){
this.setResolutionScale(options.resolutionScale);
}
if(options.map!==undefined){
this.setMap(options.map);
}};
CanvasLayer.prototype.setAnimate=function(animate){
this.isAnimated_ = !!animate;
if(this.isAnimated_){
this.scheduleUpdate();
}};
CanvasLayer.prototype.isAnimated=function(){
return this.isAnimated_;
};
CanvasLayer.prototype.setPaneName=function(paneName){
this.paneName_=paneName;
this.setPane_();
};
CanvasLayer.prototype.getPaneName=function(){
return this.paneName_;
};
CanvasLayer.prototype.setPane_=function(){
if(!this.isAdded_){
return;
}
var panes=this.getPanes();
if(!panes[this.paneName_]){
throw new Error('"' + this.paneName_ + '" is not a valid MapPane name.');
}
panes[this.paneName_].appendChild(this.canvas);
};
CanvasLayer.prototype.setResizeHandler=function(opt_resizeHandler){
this.resizeHandler_=opt_resizeHandler;
};
CanvasLayer.prototype.setResolutionScale=function(scale){
if(typeof scale==='number'){
this.resolutionScale_=scale;
this.resize_();
}};
CanvasLayer.prototype.setUpdateHandler=function(opt_updateHandler){
this.updateHandler_=opt_updateHandler;
};
CanvasLayer.prototype.onAdd=function(){
if(this.isAdded_){
return;
}
this.isAdded_=true;
this.setPane_();
this.resizeListener_=google.maps.event.addListener(this.getMap(),
'resize', this.resizeFunction_);
this.centerListener_=google.maps.event.addListener(this.getMap(),
'center_changed', this.repositionFunction_);
this.resize_();
this.repositionCanvas_();
};
CanvasLayer.prototype.onRemove=function(){
if(!this.isAdded_){
return;
}
this.isAdded_=false;
this.topLeft_=null;
this.canvas.parentElement.removeChild(this.canvas);
if(this.centerListener_){
google.maps.event.removeListener(this.centerListener_);
this.centerListener_=null;
}
if(this.resizeListener_){
google.maps.event.removeListener(this.resizeListener_);
this.resizeListener_=null;
}
if(this.requestAnimationFrameId_){
this.cancelAnimFrame_.call(window, this.requestAnimationFrameId_);
this.requestAnimationFrameId_=null;
}};
CanvasLayer.prototype.resize_=function(){
if(!this.isAdded_){
return;
}
var map=this.getMap();
var mapWidth=map.getDiv().getElementsByTagName('div')[0].offsetWidth;
var mapHeight=map.getDiv().getElementsByTagName('div')[0].offsetHeight;
var newWidth=mapWidth * this.resolutionScale_;
var newHeight=mapHeight * this.resolutionScale_;
var oldWidth=this.canvas.width;
var oldHeight=this.canvas.height;
if(oldWidth!==newWidth||oldHeight!==newHeight){
this.canvas.width=newWidth;
this.canvas.height=newHeight;
this.needsResize_=true;
this.scheduleUpdate();
}
if(this.canvasCssWidth_!==mapWidth ||
this.canvasCssHeight_!==mapHeight){
this.canvasCssWidth_=mapWidth;
this.canvasCssHeight_=mapHeight;
this.canvas.style.width=mapWidth + 'px';
this.canvas.style.height=mapHeight + 'px';
}};
CanvasLayer.prototype.draw=function(){
this.repositionCanvas_();
};
CanvasLayer.prototype.repositionCanvas_=function(){
var map=this.getMap();
var top=map.getBounds().getNorthEast().lat();
var center=map.getCenter();
var scale=Math.pow(2, map.getZoom());
var left=center.lng() - (this.canvasCssWidth_ * 180) / (256 * scale);
this.topLeft_=new google.maps.LatLng(top, left);
var projection=this.getProjection();
var divCenter=projection.fromLatLngToDivPixel(center);
var offsetX=-Math.round(this.canvasCssWidth_ / 2 - divCenter.x);
var offsetY=-Math.round(this.canvasCssHeight_ / 2 - divCenter.y);
this.canvas.style[CanvasLayer.CSS_TRANSFORM_]='translate(' +
offsetX + 'px,' + offsetY + 'px)';
this.scheduleUpdate();
};
CanvasLayer.prototype.update_=function(){
this.requestAnimationFrameId_=null;
if(!this.isAdded_){
return;
}
if(this.isAnimated_){
this.scheduleUpdate();
}
if(this.needsResize_&&this.resizeHandler_){
this.needsResize_=false;
this.resizeHandler_();
}
if(this.updateHandler_){
this.updateHandler_();
}};
CanvasLayer.prototype.getTopLeft=function(){
return this.topLeft_;
};
CanvasLayer.prototype.scheduleUpdate=function(){
if(this.isAdded_&&!this.requestAnimationFrameId_){
this.requestAnimationFrameId_ =
this.requestAnimFrame_.call(window, this.requestUpdateFunction_);
}};
(function(h){"function"===typeof define&&define.amd?define(["jquery"],function(D){return h(D,window,document)}):"object"===typeof exports?module.exports=function(D,I){D||(D=window);I||(I="undefined"!==typeof window?require("jquery"):require("jquery")(D));return h(I,D,D.document)}:h(jQuery,window,document)})(function(h,D,I,k){function X(a){var b,c,d={};h.each(a,function(e){if((b=e.match(/^([^A-Z]+?)([A-Z])/))&&-1!=="a aa ai ao as b fn i m o s ".indexOf(b[1]+" "))c=e.replace(b[0],b[2].toLowerCase()),
d[c]=e,"o"===b[1]&&X(a[e])});a._hungarianMap=d}function K(a,b,c){a._hungarianMap||X(a);var d;h.each(b,function(e){d=a._hungarianMap[e];if(d!==k&&(c||b[d]===k))"o"===d.charAt(0)?(b[d]||(b[d]={}),h.extend(!0,b[d],b[e]),K(a[d],b[d],c)):b[d]=b[e]})}function Da(a){var b=m.defaults.oLanguage,c=a.sZeroRecords;!a.sEmptyTable&&(c&&"No data available in table"===b.sEmptyTable)&&E(a,a,"sZeroRecords","sEmptyTable");!a.sLoadingRecords&&(c&&"Loading..."===b.sLoadingRecords)&&E(a,a,"sZeroRecords","sLoadingRecords");
a.sInfoThousands&&(a.sThousands=a.sInfoThousands);(a=a.sDecimal)&&db(a)}function eb(a){A(a,"ordering","bSort");A(a,"orderMulti","bSortMulti");A(a,"orderClasses","bSortClasses");A(a,"orderCellsTop","bSortCellsTop");A(a,"order","aaSorting");A(a,"orderFixed","aaSortingFixed");A(a,"paging","bPaginate");A(a,"pagingType","sPaginationType");A(a,"pageLength","iDisplayLength");A(a,"searching","bFilter");"boolean"===typeof a.sScrollX&&(a.sScrollX=a.sScrollX?"100%":"");"boolean"===typeof a.scrollX&&(a.scrollX=
a.scrollX?"100%":"");if(a=a.aoSearchCols)for(var b=0,c=a.length;b<c;b++)a[b]&&K(m.models.oSearch,a[b])}function fb(a){A(a,"orderable","bSortable");A(a,"orderData","aDataSort");A(a,"orderSequence","asSorting");A(a,"orderDataType","sortDataType");var b=a.aDataSort;b&&!h.isArray(b)&&(a.aDataSort=[b])}function gb(a){if(!m.__browser){var b={};m.__browser=b;var c=h("<div/>").css({position:"fixed",top:0,left:0,height:1,width:1,overflow:"hidden"}).append(h("<div/>").css({position:"absolute",top:1,left:1,
width:100,overflow:"scroll"}).append(h("<div/>").css({width:"100%",height:10}))).appendTo("body"),d=c.children(),e=d.children();b.barWidth=d[0].offsetWidth-d[0].clientWidth;b.bScrollOversize=100===e[0].offsetWidth&&100!==d[0].clientWidth;b.bScrollbarLeft=1!==Math.round(e.offset().left);b.bBounding=c[0].getBoundingClientRect().width?!0:!1;c.remove()}h.extend(a.oBrowser,m.__browser);a.oScroll.iBarWidth=m.__browser.barWidth}function hb(a,b,c,d,e,f){var g,j=!1;c!==k&&(g=c,j=!0);for(;d!==e;)a.hasOwnProperty(d)&&
(g=j?b(g,a[d],d,a):a[d],j=!0,d+=f);return g}function Ea(a,b){var c=m.defaults.column,d=a.aoColumns.length,c=h.extend({},m.models.oColumn,c,{nTh:b?b:I.createElement("th"),sTitle:c.sTitle?c.sTitle:b?b.innerHTML:"",aDataSort:c.aDataSort?c.aDataSort:[d],mData:c.mData?c.mData:d,idx:d});a.aoColumns.push(c);c=a.aoPreSearchCols;c[d]=h.extend({},m.models.oSearch,c[d]);ja(a,d,h(b).data())}function ja(a,b,c){var b=a.aoColumns[b],d=a.oClasses,e=h(b.nTh);if(!b.sWidthOrig){b.sWidthOrig=e.attr("width")||null;var f=
(e.attr("style")||"").match(/width:\s*(\d+[pxem%]+)/);f&&(b.sWidthOrig=f[1])}c!==k&&null!==c&&(fb(c),K(m.defaults.column,c),c.mDataProp!==k&&!c.mData&&(c.mData=c.mDataProp),c.sType&&(b._sManualType=c.sType),c.className&&!c.sClass&&(c.sClass=c.className),h.extend(b,c),E(b,c,"sWidth","sWidthOrig"),c.iDataSort!==k&&(b.aDataSort=[c.iDataSort]),E(b,c,"aDataSort"));var g=b.mData,j=Q(g),i=b.mRender?Q(b.mRender):null,c=function(a){return"string"===typeof a&&-1!==a.indexOf("@")};b._bAttrSrc=h.isPlainObject(g)&&
(c(g.sort)||c(g.type)||c(g.filter));b._setter=null;b.fnGetData=function(a,b,c){var d=j(a,b,k,c);return i&&b?i(d,b,a,c):d};b.fnSetData=function(a,b,c){return R(g)(a,b,c)};"number"!==typeof g&&(a._rowReadObject=!0);a.oFeatures.bSort||(b.bSortable=!1,e.addClass(d.sSortableNone));a=-1!==h.inArray("asc",b.asSorting);c=-1!==h.inArray("desc",b.asSorting);!b.bSortable||!a&&!c?(b.sSortingClass=d.sSortableNone,b.sSortingClassJUI=""):a&&!c?(b.sSortingClass=d.sSortableAsc,b.sSortingClassJUI=d.sSortJUIAscAllowed):
!a&&c?(b.sSortingClass=d.sSortableDesc,b.sSortingClassJUI=d.sSortJUIDescAllowed):(b.sSortingClass=d.sSortable,b.sSortingClassJUI=d.sSortJUI)}function Y(a){if(!1!==a.oFeatures.bAutoWidth){var b=a.aoColumns;Fa(a);for(var c=0,d=b.length;c<d;c++)b[c].nTh.style.width=b[c].sWidth}b=a.oScroll;(""!==b.sY||""!==b.sX)&&ka(a);u(a,null,"column-sizing",[a])}function Z(a,b){var c=la(a,"bVisible");return"number"===typeof c[b]?c[b]:null}function $(a,b){var c=la(a,"bVisible"),c=h.inArray(b,c);return-1!==c?c:null}
function aa(a){var b=0;h.each(a.aoColumns,function(a,d){d.bVisible&&"none"!==h(d.nTh).css("display")&&b++});return b}function la(a,b){var c=[];h.map(a.aoColumns,function(a,e){a[b]&&c.push(e)});return c}function Ga(a){var b=a.aoColumns,c=a.aoData,d=m.ext.type.detect,e,f,g,j,i,h,l,q,t;e=0;for(f=b.length;e<f;e++)if(l=b[e],t=[],!l.sType&&l._sManualType)l.sType=l._sManualType;else if(!l.sType){g=0;for(j=d.length;g<j;g++){i=0;for(h=c.length;i<h;i++){t[i]===k&&(t[i]=B(a,i,e,"type"));q=d[g](t[i],a);if(!q&&
g!==d.length-1)break;if("html"===q)break}if(q){l.sType=q;break}}l.sType||(l.sType="string")}}function ib(a,b,c,d){var e,f,g,j,i,n,l=a.aoColumns;if(b)for(e=b.length-1;0<=e;e--){n=b[e];var q=n.targets!==k?n.targets:n.aTargets;h.isArray(q)||(q=[q]);f=0;for(g=q.length;f<g;f++)if("number"===typeof q[f]&&0<=q[f]){for(;l.length<=q[f];)Ea(a);d(q[f],n)}else if("number"===typeof q[f]&&0>q[f])d(l.length+q[f],n);else if("string"===typeof q[f]){j=0;for(i=l.length;j<i;j++)("_all"==q[f]||h(l[j].nTh).hasClass(q[f]))&&
d(j,n)}}if(c){e=0;for(a=c.length;e<a;e++)d(e,c[e])}}function N(a,b,c,d){var e=a.aoData.length,f=h.extend(!0,{},m.models.oRow,{src:c?"dom":"data",idx:e});f._aData=b;a.aoData.push(f);for(var g=a.aoColumns,j=0,i=g.length;j<i;j++)g[j].sType=null;a.aiDisplayMaster.push(e);b=a.rowIdFn(b);b!==k&&(a.aIds[b]=f);(c||!a.oFeatures.bDeferRender)&&Ha(a,e,c,d);return e}function ma(a,b){var c;b instanceof h||(b=h(b));return b.map(function(b,e){c=Ia(a,e);return N(a,c.data,e,c.cells)})}function B(a,b,c,d){var e=a.iDraw,
f=a.aoColumns[c],g=a.aoData[b]._aData,j=f.sDefaultContent,i=f.fnGetData(g,d,{settings:a,row:b,col:c});if(i===k)return a.iDrawError!=e&&null===j&&(L(a,0,"Requested unknown parameter "+("function"==typeof f.mData?"{function}":"'"+f.mData+"'")+" for row "+b+", column "+c,4),a.iDrawError=e),j;if((i===g||null===i)&&null!==j&&d!==k)i=j;else if("function"===typeof i)return i.call(g);return null===i&&"display"==d?"":i}function jb(a,b,c,d){a.aoColumns[c].fnSetData(a.aoData[b]._aData,d,{settings:a,row:b,col:c})}
function Ja(a){return h.map(a.match(/(\\.|[^\.])+/g)||[""],function(a){return a.replace(/\\./g,".")})}function Q(a){if(h.isPlainObject(a)){var b={};h.each(a,function(a,c){c&&(b[a]=Q(c))});return function(a,c,f,g){var j=b[c]||b._;return j!==k?j(a,c,f,g):a}}if(null===a)return function(a){return a};if("function"===typeof a)return function(b,c,f,g){return a(b,c,f,g)};if("string"===typeof a&&(-1!==a.indexOf(".")||-1!==a.indexOf("[")||-1!==a.indexOf("("))){var c=function(a,b,f){var g,j;if(""!==f){j=Ja(f);
for(var i=0,n=j.length;i<n;i++){f=j[i].match(ba);g=j[i].match(U);if(f){j[i]=j[i].replace(ba,"");""!==j[i]&&(a=a[j[i]]);g=[];j.splice(0,i+1);j=j.join(".");if(h.isArray(a)){i=0;for(n=a.length;i<n;i++)g.push(c(a[i],b,j))}a=f[0].substring(1,f[0].length-1);a=""===a?g:g.join(a);break}else if(g){j[i]=j[i].replace(U,"");a=a[j[i]]();continue}if(null===a||a[j[i]]===k)return k;a=a[j[i]]}}return a};return function(b,e){return c(b,e,a)}}return function(b){return b[a]}}function R(a){if(h.isPlainObject(a))return R(a._);
if(null===a)return function(){};if("function"===typeof a)return function(b,d,e){a(b,"set",d,e)};if("string"===typeof a&&(-1!==a.indexOf(".")||-1!==a.indexOf("[")||-1!==a.indexOf("("))){var b=function(a,d,e){var e=Ja(e),f;f=e[e.length-1];for(var g,j,i=0,n=e.length-1;i<n;i++){g=e[i].match(ba);j=e[i].match(U);if(g){e[i]=e[i].replace(ba,"");a[e[i]]=[];f=e.slice();f.splice(0,i+1);g=f.join(".");if(h.isArray(d)){j=0;for(n=d.length;j<n;j++)f={},b(f,d[j],g),a[e[i]].push(f)}else a[e[i]]=d;return}j&&(e[i]=e[i].replace(U,
""),a=a[e[i]](d));if(null===a[e[i]]||a[e[i]]===k)a[e[i]]={};a=a[e[i]]}if(f.match(U))a[f.replace(U,"")](d);else a[f.replace(ba,"")]=d};return function(c,d){return b(c,d,a)}}return function(b,d){b[a]=d}}function Ka(a){return G(a.aoData,"_aData")}function na(a){a.aoData.length=0;a.aiDisplayMaster.length=0;a.aiDisplay.length=0;a.aIds={}}function oa(a,b,c){for(var d=-1,e=0,f=a.length;e<f;e++)a[e]==b?d=e:a[e]>b&&a[e]--; -1!=d&&c===k&&a.splice(d,1)}function ca(a,b,c,d){var e=a.aoData[b],f,g=function(c,d){for(;c.childNodes.length;)c.removeChild(c.firstChild);
c.innerHTML=B(a,b,d,"display")};if("dom"===c||(!c||"auto"===c)&&"dom"===e.src)e._aData=Ia(a,e,d,d===k?k:e._aData).data;else{var j=e.anCells;if(j)if(d!==k)g(j[d],d);else{c=0;for(f=j.length;c<f;c++)g(j[c],c)}}e._aSortData=null;e._aFilterData=null;g=a.aoColumns;if(d!==k)g[d].sType=null;else{c=0;for(f=g.length;c<f;c++)g[c].sType=null;La(a,e)}}function Ia(a,b,c,d){var e=[],f=b.firstChild,g,j,i=0,n,l=a.aoColumns,q=a._rowReadObject,d=d!==k?d:q?{}:[],t=function(a,b){if("string"===typeof a){var c=a.indexOf("@");
-1!==c&&(c=a.substring(c+1),R(a)(d,b.getAttribute(c)))}},S=function(a){if(c===k||c===i)j=l[i],n=h.trim(a.innerHTML),j&&j._bAttrSrc?(R(j.mData._)(d,n),t(j.mData.sort,a),t(j.mData.type,a),t(j.mData.filter,a)):q?(j._setter||(j._setter=R(j.mData)),j._setter(d,n)):d[i]=n;i++};if(f)for(;f;){g=f.nodeName.toUpperCase();if("TD"==g||"TH"==g)S(f),e.push(f);f=f.nextSibling}else{e=b.anCells;f=0;for(g=e.length;f<g;f++)S(e[f])}if(b=b.firstChild?b:b.nTr)(b=b.getAttribute("id"))&&R(a.rowId)(d,b);return{data:d,cells:e}}
function Ha(a,b,c,d){var e=a.aoData[b],f=e._aData,g=[],j,i,n,l,q;if(null===e.nTr){j=c||I.createElement("tr");e.nTr=j;e.anCells=g;j._DT_RowIndex=b;La(a,e);l=0;for(q=a.aoColumns.length;l<q;l++){n=a.aoColumns[l];i=c?d[l]:I.createElement(n.sCellType);i._DT_CellIndex={row:b,column:l};g.push(i);if((!c||n.mRender||n.mData!==l)&&(!h.isPlainObject(n.mData)||n.mData._!==l+".display"))i.innerHTML=B(a,b,l,"display");n.sClass&&(i.className+=" "+n.sClass);n.bVisible&&!c?j.appendChild(i):!n.bVisible&&c&&i.parentNode.removeChild(i);
n.fnCreatedCell&&n.fnCreatedCell.call(a.oInstance,i,B(a,b,l),f,b,l)}u(a,"aoRowCreatedCallback",null,[j,f,b])}e.nTr.setAttribute("role","row")}function La(a,b){var c=b.nTr,d=b._aData;if(c){var e=a.rowIdFn(d);e&&(c.id=e);d.DT_RowClass&&(e=d.DT_RowClass.split(" "),b.__rowc=b.__rowc?pa(b.__rowc.concat(e)):e,h(c).removeClass(b.__rowc.join(" ")).addClass(d.DT_RowClass));d.DT_RowAttr&&h(c).attr(d.DT_RowAttr);d.DT_RowData&&h(c).data(d.DT_RowData)}}function kb(a){var b,c,d,e,f,g=a.nTHead,j=a.nTFoot,i=0===h("th, td",g).length,n=a.oClasses,l=a.aoColumns;i&&(e=h("<tr/>").appendTo(g));b=0;for(c=l.length;b<c;b++)f=l[b],d=h(f.nTh).addClass(f.sClass),i&&d.appendTo(e),a.oFeatures.bSort&&(d.addClass(f.sSortingClass),!1!==f.bSortable&&(d.attr("tabindex",a.iTabIndex).attr("aria-controls",a.sTableId),Ma(a,f.nTh,b))),f.sTitle!=d[0].innerHTML&&d.html(f.sTitle),Na(a,"header")(a,d,f,n);i&&da(a.aoHeader,g);h(g).find(">tr").attr("role","row");h(g).find(">tr>th, >tr>td").addClass(n.sHeaderTH);h(j).find(">tr>th, >tr>td").addClass(n.sFooterTH);
if(null!==j){a=a.aoFooter[0];b=0;for(c=a.length;b<c;b++)f=l[b],f.nTf=a[b].cell,f.sClass&&h(f.nTf).addClass(f.sClass)}}function ea(a,b,c){var d,e,f,g=[],j=[],i=a.aoColumns.length,n;if(b){c===k&&(c=!1);d=0;for(e=b.length;d<e;d++){g[d]=b[d].slice();g[d].nTr=b[d].nTr;for(f=i-1;0<=f;f--)!a.aoColumns[f].bVisible&&!c&&g[d].splice(f,1);j.push([])}d=0;for(e=g.length;d<e;d++){if(a=g[d].nTr)for(;f=a.firstChild;)a.removeChild(f);f=0;for(b=g[d].length;f<b;f++)if(n=i=1,j[d][f]===k){a.appendChild(g[d][f].cell);
for(j[d][f]=1;g[d+i]!==k&&g[d][f].cell==g[d+i][f].cell;)j[d+i][f]=1,i++;for(;g[d][f+n]!==k&&g[d][f].cell==g[d][f+n].cell;){for(c=0;c<i;c++)j[d+c][f+n]=1;n++}h(g[d][f].cell).attr("rowspan",i).attr("colspan",n)}}}}function O(a){var b=u(a,"aoPreDrawCallback","preDraw",[a]);if(-1!==h.inArray(!1,b))C(a,!1);else{var b=[],c=0,d=a.asStripeClasses,e=d.length,f=a.oLanguage,g=a.iInitDisplayStart,j="ssp"==y(a),i=a.aiDisplay;a.bDrawing=!0;g!==k&&-1!==g&&(a._iDisplayStart=j?g:g>=a.fnRecordsDisplay()?0:g,a.iInitDisplayStart=
-1);var g=a._iDisplayStart,n=a.fnDisplayEnd();if(a.bDeferLoading)a.bDeferLoading=!1,a.iDraw++,C(a,!1);else if(j){if(!a.bDestroying&&!lb(a))return}else a.iDraw++;if(0!==i.length){f=j?a.aoData.length:n;for(j=j?0:g;j<f;j++){var l=i[j],q=a.aoData[l];null===q.nTr&&Ha(a,l);l=q.nTr;if(0!==e){var t=d[c%e];q._sRowStripe!=t&&(h(l).removeClass(q._sRowStripe).addClass(t),q._sRowStripe=t)}u(a,"aoRowCallback",null,[l,q._aData,c,j]);b.push(l);c++}}else c=f.sZeroRecords,1==a.iDraw&&"ajax"==y(a)?c=f.sLoadingRecords:
f.sEmptyTable&&0===a.fnRecordsTotal()&&(c=f.sEmptyTable),b[0]=h("<tr/>",{"class":e?d[0]:""}).append(h("<td />",{valign:"top",colSpan:aa(a),"class":a.oClasses.sRowEmpty}).html(c))[0];u(a,"aoHeaderCallback","header",[h(a.nTHead).children("tr")[0],Ka(a),g,n,i]);u(a,"aoFooterCallback","footer",[h(a.nTFoot).children("tr")[0],Ka(a),g,n,i]);d=h(a.nTBody);d.children().detach();d.append(h(b));u(a,"aoDrawCallback","draw",[a]);a.bSorted=!1;a.bFiltered=!1;a.bDrawing=!1}}function T(a,b){var c=a.oFeatures,d=c.bFilter;
c.bSort&&mb(a);d?fa(a,a.oPreviousSearch):a.aiDisplay=a.aiDisplayMaster.slice();!0!==b&&(a._iDisplayStart=0);a._drawHold=b;O(a);a._drawHold=!1}function nb(a){var b=a.oClasses,c=h(a.nTable),c=h("<div/>").insertBefore(c),d=a.oFeatures,e=h("<div/>",{id:a.sTableId+"_wrapper","class":b.sWrapper+(a.nTFoot?"":" "+b.sNoFooter)});a.nHolding=c[0];a.nTableWrapper=e[0];a.nTableReinsertBefore=a.nTable.nextSibling;for(var f=a.sDom.split(""),g,j,i,n,l,q,t=0;t<f.length;t++){g=null;j=f[t];if("<"==j){i=h("<div/>")[0];
n=f[t+1];if("'"==n||'"'==n){l="";for(q=2;f[t+q]!=n;)l+=f[t+q],q++;"H"==l?l=b.sJUIHeader:"F"==l&&(l=b.sJUIFooter);-1!=l.indexOf(".")?(n=l.split("."),i.id=n[0].substr(1,n[0].length-1),i.className=n[1]):"#"==l.charAt(0)?i.id=l.substr(1,l.length-1):i.className=l;t+=q}e.append(i);e=h(i)}else if(">"==j)e=e.parent();else if("l"==j&&d.bPaginate&&d.bLengthChange)g=ob(a);else if("f"==j&&d.bFilter)g=pb(a);else if("r"==j&&d.bProcessing)g=qb(a);else if("t"==j)g=rb(a);else if("i"==j&&d.bInfo)g=sb(a);else if("p"==j&&d.bPaginate)g=tb(a);else if(0!==m.ext.feature.length){i=m.ext.feature;q=0;for(n=i.length;q<n;q++)if(j==i[q].cFeature){g=i[q].fnInit(a);break}}g&&(i=a.aanFeatures,i[j]||(i[j]=[]),i[j].push(g),e.append(g))}c.replaceWith(e);a.nHolding=null}function da(a,b){var c=h(b).children("tr"),d,e,f,g,j,i,n,l,q,t;a.splice(0,a.length);f=0;for(i=c.length;f<i;f++)a.push([]);f=0;for(i=c.length;f<i;f++){d=c[f];for(e=d.firstChild;e;){if("TD"==e.nodeName.toUpperCase()||"TH"==e.nodeName.toUpperCase()){l=1*e.getAttribute("colspan");
q=1*e.getAttribute("rowspan");l=!l||0===l||1===l?1:l;q=!q||0===q||1===q?1:q;g=0;for(j=a[f];j[g];)g++;n=g;t=1===l?!0:!1;for(j=0;j<l;j++)for(g=0;g<q;g++)a[f+g][n+j]={cell:e,unique:t},a[f+g].nTr=d}e=e.nextSibling}}}function qa(a,b,c){var d=[];c||(c=a.aoHeader,b&&(c=[],da(c,b)));for(var b=0,e=c.length;b<e;b++)for(var f=0,g=c[b].length;f<g;f++)if(c[b][f].unique&&(!d[f]||!a.bSortCellsTop))d[f]=c[b][f].cell;return d}function ra(a,b,c){u(a,"aoServerParams","serverParams",[b]);if(b&&h.isArray(b)){var d={},
e=/(.*?)\[\]$/;h.each(b,function(a,b){var c=b.name.match(e);c?(c=c[0],d[c]||(d[c]=[]),d[c].push(b.value)):d[b.name]=b.value});b=d}var f,g=a.ajax,j=a.oInstance,i=function(b){u(a,null,"xhr",[a,b,a.jqXHR]);c(b)};if(h.isPlainObject(g)&&g.data){f=g.data;var n=h.isFunction(f)?f(b,a):f,b=h.isFunction(f)&&n?n:h.extend(!0,b,n);delete g.data}n={data:b,success:function(b){var c=b.error||b.sError;c&&L(a,0,c);a.json=b;i(b)},dataType:"json",cache:!1,type:a.sServerMethod,error:function(b,c){var d=u(a,null,"xhr",
[a,null,a.jqXHR]);-1===h.inArray(!0,d)&&("parsererror"==c?L(a,0,"Invalid JSON response",1):4===b.readyState&&L(a,0,"Ajax error",7));C(a,!1)}};a.oAjaxData=b;u(a,null,"preXhr",[a,b]);a.fnServerData?a.fnServerData.call(j,a.sAjaxSource,h.map(b,function(a,b){return{name:b,value:a}}),i,a):a.sAjaxSource||"string"===typeof g?a.jqXHR=h.ajax(h.extend(n,{url:g||a.sAjaxSource})):h.isFunction(g)?a.jqXHR=g.call(j,b,i,a):(a.jqXHR=h.ajax(h.extend(n,g)),g.data=f)}function lb(a){return a.bAjaxDataGet?(a.iDraw++,C(a,
!0),ra(a,ub(a),function(b){vb(a,b)}),!1):!0}function ub(a){var b=a.aoColumns,c=b.length,d=a.oFeatures,e=a.oPreviousSearch,f=a.aoPreSearchCols,g,j=[],i,n,l,q=V(a);g=a._iDisplayStart;i=!1!==d.bPaginate?a._iDisplayLength:-1;var k=function(a,b){j.push({name:a,value:b})};k("sEcho",a.iDraw);k("iColumns",c);k("sColumns",G(b,"sName").join(","));k("iDisplayStart",g);k("iDisplayLength",i);var S={draw:a.iDraw,columns:[],order:[],start:g,length:i,search:{value:e.sSearch,regex:e.bRegex}};for(g=0;g<c;g++)n=b[g],
l=f[g],i="function"==typeof n.mData?"function":n.mData,S.columns.push({data:i,name:n.sName,searchable:n.bSearchable,orderable:n.bSortable,search:{value:l.sSearch,regex:l.bRegex}}),k("mDataProp_"+g,i),d.bFilter&&(k("sSearch_"+g,l.sSearch),k("bRegex_"+g,l.bRegex),k("bSearchable_"+g,n.bSearchable)),d.bSort&&k("bSortable_"+g,n.bSortable);d.bFilter&&(k("sSearch",e.sSearch),k("bRegex",e.bRegex));d.bSort&&(h.each(q,function(a,b){S.order.push({column:b.col,dir:b.dir});k("iSortCol_"+a,b.col);k("sSortDir_"+
a,b.dir)}),k("iSortingCols",q.length));b=m.ext.legacy.ajax;return null===b?a.sAjaxSource?j:S:b?j:S}function vb(a,b){var c=sa(a,b),d=b.sEcho!==k?b.sEcho:b.draw,e=b.iTotalRecords!==k?b.iTotalRecords:b.recordsTotal,f=b.iTotalDisplayRecords!==k?b.iTotalDisplayRecords:b.recordsFiltered;if(d){if(1*d<a.iDraw)return;a.iDraw=1*d}na(a);a._iRecordsTotal=parseInt(e,10);a._iRecordsDisplay=parseInt(f,10);d=0;for(e=c.length;d<e;d++)N(a,c[d]);a.aiDisplay=a.aiDisplayMaster.slice();a.bAjaxDataGet=!1;O(a);a._bInitComplete||
ta(a,b);a.bAjaxDataGet=!0;C(a,!1)}function sa(a,b){var c=h.isPlainObject(a.ajax)&&a.ajax.dataSrc!==k?a.ajax.dataSrc:a.sAjaxDataProp;return"data"===c?b.aaData||b[c]:""!==c?Q(c)(b):b}function pb(a){var b=a.oClasses,c=a.sTableId,d=a.oLanguage,e=a.oPreviousSearch,f=a.aanFeatures,g='<input type="search" class="'+b.sFilterInput+'"/>',j=d.sSearch,j=j.match(/_INPUT_/)?j.replace("_INPUT_",g):j+g,b=h("<div/>",{id:!f.f?c+"_filter":null,"class":b.sFilter}).append(h("<label/>").append(j)),f=function(){var b=!this.value?
"":this.value;b!=e.sSearch&&(fa(a,{sSearch:b,bRegex:e.bRegex,bSmart:e.bSmart,bCaseInsensitive:e.bCaseInsensitive}),a._iDisplayStart=0,O(a))},g=null!==a.searchDelay?a.searchDelay:"ssp"===y(a)?400:0,i=h("input",b).val(e.sSearch).attr("placeholder",d.sSearchPlaceholder).bind("keyup.DT search.DT input.DT paste.DT cut.DT",g?Oa(f,g):f).bind("keypress.DT",function(a){if(13==a.keyCode)return!1}).attr("aria-controls",c);h(a.nTable).on("search.dt.DT",function(b,c){if(a===c)try{i[0]!==I.activeElement&&i.val(e.sSearch)}catch(d){}});
return b[0]}function fa(a,b,c){var d=a.oPreviousSearch,e=a.aoPreSearchCols,f=function(a){d.sSearch=a.sSearch;d.bRegex=a.bRegex;d.bSmart=a.bSmart;d.bCaseInsensitive=a.bCaseInsensitive};Ga(a);if("ssp"!=y(a)){wb(a,b.sSearch,c,b.bEscapeRegex!==k?!b.bEscapeRegex:b.bRegex,b.bSmart,b.bCaseInsensitive);f(b);for(b=0;b<e.length;b++)xb(a,e[b].sSearch,b,e[b].bEscapeRegex!==k?!e[b].bEscapeRegex:e[b].bRegex,e[b].bSmart,e[b].bCaseInsensitive);yb(a)}else f(b);a.bFiltered=!0;u(a,null,"search",[a])}function yb(a){for(var b=
m.ext.search,c=a.aiDisplay,d,e,f=0,g=b.length;f<g;f++){for(var j=[],i=0,n=c.length;i<n;i++)e=c[i],d=a.aoData[e],b[f](a,d._aFilterData,e,d._aData,i)&&j.push(e);c.length=0;h.merge(c,j)}}function xb(a,b,c,d,e,f){if(""!==b)for(var g=a.aiDisplay,d=Pa(b,d,e,f),e=g.length-1;0<=e;e--)b=a.aoData[g[e]]._aFilterData[c],d.test(b)||g.splice(e,1)}function wb(a,b,c,d,e,f){var d=Pa(b,d,e,f),e=a.oPreviousSearch.sSearch,f=a.aiDisplayMaster,g;0!==m.ext.search.length&&(c=!0);g=zb(a);if(0>=b.length)a.aiDisplay=f.slice();
else{if(g||c||e.length>b.length||0!==b.indexOf(e)||a.bSorted)a.aiDisplay=f.slice();b=a.aiDisplay;for(c=b.length-1;0<=c;c--)d.test(a.aoData[b[c]]._sFilterRow)||b.splice(c,1)}}function Pa(a,b,c,d){a=b?a:Qa(a);c&&(a="^(?=.*?"+h.map(a.match(/"[^"]+"|[^ ]+/g)||[""],function(a){if('"'===a.charAt(0))var b=a.match(/^"(.*)"$/),a=b?b[1]:a;return a.replace('"',"")}).join(")(?=.*?")+").*$");return RegExp(a,d?"i":"")}function zb(a){var b=a.aoColumns,c,d,e,f,g,j,i,h,l=m.ext.type.search;c=!1;d=0;for(f=a.aoData.length;d<
f;d++)if(h=a.aoData[d],!h._aFilterData){j=[];e=0;for(g=b.length;e<g;e++)c=b[e],c.bSearchable?(i=B(a,d,e,"filter"),l[c.sType]&&(i=l[c.sType](i)),null===i&&(i=""),"string"!==typeof i&&i.toString&&(i=i.toString())):i="",i.indexOf&&-1!==i.indexOf("&")&&(ua.innerHTML=i,i=Zb?ua.textContent:ua.innerText),i.replace&&(i=i.replace(/[\r\n]/g,"")),j.push(i);h._aFilterData=j;h._sFilterRow=j.join("  ");c=!0}return c}function Ab(a){return{search:a.sSearch,smart:a.bSmart,regex:a.bRegex,caseInsensitive:a.bCaseInsensitive}}
function Bb(a){return{sSearch:a.search,bSmart:a.smart,bRegex:a.regex,bCaseInsensitive:a.caseInsensitive}}function sb(a){var b=a.sTableId,c=a.aanFeatures.i,d=h("<div/>",{"class":a.oClasses.sInfo,id:!c?b+"_info":null});c||(a.aoDrawCallback.push({fn:Cb,sName:"information"}),d.attr("role","status").attr("aria-live","polite"),h(a.nTable).attr("aria-describedby",b+"_info"));return d[0]}function Cb(a){var b=a.aanFeatures.i;if(0!==b.length){var c=a.oLanguage,d=a._iDisplayStart+1,e=a.fnDisplayEnd(),f=a.fnRecordsTotal(),
g=a.fnRecordsDisplay(),j=g?c.sInfo:c.sInfoEmpty;g!==f&&(j+=" "+c.sInfoFiltered);j+=c.sInfoPostFix;j=Db(a,j);c=c.fnInfoCallback;null!==c&&(j=c.call(a.oInstance,a,d,e,f,g,j));h(b).html(j)}}function Db(a,b){var c=a.fnFormatNumber,d=a._iDisplayStart+1,e=a._iDisplayLength,f=a.fnRecordsDisplay(),g=-1===e;return b.replace(/_START_/g,c.call(a,d)).replace(/_END_/g,c.call(a,a.fnDisplayEnd())).replace(/_MAX_/g,c.call(a,a.fnRecordsTotal())).replace(/_TOTAL_/g,c.call(a,f)).replace(/_PAGE_/g,c.call(a,g?1:Math.ceil(d/
e))).replace(/_PAGES_/g,c.call(a,g?1:Math.ceil(f/e)))}function ga(a){var b,c,d=a.iInitDisplayStart,e=a.aoColumns,f;c=a.oFeatures;var g=a.bDeferLoading;if(a.bInitialised){nb(a);kb(a);ea(a,a.aoHeader);ea(a,a.aoFooter);C(a,!0);c.bAutoWidth&&Fa(a);b=0;for(c=e.length;b<c;b++)f=e[b],f.sWidth&&(f.nTh.style.width=x(f.sWidth));u(a,null,"preInit",[a]);T(a);e=y(a);if("ssp"!=e||g)"ajax"==e?ra(a,[],function(c){var f=sa(a,c);for(b=0;b<f.length;b++)N(a,f[b]);a.iInitDisplayStart=d;T(a);C(a,!1);ta(a,c)},a):(C(a,!1),
ta(a))}else setTimeout(function(){ga(a)},200)}function ta(a,b){a._bInitComplete=!0;(b||a.oInit.aaData)&&Y(a);u(a,null,"plugin-init",[a,b]);u(a,"aoInitComplete","init",[a,b])}function Ra(a,b){var c=parseInt(b,10);a._iDisplayLength=c;Sa(a);u(a,null,"length",[a,c])}function ob(a){for(var b=a.oClasses,c=a.sTableId,d=a.aLengthMenu,e=h.isArray(d[0]),f=e?d[0]:d,d=e?d[1]:d,e=h("<select/>",{name:c+"_length","aria-controls":c,"class":b.sLengthSelect}),g=0,j=f.length;g<j;g++)e[0][g]=new Option(d[g],f[g]);var i=
h("<div><label/></div>").addClass(b.sLength);a.aanFeatures.l||(i[0].id=c+"_length");i.children().append(a.oLanguage.sLengthMenu.replace("_MENU_",e[0].outerHTML));h("select",i).val(a._iDisplayLength).bind("change.DT",function(){Ra(a,h(this).val());O(a)});h(a.nTable).bind("length.dt.DT",function(b,c,d){a===c&&h("select",i).val(d)});return i[0]}function tb(a){var b=a.sPaginationType,c=m.ext.pager[b],d="function"===typeof c,e=function(a){O(a)},b=h("<div/>").addClass(a.oClasses.sPaging+b)[0],f=a.aanFeatures;
d||c.fnInit(a,b,e);f.p||(b.id=a.sTableId+"_paginate",a.aoDrawCallback.push({fn:function(a){if(d){var b=a._iDisplayStart,i=a._iDisplayLength,h=a.fnRecordsDisplay(),l=-1===i,b=l?0:Math.ceil(b/i),i=l?1:Math.ceil(h/i),h=c(b,i),k,l=0;for(k=f.p.length;l<k;l++)Na(a,"pageButton")(a,f.p[l],l,h,b,i)}else c.fnUpdate(a,e)},sName:"pagination"}));return b}function Ta(a,b,c){var d=a._iDisplayStart,e=a._iDisplayLength,f=a.fnRecordsDisplay();0===f||-1===e?d=0:"number"===typeof b?(d=b*e,d>f&&(d=0)):"first"==b?d=0:
"previous"==b?(d=0<=e?d-e:0,0>d&&(d=0)):"next"==b?d+e<f&&(d+=e):"last"==b?d=Math.floor((f-1)/e)*e:L(a,0,"Unknown paging action: "+b,5);b=a._iDisplayStart!==d;a._iDisplayStart=d;b&&(u(a,null,"page",[a]),c&&O(a));return b}function qb(a){return h("<div/>",{id:!a.aanFeatures.r?a.sTableId+"_processing":null,"class":a.oClasses.sProcessing}).html(a.oLanguage.sProcessing).insertBefore(a.nTable)[0]}function C(a,b){a.oFeatures.bProcessing&&h(a.aanFeatures.r).css("display",b?"block":"none");u(a,null,"processing",
[a,b])}function rb(a){var b=h(a.nTable);b.attr("role","grid");var c=a.oScroll;if(""===c.sX&&""===c.sY)return a.nTable;var d=c.sX,e=c.sY,f=a.oClasses,g=b.children("caption"),j=g.length?g[0]._captionSide:null,i=h(b[0].cloneNode(!1)),n=h(b[0].cloneNode(!1)),l=b.children("tfoot");l.length||(l=null);i=h("<div/>",{"class":f.sScrollWrapper}).append(h("<div/>",{"class":f.sScrollHead}).css({overflow:"hidden",position:"relative",border:0,width:d?!d?null:x(d):"100%"}).append(h("<div/>",{"class":f.sScrollHeadInner}).css({"box-sizing":"content-box",
width:c.sXInner||"100%"}).append(i.removeAttr("id").css("margin-left",0).append("top"===j?g:null).append(b.children("thead"))))).append(h("<div/>",{"class":f.sScrollBody}).css({position:"relative",overflow:"auto",width:!d?null:x(d)}).append(b));l&&i.append(h("<div/>",{"class":f.sScrollFoot}).css({overflow:"hidden",border:0,width:d?!d?null:x(d):"100%"}).append(h("<div/>",{"class":f.sScrollFootInner}).append(n.removeAttr("id").css("margin-left",0).append("bottom"===j?g:null).append(b.children("tfoot")))));
var b=i.children(),k=b[0],f=b[1],t=l?b[2]:null;if(d)h(f).on("scroll.DT",function(){var a=this.scrollLeft;k.scrollLeft=a;l&&(t.scrollLeft=a)});h(f).css(e&&c.bCollapse?"max-height":"height",e);a.nScrollHead=k;a.nScrollBody=f;a.nScrollFoot=t;a.aoDrawCallback.push({fn:ka,sName:"scrolling"});return i[0]}function ka(a){var b=a.oScroll,c=b.sX,d=b.sXInner,e=b.sY,b=b.iBarWidth,f=h(a.nScrollHead),g=f[0].style,j=f.children("div"),i=j[0].style,n=j.children("table"),j=a.nScrollBody,l=h(j),q=j.style,t=h(a.nScrollFoot).children("div"),
m=t.children("table"),o=h(a.nTHead),F=h(a.nTable),p=F[0],r=p.style,u=a.nTFoot?h(a.nTFoot):null,Eb=a.oBrowser,Ua=Eb.bScrollOversize,s=G(a.aoColumns,"nTh"),P,v,w,y,z=[],A=[],B=[],C=[],D,E=function(a){a=a.style;a.paddingTop="0";a.paddingBottom="0";a.borderTopWidth="0";a.borderBottomWidth="0";a.height=0};v=j.scrollHeight>j.clientHeight;if(a.scrollBarVis!==v&&a.scrollBarVis!==k)a.scrollBarVis=v,Y(a);else{a.scrollBarVis=v;F.children("thead, tfoot").remove();u&&(w=u.clone().prependTo(F),P=u.find("tr"),w=
w.find("tr"));y=o.clone().prependTo(F);o=o.find("tr");v=y.find("tr");y.find("th, td").removeAttr("tabindex");c||(q.width="100%",f[0].style.width="100%");h.each(qa(a,y),function(b,c){D=Z(a,b);c.style.width=a.aoColumns[D].sWidth});u&&J(function(a){a.style.width=""},w);f=F.outerWidth();if(""===c){r.width="100%";if(Ua&&(F.find("tbody").height()>j.offsetHeight||"scroll"==l.css("overflow-y")))r.width=x(F.outerWidth()-b);f=F.outerWidth()}else""!==d&&(r.width=x(d),f=F.outerWidth());J(E,v);J(function(a){B.push(a.innerHTML);
z.push(x(h(a).css("width")))},v);J(function(a,b){if(h.inArray(a,s)!==-1)a.style.width=z[b]},o);h(v).height(0);u&&(J(E,w),J(function(a){C.push(a.innerHTML);A.push(x(h(a).css("width")))},w),J(function(a,b){a.style.width=A[b]},P),h(w).height(0));J(function(a,b){a.innerHTML='<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+B[b]+"</div>";a.style.width=z[b]},v);u&&J(function(a,b){a.innerHTML='<div class="dataTables_sizing" style="height:0;overflow:hidden;">'+C[b]+"</div>";a.style.width=
A[b]},w);if(F.outerWidth()<f){P=j.scrollHeight>j.offsetHeight||"scroll"==l.css("overflow-y")?f+b:f;if(Ua&&(j.scrollHeight>j.offsetHeight||"scroll"==l.css("overflow-y")))r.width=x(P-b);(""===c||""!==d)&&L(a,1,"Possible column misalignment",6)}else P="100%";q.width=x(P);g.width=x(P);u&&(a.nScrollFoot.style.width=x(P));!e&&Ua&&(q.height=x(p.offsetHeight+b));c=F.outerWidth();n[0].style.width=x(c);i.width=x(c);d=F.height()>j.clientHeight||"scroll"==l.css("overflow-y");e="padding"+(Eb.bScrollbarLeft?"Left":
"Right");i[e]=d?b+"px":"0px";u&&(m[0].style.width=x(c),t[0].style.width=x(c),t[0].style[e]=d?b+"px":"0px");F.children("colgroup").insertBefore(F.children("thead"));l.scroll();if((a.bSorted||a.bFiltered)&&!a._drawHold)j.scrollTop=0}}function J(a,b,c){for(var d=0,e=0,f=b.length,g,j;e<f;){g=b[e].firstChild;for(j=c?c[e].firstChild:null;g;)1===g.nodeType&&(c?a(g,j,d):a(g,d),d++),g=g.nextSibling,j=c?j.nextSibling:null;e++}}function Fa(a){var b=a.nTable,c=a.aoColumns,d=a.oScroll,e=d.sY,f=d.sX,g=d.sXInner,
j=c.length,i=la(a,"bVisible"),n=h("th",a.nTHead),l=b.getAttribute("width"),k=b.parentNode,t=!1,m,o,p=a.oBrowser,d=p.bScrollOversize;(m=b.style.width)&&-1!==m.indexOf("%")&&(l=m);for(m=0;m<i.length;m++)o=c[i[m]],null!==o.sWidth&&(o.sWidth=Fb(o.sWidthOrig,k),t=!0);if(d||!t&&!f&&!e&&j==aa(a)&&j==n.length)for(m=0;m<j;m++)i=Z(a,m),null!==i&&(c[i].sWidth=x(n.eq(m).width()));else{j=h(b).clone().css("visibility","hidden").removeAttr("id");j.find("tbody tr").remove();var r=h("<tr/>").appendTo(j.find("tbody"));
j.find("thead, tfoot").remove();j.append(h(a.nTHead).clone()).append(h(a.nTFoot).clone());j.find("tfoot th, tfoot td").css("width","");n=qa(a,j.find("thead")[0]);for(m=0;m<i.length;m++)o=c[i[m]],n[m].style.width=null!==o.sWidthOrig&&""!==o.sWidthOrig?x(o.sWidthOrig):"",o.sWidthOrig&&f&&h(n[m]).append(h("<div/>").css({width:o.sWidthOrig,margin:0,padding:0,border:0,height:1}));if(a.aoData.length)for(m=0;m<i.length;m++)t=i[m],o=c[t],h(Gb(a,t)).clone(!1).append(o.sContentPadding).appendTo(r);h("[name]",
j).removeAttr("name");o=h("<div/>").css(f||e?{position:"absolute",top:0,left:0,height:1,right:0,overflow:"hidden"}:{}).append(j).appendTo(k);f&&g?j.width(g):f?(j.css("width","auto"),j.removeAttr("width"),j.width()<k.clientWidth&&l&&j.width(k.clientWidth)):e?j.width(k.clientWidth):l&&j.width(l);for(m=e=0;m<i.length;m++)k=h(n[m]),g=k.outerWidth()-k.width(),k=p.bBounding?Math.ceil(n[m].getBoundingClientRect().width):k.outerWidth(),e+=k,c[i[m]].sWidth=x(k-g);b.style.width=x(e);o.remove()}l&&(b.style.width=
x(l));if((l||f)&&!a._reszEvt)b=function(){h(D).bind("resize.DT-"+a.sInstance,Oa(function(){Y(a)}))},d?setTimeout(b,1E3):b(),a._reszEvt=!0}function Fb(a,b){if(!a)return 0;var c=h("<div/>").css("width",x(a)).appendTo(b||I.body),d=c[0].offsetWidth;c.remove();return d}function Gb(a,b){var c=Hb(a,b);if(0>c)return null;var d=a.aoData[c];return!d.nTr?h("<td/>").html(B(a,c,b,"display"))[0]:d.anCells[b]}function Hb(a,b){for(var c,d=-1,e=-1,f=0,g=a.aoData.length;f<g;f++)c=B(a,f,b,"display")+"",c=c.replace($b,
""),c=c.replace(/&nbsp;/g," "),c.length>d&&(d=c.length,e=f);return e}function x(a){return null===a?"0px":"number"==typeof a?0>a?"0px":a+"px":a.match(/\d$/)?a+"px":a}function V(a){var b,c,d=[],e=a.aoColumns,f,g,j,i;b=a.aaSortingFixed;c=h.isPlainObject(b);var n=[];f=function(a){a.length&&!h.isArray(a[0])?n.push(a):h.merge(n,a)};h.isArray(b)&&f(b);c&&b.pre&&f(b.pre);f(a.aaSorting);c&&b.post&&f(b.post);for(a=0;a<n.length;a++){i=n[a][0];f=e[i].aDataSort;b=0;for(c=f.length;b<c;b++)g=f[b],j=e[g].sType||
"string",n[a]._idx===k&&(n[a]._idx=h.inArray(n[a][1],e[g].asSorting)),d.push({src:i,col:g,dir:n[a][1],index:n[a]._idx,type:j,formatter:m.ext.type.order[j+"-pre"]})}return d}function mb(a){var b,c,d=[],e=m.ext.type.order,f=a.aoData,g=0,j,i=a.aiDisplayMaster,h;Ga(a);h=V(a);b=0;for(c=h.length;b<c;b++)j=h[b],j.formatter&&g++,Ib(a,j.col);if("ssp"!=y(a)&&0!==h.length){b=0;for(c=i.length;b<c;b++)d[i[b]]=b;g===h.length?i.sort(function(a,b){var c,e,g,j,i=h.length,k=f[a]._aSortData,m=f[b]._aSortData;for(g=
0;g<i;g++)if(j=h[g],c=k[j.col],e=m[j.col],c=c<e?-1:c>e?1:0,0!==c)return"asc"===j.dir?c:-c;c=d[a];e=d[b];return c<e?-1:c>e?1:0}):i.sort(function(a,b){var c,g,j,i,k=h.length,m=f[a]._aSortData,p=f[b]._aSortData;for(j=0;j<k;j++)if(i=h[j],c=m[i.col],g=p[i.col],i=e[i.type+"-"+i.dir]||e["string-"+i.dir],c=i(c,g),0!==c)return c;c=d[a];g=d[b];return c<g?-1:c>g?1:0})}a.bSorted=!0}function Jb(a){for(var b,c,d=a.aoColumns,e=V(a),a=a.oLanguage.oAria,f=0,g=d.length;f<g;f++){c=d[f];var j=c.asSorting;b=c.sTitle.replace(/<.*?>/g,
"");var i=c.nTh;i.removeAttribute("aria-sort");c.bSortable&&(0<e.length&&e[0].col==f?(i.setAttribute("aria-sort","asc"==e[0].dir?"ascending":"descending"),c=j[e[0].index+1]||j[0]):c=j[0],b+="asc"===c?a.sSortAscending:a.sSortDescending);i.setAttribute("aria-label",b)}}function Va(a,b,c,d){var e=a.aaSorting,f=a.aoColumns[b].asSorting,g=function(a,b){var c=a._idx;c===k&&(c=h.inArray(a[1],f));return c+1<f.length?c+1:b?null:0};"number"===typeof e[0]&&(e=a.aaSorting=[e]);c&&a.oFeatures.bSortMulti?(c=h.inArray(b,
G(e,"0")),-1!==c?(b=g(e[c],!0),null===b&&1===e.length&&(b=0),null===b?e.splice(c,1):(e[c][1]=f[b],e[c]._idx=b)):(e.push([b,f[0],0]),e[e.length-1]._idx=0)):e.length&&e[0][0]==b?(b=g(e[0]),e.length=1,e[0][1]=f[b],e[0]._idx=b):(e.length=0,e.push([b,f[0]]),e[0]._idx=0);T(a);"function"==typeof d&&d(a)}function Ma(a,b,c,d){var e=a.aoColumns[c];Wa(b,{},function(b){!1!==e.bSortable&&(a.oFeatures.bProcessing?(C(a,!0),setTimeout(function(){Va(a,c,b.shiftKey,d);"ssp"!==y(a)&&C(a,!1)},0)):Va(a,c,b.shiftKey,d))})}
function va(a){var b=a.aLastSort,c=a.oClasses.sSortColumn,d=V(a),e=a.oFeatures,f,g;if(e.bSort&&e.bSortClasses){e=0;for(f=b.length;e<f;e++)g=b[e].src,h(G(a.aoData,"anCells",g)).removeClass(c+(2>e?e+1:3));e=0;for(f=d.length;e<f;e++)g=d[e].src,h(G(a.aoData,"anCells",g)).addClass(c+(2>e?e+1:3))}a.aLastSort=d}function Ib(a,b){var c=a.aoColumns[b],d=m.ext.order[c.sSortDataType],e;d&&(e=d.call(a.oInstance,a,b,$(a,b)));for(var f,g=m.ext.type.order[c.sType+"-pre"],j=0,i=a.aoData.length;j<i;j++)if(c=a.aoData[j],
c._aSortData||(c._aSortData=[]),!c._aSortData[b]||d)f=d?e[j]:B(a,j,b,"sort"),c._aSortData[b]=g?g(f):f}function wa(a){if(a.oFeatures.bStateSave&&!a.bDestroying){var b={time:+new Date,start:a._iDisplayStart,length:a._iDisplayLength,order:h.extend(!0,[],a.aaSorting),search:Ab(a.oPreviousSearch),columns:h.map(a.aoColumns,function(b,d){return{visible:b.bVisible,search:Ab(a.aoPreSearchCols[d])}})};u(a,"aoStateSaveParams","stateSaveParams",[a,b]);a.oSavedState=b;a.fnStateSaveCallback.call(a.oInstance,a,
b)}}function Kb(a){var b,c,d=a.aoColumns;if(a.oFeatures.bStateSave){var e=a.fnStateLoadCallback.call(a.oInstance,a);if(e&&e.time&&(b=u(a,"aoStateLoadParams","stateLoadParams",[a,e]),-1===h.inArray(!1,b)&&(b=a.iStateDuration,!(0<b&&e.time<+new Date-1E3*b)&&d.length===e.columns.length))){a.oLoadedState=h.extend(!0,{},e);e.start!==k&&(a._iDisplayStart=e.start,a.iInitDisplayStart=e.start);e.length!==k&&(a._iDisplayLength=e.length);e.order!==k&&(a.aaSorting=[],h.each(e.order,function(b,c){a.aaSorting.push(c[0]>=
d.length?[0,c[1]]:c)}));e.search!==k&&h.extend(a.oPreviousSearch,Bb(e.search));b=0;for(c=e.columns.length;b<c;b++){var f=e.columns[b];f.visible!==k&&(d[b].bVisible=f.visible);f.search!==k&&h.extend(a.aoPreSearchCols[b],Bb(f.search))}u(a,"aoStateLoaded","stateLoaded",[a,e])}}}function xa(a){var b=m.settings,a=h.inArray(a,G(b,"nTable"));return-1!==a?b[a]:null}function L(a,b,c,d){c="DataTables warning: "+(a?"table id="+a.sTableId+" - ":"")+c;d&&(c+=". For more information about this error, please see http://datatables.net/tn/"+
d);if(b)D.console&&console.log&&console.log(c);else if(b=m.ext,b=b.sErrMode||b.errMode,a&&u(a,null,"error",[a,d,c]),"alert"==b)alert(c);else{if("throw"==b)throw Error(c);"function"==typeof b&&b(a,d,c)}}function E(a,b,c,d){h.isArray(c)?h.each(c,function(c,d){h.isArray(d)?E(a,b,d[0],d[1]):E(a,b,d)}):(d===k&&(d=c),b[c]!==k&&(a[d]=b[c]))}function Lb(a,b,c){var d,e;for(e in b)b.hasOwnProperty(e)&&(d=b[e],h.isPlainObject(d)?(h.isPlainObject(a[e])||(a[e]={}),h.extend(!0,a[e],d)):a[e]=c&&"data"!==e&&"aaData"!==e&&h.isArray(d)?d.slice():d);return a}function Wa(a,b,c){h(a).bind("click.DT",b,function(b){a.blur();c(b)}).bind("keypress.DT",b,function(a){13===a.which&&(a.preventDefault(),c(a))}).bind("selectstart.DT",function(){return!1})}function z(a,b,c,d){c&&a[b].push({fn:c,sName:d})}function u(a,b,c,d){var e=[];b&&(e=h.map(a[b].slice().reverse(),function(b){return b.fn.apply(a.oInstance,d)}));null!==c&&(b=h.Event(c+".dt"),h(a.nTable).trigger(b,d),e.push(b.result));return e}function Sa(a){var b=a._iDisplayStart,
c=a.fnDisplayEnd(),d=a._iDisplayLength;b>=c&&(b=c-d);b-=b%d;if(-1===d||0>b)b=0;a._iDisplayStart=b}function Na(a,b){var c=a.renderer,d=m.ext.renderer[b];return h.isPlainObject(c)&&c[b]?d[c[b]]||d._:"string"===typeof c?d[c]||d._:d._}function y(a){return a.oFeatures.bServerSide?"ssp":a.ajax||a.sAjaxSource?"ajax":"dom"}function ya(a,b){var c=[],c=Mb.numbers_length,d=Math.floor(c/2);b<=c?c=W(0,b):a<=d?(c=W(0,c-2),c.push("ellipsis"),c.push(b-1)):(a>=b-1-d?c=W(b-(c-2),b):(c=W(a-d+2,a+d-1),c.push("ellipsis"),
c.push(b-1)),c.splice(0,0,"ellipsis"),c.splice(0,0,0));c.DT_el="span";return c}function db(a){h.each({num:function(b){return za(b,a)},"num-fmt":function(b){return za(b,a,Xa)},"html-num":function(b){return za(b,a,Aa)},"html-num-fmt":function(b){return za(b,a,Aa,Xa)}},function(b,c){v.type.order[b+a+"-pre"]=c;b.match(/^html\-/)&&(v.type.search[b+a]=v.type.search.html)})}function Nb(a){return function(){var b=[xa(this[m.ext.iApiIndex])].concat(Array.prototype.slice.call(arguments));return m.ext.internal[a].apply(this,
b)}}var m=function(a){this.$=function(a,b){return this.api(!0).$(a,b)};this._=function(a,b){return this.api(!0).rows(a,b).data()};this.api=function(a){return a?new r(xa(this[v.iApiIndex])):new r(this)};this.fnAddData=function(a,b){var c=this.api(!0),d=h.isArray(a)&&(h.isArray(a[0])||h.isPlainObject(a[0]))?c.rows.add(a):c.row.add(a);(b===k||b)&&c.draw();return d.flatten().toArray()};this.fnAdjustColumnSizing=function(a){var b=this.api(!0).columns.adjust(),c=b.settings()[0],d=c.oScroll;a===k||a?b.draw(!1):
(""!==d.sX||""!==d.sY)&&ka(c)};this.fnClearTable=function(a){var b=this.api(!0).clear();(a===k||a)&&b.draw()};this.fnClose=function(a){this.api(!0).row(a).child.hide()};this.fnDeleteRow=function(a,b,c){var d=this.api(!0),a=d.rows(a),e=a.settings()[0],h=e.aoData[a[0][0]];a.remove();b&&b.call(this,e,h);(c===k||c)&&d.draw();return h};this.fnDestroy=function(a){this.api(!0).destroy(a)};this.fnDraw=function(a){this.api(!0).draw(a)};this.fnFilter=function(a,b,c,d,e,h){e=this.api(!0);null===b||b===k?e.search(a,
c,d,h):e.column(b).search(a,c,d,h);e.draw()};this.fnGetData=function(a,b){var c=this.api(!0);if(a!==k){var d=a.nodeName?a.nodeName.toLowerCase():"";return b!==k||"td"==d||"th"==d?c.cell(a,b).data():c.row(a).data()||null}return c.data().toArray()};this.fnGetNodes=function(a){var b=this.api(!0);return a!==k?b.row(a).node():b.rows().nodes().flatten().toArray()};this.fnGetPosition=function(a){var b=this.api(!0),c=a.nodeName.toUpperCase();return"TR"==c?b.row(a).index():"TD"==c||"TH"==c?(a=b.cell(a).index(),
[a.row,a.columnVisible,a.column]):null};this.fnIsOpen=function(a){return this.api(!0).row(a).child.isShown()};this.fnOpen=function(a,b,c){return this.api(!0).row(a).child(b,c).show().child()[0]};this.fnPageChange=function(a,b){var c=this.api(!0).page(a);(b===k||b)&&c.draw(!1)};this.fnSetColumnVis=function(a,b,c){a=this.api(!0).column(a).visible(b);(c===k||c)&&a.columns.adjust().draw()};this.fnSettings=function(){return xa(this[v.iApiIndex])};this.fnSort=function(a){this.api(!0).order(a).draw()};this.fnSortListener=
function(a,b,c){this.api(!0).order.listener(a,b,c)};this.fnUpdate=function(a,b,c,d,e){var h=this.api(!0);c===k||null===c?h.row(b).data(a):h.cell(b,c).data(a);(e===k||e)&&h.columns.adjust();(d===k||d)&&h.draw();return 0};this.fnVersionCheck=v.fnVersionCheck;var b=this,c=a===k,d=this.length;c&&(a={});this.oApi=this.internal=v.internal;for(var e in m.ext.internal)e&&(this[e]=Nb(e));this.each(function(){var e={},e=1<d?Lb(e,a,!0):a,g=0,j,i=this.getAttribute("id"),n=!1,l=m.defaults,q=h(this);if("table"!=this.nodeName.toLowerCase())L(null,0,"Non-table node initialisation ("+this.nodeName+")",2);else{eb(l);fb(l.column);K(l,l,!0);K(l.column,l.column,!0);K(l,h.extend(e,q.data()));var t=m.settings,g=0;for(j=t.length;g<j;g++){var p=t[g];if(p.nTable==this||p.nTHead.parentNode==this||p.nTFoot&&p.nTFoot.parentNode==this){g=e.bRetrieve!==k?e.bRetrieve:l.bRetrieve;if(c||g)return p.oInstance;if(e.bDestroy!==k?e.bDestroy:l.bDestroy){p.oInstance.fnDestroy();break}else{L(p,0,"Cannot reinitialise DataTable",3);
return}}if(p.sTableId==this.id){t.splice(g,1);break}}if(null===i||""===i)this.id=i="DataTables_Table_"+m.ext._unique++;var o=h.extend(!0,{},m.models.oSettings,{sDestroyWidth:q[0].style.width,sInstance:i,sTableId:i});o.nTable=this;o.oApi=b.internal;o.oInit=e;t.push(o);o.oInstance=1===b.length?b:q.dataTable();eb(e);e.oLanguage&&Da(e.oLanguage);e.aLengthMenu&&!e.iDisplayLength&&(e.iDisplayLength=h.isArray(e.aLengthMenu[0])?e.aLengthMenu[0][0]:e.aLengthMenu[0]);e=Lb(h.extend(!0,{},l),e);E(o.oFeatures,
e,"bPaginate bLengthChange bFilter bSort bSortMulti bInfo bProcessing bAutoWidth bSortClasses bServerSide bDeferRender".split(" "));E(o,e,["asStripeClasses","ajax","fnServerData","fnFormatNumber","sServerMethod","aaSorting","aaSortingFixed","aLengthMenu","sPaginationType","sAjaxSource","sAjaxDataProp","iStateDuration","sDom","bSortCellsTop","iTabIndex","fnStateLoadCallback","fnStateSaveCallback","renderer","searchDelay","rowId",["iCookieDuration","iStateDuration"],["oSearch","oPreviousSearch"],["aoSearchCols",
"aoPreSearchCols"],["iDisplayLength","_iDisplayLength"],["bJQueryUI","bJUI"]]);E(o.oScroll,e,[["sScrollX","sX"],["sScrollXInner","sXInner"],["sScrollY","sY"],["bScrollCollapse","bCollapse"]]);E(o.oLanguage,e,"fnInfoCallback");z(o,"aoDrawCallback",e.fnDrawCallback,"user");z(o,"aoServerParams",e.fnServerParams,"user");z(o,"aoStateSaveParams",e.fnStateSaveParams,"user");z(o,"aoStateLoadParams",e.fnStateLoadParams,"user");z(o,"aoStateLoaded",e.fnStateLoaded,"user");z(o,"aoRowCallback",e.fnRowCallback,
"user");z(o,"aoRowCreatedCallback",e.fnCreatedRow,"user");z(o,"aoHeaderCallback",e.fnHeaderCallback,"user");z(o,"aoFooterCallback",e.fnFooterCallback,"user");z(o,"aoInitComplete",e.fnInitComplete,"user");z(o,"aoPreDrawCallback",e.fnPreDrawCallback,"user");o.rowIdFn=Q(e.rowId);gb(o);i=o.oClasses;e.bJQueryUI?(h.extend(i,m.ext.oJUIClasses,e.oClasses),e.sDom===l.sDom&&"lfrtip"===l.sDom&&(o.sDom='<"H"lfr>t<"F"ip>'),o.renderer)?h.isPlainObject(o.renderer)&&!o.renderer.header&&(o.renderer.header="jqueryui"):
o.renderer="jqueryui":h.extend(i,m.ext.classes,e.oClasses);q.addClass(i.sTable);o.iInitDisplayStart===k&&(o.iInitDisplayStart=e.iDisplayStart,o._iDisplayStart=e.iDisplayStart);null!==e.iDeferLoading&&(o.bDeferLoading=!0,g=h.isArray(e.iDeferLoading),o._iRecordsDisplay=g?e.iDeferLoading[0]:e.iDeferLoading,o._iRecordsTotal=g?e.iDeferLoading[1]:e.iDeferLoading);var r=o.oLanguage;h.extend(!0,r,e.oLanguage);""!==r.sUrl&&(h.ajax({dataType:"json",url:r.sUrl,success:function(a){Da(a);K(l.oLanguage,a);h.extend(true,
r,a);ga(o)},error:function(){ga(o)}}),n=!0);null===e.asStripeClasses&&(o.asStripeClasses=[i.sStripeOdd,i.sStripeEven]);var g=o.asStripeClasses,v=q.children("tbody").find("tr").eq(0);-1!==h.inArray(!0,h.map(g,function(a){return v.hasClass(a)}))&&(h("tbody tr",this).removeClass(g.join(" ")),o.asDestroyStripes=g.slice());t=[];g=this.getElementsByTagName("thead");0!==g.length&&(da(o.aoHeader,g[0]),t=qa(o));if(null===e.aoColumns){p=[];g=0;for(j=t.length;g<j;g++)p.push(null)}else p=e.aoColumns;g=0;for(j=
p.length;g<j;g++)Ea(o,t?t[g]:null);ib(o,e.aoColumnDefs,p,function(a,b){ja(o,a,b)});if(v.length){var s=function(a,b){return a.getAttribute("data-"+b)!==null?b:null};h(v[0]).children("th, td").each(function(a,b){var c=o.aoColumns[a];if(c.mData===a){var d=s(b,"sort")||s(b,"order"),e=s(b,"filter")||s(b,"search");if(d!==null||e!==null){c.mData={_:a+".display",sort:d!==null?a+".@data-"+d:k,type:d!==null?a+".@data-"+d:k,filter:e!==null?a+".@data-"+e:k};ja(o,a)}}})}var w=o.oFeatures;e.bStateSave&&(w.bStateSave=
!0,Kb(o,e),z(o,"aoDrawCallback",wa,"state_save"));if(e.aaSorting===k){t=o.aaSorting;g=0;for(j=t.length;g<j;g++)t[g][1]=o.aoColumns[g].asSorting[0]}va(o);w.bSort&&z(o,"aoDrawCallback",function(){if(o.bSorted){var a=V(o),b={};h.each(a,function(a,c){b[c.src]=c.dir});u(o,null,"order",[o,a,b]);Jb(o)}});z(o,"aoDrawCallback",function(){(o.bSorted||y(o)==="ssp"||w.bDeferRender)&&va(o)},"sc");g=q.children("caption").each(function(){this._captionSide=q.css("caption-side")});j=q.children("thead");0===j.length&&
(j=h("<thead/>").appendTo(this));o.nTHead=j[0];j=q.children("tbody");0===j.length&&(j=h("<tbody/>").appendTo(this));o.nTBody=j[0];j=q.children("tfoot");if(0===j.length&&0<g.length&&(""!==o.oScroll.sX||""!==o.oScroll.sY))j=h("<tfoot/>").appendTo(this);0===j.length||0===j.children().length?q.addClass(i.sNoFooter):0<j.length&&(o.nTFoot=j[0],da(o.aoFooter,o.nTFoot));if(e.aaData)for(g=0;g<e.aaData.length;g++)N(o,e.aaData[g]);else(o.bDeferLoading||"dom"==y(o))&&ma(o,h(o.nTBody).children("tr"));o.aiDisplay=
o.aiDisplayMaster.slice();o.bInitialised=!0;!1===n&&ga(o)}});b=null;return this},v,r,p,s,Ya={},Ob=/[\r\n]/g,Aa=/<.*?>/g,ac=/^[\w\+\-]/,bc=/[\w\+\-]$/,cc=RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\|\\$|\\^|\\-)","g"),Xa=/[',$Â£â‚¬Â¥%\u2009\u202F\u20BD\u20a9\u20BArfk]/gi,M=function(a){return!a||!0===a||"-"===a?!0:!1},Pb=function(a){var b=parseInt(a,10);return!isNaN(b)&&isFinite(a)?b:null},Qb=function(a,b){Ya[b]||(Ya[b]=RegExp(Qa(b),"g"));return"string"===typeof a&&"."!==b?a.replace(/\./g,
"").replace(Ya[b],"."):a},Za=function(a,b,c){var d="string"===typeof a;if(M(a))return!0;b&&d&&(a=Qb(a,b));c&&d&&(a=a.replace(Xa,""));return!isNaN(parseFloat(a))&&isFinite(a)},Rb=function(a,b,c){return M(a)?!0:!(M(a)||"string"===typeof a)?null:Za(a.replace(Aa,""),b,c)?!0:null},G=function(a,b,c){var d=[],e=0,f=a.length;if(c!==k)for(;e<f;e++)a[e]&&a[e][b]&&d.push(a[e][b][c]);else for(;e<f;e++)a[e]&&d.push(a[e][b]);return d},ha=function(a,b,c,d){var e=[],f=0,g=b.length;if(d!==k)for(;f<g;f++)a[b[f]][c]&&
e.push(a[b[f]][c][d]);else for(;f<g;f++)e.push(a[b[f]][c]);return e},W=function(a,b){var c=[],d;b===k?(b=0,d=a):(d=b,b=a);for(var e=b;e<d;e++)c.push(e);return c},Sb=function(a){for(var b=[],c=0,d=a.length;c<d;c++)a[c]&&b.push(a[c]);return b},pa=function(a){var b=[],c,d,e=a.length,f,g=0;d=0;a:for(;d<e;d++){c=a[d];for(f=0;f<g;f++)if(b[f]===c)continue a;b.push(c);g++}return b};m.util={throttle:function(a,b){var c=b!==k?b:200,d,e;return function(){var b=this,g=+new Date,h=arguments;d&&g<d+c?(clearTimeout(e),
e=setTimeout(function(){d=k;a.apply(b,h)},c)):(d=g,a.apply(b,h))}},escapeRegex:function(a){return a.replace(cc,"\\$1")}};var A=function(a,b,c){a[b]!==k&&(a[c]=a[b])},ba=/\[.*?\]$/,U=/\(\)$/,Qa=m.util.escapeRegex,ua=h("<div>")[0],Zb=ua.textContent!==k,$b=/<.*?>/g,Oa=m.util.throttle,Tb=[],w=Array.prototype,dc=function(a){var b,c,d=m.settings,e=h.map(d,function(a){return a.nTable});if(a){if(a.nTable&&a.oApi)return[a];if(a.nodeName&&"table"===a.nodeName.toLowerCase())return b=h.inArray(a,e),-1!==b?[d[b]]:
null;if(a&&"function"===typeof a.settings)return a.settings().toArray();"string"===typeof a?c=h(a):a instanceof h&&(c=a)}else return[];if(c)return c.map(function(){b=h.inArray(this,e);return-1!==b?d[b]:null}).toArray()};r=function(a,b){if(!(this instanceof r))return new r(a,b);var c=[],d=function(a){(a=dc(a))&&(c=c.concat(a))};if(h.isArray(a))for(var e=0,f=a.length;e<f;e++)d(a[e]);else d(a);this.context=pa(c);b&&h.merge(this,b);this.selector={rows:null,cols:null,opts:null};r.extend(this,this,Tb)};
m.Api=r;h.extend(r.prototype,{any:function(){return 0!==this.count()},concat:w.concat,context:[],count:function(){return this.flatten().length},each:function(a){for(var b=0,c=this.length;b<c;b++)a.call(this,this[b],b,this);return this},eq:function(a){var b=this.context;return b.length>a?new r(b[a],this[a]):null},filter:function(a){var b=[];if(w.filter)b=w.filter.call(this,a,this);else for(var c=0,d=this.length;c<d;c++)a.call(this,this[c],c,this)&&b.push(this[c]);return new r(this.context,b)},flatten:function(){var a=
[];return new r(this.context,a.concat.apply(a,this.toArray()))},join:w.join,indexOf:w.indexOf||function(a,b){for(var c=b||0,d=this.length;c<d;c++)if(this[c]===a)return c;return-1},iterator:function(a,b,c,d){var e=[],f,g,h,i,n,l=this.context,m,t,p=this.selector;"string"===typeof a&&(d=c,c=b,b=a,a=!1);g=0;for(h=l.length;g<h;g++){var o=new r(l[g]);if("table"===b)f=c.call(o,l[g],g),f!==k&&e.push(f);else if("columns"===b||"rows"===b)f=c.call(o,l[g],this[g],g),f!==k&&e.push(f);else if("column"===b||"column-rows"===b||"row"===b||"cell"===b){t=this[g];"column-rows"===b&&(m=Ba(l[g],p.opts));i=0;for(n=t.length;i<n;i++)f=t[i],f="cell"===b?c.call(o,l[g],f.row,f.column,g,i):c.call(o,l[g],f,g,i,m),f!==k&&e.push(f)}}return e.length||d?(a=new r(l,a?e.concat.apply([],e):e),b=a.selector,b.rows=p.rows,b.cols=p.cols,b.opts=p.opts,a):this},lastIndexOf:w.lastIndexOf||function(a,b){return this.indexOf.apply(this.toArray.reverse(),arguments)},length:0,map:function(a){var b=[];if(w.map)b=w.map.call(this,a,this);else for(var c=
0,d=this.length;c<d;c++)b.push(a.call(this,this[c],c));return new r(this.context,b)},pluck:function(a){return this.map(function(b){return b[a]})},pop:w.pop,push:w.push,reduce:w.reduce||function(a,b){return hb(this,a,b,0,this.length,1)},reduceRight:w.reduceRight||function(a,b){return hb(this,a,b,this.length-1,-1,-1)},reverse:w.reverse,selector:null,shift:w.shift,sort:w.sort,splice:w.splice,toArray:function(){return w.slice.call(this)},to$:function(){return h(this)},toJQuery:function(){return h(this)},
unique:function(){return new r(this.context,pa(this))},unshift:w.unshift});r.extend=function(a,b,c){if(c.length&&b&&(b instanceof r||b.__dt_wrapper)){var d,e,f,g=function(a,b,c){return function(){var d=b.apply(a,arguments);r.extend(d,d,c.methodExt);return d}};d=0;for(e=c.length;d<e;d++)f=c[d],b[f.name]="function"===typeof f.val?g(a,f.val,f):h.isPlainObject(f.val)?{}:f.val,b[f.name].__dt_wrapper=!0,r.extend(a,b[f.name],f.propExt)}};r.register=p=function(a,b){if(h.isArray(a))for(var c=0,d=a.length;c<
d;c++)r.register(a[c],b);else for(var e=a.split("."),f=Tb,g,j,c=0,d=e.length;c<d;c++){g=(j=-1!==e[c].indexOf("()"))?e[c].replace("()",""):e[c];var i;a:{i=0;for(var n=f.length;i<n;i++)if(f[i].name===g){i=f[i];break a}i=null}i||(i={name:g,val:{},methodExt:[],propExt:[]},f.push(i));c===d-1?i.val=b:f=j?i.methodExt:i.propExt}};r.registerPlural=s=function(a,b,c){r.register(a,c);r.register(b,function(){var a=c.apply(this,arguments);return a===this?this:a instanceof r?a.length?h.isArray(a[0])?new r(a.context,
a[0]):a[0]:k:a})};p("tables()",function(a){var b;if(a){b=r;var c=this.context;if("number"===typeof a)a=[c[a]];else var d=h.map(c,function(a){return a.nTable}),a=h(d).filter(a).map(function(){var a=h.inArray(this,d);return c[a]}).toArray();b=new b(a)}else b=this;return b});p("table()",function(a){var a=this.tables(a),b=a.context;return b.length?new r(b[0]):a});s("tables().nodes()","table().node()",function(){return this.iterator("table",function(a){return a.nTable},1)});s("tables().body()","table().body()",
function(){return this.iterator("table",function(a){return a.nTBody},1)});s("tables().header()","table().header()",function(){return this.iterator("table",function(a){return a.nTHead},1)});s("tables().footer()","table().footer()",function(){return this.iterator("table",function(a){return a.nTFoot},1)});s("tables().containers()","table().container()",function(){return this.iterator("table",function(a){return a.nTableWrapper},1)});p("draw()",function(a){return this.iterator("table",function(b){"page"===a?O(b):("string"===typeof a&&(a="full-hold"===a?!1:!0),T(b,!1===a))})});p("page()",function(a){return a===k?this.page.info().page:this.iterator("table",function(b){Ta(b,a)})});p("page.info()",function(){if(0===this.context.length)return k;var a=this.context[0],b=a._iDisplayStart,c=a.oFeatures.bPaginate?a._iDisplayLength:-1,d=a.fnRecordsDisplay(),e=-1===c;return{page:e?0:Math.floor(b/c),pages:e?1:Math.ceil(d/c),start:b,end:a.fnDisplayEnd(),length:c,recordsTotal:a.fnRecordsTotal(),recordsDisplay:d,
serverSide:"ssp"===y(a)}});p("page.len()",function(a){return a===k?0!==this.context.length?this.context[0]._iDisplayLength:k:this.iterator("table",function(b){Ra(b,a)})});var Ub=function(a,b,c){if(c){var d=new r(a);d.one("draw",function(){c(d.ajax.json())})}if("ssp"==y(a))T(a,b);else{C(a,!0);var e=a.jqXHR;e&&4!==e.readyState&&e.abort();ra(a,[],function(c){na(a);for(var c=sa(a,c),d=0,e=c.length;d<e;d++)N(a,c[d]);T(a,b);C(a,!1)})}};p("ajax.json()",function(){var a=this.context;if(0<a.length)return a[0].json});
p("ajax.params()",function(){var a=this.context;if(0<a.length)return a[0].oAjaxData});p("ajax.reload()",function(a,b){return this.iterator("table",function(c){Ub(c,!1===b,a)})});p("ajax.url()",function(a){var b=this.context;if(a===k){if(0===b.length)return k;b=b[0];return b.ajax?h.isPlainObject(b.ajax)?b.ajax.url:b.ajax:b.sAjaxSource}return this.iterator("table",function(b){h.isPlainObject(b.ajax)?b.ajax.url=a:b.ajax=a})});p("ajax.url().load()",function(a,b){return this.iterator("table",function(c){Ub(c,
!1===b,a)})});var $a=function(a,b,c,d,e){var f=[],g,j,i,n,l,m;i=typeof b;if(!b||"string"===i||"function"===i||b.length===k)b=[b];i=0;for(n=b.length;i<n;i++){j=b[i]&&b[i].split?b[i].split(","):[b[i]];l=0;for(m=j.length;l<m;l++)(g=c("string"===typeof j[l]?h.trim(j[l]):j[l]))&&g.length&&(f=f.concat(g))}a=v.selector[a];if(a.length){i=0;for(n=a.length;i<n;i++)f=a[i](d,e,f)}return pa(f)},ab=function(a){a||(a={});a.filter&&a.search===k&&(a.search=a.filter);return h.extend({search:"none",order:"current",
page:"all"},a)},bb=function(a){for(var b=0,c=a.length;b<c;b++)if(0<a[b].length)return a[0]=a[b],a[0].length=1,a.length=1,a.context=[a.context[b]],a;a.length=0;return a},Ba=function(a,b){var c,d,e,f=[],g=a.aiDisplay;c=a.aiDisplayMaster;var j=b.search;d=b.order;e=b.page;if("ssp"==y(a))return"removed"===j?[]:W(0,c.length);if("current"==e){c=a._iDisplayStart;for(d=a.fnDisplayEnd();c<d;c++)f.push(g[c])}else if("current"==d||"applied"==d)f="none"==j?c.slice():"applied"==j?g.slice():h.map(c,function(a){return-1===h.inArray(a,g)?a:null});else if("index"==d||"original"==d){c=0;for(d=a.aoData.length;c<d;c++)"none"==j?f.push(c):(e=h.inArray(c,g),(-1===e&&"removed"==j||0<=e&&"applied"==j)&&f.push(c))}return f};p("rows()",function(a,b){a===k?a="":h.isPlainObject(a)&&(b=a,a="");var b=ab(b),c=this.iterator("table",function(c){var e=b;return $a("row",a,function(a){var b=Pb(a);if(b!==null&&!e)return[b];var j=Ba(c,e);if(b!==null&&h.inArray(b,j)!==-1)return[b];if(!a)return j;if(typeof a==="function")return h.map(j,function(b){var e=
c.aoData[b];return a(b,e._aData,e.nTr)?b:null});b=Sb(ha(c.aoData,j,"nTr"));if(a.nodeName){if(a._DT_RowIndex!==k)return[a._DT_RowIndex];if(a._DT_CellIndex)return[a._DT_CellIndex.row];b=h(a).closest("*[data-dt-row]");return b.length?[b.data("dt-row")]:[]}if(typeof a==="string"&&a.charAt(0)==="#"){j=c.aIds[a.replace(/^#/,"")];if(j!==k)return[j.idx]}return h(b).filter(a).map(function(){return this._DT_RowIndex}).toArray()},c,e)},1);c.selector.rows=a;c.selector.opts=b;return c});p("rows().nodes()",function(){return this.iterator("row",
function(a,b){return a.aoData[b].nTr||k},1)});p("rows().data()",function(){return this.iterator(!0,"rows",function(a,b){return ha(a.aoData,b,"_aData")},1)});s("rows().cache()","row().cache()",function(a){return this.iterator("row",function(b,c){var d=b.aoData[c];return"search"===a?d._aFilterData:d._aSortData},1)});s("rows().invalidate()","row().invalidate()",function(a){return this.iterator("row",function(b,c){ca(b,c,a)})});s("rows().indexes()","row().index()",function(){return this.iterator("row",
function(a,b){return b},1)});s("rows().ids()","row().id()",function(a){for(var b=[],c=this.context,d=0,e=c.length;d<e;d++)for(var f=0,g=this[d].length;f<g;f++){var h=c[d].rowIdFn(c[d].aoData[this[d][f]]._aData);b.push((!0===a?"#":"")+h)}return new r(c,b)});s("rows().remove()","row().remove()",function(){var a=this;this.iterator("row",function(b,c,d){var e=b.aoData,f=e[c],g,h,i,n,l;e.splice(c,1);g=0;for(h=e.length;g<h;g++)if(i=e[g],l=i.anCells,null!==i.nTr&&(i.nTr._DT_RowIndex=g),null!==l){i=0;for(n=
l.length;i<n;i++)l[i]._DT_CellIndex.row=g}oa(b.aiDisplayMaster,c);oa(b.aiDisplay,c);oa(a[d],c,!1);Sa(b);c=b.rowIdFn(f._aData);c!==k&&delete b.aIds[c]});this.iterator("table",function(a){for(var c=0,d=a.aoData.length;c<d;c++)a.aoData[c].idx=c});return this});p("rows.add()",function(a){var b=this.iterator("table",function(b){var c,f,g,h=[];f=0;for(g=a.length;f<g;f++)c=a[f],c.nodeName&&"TR"===c.nodeName.toUpperCase()?h.push(ma(b,c)[0]):h.push(N(b,c));return h},1),c=this.rows(-1);c.pop();h.merge(c,b);
return c});p("row()",function(a,b){return bb(this.rows(a,b))});p("row().data()",function(a){var b=this.context;if(a===k)return b.length&&this.length?b[0].aoData[this[0]]._aData:k;b[0].aoData[this[0]]._aData=a;ca(b[0],this[0],"data");return this});p("row().node()",function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]].nTr||null:null});p("row.add()",function(a){a instanceof h&&a.length&&(a=a[0]);var b=this.iterator("table",function(b){return a.nodeName&&"TR"===a.nodeName.toUpperCase()?
ma(b,a)[0]:N(b,a)});return this.row(b[0])});var cb=function(a,b){var c=a.context;if(c.length&&(c=c[0].aoData[b!==k?b:a[0]])&&c._details)c._details.remove(),c._detailsShow=k,c._details=k},Vb=function(a,b){var c=a.context;if(c.length&&a.length){var d=c[0].aoData[a[0]];if(d._details){(d._detailsShow=b)?d._details.insertAfter(d.nTr):d._details.detach();var e=c[0],f=new r(e),g=e.aoData;f.off("draw.dt.DT_details column-visibility.dt.DT_details destroy.dt.DT_details");0<G(g,"_details").length&&(f.on("draw.dt.DT_details",
function(a,b){e===b&&f.rows({page:"current"}).eq(0).each(function(a){a=g[a];a._detailsShow&&a._details.insertAfter(a.nTr)})}),f.on("column-visibility.dt.DT_details",function(a,b){if(e===b)for(var c,d=aa(b),f=0,h=g.length;f<h;f++)c=g[f],c._details&&c._details.children("td[colspan]").attr("colspan",d)}),f.on("destroy.dt.DT_details",function(a,b){if(e===b)for(var c=0,d=g.length;c<d;c++)g[c]._details&&cb(f,c)}))}}};p("row().child()",function(a,b){var c=this.context;if(a===k)return c.length&&this.length?
c[0].aoData[this[0]]._details:k;if(!0===a)this.child.show();else if(!1===a)cb(this);else if(c.length&&this.length){var d=c[0],c=c[0].aoData[this[0]],e=[],f=function(a,b){if(h.isArray(a)||a instanceof h)for(var c=0,k=a.length;c<k;c++)f(a[c],b);else a.nodeName&&"tr"===a.nodeName.toLowerCase()?e.push(a):(c=h("<tr><td/></tr>").addClass(b),h("td",c).addClass(b).html(a)[0].colSpan=aa(d),e.push(c[0]))};f(a,b);c._details&&c._details.remove();c._details=h(e);c._detailsShow&&c._details.insertAfter(c.nTr)}return this});
p(["row().child.show()","row().child().show()"],function(){Vb(this,!0);return this});p(["row().child.hide()","row().child().hide()"],function(){Vb(this,!1);return this});p(["row().child.remove()","row().child().remove()"],function(){cb(this);return this});p("row().child.isShown()",function(){var a=this.context;return a.length&&this.length?a[0].aoData[this[0]]._detailsShow||!1:!1});var ec=/^(.+):(name|visIdx|visible)$/,Wb=function(a,b,c,d,e){for(var c=[],d=0,f=e.length;d<f;d++)c.push(B(a,e[d],b));
return c};p("columns()",function(a,b){a===k?a="":h.isPlainObject(a)&&(b=a,a="");var b=ab(b),c=this.iterator("table",function(c){var e=a,f=b,g=c.aoColumns,j=G(g,"sName"),i=G(g,"nTh");return $a("column",e,function(a){var b=Pb(a);if(a==="")return W(g.length);if(b!==null)return[b>=0?b:g.length+b];if(typeof a==="function"){var e=Ba(c,f);return h.map(g,function(b,f){return a(f,Wb(c,f,0,0,e),i[f])?f:null})}var k=typeof a==="string"?a.match(ec):"";if(k)switch(k[2]){case "visIdx":case "visible":b=parseInt(k[1],
10);if(b<0){var m=h.map(g,function(a,b){return a.bVisible?b:null});return[m[m.length+b]]}return[Z(c,b)];case "name":return h.map(j,function(a,b){return a===k[1]?b:null});default:return[]}if(a.nodeName&&a._DT_CellIndex)return[a._DT_CellIndex.column];b=h(i).filter(a).map(function(){return h.inArray(this,i)}).toArray();if(b.length||!a.nodeName)return b;b=h(a).closest("*[data-dt-column]");return b.length?[b.data("dt-column")]:[]},c,f)},1);c.selector.cols=a;c.selector.opts=b;return c});s("columns().header()",
"column().header()",function(){return this.iterator("column",function(a,b){return a.aoColumns[b].nTh},1)});s("columns().footer()","column().footer()",function(){return this.iterator("column",function(a,b){return a.aoColumns[b].nTf},1)});s("columns().data()","column().data()",function(){return this.iterator("column-rows",Wb,1)});s("columns().dataSrc()","column().dataSrc()",function(){return this.iterator("column",function(a,b){return a.aoColumns[b].mData},1)});s("columns().cache()","column().cache()",
function(a){return this.iterator("column-rows",function(b,c,d,e,f){return ha(b.aoData,f,"search"===a?"_aFilterData":"_aSortData",c)},1)});s("columns().nodes()","column().nodes()",function(){return this.iterator("column-rows",function(a,b,c,d,e){return ha(a.aoData,e,"anCells",b)},1)});s("columns().visible()","column().visible()",function(a,b){var c=this.iterator("column",function(b,c){if(a===k)return b.aoColumns[c].bVisible;var f=b.aoColumns,g=f[c],j=b.aoData,i,n,l;if(a!==k&&g.bVisible!==a){if(a){var m=
h.inArray(!0,G(f,"bVisible"),c+1);i=0;for(n=j.length;i<n;i++)l=j[i].nTr,f=j[i].anCells,l&&l.insertBefore(f[c],f[m]||null)}else h(G(b.aoData,"anCells",c)).detach();g.bVisible=a;ea(b,b.aoHeader);ea(b,b.aoFooter);wa(b)}});a!==k&&(this.iterator("column",function(c,e){u(c,null,"column-visibility",[c,e,a,b])}),(b===k||b)&&this.columns.adjust());return c});s("columns().indexes()","column().index()",function(a){return this.iterator("column",function(b,c){return"visible"===a?$(b,c):c},1)});p("columns.adjust()",
function(){return this.iterator("table",function(a){Y(a)},1)});p("column.index()",function(a,b){if(0!==this.context.length){var c=this.context[0];if("fromVisible"===a||"toData"===a)return Z(c,b);if("fromData"===a||"toVisible"===a)return $(c,b)}});p("column()",function(a,b){return bb(this.columns(a,b))});p("cells()",function(a,b,c){h.isPlainObject(a)&&(a.row===k?(c=a,a=null):(c=b,b=null));h.isPlainObject(b)&&(c=b,b=null);if(null===b||b===k)return this.iterator("table",function(b){var d=a,e=ab(c),f=
b.aoData,g=Ba(b,e),j=Sb(ha(f,g,"anCells")),i=h([].concat.apply([],j)),l,n=b.aoColumns.length,m,p,r,u,v,s;return $a("cell",d,function(a){var c=typeof a==="function";if(a===null||a===k||c){m=[];p=0;for(r=g.length;p<r;p++){l=g[p];for(u=0;u<n;u++){v={row:l,column:u};if(c){s=f[l];a(v,B(b,l,u),s.anCells?s.anCells[u]:null)&&m.push(v)}else m.push(v)}}return m}if(h.isPlainObject(a))return[a];c=i.filter(a).map(function(a,b){return{row:b._DT_CellIndex.row,column:b._DT_CellIndex.column}}).toArray();if(c.length||
!a.nodeName)return c;s=h(a).closest("*[data-dt-row]");return s.length?[{row:s.data("dt-row"),column:s.data("dt-column")}]:[]},b,e)});var d=this.columns(b,c),e=this.rows(a,c),f,g,j,i,n,l=this.iterator("table",function(a,b){f=[];g=0;for(j=e[b].length;g<j;g++){i=0;for(n=d[b].length;i<n;i++)f.push({row:e[b][g],column:d[b][i]})}return f},1);h.extend(l.selector,{cols:b,rows:a,opts:c});return l});s("cells().nodes()","cell().node()",function(){return this.iterator("cell",function(a,b,c){return(a=a.aoData[b])&&
a.anCells?a.anCells[c]:k},1)});p("cells().data()",function(){return this.iterator("cell",function(a,b,c){return B(a,b,c)},1)});s("cells().cache()","cell().cache()",function(a){a="search"===a?"_aFilterData":"_aSortData";return this.iterator("cell",function(b,c,d){return b.aoData[c][a][d]},1)});s("cells().render()","cell().render()",function(a){return this.iterator("cell",function(b,c,d){return B(b,c,d,a)},1)});s("cells().indexes()","cell().index()",function(){return this.iterator("cell",function(a,
b,c){return{row:b,column:c,columnVisible:$(a,c)}},1)});s("cells().invalidate()","cell().invalidate()",function(a){return this.iterator("cell",function(b,c,d){ca(b,c,a,d)})});p("cell()",function(a,b,c){return bb(this.cells(a,b,c))});p("cell().data()",function(a){var b=this.context,c=this[0];if(a===k)return b.length&&c.length?B(b[0],c[0].row,c[0].column):k;jb(b[0],c[0].row,c[0].column,a);ca(b[0],c[0].row,"data",c[0].column);return this});p("order()",function(a,b){var c=this.context;if(a===k)return 0!==c.length?c[0].aaSorting:k;"number"===typeof a?a=[[a,b]]:a.length&&!h.isArray(a[0])&&(a=Array.prototype.slice.call(arguments));return this.iterator("table",function(b){b.aaSorting=a.slice()})});p("order.listener()",function(a,b,c){return this.iterator("table",function(d){Ma(d,a,b,c)})});p("order.fixed()",function(a){if(!a){var b=this.context,b=b.length?b[0].aaSortingFixed:k;return h.isArray(b)?{pre:b}:b}return this.iterator("table",function(b){b.aaSortingFixed=h.extend(!0,{},a)})});p(["columns().order()",
"column().order()"],function(a){var b=this;return this.iterator("table",function(c,d){var e=[];h.each(b[d],function(b,c){e.push([c,a])});c.aaSorting=e})});p("search()",function(a,b,c,d){var e=this.context;return a===k?0!==e.length?e[0].oPreviousSearch.sSearch:k:this.iterator("table",function(e){e.oFeatures.bFilter&&fa(e,h.extend({},e.oPreviousSearch,{sSearch:a+"",bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===d?!0:d}),1)})});s("columns().search()","column().search()",function(a,
b,c,d){return this.iterator("column",function(e,f){var g=e.aoPreSearchCols;if(a===k)return g[f].sSearch;e.oFeatures.bFilter&&(h.extend(g[f],{sSearch:a+"",bRegex:null===b?!1:b,bSmart:null===c?!0:c,bCaseInsensitive:null===d?!0:d}),fa(e,e.oPreviousSearch,1))})});p("state()",function(){return this.context.length?this.context[0].oSavedState:null});p("state.clear()",function(){return this.iterator("table",function(a){a.fnStateSaveCallback.call(a.oInstance,a,{})})});p("state.loaded()",function(){return this.context.length?
this.context[0].oLoadedState:null});p("state.save()",function(){return this.iterator("table",function(a){wa(a)})});m.versionCheck=m.fnVersionCheck=function(a){for(var b=m.version.split("."),a=a.split("."),c,d,e=0,f=a.length;e<f;e++)if(c=parseInt(b[e],10)||0,d=parseInt(a[e],10)||0,c!==d)return c>d;return!0};m.isDataTable=m.fnIsDataTable=function(a){var b=h(a).get(0),c=!1;h.each(m.settings,function(a,e){var f=e.nScrollHead?h("table",e.nScrollHead)[0]:null,g=e.nScrollFoot?h("table",e.nScrollFoot)[0]:
null;if(e.nTable===b||f===b||g===b)c=!0});return c};m.tables=m.fnTables=function(a){var b=!1;h.isPlainObject(a)&&(b=a.api,a=a.visible);var c=h.map(m.settings,function(b){if(!a||a&&h(b.nTable).is(":visible"))return b.nTable});return b?new r(c):c};m.camelToHungarian=K;p("$()",function(a,b){var c=this.rows(b).nodes(),c=h(c);return h([].concat(c.filter(a).toArray(),c.find(a).toArray()))});h.each(["on","one","off"],function(a,b){p(b+"()",function(){var a=Array.prototype.slice.call(arguments);a[0].match(/\.dt\b/)||
(a[0]+=".dt");var d=h(this.tables().nodes());d[b].apply(d,a);return this})});p("clear()",function(){return this.iterator("table",function(a){na(a)})});p("settings()",function(){return new r(this.context,this.context)});p("init()",function(){var a=this.context;return a.length?a[0].oInit:null});p("data()",function(){return this.iterator("table",function(a){return G(a.aoData,"_aData")}).flatten()});p("destroy()",function(a){a=a||!1;return this.iterator("table",function(b){var c=b.nTableWrapper.parentNode,
d=b.oClasses,e=b.nTable,f=b.nTBody,g=b.nTHead,j=b.nTFoot,i=h(e),f=h(f),k=h(b.nTableWrapper),l=h.map(b.aoData,function(a){return a.nTr}),p;b.bDestroying=!0;u(b,"aoDestroyCallback","destroy",[b]);a||(new r(b)).columns().visible(!0);k.unbind(".DT").find(":not(tbody *)").unbind(".DT");h(D).unbind(".DT-"+b.sInstance);e!=g.parentNode&&(i.children("thead").detach(),i.append(g));j&&e!=j.parentNode&&(i.children("tfoot").detach(),i.append(j));b.aaSorting=[];b.aaSortingFixed=[];va(b);h(l).removeClass(b.asStripeClasses.join(" "));
h("th, td",g).removeClass(d.sSortable+" "+d.sSortableAsc+" "+d.sSortableDesc+" "+d.sSortableNone);b.bJUI&&(h("th span."+d.sSortIcon+", td span."+d.sSortIcon,g).detach(),h("th, td",g).each(function(){var a=h("div."+d.sSortJUIWrapper,this);h(this).append(a.contents());a.detach()}));f.children().detach();f.append(l);g=a?"remove":"detach";i[g]();k[g]();!a&&c&&(c.insertBefore(e,b.nTableReinsertBefore),i.css("width",b.sDestroyWidth).removeClass(d.sTable),(p=b.asDestroyStripes.length)&&f.children().each(function(a){h(this).addClass(b.asDestroyStripes[a%
p])}));c=h.inArray(b,m.settings);-1!==c&&m.settings.splice(c,1)})});h.each(["column","row","cell"],function(a,b){p(b+"s().every()",function(a){var d=this.selector.opts,e=this;return this.iterator(b,function(f,g,h,i,n){a.call(e[b](g,"cell"===b?h:d,"cell"===b?d:k),g,h,i,n)})})});p("i18n()",function(a,b,c){var d=this.context[0],a=Q(a)(d.oLanguage);a===k&&(a=b);c!==k&&h.isPlainObject(a)&&(a=a[c]!==k?a[c]:a._);return a.replace("%d",c)});m.version="1.10.12";m.settings=[];m.models={};m.models.oSearch={bCaseInsensitive:!0,
sSearch:"",bRegex:!1,bSmart:!0};m.models.oRow={nTr:null,anCells:null,_aData:[],_aSortData:null,_aFilterData:null,_sFilterRow:null,_sRowStripe:"",src:null,idx:-1};m.models.oColumn={idx:null,aDataSort:null,asSorting:null,bSearchable:null,bSortable:null,bVisible:null,_sManualType:null,_bAttrSrc:!1,fnCreatedCell:null,fnGetData:null,fnSetData:null,mData:null,mRender:null,nTh:null,nTf:null,sClass:null,sContentPadding:null,sDefaultContent:null,sName:null,sSortDataType:"std",sSortingClass:null,sSortingClassJUI:null,
sTitle:null,sType:null,sWidth:null,sWidthOrig:null};m.defaults={aaData:null,aaSorting:[[0,"asc"]],aaSortingFixed:[],ajax:null,aLengthMenu:[10,25,50,100],aoColumns:null,aoColumnDefs:null,aoSearchCols:[],asStripeClasses:null,bAutoWidth:!0,bDeferRender:!1,bDestroy:!1,bFilter:!0,bInfo:!0,bJQueryUI:!1,bLengthChange:!0,bPaginate:!0,bProcessing:!1,bRetrieve:!1,bScrollCollapse:!1,bServerSide:!1,bSort:!0,bSortMulti:!0,bSortCellsTop:!1,bSortClasses:!0,bStateSave:!1,fnCreatedRow:null,fnDrawCallback:null,fnFooterCallback:null,
fnFormatNumber:function(a){return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,this.oLanguage.sThousands)},fnHeaderCallback:null,fnInfoCallback:null,fnInitComplete:null,fnPreDrawCallback:null,fnRowCallback:null,fnServerData:null,fnServerParams:null,fnStateLoadCallback:function(a){try{return JSON.parse((-1===a.iStateDuration?sessionStorage:localStorage).getItem("DataTables_"+a.sInstance+"_"+location.pathname))}catch(b){}},fnStateLoadParams:null,fnStateLoaded:null,fnStateSaveCallback:function(a,b){try{(-1===a.iStateDuration?sessionStorage:localStorage).setItem("DataTables_"+a.sInstance+"_"+location.pathname,JSON.stringify(b))}catch(c){}},fnStateSaveParams:null,iStateDuration:7200,iDeferLoading:null,iDisplayLength:10,iDisplayStart:0,iTabIndex:0,oClasses:{},oLanguage:{oAria:{sSortAscending:": activate to sort column ascending",sSortDescending:": activate to sort column descending"},oPaginate:{sFirst:"First",sLast:"Last",sNext:"Next",sPrevious:"Previous"},sEmptyTable:"No data available in table",sInfo:"Showing _START_ to _END_ of _TOTAL_ entries",
sInfoEmpty:"Showing 0 to 0 of 0 entries",sInfoFiltered:"(filtered from _MAX_ total entries)",sInfoPostFix:"",sDecimal:"",sThousands:",",sLengthMenu:"Show _MENU_ entries",sLoadingRecords:"Loading...",sProcessing:"Processing...",sSearch:"Search:",sSearchPlaceholder:"",sUrl:"",sZeroRecords:"No matching records found"},oSearch:h.extend({},m.models.oSearch),sAjaxDataProp:"data",sAjaxSource:null,sDom:"lfrtip",searchDelay:null,sPaginationType:"simple_numbers",sScrollX:"",sScrollXInner:"",sScrollY:"",sServerMethod:"GET",
renderer:null,rowId:"DT_RowId"};X(m.defaults);m.defaults.column={aDataSort:null,iDataSort:-1,asSorting:["asc","desc"],bSearchable:!0,bSortable:!0,bVisible:!0,fnCreatedCell:null,mData:null,mRender:null,sCellType:"td",sClass:"",sContentPadding:"",sDefaultContent:null,sName:"",sSortDataType:"std",sTitle:null,sType:null,sWidth:null};X(m.defaults.column);m.models.oSettings={oFeatures:{bAutoWidth:null,bDeferRender:null,bFilter:null,bInfo:null,bLengthChange:null,bPaginate:null,bProcessing:null,bServerSide:null,
bSort:null,bSortMulti:null,bSortClasses:null,bStateSave:null},oScroll:{bCollapse:null,iBarWidth:0,sX:null,sXInner:null,sY:null},oLanguage:{fnInfoCallback:null},oBrowser:{bScrollOversize:!1,bScrollbarLeft:!1,bBounding:!1,barWidth:0},ajax:null,aanFeatures:[],aoData:[],aiDisplay:[],aiDisplayMaster:[],aIds:{},aoColumns:[],aoHeader:[],aoFooter:[],oPreviousSearch:{},aoPreSearchCols:[],aaSorting:null,aaSortingFixed:[],asStripeClasses:null,asDestroyStripes:[],sDestroyWidth:0,aoRowCallback:[],aoHeaderCallback:[],
aoFooterCallback:[],aoDrawCallback:[],aoRowCreatedCallback:[],aoPreDrawCallback:[],aoInitComplete:[],aoStateSaveParams:[],aoStateLoadParams:[],aoStateLoaded:[],sTableId:"",nTable:null,nTHead:null,nTFoot:null,nTBody:null,nTableWrapper:null,bDeferLoading:!1,bInitialised:!1,aoOpenRows:[],sDom:null,searchDelay:null,sPaginationType:"two_button",iStateDuration:0,aoStateSave:[],aoStateLoad:[],oSavedState:null,oLoadedState:null,sAjaxSource:null,sAjaxDataProp:null,bAjaxDataGet:!0,jqXHR:null,json:k,oAjaxData:k,
fnServerData:null,aoServerParams:[],sServerMethod:null,fnFormatNumber:null,aLengthMenu:null,iDraw:0,bDrawing:!1,iDrawError:-1,_iDisplayLength:10,_iDisplayStart:0,_iRecordsTotal:0,_iRecordsDisplay:0,bJUI:null,oClasses:{},bFiltered:!1,bSorted:!1,bSortCellsTop:null,oInit:null,aoDestroyCallback:[],fnRecordsTotal:function(){return"ssp"==y(this)?1*this._iRecordsTotal:this.aiDisplayMaster.length},fnRecordsDisplay:function(){return"ssp"==y(this)?1*this._iRecordsDisplay:this.aiDisplay.length},fnDisplayEnd:function(){var a=
this._iDisplayLength,b=this._iDisplayStart,c=b+a,d=this.aiDisplay.length,e=this.oFeatures,f=e.bPaginate;return e.bServerSide?!1===f||-1===a?b+d:Math.min(b+a,this._iRecordsDisplay):!f||c>d||-1===a?d:c},oInstance:null,sInstance:null,iTabIndex:0,nScrollHead:null,nScrollFoot:null,aLastSort:[],oPlugins:{},rowIdFn:null,rowId:null};m.ext=v={buttons:{},classes:{},builder:"-source-",errMode:"alert",feature:[],search:[],selector:{cell:[],column:[],row:[]},internal:{},legacy:{ajax:null},pager:{},renderer:{pageButton:{},
header:{}},order:{},type:{detect:[],search:{},order:{}},_unique:0,fnVersionCheck:m.fnVersionCheck,iApiIndex:0,oJUIClasses:{},sVersion:m.version};h.extend(v,{afnFiltering:v.search,aTypes:v.type.detect,ofnSearch:v.type.search,oSort:v.type.order,afnSortData:v.order,aoFeatures:v.feature,oApi:v.internal,oStdClasses:v.classes,oPagination:v.pager});h.extend(m.ext.classes,{sTable:"dataTable",sNoFooter:"no-footer",sPageButton:"paginate_button",sPageButtonActive:"current",sPageButtonDisabled:"disabled",sStripeOdd:"odd",
sStripeEven:"even",sRowEmpty:"dataTables_empty",sWrapper:"dataTables_wrapper",sFilter:"dataTables_filter",sInfo:"dataTables_info",sPaging:"dataTables_paginate paging_",sLength:"dataTables_length",sProcessing:"dataTables_processing",sSortAsc:"sorting_asc",sSortDesc:"sorting_desc",sSortable:"sorting",sSortableAsc:"sorting_asc_disabled",sSortableDesc:"sorting_desc_disabled",sSortableNone:"sorting_disabled",sSortColumn:"sorting_",sFilterInput:"",sLengthSelect:"",sScrollWrapper:"dataTables_scroll",sScrollHead:"dataTables_scrollHead",
sScrollHeadInner:"dataTables_scrollHeadInner",sScrollBody:"dataTables_scrollBody",sScrollFoot:"dataTables_scrollFoot",sScrollFootInner:"dataTables_scrollFootInner",sHeaderTH:"",sFooterTH:"",sSortJUIAsc:"",sSortJUIDesc:"",sSortJUI:"",sSortJUIAscAllowed:"",sSortJUIDescAllowed:"",sSortJUIWrapper:"",sSortIcon:"",sJUIHeader:"",sJUIFooter:""});var Ca="",Ca="",H=Ca+"ui-state-default",ia=Ca+"css_right ui-icon ui-icon-",Xb=Ca+"fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix";h.extend(m.ext.oJUIClasses,
m.ext.classes,{sPageButton:"fg-button ui-button "+H,sPageButtonActive:"ui-state-disabled",sPageButtonDisabled:"ui-state-disabled",sPaging:"dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi ui-buttonset-multi paging_",sSortAsc:H+" sorting_asc",sSortDesc:H+" sorting_desc",sSortable:H+" sorting",sSortableAsc:H+" sorting_asc_disabled",sSortableDesc:H+" sorting_desc_disabled",sSortableNone:H+" sorting_disabled",sSortJUIAsc:ia+"triangle-1-n",sSortJUIDesc:ia+"triangle-1-s",sSortJUI:ia+"carat-2-n-s",
sSortJUIAscAllowed:ia+"carat-1-n",sSortJUIDescAllowed:ia+"carat-1-s",sSortJUIWrapper:"DataTables_sort_wrapper",sSortIcon:"DataTables_sort_icon",sScrollHead:"dataTables_scrollHead "+H,sScrollFoot:"dataTables_scrollFoot "+H,sHeaderTH:H,sFooterTH:H,sJUIHeader:Xb+" ui-corner-tl ui-corner-tr",sJUIFooter:Xb+" ui-corner-bl ui-corner-br"});var Mb=m.ext.pager;h.extend(Mb,{simple:function(){return["previous","next"]},full:function(){return["first","previous","next","last"]},numbers:function(a,b){return[ya(a,
b)]},simple_numbers:function(a,b){return["previous",ya(a,b),"next"]},full_numbers:function(a,b){return["first","previous",ya(a,b),"next","last"]},_numbers:ya,numbers_length:7});h.extend(!0,m.ext.renderer,{pageButton:{_:function(a,b,c,d,e,f){var g=a.oClasses,j=a.oLanguage.oPaginate,i=a.oLanguage.oAria.paginate||{},k,l,m=0,p=function(b,d){var o,r,u,s,v=function(b){Ta(a,b.data.action,true)};o=0;for(r=d.length;o<r;o++){s=d[o];if(h.isArray(s)){u=h("<"+(s.DT_el||"div")+"/>").appendTo(b);p(u,s)}else{k=null;
l="";switch(s){case "ellipsis":b.append('<span class="ellipsis">&#x2026;</span>');break;case "first":k=j.sFirst;l=s+(e>0?"":" "+g.sPageButtonDisabled);break;case "previous":k=j.sPrevious;l=s+(e>0?"":" "+g.sPageButtonDisabled);break;case "next":k=j.sNext;l=s+(e<f-1?"":" "+g.sPageButtonDisabled);break;case "last":k=j.sLast;l=s+(e<f-1?"":" "+g.sPageButtonDisabled);break;default:k=s+1;l=e===s?g.sPageButtonActive:""}if(k!==null){u=h("<a>",{"class":g.sPageButton+" "+l,"aria-controls":a.sTableId,"aria-label":i[s],
"data-dt-idx":m,tabindex:a.iTabIndex,id:c===0&&typeof s==="string"?a.sTableId+"_"+s:null}).html(k).appendTo(b);Wa(u,{action:s},v);m++}}}},r;try{r=h(b).find(I.activeElement).data("dt-idx")}catch(o){}p(h(b).empty(),d);r&&h(b).find("[data-dt-idx="+r+"]").focus()}}});h.extend(m.ext.type.detect,[function(a,b){var c=b.oLanguage.sDecimal;return Za(a,c)?"num"+c:null},function(a){if(a&&!(a instanceof Date)&&(!ac.test(a)||!bc.test(a)))return null;var b=Date.parse(a);return null!==b&&!isNaN(b)||M(a)?"date":
null},function(a,b){var c=b.oLanguage.sDecimal;return Za(a,c,!0)?"num-fmt"+c:null},function(a,b){var c=b.oLanguage.sDecimal;return Rb(a,c)?"html-num"+c:null},function(a,b){var c=b.oLanguage.sDecimal;return Rb(a,c,!0)?"html-num-fmt"+c:null},function(a){return M(a)||"string"===typeof a&&-1!==a.indexOf("<")?"html":null}]);h.extend(m.ext.type.search,{html:function(a){return M(a)?a:"string"===typeof a?a.replace(Ob," ").replace(Aa,""):""},string:function(a){return M(a)?a:"string"===typeof a?a.replace(Ob,
" "):a}});var za=function(a,b,c,d){if(0!==a&&(!a||"-"===a))return-Infinity;b&&(a=Qb(a,b));a.replace&&(c&&(a=a.replace(c,"")),d&&(a=a.replace(d,"")));return 1*a};h.extend(v.type.order,{"date-pre":function(a){return Date.parse(a)||0},"html-pre":function(a){return M(a)?"":a.replace?a.replace(/<.*?>/g,"").toLowerCase():a+""},"string-pre":function(a){return M(a)?"":"string"===typeof a?a.toLowerCase():!a.toString?"":a.toString()},"string-asc":function(a,b){return a<b?-1:a>b?1:0},"string-desc":function(a,
b){return a<b?1:a>b?-1:0}});db("");h.extend(!0,m.ext.renderer,{header:{_:function(a,b,c,d){h(a.nTable).on("order.dt.DT",function(e,f,g,h){if(a===f){e=c.idx;b.removeClass(c.sSortingClass+" "+d.sSortAsc+" "+d.sSortDesc).addClass(h[e]=="asc"?d.sSortAsc:h[e]=="desc"?d.sSortDesc:c.sSortingClass)}})},jqueryui:function(a,b,c,d){h("<div/>").addClass(d.sSortJUIWrapper).append(b.contents()).append(h("<span/>").addClass(d.sSortIcon+" "+c.sSortingClassJUI)).appendTo(b);h(a.nTable).on("order.dt.DT",function(e,
f,g,h){if(a===f){e=c.idx;b.removeClass(d.sSortAsc+" "+d.sSortDesc).addClass(h[e]=="asc"?d.sSortAsc:h[e]=="desc"?d.sSortDesc:c.sSortingClass);b.find("span."+d.sSortIcon).removeClass(d.sSortJUIAsc+" "+d.sSortJUIDesc+" "+d.sSortJUI+" "+d.sSortJUIAscAllowed+" "+d.sSortJUIDescAllowed).addClass(h[e]=="asc"?d.sSortJUIAsc:h[e]=="desc"?d.sSortJUIDesc:c.sSortingClassJUI)}})}}});var Yb=function(a){return"string"===typeof a?a.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):a};m.render={number:function(a,
b,c,d,e){return{display:function(f){if("number"!==typeof f&&"string"!==typeof f)return f;var g=0>f?"-":"",h=parseFloat(f);if(isNaN(h))return Yb(f);f=Math.abs(h);h=parseInt(f,10);f=c?b+(f-h).toFixed(c).substring(2):"";return g+(d||"")+h.toString().replace(/\B(?=(\d{3})+(?!\d))/g,a)+f+(e||"")}}},text:function(){return{display:Yb}}};h.extend(m.ext.internal,{_fnExternApiFunc:Nb,_fnBuildAjax:ra,_fnAjaxUpdate:lb,_fnAjaxParameters:ub,_fnAjaxUpdateDraw:vb,_fnAjaxDataSrc:sa,_fnAddColumn:Ea,_fnColumnOptions:ja,
_fnAdjustColumnSizing:Y,_fnVisibleToColumnIndex:Z,_fnColumnIndexToVisible:$,_fnVisbleColumns:aa,_fnGetColumns:la,_fnColumnTypes:Ga,_fnApplyColumnDefs:ib,_fnHungarianMap:X,_fnCamelToHungarian:K,_fnLanguageCompat:Da,_fnBrowserDetect:gb,_fnAddData:N,_fnAddTr:ma,_fnNodeToDataIndex:function(a,b){return b._DT_RowIndex!==k?b._DT_RowIndex:null},_fnNodeToColumnIndex:function(a,b,c){return h.inArray(c,a.aoData[b].anCells)},_fnGetCellData:B,_fnSetCellData:jb,_fnSplitObjNotation:Ja,_fnGetObjectDataFn:Q,_fnSetObjectDataFn:R,
_fnGetDataMaster:Ka,_fnClearTable:na,_fnDeleteIndex:oa,_fnInvalidate:ca,_fnGetRowElements:Ia,_fnCreateTr:Ha,_fnBuildHead:kb,_fnDrawHead:ea,_fnDraw:O,_fnReDraw:T,_fnAddOptionsHtml:nb,_fnDetectHeader:da,_fnGetUniqueThs:qa,_fnFeatureHtmlFilter:pb,_fnFilterComplete:fa,_fnFilterCustom:yb,_fnFilterColumn:xb,_fnFilter:wb,_fnFilterCreateSearch:Pa,_fnEscapeRegex:Qa,_fnFilterData:zb,_fnFeatureHtmlInfo:sb,_fnUpdateInfo:Cb,_fnInfoMacros:Db,_fnInitialise:ga,_fnInitComplete:ta,_fnLengthChange:Ra,_fnFeatureHtmlLength:ob,
_fnFeatureHtmlPaginate:tb,_fnPageChange:Ta,_fnFeatureHtmlProcessing:qb,_fnProcessingDisplay:C,_fnFeatureHtmlTable:rb,_fnScrollDraw:ka,_fnApplyToChildren:J,_fnCalculateColumnWidths:Fa,_fnThrottle:Oa,_fnConvertToWidth:Fb,_fnGetWidestNode:Gb,_fnGetMaxLenString:Hb,_fnStringToCss:x,_fnSortFlatten:V,_fnSort:mb,_fnSortAria:Jb,_fnSortListener:Va,_fnSortAttachListener:Ma,_fnSortingClasses:va,_fnSortData:Ib,_fnSaveState:wa,_fnLoadState:Kb,_fnSettingsFromNode:xa,_fnLog:L,_fnMap:E,_fnBindAction:Wa,_fnCallbackReg:z,
_fnCallbackFire:u,_fnLengthOverflow:Sa,_fnRenderer:Na,_fnDataSource:y,_fnRowAttributes:La,_fnCalculateEnd:function(){}});h.fn.dataTable=m;m.$=h;h.fn.dataTableSettings=m.settings;h.fn.dataTableExt=m.ext;h.fn.DataTable=function(a){return h(this).dataTable(a).api()};h.each(m,function(a,b){h.fn.DataTable[a]=b});return h.fn.dataTable});
;(function (factory){
var registeredInModuleLoader=false;
if(typeof define==='function'&&define.amd){
define(factory);
registeredInModuleLoader=true;
}
if(typeof exports==='object'){
module.exports=factory();
registeredInModuleLoader=true;
}
if(!registeredInModuleLoader){
var OldCookies=window.Cookies;
var api=window.Cookies=factory();
api.noConflict=function (){
window.Cookies=OldCookies;
return api;
};}}(function (){
function extend (){
var i=0;
var result={};
for (; i < arguments.length; i++){
var attributes=arguments[ i ];
for (var key in attributes){
result[key]=attributes[key];
}}
return result;
}
function init (converter){
function api (key, value, attributes){
var result;
if(typeof document==='undefined'){
return;
}
if(arguments.length > 1){
attributes=extend({
path: '/'
}, api.defaults, attributes);
if(typeof attributes.expires==='number'){
var expires=new Date();
expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
attributes.expires=expires;
}
attributes.expires=attributes.expires ? attributes.expires.toUTCString():'';
try {
result=JSON.stringify(value);
if(/^[\{\[]/.test(result)){
value=result;
}} catch (e){}
if(!converter.write){
value=encodeURIComponent(String(value))
.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
}else{
value=converter.write(value, key);
}
key=encodeURIComponent(String(key));
key=key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
key=key.replace(/[\(\)]/g, escape);
var stringifiedAttributes='';
for (var attributeName in attributes){
if(!attributes[attributeName]){
continue;
}
stringifiedAttributes +='; ' + attributeName;
if(attributes[attributeName]===true){
continue;
}
stringifiedAttributes +='=' + attributes[attributeName];
}
return (document.cookie=key + '=' + value + stringifiedAttributes);
}
if(!key){
result={};}
var cookies=document.cookie ? document.cookie.split('; '):[];
var rdecode=/(%[0-9A-Z]{2})+/g;
var i=0;
for (; i < cookies.length; i++){
var parts=cookies[i].split('=');
var cookie=parts.slice(1).join('=');
if(cookie.charAt(0)==='"'){
cookie=cookie.slice(1, -1);
}
try {
var name=parts[0].replace(rdecode, decodeURIComponent);
cookie=converter.read ?
converter.read(cookie, name):converter(cookie, name) ||
cookie.replace(rdecode, decodeURIComponent);
if(this.json){
try {
cookie=JSON.parse(cookie);
} catch (e){}}
if(key===name){
result=cookie;
break;
}
if(!key){
result[name]=cookie;
}} catch (e){}}
return result;
}
api.set=api;
api.get=function (key){
return api.call(api, key);
};
api.getJSON=function (){
return api.apply({
json: true
}, [].slice.call(arguments));
};
api.defaults={};
api.remove=function (key, attributes){
api(key, '', extend(attributes, {
expires: -1
}));
};
api.withConverter=init;
return api;
}
return init(function (){});
}));
!(function(root, factory){
if(typeof define==='function'&&define.amd){
define(['jquery'], function($){
return factory(root, $);
});
}else if(typeof exports==='object'){
factory(root, require('jquery'));
}else{
factory(root, root.jQuery||root.Zepto);
}})(this, function(global, $){
'use strict';
var PLUGIN_NAME='remodal';
var NAMESPACE=global.REMODAL_GLOBALS&&global.REMODAL_GLOBALS.NAMESPACE||PLUGIN_NAME;
var ANIMATIONSTART_EVENTS=$.map(['animationstart', 'webkitAnimationStart', 'MSAnimationStart', 'oAnimationStart'],
function(eventName){
return eventName + '.' + NAMESPACE;
}
).join(' ');
var ANIMATIONEND_EVENTS=$.map(['animationend', 'webkitAnimationEnd', 'MSAnimationEnd', 'oAnimationEnd'],
function(eventName){
return eventName + '.' + NAMESPACE;
}
).join(' ');
var DEFAULTS=$.extend({
hashTracking: true,
closeOnConfirm: true,
closeOnCancel: true,
closeOnEscape: true,
closeOnOutsideClick: true,
modifier: '',
appendTo: null
}, global.REMODAL_GLOBALS&&global.REMODAL_GLOBALS.DEFAULTS);
var STATES={
CLOSING: 'closing',
CLOSED: 'closed',
OPENING: 'opening',
OPENED: 'opened'
};
var STATE_CHANGE_REASONS={
CONFIRMATION: 'confirmation',
CANCELLATION: 'cancellation'
};
var IS_ANIMATION=(function(){
var style=document.createElement('div').style;
return style.animationName!==undefined ||
style.WebkitAnimationName!==undefined ||
style.MozAnimationName!==undefined ||
style.msAnimationName!==undefined ||
style.OAnimationName!==undefined;
})();
var IS_IOS=/iPad|iPhone|iPod/.test(navigator.platform);
var current;
var scrollTop;
function getAnimationDuration($elem){
if(IS_ANIMATION &&
$elem.css('animation-name')==='none' &&
$elem.css('-webkit-animation-name')==='none' &&
$elem.css('-moz-animation-name')==='none' &&
$elem.css('-o-animation-name')==='none' &&
$elem.css('-ms-animation-name')==='none'
){
return 0;
}
var duration=$elem.css('animation-duration') ||
$elem.css('-webkit-animation-duration') ||
$elem.css('-moz-animation-duration') ||
$elem.css('-o-animation-duration') ||
$elem.css('-ms-animation-duration') ||
'0s';
var delay=$elem.css('animation-delay') ||
$elem.css('-webkit-animation-delay') ||
$elem.css('-moz-animation-delay') ||
$elem.css('-o-animation-delay') ||
$elem.css('-ms-animation-delay') ||
'0s';
var iterationCount=$elem.css('animation-iteration-count') ||
$elem.css('-webkit-animation-iteration-count') ||
$elem.css('-moz-animation-iteration-count') ||
$elem.css('-o-animation-iteration-count') ||
$elem.css('-ms-animation-iteration-count') ||
'1';
var max;
var len;
var num;
var i;
duration=duration.split(', ');
delay=delay.split(', ');
iterationCount=iterationCount.split(', ');
for (i=0, len=duration.length, max=Number.NEGATIVE_INFINITY; i < len; i++){
num=parseFloat(duration[i]) * parseInt(iterationCount[i], 10) + parseFloat(delay[i]);
if(num > max){
max=num;
}}
return max;
}
function getScrollbarWidth(){
if($(document).height() <=$(window).height()){
return 0;
}
var outer=document.createElement('div');
var inner=document.createElement('div');
var widthNoScroll;
var widthWithScroll;
outer.style.visibility='hidden';
outer.style.width='100px';
document.body.appendChild(outer);
widthNoScroll=outer.offsetWidth;
outer.style.overflow='scroll';
inner.style.width='100%';
outer.appendChild(inner);
widthWithScroll=inner.offsetWidth;
outer.parentNode.removeChild(outer);
return widthNoScroll - widthWithScroll;
}
function lockScreen(){
if(IS_IOS){
return;
}
var $html=$('html');
var lockedClass=namespacify('is-locked');
var paddingRight;
var $body;
if(!$html.hasClass(lockedClass)){
$body=$(document.body);
paddingRight=parseInt($body.css('padding-right'), 10) + getScrollbarWidth();
$body.css('padding-right', paddingRight + 'px');
$html.addClass(lockedClass);
}}
function unlockScreen(){
if(IS_IOS){
return;
}
var $html=$('html');
var lockedClass=namespacify('is-locked');
var paddingRight;
var $body;
if($html.hasClass(lockedClass)){
$body=$(document.body);
paddingRight=parseInt($body.css('padding-right'), 10) - getScrollbarWidth();
$body.css('padding-right', paddingRight + 'px');
$html.removeClass(lockedClass);
}}
function setState(instance, state, isSilent, reason){
var newState=namespacify('is', state);
var allStates=[namespacify('is', STATES.CLOSING),
namespacify('is', STATES.OPENING),
namespacify('is', STATES.CLOSED),
namespacify('is', STATES.OPENED)].join(' ');
instance.$bg
.removeClass(allStates)
.addClass(newState);
instance.$overlay
.removeClass(allStates)
.addClass(newState);
instance.$wrapper
.removeClass(allStates)
.addClass(newState);
instance.$modal
.removeClass(allStates)
.addClass(newState);
instance.state=state;
!isSilent&&instance.$modal.trigger({
type: state,
reason: reason
}, [{ reason: reason }]);
}
function syncWithAnimation(doBeforeAnimation, doAfterAnimation, instance){
var runningAnimationsCount=0;
var handleAnimationStart=function(e){
if(e.target!==this){
return;
}
runningAnimationsCount++;
};
var handleAnimationEnd=function(e){
if(e.target!==this){
return;
}
if(--runningAnimationsCount===0){
$.each(['$bg', '$overlay', '$wrapper', '$modal'], function(index, elemName){
instance[elemName].off(ANIMATIONSTART_EVENTS + ' ' + ANIMATIONEND_EVENTS);
});
doAfterAnimation();
}};
$.each(['$bg', '$overlay', '$wrapper', '$modal'], function(index, elemName){
instance[elemName]
.on(ANIMATIONSTART_EVENTS, handleAnimationStart)
.on(ANIMATIONEND_EVENTS, handleAnimationEnd);
});
doBeforeAnimation();
if(getAnimationDuration(instance.$bg)===0 &&
getAnimationDuration(instance.$overlay)===0 &&
getAnimationDuration(instance.$wrapper)===0 &&
getAnimationDuration(instance.$modal)===0
){
$.each(['$bg', '$overlay', '$wrapper', '$modal'], function(index, elemName){
instance[elemName].off(ANIMATIONSTART_EVENTS + ' ' + ANIMATIONEND_EVENTS);
});
doAfterAnimation();
}}
function halt(instance){
if(instance.state===STATES.CLOSED){
return;
}
$.each(['$bg', '$overlay', '$wrapper', '$modal'], function(index, elemName){
instance[elemName].off(ANIMATIONSTART_EVENTS + ' ' + ANIMATIONEND_EVENTS);
});
instance.$bg.removeClass(instance.settings.modifier);
instance.$overlay.removeClass(instance.settings.modifier).hide();
instance.$wrapper.hide();
unlockScreen();
setState(instance, STATES.CLOSED, true);
}
function parseOptions(str){
var obj={};
var arr;
var len;
var val;
var i;
str=str.replace(/\s*:\s*/g, ':').replace(/\s*,\s*/g, ',');
arr=str.split(',');
for (i=0, len=arr.length; i < len; i++){
arr[i]=arr[i].split(':');
val=arr[i][1];
if(typeof val==='string'||val instanceof String){
val=val==='true'||(val==='false' ? false:val);
}
if(typeof val==='string'||val instanceof String){
val = !isNaN(val) ? +val:val;
}
obj[arr[i][0]]=val;
}
return obj;
}
function namespacify(){
var result=NAMESPACE;
for (var i=0; i < arguments.length; ++i){
result +='-' + arguments[i];
}
return result;
}
function handleHashChangeEvent(){
var id=location.hash.replace('#', '');
var instance;
var $elem;
if(!id){
if(current&&current.state===STATES.OPENED&&current.settings.hashTracking){
current.close();
}}else{
try {
$elem=$(
'[data-' + PLUGIN_NAME + '-id="' + id + '"]'
);
} catch (err){}
if($elem&&$elem.length){
instance=$[PLUGIN_NAME].lookup[$elem.data(PLUGIN_NAME)];
if(instance&&instance.settings.hashTracking){
instance.open();
}}
}}
function Remodal($modal, options){
var $body=$(document.body);
var $appendTo=$body;
var remodal=this;
remodal.settings=$.extend({}, DEFAULTS, options);
remodal.index=$[PLUGIN_NAME].lookup.push(remodal) - 1;
remodal.state=STATES.CLOSED;
remodal.$overlay=$('.' + namespacify('overlay'));
if(remodal.settings.appendTo!==null&&remodal.settings.appendTo.length){
$appendTo=$(remodal.settings.appendTo);
}
if(!remodal.$overlay.length){
remodal.$overlay=$('<div>').addClass(namespacify('overlay') + ' ' + namespacify('is', STATES.CLOSED)).hide();
$appendTo.append(remodal.$overlay);
}
remodal.$bg=$('.' + namespacify('bg')).addClass(namespacify('is', STATES.CLOSED));
remodal.$modal=$modal
.addClass(NAMESPACE + ' ' +
namespacify('is-initialized') + ' ' +
remodal.settings.modifier + ' ' +
namespacify('is', STATES.CLOSED))
.attr('tabindex', '-1');
remodal.$wrapper=$('<div>')
.addClass(namespacify('wrapper') + ' ' +
remodal.settings.modifier + ' ' +
namespacify('is', STATES.CLOSED))
.hide()
.append(remodal.$modal);
$appendTo.append(remodal.$wrapper);
remodal.$wrapper.on('click.' + NAMESPACE, '[data-' + PLUGIN_NAME + '-action="close"]', function(e){
e.preventDefault();
remodal.close();
});
remodal.$wrapper.on('click.' + NAMESPACE, '[data-' + PLUGIN_NAME + '-action="cancel"]', function(e){
e.preventDefault();
remodal.$modal.trigger(STATE_CHANGE_REASONS.CANCELLATION);
if(remodal.settings.closeOnCancel){
remodal.close(STATE_CHANGE_REASONS.CANCELLATION);
}});
remodal.$wrapper.on('click.' + NAMESPACE, '[data-' + PLUGIN_NAME + '-action="confirm"]', function(e){
e.preventDefault();
remodal.$modal.trigger(STATE_CHANGE_REASONS.CONFIRMATION);
if(remodal.settings.closeOnConfirm){
remodal.close(STATE_CHANGE_REASONS.CONFIRMATION);
}});
remodal.$wrapper.on('click.' + NAMESPACE, function(e){
var $target=$(e.target);
if(!$target.hasClass(namespacify('wrapper'))){
return;
}
if(remodal.settings.closeOnOutsideClick){
remodal.close();
}});
}
Remodal.prototype.open=function(){
var remodal=this;
var id;
if(remodal.state===STATES.OPENING||remodal.state===STATES.CLOSING){
return;
}
id=remodal.$modal.attr('data-' + PLUGIN_NAME + '-id');
if(id&&remodal.settings.hashTracking){
scrollTop=$(window).scrollTop();
location.hash=id;
}
if(current&&current!==remodal){
halt(current);
}
current=remodal;
lockScreen();
remodal.$bg.addClass(remodal.settings.modifier);
remodal.$overlay.addClass(remodal.settings.modifier).show();
remodal.$wrapper.show().scrollTop(0);
remodal.$modal.focus();
syncWithAnimation(
function(){
setState(remodal, STATES.OPENING);
},
function(){
setState(remodal, STATES.OPENED);
},
remodal);
};
Remodal.prototype.close=function(reason){
var remodal=this;
if(remodal.state===STATES.OPENING||remodal.state===STATES.CLOSING||remodal.state===STATES.CLOSED){
return;
}
if(remodal.settings.hashTracking &&
remodal.$modal.attr('data-' + PLUGIN_NAME + '-id')===location.hash.substr(1)
){
location.hash='';
$(window).scrollTop(scrollTop);
}
syncWithAnimation(
function(){
setState(remodal, STATES.CLOSING, false, reason);
},
function(){
remodal.$bg.removeClass(remodal.settings.modifier);
remodal.$overlay.removeClass(remodal.settings.modifier).hide();
remodal.$wrapper.hide();
unlockScreen();
setState(remodal, STATES.CLOSED, false, reason);
},
remodal);
};
Remodal.prototype.getState=function(){
return this.state;
};
Remodal.prototype.destroy=function(){
var lookup=$[PLUGIN_NAME].lookup;
var instanceCount;
halt(this);
this.$wrapper.remove();
delete lookup[this.index];
instanceCount=$.grep(lookup, function(instance){
return !!instance;
}).length;
if(instanceCount===0){
this.$overlay.remove();
this.$bg.removeClass(namespacify('is', STATES.CLOSING) + ' ' +
namespacify('is', STATES.OPENING) + ' ' +
namespacify('is', STATES.CLOSED) + ' ' +
namespacify('is', STATES.OPENED));
}};
$[PLUGIN_NAME]={
lookup: []
};
$.fn[PLUGIN_NAME]=function(opts){
var instance;
var $elem;
this.each(function(index, elem){
$elem=$(elem);
if($elem.data(PLUGIN_NAME)==null){
instance=new Remodal($elem, opts);
$elem.data(PLUGIN_NAME, instance.index);
if(instance.settings.hashTracking &&
$elem.attr('data-' + PLUGIN_NAME + '-id')===location.hash.substr(1)
){
instance.open();
}}else{
instance=$[PLUGIN_NAME].lookup[$elem.data(PLUGIN_NAME)];
}});
return instance;
};
$(document).ready(function(){
$(document).on('click', '[data-' + PLUGIN_NAME + '-target]', function(e){
e.preventDefault();
var elem=e.currentTarget;
var id=elem.getAttribute('data-' + PLUGIN_NAME + '-target');
var $target=$('[data-' + PLUGIN_NAME + '-id="' + id + '"]');
$[PLUGIN_NAME].lookup[$target.data(PLUGIN_NAME)].open();
});
$(document).find('.' + NAMESPACE).each(function(i, container){
var $container=$(container);
var options=$container.data(PLUGIN_NAME + '-options');
if(!options){
options={};}else if(typeof options==='string'||options instanceof String){
options=parseOptions(options);
}
$container[PLUGIN_NAME](options);
});
$(document).on('keydown.' + NAMESPACE, function(e){
if(current&&current.settings.closeOnEscape&&current.state===STATES.OPENED&&e.keyCode===27){
current.close();
}});
$(window).on('hashchange.' + NAMESPACE, handleHashChangeEvent);
});
});
(function (factory){
"use strict";
if(typeof define==='function'&&define.amd){
define(['jquery'], factory);
}
else if(typeof exports=="object"&&typeof module=="object"){
module.exports=factory(require('jquery'));
}else{
factory(jQuery);
}})(function($, undefined){
"use strict";
var defaultOpts={
beforeShow: noop,
move: noop,
change: noop,
show: noop,
hide: noop,
color: false,
flat: false,
showInput: false,
allowEmpty: false,
showButtons: true,
clickoutFiresChange: true,
showInitial: false,
showPalette: false,
showPaletteOnly: false,
hideAfterPaletteSelect: false,
togglePaletteOnly: false,
showSelectionPalette: true,
localStorageKey: false,
appendTo: "body",
maxSelectionSize: 7,
cancelText: "cancel",
chooseText: "choose",
togglePaletteMoreText: "more",
togglePaletteLessText: "less",
clearText: "Clear Color Selection",
noColorSelectedText: "No Color Selected",
preferredFormat: false,
className: "",
containerClassName: "",
replacerClassName: "",
showAlpha: false,
theme: "sp-light",
palette: [["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"]],
selectionPalette: [],
disabled: false,
offset: null
},
spectrums=[],
IE = !!/msie/i.exec(window.navigator.userAgent),
rgbaSupport=(function(){
function contains(str, substr){
return !!~('' + str).indexOf(substr);
}
var elem=document.createElement('div');
var style=elem.style;
style.cssText='background-color:rgba(0,0,0,.5)';
return contains(style.backgroundColor, 'rgba')||contains(style.backgroundColor, 'hsla');
})(),
replaceInput=[
"<div class='sp-replacer'>",
"<div class='sp-preview'><div class='sp-preview-inner'></div></div>",
"<div class='sp-dd'>&#9660;</div>",
"</div>"
].join(''),
markup=(function (){
var gradientFix="";
if(IE){
for (var i=1; i <=6; i++){
gradientFix +="<div class='sp-" + i + "'></div>";
}}
return [
"<div class='sp-container sp-hidden'>",
"<div class='sp-palette-container'>",
"<div class='sp-palette sp-thumb sp-cf'></div>",
"<div class='sp-palette-button-container sp-cf'>",
"<button type='button' class='sp-palette-toggle'></button>",
"</div>",
"</div>",
"<div class='sp-picker-container'>",
"<div class='sp-top sp-cf'>",
"<div class='sp-fill'></div>",
"<div class='sp-top-inner'>",
"<div class='sp-color'>",
"<div class='sp-sat'>",
"<div class='sp-val'>",
"<div class='sp-dragger'></div>",
"</div>",
"</div>",
"</div>",
"<div class='sp-clear sp-clear-display'>",
"</div>",
"<div class='sp-hue'>",
"<div class='sp-slider'></div>",
gradientFix,
"</div>",
"</div>",
"<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>",
"</div>",
"<div class='sp-input-container sp-cf'>",
"<input class='sp-input' type='text' spellcheck='false'  />",
"</div>",
"<div class='sp-initial sp-thumb sp-cf'></div>",
"<div class='sp-button-container sp-cf'>",
"<a class='sp-cancel' href='#'></a>",
"<button type='button' class='sp-choose'></button>",
"</div>",
"</div>",
"</div>"
].join("");
})();
function paletteTemplate (p, color, className, opts){
var html=[];
for (var i=0; i < p.length; i++){
var current=p[i];
if(current){
var tiny=tinycolor(current);
var c=tiny.toHsl().l < 0.5 ? "sp-thumb-el sp-thumb-dark":"sp-thumb-el sp-thumb-light";
c +=(tinycolor.equals(color, current)) ? " sp-thumb-active":"";
var formattedString=tiny.toString(opts.preferredFormat||"rgb");
var swatchStyle=rgbaSupport ? ("background-color:" + tiny.toRgbString()):"filter:" + tiny.toFilter();
html.push('<span title="' + formattedString + '" data-color="' + tiny.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + swatchStyle + ';" /></span>');
}else{
var cls='sp-clear-display';
html.push($('<div />')
.append($('<span data-color="" style="background-color:transparent;" class="' + cls + '"></span>')
.attr('title', opts.noColorSelectedText)
)
.html()
);
}}
return "<div class='sp-cf " + className + "'>" + html.join('') + "</div>";
}
function hideAll(){
for (var i=0; i < spectrums.length; i++){
if(spectrums[i]){
spectrums[i].hide();
}}
}
function instanceOptions(o, callbackContext){
var opts=$.extend({}, defaultOpts, o);
opts.callbacks={
'move': bind(opts.move, callbackContext),
'change': bind(opts.change, callbackContext),
'show': bind(opts.show, callbackContext),
'hide': bind(opts.hide, callbackContext),
'beforeShow': bind(opts.beforeShow, callbackContext)
};
return opts;
}
function spectrum(element, o){
var opts=instanceOptions(o, element),
flat=opts.flat,
showSelectionPalette=opts.showSelectionPalette,
localStorageKey=opts.localStorageKey,
theme=opts.theme,
callbacks=opts.callbacks,
resize=throttle(reflow, 10),
visible=false,
isDragging=false,
dragWidth=0,
dragHeight=0,
dragHelperHeight=0,
slideHeight=0,
slideWidth=0,
alphaWidth=0,
alphaSlideHelperWidth=0,
slideHelperHeight=0,
currentHue=0,
currentSaturation=0,
currentValue=0,
currentAlpha=1,
palette=[],
paletteArray=[],
paletteLookup={},
selectionPalette=opts.selectionPalette.slice(0),
maxSelectionSize=opts.maxSelectionSize,
draggingClass="sp-dragging",
shiftMovementDirection=null;
var doc=element.ownerDocument,
body=doc.body,
boundElement=$(element),
disabled=false,
container=$(markup, doc).addClass(theme),
pickerContainer=container.find(".sp-picker-container"),
dragger=container.find(".sp-color"),
dragHelper=container.find(".sp-dragger"),
slider=container.find(".sp-hue"),
slideHelper=container.find(".sp-slider"),
alphaSliderInner=container.find(".sp-alpha-inner"),
alphaSlider=container.find(".sp-alpha"),
alphaSlideHelper=container.find(".sp-alpha-handle"),
textInput=container.find(".sp-input"),
paletteContainer=container.find(".sp-palette"),
initialColorContainer=container.find(".sp-initial"),
cancelButton=container.find(".sp-cancel"),
clearButton=container.find(".sp-clear"),
chooseButton=container.find(".sp-choose"),
toggleButton=container.find(".sp-palette-toggle"),
isInput=boundElement.is("input"),
isInputTypeColor=isInput&&boundElement.attr("type")==="color"&&inputTypeColorSupport(),
shouldReplace=isInput&&!flat,
replacer=(shouldReplace) ? $(replaceInput).addClass(theme).addClass(opts.className).addClass(opts.replacerClassName):$([]),
offsetElement=(shouldReplace) ? replacer:boundElement,
previewElement=replacer.find(".sp-preview-inner"),
initialColor=opts.color||(isInput&&boundElement.val()),
colorOnShow=false,
currentPreferredFormat=opts.preferredFormat,
clickoutFiresChange = !opts.showButtons||opts.clickoutFiresChange,
isEmpty = !initialColor,
allowEmpty=opts.allowEmpty&&!isInputTypeColor;
function applyOptions(){
if(opts.showPaletteOnly){
opts.showPalette=true;
}
toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText:opts.togglePaletteLessText);
if(opts.palette){
palette=opts.palette.slice(0);
paletteArray=$.isArray(palette[0]) ? palette:[palette];
paletteLookup={};
for (var i=0; i < paletteArray.length; i++){
for (var j=0; j < paletteArray[i].length; j++){
var rgb=tinycolor(paletteArray[i][j]).toRgbString();
paletteLookup[rgb]=true;
}}
}
container.toggleClass("sp-flat", flat);
container.toggleClass("sp-input-disabled", !opts.showInput);
container.toggleClass("sp-alpha-enabled", opts.showAlpha);
container.toggleClass("sp-clear-enabled", allowEmpty);
container.toggleClass("sp-buttons-disabled", !opts.showButtons);
container.toggleClass("sp-palette-buttons-disabled", !opts.togglePaletteOnly);
container.toggleClass("sp-palette-disabled", !opts.showPalette);
container.toggleClass("sp-palette-only", opts.showPaletteOnly);
container.toggleClass("sp-initial-disabled", !opts.showInitial);
container.addClass(opts.className).addClass(opts.containerClassName);
reflow();
}
function initialize(){
if(IE){
container.find("*:not(input)").attr("unselectable", "on");
}
applyOptions();
if(shouldReplace){
boundElement.after(replacer).hide();
}
if(!allowEmpty){
clearButton.hide();
}
if(flat){
boundElement.after(container).hide();
}else{
var appendTo=opts.appendTo==="parent" ? boundElement.parent():$(opts.appendTo);
if(appendTo.length!==1){
appendTo=$("body");
}
appendTo.append(container);
}
updateSelectionPaletteFromStorage();
offsetElement.on("click.spectrum touchstart.spectrum", function (e){
if(!disabled){
toggle();
}
e.stopPropagation();
if(!$(e.target).is("input")){
e.preventDefault();
}});
if(boundElement.is(":disabled")||(opts.disabled===true)){
disable();
}
container.click(stopPropagation);
textInput.change(setFromTextInput);
textInput.on("paste", function (){
setTimeout(setFromTextInput, 1);
});
textInput.keydown(function (e){ if(e.keyCode==13){ setFromTextInput(); }});
cancelButton.text(opts.cancelText);
cancelButton.on("click.spectrum", function (e){
e.stopPropagation();
e.preventDefault();
revert();
hide();
});
clearButton.attr("title", opts.clearText);
clearButton.on("click.spectrum", function (e){
e.stopPropagation();
e.preventDefault();
isEmpty=true;
move();
if(flat){
updateOriginalInput(true);
}});
chooseButton.text(opts.chooseText);
chooseButton.on("click.spectrum", function (e){
e.stopPropagation();
e.preventDefault();
if(IE&&textInput.is(":focus")){
textInput.trigger('change');
}
if(isValid()){
updateOriginalInput(true);
hide();
}});
toggleButton.text(opts.showPaletteOnly ? opts.togglePaletteMoreText:opts.togglePaletteLessText);
toggleButton.on("click.spectrum", function (e){
e.stopPropagation();
e.preventDefault();
opts.showPaletteOnly = !opts.showPaletteOnly;
if(!opts.showPaletteOnly&&!flat){
container.css('left', '-=' + (pickerContainer.outerWidth(true) + 5));
}
applyOptions();
});
draggable(alphaSlider, function (dragX, dragY, e){
currentAlpha=(dragX / alphaWidth);
isEmpty=false;
if(e.shiftKey){
currentAlpha=Math.round(currentAlpha * 10) / 10;
}
move();
}, dragStart, dragStop);
draggable(slider, function (dragX, dragY){
currentHue=parseFloat(dragY / slideHeight);
isEmpty=false;
if(!opts.showAlpha){
currentAlpha=1;
}
move();
}, dragStart, dragStop);
draggable(dragger, function (dragX, dragY, e){
if(!e.shiftKey){
shiftMovementDirection=null;
}
else if(!shiftMovementDirection){
var oldDragX=currentSaturation * dragWidth;
var oldDragY=dragHeight - (currentValue * dragHeight);
var furtherFromX=Math.abs(dragX - oldDragX) > Math.abs(dragY - oldDragY);
shiftMovementDirection=furtherFromX ? "x":"y";
}
var setSaturation = !shiftMovementDirection||shiftMovementDirection==="x";
var setValue = !shiftMovementDirection||shiftMovementDirection==="y";
if(setSaturation){
currentSaturation=parseFloat(dragX / dragWidth);
}
if(setValue){
currentValue=parseFloat((dragHeight - dragY) / dragHeight);
}
isEmpty=false;
if(!opts.showAlpha){
currentAlpha=1;
}
move();
}, dragStart, dragStop);
if(!!initialColor){
set(initialColor);
updateUI();
currentPreferredFormat=opts.preferredFormat||tinycolor(initialColor).format;
addColorToSelectionPalette(initialColor);
}else{
updateUI();
}
if(flat){
show();
}
function paletteElementClick(e){
if(e.data&&e.data.ignore){
set($(e.target).closest(".sp-thumb-el").data("color"));
move();
}else{
set($(e.target).closest(".sp-thumb-el").data("color"));
move();
if(opts.hideAfterPaletteSelect){
updateOriginalInput(true);
hide();
}else{
updateOriginalInput();
}}
return false;
}
var paletteEvent=IE ? "mousedown.spectrum":"click.spectrum touchstart.spectrum";
paletteContainer.on(paletteEvent, ".sp-thumb-el", paletteElementClick);
initialColorContainer.on(paletteEvent, ".sp-thumb-el:nth-child(1)", { ignore: true }, paletteElementClick);
}
function updateSelectionPaletteFromStorage(){
if(localStorageKey&&window.localStorage){
try {
var oldPalette=window.localStorage[localStorageKey].split(",#");
if(oldPalette.length > 1){
delete window.localStorage[localStorageKey];
$.each(oldPalette, function(i, c){
addColorToSelectionPalette(c);
});
}}
catch(e){ }
try {
selectionPalette=window.localStorage[localStorageKey].split(";");
}
catch (e){ }}
}
function addColorToSelectionPalette(color){
if(showSelectionPalette){
var rgb=tinycolor(color).toRgbString();
if(!paletteLookup[rgb]&&$.inArray(rgb, selectionPalette)===-1){
selectionPalette.push(rgb);
while(selectionPalette.length > maxSelectionSize){
selectionPalette.shift();
}}
if(localStorageKey&&window.localStorage){
try {
window.localStorage[localStorageKey]=selectionPalette.join(";");
}
catch(e){ }}
}}
function getUniqueSelectionPalette(){
var unique=[];
if(opts.showPalette){
for (var i=0; i < selectionPalette.length; i++){
var rgb=tinycolor(selectionPalette[i]).toRgbString();
if(!paletteLookup[rgb]){
unique.push(selectionPalette[i]);
}}
}
return unique.reverse().slice(0, opts.maxSelectionSize);
}
function drawPalette(){
var currentColor=get();
var html=$.map(paletteArray, function (palette, i){
return paletteTemplate(palette, currentColor, "sp-palette-row sp-palette-row-" + i, opts);
});
updateSelectionPaletteFromStorage();
if(selectionPalette){
html.push(paletteTemplate(getUniqueSelectionPalette(), currentColor, "sp-palette-row sp-palette-row-selection", opts));
}
paletteContainer.html(html.join(""));
}
function drawInitial(){
if(opts.showInitial){
var initial=colorOnShow;
var current=get();
initialColorContainer.html(paletteTemplate([initial, current], current, "sp-palette-row-initial", opts));
}}
function dragStart(){
if(dragHeight <=0||dragWidth <=0||slideHeight <=0){
reflow();
}
isDragging=true;
container.addClass(draggingClass);
shiftMovementDirection=null;
boundElement.trigger('dragstart.spectrum', [ get() ]);
}
function dragStop(){
isDragging=false;
container.removeClass(draggingClass);
boundElement.trigger('dragstop.spectrum', [ get() ]);
}
function setFromTextInput(){
var value=textInput.val();
if((value===null||value==="")&&allowEmpty){
set(null);
move();
updateOriginalInput();
}else{
var tiny=tinycolor(value);
if(tiny.isValid()){
set(tiny);
move();
updateOriginalInput();
}else{
textInput.addClass("sp-validation-error");
}}
}
function toggle(){
if(visible){
hide();
}else{
show();
}}
function show(){
var event=$.Event('beforeShow.spectrum');
if(visible){
reflow();
return;
}
boundElement.trigger(event, [ get() ]);
if(callbacks.beforeShow(get())===false||event.isDefaultPrevented()){
return;
}
hideAll();
visible=true;
$(doc).on("keydown.spectrum", onkeydown);
$(doc).on("click.spectrum", clickout);
$(window).on("resize.spectrum", resize);
replacer.addClass("sp-active");
container.removeClass("sp-hidden");
reflow();
updateUI();
colorOnShow=get();
drawInitial();
callbacks.show(colorOnShow);
boundElement.trigger('show.spectrum', [ colorOnShow ]);
}
function onkeydown(e){
if(e.keyCode===27){
hide();
}}
function clickout(e){
if(e.button==2){ return; }
if(isDragging){ return; }
if(clickoutFiresChange){
updateOriginalInput(true);
}else{
revert();
}
hide();
}
function hide(){
if(!visible||flat){ return; }
visible=false;
$(doc).off("keydown.spectrum", onkeydown);
$(doc).off("click.spectrum", clickout);
$(window).off("resize.spectrum", resize);
replacer.removeClass("sp-active");
container.addClass("sp-hidden");
callbacks.hide(get());
boundElement.trigger('hide.spectrum', [ get() ]);
}
function revert(){
set(colorOnShow, true);
updateOriginalInput(true);
}
function set(color, ignoreFormatChange){
if(tinycolor.equals(color, get())){
updateUI();
return;
}
var newColor, newHsv;
if(!color&&allowEmpty){
isEmpty=true;
}else{
isEmpty=false;
newColor=tinycolor(color);
newHsv=newColor.toHsv();
currentHue=(newHsv.h % 360) / 360;
currentSaturation=newHsv.s;
currentValue=newHsv.v;
currentAlpha=newHsv.a;
}
updateUI();
if(newColor&&newColor.isValid()&&!ignoreFormatChange){
currentPreferredFormat=opts.preferredFormat||newColor.getFormat();
}}
function get(opts){
opts=opts||{ };
if(allowEmpty&&isEmpty){
return null;
}
return tinycolor.fromRatio({
h: currentHue,
s: currentSaturation,
v: currentValue,
a: Math.round(currentAlpha * 1000) / 1000
}, { format: opts.format||currentPreferredFormat });
}
function isValid(){
return !textInput.hasClass("sp-validation-error");
}
function move(){
updateUI();
callbacks.move(get());
boundElement.trigger('move.spectrum', [ get() ]);
}
function updateUI(){
textInput.removeClass("sp-validation-error");
updateHelperLocations();
var flatColor=tinycolor.fromRatio({ h: currentHue, s: 1, v: 1 });
dragger.css("background-color", flatColor.toHexString());
var format=currentPreferredFormat;
if(currentAlpha < 1&&!(currentAlpha===0&&format==="name")){
if(format==="hex"||format==="hex3"||format==="hex6"||format==="name"){
format="rgb";
}}
var realColor=get({ format: format }),
displayColor='';
previewElement.removeClass("sp-clear-display");
previewElement.css('background-color', 'transparent');
if(!realColor&&allowEmpty){
previewElement.addClass("sp-clear-display");
}else{
var realHex=realColor.toHexString(),
realRgb=realColor.toRgbString();
if(rgbaSupport||realColor.alpha===1){
previewElement.css("background-color", realRgb);
}else{
previewElement.css("background-color", "transparent");
previewElement.css("filter", realColor.toFilter());
}
if(opts.showAlpha){
var rgb=realColor.toRgb();
rgb.a=0;
var realAlpha=tinycolor(rgb).toRgbString();
var gradient="linear-gradient(left, " + realAlpha + ", " + realHex + ")";
if(IE){
alphaSliderInner.css("filter", tinycolor(realAlpha).toFilter({ gradientType: 1 }, realHex));
}else{
alphaSliderInner.css("background", "-webkit-" + gradient);
alphaSliderInner.css("background", "-moz-" + gradient);
alphaSliderInner.css("background", "-ms-" + gradient);
alphaSliderInner.css("background",
"linear-gradient(to right, " + realAlpha + ", " + realHex + ")");
}}
displayColor=realColor.toString(format);
}
if(opts.showInput){
textInput.val(displayColor);
}
if(opts.showPalette){
drawPalette();
}
drawInitial();
}
function updateHelperLocations(){
var s=currentSaturation;
var v=currentValue;
if(allowEmpty&&isEmpty){
alphaSlideHelper.hide();
slideHelper.hide();
dragHelper.hide();
}else{
alphaSlideHelper.show();
slideHelper.show();
dragHelper.show();
var dragX=s * dragWidth;
var dragY=dragHeight - (v * dragHeight);
dragX=Math.max(-dragHelperHeight,
Math.min(dragWidth - dragHelperHeight, dragX - dragHelperHeight)
);
dragY=Math.max(-dragHelperHeight,
Math.min(dragHeight - dragHelperHeight, dragY - dragHelperHeight)
);
dragHelper.css({
"top": dragY + "px",
"left": dragX + "px"
});
var alphaX=currentAlpha * alphaWidth;
alphaSlideHelper.css({
"left": (alphaX - (alphaSlideHelperWidth / 2)) + "px"
});
var slideY=(currentHue) * slideHeight;
slideHelper.css({
"top": (slideY - slideHelperHeight) + "px"
});
}}
function updateOriginalInput(fireCallback){
var color=get(),
displayColor='',
hasChanged = !tinycolor.equals(color, colorOnShow);
if(color){
displayColor=color.toString(currentPreferredFormat);
addColorToSelectionPalette(color);
}
if(isInput){
boundElement.val(displayColor);
}
if(fireCallback&&hasChanged){
callbacks.change(color);
boundElement.trigger('change', [ color ]);
}}
function reflow(){
if(!visible){
return;
}
dragWidth=dragger.width();
dragHeight=dragger.height();
dragHelperHeight=dragHelper.height();
slideWidth=slider.width();
slideHeight=slider.height();
slideHelperHeight=slideHelper.height();
alphaWidth=alphaSlider.width();
alphaSlideHelperWidth=alphaSlideHelper.width();
if(!flat){
container.css("position", "absolute");
if(opts.offset){
container.offset(opts.offset);
}else{
container.offset(getOffset(container, offsetElement));
}}
updateHelperLocations();
if(opts.showPalette){
drawPalette();
}
boundElement.trigger('reflow.spectrum');
}
function destroy(){
boundElement.show();
offsetElement.off("click.spectrum touchstart.spectrum");
container.remove();
replacer.remove();
spectrums[spect.id]=null;
}
function option(optionName, optionValue){
if(optionName===undefined){
return $.extend({}, opts);
}
if(optionValue===undefined){
return opts[optionName];
}
opts[optionName]=optionValue;
if(optionName==="preferredFormat"){
currentPreferredFormat=opts.preferredFormat;
}
applyOptions();
}
function enable(){
disabled=false;
boundElement.attr("disabled", false);
offsetElement.removeClass("sp-disabled");
}
function disable(){
hide();
disabled=true;
boundElement.attr("disabled", true);
offsetElement.addClass("sp-disabled");
}
function setOffset(coord){
opts.offset=coord;
reflow();
}
initialize();
var spect={
show: show,
hide: hide,
toggle: toggle,
reflow: reflow,
option: option,
enable: enable,
disable: disable,
offset: setOffset,
set: function (c){
set(c);
updateOriginalInput();
},
get: get,
destroy: destroy,
container: container
};
spect.id=spectrums.push(spect) - 1;
return spect;
}
function getOffset(picker, input){
var extraY=0;
var dpWidth=picker.outerWidth();
var dpHeight=picker.outerHeight();
var inputHeight=input.outerHeight();
var doc=picker[0].ownerDocument;
var docElem=doc.documentElement;
var viewWidth=docElem.clientWidth + $(doc).scrollLeft();
var viewHeight=docElem.clientHeight + $(doc).scrollTop();
var offset=input.offset();
var offsetLeft=offset.left;
var offsetTop=offset.top;
offsetTop +=inputHeight;
offsetLeft -=
Math.min(offsetLeft, (offsetLeft + dpWidth > viewWidth&&viewWidth > dpWidth) ?
Math.abs(offsetLeft + dpWidth - viewWidth):0);
offsetTop -=
Math.min(offsetTop, ((offsetTop + dpHeight > viewHeight&&viewHeight > dpHeight) ?
Math.abs(dpHeight + inputHeight - extraY):extraY));
return {
top: offsetTop,
bottom: offset.bottom,
left: offsetLeft,
right: offset.right,
width: offset.width,
height: offset.height
};}
function noop(){
}
function stopPropagation(e){
e.stopPropagation();
}
function bind(func, obj){
var slice=Array.prototype.slice;
var args=slice.call(arguments, 2);
return function (){
return func.apply(obj, args.concat(slice.call(arguments)));
};}
function draggable(element, onmove, onstart, onstop){
onmove=onmove||function (){ };
onstart=onstart||function (){ };
onstop=onstop||function (){ };
var doc=document;
var dragging=false;
var offset={};
var maxHeight=0;
var maxWidth=0;
var hasTouch=('ontouchstart' in window);
var duringDragEvents={};
duringDragEvents["selectstart"]=prevent;
duringDragEvents["dragstart"]=prevent;
duringDragEvents["touchmove mousemove"]=move;
duringDragEvents["touchend mouseup"]=stop;
function prevent(e){
if(e.stopPropagation){
e.stopPropagation();
}
if(e.preventDefault){
e.preventDefault();
}
e.returnValue=false;
}
function move(e){
if(dragging){
if(IE&&doc.documentMode < 9&&!e.button){
return stop();
}
var t0=e.originalEvent&&e.originalEvent.touches&&e.originalEvent.touches[0];
var pageX=t0&&t0.pageX||e.pageX;
var pageY=t0&&t0.pageY||e.pageY;
var dragX=Math.max(0, Math.min(pageX - offset.left, maxWidth));
var dragY=Math.max(0, Math.min(pageY - offset.top, maxHeight));
if(hasTouch){
prevent(e);
}
onmove.apply(element, [dragX, dragY, e]);
}}
function start(e){
var rightclick=(e.which) ? (e.which==3):(e.button==2);
if(!rightclick&&!dragging){
if(onstart.apply(element, arguments)!==false){
dragging=true;
maxHeight=$(element).height();
maxWidth=$(element).width();
offset=$(element).offset();
$(doc).on(duringDragEvents);
$(doc.body).addClass("sp-dragging");
move(e);
prevent(e);
}}
}
function stop(){
if(dragging){
$(doc).off(duringDragEvents);
$(doc.body).removeClass("sp-dragging");
setTimeout(function(){
onstop.apply(element, arguments);
}, 0);
}
dragging=false;
}
$(element).on("touchstart mousedown", start);
}
function throttle(func, wait, debounce){
var timeout;
return function (){
var context=this, args=arguments;
var throttler=function (){
timeout=null;
func.apply(context, args);
};
if(debounce) clearTimeout(timeout);
if(debounce||!timeout) timeout=setTimeout(throttler, wait);
};}
function inputTypeColorSupport(){
return $.fn.spectrum.inputTypeColorSupport();
}
var dataID="spectrum.id";
$.fn.spectrum=function (opts, extra){
if(typeof opts=="string"){
var returnValue=this;
var args=Array.prototype.slice.call(arguments, 1);
this.each(function (){
var spect=spectrums[$(this).data(dataID)];
if(spect){
var method=spect[opts];
if(!method){
throw new Error("Spectrum: no such method: '" + opts + "'");
}
if(opts=="get"){
returnValue=spect.get();
}
else if(opts=="container"){
returnValue=spect.container;
}
else if(opts=="option"){
returnValue=spect.option.apply(spect, args);
}
else if(opts=="destroy"){
spect.destroy();
$(this).removeData(dataID);
}else{
method.apply(spect, args);
}}
});
return returnValue;
}
return this.spectrum("destroy").each(function (){
var options=$.extend({}, $(this).data(), opts);
var spect=spectrum(this, options);
$(this).data(dataID, spect.id);
});
};
$.fn.spectrum.load=true;
$.fn.spectrum.loadOpts={};
$.fn.spectrum.draggable=draggable;
$.fn.spectrum.defaults=defaultOpts;
$.fn.spectrum.inputTypeColorSupport=function inputTypeColorSupport(){
if(typeof inputTypeColorSupport._cachedResult==="undefined"){
var colorInput=$("<input type='color'/>")[0];
inputTypeColorSupport._cachedResult=colorInput.type==="color"&&colorInput.value!=="";
}
return inputTypeColorSupport._cachedResult;
};
$.spectrum={ };
$.spectrum.localization={ };
$.spectrum.palettes={ };
$.fn.spectrum.processNativeColorInputs=function (){
var colorInputs=$("input[type=color]");
if(colorInputs.length&&!inputTypeColorSupport()){
colorInputs.spectrum({
preferredFormat: "hex6"
});
}};
(function(){
var trimLeft=/^[\s,#]+/,
trimRight=/\s+$/,
tinyCounter=0,
math=Math,
mathRound=math.round,
mathMin=math.min,
mathMax=math.max,
mathRandom=math.random;
var tinycolor=function(color, opts){
color=(color) ? color:'';
opts=opts||{ };
if(color instanceof tinycolor){
return color;
}
if(!(this instanceof tinycolor)){
return new tinycolor(color, opts);
}
var rgb=inputToRGB(color);
this._originalInput=color,
this._r=rgb.r,
this._g=rgb.g,
this._b=rgb.b,
this._a=rgb.a,
this._roundA=mathRound(1000 * this._a) / 1000,
this._format=opts.format||rgb.format;
this._gradientType=opts.gradientType;
if(this._r < 1){ this._r=mathRound(this._r); }
if(this._g < 1){ this._g=mathRound(this._g); }
if(this._b < 1){ this._b=mathRound(this._b); }
this._ok=rgb.ok;
this._tc_id=tinyCounter++;
};
tinycolor.prototype={
isDark: function(){
return this.getBrightness() < 128;
},
isLight: function(){
return !this.isDark();
},
isValid: function(){
return this._ok;
},
getOriginalInput: function(){
return this._originalInput;
},
getFormat: function(){
return this._format;
},
getAlpha: function(){
return this._a;
},
getBrightness: function(){
var rgb=this.toRgb();
return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
},
setAlpha: function(value){
this._a=boundAlpha(value);
this._roundA=mathRound(1000 * this._a) / 1000;
return this;
},
toHsv: function(){
var hsv=rgbToHsv(this._r, this._g, this._b);
return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this._a };},
toHsvString: function(){
var hsv=rgbToHsv(this._r, this._g, this._b);
var h=mathRound(hsv.h * 360), s=mathRound(hsv.s * 100), v=mathRound(hsv.v * 100);
return (this._a==1) ?
"hsv("  + h + ", " + s + "%, " + v + "%)" :
"hsva(" + h + ", " + s + "%, " + v + "%, "+ this._roundA + ")";
},
toHsl: function(){
var hsl=rgbToHsl(this._r, this._g, this._b);
return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this._a };},
toHslString: function(){
var hsl=rgbToHsl(this._r, this._g, this._b);
var h=mathRound(hsl.h * 360), s=mathRound(hsl.s * 100), l=mathRound(hsl.l * 100);
return (this._a==1) ?
"hsl("  + h + ", " + s + "%, " + l + "%)" :
"hsla(" + h + ", " + s + "%, " + l + "%, "+ this._roundA + ")";
},
toHex: function(allow3Char){
return rgbToHex(this._r, this._g, this._b, allow3Char);
},
toHexString: function(allow3Char){
return '#' + this.toHex(allow3Char);
},
toHex8: function(){
return rgbaToHex(this._r, this._g, this._b, this._a);
},
toHex8String: function(){
return '#' + this.toHex8();
},
toRgb: function(){
return { r: mathRound(this._r), g: mathRound(this._g), b: mathRound(this._b), a: this._a };},
toRgbString: function(){
return (this._a==1) ?
"rgb("  + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ")" :
"rgba(" + mathRound(this._r) + ", " + mathRound(this._g) + ", " + mathRound(this._b) + ", " + this._roundA + ")";
},
toPercentageRgb: function(){
return { r: mathRound(bound01(this._r, 255) * 100) + "%", g: mathRound(bound01(this._g, 255) * 100) + "%", b: mathRound(bound01(this._b, 255) * 100) + "%", a: this._a };},
toPercentageRgbString: function(){
return (this._a==1) ?
"rgb("  + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%)" :
"rgba(" + mathRound(bound01(this._r, 255) * 100) + "%, " + mathRound(bound01(this._g, 255) * 100) + "%, " + mathRound(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
},
toName: function(){
if(this._a===0){
return "transparent";
}
if(this._a < 1){
return false;
}
return hexNames[rgbToHex(this._r, this._g, this._b, true)]||false;
},
toFilter: function(secondColor){
var hex8String='#' + rgbaToHex(this._r, this._g, this._b, this._a);
var secondHex8String=hex8String;
var gradientType=this._gradientType ? "GradientType=1, ":"";
if(secondColor){
var s=tinycolor(secondColor);
secondHex8String=s.toHex8String();
}
return "progid:DXImageTransform.Microsoft.gradient("+gradientType+"startColorstr="+hex8String+",endColorstr="+secondHex8String+")";
},
toString: function(format){
var formatSet = !!format;
format=format||this._format;
var formattedString=false;
var hasAlpha=this._a < 1&&this._a >=0;
var needsAlphaFormat = !formatSet&&hasAlpha&&(format==="hex"||format==="hex6"||format==="hex3"||format==="name");
if(needsAlphaFormat){
if(format==="name"&&this._a===0){
return this.toName();
}
return this.toRgbString();
}
if(format==="rgb"){
formattedString=this.toRgbString();
}
if(format==="prgb"){
formattedString=this.toPercentageRgbString();
}
if(format==="hex"||format==="hex6"){
formattedString=this.toHexString();
}
if(format==="hex3"){
formattedString=this.toHexString(true);
}
if(format==="hex8"){
formattedString=this.toHex8String();
}
if(format==="name"){
formattedString=this.toName();
}
if(format==="hsl"){
formattedString=this.toHslString();
}
if(format==="hsv"){
formattedString=this.toHsvString();
}
return formattedString||this.toHexString();
},
_applyModification: function(fn, args){
var color=fn.apply(null, [this].concat([].slice.call(args)));
this._r=color._r;
this._g=color._g;
this._b=color._b;
this.setAlpha(color._a);
return this;
},
lighten: function(){
return this._applyModification(lighten, arguments);
},
brighten: function(){
return this._applyModification(brighten, arguments);
},
darken: function(){
return this._applyModification(darken, arguments);
},
desaturate: function(){
return this._applyModification(desaturate, arguments);
},
saturate: function(){
return this._applyModification(saturate, arguments);
},
greyscale: function(){
return this._applyModification(greyscale, arguments);
},
spin: function(){
return this._applyModification(spin, arguments);
},
_applyCombination: function(fn, args){
return fn.apply(null, [this].concat([].slice.call(args)));
},
analogous: function(){
return this._applyCombination(analogous, arguments);
},
complement: function(){
return this._applyCombination(complement, arguments);
},
monochromatic: function(){
return this._applyCombination(monochromatic, arguments);
},
splitcomplement: function(){
return this._applyCombination(splitcomplement, arguments);
},
triad: function(){
return this._applyCombination(triad, arguments);
},
tetrad: function(){
return this._applyCombination(tetrad, arguments);
}};
tinycolor.fromRatio=function(color, opts){
if(typeof color=="object"){
var newColor={};
for (var i in color){
if(color.hasOwnProperty(i)){
if(i==="a"){
newColor[i]=color[i];
}else{
newColor[i]=convertToPercentage(color[i]);
}}
}
color=newColor;
}
return tinycolor(color, opts);
};
function inputToRGB(color){
var rgb={ r: 0, g: 0, b: 0 };
var a=1;
var ok=false;
var format=false;
if(typeof color=="string"){
color=stringInputToObject(color);
}
if(typeof color=="object"){
if(color.hasOwnProperty("r")&&color.hasOwnProperty("g")&&color.hasOwnProperty("b")){
rgb=rgbToRgb(color.r, color.g, color.b);
ok=true;
format=String(color.r).substr(-1)==="%" ? "prgb":"rgb";
}
else if(color.hasOwnProperty("h")&&color.hasOwnProperty("s")&&color.hasOwnProperty("v")){
color.s=convertToPercentage(color.s);
color.v=convertToPercentage(color.v);
rgb=hsvToRgb(color.h, color.s, color.v);
ok=true;
format="hsv";
}
else if(color.hasOwnProperty("h")&&color.hasOwnProperty("s")&&color.hasOwnProperty("l")){
color.s=convertToPercentage(color.s);
color.l=convertToPercentage(color.l);
rgb=hslToRgb(color.h, color.s, color.l);
ok=true;
format="hsl";
}
if(color.hasOwnProperty("a")){
a=color.a;
}}
a=boundAlpha(a);
return {
ok: ok,
format: color.format||format,
r: mathMin(255, mathMax(rgb.r, 0)),
g: mathMin(255, mathMax(rgb.g, 0)),
b: mathMin(255, mathMax(rgb.b, 0)),
a: a
};}
function rgbToRgb(r, g, b){
return {
r: bound01(r, 255) * 255,
g: bound01(g, 255) * 255,
b: bound01(b, 255) * 255
};}
function rgbToHsl(r, g, b){
r=bound01(r, 255);
g=bound01(g, 255);
b=bound01(b, 255);
var max=mathMax(r, g, b), min=mathMin(r, g, b);
var h, s, l=(max + min) / 2;
if(max==min){
h=s = 0;
}else{
var d=max - min;
s=l > 0.5 ? d / (2 - max - min):d / (max + min);
switch(max){
case r: h=(g - b) / d + (g < b ? 6:0); break;
case g: h=(b - r) / d + 2; break;
case b: h=(r - g) / d + 4; break;
}
h /=6;
}
return { h: h, s: s, l: l };}
function hslToRgb(h, s, l){
var r, g, b;
h=bound01(h, 360);
s=bound01(s, 100);
l=bound01(l, 100);
function hue2rgb(p, q, t){
if(t < 0) t +=1;
if(t > 1) t -=1;
if(t < 1/6) return p + (q - p) * 6 * t;
if(t < 1/2) return q;
if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
return p;
}
if(s===0){
r=g = b=l;
}else{
var q=l < 0.5 ? l * (1 + s):l + s - l * s;
var p=2 * l - q;
r=hue2rgb(p, q, h + 1/3);
g=hue2rgb(p, q, h);
b=hue2rgb(p, q, h - 1/3);
}
return { r: r * 255, g: g * 255, b: b * 255 };}
function rgbToHsv(r, g, b){
r=bound01(r, 255);
g=bound01(g, 255);
b=bound01(b, 255);
var max=mathMax(r, g, b), min=mathMin(r, g, b);
var h, s, v=max;
var d=max - min;
s=max===0 ? 0:d / max;
if(max==min){
h=0;
}else{
switch(max){
case r: h=(g - b) / d + (g < b ? 6:0); break;
case g: h=(b - r) / d + 2; break;
case b: h=(r - g) / d + 4; break;
}
h /=6;
}
return { h: h, s: s, v: v };}
function hsvToRgb(h, s, v){
h=bound01(h, 360) * 6;
s=bound01(s, 100);
v=bound01(v, 100);
var i=math.floor(h),
f=h - i,
p=v * (1 - s),
q=v * (1 - f * s),
t=v * (1 - (1 - f) * s),
mod=i % 6,
r=[v, q, p, p, t, v][mod],
g=[t, v, v, q, p, p][mod],
b=[p, p, t, v, v, q][mod];
return { r: r * 255, g: g * 255, b: b * 255 };}
function rgbToHex(r, g, b, allow3Char){
var hex=[
pad2(mathRound(r).toString(16)),
pad2(mathRound(g).toString(16)),
pad2(mathRound(b).toString(16))
];
if(allow3Char&&hex[0].charAt(0)==hex[0].charAt(1)&&hex[1].charAt(0)==hex[1].charAt(1)&&hex[2].charAt(0)==hex[2].charAt(1)){
return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
}
return hex.join("");
}
function rgbaToHex(r, g, b, a){
var hex=[
pad2(convertDecimalToHex(a)),
pad2(mathRound(r).toString(16)),
pad2(mathRound(g).toString(16)),
pad2(mathRound(b).toString(16))
];
return hex.join("");
}
tinycolor.equals=function (color1, color2){
if(!color1||!color2){ return false; }
return tinycolor(color1).toRgbString()==tinycolor(color2).toRgbString();
};
tinycolor.random=function(){
return tinycolor.fromRatio({
r: mathRandom(),
g: mathRandom(),
b: mathRandom()
});
};
function desaturate(color, amount){
amount=(amount===0) ? 0:(amount||10);
var hsl=tinycolor(color).toHsl();
hsl.s -=amount / 100;
hsl.s=clamp01(hsl.s);
return tinycolor(hsl);
}
function saturate(color, amount){
amount=(amount===0) ? 0:(amount||10);
var hsl=tinycolor(color).toHsl();
hsl.s +=amount / 100;
hsl.s=clamp01(hsl.s);
return tinycolor(hsl);
}
function greyscale(color){
return tinycolor(color).desaturate(100);
}
function lighten (color, amount){
amount=(amount===0) ? 0:(amount||10);
var hsl=tinycolor(color).toHsl();
hsl.l +=amount / 100;
hsl.l=clamp01(hsl.l);
return tinycolor(hsl);
}
function brighten(color, amount){
amount=(amount===0) ? 0:(amount||10);
var rgb=tinycolor(color).toRgb();
rgb.r=mathMax(0, mathMin(255, rgb.r - mathRound(255 * - (amount / 100))));
rgb.g=mathMax(0, mathMin(255, rgb.g - mathRound(255 * - (amount / 100))));
rgb.b=mathMax(0, mathMin(255, rgb.b - mathRound(255 * - (amount / 100))));
return tinycolor(rgb);
}
function darken (color, amount){
amount=(amount===0) ? 0:(amount||10);
var hsl=tinycolor(color).toHsl();
hsl.l -=amount / 100;
hsl.l=clamp01(hsl.l);
return tinycolor(hsl);
}
function spin(color, amount){
var hsl=tinycolor(color).toHsl();
var hue=(mathRound(hsl.h) + amount) % 360;
hsl.h=hue < 0 ? 360 + hue:hue;
return tinycolor(hsl);
}
function complement(color){
var hsl=tinycolor(color).toHsl();
hsl.h=(hsl.h + 180) % 360;
return tinycolor(hsl);
}
function triad(color){
var hsl=tinycolor(color).toHsl();
var h=hsl.h;
return [
tinycolor(color),
tinycolor({ h: (h + 120) % 360, s: hsl.s, l: hsl.l }),
tinycolor({ h: (h + 240) % 360, s: hsl.s, l: hsl.l })
];
}
function tetrad(color){
var hsl=tinycolor(color).toHsl();
var h=hsl.h;
return [
tinycolor(color),
tinycolor({ h: (h + 90) % 360, s: hsl.s, l: hsl.l }),
tinycolor({ h: (h + 180) % 360, s: hsl.s, l: hsl.l }),
tinycolor({ h: (h + 270) % 360, s: hsl.s, l: hsl.l })
];
}
function splitcomplement(color){
var hsl=tinycolor(color).toHsl();
var h=hsl.h;
return [
tinycolor(color),
tinycolor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l}),
tinycolor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l})
];
}
function analogous(color, results, slices){
results=results||6;
slices=slices||30;
var hsl=tinycolor(color).toHsl();
var part=360 / slices;
var ret=[tinycolor(color)];
for (hsl.h=((hsl.h - (part * results >> 1)) + 720) % 360; --results;){
hsl.h=(hsl.h + part) % 360;
ret.push(tinycolor(hsl));
}
return ret;
}
function monochromatic(color, results){
results=results||6;
var hsv=tinycolor(color).toHsv();
var h=hsv.h, s=hsv.s, v=hsv.v;
var ret=[];
var modification=1 / results;
while (results--){
ret.push(tinycolor({ h: h, s: s, v: v}));
v=(v + modification) % 1;
}
return ret;
}
tinycolor.mix=function(color1, color2, amount){
amount=(amount===0) ? 0:(amount||50);
var rgb1=tinycolor(color1).toRgb();
var rgb2=tinycolor(color2).toRgb();
var p=amount / 100;
var w=p * 2 - 1;
var a=rgb2.a - rgb1.a;
var w1;
if(w * a==-1){
w1=w;
}else{
w1=(w + a) / (1 + w * a);
}
w1=(w1 + 1) / 2;
var w2=1 - w1;
var rgba={
r: rgb2.r * w1 + rgb1.r * w2,
g: rgb2.g * w1 + rgb1.g * w2,
b: rgb2.b * w1 + rgb1.b * w2,
a: rgb2.a * p  + rgb1.a * (1 - p)
};
return tinycolor(rgba);
};
tinycolor.readability=function(color1, color2){
var c1=tinycolor(color1);
var c2=tinycolor(color2);
var rgb1=c1.toRgb();
var rgb2=c2.toRgb();
var brightnessA=c1.getBrightness();
var brightnessB=c2.getBrightness();
var colorDiff=(
Math.max(rgb1.r, rgb2.r) - Math.min(rgb1.r, rgb2.r) +
Math.max(rgb1.g, rgb2.g) - Math.min(rgb1.g, rgb2.g) +
Math.max(rgb1.b, rgb2.b) - Math.min(rgb1.b, rgb2.b)
);
return {
brightness: Math.abs(brightnessA - brightnessB),
color: colorDiff
};};
tinycolor.isReadable=function(color1, color2){
var readability=tinycolor.readability(color1, color2);
return readability.brightness > 125&&readability.color > 500;
};
tinycolor.mostReadable=function(baseColor, colorList){
var bestColor=null;
var bestScore=0;
var bestIsReadable=false;
for (var i=0; i < colorList.length; i++){
var readability=tinycolor.readability(baseColor, colorList[i]);
var readable=readability.brightness > 125&&readability.color > 500;
var score=3 * (readability.brightness / 125) + (readability.color / 500);
if((readable&&! bestIsReadable) ||
(readable&&bestIsReadable&&score > bestScore) ||
((! readable)&&(! bestIsReadable)&&score > bestScore)){
bestIsReadable=readable;
bestScore=score;
bestColor=tinycolor(colorList[i]);
}}
return bestColor;
};
var names=tinycolor.names={
aliceblue: "f0f8ff",
antiquewhite: "faebd7",
aqua: "0ff",
aquamarine: "7fffd4",
azure: "f0ffff",
beige: "f5f5dc",
bisque: "ffe4c4",
black: "000",
blanchedalmond: "ffebcd",
blue: "00f",
blueviolet: "8a2be2",
brown: "a52a2a",
burlywood: "deb887",
burntsienna: "ea7e5d",
cadetblue: "5f9ea0",
chartreuse: "7fff00",
chocolate: "d2691e",
coral: "ff7f50",
cornflowerblue: "6495ed",
cornsilk: "fff8dc",
crimson: "dc143c",
cyan: "0ff",
darkblue: "00008b",
darkcyan: "008b8b",
darkgoldenrod: "b8860b",
darkgray: "a9a9a9",
darkgreen: "006400",
darkgrey: "a9a9a9",
darkkhaki: "bdb76b",
darkmagenta: "8b008b",
darkolivegreen: "556b2f",
darkorange: "ff8c00",
darkorchid: "9932cc",
darkred: "8b0000",
darksalmon: "e9967a",
darkseagreen: "8fbc8f",
darkslateblue: "483d8b",
darkslategray: "2f4f4f",
darkslategrey: "2f4f4f",
darkturquoise: "00ced1",
darkviolet: "9400d3",
deeppink: "ff1493",
deepskyblue: "00bfff",
dimgray: "696969",
dimgrey: "696969",
dodgerblue: "1e90ff",
firebrick: "b22222",
floralwhite: "fffaf0",
forestgreen: "228b22",
fuchsia: "f0f",
gainsboro: "dcdcdc",
ghostwhite: "f8f8ff",
gold: "ffd700",
goldenrod: "daa520",
gray: "808080",
green: "008000",
greenyellow: "adff2f",
grey: "808080",
honeydew: "f0fff0",
hotpink: "ff69b4",
indianred: "cd5c5c",
indigo: "4b0082",
ivory: "fffff0",
khaki: "f0e68c",
lavender: "e6e6fa",
lavenderblush: "fff0f5",
lawngreen: "7cfc00",
lemonchiffon: "fffacd",
lightblue: "add8e6",
lightcoral: "f08080",
lightcyan: "e0ffff",
lightgoldenrodyellow: "fafad2",
lightgray: "d3d3d3",
lightgreen: "90ee90",
lightgrey: "d3d3d3",
lightpink: "ffb6c1",
lightsalmon: "ffa07a",
lightseagreen: "20b2aa",
lightskyblue: "87cefa",
lightslategray: "789",
lightslategrey: "789",
lightsteelblue: "b0c4de",
lightyellow: "ffffe0",
lime: "0f0",
limegreen: "32cd32",
linen: "faf0e6",
magenta: "f0f",
maroon: "800000",
mediumaquamarine: "66cdaa",
mediumblue: "0000cd",
mediumorchid: "ba55d3",
mediumpurple: "9370db",
mediumseagreen: "3cb371",
mediumslateblue: "7b68ee",
mediumspringgreen: "00fa9a",
mediumturquoise: "48d1cc",
mediumvioletred: "c71585",
midnightblue: "191970",
mintcream: "f5fffa",
mistyrose: "ffe4e1",
moccasin: "ffe4b5",
navajowhite: "ffdead",
navy: "000080",
oldlace: "fdf5e6",
olive: "808000",
olivedrab: "6b8e23",
orange: "ffa500",
orangered: "ff4500",
orchid: "da70d6",
palegoldenrod: "eee8aa",
palegreen: "98fb98",
paleturquoise: "afeeee",
palevioletred: "db7093",
papayawhip: "ffefd5",
peachpuff: "ffdab9",
peru: "cd853f",
pink: "ffc0cb",
plum: "dda0dd",
powderblue: "b0e0e6",
purple: "800080",
rebeccapurple: "663399",
red: "f00",
rosybrown: "bc8f8f",
royalblue: "4169e1",
saddlebrown: "8b4513",
salmon: "fa8072",
sandybrown: "f4a460",
seagreen: "2e8b57",
seashell: "fff5ee",
sienna: "a0522d",
silver: "c0c0c0",
skyblue: "87ceeb",
slateblue: "6a5acd",
slategray: "708090",
slategrey: "708090",
snow: "fffafa",
springgreen: "00ff7f",
steelblue: "4682b4",
tan: "d2b48c",
teal: "008080",
thistle: "d8bfd8",
tomato: "ff6347",
turquoise: "40e0d0",
violet: "ee82ee",
wheat: "f5deb3",
white: "fff",
whitesmoke: "f5f5f5",
yellow: "ff0",
yellowgreen: "9acd32"
};
var hexNames=tinycolor.hexNames=flip(names);
function flip(o){
var flipped={ };
for (var i in o){
if(o.hasOwnProperty(i)){
flipped[o[i]]=i;
}}
return flipped;
}
function boundAlpha(a){
a=parseFloat(a);
if(isNaN(a)||a < 0||a > 1){
a=1;
}
return a;
}
function bound01(n, max){
if(isOnePointZero(n)){ n="100%"; }
var processPercent=isPercentage(n);
n=mathMin(max, mathMax(0, parseFloat(n)));
if(processPercent){
n=parseInt(n * max, 10) / 100;
}
if((math.abs(n - max) < 0.000001)){
return 1;
}
return (n % max) / parseFloat(max);
}
function clamp01(val){
return mathMin(1, mathMax(0, val));
}
function parseIntFromHex(val){
return parseInt(val, 16);
}
function isOnePointZero(n){
return typeof n=="string"&&n.indexOf('.')!=-1&&parseFloat(n)===1;
}
function isPercentage(n){
return typeof n==="string"&&n.indexOf('%')!=-1;
}
function pad2(c){
return c.length==1 ? '0' + c:'' + c;
}
function convertToPercentage(n){
if(n <=1){
n=(n * 100) + "%";
}
return n;
}
function convertDecimalToHex(d){
return Math.round(parseFloat(d) * 255).toString(16);
}
function convertHexToDecimal(h){
return (parseIntFromHex(h) / 255);
}
var matchers=(function(){
var CSS_INTEGER="[-\\+]?\\d+%?";
var CSS_NUMBER="[-\\+]?\\d*\\.\\d+%?";
var CSS_UNIT="(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";
var PERMISSIVE_MATCH3="[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
var PERMISSIVE_MATCH4="[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
return {
rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
};})();
function stringInputToObject(color){
color=color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
var named=false;
if(names[color]){
color=names[color];
named=true;
}
else if(color=='transparent'){
return { r: 0, g: 0, b: 0, a: 0, format: "name" };}
var match;
if((match=matchers.rgb.exec(color))){
return { r: match[1], g: match[2], b: match[3] };}
if((match=matchers.rgba.exec(color))){
return { r: match[1], g: match[2], b: match[3], a: match[4] };}
if((match=matchers.hsl.exec(color))){
return { h: match[1], s: match[2], l: match[3] };}
if((match=matchers.hsla.exec(color))){
return { h: match[1], s: match[2], l: match[3], a: match[4] };}
if((match=matchers.hsv.exec(color))){
return { h: match[1], s: match[2], v: match[3] };}
if((match=matchers.hsva.exec(color))){
return { h: match[1], s: match[2], v: match[3], a: match[4] };}
if((match=matchers.hex8.exec(color))){
return {
a: convertHexToDecimal(match[1]),
r: parseIntFromHex(match[2]),
g: parseIntFromHex(match[3]),
b: parseIntFromHex(match[4]),
format: named ? "name":"hex8"
};}
if((match=matchers.hex6.exec(color))){
return {
r: parseIntFromHex(match[1]),
g: parseIntFromHex(match[2]),
b: parseIntFromHex(match[3]),
format: named ? "name":"hex"
};}
if((match=matchers.hex3.exec(color))){
return {
r: parseIntFromHex(match[1] + '' + match[1]),
g: parseIntFromHex(match[2] + '' + match[2]),
b: parseIntFromHex(match[3] + '' + match[3]),
format: named ? "name":"hex"
};}
return false;
}
window.tinycolor=tinycolor;
})();
$(function (){
if($.fn.spectrum.load){
$.fn.spectrum.processNativeColorInputs();
}});
});
(function(scope){
'use strict';
if(scope['TextEncoder']&&scope['TextDecoder']){
return false;
}
function FastTextEncoder(utfLabel='utf-8'){
if(utfLabel!=='utf-8'){
throw new RangeError(
`Failed to construct 'TextEncoder': The encoding label provided ('${utfLabel}') is invalid.`);
}}
Object.defineProperty(FastTextEncoder.prototype, 'encoding', {value: 'utf-8'});
FastTextEncoder.prototype.encode=function(string, options={stream: false}){
if(options.stream){
throw new Error(`Failed to encode: the 'stream' option is unsupported.`);
}
let pos=0;
const len=string.length;
const out=[];
let at=0;
let tlen=Math.max(32, len + (len >> 1) + 7);
let target=new Uint8Array((tlen >> 3) << 3);
while (pos < len){
let value=string.charCodeAt(pos++);
if(value >=0xd800&&value <=0xdbff){
if(pos < len){
const extra=string.charCodeAt(pos);
if((extra & 0xfc00)===0xdc00){
++pos;
value=((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
}}
if(value >=0xd800&&value <=0xdbff){
continue;
}}
if(at + 4 > target.length){
tlen +=8;
tlen *=(1.0 + (pos / string.length) * 2);
tlen=(tlen >> 3) << 3;
const update=new Uint8Array(tlen);
update.set(target);
target=update;
}
if((value & 0xffffff80)===0){
target[at++]=value;
continue;
}else if((value & 0xfffff800)===0){
target[at++]=((value >>  6) & 0x1f) | 0xc0;
}else if((value & 0xffff0000)===0){
target[at++]=((value >> 12) & 0x0f) | 0xe0;
target[at++]=((value >>  6) & 0x3f) | 0x80;
}else if((value & 0xffe00000)===0){
target[at++]=((value >> 18) & 0x07) | 0xf0;
target[at++]=((value >> 12) & 0x3f) | 0x80;
target[at++]=((value >>  6) & 0x3f) | 0x80;
}else{
continue;
}
target[at++]=(value & 0x3f) | 0x80;
}
return target.slice(0, at);
}
function FastTextDecoder(utfLabel='utf-8', options={fatal: false}){
if(utfLabel!=='utf-8'){
throw new RangeError(
`Failed to construct 'TextDecoder': The encoding label provided ('${utfLabel}') is invalid.`);
}
if(options.fatal){
throw new Error(`Failed to construct 'TextDecoder': the 'fatal' option is unsupported.`);
}}
Object.defineProperty(FastTextDecoder.prototype, 'encoding', {value: 'utf-8'});
Object.defineProperty(FastTextDecoder.prototype, 'fatal', {value: false});
Object.defineProperty(FastTextDecoder.prototype, 'ignoreBOM', {value: false});
FastTextDecoder.prototype.decode=function(buffer, options={stream: false}){
if(options['stream']){
throw new Error(`Failed to decode: the 'stream' option is unsupported.`);
}
const bytes=new Uint8Array(buffer);
let pos=0;
const len=bytes.length;
const out=[];
while (pos < len){
const byte1=bytes[pos++];
if(byte1===0){
break;
}
if((byte1 & 0x80)===0){
out.push(byte1);
}else if((byte1 & 0xe0)===0xc0){
const byte2=bytes[pos++] & 0x3f;
out.push(((byte1 & 0x1f) << 6) | byte2);
}else if((byte1 & 0xf0)===0xe0){
const byte2=bytes[pos++] & 0x3f;
const byte3=bytes[pos++] & 0x3f;
out.push(((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3);
}else if((byte1 & 0xf8)===0xf0){
const byte2=bytes[pos++] & 0x3f;
const byte3=bytes[pos++] & 0x3f;
const byte4=bytes[pos++] & 0x3f;
let codepoint=((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
if(codepoint > 0xffff){
codepoint -=0x10000;
out.push((codepoint >>> 10) & 0x3ff | 0xd800)
codepoint=0xdc00 | codepoint & 0x3ff;
}
out.push(codepoint);
}else{
}}
return String.fromCharCode.apply(null, out);
}
scope['TextEncoder']=FastTextEncoder;
scope['TextDecoder']=FastTextDecoder;
}(typeof window!=='undefined' ? window:(typeof global!=='undefined' ? global:this)));
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).pako=t()}}(function(){return function i(s,h,l){function o(e,t){if(!h[e]){if(!s[e]){var a="function"==typeof require&&require;if(!t&&a)return a(e,!0);if(_)return _(e,!0);var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}var r=h[e]={exports:{}};s[e][0].call(r.exports,function(t){return o(s[e][1][t]||t)},r,r.exports,i,s,h,l)}return h[e].exports}for(var _="function"==typeof require&&require,t=0;t<l.length;t++)o(l[t]);return o}({1:[function(t,e,a){"use strict";var n="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;a.assign=function(t){for(var e,a,n=Array.prototype.slice.call(arguments,1);n.length;){var r=n.shift();if(r){if("object"!=typeof r)throw new TypeError(r+"must be non-object");for(var i in r)e=r,a=i,Object.prototype.hasOwnProperty.call(e,a)&&(t[i]=r[i])}}return t},a.shrinkBuf=function(t,e){return t.length===e?t:t.subarray?t.subarray(0,e):(t.length=e,t)};var r={arraySet:function(t,e,a,n,r){if(e.subarray&&t.subarray)t.set(e.subarray(a,a+n),r);else for(var i=0;i<n;i++)t[r+i]=e[a+i]},flattenChunks:function(t){var e,a,n,r,i,s;for(e=n=0,a=t.length;e<a;e++)n+=t[e].length;for(s=new Uint8Array(n),e=r=0,a=t.length;e<a;e++)i=t[e],s.set(i,r),r+=i.length;return s}},i={arraySet:function(t,e,a,n,r){for(var i=0;i<n;i++)t[r+i]=e[a+i]},flattenChunks:function(t){return[].concat.apply([],t)}};a.setTyped=function(t){t?(a.Buf8=Uint8Array,a.Buf16=Uint16Array,a.Buf32=Int32Array,a.assign(a,r)):(a.Buf8=Array,a.Buf16=Array,a.Buf32=Array,a.assign(a,i))},a.setTyped(n)},{}],2:[function(t,e,a){"use strict";var l=t("./common"),r=!0,i=!0;try{String.fromCharCode.apply(null,[0])}catch(t){r=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(t){i=!1}for(var o=new l.Buf8(256),n=0;n<256;n++)o[n]=252<=n?6:248<=n?5:240<=n?4:224<=n?3:192<=n?2:1;function _(t,e){if(e<65534&&(t.subarray&&i||!t.subarray&&r))return String.fromCharCode.apply(null,l.shrinkBuf(t,e));for(var a="",n=0;n<e;n++)a+=String.fromCharCode(t[n]);return a}o[254]=o[254]=1,a.string2buf=function(t){var e,a,n,r,i,s=t.length,h=0;for(r=0;r<s;r++)55296==(64512&(a=t.charCodeAt(r)))&&r+1<s&&56320==(64512&(n=t.charCodeAt(r+1)))&&(a=65536+(a-55296<<10)+(n-56320),r++),h+=a<128?1:a<2048?2:a<65536?3:4;for(e=new l.Buf8(h),r=i=0;i<h;r++)55296==(64512&(a=t.charCodeAt(r)))&&r+1<s&&56320==(64512&(n=t.charCodeAt(r+1)))&&(a=65536+(a-55296<<10)+(n-56320),r++),a<128?e[i++]=a:(a<2048?e[i++]=192|a>>>6:(a<65536?e[i++]=224|a>>>12:(e[i++]=240|a>>>18,e[i++]=128|a>>>12&63),e[i++]=128|a>>>6&63),e[i++]=128|63&a);return e},a.buf2binstring=function(t){return _(t,t.length)},a.binstring2buf=function(t){for(var e=new l.Buf8(t.length),a=0,n=e.length;a<n;a++)e[a]=t.charCodeAt(a);return e},a.buf2string=function(t,e){var a,n,r,i,s=e||t.length,h=new Array(2*s);for(a=n=0;a<s;)if((r=t[a++])<128)h[n++]=r;else if(4<(i=o[r]))h[n++]=65533,a+=i-1;else{for(r&=2===i?31:3===i?15:7;1<i&&a<s;)r=r<<6|63&t[a++],i--;1<i?h[n++]=65533:r<65536?h[n++]=r:(r-=65536,h[n++]=55296|r>>10&1023,h[n++]=56320|1023&r)}return _(h,n)},a.utf8border=function(t,e){var a;for((e=e||t.length)>t.length&&(e=t.length),a=e-1;0<=a&&128==(192&t[a]);)a--;return a<0?e:0===a?e:a+o[t[a]]>e?a:e}},{"./common":1}],3:[function(t,e,a){"use strict";e.exports=function(t,e,a,n){for(var r=65535&t|0,i=t>>>16&65535|0,s=0;0!==a;){for(a-=s=2e3<a?2e3:a;i=i+(r=r+e[n++]|0)|0,--s;);r%=65521,i%=65521}return r|i<<16|0}},{}],4:[function(t,e,a){"use strict";var h=function(){for(var t,e=[],a=0;a<256;a++){t=a;for(var n=0;n<8;n++)t=1&t?3988292384^t>>>1:t>>>1;e[a]=t}return e}();e.exports=function(t,e,a,n){var r=h,i=n+a;t^=-1;for(var s=n;s<i;s++)t=t>>>8^r[255&(t^e[s])];return-1^t}},{}],5:[function(t,e,a){"use strict";var l,u=t("../utils/common"),o=t("./trees"),f=t("./adler32"),c=t("./crc32"),n=t("./messages"),_=0,d=4,p=0,g=-2,m=-1,b=4,r=2,v=8,w=9,i=286,s=30,h=19,y=2*i+1,k=15,z=3,x=258,B=x+z+1,A=42,C=113,S=1,j=2,E=3,U=4;function D(t,e){return t.msg=n[e],e}function I(t){return(t<<1)-(4<t?9:0)}function O(t){for(var e=t.length;0<=--e;)t[e]=0}function q(t){var e=t.state,a=e.pending;a>t.avail_out&&(a=t.avail_out),0!==a&&(u.arraySet(t.output,e.pending_buf,e.pending_out,a,t.next_out),t.next_out+=a,e.pending_out+=a,t.total_out+=a,t.avail_out-=a,e.pending-=a,0===e.pending&&(e.pending_out=0))}function T(t,e){o._tr_flush_block(t,0<=t.block_start?t.block_start:-1,t.strstart-t.block_start,e),t.block_start=t.strstart,q(t.strm)}function L(t,e){t.pending_buf[t.pending++]=e}function N(t,e){t.pending_buf[t.pending++]=e>>>8&255,t.pending_buf[t.pending++]=255&e}function R(t,e){var a,n,r=t.max_chain_length,i=t.strstart,s=t.prev_length,h=t.nice_match,l=t.strstart>t.w_size-B?t.strstart-(t.w_size-B):0,o=t.window,_=t.w_mask,d=t.prev,u=t.strstart+x,f=o[i+s-1],c=o[i+s];t.prev_length>=t.good_match&&(r>>=2),h>t.lookahead&&(h=t.lookahead);do{if(o[(a=e)+s]===c&&o[a+s-1]===f&&o[a]===o[i]&&o[++a]===o[i+1]){i+=2,a++;do{}while(o[++i]===o[++a]&&o[++i]===o[++a]&&o[++i]===o[++a]&&o[++i]===o[++a]&&o[++i]===o[++a]&&o[++i]===o[++a]&&o[++i]===o[++a]&&o[++i]===o[++a]&&i<u);if(n=x-(u-i),i=u-x,s<n){if(t.match_start=e,h<=(s=n))break;f=o[i+s-1],c=o[i+s]}}}while((e=d[e&_])>l&&0!=--r);return s<=t.lookahead?s:t.lookahead}function H(t){var e,a,n,r,i,s,h,l,o,_,d=t.w_size;do{if(r=t.window_size-t.lookahead-t.strstart,t.strstart>=d+(d-B)){for(u.arraySet(t.window,t.window,d,d,0),t.match_start-=d,t.strstart-=d,t.block_start-=d,e=a=t.hash_size;n=t.head[--e],t.head[e]=d<=n?n-d:0,--a;);for(e=a=d;n=t.prev[--e],t.prev[e]=d<=n?n-d:0,--a;);r+=d}if(0===t.strm.avail_in)break;if(s=t.strm,h=t.window,l=t.strstart+t.lookahead,o=r,_=void 0,_=s.avail_in,o<_&&(_=o),a=0===_?0:(s.avail_in-=_,u.arraySet(h,s.input,s.next_in,_,l),1===s.state.wrap?s.adler=f(s.adler,h,_,l):2===s.state.wrap&&(s.adler=c(s.adler,h,_,l)),s.next_in+=_,s.total_in+=_,_),t.lookahead+=a,t.lookahead+t.insert>=z)for(i=t.strstart-t.insert,t.ins_h=t.window[i],t.ins_h=(t.ins_h<<t.hash_shift^t.window[i+1])&t.hash_mask;t.insert&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[i+z-1])&t.hash_mask,t.prev[i&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=i,i++,t.insert--,!(t.lookahead+t.insert<z)););}while(t.lookahead<B&&0!==t.strm.avail_in)}function F(t,e){for(var a,n;;){if(t.lookahead<B){if(H(t),t.lookahead<B&&e===_)return S;if(0===t.lookahead)break}if(a=0,t.lookahead>=z&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+z-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!==a&&t.strstart-a<=t.w_size-B&&(t.match_length=R(t,a)),t.match_length>=z)if(n=o._tr_tally(t,t.strstart-t.match_start,t.match_length-z),t.lookahead-=t.match_length,t.match_length<=t.max_lazy_match&&t.lookahead>=z){for(t.match_length--;t.strstart++,t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+z-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart,0!=--t.match_length;);t.strstart++}else t.strstart+=t.match_length,t.match_length=0,t.ins_h=t.window[t.strstart],t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+1])&t.hash_mask;else n=o._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++;if(n&&(T(t,!1),0===t.strm.avail_out))return S}return t.insert=t.strstart<z-1?t.strstart:z-1,e===d?(T(t,!0),0===t.strm.avail_out?E:U):t.last_lit&&(T(t,!1),0===t.strm.avail_out)?S:j}function K(t,e){for(var a,n,r;;){if(t.lookahead<B){if(H(t),t.lookahead<B&&e===_)return S;if(0===t.lookahead)break}if(a=0,t.lookahead>=z&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+z-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),t.prev_length=t.match_length,t.prev_match=t.match_start,t.match_length=z-1,0!==a&&t.prev_length<t.max_lazy_match&&t.strstart-a<=t.w_size-B&&(t.match_length=R(t,a),t.match_length<=5&&(1===t.strategy||t.match_length===z&&4096<t.strstart-t.match_start)&&(t.match_length=z-1)),t.prev_length>=z&&t.match_length<=t.prev_length){for(r=t.strstart+t.lookahead-z,n=o._tr_tally(t,t.strstart-1-t.prev_match,t.prev_length-z),t.lookahead-=t.prev_length-1,t.prev_length-=2;++t.strstart<=r&&(t.ins_h=(t.ins_h<<t.hash_shift^t.window[t.strstart+z-1])&t.hash_mask,a=t.prev[t.strstart&t.w_mask]=t.head[t.ins_h],t.head[t.ins_h]=t.strstart),0!=--t.prev_length;);if(t.match_available=0,t.match_length=z-1,t.strstart++,n&&(T(t,!1),0===t.strm.avail_out))return S}else if(t.match_available){if((n=o._tr_tally(t,0,t.window[t.strstart-1]))&&T(t,!1),t.strstart++,t.lookahead--,0===t.strm.avail_out)return S}else t.match_available=1,t.strstart++,t.lookahead--}return t.match_available&&(n=o._tr_tally(t,0,t.window[t.strstart-1]),t.match_available=0),t.insert=t.strstart<z-1?t.strstart:z-1,e===d?(T(t,!0),0===t.strm.avail_out?E:U):t.last_lit&&(T(t,!1),0===t.strm.avail_out)?S:j}function M(t,e,a,n,r){this.good_length=t,this.max_lazy=e,this.nice_length=a,this.max_chain=n,this.func=r}function P(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=v,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new u.Buf16(2*y),this.dyn_dtree=new u.Buf16(2*(2*s+1)),this.bl_tree=new u.Buf16(2*(2*h+1)),O(this.dyn_ltree),O(this.dyn_dtree),O(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new u.Buf16(k+1),this.heap=new u.Buf16(2*i+1),O(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new u.Buf16(2*i+1),O(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function G(t){var e;return t&&t.state?(t.total_in=t.total_out=0,t.data_type=r,(e=t.state).pending=0,e.pending_out=0,e.wrap<0&&(e.wrap=-e.wrap),e.status=e.wrap?A:C,t.adler=2===e.wrap?0:1,e.last_flush=_,o._tr_init(e),p):D(t,g)}function J(t){var e,a=G(t);return a===p&&((e=t.state).window_size=2*e.w_size,O(e.head),e.max_lazy_match=l[e.level].max_lazy,e.good_match=l[e.level].good_length,e.nice_match=l[e.level].nice_length,e.max_chain_length=l[e.level].max_chain,e.strstart=0,e.block_start=0,e.lookahead=0,e.insert=0,e.match_length=e.prev_length=z-1,e.match_available=0,e.ins_h=0),a}function Q(t,e,a,n,r,i){if(!t)return g;var s=1;if(e===m&&(e=6),n<0?(s=0,n=-n):15<n&&(s=2,n-=16),r<1||w<r||a!==v||n<8||15<n||e<0||9<e||i<0||b<i)return D(t,g);8===n&&(n=9);var h=new P;return(t.state=h).strm=t,h.wrap=s,h.gzhead=null,h.w_bits=n,h.w_size=1<<h.w_bits,h.w_mask=h.w_size-1,h.hash_bits=r+7,h.hash_size=1<<h.hash_bits,h.hash_mask=h.hash_size-1,h.hash_shift=~~((h.hash_bits+z-1)/z),h.window=new u.Buf8(2*h.w_size),h.head=new u.Buf16(h.hash_size),h.prev=new u.Buf16(h.w_size),h.lit_bufsize=1<<r+6,h.pending_buf_size=4*h.lit_bufsize,h.pending_buf=new u.Buf8(h.pending_buf_size),h.d_buf=1*h.lit_bufsize,h.l_buf=3*h.lit_bufsize,h.level=e,h.strategy=i,h.method=a,J(t)}l=[new M(0,0,0,0,function(t,e){var a=65535;for(a>t.pending_buf_size-5&&(a=t.pending_buf_size-5);;){if(t.lookahead<=1){if(H(t),0===t.lookahead&&e===_)return S;if(0===t.lookahead)break}t.strstart+=t.lookahead,t.lookahead=0;var n=t.block_start+a;if((0===t.strstart||t.strstart>=n)&&(t.lookahead=t.strstart-n,t.strstart=n,T(t,!1),0===t.strm.avail_out))return S;if(t.strstart-t.block_start>=t.w_size-B&&(T(t,!1),0===t.strm.avail_out))return S}return t.insert=0,e===d?(T(t,!0),0===t.strm.avail_out?E:U):(t.strstart>t.block_start&&(T(t,!1),t.strm.avail_out),S)}),new M(4,4,8,4,F),new M(4,5,16,8,F),new M(4,6,32,32,F),new M(4,4,16,16,K),new M(8,16,32,32,K),new M(8,16,128,128,K),new M(8,32,128,256,K),new M(32,128,258,1024,K),new M(32,258,258,4096,K)],a.deflateInit=function(t,e){return Q(t,e,v,15,8,0)},a.deflateInit2=Q,a.deflateReset=J,a.deflateResetKeep=G,a.deflateSetHeader=function(t,e){return t&&t.state?2!==t.state.wrap?g:(t.state.gzhead=e,p):g},a.deflate=function(t,e){var a,n,r,i;if(!t||!t.state||5<e||e<0)return t?D(t,g):g;if(n=t.state,!t.output||!t.input&&0!==t.avail_in||666===n.status&&e!==d)return D(t,0===t.avail_out?-5:g);if(n.strm=t,a=n.last_flush,n.last_flush=e,n.status===A)if(2===n.wrap)t.adler=0,L(n,31),L(n,139),L(n,8),n.gzhead?(L(n,(n.gzhead.text?1:0)+(n.gzhead.hcrc?2:0)+(n.gzhead.extra?4:0)+(n.gzhead.name?8:0)+(n.gzhead.comment?16:0)),L(n,255&n.gzhead.time),L(n,n.gzhead.time>>8&255),L(n,n.gzhead.time>>16&255),L(n,n.gzhead.time>>24&255),L(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),L(n,255&n.gzhead.os),n.gzhead.extra&&n.gzhead.extra.length&&(L(n,255&n.gzhead.extra.length),L(n,n.gzhead.extra.length>>8&255)),n.gzhead.hcrc&&(t.adler=c(t.adler,n.pending_buf,n.pending,0)),n.gzindex=0,n.status=69):(L(n,0),L(n,0),L(n,0),L(n,0),L(n,0),L(n,9===n.level?2:2<=n.strategy||n.level<2?4:0),L(n,3),n.status=C);else{var s=v+(n.w_bits-8<<4)<<8;s|=(2<=n.strategy||n.level<2?0:n.level<6?1:6===n.level?2:3)<<6,0!==n.strstart&&(s|=32),s+=31-s%31,n.status=C,N(n,s),0!==n.strstart&&(N(n,t.adler>>>16),N(n,65535&t.adler)),t.adler=1}if(69===n.status)if(n.gzhead.extra){for(r=n.pending;n.gzindex<(65535&n.gzhead.extra.length)&&(n.pending!==n.pending_buf_size||(n.gzhead.hcrc&&n.pending>r&&(t.adler=c(t.adler,n.pending_buf,n.pending-r,r)),q(t),r=n.pending,n.pending!==n.pending_buf_size));)L(n,255&n.gzhead.extra[n.gzindex]),n.gzindex++;n.gzhead.hcrc&&n.pending>r&&(t.adler=c(t.adler,n.pending_buf,n.pending-r,r)),n.gzindex===n.gzhead.extra.length&&(n.gzindex=0,n.status=73)}else n.status=73;if(73===n.status)if(n.gzhead.name){r=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>r&&(t.adler=c(t.adler,n.pending_buf,n.pending-r,r)),q(t),r=n.pending,n.pending===n.pending_buf_size)){i=1;break}L(n,i=n.gzindex<n.gzhead.name.length?255&n.gzhead.name.charCodeAt(n.gzindex++):0)}while(0!==i);n.gzhead.hcrc&&n.pending>r&&(t.adler=c(t.adler,n.pending_buf,n.pending-r,r)),0===i&&(n.gzindex=0,n.status=91)}else n.status=91;if(91===n.status)if(n.gzhead.comment){r=n.pending;do{if(n.pending===n.pending_buf_size&&(n.gzhead.hcrc&&n.pending>r&&(t.adler=c(t.adler,n.pending_buf,n.pending-r,r)),q(t),r=n.pending,n.pending===n.pending_buf_size)){i=1;break}L(n,i=n.gzindex<n.gzhead.comment.length?255&n.gzhead.comment.charCodeAt(n.gzindex++):0)}while(0!==i);n.gzhead.hcrc&&n.pending>r&&(t.adler=c(t.adler,n.pending_buf,n.pending-r,r)),0===i&&(n.status=103)}else n.status=103;if(103===n.status&&(n.gzhead.hcrc?(n.pending+2>n.pending_buf_size&&q(t),n.pending+2<=n.pending_buf_size&&(L(n,255&t.adler),L(n,t.adler>>8&255),t.adler=0,n.status=C)):n.status=C),0!==n.pending){if(q(t),0===t.avail_out)return n.last_flush=-1,p}else if(0===t.avail_in&&I(e)<=I(a)&&e!==d)return D(t,-5);if(666===n.status&&0!==t.avail_in)return D(t,-5);if(0!==t.avail_in||0!==n.lookahead||e!==_&&666!==n.status){var h=2===n.strategy?function(t,e){for(var a;;){if(0===t.lookahead&&(H(t),0===t.lookahead)){if(e===_)return S;break}if(t.match_length=0,a=o._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++,a&&(T(t,!1),0===t.strm.avail_out))return S}return t.insert=0,e===d?(T(t,!0),0===t.strm.avail_out?E:U):t.last_lit&&(T(t,!1),0===t.strm.avail_out)?S:j}(n,e):3===n.strategy?function(t,e){for(var a,n,r,i,s=t.window;;){if(t.lookahead<=x){if(H(t),t.lookahead<=x&&e===_)return S;if(0===t.lookahead)break}if(t.match_length=0,t.lookahead>=z&&0<t.strstart&&(n=s[r=t.strstart-1])===s[++r]&&n===s[++r]&&n===s[++r]){i=t.strstart+x;do{}while(n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&n===s[++r]&&r<i);t.match_length=x-(i-r),t.match_length>t.lookahead&&(t.match_length=t.lookahead)}if(t.match_length>=z?(a=o._tr_tally(t,1,t.match_length-z),t.lookahead-=t.match_length,t.strstart+=t.match_length,t.match_length=0):(a=o._tr_tally(t,0,t.window[t.strstart]),t.lookahead--,t.strstart++),a&&(T(t,!1),0===t.strm.avail_out))return S}return t.insert=0,e===d?(T(t,!0),0===t.strm.avail_out?E:U):t.last_lit&&(T(t,!1),0===t.strm.avail_out)?S:j}(n,e):l[n.level].func(n,e);if(h!==E&&h!==U||(n.status=666),h===S||h===E)return 0===t.avail_out&&(n.last_flush=-1),p;if(h===j&&(1===e?o._tr_align(n):5!==e&&(o._tr_stored_block(n,0,0,!1),3===e&&(O(n.head),0===n.lookahead&&(n.strstart=0,n.block_start=0,n.insert=0))),q(t),0===t.avail_out))return n.last_flush=-1,p}return e!==d?p:n.wrap<=0?1:(2===n.wrap?(L(n,255&t.adler),L(n,t.adler>>8&255),L(n,t.adler>>16&255),L(n,t.adler>>24&255),L(n,255&t.total_in),L(n,t.total_in>>8&255),L(n,t.total_in>>16&255),L(n,t.total_in>>24&255)):(N(n,t.adler>>>16),N(n,65535&t.adler)),q(t),0<n.wrap&&(n.wrap=-n.wrap),0!==n.pending?p:1)},a.deflateEnd=function(t){var e;return t&&t.state?(e=t.state.status)!==A&&69!==e&&73!==e&&91!==e&&103!==e&&e!==C&&666!==e?D(t,g):(t.state=null,e===C?D(t,-3):p):g},a.deflateSetDictionary=function(t,e){var a,n,r,i,s,h,l,o,_=e.length;if(!t||!t.state)return g;if(2===(i=(a=t.state).wrap)||1===i&&a.status!==A||a.lookahead)return g;for(1===i&&(t.adler=f(t.adler,e,_,0)),a.wrap=0,_>=a.w_size&&(0===i&&(O(a.head),a.strstart=0,a.block_start=0,a.insert=0),o=new u.Buf8(a.w_size),u.arraySet(o,e,_-a.w_size,a.w_size,0),e=o,_=a.w_size),s=t.avail_in,h=t.next_in,l=t.input,t.avail_in=_,t.next_in=0,t.input=e,H(a);a.lookahead>=z;){for(n=a.strstart,r=a.lookahead-(z-1);a.ins_h=(a.ins_h<<a.hash_shift^a.window[n+z-1])&a.hash_mask,a.prev[n&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=n,n++,--r;);a.strstart=n,a.lookahead=z-1,H(a)}return a.strstart+=a.lookahead,a.block_start=a.strstart,a.insert=a.lookahead,a.lookahead=0,a.match_length=a.prev_length=z-1,a.match_available=0,t.next_in=h,t.input=l,t.avail_in=s,a.wrap=i,p},a.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":1,"./adler32":3,"./crc32":4,"./messages":6,"./trees":7}],6:[function(t,e,a){"use strict";e.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],7:[function(t,e,a){"use strict";var l=t("../utils/common"),h=0,o=1;function n(t){for(var e=t.length;0<=--e;)t[e]=0}var _=0,s=29,d=256,u=d+1+s,f=30,c=19,g=2*u+1,m=15,r=16,p=7,b=256,v=16,w=17,y=18,k=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],z=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],x=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],B=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],A=new Array(2*(u+2));n(A);var C=new Array(2*f);n(C);var S=new Array(512);n(S);var j=new Array(256);n(j);var E=new Array(s);n(E);var U,D,I,O=new Array(f);function q(t,e,a,n,r){this.static_tree=t,this.extra_bits=e,this.extra_base=a,this.elems=n,this.max_length=r,this.has_stree=t&&t.length}function i(t,e){this.dyn_tree=t,this.max_code=0,this.stat_desc=e}function T(t){return t<256?S[t]:S[256+(t>>>7)]}function L(t,e){t.pending_buf[t.pending++]=255&e,t.pending_buf[t.pending++]=e>>>8&255}function N(t,e,a){t.bi_valid>r-a?(t.bi_buf|=e<<t.bi_valid&65535,L(t,t.bi_buf),t.bi_buf=e>>r-t.bi_valid,t.bi_valid+=a-r):(t.bi_buf|=e<<t.bi_valid&65535,t.bi_valid+=a)}function R(t,e,a){N(t,a[2*e],a[2*e+1])}function H(t,e){for(var a=0;a|=1&t,t>>>=1,a<<=1,0<--e;);return a>>>1}function F(t,e,a){var n,r,i=new Array(m+1),s=0;for(n=1;n<=m;n++)i[n]=s=s+a[n-1]<<1;for(r=0;r<=e;r++){var h=t[2*r+1];0!==h&&(t[2*r]=H(i[h]++,h))}}function K(t){var e;for(e=0;e<u;e++)t.dyn_ltree[2*e]=0;for(e=0;e<f;e++)t.dyn_dtree[2*e]=0;for(e=0;e<c;e++)t.bl_tree[2*e]=0;t.dyn_ltree[2*b]=1,t.opt_len=t.static_len=0,t.last_lit=t.matches=0}function M(t){8<t.bi_valid?L(t,t.bi_buf):0<t.bi_valid&&(t.pending_buf[t.pending++]=t.bi_buf),t.bi_buf=0,t.bi_valid=0}function P(t,e,a,n){var r=2*e,i=2*a;return t[r]<t[i]||t[r]===t[i]&&n[e]<=n[a]}function G(t,e,a){for(var n=t.heap[a],r=a<<1;r<=t.heap_len&&(r<t.heap_len&&P(e,t.heap[r+1],t.heap[r],t.depth)&&r++,!P(e,n,t.heap[r],t.depth));)t.heap[a]=t.heap[r],a=r,r<<=1;t.heap[a]=n}function J(t,e,a){var n,r,i,s,h=0;if(0!==t.last_lit)for(;n=t.pending_buf[t.d_buf+2*h]<<8|t.pending_buf[t.d_buf+2*h+1],r=t.pending_buf[t.l_buf+h],h++,0===n?R(t,r,e):(R(t,(i=j[r])+d+1,e),0!==(s=k[i])&&N(t,r-=E[i],s),R(t,i=T(--n),a),0!==(s=z[i])&&N(t,n-=O[i],s)),h<t.last_lit;);R(t,b,e)}function Q(t,e){var a,n,r,i=e.dyn_tree,s=e.stat_desc.static_tree,h=e.stat_desc.has_stree,l=e.stat_desc.elems,o=-1;for(t.heap_len=0,t.heap_max=g,a=0;a<l;a++)0!==i[2*a]?(t.heap[++t.heap_len]=o=a,t.depth[a]=0):i[2*a+1]=0;for(;t.heap_len<2;)i[2*(r=t.heap[++t.heap_len]=o<2?++o:0)]=1,t.depth[r]=0,t.opt_len--,h&&(t.static_len-=s[2*r+1]);for(e.max_code=o,a=t.heap_len>>1;1<=a;a--)G(t,i,a);for(r=l;a=t.heap[1],t.heap[1]=t.heap[t.heap_len--],G(t,i,1),n=t.heap[1],t.heap[--t.heap_max]=a,t.heap[--t.heap_max]=n,i[2*r]=i[2*a]+i[2*n],t.depth[r]=(t.depth[a]>=t.depth[n]?t.depth[a]:t.depth[n])+1,i[2*a+1]=i[2*n+1]=r,t.heap[1]=r++,G(t,i,1),2<=t.heap_len;);t.heap[--t.heap_max]=t.heap[1],function(t,e){var a,n,r,i,s,h,l=e.dyn_tree,o=e.max_code,_=e.stat_desc.static_tree,d=e.stat_desc.has_stree,u=e.stat_desc.extra_bits,f=e.stat_desc.extra_base,c=e.stat_desc.max_length,p=0;for(i=0;i<=m;i++)t.bl_count[i]=0;for(l[2*t.heap[t.heap_max]+1]=0,a=t.heap_max+1;a<g;a++)c<(i=l[2*l[2*(n=t.heap[a])+1]+1]+1)&&(i=c,p++),l[2*n+1]=i,o<n||(t.bl_count[i]++,s=0,f<=n&&(s=u[n-f]),h=l[2*n],t.opt_len+=h*(i+s),d&&(t.static_len+=h*(_[2*n+1]+s)));if(0!==p){do{for(i=c-1;0===t.bl_count[i];)i--;t.bl_count[i]--,t.bl_count[i+1]+=2,t.bl_count[c]--,p-=2}while(0<p);for(i=c;0!==i;i--)for(n=t.bl_count[i];0!==n;)o<(r=t.heap[--a])||(l[2*r+1]!==i&&(t.opt_len+=(i-l[2*r+1])*l[2*r],l[2*r+1]=i),n--)}}(t,e),F(i,o,t.bl_count)}function V(t,e,a){var n,r,i=-1,s=e[1],h=0,l=7,o=4;for(0===s&&(l=138,o=3),e[2*(a+1)+1]=65535,n=0;n<=a;n++)r=s,s=e[2*(n+1)+1],++h<l&&r===s||(h<o?t.bl_tree[2*r]+=h:0!==r?(r!==i&&t.bl_tree[2*r]++,t.bl_tree[2*v]++):h<=10?t.bl_tree[2*w]++:t.bl_tree[2*y]++,i=r,(h=0)===s?(l=138,o=3):r===s?(l=6,o=3):(l=7,o=4))}function W(t,e,a){var n,r,i=-1,s=e[1],h=0,l=7,o=4;for(0===s&&(l=138,o=3),n=0;n<=a;n++)if(r=s,s=e[2*(n+1)+1],!(++h<l&&r===s)){if(h<o)for(;R(t,r,t.bl_tree),0!=--h;);else 0!==r?(r!==i&&(R(t,r,t.bl_tree),h--),R(t,v,t.bl_tree),N(t,h-3,2)):h<=10?(R(t,w,t.bl_tree),N(t,h-3,3)):(R(t,y,t.bl_tree),N(t,h-11,7));i=r,(h=0)===s?(l=138,o=3):r===s?(l=6,o=3):(l=7,o=4)}}n(O);var X=!1;function Y(t,e,a,n){var r,i,s,h;N(t,(_<<1)+(n?1:0),3),i=e,s=a,h=!0,M(r=t),h&&(L(r,s),L(r,~s)),l.arraySet(r.pending_buf,r.window,i,s,r.pending),r.pending+=s}a._tr_init=function(t){X||(function(){var t,e,a,n,r,i=new Array(m+1);for(n=a=0;n<s-1;n++)for(E[n]=a,t=0;t<1<<k[n];t++)j[a++]=n;for(j[a-1]=n,n=r=0;n<16;n++)for(O[n]=r,t=0;t<1<<z[n];t++)S[r++]=n;for(r>>=7;n<f;n++)for(O[n]=r<<7,t=0;t<1<<z[n]-7;t++)S[256+r++]=n;for(e=0;e<=m;e++)i[e]=0;for(t=0;t<=143;)A[2*t+1]=8,t++,i[8]++;for(;t<=255;)A[2*t+1]=9,t++,i[9]++;for(;t<=279;)A[2*t+1]=7,t++,i[7]++;for(;t<=287;)A[2*t+1]=8,t++,i[8]++;for(F(A,u+1,i),t=0;t<f;t++)C[2*t+1]=5,C[2*t]=H(t,5);U=new q(A,k,d+1,u,m),D=new q(C,z,0,f,m),I=new q(new Array(0),x,0,c,p)}(),X=!0),t.l_desc=new i(t.dyn_ltree,U),t.d_desc=new i(t.dyn_dtree,D),t.bl_desc=new i(t.bl_tree,I),t.bi_buf=0,t.bi_valid=0,K(t)},a._tr_stored_block=Y,a._tr_flush_block=function(t,e,a,n){var r,i,s=0;0<t.level?(2===t.strm.data_type&&(t.strm.data_type=function(t){var e,a=4093624447;for(e=0;e<=31;e++,a>>>=1)if(1&a&&0!==t.dyn_ltree[2*e])return h;if(0!==t.dyn_ltree[18]||0!==t.dyn_ltree[20]||0!==t.dyn_ltree[26])return o;for(e=32;e<d;e++)if(0!==t.dyn_ltree[2*e])return o;return h}(t)),Q(t,t.l_desc),Q(t,t.d_desc),s=function(t){var e;for(V(t,t.dyn_ltree,t.l_desc.max_code),V(t,t.dyn_dtree,t.d_desc.max_code),Q(t,t.bl_desc),e=c-1;3<=e&&0===t.bl_tree[2*B[e]+1];e--);return t.opt_len+=3*(e+1)+5+5+4,e}(t),r=t.opt_len+3+7>>>3,(i=t.static_len+3+7>>>3)<=r&&(r=i)):r=i=a+5,a+4<=r&&-1!==e?Y(t,e,a,n):4===t.strategy||i===r?(N(t,2+(n?1:0),3),J(t,A,C)):(N(t,4+(n?1:0),3),function(t,e,a,n){var r;for(N(t,e-257,5),N(t,a-1,5),N(t,n-4,4),r=0;r<n;r++)N(t,t.bl_tree[2*B[r]+1],3);W(t,t.dyn_ltree,e-1),W(t,t.dyn_dtree,a-1)}(t,t.l_desc.max_code+1,t.d_desc.max_code+1,s+1),J(t,t.dyn_ltree,t.dyn_dtree)),K(t),n&&M(t)},a._tr_tally=function(t,e,a){return t.pending_buf[t.d_buf+2*t.last_lit]=e>>>8&255,t.pending_buf[t.d_buf+2*t.last_lit+1]=255&e,t.pending_buf[t.l_buf+t.last_lit]=255&a,t.last_lit++,0===e?t.dyn_ltree[2*a]++:(t.matches++,e--,t.dyn_ltree[2*(j[a]+d+1)]++,t.dyn_dtree[2*T(e)]++),t.last_lit===t.lit_bufsize-1},a._tr_align=function(t){var e;N(t,2,3),R(t,b,A),16===(e=t).bi_valid?(L(e,e.bi_buf),e.bi_buf=0,e.bi_valid=0):8<=e.bi_valid&&(e.pending_buf[e.pending++]=255&e.bi_buf,e.bi_buf>>=8,e.bi_valid-=8)}},{"../utils/common":1}],8:[function(t,e,a){"use strict";e.exports=function(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}},{}],"/lib/deflate.js":[function(t,e,a){"use strict";var s=t("./zlib/deflate"),h=t("./utils/common"),l=t("./utils/strings"),r=t("./zlib/messages"),i=t("./zlib/zstream"),o=Object.prototype.toString,_=0,d=-1,u=0,f=8;function c(t){if(!(this instanceof c))return new c(t);this.options=h.assign({level:d,method:f,chunkSize:16384,windowBits:15,memLevel:8,strategy:u,to:""},t||{});var e=this.options;e.raw&&0<e.windowBits?e.windowBits=-e.windowBits:e.gzip&&0<e.windowBits&&e.windowBits<16&&(e.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new i,this.strm.avail_out=0;var a=s.deflateInit2(this.strm,e.level,e.method,e.windowBits,e.memLevel,e.strategy);if(a!==_)throw new Error(r[a]);if(e.header&&s.deflateSetHeader(this.strm,e.header),e.dictionary){var n;if(n="string"==typeof e.dictionary?l.string2buf(e.dictionary):"[object ArrayBuffer]"===o.call(e.dictionary)?new Uint8Array(e.dictionary):e.dictionary,(a=s.deflateSetDictionary(this.strm,n))!==_)throw new Error(r[a]);this._dict_set=!0}}function n(t,e){var a=new c(e);if(a.push(t,!0),a.err)throw a.msg||r[a.err];return a.result}c.prototype.push=function(t,e){var a,n,r=this.strm,i=this.options.chunkSize;if(this.ended)return!1;n=e===~~e?e:!0===e?4:0,"string"==typeof t?r.input=l.string2buf(t):"[object ArrayBuffer]"===o.call(t)?r.input=new Uint8Array(t):r.input=t,r.next_in=0,r.avail_in=r.input.length;do{if(0===r.avail_out&&(r.output=new h.Buf8(i),r.next_out=0,r.avail_out=i),1!==(a=s.deflate(r,n))&&a!==_)return this.onEnd(a),!(this.ended=!0);0!==r.avail_out&&(0!==r.avail_in||4!==n&&2!==n)||("string"===this.options.to?this.onData(l.buf2binstring(h.shrinkBuf(r.output,r.next_out))):this.onData(h.shrinkBuf(r.output,r.next_out)))}while((0<r.avail_in||0===r.avail_out)&&1!==a);return 4===n?(a=s.deflateEnd(this.strm),this.onEnd(a),this.ended=!0,a===_):2!==n||(this.onEnd(_),!(r.avail_out=0))},c.prototype.onData=function(t){this.chunks.push(t)},c.prototype.onEnd=function(t){t===_&&("string"===this.options.to?this.result=this.chunks.join(""):this.result=h.flattenChunks(this.chunks)),this.chunks=[],this.err=t,this.msg=this.strm.msg},a.Deflate=c,a.deflate=n,a.deflateRaw=function(t,e){return(e=e||{}).raw=!0,n(t,e)},a.gzip=function(t,e){return(e=e||{}).gzip=!0,n(t,e)}},{"./utils/common":1,"./utils/strings":2,"./zlib/deflate":5,"./zlib/messages":6,"./zlib/zstream":8}]},{},[])("/lib/deflate.js")});