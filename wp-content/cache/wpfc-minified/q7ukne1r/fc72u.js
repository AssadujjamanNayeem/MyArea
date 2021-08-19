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