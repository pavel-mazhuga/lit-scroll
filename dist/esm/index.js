function e(e,o,t){return(1-t)*e+t*o}const o={ease:.1};export default function(t={}){const l=document.documentElement,{body:n}=document,i=n.querySelector('[data-lit-scroll="wrapper"]'),r=n.querySelector('[data-lit-scroll="container"]'),s={native:!1};if(!i)throw new Error("[lit-scroll] Wrapper element not found.");if(!r)throw new Error("[lit-scroll] Container element not found.");let c=0;const d=new Set,a=Object.assign(Object.assign({},o),t),w={docScroll:0,scrollToValue:null,windowWidth:window.innerWidth,windowHeight:window.innerHeight};let u,f=0,h=0;function g(){w.windowWidth=window.innerWidth,w.windowHeight=window.innerHeight}function m(){w.docScroll=window.pageYOffset||l.scrollTop}function v(){r.style.transform=`translate3d(0,${-1*f}px,0)`}function y(){var e;n.style.height=`${r.scrollHeight+(e=r,e.getBoundingClientRect().top+window.scrollY)}px`}function p(){g(),y()}function S(){if(w.scrollToValue){h=w.scrollToValue;const o=e(f,h,a.ease);f=o,window.scrollTo(0,o)}else{h=w.docScroll;const o=e(f,h,a.ease);f=o>1?o:h}Math.abs(f-h)>1?d.forEach(([e,o])=>{"scroll"===e&&o({docScrollValue:w.docScroll,scrollValue:f,maxHeight:r.scrollHeight})}):w.scrollToValue=null,v(),requestAnimationFrame(S)}return m(),g(),y(),l.classList.add("lit-scroll-initialized"),i.style.position="fixed",i.style.width="100%",i.style.height="100%",i.style.top="0",i.style.left="0",i.style.overflow="hidden",window.addEventListener("resize",p),window.addEventListener("scroll",m),window.ResizeObserver&&(u=new ResizeObserver(e=>{e.forEach(y)}),u.observe(r)),h=w.docScroll,f=w.docScroll,v(),c=requestAnimationFrame(S),{destroy:function(){cancelAnimationFrame(c),u&&u.disconnect(),window.removeEventListener("resize",p),window.removeEventListener("scroll",m),d.clear(),n.style.height="",i.style.position="",i.style.width="",i.style.height="",i.style.top="",i.style.left="",i.style.overflow="",l.classList.remove("lit-scroll-initialized")},getCurrentValue:function(){return w.docScroll},on:(e,o)=>{d.add([e,o])},off:(e,o)=>{d.delete([e,o])},scrollTo:(e,o={})=>{var t,l,n;const i=Object.assign(Object.assign({},s),o);let r=null;if("number"==typeof e&&(r=e),"string"==typeof e){const o=document.querySelector(e);o&&(r=window.scrollY+o.getBoundingClientRect().top)}return e instanceof Element&&(r=window.scrollY+e.getBoundingClientRect().top),r&&(i.native&&(null===(n=null===(t=window.CSS)||void 0===t?void 0:(l=t).supports)||void 0===n?void 0:n.call(l,"scroll-behavior","smooth"))?window.scrollTo({top:r,behavior:"smooth"}):w.scrollToValue=r),r}}}
