function e(e,t,n){return(1-n)*e+n*t}function t(){return/(Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone)/i.test(navigator.userAgent)}function n({on:e}){const t=Array.from(document.querySelectorAll("[data-scroll-parallax]")),n=new Map;t.forEach(e=>{const{dataset:t}=e,o=t.scrollParallaxSpeed?parseFloat(t.scrollParallaxSpeed):1,l=t.scrollParallaxMedia,r=function(e,t=window.scrollY,n=0){return e.getBoundingClientRect().top+t-n}(e);n.set(e,{start:r,end:1e4,speed:o,media:l})}),e("scroll",({scrollValue:e})=>{for(let o=0;o<t.length;o++){const l=t[o],r=n.get(l);r&&(l.style.transform=`translate3d(0,${e-r.start}px,0)`)}})}const o={ease:.1,mobile:!0,components:[]};let l=t();export default function(n={}){const r=document.documentElement,{body:i}=document,s=i.querySelector('[data-lit-scroll="wrapper"]'),c=i.querySelector('[data-lit-scroll="container"]'),a={native:!1};let u=!1,d=!0;if(!s)throw new Error("[lit-scroll] Wrapper element not found.");if(!c)throw new Error("[lit-scroll] Container element not found.");let f=0;const m=new Set,p=Object.assign(Object.assign({},o),n);let v,w=0,h=null,y=0,b=w;function g(e){e.preventDefault()}function E(){d&&(w=window.pageYOffset||r.scrollTop)}function L(){c.style.transform=`translate3d(0,${-1*b}px,0)`}function x(){b=w,(!l||l&&p.mobile)&&L()}function S(){y=c.scrollHeight}function A(){i.style.height=y+"px"}function O(){i.style.height=""}function C(){r.classList.remove("lit-scroll-initialized")}function P(){s.style.position="",s.style.width="",s.style.height="",s.style.top="",s.style.left="",s.style.overflow=""}function V(){c.style.transform="",window.scrollTo({top:w,behavior:"auto"})}function q(){l=t(),T(),E(),x(),S(),(!l||l&&p.mobile)&&A()}function z(){S(),(!l||l&&p.mobile)&&A()}const B=(e,t)=>{m.add([e,t])};function F(){if("number"==typeof h){const t=e(b,h,p.ease);b=t,window.scrollTo({top:b})}else{const t=e(b,w,p.ease);b=t>.5?t:w}Math.abs(b-w)>.5?m.forEach(([e,t])=>{"scroll"===e&&t({docScrollValue:w,scrollValue:b,maxHeight:y})}):h=null,(!l||l&&p.mobile)&&L(),f=requestAnimationFrame(F)}function R(){m.forEach(([,e])=>{e({docScrollValue:w,scrollValue:w,maxHeight:y})}),b=w}function T(){!l||l&&p.mobile?u||(f=requestAnimationFrame(F),A(),r.classList.add("lit-scroll-initialized"),s.style.position="fixed",s.style.width="100%",s.style.height="100%",s.style.top="0",s.style.left="0",s.style.overflow="hidden",document.removeEventListener("scroll",R),u=!0):(u&&(cancelAnimationFrame(f),O(),P(),C(),V(),u=!1),document.addEventListener("scroll",R))}return E(),S(),window.addEventListener("resize",q),window.addEventListener("scroll",E),window.ResizeObserver&&(v=new ResizeObserver(e=>{e.forEach(z)}),v.observe(c)),x(),T(),p.components.forEach(e=>e({on:B})),{destroy:function(){cancelAnimationFrame(f),v&&v.disconnect(),window.removeEventListener("resize",q),window.removeEventListener("scroll",E),m.clear(),O(),P(),C(),V(),document.removeEventListener("scroll",R),u=!1},getCurrentValue:function(){return w},getCurrentLerpValue:function(){return b},on:B,off:(e,t)=>{m.delete([e,t])},scrollTo:(e,t={})=>{var n,o;const r=Object.assign(Object.assign({},a),t);let i=null;if("number"==typeof e&&(i=e),"string"==typeof e){const t=document.querySelector(e);t&&(i=b+t.getBoundingClientRect().top)}return e instanceof Element&&(i=b+e.getBoundingClientRect().top),"number"==typeof i&&(r.native&&(null===(o=null===(n=window.CSS)||void 0===n?void 0:n.supports)||void 0===o?void 0:o.call(n,"scroll-behavior","smooth"))||l&&!p.mobile?window.scrollTo({top:i,behavior:"smooth"}):h=i),i},enable:function(){d=!0,c.removeEventListener("wheel",g),c.removeEventListener("touchmove",g)},disable:function(){d=!1,c.addEventListener("wheel",g,{passive:!1}),c.addEventListener("touchmove",g,{passive:!1})},isEnabled:function(){return d}}}export{n as Parallax};
