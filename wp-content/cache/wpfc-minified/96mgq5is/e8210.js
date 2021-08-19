(function($, wp){
var api=wp.customize;
api.HeaderTool={};
api.HeaderTool.ImageModel=Backbone.Model.extend({
defaults: function(){
return {
header: {
attachment_id: 0,
url: '',
timestamp: _.now(),
thumbnail_url: ''
},
choice: '',
selected: false,
random: false
};},
initialize: function(){
this.on('hide', this.hide, this);
},
hide: function(){
this.set('choice', '');
api('header_image').set('remove-header');
api('header_image_data').set('remove-header');
},
destroy: function(){
var data=this.get('header'),
curr=api.HeaderTool.currentHeader.get('header').attachment_id;
if(curr&&data.attachment_id===curr){
api.HeaderTool.currentHeader.trigger('hide');
}
wp.ajax.post('custom-header-remove', {
nonce: _wpCustomizeHeader.nonces.remove,
wp_customize: 'on',
theme: api.settings.theme.stylesheet,
attachment_id: data.attachment_id
});
this.trigger('destroy', this, this.collection);
},
save: function(){
if(this.get('random')){
api('header_image').set(this.get('header').random);
api('header_image_data').set(this.get('header').random);
}else{
if(this.get('header').defaultName){
api('header_image').set(this.get('header').url);
api('header_image_data').set(this.get('header').defaultName);
}else{
api('header_image').set(this.get('header').url);
api('header_image_data').set(this.get('header'));
}}
api.HeaderTool.combinedList.trigger('control:setImage', this);
},
importImage: function(){
var data=this.get('header');
if(data.attachment_id===undefined){
return;
}
wp.ajax.post('custom-header-add', {
nonce: _wpCustomizeHeader.nonces.add,
wp_customize: 'on',
theme: api.settings.theme.stylesheet,
attachment_id: data.attachment_id
});
},
shouldBeCropped: function(){
if(this.get('themeFlexWidth')===true &&
this.get('themeFlexHeight')===true){
return false;
}
if(this.get('themeFlexWidth')===true &&
this.get('themeHeight')===this.get('imageHeight')){
return false;
}
if(this.get('themeFlexHeight')===true &&
this.get('themeWidth')===this.get('imageWidth')){
return false;
}
if(this.get('themeWidth')===this.get('imageWidth') &&
this.get('themeHeight')===this.get('imageHeight')){
return false;
}
if(this.get('imageWidth') <=this.get('themeWidth')){
return false;
}
return true;
}});
api.HeaderTool.ChoiceList=Backbone.Collection.extend({
model: api.HeaderTool.ImageModel,
comparator: function(model){
return -model.get('header').timestamp;
},
initialize: function(){
var current=api.HeaderTool.currentHeader.get('choice').replace(/^https?:\/\//, ''),
isRandom=this.isRandomChoice(api.get().header_image);
if(!this.type){
this.type='uploaded';
}
if(typeof this.data==='undefined'){
this.data=_wpCustomizeHeader.uploads;
}
if(isRandom){
current=api.get().header_image;
}
this.on('control:setImage', this.setImage, this);
this.on('control:removeImage', this.removeImage, this);
this.on('add', this.maybeRemoveOldCrop, this);
this.on('add', this.maybeAddRandomChoice, this);
_.each(this.data, function(elt, index){
if(!elt.attachment_id){
elt.defaultName=index;
}
if(typeof elt.timestamp==='undefined'){
elt.timestamp=0;
}
this.add({
header: elt,
choice: elt.url.split('/').pop(),
selected: current===elt.url.replace(/^https?:\/\//, '')
}, { silent: true });
}, this);
if(this.size() > 0){
this.addRandomChoice(current);
}},
maybeRemoveOldCrop: function(model){
var newID=model.get('header').attachment_id||false,
oldCrop;
if(! newID){
return;
}
oldCrop=this.find(function(item){
return(item.cid!==model.cid&&item.get('header').attachment_id===newID);
});
if(oldCrop){
this.remove(oldCrop);
}},
maybeAddRandomChoice: function(){
if(this.size()===1){
this.addRandomChoice();
}},
addRandomChoice: function(initialChoice){
var isRandomSameType=RegExp(this.type).test(initialChoice),
randomChoice='random-' + this.type + '-image';
this.add({
header: {
timestamp: 0,
random: randomChoice,
width: 245,
height: 41
},
choice: randomChoice,
random: true,
selected: isRandomSameType
});
},
isRandomChoice: function(choice){
return (/^random-(uploaded|default)-image$/).test(choice);
},
shouldHideTitle: function(){
return this.size() < 2;
},
setImage: function(model){
this.each(function(m){
m.set('selected', false);
});
if(model){
model.set('selected', true);
}},
removeImage: function(){
this.each(function(m){
m.set('selected', false);
});
}});
api.HeaderTool.DefaultsList=api.HeaderTool.ChoiceList.extend({
initialize: function(){
this.type='default';
this.data=_wpCustomizeHeader.defaults;
api.HeaderTool.ChoiceList.prototype.initialize.apply(this);
}});
})(jQuery, window.wp);