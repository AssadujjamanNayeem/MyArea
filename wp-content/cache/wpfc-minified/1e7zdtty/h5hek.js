(function($){
$.extend($.fn, {
validate: function(options){
if(!this.length){
if(options&&options.debug&&window.console){
console.warn("Nothing selected, can't validate, returning nothing.");
}
return;
}
var validator=$.data(this[0], "validator");
if(validator){
return validator;
}
this.attr("novalidate", "novalidate");
validator=new $.validator(options, this[0]);
$.data(this[0], "validator", validator);
if(validator.settings.onsubmit){
this.validateDelegate(":submit", "click", function(event){
if(validator.settings.submitHandler){
validator.submitButton=event.target;
}
if($(event.target).hasClass("cancel")){
validator.cancelSubmit=true;
}});
this.submit(function(event){
if(validator.settings.debug){
event.preventDefault();
}
function handle(){
var hidden;
if(validator.settings.submitHandler){
if(validator.submitButton){
hidden=$("<input type='hidden'/>").attr("name", validator.submitButton.name).val(validator.submitButton.value).appendTo(validator.currentForm);
}
validator.settings.submitHandler.call(validator, validator.currentForm, event);
if(validator.submitButton){
hidden.remove();
}
return false;
}
return true;
}
if(validator.cancelSubmit){
validator.cancelSubmit=false;
return handle();
}
if(validator.form()){
if(validator.pendingRequest){
validator.formSubmitted=true;
return false;
}
return handle();
}else{
validator.focusInvalid();
return false;
}});
}
return validator;
},
valid: function(){
if($(this[0]).is("form")){
return this.validate().form();
}else{
var valid=true;
var validator=$(this[0].form).validate();
this.each(function(){
valid &=validator.element(this);
});
return valid;
}},
removeAttrs: function(attributes){
var result={},
$element=this;
$.each(attributes.split(/\s/), function(index, value){
result[value]=$element.attr(value);
$element.removeAttr(value);
});
return result;
},
rules: function(command, argument){
var element=this[0];
if(command){
var settings=$.data(element.form, "validator").settings;
var staticRules=settings.rules;
var existingRules=$.validator.staticRules(element);
switch(command){
case "add":
$.extend(existingRules, $.validator.normalizeRule(argument));
staticRules[element.name]=existingRules;
if(argument.messages){
settings.messages[element.name]=$.extend(settings.messages[element.name], argument.messages);
}
break;
case "remove":
if(!argument){
delete staticRules[element.name];
return existingRules;
}
var filtered={};
$.each(argument.split(/\s/), function(index, method){
filtered[method]=existingRules[method];
delete existingRules[method];
});
return filtered;
}}
var data=$.validator.normalizeRules($.extend({},
$.validator.classRules(element),
$.validator.attributeRules(element),
$.validator.dataRules(element),
$.validator.staticRules(element)
), element);
if(data.required){
var param=data.required;
delete data.required;
data=$.extend({required: param}, data);
}
return data;
}});
$.extend($.expr[":"], {
blank: function(a){ return !$.trim("" + a.value); },
filled: function(a){ return !!$.trim("" + a.value); },
unchecked: function(a){ return !a.checked; }});
$.validator=function(options, form){
this.settings=$.extend(true, {}, $.validator.defaults, options);
this.currentForm=form;
this.init();
};
$.validator.format=function(source, params){
if(arguments.length===1){
return function(){
var args=$.makeArray(arguments);
args.unshift(source);
return $.validator.format.apply(this, args);
};}
if(arguments.length > 2&&params.constructor!==Array){
params=$.makeArray(arguments).slice(1);
}
if(params.constructor!==Array){
params=[ params ];
}
$.each(params, function(i, n){
source=source.replace(new RegExp("\\{" + i + "\\}", "g"), function(){
return n;
});
});
return source;
};
$.extend($.validator, {
defaults: {
messages: {},
groups: {},
rules: {},
errorClass: "error",
validClass: "valid",
errorElement: "label",
focusInvalid: true,
errorContainer: $([]),
errorLabelContainer: $([]),
onsubmit: true,
ignore: ":hidden",
ignoreTitle: false,
onfocusin: function(element, event){
this.lastActive=element;
if(this.settings.focusCleanup&&!this.blockFocusCleanup){
if(this.settings.unhighlight){
this.settings.unhighlight.call(this, element, this.settings.errorClass, this.settings.validClass);
}
this.addWrapper(this.errorsFor(element)).hide();
}},
onfocusout: function(element, event){
if(!this.checkable(element)&&(element.name in this.submitted||!this.optional(element))){
this.element(element);
}},
/* 		onkeyup: function(element, event){
if(event.which===9&&this.elementValue(element)===""){
return;
}else if(element.name in this.submitted||element===this.lastElement){
this.element(element);
}}, */
onclick: function(element, event){
if(element.name in this.submitted){
this.element(element);
}
else if(element.parentNode.name in this.submitted){
this.element(element.parentNode);
}},
highlight: function(element, errorClass, validClass){
if(element.type==="radio"){
this.findByName(element.name).addClass(errorClass).removeClass(validClass);
}else{
$(element).addClass(errorClass).removeClass(validClass);
}},
unhighlight: function(element, errorClass, validClass){
if(element.type==="radio"){
this.findByName(element.name).removeClass(errorClass).addClass(validClass);
}else{
$(element).removeClass(errorClass).addClass(validClass);
}}
},
setDefaults: function(settings){
$.extend($.validator.defaults, settings);
},
messages: {
required: "This field is required.",
remote: "Please fix this field.",
email: "Please enter a valid email address.",
url: "Please enter a valid URL.",
date: "Please enter a valid date.",
dateISO: "Please enter a valid date (ISO).",
number: "Please enter a valid number.",
digits: "Please enter only digits.",
creditcard: "Please enter a valid credit card number.",
equalTo: "Please enter the same value again.",
maxlength: $.validator.format("Please enter no more than {0} characters."),
minlength: $.validator.format("Please enter at least {0} characters."),
rangelength: $.validator.format("Please enter a value between {0} and {1} characters long."),
range: $.validator.format("Please enter a value between {0} and {1}."),
max: $.validator.format("Please enter a value less than or equal to {0}."),
min: $.validator.format("Please enter a value greater than or equal to {0}.")
},
autoCreateRanges: false,
prototype: {
init: function(){
this.labelContainer=$(this.settings.errorLabelContainer);
this.errorContext=this.labelContainer.length&&this.labelContainer||$(this.currentForm);
this.containers=$(this.settings.errorContainer).add(this.settings.errorLabelContainer);
this.submitted={};
this.valueCache={};
this.pendingRequest=0;
this.pending={};
this.invalid={};
this.reset();
var groups=(this.groups={});
$.each(this.settings.groups, function(key, value){
if(typeof value==="string"){
value=value.split(/\s/);
}
$.each(value, function(index, name){
groups[name]=key;
});
});
var rules=this.settings.rules;
$.each(rules, function(key, value){
rules[key]=$.validator.normalizeRule(value);
});
function delegate(event){
var validator=$.data(this[0].form, "validator"),
eventType="on" + event.type.replace(/^validate/, "");
if(validator.settings[eventType]){
validator.settings[eventType].call(validator, this[0], event);
}}
$(this.currentForm)
.validateDelegate(":text, [type='password'], [type='file'], select, textarea, " +
"[type='number'], [type='search'] ,[type='tel'], [type='url'], " +
"[type='email'], [type='datetime'], [type='date'], [type='month'], " +
"[type='week'], [type='time'], [type='datetime-local'], " +
"[type='range'], [type='color'] ",
"focusin focusout keyup", delegate)
.validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", delegate);
if(this.settings.invalidHandler){
$(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler);
}},
form: function(){
this.checkForm();
$.extend(this.submitted, this.errorMap);
this.invalid=$.extend({}, this.errorMap);
if(!this.valid()){
$(this.currentForm).triggerHandler("invalid-form", [this]);
}
this.showErrors();
return this.valid();
},
checkForm: function(){
this.prepareForm();
for(var i=0, elements=(this.currentElements=this.elements()); elements[i]; i++){
this.check(elements[i]);
}
return this.valid();
},
element: function(element){
element=this.validationTargetFor(this.clean(element));
this.lastElement=element;
this.prepareElement(element);
this.currentElements=$(element);
var result=this.check(element)!==false;
if(result){
delete this.invalid[element.name];
}else{
this.invalid[element.name]=true;
}
if(!this.numberOfInvalids()){
this.toHide=this.toHide.add(this.containers);
}
this.showErrors();
return result;
},
showErrors: function(errors){
if(errors){
$.extend(this.errorMap, errors);
this.errorList=[];
for(var name in errors){
this.errorList.push({
message: errors[name],
element: this.findByName(name)[0]
});
}
this.successList=$.grep(this.successList, function(element){
return !(element.name in errors);
});
}
if(this.settings.showErrors){
this.settings.showErrors.call(this, this.errorMap, this.errorList);
}else{
this.defaultShowErrors();
}},
resetForm: function(){
if($.fn.resetForm){
$(this.currentForm).resetForm();
}
this.submitted={};
this.lastElement=null;
this.prepareForm();
this.hideErrors();
this.elements().removeClass(this.settings.errorClass).removeData("previousValue");
},
numberOfInvalids: function(){
return this.objectLength(this.invalid);
},
objectLength: function(obj){
var count=0;
for(var i in obj){
count++;
}
return count;
},
hideErrors: function(){
this.addWrapper(this.toHide).hide();
},
valid: function(){
return this.size()===0;
},
size: function(){
return this.errorList.length;
},
focusInvalid: function(){
if(this.settings.focusInvalid){
try {
$(this.findLastActive()||this.errorList.length&&this.errorList[0].element||[])
.filter(":visible")
.focus()
.trigger("focusin");
} catch(e){
}}
},
findLastActive: function(){
var lastActive=this.lastActive;
return lastActive&&$.grep(this.errorList, function(n){
return n.element.name===lastActive.name;
}).length===1&&lastActive;
},
elements: function(){
var validator=this,
rulesCache={};
return $(this.currentForm)
.find("input, select, textarea")
.not(":submit, :reset, :image, [disabled]")
.not(this.settings.ignore)
.filter(function(){
if(!this.name){
if(window.console){
console.error("%o has no name assigned", this);
}
throw new Error("Failed to validate, found an element with no name assigned. See console for element reference.");
}
if(this.name in rulesCache||!validator.objectLength($(this).rules())){
return false;
}
rulesCache[this.name]=true;
return true;
});
},
clean: function(selector){
return $(selector)[0];
},
errors: function(){
var errorClass=this.settings.errorClass.replace(" ", ".");
return $(this.settings.errorElement + "." + errorClass, this.errorContext);
},
reset: function(){
this.successList=[];
this.errorList=[];
this.errorMap={};
this.toShow=$([]);
this.toHide=$([]);
this.currentElements=$([]);
},
prepareForm: function(){
this.reset();
this.toHide=this.errors().add(this.containers);
},
prepareElement: function(element){
this.reset();
this.toHide=this.errorsFor(element);
},
elementValue: function(element){
var type=$(element).attr("type"),
val=$(element).val();
if(type==="radio"||type==="checkbox"){
return $("input[name='" + $(element).attr("name") + "']:checked").val();
}
if(typeof val==="string"){
return val.replace(/\r/g, "");
}
return val;
},
check: function(element){
element=this.validationTargetFor(this.clean(element));
var rules=$(element).rules();
var dependencyMismatch=false;
var val=this.elementValue(element);
var result;
for (var method in rules){
var rule={ method: method, parameters: rules[method] };
try {
result=$.validator.methods[method].call(this, val, element, rule.parameters);
if(result==="dependency-mismatch"){
dependencyMismatch=true;
continue;
}
dependencyMismatch=false;
if(result==="pending"){
this.toHide=this.toHide.not(this.errorsFor(element));
return;
}
if(!result){
this.formatAndAdd(element, rule);
return false;
}} catch(e){
if(this.settings.debug&&window.console){
console.log("Exception occured when checking element " + element.id + ", check the '" + rule.method + "' method.", e);
}
throw e;
}}
if(dependencyMismatch){
return;
}
if(this.objectLength(rules)){
this.successList.push(element);
}
return true;
},
customDataMessage: function(element, method){
return $(element).data("msg-" + method.toLowerCase())||(element.attributes&&$(element).attr("data-msg-" + method.toLowerCase()));
},
customMessage: function(name, method){
var m=this.settings.messages[name];
return m&&(m.constructor===String ? m:m[method]);
},
findDefined: function(){
for(var i=0; i < arguments.length; i++){
if(arguments[i]!==undefined){
return arguments[i];
}}
return undefined;
},
defaultMessage: function(element, method){
return this.findDefined(this.customMessage(element.name, method),
this.customDataMessage(element, method),
!this.settings.ignoreTitle&&element.title||undefined,
$.validator.messages[method],
"<strong>Warning: No message defined for " + element.name + "</strong>"
);
},
formatAndAdd: function(element, rule){
var message=this.defaultMessage(element, rule.method),
theregex=/\$?\{(\d+)\}/g;
if(typeof message==="function"){
message=message.call(this, rule.parameters, element);
}else if(theregex.test(message)){
message=$.validator.format(message.replace(theregex, "{$1}"), rule.parameters);
}
this.errorList.push({
message: message,
element: element
});
this.errorMap[element.name]=message;
this.submitted[element.name]=message;
},
addWrapper: function(toToggle){
if(this.settings.wrapper){
toToggle=toToggle.add(toToggle.parent(this.settings.wrapper));
}
return toToggle;
},
defaultShowErrors: function(){
var i, elements;
for(i=0; this.errorList[i]; i++){
var error=this.errorList[i];
if(this.settings.highlight){
this.settings.highlight.call(this, error.element, this.settings.errorClass, this.settings.validClass);
}
this.showLabel(error.element, error.message);
}
if(this.errorList.length){
this.toShow=this.toShow.add(this.containers);
}
if(this.settings.success){
for(i=0; this.successList[i]; i++){
this.showLabel(this.successList[i]);
}}
if(this.settings.unhighlight){
for(i=0, elements=this.validElements(); elements[i]; i++){
this.settings.unhighlight.call(this, elements[i], this.settings.errorClass, this.settings.validClass);
}}
this.toHide=this.toHide.not(this.toShow);
this.hideErrors();
this.addWrapper(this.toShow).show();
},
validElements: function(){
return this.currentElements.not(this.invalidElements());
},
invalidElements: function(){
return $(this.errorList).map(function(){
return this.element;
});
},
showLabel: function(element, message){
var label=this.errorsFor(element);
if(label.length){
label.removeClass(this.settings.validClass).addClass(this.settings.errorClass);
if(label.attr("generated")){
label.html(message);
}}else{
label=$("<" + this.settings.errorElement + "/>")
.attr({"for":  this.idOrName(element), generated: true})
.addClass(this.settings.errorClass)
.html(message||"");
if(this.settings.wrapper){
label=label.hide().show().wrap("<" + this.settings.wrapper + "/>").parent();
}
if(!this.labelContainer.append(label).length){
if(this.settings.errorPlacement){
this.settings.errorPlacement(label, $(element));
}else{
label.insertAfter(element);
}}
}
if(!message&&this.settings.success){
label.text("");
if(typeof this.settings.success==="string"){
label.addClass(this.settings.success);
}else{
this.settings.success(label, element);
}}
this.toShow=this.toShow.add(label);
},
errorsFor: function(element){
var name=this.idOrName(element);
return this.errors().filter(function(){
return $(this).attr("for")===name;
});
},
idOrName: function(element){
return this.groups[element.name]||(this.checkable(element) ? element.name:element.id||element.name);
},
validationTargetFor: function(element){
if(this.checkable(element)){
element=this.findByName(element.name).not(this.settings.ignore)[0];
}
return element;
},
checkable: function(element){
return (/radio|checkbox/i).test(element.type);
},
findByName: function(name){
return $(this.currentForm).find("[name='" + name + "']");
},
getLength: function(value, element){
switch(element.nodeName.toLowerCase()){
case "select":
return $("option:selected", element).length;
case "input":
if(this.checkable(element)){
return this.findByName(element.name).filter(":checked").length;
}}
return value.length;
},
depend: function(param, element){
return this.dependTypes[typeof param] ? this.dependTypes[typeof param](param, element):true;
},
dependTypes: {
"boolean": function(param, element){
return param;
},
"string": function(param, element){
return !!$(param, element.form).length;
},
"function": function(param, element){
return param(element);
}},
optional: function(element){
var val=this.elementValue(element);
return !$.validator.methods.required.call(this, val, element)&&"dependency-mismatch";
},
startRequest: function(element){
if(!this.pending[element.name]){
this.pendingRequest++;
this.pending[element.name]=true;
}},
stopRequest: function(element, valid){
this.pendingRequest--;
if(this.pendingRequest < 0){
this.pendingRequest=0;
}
delete this.pending[element.name];
if(valid&&this.pendingRequest===0&&this.formSubmitted&&this.form()){
$(this.currentForm).submit();
this.formSubmitted=false;
}else if(!valid&&this.pendingRequest===0&&this.formSubmitted){
$(this.currentForm).triggerHandler("invalid-form", [this]);
this.formSubmitted=false;
}},
previousValue: function(element){
return $.data(element, "previousValue")||$.data(element, "previousValue", {
old: null,
valid: true,
message: this.defaultMessage(element, "remote")
});
}},
classRuleSettings: {
required: {required: true},
email: {email: true},
url: {url: true},
date: {date: true},
dateISO: {dateISO: true},
number: {number: true},
digits: {digits: true},
creditcard: {creditcard: true}},
addClassRules: function(className, rules){
if(className.constructor===String){
this.classRuleSettings[className]=rules;
}else{
$.extend(this.classRuleSettings, className);
}},
classRules: function(element){
var rules={};
var classes=$(element).attr("class");
if(classes){
$.each(classes.split(" "), function(){
if(this in $.validator.classRuleSettings){
$.extend(rules, $.validator.classRuleSettings[this]);
}});
}
return rules;
},
attributeRules: function(element){
var rules={};
var $element=$(element);
for (var method in $.validator.methods){
var value;
if(method==="required"){
value=$element.get(0).getAttribute(method);
if(value===""){
value=true;
}
value = !!value;
}else{
value=$element.attr(method);
}
if(value){
rules[method]=value;
}else if($element[0].getAttribute("type")===method){
rules[method]=true;
}}
if(rules.maxlength&&/-1|2147483647|524288/.test(rules.maxlength)){
delete rules.maxlength;
}
return rules;
},
dataRules: function(element){
var method, value,
rules={}, $element=$(element);
for (method in $.validator.methods){
value=$element.data("rule-" + method.toLowerCase());
if(value!==undefined){
rules[method]=value;
}}
return rules;
},
staticRules: function(element){
var rules={};
var validator=$.data(element.form, "validator");
if(validator.settings.rules){
rules=$.validator.normalizeRule(validator.settings.rules[element.name])||{};}
return rules;
},
normalizeRules: function(rules, element){
$.each(rules, function(prop, val){
if(val===false){
delete rules[prop];
return;
}
if(val.param||val.depends){
var keepRule=true;
switch (typeof val.depends){
case "string":
keepRule = !!$(val.depends, element.form).length;
break;
case "function":
keepRule=val.depends.call(element, element);
break;
}
if(keepRule){
rules[prop]=val.param!==undefined ? val.param:true;
}else{
delete rules[prop];
}}
});
$.each(rules, function(rule, parameter){
rules[rule]=$.isFunction(parameter) ? parameter(element):parameter;
});
$.each(["minlength", "maxlength", "min", "max"], function(){
if(rules[this]){
rules[this]=Number(rules[this]);
}});
$.each(["rangelength", "range"], function(){
var parts;
if(rules[this]){
if($.isArray(rules[this])){
rules[this]=[Number(rules[this][0]), Number(rules[this][1])];
}else if(typeof rules[this]==="string"){
parts=rules[this].split(/[\s,]+/);
rules[this]=[Number(parts[0]), Number(parts[1])];
}}
});
if($.validator.autoCreateRanges){
if(rules.min&&rules.max){
rules.range=[rules.min, rules.max];
delete rules.min;
delete rules.max;
}
if(rules.minlength&&rules.maxlength){
rules.rangelength=[rules.minlength, rules.maxlength];
delete rules.minlength;
delete rules.maxlength;
}}
return rules;
},
normalizeRule: function(data){
if(typeof data==="string"){
var transformed={};
$.each(data.split(/\s/), function(){
transformed[this]=true;
});
data=transformed;
}
return data;
},
addMethod: function(name, method, message){
$.validator.methods[name]=method;
$.validator.messages[name]=message!==undefined ? message:$.validator.messages[name];
if(method.length < 3){
$.validator.addClassRules(name, $.validator.normalizeRule(name));
}},
methods: {
required: function(value, element, param){
if(!this.depend(param, element)){
return "dependency-mismatch";
}
if(element.nodeName.toLowerCase()==="select"){
var val=$(element).val();
return val&&val.length > 0;
}
if(this.checkable(element)){
return this.getLength(value, element) > 0;
}
return $.trim(value).length > 0;
},
remote: function(value, element, param){
if(this.optional(element)){
return "dependency-mismatch";
}
var previous=this.previousValue(element);
if(!this.settings.messages[element.name]){
this.settings.messages[element.name]={};}
previous.originalMessage=this.settings.messages[element.name].remote;
this.settings.messages[element.name].remote=previous.message;
param=typeof param==="string"&&{url:param}||param;
if(previous.old===value){
return previous.valid;
}
previous.old=value;
var validator=this;
this.startRequest(element);
var data={};
data[element.name]=value;
$.ajax($.extend(true, {
url: param,
mode: "abort",
port: "validate" + element.name,
dataType: "json",
data: data,
success: function(response){
validator.settings.messages[element.name].remote=previous.originalMessage;
var valid=response===true||response==="true";
if(valid){
var submitted=validator.formSubmitted;
validator.prepareElement(element);
validator.formSubmitted=submitted;
validator.successList.push(element);
delete validator.invalid[element.name];
validator.showErrors();
}else{
var errors={};
var message=response||validator.defaultMessage(element, "remote");
errors[element.name]=previous.message=$.isFunction(message) ? message(value):message;
validator.invalid[element.name]=true;
validator.showErrors(errors);
}
previous.valid=valid;
validator.stopRequest(element, valid);
}}, param));
return "pending";
},
minlength: function(value, element, param){
var length=$.isArray(value) ? value.length:this.getLength($.trim(value), element);
return this.optional(element)||length >=param;
},
maxlength: function(value, element, param){
var length=$.isArray(value) ? value.length:this.getLength($.trim(value), element);
return this.optional(element)||length <=param;
},
rangelength: function(value, element, param){
var length=$.isArray(value) ? value.length:this.getLength($.trim(value), element);
return this.optional(element)||(length >=param[0]&&length <=param[1]);
},
min: function(value, element, param){
return this.optional(element)||value >=param;
},
max: function(value, element, param){
return this.optional(element)||value <=param;
},
range: function(value, element, param){
return this.optional(element)||(value >=param[0]&&value <=param[1]);
},
email: function(value, element){
return this.optional(element)||/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
},
url: function(value, element){
return this.optional(element)||/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
},
date: function(value, element){
return this.optional(element)||!/Invalid|NaN/.test(new Date(value).toString());
},
dateISO: function(value, element){
return this.optional(element)||/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
},
number: function(value, element){
return this.optional(element)||/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
},
digits: function(value, element){
return this.optional(element)||/^\d+$/.test(value);
},
creditcard: function(value, element){
if(this.optional(element)){
return "dependency-mismatch";
}
if(/[^0-9 \-]+/.test(value)){
return false;
}
var nCheck=0,
nDigit=0,
bEven=false;
value=value.replace(/\D/g, "");
for (var n=value.length - 1; n >=0; n--){
var cDigit=value.charAt(n);
nDigit=parseInt(cDigit, 10);
if(bEven){
if((nDigit *=2) > 9){
nDigit -=9;
}}
nCheck +=nDigit;
bEven = !bEven;
}
return (nCheck % 10)===0;
},
equalTo: function(value, element, param){
var target=$(param);
if(this.settings.onfocusout){
target.unbind(".validate-equalTo").bind("blur.validate-equalTo", function(){
$(element).valid();
});
}
return value===target.val();
}}
});
$.format=$.validator.format;
}(jQuery));
(function($){
var pendingRequests={};
if($.ajaxPrefilter){
$.ajaxPrefilter(function(settings, _, xhr){
var port=settings.port;
if(settings.mode==="abort"){
if(pendingRequests[port]){
pendingRequests[port].abort();
}
pendingRequests[port]=xhr;
}});
}else{
var ajax=$.ajax;
$.ajax=function(settings){
var mode=("mode" in settings ? settings:$.ajaxSettings).mode,
port=("port" in settings ? settings:$.ajaxSettings).port;
if(mode==="abort"){
if(pendingRequests[port]){
pendingRequests[port].abort();
}
return (pendingRequests[port]=ajax.apply(this, arguments));
}
return ajax.apply(this, arguments);
};}}(jQuery));
(function($){
$.extend($.fn, {
validateDelegate: function(delegate, type, handler){
return this.bind(type, function(event){
var target=$(event.target);
if(target.is(delegate)){
return handler.apply(target, arguments);
}});
}});
}(jQuery));
!function(a){"use strict";var e={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"Ae","Å":"A","Æ":"AE","Ç":"C","È":"E","É":"E","Ê":"E","Ë":"E","Ì":"I","Í":"I","Î":"I","Ï":"I","Ð":"D","Ñ":"N","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"Oe","Ő":"O","Ø":"O","Ù":"U","Ú":"U","Û":"U","Ü":"Ue","Ű":"U","Ý":"Y","Þ":"TH","ß":"ss","à":"a","á":"a","â":"a","ã":"a","ä":"ae","å":"a","æ":"ae","ç":"c","è":"e","é":"e","ê":"e","ë":"e","ì":"i","í":"i","î":"i","ï":"i","ð":"d","ñ":"n","ò":"o","ó":"o","ô":"o","õ":"o","ö":"oe","ő":"o","ø":"o","ù":"u","ú":"u","û":"u","ü":"ue","ű":"u","ý":"y","þ":"th","ÿ":"y","ẞ":"SS","ا":"a","أ":"a","إ":"i","آ":"aa","ؤ":"u","ئ":"e","ء":"a","ب":"b","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh","د":"d","ذ":"th","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"dh","ط":"t","ظ":"z","ع":"a","غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w","ي":"y","ى":"a","ة":"h","ﻻ":"la","ﻷ":"laa","ﻹ":"lai","ﻵ":"laa","گ":"g","چ":"ch","پ":"p","ژ":"zh","ک":"k","ی":"y","َ":"a","ً":"an","ِ":"e","ٍ":"en","ُ":"u","ٌ":"on","ْ":"","٠":"0","١":"1","٢":"2","٣":"3","٤":"4","٥":"5","٦":"6","٧":"7","٨":"8","٩":"9","۰":"0","۱":"1","۲":"2","۳":"3","۴":"4","۵":"5","۶":"6","۷":"7","۸":"8","۹":"9","က":"k","ခ":"kh","ဂ":"g","ဃ":"ga","င":"ng","စ":"s","ဆ":"sa","ဇ":"z","စျ":"za","ည":"ny","ဋ":"t","ဌ":"ta","ဍ":"d","ဎ":"da","ဏ":"na","တ":"t","ထ":"ta","ဒ":"d","ဓ":"da","န":"n","ပ":"p","ဖ":"pa","ဗ":"b","ဘ":"ba","မ":"m","ယ":"y","ရ":"ya","လ":"l","ဝ":"w","သ":"th","ဟ":"h","ဠ":"la","အ":"a","ြ":"y","ျ":"ya","ွ":"w","ြွ":"yw","ျွ":"ywa","ှ":"h","ဧ":"e","၏":"-e","ဣ":"i","ဤ":"-i","ဉ":"u","ဦ":"-u","ဩ":"aw","သြော":"aw","ဪ":"aw","၀":"0","၁":"1","၂":"2","၃":"3","၄":"4","၅":"5","၆":"6","၇":"7","၈":"8","၉":"9","္":"","့":"","း":"","č":"c","ď":"d","ě":"e","ň":"n","ř":"r","š":"s","ť":"t","ů":"u","ž":"z","Č":"C","Ď":"D","Ě":"E","Ň":"N","Ř":"R","Š":"S","Ť":"T","Ů":"U","Ž":"Z","ހ":"h","ށ":"sh","ނ":"n","ރ":"r","ބ":"b","ޅ":"lh","ކ":"k","އ":"a","ވ":"v","މ":"m","ފ":"f","ދ":"dh","ތ":"th","ލ":"l","ގ":"g","ޏ":"gn","ސ":"s","ޑ":"d","ޒ":"z","ޓ":"t","ޔ":"y","ޕ":"p","ޖ":"j","ޗ":"ch","ޘ":"tt","ޙ":"hh","ޚ":"kh","ޛ":"th","ޜ":"z","ޝ":"sh","ޞ":"s","ޟ":"d","ޠ":"t","ޡ":"z","ޢ":"a","ޣ":"gh","ޤ":"q","ޥ":"w","ަ":"a","ާ":"aa","ި":"i","ީ":"ee","ު":"u","ޫ":"oo","ެ":"e","ޭ":"ey","ޮ":"o","ޯ":"oa","ް":"","ა":"a","ბ":"b","გ":"g","დ":"d","ე":"e","ვ":"v","ზ":"z","თ":"t","ი":"i","კ":"k","ლ":"l","მ":"m","ნ":"n","ო":"o","პ":"p","ჟ":"zh","რ":"r","ს":"s","ტ":"t","უ":"u","ფ":"p","ქ":"k","ღ":"gh","ყ":"q","შ":"sh","ჩ":"ch","ც":"ts","ძ":"dz","წ":"ts","ჭ":"ch","ხ":"kh","ჯ":"j","ჰ":"h","α":"a","β":"v","γ":"g","δ":"d","ε":"e","ζ":"z","η":"i","θ":"th","ι":"i","κ":"k","λ":"l","μ":"m","ν":"n","ξ":"ks","ο":"o","π":"p","ρ":"r","σ":"s","τ":"t","υ":"y","φ":"f","χ":"x","ψ":"ps","ω":"o","ά":"a","έ":"e","ί":"i","ό":"o","ύ":"y","ή":"i","ώ":"o","ς":"s","ϊ":"i","ΰ":"y","ϋ":"y","ΐ":"i","Α":"A","Β":"B","Γ":"G","Δ":"D","Ε":"E","Ζ":"Z","Η":"I","Θ":"TH","Ι":"I","Κ":"K","Λ":"L","Μ":"M","Ν":"N","Ξ":"KS","Ο":"O","Π":"P","Ρ":"R","Σ":"S","Τ":"T","Υ":"Y","Φ":"F","Χ":"X","Ψ":"PS","Ω":"O","Ά":"A","Έ":"E","Ί":"I","Ό":"O","Ύ":"Y","Ή":"I","Ώ":"O","Ϊ":"I","Ϋ":"Y","ā":"a","ē":"e","ģ":"g","ī":"i","ķ":"k","ļ":"l","ņ":"n","ū":"u","Ā":"A","Ē":"E","Ģ":"G","Ī":"I","Ķ":"k","Ļ":"L","Ņ":"N","Ū":"U","Ќ":"Kj","ќ":"kj","Љ":"Lj","љ":"lj","Њ":"Nj","њ":"nj","Тс":"Ts","тс":"ts","ą":"a","ć":"c","ę":"e","ł":"l","ń":"n","ś":"s","ź":"z","ż":"z","Ą":"A","Ć":"C","Ę":"E","Ł":"L","Ń":"N","Ś":"S","Ź":"Z","Ż":"Z","Є":"Ye","І":"I","Ї":"Yi","Ґ":"G","є":"ye","і":"i","ї":"yi","ґ":"g","ă":"a","Ă":"A","ș":"s","Ș":"S","ț":"t","Ț":"T","ţ":"t","Ţ":"T","а":"a","б":"b","в":"v","г":"g","д":"d","е":"e","ё":"yo","ж":"zh","з":"z","и":"i","й":"i","к":"k","л":"l","м":"m","н":"n","о":"o","п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"kh","ц":"c","ч":"ch","ш":"sh","щ":"sh","ъ":"","ы":"y","ь":"","э":"e","ю":"yu","я":"ya","А":"A","Б":"B","В":"V","Г":"G","Д":"D","Е":"E","Ё":"Yo","Ж":"Zh","З":"Z","И":"I","Й":"I","К":"K","Л":"L","М":"M","Н":"N","О":"O","П":"P","Р":"R","С":"S","Т":"T","У":"U","Ф":"F","Х":"Kh","Ц":"C","Ч":"Ch","Ш":"Sh","Щ":"Sh","Ъ":"","Ы":"Y","Ь":"","Э":"E","Ю":"Yu","Я":"Ya","ђ":"dj","ј":"j","ћ":"c","џ":"dz","Ђ":"Dj","Ј":"j","Ћ":"C","Џ":"Dz","ľ":"l","ĺ":"l","ŕ":"r","Ľ":"L","Ĺ":"L","Ŕ":"R","ş":"s","Ş":"S","ı":"i","İ":"I","ğ":"g","Ğ":"G","ả":"a","Ả":"A","ẳ":"a","Ẳ":"A","ẩ":"a","Ẩ":"A","đ":"d","Đ":"D","ẹ":"e","Ẹ":"E","ẽ":"e","Ẽ":"E","ẻ":"e","Ẻ":"E","ế":"e","Ế":"E","ề":"e","Ề":"E","ệ":"e","Ệ":"E","ễ":"e","Ễ":"E","ể":"e","Ể":"E","ỏ":"o","ọ":"o","Ọ":"o","ố":"o","Ố":"O","ồ":"o","Ồ":"O","ổ":"o","Ổ":"O","ộ":"o","Ộ":"O","ỗ":"o","Ỗ":"O","ơ":"o","Ơ":"O","ớ":"o","Ớ":"O","ờ":"o","Ờ":"O","ợ":"o","Ợ":"O","ỡ":"o","Ỡ":"O","Ở":"o","ở":"o","ị":"i","Ị":"I","ĩ":"i","Ĩ":"I","ỉ":"i","Ỉ":"i","ủ":"u","Ủ":"U","ụ":"u","Ụ":"U","ũ":"u","Ũ":"U","ư":"u","Ư":"U","ứ":"u","Ứ":"U","ừ":"u","Ừ":"U","ự":"u","Ự":"U","ữ":"u","Ữ":"U","ử":"u","Ử":"ư","ỷ":"y","Ỷ":"y","ỳ":"y","Ỳ":"Y","ỵ":"y","Ỵ":"Y","ỹ":"y","Ỹ":"Y","ạ":"a","Ạ":"A","ấ":"a","Ấ":"A","ầ":"a","Ầ":"A","ậ":"a","Ậ":"A","ẫ":"a","Ẫ":"A","ắ":"a","Ắ":"A","ằ":"a","Ằ":"A","ặ":"a","Ặ":"A","ẵ":"a","Ẵ":"A","⓪":"0","①":"1","②":"2","③":"3","④":"4","⑤":"5","⑥":"6","⑦":"7","⑧":"8","⑨":"9","⑩":"10","⑪":"11","⑫":"12","⑬":"13","⑭":"14","⑮":"15","⑯":"16","⑰":"17","⑱":"18","⑲":"18","⑳":"18","⓵":"1","⓶":"2","⓷":"3","⓸":"4","⓹":"5","⓺":"6","⓻":"7","⓼":"8","⓽":"9","⓾":"10","⓿":"0","⓫":"11","⓬":"12","⓭":"13","⓮":"14","⓯":"15","⓰":"16","⓱":"17","⓲":"18","⓳":"19","⓴":"20","Ⓐ":"A","Ⓑ":"B","Ⓒ":"C","Ⓓ":"D","Ⓔ":"E","Ⓕ":"F","Ⓖ":"G","Ⓗ":"H","Ⓘ":"I","Ⓙ":"J","Ⓚ":"K","Ⓛ":"L","Ⓜ":"M","Ⓝ":"N","Ⓞ":"O","Ⓟ":"P","Ⓠ":"Q","Ⓡ":"R","Ⓢ":"S","Ⓣ":"T","Ⓤ":"U","Ⓥ":"V","Ⓦ":"W","Ⓧ":"X","Ⓨ":"Y","Ⓩ":"Z","ⓐ":"a","ⓑ":"b","ⓒ":"c","ⓓ":"d","ⓔ":"e","ⓕ":"f","ⓖ":"g","ⓗ":"h","ⓘ":"i","ⓙ":"j","ⓚ":"k","ⓛ":"l","ⓜ":"m","ⓝ":"n","ⓞ":"o","ⓟ":"p","ⓠ":"q","ⓡ":"r","ⓢ":"s","ⓣ":"t","ⓤ":"u","ⓦ":"v","ⓥ":"w","ⓧ":"x","ⓨ":"y","ⓩ":"z","“":'"',"”":'"',"‘":"'","’":"'","∂":"d","ƒ":"f","™":"(TM)","©":"(C)","œ":"oe","Œ":"OE","®":"(R)","†":"+","℠":"(SM)","…":"...","˚":"o","º":"o","ª":"a","•":"*","၊":",","။":".",$:"USD","€":"EUR","₢":"BRN","₣":"FRF","£":"GBP","₤":"ITL","₦":"NGN","₧":"ESP","₩":"KRW","₪":"ILS","₫":"VND","₭":"LAK","₮":"MNT","₯":"GRD","₱":"ARS","₲":"PYG","₳":"ARA","₴":"UAH","₵":"GHS","¢":"cent","¥":"CNY","元":"CNY","円":"YEN","﷼":"IRR","₠":"EWE","฿":"THB","₨":"INR","₹":"INR","₰":"PF","₺":"TRY","؋":"AFN","₼":"AZN","лв":"BGN","៛":"KHR","₡":"CRC","₸":"KZT","ден":"MKD","zł":"PLN","₽":"RUB","₾":"GEL"},n=["်","ް"],t={"ာ":"a","ါ":"a","ေ":"e","ဲ":"e","ိ":"i","ီ":"i","ို":"o","ု":"u","ူ":"u","ေါင်":"aung","ော":"aw","ော်":"aw","ေါ":"aw","ေါ်":"aw","်":"်","က်":"et","ိုက်":"aik","ောက်":"auk","င်":"in","ိုင်":"aing","ောင်":"aung","စ်":"it","ည်":"i","တ်":"at","ိတ်":"eik","ုတ်":"ok","ွတ်":"ut","ေတ်":"it","ဒ်":"d","ိုဒ်":"ok","ုဒ်":"ait","န်":"an","ာန်":"an","ိန်":"ein","ုန်":"on","ွန်":"un","ပ်":"at","ိပ်":"eik","ုပ်":"ok","ွပ်":"ut","န်ုပ်":"nub","မ်":"an","ိမ်":"ein","ုမ်":"on","ွမ်":"un","ယ်":"e","ိုလ်":"ol","ဉ်":"in","ံ":"an","ိံ":"ein","ုံ":"on","ައް":"ah","ަށް":"ah"},i={en:{},az:{"ç":"c","ə":"e","ğ":"g","ı":"i","ö":"o","ş":"s","ü":"u","Ç":"C","Ə":"E","Ğ":"G","İ":"I","Ö":"O","Ş":"S","Ü":"U"},cs:{"č":"c","ď":"d","ě":"e","ň":"n","ř":"r","š":"s","ť":"t","ů":"u","ž":"z","Č":"C","Ď":"D","Ě":"E","Ň":"N","Ř":"R","Š":"S","Ť":"T","Ů":"U","Ž":"Z"},fi:{"ä":"a","Ä":"A","ö":"o","Ö":"O"},hu:{"ä":"a","Ä":"A","ö":"o","Ö":"O","ü":"u","Ü":"U","ű":"u","Ű":"U"},lt:{"ą":"a","č":"c","ę":"e","ė":"e","į":"i","š":"s","ų":"u","ū":"u","ž":"z","Ą":"A","Č":"C","Ę":"E","Ė":"E","Į":"I","Š":"S","Ų":"U","Ū":"U"},lv:{"ā":"a","č":"c","ē":"e","ģ":"g","ī":"i","ķ":"k","ļ":"l","ņ":"n","š":"s","ū":"u","ž":"z","Ā":"A","Č":"C","Ē":"E","Ģ":"G","Ī":"i","Ķ":"k","Ļ":"L","Ņ":"N","Š":"S","Ū":"u","Ž":"Z"},pl:{"ą":"a","ć":"c","ę":"e","ł":"l","ń":"n","ó":"o","ś":"s","ź":"z","ż":"z","Ą":"A","Ć":"C","Ę":"e","Ł":"L","Ń":"N","Ó":"O","Ś":"S","Ź":"Z","Ż":"Z"},sv:{"ä":"a","Ä":"A","ö":"o","Ö":"O"},sk:{"ä":"a","Ä":"A"},sr:{"љ":"lj","њ":"nj","Љ":"Lj","Њ":"Nj","đ":"dj","Đ":"Dj"},tr:{"Ü":"U","Ö":"O","ü":"u","ö":"o"}},o={ar:{"∆":"delta","∞":"la-nihaya","♥":"hob","&":"wa","|":"aw","<":"aqal-men",">":"akbar-men","∑":"majmou","¤":"omla"},az:{},ca:{"∆":"delta","∞":"infinit","♥":"amor","&":"i","|":"o","<":"menys que",">":"mes que","∑":"suma dels","¤":"moneda"},cs:{"∆":"delta","∞":"nekonecno","♥":"laska","&":"a","|":"nebo","<":"mensi nez",">":"vetsi nez","∑":"soucet","¤":"mena"},de:{"∆":"delta","∞":"unendlich","♥":"Liebe","&":"und","|":"oder","<":"kleiner als",">":"groesser als","∑":"Summe von","¤":"Waehrung"},dv:{"∆":"delta","∞":"kolunulaa","♥":"loabi","&":"aai","|":"noonee","<":"ah vure kuda",">":"ah vure bodu","∑":"jumula","¤":"faisaa"},en:{"∆":"delta","∞":"infinity","♥":"love","&":"and","|":"or","<":"less than",">":"greater than","∑":"sum","¤":"currency"},es:{"∆":"delta","∞":"infinito","♥":"amor","&":"y","|":"u","<":"menos que",">":"mas que","∑":"suma de los","¤":"moneda"},fa:{"∆":"delta","∞":"bi-nahayat","♥":"eshgh","&":"va","|":"ya","<":"kamtar-az",">":"bishtar-az","∑":"majmooe","¤":"vahed"},fi:{"∆":"delta","∞":"aarettomyys","♥":"rakkaus","&":"ja","|":"tai","<":"pienempi kuin",">":"suurempi kuin","∑":"summa","¤":"valuutta"},fr:{"∆":"delta","∞":"infiniment","♥":"Amour","&":"et","|":"ou","<":"moins que",">":"superieure a","∑":"somme des","¤":"monnaie"},ge:{"∆":"delta","∞":"usasruloba","♥":"siqvaruli","&":"da","|":"an","<":"naklebi",">":"meti","∑":"jami","¤":"valuta"},gr:{},hu:{"∆":"delta","∞":"vegtelen","♥":"szerelem","&":"es","|":"vagy","<":"kisebb mint",">":"nagyobb mint","∑":"szumma","¤":"penznem"},it:{"∆":"delta","∞":"infinito","♥":"amore","&":"e","|":"o","<":"minore di",">":"maggiore di","∑":"somma","¤":"moneta"},lt:{"∆":"delta","∞":"begalybe","♥":"meile","&":"ir","|":"ar","<":"maziau nei",">":"daugiau nei","∑":"suma","¤":"valiuta"},lv:{"∆":"delta","∞":"bezgaliba","♥":"milestiba","&":"un","|":"vai","<":"mazak neka",">":"lielaks neka","∑":"summa","¤":"valuta"},my:{"∆":"kwahkhyaet","∞":"asaonasme","♥":"akhyait","&":"nhin","|":"tho","<":"ngethaw",">":"kyithaw","∑":"paungld","¤":"ngwekye"},mk:{},nl:{"∆":"delta","∞":"oneindig","♥":"liefde","&":"en","|":"of","<":"kleiner dan",">":"groter dan","∑":"som","¤":"valuta"},pl:{"∆":"delta","∞":"nieskonczonosc","♥":"milosc","&":"i","|":"lub","<":"mniejsze niz",">":"wieksze niz","∑":"suma","¤":"waluta"},pt:{"∆":"delta","∞":"infinito","♥":"amor","&":"e","|":"ou","<":"menor que",">":"maior que","∑":"soma","¤":"moeda"},ro:{"∆":"delta","∞":"infinit","♥":"dragoste","&":"si","|":"sau","<":"mai mic ca",">":"mai mare ca","∑":"suma","¤":"valuta"},ru:{"∆":"delta","∞":"beskonechno","♥":"lubov","&":"i","|":"ili","<":"menshe",">":"bolshe","∑":"summa","¤":"valjuta"},sk:{"∆":"delta","∞":"nekonecno","♥":"laska","&":"a","|":"alebo","<":"menej ako",">":"viac ako","∑":"sucet","¤":"mena"},sr:{},tr:{"∆":"delta","∞":"sonsuzluk","♥":"ask","&":"ve","|":"veya","<":"kucuktur",">":"buyuktur","∑":"toplam","¤":"para birimi"},uk:{"∆":"delta","∞":"bezkinechnist","♥":"lubov","&":"i","|":"abo","<":"menshe",">":"bilshe","∑":"suma","¤":"valjuta"},vn:{"∆":"delta","∞":"vo cuc","♥":"yeu","&":"va","|":"hoac","<":"nho hon",">":"lon hon","∑":"tong","¤":"tien te"}},u=[";","?",":","@","&","=","+","$",",","/"].join(""),s=[";","?",":","@","&","=","+","$",","].join(""),l=[".","!","~","*","'","(",")"].join(""),r=function(a,r){var m,d,g,k,y,f,p,z,b,A,v,E,O,j,S="-",w="",U="",C=!0,N={},R="";if("string"!=typeof a)return"";if("string"==typeof r&&(S=r),p=o.en,z=i.en,"object"==typeof r){m=r.maintainCase||!1,N=r.custom&&"object"==typeof r.custom?r.custom:N,g=+r.truncate>1&&r.truncate||!1,k=r.uric||!1,y=r.uricNoSlash||!1,f=r.mark||!1,C=!1!==r.symbols&&!1!==r.lang,S=r.separator||S,k&&(R+=u),y&&(R+=s),f&&(R+=l),p=r.lang&&o[r.lang]&&C?o[r.lang]:C?o.en:{},z=r.lang&&i[r.lang]?i[r.lang]:!1===r.lang||!0===r.lang?{}:i.en,r.titleCase&&"number"==typeof r.titleCase.length&&Array.prototype.toString.call(r.titleCase)?(r.titleCase.forEach(function(a){N[a+""]=a+""}),d=!0):d=!!r.titleCase,r.custom&&"number"==typeof r.custom.length&&Array.prototype.toString.call(r.custom)&&r.custom.forEach(function(a){N[a+""]=a+""}),Object.keys(N).forEach(function(e){var n;n=e.length>1?new RegExp("\\b"+h(e)+"\\b","gi"):new RegExp(h(e),"gi"),a=a.replace(n,N[e])});for(v in N)R+=v}for(R=h(R+=S),O=!1,j=!1,A=0,E=(a=a.replace(/(^\s+|\s+$)/g,"")).length;A<E;A++)v=a[A],c(v,N)?O=!1:z[v]?(v=O&&z[v].match(/[A-Za-z0-9]/)?" "+z[v]:z[v],O=!1):v in e?(A+1<E&&n.indexOf(a[A+1])>=0?(U+=v,v=""):!0===j?(v=t[U]+e[v],U=""):v=O&&e[v].match(/[A-Za-z0-9]/)?" "+e[v]:e[v],O=!1,j=!1):v in t?(U+=v,v="",A===E-1&&(v=t[U]),j=!0):!p[v]||k&&-1!==u.indexOf(v)||y&&-1!==s.indexOf(v)?(!0===j?(v=t[U]+v,U="",j=!1):O&&(/[A-Za-z0-9]/.test(v)||w.substr(-1).match(/A-Za-z0-9]/))&&(v=" "+v),O=!1):(v=O||w.substr(-1).match(/[A-Za-z0-9]/)?S+p[v]:p[v],v+=void 0!==a[A+1]&&a[A+1].match(/[A-Za-z0-9]/)?S:"",O=!0),w+=v.replace(new RegExp("[^\\w\\s"+R+"_-]","g"),S);return d&&(w=w.replace(/(\w)(\S*)/g,function(a,e,n){var t=e.toUpperCase()+(null!==n?n:"");return Object.keys(N).indexOf(t.toLowerCase())<0?t:t.toLowerCase()})),w=w.replace(/\s+/g,S).replace(new RegExp("\\"+S+"+","g"),S).replace(new RegExp("(^\\"+S+"+|\\"+S+"+$)","g"),""),g&&w.length>g&&(b=w.charAt(g)===S,w=w.slice(0,g),b||(w=w.slice(0,w.lastIndexOf(S)))),m||d||(w=w.toLowerCase()),w},m=function(a){return function(e){return r(e,a)}},h=function(a){return a.replace(/[-\\^$*+?.()|[\]{}\/]/g,"\\$&")},c=function(a,e){for(var n in e)if(e[n]===a)return!0};if("undefined"!=typeof module&&module.exports)module.exports=r,module.exports.createSlug=m;else if("undefined"!=typeof define&&define.amd)define([],function(){return r});else try{if(a.getSlug||a.createSlug)throw"speakingurl: globals exists /(getSlug|createSlug)/";a.getSlug=r,a.createSlug=m}catch(a){}}(this);
(function (root, undef){
var ArrayProto=Array.prototype,
ObjProto=Object.prototype,
slice=ArrayProto.slice,
hasOwnProp=ObjProto.hasOwnProperty,
nativeForEach=ArrayProto.forEach,
breaker={};
var _={
forEach:function(obj, iterator, context){
var i, l, key;
if(obj===null){
return;
}
if(nativeForEach&&obj.forEach===nativeForEach){
obj.forEach(iterator, context);
}
else if(obj.length===+obj.length){
for(i=0, l=obj.length; i < l; i++){
if(i in obj&&iterator.call(context, obj[i], i, obj)===breaker){
return;
}}
}else{
for(key in obj){
if(hasOwnProp.call(obj, key)){
if(iterator.call (context, obj[key], key, obj)===breaker){
return;
}}
}}
},
extend:function(obj){
this.forEach(slice.call(arguments, 1), function(source){
for(var prop in source){
obj[prop]=source[prop];
}});
return obj;
}};
var Jed=function(options){
this.defaults={
"locale_data":{
"messages":{
"":{
"domain":"messages",
"lang":"en",
"plural_forms":"nplurals=2; plural=(n!=1);"
}}
},
"domain":"messages",
"debug":false
};
this.options=_.extend({}, this.defaults, options);
this.textdomain(this.options.domain);
if(options.domain&&! this.options.locale_data[ this.options.domain ]){
throw new Error('Text domain set to non-existent domain: `' + options.domain + '`');
}};
Jed.context_delimiter=String.fromCharCode(4);
function getPluralFormFunc(plural_form_string){
return Jed.PF.compile(plural_form_string||"nplurals=2; plural=(n!=1);");
}
function Chain(key, i18n){
this._key=key;
this._i18n=i18n;
}
_.extend(Chain.prototype, {
onDomain:function(domain){
this._domain=domain;
return this;
},
withContext:function(context){
this._context=context;
return this;
},
ifPlural:function(num, pkey){
this._val=num;
this._pkey=pkey;
return this;
},
fetch:function(sArr){
if({}.toString.call(sArr)!='[object Array]'){
sArr=[].slice.call(arguments, 0);
}
return(sArr&&sArr.length ? Jed.sprintf:function(x){ return x; })(
this._i18n.dcnpgettext(this._domain, this._context, this._key, this._pkey, this._val),
sArr
);
}});
_.extend(Jed.prototype, {
translate:function(key){
return new Chain(key, this);
},
textdomain:function(domain){
if(! domain){
return this._textdomain;
}
this._textdomain=domain;
},
gettext:function(key){
return this.dcnpgettext.call(this, undef, undef, key);
},
dgettext:function(domain, key){
return this.dcnpgettext.call(this, domain, undef, key);
},
dcgettext:function(domain , key ){
return this.dcnpgettext.call(this, domain, undef, key);
},
ngettext:function(skey, pkey, val){
return this.dcnpgettext.call(this, undef, undef, skey, pkey, val);
},
dngettext:function(domain, skey, pkey, val){
return this.dcnpgettext.call(this, domain, undef, skey, pkey, val);
},
dcngettext:function(domain, skey, pkey, val){
return this.dcnpgettext.call(this, domain, undef, skey, pkey, val);
},
pgettext:function(context, key){
return this.dcnpgettext.call(this, undef, context, key);
},
dpgettext:function(domain, context, key){
return this.dcnpgettext.call(this, domain, context, key);
},
dcpgettext:function(domain, context, key){
return this.dcnpgettext.call(this, domain, context, key);
},
npgettext:function(context, skey, pkey, val){
return this.dcnpgettext.call(this, undef, context, skey, pkey, val);
},
dnpgettext:function(domain, context, skey, pkey, val){
return this.dcnpgettext.call(this, domain, context, skey, pkey, val);
},
dcnpgettext:function(domain, context, singular_key, plural_key, val){
plural_key=plural_key||singular_key;
domain=domain||this._textdomain;
var fallback;
if(! this.options){
fallback=new Jed();
return fallback.dcnpgettext.call(fallback, undefined, undefined, singular_key, plural_key, val);
}
if(! this.options.locale_data){
throw new Error('No locale data provided.');
}
if(! this.options.locale_data[ domain ]){
throw new Error('Domain `' + domain + '` was not found.');
}
if(! this.options.locale_data[ domain ][ "" ]){
throw new Error('No locale meta information provided.');
}
if(! singular_key){
throw new Error('No translation key found.');
}
var key=context ? context + Jed.context_delimiter + singular_key:singular_key,
locale_data=this.options.locale_data,
dict=locale_data[ domain ],
defaultConf=(locale_data.messages||this.defaults.locale_data.messages)[""],
pluralForms=dict[""].plural_forms||dict[""]["Plural-Forms"]||dict[""]["plural-forms"]||defaultConf.plural_forms||defaultConf["Plural-Forms"]||defaultConf["plural-forms"],
val_list,
res;
var val_idx;
if(val===undefined){
val_idx=0;
}else{
if(typeof val!='number'){
val=parseInt(val, 10);
if(isNaN(val)){
throw new Error('The number that was passed in is not a number.');
}}
val_idx=getPluralFormFunc(pluralForms)(val);
}
if(! dict){
throw new Error('No domain named `' + domain + '` could be found.');
}
val_list=dict[ key ];
if(! val_list||val_idx > val_list.length){
if(this.options.missing_key_callback){
this.options.missing_key_callback(key, domain);
}
res=[ singular_key, plural_key ];
if(this.options.debug===true){
console.log(res[ getPluralFormFunc(pluralForms)(val) ]);
}
return res[ getPluralFormFunc()(val) ];
}
res=val_list[ val_idx ];
if(! res){
res=[ singular_key, plural_key ];
return res[ getPluralFormFunc()(val) ];
}
return res;
}});
var sprintf=(function(){
function get_type(variable){
return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
}
function str_repeat(input, multiplier){
for (var output=[]; multiplier > 0; output[--multiplier]=input){}
return output.join('');
}
var str_format=function(){
if(!str_format.cache.hasOwnProperty(arguments[0])){
str_format.cache[arguments[0]]=str_format.parse(arguments[0]);
}
return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
};
str_format.format=function(parse_tree, argv){
var cursor=1, tree_length=parse_tree.length, node_type='', arg, output=[], i, k, match, pad, pad_character, pad_length;
for (i=0; i < tree_length; i++){
node_type=get_type(parse_tree[i]);
if(node_type==='string'){
output.push(parse_tree[i]);
}
else if(node_type==='array'){
match=parse_tree[i];
if(match[2]){
arg=argv[cursor];
for (k=0; k < match[2].length; k++){
if(!arg.hasOwnProperty(match[2][k])){
throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
}
arg=arg[match[2][k]];
}}
else if(match[1]){
arg=argv[match[1]];
}else{
arg=argv[cursor++];
}
if(/[^s]/.test(match[8])&&(get_type(arg)!='number')){
throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
}
if(typeof arg=='undefined'||arg===null){
arg='';
}
switch (match[8]){
case 'b': arg=arg.toString(2); break;
case 'c': arg=String.fromCharCode(arg); break;
case 'd': arg=parseInt(arg, 10); break;
case 'e': arg=match[7] ? arg.toExponential(match[7]):arg.toExponential(); break;
case 'f': arg=match[7] ? parseFloat(arg).toFixed(match[7]):parseFloat(arg); break;
case 'o': arg=arg.toString(8); break;
case 's': arg=((arg=String(arg))&&match[7] ? arg.substring(0, match[7]):arg); break;
case 'u': arg=Math.abs(arg); break;
case 'x': arg=arg.toString(16); break;
case 'X': arg=arg.toString(16).toUpperCase(); break;
}
arg=(/[def]/.test(match[8])&&match[3]&&arg >=0 ? '+'+ arg:arg);
pad_character=match[4] ? match[4]=='0' ? '0':match[4].charAt(1):' ';
pad_length=match[6] - String(arg).length;
pad=match[6] ? str_repeat(pad_character, pad_length):'';
output.push(match[5] ? arg + pad:pad + arg);
}}
return output.join('');
};
str_format.cache={};
str_format.parse=function(fmt){
var _fmt=fmt, match=[], parse_tree=[], arg_names=0;
while (_fmt){
if((match=/^[^\x25]+/.exec(_fmt))!==null){
parse_tree.push(match[0]);
}
else if((match=/^\x25{2}/.exec(_fmt))!==null){
parse_tree.push('%');
}
else if((match=/^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt))!==null){
if(match[2]){
arg_names |=1;
var field_list=[], replacement_field=match[2], field_match=[];
if((field_match=/^([a-z_][a-z_\d]*)/i.exec(replacement_field))!==null){
field_list.push(field_match[1]);
while ((replacement_field=replacement_field.substring(field_match[0].length))!==''){
if((field_match=/^\.([a-z_][a-z_\d]*)/i.exec(replacement_field))!==null){
field_list.push(field_match[1]);
}
else if((field_match=/^\[(\d+)\]/.exec(replacement_field))!==null){
field_list.push(field_match[1]);
}else{
throw('[sprintf] huh?');
}}
}else{
throw('[sprintf] huh?');
}
match[2]=field_list;
}else{
arg_names |=2;
}
if(arg_names===3){
throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
}
parse_tree.push(match);
}else{
throw('[sprintf] huh?');
}
_fmt=_fmt.substring(match[0].length);
}
return parse_tree;
};
return str_format;
})();
var vsprintf=function(fmt, argv){
argv.unshift(fmt);
return sprintf.apply(null, argv);
};
Jed.parse_plural=function(plural_forms, n){
plural_forms=plural_forms.replace(/n/g, n);
return Jed.parse_expression(plural_forms);
};
Jed.sprintf=function(fmt, args){
if({}.toString.call(args)=='[object Array]'){
return vsprintf(fmt, [].slice.call(args));
}
return sprintf.apply(this, [].slice.call(arguments));
};
Jed.prototype.sprintf=function (){
return Jed.sprintf.apply(this, arguments);
};
Jed.PF={};
Jed.PF.parse=function(p){
var plural_str=Jed.PF.extractPluralExpr(p);
return Jed.PF.parser.parse.call(Jed.PF.parser, plural_str);
};
Jed.PF.compile=function(p){
function imply(val){
return (val===true ? 1:val ? val:0);
}
var ast=Jed.PF.parse(p);
return function(n){
return imply(Jed.PF.interpreter(ast)(n));
};};
Jed.PF.interpreter=function(ast){
return function(n){
var res;
switch(ast.type){
case 'GROUP':
return Jed.PF.interpreter(ast.expr)(n);
case 'TERNARY':
if(Jed.PF.interpreter(ast.expr)(n)){
return Jed.PF.interpreter(ast.truthy)(n);
}
return Jed.PF.interpreter(ast.falsey)(n);
case 'OR':
return Jed.PF.interpreter(ast.left)(n)||Jed.PF.interpreter(ast.right)(n);
case 'AND':
return Jed.PF.interpreter(ast.left)(n)&&Jed.PF.interpreter(ast.right)(n);
case 'LT':
return Jed.PF.interpreter(ast.left)(n) < Jed.PF.interpreter(ast.right)(n);
case 'GT':
return Jed.PF.interpreter(ast.left)(n) > Jed.PF.interpreter(ast.right)(n);
case 'LTE':
return Jed.PF.interpreter(ast.left)(n) <=Jed.PF.interpreter(ast.right)(n);
case 'GTE':
return Jed.PF.interpreter(ast.left)(n) >=Jed.PF.interpreter(ast.right)(n);
case 'EQ':
return Jed.PF.interpreter(ast.left)(n)==Jed.PF.interpreter(ast.right)(n);
case 'NEQ':
return Jed.PF.interpreter(ast.left)(n)!=Jed.PF.interpreter(ast.right)(n);
case 'MOD':
return Jed.PF.interpreter(ast.left)(n) % Jed.PF.interpreter(ast.right)(n);
case 'VAR':
return n;
case 'NUM':
return ast.val;
default:
throw new Error("Invalid Token found.");
}};};
Jed.PF.regexps={
TRIM_BEG: /^\s\s*/,
TRIM_END: /\s\s*$/,
HAS_SEMICOLON: /;\s*$/,
NPLURALS: /nplurals\=(\d+);/,
PLURAL: /plural\=(.*);/
};
Jed.PF.extractPluralExpr=function(p){
p=p.replace(Jed.PF.regexps.TRIM_BEG, '').replace(Jed.PF.regexps.TRIM_END, '');
if(! Jed.PF.regexps.HAS_SEMICOLON.test(p)){
p=p.concat(';');
}
var nplurals_matches=p.match(Jed.PF.regexps.NPLURALS),
res={},
plural_matches;
if(nplurals_matches.length > 1){
res.nplurals=nplurals_matches[1];
}else{
throw new Error('nplurals not found in plural_forms string: ' + p);
}
p=p.replace(Jed.PF.regexps.NPLURALS, "");
plural_matches=p.match(Jed.PF.regexps.PLURAL);
if(!(plural_matches&&plural_matches.length > 1)){
throw new Error('`plural` expression not found: ' + p);
}
return plural_matches[ 1 ];
};
Jed.PF.parser=(function(){
var parser={trace: function trace(){ },
yy: {},
symbols_: {"error":2,"expressions":3,"e":4,"EOF":5,"?":6,":":7,"||":8,"&&":9,"<":10,"<=":11,">":12,">=":13,"!=":14,"==":15,"%":16,"(":17,")":18,"n":19,"NUMBER":20,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"?",7:":",8:"||",9:"&&",10:"<",11:"<=",12:">",13:">=",14:"!=",15:"==",16:"%",17:"(",18:")",19:"n",20:"NUMBER"},
productions_: [0,[3,2],[4,5],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,1],[4,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$){
var $0=$$.length - 1;
switch (yystate){
case 1: return { type:'GROUP', expr: $$[$0-1] };
break;
case 2:this.$={ type: 'TERNARY', expr: $$[$0-4], truthy:$$[$0-2], falsey: $$[$0] };
break;
case 3:this.$={ type: "OR", left: $$[$0-2], right: $$[$0] };
break;
case 4:this.$={ type: "AND", left: $$[$0-2], right: $$[$0] };
break;
case 5:this.$={ type: 'LT', left: $$[$0-2], right: $$[$0] };
break;
case 6:this.$={ type: 'LTE', left: $$[$0-2], right: $$[$0] };
break;
case 7:this.$={ type: 'GT', left: $$[$0-2], right: $$[$0] };
break;
case 8:this.$={ type: 'GTE', left: $$[$0-2], right: $$[$0] };
break;
case 9:this.$={ type: 'NEQ', left: $$[$0-2], right: $$[$0] };
break;
case 10:this.$={ type: 'EQ', left: $$[$0-2], right: $$[$0] };
break;
case 11:this.$={ type: 'MOD', left: $$[$0-2], right: $$[$0] };
break;
case 12:this.$={ type: 'GROUP', expr: $$[$0-1] };
break;
case 13:this.$={ type: 'VAR' };
break;
case 14:this.$={ type: 'NUM', val: Number(yytext) };
break;
}},
table: [{3:1,4:2,17:[1,3],19:[1,4],20:[1,5]},{1:[3]},{5:[1,6],6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{4:17,17:[1,3],19:[1,4],20:[1,5]},{5:[2,13],6:[2,13],7:[2,13],8:[2,13],9:[2,13],10:[2,13],11:[2,13],12:[2,13],13:[2,13],14:[2,13],15:[2,13],16:[2,13],18:[2,13]},{5:[2,14],6:[2,14],7:[2,14],8:[2,14],9:[2,14],10:[2,14],11:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],18:[2,14]},{1:[2,1]},{4:18,17:[1,3],19:[1,4],20:[1,5]},{4:19,17:[1,3],19:[1,4],20:[1,5]},{4:20,17:[1,3],19:[1,4],20:[1,5]},{4:21,17:[1,3],19:[1,4],20:[1,5]},{4:22,17:[1,3],19:[1,4],20:[1,5]},{4:23,17:[1,3],19:[1,4],20:[1,5]},{4:24,17:[1,3],19:[1,4],20:[1,5]},{4:25,17:[1,3],19:[1,4],20:[1,5]},{4:26,17:[1,3],19:[1,4],20:[1,5]},{4:27,17:[1,3],19:[1,4],20:[1,5]},{6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[1,28]},{6:[1,7],7:[1,29],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{5:[2,3],6:[2,3],7:[2,3],8:[2,3],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,3]},{5:[2,4],6:[2,4],7:[2,4],8:[2,4],9:[2,4],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,4]},{5:[2,5],6:[2,5],7:[2,5],8:[2,5],9:[2,5],10:[2,5],11:[2,5],12:[2,5],13:[2,5],14:[2,5],15:[2,5],16:[1,16],18:[2,5]},{5:[2,6],6:[2,6],7:[2,6],8:[2,6],9:[2,6],10:[2,6],11:[2,6],12:[2,6],13:[2,6],14:[2,6],15:[2,6],16:[1,16],18:[2,6]},{5:[2,7],6:[2,7],7:[2,7],8:[2,7],9:[2,7],10:[2,7],11:[2,7],12:[2,7],13:[2,7],14:[2,7],15:[2,7],16:[1,16],18:[2,7]},{5:[2,8],6:[2,8],7:[2,8],8:[2,8],9:[2,8],10:[2,8],11:[2,8],12:[2,8],13:[2,8],14:[2,8],15:[2,8],16:[1,16],18:[2,8]},{5:[2,9],6:[2,9],7:[2,9],8:[2,9],9:[2,9],10:[2,9],11:[2,9],12:[2,9],13:[2,9],14:[2,9],15:[2,9],16:[1,16],18:[2,9]},{5:[2,10],6:[2,10],7:[2,10],8:[2,10],9:[2,10],10:[2,10],11:[2,10],12:[2,10],13:[2,10],14:[2,10],15:[2,10],16:[1,16],18:[2,10]},{5:[2,11],6:[2,11],7:[2,11],8:[2,11],9:[2,11],10:[2,11],11:[2,11],12:[2,11],13:[2,11],14:[2,11],15:[2,11],16:[2,11],18:[2,11]},{5:[2,12],6:[2,12],7:[2,12],8:[2,12],9:[2,12],10:[2,12],11:[2,12],12:[2,12],13:[2,12],14:[2,12],15:[2,12],16:[2,12],18:[2,12]},{4:30,17:[1,3],19:[1,4],20:[1,5]},{5:[2,2],6:[1,7],7:[2,2],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,2]}],
defaultActions: {6:[2,1]},
parseError: function parseError(str, hash){
throw new Error(str);
},
parse: function parse(input){
var self=this,
stack=[0],
vstack=[null],
lstack=[],
table=this.table,
yytext='',
yylineno=0,
yyleng=0,
recovering=0,
TERROR=2,
EOF=1;
this.lexer.setInput(input);
this.lexer.yy=this.yy;
this.yy.lexer=this.lexer;
if(typeof this.lexer.yylloc=='undefined')
this.lexer.yylloc={};
var yyloc=this.lexer.yylloc;
lstack.push(yyloc);
if(typeof this.yy.parseError==='function')
this.parseError=this.yy.parseError;
function popStack (n){
stack.length=stack.length - 2*n;
vstack.length=vstack.length - n;
lstack.length=lstack.length - n;
}
function lex(){
var token;
token=self.lexer.lex()||1;
if(typeof token!=='number'){
token=self.symbols_[token]||token;
}
return token;
}
var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
while (true){
state=stack[stack.length-1];
if(this.defaultActions[state]){
action=this.defaultActions[state];
}else{
if(symbol==null)
symbol=lex();
action=table[state]&&table[state][symbol];
}
_handle_error:
if(typeof action==='undefined'||!action.length||!action[0]){
if(!recovering){
expected=[];
for (p in table[state]) if(this.terminals_[p]&&p > 2){
expected.push("'"+this.terminals_[p]+"'");
}
var errStr='';
if(this.lexer.showPosition){
errStr='Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + this.terminals_[symbol]+ "'";
}else{
errStr='Parse error on line '+(yylineno+1)+": Unexpected " +
(symbol==1  ? "end of input" :
("'"+(this.terminals_[symbol]||symbol)+"'"));
}
this.parseError(errStr,
{text: this.lexer.match, token: this.terminals_[symbol]||symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
}
if(recovering==3){
if(symbol==EOF){
throw new Error(errStr||'Parsing halted.');
}
yyleng=this.lexer.yyleng;
yytext=this.lexer.yytext;
yylineno=this.lexer.yylineno;
yyloc=this.lexer.yylloc;
symbol=lex();
}
while (1){
if((TERROR.toString()) in table[state]){
break;
}
if(state==0){
throw new Error(errStr||'Parsing halted.');
}
popStack(1);
state=stack[stack.length-1];
}
preErrorSymbol=symbol;
symbol=TERROR;
state=stack[stack.length-1];
action=table[state]&&table[state][TERROR];
recovering=3;
}
if(action[0] instanceof Array&&action.length > 1){
throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
}
switch (action[0]){
case 1:
stack.push(symbol);
vstack.push(this.lexer.yytext);
lstack.push(this.lexer.yylloc);
stack.push(action[1]);
symbol=null;
if(!preErrorSymbol){
yyleng=this.lexer.yyleng;
yytext=this.lexer.yytext;
yylineno=this.lexer.yylineno;
yyloc=this.lexer.yylloc;
if(recovering > 0)
recovering--;
}else{
symbol=preErrorSymbol;
preErrorSymbol=null;
}
break;
case 2:
len=this.productions_[action[1]][1];
yyval.$=vstack[vstack.length-len];
yyval._$={
first_line: lstack[lstack.length-(len||1)].first_line,
last_line: lstack[lstack.length-1].last_line,
first_column: lstack[lstack.length-(len||1)].first_column,
last_column: lstack[lstack.length-1].last_column
};
r=this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
if(typeof r!=='undefined'){
return r;
}
if(len){
stack=stack.slice(0,-1*len*2);
vstack=vstack.slice(0, -1*len);
lstack=lstack.slice(0, -1*len);
}
stack.push(this.productions_[action[1]][0]);
vstack.push(yyval.$);
lstack.push(yyval._$);
newState=table[stack[stack.length-2]][stack[stack.length-1]];
stack.push(newState);
break;
case 3:
return true;
}}
return true;
}};
var lexer=(function(){
var lexer=({EOF:1,
parseError:function parseError(str, hash){
if(this.yy.parseError){
this.yy.parseError(str, hash);
}else{
throw new Error(str);
}},
setInput:function (input){
this._input=input;
this._more=this._less=this.done=false;
this.yylineno=this.yyleng=0;
this.yytext=this.matched=this.match='';
this.conditionStack=['INITIAL'];
this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};
return this;
},
input:function (){
var ch=this._input[0];
this.yytext+=ch;
this.yyleng++;
this.match+=ch;
this.matched+=ch;
var lines=ch.match(/\n/);
if(lines) this.yylineno++;
this._input=this._input.slice(1);
return ch;
},
unput:function (ch){
this._input=ch + this._input;
return this;
},
more:function (){
this._more=true;
return this;
},
pastInput:function (){
var past=this.matched.substr(0, this.matched.length - this.match.length);
return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
},
upcomingInput:function (){
var next=this.match;
if(next.length < 20){
next +=this._input.substr(0, 20-next.length);
}
return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
},
showPosition:function (){
var pre=this.pastInput();
var c=new Array(pre.length + 1).join("-");
return pre + this.upcomingInput() + "\n" + c+"^";
},
next:function (){
if(this.done){
return this.EOF;
}
if(!this._input) this.done=true;
var token,
match,
col,
lines;
if(!this._more){
this.yytext='';
this.match='';
}
var rules=this._currentRules();
for (var i=0;i < rules.length; i++){
match=this._input.match(this.rules[rules[i]]);
if(match){
lines=match[0].match(/\n.*/g);
if(lines) this.yylineno +=lines.length;
this.yylloc={first_line: this.yylloc.last_line,
last_line: this.yylineno+1,
first_column: this.yylloc.last_column,
last_column: lines ? lines[lines.length-1].length-1:this.yylloc.last_column + match[0].length}
this.yytext +=match[0];
this.match +=match[0];
this.matches=match;
this.yyleng=this.yytext.length;
this._more=false;
this._input=this._input.slice(match[0].length);
this.matched +=match[0];
token=this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
if(token) return token;
else return;
}}
if(this._input===""){
return this.EOF;
}else{
this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
{text: "", token: null, line: this.yylineno});
}},
lex:function lex(){
var r=this.next();
if(typeof r!=='undefined'){
return r;
}else{
return this.lex();
}},
begin:function begin(condition){
this.conditionStack.push(condition);
},
popState:function popState(){
return this.conditionStack.pop();
},
_currentRules:function _currentRules(){
return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
},
topState:function (){
return this.conditionStack[this.conditionStack.length-2];
},
pushState:function begin(condition){
this.begin(condition);
}});
lexer.performAction=function anonymous(yy,yy_,$avoiding_name_collisions,YY_START){
var YYSTATE=YY_START;
switch($avoiding_name_collisions){
case 0:
break;
case 1:return 20
break;
case 2:return 19
break;
case 3:return 8
break;
case 4:return 9
break;
case 5:return 6
break;
case 6:return 7
break;
case 7:return 11
break;
case 8:return 13
break;
case 9:return 10
break;
case 10:return 12
break;
case 11:return 14
break;
case 12:return 15
break;
case 13:return 16
break;
case 14:return 17
break;
case 15:return 18
break;
case 16:return 5
break;
case 17:return 'INVALID'
break;
}};
lexer.rules=[/^\s+/,/^[0-9]+(\.[0-9]+)?\b/,/^n\b/,/^\|\|/,/^&&/,/^\?/,/^:/,/^<=/,/^>=/,/^</,/^>/,/^!=/,/^==/,/^%/,/^\(/,/^\)/,/^$/,/^./];
lexer.conditions={"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"inclusive":true}};return lexer;})()
parser.lexer=lexer;
return parser;
})();
if(typeof exports!=='undefined'){
if(typeof module!=='undefined'&&module.exports){
exports=module.exports=Jed;
}
exports.Jed=Jed;
}else{
if(typeof define==='function'&&define.amd){
define(function(){
return Jed;
});
}
root['Jed']=Jed;
}})(this);
(function($){
var Dokan_Vendor_Registration={
init: function(){
var form=$('form.register');
$('.user-role input[type=radio]', form).on('change', this.showSellerForm);
$('.tc_check_box', form).on('click', this.onTOC);
$('#shop-phone', form).keydown(this.ensurePhoneNumber);
$('#company-name', form).on('focusout', this.generateSlugFromCompany);
$('#seller-url', form).keydown(this.constrainSlug);
$('#seller-url', form).keyup(this.renderUrl);
$('#seller-url', form).on('focusout', this.checkSlugAvailability);
this.validationLocalized();
},
validate: function(self){
$('form.register').validate({
errorPlacement: function(error, element){
var form_group=$(element).closest('.form-group');
form_group.addClass('has-error').append(error);
},
success: function(label, element){
$(element).closest('.form-group').removeClass('has-error');
},
submitHandler: function(form){
form.submit();
}});
},
showSellerForm: function(){
var value=$(this).val();
if(value==='seller'){
$('.show_if_seller').find('input, select').removeAttr('disabled');
$('.show_if_seller').slideDown();
if($('.tc_check_box').length > 0){
$('button[name=register]').attr('disabled','disabled');
}}else{
$('.show_if_seller').find('input, select').attr('disabled', 'disabled');
$('.show_if_seller').slideUp();
if($('.tc_check_box').length > 0){
$('button[name=register]').removeAttr('disabled');
}}
},
onTOC: function(){
var chk_value=$(this).val();
if($(this).prop("checked")){
$('input[name=register]').removeAttr('disabled');
$('button[name=register]').removeAttr('disabled');
$('input[name=dokan_migration]').removeAttr('disabled');
}else{
$('input[name=register]').attr('disabled', 'disabled');
$('button[name=register]').attr('disabled', 'disabled');
$('input[name=dokan_migration]').attr('disabled', 'disabled');
}},
ensurePhoneNumber: function(e){
if($.inArray(e.keyCode, [46, 8, 9, 27, 13, 91, 107, 109, 110, 187, 189, 190])!==-1 ||
(e.keyCode==65&&e.ctrlKey===true) ||
(e.keyCode >=35&&e.keyCode <=39)){
return;
}
if((e.shiftKey||(e.keyCode < 48||e.keyCode > 57))&&(e.keyCode < 96||e.keyCode > 105)){
e.preventDefault();
}},
generateSlugFromCompany: function(){
var value=getSlug($(this).val());
$('#seller-url').val(value);
$('#url-alart').text(value);
$('#seller-url').focus();
},
constrainSlug: function(e){
var text=$(this).val();
if($.inArray(e.keyCode, [46, 8, 9, 27, 13, 91, 109, 110, 173, 189, 190])!==-1 ||
(e.keyCode==65&&e.ctrlKey===true) ||
(e.keyCode >=35&&e.keyCode <=39)){
return;
}
if((e.shiftKey||(e.keyCode < 65||e.keyCode > 90)&&(e.keyCode < 48||e.keyCode > 57))&&(e.keyCode < 96||e.keyCode > 105)){
e.preventDefault();
}},
checkSlugAvailability: function(){
var self=$(this),
data={
action:'shop_url',
url_slug:self.val(),
_nonce:dokan.nonce,
};
if(self.val()===''){
return;
}
var row=self.closest('.form-row');
row.block({ message: null, overlayCSS: { background: '#fff url(' + dokan.ajax_loader + ') no-repeat center', opacity: 0.6 }});
$.post(dokan.ajaxurl, data, function(resp){
if(resp.success===true){
$('#url-alart').removeClass('text-danger').addClass('text-success');
$('#url-alart-mgs').removeClass('text-danger').addClass('text-success').text(dokan.seller.available);
}else{
$('#url-alart').removeClass('text-success').addClass('text-danger');
$('#url-alart-mgs').removeClass('text-success').addClass('text-danger').text(dokan.seller.notAvailable);
}
row.unblock();
});
},
renderUrl: function(){
$('#url-alart').text($(this).val());
},
validationLocalized: function(){
var dokan_messages=DokanValidateMsg;
dokan_messages.maxlength=$.validator.format(dokan_messages.maxlength_msg);
dokan_messages.minlength=$.validator.format(dokan_messages.minlength_msg);
dokan_messages.rangelength=$.validator.format(dokan_messages.rangelength_msg);
dokan_messages.range=$.validator.format(dokan_messages.range_msg);
dokan_messages.max=$.validator.format(dokan_messages.max_msg);
dokan_messages.min=$.validator.format(dokan_messages.min_msg);
$.validator.messages=dokan_messages;
}};
$(function(){
Dokan_Vendor_Registration.init();
$('.show_if_seller').find('input, select').attr('disabled', 'disabled');
var shouldTrigger=$('.woocommerce ul').hasClass('woocommerce-error')&&! $('.show_if_seller').is(':hidden');
if(shouldTrigger){
var form=$('form.register');
$('.user-role input[type=radio]', form).trigger('change');
}
if($('.tc_check_box').length > 0){
$('input[name=dokan_migration]').attr('disabled', 'disabled');
$('input[name=register]').attr('disabled', 'disabled');
}});
})(jQuery);
!function(Se){var ze=Math.abs,ke=Math.max,Ce=Math.min,Ae=Math.round;function We(){return Se("<div/>")}Se.imgAreaSelect=function(o,n){var t,i,r,c,d,a,s,u,l,h,f,m,e,p,y,g,v,b,x,w,S,z,k,C,A,W,I,K,P,N=Se(o),H=We(),M=We(),E=We().add(We()).add(We()).add(We()),O=We().add(We()).add(We()).add(We()),T=Se([]),L={left:0,top:0},j={left:0,top:0},D=0,R="absolute",X={x1:0,y1:0,x2:0,y2:0,width:0,height:0},Y=document.documentElement,$=navigator.userAgent;function q(e){return e+L.left-j.left}function B(e){return e+L.top-j.top}function Q(e){return e-L.left+j.left}function F(e){return e-L.top+j.top}function G(e){return ke(e.pageX||0,U(e).x)-j.left}function J(e){return ke(e.pageY||0,U(e).y)-j.top}function U(e){var t=e.originalEvent||{};return t.touches&&t.touches.length?{x:t.touches[0].pageX,y:t.touches[0].pageY}:{x:0,y:0}}function V(e){var t=e||h,o=e||f;return{x1:Ae(X.x1*t),y1:Ae(X.y1*o),x2:Ae(X.x2*t),y2:Ae(X.y2*o),width:Ae(X.x2*t)-Ae(X.x1*t),height:Ae(X.y2*o)-Ae(X.y1*o)}}function Z(e,t,o,i,s){var n=s||h,r=s||f;(X={x1:Ae(e/n||0),y1:Ae(t/r||0),x2:Ae(o/n||0),y2:Ae(i/r||0)}).width=X.x2-X.x1,X.height=X.y2-X.y1}function _(){t&&N.width()&&(L={left:Ae(N.offset().left),top:Ae(N.offset().top)},d=N.innerWidth(),a=N.innerHeight(),L.top+=N.outerHeight()-a>>1,L.left+=N.outerWidth()-d>>1,e=Ae(n.minWidth/h)||0,p=Ae(n.minHeight/f)||0,y=Ae(Ce(n.maxWidth/h||1<<24,d)),g=Ae(Ce(n.maxHeight/f||1<<24,a)),"1.3.2"!=Se().jquery||"fixed"!=R||Y.getBoundingClientRect||(L.top+=ke(document.body.scrollTop,Y.scrollTop),L.left+=ke(document.body.scrollLeft,Y.scrollLeft)),j=/absolute|relative/.test(s.css("position"))?{left:Ae(s.offset().left)-s.scrollLeft(),top:Ae(s.offset().top)-s.scrollTop()}:"fixed"==R?{left:Se(document).scrollLeft(),top:Se(document).scrollTop()}:{left:0,top:0},r=q(0),c=B(0),(X.x2>d||X.y2>a)&&ce())}function ee(e){if(b){switch(H.css({left:q(X.x1),top:B(X.y1)}).add(M).width(I=X.width).height(K=X.height),M.add(E).add(T).css({left:0,top:0}),E.width(ke(I-E.outerWidth()+E.innerWidth(),0)).height(ke(K-E.outerHeight()+E.innerHeight(),0)),Se(O[0]).css({left:r,top:c,width:X.x1,height:a}),Se(O[1]).css({left:r+X.x1,top:c,width:I,height:X.y1}),Se(O[2]).css({left:r+X.x2,top:c,width:d-X.x2,height:a}),Se(O[3]).css({left:r+X.x1,top:c+X.y2,width:I,height:a-X.y2}),I-=T.outerWidth(),K-=T.outerHeight(),T.length){case 8:Se(T[4]).css({left:I>>1}),Se(T[5]).css({left:I,top:K>>1}),Se(T[6]).css({left:I>>1,top:K}),Se(T[7]).css({top:K>>1});case 4:T.slice(1,3).css({left:I}),T.slice(2,4).css({top:K})}!1!==e&&(Se.imgAreaSelect.onKeyPress!=ye&&Se(document).unbind(Se.imgAreaSelect.keyPress,Se.imgAreaSelect.onKeyPress),n.keys&&Se(document)[Se.imgAreaSelect.keyPress](Se.imgAreaSelect.onKeyPress=ye)),be&&E.outerWidth()-E.innerWidth()==2&&(E.css("margin",0),setTimeout(function(){E.css("margin","auto")},0))}}function te(e){_(),ee(e),x=q(X.x1),w=B(X.y1),S=q(X.x2),z=B(X.y2)}function oe(e,t){n.fadeSpeed?e.fadeOut(n.fadeSpeed,t):e.hide()}function ie(e){var t=Q(G(e))-X.x1,o=F(J(e))-X.y1;P||(_(),P=!0,H.one("mouseout",function(){P=!1})),m="",n.resizable&&(o<=n.resizeMargin?m="n":o>=X.height-n.resizeMargin&&(m="s"),t<=n.resizeMargin?m+="w":t>=X.width-n.resizeMargin&&(m+="e")),H.css("cursor",m?m+"-resize":n.movable?"move":""),i&&i.toggle()}function se(e){Se("body").css("cursor",""),!n.autoHide&&X.width*X.height!=0||oe(H.add(O),function(){Se(this).hide()}),Se(document).off("mousemove touchmove",de),H.on("mousemove touchmove",ie),n.onSelectEnd(o,V())}function ne(e){return"mousedown"==e.type&&1!=e.which||(ie(e),_(),m?(Se("body").css("cursor",m+"-resize"),x=q(X[/w/.test(m)?"x2":"x1"]),w=B(X[/n/.test(m)?"y2":"y1"]),Se(document).on("mousemove touchmove",de).one("mouseup touchend",se),H.off("mousemove touchmove",ie)):n.movable?(u=r+X.x1-G(e),l=c+X.y1-J(e),H.off("mousemove touchmove",ie),Se(document).on("mousemove touchmove",ue).one("mouseup touchend",function(){n.onSelectEnd(o,V()),Se(document).off("mousemove touchmove",ue),H.on("mousemove touchmove",ie)})):N.mousedown(e)),!1}function re(e){v&&(e?(S=ke(r,Ce(r+d,x+ze(z-w)*v*(x<S||-1))),z=Ae(ke(c,Ce(c+a,w+ze(S-x)/v*(w<z||-1)))),S=Ae(S)):(z=ke(c,Ce(c+a,w+ze(S-x)/v*(w<z||-1))),S=Ae(ke(r,Ce(r+d,x+ze(z-w)*v*(x<S||-1)))),z=Ae(z)))}function ce(){x=Ce(x,r+d),w=Ce(w,c+a),ze(S-x)<e&&((S=x-e*(S<x||-1))<r?x=r+e:r+d<S&&(x=r+d-e)),ze(z-w)<p&&((z=w-p*(z<w||-1))<c?w=c+p:c+a<z&&(w=c+a-p)),S=ke(r,Ce(S,r+d)),z=ke(c,Ce(z,c+a)),re(ze(S-x)<ze(z-w)*v),ze(S-x)>y&&(S=x-y*(S<x||-1),re()),ze(z-w)>g&&(z=w-g*(z<w||-1),re(!0)),X={x1:Q(Ce(x,S)),x2:Q(ke(x,S)),y1:F(Ce(w,z)),y2:F(ke(w,z)),width:ze(S-x),height:ze(z-w)},ee(),n.onSelectChange(o,V())}function de(e){return S=/w|e|^$/.test(m)||v?G(e):q(X.x2),z=/n|s|^$/.test(m)||v?J(e):B(X.y2),ce(),!1}function ae(e,t){S=(x=e)+X.width,z=(w=t)+X.height,Se.extend(X,{x1:Q(x),y1:F(w),x2:Q(S),y2:F(z)}),ee(),n.onSelectChange(o,V())}function ue(e){return x=ke(r,Ce(u+G(e),r+d-X.width)),w=ke(c,Ce(l+J(e),c+a-X.height)),ae(x,w),e.preventDefault(),!1}function le(){Se(document).off("mousemove touchmove",le),_(),S=x,z=w,ce(),m="",O.is(":visible")||H.add(O).hide().fadeIn(n.fadeSpeed||0),b=!0,Se(document).off("mouseup touchend",he).on("mousemove touchmove",de).one("mouseup touchend",se),H.off("mousemove touchmove",ie),n.onSelectStart(o,V())}function he(){Se(document).off("mousemove touchmove",le).off("mouseup touchend",he),oe(H.add(O)),Z(Q(x),F(w),Q(x),F(w)),this instanceof Se.imgAreaSelect||(n.onSelectChange(o,V()),n.onSelectEnd(o,V()))}function fe(e){return 1<e.which||O.is(":animated")||(_(),u=x=G(e),l=w=J(e),Se(document).on({"mousemove touchmove":le,"mouseup touchend":he})),!1}function me(){te(!1)}function pe(){t=!0,ve(n=Se.extend({classPrefix:"imgareaselect",movable:!0,parent:"body",resizable:!0,resizeMargin:10,onInit:function(){},onSelectStart:function(){},onSelectChange:function(){},onSelectEnd:function(){}},n)),H.add(O).css({visibility:""}),n.show&&(b=!0,_(),ee(),H.add(O).hide().fadeIn(n.fadeSpeed||0)),setTimeout(function(){n.onInit(o,V())},0)}var ye=function(e){var t,o,i=n.keys,s=e.keyCode;if(t=isNaN(i.alt)||!e.altKey&&!e.originalEvent.altKey?!isNaN(i.ctrl)&&e.ctrlKey?i.ctrl:!isNaN(i.shift)&&e.shiftKey?i.shift:isNaN(i.arrows)?10:i.arrows:i.alt,"resize"==i.arrows||"resize"==i.shift&&e.shiftKey||"resize"==i.ctrl&&e.ctrlKey||"resize"==i.alt&&(e.altKey||e.originalEvent.altKey)){switch(s){case 37:t=-t;case 39:o=ke(x,S),x=Ce(x,S),S=ke(o+t,x),re();break;case 38:t=-t;case 40:o=ke(w,z),w=Ce(w,z),z=ke(o+t,w),re(!0);break;default:return}ce()}else switch(x=Ce(x,S),w=Ce(w,z),s){case 37:ae(ke(x-t,r),w);break;case 38:ae(x,ke(w-t,c));break;case 39:ae(x+Ce(t,d-Q(S)),w);break;case 40:ae(x,w+Ce(t,a-F(z)));break;default:return}return!1};function ge(e,t){for(var o in t)void 0!==n[o]&&e.css(t[o],n[o])}function ve(e){if(e.parent&&(s=Se(e.parent)).append(H.add(O)),Se.extend(n,e),_(),null!=e.handles){for(T.remove(),T=Se([]),A=e.handles?"corners"==e.handles?4:8:0;A--;)T=T.add(We());T.addClass(n.classPrefix+"-handle").css({position:"absolute",fontSize:0,zIndex:D+1||1}),0<=!parseInt(T.css("width"))&&T.width(5).height(5),(W=n.borderWidth)&&T.css({borderWidth:W,borderStyle:"solid"}),ge(T,{borderColor1:"border-color",borderColor2:"background-color",borderOpacity:"opacity"})}for(h=n.imageWidth/d||1,f=n.imageHeight/a||1,null!=e.x1&&(Z(e.x1,e.y1,e.x2,e.y2),e.show=!e.hide),e.keys&&(n.keys=Se.extend({shift:1,ctrl:"resize"},e.keys)),O.addClass(n.classPrefix+"-outer"),M.addClass(n.classPrefix+"-selection"),A=0;A++<4;)Se(E[A-1]).addClass(n.classPrefix+"-border"+A);ge(M,{selectionColor:"background-color",selectionOpacity:"opacity"}),ge(E,{borderOpacity:"opacity",borderWidth:"border-width"}),ge(O,{outerColor:"background-color",outerOpacity:"opacity"}),(W=n.borderColor1)&&Se(E[0]).css({borderStyle:"solid",borderColor:W}),(W=n.borderColor2)&&Se(E[1]).css({borderStyle:"dashed",borderColor:W}),H.append(M.add(E).add(i)).append(T),be&&((W=(O.css("filter")||"").match(/opacity=(\d+)/))&&O.css("opacity",W[1]/100),(W=(E.css("filter")||"").match(/opacity=(\d+)/))&&E.css("opacity",W[1]/100)),e.hide?oe(H.add(O)):e.show&&t&&(b=!0,H.add(O).fadeIn(n.fadeSpeed||0),te()),v=(C=(n.aspectRatio||"").split(/:/))[0]/C[1],N.add(O).unbind("mousedown",fe),n.disable||!1===n.enable?(H.off({"mousemove touchmove":ie,"mousedown touchstart":ne}),Se(window).off("resize",me)):(!n.enable&&!1!==n.disable||((n.resizable||n.movable)&&H.on({"mousemove touchmove":ie,"mousedown touchstart":ne}),Se(window).resize(me)),n.persistent||N.add(O).on("mousedown touchstart",fe)),n.enable=n.disable=void 0}this.remove=function(){ve({disable:!0}),H.add(O).remove()},this.getOptions=function(){return n},this.setOptions=ve,this.getSelection=V,this.setSelection=Z,this.cancelSelection=he,this.update=te;var be=(/msie ([\w.]+)/i.exec($)||[])[1],xe=/opera/i.test($),we=/webkit/i.test($)&&!/chrome/i.test($);for(k=N;k.length;)D=ke(D,isNaN(k.css("z-index"))?D:k.css("z-index")),"fixed"==k.css("position")&&(R="fixed"),k=k.parent(":not(body)");D=n.zIndex||D,be&&N.attr("unselectable","on"),Se.imgAreaSelect.keyPress=be||we?"keydown":"keypress",xe&&(i=We().css({width:"100%",height:"100%",position:"absolute",zIndex:D+2||2})),H.add(O).css({visibility:"hidden",position:R,overflow:"hidden",zIndex:D||"0"}),H.css({zIndex:D+2||2}),M.add(E).css({position:"absolute",fontSize:0}),o.complete||"complete"==o.readyState||!N.is("img")?pe():N.one("load",pe),!t&&be&&7<=be&&(o.src=o.src)},Se.fn.imgAreaSelect=function(e){return e=e||{},this.each(function(){Se(this).data("imgAreaSelect")?e.remove?(Se(this).data("imgAreaSelect").remove(),Se(this).removeData("imgAreaSelect")):Se(this).data("imgAreaSelect").setOptions(e):e.remove||(void 0===e.enable&&void 0===e.disable&&(e.enable=!0),Se(this).data("imgAreaSelect",new Se.imgAreaSelect(this,e)))}),e.instance?Se(this).data("imgAreaSelect"):this}}(jQuery);
(function(){function r(){}var n=this,t=n._,e=Array.prototype,o=Object.prototype,u=Function.prototype,i=e.push,c=e.slice,s=o.toString,a=o.hasOwnProperty,f=Array.isArray,l=Object.keys,p=u.bind,h=Object.create,v=function(n){return n instanceof v?n:this instanceof v?void(this._wrapped=n):new v(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=v),exports._=v):n._=v,v.VERSION="1.8.3";var y=function(u,i,n){if(void 0===i)return u;switch(null==n?3:n){case 1:return function(n){return u.call(i,n)};case 2:return function(n,t){return u.call(i,n,t)};case 3:return function(n,t,r){return u.call(i,n,t,r)};case 4:return function(n,t,r,e){return u.call(i,n,t,r,e)}}return function(){return u.apply(i,arguments)}},d=function(n,t,r){return null==n?v.identity:v.isFunction(n)?y(n,t,r):v.isObject(n)?v.matcher(n):v.property(n)};v.iteratee=function(n,t){return d(n,t,1/0)};function g(c,f){return function(n){var t=arguments.length;if(t<2||null==n)return n;for(var r=1;r<t;r++)for(var e=arguments[r],u=c(e),i=u.length,o=0;o<i;o++){var a=u[o];f&&void 0!==n[a]||(n[a]=e[a])}return n}}function m(n){if(!v.isObject(n))return{};if(h)return h(n);r.prototype=n;var t=new r;return r.prototype=null,t}function b(t){return function(n){return null==n?void 0:n[t]}}var x=Math.pow(2,53)-1,_=b("length"),j=function(n){var t=_(n);return"number"==typeof t&&0<=t&&t<=x};function w(a){return function(n,t,r,e){t=y(t,e,4);var u=!j(n)&&v.keys(n),i=(u||n).length,o=0<a?0:i-1;return arguments.length<3&&(r=n[u?u[o]:o],o+=a),function(n,t,r,e,u,i){for(;0<=u&&u<i;u+=a){var o=e?e[u]:u;r=t(r,n[o],o,n)}return r}(n,t,r,u,o,i)}}v.each=v.forEach=function(n,t,r){var e,u;if(t=y(t,r),j(n))for(e=0,u=n.length;e<u;e++)t(n[e],e,n);else{var i=v.keys(n);for(e=0,u=i.length;e<u;e++)t(n[i[e]],i[e],n)}return n},v.map=v.collect=function(n,t,r){t=d(t,r);for(var e=!j(n)&&v.keys(n),u=(e||n).length,i=Array(u),o=0;o<u;o++){var a=e?e[o]:o;i[o]=t(n[a],a,n)}return i},v.reduce=v.foldl=v.inject=w(1),v.reduceRight=v.foldr=w(-1),v.find=v.detect=function(n,t,r){var e;if(void 0!==(e=j(n)?v.findIndex(n,t,r):v.findKey(n,t,r))&&-1!==e)return n[e]},v.filter=v.select=function(n,e,t){var u=[];return e=d(e,t),v.each(n,function(n,t,r){e(n,t,r)&&u.push(n)}),u},v.reject=function(n,t,r){return v.filter(n,v.negate(d(t)),r)},v.every=v.all=function(n,t,r){t=d(t,r);for(var e=!j(n)&&v.keys(n),u=(e||n).length,i=0;i<u;i++){var o=e?e[i]:i;if(!t(n[o],o,n))return!1}return!0},v.some=v.any=function(n,t,r){t=d(t,r);for(var e=!j(n)&&v.keys(n),u=(e||n).length,i=0;i<u;i++){var o=e?e[i]:i;if(t(n[o],o,n))return!0}return!1},v.contains=v.includes=v.include=function(n,t,r,e){return j(n)||(n=v.values(n)),"number"==typeof r&&!e||(r=0),0<=v.indexOf(n,t,r)},v.invoke=function(n,r){var e=c.call(arguments,2),u=v.isFunction(r);return v.map(n,function(n){var t=u?r:n[r];return null==t?t:t.apply(n,e)})},v.pluck=function(n,t){return v.map(n,v.property(t))},v.where=function(n,t){return v.filter(n,v.matcher(t))},v.findWhere=function(n,t){return v.find(n,v.matcher(t))},v.max=function(n,e,t){var r,u,i=-1/0,o=-1/0;if(null==e&&null!=n)for(var a=0,c=(n=j(n)?n:v.values(n)).length;a<c;a++)r=n[a],i<r&&(i=r);else e=d(e,t),v.each(n,function(n,t,r){u=e(n,t,r),(o<u||u===-1/0&&i===-1/0)&&(i=n,o=u)});return i},v.min=function(n,e,t){var r,u,i=1/0,o=1/0;if(null==e&&null!=n)for(var a=0,c=(n=j(n)?n:v.values(n)).length;a<c;a++)(r=n[a])<i&&(i=r);else e=d(e,t),v.each(n,function(n,t,r){((u=e(n,t,r))<o||u===1/0&&i===1/0)&&(i=n,o=u)});return i},v.shuffle=function(n){for(var t,r=j(n)?n:v.values(n),e=r.length,u=Array(e),i=0;i<e;i++)(t=v.random(0,i))!==i&&(u[i]=u[t]),u[t]=r[i];return u},v.sample=function(n,t,r){return null==t||r?(j(n)||(n=v.values(n)),n[v.random(n.length-1)]):v.shuffle(n).slice(0,Math.max(0,t))},v.sortBy=function(n,e,t){return e=d(e,t),v.pluck(v.map(n,function(n,t,r){return{value:n,index:t,criteria:e(n,t,r)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(e<r||void 0===r)return 1;if(r<e||void 0===e)return-1}return n.index-t.index}),"value")};function A(o){return function(e,u,n){var i={};return u=d(u,n),v.each(e,function(n,t){var r=u(n,t,e);o(i,n,r)}),i}}v.groupBy=A(function(n,t,r){v.has(n,r)?n[r].push(t):n[r]=[t]}),v.indexBy=A(function(n,t,r){n[r]=t}),v.countBy=A(function(n,t,r){v.has(n,r)?n[r]++:n[r]=1}),v.toArray=function(n){return n?v.isArray(n)?c.call(n):j(n)?v.map(n,v.identity):v.values(n):[]},v.size=function(n){return null==n?0:j(n)?n.length:v.keys(n).length},v.partition=function(n,e,t){e=d(e,t);var u=[],i=[];return v.each(n,function(n,t,r){(e(n,t,r)?u:i).push(n)}),[u,i]},v.first=v.head=v.take=function(n,t,r){if(null!=n)return null==t||r?n[0]:v.initial(n,n.length-t)},v.initial=function(n,t,r){return c.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},v.last=function(n,t,r){if(null!=n)return null==t||r?n[n.length-1]:v.rest(n,Math.max(0,n.length-t))},v.rest=v.tail=v.drop=function(n,t,r){return c.call(n,null==t||r?1:t)},v.compact=function(n){return v.filter(n,v.identity)};var O=function(n,t,r,e){for(var u=[],i=0,o=e||0,a=_(n);o<a;o++){var c=n[o];if(j(c)&&(v.isArray(c)||v.isArguments(c))){t||(c=O(c,t,r));var f=0,l=c.length;for(u.length+=l;f<l;)u[i++]=c[f++]}else r||(u[i++]=c)}return u};function k(i){return function(n,t,r){t=d(t,r);for(var e=_(n),u=0<i?0:e-1;0<=u&&u<e;u+=i)if(t(n[u],u,n))return u;return-1}}function F(i,o,a){return function(n,t,r){var e=0,u=_(n);if("number"==typeof r)0<i?e=0<=r?r:Math.max(r+u,e):u=0<=r?Math.min(r+1,u):r+u+1;else if(a&&r&&u)return n[r=a(n,t)]===t?r:-1;if(t!=t)return 0<=(r=o(c.call(n,e,u),v.isNaN))?r+e:-1;for(r=0<i?e:u-1;0<=r&&r<u;r+=i)if(n[r]===t)return r;return-1}}v.flatten=function(n,t){return O(n,t,!1)},v.without=function(n){return v.difference(n,c.call(arguments,1))},v.uniq=v.unique=function(n,t,r,e){v.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=d(r,e));for(var u=[],i=[],o=0,a=_(n);o<a;o++){var c=n[o],f=r?r(c,o,n):c;t?(o&&i===f||u.push(c),i=f):r?v.contains(i,f)||(i.push(f),u.push(c)):v.contains(u,c)||u.push(c)}return u},v.union=function(){return v.uniq(O(arguments,!0,!0))},v.intersection=function(n){for(var t=[],r=arguments.length,e=0,u=_(n);e<u;e++){var i=n[e];if(!v.contains(t,i)){for(var o=1;o<r&&v.contains(arguments[o],i);o++);o===r&&t.push(i)}}return t},v.difference=function(n){var t=O(arguments,!0,!0,1);return v.filter(n,function(n){return!v.contains(t,n)})},v.zip=function(){return v.unzip(arguments)},v.unzip=function(n){for(var t=n&&v.max(n,_).length||0,r=Array(t),e=0;e<t;e++)r[e]=v.pluck(n,e);return r},v.object=function(n,t){for(var r={},e=0,u=_(n);e<u;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},v.findIndex=k(1),v.findLastIndex=k(-1),v.sortedIndex=function(n,t,r,e){for(var u=(r=d(r,e,1))(t),i=0,o=_(n);i<o;){var a=Math.floor((i+o)/2);r(n[a])<u?i=a+1:o=a}return i},v.indexOf=F(1,v.findIndex,v.sortedIndex),v.lastIndexOf=F(-1,v.findLastIndex),v.range=function(n,t,r){null==t&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;i<e;i++,n+=r)u[i]=n;return u};function S(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var i=m(n.prototype),o=n.apply(i,u);return v.isObject(o)?o:i}v.bind=function(n,t){if(p&&n.bind===p)return p.apply(n,c.call(arguments,1));if(!v.isFunction(n))throw new TypeError("Bind must be called on a function");var r=c.call(arguments,2),e=function(){return S(n,e,t,this,r.concat(c.call(arguments)))};return e},v.partial=function(u){var i=c.call(arguments,1),o=function(){for(var n=0,t=i.length,r=Array(t),e=0;e<t;e++)r[e]=i[e]===v?arguments[n++]:i[e];for(;n<arguments.length;)r.push(arguments[n++]);return S(u,o,this,this,r)};return o},v.bindAll=function(n){var t,r,e=arguments.length;if(e<=1)throw new Error("bindAll must be passed function names");for(t=1;t<e;t++)n[r=arguments[t]]=v.bind(n[r],n);return n},v.memoize=function(e,u){var i=function(n){var t=i.cache,r=""+(u?u.apply(this,arguments):n);return v.has(t,r)||(t[r]=e.apply(this,arguments)),t[r]};return i.cache={},i},v.delay=function(n,t){var r=c.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},v.defer=v.partial(v.delay,v,1),v.throttle=function(r,e,u){var i,o,a,c=null,f=0;u=u||{};function l(){f=!1===u.leading?0:v.now(),c=null,a=r.apply(i,o),c||(i=o=null)}return function(){var n=v.now();f||!1!==u.leading||(f=n);var t=e-(n-f);return i=this,o=arguments,t<=0||e<t?(c&&(clearTimeout(c),c=null),f=n,a=r.apply(i,o),c||(i=o=null)):c||!1===u.trailing||(c=setTimeout(l,t)),a}},v.debounce=function(t,r,e){var u,i,o,a,c,f=function(){var n=v.now()-a;n<r&&0<=n?u=setTimeout(f,r-n):(u=null,e||(c=t.apply(o,i),u||(o=i=null)))};return function(){o=this,i=arguments,a=v.now();var n=e&&!u;return u=u||setTimeout(f,r),n&&(c=t.apply(o,i),o=i=null),c}},v.wrap=function(n,t){return v.partial(t,n)},v.negate=function(n){return function(){return!n.apply(this,arguments)}},v.compose=function(){var r=arguments,e=r.length-1;return function(){for(var n=e,t=r[e].apply(this,arguments);n--;)t=r[n].call(this,t);return t}},v.after=function(n,t){return function(){if(--n<1)return t.apply(this,arguments)}},v.before=function(n,t){var r;return function(){return 0<--n&&(r=t.apply(this,arguments)),n<=1&&(t=null),r}},v.once=v.partial(v.before,2);var E=!{toString:null}.propertyIsEnumerable("toString"),M=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];function I(n,t){var r=M.length,e=n.constructor,u=v.isFunction(e)&&e.prototype||o,i="constructor";for(v.has(n,i)&&!v.contains(t,i)&&t.push(i);r--;)(i=M[r])in n&&n[i]!==u[i]&&!v.contains(t,i)&&t.push(i)}v.keys=function(n){if(!v.isObject(n))return[];if(l)return l(n);var t=[];for(var r in n)v.has(n,r)&&t.push(r);return E&&I(n,t),t},v.allKeys=function(n){if(!v.isObject(n))return[];var t=[];for(var r in n)t.push(r);return E&&I(n,t),t},v.values=function(n){for(var t=v.keys(n),r=t.length,e=Array(r),u=0;u<r;u++)e[u]=n[t[u]];return e},v.mapObject=function(n,t,r){t=d(t,r);for(var e,u=v.keys(n),i=u.length,o={},a=0;a<i;a++)o[e=u[a]]=t(n[e],e,n);return o},v.pairs=function(n){for(var t=v.keys(n),r=t.length,e=Array(r),u=0;u<r;u++)e[u]=[t[u],n[t[u]]];return e},v.invert=function(n){for(var t={},r=v.keys(n),e=0,u=r.length;e<u;e++)t[n[r[e]]]=r[e];return t},v.functions=v.methods=function(n){var t=[];for(var r in n)v.isFunction(n[r])&&t.push(r);return t.sort()},v.extend=g(v.allKeys),v.extendOwn=v.assign=g(v.keys),v.findKey=function(n,t,r){t=d(t,r);for(var e,u=v.keys(n),i=0,o=u.length;i<o;i++)if(t(n[e=u[i]],e,n))return e},v.pick=function(n,t,r){var e,u,i={},o=n;if(null==o)return i;v.isFunction(t)?(u=v.allKeys(o),e=y(t,r)):(u=O(arguments,!1,!1,1),e=function(n,t,r){return t in r},o=Object(o));for(var a=0,c=u.length;a<c;a++){var f=u[a],l=o[f];e(l,f,o)&&(i[f]=l)}return i},v.omit=function(n,t,r){if(v.isFunction(t))t=v.negate(t);else{var e=v.map(O(arguments,!1,!1,1),String);t=function(n,t){return!v.contains(e,t)}}return v.pick(n,t,r)},v.defaults=g(v.allKeys,!0),v.create=function(n,t){var r=m(n);return t&&v.extendOwn(r,t),r},v.clone=function(n){return v.isObject(n)?v.isArray(n)?n.slice():v.extend({},n):n},v.tap=function(n,t){return t(n),n},v.isMatch=function(n,t){var r=v.keys(t),e=r.length;if(null==n)return!e;for(var u=Object(n),i=0;i<e;i++){var o=r[i];if(t[o]!==u[o]||!(o in u))return!1}return!0};var N=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof v&&(n=n._wrapped),t instanceof v&&(t=t._wrapped);var u=s.call(n);if(u!==s.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!=+n?+t!=+t:0==+n?1/+n==1/t:+n==+t;case"[object Date]":case"[object Boolean]":return+n==+t}var i="[object Array]"===u;if(!i){if("object"!=typeof n||"object"!=typeof t)return!1;var o=n.constructor,a=t.constructor;if(o!==a&&!(v.isFunction(o)&&o instanceof o&&v.isFunction(a)&&a instanceof a)&&"constructor"in n&&"constructor"in t)return!1}e=e||[];for(var c=(r=r||[]).length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),i){if((c=n.length)!==t.length)return!1;for(;c--;)if(!N(n[c],t[c],r,e))return!1}else{var f,l=v.keys(n);if(c=l.length,v.keys(t).length!==c)return!1;for(;c--;)if(f=l[c],!v.has(t,f)||!N(n[f],t[f],r,e))return!1}return r.pop(),e.pop(),!0};v.isEqual=function(n,t){return N(n,t)},v.isEmpty=function(n){return null==n||(j(n)&&(v.isArray(n)||v.isString(n)||v.isArguments(n))?0===n.length:0===v.keys(n).length)},v.isElement=function(n){return!(!n||1!==n.nodeType)},v.isArray=f||function(n){return"[object Array]"===s.call(n)},v.isObject=function(n){var t=typeof n;return"function"==t||"object"==t&&!!n},v.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(t){v["is"+t]=function(n){return s.call(n)==="[object "+t+"]"}}),v.isArguments(arguments)||(v.isArguments=function(n){return v.has(n,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(v.isFunction=function(n){return"function"==typeof n||!1}),v.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},v.isNaN=function(n){return v.isNumber(n)&&n!==+n},v.isBoolean=function(n){return!0===n||!1===n||"[object Boolean]"===s.call(n)},v.isNull=function(n){return null===n},v.isUndefined=function(n){return void 0===n},v.has=function(n,t){return null!=n&&a.call(n,t)},v.noConflict=function(){return n._=t,this},v.identity=function(n){return n},v.constant=function(n){return function(){return n}},v.noop=function(){},v.property=b,v.propertyOf=function(t){return null==t?function(){}:function(n){return t[n]}},v.matcher=v.matches=function(t){return t=v.extendOwn({},t),function(n){return v.isMatch(n,t)}},v.times=function(n,t,r){var e=Array(Math.max(0,n));t=y(t,r,1);for(var u=0;u<n;u++)e[u]=t(u);return e},v.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},v.now=Date.now||function(){return(new Date).getTime()};function B(t){function r(n){return t[n]}var n="(?:"+v.keys(t).join("|")+")",e=RegExp(n),u=RegExp(n,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,r):n}}var T={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},R=v.invert(T);v.escape=B(T),v.unescape=B(R),v.result=function(n,t,r){var e=null==n?void 0:n[t];return void 0===e&&(e=r),v.isFunction(e)?e.call(n):e};var q=0;v.uniqueId=function(n){var t=++q+"";return n?n+t:t},v.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};function K(n){return"\\"+D[n]}var z=/(.)^/,D={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},L=/\\|'|\r|\n|\u2028|\u2029/g;v.template=function(i,n,t){!n&&t&&(n=t),n=v.defaults({},n,v.templateSettings);var r=RegExp([(n.escape||z).source,(n.interpolate||z).source,(n.evaluate||z).source].join("|")+"|$","g"),o=0,a="__p+='";i.replace(r,function(n,t,r,e,u){return a+=i.slice(o,u).replace(L,K),o=u+n.length,t?a+="'+\n((__t=("+t+"))==null?'':_.escape(__t))+\n'":r?a+="'+\n((__t=("+r+"))==null?'':__t)+\n'":e&&(a+="';\n"+e+"\n__p+='"),n}),a+="';\n",n.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{var e=new Function(n.variable||"obj","_",a)}catch(n){throw n.source=a,n}function u(n){return e.call(this,n,v)}var c=n.variable||"obj";return u.source="function("+c+"){\n"+a+"}",u},v.chain=function(n){var t=v(n);return t._chain=!0,t};function P(n,t){return n._chain?v(t).chain():t}v.mixin=function(r){v.each(v.functions(r),function(n){var t=v[n]=r[n];v.prototype[n]=function(){var n=[this._wrapped];return i.apply(n,arguments),P(this,t.apply(v,n))}})},v.mixin(v),v.each(["pop","push","reverse","shift","sort","splice","unshift"],function(t){var r=e[t];v.prototype[t]=function(){var n=this._wrapped;return r.apply(n,arguments),"shift"!==t&&"splice"!==t||0!==n.length||delete n[0],P(this,n)}}),v.each(["concat","join","slice"],function(n){var t=e[n];v.prototype[n]=function(){return P(this,t.apply(this._wrapped,arguments))}}),v.prototype.value=function(){return this._wrapped},v.prototype.valueOf=v.prototype.toJSON=v.prototype.value,v.prototype.toString=function(){return""+this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return v})}).call(this);
window.wp=window.wp||{},function(t,o){var s,i,h={},r=Array.prototype.slice;s=function(){},i=function(t,e,n){var i;return i=e&&e.hasOwnProperty("constructor")?e.constructor:function(){return t.apply(this,arguments)},o.extend(i,t),s.prototype=t.prototype,i.prototype=new s,e&&o.extend(i.prototype,e),n&&o.extend(i,n),(i.prototype.constructor=i).__super__=t.prototype,i},h.Class=function(t,e,n){var i,s=arguments;return t&&e&&h.Class.applicator===t&&(s=e,o.extend(this,n||{})),(i=this).instance&&(i=function(){return i.instance.apply(i,arguments)},o.extend(i,this)),i.initialize.apply(i,s),i},h.Class.extend=function(t,e){var n=i(this,t,e);return n.extend=this.extend,n},h.Class.applicator={},h.Class.prototype.initialize=function(){},h.Class.prototype.extended=function(t){for(var e=this;void 0!==e.constructor;){if(e.constructor===t)return!0;if(void 0===e.constructor.__super__)return!1;e=e.constructor.__super__}return!1},h.Events={trigger:function(t){return this.topics&&this.topics[t]&&this.topics[t].fireWith(this,r.call(arguments,1)),this},bind:function(t){return this.topics=this.topics||{},this.topics[t]=this.topics[t]||o.Callbacks(),this.topics[t].add.apply(this.topics[t],r.call(arguments,1)),this},unbind:function(t){return this.topics&&this.topics[t]&&this.topics[t].remove.apply(this.topics[t],r.call(arguments,1)),this}},h.Value=h.Class.extend({initialize:function(t,e){this._value=t,this.callbacks=o.Callbacks(),this._dirty=!1,o.extend(this,e||{}),this.set=o.proxy(this.set,this)},instance:function(){return arguments.length?this.set.apply(this,arguments):this.get()},get:function(){return this._value},set:function(t){var e=this._value;return t=this._setter.apply(this,arguments),null===(t=this.validate(t))||_.isEqual(e,t)||(this._value=t,this._dirty=!0,this.callbacks.fireWith(this,[t,e])),this},_setter:function(t){return t},setter:function(t){var e=this.get();return this._setter=t,this._value=null,this.set(e),this},resetSetter:function(){return this._setter=this.constructor.prototype._setter,this.set(this.get()),this},validate:function(t){return t},bind:function(){return this.callbacks.add.apply(this.callbacks,arguments),this},unbind:function(){return this.callbacks.remove.apply(this.callbacks,arguments),this},link:function(){var t=this.set;return o.each(arguments,function(){this.bind(t)}),this},unlink:function(){var t=this.set;return o.each(arguments,function(){this.unbind(t)}),this},sync:function(){var t=this;return o.each(arguments,function(){t.link(this),this.link(t)}),this},unsync:function(){var t=this;return o.each(arguments,function(){t.unlink(this),this.unlink(t)}),this}}),h.Values=h.Class.extend({defaultConstructor:h.Value,initialize:function(t){o.extend(this,t||{}),this._value={},this._deferreds={}},instance:function(t){return 1===arguments.length?this.value(t):this.when.apply(this,arguments)},value:function(t){return this._value[t]},has:function(t){return void 0!==this._value[t]},add:function(t,e){var n,i,s=this;if("string"==typeof t)n=t,i=e;else{if("string"!=typeof t.id)throw new Error("Unknown key");n=t.id,i=t}return s.has(n)?s.value(n):((s._value[n]=i).parent=s,i.extended(h.Value)&&i.bind(s._change),s.trigger("add",i),s._deferreds[n]&&s._deferreds[n].resolve(),s._value[n])},create:function(t){return this.add(t,new this.defaultConstructor(h.Class.applicator,r.call(arguments,1)))},each:function(n,i){i=void 0===i?this:i,o.each(this._value,function(t,e){n.call(i,e,t)})},remove:function(t){var e=this.value(t);e&&(this.trigger("remove",e),e.extended(h.Value)&&e.unbind(this._change),delete e.parent),delete this._value[t],delete this._deferreds[t],e&&this.trigger("removed",e)},when:function(){var e=this,n=r.call(arguments),i=o.Deferred();return o.isFunction(n[n.length-1])&&i.done(n.pop()),o.when.apply(o,o.map(n,function(t){if(!e.has(t))return e._deferreds[t]=e._deferreds[t]||o.Deferred()})).done(function(){var t=o.map(n,function(t){return e(t)});t.length===n.length?i.resolveWith(e,t):e.when.apply(e,n).done(function(){i.resolveWith(e,t)})}),i.promise()},_change:function(){this.parent.trigger("change",this)}}),o.extend(h.Values.prototype,h.Events),h.ensure=function(t){return"string"==typeof t?o(t):t},h.Element=h.Value.extend({initialize:function(t,e){var n,i,s,r=this,a=h.Element.synchronizer.html;this.element=h.ensure(t),this.events="",this.element.is("input, select, textarea")&&(n=this.element.prop("type"),this.events+=" change input",a=h.Element.synchronizer.val,this.element.is("input")&&h.Element.synchronizer[n]&&(a=h.Element.synchronizer[n])),h.Value.prototype.initialize.call(this,null,o.extend(e||{},a)),this._value=this.get(),i=this.update,s=this.refresh,this.update=function(t){t!==s.call(r)&&i.apply(this,arguments)},this.refresh=function(){r.set(s.call(r))},this.bind(this.update),this.element.bind(this.events,this.refresh)},find:function(t){return o(t,this.element)},refresh:function(){},update:function(){}}),h.Element.synchronizer={},o.each(["html","val"],function(t,e){h.Element.synchronizer[e]={update:function(t){this.element[e](t)},refresh:function(){return this.element[e]()}}}),h.Element.synchronizer.checkbox={update:function(t){this.element.prop("checked",t)},refresh:function(){return this.element.prop("checked")}},h.Element.synchronizer.radio={update:function(t){this.element.filter(function(){return this.value===t}).prop("checked",!0)},refresh:function(){return this.element.filter(":checked").val()}},o.support.postMessage=!!window.postMessage,h.Messenger=h.Class.extend({add:function(t,e,n){return this[t]=new h.Value(e,n)},initialize:function(t,e){var n=window.parent===window?null:window.parent;o.extend(this,e||{}),this.add("channel",t.channel),this.add("url",t.url||""),this.add("origin",this.url()).link(this.url).setter(function(t){var e=document.createElement("a");return e.href=t,e.protocol+"//"+e.host.replace(/:(80|443)$/,"")}),this.add("targetWindow",null),this.targetWindow.set=function(t){var e=this._value;return t=this._setter.apply(this,arguments),null===(t=this.validate(t))||e===t||(this._value=t,this._dirty=!0,this.callbacks.fireWith(this,[t,e])),this},this.targetWindow(t.targetWindow||n),this.receive=o.proxy(this.receive,this),this.receive.guid=o.guid++,o(window).on("message",this.receive)},destroy:function(){o(window).off("message",this.receive)},receive:function(t){var e;t=t.originalEvent,this.targetWindow&&this.targetWindow()&&(this.origin()&&t.origin!==this.origin()||"string"==typeof t.data&&"{"===t.data[0]&&(e=JSON.parse(t.data))&&e.id&&void 0!==e.data&&((e.channel||this.channel())&&this.channel()!==e.channel||this.trigger(e.id,e.data)))},send:function(t,e){var n;e=void 0===e?null:e,this.url()&&this.targetWindow()&&(n={id:t,data:e},this.channel()&&(n.channel=this.channel()),this.targetWindow().postMessage(JSON.stringify(n),this.origin()))}}),o.extend(h.Messenger.prototype,h.Events),h.Notification=h.Class.extend({template:null,templateId:"customize-notification",containerClasses:"",initialize:function(t,e){var n;this.code=t,delete(n=_.extend({message:null,type:"error",fromServer:!1,data:null,setting:null,template:null,dismissible:!1,containerClasses:""},e)).code,_.extend(this,n)},render:function(){var e,t,n=this;return n.template||(n.template=wp.template(n.templateId)),t=_.extend({},n,{alt:n.parent&&n.parent.alt}),e=o(n.template(t)),n.dismissible&&e.find(".notice-dismiss").on("click keydown",function(t){"keydown"===t.type&&13!==t.which||(n.parent?n.parent.remove(n.code):e.remove())}),e}}),(h=o.extend(new h.Values,h)).get=function(){var n={};return this.each(function(t,e){n[e]=t.get()}),n},h.utils={},h.utils.parseQueryString=function(t){var s={};return _.each(t.split("&"),function(t){var e,n,i;(e=t.split("=",2))[0]&&(n=(n=decodeURIComponent(e[0].replace(/\+/g," "))).replace(/ /g,"_"),i=_.isUndefined(e[1])?null:decodeURIComponent(e[1].replace(/\+/g," ")),s[n]=i)}),s},t.customize=h}(wp,jQuery);
!function(n){var s="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global;if("function"==typeof define&&define.amd)define(["underscore","jquery","exports"],function(t,e,i){s.Backbone=n(s,i,t,e)});else if("undefined"!=typeof exports){var t,e=require("underscore");try{t=require("jquery")}catch(t){}n(s,exports,e,t)}else s.Backbone=n(s,{},s._,s.jQuery||s.Zepto||s.ender||s.$)}(function(t,h,x,e){var i=t.Backbone,o=Array.prototype.slice;h.VERSION="1.4.0",h.$=e,h.noConflict=function(){return t.Backbone=i,this},h.emulateHTTP=!1,h.emulateJSON=!1;var a,n=h.Events={},u=/\s+/,l=function(t,e,i,n,s){var r,o=0;if(i&&"object"==typeof i){void 0!==n&&"context"in s&&void 0===s.context&&(s.context=n);for(r=x.keys(i);o<r.length;o++)e=l(t,e,r[o],i[r[o]],s)}else if(i&&u.test(i))for(r=i.split(u);o<r.length;o++)e=t(e,r[o],n,s);else e=t(e,i,n,s);return e};n.on=function(t,e,i){this._events=l(s,this._events||{},t,e,{context:i,ctx:this,listening:a}),a&&(((this._listeners||(this._listeners={}))[a.id]=a).interop=!1);return this},n.listenTo=function(t,e,i){if(!t)return this;var n=t._listenId||(t._listenId=x.uniqueId("l")),s=this._listeningTo||(this._listeningTo={}),r=a=s[n];r||(this._listenId||(this._listenId=x.uniqueId("l")),r=a=s[n]=new g(this,t));var o=c(t,e,i,this);if(a=void 0,o)throw o;return r.interop&&r.on(e,i),this};var s=function(t,e,i,n){if(i){var s=t[e]||(t[e]=[]),r=n.context,o=n.ctx,a=n.listening;a&&a.count++,s.push({callback:i,context:r,ctx:r||o,listening:a})}return t},c=function(t,e,i,n){try{t.on(e,i,n)}catch(t){return t}};n.off=function(t,e,i){return this._events&&(this._events=l(r,this._events,t,e,{context:i,listeners:this._listeners})),this},n.stopListening=function(t,e,i){var n=this._listeningTo;if(!n)return this;for(var s=t?[t._listenId]:x.keys(n),r=0;r<s.length;r++){var o=n[s[r]];if(!o)break;o.obj.off(e,i,this),o.interop&&o.off(e,i)}return x.isEmpty(n)&&(this._listeningTo=void 0),this};var r=function(t,e,i,n){if(t){var s,r=n.context,o=n.listeners,a=0;if(e||r||i){for(s=e?[e]:x.keys(t);a<s.length;a++){var h=t[e=s[a]];if(!h)break;for(var u=[],l=0;l<h.length;l++){var c=h[l];if(i&&i!==c.callback&&i!==c.callback._callback||r&&r!==c.context)u.push(c);else{var d=c.listening;d&&d.off(e,i)}}u.length?t[e]=u:delete t[e]}return t}for(s=x.keys(o);a<s.length;a++)o[s[a]].cleanup()}};n.once=function(t,e,i){var n=l(d,{},t,e,this.off.bind(this));return"string"==typeof t&&null==i&&(e=void 0),this.on(n,e,i)},n.listenToOnce=function(t,e,i){var n=l(d,{},e,i,this.stopListening.bind(this,t));return this.listenTo(t,n)};var d=function(t,e,i,n){if(i){var s=t[e]=x.once(function(){n(e,s),i.apply(this,arguments)});s._callback=i}return t};n.trigger=function(t){if(!this._events)return this;for(var e=Math.max(0,arguments.length-1),i=Array(e),n=0;n<e;n++)i[n]=arguments[n+1];return l(f,this._events,t,void 0,i),this};var f=function(t,e,i,n){if(t){var s=t[e],r=t.all;s&&r&&(r=r.slice()),s&&p(s,n),r&&p(r,[e].concat(n))}return t},p=function(t,e){var i,n=-1,s=t.length,r=e[0],o=e[1],a=e[2];switch(e.length){case 0:for(;++n<s;)(i=t[n]).callback.call(i.ctx);return;case 1:for(;++n<s;)(i=t[n]).callback.call(i.ctx,r);return;case 2:for(;++n<s;)(i=t[n]).callback.call(i.ctx,r,o);return;case 3:for(;++n<s;)(i=t[n]).callback.call(i.ctx,r,o,a);return;default:for(;++n<s;)(i=t[n]).callback.apply(i.ctx,e);return}},g=function(t,e){this.id=t._listenId,this.listener=t,this.obj=e,this.interop=!0,this.count=0,this._events=void 0};g.prototype.on=n.on,g.prototype.off=function(t,e){(this.interop?(this._events=l(r,this._events,t,e,{context:void 0,listeners:void 0}),this._events):(this.count--,0!==this.count))||this.cleanup()},g.prototype.cleanup=function(){delete this.listener._listeningTo[this.obj._listenId],this.interop||delete this.obj._listeners[this.id]},n.bind=n.on,n.unbind=n.off,x.extend(h,n);var v=h.Model=function(t,e){var i=t||{};e=e||{},this.preinitialize.apply(this,arguments),this.cid=x.uniqueId(this.cidPrefix),this.attributes={},e.collection&&(this.collection=e.collection),e.parse&&(i=this.parse(i,e)||{});var n=x.result(this,"defaults");i=x.defaults(x.extend({},n,i),n),this.set(i,e),this.changed={},this.initialize.apply(this,arguments)};x.extend(v.prototype,n,{changed:null,validationError:null,idAttribute:"id",cidPrefix:"c",preinitialize:function(){},initialize:function(){},toJSON:function(t){return x.clone(this.attributes)},sync:function(){return h.sync.apply(this,arguments)},get:function(t){return this.attributes[t]},escape:function(t){return x.escape(this.get(t))},has:function(t){return null!=this.get(t)},matches:function(t){return!!x.iteratee(t,this)(this.attributes)},set:function(t,e,i){if(null==t)return this;var n;if("object"==typeof t?(n=t,i=e):(n={})[t]=e,i=i||{},!this._validate(n,i))return!1;var s=i.unset,r=i.silent,o=[],a=this._changing;this._changing=!0,a||(this._previousAttributes=x.clone(this.attributes),this.changed={});var h=this.attributes,u=this.changed,l=this._previousAttributes;for(var c in n)e=n[c],x.isEqual(h[c],e)||o.push(c),x.isEqual(l[c],e)?delete u[c]:u[c]=e,s?delete h[c]:h[c]=e;if(this.idAttribute in n&&(this.id=this.get(this.idAttribute)),!r){o.length&&(this._pending=i);for(var d=0;d<o.length;d++)this.trigger("change:"+o[d],this,h[o[d]],i)}if(a)return this;if(!r)for(;this._pending;)i=this._pending,this._pending=!1,this.trigger("change",this,i);return this._pending=!1,this._changing=!1,this},unset:function(t,e){return this.set(t,void 0,x.extend({},e,{unset:!0}))},clear:function(t){var e={};for(var i in this.attributes)e[i]=void 0;return this.set(e,x.extend({},t,{unset:!0}))},hasChanged:function(t){return null==t?!x.isEmpty(this.changed):x.has(this.changed,t)},changedAttributes:function(t){if(!t)return!!this.hasChanged()&&x.clone(this.changed);var e,i=this._changing?this._previousAttributes:this.attributes,n={};for(var s in t){var r=t[s];x.isEqual(i[s],r)||(n[s]=r,e=!0)}return!!e&&n},previous:function(t){return null!=t&&this._previousAttributes?this._previousAttributes[t]:null},previousAttributes:function(){return x.clone(this._previousAttributes)},fetch:function(i){i=x.extend({parse:!0},i);var n=this,s=i.success;return i.success=function(t){var e=i.parse?n.parse(t,i):t;if(!n.set(e,i))return!1;s&&s.call(i.context,n,t,i),n.trigger("sync",n,t,i)},L(this,i),this.sync("read",this,i)},save:function(t,e,i){var n;null==t||"object"==typeof t?(n=t,i=e):(n={})[t]=e;var s=(i=x.extend({validate:!0,parse:!0},i)).wait;if(n&&!s){if(!this.set(n,i))return!1}else if(!this._validate(n,i))return!1;var r=this,o=i.success,a=this.attributes;i.success=function(t){r.attributes=a;var e=i.parse?r.parse(t,i):t;if(s&&(e=x.extend({},n,e)),e&&!r.set(e,i))return!1;o&&o.call(i.context,r,t,i),r.trigger("sync",r,t,i)},L(this,i),n&&s&&(this.attributes=x.extend({},a,n));var h=this.isNew()?"create":i.patch?"patch":"update";"patch"!=h||i.attrs||(i.attrs=n);var u=this.sync(h,this,i);return this.attributes=a,u},destroy:function(e){e=e?x.clone(e):{};function i(){n.stopListening(),n.trigger("destroy",n,n.collection,e)}var n=this,s=e.success,r=e.wait,t=!(e.success=function(t){r&&i(),s&&s.call(e.context,n,t,e),n.isNew()||n.trigger("sync",n,t,e)});return this.isNew()?x.defer(e.success):(L(this,e),t=this.sync("delete",this,e)),r||i(),t},url:function(){var t=x.result(this,"urlRoot")||x.result(this.collection,"url")||J();if(this.isNew())return t;var e=this.get(this.idAttribute);return t.replace(/[^\/]$/,"$&/")+encodeURIComponent(e)},parse:function(t,e){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return!this.has(this.idAttribute)},isValid:function(t){return this._validate({},x.extend({},t,{validate:!0}))},_validate:function(t,e){if(!e.validate||!this.validate)return!0;t=x.extend({},this.attributes,t);var i=this.validationError=this.validate(t,e)||null;return!i||(this.trigger("invalid",this,i,x.extend(e,{validationError:i})),!1)}});function w(t,e,i){i=Math.min(Math.max(i,0),t.length);var n,s=Array(t.length-i),r=e.length;for(n=0;n<s.length;n++)s[n]=t[n+i];for(n=0;n<r;n++)t[n+i]=e[n];for(n=0;n<s.length;n++)t[n+r+i]=s[n]}var m=h.Collection=function(t,e){e=e||{},this.preinitialize.apply(this,arguments),e.model&&(this.model=e.model),void 0!==e.comparator&&(this.comparator=e.comparator),this._reset(),this.initialize.apply(this,arguments),t&&this.reset(t,x.extend({silent:!0},e))},E={add:!0,remove:!0,merge:!0},_={add:!0,remove:!1};x.extend(m.prototype,n,{model:v,preinitialize:function(){},initialize:function(){},toJSON:function(e){return this.map(function(t){return t.toJSON(e)})},sync:function(){return h.sync.apply(this,arguments)},add:function(t,e){return this.set(t,x.extend({merge:!1},e,_))},remove:function(t,e){e=x.extend({},e);var i=!x.isArray(t);t=i?[t]:t.slice();var n=this._removeModels(t,e);return!e.silent&&n.length&&(e.changes={added:[],merged:[],removed:n},this.trigger("update",this,e)),i?n[0]:n},set:function(t,e){if(null!=t){(e=x.extend({},E,e)).parse&&!this._isModel(t)&&(t=this.parse(t,e)||[]);var i=!x.isArray(t);t=i?[t]:t.slice();var n=e.at;null!=n&&(n=+n),n>this.length&&(n=this.length),n<0&&(n+=this.length+1);var s,r,o=[],a=[],h=[],u=[],l={},c=e.add,d=e.merge,f=e.remove,p=!1,g=this.comparator&&null==n&&!1!==e.sort,v=x.isString(this.comparator)?this.comparator:null;for(r=0;r<t.length;r++){s=t[r];var m=this.get(s);if(m){if(d&&s!==m){var _=this._isModel(s)?s.attributes:s;e.parse&&(_=m.parse(_,e)),m.set(_,e),h.push(m),g&&!p&&(p=m.hasChanged(v))}l[m.cid]||(l[m.cid]=!0,o.push(m)),t[r]=m}else c&&(s=t[r]=this._prepareModel(s,e))&&(a.push(s),this._addReference(s,e),l[s.cid]=!0,o.push(s))}if(f){for(r=0;r<this.length;r++)l[(s=this.models[r]).cid]||u.push(s);u.length&&this._removeModels(u,e)}var y=!1,b=!g&&c&&f;if(o.length&&b?(y=this.length!==o.length||x.some(this.models,function(t,e){return t!==o[e]}),this.models.length=0,w(this.models,o,0),this.length=this.models.length):a.length&&(g&&(p=!0),w(this.models,a,null==n?this.length:n),this.length=this.models.length),p&&this.sort({silent:!0}),!e.silent){for(r=0;r<a.length;r++)null!=n&&(e.index=n+r),(s=a[r]).trigger("add",s,this,e);(p||y)&&this.trigger("sort",this,e),(a.length||u.length||h.length)&&(e.changes={added:a,removed:u,merged:h},this.trigger("update",this,e))}return i?t[0]:t}},reset:function(t,e){e=e?x.clone(e):{};for(var i=0;i<this.models.length;i++)this._removeReference(this.models[i],e);return e.previousModels=this.models,this._reset(),t=this.add(t,x.extend({silent:!0},e)),e.silent||this.trigger("reset",this,e),t},push:function(t,e){return this.add(t,x.extend({at:this.length},e))},pop:function(t){var e=this.at(this.length-1);return this.remove(e,t)},unshift:function(t,e){return this.add(t,x.extend({at:0},e))},shift:function(t){var e=this.at(0);return this.remove(e,t)},slice:function(){return o.apply(this.models,arguments)},get:function(t){if(null!=t)return this._byId[t]||this._byId[this.modelId(this._isModel(t)?t.attributes:t)]||t.cid&&this._byId[t.cid]},has:function(t){return null!=this.get(t)},at:function(t){return t<0&&(t+=this.length),this.models[t]},where:function(t,e){return this[e?"find":"filter"](t)},findWhere:function(t){return this.where(t,!0)},sort:function(t){var e=this.comparator;if(!e)throw new Error("Cannot sort a set without a comparator");t=t||{};var i=e.length;return x.isFunction(e)&&(e=e.bind(this)),1===i||x.isString(e)?this.models=this.sortBy(e):this.models.sort(e),t.silent||this.trigger("sort",this,t),this},pluck:function(t){return this.map(t+"")},fetch:function(i){var n=(i=x.extend({parse:!0},i)).success,s=this;return i.success=function(t){var e=i.reset?"reset":"set";s[e](t,i),n&&n.call(i.context,s,t,i),s.trigger("sync",s,t,i)},L(this,i),this.sync("read",this,i)},create:function(t,e){var n=(e=e?x.clone(e):{}).wait;if(!(t=this._prepareModel(t,e)))return!1;n||this.add(t,e);var s=this,r=e.success;return e.success=function(t,e,i){n&&s.add(t,i),r&&r.call(i.context,t,e,i)},t.save(null,e),t},parse:function(t,e){return t},clone:function(){return new this.constructor(this.models,{model:this.model,comparator:this.comparator})},modelId:function(t){return t[this.model.prototype.idAttribute||"id"]},values:function(){return new b(this,k)},keys:function(){return new b(this,I)},entries:function(){return new b(this,S)},_reset:function(){this.length=0,this.models=[],this._byId={}},_prepareModel:function(t,e){if(this._isModel(t))return t.collection||(t.collection=this),t;var i=new(((e=e?x.clone(e):{}).collection=this).model)(t,e);return i.validationError?(this.trigger("invalid",this,i.validationError,e),!1):i},_removeModels:function(t,e){for(var i=[],n=0;n<t.length;n++){var s=this.get(t[n]);if(s){var r=this.indexOf(s);this.models.splice(r,1),this.length--,delete this._byId[s.cid];var o=this.modelId(s.attributes);null!=o&&delete this._byId[o],e.silent||(e.index=r,s.trigger("remove",s,this,e)),i.push(s),this._removeReference(s,e)}}return i},_isModel:function(t){return t instanceof v},_addReference:function(t,e){this._byId[t.cid]=t;var i=this.modelId(t.attributes);null!=i&&(this._byId[i]=t),t.on("all",this._onModelEvent,this)},_removeReference:function(t,e){delete this._byId[t.cid];var i=this.modelId(t.attributes);null!=i&&delete this._byId[i],this===t.collection&&delete t.collection,t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,n){if(e){if(("add"===t||"remove"===t)&&i!==this)return;if("destroy"===t&&this.remove(e,n),"change"===t){var s=this.modelId(e.previousAttributes()),r=this.modelId(e.attributes);s!==r&&(null!=s&&delete this._byId[s],null!=r&&(this._byId[r]=e))}}this.trigger.apply(this,arguments)}});var y="function"==typeof Symbol&&Symbol.iterator;y&&(m.prototype[y]=m.prototype.values);var b=function(t,e){this._collection=t,this._kind=e,this._index=0},k=1,I=2,S=3;y&&(b.prototype[y]=function(){return this}),b.prototype.next=function(){if(this._collection){if(this._index<this._collection.length){var t,e=this._collection.at(this._index);if(this._index++,this._kind===k)t=e;else{var i=this._collection.modelId(e.attributes);t=this._kind===I?i:[i,e]}return{value:t,done:!1}}this._collection=void 0}return{value:void 0,done:!0}};var T=h.View=function(t){this.cid=x.uniqueId("view"),this.preinitialize.apply(this,arguments),x.extend(this,x.pick(t,H)),this._ensureElement(),this.initialize.apply(this,arguments)},P=/^(\S+)\s*(.*)$/,H=["model","collection","el","id","attributes","className","tagName","events"];x.extend(T.prototype,n,{tagName:"div",$:function(t){return this.$el.find(t)},preinitialize:function(){},initialize:function(){},render:function(){return this},remove:function(){return this._removeElement(),this.stopListening(),this},_removeElement:function(){this.$el.remove()},setElement:function(t){return this.undelegateEvents(),this._setElement(t),this.delegateEvents(),this},_setElement:function(t){this.$el=t instanceof h.$?t:h.$(t),this.el=this.$el[0]},delegateEvents:function(t){if(!(t=t||x.result(this,"events")))return this;for(var e in this.undelegateEvents(),t){var i=t[e];if(x.isFunction(i)||(i=this[i]),i){var n=e.match(P);this.delegate(n[1],n[2],i.bind(this))}}return this},delegate:function(t,e,i){return this.$el.on(t+".delegateEvents"+this.cid,e,i),this},undelegateEvents:function(){return this.$el&&this.$el.off(".delegateEvents"+this.cid),this},undelegate:function(t,e,i){return this.$el.off(t+".delegateEvents"+this.cid,e,i),this},_createElement:function(t){return document.createElement(t)},_ensureElement:function(){if(this.el)this.setElement(x.result(this,"el"));else{var t=x.extend({},x.result(this,"attributes"));this.id&&(t.id=x.result(this,"id")),this.className&&(t.class=x.result(this,"className")),this.setElement(this._createElement(x.result(this,"tagName"))),this._setAttributes(t)}},_setAttributes:function(t){this.$el.attr(t)}});function $(i,n,t,s){x.each(t,function(t,e){n[e]&&(i.prototype[e]=function(n,t,s,r){switch(t){case 1:return function(){return n[s](this[r])};case 2:return function(t){return n[s](this[r],t)};case 3:return function(t,e){return n[s](this[r],A(t,this),e)};case 4:return function(t,e,i){return n[s](this[r],A(t,this),e,i)};default:return function(){var t=o.call(arguments);return t.unshift(this[r]),n[s].apply(n,t)}}}(n,t,e,s))})}var A=function(e,t){return x.isFunction(e)?e:x.isObject(e)&&!t._isModel(e)?C(e):x.isString(e)?function(t){return t.get(e)}:e},C=function(t){var e=x.matches(t);return function(t){return e(t.attributes)}};x.each([[m,{forEach:3,each:3,map:3,collect:3,reduce:0,foldl:0,inject:0,reduceRight:0,foldr:0,find:3,detect:3,filter:3,select:3,reject:3,every:3,all:3,some:3,any:3,include:3,includes:3,contains:3,invoke:0,max:3,min:3,toArray:1,size:1,first:3,head:3,take:3,initial:3,rest:3,tail:3,drop:3,last:3,without:0,difference:0,indexOf:3,shuffle:1,lastIndexOf:3,isEmpty:1,chain:1,sample:3,partition:3,groupBy:3,countBy:3,sortBy:3,indexBy:3,findIndex:3,findLastIndex:3},"models"],[v,{keys:1,values:1,pairs:1,invert:1,pick:0,omit:0,chain:1,isEmpty:1},"attributes"]],function(t){var i=t[0],e=t[1],n=t[2];i.mixin=function(t){var e=x.reduce(x.functions(t),function(t,e){return t[e]=0,t},{});$(i,t,e,n)},$(i,x,e,n)}),h.sync=function(t,e,n){var i=R[t];x.defaults(n=n||{},{emulateHTTP:h.emulateHTTP,emulateJSON:h.emulateJSON});var s={type:i,dataType:"json"};if(n.url||(s.url=x.result(e,"url")||J()),null!=n.data||!e||"create"!==t&&"update"!==t&&"patch"!==t||(s.contentType="application/json",s.data=JSON.stringify(n.attrs||e.toJSON(n))),n.emulateJSON&&(s.contentType="application/x-www-form-urlencoded",s.data=s.data?{model:s.data}:{}),n.emulateHTTP&&("PUT"===i||"DELETE"===i||"PATCH"===i)){s.type="POST",n.emulateJSON&&(s.data._method=i);var r=n.beforeSend;n.beforeSend=function(t){if(t.setRequestHeader("X-HTTP-Method-Override",i),r)return r.apply(this,arguments)}}"GET"===s.type||n.emulateJSON||(s.processData=!1);var o=n.error;n.error=function(t,e,i){n.textStatus=e,n.errorThrown=i,o&&o.call(n.context,t,e,i)};var a=n.xhr=h.ajax(x.extend(s,n));return e.trigger("request",e,a,n),a};var R={create:"POST",update:"PUT",patch:"PATCH",delete:"DELETE",read:"GET"};h.ajax=function(){return h.$.ajax.apply(h.$,arguments)};var M=h.Router=function(t){t=t||{},this.preinitialize.apply(this,arguments),t.routes&&(this.routes=t.routes),this._bindRoutes(),this.initialize.apply(this,arguments)},N=/\((.*?)\)/g,j=/(\(\?)?:\w+/g,O=/\*\w+/g,U=/[\-{}\[\]+?.,\\\^$|#\s]/g;x.extend(M.prototype,n,{preinitialize:function(){},initialize:function(){},route:function(i,n,s){x.isRegExp(i)||(i=this._routeToRegExp(i)),x.isFunction(n)&&(s=n,n=""),s=s||this[n];var r=this;return h.history.route(i,function(t){var e=r._extractParameters(i,t);!1!==r.execute(s,e,n)&&(r.trigger.apply(r,["route:"+n].concat(e)),r.trigger("route",n,e),h.history.trigger("route",r,n,e))}),this},execute:function(t,e,i){t&&t.apply(this,e)},navigate:function(t,e){return h.history.navigate(t,e),this},_bindRoutes:function(){if(this.routes){this.routes=x.result(this,"routes");for(var t,e=x.keys(this.routes);null!=(t=e.pop());)this.route(t,this.routes[t])}},_routeToRegExp:function(t){return t=t.replace(U,"\\$&").replace(N,"(?:$1)?").replace(j,function(t,e){return e?t:"([^/?]+)"}).replace(O,"([^?]*?)"),new RegExp("^"+t+"(?:\\?([\\s\\S]*))?$")},_extractParameters:function(t,e){var i=t.exec(e).slice(1);return x.map(i,function(t,e){return e===i.length-1?t||null:t?decodeURIComponent(t):null})}});var z=h.History=function(){this.handlers=[],this.checkUrl=this.checkUrl.bind(this),"undefined"!=typeof window&&(this.location=window.location,this.history=window.history)},q=/^[#\/]|\s+$/g,F=/^\/+|\/+$/g,B=/#.*$/;z.started=!1,x.extend(z.prototype,n,{interval:50,atRoot:function(){return this.location.pathname.replace(/[^\/]$/,"$&/")===this.root&&!this.getSearch()},matchRoot:function(){return this.decodeFragment(this.location.pathname).slice(0,this.root.length-1)+"/"===this.root},decodeFragment:function(t){return decodeURI(t.replace(/%25/g,"%2525"))},getSearch:function(){var t=this.location.href.replace(/#.*/,"").match(/\?.+/);return t?t[0]:""},getHash:function(t){var e=(t||this).location.href.match(/#(.*)$/);return e?e[1]:""},getPath:function(){var t=this.decodeFragment(this.location.pathname+this.getSearch()).slice(this.root.length-1);return"/"===t.charAt(0)?t.slice(1):t},getFragment:function(t){return null==t&&(t=this._usePushState||!this._wantsHashChange?this.getPath():this.getHash()),t.replace(q,"")},start:function(t){if(z.started)throw new Error("Backbone.history has already been started");if(z.started=!0,this.options=x.extend({root:"/"},this.options,t),this.root=this.options.root,this._wantsHashChange=!1!==this.options.hashChange,this._hasHashChange="onhashchange"in window&&(void 0===document.documentMode||7<document.documentMode),this._useHashChange=this._wantsHashChange&&this._hasHashChange,this._wantsPushState=!!this.options.pushState,this._hasPushState=!(!this.history||!this.history.pushState),this._usePushState=this._wantsPushState&&this._hasPushState,this.fragment=this.getFragment(),this.root=("/"+this.root+"/").replace(F,"/"),this._wantsHashChange&&this._wantsPushState){if(!this._hasPushState&&!this.atRoot()){var e=this.root.slice(0,-1)||"/";return this.location.replace(e+"#"+this.getPath()),!0}this._hasPushState&&this.atRoot()&&this.navigate(this.getHash(),{replace:!0})}if(!this._hasHashChange&&this._wantsHashChange&&!this._usePushState){this.iframe=document.createElement("iframe"),this.iframe.src="javascript:0",this.iframe.style.display="none",this.iframe.tabIndex=-1;var i=document.body,n=i.insertBefore(this.iframe,i.firstChild).contentWindow;n.document.open(),n.document.close(),n.location.hash="#"+this.fragment}var s=window.addEventListener||function(t,e){return attachEvent("on"+t,e)};if(this._usePushState?s("popstate",this.checkUrl,!1):this._useHashChange&&!this.iframe?s("hashchange",this.checkUrl,!1):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval)),!this.options.silent)return this.loadUrl()},stop:function(){var t=window.removeEventListener||function(t,e){return detachEvent("on"+t,e)};this._usePushState?t("popstate",this.checkUrl,!1):this._useHashChange&&!this.iframe&&t("hashchange",this.checkUrl,!1),this.iframe&&(document.body.removeChild(this.iframe),this.iframe=null),this._checkUrlInterval&&clearInterval(this._checkUrlInterval),z.started=!1},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(t){var e=this.getFragment();if(e===this.fragment&&this.iframe&&(e=this.getHash(this.iframe.contentWindow)),e===this.fragment)return!1;this.iframe&&this.navigate(e),this.loadUrl()},loadUrl:function(e){return!!this.matchRoot()&&(e=this.fragment=this.getFragment(e),x.some(this.handlers,function(t){if(t.route.test(e))return t.callback(e),!0}))},navigate:function(t,e){if(!z.started)return!1;e&&!0!==e||(e={trigger:!!e}),t=this.getFragment(t||"");var i=this.root;""!==t&&"?"!==t.charAt(0)||(i=i.slice(0,-1)||"/");var n=i+t;t=t.replace(B,"");var s=this.decodeFragment(t);if(this.fragment!==s){if(this.fragment=s,this._usePushState)this.history[e.replace?"replaceState":"pushState"]({},document.title,n);else{if(!this._wantsHashChange)return this.location.assign(n);if(this._updateHash(this.location,t,e.replace),this.iframe&&t!==this.getHash(this.iframe.contentWindow)){var r=this.iframe.contentWindow;e.replace||(r.document.open(),r.document.close()),this._updateHash(r.location,t,e.replace)}}return e.trigger?this.loadUrl(t):void 0}},_updateHash:function(t,e,i){if(i){var n=t.href.replace(/(javascript:|#).*$/,"");t.replace(n+"#"+e)}else t.hash="#"+e}}),h.history=new z;v.extend=m.extend=M.extend=T.extend=z.extend=function(t,e){var i,n=this;return i=t&&x.has(t,"constructor")?t.constructor:function(){return n.apply(this,arguments)},x.extend(i,n,e),i.prototype=x.create(n.prototype,t),(i.prototype.constructor=i).__super__=n.prototype,i};var J=function(){throw new Error('A "url" property or function must be specified')},L=function(e,i){var n=i.error;i.error=function(t){n&&n.call(i.context,e,t,i),e.trigger("error",e,t,i)}};return h});
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
};}
$('body').on('keyup', '.dokan-product-sales-price, .dokan-product-regular-price', debounce_delay(function(evt){
evt.preventDefault();
var product_price=$('input.dokan-product-regular-price').val();
var sale_price_wrap=$('input.dokan-product-sales-price');
var sale_price=sale_price_wrap.val();
var sale_price_input_div=sale_price_wrap.parent('div.dokan-input-group');
var sale_price_input_msg="<span class='error'>" + dokan.i18n_sales_price_error + "</span>";
var sale_price_parent_div=sale_price_input_div.parent('div.sale-price').find('span.error');
if(''==product_price){
sale_price_parent_div.remove();
sale_price_input_div.after(sale_price_input_msg);
sale_price_wrap.val('');
setTimeout(function(){
sale_price_parent_div.remove();
}, 5000);
}else if(parseFloat(product_price) <=parseFloat(sale_price)){
sale_price_parent_div.remove();
sale_price_input_div.after(sale_price_input_msg);
sale_price_wrap.val('');
setTimeout(function(){
sale_price_parent_div.remove();
}, 5000);
}else{
sale_price_parent_div.remove();
}} ,600));
});
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
!function(e){var n={};function t(a){if(n[a])return n[a].exports;var p=n[a]={i:a,l:!1,exports:{}};return e[a].call(p.exports,p,p.exports,t),p.l=!0,p.exports}t.m=e,t.c=n,t.d=function(e,n,a){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:a})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(t.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var p in e)t.d(a,p,function(n){return e[n]}.bind(null,p));return a},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=38)}({38:function(e,n){var t;(t=jQuery)(document).ready((function(){t(".dokan-shipping-calculate-wrapper").on("change","select#dokan-shipping-country",(function(e){e.preventDefault();var n=t(this),a={action:"dokan_shipping_country_select",country_id:n.val(),author_id:n.data("author_id")};""!=n.val()?t.post(dokan.ajaxurl,a,(function(e){e.success&&(n.closest(".dokan-shipping-calculate-wrapper").find(".dokan-shipping-state-wrapper").html(e.data),n.closest(".dokan-shipping-calculate-wrapper").find(".dokan-shipping-price-wrapper").html(""))})):(n.closest(".dokan-shipping-calculate-wrapper").find(".dokan-shipping-price-wrapper").html(""),n.closest(".dokan-shipping-calculate-wrapper").find(".dokan-shipping-state-wrapper").html(""))})),t(".dokan-shipping-calculate-wrapper").on("keydown","#dokan-shipping-qty",(function(e){-1!==t.inArray(e.keyCode,[46,8,9,27,13,91,107,109,110,187,189,190])||65==e.keyCode&&!0===e.ctrlKey||e.keyCode>=35&&e.keyCode<=39||(e.shiftKey||e.keyCode<48||e.keyCode>57)&&(e.keyCode<96||e.keyCode>105)&&e.preventDefault()})),t(".dokan-shipping-calculate-wrapper").on("click","button.dokan-shipping-calculator",(function(e){e.preventDefault();var n=t(this),a={action:"dokan_shipping_calculator",country_id:n.closest(".dokan-shipping-calculate-wrapper").find("select.dokan-shipping-country").val(),product_id:n.closest(".dokan-shipping-calculate-wrapper").find("select.dokan-shipping-country").data("product_id"),author_id:n.closest(".dokan-shipping-calculate-wrapper").find("select.dokan-shipping-country").data("author_id"),quantity:n.closest(".dokan-shipping-calculate-wrapper").find("input.dokan-shipping-qty").val(),state:n.closest(".dokan-shipping-calculate-wrapper").find("select.dokan-shipping-state").val()};t.post(dokan.ajaxurl,a,(function(e){e.success&&n.closest(".dokan-shipping-calculate-wrapper").find(".dokan-shipping-price-wrapper").html(e.data)}))}))}))}});
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