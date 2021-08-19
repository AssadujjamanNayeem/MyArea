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