!function(e,o){"object"==typeof exports&&"undefined"!=typeof module?module.exports=o():"function"==typeof define&&define.amd?define(o):(e=e||self).LitScroll=o()}(this,(function(){"use strict";
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
    ***************************************************************************** */var e=function(){return(e=Object.assign||function(e){for(var o,t=1,n=arguments.length;t<n;t++)for(var r in o=arguments[t])Object.prototype.hasOwnProperty.call(o,r)&&(e[r]=o[r]);return e}).apply(this,arguments)};function o(e,o,t){return(1-t)*e+t*o}var t={ease:.1};return function(n){void 0===n&&(n=t);var r=document.body.querySelector("[data-lit-scroll-wrapper]"),l=document.body.querySelector("[data-lit-scroll-container]");if(!r)throw new Error("[lit-scroll] Wrapper element not found.");if(!l)throw new Error("[lit-scroll] Container element not found.");var i=0,s=new Set,c=e(e({},t),n),u={docScroll:0,scrollToValue:null,windowWidth:window.innerWidth,windowHeight:window.innerHeight},d={previous:0,current:0,ease:c.ease,setValue:function(){return u.docScroll}};function a(){u.windowWidth=window.innerWidth,u.windowHeight=window.innerHeight}function f(){u.docScroll=window.pageYOffset||document.documentElement.scrollTop}function w(){l.style.transform="translate3d(0,"+-1*d.previous+"px,0)"}function v(){document.body.style.height=l.scrollHeight+"px"}function p(){a(),v()}function h(){if(u.scrollToValue){d.current=u.scrollToValue;var e=o(d.previous,d.current,d.ease);d.previous=e,window.scrollTo(0,e)}else d.current=d.setValue(),d.previous=o(d.previous,d.current,d.ease);Math.abs(d.previous-d.current)>.9?s.forEach((function(e){var o=e[0],t=e[1];"scroll"===o&&t({docScrollValue:u.docScroll,scrollValue:d.previous,maxHeight:l.scrollHeight})})):u.scrollToValue=null,w(),requestAnimationFrame(h)}return f(),a(),v(),d.current=d.setValue(),d.previous=d.setValue(),w(),r.style.position="fixed",r.style.width="100%",r.style.height="100%",r.style.top="0",r.style.left="0",r.style.overflow="hidden",window.addEventListener("resize",p),window.addEventListener("scroll",f),i=requestAnimationFrame(h),document.documentElement.classList.add("lit-scroll-initialized"),{getCurrentValue:function(){return u.docScroll},on:function(e,o){s.add([e,o])},scrollTo:function(e,o){var t,n,r;void 0===o&&(o={native:!1});var l=null;if("number"==typeof e&&(l=e),"string"==typeof e){var i=document.querySelector(e);i&&(l=window.scrollY+i.getBoundingClientRect().top)}return e instanceof Element&&(l=window.scrollY+e.getBoundingClientRect().top),l&&(o.native&&(null===(r=null===(t=window.CSS)||void 0===t?void 0:(n=t).supports)||void 0===r?void 0:r.call(n,"scroll-behavior","smooth"))?window.scrollTo({top:l,behavior:"smooth"}):u.scrollToValue=l),l},destroy:function(){cancelAnimationFrame(i),window.removeEventListener("resize",p),window.removeEventListener("scroll",f),s.clear(),document.body.style.height="",r.style.position="",r.style.width="",r.style.height="",r.style.top="",r.style.left="",r.style.overflow="",document.documentElement.classList.remove("lit-scroll-initialized")}}}}));
