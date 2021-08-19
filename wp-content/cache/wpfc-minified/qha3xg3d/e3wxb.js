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