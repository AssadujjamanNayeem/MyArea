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
!function a(o,s,u){function c(t,e){if(!s[t]){if(!o[t]){var r="function"==typeof require&&require;if(!e&&r)return r(t,!0);if(l)return l(t,!0);var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}var i=s[t]={exports:{}};o[t][0].call(i.exports,function(e){return c(o[t][1][e]||e)},i,i.exports,a,o,s,u)}return s[t].exports}for(var l="function"==typeof require&&require,e=0;e<u.length;e++)c(u[e]);return c}({1:[function(e,t,r){"use strict";var n=window.mc4wp||{},i=e("./forms/forms.js");function a(e,t){i.trigger(t[0].id+"."+e,t),i.trigger(e,t)}function o(e,n){document.addEventListener(e,function(e){if(e.target){var t=e.target,r=!1;"string"==typeof t.className&&(r=-1<t.className.indexOf("mc4wp-form")),r||"function"!=typeof t.matches||(r=t.matches(".mc4wp-form *")),r&&n.call(e,e)}},!0)}if(e("./forms/conditional-elements.js"),o("submit",function(e){var t=i.getByElement(e.target);e.defaultPrevented||i.trigger(t.id+".submit",[t,e]),e.defaultPrevented||i.trigger("submit",[t,e])}),o("focus",function(e){var t=i.getByElement(e.target);t.started||(a("started",[t,e]),t.started=!0)}),o("change",function(e){a("change",[i.getByElement(e.target),e])}),n.listeners){for(var s=n.listeners,u=0;u<s.length;u++)i.on(s[u].event,s[u].callback);delete n.listeners}n.forms=i,window.mc4wp=n},{"./forms/conditional-elements.js":2,"./forms/forms.js":4}],2:[function(e,t,r){"use strict";function n(e){for(var t=!!e.getAttribute("data-show-if"),r=t?e.getAttribute("data-show-if").split(":"):e.getAttribute("data-hide-if").split(":"),n=r[0],i=(1<r.length?r[1]:"*").split("|"),a=function(e,t){for(var r=[],n=e.querySelectorAll('input[name="'+t+'"],select[name="'+t+'"],textarea[name="'+t+'"]'),i=0;i<n.length;i++){var a=n[i];("radio"!==a.type&&"checkbox"!==a.type||a.checked)&&r.push(a.value)}return r}(function(e){for(var t=e;t.parentElement;)if("FORM"===(t=t.parentElement).tagName)return t;return null}(e),n),o=!1,s=0;s<a.length;s++){var u=a[s];if(o=-1<i.indexOf(u)||-1<i.indexOf("*")&&0<u.length)break}e.style.display=t?o?"":"none":o?"none":"";var c=e.querySelectorAll("input,select,textarea");[].forEach.call(c,function(e){(o||t)&&e.getAttribute("data-was-required")&&(e.required=!0,e.removeAttribute("data-was-required")),o&&t||!e.required||(e.setAttribute("data-was-required","true"),e.required=!1)})}function i(){var e=document.querySelectorAll(".mc4wp-form [data-show-if],.mc4wp-form [data-hide-if]");[].forEach.call(e,n)}function a(e){if(e.target&&e.target.form&&!(e.target.form.className.indexOf("mc4wp-form")<0)){var t=e.target.form.querySelectorAll("[data-show-if],[data-hide-if]");[].forEach.call(t,n)}}document.addEventListener("keyup",a,!0),document.addEventListener("change",a,!0),document.addEventListener("mc4wp-refresh",i,!0),window.addEventListener("load",i),i()},{}],3:[function(e,t,r){"use strict";function n(e,t){this.id=e,this.element=t||document.createElement("form"),this.name=this.element.getAttribute("data-name")||"Form #"+this.id,this.errors=[],this.started=!1}var i=e("form-serialize"),a=e("populate.js");n.prototype.setData=function(e){try{a(this.element,e)}catch(e){console.error(e)}},n.prototype.getData=function(){return i(this.element,{hash:!0,empty:!0})},n.prototype.getSerializedData=function(){return i(this.element,{hash:!1,empty:!0})},n.prototype.setResponse=function(e){this.element.querySelector(".mc4wp-response").innerHTML=e},n.prototype.reset=function(){this.setResponse(""),this.element.querySelector(".mc4wp-form-fields").style.display="",this.element.reset()},t.exports=n},{"form-serialize":5,"populate.js":6}],4:[function(e,t,r){"use strict";var n=e("./form.js"),i=[],a={};function o(e,t){a[e]=a[e]||[],a[e].forEach(function(e){return e.apply(null,t)})}function s(e,t){t=t||parseInt(e.getAttribute("data-id"))||0;var r=new n(t,e);return i.push(r),r}t.exports={get:function(e){e=parseInt(e);for(var t=0;t<i.length;t++)if(i[t].id===e)return i[t];return s(document.querySelector(".mc4wp-form-"+e),e)},getByElement:function(e){for(var t=e.form||e,r=0;r<i.length;r++)if(i[r].element===t)return i[r];return s(t)},on:function(e,t){a[e]=a[e]||[],a[e].push(t)},off:function(e,t){a[e]=a[e]||[],a[e]=a[e].filter(function(e){return e!==t})},trigger:function(e,t){"submit"===e||0<e.indexOf(".submit")?o(e,t):window.setTimeout(function(){o(e,t)},1)}}},{"./form.js":3}],5:[function(e,t,r){var v=/^(?:submit|button|image|reset|file)$/i,g=/^(?:input|select|textarea|keygen)/i,i=/(\[[^\[\]]*\])/g;function y(e,t,r){if(t.match(i)){!function e(t,r,n){if(0===r.length)return t=n;var i=r.shift(),a=i.match(/^\[(.+?)\]$/);if("[]"===i)return t=t||[],Array.isArray(t)?t.push(e(null,r,n)):(t._values=t._values||[],t._values.push(e(null,r,n))),t;if(a){var o=a[1],s=+o;isNaN(s)?(t=t||{})[o]=e(t[o],r,n):(t=t||[])[s]=e(t[s],r,n)}else t[i]=e(t[i],r,n);return t}(e,function(e){var t=[],r=new RegExp(i),n=/^([^\[\]]*)/.exec(e);for(n[1]&&t.push(n[1]);null!==(n=r.exec(e));)t.push(n[1]);return t}(t),r)}else{var n=e[t];n?(Array.isArray(n)||(e[t]=[n]),e[t].push(r)):e[t]=r}return e}function w(e,t,r){return r=r.replace(/(\r)?\n/g,"\r\n"),r=(r=encodeURIComponent(r)).replace(/%20/g,"+"),e+(e?"&":"")+encodeURIComponent(t)+"="+r}t.exports=function(e,t){"object"!=typeof t?t={hash:!!t}:void 0===t.hash&&(t.hash=!0);for(var r=t.hash?{}:"",n=t.serializer||(t.hash?y:w),i=e&&e.elements?e.elements:[],a=Object.create(null),o=0;o<i.length;++o){var s=i[o];if((t.disabled||!s.disabled)&&s.name&&(g.test(s.nodeName)&&!v.test(s.type))){var u=s.name,c=s.value;if("checkbox"!==s.type&&"radio"!==s.type||s.checked||(c=void 0),t.empty){if("checkbox"!==s.type||s.checked||(c=""),"radio"===s.type&&(a[s.name]||s.checked?s.checked&&(a[s.name]=!0):a[s.name]=!1),null==c&&"radio"==s.type)continue}else if(!c)continue;if("select-multiple"!==s.type)r=n(r,u,c);else{c=[];for(var l=s.options,f=!1,m=0;m<l.length;++m){var d=l[m],p=t.empty&&!d.value,h=d.value||p;d.selected&&h&&(f=!0,r=t.hash&&"[]"!==u.slice(u.length-2)?n(r,u+"[]",d.value):n(r,u,d.value))}!f&&t.empty&&(r=n(r,u,""))}}}if(t.empty)for(var u in a)a[u]||(r=n(r,u,""));return r}},{}],6:[function(e,t,r){void 0!==t&&t.exports&&(t.exports=function e(t,r,n){for(var i in r)if(r.hasOwnProperty(i)){var a=i,o=r[i];if(void 0===o&&(o=""),null===o&&(o=""),void 0!==n&&(a=n+"["+i+"]"),o.constructor===Array)a+="[]";else if("object"==typeof o){e(t,o,a);continue}var s=t.elements.namedItem(a);if(s)switch(s.type||s[0].type){default:s.value=o;break;case"radio":case"checkbox":for(var u=o.constructor===Array?o:[o],c=0;c<s.length;c++)s[c].checked=-1<u.indexOf(s[c].value);break;case"select-multiple":u=o.constructor===Array?o:[o];for(var l=0;l<s.options.length;l++)s.options[l].selected=-1<u.indexOf(s.options[l].value);break;case"select":case"select-one":s.value=o.toString()||o;break;case"date":s.value=new Date(o).toISOString().split("T")[0]}}})},{}]},{},[1]);