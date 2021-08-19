jQuery(function($){
$('.tips').tooltip();
$('ul.order-status').on('click', 'a.dokan-edit-status', function(e){
$(this).addClass('dokan-hide').closest('li').next('li').removeClass('dokan-hide');
return false;
});
$('ul.order-status').on('click', 'a.dokan-cancel-status', function(e){
$(this).closest('li').addClass('dokan-hide').prev('li').find('a.dokan-edit-status').removeClass('dokan-hide');
return false;
});
$('form#dokan-order-status-form').on('submit', function(e){
e.preventDefault();
var self=$(this),
li=self.closest('li');
li.block({ message: null, overlayCSS: { background: '#fff url(' + dokan.ajax_loader + ') no-repeat center', opacity: 0.6 }});
$.post(dokan.ajaxurl, self.serialize(), function(response){
li.unblock();
if(response.success){
var prev_li=li.prev();
li.addClass('dokan-hide');
prev_li.find('label').replaceWith(response.data);
prev_li.find('a.dokan-edit-status').removeClass('dokan-hide');
}else{
alert(response.data);
}});
});
$('form#add-order-note').on('submit', function(e){
e.preventDefault();
if(!$('textarea#add-note-content').val()) return;
$('#dokan-order-notes').block({ message: null, overlayCSS: { background: '#fff url(' + dokan.ajax_loader + ') no-repeat center', opacity: 0.6 }});
$.post(dokan.ajaxurl, $(this).serialize(), function(response){
$('ul.order_notes').prepend(response);
$('#dokan-order-notes').unblock();
$('#add-note-content').val('');
});
return false;
})
$('#dokan-order-notes').on('click', 'a.delete_note', function(){
var note=$(this).closest('li.note');
$('#dokan-order-notes').block({ message: null, overlayCSS: { background: '#fff url(' + dokan.ajax_loader + ') no-repeat center', opacity: 0.6 }});
var data={
action: 'dokan_delete_order_note',
note_id: $(note).attr('rel'),
security: $('#delete-note-security').val()
};
$.post(dokan.ajaxurl, data, function(response){
$(note).remove();
$('#dokan-order-notes').unblock();
});
return false;
});
$('.order_download_permissions').on('click', 'button.grant_access', function(){
var self=$(this),
product=$('select.grant_access_id').val();
if(!product) return;
$('.order_download_permissions').block({ message: null, overlayCSS: { background: '#fff url(' + dokan.ajax_loader + ') no-repeat center', opacity: 0.6 }});
var data={
action: 'dokan_grant_access_to_download',
product_ids: product,
loop: $('.order_download_permissions .panel').size(),
order_id: self.data('order-id'),
security: self.data('nonce')
};
$.post(dokan.ajaxurl, data, function(response){
if(response){
$('#accordion').append(response);
}else{
alert('Could not grant access - the user may already have permission for this file or billing email is not set. Ensure the billing email is set, and the order has been saved.');
}
$('.datepicker').datepicker();
$('.order_download_permissions').unblock();
});
return false;
});
$('.order_download_permissions').on('click', 'button.revoke_access', function(e){
e.preventDefault();
var answer=confirm('Are you sure you want to revoke access to this download?');
if(answer){
var self=$(this),
el=self.closest('.dokan-panel');
var product=self.attr('rel').split(",")[0];
var file=self.attr('rel').split(",")[1];
if(product > 0){
$(el).block({ message: null, overlayCSS: { background: '#fff url(' + dokan.ajax_loader + ') no-repeat center', opacity: 0.6 }});
var data={
action: 'dokan_revoke_access_to_download',
product_id: product,
download_id: file,
order_id: self.data('order-id'),
permission_id: self.data('permission-id'),
security: self.data('nonce')
};
$.post(dokan.ajaxurl, data, function(response){
$(el).fadeOut('300', function(){
$(el).remove();
});
});
}else{
$(el).fadeOut('300', function(){
$(el).remove();
});
}}
return false;
});
});
;(function($){
var dokan_seller_meta_boxes_order_items={
init: function(){
let formatMap={
d: 'dd',
D: 'D',
j: 'd',
l: 'DD',
F: 'MM',
m: 'mm',
M: 'M',
n: 'm',
o: 'yy',
Y: 'yy',
y: 'y'
}
let i=0;
let char='';
let datepickerFormat='';
for (i=0; i < dokan.i18n_date_format.length; i++){
char=dokan.i18n_date_format[i];
if(char in formatMap){
datepickerFormat +=formatMap[char];
}else{
datepickerFormat +=char;
}}
$("#shipped-date").datepicker({
dateFormat: datepickerFormat
});
$('body').on('click','#dokan-add-tracking-number', this.showTrackingForm);
$('body').on('click','#dokan-cancel-tracking-note', this.cancelTrackingForm);
$('body').on('click','#add-tracking-details', this.insertShippingTrackingInfo);
$('#woocommerce-order-items')
.on('click', 'button.refund-items', this.refund_items)
.on('click', '.cancel-action', this.cancel)
.on('click', 'button.do-api-refund, button.do-manual-refund', this.refunds.do_refund)
.on('change', '.refund input.refund_line_total, .refund input.refund_line_tax', this.refunds.input_changed)
.on('change keyup', '.wc-order-refund-items #refund_amount', this.refunds.amount_changed)
.on('change', 'input.refund_order_item_qty', this.refunds.refund_quantity_changed)
.on('keyup', '.woocommerce_order_items .split-input input:eq(0)', function(){
var $subtotal=$(this).next();
if($subtotal.val()===''||$subtotal.is('.match-total')){
$subtotal.val($(this).val()).addClass('match-total');
}})
.on('keyup', '.woocommerce_order_items .split-input input:eq(1)', function(){
$(this).removeClass('match-total');
})
},
showTrackingForm: function(e){
e.preventDefault();
var self=$(this);
self.closest('div').find('form#add-shipping-tracking-form').slideDown(300, function(){
$(this).removeClass('dokan-hide');
});
},
cancelTrackingForm: function(e){
e.preventDefault();
var self=$(this);
self.closest('form#add-shipping-tracking-form').slideUp(300, function(){
$(this).addClass('dokan-hide');
});
},
insertShippingTrackingInfo: function(e){
e.preventDefault();
var shipping_tracking_info={
shipping_provider: $('#shipping_provider').val(),
shipping_number: $('#tracking_number').val(),
shipped_date: $('#shipped-date').val(),
action: $('#action').val(),
post_id: $('#post-id').val(),
security: $('#security').val()
};
$('#dokan-order-notes').block({ message: null, overlayCSS: { background: '#fff url(' + dokan.ajax_loader + ') no-repeat center', opacity: 0.6 }});
$.post(dokan.ajaxurl, shipping_tracking_info, function(response){
$('ul.order_notes').prepend(response);
$('#dokan-order-notes').unblock();
$('form#add-shipping-tracking-form').find("input[type=text], textarea").val("");
});
return false;
},
block: function(){
$('#woocommerce-order-items').block({
message: null,
overlayCSS: {
background: '#fff',
opacity: 0.6
}});
},
unblock: function(){
$('#woocommerce-order-items').unblock();
},
reload_items: function(){
var data={
order_id: dokan_refund.post_id,
action:   'dokan_load_order_items',
security: dokan_refund.order_item_nonce
};
dokan_seller_meta_boxes_order_items.block();
$.ajax({
url:  dokan_refund.ajax_url,
data: data,
type: 'POST',
success: function(response){
$('.dokan-panel-default #woocommerce-order-items').empty();
$('.dokan-panel-default #woocommerce-order-items').append(response);
}});
},
refund_items: function(){
$('div.wc-order-refund-items').slideDown();
$('div.wc-order-bulk-actions').slideUp();
$('div.wc-order-totals-items').slideUp();
$('#woocommerce-order-items div.refund').show();
$('.wc-order-edit-line-item .wc-order-edit-line-item-actions').hide();
return false;
},
cancel: function(){
$(this).closest('div.wc-order-data-row').slideUp();
$('div.wc-order-bulk-actions').slideDown();
$('div.wc-order-totals-items').slideDown();
$('#woocommerce-order-items div.refund').hide();
$('.wc-order-edit-line-item .wc-order-edit-line-item-actions').show();
if('true'===$(this).attr('data-reload')){
dokan_seller_meta_boxes_order_items.reload_items();
}
return false;
},
refunds: {
do_refund: function(){
dokan_seller_meta_boxes_order_items.block();
if(window.confirm(dokan_refund.i18n_do_refund)){
var refund_amount=$('input#refund_amount').val();
var refund_reason=$('input#refund_reason').val();
var line_item_qtys={};
var line_item_totals={};
var line_item_tax_totals={};
$('.refund input.refund_order_item_qty').each(function(index, item){
if($(item).closest('tr').data('order_item_id')){
if(item.value){
line_item_qtys[ $(item).closest('tr').data('order_item_id') ]=item.value;
}}
});
$('.refund input.refund_line_total').each(function(index, item){
if($(item).closest('tr').data('order_item_id')){
line_item_totals[ $(item).closest('tr').data('order_item_id') ]=accounting.unformat(item.value, dokan_refund.mon_decimal_point);
}});
$('.refund input.refund_line_tax').each(function(index, item){
if($(item).closest('tr').data('order_item_id')){
var tax_id=$(item).data('tax_id');
if(! line_item_tax_totals[ $(item).closest('tr').data('order_item_id') ]){
line_item_tax_totals[ $(item).closest('tr').data('order_item_id') ]={};}
line_item_tax_totals[ $(item).closest('tr').data('order_item_id') ][ tax_id ]=accounting.unformat(item.value, dokan_refund.mon_decimal_point);
}});
var data={
action:                 'dokan_refund_request',
order_id:               dokan_refund.post_id,
refund_amount:          refund_amount,
refund_reason:          refund_reason,
line_item_qtys:         JSON.stringify(line_item_qtys, null, ''),
line_item_totals:       JSON.stringify(line_item_totals, null, ''),
line_item_tax_totals:   JSON.stringify(line_item_tax_totals, null, ''),
api_refund:             $(this).is('.do-api-refund'),
restock_refunded_items: $('#restock_refunded_items:checked').size() ? 'true':'false',
security:               dokan_refund.order_item_nonce
};
$.post(dokan_refund.ajax_url, data, function(response){
response.data.message ? window.alert(response.data.message):null;
dokan_seller_meta_boxes_order_items.reload_items();
}).fail(function(jqXHR){
var message=[];
if(jqXHR.responseJSON.data){
var data=jqXHR.responseJSON.data;
if($.isArray(data)){
message=jqXHR.responseJSON.data.map(function(item){
return item.message;
});
}else{
message.push(data);
}}
window.alert(message.join(' '));
dokan_seller_meta_boxes_order_items.unblock();
});
}else{
dokan_seller_meta_boxes_order_items.unblock();
}},
input_changed: function(){
var refund_amount=0;
var $items=$('.woocommerce_order_items').find('tr.item, tr.fee, tr.shipping');
$items.each(function(){
var $row=$(this);
var refund_cost_fields=$row.find('.refund input:not(.refund_order_item_qty)');
refund_cost_fields.each(function(index, el){
refund_amount +=parseFloat(accounting.unformat($(el).val()||0, dokan_refund.mon_decimal_point));
});
});
$('#refund_amount')
.val(accounting.formatNumber(refund_amount,
dokan_refund.currency_format_num_decimals,
'',
dokan_refund.mon_decimal_point
))
.change();
},
amount_changed: function(){
var total=accounting.unformat($(this).val(), dokan_refund.mon_decimal_point);
$('button .wc-order-refund-amount .amount').text(accounting.formatMoney(total, {
symbol:    dokan_refund.currency_format_symbol,
decimal:   dokan_refund.currency_format_decimal_sep,
thousand:  dokan_refund.currency_format_thousand_sep,
precision: dokan_refund.currency_format_num_decimals,
format:    dokan_refund.currency_format
}));
},
refund_quantity_changed: function(){
var $row=$(this).closest('tr.item');
var qty=$row.find('input.quantity').val();
var refund_qty=$(this).val();
var line_total=$('input.line_total', $row);
var refund_line_total=$('input.refund_line_total', $row);
var unit_total=accounting.unformat(line_total.attr('data-total'), dokan_refund.mon_decimal_point) / qty;
refund_line_total.val(parseFloat(accounting.formatNumber(unit_total * refund_qty, dokan_refund.rounding_precision, ''))
.toString()
.replace('.', dokan_refund.mon_decimal_point)
).change();
$('td.line_tax', $row).each(function(){
var line_total_tax=$('input.line_tax', $(this));
var refund_line_total_tax=$('input.refund_line_tax', $(this));
var unit_total_tax=accounting.unformat(line_total_tax.attr('data-total_tax'), dokan_refund.mon_decimal_point) / qty;
if(0 < unit_total_tax){
refund_line_total_tax.val(parseFloat(accounting.formatNumber(unit_total_tax * refund_qty, dokan_refund.rounding_precision, ''))
.toString()
.replace('.', dokan_refund.mon_decimal_point)
).change();
}else{
refund_line_total_tax.val(0).change();
}});
if(refund_qty > 0){
$('#restock_refunded_items').closest('tr').show();
}else{
$('#restock_refunded_items').closest('tr').hide();
$('.woocommerce_order_items input.refund_order_item_qty').each(function(){
if($(this).val() > 0){
$('#restock_refunded_items').closest('tr').show();
}});
}
$(this).trigger('refund_quantity_changed');
}},
};
dokan_seller_meta_boxes_order_items.init();
$('#dokan-filter-customer').filter(':not(.enhanced)').each(function(){
var select2_args={
allowClear:  $(this).data('allow_clear') ? true:false,
placeholder: $(this).data('placeholder'),
minimumInputLength: $(this).data('minimum_input_length') ? $(this).data('minimum_input_length'):'1',
escapeMarkup: function(m){
return m;
},
ajax: {
url:         dokan.ajaxurl,
dataType:    'json',
delay:       1000,
data:        function(params){
return {
term:     params.term,
action:   'dokan_json_search_vendor_customers',
security: dokan.search_customer_nonce,
exclude:  $(this).data('exclude')
};},
processResults: function(data){
var terms=[];
if(data){
$.each(data, function(id, text){
terms.push({
id: id,
text: text
});
});
}
return {
results: terms
};},
cache: true
}};
$(this).select2(select2_args).addClass('enhanced');
if($(this).data('sortable')){
var $select=$(this);
var $list=$(this).next('.select2-container').find('ul.select2-selection__rendered');
$list.sortable({
placeholder:'ui-state-highlight select2-selection__choice',
forcePlaceholderSize: true,
items:'li:not(.select2-search__field)',
tolerance:'pointer',
stop: function(){
$($list.find('.select2-selection__choice').get().reverse()).each(function(){
var id=$(this).data('data').id;
var option=$select.find('option[value="' + id + '"]')[0];
$select.prepend(option);
});
}});
}});
})(jQuery);
;(function($){
var variantsHolder=$('#variants-holder');
var product_gallery_frame;
var product_featured_frame;
var $image_gallery_ids=$('#product_image_gallery');
var $product_images=$('#product_images_container ul.product_images');
var Dokan_Editor={
init: function(){
product_type='simple';
$('.product-edit-container').on('click', '.dokan-section-heading', this.toggleProductSection);
$('.product-edit-container').on('click', 'input[type=checkbox]#_downloadable', this.downloadable);
$('.product-edit-container').on('click', 'a.sale-schedule', this.showDiscountSchedule);
$('body, #dokan-product-images').on('click', 'a.add-product-images', this.gallery.addImages);
$('body, #dokan-product-images').on('click', 'a.action-delete', this.gallery.deleteImage);
this.gallery.sortable();
$('body, .product-edit-container').on('click', 'a.dokan-feat-image-btn', this.featuredImage.addImage);
$('body, .product-edit-container').on('click', 'a.dokan-remove-feat-image', this.featuredImage.removeImage);
$('body, #variable_product_options').on('click', '.sale_schedule', this.saleSchedule);
$('body, #variable_product_options').on('click', '.cancel_sale_schedule', this.cancelSchedule);
$('.product-edit-container').on('change', 'input[type=checkbox]#_manage_stock', this.showManageStock);
$('.product-edit-container').on('click', 'a.upload_file_button', this.fileDownloadable);
$('body').on('click', 'a.insert-file-row', function(){
$(this).closest('table').find('tbody').append($(this).data('row'));
return false;
});
$('body').on('click', 'a.dokan-product-delete', function(){
$(this).closest('tr').remove();
return false;
});
$('body').on('submit', 'form.dokan-product-edit-form', this.inputValidate);
$('.dokan-product-listing').on('click', 'a.dokan-add-new-product', this.addProductPopup);
this.loadSelect2();
this.bindProductTagDropdown();
this.attribute.sortable();
this.checkProductPostboxToggle();
$('.product-edit-container .dokan-product-attribute-wrapper').on('click', 'a.dokan-product-toggle-attribute, .dokan-product-attribute-heading', this.attribute.toggleAttribute);
$('.product-edit-container .dokan-product-attribute-wrapper').on('click', 'a.add_new_attribute', this.attribute.addNewAttribute);
$('.product-edit-container .dokan-product-attribute-wrapper').on('keyup', 'input.dokan-product-attribute-name', this.attribute.dynamicAttrNameChange);
$('.dokan-product-attribute-wrapper ul.dokan-attribute-option-list').on('click', 'button.dokan-select-all-attributes', this.attribute.selectAllAttr);
$('.dokan-product-attribute-wrapper ul.dokan-attribute-option-list').on('click', 'button.dokan-select-no-attributes', this.attribute.selectNoneAttr);
$('.dokan-product-attribute-wrapper ul.dokan-attribute-option-list').on('click', 'button.dokan-add-new-attribute', this.attribute.addNewExtraAttr);
$('.product-edit-container .dokan-product-attribute-wrapper').on('click', 'a.dokan-product-remove-attribute', this.attribute.removeAttribute);
$('.product-edit-container .dokan-product-attribute-wrapper').on('click', 'a.dokan-save-attribute', this.attribute.saveAttribute);
$('body').on('click', '.product-container-footer input[type="submit"]', this.createNewProduct);
this.attribute.disbalePredefinedAttribute();
$('body').trigger('dokan-product-editor-loaded', this);
},
saleSchedule: function(){
var $wrap=$(this).closest('.dokan-product-field-content', 'div, table');
$(this).hide();
$wrap.find('.cancel_sale_schedule').show();
$wrap.find('.sale_price_dates_fields').show();
return false;
},
cancelSchedule: function(){
var $wrap=$(this).closest('.dokan-product-field-content', 'div, table');
$(this).hide();
$wrap.find('.sale_schedule').show();
$wrap.find('.sale_price_dates_fields').hide();
$wrap.find('.sale_price_dates_fields').find('input').val('');
return false;
},
checkProductPostboxToggle: function(){
var toggle=JSON.parse(localStorage.getItem('toggleClasses'));
$.each(toggle, function(el, i){
var wrapper=$('.' + el.replace(/_/g, '-')),
content=wrapper.find('.dokan-section-content'),
targetIcon=wrapper.find('i.fa-sort-desc');
if(i){
content.show();
targetIcon.removeClass('fa-flip-horizointal').addClass('fa-flip-vertical');
targetIcon.css('marginTop', '9px');
}else{
content.hide();
targetIcon.removeClass('fa-flip-vertical').addClass('fa-flip-horizointal');
targetIcon.css('marginTop', '0px');
}});
},
toggleProductSection: function(e){
e.preventDefault();
var self=$(this);
if(JSON.parse(localStorage.getItem('toggleClasses'))!=null){
var toggleClasses=JSON.parse(localStorage.getItem('toggleClasses'));
}else{
var toggleClasses={};}
self.closest('.dokan-edit-row').find('.dokan-section-content').slideToggle(300, function(){
if($(this).is(':visible')){
var targetIcon=self.find('i.fa-sort-desc');
targetIcon.removeClass('fa-flip-horizointal').addClass('fa-flip-vertical');
targetIcon.css('marginTop', '9px');
toggleClasses[self.data('togglehandler')]=true;
}else{
var targetIcon=self.find('i.fa-sort-desc');
targetIcon.removeClass('fa-flip-vertical').addClass('fa-flip-horizointal');
targetIcon.css('marginTop', '0px');
toggleClasses[self.data('togglehandler')]=false;
}
localStorage.setItem('toggleClasses', JSON.stringify(toggleClasses));
});
},
loadSelect2: function(){
$('.dokan-select2').select2(
{
"language": {
"noResults": function (){
return dokan.i18n_no_result_found;
}}
}
);
},
bindProductTagDropdown: function (){
if(dokan.product_vendors_can_create_tags&&'on'===dokan.product_vendors_can_create_tags){
return;
}
$('#product_tag').select2({
language: {
noResults: function (){
return dokan.i18n_no_result_found;
}}
});
},
addProductPopup: function (e){
e.preventDefault();
Dokan_Editor.openProductPopup();
},
openProductPopup: function(){
var productTemplate=wp.template('dokan-add-new-product');
$.magnificPopup.open({
fixedContentPos: true,
items: {
src: productTemplate().trim(),
type: 'inline'
},
callbacks: {
open: function(){
$(this.content).closest('.mfp-wrap').removeAttr('tabindex');
Dokan_Editor.loadSelect2();
Dokan_Editor.bindProductTagDropdown();
$('.sale_price_dates_from, .sale_price_dates_to').on('focus', function(){
$(this).css('z-index', '99999');
});
$(".sale_price_dates_fields input").datepicker({
defaultDate: "",
dateFormat: "yy-mm-dd",
numberOfMonths: 1
});
$('.tips').tooltip();
Dokan_Editor.gallery.sortable();
$('body').trigger('dokan-product-editor-popup-opened', Dokan_Editor);
},
close: function(){
product_gallery_frame=undefined;
product_featured_frame=undefined;
}}
});
},
createNewProduct: function (e){
e.preventDefault();
var self=$(this),
form=self.closest('form#dokan-add-new-product-form'),
btn_id=self.attr('data-btn_id');
form.find('span.dokan-show-add-product-error').html('');
form.find('span.dokan-add-new-product-spinner').css('display', 'inline-block');
self.attr('disabled', 'disabled');
if(form.find('input[name="post_title"]').val()==''){
$('span.dokan-show-add-product-error').html(dokan.product_title_required);
self.removeAttr('disabled');
form.find('span.dokan-add-new-product-spinner').css('display', 'none');
return;
}
if(form.find('select[name="product_cat"]').val()=='-1'){
$('span.dokan-show-add-product-error').html(dokan.product_category_required);
self.removeAttr('disabled');
form.find('span.dokan-add-new-product-spinner').css('display', 'none');
return;
}
var data={
action:   'dokan_create_new_product',
postdata: form.serialize(),
_wpnonce:dokan.nonce
};
$.post(dokan.ajaxurl, data, function(resp){
if(resp.success){
self.removeAttr('disabled');
if(btn_id=='create_new'){
$.magnificPopup.close();
window.location.href=resp.data;
}else{
$('.dokan-dashboard-product-listing-wrapper').load(window.location.href + ' table.product-listing-table');
$.magnificPopup.close();
Dokan_Editor.openProductPopup();
}}else{
self.removeAttr('disabled');
$('span.dokan-show-add-product-error').html(resp.data);
}
form.find('span.dokan-add-new-product-spinner').css('display', 'none');
});
},
attribute: {
toggleAttribute: function(e){
e.preventDefault();
var self=$(this),
list=self.closest('li'),
item=list.find('.dokan-product-attribute-item');
if($(item).hasClass('dokan-hide')){
self.closest('.dokan-product-attribute-heading').css({ borderBottom: '1px solid #e3e3e3' });
$(item).slideDown(200, function(){
self.find('i.fa').removeClass('fa-flip-horizointal').addClass('fa-flip-vertical');
$(this).removeClass('dokan-hide');
if(! $(e.target).hasClass('dokan-product-attribute-heading')){
$(e.target).closest('a').css('top', '12px');
}else if($(e.target).hasClass('dokan-product-attribute-heading')){
self.find('a.dokan-product-toggle-attribute').css('top', '12px');
}});
}else{
$(item).slideUp(200, function(){
$(this).addClass('dokan-hide');
self.find('i.fa').removeClass('fa-flip-vertical').addClass('fa-flip-horizointal');
if(! $(e.target).hasClass('dokan-product-attribute-heading')){
$(e.target).closest('a').css('top', '7px');
}else if($(e.target).hasClass('dokan-product-attribute-heading')){
self.find('a.dokan-product-toggle-attribute').css('top', '7px');
}
self.closest('.dokan-product-attribute-heading').css({ borderBottom: 'none' });
})
}
return false;
},
sortable: function(){
$('.dokan-product-attribute-wrapper ul').sortable({
items: 'li.product-attribute-list',
cursor: 'move',
scrollSensitivity:40,
forcePlaceholderSize: true,
forceHelperSize: false,
helper: 'clone',
opacity: 0.65,
placeholder: 'dokan-sortable-placeholder',
start:function(event,ui){
ui.item.css('background-color','#f6f6f6');
},
stop:function(event,ui){
ui.item.removeAttr('style');
},
update: function(event, ui){
var attachment_ids='';
Dokan_Editor.attribute.reArrangeAttribute();
}});
},
dynamicAttrNameChange: function(e){
e.preventDefault();
var self=$(this),
value=self.val();
if(value==''){
self.closest('li').find('strong').html('Attribute Name');
}else{
self.closest('li').find('strong').html(value);
}},
selectAllAttr: function(e){
e.preventDefault();
$(this).closest('li.product-attribute-list').find('select.dokan_attribute_values option').attr('selected', 'selected');
$(this).closest('li.product-attribute-list').find('select.dokan_attribute_values').change();
return false;
},
selectNoneAttr: function(e){
e.preventDefault();
$(this).closest('li.product-attribute-list').find('select.dokan_attribute_values option').removeAttr('selected');
$(this).closest('li.product-attribute-list').find('select.dokan_attribute_values').change();
return false;
},
reArrangeAttribute: function(){
var attributeWrapper=$('.dokan-product-attribute-wrapper').find('ul.dokan-attribute-option-list');
attributeWrapper.find('li.product-attribute-list').css('cursor', 'default').each(function(i){
$(this).find('.attribute_position').val(i);
});
},
addNewExtraAttr: function(e){
e.preventDefault();
var $wrapper=$(this).closest('li.product-attribute-list');
var attribute=$wrapper.data('taxonomy');
var new_attribute_name=window.prompt(dokan.new_attribute_prompt);
if(new_attribute_name){
var data={
action:   'dokan_add_new_attribute',
taxonomy: attribute,
term:     new_attribute_name,
_wpnonce:dokan.nonce
};
$.post(dokan.ajaxurl, data, function(response){
if(response.error){
window.alert(response.error);
}else if(response.slug){
$wrapper.find('select.dokan_attribute_values').append('<option value="' + response.slug + '" selected="selected">' + response.name + '</option>');
$wrapper.find('select.dokan_attribute_values').change();
}});
}},
addNewAttribute: function(e){
e.preventDefault();
var self=$(this),
attrWrap=self.closest('.dokan-attribute-type').find('select#predefined_attribute'),
attribute=attrWrap.val(),
size=$('ul.dokan-attribute-option-list .product-attribute-list').length;
var data={
action:'dokan_get_pre_attribute',
taxonomy:attribute,
i:size,
_wpnonce:dokan.nonce
};
self.closest('.dokan-attribute-type').find('span.dokan-attribute-spinner').removeClass('dokan-hide');
$.post(dokan.ajaxurl, data, function(resp){
if(resp.success){
var attributeWrapper=$('.dokan-product-attribute-wrapper').find('ul.dokan-attribute-option-list');
$html=$.parseHTML(resp.data);
$($html).find('.dokan-product-attribute-item').removeClass('dokan-hide');
$($html).find('i.fa.fa-sort-desc').removeClass('fa-flip-horizointal').addClass('fa-flip-vertical');
$($html).find('a.dokan-product-toggle-attribute').css('top','12px');
$($html).find('.dokan-product-attribute-heading').css({ borderBottom: '1px solid #e3e3e3' });
attributeWrapper.append($html);
$('select#product_type').trigger('change');
Dokan_Editor.loadSelect2();
Dokan_Editor.attribute.reArrangeAttribute();
};
self.closest('.dokan-attribute-type').find('span.dokan-attribute-spinner').addClass('dokan-hide');
if(attribute){
attrWrap.find('option[value="' + attribute + '"]').attr('disabled','disabled');
attrWrap.val('');
}});
},
removeAttribute: function(evt){
evt.stopPropagation();
if(window.confirm(dokan.remove_attribute)){
var $parent=$(this).closest('li.product-attribute-list');
$parent.fadeOut(300, function(){
if($parent.is('.taxonomy')){
$parent.find('select, input[type=text]').val('');
$('select.dokan_attribute_taxonomy').find('option[value="' + $parent.data('taxonomy') + '"]').removeAttr('disabled');
}else{
$parent.find('select, input[type=text]').val('');
$parent.hide();
}
Dokan_Editor.attribute.reArrangeAttribute();
});
}
return false;
},
saveAttribute: function(e){
e.preventDefault();
var self=$(this),
data={
post_id:  $('#dokan-edit-product-id').val(),
data:     $('ul.dokan-attribute-option-list').find('input, select, textarea').serialize(),
action:   'dokan_save_attributes'
};
$('.dokan-product-attribute-wrapper').block({
message: null,
fadeIn: 50,
fadeOut: 1000,
overlayCSS: {
background: '#fff',
opacity: 0.6
}});
$.post(dokan.ajaxurl, data, function(resp){
$('#dokan-variable-product-options').load(window.location.toString() + ' #dokan-variable-product-options-inner', function(){
$('#dokan-variable-product-options').trigger('reload');
$('select#product_type').trigger('change');
$('.dokan-product-attribute-wrapper').unblock();
});
});
},
disbalePredefinedAttribute: function(){
$('ul.dokan-attribute-option-list li.product-attribute-list').each(function(index, el){
if($(el).css('display')!=='none'&&$(el).is('.taxonomy')){
$('select#predefined_attribute').find('option[value="' + $(el).data('taxonomy') + '"]').attr('disabled', 'disabled');
}});
}},
inputValidate: function(e){
e.preventDefault();
if($('#post_title').val().trim()==''){
$('#post_title').focus();
$('div.dokan-product-title-alert').removeClass('dokan-hide');
return;
}else{
$('div.dokan-product-title-alert').hide();
}
if($('select.product_cat').val()==-1){
$('select.product_cat').focus();
$('div.dokan-product-cat-alert').removeClass('dokan-hide');
return;
}else{
$('div.dokan-product-cat-alert').hide();
}
$('input[type=submit]').attr('disabled', 'disabled');
this.submit();
},
downloadable: function(){
if($(this).prop('checked')){
$(this).closest('aside').find('.dokan-side-body').removeClass('dokan-hide');
}else{
$(this).closest('aside').find('.dokan-side-body').addClass('dokan-hide');
}},
showDiscountSchedule: function(e){
e.preventDefault();
$('.sale-schedule-container').slideToggle('fast');
},
showManageStock: function(e){
if($(this).is(':checked')){
$('.show_if_stock').slideDown('fast');
}else{
$('.show_if_stock').slideUp('fast');
}},
gallery: {
addImages: function(e){
e.preventDefault();
var self=$(this),
p_images=self.closest('.dokan-product-gallery').find('#product_images_container ul.product_images'),
images_gid=self.closest('.dokan-product-gallery').find('#product_image_gallery');
if(product_gallery_frame){
product_gallery_frame.open();
return;
}else{
product_gallery_frame=wp.media({
title: dokan.i18n_choose_gallery,
button: {
text: dokan.i18n_choose_gallery_btn_text,
},
multiple: true
});
product_gallery_frame.on('select', function(){
var selection=product_gallery_frame.state().get('selection');
selection.map(function(attachment){
attachment=attachment.toJSON();
if(attachment.id){
attachment_ids=[];
$('<li class="image" data-attachment_id="' + attachment.id + '">\
<img src="' + attachment.url + '" />\
<a href="#" class="action-delete">&times;</a>\
</li>').insertBefore(p_images.find('li.add-image'));
$('#product_images_container ul li.image').css('cursor','default').each(function(){
var attachment_id=jQuery(this).attr('data-attachment_id');
attachment_ids.push(attachment_id);
});
}});
images_gid.val(attachment_ids.join(','));
});
product_gallery_frame.open();
}},
deleteImage: function(e){
e.preventDefault();
var self=$(this),
p_images=self.closest('.dokan-product-gallery').find('#product_images_container ul.product_images'),
images_gid=self.closest('.dokan-product-gallery').find('#product_image_gallery');
self.closest('li.image').remove();
var attachment_ids=[];
$('#product_images_container ul li.image').css('cursor','default').each(function(){
var attachment_id=$(this).attr('data-attachment_id');
attachment_ids.push(attachment_id);
});
images_gid.val(attachment_ids.join(','));
return false;
},
sortable: function(){
$('body').find('#product_images_container ul.product_images').sortable({
items: 'li.image',
cursor: 'move',
scrollSensitivity:40,
forcePlaceholderSize: true,
forceHelperSize: false,
helper: 'clone',
opacity: 0.65,
placeholder: 'dokan-sortable-placeholder',
start:function(event,ui){
ui.item.css('background-color','#f6f6f6');
},
stop:function(event,ui){
ui.item.removeAttr('style');
},
update: function(event, ui){
var attachment_ids=[];
$('body').find('#product_images_container ul li.image').css('cursor','default').each(function(){
var attachment_id=jQuery(this).attr('data-attachment_id');
attachment_ids.push(attachment_id);
});
$('body').find('#product_image_gallery').val(attachment_ids.join(','));
}});
}},
featuredImage: {
addImage: function(e){
e.preventDefault();
var self=$(this);
if(product_featured_frame){
product_featured_frame.open();
return;
}else{
product_featured_frame=wp.media({
title: dokan.i18n_choose_featured_img,
button: {
text: dokan.i18n_choose_featured_img_btn_text,
}});
product_featured_frame.on('select', function(){
var selection=product_featured_frame.state().get('selection');
selection.map(function(attachment){
attachment=attachment.toJSON();
self.siblings('input.dokan-feat-image-id').val(attachment.id);
var instruction=self.closest('.instruction-inside');
var wrap=instruction.siblings('.image-wrap');
wrap.find('img').attr('src', attachment.url);
wrap.find('img').removeAttr('srcset');
instruction.addClass('dokan-hide');
wrap.removeClass('dokan-hide');
});
});
product_featured_frame.open();
}},
removeImage: function(e){
e.preventDefault();
var self=$(this);
var wrap=self.closest('.image-wrap');
var instruction=wrap.siblings('.instruction-inside');
instruction.find('input.dokan-feat-image-id').val('0');
wrap.addClass('dokan-hide');
instruction.removeClass('dokan-hide');
}},
fileDownloadable: function(e){
e.preventDefault();
var self=$(this),
downloadable_frame;
if(downloadable_frame){
downloadable_frame.open();
return;
}
downloadable_frame=wp.media({
title: dokan.i18n_choose_file,
button: {
text: dokan.i18n_choose_file_btn_text,
},
multiple: true
});
downloadable_frame.on('select', function(){
var selection=downloadable_frame.state().get('selection');
selection.map(function(attachment){
attachment=attachment.toJSON();
self.closest('tr').find('input.wc_file_url, input.wc_variation_file_url').val(attachment.url);
});
});
downloadable_frame.on('ready', function(){
downloadable_frame.uploader.options.uploader.params={
type: 'downloadable_product'
};});
downloadable_frame.open();
}};
$(function(){
Dokan_Editor.init();
$('select#product_type').change(function(){
var select_val=$(this).val();
if('variable'===select_val){
$('input#_manage_stock').change();
$('input#_downloadable').prop('checked', false);
$('input#_virtual').removeAttr('checked');
}
show_and_hide_panels();
$(document.body).trigger('dokan-product-type-change', select_val, $(this));
}).change();
$('.product-edit-container').on('change', 'input#_downloadable, input#_virtual', function(){
show_and_hide_panels();
}).change();
$('input#_downloadable').change();
$('input#_virtual').change();
function show_and_hide_panels(){
var product_type=$('#product_type').val();
var is_virtual=$('input#_virtual:checked').length;
var is_downloadable=$('input#_downloadable:checked').length;
var hide_classes='.hide_if_downloadable, .hide_if_virtual';
var show_classes='.show_if_downloadable, .show_if_virtual';
$.each(Object.keys(dokan.product_types), function(index, value){
hide_classes=hide_classes + ', .hide_if_' + value;
show_classes=show_classes + ', .show_if_' + value;
});
$(hide_classes).show();
$(show_classes).hide();
if(is_downloadable){
$('.show_if_downloadable').show();
}
if(is_virtual){
$('.show_if_virtual').show();
}
$('.show_if_' + product_type).show();
if(is_downloadable){
$('.hide_if_downloadable').hide();
}
if(is_virtual){
$('.hide_if_virtual').hide();
}
$('.hide_if_' + product_type).hide();
$('input#_manage_stock').change();
}
$('.sale_price_dates_fields').each(function(){
var $these_sale_dates=$(this);
var sale_schedule_set=false;
var $wrap=$these_sale_dates.closest('div, table');
$these_sale_dates.find('input').each(function(){
if(''!==$(this).val()){
sale_schedule_set=true;
}});
if(sale_schedule_set){
$wrap.find('.sale_schedule').hide();
$wrap.find('.sale_price_dates_fields').show();
}else{
$wrap.find('.sale_schedule').show();
$wrap.find('.sale_price_dates_fields').hide();
}});
$('.product-edit-container').on('click', '.sale_schedule', function(){
var $wrap=$(this).closest('.product-edit-container, div.dokan-product-variation-itmes, table');
$(this).hide();
$wrap.find('.cancel_sale_schedule').show();
$wrap.find('.sale_price_dates_fields').show();
return false;
});
$('.product-edit-container').on('click', '.cancel_sale_schedule', function(){
var $wrap=$('.product-edit-container, div.dokan-product-variation-itmes, table');
$(this).hide();
$wrap.find('.sale_schedule').show();
$wrap.find('.sale_price_dates_fields').hide();
$wrap.find('.sale_price_dates_fields').find('input').val('');
return false;
});
function dokan_show_earning_suggestion(callback){
let commission=$('span.vendor-earning').attr('data-commission');
let product_id=$('span.vendor-earning').attr('data-product-id');
let product_price=$('input.dokan-product-regular-price').val();
let sale_price=$('input.dokan-product-sales-price').val();
let earning_suggestion=$('.simple-product span.vendor-price');
earning_suggestion.html('Calculating');
$.get(dokan.ajaxurl, {
action: 'get_vendor_earning',
product_id: product_id,
product_price: product_price,
product_price: sale_price ? sale_price:product_price,
_wpnonce: dokan.nonce
})
.done(( response)=> {
earning_suggestion.html(response);
if(typeof callback==='function'){
callback();
}});
}
$("input.dokan-product-regular-price, input.dokan-product-sales-price").on('keyup', _.debounce(()=> {
dokan_show_earning_suggestion(function(){
if($('#product_type').val()=='simple'||$('#product_type').text()==''){
if(Number($('.simple-product span.vendor-price').text()) < 0){
$($('.dokan-product-less-price-alert').removeClass('dokan-hide'));
$('input[type=submit]').attr('disabled', 'disabled');
$('button[type=submit]').attr('disabled', 'disabled');
}else{
$($('.dokan-product-less-price-alert').addClass('dokan-hide'));
$('input[type=submit]').removeAttr('disabled');
$('button[type=submit]').removeAttr('disabled');
}}
});
}, 750));
function debounce_delay(callback, ms){
var timer=0;
return function(){
var context=this, args=arguments;
clearTimeout(timer);
timer=setTimeout(function (){
callback.apply(context, args);
}, ms||0);
};}});
})(jQuery);
jQuery(function($){
var api=wp.customize;
$('.datepicker').datepicker({
dateFormat: 'yy-mm-dd'
});
$('.tips').tooltip();
function showTooltip(x, y, contents){
jQuery('<div class="chart-tooltip">' + contents + '</div>').css({
top: y - 16,
left: x + 20
}).appendTo("body").fadeIn(200);
}
var prev_data_index=null;
var prev_series_index=null;
jQuery(".chart-placeholder").bind("plothover", function(event, pos, item){
if(item){
if(prev_data_index!=item.dataIndex||prev_series_index!=item.seriesIndex){
prev_data_index=item.dataIndex;
prev_series_index=item.seriesIndex;
jQuery(".chart-tooltip").remove();
if(item.series.points.show||item.series.enable_tooltip){
var y=item.series.data[item.dataIndex][1];
tooltip_content='';
if(item.series.prepend_label)
tooltip_content=tooltip_content + item.series.label + ": ";
if(item.series.prepend_tooltip)
tooltip_content=tooltip_content + item.series.prepend_tooltip;
tooltip_content=tooltip_content + y;
if(item.series.append_tooltip)
tooltip_content=tooltip_content + item.series.append_tooltip;
if(item.series.pie.show){
showTooltip(pos.pageX, pos.pageY, tooltip_content);
}else{
showTooltip(item.pageX, item.pageY, tooltip_content);
}}
}}else{
jQuery(".chart-tooltip").remove();
prev_data_index=null;
}});
});
(function($){
$.validator.setDefaults({ ignore: ":hidden" });
var validatorError=function(error, element){
var form_group=$(element).closest('.dokan-form-group');
form_group.addClass('has-error').append(error);
};
var validatorSuccess=function(label, element){
$(element).closest('.dokan-form-group').removeClass('has-error');
};
var api=wp.customize;
var Dokan_Settings={
init: function(){
var self=this;
$('a.dokan-banner-drag').on('click', this.imageUpload);
$('a.dokan-remove-banner-image').on('click', this.removeBanner);
$('a.dokan-pro-gravatar-drag').on('click', this.gragatarImageUpload);
$('a.dokan-gravatar-drag').on('click', this.simpleImageUpload);
$('a.dokan-remove-gravatar-image').on('click', this.removeGravatar);
this.validateForm(self);
return false;
},
calculateImageSelectOptions: function(attachment, controller){
var xInit=parseInt(dokan.store_banner_dimension.width, 10),
yInit=parseInt(dokan.store_banner_dimension.height, 10),
flexWidth = !! parseInt(dokan.store_banner_dimension['flex-width'], 10),
flexHeight = !! parseInt(dokan.store_banner_dimension['flex-height'], 10),
ratio, xImg, yImg, realHeight, realWidth,
imgSelectOptions;
realWidth=attachment.get('width');
realHeight=attachment.get('height');
this.headerImage=new api.HeaderTool.ImageModel();
this.headerImage.set({
themeWidth: xInit,
themeHeight: yInit,
themeFlexWidth: flexWidth,
themeFlexHeight: flexHeight,
imageWidth: realWidth,
imageHeight: realHeight
});
controller.set('canSkipCrop', ! this.headerImage.shouldBeCropped());
ratio=xInit / yInit;
xImg=realWidth;
yImg=realHeight;
if(xImg / yImg > ratio){
yInit=yImg;
xInit=yInit * ratio;
}else{
xInit=xImg;
yInit=xInit / ratio;
}
imgSelectOptions={
handles: true,
keys: true,
instance: true,
persistent: true,
imageWidth: realWidth,
imageHeight: realHeight,
x1: 0,
y1: 0,
x2: xInit,
y2: yInit
};
if(flexHeight===false&&flexWidth===false){
imgSelectOptions.aspectRatio=xInit + ':' + yInit;
}
if(flexHeight===false){
imgSelectOptions.maxHeight=yInit;
}
if(flexWidth===false){
imgSelectOptions.maxWidth=xInit;
}
return imgSelectOptions;
},
onSelect: function(){
this.frame.setState('cropper');
},
onCropped: function(croppedImage){
var url=croppedImage.url,
attachmentId=croppedImage.attachment_id,
w=croppedImage.width,
h=croppedImage.height;
this.setImageFromURL(url, attachmentId, w, h);
},
onSkippedCrop: function(selection){
var url=selection.get('url'),
w=selection.get('width'),
h=selection.get('height');
this.setImageFromURL(url, selection.id, w, h);
},
setImageFromURL: function(url, attachmentId, width, height){
if($(this.uploadBtn).hasClass('dokan-banner-drag')){
var wrap=$(this.uploadBtn).closest('.dokan-banner');
wrap.find('input.dokan-file-field').val(attachmentId);
wrap.find('img.dokan-banner-img').attr('src', url);
$(this.uploadBtn).parent().siblings('.image-wrap', wrap).removeClass('dokan-hide');
$(this.uploadBtn).parent('.button-area').addClass('dokan-hide');
}else if($(this.uploadBtn).hasClass('dokan-pro-gravatar-drag')){
var wrap=$(this.uploadBtn).closest('.dokan-gravatar');
wrap.find('input.dokan-file-field').val(attachmentId);
wrap.find('img.dokan-gravatar-img').attr('src', url);
$(this.uploadBtn).parent().siblings('.gravatar-wrap', wrap).removeClass('dokan-hide');
$(this.uploadBtn).parent('.gravatar-button-area').addClass('dokan-hide');
}},
removeImage: function(){
api.HeaderTool.currentHeader.trigger('hide');
api.HeaderTool.CombinedList.trigger('control:removeImage');
},
imageUpload: function(e){
e.preventDefault();
var file_frame,
settings=Dokan_Settings;
settings.uploadBtn=this;
settings.frame=wp.media({
multiple: false,
button: {
text: dokan.selectAndCrop,
close: false
},
states: [
new wp.media.controller.Library({
title:     dokan.chooseImage,
library:   wp.media.query({ type: 'image' }),
multiple:  false,
date:      false,
priority:  20,
suggestedWidth: dokan.store_banner_dimension.width,
suggestedHeight: dokan.store_banner_dimension.height
}),
new wp.media.controller.Cropper({
suggestedWidth: 5000,
imgSelectOptions: settings.calculateImageSelectOptions
})
]
});
settings.frame.on('select', settings.onSelect, settings);
settings.frame.on('cropped', settings.onCropped, settings);
settings.frame.on('skippedcrop', settings.onSkippedCrop, settings);
settings.frame.open();
},
calculateImageSelectOptionsProfile: function(attachment, controller){
var xInit=150,
yInit=150,
flexWidth = !! parseInt(dokan.store_banner_dimension['flex-width'], 10),
flexHeight = !! parseInt(dokan.store_banner_dimension['flex-height'], 10),
ratio, xImg, yImg, realHeight, realWidth,
imgSelectOptions;
realWidth=attachment.get('width');
realHeight=attachment.get('height');
this.headerImage=new api.HeaderTool.ImageModel();
this.headerImage.set({
themeWidth: xInit,
themeHeight: yInit,
themeFlexWidth: flexWidth,
themeFlexHeight: flexHeight,
imageWidth: realWidth,
imageHeight: realHeight
});
controller.set('canSkipCrop', ! this.headerImage.shouldBeCropped());
ratio=xInit / yInit;
xImg=realWidth;
yImg=realHeight;
if(xImg / yImg > ratio){
yInit=yImg;
xInit=yInit * ratio;
}else{
xInit=xImg;
yInit=xInit / ratio;
}
imgSelectOptions={
handles: true,
keys: true,
instance: true,
persistent: true,
imageWidth: realWidth,
imageHeight: realHeight,
x1: 0,
y1: 0,
x2: xInit,
y2: yInit
};
if(flexHeight===false&&flexWidth===false){
imgSelectOptions.aspectRatio=xInit + ':' + yInit;
}
if(flexHeight===false){
imgSelectOptions.maxHeight=yInit;
}
if(flexWidth===false){
imgSelectOptions.maxWidth=xInit;
}
return imgSelectOptions;
},
simpleImageUpload:function(e){
e.preventDefault();
var file_frame,
self=$(this);
if(file_frame){
file_frame.open();
return;
}
file_frame=wp.media.frames.file_frame=wp.media({
title: jQuery(this).data('uploader_title'),
button: {
text: jQuery(this).data('uploader_button_text')
},
multiple: false
});
file_frame.on('select', function(){
var attachment=file_frame.state().get('selection').first().toJSON();
var wrap=self.closest('.dokan-gravatar');
wrap.find('input.dokan-file-field').val(attachment.id);
wrap.find('img.dokan-gravatar-img').attr('src', attachment.url);
self.parent().siblings('.gravatar-wrap', wrap).removeClass('dokan-hide');
self.parent('.gravatar-button-area').addClass('dokan-hide');
});
file_frame.open();
},
gragatarImageUpload: function(e){
e.preventDefault();
var file_frame,
settings=Dokan_Settings;
settings.uploadBtn=this;
settings.frame=wp.media({
multiple: false,
button: {
text: dokan.selectAndCrop,
close: false
},
states: [
new wp.media.controller.Library({
title:     dokan.chooseImage,
library:   wp.media.query({ type: 'image' }),
multiple:  false,
date:      false,
priority:  20,
suggestedWidth: 150,
suggestedHeight: 150
}),
new wp.media.controller.Cropper({
imgSelectOptions: settings.calculateImageSelectOptionsProfile
})
]
});
settings.frame.on('select', settings.onSelect, settings);
settings.frame.on('cropped', settings.onCropped, settings);
settings.frame.on('skippedcrop', settings.onSkippedCrop, settings);
settings.frame.open();
},
submitSettings: function(form_id){
if(typeof tinyMCE!='undefined'){
tinyMCE.triggerSave();
}
var self=$("form#" + form_id),
form_data=self.serialize() + '&action=dokan_settings&form_id=' + form_id;
self.find('.ajax_prev').append('<span class="dokan-loading"> </span>');
$.post(dokan.ajaxurl, form_data, function(resp){
self.find('span.dokan-loading').remove();
$('html,body').animate({scrollTop:100});
if(resp.success){
$('.dokan-ajax-response').html($('<div/>', {
'class': 'dokan-alert dokan-alert-success',
'html': '<p>' + resp.data.msg + '</p>',
}));
$('.dokan-ajax-response').append(resp.data.progress);
}else{
$('.dokan-ajax-response').html($('<div/>', {
'class': 'dokan-alert dokan-alert-danger',
'html': '<p>' + resp.data + '</p>'
}));
}});
},
validateForm: function(self){
$("form#settings-form, form#profile-form, form#store-form, form#payment-form").validate({
submitHandler: function(form){
self.submitSettings(form.getAttribute('id'));
},
errorElement: 'span',
errorClass: 'error',
errorPlacement: validatorError,
success: validatorSuccess,
ignore: '.select2-search__field, :hidden, .mapboxgl-ctrl-geocoder--input'
});
},
removeBanner: function(e){
e.preventDefault();
var self=$(this);
var wrap=self.closest('.image-wrap');
var instruction=wrap.siblings('.button-area');
wrap.find('input.dokan-file-field').val('0');
wrap.addClass('dokan-hide');
instruction.removeClass('dokan-hide');
},
removeGravatar: function(e){
e.preventDefault();
var self=$(this);
var wrap=self.closest('.gravatar-wrap');
var instruction=wrap.siblings('.gravatar-button-area');
wrap.find('input.dokan-file-field').val('0');
wrap.addClass('dokan-hide');
instruction.removeClass('dokan-hide');
},
};
var Dokan_Withdraw={
init: function(){
var self=this;
this.withdrawValidate(self);
},
withdrawValidate: function(self){
$('form.withdraw').validate({
errorElement: 'span',
errorClass: 'error',
errorPlacement: validatorError,
success: validatorSuccess
})
}};
var Dokan_Seller={
init: function(){
this.validate(this);
},
validate: function(self){
$('form#dokan-form-contact-seller').validate({
errorPlacement: validatorError,
success: validatorSuccess,
submitHandler: function(form){
$(form).block({ message: null, overlayCSS: { background: '#fff url(' + dokan.ajax_loader + ') no-repeat center', opacity: 0.6 }});
var form_data=$(form).serialize();
$.post(dokan.ajaxurl, form_data, function(resp){
$(form).unblock();
if(typeof resp.data!=='undefined'){
$(form).find('.ajax-response').html(resp.data);
}
$(form).find('input[type=text], input[type=email], textarea').val('').removeClass('valid');
});
}});
}};
$(function(){
Dokan_Settings.init();
Dokan_Withdraw.init();
Dokan_Seller.init();
$('.dokan-form-horizontal').on('change', 'input[type=checkbox]#lbl_setting_minimum_quantity', function(){
var showSWDiscount=$('.show_if_needs_sw_discount');
if($(this).is(':checked')){
showSWDiscount.find('input[type="number"]').val('');
showSWDiscount.slideDown('slow');
}else{
showSWDiscount.slideUp('slow');
}});
});
})(jQuery);
(function($){
var dokan_messages=DokanValidateMsg;
dokan_messages.maxlength=$.validator.format(dokan_messages.maxlength_msg);
dokan_messages.minlength=$.validator.format(dokan_messages.minlength_msg);
dokan_messages.rangelength=$.validator.format(dokan_messages.rangelength_msg);
dokan_messages.range=$.validator.format(dokan_messages.range_msg);
dokan_messages.max=$.validator.format(dokan_messages.max_msg);
dokan_messages.min=$.validator.format(dokan_messages.min_msg);
$.validator.messages=dokan_messages;
$(document).on('click','#dokan_store_tnc_enable',function(e){
if($(this).is(':checked')){
$('#dokan_tnc_text').show();
}else{
$('#dokan_tnc_text').hide();
}}).ready(function(e){
if($('#dokan_store_tnc_enable').is(':checked')){
$('#dokan_tnc_text').show();
}else{
$('#dokan_tnc_text').hide();
}});
})(jQuery);
;(function($){
function resize_dummy_image(){
var width=dokan.store_banner_dimension.width,
height=(dokan.store_banner_dimension.height / dokan.store_banner_dimension.width) * $('#dokan-content').width();
$('.profile-info-img.dummy-image').css({
height: height
});
}
resize_dummy_image();
$(window).on('resize', function (e){
resize_dummy_image();
});
$(':input.dokan-product-search').filter(':not(.enhanced)').each(function(){
var select2_args={
allowClear:  $(this).data('allow_clear') ? true:false,
placeholder: $(this).data('placeholder'),
minimumInputLength: $(this).data('minimum_input_length') ? $(this).data('minimum_input_length'):'3',
escapeMarkup: function(m){
return m;
},
language: {
errorLoading: function(){
return dokan.i18n_searching;
},
inputTooLong: function(args){
var overChars=args.input.length - args.maximum;
if(1===overChars){
return dokan.i18n_input_too_long_1;
}
return dokan.i18n_input_too_long_n.replace('%qty%', overChars);
},
inputTooShort: function(args){
var remainingChars=args.minimum - args.input.length;
if(1===remainingChars){
return dokan.i18n_input_too_short_1;
}
return dokan.i18n_input_too_short_n.replace('%qty%', remainingChars);
},
loadingMore: function(){
return dokan.i18n_load_more;
},
maximumSelected: function(args){
if(args.maximum===1){
return dokan.i18n_selection_too_long_1;
}
return dokan.i18n_selection_too_long_n.replace('%qty%', args.maximum);
},
noResults: function(){
return dokan.i18n_no_matches;
},
searching: function(){
return dokan.i18n_searching;
}},
ajax: {
url:         dokan.ajaxurl,
dataType:    'json',
delay:       250,
data:        function(params){
return {
term:     params.term,
action:   $(this).data('action')||'dokan_json_search_products_and_variations',
security: dokan.search_products_nonce,
exclude:  $(this).data('exclude'),
user_ids:  $(this).data('user_ids'),
include:  $(this).data('include'),
limit:    $(this).data('limit')
};},
processResults: function(data){
var terms=[];
if(data){
$.each(data, function(id, text){
terms.push({ id: id, text: text });
});
}
return {
results: terms
};},
cache: true
}};
$(this).select2(select2_args).addClass('enhanced');
if($(this).data('sortable')){
var $select=$(this);
var $list=$(this).next('.select2-container').find('ul.select2-selection__rendered');
$list.sortable({
placeholder:'ui-state-highlight select2-selection__choice',
forcePlaceholderSize: true,
items:'li:not(.select2-search__field)',
tolerance:'pointer',
stop: function(){
$($list.find('.select2-selection__choice').get().reverse()).each(function(){
var id=$(this).data('data').id;
var option=$select.find('option[value="' + id + '"]')[0];
$select.prepend(option);
});
}});
}});
var bulkItemsSelection={
init: function(){
selected_items=[];
$('#cb-select-all').on('change', function(e){
var self=$(this);
var item_id=$('.cb-select-items');
if(self.is(':checked')){
item_id.each(function(key, value){
var item=$(value);
item.prop('checked', 'checked');
});
}else{
item_id.each(function(key, value){
$(value).prop('checked', '');
selected_items.pop();
});
}});
}};
bulkItemsSelection.init();
$('.product-cat-stack-dokan li.has-children').on('click', '> a span.caret-icon', function(e){
e.preventDefault();
var self=$(this),
liHasChildren=self.closest('li.has-children');
if(!liHasChildren.find('> ul.children').is(':visible')){
self.find('i.fa').addClass('fa-rotate-90');
if(liHasChildren.find('> ul.children').hasClass('level-0')){
self.closest('a').css({ 'borderBottom': 'none' });
}}
liHasChildren.find('> ul.children').slideToggle('fast', function (){
if(!$(this).is(':visible')){
self.find('i.fa').removeClass('fa-rotate-90');
if(liHasChildren.find('> ul.children').hasClass('level-0')){
self.closest('a').css({ 'borderBottom': '1px solid #eee' });
}}
});
});
$('.store-cat-stack-dokan li.has-children').on('click', '> a span.caret-icon', function(e){
e.preventDefault();
var self=$(this),
liHasChildren=self.closest('li.has-children');
if(!liHasChildren.find('> ul.children').is(':visible')){
self.find('i.fa').addClass('fa-rotate-90');
if(liHasChildren.find('> ul.children').hasClass('level-0')){
self.closest('a').css({ 'borderBottom': 'none' });
}}
liHasChildren.find('> ul.children').slideToggle('fast', function (){
if(!$(this).is(':visible')){
self.find('i.fa').removeClass('fa-rotate-90');
if(liHasChildren.find('> ul.children').hasClass('level-0')){
self.closest('a').css({ 'borderBottom': '1px solid #eee' });
}}
});
});
$(document).ready(function(){
var selectedLi=$('#cat-drop-stack ul').find('a.selected');
selectedLi.css({ fontWeight: 'bold' });
selectedLi.parents('ul.children').each(function(i, val){
$(val).css({ display: 'block' });
});
});
})(jQuery);
(function($){
$(document.body)
.on('wc_add_error_tip', function(e, element, error_type){
var offset=element.position();
if(element.parent().find('.wc_error_tip').length===0){
element.after('<div class="wc_error_tip ' + error_type + '">' + dokan[error_type] + '</div>');
element.parent().find('.wc_error_tip')
.css('left', offset.left + element.width() -(element.width() / 2) -($('.wc_error_tip').width() / 2))
.css('top', offset.top + element.height())
.fadeIn('100');
}})
.on('wc_remove_error_tip', function(e, element, error_type){
element.parent().find('.wc_error_tip.' + error_type).fadeOut('100', function(){ $(this).remove(); });
})
.on('click', function(){
$('.wc_error_tip').fadeOut('100', function(){ $(this).remove(); });
})
.on('blur', '.wc_input_decimal[type=text], .wc_input_price[type=text], .wc_input_country_iso[type=text]', function(){
$('.wc_error_tip').fadeOut('100', function(){ $(this).remove(); });
})
.on('change',
'.wc_input_price[type=text], .wc_input_decimal[type=text], .wc-order-totals #refund_amount[type=text]',
function(){
var regex, decimalRegex,
decimailPoint=dokan.decimal_point;
if($(this).is('.wc_input_price')||$(this).is('#refund_amount')){
decimailPoint=dokan.mon_decimal_point;
}
regex=new RegExp('[^\-0-9\%\\' + decimailPoint + ']+', 'gi');
decimalRegex=new RegExp('\\' + decimailPoint + '+', 'gi');
var value=$(this).val();
var newvalue=value.replace(regex, '').replace(decimalRegex, decimailPoint);
if(value!==newvalue){
$(this).val(newvalue);
}}
)
.on('keyup',
'.wc_input_price[type=text], .wc_input_decimal[type=text], .wc_input_country_iso[type=text], .wc-order-totals #refund_amount[type=text]',
function(){
var regex, error, decimalRegex;
var checkDecimalNumbers=false;
if($(this).is('.wc_input_price')||$(this).is('#refund_amount')){
checkDecimalNumbers=true;
regex=new RegExp('[^\-0-9\%\\' + dokan.mon_decimal_point + ']+', 'gi');
decimalRegex=new RegExp('[^\\' + dokan.mon_decimal_point + ']', 'gi');
error='i18n_mon_decimal_error';
}else if($(this).is('.wc_input_country_iso')){
regex=new RegExp('([^A-Z])+|(.){3,}', 'im');
error='i18n_country_iso_error';
}else{
checkDecimalNumbers=true;
regex=new RegExp('[^\-0-9\%\\' + dokan.decimal_point + ']+', 'gi');
decimalRegex=new RegExp('[^\\' + dokan.decimal_point + ']', 'gi');
error='i18n_decimal_error';
}
var value=$(this).val();
var newvalue=value.replace(regex, '');
if(checkDecimalNumbers&&1 < newvalue.replace(decimalRegex, '').length){
newvalue=newvalue.replace(decimalRegex, '');
}
if(value!==newvalue){
$(document.body).triggerHandler('wc_add_error_tip', [ $(this), error ]);
}else{
$(document.body).triggerHandler('wc_remove_error_tip', [ $(this), error ]);
}}
)
.on('change', '#_sale_price.wc_input_price[type=text], .wc_input_price[name^=variable_sale_price]', function(){
var sale_price_field=$(this), regular_price_field;
if(sale_price_field.attr('name').indexOf('variable')!==-1){
regular_price_field=sale_price_field
.parents('.variable_pricing')
.find('.wc_input_price[name^=variable_regular_price]');
}else{
regular_price_field=$('#_regular_price');
}
var sale_price=parseFloat(
window.accounting.unformat(sale_price_field.val(), dokan.mon_decimal_point)
);
var regular_price=parseFloat(
window.accounting.unformat(regular_price_field.val(), dokan.mon_decimal_point)
);
if(sale_price >=regular_price){
$(this).val('');
}})
.on('keyup', '#_sale_price.wc_input_price[type=text], .wc_input_price[name^=variable_sale_price]', function(){
var sale_price_field=$(this), regular_price_field;
if(sale_price_field.attr('name').indexOf('variable')!==-1){
regular_price_field=sale_price_field
.parents('.variable_pricing')
.find('.wc_input_price[name^=variable_regular_price]');
}else{
regular_price_field=$('#_regular_price');
}
var sale_price=parseFloat(
window.accounting.unformat(sale_price_field.val(), dokan.mon_decimal_point)
);
var regular_price=parseFloat(
window.accounting.unformat(regular_price_field.val(), dokan.mon_decimal_point)
);
if(sale_price >=regular_price){
$(document.body).triggerHandler('wc_add_error_tip', [ $(this), 'i18n_sale_less_than_regular_error' ]);
}else{
$(document.body).triggerHandler('wc_remove_error_tip', [ $(this), 'i18n_sale_less_than_regular_error' ]);
}})
.on('init_tooltips', function(){
$('.tips, .help_tip, .woocommerce-help-tip').tipTip({
'attribute': 'data-tip',
'fadeIn': 50,
'fadeOut': 50,
'delay': 200
});
$('.column-wc_actions .wc-action-button').tipTip({
'fadeIn': 50,
'fadeOut': 50,
'delay': 200
});
$('.parent-tips').each(function(){
$(this).closest('a, th').attr('data-tip', $(this).data('tip')).tipTip({
'attribute': 'data-tip',
'fadeIn': 50,
'fadeOut': 50,
'delay': 200
}).css('cursor', 'help');
});
});
})(jQuery)
;(function($){
var storeLists={
query: {},
form: null,
cateItemStringArray: [],
init: function(){
$('#dokan-store-listing-filter-wrap .sort-by #stores_orderby').on('change', this.buildSortByQuery);
$('#dokan-store-listing-filter-wrap .toggle-view span').on('click', this.toggleView);
$('#dokan-store-listing-filter-wrap .dokan-store-list-filter-button, #dokan-store-listing-filter-wrap .dokan-icons, #dokan-store-listing-filter-form-wrap .apply-filter #cancel-filter-btn ').on('click', this.toggleForm);
$('#dokan-store-listing-filter-form-wrap .store-search-input').on('change', this.buildSearchQuery);
$('#dokan-store-listing-filter-form-wrap .apply-filter #apply-filter-btn').on('click', this.submitForm);
this.maybeHideListView();
const self=storeLists;
self.form=document.forms.dokan_store_lists_filter_form;
const view=self.getLocal('dokan-layout');
if(view){
const toggleBtns=$('.toggle-view span');
self.setView(view, toggleBtns);
}
const params=self.getParams();
if(params.length){
let openTheForm=false;
params.forEach(function(param){
const keys=Object.keys(param);
const values=Object.values(param);
if(! keys.includes('stores_orderby')||params.length > 1){
openTheForm=true;
}
self.setParams(keys, values);
});
if(openTheForm){
$('#dokan-store-listing-filter-form-wrap').slideToggle();
}}
},
buildSortByQuery: function(event){
const self=storeLists;
self.query.stores_orderby=event.target.value;
self.submitForm(event);
},
toggleView: function(event){
const self=storeLists;
const currentElement=$(event.target);
const elements=currentElement.parent().find('span');
const view=currentElement.data('view');
self.setView(view, elements);
self.setLocal('dokan-layout', view);
},
setView: function(view, elements){
if(typeof view==='undefined'
|| view.length < 1
|| typeof elements==='undefined'
|| elements.length < 1
){
return;
}
const listingWrap=$('#dokan-seller-listing-wrap');
[...elements].forEach(function(value){
const element=$(value);
if(view===element.data('view')){
element.addClass('active');
listingWrap.addClass(view);
}else{
element.removeClass('active');
listingWrap.removeClass(element.data('view'));
}});
},
toggleForm: function(event){
event.preventDefault();
$('#dokan-store-listing-filter-form-wrap').slideToggle();
},
buildSearchQuery: function(event){
if(event.target.value){
storeLists.query.dokan_seller_search=event.target.value;
}else{
delete storeLists.query.dokan_seller_search;
}},
submitForm: function(event){
event.preventDefault();
const queryString=decodeURIComponent($.param(storeLists.query));
window.history.pushState(null, null, `?${queryString}`);
window.location.reload();
},
setLocal: function(key, value){
window.localStorage.setItem(key, value);
},
getLocal: function(key){
return window.localStorage.getItem(key);
},
setParams: function(key, value){
const self=storeLists;
const elements=self.form ? self.form.elements:'';
const sortingForm=document.forms.stores_sorting;
const sortingFormElements=sortingForm ? sortingForm.elements:'';
Object.values(sortingFormElements).forEach(function(element){
if(element.name===key[0]){
$(element).val(value[0]);
}});
Object.values(elements).forEach(function(element){
if(key.includes(element.name)){
if(element.type==='checkbox'){
element.checked=['yes', 'true', '1'].includes(value[0]) ? true:false;
}else if([ 'text', 'search' ].includes(element.type)){
element.value=value[0];
}}
if(key[0].includes('store_categories[')||key[0].includes('store_category[')){
const trimedValue=value[0].split(' ').join('-');
const cateItem=$(`[data-slug=${trimedValue}]`);
if(! self.cateItemStringArray.includes(cateItem.text().trim())){
self.cateItemStringArray.push(cateItem.text().trim());
}
cateItem.addClass('dokan-btn-theme');
}else if(key[0]==='rating'){
const trimedValue=value[0].split(' ').join('-');
$(`[data-${key[0]}=${trimedValue}]`).addClass('active');
$(`[data-rating=${trimedValue}]`).parent().addClass('selected');
}});
key.forEach(function(param, index){
if(! param.includes('[')){
self.query[ param ]=value[ index ];
}});
},
getParams: function(){
const params=new URLSearchParams(location.search);
const allParams=[];
params.forEach(function(value, key){
allParams.push({
[key]: value
});
});
return allParams;
},
maybeHideListView: function(){
const self=storeLists;
if(window.matchMedia('(max-width: 767px)').matches){
if('list-view'===self.getLocal('dokan-layout')){
self.setLocal('dokan-layout', 'grid-view');
}}
$(window).on('resize', function(){
const container=$(this);
if(container.width() < 767){
$('#dokan-seller-listing-wrap').removeClass('list-view');
$('#dokan-seller-listing-wrap').addClass('grid-view');
}else{
$('.toggle-view.item span').last().removeClass('active');
$('.toggle-view.item span').first().addClass('active');
}});
}};
if(window.dokan){
window.dokan.storeLists=storeLists;
window.dokan.storeLists.init();
}})(jQuery);
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){var b=function(){if(a&&a.fn&&a.fn.select2&&a.fn.select2.amd)var b=a.fn.select2.amd;var b;return function(){if(!b||!b.requirejs){b?c=b:b={};var a,c,d;!function(b){function e(a,b){return u.call(a,b)}function f(a,b){var c,d,e,f,g,h,i,j,k,l,m,n=b&&b.split("/"),o=s.map,p=o&&o["*"]||{};if(a&&"."===a.charAt(0))if(b){for(a=a.split("/"),g=a.length-1,s.nodeIdCompat&&w.test(a[g])&&(a[g]=a[g].replace(w,"")),a=n.slice(0,n.length-1).concat(a),k=0;k<a.length;k+=1)if(m=a[k],"."===m)a.splice(k,1),k-=1;else if(".."===m){if(1===k&&(".."===a[2]||".."===a[0]))break;k>0&&(a.splice(k-1,2),k-=2)}a=a.join("/")}else 0===a.indexOf("./")&&(a=a.substring(2));if((n||p)&&o){for(c=a.split("/"),k=c.length;k>0;k-=1){if(d=c.slice(0,k).join("/"),n)for(l=n.length;l>0;l-=1)if(e=o[n.slice(0,l).join("/")],e&&(e=e[d])){f=e,h=k;break}if(f)break;!i&&p&&p[d]&&(i=p[d],j=k)}!f&&i&&(f=i,h=j),f&&(c.splice(0,h,f),a=c.join("/"))}return a}function g(a,c){return function(){var d=v.call(arguments,0);return"string"!=typeof d[0]&&1===d.length&&d.push(null),n.apply(b,d.concat([a,c]))}}function h(a){return function(b){return f(b,a)}}function i(a){return function(b){q[a]=b}}function j(a){if(e(r,a)){var c=r[a];delete r[a],t[a]=!0,m.apply(b,c)}if(!e(q,a)&&!e(t,a))throw new Error("No "+a);return q[a]}function k(a){var b,c=a?a.indexOf("!"):-1;return c>-1&&(b=a.substring(0,c),a=a.substring(c+1,a.length)),[b,a]}function l(a){return function(){return s&&s.config&&s.config[a]||{}}}var m,n,o,p,q={},r={},s={},t={},u=Object.prototype.hasOwnProperty,v=[].slice,w=/\.js$/;o=function(a,b){var c,d=k(a),e=d[0];return a=d[1],e&&(e=f(e,b),c=j(e)),e?a=c&&c.normalize?c.normalize(a,h(b)):f(a,b):(a=f(a,b),d=k(a),e=d[0],a=d[1],e&&(c=j(e))),{f:e?e+"!"+a:a,n:a,pr:e,p:c}},p={require:function(a){return g(a)},exports:function(a){var b=q[a];return"undefined"!=typeof b?b:q[a]={}},module:function(a){return{id:a,uri:"",exports:q[a],config:l(a)}}},m=function(a,c,d,f){var h,k,l,m,n,s,u=[],v=typeof d;if(f=f||a,"undefined"===v||"function"===v){for(c=!c.length&&d.length?["require","exports","module"]:c,n=0;n<c.length;n+=1)if(m=o(c[n],f),k=m.f,"require"===k)u[n]=p.require(a);else if("exports"===k)u[n]=p.exports(a),s=!0;else if("module"===k)h=u[n]=p.module(a);else if(e(q,k)||e(r,k)||e(t,k))u[n]=j(k);else{if(!m.p)throw new Error(a+" missing "+k);m.p.load(m.n,g(f,!0),i(k),{}),u[n]=q[k]}l=d?d.apply(q[a],u):void 0,a&&(h&&h.exports!==b&&h.exports!==q[a]?q[a]=h.exports:l===b&&s||(q[a]=l))}else a&&(q[a]=d)},a=c=n=function(a,c,d,e,f){if("string"==typeof a)return p[a]?p[a](c):j(o(a,c).f);if(!a.splice){if(s=a,s.deps&&n(s.deps,s.callback),!c)return;c.splice?(a=c,c=d,d=null):a=b}return c=c||function(){},"function"==typeof d&&(d=e,e=f),e?m(b,a,c,d):setTimeout(function(){m(b,a,c,d)},4),n},n.config=function(a){return n(a)},a._defined=q,d=function(a,b,c){if("string"!=typeof a)throw new Error("See almond README: incorrect module build, no module name");b.splice||(c=b,b=[]),e(q,a)||e(r,a)||(r[a]=[a,b,c])},d.amd={jQuery:!0}}(),b.requirejs=a,b.require=c,b.define=d}}(),b.define("almond",function(){}),b.define("jquery",[],function(){var b=a||$;return null==b&&console&&console.error&&console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."),b}),b.define("select2/utils",["jquery"],function(a){function b(a){var b=a.prototype,c=[];for(var d in b){var e=b[d];"function"==typeof e&&"constructor"!==d&&c.push(d)}return c}var c={};c.Extend=function(a,b){function c(){this.constructor=a}var d={}.hasOwnProperty;for(var e in b)d.call(b,e)&&(a[e]=b[e]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},c.Decorate=function(a,c){function d(){var b=Array.prototype.unshift,d=c.prototype.constructor.length,e=a.prototype.constructor;d>0&&(b.call(arguments,a.prototype.constructor),e=c.prototype.constructor),e.apply(this,arguments)}function e(){this.constructor=d}var f=b(c),g=b(a);c.displayName=a.displayName,d.prototype=new e;for(var h=0;h<g.length;h++){var i=g[h];d.prototype[i]=a.prototype[i]}for(var j=(function(a){var b=function(){};a in d.prototype&&(b=d.prototype[a]);var e=c.prototype[a];return function(){var a=Array.prototype.unshift;return a.call(arguments,b),e.apply(this,arguments)}}),k=0;k<f.length;k++){var l=f[k];d.prototype[l]=j(l)}return d};var d=function(){this.listeners={}};return d.prototype.on=function(a,b){this.listeners=this.listeners||{},a in this.listeners?this.listeners[a].push(b):this.listeners[a]=[b]},d.prototype.trigger=function(a){var b=Array.prototype.slice,c=b.call(arguments,1);this.listeners=this.listeners||{},null==c&&(c=[]),0===c.length&&c.push({}),c[0]._type=a,a in this.listeners&&this.invoke(this.listeners[a],b.call(arguments,1)),"*"in this.listeners&&this.invoke(this.listeners["*"],arguments)},d.prototype.invoke=function(a,b){for(var c=0,d=a.length;d>c;c++)a[c].apply(this,b)},c.Observable=d,c.generateChars=function(a){for(var b="",c=0;a>c;c++){var d=Math.floor(36*Math.random());b+=d.toString(36)}return b},c.bind=function(a,b){return function(){a.apply(b,arguments)}},c._convertData=function(a){for(var b in a){var c=b.split("-"),d=a;if(1!==c.length){for(var e=0;e<c.length;e++){var f=c[e];f=f.substring(0,1).toLowerCase()+f.substring(1),f in d||(d[f]={}),e==c.length-1&&(d[f]=a[b]),d=d[f]}delete a[b]}}return a},c.hasScroll=function(b,c){var d=a(c),e=c.style.overflowX,f=c.style.overflowY;return e!==f||"hidden"!==f&&"visible"!==f?"scroll"===e||"scroll"===f?!0:d.innerHeight()<c.scrollHeight||d.innerWidth()<c.scrollWidth:!1},c.escapeMarkup=function(a){var b={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return"string"!=typeof a?a:String(a).replace(/[&<>"'\/\\]/g,function(a){return b[a]})},c.appendMany=function(b,c){if("1.7"===a.fn.jquery.substr(0,3)){var d=a();a.map(c,function(a){d=d.add(a)}),c=d}b.append(c)},c}),b.define("select2/results",["jquery","./utils"],function(a,b){function c(a,b,d){this.$element=a,this.data=d,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<ul class="select2-results__options" role="tree"></ul>');return this.options.get("multiple")&&b.attr("aria-multiselectable","true"),this.$results=b,b},c.prototype.clear=function(){this.$results.empty()},c.prototype.displayMessage=function(b){var c=this.options.get("escapeMarkup");this.clear(),this.hideLoading();var d=a('<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'),e=this.options.get("translations").get(b.message);d.append(c(e(b.args))),d[0].className+=" select2-results__message",this.$results.append(d)},c.prototype.hideMessages=function(){this.$results.find(".select2-results__message").remove()},c.prototype.append=function(a){this.hideLoading();var b=[];if(null==a.results||0===a.results.length)return void(0===this.$results.children().length&&this.trigger("results:message",{message:"noResults"}));a.results=this.sort(a.results);for(var c=0;c<a.results.length;c++){var d=a.results[c],e=this.option(d);b.push(e)}this.$results.append(b)},c.prototype.position=function(a,b){var c=b.find(".select2-results");c.append(a)},c.prototype.sort=function(a){var b=this.options.get("sorter");return b(a)},c.prototype.highlightFirstItem=function(){var a=this.$results.find(".select2-results__option[aria-selected]"),b=a.filter("[aria-selected=true]");b.length>0?b.first().trigger("mouseenter"):a.first().trigger("mouseenter"),this.ensureHighlightVisible()},c.prototype.setClasses=function(){var b=this;this.data.current(function(c){var d=a.map(c,function(a){return a.id.toString()}),e=b.$results.find(".select2-results__option[aria-selected]");e.each(function(){var b=a(this),c=a.data(this,"data"),e=""+c.id;null!=c.element&&c.element.selected||null==c.element&&a.inArray(e,d)>-1?b.attr("aria-selected","true"):b.attr("aria-selected","false")})})},c.prototype.showLoading=function(a){this.hideLoading();var b=this.options.get("translations").get("searching"),c={disabled:!0,loading:!0,text:b(a)},d=this.option(c);d.className+=" loading-results",this.$results.prepend(d)},c.prototype.hideLoading=function(){this.$results.find(".loading-results").remove()},c.prototype.option=function(b){var c=document.createElement("li");c.className="select2-results__option";var d={role:"treeitem","aria-selected":"false"};b.disabled&&(delete d["aria-selected"],d["aria-disabled"]="true"),null==b.id&&delete d["aria-selected"],null!=b._resultId&&(c.id=b._resultId),b.title&&(c.title=b.title),b.children&&(d.role="group",d["aria-label"]=b.text,delete d["aria-selected"]);for(var e in d){var f=d[e];c.setAttribute(e,f)}if(b.children){var g=a(c),h=document.createElement("strong");h.className="select2-results__group";a(h);this.template(b,h);for(var i=[],j=0;j<b.children.length;j++){var k=b.children[j],l=this.option(k);i.push(l)}var m=a("<ul></ul>",{"class":"select2-results__options select2-results__options--nested"});m.append(i),g.append(h),g.append(m)}else this.template(b,c);return a.data(c,"data",b),c},c.prototype.bind=function(b,c){var d=this,e=b.id+"-results";this.$results.attr("id",e),b.on("results:all",function(a){d.clear(),d.append(a.data),b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("results:append",function(a){d.append(a.data),b.isOpen()&&d.setClasses()}),b.on("query",function(a){d.hideMessages(),d.showLoading(a)}),b.on("select",function(){b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("unselect",function(){b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("open",function(){d.$results.attr("aria-expanded","true"),d.$results.attr("aria-hidden","false"),d.setClasses(),d.ensureHighlightVisible()}),b.on("close",function(){d.$results.attr("aria-expanded","false"),d.$results.attr("aria-hidden","true"),d.$results.removeAttr("aria-activedescendant")}),b.on("results:toggle",function(){var a=d.getHighlightedResults();0!==a.length&&a.trigger("mouseup")}),b.on("results:select",function(){var a=d.getHighlightedResults();if(0!==a.length){var b=a.data("data");"true"==a.attr("aria-selected")?d.trigger("close",{}):d.trigger("select",{data:b})}}),b.on("results:previous",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a);if(0!==c){var e=c-1;0===a.length&&(e=0);var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top,h=f.offset().top,i=d.$results.scrollTop()+(h-g);0===e?d.$results.scrollTop(0):0>h-g&&d.$results.scrollTop(i)}}),b.on("results:next",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a),e=c+1;if(!(e>=b.length)){var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top+d.$results.outerHeight(!1),h=f.offset().top+f.outerHeight(!1),i=d.$results.scrollTop()+h-g;0===e?d.$results.scrollTop(0):h>g&&d.$results.scrollTop(i)}}),b.on("results:focus",function(a){a.element.addClass("select2-results__option--highlighted")}),b.on("results:message",function(a){d.displayMessage(a)}),a.fn.mousewheel&&this.$results.on("mousewheel",function(a){var b=d.$results.scrollTop(),c=d.$results.get(0).scrollHeight-b+a.deltaY,e=a.deltaY>0&&b-a.deltaY<=0,f=a.deltaY<0&&c<=d.$results.height();e?(d.$results.scrollTop(0),a.preventDefault(),a.stopPropagation()):f&&(d.$results.scrollTop(d.$results.get(0).scrollHeight-d.$results.height()),a.preventDefault(),a.stopPropagation())}),this.$results.on("mouseup",".select2-results__option[aria-selected]",function(b){var c=a(this),e=c.data("data");return"true"===c.attr("aria-selected")?void(d.options.get("multiple")?d.trigger("unselect",{originalEvent:b,data:e}):d.trigger("close",{})):void d.trigger("select",{originalEvent:b,data:e})}),this.$results.on("mouseenter",".select2-results__option[aria-selected]",function(b){var c=a(this).data("data");d.getHighlightedResults().removeClass("select2-results__option--highlighted"),d.trigger("results:focus",{data:c,element:a(this)})})},c.prototype.getHighlightedResults=function(){var a=this.$results.find(".select2-results__option--highlighted");return a},c.prototype.destroy=function(){this.$results.remove()},c.prototype.ensureHighlightVisible=function(){var a=this.getHighlightedResults();if(0!==a.length){var b=this.$results.find("[aria-selected]"),c=b.index(a),d=this.$results.offset().top,e=a.offset().top,f=this.$results.scrollTop()+(e-d),g=e-d;f-=2*a.outerHeight(!1),2>=c?this.$results.scrollTop(0):(g>this.$results.outerHeight()||0>g)&&this.$results.scrollTop(f)}},c.prototype.template=function(b,c){var d=this.options.get("templateResult"),e=this.options.get("escapeMarkup"),f=d(b,c);null==f?c.style.display="none":"string"==typeof f?c.innerHTML=e(f):a(c).append(f)},c}),b.define("select2/keys",[],function(){var a={BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46};return a}),b.define("select2/selection/base",["jquery","../utils","../keys"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,b.Observable),d.prototype.render=function(){var b=a('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');return this._tabindex=0,null!=this.$element.data("old-tabindex")?this._tabindex=this.$element.data("old-tabindex"):null!=this.$element.attr("tabindex")&&(this._tabindex=this.$element.attr("tabindex")),b.attr("title",this.$element.attr("title")),b.attr("tabindex",this._tabindex),this.$selection=b,b},d.prototype.bind=function(a,b){var d=this,e=(a.id+"-container",a.id+"-results");this.container=a,this.$selection.on("focus",function(a){d.trigger("focus",a)}),this.$selection.on("blur",function(a){d._handleBlur(a)}),this.$selection.on("keydown",function(a){d.trigger("keypress",a),a.which===c.SPACE&&a.preventDefault()}),a.on("results:focus",function(a){d.$selection.attr("aria-activedescendant",a.data._resultId)}),a.on("selection:update",function(a){d.update(a.data)}),a.on("open",function(){d.$selection.attr("aria-expanded","true"),d.$selection.attr("aria-owns",e),d._attachCloseHandler(a)}),a.on("close",function(){d.$selection.attr("aria-expanded","false"),d.$selection.removeAttr("aria-activedescendant"),d.$selection.removeAttr("aria-owns"),d.$selection.focus(),d._detachCloseHandler(a)}),a.on("enable",function(){d.$selection.attr("tabindex",d._tabindex)}),a.on("disable",function(){d.$selection.attr("tabindex","-1")})},d.prototype._handleBlur=function(b){var c=this;window.setTimeout(function(){document.activeElement==c.$selection[0]||a.contains(c.$selection[0],document.activeElement)||c.trigger("blur",b)},1)},d.prototype._attachCloseHandler=function(b){a(document.body).on("mousedown.select2."+b.id,function(b){var c=a(b.target),d=c.closest(".select2"),e=a(".select2.select2-container--open");e.each(function(){var b=a(this);if(this!=d[0]){var c=b.data("element");c.select2("close")}})})},d.prototype._detachCloseHandler=function(b){a(document.body).off("mousedown.select2."+b.id)},d.prototype.position=function(a,b){var c=b.find(".selection");c.append(a)},d.prototype.destroy=function(){this._detachCloseHandler(this.container)},d.prototype.update=function(a){throw new Error("The `update` method must be defined in child classes.")},d}),b.define("select2/selection/single",["jquery","./base","../utils","../keys"],function(a,b,c,d){function e(){e.__super__.constructor.apply(this,arguments)}return c.Extend(e,b),e.prototype.render=function(){var a=e.__super__.render.call(this);return a.addClass("select2-selection--single"),a.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'),a},e.prototype.bind=function(a,b){var c=this;e.__super__.bind.apply(this,arguments);var d=a.id+"-container";this.$selection.find(".select2-selection__rendered").attr("id",d),this.$selection.attr("aria-labelledby",d),this.$selection.on("mousedown",function(a){1===a.which&&c.trigger("toggle",{originalEvent:a})}),this.$selection.on("focus",function(a){}),this.$selection.on("blur",function(a){}),a.on("focus",function(b){a.isOpen()||c.$selection.focus()}),a.on("selection:update",function(a){c.update(a.data)})},e.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},e.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},e.prototype.selectionContainer=function(){return a("<span></span>")},e.prototype.update=function(a){if(0===a.length)return void this.clear();var b=a[0],c=this.$selection.find(".select2-selection__rendered"),d=this.display(b,c);c.empty().append(d),c.prop("title",b.title||b.text)},e}),b.define("select2/selection/multiple",["jquery","./base","../utils"],function(a,b,c){function d(a,b){d.__super__.constructor.apply(this,arguments)}return c.Extend(d,b),d.prototype.render=function(){var a=d.__super__.render.call(this);return a.addClass("select2-selection--multiple"),a.html('<ul class="select2-selection__rendered"></ul>'),a},d.prototype.bind=function(b,c){var e=this;d.__super__.bind.apply(this,arguments),this.$selection.on("click",function(a){e.trigger("toggle",{originalEvent:a})}),this.$selection.on("click",".select2-selection__choice__remove",function(b){if(!e.options.get("disabled")){var c=a(this),d=c.parent(),f=d.data("data");e.trigger("unselect",{originalEvent:b,data:f})}})},d.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},d.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},d.prototype.selectionContainer=function(){var b=a('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>');return b},d.prototype.update=function(a){if(this.clear(),0!==a.length){for(var b=[],d=0;d<a.length;d++){var e=a[d],f=this.selectionContainer(),g=this.display(e,f);f.append(g),f.prop("title",e.title||e.text),f.data("data",e),b.push(f)}var h=this.$selection.find(".select2-selection__rendered");c.appendMany(h,b)}},d}),b.define("select2/selection/placeholder",["../utils"],function(a){function b(a,b,c){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c)}return b.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},b.prototype.createPlaceholder=function(a,b){var c=this.selectionContainer();return c.html(this.display(b)),c.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"),c},b.prototype.update=function(a,b){var c=1==b.length&&b[0].id!=this.placeholder.id,d=b.length>1;if(d||c)return a.call(this,b);this.clear();var e=this.createPlaceholder(this.placeholder);this.$selection.find(".select2-selection__rendered").append(e)},b}),b.define("select2/selection/allowClear",["jquery","../keys"],function(a,b){function c(){}return c.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),null==this.placeholder&&this.options.get("debug")&&window.console&&console.error&&console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."),this.$selection.on("mousedown",".select2-selection__clear",function(a){d._handleClear(a)}),b.on("keypress",function(a){d._handleKeyboardClear(a,b)})},c.prototype._handleClear=function(a,b){if(!this.options.get("disabled")){var c=this.$selection.find(".select2-selection__clear");if(0!==c.length){b.stopPropagation();for(var d=c.data("data"),e=0;e<d.length;e++){var f={data:d[e]};if(this.trigger("unselect",f),f.prevented)return}this.$element.val(this.placeholder.id).trigger("change"),this.trigger("toggle",{})}}},c.prototype._handleKeyboardClear=function(a,c,d){d.isOpen()||(c.which==b.DELETE||c.which==b.BACKSPACE)&&this._handleClear(c)},c.prototype.update=function(b,c){if(b.call(this,c),!(this.$selection.find(".select2-selection__placeholder").length>0||0===c.length)){var d=a('<span class="select2-selection__clear">&times;</span>');d.data("data",c),this.$selection.find(".select2-selection__rendered").prepend(d)}},c}),b.define("select2/selection/search",["jquery","../utils","../keys"],function(a,b,c){function d(a,b,c){a.call(this,b,c)}return d.prototype.render=function(b){var c=a('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>');this.$searchContainer=c,this.$search=c.find("input");var d=b.call(this);return this._transferTabIndex(),d},d.prototype.bind=function(a,b,d){var e=this;a.call(this,b,d),b.on("open",function(){e.$search.trigger("focus")}),b.on("close",function(){e.$search.val(""),e.$search.removeAttr("aria-activedescendant"),e.$search.trigger("focus")}),b.on("enable",function(){e.$search.prop("disabled",!1),e._transferTabIndex()}),b.on("disable",function(){e.$search.prop("disabled",!0)}),b.on("focus",function(a){e.$search.trigger("focus")}),b.on("results:focus",function(a){e.$search.attr("aria-activedescendant",a.id)}),this.$selection.on("focusin",".select2-search--inline",function(a){e.trigger("focus",a)}),this.$selection.on("focusout",".select2-search--inline",function(a){e._handleBlur(a)}),this.$selection.on("keydown",".select2-search--inline",function(a){a.stopPropagation(),e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented();var b=a.which;if(b===c.BACKSPACE&&""===e.$search.val()){var d=e.$searchContainer.prev(".select2-selection__choice");if(d.length>0){var f=d.data("data");e.searchRemoveChoice(f),a.preventDefault()}}});var f=document.documentMode,g=f&&11>=f;this.$selection.on("input.searchcheck",".select2-search--inline",function(a){return g?void e.$selection.off("input.search input.searchcheck"):void e.$selection.off("keyup.search")}),this.$selection.on("keyup.search input.search",".select2-search--inline",function(a){if(g&&"input"===a.type)return void e.$selection.off("input.search input.searchcheck");var b=a.which;b!=c.SHIFT&&b!=c.CTRL&&b!=c.ALT&&b!=c.TAB&&e.handleSearch(a)})},d.prototype._transferTabIndex=function(a){this.$search.attr("tabindex",this.$selection.attr("tabindex")),this.$selection.attr("tabindex","-1")},d.prototype.createPlaceholder=function(a,b){this.$search.attr("placeholder",b.text)},d.prototype.update=function(a,b){var c=this.$search[0]==document.activeElement;this.$search.attr("placeholder",""),a.call(this,b),this.$selection.find(".select2-selection__rendered").append(this.$searchContainer),this.resizeSearch(),c&&this.$search.focus()},d.prototype.handleSearch=function(){if(this.resizeSearch(),!this._keyUpPrevented){var a=this.$search.val();this.trigger("query",{term:a})}this._keyUpPrevented=!1},d.prototype.searchRemoveChoice=function(a,b){this.trigger("unselect",{data:b}),this.$search.val(b.text),this.handleSearch()},d.prototype.resizeSearch=function(){this.$search.css("width","25px");var a="";if(""!==this.$search.attr("placeholder"))a=this.$selection.find(".select2-selection__rendered").innerWidth();else{var b=this.$search.val().length+1;a=.75*b+"em"}this.$search.css("width",a)},d}),b.define("select2/selection/eventRelay",["jquery"],function(a){function b(){}return b.prototype.bind=function(b,c,d){var e=this,f=["open","opening","close","closing","select","selecting","unselect","unselecting"],g=["opening","closing","selecting","unselecting"];b.call(this,c,d),c.on("*",function(b,c){if(-1!==a.inArray(b,f)){c=c||{};var d=a.Event("select2:"+b,{params:c});e.$element.trigger(d),-1!==a.inArray(b,g)&&(c.prevented=d.isDefaultPrevented())}})},b}),b.define("select2/translation",["jquery","require"],function(a,b){function c(a){this.dict=a||{}}return c.prototype.all=function(){return this.dict},c.prototype.get=function(a){return this.dict[a]},c.prototype.extend=function(b){this.dict=a.extend({},b.all(),this.dict)},c._cache={},c.loadPath=function(a){if(!(a in c._cache)){var d=b(a);c._cache[a]=d}return new c(c._cache[a])},c}),b.define("select2/diacritics",[],function(){var a={"Ⓐ":"A","Ａ":"A","À":"A","Á":"A","Â":"A","Ầ":"A","Ấ":"A","Ẫ":"A","Ẩ":"A","Ã":"A","Ā":"A","Ă":"A","Ằ":"A","Ắ":"A","Ẵ":"A","Ẳ":"A","Ȧ":"A","Ǡ":"A","Ä":"A","Ǟ":"A","Ả":"A","Å":"A","Ǻ":"A","Ǎ":"A","Ȁ":"A","Ȃ":"A","Ạ":"A","Ậ":"A","Ặ":"A","Ḁ":"A","Ą":"A","Ⱥ":"A","Ɐ":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ⓑ":"B","Ｂ":"B","Ḃ":"B","Ḅ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ɓ":"B","Ⓒ":"C","Ｃ":"C","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","Ç":"C","Ḉ":"C","Ƈ":"C","Ȼ":"C","Ꜿ":"C","Ⓓ":"D","Ｄ":"D","Ḋ":"D","Ď":"D","Ḍ":"D","Ḑ":"D","Ḓ":"D","Ḏ":"D","Đ":"D","Ƌ":"D","Ɗ":"D","Ɖ":"D","Ꝺ":"D","Ǳ":"DZ","Ǆ":"DZ","ǲ":"Dz","ǅ":"Dz","Ⓔ":"E","Ｅ":"E","È":"E","É":"E","Ê":"E","Ề":"E","Ế":"E","Ễ":"E","Ể":"E","Ẽ":"E","Ē":"E","Ḕ":"E","Ḗ":"E","Ĕ":"E","Ė":"E","Ë":"E","Ẻ":"E","Ě":"E","Ȅ":"E","Ȇ":"E","Ẹ":"E","Ệ":"E","Ȩ":"E","Ḝ":"E","Ę":"E","Ḙ":"E","Ḛ":"E","Ɛ":"E","Ǝ":"E","Ⓕ":"F","Ｆ":"F","Ḟ":"F","Ƒ":"F","Ꝼ":"F","Ⓖ":"G","Ｇ":"G","Ǵ":"G","Ĝ":"G","Ḡ":"G","Ğ":"G","Ġ":"G","Ǧ":"G","Ģ":"G","Ǥ":"G","Ɠ":"G","Ꞡ":"G","Ᵹ":"G","Ꝿ":"G","Ⓗ":"H","Ｈ":"H","Ĥ":"H","Ḣ":"H","Ḧ":"H","Ȟ":"H","Ḥ":"H","Ḩ":"H","Ḫ":"H","Ħ":"H","Ⱨ":"H","Ⱶ":"H","Ɥ":"H","Ⓘ":"I","Ｉ":"I","Ì":"I","Í":"I","Î":"I","Ĩ":"I","Ī":"I","Ĭ":"I","İ":"I","Ï":"I","Ḯ":"I","Ỉ":"I","Ǐ":"I","Ȉ":"I","Ȋ":"I","Ị":"I","Į":"I","Ḭ":"I","Ɨ":"I","Ⓙ":"J","Ｊ":"J","Ĵ":"J","Ɉ":"J","Ⓚ":"K","Ｋ":"K","Ḱ":"K","Ǩ":"K","Ḳ":"K","Ķ":"K","Ḵ":"K","Ƙ":"K","Ⱪ":"K","Ꝁ":"K","Ꝃ":"K","Ꝅ":"K","Ꞣ":"K","Ⓛ":"L","Ｌ":"L","Ŀ":"L","Ĺ":"L","Ľ":"L","Ḷ":"L","Ḹ":"L","Ļ":"L","Ḽ":"L","Ḻ":"L","Ł":"L","Ƚ":"L","Ɫ":"L","Ⱡ":"L","Ꝉ":"L","Ꝇ":"L","Ꞁ":"L","Ǉ":"LJ","ǈ":"Lj","Ⓜ":"M","Ｍ":"M","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ɯ":"M","Ⓝ":"N","Ｎ":"N","Ǹ":"N","Ń":"N","Ñ":"N","Ṅ":"N","Ň":"N","Ṇ":"N","Ņ":"N","Ṋ":"N","Ṉ":"N","Ƞ":"N","Ɲ":"N","Ꞑ":"N","Ꞥ":"N","Ǌ":"NJ","ǋ":"Nj","Ⓞ":"O","Ｏ":"O","Ò":"O","Ó":"O","Ô":"O","Ồ":"O","Ố":"O","Ỗ":"O","Ổ":"O","Õ":"O","Ṍ":"O","Ȭ":"O","Ṏ":"O","Ō":"O","Ṑ":"O","Ṓ":"O","Ŏ":"O","Ȯ":"O","Ȱ":"O","Ö":"O","Ȫ":"O","Ỏ":"O","Ő":"O","Ǒ":"O","Ȍ":"O","Ȏ":"O","Ơ":"O","Ờ":"O","Ớ":"O","Ỡ":"O","Ở":"O","Ợ":"O","Ọ":"O","Ộ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Ɔ":"O","Ɵ":"O","Ꝋ":"O","Ꝍ":"O","Ƣ":"OI","Ꝏ":"OO","Ȣ":"OU","Ⓟ":"P","Ｐ":"P","Ṕ":"P","Ṗ":"P","Ƥ":"P","Ᵽ":"P","Ꝑ":"P","Ꝓ":"P","Ꝕ":"P","Ⓠ":"Q","Ｑ":"Q","Ꝗ":"Q","Ꝙ":"Q","Ɋ":"Q","Ⓡ":"R","Ｒ":"R","Ŕ":"R","Ṙ":"R","Ř":"R","Ȑ":"R","Ȓ":"R","Ṛ":"R","Ṝ":"R","Ŗ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꝛ":"R","Ꞧ":"R","Ꞃ":"R","Ⓢ":"S","Ｓ":"S","ẞ":"S","Ś":"S","Ṥ":"S","Ŝ":"S","Ṡ":"S","Š":"S","Ṧ":"S","Ṣ":"S","Ṩ":"S","Ș":"S","Ş":"S","Ȿ":"S","Ꞩ":"S","Ꞅ":"S","Ⓣ":"T","Ｔ":"T","Ṫ":"T","Ť":"T","Ṭ":"T","Ț":"T","Ţ":"T","Ṱ":"T","Ṯ":"T","Ŧ":"T","Ƭ":"T","Ʈ":"T","Ⱦ":"T","Ꞇ":"T","Ꜩ":"TZ","Ⓤ":"U","Ｕ":"U","Ù":"U","Ú":"U","Û":"U","Ũ":"U","Ṹ":"U","Ū":"U","Ṻ":"U","Ŭ":"U","Ü":"U","Ǜ":"U","Ǘ":"U","Ǖ":"U","Ǚ":"U","Ủ":"U","Ů":"U","Ű":"U","Ǔ":"U","Ȕ":"U","Ȗ":"U","Ư":"U","Ừ":"U","Ứ":"U","Ữ":"U","Ử":"U","Ự":"U","Ụ":"U","Ṳ":"U","Ų":"U","Ṷ":"U","Ṵ":"U","Ʉ":"U","Ⓥ":"V","Ｖ":"V","Ṽ":"V","Ṿ":"V","Ʋ":"V","Ꝟ":"V","Ʌ":"V","Ꝡ":"VY","Ⓦ":"W","Ｗ":"W","Ẁ":"W","Ẃ":"W","Ŵ":"W","Ẇ":"W","Ẅ":"W","Ẉ":"W","Ⱳ":"W","Ⓧ":"X","Ｘ":"X","Ẋ":"X","Ẍ":"X","Ⓨ":"Y","Ｙ":"Y","Ỳ":"Y","Ý":"Y","Ŷ":"Y","Ỹ":"Y","Ȳ":"Y","Ẏ":"Y","Ÿ":"Y","Ỷ":"Y","Ỵ":"Y","Ƴ":"Y","Ɏ":"Y","Ỿ":"Y","Ⓩ":"Z","Ｚ":"Z","Ź":"Z","Ẑ":"Z","Ż":"Z","Ž":"Z","Ẓ":"Z","Ẕ":"Z","Ƶ":"Z","Ȥ":"Z","Ɀ":"Z","Ⱬ":"Z","Ꝣ":"Z","ⓐ":"a","ａ":"a","ẚ":"a","à":"a","á":"a","â":"a","ầ":"a","ấ":"a","ẫ":"a","ẩ":"a","ã":"a","ā":"a","ă":"a","ằ":"a","ắ":"a","ẵ":"a","ẳ":"a","ȧ":"a","ǡ":"a","ä":"a","ǟ":"a","ả":"a","å":"a","ǻ":"a","ǎ":"a","ȁ":"a","ȃ":"a","ạ":"a","ậ":"a","ặ":"a","ḁ":"a","ą":"a","ⱥ":"a","ɐ":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ⓑ":"b","ｂ":"b","ḃ":"b","ḅ":"b","ḇ":"b","ƀ":"b","ƃ":"b","ɓ":"b","ⓒ":"c","ｃ":"c","ć":"c","ĉ":"c","ċ":"c","č":"c","ç":"c","ḉ":"c","ƈ":"c","ȼ":"c","ꜿ":"c","ↄ":"c","ⓓ":"d","ｄ":"d","ḋ":"d","ď":"d","ḍ":"d","ḑ":"d","ḓ":"d","ḏ":"d","đ":"d","ƌ":"d","ɖ":"d","ɗ":"d","ꝺ":"d","ǳ":"dz","ǆ":"dz","ⓔ":"e","ｅ":"e","è":"e","é":"e","ê":"e","ề":"e","ế":"e","ễ":"e","ể":"e","ẽ":"e","ē":"e","ḕ":"e","ḗ":"e","ĕ":"e","ė":"e","ë":"e","ẻ":"e","ě":"e","ȅ":"e","ȇ":"e","ẹ":"e","ệ":"e","ȩ":"e","ḝ":"e","ę":"e","ḙ":"e","ḛ":"e","ɇ":"e","ɛ":"e","ǝ":"e","ⓕ":"f","ｆ":"f","ḟ":"f","ƒ":"f","ꝼ":"f","ⓖ":"g","ｇ":"g","ǵ":"g","ĝ":"g","ḡ":"g","ğ":"g","ġ":"g","ǧ":"g","ģ":"g","ǥ":"g","ɠ":"g","ꞡ":"g","ᵹ":"g","ꝿ":"g","ⓗ":"h","ｈ":"h","ĥ":"h","ḣ":"h","ḧ":"h","ȟ":"h","ḥ":"h","ḩ":"h","ḫ":"h","ẖ":"h","ħ":"h","ⱨ":"h","ⱶ":"h","ɥ":"h","ƕ":"hv","ⓘ":"i","ｉ":"i","ì":"i","í":"i","î":"i","ĩ":"i","ī":"i","ĭ":"i","ï":"i","ḯ":"i","ỉ":"i","ǐ":"i","ȉ":"i","ȋ":"i","ị":"i","į":"i","ḭ":"i","ɨ":"i","ı":"i","ⓙ":"j","ｊ":"j","ĵ":"j","ǰ":"j","ɉ":"j","ⓚ":"k","ｋ":"k","ḱ":"k","ǩ":"k","ḳ":"k","ķ":"k","ḵ":"k","ƙ":"k","ⱪ":"k","ꝁ":"k","ꝃ":"k","ꝅ":"k","ꞣ":"k","ⓛ":"l","ｌ":"l","ŀ":"l","ĺ":"l","ľ":"l","ḷ":"l","ḹ":"l","ļ":"l","ḽ":"l","ḻ":"l","ſ":"l","ł":"l","ƚ":"l","ɫ":"l","ⱡ":"l","ꝉ":"l","ꞁ":"l","ꝇ":"l","ǉ":"lj","ⓜ":"m","ｍ":"m","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ɯ":"m","ⓝ":"n","ｎ":"n","ǹ":"n","ń":"n","ñ":"n","ṅ":"n","ň":"n","ṇ":"n","ņ":"n","ṋ":"n","ṉ":"n","ƞ":"n","ɲ":"n","ŉ":"n","ꞑ":"n","ꞥ":"n","ǌ":"nj","ⓞ":"o","ｏ":"o","ò":"o","ó":"o","ô":"o","ồ":"o","ố":"o","ỗ":"o","ổ":"o","õ":"o","ṍ":"o","ȭ":"o","ṏ":"o","ō":"o","ṑ":"o","ṓ":"o","ŏ":"o","ȯ":"o","ȱ":"o","ö":"o","ȫ":"o","ỏ":"o","ő":"o","ǒ":"o","ȍ":"o","ȏ":"o","ơ":"o","ờ":"o","ớ":"o","ỡ":"o","ở":"o","ợ":"o","ọ":"o","ộ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","ɔ":"o","ꝋ":"o","ꝍ":"o","ɵ":"o","ƣ":"oi","ȣ":"ou","ꝏ":"oo","ⓟ":"p","ｐ":"p","ṕ":"p","ṗ":"p","ƥ":"p","ᵽ":"p","ꝑ":"p","ꝓ":"p","ꝕ":"p","ⓠ":"q","ｑ":"q","ɋ":"q","ꝗ":"q","ꝙ":"q","ⓡ":"r","ｒ":"r","ŕ":"r","ṙ":"r","ř":"r","ȑ":"r","ȓ":"r","ṛ":"r","ṝ":"r","ŗ":"r","ṟ":"r","ɍ":"r","ɽ":"r","ꝛ":"r","ꞧ":"r","ꞃ":"r","ⓢ":"s","ｓ":"s","ß":"s","ś":"s","ṥ":"s","ŝ":"s","ṡ":"s","š":"s","ṧ":"s","ṣ":"s","ṩ":"s","ș":"s","ş":"s","ȿ":"s","ꞩ":"s","ꞅ":"s","ẛ":"s","ⓣ":"t","ｔ":"t","ṫ":"t","ẗ":"t","ť":"t","ṭ":"t","ț":"t","ţ":"t","ṱ":"t","ṯ":"t","ŧ":"t","ƭ":"t","ʈ":"t","ⱦ":"t","ꞇ":"t","ꜩ":"tz","ⓤ":"u","ｕ":"u","ù":"u","ú":"u","û":"u","ũ":"u","ṹ":"u","ū":"u","ṻ":"u","ŭ":"u","ü":"u","ǜ":"u","ǘ":"u","ǖ":"u","ǚ":"u","ủ":"u","ů":"u","ű":"u","ǔ":"u","ȕ":"u","ȗ":"u","ư":"u","ừ":"u","ứ":"u","ữ":"u","ử":"u","ự":"u","ụ":"u","ṳ":"u","ų":"u","ṷ":"u","ṵ":"u","ʉ":"u","ⓥ":"v","ｖ":"v","ṽ":"v","ṿ":"v","ʋ":"v","ꝟ":"v","ʌ":"v","ꝡ":"vy","ⓦ":"w","ｗ":"w","ẁ":"w","ẃ":"w","ŵ":"w","ẇ":"w","ẅ":"w","ẘ":"w","ẉ":"w","ⱳ":"w","ⓧ":"x","ｘ":"x","ẋ":"x","ẍ":"x","ⓨ":"y","ｙ":"y","ỳ":"y","ý":"y","ŷ":"y","ỹ":"y","ȳ":"y","ẏ":"y","ÿ":"y","ỷ":"y","ẙ":"y","ỵ":"y","ƴ":"y","ɏ":"y","ỿ":"y","ⓩ":"z","ｚ":"z","ź":"z","ẑ":"z","ż":"z","ž":"z","ẓ":"z","ẕ":"z","ƶ":"z","ȥ":"z","ɀ":"z","ⱬ":"z","ꝣ":"z","Ά":"Α","Έ":"Ε","Ή":"Η","Ί":"Ι","Ϊ":"Ι","Ό":"Ο","Ύ":"Υ","Ϋ":"Υ","Ώ":"Ω","ά":"α","έ":"ε","ή":"η","ί":"ι","ϊ":"ι","ΐ":"ι","ό":"ο","ύ":"υ","ϋ":"υ","ΰ":"υ","ω":"ω","ς":"σ"};return a}),b.define("select2/data/base",["../utils"],function(a){function b(a,c){b.__super__.constructor.call(this)}return a.Extend(b,a.Observable),b.prototype.current=function(a){throw new Error("The `current` method must be defined in child classes.")},b.prototype.query=function(a,b){throw new Error("The `query` method must be defined in child classes.")},b.prototype.bind=function(a,b){},b.prototype.destroy=function(){},b.prototype.generateResultId=function(b,c){var d=b.id+"-result-";return d+=a.generateChars(4),d+=null!=c.id?"-"+c.id.toString():"-"+a.generateChars(4)},b}),b.define("select2/data/select",["./base","../utils","jquery"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,a),d.prototype.current=function(a){var b=[],d=this;this.$element.find(":selected").each(function(){var a=c(this),e=d.item(a);b.push(e)}),a(b)},d.prototype.select=function(a){var b=this;if(a.selected=!0,c(a.element).is("option"))return a.element.selected=!0,void this.$element.trigger("change");
if(this.$element.prop("multiple"))this.current(function(d){var e=[];a=[a],a.push.apply(a,d);for(var f=0;f<a.length;f++){var g=a[f].id;-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")});else{var d=a.id;this.$element.val(d),this.$element.trigger("change")}},d.prototype.unselect=function(a){var b=this;if(this.$element.prop("multiple"))return a.selected=!1,c(a.element).is("option")?(a.element.selected=!1,void this.$element.trigger("change")):void this.current(function(d){for(var e=[],f=0;f<d.length;f++){var g=d[f].id;g!==a.id&&-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")})},d.prototype.bind=function(a,b){var c=this;this.container=a,a.on("select",function(a){c.select(a.data)}),a.on("unselect",function(a){c.unselect(a.data)})},d.prototype.destroy=function(){this.$element.find("*").each(function(){c.removeData(this,"data")})},d.prototype.query=function(a,b){var d=[],e=this,f=this.$element.children();f.each(function(){var b=c(this);if(b.is("option")||b.is("optgroup")){var f=e.item(b),g=e.matches(a,f);null!==g&&d.push(g)}}),b({results:d})},d.prototype.addOptions=function(a){b.appendMany(this.$element,a)},d.prototype.option=function(a){var b;a.children?(b=document.createElement("optgroup"),b.label=a.text):(b=document.createElement("option"),void 0!==b.textContent?b.textContent=a.text:b.innerText=a.text),a.id&&(b.value=a.id),a.disabled&&(b.disabled=!0),a.selected&&(b.selected=!0),a.title&&(b.title=a.title);var d=c(b),e=this._normalizeItem(a);return e.element=b,c.data(b,"data",e),d},d.prototype.item=function(a){var b={};if(b=c.data(a[0],"data"),null!=b)return b;if(a.is("option"))b={id:a.val(),text:a.text(),disabled:a.prop("disabled"),selected:a.prop("selected"),title:a.prop("title")};else if(a.is("optgroup")){b={text:a.prop("label"),children:[],title:a.prop("title")};for(var d=a.children("option"),e=[],f=0;f<d.length;f++){var g=c(d[f]),h=this.item(g);e.push(h)}b.children=e}return b=this._normalizeItem(b),b.element=a[0],c.data(a[0],"data",b),b},d.prototype._normalizeItem=function(a){c.isPlainObject(a)||(a={id:a,text:a}),a=c.extend({},{text:""},a);var b={selected:!1,disabled:!1};return null!=a.id&&(a.id=a.id.toString()),null!=a.text&&(a.text=a.text.toString()),null==a._resultId&&a.id&&null!=this.container&&(a._resultId=this.generateResultId(this.container,a)),c.extend({},b,a)},d.prototype.matches=function(a,b){var c=this.options.get("matcher");return c(a,b)},d}),b.define("select2/data/array",["./select","../utils","jquery"],function(a,b,c){function d(a,b){var c=b.get("data")||[];d.__super__.constructor.call(this,a,b),this.addOptions(this.convertToOptions(c))}return b.Extend(d,a),d.prototype.select=function(a){var b=this.$element.find("option").filter(function(b,c){return c.value==a.id.toString()});0===b.length&&(b=this.option(a),this.addOptions(b)),d.__super__.select.call(this,a)},d.prototype.convertToOptions=function(a){function d(a){return function(){return c(this).val()==a.id}}for(var e=this,f=this.$element.find("option"),g=f.map(function(){return e.item(c(this)).id}).get(),h=[],i=0;i<a.length;i++){var j=this._normalizeItem(a[i]);if(c.inArray(j.id,g)>=0){var k=f.filter(d(j)),l=this.item(k),m=c.extend(!0,{},j,l),n=this.option(m);k.replaceWith(n)}else{var o=this.option(j);if(j.children){var p=this.convertToOptions(j.children);b.appendMany(o,p)}h.push(o)}}return h},d}),b.define("select2/data/ajax",["./array","../utils","jquery"],function(a,b,c){function d(a,b){this.ajaxOptions=this._applyDefaults(b.get("ajax")),null!=this.ajaxOptions.processResults&&(this.processResults=this.ajaxOptions.processResults),d.__super__.constructor.call(this,a,b)}return b.Extend(d,a),d.prototype._applyDefaults=function(a){var b={data:function(a){return c.extend({},a,{q:a.term})},transport:function(a,b,d){var e=c.ajax(a);return e.then(b),e.fail(d),e}};return c.extend({},b,a,!0)},d.prototype.processResults=function(a){return a},d.prototype.query=function(a,b){function d(){var d=f.transport(f,function(d){var f=e.processResults(d,a);e.options.get("debug")&&window.console&&console.error&&(f&&f.results&&c.isArray(f.results)||console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")),b(f)},function(){d.status&&"0"===d.status||e.trigger("results:message",{message:"errorLoading"})});e._request=d}var e=this;null!=this._request&&(c.isFunction(this._request.abort)&&this._request.abort(),this._request=null);var f=c.extend({type:"GET"},this.ajaxOptions);"function"==typeof f.url&&(f.url=f.url.call(this.$element,a)),"function"==typeof f.data&&(f.data=f.data.call(this.$element,a)),this.ajaxOptions.delay&&null!=a.term?(this._queryTimeout&&window.clearTimeout(this._queryTimeout),this._queryTimeout=window.setTimeout(d,this.ajaxOptions.delay)):d()},d}),b.define("select2/data/tags",["jquery"],function(a){function b(b,c,d){var e=d.get("tags"),f=d.get("createTag");void 0!==f&&(this.createTag=f);var g=d.get("insertTag");if(void 0!==g&&(this.insertTag=g),b.call(this,c,d),a.isArray(e))for(var h=0;h<e.length;h++){var i=e[h],j=this._normalizeItem(i),k=this.option(j);this.$element.append(k)}}return b.prototype.query=function(a,b,c){function d(a,f){for(var g=a.results,h=0;h<g.length;h++){var i=g[h],j=null!=i.children&&!d({results:i.children},!0),k=i.text===b.term;if(k||j)return f?!1:(a.data=g,void c(a))}if(f)return!0;var l=e.createTag(b);if(null!=l){var m=e.option(l);m.attr("data-select2-tag",!0),e.addOptions([m]),e.insertTag(g,l)}a.results=g,c(a)}var e=this;return this._removeOldTags(),null==b.term||null!=b.page?void a.call(this,b,c):void a.call(this,b,d)},b.prototype.createTag=function(b,c){var d=a.trim(c.term);return""===d?null:{id:d,text:d}},b.prototype.insertTag=function(a,b,c){b.unshift(c)},b.prototype._removeOldTags=function(b){var c=(this._lastTag,this.$element.find("option[data-select2-tag]"));c.each(function(){this.selected||a(this).remove()})},b}),b.define("select2/data/tokenizer",["jquery"],function(a){function b(a,b,c){var d=c.get("tokenizer");void 0!==d&&(this.tokenizer=d),a.call(this,b,c)}return b.prototype.bind=function(a,b,c){a.call(this,b,c),this.$search=b.dropdown.$search||b.selection.$search||c.find(".select2-search__field")},b.prototype.query=function(b,c,d){function e(b){var c=g._normalizeItem(b),d=g.$element.find("option").filter(function(){return a(this).val()===c.id});if(!d.length){var e=g.option(c);e.attr("data-select2-tag",!0),g._removeOldTags(),g.addOptions([e])}f(c)}function f(a){g.trigger("select",{data:a})}var g=this;c.term=c.term||"";var h=this.tokenizer(c,this.options,e);h.term!==c.term&&(this.$search.length&&(this.$search.val(h.term),this.$search.focus()),c.term=h.term),b.call(this,c,d)},b.prototype.tokenizer=function(b,c,d,e){for(var f=d.get("tokenSeparators")||[],g=c.term,h=0,i=this.createTag||function(a){return{id:a.term,text:a.term}};h<g.length;){var j=g[h];if(-1!==a.inArray(j,f)){var k=g.substr(0,h),l=a.extend({},c,{term:k}),m=i(l);null!=m?(e(m),g=g.substr(h+1)||"",h=0):h++}else h++}return{term:g}},b}),b.define("select2/data/minimumInputLength",[],function(){function a(a,b,c){this.minimumInputLength=c.get("minimumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",b.term.length<this.minimumInputLength?void this.trigger("results:message",{message:"inputTooShort",args:{minimum:this.minimumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumInputLength",[],function(){function a(a,b,c){this.maximumInputLength=c.get("maximumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",this.maximumInputLength>0&&b.term.length>this.maximumInputLength?void this.trigger("results:message",{message:"inputTooLong",args:{maximum:this.maximumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumSelectionLength",[],function(){function a(a,b,c){this.maximumSelectionLength=c.get("maximumSelectionLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){var d=this;this.current(function(e){var f=null!=e?e.length:0;return d.maximumSelectionLength>0&&f>=d.maximumSelectionLength?void d.trigger("results:message",{message:"maximumSelected",args:{maximum:d.maximumSelectionLength}}):void a.call(d,b,c)})},a}),b.define("select2/dropdown",["jquery","./utils"],function(a,b){function c(a,b){this.$element=a,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<span class="select2-dropdown"><span class="select2-results"></span></span>');return b.attr("dir",this.options.get("dir")),this.$dropdown=b,b},c.prototype.bind=function(){},c.prototype.position=function(a,b){},c.prototype.destroy=function(){this.$dropdown.remove()},c}),b.define("select2/dropdown/search",["jquery","../utils"],function(a,b){function c(){}return c.prototype.render=function(b){var c=b.call(this),d=a('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" /></span>');return this.$searchContainer=d,this.$search=d.find("input"),c.prepend(d),c},c.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),this.$search.on("keydown",function(a){e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented()}),this.$search.on("input",function(b){a(this).off("keyup")}),this.$search.on("keyup input",function(a){e.handleSearch(a)}),c.on("open",function(){e.$search.attr("tabindex",0),e.$search.focus(),window.setTimeout(function(){e.$search.focus()},0)}),c.on("close",function(){e.$search.attr("tabindex",-1),e.$search.val("")}),c.on("focus",function(){c.isOpen()&&e.$search.focus()}),c.on("results:all",function(a){if(null==a.query.term||""===a.query.term){var b=e.showSearch(a);b?e.$searchContainer.removeClass("select2-search--hide"):e.$searchContainer.addClass("select2-search--hide")}})},c.prototype.handleSearch=function(a){if(!this._keyUpPrevented){var b=this.$search.val();this.trigger("query",{term:b})}this._keyUpPrevented=!1},c.prototype.showSearch=function(a,b){return!0},c}),b.define("select2/dropdown/hidePlaceholder",[],function(){function a(a,b,c,d){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c,d)}return a.prototype.append=function(a,b){b.results=this.removePlaceholder(b.results),a.call(this,b)},a.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},a.prototype.removePlaceholder=function(a,b){for(var c=b.slice(0),d=b.length-1;d>=0;d--){var e=b[d];this.placeholder.id===e.id&&c.splice(d,1)}return c},a}),b.define("select2/dropdown/infiniteScroll",["jquery"],function(a){function b(a,b,c,d){this.lastParams={},a.call(this,b,c,d),this.$loadingMore=this.createLoadingMore(),this.loading=!1}return b.prototype.append=function(a,b){this.$loadingMore.remove(),this.loading=!1,a.call(this,b),this.showLoadingMore(b)&&this.$results.append(this.$loadingMore)},b.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),c.on("query",function(a){e.lastParams=a,e.loading=!0}),c.on("query:append",function(a){e.lastParams=a,e.loading=!0}),this.$results.on("scroll",function(){var b=a.contains(document.documentElement,e.$loadingMore[0]);if(!e.loading&&b){var c=e.$results.offset().top+e.$results.outerHeight(!1),d=e.$loadingMore.offset().top+e.$loadingMore.outerHeight(!1);c+50>=d&&e.loadMore()}})},b.prototype.loadMore=function(){this.loading=!0;var b=a.extend({},{page:1},this.lastParams);b.page++,this.trigger("query:append",b)},b.prototype.showLoadingMore=function(a,b){return b.pagination&&b.pagination.more},b.prototype.createLoadingMore=function(){var b=a('<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'),c=this.options.get("translations").get("loadingMore");return b.html(c(this.lastParams)),b},b}),b.define("select2/dropdown/attachBody",["jquery","../utils"],function(a,b){function c(b,c,d){this.$dropdownParent=d.get("dropdownParent")||a(document.body),b.call(this,c,d)}return c.prototype.bind=function(a,b,c){var d=this,e=!1;a.call(this,b,c),b.on("open",function(){d._showDropdown(),d._attachPositioningHandler(b),e||(e=!0,b.on("results:all",function(){d._positionDropdown(),d._resizeDropdown()}),b.on("results:append",function(){d._positionDropdown(),d._resizeDropdown()}))}),b.on("close",function(){d._hideDropdown(),d._detachPositioningHandler(b)}),this.$dropdownContainer.on("mousedown",function(a){a.stopPropagation()})},c.prototype.destroy=function(a){a.call(this),this.$dropdownContainer.remove()},c.prototype.position=function(a,b,c){b.attr("class",c.attr("class")),b.removeClass("select2"),b.addClass("select2-container--open"),b.css({position:"absolute",top:-999999}),this.$container=c},c.prototype.render=function(b){var c=a("<span></span>"),d=b.call(this);return c.append(d),this.$dropdownContainer=c,c},c.prototype._hideDropdown=function(a){this.$dropdownContainer.detach()},c.prototype._attachPositioningHandler=function(c,d){var e=this,f="scroll.select2."+d.id,g="resize.select2."+d.id,h="orientationchange.select2."+d.id,i=this.$container.parents().filter(b.hasScroll);i.each(function(){a(this).data("select2-scroll-position",{x:a(this).scrollLeft(),y:a(this).scrollTop()})}),i.on(f,function(b){var c=a(this).data("select2-scroll-position");a(this).scrollTop(c.y)}),a(window).on(f+" "+g+" "+h,function(a){e._positionDropdown(),e._resizeDropdown()})},c.prototype._detachPositioningHandler=function(c,d){var e="scroll.select2."+d.id,f="resize.select2."+d.id,g="orientationchange.select2."+d.id,h=this.$container.parents().filter(b.hasScroll);h.off(e),a(window).off(e+" "+f+" "+g)},c.prototype._positionDropdown=function(){var b=a(window),c=this.$dropdown.hasClass("select2-dropdown--above"),d=this.$dropdown.hasClass("select2-dropdown--below"),e=null,f=this.$container.offset();f.bottom=f.top+this.$container.outerHeight(!1);var g={height:this.$container.outerHeight(!1)};g.top=f.top,g.bottom=f.top+g.height;var h={height:this.$dropdown.outerHeight(!1)},i={top:b.scrollTop(),bottom:b.scrollTop()+b.height()},j=i.top<f.top-h.height,k=i.bottom>f.bottom+h.height,l={left:f.left,top:g.bottom},m=this.$dropdownParent;"static"===m.css("position")&&(m=m.offsetParent());var n=m.offset();l.top-=n.top,l.left-=n.left,c||d||(e="below"),k||!j||c?!j&&k&&c&&(e="below"):e="above",("above"==e||c&&"below"!==e)&&(l.top=g.top-n.top-h.height),null!=e&&(this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--"+e),this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--"+e)),this.$dropdownContainer.css(l)},c.prototype._resizeDropdown=function(){var a={width:this.$container.outerWidth(!1)+"px"};this.options.get("dropdownAutoWidth")&&(a.minWidth=a.width,a.position="relative",a.width="auto"),this.$dropdown.css(a)},c.prototype._showDropdown=function(a){this.$dropdownContainer.appendTo(this.$dropdownParent),this._positionDropdown(),this._resizeDropdown()},c}),b.define("select2/dropdown/minimumResultsForSearch",[],function(){function a(b){for(var c=0,d=0;d<b.length;d++){var e=b[d];e.children?c+=a(e.children):c++}return c}function b(a,b,c,d){this.minimumResultsForSearch=c.get("minimumResultsForSearch"),this.minimumResultsForSearch<0&&(this.minimumResultsForSearch=1/0),a.call(this,b,c,d)}return b.prototype.showSearch=function(b,c){return a(c.data.results)<this.minimumResultsForSearch?!1:b.call(this,c)},b}),b.define("select2/dropdown/selectOnClose",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("close",function(a){d._handleSelectOnClose(a)})},a.prototype._handleSelectOnClose=function(a,b){if(b&&null!=b.originalSelect2Event){var c=b.originalSelect2Event;if("select"===c._type||"unselect"===c._type)return}var d=this.getHighlightedResults();if(!(d.length<1)){var e=d.data("data");null!=e.element&&e.element.selected||null==e.element&&e.selected||this.trigger("select",{data:e})}},a}),b.define("select2/dropdown/closeOnSelect",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("select",function(a){d._selectTriggered(a)}),b.on("unselect",function(a){d._selectTriggered(a)})},a.prototype._selectTriggered=function(a,b){var c=b.originalEvent;c&&c.ctrlKey||this.trigger("close",{originalEvent:c,originalSelect2Event:b})},a}),b.define("select2/i18n/en",[],function(){return{errorLoading:function(){return"The results could not be loaded."},inputTooLong:function(a){var b=a.input.length-a.maximum,c="Please delete "+b+" character";return 1!=b&&(c+="s"),c},inputTooShort:function(a){var b=a.minimum-a.input.length,c="Please enter "+b+" or more characters";return c},loadingMore:function(){return"Loading more results…"},maximumSelected:function(a){var b="You can only select "+a.maximum+" item";return 1!=a.maximum&&(b+="s"),b},noResults:function(){return"No results found"},searching:function(){return"Searching…"}}}),b.define("select2/defaults",["jquery","require","./results","./selection/single","./selection/multiple","./selection/placeholder","./selection/allowClear","./selection/search","./selection/eventRelay","./utils","./translation","./diacritics","./data/select","./data/array","./data/ajax","./data/tags","./data/tokenizer","./data/minimumInputLength","./data/maximumInputLength","./data/maximumSelectionLength","./dropdown","./dropdown/search","./dropdown/hidePlaceholder","./dropdown/infiniteScroll","./dropdown/attachBody","./dropdown/minimumResultsForSearch","./dropdown/selectOnClose","./dropdown/closeOnSelect","./i18n/en"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C){function D(){this.reset()}D.prototype.apply=function(l){if(l=a.extend(!0,{},this.defaults,l),null==l.dataAdapter){if(null!=l.ajax?l.dataAdapter=o:null!=l.data?l.dataAdapter=n:l.dataAdapter=m,l.minimumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,r)),l.maximumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,s)),l.maximumSelectionLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,t)),l.tags&&(l.dataAdapter=j.Decorate(l.dataAdapter,p)),(null!=l.tokenSeparators||null!=l.tokenizer)&&(l.dataAdapter=j.Decorate(l.dataAdapter,q)),null!=l.query){var C=b(l.amdBase+"compat/query");l.dataAdapter=j.Decorate(l.dataAdapter,C)}if(null!=l.initSelection){var D=b(l.amdBase+"compat/initSelection");l.dataAdapter=j.Decorate(l.dataAdapter,D)}}if(null==l.resultsAdapter&&(l.resultsAdapter=c,null!=l.ajax&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,x)),null!=l.placeholder&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,w)),l.selectOnClose&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,A))),null==l.dropdownAdapter){if(l.multiple)l.dropdownAdapter=u;else{var E=j.Decorate(u,v);l.dropdownAdapter=E}if(0!==l.minimumResultsForSearch&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,z)),l.closeOnSelect&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,B)),null!=l.dropdownCssClass||null!=l.dropdownCss||null!=l.adaptDropdownCssClass){var F=b(l.amdBase+"compat/dropdownCss");l.dropdownAdapter=j.Decorate(l.dropdownAdapter,F)}l.dropdownAdapter=j.Decorate(l.dropdownAdapter,y)}if(null==l.selectionAdapter){if(l.multiple?l.selectionAdapter=e:l.selectionAdapter=d,null!=l.placeholder&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,f)),l.allowClear&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,g)),l.multiple&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,h)),null!=l.containerCssClass||null!=l.containerCss||null!=l.adaptContainerCssClass){var G=b(l.amdBase+"compat/containerCss");l.selectionAdapter=j.Decorate(l.selectionAdapter,G)}l.selectionAdapter=j.Decorate(l.selectionAdapter,i)}if("string"==typeof l.language)if(l.language.indexOf("-")>0){var H=l.language.split("-"),I=H[0];l.language=[l.language,I]}else l.language=[l.language];if(a.isArray(l.language)){var J=new k;l.language.push("en");for(var K=l.language,L=0;L<K.length;L++){var M=K[L],N={};try{N=k.loadPath(M)}catch(O){try{M=this.defaults.amdLanguageBase+M,N=k.loadPath(M)}catch(P){l.debug&&window.console&&console.warn&&console.warn('Select2: The language file for "'+M+'" could not be automatically loaded. A fallback will be used instead.');continue}}J.extend(N)}l.translations=J}else{var Q=k.loadPath(this.defaults.amdLanguageBase+"en"),R=new k(l.language);R.extend(Q),l.translations=R}return l},D.prototype.reset=function(){function b(a){function b(a){return l[a]||a}return a.replace(/[^\u0000-\u007E]/g,b)}function c(d,e){if(""===a.trim(d.term))return e;if(e.children&&e.children.length>0){for(var f=a.extend(!0,{},e),g=e.children.length-1;g>=0;g--){var h=e.children[g],i=c(d,h);null==i&&f.children.splice(g,1)}return f.children.length>0?f:c(d,f)}var j=b(e.text).toUpperCase(),k=b(d.term).toUpperCase();return j.indexOf(k)>-1?e:null}this.defaults={amdBase:"./",amdLanguageBase:"./i18n/",closeOnSelect:!0,debug:!1,dropdownAutoWidth:!1,escapeMarkup:j.escapeMarkup,language:C,matcher:c,minimumInputLength:0,maximumInputLength:0,maximumSelectionLength:0,minimumResultsForSearch:0,selectOnClose:!1,sorter:function(a){return a},templateResult:function(a){return a.text},templateSelection:function(a){return a.text},theme:"default",width:"resolve"}},D.prototype.set=function(b,c){var d=a.camelCase(b),e={};e[d]=c;var f=j._convertData(e);a.extend(this.defaults,f)};var E=new D;return E}),b.define("select2/options",["require","jquery","./defaults","./utils"],function(a,b,c,d){function e(b,e){if(this.options=b,null!=e&&this.fromElement(e),this.options=c.apply(this.options),e&&e.is("input")){var f=a(this.get("amdBase")+"compat/inputData");this.options.dataAdapter=d.Decorate(this.options.dataAdapter,f)}}return e.prototype.fromElement=function(a){var c=["select2"];null==this.options.multiple&&(this.options.multiple=a.prop("multiple")),null==this.options.disabled&&(this.options.disabled=a.prop("disabled")),null==this.options.language&&(a.prop("lang")?this.options.language=a.prop("lang").toLowerCase():a.closest("[lang]").prop("lang")&&(this.options.language=a.closest("[lang]").prop("lang"))),null==this.options.dir&&(a.prop("dir")?this.options.dir=a.prop("dir"):a.closest("[dir]").prop("dir")?this.options.dir=a.closest("[dir]").prop("dir"):this.options.dir="ltr"),a.prop("disabled",this.options.disabled),a.prop("multiple",this.options.multiple),a.data("select2Tags")&&(this.options.debug&&window.console&&console.warn&&console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'),a.data("data",a.data("select2Tags")),a.data("tags",!0)),a.data("ajaxUrl")&&(this.options.debug&&window.console&&console.warn&&console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."),a.attr("ajax--url",a.data("ajaxUrl")),a.data("ajax--url",a.data("ajaxUrl")));var e={};e=b.fn.jquery&&"1."==b.fn.jquery.substr(0,2)&&a[0].dataset?b.extend(!0,{},a[0].dataset,a.data()):a.data();var f=b.extend(!0,{},e);f=d._convertData(f);for(var g in f)b.inArray(g,c)>-1||(b.isPlainObject(this.options[g])?b.extend(this.options[g],f[g]):this.options[g]=f[g]);return this},e.prototype.get=function(a){return this.options[a]},e.prototype.set=function(a,b){this.options[a]=b},e}),b.define("select2/core",["jquery","./options","./utils","./keys"],function(a,b,c,d){var e=function(a,c){null!=a.data("select2")&&a.data("select2").destroy(),this.$element=a,this.id=this._generateId(a),c=c||{},this.options=new b(c,a),e.__super__.constructor.call(this);var d=a.attr("tabindex")||0;a.data("old-tabindex",d),a.attr("tabindex","-1");var f=this.options.get("dataAdapter");this.dataAdapter=new f(a,this.options);var g=this.render();this._placeContainer(g);var h=this.options.get("selectionAdapter");this.selection=new h(a,this.options),this.$selection=this.selection.render(),this.selection.position(this.$selection,g);var i=this.options.get("dropdownAdapter");this.dropdown=new i(a,this.options),this.$dropdown=this.dropdown.render(),this.dropdown.position(this.$dropdown,g);var j=this.options.get("resultsAdapter");this.results=new j(a,this.options,this.dataAdapter),this.$results=this.results.render(),this.results.position(this.$results,this.$dropdown);var k=this;this._bindAdapters(),this._registerDomEvents(),this._registerDataEvents(),this._registerSelectionEvents(),this._registerDropdownEvents(),this._registerResultsEvents(),this._registerEvents(),this.dataAdapter.current(function(a){k.trigger("selection:update",{data:a})}),a.addClass("select2-hidden-accessible"),a.attr("aria-hidden","true"),this._syncAttributes(),a.data("select2",this)};return c.Extend(e,c.Observable),e.prototype._generateId=function(a){var b="";return b=null!=a.attr("id")?a.attr("id"):null!=a.attr("name")?a.attr("name")+"-"+c.generateChars(2):c.generateChars(4),b=b.replace(/(:|\.|\[|\]|,)/g,""),b="select2-"+b},e.prototype._placeContainer=function(a){a.insertAfter(this.$element);var b=this._resolveWidth(this.$element,this.options.get("width"));null!=b&&a.css("width",b)},e.prototype._resolveWidth=function(a,b){var c=/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;if("resolve"==b){var d=this._resolveWidth(a,"style");return null!=d?d:this._resolveWidth(a,"element")}if("element"==b){var e=a.outerWidth(!1);return 0>=e?"auto":e+"px"}if("style"==b){var f=a.attr("style");if("string"!=typeof f)return null;for(var g=f.split(";"),h=0,i=g.length;i>h;h+=1){var j=g[h].replace(/\s/g,""),k=j.match(c);if(null!==k&&k.length>=1)return k[1]}return null}return b},e.prototype._bindAdapters=function(){this.dataAdapter.bind(this,this.$container),this.selection.bind(this,this.$container),this.dropdown.bind(this,this.$container),this.results.bind(this,this.$container)},e.prototype._registerDomEvents=function(){var b=this;this.$element.on("change.select2",function(){b.dataAdapter.current(function(a){b.trigger("selection:update",{data:a})})}),this.$element.on("focus.select2",function(a){b.trigger("focus",a)}),this._syncA=c.bind(this._syncAttributes,this),this._syncS=c.bind(this._syncSubtree,this),this.$element[0].attachEvent&&this.$element[0].attachEvent("onpropertychange",this._syncA);var d=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;null!=d?(this._observer=new d(function(c){a.each(c,b._syncA),a.each(c,b._syncS)}),this._observer.observe(this.$element[0],{attributes:!0,childList:!0,subtree:!1})):this.$element[0].addEventListener&&(this.$element[0].addEventListener("DOMAttrModified",b._syncA,!1),this.$element[0].addEventListener("DOMNodeInserted",b._syncS,!1),this.$element[0].addEventListener("DOMNodeRemoved",b._syncS,!1))},e.prototype._registerDataEvents=function(){var a=this;this.dataAdapter.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerSelectionEvents=function(){var b=this,c=["toggle","focus"];this.selection.on("toggle",function(){b.toggleDropdown()}),this.selection.on("focus",function(a){b.focus(a)}),this.selection.on("*",function(d,e){-1===a.inArray(d,c)&&b.trigger(d,e)})},e.prototype._registerDropdownEvents=function(){var a=this;this.dropdown.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerResultsEvents=function(){var a=this;this.results.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerEvents=function(){var a=this;this.on("open",function(){a.$container.addClass("select2-container--open")}),this.on("close",function(){a.$container.removeClass("select2-container--open")}),this.on("enable",function(){a.$container.removeClass("select2-container--disabled")}),this.on("disable",function(){a.$container.addClass("select2-container--disabled")}),this.on("blur",function(){a.$container.removeClass("select2-container--focus")}),this.on("query",function(b){a.isOpen()||a.trigger("open",{}),this.dataAdapter.query(b,function(c){a.trigger("results:all",{data:c,query:b})})}),this.on("query:append",function(b){this.dataAdapter.query(b,function(c){a.trigger("results:append",{data:c,query:b})})}),this.on("keypress",function(b){var c=b.which;a.isOpen()?c===d.ESC||c===d.TAB||c===d.UP&&b.altKey?(a.close(),b.preventDefault()):c===d.ENTER?(a.trigger("results:select",{}),b.preventDefault()):c===d.SPACE&&b.ctrlKey?(a.trigger("results:toggle",{}),b.preventDefault()):c===d.UP?(a.trigger("results:previous",{}),b.preventDefault()):c===d.DOWN&&(a.trigger("results:next",{}),b.preventDefault()):(c===d.ENTER||c===d.SPACE||c===d.DOWN&&b.altKey)&&(a.open(),b.preventDefault())})},e.prototype._syncAttributes=function(){this.options.set("disabled",this.$element.prop("disabled")),this.options.get("disabled")?(this.isOpen()&&this.close(),this.trigger("disable",{})):this.trigger("enable",{})},e.prototype._syncSubtree=function(a,b){var c=!1,d=this;if(!a||!a.target||"OPTION"===a.target.nodeName||"OPTGROUP"===a.target.nodeName){if(b)if(b.addedNodes&&b.addedNodes.length>0)for(var e=0;e<b.addedNodes.length;e++){var f=b.addedNodes[e];f.selected&&(c=!0)}else b.removedNodes&&b.removedNodes.length>0&&(c=!0);else c=!0;c&&this.dataAdapter.current(function(a){d.trigger("selection:update",{data:a})})}},e.prototype.trigger=function(a,b){var c=e.__super__.trigger,d={open:"opening",close:"closing",select:"selecting",unselect:"unselecting"};if(void 0===b&&(b={}),a in d){var f=d[a],g={prevented:!1,name:a,args:b};if(c.call(this,f,g),g.prevented)return void(b.prevented=!0)}c.call(this,a,b)},e.prototype.toggleDropdown=function(){this.options.get("disabled")||(this.isOpen()?this.close():this.open())},e.prototype.open=function(){this.isOpen()||this.trigger("query",{})},e.prototype.close=function(){this.isOpen()&&this.trigger("close",{})},e.prototype.isOpen=function(){return this.$container.hasClass("select2-container--open")},e.prototype.hasFocus=function(){return this.$container.hasClass("select2-container--focus")},e.prototype.focus=function(a){this.hasFocus()||(this.$container.addClass("select2-container--focus"),this.trigger("focus",{}))},e.prototype.enable=function(a){this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'),(null==a||0===a.length)&&(a=[!0]);var b=!a[0];this.$element.prop("disabled",b)},e.prototype.data=function(){this.options.get("debug")&&arguments.length>0&&window.console&&console.warn&&console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');var a=[];return this.dataAdapter.current(function(b){a=b}),a},e.prototype.val=function(b){if(this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'),null==b||0===b.length)return this.$element.val();var c=b[0];a.isArray(c)&&(c=a.map(c,function(a){return a.toString()})),this.$element.val(c).trigger("change")},e.prototype.destroy=function(){this.$container.remove(),this.$element[0].detachEvent&&this.$element[0].detachEvent("onpropertychange",this._syncA),null!=this._observer?(this._observer.disconnect(),this._observer=null):this.$element[0].removeEventListener&&(this.$element[0].removeEventListener("DOMAttrModified",this._syncA,!1),this.$element[0].removeEventListener("DOMNodeInserted",this._syncS,!1),this.$element[0].removeEventListener("DOMNodeRemoved",this._syncS,!1)),this._syncA=null,this._syncS=null,this.$element.off(".select2"),this.$element.attr("tabindex",this.$element.data("old-tabindex")),this.$element.removeClass("select2-hidden-accessible"),this.$element.attr("aria-hidden","false"),this.$element.removeData("select2"),this.dataAdapter.destroy(),this.selection.destroy(),this.dropdown.destroy(),this.results.destroy(),this.dataAdapter=null,this.selection=null,this.dropdown=null,this.results=null;
},e.prototype.render=function(){var b=a('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');return b.attr("dir",this.options.get("dir")),this.$container=b,this.$container.addClass("select2-container--"+this.options.get("theme")),b.data("element",this.$element),b},e}),b.define("select2/compat/utils",["jquery"],function(a){function b(b,c,d){var e,f,g=[];e=a.trim(b.attr("class")),e&&(e=""+e,a(e.split(/\s+/)).each(function(){0===this.indexOf("select2-")&&g.push(this)})),e=a.trim(c.attr("class")),e&&(e=""+e,a(e.split(/\s+/)).each(function(){0!==this.indexOf("select2-")&&(f=d(this),null!=f&&g.push(f))})),b.attr("class",g.join(" "))}return{syncCssClasses:b}}),b.define("select2/compat/containerCss",["jquery","./utils"],function(a,b){function c(a){return null}function d(){}return d.prototype.render=function(d){var e=d.call(this),f=this.options.get("containerCssClass")||"";a.isFunction(f)&&(f=f(this.$element));var g=this.options.get("adaptContainerCssClass");if(g=g||c,-1!==f.indexOf(":all:")){f=f.replace(":all:","");var h=g;g=function(a){var b=h(a);return null!=b?b+" "+a:a}}var i=this.options.get("containerCss")||{};return a.isFunction(i)&&(i=i(this.$element)),b.syncCssClasses(e,this.$element,g),e.css(i),e.addClass(f),e},d}),b.define("select2/compat/dropdownCss",["jquery","./utils"],function(a,b){function c(a){return null}function d(){}return d.prototype.render=function(d){var e=d.call(this),f=this.options.get("dropdownCssClass")||"";a.isFunction(f)&&(f=f(this.$element));var g=this.options.get("adaptDropdownCssClass");if(g=g||c,-1!==f.indexOf(":all:")){f=f.replace(":all:","");var h=g;g=function(a){var b=h(a);return null!=b?b+" "+a:a}}var i=this.options.get("dropdownCss")||{};return a.isFunction(i)&&(i=i(this.$element)),b.syncCssClasses(e,this.$element,g),e.css(i),e.addClass(f),e},d}),b.define("select2/compat/initSelection",["jquery"],function(a){function b(a,b,c){c.get("debug")&&window.console&&console.warn&&console.warn("Select2: The `initSelection` option has been deprecated in favor of a custom data adapter that overrides the `current` method. This method is now called multiple times instead of a single time when the instance is initialized. Support will be removed for the `initSelection` option in future versions of Select2"),this.initSelection=c.get("initSelection"),this._isInitialized=!1,a.call(this,b,c)}return b.prototype.current=function(b,c){var d=this;return this._isInitialized?void b.call(this,c):void this.initSelection.call(null,this.$element,function(b){d._isInitialized=!0,a.isArray(b)||(b=[b]),c(b)})},b}),b.define("select2/compat/inputData",["jquery"],function(a){function b(a,b,c){this._currentData=[],this._valueSeparator=c.get("valueSeparator")||",","hidden"===b.prop("type")&&c.get("debug")&&console&&console.warn&&console.warn("Select2: Using a hidden input with Select2 is no longer supported and may stop working in the future. It is recommended to use a `<select>` element instead."),a.call(this,b,c)}return b.prototype.current=function(b,c){function d(b,c){var e=[];return b.selected||-1!==a.inArray(b.id,c)?(b.selected=!0,e.push(b)):b.selected=!1,b.children&&e.push.apply(e,d(b.children,c)),e}for(var e=[],f=0;f<this._currentData.length;f++){var g=this._currentData[f];e.push.apply(e,d(g,this.$element.val().split(this._valueSeparator)))}c(e)},b.prototype.select=function(b,c){if(this.options.get("multiple")){var d=this.$element.val();d+=this._valueSeparator+c.id,this.$element.val(d),this.$element.trigger("change")}else this.current(function(b){a.map(b,function(a){a.selected=!1})}),this.$element.val(c.id),this.$element.trigger("change")},b.prototype.unselect=function(a,b){var c=this;b.selected=!1,this.current(function(a){for(var d=[],e=0;e<a.length;e++){var f=a[e];b.id!=f.id&&d.push(f.id)}c.$element.val(d.join(c._valueSeparator)),c.$element.trigger("change")})},b.prototype.query=function(a,b,c){for(var d=[],e=0;e<this._currentData.length;e++){var f=this._currentData[e],g=this.matches(b,f);null!==g&&d.push(g)}c({results:d})},b.prototype.addOptions=function(b,c){var d=a.map(c,function(b){return a.data(b[0],"data")});this._currentData.push.apply(this._currentData,d)},b}),b.define("select2/compat/matcher",["jquery"],function(a){function b(b){function c(c,d){var e=a.extend(!0,{},d);if(null==c.term||""===a.trim(c.term))return e;if(d.children){for(var f=d.children.length-1;f>=0;f--){var g=d.children[f],h=b(c.term,g.text,g);h||e.children.splice(f,1)}if(e.children.length>0)return e}return b(c.term,d.text,d)?e:null}return c}return b}),b.define("select2/compat/query",[],function(){function a(a,b,c){c.get("debug")&&window.console&&console.warn&&console.warn("Select2: The `query` option has been deprecated in favor of a custom data adapter that overrides the `query` method. Support will be removed for the `query` option in future versions of Select2."),a.call(this,b,c)}return a.prototype.query=function(a,b,c){b.callback=c;var d=this.options.get("query");d.call(null,b)},a}),b.define("select2/dropdown/attachContainer",[],function(){function a(a,b,c){a.call(this,b,c)}return a.prototype.position=function(a,b,c){var d=c.find(".dropdown-wrapper");d.append(b),b.addClass("select2-dropdown--below"),c.addClass("select2-container--below")},a}),b.define("select2/dropdown/stopPropagation",[],function(){function a(){}return a.prototype.bind=function(a,b,c){a.call(this,b,c);var d=["blur","change","click","dblclick","focus","focusin","focusout","input","keydown","keyup","keypress","mousedown","mouseenter","mouseleave","mousemove","mouseover","mouseup","search","touchend","touchstart"];this.$dropdown.on(d.join(" "),function(a){a.stopPropagation()})},a}),b.define("select2/selection/stopPropagation",[],function(){function a(){}return a.prototype.bind=function(a,b,c){a.call(this,b,c);var d=["blur","change","click","dblclick","focus","focusin","focusout","input","keydown","keyup","keypress","mousedown","mouseenter","mouseleave","mousemove","mouseover","mouseup","search","touchend","touchstart"];this.$selection.on(d.join(" "),function(a){a.stopPropagation()})},a}),function(c){"function"==typeof b.define&&b.define.amd?b.define("jquery-mousewheel",["jquery"],c):"object"==typeof exports?module.exports=c:c(a)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})}),b.define("jquery.select2",["jquery","jquery-mousewheel","./select2/core","./select2/defaults"],function(a,b,c,d){if(null==a.fn.select2){var e=["open","close","destroy"];a.fn.select2=function(b){if(b=b||{},"object"==typeof b)return this.each(function(){var d=a.extend(!0,{},b);new c(a(this),d)}),this;if("string"==typeof b){var d,f=Array.prototype.slice.call(arguments,1);return this.each(function(){var c=a(this).data("select2");null==c&&window.console&&console.error&&console.error("The select2('"+b+"') method was called on an element that is not using Select2."),d=c[b].apply(c,f)}),a.inArray(b,e)>-1?this:d}throw new Error("Invalid arguments for Select2: "+b)}}return null==a.fn.select2.defaults&&(a.fn.select2.defaults=d),c}),{define:b.define,require:b.require}}(),c=b.require("jquery.select2");return a.fn.select2.amd=b,c});
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):window.jQuery||window.Zepto)}(function(a){var b,c,d,e,f,g,h="Close",i="BeforeClose",j="AfterClose",k="BeforeAppend",l="MarkupParse",m="Open",n="Change",o="mfp",p="."+o,q="mfp-ready",r="mfp-removing",s="mfp-prevent-close",t=function(){},u=!!window.jQuery,v=a(window),w=function(a,c){b.ev.on(o+a+p,c)},x=function(b,c,d,e){var f=document.createElement("div");return f.className="mfp-"+b,d&&(f.innerHTML=d),e?c&&c.appendChild(f):(f=a(f),c&&f.appendTo(c)),f},y=function(c,d){b.ev.triggerHandler(o+c,d),b.st.callbacks&&(c=c.charAt(0).toLowerCase()+c.slice(1),b.st.callbacks[c]&&b.st.callbacks[c].apply(b,a.isArray(d)?d:[d]))},z=function(c){return c===g&&b.currTemplate.closeBtn||(b.currTemplate.closeBtn=a(b.st.closeMarkup.replace("%title%",b.st.tClose)),g=c),b.currTemplate.closeBtn},A=function(){a.magnificPopup.instance||(b=new t,b.init(),a.magnificPopup.instance=b)},B=function(){var a=document.createElement("p").style,b=["ms","O","Moz","Webkit"];if(void 0!==a.transition)return!0;for(;b.length;)if(b.pop()+"Transition"in a)return!0;return!1};t.prototype={constructor:t,init:function(){var c=navigator.appVersion;b.isIE7=-1!==c.indexOf("MSIE 7."),b.isIE8=-1!==c.indexOf("MSIE 8."),b.isLowIE=b.isIE7||b.isIE8,b.isAndroid=/android/gi.test(c),b.isIOS=/iphone|ipad|ipod/gi.test(c),b.supportsTransition=B(),b.probablyMobile=b.isAndroid||b.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent),d=a(document),b.popupsCache={}},open:function(c){var e;if(c.isObj===!1){b.items=c.items.toArray(),b.index=0;var g,h=c.items;for(e=0;e<h.length;e++)if(g=h[e],g.parsed&&(g=g.el[0]),g===c.el[0]){b.index=e;break}}else b.items=a.isArray(c.items)?c.items:[c.items],b.index=c.index||0;if(b.isOpen)return void b.updateItemHTML();b.types=[],f="",b.ev=c.mainEl&&c.mainEl.length?c.mainEl.eq(0):d,c.key?(b.popupsCache[c.key]||(b.popupsCache[c.key]={}),b.currTemplate=b.popupsCache[c.key]):b.currTemplate={},b.st=a.extend(!0,{},a.magnificPopup.defaults,c),b.fixedContentPos="auto"===b.st.fixedContentPos?!b.probablyMobile:b.st.fixedContentPos,b.st.modal&&(b.st.closeOnContentClick=!1,b.st.closeOnBgClick=!1,b.st.showCloseBtn=!1,b.st.enableEscapeKey=!1),b.bgOverlay||(b.bgOverlay=x("bg").on("click"+p,function(){b.close()}),b.wrap=x("wrap").attr("tabindex",-1).on("click"+p,function(a){b._checkIfClose(a.target)&&b.close()}),b.container=x("container",b.wrap)),b.contentContainer=x("content"),b.st.preloader&&(b.preloader=x("preloader",b.container,b.st.tLoading));var i=a.magnificPopup.modules;for(e=0;e<i.length;e++){var j=i[e];j=j.charAt(0).toUpperCase()+j.slice(1),b["init"+j].call(b)}y("BeforeOpen"),b.st.showCloseBtn&&(b.st.closeBtnInside?(w(l,function(a,b,c,d){c.close_replaceWith=z(d.type)}),f+=" mfp-close-btn-in"):b.wrap.append(z())),b.st.alignTop&&(f+=" mfp-align-top"),b.wrap.css(b.fixedContentPos?{overflow:b.st.overflowY,overflowX:"hidden",overflowY:b.st.overflowY}:{top:v.scrollTop(),position:"absolute"}),(b.st.fixedBgPos===!1||"auto"===b.st.fixedBgPos&&!b.fixedContentPos)&&b.bgOverlay.css({height:d.height(),position:"absolute"}),b.st.enableEscapeKey&&d.on("keyup"+p,function(a){27===a.keyCode&&b.close()}),v.on("resize"+p,function(){b.updateSize()}),b.st.closeOnContentClick||(f+=" mfp-auto-cursor"),f&&b.wrap.addClass(f);var k=b.wH=v.height(),n={};if(b.fixedContentPos&&b._hasScrollBar(k)){var o=b._getScrollbarSize();o&&(n.marginRight=o)}b.fixedContentPos&&(b.isIE7?a("body, html").css("overflow","hidden"):n.overflow="hidden");var r=b.st.mainClass;return b.isIE7&&(r+=" mfp-ie7"),r&&b._addClassToMFP(r),b.updateItemHTML(),y("BuildControls"),a("html").css(n),b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo||a(document.body)),b._lastFocusedEl=document.activeElement,setTimeout(function(){b.content?(b._addClassToMFP(q),b._setFocus()):b.bgOverlay.addClass(q),d.on("focusin"+p,b._onFocusIn)},16),b.isOpen=!0,b.updateSize(k),y(m),c},close:function(){b.isOpen&&(y(i),b.isOpen=!1,b.st.removalDelay&&!b.isLowIE&&b.supportsTransition?(b._addClassToMFP(r),setTimeout(function(){b._close()},b.st.removalDelay)):b._close())},_close:function(){y(h);var c=r+" "+q+" ";if(b.bgOverlay.detach(),b.wrap.detach(),b.container.empty(),b.st.mainClass&&(c+=b.st.mainClass+" "),b._removeClassFromMFP(c),b.fixedContentPos){var e={marginRight:""};b.isIE7?a("body, html").css("overflow",""):e.overflow="",a("html").css(e)}d.off("keyup"+p+" focusin"+p),b.ev.off(p),b.wrap.attr("class","mfp-wrap").removeAttr("style"),b.bgOverlay.attr("class","mfp-bg"),b.container.attr("class","mfp-container"),!b.st.showCloseBtn||b.st.closeBtnInside&&b.currTemplate[b.currItem.type]!==!0||b.currTemplate.closeBtn&&b.currTemplate.closeBtn.detach(),b._lastFocusedEl&&a(b._lastFocusedEl).focus(),b.currItem=null,b.content=null,b.currTemplate=null,b.prevHeight=0,y(j)},updateSize:function(a){if(b.isIOS){var c=document.documentElement.clientWidth/window.innerWidth,d=window.innerHeight*c;b.wrap.css("height",d),b.wH=d}else b.wH=a||v.height();b.fixedContentPos||b.wrap.css("height",b.wH),y("Resize")},updateItemHTML:function(){var c=b.items[b.index];b.contentContainer.detach(),b.content&&b.content.detach(),c.parsed||(c=b.parseEl(b.index));var d=c.type;if(y("BeforeChange",[b.currItem?b.currItem.type:"",d]),b.currItem=c,!b.currTemplate[d]){var f=b.st[d]?b.st[d].markup:!1;y("FirstMarkupParse",f),b.currTemplate[d]=f?a(f):!0}e&&e!==c.type&&b.container.removeClass("mfp-"+e+"-holder");var g=b["get"+d.charAt(0).toUpperCase()+d.slice(1)](c,b.currTemplate[d]);b.appendContent(g,d),c.preloaded=!0,y(n,c),e=c.type,b.container.prepend(b.contentContainer),y("AfterChange")},appendContent:function(a,c){b.content=a,a?b.st.showCloseBtn&&b.st.closeBtnInside&&b.currTemplate[c]===!0?b.content.find(".mfp-close").length||b.content.append(z()):b.content=a:b.content="",y(k),b.container.addClass("mfp-"+c+"-holder"),b.contentContainer.append(b.content)},parseEl:function(c){var d,e=b.items[c];if(e.tagName?e={el:a(e)}:(d=e.type,e={data:e,src:e.src}),e.el){for(var f=b.types,g=0;g<f.length;g++)if(e.el.hasClass("mfp-"+f[g])){d=f[g];break}e.src=e.el.attr("data-mfp-src"),e.src||(e.src=e.el.attr("href"))}return e.type=d||b.st.type||"inline",e.index=c,e.parsed=!0,b.items[c]=e,y("ElementParse",e),b.items[c]},addGroup:function(a,c){var d=function(d){d.mfpEl=this,b._openClick(d,a,c)};c||(c={});var e="click.magnificPopup";c.mainEl=a,c.items?(c.isObj=!0,a.off(e).on(e,d)):(c.isObj=!1,c.delegate?a.off(e).on(e,c.delegate,d):(c.items=a,a.off(e).on(e,d)))},_openClick:function(c,d,e){var f=void 0!==e.midClick?e.midClick:a.magnificPopup.defaults.midClick;if(f||2!==c.which&&!c.ctrlKey&&!c.metaKey){var g=void 0!==e.disableOn?e.disableOn:a.magnificPopup.defaults.disableOn;if(g)if(a.isFunction(g)){if(!g.call(b))return!0}else if(v.width()<g)return!0;c.type&&(c.preventDefault(),b.isOpen&&c.stopPropagation()),e.el=a(c.mfpEl),e.delegate&&(e.items=d.find(e.delegate)),b.open(e)}},updateStatus:function(a,d){if(b.preloader){c!==a&&b.container.removeClass("mfp-s-"+c),d||"loading"!==a||(d=b.st.tLoading);var e={status:a,text:d};y("UpdateStatus",e),a=e.status,d=e.text,b.preloader.html(d),b.preloader.find("a").on("click",function(a){a.stopImmediatePropagation()}),b.container.addClass("mfp-s-"+a),c=a}},_checkIfClose:function(c){if(!a(c).hasClass(s)){var d=b.st.closeOnContentClick,e=b.st.closeOnBgClick;if(d&&e)return!0;if(!b.content||a(c).hasClass("mfp-close")||b.preloader&&c===b.preloader[0])return!0;if(c===b.content[0]||a.contains(b.content[0],c)){if(d)return!0}else if(e&&a.contains(document,c))return!0;return!1}},_addClassToMFP:function(a){b.bgOverlay.addClass(a),b.wrap.addClass(a)},_removeClassFromMFP:function(a){this.bgOverlay.removeClass(a),b.wrap.removeClass(a)},_hasScrollBar:function(a){return(b.isIE7?d.height():document.body.scrollHeight)>(a||v.height())},_setFocus:function(){(b.st.focus?b.content.find(b.st.focus).eq(0):b.wrap).focus()},_onFocusIn:function(c){return c.target===b.wrap[0]||a.contains(b.wrap[0],c.target)?void 0:(b._setFocus(),!1)},_parseMarkup:function(b,c,d){var e;d.data&&(c=a.extend(d.data,c)),y(l,[b,c,d]),a.each(c,function(a,c){if(void 0===c||c===!1)return!0;if(e=a.split("_"),e.length>1){var d=b.find(p+"-"+e[0]);if(d.length>0){var f=e[1];"replaceWith"===f?d[0]!==c[0]&&d.replaceWith(c):"img"===f?d.is("img")?d.attr("src",c):d.replaceWith('<img src="'+c+'" class="'+d.attr("class")+'" />'):d.attr(e[1],c)}}else b.find(p+"-"+a).html(c)})},_getScrollbarSize:function(){if(void 0===b.scrollbarSize){var a=document.createElement("div");a.style.cssText="width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;",document.body.appendChild(a),b.scrollbarSize=a.offsetWidth-a.clientWidth,document.body.removeChild(a)}return b.scrollbarSize}},a.magnificPopup={instance:null,proto:t.prototype,modules:[],open:function(b,c){return A(),b=b?a.extend(!0,{},b):{},b.isObj=!0,b.index=c||0,this.instance.open(b)},close:function(){return a.magnificPopup.instance&&a.magnificPopup.instance.close()},registerModule:function(b,c){c.options&&(a.magnificPopup.defaults[b]=c.options),a.extend(this.proto,c.proto),this.modules.push(b)},defaults:{disableOn:0,key:null,midClick:!1,mainClass:"",preloader:!0,focus:"",closeOnContentClick:!1,closeOnBgClick:!0,closeBtnInside:!0,showCloseBtn:!0,enableEscapeKey:!0,modal:!1,alignTop:!1,removalDelay:0,prependTo:null,fixedContentPos:"auto",fixedBgPos:"auto",overflowY:"auto",closeMarkup:'<button title="%title%" type="button" class="mfp-close">&times;</button>',tClose:"Close (Esc)",tLoading:"Loading..."}},a.fn.magnificPopup=function(c){A();var d=a(this);if("string"==typeof c)if("open"===c){var e,f=u?d.data("magnificPopup"):d[0].magnificPopup,g=parseInt(arguments[1],10)||0;f.items?e=f.items[g]:(e=d,f.delegate&&(e=e.find(f.delegate)),e=e.eq(g)),b._openClick({mfpEl:e},d,f)}else b.isOpen&&b[c].apply(b,Array.prototype.slice.call(arguments,1));else c=a.extend(!0,{},c),u?d.data("magnificPopup",c):d[0].magnificPopup=c,b.addGroup(d,c);return d};var C,D,E,F="inline",G=function(){E&&(D.after(E.addClass(C)).detach(),E=null)};a.magnificPopup.registerModule(F,{options:{hiddenClass:"hide",markup:"",tNotFound:"Content not found"},proto:{initInline:function(){b.types.push(F),w(h+"."+F,function(){G()})},getInline:function(c,d){if(G(),c.src){var e=b.st.inline,f=a(c.src);if(f.length){var g=f[0].parentNode;g&&g.tagName&&(D||(C=e.hiddenClass,D=x(C),C="mfp-"+C),E=f.after(D).detach().removeClass(C)),b.updateStatus("ready")}else b.updateStatus("error",e.tNotFound),f=a("<div>");return c.inlineElement=f,f}return b.updateStatus("ready"),b._parseMarkup(d,{},c),d}}});var H,I="ajax",J=function(){H&&a(document.body).removeClass(H)},K=function(){J(),b.req&&b.req.abort()};a.magnificPopup.registerModule(I,{options:{settings:null,cursor:"mfp-ajax-cur",tError:'<a href="%url%">The content</a> could not be loaded.'},proto:{initAjax:function(){b.types.push(I),H=b.st.ajax.cursor,w(h+"."+I,K),w("BeforeChange."+I,K)},getAjax:function(c){H&&a(document.body).addClass(H),b.updateStatus("loading");var d=a.extend({url:c.src,success:function(d,e,f){var g={data:d,xhr:f};y("ParseAjax",g),b.appendContent(a(g.data),I),c.finished=!0,J(),b._setFocus(),setTimeout(function(){b.wrap.addClass(q)},16),b.updateStatus("ready"),y("AjaxContentAdded")},error:function(){J(),c.finished=c.loadError=!0,b.updateStatus("error",b.st.ajax.tError.replace("%url%",c.src))}},b.st.ajax.settings);return b.req=a.ajax(d),""}}});var L,M=function(c){if(c.data&&void 0!==c.data.title)return c.data.title;var d=b.st.image.titleSrc;if(d){if(a.isFunction(d))return d.call(b,c);if(c.el)return c.el.attr(d)||""}return""};a.magnificPopup.registerModule("image",{options:{markup:'<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',cursor:"mfp-zoom-out-cur",titleSrc:"title",verticalFit:!0,tError:'<a href="%url%">The image</a> could not be loaded.'},proto:{initImage:function(){var c=b.st.image,d=".image";b.types.push("image"),w(m+d,function(){"image"===b.currItem.type&&c.cursor&&a(document.body).addClass(c.cursor)}),w(h+d,function(){c.cursor&&a(document.body).removeClass(c.cursor),v.off("resize"+p)}),w("Resize"+d,b.resizeImage),b.isLowIE&&w("AfterChange",b.resizeImage)},resizeImage:function(){var a=b.currItem;if(a&&a.img&&b.st.image.verticalFit){var c=0;b.isLowIE&&(c=parseInt(a.img.css("padding-top"),10)+parseInt(a.img.css("padding-bottom"),10)),a.img.css("max-height",b.wH-c)}},_onImageHasSize:function(a){a.img&&(a.hasSize=!0,L&&clearInterval(L),a.isCheckingImgSize=!1,y("ImageHasSize",a),a.imgHidden&&(b.content&&b.content.removeClass("mfp-loading"),a.imgHidden=!1))},findImageSize:function(a){var c=0,d=a.img[0],e=function(f){L&&clearInterval(L),L=setInterval(function(){return d.naturalWidth>0?void b._onImageHasSize(a):(c>200&&clearInterval(L),c++,void(3===c?e(10):40===c?e(50):100===c&&e(500)))},f)};e(1)},getImage:function(c,d){var e=0,f=function(){c&&(c.img[0].complete?(c.img.off(".mfploader"),c===b.currItem&&(b._onImageHasSize(c),b.updateStatus("ready")),c.hasSize=!0,c.loaded=!0,y("ImageLoadComplete")):(e++,200>e?setTimeout(f,100):g()))},g=function(){c&&(c.img.off(".mfploader"),c===b.currItem&&(b._onImageHasSize(c),b.updateStatus("error",h.tError.replace("%url%",c.src))),c.hasSize=!0,c.loaded=!0,c.loadError=!0)},h=b.st.image,i=d.find(".mfp-img");if(i.length){var j=document.createElement("img");j.className="mfp-img",c.el&&c.el.find("img").length&&(j.alt=c.el.find("img").attr("alt")),c.img=a(j).on("load.mfploader",f).on("error.mfploader",g),j.src=c.src,i.is("img")&&(c.img=c.img.clone()),j=c.img[0],j.naturalWidth>0?c.hasSize=!0:j.width||(c.hasSize=!1)}return b._parseMarkup(d,{title:M(c),img_replaceWith:c.img},c),b.resizeImage(),c.hasSize?(L&&clearInterval(L),c.loadError?(d.addClass("mfp-loading"),b.updateStatus("error",h.tError.replace("%url%",c.src))):(d.removeClass("mfp-loading"),b.updateStatus("ready")),d):(b.updateStatus("loading"),c.loading=!0,c.hasSize||(c.imgHidden=!0,d.addClass("mfp-loading"),b.findImageSize(c)),d)}}});var N,O=function(){return void 0===N&&(N=void 0!==document.createElement("p").style.MozTransform),N};a.magnificPopup.registerModule("zoom",{options:{enabled:!1,easing:"ease-in-out",duration:300,opener:function(a){return a.is("img")?a:a.find("img")}},proto:{initZoom:function(){var a,c=b.st.zoom,d=".zoom";if(c.enabled&&b.supportsTransition){var e,f,g=c.duration,j=function(a){var b=a.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),d="all "+c.duration/1e3+"s "+c.easing,e={position:"fixed",zIndex:9999,left:0,top:0,"-webkit-backface-visibility":"hidden"},f="transition";return e["-webkit-"+f]=e["-moz-"+f]=e["-o-"+f]=e[f]=d,b.css(e),b},k=function(){b.content.css("visibility","visible")};w("BuildControls"+d,function(){if(b._allowZoom()){if(clearTimeout(e),b.content.css("visibility","hidden"),a=b._getItemToZoom(),!a)return void k();f=j(a),f.css(b._getOffset()),b.wrap.append(f),e=setTimeout(function(){f.css(b._getOffset(!0)),e=setTimeout(function(){k(),setTimeout(function(){f.remove(),a=f=null,y("ZoomAnimationEnded")},16)},g)},16)}}),w(i+d,function(){if(b._allowZoom()){if(clearTimeout(e),b.st.removalDelay=g,!a){if(a=b._getItemToZoom(),!a)return;f=j(a)}f.css(b._getOffset(!0)),b.wrap.append(f),b.content.css("visibility","hidden"),setTimeout(function(){f.css(b._getOffset())},16)}}),w(h+d,function(){b._allowZoom()&&(k(),f&&f.remove(),a=null)})}},_allowZoom:function(){return"image"===b.currItem.type},_getItemToZoom:function(){return b.currItem.hasSize?b.currItem.img:!1},_getOffset:function(c){var d;d=c?b.currItem.img:b.st.zoom.opener(b.currItem.el||b.currItem);var e=d.offset(),f=parseInt(d.css("padding-top"),10),g=parseInt(d.css("padding-bottom"),10);e.top-=a(window).scrollTop()-f;var h={width:d.width(),height:(u?d.innerHeight():d[0].offsetHeight)-g-f};return O()?h["-moz-transform"]=h.transform="translate("+e.left+"px,"+e.top+"px)":(h.left=e.left,h.top=e.top),h}}});var P="iframe",Q="//about:blank",R=function(a){if(b.currTemplate[P]){var c=b.currTemplate[P].find("iframe");c.length&&(a||(c[0].src=Q),b.isIE8&&c.css("display",a?"block":"none"))}};a.magnificPopup.registerModule(P,{options:{markup:'<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',srcAction:"iframe_src",patterns:{youtube:{index:"youtube.com",id:"v=",src:"//www.youtube.com/embed/%id%?autoplay=1"},vimeo:{index:"vimeo.com/",id:"/",src:"//player.vimeo.com/video/%id%?autoplay=1"},gmaps:{index:"//maps.google.",src:"%id%&output=embed"}}},proto:{initIframe:function(){b.types.push(P),w("BeforeChange",function(a,b,c){b!==c&&(b===P?R():c===P&&R(!0))}),w(h+"."+P,function(){R()})},getIframe:function(c,d){var e=c.src,f=b.st.iframe;a.each(f.patterns,function(){return e.indexOf(this.index)>-1?(this.id&&(e="string"==typeof this.id?e.substr(e.lastIndexOf(this.id)+this.id.length,e.length):this.id.call(this,e)),e=this.src.replace("%id%",e),!1):void 0});var g={};return f.srcAction&&(g[f.srcAction]=e),b._parseMarkup(d,g,c),b.updateStatus("ready"),d}}});var S=function(a){var c=b.items.length;return a>c-1?a-c:0>a?c+a:a},T=function(a,b,c){return a.replace(/%curr%/gi,b+1).replace(/%total%/gi,c)};a.magnificPopup.registerModule("gallery",{options:{enabled:!1,arrowMarkup:'<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',preload:[0,2],navigateByImgClick:!0,arrows:!0,tPrev:"Previous (Left arrow key)",tNext:"Next (Right arrow key)",tCounter:"%curr% of %total%"},proto:{initGallery:function(){var c=b.st.gallery,e=".mfp-gallery",g=Boolean(a.fn.mfpFastClick);return b.direction=!0,c&&c.enabled?(f+=" mfp-gallery",w(m+e,function(){c.navigateByImgClick&&b.wrap.on("click"+e,".mfp-img",function(){return b.items.length>1?(b.next(),!1):void 0}),d.on("keydown"+e,function(a){37===a.keyCode?b.prev():39===a.keyCode&&b.next()})}),w("UpdateStatus"+e,function(a,c){c.text&&(c.text=T(c.text,b.currItem.index,b.items.length))}),w(l+e,function(a,d,e,f){var g=b.items.length;e.counter=g>1?T(c.tCounter,f.index,g):""}),w("BuildControls"+e,function(){if(b.items.length>1&&c.arrows&&!b.arrowLeft){var d=c.arrowMarkup,e=b.arrowLeft=a(d.replace(/%title%/gi,c.tPrev).replace(/%dir%/gi,"left")).addClass(s),f=b.arrowRight=a(d.replace(/%title%/gi,c.tNext).replace(/%dir%/gi,"right")).addClass(s),h=g?"mfpFastClick":"click";e[h](function(){b.prev()}),f[h](function(){b.next()}),b.isIE7&&(x("b",e[0],!1,!0),x("a",e[0],!1,!0),x("b",f[0],!1,!0),x("a",f[0],!1,!0)),b.container.append(e.add(f))}}),w(n+e,function(){b._preloadTimeout&&clearTimeout(b._preloadTimeout),b._preloadTimeout=setTimeout(function(){b.preloadNearbyImages(),b._preloadTimeout=null},16)}),void w(h+e,function(){d.off(e),b.wrap.off("click"+e),b.arrowLeft&&g&&b.arrowLeft.add(b.arrowRight).destroyMfpFastClick(),b.arrowRight=b.arrowLeft=null})):!1},next:function(){b.direction=!0,b.index=S(b.index+1),b.updateItemHTML()},prev:function(){b.direction=!1,b.index=S(b.index-1),b.updateItemHTML()},goTo:function(a){b.direction=a>=b.index,b.index=a,b.updateItemHTML()},preloadNearbyImages:function(){var a,c=b.st.gallery.preload,d=Math.min(c[0],b.items.length),e=Math.min(c[1],b.items.length);for(a=1;a<=(b.direction?e:d);a++)b._preloadItem(b.index+a);for(a=1;a<=(b.direction?d:e);a++)b._preloadItem(b.index-a)},_preloadItem:function(c){if(c=S(c),!b.items[c].preloaded){var d=b.items[c];d.parsed||(d=b.parseEl(c)),y("LazyLoad",d),"image"===d.type&&(d.img=a('<img class="mfp-img" />').on("load.mfploader",function(){d.hasSize=!0}).on("error.mfploader",function(){d.hasSize=!0,d.loadError=!0,y("LazyLoadError",d)}).attr("src",d.src)),d.preloaded=!0}}}});var U="retina";a.magnificPopup.registerModule(U,{options:{replaceSrc:function(a){return a.src.replace(/\.\w+$/,function(a){return"@2x"+a})},ratio:1},proto:{initRetina:function(){if(window.devicePixelRatio>1){var a=b.st.retina,c=a.ratio;c=isNaN(c)?c():c,c>1&&(w("ImageHasSize."+U,function(a,b){b.img.css({"max-width":b.img[0].naturalWidth/c,width:"100%"})}),w("ElementParse."+U,function(b,d){d.src=a.replaceSrc(d,c)}))}}}}),function(){var b=1e3,c="ontouchstart"in window,d=function(){v.off("touchmove"+f+" touchend"+f)},e="mfpFastClick",f="."+e;a.fn.mfpFastClick=function(e){return a(this).each(function(){var g,h=a(this);if(c){var i,j,k,l,m,n;h.on("touchstart"+f,function(a){l=!1,n=1,m=a.originalEvent?a.originalEvent.touches[0]:a.touches[0],j=m.clientX,k=m.clientY,v.on("touchmove"+f,function(a){m=a.originalEvent?a.originalEvent.touches:a.touches,n=m.length,m=m[0],(Math.abs(m.clientX-j)>10||Math.abs(m.clientY-k)>10)&&(l=!0,d())}).on("touchend"+f,function(a){d(),l||n>1||(g=!0,a.preventDefault(),clearTimeout(i),i=setTimeout(function(){g=!1},b),e())})})}h.on("click"+f,function(){g||e()})})},a.fn.destroyMfpFastClick=function(){a(this).off("touchstart"+f+" click"+f),c&&v.off("touchmove"+f+" touchend"+f)}}(),A()});
(function($){
dokan.login_form_popup={
form_html: '',
init: function (){
$('body').on('dokan:login_form_popup:show', this.get_form);
$('body').on('submit', '#dokan-login-form-popup-form', this.submit_form);
$('body').on('dokan:login_form_popup:working', this.working);
$('body').on('dokan:login_form_popup:done_working', this.done_working);
},
get_form: function (e, options){
if(dokan.login_form_popup.form_html){
dokan.login_form_popup.show_popup();
return;
}
options=$.extend(true, {
nonce: dokan.nonce,
action: 'dokan_get_login_form'
}, options);
$('body').trigger('dokan:login_form_popup:fetching_form');
$.ajax({
url: dokan.ajaxurl,
method: 'get',
dataType: 'json',
data: {
_wpnonce: options.nonce,
action: options.action
}}).done(function(response){
dokan.login_form_popup.form_html=response.data;
dokan.login_form_popup.show_popup();
$('body').trigger('dokan:login_form_popup:fetched_form');
});
},
show_popup: function (){
$.magnificPopup.open({
items: {
src: dokan.login_form_popup.form_html,
type: 'inline'
},
callbacks: {
open: function (){
$('body').trigger('dokan:login_form_popup:opened');
}}
});
},
submit_form: function(e){
e.preventDefault();
var form_data=$(this).serialize();
var error_section=$('.dokan-login-form-error', '#dokan-login-form-popup-form');
error_section.removeClass('has-error').text('');
$('body').trigger('dokan:login_form_popup:working');
$.ajax({
url: dokan.ajaxurl,
method: 'post',
dataType: 'json',
data: {
_wpnonce: dokan.nonce,
action: 'dokan_login_user',
form_data: form_data
}}).done(function(response){
$('body').trigger('dokan:login_form_popup:logged_in', response);
$.magnificPopup.close();
}).always(function (){
$('body').trigger('dokan:login_form_popup:done_working');
}).fail(function(jqXHR){
if(jqXHR.responseJSON&&jqXHR.responseJSON.data&&jqXHR.responseJSON.data.message){
error_section.addClass('has-error').text(jqXHR.responseJSON.data.message);
}});
},
working: function (){
$('fieldset', '#dokan-login-form-popup-form').prop('disabled', true);
$('#dokan-login-form-submit-btn').addClass('dokan-hide');
$('#dokan-login-form-working-btn').removeClass('dokan-hide');
},
done_working: function (){
$('fieldset', '#dokan-login-form-popup-form').prop('disabled', false);
$('#dokan-login-form-submit-btn').removeClass('dokan-hide');
$('#dokan-login-form-working-btn').addClass('dokan-hide');
}};
dokan.login_form_popup.init();
})(jQuery);
!function(a){var t={};function e(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return a[n].call(i.exports,i,i.exports,e),i.l=!0,i.exports}e.m=a,e.c=t,e.d=function(a,t,n){e.o(a,t)||Object.defineProperty(a,t,{enumerable:!0,get:n})},e.r=function(a){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(a,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(a,"__esModule",{value:!0})},e.t=function(a,t){if(1&t&&(a=e(a)),8&t)return a;if(4&t&&"object"==typeof a&&a&&a.__esModule)return a;var n=Object.create(null);if(e.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:a}),2&t&&"string"!=typeof a)for(var i in a)e.d(n,i,function(t){return a[t]}.bind(null,i));return n},e.n=function(a){var t=a&&a.__esModule?function(){return a.default}:function(){return a};return e.d(t,"a",t),t},e.o=function(a,t){return Object.prototype.hasOwnProperty.call(a,t)},e.p="",e(e.s=84)}({20:function(a,t,e){var n=e(31),i=e(32),o=e(33);a.exports=function(a){return n(a)||i(a)||o()}},22:function(a,t,e){},23:function(a,t){var e;(e=jQuery)(document).ready((function(){e(".dokan-announcement-wrapper").on("click","a.remove_announcement",(function(a){if(a.preventDefault(),confirm(dokan.delete_confirm)){var t=e(this),n={action:"dokan_announcement_remove_row",row_id:t.data("notice_row"),_wpnonce:dokan.nonce};t.closest(".dokan-announcement-wrapper-item").append('<span class="dokan-loading" style="position:absolute;top:2px; right:15px"> </span>');var i=e(".dokan-announcement-wrapper-item").length;e.post(dokan.ajaxurl,n,(function(a){a.success?(t.closest(".dokan-announcement-wrapper-item").find("span.dokan-loading").remove(),t.closest(".dokan-announcement-wrapper-item").fadeOut((function(){e(this).remove(),1==i&&e(".dokan-announcement-wrapper").html(a.data)}))):alert(dokan.wrong_message)}))}}))}))},24:function(a,t){!function(a){a.validator.setDefaults({ignore:":hidden"});var t=function(t,e){a(e).closest(".form-group").addClass("has-error").append(t)},e=function(t,e){a(e).closest(".form-group").removeClass("has-error")};({init:function(){this.couponsValidation(this)},couponsValidation:function(n){a("form.coupons").validate({errorElement:"span",errorClass:"error",errorPlacement:t,success:e})}}).init()}(jQuery)},25:function(a,t){jQuery(document).ready((function(a){"use strict";function t(t){this.$table=a(t),this.current_tr=null,this.current_tr_posX=0,this.edit_form=null,this.current_product_id=0,this.bindElements()}t.prototype.bindElements=function(){var t=this;t.$table.on("click",".item-inline-edit",(function(e){if(e.preventDefault(),!dokan.is_vendor_enabled)return alert(dokan.not_enable_message);t.$table.find("tr.dokan-product-list-inline-edit-form").addClass("dokan-hide");var n=a(this).children("a");t.current_product_id=n.data("product-id"),t.current_tr=n.parents("tr"),t.current_tr_posX=t.current_tr.offset().top,t.current_tr.addClass("dokan-hide"),t.edit_form=t.current_tr.next(".dokan-product-list-inline-edit-form"),t.edit_form.removeClass("dokan-hide"),t.bindSelect2(),t.scrollTop()})),t.$table.on("click",".inline-edit-cancel",(function(a){a.preventDefault(),t.current_tr.removeClass("dokan-hide").next(".dokan-product-list-inline-edit-form").addClass("dokan-hide"),t.scrollTop()})),t.$table.on("click",".inline-edit-update",(function(e){e.preventDefault();var n=a(this),i=n.parent(),o=n.parents("fieldset");i.addClass("show-loading-animation"),o.attr("disabled","disabled");var r={};t.edit_form.find("[data-field-name]").each((function(){"checkbox"===a(this).attr("type")?r[a(this).data("field-name")]=a(this).is(":checked"):r[a(this).data("field-name")]=a(this).val()})),a.ajax({url:dokan.ajaxurl,method:"post",dataType:"json",data:{action:"dokan_product_inline_edit",security:dokan.product_inline_edit_nonce,data:r}}).done((function(a){a.data&&a.data.row&&(t.scrollTop(t.current_tr),t.edit_form.addClass("dokan-hide").prev().replaceWith(a.data.row))})).fail((function(a){a.responseJSON&&"string"==typeof a.responseJSON.data&&alert(a.responseJSON.data)})).always((function(){i.removeClass("show-loading-animation"),o.removeAttr("disabled")}))})),t.$table.on("click","[data-field-toggler]",(function(e){var n=a(this).data("field-name"),i=a(this).is(":checked");t.edit_form.find('[data-field-toggle="'+n+'"]').each((function(){var e=a(this),n=e.data("field-show-on");i==n?e.removeClass("dokan-hide"):e.addClass("dokan-hide"),e.find(".dokan-select2").select2("destroy").removeClass("dokan-select2"),t.bindSelect2()}))}))},t.prototype.bindSelect2=function(){this.edit_form.find("select:not(.dokan-select2)").addClass("dokan-select2").select2()},t.prototype.scrollTop=function(){a("html, body").scrollTop(this.current_tr_posX-50)},a(".dokan-inline-editable-table").each((function(){new t(this)}))}))},26:function(a,t){jQuery((function(a){var t={init:function(){a("#dokan-variable-product-options").on("change","input.variable_is_downloadable",this.variable_is_downloadable).on("change","input.variable_is_virtual",this.variable_is_virtual).on("change","input.variable_manage_stock",this.variable_manage_stock).on("click",".expand_all",this.expand_all).on("click",".close_all",this.close_all).on("click",".dokan-product-variation-itmes .sort",this.set_menu_order).on("reload",this.reload),a("input.variable_is_downloadable, input.variable_is_virtual, input.variable_manage_stock").change(),a(".dokan-product-variation-wrapper").on("dokan_variations_loaded",this.variations_loaded),a(document.body).on("dokan_variations_added",this.variation_added)},reload:function(){e.load_variations(1),n.set_paginav(0)},variable_is_downloadable:function(){a(this).closest(".dokan-product-variation-itmes").find(".show_if_variation_downloadable").hide(),a(this).is(":checked")&&a(this).closest(".dokan-product-variation-itmes").find(".show_if_variation_downloadable").show()},variable_is_virtual:function(){a(this).closest(".dokan-product-variation-itmes").find(".hide_if_variation_virtual").show(),a(this).is(":checked")&&a(this).closest(".dokan-product-variation-itmes").find(".hide_if_variation_virtual").hide()},variable_manage_stock:function(){a(this).closest(".dokan-product-variation-itmes").find(".show_if_variation_manage_stock").hide(),a(this).is(":checked")&&a(this).closest(".dokan-product-variation-itmes").find(".show_if_variation_manage_stock").show()},expand_all:function(t){return a(this).closest("#dokan-variable-product-options-inner").find(".dokan-product-variation-itmes > .dokan-variable-attributes").show(),!1},close_all:function(t){return a(this).closest("#dokan-variable-product-options-inner").find(".dokan-product-variation-itmes > .dokan-variable-attributes").hide(),!1},variations_loaded:function(e,n){n=n||!1;var i=a(".dokan-product-variation-wrapper");function o(t){Number(t.closest(".variable_pricing").find("span.vendor-price").text())<0?(t.closest(".variable_pricing").find(".save-variation-changes").attr("disabled","disabled"),t.closest(".variable_pricing").find(".dokan-product-less-price-alert").removeClass("dokan-hide"),a("input[type=submit]").attr("disabled","disabled")):(t.closest(".variable_pricing").find(".dokan-product-less-price-alert").addClass("dokan-hide"),t.closest(".variable_pricing").find(".save-variation-changes").removeAttr("disabled"),a("input[type=submit]").removeAttr("disabled"))}n||(a("input.variable_is_downloadable, input.variable_is_virtual, input.variable_manage_stock",i).change(),a(".dokan-product-variation-itmes",i).each((function(t,e){var n=a(e),i=a(".sale_price_dates_from",n).val(),o=a(".sale_price_dates_to",n).val();""===i&&""===o||a("a.sale_schedule",n).click()})),a(".dokan-variations-container .variation-needs-update",i).removeClass("variation-needs-update"),a("button.cancel-variation-changes, button.save-variation-changes",i).attr("disabled","disabled")),a("h3.variation-topbar-heading",i).on("click",(function(t){t.preventDefault();var e=a(this);e.closest(".dokan-product-variation-itmes").find(".dokan-variable-attributes").slideToggle(300,(function(){a(this).is(":visible")?e.closest(".dokan-product-variation-itmes").find("i.fa-sort-desc").removeClass("fa-flip-horizointal").addClass("fa-flip-vertical"):e.closest(".dokan-product-variation-itmes").find("i.fa-sort-desc").removeClass("fa-flip-vertical").addClass("fa-flip-horizointal")}))})),a(".toggle-variation-content",i).on("click",(function(t){t.preventDefault();var e=a(this);return e.closest(".dokan-product-variation-itmes").find(".dokan-variable-attributes").slideToggle(300,(function(){a(this).is(":visible")?e.removeClass("fa-flip-horizointal").addClass("fa-flip-vertical"):e.removeClass("fa-flip-vertical").addClass("fa-flip-horizointal")})),!1})),a(".tips").tooltip(),a("input.dokan-product-regular-price-variable, input.dokan-product-sales-price-variable").on("keyup",_.debounce((function(){!function(t){var e=a("select#product_cat").find("option:selected");if(""!=e.data("commission")){e.data("commission");var n=e.data("product-id")}else a("span.vendor-earning").data("commission"),n=a("span.vendor-earning").data("product-id");""==a("input.dokan-product-sales-price-variable").val()?a("input.dokan-product-regular-price-variable").each((function(e,i){var r=a(i),s=r.closest(".content-half-part").find("span.vendor-price"),d=a(this).closest(i).val();s.html("Calculating"),a.get(dokan.ajaxurl,{action:"get_vendor_earning",product_id:n,product_price:d,_wpnonce:dokan.nonce}).done((function(a){s.html(a),o(r),"function"==typeof t&&t()}))})):a("input.dokan-product-sales-price-variable").each((function(e,i){var r=a(i),s=r.closest(".variable_pricing").find("span.vendor-price"),d=a(this).closest(i).val();s.html("Calculating"),a.get(dokan.ajaxurl,{action:"get_vendor_earning",product_id:n,product_price:d||0,_wpnonce:dokan.nonce}).done((function(a){s.html(a),o(r),"function"==typeof t&&t()})),o(r)}))}()}),750)),a(".sale_price_dates_fields",i).each((function(){var t=a(this).find("input").datepicker({defaultDate:"",dateFormat:"yy-mm-dd",numberOfMonths:1,showButtonPanel:!0,onSelect:function(e){var n=a(this).is(".sale_price_dates_from")?"minDate":"maxDate",i=a(this).data("datepicker"),o=a.datepicker.parseDate(i.settings.dateFormat||a.datepicker._defaults.dateFormat,e,i.settings);t.not(this).datepicker("option",n,o),a(this).change()}})})),a(".dokan-variations-container",i).sortable({items:".dokan-product-variation-itmes",cursor:"move",axis:"y",handle:".sort",scrollSensitivity:40,forcePlaceholderSize:!0,helper:"clone",opacity:.65,stop:function(){t.variation_row_indexes()}})},variation_added:function(a,e){1===e&&t.variations_loaded(null,!0)},set_menu_order:function(t){t.preventDefault();var n=a(this).closest(".dokan-product-variation-itmes").find(".variation_menu_order"),i=window.prompt(dokan.i18n_enter_menu_order,n.val());null!=i&&(n.val(parseInt(i,10)).change(),e.save_variations())},variation_row_indexes:function(){var t=a("#dokan-variable-product-options").find(".dokan-variations-container"),e=parseInt(t.attr("data-page"),10),n=parseInt((e-1)*dokan.variations_per_page,10);a(".dokan-variations-container .dokan-product-variation-itmes").each((function(t,e){a(".variation_menu_order",e).val(parseInt(a(e).index(".dokan-variations-container .dokan-product-variation-itmes"),10)+1+n).change()}))}},e={init:function(){this.load_variations(),this.initial_load(),a("#dokan-variable-product-options").on("click","button.save-variation-changes",this.save_variations).on("click","button.cancel-variation-changes",this.cancel_variations).on("click",".remove_variation",this.remove_variation),a(document.body).on("change","#dokan-variable-product-options .dokan-variations-container :input",this.input_changed).on("change",".dokan-variations-defaults select",this.defaults_changed),a("form.dokan-product-edit-form").on("submit",this.save_on_submit),a("#dokan-variable-product-options").on("click","a.do_variation_action",this.do_variation_action)},check_for_changes:function(){var t=a("#dokan-variable-product-options").find(".dokan-variations-container .variation-needs-update");if(0<t.length){if(!window.confirm(dokan.i18n_edited_variations))return t.removeClass("variation-needs-update"),!1;e.save_changes()}return!0},block:function(){a(".dokan-product-variation-wrapper").block({message:null,fadeIn:100,fadeOut:2e3,overlayCSS:{background:"#fff",opacity:.6}})},unblock:function(){a(".dokan-product-variation-wrapper").unblock()},initial_load:function(){0===a("#dokan-variable-product-options").find(".dokan-variations-container .dokan-product-variation-itmes").length&&n.go_to_page()},load_variations:function(t,n){t=t||1,n=n||dokan.variations_per_page;var i=a("#dokan-variable-product-options").find(".dokan-variations-container");e.block(),a.ajax({url:dokan.ajaxurl,data:{action:"dokan_load_variations",security:dokan.load_variations_nonce,product_id:a("#dokan-edit-product-id").val(),attributes:i.data("attributes"),page:t,per_page:n},type:"POST",success:function(n){i.empty().append(n).attr("data-page",t),a(".dokan-product-variation-wrapper").trigger("dokan_variations_loaded"),e.unblock()}})},get_variations_fields:function(t){var e=a(":input",t).serializeJSON();return a(".dokan-variations-defaults select").each((function(t,n){var i=a(n);e[i.attr("name")]=i.val()})),e},save_changes:function(t){var n=a("#dokan-variable-product-options").find(".dokan-variations-container"),i=a(".variation-needs-update",n),o={};0<i.length&&(e.block(),(o=e.get_variations_fields(i)).action="dokan_save_variations",o.security=dokan.save_variations_nonce,o.product_id=a("#dokan-edit-product-id").val(),o.product_type=a("#product_type").val(),a.ajax({url:dokan.ajaxurl,data:o,type:"POST",success:function(n){i.removeClass("variation-needs-update"),a("button.cancel-variation-changes, button.save-variation-changes").attr("disabled","disabled"),a(".dokan-product-variation-wrapper").trigger("dokan_variations_saved"),"function"==typeof t&&t(n),e.unblock()}}))},save_variations:function(){return a("#dokan-variable-product-options").trigger("dokan_variations_save_variations_button"),e.save_changes((function(t){var e=a("#dokan-variable-product-options").find(".dokan-variations-container"),i=e.attr("data-page");a("#dokan-variable-product-options").find("#dokan_errors").remove(),t&&e.before(t),a(".dokan-variations-defaults select").each((function(){a(this).attr("data-current",a(this).val())})),n.go_to_page(i)})),!1},save_on_submit:function(t){0<a("#dokan-variable-product-options").find(".dokan-variations-container .variation-needs-update").length&&(t.preventDefault(),a("#dokan-variable-product-options").trigger("dokan_variations_save_variations_on_submit"),e.save_changes(e.save_on_submit_done))},save_on_submit_done:function(){a("form.dokan-product-edit-form").submit()},cancel_variations:function(){var t=parseInt(a("#dokan-variable-product-options").find(".dokan-variations-container").attr("data-page"),10);return a("#dokan-variable-product-options").find(".dokan-variations-container .variation-needs-update").removeClass("variation-needs-update"),a(".dokan-variations-defaults select").each((function(){a(this).val(a(this).attr("data-current"))})),n.go_to_page(t),!1},add_variation:function(){e.block();var t={action:"dokan_add_variation",post_id:a("#dokan-edit-product-id").val(),loop:a(".dokan-product-variation-itmes").length,security:dokan.add_variation_nonce};return a.post(dokan.ajaxurl,t,(function(t){var n=a(t);n.addClass("variation-needs-update"),a("#dokan-variable-product-options").find(".dokan-variations-container").prepend(n),a("button.cancel-variation-changes, button.save-variation-changes").removeAttr("disabled"),a(".dokan-product-variation-wrapper").trigger("dokan_variations_added",1),e.unblock()})),!1},remove_variation:function(t){if(t.preventDefault(),e.check_for_changes(),window.confirm(dokan.i18n_remove_variation)){var i=a(this).attr("rel"),o=[],r={action:"dokan_remove_variation"};e.block(),0<i?(o.push(i),r.variation_ids=o,r.security=dokan.delete_variations_nonce,a.post(dokan.ajaxurl,r,(function(){var t=a("#dokan-variable-product-options").find(".dokan-variations-container"),e=parseInt(t.attr("data-page"),10),i=Math.ceil((parseInt(t.attr("data-total"),10)-1)/dokan.variations_per_page),o=1;a(".dokan-product-variation-wrapper").trigger("dokan_variations_removed"),e===i||e<=i?o=e:e>i&&0!==i&&(o=i),n.go_to_page(o,-1)}))):e.unblock()}return!1},link_all_variations:function(){if(e.check_for_changes(),window.confirm(dokan.i18n_link_all_variations)){e.block();var t={action:"dokan_link_all_variations",post_id:a("#dokan-edit-product-id").val(),security:dokan.link_variation_nonce};a.post(dokan.ajaxurl,t,(function(t){var i=parseInt(t,10);1===i?window.alert(i+" "+dokan.i18n_variation_added):0===i||i>1?window.alert(i+" "+dokan.i18n_variations_added):window.alert(dokan.i18n_no_variations_added),i>0?(n.go_to_page(1,i),a(".dokan-product-variation-wrapper").trigger("dokan_variations_added",i)):e.unblock()}))}return!1},input_changed:function(){a(this).closest(".dokan-product-variation-itmes").addClass("variation-needs-update"),a("button.cancel-variation-changes, button.save-variation-changes").removeAttr("disabled"),a(".dokan-product-variation-wrapper").trigger("dokan_variations_input_changed")},defaults_changed:function(){a(this).closest("#dokan-variable-product-options").find(".dokan-product-variation-itmes:first").addClass("variation-needs-update"),a("button.cancel-variation-changes, button.save-variation-changes").removeAttr("disabled"),a("#dokan-variable-product-options").trigger("dokan_variations_defaults_changed")},do_variation_action:function(){var t,i=a("select.variation-actions").val(),o={},r=0;switch(i){case"add_variation":return void e.add_variation();case"link_all_variations":return void e.link_all_variations();case"delete_all":window.confirm(dokan.i18n_delete_all_variations)&&window.confirm(dokan.i18n_last_warning)&&(o.allowed=!0,r=-1*parseInt(a("#dokan-variable-product-options").find(".dokan-variations-container").attr("data-total"),10));break;case"variable_regular_price_increase":case"variable_regular_price_decrease":case"variable_sale_price_increase":case"variable_sale_price_decrease":null!=(t=window.prompt(dokan.i18n_enter_a_value_fixed_or_percent))&&(t.indexOf("%")>=0?o.value=accounting.unformat(t.replace(/\%/,""),dokan_refund.mon_decimal_point)+"%":o.value=accounting.unformat(t,dokan_refund.mon_decimal_point));break;case"variable_regular_price":case"variable_sale_price":case"variable_stock":case"variable_weight":case"variable_length":case"variable_width":case"variable_height":case"variable_download_limit":case"variable_download_expiry":null!=(t=window.prompt(dokan.i18n_enter_a_value))&&(o.value=t);break;case"variable_sale_schedule":o.date_from=window.prompt(dokan.i18n_scheduled_sale_start),o.date_to=window.prompt(dokan.i18n_scheduled_sale_end),null===o.date_from&&(o.date_from=!1),null===o.date_to&&(o.date_to=!1);break;default:a("select.variation-actions").trigger(i),o=a("select.variation-actions").triggerHandler(i+"_ajax_data",o)}"delete_all"===i&&o.allowed?a("#dokan-variable-product-options").find(".variation-needs-update").removeClass("variation-needs-update"):e.check_for_changes(),e.block(),a.ajax({url:dokan.ajaxurl,data:{action:"dokan_bulk_edit_variations",security:dokan.bulk_edit_variations_nonce,product_id:a("#dokan-edit-product-id").val(),product_type:a("#product_type").val(),bulk_action:i,data:o},type:"POST",success:function(){n.go_to_page(1,r)}})}},n={init:function(){a(document.body).on("dokan_variations_added",this.update_single_quantity).on("change",".dokan-variations-pagenav .page-selector",this.page_selector).on("click",".dokan-variations-pagenav .first-page",this.first_page).on("click",".dokan-variations-pagenav .prev-page",this.prev_page).on("click",".dokan-variations-pagenav .next-page",this.next_page).on("click",".dokan-variations-pagenav .last-page",this.last_page)},update_variations_count:function(t){var e=a("#dokan-variable-product-options").find(".dokan-variations-container"),n=parseInt(e.attr("data-total"),10)+t,i=a(".dokan-variations-pagenav .displaying-num");return e.attr("data-total",n),1===n?i.text(dokan.i18n_variation_count_single.replace("%qty%",n)):i.text(dokan.i18n_variation_count_plural.replace("%qty%",n)),n},update_single_quantity:function(t,e){if(1===e){var i=a(".dokan-variations-pagenav");n.update_variations_count(e),i.is(":hidden")&&(a("option, optgroup","select.variation-actions").show(),a("select.variation-actions").val("add_variation"),a("#dokan-variable-product-options").find(".dokan-variation-action-toolbar").show(),i.show(),a(".pagination-links",i).hide())}},set_paginav:function(t){var e=a("#dokan-variable-product-options").find(".dokan-variations-container"),i=n.update_variations_count(t),o=a("#dokan-variable-product-options").find(".dokan-variation-action-toolbar"),r=a("select.variation-actions"),s=a(".dokan-variations-pagenav"),d=a(".pagination-links",s),c=Math.ceil(i/dokan.variations_per_page),l="";e.attr("data-total_pages",c),a(".total-pages",s).text(c);for(var p=1;p<=c;p++)l+='<option value="'+p+'">'+p+"</option>";a(".page-selector",s).empty().html(l),0===i?(o.not(".toolbar-top, .toolbar-buttons").hide(),s.hide(),a("option, optgroup",r).hide(),a("select.variation-actions").val("add_variation"),a('option[data-global="true"]',r).show()):(o.show(),s.show(),a("option, optgroup",r).show(),a("select.variation-actions").val("add_variation"),1===c?d.hide():d.show())},check_is_enabled:function(t){return!a(t).hasClass("disabled")},change_classes:function(t,e){var n=a(".dokan-variations-pagenav .first-page"),i=a(".dokan-variations-pagenav .prev-page"),o=a(".dokan-variations-pagenav .next-page"),r=a(".dokan-variations-pagenav .last-page");1===t?(n.addClass("disabled"),i.addClass("disabled")):(n.removeClass("disabled"),i.removeClass("disabled")),e===t?(o.addClass("disabled"),r.addClass("disabled")):(o.removeClass("disabled"),r.removeClass("disabled"))},set_page:function(t){a(".dokan-variations-pagenav .page-selector").val(t).first().change()},go_to_page:function(a,t){a=a||1,t=t||0,n.set_paginav(t),n.set_page(a)},page_selector:function(){var t=parseInt(a(this).val(),10),i=a("#dokan-variable-product-options").find(".dokan-variations-container");a(".dokan-variations-pagenav .page-selector").val(t),e.check_for_changes(),n.change_classes(t,parseInt(i.attr("data-total_pages"),10)),e.load_variations(t)},first_page:function(){return n.check_is_enabled(this)&&n.set_page(1),!1},prev_page:function(){if(n.check_is_enabled(this)){var t=a("#dokan-variable-product-options").find(".dokan-variations-container"),e=parseInt(t.attr("data-page"),10)-1,i=0<e?e:1;n.set_page(i)}return!1},next_page:function(){if(n.check_is_enabled(this)){var t=a("#dokan-variable-product-options").find(".dokan-variations-container"),e=parseInt(t.attr("data-total_pages"),10),i=parseInt(t.attr("data-page"),10)+1,o=e>=i?i:e;n.set_page(o)}return!1},last_page:function(){if(n.check_is_enabled(this)){var t=a("#dokan-variable-product-options").find(".dokan-variations-container").attr("data-total_pages");n.set_page(t)}return!1}};a((function(){a("#dokan-variable-product-options").length&&(t.init(),e.init(),n.init())}))}))},27:function(a,t){var e,n,i;e=jQuery,n=e("#variants-holder"),(i={init:function(){e(".dokan-toggle-sidebar").on("click","a.dokan-toggle-edit",this.sidebarToggle.showStatus),e(".dokan-toggle-sidebar").on("click","a.dokan-toggle-save",this.sidebarToggle.saveStatus),e(".dokan-toggle-sidebar").on("click","a.dokan-toggle-cacnel",this.sidebarToggle.cancel),e("#product-attributes").on("click",".add-variant-category",this.variants.addCategory),e("#variants-holder").on("click",".box-header .row-remove",this.variants.removeCategory),e("#variants-holder").on("click",".item-action a.row-add",this.variants.addItem),e("#variants-holder").on("click",".item-action a.row-remove",this.variants.removeItem),e("body, #variable_product_options").on("click",".sale_schedule",this.variants.saleSchedule),e("body, #variable_product_options").on("click",".cancel_sale_schedule",this.variants.cancelSchedule),e("#variable_product_options").on("woocommerce_variations_added",this.variants.onVariantAdded),e(".save_attributes").on("click",this.variants.save),this.variants.dates(),this.variants.initSaleSchedule(),e(".product-edit-new-container, #product-shipping").on("change","input[type=checkbox]#_overwrite_shipping",this.editProduct.shipping.showHideOverride),e(".product-edit-new-container").on("change","input[type=checkbox]#_disable_shipping",this.editProduct.shipping.disableOverride),e("#product-shipping").on("click","#_disable_shipping",this.shipping.disableOverride),e(".product-edit-new-container, .product_lot_discount").on("change","input[type=checkbox]#_is_lot_discount",this.editProduct.showLotDiscountWrapper),e("body").on("click",".upload_image_button",this.editProduct.loadVariationImage),this.editProduct.shipping.showHideOverride(),this.editProduct.shipping.disableOverride(),this.shipping.disableOverride(),e("#_disable_shipping").trigger("change"),e("#_overwrite_shipping").trigger("change"),e(".hide_if_lot_discount").hide(),e(".hide_if_order_discount").hide(),e("body").on("dokan-product-editor-loaded",this.bindProductTagDropdown),e("body").on("dokan-product-editor-popup-opened",this.bindProductTagDropdown)},editProduct:{showLotDiscountWrapper:function(){e(this).is(":checked")?e(".show_if_needs_lot_discount").slideDown("fast"):e(".show_if_needs_lot_discount").slideUp("fast")},loadVariationImage:function(a){var t;a.preventDefault();var n=e(this),i=n.attr("rel"),o=n.closest(".upload_image");if(setting_variation_image=o,placeholder_iamge=dokan.dokan_placeholder_img_src,setting_variation_image_id=i,a.preventDefault(),n.is(".dokan-img-remove"))setting_variation_image.find(".upload_image_id").val(""),setting_variation_image.find("img").attr("src",placeholder_iamge),setting_variation_image.find(".upload_image_button").removeClass("dokan-img-remove"),n.closest(".dokan-product-variation-itmes").addClass("variation-needs-update"),e("button.cancel-variation-changes, button.save-variation-changes").removeAttr("disabled"),e(".dokan-product-variation-wrapper").trigger("dokan_variations_input_changed");else{if(t)return t.uploader.uploader.param("post_id",setting_variation_image_id),void t.open();wp.media.model.settings.post.id=setting_variation_image_id,wp.media.model.settings.type="dokan",(t=wp.media.frames.variable_image=wp.media({title:dokan.i18n_choose_image,button:{text:dokan.i18n_set_image}})).on("select",(function(){attachment=t.state().get("selection").first().toJSON(),setting_variation_image.find(".upload_image_id").val(attachment.id),setting_variation_image.find(".upload_image_button").addClass("dokan-img-remove"),setting_variation_image.find("img").attr("src",attachment.url),n.closest(".dokan-product-variation-itmes").addClass("variation-needs-update"),e("button.cancel-variation-changes, button.save-variation-changes").removeAttr("disabled"),e(".dokan-product-variation-wrapper").trigger("dokan_variations_input_changed"),wp.media.model.settings.post.id=setting_variation_image_id})),t.open()}},shipping:{showHideOverride:function(){e("#_overwrite_shipping").is(":checked")?e(".show_if_override").show():e(".show_if_override").hide()},disableOverride:function(){e("#_disable_shipping").is(":checked")?(e(".show_if_needs_shipping").show(),e("#_overwrite_shipping").trigger("change")):e(".show_if_needs_shipping").hide()}}},variants:{addCategory:function(a){a.preventDefault();var t=e("#product_type").val(),i=e(this).closest("p.toolbar").find("select.select-attribute").val(),o=e(".inputs-box").length;if(""==i){var r=wp.template("sc-category");n.append(r({row:o})).children(":last").hide().fadeIn()}else{var s={row:o,name:i,type:t,action:"dokan_pre_define_attribute"};e("#product-attributes .toolbar").block({message:null,overlayCSS:{background:"#fff",opacity:.6}}),e.post(dokan.ajaxurl,s,(function(a){a.success&&n.append(a.data).children(":last").hide().fadeIn(),e("#product-attributes .toolbar").unblock()}))}"simple"===product_type&&n.find(".show_if_variable").hide()},removeCategory:function(a){a.preventDefault(),confirm("Sure?")&&e(this).parents(".inputs-box").fadeOut((function(){e(this).remove()}))},addItem:function(a){a.preventDefault();var t=e(this),n=t.closest(".inputs-box"),i=t.closest("ul.option-couplet").find("li").length,o=n.data("count"),r=_.template(e("#tmpl-sc-category-item").html());t.closest("li").after(r({row:o,col:i}))},removeItem:function(a){a.preventDefault(),e(this).parents("ul").find("li").length>1&&e(this).parents("li").fadeOut((function(){e(this).remove()}))},save:function(){var a={post_id:e(this).data("id"),data:e(".woocommerce_attributes").find("input, select, textarea").serialize(),action:"dokan_save_attributes"},t=window.location.toString();e("#variants-holder").block({message:null,overlayCSS:{background:"#fff",opacity:.6}}),e.post(ajaxurl,a,(function(a){e("#variable_product_options").block({message:null,overlayCSS:{background:"#fff",opacity:.6}}),e("#variable_product_options").load(t+" #variable_product_options_inner",(function(){e("#variable_product_options").unblock()})),e("input.variable_is_downloadable, input.variable_is_virtual, input.variable_manage_stock").trigger("change"),e("#variants-holder").unblock()}))},initSaleSchedule:function(){e(".sale_price_dates_fields").each((function(){var a=e(this),t=!1,n=a.closest("div, table");a.find("input").each((function(){""!=e(this).val()&&(t=!0)})),t?(n.find(".sale_schedule").hide(),n.find(".cancel_sale_schedule").show(),n.find(".sale_price_dates_fields").show()):(n.find(".sale_schedule").show(),n.find(".cancel_sale_schedule").hide(),n.find(".sale_price_dates_fields").hide())}))},saleSchedule:function(){var a=e(this).closest("div, table");return e(this).hide(),a.find(".cancel_sale_schedule").show(),a.find(".sale_price_dates_fields").show(),!1},cancelSchedule:function(){var a=e(this).closest("div, table");return e(this).hide(),a.find(".sale_schedule").show(),a.find(".sale_price_dates_fields").hide(),a.find(".sale_price_dates_fields").find("input").val(""),!1},dates:function(){e(".sale_price_dates_fields input").datepicker({defaultDate:"",dateFormat:"yy-mm-dd",numberOfMonths:1})},onVariantAdded:function(){i.variants.dates()}},sidebarToggle:{showStatus:function(a){var t=e(this).siblings(".dokan-toggle-select-container");return t.is(":hidden")&&(t.slideDown("fast"),e(this).hide()),!1},saveStatus:function(a){var t=e(this).closest(".dokan-toggle-select-container");t.slideUp("fast"),t.siblings("a.dokan-toggle-edit").show();var n=e("option:selected",t.find("select.dokan-toggle-select")).text();return t.siblings(".dokan-toggle-selected-display").html(n),!1},cancel:function(a){var t=e(this).closest(".dokan-toggle-select-container");return t.slideUp("fast"),t.siblings("a.dokan-toggle-edit").show(),!1}},shipping:{disableOverride:function(){e("#_disable_shipping").is(":checked")?e(".hide_if_disable").hide():(e(".hide_if_disable").show(),i.editProduct.shipping.showHideOverride())}},bindProductTagDropdown:function(){dokan.product_vendors_can_create_tags&&"on"===dokan.product_vendors_can_create_tags&&e("#product_tag").select2({tags:!0,language:{noResults:function(){return dokan.i18n_no_result_found}}})}}).init()},28:function(a,t){var e,n;e=jQuery,n={init:function(){e("#dokan-comments-table").on("click",".dokan-cmt-action",this.setCommentStatus),e(".dokan-check-all").on("click",this.toggleCheckbox)},toggleCheckbox:function(){e(".dokan-check-col").prop("checked",e(this).prop("checked"))},setCommentStatus:function(a){a.preventDefault();var t=e(this),n=t.data("comment_id"),i=t.data("cmt_status"),o=t.data("page_status"),r=t.data("post_type"),s=t.data("curr_page"),d=t.closest("tr"),c={action:"dokan_comment_status",comment_id:n,comment_status:i,page_status:o,post_type:r,curr_page:s,nonce:dokan.nonce};e.post(dokan.ajaxurl,c,(function(a){0==a.success?alert(a.data):(1!==o||1!==i&&0!==i?d.fadeOut((function(){e(this).remove()})):d.fadeOut((function(){d.replaceWith(a.data.content).fadeIn()})),null==a.data.pending&&(a.data.pending=0),null==a.data.spam&&(a.data.spam=0),null==a.data.trash&&(a.data.trash=0),null==a.data.approved&&(a.data.approved=0),e(".comments-menu-approved").text(a.data.approved),e(".comments-menu-pending").text(a.data.pending),e(".comments-menu-spam").text(a.data.spam),e(".comments-menu-trash").text(a.data.trash))}))}},e((function(){n.init()}))},29:function(a,t){var e,n;e=jQuery,n={init:function(){e("#dokan-comments-table").on("click",".dokan-cmt-action",this.setCommentStatus),e("#dokan-comments-table").on("click","button.dokan-cmt-close-form",this.closeForm),e("#dokan-comments-table").on("click","button.dokan-cmt-submit-form",this.submitForm),e("#dokan-comments-table").on("click",".dokan-cmt-edit",this.populateForm),e(".dokan-check-all").on("click",this.toggleCheckbox)},toggleCheckbox:function(){e(".dokan-check-col").prop("checked",e(this).prop("checked"))},setCommentStatus:function(a){a.preventDefault();var t=e(this),n=t.data("comment_id"),i=t.data("cmt_status"),o=t.data("page_status"),r=t.data("post_type"),s=t.data("curr_page"),d=t.closest("tr"),c={action:"dokan_comment_status",comment_id:n,comment_status:i,page_status:o,post_type:r,curr_page:s,nonce:dokan.nonce};e.post(dokan.ajaxurl,c,(function(a){1!==o||1!==i&&0!==i?d.fadeOut((function(){e(this).remove()})):d.fadeOut((function(){d.replaceWith(a.data.content).fadeIn()})),null==a.data.pending&&(a.data.pending=0),null==a.data.spam&&(a.data.spam=0),null==a.data.trash&&(a.data.trash=0),e(".comments-menu-pending").text(a.data.pending),e(".comments-menu-spam").text(a.data.spam),e(".comments-menu-trash").text(a.data.trash)}))},populateForm:function(a){a.preventDefault();var t=e(this).closest("tr");if(t.next().hasClass("dokan-comment-edit-row"))t.next().remove();else{var n=e("#dokan-edit-comment-row").html(),i={author:t.find(".dokan-cmt-hid-author").text(),email:t.find(".dokan-cmt-hid-email").text(),url:t.find(".dokan-cmt-hid-url").text(),body:t.find(".dokan-cmt-hid-body").text(),id:t.find(".dokan-cmt-hid-id").text(),status:t.find(".dokan-cmt-hid-status").text()};t.after(_.template(n,i))}},closeForm:function(a){a.preventDefault(),e(this).closest("tr.dokan-comment-edit-row").remove()},submitForm:function(a){a.preventDefault();var t=e(this).closest("tr.dokan-comment-edit-row"),n={action:"dokan_update_comment",comment_id:t.find("input.dokan-cmt-id").val(),content:t.find("textarea.dokan-cmt-body").val(),author:t.find("input.dokan-cmt-author").val(),email:t.find("input.dokan-cmt-author-email").val(),url:t.find("input.dokan-cmt-author-url").val(),status:t.find("input.dokan-cmt-status").val(),nonce:dokan.nonce,post_type:t.find("input.dokan-cmt-post-type").val()};e.post(dokan.ajaxurl,n,(function(a){!0===a.success?(t.prev().replaceWith(a.data),t.remove()):alert(a.data)}))}},e((function(){n.init()}))},30:function(a,t){var e;(e=jQuery)(document).ready((function(){e(".dokan-shipping-location-wrapper").on("change",".dps_country_selection",(function(){var a=e(this),t={country_id:a.find(":selected").val(),action:"dps_select_state_by_country"};""==a.val()||"everywhere"==a.val()?a.closest(".dps-shipping-location-content").find("table.dps-shipping-states tbody").html(""):e.post(dokan.ajaxurl,t,(function(t){t.success&&a.closest(".dps-shipping-location-content").find("table.dps-shipping-states tbody").html(t.data)}))})),e(".dps-main-wrapper").on("click","a.dps-shipping-add",(function(a){a.preventDefault();var t=e("#dps-shipping-hidden-lcoation-content"),n=e(t).first().clone().appendTo(e(".dokan-shipping-location-wrapper")).show();e(".dokan-shipping-location-wrapper").find(".dps-shipping-location-content").first().find("a.dps-shipping-remove").show(),e(".tips").tooltip(),n.removeAttr("id"),n.find("input,select").val(""),n.find("a.dps-shipping-remove").show()})),e(".dokan-shipping-location-wrapper").on("click","a.dps-shipping-remove",(function(a){a.preventDefault(),e(this).closest(".dps-shipping-location-content").remove(),$dpsElm=e(".dokan-shipping-location-wrapper").find(".dps-shipping-location-content"),1==$dpsElm.length&&$dpsElm.first().find("a.dps-shipping-remove").hide()})),e(".dokan-shipping-location-wrapper").on("click","a.dps-add",(function(a){a.preventDefault();var t=e(this).closest("tr").first().clone().appendTo(e(this).closest("table.dps-shipping-states"));t.find("input,select").val(""),t.find("a.dps-remove").show(),e(".tips").tooltip()})),e(".dokan-shipping-location-wrapper").on("click","a.dps-remove",(function(a){a.preventDefault(),1==e(this).closest("table.dps-shipping-states").find("tr").length&&e(this).closest(".dps-shipping-location-content").find("td.dps_shipping_location_cost").show(),e(this).closest("tr").remove()})),e(".dokan-shipping-location-wrapper").on("change keyup",".dps_state_selection",(function(){var a=e(this);""==a.val()||"-1"==a.val()?a.closest(".dps-shipping-location-content").find("td.dps_shipping_location_cost").show():a.closest(".dps-shipping-location-content").find("td.dps_shipping_location_cost").hide()})),e(".dokan-shipping-location-wrapper .dps_state_selection").trigger("change"),e(".dokan-shipping-location-wrapper .dps_state_selection").trigger("keyup");var a=e(".dokan-shipping-location-wrapper").find(".dps-shipping-location-content");1==a.length&&a.first().find("a.dps-shipping-remove").hide()}))},31:function(a,t){a.exports=function(a){if(Array.isArray(a)){for(var t=0,e=new Array(a.length);t<a.length;t++)e[t]=a[t];return e}}},32:function(a,t){a.exports=function(a){if(Symbol.iterator in Object(a)||"[object Arguments]"===Object.prototype.toString.call(a))return Array.from(a)}},33:function(a,t){a.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}},34:function(a,t){var e,n,i;e=jQuery,n=e(".dokan-store-seo-wrapper"),i={init:function(){n.on("submit","form#dokan-store-seo-form",this.form.validate)},form:{validate:function(a){a.preventDefault();var t={action:"dokan_seo_form_handler",data:e(this).serialize()};return i.form.submit(t),!1},submit:function(a){var t=e("#dokan-seo-feedback");t.fadeOut(),e.post(dokan.ajaxurl,a,(function(a){a.success?(t.html(a.data),t.removeClass("dokan-hide"),t.addClass("dokan-alert-success"),t.fadeIn()):(t.html(a.data),t.addClass("dokan-alert-danger"),t.removeClass("dokan-hide"),t.fadeIn())}))}}},e((function(){i.init()}))},84:function(a,t,e){"use strict";e.r(t);e(22),e(23),e(24),e(25),e(26),e(27),e(28),e(29),e(30);var n,i,o=e(20),r=e.n(o);n=jQuery,i={itemArray:[],itemSlugs:[],itemString:"",init:function(){n("#dokan-store-listing-filter-form-wrap .store-lists-category .category-input").on("click",this.toggleCategory),n("#dokan-store-listing-filter-form-wrap .store-lists-category .category-box ul li").on("click",this.selectCategory),n("#dokan-store-listing-filter-form-wrap .featured.item #featured").on("change",this.toggleFeatured),n("#dokan-store-listing-filter-form-wrap .open-now.item #open-now").on("change",this.toggleIsOpen),n("#dokan-store-listing-filter-form-wrap .store-ratings.item i").on("click",this.setRatings);var a=dokan.storeLists.getParams();a.length&&a.forEach((function(a){i.setParams(Object.keys(a),Object.values(a))})),this.makeStyleAdjustment()},toggleCategory:function(){n(".store-lists-category .category-box").slideToggle(),n(".store-lists-category .category-input .dokan-icon").toggleClass("dashicons-arrow-down-alt2 dashicons-arrow-up-alt2")},selectCategory:function(a){var t=n(a.target),e=t.text().trim(),o=t.data("slug"),r=i;if(t.toggleClass("dokan-btn-theme"),r.itemSlugs.includes(o)){var s=r.itemSlugs.indexOf(o);r.itemArray.splice(s,1),r.itemSlugs.splice(s,1)}else r.itemArray.push(e),r.itemSlugs.push(o);dokan.storeLists.query.store_categories=r.itemSlugs;var d=r.itemArray.join(", ");r.setCategoryHolder(d)},toggleFeatured:function(a){delete dokan.storeLists.query.featured,a.target.checked&&(dokan.storeLists.query.featured="yes")},toggleIsOpen:function(a){delete dokan.storeLists.query.open_now,a.target.checked&&(dokan.storeLists.query.open_now="yes")},setRatings:function(a){a.preventDefault();var t=n(a.target),e=t.parent();e.addClass("selected"),r()(e.find("i")).forEach((function(a){t.is(a)?n(a).hasClass("active")?(e.removeClass("selected"),n(a).removeClass("active")):n(a).addClass("active"):n(a).removeClass("active")})),dokan.storeLists.query.rating!=t.data("rating")?dokan.storeLists.query.rating=t.data("rating"):delete dokan.storeLists.query.rating},setParams:function(a,t){var e=i,o=window.dokan.storeLists;if(a.forEach((function(a,n){var i=a.indexOf("[");i>0&&(e.itemSlugs.push(t[n]),o.query[a.substr(0,i)]=e.itemSlugs)})),n(".category-items"),o.cateItemStringArray.length){e.itemArray=o.cateItemStringArray;var r=e.itemArray.join(", ");e.setCategoryHolder(r)}},setCategoryHolder:function(a){var t=n(".category-items");if(!a)return t.text(dokan.all_categories);a.length>15?t.text(" ").append(a.substr(0,15)+"..."):t.text(" ").append(a)},makeStyleAdjustment:function(){var a=n(".store-lists-other-filter-wrap");a&&a.children()&&2===a.children().length&&a.children().first()&&a.children().first().hasClass("featured")&&n("#dokan-store-listing-filter-form-wrap .apply-filter").css("margin-top","15px")}},window.dokan&&window.dokan.storeLists&&i.init();e(34)}});
!function(a,b,c){function d(a,c){var d=b(a);d.data(f,this),this._$element=d,this.shares=[],this._init(c),this._render()}var e="JSSocials",f=e,g=function(a,c){return b.isFunction(a)?a.apply(c,b.makeArray(arguments).slice(2)):a},h=/(\.(jpeg|png|gif|bmp|svg)$|^data:image\/(jpeg|png|gif|bmp|svg\+xml);base64)/i,i=/(&?[a-zA-Z0-9]+=)?\{([a-zA-Z0-9]+)\}/g,j={G:1e9,M:1e6,K:1e3},k={};d.prototype={url:"",text:"",shareIn:"blank",showLabel:function(a){return this.showCount===!1?a>this.smallScreenWidth:a>=this.largeScreenWidth},showCount:function(a){return a<=this.smallScreenWidth?"inside":!0},smallScreenWidth:640,largeScreenWidth:1024,resizeTimeout:200,elementClass:"jssocials",sharesClass:"jssocials-shares",shareClass:"jssocials-share",shareButtonClass:"jssocials-share-button",shareLinkClass:"jssocials-share-link",shareLogoClass:"jssocials-share-logo",shareLabelClass:"jssocials-share-label",shareLinkCountClass:"jssocials-share-link-count",shareCountBoxClass:"jssocials-share-count-box",shareCountClass:"jssocials-share-count",shareZeroCountClass:"jssocials-share-no-count",_init:function(a){this._initDefaults(),b.extend(this,a),this._initShares(),this._attachWindowResizeCallback()},_initDefaults:function(){this.url=a.location.href,this.text=b.trim(b("meta[name=description]").attr("content")||b("title").text())},_initShares:function(){this.shares=b.map(this.shares,b.proxy(function(a){"string"==typeof a&&(a={share:a});var c=a.share&&k[a.share];if(!c&&!a.renderer)throw Error("Share '"+a.share+"' is not found");return b.extend({url:this.url,text:this.text},c,a)},this))},_attachWindowResizeCallback:function(){b(a).on("resize",b.proxy(this._windowResizeHandler,this))},_detachWindowResizeCallback:function(){b(a).off("resize",this._windowResizeHandler)},_windowResizeHandler:function(){(b.isFunction(this.showLabel)||b.isFunction(this.showCount))&&(a.clearTimeout(this._resizeTimer),this._resizeTimer=setTimeout(b.proxy(this.refresh,this),this.resizeTimeout))},_render:function(){this._clear(),this._defineOptionsByScreen(),this._$element.addClass(this.elementClass),this._$shares=b("<div>").addClass(this.sharesClass).appendTo(this._$element),this._renderShares()},_defineOptionsByScreen:function(){this._screenWidth=b(a).width(),this._showLabel=g(this.showLabel,this,this._screenWidth),this._showCount=g(this.showCount,this,this._screenWidth)},_renderShares:function(){b.each(this.shares,b.proxy(function(a,b){this._renderShare(b)},this))},_renderShare:function(a){var c;c=b.isFunction(a.renderer)?b(a.renderer()):this._createShare(a),c.addClass(this.shareClass).addClass(a.share?"jssocials-share-"+a.share:"").addClass(a.css).appendTo(this._$shares)},_createShare:function(a){var c=b("<div>"),d=this._createShareLink(a).appendTo(c);if(this._showCount){var e="inside"===this._showCount,f=e?d:b("<div>").addClass(this.shareCountBoxClass).appendTo(c);f.addClass(e?this.shareLinkCountClass:this.shareCountBoxClass),this._renderShareCount(a,f)}return c},_createShareLink:function(a){var c=this._getShareStrategy(a),d=c.call(a,{shareUrl:this._getShareUrl(a)});return d.addClass(this.shareLinkClass).append(this._createShareLogo(a)),this._showLabel&&d.append(this._createShareLabel(a)),b.each(this.on||{},function(c,e){b.isFunction(e)&&d.on(c,b.proxy(e,a))}),d},_getShareStrategy:function(a){var b=m[a.shareIn||this.shareIn];if(!b)throw Error("Share strategy '"+this.shareIn+"' not found");return b},_getShareUrl:function(a){var b=g(a.shareUrl,a);return this._formatShareUrl(b,a)},_createShareLogo:function(a){var c=a.logo,d=h.test(c)?b("<img>").attr("src",a.logo):b("<i>").addClass(c);return d.addClass(this.shareLogoClass),d},_createShareLabel:function(a){return b("<span>").addClass(this.shareLabelClass).text(a.label)},_renderShareCount:function(a,c){var d=b("<span>").addClass(this.shareCountClass);c.addClass(this.shareZeroCountClass).append(d),this._loadCount(a).done(b.proxy(function(a){a&&(c.removeClass(this.shareZeroCountClass),d.text(a))},this))},_loadCount:function(a){var c=b.Deferred(),d=this._getCountUrl(a);if(!d)return c.resolve(0).promise();var e=b.proxy(function(b){c.resolve(this._getCountValue(b,a))},this);return b.getJSON(d).done(e).fail(function(){b.get(d).done(e).fail(function(){c.resolve(0)})}),c.promise()},_getCountUrl:function(a){var b=g(a.countUrl,a);return this._formatShareUrl(b,a)},_getCountValue:function(a,c){var d=(b.isFunction(c.getCount)?c.getCount(a):a)||0;return"string"==typeof d?d:this._formatNumber(d)},_formatNumber:function(a){return b.each(j,function(b,c){return a>=c?(a=parseFloat((a/c).toFixed(2))+b,!1):void 0}),a},_formatShareUrl:function(b,c){return b.replace(i,function(b,d,e){var f=c[e]||"";return f?(d||"")+a.encodeURIComponent(f):""})},_clear:function(){a.clearTimeout(this._resizeTimer),this._$element.empty()},_passOptionToShares:function(a,c){var d=this.shares;b.each(["url","text"],function(e,f){f===a&&b.each(d,function(b,d){d[a]=c})})},_normalizeShare:function(a){return b.isNumeric(a)?this.shares[a]:"string"==typeof a?b.grep(this.shares,function(b){return b.share===a})[0]:a},refresh:function(){this._render()},destroy:function(){this._clear(),this._detachWindowResizeCallback(),this._$element.removeClass(this.elementClass).removeData(f)},option:function(a,b){return 1===arguments.length?this[a]:(this[a]=b,this._passOptionToShares(a,b),void this.refresh())},shareOption:function(a,b,c){return a=this._normalizeShare(a),2===arguments.length?a[b]:(a[b]=c,void this.refresh())}},b.fn.jsSocials=function(a){var e=b.makeArray(arguments),g=e.slice(1),h=this;return this.each(function(){var e,i=b(this),j=i.data(f);if(j)if("string"==typeof a){if(e=j[a].apply(j,g),e!==c&&e!==j)return h=e,!1}else j._detachWindowResizeCallback(),j._init(a),j._render();else new d(i,a)}),h};var l=function(a){var c;b.isPlainObject(a)?c=d.prototype:(c=k[a],a=arguments[1]||{}),b.extend(c,a)},m={popup:function(c){return b("<a>").attr("href","#").on("click",function(){return a.open(c.shareUrl,null,"width=600, height=400, location=0, menubar=0, resizeable=0, scrollbars=0, status=0, titlebar=0, toolbar=0"),!1})},blank:function(a){return b("<a>").attr({target:"_blank",href:a.shareUrl})},self:function(a){return b("<a>").attr({target:"_self",href:a.shareUrl})}};a.jsSocials={Socials:d,shares:k,shareStrategies:m,setDefaults:l}}(window,jQuery),function(a,b,c){b.extend(c.shares,{email:{label:"E-mail",logo:"fa fa-at",shareUrl:"mailto:{to}?subject={text}&body={url}",countUrl:"",shareIn:"self"},twitter:{label:"Tweet",logo:"fa fa-twitter",shareUrl:"https://twitter.com/share?url={url}&text={text}&via={via}&hashtags={hashtags}",countUrl:""},facebook:{label:"Like",logo:"fa fa-facebook",shareUrl:"https://facebook.com/sharer/sharer.php?u={url}",countUrl:"https://graph.facebook.com/?id={url}",getCount:function(a){return a.share&&a.share.share_count||0}},vkontakte:{label:"Like",logo:"fa fa-vk",shareUrl:"https://vk.com/share.php?url={url}&title={title}&description={text}",countUrl:"https://vk.com/share.php?act=count&index=1&url={url}",getCount:function(a){return parseInt(a.slice(15,-2).split(", ")[1])}},googleplus:{label:"+1",logo:"fa fa-google",shareUrl:"https://plus.google.com/share?url={url}",countUrl:""},linkedin:{label:"Share",logo:"fa fa-linkedin",shareUrl:"https://www.linkedin.com/shareArticle?mini=true&url={url}",countUrl:"https://www.linkedin.com/countserv/count/share?format=jsonp&url={url}&callback=?",getCount:function(a){return a.count}},pinterest:{label:"Pin it",logo:"fa fa-pinterest",shareUrl:"https://pinterest.com/pin/create/bookmarklet/?media={media}&url={url}&description={text}",countUrl:"https://api.pinterest.com/v1/urls/count.json?&url={url}&callback=?",getCount:function(a){return a.count}},stumbleupon:{label:"Share",logo:"fa fa-stumbleupon",shareUrl:"http://www.stumbleupon.com/submit?url={url}&title={title}",countUrl:"https://cors-anywhere.herokuapp.com/https://www.stumbleupon.com/services/1.01/badge.getinfo?url={url}",getCount:function(a){return a.result.views}},telegram:{label:"Telegram",logo:"fa fa-paper-plane",shareUrl:"tg://msg?text={url} {text}",countUrl:"",shareIn:"self"},whatsapp:{label:"WhatsApp",logo:"fa fa-whatsapp",shareUrl:"whatsapp://send?text={url} {text}",countUrl:"",shareIn:"self"},line:{label:"LINE",logo:"fa fa-comment",shareUrl:"http://line.me/R/msg/text/?{text} {url}",countUrl:""},viber:{label:"Viber",logo:"fa fa-volume-control-phone",shareUrl:"viber://forward?text={url} {text}",countUrl:"",shareIn:"self"},pocket:{label:"Pocket",logo:"fa fa-get-pocket",shareUrl:"https://getpocket.com/save?url={url}&title={title}",countUrl:""},messenger:{label:"Share",logo:"fa fa-commenting",shareUrl:"fb-messenger://share?link={url}",countUrl:"",shareIn:"self"}})}(window,jQuery,window.jsSocials);
(function(r,G,f,v){var J=f("html"),n=f(r),p=f(G),b=f.fancybox=function(){b.open.apply(this,arguments)},I=navigator.userAgent.match(/msie/i),B=null,s=G.createTouch!==v,t=function(a){return a&&a.hasOwnProperty&&a instanceof f},q=function(a){return a&&"string"===f.type(a)},E=function(a){return q(a)&&0<a.indexOf("%")},l=function(a,d){var e=parseInt(a,10)||0;d&&E(a)&&(e*=b.getViewport()[d]/100);return Math.ceil(e)},w=function(a,b){return l(a,b)+"px"};f.extend(b,{version:"2.1.5",defaults:{padding:15,margin:20,
width:900,height:600,minWidth:100,minHeight:100,maxWidth:9999,maxHeight:9999,pixelRatio:1,autoSize:!0,autoHeight:!1,autoWidth:!1,autoResize:!0,autoCenter:!s,fitToView:!0,aspectRatio:!1,topRatio:0.5,leftRatio:0.5,scrolling:"auto",wrapCSS:"",arrows:!0,closeBtn:!0,closeClick:!1,nextClick:!1,mouseWheel:!0,autoPlay:!1,playSpeed:3E3,preload:3,modal:!1,loop:!0,ajax:{dataType:"html",headers:{"X-fancyBox":!0}},iframe:{scrolling:"auto",preload:!0},swf:{wmode:"transparent",allowfullscreen:"true",allowscriptaccess:"always"},
keys:{next:{13:"left",34:"up",39:"left",40:"up"},prev:{8:"right",33:"down",37:"right",38:"down"},close:[27],play:[32],toggle:[70]},direction:{next:"left",prev:"right"},scrollOutside:!0,index:0,type:null,href:null,content:null,title:null,tpl:{wrap:'<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>',image:'<img class="fancybox-image" src="{href}" alt="" />',iframe:'<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen'+
(I?' allowtransparency="true"':"")+"></iframe>",error:'<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>',closeBtn:'<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>',next:'<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>',prev:'<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'},openEffect:"fade",openSpeed:250,openEasing:"swing",openOpacity:!0,
openMethod:"zoomIn",closeEffect:"fade",closeSpeed:250,closeEasing:"swing",closeOpacity:!0,closeMethod:"zoomOut",nextEffect:"elastic",nextSpeed:250,nextEasing:"swing",nextMethod:"changeIn",prevEffect:"elastic",prevSpeed:250,prevEasing:"swing",prevMethod:"changeOut",helpers:{overlay:!0,title:!0},onCancel:f.noop,beforeLoad:f.noop,afterLoad:f.noop,beforeShow:f.noop,afterShow:f.noop,beforeChange:f.noop,beforeClose:f.noop,afterClose:f.noop},group:{},opts:{},previous:null,coming:null,current:null,isActive:!1,
isOpen:!1,isOpened:!1,wrap:null,skin:null,outer:null,inner:null,player:{timer:null,isActive:!1},ajaxLoad:null,imgPreload:null,transitions:{},helpers:{},open:function(a,d){if(a&&(f.isPlainObject(d)||(d={}),!1!==b.close(!0)))return f.isArray(a)||(a=t(a)?f(a).get():[a]),f.each(a,function(e,c){var k={},g,h,j,m,l;"object"===f.type(c)&&(c.nodeType&&(c=f(c)),t(c)?(k={href:c.data("fancybox-href")||c.attr("href"),title:c.data("fancybox-title")||c.attr("title"),isDom:!0,element:c},f.metadata&&f.extend(!0,k,
c.metadata())):k=c);g=d.href||k.href||(q(c)?c:null);h=d.title!==v?d.title:k.title||"";m=(j=d.content||k.content)?"html":d.type||k.type;!m&&k.isDom&&(m=c.data("fancybox-type"),m||(m=(m=c.prop("class").match(/fancybox\.(\w+)/))?m[1]:null));q(g)&&(m||(b.isImage(g)?m="image":b.isSWF(g)?m="swf":"#"===g.charAt(0)?m="inline":q(c)&&(m="html",j=c)),"ajax"===m&&(l=g.split(/\s+/,2),g=l.shift(),l=l.shift()));j||("inline"===m?g?j=f(q(g)?g.replace(/.*(?=#[^\s]+$)/,""):g):k.isDom&&(j=c):"html"===m?j=g:!m&&(!g&&
k.isDom)&&(m="inline",j=c));f.extend(k,{href:g,type:m,content:j,title:h,selector:l});a[e]=k}),b.opts=f.extend(!0,{},b.defaults,d),d.keys!==v&&(b.opts.keys=d.keys?f.extend({},b.defaults.keys,d.keys):!1),b.group=a,b._start(b.opts.index)},cancel:function(){var a=b.coming;a&&!1!==b.trigger("onCancel")&&(b.hideLoading(),b.ajaxLoad&&b.ajaxLoad.abort(),b.ajaxLoad=null,b.imgPreload&&(b.imgPreload.onload=b.imgPreload.onerror=null),a.wrap&&a.wrap.stop(!0,!0).trigger("onReset").remove(),b.coming=null,b.current||
b._afterZoomOut(a))},close:function(a){b.cancel();!1!==b.trigger("beforeClose")&&(b.unbindEvents(),b.isActive&&(!b.isOpen||!0===a?(f(".fancybox-wrap").stop(!0).trigger("onReset").remove(),b._afterZoomOut()):(b.isOpen=b.isOpened=!1,b.isClosing=!0,f(".fancybox-item, .fancybox-nav").remove(),b.wrap.stop(!0,!0).removeClass("fancybox-opened"),b.transitions[b.current.closeMethod]())))},play:function(a){var d=function(){clearTimeout(b.player.timer)},e=function(){d();b.current&&b.player.isActive&&(b.player.timer=
setTimeout(b.next,b.current.playSpeed))},c=function(){d();p.unbind(".player");b.player.isActive=!1;b.trigger("onPlayEnd")};if(!0===a||!b.player.isActive&&!1!==a){if(b.current&&(b.current.loop||b.current.index<b.group.length-1))b.player.isActive=!0,p.bind({"onCancel.player beforeClose.player":c,"onUpdate.player":e,"beforeLoad.player":d}),e(),b.trigger("onPlayStart")}else c()},next:function(a){var d=b.current;d&&(q(a)||(a=d.direction.next),b.jumpto(d.index+1,a,"next"))},prev:function(a){var d=b.current;
d&&(q(a)||(a=d.direction.prev),b.jumpto(d.index-1,a,"prev"))},jumpto:function(a,d,e){var c=b.current;c&&(a=l(a),b.direction=d||c.direction[a>=c.index?"next":"prev"],b.router=e||"jumpto",c.loop&&(0>a&&(a=c.group.length+a%c.group.length),a%=c.group.length),c.group[a]!==v&&(b.cancel(),b._start(a)))},reposition:function(a,d){var e=b.current,c=e?e.wrap:null,k;c&&(k=b._getPosition(d),a&&"scroll"===a.type?(delete k.position,c.stop(!0,!0).animate(k,200)):(c.css(k),e.pos=f.extend({},e.dim,k)))},update:function(a){var d=
a&&a.type,e=!d||"orientationchange"===d;e&&(clearTimeout(B),B=null);b.isOpen&&!B&&(B=setTimeout(function(){var c=b.current;c&&!b.isClosing&&(b.wrap.removeClass("fancybox-tmp"),(e||"load"===d||"resize"===d&&c.autoResize)&&b._setDimension(),"scroll"===d&&c.canShrink||b.reposition(a),b.trigger("onUpdate"),B=null)},e&&!s?0:300))},toggle:function(a){b.isOpen&&(b.current.fitToView="boolean"===f.type(a)?a:!b.current.fitToView,s&&(b.wrap.removeAttr("style").addClass("fancybox-tmp"),b.trigger("onUpdate")),
b.update())},hideLoading:function(){p.unbind(".loading");f("#fancybox-loading").remove()},showLoading:function(){var a,d;b.hideLoading();a=f('<div id="fancybox-loading"><div></div></div>').click(b.cancel).appendTo("body");p.bind("keydown.loading",function(a){if(27===(a.which||a.keyCode))a.preventDefault(),b.cancel()});b.defaults.fixed||(d=b.getViewport(),a.css({position:"absolute",top:0.5*d.h+d.y,left:0.5*d.w+d.x}))},getViewport:function(){var a=b.current&&b.current.locked||!1,d={x:n.scrollLeft(),
y:n.scrollTop()};a?(d.w=a[0].clientWidth,d.h=a[0].clientHeight):(d.w=s&&r.innerWidth?r.innerWidth:n.width(),d.h=s&&r.innerHeight?r.innerHeight:n.height());return d},unbindEvents:function(){b.wrap&&t(b.wrap)&&b.wrap.unbind(".fb");p.unbind(".fb");n.unbind(".fb")},bindEvents:function(){var a=b.current,d;a&&(n.bind("orientationchange.fb"+(s?"":" resize.fb")+(a.autoCenter&&!a.locked?" scroll.fb":""),b.update),(d=a.keys)&&p.bind("keydown.fb",function(e){var c=e.which||e.keyCode,k=e.target||e.srcElement;
if(27===c&&b.coming)return!1;!e.ctrlKey&&(!e.altKey&&!e.shiftKey&&!e.metaKey&&(!k||!k.type&&!f(k).is("[contenteditable]")))&&f.each(d,function(d,k){if(1<a.group.length&&k[c]!==v)return b[d](k[c]),e.preventDefault(),!1;if(-1<f.inArray(c,k))return b[d](),e.preventDefault(),!1})}),f.fn.mousewheel&&a.mouseWheel&&b.wrap.bind("mousewheel.fb",function(d,c,k,g){for(var h=f(d.target||null),j=!1;h.length&&!j&&!h.is(".fancybox-skin")&&!h.is(".fancybox-wrap");)j=h[0]&&!(h[0].style.overflow&&"hidden"===h[0].style.overflow)&&
(h[0].clientWidth&&h[0].scrollWidth>h[0].clientWidth||h[0].clientHeight&&h[0].scrollHeight>h[0].clientHeight),h=f(h).parent();if(0!==c&&!j&&1<b.group.length&&!a.canShrink){if(0<g||0<k)b.prev(0<g?"down":"left");else if(0>g||0>k)b.next(0>g?"up":"right");d.preventDefault()}}))},trigger:function(a,d){var e,c=d||b.coming||b.current;if(c){f.isFunction(c[a])&&(e=c[a].apply(c,Array.prototype.slice.call(arguments,1)));if(!1===e)return!1;c.helpers&&f.each(c.helpers,function(d,e){if(e&&b.helpers[d]&&f.isFunction(b.helpers[d][a]))b.helpers[d][a](f.extend(!0,
{},b.helpers[d].defaults,e),c)});p.trigger(a)}},isImage:function(a){return q(a)&&a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i)},isSWF:function(a){return q(a)&&a.match(/\.(swf)((\?|#).*)?$/i)},_start:function(a){var d={},e,c;a=l(a);e=b.group[a]||null;if(!e)return!1;d=f.extend(!0,{},b.opts,e);e=d.margin;c=d.padding;"number"===f.type(e)&&(d.margin=[e,e,e,e]);"number"===f.type(c)&&(d.padding=[c,c,c,c]);d.modal&&f.extend(!0,d,{closeBtn:!1,closeClick:!1,nextClick:!1,arrows:!1,
mouseWheel:!1,keys:null,helpers:{overlay:{closeClick:!1}}});d.autoSize&&(d.autoWidth=d.autoHeight=!0);"auto"===d.width&&(d.autoWidth=!0);"auto"===d.height&&(d.autoHeight=!0);d.group=b.group;d.index=a;b.coming=d;if(!1===b.trigger("beforeLoad"))b.coming=null;else{c=d.type;e=d.href;if(!c)return b.coming=null,b.current&&b.router&&"jumpto"!==b.router?(b.current.index=a,b[b.router](b.direction)):!1;b.isActive=!0;if("image"===c||"swf"===c)d.autoHeight=d.autoWidth=!1,d.scrolling="visible";"image"===c&&(d.aspectRatio=
!0);"iframe"===c&&s&&(d.scrolling="scroll");d.wrap=f(d.tpl.wrap).addClass("fancybox-"+(s?"mobile":"desktop")+" fancybox-type-"+c+" fancybox-tmp "+d.wrapCSS).appendTo(d.parent||"body");f.extend(d,{skin:f(".fancybox-skin",d.wrap),outer:f(".fancybox-outer",d.wrap),inner:f(".fancybox-inner",d.wrap)});f.each(["Top","Right","Bottom","Left"],function(a,b){d.skin.css("padding"+b,w(d.padding[a]))});b.trigger("onReady");if("inline"===c||"html"===c){if(!d.content||!d.content.length)return b._error("content")}else if(!e)return b._error("href");
"image"===c?b._loadImage():"ajax"===c?b._loadAjax():"iframe"===c?b._loadIframe():b._afterLoad()}},_error:function(a){f.extend(b.coming,{type:"html",autoWidth:!0,autoHeight:!0,minWidth:0,minHeight:0,scrolling:"no",hasError:a,content:b.coming.tpl.error});b._afterLoad()},_loadImage:function(){var a=b.imgPreload=new Image;a.onload=function(){this.onload=this.onerror=null;b.coming.width=this.width/b.opts.pixelRatio;b.coming.height=this.height/b.opts.pixelRatio;b._afterLoad()};a.onerror=function(){this.onload=
this.onerror=null;b._error("image")};a.src=b.coming.href;!0!==a.complete&&b.showLoading()},_loadAjax:function(){var a=b.coming;b.showLoading();b.ajaxLoad=f.ajax(f.extend({},a.ajax,{url:a.href,error:function(a,e){b.coming&&"abort"!==e?b._error("ajax",a):b.hideLoading()},success:function(d,e){"success"===e&&(a.content=d,b._afterLoad())}}))},_loadIframe:function(){var a=b.coming,d=f(a.tpl.iframe.replace(/\{rnd\}/g,(new Date).getTime())).attr("scrolling",s?"auto":a.iframe.scrolling).attr("src",a.href);
f(a.wrap).bind("onReset",function(){try{f(this).find("iframe").hide().attr("src","//about:blank").end().empty()}catch(a){}});a.iframe.preload&&(b.showLoading(),d.one("load",function(){f(this).data("ready",1);s||f(this).bind("load.fb",b.update);f(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show();b._afterLoad()}));a.content=d.appendTo(a.inner);a.iframe.preload||b._afterLoad()},_preloadImages:function(){var a=b.group,d=b.current,e=a.length,c=d.preload?Math.min(d.preload,
e-1):0,f,g;for(g=1;g<=c;g+=1)f=a[(d.index+g)%e],"image"===f.type&&f.href&&((new Image).src=f.href)},_afterLoad:function(){var a=b.coming,d=b.current,e,c,k,g,h;b.hideLoading();if(a&&!1!==b.isActive)if(!1===b.trigger("afterLoad",a,d))a.wrap.stop(!0).trigger("onReset").remove(),b.coming=null;else{d&&(b.trigger("beforeChange",d),d.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove());b.unbindEvents();e=a.content;c=a.type;k=a.scrolling;f.extend(b,{wrap:a.wrap,skin:a.skin,
outer:a.outer,inner:a.inner,current:a,previous:d});g=a.href;switch(c){case "inline":case "ajax":case "html":a.selector?e=f("<div>").html(e).find(a.selector):t(e)&&(e.data("fancybox-placeholder")||e.data("fancybox-placeholder",f('<div class="fancybox-placeholder"></div>').insertAfter(e).hide()),e=e.show().detach(),a.wrap.bind("onReset",function(){f(this).find(e).length&&e.hide().replaceAll(e.data("fancybox-placeholder")).data("fancybox-placeholder",!1)}));break;case "image":e=a.tpl.image.replace("{href}",
g);break;case "swf":e='<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="'+g+'"></param>',h="",f.each(a.swf,function(a,b){e+='<param name="'+a+'" value="'+b+'"></param>';h+=" "+a+'="'+b+'"'}),e+='<embed src="'+g+'" type="application/x-shockwave-flash" width="100%" height="100%"'+h+"></embed></object>"}(!t(e)||!e.parent().is(a.inner))&&a.inner.append(e);b.trigger("beforeShow");a.inner.css("overflow","yes"===k?"scroll":
"no"===k?"hidden":k);b._setDimension();b.reposition();b.isOpen=!1;b.coming=null;b.bindEvents();if(b.isOpened){if(d.prevMethod)b.transitions[d.prevMethod]()}else f(".fancybox-wrap").not(a.wrap).stop(!0).trigger("onReset").remove();b.transitions[b.isOpened?a.nextMethod:a.openMethod]();b._preloadImages()}},_setDimension:function(){var a=b.getViewport(),d=0,e=!1,c=!1,e=b.wrap,k=b.skin,g=b.inner,h=b.current,c=h.width,j=h.height,m=h.minWidth,u=h.minHeight,n=h.maxWidth,p=h.maxHeight,s=h.scrolling,q=h.scrollOutside?
h.scrollbarWidth:0,x=h.margin,y=l(x[1]+x[3]),r=l(x[0]+x[2]),v,z,t,C,A,F,B,D,H;e.add(k).add(g).width("auto").height("auto").removeClass("fancybox-tmp");x=l(k.outerWidth(!0)-k.width());v=l(k.outerHeight(!0)-k.height());z=y+x;t=r+v;C=E(c)?(a.w-z)*l(c)/100:c;A=E(j)?(a.h-t)*l(j)/100:j;if("iframe"===h.type){if(H=h.content,h.autoHeight&&1===H.data("ready"))try{H[0].contentWindow.document.location&&(g.width(C).height(9999),F=H.contents().find("body"),q&&F.css("overflow-x","hidden"),A=F.outerHeight(!0))}catch(G){}}else if(h.autoWidth||
h.autoHeight)g.addClass("fancybox-tmp"),h.autoWidth||g.width(C),h.autoHeight||g.height(A),h.autoWidth&&(C=g.width()),h.autoHeight&&(A=g.height()),g.removeClass("fancybox-tmp");c=l(C);j=l(A);D=C/A;m=l(E(m)?l(m,"w")-z:m);n=l(E(n)?l(n,"w")-z:n);u=l(E(u)?l(u,"h")-t:u);p=l(E(p)?l(p,"h")-t:p);F=n;B=p;h.fitToView&&(n=Math.min(a.w-z,n),p=Math.min(a.h-t,p));z=a.w-y;r=a.h-r;h.aspectRatio?(c>n&&(c=n,j=l(c/D)),j>p&&(j=p,c=l(j*D)),c<m&&(c=m,j=l(c/D)),j<u&&(j=u,c=l(j*D))):(c=Math.max(m,Math.min(c,n)),h.autoHeight&&
"iframe"!==h.type&&(g.width(c),j=g.height()),j=Math.max(u,Math.min(j,p)));if(h.fitToView)if(g.width(c).height(j),e.width(c+x),a=e.width(),y=e.height(),h.aspectRatio)for(;(a>z||y>r)&&(c>m&&j>u)&&!(19<d++);)j=Math.max(u,Math.min(p,j-10)),c=l(j*D),c<m&&(c=m,j=l(c/D)),c>n&&(c=n,j=l(c/D)),g.width(c).height(j),e.width(c+x),a=e.width(),y=e.height();else c=Math.max(m,Math.min(c,c-(a-z))),j=Math.max(u,Math.min(j,j-(y-r)));q&&("auto"===s&&j<A&&c+x+q<z)&&(c+=q);g.width(c).height(j);e.width(c+x);a=e.width();
y=e.height();e=(a>z||y>r)&&c>m&&j>u;c=h.aspectRatio?c<F&&j<B&&c<C&&j<A:(c<F||j<B)&&(c<C||j<A);f.extend(h,{dim:{width:w(a),height:w(y)},origWidth:C,origHeight:A,canShrink:e,canExpand:c,wPadding:x,hPadding:v,wrapSpace:y-k.outerHeight(!0),skinSpace:k.height()-j});!H&&(h.autoHeight&&j>u&&j<p&&!c)&&g.height("auto")},_getPosition:function(a){var d=b.current,e=b.getViewport(),c=d.margin,f=b.wrap.width()+c[1]+c[3],g=b.wrap.height()+c[0]+c[2],c={position:"absolute",top:c[0],left:c[3]};d.autoCenter&&d.fixed&&
!a&&g<=e.h&&f<=e.w?c.position="fixed":d.locked||(c.top+=e.y,c.left+=e.x);c.top=w(Math.max(c.top,c.top+(e.h-g)*d.topRatio));c.left=w(Math.max(c.left,c.left+(e.w-f)*d.leftRatio));return c},_afterZoomIn:function(){var a=b.current;a&&(b.isOpen=b.isOpened=!0,b.wrap.css("overflow","visible").addClass("fancybox-opened"),b.update(),(a.closeClick||a.nextClick&&1<b.group.length)&&b.inner.css("cursor","pointer").bind("click.fb",function(d){!f(d.target).is("a")&&!f(d.target).parent().is("a")&&(d.preventDefault(),
b[a.closeClick?"close":"next"]())}),a.closeBtn&&f(a.tpl.closeBtn).appendTo(b.skin).bind("click.fb",function(a){a.preventDefault();b.close()}),a.arrows&&1<b.group.length&&((a.loop||0<a.index)&&f(a.tpl.prev).appendTo(b.outer).bind("click.fb",b.prev),(a.loop||a.index<b.group.length-1)&&f(a.tpl.next).appendTo(b.outer).bind("click.fb",b.next)),b.trigger("afterShow"),!a.loop&&a.index===a.group.length-1?b.play(!1):b.opts.autoPlay&&!b.player.isActive&&(b.opts.autoPlay=!1,b.play()))},_afterZoomOut:function(a){a=
a||b.current;f(".fancybox-wrap").trigger("onReset").remove();f.extend(b,{group:{},opts:{},router:!1,current:null,isActive:!1,isOpened:!1,isOpen:!1,isClosing:!1,wrap:null,skin:null,outer:null,inner:null});b.trigger("afterClose",a)}});b.transitions={getOrigPosition:function(){var a=b.current,d=a.element,e=a.orig,c={},f=50,g=50,h=a.hPadding,j=a.wPadding,m=b.getViewport();!e&&(a.isDom&&d.is(":visible"))&&(e=d.find("img:first"),e.length||(e=d));t(e)?(c=e.offset(),e.is("img")&&(f=e.outerWidth(),g=e.outerHeight())):
(c.top=m.y+(m.h-g)*a.topRatio,c.left=m.x+(m.w-f)*a.leftRatio);if("fixed"===b.wrap.css("position")||a.locked)c.top-=m.y,c.left-=m.x;return c={top:w(c.top-h*a.topRatio),left:w(c.left-j*a.leftRatio),width:w(f+j),height:w(g+h)}},step:function(a,d){var e,c,f=d.prop;c=b.current;var g=c.wrapSpace,h=c.skinSpace;if("width"===f||"height"===f)e=d.end===d.start?1:(a-d.start)/(d.end-d.start),b.isClosing&&(e=1-e),c="width"===f?c.wPadding:c.hPadding,c=a-c,b.skin[f](l("width"===f?c:c-g*e)),b.inner[f](l("width"===f?c:c-g*e-h*e))},zoomIn:function(){var a=b.current,d=a.pos,e=a.openEffect,c="elastic"===e,k=f.extend({opacity:1},d);delete k.position;c?(d=this.getOrigPosition(),a.openOpacity&&(d.opacity=0.1)):"fade"===e&&(d.opacity=0.1);b.wrap.css(d).animate(k,{duration:"none"===e?0:a.openSpeed,easing:a.openEasing,step:c?this.step:null,complete:b._afterZoomIn})},zoomOut:function(){var a=b.current,d=a.closeEffect,e="elastic"===d,c={opacity:0.1};e&&(c=this.getOrigPosition(),a.closeOpacity&&(c.opacity=0.1));b.wrap.animate(c,
{duration:"none"===d?0:a.closeSpeed,easing:a.closeEasing,step:e?this.step:null,complete:b._afterZoomOut})},changeIn:function(){var a=b.current,d=a.nextEffect,e=a.pos,c={opacity:1},f=b.direction,g;e.opacity=0.1;"elastic"===d&&(g="down"===f||"up"===f?"top":"left","down"===f||"right"===f?(e[g]=w(l(e[g])-200),c[g]="+=200px"):(e[g]=w(l(e[g])+200),c[g]="-=200px"));"none"===d?b._afterZoomIn():b.wrap.css(e).animate(c,{duration:a.nextSpeed,easing:a.nextEasing,complete:b._afterZoomIn})},changeOut:function(){var a=
b.previous,d=a.prevEffect,e={opacity:0.1},c=b.direction;"elastic"===d&&(e["down"===c||"up"===c?"top":"left"]=("up"===c||"left"===c?"-":"+")+"=200px");a.wrap.animate(e,{duration:"none"===d?0:a.prevSpeed,easing:a.prevEasing,complete:function(){f(this).trigger("onReset").remove()}})}};b.helpers.overlay={defaults:{closeClick:!0,speedOut:200,showEarly:!0,css:{},locked:!s,fixed:!0},overlay:null,fixed:!1,el:f("html"),create:function(a){a=f.extend({},this.defaults,a);this.overlay&&this.close();this.overlay=
f('<div class="fancybox-overlay"></div>').appendTo(b.coming?b.coming.parent:a.parent);this.fixed=!1;a.fixed&&b.defaults.fixed&&(this.overlay.addClass("fancybox-overlay-fixed"),this.fixed=!0)},open:function(a){var d=this;a=f.extend({},this.defaults,a);this.overlay?this.overlay.unbind(".overlay").width("auto").height("auto"):this.create(a);this.fixed||(n.bind("resize.overlay",f.proxy(this.update,this)),this.update());a.closeClick&&this.overlay.bind("click.overlay",function(a){if(f(a.target).hasClass("fancybox-overlay"))return b.isActive?
b.close():d.close(),!1});this.overlay.css(a.css).show()},close:function(){var a,b;n.unbind("resize.overlay");this.el.hasClass("fancybox-lock")&&(f(".fancybox-margin").removeClass("fancybox-margin"),a=n.scrollTop(),b=n.scrollLeft(),this.el.removeClass("fancybox-lock"),n.scrollTop(a).scrollLeft(b));f(".fancybox-overlay").remove().hide();f.extend(this,{overlay:null,fixed:!1})},update:function(){var a="100%",b;this.overlay.width(a).height("100%");I?(b=Math.max(G.documentElement.offsetWidth,G.body.offsetWidth),
p.width()>b&&(a=p.width())):p.width()>n.width()&&(a=p.width());this.overlay.width(a).height(p.height())},onReady:function(a,b){var e=this.overlay;f(".fancybox-overlay").stop(!0,!0);e||this.create(a);a.locked&&(this.fixed&&b.fixed)&&(e||(this.margin=p.height()>n.height()?f("html").css("margin-right").replace("px",""):!1),b.locked=this.overlay.append(b.wrap),b.fixed=!1);!0===a.showEarly&&this.beforeShow.apply(this,arguments)},beforeShow:function(a,b){var e,c;b.locked&&(!1!==this.margin&&(f("*").filter(function(){return"fixed"===f(this).css("position")&&!f(this).hasClass("fancybox-overlay")&&!f(this).hasClass("fancybox-wrap")}).addClass("fancybox-margin"),this.el.addClass("fancybox-margin")),e=n.scrollTop(),c=n.scrollLeft(),this.el.addClass("fancybox-lock"),n.scrollTop(e).scrollLeft(c));this.open(a)},onUpdate:function(){this.fixed||this.update()},afterClose:function(a){this.overlay&&!b.coming&&this.overlay.fadeOut(a.speedOut,f.proxy(this.close,this))}};b.helpers.title={defaults:{type:"float",position:"bottom"},beforeShow:function(a){var d=
b.current,e=d.title,c=a.type;f.isFunction(e)&&(e=e.call(d.element,d));if(q(e)&&""!==f.trim(e)){d=f('<div class="fancybox-title fancybox-title-'+c+'-wrap">'+e+"</div>");switch(c){case "inside":c=b.skin;break;case "outside":c=b.wrap;break;case "over":c=b.inner;break;default:c=b.skin,d.appendTo("body"),I&&d.width(d.width()),d.wrapInner('<span class="child"></span>'),b.current.margin[2]+=Math.abs(l(d.css("margin-bottom")))}d["top"===a.position?"prependTo":"appendTo"](c)}}};f.fn.fancybox=function(a){var d,
e=f(this),c=this.selector||"",k=function(g){var h=f(this).blur(),j=d,k,l;!g.ctrlKey&&(!g.altKey&&!g.shiftKey&&!g.metaKey)&&!h.is(".fancybox-wrap")&&(k=a.groupAttr||"data-fancybox-group",l=h.attr(k),l||(k="rel",l=h.get(0)[k]),l&&(""!==l&&"nofollow"!==l)&&(h=c.length?f(c):e,h=h.filter("["+k+'="'+l+'"]'),j=h.index(this)),a.index=j,!1!==b.open(h,a)&&g.preventDefault())};a=a||{};d=a.index||0;!c||!1===a.live?e.unbind("click.fb-start").bind("click.fb-start",k):p.undelegate(c,"click.fb-start").delegate(c+
":not('.fancybox-item, .fancybox-nav')","click.fb-start",k);this.filter("[data-fancybox-start=1]").trigger("click");return this};p.ready(function(){var a,d;f.scrollbarWidth===v&&(f.scrollbarWidth=function(){var a=f('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"),b=a.children(),b=b.innerWidth()-b.height(99).innerWidth();a.remove();return b});if(f.support.fixedPosition===v){a=f.support;d=f('<div style="position:fixed;top:20px;"></div>').appendTo("body");var e=20===d[0].offsetTop||15===d[0].offsetTop;d.remove();a.fixedPosition=e}f.extend(b.defaults,{scrollbarWidth:f.scrollbarWidth(),fixed:f.support.fixedPosition,parent:f("body")});a=f(r).width();J.addClass("fancybox-lock-test");d=f(r).width();J.removeClass("fancybox-lock-test");f("<style type='text/css'>.fancybox-margin{margin-right:"+(d-a)+"px;}</style>").appendTo("head")})})(window,document,jQuery);