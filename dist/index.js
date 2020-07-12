var createLitScroll=function(){"use strict";function e(e,t,o){return(1-o)*e+o*t}function t(){return/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(navigator.userAgent)}const o={ease:.1,mobile:!0};let n=t();return function(l={}){const i=document.documentElement,{body:r}=document,s=r.querySelector('[data-lit-scroll="wrapper"]'),c=r.querySelector('[data-lit-scroll="container"]'),a={native:!1};let d=!1;if(!s)throw new Error("[lit-scroll] Wrapper element not found.");if(!c)throw new Error("[lit-scroll] Container element not found.");let u=0;const f=new Set,m=Object.assign(Object.assign({},o),l);let w,v=0,h=0,y=0,b=0;function p(){v=window.pageYOffset||i.scrollTop}function g(){c.style.transform=`translate3d(0,${-1*b}px,0)`}function E(){b=v,(!n||n&&m.mobile)&&g()}function L(){y=c.scrollHeight}function S(){r.style.height=y+"px"}function O(){r.style.height=""}function z(){i.classList.remove("lit-scroll-initialized")}function A(){s.style.position="",s.style.width="",s.style.height="",s.style.top="",s.style.left="",s.style.overflow=""}function T(){c.style.transform="",window.scrollTo({top:v,behavior:"auto"})}function q(){n=t(),j(),p(),E(),L(),(!n||n&&m.mobile)&&S()}function x(){L(),(!n||n&&m.mobile)&&S()}function C(){if(h){const t=e(b,h,m.ease);b=t,window.scrollTo(0,t)}else{const t=e(b,v,m.ease);b=t>.5?t:v}Math.abs(b-v)>.5?f.forEach(([e,t])=>{"scroll"===e&&t({docScrollValue:v,scrollValue:b,maxHeight:y})}):h=null,(!n||n&&m.mobile)&&g(),u=requestAnimationFrame(C)}function V(){f.forEach(([,e])=>{e({docScrollValue:v,scrollValue:v,maxHeight:y})}),b=v}function j(){!n||n&&m.mobile?d||(u=requestAnimationFrame(C),S(),i.classList.add("lit-scroll-initialized"),s.style.position="fixed",s.style.width="100%",s.style.height="100%",s.style.top="0",s.style.left="0",s.style.overflow="hidden",document.removeEventListener("scroll",V),d=!0):(d&&(cancelAnimationFrame(u),O(),A(),z(),T(),d=!1),document.addEventListener("scroll",V))}return p(),L(),window.addEventListener("resize",q),window.addEventListener("scroll",p),window.ResizeObserver&&(w=new ResizeObserver(e=>{e.forEach(x)}),w.observe(c)),E(),j(),{destroy:function(){cancelAnimationFrame(u),w&&w.disconnect(),window.removeEventListener("resize",q),window.removeEventListener("scroll",p),f.clear(),O(),A(),z(),T(),document.removeEventListener("scroll",V),d=!1},getCurrentValue:function(){return v},on:(e,t)=>{f.add([e,t])},off:(e,t)=>{f.delete([e,t])},scrollTo:(e,t={})=>{var o,l;const i=Object.assign(Object.assign({},a),t);let r=null;if("number"==typeof e&&(r=e),"string"==typeof e){const t=document.querySelector(e);t&&(r=window.scrollY+t.getBoundingClientRect().top)}return e instanceof Element&&(r=window.scrollY+e.getBoundingClientRect().top),r&&(i.native&&(null===(l=null===(o=window.CSS)||void 0===o?void 0:o.supports)||void 0===l?void 0:l.call(o,"scroll-behavior","smooth"))?window.scrollTo({top:r,behavior:"smooth"}):(h=r,n&&!m.mobile&&window.scrollTo({top:r,behavior:"smooth"}))),r}}}}();
