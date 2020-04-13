var createLitScroll=function(){"use strict";function e(e,t,o){return(1-o)*e+o*t}const t={ease:.1};return function(o={}){const n=document.documentElement,{body:l}=document,i=l.querySelector('[data-lit-scroll="wrapper"]'),r=l.querySelector('[data-lit-scroll="container"]'),s={native:!1};if(!i)throw new Error("[lit-scroll] Wrapper element not found.");if(!r)throw new Error("[lit-scroll] Container element not found.");let c=0;const a=new Set,d=Object.assign(Object.assign({},t),o);let u,w=0,f=0,h=0,m=0;function v(){w=window.pageYOffset||n.scrollTop}function y(){r.style.transform=`translate3d(0,${-1*h}px,0)`}function g(){m=w,h=w,y()}function p(){const{top:e,height:t}=r.getBoundingClientRect();l.style.height=`${t+e+w}px`}function b(){v(),g(),p()}function E(){if(f){m=f;const t=e(h,m,d.ease);h=t,window.scrollTo(0,t)}else{m=w;const t=e(h,m,d.ease);h=t>1?t:m}Math.abs(h-m)>1?a.forEach(([e,t])=>{"scroll"===e&&t({docScrollValue:w,scrollValue:h,maxHeight:r.scrollHeight})}):f=null,y(),requestAnimationFrame(E)}return v(),p(),n.classList.add("lit-scroll-initialized"),i.style.position="fixed",i.style.width="100%",i.style.height="100%",i.style.top="0",i.style.left="0",i.style.overflow="hidden",window.addEventListener("resize",b),window.addEventListener("scroll",v),window.ResizeObserver&&(u=new ResizeObserver(e=>{e.forEach(p)}),u.observe(r)),g(),c=requestAnimationFrame(E),{destroy:function(){cancelAnimationFrame(c),u&&u.disconnect(),window.removeEventListener("resize",b),window.removeEventListener("scroll",v),a.clear(),l.style.height="",i.style.position="",i.style.width="",i.style.height="",i.style.top="",i.style.left="",i.style.overflow="",n.classList.remove("lit-scroll-initialized")},getCurrentValue:function(){return w},on:(e,t)=>{a.add([e,t])},off:(e,t)=>{a.delete([e,t])},scrollTo:(e,t={})=>{var o,n,l;const i=Object.assign(Object.assign({},s),t);let r=null;if("number"==typeof e&&(r=e),"string"==typeof e){const t=document.querySelector(e);t&&(r=window.scrollY+t.getBoundingClientRect().top)}return e instanceof Element&&(r=window.scrollY+e.getBoundingClientRect().top),r&&(i.native&&(null===(l=null===(o=window.CSS)||void 0===o?void 0:(n=o).supports)||void 0===l?void 0:l.call(n,"scroll-behavior","smooth"))?window.scrollTo({top:r,behavior:"smooth"}):f=r),r}}}}();
