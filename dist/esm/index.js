function e(e,t,o){return(1-o)*e+o*t}const t={ease:.1};export default function(o={}){const n=document.documentElement,{body:l}=document,i=l.querySelector('[data-lit-scroll="wrapper"]'),s=l.querySelector('[data-lit-scroll="container"]'),r={native:!1};if(!i)throw new Error("[lit-scroll] Wrapper element not found.");if(!s)throw new Error("[lit-scroll] Container element not found.");let c=0;const a=new Set,d=Object.assign(Object.assign({},t),o);let u,w=0,f=0,h=0;function m(){w=window.pageYOffset||n.scrollTop}function y(){s.style.transform=`translate3d(0,${-1*h}px,0)`}function p(){h=w,y()}function v(){const{top:e,height:t}=s.getBoundingClientRect();l.style.height=`${t+e+w}px`}function g(){m(),p(),v()}function b(){if(f){const t=e(h,f,d.ease);h=t,window.scrollTo(0,t)}else{const t=e(h,w,d.ease);h=t>1?t:w}Math.abs(h-w)>1?a.forEach(([e,t])=>{"scroll"===e&&t({docScrollValue:w,scrollValue:h,maxHeight:s.scrollHeight})}):f=null,y(),requestAnimationFrame(b)}return m(),v(),n.classList.add("lit-scroll-initialized"),i.style.position="fixed",i.style.width="100%",i.style.height="100%",i.style.top="0",i.style.left="0",i.style.overflow="hidden",window.addEventListener("resize",g),window.addEventListener("scroll",m),window.ResizeObserver&&(u=new ResizeObserver(e=>{e.forEach(v)}),u.observe(s)),p(),c=requestAnimationFrame(b),{destroy:function(){cancelAnimationFrame(c),u&&u.disconnect(),window.removeEventListener("resize",g),window.removeEventListener("scroll",m),a.clear(),l.style.height="",i.style.position="",i.style.width="",i.style.height="",i.style.top="",i.style.left="",i.style.overflow="",n.classList.remove("lit-scroll-initialized")},getCurrentValue:function(){return w},on:(e,t)=>{a.add([e,t])},off:(e,t)=>{a.delete([e,t])},scrollTo:(e,t={})=>{var o,n,l;const i=Object.assign(Object.assign({},r),t);let s=null;if("number"==typeof e&&(s=e),"string"==typeof e){const t=document.querySelector(e);t&&(s=window.scrollY+t.getBoundingClientRect().top)}return e instanceof Element&&(s=window.scrollY+e.getBoundingClientRect().top),s&&(i.native&&(null===(l=null===(o=window.CSS)||void 0===o?void 0:(n=o).supports)||void 0===l?void 0:l.call(n,"scroll-behavior","smooth"))?window.scrollTo({top:s,behavior:"smooth"}):f=s),s}}}
