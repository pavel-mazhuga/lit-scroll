function e(e,t,n){return(1-n)*e+n*t}function t(){return/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(navigator.userAgent)}const n={ease:.1,mobile:!0},o={native:!1};let i=t();export default function(r={}){const l=document.documentElement,{body:s}=document,c=s.querySelector('[data-lit-scroll="wrapper"]');if(!c)throw new Error("[lit-scroll] Wrapper element not found.");const a=s.querySelector('[data-lit-scroll="container"]');if(!a)throw new Error("[lit-scroll] Container element not found.");let u=!1,d=!0,f=0;const m=new Set,v=Object.assign(Object.assign({},n),r);let w,p=0,h=null,b=0,y=p,g=0;const E=Array.from(a.querySelectorAll('[data-lit-scroll="section"]')),L="IntersectionObserver"in window?new IntersectionObserver(e=>{e.forEach(e=>{e.target.style.visibility=e.isIntersecting?"":"hidden"})},{rootMargin:"100px 0px"}):null;function S(e){e.preventDefault()}function O(){p=window.pageYOffset||l.scrollTop}function x(){a.style.transform=`translate3d(0,${-y}px,0)`}function A(){d&&(y=p),(!i||i&&v.mobile)&&x()}function q(){b=a.scrollHeight}function z(){s.style.height=b+"px"}function C(){s.style.height=""}function V(){l.classList.remove("lit-scroll-initialized")}function T(){c.style.position="",c.style.width="",c.style.height="",c.style.top="",c.style.left="",c.style.overflow=""}function j(){a.style.transform="",window.scrollTo({top:p,behavior:"auto"})}function B(){i=t(),H(),O(),A(),q(),(!i||i&&v.mobile)&&z()}function F(){q(),(!i||i&&v.mobile)&&z()}function P(){if("number"==typeof h){const t=e(y,h,v.ease);y=t,window.scrollTo({top:y})}else{const t=e(y,p,v.ease);g=t-y,y=t>.5?t:p}Math.abs(y-p)>.5?m.forEach(([e,t])=>{"scroll"===e&&t({docScrollValue:p,scrollValue:y,maxHeight:b,speed:g})}):h=null,(!i||i&&v.mobile)&&x(),f=requestAnimationFrame(P)}function R(){m.forEach(([,e])=>{e({docScrollValue:p,scrollValue:p,maxHeight:b,speed:g})}),y=p}function H(){!i||i&&v.mobile?u||(f=requestAnimationFrame(P),z(),l.classList.add("lit-scroll-initialized"),c.style.position="fixed",c.style.width="100%",c.style.height="100%",c.style.top="0",c.style.left="0",c.style.overflow="hidden",document.removeEventListener("scroll",R),u=!0):u&&(cancelAnimationFrame(f),C(),T(),V(),j(),u=!1,document.addEventListener("scroll",R,{passive:!1}))}return O(),q(),window.addEventListener("resize",B),window.addEventListener("scroll",O,{passive:!1}),window.ResizeObserver&&(w=new ResizeObserver(e=>{e.forEach(F)}),w.observe(a)),L&&E.forEach(e=>L.observe(e)),A(),H(),{destroy:function(){cancelAnimationFrame(f),w&&w.disconnect(),window.removeEventListener("resize",B),window.removeEventListener("scroll",O),L&&L.disconnect(),m.clear(),C(),T(),V(),j(),document.removeEventListener("scroll",R),u=!1},getCurrentValue:function(){return p},getCurrentLerpValue:function(){return y},getSpeed:function(){return g},on:(e,t)=>{m.add([e,t])},off:(e,t)=>{m.delete([e,t])},scrollTo:(e,t={})=>{var n,r;const l=Object.assign(Object.assign({},o),t);let s=null;if("number"==typeof e&&(s=e),"string"==typeof e){const t=document.querySelector(e);t&&(s=y+t.getBoundingClientRect().top)}return e instanceof Element&&(s=y+e.getBoundingClientRect().top),"number"==typeof s&&(l.native&&(null===(r=null===(n=window.CSS)||void 0===n?void 0:n.supports)||void 0===r?void 0:r.call(n,"scroll-behavior","smooth"))||i&&!v.mobile?window.scrollTo({top:s,behavior:"smooth"}):h=s),s},enable:function(){d=!0,a.removeEventListener("wheel",S),a.removeEventListener("touchmove",S)},disable:function(){d=!1,a.addEventListener("wheel",S,{passive:!1}),a.addEventListener("touchmove",S,{passive:!1})},isEnabled:function(){return d}}}
