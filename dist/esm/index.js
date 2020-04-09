/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var e=function(){return(e=Object.assign||function(e){for(var o,t=1,n=arguments.length;t<n;t++)for(var l in o=arguments[t])Object.prototype.hasOwnProperty.call(o,l)&&(e[l]=o[l]);return e}).apply(this,arguments)};function o(e,o,t){return(1-t)*e+t*o}var t={ease:.1};export default function(n){void 0===n&&(n=t);var l=document.documentElement,i=document.body,r=i.querySelector('[data-lit-scroll="wrapper"]'),c=i.querySelector('[data-lit-scroll="container"]');if(!r)throw new Error("[lit-scroll] Wrapper element not found.");if(!c)throw new Error("[lit-scroll] Container element not found.");var s,d=0,a=new Set,u=e(e({},t),n),w={docScroll:0,scrollToValue:null,windowWidth:window.innerWidth,windowHeight:window.innerHeight},f=0,h=0;function v(){w.windowWidth=window.innerWidth,w.windowHeight=window.innerHeight}function p(){w.docScroll=window.pageYOffset||l.scrollTop}function y(){c.style.transform="translate3d(0,"+-1*f+"px,0)"}function g(){i.style.height=c.scrollHeight+c.getBoundingClientRect().top+"px"}function m(){v(),g()}function S(){if(w.scrollToValue){h=w.scrollToValue;var e=o(f,h,u.ease);f=e,window.scrollTo(0,e)}else h=w.docScroll,f=o(f,h,u.ease);Math.abs(f-h)>.9?a.forEach((function(e){var o=e[0],t=e[1];"scroll"===o&&t({docScrollValue:w.docScroll,scrollValue:f,maxHeight:c.scrollHeight})})):w.scrollToValue=null,y(),requestAnimationFrame(S)}return p(),v(),g(),h=w.docScroll,f=w.docScroll,y(),r.style.position="fixed",r.style.width="100%",r.style.height="100%",r.style.top="0",r.style.left="0",r.style.overflow="hidden",window.addEventListener("resize",m),window.addEventListener("scroll",p),window.ResizeObserver&&(s=new ResizeObserver((function(e){e.forEach((function(){g()}))}))).observe(c),d=requestAnimationFrame(S),l.classList.add("lit-scroll-initialized"),{destroy:function(){cancelAnimationFrame(d),s&&s.disconnect(),window.removeEventListener("resize",m),window.removeEventListener("scroll",p),a.clear(),i.style.height="",r.style.position="",r.style.width="",r.style.height="",r.style.top="",r.style.left="",r.style.overflow="",l.classList.remove("lit-scroll-initialized")},getCurrentValue:function(){return w.docScroll},on:function(e,o){a.add([e,o])},off:function(e,o){a.delete([e,o])},scrollTo:function(e,o){var t,n,l;void 0===o&&(o={native:!1});var i=null;if("number"==typeof e&&(i=e),"string"==typeof e){var r=document.querySelector(e);r&&(i=window.scrollY+r.getBoundingClientRect().top)}return e instanceof Element&&(i=window.scrollY+e.getBoundingClientRect().top),i&&(o.native&&(null===(l=null===(t=window.CSS)||void 0===t?void 0:(n=t).supports)||void 0===l?void 0:l.call(n,"scroll-behavior","smooth"))?window.scrollTo({top:i,behavior:"smooth"}):w.scrollToValue=i),i}}}
