var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return n||t(r,Symbol.toStringTag,{value:`Module`}),r},c=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},l=(n,r,o)=>(o=n==null?{}:e(i(n)),c(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var u=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.for(`react.view_transition`),m=Symbol.iterator;function h(e){return typeof e!=`object`||!e?null:(e=m&&e[m]||e[`@@iterator`],typeof e==`function`?e:null)}var g={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},_=Object.assign,v={};function y(e,t,n){this.props=e,this.context=t,this.refs=v,this.updater=n||g}y.prototype.isReactComponent={},y.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},y.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function b(){}b.prototype=y.prototype;function ee(e,t,n){this.props=e,this.context=t,this.refs=v,this.updater=n||g}var te=ee.prototype=new b;te.constructor=ee,_(te,y.prototype),te.isPureReactComponent=!0;var ne=Array.isArray;function re(){}var x={H:null,A:null,T:null,S:null},S=Object.prototype.hasOwnProperty;function C(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function w(e,t){return C(e.type,t,e.props)}function ie(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function ae(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var oe=/\/+/g;function se(e,t){return typeof e==`object`&&e&&e.key!=null?ae(``+e.key):t.toString(36)}function T(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(re,re):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function ce(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,ce(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+se(e,0):a,ne(o)?(i=``,c!=null&&(i=c.replace(oe,`$&/`)+`/`),ce(o,r,i,``,function(e){return e})):o!=null&&(ie(o)&&(o=w(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(oe,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(ne(e))for(var u=0;u<e.length;u++)a=e[u],s=l+se(a,u),c+=ce(a,r,i,s,o);else if(u=h(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+se(a,u++),c+=ce(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return ce(T(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function le(e,t,n){if(e==null)return e;var r=[],i=0;return ce(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function ue(e){if(e._status===-1){var t=e._result,n=t();n.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t,n.status===void 0&&(n.status=`fulfilled`,n.value=t))},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t,n.status===void 0&&(n.status=`rejected`,n.reason=t))}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var de=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)};function fe(e){var t=x.T,n={};n.types=t===null?null:t.types,x.T=n;try{var r=e(),i=x.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(re,de)}catch(e){de(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),x.T=t}}function pe(e){var t=x.T;if(t!==null){var n=t.types;n===null?t.types=[e]:n.indexOf(e)===-1&&n.push(e)}else fe(pe.bind(null,e))}var me={map:le,forEach:function(e,t,n){le(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return le(e,function(){t++}),t},toArray:function(e){return le(e,function(e){return e})||[]},only:function(e){if(!ie(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=me,e.Component=y,e.Fragment=r,e.Profiler=a,e.PureComponent=ee,e.StrictMode=i,e.Suspense=l,e.ViewTransition=p,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=x,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return x.H.useMemoCache(e)}},e.addTransitionType=pe,e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=_({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!S.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return C(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)S.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return C(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=ie,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:ue}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=fe,e.unstable_useCacheRefresh=function(){return x.H.useCacheRefresh()},e.use=function(e){return x.H.use(e)},e.useActionState=function(e,t,n){return x.H.useActionState(e,t,n)},e.useCallback=function(e,t){return x.H.useCallback(e,t)},e.useContext=function(e){return x.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return x.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return x.H.useEffect(e,t)},e.useEffectEvent=function(e){return x.H.useEffectEvent(e)},e.useId=function(){return x.H.useId()},e.useImperativeHandle=function(e,t,n){return x.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return x.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return x.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return x.H.useMemo(e,t)},e.useOptimistic=function(e,t){return x.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return x.H.useReducer(e,t,n)},e.useRef=function(e){return x.H.useRef(e)},e.useState=function(e){return x.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return x.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return x.H.useTransition()},e.version=`19.3.0`})),d=o(((e,t)=>{t.exports=u()})),f=o((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function ee(e){if(h=!1,b(e),!m){if(n(c)!==null)m=!0,te||(te=!0,w());else{var t=n(l);t!==null&&oe(ee,t.startTime-e)}}}var te=!1,ne=-1,re=5,x=-1;function S(){return g?!0:!(e.unstable_now()-x<re)}function C(){if(g=!1,te){var t=e.unstable_now();x=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(ne),ne=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&S());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&oe(ee,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?w():te=!1}}}var w;if(typeof y==`function`)w=function(){y(C)};else if(typeof MessageChannel<`u`){var ie=new MessageChannel,ae=ie.port2;ie.port1.onmessage=C,w=function(){ae.postMessage(null)}}else w=function(){_(C,0)};function oe(t,n){ne=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):re=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(ne),ne=-1):h=!0,oe(ee,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,te||(te=!0,w()))),r},e.unstable_shouldYield=S,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),p=o(((e,t)=>{t.exports=f()})),m=o((e=>{var t=d();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var i={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},a=Symbol.for(`react.portal`),o=Symbol.for(`react.recoverable`),s=Symbol.for(`react.optimistic_key`);function c(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:a,key:r==null?null:r===s?s:``+r,children:e,containerInfo:t,implementation:n}}var l=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function u(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,e.browser=function(e){return{$$typeof:o,_reason:e}},e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return c(e,t,null,r)},e.flushSync=function(e){var t=l.T,n=i.p;try{if(l.T=null,i.p=2,e)return e()}finally{l.T=t,i.p=n,i.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,i.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&i.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=u(n,t.crossOrigin),a=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?i.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:a,fetchPriority:o}):n===`script`&&i.d.X(e,{crossOrigin:r,integrity:a,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`){if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=u(t.as,t.crossOrigin);i.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}}else t??i.d.M(e)}},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=u(n,t.crossOrigin);i.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`){if(t){var n=u(t.as,t.crossOrigin);i.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}else i.d.m(e)}},e.requestFormReset=function(e){i.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return l.H.useFormState(e,t,n)},e.useFormStatus=function(){return l.H.useHostTransitionStatus()},e.version=`19.3.0`})),h=o(((e,t)=>{function n(){if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE==`function`)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=m()})),g=o((e=>{var t=p(),n=d(),r=h();function i(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function a(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function o(e){for(var t=e,n=t;n&&!n.alternate;)t=n,t.flags&4098&&(e=t.return),n=t.return;for(;t.return;)t=t.return;return t.tag===3?e:null}function s(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function c(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function l(e){if(o(e)!==e)throw Error(i(188))}function u(e){var t=e.alternate;if(!t){if(t=o(e),t===null)throw Error(i(188));return t===e?e:null}for(var n=e,r=t;;){var a=n.return;if(a===null)break;var s=a.alternate;if(s===null){if(r=a.return,r!==null){n=r;continue}break}if(a.child===s.child){for(s=a.child;s;){if(s===n)return l(a),e;if(s===r)return l(a),t;s=s.sibling}throw Error(i(188))}if(n.return!==r.return)n=a,r=s;else{for(var c=!1,u=a.child;u;){if(u===n){c=!0,n=a,r=s;break}if(u===r){c=!0,r=a,n=s;break}u=u.sibling}if(!c){for(u=s.child;u;){if(u===n){c=!0,n=s,r=a;break}if(u===r){c=!0,r=s,n=a;break}u=u.sibling}if(!c)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function f(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=f(e),t!==null)return t;e=e.sibling}return null}function m(e,t,n,r,i,a){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&n(e,r,i,a)||(e.tag!==22||e.memoizedState===null)&&(t||e.tag!==5&&e.tag!==27)&&m(e.child,t,n,r,i,a))return!0;e=e.sibling}return!1}function g(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function _(e){var t=!1;for(e=e.return;e!==null&&(e.tag===4&&(t=!0),e.tag!==3&&e.tag!==5&&e.tag!==27);)e=e.return;return t}function v(e){var t=[null,null],n=g(e);return n===null||y(t,e,n.child,{foundSelf:!1}),t}function y(e,t,n,r){for(;n!==null;){if(n===t)r.foundSelf=!0;else if(n.tag===5||n.tag===27||n.tag===6){if(r.foundSelf)return e[1]=n,!0;e[0]=n}else if((n.tag!==22||n.memoizedState===null)&&y(e,t,n.child,r))return!0;n=n.sibling}return!1}function b(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(i(559))}}var ee=null,te=null;function ne(e,t,n){return e===n||e===t&&(ee=e,!0)}function re(e,t,n){return e===n?(te=e,!1):e===t&&(te!==null&&(ee=e),!0)}function x(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function S(e,t,n){for(var r=0,i=e;i;i=n(i))r++;i=0;for(var a=t;a;a=n(a))i++;for(;0<r-i;)e=n(e),r--;for(;0<i-r;)t=n(t),i--;for(;r--;){if(e===t||t!==null&&e===t.alternate)return e;e=n(e),t=n(t)}return null}var C=Object.assign,w=Symbol.for(`react.element`),ie=Symbol.for(`react.transitional.element`),ae=Symbol.for(`react.portal`),oe=Symbol.for(`react.fragment`),se=Symbol.for(`react.strict_mode`),T=Symbol.for(`react.profiler`),ce=Symbol.for(`react.consumer`),le=Symbol.for(`react.context`),ue=Symbol.for(`react.forward_ref`),de=Symbol.for(`react.suspense`),fe=Symbol.for(`react.suspense_list`),pe=Symbol.for(`react.memo`),me=Symbol.for(`react.lazy`),he=Symbol.for(`react.activity`),ge=Symbol.for(`react.legacy_hidden`),_e=Symbol.for(`react.memo_cache_sentinel`),ve=Symbol.for(`react.view_transition`),ye=Symbol.for(`react.recoverable`),be=Symbol.iterator;function xe(e){return typeof e!=`object`||!e?null:(e=be&&e[be]||e[`@@iterator`],typeof e==`function`?e:null)}var Se=Symbol.for(`react.client.reference`);function Ce(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===Se?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case oe:return`Fragment`;case T:return`Profiler`;case se:return`StrictMode`;case de:return`Suspense`;case fe:return`SuspenseList`;case he:return`Activity`;case ve:return`ViewTransition`}if(typeof e==`object`)switch(e.$$typeof){case ae:return`Portal`;case le:return e.displayName||`Context`;case ce:return(e._context.displayName||`Context`)+`.Consumer`;case ue:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case pe:return t=e.displayName||null,t===null?Ce(e.type)||`Memo`:t;case me:t=e._payload,e=e._init;try{return Ce(e(t))}catch{}}return null}var E=Array.isArray,D=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,O=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,k={pending:!1,data:null,method:null,action:null},A=[],we=-1;function j(e){return{current:e}}function M(e){0>we||(e.current=A[we],A[we]=null,we--)}function N(e,t){we++,A[we]=e.current,e.current=t}var Te=j(null),Ee=j(null),De=j(null),Oe=j(null);function ke(e,t){switch(N(De,t),N(Ee,e),N(Te,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?up(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=up(t),e=dp(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}M(Te),N(Te,e)}function Ae(){M(Te),M(Ee),M(De)}function je(e){var t=e.memoizedState;t!==null&&(sh._currentValue=t.memoizedState,N(Oe,e)),t=Te.current;var n=dp(t,e.type);t!==n&&(N(Ee,e),N(Te,n))}function Me(e){Ee.current===e&&(M(Te),M(Ee)),Oe.current===e&&(M(Oe),sh._currentValue=k)}var Ne,Pe;function Fe(e){if(Ne===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);Ne=t&&t[1]||``,Pe=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+Ne+e+Pe}var Ie=!1;function Le(e,t){if(!e||Ie)return``;Ie=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}n=!1;try{var i=Object.getOwnPropertyDescriptor(e.prototype,`props`);Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),n=!0,new e}finally{n&&(i===void 0?delete e.prototype.props:Object.defineProperty(e.prototype,"props",i))}}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{Ie=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?Fe(n):``}function Re(e,t){switch(e.tag){case 26:case 27:case 5:return Fe(e.type);case 16:return Fe(`Lazy`);case 13:return e.child!==t&&t!==null?Fe(`Suspense Fallback`):Fe(`Suspense`);case 19:return Fe(`SuspenseList`);case 0:case 15:return Le(e.type,!1);case 11:return Le(e.type.render,!1);case 1:return Le(e.type,!0);case 31:return Fe(`Activity`);case 30:return Fe(`ViewTransition`);default:return``}}function ze(e){try{var t=``,n=null;do t+=Re(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var Be=Object.prototype.hasOwnProperty,Ve=t.unstable_scheduleCallback,He=t.unstable_cancelCallback,Ue=t.unstable_shouldYield,We=t.unstable_requestPaint,Ge=t.unstable_now,Ke=t.unstable_getCurrentPriorityLevel,qe=t.unstable_ImmediatePriority,Je=t.unstable_UserBlockingPriority,Ye=t.unstable_NormalPriority,Xe=t.unstable_LowPriority,Ze=t.unstable_IdlePriority,Qe=t.log,$e=t.unstable_setDisableYieldValue,et=null,tt=null;function nt(e){if(typeof Qe==`function`&&$e(e),tt&&typeof tt.setStrictMode==`function`)try{tt.setStrictMode(et,e)}catch{}}var rt=Math.clz32?Math.clz32:ot,it=Math.log,at=Math.LN2;function ot(e){return e>>>=0,e===0?32:31-(it(e)/at|0)|0}var st=256,ct=262144,lt=4194304;function ut(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function dt(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=ut(n))):i=ut(o):i=ut(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=ut(n))):i=ut(o)):i=ut(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function ft(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function pt(e,t){t&8&&(t|=t&32);var n=e.entangledLanes;if(n!==0)for(e=e.entanglements,n&=t;0<n;){var r=31-rt(n),i=1<<r;t|=e[r],n&=~i}return t}function mt(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function ht(){var e=lt;return lt<<=1,!(lt&62914560)&&(lt=4194304),e}function gt(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function _t(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function vt(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-rt(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&yt(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function yt(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-rt(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function bt(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-rt(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function xt(e,t){var n=t&-t;return n=n&42?1:St(n),(n&(e.suspendedLanes|t))===0?n:0}function St(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Ct(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function wt(){var e=O.p;return e===0?(e=window.event,e===void 0?32:Ch(e.type)):e}function Tt(e,t){var n=O.p;try{return O.p=e,t()}finally{O.p=n}}var Et=Math.random().toString(36).slice(2),Dt=`__reactFiber$`+Et,Ot=`__reactProps$`+Et,kt=`__reactContainer$`+Et,At=`__reactEvents$`+Et,jt=`__reactListeners$`+Et,Mt=`__reactHandles$`+Et,Nt=`__reactResources$`+Et,Pt=`__reactMarker$`+Et,Ft=`__reactLoad$`+Et;function It(e){delete e[Dt],delete e[Ot],delete e[jt],delete e[Mt]}function Lt(e){var t;if(t=e[Dt])return t;for(var n=e.parentNode;n;){if(t=n[kt]||n[Dt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=fm(e);e!==null;){if(n=e[Dt])return n;e=fm(e)}return t}e=n,n=e.parentNode}return null}function Rt(e){if(e=e[Dt]||e[kt]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function zt(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(i(33))}function Bt(e){var t=e[Nt];return t||=e[Nt]={hoistableStyles:new Map,hoistableScripts:new Map},t}function Vt(e){e[Pt]=!0}function Ht(e){e[Ft]=void 0}var Ut=new Set,Wt={};function Gt(e,t){Kt(e,t),Kt(e+`Capture`,t)}function Kt(e,t){for(Wt[e]=t,e=0;e<t.length;e++)Ut.add(t[e])}var qt=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),Jt={},Yt={};function Xt(e){return Be.call(Yt,e)?!0:Be.call(Jt,e)?!1:qt.test(e)?Yt[e]=!0:(Jt[e]=!0,!1)}var P=!1;function Zt(){var e=P;return P=!1,e}function Qt(e,t,n){if(Xt(t)){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,n)}}}function $t(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,n)}}function en(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,r)}}function tn(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function F(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function nn(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function I(e){if(!e._valueTracker){var t=F(e)?`checked`:`value`;e._valueTracker=nn(e,t,``+e[t])}}function rn(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=F(e)?e.checked?`true`:`false`:e.value),e=r,e!==n&&(t.setValue(e),!0)}var an=/[\n"\\]/g;function on(e){return e.replace(an,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function sn(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+tn(t)):e.value!==``+tn(t)&&(e.value=``+tn(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):cn(e,tn(n)):o===`number`&&e.value==t?cn(e,tn(e.value)):cn(e,tn(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+tn(s):e.removeAttribute(`name`)}function L(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){I(e);return}n=n==null?``:``+tn(n),t=t==null?n:``+tn(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),I(e)}function cn(e,t){e.defaultValue!==``+t&&(e.defaultValue=``+t)}function ln(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+tn(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function un(e,t,n){if(t!=null&&(t=``+tn(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n==null?``:``+tn(n)}function dn(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(i(92));if(E(r)){if(1<r.length)throw Error(i(93));r=r[0]}n=r}n??=``,t=n}n=tn(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),I(e)}function fn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var pn=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function mn(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||pn.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function hn(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(i(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``,P=!0);for(var a in t)r=t[a],t.hasOwnProperty(a)&&n[a]!==r&&(mn(e,a,r),P=!0)}else for(var o in t)t.hasOwnProperty(o)&&mn(e,o,t[o])}function gn(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var _n=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`maskType`,`mask-type`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),vn=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function yn(e){return vn.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function bn(){}var xn=null;function Sn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Cn=null,wn=null;function Tn(e){var t=Rt(e);if(t&&(e=t.stateNode)){var n=e[Ot]||null;a:switch(e=t.stateNode,t.type){case`input`:if(sn(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+on(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var a=r[Ot]||null;if(!a)throw Error(i(90));sn(r,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&rn(r)}break a;case`textarea`:un(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&ln(e,!!n.multiple,t,!1)}}}var En=!1;function Dn(e,t,n){if(En)return e(t,n);En=!0;try{return e(t)}finally{if(En=!1,(Cn!==null||wn!==null)&&(zd(),Cn&&(t=Cn,e=wn,wn=Cn=null,Tn(t),e)))for(t=0;t<e.length;t++)Tn(e[t])}}function On(e,t){var n=e.stateNode;if(n===null)return null;var r=n[Ot]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=e!==`button`&&e!==`input`&&e!==`select`&&e!==`textarea`),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(i(231,t,typeof n));return n}var kn=typeof window<`u`&&window.document!==void 0&&window.document.createElement!==void 0,An=!1;if(kn)try{var jn={};Object.defineProperty(jn,"passive",{get:function(){An=!0}}),window.addEventListener(`test`,jn,jn),window.removeEventListener(`test`,jn,jn)}catch{An=!1}var Mn=null,Nn=null,Pn=null;function Fn(){if(Pn)return Pn;var e,t=Nn,n=t.length,r,i=`value`in Mn?Mn.value:Mn.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return Pn=i.slice(e,1<r?1-r:void 0)}function In(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Ln(){return!0}function Rn(){return!1}function zn(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?Ln:Rn,this.isPropagationStopped=Rn,this}return C(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=Ln)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=Ln)},persist:function(){},isPersistent:Ln}),t}var Bn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Vn=zn(Bn),Hn=C({},Bn,{view:0,detail:0}),Un=zn(Hn),Wn,Gn,Kn,qn=C({},Hn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:ir,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==Kn&&(Kn&&e.type===`mousemove`?(Wn=e.screenX-Kn.screenX,Gn=e.screenY-Kn.screenY):Gn=Wn=0,Kn=e),Wn)},movementY:function(e){return`movementY`in e?e.movementY:Gn}}),Jn=zn(qn),Yn=zn(C({},qn,{dataTransfer:0})),Xn=zn(C({},Hn,{relatedTarget:0})),Zn=zn(C({},Bn,{animationName:0,elapsedTime:0,pseudoElement:0})),Qn=zn(C({},Bn,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),$n=zn(C({},Bn,{data:0})),er={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},tr={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},nr={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function rr(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=nr[e])?!!t[e]:!1}function ir(){return rr}var ar=zn(C({},Hn,{key:function(e){if(e.key){var t=er[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=In(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?tr[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:ir,charCode:function(e){return e.type===`keypress`?In(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?In(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),or=zn(C({},qn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),sr=zn(C({},Bn,{submitter:0})),cr=zn(C({},Hn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:ir})),lr=zn(C({},Bn,{propertyName:0,elapsedTime:0,pseudoElement:0})),ur=zn(C({},qn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),dr=zn(C({},Bn,{newState:0,oldState:0,source:0})),fr=[9,13,27,32],pr=kn&&`CompositionEvent`in window,mr=null;kn&&`documentMode`in document&&(mr=document.documentMode);var hr=kn&&`TextEvent`in window&&!mr,gr=kn&&(!pr||mr&&8<mr&&11>=mr),_r=` `,vr=!1;function yr(e,t){switch(e){case`keyup`:return fr.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function br(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var xr=!1;function Sr(e,t){switch(e){case`compositionend`:return br(t);case`keypress`:return t.which===32?(vr=!0,_r):null;case`textInput`:return e=t.data,e===_r&&vr?null:e;default:return null}}function Cr(e,t){if(xr)return e===`compositionend`||!pr&&yr(e,t)?(e=Fn(),Pn=Nn=Mn=null,xr=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return gr&&t.locale!==`ko`?null:t.data;default:return null}}var wr={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Tr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!wr[e.type]:t===`textarea`}function Er(e,t,n,r){Cn?wn?wn.push(r):wn=[r]:Cn=r,t=Jf(t,`onChange`),0<t.length&&(n=new Vn(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var Dr=null,Or=null;function kr(e){Vf(e,0)}function Ar(e){if(rn(zt(e)))return e}function jr(e,t){if(e===`change`)return t}var Mr=!1;if(kn){var Nr;if(kn){var Pr=`oninput`in document;if(!Pr){var Fr=document.createElement(`div`);Fr.setAttribute(`oninput`,`return;`),Pr=typeof Fr.oninput==`function`}Nr=Pr}else Nr=!1;Mr=Nr&&(!document.documentMode||9<document.documentMode)}function Ir(){Dr&&(Dr.detachEvent(`onpropertychange`,Lr),Or=Dr=null)}function Lr(e){if(e.propertyName===`value`&&Ar(Or)){var t=[];Er(t,Or,e,Sn(e)),Dn(kr,t)}}function Rr(e,t,n){e===`focusin`?(Ir(),Dr=t,Or=n,Dr.attachEvent(`onpropertychange`,Lr)):e===`focusout`&&Ir()}function zr(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return Ar(Or)}function Br(e,t){if(e===`click`)return Ar(t)}function Vr(e,t){if(e===`input`||e===`change`)return Ar(t)}function Hr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var Ur=typeof Object.is==`function`?Object.is:Hr;function Wr(e,t){if(Ur(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Be.call(t,i)||!Ur(e[i],t[i]))return!1}return!0}function Gr(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}function Kr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function qr(e,t){var n=Kr(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Kr(n)}}function Jr(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Jr(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Yr(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Gr(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=Gr(e.document)}return t}function Xr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var Zr=kn&&`documentMode`in document&&11>=document.documentMode,Qr=null,$r=null,ei=null,ti=!1;function ni(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;ti||Qr==null||Qr!==Gr(r)||(r=Qr,`selectionStart`in r&&Xr(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),ei&&Wr(ei,r)||(ei=r,r=Jf($r,`onSelect`),0<r.length&&(t=new Vn(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=Qr)))}function ri(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var ii={animationend:ri(`Animation`,`AnimationEnd`),animationiteration:ri(`Animation`,`AnimationIteration`),animationstart:ri(`Animation`,`AnimationStart`),transitionrun:ri(`Transition`,`TransitionRun`),transitionstart:ri(`Transition`,`TransitionStart`),transitioncancel:ri(`Transition`,`TransitionCancel`),transitionend:ri(`Transition`,`TransitionEnd`)},ai={},oi={};kn&&(oi=document.createElement(`div`).style,`AnimationEvent`in window||(delete ii.animationend.animation,delete ii.animationiteration.animation,delete ii.animationstart.animation),`TransitionEvent`in window||delete ii.transitionend.transition);function si(e){if(ai[e])return ai[e];if(!ii[e])return e;var t=ii[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in oi)return ai[e]=t[n];return e}var ci=si(`animationend`),li=si(`animationiteration`),ui=si(`animationstart`),di=si(`transitionrun`),fi=si(`transitionstart`),pi=si(`transitioncancel`),mi=si(`transitionend`),hi=new Map,gi=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);gi.push(`scrollEnd`);function _i(e,t){hi.set(e,t),Gt(t,[e])}var vi=0;function yi(e,t){if(e.name!=null&&e.name!==`auto`)return e.name;if(t.autoName!==null)return t.autoName;e=bd.identifierPrefix;var n=vi++;return e=`_`+e+`t_`+n.toString(32)+`_`,t.autoName=e}function bi(e){if(e==null||typeof e==`string`)return e;var t=null,n=Od;if(n!==null)for(var r=0;r<n.length;r++){var i=e[n[r]];if(i!=null){if(i===`none`)return`none`;t=t==null?i:t+(` `+i)}}return t??e.default}function xi(e,t){return e=bi(e),t=bi(t),t==null?e===`auto`?null:e:t===`auto`?null:t}var Si=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},Ci=[],wi=0,Ti=0;function Ei(){for(var e=wi,t=Ti=wi=0;t<e;){var n=Ci[t];Ci[t++]=null;var r=Ci[t];Ci[t++]=null;var i=Ci[t];Ci[t++]=null;var a=Ci[t];if(Ci[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&Ai(n,i,a)}}function Di(e,t,n,r){Ci[wi++]=e,Ci[wi++]=t,Ci[wi++]=n,Ci[wi++]=r,Ti|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function Oi(e,t,n,r){return Di(e,t,n,r),ji(e)}function ki(e,t){return Di(e,null,null,t),ji(e)}function Ai(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-rt(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function ji(e){if(50<kd)throw kd=0,Ad=null,Error(i(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Mi={};function Ni(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Pi(e,t,n,r){return new Ni(e,t,n,r)}function Fi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Ii(e,t){var n=e.alternate;return n===null?(n=Pi(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&1206910976,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Li(e,t){e.flags&=1206910978;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Ri(e,t,n,r,a,o){var s=0;if(r=e,typeof r==`function`)Fi(r)&&(s=1);else if(typeof r==`string`)s=qm(e,n,Te.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(r){case he:return e=Pi(31,n,t,a),e.elementType=he,e.lanes=o,e;case oe:return zi(n.children,a,o,t);case se:s=8,a|=24;break;case T:return e=Pi(12,n,t,a|2),e.elementType=T,e.lanes=o,e;case de:return e=Pi(13,n,t,a),e.elementType=de,e.lanes=o,e;case fe:return e=Pi(19,n,t,a),e.elementType=fe,e.lanes=o,e;case ge:case ve:return e=a|32,e=Pi(30,n,t,e),e.elementType=ve,e.lanes=o,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof r==`object`&&r)switch(r.$$typeof){case le:s=10;break a;case ce:s=9;break a;case ue:s=11;break a;case pe:s=14;break a;case me:s=16,r=null;break a}s=29,n=Error(i(130,e===null?`null`:typeof e,``)),r=null}return t=Pi(s,n,t,a),t.elementType=e,t.type=r,t.lanes=o,t}function zi(e,t,n,r){return e=Pi(7,e,r,t),e.lanes=n,e}function Bi(e,t,n){return e=Pi(6,e,null,t),e.lanes=n,e}function Vi(e){var t=Pi(18,null,null,0);return t.stateNode=e,t}function Hi(e,t,n){return t=Pi(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Ui=new WeakMap;function Wi(e,t){if(typeof e==`object`&&e){var n=Ui.get(e);return n===void 0?(t={value:e,source:t,stack:ze(t)},Ui.set(e,t),t):n}return{value:e,source:t,stack:ze(t)}}var Gi=[],Ki=0,qi=null,Ji=0,Yi=[],Xi=0,Zi=null,Qi=1,$i=``;function ea(e,t){Gi[Ki++]=Ji,Gi[Ki++]=qi,qi=e,Ji=t}function ta(e,t,n){Yi[Xi++]=Qi,Yi[Xi++]=$i,Yi[Xi++]=Zi,Zi=e;var r=Qi;e=$i;var i=32-rt(r)-1;r&=~(1<<i),n+=1;var a=32-rt(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Qi=1<<32-rt(t)+i|n<<i|r,$i=a+e}else Qi=1<<a|n<<i|r,$i=e}function na(e){e.return!==null&&(ea(e,1),ta(e,1,0))}function ra(e){for(;e===qi;)qi=Gi[--Ki],Gi[Ki]=null,Ji=Gi[--Ki],Gi[Ki]=null;for(;e===Zi;)Zi=Yi[--Xi],Yi[Xi]=null,$i=Yi[--Xi],Yi[Xi]=null,Qi=Yi[--Xi],Yi[Xi]=null}function ia(e,t){Yi[Xi++]=Qi,Yi[Xi++]=$i,Yi[Xi++]=Zi,Qi=t.id,$i=t.overflow,Zi=e}var aa=null,R=null,z=!1,oa=null,sa=!1,ca=Error(i(519));function la(e){throw ha(Wi(Error(i(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),ca}function ua(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[Dt]=e,t[Ot]=r,n){case`dialog`:Q(`cancel`,t),Q(`close`,t);break;case`iframe`:case`object`:case`embed`:Q(`load`,t);break;case`video`:case`audio`:for(n=0;n<zf.length;n++)Q(zf[n],t);break;case`source`:Q(`error`,t);break;case`img`:case`image`:case`link`:Q(`error`,t),Q(`load`,t);break;case`details`:Q(`toggle`,t);break;case`input`:Q(`invalid`,t),L(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:Q(`invalid`,t);break;case`textarea`:Q(`invalid`,t),dn(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||ep(t.textContent,n)?(r.popover!=null&&(Q(`beforetoggle`,t),Q(`toggle`,t)),r.onScroll!=null&&Q(`scroll`,t),r.onScrollEnd!=null&&Q(`scrollend`,t),r.onClick!=null&&(t.onclick=bn),t=!0):t=!1,t||la(e,!0)}function da(e){for(aa=e.return;aa;)switch(aa.tag){case 5:case 31:case 13:sa=!1;return;case 27:case 3:sa=!0;return;default:aa=aa.return}}function fa(e){if(e!==aa)return!1;if(!z)return da(e),z=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=n===`form`||n===`button`||pp(e.type,e.memoizedProps)),n=!n),n&&R&&la(e),da(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));R=dm(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));R=dm(e)}else t===27?(t=R,Sp(e.type)?(e=um,um=null,R=e):R=t):R=aa?lm(e.stateNode.nextSibling):null;return!0}function pa(){R=aa=null,z=!1}function ma(){var e=oa;return e!==null&&(fd===null?fd=e:fd.push.apply(fd,e),oa=null),e}function ha(e){oa===null?oa=[e]:oa.push(e)}var ga=j(null),_a=null,va=null;function ya(e,t,n){N(ga,t._currentValue),t._currentValue=n}function ba(e){e._currentValue=ga.current,M(ga)}function xa(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function Sa(e,t,n,r){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var o=a.dependencies;if(o!==null){var s=a.child;o=o.firstContext;a:for(;o!==null;){var c=o;o=a;for(var l=0;l<t.length;l++)if(c.context===t[l]){o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),xa(o.return,n,e),r||(s=null);break a}o=c.next}}else if(a.tag===18){if(s=a.return,s===null)throw Error(i(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),xa(s,n,e),s=null}else a.tag===13&&a.memoizedState!==null&&a.memoizedState.dehydrated===null?(a.lanes|=n,s=a.alternate,s!==null&&(s.lanes|=n),xa(a.return,n,e),s=a.child,s=s===null?null:s.sibling):s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===e){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}}function Ca(e,t,n,r){e=null;for(var a=t,o=!1;a!==null;){if(!o){if(a.flags&524288)o=!0;else if(a.flags&262144)break}if(a.tag===10){var s=a.alternate;if(s===null)throw Error(i(387));if(s=s.memoizedProps,s!==null){var c=a.type;Ur(a.pendingProps.value,s.value)||(e===null?e=[c]:e.push(c))}}else if(a===Oe.current){if(s=a.alternate,s===null)throw Error(i(387));s.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e===null?e=[sh]:e.push(sh))}a=a.return}return e!==null&&Sa(t,e,n,r),t.flags|=262144,e!==null}function wa(e){for(e=e.firstContext;e!==null;){if(!Ur(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function Ta(e){_a=e,va=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Ea(e){return Oa(_a,e)}function Da(e,t){return _a===null&&Ta(e),Oa(e,t)}function Oa(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},va===null){if(e===null)throw Error(i(308));va=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else va=va.next=t;return n}var ka=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},Aa=t.unstable_scheduleCallback,ja=t.unstable_NormalPriority,B={$$typeof:le,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Ma(){return{controller:new ka,data:new Map,refCount:0}}function Na(e){e.refCount--,e.refCount===0&&Aa(ja,function(){e.controller.abort()})}function Pa(e,t){if(e.pendingLanes&4194048){var n=e.transitionTypes;for(n===null&&(n=e.transitionTypes=[]),e=0;e<t.length;e++){var r=t[e];n.indexOf(r)===-1&&n.push(r)}}}var Fa=null;function Ia(e){var t=e.transitionTypes;return e.transitionTypes=null,t}var La=null,Ra=0,za=0,Ba=null;function Va(e,t){if(La===null){var n=La=[];Ra=0,za=Pf(),Ba={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return Ra++,t.then(Ha,Ha),t}function Ha(){if(--Ra===0&&(Fa=null,La!==null)){Ba!==null&&(Ba.status=`fulfilled`);var e=La;La=null,za=0,Ba=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Ua(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var Wa=D.S;D.S=function(e,t){if(hd=Ge(),typeof t==`object`&&t&&typeof t.then==`function`&&Va(e,t),Fa!==null)for(var n=bf;n!==null;)Pa(n,Fa),n=n.next;if(n=e.types,n!==null){for(var r=bf;r!==null;)Pa(r,n),r=r.next;if(za!==0){r=Fa,r===null&&(r=Fa=[]);for(var i=0;i<n.length;i++){var a=n[i];r.indexOf(a)===-1&&r.push(a)}}}Wa!==null&&Wa(e,t)};var Ga=j(null);function Ka(){var e=Ga.current;return e===null?q.pooledCache:e}function qa(e,t){t===null?N(Ga,Ga.current):N(Ga,t.pool)}function Ja(){var e=Ka();return e===null?null:{parent:B._currentValue,pool:e}}var Ya=Error(i(460)),Xa=Error(i(474)),Za=Error(i(542)),Qa={then:function(){}};function $a(e){return e=e.status,e===`fulfilled`||e===`rejected`}function eo(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(bn,bn),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,io(e),e===void 0&&!(`reason`in t)?Error(i(600)):e;default:if(typeof t.status==`string`)t.then(bn,bn);else{if(e=q,e!==null&&100<e.shellSuspendCounter)throw Error(i(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,io(e),e}throw no=t,Ya}}function to(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(no=e,Ya):e}}var no=null;function ro(){if(no===null)throw Error(i(459));var e=no;return no=null,e}function io(e){if(e===Ya||e===Za)throw Error(i(483))}var ao=null,oo=0;function so(e){var t=oo;return oo+=1,ao===null&&(ao=[]),eo(ao,e,t)}function co(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function lo(e,t){throw t.$$typeof===w?Error(i(525)):(e=Object.prototype.toString.call(t),Error(i(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function uo(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function a(e,t){return e=Ii(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=134217730,n):(r=r.index,r<n?(t.flags|=2,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=134217730),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=Bi(n,e.mode,r),t.return=e,t):(t=a(t,n),t.return=e,t)}function l(e,t,n,r){var i=n.type;return i===oe?(e=d(e,t,n.props.children,r,n.key),co(e,n),e):t!==null&&(t.elementType===i||typeof i==`object`&&i&&i.$$typeof===me&&to(i)===t.type)?(t=a(t,n.props),co(t,n),t.return=e,t):(t=Ri(n.type,n.key,n.props,null,e.mode,r),co(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=Hi(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,i){return t===null||t.tag!==7?(t=zi(n,e.mode,r,i),t.return=e,t):(t=a(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=Bi(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case ie:return n=Ri(t.type,t.key,t.props,null,e.mode,n),co(n,t),n.return=e,n;case ae:return t=Hi(t,e.mode,n),t.return=e,t;case me:return t=to(t),f(e,t,n)}if(E(t)||xe(t))return t=zi(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,so(t),n);if(t.$$typeof===le)return f(e,Da(e,t),n);lo(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case ie:return n.key===i?l(e,t,n,r):null;case ae:return n.key===i?u(e,t,n,r):null;case me:return n=to(n),p(e,t,n,r)}if(E(n)||xe(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,so(n),r);if(n.$$typeof===le)return p(e,t,Da(e,n),r);lo(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case ie:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case ae:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case me:return r=to(r),m(e,t,n,r,i)}if(E(r)||xe(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,so(r),i);if(r.$$typeof===le)return m(e,t,n,Da(t,r),i);lo(t,r)}return null}function h(i,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),z&&ea(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return z&&ea(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&(_=g.alternate,_!==null&&d.delete(_.key===null?h:_.key)),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),z&&ea(i,h),l}function g(a,s,c,l){if(c==null)throw Error(i(151));for(var u=null,d=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(a,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(a,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(a,h),z&&ea(a,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(a,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return z&&ea(a,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,a,g,v.value,l),v!==null&&(e&&(_=v.alternate,_!==null&&h.delete(_.key===null?g:_.key)),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(a,e)}),z&&ea(a,g),u}function _(e,r,o,c){if(typeof o==`object`&&o&&o.type===oe&&o.key===null&&o.props.ref===void 0&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case ie:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===oe){if(r.tag===7){n(e,r.sibling),c=a(r,o.props.children),co(c,o),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===me&&to(l)===r.type){n(e,r.sibling),c=a(r,o.props),co(c,o),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}o.type===oe?(c=zi(o.props.children,e.mode,c,o.key),co(c,o),c.return=e,e=c):(c=Ri(o.type,o.key,o.props,null,e.mode,c),co(c,o),c.return=e,e=c)}return s(e);case ae:a:{for(l=o.key;r!==null;){if(r.key===l){if(r.tag===4&&r.stateNode.containerInfo===o.containerInfo&&r.stateNode.implementation===o.implementation){n(e,r.sibling),c=a(r,o.children||[]),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}c=Hi(o,e.mode,c),c.return=e,e=c}return s(e);case me:return o=to(o),_(e,r,o,c)}if(E(o))return h(e,r,o,c);if(xe(o)){if(l=xe(o),typeof l!=`function`)throw Error(i(150));return o=l.call(o),g(e,r,o,c)}if(typeof o.then==`function`)return _(e,r,so(o),c);if(o.$$typeof===le)return _(e,r,Da(e,o),c);lo(e,o)}return typeof o==`string`&&o!==``||typeof o==`number`||typeof o==`bigint`?(o=``+o,r!==null&&r.tag===6?(n(e,r.sibling),c=a(r,o),c.return=e,e=c):(n(e,r),c=Bi(o,e.mode,c),c.return=e,e=c),s(e)):n(e,r)}return function(e,t,n,r){try{oo=0;var i=_(e,t,n,r);return ao=null,i}catch(t){if(t===Ya||t===Za)throw t;var a=Pi(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var fo=uo(!0),po=uo(!1),mo=!1;function ho(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function go(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function _o(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function vo(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,K&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=ji(e),Ai(e,null,n),t}return Di(e,r,t,n),ji(e)}function yo(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,bt(e,n)}}function bo(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var xo=!1;function So(){if(xo){var e=Ba;if(e!==null)throw e}}function Co(e,t,n,r){xo=!1;var i=e.updateQueue;mo=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane&-536870913,p=f!==s.lane;if(p?(Y&f)===f:(r&f)===f){f!==0&&f===za&&(xo=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var m=e,h=s;f=t;var g=n;switch(h.tag){case 1:if(m=h.payload,typeof m==`function`){d=m.call(g,d,f);break a}d=m;break a;case 3:m.flags=m.flags&-65537|128;case 0:if(m=h.payload,f=typeof m==`function`?m.call(g,d,f):m,f==null)break a;d=C({},d,f);break a;case 2:mo=!0}}f=s.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[f]:p.push(f))}else p={lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),od|=o,e.lanes=o,e.memoizedState=d}}function wo(e,t){if(typeof e!=`function`)throw Error(i(191,e));e.call(t)}function To(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)wo(n[e],t)}var Eo=j(null),Do=j(0);function Oo(e,t){e=id,N(Do,e),N(Eo,t),id=e|t.baseLanes}function ko(){N(Do,id),N(Eo,Eo.current)}function Ao(){id=Do.current,M(Eo),M(Do)}var jo=j(null),Mo=null;function No(e){var t=e.alternate;N(Ro,Ro.current&1),N(jo,e),Mo===null&&(t===null||Eo.current!==null||t.memoizedState!==null)&&(Mo=e)}function Po(e){N(Ro,Ro.current),N(jo,e),Mo===null&&(Mo=e)}function Fo(e){e.tag===22?(N(Ro,Ro.current),N(jo,e),Mo===null&&(Mo=e)):Io()}function Io(){N(Ro,Ro.current),N(jo,jo.current)}function Lo(e){M(jo),Mo===e&&(Mo=null),M(Ro)}var Ro=j(0);function zo(e,t){N(jo,jo.current),N(Ro,t)}function Bo(e){M(Ro),M(jo),Mo===e&&(Mo=null)}function Vo(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||om(n)||sm(n)))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==`independent`){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Ho=0,V=null,H=null,Uo=null,Wo=!1,Go=!1,Ko=!1,qo=0,Jo=0,Yo=null,Xo=0;function U(){throw Error(i(321))}function Zo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Ur(e[n],t[n]))return!1;return!0}function Qo(e,t,n,r,i,a){return Ho=a,V=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,D.H=e===null||e.memoizedState===null?hc:gc,Ko=!1,a=n(r,i),Ko=!1,Go&&(a=es(t,n,r,i)),$o(e),a}function $o(e){D.H=mc;var t=H!==null&&H.next!==null;if(Ho=0,Uo=H=V=null,Wo=!1,Jo=0,Yo=null,t)throw Error(i(300));e===null||Nc||(e=e.dependencies,e!==null&&wa(e)&&(Nc=!0))}function es(e,t,n,r){V=e;var a=0;do{if(Go&&(Yo=null),Jo=0,Go=!1,25<=a)throw Error(i(301));if(a+=1,Uo=H=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}D.H=_c,o=t(n,r)}while(Go);return o}function ts(){var e=D.H,t=e.useState()[0];return t=typeof t.then==`function`?cs(t):t,e=e.useState()[0],(H===null?null:H.memoizedState)!==e&&(V.flags|=1024),t}function ns(){var e=qo!==0;return qo=0,e}function rs(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function is(e){if(Wo){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Wo=!1}Ho=0,Uo=H=V=null,Go=!1,Jo=qo=0,Yo=null}function as(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Uo===null?V.memoizedState=Uo=e:Uo=Uo.next=e,Uo}function os(){if(H===null){var e=V.alternate;e=e===null?null:e.memoizedState}else e=H.next;var t=Uo===null?V.memoizedState:Uo.next;if(t!==null)Uo=t,H=e;else{if(e===null)throw V.alternate===null?Error(i(467)):Error(i(310));H=e,e={memoizedState:H.memoizedState,baseState:H.baseState,baseQueue:H.baseQueue,queue:H.queue,next:null},Uo===null?V.memoizedState=Uo=e:Uo=Uo.next=e}return Uo}function ss(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function cs(e){var t=Jo;return Jo+=1,Yo===null&&(Yo=[]),e=eo(Yo,e,t),t=V,(Uo===null?t.memoizedState:Uo.next)===null&&(t=t.alternate,D.H=t===null||t.memoizedState===null?hc:gc),e}function ls(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return cs(e);if(e.$$typeof===ye)return;if(e.$$typeof===le)return Ea(e)}throw Error(i(438,String(e)))}function us(e){var t=null,n=V.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=V.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=ss(),V.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=_e;return t.index++,n}function ds(e,t){return typeof t==`function`?t(e):t}function fs(e){return ps(os(),H,e)}function ps(e,t,n){var r=e.queue;if(r===null)throw Error(i(311));r.lastRenderedReducer=n;var a=e.baseQueue,o=r.pending;if(o!==null){if(a!==null){var s=a.next;a.next=o.next,o.next=s}t.baseQueue=a=o,r.pending=null}if(o=e.baseState,a===null)e.memoizedState=o;else{t=a.next;var c=s=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(Ho&f)===f:(Y&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===za&&(d=!0);else if((Ho&p)===p){u=u.next,p===za&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,s=o):l=l.next=f,V.lanes|=p,od|=p;f=u.action,Ko&&n(o,f),o=u.hasEagerState?u.eagerState:n(o,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,s=o):l=l.next=p,V.lanes|=f,od|=f;u=u.next}while(u!==null&&u!==t);if(l===null?s=o:l.next=c,!Ur(o,e.memoizedState)&&(Nc=!0,d&&(n=Ba,n!==null)))throw n;e.memoizedState=o,e.baseState=s,e.baseQueue=l,r.lastRenderedState=o}return a===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function ms(e){var t=os(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do o=e(o,s.action),s=s.next;while(s!==a);Ur(o,t.memoizedState)||(Nc=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function hs(e,t,n){var r=V,a=os(),o=z;if(o){if(n===void 0)throw Error(i(407));n=n()}else n=t();var s=!Ur((H||a).memoizedState,n);if(s&&(a.memoizedState=n,Nc=!0),a=a.queue,Bs(vs.bind(null,r,a,e),[e]),e=a.getSnapshot!==t||s||Uo!==null&&!!(Uo.memoizedState.tag&1),Fs(e?9:8,{destroy:void 0},_s.bind(null,r,a,n,t),null),e){if(r.flags|=2048,q===null)throw Error(i(349));o||Ho&127||gs(r,t,n)}return n}function gs(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=V.updateQueue,t===null?(t=ss(),V.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function _s(e,t,n,r){t.value=n,t.getSnapshot=r,ys(t)&&bs(e)}function vs(e,t,n){return n(function(){ys(t)&&bs(e)})}function ys(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Ur(e,n)}catch{return!0}}function bs(e){var t=ki(e,2);t!==null&&Pd(t,e,2)}function xs(e){var t=as();if(typeof e==`function`){var n=e;if(e=n(),Ko){nt(!0);try{n()}finally{nt(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ds,lastRenderedState:e},t}function Ss(e,t,n,r){return e.baseState=n,ps(e,H,typeof r==`function`?r:ds)}function Cs(e,t,n,r,a){if(dc(e))throw Error(i(485));if(e=t.action,e!==null){var o={payload:a,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){o.listeners.push(e)}};D.T===null?o.isTransition=!1:n(!0),r(o),n=t.pending,n===null?(o.next=t.pending=o,ws(t,o)):(o.next=n.next,t.pending=n.next=o)}}function ws(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=D.T,o={};o.types=a===null?null:a.types,D.T=o;try{var s=n(i,r),c=D.S;c!==null&&c(o,s),Ts(e,t,s)}catch(n){Ds(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),D.T=a}}else try{a=n(i,r),Ts(e,t,a)}catch(n){Ds(e,t,n)}}function Ts(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){Es(e,t,n)},function(n){return Ds(e,t,n)}):Es(e,t,n)}function Es(e,t,n){t.status=`fulfilled`,t.value=n,Os(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,ws(e,n)))}function Ds(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,Os(t),t=t.next;while(t!==r)}e.action=null}function Os(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function ks(e,t){return t}function As(e,t){if(z){var n=q.formState;if(n!==null){a:{var r=V;if(z){if(R){b:{for(var i=R,a=sa;i.nodeType!==8;){if(!a){i=null;break b}if(i=lm(i.nextSibling),i===null){i=null;break b}}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){R=lm(i.nextSibling),r=i.data===`F!`;break a}}la(r)}r=!1}r&&(t=n[0])}}return n=as(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ks,lastRenderedState:t},n.queue=r,n=cc.bind(null,V,r),r.dispatch=n,r=xs(!1),a=uc.bind(null,V,!1,r.queue),r=as(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=Cs.bind(null,V,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function js(e){return Ms(os(),H,e)}function Ms(e,t,n){if(t=ps(e,t,ks)[0],e=fs(ds)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=cs(t)}catch(e){throw e===Ya?Za:e}else r=t;t=os();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(V.flags|=2048,Fs(9,{destroy:void 0},Ns.bind(null,i,n),null)),[r,a,e]}function Ns(e,t){e.action=t}function Ps(e){var t=os(),n=H;if(n!==null)return Ms(t,n,e);os(),t=t.memoizedState,n=os();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function Fs(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=V.updateQueue,t===null&&(t=ss(),V.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function Is(){return os().memoizedState}function Ls(e,t,n,r){var i=as();V.flags|=e,i.memoizedState=Fs(1|t,{destroy:void 0},n,r===void 0?null:r)}function Rs(e,t,n,r){var i=os();r=r===void 0?null:r;var a=i.memoizedState.inst;H!==null&&r!==null&&Zo(r,H.memoizedState.deps)?i.memoizedState=Fs(t,a,n,r):(V.flags|=e,i.memoizedState=Fs(1|t,a,n,r))}function zs(e,t){Ls(8390656,8,e,t)}function Bs(e,t){Rs(2048,8,e,t)}function Vs(e){V.flags|=4;var t=V.updateQueue;if(t===null)t=ss(),V.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Hs(e){var t=os().memoizedState;return Vs({ref:t,nextImpl:e}),function(){if(K&2)throw Error(i(440));return t.impl.apply(void 0,arguments)}}function Us(e,t){return Rs(4,2,e,t)}function Ws(e,t){return Rs(4,4,e,t)}function Gs(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Ks(e,t,n){n=n==null?null:n.concat([e]),Rs(4,4,Gs.bind(null,t,e),n)}function qs(){}function Js(e,t){var n=os();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&Zo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Ys(e,t){var n=os();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&Zo(t,r[1]))return r[0];if(r=e(),Ko){nt(!0);try{e()}finally{nt(!1)}}return n.memoizedState=[r,t],r}function Xs(e,t,n){return n===void 0||Ho&1073741824&&!(Y&261930)?e.memoizedState=t:(e.memoizedState=n,e=Md(),V.lanes|=e,od|=e,n)}function Zs(e,t,n,r){return Ur(n,t)?n:Eo.current===null?!(Ho&106)||Ho&1073741824&&!(Y&261930)?(Nc=!0,e.memoizedState=n):(e=Md(),V.lanes|=e,od|=e,t):(e=Xs(e,n,r),Ur(e,t)||(Nc=!0),e)}function Qs(e,t,n,r,i){var a=O.p;O.p=a!==0&&8>a?a:8;var o=D.T,s={};s.types=o===null?null:o.types,D.T=s,uc(e,!1,t,n);try{var c=i(),l=D.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?lc(e,t,Ua(c,r),jd(e)):lc(e,t,r,jd(e))}catch(n){lc(e,t,{then:function(){},status:`rejected`,reason:n},jd())}finally{O.p=a,o!==null&&s.types!==null&&(o.types=s.types),D.T=o}}function $s(){}function ec(e,t,n,r){if(e.tag!==5)throw Error(i(476));var a=tc(e).queue;Qs(e,a,t,k,n===null?$s:function(){return nc(e),n(r)})}function tc(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:k,baseState:k,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ds,lastRenderedState:k},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ds,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function nc(e){var t=tc(e);t.next===null&&(t=e.alternate.memoizedState),lc(e,t.next.queue,{},jd())}function rc(){return Ea(sh)}function ic(){return os().memoizedState}function ac(){return os().memoizedState}function oc(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=jd();e=_o(n);var r=vo(t,e,n);r!==null&&(Pd(r,t,n),yo(r,t,n)),t={cache:Ma()},e.payload=t;return}t=t.return}}function sc(e,t,n){var r=jd();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},dc(e)?fc(t,n):(n=Oi(e,t,n,r),n!==null&&(Pd(n,e,r),pc(n,t,r)))}function cc(e,t,n){lc(e,t,n,jd())}function lc(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(dc(e))fc(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,Ur(s,o))return Di(e,t,i,0),q===null&&Ei(),!1}catch{}if(n=Oi(e,t,i,r),n!==null)return Pd(n,e,r),pc(n,t,r),!0}return!1}function uc(e,t,n,r){if(r={lane:2,revertLane:Pf(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},dc(e)){if(t)throw Error(i(479))}else t=Oi(e,n,r,2),t!==null&&Pd(t,e,2)}function dc(e){var t=e.alternate;return e===V||t!==null&&t===V}function fc(e,t){Go=Wo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function pc(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,bt(e,n)}}var mc={readContext:Ea,use:ls,useCallback:U,useContext:U,useEffect:U,useImperativeHandle:U,useLayoutEffect:U,useInsertionEffect:U,useMemo:U,useReducer:U,useRef:U,useState:U,useDebugValue:U,useDeferredValue:U,useTransition:U,useSyncExternalStore:U,useId:U,useHostTransitionStatus:U,useFormState:U,useActionState:U,useOptimistic:U,useMemoCache:U,useCacheRefresh:U,useEffectEvent:U},hc={readContext:Ea,use:ls,useCallback:function(e,t){return as().memoizedState=[e,t===void 0?null:t],e},useContext:Ea,useEffect:zs,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),Ls(4194308,4,Gs.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Ls(4194308,4,e,t)},useInsertionEffect:function(e,t){Ls(4,2,e,t)},useMemo:function(e,t){var n=as();t=t===void 0?null:t;var r=e();if(Ko){nt(!0);try{e()}finally{nt(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=as();if(n!==void 0){var i=n(t);if(Ko){nt(!0);try{n(t)}finally{nt(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=sc.bind(null,V,e),[r.memoizedState,e]},useRef:function(e){var t=as();return e={current:e},t.memoizedState=e},useState:function(e){e=xs(e);var t=e.queue,n=cc.bind(null,V,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:qs,useDeferredValue:function(e,t){return Xs(as(),e,t)},useTransition:function(){var e=xs(!1);return e=Qs.bind(null,V,e.queue,!0,!1),as().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=V,a=as();if(z){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),q===null)throw Error(i(349));Y&127||gs(r,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,zs(vs.bind(null,r,o,e),[e]),r.flags|=2048,Fs(9,{destroy:void 0},_s.bind(null,r,o,n,t),null),n},useId:function(){var e=as(),t=q.identifierPrefix;if(z){var n=$i,r=Qi;n=(r&~(1<<32-rt(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=qo++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=Xo++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:rc,useFormState:As,useActionState:As,useOptimistic:function(e){var t=as();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=uc.bind(null,V,!0,n),n.dispatch=t,[e,t]},useMemoCache:us,useCacheRefresh:function(){return as().memoizedState=oc.bind(null,V)},useEffectEvent:function(e){var t=as(),n={impl:e};return t.memoizedState=n,function(){if(K&2)throw Error(i(440));return n.impl.apply(void 0,arguments)}}},gc={readContext:Ea,use:ls,useCallback:Js,useContext:Ea,useEffect:Bs,useImperativeHandle:Ks,useInsertionEffect:Us,useLayoutEffect:Ws,useMemo:Ys,useReducer:fs,useRef:Is,useState:function(){return fs(ds)},useDebugValue:qs,useDeferredValue:function(e,t){return Zs(os(),H.memoizedState,e,t)},useTransition:function(){var e=fs(ds)[0],t=os().memoizedState;return[typeof e==`boolean`?e:cs(e),t]},useSyncExternalStore:hs,useId:ic,useHostTransitionStatus:rc,useFormState:js,useActionState:js,useOptimistic:function(e,t){return Ss(os(),H,e,t)},useMemoCache:us,useCacheRefresh:ac,useEffectEvent:Hs},_c={readContext:Ea,use:ls,useCallback:Js,useContext:Ea,useEffect:Bs,useImperativeHandle:Ks,useInsertionEffect:Us,useLayoutEffect:Ws,useMemo:Ys,useReducer:ms,useRef:Is,useState:function(){return ms(ds)},useDebugValue:qs,useDeferredValue:function(e,t){var n=os();return H===null?Xs(n,e,t):Zs(n,H.memoizedState,e,t)},useTransition:function(){var e=ms(ds)[0],t=os().memoizedState;return[typeof e==`boolean`?e:cs(e),t]},useSyncExternalStore:hs,useId:ic,useHostTransitionStatus:rc,useFormState:Ps,useActionState:Ps,useOptimistic:function(e,t){var n=os();return H===null?(n.baseState=e,[e,n.queue.dispatch]):Ss(n,H,e,t)},useMemoCache:us,useCacheRefresh:ac,useEffectEvent:Hs};function vc(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:C({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var yc={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=jd(),i=_o(r);i.payload=t,n!=null&&(i.callback=n),t=vo(e,i,r),t!==null&&(Pd(t,e,r),yo(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=jd(),i=_o(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=vo(e,i,r),t!==null&&(Pd(t,e,r),yo(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=jd(),r=_o(n);r.tag=2,t!=null&&(r.callback=t),t=vo(e,r,n),t!==null&&(Pd(t,e,n),yo(t,e,n))}};function bc(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Wr(n,r)||!Wr(i,a):!0}function xc(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&yc.enqueueReplaceState(t,t.state,null)}function Sc(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=C({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function Cc(e){Si(e)}function wc(e){console.error(e)}function Tc(e){Si(e)}function Ec(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function Dc(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function Oc(e,t,n){return n=_o(n),n.tag=3,n.payload={element:null},n.callback=function(){Ec(e,t)},n}function kc(e){return e=_o(e),e.tag=3,e}function Ac(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){Dc(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){Dc(t,n,r),typeof i!=`function`&&(vd===null?vd=new Set([this]):vd.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function jc(e,t,n,r,a){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&Ca(t,n,a,!0),n=jo.current,n!==null){switch(n.tag){case 31:case 13:case 19:return Mo===null?Kd():n.alternate===null&&ad===0&&(ad=3),n.flags&=-257,n.flags|=65536,n.lanes=a,r===Qa?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),mf(e,r,a)),!1;case 22:return n.flags|=65536,r===Qa?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),mf(e,r,a)),!1}throw Error(i(435,n.tag))}return mf(e,r,a),Kd(),!1}if(z)return t=jo.current,t===null?(r!==ca&&(t=Error(i(423),{cause:r}),ha(Wi(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,r=Wi(r,n),a=Oc(e.stateNode,r,a),bo(e,a),ad!==4&&(ad=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=a,r!==ca&&(e=Error(i(422),{cause:r}),ha(Wi(e,n)))),!1;var o=Error(i(520),{cause:r});if(o=Wi(o,n),dd===null?dd=[o]:dd.push(o),ad!==4&&(ad=2),t===null)return!0;r=Wi(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=Oc(n.stateNode,r,e),bo(n,e),!1;case 1:if(t=n.type,o=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||o!==null&&typeof o.componentDidCatch==`function`&&(vd===null||!vd.has(o))))return n.flags|=65536,a&=-a,n.lanes|=a,a=kc(a),Ac(a,e,n,r),bo(n,a),!1;break;case 22:if(n.memoizedState!==null)return n.flags|=65536,!1}n=n.return}while(n!==null);return!1}var Mc=Error(i(461)),Nc=!1;function Pc(e,t,n,r){t.child=e===null?po(t,null,n,r):fo(t,e.child,n,r)}function Fc(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return Ta(t),r=Qo(e,t,n,o,a,i),s=ns(),e!==null&&!Nc?(rs(e,t,i),ll(e,t,i)):(z&&s&&na(t),t.flags|=1,Pc(e,t,r,i),t.child)}function Ic(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!Fi(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,Lc(e,t,a,r,i)):(e=Ri(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!ul(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?Wr:n,n(o,r)&&e.ref===t.ref)return ll(e,t,i)}return t.flags|=1,e=Ii(a,r),e.ref=t.ref,e.return=t,t.child=e}function Lc(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(Wr(a,r)&&e.ref===t.ref){if(Nc=!1,t.pendingProps=r=a,ul(e,i))e.flags&131072&&(Nc=!0);else return t.lanes=e.lanes,ll(e,t,i)}}return Gc(e,t,n,r,i)}function Rc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return Bc(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&qa(t,a===null?null:a.cachePool),a===null?ko():Oo(t,a),Fo(t);else return r=t.lanes=536870912,Bc(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&qa(t,null),ko(),Io()):(qa(t,a.cachePool),Oo(t,a),Io(),t.memoizedState=null);return Pc(e,t,i,n),t.child}function zc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Bc(e,t,n,r,i){var a=Ka();return a=a===null?null:{parent:B._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&qa(t,null),ko(),Fo(t),e!==null&&Ca(e,t,r,!0),t.childLanes=i,null}function Vc(e,t){return t=el({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Hc(e,t,n){return fo(t,e.child,null,n),e=Vc(t,t.pendingProps),e.flags|=2,Lo(t),t.memoizedState=null,e}function Uc(e,t,n){var r=t.pendingProps,a=!!(t.flags&128);if(t.flags&=-129,e===null){if(z){if(r.mode===`hidden`)return e=Vc(t,r),t.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},zc(null,e);if(Po(t),(e=R)?(e=am(e,sa),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Zi===null?null:{id:Qi,overflow:$i},retryLane:536870912,hydrationErrors:null},n=Vi(e),n.return=t,t.child=n,aa=t,R=null)):e=null,e===null)throw la(t);return t.lanes=536870912,null}return Vc(t,r)}var o=e.memoizedState;if(o!==null){var s=o.dehydrated;if(Po(t),a){if(t.flags&256)t.flags&=-257,t=Hc(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(i(558))}else if(Nc||Ca(e,t,n,!1),a=(n&e.childLanes)!==0,Nc||a){if(Eo.current===null){if(r=q,r!==null&&(s=xt(r,n),s!==0&&s!==o.retryLane))throw o.retryLane=s,ki(e,s),Pd(r,e,s),Mc;Kd()}t=Hc(e,t,n)}else e=o.treeContext,R=lm(s.nextSibling),aa=t,z=!0,oa=null,sa=!1,e!==null&&ia(t,e),t=Vc(t,r),t.flags|=134221824;return t}return e=Ii(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Wc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(i(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Gc(e,t,n,r,i){return Ta(t),n=Qo(e,t,n,r,void 0,i),r=ns(),e!==null&&!Nc?(rs(e,t,i),ll(e,t,i)):(z&&r&&na(t),t.flags|=1,Pc(e,t,n,i),t.child)}function Kc(e,t,n,r,i,a){return Ta(t),t.updateQueue=null,n=es(t,r,n,i),$o(e),r=ns(),e!==null&&!Nc?(rs(e,t,a),ll(e,t,a)):(z&&r&&na(t),t.flags|=1,Pc(e,t,n,a),t.child)}function qc(e,t,n,r,i){if(Ta(t),t.stateNode===null){var a=Mi,o=n.contextType;typeof o==`object`&&o&&(a=Ea(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=yc,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},ho(t),o=n.contextType,a.context=typeof o==`object`&&o?Ea(o):Mi,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(vc(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&yc.enqueueReplaceState(a,a.state,null),Co(t,r,a,i),So(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=Sc(n,s);a.props=c;var l=a.context,u=n.contextType;o=Mi,typeof u==`object`&&u&&(o=Ea(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&xc(t,a,r,o),mo=!1;var f=t.memoizedState;a.state=f,Co(t,r,a,i),So(),l=t.memoizedState,s||f!==l||mo?(typeof d==`function`&&(vc(t,n,d,r),l=t.memoizedState),(c=mo||bc(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,go(e,t),o=t.memoizedProps,u=Sc(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=Mi,typeof l==`object`&&l&&(c=Ea(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&xc(t,a,r,c),mo=!1,f=t.memoizedState,a.state=f,Co(t,r,a,i),So();var p=t.memoizedState;o!==d||f!==p||mo||e!==null&&e.dependencies!==null&&wa(e.dependencies)?(typeof s==`function`&&(vc(t,n,s,r),p=t.memoizedState),(u=mo||bc(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&wa(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,Wc(e,t),r=!!(t.flags&128),a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=fo(t,e.child,null,i),t.child=fo(t,null,n,i)):Pc(e,t,n,i),t.memoizedState=a.state,e=t.child):e=ll(e,t,i),e}function Jc(e,t,n,r){return pa(),t.flags|=256,Pc(e,t,n,r),t.child}var Yc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Xc(e){return{baseLanes:e,cachePool:Ja()}}function Zc(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=ld),e}function Qc(e,t,n){var r=t.pendingProps,i=!1,a=!!(t.flags&128),o;if((o=a)||(o=e!==null&&e.memoizedState===null?!1:!!(Ro.current&2)),o&&(i=!0,t.flags&=-129),o=!!(t.flags&32),t.flags&=-33,e===null){if(z){if(i?No(t):Io(),(e=R)?(e=am(e,sa),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Zi===null?null:{id:Qi,overflow:$i},retryLane:536870912,hydrationErrors:null},n=Vi(e),n.return=t,t.child=n,aa=t,R=null)):e=null,e===null)throw la(t);return t.lanes=sm(e)?32:536870912,null}return a=r.children,r=r.fallback,i?(Io(),i=t.mode,a=el({mode:`hidden`,children:a},i),r=zi(r,i,n,null),a.return=t,r.return=t,a.sibling=r,t.child=a,r=t.child,r.memoizedState=Xc(n),r.childLanes=Zc(e,o,n),t.memoizedState=Yc,zc(null,r)):(No(t),$c(t,a))}var s=e.memoizedState;if(s!==null){var c=s.dehydrated;if(c!==null)return nl(e,t,a,o,r,c,s,n)}return i?(Io(),i=r.fallback,a=t.mode,s=e.child,c=s.sibling,r=Ii(s,{mode:`hidden`,children:r.children}),r.subtreeFlags=s.subtreeFlags&1206910976,c===null?(i=zi(i,a,n,null),i.flags|=2):i=Ii(c,i),i.return=t,r.return=t,r.sibling=i,t.child=r,zc(null,r),r=t.child,i=e.child.memoizedState,i===null?i=Xc(n):(a=i.cachePool,a===null?a=Ja():(s=B._currentValue,a=a.parent===s?a:{parent:s,pool:s}),i={baseLanes:i.baseLanes|n,cachePool:a}),r.memoizedState=i,r.childLanes=Zc(e,o,n),t.memoizedState=Yc,zc(e.child,r)):(No(t),n=e.child,e=n.sibling,n=Ii(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(o=t.deletions,o===null?(t.deletions=[e],t.flags|=16):o.push(e)),t.child=n,t.memoizedState=null,n)}function $c(e,t){return t=el({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function el(e,t){return e=Pi(22,e,null,t),e.lanes=0,e}function tl(e,t,n){return fo(t,e.child,null,n),e=$c(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function nl(e,t,n,r,a,o,s,c){if(n)return t.flags&256?(No(t),t.flags&=-257,tl(e,t,c)):t.memoizedState===null?(Io(),o=a.fallback,s=t.mode,a=el({mode:`visible`,children:a.children},s),o=zi(o,s,c,null),o.flags|=2,a.return=t,o.return=t,a.sibling=o,t.child=a,fo(t,e.child,null,c),a=t.child,a.memoizedState=Xc(c),a.childLanes=Zc(e,r,c),t.memoizedState=Yc,zc(null,a)):(Io(),t.child=e.child,t.flags|=128,null);if(No(t),sm(o)){if(r=o.nextSibling&&o.nextSibling.dataset,r)var l=r.dgst;return r=l,r!==``&&(a=Error(i(419)),a.stack=``,a.digest=r,ha({value:a,source:null,stack:null})),tl(e,t,c)}if(Nc||Ca(e,t,c,!1),r=(c&e.childLanes)!==0,Nc||r){if(Eo.current!==null)return tl(e,t,c);if(r=q,r!==null&&(a=xt(r,c),a!==0&&a!==s.retryLane))throw s.retryLane=a,ki(e,a),Pd(r,e,a),Mc;return om(o)||Kd(),tl(e,t,c)}return om(o)?(t.flags|=192,t.child=e.child,null):(e=s.treeContext,R=lm(o.nextSibling),aa=t,z=!0,oa=null,sa=!1,e!==null&&ia(t,e),t=$c(t,a.children),t.flags|=134221824,t)}function rl(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),xa(e.return,t,n)}function il(e){for(var t=null;e!==null;){var n=e.alternate;n!==null&&Vo(n)===null&&(t=e),e=e.sibling}return t}function al(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function ol(e){var t=e.child;for(e.child=null;t!==null;){var n=t.sibling;t.sibling=e.child,e.child=t,t=n}}function sl(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=Ro.current;if(t.flags&128)return zo(t,o),null;var s=!!(o&2);if(s?(o=o&1|2,t.flags|=128):o&=1,zo(t,o),i===`backwards`&&e!==null?(ol(e),Pc(e,t,r,n),ol(e)):Pc(e,t,r,n),r=z?Ji:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&rl(e,n,t);else if(e.tag===19)rl(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`backwards`:n=il(t.child),n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null,ol(t)),al(t,!0,i,null,a,r);break;case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&Vo(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}al(t,!0,n,null,a,r);break;case`together`:al(t,!1,null,null,void 0,r);break;case`independent`:t.memoizedState=null;break;default:n=il(t.child),n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),al(t,!1,i,n,a,r)}return t.child}function cl(e,t,n){var r=t.pendingProps;return ya(t,t.type,r.value),Pc(e,t,r.children,n),t.child}function ll(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),od|=t.lanes,(n&t.childLanes)===0){if(e!==null){if(Ca(e,t,n,!1),(n&t.childLanes)===0)return null}else return null}if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=Ii(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Ii(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function ul(e,t){return(e.lanes&t)!==0||(e=e.dependencies,!!(e!==null&&wa(e)))}function dl(e,t,n){switch(t.tag){case 3:ke(t,t.stateNode.containerInfo),ya(t,B,e.memoizedState.cache),pa();break;case 27:case 5:je(t);break;case 4:ke(t,t.stateNode.containerInfo);break;case 10:ya(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,Po(t),null;break;case 13:var r=t.memoizedState;if(r!==null){if(r.dehydrated!==null)return No(t),t.flags|=128,null;r=Ca(e,t,n,!1);var i=t.child.childLanes;return r||(n&i)!==0?Qc(e,t,n):(No(t),e=ll(e,t,n),e===null?null:e.sibling)}No(t);break;case 19:if(t.flags&128)return sl(e,t,n);if(i=!!(e.flags&128),r=(n&t.childLanes)!==0,r||=(Ca(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return sl(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),zo(t,Ro.current),r)break;return null;case 22:return t.lanes=0,Rc(e,t,n,t.pendingProps);case 24:ya(t,B,e.memoizedState.cache)}return ll(e,t,n)}function fl(e,t,n){if(e!==null){if(e.memoizedProps!==t.pendingProps)Nc=!0;else{if(!ul(e,n)&&!(t.flags&128))return Nc=!1,dl(e,t,n);Nc=!!(e.flags&131072)}}else Nc=!1,z&&t.flags&1048576&&ta(t,Ji,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=to(t.elementType),t.type=e,typeof e==`function`)Fi(e)?(r=Sc(e,r),t.tag=1,t=qc(null,t,e,r,n)):(t.tag=0,t=Gc(null,t,e,r,n));else{if(e!=null){var a=e.$$typeof;if(a===ue){t.tag=11,t=Fc(null,t,e,r,n);break a}if(a===pe){t.tag=14,t=Ic(null,t,e,r,n);break a}if(a===le){t.tag=10,t.type=e,t=cl(null,t,n);break a}}throw t=Ce(e)||e,Error(i(306,t,``))}}return t;case 0:return Gc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,a=Sc(r,t.pendingProps),qc(e,t,r,a,n);case 3:a:{if(ke(t,t.stateNode.containerInfo),e===null)throw Error(i(387));r=t.pendingProps;var o=t.memoizedState;a=o.element,go(e,t),Co(t,r,null,n);var s=t.memoizedState;if(r=s.cache,ya(t,B,r),r!==o.cache&&Sa(t,[B],n,!0),So(),r=s.element,o.isDehydrated){if(o={element:r,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=Jc(e,t,r,n);break a}if(r!==a){a=Wi(Error(i(424)),t),ha(a),t=Jc(e,t,r,n);break a}switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(R=lm(e.firstChild),aa=t,z=!0,oa=null,sa=!0,n=po(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|134221824,n=n.sibling}else{if(pa(),r===a){t=ll(e,t,n);break a}Pc(e,t,r,n)}t=t.child}return t;case 26:return Wc(e,t),e===null?(n=Nm(t.type,null,t.pendingProps,null))?t.memoizedState=n:z||(t.stateNode=fp(t.type,t.pendingProps,De.current,t)):t.memoizedState=Nm(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return je(t),e===null&&z&&(r=t.stateNode=hm(t.type,t.pendingProps,De.current),aa=t,sa=!0,a=R,Sp(t.type)?(um=a,R=lm(r.firstChild)):R=a),Pc(e,t,t.pendingProps.children,n),Wc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&z&&((a=r=R)&&(r=rm(r,t.type,t.pendingProps,sa),r===null?a=!1:(t.stateNode=r,aa=t,R=lm(r.firstChild),sa=!1,a=!0)),a||la(t)),je(t),a=t.type,o=t.pendingProps,s=e===null?null:e.memoizedProps,r=o.children,pp(a,o)?r=null:s!==null&&pp(a,s)&&(t.flags|=32),t.memoizedState!==null&&(a=Qo(e,t,ts,null,null,n),sh._currentValue=a),Wc(e,t),Pc(e,t,r,n),t.child;case 6:return e===null&&z&&((e=n=R)&&(n=im(n,t.pendingProps,sa),n===null?e=!1:(t.stateNode=n,aa=t,R=null,e=!0)),e||la(t)),null;case 13:return Qc(e,t,n);case 4:return ke(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=fo(t,null,r,n):Pc(e,t,r,n),t.child;case 11:return Fc(e,t,t.type,t.pendingProps,n);case 7:return r=t.pendingProps,Wc(e,t),Pc(e,t,r,n),t.child;case 8:return Pc(e,t,t.pendingProps.children,n),t.child;case 12:return Pc(e,t,t.pendingProps.children,n),t.child;case 10:return cl(e,t,n);case 9:return a=t.type._context,r=t.pendingProps.children,Ta(t),a=Ea(a),r=r(a),t.flags|=1,Pc(e,t,r,n),t.child;case 14:return Ic(e,t,t.type,t.pendingProps,n);case 15:return Lc(e,t,t.type,t.pendingProps,n);case 19:return sl(e,t,n);case 31:return Uc(e,t,n);case 22:return Rc(e,t,n,t.pendingProps);case 24:return Ta(t),r=Ea(B),e===null?(a=Ka(),a===null&&(a=q,o=Ma(),a.pooledCache=o,o.refCount++,o!==null&&(a.pooledCacheLanes|=n),a=o),t.memoizedState={parent:r,cache:a},ho(t),ya(t,B,a)):((e.lanes&n)!==0&&(go(e,t),Co(t,null,null,n),So()),a=e.memoizedState,o=t.memoizedState,a.parent===r?(r=o.cache,ya(t,B,r),r!==a.cache&&Sa(t,[B],n,!0)):(a={parent:r,cache:r},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),ya(t,B,r))),Pc(e,t,t.pendingProps.children,n),t.child;case 30:return t.stateNode===null&&(t.stateNode={autoName:null,paired:null,clones:null,ref:null}),r=t.pendingProps,r.name!=null&&r.name!==`auto`?t.flags|=e===null?18882560:18874368:z&&na(t),e!==null&&e.memoizedProps.name!==r.name?t.flags|=4194816:Wc(e,t),Pc(e,t,r.children,n),t.child;case 29:throw t.pendingProps}throw Error(i(156,t.tag))}function pl(e){e.flags|=4}function ml(e,t,n,r,i){var a;if((a=!!(e.mode&32))&&(a=n===null?Jm(t,r):Jm(t,r)&&(r.src!==n.src||r.srcSet!==n.srcSet)),a){if(e.flags|=16777216,(i&335544128)===i){if(e.stateNode.complete)e.flags|=8192;else if(Ud())e.flags|=8192;else throw no=Qa,Xa}}else e.flags&=-16777217}function hl(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Ym(t)){if(Ud())e.flags|=8192;else throw no=Qa,Xa}}function gl(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:ht(),e.lanes|=t,ud|=t)}function _l(e,t){if(!z)switch(e.tailMode){case`visible`:break;case`collapsed`:for(var n=e.tail,r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null;break;default:for(t=e.tail,n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null}}function W(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&1206910976,r|=i.flags&1206910976,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function vl(e,t,n){var r=t.pendingProps;switch(ra(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return W(t),null;case 1:return W(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),ba(B),Ae(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(fa(t)?pl(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,ma())),W(t),null;case 26:var a=t.type,o=t.memoizedState;return e===null?(pl(t),o===null?(W(t),ml(t,a,null,r,n)):(W(t),hl(t,o))):o?o===e.memoizedState?(W(t),t.flags&=-16777217):(pl(t),W(t),hl(t,o)):(e=e.memoizedProps,e!==r&&pl(t),W(t),ml(t,a,e,r,n)),null;case 27:if(Me(t),n=De.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&pl(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return W(t),t.subtreeFlags&=-33554433,null}e=Te.current,fa(t)?ua(t,e):(e=hm(a,r,n),t.stateNode=e,pl(t))}return W(t),t.subtreeFlags&=-33554433,null;case 5:if(Me(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&pl(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return W(t),t.subtreeFlags&=-33554433,null}if(o=Te.current,fa(t))ua(t,o);else{var s=lp(De.current);switch(o){case 1:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case 2:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;default:switch(a){case`svg`:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case`math`:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;case`script`:o=s.createElement(`div`),o.innerHTML=`<script><\/script>`,o=o.removeChild(o.firstChild);break;case`select`:o=typeof r.is==`string`?s.createElement(`select`,{is:r.is}):s.createElement(`select`),r.multiple?o.multiple=!0:r.size&&(o.size=r.size);break;default:o=typeof r.is==`string`?s.createElement(a,{is:r.is}):s.createElement(a)}}o[Dt]=t,o[Ot]=r;a:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)o.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break a;for(;s.sibling===null;){if(s.return===null||s.return===t)break a;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=o;a:switch(np(o,a,r),a){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&pl(t)}}return W(t),t.subtreeFlags&=-33554433,ml(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&pl(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(i(166));if(e=De.current,fa(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,a=aa,a!==null)switch(a.tag){case 27:case 5:r=a.memoizedProps}e[Dt]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||ep(e.nodeValue,n)),e||la(t,!0)}else e=lp(e).createTextNode(r),e[Dt]=t,t.stateNode=e}return W(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=fa(t),n!==null){if(e===null){if(!r)throw Error(i(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(557));e[Dt]=t}else pa(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;W(t),e=!1}else n=ma(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Lo(t),t):(Lo(t),null);if(t.flags&128)throw Error(i(558))}return W(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=fa(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a===null?null:a.dehydrated,!a)throw Error(i(317));a[Dt]=t}else pa(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;W(t),a=!1}else a=ma(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(Lo(t),t):(Lo(t),null)}return Lo(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,a=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(a=r.alternate.memoizedState.cachePool.pool),o=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(o=r.memoizedState.cachePool.pool),o!==a&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),gl(t,t.updateQueue),W(t),null);case 4:return Ae(),e===null&&Wf(t.stateNode.containerInfo),t.flags|=67108864,W(t),null;case 10:return ba(t.type),W(t),null;case 19:if(Bo(t),r=t.memoizedState,r===null)return W(t),null;if(a=!!(t.flags&128),o=r.rendering,o===null){if(a)_l(r,!1);else{if(ad!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=Vo(e),o!==null){for(t.flags|=128,_l(r,!1),e=o.updateQueue,t.updateQueue=e,gl(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Li(n,e),n=n.sibling;return zo(t,Ro.current&1|2),z&&ea(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&Ge()>gd&&(t.flags|=128,a=!0,_l(r,!1),t.lanes=4194304)}}else{if(!a){if(e=Vo(o),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,gl(t,e),_l(r,!0),r.tail===null&&r.tailMode!==`collapsed`&&r.tailMode!==`visible`&&!o.alternate&&!z)return W(t),null}else 2*Ge()-r.renderingStartTime>gd&&n!==536870912&&(t.flags|=128,a=!0,_l(r,!1),t.lanes=4194304)}r.isBackwards?(o.sibling=t.child,t.child=o):(e=r.last,e===null?t.child=o:e.sibling=o,r.last=o)}if(r.tail!==null){e=r.tail;a:{for(n=e;n!==null;){if(n.alternate!==null){n=!1;break a}n=n.sibling}n=!0}return r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Ge(),e.sibling=null,o=Ro.current,o=a?o&1|2:o&1,r.tailMode===`visible`||r.tailMode===`collapsed`||!n||z?zo(t,o):(n=o,N(jo,t),N(Ro,n),Mo===null&&(Mo=t)),z&&ea(t,r.treeForkCount),e}return W(t),null;case 22:case 23:return Lo(t),Ao(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(W(t),t.subtreeFlags&6&&(t.flags|=8192)):W(t),n=t.updateQueue,n!==null&&gl(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&M(Ga),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),ba(B),W(t),null;case 25:return null;case 30:return t.flags|=33554432,W(t),null}throw Error(i(156,t.tag))}function yl(e,t){switch(ra(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return ba(B),Ae(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Me(t),null;case 31:if(t.memoizedState!==null){if(Lo(t),t.alternate===null)throw Error(i(340));pa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Lo(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));pa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return Bo(t),e=t.flags,e&65536?(t.flags=e&-65537|128,e=t.memoizedState,e!==null&&(e.rendering=null,e.tail=null),t.flags|=4,t):null;case 4:return Ae(),null;case 10:return ba(t.type),null;case 22:case 23:return Lo(t),Ao(),e!==null&&M(Ga),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return ba(B),null;case 25:return null;default:return null}}function bl(e,t){switch(ra(t),t.tag){case 3:ba(B),Ae();break;case 26:case 27:case 5:Me(t);break;case 4:Ae();break;case 31:t.memoizedState!==null&&Lo(t);break;case 13:Lo(t);break;case 19:Bo(t);break;case 10:ba(t.type);break;case 22:case 23:Lo(t),Ao(),e!==null&&M(Ga);break;case 24:ba(B)}}function xl(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){Z(t,t.return,e)}}function Sl(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){Z(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){Z(t,t.return,e)}}function Cl(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{To(t,n)}catch(t){Z(e,e.return,t)}}}function wl(e,t,n){n.props=Sc(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){Z(e,t,n)}}function Tl(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:var i=e.stateNode,a=yi(e.memoizedProps,i);(i.ref===null||i.ref.name!==a)&&(i.ref=Pp(a)),r=i.ref;break;case 7:if(e.stateNode===null){var o=new Fp(e);m(e.child,!1,Qp,o,void 0,void 0),e.stateNode=o}r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){Z(e,t,n)}}function El(e,t){var n=e.ref,r=e.refCleanup;if(n!==null){if(typeof r==`function`)try{r()}catch(n){Z(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){Z(e,t,n)}else n.current=null}}function Dl(e,t){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&t!==null)for(var n=0;n<t.length;n++)em(e.stateNode,t[n])}function Ol(e){for(var t=e.return;t!==null&&(jl(t)&&em(e.stateNode,t.stateNode),!Al(t));)t=t.return}function kl(e){for(var t=e.return;t!==null&&(jl(t)&&tm(e.stateNode,t.stateNode),!Al(t));)t=t.return}function Al(e){return e.tag===5||e.tag===3||e.tag===27}function jl(e){return e&&e.tag===7&&e.stateNode!==null}function Ml(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){Z(e,e.return,t)}}function Nl(e,t,n){try{var r=e.stateNode;ip(r,e.type,n,t),r[Ot]=t}catch(t){Z(e,e.return,t)}}function Pl(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Sp(e.type)||e.tag===4}function Fl(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||Pl(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Sp(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Il(e,t,n,r){var i=e.tag;if(i===5||i===6)i=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(i,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(i),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=bn)),Dl(e,r),P=!0;else if(i!==4&&(i===27&&(Dl(e,r),r=null,Sp(e.type)&&(n=e.stateNode,t=null)),e=e.child,e!==null))for(Il(e,t,n,r),e=e.sibling;e!==null;)Il(e,t,n,r),e=e.sibling}function Ll(e,t,n,r){var i=e.tag;if(i===5||i===6)i=e.stateNode,t?n.insertBefore(i,t):n.appendChild(i),Dl(e,r),P=!0;else if(i!==4&&(i===27&&(Dl(e,r),r=null,Sp(e.type)&&(n=e.stateNode)),e=e.child,e!==null))for(Ll(e,t,n,r),e=e.sibling;e!==null;)Ll(e,t,n,r),e=e.sibling}function Rl(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);np(t,r,n),t[Dt]=e,t[Ot]=n}catch(t){Z(e,e.return,t)}}var zl=!1,Bl=null;function Vl(e){(e.tag===30||e.subtreeFlags&33554432)&&(zl=!0)}var Hl=null;function Ul(){var e=Hl;return Hl=null,e}var Wl=0;function Gl(e,t,n,r,i){return Wl=0,Kl(e.child,t,n,r,i)}function Kl(e,t,n,r,i){for(var a=!1;e!==null;){if(e.tag===5){var o=e.stateNode;if(r!==null){var s=Op(o);r.push(s),s.view&&(a=!0)}else a||Op(o).view&&(a=!0);zl=!0,Tp(o,Wl===0?t:t+`_`+Wl,n),Wl++}else(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&i||Kl(e.child,t,n,r,i)&&(a=!0));e=e.sibling}return a}function ql(e,t){for(;e!==null;)e.tag===5?Ep(e.stateNode,e.memoizedProps):(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&t||ql(e.child,t)),e=e.sibling}function Jl(e){if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(Jl(e),e.tag===30&&e.flags&18874368&&e.stateNode.paired)){var t=e.memoizedProps;if(t.name==null||t.name===`auto`)throw Error(i(544));var n=t.name;t=xi(t.default,t.share),t!==`none`&&(Gl(e,n,t,null,!1)||ql(e.child,!1))}e=e.sibling}}function Yl(e,t){if(e.tag===30){var n=e.stateNode,r=e.memoizedProps,i=yi(r,n),a=xi(r.default,n.paired?r.share:r.enter);a===`none`?Jl(e):Gl(e,i,a,null,!1)?(Jl(e),n.paired||t||Nd(e,r.onEnter)):ql(e.child,!1)}else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)Yl(e,t),e=e.sibling;else Jl(e)}function Xl(e){if(Bl!==null&&Bl.size!==0){var t=Bl;if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&e.flags&18874368){var n=e.memoizedProps,r=n.name;if(r!=null&&r!==`auto`){var i=t.get(r);if(i!==void 0){var a=xi(n.default,n.share);if(a!==`none`&&(Gl(e,r,a,null,!1)?(a=e.stateNode,i.paired=a,a.paired=i,Nd(e,n.onShare)):ql(e.child,!1)),t.delete(r),t.size===0)break}}}Xl(e)}e=e.sibling}}}function Zl(e){if(e.tag===30){var t=e.memoizedProps,n=yi(t,e.stateNode),r=Bl===null?void 0:Bl.get(n),i=xi(t.default,r===void 0?t.exit:t.share);i!==`none`&&(Gl(e,n,i,null,!1)?r===void 0?Nd(e,t.onExit):(i=e.stateNode,r.paired=i,i.paired=r,Bl.delete(n),Nd(e,t.onShare)):ql(e.child,!1)),Bl!==null&&Xl(e)}else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)Zl(e),e=e.sibling;else Bl!==null&&Xl(e)}function Ql(e){for(e=e.child;e!==null;){if(e.tag===30){var t=e.memoizedProps,n=yi(t,e.stateNode);t=xi(t.default,t.update),e.flags&=-5,t!==`none`&&Gl(e,n,t,e.memoizedState=[],!1)}else e.subtreeFlags&33554432&&Ql(e);e=e.sibling}}function $l(e){if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&e.flags&18874368){var t=e.stateNode;t.paired!==null&&(t.paired=null,ql(e.child,!1))}$l(e)}e=e.sibling}}function eu(e){if(e.tag===30)e.stateNode.paired=null,ql(e.child,!1),$l(e);else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)eu(e),e=e.sibling;else $l(e)}function tu(e){for(e=e.child;e!==null;)e.tag===30?ql(e.child,!1):e.subtreeFlags&33554432&&tu(e),e=e.sibling}function nu(e,t,n,r,i,a,o){for(var s=!1;t!==null;){if(t.tag===5){var c=t.stateNode;if(a!==null&&Wl<a.length){var l=a[Wl],u=Op(c);(l.view||u.view)&&(s=!0);var d;if(d=!(e.flags&4)){if(u.clip)d=!0;else{d=l.rect;var f=u.rect;d=d.y!==f.y||d.x!==f.x||d.height!==f.height||d.width!==f.width}}d&&(e.flags|=4),u.abs?u=!l.abs:(l=l.rect,u=u.rect,u=l.height!==u.height||l.width!==u.width),u&&(e.flags|=32)}else e.flags|=32;e.flags&4&&Tp(c,Wl===0?n:n+`_`+Wl,i),s&&e.flags&4||(Hl===null&&(Hl=[]),Hl.push(c,Wl===0?r:r+`_`+Wl,t.memoizedProps)),Wl++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&o?e.flags|=t.flags&32:nu(e,t.child,n,r,i,a,o)&&(s=!0));t=t.sibling}return s}function ru(e,t){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,r=e.stateNode,i=yi(n,r),a=xi(n.default,n.update);if(t){r=r.clones;var o=r===null?null:r.map(kp)}else o=e.memoizedState,e.memoizedState=null;r=e;var s=e.child;Wl=0,i=nu(r,s,i,i,a,o,!1),e.flags&4&&i&&(t||Nd(e,n.onUpdate))}else e.subtreeFlags&33554432&&ru(e,t);e=e.sibling}}var iu=!1,G=!1,au=!1,ou=!1,su=typeof WeakSet==`function`?WeakSet:Set,cu=null,lu=!1,uu=!1,du=!1,fu=!1;function pu(e,t,n){if(e=e.containerInfo,sp=gh,e=Yr(e),Xr(e)){if(`selectionStart`in e)var r={start:e.selectionStart,end:e.selectionEnd};else a:{r=(r=e.ownerDocument)&&r.defaultView||window;var i=r.getSelection&&r.getSelection();if(i&&i.rangeCount!==0){r=i.anchorNode;var a=i.anchorOffset,o=i.focusNode;i=i.focusOffset;try{r.nodeType,o.nodeType}catch{r=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==r||a!==0&&f.nodeType!==3||(c=s+a),f!==o||i!==0&&f.nodeType!==3||(l=s+i),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===r&&++u===a&&(c=s),p===o&&++d===i&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}r=c===-1||l===-1?null:{start:c,end:l}}else r=null}r||={start:0,end:0}}else r=null;for(cp={focusedElem:e,selectionRange:r},gh=!1,n=(n&335544064)===n,cu=t,t=n?9270:1024;cu!==null;){if(e=cu,n&&(r=e.deletions,r!==null))for(a=0;a<r.length;a++)n&&Zl(r[a]);if(e.alternate===null&&e.flags&2)n&&Vl(e),mu(n);else{if(e.tag===22){if(r=e.alternate,e.memoizedState!==null){r!==null&&r.memoizedState===null&&n&&Zl(r),mu(n);continue}if(r!==null&&r.memoizedState!==null){n&&Vl(e),mu(n);continue}}r=e.child,(e.subtreeFlags&t)!==0&&r!==null?(r.return=e,cu=r):(n&&Ql(e),mu(n))}}Bl=null}function mu(e){for(;cu!==null;){var t=cu,n=e,r=t.alternate,a=t.flags;switch(t.tag){case 0:case 11:case 15:break;case 1:if(a&1024&&r!==null){n=void 0,a=r.memoizedProps,r=r.memoizedState;var o=t.stateNode;try{var s=Sc(t.type,a);n=o.getSnapshotBeforeUpdate(s,r),o.__reactInternalSnapshotBeforeUpdate=n}catch(e){Z(t,t.return,e)}}break;case 3:if(a&1024){if(r=t.stateNode.containerInfo,n=r.nodeType,n===9)nm(r);else if(n===1)switch(r.nodeName){case`HEAD`:case`HTML`:case`BODY`:nm(r);break;default:r.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:n&&r!==null&&(n=yi(r.memoizedProps,r.stateNode),a=t.memoizedProps,a=xi(a.default,a.update),a!==`none`&&Gl(r,n,a,r.memoizedState=[],!0));break;default:if(a&1024)throw Error(i(163))}if(r=t.sibling,r!==null){r.return=t.return,cu=r;break}cu=t.return}}function hu(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:Fu(e,n),r&4&&xl(5,n);break;case 1:if(Fu(e,n),r&4){if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){Z(n,n.return,e)}else{var i=Sc(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){Z(n,n.return,e)}}}r&64&&Cl(n),r&512&&Tl(n,n.return);break;case 3:if(Fu(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{To(e,t)}catch(e){Z(n,n.return,e)}}break;case 27:t===null&&r&4&&Rl(n);case 26:case 5:Fu(e,n),t===null&&r&4&&Ml(n),r&512&&Tl(n,n.return);break;case 12:Fu(e,n);break;case 31:Fu(e,n),r&4&&wu(e,n);break;case 13:Fu(e,n),r&4&&Tu(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=_f.bind(null,n),cm(e,n))));break;case 22:if(r=n.memoizedState!==null||iu,!r){var a=t!==null&&t.memoizedState!==null||G;t=iu,i=G,iu=r,(G=a)&&!i?(r=2,n.subtreeFlags&8772&&(r|=1),Lu(e,n,r)):Fu(e,n),iu=t,G=i}break;case 30:Fu(e,n),r&512&&Tl(n,n.return);break;case 7:r&512&&Tl(n,n.return);default:Fu(e,n)}}function gu(e,t){for(e=e.child;e!==null;)_u(e,t),e=e.sibling}function _u(e,t){switch(e.tag){case 5:case 26:try{var n=e.stateNode;if(t){var r=n.style;typeof r.setProperty==`function`?r.setProperty(`display`,`none`,`important`):r.display=`none`}else{var i=e.stateNode,a=e.memoizedProps.style,o=a!=null&&a.hasOwnProperty(`display`)?a.display:null;i.style.display=o==null||typeof o==`boolean`?``:(``+o).trim()}}catch(t){Z(e,e.return,t)}vu(e,t);break;case 6:try{e.stateNode.nodeValue=t?``:e.memoizedProps,P=!0}catch(t){Z(e,e.return,t)}break;case 18:try{var s=e.stateNode;t?wp(s,!0):wp(e.stateNode,!1)}catch(t){Z(e,e.return,t)}break;case 22:case 23:e.memoizedState===null&&gu(e,t);break;default:gu(e,t)}}function vu(e,t){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){a:{var n=e,r=t;switch(n.tag){case 4:_u(n,r);break a;case 22:n.memoizedState===null&&vu(n,r);break a;default:vu(n,r)}}e=e.sibling}}function yu(e){var t=e.alternate;t!==null&&(e.alternate=null,yu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&It(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var bu=null,xu=!1;function Su(e,t,n){for(n=n.child;n!==null;)Cu(e,t,n),n=n.sibling}function Cu(e,t,n){if(tt&&typeof tt.onCommitFiberUnmount==`function`)try{tt.onCommitFiberUnmount(et,n)}catch{}switch(n.tag){case 26:G||El(n,t),Su(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&!G&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:G||El(n,t),kl(n);var r=bu,i=xu;Sp(n.type)&&(bu=n.stateNode,xu=!1),Su(e,t,n),gm(n.stateNode,n.type,n.memoizedProps),bu=r,xu=i;break;case 5:G||El(n,t),kl(n);case 6:if(n.tag===6&&kl(n),r=bu,i=xu,bu=null,Su(e,t,n),bu=r,xu=i,bu!==null){if(xu)try{(bu.nodeType===9?bu.body:bu.nodeName===`HTML`?bu.ownerDocument.body:bu).removeChild(n.stateNode),P=!0}catch(e){Z(n,t,e)}else try{bu.removeChild(n.stateNode),P=!0}catch(e){Z(n,t,e)}}break;case 18:bu!==null&&(xu?(e=bu,Cp(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Hh(e)):Cp(bu,n.stateNode));break;case 4:r=bu,i=xu,bu=n.stateNode.containerInfo,xu=!0,Su(e,t,n),bu=r,xu=i;break;case 0:case 11:case 14:case 15:Sl(2,n,t),G||Sl(4,n,t),Su(e,t,n);break;case 1:G||(El(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&wl(n,t,r)),Su(e,t,n);break;case 21:Su(e,t,n);break;case 22:G=(r=G)||n.memoizedState!==null,Su(e,t,n),G=r;break;case 30:El(n,t),Su(e,t,n);break;case 7:G||El(n,t),Su(e,t,n);break;default:Su(e,t,n)}}function wu(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Hh(e)}catch(e){Z(t,t.return,e)}}}function Tu(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Hh(e)}catch(e){Z(t,t.return,e)}}function Eu(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new su),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new su),t;default:throw Error(i(435,e.tag))}}function Du(e,t){var n=Eu(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=vf.bind(null,e,t);t.then(r,r)}})}function Ou(e,t,n){var r=t.deletions;if(r!==null)for(var a=0;a<r.length;a++){var o=r[a],s=e,c=t,l=c;a:for(;l!==null;){switch(l.tag){case 27:if(Sp(l.type)){bu=l.stateNode,xu=!1;break a}break;case 5:bu=l.stateNode,xu=!1;break a;case 3:case 4:bu=l.stateNode.containerInfo,xu=!0;break a}l=l.return}if(bu===null)throw Error(i(160));Cu(s,c,o),bu=null,xu=!1,s=o.alternate,s!==null&&(s.return=null),o.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Au(t,e,n),t=t.sibling}var ku=null;function Au(e,t,n){var r=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(a&4&&(r=e.updateQueue,r=r===null?null:r.events,r!==null))for(var o=0;o<r.length;o++){var s=r[o];s.ref.impl=s.nextImpl}Ou(t,e,n),ju(e),a&4&&(Sl(3,e,e.return),xl(3,e),Sl(5,e,e.return));break;case 1:Ou(t,e,n),ju(e),a&512&&(G||r===null||El(r,r.return)),a&64&&iu&&(e=e.updateQueue,e!==null&&(t=e.callbacks,t!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?t:n.concat(t))));break;case 26:if(o=ku,Ou(t,e,n),ju(e),a&512&&(G||r===null||El(r,r.return)),a&4){if(a=r===null?null:r.memoizedState,n=e.memoizedState,r===null){if(n===null){if(e.stateNode===null){if(iu)e.stateNode=fp(e.type,e.memoizedProps,t.containerInfo,e);else{a:{t=e.type,n=e.memoizedProps,a=o.ownerDocument||o;b:switch(t){case`title`:r=a.getElementsByTagName(`title`)[0],(!r||r[Pt]||r[Dt]||r.namespaceURI===`http://www.w3.org/2000/svg`||r.hasAttribute(`itemprop`))&&(r=a.createElement(t),a.head.insertBefore(r,a.querySelector(`head > title`))),np(r,t,n),r[Dt]=e,Vt(r),t=r;break a;case`link`:if(o=Gm(`link`,`href`,a).get(t+(n.href||``))){for(s=0;s<o.length;s++)if(r=o[s],r.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&r.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&r.getAttribute(`title`)===(n.title==null?null:n.title)&&r.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){o.splice(s,1);break b}}r=a.createElement(t),np(r,t,n),a.head.appendChild(r);break;case`meta`:if(o=Gm(`meta`,`content`,a).get(t+(n.content||``))){for(s=0;s<o.length;s++)if(r=o[s],r.getAttribute(`content`)===(n.content==null?null:``+n.content)&&r.getAttribute(`name`)===(n.name==null?null:n.name)&&r.getAttribute(`property`)===(n.property==null?null:n.property)&&r.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&r.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){o.splice(s,1);break b}}r=a.createElement(t),np(r,t,n),a.head.appendChild(r);break;default:throw Error(i(468,t))}r[Dt]=e,Vt(r),t=r}e.stateNode=t}}else iu||Km(o,e.type,e.stateNode)}else e.stateNode=Bm(o,n,e.memoizedProps)}else a===n?n===null&&e.stateNode!==null&&Nl(e,e.memoizedProps,r.memoizedProps):(a===null?(t=r.stateNode,t===null||G||t.parentNode.removeChild(t)):a.count--,n===null?iu||Km(o,e.type,e.stateNode):Bm(o,n,e.memoizedProps))}break;case 27:Ou(t,e,n),ju(e),a&512&&(G||r===null||El(r,r.return)),r!==null&&a&4&&Nl(e,e.memoizedProps,r.memoizedProps);break;case 5:if(o=au,au=!1,Ou(t,e,n),au=o,ju(e),a&512&&(G||r===null||El(r,r.return)),e.flags&32){t=e.stateNode;try{fn(t,``),P=!0}catch(t){Z(e,e.return,t)}}a&4&&e.stateNode!=null&&(t=e.memoizedProps,Nl(e,t,r===null?t:r.memoizedProps)),a&1024&&(ou=!0);break;case 6:if(Ou(t,e,n),ju(e),a&4){if(e.stateNode===null)throw Error(i(162));t=e.memoizedProps,n=e.stateNode;try{n.nodeValue=t,P=!0}catch(t){Z(e,e.return,t)}}break;case 3:if(P=!1,Wm=null,o=ku,ku=bm(t.containerInfo),Ou(t,e,n),ku=o,ju(e),a&4&&r!==null&&r.memoizedState.isDehydrated)try{Hh(t.containerInfo)}catch(t){Z(e,e.return,t)}ou&&(ou=!1,Mu(e)),P=!1;break;case 4:a=au,au=iu,r=Zt(),o=ku,ku=bm(e.stateNode.containerInfo),Ou(t,e,n),ju(e),ku=o,P&&uu&&(du=!0),P=r,au=a;break;case 12:Ou(t,e,n),ju(e);break;case 31:Ou(t,e,n),ju(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Du(e,t)));break;case 13:Ou(t,e,n),ju(e),e.child.flags&8192&&e.memoizedState!==null!=(r!==null&&r.memoizedState!==null)&&(md=Ge()),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Du(e,t)));break;case 22:o=e.memoizedState!==null,s=r!==null&&r.memoizedState!==null;var c=iu,l=G,u=au;iu=c||o,au=u||o,G=l||s,Ou(t,e,n),G=l,au=u,iu=c,ju(e),a&8192&&(t=e.stateNode,t._visibility=o?t._visibility&-2:t._visibility|1,!o||r===null||s||iu||G||(t=s||G,n=iu,r=G,iu=o||iu,G=t,Iu(e,2),iu=n,G=r),!o&&au||gu(e,o)),a&4&&(t=e.updateQueue,t!==null&&(n=t.retryQueue,n!==null&&(t.retryQueue=null,Du(e,n))));break;case 19:Ou(t,e,n),ju(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Du(e,t)));break;case 30:a&512&&(G||r===null||El(r,r.return)),a=Zt(),o=uu,s=(n&335544064)===n,c=e.memoizedProps,uu=s&&xi(c.default,c.update)!==`none`,Ou(t,e,n),ju(e),s&&r!==null&&P&&(e.flags|=4),uu=o,P=a;break;case 21:break;case 7:a&512&&(G||r===null||El(r,r.return)),r&&r.stateNode!==null&&(r.stateNode._fragmentFiber=e);default:Ou(t,e,n),ju(e)}}function ju(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(Pl(r)){n=r;break}r=r.return}r=null;for(var a=e.return;a!==null;){if(jl(a)){var o=a.stateNode;r===null?r=[o]:r.push(o)}if(Al(a))break;a=a.return}var s=r;if(n==null)throw Error(i(160));switch(n.tag){case 27:var c=n.stateNode;Ll(e,Fl(e),c,s);break;case 5:var l=n.stateNode;n.flags&32&&(fn(l,``),n.flags&=-33),Ll(e,Fl(e),l,s);break;case 3:case 4:var u=n.stateNode.containerInfo;Il(e,Fl(e),u,s);break;default:throw Error(i(161))}}catch(t){Z(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Mu(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Mu(t),t.tag===5&&t.flags&1024&&(t=t.stateNode,gh=!0,t.reset(),gh=!1),e=e.sibling}}function Nu(e,t){if(t.subtreeFlags&9270)for(t=t.child;t!==null;)Pu(t,e),t=t.sibling;else ru(t,!1)}function Pu(e,t){var n=e.alternate;if(n===null)Yl(e,!1);else switch(e.tag){case 3:if(fu=lu=!1,Ul(),Nu(t,e),!lu&&!du){if(e=Hl,e!==null)for(var r=0;r<e.length;r+=3){n=e[r];var i=e[r+1];Ep(n,e[r+2]),n=n.ownerDocument.documentElement,n!==null&&n.animate({opacity:[0,0],pointerEvents:[`none`,`none`]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition-group(`+i+`)`})}e=t.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===``&&(e.style.viewTransitionName=`none`,e.animate({opacity:[0,0],pointerEvents:[`none`,`none`]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition-group(root)`}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition`})),fu=!0}Hl=null;break;case 5:Nu(t,e);break;case 4:r=lu,lu=!1,Nu(t,e),lu&&(du=!0),lu=r;break;case 22:e.memoizedState===null&&(n.memoizedState===null?Nu(t,e):Yl(e,!1));break;case 30:r=lu,i=Ul(),lu=!1,Nu(t,e),lu&&(e.flags|=4);var a=e.memoizedProps,o=e.stateNode;t=yi(a,o),o=yi(n.memoizedProps,o);var s=xi(a.default,a.update);s===`none`?t=!1:(a=n.memoizedState,n.memoizedState=null,n=e.child,Wl=0,t=nu(e,n,t,o,s,a,!0),Wl!==(a===null?0:a.length)&&(e.flags|=32)),e.flags&4&&t?(Nd(e,e.memoizedProps.onUpdate),Hl=i):i!==null&&(i.push.apply(i,Hl),Hl=i),lu=e.flags&32?!0:r;break;default:Nu(t,e)}}function Fu(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)hu(e,t.alternate,t),t=t.sibling}function Iu(e,t){for(e=e.child;e!==null;){var n=e,r=t;switch(n.tag){case 0:case 11:case 14:case 15:Sl(4,n,n.return),Iu(n,r);break;case 1:El(n,n.return);var i=n.stateNode;typeof i.componentWillUnmount==`function`&&wl(n,n.return,i),Iu(n,r);break;case 27:r&2&&gm(n.stateNode,n.type,n.memoizedProps);case 5:El(n,n.return),n.tag!==5&&n.tag!==27||kl(n),Iu(n,r);break;case 6:kl(n);break;case 26:El(n,n.return),i=n.stateNode,n.memoizedState!==null||i===null||G||i.parentNode.removeChild(i),Iu(n,r);break;case 22:n.memoizedState===null&&Iu(n,r);break;case 30:El(n,n.return),Iu(n,r);break;case 7:El(n,n.return);default:Iu(n,r)}e=e.sibling}}function Lu(e,t,n){for(n=t.subtreeFlags&8772?n:n&-2,t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags,s=!!(n&1);switch(a.tag){case 0:case 11:case 15:Lu(i,a,n),xl(4,a);break;case 1:if(Lu(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){Z(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var c=r.stateNode;try{var l=i.shared.hiddenCallbacks;if(l!==null)for(i.shared.hiddenCallbacks=null,i=0;i<l.length;i++)wo(l[i],c)}catch(e){Z(r,r.return,e)}}s&&o&64&&Cl(a),Tl(a,a.return);break;case 27:n&2&&Rl(a);case 5:a.tag!==5&&a.tag!==27||Ol(a),Lu(i,a,n),s&&r===null&&o&4&&Ml(a),Tl(a,a.return);break;case 6:Ol(a);break;case 26:c=a.stateNode,a.memoizedState!==null||c===null||iu||Km(bm(c.ownerDocument),a.type,c),Lu(i,a,n),s&&r===null&&o&4&&Ml(a),Tl(a,a.return);break;case 12:Lu(i,a,n);break;case 31:Lu(i,a,n),s&&o&4&&wu(i,a);break;case 13:Lu(i,a,n),s&&o&4&&Tu(i,a);break;case 22:a.memoizedState===null&&Lu(i,a,n),Tl(a,a.return);break;case 30:Lu(i,a,n),Tl(a,a.return);break;case 7:Tl(a,a.return);default:Lu(i,a,n)}t=t.sibling}}function Ru(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Na(n))}function zu(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Na(e))}function Bu(e,t,n,r){var i=(n&335544064)===n;if(t.subtreeFlags&(i?10262:10256))for(t=t.child;t!==null;)Vu(e,t,n,r),t=t.sibling;else i&&tu(t)}function Vu(e,t,n,r){var i=(n&335544064)===n;i&&t.alternate===null&&t.return!==null&&t.return.alternate!==null&&eu(t);var a=t.flags;switch(t.tag){case 0:case 11:case 15:Bu(e,t,n,r),a&2048&&xl(9,t);break;case 1:Bu(e,t,n,r);break;case 3:Bu(e,t,n,r),i&&fu&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,e.style.viewTransitionName===`root`&&(e.style.viewTransitionName=``),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===`none`&&(e.style.viewTransitionName=``)),a&2048&&(a=null,t.alternate!==null&&(a=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==a&&(t.refCount++,a!=null&&Na(a)));break;case 12:if(a&2048){Bu(e,t,n,r),a=t.stateNode;try{var o=t.memoizedProps,s=o.id,c=o.onPostCommit;typeof c==`function`&&c(s,t.alternate===null?`mount`:`update`,a.passiveEffectDuration,-0)}catch(e){Z(t,t.return,e)}}else Bu(e,t,n,r);break;case 31:Bu(e,t,n,r);break;case 13:Bu(e,t,n,r);break;case 23:break;case 22:o=t.stateNode,s=t.alternate,t.memoizedState===null?(i&&s!==null&&s.memoizedState!==null&&eu(t),o._visibility&2?Bu(e,t,n,r):(o._visibility|=2,Hu(e,t,n,r,!!(t.subtreeFlags&10256)||!1))):(i&&s!==null&&s.memoizedState===null&&eu(s),o._visibility&2?Bu(e,t,n,r):Uu(e,t)),a&2048&&Ru(s,t);break;case 24:Bu(e,t,n,r),a&2048&&zu(t.alternate,t);break;case 30:i&&(a=t.alternate,a!==null&&(ql(a.child,!0),ql(t.child,!0))),Bu(e,t,n,r);break;default:Bu(e,t,n,r)}}function Hu(e,t,n,r,i){for(i&&=!!(t.subtreeFlags&10256)||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:Hu(a,o,s,c,i),xl(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,Hu(a,o,s,c,i)):u._visibility&2?Hu(a,o,s,c,i):Uu(a,o),i&&l&2048&&Ru(o.alternate,o);break;case 24:Hu(a,o,s,c,i),i&&l&2048&&zu(o.alternate,o);break;default:Hu(a,o,s,c,i)}t=t.sibling}}function Uu(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:Uu(n,r),i&2048&&Ru(r.alternate,r);break;case 24:Uu(n,r),i&2048&&zu(r.alternate,r);break;default:Uu(n,r)}t=t.sibling}}var Wu=8192;function Gu(e,t,n){if(e.subtreeFlags&Wu)for(e=e.child;e!==null;)Ku(e,t,n),e=e.sibling}function Ku(e,t,n){switch(e.tag){case 26:Gu(e,t,n),e.flags&Wu&&(e.memoizedState===null?(e=e.stateNode,(t&335544128)===t&&Zm(n,e)):Qm(n,ku,e.memoizedState,e.memoizedProps));break;case 5:Gu(e,t,n),e.flags&Wu&&(e=e.stateNode,(t&335544128)===t&&Zm(n,e));break;case 3:case 4:var r=ku;ku=bm(e.stateNode.containerInfo),Gu(e,t,n),ku=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Wu,Wu=16777216,Gu(e,t,n),Wu=r):Gu(e,t,n));break;case 30:if((e.flags&Wu)!==0&&(r=e.memoizedProps.name,r!=null&&r!==`auto`)){var i=e.stateNode;i.paired=null,Bl===null&&(Bl=new Map),Bl.set(r,i)}Gu(e,t,n);break;default:Gu(e,t,n)}}function qu(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Ju(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];cu=r,Zu(r,e)}qu(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Yu(e),e=e.sibling}function Yu(e){switch(e.tag){case 0:case 11:case 15:Ju(e),e.flags&2048&&Sl(9,e,e.return);break;case 3:Ju(e);break;case 12:Ju(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Xu(e)):Ju(e);break;default:Ju(e)}}function Xu(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];cu=r,Zu(r,e)}qu(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Sl(8,t,t.return),Xu(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Xu(t));break;default:Xu(t)}e=e.sibling}}function Zu(e,t){for(;cu!==null;){var n=cu;switch(n.tag){case 0:case 11:case 15:Sl(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:Na(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,cu=r;else a:for(n=e;cu!==null;){r=cu;var i=r.sibling,a=r.return;if(yu(r),r===n){cu=null;break a}if(i!==null){i.return=a,cu=i;break a}cu=a}}}var Qu={getCacheForType:function(e){var t=Ea(B),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return Ea(B).controller.signal}},$u=typeof WeakMap==`function`?WeakMap:Map,K=0,q=null,J=null,Y=0,X=0,ed=null,td=!1,nd=!1,rd=!1,id=0,ad=0,od=0,sd=0,cd=0,ld=0,ud=0,dd=null,fd=null,pd=!1,md=0,hd=0,gd=1/0,_d=null,vd=null,yd=0,bd=null,xd=null,Sd=0,Cd=0,wd=null,Td=null,Ed=null,Dd=null,Od=null,kd=0,Ad=null;function jd(){return K&2&&Y!==0?Y&-Y:D.T===null?wt():Pf()}function Md(){if(ld===0){if(!(Y&536870912)||z){var e=ct;ct<<=1,!(ct&3932160)&&(ct=262144),ld=e}else ld=536870912}return e=jo.current,e!==null&&(e.flags|=32),ld}function Nd(e,t){if(t!=null){var n=e.stateNode,r=n.ref;r===null&&(r=n.ref=Pp(yi(e.memoizedProps,n))),Dd===null&&(Dd=[]),Dd.push(t.bind(null,r))}}function Pd(e,t,n){(e===q&&(X===2||X===9)||e.cancelPendingCommit!==null)&&(Vd(e,0),Rd(e,Y,ld,!1)),_t(e,n),(!(K&2)||e!==q)&&(e===q&&(!(K&2)&&(sd|=n),ad===4&&Rd(e,Y,ld,!1)),Ef(e))}function Fd(e,t,n){if(K&6)throw Error(i(327));var r=!n&&!(t&127)&&(t&e.expiredLanes)===0||ft(e,t),a=r?Yd(e,t):qd(e,t,!0),o=r;do{if(a===0){nd&&!r&&Rd(e,t,0,!1);break}if(n=e.current.alternate,o&&!Ld(n)){a=qd(e,t,!1),o=!1;continue}if(a===2){if(o=t,e.errorRecoveryDisabledLanes&o)var s=0;else s=e.pendingLanes&-536870913,s=s===0?s&536870912?536870912:0:s;if(s!==0){t=s;a:{var c=e;a=dd;var l=c.current.memoizedState.isDehydrated;if(l&&(Vd(c,s).flags|=256),s=qd(c,s,!1),s!==2&&s!==6){if(rd&&!l){c.errorRecoveryDisabledLanes|=o,sd|=o,a=4;break a}o=fd,fd=a,o!==null&&(fd===null?fd=o:fd.push.apply(fd,o))}a=s}if(o=!1,a!==2)continue}}if(a===1){Vd(e,0),Rd(e,t,0,!0);break}a:{switch(r=e,o=a,o){case 0:case 1:throw Error(i(345));case 4:if((t&4194048)!==t&&(t&62914560)!==t)break;case 6:Rd(r,t,ld,!td);break a;case 2:fd=null;break;case 3:case 5:break;default:throw Error(i(329))}if((t&62914560)===t&&(a=md+300-Ge(),10<a)){if(Rd(r,t,ld,!td),dt(r,0,!0)!==0)break a;Sd=t,r.timeoutHandle=gp(Id.bind(null,r,n,fd,_d,pd,t,ld,sd,ud,td,o,`Throttled`,-0,0),a);break a}Id(r,n,fd,_d,pd,t,ld,sd,ud,td,o,null,-0,0)}break}while(1);Ef(e)}function Id(e,t,n,r,i,a,o,s,c,l,u,d,f,p){e.timeoutHandle=-1;var m=t.subtreeFlags,h=(a&335544064)===a;if(d=null,(h||m&8192||(m&16785408)==16785408)&&(d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:bn},Bl=null,Ku(t,a,d),h&&(m=d,h=e.containerInfo,h=(h.nodeType===9?h:h.ownerDocument).__reactViewTransition,h!=null&&(m.count++,m.waitingForViewTransition=!0,m=nh.bind(m),h.finished.then(m,m))),m=(a&62914560)===a?md-Ge():(a&4194048)===a?hd-Ge():0,m=eh(d,m),m!==null)){Sd=a,e.cancelPendingCommit=m(nf.bind(null,e,t,a,n,r,i,o,s,c,l,u,d,null,f,p)),Rd(e,a,o,!l);return}nf(e,t,a,n,r,i,o,s,c,l,u,d)}function Ld(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!Ur(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Rd(e,t,n,r){t=pt(e,t),t&=~cd,t&=~sd,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-rt(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&yt(e,n,t)}function zd(){return K&6?!0:(Df(0,!1),!1)}function Bd(){if(J!==null){if(X===0)var e=J.return;else e=J,va=_a=null,is(e),ao=null,oo=0,e=J;for(;e!==null;)bl(e.alternate,e),e=e.return;J=null}}function Vd(e,t){var n=e.timeoutHandle;return n!==-1&&(e.timeoutHandle=-1,_p(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Sd=0,Bd(),q=e,J=n=Ii(e.current,null),Y=t,X=0,ed=null,td=!1,nd=ft(e,t),rd=!1,ud=ld=cd=sd=od=ad=0,fd=dd=null,pd=!1,id=pt(e,t),Ei(),n}function Hd(e,t){V=null,D.H=mc,t===Ya||t===Za?(t=ro(),X=3):t===Xa?(t=ro(),X=4):X=t===Mc?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,ed=t,J===null&&(ad=1,Ec(e,Wi(t,e.current)))}function Ud(){var e=jo.current;return e===null?!0:(Y&4194048)===Y?Mo===null:(Y&62914560)===Y||Y&536870912?e===Mo:!1}function Wd(){var e=D.H;return D.H=mc,e===null?mc:e}function Gd(){var e=D.A;return D.A=Qu,e}function Kd(){ad=4,td||(Y&4194048)!==Y&&jo.current!==null||(nd=!0),!(od&134217727)&&!(sd&134217727)||q===null||Rd(q,Y,ld,!1)}function qd(e,t,n){var r=K;K|=2;var i=Wd(),a=Gd();(q!==e||Y!==t)&&(_d=null,Vd(e,t)),t=!1;var o=ad;a:do try{if(X!==0&&J!==null){var s=J,c=ed;switch(X){case 8:Bd(),o=6;break a;case 3:case 2:case 9:case 6:jo.current===null&&(t=!0);var l=X;if(X=0,ed=null,$d(e,s,c,l),n&&nd){o=0;break a}break;default:l=X,X=0,ed=null,$d(e,s,c,l)}}Jd(),o=ad;break}catch(t){Hd(e,t)}while(1);return t&&e.shellSuspendCounter++,va=_a=null,K=r,D.H=i,D.A=a,J===null&&(q=null,Y=0,Ei()),o}function Jd(){for(;J!==null;)Zd(J)}function Yd(e,t){var n=K;K|=2;var r=Wd(),a=Gd();q!==e||Y!==t?(_d=null,gd=Ge()+500,Vd(e,t)):nd=ft(e,t);a:do try{if(X!==0&&J!==null){t=J;var o=ed;b:switch(X){case 1:X=0,ed=null,$d(e,t,o,1);break;case 2:case 9:if($a(o)){X=0,ed=null,Qd(t);break}t=function(){X!==2&&X!==9||q!==e||(X=7),Ef(e)},o.then(t,t);break a;case 3:X=7;break a;case 4:X=5;break a;case 7:$a(o)?(X=0,ed=null,Qd(t)):(X=0,ed=null,$d(e,t,o,7));break;case 5:var s=null;switch(J.tag){case 26:s=J.memoizedState;case 5:case 27:var c=J;if(s?Ym(s):c.stateNode.complete){X=0,ed=null;var l=c.sibling;if(l!==null)J=l;else{var u=c.return;u===null?J=null:(J=u,ef(u))}break b}}X=0,ed=null,$d(e,t,o,5);break;case 6:X=0,ed=null,$d(e,t,o,6);break;case 8:Bd(),ad=6;break a;default:throw Error(i(462))}}Xd();break}catch(t){Hd(e,t)}while(1);return va=_a=null,D.H=r,D.A=a,K=n,J===null?(q=null,Y=0,Ei(),ad):0}function Xd(){for(;J!==null&&!Ue();)Zd(J)}function Zd(e){var t=fl(e.alternate,e,id);e.memoizedProps=e.pendingProps,t===null?ef(e):J=t}function Qd(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Kc(n,t,t.pendingProps,t.type,void 0,Y);break;case 11:t=Kc(n,t,t.pendingProps,t.type.render,t.ref,Y);break;case 5:is(t);var r=t;r===aa&&(z?(da(r),r.tag===5&&r.stateNode!=null&&(R=r.stateNode)):(da(r),z=!0));default:bl(n,t),t=J=Li(t,id),t=fl(n,t,id)}e.memoizedProps=e.pendingProps,t===null?ef(e):J=t}function $d(e,t,n,r){va=_a=null,is(t),ao=null,oo=0;var i=t.return;try{if(jc(e,i,t,n,Y)){ad=1,Ec(e,Wi(n,e.current)),J=null;return}}catch(t){if(i!==null)throw J=i,t;ad=1,Ec(e,Wi(n,e.current)),J=null;return}t.flags&32768?(z||r===1?e=!0:nd||Y&536870912?e=!1:(td=e=!0,(r===2||r===9||r===3||r===6)&&(r=jo.current,r!==null&&r.tag===13&&(r.flags|=16384))),tf(t,e)):ef(t)}function ef(e){var t=e;do{if(t.flags&32768){tf(t,td);return}e=t.return;var n=vl(t.alternate,t,id);if(n!==null){J=n;return}if(t=t.sibling,t!==null){J=t;return}J=t=e}while(t!==null);ad===0&&(ad=5)}function tf(e,t){do{var n=yl(e.alternate,e);if(n!==null){n.flags&=32767,J=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){J=e;return}J=e=n}while(e!==null);ad=6,J=null}function nf(e,t,n,r,a,o,s,c,l,u,d,f){e.cancelPendingCommit=null;do df();while(yd!==0);if(K&6)throw Error(i(327));if(t!==null){if(t===e.current)throw Error(i(177));e===q&&(J=q=null,Y=0),xd=t,bd=e,Sd=n,wd=a,Td=r,rf(e,t,n,s,c,l,f)}}function rf(e,t,n,r,i,a,o){var s=t.lanes|t.childLanes;if(Cd=s,s|=Ti,vt(e,n,s,r,i,a),Dd=null,(n&335544064)===n?(Od=Ia(e),r=10262):(Od=null,r=10256),(t.subtreeFlags&r)!==0||(t.flags&r)!==0?(e.callbackNode=null,e.callbackPriority=0,yf(Ye,function(){return ff(),null})):(e.callbackNode=null,e.callbackPriority=0),zl=!1,r=!!(t.flags&13878),t.subtreeFlags&13878||r){r=D.T,D.T=null,i=O.p,O.p=2,a=K,K|=4;try{pu(e,t,n)}finally{K=a,O.p=i,D.T=r}}yd=1,zl?Ed=Mp(o,e.containerInfo,Od,sf,cf,of,lf,ff,af,null,null):(sf(),cf(),lf())}function af(e){if(yd!==0){var t=bd.onRecoverableError;t(e,{componentStack:null})}}function of(){yd===3&&(yd=0,Pu(xd,bd),yd=4)}function sf(){if(yd===1){yd=0;var e=bd,t=xd,n=Sd,r=!!(t.flags&13878);if(t.subtreeFlags&13878||r){r=D.T,D.T=null;var i=O.p;O.p=2;var a=K;K|=4;try{uu=du=!1,Au(t,e,n),n=cp;var o=Yr(e.containerInfo),s=n.focusedElem,c=n.selectionRange;if(o!==s&&s&&s.ownerDocument&&Jr(s.ownerDocument.documentElement,s)){if(c!==null&&Xr(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=qr(s,h),v=qr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}gh=!!sp,cp=sp=null}finally{K=a,O.p=i,D.T=r}}e.current=t,yd=2}}function cf(){if(yd===2){yd=0;var e=bd,t=xd,n=!!(t.flags&8772);if(t.subtreeFlags&8772||n){n=D.T,D.T=null;var r=O.p;O.p=2;var i=K;K|=4;try{hu(e,t.alternate,t)}finally{K=i,O.p=r,D.T=n}}yd=3}}function lf(){if(yd===4||yd===3){yd=0;var e=Ed;Ed=null,We();var t=bd,n=xd,r=Sd,i=Td,a=(r&335544064)===r?10262:10256;if((n.subtreeFlags&a)!==0||(n.flags&a)!==0?yd=5:(yd=0,xd=bd=null,uf(t,t.pendingLanes)),a=t.pendingLanes,a===0&&(vd=null),Ct(r),n=n.stateNode,tt&&typeof tt.onCommitFiberRoot==`function`)try{tt.onCommitFiberRoot(et,n,void 0,(n.current.flags&128)==128)}catch{}if(i!==null){n=D.T,a=O.p,O.p=2,D.T=null;try{for(var o=t.onRecoverableError,s=0;s<i.length;s++){var c=i[s];o(c.value,{componentStack:c.stack})}}finally{D.T=n,O.p=a}}if(i=Dd,o=Od,Od=null,i!==null&&(Dd=null,o===null&&(o=[]),e!==null))for(c=0;c<i.length;c++)n=(0,i[c])(o),n!==void 0&&e.finished.finally(n);Sd&3&&df(),Ef(t),a=t.pendingLanes,r&261930&&a&42?t===Ad?kd++:(kd=0,Ad=t):(kd=0,Ad=null),Df(0,!1)}}function uf(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Na(t)))}function df(){return Ed!==null&&(Ed.skipTransition(),Ed=null),sf(),cf(),lf(),ff()}function ff(){if(yd!==5)return!1;var e=bd,t=Cd;Cd=0;var n=Ct(Sd),r=D.T,a=O.p;try{O.p=32>n?32:n,D.T=null,n=wd,wd=null;var o=bd,s=Sd;if(yd=0,xd=bd=null,Sd=0,K&6)throw Error(i(331));var c=K;if(K|=4,Yu(o.current),Vu(o,o.current,s,n),K=c,Df(0,!1),tt&&typeof tt.onPostCommitFiberRoot==`function`)try{tt.onPostCommitFiberRoot(et,o)}catch{}return!0}finally{O.p=a,D.T=r,uf(e,t)}}function pf(e,t,n){t=Wi(n,t),t=Oc(e.stateNode,t,2),e=vo(e,t,2),e!==null&&(_t(e,2),Ef(e))}function Z(e,t,n){if(e.tag===3)pf(e,e,n);else for(;t!==null;){if(t.tag===3){pf(t,e,n);break}if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(vd===null||!vd.has(r))){e=Wi(n,e),n=kc(2),r=vo(t,n,2),r!==null&&(Ac(n,r,t,e),_t(r,2),Ef(r));break}}t=t.return}}function mf(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new $u;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(rd=!0,i.add(n),e=hf.bind(null,e,t,n),t.then(e,e))}function hf(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,q===e&&(Y&n)===n&&(ad===4||ad===3&&(Y&62914560)===Y&&300>Ge()-md?K&2?cd|=n:Vd(e,0):cd|=n,ud===Y&&(ud=0)),Ef(e)}function gf(e,t){t===0&&(t=ht()),e=ki(e,t),e!==null&&(_t(e,t),Ef(e))}function _f(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),gf(e,n)}function vf(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(i(314))}r!==null&&r.delete(t),gf(e,n)}function yf(e,t){return Ve(e,t)}var bf=null,xf=null,Sf=!1,Cf=!1,wf=!1,Tf=0;function Ef(e){e!==xf&&e.next===null&&(xf===null?bf=xf=e:xf=xf.next=e),Cf=!0,Sf||(Sf=!0,Nf())}function Df(e,t){if(!wf&&Cf){wf=!0;do for(var n=!1,r=bf;r!==null;){if(!t){if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-rt(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,Mf(r,a))}else a=Y,a=dt(r,r===q?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||ft(r,a)||(n=!0,Mf(r,a))}r=r.next}while(n);wf=!1}}function Of(){kf()}function kf(){Cf=Sf=!1;var e=0;Tf!==0&&hp()&&(e=Tf);for(var t=Ge(),n=null,r=bf;r!==null;){var i=r.next,a=Af(r,t);a===0?(r.next=null,n===null?bf=i:n.next=i,i===null&&(xf=n)):(n=r,(e!==0||a&3)&&(Cf=!0)),r=i}yd!==0&&yd!==5||Df(e,!1),Tf!==0&&(Tf=0)}function Af(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-rt(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=mt(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=q,n=Y,n=dt(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(X===2||X===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&He(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||ft(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&He(r),Ct(n)){case 2:case 8:n=Je;break;case 32:n=Ye;break;case 268435456:n=Ze;break;default:n=Ye}return r=jf.bind(null,e),n=Ve(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&He(r),e.callbackPriority=2,e.callbackNode=null,2}function jf(e,t){if(yd!==0&&yd!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(df()&&e.callbackNode!==n)return null;var r=Y;return r=dt(e,e===q?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(Fd(e,r,t),Af(e,Ge()),e.callbackNode!=null&&e.callbackNode===n?jf.bind(null,e):null)}function Mf(e,t){if(df())return null;Fd(e,t,!0)}function Nf(){bp(function(){K&6?Ve(qe,Of):kf()})}function Pf(){if(Tf===0){var e=za;e===0&&(e=st,st<<=1,!(st&261888)&&(st=256)),Tf=e}return Tf}function Ff(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:yn(e)}function If(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=Ff((i[Ot]||null).action),o=r.submitter;o&&(t=(t=o[Ot]||null)?Ff(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new Vn(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(Tf!==0){var e=new FormData(i,o);ec(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=new FormData(i,o),ec(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var Lf=0;Lf<gi.length;Lf++){var Rf=gi[Lf];_i(Rf.toLowerCase(),`on`+(Rf[0].toUpperCase()+Rf.slice(1)))}_i(ci,`onAnimationEnd`),_i(li,`onAnimationIteration`),_i(ui,`onAnimationStart`),_i(`dblclick`,`onDoubleClick`),_i(`focusin`,`onFocus`),_i(`focusout`,`onBlur`),_i(di,`onTransitionRun`),_i(fi,`onTransitionStart`),_i(pi,`onTransitionCancel`),_i(mi,`onTransitionEnd`),Kt(`onMouseEnter`,[`mouseout`,`mouseover`]),Kt(`onMouseLeave`,[`mouseout`,`mouseover`]),Kt(`onPointerEnter`,[`pointerout`,`pointerover`]),Kt(`onPointerLeave`,[`pointerout`,`pointerover`]),Gt(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),Gt(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),Gt(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),Gt(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),Gt(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),Gt(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var zf=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),Bf=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(zf));function Vf(e,t){t=!!(t&4);for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){Si(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){Si(e)}i.currentTarget=null,a=c}}}}function Q(e,t){var n=t[At];n===void 0&&(n=t[At]=new Set);var r=e+`__bubble`;n.has(r)||(Gf(t,e,2,!1),n.add(r))}function Hf(e,t,n){var r=0;t&&(r|=4),Gf(n,e,r,t)}var Uf=`_reactListening`+Math.random().toString(36).slice(2);function Wf(e){if(!e[Uf]){e[Uf]=!0,Ut.forEach(function(t){t!==`selectionchange`&&(Bf.has(t)||Hf(t,!1,e),Hf(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Uf]||(t[Uf]=!0,Hf(`selectionchange`,!1,t))}}function Gf(e,t,n,r){switch(Ch(t)){case 2:var i=_h;break;case 8:i=vh;break;default:i=yh}n=i.bind(null,t,n,e),i=void 0,!An||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function Kf(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var c=r.stateNode.containerInfo;if(c===i)break;if(s===4)for(s=r.return;s!==null;){var l=s.tag;if((l===3||l===4)&&s.stateNode.containerInfo===i)return;s=s.return}for(;c!==null;){if(s=Lt(c),s===null)return;if(l=s.tag,l===5||l===6||l===26||l===27){r=a=s;continue a}c=c.parentNode}}r=r.return}Dn(function(){var r=a,i=Sn(n),s=[];a:{var c=hi.get(e);if(c!==void 0){var l=Vn,u=e;switch(e){case`keypress`:if(In(n)===0)break a;case`keydown`:case`keyup`:l=ar;break;case`focusin`:u=`focus`,l=Xn;break;case`focusout`:u=`blur`,l=Xn;break;case`beforeblur`:case`afterblur`:l=Xn;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:l=Jn;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:l=Yn;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:l=cr;break;case ci:case li:case ui:l=Zn;break;case mi:l=lr;break;case`scroll`:case`scrollend`:l=Un;break;case`wheel`:l=ur;break;case`copy`:case`cut`:case`paste`:l=Qn;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:l=or;break;case`submit`:l=sr;break;case`toggle`:case`beforetoggle`:l=dr}var d=!!(t&4),f=!d&&(e===`scroll`||e===`scrollend`),p=d?c===null?null:c+`Capture`:c;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=On(m,p),g!=null&&d.push(qf(m,g,h))),f)break;m=m.return}0<d.length&&(c=new l(c,u,null,n,i),s.push({event:c,listeners:d}))}}if(!(t&7)){a:{if(l=e===`mouseover`||e===`pointerover`,c=e===`mouseout`||e===`pointerout`,l&&n!==xn&&(u=n.relatedTarget||n.fromElement)&&(Lt(u)||u[kt]))break a;(c||l)&&(u=i.window===i?i:(l=i.ownerDocument)?l.defaultView||l.parentWindow:window,c?(l=n.relatedTarget||n.toElement,c=r,l=l?Lt(l):null,l!==null&&(f=o(l),d=l.tag,l!==f||d!==5&&d!==27&&d!==6)&&(l=null)):(c=null,l=r),c!==l&&(d=Jn,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=or,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=c==null?u:zt(c),h=l==null?u:zt(l),u=new d(g,m+`leave`,c,n,i),u.target=f,u.relatedTarget=h,g=null,Lt(i)===r&&(d=new d(p,m+`enter`,l,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,d=c&&l?S(c,l,Yf):null,c!==null&&Xf(s,u,c,d,!1),l!==null&&f!==null&&Xf(s,f,l,d,!0)))}a:{if(c=r?zt(r):window,l=c.nodeName&&c.nodeName.toLowerCase(),l===`select`||l===`input`&&c.type===`file`)var _=jr;else if(Tr(c)){if(Mr)_=Vr;else{_=zr;var v=Rr}}else l=c.nodeName,!l||l.toLowerCase()!==`input`||c.type!==`checkbox`&&c.type!==`radio`?r&&gn(r.elementType)&&(_=jr):_=Br;if(_&&=_(e,r)){Er(s,_,n,i);break a}v&&v(e,c,r)}switch(v=r?zt(r):window,e){case`focusin`:(Tr(v)||v.contentEditable===`true`)&&(Qr=v,$r=r,ei=null);break;case`focusout`:ei=$r=Qr=null;break;case`mousedown`:ti=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:ti=!1,ni(s,n,i);break;case`selectionchange`:if(Zr)break;case`keydown`:case`keyup`:ni(s,n,i)}var y;if(pr)b:{switch(e){case`compositionstart`:var b=`onCompositionStart`;break b;case`compositionend`:b=`onCompositionEnd`;break b;case`compositionupdate`:b=`onCompositionUpdate`;break b}b=void 0}else xr?yr(e,n)&&(b=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(b=`onCompositionStart`);b&&(gr&&n.locale!==`ko`&&(xr||b!==`onCompositionStart`?b===`onCompositionEnd`&&xr&&(y=Fn()):(Mn=i,Nn=`value`in Mn?Mn.value:Mn.textContent,xr=!0)),v=Jf(r,b),0<v.length&&(b=new $n(b,e,null,n,i),s.push({event:b,listeners:v}),y?b.data=y:(y=br(n),y!==null&&(b.data=y)))),(y=hr?Sr(e,n):Cr(e,n))&&(b=Jf(r,`onBeforeInput`),0<b.length&&(v=new $n(`onBeforeInput`,`beforeinput`,null,n,i),s.push({event:v,listeners:b}),v.data=y)),If(s,e,r,n,i)}Vf(s,t)})}function qf(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Jf(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=On(e,n),i!=null&&r.unshift(qf(e,i,a)),i=On(e,t),i!=null&&r.push(qf(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Yf(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Xf(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=On(n,a),l!=null&&o.unshift(qf(n,l,c))):i||(l=On(n,a),l!=null&&o.push(qf(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var Zf=/\r\n?/g,Qf=/\u0000|\uFFFD/g;function $f(e){return(typeof e==`string`?e:``+e).replace(Zf,`
`).replace(Qf,``)}function ep(e,t){return t=$f(t),$f(e)===t}function $(e,t,n,r,a,o){switch(n){case`children`:if(typeof r==`string`)t===`body`||t===`textarea`&&r===``||fn(e,r);else if(typeof r==`number`||typeof r==`bigint`)t!==`body`&&fn(e,``+r);else return;break;case`className`:$t(e,`class`,r);break;case`tabIndex`:$t(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:$t(e,n,r);break;case`style`:hn(e,r,o);return;case`data`:if(t!==`object`){$t(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)){e.removeAttribute(n);break}if(r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=yn(r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}if(typeof o==`function`&&(n===`formAction`?(t!==`input`&&$(e,t,`name`,a.name,a,null),$(e,t,`formEncType`,a.formEncType,a,null),$(e,t,`formMethod`,a.formMethod,a,null),$(e,t,`formTarget`,a.formTarget,a,null)):($(e,t,`encType`,a.encType,a,null),$(e,t,`method`,a.method,a,null),$(e,t,`target`,a.target,a,null))),r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=yn(r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=bn);return;case`onScroll`:r!=null&&Q(`scroll`,e);return;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);return;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));o?.__html!==n&&(e.innerHTML=n)}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=yn(r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`credentialless`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:Q(`beforetoggle`,e),Q(`toggle`,e),Qt(e,`popover`,r);break;case`xlinkActuate`:en(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:en(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:en(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:en(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:en(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:en(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:en(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:en(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:en(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:Qt(e,`is`,r);break;case`innerText`:case`textContent`:return;default:if(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)n=_n.get(n)||n,Qt(e,n,r);else return}P=!0}function tp(e,t,n,r,a,o){switch(n){case`style`:hn(e,r,o);return;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));o?.__html!==n&&(e.innerHTML=n)}}break;case`children`:if(typeof r==`string`)fn(e,r);else if(typeof r==`number`||typeof r==`bigint`)fn(e,``+r);else return;break;case`onScroll`:r!=null&&Q(`scroll`,e);return;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);return;case`onClick`:r!=null&&(e.onclick=bn);return;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:return;case`innerText`:case`textContent`:return;default:if(!Wt.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(a=n.endsWith(`Capture`),o=n.slice(2,a?n.length-7:void 0),t=e[Ot]||null,t=t==null?null:t[n],typeof t==`function`&&e.removeEventListener(o,t,a),typeof r==`function`)){typeof t!=`function`&&t!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(o,r,a);break a}P=!0,n in e?e[n]=r:!0===r?e.setAttribute(n,``):Qt(e,n,r)}return}P=!0}function np(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:Q(`error`,e),Q(`load`,e);var r=!1,a=!1,o;for(o in n)if(n.hasOwnProperty(o)){var s=n[o];if(s!=null)switch(o){case`src`:r=!0;break;case`srcSet`:a=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,o,s,n,null)}}a&&$(e,t,`srcSet`,n.srcSet,n,null),r&&$(e,t,`src`,n.src,n,null);return;case`input`:Q(`invalid`,e);var c=o=s=a=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:a=d;break;case`type`:s=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:o=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(i(137,t));break;default:$(e,t,r,d,n,null)}}L(e,o,c,l,u,s,a,!1);return;case`select`:for(a in Q(`invalid`,e),r=s=o=null,n)if(n.hasOwnProperty(a)&&(c=n[a],c!=null))switch(a){case`value`:o=c;break;case`defaultValue`:s=c;break;case`multiple`:r=c;default:$(e,t,a,c,n,null)}t=o,n=s,e.multiple=!!r,t==null?n!=null&&ln(e,!!r,n,!0):ln(e,!!r,t,!1);return;case`textarea`:for(s in Q(`invalid`,e),o=a=r=null,n)if(n.hasOwnProperty(s)&&(c=n[s],c!=null))switch(s){case`value`:r=c;break;case`defaultValue`:a=c;break;case`children`:o=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(i(91));break;default:$(e,t,s,c,n,null)}dn(e,r,a,o);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:$(e,t,l,r,n,null)}return;case`dialog`:Q(`beforetoggle`,e),Q(`toggle`,e),Q(`cancel`,e),Q(`close`,e);break;case`iframe`:case`object`:Q(`load`,e);break;case`video`:case`audio`:for(r=0;r<zf.length;r++)Q(zf[r],e);break;case`image`:Q(`error`,e),Q(`load`,e);break;case`details`:Q(`toggle`,e);break;case`embed`:case`source`:case`link`:Q(`error`,e),Q(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,u,r,n,null)}return;default:if(gn(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&tp(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&$(e,t,c,r,n,null))}var rp={};function ip(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var a=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||$(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:m!==f&&(P=!0),o=m;break;case`name`:m!==f&&(P=!0),a=m;break;case`checked`:m!==f&&(P=!0),u=m;break;case`defaultChecked`:m!==f&&(P=!0),d=m;break;case`value`:m!==f&&(P=!0),s=m;break;case`defaultValue`:m!==f&&(P=!0),c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(i(137,t));break;default:m!==f&&$(e,t,p,m,r,f)}}sn(e,s,c,l,u,d,o,a);return;case`select`:for(o in m=s=c=p=null,n)if(l=n[o],n.hasOwnProperty(o)&&l!=null)switch(o){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(o)||$(e,t,o,null,r,l)}for(a in r)if(o=r[a],l=n[a],r.hasOwnProperty(a)&&(o!=null||l!=null))switch(a){case`value`:o!==l&&(P=!0),p=o;break;case`defaultValue`:o!==l&&(P=!0),c=o;break;case`multiple`:o!==l&&(P=!0),s=o;default:o!==l&&$(e,t,a,o,r,l)}t=c,n=s,r=m,p==null?!!r!=!!n&&(t==null?ln(e,!!n,n?[]:``,!1):ln(e,!!n,t,!0)):ln(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(a=n[c],n.hasOwnProperty(c)&&a!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:$(e,t,c,null,r,a)}for(s in r)if(a=r[s],o=n[s],r.hasOwnProperty(s)&&(a!=null||o!=null))switch(s){case`value`:a!==o&&(P=!0),p=a;break;case`defaultValue`:a!==o&&(P=!0),m=a;break;case`children`:break;case`dangerouslySetInnerHTML`:if(a!=null)throw Error(i(91));break;default:a!==o&&$(e,t,s,a,r,o)}un(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:$(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:p!==m&&(P=!0),e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:$(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&$(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(i(137,t));break;default:$(e,t,u,p,r,m)}return;default:if(gn(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&tp(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||tp(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&$(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||$(e,t,f,p,r,m)}function ap(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function op(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&ap(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&ap(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var sp=null,cp=null;function lp(e){return e.nodeType===9?e:e.ownerDocument}function up(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function dp(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function fp(e,t,n,r){return n=lp(n).createElement(e),n[Dt]=r,n[Ot]=t,np(n,e,t),Vt(n),n}function pp(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var mp=null;function hp(){var e=window.event;return e&&e.type===`popstate`?e!==mp&&(mp=e,!0):(mp=null,!1)}var gp=typeof setTimeout==`function`?setTimeout:void 0,_p=typeof clearTimeout==`function`?clearTimeout:void 0,vp=typeof Promise==`function`?Promise:void 0,yp=typeof requestAnimationFrame==`function`?requestAnimationFrame:gp,bp=typeof queueMicrotask==`function`?queueMicrotask:vp===void 0?gp:function(e){return vp.resolve(null).then(e).catch(xp)};function xp(e){setTimeout(function(){throw e})}function Sp(e){return e===`head`}function Cp(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8){if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Hh(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)_m(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,_m(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[Pt]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&_m(e.ownerDocument.body)}n=i}while(n);Hh(t)}function wp(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8){if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++}n=r}while(n)}function Tp(e,t,n){if(t=CSS.escape(t)===t?t:`r-`+btoa(t).replace(/=/g,``),e.style.viewTransitionName=t,n!=null&&(e.style.viewTransitionClass=n),n=getComputedStyle(e),n.display===`inline`){if(t=e.getClientRects(),t.length===1)var r=1;else for(var i=r=0;i<t.length;i++){var a=t[i];0<a.width&&0<a.height&&r++}r===1&&(e=e.style,e.display=t.length===1?`inline-block`:`block`,e.marginTop=`-`+n.paddingTop,e.marginBottom=`-`+n.paddingBottom)}}function Ep(e,t){e=e.style,t=t.style;var n=t==null?null:t.hasOwnProperty(`viewTransitionName`)?t.viewTransitionName:t.hasOwnProperty(`view-transition-name`)?t[`view-transition-name`]:null;e.viewTransitionName=n==null||typeof n==`boolean`?``:(``+n).trim(),n=t==null?null:t.hasOwnProperty(`viewTransitionClass`)?t.viewTransitionClass:t.hasOwnProperty(`view-transition-class`)?t[`view-transition-class`]:null,e.viewTransitionClass=n==null||typeof n==`boolean`?``:(``+n).trim(),e.display===`inline-block`&&(t==null?e.display=e.margin=``:(n=t.display,e.display=n==null||typeof n==`boolean`?``:n,n=t.margin,n==null?(n=t.hasOwnProperty(`marginTop`)?t.marginTop:t[`margin-top`],e.marginTop=n==null||typeof n==`boolean`?``:n,t=t.hasOwnProperty(`marginBottom`)?t.marginBottom:t[`margin-bottom`],e.marginBottom=t==null||typeof t==`boolean`?``:t):e.margin=n))}function Dp(e,t,n){return n=n.ownerDocument.defaultView,{rect:e,abs:t.position===`absolute`||t.position===`fixed`,clip:t.clipPath!==`none`||t.overflow!==`visible`||t.filter!==`none`||t.mask!==`none`||t.mask!==`none`||t.borderRadius!==`0px`,view:0<=e.bottom&&0<=e.right&&e.top<=n.innerHeight&&e.left<=n.innerWidth}}function Op(e){return Dp(e.getBoundingClientRect(),getComputedStyle(e),e)}function kp(e){var t=e.getBoundingClientRect();t=new DOMRect(t.x+2e4,t.y+2e4,t.width,t.height);var n=getComputedStyle(e);return Dp(t,n,e)}function Ap(e){return e.documentElement.clientHeight}function jp(e){this.addEventListener(`load`,e),this.addEventListener(`error`,e)}function Mp(e,t,n,r,i,a,o,s,c){var l=t.nodeType===9?t:t.ownerDocument;try{var u=l.startViewTransition({update:function(){var t=l.defaultView,n=t.navigation&&t.navigation.transition,o=l.fonts.status;r();var s=[];if(o===`loaded`&&(Ap(l),l.fonts.status===`loading`&&s.push(l.fonts.ready)),o=s.length,e!==null)for(var c=e.suspenseyImages,u=0,d=0;d<c.length;d++){var f=c[d];if(!f.complete){var p=f.getBoundingClientRect();if(0<p.bottom&&0<p.right&&p.top<t.innerHeight&&p.left<t.innerWidth){if(u+=Xm(f),u>$m){s.length=o;break}f=new Promise(jp.bind(f)),s.push(f)}}}if(0<s.length)return t=Promise.race([Promise.all(s),new Promise(function(e){return setTimeout(e,500)})]).then(i,i),(n?Promise.allSettled([n.finished,t]):t).then(a,a);if(i(),n)return n.finished.then(a,a);a()},types:n});l.__reactViewTransition=u;var d=[];return u.ready.then(function(){for(var e=l.documentElement.getAnimations({subtree:!0}),t=0;t<e.length;t++){var n=e[t],r=n.effect,i=r.pseudoElement;if(i!=null&&i.startsWith(`::view-transition`)){d.push(n),n=r.getKeyframes();for(var a=i=void 0,s=!0,c=0;c<n.length;c++){var u=n[c],f=u.width;if(i===void 0)i=f;else if(i!==f){s=!1;break}if(f=u.height,a===void 0)a=f;else if(a!==f){s=!1;break}delete u.width,delete u.height,u.transform===`none`&&delete u.transform}s&&i!==void 0&&a!==void 0&&(r.setKeyframes(n),s=getComputedStyle(r.target,r.pseudoElement),s.width!==i||s.height!==a)&&(s=n[0],s.width=i,s.height=a,s=n[n.length-1],s.width=i,s.height=a,r.setKeyframes(n))}}o()},function(e){l.__reactViewTransition===u&&(l.__reactViewTransition=null);try{if(typeof e==`object`&&e)switch(e.name){case`InvalidStateError`:(e.message===`View transition was skipped because document visibility state is hidden.`||e.message===`Skipping view transition because document visibility state has become hidden.`||e.message===`Skipping view transition because viewport size changed.`||e.message===`Transition was aborted because of invalid state`)&&(e=null)}e!==null&&c(e)}finally{r(),i(),o()}}),u.finished.finally(function(){for(var e=0;e<d.length;e++)d[e].cancel();l.__reactViewTransition===u&&(l.__reactViewTransition=null),s()}),u}catch{return r(),i(),o(),null}}function Np(e,t){this._scope=document.documentElement,this._selector=`::view-transition-`+e+`(`+t+`)`}Np.prototype.animate=function(e,t){return t=typeof t==`number`?{duration:t}:C({},t),t.pseudoElement=this._selector,this._scope.animate(e,t)},Np.prototype.getAnimations=function(){for(var e=this._scope,t=this._selector,n=e.getAnimations({subtree:!0}),r=[],i=0;i<n.length;i++){var a=n[i].effect;a!==null&&a.target===e&&a.pseudoElement===t&&r.push(n[i])}return r},Np.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function Pp(e){return{name:e,group:new Np(`group`,e),imagePair:new Np(`image-pair`,e),old:new Np(`old`,e),new:new Np(`new`,e)}}function Fp(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}Fp.prototype.addEventListener=function(e,t,n){var r=null,i=null;if(!(n!=null&&typeof n!=`boolean`&&(r=n.signal||null,r!==null&&r.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var a=this._eventListeners;if(Bp(a,e,t,n)===-1){var o=this,s=t;n!=null&&typeof n!=`boolean`&&!0===n.once&&(s=function(r){o.removeEventListener(e,t,n),typeof t==`function`?t.call(this,r):t.handleEvent(r)}),r!==null&&(i=o.removeEventListener.bind(o,e,t,n),r.addEventListener(`abort`,i,{once:!0}),i=r.removeEventListener.bind(r,`abort`,i)),r=Rp(n),a.push({type:e,listener:t,optionsOrUseCapture:n,attachedListener:s,cleanup:i}),m(this._fragmentFiber.child,!1,Ip,e,s,r)}this._eventListeners=a}};function Ip(e,t,n,r){return b(e).addEventListener(t,n,r),!1}Fp.prototype.removeEventListener=function(e,t,n){var r=this._eventListeners;if(r!==null&&(t=Bp(r,e,t,n),t!==-1)){var i=r[t];n=i.attachedListener;var a=i.cleanup;i=Rp(i.optionsOrUseCapture),m(this._fragmentFiber.child,!1,Lp,e,n,i),r.splice(t,1),a!==null&&a()}};function Lp(e,t,n,r){return b(e).removeEventListener(t,n,r),!1}function Rp(e){return e!=null&&typeof e!=`boolean`&&(!0===e.once||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function zp(e){return e==null?`c=0`:typeof e==`boolean`?`c=`+(e?`1`:`0`):`c=`+(e.capture?`1`:`0`)}function Bp(e,t,n,r){if(e.length===0)return-1;r=zp(r);for(var i=0;i<e.length;i++){var a=e[i];if(a.type===t&&a.listener===n&&zp(a.optionsOrUseCapture)===r)return i}return-1}Fp.prototype.dispatchEvent=function(e){var t=g(this._fragmentFiber);if(t===null)return!0;t=b(t);var n=this._eventListeners;if(n!==null&&0<n.length||!e.bubbles){var r=t.nodeType===9?t.createComment(``):document.createTextNode(``);if(n)for(var i=0;i<n.length;i++){var a=n[i];r.addEventListener(a.type,a.attachedListener,Rp(a.optionsOrUseCapture))}if(t.appendChild(r),e=r.dispatchEvent(e),n)for(i=0;i<n.length;i++)a=n[i],r.removeEventListener(a.type,a.attachedListener,Rp(a.optionsOrUseCapture));return t.removeChild(r),e}return t.dispatchEvent(e)},Fp.prototype.focus=function(e){m(this._fragmentFiber.child,!0,Vp,e,void 0,void 0)};function Vp(e,t){return e.tag!==6&&(e=b(e),pm(e,t))}Fp.prototype.focusLast=function(e){var t=[];m(this._fragmentFiber.child,!0,Hp,t,void 0,void 0);for(var n=t.length-1;0<=n&&!Vp(t[n],e);n--);};function Hp(e,t){return t.push(e),!1}Fp.prototype.blur=function(){var e=g(this._fragmentFiber);e!==null&&(e=b(e),e=lp(e).activeElement,e!==null&&m(this._fragmentFiber.child,!1,Up,e,void 0,void 0))};function Up(e,t){return e.tag!==6&&(e=b(e),e===t||e.contains(t)?(t.blur(),!0):!1)}Fp.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),m(this._fragmentFiber.child,!1,Wp,e,void 0,void 0)};function Wp(e,t){return e.tag!==6&&(e=b(e),t.observe(e),!1)}Fp.prototype.unobserveUsing=function(e){var t=this._observers;if(t!==null&&t.has(e)){t.delete(e),m(this._fragmentFiber.child,!1,Gp,e,void 0,void 0);for(var n=t=0;n<Kp.length;n++){var r=Kp[n];r.fragmentInstance===this&&r.observer===e?e.unobserve(r.instance):Kp[t++]=r}Kp.length=t}};function Gp(e,t){return e.tag!==6&&(e=b(e),t.unobserve(e),!1)}var Kp=[],qp=!1;function Jp(e,t,n){Kp.push({fragmentInstance:e,observer:t,instance:n}),qp||(qp=!0,mm(function(){qp=!1;var e=Kp;Kp=[];for(var t=0;t<e.length;t++){var n=e[t];n.observer.unobserve(n.instance)}}))}Fp.prototype.getClientRects=function(){var e=[];return m(this._fragmentFiber.child,!1,Yp,e,void 0,void 0),e};function Yp(e,t){if(e.tag===6){e=e.stateNode;var n=e.ownerDocument.createRange();n.selectNodeContents(e),t.push.apply(t,n.getClientRects())}else e=b(e),t.push.apply(t,e.getClientRects());return!1}Fp.prototype.getRootNode=function(e){var t=g(this._fragmentFiber);return t===null?this:b(t).getRootNode(e)},Fp.prototype.compareDocumentPosition=function(e){var t=g(this._fragmentFiber);if(t===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var n=[];m(this._fragmentFiber.child,!1,Hp,n,void 0,void 0);var r=b(t);if(n.length===0){if(n=r,_(this._fragmentFiber)){a:{for(t=this._fragmentFiber.return;t!==null;){if(t.tag===4){t=t.stateNode.containerInfo;break a}if(t.tag===3||t.tag===5||t.tag===27)break;t=t.return}t=null}t!=null&&(n=t)}t=this._fragmentFiber;var i=r=n.compareDocumentPosition(e);return n===e?i=Node.DOCUMENT_POSITION_CONTAINS:r&Node.DOCUMENT_POSITION_CONTAINED_BY&&(n=v(t)[1],n===null?i=Node.DOCUMENT_POSITION_PRECEDING:(e=b(n).compareDocumentPosition(e),i=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),i|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}t=b(n[0]),i=b(n[n.length-1]);var a=_(this._fragmentFiber)?t.parentElement:r;if(a==null)return Node.DOCUMENT_POSITION_DISCONNECTED;r=a.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_CONTAINED_BY,a=a.compareDocumentPosition(i)&Node.DOCUMENT_POSITION_CONTAINED_BY;var o=t.compareDocumentPosition(e),s=i.compareDocumentPosition(e),c=o&Node.DOCUMENT_POSITION_CONTAINED_BY||s&Node.DOCUMENT_POSITION_CONTAINED_BY;return s=r&&a&&o&Node.DOCUMENT_POSITION_FOLLOWING&&s&Node.DOCUMENT_POSITION_PRECEDING,t=r&&t===e||a&&i===e||c||s?Node.DOCUMENT_POSITION_CONTAINED_BY:!r&&t===e||!a&&i===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:o,t&Node.DOCUMENT_POSITION_DISCONNECTED||t&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||Xp(t,this._fragmentFiber,n[0],n[n.length-1],e)?t:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function Xp(e,t,n,r,i){var a=Lt(i);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(n=!!a)a:{for(;a!==null;){if(a.tag===7&&(a===t||a.alternate===t)){n=!0;break a}a=a.return}n=!1}return n}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(a===null)return a=i.ownerDocument,i===a||i===a.documentElement||i===a.body;a:{for(a=t,t=g(t);a!==null;){if(!(a.tag!==5&&a.tag!==3&&a.tag!==27||a!==t&&a.alternate!==t)){a=!0;break a}a=a.return}a=!1}return a}return e&Node.DOCUMENT_POSITION_PRECEDING?((t=!!a)&&!(t=a===n)&&(t=S(n,a,x),t===null?t=!1:(m(t,!0,ne,a,n),a=ee,ee=null,t=a!==null)),t):e&Node.DOCUMENT_POSITION_FOLLOWING?((t=!!a)&&!(t=a===r)&&(t=S(r,a,x),t===null?t=!1:(m(t,!0,re,a,r),a=ee,te=ee=null,t=a!==null)),t):!1}function Zp(e,t){var n=e.ownerDocument.createRange();n.selectNodeContents(e),e=n.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,t?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}Fp.prototype.scrollIntoView=function(e){if(typeof e==`object`)throw Error(i(566));var t=[];m(this._fragmentFiber.child,!1,Hp,t,void 0,void 0);var n=!1!==e;if(t.length===0){var r=v(this._fragmentFiber);if(r=n?r[1]||r[0]||g(this._fragmentFiber):r[0]||r[1],r===null)return;if(r.tag===6){e=b(r),Zp(e,n);return}if(r=b(r),r.nodeType!==9){if(r.nodeType===11){n=`host`in r?r.host:null,n!==null&&n.scrollIntoView(e);return}r.scrollIntoView(e)}}for(r=n?t.length-1:0;r!==(n?-1:t.length);){var a=t[r];a.tag===6?(a=b(a),Zp(a,n)):b(a).scrollIntoView(e),r+=n?-1:1}};function Qp(e,t){return e=b(e),$p(e,t),!1}function $p(e,t){e.reactFragments??=new Set,e.reactFragments.add(t)}function em(e,t){var n=t._eventListeners;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];e.addEventListener(i.type,i.attachedListener,Rp(i.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(n){for(var r=0,i=0;i<Kp.length;i++){var a=Kp[i];(a.fragmentInstance!==t||a.observer!==n||a.instance!==e)&&(Kp[r++]=a)}Kp.length=r,n.observe(e)}),$p(e,t))}function tm(e,t){var n=t._eventListeners;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];e.removeEventListener(i.type,i.attachedListener,Rp(i.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(n){typeof n.rootMargin==`string`?Jp(t,n,e):n.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(t))}function nm(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:nm(n),It(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function rm(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r){if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e}else if(!e[Pt])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=lm(e.nextSibling),e===null)break}return null}function im(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=lm(e.nextSibling),e===null))return null;return e}function am(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=lm(e.nextSibling),e===null))return null;return e}function om(e){return e.data===`$?`||e.data===`$~`}function sm(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function cm(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function lm(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var um=null;function dm(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return lm(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function fm(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function pm(e,t){function n(){r=!0}if(e.ownerDocument.activeElement===e)return!0;var r=!1;try{e.ownerDocument.addEventListener(`focus`,n,!0),(e.focus||HTMLElement.prototype.focus).call(e,t)}finally{e.ownerDocument.removeEventListener(`focus`,n,!0)}return r}function mm(e){yp(function(){yp(function(t){return e(t)})})}function hm(e,t,n){switch(t=lp(n),e){case`html`:if(e=t.documentElement,!e)throw Error(i(452));return e;case`head`:if(e=t.head,!e)throw Error(i(453));return e;case`body`:if(e=t.body,!e)throw Error(i(454));return e;default:throw Error(i(451))}}function gm(e,t,n){for(var r in n){var i=n[r];n.hasOwnProperty(r)&&i!=null&&$(e,t,r,null,rp,i)}n.dangerouslySetInnerHTML!=null&&(e.textContent=``),e.onclick===bn&&(e.onclick=null),It(e)}function _m(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);It(e)}var vm=new Map,ym=new Set;function bm(e){if(typeof e.getRootNode==`function`){var t=e.getRootNode();if(t.nodeType===9||t.nodeType===11)return t}return e.nodeType===9?e:e.ownerDocument}var xm=O.d;O.d={f:Sm,r:Cm,D:Em,C:Dm,L:Om,m:km,X:jm,S:Am,M:Mm};function Sm(){var e=xm.f(),t=zd();return e||t}function Cm(e){var t=Rt(e);t!==null&&t.tag===5&&t.type===`form`?nc(t):xm.r(e)}var wm=typeof document>`u`?null:document;function Tm(e,t,n){var r=wm;if(r&&typeof t==`string`&&t){var i=on(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),ym.has(i)||(ym.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),np(t,`link`,e),Vt(t),r.head.appendChild(t)))}}function Em(e){xm.D(e),Tm(`dns-prefetch`,e,null)}function Dm(e,t){xm.C(e,t),Tm(`preconnect`,e,t)}function Om(e,t,n){xm.L(e,t,n);var r=wm;if(r&&e&&t){var i=`link[rel="preload"][as="`+on(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+on(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+on(n.imageSizes)+`"]`)):i+=`[href="`+on(e)+`"]`;var a=i;switch(t){case`style`:a=Pm(e);break;case`script`:a=Rm(e)}if(!(vm.has(a)||(e=C({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),vm.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(Fm(a))||t===`script`&&r.querySelector(zm(a))))){var o=r.createElement(`link`);np(o,`link`,e),t===`style`&&(o[Ft]=!0,o.onload=o.onerror=function(){Ht(o)}),Vt(o),r.head.appendChild(o)}}}function km(e,t){xm.m(e,t);var n=wm;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+on(r)+`"][href="`+on(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Rm(e)}if(!vm.has(a)&&(e=C({rel:`modulepreload`,href:e},t),vm.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(zm(a)))return}r=n.createElement(`link`),np(r,`link`,e),Vt(r),n.head.appendChild(r)}}}function Am(e,t,n){xm.S(e,t,n);var r=wm;if(r&&e){var i=Bt(r).hoistableStyles,a=Pm(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(Fm(a)))s.loading=5;else{e=C({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=vm.get(a))&&Hm(e,n);var c=o=r.createElement(`link`);Vt(c),np(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Vm(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function jm(e,t){xm.X(e,t);var n=wm;if(n&&e){var r=Bt(n).hoistableScripts,i=Rm(e),a=r.get(i);a||(a=n.querySelector(zm(i)),a||(e=C({src:e,async:!0},t),(t=vm.get(i))&&Um(e,t),a=n.createElement(`script`),Vt(a),np(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Mm(e,t){xm.M(e,t);var n=wm;if(n&&e){var r=Bt(n).hoistableScripts,i=Rm(e),a=r.get(i);a||(a=n.querySelector(zm(i)),a||(e=C({src:e,async:!0,type:`module`},t),(t=vm.get(i))&&Um(e,t),a=n.createElement(`script`),Vt(a),np(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Nm(e,t,n,r){var a=(a=De.current)?bm(a):null;if(!a)throw Error(i(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(n=Pm(n.href),t=Bt(a).hoistableStyles,r=t.get(n),r||(r={type:`style`,instance:null,count:0,state:null},t.set(n,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Pm(n.href);var o=Bt(a).hoistableStyles,s=o.get(e);if(s||(a=a.ownerDocument||a,s={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},o.set(e,s),(o=a.querySelector(Fm(e)))?o._p||(s.instance=o,s.state.loading=5):(o=vm.get(e),o||(o={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},vm.set(e,o)),Lm(a,e,o,s.state))),t&&r===null)throw Error(i(528,``));return s}if(t&&r!==null)throw Error(i(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(n=Rm(n),t=Bt(a).hoistableScripts,r=t.get(n),r||(r={type:`script`,instance:null,count:0,state:null},t.set(n,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(i(444,e))}}function Pm(e){return`href="`+on(e)+`"`}function Fm(e){return`link[rel="stylesheet"][`+e+`]`}function Im(e){return C({},e,{"data-precedence":e.precedence,precedence:null})}function Lm(e,t,n,r){if(t=e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)){if(!0!==t[Ft]){r.loading=1;return}}else t=e.createElement(`link`),t[Ft]=!0,t.onload=t.onerror=Ht.bind(null,t),np(t,`link`,n),Vt(t),e.head.appendChild(t);r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2})}function Rm(e){return`[src="`+on(e)+`"]`}function zm(e){return`script[async]`+e}function Bm(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+on(n.href)+`"]`);if(r)return t.instance=r,Vt(r),r;var a=C({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),Vt(r),np(r,`style`,a),Vm(r,n.precedence,e),t.instance=r;case`stylesheet`:a=Pm(n.href);var o=e.querySelector(Fm(a));if(o)return t.state.loading|=4,t.instance=o,Vt(o),o;r=Im(n),(a=vm.get(a))&&Hm(r,a),o=(e.ownerDocument||e).createElement(`link`),Vt(o);var s=o;return s._p=new Promise(function(e,t){s.onload=e,s.onerror=t}),np(o,`link`,r),t.state.loading|=4,Vm(o,n.precedence,e),t.instance=o;case`script`:return o=Rm(n.src),(a=e.querySelector(zm(o)))?(t.instance=a,Vt(a),a):(r=n,(a=vm.get(o))&&(r=C({},n),Um(r,a)),e=e.ownerDocument||e,a=e.createElement(`script`),Vt(a),np(a,`link`,r),e.head.appendChild(a),t.instance=a);case`void`:return null;default:throw Error(i(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Vm(r,n.precedence,e));return t.instance}function Vm(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Hm(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function Um(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Wm=null;function Gm(e,t,n){if(Wm===null){var r=new Map,i=Wm=new Map;i.set(n,r)}else i=Wm,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[Pt]||a[Dt]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Km(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function qm(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Jm(e,t){return e===`img`&&t.src!=null&&t.src!==``&&t.onLoad==null&&t.loading!==`lazy`}function Ym(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Xm(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio==`number`?devicePixelRatio:1)*.25}function Zm(e,t){typeof t.decode==`function`&&(e.imgCount++,t.complete||(e.imgBytes+=Xm(t),e.suspenseyImages.push(t)),e=rh.bind(e),t.decode().then(e,e))}function Qm(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Pm(r.href),a=t.querySelector(Fm(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=nh.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,Vt(a);return}a=t.ownerDocument||t,r=Im(r),(i=vm.get(i))&&Hm(r,i),a=a.createElement(`link`),Vt(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),np(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=nh.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var $m=0;function eh(e,t){return e.stylesheets&&e.count===0&&ah(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&ah(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&$m===0&&($m=62500*op());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&ah(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>$m?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function th(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)ah(e,e.stylesheets);else if(e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}}}function nh(){this.count--,th(this)}function rh(){this.imgCount--,th(this)}var ih=null;function ah(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,ih=new Map,t.forEach(oh,e),ih=null,nh.call(e))}function oh(e,t){if(!(t.state.loading&4)){var n=ih.get(e);if(n)var r=n.get(null);else{n=new Map,ih.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=nh.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var sh={$$typeof:le,Provider:null,Consumer:null,_currentValue:k,_currentValue2:k,_threadCount:0};function ch(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=gt(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=gt(0),this.hiddenUpdates=gt(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.transitionTypes=null,this.incompleteTransitions=new Map}function lh(e,t,n,r,i,a,o,s,c,l,u,d){return e=new ch(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=Pi(3,null,null,t),e.current=a,a.stateNode=e,t=Ma(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},ho(a),e}function uh(e){return e?(e=Mi,e):Mi}function dh(e,t,n,r,i,a){i=uh(i),r.context===null?r.context=i:r.pendingContext=i,r=_o(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=vo(e,r,t),n!==null&&(Pd(n,e,t),yo(n,e,t))}function fh(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ph(e,t){fh(e,t),(e=e.alternate)&&fh(e,t)}function mh(e){if(e.tag===13||e.tag===31){var t=ki(e,67108864);t!==null&&Pd(t,e,67108864),ph(e,67108864)}}function hh(e){if(e.tag===13||e.tag===31){var t=jd();t=St(t);var n=ki(e,t);n!==null&&Pd(n,e,t),ph(e,t)}}var gh=!0;function _h(e,t,n,r){var i=D.T;D.T=null;var a=O.p;try{O.p=2,yh(e,t,n,r)}finally{O.p=a,D.T=i}}function vh(e,t,n,r){var i=D.T;D.T=null;var a=O.p;try{O.p=8,yh(e,t,n,r)}finally{O.p=a,D.T=i}}function yh(e,t,n,r){if(gh){var i=bh(r);if(i===null)Kf(e,t,r,xh,n),Mh(e,r);else if(Ph(i,e,t,n,r))r.stopPropagation();else if(Mh(e,r),t&4&&-1<jh.indexOf(e)){for(;i!==null;){var a=Rt(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=ut(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-rt(o);s.entanglements[1]|=c,o&=~c}Ef(a),!(K&6)&&(gd=Ge()+500,Df(0,!1))}}break;case 31:case 13:s=ki(a,2),s!==null&&Pd(s,a,2),zd(),ph(a,2)}if(a=bh(r),a===null&&Kf(e,t,r,xh,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else Kf(e,t,r,null,n)}}function bh(e){return e=Sn(e),Sh(e)}var xh=null;function Sh(e){if(xh=null,e=Lt(e),e!==null){var t=o(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=s(t),e!==null)return e;e=null}else if(n===31){if(e=c(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return xh=e,null}function Ch(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`fullscreenerror`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`resize`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(Ke()){case qe:return 2;case Je:return 8;case Ye:case Xe:return 32;case Ze:return 268435456;default:return 32}default:return 32}}var wh=!1,Th=null,Eh=null,Dh=null,Oh=new Map,kh=new Map,Ah=[],jh=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Mh(e,t){switch(e){case`focusin`:case`focusout`:Th=null;break;case`dragenter`:case`dragleave`:Eh=null;break;case`mouseover`:case`mouseout`:Dh=null;break;case`pointerover`:case`pointerout`:Oh.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:kh.delete(t.pointerId)}}function Nh(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=Rt(t),t!==null&&mh(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Ph(e,t,n,r,i){switch(t){case`focusin`:return Th=Nh(Th,e,t,n,r,i),!0;case`dragenter`:return Eh=Nh(Eh,e,t,n,r,i),!0;case`mouseover`:return Dh=Nh(Dh,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return Oh.set(a,Nh(Oh.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,kh.set(a,Nh(kh.get(a)||null,e,t,n,r,i)),!0}return!1}function Fh(e){var t=Lt(e.target);if(t!==null){var n=o(t);if(n!==null){if(t=n.tag,t===13){if(t=s(n),t!==null){e.blockedOn=t,Tt(e.priority,function(){hh(n)});return}}else if(t===31){if(t=c(n),t!==null){e.blockedOn=t,Tt(e.priority,function(){hh(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ih(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=bh(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);xn=r,n.target.dispatchEvent(r),xn=null}else return t=Rt(n),t!==null&&mh(t),e.blockedOn=n,!1;t.shift()}return!0}function Lh(e,t,n){Ih(e)&&n.delete(t)}function Rh(){wh=!1,Th!==null&&Ih(Th)&&(Th=null),Eh!==null&&Ih(Eh)&&(Eh=null),Dh!==null&&Ih(Dh)&&(Dh=null),Oh.forEach(Lh),kh.forEach(Lh)}function zh(e,n){e.blockedOn===n&&(e.blockedOn=null,wh||(wh=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,Rh)))}var Bh=null;function Vh(e){Bh!==e&&(Bh=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){Bh===e&&(Bh=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(Sh(r||n)===null)continue;break}var a=Rt(n);a!==null&&(e.splice(t,3),t-=3,ec(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Hh(e){function t(t){return zh(t,e)}Th!==null&&zh(Th,e),Eh!==null&&zh(Eh,e),Dh!==null&&zh(Dh,e),Oh.forEach(t),kh.forEach(t);for(var n=0;n<Ah.length;n++){var r=Ah[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<Ah.length&&(n=Ah[0],n.blockedOn===null);)Fh(n),n.blockedOn===null&&Ah.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[Ot]||null;if(typeof a==`function`)o||Vh(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[Ot]||null)s=o.formAction;else if(Sh(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Vh(n)}}}function Uh(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Wh(e){this._internalRoot=e}Gh.prototype.render=Wh.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));var n=t.current;dh(n,jd(),e,t,null,null)},Gh.prototype.unmount=Wh.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;dh(e.current,2,null,e,null,null),zd(),t[kt]=null}};function Gh(e){this._internalRoot=e}Gh.prototype.unstable_scheduleHydration=function(e){if(e){var t=wt();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Ah.length&&t!==0&&t<Ah[n].priority;n++);Ah.splice(n,0,e),n===0&&Fh(e)}};var Kh=n.version;if(Kh!==`19.3.0`)throw Error(i(527,Kh,`19.3.0`));O.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(i(188)):(e=Object.keys(e).join(`,`),Error(i(268,e)));return e=u(t),e=e===null?null:f(e),e=e===null?null:e.stateNode,e};var qh={bundleType:0,version:`19.3.0`,rendererPackageName:`react-dom`,currentDispatcherRef:D,reconcilerVersion:`19.3.0`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var Jh=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Jh.isDisabled&&Jh.supportsFiber)try{et=Jh.inject(qh),tt=Jh}catch{}}e.createRoot=function(e,t){if(!a(e))throw Error(i(299));var n=!1,r=``,o=Cc,s=wc,c=Tc;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=lh(e,1,!1,null,null,n,r,null,o,s,c,Uh),e[kt]=t.current,Wf(e),new Wh(t)}})),_=o(((e,t)=>{function n(){if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE==`function`)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=g()})),v=d(),y=_();function b(e){if(!e)return!0;let t=e.trim();return!t||!/[a-zA-Z0-9]/.test(t)}function ee(e,t){let n=(e?.metadata?.team_name)?.trim();return n&&!b(n)?n:e?.display_name?.trim()?e.display_name.trim():`Team ${t}`}function te(e,t){let n=new Map(e.map(e=>[e.user_id,e])),r=new Map;for(let e of t){let t=e.owner_id?n.get(e.owner_id):void 0;r.set(e.roster_id,{rosterId:e.roster_id,userId:e.owner_id??``,displayName:t?.display_name?.trim()??`Roster ${e.roster_id}`,teamName:ee(t,e.roster_id)})}return r}function ne(e){return e.fpts+e.fpts_decimal/100}function re(e){return e.fpts_against+e.fpts_against_decimal/100}var x={recentForm:.3,pointsFor:.25,allPlay:.25,efficiency:.2},S=`GWB Power Score (0–100) = 30% recent form + 25% points-for rate + 25% all-play win% + 20% lineup efficiency.

• Recent form: win% over the last 3 scored weeks (or fewer early in the season).
• Points-for rate: team PF per game vs league average PF per game that week.
• All-play: each week, % of league rosters you would have beaten with that week's score.
• Lineup efficiency: season ratio of actual points scored to optimal lineup (starters chosen from full roster each week using Sleeper matchup player points).`;function C(e){let t=Math.min(3,e);return Array.from({length:t},(t,n)=>e-n).filter(e=>e>=1)}function w(e){let t=new Map;for(let[n,r]of e){let e=new Map;for(let t of r){let n=r.find(e=>e.matchup_id===t.matchup_id&&e.roster_id!==t.roster_id);n&&(t.points>n.points?e.set(t.roster_id,1):t.points<n.points?e.set(t.roster_id,0):e.set(t.roster_id,.5))}t.set(n,e)}return t}function ie(e,t){let n=0,r=0;for(let[,i]of t){let t=i.find(t=>t.roster_id===e);if(t&&(t.points!==0||t.starters?.length))for(let a of i)a.roster_id!==e&&(r++,t.points>a.points?n++:t.points===a.points&&(n+=.5))}return r?n/r:.5}function ae(e,t,n){let r=0,i=0;for(let[,a]of t){let t=a.find(t=>t.roster_id===e);if(!t?.players_points)continue;let o=Object.values(t.players_points).filter(e=>e!=null);if(!o.length)continue;let s=[...o].sort((e,t)=>t-e).slice(0,n).reduce((e,t)=>e+t,0);i+=s,r+=t.points}return i<=0?.85:Math.min(1,r/i)}function oe(e,t,n,r,i=10,a){let o=[...n.keys()].sort((e,t)=>e-t),s=o.length?o[o.length-1]:r,c=C(s).filter(e=>n.has(e)),l=w(n),u=[];for(let e of o){let t=n.get(e),r=t.reduce((e,t)=>e+t.points,0)/Math.max(t.length,1);u.push(r)}let d=u.length?u.reduce((e,t)=>e+t,0)/u.length:120,f=e.map(e=>{let r=e.roster_id,a=ne(e.settings)/Math.max(s,1),o=Math.min(1.25,a/d)/1.25,u=0,f=0;for(let e of c){let t=l.get(e);t?.has(r)&&(f++,u+=t.get(r)??0)}let p=f?u/f:.5,m=ie(r,n),h=ae(r,n,i),g=100*(x.recentForm*p+x.pointsFor*o+x.allPlay*m+x.efficiency*h);return{rosterId:r,teamName:t.get(r)?.teamName??`Team ${r}`,score:g,recentForm:p,pointsForRate:o,allPlayWinPct:m,lineupEfficiency:h}});f.sort((e,t)=>t.score-e.score);let p=new Map(a?.map(e=>[e.rosterId,e.rank]));return f.map((e,t)=>{let n=t+1,r=p.get(e.rosterId);return{rank:n,rosterId:e.rosterId,teamName:e.teamName,score:Math.round(e.score*10)/10,recentForm:e.recentForm,pointsForRate:e.pointsForRate,allPlayWinPct:e.allPlayWinPct,lineupEfficiency:e.lineupEfficiency,movement:r==null?null:r-n}})}var se=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),T=o(((e,t)=>{t.exports=se()}))();function ce(e){return e==null?`·`:e>0?`▲${e}`:e<0?`▼${Math.abs(e)}`:`─`}function le({rows:e}){return(0,T.jsxs)(`div`,{className:`space-y-4`,children:[(0,T.jsxs)(`details`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-4 text-sm text-[var(--gwb-muted)]`,children:[(0,T.jsx)(`summary`,{className:`cursor-pointer font-medium text-[var(--gwb-text)]`,children:`How power score works`}),(0,T.jsx)(`pre`,{className:`mt-3 whitespace-pre-wrap font-sans text-xs leading-relaxed`,children:S})]}),(0,T.jsx)(`ol`,{className:`space-y-2`,children:e.map(e=>(0,T.jsxs)(`li`,{className:`flex items-center gap-3 rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-4 py-3`,children:[(0,T.jsx)(`span`,{className:`w-8 text-lg font-bold text-[var(--gwb-accent)]`,children:e.rank}),(0,T.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,T.jsx)(`div`,{className:`truncate font-medium`,children:e.teamName}),(0,T.jsxs)(`div`,{className:`text-xs text-[var(--gwb-muted)]`,children:[`Form `,(e.recentForm*100).toFixed(0),`% · All-play`,` `,(e.allPlayWinPct*100).toFixed(0),`% · Eff`,` `,(e.lineupEfficiency*100).toFixed(0),`%`]})]}),(0,T.jsxs)(`div`,{className:`text-right`,children:[(0,T.jsx)(`div`,{className:`text-lg font-semibold tabular-nums`,children:e.score}),(0,T.jsx)(`div`,{className:`text-xs text-[var(--gwb-muted)]`,children:ce(e.movement)})]})]},e.rosterId))})]})}function ue(e,t){let n=t||{};return(e[e.length-1]===``?[...e,``]:e).join((n.padRight?` `:``)+`,`+(n.padLeft===!1?``:` `)).trim()}var de=/^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,fe=/^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,pe={};function me(e,t){return((t||pe).jsx?fe:de).test(e)}var he=/[ \t\n\f\r]/g;function ge(e){return typeof e==`object`?e.type===`text`&&_e(e.value):_e(e)}function _e(e){return e.replace(he,``)===``}var ve=class{constructor(e,t,n){this.normal=t,this.property=e,n&&(this.space=n)}};ve.prototype.normal={},ve.prototype.property={},ve.prototype.space=void 0;function ye(e,t){let n={},r={};for(let t of e)Object.assign(n,t.property),Object.assign(r,t.normal);return new ve(n,r,t)}function be(e){return e.toLowerCase()}var xe=class{constructor(e,t){this.attribute=t,this.property=e}};xe.prototype.attribute=``,xe.prototype.booleanish=!1,xe.prototype.boolean=!1,xe.prototype.commaOrSpaceSeparated=!1,xe.prototype.commaSeparated=!1,xe.prototype.defined=!1,xe.prototype.mustUseProperty=!1,xe.prototype.number=!1,xe.prototype.overloadedBoolean=!1,xe.prototype.property=``,xe.prototype.spaceSeparated=!1,xe.prototype.space=void 0;var Se=s({boolean:()=>E,booleanish:()=>D,commaOrSpaceSeparated:()=>j,commaSeparated:()=>we,number:()=>k,overloadedBoolean:()=>O,spaceSeparated:()=>A}),Ce=0,E=M(),D=M(),O=M(),k=M(),A=M(),we=M(),j=M();function M(){return 2**++Ce}var N=Object.keys(Se),Te=class extends xe{constructor(e,t,n,r){let i=-1;if(super(e,t),Ee(this,`space`,r),typeof n==`number`)for(;++i<N.length;){let e=N[i];Ee(this,N[i],(n&Se[e])===Se[e])}}};Te.prototype.defined=!0;function Ee(e,t,n){n&&(e[t]=n)}function De(e){let t={},n={};for(let[r,i]of Object.entries(e.properties)){let a=new Te(r,e.transform(e.attributes||{},r),i,e.space);e.mustUseProperty&&e.mustUseProperty.includes(r)&&(a.mustUseProperty=!0),t[r]=a,n[be(r)]=r,n[be(a.attribute)]=r}return new ve(t,n,e.space)}var Oe=De({properties:{ariaActiveDescendant:null,ariaAtomic:D,ariaAutoComplete:null,ariaBusy:D,ariaChecked:D,ariaColCount:k,ariaColIndex:k,ariaColSpan:k,ariaControls:A,ariaCurrent:null,ariaDescribedBy:A,ariaDetails:null,ariaDisabled:D,ariaDropEffect:A,ariaErrorMessage:null,ariaExpanded:D,ariaFlowTo:A,ariaGrabbed:D,ariaHasPopup:null,ariaHidden:D,ariaInvalid:null,ariaKeyShortcuts:null,ariaLabel:null,ariaLabelledBy:A,ariaLevel:k,ariaLive:null,ariaModal:D,ariaMultiLine:D,ariaMultiSelectable:D,ariaOrientation:null,ariaOwns:A,ariaPlaceholder:null,ariaPosInSet:k,ariaPressed:D,ariaReadOnly:D,ariaRelevant:null,ariaRequired:D,ariaRoleDescription:A,ariaRowCount:k,ariaRowIndex:k,ariaRowSpan:k,ariaSelected:D,ariaSetSize:k,ariaSort:null,ariaValueMax:k,ariaValueMin:k,ariaValueNow:k,ariaValueText:null,role:null},transform(e,t){return t===`role`?t:`aria-`+t.slice(4).toLowerCase()}});function ke(e,t){return t in e?e[t]:t}function Ae(e,t){return ke(e,t.toLowerCase())}var je=De({attributes:{acceptcharset:`accept-charset`,classname:`class`,htmlfor:`for`,httpequiv:`http-equiv`},mustUseProperty:[`checked`,`multiple`,`muted`,`selected`],properties:{abbr:null,accept:we,acceptCharset:A,accessKey:A,action:null,allow:null,allowFullScreen:E,allowPaymentRequest:E,allowUserMedia:E,alpha:E,alt:null,as:null,async:E,autoCapitalize:null,autoComplete:A,autoFocus:E,autoPlay:E,blocking:A,capture:null,charSet:null,checked:E,cite:null,className:A,closedBy:null,colorSpace:null,cols:k,colSpan:k,command:null,commandFor:null,content:null,contentEditable:D,controls:E,controlsList:A,coords:k|we,crossOrigin:null,data:null,dateTime:null,decoding:null,default:E,defer:E,dir:null,dirName:null,disabled:E,download:O,draggable:D,encType:null,enterKeyHint:null,fetchPriority:null,form:null,formAction:null,formEncType:null,formMethod:null,formNoValidate:E,formTarget:null,headers:A,height:k,hidden:O,high:k,href:null,hrefLang:null,htmlFor:A,httpEquiv:A,id:null,imageSizes:null,imageSrcSet:null,inert:E,inputMode:null,integrity:null,is:null,isMap:E,itemId:null,itemProp:A,itemRef:A,itemScope:E,itemType:A,kind:null,label:null,lang:null,language:null,list:null,loading:null,loop:E,low:k,manifest:null,max:null,maxLength:k,media:null,method:null,min:null,minLength:k,multiple:E,muted:E,name:null,nonce:null,noModule:E,noValidate:E,onAbort:null,onAfterPrint:null,onAuxClick:null,onBeforeMatch:null,onBeforePrint:null,onBeforeToggle:null,onBeforeUnload:null,onBlur:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onContextLost:null,onContextMenu:null,onContextRestored:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnded:null,onError:null,onFocus:null,onFormData:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLanguageChange:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadEnd:null,onLoadStart:null,onMessage:null,onMessageError:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRejectionHandled:null,onReset:null,onResize:null,onScroll:null,onScrollEnd:null,onSecurityPolicyViolation:null,onSeeked:null,onSeeking:null,onSelect:null,onSlotChange:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnhandledRejection:null,onUnload:null,onVolumeChange:null,onWaiting:null,onWheel:null,open:E,optimum:k,pattern:null,ping:A,placeholder:null,playsInline:E,popover:null,popoverTarget:null,popoverTargetAction:null,poster:null,preload:null,readOnly:E,referrerPolicy:null,rel:A,required:E,reversed:E,rows:k,rowSpan:k,sandbox:A,scope:null,scoped:E,seamless:E,selected:E,shadowRootClonable:E,shadowRootCustomElementRegistry:E,shadowRootDelegatesFocus:E,shadowRootMode:null,shadowRootSerializable:E,shape:null,size:k,sizes:null,slot:null,span:k,spellCheck:D,src:null,srcDoc:null,srcLang:null,srcSet:null,start:k,step:null,style:null,tabIndex:k,target:null,title:null,translate:null,type:null,typeMustMatch:E,useMap:null,value:D,width:k,wrap:null,writingSuggestions:null,align:null,aLink:null,archive:A,axis:null,background:null,bgColor:null,border:k,borderColor:null,bottomMargin:k,cellPadding:null,cellSpacing:null,char:null,charOff:null,classId:null,clear:null,code:null,codeBase:null,codeType:null,color:null,compact:E,declare:E,event:null,face:null,frame:null,frameBorder:null,hSpace:k,leftMargin:k,link:null,longDesc:null,lowSrc:null,marginHeight:k,marginWidth:k,noResize:E,noHref:E,noShade:E,noWrap:E,object:null,profile:null,prompt:null,rev:null,rightMargin:k,rules:null,scheme:null,scrolling:D,standby:null,summary:null,text:null,topMargin:k,valueType:null,version:null,vAlign:null,vLink:null,vSpace:k,allowTransparency:null,autoCorrect:null,autoSave:null,credentialless:E,disablePictureInPicture:E,disableRemotePlayback:E,exportParts:we,part:A,prefix:null,property:null,results:k,security:null,unselectable:null},space:`html`,transform:Ae}),Me=De({attributes:{accentHeight:`accent-height`,alignmentBaseline:`alignment-baseline`,arabicForm:`arabic-form`,baselineShift:`baseline-shift`,capHeight:`cap-height`,className:`class`,clipPath:`clip-path`,clipRule:`clip-rule`,colorInterpolation:`color-interpolation`,colorInterpolationFilters:`color-interpolation-filters`,colorProfile:`color-profile`,colorRendering:`color-rendering`,crossOrigin:`crossorigin`,dataType:`datatype`,dominantBaseline:`dominant-baseline`,enableBackground:`enable-background`,fillOpacity:`fill-opacity`,fillRule:`fill-rule`,floodColor:`flood-color`,floodOpacity:`flood-opacity`,fontFamily:`font-family`,fontSize:`font-size`,fontSizeAdjust:`font-size-adjust`,fontStretch:`font-stretch`,fontStyle:`font-style`,fontVariant:`font-variant`,fontWeight:`font-weight`,glyphName:`glyph-name`,glyphOrientationHorizontal:`glyph-orientation-horizontal`,glyphOrientationVertical:`glyph-orientation-vertical`,hrefLang:`hreflang`,horizAdvX:`horiz-adv-x`,horizOriginX:`horiz-origin-x`,horizOriginY:`horiz-origin-y`,imageRendering:`image-rendering`,letterSpacing:`letter-spacing`,lightingColor:`lighting-color`,markerEnd:`marker-end`,markerMid:`marker-mid`,markerStart:`marker-start`,maskType:`mask-type`,navDown:`nav-down`,navDownLeft:`nav-down-left`,navDownRight:`nav-down-right`,navLeft:`nav-left`,navNext:`nav-next`,navPrev:`nav-prev`,navRight:`nav-right`,navUp:`nav-up`,navUpLeft:`nav-up-left`,navUpRight:`nav-up-right`,onAbort:`onabort`,onActivate:`onactivate`,onAfterPrint:`onafterprint`,onBeforePrint:`onbeforeprint`,onBegin:`onbegin`,onCancel:`oncancel`,onCanPlay:`oncanplay`,onCanPlayThrough:`oncanplaythrough`,onChange:`onchange`,onClick:`onclick`,onClose:`onclose`,onCopy:`oncopy`,onCueChange:`oncuechange`,onCut:`oncut`,onDblClick:`ondblclick`,onDrag:`ondrag`,onDragEnd:`ondragend`,onDragEnter:`ondragenter`,onDragExit:`ondragexit`,onDragLeave:`ondragleave`,onDragOver:`ondragover`,onDragStart:`ondragstart`,onDrop:`ondrop`,onDurationChange:`ondurationchange`,onEmptied:`onemptied`,onEnd:`onend`,onEnded:`onended`,onError:`onerror`,onFocus:`onfocus`,onFocusIn:`onfocusin`,onFocusOut:`onfocusout`,onHashChange:`onhashchange`,onInput:`oninput`,onInvalid:`oninvalid`,onKeyDown:`onkeydown`,onKeyPress:`onkeypress`,onKeyUp:`onkeyup`,onLoad:`onload`,onLoadedData:`onloadeddata`,onLoadedMetadata:`onloadedmetadata`,onLoadStart:`onloadstart`,onMessage:`onmessage`,onMouseDown:`onmousedown`,onMouseEnter:`onmouseenter`,onMouseLeave:`onmouseleave`,onMouseMove:`onmousemove`,onMouseOut:`onmouseout`,onMouseOver:`onmouseover`,onMouseUp:`onmouseup`,onMouseWheel:`onmousewheel`,onOffline:`onoffline`,onOnline:`ononline`,onPageHide:`onpagehide`,onPageShow:`onpageshow`,onPaste:`onpaste`,onPause:`onpause`,onPlay:`onplay`,onPlaying:`onplaying`,onPopState:`onpopstate`,onProgress:`onprogress`,onRateChange:`onratechange`,onRepeat:`onrepeat`,onReset:`onreset`,onResize:`onresize`,onScroll:`onscroll`,onSeeked:`onseeked`,onSeeking:`onseeking`,onSelect:`onselect`,onShow:`onshow`,onStalled:`onstalled`,onStorage:`onstorage`,onSubmit:`onsubmit`,onSuspend:`onsuspend`,onTimeUpdate:`ontimeupdate`,onToggle:`ontoggle`,onUnload:`onunload`,onVolumeChange:`onvolumechange`,onWaiting:`onwaiting`,onZoom:`onzoom`,overlinePosition:`overline-position`,overlineThickness:`overline-thickness`,paintOrder:`paint-order`,panose1:`panose-1`,pointerEvents:`pointer-events`,referrerPolicy:`referrerpolicy`,renderingIntent:`rendering-intent`,shapeRendering:`shape-rendering`,stopColor:`stop-color`,stopOpacity:`stop-opacity`,strikethroughPosition:`strikethrough-position`,strikethroughThickness:`strikethrough-thickness`,strokeDashArray:`stroke-dasharray`,strokeDashOffset:`stroke-dashoffset`,strokeLineCap:`stroke-linecap`,strokeLineJoin:`stroke-linejoin`,strokeMiterLimit:`stroke-miterlimit`,strokeOpacity:`stroke-opacity`,strokeWidth:`stroke-width`,tabIndex:`tabindex`,textAnchor:`text-anchor`,textDecoration:`text-decoration`,textRendering:`text-rendering`,transformOrigin:`transform-origin`,typeOf:`typeof`,underlinePosition:`underline-position`,underlineThickness:`underline-thickness`,unicodeBidi:`unicode-bidi`,unicodeRange:`unicode-range`,unitsPerEm:`units-per-em`,vAlphabetic:`v-alphabetic`,vHanging:`v-hanging`,vIdeographic:`v-ideographic`,vMathematical:`v-mathematical`,vectorEffect:`vector-effect`,vertAdvY:`vert-adv-y`,vertOriginX:`vert-origin-x`,vertOriginY:`vert-origin-y`,wordSpacing:`word-spacing`,writingMode:`writing-mode`,xHeight:`x-height`,playbackOrder:`playbackorder`,timelineBegin:`timelinebegin`},properties:{about:j,accentHeight:k,accumulate:null,additive:null,alignmentBaseline:null,alphabetic:k,amplitude:k,arabicForm:null,ascent:k,attributeName:null,attributeType:null,azimuth:k,bandwidth:null,baselineShift:null,baseFrequency:null,baseProfile:null,bbox:null,begin:null,bias:k,by:null,calcMode:null,capHeight:k,className:A,clip:null,clipPath:null,clipPathUnits:null,clipRule:null,color:null,colorInterpolation:null,colorInterpolationFilters:null,colorProfile:null,colorRendering:null,content:null,contentScriptType:null,contentStyleType:null,crossOrigin:null,cursor:null,cx:null,cy:null,d:null,dataType:null,defaultAction:null,descent:k,diffuseConstant:k,direction:null,display:null,dur:null,divisor:k,dominantBaseline:null,download:E,dx:null,dy:null,edgeMode:null,editable:null,elevation:k,enableBackground:null,end:null,event:null,exponent:k,externalResourcesRequired:null,fill:null,fillOpacity:k,fillRule:null,filter:null,filterRes:null,filterUnits:null,floodColor:null,floodOpacity:null,focusable:null,focusHighlight:null,fontFamily:null,fontSize:null,fontSizeAdjust:null,fontStretch:null,fontStyle:null,fontVariant:null,fontWeight:null,format:null,fr:null,from:null,fx:null,fy:null,g1:we,g2:we,glyphName:we,glyphOrientationHorizontal:null,glyphOrientationVertical:null,glyphRef:null,gradientTransform:null,gradientUnits:null,handler:null,hanging:k,hatchContentUnits:null,hatchUnits:null,height:null,href:null,hrefLang:null,horizAdvX:k,horizOriginX:k,horizOriginY:k,id:null,ideographic:k,imageRendering:null,initialVisibility:null,in:null,in2:null,intercept:k,k,k1:k,k2:k,k3:k,k4:k,kernelMatrix:j,kernelUnitLength:null,keyPoints:null,keySplines:null,keyTimes:null,kerning:null,lang:null,lengthAdjust:null,letterSpacing:null,lightingColor:null,limitingConeAngle:k,local:null,markerEnd:null,markerMid:null,markerStart:null,markerHeight:null,markerUnits:null,markerWidth:null,mask:null,maskContentUnits:null,maskType:null,maskUnits:null,mathematical:null,max:null,media:null,mediaCharacterEncoding:null,mediaContentEncodings:null,mediaSize:k,mediaTime:null,method:null,min:null,mode:null,name:null,navDown:null,navDownLeft:null,navDownRight:null,navLeft:null,navNext:null,navPrev:null,navRight:null,navUp:null,navUpLeft:null,navUpRight:null,numOctaves:null,observer:null,offset:null,onAbort:null,onActivate:null,onAfterPrint:null,onBeforePrint:null,onBegin:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnd:null,onEnded:null,onError:null,onFocus:null,onFocusIn:null,onFocusOut:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadStart:null,onMessage:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onMouseWheel:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRepeat:null,onReset:null,onResize:null,onScroll:null,onSeeked:null,onSeeking:null,onSelect:null,onShow:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnload:null,onVolumeChange:null,onWaiting:null,onZoom:null,opacity:null,operator:null,order:null,orient:null,orientation:null,origin:null,overflow:null,overlay:null,overlinePosition:k,overlineThickness:k,paintOrder:null,panose1:null,path:null,pathLength:k,patternContentUnits:null,patternTransform:null,patternUnits:null,phase:null,ping:A,pitch:null,playbackOrder:null,pointerEvents:null,points:null,pointsAtX:k,pointsAtY:k,pointsAtZ:k,preserveAlpha:null,preserveAspectRatio:null,primitiveUnits:null,propagate:null,property:j,r:null,radius:null,referrerPolicy:null,refX:null,refY:null,rel:j,rev:j,renderingIntent:null,repeatCount:null,repeatDur:null,requiredExtensions:j,requiredFeatures:j,requiredFonts:j,requiredFormats:j,resource:null,restart:null,result:null,rotate:null,rx:null,ry:null,scale:null,seed:null,shapeRendering:null,side:null,slope:null,snapshotTime:null,specularConstant:k,specularExponent:k,spreadMethod:null,spacing:null,startOffset:null,stdDeviation:null,stemh:null,stemv:null,stitchTiles:null,stopColor:null,stopOpacity:null,strikethroughPosition:k,strikethroughThickness:k,string:null,stroke:null,strokeDashArray:j,strokeDashOffset:null,strokeLineCap:null,strokeLineJoin:null,strokeMiterLimit:k,strokeOpacity:k,strokeWidth:null,style:null,surfaceScale:k,syncBehavior:null,syncBehaviorDefault:null,syncMaster:null,syncTolerance:null,syncToleranceDefault:null,systemLanguage:j,tabIndex:k,tableValues:null,target:null,targetX:k,targetY:k,textAnchor:null,textDecoration:null,textRendering:null,textLength:null,timelineBegin:null,title:null,transformBehavior:null,type:null,typeOf:j,to:null,transform:null,transformOrigin:null,u1:null,u2:null,underlinePosition:k,underlineThickness:k,unicode:null,unicodeBidi:null,unicodeRange:null,unitsPerEm:k,values:null,vAlphabetic:k,vMathematical:k,vectorEffect:null,vHanging:k,vIdeographic:k,version:null,vertAdvY:k,vertOriginX:k,vertOriginY:k,viewBox:null,viewTarget:null,visibility:null,width:null,widths:null,wordSpacing:null,writingMode:null,x:null,x1:null,x2:null,xChannelSelector:null,xHeight:k,y:null,y1:null,y2:null,yChannelSelector:null,z:null,zoomAndPan:null},space:`svg`,transform:ke}),Ne=De({properties:{xLinkActuate:null,xLinkArcRole:null,xLinkHref:null,xLinkRole:null,xLinkShow:null,xLinkTitle:null,xLinkType:null},space:`xlink`,transform(e,t){return`xlink:`+t.slice(5).toLowerCase()}}),Pe=De({attributes:{xmlnsxlink:`xmlns:xlink`},properties:{xmlnsXLink:null,xmlns:null},space:`xmlns`,transform:Ae}),Fe=De({properties:{xmlBase:null,xmlLang:null,xmlSpace:null},space:`xml`,transform(e,t){return`xml:`+t.slice(3).toLowerCase()}}),Ie={classId:`classID`,dataType:`datatype`,itemId:`itemID`,strokeDashArray:`strokeDasharray`,strokeDashOffset:`strokeDashoffset`,strokeLineCap:`strokeLinecap`,strokeLineJoin:`strokeLinejoin`,strokeMiterLimit:`strokeMiterlimit`,typeOf:`typeof`,xLinkActuate:`xlinkActuate`,xLinkArcRole:`xlinkArcrole`,xLinkHref:`xlinkHref`,xLinkRole:`xlinkRole`,xLinkShow:`xlinkShow`,xLinkTitle:`xlinkTitle`,xLinkType:`xlinkType`,xmlnsXLink:`xmlnsXlink`},Le=/[A-Z]/g,Re=/-[a-z]/g,ze=/^data[-\w.:]+$/i;function Be(e,t){let n=be(t),r=t,i=xe;if(n in e.normal)return e.property[e.normal[n]];if(n.length>4&&n.slice(0,4)===`data`&&ze.test(t)){if(t.charAt(4)===`-`){let e=t.slice(5).replace(Re,He);r=`data`+e.charAt(0).toUpperCase()+e.slice(1)}else{let e=t.slice(4);if(!Re.test(e)){let n=e.replace(Le,Ve);n.charAt(0)!==`-`&&(n=`-`+n),t=`data`+n}}i=Te}return new i(r,t)}function Ve(e){return`-`+e.toLowerCase()}function He(e){return e.charAt(1).toUpperCase()}var Ue=ye([Oe,je,Ne,Pe,Fe],`html`),We=ye([Oe,Me,Ne,Pe,Fe],`svg`);function Ge(e){return e.join(` `).trim()}var Ke=o(((e,t)=>{var n=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,r=/\n/g,i=/^\s*/,a=/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,o=/^:\s*/,s=/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,c=/^[;\s]*/,l=/^\s+|\s+$/g;function u(e,t){if(typeof e!=`string`)throw TypeError(`First argument must be a string`);if(!e)return[];t||={};var l=1,u=1;function f(e){var t=e.match(r);t&&(l+=t.length);var n=e.lastIndexOf(`
`);u=~n?e.length-n:u+e.length}function p(){var e={line:l,column:u};return function(t){return t.position=new m(e),_(),t}}function m(e){this.start=e,this.end={line:l,column:u},this.source=t.source}m.prototype.content=e;function h(n){var r=Error(t.source+`:`+l+`:`+u+`: `+n);if(r.reason=n,r.filename=t.source,r.line=l,r.column=u,r.source=e,!t.silent)throw r}function g(t){var n=t.exec(e);if(n){var r=n[0];return f(r),e=e.slice(r.length),n}}function _(){g(i)}function v(e){var t;for(e||=[];t=y();)t!==!1&&e.push(t);return e}function y(){var t=p();if(e.charAt(0)==`/`&&e.charAt(1)==`*`){for(var n=2;e.charAt(n)!=``&&(e.charAt(n)!=`*`||e.charAt(n+1)!=`/`);)++n;if(n+=2,e.charAt(n-1)===``)return h(`End of comment missing`);var r=e.slice(2,n-2);return u+=2,f(r),e=e.slice(n),u+=2,t({type:`comment`,comment:r})}}function b(){var e=p(),t=g(a);if(t){if(y(),!g(o))return h(`property missing ':'`);var r=g(s),i=e({type:`declaration`,property:d(t[0].replace(n,``)),value:r?d(r[0].replace(n,``)):``});return g(c),i}}function ee(){var e=[];v(e);for(var t;t=b();)t!==!1&&(e.push(t),v(e));return e}return _(),ee()}function d(e){return e?e.replace(l,``):``}t.exports=u})),qe=o((e=>{var t=e&&e.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(e,"__esModule",{value:!0}),e.default=r;var n=t(Ke());function r(e,t){let r=null;if(!e||typeof e!=`string`)return r;let i=(0,n.default)(e),a=typeof t==`function`;return i.forEach(e=>{if(e.type!==`declaration`)return;let{property:n,value:i}=e;a?t(n,i,e):i&&(r||={},r[n]=i)}),r}})),Je=o((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.camelCase=void 0;var t=/^--[a-zA-Z0-9_-]+$/,n=/-([a-z])/g,r=/^[^-]+$/,i=/^-(webkit|moz|ms|o|khtml)-/,a=/^-(ms)-/,o=function(e){return!e||r.test(e)||t.test(e)},s=function(e,t){return t.toUpperCase()},c=function(e,t){return`${t}-`};e.camelCase=function(e,t){return t===void 0&&(t={}),o(e)?e:(e=e.toLowerCase(),e=t.reactCompat?e.replace(a,c):e.replace(i,c),e.replace(n,s))}})),Ye=o(((e,t)=>{var n=(e&&e.__importDefault||function(e){return e&&e.__esModule?e:{default:e}})(qe()),r=Je();function i(e,t){var i={};return!e||typeof e!=`string`||(0,n.default)(e,function(e,n){e&&n&&(i[(0,r.camelCase)(e,t)]=n)}),i}i.default=i,t.exports=i})),Xe=Qe(`end`),Ze=Qe(`start`);function Qe(e){return t;function t(t){let n=t&&t.position&&t.position[e]||{};if(typeof n.line==`number`&&n.line>0&&typeof n.column==`number`&&n.column>0)return{line:n.line,column:n.column,offset:typeof n.offset==`number`&&n.offset>-1?n.offset:void 0}}}function $e(e){let t=Ze(e),n=Xe(e);if(t&&n)return{start:t,end:n}}function et(e){return!e||typeof e!=`object`?``:`position`in e||`type`in e?nt(e.position):`start`in e||`end`in e?nt(e):`line`in e||`column`in e?tt(e):``}function tt(e){return rt(e&&e.line)+`:`+rt(e&&e.column)}function nt(e){return tt(e&&e.start)+`-`+tt(e&&e.end)}function rt(e){return e&&typeof e==`number`?e:1}var it=class extends Error{constructor(e,t,n){super(),typeof t==`string`&&(n=t,t=void 0);let r=``,i={},a=!1;if(t&&(i=`line`in t&&`column`in t||`start`in t&&`end`in t?{place:t}:`type`in t?{ancestors:[t],place:t.position}:{...t}),typeof e==`string`?r=e:!i.cause&&e&&(a=!0,r=e.message,i.cause=e),!i.ruleId&&!i.source&&typeof n==`string`){let e=n.indexOf(`:`);e===-1?i.ruleId=n:(i.source=n.slice(0,e),i.ruleId=n.slice(e+1))}if(!i.place&&i.ancestors&&i.ancestors){let e=i.ancestors[i.ancestors.length-1];e&&(i.place=e.position)}let o=i.place&&`start`in i.place?i.place.start:i.place;this.ancestors=i.ancestors||void 0,this.cause=i.cause||void 0,this.column=o?o.column:void 0,this.fatal=void 0,this.file=``,this.message=r,this.line=o?o.line:void 0,this.name=et(i.place)||`1:1`,this.place=i.place||void 0,this.reason=this.message,this.ruleId=i.ruleId||void 0,this.source=i.source||void 0,this.stack=a&&i.cause&&typeof i.cause.stack==`string`?i.cause.stack:``,this.actual=void 0,this.expected=void 0,this.note=void 0,this.url=void 0}};it.prototype.file=``,it.prototype.name=``,it.prototype.reason=``,it.prototype.message=``,it.prototype.stack=``,it.prototype.column=void 0,it.prototype.line=void 0,it.prototype.ancestors=void 0,it.prototype.cause=void 0,it.prototype.fatal=void 0,it.prototype.place=void 0,it.prototype.ruleId=void 0,it.prototype.source=void 0;var at=l(Ye(),1),ot={}.hasOwnProperty,st=new Map,ct=/[A-Z]/g,lt=new Set([`table`,`tbody`,`thead`,`tfoot`,`tr`]),ut=new Set([`td`,`th`]),dt=`https://github.com/syntax-tree/hast-util-to-jsx-runtime`;function ft(e,t){if(!t||t.Fragment===void 0)throw TypeError("Expected `Fragment` in options");let n=t.filePath||void 0,r;if(t.development){if(typeof t.jsxDEV!=`function`)throw TypeError("Expected `jsxDEV` in options when `development: true`");r=Ct(n,t.jsxDEV)}else{if(typeof t.jsx!=`function`)throw TypeError("Expected `jsx` in production options");if(typeof t.jsxs!=`function`)throw TypeError("Expected `jsxs` in production options");r=St(n,t.jsx,t.jsxs)}let i={Fragment:t.Fragment,ancestors:[],components:t.components||{},create:r,elementAttributeNameCase:t.elementAttributeNameCase||`react`,evaluater:t.createEvaluater?t.createEvaluater():void 0,filePath:n,ignoreInvalidStyle:t.ignoreInvalidStyle||!1,passKeys:t.passKeys!==!1,passNode:t.passNode||!1,schema:t.space===`svg`?We:Ue,stylePropertyNameCase:t.stylePropertyNameCase||`dom`,tableCellAlignToStyle:t.tableCellAlignToStyle!==!1},a=pt(i,e,void 0);return a&&typeof a!=`string`?a:i.create(e,i.Fragment,{children:a||void 0},void 0)}function pt(e,t,n){if(t.type===`element`)return mt(e,t,n);if(t.type===`mdxFlowExpression`||t.type===`mdxTextExpression`)return ht(e,t);if(t.type===`mdxJsxFlowElement`||t.type===`mdxJsxTextElement`)return _t(e,t,n);if(t.type===`mdxjsEsm`)return gt(e,t);if(t.type===`root`)return vt(e,t,n);if(t.type===`text`)return yt(e,t)}function mt(e,t,n){let r=e.schema,i=r;t.tagName.toLowerCase()===`svg`&&r.space===`html`&&(i=We,e.schema=i),e.ancestors.push(t);let a=kt(e,t.tagName,!1),o=wt(e,t),s=Et(e,t);return lt.has(t.tagName)&&(s=s.filter(function(e){return typeof e!=`string`||!ge(e)})),bt(e,o,a,t),xt(o,s),e.ancestors.pop(),e.schema=r,e.create(t,a,o,n)}function ht(e,t){if(t.data&&t.data.estree&&e.evaluater){let n=t.data.estree.body[0];return n.type,e.evaluater.evaluateExpression(n.expression)}At(e,t.position)}function gt(e,t){if(t.data&&t.data.estree&&e.evaluater)return e.evaluater.evaluateProgram(t.data.estree);At(e,t.position)}function _t(e,t,n){let r=e.schema,i=r;t.name===`svg`&&r.space===`html`&&(i=We,e.schema=i),e.ancestors.push(t);let a=t.name===null?e.Fragment:kt(e,t.name,!0),o=Tt(e,t),s=Et(e,t);return bt(e,o,a,t),xt(o,s),e.ancestors.pop(),e.schema=r,e.create(t,a,o,n)}function vt(e,t,n){let r={};return xt(r,Et(e,t)),e.create(t,e.Fragment,r,n)}function yt(e,t){return t.value}function bt(e,t,n,r){typeof n!=`string`&&n!==e.Fragment&&e.passNode&&(t.node=r)}function xt(e,t){if(t.length>0){let n=t.length>1?t:t[0];n&&(e.children=n)}}function St(e,t,n){return r;function r(e,r,i,a){let o=Array.isArray(i.children)?n:t;return a?o(r,i,a):o(r,i)}}function Ct(e,t){return n;function n(n,r,i,a){let o=Array.isArray(i.children),s=Ze(n);return t(r,i,a,o,{columnNumber:s?s.column-1:void 0,fileName:e,lineNumber:s?s.line:void 0},void 0)}}function wt(e,t){let n={},r,i;for(i in t.properties)if(i!==`children`&&ot.call(t.properties,i)){let a=Dt(e,i,t.properties[i]);if(a){let[i,o]=a;e.tableCellAlignToStyle&&i===`align`&&typeof o==`string`&&ut.has(t.tagName)?r=o:n[i]=o}}if(r){let t=n.style||={};t[e.stylePropertyNameCase===`css`?`text-align`:`textAlign`]=r}return n}function Tt(e,t){let n={};for(let r of t.attributes)if(r.type===`mdxJsxExpressionAttribute`){if(r.data&&r.data.estree&&e.evaluater){let t=r.data.estree.body[0];t.type;let i=t.expression;i.type;let a=i.properties[0];a.type,Object.assign(n,e.evaluater.evaluateExpression(a.argument))}else At(e,t.position)}else{let i=r.name,a;if(r.value&&typeof r.value==`object`){if(r.value.data&&r.value.data.estree&&e.evaluater){let t=r.value.data.estree.body[0];t.type,a=e.evaluater.evaluateExpression(t.expression)}else At(e,t.position)}else a=r.value===null||r.value;n[i]=a}return n}function Et(e,t){let n=[],r=-1,i=e.passKeys?new Map:st;for(;++r<t.children.length;){let a=t.children[r],o;if(e.passKeys){let e=a.type===`element`?a.tagName:a.type===`mdxJsxFlowElement`||a.type===`mdxJsxTextElement`?a.name:void 0;if(e){let t=i.get(e)||0;o=e+`-`+t,i.set(e,t+1)}}let s=pt(e,a,o);s!==void 0&&n.push(s)}return n}function Dt(e,t,n){let r=Be(e.schema,t);if(!(n==null||typeof n==`number`&&Number.isNaN(n))){if(Array.isArray(n)&&(n=r.commaSeparated?ue(n):Ge(n)),r.property===`style`){let t=typeof n==`object`?n:Ot(e,String(n));return e.stylePropertyNameCase===`css`&&(t=jt(t)),[`style`,t]}return[e.elementAttributeNameCase===`react`&&r.space?Ie[r.property]||r.property:r.attribute,n]}}function Ot(e,t){try{return(0,at.default)(t,{reactCompat:!0})}catch(t){if(e.ignoreInvalidStyle)return{};let n=t,r=new it("Cannot parse `style` attribute",{ancestors:e.ancestors,cause:n,ruleId:`style`,source:`hast-util-to-jsx-runtime`});throw r.file=e.filePath||void 0,r.url=dt+`#cannot-parse-style-attribute`,r}}function kt(e,t,n){let r;if(!n)r={type:`Literal`,value:t};else if(t.includes(`.`)){let e=t.split(`.`),n=-1,i;for(;++n<e.length;){let t=me(e[n])?{type:`Identifier`,name:e[n]}:{type:`Literal`,value:e[n]};i=i?{type:`MemberExpression`,object:i,property:t,computed:!!(n&&t.type===`Literal`),optional:!1}:t}r=i}else r=me(t)&&!/^[a-z]/.test(t)?{type:`Identifier`,name:t}:{type:`Literal`,value:t};if(r.type===`Literal`){let t=r.value;return ot.call(e.components,t)?e.components[t]:t}if(e.evaluater)return e.evaluater.evaluateExpression(r);At(e)}function At(e,t){let n=new it("Cannot handle MDX estrees without `createEvaluater`",{ancestors:e.ancestors,place:t,ruleId:`mdx-estree`,source:`hast-util-to-jsx-runtime`});throw n.file=e.filePath||void 0,n.url=dt+`#cannot-handle-mdx-estrees-without-createevaluater`,n}function jt(e){let t={},n;for(n in e)ot.call(e,n)&&(t[Mt(n)]=e[n]);return t}function Mt(e){let t=e.replace(ct,Nt);return t.slice(0,3)===`ms-`&&(t=`-`+t),t}function Nt(e){return`-`+e.toLowerCase()}var Pt={action:[`form`],cite:[`blockquote`,`del`,`ins`,`q`],data:[`object`],formAction:[`button`,`input`],href:[`a`,`area`,`base`,`link`],icon:[`menuitem`],itemId:null,manifest:[`html`],ping:[`a`,`area`],poster:[`video`],src:[`audio`,`embed`,`iframe`,`img`,`input`,`script`,`source`,`track`,`video`]},Ft={};function It(e,t){let n=t||Ft;return Lt(e,typeof n.includeImageAlt!=`boolean`||n.includeImageAlt,typeof n.includeHtml!=`boolean`||n.includeHtml)}function Lt(e,t,n){if(zt(e)){if(`value`in e)return e.type===`html`&&!n?``:e.value;if(t&&`alt`in e&&e.alt)return e.alt;if(`children`in e)return Rt(e.children,t,n)}return Array.isArray(e)?Rt(e,t,n):``}function Rt(e,t,n){let r=[],i=-1;for(;++i<e.length;)r[i]=Lt(e[i],t,n);return r.join(``)}function zt(e){return!!(e&&typeof e==`object`)}var Bt=document.createElement(`i`);function Vt(e){let t=`&`+e+`;`;Bt.innerHTML=t;let n=Bt.textContent;return n.charCodeAt(n.length-1)===59&&e!==`semi`?!1:n!==t&&n}function Ht(e,t,n,r){let i=e.length,a=0,o;if(t=t<0?-t>i?0:i+t:t>i?i:t,n=n>0?n:0,r.length<1e4)o=Array.from(r),o.unshift(t,n),e.splice(...o);else for(n&&e.splice(t,n);a<r.length;)o=r.slice(a,a+1e4),o.unshift(t,0),e.splice(...o),a+=1e4,t+=1e4}function Ut(e,t){return e.length>0?(Ht(e,e.length,0,t),e):t}var Wt={}.hasOwnProperty;function Gt(e){let t={},n=-1;for(;++n<e.length;)Kt(t,e[n]);return t}function Kt(e,t){let n;for(n in t){let r=(Wt.call(e,n)?e[n]:void 0)||(e[n]={}),i=t[n],a;if(i)for(a in i){Wt.call(r,a)||(r[a]=[]);let e=i[a];qt(r[a],Array.isArray(e)?e:e?[e]:[])}}}function qt(e,t){let n=-1,r=[];for(;++n<t.length;)(t[n].add===`after`?e:r).push(t[n]);Ht(e,0,0,r)}function Jt(e,t){let n=Number.parseInt(e,t);return n<9||n===11||n>13&&n<32||n>126&&n<160||n>55295&&n<57344||n>64975&&n<65008||(n&65535)==65535||(n&65535)==65534||n>1114111?`�`:String.fromCodePoint(n)}function Yt(e){return e.replace(/[\t\n\r ]+/g,` `).replace(/^ | $/g,``).toLowerCase().toUpperCase()}var Xt=on(/[A-Za-z]/),P=on(/[\dA-Za-z]/),Zt=on(/[#-'*+\--9=?A-Z^-~]/);function Qt(e){return e!==null&&(e<32||e===127)}var $t=on(/\d/),en=on(/[\dA-Fa-f]/),tn=on(/[!-/:-@[-`{-~]/);function F(e){return e!==null&&e<-2}function nn(e){return e!==null&&(e<0||e===32)}function I(e){return e===-2||e===-1||e===32}var rn=on(/\p{P}|\p{S}/u),an=on(/\s/);function on(e){return t;function t(t){return t!==null&&t>-1&&e.test(String.fromCharCode(t))}}function sn(e){let t=[],n=-1,r=0,i=0;for(;++n<e.length;){let a=e.charCodeAt(n),o=``;if(a===37&&P(e.charCodeAt(n+1))&&P(e.charCodeAt(n+2)))i=2;else if(a<128)/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(a))||(o=String.fromCharCode(a));else if(a>55295&&a<57344){let t=e.charCodeAt(n+1);a<56320&&t>56319&&t<57344?(o=String.fromCharCode(a,t),i=1):o=`�`}else o=String.fromCharCode(a);o&&=(t.push(e.slice(r,n),encodeURIComponent(o)),r=n+i+1,``),i&&=(n+=i,0)}return t.join(``)+e.slice(r)}function L(e,t,n,r){let i=r?r-1:1/0,a=0;return o;function o(r){return I(r)?(e.enter(n),s(r)):t(r)}function s(r){return I(r)&&a++<i?(e.consume(r),s):(e.exit(n),t(r))}}function cn(e,t,n,r,i,a){let o=0;return s;function s(t){return a>0&&I(t)?(e.enter(r),c(t)):l(t)}function c(t){return I(t)&&o<a?(e.consume(t),o++,c):(e.exit(r),l(t))}function l(e){return o>=i?t(e):n(e)}}var ln={tokenize:un};function un(e){let t=e.attempt(this.parser.constructs.contentInitial,r,i),n;return t;function r(n){if(n===null){e.consume(n);return}return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),L(e,t,`linePrefix`)}function i(t){return e.enter(`paragraph`),a(t)}function a(t){let r=e.enter(`chunkText`,{contentType:`text`,previous:n});return n&&(n.next=r),n=r,o(t)}function o(t){if(t===null){e.exit(`chunkText`),e.exit(`paragraph`),e.consume(t);return}return F(t)?(e.consume(t),e.exit(`chunkText`),a):(e.consume(t),o)}}var dn=class{constructor(){this.index=new Map,this.map=[]}add(e,t,n){fn(this,e,t,n,!1)}addBefore(e,t,n){fn(this,e,t,n,!0)}consume(e){if(this.map.sort(function(e,t){return e[0]-t[0]}),this.map.length===0)return;let t=this.map.length,n=[];for(;t>0;)--t,n.push(e.slice(this.map[t][0]+this.map[t][1]),this.map[t][2]),e.length=this.map[t][0];n.push(e.slice()),e.length=0;let r=n.pop();for(;r;){for(let t of r)e.push(t);r=n.pop()}this.map.length=0,this.index.clear()}};function fn(e,t,n,r,i){if(n===0&&r.length===0)return;let a=e.index.get(t);if(a){a[1]+=n,i?(r.push(...a[2]),a[2]=r):a[2].push(...r);return}let o=[t,n,r];e.map.push(o),e.index.set(t,o)}var pn={tokenize:hn},mn={tokenize:gn};function hn(e){let t=this,n=[],r=0,i,a,o;return s;function s(i){if(r<n.length){let a=n[r];return t.containerState=a[1],e.attempt(a[0].continuation,c,l)(i)}return l(i)}function c(e){if(r++,t.containerState._closeFlow){t.containerState._closeFlow=void 0,i&&v();let n=t.events.length,a=n,o;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){o=t.events[a][1].end;break}_(r);let s=n;for(;s<t.events.length;)t.events[s][1].end={...o},s++;let c=new dn;return c.add(a+1,0,t.events.slice(n)),c.add(n,s-n,[]),c.consume(t.events),l(e)}return s(e)}function l(a){if(r===n.length){if(!i)return f(a);if(i.currentConstruct&&i.currentConstruct.concrete)return m(a);t.interrupt=!(!i.currentConstruct||i._gfmTableDynamicInterruptHack)}return t.containerState={},e.check(mn,u,d)(a)}function u(e){return i&&v(),_(r),f(e)}function d(e){return t.parser.lazy[t.now().line]=r!==n.length,o=t.now().offset,m(e)}function f(n){return t.containerState={},e.attempt(mn,p,m)(n)}function p(e){return r++,n.push([t.currentConstruct,t.containerState]),f(e)}function m(n){if(n===null){i&&v(),_(0),e.consume(n);return}return i||=t.parser.flow(t.now()),e.enter(`chunkFlow`,{_tokenizer:i,contentType:`flow`,previous:a}),h(n)}function h(n){if(n===null){g(e.exit(`chunkFlow`),!0),_(0),e.consume(n);return}return F(n)?(e.consume(n),g(e.exit(`chunkFlow`)),r=0,t.interrupt=void 0,s):(e.consume(n),h)}function g(e,n){let s=t.sliceStream(e);if(n&&s.push(null),e.previous=a,a&&(a.next=e),a=e,i.defineSkip(e.start),i.write(s),t.parser.lazy[e.start.line]){let e=i.events.length;for(;e--;)if(i.events[e][1].start.offset<o&&(!i.events[e][1].end||i.events[e][1].end.offset>o))return;let n=t.events.length,a=n,s,c;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){if(s){c=t.events[a][1].end;break}s=!0}for(_(r),e=n;e<t.events.length;)t.events[e][1].end={...c},e++;let l=new dn;l.add(a+1,0,t.events.slice(n)),l.add(n,e-n,[]),l.consume(t.events)}}function _(r){let i=n.length;for(;i-->r;){let r=n[i];t.containerState=r[1],r[0].exit.call(t,e)}n.length=r}function v(){i.write([null]),a=void 0,i=void 0,t.containerState._closeFlow=void 0}}function gn(e,t,n){return L(e,e.attempt(this.parser.constructs.document,t,n),`linePrefix`,this.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)}function _n(e){if(e===null||nn(e)||an(e))return 1;if(rn(e))return 2}function vn(e,t,n){let r=[],i=-1;for(;++i<e.length;){let a=e[i].resolveAll;a&&!r.includes(a)&&(t=a(t,n),r.push(a))}return t}var yn={name:`attention`,resolveAll:bn,tokenize:xn};function bn(e,t){let n=-1,r;for(;++n<e.length;)if(e[n][0]===`enter`&&e[n][1].type===`attentionSequence`&&e[n][1]._close){let i=n;for(;i--;)if(e[i][0]===`exit`&&e[i][1].type===`attentionSequence`&&e[i][1]._open&&t.sliceSerialize(e[i][1]).charCodeAt(0)===t.sliceSerialize(e[n][1]).charCodeAt(0)){if((e[i][1]._close||e[n][1]._open)&&(e[n][1].end.offset-e[n][1].start.offset)%3&&!((e[i][1].end.offset-e[i][1].start.offset+e[n][1].end.offset-e[n][1].start.offset)%3))continue;let a=e[i][1].end.offset-e[i][1].start.offset>1&&e[n][1].end.offset-e[n][1].start.offset>1?2:1,o={...e[i][1].end},s={...e[n][1].start};Sn(o,-a),Sn(s,a);let c={type:a>1?`strongSequence`:`emphasisSequence`,start:o,end:{...e[i][1].end}},l={type:a>1?`strongSequence`:`emphasisSequence`,start:{...e[n][1].start},end:s},u={type:a>1?`strongText`:`emphasisText`,start:{...e[i][1].end},end:{...e[n][1].start}},d={type:a>1?`strong`:`emphasis`,start:{...c.start},end:{...l.end}};e[i][1].end={...c.start},e[n][1].start={...l.end},r=[],e[i][1].end.offset-e[i][1].start.offset&&(r=Ut(r,[[`enter`,e[i][1],t],[`exit`,e[i][1],t]])),r=Ut(r,[[`enter`,d,t],[`enter`,c,t],[`exit`,c,t],[`enter`,u,t]]),r=Ut(r,vn(t.parser.constructs.insideSpan.null,e.slice(i+1,n),t)),r=Ut(r,[[`exit`,u,t],[`enter`,l,t],[`exit`,l,t],[`exit`,d,t]]);let f=0;e[n][1].end.offset-e[n][1].start.offset&&(f=2,r=Ut(r,[[`enter`,e[n][1],t],[`exit`,e[n][1],t]])),Ht(e,i-1,n-i+3,r),n=i+r.length-f-2;break}}for(n=-1;++n<e.length;)e[n][1].type===`attentionSequence`&&(e[n][1].type=`data`);return e}function xn(e,t){let n=this.parser.constructs.attentionMarkers.null,r=this.previous,i=_n(r),a;return o;function o(t){return a=t,e.enter(`attentionSequence`),s(t)}function s(o){if(o===a)return e.consume(o),s;let c=e.exit(`attentionSequence`),l=_n(o),u=!l||l===2&&i||n.includes(o)&&o!==42&&o!==95,d=!i||i===2&&l||n.includes(r)&&r!==42&&r!==95;return c._open=!!(a===42?u:u&&(i||!d)),c._close=!!(a===42?d:d&&(l||!u)),t(o)}}function Sn(e,t){e.column+=t,e.offset+=t,e._bufferIndex+=t}var Cn={name:`autolink`,tokenize:wn};function wn(e,t,n){let r=0;return i;function i(t){return e.enter(`autolink`),e.enter(`autolinkMarker`),e.consume(t),e.exit(`autolinkMarker`),e.enter(`autolinkProtocol`),a}function a(t){return Xt(t)?(e.consume(t),o):t===64?n(t):l(t)}function o(e){return e===43||e===45||e===46||P(e)?(r=1,s(e)):l(e)}function s(t){return t===58?(e.consume(t),r=0,c):(t===43||t===45||t===46||P(t))&&r++<32?(e.consume(t),s):(r=0,l(t))}function c(r){return r===62?(e.exit(`autolinkProtocol`),e.enter(`autolinkMarker`),e.consume(r),e.exit(`autolinkMarker`),e.exit(`autolink`),t):r===null||r===32||r===60||Qt(r)?n(r):(e.consume(r),c)}function l(t){return t===64?(e.consume(t),u):Zt(t)?(e.consume(t),l):n(t)}function u(e){return P(e)?d(e):n(e)}function d(n){return n===46?(e.consume(n),r=0,u):n===62?(e.exit(`autolinkProtocol`).type=`autolinkEmail`,e.enter(`autolinkMarker`),e.consume(n),e.exit(`autolinkMarker`),e.exit(`autolink`),t):f(n)}function f(t){if((t===45||P(t))&&r++<63){let n=t===45?f:d;return e.consume(t),n}return n(t)}}var Tn={partial:!0,tokenize:En};function En(e,t,n){return r;function r(t){return I(t)?L(e,i,`linePrefix`)(t):i(t)}function i(e){return e===null||F(e)?t(e):n(e)}}var Dn={continuation:{tokenize:kn},exit:An,name:`blockQuote`,tokenize:On};function On(e,t,n){let r=this;return i;function i(t){if(t===62){let n=r.containerState;return n.open||=(e.enter(`blockQuote`,{_container:!0}),!0),e.enter(`blockQuotePrefix`),e.enter(`blockQuoteMarker`),e.consume(t),e.exit(`blockQuoteMarker`),a}return n(t)}function a(n){return I(n)?(e.enter(`blockQuotePrefixWhitespace`),e.consume(n),e.exit(`blockQuotePrefixWhitespace`),e.exit(`blockQuotePrefix`),t):(e.exit(`blockQuotePrefix`),t(n))}}function kn(e,t,n){let r=this;return i;function i(t){return I(t)?L(e,a,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):a(t)}function a(r){return e.attempt(Dn,t,n)(r)}}function An(e){e.exit(`blockQuote`)}var jn={name:`characterEscape`,tokenize:Mn};function Mn(e,t,n){return r;function r(t){return e.enter(`characterEscape`),e.enter(`escapeMarker`),e.consume(t),e.exit(`escapeMarker`),i}function i(r){return tn(r)?(e.enter(`characterEscapeValue`),e.consume(r),e.exit(`characterEscapeValue`),e.exit(`characterEscape`),t):n(r)}}var Nn={name:`characterReference`,tokenize:Pn};function Pn(e,t,n){let r=this,i=0,a,o;return s;function s(t){return e.enter(`characterReference`),e.enter(`characterReferenceMarker`),e.consume(t),e.exit(`characterReferenceMarker`),c}function c(t){return t===35?(e.enter(`characterReferenceMarkerNumeric`),e.consume(t),e.exit(`characterReferenceMarkerNumeric`),l):(e.enter(`characterReferenceValue`),a=31,o=P,u(t))}function l(t){return t===88||t===120?(e.enter(`characterReferenceMarkerHexadecimal`),e.consume(t),e.exit(`characterReferenceMarkerHexadecimal`),e.enter(`characterReferenceValue`),a=6,o=en,u):(e.enter(`characterReferenceValue`),a=7,o=$t,u(t))}function u(s){if(s===59&&i){let i=e.exit(`characterReferenceValue`);return o===P&&!Vt(r.sliceSerialize(i))?n(s):(e.enter(`characterReferenceMarker`),e.consume(s),e.exit(`characterReferenceMarker`),e.exit(`characterReference`),t)}return o(s)&&i++<a?(e.consume(s),u):n(s)}}var Fn={partial:!0,tokenize:In};function In(e,t,n){let r=this;return i;function i(t){return t===null?n(t):(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),a)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}var Ln={concrete:!0,name:`codeFenced`,tokenize:Rn};function Rn(e,t,n){let r=this,i={partial:!0,tokenize:ee},a=0,o=0,s;return c;function c(e){return l(e)}function l(t){let n=r.events[r.events.length-1];return a=n&&n[1].type===`linePrefix`?n[2].sliceSerialize(n[1],!0).length:0,s=t,e.enter(`codeFenced`),e.enter(`codeFencedFence`),e.enter(`codeFencedFenceSequence`),u(t)}function u(t){return t===s?(o++,e.consume(t),u):o<3?n(t):(e.exit(`codeFencedFenceSequence`),I(t)?L(e,d,`whitespace`)(t):d(t))}function d(n){return n===null||F(n)?(e.exit(`codeFencedFence`),r.interrupt?t(n):e.check(Fn,h,b)(n)):(e.enter(`codeFencedFenceInfo`),e.enter(`chunkString`,{contentType:`string`}),f(n))}function f(t){return t===null||F(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),d(t)):I(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),L(e,p,`whitespace`)(t)):t===96&&t===s?n(t):(e.consume(t),f)}function p(t){return t===null||F(t)?d(t):(e.enter(`codeFencedFenceMeta`),e.enter(`chunkString`,{contentType:`string`}),m(t))}function m(t){return t===null||F(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceMeta`),d(t)):t===96&&t===s?n(t):(e.consume(t),m)}function h(t){return e.attempt(i,b,g)(t)}function g(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),_}function _(t){return a>0&&I(t)?L(e,v,`linePrefix`,a+1)(t):v(t)}function v(t){return t===null||F(t)?e.check(Fn,h,b)(t):(e.enter(`codeFlowValue`),y(t))}function y(t){return t===null||F(t)?(e.exit(`codeFlowValue`),v(t)):(e.consume(t),y)}function b(n){return e.exit(`codeFenced`),t(n)}function ee(e,t,n){let i=0;return a;function a(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c}function c(t){return e.enter(`codeFencedFence`),I(t)?L(e,l,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):l(t)}function l(t){return t===s?(e.enter(`codeFencedFenceSequence`),u(t)):n(t)}function u(t){return t===s?(i++,e.consume(t),u):i>=o?(e.exit(`codeFencedFenceSequence`),I(t)?L(e,d,`whitespace`)(t):d(t)):n(t)}function d(r){return r===null||F(r)?(e.exit(`codeFencedFence`),t(r)):n(r)}}}var zn={name:`codeIndented`,tokenize:Vn},Bn={partial:!0,tokenize:Hn};function Vn(e,t,n){return r;function r(t){return e.enter(`codeIndented`),cn(e,i,n,`linePrefix`,4,4)(t)}function i(t){return t===null?o(t):F(t)?e.attempt(Bn,i,o)(t):(e.enter(`codeFlowValue`),a(t))}function a(t){return t===null||F(t)?(e.exit(`codeFlowValue`),i(t)):(e.consume(t),a)}function o(n){return e.exit(`codeIndented`),t(n)}}function Hn(e,t,n){let r=this;return i;function i(o){return r.parser.lazy[r.now().line]?n(o):F(o)?(e.enter(`lineEnding`),e.consume(o),e.exit(`lineEnding`),i):cn(e,t,a,`linePrefix`,4,4)(o)}function a(e){return F(e)?i(e):n(e)}}var Un={name:`codeText`,previous:Gn,resolve:Wn,tokenize:Kn};function Wn(e){let t=e.length-4,n=3,r,i;if((e[n][1].type===`lineEnding`||e[n][1].type===`space`)&&(e[t][1].type===`lineEnding`||e[t][1].type===`space`)){for(r=n;++r<t;)if(e[r][1].type===`codeTextData`){e[n][1].type=`codeTextPadding`,e[t][1].type=`codeTextPadding`,n+=2,t-=2;break}}for(r=n-1,t++;++r<=t;)i===void 0?r!==t&&e[r][1].type!==`lineEnding`&&(i=r):(r===t||e[r][1].type===`lineEnding`)&&(e[i][1].type=`codeTextData`,r!==i+2&&(e[i][1].end=e[r-1][1].end,e.splice(i+2,r-i-2),t-=r-i-2,r=i+2),i=void 0);return e}function Gn(e){return e!==96||this.events[this.events.length-1][1].type===`characterEscape`}function Kn(e,t,n){let r=0,i,a;return o;function o(t){return e.enter(`codeText`),e.enter(`codeTextSequence`),s(t)}function s(t){return t===96?(e.consume(t),r++,s):(e.exit(`codeTextSequence`),c(t))}function c(t){return t===null?n(t):t===32?(e.enter(`space`),e.consume(t),e.exit(`space`),c):t===96?(a=e.enter(`codeTextSequence`),i=0,u(t)):F(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c):(e.enter(`codeTextData`),l(t))}function l(t){return t===null||t===32||t===96||F(t)?(e.exit(`codeTextData`),c(t)):(e.consume(t),l)}function u(n){return n===96?(e.consume(n),i++,u):i===r?(e.exit(`codeTextSequence`),e.exit(`codeText`),t(n)):(a.type=`codeTextData`,l(n))}}var qn=class{constructor(e){this.left=e?[...e]:[],this.right=[]}get(e){if(e<0||e>=this.left.length+this.right.length)throw RangeError("Cannot access index `"+e+"` in a splice buffer of size `"+(this.left.length+this.right.length)+"`");return e<this.left.length?this.left[e]:this.right[this.right.length-e+this.left.length-1]}get length(){return this.left.length+this.right.length}shift(){return this.setCursor(0),this.right.pop()}slice(e,t){let n=t??1/0;return n<this.left.length?this.left.slice(e,n):e>this.left.length?this.right.slice(this.right.length-n+this.left.length,this.right.length-e+this.left.length).reverse():this.left.slice(e).concat(this.right.slice(this.right.length-n+this.left.length).reverse())}splice(e,t,n){let r=t||0;this.setCursor(Math.trunc(e));let i=this.right.splice(this.right.length-r,1/0);return n&&Jn(this.left,n),i.reverse()}pop(){return this.setCursor(1/0),this.left.pop()}push(e){this.setCursor(1/0),this.left.push(e)}pushMany(e){this.setCursor(1/0),Jn(this.left,e)}unshift(e){this.setCursor(0),this.right.push(e)}unshiftMany(e){this.setCursor(0),Jn(this.right,e.reverse())}setCursor(e){if(!(e===this.left.length||e>this.left.length&&this.right.length===0||e<0&&this.left.length===0)){if(e<this.left.length){let t=this.left.splice(e,1/0);Jn(this.right,t.reverse())}else{let t=this.right.splice(this.left.length+this.right.length-e,1/0);Jn(this.left,t.reverse())}}}};function Jn(e,t){let n=0;if(t.length<1e4)e.push(...t);else for(;n<t.length;)e.push(...t.slice(n,n+1e4)),n+=1e4}function Yn(e){let t={},n=-1,r,i,a,o,s,c,l,u=new qn(e);for(;++n<u.length;){for(;n in t;)n=t[n];if(r=u.get(n),n&&r[1].type===`chunkFlow`&&u.get(n-1)[1].type===`listItemPrefix`&&(c=r[1]._tokenizer.events,a=0,a<c.length&&c[a][1].type===`lineEndingBlank`&&(a+=2),a<c.length&&c[a][1].type===`content`))for(;++a<c.length&&c[a][1].type!==`content`;)c[a][1].type===`chunkText`&&(c[a][1]._isInFirstContentOfListItem=!0,a++);if(r[0]===`enter`)r[1].contentType&&(Object.assign(t,Xn(u,n)),n=t[n],l=!0);else if(r[1]._container){for(a=n,i=void 0;a--;)if(o=u.get(a),o[1].type===`lineEnding`||o[1].type===`lineEndingBlank`)o[0]===`enter`&&(i&&(u.get(i)[1].type=`lineEndingBlank`),o[1].type=`lineEnding`,i=a);else if(o[1].type!==`linePrefix`&&o[1].type!==`listItemIndent`)break;i&&(r[1].end={...u.get(i)[1].start},s=u.slice(i,n),s.unshift(r),u.splice(i,n-i+1,s))}}return Ht(e,0,1/0,u.slice(0)),!l}function Xn(e,t){let n=e.get(t)[1],r=e.get(t)[2],i=t-1,a=[],o=n._tokenizer;o||(o=r.parser[n.contentType](n.start),n._contentTypeTextTrailing&&(o._contentTypeTextTrailing=!0));let s=o.events,c=[],l={},u,d,f=-1,p=n,m=0,h=0,g=[h];for(;p;){for(;e.get(++i)[1]!==p;);a.push(i),p._tokenizer||(u=r.sliceStream(p),p.next||u.push(null),d&&o.defineSkip(p.start),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=!0),o.write(u),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=void 0)),d=p,p=p.next}for(p=n;++f<s.length;)s[f][0]===`exit`&&s[f-1][0]===`enter`&&s[f][1].type===s[f-1][1].type&&s[f][1].start.line!==s[f][1].end.line&&(h=f+1,g.push(h),p._tokenizer=void 0,p.previous=void 0,p=p.next);for(o.events=[],p?(p._tokenizer=void 0,p.previous=void 0):g.pop(),f=g.length;f--;){let t=s.slice(g[f],g[f+1]),n=a.pop();c.push([n,n+t.length-1]),e.splice(n,2,t)}for(c.reverse(),f=-1;++f<c.length;)l[m+c[f][0]]=m+c[f][1],m+=c[f][1]-c[f][0]-1;return l}var Zn={resolve:$n,tokenize:er},Qn={partial:!0,tokenize:tr};function $n(e){return Yn(e),e}function er(e,t){let n;return r;function r(t){return e.enter(`content`),n=e.enter(`chunkContent`,{contentType:`content`}),i(t)}function i(t){return t===null?a(t):F(t)?e.check(Qn,o,a)(t):(e.consume(t),i)}function a(n){return e.exit(`chunkContent`),e.exit(`content`),t(n)}function o(t){return e.consume(t),e.exit(`chunkContent`),n.next=e.enter(`chunkContent`,{contentType:`content`,previous:n}),n=n.next,i}}function tr(e,t,n){let r=this;return i;function i(t){return e.exit(`chunkContent`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),L(e,a,`linePrefix`)}function a(i){if(i===null||F(i))return n(i);let a=r.events[r.events.length-1];return!r.parser.constructs.disable.null.includes(`codeIndented`)&&a&&a[1].type===`linePrefix`&&a[2].sliceSerialize(a[1],!0).length>=4?t(i):e.interrupt(r.parser.constructs.flow,n,t)(i)}}function nr(e,t,n,r,i,a,o,s,c){let l=c||1/0,u=0;return d;function d(t){return t===60?(e.enter(r),e.enter(i),e.enter(a),e.consume(t),e.exit(a),f):t===null||t===32||t===41||Qt(t)?n(t):(e.enter(r),e.enter(o),e.enter(s),e.enter(`chunkString`,{contentType:`string`}),h(t))}function f(n){return n===62?(e.enter(a),e.consume(n),e.exit(a),e.exit(i),e.exit(r),t):(e.enter(s),e.enter(`chunkString`,{contentType:`string`}),p(n))}function p(t){return t===62?(e.exit(`chunkString`),e.exit(s),f(t)):t===null||t===60||F(t)?n(t):(e.consume(t),t===92?m:p)}function m(t){return t===60||t===62||t===92?(e.consume(t),p):p(t)}function h(i){return!u&&(i===null||i===41||nn(i))?(e.exit(`chunkString`),e.exit(s),e.exit(o),e.exit(r),t(i)):u<l&&i===40?(e.consume(i),u++,h):i===41?(e.consume(i),u--,h):i===null||i===32||i===40||Qt(i)?n(i):(e.consume(i),i===92?g:h)}function g(t){return t===40||t===41||t===92?(e.consume(t),h):h(t)}}function rr(e,t,n,r,i,a){let o=this,s=0,c;return l;function l(t){return e.enter(r),e.enter(i),e.consume(t),e.exit(i),e.enter(a),u}function u(l){return s>999||l===null||l===91||l===93&&!c||l===94&&!s&&`_hiddenFootnoteSupport`in o.parser.constructs?n(l):l===93?(e.exit(a),e.enter(i),e.consume(l),e.exit(i),e.exit(r),t):F(l)?(e.enter(`lineEnding`),e.consume(l),e.exit(`lineEnding`),u):(e.enter(`chunkString`,{contentType:`string`}),d(l))}function d(t){return t===null||t===91||t===93||F(t)||s++>999?(e.exit(`chunkString`),u(t)):(e.consume(t),c||=!I(t),t===92?f:d)}function f(t){return t===91||t===92||t===93?(e.consume(t),s++,d):d(t)}}function ir(e,t,n,r,i,a){let o;return s;function s(t){return t===34||t===39||t===40?(e.enter(r),e.enter(i),e.consume(t),e.exit(i),o=t===40?41:t,c):n(t)}function c(n){return n===o?(e.enter(i),e.consume(n),e.exit(i),e.exit(r),t):(e.enter(a),l(n))}function l(t){return t===o?(e.exit(a),c(o)):t===null?n(t):F(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),L(e,l,`linePrefix`)):(e.enter(`chunkString`,{contentType:`string`}),u(t))}function u(t){return t===o||t===null||F(t)?(e.exit(`chunkString`),l(t)):(e.consume(t),t===92?d:u)}function d(t){return t===o||t===92?(e.consume(t),u):u(t)}}function ar(e,t){let n;return r;function r(i){return F(i)?(e.enter(`lineEnding`),e.consume(i),e.exit(`lineEnding`),n=!0,r):I(i)?L(e,r,n?`linePrefix`:`lineSuffix`)(i):t(i)}}var or={name:`definition`,tokenize:cr},sr={partial:!0,tokenize:lr};function cr(e,t,n){let r=this,i;return a;function a(t){return e.enter(`definition`),o(t)}function o(t){return rr.call(r,e,s,n,`definitionLabel`,`definitionLabelMarker`,`definitionLabelString`)(t)}function s(t){return i=Yt(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)),t===58?(e.enter(`definitionMarker`),e.consume(t),e.exit(`definitionMarker`),c):n(t)}function c(t){return nn(t)?ar(e,l)(t):l(t)}function l(t){return nr(e,u,n,`definitionDestination`,`definitionDestinationLiteral`,`definitionDestinationLiteralMarker`,`definitionDestinationRaw`,`definitionDestinationString`)(t)}function u(t){return e.attempt(sr,d,d)(t)}function d(t){return I(t)?L(e,f,`whitespace`)(t):f(t)}function f(a){return a===null||F(a)?(e.exit(`definition`),r.parser.defined.push(i),t(a)):n(a)}}function lr(e,t,n){return r;function r(t){return nn(t)?ar(e,i)(t):n(t)}function i(t){return ir(e,a,n,`definitionTitle`,`definitionTitleMarker`,`definitionTitleString`)(t)}function a(t){return I(t)?L(e,o,`whitespace`)(t):o(t)}function o(e){return e===null||F(e)?t(e):n(e)}}var ur={name:`hardBreakEscape`,tokenize:dr};function dr(e,t,n){return r;function r(t){return e.enter(`hardBreakEscape`),e.consume(t),i}function i(r){return F(r)?(e.exit(`hardBreakEscape`),t(r)):n(r)}}var fr={name:`headingAtx`,resolve:pr,tokenize:mr};function pr(e,t){let n=e.length-2,r=3;if(e[r][1].type===`whitespace`&&(r+=2),n-2>r&&e[n][1].type===`whitespace`&&(n-=2),e[n][1].type===`atxHeadingSequence`&&(r===n-1||n-4>r&&e[n-2][1].type===`whitespace`)&&(n-=r+1===n?2:4),n>r){let i={type:`atxHeadingText`,start:e[r][1].start,end:e[n][1].end},a={type:`chunkText`,start:e[r][1].start,end:e[n][1].end,contentType:`text`};Ht(e,r,n-r+1,[[`enter`,i,t],[`enter`,a,t],[`exit`,a,t],[`exit`,i,t]])}return e}function mr(e,t,n){let r=0;return i;function i(t){return e.enter(`atxHeading`),a(t)}function a(t){return e.enter(`atxHeadingSequence`),o(t)}function o(t){return t===35&&r++<6?(e.consume(t),o):t===null||nn(t)?(e.exit(`atxHeadingSequence`),s(t)):n(t)}function s(n){return n===35?(e.enter(`atxHeadingSequence`),c(n)):n===null||F(n)?(e.exit(`atxHeading`),t(n)):I(n)?L(e,s,`whitespace`)(n):(e.enter(`atxHeadingText`),l(n))}function c(t){return t===35?(e.consume(t),c):(e.exit(`atxHeadingSequence`),s(t))}function l(t){return t===null||t===35||nn(t)?(e.exit(`atxHeadingText`),s(t)):(e.consume(t),l)}}var hr=`address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul`.split(`.`),gr=[`pre`,`script`,`style`,`textarea`],_r={concrete:!0,name:`htmlFlow`,resolveTo:yr,tokenize:br},vr={partial:!0,tokenize:xr};function yr(e){let t=e.length;for(;t--&&(e[t][0]!==`enter`||e[t][1].type!==`htmlFlow`););return t>1&&e[t-2][1].type===`linePrefix`&&(e[t][1].start=e[t-2][1].start,e[t+1][1].start=e[t-2][1].start,e.splice(t-2,2)),e}function br(e,t,n){let r=this,i,a,o,s,c;return l;function l(e){return u(e)}function u(t){return e.enter(`htmlFlow`),e.enter(`htmlFlowData`),e.consume(t),d}function d(s){return s===33?(e.consume(s),f):s===47?(e.consume(s),a=!0,h):s===63?(e.consume(s),i=3,r.interrupt?t:ue):Xt(s)?(e.consume(s),o=String.fromCharCode(s),g):n(s)}function f(a){return a===45?(e.consume(a),i=2,p):a===91?(e.consume(a),i=5,s=0,m):Xt(a)?(e.consume(a),i=4,r.interrupt?t:ue):n(a)}function p(i){return i===45?(e.consume(i),r.interrupt?t:ue):n(i)}function m(i){return i===`CDATA[`.charCodeAt(s++)?(e.consume(i),s===6?r.interrupt?t:w:m):n(i)}function h(t){return Xt(t)?(e.consume(t),o=String.fromCharCode(t),g):n(t)}function g(s){if(s===null||s===47||s===62||nn(s)){let c=s===47,l=o.toLowerCase();return!c&&!a&&gr.includes(l)?(i=1,r.interrupt?t(s):w(s)):hr.includes(o.toLowerCase())?(i=6,c?(e.consume(s),_):r.interrupt?t(s):w(s)):(i=7,r.interrupt&&!r.parser.lazy[r.now().line]?n(s):a?v(s):y(s))}return s===45||P(s)?(e.consume(s),o+=String.fromCharCode(s),g):n(s)}function _(i){return i===62?(e.consume(i),r.interrupt?t:w):n(i)}function v(t){return I(t)?(e.consume(t),v):S(t)}function y(t){return t===47?(e.consume(t),S):t===58||t===95||Xt(t)?(e.consume(t),b):I(t)?(e.consume(t),y):S(t)}function b(t){return t===45||t===46||t===58||t===95||P(t)?(e.consume(t),b):ee(t)}function ee(t){return t===61?(e.consume(t),te):I(t)?(e.consume(t),ee):y(t)}function te(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),c=t,ne):I(t)?(e.consume(t),te):re(t)}function ne(t){return t===c?(e.consume(t),c=null,x):t===null||F(t)?n(t):(e.consume(t),ne)}function re(t){return t===null||t===34||t===39||t===47||t===60||t===61||t===62||t===96||nn(t)?ee(t):(e.consume(t),re)}function x(e){return e===47||e===62||I(e)?y(e):n(e)}function S(t){return t===62?(e.consume(t),C):n(t)}function C(t){return t===null||F(t)?w(t):I(t)?(e.consume(t),C):n(t)}function w(t){return t===45&&i===2?(e.consume(t),se):t===60&&i===1?(e.consume(t),T):t===62&&i===4?(e.consume(t),de):t===63&&i===3?(e.consume(t),ue):t===93&&i===5?(e.consume(t),le):F(t)&&(i===6||i===7)?(e.exit(`htmlFlowData`),e.check(vr,fe,ie)(t)):t===null||F(t)?(e.exit(`htmlFlowData`),ie(t)):(e.consume(t),w)}function ie(t){return e.check(Fn,ae,fe)(t)}function ae(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),oe}function oe(t){return t===null||F(t)?ie(t):(e.enter(`htmlFlowData`),w(t))}function se(t){return t===45?(e.consume(t),ue):w(t)}function T(t){return t===47?(e.consume(t),o=``,ce):w(t)}function ce(t){if(t===62){let n=o.toLowerCase();return gr.includes(n)?(e.consume(t),de):w(t)}return Xt(t)&&o.length<8?(e.consume(t),o+=String.fromCharCode(t),ce):w(t)}function le(t){return t===93?(e.consume(t),ue):w(t)}function ue(t){return t===62?(e.consume(t),de):t===45&&i===2?(e.consume(t),ue):w(t)}function de(t){return t===null||F(t)?(e.exit(`htmlFlowData`),fe(t)):(e.consume(t),de)}function fe(n){return e.exit(`htmlFlow`),t(n)}}function xr(e,t,n){return r;function r(r){return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),e.attempt(Tn,t,n)}}var Sr={name:`htmlText`,tokenize:Cr};function Cr(e,t,n){let r=this,i,a,o;return s;function s(t){return e.enter(`htmlText`),e.enter(`htmlTextData`),e.consume(t),c}function c(t){return t===33?(e.consume(t),l):t===47?(e.consume(t),ee):t===63?(e.consume(t),y):Xt(t)?(e.consume(t),re):n(t)}function l(t){return t===45?(e.consume(t),u):t===91?(e.consume(t),a=0,m):Xt(t)?(e.consume(t),v):n(t)}function u(t){return t===45?(e.consume(t),p):n(t)}function d(t){return t===null?n(t):t===45?(e.consume(t),f):F(t)?(o=d,T(t)):(e.consume(t),d)}function f(t){return t===45?(e.consume(t),p):d(t)}function p(e){return e===62?se(e):e===45?f(e):d(e)}function m(t){return t===`CDATA[`.charCodeAt(a++)?(e.consume(t),a===6?h:m):n(t)}function h(t){return t===null?n(t):t===93?(e.consume(t),g):F(t)?(o=h,T(t)):(e.consume(t),h)}function g(t){return t===93?(e.consume(t),_):h(t)}function _(t){return t===62?se(t):t===93?(e.consume(t),_):h(t)}function v(t){return t===null||t===62?se(t):F(t)?(o=v,T(t)):(e.consume(t),v)}function y(t){return t===null?n(t):t===63?(e.consume(t),b):F(t)?(o=y,T(t)):(e.consume(t),y)}function b(e){return e===62?se(e):y(e)}function ee(t){return Xt(t)?(e.consume(t),te):n(t)}function te(t){return t===45||P(t)?(e.consume(t),te):ne(t)}function ne(t){return F(t)?(o=ne,T(t)):I(t)?(e.consume(t),ne):se(t)}function re(t){return t===45||P(t)?(e.consume(t),re):t===47||t===62||nn(t)?x(t):n(t)}function x(t){return t===47?(e.consume(t),se):t===58||t===95||Xt(t)?(e.consume(t),S):F(t)?(o=x,T(t)):I(t)?(e.consume(t),x):se(t)}function S(t){return t===45||t===46||t===58||t===95||P(t)?(e.consume(t),S):C(t)}function C(t){return t===61?(e.consume(t),w):F(t)?(o=C,T(t)):I(t)?(e.consume(t),C):x(t)}function w(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),i=t,ie):F(t)?(o=w,T(t)):I(t)?(e.consume(t),w):(e.consume(t),ae)}function ie(t){return t===i?(e.consume(t),i=void 0,oe):t===null?n(t):F(t)?(o=ie,T(t)):(e.consume(t),ie)}function ae(t){return t===null||t===34||t===39||t===60||t===61||t===96?n(t):t===47||t===62||nn(t)?x(t):(e.consume(t),ae)}function oe(e){return e===47||e===62||nn(e)?x(e):n(e)}function se(r){return r===62?(e.consume(r),e.exit(`htmlTextData`),e.exit(`htmlText`),t):n(r)}function T(t){return e.exit(`htmlTextData`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),ce}function ce(t){return I(t)?L(e,le,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):le(t)}function le(t){return e.enter(`htmlTextData`),o(t)}}var wr={name:`labelEnd`,resolveAll:Or,resolveTo:kr,tokenize:Ar},Tr={tokenize:jr},Er={tokenize:Mr},Dr={tokenize:Nr};function Or(e){let t=-1,n=[];for(;++t<e.length;){let r=e[t][1];if(n.push(e[t]),r.type===`labelImage`||r.type===`labelLink`||r.type===`labelEnd`){let e=r.type===`labelImage`?4:2;r.type=`data`,t+=e}}return e.length!==n.length&&Ht(e,0,e.length,n),e}function kr(e,t){let n=e.length,r=0,i,a,o;for(;n--;){let t=e[n][1];if(i){if(t.type===`link`||t.type===`labelLink`&&t._inactive)break;e[n][0]===`enter`&&t.type===`labelLink`&&(t._inactive=!0)}else if(a){if(e[n][0]===`enter`&&(t.type===`labelImage`||t.type===`labelLink`)&&!t._balanced&&(i=n,t.type!==`labelLink`)){r=2;break}}else t.type===`labelEnd`&&(a=n)}let s={type:e[i][1].type===`labelLink`?`link`:`image`,start:{...e[i][1].start},end:{...e[e.length-1][1].end}},c={type:`label`,start:{...e[i][1].start},end:{...e[a][1].end}},l={type:`labelText`,start:{...e[i+r+2][1].end},end:{...e[a-2][1].start}};return o=[[`enter`,s,t],[`enter`,c,t]],o=Ut(o,e.slice(i+1,i+r+3)),o=Ut(o,[[`enter`,l,t]]),o=Ut(o,vn(t.parser.constructs.insideSpan.null,e.slice(i+r+4,a-3),t)),o=Ut(o,[[`exit`,l,t],e[a-2],e[a-1],[`exit`,c,t]]),o=Ut(o,e.slice(a+1)),o=Ut(o,[[`exit`,s,t]]),Ht(e,i,e.length,o),e}function Ar(e,t,n){let r=this,i=r._labelStarts,a,o;if(i){for(;i.length>0&&i[i.length-1]._balanced;)i.pop();a=i[i.length-1]}return s;function s(t){return a?a._inactive?d(t):(o=r.parser.defined.includes(Yt(r.sliceSerialize({start:a.end,end:r.now()}))),e.enter(`labelEnd`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelEnd`),c):n(t)}function c(t){return t===40?e.attempt(Tr,u,o?u:d)(t):t===91?e.attempt(Er,u,o?l:d)(t):o?u(t):d(t)}function l(t){return e.attempt(Dr,u,d)(t)}function u(e){return i.pop(),t(e)}function d(e){return a._balanced=!0,n(e)}}function jr(e,t,n){return r;function r(t){return e.enter(`resource`),e.enter(`resourceMarker`),e.consume(t),e.exit(`resourceMarker`),i}function i(t){return nn(t)?ar(e,a)(t):a(t)}function a(t){return t===41?u(t):nr(e,o,s,`resourceDestination`,`resourceDestinationLiteral`,`resourceDestinationLiteralMarker`,`resourceDestinationRaw`,`resourceDestinationString`,32)(t)}function o(t){return nn(t)?ar(e,c)(t):u(t)}function s(e){return n(e)}function c(t){return t===34||t===39||t===40?ir(e,l,n,`resourceTitle`,`resourceTitleMarker`,`resourceTitleString`)(t):u(t)}function l(t){return nn(t)?ar(e,u)(t):u(t)}function u(r){return r===41?(e.enter(`resourceMarker`),e.consume(r),e.exit(`resourceMarker`),e.exit(`resource`),t):n(r)}}function Mr(e,t,n){let r=this;return i;function i(t){return rr.call(r,e,a,o,`reference`,`referenceMarker`,`referenceString`)(t)}function a(e){return r.parser.defined.includes(Yt(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)))?t(e):n(e)}function o(e){return n(e)}}function Nr(e,t,n){return r;function r(t){return e.enter(`reference`),e.enter(`referenceMarker`),e.consume(t),e.exit(`referenceMarker`),i}function i(r){return r===93?(e.enter(`referenceMarker`),e.consume(r),e.exit(`referenceMarker`),e.exit(`reference`),t):n(r)}}var Pr={name:`labelStartImage`,resolveAll:wr.resolveAll,tokenize:Fr};function Fr(e,t,n){let r=this,i;return a;function a(t){return e.enter(`labelImage`),e.enter(`labelImageMarker`),e.consume(t),e.exit(`labelImageMarker`),o}function o(t){return t===91?(e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),i=e.exit(`labelImage`),s):n(t)}function s(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):(r._labelStarts=r._labelStarts||[],r._labelStarts.push(i),t(e))}}var Ir={name:`labelStartLink`,resolveAll:wr.resolveAll,tokenize:Lr};function Lr(e,t,n){let r=this,i;return a;function a(t){return e.enter(`labelLink`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),i=e.exit(`labelLink`),o}function o(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):(r._labelStarts=r._labelStarts||[],r._labelStarts.push(i),t(e))}}var Rr={name:`lineEnding`,tokenize:zr};function zr(e,t){return n;function n(n){return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),L(e,t,`linePrefix`)}}var Br={name:`thematicBreak`,tokenize:Vr};function Vr(e,t,n){let r=0,i;return a;function a(t){return e.enter(`thematicBreak`),o(t)}function o(e){return i=e,s(e)}function s(a){return a===i?(e.enter(`thematicBreakSequence`),c(a)):r>=3&&(a===null||F(a))?(e.exit(`thematicBreak`),t(a)):n(a)}function c(t){return t===i?(e.consume(t),r++,c):(e.exit(`thematicBreakSequence`),I(t)?L(e,s,`whitespace`)(t):s(t))}}var Hr={continuation:{tokenize:Kr},exit:Jr,name:`list`,tokenize:Gr},Ur={partial:!0,tokenize:Yr},Wr={partial:!0,tokenize:qr};function Gr(e,t,n){let r=this,i=r.events[r.events.length-1],a=i&&i[1].type===`linePrefix`?i[2].sliceSerialize(i[1],!0).length:0,o=0;return s;function s(t){let i=r.containerState.type||(t===42||t===43||t===45?`listUnordered`:`listOrdered`);if(i===`listUnordered`?!r.containerState.marker||t===r.containerState.marker:$t(t)){if(r.containerState.type||(r.containerState.type=i,e.enter(i,{_container:!0})),i===`listUnordered`)return e.enter(`listItemPrefix`),t===42||t===45?e.check(Br,n,l)(t):l(t);if(!r.interrupt||t===49)return e.enter(`listItemPrefix`),e.enter(`listItemValue`),c(t)}return n(t)}function c(t){return $t(t)&&++o<10?(e.consume(t),c):(!r.interrupt||o<2)&&(r.containerState.marker?t===r.containerState.marker:t===41||t===46)?(e.exit(`listItemValue`),l(t)):n(t)}function l(t){return e.enter(`listItemMarker`),e.consume(t),e.exit(`listItemMarker`),r.containerState.marker=r.containerState.marker||t,e.check(Tn,r.interrupt?n:u,e.attempt(Ur,f,d))}function u(e){return r.containerState.initialBlankLine=!0,a++,f(e)}function d(t){return I(t)?(e.enter(`listItemPrefixWhitespace`),e.consume(t),e.exit(`listItemPrefixWhitespace`),f):n(t)}function f(n){return r.containerState.size=a+r.sliceSerialize(e.exit(`listItemPrefix`),!0).length,t(n)}}function Kr(e,t,n){let r=this;return r.containerState._closeFlow=void 0,e.check(Tn,i,a);function i(n){return r.containerState.furtherBlankLines=r.containerState.furtherBlankLines||r.containerState.initialBlankLine,L(e,t,`listItemIndent`,r.containerState.size+1)(n)}function a(n){return r.containerState.furtherBlankLines||!I(n)?(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,o(n)):(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,e.attempt(Wr,t,o)(n))}function o(i){return r.containerState._closeFlow=!0,r.interrupt=void 0,L(e,e.attempt(Hr,t,n),`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(i)}}function qr(e,t,n){let r=this;return L(e,i,`listItemIndent`,r.containerState.size+1);function i(e){let i=r.events[r.events.length-1];return i&&i[1].type===`listItemIndent`&&i[2].sliceSerialize(i[1],!0).length===r.containerState.size?t(e):n(e)}}function Jr(e){e.exit(this.containerState.type)}function Yr(e,t,n){let r=this;return L(e,i,`listItemPrefixWhitespace`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:5);function i(e){let i=r.events[r.events.length-1];return!I(e)&&i&&i[1].type===`listItemPrefixWhitespace`?t(e):n(e)}}var Xr={name:`setextUnderline`,resolveTo:Zr,tokenize:Qr};function Zr(e,t){let n=new dn,r=e.length,i,a,o;for(;r--;)if(e[r][0]===`enter`){if(e[r][1].type===`content`){i=r;break}e[r][1].type===`paragraph`&&(a=r)}else e[r][1].type===`content`&&n.add(r,1,[]),!o&&e[r][1].type===`definition`&&(o=r);let s={type:`setextHeading`,start:{...e[i][1].start},end:{...e[e.length-1][1].end}};return e[a][1].type=`setextHeadingText`,o?(n.add(a,0,[[`enter`,s,t]]),n.add(o+1,0,[[`exit`,e[i][1],t]]),e[i][1].end={...e[o][1].end}):e[i][1]=s,n.add(e.length,0,[[`exit`,s,t]]),n.consume(e),e}function Qr(e,t,n){let r=this,i;return a;function a(t){let a=r.events.length,s;for(;a--;)if(r.events[a][1].type!==`lineEnding`&&r.events[a][1].type!==`linePrefix`&&r.events[a][1].type!==`content`){s=r.events[a][1].type===`paragraph`;break}return!r.parser.lazy[r.now().line]&&(r.interrupt||s)?(e.enter(`setextHeadingLine`),i=t,o(t)):n(t)}function o(t){return e.enter(`setextHeadingLineSequence`),s(t)}function s(t){return t===i?(e.consume(t),s):(e.exit(`setextHeadingLineSequence`),I(t)?L(e,c,`lineSuffix`)(t):c(t))}function c(r){return r===null||F(r)?(e.exit(`setextHeadingLine`),t(r)):n(r)}}var $r={tokenize:ei};function ei(e){let t=this,n=e.attempt(Tn,r,e.attempt(this.parser.constructs.flowInitial,i,L(e,e.attempt(this.parser.constructs.flow,i,e.attempt(Zn,i)),`linePrefix`)));return n;function r(r){if(r===null){e.consume(r);return}return e.enter(`lineEndingBlank`),e.consume(r),e.exit(`lineEndingBlank`),t.currentConstruct=void 0,n}function i(r){if(r===null){e.consume(r);return}return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),t.currentConstruct=void 0,n}}var ti={resolveAll:ai()},ni=ii(`string`),ri=ii(`text`);function ii(e){return{resolveAll:ai(e===`text`?oi:void 0),tokenize:t};function t(t){let n=this,r=this.parser.constructs[e],i=t.attempt(r,a,o);return a;function a(e){return c(e)?i(e):o(e)}function o(e){if(e===null){t.consume(e);return}return t.enter(`data`),t.consume(e),s}function s(e){return c(e)?(t.exit(`data`),i(e)):(t.consume(e),s)}function c(e){if(e===null)return!0;let t=r[e],i=-1;if(t)for(;++i<t.length;){let e=t[i];if(!e.previous||e.previous.call(n,n.previous))return!0}return!1}}}function ai(e){return t;function t(t,n){let r=-1,i;for(;++r<=t.length;)i===void 0?t[r]&&t[r][1].type===`data`&&(i=r,r++):(!t[r]||t[r][1].type!==`data`)&&(r!==i+2&&(t[i][1].end=t[r-1][1].end,t.splice(i+2,r-i-2),r=i+2),i=void 0);return e?e(t,n):t}}function oi(e,t){let n=new dn,r=0;for(;++r<=e.length;)if((r===e.length||e[r][1].type===`lineEnding`)&&e[r-1][1].type===`data`){let i=e[r-1][1],a=t.sliceStream(i),o=a.length,s=-1,c=0,l;for(;o--;){let e=a[o];if(typeof e==`string`){for(s=e.length;e.charCodeAt(s-1)===32;)c++,s--;if(s)break;s=-1}else if(e===-2)l=!0,c++;else if(e!==-1){o++;break}}if(t._contentTypeTextTrailing&&r===e.length&&(c=0),c){let a={type:r===e.length||l||c<2?`lineSuffix`:`hardBreakTrailing`,start:{_bufferIndex:o?s:i.start._bufferIndex+s,_index:i.start._index+o,line:i.end.line,column:i.end.column-c,offset:i.end.offset-c},end:{...i.end}};i.end={...a.start},i.start.offset===i.end.offset?Object.assign(i,a):n.add(r,0,[[`enter`,a,t],[`exit`,a,t]])}r++}return n.consume(e),e}var si=s({attentionMarkers:()=>hi,contentInitial:()=>li,disable:()=>gi,document:()=>ci,flow:()=>di,flowInitial:()=>ui,insideSpan:()=>mi,string:()=>fi,text:()=>pi}),ci={42:Hr,43:Hr,45:Hr,48:Hr,49:Hr,50:Hr,51:Hr,52:Hr,53:Hr,54:Hr,55:Hr,56:Hr,57:Hr,62:Dn},li={91:or},ui={[-2]:zn,[-1]:zn,32:zn},di={35:fr,42:Br,45:[Xr,Br],60:_r,61:Xr,95:Br,96:Ln,126:Ln},fi={38:Nn,92:jn},pi={[-5]:Rr,[-4]:Rr,[-3]:Rr,33:Pr,38:Nn,42:yn,60:[Cn,Sr],91:Ir,92:[ur,jn],93:wr,95:yn,96:Un},mi={null:[yn,ti]},hi={null:[42,95]},gi={null:[]};function _i(e,t,n){let r={_bufferIndex:-1,_index:0,line:n&&n.line||1,column:n&&n.column||1,offset:n&&n.offset||0},i={},a=[],o=[],s=[],c={attempt:ne(ee),check:ne(te),consume:v,enter:y,exit:b,interrupt:ne(te,{interrupt:!0})},l={code:null,containerState:{},defineSkip:h,events:[],now:m,parser:e,previous:null,sliceSerialize:f,sliceStream:p,write:d},u=t.tokenize.call(l,c);return t.resolveAll&&a.push(t),l;function d(e){return o=Ut(o,e),g(),o[o.length-1]===null?(re(t,0),l.events=vn(a,l.events,l),l.events):[]}function f(e,t){return yi(p(e),t)}function p(e){return vi(o,e)}function m(){let{_bufferIndex:e,_index:t,line:n,column:i,offset:a}=r;return{_bufferIndex:e,_index:t,line:n,column:i,offset:a}}function h(e){i[e.line]=e.column,S()}function g(){for(;r._index<o.length;){let e=o[r._index];if(typeof e==`string`){let t=r._index;for(r._bufferIndex<0&&(r._bufferIndex=0);r._index===t&&r._bufferIndex<e.length;)_(e.charCodeAt(r._bufferIndex))}else _(e)}}function _(e){u=u(e)}function v(e){F(e)?(r.line++,r.column=1,r.offset+=e===-3?2:1,S()):e!==-1&&(r.column++,r.offset++),r._bufferIndex<0?r._index++:(r._bufferIndex++,r._bufferIndex===o[r._index].length&&(r._bufferIndex=-1,r._index++)),l.previous=e}function y(e,t){let n=t||{};return n.type=e,n.start=m(),l.events.push([`enter`,n,l]),s.push(n),n}function b(e){let t=s.pop();return t.end=m(),l.events.push([`exit`,t,l]),t}function ee(e,t){re(e,t.from)}function te(e,t){t.restore()}function ne(e,t){return n;function n(n,r,i){let a,o,s,u;return Array.isArray(n)?f(n):`tokenize`in n?f([n]):d(n);function d(e){return t;function t(t){let n=t!==null&&e[t],r=t!==null&&e.null;return f([...Array.isArray(n)?n:n?[n]:[],...Array.isArray(r)?r:r?[r]:[]])(t)}}function f(e){return a=e,o=0,e.length===0?i:p(e[o])}function p(e){return n;function n(n){return u=x(),s=e,e.partial||(l.currentConstruct=e),e.name&&l.parser.constructs.disable.null.includes(e.name)?h(n):e.tokenize.call(t?Object.assign(Object.create(l),t):l,c,m,h)(n)}}function m(t){return e(s,u),r}function h(e){return u.restore(),++o<a.length?p(a[o]):i}}}function re(e,t){e.resolveAll&&!a.includes(e)&&a.push(e),e.resolve&&Ht(l.events,t,l.events.length-t,e.resolve(l.events.slice(t),l)),e.resolveTo&&(l.events=e.resolveTo(l.events,l))}function x(){let e=m(),t=l.previous,n=l.currentConstruct,i=l.events.length,a=Array.from(s);return{from:i,restore:o};function o(){r=e,l.previous=t,l.currentConstruct=n,l.events.length=i,s=a,S()}}function S(){r.line in i&&r.column<2&&(r.column=i[r.line],r.offset+=i[r.line]-1)}}function vi(e,t){let n=t.start._index,r=t.start._bufferIndex,i=t.end._index,a=t.end._bufferIndex,o;if(n===i)o=[e[n].slice(r,a)];else{if(o=e.slice(n,i),r>-1){let e=o[0];typeof e==`string`?o[0]=e.slice(r):o.shift()}a>0&&o.push(e[i].slice(0,a))}return o}function yi(e,t){let n=-1,r=[],i;for(;++n<e.length;){let a=e[n],o;if(typeof a==`string`)o=a;else switch(a){case-5:o=`\r`;break;case-4:o=`
`;break;case-3:o=`\r
`;break;case-2:o=t?` `:`	`;break;case-1:if(!t&&i)continue;o=` `;break;default:o=String.fromCharCode(a)}i=a===-2,r.push(o)}return r.join(``)}function bi(e){let t={constructs:Gt([si,...(e||{}).extensions||[]]),content:n(ln),defined:[],document:n(pn),flow:n($r),lazy:{},string:n(ni),text:n(ri)};return t;function n(e){return n;function n(n){return _i(t,e,n)}}}function xi(e){for(;!Yn(e););return e}var Si=/[\0\t\n\r]/g;function Ci(){let e=1,t=``,n=!0,r;return i;function i(i,a,o){i=t+(typeof i==`string`?i.toString():new TextDecoder(a||void 0).decode(i));let s=[],c=0;for(t=``,n&&=(i.charCodeAt(0)===65279&&c++,void 0);c<i.length;){Si.lastIndex=c;let n=Si.exec(i),a=n&&n.index!==void 0?n.index:i.length,o=i.charCodeAt(a);if(!n){t=i.slice(c);break}if(o===10&&c===a&&r)s.push(-3),r=void 0;else switch(r&&=(s.push(-5),void 0),c<a&&(s.push(i.slice(c,a)),e+=a-c),o){case 0:s.push(65533),e++;break;case 9:{let t=Math.ceil(e/4)*4;for(s.push(-2);e++<t;)s.push(-1);break}case 10:s.push(-4),e=1;break;default:r=!0,e=1}c=a+1}return o&&(r&&s.push(-5),t&&s.push(t),s.push(null)),s}}var wi=/\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;function Ti(e){return e.replace(wi,Ei)}function Ei(e,t,n){if(t)return t;if(n.charCodeAt(0)===35){let e=n.charCodeAt(1),t=e===120||e===88;return Jt(n.slice(t?2:1),t?16:10)}return Vt(n)||e}var Di={}.hasOwnProperty;function Oi(e,t,n){return t&&typeof t==`object`&&(n=t,t=void 0),ki(n)(xi(bi(n).document().write(Ci()(e,t,!0))))}function ki(e){let t={afterExit:[],beforeEnter:[],transforms:[],canContainEols:[`emphasis`,`fragment`,`heading`,`paragraph`,`strong`],enter:{autolink:o(j),autolinkProtocol:S,autolinkEmail:S,atxHeading:o(O),blockQuote:o(xe),characterEscape:S,characterReference:S,codeFenced:o(Se),codeFencedFenceInfo:s,codeFencedFenceMeta:s,codeIndented:o(Se,s),codeText:o(Ce,s),codeTextData:S,data:S,codeFlowValue:S,definition:o(E),definitionDestinationString:s,definitionLabelString:s,definitionTitleString:s,emphasis:o(D),hardBreakEscape:o(k),hardBreakTrailing:o(k),htmlFlow:o(A,s),htmlFlowData:S,htmlText:o(A,s),htmlTextData:S,image:o(we),label:s,link:o(j),listItem:o(N),listItemValue:p,listOrdered:o(M,f),listUnordered:o(M),paragraph:o(Te),reference:me,referenceString:s,resourceDestinationString:s,resourceTitleString:s,setextHeading:o(O),strong:o(Ee),thematicBreak:o(Oe)},exit:{atxHeading:l(),atxHeadingSequence:te,autolink:l(),autolinkEmail:be,autolinkProtocol:ye,blockQuote:l(),characterEscapeValue:C,characterReferenceMarkerHexadecimal:ge,characterReferenceMarkerNumeric:ge,characterReferenceValue:_e,characterReference:ve,codeFenced:l(_),codeFencedFence:g,codeFencedFenceInfo:m,codeFencedFenceMeta:h,codeFlowValue:C,codeIndented:l(v),codeText:l(se),codeTextData:C,data:C,definition:l(),definitionDestinationString:ee,definitionLabelString:y,definitionTitleString:b,emphasis:l(),hardBreakEscape:l(ie),hardBreakTrailing:l(ie),htmlFlow:l(ae),htmlFlowData:C,htmlText:l(oe),htmlTextData:C,image:l(ce),label:ue,labelText:le,lineEnding:w,link:l(T),listItem:l(),listOrdered:l(),listUnordered:l(),paragraph:l(),referenceString:he,resourceDestinationString:de,resourceTitleString:fe,resource:pe,setextHeading:l(x),setextHeadingLineSequence:re,setextHeadingText:ne,strong:l(),thematicBreak:l()}};ji(t,(e||{}).mdastExtensions||[]);let n={};return r;function r(e){let r={type:`root`,children:[],position:void 0},o={stack:[r],tokenStack:[],config:t,enter:c,exit:u,buffer:s,resume:d,data:n},l=[],f=[],p=-1;for(;++p<e.length;)f.push(e[p]),(e[p][1].type===`listOrdered`||e[p][1].type===`listUnordered`)&&(e[p][0]===`enter`?l.push(f.length-1):a(f,l.pop()));for(e=f,p=-1;++p<e.length;){let n=t[e[p][0]];e[p][0]===`enter`&&t.beforeEnter.length>0&&i(t.beforeEnter,{...o,sliceSerialize:e[p][2].sliceSerialize},e[p][1]),Di.call(n,e[p][1].type)&&n[e[p][1].type].call({...o,sliceSerialize:e[p][2].sliceSerialize},e[p][1]),e[p][0]===`exit`&&t.afterExit.length>0&&i(t.afterExit,{...o,sliceSerialize:e[p][2].sliceSerialize},e[p][1])}if(o.tokenStack.length>0){let e=o.tokenStack[o.tokenStack.length-1];(e[1]||Ni).call(o,void 0,e[0])}for(r.position={start:Ai(e.length>0?e[0][1].start:{line:1,column:1,offset:0}),end:Ai(e.length>0?e[e.length-2][1].end:{line:1,column:1,offset:0})},p=-1;++p<t.transforms.length;)r=t.transforms[p](r)||r;return r}function i(e,t,n){let r=-1;for(;++r<e.length;)e[r].call(t,n)}function a(e,t){let n=e.length-1,r=t-1,i=-1,a=!1,o,s,c,l,u=[];for(;++r<=n;){let t=e[r];switch(t[1].type){case`listUnordered`:case`listOrdered`:case`blockQuote`:t[0]===`enter`?i++:i--,l=void 0;break;case`lineEndingBlank`:t[0]===`enter`&&(o&&!l&&!i&&!c&&(c=r),l=void 0);break;case`linePrefix`:case`listItemValue`:case`listItemMarker`:case`listItemPrefix`:case`listItemPrefixWhitespace`:break;default:l=void 0}if(!i&&t[0]===`enter`&&t[1].type===`listItemPrefix`||i===-1&&t[0]===`exit`&&(t[1].type===`listUnordered`||t[1].type===`listOrdered`)){if(o){let n=r;for(s=void 0;n--;){let t=e[n];if(t[1].type===`lineEnding`||t[1].type===`lineEndingBlank`){if(t[0]===`exit`)continue;s&&(e[s][1].type=`lineEndingBlank`,a=!0),t[1].type=`lineEnding`,s=n}else if(t[1].type!==`linePrefix`&&t[1].type!==`blockQuotePrefix`&&t[1].type!==`blockQuotePrefixWhitespace`&&t[1].type!==`blockQuoteMarker`&&t[1].type!==`listItemIndent`)break}c&&(!s||c<s)&&(o._spread=!0),o.end=Object.assign({},s?e[s][1].start:t[1].end),u.push({at:s||r,event:[`exit`,o,t[2]]})}if(t[1].type===`listItemPrefix`){let e={type:`listItem`,_spread:!1,start:Object.assign({},t[1].start),end:void 0};o=e,u.push({at:r,event:[`enter`,e,t[2]]}),c=void 0,l=!0}}}let d=e.splice(t),f=0;for(r=-1;++r<d.length;){for(;f<u.length&&u[f].at===t+r;)e.push(u[f++].event);e.push(d[r])}e[t][1]._spread=a}function o(e,t){return n;function n(n){c.call(this,e(n),n),t&&t.call(this,n)}}function s(){this.stack.push({type:`fragment`,children:[]})}function c(e,t,n){this.stack[this.stack.length-1].children.push(e),this.stack.push(e),this.tokenStack.push([t,n||void 0]),e.position={start:Ai(t.start),end:void 0}}function l(e){return t;function t(t){e&&e.call(this,t),u.call(this,t)}}function u(e,t){let n=this.stack.pop(),r=this.tokenStack.pop();if(!r)throw Error("Cannot close `"+e.type+"` ("+et({start:e.start,end:e.end})+`): it’s not open`);r[0].type!==e.type&&(t?t.call(this,e,r[0]):(r[1]||Ni).call(this,e,r[0])),n.position.end=Ai(e.end)}function d(){return It(this.stack.pop())}function f(){this.data.expectingFirstListItemValue=!0}function p(e){if(this.data.expectingFirstListItemValue){let t=this.stack[this.stack.length-2];t.start=Number.parseInt(this.sliceSerialize(e),10),this.data.expectingFirstListItemValue=void 0}}function m(){let e=this.resume(),t=this.stack[this.stack.length-1];t.lang=e}function h(){let e=this.resume(),t=this.stack[this.stack.length-1];t.meta=e}function g(){this.data.flowCodeInside||(this.buffer(),this.data.flowCodeInside=!0)}function _(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,``),this.data.flowCodeInside=void 0}function v(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e.replace(/(\r?\n|\r)$/g,``)}function y(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=Yt(this.sliceSerialize(e)).toLowerCase()}function b(){let e=this.resume(),t=this.stack[this.stack.length-1];t.title=e}function ee(){let e=this.resume(),t=this.stack[this.stack.length-1];t.url=e}function te(e){let t=this.stack[this.stack.length-1];t.depth||=this.sliceSerialize(e).length}function ne(){this.data.setextHeadingSlurpLineEnding=!0}function re(e){let t=this.stack[this.stack.length-1];t.depth=this.sliceSerialize(e).codePointAt(0)===61?1:2}function x(){this.data.setextHeadingSlurpLineEnding=void 0}function S(e){let t=this.stack[this.stack.length-1].children,n=t[t.length-1];(!n||n.type!==`text`)&&(n=De(),n.position={start:Ai(e.start),end:void 0},t.push(n)),this.stack.push(n)}function C(e){let t=this.stack.pop();t.value+=this.sliceSerialize(e),t.position.end=Ai(e.end)}function w(e){let n=this.stack[this.stack.length-1];if(this.data.atHardBreak){let t=n.children[n.children.length-1];t.position.end=Ai(e.end),this.data.atHardBreak=void 0;return}!this.data.setextHeadingSlurpLineEnding&&t.canContainEols.includes(n.type)&&(S.call(this,e),C.call(this,e))}function ie(){this.data.atHardBreak=!0}function ae(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function oe(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function se(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function T(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||`shortcut`;e.type+=`Reference`,e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}function ce(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||`shortcut`;e.type+=`Reference`,e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}function le(e){let t=this.sliceSerialize(e),n=this.stack[this.stack.length-2];n.label=Ti(t),n.identifier=Yt(t).toLowerCase()}function ue(){let e=this.stack[this.stack.length-1],t=this.resume(),n=this.stack[this.stack.length-1];this.data.inReference=!0,n.type===`link`?n.children=e.children:n.alt=t}function de(){let e=this.resume(),t=this.stack[this.stack.length-1];t.url=e}function fe(){let e=this.resume(),t=this.stack[this.stack.length-1];t.title=e}function pe(){this.data.inReference=void 0}function me(){this.data.referenceType=`collapsed`}function he(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=Yt(this.sliceSerialize(e)).toLowerCase(),this.data.referenceType=`full`}function ge(e){this.data.characterReferenceType=e.type}function _e(e){let t=this.sliceSerialize(e),n=this.data.characterReferenceType,r;n?(r=Jt(t,n===`characterReferenceMarkerNumeric`?10:16),this.data.characterReferenceType=void 0):r=Vt(t);let i=this.stack[this.stack.length-1];i.value+=r}function ve(e){let t=this.stack.pop();t.position.end=Ai(e.end)}function ye(e){C.call(this,e);let t=this.stack[this.stack.length-1];t.url=this.sliceSerialize(e)}function be(e){C.call(this,e);let t=this.stack[this.stack.length-1];t.url=`mailto:`+this.sliceSerialize(e)}function xe(){return{type:`blockquote`,children:[],position:void 0}}function Se(){return{type:`code`,lang:null,meta:null,value:``,position:void 0}}function Ce(){return{type:`inlineCode`,value:``,position:void 0}}function E(){return{type:`definition`,identifier:``,label:null,title:null,url:``,position:void 0}}function D(){return{type:`emphasis`,children:[],position:void 0}}function O(){return{type:`heading`,depth:0,children:[],position:void 0}}function k(){return{type:`break`,position:void 0}}function A(){return{type:`html`,value:``,position:void 0}}function we(){return{type:`image`,title:null,url:``,alt:null,position:void 0}}function j(){return{type:`link`,title:null,url:``,children:[],position:void 0}}function M(e){return{type:`list`,ordered:e.type===`listOrdered`,start:null,spread:e._spread,children:[],position:void 0}}function N(e){return{type:`listItem`,spread:e._spread,checked:null,children:[],position:void 0}}function Te(){return{type:`paragraph`,children:[],position:void 0}}function Ee(){return{type:`strong`,children:[],position:void 0}}function De(){return{type:`text`,value:``,position:void 0}}function Oe(){return{type:`thematicBreak`,position:void 0}}}function Ai(e){return{line:e.line,column:e.column,offset:e.offset}}function ji(e,t){let n=-1;for(;++n<t.length;){let r=t[n];Array.isArray(r)?ji(e,r):Mi(e,r)}}function Mi(e,t){let n;for(n in t)if(Di.call(t,n))switch(n){case`canContainEols`:{let r=t[n];r&&e[n].push(...r);break}case`transforms`:{let r=t[n];r&&e[n].push(...r);break}case`afterExit`:case`beforeEnter`:{let r=t[n];r&&e[n].push(r);break}case`enter`:case`exit`:{let r=t[n];r&&Object.assign(e[n],r);break}}}function Ni(e,t){throw Error(e?"Cannot close `"+e.type+"` ("+et({start:e.start,end:e.end})+"): a different token (`"+t.type+"`, "+et({start:t.start,end:t.end})+`) is open`:"Cannot close document, a token (`"+t.type+"`, "+et({start:t.start,end:t.end})+`) is still open`)}function Pi(e){let t=this;t.parser=n;function n(n){return Oi(n,{...t.data(`settings`),...e,extensions:t.data(`micromarkExtensions`)||[],mdastExtensions:t.data(`fromMarkdownExtensions`)||[]})}}function Fi(e,t){let n={type:`element`,tagName:`blockquote`,properties:{},children:e.wrap(e.all(t),!0)};return e.patch(t,n),e.applyData(t,n)}function Ii(e,t){let n={type:`element`,tagName:`br`,properties:{},children:[]};return e.patch(t,n),[e.applyData(t,n),{type:`text`,value:`
`}]}function Li(e,t){let n=t.value?t.value+`
`:``,r={},i=t.lang?t.lang.split(/\s+/):[];i.length>0&&(r.className=[`language-`+i[0]]);let a={type:`element`,tagName:`code`,properties:r,children:[{type:`text`,value:n}]};return t.meta&&(a.data={meta:t.meta}),e.patch(t,a),a=e.applyData(t,a),a={type:`element`,tagName:`pre`,properties:{},children:[a]},e.patch(t,a),a}function Ri(e,t){let n={type:`element`,tagName:`del`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function zi(e,t){let n={type:`element`,tagName:`em`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Bi(e,t){let n=typeof e.options.clobberPrefix==`string`?e.options.clobberPrefix:`user-content-`,r=String(t.identifier).toUpperCase(),i=sn(r.toLowerCase()),a=e.footnoteOrder.indexOf(r),o,s=e.footnoteCounts.get(r);s===void 0?(s=0,e.footnoteOrder.push(r),o=e.footnoteOrder.length):o=a+1,s+=1,e.footnoteCounts.set(r,s);let c={type:`element`,tagName:`a`,properties:{href:`#`+n+`fn-`+i,id:n+`fnref-`+i+(s>1?`-`+s:``),dataFootnoteRef:!0,ariaDescribedBy:[`footnote-label`]},children:[{type:`text`,value:String(o)}]};e.patch(t,c);let l={type:`element`,tagName:`sup`,properties:{},children:[c]};return e.patch(t,l),e.applyData(t,l)}function Vi(e,t){let n={type:`element`,tagName:`h`+t.depth,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Hi(e,t){if(e.options.allowDangerousHtml){let n={type:`raw`,value:t.value};return e.patch(t,n),e.applyData(t,n)}}function Ui(e,t){let n=t.referenceType,r=`]`;if(n===`collapsed`?r+=`[]`:n===`full`&&(r+=`[`+(t.label||t.identifier)+`]`),t.type===`imageReference`)return[{type:`text`,value:`![`+t.alt+r}];let i=e.all(t),a=i[0];a&&a.type===`text`?a.value=`[`+a.value:i.unshift({type:`text`,value:`[`});let o=i[i.length-1];return o&&o.type===`text`?o.value+=r:i.push({type:`text`,value:r}),i}function Wi(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return Ui(e,t);let i={src:sn(r.url||``),alt:t.alt};r.title!==null&&r.title!==void 0&&(i.title=r.title);let a={type:`element`,tagName:`img`,properties:i,children:[]};return e.patch(t,a),e.applyData(t,a)}function Gi(e,t){let n={src:sn(t.url)};t.alt!==null&&t.alt!==void 0&&(n.alt=t.alt),t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:`element`,tagName:`img`,properties:n,children:[]};return e.patch(t,r),e.applyData(t,r)}function Ki(e,t){let n={type:`text`,value:t.value.replace(/\r?\n|\r/g,` `)};e.patch(t,n);let r={type:`element`,tagName:`code`,properties:{},children:[n]};return e.patch(t,r),e.applyData(t,r)}function qi(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return Ui(e,t);let i={href:sn(r.url||``)};r.title!==null&&r.title!==void 0&&(i.title=r.title);let a={type:`element`,tagName:`a`,properties:i,children:e.all(t)};return e.patch(t,a),e.applyData(t,a)}function Ji(e,t){let n={href:sn(t.url)};t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:`element`,tagName:`a`,properties:n,children:e.all(t)};return e.patch(t,r),e.applyData(t,r)}function Yi(e,t,n){let r=e.all(t),i=n?Xi(n):Zi(t),a={},o=[];if(typeof t.checked==`boolean`){let e=r[0],n;e&&e.type===`element`&&e.tagName===`p`?n=e:(n={type:`element`,tagName:`p`,properties:{},children:[]},r.unshift(n)),n.children.length>0&&n.children.unshift({type:`text`,value:` `}),n.children.unshift({type:`element`,tagName:`input`,properties:{type:`checkbox`,checked:t.checked,disabled:!0},children:[]}),a.className=[`task-list-item`]}let s=-1;for(;++s<r.length;){let e=r[s];(i||s!==0||e.type!==`element`||e.tagName!==`p`)&&o.push({type:`text`,value:`
`}),e.type===`element`&&e.tagName===`p`&&!i?o.push(...e.children):o.push(e)}let c=r[r.length-1];c&&(i||c.type!==`element`||c.tagName!==`p`)&&o.push({type:`text`,value:`
`});let l={type:`element`,tagName:`li`,properties:a,children:o};return e.patch(t,l),e.applyData(t,l)}function Xi(e){let t=!1;if(e.type===`list`){t=e.spread||!1;let n=e.children,r=-1;for(;!t&&++r<n.length;)t=Zi(n[r])}return t}function Zi(e){return e.spread??e.children.length>1}function Qi(e,t){let n={},r=e.all(t),i=-1;for(typeof t.start==`number`&&t.start!==1&&(n.start=t.start);++i<r.length;){let e=r[i];if(e.type===`element`&&e.tagName===`li`&&e.properties&&Array.isArray(e.properties.className)&&e.properties.className.includes(`task-list-item`)){n.className=[`contains-task-list`];break}}let a={type:`element`,tagName:t.ordered?`ol`:`ul`,properties:n,children:e.wrap(r,!0)};return e.patch(t,a),e.applyData(t,a)}function $i(e,t){let n={type:`element`,tagName:`p`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function ea(e,t){let n={type:`root`,children:e.wrap(e.all(t))};return e.patch(t,n),e.applyData(t,n)}function ta(e,t){let n={type:`element`,tagName:`strong`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function na(e,t){let n=e.all(t),r=n.shift(),i=[];if(r){let n={type:`element`,tagName:`thead`,properties:{},children:e.wrap([r],!0)};e.patch(t.children[0],n),i.push(n)}if(n.length>0){let r={type:`element`,tagName:`tbody`,properties:{},children:e.wrap(n,!0)},a=Ze(t.children[1]),o=Xe(t.children[t.children.length-1]);a&&o&&(r.position={start:a,end:o}),i.push(r)}let a={type:`element`,tagName:`table`,properties:{},children:e.wrap(i,!0)};return e.patch(t,a),e.applyData(t,a)}function ra(e,t,n){let r=n?n.children:void 0,i=(r?r.indexOf(t):1)===0?`th`:`td`,a=n&&n.type===`table`?n.align:void 0,o=a?a.length:t.children.length,s=-1,c=[];for(;++s<o;){let n=t.children[s],r={},o=a?a[s]:void 0;o&&(r.align=o);let l={type:`element`,tagName:i,properties:r,children:[]};n&&(l.children=e.all(n),e.patch(n,l),l=e.applyData(n,l)),c.push(l)}let l={type:`element`,tagName:`tr`,properties:{},children:e.wrap(c,!0)};return e.patch(t,l),e.applyData(t,l)}function ia(e,t){let n={type:`element`,tagName:`td`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}var aa=9,R=32;function z(e){let t=String(e),n=/\r?\n|\r/g,r=n.exec(t),i=0,a=[];for(;r;)a.push(oa(t.slice(i,r.index),i>0,!0),r[0]),i=r.index+r[0].length,r=n.exec(t);return a.push(oa(t.slice(i),i>0,!1)),a.join(``)}function oa(e,t,n){let r=0,i=e.length;if(t){let t=e.codePointAt(r);for(;t===aa||t===R;)r++,t=e.codePointAt(r)}if(n){let t=e.codePointAt(i-1);for(;t===aa||t===R;)i--,t=e.codePointAt(i-1)}return i>r?e.slice(r,i):``}function sa(e,t){let n={type:`text`,value:z(String(t.value))};return e.patch(t,n),e.applyData(t,n)}function ca(e,t){let n={type:`element`,tagName:`hr`,properties:{},children:[]};return e.patch(t,n),e.applyData(t,n)}var la={blockquote:Fi,break:Ii,code:Li,delete:Ri,emphasis:zi,footnoteReference:Bi,heading:Vi,html:Hi,imageReference:Wi,image:Gi,inlineCode:Ki,linkReference:qi,link:Ji,listItem:Yi,list:Qi,paragraph:$i,root:ea,strong:ta,table:na,tableCell:ia,tableRow:ra,text:sa,thematicBreak:ca,toml:ua,yaml:ua,definition:ua,footnoteDefinition:ua};function ua(){}var{defineProperty:da}=Object,fa=typeof self==`object`?self:globalThis,pa=(e,t)=>{switch(e){case`Function`:case`SharedWorker`:case`Worker`:case`eval`:case`setInterval`:case`setTimeout`:throw TypeError(`unable to deserialize `+e)}return new fa[e](t)},ma=(e,t)=>{let n=(t,n)=>(e.set(n,t),t),r=i=>{if(e.has(i))return e.get(i);let[a,o]=t[i];switch(a){case 0:case-1:return n(o,i);case 1:{let e=n([],i);for(let t of o)e.push(r(t));return e}case 2:{let e=n({},i);for(let[t,n]of o){let i=r(t),a=r(n);i===`__proto__`?da(e,i,{value:a,configurable:!0,enumerable:!0,writable:!0}):e[i]=a}return e}case 3:return n(new Date(o),i);case 4:{let{source:e,flags:t}=o;return n(new RegExp(e,t),i)}case 5:{let e=n(new Map,i);for(let[t,n]of o)e.set(r(t),r(n));return e}case 6:{let e=n(new Set,i);for(let t of o)e.add(r(t));return e}case 7:{let{name:e,message:t}=o;return n(typeof fa[e]==`function`?pa(e,t):Error(t),i)}case 8:return n(BigInt(o),i);case`BigInt`:return n(Object(BigInt(o)),i);case`ArrayBuffer`:return n(new Uint8Array(o).buffer,o);case`DataView`:{let{buffer:e}=new Uint8Array(o);return n(new DataView(e),o)}case`-0`:return-0}return n(pa(a,o),i)};return r},ha=e=>ma(new Map,e)(0),ga=``,{toString:_a}={},{keys:va,is:ya}=Object,ba=e=>{let t=typeof e;if(t!==`object`||!e)return[0,t];let n=_a.call(e).slice(8,-1);switch(n){case`Array`:return[1,ga];case`Object`:return[2,ga];case`Date`:return[3,ga];case`RegExp`:return[4,ga];case`Map`:return[5,ga];case`Set`:return[6,ga];case`DataView`:return[1,n]}return n.includes(`Array`)?[1,n]:e instanceof Error?[7,e.name||`Error`]:[2,n]},xa=([e,t])=>e===0&&(t===`function`||t===`symbol`),Sa=(e,t,n,r)=>{let i=(e,t)=>{let i=r.push(e)-1;return n.set(t,i),i},a=o=>{if(n.has(o))return n.get(o);let[s,c]=ba(o);switch(s){case 0:{let t=o;switch(c){case`bigint`:s=8,t=o.toString();break;case`number`:if(!o&&ya(o,-0))return r.push([`-0`])-1;break;case`function`:case`symbol`:if(e)throw TypeError(`unable to serialize `+c);t=null;break;case`undefined`:return i([-1],o)}return i([s,t],o)}case 1:{if(c){let e=o;return c===`DataView`?e=new Uint8Array(o.buffer):c===`ArrayBuffer`&&(e=new Uint8Array(o)),i([c,[...e]],o)}let e=[],t=i([s,e],o);for(let t of o)e.push(a(t));return t}case 2:{if(c)switch(c){case`BigInt`:return i([c,o.toString()],o);case`Boolean`:case`Number`:case`String`:return i([c,o.valueOf()],o)}if(t&&`toJSON`in o)return a(o.toJSON());let n=[],r=i([s,n],o);for(let t of va(o))(e||!xa(ba(o[t])))&&n.push([a(t),a(o[t])]);return r}case 3:return i([s,isNaN(o.getTime())?ga:o.toISOString()],o);case 4:{let{source:e,flags:t}=o;return i([s,{source:e,flags:t}],o)}case 5:{let t=[],n=i([s,t],o);for(let[n,r]of o)(e||!(xa(ba(n))||xa(ba(r))))&&t.push([a(n),a(r)]);return n}case 6:{let t=[],n=i([s,t],o);for(let n of o)(e||!xa(ba(n)))&&t.push(a(n));return n}}let{message:l}=o;return i([s,{name:c,message:l}],o)};return a},Ca=(e,{json:t,lossy:n}={})=>{let r=[];return Sa(!(t||n),!!t,new Map,r)(e),r},wa=typeof structuredClone==`function`?(e,t)=>t&&(`json`in t||`lossy`in t)?ha(Ca(e,t)):structuredClone(e):(e,t)=>ha(Ca(e,t));function Ta(e,t){let n=[{type:`text`,value:`↩`}];return t>1&&n.push({type:`element`,tagName:`sup`,properties:{},children:[{type:`text`,value:String(t)}]}),n}function Ea(e,t){return`Back to reference `+(e+1)+(t>1?`-`+t:``)}function Da(e){let t=typeof e.options.clobberPrefix==`string`?e.options.clobberPrefix:`user-content-`,n=e.options.footnoteBackContent||Ta,r=e.options.footnoteBackLabel||Ea,i=e.options.footnoteLabel||`Footnotes`,a=e.options.footnoteLabelTagName||`h2`,o=e.options.footnoteLabelProperties||{className:[`sr-only`]},s=[],c=-1;for(;++c<e.footnoteOrder.length;){let i=e.footnoteById.get(e.footnoteOrder[c]);if(!i)continue;let a=e.all(i),o=String(i.identifier).toUpperCase(),l=sn(o.toLowerCase()),u=0,d=[],f=e.footnoteCounts.get(o);for(;f!==void 0&&++u<=f;){d.length>0&&d.push({type:`text`,value:` `});let e=typeof n==`string`?n:n(c,u);typeof e==`string`&&(e={type:`text`,value:e}),d.push({type:`element`,tagName:`a`,properties:{href:`#`+t+`fnref-`+l+(u>1?`-`+u:``),dataFootnoteBackref:``,ariaLabel:typeof r==`string`?r:r(c,u),className:[`data-footnote-backref`]},children:Array.isArray(e)?e:[e]})}let p=a[a.length-1];if(p&&p.type===`element`&&p.tagName===`p`){let e=p.children[p.children.length-1];e&&e.type===`text`?e.value+=` `:p.children.push({type:`text`,value:` `}),p.children.push(...d)}else a.push(...d);let m={type:`element`,tagName:`li`,properties:{id:t+`fn-`+l},children:e.wrap(a,!0)};e.patch(i,m),s.push(m)}if(s.length!==0)return{type:`element`,tagName:`section`,properties:{dataFootnotes:!0,className:[`footnotes`]},children:[{type:`element`,tagName:a,properties:{...wa(o),id:`footnote-label`},children:[{type:`text`,value:i}]},{type:`text`,value:`
`},{type:`element`,tagName:`ol`,properties:{},children:e.wrap(s,!0)},{type:`text`,value:`
`}]}}var Oa=(function(e){if(e==null)return Ma;if(typeof e==`function`)return B(e);if(typeof e==`object`)return Array.isArray(e)?ka(e):Aa(e);if(typeof e==`string`)return ja(e);throw Error(`Expected function, string, or object as test`)});function ka(e){let t=[],n=-1;for(;++n<e.length;)t[n]=Oa(e[n]);return B(r);function r(...e){let n=-1;for(;++n<t.length;)if(t[n].apply(this,e))return!0;return!1}}function Aa(e){let t=e;return B(n);function n(n){let r=n,i;for(i in e)if(r[i]!==t[i])return!1;return!0}}function ja(e){return B(t);function t(t){return t&&t.type===e}}function B(e){return t;function t(t,n,r){return!!(Na(t)&&e.call(this,t,typeof n==`number`?n:void 0,r||void 0))}}function Ma(){return!0}function Na(e){return typeof e==`object`&&!!e&&`type`in e}function Pa(e){return e}var Fa=[];function Ia(e,t,n,r){let i;typeof t==`function`&&typeof n!=`function`?(r=n,n=t):i=t;let a=Oa(i),o=r?-1:1;s(e,void 0,[])();function s(e,i,c){let l=e&&typeof e==`object`?e:{};if(typeof l.type==`string`){let t=typeof l.tagName==`string`?l.tagName:typeof l.name==`string`?l.name:void 0;Object.defineProperty(u,"name",{value:`node (`+Pa(e.type+(t?`<`+t+`>`:``))+`)`})}return u;function u(){let l=Fa,u,d,f;if((!t||a(e,i,c[c.length-1]||void 0))&&(l=La(n(e,c)),l[0]===!1))return l;if(`children`in e&&e.children){let t=e;if(t.children&&l[0]!==`skip`)for(d=(r?t.children.length:-1)+o,f=c.concat(t);d>-1&&d<t.children.length;){let e=t.children[d];if(u=s(e,d,f)(),u[0]===!1)return u;d=typeof u[1]==`number`?u[1]:d+o}}return l}}}function La(e){return Array.isArray(e)?e:typeof e==`number`?[!0,e]:e==null?Fa:[e]}function Ra(e,t,n,r){let i,a,o;typeof t==`function`&&typeof n!=`function`?(a=void 0,o=t,i=n):(a=t,o=n,i=r),Ia(e,a,s,i);function s(e,t){let n=t[t.length-1],r=n?n.children.indexOf(e):void 0;return o(e,r,n)}}var za={}.hasOwnProperty,Ba={};function Va(e,t){let n=t||Ba,r=new Map,i=new Map,a={all:s,applyData:Ua,definitionById:r,footnoteById:i,footnoteCounts:new Map,footnoteOrder:[],handlers:{...la,...n.handlers},one:o,options:n,patch:Ha,wrap:Ga};return Ra(e,function(e){if(e.type===`definition`||e.type===`footnoteDefinition`){let t=e.type===`definition`?r:i,n=String(e.identifier).toUpperCase();t.has(n)||t.set(n,e)}}),a;function o(e,t){let n=e.type,r=a.handlers[n];if(za.call(a.handlers,n)&&r)return r(a,e,t);if(a.options.passThrough&&a.options.passThrough.includes(n)){if(`children`in e){let{children:t,...n}=e,r=wa(n);return r.children=a.all(e),r}return wa(e)}return(a.options.unknownHandler||Wa)(a,e,t)}function s(e){let t=[];if(`children`in e){let n=e.children,r=-1;for(;++r<n.length;){let i=a.one(n[r],e);if(i){if(r&&n[r-1].type===`break`&&(!Array.isArray(i)&&i.type===`text`&&(i.value=Ka(i.value)),!Array.isArray(i)&&i.type===`element`)){let e=i.children[0];e&&e.type===`text`&&(e.value=Ka(e.value))}Array.isArray(i)?t.push(...i):t.push(i)}}}return t}}function Ha(e,t){e.position&&(t.position=$e(e))}function Ua(e,t){let n=t;if(e&&e.data){let t=e.data.hName,r=e.data.hChildren,i=e.data.hProperties;typeof t==`string`&&(n.type===`element`?n.tagName=t:n={type:`element`,tagName:t,properties:{},children:`children`in n?n.children:[n]}),n.type===`element`&&i&&Object.assign(n.properties,wa(i)),`children`in n&&n.children&&r!=null&&(n.children=r)}return n}function Wa(e,t){let n=t.data||{},r=`value`in t&&!(za.call(n,`hProperties`)||za.call(n,`hChildren`))?{type:`text`,value:t.value}:{type:`element`,tagName:`div`,properties:{},children:e.all(t)};return e.patch(t,r),e.applyData(t,r)}function Ga(e,t){let n=[],r=-1;for(t&&n.push({type:`text`,value:`
`});++r<e.length;)r&&n.push({type:`text`,value:`
`}),n.push(e[r]);return t&&e.length>0&&n.push({type:`text`,value:`
`}),n}function Ka(e){let t=0,n=e.charCodeAt(t);for(;n===9||n===32;)t++,n=e.charCodeAt(t);return e.slice(t)}function qa(e,t){let n=Va(e,t),r=n.one(e,void 0),i=Da(n),a=Array.isArray(r)?{type:`root`,children:r}:r||{type:`root`,children:[]};return i&&(`children`in a,a.children.push({type:`text`,value:`
`},i)),a}function Ja(e,t){return e&&`run`in e?async function(n,r){let i=qa(n,{file:r,...t});await e.run(i,r)}:function(n,r){return qa(n,{file:r,...e||t})}}function Ya(e){if(e)throw e}var Xa=o(((e,t)=>{var n=Object.prototype.hasOwnProperty,r=Object.prototype.toString,i=Object.defineProperty,a=Object.getOwnPropertyDescriptor,o=function(e){return typeof Array.isArray==`function`?Array.isArray(e):r.call(e)===`[object Array]`},s=function(e){if(!e||r.call(e)!==`[object Object]`)return!1;var t=n.call(e,`constructor`),i=e.constructor&&e.constructor.prototype&&n.call(e.constructor.prototype,`isPrototypeOf`);if(e.constructor&&!t&&!i)return!1;for(var a in e);return a===void 0||n.call(e,a)},c=function(e,t){i&&t.name===`__proto__`?i(e,t.name,{enumerable:!0,configurable:!0,value:t.newValue,writable:!0}):e[t.name]=t.newValue},l=function(e,t){if(t===`__proto__`){if(!n.call(e,t))return;if(a)return a(e,t).value}return e[t]};t.exports=function e(){var t,n,r,i,a,u,d=arguments[0],f=1,p=arguments.length,m=!1;for(typeof d==`boolean`&&(m=d,d=arguments[1]||{},f=2),(d==null||typeof d!=`object`&&typeof d!=`function`)&&(d={});f<p;++f)if(t=arguments[f],t!=null)for(n in t)r=l(d,n),i=l(t,n),d!==i&&(m&&i&&(s(i)||(a=o(i)))?(a?(a=!1,u=r&&o(r)?r:[]):u=r&&s(r)?r:{},c(d,{name:n,newValue:e(m,u,i)})):i!==void 0&&c(d,{name:n,newValue:i}));return d}}));function Za(e){if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)}function Qa(){let e=[],t={run:n,use:r};return t;function n(...t){let n=-1,r=t.pop();if(typeof r!=`function`)throw TypeError(`Expected function as last argument, not `+r);i(null,...t);function i(a,...o){let s=e[++n],c=-1;if(a){r(a);return}for(;++c<t.length;)(o[c]===null||o[c]===void 0)&&(o[c]=t[c]);t=o,s?$a(s,i)(...o):r(null,...o)}}function r(n){if(typeof n!=`function`)throw TypeError("Expected `middelware` to be a function, not "+n);return e.push(n),t}}function $a(e,t){let n;return r;function r(...t){let r=e.length>t.length,o;r&&t.push(i);try{o=e.apply(this,t)}catch(e){let t=e;if(r&&n)throw t;return i(t)}r||(o&&o.then&&typeof o.then==`function`?o.then(a,i):o instanceof Error?i(o):a(o))}function i(e,...r){n||(n=!0,t(e,...r))}function a(e){i(null,e)}}var eo={basename:to,dirname:no,extname:ro,join:io,sep:`/`};function to(e,t){if(t!==void 0&&typeof t!=`string`)throw TypeError(`"ext" argument must be a string`);so(e);let n=0,r=-1,i=e.length,a;if(t===void 0||t.length===0||t.length>e.length){for(;i--;)if(e.codePointAt(i)===47){if(a){n=i+1;break}}else r<0&&(a=!0,r=i+1);return r<0?``:e.slice(n,r)}if(t===e)return``;let o=-1,s=t.length-1;for(;i--;)if(e.codePointAt(i)===47){if(a){n=i+1;break}}else o<0&&(a=!0,o=i+1),s>-1&&(e.codePointAt(i)===t.codePointAt(s--)?s<0&&(r=i):(s=-1,r=o));return n===r?r=o:r<0&&(r=e.length),e.slice(n,r)}function no(e){if(so(e),e.length===0)return`.`;let t=-1,n=e.length,r;for(;--n;)if(e.codePointAt(n)===47){if(r){t=n;break}}else r||=!0;return t<0?e.codePointAt(0)===47?`/`:`.`:t===1&&e.codePointAt(0)===47?`//`:e.slice(0,t)}function ro(e){so(e);let t=e.length,n=-1,r=0,i=-1,a=0,o;for(;t--;){let s=e.codePointAt(t);if(s===47){if(o){r=t+1;break}continue}n<0&&(o=!0,n=t+1),s===46?i<0?i=t:a!==1&&(a=1):i>-1&&(a=-1)}return i<0||n<0||a===0||a===1&&i===n-1&&i===r+1?``:e.slice(i,n)}function io(...e){let t=-1,n;for(;++t<e.length;)so(e[t]),e[t]&&(n=n===void 0?e[t]:n+`/`+e[t]);return n===void 0?`.`:ao(n)}function ao(e){so(e);let t=e.codePointAt(0)===47,n=oo(e,!t);return n.length===0&&!t&&(n=`.`),n.length>0&&e.codePointAt(e.length-1)===47&&(n+=`/`),t?`/`+n:n}function oo(e,t){let n=``,r=0,i=-1,a=0,o=-1,s,c;for(;++o<=e.length;){if(o<e.length)s=e.codePointAt(o);else if(s===47)break;else s=47;if(s===47){if(i!==o-1&&a!==1){if(i!==o-1&&a===2){if(n.length<2||r!==2||n.codePointAt(n.length-1)!==46||n.codePointAt(n.length-2)!==46){if(n.length>2){if(c=n.lastIndexOf(`/`),c!==n.length-1){c<0?(n=``,r=0):(n=n.slice(0,c),r=n.length-1-n.lastIndexOf(`/`)),i=o,a=0;continue}}else if(n.length>0){n=``,r=0,i=o,a=0;continue}}t&&(n=n.length>0?n+`/..`:`..`,r=2)}else n.length>0?n+=`/`+e.slice(i+1,o):n=e.slice(i+1,o),r=o-i-1}i=o,a=0}else s===46&&a>-1?a++:a=-1}return n}function so(e){if(typeof e!=`string`)throw TypeError(`Path must be a string. Received `+JSON.stringify(e))}var co={cwd:lo};function lo(){return`/`}function uo(e){return!!(typeof e==`object`&&e&&`href`in e&&e.href&&`protocol`in e&&e.protocol&&e.auth===void 0)}function fo(e){if(typeof e==`string`)e=new URL(e);else if(!uo(e)){let t=TypeError('The "path" argument must be of type string or an instance of URL. Received `'+e+"`");throw t.code=`ERR_INVALID_ARG_TYPE`,t}if(e.protocol!==`file:`){let e=TypeError(`The URL must be of scheme file`);throw e.code=`ERR_INVALID_URL_SCHEME`,e}return po(e)}function po(e){if(e.hostname!==``){let e=TypeError(`File URL host must be "localhost" or empty on darwin`);throw e.code=`ERR_INVALID_FILE_URL_HOST`,e}let t=e.pathname,n=-1;for(;++n<t.length;)if(t.codePointAt(n)===37&&t.codePointAt(n+1)===50){let e=t.codePointAt(n+2);if(e===70||e===102){let e=TypeError(`File URL path must not include encoded / characters`);throw e.code=`ERR_INVALID_FILE_URL_PATH`,e}}return decodeURIComponent(t)}var mo=[`history`,`path`,`basename`,`stem`,`extname`,`dirname`],ho=class{constructor(e){let t;t=e?uo(e)?{path:e}:typeof e==`string`||yo(e)?{value:e}:e:{},this.cwd=`cwd`in t?``:co.cwd(),this.data={},this.history=[],this.messages=[],this.value,this.map,this.result,this.stored;let n=-1;for(;++n<mo.length;){let e=mo[n];e in t&&t[e]!==void 0&&t[e]!==null&&(this[e]=e===`history`?[...t[e]]:t[e])}let r;for(r in t)mo.includes(r)||(this[r]=t[r])}get basename(){return typeof this.path==`string`?eo.basename(this.path):void 0}set basename(e){_o(e,`basename`),go(e,`basename`),this.path=eo.join(this.dirname||``,e)}get dirname(){return typeof this.path==`string`?eo.dirname(this.path):void 0}set dirname(e){vo(this.basename,`dirname`),this.path=eo.join(e||``,this.basename)}get extname(){return typeof this.path==`string`?eo.extname(this.path):void 0}set extname(e){if(go(e,`extname`),vo(this.dirname,`extname`),e){if(e.codePointAt(0)!==46)throw Error("`extname` must start with `.`");if(e.includes(`.`,1))throw Error("`extname` cannot contain multiple dots")}this.path=eo.join(this.dirname,this.stem+(e||``))}get path(){return this.history[this.history.length-1]}set path(e){uo(e)&&(e=fo(e)),_o(e,`path`),this.path!==e&&this.history.push(e)}get stem(){return typeof this.path==`string`?eo.basename(this.path,this.extname):void 0}set stem(e){_o(e,`stem`),go(e,`stem`),this.path=eo.join(this.dirname||``,e+(this.extname||``))}fail(e,t,n){let r=this.message(e,t,n);throw r.fatal=!0,r}info(e,t,n){let r=this.message(e,t,n);return r.fatal=void 0,r}message(e,t,n){let r=new it(e,t,n);return this.path&&(r.name=this.path+`:`+r.name,r.file=this.path),r.fatal=!1,this.messages.push(r),r}toString(e){return this.value===void 0?``:typeof this.value==`string`?this.value:new TextDecoder(e||void 0).decode(this.value)}};function go(e,t){if(e&&e.includes(eo.sep))throw Error("`"+t+"` cannot be a path: did not expect `"+eo.sep+"`")}function _o(e,t){if(!e)throw Error("`"+t+"` cannot be empty")}function vo(e,t){if(!e)throw Error("Setting `"+t+"` requires `path` to be set too")}function yo(e){return!!(e&&typeof e==`object`&&`byteLength`in e&&`byteOffset`in e)}var bo=(function(e){let t=this.constructor.prototype,n=t[e],r=function(){return n.apply(r,arguments)};return Object.setPrototypeOf(r,t),r}),xo=l(Xa(),1),So={}.hasOwnProperty,Co=new class e extends bo{constructor(){super(`copy`),this.Compiler=void 0,this.Parser=void 0,this.attachers=[],this.compiler=void 0,this.freezeIndex=-1,this.frozen=void 0,this.namespace={},this.parser=void 0,this.transformers=Qa()}copy(){let t=new e,n=-1;for(;++n<this.attachers.length;){let e=this.attachers[n];t.use(...e)}return t.data((0,xo.default)(!0,{},this.namespace)),t}data(e,t){return typeof e==`string`?arguments.length===2?(Eo(`data`,this.frozen),this.namespace[e]=t,this):So.call(this.namespace,e)&&this.namespace[e]||void 0:e?(Eo(`data`,this.frozen),this.namespace=e,this):this.namespace}freeze(){if(this.frozen)return this;let e=this;for(;++this.freezeIndex<this.attachers.length;){let[t,...n]=this.attachers[this.freezeIndex];if(n[0]===!1)continue;n[0]===!0&&(n[0]=void 0);let r=t.call(e,...n);typeof r==`function`&&this.transformers.use(r)}return this.frozen=!0,this.freezeIndex=1/0,this}parse(e){this.freeze();let t=ko(e),n=this.parser||this.Parser;return wo(`parse`,n),n(String(t),t)}process(e,t){let n=this;return this.freeze(),wo(`process`,this.parser||this.Parser),To(`process`,this.compiler||this.Compiler),t?r(void 0,t):new Promise(r);function r(r,i){let a=ko(e),o=n.parse(a);n.run(o,a,function(e,t,r){if(e||!t||!r)return s(e);let i=t,a=n.stringify(i,r);jo(a)?r.value=a:r.result=a,s(e,r)});function s(e,n){e||!n?i(e):r?r(n):t(void 0,n)}}}processSync(e){let t=!1,n;return this.freeze(),wo(`processSync`,this.parser||this.Parser),To(`processSync`,this.compiler||this.Compiler),this.process(e,r),Oo(`processSync`,`process`,t),n;function r(e,r){t=!0,Ya(e),n=r}}run(e,t,n){Do(e),this.freeze();let r=this.transformers;return!n&&typeof t==`function`&&(n=t,t=void 0),n?i(void 0,n):new Promise(i);function i(i,a){let o=ko(t);r.run(e,o,s);function s(t,r,o){let s=r||e;t?a(t):i?i(s):n(void 0,s,o)}}}runSync(e,t){let n=!1,r;return this.run(e,t,i),Oo(`runSync`,`run`,n),r;function i(e,t){Ya(e),r=t,n=!0}}stringify(e,t){this.freeze();let n=ko(t),r=this.compiler||this.Compiler;return To(`stringify`,r),Do(e),r(e,n)}use(e,...t){let n=this.attachers,r=this.namespace;if(Eo(`use`,this.frozen),e!=null){if(typeof e==`function`)s(e,t);else if(typeof e==`object`)Array.isArray(e)?o(e):a(e);else throw TypeError("Expected usable value, not `"+e+"`")}return this;function i(e){if(typeof e==`function`)s(e,[]);else if(typeof e==`object`){if(Array.isArray(e)){let[t,...n]=e;s(t,n)}else a(e)}else throw TypeError("Expected usable value, not `"+e+"`")}function a(e){if(!(`plugins`in e)&&!(`settings`in e))throw Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");o(e.plugins),e.settings&&(r.settings=(0,xo.default)(!0,r.settings,e.settings))}function o(e){let t=-1;if(e!=null){if(Array.isArray(e))for(;++t<e.length;){let n=e[t];i(n)}else throw TypeError("Expected a list of plugins, not `"+e+"`")}}function s(e,t){let r=-1,i=-1;for(;++r<n.length;)if(n[r][0]===e){i=r;break}if(i===-1)n.push([e,...t]);else if(t.length>0){let[r,...a]=t,o=n[i][1];Za(o)&&Za(r)&&(r=(0,xo.default)(!0,o,r)),n[i]=[e,r,...a]}}}}().freeze();function wo(e,t){if(typeof t!=`function`)throw TypeError("Cannot `"+e+"` without `parser`")}function To(e,t){if(typeof t!=`function`)throw TypeError("Cannot `"+e+"` without `compiler`")}function Eo(e,t){if(t)throw Error("Cannot call `"+e+"` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.")}function Do(e){if(!Za(e)||typeof e.type!=`string`)throw TypeError("Expected node, got `"+e+"`")}function Oo(e,t,n){if(!n)throw Error("`"+e+"` finished async. Use `"+t+"` instead")}function ko(e){return Ao(e)?e:new ho(e)}function Ao(e){return!!(e&&typeof e==`object`&&`message`in e&&`messages`in e)}function jo(e){return typeof e==`string`||Mo(e)}function Mo(e){return!!(e&&typeof e==`object`&&`byteLength`in e&&`byteOffset`in e)}var No=[],Po={allowDangerousHtml:!0},Fo=/^(https?|ircs?|mailto|xmpp)$/i,Io=[{from:`astPlugins`,id:`remove-buggy-html-in-markdown-parser`},{from:`allowDangerousHtml`,id:`remove-buggy-html-in-markdown-parser`},{from:`allowNode`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`allowElement`},{from:`allowedTypes`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`allowedElements`},{from:`className`,id:`remove-classname`},{from:`disallowedTypes`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`disallowedElements`},{from:`escapeHtml`,id:`remove-buggy-html-in-markdown-parser`},{from:`includeElementIndex`,id:`#remove-includeelementindex`},{from:`includeNodeIndex`,id:`change-includenodeindex-to-includeelementindex`},{from:`linkTarget`,id:`remove-linktarget`},{from:`plugins`,id:`change-plugins-to-remarkplugins`,to:`remarkPlugins`},{from:`rawSourcePos`,id:`#remove-rawsourcepos`},{from:`renderers`,id:`change-renderers-to-components`,to:`components`},{from:`source`,id:`change-source-to-children`,to:`children`},{from:`sourcePos`,id:`#remove-sourcepos`},{from:`transformImageUri`,id:`#add-urltransform`,to:`urlTransform`},{from:`transformLinkUri`,id:`#add-urltransform`,to:`urlTransform`}];function Lo(e){let t=Ro(e),n=zo(e);return Bo(t.runSync(t.parse(n),n),e)}function Ro(e){let t=e.rehypePlugins||No,n=e.remarkPlugins||No,r=e.remarkRehypeOptions?{...e.remarkRehypeOptions,...Po}:Po;return Co().use(Pi).use(n).use(Ja,r).use(t)}function zo(e){let t=e.children||``,n=new ho;return typeof t==`string`?n.value=t:``+t,n}function Bo(e,t){let n=t.allowedElements,r=t.allowElement,i=t.components,a=t.disallowedElements,o=t.skipHtml,s=t.unwrapDisallowed,c=t.urlTransform||Vo;for(let e of Io)Object.hasOwn(t,e.from)&&``+e.from+(e.to?"use `"+e.to+"` instead":`remove it`)+e.id;return Ra(e,l),ft(e,{Fragment:T.Fragment,components:i,ignoreInvalidStyle:!0,jsx:T.jsx,jsxs:T.jsxs,passKeys:!0,passNode:!0});function l(e,t,i){if(e.type===`raw`&&i&&typeof t==`number`)return o?i.children.splice(t,1):i.children[t]={type:`text`,value:e.value},t;if(e.type===`element`){let t;for(t in Pt)if(Object.hasOwn(Pt,t)&&Object.hasOwn(e.properties,t)){let n=e.properties[t],r=Pt[t];(r===null||r.includes(e.tagName))&&(e.properties[t]=c(String(n||``),t,e))}}if(e.type===`element`){let o=n?!n.includes(e.tagName):a?a.includes(e.tagName):!1;if(!o&&r&&typeof t==`number`&&(o=!r(e,t,i)),o&&i&&typeof t==`number`)return s&&e.children?i.children.splice(t,1,...e.children):i.children.splice(t,1),t}}}function Vo(e){let t=e.indexOf(`:`),n=e.indexOf(`?`),r=e.indexOf(`#`),i=e.indexOf(`/`);return t===-1||i!==-1&&t>i||n!==-1&&t>n||r!==-1&&t>r||Fo.test(e.slice(0,t))?e:``}var Ho={generatedAt:`2026-10-04T02:34:26.519Z`,label:`Commissioner's recaps`,recaps:[{id:`recap-1`,index:1,title:`GWB WEEK 1 RECAP: WE ARE SO BACK`,week:1,reconstructed:!1,bodyMarkdown:`🦬 GWB WEEK 1 RECAP: WE ARE SO BACK

Week 1 is officially in the books, and some of you came prepared to win a championship. Others apparently thought preseason extended another week.

Hairy Chest 199.39 — Joe Money Joe Problems 135.42
🚨 ASS-WHOOPING OF THE WEEK. Hairy Chest dropped 199.39 and missed 200 by literally one competent play. Joe Money didn't have Joe Problems — he had every possible problem. Getting Saquon, Jefferson, Burrow and company together just to lose by 64 points is impressive in its own way.

Buried by Toe Burrow 175.08 — Put em down Jeanty 158.17
Narking put up 158 and probably spent Sunday feeling pretty damn good about himself. Unfortunately, Josh Allen and company said, "That's adorable." 175.08 is nasty work. Put em down Jeanty instead got put down himself. 💀

BigBlue 171.70 — Lambs2Slaughter 111.88
The team name warned us. We just misunderstood who the lamb was. 🐑
BigBlue absolutely slaughtered Lambs2Slaughter by 59.82 points. Santagua scored the fewest points in GWB this week, so congratulations on securing the first early lead in the Sacko Power Rankings.

The Special One 138.69 — Isiah Polanco 119.43
Unfortunately, your defending champ opened the season by getting humbled. 😭
Powpeazy walks away 1-0 while Isiah Polanco begins the title defense 0-1. I'm calling this a ceremonial loss. Commissioner was clearly too busy organizing Detroit and preserving league tradition to actually manage his own football team.

Los Yajesitos 137.10 — ARC SIGNAGE CO LLC 124.51
NutCrusher did exactly enough. Nothing spectacular, nothing historic — just walked into work, punched the clock, beat Crooke by 12.59, and went home. ARC SIGNAGE CO LLC may need to spend less time making signs and more time reading them because this one said L from the beginning.

……… 133.22 — 3.0.4 129.13
😂 Manny's team DOESN'T EVEN HAVE A NAME and still won.
This was the week's true sicko matchup. AltaDei lost by only 4.09 points, meaning he gets to spend the next six days replaying every lineup decision and wondering which meaningless 4th-quarter catch ruined his life. Meanwhile Manny is 1-0 using punctuation as a franchise identity.

🏆 WEEK 1 GWB AWARDS
👑 King of the Week: Hairy Chest — 199.39. One point away from dropping 200. Everybody check your schedule and pray.
🪦 Body Bag Award: Joe Money Joe Problems. Lost by 63.97. There will be no further questions at this time.
🐑 Sacko Watch Leader: Lambs2Slaughter — 111.88. Lowest score in the league. Somebody has to be first.
😩 "I Would've Beaten Most Teams" Award: Put em down Jeanty — 158.17. Third-highest score in the league. Still 0-1. Fantasy football is a beautiful, stupid game.
🤏 Heartbreak of the Week: 3.0.4. Lost by 4.09 to a team whose name is literally ………
🏅 Commissioner Accountability Award: Me — 119.43. Hosted Detroit. Defending champion. Auto-drafted. Started 0-1. The Eric propaganda machine is about to have a FIELD DAY. 😂

After one week: Hairy Chest looks terrifying, BigBlue came out swinging, Manny somehow keeps getting away with this shit, and the defending champ has officially given the peasants hope.
Week 2: overreactions are now mandatory.`,label:`Final`,postedAt:`2026-09-08`},{id:`recap-2`,index:2,title:`GWB WEEK 2 PREDICTIONS — THE CRYSTAL BALL EDITION`,week:2,reconstructed:!0,bodyMarkdown:`🔮🦬 GWB WEEK 2 PREDICTIONS — THE CRYSTAL BALL EDITION

Week 1 is in the books.

Steven dropped 199.39 and immediately became the problem.

Everybody else?

Time to find out who was real and who just got lucky.

The crystal ball has been consulted.

The spreadsheets have been threatened.

Here are the official Week 2 predictions.

⸻

🧠 MATT vs STEVEN

Matt's squad vs the 199-point monster.

Steven just put up the highest Week 1 score this league has seen in a while, and now Matt has to walk into that buzzsaw with Josh Allen and Gibbs.

But the ball says: regression is coming.

**PICK: Matt over Steven, 52/48.**

Why? Because nobody scores 199 twice in a row. Nobody.

⸻

😈 CROOKE vs HADI

El Campeon vs the Instagram department.

Hadi's team is solid. Crooke's team is… a content strategy.

But the crystal ball sees something brewing.

**PICK: Crooke over Hadi, 64/36.**

Bold? Yes. But 64/36 isn't a guess — it's a vibe.

⸻

🐍 MAURICIO vs NARKING

The Yajesitos vs the self-proclaimed 4X champ.

Mauricio already burned his Mulligan in Week 1 — it barely worked, but he got the win.

Narking is still holding his chip and reminding everyone about 28% of league history.

**PICK: Mauricio over Narking, 54/46.**

⸻

👑 KAYSER vs DANNY

The Special One vs Lambs2Slaughter.

Kayser's been quiet. Too quiet.

Danny's been loud. Too loud.

**PICK: Kayser over Danny, 59/41.**

⸻

💀 FRANKIE vs ERIC

Joe Money vs the 3.0.4 experiment.

Frankie's team has names. Eric's team has… vibes and Amon-Ra.

**PICK: Frankie over Eric, 53/47.**

⸻

⚖️ JAMIL vs MANNY

The Constitution Department vs the anonymous corporation.

Jamil's squad looked legit in Week 1.

Manny's looked… corporate.

**PICK: Jamil over Manny, 63/37.**

⸻

💣 NUKE OF THE WEEK

**Josh Allen — 33+ fantasy points.**

When Matt needs it most, Allen goes thermonuclear.

Book it.

⸻

😴 SLEEPER OF THE WEEK

**Jalen Coker.**

Nobody's talking about him.

Everybody will be by Monday.

⸻

🎲 UPSET SPECIAL

**Narking over Mauricio.**

The 4X champ reminds everyone why the trophy case exists.

⸻

🦬 FINAL WORD

Six matchups.

Six predictions.

Zero accountability if they're wrong.

The crystal ball has spoken.

See you Friday.

🦬🔮`,label:`Predictions`,postedAt:`2026-09-17`},{id:`recap-3`,index:3,title:`GWB FRIDAY MORNING REPORT — THURSDAY LEFT BODIES (Week 2)`,week:2,reconstructed:!0,bodyMarkdown:`🦬🏈 GWB FRIDAY MORNING REPORT — THURSDAY LEFT BODIES

Thursday night happened.

Buffalo 41, Detroit 31.

And four GWB managers woke up Friday morning in very different moods.

⸻

🧠 MATT — 77.72 BEFORE SUNDAY

Josh Allen.

5 touchdowns.

James Cook eating.

Matt is sitting at 77.72 points and Sunday hasn't even started.

The Nuke of the Week prediction?

Currently loading…

😂

Steven hasn't played a single snap yet and he's already chasing 78 points.

Good luck, 199-point monster.

Regression is knocking.

⸻

🧪 ERIC — 44.00

Amon-Ra St. Brown did Amon-Ra things on Thursday night.

44.00 points in the bank before the weekend.

Eric — the man whose draft had everyone confused — is holding a 44-point head start over Frankie.

The 3.0.4 experiment continues to defy explanation.

⸻

🐍 NARKING — 27.80

Kincaid and James Williams combined for 27.80.

Not terrifying.

Not nothing.

Mauricio hasn't scored yet, so Narking holds the early edge.

The 4X champ is in position.

⸻

🏢 MANNY — 22.90 vs JAMIL — 7.00

James Cook gave Manny 22.90 on Thursday.

Jamil's Thursday entry?

7.00.

Early lead: anonymous corporation.

But there's a whole Sunday left, and Jamil's roster has Puka, DeVonta, and Kenneth Walker waiting.

This one's far from over.

⸻

👑 KAYSER — 17.20

LaPorta chipped in 17.20 for The Special One.

Quiet. Professional. Kayser-like.

Danny hasn't started yet.

⸻

🏆 HADI vs CROOKE — 0 to 0

Nobody played Thursday.

El Campeon vs the Instagram department starts fresh Sunday.

⸻

📝 TRANSACTION WIRE

Kayser added Raheim Sanders.

Crooke added Kalif Raymond and dropped Travis Hunter.

The wire is already moving and it's only Friday.

⸻

🦬 FINAL WORD

Matt's holding 77.72.

Eric's holding 44.00.

Everybody else is holding hope.

Sunday decides everything.

🦬`,label:`Thursday`,postedAt:`2026-09-19`},{id:`recap-4`,index:4,title:`GWB SUNDAY MORNING CHECK-IN (Week 2)`,week:2,reconstructed:!0,bodyMarkdown:`☀️🦬 GWB SUNDAY MORNING CHECK-IN

Coffee's brewing.

Lineups lock soon.

Here's where all six matchups stand before the Sunday slate.

⸻

🧠 MATT 77.72 vs STEVEN 0

The biggest head start of the week.

Matt's sitting on 77.72 from Thursday's Buffalo explosion.

Steven hasn't played a snap.

The 199-point monster needs a monster Sunday just to get back in it.

⸻

🧪 ERIC 44.00 vs FRANKIE 0

Amon-Ra's Thursday night gives Eric a 44-point cushion.

Frankie needs Joe Money energy today.

Desperately.

⸻

🐍 NARKING 27.80 vs MAURICIO 0

Small edge for the 4X champ.

Mauricio's entire squad plays today.

Still anyone's game.

⸻

🏢 MANNY 22.90 vs JAMIL 7.00

Cook gave Manny the early edge.

Jamil's big guns all play Sunday.

Don't let the 15-point gap fool you — this one's live.

⸻

👑 KAYSER 17.20 vs DANNY 0

LaPorta's 17.20 has Kayser up early.

Danny's squad is fully rested and fully capable of ruining that.

⸻

🏆 HADI 0 vs CROOKE 0

Fresh start.

El Campeon vs Darkseid-before-he-was-Darkseid.

Nobody has an excuse in this one.

⸻

📝 LAST-MINUTE MOVES

Danny swapped kickers — Santos is in.

Crooke added Tyreek Hill and dropped Gadsden.

⸻

🚑 INJURY WATCH

Burrow — questionable (back).

Olave — questionable (hammy).

Puka — questionable (hip), and he's on Monday night, so Jamil's going to be sweating until the very end.

⸻

🦬 FINAL WORD

Six matchups.

Zero decided.

Set your lineups, check the inactives, and pray to the fantasy gods.

See you on the other side.

🦬`,label:`Sunday`,postedAt:`2026-09-21`},{id:`recap-5`,index:5,title:`GWB MONDAY MORNING REPORT — THE MULLIGAN FINALLY HAS A POSTER CHILD (Week 2)`,week:2,reconstructed:!1,bodyMarkdown:`🦬🏈 GWB MONDAY MORNING REPORT — THE MULLIGAN FINALLY HAS A POSTER CHILD

Week 2 was supposed to be about the undefeated teams.

It's now about the Mulligan.

And Manny just used his to turn a loss into a win.

Let me explain why the entire league should be terrified.

⸻

🎰 THE MULLIGAN — FROM GIMMICK TO WEAPON

Remember the rule?

Once per season, you can swap one player's score for another player's score. Same week. No take-backs.

Mauricio used his in Week 1.

Won his matchup.

Probably didn't need it.

Manny just used his in Week 2.

And brother…

HE ABSOLUTELY NEEDED IT.

⸻

🏢 Manny 142.49 — Jamil 138.89

Wait.

That's the score WITH the Mulligan?

No.

Let me show you the crime scene.

BEFORE THE MULLIGAN:

Manny was LOSING.

Caleb Williams gave him:

8.45 points.

In a 6-point-per-passing-TD league.

That's not a bad start.

That's a quarterback actively working against you.

😭

So Manny reaches into the bag…

pulls out the Mulligan chip…

and swaps:

❌ Caleb Williams — 8.45
✅ Patrick Mahomes — 45.29

Net gain:

+36.84 POINTS.

Final:

Manny 142.49
Jamil 138.89

Margin:

3.60 points.

😭😭😭

Jamil lost by less than a field goal…

to a quarterback who wasn't even in Manny's lineup on Sunday morning.

THE MULLIGAN JUST DECIDED A MATCHUP.

⸻

MULLIGAN GRADE: A++++

This is the first time the Mulligan has been:

✅ Used correctly
✅ Used necessarily
✅ Used lethally

Mauricio's Week 1 Mulligan?

Won anyway. Unclear if it mattered.

Manny's Week 2 Mulligan?

WITHOUT IT: LOSS.
WITH IT: 142.49 — WIN.

That's a 36.84-point swing in a 3.60-point game.

The Mulligan didn't just help.

The Mulligan WAS the win.

⸻

⚖️ JAMIL'S PRESS CONFERENCE (IMAGINED)

Jamil scored 138.89.

That's a good score.

And he lost…

to a quarterback swap.

You have to respect the absurdity.

The Constitution Department is expected to file a formal complaint.

Something about "competitive integrity."

Something about "the spirit of the rule."

Jamil, my brother…

the rule is the rule.

😂

⸻

AND THEN THERE'S THE REST OF SUNDAY

While everyone was watching the Mulligan heist, actual football happened.

⸻

🐍 Narking 131.93 — Mauricio 90.36

Narking gets his first win.

Mauricio…

90.36.

In a league where Steven scored 199 last week.

That's not a score.

That's a cry for help.

😭

Mauricio used his Mulligan in Week 1.

So there's no lifeline coming.

The Yajesitos fall to 1-1 and this week was UGLY.

⸻

🧪 Eric 142.69 — Frankie 105.17

Eric is 2-0.

Let me repeat that.

ERIC. IS. 2-0.

The man who drafted like he was playing a different sport is currently undefeated.

Amon-Ra did the heavy lifting Thursday with the 44.00 head start.

Frankie falls to 0-2.

Joe Money is currently Joe Problems.

⸻

🌙 MONDAY NIGHT LEFTOVERS

Three matchups still live.

⸻

🧠 MATT 125.42 vs STEVEN 119.23

Steven needs:

6.2 points from Kyren Williams.

That's it.

Monday night.

6.2 points.

If Kyren gets hurt on the first drive…

we riot.

😂

Matt is SO close to handing Steven his first loss.

But 6.2 points is nothing.

Steven should survive.

Probably.

⸻

🐑 DANNY 142.96 vs KAYSER 126.10

Danny is DONE at 142.96.

Kayser has:

Matthew Stafford — Monday night.

Needs:

16.87 points.

In a 6-PT passing TD league?

That's… very doable.

Danny scored 142.96 — one of the highest scores of the week — and might still lose.

FANTASY FOOTBALL IS CRUEL.

😭

⸻

🏆 HADI 124.54 vs CROOKE 123.65

The closest one.

Crooke trails by:

0.89 points.

And he still has:

🔥 Cam Skattebo
🛡️ Rams D/ST

Monday night.

Hadi is done at 124.54.

Crooke needs less than a point from Skattebo + Rams D.

Less than ONE point.

If Crooke loses this…

delete the app.

😂

⸻

🎰 MULLIGAN POWER RANKINGS

1. Manny — actually used it to win. The gold standard.
2. Mauricio — used it Week 1. Can't use it again. Watching everyone else have fun.
3. Everyone else — holding their chips like poker players.

⸻

👀 WHAT MONDAY NIGHT DECIDES

- Does Steven stay undefeated? (Probably, but 6.2 points is 6.2 points.)
- Does Kayser steal one from Danny with a Stafford Monday night? (16.87 needed.)
- Does Crooke finally win a game? (0.89 needed. ZERO POINT EIGHT NINE.)

⸻

🦬 FINAL WORD

Manny turned a loss into a win with a bench quarterback.

Jamil lost by 3.60 to a rule.

Mauricio scored 90.36 and has no Mulligan left.

Eric is 2-0 and nobody knows how.

And Crooke needs 0.89 points tonight.

Monday night.

Three matchups.

One Mulligan already in the history books.

🦬`,label:`Monday Morning`,postedAt:`2026-09-22T14:00:00Z`},{id:`recap-6`,index:6,title:`GWB WAIVER WIRE REPORT CARD — WEEK 2`,week:2,reconstructed:!1,bodyMarkdown:`💰🦬 GWB WAIVER WIRE REPORT CARD — WEEK 2

The wire has been worked.

Some managers shopped like professionals.

Some managers shopped like they were blackout drunk.

Here are the official grades.

⸻

🅰️ Frankie — GRADE: A

Frankie lands:

✅ Devaughn Vele
✅ Devin Singletary

Vele is a real WR target earner.

Singletary is a real RB with a real role.

For an 0-2 team, these are exactly the kinds of moves you need to make.

No panic.

No chaos.

Just competent shopping.

WAIVER WINNER OF THE WEEK.

⸻

🅰️ Danny — GRADE: A

Danny grabs:

✅ Dontayvion Wicks
✅ 49ers D/ST

Wicks is a legitimate flex lottery ticket.

The 49ers defense is a legitimate streaming defense.

Danny addressed actual roster needs instead of chasing ghosts.

STREAMING DONE RIGHT.

⸻

🅰️➖ Eric — GRADE: A-

Eric picks up:

✅ Denzel Boston

This is the lottery ticket of the week.

If Boston hits, Eric looks like a genius.

If he doesn't, it cost nothing.

LOTTERY TICKET OF THE WEEK.

⸻

🅱️➕ Mauricio — GRADE: B+

Mauricio adds:

✅ Bryce Young
✅ Evan McPherson
✅ Buccaneers D/ST

And in classic Mauricio fashion, dropped Jonah Coleman…

then re-added Jonah Coleman.

😂

The moves themselves are fine.

Bryce is a real QB2.

McPherson is a real kicker.

Bucs D is streamable.

But the Coleman hokey-pokey cost him style points.

MOST ADDICTED TO THE WIRE.

⸻

🅱️ Matt — GRADE: B

Matt adds:

✅ Kenyon Sadiq

Tight end depth.

Smart.

Boring.

Effective.

The most Matt pickup imaginable.

⸻

🅲➕ Narking — GRADE: C+

Narking stashes:

✅ Kyle Williams

Deep bench stash.

Might be something in a month.

Might be nothing forever.

The 4X champ is playing chess while everyone else plays checkers.

Or he's just holding a lottery ticket.

Either way: C+.

⸻

😴 NO CLAIMS

Hadi — stood pat.

Steven — stood pat.

Crooke — stood pat.

Kayser — stood pat.

Jamil — stood pat.

Sometimes the best move is no move.

Sometimes it's just laziness.

We report. You decide.

⸻

❓ Manny

Manny dropped Pacheco…

and added NOBODY.

?????

The anonymous corporation made a subtraction without an addition.

Bold strategy.

Let's see if it pays off.

⸻

🏆 WEEK 2 WAIVER AWARDS

💰 Waiver Winner: Frankie — Vele + Singletary

🎲 Lottery Ticket: Eric — Denzel Boston

🌊 Streaming Master: Danny — 49ers D

🤓 Most Matt Pickup: Matt — Kenyon Sadiq

📱 Most Addicted: Mauricio — the Coleman hokey-pokey

⸻

🦬 FINAL WORD

Frankie shopped the best.

Eric gambled the smartest.

Mauricio couldn't stop clicking buttons.

And Manny dropped a running back for the aesthetic.

Week 3 waivers are next.

Spend responsibly.

🦬💰`,label:`Waivers`,postedAt:`2026-09-16`},{id:`recap-7`,index:7,title:`GWB MULLIGAN WATCH — MONDAY NIGHT EDITION (Week 2)`,week:2,reconstructed:!1,bodyMarkdown:`🚨🦬 GWB MULLIGAN WATCH — MONDAY NIGHT EDITION

Three matchups go to Monday night.

Four managers still holding their Mulligan chips.

And at least one of them is absolutely going to do something reckless.

This is your official Mulligan Watch.

⸻

🚨 ALERT #1 — Jamil

Jamil could COUNTER-Mulligan.

Puka Nacua is questionable.

If Puka sits or limps through Monday night, Jamil could swap him for Mayer.

He'd need roughly 9 points from the swap to flip his matchup with Manny.

DEFCON 1.

The Constitution Department does not lose quietly.

⸻

🚨 ALERT #2 — Crooke

Crooke trails Hadi by 0.89 points.

ZERO POINT EIGHT NINE.

And he's staring at his lineup thinking the unthinkable:

Mulligan Lamar… for Jaxson Dart?

High-risk casino behavior.

If it works, he's a legend.

If it doesn't, he burned his once-a-season chip to lose by more.

The Instagram department is considering all options.

⸻

🚨 ALERT #3 — Matt

Matt is looking at DJ Moore's line:

-0.10 points.

NEGATIVE.

And Malachi Fields is sitting right there.

This Mulligan is very, VERY real.

DJ Moore → Malachi Fields.

It's the kind of move the spreadsheet was built for.

⸻

🚨 ALERT #4 — Danny

Danny could Mulligan Dobbins (3.6) for Corum.

Break glass only.

Danny's in a hole against Kayser and needs a miracle, not a marginal swap.

But desperate managers do desperate things.

⸻

📊 CHIPS ALREADY CASHED

Mauricio — Week 1. Gone.

Manny — Week 2. Used to beat Jamil. The gold standard.

⸻

🏆 MULLIGAN POWER RANKINGS (MONDAY NIGHT EDITION)

1. Jamil — counter-Mulligan threat is real. DEFCON 1.
2. Matt — DJ Moore's -0.10 is begging for it.
3. Crooke — 0.89 points down. Casino is open.
4. Danny — break glass only.

⸻

🦬 FINAL WORD

Four chips.

Three matchups.

One Monday night.

Somebody's about to become a hero.

Somebody else is about to become a cautionary tale.

Watch the wire. Watch the inactives.

And for the love of God, nobody pull a negative Mulligan.

🦬🎰`,label:`Monday Night`,postedAt:`2026-09-23T01:00:00Z`},{id:`recap-8`,index:8,title:`GWB WEEK 2 FINAL REPORT — MULLIGANS, MONDAY NIGHT MURDERS & THREE UNDEFEATED TEAMS`,week:2,reconstructed:!1,bodyMarkdown:`🦬🏈 GWB WEEK 2 FINAL REPORT — MULLIGANS, MONDAY NIGHT MURDERS & THREE UNDEFEATED TEAMS

Week 2 is OVER.

Monday night decided everything.

And we now have THREE undefeated teams, THREE winless teams, and the first FAILED Mulligan in league history.

Let's get into it.

⸻

🏢 Manny 183.99 — Jamil 138.89

The Mulligan game.

Final answer.

Manny's Mahomes swap (+36.84) flipped a loss into a win.

But here's the part nobody's talking about:

Davante Adams went for 41.5.

FORTY-ONE AND A HALF.

So even WITHOUT the Mulligan, Manny probably wins this thing.

The Mulligan made it official. Davante made it unnecessary.

Either way:

Manny — 2-0.

Jamil — 1-1.

And the Constitution Department's complaint has been filed, stamped, and ignored.

⸻

👑 Kayser 170.91 — Danny 142.96

Danny is DONE at 142.96.

Kayser needs 16.87 from Stafford on Monday night.

Stafford delivers.

Something like 45 points.

😭

Kayser 170.91.

Danny 142.96.

Danny scored the 4th-most points of the week…

and lost.

0-2.

The Special One's only statement:

"Got the dub."

Bond villain behavior.

😂

⸻

🏆 HADI 151.04 — Crooke 123.65

Crooke needed 0.89 points from Skattebo + Rams D.

ZERO POINT EIGHT NINE.

And somehow…

he lost by 27.39.

😭😭😭

I don't know what happened on Monday night.

I don't want to know.

Hadi moves to 1-1.

Crooke falls to 0-2.

El Campeon survives.

⸻

👑 Steven 134.93 — Matt 130.52

Steven needed 6.2 from Kyren.

Kyren delivered.

Steven survives, 134.93 to 130.52.

2-0.

But the REAL story:

Matt looked at DJ Moore's -0.10…

and pulled the Mulligan trigger.

❌ DJ Moore — (-0.10)
✅ Malachi Fields

And STILL lost.

By 4.41 points.

😭

The first FAILED Mulligan in GWB history.

The chip is gone.

The loss is permanent.

Matt's week:

✅ Used the Mulligan correctly
✅ Improved his score
❌ Lost anyway

Steven's response to the entire situation:

"Hi 👋"

2-0. Unbothered. Terrifying.

⸻

🧪 Eric 142.69 — Frankie 105.17

Eric. 2-0.

Still undefeated.

Still unexplained.

Frankie. 0-2.

Joe Money has become Joe Problems.

⸻

🐍 Narking 131.93 — Mauricio 99.76

Narking evens out at 1-1.

Mauricio's 99.76 is the lowest score of the week.

The 4X champ would like everyone to know this proves something.

⸻

📊 FINAL WEEK 2 SCORING

🥇 Manny — 183.99
🥈 Kayser — 170.91
🥉 Hadi — 151.04
4. Danny — 142.96
5. Eric — 142.69
6. Jamil — 138.89
7. Steven — 134.93
8. Narking — 131.93
9. Matt — 130.52
10. Crooke — 123.65
11. Frankie — 105.17
12. Mauricio — 99.76

⸻

🏆 THE UNDEFEATED CLUB (2-0)

Steven — Hairy Chest

Manny — ………

Kayser — The Special One

Three teams.

Zero losses.

One of them used a Mulligan to get there.

⸻

💀 THE WINLESS CLUB (0-2)

Danny — Lambs2Slaughter

Crooke — ARC SIGNAGE CO LLC (for now)

Frankie — Turn Your Head And Goff (soon)

⸻

🎰 2026 MULLIGAN LEDGER

Mauricio — Week 1 — ✅ Won (questionable necessity)

Manny — Week 2 — ✅ Won (the gold standard, +36.84)

Matt — Week 2 — ❌ Lost (first FAILED Mulligan)

⸻

👀 EARLY WEEK 3 LEANS

Kayser vs Manny — undefeated board meeting. **Lean: Manny 54%.**

Hadi vs Danny — El Campeon vs the winless. **Lean: Hadi 56%.**

Narking vs Crooke — somebody's getting right. **Lean: Narking 52%.**

Mauricio vs Steven — Daniels is hurt for Steven. **Lean: Mauricio 53%.**

Matt vs Eric — the spreadsheet vs the vibes. **Lean: Matt 58%.**

Jamil vs Frankie — **Lean: Jamil 59%.**

⸻

🦬 FINAL WORD

Three teams undefeated.

Three teams winless.

One Mulligan worked perfectly.

One Mulligan failed historically.

And Steven is still just saying "Hi 👋" while beating everyone.

Week 3 starts now.

🦬🔥`,label:`Final`,postedAt:`2026-09-23T18:00:00Z`},{id:`recap-9`,index:9,title:`GWB WEEK 3 POST-WAIVER UPDATE — EVERYBODY WENT SHOPPING`,week:3,reconstructed:!1,bodyMarkdown:`💰🦬 GWB WEEK 3 POST-WAIVER UPDATE — EVERYBODY WENT SHOPPING

Waivers cleared.

Everybody ate.

Some people ate well.

Some people ate the receipt.

Here are the official grades.

⸻

👑 Kayser — GRADE: A-

Kayser adds:

✅ Keon Coleman
✅ Tank Bigsby
✅ Zach Ertz
✅ Panthers D/ST

Four moves.

All reasonable.

The Special One is quietly building depth while sitting at 2-0.

Nobody notices Kayser making moves.

Everybody notices Kayser winning.

⸻

🏢 Manny — GRADE: A

Manny lands:

✅ Adonai Mitchell
✅ Gadsden
✅ McLaughlin

Mitchell is the prize here — real upside, real role potential.

The anonymous corporation continues to operate efficiently.

2-0 and shopping like it.

⸻

🧠 Matt — GRADE: A-

Matt makes the swap:

✅ Tre Tucker IN
❌ Malachi Fields OUT

Fields served his purpose (the Mulligan, may it rest in peace).

Tucker is the new lottery ticket.

The spreadsheet has processed the transaction.

⸻

😈 Crooke — GRADE: B+

Crooke moves:

✅ Darren Waller IN
❌ Tyreek Hill OUT

Waller unretired and immediately became a fantasy-relevant tight end.

That's a genuinely good pickup.

The Instagram department occasionally does football.

⸻

🐑 Danny — GRADE: B

Danny adds:

✅ Rashod Bateman
✅ Trey Smack

Fine.

Boring.

Fine.

Danny's 0-2 and needs more than fine, but at least the roster is moving.

⸻

🚨 Frankie — GRADE: C+

Frankie:

✅ Dalton Schultz IN
❌ Marvin Harrison Jr. DROPPED

Let me repeat that.

FRANKIE DROPPED MARVIN HARRISON JR.

A first-round NFL draft pick.

A generational prospect.

Dropped.

For Dalton Schultz.

😭

And it gets worse.

Frankie's FAILED claims this week:

❌ Darren Waller
❌ Jake Ferguson
❌ Pat Freiermuth
❌ Tre Tucker
❌ Adonai Mitchell

Five swings.

Five misses.

THE RECEIPT HAS BEEN PRINTED.

⸻

👶 Mauricio — GRADE: C

Mauricio:

✅ Kirk Cousins IN
❌ Justin Herbert OUT

He rage-dropped Justin Herbert.

For Kirk Cousins.

On a 24-hour lease, apparently.

Because the very next day, Cousins was gone too.

😭

This is what a newborn does to a man.

No sleep.

No judgment.

Just vibes and waiver claims.

CONFUSING MOVE OF THE WEEK.

⸻

😴 NO MOVES

Hadi — stood pat.

Eric — stood pat.

Narking — holding waiver #1 and said "Nah. My team is nice."

Steven — added Daniel Jones as Jayden Daniels insurance, then dropped him, then added Darnold. The QB speed-dating saga.

⸻

🏆 WEEK 3 WAIVER AWARDS

💰 Winner: Manny — Adonai Mitchell

🧾 Receipt of the Week: Frankie — dropping MHJ

😵‍💫 Most Confusing: Mauricio — the Herbert rage drop

⸻

📊 STANDINGS INTO WEEK 3

2-0

Steven — 334.32 PF
Manny — 317.21
Kayser — 309.60

1-1

Jamil — 310.59
Matt — 305.60
Narking — 290.10
Eric — 271.82
Hadi — 270.47
Mauricio — 236.86

0-2

Danny — 254.84
Crooke — 248.16
Frankie — 240.59

⸻

🦬 FINAL WORD

Manny shopped the best.

Frankie dropped a star and missed on five replacements.

Mauricio is making moves on no sleep.

And Narking is holding waiver #1 like it's a family heirloom.

Week 3 is here.

🦬💰`,label:`Waivers`,postedAt:`2026-09-24`},{id:`recap-10`,index:10,title:`GWB SATURDAY NIGHT REPORT — TOMORROW WE FIND OUT WHO'S REAL (Week 3)`,week:3,reconstructed:!1,bodyMarkdown:`🌙🦬 GWB SATURDAY NIGHT REPORT — TOMORROW WE FIND OUT WHO'S REAL

Thursday night is done.

Waivers are done.

Lineups are almost locked.

Tomorrow we find out who's real.

⸻

📊 THURSDAY NIGHT SCOREBOARD

Steven — 43.90

After the Daniel Jones speed-dating saga (added, dropped, replaced by Sam Darnold), Steven's Thursday started with Darnold delivering 43.90.

The 199-point monster is already on the board.

Eric — 30.40 vs Matt — 24.50

Early edge to Eric in a matchup that matters for the 2-1 club.

Danny — 22.60 vs Hadi — 0

Danny's got 22.60 in the bank.

Hadi hasn't started.

El Campeon is coming from behind.

⸻

🧾 THE MARVIN HARRISON JR. SITUATION

Frankie dropped MHJ.

Let that sink in.

Narking claimed him.

And I quote:

"The fantasy gods are watching."

😭

Frankie vs the receipt — Round 1 starts tomorrow.

MHJ in a Narking uniform.

This is either the steal of the season or the funniest false hope ever sold.

⸻

🚨 FRANKIE'S OTHER MOVE

Frankie added Xavier Worthy.

And he's STARTING him.

0-2, desperate, throwing Worthy into the lineup.

The Frankie Zone is in full survival mode.

⸻

👶 MAURICIO'S QUARTERBACK CAROUSEL

Cousins in.

Cousins out.

24-hour lease, expired.

Kaleb Johnson in.

Mauricio is managing his roster the way he manages sleep right now:

in fragments, with no plan, hoping for the best.

😂

⸻

🔥 THE UNDEFEATED BOARD MEETING

Kayser vs Manny.

2-0 vs 2-0.

Somebody's leaving Sunday with their first loss.

The Special One vs the anonymous corporation.

This is the matchup of the week and it's not close.

⸻

🚑 PUKA WATCH

Puka Nacua is doubtful.

Jamil's entire Sunday might hinge on a hip.

The Constitution Department has been put on notice.

⸻

🔮 SATURDAY NIGHT PICKS

Hadi over Danny — 53/47

Narking over Crooke — 53/47

Matt over Eric — 55/45

Manny over Kayser — 54/46

Steven over Mauricio — 58/42

Jamil over Frankie — 53/47

⸻

🦬 FINAL WORD

Steven's already at 43.90.

Frankie dropped a star and is starting a rookie.

Mauricio's QB lasted one day.

And Puka's hip holds Jamil's Sunday hostage.

Tomorrow, we find out who's real.

Sleep well. Set your alarms. Check the inactives.

🦬🌙`,label:`Saturday`,postedAt:`2026-09-28T02:00:00Z`},{id:`recap-11`,index:11,title:`GWB MONDAY NIGHT REPORT — TWO MATCHUPS LEFT, MULTIPLE RECEIPTS READY (Week 3)`,week:3,reconstructed:!1,bodyMarkdown:`🌙🦬 GWB MONDAY NIGHT REPORT — TWO MATCHUPS LEFT, MULTIPLE RECEIPTS READY

Sunday is over.

Most of Week 3 has been decided.

And before Eagles–Bears tonight, we have exactly two live GWB matchups remaining.

Everybody else?

The coroner has already signed the paperwork.

⸻

👑 Steven 188.39 — Mauricio 123.90

Remember Steven's QB crisis?

Jayden Daniels hurt.

Daniel Jones picked up.

Daniel Jones dropped.

Sam Darnold picked up.

Yesterday Steven:

"Thank you Jamil for Sam Darnold 💪💪💪"

😂

Final result:

188.39.

Highest score of the week so far.

Steven is about to move to 3-0 and has scored:

Week 1: 199.39
Week 2: 134.93
Week 3: 188.39

That's 522.71 points through three weeks.

This man isn't winning matchups.

He's running up the score and then communicating exclusively through stickers and "Hi 👋".

Meanwhile Mauricio spent Sunday doing something considerably more important:

WELCOME TO THE FATHERHOOD CLUB BROTHER ❤️

The man disappeared, came back from the hospital with a newborn, immediately complained that the kid shits every 10 minutes and doesn't sleep.

Congratulations 😂

Danny gave him the correct advice:

"You have a small network of fathers who have all went through a lot of it."

Narking:

"It gets harder."

Very inspirational group.

😭

Fantasy loss gets a complete pass this week.

⸻

😈 Crooke 167.66 — Narking 136.70

Ladies and gentlemen…

CROOKE HAS WON A FOOTBALL GAME.

🚨🚨🚨

Not an Instagram impression.

Not a Reel view.

Not Meta engagement.

An ACTUAL FANTASY MATCHUP.

And he celebrated the occasion by finally renaming the franchise:

DARKSEID JACKSON

Honestly?

Massive upgrade over ARC SIGNAGE CO LLC.

😂

And the matchup had EVERYTHING.

Narking at 3:21:

"using my mulligan to swap Achane for Etienne."

Kayser immediately puts on the four-time-championship robe:

"With all due respect ::4 time champ:: why would you do the change now…"

😭😭😭

Kayser's entire argument:

YOU PULLED THE TRIGGER TOO EARLY.

Narking:

"Trust the process."

Kayser:

basically "No."

Eventually Narking:

"You are right bro. I did it too early."

And THEN:

"4 Time Champ"
"4"
"Times"

😂😂😂

The actual Mulligan math:

Achane: 1.7
Etienne: 9.0

So the Mulligan DID gain Narking:

+5.3 points.

Problem?

Crooke won by:

30.96.

😭

The Mulligan was the equivalent of throwing a bucket of water at a house fire.

Useful.

Technically.

Did absolutely nothing.

⸻

💀 AND THEN THERE'S MARVIN HARRISON JR.

Frankie dropped him.

Narking claimed him.

Frankie immediately said:

"Bold move, Cotton. I hope MHJ also brings you false sense of hope."

MHJ Week 3:

7.0 points.

💀

Frankie currently wins Round 1 of the Receipt War.

Narking told him:

"If it works out, I look forward to AI Hadi coming for your neck for that drop lol"

Brother…

AI Hadi checked the box score.

Neck temporarily safe.

😂

⸻

🏆 Kayser 151.93 — Manny 129.68

THE UNDEFEATED BOARD MEETING HAS CONCLUDED.

Kayser survives.

3-0.

Manny falls to 2-1.

And this is absolutely devastating news for Narking because he has spent the last week campaigning for Kayser's deportation back to the Bottom 6.

Kayser previously admitted:

"I will be there in due time, for now I enjoy."

Well…

He's still enjoying.

😂

The Special One is legitimately becoming a problem.

Jonathan Taylor.

Henry.

Rice.

Garrett Wilson.

LaPorta.

And somehow Kayser has managed to turn "I'm eventually going back to Bottom 6" into a 3-0 start.

Narking's investigation remains ongoing.

⸻

🏆 EL CAMPEON 131.97 — Danny 122.19

Danny.

My brother.

😭

Week 1: loss.

Week 2: scores 142.96…

loss.

Week 3: puts up 122.19…

loss.

0-3.

Moral Victory FC is officially open for business.

Meanwhile:

El Campeon de la Liga improves to 2-1.

After Week 1, Hadi had:

Autodraft allegations.

Commissioner slander.

Constitutional hearings.

Jamil ready to convene Congress.

Since then:

2 straight wins.

The propaganda department will be issuing a statement shortly.

😂

⸻

🔥 NOW FOR THE TWO MATCHUPS THAT ACTUALLY MATTER TONIGHT

Eagles–Bears kicks off at 8:15 PM ET. (NFL)

⸻

⚖️ Eric 130.39 — Matt 127.57

Margin:

2.82 POINTS.

Eric is DONE.

Matt still has:

🔥 DJ Moore
🛡️ Eagles D/ST

Matt needs:

2.83 combined points.

That's it.

Sounds easy.

Except this is fantasy football.

And Matt has somehow created the FUNNIEST bench situation imaginable.

His starting TE:

Kyle Pitts — 1.5

His bench:

Harold Fannin — 24.1
Kenyon Sadiq — 25.5

😭😭😭😭😭

MATT HAS FIFTY FUCKING TIGHT END POINTS ON HIS BENCH.

Meanwhile Kyle Pitts gave him:

1.5.

Brother has assembled the Avengers at tight end and started Hawkeye.

😂

If Matt loses tonight by less than 20 points…

we're going to need to put his spreadsheets into evidence.

He started this morning asking:

"Week 3 who's going to Punta Cana lol"

Sir.

Please worry about your own flight first.

😂

Current situation: Matt should have the edge with two players remaining, but Eagles D can technically go negative and DJ Moore still has to actually do something.

⸻

🚨 Frankie 83.72 — Jamil 66.50

Frankie is DONE.

Jamil still has:

🔥 Jalen Hurts
🔥 DeVonta Smith

Jamil needs:

17.23 combined points.

That's the entire matchup.

And in GWB's ridiculous 6-point passing-TD scoring…

Hurts could cover that himself.

This should favor Jamil heavily.

BUT…

We've spent three weeks learning one important lesson:

DO NOT DECLARE JAMIL'S MATCHUP OVER BEFORE MONDAY NIGHT.

😂

The man literally lectured everyone last week:

"week isnt over"

So out of respect for the Chairman of Constitutional Affairs:

THE WEEK IS NOT OVER.

Frankie currently sits at 0-2 staring directly at 0-3.

And he has now renamed the team:

TURN YOUR HEAD AND GOFF

Which is objectively fantastic.

If Frankie somehow survives Hurts + DeVonta tonight?

The Frankie Zone becomes a sovereign nation.

⸻

📊 WEEK 3 SCOREBOARD BEFORE MNF

🥇 Steven — 188.39 ✅
🥈 Crooke — 167.66 ✅
🥉 Kayser — 151.93 ✅
4. Narking — 136.70 ❌
5. Hadi — 131.97 ✅
6. Eric — 130.39 ⏳
7. Manny — 129.68 ❌
8. Matt — 127.57 ⏳
9. Mauricio — 123.90 ❌
10. Danny — 122.19 ❌
11. Frankie — 83.72 ⏳
12. Jamil — 66.50 ⏳

Jamil being dead last right now while holding Hurts + DeVonta is why Monday screenshots should come with disclaimers.

⸻

🎰 MONDAY NIGHT NUMBERS

Matt needs:
➡️ 2.83 from DJ Moore + Eagles D.

Jamil needs:
➡️ 17.23 from Hurts + DeVonta.

Philadelphia enters tonight as a 4.5-point favorite, with NFL.com's listed total at 41.5. (NFL)

Translation:

There should be enough football tonight for both Matt and Jamil to get what they need.

But if they don't?

Ohhhhh brother.

😂

⸻

🏅 SUNDAY AWARDS

👑 KING OF THE WEEK: Steven — 188.39

😈 WELCOME BACK AWARD: Crooke — FIRST WIN

🎰 MULLIGAN PARTICIPATION TROPHY: Narking — +5.3 points, lost by 30.96

🧠 4-TIME CHAMP CONSULTING SERVICES: Kayser — questioned the Mulligan timing for 15 straight minutes until Narking finally admitted he was right

💀 FALSE HOPE RECEIPT: Frankie — MHJ 7.0

✈️ PREMATURE PUNTA CANA POLL: Matt — maybe secure your own Week 3 victory first

👶 REAL WIN OF THE WEEK: Mauricio — welcome to fatherhood ❤️

⸻

📈 EARLY STANDINGS IMPLICATIONS

We already know:

Steven → 3-0
Kayser → 3-0

Crooke finally climbs out of the winless basement.

Hadi gets above .500 at 2-1.

Manny drops to 2-1.

Narking drops to 1-2 after spending the afternoon yelling "4 TIME CHAMP."

Danny falls to:

0-3.

Tonight determines whether:

Eric or Matt moves to 2-1

and whether:

Jamil reaches 2-1

or Frankie finally escapes 0-3.

⸻

🦬 FINAL WORD BEFORE MONDAY NIGHT

Steven is terrifying.

Kayser refuses to return to Bottom 6.

Manny's anonymous corporation finally posted a quarterly loss.

Crooke changed his team name and IMMEDIATELY won — branding matters.

Narking burned the Mulligan, gained 5.3 points, lost by thirty and still reminded everyone four separate times that he's a four-time champion.

Frankie abandoned MHJ and survived the first week of the receipt audit.

Mauricio has entered the fatherhood sleep-deprivation protocol.

Danny is now legally prohibited from saying "my team isn't that bad" without showing the standings.

El Campeon quietly moved to 2-1.

Eric is praying Chicago keeps DJ Moore quiet.

Matt needs less than three points despite benching 49.6 points worth of tight ends.

And Jamil needs Hurts + DeVonta to save him from entering the Frankie Zone.

Tonight:

Eagles. Bears. Two GWB matchups.

And tomorrow morning…

Matt's Punta Cana poll may suddenly become VERY specific.

😂🦬`,label:`Monday Night`,postedAt:`2026-09-30T02:30:00Z`},{id:`recap-12`,index:12,title:`AI CORRECTION — FRANKIE HAS ENTERED THE CHAT`,week:3,reconstructed:!1,bodyMarkdown:`🚨 AI CORRECTION — FRANKIE HAS ENTERED THE CHAT

Frankie:

"I still have two players playing tonight. This AI needs to step its game up"

😂😂😂

He's right.

The AI looked at Frankie's 83.72 and accidentally declared him finished.

Meanwhile Frankie still has:

🔥 Saquon Barkley
🔥 Kyle Monangai

playing tonight.

So let the record show:

FRANKIE 83.72 + SAQUON + MONANGAI
vs
JAMIL 66.50 + HURTS + DEVONTA

This is NOT Frankie trying to survive.

This is a full Monday Night cage match.

Frankie already has a 17.22-point lead and two players of his own going.

Jamil doesn't just need Hurts + DeVonta to score.

He needs them to outscore Saquon + Monangai by 17.23.

That is a VERY different assignment. 😭

So yes Frankie:

AI Hadi accepts the flag on the play.

15-yard penalty.

Loss of credibility.

Automatic first down for the Frankie Zone.

😂😂😂

But don't celebrate yet.

Because if Hurts drops one of those stupid 40-point GWB QB games…

I'm coming right back for your neck.

THE WEEK IS NOT OVER. 🦬`,label:`Correction`,postedAt:`2026-09-30T04:00:00Z`},{id:`recap-13`,index:13,title:`GWB WEEK 3 FINAL REPORT — RECEIPTS HAVE BEEN PROCESSED`,week:3,reconstructed:!1,bodyMarkdown:`🦬🏈 GWB WEEK 3 FINAL REPORT — RECEIPTS HAVE BEEN PROCESSED

Week 3 is officially OVER.

And after reviewing Sleeper, the Monday-night carnage, the Mulligans, and approximately 600 WhatsApp messages…

we have conclusions.

Some of you are contenders.

Some of you are unlucky.

Some of you are 0-3.

And some of you apparently use Mulligans to LOSE points.

😭

⸻

👑 Steven 199.19 — Mauricio 123.90

First things first:

199.19.

Again.

Steven has now scored:

Week 1 — 199.39
Week 2 — 134.93
Week 3 — 199.19

Season total:

🔥 533.51

Average:

🔥 177.84 PER WEEK

That's not a hot start.

That's criminal activity.

And remember the QB saga?

Jayden Daniels gets hurt.

Steven adds Daniel Jones.

Drops Daniel Jones.

Grabs Sam Darnold.

Then tells Jamil:

"Thank you Jamil for Sam Darnold 💪💪💪"

Darnold:

47.89 GWB POINTS.

😭😭😭

That pickup alone basically became a hate crime.

Steven is now:

3-0
#1 in standings
#1 in points

…and his primary communication method remains:

"Hi 👋"

Terrifying.

Mauricio drops to 1-2, but considering he literally welcomed a newborn into the world this week…

Fantasy gods, please grant the man an excused absence.

⸻

🏆 Kayser 151.93 — Manny 129.68

THE UNDEFEATED SHOWDOWN.

Kayser survives.

3-0.

Manny's anonymous corporation finally records its first quarterly loss.

Narking has spent approximately seven days demanding Kayser return to the Bottom 6.

Kayser previously told him:

"I will be there in due time, for now I enjoy."

Apparently "in due time" means:

NOT THIS FUCKING WEEK.

😂

Season PF:

Kayser — 461.53

That's second in the entire league.

We may unfortunately need to consider the possibility that The Special One is actually…

good.

Narking is currently requesting an independent audit.

⸻

😈 Crooke 167.66 — Narking 136.70

Darkseid Jackson.

New name.

New era.

First win.

😂

Crooke goes from:

ARC SIGNAGE CO LLC

to:

DARKSEID JACKSON

and immediately drops 167.66.

BRANDING MATTERS.

Meanwhile Narking's Week 3 included perhaps the funniest Mulligan sequence so far.

Achane:

1.7

Narking calls Mulligan.

Etienne enters:

9.0

Net gain:

✅ +5.3

Great!

Final margin:

Crooke wins by:

30.96

😭

Kayser spent the afternoon questioning why a self-proclaimed 4X CHAMP would Mulligan so early.

Eventually Narking admitted:

"You are right bro. I did it too early."

Then immediately reminded everyone:

"4 Time Champ"

"4"

"Times"

In case anyone forgot.

😂

For historical purposes:

Narking's Mulligan worked mechanically.

It just had the strategic impact of putting premium gas in a car that's already underwater.

⸻

🏆 HADI 131.97 — Danny 121.69

Okay.

This one requires documentation.

Danny entered Monday trailing.

At 7:03 PM:

"Not decided yet. Let's hope for a Monday miracle."

Then:

"Mulligan: Bateman for Wicks."

🚨

Rashod Bateman had:

5.7

Dontayvion Wicks finished with:

5.2

😭😭😭😭😭

DANNY USED HIS ONCE-A-SEASON MULLIGAN…

AND LOST 0.5 POINTS.

His score literally went:

122.19 → 121.69

I don't know if we've ever had a Mulligan do negative expected value in real time.

This may need its own section in the Constitution.

The Reverse Mulligan.

😂

And the funniest part?

Danny's kicker gave him:

ZERO.

Hadi literally told him later:

"honestly i thought you were going to pick up a kicker and replace the one that gave you 0"

Danny:

"Yup. I need my kickers to stop playing me"

Brother.

THE CALL WAS COMING FROM INSIDE THE HOUSE.

😭

Danny falls to:

0-3

Hadi improves to:

2-1

El Campeon survives another constitutional challenge.

⸻

🧪 Eric 130.39 — Matt 128.57

Margin:

1.82 POINTS.

This was the closest matchup of Week 3.

Matt entered Monday needing just 2.83 from DJ Moore + Eagles D.

DJ Moore gave him:

12.7

Easy!

Eagles defense:

1

And somehow…

Matt STILL LOST.

Because fantasy football enjoys suffering.

Final:

Eric 130.39

Matt 128.57

But please direct your attention to Matt's bench.

Starting TE:

Kyle Pitts — 1.5

Bench TE #1:

Harold Fannin — 24.1

Bench TE #2:

Kenyon Sadiq — 25.5

Total TE points sitting on Matt's bench:

49.6

😭😭😭😭

Matt could have started either bench TE…

and won comfortably.

Instead:

Kyle Pitts.

1.5.

The spreadsheet failed.

The models failed.

Science failed.

And approximately 12 hours earlier Matt was asking:

"Week 3 who's going to Punta Cana lol"

Brother couldn't even clear airport security.

😂

Eric quietly moves to:

2-1

No propaganda required.

⸻

⚖️ Jamil 113.55 — Frankie 95.82

Now we need to revisit yesterday morning.

Frankie:

"I still have two players playing tonight. This AI needs to step its game up"

"Already counting me out"

🖕🏼

And you know what?

Frankie was RIGHT.

AI Hadi accepted the penalty.

Frankie had:

Saquon
Monangai

Jamil had:

Hurts
DeVonta

Frankie entered Monday up:

17.22

So what happened?

Saquon:

9.0

Monangai:

3.1

Combined:

12.1

Meanwhile:

Hurts — 14.75

DeVonta — 12.5

Combined:

27.25

Final:

Jamil 113.55
Frankie 95.82

😭😭😭

Frankie called out the AI…

then proceeded to get outscored by the exact two players the AI warned him about.

This is why the Chairman of Constitutional Affairs keeps repeating:

"THE WEEK IS NOT OVER."

Jamil moves to:

2-1

Frankie:

0-3

The Frankie Zone has officially received statehood.

⸻

📊 FINAL WEEK 3 SCORING

🥇 Steven — 199.19
🥈 Crooke — 167.66
🥉 Kayser — 151.93
4. Narking — 136.70
5. Hadi — 131.97
6. Eric — 130.39
7. Manny — 129.68
8. Matt — 128.57
9. Mauricio — 123.90
10. Danny — 121.69
11. Jamil — 113.55
12. Frankie — 95.82

Funniest result:

Narking scored 4th-most…

and lost again.

Brother's relationship with fantasy scheduling is abusive.

😂

⸻

📈 THREE-WEEK POINTS FOR — WHO'S ACTUALLY SCORING?

1️⃣ Steven — 533.51

2️⃣ Kayser — 461.53

3️⃣ Manny — 446.89

4️⃣ Matt — 434.17

5️⃣ Narking — 426.80

6️⃣ Jamil — 424.14

7️⃣ Crooke — 415.82

8️⃣ Hadi — 402.44

9️⃣ Eric — 402.21

🔟 Danny — 376.53

11️⃣ Mauricio — 360.76

12️⃣ Frankie — 336.41

Important:

Matt is 4th in the entire league in points scored…

and is 1-2.

Narking is 5th…

and is 1-2.

Fantasy football does not recognize justice.

⸻

😳 HADI VS ERIC STAT OF THE WEEK

After three full weeks:

Hadi PF:

402.44

Eric PF:

402.21

Difference:

0.23 POINTS.

That's it.

Three weeks.

30 starters each.

Hundreds of NFL plays.

Difference:

0.23

😂

⸻

💀 WHO HAS BEEN GETTING ABSOLUTELY SCREWED?

Danny has allowed:

474.58 points

Most in the league.

That's why he's 0-3 despite not actually having the second-worst scoring team.

Danny isn't just losing.

Opponents see Lambs2Slaughter on the schedule and suddenly become the '07 Patriots.

😭

⸻

🏥 THE 0-3 SUPPORT GROUP

Danny — 0-3

376.53 PF.

Schedule from hell.

⸻

Frankie — 0-3

336.41 PF.

This one may actually be an emergency.

😂

Joe Money.

Joe Problems.

Joe 0-3.

⸻

🏆 THE UNDEFEATED CLUB

Only two remain:

👑 Steven — 3-0

👑 Kayser — 3-0

And that's it.

Manny has been removed from the meeting.

His badge no longer works.

⸻

🎰 2026 MULLIGAN LEDGER

Mauricio — Week 1

Used it.

Won.

Probably didn't need it.

⸻

Manny — Week 2

Caleb → Mahomes.

Huge PF boost.

Ultimately didn't need it to win.

⸻

Matt — Week 2

DJ Moore → Malachi Fields.

Improved score.

Still lost.

⸻

Narking — Week 3

Achane 1.7 → Etienne 9.0.

+5.3

Still lost by 30.96.

⸻

Danny — Week 3

Bateman 5.7 → Wicks 5.2.

-0.5

Still lost.

😭

Ladies and gentlemen…

We have officially witnessed the first:

🏆 NEGATIVE MULLIGAN

History.

⸻

😂 WHATSAPP PERSONALITY REPORT

Narking

Reminded the group he's a 4X champion enough times that we can now calculate it:

According to Narking:

"That's 28% of the league years"

Nobody asked.

😂

⸻

Frankie

Claims he's currently in:

"The 'I have my shit together' stage"

Fantasy record:

0-3

The court will decide whether these statements are compatible.

⸻

Kayser

Watching 38-year-old Case Keenum Monday night:

"it's like watching an old painter make an absolute art piece"

Unexpectedly poetic.

Kayser is apparently both:

3-0 fantasy manager
AND
football historian.

⸻

Matt

Gets asked if something in the chat is him.

Response:

"Nah this is Matt"

Followed by approximately 17 stickers.

Peak Matt.

⸻

Crooke

First win.

New team name.

No longer needs to submit Instagram impressions as evidence of competitive success.

⸻

📊 UPDATED STANDINGS

3-0

🥇 Steven — Hairy Chest
🥈 Kayser — The Special One

2-1

🥉 Manny — ………
4️⃣ Jamil — BigBlue
5️⃣ Hadi — El Campeon de la Liga
6️⃣ Eric — 3.0.4

1-2

7️⃣ Matt — Gibbs & Grind
8️⃣ Narking — Put em down Jeanty
9️⃣ Crooke — Darkseid Jackson
🔟 Mauricio — Los Yajesitos

0-3

11️⃣ Danny — Lambs2Slaughter
12️⃣ Frankie — Turn Your Head And Goff

⸻

👀 EARLY WEEK 4 MATCHUPS

Ohhhhhh boy.

Danny 0-3 vs Crooke 1-2

Somebody desperately needs this.

Danny cannot go 0-4.

Crooke just discovered winning exists.

⸻

Mauricio 1-2 vs Eric 2-1

New dad vs propaganda department.

Sleep deprivation vs Dak Prescott.

⸻

🔥 NARKING 1-2 vs STEVEN 3-0

This is beautiful.

Narking:

4X champ.

Fantasy historian.

Spiritual advisor.

Steven:

Currently beating everyone into paste.

If Narking ends Steven's undefeated run?

We will NEVER hear the end of it.

If Steven beats him?

Expect:

"Hi 👋"

⸻

💀 KAYSER 3-0 vs FRANKIE 0-3

Oh no.

Top of the standings.

Bottom of the standings.

The Special One.

The Frankie Zone.

This has tremendous bullying potential.

⸻

🔥 HADI 2-1 vs MANNY 2-1

El Campeon vs the anonymous corporation.

Both 2-1.

Only 44.45 total season points separate them.

Big matchup.

⸻

🔥 JAMIL 2-1 vs MATT 1-2

Jamil's Constitution Department vs Matt's Analytics Department.

Matt is 4th in PF despite the losing record.

Jamil is 6th.

This matchup is basically:

Law vs Excel.

😂

⸻

🦬 FINAL WORD

Steven is averaging almost 178 points per week.

Kayser somehow turned Bottom-6 jokes into a 3-0 start.

Manny finally lost.

Jamil once again proved that Monday night means Monday NIGHT.

Hadi and Eric are separated by less than a quarter of a fantasy point after three weeks.

Matt is 4th in scoring and still 1-2 because the universe hates optimization.

Narking's Mulligan worked and accomplished nothing.

Danny's Mulligan somehow made his team worse.

Crooke discovered a new team name and a win in the same week.

Mauricio is now playing fantasy football on newborn sleep.

Frankie called out the AI…

and then immediately lost by 17.73.

Week 3 is done.

The receipts are permanent.

Week 4 starts Thursday.

🦬🔥`,label:`Final`,postedAt:`2026-10-01T12:00:00Z`},{id:`recap-14`,index:14,title:`GWB WEEK 4 — WAIVERS, INJURIES, PANIC & THE OFFICIAL "WHO'S ACTUALLY GOOD?" CHECKPOINT`,week:4,reconstructed:!1,bodyMarkdown:`🦬🔥 **GWB WEEK 4 — WAIVERS, INJURIES, PANIC & THE OFFICIAL "WHO'S ACTUALLY GOOD?" CHECKPOINT**

Three weeks are gone.

Waivers cleared.

Bodies are dropping.

And Narking has officially gone from:

> "4 TIME CHAMP"

to:

> "I'm cooked 😭"

in approximately 48 hours.

Football is healing.


🚑 **FIRST: THE INJURY APOCALYPSE**

Narking said yesterday:

> "I have now lost 2 RBs. Im cooked 😭"

For once…

this wasn't propaganda.

De'Von Achane tore his ACL and is **DONE FOR THE YEAR.**

Travis Etienne also aggravated a hamstring in Week 3 and is dealing with his own uncertainty.

So yes:

Narking's RB room got hit by a meteor.

And immediately afterward the waiver wire became:

**THE HUNGER GAMES.**

---

💰 **WAIVER WINNER #1 — Jamil**

Jamil lands:

🔥 **OLLIE GORDON**

This was probably the biggest available RB prize.

With Achane done, Gordon handled the Miami backfield after the injury:

17 carries
41 yards
1 TD
3 catches
14 yards

NFL.com had him among the top Week 4 adds, and he's currently the cleaner short-term bet because Jaylen Wright is still working back from foot/stinger issues.

So Jamil basically watched Narking lose Achane…

and then stole the most obvious replacement.

😭😭😭

**GRADE: A**

Chairman of the Constitution.

Chairman of the Waiver Committee.

Chairman of Pain.

---

🐍 **Narking'S CONSOLATION PRIZE**

Narking claimed:

✅ **Jaylen Wright**

and dropped:

❌ **De'Von Achane**

Moment of silence.

🕯️

Achane gave Narking exactly three weeks of hope before ripping his ACL.

Now Wright becomes the lottery ticket.

The problem:

Wright missed Week 3 with a foot injury/stinger and is still considered day-to-day. Gordon is the healthier player right now.

So Narking lost Achane…

failed to get Kendre Miller…

failed to get Keaton Mitchell…

and ended up with the injured backup to the guy Jamil claimed.

😂

Ladies and gentlemen:

**The Fantasy Gods are watching.**

And apparently they read WhatsApp.

**GRADE: B-**

Potential upside.

Maximum emotional damage.

---

🐑 **Danny FINALLY DOES SOMETHING USEFUL**

Danny grabbed:

✅ **Kendre Miller**

and finally retired:

❌ Rashod Bateman

Which is beautiful because Bateman's final contribution to Lambs2Slaughter was being replaced by Wicks via Mulligan…

only for Wicks to score **0.5 fewer points.**

😭

Kendre is actually interesting now because Etienne aggravated that hamstring in Week 3, so there is a real path to increased work if Etienne misses time.

Danny also:

✅ Packers D/ST
✅ Spencer Shrader

Please note:

**THE MAN FINALLY CHANGED HIS KICKER.**

After scoring ZERO last week.

Progress.

😂

**GRADE: A-**

Mostly because Danny addressed three actual problems instead of trying another Monday miracle.

---

👶 **Mauricio IS OPERATING ON NEWBORN SLEEP**

Mauricio grabs:

✅ **Jakobi Meyers**
✅ Baltimore D/ST

Drops:

❌ Jadarian Price
❌ Bengals D/ST

This is a very Mauricio move.

Quiet.

Reasonable.

No 24-hour Kirk Cousins lease involved.

😂

Meyers immediately gives him another usable WR/FLEX option alongside Nabers, Deebo, Ladd and Diggs.

And considering Mauricio now lives in the newborn timeline where there is no day or night…

a boring competent waiver pickup is probably exactly what he needed.

**GRADE: B+**

---

🚨 **Frankie IS STILL TRYING TO ESCAPE THE ZONE**

Frankie:

0-3.

New pickup:

✅ **Keenan Allen**

Dropped:

❌ Xavier Worthy

Also:

✅ Raiders D/ST

And just to clarify…

Frankie initially tried for:

Ollie Gordon ❌
Raiders D/ST ❌
Jaguars D/ST ❌

before finally piecing things together.

So the Frankie Zone continues to operate under emergency management.

😂

Keenan is at least a useful veteran option.

But Frankie is now reaching the portion of the season where every move feels like:

**"PLEASE GOD LET THIS ONE WORK."**

**GRADE: B**

---

🏢 **Manny SUBMITTED THE ENTIRE WAIVER FORM**

Manny put in claims for:

❌ Marcus Mariota
❌ Case Keenum
❌ Jakobi Meyers
❌ Ollie Gordon

And successfully landed:

✅ **TYLER HIGBEE**

😭😭😭

Four targets missed.

One Tyler Higbee acquired.

This is like submitting applications to Harvard, Yale, Columbia and Princeton…

then getting a coupon from DeVry.

😂

To his credit, Higbee may actually be useful while the Rams' receiving corps remains banged up.

But after starting 2-0 and then losing to Kayser…

the anonymous corporation has encountered its first supply-chain issue.

**GRADE: C+**

---

👀 **JAMIL ALSO STOLE THE GUY EVERYBODY WANTED**

Here's the Ollie Gordon claim list:

Jamil ✅

Manny ❌

Kayser ❌

Frankie ❌

Danny ❌

That's HALF THE FUCKING LEAGUE.

😭

Jamil walking away with Gordon is the early waiver flex of Week 4.

And because Narking's Achane was the reason Gordon mattered…

this somehow feels even more disrespectful.

---

📉 **BREECE HALL WATCH**

Eric needs to pay attention.

Breece left Week 3 with a thigh/quad injury.

Braelon Allen was one of the top waiver recommendations because if Breece sits, Allen could immediately become a usable RB2/FLEX.

And who owns Braelon Allen?

**Mauricio.**

👀

So Eric is now sitting there hoping Breece gets healthy…

while his Week 4 opponent literally owns the backup.

That's fantasy terrorism.

😂

---

💪 **HADI GETS BROCK BOWERS BACK**

This one matters.

Brock Bowers finally returned last week after the knee procedure and immediately went:

**10 catches
116 yards
1 TD**

So El Campeon goes from AJ Barner at TE…

back to one of the best tight ends in football.

Current Week 4 expert board has Bowers around the **top 15 overall FLEX players**, which is absurd for a tight end.

The current lineup also has:

Kyler Murray
Skattebo
Aaron Jones
JSN
Pickens
Bowers
Chuba
Coker

And JSN is still being ranked as a **top-two overall FLEX** this week by multiple experts.

El Campeon quietly getting healthier.

Nobody say anything.

---

📊 **CURRENT STATE OF THE LEAGUE**

**3-0**

👑 Steven — 533.51 PF
👑 Kayser — 461.53

**2-1**

Manny — 446.89
Jamil — 424.14
Hadi — 402.44
Eric — 402.21

**1-2**

Matt — 434.17
Narking — 426.80
Crooke — 415.82
Mauricio — 360.76

**0-3**

Danny — 376.53
Frankie — 336.41

Reminder:

Matt is **4th in scoring and 1-2.**

Narking is **5th in scoring and 1-2.**

Danny has more PF than Mauricio despite being 0-3.

There is no justice.

---

🔥🔥 **WEEK 4 MATCHUP #1 — Narking vs Steven**

Ohhhhhhhhh boy.

**1-2 Narking**

vs

**3-0 Steven**

This is the perfect matchup.

Narking has spent three weeks informing everyone that:

• he's a four-time champion
• Kayser belongs Bottom 6
• the fantasy gods are watching
• his process should be trusted

Now he's missing Achane.

Etienne is hurt.

And his current RB2 is:

**MarShawn Lloyd.**

😭

Meanwhile Steven has:

Darnold
Bijan
Kyren
Olave
Zay Flowers

and is averaging:

**177.84 points per week.**

Current Week 4 ranks have Bijan top-five overall, Olave around top-10 and Darnold still a viable starting QB.

This is the first week where Steven actually looks mortal because of the matchup/injury setup around his roster…

but he's still favored.

**PREDICTION: Steven 61% — Narking 39%**

If Narking ends Steven's undefeated streak?

Please mute the WhatsApp group for 48 hours.

We will hear:

**"4 TIME CHAMP"**

approximately 917 times.

If Steven wins?

> "Hi 👋"

---

💀 **WEEK 4 MATCHUP #2 — Kayser vs Frankie**

**3-0**

vs

**0-3**

The standings could not have scripted this better.

Kayser has spent the year accepting Bottom-6 jokes with Buddhist calm.

And somehow…

he's undefeated.

Frankie spent Monday telling AI Hadi to step its game up.

Then got beat.

😂

QB matchup:

Stafford vs Goff.

Skill positions:

Taylor/Henry/Rice/Wilson

vs

Saquon/Jefferson/Higgins/Keenan.

This is actually more competitive on paper than the records suggest.

But Frankie's lineup has been underperforming horribly.

**PREDICTION: Kayser 59% — Frankie 41%**

Frankie at 0-4?

The Frankie Zone becomes a UNESCO World Heritage Site.

---

🔥 **WEEK 4 MATCHUP #3 — HADI vs Manny**

**2-1 vs 2-1**

This is sneaky Game of the Week material.

Hadi:

Kyler
JSN
Bowers
Pickens
Skattebo

Manny:

Mahomes
Cook
Davante
Kelce
Tet McMillan

Current Week 4 QB rankings:

Mahomes — **QB3**
Kyler — around **QB14**.

Huge Manny edge there.

But Hadi has:

**JSN — elite WR1 territory**

and Bowers back.

Manny's flex depth is also getting shaky.

**PREDICTION: Manny 52% — Hadi 48%**

Essentially a coin flip.

Winner gets to 3-1.

Loser joins the commoners at 2-2.

---

🧠 **WEEK 4 MATCHUP #4 — Jamil vs Matt**

**LAW vs EXCEL II**

Jamil:

Hurts
Kenneth Walker
Bucky
Puka
DeVonta

Matt:

Josh Allen
Gibbs
Judkins
Nico
DJ Moore

Current Week 4 QB ranks:

Josh Allen — **QB1**

Hurts — **QB5**.

And current FLEX rankings have:

Gibbs — **#1 overall**

Puka — roughly top-10 if he's back as expected.

This matchup is loaded.

Matt finally moved Harold Fannin into the TE spot after leaving 49.6 TE points on his bench last week.

Congratulations.

The spreadsheet has discovered:

**START THE GUY WHO SCORES POINTS.**

😂

**PREDICTION: Matt 53% — Jamil 47%**

My favorite matchup of the week.

---

👶 **WEEK 4 MATCHUP #5 — Mauricio vs Eric**

New Dad Bowl.

Mauricio:

1-2.

Eric:

2-1.

Eric has:

Dak
Breece
Amon-Ra
Drake London

Mauricio:

Bryce
CMC
Nabers
Deebo
Ladd
Jakobi

The big swing:

**Breece's health.**

If Breece plays normally, Eric has the stronger structure.

If Breece sits?

Mauricio owns Braelon Allen.

😂😂😂

Imagine beating your opponent with the backup to HIS injured starter.

That would be elite.

Current Week 4 rankings have CMC top-10 overall and Amon-Ra top-six.

**PREDICTION: Eric 51% — Mauricio 49%**

Dead even until Breece practice reports arrive.

---

🚨 **WEEK 4 MATCHUP #6 —Danny vs Crooke**

Danny:

**0-3**

Crooke:

**1-2**

This has desperation written all over it.

Danny finally upgraded:

Kendre Miller
Packers D
new kicker

Crooke finally won last week and immediately returned to his real passion:

Instagram.

Yesterday:

> "6.3k views in last month."

> "Good job those helping repost, tagging, liking, commenting."

Then:

> "The rest of you are high on estrogen."

😭😭😭

Crooke is now apparently Commissioner of Meta Analytics.

And when he sent unreleased GWB graphics and said:

> "Delete from your phone"

Hadi:

> "Send me $50"

We officially have a black market.

😂

Football-wise:

Crooke has Lamar.

Current Week 4 consensus:

**QB2.**

Danny has Trevor Lawrence:

**QB4.**

This is actually a very good matchup.

But Crooke has Ja'Marr plus Lamar.

Danny needs CeeDee and McBride to carry.

**PREDICTION: Crooke 55% — Danny 45%**

Danny at 0-4 would officially trigger emergency procedures.

---

🏆 **EARLY WEEK 4 POWER SIGNALS**

Not power rankings.

Just facts.

**Steven**

Best record.
Most points.
Only team above 500 PF.

Clearly the early benchmark.

---

**Kayser**

3-0.

Second-most PF.

At some point we have to stop treating this as a practical joke.

😂

---

**Matt**

1-2.

Fourth-most PF.

Probably better than his record.

Also probably still capable of benching 25 points for absolutely no reason.

---

**Narking**

1-2.

Fifth in PF.

Now missing Achane and dealing with Etienne.

His team quality and his actual available roster are suddenly two different conversations.

---

**Hadi / Eric**

402.44 vs 402.21 PF.

Still separated by:

**0.23.**

Fucking ridiculous.

---

📈 **WEEK 4 QB HEAT CHECK**

Current consensus:

🥇 Josh Allen — Matt
🥈 Lamar — Crooke
🥉 Mahomes — Manny
4️⃣ Trevor Lawrence — Danny
5️⃣ Hurts — Jamil
6️⃣ Goff — Frankie
7️⃣ Purdy — Narking
9️⃣ Dak — Eric
11️⃣ Bryce — Mauricio
14️⃣ Kyler — Hadi

Steven's Darnold isn't in that top tier this week…

but after he gave Steven **47.89 GWB points** last Sunday, I'm not telling that man what to do.

😂

---

💎 **BEST WAIVER PICKUP**

**Jamil — Ollie Gordon**

Clear immediate role.

Potential RB2.

And he stole him from half the league.

---

🎲 **HIGHEST UPSIDE WAIVER BET**

**Narking — Jaylen Wright**

If he gets healthy and wins the Miami job, this looks great.

If Gordon takes control?

Narking may start talking about championships from 2019 again.

---

🧠 **SMARTEST UNDER-THE-RADAR MOVE**

**Danny — Kendre Miller**

Etienne's hamstring makes this worth watching.

Danny needed RB depth.

Good process.

Please do not Mulligan him for someone who scores fewer points.

---

📉 **WAIVER SADNESS AWARD**

**Manny**

Wanted:

Mariota
Keenum
Meyers
Gordon

Got:

Tyler Higbee.

😂

---

📱 **CROOKE BUSINESS UPDATE**

GWB Instagram:

**6.3K views in the last month.**

Crooke would like to thank everyone who:

reposts
tags
likes
comments

and would like everyone else to know:

> "you are high on estrogen"

Direct all complaints to Human Resources.

---

🔮 **WEEK 4 PICKS**

🟢 Crooke over Danny
🟢 Eric over Mauricio — barely
🟢 Steven over Narking
🟢 Kayser over Frankie
🟢 Manny over Hadi — coin flip
🟢 Matt over Jamil — coin flip

**Upset I'm watching:**

Narking over Steven.

Not because I love Narking's current RB situation.

But because Purdy just scored **50.3 GWB points**, Kittle exploded for 26.2, and Jeanty is due for touchdown regression with enormous usage.

If that upset happens…

God help us all.

---

🦬 **FINAL WORD**

Steven is the early final boss.

Kayser refuses to return to the Bottom 6.

Manny's corporation lost a waiver bidding war to basically everyone.

Jamil stole Ollie Gordon from half the league.

Matt finally figured out which tight end to start.

Eric is nervously refreshing Breece Hall updates.

Mauricio is changing diapers and waiting to see if Braelon Allen becomes useful.

Crooke is running a fantasy team, Instagram account and extortion racket simultaneously.

Danny finally replaced his zero-point kicker.

Frankie is fighting for his life.

Narking lost Achane, watched Jamil steal Gordon and is now trying to resurrect his season with Jaylen Wright.

And El Campeon quietly gets Brock Bowers back.

Week 4 hasn't started.

The injury report isn't even finished.

And somehow we're already fighting.

**GWB is exactly where it needs to be.**

🦬🔥`,label:`Predictions`,postedAt:`2026-10-02`}]},V=40,H=3;function Uo(e,t){return t[e]?.full_name?.trim()||`Player`}function Wo(e,t){let n=null;return e.starters.forEach((r,i)=>{let a=e.starters_points[i]??0;(!n||a>n.points)&&(n={name:Uo(r,t),points:a})}),n}function Go(e,t){let n=new Set(e.starters),r=null,i=e.starters_points.filter(e=>e!=null);if(!i.length)return null;let a=Math.min(...i);for(let[i,o]of Object.entries(e.players_points??{})){if(n.has(i)||o<=a)continue;let e=o-a;(!r||e>r.points-r.starterPoints)&&(r={name:Uo(i,t),points:o,starterPoints:a})}return r}function Ko(e,t){return t.find(t=>t.rosterId===e)?.rank??99}function qo(e,t,n,r,i,a){let o=n>=r,s=[],c=o?i:a,l=o?e:t,u=o?a:i,d=o?t:e;return c&&s.push(`${c.name} ${c.points.toFixed(1)} · ${l}`),u&&s.push(`${u.name} ${u.points.toFixed(1)} · ${d}`),s}function Jo(e){if(e.length)return e.length===1?`Top scorer: ${e[0]}`:`Top scorers: ${e.join(` · `)}`}function Yo(e,t,n,r,i){return`${n>=r?e:t} topped ${n>=r?t:e} by ${Math.abs(n-r).toFixed(1)} points.${i.length?` ${i.join(` · `)}.`:``}`}function Xo(e,t,n,r){let i=new Map;for(let t of e){let e=i.get(t.matchup_id)??[];e.push(t),i.set(t.matchup_id,e)}let a=[];for(let[e,o]of i){if(o.length<2)continue;let[i,s]=o,c=t.get(i.roster_id),l=t.get(s.roster_id),u=Math.abs(i.points-s.points),d=i.points>=s.points?i.roster_id:s.roster_id,f=[];u>=V&&f.push(`Blowout`);let p=Ko(i.roster_id,r),m=Ko(s.roster_id,r);(i.points>=s.points?p:m)-(i.points>=s.points?m:p)>=H&&f.push(`Upset`);let h=Wo(i,n),g=Wo(s,n),_=qo(c?.teamName??`Team A`,l?.teamName??`Team B`,i.points,s.points,h,g);a.push({matchupId:e,teamA:{rosterId:i.roster_id,teamName:c?.teamName??`Team ${i.roster_id}`,points:i.points,topScorer:h,benchMiss:Go(i,n)},teamB:{rosterId:s.roster_id,teamName:l?.teamName??`Team ${s.roster_id}`,points:s.points,topScorer:g,benchMiss:Go(s,n)},margin:u,winnerRosterId:d,tags:f,narrative:Yo(c?.teamName??`Team A`,l?.teamName??`Team B`,i.points,s.points,f),scorerLines:_,starsLine:Jo(_),isMatchupOfTheWeek:!1})}if(a.length){let e=a.reduce((e,t)=>t.margin>e.margin?t:e);e.isMatchupOfTheWeek=!0}return a.sort((e,t)=>e.matchupId-t.matchupId)}function U(e){return e?.length?e.some(e=>e.starters?.length>0):!1}var Zo={Waivers:20,Predictions:30,Thursday:40,Saturday:50,Sunday:60,"Monday Morning":70,"Monday Night":80,Final:90,Correction:100},Qo={Predictions:`Predictions`,Waivers:`Waivers`,Thursday:`Thursday`,Saturday:`Saturday`,Sunday:`Sunday`,"Monday Morning":`Monday`,"Monday Night":`Monday Night`,Final:`Final`,Correction:`Correction`};function $o(e){return Qo[e]}function es(e,t){let n=Zo[e.label]??50,r=Zo[t.label]??50;if(n!==r)return n-r;let i=Date.parse(e.postedAt),a=Date.parse(t.postedAt);return i===a?e.index-t.index:i-a}function ts(e){return[...e].sort(es)}function ns(e,t){return ts(e.filter(e=>e.week===t))}function rs(e,t=3){return e.split(`
`).map(e=>e.replace(/^#+\s*/,``).replace(/\*\*([^*]+)\*\*/g,`$1`).replace(/\*([^*]+)\*/g,`$1`).trim()).filter(e=>e.length>0&&e!==`⸻`&&!e.startsWith(`---`)&&!/^🦬+$/.test(e)).slice(0,t).join(` `)}var is=Ho.recaps;function as({week:e}){let t=(0,v.useMemo)(()=>ns(is,e),[e]);return(0,T.jsxs)(`div`,{className:`space-y-4`,children:[(0,T.jsxs)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:[Ho.label,` — timeline for NFL Week `,e,`. Tap a post to read the full recap.`]}),t.length===0?(0,T.jsxs)(`p`,{className:`rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-sm text-[var(--gwb-muted)]`,children:[`No commissioner recaps for Week `,e,` yet.`]}):(0,T.jsx)(`ol`,{className:`relative space-y-2 border-l border-[var(--gwb-border)] pl-4`,children:t.map(e=>(0,T.jsxs)(`li`,{className:`relative`,children:[(0,T.jsx)(`span`,{className:`absolute -left-[1.125rem] top-4 h-2 w-2 rounded-full bg-[var(--gwb-accent)]`,"aria-hidden":!0}),(0,T.jsxs)(`details`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)]`,children:[(0,T.jsx)(`summary`,{className:`cursor-pointer list-none px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden`,children:(0,T.jsxs)(`span`,{className:`flex flex-col gap-2`,children:[(0,T.jsxs)(`span`,{className:`flex flex-wrap items-center gap-2`,children:[(0,T.jsx)(`span`,{className:`rounded-full bg-[#243040] px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--gwb-accent)]`,children:$o(e.label)}),e.reconstructed&&(0,T.jsx)(`span`,{className:`rounded-full bg-[#243040] px-2 py-0.5 text-xs font-normal uppercase tracking-wide text-[var(--gwb-muted)]`,children:`reconstructed`}),(0,T.jsx)(`time`,{className:`text-xs text-[var(--gwb-muted)]`,dateTime:e.postedAt,children:os(e.postedAt)})]}),(0,T.jsx)(`span`,{className:`font-medium leading-snug`,children:e.title}),(0,T.jsx)(`span`,{className:`text-sm leading-relaxed text-[var(--gwb-muted)] line-clamp-3`,children:rs(e.bodyMarkdown)})]})}),(0,T.jsx)(`div`,{className:`commissioner-recap-prose border-t border-[var(--gwb-border)] px-4 py-4 text-sm leading-relaxed text-[var(--gwb-text)]`,children:(0,T.jsx)(Lo,{children:e.bodyMarkdown})})]})]},e.id))})]})}function os(e){let t=new Date(e);return Number.isNaN(t.getTime())?e:t.toLocaleDateString(`en-US`,{weekday:`short`,month:`short`,day:`numeric`})}function ss({recaps:e,week:t,hasScores:n}){return n?e.length?(0,T.jsx)(`div`,{className:`space-y-4`,children:e.map(e=>(0,T.jsxs)(`article`,{className:`rounded-xl border p-4 ${e.isMatchupOfTheWeek?`border-[var(--gwb-accent)] bg-[#1a1608]`:`border-[var(--gwb-border)] bg-[var(--gwb-surface)]`}`,children:[e.isMatchupOfTheWeek&&(0,T.jsx)(`p`,{className:`mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--gwb-accent)]`,children:`Matchup of the week`}),(0,T.jsxs)(`div`,{className:`flex flex-wrap items-baseline justify-between gap-2`,children:[(0,T.jsxs)(`h3`,{className:`text-lg font-semibold`,children:[e.teamA.teamName,` `,(0,T.jsx)(`span`,{className:`text-[var(--gwb-accent)]`,children:e.teamA.points.toFixed(1)}),(0,T.jsx)(`span`,{className:`mx-2 text-[var(--gwb-muted)]`,children:`vs`}),e.teamB.teamName,` `,(0,T.jsx)(`span`,{className:`text-[var(--gwb-accent)]`,children:e.teamB.points.toFixed(1)})]}),e.tags.length>0&&(0,T.jsx)(`div`,{className:`flex gap-2`,children:e.tags.map(e=>(0,T.jsx)(`span`,{className:`rounded-full bg-[#243040] px-2 py-0.5 text-xs uppercase`,children:e},e))})]}),(0,T.jsx)(`p`,{className:`mt-2 text-sm text-[var(--gwb-muted)]`,children:e.narrative}),e.starsLine&&(0,T.jsx)(`p`,{className:`mt-1 text-sm text-[var(--gwb-text)]`,children:e.starsLine}),(0,T.jsxs)(`dl`,{className:`mt-3 grid gap-2 text-sm sm:grid-cols-2`,children:[(0,T.jsxs)(`div`,{children:[(0,T.jsx)(`dt`,{className:`text-xs uppercase text-[var(--gwb-muted)]`,children:`Top scorer A`}),(0,T.jsx)(`dd`,{children:e.teamA.topScorer?`${e.teamA.topScorer.name} · ${e.teamA.topScorer.points.toFixed(1)}`:`—`})]}),(0,T.jsxs)(`div`,{children:[(0,T.jsx)(`dt`,{className:`text-xs uppercase text-[var(--gwb-muted)]`,children:`Top scorer B`}),(0,T.jsx)(`dd`,{children:e.teamB.topScorer?`${e.teamB.topScorer.name} · ${e.teamB.topScorer.points.toFixed(1)}`:`—`})]}),(0,T.jsxs)(`div`,{children:[(0,T.jsx)(`dt`,{className:`text-xs uppercase text-[var(--gwb-muted)]`,children:`Bench miss A`}),(0,T.jsx)(`dd`,{children:e.teamA.benchMiss?`${e.teamA.benchMiss.name} left ${e.teamA.benchMiss.points.toFixed(1)} on bench`:`—`})]}),(0,T.jsxs)(`div`,{children:[(0,T.jsx)(`dt`,{className:`text-xs uppercase text-[var(--gwb-muted)]`,children:`Bench miss B`}),(0,T.jsx)(`dd`,{children:e.teamB.benchMiss?`${e.teamB.benchMiss.name} left ${e.teamB.benchMiss.points.toFixed(1)} on bench`:`—`})]})]})]},e.matchupId))}):(0,T.jsx)(`p`,{className:`text-[var(--gwb-muted)]`,children:`No head-to-head pairings found this week.`}):(0,T.jsxs)(`p`,{className:`rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]`,children:[`No scored matchups for Week `,t,` yet. Check back after lineups lock or try an earlier week.`]})}var cs={throughWeek:3,weekNote:`Week 4: none so far.`,entries:[{id:`w1-mauricio`,week:1,rosterId:2,manager:`Mauricio`,team:`Los Yajesitos`,out:{name:`A.J. Brown`,position:`WR`,points:5.6},in:{name:`Tre Tucker`,position:`WR`,points:4.7},netImpact:-.9,scoreWith:137.1,scoreWithout:138,opponentScore:124.51,opponentLabel:`Jesus`,won:!0,flipped:!1,footnote:`Won anyway; the swap actually cost 0.9.`},{id:`w2-manny`,week:2,rosterId:9,manager:`Manny`,team:`Mnny`,out:{name:`Caleb Williams`,position:`QB`,points:8.45},in:{name:`Patrick Mahomes`,position:`QB`,points:45.29},netImpact:36.84,scoreWith:183.99,scoreWithout:147.15,opponentScore:138.89,opponentLabel:`Jamil`,won:!0,flipped:!1},{id:`w2-matt`,week:2,rosterId:12,manager:`Matt`,team:`Gibbs & Grind`,out:{name:`DJ Moore`,position:`WR`,points:-.1},in:{name:`Malachi Fields`,position:`WR`,points:5},netImpact:5.1,scoreWith:130.52,scoreWithout:125.42,opponentScore:134.93,opponentLabel:`Steven`,won:!1,flipped:!1,footnote:`The first failed mulligan.`},{id:`w3-narking`,week:3,rosterId:3,manager:`NarkingR`,team:`Put em down Jeanty`,out:{name:`De'Von Achane`,position:`RB`,points:1.7,note:`knee`},in:{name:`Travis Etienne`,position:`RB`,points:9},netImpact:5.3,scoreWith:136.7,scoreWithout:131.4,opponentScore:167.66,opponentLabel:`Darkseid Jackson`,won:!1,flipped:!1},{id:`w3-danny`,week:3,rosterId:1,manager:`Santagua`,managerShort:`Danny`,team:`Lambs2Slaughter`,out:{name:`Rashod Bateman`,position:`WR`,points:5.7},in:{name:`Dontayvion Wicks`,position:`WR`,points:5.2},netImpact:-.5,scoreWith:121.69,scoreWithout:122.19,opponentScore:131.97,opponentLabel:`Hadi`,won:!1,flipped:!1}]},ls=cs.entries,us={throughWeek:cs.throughWeek,weekNote:cs.weekNote};function ds(e,t){return ls.find(n=>n.rosterId===e&&n.week<=t)}function fs(e,t=1/0){let n=ds(e,t);return n?{rosterId:e,used:!0,usedDetail:`Week ${n.week} — ${vs(n)}`}:{rosterId:e,used:!1}}function ps(e){return ls.filter(t=>t.week===e).sort((e,t)=>e.rosterId-t.rosterId)}function ms(e){return ls.filter(t=>t.week<=e).length}function hs(e){return e.used?e.usedDetail?`Used — ${e.usedDetail}`:`Used`:`Available`}function gs(e){return e.toFixed(2)}function _s(e){return`${e>=0?`+`:`−`}${gs(Math.abs(e))}`}function vs(e){return`${e.out.name} → ${e.in.name} (${_s(e.netImpact)})`}function ys(e){let t=e.managerShort?`${e.manager} / ${e.managerShort}`:e.manager,n=e.out.note?` (${e.out.note})`:``,r=`${gs(e.scoreWith)}–${gs(e.opponentScore)}`,i=e.won?`Won`:`Lost`,a=e.won?`vs`:`to`,o=e.flipped?`Flipped result`:`No flip`,s=e.footnote?` · ${e.footnote}`:``;return`W${e.week} · ${t} (${e.team}) · OUT ${e.out.name} ${e.out.position} ${gs(e.out.points)}${n} → IN ${e.in.name} ${e.in.position} ${gs(e.in.points)} · Net ${_s(e.netImpact)} · ${i} ${r} ${a} ${e.opponentLabel} (would've been ${gs(e.scoreWithout)} without it) · ${o}${s}`}var bs=12;function xs({rows:e,selectedWeek:t,statusThroughWeek:n,deferralNote:r}){let i=ps(t),a=ms(n),o=[...e].sort((e,t)=>e.teamName.localeCompare(t.teamName));return(0,T.jsxs)(`div`,{id:`mulligans-section`,className:`space-y-6`,children:[r&&(0,T.jsx)(`p`,{className:`rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100`,children:r}),(0,T.jsxs)(`div`,{children:[(0,T.jsx)(`h3`,{className:`mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]`,children:`Mulligan status`}),(0,T.jsxs)(`p`,{className:`mb-3 text-xs text-[var(--gwb-muted)]`,children:[`One per manager per season. `,a,` used / `,bs,` managers through Week `,n,`.`,` `,n>=us.throughWeek?us.weekNote:``,` `,`None flipped a result.`]}),(0,T.jsx)(`div`,{className:`overflow-x-auto rounded-xl border border-[var(--gwb-border)]`,children:(0,T.jsxs)(`table`,{className:`w-full min-w-[360px] text-left text-sm`,children:[(0,T.jsx)(`thead`,{className:`bg-[var(--gwb-surface)] text-[var(--gwb-muted)] uppercase text-xs tracking-wider`,children:(0,T.jsxs)(`tr`,{children:[(0,T.jsx)(`th`,{className:`px-3 py-2`,children:`Manager`}),(0,T.jsx)(`th`,{className:`px-3 py-2`,children:`Mulligan`})]})}),(0,T.jsx)(`tbody`,{children:o.map(e=>{let t=fs(e.rosterId,n);return(0,T.jsxs)(`tr`,{className:`border-t border-[var(--gwb-border)] odd:bg-[#0d1319]`,children:[(0,T.jsxs)(`td`,{className:`px-3 py-2.5`,children:[(0,T.jsx)(`div`,{className:`font-medium`,children:e.teamName}),(0,T.jsx)(`div`,{className:`text-xs text-[var(--gwb-muted)]`,children:e.displayName})]}),(0,T.jsx)(`td`,{className:`px-3 py-2.5 text-sm ${t.used?`text-amber-300`:`text-[var(--gwb-muted)]`}`,children:hs(t)})]},e.rosterId)})})]})})]}),(0,T.jsxs)(`div`,{children:[(0,T.jsxs)(`h3`,{className:`mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]`,children:[`Week `,t,` mulligans`]}),i.length===0?(0,T.jsxs)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:[`No mulligans used in Week `,t,`.`]}):(0,T.jsx)(`ul`,{className:`space-y-2`,children:i.map(e=>(0,T.jsx)(`li`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5 text-sm leading-snug text-[var(--gwb-text)]`,children:ys(e)},e.id))})]})]})}var Ss=[],Cs=`/gwb-fe006a16/`;function ws(e,t,n){return`${Cs}slides/${e}.${t}.${n}`}var Ts=new Set(Ss.map(e=>e.id));function Es(e){return e.filter(e=>!Ts.has(e.id))}function Ds(e){return Os(e).flatMap(e=>e.slides)}function Os(e){let t=[];if(e===4){let e=Es(zs);e.length&&t.push({kind:`matchups`,heading:`Matchups`,slides:e});let n=Es(Rs);return n.length&&t.push({kind:`report`,heading:`Report`,slides:n}),t}let n={1:Es(Bs),2:Es(Vs),3:Es(Hs)}[e];n?.length&&t.push({kind:`results`,heading:`Results`,slides:n});let r={1:Es(Ns),2:Es(Ps),3:Es(Fs)}[e];return r?.length&&t.push({kind:`report`,heading:`Report`,slides:r}),t}var ks={width:1080,height:1350};function As(e,t){return{id:e,title:t,basename:e,...ks}}function js(e,t,n){let r=`w${e}-slide-${String(t).padStart(2,`0`)}`;return{id:r,title:n,basename:r,...ks}}function Ms(e,t){return t.map((t,n)=>js(e,n+1,t))}var Ns=Ms(1,[`We are so back`,`Slide 2`,`Slide 3`,`Slide 4`,`Slide 5`,`Slide 6`,`Slide 7`,`Slide 8`,`Slide 9`,`Slide 10`,`Slide 11`,`Slide 12`,`Slide 13`,`Slide 14`,`Slide 15`,`Slide 16`]),Ps=Ms(2,[`Week 2 final report`,`Slide 2`,`Slide 3`,`Slide 4`,`Slide 5`,`Slide 6`,`Slide 7`,`Slide 8`,`Slide 9`,`Slide 10`,`Slide 11`,`Slide 12`,`Slide 13`,`Slide 14`,`Slide 15`,`Slide 16`]),Fs=Ms(3,[`Week 3 final report`,`Slide 2`,`Slide 3`,`Slide 4`,`Slide 5`,`Slide 6`,`Slide 7`,`Slide 8`,`Slide 9`,`Slide 10`,`Slide 11`,`Slide 12`,`Slide 13`,`Slide 14`,`Slide 15`,`Slide 16`]);function Is(e,t){return{id:e,title:t,basename:e,...ks}}function Ls(e,t){return{id:e,title:t,basename:e,...ks}}var Rs=[As(`w4-slide-01`,`Waivers, injuries & panic`),As(`w4-slide-02`,`Slide 2`),As(`w4-slide-03`,`Slide 3`),As(`w4-slide-04`,`The rest of the wire`),As(`w4-slide-05`,`Slide 5`),As(`w4-slide-06`,`Slide 6`),As(`w4-slide-07`,`Slide 7`),As(`w4-slide-08`,`Slide 8`),As(`w4-slide-09`,`Slide 9`),As(`w4-slide-10`,`Hadi vs Manny (matchup 3)`),As(`w4-slide-11`,`Slide 11`),As(`w4-slide-12`,`Slide 12`),As(`w4-slide-13`,`Slide 13`),As(`w4-slide-14`,`QB heat check`),As(`w4-slide-15`,`Waiver awards`),As(`w4-slide-16`,`Crooke's picks`)],zs=[Is(`vs-m1-narking-steven`,`Narking vs Steven`),Is(`vs-m2-kayser-frankie`,`Kayser vs Frankie`),Is(`vs-m3-hadi-manny`,`Hadi vs Manny`),Is(`vs-m4-jamil-matt`,`Jamil vs Matt`),Is(`vs-m5-mauricio-eric`,`Mauricio vs Eric`),Is(`vs-m6-danny-crooke`,`Danny vs Crooke`)],Bs=[Ls(`results-w1-m1`,`Mauricio 137.1 – Crooke 124.5`),Ls(`results-w1-m2`,`Kayser 138.7 – Hadi 119.4`),Ls(`results-w1-m3`,`Matt 175.1 – Narking 158.2`),Ls(`results-w1-m4`,`Jamil 171.7 – Danny 111.9`),Ls(`results-w1-m5`,`Steven 199.4 – Frankie 135.4`),Ls(`results-w1-m6`,`Manny 133.2 – Eric 129.1`)],Vs=[Ls(`results-w2-m1`,`Hadi 151.0 – Crooke 123.7`),Ls(`results-w2-m2`,`Narking 131.9 – Mauricio 99.8`),Ls(`results-w2-m3`,`Kayser 170.9 – Danny 143.0`),Ls(`results-w2-m4`,`Steven 134.9 – Matt 130.5`),Ls(`results-w2-m5`,`Manny 184.0 – Jamil 138.9`),Ls(`results-w2-m6`,`Eric 142.7 – Frankie 105.2`)],Hs=[Ls(`results-w3-m1`,`Crooke 167.7 – Narking 136.7`),Ls(`results-w3-m2`,`Hadi 132.0 – Danny 121.7`),Ls(`results-w3-m3`,`Steven 199.2 – Mauricio 123.9`),Ls(`results-w3-m4`,`Kayser 151.9 – Manny 129.7`),Ls(`results-w3-m5`,`Eric 130.4 – Matt 128.6`),Ls(`results-w3-m6`,`Jamil 113.6 – Frankie 95.8`)],Us=48;function Ws({slides:e,index:t,onClose:n,onIndexChange:r}){let i=(0,v.useRef)(null),a=(0,v.useRef)(null),o=(0,v.useRef)(null),[s,c]=(0,v.useState)(!1),l=e[t],u=(0,v.useCallback)(()=>{t>0&&r(t-1)},[t,r]),d=(0,v.useCallback)(()=>{t<e.length-1&&r(t+1)},[t,r,e.length]);(0,v.useEffect)(()=>{let e=document.body.style.overflow;return document.body.style.overflow=`hidden`,i.current?.focus(),()=>{document.body.style.overflow=e}},[]),(0,v.useEffect)(()=>{c(!1)},[l?.basename]),(0,v.useEffect)(()=>{let e=e=>{e.key===`Escape`?(e.preventDefault(),n()):e.key===`ArrowLeft`?(e.preventDefault(),u()):e.key===`ArrowRight`&&(e.preventDefault(),d())};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[n,u,d]);let f=e=>{o.current=e.changedTouches[0]?.clientX??null},p=e=>{let t=o.current,n=e.changedTouches[0]?.clientX;if(o.current=null,t==null||n==null)return;let r=n-t;r>Us?u():r<-48&&d()},m=(0,v.useCallback)(async()=>{let e=a.current;if(e){try{typeof e.decode==`function`&&await e.decode()}catch{}e.naturalWidth>0&&c(!0)}},[]);if(!l)return null;let h=ws(l.basename,`full`,`webp`),g=ws(l.basename,`full`,`jpg`);return(0,T.jsxs)(`div`,{ref:i,role:`dialog`,"aria-modal":`true`,"aria-label":`Slide ${t+1} of ${e.length}: ${l.title}`,tabIndex:-1,className:`fixed inset-0 z-50 flex flex-col bg-black/92 backdrop-blur-sm`,onClick:e=>{e.target===e.currentTarget&&n()},onTouchStart:f,onTouchEnd:p,children:[(0,T.jsxs)(`div`,{className:`flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-6`,children:[(0,T.jsxs)(`p`,{className:`truncate text-sm text-white/80`,children:[t+1,` / `,e.length,(0,T.jsxs)(`span`,{className:`hidden sm:inline`,children:[` · `,l.title]})]}),(0,T.jsx)(`button`,{type:`button`,className:`rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gwb-accent)]`,onClick:n,"aria-label":`Close slide viewer`,children:`Close`})]}),(0,T.jsxs)(`div`,{className:`relative flex min-h-0 flex-1 items-center justify-center px-14 pb-4 pt-2 sm:px-20`,children:[(0,T.jsx)(`button`,{type:`button`,className:`absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 p-3 text-white hover:bg-black/70 disabled:opacity-30 sm:left-4`,onClick:u,disabled:t===0,"aria-label":`Previous slide`,children:(0,T.jsx)(`span`,{"aria-hidden":`true`,children:`‹`})}),(0,T.jsxs)(`div`,{className:`relative z-10 flex max-h-[min(78dvh,900px)] w-full max-w-[min(100%,720px)] items-center justify-center`,children:[!s&&(0,T.jsx)(`div`,{className:`absolute inset-0 flex items-center justify-center text-sm text-white/50`,"aria-hidden":`true`,children:`Loading slide…`}),(0,T.jsx)(`img`,{ref:a,src:g,srcSet:`${h} 1080w`,sizes:`(max-width: 720px) 100vw, 720px`,alt:l.title,width:l.width,height:l.height,decoding:`async`,fetchPriority:`high`,className:`block max-h-[min(78dvh,900px)] w-auto max-w-full object-contain transition-opacity duration-150 ${s?`opacity-100`:`opacity-0`}`,draggable:!1,onLoad:()=>{m()},onError:e=>{let t=e.currentTarget;t.src.endsWith(`.jpg`)||(t.removeAttribute(`srcset`),t.src=g)}},l.basename)]}),(0,T.jsx)(`button`,{type:`button`,className:`absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 p-3 text-white hover:bg-black/70 disabled:opacity-30 sm:right-4`,onClick:d,disabled:t===e.length-1,"aria-label":`Next slide`,children:(0,T.jsx)(`span`,{"aria-hidden":`true`,children:`›`})})]})]})}var Gs=540,Ks=675;function qs({slide:e,indexInWeek:t,onOpen:n,eager:r}){let i=ws(e.basename,`thumb`,`webp`),a=ws(e.basename,`thumb`,`jpg`);return(0,T.jsxs)(`button`,{type:`button`,className:`group block w-full overflow-hidden rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] text-left transition hover:border-[var(--gwb-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gwb-accent)]`,onClick:()=>n(t),"aria-label":`Open ${e.title}`,children:[(0,T.jsx)(`img`,{src:a,srcSet:`${i} ${Gs}w`,sizes:`(max-width: 1024px) 50vw, 20vw`,alt:``,width:Gs,height:Ks,loading:r?`eager`:`lazy`,decoding:`async`,className:`aspect-[4/5] w-full bg-[#0d1319] object-cover transition group-hover:opacity-95`}),(0,T.jsx)(`p`,{className:`truncate px-2 py-1.5 text-xs text-[var(--gwb-muted)]`,children:e.title})]})}function Js({week:e}){let t=(0,v.useMemo)(()=>Os(e),[e]),n=(0,v.useMemo)(()=>Ds(e),[e]),[r,i]=(0,v.useState)(null),a=(0,v.useMemo)(()=>{let e=new Map;return n.forEach((t,n)=>e.set(t.id,n)),e},[n]),o=(0,v.useCallback)(e=>i(e),[]),s=(0,v.useCallback)(()=>i(null),[]);return t.length?(0,T.jsxs)(`div`,{className:`space-y-6`,children:[(0,T.jsxs)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:[`Week `,e,` graphics. Tap a card for full size; swipe or use arrows in the viewer to move through this week only.`]}),(0,T.jsx)(`div`,{className:`flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-6`,children:t.map(n=>(0,T.jsxs)(`section`,{id:`graphics-week-${e}-${n.kind}`,className:`min-w-0 flex-1`,"aria-labelledby":`graphics-heading-${e}-${n.kind}`,children:[(0,T.jsx)(`h3`,{id:`graphics-heading-${e}-${n.kind}`,className:`mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-accent)]`,children:n.heading}),(0,T.jsx)(`ul`,{className:`grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2`,role:`list`,children:n.slides.map((e,r)=>{let i=a.get(e.id)??0;return(0,T.jsx)(`li`,{children:(0,T.jsx)(qs,{slide:e,indexInWeek:i,onOpen:o,eager:r<4&&n.kind===t[0]?.kind})},e.id)})})]},n.kind))}),r!==null&&(0,T.jsx)(Ws,{slides:n,index:r,onClose:s,onIndexChange:i})]}):(0,T.jsxs)(`p`,{className:`rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]`,children:[`No published graphics for Week `,e,` yet. Try another week.`]})}function Ys(e){if(e.length===0)return``;let t=e[e.length-1],n=0;for(let r=e.length-1;r>=0&&e[r]===t;r--)n++;return`${n}${t}`}function Xs(e){let t=e.map(e=>({...e,winPct:(e.wins+e.ties*.5)/Math.max(e.wins+e.losses+e.ties,1)}));return t.sort((e,t)=>t.winPct===e.winPct?t.pointsFor===e.pointsFor?e.pointsAgainst-t.pointsAgainst:t.pointsFor-e.pointsFor:t.winPct-e.winPct),t.map((e,t)=>({rank:t+1,rosterId:e.rosterId,teamName:e.teamName,displayName:e.displayName,wins:e.wins,losses:e.losses,ties:e.ties,pointsFor:e.pointsFor,pointsAgainst:e.pointsAgainst,streak:e.streak}))}function Zs(e,t,n){let r=new Map;for(let e of t.keys())r.set(e,{wins:0,losses:0,ties:0,pointsFor:0,pointsAgainst:0,outcomes:[]});for(let t=1;t<=n;t++){let n=e.get(t);if(!n?.length)continue;let i=new Map;for(let e of n){let t=i.get(e.matchup_id)??[];t.push(e),i.set(e.matchup_id,t)}for(let e of i.values()){if(e.length!==2)continue;let[t,n]=e,i=r.get(t.roster_id),a=r.get(n.roster_id);i&&a&&(i.pointsFor+=t.points,i.pointsAgainst+=n.points,a.pointsFor+=n.points,a.pointsAgainst+=t.points,t.points>n.points?(i.wins++,a.losses++,i.outcomes.push(`W`),a.outcomes.push(`L`)):n.points>t.points?(a.wins++,i.losses++,a.outcomes.push(`W`),i.outcomes.push(`L`)):(i.ties++,a.ties++,i.outcomes.push(`T`),a.outcomes.push(`T`)))}}return Xs([...t.entries()].map(([e,t])=>{let n=r.get(e);return{rosterId:e,teamName:t.teamName,displayName:t.displayName,wins:n.wins,losses:n.losses,ties:n.ties,pointsFor:n.pointsFor,pointsAgainst:n.pointsAgainst,streak:Ys(n.outcomes)}}))}function Qs(e,t){return Xs(e.map(e=>{let n=t.get(e.roster_id),r=e.settings.wins??0,i=e.settings.losses??0,a=e.settings.ties??0;return{rosterId:e.roster_id,teamName:n?.teamName??`Team ${e.roster_id}`,displayName:n?.displayName??``,wins:r,losses:i,ties:a,pointsFor:ne(e.settings),pointsAgainst:re(e.settings),streak:e.metadata?.streak??``}}))}function $s(e){let t=e.ties?`-${e.ties}`:``;return`${e.wins}-${e.losses}${t}`}function ec({rows:e,deferralNote:t}){return(0,T.jsxs)(`div`,{className:`space-y-3`,children:[t&&(0,T.jsx)(`p`,{className:`rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100`,children:t}),(0,T.jsx)(`div`,{className:`overflow-x-auto rounded-xl border border-[var(--gwb-border)]`,children:(0,T.jsxs)(`table`,{className:`w-full min-w-[520px] text-left text-sm`,children:[(0,T.jsx)(`thead`,{className:`bg-[var(--gwb-surface)] text-[var(--gwb-muted)] uppercase text-xs tracking-wider`,children:(0,T.jsxs)(`tr`,{children:[(0,T.jsx)(`th`,{className:`px-3 py-2`,children:`#`}),(0,T.jsx)(`th`,{className:`px-3 py-2`,children:`Team`}),(0,T.jsx)(`th`,{className:`px-3 py-2`,children:`W-L-T`}),(0,T.jsx)(`th`,{className:`px-3 py-2`,children:`PF`}),(0,T.jsx)(`th`,{className:`px-3 py-2`,children:`PA`}),(0,T.jsx)(`th`,{className:`px-3 py-2`,children:`Streak`})]})}),(0,T.jsx)(`tbody`,{children:e.map(e=>(0,T.jsxs)(`tr`,{className:`border-t border-[var(--gwb-border)] odd:bg-[#0d1319]`,children:[(0,T.jsx)(`td`,{className:`px-3 py-2.5 font-semibold text-[var(--gwb-accent)]`,children:e.rank}),(0,T.jsxs)(`td`,{className:`px-3 py-2.5`,children:[(0,T.jsx)(`div`,{className:`font-medium`,children:e.teamName}),(0,T.jsx)(`div`,{className:`text-xs text-[var(--gwb-muted)]`,children:e.displayName})]}),(0,T.jsx)(`td`,{className:`px-3 py-2.5 tabular-nums`,children:$s(e)}),(0,T.jsx)(`td`,{className:`px-3 py-2.5 tabular-nums`,children:e.pointsFor.toFixed(2)}),(0,T.jsx)(`td`,{className:`px-3 py-2.5 tabular-nums`,children:e.pointsAgainst.toFixed(2)}),(0,T.jsx)(`td`,{className:`px-3 py-2.5 tabular-nums`,children:e.streak||`—`})]},e.rosterId))})]})})]})}function tc({week:e,maxWeek:t,onChange:n}){let r=Array.from({length:t},(e,t)=>t+1);return(0,T.jsxs)(`label`,{className:`flex flex-col gap-1 text-sm text-[var(--gwb-muted)]`,children:[(0,T.jsx)(`span`,{className:`font-medium uppercase tracking-wide text-xs`,children:`NFL Week`}),(0,T.jsx)(`select`,{className:`rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5 text-[var(--gwb-text)] text-base`,value:e,onChange:e=>n(Number(e.target.value)),children:r.map(e=>(0,T.jsxs)(`option`,{value:e,children:[`Week `,e]},e))})]})}var nc=`1389375326257184768`,rc=`https://api.sleeper.app/v1`,ic=`gwb_players_nfl_v1`,ac=6048e5;function oc(e){if(!e||typeof e!=`object`)return null;let t=String(e.first_name??``),n=String(e.last_name??``),r=e.full_name||`${t} ${n}`.trim()||`Unknown`;return{first_name:t,last_name:n,position:e.position??null,team:e.team??null,full_name:r}}function sc(){try{let e=localStorage.getItem(ic);if(!e)return null;let t=JSON.parse(e);return Date.now()-t.fetchedAt>ac?null:t}catch{return null}}function cc(e){let t={fetchedAt:Date.now(),players:e};try{localStorage.setItem(ic,JSON.stringify(t))}catch{}}async function lc(e=!1){if(!e){let e=sc();if(e)return e.players}let t=await fetch(`${rc}/players/nfl`);if(!t.ok)throw Error(`Failed to load players (${t.status})`);let n=await t.json(),r={};for(let[e,t]of Object.entries(n)){let n=oc(t);n&&(r[e]=n)}return cc(r),r}async function uc(e){let t=await fetch(`${rc}${e}`);if(!t.ok)throw Error(`Sleeper API ${e}: ${t.status}`);return t.json()}function dc(){return uc(`/state/nfl`)}function fc(e=nc){return uc(`/league/${e}`)}function pc(e=nc){return uc(`/league/${e}/users`)}function mc(e=nc){return uc(`/league/${e}/rosters`)}function hc(e,t=nc){return uc(`/league/${t}/matchups/${e}`)}async function gc(e,t=nc){let n=new Map;for(let r=1;r<=e;r++){let e=await hc(r,t);e?.length&&e.some(e=>e.points>0||e.starters?.length)&&n.set(r,e)}return n}function _c(e){return e.settings.last_scored_leg??e.settings.leg??0}function vc(e){return e.week??e.display_week??1}function yc(e,t){let n=_c(e);if(n>0)return n;let r=vc(t);return Math.max(1,r-1)}function bc(e,t,n){let r=vc(n),i=_c(t);return e>=r&&e>i}function xc(e,t,n){return bc(e,t,n)?`LIVE`:`FINAL`}function Sc(e,t,n){return bc(e,t,n)?yc(t,n):e}function Cc(e,t,n){return wc(e,t,n,`standings`)}function wc(e,t,n,r){return bc(e,t,n)?`Week ${e} in progress, ${r} through Week ${yc(t,n)}.`:null}function Tc(){let[e,t]=(0,v.useState)(`idle`),[n,r]=(0,v.useState)(null),[i,a]=(0,v.useState)(null),[o,s]=(0,v.useState)(1),c=(0,v.useCallback)(async()=>{t(`loading`),r(null);try{let[e,n,r,i,o]=await Promise.all([dc(),fc(),pc(),mc(),lc()]),c=vc(e),l=yc(n,e),u=await gc(Math.max(c,l)),d=te(r,i),f=Qs(i,d),p=f,m=n.roster_positions?.filter(e=>e!==`BN`&&!e.startsWith(`IR`)).length??10;s(l),a({league:n,nflState:e,rosters:i,matchupsByWeek:u,players:o,teams:d,standings:f,seasonStandings:p,starterSlots:m}),t(`ready`)}catch(e){r(e instanceof Error?e.message:`Failed to load league`),t(`error`)}},[]);return(0,v.useEffect)(()=>{c()},[c]),{state:e,error:n,data:(0,v.useMemo)(()=>{if(!i)return null;let{rosters:e,matchupsByWeek:t,teams:n,players:r,seasonStandings:a,starterSlots:l,league:u,nflState:d}=i,f=yc(u,d),p=Sc(o,u,d),m=bc(o,u,d)?f:o,h=m,g=Zs(t,n,p),_=Cc(o,u,d),v=wc(o,u,d,`mulligan status`),y=new Map;for(let[e,n]of t)e<=m&&y.set(e,n);let b=new Map;for(let[e,n]of t)e<m&&b.set(e,n);let ee=oe(e,n,y,m,l,oe(e,n,b,Math.max(m-1,1),l)),te=t.get(o),ne=te&&U(te)?Xo(te,n,r,a):[],re=bc(o,u,d),x=xc(o,u,d);return{league:u,nflState:d,rosters:e,standings:g,seasonStandings:a,power:ee,recaps:ne,matchupsByWeek:t,players:r,teams:n,selectedWeek:o,setSelectedWeek:s,refresh:c,starterSlots:l,completedWeek:f,isSelectedWeekLive:re,weekLabel:x,graphicsWeek:h,standingsThroughWeek:p,standingsDeferralNote:_,mulligansDeferralNote:v}},[i,o,c]),refresh:c}}var Ec=[{id:`standings`,label:`Standings`},{id:`mulligans`,label:`Mulligans`},{id:`power`,label:`Power`},{id:`recaps`,label:`Recaps`},{id:`gallery`,label:`Graphics`}];function Dc(){let{state:e,error:t,data:n,refresh:r}=Tc(),[i,a]=(0,v.useState)(`standings`),o=Math.max(n?.nflState.week??18,n?.league.settings.last_scored_leg??18);return(0,T.jsxs)(`div`,{className:`mx-auto flex min-h-dvh flex-col px-4 pb-8 pt-6 ${i===`gallery`?`max-w-6xl`:`max-w-3xl`}`,children:[(0,T.jsxs)(`header`,{className:`mb-6`,children:[(0,T.jsx)(`p`,{className:`text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gwb-accent)]`,children:`Command Center`}),(0,T.jsxs)(`h1`,{className:`mt-1 font-['Anton'] text-4xl uppercase leading-tight sm:text-5xl`,children:[`GWB`,` League`]}),(0,T.jsx)(`p`,{className:`mt-2 text-sm text-[var(--gwb-muted)]`,children:`REDRAFT · Sleeper public data · No tracking`})]}),e===`loading`&&(0,T.jsxs)(`div`,{className:`flex flex-1 flex-col items-center justify-center gap-3 py-20 text-[var(--gwb-muted)]`,children:[(0,T.jsx)(`div`,{className:`h-10 w-10 animate-spin rounded-full border-2 border-[var(--gwb-accent)] border-t-transparent`}),(0,T.jsx)(`p`,{children:`Loading GWB league data…`})]}),e===`error`&&(0,T.jsxs)(`div`,{className:`rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-center`,children:[(0,T.jsx)(`p`,{className:`font-medium text-red-200`,children:`Could not load league`}),(0,T.jsx)(`p`,{className:`mt-2 text-sm text-red-300/80`,children:t}),(0,T.jsx)(`button`,{type:`button`,className:`mt-4 rounded-lg bg-[var(--gwb-accent)] px-4 py-2 font-semibold text-[#1a1200]`,onClick:()=>r(),children:`Retry`})]}),e===`ready`&&n&&(0,T.jsxs)(T.Fragment,{children:[(0,T.jsxs)(`div`,{className:`mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between`,children:[(0,T.jsx)(tc,{week:n.selectedWeek,maxWeek:o,onChange:n.setSelectedWeek}),(0,T.jsxs)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:[`Season `,n.league.season,` · NFL Week `,n.nflState.week,n.isSelectedWeekLive&&(0,T.jsx)(`span`,{className:`ml-2 rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold uppercase text-amber-300`,children:`Live`})]})]}),(0,T.jsx)(`nav`,{className:`gwb-section-tabs mb-6 flex gap-1 overflow-x-auto rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-1`,"aria-label":`Sections`,children:Ec.map(e=>{let t=i===e.id;return(0,T.jsx)(`button`,{type:`button`,className:t?`gwb-section-tab gwb-section-tab--active`:`gwb-section-tab`,"aria-current":t?`page`:void 0,onClick:()=>a(e.id),children:e.label},e.id)})}),i===`standings`&&(0,T.jsxs)(`section`,{children:[(0,T.jsxs)(`h2`,{className:`mb-3 text-lg font-semibold`,children:[`Standings`,(0,T.jsxs)(`span`,{className:`ml-2 text-sm font-normal text-[var(--gwb-muted)]`,children:[`through Week `,n.standingsThroughWeek]})]}),(0,T.jsx)(`p`,{className:`mb-3 text-xs text-[var(--gwb-muted)]`,children:`Tiebreak: win%, then points for, then points against.`}),(0,T.jsx)(ec,{rows:n.standings,deferralNote:n.standingsDeferralNote})]}),i===`mulligans`&&(0,T.jsxs)(`section`,{children:[(0,T.jsx)(`h2`,{className:`mb-3 text-lg font-semibold`,children:`Mulligans`}),(0,T.jsx)(xs,{rows:n.standings,selectedWeek:n.selectedWeek,statusThroughWeek:n.standingsThroughWeek,deferralNote:n.mulligansDeferralNote})]}),i===`power`&&(0,T.jsxs)(`section`,{children:[(0,T.jsxs)(`h2`,{className:`mb-3 text-lg font-semibold`,children:[`Power rankings`,(0,T.jsxs)(`span`,{className:`ml-2 text-sm font-normal text-[var(--gwb-muted)]`,children:[`after Week `,n.graphicsWeek]})]}),(0,T.jsx)(le,{rows:n.power})]}),i===`recaps`&&(0,T.jsxs)(`section`,{className:`space-y-8`,children:[(0,T.jsxs)(`div`,{children:[(0,T.jsx)(`h2`,{className:`mb-3 text-lg font-semibold`,children:`Commissioner's recaps`}),(0,T.jsx)(as,{week:n.selectedWeek})]}),(0,T.jsxs)(`div`,{children:[(0,T.jsxs)(`h2`,{className:`mb-3 text-lg font-semibold`,children:[`Week `,n.selectedWeek,` matchup recaps`,n.isSelectedWeekLive?` (live scores)`:``]}),(0,T.jsx)(ss,{recaps:n.recaps,week:n.selectedWeek,hasScores:U(n.matchupsByWeek.get(n.selectedWeek))})]})]}),i===`gallery`&&(0,T.jsxs)(`section`,{children:[(0,T.jsxs)(`h2`,{className:`mb-3 text-lg font-semibold`,children:[`Week `,n.selectedWeek,` graphics`]}),(0,T.jsx)(Js,{week:n.selectedWeek})]})]})]})}(0,y.createRoot)(document.getElementById(`root`)).render((0,T.jsx)(v.StrictMode,{children:(0,T.jsx)(Dc,{})}));