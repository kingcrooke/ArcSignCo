var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t),e=null),t.exports),s=(e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return n||t(r,Symbol.toStringTag,{value:`Module`}),r},c=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},l=(n,r,o)=>(o=n==null?{}:e(i(n)),c(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var u=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.for(`react.view_transition`),m=Symbol.iterator;function h(e){return typeof e!=`object`||!e?null:(e=m&&e[m]||e[`@@iterator`],typeof e==`function`?e:null)}var g={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},_=Object.assign,v={};function y(e,t,n){this.props=e,this.context=t,this.refs=v,this.updater=n||g}y.prototype.isReactComponent={},y.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},y.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function b(){}b.prototype=y.prototype;function x(e,t,n){this.props=e,this.context=t,this.refs=v,this.updater=n||g}var S=x.prototype=new b;S.constructor=x,_(S,y.prototype),S.isPureReactComponent=!0;var C=Array.isArray;function ee(){}var w={H:null,A:null,T:null,S:null},T=Object.prototype.hasOwnProperty;function E(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function D(e,t){return E(e.type,t,e.props)}function te(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function ne(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var O=/\/+/g;function re(e,t){return typeof e==`object`&&e&&e.key!=null?ne(``+e.key):t.toString(36)}function ie(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(ee,ee):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function k(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,k(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+re(e,0):a,C(o)?(i=``,c!=null&&(i=c.replace(O,`$&/`)+`/`),k(o,r,i,``,function(e){return e})):o!=null&&(te(o)&&(o=D(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(O,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(C(e))for(var u=0;u<e.length;u++)a=e[u],s=l+re(a,u),c+=k(a,r,i,s,o);else if(u=h(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+re(a,u++),c+=k(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return k(ie(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function A(e,t,n){if(e==null)return e;var r=[],i=0;return k(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function ae(e){if(e._status===-1){var t=e._result,n=t();n.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t,n.status===void 0&&(n.status=`fulfilled`,n.value=t))},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t,n.status===void 0&&(n.status=`rejected`,n.reason=t))}),e._status===-1&&(e._status=0,e._result=n)}if(e._status===1)return e._result.default;throw e._result}var j=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)};function M(e){var t=w.T,n={};n.types=t===null?null:t.types,w.T=n;try{var r=e(),i=w.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(ee,j)}catch(e){j(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),w.T=t}}function oe(e){var t=w.T;if(t!==null){var n=t.types;n===null?t.types=[e]:n.indexOf(e)===-1&&n.push(e)}else M(oe.bind(null,e))}var se={map:A,forEach:function(e,t,n){A(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return A(e,function(){t++}),t},toArray:function(e){return A(e,function(e){return e})||[]},only:function(e){if(!te(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=se,e.Component=y,e.Fragment=r,e.Profiler=a,e.PureComponent=x,e.StrictMode=i,e.Suspense=l,e.ViewTransition=p,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=w,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return w.H.useMemoCache(e)}},e.addTransitionType=oe,e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=_({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!T.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return E(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)T.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return E(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=te,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:ae}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=M,e.unstable_useCacheRefresh=function(){return w.H.useCacheRefresh()},e.use=function(e){return w.H.use(e)},e.useActionState=function(e,t,n){return w.H.useActionState(e,t,n)},e.useCallback=function(e,t){return w.H.useCallback(e,t)},e.useContext=function(e){return w.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return w.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return w.H.useEffect(e,t)},e.useEffectEvent=function(e){return w.H.useEffectEvent(e)},e.useId=function(){return w.H.useId()},e.useImperativeHandle=function(e,t,n){return w.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return w.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return w.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return w.H.useMemo(e,t)},e.useOptimistic=function(e,t){return w.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return w.H.useReducer(e,t,n)},e.useRef=function(e){return w.H.useRef(e)},e.useState=function(e){return w.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return w.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return w.H.useTransition()},e.version=`19.3.0`})),d=o(((e,t)=>{t.exports=u()})),f=o((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m){if(n(c)!==null)m=!0,S||(S=!0,D());else{var t=n(l);t!==null&&O(x,t.startTime-e)}}}var S=!1,C=-1,ee=5,w=-1;function T(){return g?!0:!(e.unstable_now()-w<ee)}function E(){if(g=!1,S){var t=e.unstable_now();w=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(C),C=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&T());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&O(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?D():S=!1}}}var D;if(typeof y==`function`)D=function(){y(E)};else if(typeof MessageChannel<`u`){var te=new MessageChannel,ne=te.port2;te.port1.onmessage=E,D=function(){ne.postMessage(null)}}else D=function(){_(E,0)};function O(t,n){C=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):ee=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(C),C=-1):h=!0,O(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,S||(S=!0,D()))),r},e.unstable_shouldYield=T,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),p=o(((e,t)=>{t.exports=f()})),m=o((e=>{var t=d();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var i={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},a=Symbol.for(`react.portal`),o=Symbol.for(`react.recoverable`),s=Symbol.for(`react.optimistic_key`);function c(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:a,key:r==null?null:r===s?s:``+r,children:e,containerInfo:t,implementation:n}}var l=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function u(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,e.browser=function(e){return{$$typeof:o,_reason:e}},e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return c(e,t,null,r)},e.flushSync=function(e){var t=l.T,n=i.p;try{if(l.T=null,i.p=2,e)return e()}finally{l.T=t,i.p=n,i.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,i.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&i.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=u(n,t.crossOrigin),a=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?i.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:a,fetchPriority:o}):n===`script`&&i.d.X(e,{crossOrigin:r,integrity:a,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`){if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=u(t.as,t.crossOrigin);i.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}}else t??i.d.M(e)}},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=u(n,t.crossOrigin);i.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`){if(t){var n=u(t.as,t.crossOrigin);i.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0})}else i.d.m(e)}},e.requestFormReset=function(e){i.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return l.H.useFormState(e,t,n)},e.useFormStatus=function(){return l.H.useHostTransitionStatus()},e.version=`19.3.0`})),h=o(((e,t)=>{function n(){if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE==`function`)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=m()})),g=o((e=>{var t=p(),n=d(),r=h();function i(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function a(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function o(e){for(var t=e,n=t;n&&!n.alternate;)t=n,t.flags&4098&&(e=t.return),n=t.return;for(;t.return;)t=t.return;return t.tag===3?e:null}function s(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function c(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function l(e){if(o(e)!==e)throw Error(i(188))}function u(e){var t=e.alternate;if(!t){if(t=o(e),t===null)throw Error(i(188));return t===e?e:null}for(var n=e,r=t;;){var a=n.return;if(a===null)break;var s=a.alternate;if(s===null){if(r=a.return,r!==null){n=r;continue}break}if(a.child===s.child){for(s=a.child;s;){if(s===n)return l(a),e;if(s===r)return l(a),t;s=s.sibling}throw Error(i(188))}if(n.return!==r.return)n=a,r=s;else{for(var c=!1,u=a.child;u;){if(u===n){c=!0,n=a,r=s;break}if(u===r){c=!0,r=a,n=s;break}u=u.sibling}if(!c){for(u=s.child;u;){if(u===n){c=!0,n=s,r=a;break}if(u===r){c=!0,r=s,n=a;break}u=u.sibling}if(!c)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function f(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=f(e),t!==null)return t;e=e.sibling}return null}function m(e,t,n,r,i,a){for(;e!==null;){if((e.tag===5||e.tag===27||e.tag===6)&&n(e,r,i,a)||(e.tag!==22||e.memoizedState===null)&&(t||e.tag!==5&&e.tag!==27)&&m(e.child,t,n,r,i,a))return!0;e=e.sibling}return!1}function g(e){for(e=e.return;e!==null;){if(e.tag===3||e.tag===5||e.tag===27)return e;e=e.return}return null}function _(e){var t=!1;for(e=e.return;e!==null&&(e.tag===4&&(t=!0),e.tag!==3&&e.tag!==5&&e.tag!==27);)e=e.return;return t}function v(e){var t=[null,null],n=g(e);return n===null||y(t,e,n.child,{foundSelf:!1}),t}function y(e,t,n,r){for(;n!==null;){if(n===t)r.foundSelf=!0;else if(n.tag===5||n.tag===27||n.tag===6){if(r.foundSelf)return e[1]=n,!0;e[0]=n}else if((n.tag!==22||n.memoizedState===null)&&y(e,t,n.child,r))return!0;n=n.sibling}return!1}function b(e){switch(e.tag){case 5:case 27:case 6:return e.stateNode;case 3:return e.stateNode.containerInfo;default:throw Error(i(559))}}var x=null,S=null;function C(e,t,n){return e===n||e===t&&(x=e,!0)}function ee(e,t,n){return e===n?(S=e,!1):e===t&&(S!==null&&(x=e),!0)}function w(e){if(e===null)return null;do e=e===null?null:e.return;while(e&&e.tag!==5&&e.tag!==27&&e.tag!==3);return e||null}function T(e,t,n){for(var r=0,i=e;i;i=n(i))r++;i=0;for(var a=t;a;a=n(a))i++;for(;0<r-i;)e=n(e),r--;for(;0<i-r;)t=n(t),i--;for(;r--;){if(e===t||t!==null&&e===t.alternate)return e;e=n(e),t=n(t)}return null}var E=Object.assign,D=Symbol.for(`react.element`),te=Symbol.for(`react.transitional.element`),ne=Symbol.for(`react.portal`),O=Symbol.for(`react.fragment`),re=Symbol.for(`react.strict_mode`),ie=Symbol.for(`react.profiler`),k=Symbol.for(`react.consumer`),A=Symbol.for(`react.context`),ae=Symbol.for(`react.forward_ref`),j=Symbol.for(`react.suspense`),M=Symbol.for(`react.suspense_list`),oe=Symbol.for(`react.memo`),se=Symbol.for(`react.lazy`),ce=Symbol.for(`react.activity`),le=Symbol.for(`react.legacy_hidden`),ue=Symbol.for(`react.memo_cache_sentinel`),de=Symbol.for(`react.view_transition`),fe=Symbol.for(`react.recoverable`),pe=Symbol.iterator;function me(e){return typeof e!=`object`||!e?null:(e=pe&&e[pe]||e[`@@iterator`],typeof e==`function`?e:null)}var he=Symbol.for(`react.client.reference`);function ge(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===he?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case O:return`Fragment`;case ie:return`Profiler`;case re:return`StrictMode`;case j:return`Suspense`;case M:return`SuspenseList`;case ce:return`Activity`;case de:return`ViewTransition`}if(typeof e==`object`)switch(e.$$typeof){case ne:return`Portal`;case A:return e.displayName||`Context`;case k:return(e._context.displayName||`Context`)+`.Consumer`;case ae:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case oe:return t=e.displayName||null,t===null?ge(e.type)||`Memo`:t;case se:t=e._payload,e=e._init;try{return ge(e(t))}catch{}}return null}var _e=Array.isArray,N=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,P=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,ve={pending:!1,data:null,method:null,action:null},ye=[],be=-1;function xe(e){return{current:e}}function Se(e){0>be||(e.current=ye[be],ye[be]=null,be--)}function F(e,t){be++,ye[be]=e.current,e.current=t}var Ce=xe(null),we=xe(null),Te=xe(null),Ee=xe(null);function De(e,t){switch(F(Te,t),F(we,e),F(Ce,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?up(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=up(t),e=dp(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}Se(Ce),F(Ce,e)}function Oe(){Se(Ce),Se(we),Se(Te)}function ke(e){var t=e.memoizedState;t!==null&&(sh._currentValue=t.memoizedState,F(Ee,e)),t=Ce.current;var n=dp(t,e.type);t!==n&&(F(we,e),F(Ce,n))}function Ae(e){we.current===e&&(Se(Ce),Se(we)),Ee.current===e&&(Se(Ee),sh._currentValue=ve)}var je,Me;function Ne(e){if(je===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);je=t&&t[1]||``,Me=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+je+e+Me}var Pe=!1;function Fe(e,t){if(!e||Pe)return``;Pe=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,"props",{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}n=!1;try{var i=Object.getOwnPropertyDescriptor(e.prototype,`props`);Object.defineProperty(e.prototype,"props",{configurable:!0,set:function(){throw Error()}}),n=!0,new e}finally{n&&(i===void 0?delete e.prototype.props:Object.defineProperty(e.prototype,"props",i))}}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,"name",{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{Pe=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?Ne(n):``}function Ie(e,t){switch(e.tag){case 26:case 27:case 5:return Ne(e.type);case 16:return Ne(`Lazy`);case 13:return e.child!==t&&t!==null?Ne(`Suspense Fallback`):Ne(`Suspense`);case 19:return Ne(`SuspenseList`);case 0:case 15:return Fe(e.type,!1);case 11:return Fe(e.type.render,!1);case 1:return Fe(e.type,!0);case 31:return Ne(`Activity`);case 30:return Ne(`ViewTransition`);default:return``}}function Le(e){try{var t=``,n=null;do t+=Ie(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var Re=Object.prototype.hasOwnProperty,ze=t.unstable_scheduleCallback,Be=t.unstable_cancelCallback,Ve=t.unstable_shouldYield,He=t.unstable_requestPaint,Ue=t.unstable_now,We=t.unstable_getCurrentPriorityLevel,Ge=t.unstable_ImmediatePriority,Ke=t.unstable_UserBlockingPriority,qe=t.unstable_NormalPriority,Je=t.unstable_LowPriority,Ye=t.unstable_IdlePriority,Xe=t.log,Ze=t.unstable_setDisableYieldValue,Qe=null,$e=null;function et(e){if(typeof Xe==`function`&&Ze(e),$e&&typeof $e.setStrictMode==`function`)try{$e.setStrictMode(Qe,e)}catch{}}var tt=Math.clz32?Math.clz32:it,nt=Math.log,rt=Math.LN2;function it(e){return e>>>=0,e===0?32:31-(nt(e)/rt|0)|0}var at=256,ot=262144,st=4194304;function ct(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&-e;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function lt(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=ct(n))):i=ct(o):i=ct(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=ct(n))):i=ct(o)):i=ct(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function ut(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function dt(e,t){t&8&&(t|=t&32);var n=e.entangledLanes;if(n!==0)for(e=e.entanglements,n&=t;0<n;){var r=31-tt(n),i=1<<r;t|=e[r],n&=~i}return t}function ft(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function pt(){var e=st;return st<<=1,!(st&62914560)&&(st=4194304),e}function mt(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function ht(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function gt(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-tt(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&_t(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function _t(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-tt(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function vt(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-tt(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function yt(e,t){var n=t&-t;return n=n&42?1:bt(n),(n&(e.suspendedLanes|t))===0?n:0}function bt(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function xt(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function St(){var e=P.p;return e===0?(e=window.event,e===void 0?32:Ch(e.type)):e}function Ct(e,t){var n=P.p;try{return P.p=e,t()}finally{P.p=n}}var wt=Math.random().toString(36).slice(2),Tt=`__reactFiber$`+wt,Et=`__reactProps$`+wt,Dt=`__reactContainer$`+wt,Ot=`__reactEvents$`+wt,kt=`__reactListeners$`+wt,At=`__reactHandles$`+wt,jt=`__reactResources$`+wt,Mt=`__reactMarker$`+wt,Nt=`__reactLoad$`+wt;function Pt(e){delete e[Tt],delete e[Et],delete e[kt],delete e[At]}function Ft(e){var t;if(t=e[Tt])return t;for(var n=e.parentNode;n;){if(t=n[Dt]||n[Tt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=fm(e);e!==null;){if(n=e[Tt])return n;e=fm(e)}return t}e=n,n=e.parentNode}return null}function It(e){if(e=e[Tt]||e[Dt]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Lt(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(i(33))}function Rt(e){var t=e[jt];return t||=e[jt]={hoistableStyles:new Map,hoistableScripts:new Map},t}function zt(e){e[Mt]=!0}function Bt(e){e[Nt]=void 0}var I=new Set,Vt={};function L(e,t){Ht(e,t),Ht(e+`Capture`,t)}function Ht(e,t){for(Vt[e]=t,e=0;e<t.length;e++)I.add(t[e])}var Ut=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),Wt={},Gt={};function Kt(e){return Re.call(Gt,e)?!0:Re.call(Wt,e)?!1:Ut.test(e)?Gt[e]=!0:(Wt[e]=!0,!1)}var R=!1;function qt(){var e=R;return R=!1,e}function Jt(e,t,n){if(Kt(t)){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,n)}}}function Yt(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,n)}}function Xt(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,r)}}function Zt(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function Qt(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function $t(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function en(e){if(!e._valueTracker){var t=Qt(e)?`checked`:`value`;e._valueTracker=$t(e,t,``+e[t])}}function tn(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=Qt(e)?e.checked?`true`:`false`:e.value),e=r,e!==n&&(t.setValue(e),!0)}var nn=/[\n"\\]/g;function rn(e){return e.replace(nn,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function an(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+Zt(t)):e.value!==``+Zt(t)&&(e.value=``+Zt(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):sn(e,Zt(n)):o===`number`&&e.value==t?sn(e,Zt(e.value)):sn(e,Zt(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+Zt(s):e.removeAttribute(`name`)}function on(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){en(e);return}n=n==null?``:``+Zt(n),t=t==null?n:``+Zt(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),en(e)}function sn(e,t){e.defaultValue!==``+t&&(e.defaultValue=``+t)}function cn(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+Zt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function ln(e,t,n){if(t!=null&&(t=``+Zt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n==null?``:``+Zt(n)}function un(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(i(92));if(_e(r)){if(1<r.length)throw Error(i(93));r=r[0]}n=r}n??=``,t=n}n=Zt(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),en(e)}function dn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var fn=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function pn(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||fn.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function mn(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(i(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``,R=!0);for(var a in t)r=t[a],t.hasOwnProperty(a)&&n[a]!==r&&(pn(e,a,r),R=!0)}else for(var o in t)t.hasOwnProperty(o)&&pn(e,o,t[o])}function hn(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var gn=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`maskType`,`mask-type`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),_n=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function vn(e){return _n.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function yn(){}var bn=null;function xn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Sn=null,Cn=null;function wn(e){var t=It(e);if(t&&(e=t.stateNode)){var n=e[Et]||null;a:switch(e=t.stateNode,t.type){case`input`:if(an(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+rn(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var a=r[Et]||null;if(!a)throw Error(i(90));an(r,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&tn(r)}break a;case`textarea`:ln(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&cn(e,!!n.multiple,t,!1)}}}var Tn=!1;function En(e,t,n){if(Tn)return e(t,n);Tn=!0;try{return e(t)}finally{if(Tn=!1,(Sn!==null||Cn!==null)&&(zd(),Sn&&(t=Sn,e=Cn,Cn=Sn=null,wn(t),e)))for(t=0;t<e.length;t++)wn(e[t])}}function Dn(e,t){var n=e.stateNode;if(n===null)return null;var r=n[Et]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=e!==`button`&&e!==`input`&&e!==`select`&&e!==`textarea`),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(i(231,t,typeof n));return n}var On=typeof window<`u`&&window.document!==void 0&&window.document.createElement!==void 0,kn=!1;if(On)try{var An={};Object.defineProperty(An,"passive",{get:function(){kn=!0}}),window.addEventListener(`test`,An,An),window.removeEventListener(`test`,An,An)}catch{kn=!1}var jn=null,Mn=null,Nn=null;function Pn(){if(Nn)return Nn;var e,t=Mn,n=t.length,r,i=`value`in jn?jn.value:jn.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return Nn=i.slice(e,1<r?1-r:void 0)}function Fn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function In(){return!0}function Ln(){return!1}function Rn(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?In:Ln,this.isPropagationStopped=Ln,this}return E(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=In)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=In)},persist:function(){},isPersistent:In}),t}var zn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Bn=Rn(zn),Vn=E({},zn,{view:0,detail:0}),Hn=Rn(Vn),Un,Wn,Gn,Kn=E({},Vn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:rr,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==Gn&&(Gn&&e.type===`mousemove`?(Un=e.screenX-Gn.screenX,Wn=e.screenY-Gn.screenY):Wn=Un=0,Gn=e),Un)},movementY:function(e){return`movementY`in e?e.movementY:Wn}}),qn=Rn(Kn),Jn=Rn(E({},Kn,{dataTransfer:0})),Yn=Rn(E({},Vn,{relatedTarget:0})),Xn=Rn(E({},zn,{animationName:0,elapsedTime:0,pseudoElement:0})),Zn=Rn(E({},zn,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),Qn=Rn(E({},zn,{data:0})),$n={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},er={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},tr={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function nr(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=tr[e])?!!t[e]:!1}function rr(){return nr}var ir=Rn(E({},Vn,{key:function(e){if(e.key){var t=$n[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=Fn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?er[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:rr,charCode:function(e){return e.type===`keypress`?Fn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?Fn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),ar=Rn(E({},Kn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),or=Rn(E({},zn,{submitter:0})),sr=Rn(E({},Vn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:rr})),cr=Rn(E({},zn,{propertyName:0,elapsedTime:0,pseudoElement:0})),lr=Rn(E({},Kn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),ur=Rn(E({},zn,{newState:0,oldState:0,source:0})),dr=[9,13,27,32],fr=On&&`CompositionEvent`in window,pr=null;On&&`documentMode`in document&&(pr=document.documentMode);var mr=On&&`TextEvent`in window&&!pr,hr=On&&(!fr||pr&&8<pr&&11>=pr),gr=` `,_r=!1;function vr(e,t){switch(e){case`keyup`:return dr.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function yr(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var br=!1;function xr(e,t){switch(e){case`compositionend`:return yr(t);case`keypress`:return t.which===32?(_r=!0,gr):null;case`textInput`:return e=t.data,e===gr&&_r?null:e;default:return null}}function Sr(e,t){if(br)return e===`compositionend`||!fr&&vr(e,t)?(e=Pn(),Nn=Mn=jn=null,br=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return hr&&t.locale!==`ko`?null:t.data;default:return null}}var Cr={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function wr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!Cr[e.type]:t===`textarea`}function Tr(e,t,n,r){Sn?Cn?Cn.push(r):Cn=[r]:Sn=r,t=Jf(t,`onChange`),0<t.length&&(n=new Bn(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var Er=null,Dr=null;function Or(e){Vf(e,0)}function kr(e){if(tn(Lt(e)))return e}function Ar(e,t){if(e===`change`)return t}var jr=!1;if(On){var Mr;if(On){var Nr=`oninput`in document;if(!Nr){var Pr=document.createElement(`div`);Pr.setAttribute(`oninput`,`return;`),Nr=typeof Pr.oninput==`function`}Mr=Nr}else Mr=!1;jr=Mr&&(!document.documentMode||9<document.documentMode)}function Fr(){Er&&(Er.detachEvent(`onpropertychange`,Ir),Dr=Er=null)}function Ir(e){if(e.propertyName===`value`&&kr(Dr)){var t=[];Tr(t,Dr,e,xn(e)),En(Or,t)}}function Lr(e,t,n){e===`focusin`?(Fr(),Er=t,Dr=n,Er.attachEvent(`onpropertychange`,Ir)):e===`focusout`&&Fr()}function Rr(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return kr(Dr)}function zr(e,t){if(e===`click`)return kr(t)}function Br(e,t){if(e===`input`||e===`change`)return kr(t)}function Vr(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var Hr=typeof Object.is==`function`?Object.is:Vr;function Ur(e,t){if(Hr(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Re.call(t,i)||!Hr(e[i],t[i]))return!1}return!0}function Wr(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}function Gr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Kr(e,t){var n=Gr(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=Gr(n)}}function qr(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?qr(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Jr(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Wr(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=Wr(e.document)}return t}function Yr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var Xr=On&&`documentMode`in document&&11>=document.documentMode,Zr=null,Qr=null,$r=null,ei=!1;function ti(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;ei||Zr==null||Zr!==Wr(r)||(r=Zr,`selectionStart`in r&&Yr(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),$r&&Ur($r,r)||($r=r,r=Jf(Qr,`onSelect`),0<r.length&&(t=new Bn(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=Zr)))}function ni(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var ri={animationend:ni(`Animation`,`AnimationEnd`),animationiteration:ni(`Animation`,`AnimationIteration`),animationstart:ni(`Animation`,`AnimationStart`),transitionrun:ni(`Transition`,`TransitionRun`),transitionstart:ni(`Transition`,`TransitionStart`),transitioncancel:ni(`Transition`,`TransitionCancel`),transitionend:ni(`Transition`,`TransitionEnd`)},ii={},ai={};On&&(ai=document.createElement(`div`).style,`AnimationEvent`in window||(delete ri.animationend.animation,delete ri.animationiteration.animation,delete ri.animationstart.animation),`TransitionEvent`in window||delete ri.transitionend.transition);function oi(e){if(ii[e])return ii[e];if(!ri[e])return e;var t=ri[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in ai)return ii[e]=t[n];return e}var si=oi(`animationend`),ci=oi(`animationiteration`),li=oi(`animationstart`),ui=oi(`transitionrun`),di=oi(`transitionstart`),fi=oi(`transitioncancel`),pi=oi(`transitionend`),mi=new Map,hi=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);hi.push(`scrollEnd`);function gi(e,t){mi.set(e,t),L(t,[e])}var _i=0;function vi(e,t){if(e.name!=null&&e.name!==`auto`)return e.name;if(t.autoName!==null)return t.autoName;e=bd.identifierPrefix;var n=_i++;return e=`_`+e+`t_`+n.toString(32)+`_`,t.autoName=e}function yi(e){if(e==null||typeof e==`string`)return e;var t=null,n=Od;if(n!==null)for(var r=0;r<n.length;r++){var i=e[n[r]];if(i!=null){if(i===`none`)return`none`;t=t==null?i:t+(` `+i)}}return t??e.default}function bi(e,t){return e=yi(e),t=yi(t),t==null?e===`auto`?null:e:t===`auto`?null:t}var xi=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},Si=[],Ci=0,wi=0;function Ti(){for(var e=Ci,t=wi=Ci=0;t<e;){var n=Si[t];Si[t++]=null;var r=Si[t];Si[t++]=null;var i=Si[t];Si[t++]=null;var a=Si[t];if(Si[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&ki(n,i,a)}}function Ei(e,t,n,r){Si[Ci++]=e,Si[Ci++]=t,Si[Ci++]=n,Si[Ci++]=r,wi|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function Di(e,t,n,r){return Ei(e,t,n,r),Ai(e)}function Oi(e,t){return Ei(e,null,null,t),Ai(e)}function ki(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-tt(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function Ai(e){if(50<kd)throw kd=0,Ad=null,Error(i(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var ji={};function Mi(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Ni(e,t,n,r){return new Mi(e,t,n,r)}function Pi(e){return e=e.prototype,!(!e||!e.isReactComponent)}function Fi(e,t){var n=e.alternate;return n===null?(n=Ni(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&1206910976,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Ii(e,t){e.flags&=1206910978;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Li(e,t,n,r,a,o){var s=0;if(r=e,typeof r==`function`)Pi(r)&&(s=1);else if(typeof r==`string`)s=qm(e,n,Ce.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(r){case ce:return e=Ni(31,n,t,a),e.elementType=ce,e.lanes=o,e;case O:return Ri(n.children,a,o,t);case re:s=8,a|=24;break;case ie:return e=Ni(12,n,t,a|2),e.elementType=ie,e.lanes=o,e;case j:return e=Ni(13,n,t,a),e.elementType=j,e.lanes=o,e;case M:return e=Ni(19,n,t,a),e.elementType=M,e.lanes=o,e;case le:case de:return e=a|32,e=Ni(30,n,t,e),e.elementType=de,e.lanes=o,e.stateNode={autoName:null,paired:null,clones:null,ref:null},e;default:if(typeof r==`object`&&r)switch(r.$$typeof){case A:s=10;break a;case k:s=9;break a;case ae:s=11;break a;case oe:s=14;break a;case se:s=16,r=null;break a}s=29,n=Error(i(130,e===null?`null`:typeof e,``)),r=null}return t=Ni(s,n,t,a),t.elementType=e,t.type=r,t.lanes=o,t}function Ri(e,t,n,r){return e=Ni(7,e,r,t),e.lanes=n,e}function zi(e,t,n){return e=Ni(6,e,null,t),e.lanes=n,e}function Bi(e){var t=Ni(18,null,null,0);return t.stateNode=e,t}function Vi(e,t,n){return t=Ni(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Hi=new WeakMap;function Ui(e,t){if(typeof e==`object`&&e){var n=Hi.get(e);return n===void 0?(t={value:e,source:t,stack:Le(t)},Hi.set(e,t),t):n}return{value:e,source:t,stack:Le(t)}}var Wi=[],Gi=0,Ki=null,qi=0,Ji=[],Yi=0,Xi=null,Zi=1,Qi=``;function $i(e,t){Wi[Gi++]=qi,Wi[Gi++]=Ki,Ki=e,qi=t}function ea(e,t,n){Ji[Yi++]=Zi,Ji[Yi++]=Qi,Ji[Yi++]=Xi,Xi=e;var r=Zi;e=Qi;var i=32-tt(r)-1;r&=~(1<<i),n+=1;var a=32-tt(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Zi=1<<32-tt(t)+i|n<<i|r,Qi=a+e}else Zi=1<<a|n<<i|r,Qi=e}function ta(e){e.return!==null&&($i(e,1),ea(e,1,0))}function na(e){for(;e===Ki;)Ki=Wi[--Gi],Wi[Gi]=null,qi=Wi[--Gi],Wi[Gi]=null;for(;e===Xi;)Xi=Ji[--Yi],Ji[Yi]=null,Qi=Ji[--Yi],Ji[Yi]=null,Zi=Ji[--Yi],Ji[Yi]=null}function ra(e,t){Ji[Yi++]=Zi,Ji[Yi++]=Qi,Ji[Yi++]=Xi,Zi=t.id,Qi=t.overflow,Xi=e}var ia=null,z=null,B=!1,aa=null,oa=!1,sa=Error(i(519));function ca(e){throw ma(Ui(Error(i(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),sa}function la(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[Tt]=e,t[Et]=r,n){case`dialog`:Q(`cancel`,t),Q(`close`,t);break;case`iframe`:case`object`:case`embed`:Q(`load`,t);break;case`video`:case`audio`:for(n=0;n<zf.length;n++)Q(zf[n],t);break;case`source`:Q(`error`,t);break;case`img`:case`image`:case`link`:Q(`error`,t),Q(`load`,t);break;case`details`:Q(`toggle`,t);break;case`input`:Q(`invalid`,t),on(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:Q(`invalid`,t);break;case`textarea`:Q(`invalid`,t),un(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||ep(t.textContent,n)?(r.popover!=null&&(Q(`beforetoggle`,t),Q(`toggle`,t)),r.onScroll!=null&&Q(`scroll`,t),r.onScrollEnd!=null&&Q(`scrollend`,t),r.onClick!=null&&(t.onclick=yn),t=!0):t=!1,t||ca(e,!0)}function ua(e){for(ia=e.return;ia;)switch(ia.tag){case 5:case 31:case 13:oa=!1;return;case 27:case 3:oa=!0;return;default:ia=ia.return}}function da(e){if(e!==ia)return!1;if(!B)return ua(e),B=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=n===`form`||n===`button`||pp(e.type,e.memoizedProps)),n=!n),n&&z&&ca(e),ua(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));z=dm(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));z=dm(e)}else t===27?(t=z,Sp(e.type)?(e=um,um=null,z=e):z=t):z=ia?lm(e.stateNode.nextSibling):null;return!0}function fa(){z=ia=null,B=!1}function pa(){var e=aa;return e!==null&&(fd===null?fd=e:fd.push.apply(fd,e),aa=null),e}function ma(e){aa===null?aa=[e]:aa.push(e)}var ha=xe(null),ga=null,_a=null;function va(e,t,n){F(ha,t._currentValue),t._currentValue=n}function ya(e){e._currentValue=ha.current,Se(ha)}function ba(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function xa(e,t,n,r){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var o=a.dependencies;if(o!==null){var s=a.child;o=o.firstContext;a:for(;o!==null;){var c=o;o=a;for(var l=0;l<t.length;l++)if(c.context===t[l]){o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),ba(o.return,n,e),r||(s=null);break a}o=c.next}}else if(a.tag===18){if(s=a.return,s===null)throw Error(i(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),ba(s,n,e),s=null}else a.tag===13&&a.memoizedState!==null&&a.memoizedState.dehydrated===null?(a.lanes|=n,s=a.alternate,s!==null&&(s.lanes|=n),ba(a.return,n,e),s=a.child,s=s===null?null:s.sibling):s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===e){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}}function Sa(e,t,n,r){e=null;for(var a=t,o=!1;a!==null;){if(!o){if(a.flags&524288)o=!0;else if(a.flags&262144)break}if(a.tag===10){var s=a.alternate;if(s===null)throw Error(i(387));if(s=s.memoizedProps,s!==null){var c=a.type;Hr(a.pendingProps.value,s.value)||(e===null?e=[c]:e.push(c))}}else if(a===Ee.current){if(s=a.alternate,s===null)throw Error(i(387));s.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e===null?e=[sh]:e.push(sh))}a=a.return}return e!==null&&xa(t,e,n,r),t.flags|=262144,e!==null}function Ca(e){for(e=e.firstContext;e!==null;){if(!Hr(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function wa(e){ga=e,_a=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function Ta(e){return Da(ga,e)}function Ea(e,t){return ga===null&&wa(e),Da(e,t)}function Da(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},_a===null){if(e===null)throw Error(i(308));_a=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else _a=_a.next=t;return n}var Oa=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},ka=t.unstable_scheduleCallback,Aa=t.unstable_NormalPriority,ja={$$typeof:A,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Ma(){return{controller:new Oa,data:new Map,refCount:0}}function Na(e){e.refCount--,e.refCount===0&&ka(Aa,function(){e.controller.abort()})}function Pa(e,t){if(e.pendingLanes&4194048){var n=e.transitionTypes;for(n===null&&(n=e.transitionTypes=[]),e=0;e<t.length;e++){var r=t[e];n.indexOf(r)===-1&&n.push(r)}}}var Fa=null;function Ia(e){var t=e.transitionTypes;return e.transitionTypes=null,t}var La=null,Ra=0,za=0,Ba=null;function Va(e,t){if(La===null){var n=La=[];Ra=0,za=Pf(),Ba={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return Ra++,t.then(Ha,Ha),t}function Ha(){if(--Ra===0&&(Fa=null,La!==null)){Ba!==null&&(Ba.status=`fulfilled`);var e=La;La=null,za=0,Ba=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Ua(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var Wa=N.S;N.S=function(e,t){if(hd=Ue(),typeof t==`object`&&t&&typeof t.then==`function`&&Va(e,t),Fa!==null)for(var n=bf;n!==null;)Pa(n,Fa),n=n.next;if(n=e.types,n!==null){for(var r=bf;r!==null;)Pa(r,n),r=r.next;if(za!==0){r=Fa,r===null&&(r=Fa=[]);for(var i=0;i<n.length;i++){var a=n[i];r.indexOf(a)===-1&&r.push(a)}}}Wa!==null&&Wa(e,t)};var Ga=xe(null);function Ka(){var e=Ga.current;return e===null?q.pooledCache:e}function qa(e,t){t===null?F(Ga,Ga.current):F(Ga,t.pool)}function Ja(){var e=Ka();return e===null?null:{parent:ja._currentValue,pool:e}}var Ya=Error(i(460)),Xa=Error(i(474)),Za=Error(i(542)),Qa={then:function(){}};function $a(e){return e=e.status,e===`fulfilled`||e===`rejected`}function eo(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(yn,yn),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,io(e),e===void 0&&!(`reason`in t)?Error(i(600)):e;default:if(typeof t.status==`string`)t.then(yn,yn);else{if(e=q,e!==null&&100<e.shellSuspendCounter)throw Error(i(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,io(e),e}throw no=t,Ya}}function to(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(no=e,Ya):e}}var no=null;function ro(){if(no===null)throw Error(i(459));var e=no;return no=null,e}function io(e){if(e===Ya||e===Za)throw Error(i(483))}var ao=null,oo=0;function so(e){var t=oo;return oo+=1,ao===null&&(ao=[]),eo(ao,e,t)}function co(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function lo(e,t){throw t.$$typeof===D?Error(i(525)):(e=Object.prototype.toString.call(t),Error(i(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function uo(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function a(e,t){return e=Fi(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=134217730,n):(r=r.index,r<n?(t.flags|=2,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=134217730),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=zi(n,e.mode,r),t.return=e,t):(t=a(t,n),t.return=e,t)}function l(e,t,n,r){var i=n.type;return i===O?(e=d(e,t,n.props.children,r,n.key),co(e,n),e):t!==null&&(t.elementType===i||typeof i==`object`&&i&&i.$$typeof===se&&to(i)===t.type)?(t=a(t,n.props),co(t,n),t.return=e,t):(t=Li(n.type,n.key,n.props,null,e.mode,r),co(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=Vi(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,i){return t===null||t.tag!==7?(t=Ri(n,e.mode,r,i),t.return=e,t):(t=a(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=zi(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case te:return n=Li(t.type,t.key,t.props,null,e.mode,n),co(n,t),n.return=e,n;case ne:return t=Vi(t,e.mode,n),t.return=e,t;case se:return t=to(t),f(e,t,n)}if(_e(t)||me(t))return t=Ri(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,so(t),n);if(t.$$typeof===A)return f(e,Ea(e,t),n);lo(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case te:return n.key===i?l(e,t,n,r):null;case ne:return n.key===i?u(e,t,n,r):null;case se:return n=to(n),p(e,t,n,r)}if(_e(n)||me(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,so(n),r);if(n.$$typeof===A)return p(e,t,Ea(e,n),r);lo(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case te:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case ne:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case se:return r=to(r),m(e,t,n,r,i)}if(_e(r)||me(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,so(r),i);if(r.$$typeof===A)return m(e,t,n,Ea(t,r),i);lo(t,r)}return null}function h(i,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),B&&$i(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return B&&$i(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&(_=g.alternate,_!==null&&d.delete(_.key===null?h:_.key)),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),B&&$i(i,h),l}function g(a,s,c,l){if(c==null)throw Error(i(151));for(var u=null,d=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(a,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(a,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(a,h),B&&$i(a,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(a,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return B&&$i(a,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,a,g,v.value,l),v!==null&&(e&&(_=v.alternate,_!==null&&h.delete(_.key===null?g:_.key)),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(a,e)}),B&&$i(a,g),u}function _(e,r,o,c){if(typeof o==`object`&&o&&o.type===O&&o.key===null&&o.props.ref===void 0&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case te:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===O){if(r.tag===7){n(e,r.sibling),c=a(r,o.props.children),co(c,o),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===se&&to(l)===r.type){n(e,r.sibling),c=a(r,o.props),co(c,o),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}o.type===O?(c=Ri(o.props.children,e.mode,c,o.key),co(c,o),c.return=e,e=c):(c=Li(o.type,o.key,o.props,null,e.mode,c),co(c,o),c.return=e,e=c)}return s(e);case ne:a:{for(l=o.key;r!==null;){if(r.key===l){if(r.tag===4&&r.stateNode.containerInfo===o.containerInfo&&r.stateNode.implementation===o.implementation){n(e,r.sibling),c=a(r,o.children||[]),c.return=e,e=c;break a}n(e,r);break}t(e,r),r=r.sibling}c=Vi(o,e.mode,c),c.return=e,e=c}return s(e);case se:return o=to(o),_(e,r,o,c)}if(_e(o))return h(e,r,o,c);if(me(o)){if(l=me(o),typeof l!=`function`)throw Error(i(150));return o=l.call(o),g(e,r,o,c)}if(typeof o.then==`function`)return _(e,r,so(o),c);if(o.$$typeof===A)return _(e,r,Ea(e,o),c);lo(e,o)}return typeof o==`string`&&o!==``||typeof o==`number`||typeof o==`bigint`?(o=``+o,r!==null&&r.tag===6?(n(e,r.sibling),c=a(r,o),c.return=e,e=c):(n(e,r),c=zi(o,e.mode,c),c.return=e,e=c),s(e)):n(e,r)}return function(e,t,n,r){try{oo=0;var i=_(e,t,n,r);return ao=null,i}catch(t){if(t===Ya||t===Za)throw t;var a=Ni(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var fo=uo(!0),po=uo(!1),mo=!1;function ho(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function go(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function _o(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function vo(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,K&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=Ai(e),ki(e,null,n),t}return Ei(e,r,t,n),Ai(e)}function V(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,vt(e,n)}}function yo(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var bo=!1;function xo(){if(bo){var e=Ba;if(e!==null)throw e}}function So(e,t,n,r){bo=!1;var i=e.updateQueue;mo=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane&-536870913,p=f!==s.lane;if(p?(Y&f)===f:(r&f)===f){f!==0&&f===za&&(bo=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var m=e,h=s;f=t;var g=n;switch(h.tag){case 1:if(m=h.payload,typeof m==`function`){d=m.call(g,d,f);break a}d=m;break a;case 3:m.flags=m.flags&-65537|128;case 0:if(m=h.payload,f=typeof m==`function`?m.call(g,d,f):m,f==null)break a;d=E({},d,f);break a;case 2:mo=!0}}f=s.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[f]:p.push(f))}else p={lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),od|=o,e.lanes=o,e.memoizedState=d}}function Co(e,t){if(typeof e!=`function`)throw Error(i(191,e));e.call(t)}function wo(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)Co(n[e],t)}var To=xe(null),Eo=xe(0);function Do(e,t){e=id,F(Eo,e),F(To,t),id=e|t.baseLanes}function Oo(){F(Eo,id),F(To,To.current)}function ko(){id=Eo.current,Se(To),Se(Eo)}var Ao=xe(null),jo=null;function Mo(e){var t=e.alternate;F(Lo,Lo.current&1),F(Ao,e),jo===null&&(t===null||To.current!==null||t.memoizedState!==null)&&(jo=e)}function No(e){F(Lo,Lo.current),F(Ao,e),jo===null&&(jo=e)}function Po(e){e.tag===22?(F(Lo,Lo.current),F(Ao,e),jo===null&&(jo=e)):Fo()}function Fo(){F(Lo,Lo.current),F(Ao,Ao.current)}function Io(e){Se(Ao),jo===e&&(jo=null),Se(Lo)}var Lo=xe(0);function Ro(e,t){F(Ao,Ao.current),F(Lo,t)}function zo(e){Se(Lo),Se(Ao),jo===e&&(jo=null)}function Bo(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||om(n)||sm(n)))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==`independent`){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Vo=0,H=null,U=null,Ho=null,Uo=!1,Wo=!1,Go=!1,Ko=0,qo=0,Jo=null,Yo=0;function Xo(){throw Error(i(321))}function Zo(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Hr(e[n],t[n]))return!1;return!0}function Qo(e,t,n,r,i,a){return Vo=a,H=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,N.H=e===null||e.memoizedState===null?hc:gc,Go=!1,a=n(r,i),Go=!1,Wo&&(a=es(t,n,r,i)),$o(e),a}function $o(e){N.H=mc;var t=U!==null&&U.next!==null;if(Vo=0,Ho=U=H=null,Uo=!1,qo=0,Jo=null,t)throw Error(i(300));e===null||Nc||(e=e.dependencies,e!==null&&Ca(e)&&(Nc=!0))}function es(e,t,n,r){H=e;var a=0;do{if(Wo&&(Jo=null),qo=0,Wo=!1,25<=a)throw Error(i(301));if(a+=1,Ho=U=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}N.H=_c,o=t(n,r)}while(Wo);return o}function ts(){var e=N.H,t=e.useState()[0];return t=typeof t.then==`function`?cs(t):t,e=e.useState()[0],(U===null?null:U.memoizedState)!==e&&(H.flags|=1024),t}function ns(){var e=Ko!==0;return Ko=0,e}function rs(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function is(e){if(Uo){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}Uo=!1}Vo=0,Ho=U=H=null,Wo=!1,qo=Ko=0,Jo=null}function as(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ho===null?H.memoizedState=Ho=e:Ho=Ho.next=e,Ho}function os(){if(U===null){var e=H.alternate;e=e===null?null:e.memoizedState}else e=U.next;var t=Ho===null?H.memoizedState:Ho.next;if(t!==null)Ho=t,U=e;else{if(e===null)throw H.alternate===null?Error(i(467)):Error(i(310));U=e,e={memoizedState:U.memoizedState,baseState:U.baseState,baseQueue:U.baseQueue,queue:U.queue,next:null},Ho===null?H.memoizedState=Ho=e:Ho=Ho.next=e}return Ho}function ss(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function cs(e){var t=qo;return qo+=1,Jo===null&&(Jo=[]),e=eo(Jo,e,t),t=H,(Ho===null?t.memoizedState:Ho.next)===null&&(t=t.alternate,N.H=t===null||t.memoizedState===null?hc:gc),e}function ls(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return cs(e);if(e.$$typeof===fe)return;if(e.$$typeof===A)return Ta(e)}throw Error(i(438,String(e)))}function us(e){var t=null,n=H.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=H.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=ss(),H.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=ue;return t.index++,n}function ds(e,t){return typeof t==`function`?t(e):t}function fs(e){return ps(os(),U,e)}function ps(e,t,n){var r=e.queue;if(r===null)throw Error(i(311));r.lastRenderedReducer=n;var a=e.baseQueue,o=r.pending;if(o!==null){if(a!==null){var s=a.next;a.next=o.next,o.next=s}t.baseQueue=a=o,r.pending=null}if(o=e.baseState,a===null)e.memoizedState=o;else{t=a.next;var c=s=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(Vo&f)===f:(Y&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===za&&(d=!0);else if((Vo&p)===p){u=u.next,p===za&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,s=o):l=l.next=f,H.lanes|=p,od|=p;f=u.action,Go&&n(o,f),o=u.hasEagerState?u.eagerState:n(o,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,s=o):l=l.next=p,H.lanes|=f,od|=f;u=u.next}while(u!==null&&u!==t);if(l===null?s=o:l.next=c,!Hr(o,e.memoizedState)&&(Nc=!0,d&&(n=Ba,n!==null)))throw n;e.memoizedState=o,e.baseState=s,e.baseQueue=l,r.lastRenderedState=o}return a===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function ms(e){var t=os(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do o=e(o,s.action),s=s.next;while(s!==a);Hr(o,t.memoizedState)||(Nc=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function hs(e,t,n){var r=H,a=os(),o=B;if(o){if(n===void 0)throw Error(i(407));n=n()}else n=t();var s=!Hr((U||a).memoizedState,n);if(s&&(a.memoizedState=n,Nc=!0),a=a.queue,Bs(vs.bind(null,r,a,e),[e]),e=a.getSnapshot!==t||s||Ho!==null&&!!(Ho.memoizedState.tag&1),Fs(e?9:8,{destroy:void 0},_s.bind(null,r,a,n,t),null),e){if(r.flags|=2048,q===null)throw Error(i(349));o||Vo&127||gs(r,t,n)}return n}function gs(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=H.updateQueue,t===null?(t=ss(),H.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function _s(e,t,n,r){t.value=n,t.getSnapshot=r,ys(t)&&bs(e)}function vs(e,t,n){return n(function(){ys(t)&&bs(e)})}function ys(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Hr(e,n)}catch{return!0}}function bs(e){var t=Oi(e,2);t!==null&&Pd(t,e,2)}function xs(e){var t=as();if(typeof e==`function`){var n=e;if(e=n(),Go){et(!0);try{n()}finally{et(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ds,lastRenderedState:e},t}function Ss(e,t,n,r){return e.baseState=n,ps(e,U,typeof r==`function`?r:ds)}function Cs(e,t,n,r,a){if(dc(e))throw Error(i(485));if(e=t.action,e!==null){var o={payload:a,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){o.listeners.push(e)}};N.T===null?o.isTransition=!1:n(!0),r(o),n=t.pending,n===null?(o.next=t.pending=o,ws(t,o)):(o.next=n.next,t.pending=n.next=o)}}function ws(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=N.T,o={};o.types=a===null?null:a.types,N.T=o;try{var s=n(i,r),c=N.S;c!==null&&c(o,s),Ts(e,t,s)}catch(n){Ds(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),N.T=a}}else try{a=n(i,r),Ts(e,t,a)}catch(n){Ds(e,t,n)}}function Ts(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){Es(e,t,n)},function(n){return Ds(e,t,n)}):Es(e,t,n)}function Es(e,t,n){t.status=`fulfilled`,t.value=n,Os(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,ws(e,n)))}function Ds(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,Os(t),t=t.next;while(t!==r)}e.action=null}function Os(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function ks(e,t){return t}function As(e,t){if(B){var n=q.formState;if(n!==null){a:{var r=H;if(B){if(z){b:{for(var i=z,a=oa;i.nodeType!==8;){if(!a){i=null;break b}if(i=lm(i.nextSibling),i===null){i=null;break b}}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){z=lm(i.nextSibling),r=i.data===`F!`;break a}}ca(r)}r=!1}r&&(t=n[0])}}return n=as(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ks,lastRenderedState:t},n.queue=r,n=cc.bind(null,H,r),r.dispatch=n,r=xs(!1),a=uc.bind(null,H,!1,r.queue),r=as(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=Cs.bind(null,H,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function js(e){return Ms(os(),U,e)}function Ms(e,t,n){if(t=ps(e,t,ks)[0],e=fs(ds)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=cs(t)}catch(e){throw e===Ya?Za:e}else r=t;t=os();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(H.flags|=2048,Fs(9,{destroy:void 0},Ns.bind(null,i,n),null)),[r,a,e]}function Ns(e,t){e.action=t}function Ps(e){var t=os(),n=U;if(n!==null)return Ms(t,n,e);os(),t=t.memoizedState,n=os();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function Fs(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=H.updateQueue,t===null&&(t=ss(),H.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function Is(){return os().memoizedState}function Ls(e,t,n,r){var i=as();H.flags|=e,i.memoizedState=Fs(1|t,{destroy:void 0},n,r===void 0?null:r)}function Rs(e,t,n,r){var i=os();r=r===void 0?null:r;var a=i.memoizedState.inst;U!==null&&r!==null&&Zo(r,U.memoizedState.deps)?i.memoizedState=Fs(t,a,n,r):(H.flags|=e,i.memoizedState=Fs(1|t,a,n,r))}function zs(e,t){Ls(8390656,8,e,t)}function Bs(e,t){Rs(2048,8,e,t)}function Vs(e){H.flags|=4;var t=H.updateQueue;if(t===null)t=ss(),H.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Hs(e){var t=os().memoizedState;return Vs({ref:t,nextImpl:e}),function(){if(K&2)throw Error(i(440));return t.impl.apply(void 0,arguments)}}function Us(e,t){return Rs(4,2,e,t)}function Ws(e,t){return Rs(4,4,e,t)}function Gs(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Ks(e,t,n){n=n==null?null:n.concat([e]),Rs(4,4,Gs.bind(null,t,e),n)}function qs(){}function Js(e,t){var n=os();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&Zo(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Ys(e,t){var n=os();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&Zo(t,r[1]))return r[0];if(r=e(),Go){et(!0);try{e()}finally{et(!1)}}return n.memoizedState=[r,t],r}function Xs(e,t,n){return n===void 0||Vo&1073741824&&!(Y&261930)?e.memoizedState=t:(e.memoizedState=n,e=Md(),H.lanes|=e,od|=e,n)}function Zs(e,t,n,r){return Hr(n,t)?n:To.current===null?!(Vo&106)||Vo&1073741824&&!(Y&261930)?(Nc=!0,e.memoizedState=n):(e=Md(),H.lanes|=e,od|=e,t):(e=Xs(e,n,r),Hr(e,t)||(Nc=!0),e)}function Qs(e,t,n,r,i){var a=P.p;P.p=a!==0&&8>a?a:8;var o=N.T,s={};s.types=o===null?null:o.types,N.T=s,uc(e,!1,t,n);try{var c=i(),l=N.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?lc(e,t,Ua(c,r),jd(e)):lc(e,t,r,jd(e))}catch(n){lc(e,t,{then:function(){},status:`rejected`,reason:n},jd())}finally{P.p=a,o!==null&&s.types!==null&&(o.types=s.types),N.T=o}}function $s(){}function ec(e,t,n,r){if(e.tag!==5)throw Error(i(476));var a=tc(e).queue;Qs(e,a,t,ve,n===null?$s:function(){return nc(e),n(r)})}function tc(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:ve,baseState:ve,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ds,lastRenderedState:ve},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ds,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function nc(e){var t=tc(e);t.next===null&&(t=e.alternate.memoizedState),lc(e,t.next.queue,{},jd())}function rc(){return Ta(sh)}function ic(){return os().memoizedState}function ac(){return os().memoizedState}function oc(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=jd();e=_o(n);var r=vo(t,e,n);r!==null&&(Pd(r,t,n),V(r,t,n)),t={cache:Ma()},e.payload=t;return}t=t.return}}function sc(e,t,n){var r=jd();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},dc(e)?fc(t,n):(n=Di(e,t,n,r),n!==null&&(Pd(n,e,r),pc(n,t,r)))}function cc(e,t,n){lc(e,t,n,jd())}function lc(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(dc(e))fc(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,Hr(s,o))return Ei(e,t,i,0),q===null&&Ti(),!1}catch{}if(n=Di(e,t,i,r),n!==null)return Pd(n,e,r),pc(n,t,r),!0}return!1}function uc(e,t,n,r){if(r={lane:2,revertLane:Pf(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},dc(e)){if(t)throw Error(i(479))}else t=Di(e,n,r,2),t!==null&&Pd(t,e,2)}function dc(e){var t=e.alternate;return e===H||t!==null&&t===H}function fc(e,t){Wo=Uo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function pc(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,vt(e,n)}}var mc={readContext:Ta,use:ls,useCallback:Xo,useContext:Xo,useEffect:Xo,useImperativeHandle:Xo,useLayoutEffect:Xo,useInsertionEffect:Xo,useMemo:Xo,useReducer:Xo,useRef:Xo,useState:Xo,useDebugValue:Xo,useDeferredValue:Xo,useTransition:Xo,useSyncExternalStore:Xo,useId:Xo,useHostTransitionStatus:Xo,useFormState:Xo,useActionState:Xo,useOptimistic:Xo,useMemoCache:Xo,useCacheRefresh:Xo,useEffectEvent:Xo},hc={readContext:Ta,use:ls,useCallback:function(e,t){return as().memoizedState=[e,t===void 0?null:t],e},useContext:Ta,useEffect:zs,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),Ls(4194308,4,Gs.bind(null,t,e),n)},useLayoutEffect:function(e,t){return Ls(4194308,4,e,t)},useInsertionEffect:function(e,t){Ls(4,2,e,t)},useMemo:function(e,t){var n=as();t=t===void 0?null:t;var r=e();if(Go){et(!0);try{e()}finally{et(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=as();if(n!==void 0){var i=n(t);if(Go){et(!0);try{n(t)}finally{et(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=sc.bind(null,H,e),[r.memoizedState,e]},useRef:function(e){var t=as();return e={current:e},t.memoizedState=e},useState:function(e){e=xs(e);var t=e.queue,n=cc.bind(null,H,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:qs,useDeferredValue:function(e,t){return Xs(as(),e,t)},useTransition:function(){var e=xs(!1);return e=Qs.bind(null,H,e.queue,!0,!1),as().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=H,a=as();if(B){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),q===null)throw Error(i(349));Y&127||gs(r,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,zs(vs.bind(null,r,o,e),[e]),r.flags|=2048,Fs(9,{destroy:void 0},_s.bind(null,r,o,n,t),null),n},useId:function(){var e=as(),t=q.identifierPrefix;if(B){var n=Qi,r=Zi;n=(r&~(1<<32-tt(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=Ko++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=Yo++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:rc,useFormState:As,useActionState:As,useOptimistic:function(e){var t=as();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=uc.bind(null,H,!0,n),n.dispatch=t,[e,t]},useMemoCache:us,useCacheRefresh:function(){return as().memoizedState=oc.bind(null,H)},useEffectEvent:function(e){var t=as(),n={impl:e};return t.memoizedState=n,function(){if(K&2)throw Error(i(440));return n.impl.apply(void 0,arguments)}}},gc={readContext:Ta,use:ls,useCallback:Js,useContext:Ta,useEffect:Bs,useImperativeHandle:Ks,useInsertionEffect:Us,useLayoutEffect:Ws,useMemo:Ys,useReducer:fs,useRef:Is,useState:function(){return fs(ds)},useDebugValue:qs,useDeferredValue:function(e,t){return Zs(os(),U.memoizedState,e,t)},useTransition:function(){var e=fs(ds)[0],t=os().memoizedState;return[typeof e==`boolean`?e:cs(e),t]},useSyncExternalStore:hs,useId:ic,useHostTransitionStatus:rc,useFormState:js,useActionState:js,useOptimistic:function(e,t){return Ss(os(),U,e,t)},useMemoCache:us,useCacheRefresh:ac,useEffectEvent:Hs},_c={readContext:Ta,use:ls,useCallback:Js,useContext:Ta,useEffect:Bs,useImperativeHandle:Ks,useInsertionEffect:Us,useLayoutEffect:Ws,useMemo:Ys,useReducer:ms,useRef:Is,useState:function(){return ms(ds)},useDebugValue:qs,useDeferredValue:function(e,t){var n=os();return U===null?Xs(n,e,t):Zs(n,U.memoizedState,e,t)},useTransition:function(){var e=ms(ds)[0],t=os().memoizedState;return[typeof e==`boolean`?e:cs(e),t]},useSyncExternalStore:hs,useId:ic,useHostTransitionStatus:rc,useFormState:Ps,useActionState:Ps,useOptimistic:function(e,t){var n=os();return U===null?(n.baseState=e,[e,n.queue.dispatch]):Ss(n,U,e,t)},useMemoCache:us,useCacheRefresh:ac,useEffectEvent:Hs};function vc(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:E({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var yc={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=jd(),i=_o(r);i.payload=t,n!=null&&(i.callback=n),t=vo(e,i,r),t!==null&&(Pd(t,e,r),V(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=jd(),i=_o(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=vo(e,i,r),t!==null&&(Pd(t,e,r),V(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=jd(),r=_o(n);r.tag=2,t!=null&&(r.callback=t),t=vo(e,r,n),t!==null&&(Pd(t,e,n),V(t,e,n))}};function bc(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Ur(n,r)||!Ur(i,a):!0}function xc(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&yc.enqueueReplaceState(t,t.state,null)}function Sc(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=E({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function Cc(e){xi(e)}function wc(e){console.error(e)}function Tc(e){xi(e)}function Ec(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function Dc(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function Oc(e,t,n){return n=_o(n),n.tag=3,n.payload={element:null},n.callback=function(){Ec(e,t)},n}function kc(e){return e=_o(e),e.tag=3,e}function Ac(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){Dc(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){Dc(t,n,r),typeof i!=`function`&&(vd===null?vd=new Set([this]):vd.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function jc(e,t,n,r,a){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&Sa(t,n,a,!0),n=Ao.current,n!==null){switch(n.tag){case 31:case 13:case 19:return jo===null?Kd():n.alternate===null&&ad===0&&(ad=3),n.flags&=-257,n.flags|=65536,n.lanes=a,r===Qa?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),mf(e,r,a)),!1;case 22:return n.flags|=65536,r===Qa?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),mf(e,r,a)),!1}throw Error(i(435,n.tag))}return mf(e,r,a),Kd(),!1}if(B)return t=Ao.current,t===null?(r!==sa&&(t=Error(i(423),{cause:r}),ma(Ui(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,r=Ui(r,n),a=Oc(e.stateNode,r,a),yo(e,a),ad!==4&&(ad=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=a,r!==sa&&(e=Error(i(422),{cause:r}),ma(Ui(e,n)))),!1;var o=Error(i(520),{cause:r});if(o=Ui(o,n),dd===null?dd=[o]:dd.push(o),ad!==4&&(ad=2),t===null)return!0;r=Ui(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=Oc(n.stateNode,r,e),yo(n,e),!1;case 1:if(t=n.type,o=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||o!==null&&typeof o.componentDidCatch==`function`&&(vd===null||!vd.has(o))))return n.flags|=65536,a&=-a,n.lanes|=a,a=kc(a),Ac(a,e,n,r),yo(n,a),!1;break;case 22:if(n.memoizedState!==null)return n.flags|=65536,!1}n=n.return}while(n!==null);return!1}var Mc=Error(i(461)),Nc=!1;function Pc(e,t,n,r){t.child=e===null?po(t,null,n,r):fo(t,e.child,n,r)}function Fc(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return wa(t),r=Qo(e,t,n,o,a,i),s=ns(),e!==null&&!Nc?(rs(e,t,i),ll(e,t,i)):(B&&s&&ta(t),t.flags|=1,Pc(e,t,r,i),t.child)}function Ic(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!Pi(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,Lc(e,t,a,r,i)):(e=Li(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!ul(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?Ur:n,n(o,r)&&e.ref===t.ref)return ll(e,t,i)}return t.flags|=1,e=Fi(a,r),e.ref=t.ref,e.return=t,t.child=e}function Lc(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(Ur(a,r)&&e.ref===t.ref){if(Nc=!1,t.pendingProps=r=a,ul(e,i))e.flags&131072&&(Nc=!0);else return t.lanes=e.lanes,ll(e,t,i)}}return Gc(e,t,n,r,i)}function Rc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return Bc(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&qa(t,a===null?null:a.cachePool),a===null?Oo():Do(t,a),Po(t);else return r=t.lanes=536870912,Bc(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&qa(t,null),Oo(),Fo()):(qa(t,a.cachePool),Do(t,a),Fo(),t.memoizedState=null);return Pc(e,t,i,n),t.child}function zc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Bc(e,t,n,r,i){var a=Ka();return a=a===null?null:{parent:ja._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&qa(t,null),Oo(),Po(t),e!==null&&Sa(e,t,r,!0),t.childLanes=i,null}function Vc(e,t){return t=el({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Hc(e,t,n){return fo(t,e.child,null,n),e=Vc(t,t.pendingProps),e.flags|=2,Io(t),t.memoizedState=null,e}function Uc(e,t,n){var r=t.pendingProps,a=!!(t.flags&128);if(t.flags&=-129,e===null){if(B){if(r.mode===`hidden`)return e=Vc(t,r),t.lanes=536870912,e.memoizedState={baseLanes:0,cachePool:null},zc(null,e);if(No(t),(e=z)?(e=am(e,oa),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Xi===null?null:{id:Zi,overflow:Qi},retryLane:536870912,hydrationErrors:null},n=Bi(e),n.return=t,t.child=n,ia=t,z=null)):e=null,e===null)throw ca(t);return t.lanes=536870912,null}return Vc(t,r)}var o=e.memoizedState;if(o!==null){var s=o.dehydrated;if(No(t),a){if(t.flags&256)t.flags&=-257,t=Hc(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(i(558))}else if(Nc||Sa(e,t,n,!1),a=(n&e.childLanes)!==0,Nc||a){if(To.current===null){if(r=q,r!==null&&(s=yt(r,n),s!==0&&s!==o.retryLane))throw o.retryLane=s,Oi(e,s),Pd(r,e,s),Mc;Kd()}t=Hc(e,t,n)}else e=o.treeContext,z=lm(s.nextSibling),ia=t,B=!0,aa=null,oa=!1,e!==null&&ra(t,e),t=Vc(t,r),t.flags|=134221824;return t}return e=Fi(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function Wc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(i(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Gc(e,t,n,r,i){return wa(t),n=Qo(e,t,n,r,void 0,i),r=ns(),e!==null&&!Nc?(rs(e,t,i),ll(e,t,i)):(B&&r&&ta(t),t.flags|=1,Pc(e,t,n,i),t.child)}function Kc(e,t,n,r,i,a){return wa(t),t.updateQueue=null,n=es(t,r,n,i),$o(e),r=ns(),e!==null&&!Nc?(rs(e,t,a),ll(e,t,a)):(B&&r&&ta(t),t.flags|=1,Pc(e,t,n,a),t.child)}function qc(e,t,n,r,i){if(wa(t),t.stateNode===null){var a=ji,o=n.contextType;typeof o==`object`&&o&&(a=Ta(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=yc,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},ho(t),o=n.contextType,a.context=typeof o==`object`&&o?Ta(o):ji,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(vc(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&yc.enqueueReplaceState(a,a.state,null),So(t,r,a,i),xo(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=Sc(n,s);a.props=c;var l=a.context,u=n.contextType;o=ji,typeof u==`object`&&u&&(o=Ta(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&xc(t,a,r,o),mo=!1;var f=t.memoizedState;a.state=f,So(t,r,a,i),xo(),l=t.memoizedState,s||f!==l||mo?(typeof d==`function`&&(vc(t,n,d,r),l=t.memoizedState),(c=mo||bc(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,go(e,t),o=t.memoizedProps,u=Sc(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=ji,typeof l==`object`&&l&&(c=Ta(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&xc(t,a,r,c),mo=!1,f=t.memoizedState,a.state=f,So(t,r,a,i),xo();var p=t.memoizedState;o!==d||f!==p||mo||e!==null&&e.dependencies!==null&&Ca(e.dependencies)?(typeof s==`function`&&(vc(t,n,s,r),p=t.memoizedState),(u=mo||bc(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&Ca(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,Wc(e,t),r=!!(t.flags&128),a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=fo(t,e.child,null,i),t.child=fo(t,null,n,i)):Pc(e,t,n,i),t.memoizedState=a.state,e=t.child):e=ll(e,t,i),e}function Jc(e,t,n,r){return fa(),t.flags|=256,Pc(e,t,n,r),t.child}var Yc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Xc(e){return{baseLanes:e,cachePool:Ja()}}function Zc(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=ld),e}function Qc(e,t,n){var r=t.pendingProps,i=!1,a=!!(t.flags&128),o;if((o=a)||(o=e!==null&&e.memoizedState===null?!1:!!(Lo.current&2)),o&&(i=!0,t.flags&=-129),o=!!(t.flags&32),t.flags&=-33,e===null){if(B){if(i?Mo(t):Fo(),(e=z)?(e=am(e,oa),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Xi===null?null:{id:Zi,overflow:Qi},retryLane:536870912,hydrationErrors:null},n=Bi(e),n.return=t,t.child=n,ia=t,z=null)):e=null,e===null)throw ca(t);return t.lanes=sm(e)?32:536870912,null}return a=r.children,r=r.fallback,i?(Fo(),i=t.mode,a=el({mode:`hidden`,children:a},i),r=Ri(r,i,n,null),a.return=t,r.return=t,a.sibling=r,t.child=a,r=t.child,r.memoizedState=Xc(n),r.childLanes=Zc(e,o,n),t.memoizedState=Yc,zc(null,r)):(Mo(t),$c(t,a))}var s=e.memoizedState;if(s!==null){var c=s.dehydrated;if(c!==null)return nl(e,t,a,o,r,c,s,n)}return i?(Fo(),i=r.fallback,a=t.mode,s=e.child,c=s.sibling,r=Fi(s,{mode:`hidden`,children:r.children}),r.subtreeFlags=s.subtreeFlags&1206910976,c===null?(i=Ri(i,a,n,null),i.flags|=2):i=Fi(c,i),i.return=t,r.return=t,r.sibling=i,t.child=r,zc(null,r),r=t.child,i=e.child.memoizedState,i===null?i=Xc(n):(a=i.cachePool,a===null?a=Ja():(s=ja._currentValue,a=a.parent===s?a:{parent:s,pool:s}),i={baseLanes:i.baseLanes|n,cachePool:a}),r.memoizedState=i,r.childLanes=Zc(e,o,n),t.memoizedState=Yc,zc(e.child,r)):(Mo(t),n=e.child,e=n.sibling,n=Fi(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(o=t.deletions,o===null?(t.deletions=[e],t.flags|=16):o.push(e)),t.child=n,t.memoizedState=null,n)}function $c(e,t){return t=el({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function el(e,t){return e=Ni(22,e,null,t),e.lanes=0,e}function tl(e,t,n){return fo(t,e.child,null,n),e=$c(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function nl(e,t,n,r,a,o,s,c){if(n)return t.flags&256?(Mo(t),t.flags&=-257,tl(e,t,c)):t.memoizedState===null?(Fo(),o=a.fallback,s=t.mode,a=el({mode:`visible`,children:a.children},s),o=Ri(o,s,c,null),o.flags|=2,a.return=t,o.return=t,a.sibling=o,t.child=a,fo(t,e.child,null,c),a=t.child,a.memoizedState=Xc(c),a.childLanes=Zc(e,r,c),t.memoizedState=Yc,zc(null,a)):(Fo(),t.child=e.child,t.flags|=128,null);if(Mo(t),sm(o)){if(r=o.nextSibling&&o.nextSibling.dataset,r)var l=r.dgst;return r=l,r!==``&&(a=Error(i(419)),a.stack=``,a.digest=r,ma({value:a,source:null,stack:null})),tl(e,t,c)}if(Nc||Sa(e,t,c,!1),r=(c&e.childLanes)!==0,Nc||r){if(To.current!==null)return tl(e,t,c);if(r=q,r!==null&&(a=yt(r,c),a!==0&&a!==s.retryLane))throw s.retryLane=a,Oi(e,a),Pd(r,e,a),Mc;return om(o)||Kd(),tl(e,t,c)}return om(o)?(t.flags|=192,t.child=e.child,null):(e=s.treeContext,z=lm(o.nextSibling),ia=t,B=!0,aa=null,oa=!1,e!==null&&ra(t,e),t=$c(t,a.children),t.flags|=134221824,t)}function rl(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),ba(e.return,t,n)}function il(e){for(var t=null;e!==null;){var n=e.alternate;n!==null&&Bo(n)===null&&(t=e),e=e.sibling}return t}function al(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function ol(e){var t=e.child;for(e.child=null;t!==null;){var n=t.sibling;t.sibling=e.child,e.child=t,t=n}}function sl(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=Lo.current;if(t.flags&128)return Ro(t,o),null;var s=!!(o&2);if(s?(o=o&1|2,t.flags|=128):o&=1,Ro(t,o),i===`backwards`&&e!==null?(ol(e),Pc(e,t,r,n),ol(e)):Pc(e,t,r,n),r=B?qi:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&rl(e,n,t);else if(e.tag===19)rl(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`backwards`:n=il(t.child),n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null,ol(t)),al(t,!0,i,null,a,r);break;case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&Bo(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}al(t,!0,n,null,a,r);break;case`together`:al(t,!1,null,null,void 0,r);break;case`independent`:t.memoizedState=null;break;default:n=il(t.child),n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),al(t,!1,i,n,a,r)}return t.child}function cl(e,t,n){var r=t.pendingProps;return va(t,t.type,r.value),Pc(e,t,r.children,n),t.child}function ll(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),od|=t.lanes,(n&t.childLanes)===0){if(e!==null){if(Sa(e,t,n,!1),(n&t.childLanes)===0)return null}else return null}if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=Fi(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=Fi(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function ul(e,t){return(e.lanes&t)!==0||(e=e.dependencies,!!(e!==null&&Ca(e)))}function dl(e,t,n){switch(t.tag){case 3:De(t,t.stateNode.containerInfo),va(t,ja,e.memoizedState.cache),fa();break;case 27:case 5:ke(t);break;case 4:De(t,t.stateNode.containerInfo);break;case 10:va(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,No(t),null;break;case 13:var r=t.memoizedState;if(r!==null){if(r.dehydrated!==null)return Mo(t),t.flags|=128,null;r=Sa(e,t,n,!1);var i=t.child.childLanes;return r||(n&i)!==0?Qc(e,t,n):(Mo(t),e=ll(e,t,n),e===null?null:e.sibling)}Mo(t);break;case 19:if(t.flags&128)return sl(e,t,n);if(i=!!(e.flags&128),r=(n&t.childLanes)!==0,r||=(Sa(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return sl(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),Ro(t,Lo.current),r)break;return null;case 22:return t.lanes=0,Rc(e,t,n,t.pendingProps);case 24:va(t,ja,e.memoizedState.cache)}return ll(e,t,n)}function fl(e,t,n){if(e!==null){if(e.memoizedProps!==t.pendingProps)Nc=!0;else{if(!ul(e,n)&&!(t.flags&128))return Nc=!1,dl(e,t,n);Nc=!!(e.flags&131072)}}else Nc=!1,B&&t.flags&1048576&&ea(t,qi,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=to(t.elementType),t.type=e,typeof e==`function`)Pi(e)?(r=Sc(e,r),t.tag=1,t=qc(null,t,e,r,n)):(t.tag=0,t=Gc(null,t,e,r,n));else{if(e!=null){var a=e.$$typeof;if(a===ae){t.tag=11,t=Fc(null,t,e,r,n);break a}if(a===oe){t.tag=14,t=Ic(null,t,e,r,n);break a}if(a===A){t.tag=10,t.type=e,t=cl(null,t,n);break a}}throw t=ge(e)||e,Error(i(306,t,``))}}return t;case 0:return Gc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,a=Sc(r,t.pendingProps),qc(e,t,r,a,n);case 3:a:{if(De(t,t.stateNode.containerInfo),e===null)throw Error(i(387));r=t.pendingProps;var o=t.memoizedState;a=o.element,go(e,t),So(t,r,null,n);var s=t.memoizedState;if(r=s.cache,va(t,ja,r),r!==o.cache&&xa(t,[ja],n,!0),xo(),r=s.element,o.isDehydrated){if(o={element:r,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=Jc(e,t,r,n);break a}if(r!==a){a=Ui(Error(i(424)),t),ma(a),t=Jc(e,t,r,n);break a}switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(z=lm(e.firstChild),ia=t,B=!0,aa=null,oa=!0,n=po(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|134221824,n=n.sibling}else{if(fa(),r===a){t=ll(e,t,n);break a}Pc(e,t,r,n)}t=t.child}return t;case 26:return Wc(e,t),e===null?(n=Nm(t.type,null,t.pendingProps,null))?t.memoizedState=n:B||(t.stateNode=fp(t.type,t.pendingProps,Te.current,t)):t.memoizedState=Nm(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return ke(t),e===null&&B&&(r=t.stateNode=hm(t.type,t.pendingProps,Te.current),ia=t,oa=!0,a=z,Sp(t.type)?(um=a,z=lm(r.firstChild)):z=a),Pc(e,t,t.pendingProps.children,n),Wc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&B&&((a=r=z)&&(r=rm(r,t.type,t.pendingProps,oa),r===null?a=!1:(t.stateNode=r,ia=t,z=lm(r.firstChild),oa=!1,a=!0)),a||ca(t)),ke(t),a=t.type,o=t.pendingProps,s=e===null?null:e.memoizedProps,r=o.children,pp(a,o)?r=null:s!==null&&pp(a,s)&&(t.flags|=32),t.memoizedState!==null&&(a=Qo(e,t,ts,null,null,n),sh._currentValue=a),Wc(e,t),Pc(e,t,r,n),t.child;case 6:return e===null&&B&&((e=n=z)&&(n=im(n,t.pendingProps,oa),n===null?e=!1:(t.stateNode=n,ia=t,z=null,e=!0)),e||ca(t)),null;case 13:return Qc(e,t,n);case 4:return De(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=fo(t,null,r,n):Pc(e,t,r,n),t.child;case 11:return Fc(e,t,t.type,t.pendingProps,n);case 7:return r=t.pendingProps,Wc(e,t),Pc(e,t,r,n),t.child;case 8:return Pc(e,t,t.pendingProps.children,n),t.child;case 12:return Pc(e,t,t.pendingProps.children,n),t.child;case 10:return cl(e,t,n);case 9:return a=t.type._context,r=t.pendingProps.children,wa(t),a=Ta(a),r=r(a),t.flags|=1,Pc(e,t,r,n),t.child;case 14:return Ic(e,t,t.type,t.pendingProps,n);case 15:return Lc(e,t,t.type,t.pendingProps,n);case 19:return sl(e,t,n);case 31:return Uc(e,t,n);case 22:return Rc(e,t,n,t.pendingProps);case 24:return wa(t),r=Ta(ja),e===null?(a=Ka(),a===null&&(a=q,o=Ma(),a.pooledCache=o,o.refCount++,o!==null&&(a.pooledCacheLanes|=n),a=o),t.memoizedState={parent:r,cache:a},ho(t),va(t,ja,a)):((e.lanes&n)!==0&&(go(e,t),So(t,null,null,n),xo()),a=e.memoizedState,o=t.memoizedState,a.parent===r?(r=o.cache,va(t,ja,r),r!==a.cache&&xa(t,[ja],n,!0)):(a={parent:r,cache:r},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),va(t,ja,r))),Pc(e,t,t.pendingProps.children,n),t.child;case 30:return t.stateNode===null&&(t.stateNode={autoName:null,paired:null,clones:null,ref:null}),r=t.pendingProps,r.name!=null&&r.name!==`auto`?t.flags|=e===null?18882560:18874368:B&&ta(t),e!==null&&e.memoizedProps.name!==r.name?t.flags|=4194816:Wc(e,t),Pc(e,t,r.children,n),t.child;case 29:throw t.pendingProps}throw Error(i(156,t.tag))}function pl(e){e.flags|=4}function ml(e,t,n,r,i){var a;if((a=!!(e.mode&32))&&(a=n===null?Jm(t,r):Jm(t,r)&&(r.src!==n.src||r.srcSet!==n.srcSet)),a){if(e.flags|=16777216,(i&335544128)===i){if(e.stateNode.complete)e.flags|=8192;else if(Ud())e.flags|=8192;else throw no=Qa,Xa}}else e.flags&=-16777217}function hl(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Ym(t)){if(Ud())e.flags|=8192;else throw no=Qa,Xa}}function gl(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:pt(),e.lanes|=t,ud|=t)}function _l(e,t){if(!B)switch(e.tailMode){case`visible`:break;case`collapsed`:for(var n=e.tail,r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null;break;default:for(t=e.tail,n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null}}function vl(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&1206910976,r|=i.flags&1206910976,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function yl(e,t,n){var r=t.pendingProps;switch(na(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return vl(t),null;case 1:return vl(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),ya(ja),Oe(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(da(t)?pl(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,pa())),vl(t),null;case 26:var a=t.type,o=t.memoizedState;return e===null?(pl(t),o===null?(vl(t),ml(t,a,null,r,n)):(vl(t),hl(t,o))):o?o===e.memoizedState?(vl(t),t.flags&=-16777217):(pl(t),vl(t),hl(t,o)):(e=e.memoizedProps,e!==r&&pl(t),vl(t),ml(t,a,e,r,n)),null;case 27:if(Ae(t),n=Te.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&pl(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return vl(t),t.subtreeFlags&=-33554433,null}e=Ce.current,da(t)?la(t,e):(e=hm(a,r,n),t.stateNode=e,pl(t))}return vl(t),t.subtreeFlags&=-33554433,null;case 5:if(Ae(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&pl(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return vl(t),t.subtreeFlags&=-33554433,null}if(o=Ce.current,da(t))la(t,o);else{var s=lp(Te.current);switch(o){case 1:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case 2:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;default:switch(a){case`svg`:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case`math`:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;case`script`:o=s.createElement(`div`),o.innerHTML=`<script><\/script>`,o=o.removeChild(o.firstChild);break;case`select`:o=typeof r.is==`string`?s.createElement(`select`,{is:r.is}):s.createElement(`select`),r.multiple?o.multiple=!0:r.size&&(o.size=r.size);break;default:o=typeof r.is==`string`?s.createElement(a,{is:r.is}):s.createElement(a)}}o[Tt]=t,o[Et]=r;a:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)o.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break a;for(;s.sibling===null;){if(s.return===null||s.return===t)break a;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=o;a:switch(np(o,a,r),a){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&pl(t)}}return vl(t),t.subtreeFlags&=-33554433,ml(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&pl(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(i(166));if(e=Te.current,da(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,a=ia,a!==null)switch(a.tag){case 27:case 5:r=a.memoizedProps}e[Tt]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||ep(e.nodeValue,n)),e||ca(t,!0)}else e=lp(e).createTextNode(r),e[Tt]=t,t.stateNode=e}return vl(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=da(t),n!==null){if(e===null){if(!r)throw Error(i(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(557));e[Tt]=t}else fa(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;vl(t),e=!1}else n=pa(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Io(t),t):(Io(t),null);if(t.flags&128)throw Error(i(558))}return vl(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=da(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a===null?null:a.dehydrated,!a)throw Error(i(317));a[Tt]=t}else fa(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;vl(t),a=!1}else a=pa(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(Io(t),t):(Io(t),null)}return Io(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,a=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(a=r.alternate.memoizedState.cachePool.pool),o=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(o=r.memoizedState.cachePool.pool),o!==a&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),gl(t,t.updateQueue),vl(t),null);case 4:return Oe(),e===null&&Wf(t.stateNode.containerInfo),t.flags|=67108864,vl(t),null;case 10:return ya(t.type),vl(t),null;case 19:if(zo(t),r=t.memoizedState,r===null)return vl(t),null;if(a=!!(t.flags&128),o=r.rendering,o===null){if(a)_l(r,!1);else{if(ad!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=Bo(e),o!==null){for(t.flags|=128,_l(r,!1),e=o.updateQueue,t.updateQueue=e,gl(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Ii(n,e),n=n.sibling;return Ro(t,Lo.current&1|2),B&&$i(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&Ue()>gd&&(t.flags|=128,a=!0,_l(r,!1),t.lanes=4194304)}}else{if(!a){if(e=Bo(o),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,gl(t,e),_l(r,!0),r.tail===null&&r.tailMode!==`collapsed`&&r.tailMode!==`visible`&&!o.alternate&&!B)return vl(t),null}else 2*Ue()-r.renderingStartTime>gd&&n!==536870912&&(t.flags|=128,a=!0,_l(r,!1),t.lanes=4194304)}r.isBackwards?(o.sibling=t.child,t.child=o):(e=r.last,e===null?t.child=o:e.sibling=o,r.last=o)}if(r.tail!==null){e=r.tail;a:{for(n=e;n!==null;){if(n.alternate!==null){n=!1;break a}n=n.sibling}n=!0}return r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Ue(),e.sibling=null,o=Lo.current,o=a?o&1|2:o&1,r.tailMode===`visible`||r.tailMode===`collapsed`||!n||B?Ro(t,o):(n=o,F(Ao,t),F(Lo,n),jo===null&&(jo=t)),B&&$i(t,r.treeForkCount),e}return vl(t),null;case 22:case 23:return Io(t),ko(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(vl(t),t.subtreeFlags&6&&(t.flags|=8192)):vl(t),n=t.updateQueue,n!==null&&gl(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&Se(Ga),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),ya(ja),vl(t),null;case 25:return null;case 30:return t.flags|=33554432,vl(t),null}throw Error(i(156,t.tag))}function bl(e,t){switch(na(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return ya(ja),Oe(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Ae(t),null;case 31:if(t.memoizedState!==null){if(Io(t),t.alternate===null)throw Error(i(340));fa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Io(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));fa()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return zo(t),e=t.flags,e&65536?(t.flags=e&-65537|128,e=t.memoizedState,e!==null&&(e.rendering=null,e.tail=null),t.flags|=4,t):null;case 4:return Oe(),null;case 10:return ya(t.type),null;case 22:case 23:return Io(t),ko(),e!==null&&Se(Ga),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return ya(ja),null;case 25:return null;default:return null}}function xl(e,t){switch(na(t),t.tag){case 3:ya(ja),Oe();break;case 26:case 27:case 5:Ae(t);break;case 4:Oe();break;case 31:t.memoizedState!==null&&Io(t);break;case 13:Io(t);break;case 19:zo(t);break;case 10:ya(t.type);break;case 22:case 23:Io(t),ko(),e!==null&&Se(Ga);break;case 24:ya(ja)}}function Sl(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){Z(t,t.return,e)}}function Cl(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){Z(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){Z(t,t.return,e)}}function wl(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{wo(t,n)}catch(t){Z(e,e.return,t)}}}function Tl(e,t,n){n.props=Sc(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){Z(e,t,n)}}function El(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:var i=e.stateNode,a=vi(e.memoizedProps,i);(i.ref===null||i.ref.name!==a)&&(i.ref=Pp(a)),r=i.ref;break;case 7:if(e.stateNode===null){var o=new Fp(e);m(e.child,!1,Qp,o,void 0,void 0),e.stateNode=o}r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){Z(e,t,n)}}function Dl(e,t){var n=e.ref,r=e.refCleanup;if(n!==null){if(typeof r==`function`)try{r()}catch(n){Z(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){Z(e,t,n)}else n.current=null}}function Ol(e,t){if((e.tag===5||e.tag===27||e.tag===6)&&e.alternate===null&&t!==null)for(var n=0;n<t.length;n++)em(e.stateNode,t[n])}function kl(e){for(var t=e.return;t!==null&&(Ml(t)&&em(e.stateNode,t.stateNode),!jl(t));)t=t.return}function Al(e){for(var t=e.return;t!==null&&(Ml(t)&&tm(e.stateNode,t.stateNode),!jl(t));)t=t.return}function jl(e){return e.tag===5||e.tag===3||e.tag===27}function Ml(e){return e&&e.tag===7&&e.stateNode!==null}function Nl(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){Z(e,e.return,t)}}function Pl(e,t,n){try{var r=e.stateNode;ip(r,e.type,n,t),r[Et]=t}catch(t){Z(e,e.return,t)}}function Fl(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Sp(e.type)||e.tag===4}function Il(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||Fl(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Sp(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ll(e,t,n,r){var i=e.tag;if(i===5||i===6)i=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(i,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(i),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=yn)),Ol(e,r),R=!0;else if(i!==4&&(i===27&&(Ol(e,r),r=null,Sp(e.type)&&(n=e.stateNode,t=null)),e=e.child,e!==null))for(Ll(e,t,n,r),e=e.sibling;e!==null;)Ll(e,t,n,r),e=e.sibling}function Rl(e,t,n,r){var i=e.tag;if(i===5||i===6)i=e.stateNode,t?n.insertBefore(i,t):n.appendChild(i),Ol(e,r),R=!0;else if(i!==4&&(i===27&&(Ol(e,r),r=null,Sp(e.type)&&(n=e.stateNode)),e=e.child,e!==null))for(Rl(e,t,n,r),e=e.sibling;e!==null;)Rl(e,t,n,r),e=e.sibling}function zl(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);np(t,r,n),t[Tt]=e,t[Et]=n}catch(t){Z(e,e.return,t)}}var Bl=!1,Vl=null;function Hl(e){(e.tag===30||e.subtreeFlags&33554432)&&(Bl=!0)}var Ul=null;function Wl(){var e=Ul;return Ul=null,e}var W=0;function Gl(e,t,n,r,i){return W=0,Kl(e.child,t,n,r,i)}function Kl(e,t,n,r,i){for(var a=!1;e!==null;){if(e.tag===5){var o=e.stateNode;if(r!==null){var s=Op(o);r.push(s),s.view&&(a=!0)}else a||Op(o).view&&(a=!0);Bl=!0,Tp(o,W===0?t:t+`_`+W,n),W++}else(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&i||Kl(e.child,t,n,r,i)&&(a=!0));e=e.sibling}return a}function ql(e,t){for(;e!==null;)e.tag===5?Ep(e.stateNode,e.memoizedProps):(e.tag!==22||e.memoizedState===null)&&(e.tag===30&&t||ql(e.child,t)),e=e.sibling}function Jl(e){if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if((e.tag!==22||e.memoizedState===null)&&(Jl(e),e.tag===30&&e.flags&18874368&&e.stateNode.paired)){var t=e.memoizedProps;if(t.name==null||t.name===`auto`)throw Error(i(544));var n=t.name;t=bi(t.default,t.share),t!==`none`&&(Gl(e,n,t,null,!1)||ql(e.child,!1))}e=e.sibling}}function Yl(e,t){if(e.tag===30){var n=e.stateNode,r=e.memoizedProps,i=vi(r,n),a=bi(r.default,n.paired?r.share:r.enter);a===`none`?Jl(e):Gl(e,i,a,null,!1)?(Jl(e),n.paired||t||Nd(e,r.onEnter)):ql(e.child,!1)}else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)Yl(e,t),e=e.sibling;else Jl(e)}function Xl(e){if(Vl!==null&&Vl.size!==0){var t=Vl;if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&e.flags&18874368){var n=e.memoizedProps,r=n.name;if(r!=null&&r!==`auto`){var i=t.get(r);if(i!==void 0){var a=bi(n.default,n.share);if(a!==`none`&&(Gl(e,r,a,null,!1)?(a=e.stateNode,i.paired=a,a.paired=i,Nd(e,n.onShare)):ql(e.child,!1)),t.delete(r),t.size===0)break}}}Xl(e)}e=e.sibling}}}function Zl(e){if(e.tag===30){var t=e.memoizedProps,n=vi(t,e.stateNode),r=Vl===null?void 0:Vl.get(n),i=bi(t.default,r===void 0?t.exit:t.share);i!==`none`&&(Gl(e,n,i,null,!1)?r===void 0?Nd(e,t.onExit):(i=e.stateNode,r.paired=i,i.paired=r,Vl.delete(n),Nd(e,t.onShare)):ql(e.child,!1)),Vl!==null&&Xl(e)}else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)Zl(e),e=e.sibling;else Vl!==null&&Xl(e)}function Ql(e){for(e=e.child;e!==null;){if(e.tag===30){var t=e.memoizedProps,n=vi(t,e.stateNode);t=bi(t.default,t.update),e.flags&=-5,t!==`none`&&Gl(e,n,t,e.memoizedState=[],!1)}else e.subtreeFlags&33554432&&Ql(e);e=e.sibling}}function $l(e){if(e.subtreeFlags&18874368)for(e=e.child;e!==null;){if(e.tag!==22||e.memoizedState===null){if(e.tag===30&&e.flags&18874368){var t=e.stateNode;t.paired!==null&&(t.paired=null,ql(e.child,!1))}$l(e)}e=e.sibling}}function eu(e){if(e.tag===30)e.stateNode.paired=null,ql(e.child,!1),$l(e);else if(e.subtreeFlags&33554432)for(e=e.child;e!==null;)eu(e),e=e.sibling;else $l(e)}function tu(e){for(e=e.child;e!==null;)e.tag===30?ql(e.child,!1):e.subtreeFlags&33554432&&tu(e),e=e.sibling}function nu(e,t,n,r,i,a,o){for(var s=!1;t!==null;){if(t.tag===5){var c=t.stateNode;if(a!==null&&W<a.length){var l=a[W],u=Op(c);(l.view||u.view)&&(s=!0);var d;if(d=!(e.flags&4)){if(u.clip)d=!0;else{d=l.rect;var f=u.rect;d=d.y!==f.y||d.x!==f.x||d.height!==f.height||d.width!==f.width}}d&&(e.flags|=4),u.abs?u=!l.abs:(l=l.rect,u=u.rect,u=l.height!==u.height||l.width!==u.width),u&&(e.flags|=32)}else e.flags|=32;e.flags&4&&Tp(c,W===0?n:n+`_`+W,i),s&&e.flags&4||(Ul===null&&(Ul=[]),Ul.push(c,W===0?r:r+`_`+W,t.memoizedProps)),W++}else(t.tag!==22||t.memoizedState===null)&&(t.tag===30&&o?e.flags|=t.flags&32:nu(e,t.child,n,r,i,a,o)&&(s=!0));t=t.sibling}return s}function ru(e,t){for(e=e.child;e!==null;){if(e.tag===30){var n=e.memoizedProps,r=e.stateNode,i=vi(n,r),a=bi(n.default,n.update);if(t){r=r.clones;var o=r===null?null:r.map(kp)}else o=e.memoizedState,e.memoizedState=null;r=e;var s=e.child;W=0,i=nu(r,s,i,i,a,o,!1),e.flags&4&&i&&(t||Nd(e,n.onUpdate))}else e.subtreeFlags&33554432&&ru(e,t);e=e.sibling}}var iu=!1,G=!1,au=!1,ou=!1,su=typeof WeakSet==`function`?WeakSet:Set,cu=null,lu=!1,uu=!1,du=!1,fu=!1;function pu(e,t,n){if(e=e.containerInfo,sp=gh,e=Jr(e),Yr(e)){if(`selectionStart`in e)var r={start:e.selectionStart,end:e.selectionEnd};else a:{r=(r=e.ownerDocument)&&r.defaultView||window;var i=r.getSelection&&r.getSelection();if(i&&i.rangeCount!==0){r=i.anchorNode;var a=i.anchorOffset,o=i.focusNode;i=i.focusOffset;try{r.nodeType,o.nodeType}catch{r=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==r||a!==0&&f.nodeType!==3||(c=s+a),f!==o||i!==0&&f.nodeType!==3||(l=s+i),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===r&&++u===a&&(c=s),p===o&&++d===i&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}r=c===-1||l===-1?null:{start:c,end:l}}else r=null}r||={start:0,end:0}}else r=null;for(cp={focusedElem:e,selectionRange:r},gh=!1,n=(n&335544064)===n,cu=t,t=n?9270:1024;cu!==null;){if(e=cu,n&&(r=e.deletions,r!==null))for(a=0;a<r.length;a++)n&&Zl(r[a]);if(e.alternate===null&&e.flags&2)n&&Hl(e),mu(n);else{if(e.tag===22){if(r=e.alternate,e.memoizedState!==null){r!==null&&r.memoizedState===null&&n&&Zl(r),mu(n);continue}if(r!==null&&r.memoizedState!==null){n&&Hl(e),mu(n);continue}}r=e.child,(e.subtreeFlags&t)!==0&&r!==null?(r.return=e,cu=r):(n&&Ql(e),mu(n))}}Vl=null}function mu(e){for(;cu!==null;){var t=cu,n=e,r=t.alternate,a=t.flags;switch(t.tag){case 0:case 11:case 15:break;case 1:if(a&1024&&r!==null){n=void 0,a=r.memoizedProps,r=r.memoizedState;var o=t.stateNode;try{var s=Sc(t.type,a);n=o.getSnapshotBeforeUpdate(s,r),o.__reactInternalSnapshotBeforeUpdate=n}catch(e){Z(t,t.return,e)}}break;case 3:if(a&1024){if(r=t.stateNode.containerInfo,n=r.nodeType,n===9)nm(r);else if(n===1)switch(r.nodeName){case`HEAD`:case`HTML`:case`BODY`:nm(r);break;default:r.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;case 30:n&&r!==null&&(n=vi(r.memoizedProps,r.stateNode),a=t.memoizedProps,a=bi(a.default,a.update),a!==`none`&&Gl(r,n,a,r.memoizedState=[],!0));break;default:if(a&1024)throw Error(i(163))}if(r=t.sibling,r!==null){r.return=t.return,cu=r;break}cu=t.return}}function hu(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:Fu(e,n),r&4&&Sl(5,n);break;case 1:if(Fu(e,n),r&4){if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){Z(n,n.return,e)}else{var i=Sc(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){Z(n,n.return,e)}}}r&64&&wl(n),r&512&&El(n,n.return);break;case 3:if(Fu(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{wo(e,t)}catch(e){Z(n,n.return,e)}}break;case 27:t===null&&r&4&&zl(n);case 26:case 5:Fu(e,n),t===null&&r&4&&Nl(n),r&512&&El(n,n.return);break;case 12:Fu(e,n);break;case 31:Fu(e,n),r&4&&wu(e,n);break;case 13:Fu(e,n),r&4&&Tu(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=_f.bind(null,n),cm(e,n))));break;case 22:if(r=n.memoizedState!==null||iu,!r){var a=t!==null&&t.memoizedState!==null||G;t=iu,i=G,iu=r,(G=a)&&!i?(r=2,n.subtreeFlags&8772&&(r|=1),Lu(e,n,r)):Fu(e,n),iu=t,G=i}break;case 30:Fu(e,n),r&512&&El(n,n.return);break;case 7:r&512&&El(n,n.return);default:Fu(e,n)}}function gu(e,t){for(e=e.child;e!==null;)_u(e,t),e=e.sibling}function _u(e,t){switch(e.tag){case 5:case 26:try{var n=e.stateNode;if(t){var r=n.style;typeof r.setProperty==`function`?r.setProperty(`display`,`none`,`important`):r.display=`none`}else{var i=e.stateNode,a=e.memoizedProps.style,o=a!=null&&a.hasOwnProperty(`display`)?a.display:null;i.style.display=o==null||typeof o==`boolean`?``:(``+o).trim()}}catch(t){Z(e,e.return,t)}vu(e,t);break;case 6:try{e.stateNode.nodeValue=t?``:e.memoizedProps,R=!0}catch(t){Z(e,e.return,t)}break;case 18:try{var s=e.stateNode;t?wp(s,!0):wp(e.stateNode,!1)}catch(t){Z(e,e.return,t)}break;case 22:case 23:e.memoizedState===null&&gu(e,t);break;default:gu(e,t)}}function vu(e,t){if(e.subtreeFlags&67108864)for(e=e.child;e!==null;){a:{var n=e,r=t;switch(n.tag){case 4:_u(n,r);break a;case 22:n.memoizedState===null&&vu(n,r);break a;default:vu(n,r)}}e=e.sibling}}function yu(e){var t=e.alternate;t!==null&&(e.alternate=null,yu(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&Pt(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var bu=null,xu=!1;function Su(e,t,n){for(n=n.child;n!==null;)Cu(e,t,n),n=n.sibling}function Cu(e,t,n){if($e&&typeof $e.onCommitFiberUnmount==`function`)try{$e.onCommitFiberUnmount(Qe,n)}catch{}switch(n.tag){case 26:G||Dl(n,t),Su(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&!G&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:G||Dl(n,t),Al(n);var r=bu,i=xu;Sp(n.type)&&(bu=n.stateNode,xu=!1),Su(e,t,n),gm(n.stateNode,n.type,n.memoizedProps),bu=r,xu=i;break;case 5:G||Dl(n,t),Al(n);case 6:if(n.tag===6&&Al(n),r=bu,i=xu,bu=null,Su(e,t,n),bu=r,xu=i,bu!==null){if(xu)try{(bu.nodeType===9?bu.body:bu.nodeName===`HTML`?bu.ownerDocument.body:bu).removeChild(n.stateNode),R=!0}catch(e){Z(n,t,e)}else try{bu.removeChild(n.stateNode),R=!0}catch(e){Z(n,t,e)}}break;case 18:bu!==null&&(xu?(e=bu,Cp(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Hh(e)):Cp(bu,n.stateNode));break;case 4:r=bu,i=xu,bu=n.stateNode.containerInfo,xu=!0,Su(e,t,n),bu=r,xu=i;break;case 0:case 11:case 14:case 15:Cl(2,n,t),G||Cl(4,n,t),Su(e,t,n);break;case 1:G||(Dl(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&Tl(n,t,r)),Su(e,t,n);break;case 21:Su(e,t,n);break;case 22:G=(r=G)||n.memoizedState!==null,Su(e,t,n),G=r;break;case 30:Dl(n,t),Su(e,t,n);break;case 7:G||Dl(n,t),Su(e,t,n);break;default:Su(e,t,n)}}function wu(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Hh(e)}catch(e){Z(t,t.return,e)}}}function Tu(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Hh(e)}catch(e){Z(t,t.return,e)}}function Eu(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new su),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new su),t;default:throw Error(i(435,e.tag))}}function Du(e,t){var n=Eu(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=vf.bind(null,e,t);t.then(r,r)}})}function Ou(e,t,n){var r=t.deletions;if(r!==null)for(var a=0;a<r.length;a++){var o=r[a],s=e,c=t,l=c;a:for(;l!==null;){switch(l.tag){case 27:if(Sp(l.type)){bu=l.stateNode,xu=!1;break a}break;case 5:bu=l.stateNode,xu=!1;break a;case 3:case 4:bu=l.stateNode.containerInfo,xu=!0;break a}l=l.return}if(bu===null)throw Error(i(160));Cu(s,c,o),bu=null,xu=!1,s=o.alternate,s!==null&&(s.return=null),o.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Au(t,e,n),t=t.sibling}var ku=null;function Au(e,t,n){var r=e.alternate,a=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(a&4&&(r=e.updateQueue,r=r===null?null:r.events,r!==null))for(var o=0;o<r.length;o++){var s=r[o];s.ref.impl=s.nextImpl}Ou(t,e,n),ju(e),a&4&&(Cl(3,e,e.return),Sl(3,e),Cl(5,e,e.return));break;case 1:Ou(t,e,n),ju(e),a&512&&(G||r===null||Dl(r,r.return)),a&64&&iu&&(e=e.updateQueue,e!==null&&(t=e.callbacks,t!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?t:n.concat(t))));break;case 26:if(o=ku,Ou(t,e,n),ju(e),a&512&&(G||r===null||Dl(r,r.return)),a&4){if(a=r===null?null:r.memoizedState,n=e.memoizedState,r===null){if(n===null){if(e.stateNode===null){if(iu)e.stateNode=fp(e.type,e.memoizedProps,t.containerInfo,e);else{a:{t=e.type,n=e.memoizedProps,a=o.ownerDocument||o;b:switch(t){case`title`:r=a.getElementsByTagName(`title`)[0],(!r||r[Mt]||r[Tt]||r.namespaceURI===`http://www.w3.org/2000/svg`||r.hasAttribute(`itemprop`))&&(r=a.createElement(t),a.head.insertBefore(r,a.querySelector(`head > title`))),np(r,t,n),r[Tt]=e,zt(r),t=r;break a;case`link`:if(o=Gm(`link`,`href`,a).get(t+(n.href||``))){for(s=0;s<o.length;s++)if(r=o[s],r.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&r.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&r.getAttribute(`title`)===(n.title==null?null:n.title)&&r.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){o.splice(s,1);break b}}r=a.createElement(t),np(r,t,n),a.head.appendChild(r);break;case`meta`:if(o=Gm(`meta`,`content`,a).get(t+(n.content||``))){for(s=0;s<o.length;s++)if(r=o[s],r.getAttribute(`content`)===(n.content==null?null:``+n.content)&&r.getAttribute(`name`)===(n.name==null?null:n.name)&&r.getAttribute(`property`)===(n.property==null?null:n.property)&&r.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&r.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){o.splice(s,1);break b}}r=a.createElement(t),np(r,t,n),a.head.appendChild(r);break;default:throw Error(i(468,t))}r[Tt]=e,zt(r),t=r}e.stateNode=t}}else iu||Km(o,e.type,e.stateNode)}else e.stateNode=Bm(o,n,e.memoizedProps)}else a===n?n===null&&e.stateNode!==null&&Pl(e,e.memoizedProps,r.memoizedProps):(a===null?(t=r.stateNode,t===null||G||t.parentNode.removeChild(t)):a.count--,n===null?iu||Km(o,e.type,e.stateNode):Bm(o,n,e.memoizedProps))}break;case 27:Ou(t,e,n),ju(e),a&512&&(G||r===null||Dl(r,r.return)),r!==null&&a&4&&Pl(e,e.memoizedProps,r.memoizedProps);break;case 5:if(o=au,au=!1,Ou(t,e,n),au=o,ju(e),a&512&&(G||r===null||Dl(r,r.return)),e.flags&32){t=e.stateNode;try{dn(t,``),R=!0}catch(t){Z(e,e.return,t)}}a&4&&e.stateNode!=null&&(t=e.memoizedProps,Pl(e,t,r===null?t:r.memoizedProps)),a&1024&&(ou=!0);break;case 6:if(Ou(t,e,n),ju(e),a&4){if(e.stateNode===null)throw Error(i(162));t=e.memoizedProps,n=e.stateNode;try{n.nodeValue=t,R=!0}catch(t){Z(e,e.return,t)}}break;case 3:if(R=!1,Wm=null,o=ku,ku=bm(t.containerInfo),Ou(t,e,n),ku=o,ju(e),a&4&&r!==null&&r.memoizedState.isDehydrated)try{Hh(t.containerInfo)}catch(t){Z(e,e.return,t)}ou&&(ou=!1,Mu(e)),R=!1;break;case 4:a=au,au=iu,r=qt(),o=ku,ku=bm(e.stateNode.containerInfo),Ou(t,e,n),ju(e),ku=o,R&&uu&&(du=!0),R=r,au=a;break;case 12:Ou(t,e,n),ju(e);break;case 31:Ou(t,e,n),ju(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Du(e,t)));break;case 13:Ou(t,e,n),ju(e),e.child.flags&8192&&e.memoizedState!==null!=(r!==null&&r.memoizedState!==null)&&(md=Ue()),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Du(e,t)));break;case 22:o=e.memoizedState!==null,s=r!==null&&r.memoizedState!==null;var c=iu,l=G,u=au;iu=c||o,au=u||o,G=l||s,Ou(t,e,n),G=l,au=u,iu=c,ju(e),a&8192&&(t=e.stateNode,t._visibility=o?t._visibility&-2:t._visibility|1,!o||r===null||s||iu||G||(t=s||G,n=iu,r=G,iu=o||iu,G=t,Iu(e,2),iu=n,G=r),!o&&au||gu(e,o)),a&4&&(t=e.updateQueue,t!==null&&(n=t.retryQueue,n!==null&&(t.retryQueue=null,Du(e,n))));break;case 19:Ou(t,e,n),ju(e),a&4&&(t=e.updateQueue,t!==null&&(e.updateQueue=null,Du(e,t)));break;case 30:a&512&&(G||r===null||Dl(r,r.return)),a=qt(),o=uu,s=(n&335544064)===n,c=e.memoizedProps,uu=s&&bi(c.default,c.update)!==`none`,Ou(t,e,n),ju(e),s&&r!==null&&R&&(e.flags|=4),uu=o,R=a;break;case 21:break;case 7:a&512&&(G||r===null||Dl(r,r.return)),r&&r.stateNode!==null&&(r.stateNode._fragmentFiber=e);default:Ou(t,e,n),ju(e)}}function ju(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(Fl(r)){n=r;break}r=r.return}r=null;for(var a=e.return;a!==null;){if(Ml(a)){var o=a.stateNode;r===null?r=[o]:r.push(o)}if(jl(a))break;a=a.return}var s=r;if(n==null)throw Error(i(160));switch(n.tag){case 27:var c=n.stateNode;Rl(e,Il(e),c,s);break;case 5:var l=n.stateNode;n.flags&32&&(dn(l,``),n.flags&=-33),Rl(e,Il(e),l,s);break;case 3:case 4:var u=n.stateNode.containerInfo;Ll(e,Il(e),u,s);break;default:throw Error(i(161))}}catch(t){Z(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Mu(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Mu(t),t.tag===5&&t.flags&1024&&(t=t.stateNode,gh=!0,t.reset(),gh=!1),e=e.sibling}}function Nu(e,t){if(t.subtreeFlags&9270)for(t=t.child;t!==null;)Pu(t,e),t=t.sibling;else ru(t,!1)}function Pu(e,t){var n=e.alternate;if(n===null)Yl(e,!1);else switch(e.tag){case 3:if(fu=lu=!1,Wl(),Nu(t,e),!lu&&!du){if(e=Ul,e!==null)for(var r=0;r<e.length;r+=3){n=e[r];var i=e[r+1];Ep(n,e[r+2]),n=n.ownerDocument.documentElement,n!==null&&n.animate({opacity:[0,0],pointerEvents:[`none`,`none`]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition-group(`+i+`)`})}e=t.containerInfo,e=e.nodeType===9?e.documentElement:e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===``&&(e.style.viewTransitionName=`none`,e.animate({opacity:[0,0],pointerEvents:[`none`,`none`]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition-group(root)`}),e.animate({width:[0,0],height:[0,0]},{duration:0,fill:`forwards`,pseudoElement:`::view-transition`})),fu=!0}Ul=null;break;case 5:Nu(t,e);break;case 4:r=lu,lu=!1,Nu(t,e),lu&&(du=!0),lu=r;break;case 22:e.memoizedState===null&&(n.memoizedState===null?Nu(t,e):Yl(e,!1));break;case 30:r=lu,i=Wl(),lu=!1,Nu(t,e),lu&&(e.flags|=4);var a=e.memoizedProps,o=e.stateNode;t=vi(a,o),o=vi(n.memoizedProps,o);var s=bi(a.default,a.update);s===`none`?t=!1:(a=n.memoizedState,n.memoizedState=null,n=e.child,W=0,t=nu(e,n,t,o,s,a,!0),W!==(a===null?0:a.length)&&(e.flags|=32)),e.flags&4&&t?(Nd(e,e.memoizedProps.onUpdate),Ul=i):i!==null&&(i.push.apply(i,Ul),Ul=i),lu=e.flags&32?!0:r;break;default:Nu(t,e)}}function Fu(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)hu(e,t.alternate,t),t=t.sibling}function Iu(e,t){for(e=e.child;e!==null;){var n=e,r=t;switch(n.tag){case 0:case 11:case 14:case 15:Cl(4,n,n.return),Iu(n,r);break;case 1:Dl(n,n.return);var i=n.stateNode;typeof i.componentWillUnmount==`function`&&Tl(n,n.return,i),Iu(n,r);break;case 27:r&2&&gm(n.stateNode,n.type,n.memoizedProps);case 5:Dl(n,n.return),n.tag!==5&&n.tag!==27||Al(n),Iu(n,r);break;case 6:Al(n);break;case 26:Dl(n,n.return),i=n.stateNode,n.memoizedState!==null||i===null||G||i.parentNode.removeChild(i),Iu(n,r);break;case 22:n.memoizedState===null&&Iu(n,r);break;case 30:Dl(n,n.return),Iu(n,r);break;case 7:Dl(n,n.return);default:Iu(n,r)}e=e.sibling}}function Lu(e,t,n){for(n=t.subtreeFlags&8772?n:n&-2,t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags,s=!!(n&1);switch(a.tag){case 0:case 11:case 15:Lu(i,a,n),Sl(4,a);break;case 1:if(Lu(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){Z(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var c=r.stateNode;try{var l=i.shared.hiddenCallbacks;if(l!==null)for(i.shared.hiddenCallbacks=null,i=0;i<l.length;i++)Co(l[i],c)}catch(e){Z(r,r.return,e)}}s&&o&64&&wl(a),El(a,a.return);break;case 27:n&2&&zl(a);case 5:a.tag!==5&&a.tag!==27||kl(a),Lu(i,a,n),s&&r===null&&o&4&&Nl(a),El(a,a.return);break;case 6:kl(a);break;case 26:c=a.stateNode,a.memoizedState!==null||c===null||iu||Km(bm(c.ownerDocument),a.type,c),Lu(i,a,n),s&&r===null&&o&4&&Nl(a),El(a,a.return);break;case 12:Lu(i,a,n);break;case 31:Lu(i,a,n),s&&o&4&&wu(i,a);break;case 13:Lu(i,a,n),s&&o&4&&Tu(i,a);break;case 22:a.memoizedState===null&&Lu(i,a,n),El(a,a.return);break;case 30:Lu(i,a,n),El(a,a.return);break;case 7:El(a,a.return);default:Lu(i,a,n)}t=t.sibling}}function Ru(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Na(n))}function zu(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Na(e))}function Bu(e,t,n,r){var i=(n&335544064)===n;if(t.subtreeFlags&(i?10262:10256))for(t=t.child;t!==null;)Vu(e,t,n,r),t=t.sibling;else i&&tu(t)}function Vu(e,t,n,r){var i=(n&335544064)===n;i&&t.alternate===null&&t.return!==null&&t.return.alternate!==null&&eu(t);var a=t.flags;switch(t.tag){case 0:case 11:case 15:Bu(e,t,n,r),a&2048&&Sl(9,t);break;case 1:Bu(e,t,n,r);break;case 3:Bu(e,t,n,r),i&&fu&&(e=e.containerInfo,e=e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,e.style.viewTransitionName===`root`&&(e.style.viewTransitionName=``),e=e.ownerDocument.documentElement,e!==null&&e.style.viewTransitionName===`none`&&(e.style.viewTransitionName=``)),a&2048&&(a=null,t.alternate!==null&&(a=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==a&&(t.refCount++,a!=null&&Na(a)));break;case 12:if(a&2048){Bu(e,t,n,r),a=t.stateNode;try{var o=t.memoizedProps,s=o.id,c=o.onPostCommit;typeof c==`function`&&c(s,t.alternate===null?`mount`:`update`,a.passiveEffectDuration,-0)}catch(e){Z(t,t.return,e)}}else Bu(e,t,n,r);break;case 31:Bu(e,t,n,r);break;case 13:Bu(e,t,n,r);break;case 23:break;case 22:o=t.stateNode,s=t.alternate,t.memoizedState===null?(i&&s!==null&&s.memoizedState!==null&&eu(t),o._visibility&2?Bu(e,t,n,r):(o._visibility|=2,Hu(e,t,n,r,!!(t.subtreeFlags&10256)||!1))):(i&&s!==null&&s.memoizedState===null&&eu(s),o._visibility&2?Bu(e,t,n,r):Uu(e,t)),a&2048&&Ru(s,t);break;case 24:Bu(e,t,n,r),a&2048&&zu(t.alternate,t);break;case 30:i&&(a=t.alternate,a!==null&&(ql(a.child,!0),ql(t.child,!0))),Bu(e,t,n,r);break;default:Bu(e,t,n,r)}}function Hu(e,t,n,r,i){for(i&&=!!(t.subtreeFlags&10256)||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:Hu(a,o,s,c,i),Sl(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,Hu(a,o,s,c,i)):u._visibility&2?Hu(a,o,s,c,i):Uu(a,o),i&&l&2048&&Ru(o.alternate,o);break;case 24:Hu(a,o,s,c,i),i&&l&2048&&zu(o.alternate,o);break;default:Hu(a,o,s,c,i)}t=t.sibling}}function Uu(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:Uu(n,r),i&2048&&Ru(r.alternate,r);break;case 24:Uu(n,r),i&2048&&zu(r.alternate,r);break;default:Uu(n,r)}t=t.sibling}}var Wu=8192;function Gu(e,t,n){if(e.subtreeFlags&Wu)for(e=e.child;e!==null;)Ku(e,t,n),e=e.sibling}function Ku(e,t,n){switch(e.tag){case 26:Gu(e,t,n),e.flags&Wu&&(e.memoizedState===null?(e=e.stateNode,(t&335544128)===t&&Zm(n,e)):Qm(n,ku,e.memoizedState,e.memoizedProps));break;case 5:Gu(e,t,n),e.flags&Wu&&(e=e.stateNode,(t&335544128)===t&&Zm(n,e));break;case 3:case 4:var r=ku;ku=bm(e.stateNode.containerInfo),Gu(e,t,n),ku=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Wu,Wu=16777216,Gu(e,t,n),Wu=r):Gu(e,t,n));break;case 30:if((e.flags&Wu)!==0&&(r=e.memoizedProps.name,r!=null&&r!==`auto`)){var i=e.stateNode;i.paired=null,Vl===null&&(Vl=new Map),Vl.set(r,i)}Gu(e,t,n);break;default:Gu(e,t,n)}}function qu(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Ju(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];cu=r,Zu(r,e)}qu(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Yu(e),e=e.sibling}function Yu(e){switch(e.tag){case 0:case 11:case 15:Ju(e),e.flags&2048&&Cl(9,e,e.return);break;case 3:Ju(e);break;case 12:Ju(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Xu(e)):Ju(e);break;default:Ju(e)}}function Xu(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];cu=r,Zu(r,e)}qu(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Cl(8,t,t.return),Xu(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Xu(t));break;default:Xu(t)}e=e.sibling}}function Zu(e,t){for(;cu!==null;){var n=cu;switch(n.tag){case 0:case 11:case 15:Cl(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:Na(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,cu=r;else a:for(n=e;cu!==null;){r=cu;var i=r.sibling,a=r.return;if(yu(r),r===n){cu=null;break a}if(i!==null){i.return=a,cu=i;break a}cu=a}}}var Qu={getCacheForType:function(e){var t=Ta(ja),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return Ta(ja).controller.signal}},$u=typeof WeakMap==`function`?WeakMap:Map,K=0,q=null,J=null,Y=0,X=0,ed=null,td=!1,nd=!1,rd=!1,id=0,ad=0,od=0,sd=0,cd=0,ld=0,ud=0,dd=null,fd=null,pd=!1,md=0,hd=0,gd=1/0,_d=null,vd=null,yd=0,bd=null,xd=null,Sd=0,Cd=0,wd=null,Td=null,Ed=null,Dd=null,Od=null,kd=0,Ad=null;function jd(){return K&2&&Y!==0?Y&-Y:N.T===null?St():Pf()}function Md(){if(ld===0){if(!(Y&536870912)||B){var e=ot;ot<<=1,!(ot&3932160)&&(ot=262144),ld=e}else ld=536870912}return e=Ao.current,e!==null&&(e.flags|=32),ld}function Nd(e,t){if(t!=null){var n=e.stateNode,r=n.ref;r===null&&(r=n.ref=Pp(vi(e.memoizedProps,n))),Dd===null&&(Dd=[]),Dd.push(t.bind(null,r))}}function Pd(e,t,n){(e===q&&(X===2||X===9)||e.cancelPendingCommit!==null)&&(Vd(e,0),Rd(e,Y,ld,!1)),ht(e,n),(!(K&2)||e!==q)&&(e===q&&(!(K&2)&&(sd|=n),ad===4&&Rd(e,Y,ld,!1)),Ef(e))}function Fd(e,t,n){if(K&6)throw Error(i(327));var r=!n&&!(t&127)&&(t&e.expiredLanes)===0||ut(e,t),a=r?Yd(e,t):qd(e,t,!0),o=r;do{if(a===0){nd&&!r&&Rd(e,t,0,!1);break}if(n=e.current.alternate,o&&!Ld(n)){a=qd(e,t,!1),o=!1;continue}if(a===2){if(o=t,e.errorRecoveryDisabledLanes&o)var s=0;else s=e.pendingLanes&-536870913,s=s===0?s&536870912?536870912:0:s;if(s!==0){t=s;a:{var c=e;a=dd;var l=c.current.memoizedState.isDehydrated;if(l&&(Vd(c,s).flags|=256),s=qd(c,s,!1),s!==2&&s!==6){if(rd&&!l){c.errorRecoveryDisabledLanes|=o,sd|=o,a=4;break a}o=fd,fd=a,o!==null&&(fd===null?fd=o:fd.push.apply(fd,o))}a=s}if(o=!1,a!==2)continue}}if(a===1){Vd(e,0),Rd(e,t,0,!0);break}a:{switch(r=e,o=a,o){case 0:case 1:throw Error(i(345));case 4:if((t&4194048)!==t&&(t&62914560)!==t)break;case 6:Rd(r,t,ld,!td);break a;case 2:fd=null;break;case 3:case 5:break;default:throw Error(i(329))}if((t&62914560)===t&&(a=md+300-Ue(),10<a)){if(Rd(r,t,ld,!td),lt(r,0,!0)!==0)break a;Sd=t,r.timeoutHandle=gp(Id.bind(null,r,n,fd,_d,pd,t,ld,sd,ud,td,o,`Throttled`,-0,0),a);break a}Id(r,n,fd,_d,pd,t,ld,sd,ud,td,o,null,-0,0)}break}while(1);Ef(e)}function Id(e,t,n,r,i,a,o,s,c,l,u,d,f,p){e.timeoutHandle=-1;var m=t.subtreeFlags,h=(a&335544064)===a;if(d=null,(h||m&8192||(m&16785408)==16785408)&&(d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:yn},Vl=null,Ku(t,a,d),h&&(m=d,h=e.containerInfo,h=(h.nodeType===9?h:h.ownerDocument).__reactViewTransition,h!=null&&(m.count++,m.waitingForViewTransition=!0,m=nh.bind(m),h.finished.then(m,m))),m=(a&62914560)===a?md-Ue():(a&4194048)===a?hd-Ue():0,m=eh(d,m),m!==null)){Sd=a,e.cancelPendingCommit=m(nf.bind(null,e,t,a,n,r,i,o,s,c,l,u,d,null,f,p)),Rd(e,a,o,!l);return}nf(e,t,a,n,r,i,o,s,c,l,u,d)}function Ld(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!Hr(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Rd(e,t,n,r){t=dt(e,t),t&=~cd,t&=~sd,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-tt(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&_t(e,n,t)}function zd(){return K&6?!0:(Df(0,!1),!1)}function Bd(){if(J!==null){if(X===0)var e=J.return;else e=J,_a=ga=null,is(e),ao=null,oo=0,e=J;for(;e!==null;)xl(e.alternate,e),e=e.return;J=null}}function Vd(e,t){var n=e.timeoutHandle;return n!==-1&&(e.timeoutHandle=-1,_p(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Sd=0,Bd(),q=e,J=n=Fi(e.current,null),Y=t,X=0,ed=null,td=!1,nd=ut(e,t),rd=!1,ud=ld=cd=sd=od=ad=0,fd=dd=null,pd=!1,id=dt(e,t),Ti(),n}function Hd(e,t){H=null,N.H=mc,t===Ya||t===Za?(t=ro(),X=3):t===Xa?(t=ro(),X=4):X=t===Mc?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,ed=t,J===null&&(ad=1,Ec(e,Ui(t,e.current)))}function Ud(){var e=Ao.current;return e===null?!0:(Y&4194048)===Y?jo===null:(Y&62914560)===Y||Y&536870912?e===jo:!1}function Wd(){var e=N.H;return N.H=mc,e===null?mc:e}function Gd(){var e=N.A;return N.A=Qu,e}function Kd(){ad=4,td||(Y&4194048)!==Y&&Ao.current!==null||(nd=!0),!(od&134217727)&&!(sd&134217727)||q===null||Rd(q,Y,ld,!1)}function qd(e,t,n){var r=K;K|=2;var i=Wd(),a=Gd();(q!==e||Y!==t)&&(_d=null,Vd(e,t)),t=!1;var o=ad;a:do try{if(X!==0&&J!==null){var s=J,c=ed;switch(X){case 8:Bd(),o=6;break a;case 3:case 2:case 9:case 6:Ao.current===null&&(t=!0);var l=X;if(X=0,ed=null,$d(e,s,c,l),n&&nd){o=0;break a}break;default:l=X,X=0,ed=null,$d(e,s,c,l)}}Jd(),o=ad;break}catch(t){Hd(e,t)}while(1);return t&&e.shellSuspendCounter++,_a=ga=null,K=r,N.H=i,N.A=a,J===null&&(q=null,Y=0,Ti()),o}function Jd(){for(;J!==null;)Zd(J)}function Yd(e,t){var n=K;K|=2;var r=Wd(),a=Gd();q!==e||Y!==t?(_d=null,gd=Ue()+500,Vd(e,t)):nd=ut(e,t);a:do try{if(X!==0&&J!==null){t=J;var o=ed;b:switch(X){case 1:X=0,ed=null,$d(e,t,o,1);break;case 2:case 9:if($a(o)){X=0,ed=null,Qd(t);break}t=function(){X!==2&&X!==9||q!==e||(X=7),Ef(e)},o.then(t,t);break a;case 3:X=7;break a;case 4:X=5;break a;case 7:$a(o)?(X=0,ed=null,Qd(t)):(X=0,ed=null,$d(e,t,o,7));break;case 5:var s=null;switch(J.tag){case 26:s=J.memoizedState;case 5:case 27:var c=J;if(s?Ym(s):c.stateNode.complete){X=0,ed=null;var l=c.sibling;if(l!==null)J=l;else{var u=c.return;u===null?J=null:(J=u,ef(u))}break b}}X=0,ed=null,$d(e,t,o,5);break;case 6:X=0,ed=null,$d(e,t,o,6);break;case 8:Bd(),ad=6;break a;default:throw Error(i(462))}}Xd();break}catch(t){Hd(e,t)}while(1);return _a=ga=null,N.H=r,N.A=a,K=n,J===null?(q=null,Y=0,Ti(),ad):0}function Xd(){for(;J!==null&&!Ve();)Zd(J)}function Zd(e){var t=fl(e.alternate,e,id);e.memoizedProps=e.pendingProps,t===null?ef(e):J=t}function Qd(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Kc(n,t,t.pendingProps,t.type,void 0,Y);break;case 11:t=Kc(n,t,t.pendingProps,t.type.render,t.ref,Y);break;case 5:is(t);var r=t;r===ia&&(B?(ua(r),r.tag===5&&r.stateNode!=null&&(z=r.stateNode)):(ua(r),B=!0));default:xl(n,t),t=J=Ii(t,id),t=fl(n,t,id)}e.memoizedProps=e.pendingProps,t===null?ef(e):J=t}function $d(e,t,n,r){_a=ga=null,is(t),ao=null,oo=0;var i=t.return;try{if(jc(e,i,t,n,Y)){ad=1,Ec(e,Ui(n,e.current)),J=null;return}}catch(t){if(i!==null)throw J=i,t;ad=1,Ec(e,Ui(n,e.current)),J=null;return}t.flags&32768?(B||r===1?e=!0:nd||Y&536870912?e=!1:(td=e=!0,(r===2||r===9||r===3||r===6)&&(r=Ao.current,r!==null&&r.tag===13&&(r.flags|=16384))),tf(t,e)):ef(t)}function ef(e){var t=e;do{if(t.flags&32768){tf(t,td);return}e=t.return;var n=yl(t.alternate,t,id);if(n!==null){J=n;return}if(t=t.sibling,t!==null){J=t;return}J=t=e}while(t!==null);ad===0&&(ad=5)}function tf(e,t){do{var n=bl(e.alternate,e);if(n!==null){n.flags&=32767,J=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){J=e;return}J=e=n}while(e!==null);ad=6,J=null}function nf(e,t,n,r,a,o,s,c,l,u,d,f){e.cancelPendingCommit=null;do df();while(yd!==0);if(K&6)throw Error(i(327));if(t!==null){if(t===e.current)throw Error(i(177));e===q&&(J=q=null,Y=0),xd=t,bd=e,Sd=n,wd=a,Td=r,rf(e,t,n,s,c,l,f)}}function rf(e,t,n,r,i,a,o){var s=t.lanes|t.childLanes;if(Cd=s,s|=wi,gt(e,n,s,r,i,a),Dd=null,(n&335544064)===n?(Od=Ia(e),r=10262):(Od=null,r=10256),(t.subtreeFlags&r)!==0||(t.flags&r)!==0?(e.callbackNode=null,e.callbackPriority=0,yf(qe,function(){return ff(),null})):(e.callbackNode=null,e.callbackPriority=0),Bl=!1,r=!!(t.flags&13878),t.subtreeFlags&13878||r){r=N.T,N.T=null,i=P.p,P.p=2,a=K,K|=4;try{pu(e,t,n)}finally{K=a,P.p=i,N.T=r}}yd=1,Bl?Ed=Mp(o,e.containerInfo,Od,sf,cf,of,lf,ff,af,null,null):(sf(),cf(),lf())}function af(e){if(yd!==0){var t=bd.onRecoverableError;t(e,{componentStack:null})}}function of(){yd===3&&(yd=0,Pu(xd,bd),yd=4)}function sf(){if(yd===1){yd=0;var e=bd,t=xd,n=Sd,r=!!(t.flags&13878);if(t.subtreeFlags&13878||r){r=N.T,N.T=null;var i=P.p;P.p=2;var a=K;K|=4;try{uu=du=!1,Au(t,e,n),n=cp;var o=Jr(e.containerInfo),s=n.focusedElem,c=n.selectionRange;if(o!==s&&s&&s.ownerDocument&&qr(s.ownerDocument.documentElement,s)){if(c!==null&&Yr(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=Kr(s,h),v=Kr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}gh=!!sp,cp=sp=null}finally{K=a,P.p=i,N.T=r}}e.current=t,yd=2}}function cf(){if(yd===2){yd=0;var e=bd,t=xd,n=!!(t.flags&8772);if(t.subtreeFlags&8772||n){n=N.T,N.T=null;var r=P.p;P.p=2;var i=K;K|=4;try{hu(e,t.alternate,t)}finally{K=i,P.p=r,N.T=n}}yd=3}}function lf(){if(yd===4||yd===3){yd=0;var e=Ed;Ed=null,He();var t=bd,n=xd,r=Sd,i=Td,a=(r&335544064)===r?10262:10256;if((n.subtreeFlags&a)!==0||(n.flags&a)!==0?yd=5:(yd=0,xd=bd=null,uf(t,t.pendingLanes)),a=t.pendingLanes,a===0&&(vd=null),xt(r),n=n.stateNode,$e&&typeof $e.onCommitFiberRoot==`function`)try{$e.onCommitFiberRoot(Qe,n,void 0,(n.current.flags&128)==128)}catch{}if(i!==null){n=N.T,a=P.p,P.p=2,N.T=null;try{for(var o=t.onRecoverableError,s=0;s<i.length;s++){var c=i[s];o(c.value,{componentStack:c.stack})}}finally{N.T=n,P.p=a}}if(i=Dd,o=Od,Od=null,i!==null&&(Dd=null,o===null&&(o=[]),e!==null))for(c=0;c<i.length;c++)n=(0,i[c])(o),n!==void 0&&e.finished.finally(n);Sd&3&&df(),Ef(t),a=t.pendingLanes,r&261930&&a&42?t===Ad?kd++:(kd=0,Ad=t):(kd=0,Ad=null),Df(0,!1)}}function uf(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Na(t)))}function df(){return Ed!==null&&(Ed.skipTransition(),Ed=null),sf(),cf(),lf(),ff()}function ff(){if(yd!==5)return!1;var e=bd,t=Cd;Cd=0;var n=xt(Sd),r=N.T,a=P.p;try{P.p=32>n?32:n,N.T=null,n=wd,wd=null;var o=bd,s=Sd;if(yd=0,xd=bd=null,Sd=0,K&6)throw Error(i(331));var c=K;if(K|=4,Yu(o.current),Vu(o,o.current,s,n),K=c,Df(0,!1),$e&&typeof $e.onPostCommitFiberRoot==`function`)try{$e.onPostCommitFiberRoot(Qe,o)}catch{}return!0}finally{P.p=a,N.T=r,uf(e,t)}}function pf(e,t,n){t=Ui(n,t),t=Oc(e.stateNode,t,2),e=vo(e,t,2),e!==null&&(ht(e,2),Ef(e))}function Z(e,t,n){if(e.tag===3)pf(e,e,n);else for(;t!==null;){if(t.tag===3){pf(t,e,n);break}if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(vd===null||!vd.has(r))){e=Ui(n,e),n=kc(2),r=vo(t,n,2),r!==null&&(Ac(n,r,t,e),ht(r,2),Ef(r));break}}t=t.return}}function mf(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new $u;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(rd=!0,i.add(n),e=hf.bind(null,e,t,n),t.then(e,e))}function hf(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,q===e&&(Y&n)===n&&(ad===4||ad===3&&(Y&62914560)===Y&&300>Ue()-md?K&2?cd|=n:Vd(e,0):cd|=n,ud===Y&&(ud=0)),Ef(e)}function gf(e,t){t===0&&(t=pt()),e=Oi(e,t),e!==null&&(ht(e,t),Ef(e))}function _f(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),gf(e,n)}function vf(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(i(314))}r!==null&&r.delete(t),gf(e,n)}function yf(e,t){return ze(e,t)}var bf=null,xf=null,Sf=!1,Cf=!1,wf=!1,Tf=0;function Ef(e){e!==xf&&e.next===null&&(xf===null?bf=xf=e:xf=xf.next=e),Cf=!0,Sf||(Sf=!0,Nf())}function Df(e,t){if(!wf&&Cf){wf=!0;do for(var n=!1,r=bf;r!==null;){if(!t){if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-tt(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,Mf(r,a))}else a=Y,a=lt(r,r===q?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||ut(r,a)||(n=!0,Mf(r,a))}r=r.next}while(n);wf=!1}}function Of(){kf()}function kf(){Cf=Sf=!1;var e=0;Tf!==0&&hp()&&(e=Tf);for(var t=Ue(),n=null,r=bf;r!==null;){var i=r.next,a=Af(r,t);a===0?(r.next=null,n===null?bf=i:n.next=i,i===null&&(xf=n)):(n=r,(e!==0||a&3)&&(Cf=!0)),r=i}yd!==0&&yd!==5||Df(e,!1),Tf!==0&&(Tf=0)}function Af(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-tt(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=ft(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=q,n=Y,n=lt(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(X===2||X===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&Be(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||ut(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&Be(r),xt(n)){case 2:case 8:n=Ke;break;case 32:n=qe;break;case 268435456:n=Ye;break;default:n=qe}return r=jf.bind(null,e),n=ze(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&Be(r),e.callbackPriority=2,e.callbackNode=null,2}function jf(e,t){if(yd!==0&&yd!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(df()&&e.callbackNode!==n)return null;var r=Y;return r=lt(e,e===q?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(Fd(e,r,t),Af(e,Ue()),e.callbackNode!=null&&e.callbackNode===n?jf.bind(null,e):null)}function Mf(e,t){if(df())return null;Fd(e,t,!0)}function Nf(){bp(function(){K&6?ze(Ge,Of):kf()})}function Pf(){if(Tf===0){var e=za;e===0&&(e=at,at<<=1,!(at&261888)&&(at=256)),Tf=e}return Tf}function Ff(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:vn(e)}function If(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=Ff((i[Et]||null).action),o=r.submitter;o&&(t=(t=o[Et]||null)?Ff(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new Bn(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(Tf!==0){var e=new FormData(i,o);ec(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=new FormData(i,o),ec(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var Lf=0;Lf<hi.length;Lf++){var Rf=hi[Lf];gi(Rf.toLowerCase(),`on`+(Rf[0].toUpperCase()+Rf.slice(1)))}gi(si,`onAnimationEnd`),gi(ci,`onAnimationIteration`),gi(li,`onAnimationStart`),gi(`dblclick`,`onDoubleClick`),gi(`focusin`,`onFocus`),gi(`focusout`,`onBlur`),gi(ui,`onTransitionRun`),gi(di,`onTransitionStart`),gi(fi,`onTransitionCancel`),gi(pi,`onTransitionEnd`),Ht(`onMouseEnter`,[`mouseout`,`mouseover`]),Ht(`onMouseLeave`,[`mouseout`,`mouseover`]),Ht(`onPointerEnter`,[`pointerout`,`pointerover`]),Ht(`onPointerLeave`,[`pointerout`,`pointerover`]),L(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),L(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),L(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),L(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),L(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),L(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var zf=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),Bf=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(zf));function Vf(e,t){t=!!(t&4);for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){xi(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){xi(e)}i.currentTarget=null,a=c}}}}function Q(e,t){var n=t[Ot];n===void 0&&(n=t[Ot]=new Set);var r=e+`__bubble`;n.has(r)||(Gf(t,e,2,!1),n.add(r))}function Hf(e,t,n){var r=0;t&&(r|=4),Gf(n,e,r,t)}var Uf=`_reactListening`+Math.random().toString(36).slice(2);function Wf(e){if(!e[Uf]){e[Uf]=!0,I.forEach(function(t){t!==`selectionchange`&&(Bf.has(t)||Hf(t,!1,e),Hf(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Uf]||(t[Uf]=!0,Hf(`selectionchange`,!1,t))}}function Gf(e,t,n,r){switch(Ch(t)){case 2:var i=_h;break;case 8:i=vh;break;default:i=yh}n=i.bind(null,t,n,e),i=void 0,!kn||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function Kf(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var c=r.stateNode.containerInfo;if(c===i)break;if(s===4)for(s=r.return;s!==null;){var l=s.tag;if((l===3||l===4)&&s.stateNode.containerInfo===i)return;s=s.return}for(;c!==null;){if(s=Ft(c),s===null)return;if(l=s.tag,l===5||l===6||l===26||l===27){r=a=s;continue a}c=c.parentNode}}r=r.return}En(function(){var r=a,i=xn(n),s=[];a:{var c=mi.get(e);if(c!==void 0){var l=Bn,u=e;switch(e){case`keypress`:if(Fn(n)===0)break a;case`keydown`:case`keyup`:l=ir;break;case`focusin`:u=`focus`,l=Yn;break;case`focusout`:u=`blur`,l=Yn;break;case`beforeblur`:case`afterblur`:l=Yn;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:l=qn;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:l=Jn;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:l=sr;break;case si:case ci:case li:l=Xn;break;case pi:l=cr;break;case`scroll`:case`scrollend`:l=Hn;break;case`wheel`:l=lr;break;case`copy`:case`cut`:case`paste`:l=Zn;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:l=ar;break;case`submit`:l=or;break;case`toggle`:case`beforetoggle`:l=ur}var d=!!(t&4),f=!d&&(e===`scroll`||e===`scrollend`),p=d?c===null?null:c+`Capture`:c;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=Dn(m,p),g!=null&&d.push(qf(m,g,h))),f)break;m=m.return}0<d.length&&(c=new l(c,u,null,n,i),s.push({event:c,listeners:d}))}}if(!(t&7)){a:{if(l=e===`mouseover`||e===`pointerover`,c=e===`mouseout`||e===`pointerout`,l&&n!==bn&&(u=n.relatedTarget||n.fromElement)&&(Ft(u)||u[Dt]))break a;(c||l)&&(u=i.window===i?i:(l=i.ownerDocument)?l.defaultView||l.parentWindow:window,c?(l=n.relatedTarget||n.toElement,c=r,l=l?Ft(l):null,l!==null&&(f=o(l),d=l.tag,l!==f||d!==5&&d!==27&&d!==6)&&(l=null)):(c=null,l=r),c!==l&&(d=qn,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=ar,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=c==null?u:Lt(c),h=l==null?u:Lt(l),u=new d(g,m+`leave`,c,n,i),u.target=f,u.relatedTarget=h,g=null,Ft(i)===r&&(d=new d(p,m+`enter`,l,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,d=c&&l?T(c,l,Yf):null,c!==null&&Xf(s,u,c,d,!1),l!==null&&f!==null&&Xf(s,f,l,d,!0)))}a:{if(c=r?Lt(r):window,l=c.nodeName&&c.nodeName.toLowerCase(),l===`select`||l===`input`&&c.type===`file`)var _=Ar;else if(wr(c)){if(jr)_=Br;else{_=Rr;var v=Lr}}else l=c.nodeName,!l||l.toLowerCase()!==`input`||c.type!==`checkbox`&&c.type!==`radio`?r&&hn(r.elementType)&&(_=Ar):_=zr;if(_&&=_(e,r)){Tr(s,_,n,i);break a}v&&v(e,c,r)}switch(v=r?Lt(r):window,e){case`focusin`:(wr(v)||v.contentEditable===`true`)&&(Zr=v,Qr=r,$r=null);break;case`focusout`:$r=Qr=Zr=null;break;case`mousedown`:ei=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:ei=!1,ti(s,n,i);break;case`selectionchange`:if(Xr)break;case`keydown`:case`keyup`:ti(s,n,i)}var y;if(fr)b:{switch(e){case`compositionstart`:var b=`onCompositionStart`;break b;case`compositionend`:b=`onCompositionEnd`;break b;case`compositionupdate`:b=`onCompositionUpdate`;break b}b=void 0}else br?vr(e,n)&&(b=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(b=`onCompositionStart`);b&&(hr&&n.locale!==`ko`&&(br||b!==`onCompositionStart`?b===`onCompositionEnd`&&br&&(y=Pn()):(jn=i,Mn=`value`in jn?jn.value:jn.textContent,br=!0)),v=Jf(r,b),0<v.length&&(b=new Qn(b,e,null,n,i),s.push({event:b,listeners:v}),y?b.data=y:(y=yr(n),y!==null&&(b.data=y)))),(y=mr?xr(e,n):Sr(e,n))&&(b=Jf(r,`onBeforeInput`),0<b.length&&(v=new Qn(`onBeforeInput`,`beforeinput`,null,n,i),s.push({event:v,listeners:b}),v.data=y)),If(s,e,r,n,i)}Vf(s,t)})}function qf(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Jf(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=Dn(e,n),i!=null&&r.unshift(qf(e,i,a)),i=Dn(e,t),i!=null&&r.push(qf(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Yf(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Xf(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=Dn(n,a),l!=null&&o.unshift(qf(n,l,c))):i||(l=Dn(n,a),l!=null&&o.push(qf(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var Zf=/\r\n?/g,Qf=/\u0000|\uFFFD/g;function $f(e){return(typeof e==`string`?e:``+e).replace(Zf,`
`).replace(Qf,``)}function ep(e,t){return t=$f(t),$f(e)===t}function $(e,t,n,r,a,o){switch(n){case`children`:if(typeof r==`string`)t===`body`||t===`textarea`&&r===``||dn(e,r);else if(typeof r==`number`||typeof r==`bigint`)t!==`body`&&dn(e,``+r);else return;break;case`className`:Yt(e,`class`,r);break;case`tabIndex`:Yt(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:Yt(e,n,r);break;case`style`:mn(e,r,o);return;case`data`:if(t!==`object`){Yt(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)){e.removeAttribute(n);break}if(r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=vn(r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}if(typeof o==`function`&&(n===`formAction`?(t!==`input`&&$(e,t,`name`,a.name,a,null),$(e,t,`formEncType`,a.formEncType,a,null),$(e,t,`formMethod`,a.formMethod,a,null),$(e,t,`formTarget`,a.formTarget,a,null)):($(e,t,`encType`,a.encType,a,null),$(e,t,`method`,a.method,a,null),$(e,t,`target`,a.target,a,null))),r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=vn(r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=yn);return;case`onScroll`:r!=null&&Q(`scroll`,e);return;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);return;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));o?.__html!==n&&(e.innerHTML=n)}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=vn(r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`credentialless`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:Q(`beforetoggle`,e),Q(`toggle`,e),Jt(e,`popover`,r);break;case`xlinkActuate`:Xt(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:Xt(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:Xt(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:Xt(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:Xt(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:Xt(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:Xt(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:Xt(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:Xt(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:Jt(e,`is`,r);break;case`innerText`:case`textContent`:return;default:if(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)n=gn.get(n)||n,Jt(e,n,r);else return}R=!0}function tp(e,t,n,r,a,o){switch(n){case`style`:mn(e,r,o);return;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));o?.__html!==n&&(e.innerHTML=n)}}break;case`children`:if(typeof r==`string`)dn(e,r);else if(typeof r==`number`||typeof r==`bigint`)dn(e,``+r);else return;break;case`onScroll`:r!=null&&Q(`scroll`,e);return;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);return;case`onClick`:r!=null&&(e.onclick=yn);return;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:return;case`innerText`:case`textContent`:return;default:if(!Vt.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(a=n.endsWith(`Capture`),o=n.slice(2,a?n.length-7:void 0),t=e[Et]||null,t=t==null?null:t[n],typeof t==`function`&&e.removeEventListener(o,t,a),typeof r==`function`)){typeof t!=`function`&&t!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(o,r,a);break a}R=!0,n in e?e[n]=r:!0===r?e.setAttribute(n,``):Jt(e,n,r)}return}R=!0}function np(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:Q(`error`,e),Q(`load`,e);var r=!1,a=!1,o;for(o in n)if(n.hasOwnProperty(o)){var s=n[o];if(s!=null)switch(o){case`src`:r=!0;break;case`srcSet`:a=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,o,s,n,null)}}a&&$(e,t,`srcSet`,n.srcSet,n,null),r&&$(e,t,`src`,n.src,n,null);return;case`input`:Q(`invalid`,e);var c=o=s=a=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:a=d;break;case`type`:s=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:o=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(i(137,t));break;default:$(e,t,r,d,n,null)}}on(e,o,c,l,u,s,a,!1);return;case`select`:for(a in Q(`invalid`,e),r=s=o=null,n)if(n.hasOwnProperty(a)&&(c=n[a],c!=null))switch(a){case`value`:o=c;break;case`defaultValue`:s=c;break;case`multiple`:r=c;default:$(e,t,a,c,n,null)}t=o,n=s,e.multiple=!!r,t==null?n!=null&&cn(e,!!r,n,!0):cn(e,!!r,t,!1);return;case`textarea`:for(s in Q(`invalid`,e),o=a=r=null,n)if(n.hasOwnProperty(s)&&(c=n[s],c!=null))switch(s){case`value`:r=c;break;case`defaultValue`:a=c;break;case`children`:o=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(i(91));break;default:$(e,t,s,c,n,null)}un(e,r,a,o);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:$(e,t,l,r,n,null)}return;case`dialog`:Q(`beforetoggle`,e),Q(`toggle`,e),Q(`cancel`,e),Q(`close`,e);break;case`iframe`:case`object`:Q(`load`,e);break;case`video`:case`audio`:for(r=0;r<zf.length;r++)Q(zf[r],e);break;case`image`:Q(`error`,e),Q(`load`,e);break;case`details`:Q(`toggle`,e);break;case`embed`:case`source`:case`link`:Q(`error`,e),Q(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,u,r,n,null)}return;default:if(hn(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&tp(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&$(e,t,c,r,n,null))}var rp={};function ip(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var a=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||$(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:m!==f&&(R=!0),o=m;break;case`name`:m!==f&&(R=!0),a=m;break;case`checked`:m!==f&&(R=!0),u=m;break;case`defaultChecked`:m!==f&&(R=!0),d=m;break;case`value`:m!==f&&(R=!0),s=m;break;case`defaultValue`:m!==f&&(R=!0),c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(i(137,t));break;default:m!==f&&$(e,t,p,m,r,f)}}an(e,s,c,l,u,d,o,a);return;case`select`:for(o in m=s=c=p=null,n)if(l=n[o],n.hasOwnProperty(o)&&l!=null)switch(o){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(o)||$(e,t,o,null,r,l)}for(a in r)if(o=r[a],l=n[a],r.hasOwnProperty(a)&&(o!=null||l!=null))switch(a){case`value`:o!==l&&(R=!0),p=o;break;case`defaultValue`:o!==l&&(R=!0),c=o;break;case`multiple`:o!==l&&(R=!0),s=o;default:o!==l&&$(e,t,a,o,r,l)}t=c,n=s,r=m,p==null?!!r!=!!n&&(t==null?cn(e,!!n,n?[]:``,!1):cn(e,!!n,t,!0)):cn(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(a=n[c],n.hasOwnProperty(c)&&a!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:$(e,t,c,null,r,a)}for(s in r)if(a=r[s],o=n[s],r.hasOwnProperty(s)&&(a!=null||o!=null))switch(s){case`value`:a!==o&&(R=!0),p=a;break;case`defaultValue`:a!==o&&(R=!0),m=a;break;case`children`:break;case`dangerouslySetInnerHTML`:if(a!=null)throw Error(i(91));break;default:a!==o&&$(e,t,s,a,r,o)}ln(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:$(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:p!==m&&(R=!0),e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:$(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&$(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(i(137,t));break;default:$(e,t,u,p,r,m)}return;default:if(hn(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&tp(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||tp(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&$(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||$(e,t,f,p,r,m)}function ap(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function op(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&ap(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&ap(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var sp=null,cp=null;function lp(e){return e.nodeType===9?e:e.ownerDocument}function up(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function dp(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function fp(e,t,n,r){return n=lp(n).createElement(e),n[Tt]=r,n[Et]=t,np(n,e,t),zt(n),n}function pp(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var mp=null;function hp(){var e=window.event;return e&&e.type===`popstate`?e!==mp&&(mp=e,!0):(mp=null,!1)}var gp=typeof setTimeout==`function`?setTimeout:void 0,_p=typeof clearTimeout==`function`?clearTimeout:void 0,vp=typeof Promise==`function`?Promise:void 0,yp=typeof requestAnimationFrame==`function`?requestAnimationFrame:gp,bp=typeof queueMicrotask==`function`?queueMicrotask:vp===void 0?gp:function(e){return vp.resolve(null).then(e).catch(xp)};function xp(e){setTimeout(function(){throw e})}function Sp(e){return e===`head`}function Cp(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8){if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Hh(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)_m(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,_m(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[Mt]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&_m(e.ownerDocument.body)}n=i}while(n);Hh(t)}function wp(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8){if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++}n=r}while(n)}function Tp(e,t,n){if(t=CSS.escape(t)===t?t:`r-`+btoa(t).replace(/=/g,``),e.style.viewTransitionName=t,n!=null&&(e.style.viewTransitionClass=n),n=getComputedStyle(e),n.display===`inline`){if(t=e.getClientRects(),t.length===1)var r=1;else for(var i=r=0;i<t.length;i++){var a=t[i];0<a.width&&0<a.height&&r++}r===1&&(e=e.style,e.display=t.length===1?`inline-block`:`block`,e.marginTop=`-`+n.paddingTop,e.marginBottom=`-`+n.paddingBottom)}}function Ep(e,t){e=e.style,t=t.style;var n=t==null?null:t.hasOwnProperty(`viewTransitionName`)?t.viewTransitionName:t.hasOwnProperty(`view-transition-name`)?t[`view-transition-name`]:null;e.viewTransitionName=n==null||typeof n==`boolean`?``:(``+n).trim(),n=t==null?null:t.hasOwnProperty(`viewTransitionClass`)?t.viewTransitionClass:t.hasOwnProperty(`view-transition-class`)?t[`view-transition-class`]:null,e.viewTransitionClass=n==null||typeof n==`boolean`?``:(``+n).trim(),e.display===`inline-block`&&(t==null?e.display=e.margin=``:(n=t.display,e.display=n==null||typeof n==`boolean`?``:n,n=t.margin,n==null?(n=t.hasOwnProperty(`marginTop`)?t.marginTop:t[`margin-top`],e.marginTop=n==null||typeof n==`boolean`?``:n,t=t.hasOwnProperty(`marginBottom`)?t.marginBottom:t[`margin-bottom`],e.marginBottom=t==null||typeof t==`boolean`?``:t):e.margin=n))}function Dp(e,t,n){return n=n.ownerDocument.defaultView,{rect:e,abs:t.position===`absolute`||t.position===`fixed`,clip:t.clipPath!==`none`||t.overflow!==`visible`||t.filter!==`none`||t.mask!==`none`||t.mask!==`none`||t.borderRadius!==`0px`,view:0<=e.bottom&&0<=e.right&&e.top<=n.innerHeight&&e.left<=n.innerWidth}}function Op(e){return Dp(e.getBoundingClientRect(),getComputedStyle(e),e)}function kp(e){var t=e.getBoundingClientRect();t=new DOMRect(t.x+2e4,t.y+2e4,t.width,t.height);var n=getComputedStyle(e);return Dp(t,n,e)}function Ap(e){return e.documentElement.clientHeight}function jp(e){this.addEventListener(`load`,e),this.addEventListener(`error`,e)}function Mp(e,t,n,r,i,a,o,s,c){var l=t.nodeType===9?t:t.ownerDocument;try{var u=l.startViewTransition({update:function(){var t=l.defaultView,n=t.navigation&&t.navigation.transition,o=l.fonts.status;r();var s=[];if(o===`loaded`&&(Ap(l),l.fonts.status===`loading`&&s.push(l.fonts.ready)),o=s.length,e!==null)for(var c=e.suspenseyImages,u=0,d=0;d<c.length;d++){var f=c[d];if(!f.complete){var p=f.getBoundingClientRect();if(0<p.bottom&&0<p.right&&p.top<t.innerHeight&&p.left<t.innerWidth){if(u+=Xm(f),u>$m){s.length=o;break}f=new Promise(jp.bind(f)),s.push(f)}}}if(0<s.length)return t=Promise.race([Promise.all(s),new Promise(function(e){return setTimeout(e,500)})]).then(i,i),(n?Promise.allSettled([n.finished,t]):t).then(a,a);if(i(),n)return n.finished.then(a,a);a()},types:n});l.__reactViewTransition=u;var d=[];return u.ready.then(function(){for(var e=l.documentElement.getAnimations({subtree:!0}),t=0;t<e.length;t++){var n=e[t],r=n.effect,i=r.pseudoElement;if(i!=null&&i.startsWith(`::view-transition`)){d.push(n),n=r.getKeyframes();for(var a=i=void 0,s=!0,c=0;c<n.length;c++){var u=n[c],f=u.width;if(i===void 0)i=f;else if(i!==f){s=!1;break}if(f=u.height,a===void 0)a=f;else if(a!==f){s=!1;break}delete u.width,delete u.height,u.transform===`none`&&delete u.transform}s&&i!==void 0&&a!==void 0&&(r.setKeyframes(n),s=getComputedStyle(r.target,r.pseudoElement),s.width!==i||s.height!==a)&&(s=n[0],s.width=i,s.height=a,s=n[n.length-1],s.width=i,s.height=a,r.setKeyframes(n))}}o()},function(e){l.__reactViewTransition===u&&(l.__reactViewTransition=null);try{if(typeof e==`object`&&e)switch(e.name){case`InvalidStateError`:(e.message===`View transition was skipped because document visibility state is hidden.`||e.message===`Skipping view transition because document visibility state has become hidden.`||e.message===`Skipping view transition because viewport size changed.`||e.message===`Transition was aborted because of invalid state`)&&(e=null)}e!==null&&c(e)}finally{r(),i(),o()}}),u.finished.finally(function(){for(var e=0;e<d.length;e++)d[e].cancel();l.__reactViewTransition===u&&(l.__reactViewTransition=null),s()}),u}catch{return r(),i(),o(),null}}function Np(e,t){this._scope=document.documentElement,this._selector=`::view-transition-`+e+`(`+t+`)`}Np.prototype.animate=function(e,t){return t=typeof t==`number`?{duration:t}:E({},t),t.pseudoElement=this._selector,this._scope.animate(e,t)},Np.prototype.getAnimations=function(){for(var e=this._scope,t=this._selector,n=e.getAnimations({subtree:!0}),r=[],i=0;i<n.length;i++){var a=n[i].effect;a!==null&&a.target===e&&a.pseudoElement===t&&r.push(n[i])}return r},Np.prototype.getComputedStyle=function(){return getComputedStyle(this._scope,this._selector)};function Pp(e){return{name:e,group:new Np(`group`,e),imagePair:new Np(`image-pair`,e),old:new Np(`old`,e),new:new Np(`new`,e)}}function Fp(e){this._fragmentFiber=e,this._observers=this._eventListeners=null}Fp.prototype.addEventListener=function(e,t,n){var r=null,i=null;if(!(n!=null&&typeof n!=`boolean`&&(r=n.signal||null,r!==null&&r.aborted))){this._eventListeners===null&&(this._eventListeners=[]);var a=this._eventListeners;if(Bp(a,e,t,n)===-1){var o=this,s=t;n!=null&&typeof n!=`boolean`&&!0===n.once&&(s=function(r){o.removeEventListener(e,t,n),typeof t==`function`?t.call(this,r):t.handleEvent(r)}),r!==null&&(i=o.removeEventListener.bind(o,e,t,n),r.addEventListener(`abort`,i,{once:!0}),i=r.removeEventListener.bind(r,`abort`,i)),r=Rp(n),a.push({type:e,listener:t,optionsOrUseCapture:n,attachedListener:s,cleanup:i}),m(this._fragmentFiber.child,!1,Ip,e,s,r)}this._eventListeners=a}};function Ip(e,t,n,r){return b(e).addEventListener(t,n,r),!1}Fp.prototype.removeEventListener=function(e,t,n){var r=this._eventListeners;if(r!==null&&(t=Bp(r,e,t,n),t!==-1)){var i=r[t];n=i.attachedListener;var a=i.cleanup;i=Rp(i.optionsOrUseCapture),m(this._fragmentFiber.child,!1,Lp,e,n,i),r.splice(t,1),a!==null&&a()}};function Lp(e,t,n,r){return b(e).removeEventListener(t,n,r),!1}function Rp(e){return e!=null&&typeof e!=`boolean`&&(!0===e.once||e.signal instanceof AbortSignal)?{capture:e.capture,passive:e.passive}:e}function zp(e){return e==null?`c=0`:typeof e==`boolean`?`c=`+(e?`1`:`0`):`c=`+(e.capture?`1`:`0`)}function Bp(e,t,n,r){if(e.length===0)return-1;r=zp(r);for(var i=0;i<e.length;i++){var a=e[i];if(a.type===t&&a.listener===n&&zp(a.optionsOrUseCapture)===r)return i}return-1}Fp.prototype.dispatchEvent=function(e){var t=g(this._fragmentFiber);if(t===null)return!0;t=b(t);var n=this._eventListeners;if(n!==null&&0<n.length||!e.bubbles){var r=t.nodeType===9?t.createComment(``):document.createTextNode(``);if(n)for(var i=0;i<n.length;i++){var a=n[i];r.addEventListener(a.type,a.attachedListener,Rp(a.optionsOrUseCapture))}if(t.appendChild(r),e=r.dispatchEvent(e),n)for(i=0;i<n.length;i++)a=n[i],r.removeEventListener(a.type,a.attachedListener,Rp(a.optionsOrUseCapture));return t.removeChild(r),e}return t.dispatchEvent(e)},Fp.prototype.focus=function(e){m(this._fragmentFiber.child,!0,Vp,e,void 0,void 0)};function Vp(e,t){return e.tag!==6&&(e=b(e),pm(e,t))}Fp.prototype.focusLast=function(e){var t=[];m(this._fragmentFiber.child,!0,Hp,t,void 0,void 0);for(var n=t.length-1;0<=n&&!Vp(t[n],e);n--);};function Hp(e,t){return t.push(e),!1}Fp.prototype.blur=function(){var e=g(this._fragmentFiber);e!==null&&(e=b(e),e=lp(e).activeElement,e!==null&&m(this._fragmentFiber.child,!1,Up,e,void 0,void 0))};function Up(e,t){return e.tag!==6&&(e=b(e),e===t||e.contains(t)?(t.blur(),!0):!1)}Fp.prototype.observeUsing=function(e){this._observers===null&&(this._observers=new Set),this._observers.add(e),m(this._fragmentFiber.child,!1,Wp,e,void 0,void 0)};function Wp(e,t){return e.tag!==6&&(e=b(e),t.observe(e),!1)}Fp.prototype.unobserveUsing=function(e){var t=this._observers;if(t!==null&&t.has(e)){t.delete(e),m(this._fragmentFiber.child,!1,Gp,e,void 0,void 0);for(var n=t=0;n<Kp.length;n++){var r=Kp[n];r.fragmentInstance===this&&r.observer===e?e.unobserve(r.instance):Kp[t++]=r}Kp.length=t}};function Gp(e,t){return e.tag!==6&&(e=b(e),t.unobserve(e),!1)}var Kp=[],qp=!1;function Jp(e,t,n){Kp.push({fragmentInstance:e,observer:t,instance:n}),qp||(qp=!0,mm(function(){qp=!1;var e=Kp;Kp=[];for(var t=0;t<e.length;t++){var n=e[t];n.observer.unobserve(n.instance)}}))}Fp.prototype.getClientRects=function(){var e=[];return m(this._fragmentFiber.child,!1,Yp,e,void 0,void 0),e};function Yp(e,t){if(e.tag===6){e=e.stateNode;var n=e.ownerDocument.createRange();n.selectNodeContents(e),t.push.apply(t,n.getClientRects())}else e=b(e),t.push.apply(t,e.getClientRects());return!1}Fp.prototype.getRootNode=function(e){var t=g(this._fragmentFiber);return t===null?this:b(t).getRootNode(e)},Fp.prototype.compareDocumentPosition=function(e){var t=g(this._fragmentFiber);if(t===null)return Node.DOCUMENT_POSITION_DISCONNECTED;var n=[];m(this._fragmentFiber.child,!1,Hp,n,void 0,void 0);var r=b(t);if(n.length===0){if(n=r,_(this._fragmentFiber)){a:{for(t=this._fragmentFiber.return;t!==null;){if(t.tag===4){t=t.stateNode.containerInfo;break a}if(t.tag===3||t.tag===5||t.tag===27)break;t=t.return}t=null}t!=null&&(n=t)}t=this._fragmentFiber;var i=r=n.compareDocumentPosition(e);return n===e?i=Node.DOCUMENT_POSITION_CONTAINS:r&Node.DOCUMENT_POSITION_CONTAINED_BY&&(n=v(t)[1],n===null?i=Node.DOCUMENT_POSITION_PRECEDING:(e=b(n).compareDocumentPosition(e),i=e===0||e&Node.DOCUMENT_POSITION_FOLLOWING?Node.DOCUMENT_POSITION_FOLLOWING:Node.DOCUMENT_POSITION_PRECEDING)),i|=Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC}t=b(n[0]),i=b(n[n.length-1]);var a=_(this._fragmentFiber)?t.parentElement:r;if(a==null)return Node.DOCUMENT_POSITION_DISCONNECTED;r=a.compareDocumentPosition(t)&Node.DOCUMENT_POSITION_CONTAINED_BY,a=a.compareDocumentPosition(i)&Node.DOCUMENT_POSITION_CONTAINED_BY;var o=t.compareDocumentPosition(e),s=i.compareDocumentPosition(e),c=o&Node.DOCUMENT_POSITION_CONTAINED_BY||s&Node.DOCUMENT_POSITION_CONTAINED_BY;return s=r&&a&&o&Node.DOCUMENT_POSITION_FOLLOWING&&s&Node.DOCUMENT_POSITION_PRECEDING,t=r&&t===e||a&&i===e||c||s?Node.DOCUMENT_POSITION_CONTAINED_BY:!r&&t===e||!a&&i===e?Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC:o,t&Node.DOCUMENT_POSITION_DISCONNECTED||t&Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC||Xp(t,this._fragmentFiber,n[0],n[n.length-1],e)?t:Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC};function Xp(e,t,n,r,i){var a=Ft(i);if(e&Node.DOCUMENT_POSITION_CONTAINED_BY){if(n=!!a)a:{for(;a!==null;){if(a.tag===7&&(a===t||a.alternate===t)){n=!0;break a}a=a.return}n=!1}return n}if(e&Node.DOCUMENT_POSITION_CONTAINS){if(a===null)return a=i.ownerDocument,i===a||i===a.documentElement||i===a.body;a:{for(a=t,t=g(t);a!==null;){if(!(a.tag!==5&&a.tag!==3&&a.tag!==27||a!==t&&a.alternate!==t)){a=!0;break a}a=a.return}a=!1}return a}return e&Node.DOCUMENT_POSITION_PRECEDING?((t=!!a)&&!(t=a===n)&&(t=T(n,a,w),t===null?t=!1:(m(t,!0,C,a,n),a=x,x=null,t=a!==null)),t):e&Node.DOCUMENT_POSITION_FOLLOWING?((t=!!a)&&!(t=a===r)&&(t=T(r,a,w),t===null?t=!1:(m(t,!0,ee,a,r),a=x,S=x=null,t=a!==null)),t):!1}function Zp(e,t){var n=e.ownerDocument.createRange();n.selectNodeContents(e),e=n.getBoundingClientRect(),window.scrollTo(window.scrollX+e.left,t?window.scrollY+e.top:window.scrollY+e.bottom-window.innerHeight)}Fp.prototype.scrollIntoView=function(e){if(typeof e==`object`)throw Error(i(566));var t=[];m(this._fragmentFiber.child,!1,Hp,t,void 0,void 0);var n=!1!==e;if(t.length===0){var r=v(this._fragmentFiber);if(r=n?r[1]||r[0]||g(this._fragmentFiber):r[0]||r[1],r===null)return;if(r.tag===6){e=b(r),Zp(e,n);return}if(r=b(r),r.nodeType!==9){if(r.nodeType===11){n=`host`in r?r.host:null,n!==null&&n.scrollIntoView(e);return}r.scrollIntoView(e)}}for(r=n?t.length-1:0;r!==(n?-1:t.length);){var a=t[r];a.tag===6?(a=b(a),Zp(a,n)):b(a).scrollIntoView(e),r+=n?-1:1}};function Qp(e,t){return e=b(e),$p(e,t),!1}function $p(e,t){e.reactFragments??=new Set,e.reactFragments.add(t)}function em(e,t){var n=t._eventListeners;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];e.addEventListener(i.type,i.attachedListener,Rp(i.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(n){for(var r=0,i=0;i<Kp.length;i++){var a=Kp[i];(a.fragmentInstance!==t||a.observer!==n||a.instance!==e)&&(Kp[r++]=a)}Kp.length=r,n.observe(e)}),$p(e,t))}function tm(e,t){var n=t._eventListeners;if(n!==null)for(var r=0;r<n.length;r++){var i=n[r];e.removeEventListener(i.type,i.attachedListener,Rp(i.optionsOrUseCapture))}e.nodeType!==3&&(n=t._observers,n!==null&&n.forEach(function(n){typeof n.rootMargin==`string`?Jp(t,n,e):n.unobserve(e)}),e.reactFragments!=null&&e.reactFragments.delete(t))}function nm(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:nm(n),Pt(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function rm(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r){if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e}else if(!e[Mt])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=lm(e.nextSibling),e===null)break}return null}function im(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=lm(e.nextSibling),e===null))return null;return e}function am(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=lm(e.nextSibling),e===null))return null;return e}function om(e){return e.data===`$?`||e.data===`$~`}function sm(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function cm(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function lm(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var um=null;function dm(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return lm(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function fm(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function pm(e,t){function n(){r=!0}if(e.ownerDocument.activeElement===e)return!0;var r=!1;try{e.ownerDocument.addEventListener(`focus`,n,!0),(e.focus||HTMLElement.prototype.focus).call(e,t)}finally{e.ownerDocument.removeEventListener(`focus`,n,!0)}return r}function mm(e){yp(function(){yp(function(t){return e(t)})})}function hm(e,t,n){switch(t=lp(n),e){case`html`:if(e=t.documentElement,!e)throw Error(i(452));return e;case`head`:if(e=t.head,!e)throw Error(i(453));return e;case`body`:if(e=t.body,!e)throw Error(i(454));return e;default:throw Error(i(451))}}function gm(e,t,n){for(var r in n){var i=n[r];n.hasOwnProperty(r)&&i!=null&&$(e,t,r,null,rp,i)}n.dangerouslySetInnerHTML!=null&&(e.textContent=``),e.onclick===yn&&(e.onclick=null),Pt(e)}function _m(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);Pt(e)}var vm=new Map,ym=new Set;function bm(e){if(typeof e.getRootNode==`function`){var t=e.getRootNode();if(t.nodeType===9||t.nodeType===11)return t}return e.nodeType===9?e:e.ownerDocument}var xm=P.d;P.d={f:Sm,r:Cm,D:Em,C:Dm,L:Om,m:km,X:jm,S:Am,M:Mm};function Sm(){var e=xm.f(),t=zd();return e||t}function Cm(e){var t=It(e);t!==null&&t.tag===5&&t.type===`form`?nc(t):xm.r(e)}var wm=typeof document>`u`?null:document;function Tm(e,t,n){var r=wm;if(r&&typeof t==`string`&&t){var i=rn(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),ym.has(i)||(ym.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),np(t,`link`,e),zt(t),r.head.appendChild(t)))}}function Em(e){xm.D(e),Tm(`dns-prefetch`,e,null)}function Dm(e,t){xm.C(e,t),Tm(`preconnect`,e,t)}function Om(e,t,n){xm.L(e,t,n);var r=wm;if(r&&e&&t){var i=`link[rel="preload"][as="`+rn(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+rn(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+rn(n.imageSizes)+`"]`)):i+=`[href="`+rn(e)+`"]`;var a=i;switch(t){case`style`:a=Pm(e);break;case`script`:a=Rm(e)}if(!(vm.has(a)||(e=E({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),vm.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(Fm(a))||t===`script`&&r.querySelector(zm(a))))){var o=r.createElement(`link`);np(o,`link`,e),t===`style`&&(o[Nt]=!0,o.onload=o.onerror=function(){Bt(o)}),zt(o),r.head.appendChild(o)}}}function km(e,t){xm.m(e,t);var n=wm;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+rn(r)+`"][href="`+rn(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Rm(e)}if(!vm.has(a)&&(e=E({rel:`modulepreload`,href:e},t),vm.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(zm(a)))return}r=n.createElement(`link`),np(r,`link`,e),zt(r),n.head.appendChild(r)}}}function Am(e,t,n){xm.S(e,t,n);var r=wm;if(r&&e){var i=Rt(r).hoistableStyles,a=Pm(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(Fm(a)))s.loading=5;else{e=E({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=vm.get(a))&&Hm(e,n);var c=o=r.createElement(`link`);zt(c),np(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Vm(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function jm(e,t){xm.X(e,t);var n=wm;if(n&&e){var r=Rt(n).hoistableScripts,i=Rm(e),a=r.get(i);a||(a=n.querySelector(zm(i)),a||(e=E({src:e,async:!0},t),(t=vm.get(i))&&Um(e,t),a=n.createElement(`script`),zt(a),np(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Mm(e,t){xm.M(e,t);var n=wm;if(n&&e){var r=Rt(n).hoistableScripts,i=Rm(e),a=r.get(i);a||(a=n.querySelector(zm(i)),a||(e=E({src:e,async:!0,type:`module`},t),(t=vm.get(i))&&Um(e,t),a=n.createElement(`script`),zt(a),np(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Nm(e,t,n,r){var a=(a=Te.current)?bm(a):null;if(!a)throw Error(i(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(n=Pm(n.href),t=Rt(a).hoistableStyles,r=t.get(n),r||(r={type:`style`,instance:null,count:0,state:null},t.set(n,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Pm(n.href);var o=Rt(a).hoistableStyles,s=o.get(e);if(s||(a=a.ownerDocument||a,s={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},o.set(e,s),(o=a.querySelector(Fm(e)))?o._p||(s.instance=o,s.state.loading=5):(o=vm.get(e),o||(o={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},vm.set(e,o)),Lm(a,e,o,s.state))),t&&r===null)throw Error(i(528,``));return s}if(t&&r!==null)throw Error(i(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(n=Rm(n),t=Rt(a).hoistableScripts,r=t.get(n),r||(r={type:`script`,instance:null,count:0,state:null},t.set(n,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(i(444,e))}}function Pm(e){return`href="`+rn(e)+`"`}function Fm(e){return`link[rel="stylesheet"][`+e+`]`}function Im(e){return E({},e,{"data-precedence":e.precedence,precedence:null})}function Lm(e,t,n,r){if(t=e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)){if(!0!==t[Nt]){r.loading=1;return}}else t=e.createElement(`link`),t[Nt]=!0,t.onload=t.onerror=Bt.bind(null,t),np(t,`link`,n),zt(t),e.head.appendChild(t);r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2})}function Rm(e){return`[src="`+rn(e)+`"]`}function zm(e){return`script[async]`+e}function Bm(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+rn(n.href)+`"]`);if(r)return t.instance=r,zt(r),r;var a=E({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),zt(r),np(r,`style`,a),Vm(r,n.precedence,e),t.instance=r;case`stylesheet`:a=Pm(n.href);var o=e.querySelector(Fm(a));if(o)return t.state.loading|=4,t.instance=o,zt(o),o;r=Im(n),(a=vm.get(a))&&Hm(r,a),o=(e.ownerDocument||e).createElement(`link`),zt(o);var s=o;return s._p=new Promise(function(e,t){s.onload=e,s.onerror=t}),np(o,`link`,r),t.state.loading|=4,Vm(o,n.precedence,e),t.instance=o;case`script`:return o=Rm(n.src),(a=e.querySelector(zm(o)))?(t.instance=a,zt(a),a):(r=n,(a=vm.get(o))&&(r=E({},n),Um(r,a)),e=e.ownerDocument||e,a=e.createElement(`script`),zt(a),np(a,`link`,r),e.head.appendChild(a),t.instance=a);case`void`:return null;default:throw Error(i(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Vm(r,n.precedence,e));return t.instance}function Vm(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Hm(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function Um(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Wm=null;function Gm(e,t,n){if(Wm===null){var r=new Map,i=Wm=new Map;i.set(n,r)}else i=Wm,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[Mt]||a[Tt]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Km(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function qm(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Jm(e,t){return e===`img`&&t.src!=null&&t.src!==``&&t.onLoad==null&&t.loading!==`lazy`}function Ym(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Xm(e){return(e.width||100)*(e.height||100)*(typeof devicePixelRatio==`number`?devicePixelRatio:1)*.25}function Zm(e,t){typeof t.decode==`function`&&(e.imgCount++,t.complete||(e.imgBytes+=Xm(t),e.suspenseyImages.push(t)),e=rh.bind(e),t.decode().then(e,e))}function Qm(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Pm(r.href),a=t.querySelector(Fm(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=nh.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,zt(a);return}a=t.ownerDocument||t,r=Im(r),(i=vm.get(i))&&Hm(r,i),a=a.createElement(`link`),zt(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),np(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=nh.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var $m=0;function eh(e,t){return e.stylesheets&&e.count===0&&ah(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&ah(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&$m===0&&($m=62500*op());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&ah(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>$m?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function th(e){if(e.count===0&&(e.imgCount===0||!e.waitingForImages)){if(e.stylesheets)ah(e,e.stylesheets);else if(e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}}}function nh(){this.count--,th(this)}function rh(){this.imgCount--,th(this)}var ih=null;function ah(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,ih=new Map,t.forEach(oh,e),ih=null,nh.call(e))}function oh(e,t){if(!(t.state.loading&4)){var n=ih.get(e);if(n)var r=n.get(null);else{n=new Map,ih.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=nh.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var sh={$$typeof:A,Provider:null,Consumer:null,_currentValue:ve,_currentValue2:ve,_threadCount:0};function ch(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=mt(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=mt(0),this.hiddenUpdates=mt(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.transitionTypes=null,this.incompleteTransitions=new Map}function lh(e,t,n,r,i,a,o,s,c,l,u,d){return e=new ch(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=Ni(3,null,null,t),e.current=a,a.stateNode=e,t=Ma(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},ho(a),e}function uh(e){return e?(e=ji,e):ji}function dh(e,t,n,r,i,a){i=uh(i),r.context===null?r.context=i:r.pendingContext=i,r=_o(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=vo(e,r,t),n!==null&&(Pd(n,e,t),V(n,e,t))}function fh(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ph(e,t){fh(e,t),(e=e.alternate)&&fh(e,t)}function mh(e){if(e.tag===13||e.tag===31){var t=Oi(e,67108864);t!==null&&Pd(t,e,67108864),ph(e,67108864)}}function hh(e){if(e.tag===13||e.tag===31){var t=jd();t=bt(t);var n=Oi(e,t);n!==null&&Pd(n,e,t),ph(e,t)}}var gh=!0;function _h(e,t,n,r){var i=N.T;N.T=null;var a=P.p;try{P.p=2,yh(e,t,n,r)}finally{P.p=a,N.T=i}}function vh(e,t,n,r){var i=N.T;N.T=null;var a=P.p;try{P.p=8,yh(e,t,n,r)}finally{P.p=a,N.T=i}}function yh(e,t,n,r){if(gh){var i=bh(r);if(i===null)Kf(e,t,r,xh,n),Mh(e,r);else if(Ph(i,e,t,n,r))r.stopPropagation();else if(Mh(e,r),t&4&&-1<jh.indexOf(e)){for(;i!==null;){var a=It(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=ct(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-tt(o);s.entanglements[1]|=c,o&=~c}Ef(a),!(K&6)&&(gd=Ue()+500,Df(0,!1))}}break;case 31:case 13:s=Oi(a,2),s!==null&&Pd(s,a,2),zd(),ph(a,2)}if(a=bh(r),a===null&&Kf(e,t,r,xh,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else Kf(e,t,r,null,n)}}function bh(e){return e=xn(e),Sh(e)}var xh=null;function Sh(e){if(xh=null,e=Ft(e),e!==null){var t=o(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=s(t),e!==null)return e;e=null}else if(n===31){if(e=c(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return xh=e,null}function Ch(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`fullscreenerror`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`resize`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(We()){case Ge:return 2;case Ke:return 8;case qe:case Je:return 32;case Ye:return 268435456;default:return 32}default:return 32}}var wh=!1,Th=null,Eh=null,Dh=null,Oh=new Map,kh=new Map,Ah=[],jh=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Mh(e,t){switch(e){case`focusin`:case`focusout`:Th=null;break;case`dragenter`:case`dragleave`:Eh=null;break;case`mouseover`:case`mouseout`:Dh=null;break;case`pointerover`:case`pointerout`:Oh.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:kh.delete(t.pointerId)}}function Nh(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=It(t),t!==null&&mh(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Ph(e,t,n,r,i){switch(t){case`focusin`:return Th=Nh(Th,e,t,n,r,i),!0;case`dragenter`:return Eh=Nh(Eh,e,t,n,r,i),!0;case`mouseover`:return Dh=Nh(Dh,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return Oh.set(a,Nh(Oh.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,kh.set(a,Nh(kh.get(a)||null,e,t,n,r,i)),!0}return!1}function Fh(e){var t=Ft(e.target);if(t!==null){var n=o(t);if(n!==null){if(t=n.tag,t===13){if(t=s(n),t!==null){e.blockedOn=t,Ct(e.priority,function(){hh(n)});return}}else if(t===31){if(t=c(n),t!==null){e.blockedOn=t,Ct(e.priority,function(){hh(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ih(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=bh(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);bn=r,n.target.dispatchEvent(r),bn=null}else return t=It(n),t!==null&&mh(t),e.blockedOn=n,!1;t.shift()}return!0}function Lh(e,t,n){Ih(e)&&n.delete(t)}function Rh(){wh=!1,Th!==null&&Ih(Th)&&(Th=null),Eh!==null&&Ih(Eh)&&(Eh=null),Dh!==null&&Ih(Dh)&&(Dh=null),Oh.forEach(Lh),kh.forEach(Lh)}function zh(e,n){e.blockedOn===n&&(e.blockedOn=null,wh||(wh=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,Rh)))}var Bh=null;function Vh(e){Bh!==e&&(Bh=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){Bh===e&&(Bh=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(Sh(r||n)===null)continue;break}var a=It(n);a!==null&&(e.splice(t,3),t-=3,ec(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Hh(e){function t(t){return zh(t,e)}Th!==null&&zh(Th,e),Eh!==null&&zh(Eh,e),Dh!==null&&zh(Dh,e),Oh.forEach(t),kh.forEach(t);for(var n=0;n<Ah.length;n++){var r=Ah[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<Ah.length&&(n=Ah[0],n.blockedOn===null);)Fh(n),n.blockedOn===null&&Ah.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[Et]||null;if(typeof a==`function`)o||Vh(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[Et]||null)s=o.formAction;else if(Sh(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Vh(n)}}}function Uh(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Wh(e){this._internalRoot=e}Gh.prototype.render=Wh.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));var n=t.current;dh(n,jd(),e,t,null,null)},Gh.prototype.unmount=Wh.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;dh(e.current,2,null,e,null,null),zd(),t[Dt]=null}};function Gh(e){this._internalRoot=e}Gh.prototype.unstable_scheduleHydration=function(e){if(e){var t=St();e={blockedOn:null,target:e,priority:t};for(var n=0;n<Ah.length&&t!==0&&t<Ah[n].priority;n++);Ah.splice(n,0,e),n===0&&Fh(e)}};var Kh=n.version;if(Kh!==`19.3.0`)throw Error(i(527,Kh,`19.3.0`));P.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(i(188)):(e=Object.keys(e).join(`,`),Error(i(268,e)));return e=u(t),e=e===null?null:f(e),e=e===null?null:e.stateNode,e};var qh={bundleType:0,version:`19.3.0`,rendererPackageName:`react-dom`,currentDispatcherRef:N,reconcilerVersion:`19.3.0`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var Jh=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Jh.isDisabled&&Jh.supportsFiber)try{Qe=Jh.inject(qh),$e=Jh}catch{}}e.createRoot=function(e,t){if(!a(e))throw Error(i(299));var n=!1,r=``,o=Cc,s=wc,c=Tc;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=lh(e,1,!1,null,null,n,r,null,o,s,c,Uh),e[Dt]=t.current,Wf(e),new Wh(t)}})),_=o(((e,t)=>{function n(){if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`&&typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE==`function`)try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=g()})),v=d(),y=_();function b(e,t){let n=t||{};return(e[e.length-1]===``?[...e,``]:e).join((n.padRight?` `:``)+`,`+(n.padLeft===!1?``:` `)).trim()}var x=/^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,S=/^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,C={};function ee(e,t){return((t||C).jsx?S:x).test(e)}var w=/[ \t\n\f\r]/g;function T(e){return typeof e==`object`?e.type===`text`&&E(e.value):E(e)}function E(e){return e.replace(w,``)===``}var D=class{constructor(e,t,n){this.normal=t,this.property=e,n&&(this.space=n)}};D.prototype.normal={},D.prototype.property={},D.prototype.space=void 0;function te(e,t){let n={},r={};for(let t of e)Object.assign(n,t.property),Object.assign(r,t.normal);return new D(n,r,t)}function ne(e){return e.toLowerCase()}var O=class{constructor(e,t){this.attribute=t,this.property=e}};O.prototype.attribute=``,O.prototype.booleanish=!1,O.prototype.boolean=!1,O.prototype.commaOrSpaceSeparated=!1,O.prototype.commaSeparated=!1,O.prototype.defined=!1,O.prototype.mustUseProperty=!1,O.prototype.number=!1,O.prototype.overloadedBoolean=!1,O.prototype.property=``,O.prototype.spaceSeparated=!1,O.prototype.space=void 0;var re=s({boolean:()=>k,booleanish:()=>A,commaOrSpaceSeparated:()=>se,commaSeparated:()=>oe,number:()=>j,overloadedBoolean:()=>ae,spaceSeparated:()=>M}),ie=0,k=ce(),A=ce(),ae=ce(),j=ce(),M=ce(),oe=ce(),se=ce();function ce(){return 2**++ie}var le=Object.keys(re),ue=class extends O{constructor(e,t,n,r){let i=-1;if(super(e,t),de(this,`space`,r),typeof n==`number`)for(;++i<le.length;){let e=le[i];de(this,le[i],(n&re[e])===re[e])}}};ue.prototype.defined=!0;function de(e,t,n){n&&(e[t]=n)}function fe(e){let t={},n={};for(let[r,i]of Object.entries(e.properties)){let a=new ue(r,e.transform(e.attributes||{},r),i,e.space);e.mustUseProperty&&e.mustUseProperty.includes(r)&&(a.mustUseProperty=!0),t[r]=a,n[ne(r)]=r,n[ne(a.attribute)]=r}return new D(t,n,e.space)}var pe=fe({properties:{ariaActiveDescendant:null,ariaAtomic:A,ariaAutoComplete:null,ariaBusy:A,ariaChecked:A,ariaColCount:j,ariaColIndex:j,ariaColSpan:j,ariaControls:M,ariaCurrent:null,ariaDescribedBy:M,ariaDetails:null,ariaDisabled:A,ariaDropEffect:M,ariaErrorMessage:null,ariaExpanded:A,ariaFlowTo:M,ariaGrabbed:A,ariaHasPopup:null,ariaHidden:A,ariaInvalid:null,ariaKeyShortcuts:null,ariaLabel:null,ariaLabelledBy:M,ariaLevel:j,ariaLive:null,ariaModal:A,ariaMultiLine:A,ariaMultiSelectable:A,ariaOrientation:null,ariaOwns:M,ariaPlaceholder:null,ariaPosInSet:j,ariaPressed:A,ariaReadOnly:A,ariaRelevant:null,ariaRequired:A,ariaRoleDescription:M,ariaRowCount:j,ariaRowIndex:j,ariaRowSpan:j,ariaSelected:A,ariaSetSize:j,ariaSort:null,ariaValueMax:j,ariaValueMin:j,ariaValueNow:j,ariaValueText:null,role:null},transform(e,t){return t===`role`?t:`aria-`+t.slice(4).toLowerCase()}});function me(e,t){return t in e?e[t]:t}function he(e,t){return me(e,t.toLowerCase())}var ge=fe({attributes:{acceptcharset:`accept-charset`,classname:`class`,htmlfor:`for`,httpequiv:`http-equiv`},mustUseProperty:[`checked`,`multiple`,`muted`,`selected`],properties:{abbr:null,accept:oe,acceptCharset:M,accessKey:M,action:null,allow:null,allowFullScreen:k,allowPaymentRequest:k,allowUserMedia:k,alpha:k,alt:null,as:null,async:k,autoCapitalize:null,autoComplete:M,autoFocus:k,autoPlay:k,blocking:M,capture:null,charSet:null,checked:k,cite:null,className:M,closedBy:null,colorSpace:null,cols:j,colSpan:j,command:null,commandFor:null,content:null,contentEditable:A,controls:k,controlsList:M,coords:j|oe,crossOrigin:null,data:null,dateTime:null,decoding:null,default:k,defer:k,dir:null,dirName:null,disabled:k,download:ae,draggable:A,encType:null,enterKeyHint:null,fetchPriority:null,form:null,formAction:null,formEncType:null,formMethod:null,formNoValidate:k,formTarget:null,headers:M,height:j,hidden:ae,high:j,href:null,hrefLang:null,htmlFor:M,httpEquiv:M,id:null,imageSizes:null,imageSrcSet:null,inert:k,inputMode:null,integrity:null,is:null,isMap:k,itemId:null,itemProp:M,itemRef:M,itemScope:k,itemType:M,kind:null,label:null,lang:null,language:null,list:null,loading:null,loop:k,low:j,manifest:null,max:null,maxLength:j,media:null,method:null,min:null,minLength:j,multiple:k,muted:k,name:null,nonce:null,noModule:k,noValidate:k,onAbort:null,onAfterPrint:null,onAuxClick:null,onBeforeMatch:null,onBeforePrint:null,onBeforeToggle:null,onBeforeUnload:null,onBlur:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onContextLost:null,onContextMenu:null,onContextRestored:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnded:null,onError:null,onFocus:null,onFormData:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLanguageChange:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadEnd:null,onLoadStart:null,onMessage:null,onMessageError:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRejectionHandled:null,onReset:null,onResize:null,onScroll:null,onScrollEnd:null,onSecurityPolicyViolation:null,onSeeked:null,onSeeking:null,onSelect:null,onSlotChange:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnhandledRejection:null,onUnload:null,onVolumeChange:null,onWaiting:null,onWheel:null,open:k,optimum:j,pattern:null,ping:M,placeholder:null,playsInline:k,popover:null,popoverTarget:null,popoverTargetAction:null,poster:null,preload:null,readOnly:k,referrerPolicy:null,rel:M,required:k,reversed:k,rows:j,rowSpan:j,sandbox:M,scope:null,scoped:k,seamless:k,selected:k,shadowRootClonable:k,shadowRootCustomElementRegistry:k,shadowRootDelegatesFocus:k,shadowRootMode:null,shadowRootSerializable:k,shape:null,size:j,sizes:null,slot:null,span:j,spellCheck:A,src:null,srcDoc:null,srcLang:null,srcSet:null,start:j,step:null,style:null,tabIndex:j,target:null,title:null,translate:null,type:null,typeMustMatch:k,useMap:null,value:A,width:j,wrap:null,writingSuggestions:null,align:null,aLink:null,archive:M,axis:null,background:null,bgColor:null,border:j,borderColor:null,bottomMargin:j,cellPadding:null,cellSpacing:null,char:null,charOff:null,classId:null,clear:null,code:null,codeBase:null,codeType:null,color:null,compact:k,declare:k,event:null,face:null,frame:null,frameBorder:null,hSpace:j,leftMargin:j,link:null,longDesc:null,lowSrc:null,marginHeight:j,marginWidth:j,noResize:k,noHref:k,noShade:k,noWrap:k,object:null,profile:null,prompt:null,rev:null,rightMargin:j,rules:null,scheme:null,scrolling:A,standby:null,summary:null,text:null,topMargin:j,valueType:null,version:null,vAlign:null,vLink:null,vSpace:j,allowTransparency:null,autoCorrect:null,autoSave:null,credentialless:k,disablePictureInPicture:k,disableRemotePlayback:k,exportParts:oe,part:M,prefix:null,property:null,results:j,security:null,unselectable:null},space:`html`,transform:he}),_e=fe({attributes:{accentHeight:`accent-height`,alignmentBaseline:`alignment-baseline`,arabicForm:`arabic-form`,baselineShift:`baseline-shift`,capHeight:`cap-height`,className:`class`,clipPath:`clip-path`,clipRule:`clip-rule`,colorInterpolation:`color-interpolation`,colorInterpolationFilters:`color-interpolation-filters`,colorProfile:`color-profile`,colorRendering:`color-rendering`,crossOrigin:`crossorigin`,dataType:`datatype`,dominantBaseline:`dominant-baseline`,enableBackground:`enable-background`,fillOpacity:`fill-opacity`,fillRule:`fill-rule`,floodColor:`flood-color`,floodOpacity:`flood-opacity`,fontFamily:`font-family`,fontSize:`font-size`,fontSizeAdjust:`font-size-adjust`,fontStretch:`font-stretch`,fontStyle:`font-style`,fontVariant:`font-variant`,fontWeight:`font-weight`,glyphName:`glyph-name`,glyphOrientationHorizontal:`glyph-orientation-horizontal`,glyphOrientationVertical:`glyph-orientation-vertical`,hrefLang:`hreflang`,horizAdvX:`horiz-adv-x`,horizOriginX:`horiz-origin-x`,horizOriginY:`horiz-origin-y`,imageRendering:`image-rendering`,letterSpacing:`letter-spacing`,lightingColor:`lighting-color`,markerEnd:`marker-end`,markerMid:`marker-mid`,markerStart:`marker-start`,maskType:`mask-type`,navDown:`nav-down`,navDownLeft:`nav-down-left`,navDownRight:`nav-down-right`,navLeft:`nav-left`,navNext:`nav-next`,navPrev:`nav-prev`,navRight:`nav-right`,navUp:`nav-up`,navUpLeft:`nav-up-left`,navUpRight:`nav-up-right`,onAbort:`onabort`,onActivate:`onactivate`,onAfterPrint:`onafterprint`,onBeforePrint:`onbeforeprint`,onBegin:`onbegin`,onCancel:`oncancel`,onCanPlay:`oncanplay`,onCanPlayThrough:`oncanplaythrough`,onChange:`onchange`,onClick:`onclick`,onClose:`onclose`,onCopy:`oncopy`,onCueChange:`oncuechange`,onCut:`oncut`,onDblClick:`ondblclick`,onDrag:`ondrag`,onDragEnd:`ondragend`,onDragEnter:`ondragenter`,onDragExit:`ondragexit`,onDragLeave:`ondragleave`,onDragOver:`ondragover`,onDragStart:`ondragstart`,onDrop:`ondrop`,onDurationChange:`ondurationchange`,onEmptied:`onemptied`,onEnd:`onend`,onEnded:`onended`,onError:`onerror`,onFocus:`onfocus`,onFocusIn:`onfocusin`,onFocusOut:`onfocusout`,onHashChange:`onhashchange`,onInput:`oninput`,onInvalid:`oninvalid`,onKeyDown:`onkeydown`,onKeyPress:`onkeypress`,onKeyUp:`onkeyup`,onLoad:`onload`,onLoadedData:`onloadeddata`,onLoadedMetadata:`onloadedmetadata`,onLoadStart:`onloadstart`,onMessage:`onmessage`,onMouseDown:`onmousedown`,onMouseEnter:`onmouseenter`,onMouseLeave:`onmouseleave`,onMouseMove:`onmousemove`,onMouseOut:`onmouseout`,onMouseOver:`onmouseover`,onMouseUp:`onmouseup`,onMouseWheel:`onmousewheel`,onOffline:`onoffline`,onOnline:`ononline`,onPageHide:`onpagehide`,onPageShow:`onpageshow`,onPaste:`onpaste`,onPause:`onpause`,onPlay:`onplay`,onPlaying:`onplaying`,onPopState:`onpopstate`,onProgress:`onprogress`,onRateChange:`onratechange`,onRepeat:`onrepeat`,onReset:`onreset`,onResize:`onresize`,onScroll:`onscroll`,onSeeked:`onseeked`,onSeeking:`onseeking`,onSelect:`onselect`,onShow:`onshow`,onStalled:`onstalled`,onStorage:`onstorage`,onSubmit:`onsubmit`,onSuspend:`onsuspend`,onTimeUpdate:`ontimeupdate`,onToggle:`ontoggle`,onUnload:`onunload`,onVolumeChange:`onvolumechange`,onWaiting:`onwaiting`,onZoom:`onzoom`,overlinePosition:`overline-position`,overlineThickness:`overline-thickness`,paintOrder:`paint-order`,panose1:`panose-1`,pointerEvents:`pointer-events`,referrerPolicy:`referrerpolicy`,renderingIntent:`rendering-intent`,shapeRendering:`shape-rendering`,stopColor:`stop-color`,stopOpacity:`stop-opacity`,strikethroughPosition:`strikethrough-position`,strikethroughThickness:`strikethrough-thickness`,strokeDashArray:`stroke-dasharray`,strokeDashOffset:`stroke-dashoffset`,strokeLineCap:`stroke-linecap`,strokeLineJoin:`stroke-linejoin`,strokeMiterLimit:`stroke-miterlimit`,strokeOpacity:`stroke-opacity`,strokeWidth:`stroke-width`,tabIndex:`tabindex`,textAnchor:`text-anchor`,textDecoration:`text-decoration`,textRendering:`text-rendering`,transformOrigin:`transform-origin`,typeOf:`typeof`,underlinePosition:`underline-position`,underlineThickness:`underline-thickness`,unicodeBidi:`unicode-bidi`,unicodeRange:`unicode-range`,unitsPerEm:`units-per-em`,vAlphabetic:`v-alphabetic`,vHanging:`v-hanging`,vIdeographic:`v-ideographic`,vMathematical:`v-mathematical`,vectorEffect:`vector-effect`,vertAdvY:`vert-adv-y`,vertOriginX:`vert-origin-x`,vertOriginY:`vert-origin-y`,wordSpacing:`word-spacing`,writingMode:`writing-mode`,xHeight:`x-height`,playbackOrder:`playbackorder`,timelineBegin:`timelinebegin`},properties:{about:se,accentHeight:j,accumulate:null,additive:null,alignmentBaseline:null,alphabetic:j,amplitude:j,arabicForm:null,ascent:j,attributeName:null,attributeType:null,azimuth:j,bandwidth:null,baselineShift:null,baseFrequency:null,baseProfile:null,bbox:null,begin:null,bias:j,by:null,calcMode:null,capHeight:j,className:M,clip:null,clipPath:null,clipPathUnits:null,clipRule:null,color:null,colorInterpolation:null,colorInterpolationFilters:null,colorProfile:null,colorRendering:null,content:null,contentScriptType:null,contentStyleType:null,crossOrigin:null,cursor:null,cx:null,cy:null,d:null,dataType:null,defaultAction:null,descent:j,diffuseConstant:j,direction:null,display:null,dur:null,divisor:j,dominantBaseline:null,download:k,dx:null,dy:null,edgeMode:null,editable:null,elevation:j,enableBackground:null,end:null,event:null,exponent:j,externalResourcesRequired:null,fill:null,fillOpacity:j,fillRule:null,filter:null,filterRes:null,filterUnits:null,floodColor:null,floodOpacity:null,focusable:null,focusHighlight:null,fontFamily:null,fontSize:null,fontSizeAdjust:null,fontStretch:null,fontStyle:null,fontVariant:null,fontWeight:null,format:null,fr:null,from:null,fx:null,fy:null,g1:oe,g2:oe,glyphName:oe,glyphOrientationHorizontal:null,glyphOrientationVertical:null,glyphRef:null,gradientTransform:null,gradientUnits:null,handler:null,hanging:j,hatchContentUnits:null,hatchUnits:null,height:null,href:null,hrefLang:null,horizAdvX:j,horizOriginX:j,horizOriginY:j,id:null,ideographic:j,imageRendering:null,initialVisibility:null,in:null,in2:null,intercept:j,k:j,k1:j,k2:j,k3:j,k4:j,kernelMatrix:se,kernelUnitLength:null,keyPoints:null,keySplines:null,keyTimes:null,kerning:null,lang:null,lengthAdjust:null,letterSpacing:null,lightingColor:null,limitingConeAngle:j,local:null,markerEnd:null,markerMid:null,markerStart:null,markerHeight:null,markerUnits:null,markerWidth:null,mask:null,maskContentUnits:null,maskType:null,maskUnits:null,mathematical:null,max:null,media:null,mediaCharacterEncoding:null,mediaContentEncodings:null,mediaSize:j,mediaTime:null,method:null,min:null,mode:null,name:null,navDown:null,navDownLeft:null,navDownRight:null,navLeft:null,navNext:null,navPrev:null,navRight:null,navUp:null,navUpLeft:null,navUpRight:null,numOctaves:null,observer:null,offset:null,onAbort:null,onActivate:null,onAfterPrint:null,onBeforePrint:null,onBegin:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnd:null,onEnded:null,onError:null,onFocus:null,onFocusIn:null,onFocusOut:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadStart:null,onMessage:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onMouseWheel:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRepeat:null,onReset:null,onResize:null,onScroll:null,onSeeked:null,onSeeking:null,onSelect:null,onShow:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnload:null,onVolumeChange:null,onWaiting:null,onZoom:null,opacity:null,operator:null,order:null,orient:null,orientation:null,origin:null,overflow:null,overlay:null,overlinePosition:j,overlineThickness:j,paintOrder:null,panose1:null,path:null,pathLength:j,patternContentUnits:null,patternTransform:null,patternUnits:null,phase:null,ping:M,pitch:null,playbackOrder:null,pointerEvents:null,points:null,pointsAtX:j,pointsAtY:j,pointsAtZ:j,preserveAlpha:null,preserveAspectRatio:null,primitiveUnits:null,propagate:null,property:se,r:null,radius:null,referrerPolicy:null,refX:null,refY:null,rel:se,rev:se,renderingIntent:null,repeatCount:null,repeatDur:null,requiredExtensions:se,requiredFeatures:se,requiredFonts:se,requiredFormats:se,resource:null,restart:null,result:null,rotate:null,rx:null,ry:null,scale:null,seed:null,shapeRendering:null,side:null,slope:null,snapshotTime:null,specularConstant:j,specularExponent:j,spreadMethod:null,spacing:null,startOffset:null,stdDeviation:null,stemh:null,stemv:null,stitchTiles:null,stopColor:null,stopOpacity:null,strikethroughPosition:j,strikethroughThickness:j,string:null,stroke:null,strokeDashArray:se,strokeDashOffset:null,strokeLineCap:null,strokeLineJoin:null,strokeMiterLimit:j,strokeOpacity:j,strokeWidth:null,style:null,surfaceScale:j,syncBehavior:null,syncBehaviorDefault:null,syncMaster:null,syncTolerance:null,syncToleranceDefault:null,systemLanguage:se,tabIndex:j,tableValues:null,target:null,targetX:j,targetY:j,textAnchor:null,textDecoration:null,textRendering:null,textLength:null,timelineBegin:null,title:null,transformBehavior:null,type:null,typeOf:se,to:null,transform:null,transformOrigin:null,u1:null,u2:null,underlinePosition:j,underlineThickness:j,unicode:null,unicodeBidi:null,unicodeRange:null,unitsPerEm:j,values:null,vAlphabetic:j,vMathematical:j,vectorEffect:null,vHanging:j,vIdeographic:j,version:null,vertAdvY:j,vertOriginX:j,vertOriginY:j,viewBox:null,viewTarget:null,visibility:null,width:null,widths:null,wordSpacing:null,writingMode:null,x:null,x1:null,x2:null,xChannelSelector:null,xHeight:j,y:null,y1:null,y2:null,yChannelSelector:null,z:null,zoomAndPan:null},space:`svg`,transform:me}),N=fe({properties:{xLinkActuate:null,xLinkArcRole:null,xLinkHref:null,xLinkRole:null,xLinkShow:null,xLinkTitle:null,xLinkType:null},space:`xlink`,transform(e,t){return`xlink:`+t.slice(5).toLowerCase()}}),P=fe({attributes:{xmlnsxlink:`xmlns:xlink`},properties:{xmlnsXLink:null,xmlns:null},space:`xmlns`,transform:he}),ve=fe({properties:{xmlBase:null,xmlLang:null,xmlSpace:null},space:`xml`,transform(e,t){return`xml:`+t.slice(3).toLowerCase()}}),ye={classId:`classID`,dataType:`datatype`,itemId:`itemID`,strokeDashArray:`strokeDasharray`,strokeDashOffset:`strokeDashoffset`,strokeLineCap:`strokeLinecap`,strokeLineJoin:`strokeLinejoin`,strokeMiterLimit:`strokeMiterlimit`,typeOf:`typeof`,xLinkActuate:`xlinkActuate`,xLinkArcRole:`xlinkArcrole`,xLinkHref:`xlinkHref`,xLinkRole:`xlinkRole`,xLinkShow:`xlinkShow`,xLinkTitle:`xlinkTitle`,xLinkType:`xlinkType`,xmlnsXLink:`xmlnsXlink`},be=/[A-Z]/g,xe=/-[a-z]/g,Se=/^data[-\w.:]+$/i;function F(e,t){let n=ne(t),r=t,i=O;if(n in e.normal)return e.property[e.normal[n]];if(n.length>4&&n.slice(0,4)===`data`&&Se.test(t)){if(t.charAt(4)===`-`){let e=t.slice(5).replace(xe,we);r=`data`+e.charAt(0).toUpperCase()+e.slice(1)}else{let e=t.slice(4);if(!xe.test(e)){let n=e.replace(be,Ce);n.charAt(0)!==`-`&&(n=`-`+n),t=`data`+n}}i=ue}return new i(r,t)}function Ce(e){return`-`+e.toLowerCase()}function we(e){return e.charAt(1).toUpperCase()}var Te=te([pe,ge,N,P,ve],`html`),Ee=te([pe,_e,N,P,ve],`svg`);function De(e){return e.join(` `).trim()}var Oe=o(((e,t)=>{var n=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,r=/\n/g,i=/^\s*/,a=/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,o=/^:\s*/,s=/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,c=/^[;\s]*/,l=/^\s+|\s+$/g;function u(e,t){if(typeof e!=`string`)throw TypeError(`First argument must be a string`);if(!e)return[];t||={};var l=1,u=1;function f(e){var t=e.match(r);t&&(l+=t.length);var n=e.lastIndexOf(`
`);u=~n?e.length-n:u+e.length}function p(){var e={line:l,column:u};return function(t){return t.position=new m(e),_(),t}}function m(e){this.start=e,this.end={line:l,column:u},this.source=t.source}m.prototype.content=e;function h(n){var r=Error(t.source+`:`+l+`:`+u+`: `+n);if(r.reason=n,r.filename=t.source,r.line=l,r.column=u,r.source=e,!t.silent)throw r}function g(t){var n=t.exec(e);if(n){var r=n[0];return f(r),e=e.slice(r.length),n}}function _(){g(i)}function v(e){var t;for(e||=[];t=y();)t!==!1&&e.push(t);return e}function y(){var t=p();if(e.charAt(0)==`/`&&e.charAt(1)==`*`){for(var n=2;e.charAt(n)!=``&&(e.charAt(n)!=`*`||e.charAt(n+1)!=`/`);)++n;if(n+=2,e.charAt(n-1)===``)return h(`End of comment missing`);var r=e.slice(2,n-2);return u+=2,f(r),e=e.slice(n),u+=2,t({type:`comment`,comment:r})}}function b(){var e=p(),t=g(a);if(t){if(y(),!g(o))return h(`property missing ':'`);var r=g(s),i=e({type:`declaration`,property:d(t[0].replace(n,``)),value:r?d(r[0].replace(n,``)):``});return g(c),i}}function x(){var e=[];v(e);for(var t;t=b();)t!==!1&&(e.push(t),v(e));return e}return _(),x()}function d(e){return e?e.replace(l,``):``}t.exports=u})),ke=o((e=>{var t=e&&e.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(e,"__esModule",{value:!0}),e.default=r;var n=t(Oe());function r(e,t){let r=null;if(!e||typeof e!=`string`)return r;let i=(0,n.default)(e),a=typeof t==`function`;return i.forEach(e=>{if(e.type!==`declaration`)return;let{property:n,value:i}=e;a?t(n,i,e):i&&(r||={},r[n]=i)}),r}})),Ae=o((e=>{Object.defineProperty(e,"__esModule",{value:!0}),e.camelCase=void 0;var t=/^--[a-zA-Z0-9_-]+$/,n=/-([a-z])/g,r=/^[^-]+$/,i=/^-(webkit|moz|ms|o|khtml)-/,a=/^-(ms)-/,o=function(e){return!e||r.test(e)||t.test(e)},s=function(e,t){return t.toUpperCase()},c=function(e,t){return`${t}-`};e.camelCase=function(e,t){return t===void 0&&(t={}),o(e)?e:(e=e.toLowerCase(),e=t.reactCompat?e.replace(a,c):e.replace(i,c),e.replace(n,s))}})),je=o(((e,t)=>{var n=(e&&e.__importDefault||function(e){return e&&e.__esModule?e:{default:e}})(ke()),r=Ae();function i(e,t){var i={};return!e||typeof e!=`string`||(0,n.default)(e,function(e,n){e&&n&&(i[(0,r.camelCase)(e,t)]=n)}),i}i.default=i,t.exports=i})),Me=Pe(`end`),Ne=Pe(`start`);function Pe(e){return t;function t(t){let n=t&&t.position&&t.position[e]||{};if(typeof n.line==`number`&&n.line>0&&typeof n.column==`number`&&n.column>0)return{line:n.line,column:n.column,offset:typeof n.offset==`number`&&n.offset>-1?n.offset:void 0}}}function Fe(e){let t=Ne(e),n=Me(e);if(t&&n)return{start:t,end:n}}function Ie(e){return!e||typeof e!=`object`?``:`position`in e||`type`in e?Re(e.position):`start`in e||`end`in e?Re(e):`line`in e||`column`in e?Le(e):``}function Le(e){return ze(e&&e.line)+`:`+ze(e&&e.column)}function Re(e){return Le(e&&e.start)+`-`+Le(e&&e.end)}function ze(e){return e&&typeof e==`number`?e:1}var Be=class extends Error{constructor(e,t,n){super(),typeof t==`string`&&(n=t,t=void 0);let r=``,i={},a=!1;if(t&&(i=`line`in t&&`column`in t||`start`in t&&`end`in t?{place:t}:`type`in t?{ancestors:[t],place:t.position}:{...t}),typeof e==`string`?r=e:!i.cause&&e&&(a=!0,r=e.message,i.cause=e),!i.ruleId&&!i.source&&typeof n==`string`){let e=n.indexOf(`:`);e===-1?i.ruleId=n:(i.source=n.slice(0,e),i.ruleId=n.slice(e+1))}if(!i.place&&i.ancestors&&i.ancestors){let e=i.ancestors[i.ancestors.length-1];e&&(i.place=e.position)}let o=i.place&&`start`in i.place?i.place.start:i.place;this.ancestors=i.ancestors||void 0,this.cause=i.cause||void 0,this.column=o?o.column:void 0,this.fatal=void 0,this.file=``,this.message=r,this.line=o?o.line:void 0,this.name=Ie(i.place)||`1:1`,this.place=i.place||void 0,this.reason=this.message,this.ruleId=i.ruleId||void 0,this.source=i.source||void 0,this.stack=a&&i.cause&&typeof i.cause.stack==`string`?i.cause.stack:``,this.actual=void 0,this.expected=void 0,this.note=void 0,this.url=void 0}};Be.prototype.file=``,Be.prototype.name=``,Be.prototype.reason=``,Be.prototype.message=``,Be.prototype.stack=``,Be.prototype.column=void 0,Be.prototype.line=void 0,Be.prototype.ancestors=void 0,Be.prototype.cause=void 0,Be.prototype.fatal=void 0,Be.prototype.place=void 0,Be.prototype.ruleId=void 0,Be.prototype.source=void 0;var Ve=l(je(),1),He={}.hasOwnProperty,Ue=new Map,We=/[A-Z]/g,Ge=new Set([`table`,`tbody`,`thead`,`tfoot`,`tr`]),Ke=new Set([`td`,`th`]),qe=`https://github.com/syntax-tree/hast-util-to-jsx-runtime`;function Je(e,t){if(!t||t.Fragment===void 0)throw TypeError("Expected `Fragment` in options");let n=t.filePath||void 0,r;if(t.development){if(typeof t.jsxDEV!=`function`)throw TypeError("Expected `jsxDEV` in options when `development: true`");r=at(n,t.jsxDEV)}else{if(typeof t.jsx!=`function`)throw TypeError("Expected `jsx` in production options");if(typeof t.jsxs!=`function`)throw TypeError("Expected `jsxs` in production options");r=it(n,t.jsx,t.jsxs)}let i={Fragment:t.Fragment,ancestors:[],components:t.components||{},create:r,elementAttributeNameCase:t.elementAttributeNameCase||`react`,evaluater:t.createEvaluater?t.createEvaluater():void 0,filePath:n,ignoreInvalidStyle:t.ignoreInvalidStyle||!1,passKeys:t.passKeys!==!1,passNode:t.passNode||!1,schema:t.space===`svg`?Ee:Te,stylePropertyNameCase:t.stylePropertyNameCase||`dom`,tableCellAlignToStyle:t.tableCellAlignToStyle!==!1},a=Ye(i,e,void 0);return a&&typeof a!=`string`?a:i.create(e,i.Fragment,{children:a||void 0},void 0)}function Ye(e,t,n){if(t.type===`element`)return Xe(e,t,n);if(t.type===`mdxFlowExpression`||t.type===`mdxTextExpression`)return Ze(e,t);if(t.type===`mdxJsxFlowElement`||t.type===`mdxJsxTextElement`)return $e(e,t,n);if(t.type===`mdxjsEsm`)return Qe(e,t);if(t.type===`root`)return et(e,t,n);if(t.type===`text`)return tt(e,t)}function Xe(e,t,n){let r=e.schema,i=r;t.tagName.toLowerCase()===`svg`&&r.space===`html`&&(i=Ee,e.schema=i),e.ancestors.push(t);let a=dt(e,t.tagName,!1),o=ot(e,t),s=ct(e,t);return Ge.has(t.tagName)&&(s=s.filter(function(e){return typeof e!=`string`||!T(e)})),nt(e,o,a,t),rt(o,s),e.ancestors.pop(),e.schema=r,e.create(t,a,o,n)}function Ze(e,t){if(t.data&&t.data.estree&&e.evaluater){let n=t.data.estree.body[0];return n.type,e.evaluater.evaluateExpression(n.expression)}ft(e,t.position)}function Qe(e,t){if(t.data&&t.data.estree&&e.evaluater)return e.evaluater.evaluateProgram(t.data.estree);ft(e,t.position)}function $e(e,t,n){let r=e.schema,i=r;t.name===`svg`&&r.space===`html`&&(i=Ee,e.schema=i),e.ancestors.push(t);let a=t.name===null?e.Fragment:dt(e,t.name,!0),o=st(e,t),s=ct(e,t);return nt(e,o,a,t),rt(o,s),e.ancestors.pop(),e.schema=r,e.create(t,a,o,n)}function et(e,t,n){let r={};return rt(r,ct(e,t)),e.create(t,e.Fragment,r,n)}function tt(e,t){return t.value}function nt(e,t,n,r){typeof n!=`string`&&n!==e.Fragment&&e.passNode&&(t.node=r)}function rt(e,t){if(t.length>0){let n=t.length>1?t:t[0];n&&(e.children=n)}}function it(e,t,n){return r;function r(e,r,i,a){let o=Array.isArray(i.children)?n:t;return a?o(r,i,a):o(r,i)}}function at(e,t){return n;function n(n,r,i,a){let o=Array.isArray(i.children),s=Ne(n);return t(r,i,a,o,{columnNumber:s?s.column-1:void 0,fileName:e,lineNumber:s?s.line:void 0},void 0)}}function ot(e,t){let n={},r,i;for(i in t.properties)if(i!==`children`&&He.call(t.properties,i)){let a=lt(e,i,t.properties[i]);if(a){let[i,o]=a;e.tableCellAlignToStyle&&i===`align`&&typeof o==`string`&&Ke.has(t.tagName)?r=o:n[i]=o}}if(r){let t=n.style||={};t[e.stylePropertyNameCase===`css`?`text-align`:`textAlign`]=r}return n}function st(e,t){let n={};for(let r of t.attributes)if(r.type===`mdxJsxExpressionAttribute`){if(r.data&&r.data.estree&&e.evaluater){let t=r.data.estree.body[0];t.type;let i=t.expression;i.type;let a=i.properties[0];a.type,Object.assign(n,e.evaluater.evaluateExpression(a.argument))}else ft(e,t.position)}else{let i=r.name,a;if(r.value&&typeof r.value==`object`){if(r.value.data&&r.value.data.estree&&e.evaluater){let t=r.value.data.estree.body[0];t.type,a=e.evaluater.evaluateExpression(t.expression)}else ft(e,t.position)}else a=r.value===null||r.value;n[i]=a}return n}function ct(e,t){let n=[],r=-1,i=e.passKeys?new Map:Ue;for(;++r<t.children.length;){let a=t.children[r],o;if(e.passKeys){let e=a.type===`element`?a.tagName:a.type===`mdxJsxFlowElement`||a.type===`mdxJsxTextElement`?a.name:void 0;if(e){let t=i.get(e)||0;o=e+`-`+t,i.set(e,t+1)}}let s=Ye(e,a,o);s!==void 0&&n.push(s)}return n}function lt(e,t,n){let r=F(e.schema,t);if(!(n==null||typeof n==`number`&&Number.isNaN(n))){if(Array.isArray(n)&&(n=r.commaSeparated?b(n):De(n)),r.property===`style`){let t=typeof n==`object`?n:ut(e,String(n));return e.stylePropertyNameCase===`css`&&(t=pt(t)),[`style`,t]}return[e.elementAttributeNameCase===`react`&&r.space?ye[r.property]||r.property:r.attribute,n]}}function ut(e,t){try{return(0,Ve.default)(t,{reactCompat:!0})}catch(t){if(e.ignoreInvalidStyle)return{};let n=t,r=new Be("Cannot parse `style` attribute",{ancestors:e.ancestors,cause:n,ruleId:`style`,source:`hast-util-to-jsx-runtime`});throw r.file=e.filePath||void 0,r.url=qe+`#cannot-parse-style-attribute`,r}}function dt(e,t,n){let r;if(!n)r={type:`Literal`,value:t};else if(t.includes(`.`)){let e=t.split(`.`),n=-1,i;for(;++n<e.length;){let t=ee(e[n])?{type:`Identifier`,name:e[n]}:{type:`Literal`,value:e[n]};i=i?{type:`MemberExpression`,object:i,property:t,computed:!!(n&&t.type===`Literal`),optional:!1}:t}r=i}else r=ee(t)&&!/^[a-z]/.test(t)?{type:`Identifier`,name:t}:{type:`Literal`,value:t};if(r.type===`Literal`){let t=r.value;return He.call(e.components,t)?e.components[t]:t}if(e.evaluater)return e.evaluater.evaluateExpression(r);ft(e)}function ft(e,t){let n=new Be("Cannot handle MDX estrees without `createEvaluater`",{ancestors:e.ancestors,place:t,ruleId:`mdx-estree`,source:`hast-util-to-jsx-runtime`});throw n.file=e.filePath||void 0,n.url=qe+`#cannot-handle-mdx-estrees-without-createevaluater`,n}function pt(e){let t={},n;for(n in e)He.call(e,n)&&(t[mt(n)]=e[n]);return t}function mt(e){let t=e.replace(We,ht);return t.slice(0,3)===`ms-`&&(t=`-`+t),t}function ht(e){return`-`+e.toLowerCase()}var gt={action:[`form`],cite:[`blockquote`,`del`,`ins`,`q`],data:[`object`],formAction:[`button`,`input`],href:[`a`,`area`,`base`,`link`],icon:[`menuitem`],itemId:null,manifest:[`html`],ping:[`a`,`area`],poster:[`video`],src:[`audio`,`embed`,`iframe`,`img`,`input`,`script`,`source`,`track`,`video`]},_t=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),vt=o(((e,t)=>{t.exports=_t()})),yt={};function bt(e,t){let n=t||yt;return xt(e,typeof n.includeImageAlt!=`boolean`||n.includeImageAlt,typeof n.includeHtml!=`boolean`||n.includeHtml)}function xt(e,t,n){if(Ct(e)){if(`value`in e)return e.type===`html`&&!n?``:e.value;if(t&&`alt`in e&&e.alt)return e.alt;if(`children`in e)return St(e.children,t,n)}return Array.isArray(e)?St(e,t,n):``}function St(e,t,n){let r=[],i=-1;for(;++i<e.length;)r[i]=xt(e[i],t,n);return r.join(``)}function Ct(e){return!!(e&&typeof e==`object`)}var wt=document.createElement(`i`);function Tt(e){let t=`&`+e+`;`;wt.innerHTML=t;let n=wt.textContent;return n.charCodeAt(n.length-1)===59&&e!==`semi`?!1:n!==t&&n}function Et(e,t,n,r){let i=e.length,a=0,o;if(t=t<0?-t>i?0:i+t:t>i?i:t,n=n>0?n:0,r.length<1e4)o=Array.from(r),o.unshift(t,n),e.splice(...o);else for(n&&e.splice(t,n);a<r.length;)o=r.slice(a,a+1e4),o.unshift(t,0),e.splice(...o),a+=1e4,t+=1e4}function Dt(e,t){return e.length>0?(Et(e,e.length,0,t),e):t}var Ot={}.hasOwnProperty;function kt(e){let t={},n=-1;for(;++n<e.length;)At(t,e[n]);return t}function At(e,t){let n;for(n in t){let r=(Ot.call(e,n)?e[n]:void 0)||(e[n]={}),i=t[n],a;if(i)for(a in i){Ot.call(r,a)||(r[a]=[]);let e=i[a];jt(r[a],Array.isArray(e)?e:e?[e]:[])}}}function jt(e,t){let n=-1,r=[];for(;++n<t.length;)(t[n].add===`after`?e:r).push(t[n]);Et(e,0,0,r)}function Mt(e,t){let n=Number.parseInt(e,t);return n<9||n===11||n>13&&n<32||n>126&&n<160||n>55295&&n<57344||n>64975&&n<65008||(n&65535)==65535||(n&65535)==65534||n>1114111?`�`:String.fromCodePoint(n)}function Nt(e){return e.replace(/[\t\n\r ]+/g,` `).replace(/^ | $/g,``).toLowerCase().toUpperCase()}var Pt=Wt(/[A-Za-z]/),Ft=Wt(/[\dA-Za-z]/),It=Wt(/[#-'*+\--9=?A-Z^-~]/);function Lt(e){return e!==null&&(e<32||e===127)}var Rt=Wt(/\d/),zt=Wt(/[\dA-Fa-f]/),Bt=Wt(/[!-/:-@[-`{-~]/);function I(e){return e!==null&&e<-2}function Vt(e){return e!==null&&(e<0||e===32)}function L(e){return e===-2||e===-1||e===32}var Ht=Wt(/\p{P}|\p{S}/u),Ut=Wt(/\s/);function Wt(e){return t;function t(t){return t!==null&&t>-1&&e.test(String.fromCharCode(t))}}function Gt(e){let t=[],n=-1,r=0,i=0;for(;++n<e.length;){let a=e.charCodeAt(n),o=``;if(a===37&&Ft(e.charCodeAt(n+1))&&Ft(e.charCodeAt(n+2)))i=2;else if(a<128)/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(a))||(o=String.fromCharCode(a));else if(a>55295&&a<57344){let t=e.charCodeAt(n+1);a<56320&&t>56319&&t<57344?(o=String.fromCharCode(a,t),i=1):o=`�`}else o=String.fromCharCode(a);o&&=(t.push(e.slice(r,n),encodeURIComponent(o)),r=n+i+1,``),i&&=(n+=i,0)}return t.join(``)+e.slice(r)}function Kt(e,t,n,r){let i=r?r-1:1/0,a=0;return o;function o(r){return L(r)?(e.enter(n),s(r)):t(r)}function s(r){return L(r)&&a++<i?(e.consume(r),s):(e.exit(n),t(r))}}function R(e,t,n,r,i,a){let o=0;return s;function s(t){return a>0&&L(t)?(e.enter(r),c(t)):l(t)}function c(t){return L(t)&&o<a?(e.consume(t),o++,c):(e.exit(r),l(t))}function l(e){return o>=i?t(e):n(e)}}var qt={tokenize:Jt};function Jt(e){let t=e.attempt(this.parser.constructs.contentInitial,r,i),n;return t;function r(n){if(n===null){e.consume(n);return}return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),Kt(e,t,`linePrefix`)}function i(t){return e.enter(`paragraph`),a(t)}function a(t){let r=e.enter(`chunkText`,{contentType:`text`,previous:n});return n&&(n.next=r),n=r,o(t)}function o(t){if(t===null){e.exit(`chunkText`),e.exit(`paragraph`),e.consume(t);return}return I(t)?(e.consume(t),e.exit(`chunkText`),a):(e.consume(t),o)}}var Yt=class{constructor(){this.index=new Map,this.map=[]}add(e,t,n){Xt(this,e,t,n,!1)}addBefore(e,t,n){Xt(this,e,t,n,!0)}consume(e){if(this.map.sort(function(e,t){return e[0]-t[0]}),this.map.length===0)return;let t=this.map.length,n=[];for(;t>0;)--t,n.push(e.slice(this.map[t][0]+this.map[t][1]),this.map[t][2]),e.length=this.map[t][0];n.push(e.slice()),e.length=0;let r=n.pop();for(;r;){for(let t of r)e.push(t);r=n.pop()}this.map.length=0,this.index.clear()}};function Xt(e,t,n,r,i){if(n===0&&r.length===0)return;let a=e.index.get(t);if(a){a[1]+=n,i?(r.push(...a[2]),a[2]=r):a[2].push(...r);return}let o=[t,n,r];e.map.push(o),e.index.set(t,o)}var Zt={tokenize:$t},Qt={tokenize:en};function $t(e){let t=this,n=[],r=0,i,a,o;return s;function s(i){if(r<n.length){let a=n[r];return t.containerState=a[1],e.attempt(a[0].continuation,c,l)(i)}return l(i)}function c(e){if(r++,t.containerState._closeFlow){t.containerState._closeFlow=void 0,i&&v();let n=t.events.length,a=n,o;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){o=t.events[a][1].end;break}_(r);let s=n;for(;s<t.events.length;)t.events[s][1].end={...o},s++;let c=new Yt;return c.add(a+1,0,t.events.slice(n)),c.add(n,s-n,[]),c.consume(t.events),l(e)}return s(e)}function l(a){if(r===n.length){if(!i)return f(a);if(i.currentConstruct&&i.currentConstruct.concrete)return m(a);t.interrupt=!(!i.currentConstruct||i._gfmTableDynamicInterruptHack)}return t.containerState={},e.check(Qt,u,d)(a)}function u(e){return i&&v(),_(r),f(e)}function d(e){return t.parser.lazy[t.now().line]=r!==n.length,o=t.now().offset,m(e)}function f(n){return t.containerState={},e.attempt(Qt,p,m)(n)}function p(e){return r++,n.push([t.currentConstruct,t.containerState]),f(e)}function m(n){if(n===null){i&&v(),_(0),e.consume(n);return}return i||=t.parser.flow(t.now()),e.enter(`chunkFlow`,{_tokenizer:i,contentType:`flow`,previous:a}),h(n)}function h(n){if(n===null){g(e.exit(`chunkFlow`),!0),_(0),e.consume(n);return}return I(n)?(e.consume(n),g(e.exit(`chunkFlow`)),r=0,t.interrupt=void 0,s):(e.consume(n),h)}function g(e,n){let s=t.sliceStream(e);if(n&&s.push(null),e.previous=a,a&&(a.next=e),a=e,i.defineSkip(e.start),i.write(s),t.parser.lazy[e.start.line]){let e=i.events.length;for(;e--;)if(i.events[e][1].start.offset<o&&(!i.events[e][1].end||i.events[e][1].end.offset>o))return;let n=t.events.length,a=n,s,c;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){if(s){c=t.events[a][1].end;break}s=!0}for(_(r),e=n;e<t.events.length;)t.events[e][1].end={...c},e++;let l=new Yt;l.add(a+1,0,t.events.slice(n)),l.add(n,e-n,[]),l.consume(t.events)}}function _(r){let i=n.length;for(;i-->r;){let r=n[i];t.containerState=r[1],r[0].exit.call(t,e)}n.length=r}function v(){i.write([null]),a=void 0,i=void 0,t.containerState._closeFlow=void 0}}function en(e,t,n){return Kt(e,e.attempt(this.parser.constructs.document,t,n),`linePrefix`,this.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)}function tn(e){if(e===null||Vt(e)||Ut(e))return 1;if(Ht(e))return 2}function nn(e,t,n){let r=[],i=-1;for(;++i<e.length;){let a=e[i].resolveAll;a&&!r.includes(a)&&(t=a(t,n),r.push(a))}return t}var rn={name:`attention`,resolveAll:an,tokenize:on};function an(e,t){let n=-1,r;for(;++n<e.length;)if(e[n][0]===`enter`&&e[n][1].type===`attentionSequence`&&e[n][1]._close){let i=n;for(;i--;)if(e[i][0]===`exit`&&e[i][1].type===`attentionSequence`&&e[i][1]._open&&t.sliceSerialize(e[i][1]).charCodeAt(0)===t.sliceSerialize(e[n][1]).charCodeAt(0)){if((e[i][1]._close||e[n][1]._open)&&(e[n][1].end.offset-e[n][1].start.offset)%3&&!((e[i][1].end.offset-e[i][1].start.offset+e[n][1].end.offset-e[n][1].start.offset)%3))continue;let a=e[i][1].end.offset-e[i][1].start.offset>1&&e[n][1].end.offset-e[n][1].start.offset>1?2:1,o={...e[i][1].end},s={...e[n][1].start};sn(o,-a),sn(s,a);let c={type:a>1?`strongSequence`:`emphasisSequence`,start:o,end:{...e[i][1].end}},l={type:a>1?`strongSequence`:`emphasisSequence`,start:{...e[n][1].start},end:s},u={type:a>1?`strongText`:`emphasisText`,start:{...e[i][1].end},end:{...e[n][1].start}},d={type:a>1?`strong`:`emphasis`,start:{...c.start},end:{...l.end}};e[i][1].end={...c.start},e[n][1].start={...l.end},r=[],e[i][1].end.offset-e[i][1].start.offset&&(r=Dt(r,[[`enter`,e[i][1],t],[`exit`,e[i][1],t]])),r=Dt(r,[[`enter`,d,t],[`enter`,c,t],[`exit`,c,t],[`enter`,u,t]]),r=Dt(r,nn(t.parser.constructs.insideSpan.null,e.slice(i+1,n),t)),r=Dt(r,[[`exit`,u,t],[`enter`,l,t],[`exit`,l,t],[`exit`,d,t]]);let f=0;e[n][1].end.offset-e[n][1].start.offset&&(f=2,r=Dt(r,[[`enter`,e[n][1],t],[`exit`,e[n][1],t]])),Et(e,i-1,n-i+3,r),n=i+r.length-f-2;break}}for(n=-1;++n<e.length;)e[n][1].type===`attentionSequence`&&(e[n][1].type=`data`);return e}function on(e,t){let n=this.parser.constructs.attentionMarkers.null,r=this.previous,i=tn(r),a;return o;function o(t){return a=t,e.enter(`attentionSequence`),s(t)}function s(o){if(o===a)return e.consume(o),s;let c=e.exit(`attentionSequence`),l=tn(o),u=!l||l===2&&i||n.includes(o)&&o!==42&&o!==95,d=!i||i===2&&l||n.includes(r)&&r!==42&&r!==95;return c._open=!!(a===42?u:u&&(i||!d)),c._close=!!(a===42?d:d&&(l||!u)),t(o)}}function sn(e,t){e.column+=t,e.offset+=t,e._bufferIndex+=t}var cn={name:`autolink`,tokenize:ln};function ln(e,t,n){let r=0;return i;function i(t){return e.enter(`autolink`),e.enter(`autolinkMarker`),e.consume(t),e.exit(`autolinkMarker`),e.enter(`autolinkProtocol`),a}function a(t){return Pt(t)?(e.consume(t),o):t===64?n(t):l(t)}function o(e){return e===43||e===45||e===46||Ft(e)?(r=1,s(e)):l(e)}function s(t){return t===58?(e.consume(t),r=0,c):(t===43||t===45||t===46||Ft(t))&&r++<32?(e.consume(t),s):(r=0,l(t))}function c(r){return r===62?(e.exit(`autolinkProtocol`),e.enter(`autolinkMarker`),e.consume(r),e.exit(`autolinkMarker`),e.exit(`autolink`),t):r===null||r===32||r===60||Lt(r)?n(r):(e.consume(r),c)}function l(t){return t===64?(e.consume(t),u):It(t)?(e.consume(t),l):n(t)}function u(e){return Ft(e)?d(e):n(e)}function d(n){return n===46?(e.consume(n),r=0,u):n===62?(e.exit(`autolinkProtocol`).type=`autolinkEmail`,e.enter(`autolinkMarker`),e.consume(n),e.exit(`autolinkMarker`),e.exit(`autolink`),t):f(n)}function f(t){if((t===45||Ft(t))&&r++<63){let n=t===45?f:d;return e.consume(t),n}return n(t)}}var un={partial:!0,tokenize:dn};function dn(e,t,n){return r;function r(t){return L(t)?Kt(e,i,`linePrefix`)(t):i(t)}function i(e){return e===null||I(e)?t(e):n(e)}}var fn={continuation:{tokenize:mn},exit:hn,name:`blockQuote`,tokenize:pn};function pn(e,t,n){let r=this;return i;function i(t){if(t===62){let n=r.containerState;return n.open||=(e.enter(`blockQuote`,{_container:!0}),!0),e.enter(`blockQuotePrefix`),e.enter(`blockQuoteMarker`),e.consume(t),e.exit(`blockQuoteMarker`),a}return n(t)}function a(n){return L(n)?(e.enter(`blockQuotePrefixWhitespace`),e.consume(n),e.exit(`blockQuotePrefixWhitespace`),e.exit(`blockQuotePrefix`),t):(e.exit(`blockQuotePrefix`),t(n))}}function mn(e,t,n){let r=this;return i;function i(t){return L(t)?Kt(e,a,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):a(t)}function a(r){return e.attempt(fn,t,n)(r)}}function hn(e){e.exit(`blockQuote`)}var gn={name:`characterEscape`,tokenize:_n};function _n(e,t,n){return r;function r(t){return e.enter(`characterEscape`),e.enter(`escapeMarker`),e.consume(t),e.exit(`escapeMarker`),i}function i(r){return Bt(r)?(e.enter(`characterEscapeValue`),e.consume(r),e.exit(`characterEscapeValue`),e.exit(`characterEscape`),t):n(r)}}var vn={name:`characterReference`,tokenize:yn};function yn(e,t,n){let r=this,i=0,a,o;return s;function s(t){return e.enter(`characterReference`),e.enter(`characterReferenceMarker`),e.consume(t),e.exit(`characterReferenceMarker`),c}function c(t){return t===35?(e.enter(`characterReferenceMarkerNumeric`),e.consume(t),e.exit(`characterReferenceMarkerNumeric`),l):(e.enter(`characterReferenceValue`),a=31,o=Ft,u(t))}function l(t){return t===88||t===120?(e.enter(`characterReferenceMarkerHexadecimal`),e.consume(t),e.exit(`characterReferenceMarkerHexadecimal`),e.enter(`characterReferenceValue`),a=6,o=zt,u):(e.enter(`characterReferenceValue`),a=7,o=Rt,u(t))}function u(s){if(s===59&&i){let i=e.exit(`characterReferenceValue`);return o===Ft&&!Tt(r.sliceSerialize(i))?n(s):(e.enter(`characterReferenceMarker`),e.consume(s),e.exit(`characterReferenceMarker`),e.exit(`characterReference`),t)}return o(s)&&i++<a?(e.consume(s),u):n(s)}}var bn={partial:!0,tokenize:xn};function xn(e,t,n){let r=this;return i;function i(t){return t===null?n(t):(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),a)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}var Sn={concrete:!0,name:`codeFenced`,tokenize:Cn};function Cn(e,t,n){let r=this,i={partial:!0,tokenize:x},a=0,o=0,s;return c;function c(e){return l(e)}function l(t){let n=r.events[r.events.length-1];return a=n&&n[1].type===`linePrefix`?n[2].sliceSerialize(n[1],!0).length:0,s=t,e.enter(`codeFenced`),e.enter(`codeFencedFence`),e.enter(`codeFencedFenceSequence`),u(t)}function u(t){return t===s?(o++,e.consume(t),u):o<3?n(t):(e.exit(`codeFencedFenceSequence`),L(t)?Kt(e,d,`whitespace`)(t):d(t))}function d(n){return n===null||I(n)?(e.exit(`codeFencedFence`),r.interrupt?t(n):e.check(bn,h,b)(n)):(e.enter(`codeFencedFenceInfo`),e.enter(`chunkString`,{contentType:`string`}),f(n))}function f(t){return t===null||I(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),d(t)):L(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),Kt(e,p,`whitespace`)(t)):t===96&&t===s?n(t):(e.consume(t),f)}function p(t){return t===null||I(t)?d(t):(e.enter(`codeFencedFenceMeta`),e.enter(`chunkString`,{contentType:`string`}),m(t))}function m(t){return t===null||I(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceMeta`),d(t)):t===96&&t===s?n(t):(e.consume(t),m)}function h(t){return e.attempt(i,b,g)(t)}function g(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),_}function _(t){return a>0&&L(t)?Kt(e,v,`linePrefix`,a+1)(t):v(t)}function v(t){return t===null||I(t)?e.check(bn,h,b)(t):(e.enter(`codeFlowValue`),y(t))}function y(t){return t===null||I(t)?(e.exit(`codeFlowValue`),v(t)):(e.consume(t),y)}function b(n){return e.exit(`codeFenced`),t(n)}function x(e,t,n){let i=0;return a;function a(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c}function c(t){return e.enter(`codeFencedFence`),L(t)?Kt(e,l,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):l(t)}function l(t){return t===s?(e.enter(`codeFencedFenceSequence`),u(t)):n(t)}function u(t){return t===s?(i++,e.consume(t),u):i>=o?(e.exit(`codeFencedFenceSequence`),L(t)?Kt(e,d,`whitespace`)(t):d(t)):n(t)}function d(r){return r===null||I(r)?(e.exit(`codeFencedFence`),t(r)):n(r)}}}var wn={name:`codeIndented`,tokenize:En},Tn={partial:!0,tokenize:Dn};function En(e,t,n){return r;function r(t){return e.enter(`codeIndented`),R(e,i,n,`linePrefix`,4,4)(t)}function i(t){return t===null?o(t):I(t)?e.attempt(Tn,i,o)(t):(e.enter(`codeFlowValue`),a(t))}function a(t){return t===null||I(t)?(e.exit(`codeFlowValue`),i(t)):(e.consume(t),a)}function o(n){return e.exit(`codeIndented`),t(n)}}function Dn(e,t,n){let r=this;return i;function i(o){return r.parser.lazy[r.now().line]?n(o):I(o)?(e.enter(`lineEnding`),e.consume(o),e.exit(`lineEnding`),i):R(e,t,a,`linePrefix`,4,4)(o)}function a(e){return I(e)?i(e):n(e)}}var On={name:`codeText`,previous:An,resolve:kn,tokenize:jn};function kn(e){let t=e.length-4,n=3,r,i;if((e[n][1].type===`lineEnding`||e[n][1].type===`space`)&&(e[t][1].type===`lineEnding`||e[t][1].type===`space`)){for(r=n;++r<t;)if(e[r][1].type===`codeTextData`){e[n][1].type=`codeTextPadding`,e[t][1].type=`codeTextPadding`,n+=2,t-=2;break}}for(r=n-1,t++;++r<=t;)i===void 0?r!==t&&e[r][1].type!==`lineEnding`&&(i=r):(r===t||e[r][1].type===`lineEnding`)&&(e[i][1].type=`codeTextData`,r!==i+2&&(e[i][1].end=e[r-1][1].end,e.splice(i+2,r-i-2),t-=r-i-2,r=i+2),i=void 0);return e}function An(e){return e!==96||this.events[this.events.length-1][1].type===`characterEscape`}function jn(e,t,n){let r=0,i,a;return o;function o(t){return e.enter(`codeText`),e.enter(`codeTextSequence`),s(t)}function s(t){return t===96?(e.consume(t),r++,s):(e.exit(`codeTextSequence`),c(t))}function c(t){return t===null?n(t):t===32?(e.enter(`space`),e.consume(t),e.exit(`space`),c):t===96?(a=e.enter(`codeTextSequence`),i=0,u(t)):I(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c):(e.enter(`codeTextData`),l(t))}function l(t){return t===null||t===32||t===96||I(t)?(e.exit(`codeTextData`),c(t)):(e.consume(t),l)}function u(n){return n===96?(e.consume(n),i++,u):i===r?(e.exit(`codeTextSequence`),e.exit(`codeText`),t(n)):(a.type=`codeTextData`,l(n))}}var Mn=class{constructor(e){this.left=e?[...e]:[],this.right=[]}get(e){if(e<0||e>=this.left.length+this.right.length)throw RangeError("Cannot access index `"+e+"` in a splice buffer of size `"+(this.left.length+this.right.length)+"`");return e<this.left.length?this.left[e]:this.right[this.right.length-e+this.left.length-1]}get length(){return this.left.length+this.right.length}shift(){return this.setCursor(0),this.right.pop()}slice(e,t){let n=t??1/0;return n<this.left.length?this.left.slice(e,n):e>this.left.length?this.right.slice(this.right.length-n+this.left.length,this.right.length-e+this.left.length).reverse():this.left.slice(e).concat(this.right.slice(this.right.length-n+this.left.length).reverse())}splice(e,t,n){let r=t||0;this.setCursor(Math.trunc(e));let i=this.right.splice(this.right.length-r,1/0);return n&&Nn(this.left,n),i.reverse()}pop(){return this.setCursor(1/0),this.left.pop()}push(e){this.setCursor(1/0),this.left.push(e)}pushMany(e){this.setCursor(1/0),Nn(this.left,e)}unshift(e){this.setCursor(0),this.right.push(e)}unshiftMany(e){this.setCursor(0),Nn(this.right,e.reverse())}setCursor(e){if(!(e===this.left.length||e>this.left.length&&this.right.length===0||e<0&&this.left.length===0)){if(e<this.left.length){let t=this.left.splice(e,1/0);Nn(this.right,t.reverse())}else{let t=this.right.splice(this.left.length+this.right.length-e,1/0);Nn(this.left,t.reverse())}}}};function Nn(e,t){let n=0;if(t.length<1e4)e.push(...t);else for(;n<t.length;)e.push(...t.slice(n,n+1e4)),n+=1e4}function Pn(e){let t={},n=-1,r,i,a,o,s,c,l,u=new Mn(e);for(;++n<u.length;){for(;n in t;)n=t[n];if(r=u.get(n),n&&r[1].type===`chunkFlow`&&u.get(n-1)[1].type===`listItemPrefix`&&(c=r[1]._tokenizer.events,a=0,a<c.length&&c[a][1].type===`lineEndingBlank`&&(a+=2),a<c.length&&c[a][1].type===`content`))for(;++a<c.length&&c[a][1].type!==`content`;)c[a][1].type===`chunkText`&&(c[a][1]._isInFirstContentOfListItem=!0,a++);if(r[0]===`enter`)r[1].contentType&&(Object.assign(t,Fn(u,n)),n=t[n],l=!0);else if(r[1]._container){for(a=n,i=void 0;a--;)if(o=u.get(a),o[1].type===`lineEnding`||o[1].type===`lineEndingBlank`)o[0]===`enter`&&(i&&(u.get(i)[1].type=`lineEndingBlank`),o[1].type=`lineEnding`,i=a);else if(o[1].type!==`linePrefix`&&o[1].type!==`listItemIndent`)break;i&&(r[1].end={...u.get(i)[1].start},s=u.slice(i,n),s.unshift(r),u.splice(i,n-i+1,s))}}return Et(e,0,1/0,u.slice(0)),!l}function Fn(e,t){let n=e.get(t)[1],r=e.get(t)[2],i=t-1,a=[],o=n._tokenizer;o||(o=r.parser[n.contentType](n.start),n._contentTypeTextTrailing&&(o._contentTypeTextTrailing=!0));let s=o.events,c=[],l={},u,d,f=-1,p=n,m=0,h=0,g=[h];for(;p;){for(;e.get(++i)[1]!==p;);a.push(i),p._tokenizer||(u=r.sliceStream(p),p.next||u.push(null),d&&o.defineSkip(p.start),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=!0),o.write(u),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=void 0)),d=p,p=p.next}for(p=n;++f<s.length;)s[f][0]===`exit`&&s[f-1][0]===`enter`&&s[f][1].type===s[f-1][1].type&&s[f][1].start.line!==s[f][1].end.line&&(h=f+1,g.push(h),p._tokenizer=void 0,p.previous=void 0,p=p.next);for(o.events=[],p?(p._tokenizer=void 0,p.previous=void 0):g.pop(),f=g.length;f--;){let t=s.slice(g[f],g[f+1]),n=a.pop();c.push([n,n+t.length-1]),e.splice(n,2,t)}for(c.reverse(),f=-1;++f<c.length;)l[m+c[f][0]]=m+c[f][1],m+=c[f][1]-c[f][0]-1;return l}var In={resolve:Rn,tokenize:zn},Ln={partial:!0,tokenize:Bn};function Rn(e){return Pn(e),e}function zn(e,t){let n;return r;function r(t){return e.enter(`content`),n=e.enter(`chunkContent`,{contentType:`content`}),i(t)}function i(t){return t===null?a(t):I(t)?e.check(Ln,o,a)(t):(e.consume(t),i)}function a(n){return e.exit(`chunkContent`),e.exit(`content`),t(n)}function o(t){return e.consume(t),e.exit(`chunkContent`),n.next=e.enter(`chunkContent`,{contentType:`content`,previous:n}),n=n.next,i}}function Bn(e,t,n){let r=this;return i;function i(t){return e.exit(`chunkContent`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),Kt(e,a,`linePrefix`)}function a(i){if(i===null||I(i))return n(i);let a=r.events[r.events.length-1];return!r.parser.constructs.disable.null.includes(`codeIndented`)&&a&&a[1].type===`linePrefix`&&a[2].sliceSerialize(a[1],!0).length>=4?t(i):e.interrupt(r.parser.constructs.flow,n,t)(i)}}function Vn(e,t,n,r,i,a,o,s,c){let l=c||1/0,u=0;return d;function d(t){return t===60?(e.enter(r),e.enter(i),e.enter(a),e.consume(t),e.exit(a),f):t===null||t===32||t===41||Lt(t)?n(t):(e.enter(r),e.enter(o),e.enter(s),e.enter(`chunkString`,{contentType:`string`}),h(t))}function f(n){return n===62?(e.enter(a),e.consume(n),e.exit(a),e.exit(i),e.exit(r),t):(e.enter(s),e.enter(`chunkString`,{contentType:`string`}),p(n))}function p(t){return t===62?(e.exit(`chunkString`),e.exit(s),f(t)):t===null||t===60||I(t)?n(t):(e.consume(t),t===92?m:p)}function m(t){return t===60||t===62||t===92?(e.consume(t),p):p(t)}function h(i){return!u&&(i===null||i===41||Vt(i))?(e.exit(`chunkString`),e.exit(s),e.exit(o),e.exit(r),t(i)):u<l&&i===40?(e.consume(i),u++,h):i===41?(e.consume(i),u--,h):i===null||i===32||i===40||Lt(i)?n(i):(e.consume(i),i===92?g:h)}function g(t){return t===40||t===41||t===92?(e.consume(t),h):h(t)}}function Hn(e,t,n,r,i,a){let o=this,s=0,c;return l;function l(t){return e.enter(r),e.enter(i),e.consume(t),e.exit(i),e.enter(a),u}function u(l){return s>999||l===null||l===91||l===93&&!c||l===94&&!s&&`_hiddenFootnoteSupport`in o.parser.constructs?n(l):l===93?(e.exit(a),e.enter(i),e.consume(l),e.exit(i),e.exit(r),t):I(l)?(e.enter(`lineEnding`),e.consume(l),e.exit(`lineEnding`),u):(e.enter(`chunkString`,{contentType:`string`}),d(l))}function d(t){return t===null||t===91||t===93||I(t)||s++>999?(e.exit(`chunkString`),u(t)):(e.consume(t),c||=!L(t),t===92?f:d)}function f(t){return t===91||t===92||t===93?(e.consume(t),s++,d):d(t)}}function Un(e,t,n,r,i,a){let o;return s;function s(t){return t===34||t===39||t===40?(e.enter(r),e.enter(i),e.consume(t),e.exit(i),o=t===40?41:t,c):n(t)}function c(n){return n===o?(e.enter(i),e.consume(n),e.exit(i),e.exit(r),t):(e.enter(a),l(n))}function l(t){return t===o?(e.exit(a),c(o)):t===null?n(t):I(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),Kt(e,l,`linePrefix`)):(e.enter(`chunkString`,{contentType:`string`}),u(t))}function u(t){return t===o||t===null||I(t)?(e.exit(`chunkString`),l(t)):(e.consume(t),t===92?d:u)}function d(t){return t===o||t===92?(e.consume(t),u):u(t)}}function Wn(e,t){let n;return r;function r(i){return I(i)?(e.enter(`lineEnding`),e.consume(i),e.exit(`lineEnding`),n=!0,r):L(i)?Kt(e,r,n?`linePrefix`:`lineSuffix`)(i):t(i)}}var Gn={name:`definition`,tokenize:qn},Kn={partial:!0,tokenize:Jn};function qn(e,t,n){let r=this,i;return a;function a(t){return e.enter(`definition`),o(t)}function o(t){return Hn.call(r,e,s,n,`definitionLabel`,`definitionLabelMarker`,`definitionLabelString`)(t)}function s(t){return i=Nt(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)),t===58?(e.enter(`definitionMarker`),e.consume(t),e.exit(`definitionMarker`),c):n(t)}function c(t){return Vt(t)?Wn(e,l)(t):l(t)}function l(t){return Vn(e,u,n,`definitionDestination`,`definitionDestinationLiteral`,`definitionDestinationLiteralMarker`,`definitionDestinationRaw`,`definitionDestinationString`)(t)}function u(t){return e.attempt(Kn,d,d)(t)}function d(t){return L(t)?Kt(e,f,`whitespace`)(t):f(t)}function f(a){return a===null||I(a)?(e.exit(`definition`),r.parser.defined.push(i),t(a)):n(a)}}function Jn(e,t,n){return r;function r(t){return Vt(t)?Wn(e,i)(t):n(t)}function i(t){return Un(e,a,n,`definitionTitle`,`definitionTitleMarker`,`definitionTitleString`)(t)}function a(t){return L(t)?Kt(e,o,`whitespace`)(t):o(t)}function o(e){return e===null||I(e)?t(e):n(e)}}var Yn={name:`hardBreakEscape`,tokenize:Xn};function Xn(e,t,n){return r;function r(t){return e.enter(`hardBreakEscape`),e.consume(t),i}function i(r){return I(r)?(e.exit(`hardBreakEscape`),t(r)):n(r)}}var Zn={name:`headingAtx`,resolve:Qn,tokenize:$n};function Qn(e,t){let n=e.length-2,r=3;if(e[r][1].type===`whitespace`&&(r+=2),n-2>r&&e[n][1].type===`whitespace`&&(n-=2),e[n][1].type===`atxHeadingSequence`&&(r===n-1||n-4>r&&e[n-2][1].type===`whitespace`)&&(n-=r+1===n?2:4),n>r){let i={type:`atxHeadingText`,start:e[r][1].start,end:e[n][1].end},a={type:`chunkText`,start:e[r][1].start,end:e[n][1].end,contentType:`text`};Et(e,r,n-r+1,[[`enter`,i,t],[`enter`,a,t],[`exit`,a,t],[`exit`,i,t]])}return e}function $n(e,t,n){let r=0;return i;function i(t){return e.enter(`atxHeading`),a(t)}function a(t){return e.enter(`atxHeadingSequence`),o(t)}function o(t){return t===35&&r++<6?(e.consume(t),o):t===null||Vt(t)?(e.exit(`atxHeadingSequence`),s(t)):n(t)}function s(n){return n===35?(e.enter(`atxHeadingSequence`),c(n)):n===null||I(n)?(e.exit(`atxHeading`),t(n)):L(n)?Kt(e,s,`whitespace`)(n):(e.enter(`atxHeadingText`),l(n))}function c(t){return t===35?(e.consume(t),c):(e.exit(`atxHeadingSequence`),s(t))}function l(t){return t===null||t===35||Vt(t)?(e.exit(`atxHeadingText`),s(t)):(e.consume(t),l)}}var er=`address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul`.split(`.`),tr=[`pre`,`script`,`style`,`textarea`],nr={concrete:!0,name:`htmlFlow`,resolveTo:ir,tokenize:ar},rr={partial:!0,tokenize:or};function ir(e){let t=e.length;for(;t--&&(e[t][0]!==`enter`||e[t][1].type!==`htmlFlow`););return t>1&&e[t-2][1].type===`linePrefix`&&(e[t][1].start=e[t-2][1].start,e[t+1][1].start=e[t-2][1].start,e.splice(t-2,2)),e}function ar(e,t,n){let r=this,i,a,o,s,c;return l;function l(e){return u(e)}function u(t){return e.enter(`htmlFlow`),e.enter(`htmlFlowData`),e.consume(t),d}function d(s){return s===33?(e.consume(s),f):s===47?(e.consume(s),a=!0,h):s===63?(e.consume(s),i=3,r.interrupt?t:ae):Pt(s)?(e.consume(s),o=String.fromCharCode(s),g):n(s)}function f(a){return a===45?(e.consume(a),i=2,p):a===91?(e.consume(a),i=5,s=0,m):Pt(a)?(e.consume(a),i=4,r.interrupt?t:ae):n(a)}function p(i){return i===45?(e.consume(i),r.interrupt?t:ae):n(i)}function m(i){return i===`CDATA[`.charCodeAt(s++)?(e.consume(i),s===6?r.interrupt?t:D:m):n(i)}function h(t){return Pt(t)?(e.consume(t),o=String.fromCharCode(t),g):n(t)}function g(s){if(s===null||s===47||s===62||Vt(s)){let c=s===47,l=o.toLowerCase();return!c&&!a&&tr.includes(l)?(i=1,r.interrupt?t(s):D(s)):er.includes(o.toLowerCase())?(i=6,c?(e.consume(s),_):r.interrupt?t(s):D(s)):(i=7,r.interrupt&&!r.parser.lazy[r.now().line]?n(s):a?v(s):y(s))}return s===45||Ft(s)?(e.consume(s),o+=String.fromCharCode(s),g):n(s)}function _(i){return i===62?(e.consume(i),r.interrupt?t:D):n(i)}function v(t){return L(t)?(e.consume(t),v):T(t)}function y(t){return t===47?(e.consume(t),T):t===58||t===95||Pt(t)?(e.consume(t),b):L(t)?(e.consume(t),y):T(t)}function b(t){return t===45||t===46||t===58||t===95||Ft(t)?(e.consume(t),b):x(t)}function x(t){return t===61?(e.consume(t),S):L(t)?(e.consume(t),x):y(t)}function S(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),c=t,C):L(t)?(e.consume(t),S):ee(t)}function C(t){return t===c?(e.consume(t),c=null,w):t===null||I(t)?n(t):(e.consume(t),C)}function ee(t){return t===null||t===34||t===39||t===47||t===60||t===61||t===62||t===96||Vt(t)?x(t):(e.consume(t),ee)}function w(e){return e===47||e===62||L(e)?y(e):n(e)}function T(t){return t===62?(e.consume(t),E):n(t)}function E(t){return t===null||I(t)?D(t):L(t)?(e.consume(t),E):n(t)}function D(t){return t===45&&i===2?(e.consume(t),re):t===60&&i===1?(e.consume(t),ie):t===62&&i===4?(e.consume(t),j):t===63&&i===3?(e.consume(t),ae):t===93&&i===5?(e.consume(t),A):I(t)&&(i===6||i===7)?(e.exit(`htmlFlowData`),e.check(rr,M,te)(t)):t===null||I(t)?(e.exit(`htmlFlowData`),te(t)):(e.consume(t),D)}function te(t){return e.check(bn,ne,M)(t)}function ne(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),O}function O(t){return t===null||I(t)?te(t):(e.enter(`htmlFlowData`),D(t))}function re(t){return t===45?(e.consume(t),ae):D(t)}function ie(t){return t===47?(e.consume(t),o=``,k):D(t)}function k(t){if(t===62){let n=o.toLowerCase();return tr.includes(n)?(e.consume(t),j):D(t)}return Pt(t)&&o.length<8?(e.consume(t),o+=String.fromCharCode(t),k):D(t)}function A(t){return t===93?(e.consume(t),ae):D(t)}function ae(t){return t===62?(e.consume(t),j):t===45&&i===2?(e.consume(t),ae):D(t)}function j(t){return t===null||I(t)?(e.exit(`htmlFlowData`),M(t)):(e.consume(t),j)}function M(n){return e.exit(`htmlFlow`),t(n)}}function or(e,t,n){return r;function r(r){return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),e.attempt(un,t,n)}}var sr={name:`htmlText`,tokenize:cr};function cr(e,t,n){let r=this,i,a,o;return s;function s(t){return e.enter(`htmlText`),e.enter(`htmlTextData`),e.consume(t),c}function c(t){return t===33?(e.consume(t),l):t===47?(e.consume(t),x):t===63?(e.consume(t),y):Pt(t)?(e.consume(t),ee):n(t)}function l(t){return t===45?(e.consume(t),u):t===91?(e.consume(t),a=0,m):Pt(t)?(e.consume(t),v):n(t)}function u(t){return t===45?(e.consume(t),p):n(t)}function d(t){return t===null?n(t):t===45?(e.consume(t),f):I(t)?(o=d,ie(t)):(e.consume(t),d)}function f(t){return t===45?(e.consume(t),p):d(t)}function p(e){return e===62?re(e):e===45?f(e):d(e)}function m(t){return t===`CDATA[`.charCodeAt(a++)?(e.consume(t),a===6?h:m):n(t)}function h(t){return t===null?n(t):t===93?(e.consume(t),g):I(t)?(o=h,ie(t)):(e.consume(t),h)}function g(t){return t===93?(e.consume(t),_):h(t)}function _(t){return t===62?re(t):t===93?(e.consume(t),_):h(t)}function v(t){return t===null||t===62?re(t):I(t)?(o=v,ie(t)):(e.consume(t),v)}function y(t){return t===null?n(t):t===63?(e.consume(t),b):I(t)?(o=y,ie(t)):(e.consume(t),y)}function b(e){return e===62?re(e):y(e)}function x(t){return Pt(t)?(e.consume(t),S):n(t)}function S(t){return t===45||Ft(t)?(e.consume(t),S):C(t)}function C(t){return I(t)?(o=C,ie(t)):L(t)?(e.consume(t),C):re(t)}function ee(t){return t===45||Ft(t)?(e.consume(t),ee):t===47||t===62||Vt(t)?w(t):n(t)}function w(t){return t===47?(e.consume(t),re):t===58||t===95||Pt(t)?(e.consume(t),T):I(t)?(o=w,ie(t)):L(t)?(e.consume(t),w):re(t)}function T(t){return t===45||t===46||t===58||t===95||Ft(t)?(e.consume(t),T):E(t)}function E(t){return t===61?(e.consume(t),D):I(t)?(o=E,ie(t)):L(t)?(e.consume(t),E):w(t)}function D(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),i=t,te):I(t)?(o=D,ie(t)):L(t)?(e.consume(t),D):(e.consume(t),ne)}function te(t){return t===i?(e.consume(t),i=void 0,O):t===null?n(t):I(t)?(o=te,ie(t)):(e.consume(t),te)}function ne(t){return t===null||t===34||t===39||t===60||t===61||t===96?n(t):t===47||t===62||Vt(t)?w(t):(e.consume(t),ne)}function O(e){return e===47||e===62||Vt(e)?w(e):n(e)}function re(r){return r===62?(e.consume(r),e.exit(`htmlTextData`),e.exit(`htmlText`),t):n(r)}function ie(t){return e.exit(`htmlTextData`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),k}function k(t){return L(t)?Kt(e,A,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):A(t)}function A(t){return e.enter(`htmlTextData`),o(t)}}var lr={name:`labelEnd`,resolveAll:pr,resolveTo:mr,tokenize:hr},ur={tokenize:gr},dr={tokenize:_r},fr={tokenize:vr};function pr(e){let t=-1,n=[];for(;++t<e.length;){let r=e[t][1];if(n.push(e[t]),r.type===`labelImage`||r.type===`labelLink`||r.type===`labelEnd`){let e=r.type===`labelImage`?4:2;r.type=`data`,t+=e}}return e.length!==n.length&&Et(e,0,e.length,n),e}function mr(e,t){let n=e.length,r=0,i,a,o;for(;n--;){let t=e[n][1];if(i){if(t.type===`link`||t.type===`labelLink`&&t._inactive)break;e[n][0]===`enter`&&t.type===`labelLink`&&(t._inactive=!0)}else if(a){if(e[n][0]===`enter`&&(t.type===`labelImage`||t.type===`labelLink`)&&!t._balanced&&(i=n,t.type!==`labelLink`)){r=2;break}}else t.type===`labelEnd`&&(a=n)}let s={type:e[i][1].type===`labelLink`?`link`:`image`,start:{...e[i][1].start},end:{...e[e.length-1][1].end}},c={type:`label`,start:{...e[i][1].start},end:{...e[a][1].end}},l={type:`labelText`,start:{...e[i+r+2][1].end},end:{...e[a-2][1].start}};return o=[[`enter`,s,t],[`enter`,c,t]],o=Dt(o,e.slice(i+1,i+r+3)),o=Dt(o,[[`enter`,l,t]]),o=Dt(o,nn(t.parser.constructs.insideSpan.null,e.slice(i+r+4,a-3),t)),o=Dt(o,[[`exit`,l,t],e[a-2],e[a-1],[`exit`,c,t]]),o=Dt(o,e.slice(a+1)),o=Dt(o,[[`exit`,s,t]]),Et(e,i,e.length,o),e}function hr(e,t,n){let r=this,i=r._labelStarts,a,o;if(i){for(;i.length>0&&i[i.length-1]._balanced;)i.pop();a=i[i.length-1]}return s;function s(t){return a?a._inactive?d(t):(o=r.parser.defined.includes(Nt(r.sliceSerialize({start:a.end,end:r.now()}))),e.enter(`labelEnd`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelEnd`),c):n(t)}function c(t){return t===40?e.attempt(ur,u,o?u:d)(t):t===91?e.attempt(dr,u,o?l:d)(t):o?u(t):d(t)}function l(t){return e.attempt(fr,u,d)(t)}function u(e){return i.pop(),t(e)}function d(e){return a._balanced=!0,n(e)}}function gr(e,t,n){return r;function r(t){return e.enter(`resource`),e.enter(`resourceMarker`),e.consume(t),e.exit(`resourceMarker`),i}function i(t){return Vt(t)?Wn(e,a)(t):a(t)}function a(t){return t===41?u(t):Vn(e,o,s,`resourceDestination`,`resourceDestinationLiteral`,`resourceDestinationLiteralMarker`,`resourceDestinationRaw`,`resourceDestinationString`,32)(t)}function o(t){return Vt(t)?Wn(e,c)(t):u(t)}function s(e){return n(e)}function c(t){return t===34||t===39||t===40?Un(e,l,n,`resourceTitle`,`resourceTitleMarker`,`resourceTitleString`)(t):u(t)}function l(t){return Vt(t)?Wn(e,u)(t):u(t)}function u(r){return r===41?(e.enter(`resourceMarker`),e.consume(r),e.exit(`resourceMarker`),e.exit(`resource`),t):n(r)}}function _r(e,t,n){let r=this;return i;function i(t){return Hn.call(r,e,a,o,`reference`,`referenceMarker`,`referenceString`)(t)}function a(e){return r.parser.defined.includes(Nt(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)))?t(e):n(e)}function o(e){return n(e)}}function vr(e,t,n){return r;function r(t){return e.enter(`reference`),e.enter(`referenceMarker`),e.consume(t),e.exit(`referenceMarker`),i}function i(r){return r===93?(e.enter(`referenceMarker`),e.consume(r),e.exit(`referenceMarker`),e.exit(`reference`),t):n(r)}}var yr={name:`labelStartImage`,resolveAll:lr.resolveAll,tokenize:br};function br(e,t,n){let r=this,i;return a;function a(t){return e.enter(`labelImage`),e.enter(`labelImageMarker`),e.consume(t),e.exit(`labelImageMarker`),o}function o(t){return t===91?(e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),i=e.exit(`labelImage`),s):n(t)}function s(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):(r._labelStarts=r._labelStarts||[],r._labelStarts.push(i),t(e))}}var xr={name:`labelStartLink`,resolveAll:lr.resolveAll,tokenize:Sr};function Sr(e,t,n){let r=this,i;return a;function a(t){return e.enter(`labelLink`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),i=e.exit(`labelLink`),o}function o(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):(r._labelStarts=r._labelStarts||[],r._labelStarts.push(i),t(e))}}var Cr={name:`lineEnding`,tokenize:wr};function wr(e,t){return n;function n(n){return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),Kt(e,t,`linePrefix`)}}var Tr={name:`thematicBreak`,tokenize:Er};function Er(e,t,n){let r=0,i;return a;function a(t){return e.enter(`thematicBreak`),o(t)}function o(e){return i=e,s(e)}function s(a){return a===i?(e.enter(`thematicBreakSequence`),c(a)):r>=3&&(a===null||I(a))?(e.exit(`thematicBreak`),t(a)):n(a)}function c(t){return t===i?(e.consume(t),r++,c):(e.exit(`thematicBreakSequence`),L(t)?Kt(e,s,`whitespace`)(t):s(t))}}var Dr={continuation:{tokenize:jr},exit:Nr,name:`list`,tokenize:Ar},Or={partial:!0,tokenize:Pr},kr={partial:!0,tokenize:Mr};function Ar(e,t,n){let r=this,i=r.events[r.events.length-1],a=i&&i[1].type===`linePrefix`?i[2].sliceSerialize(i[1],!0).length:0,o=0;return s;function s(t){let i=r.containerState.type||(t===42||t===43||t===45?`listUnordered`:`listOrdered`);if(i===`listUnordered`?!r.containerState.marker||t===r.containerState.marker:Rt(t)){if(r.containerState.type||(r.containerState.type=i,e.enter(i,{_container:!0})),i===`listUnordered`)return e.enter(`listItemPrefix`),t===42||t===45?e.check(Tr,n,l)(t):l(t);if(!r.interrupt||t===49)return e.enter(`listItemPrefix`),e.enter(`listItemValue`),c(t)}return n(t)}function c(t){return Rt(t)&&++o<10?(e.consume(t),c):(!r.interrupt||o<2)&&(r.containerState.marker?t===r.containerState.marker:t===41||t===46)?(e.exit(`listItemValue`),l(t)):n(t)}function l(t){return e.enter(`listItemMarker`),e.consume(t),e.exit(`listItemMarker`),r.containerState.marker=r.containerState.marker||t,e.check(un,r.interrupt?n:u,e.attempt(Or,f,d))}function u(e){return r.containerState.initialBlankLine=!0,a++,f(e)}function d(t){return L(t)?(e.enter(`listItemPrefixWhitespace`),e.consume(t),e.exit(`listItemPrefixWhitespace`),f):n(t)}function f(n){return r.containerState.size=a+r.sliceSerialize(e.exit(`listItemPrefix`),!0).length,t(n)}}function jr(e,t,n){let r=this;return r.containerState._closeFlow=void 0,e.check(un,i,a);function i(n){return r.containerState.furtherBlankLines=r.containerState.furtherBlankLines||r.containerState.initialBlankLine,Kt(e,t,`listItemIndent`,r.containerState.size+1)(n)}function a(n){return r.containerState.furtherBlankLines||!L(n)?(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,o(n)):(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,e.attempt(kr,t,o)(n))}function o(i){return r.containerState._closeFlow=!0,r.interrupt=void 0,Kt(e,e.attempt(Dr,t,n),`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(i)}}function Mr(e,t,n){let r=this;return Kt(e,i,`listItemIndent`,r.containerState.size+1);function i(e){let i=r.events[r.events.length-1];return i&&i[1].type===`listItemIndent`&&i[2].sliceSerialize(i[1],!0).length===r.containerState.size?t(e):n(e)}}function Nr(e){e.exit(this.containerState.type)}function Pr(e,t,n){let r=this;return Kt(e,i,`listItemPrefixWhitespace`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:5);function i(e){let i=r.events[r.events.length-1];return!L(e)&&i&&i[1].type===`listItemPrefixWhitespace`?t(e):n(e)}}var Fr={name:`setextUnderline`,resolveTo:Ir,tokenize:Lr};function Ir(e,t){let n=new Yt,r=e.length,i,a,o;for(;r--;)if(e[r][0]===`enter`){if(e[r][1].type===`content`){i=r;break}e[r][1].type===`paragraph`&&(a=r)}else e[r][1].type===`content`&&n.add(r,1,[]),!o&&e[r][1].type===`definition`&&(o=r);let s={type:`setextHeading`,start:{...e[i][1].start},end:{...e[e.length-1][1].end}};return e[a][1].type=`setextHeadingText`,o?(n.add(a,0,[[`enter`,s,t]]),n.add(o+1,0,[[`exit`,e[i][1],t]]),e[i][1].end={...e[o][1].end}):e[i][1]=s,n.add(e.length,0,[[`exit`,s,t]]),n.consume(e),e}function Lr(e,t,n){let r=this,i;return a;function a(t){let a=r.events.length,s;for(;a--;)if(r.events[a][1].type!==`lineEnding`&&r.events[a][1].type!==`linePrefix`&&r.events[a][1].type!==`content`){s=r.events[a][1].type===`paragraph`;break}return!r.parser.lazy[r.now().line]&&(r.interrupt||s)?(e.enter(`setextHeadingLine`),i=t,o(t)):n(t)}function o(t){return e.enter(`setextHeadingLineSequence`),s(t)}function s(t){return t===i?(e.consume(t),s):(e.exit(`setextHeadingLineSequence`),L(t)?Kt(e,c,`lineSuffix`)(t):c(t))}function c(r){return r===null||I(r)?(e.exit(`setextHeadingLine`),t(r)):n(r)}}var Rr={tokenize:zr};function zr(e){let t=this,n=e.attempt(un,r,e.attempt(this.parser.constructs.flowInitial,i,Kt(e,e.attempt(this.parser.constructs.flow,i,e.attempt(In,i)),`linePrefix`)));return n;function r(r){if(r===null){e.consume(r);return}return e.enter(`lineEndingBlank`),e.consume(r),e.exit(`lineEndingBlank`),t.currentConstruct=void 0,n}function i(r){if(r===null){e.consume(r);return}return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),t.currentConstruct=void 0,n}}var Br={resolveAll:Wr()},Vr=Ur(`string`),Hr=Ur(`text`);function Ur(e){return{resolveAll:Wr(e===`text`?Gr:void 0),tokenize:t};function t(t){let n=this,r=this.parser.constructs[e],i=t.attempt(r,a,o);return a;function a(e){return c(e)?i(e):o(e)}function o(e){if(e===null){t.consume(e);return}return t.enter(`data`),t.consume(e),s}function s(e){return c(e)?(t.exit(`data`),i(e)):(t.consume(e),s)}function c(e){if(e===null)return!0;let t=r[e],i=-1;if(t)for(;++i<t.length;){let e=t[i];if(!e.previous||e.previous.call(n,n.previous))return!0}return!1}}}function Wr(e){return t;function t(t,n){let r=-1,i;for(;++r<=t.length;)i===void 0?t[r]&&t[r][1].type===`data`&&(i=r,r++):(!t[r]||t[r][1].type!==`data`)&&(r!==i+2&&(t[i][1].end=t[r-1][1].end,t.splice(i+2,r-i-2),r=i+2),i=void 0);return e?e(t,n):t}}function Gr(e,t){let n=new Yt,r=0;for(;++r<=e.length;)if((r===e.length||e[r][1].type===`lineEnding`)&&e[r-1][1].type===`data`){let i=e[r-1][1],a=t.sliceStream(i),o=a.length,s=-1,c=0,l;for(;o--;){let e=a[o];if(typeof e==`string`){for(s=e.length;e.charCodeAt(s-1)===32;)c++,s--;if(s)break;s=-1}else if(e===-2)l=!0,c++;else if(e!==-1){o++;break}}if(t._contentTypeTextTrailing&&r===e.length&&(c=0),c){let a={type:r===e.length||l||c<2?`lineSuffix`:`hardBreakTrailing`,start:{_bufferIndex:o?s:i.start._bufferIndex+s,_index:i.start._index+o,line:i.end.line,column:i.end.column-c,offset:i.end.offset-c},end:{...i.end}};i.end={...a.start},i.start.offset===i.end.offset?Object.assign(i,a):n.add(r,0,[[`enter`,a,t],[`exit`,a,t]])}r++}return n.consume(e),e}var Kr=s({attentionMarkers:()=>ei,contentInitial:()=>Jr,disable:()=>ti,document:()=>qr,flow:()=>Xr,flowInitial:()=>Yr,insideSpan:()=>$r,string:()=>Zr,text:()=>Qr}),qr={42:Dr,43:Dr,45:Dr,48:Dr,49:Dr,50:Dr,51:Dr,52:Dr,53:Dr,54:Dr,55:Dr,56:Dr,57:Dr,62:fn},Jr={91:Gn},Yr={[-2]:wn,[-1]:wn,32:wn},Xr={35:Zn,42:Tr,45:[Fr,Tr],60:nr,61:Fr,95:Tr,96:Sn,126:Sn},Zr={38:vn,92:gn},Qr={[-5]:Cr,[-4]:Cr,[-3]:Cr,33:yr,38:vn,42:rn,60:[cn,sr],91:xr,92:[Yn,gn],93:lr,95:rn,96:On},$r={null:[rn,Br]},ei={null:[42,95]},ti={null:[]};function ni(e,t,n){let r={_bufferIndex:-1,_index:0,line:n&&n.line||1,column:n&&n.column||1,offset:n&&n.offset||0},i={},a=[],o=[],s=[],c={attempt:C(x),check:C(S),consume:v,enter:y,exit:b,interrupt:C(S,{interrupt:!0})},l={code:null,containerState:{},defineSkip:h,events:[],now:m,parser:e,previous:null,sliceSerialize:f,sliceStream:p,write:d},u=t.tokenize.call(l,c);return t.resolveAll&&a.push(t),l;function d(e){return o=Dt(o,e),g(),o[o.length-1]===null?(ee(t,0),l.events=nn(a,l.events,l),l.events):[]}function f(e,t){return ii(p(e),t)}function p(e){return ri(o,e)}function m(){let{_bufferIndex:e,_index:t,line:n,column:i,offset:a}=r;return{_bufferIndex:e,_index:t,line:n,column:i,offset:a}}function h(e){i[e.line]=e.column,T()}function g(){for(;r._index<o.length;){let e=o[r._index];if(typeof e==`string`){let t=r._index;for(r._bufferIndex<0&&(r._bufferIndex=0);r._index===t&&r._bufferIndex<e.length;)_(e.charCodeAt(r._bufferIndex))}else _(e)}}function _(e){u=u(e)}function v(e){I(e)?(r.line++,r.column=1,r.offset+=e===-3?2:1,T()):e!==-1&&(r.column++,r.offset++),r._bufferIndex<0?r._index++:(r._bufferIndex++,r._bufferIndex===o[r._index].length&&(r._bufferIndex=-1,r._index++)),l.previous=e}function y(e,t){let n=t||{};return n.type=e,n.start=m(),l.events.push([`enter`,n,l]),s.push(n),n}function b(e){let t=s.pop();return t.end=m(),l.events.push([`exit`,t,l]),t}function x(e,t){ee(e,t.from)}function S(e,t){t.restore()}function C(e,t){return n;function n(n,r,i){let a,o,s,u;return Array.isArray(n)?f(n):`tokenize`in n?f([n]):d(n);function d(e){return t;function t(t){let n=t!==null&&e[t],r=t!==null&&e.null;return f([...Array.isArray(n)?n:n?[n]:[],...Array.isArray(r)?r:r?[r]:[]])(t)}}function f(e){return a=e,o=0,e.length===0?i:p(e[o])}function p(e){return n;function n(n){return u=w(),s=e,e.partial||(l.currentConstruct=e),e.name&&l.parser.constructs.disable.null.includes(e.name)?h(n):e.tokenize.call(t?Object.assign(Object.create(l),t):l,c,m,h)(n)}}function m(t){return e(s,u),r}function h(e){return u.restore(),++o<a.length?p(a[o]):i}}}function ee(e,t){e.resolveAll&&!a.includes(e)&&a.push(e),e.resolve&&Et(l.events,t,l.events.length-t,e.resolve(l.events.slice(t),l)),e.resolveTo&&(l.events=e.resolveTo(l.events,l))}function w(){let e=m(),t=l.previous,n=l.currentConstruct,i=l.events.length,a=Array.from(s);return{from:i,restore:o};function o(){r=e,l.previous=t,l.currentConstruct=n,l.events.length=i,s=a,T()}}function T(){r.line in i&&r.column<2&&(r.column=i[r.line],r.offset+=i[r.line]-1)}}function ri(e,t){let n=t.start._index,r=t.start._bufferIndex,i=t.end._index,a=t.end._bufferIndex,o;if(n===i)o=[e[n].slice(r,a)];else{if(o=e.slice(n,i),r>-1){let e=o[0];typeof e==`string`?o[0]=e.slice(r):o.shift()}a>0&&o.push(e[i].slice(0,a))}return o}function ii(e,t){let n=-1,r=[],i;for(;++n<e.length;){let a=e[n],o;if(typeof a==`string`)o=a;else switch(a){case-5:o=`\r`;break;case-4:o=`
`;break;case-3:o=`\r
`;break;case-2:o=t?` `:`	`;break;case-1:if(!t&&i)continue;o=` `;break;default:o=String.fromCharCode(a)}i=a===-2,r.push(o)}return r.join(``)}function ai(e){let t={constructs:kt([Kr,...(e||{}).extensions||[]]),content:n(qt),defined:[],document:n(Zt),flow:n(Rr),lazy:{},string:n(Vr),text:n(Hr)};return t;function n(e){return n;function n(n){return ni(t,e,n)}}}function oi(e){for(;!Pn(e););return e}var si=/[\0\t\n\r]/g;function ci(){let e=1,t=``,n=!0,r;return i;function i(i,a,o){i=t+(typeof i==`string`?i.toString():new TextDecoder(a||void 0).decode(i));let s=[],c=0;for(t=``,n&&=(i.charCodeAt(0)===65279&&c++,void 0);c<i.length;){si.lastIndex=c;let n=si.exec(i),a=n&&n.index!==void 0?n.index:i.length,o=i.charCodeAt(a);if(!n){t=i.slice(c);break}if(o===10&&c===a&&r)s.push(-3),r=void 0;else switch(r&&=(s.push(-5),void 0),c<a&&(s.push(i.slice(c,a)),e+=a-c),o){case 0:s.push(65533),e++;break;case 9:{let t=Math.ceil(e/4)*4;for(s.push(-2);e++<t;)s.push(-1);break}case 10:s.push(-4),e=1;break;default:r=!0,e=1}c=a+1}return o&&(r&&s.push(-5),t&&s.push(t),s.push(null)),s}}var li=/\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;function ui(e){return e.replace(li,di)}function di(e,t,n){if(t)return t;if(n.charCodeAt(0)===35){let e=n.charCodeAt(1),t=e===120||e===88;return Mt(n.slice(t?2:1),t?16:10)}return Tt(n)||e}var fi={}.hasOwnProperty;function pi(e,t,n){return t&&typeof t==`object`&&(n=t,t=void 0),mi(n)(oi(ai(n).document().write(ci()(e,t,!0))))}function mi(e){let t={afterExit:[],beforeEnter:[],transforms:[],canContainEols:[`emphasis`,`fragment`,`heading`,`paragraph`,`strong`],enter:{autolink:o(xe),autolinkProtocol:T,autolinkEmail:T,atxHeading:o(P),blockQuote:o(me),characterEscape:T,characterReference:T,codeFenced:o(he),codeFencedFenceInfo:s,codeFencedFenceMeta:s,codeIndented:o(he,s),codeText:o(ge,s),codeTextData:T,data:T,codeFlowValue:T,definition:o(_e),definitionDestinationString:s,definitionLabelString:s,definitionTitleString:s,emphasis:o(N),hardBreakEscape:o(ve),hardBreakTrailing:o(ve),htmlFlow:o(ye,s),htmlFlowData:T,htmlText:o(ye,s),htmlTextData:T,image:o(be),label:s,link:o(xe),listItem:o(F),listItemValue:p,listOrdered:o(Se,f),listUnordered:o(Se),paragraph:o(Ce),reference:se,referenceString:s,resourceDestinationString:s,resourceTitleString:s,setextHeading:o(P),strong:o(we),thematicBreak:o(Ee)},exit:{atxHeading:l(),atxHeadingSequence:S,autolink:l(),autolinkEmail:pe,autolinkProtocol:fe,blockQuote:l(),characterEscapeValue:E,characterReferenceMarkerHexadecimal:le,characterReferenceMarkerNumeric:le,characterReferenceValue:ue,characterReference:de,codeFenced:l(_),codeFencedFence:g,codeFencedFenceInfo:m,codeFencedFenceMeta:h,codeFlowValue:E,codeIndented:l(v),codeText:l(re),codeTextData:E,data:E,definition:l(),definitionDestinationString:x,definitionLabelString:y,definitionTitleString:b,emphasis:l(),hardBreakEscape:l(te),hardBreakTrailing:l(te),htmlFlow:l(ne),htmlFlowData:E,htmlText:l(O),htmlTextData:E,image:l(k),label:ae,labelText:A,lineEnding:D,link:l(ie),listItem:l(),listOrdered:l(),listUnordered:l(),paragraph:l(),referenceString:ce,resourceDestinationString:j,resourceTitleString:M,resource:oe,setextHeading:l(w),setextHeadingLineSequence:ee,setextHeadingText:C,strong:l(),thematicBreak:l()}};gi(t,(e||{}).mdastExtensions||[]);let n={};return r;function r(e){let r={type:`root`,children:[],position:void 0},o={stack:[r],tokenStack:[],config:t,enter:c,exit:u,buffer:s,resume:d,data:n},l=[],f=[],p=-1;for(;++p<e.length;)f.push(e[p]),(e[p][1].type===`listOrdered`||e[p][1].type===`listUnordered`)&&(e[p][0]===`enter`?l.push(f.length-1):a(f,l.pop()));for(e=f,p=-1;++p<e.length;){let n=t[e[p][0]];e[p][0]===`enter`&&t.beforeEnter.length>0&&i(t.beforeEnter,{...o,sliceSerialize:e[p][2].sliceSerialize},e[p][1]),fi.call(n,e[p][1].type)&&n[e[p][1].type].call({...o,sliceSerialize:e[p][2].sliceSerialize},e[p][1]),e[p][0]===`exit`&&t.afterExit.length>0&&i(t.afterExit,{...o,sliceSerialize:e[p][2].sliceSerialize},e[p][1])}if(o.tokenStack.length>0){let e=o.tokenStack[o.tokenStack.length-1];(e[1]||vi).call(o,void 0,e[0])}for(r.position={start:hi(e.length>0?e[0][1].start:{line:1,column:1,offset:0}),end:hi(e.length>0?e[e.length-2][1].end:{line:1,column:1,offset:0})},p=-1;++p<t.transforms.length;)r=t.transforms[p](r)||r;return r}function i(e,t,n){let r=-1;for(;++r<e.length;)e[r].call(t,n)}function a(e,t){let n=e.length-1,r=t-1,i=-1,a=!1,o,s,c,l,u=[];for(;++r<=n;){let t=e[r];switch(t[1].type){case`listUnordered`:case`listOrdered`:case`blockQuote`:t[0]===`enter`?i++:i--,l=void 0;break;case`lineEndingBlank`:t[0]===`enter`&&(o&&!l&&!i&&!c&&(c=r),l=void 0);break;case`linePrefix`:case`listItemValue`:case`listItemMarker`:case`listItemPrefix`:case`listItemPrefixWhitespace`:break;default:l=void 0}if(!i&&t[0]===`enter`&&t[1].type===`listItemPrefix`||i===-1&&t[0]===`exit`&&(t[1].type===`listUnordered`||t[1].type===`listOrdered`)){if(o){let n=r;for(s=void 0;n--;){let t=e[n];if(t[1].type===`lineEnding`||t[1].type===`lineEndingBlank`){if(t[0]===`exit`)continue;s&&(e[s][1].type=`lineEndingBlank`,a=!0),t[1].type=`lineEnding`,s=n}else if(t[1].type!==`linePrefix`&&t[1].type!==`blockQuotePrefix`&&t[1].type!==`blockQuotePrefixWhitespace`&&t[1].type!==`blockQuoteMarker`&&t[1].type!==`listItemIndent`)break}c&&(!s||c<s)&&(o._spread=!0),o.end=Object.assign({},s?e[s][1].start:t[1].end),u.push({at:s||r,event:[`exit`,o,t[2]]})}if(t[1].type===`listItemPrefix`){let e={type:`listItem`,_spread:!1,start:Object.assign({},t[1].start),end:void 0};o=e,u.push({at:r,event:[`enter`,e,t[2]]}),c=void 0,l=!0}}}let d=e.splice(t),f=0;for(r=-1;++r<d.length;){for(;f<u.length&&u[f].at===t+r;)e.push(u[f++].event);e.push(d[r])}e[t][1]._spread=a}function o(e,t){return n;function n(n){c.call(this,e(n),n),t&&t.call(this,n)}}function s(){this.stack.push({type:`fragment`,children:[]})}function c(e,t,n){this.stack[this.stack.length-1].children.push(e),this.stack.push(e),this.tokenStack.push([t,n||void 0]),e.position={start:hi(t.start),end:void 0}}function l(e){return t;function t(t){e&&e.call(this,t),u.call(this,t)}}function u(e,t){let n=this.stack.pop(),r=this.tokenStack.pop();if(!r)throw Error("Cannot close `"+e.type+"` ("+Ie({start:e.start,end:e.end})+`): it’s not open`);r[0].type!==e.type&&(t?t.call(this,e,r[0]):(r[1]||vi).call(this,e,r[0])),n.position.end=hi(e.end)}function d(){return bt(this.stack.pop())}function f(){this.data.expectingFirstListItemValue=!0}function p(e){if(this.data.expectingFirstListItemValue){let t=this.stack[this.stack.length-2];t.start=Number.parseInt(this.sliceSerialize(e),10),this.data.expectingFirstListItemValue=void 0}}function m(){let e=this.resume(),t=this.stack[this.stack.length-1];t.lang=e}function h(){let e=this.resume(),t=this.stack[this.stack.length-1];t.meta=e}function g(){this.data.flowCodeInside||(this.buffer(),this.data.flowCodeInside=!0)}function _(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,``),this.data.flowCodeInside=void 0}function v(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e.replace(/(\r?\n|\r)$/g,``)}function y(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=Nt(this.sliceSerialize(e)).toLowerCase()}function b(){let e=this.resume(),t=this.stack[this.stack.length-1];t.title=e}function x(){let e=this.resume(),t=this.stack[this.stack.length-1];t.url=e}function S(e){let t=this.stack[this.stack.length-1];t.depth||=this.sliceSerialize(e).length}function C(){this.data.setextHeadingSlurpLineEnding=!0}function ee(e){let t=this.stack[this.stack.length-1];t.depth=this.sliceSerialize(e).codePointAt(0)===61?1:2}function w(){this.data.setextHeadingSlurpLineEnding=void 0}function T(e){let t=this.stack[this.stack.length-1].children,n=t[t.length-1];(!n||n.type!==`text`)&&(n=Te(),n.position={start:hi(e.start),end:void 0},t.push(n)),this.stack.push(n)}function E(e){let t=this.stack.pop();t.value+=this.sliceSerialize(e),t.position.end=hi(e.end)}function D(e){let n=this.stack[this.stack.length-1];if(this.data.atHardBreak){let t=n.children[n.children.length-1];t.position.end=hi(e.end),this.data.atHardBreak=void 0;return}!this.data.setextHeadingSlurpLineEnding&&t.canContainEols.includes(n.type)&&(T.call(this,e),E.call(this,e))}function te(){this.data.atHardBreak=!0}function ne(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function O(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function re(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function ie(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||`shortcut`;e.type+=`Reference`,e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}function k(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||`shortcut`;e.type+=`Reference`,e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}function A(e){let t=this.sliceSerialize(e),n=this.stack[this.stack.length-2];n.label=ui(t),n.identifier=Nt(t).toLowerCase()}function ae(){let e=this.stack[this.stack.length-1],t=this.resume(),n=this.stack[this.stack.length-1];this.data.inReference=!0,n.type===`link`?n.children=e.children:n.alt=t}function j(){let e=this.resume(),t=this.stack[this.stack.length-1];t.url=e}function M(){let e=this.resume(),t=this.stack[this.stack.length-1];t.title=e}function oe(){this.data.inReference=void 0}function se(){this.data.referenceType=`collapsed`}function ce(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=Nt(this.sliceSerialize(e)).toLowerCase(),this.data.referenceType=`full`}function le(e){this.data.characterReferenceType=e.type}function ue(e){let t=this.sliceSerialize(e),n=this.data.characterReferenceType,r;n?(r=Mt(t,n===`characterReferenceMarkerNumeric`?10:16),this.data.characterReferenceType=void 0):r=Tt(t);let i=this.stack[this.stack.length-1];i.value+=r}function de(e){let t=this.stack.pop();t.position.end=hi(e.end)}function fe(e){E.call(this,e);let t=this.stack[this.stack.length-1];t.url=this.sliceSerialize(e)}function pe(e){E.call(this,e);let t=this.stack[this.stack.length-1];t.url=`mailto:`+this.sliceSerialize(e)}function me(){return{type:`blockquote`,children:[],position:void 0}}function he(){return{type:`code`,lang:null,meta:null,value:``,position:void 0}}function ge(){return{type:`inlineCode`,value:``,position:void 0}}function _e(){return{type:`definition`,identifier:``,label:null,title:null,url:``,position:void 0}}function N(){return{type:`emphasis`,children:[],position:void 0}}function P(){return{type:`heading`,depth:0,children:[],position:void 0}}function ve(){return{type:`break`,position:void 0}}function ye(){return{type:`html`,value:``,position:void 0}}function be(){return{type:`image`,title:null,url:``,alt:null,position:void 0}}function xe(){return{type:`link`,title:null,url:``,children:[],position:void 0}}function Se(e){return{type:`list`,ordered:e.type===`listOrdered`,start:null,spread:e._spread,children:[],position:void 0}}function F(e){return{type:`listItem`,spread:e._spread,checked:null,children:[],position:void 0}}function Ce(){return{type:`paragraph`,children:[],position:void 0}}function we(){return{type:`strong`,children:[],position:void 0}}function Te(){return{type:`text`,value:``,position:void 0}}function Ee(){return{type:`thematicBreak`,position:void 0}}}function hi(e){return{line:e.line,column:e.column,offset:e.offset}}function gi(e,t){let n=-1;for(;++n<t.length;){let r=t[n];Array.isArray(r)?gi(e,r):_i(e,r)}}function _i(e,t){let n;for(n in t)if(fi.call(t,n))switch(n){case`canContainEols`:{let r=t[n];r&&e[n].push(...r);break}case`transforms`:{let r=t[n];r&&e[n].push(...r);break}case`afterExit`:case`beforeEnter`:{let r=t[n];r&&e[n].push(r);break}case`enter`:case`exit`:{let r=t[n];r&&Object.assign(e[n],r);break}}}function vi(e,t){throw Error(e?"Cannot close `"+e.type+"` ("+Ie({start:e.start,end:e.end})+"): a different token (`"+t.type+"`, "+Ie({start:t.start,end:t.end})+`) is open`:"Cannot close document, a token (`"+t.type+"`, "+Ie({start:t.start,end:t.end})+`) is still open`)}function yi(e){let t=this;t.parser=n;function n(n){return pi(n,{...t.data(`settings`),...e,extensions:t.data(`micromarkExtensions`)||[],mdastExtensions:t.data(`fromMarkdownExtensions`)||[]})}}function bi(e,t){let n={type:`element`,tagName:`blockquote`,properties:{},children:e.wrap(e.all(t),!0)};return e.patch(t,n),e.applyData(t,n)}function xi(e,t){let n={type:`element`,tagName:`br`,properties:{},children:[]};return e.patch(t,n),[e.applyData(t,n),{type:`text`,value:`
`}]}function Si(e,t){let n=t.value?t.value+`
`:``,r={},i=t.lang?t.lang.split(/\s+/):[];i.length>0&&(r.className=[`language-`+i[0]]);let a={type:`element`,tagName:`code`,properties:r,children:[{type:`text`,value:n}]};return t.meta&&(a.data={meta:t.meta}),e.patch(t,a),a=e.applyData(t,a),a={type:`element`,tagName:`pre`,properties:{},children:[a]},e.patch(t,a),a}function Ci(e,t){let n={type:`element`,tagName:`del`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function wi(e,t){let n={type:`element`,tagName:`em`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Ti(e,t){let n=typeof e.options.clobberPrefix==`string`?e.options.clobberPrefix:`user-content-`,r=String(t.identifier).toUpperCase(),i=Gt(r.toLowerCase()),a=e.footnoteOrder.indexOf(r),o,s=e.footnoteCounts.get(r);s===void 0?(s=0,e.footnoteOrder.push(r),o=e.footnoteOrder.length):o=a+1,s+=1,e.footnoteCounts.set(r,s);let c={type:`element`,tagName:`a`,properties:{href:`#`+n+`fn-`+i,id:n+`fnref-`+i+(s>1?`-`+s:``),dataFootnoteRef:!0,ariaDescribedBy:[`footnote-label`]},children:[{type:`text`,value:String(o)}]};e.patch(t,c);let l={type:`element`,tagName:`sup`,properties:{},children:[c]};return e.patch(t,l),e.applyData(t,l)}function Ei(e,t){let n={type:`element`,tagName:`h`+t.depth,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Di(e,t){if(e.options.allowDangerousHtml){let n={type:`raw`,value:t.value};return e.patch(t,n),e.applyData(t,n)}}function Oi(e,t){let n=t.referenceType,r=`]`;if(n===`collapsed`?r+=`[]`:n===`full`&&(r+=`[`+(t.label||t.identifier)+`]`),t.type===`imageReference`)return[{type:`text`,value:`![`+t.alt+r}];let i=e.all(t),a=i[0];a&&a.type===`text`?a.value=`[`+a.value:i.unshift({type:`text`,value:`[`});let o=i[i.length-1];return o&&o.type===`text`?o.value+=r:i.push({type:`text`,value:r}),i}function ki(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return Oi(e,t);let i={src:Gt(r.url||``),alt:t.alt};r.title!==null&&r.title!==void 0&&(i.title=r.title);let a={type:`element`,tagName:`img`,properties:i,children:[]};return e.patch(t,a),e.applyData(t,a)}function Ai(e,t){let n={src:Gt(t.url)};t.alt!==null&&t.alt!==void 0&&(n.alt=t.alt),t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:`element`,tagName:`img`,properties:n,children:[]};return e.patch(t,r),e.applyData(t,r)}function ji(e,t){let n={type:`text`,value:t.value.replace(/\r?\n|\r/g,` `)};e.patch(t,n);let r={type:`element`,tagName:`code`,properties:{},children:[n]};return e.patch(t,r),e.applyData(t,r)}function Mi(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return Oi(e,t);let i={href:Gt(r.url||``)};r.title!==null&&r.title!==void 0&&(i.title=r.title);let a={type:`element`,tagName:`a`,properties:i,children:e.all(t)};return e.patch(t,a),e.applyData(t,a)}function Ni(e,t){let n={href:Gt(t.url)};t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:`element`,tagName:`a`,properties:n,children:e.all(t)};return e.patch(t,r),e.applyData(t,r)}function Pi(e,t,n){let r=e.all(t),i=n?Fi(n):Ii(t),a={},o=[];if(typeof t.checked==`boolean`){let e=r[0],n;e&&e.type===`element`&&e.tagName===`p`?n=e:(n={type:`element`,tagName:`p`,properties:{},children:[]},r.unshift(n)),n.children.length>0&&n.children.unshift({type:`text`,value:` `}),n.children.unshift({type:`element`,tagName:`input`,properties:{type:`checkbox`,checked:t.checked,disabled:!0},children:[]}),a.className=[`task-list-item`]}let s=-1;for(;++s<r.length;){let e=r[s];(i||s!==0||e.type!==`element`||e.tagName!==`p`)&&o.push({type:`text`,value:`
`}),e.type===`element`&&e.tagName===`p`&&!i?o.push(...e.children):o.push(e)}let c=r[r.length-1];c&&(i||c.type!==`element`||c.tagName!==`p`)&&o.push({type:`text`,value:`
`});let l={type:`element`,tagName:`li`,properties:a,children:o};return e.patch(t,l),e.applyData(t,l)}function Fi(e){let t=!1;if(e.type===`list`){t=e.spread||!1;let n=e.children,r=-1;for(;!t&&++r<n.length;)t=Ii(n[r])}return t}function Ii(e){return e.spread??e.children.length>1}function Li(e,t){let n={},r=e.all(t),i=-1;for(typeof t.start==`number`&&t.start!==1&&(n.start=t.start);++i<r.length;){let e=r[i];if(e.type===`element`&&e.tagName===`li`&&e.properties&&Array.isArray(e.properties.className)&&e.properties.className.includes(`task-list-item`)){n.className=[`contains-task-list`];break}}let a={type:`element`,tagName:t.ordered?`ol`:`ul`,properties:n,children:e.wrap(r,!0)};return e.patch(t,a),e.applyData(t,a)}function Ri(e,t){let n={type:`element`,tagName:`p`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function zi(e,t){let n={type:`root`,children:e.wrap(e.all(t))};return e.patch(t,n),e.applyData(t,n)}function Bi(e,t){let n={type:`element`,tagName:`strong`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Vi(e,t){let n=e.all(t),r=n.shift(),i=[];if(r){let n={type:`element`,tagName:`thead`,properties:{},children:e.wrap([r],!0)};e.patch(t.children[0],n),i.push(n)}if(n.length>0){let r={type:`element`,tagName:`tbody`,properties:{},children:e.wrap(n,!0)},a=Ne(t.children[1]),o=Me(t.children[t.children.length-1]);a&&o&&(r.position={start:a,end:o}),i.push(r)}let a={type:`element`,tagName:`table`,properties:{},children:e.wrap(i,!0)};return e.patch(t,a),e.applyData(t,a)}function Hi(e,t,n){let r=n?n.children:void 0,i=(r?r.indexOf(t):1)===0?`th`:`td`,a=n&&n.type===`table`?n.align:void 0,o=a?a.length:t.children.length,s=-1,c=[];for(;++s<o;){let n=t.children[s],r={},o=a?a[s]:void 0;o&&(r.align=o);let l={type:`element`,tagName:i,properties:r,children:[]};n&&(l.children=e.all(n),e.patch(n,l),l=e.applyData(n,l)),c.push(l)}let l={type:`element`,tagName:`tr`,properties:{},children:e.wrap(c,!0)};return e.patch(t,l),e.applyData(t,l)}function Ui(e,t){let n={type:`element`,tagName:`td`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}var Wi=9,Gi=32;function Ki(e){let t=String(e),n=/\r?\n|\r/g,r=n.exec(t),i=0,a=[];for(;r;)a.push(qi(t.slice(i,r.index),i>0,!0),r[0]),i=r.index+r[0].length,r=n.exec(t);return a.push(qi(t.slice(i),i>0,!1)),a.join(``)}function qi(e,t,n){let r=0,i=e.length;if(t){let t=e.codePointAt(r);for(;t===Wi||t===Gi;)r++,t=e.codePointAt(r)}if(n){let t=e.codePointAt(i-1);for(;t===Wi||t===Gi;)i--,t=e.codePointAt(i-1)}return i>r?e.slice(r,i):``}function Ji(e,t){let n={type:`text`,value:Ki(String(t.value))};return e.patch(t,n),e.applyData(t,n)}function Yi(e,t){let n={type:`element`,tagName:`hr`,properties:{},children:[]};return e.patch(t,n),e.applyData(t,n)}var Xi={blockquote:bi,break:xi,code:Si,delete:Ci,emphasis:wi,footnoteReference:Ti,heading:Ei,html:Di,imageReference:ki,image:Ai,inlineCode:ji,linkReference:Mi,link:Ni,listItem:Pi,list:Li,paragraph:Ri,root:zi,strong:Bi,table:Vi,tableCell:Ui,tableRow:Hi,text:Ji,thematicBreak:Yi,toml:Zi,yaml:Zi,definition:Zi,footnoteDefinition:Zi};function Zi(){}var{defineProperty:Qi}=Object,$i=typeof self==`object`?self:globalThis,ea=(e,t)=>{switch(e){case`Function`:case`SharedWorker`:case`Worker`:case`eval`:case`setInterval`:case`setTimeout`:throw TypeError(`unable to deserialize `+e)}return new $i[e](t)},ta=(e,t)=>{let n=(t,n)=>(e.set(n,t),t),r=i=>{if(e.has(i))return e.get(i);let[a,o]=t[i];switch(a){case 0:case-1:return n(o,i);case 1:{let e=n([],i);for(let t of o)e.push(r(t));return e}case 2:{let e=n({},i);for(let[t,n]of o){let i=r(t),a=r(n);i===`__proto__`?Qi(e,i,{value:a,configurable:!0,enumerable:!0,writable:!0}):e[i]=a}return e}case 3:return n(new Date(o),i);case 4:{let{source:e,flags:t}=o;return n(new RegExp(e,t),i)}case 5:{let e=n(new Map,i);for(let[t,n]of o)e.set(r(t),r(n));return e}case 6:{let e=n(new Set,i);for(let t of o)e.add(r(t));return e}case 7:{let{name:e,message:t}=o;return n(typeof $i[e]==`function`?ea(e,t):Error(t),i)}case 8:return n(BigInt(o),i);case`BigInt`:return n(Object(BigInt(o)),i);case`ArrayBuffer`:return n(new Uint8Array(o).buffer,o);case`DataView`:{let{buffer:e}=new Uint8Array(o);return n(new DataView(e),o)}case`-0`:return-0}return n(ea(a,o),i)};return r},na=e=>ta(new Map,e)(0),ra=``,{toString:ia}={},{keys:z,is:B}=Object,aa=e=>{let t=typeof e;if(t!==`object`||!e)return[0,t];let n=ia.call(e).slice(8,-1);switch(n){case`Array`:return[1,ra];case`Object`:return[2,ra];case`Date`:return[3,ra];case`RegExp`:return[4,ra];case`Map`:return[5,ra];case`Set`:return[6,ra];case`DataView`:return[1,n]}return n.includes(`Array`)?[1,n]:e instanceof Error?[7,e.name||`Error`]:[2,n]},oa=([e,t])=>e===0&&(t===`function`||t===`symbol`),sa=(e,t,n,r)=>{let i=(e,t)=>{let i=r.push(e)-1;return n.set(t,i),i},a=o=>{if(n.has(o))return n.get(o);let[s,c]=aa(o);switch(s){case 0:{let t=o;switch(c){case`bigint`:s=8,t=o.toString();break;case`number`:if(!o&&B(o,-0))return r.push([`-0`])-1;break;case`function`:case`symbol`:if(e)throw TypeError(`unable to serialize `+c);t=null;break;case`undefined`:return i([-1],o)}return i([s,t],o)}case 1:{if(c){let e=o;return c===`DataView`?e=new Uint8Array(o.buffer):c===`ArrayBuffer`&&(e=new Uint8Array(o)),i([c,[...e]],o)}let e=[],t=i([s,e],o);for(let t of o)e.push(a(t));return t}case 2:{if(c)switch(c){case`BigInt`:return i([c,o.toString()],o);case`Boolean`:case`Number`:case`String`:return i([c,o.valueOf()],o)}if(t&&`toJSON`in o)return a(o.toJSON());let n=[],r=i([s,n],o);for(let t of z(o))(e||!oa(aa(o[t])))&&n.push([a(t),a(o[t])]);return r}case 3:return i([s,isNaN(o.getTime())?ra:o.toISOString()],o);case 4:{let{source:e,flags:t}=o;return i([s,{source:e,flags:t}],o)}case 5:{let t=[],n=i([s,t],o);for(let[n,r]of o)(e||!(oa(aa(n))||oa(aa(r))))&&t.push([a(n),a(r)]);return n}case 6:{let t=[],n=i([s,t],o);for(let n of o)(e||!oa(aa(n)))&&t.push(a(n));return n}}let{message:l}=o;return i([s,{name:c,message:l}],o)};return a},ca=(e,{json:t,lossy:n}={})=>{let r=[];return sa(!(t||n),!!t,new Map,r)(e),r},la=typeof structuredClone==`function`?(e,t)=>t&&(`json`in t||`lossy`in t)?na(ca(e,t)):structuredClone(e):(e,t)=>na(ca(e,t));function ua(e,t){let n=[{type:`text`,value:`↩`}];return t>1&&n.push({type:`element`,tagName:`sup`,properties:{},children:[{type:`text`,value:String(t)}]}),n}function da(e,t){return`Back to reference `+(e+1)+(t>1?`-`+t:``)}function fa(e){let t=typeof e.options.clobberPrefix==`string`?e.options.clobberPrefix:`user-content-`,n=e.options.footnoteBackContent||ua,r=e.options.footnoteBackLabel||da,i=e.options.footnoteLabel||`Footnotes`,a=e.options.footnoteLabelTagName||`h2`,o=e.options.footnoteLabelProperties||{className:[`sr-only`]},s=[],c=-1;for(;++c<e.footnoteOrder.length;){let i=e.footnoteById.get(e.footnoteOrder[c]);if(!i)continue;let a=e.all(i),o=String(i.identifier).toUpperCase(),l=Gt(o.toLowerCase()),u=0,d=[],f=e.footnoteCounts.get(o);for(;f!==void 0&&++u<=f;){d.length>0&&d.push({type:`text`,value:` `});let e=typeof n==`string`?n:n(c,u);typeof e==`string`&&(e={type:`text`,value:e}),d.push({type:`element`,tagName:`a`,properties:{href:`#`+t+`fnref-`+l+(u>1?`-`+u:``),dataFootnoteBackref:``,ariaLabel:typeof r==`string`?r:r(c,u),className:[`data-footnote-backref`]},children:Array.isArray(e)?e:[e]})}let p=a[a.length-1];if(p&&p.type===`element`&&p.tagName===`p`){let e=p.children[p.children.length-1];e&&e.type===`text`?e.value+=` `:p.children.push({type:`text`,value:` `}),p.children.push(...d)}else a.push(...d);let m={type:`element`,tagName:`li`,properties:{id:t+`fn-`+l},children:e.wrap(a,!0)};e.patch(i,m),s.push(m)}if(s.length!==0)return{type:`element`,tagName:`section`,properties:{dataFootnotes:!0,className:[`footnotes`]},children:[{type:`element`,tagName:a,properties:{...la(o),id:`footnote-label`},children:[{type:`text`,value:i}]},{type:`text`,value:`
`},{type:`element`,tagName:`ol`,properties:{},children:e.wrap(s,!0)},{type:`text`,value:`
`}]}}var pa=(function(e){if(e==null)return va;if(typeof e==`function`)return _a(e);if(typeof e==`object`)return Array.isArray(e)?ma(e):ha(e);if(typeof e==`string`)return ga(e);throw Error(`Expected function, string, or object as test`)});function ma(e){let t=[],n=-1;for(;++n<e.length;)t[n]=pa(e[n]);return _a(r);function r(...e){let n=-1;for(;++n<t.length;)if(t[n].apply(this,e))return!0;return!1}}function ha(e){let t=e;return _a(n);function n(n){let r=n,i;for(i in e)if(r[i]!==t[i])return!1;return!0}}function ga(e){return _a(t);function t(t){return t&&t.type===e}}function _a(e){return t;function t(t,n,r){return!!(ya(t)&&e.call(this,t,typeof n==`number`?n:void 0,r||void 0))}}function va(){return!0}function ya(e){return typeof e==`object`&&!!e&&`type`in e}function ba(e){return e}var xa=[];function Sa(e,t,n,r){let i;typeof t==`function`&&typeof n!=`function`?(r=n,n=t):i=t;let a=pa(i),o=r?-1:1;s(e,void 0,[])();function s(e,i,c){let l=e&&typeof e==`object`?e:{};if(typeof l.type==`string`){let t=typeof l.tagName==`string`?l.tagName:typeof l.name==`string`?l.name:void 0;Object.defineProperty(u,"name",{value:`node (`+ba(e.type+(t?`<`+t+`>`:``))+`)`})}return u;function u(){let l=xa,u,d,f;if((!t||a(e,i,c[c.length-1]||void 0))&&(l=Ca(n(e,c)),l[0]===!1))return l;if(`children`in e&&e.children){let t=e;if(t.children&&l[0]!==`skip`)for(d=(r?t.children.length:-1)+o,f=c.concat(t);d>-1&&d<t.children.length;){let e=t.children[d];if(u=s(e,d,f)(),u[0]===!1)return u;d=typeof u[1]==`number`?u[1]:d+o}}return l}}}function Ca(e){return Array.isArray(e)?e:typeof e==`number`?[!0,e]:e==null?xa:[e]}function wa(e,t,n,r){let i,a,o;typeof t==`function`&&typeof n!=`function`?(a=void 0,o=t,i=n):(a=t,o=n,i=r),Sa(e,a,s,i);function s(e,t){let n=t[t.length-1],r=n?n.children.indexOf(e):void 0;return o(e,r,n)}}var Ta={}.hasOwnProperty,Ea={};function Da(e,t){let n=t||Ea,r=new Map,i=new Map,a={all:s,applyData:ka,definitionById:r,footnoteById:i,footnoteCounts:new Map,footnoteOrder:[],handlers:{...Xi,...n.handlers},one:o,options:n,patch:Oa,wrap:ja};return wa(e,function(e){if(e.type===`definition`||e.type===`footnoteDefinition`){let t=e.type===`definition`?r:i,n=String(e.identifier).toUpperCase();t.has(n)||t.set(n,e)}}),a;function o(e,t){let n=e.type,r=a.handlers[n];if(Ta.call(a.handlers,n)&&r)return r(a,e,t);if(a.options.passThrough&&a.options.passThrough.includes(n)){if(`children`in e){let{children:t,...n}=e,r=la(n);return r.children=a.all(e),r}return la(e)}return(a.options.unknownHandler||Aa)(a,e,t)}function s(e){let t=[];if(`children`in e){let n=e.children,r=-1;for(;++r<n.length;){let i=a.one(n[r],e);if(i){if(r&&n[r-1].type===`break`&&(!Array.isArray(i)&&i.type===`text`&&(i.value=Ma(i.value)),!Array.isArray(i)&&i.type===`element`)){let e=i.children[0];e&&e.type===`text`&&(e.value=Ma(e.value))}Array.isArray(i)?t.push(...i):t.push(i)}}}return t}}function Oa(e,t){e.position&&(t.position=Fe(e))}function ka(e,t){let n=t;if(e&&e.data){let t=e.data.hName,r=e.data.hChildren,i=e.data.hProperties;typeof t==`string`&&(n.type===`element`?n.tagName=t:n={type:`element`,tagName:t,properties:{},children:`children`in n?n.children:[n]}),n.type===`element`&&i&&Object.assign(n.properties,la(i)),`children`in n&&n.children&&r!=null&&(n.children=r)}return n}function Aa(e,t){let n=t.data||{},r=`value`in t&&!(Ta.call(n,`hProperties`)||Ta.call(n,`hChildren`))?{type:`text`,value:t.value}:{type:`element`,tagName:`div`,properties:{},children:e.all(t)};return e.patch(t,r),e.applyData(t,r)}function ja(e,t){let n=[],r=-1;for(t&&n.push({type:`text`,value:`
`});++r<e.length;)r&&n.push({type:`text`,value:`
`}),n.push(e[r]);return t&&e.length>0&&n.push({type:`text`,value:`
`}),n}function Ma(e){let t=0,n=e.charCodeAt(t);for(;n===9||n===32;)t++,n=e.charCodeAt(t);return e.slice(t)}function Na(e,t){let n=Da(e,t),r=n.one(e,void 0),i=fa(n),a=Array.isArray(r)?{type:`root`,children:r}:r||{type:`root`,children:[]};return i&&(`children`in a,a.children.push({type:`text`,value:`
`},i)),a}function Pa(e,t){return e&&`run`in e?async function(n,r){let i=Na(n,{file:r,...t});await e.run(i,r)}:function(n,r){return Na(n,{file:r,...e||t})}}function Fa(e){if(e)throw e}var Ia=o(((e,t)=>{var n=Object.prototype.hasOwnProperty,r=Object.prototype.toString,i=Object.defineProperty,a=Object.getOwnPropertyDescriptor,o=function(e){return typeof Array.isArray==`function`?Array.isArray(e):r.call(e)===`[object Array]`},s=function(e){if(!e||r.call(e)!==`[object Object]`)return!1;var t=n.call(e,`constructor`),i=e.constructor&&e.constructor.prototype&&n.call(e.constructor.prototype,`isPrototypeOf`);if(e.constructor&&!t&&!i)return!1;for(var a in e);return a===void 0||n.call(e,a)},c=function(e,t){i&&t.name===`__proto__`?i(e,t.name,{enumerable:!0,configurable:!0,value:t.newValue,writable:!0}):e[t.name]=t.newValue},l=function(e,t){if(t===`__proto__`){if(!n.call(e,t))return;if(a)return a(e,t).value}return e[t]};t.exports=function e(){var t,n,r,i,a,u,d=arguments[0],f=1,p=arguments.length,m=!1;for(typeof d==`boolean`&&(m=d,d=arguments[1]||{},f=2),(d==null||typeof d!=`object`&&typeof d!=`function`)&&(d={});f<p;++f)if(t=arguments[f],t!=null)for(n in t)r=l(d,n),i=l(t,n),d!==i&&(m&&i&&(s(i)||(a=o(i)))?(a?(a=!1,u=r&&o(r)?r:[]):u=r&&s(r)?r:{},c(d,{name:n,newValue:e(m,u,i)})):i!==void 0&&c(d,{name:n,newValue:i}));return d}}));function La(e){if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)}function Ra(){let e=[],t={run:n,use:r};return t;function n(...t){let n=-1,r=t.pop();if(typeof r!=`function`)throw TypeError(`Expected function as last argument, not `+r);i(null,...t);function i(a,...o){let s=e[++n],c=-1;if(a){r(a);return}for(;++c<t.length;)(o[c]===null||o[c]===void 0)&&(o[c]=t[c]);t=o,s?za(s,i)(...o):r(null,...o)}}function r(n){if(typeof n!=`function`)throw TypeError("Expected `middelware` to be a function, not "+n);return e.push(n),t}}function za(e,t){let n;return r;function r(...t){let r=e.length>t.length,o;r&&t.push(i);try{o=e.apply(this,t)}catch(e){let t=e;if(r&&n)throw t;return i(t)}r||(o&&o.then&&typeof o.then==`function`?o.then(a,i):o instanceof Error?i(o):a(o))}function i(e,...r){n||(n=!0,t(e,...r))}function a(e){i(null,e)}}var Ba={basename:Va,dirname:Ha,extname:Ua,join:Wa,sep:`/`};function Va(e,t){if(t!==void 0&&typeof t!=`string`)throw TypeError(`"ext" argument must be a string`);qa(e);let n=0,r=-1,i=e.length,a;if(t===void 0||t.length===0||t.length>e.length){for(;i--;)if(e.codePointAt(i)===47){if(a){n=i+1;break}}else r<0&&(a=!0,r=i+1);return r<0?``:e.slice(n,r)}if(t===e)return``;let o=-1,s=t.length-1;for(;i--;)if(e.codePointAt(i)===47){if(a){n=i+1;break}}else o<0&&(a=!0,o=i+1),s>-1&&(e.codePointAt(i)===t.codePointAt(s--)?s<0&&(r=i):(s=-1,r=o));return n===r?r=o:r<0&&(r=e.length),e.slice(n,r)}function Ha(e){if(qa(e),e.length===0)return`.`;let t=-1,n=e.length,r;for(;--n;)if(e.codePointAt(n)===47){if(r){t=n;break}}else r||=!0;return t<0?e.codePointAt(0)===47?`/`:`.`:t===1&&e.codePointAt(0)===47?`//`:e.slice(0,t)}function Ua(e){qa(e);let t=e.length,n=-1,r=0,i=-1,a=0,o;for(;t--;){let s=e.codePointAt(t);if(s===47){if(o){r=t+1;break}continue}n<0&&(o=!0,n=t+1),s===46?i<0?i=t:a!==1&&(a=1):i>-1&&(a=-1)}return i<0||n<0||a===0||a===1&&i===n-1&&i===r+1?``:e.slice(i,n)}function Wa(...e){let t=-1,n;for(;++t<e.length;)qa(e[t]),e[t]&&(n=n===void 0?e[t]:n+`/`+e[t]);return n===void 0?`.`:Ga(n)}function Ga(e){qa(e);let t=e.codePointAt(0)===47,n=Ka(e,!t);return n.length===0&&!t&&(n=`.`),n.length>0&&e.codePointAt(e.length-1)===47&&(n+=`/`),t?`/`+n:n}function Ka(e,t){let n=``,r=0,i=-1,a=0,o=-1,s,c;for(;++o<=e.length;){if(o<e.length)s=e.codePointAt(o);else if(s===47)break;else s=47;if(s===47){if(i!==o-1&&a!==1){if(i!==o-1&&a===2){if(n.length<2||r!==2||n.codePointAt(n.length-1)!==46||n.codePointAt(n.length-2)!==46){if(n.length>2){if(c=n.lastIndexOf(`/`),c!==n.length-1){c<0?(n=``,r=0):(n=n.slice(0,c),r=n.length-1-n.lastIndexOf(`/`)),i=o,a=0;continue}}else if(n.length>0){n=``,r=0,i=o,a=0;continue}}t&&(n=n.length>0?n+`/..`:`..`,r=2)}else n.length>0?n+=`/`+e.slice(i+1,o):n=e.slice(i+1,o),r=o-i-1}i=o,a=0}else s===46&&a>-1?a++:a=-1}return n}function qa(e){if(typeof e!=`string`)throw TypeError(`Path must be a string. Received `+JSON.stringify(e))}var Ja={cwd:Ya};function Ya(){return`/`}function Xa(e){return!!(typeof e==`object`&&e&&`href`in e&&e.href&&`protocol`in e&&e.protocol&&e.auth===void 0)}function Za(e){if(typeof e==`string`)e=new URL(e);else if(!Xa(e)){let t=TypeError('The "path" argument must be of type string or an instance of URL. Received `'+e+"`");throw t.code=`ERR_INVALID_ARG_TYPE`,t}if(e.protocol!==`file:`){let e=TypeError(`The URL must be of scheme file`);throw e.code=`ERR_INVALID_URL_SCHEME`,e}return Qa(e)}function Qa(e){if(e.hostname!==``){let e=TypeError(`File URL host must be "localhost" or empty on darwin`);throw e.code=`ERR_INVALID_FILE_URL_HOST`,e}let t=e.pathname,n=-1;for(;++n<t.length;)if(t.codePointAt(n)===37&&t.codePointAt(n+1)===50){let e=t.codePointAt(n+2);if(e===70||e===102){let e=TypeError(`File URL path must not include encoded / characters`);throw e.code=`ERR_INVALID_FILE_URL_PATH`,e}}return decodeURIComponent(t)}var $a=[`history`,`path`,`basename`,`stem`,`extname`,`dirname`],eo=class{constructor(e){let t;t=e?Xa(e)?{path:e}:typeof e==`string`||io(e)?{value:e}:e:{},this.cwd=`cwd`in t?``:Ja.cwd(),this.data={},this.history=[],this.messages=[],this.value,this.map,this.result,this.stored;let n=-1;for(;++n<$a.length;){let e=$a[n];e in t&&t[e]!==void 0&&t[e]!==null&&(this[e]=e===`history`?[...t[e]]:t[e])}let r;for(r in t)$a.includes(r)||(this[r]=t[r])}get basename(){return typeof this.path==`string`?Ba.basename(this.path):void 0}set basename(e){no(e,`basename`),to(e,`basename`),this.path=Ba.join(this.dirname||``,e)}get dirname(){return typeof this.path==`string`?Ba.dirname(this.path):void 0}set dirname(e){ro(this.basename,`dirname`),this.path=Ba.join(e||``,this.basename)}get extname(){return typeof this.path==`string`?Ba.extname(this.path):void 0}set extname(e){if(to(e,`extname`),ro(this.dirname,`extname`),e){if(e.codePointAt(0)!==46)throw Error("`extname` must start with `.`");if(e.includes(`.`,1))throw Error("`extname` cannot contain multiple dots")}this.path=Ba.join(this.dirname,this.stem+(e||``))}get path(){return this.history[this.history.length-1]}set path(e){Xa(e)&&(e=Za(e)),no(e,`path`),this.path!==e&&this.history.push(e)}get stem(){return typeof this.path==`string`?Ba.basename(this.path,this.extname):void 0}set stem(e){no(e,`stem`),to(e,`stem`),this.path=Ba.join(this.dirname||``,e+(this.extname||``))}fail(e,t,n){let r=this.message(e,t,n);throw r.fatal=!0,r}info(e,t,n){let r=this.message(e,t,n);return r.fatal=void 0,r}message(e,t,n){let r=new Be(e,t,n);return this.path&&(r.name=this.path+`:`+r.name,r.file=this.path),r.fatal=!1,this.messages.push(r),r}toString(e){return this.value===void 0?``:typeof this.value==`string`?this.value:new TextDecoder(e||void 0).decode(this.value)}};function to(e,t){if(e&&e.includes(Ba.sep))throw Error("`"+t+"` cannot be a path: did not expect `"+Ba.sep+"`")}function no(e,t){if(!e)throw Error("`"+t+"` cannot be empty")}function ro(e,t){if(!e)throw Error("Setting `"+t+"` requires `path` to be set too")}function io(e){return!!(e&&typeof e==`object`&&`byteLength`in e&&`byteOffset`in e)}var ao=(function(e){let t=this.constructor.prototype,n=t[e],r=function(){return n.apply(r,arguments)};return Object.setPrototypeOf(r,t),r}),oo=l(Ia(),1),so={}.hasOwnProperty,co=new class e extends ao{constructor(){super(`copy`),this.Compiler=void 0,this.Parser=void 0,this.attachers=[],this.compiler=void 0,this.freezeIndex=-1,this.frozen=void 0,this.namespace={},this.parser=void 0,this.transformers=Ra()}copy(){let t=new e,n=-1;for(;++n<this.attachers.length;){let e=this.attachers[n];t.use(...e)}return t.data((0,oo.default)(!0,{},this.namespace)),t}data(e,t){return typeof e==`string`?arguments.length===2?(fo(`data`,this.frozen),this.namespace[e]=t,this):so.call(this.namespace,e)&&this.namespace[e]||void 0:e?(fo(`data`,this.frozen),this.namespace=e,this):this.namespace}freeze(){if(this.frozen)return this;let e=this;for(;++this.freezeIndex<this.attachers.length;){let[t,...n]=this.attachers[this.freezeIndex];if(n[0]===!1)continue;n[0]===!0&&(n[0]=void 0);let r=t.call(e,...n);typeof r==`function`&&this.transformers.use(r)}return this.frozen=!0,this.freezeIndex=1/0,this}parse(e){this.freeze();let t=ho(e),n=this.parser||this.Parser;return lo(`parse`,n),n(String(t),t)}process(e,t){let n=this;return this.freeze(),lo(`process`,this.parser||this.Parser),uo(`process`,this.compiler||this.Compiler),t?r(void 0,t):new Promise(r);function r(r,i){let a=ho(e),o=n.parse(a);n.run(o,a,function(e,t,r){if(e||!t||!r)return s(e);let i=t,a=n.stringify(i,r);_o(a)?r.value=a:r.result=a,s(e,r)});function s(e,n){e||!n?i(e):r?r(n):t(void 0,n)}}}processSync(e){let t=!1,n;return this.freeze(),lo(`processSync`,this.parser||this.Parser),uo(`processSync`,this.compiler||this.Compiler),this.process(e,r),mo(`processSync`,`process`,t),n;function r(e,r){t=!0,Fa(e),n=r}}run(e,t,n){po(e),this.freeze();let r=this.transformers;return!n&&typeof t==`function`&&(n=t,t=void 0),n?i(void 0,n):new Promise(i);function i(i,a){let o=ho(t);r.run(e,o,s);function s(t,r,o){let s=r||e;t?a(t):i?i(s):n(void 0,s,o)}}}runSync(e,t){let n=!1,r;return this.run(e,t,i),mo(`runSync`,`run`,n),r;function i(e,t){Fa(e),r=t,n=!0}}stringify(e,t){this.freeze();let n=ho(t),r=this.compiler||this.Compiler;return uo(`stringify`,r),po(e),r(e,n)}use(e,...t){let n=this.attachers,r=this.namespace;if(fo(`use`,this.frozen),e!=null){if(typeof e==`function`)s(e,t);else if(typeof e==`object`)Array.isArray(e)?o(e):a(e);else throw TypeError("Expected usable value, not `"+e+"`")}return this;function i(e){if(typeof e==`function`)s(e,[]);else if(typeof e==`object`){if(Array.isArray(e)){let[t,...n]=e;s(t,n)}else a(e)}else throw TypeError("Expected usable value, not `"+e+"`")}function a(e){if(!(`plugins`in e)&&!(`settings`in e))throw Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");o(e.plugins),e.settings&&(r.settings=(0,oo.default)(!0,r.settings,e.settings))}function o(e){let t=-1;if(e!=null){if(Array.isArray(e))for(;++t<e.length;){let n=e[t];i(n)}else throw TypeError("Expected a list of plugins, not `"+e+"`")}}function s(e,t){let r=-1,i=-1;for(;++r<n.length;)if(n[r][0]===e){i=r;break}if(i===-1)n.push([e,...t]);else if(t.length>0){let[r,...a]=t,o=n[i][1];La(o)&&La(r)&&(r=(0,oo.default)(!0,o,r)),n[i]=[e,r,...a]}}}}().freeze();function lo(e,t){if(typeof t!=`function`)throw TypeError("Cannot `"+e+"` without `parser`")}function uo(e,t){if(typeof t!=`function`)throw TypeError("Cannot `"+e+"` without `compiler`")}function fo(e,t){if(t)throw Error("Cannot call `"+e+"` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.")}function po(e){if(!La(e)||typeof e.type!=`string`)throw TypeError("Expected node, got `"+e+"`")}function mo(e,t,n){if(!n)throw Error("`"+e+"` finished async. Use `"+t+"` instead")}function ho(e){return go(e)?e:new eo(e)}function go(e){return!!(e&&typeof e==`object`&&`message`in e&&`messages`in e)}function _o(e){return typeof e==`string`||vo(e)}function vo(e){return!!(e&&typeof e==`object`&&`byteLength`in e&&`byteOffset`in e)}var V=vt(),yo=[],bo={allowDangerousHtml:!0},xo=/^(https?|ircs?|mailto|xmpp)$/i,So=[{from:`astPlugins`,id:`remove-buggy-html-in-markdown-parser`},{from:`allowDangerousHtml`,id:`remove-buggy-html-in-markdown-parser`},{from:`allowNode`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`allowElement`},{from:`allowedTypes`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`allowedElements`},{from:`className`,id:`remove-classname`},{from:`disallowedTypes`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`disallowedElements`},{from:`escapeHtml`,id:`remove-buggy-html-in-markdown-parser`},{from:`includeElementIndex`,id:`#remove-includeelementindex`},{from:`includeNodeIndex`,id:`change-includenodeindex-to-includeelementindex`},{from:`linkTarget`,id:`remove-linktarget`},{from:`plugins`,id:`change-plugins-to-remarkplugins`,to:`remarkPlugins`},{from:`rawSourcePos`,id:`#remove-rawsourcepos`},{from:`renderers`,id:`change-renderers-to-components`,to:`components`},{from:`source`,id:`change-source-to-children`,to:`children`},{from:`sourcePos`,id:`#remove-sourcepos`},{from:`transformImageUri`,id:`#add-urltransform`,to:`urlTransform`},{from:`transformLinkUri`,id:`#add-urltransform`,to:`urlTransform`}];function Co(e){let t=wo(e),n=To(e);return Eo(t.runSync(t.parse(n),n),e)}function wo(e){let t=e.rehypePlugins||yo,n=e.remarkPlugins||yo,r=e.remarkRehypeOptions?{...e.remarkRehypeOptions,...bo}:bo;return co().use(yi).use(n).use(Pa,r).use(t)}function To(e){let t=e.children||``,n=new eo;return typeof t==`string`?n.value=t:``+t,n}function Eo(e,t){let n=t.allowedElements,r=t.allowElement,i=t.components,a=t.disallowedElements,o=t.skipHtml,s=t.unwrapDisallowed,c=t.urlTransform||Do;for(let e of So)Object.hasOwn(t,e.from)&&``+e.from+(e.to?"use `"+e.to+"` instead":`remove it`)+e.id;return wa(e,l),Je(e,{Fragment:V.Fragment,components:i,ignoreInvalidStyle:!0,jsx:V.jsx,jsxs:V.jsxs,passKeys:!0,passNode:!0});function l(e,t,i){if(e.type===`raw`&&i&&typeof t==`number`)return o?i.children.splice(t,1):i.children[t]={type:`text`,value:e.value},t;if(e.type===`element`){let t;for(t in gt)if(Object.hasOwn(gt,t)&&Object.hasOwn(e.properties,t)){let n=e.properties[t],r=gt[t];(r===null||r.includes(e.tagName))&&(e.properties[t]=c(String(n||``),t,e))}}if(e.type===`element`){let o=n?!n.includes(e.tagName):a?a.includes(e.tagName):!1;if(!o&&r&&typeof t==`number`&&(o=!r(e,t,i)),o&&i&&typeof t==`number`)return s&&e.children?i.children.splice(t,1,...e.children):i.children.splice(t,1),t}}}function Do(e){let t=e.indexOf(`:`),n=e.indexOf(`?`),r=e.indexOf(`#`),i=e.indexOf(`/`);return t===-1||i!==-1&&t>i||n!==-1&&t>n||r!==-1&&t>r||xo.test(e.slice(0,t))?e:``}var Oo={generatedAt:`2026-10-04T02:34:26.519Z`,label:`Commissioner's recaps`,recaps:[{id:`recap-1`,index:1,title:`GWB WEEK 1 RECAP: WE ARE SO BACK`,week:1,reconstructed:!1,bodyMarkdown:`🦬 GWB WEEK 1 RECAP: WE ARE SO BACK

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

🦬🔥`,label:`Predictions`,postedAt:`2026-10-02`}]},ko=`America/New_York`;function Ao(e){return/^\d{4}-\d{2}-\d{2}$/.test(e)?Date.parse(`${e}T12:00:00`):Date.parse(e)}function jo(e){let t=Ao(e);return Number.isNaN(t)?e:new Date(t).toLocaleDateString(`en-US`,{weekday:`short`,month:`short`,day:`numeric`,timeZone:ko})}var Mo=1.5,No=new Set([`RB`,`WR`,`TE`]);function Po(e,t){return t[e]?.position??null}function Fo(e,t){return t[e]?.full_name?.trim()||`Player`}function Io(e,t,n){let r=new Set(e.starters),i=null;for(let[a,o]of Object.entries(e.players_points??{})){if(r.has(a))continue;let s=Po(a,n);s&&e.starters.forEach((r,c)=>{let l=t[c];if(!l||l===`BN`||!(l===s||l===`FLEX`&&No.has(s)))return;let u=e.starters_points[c]??0,d=o-u;if(!(d<Mo)&&(!i||d>i.gain)){let e=Fo(a,n);i={name:e,gain:d,message:`${e} would have added ${d.toFixed(1)}`}}})}return i}var Lo=40,Ro=3;function zo(e,t){return t[e]?.full_name?.trim()||`Player`}function Bo(e,t){let n=null;return e.starters.forEach((r,i)=>{let a=e.starters_points[i]??0;(!n||a>n.points)&&(n={name:zo(r,t),points:a})}),n}function Vo(e,t){return t.find(t=>t.rosterId===e)?.rank??99}function H(e,t,n,r,i,a){let o=n>=r,s=[],c=o?i:a,l=o?e:t,u=o?a:i,d=o?t:e;return c&&s.push(`${l}: ${c.name} ${c.points.toFixed(1)}`),u&&s.push(`${d}: ${u.name} ${u.points.toFixed(1)}`),s}function U(e){if(e.length)return e.length===1?`Top scorer — ${e[0]}`:`Top scorers — ${e.join(` · `)}`}function Ho(e,t){let n=Math.round(e*10)/10,r=Math.round(t*10)/10;return Math.abs(n-r).toFixed(1)}function Uo(e,t,n,r,i,a){let o=n>=r?e:t,s=n>=r?t:e,c=Ho(n,r);return a?`${o} is leading ${s} by ${c} points.`:`${o} topped ${s} by ${c} points.${i.length?` ${i.join(` · `)}.`:``}`}function Wo(e,t,n,r){let{rosterPositions:i,preWeekStandings:a,isWeekFinal:o}=r,s=new Map;for(let t of e){let e=s.get(t.matchup_id)??[];e.push(t),s.set(t.matchup_id,e)}let c=[];for(let[e,r]of s){if(r.length<2)continue;let[s,l]=r,u=t.get(s.roster_id),d=t.get(l.roster_id),f=Math.abs(s.points-l.points),p=s.points>=l.points?s.roster_id:l.roster_id,m=[];if(o&&f>=Lo&&m.push(`Blowout`),o){let e=Vo(s.roster_id,a),t=Vo(l.roster_id,a);(s.points>=l.points?e:t)-(s.points>=l.points?t:e)>=Ro&&m.push(`Upset`)}let h=Bo(s,n),g=Bo(l,n),_=H(u?.teamName??`Team A`,d?.teamName??`Team B`,s.points,l.points,h,g);c.push({matchupId:e,teamA:{rosterId:s.roster_id,teamName:u?.teamName??`Team ${s.roster_id}`,points:s.points,topScorer:h,benchMiss:Io(s,i,n)},teamB:{rosterId:l.roster_id,teamName:d?.teamName??`Team ${l.roster_id}`,points:l.points,topScorer:g,benchMiss:Io(l,i,n)},margin:f,winnerRosterId:p,tags:m,narrative:Uo(u?.teamName??`Team A`,d?.teamName??`Team B`,s.points,l.points,m,!o),scorerLines:_,starsLine:U(_),isMatchupOfTheWeek:!1})}if(c.length){let e=c.reduce((e,t)=>t.margin>e.margin?t:e);e.isMatchupOfTheWeek=!0}return c.sort((e,t)=>e.matchupId-t.matchupId)}function Go(e){return e?.length?e.some(e=>e.starters?.length>0):!1}var Ko={Waivers:20,Predictions:30,Thursday:40,Saturday:50,Sunday:60,"Monday Morning":70,"Monday Night":80,Final:90,Correction:100},qo={Predictions:`Predictions`,Waivers:`Waivers`,Thursday:`Thursday`,Saturday:`Saturday`,Sunday:`Sunday`,"Monday Morning":`Monday`,"Monday Night":`Monday Night`,Final:`Final`,Correction:`Correction`};function Jo(e){return qo[e]}function Yo(e,t){let n=Ao(e.postedAt),r=Ao(t.postedAt);if(n!==r)return n-r;let i=Ko[e.label]??50,a=Ko[t.label]??50;return i===a?e.index-t.index:i-a}function Xo(e){return[...e].sort(Yo)}function Zo(e,t){return Xo(e.filter(e=>e.week===t))}function Qo(e){return e.replace(/^#+\s*/,``).replace(/\*\*([^*]+)\*\*/g,`$1`).replace(/\*([^*]+)\*/g,`$1`).trim()}function $o(e,t=3,n){let r=n?Qo(n).toLowerCase():``,i=e.split(`
`).map(Qo).filter(e=>e.length>0&&e!==`⸻`&&!e.startsWith(`---`)&&!/^🦬+$/.test(e));return(r&&i[0]?.toLowerCase()===r?i.slice(1):i).slice(0,t).join(` `)}var es={weeks:[{week:2,label:`Crystal ball`,picks:[{matchup:`Matt vs Steven`,pick:`Matt`,actualWinner:`Steven`,correct:!1},{matchup:`Crooke vs Hadi`,pick:`Crooke`,actualWinner:`Hadi`,correct:!1},{matchup:`Mauricio vs Narking`,pick:`Mauricio`,actualWinner:`Narking`,correct:!1},{matchup:`Kayser vs Danny`,pick:`Kayser`,actualWinner:`Kayser`,correct:!0},{matchup:`Frankie vs Eric`,pick:`Frankie`,actualWinner:`Eric`,correct:!1},{matchup:`Jamil vs Manny`,pick:`Jamil`,actualWinner:`Manny`,correct:!1}]}]};function ts({week:e}){let t=es.weeks.find(t=>t.week===e);if(!t)return null;let n=t.picks.filter(e=>e.correct).length,r=t.picks.length;return(0,V.jsxs)(`div`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-4 py-3 text-sm`,children:[(0,V.jsxs)(`p`,{className:`font-semibold text-[var(--gwb-accent)]`,children:[`Crystal ball — Week `,e,`: `,n,` of `,r]}),(0,V.jsx)(`ul`,{className:`mt-2 space-y-1 text-[var(--gwb-muted)]`,children:t.picks.map(e=>(0,V.jsxs)(`li`,{children:[e.matchup,`: picked `,e.pick,e.correct?` ✓`:` (won ${e.actualWinner})`]},e.matchup))})]})}var ns=Oo.recaps;function rs({week:e,focusRecapId:t,onFocusHandled:n}){let r=(0,v.useMemo)(()=>Zo(ns,e),[e]);return(0,v.useEffect)(()=>{if(!t)return;let e=document.getElementById(`commissioner-recap-${t}`);if(!e)return;let r=e.querySelector(`details`);r&&(r.open=!0),e.scrollIntoView({behavior:`smooth`,block:`start`}),n?.()},[t,e,n]),(0,V.jsxs)(`div`,{className:`space-y-4`,children:[(0,V.jsxs)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:[Oo.label,` — timeline for NFL Week `,e,`. Tap a post to read the full recap.`]}),(0,V.jsx)(ts,{week:e}),r.length===0?(0,V.jsxs)(`p`,{className:`rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-sm text-[var(--gwb-muted)]`,children:[`No commissioner recaps for Week `,e,` yet.`]}):(0,V.jsx)(`ol`,{className:`relative space-y-2 border-l border-[var(--gwb-border)] pl-4`,children:r.map(e=>(0,V.jsxs)(`li`,{id:`commissioner-recap-${e.id}`,className:`relative`,children:[(0,V.jsx)(`span`,{className:`absolute -left-[1.125rem] top-4 h-2 w-2 rounded-full bg-[var(--gwb-accent)]`,"aria-hidden":!0}),(0,V.jsxs)(`details`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)]`,children:[(0,V.jsx)(`summary`,{className:`cursor-pointer list-none px-4 py-3 marker:content-none [&::-webkit-details-marker]:hidden`,children:(0,V.jsxs)(`span`,{className:`flex flex-col gap-2`,children:[(0,V.jsxs)(`span`,{className:`flex flex-wrap items-center gap-2`,children:[(0,V.jsx)(`span`,{className:`rounded-full bg-[#243040] px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--gwb-accent)]`,children:Jo(e.label)}),e.reconstructed&&(0,V.jsx)(`span`,{className:`rounded-full bg-[#243040] px-2 py-0.5 text-xs font-normal uppercase tracking-wide text-[var(--gwb-muted)]`,children:`reconstructed`}),(0,V.jsx)(`time`,{className:`text-xs text-[var(--gwb-muted)]`,dateTime:e.postedAt,children:jo(e.postedAt)})]}),(0,V.jsx)(`span`,{className:`font-medium leading-snug`,children:e.title}),(0,V.jsx)(`span`,{className:`text-sm leading-relaxed text-[var(--gwb-muted)] line-clamp-3`,children:$o(e.bodyMarkdown,3,e.title)})]})}),(0,V.jsxs)(`div`,{className:`commissioner-recap-prose border-t border-[var(--gwb-border)] px-4 py-4 text-sm leading-relaxed text-[var(--gwb-text)]`,children:[(0,V.jsx)(Co,{children:e.bodyMarkdown}),e.id===`recap-8`&&(0,V.jsx)(`p`,{className:`mt-3 text-xs text-[var(--gwb-muted)]`,children:`Final score made the mulligan unnecessary. See Mulligans.`})]})]})]},e.id))})]})}var is=`1389375326257184768`,as=`https://api.sleeper.app/v1`,os=`gwb_players_nfl_v1`,ss={holderUserId:`475847480039174144`,holderName:`Frankie`,lossesWithoutWin:7,season:2015,renameAtLosses:8},cs={[ss.holderUserId]:ss.holderName},ls={1:`Danny`,2:`Mauricio`,3:`Narking`,4:`Kayser`,5:`Eric`,6:`Hadi`,7:`Steven`,8:`Crooke`,9:`Manny`,10:`Jamil`,11:`Frankie`,12:`Matt`};function us(e,t){return ls[e]??t}function ds(e){if(!e)return null;let t=e.trim();return t?t.startsWith(`http://`)||t.startsWith(`https://`)?t:`https://sleepercdn.com/avatars/thumbs/${t}`:null}function fs(e){if(!e)return!0;let t=e.trim();return!t||!/[a-zA-Z0-9]/.test(t)}function ps(e,t){let n=(e?.metadata?.team_name)?.trim();return n&&!fs(n)?n:e?.display_name?.trim()?e.display_name.trim():`Team ${t}`}function ms(e,t){let n=new Map(e.map(e=>[e.user_id,e])),r=new Map;for(let e of t){let t=e.owner_id?n.get(e.owner_id):void 0;r.set(e.roster_id,{rosterId:e.roster_id,userId:e.owner_id??``,displayName:t?.display_name?.trim()??`Roster ${e.roster_id}`,teamName:ps(t,e.roster_id),avatarUrl:ds(t?.metadata?.avatar??t?.avatar??null)})}return r}function hs(e){return e.fpts+e.fpts_decimal/100}function gs(e){return e.fpts_against+e.fpts_against_decimal/100}function _s(e){if(e.length===0)return``;let t=e[e.length-1],n=0;for(let r=e.length-1;r>=0&&e[r]===t;r--)n++;return`${t}${n}`}function vs(e){let t=e.trim();if(!t)return``;let n=/^(\d+)([WLT])$/i.exec(t);return n?`${n[2].toUpperCase()}${n[1]}`:t}function ys(e){let t=[...e];return t.sort((e,t)=>t.wins===e.wins?t.pointsFor===e.pointsFor?e.pointsAgainst-t.pointsAgainst:t.pointsFor-e.pointsFor:t.wins-e.wins),t.map((e,t)=>({rank:t+1,rosterId:e.rosterId,teamName:e.teamName,displayName:e.displayName,wins:e.wins,losses:e.losses,ties:e.ties,pointsFor:e.pointsFor,pointsAgainst:e.pointsAgainst,streak:e.streak}))}function bs(e,t,n){let r=new Map;for(let e of t.keys())r.set(e,{wins:0,losses:0,ties:0,pointsFor:0,pointsAgainst:0,outcomes:[]});for(let t=1;t<=n;t++){let n=e.get(t);if(!n?.length)continue;let i=new Map;for(let e of n){let t=i.get(e.matchup_id)??[];t.push(e),i.set(e.matchup_id,t)}for(let e of i.values()){if(e.length!==2)continue;let[t,n]=e,i=r.get(t.roster_id),a=r.get(n.roster_id);i&&a&&(i.pointsFor+=t.points,i.pointsAgainst+=n.points,a.pointsFor+=n.points,a.pointsAgainst+=t.points,t.points>n.points?(i.wins++,a.losses++,i.outcomes.push(`W`),a.outcomes.push(`L`)):n.points>t.points?(a.wins++,i.losses++,a.outcomes.push(`W`),i.outcomes.push(`L`)):(i.ties++,a.ties++,i.outcomes.push(`T`),a.outcomes.push(`T`)))}}return ys([...t.entries()].map(([e,t])=>{let n=r.get(e);return{rosterId:e,teamName:t.teamName,displayName:t.displayName,wins:n.wins,losses:n.losses,ties:n.ties,pointsFor:n.pointsFor,pointsAgainst:n.pointsAgainst,streak:_s(n.outcomes)}}))}function xs(e,t){return ys(e.map(e=>{let n=t.get(e.roster_id),r=e.settings.wins??0,i=e.settings.losses??0,a=e.settings.ties??0;return{rosterId:e.roster_id,teamName:n?.teamName??`Team ${e.roster_id}`,displayName:n?.displayName??``,wins:r,losses:i,ties:a,pointsFor:hs(e.settings),pointsAgainst:gs(e.settings),streak:vs(e.metadata?.streak??``)}}))}function Ss(e){let t=e.ties?`-${e.ties}`:``;return`${e.wins}-${e.losses}${t}`}var Cs=[1,2,3,4,5,6,7,8],ws=[{week:3,recapId:`recap-10`,quote:`The Frankie Zone is in full survival mode.`},{week:3,recapId:`recap-13`,quote:`The Frankie Zone has officially received statehood.`},{week:3,recapId:`recap-12`,quote:`Automatic first down for the Frankie Zone.`},{week:4,recapId:`recap-14`,quote:`Frankie IS STILL TRYING TO ESCAPE THE ZONE`},{week:4,recapId:`recap-14`,quote:`The Frankie Zone becomes a UNESCO World Heritage Site.`}];function Ts(e){return Math.max(1,e-1)}function Es(e,t=2){return{collisions:e.slice(0,t),moreCount:Math.max(0,e.length-t)}}function Ds(e,t){return cs[e]??t.split(/\s+/)[0]??t}function Os(e){return`THE ${e.toUpperCase()} ZONE`}function ks(e){return`${e} Zone`}function As(e,t,n){let r=0;for(let i=1;i<=n;i++)Ms(e,i,t)===`W`&&r++;return r}function js(e,t,n){let r=0;for(let i=1;i<=n;i++)Ms(e,i,t)===`L`&&r++;return r}function Ms(e,t,n){let r=n.get(t);if(!r?.length)return null;let i=r.find(t=>t.roster_id===e);if(!i)return null;let a=r.find(t=>t.matchup_id===i.matchup_id&&t.roster_id!==e);return!a||i.points===0&&a.points===0&&!i.starters?.some((e,t)=>(i.starters_points[t]??0)>0)?null:i.points>a.points?`W`:a.points>i.points?`L`:`T`}function Ns(e,t,n,r){for(let i=1;i<=r;i++){let r=As(e,n,i),a=js(e,n,i);if(r===0&&a>=t)return i}return null}function Ps(e,t,n,r){let i=ss.renameAtLosses,a=null;for(let o of e){if(o.wins>0||o.losses<i)continue;let e=Ds(t.get(o.rosterId)?.userId??``,o.displayName),s=Ns(o.rosterId,i,n,r)??r;(!a||s<a.week)&&(a={week:s,name:e})}return a?.name??ss.holderName}function Fs(e,t,n){let r=[];for(let i of t.values()){let a=0;for(let o=1;o<=n;o++){let n=As(i.rosterId,e,o);if(a===0&&n===1){if((o<=1?0:js(i.rosterId,e,o-1))<1){a=n;continue}let s=e.get(o),c=s?.find(e=>e.roster_id===i.rosterId),l=s?.find(e=>c&&e.matchup_id===c.matchup_id&&e.roster_id!==i.rosterId),u=l?t.get(l.roster_id):void 0,d=u?.displayName??u?.teamName??`opponent`,f=c?.points??0;r.push({rosterId:i.rosterId,teamName:i.teamName,displayName:i.displayName,week:o,points:f,opponentLabel:d,line:`${i.teamName} escaped W${o} · ${f.toFixed(2)} vs ${d}`})}a=n}}return r.sort((e,t)=>e.week-t.week||e.teamName.localeCompare(t.teamName))}function Is(e){let t=new Map,n=new Map;for(let t of e){let e=n.get(t.matchup_id)??[];e.push(t),n.set(t.matchup_id,e)}for(let e of n.values())e.length===2&&(t.set(e[0].roster_id,e[1].roster_id),t.set(e[1].roster_id,e[0].roster_id));return t}function Ls(e,t,n,r,i=18){for(let a=r;a<=i;a++){let r=t.get(a)?.get(e);if(r==null)continue;let i=n.get(r);return{rosterId:r,displayName:i?.displayName??`Roster ${r}`,teamName:i?.teamName??`Team ${r}`,record:i?Ss(i):`—`,week:a}}return null}function Rs(e,t,n,r,i,a=15){let o=[],s=Ts(a);for(let a=r;a<=s;a++){let r=t.get(a);if(!r)continue;let s=new Set;for(let t of e){let c=r.get(t);if(c==null||!e.has(c))continue;let l=[t,c].sort().join(`-`);if(s.has(l))continue;s.add(l);let u=n.get(t),d=n.get(c);o.push({week:a,weeksUntil:Math.max(0,a-i),rosterA:t,rosterB:c,labelA:u?.displayName??`Roster ${t}`,labelB:d?.displayName??`Roster ${c}`})}}return o.sort((e,t)=>e.week-t.week)}function zs(e){let t=new Map;for(let[n,r]of e)t.set(n,Is(r));return t}function Bs(e,t,n,r){let i=`${e} STILL WINLESS · AFTER WEEK ${t}`;return n?`${i} · WEEK ${r} IN PROGRESS`:i}function Vs(e,t){return`YOU ARE HERE · ${`0-${e}`}${t?` · UP NEXT`:``}`}function Hs(e){let t=ss.renameAtLosses-e;return t<=0?`RECORD BROKEN — ZONE RENAMED`:t===1?`1 loss from breaking the record`:`${t} losses from breaking the record`}function Us(e){let{standings:t,teams:n,matchupsByWeek:r,scheduleByWeek:i,throughWeek:a,selectedWeek:o,weekInProgress:s,playoffWeekStart:c=15}=e,l=Ps(t,n,r,a),u=t.filter(e=>e.wins===0).sort((e,t)=>t.losses-e.losses||e.pointsFor-t.pointsFor),d=new Map(t.map(e=>[e.rosterId,e])),f=a+1,p=new Set(u.map(e=>e.rosterId)),m=u.map(e=>({rosterId:e.rosterId,displayName:e.displayName,teamName:e.teamName,wins:e.wins,losses:e.losses,pointsFor:e.pointsFor,record:Ss(e),lossesToRecord:Math.max(0,ss.renameAtLosses-e.losses),nextOpponent:Ls(e.rosterId,i,d,f)})),h=Fs(r,n,a),{collisions:g,moreCount:_}=Es(Rs(p,i,n,f,a,c));return{zoneName:l,heroTitle:Os(l),tabLabel:ks(l),censusLine:Bs(u.length,a,s,o),weekInProgressNote:null,residents:m,escapes:h,collisions:g,moreCollisionsCount:_,isEmpty:u.length===0,throughWeek:a}}function Ws(e,t,n){let r=new Map(e);return r.set(t,Is(n)),r}var Gs={width:1080,height:1350};function Ks(e,t){return{id:e,title:t,basename:e,...Gs}}var qs=[{id:`vs-m2-kayser-frankie`,title:`Kayser vs Frankie`},{id:`results-w1-m5`,title:`Steven 199.4 – Frankie 135.4`},{id:`results-w2-m6`,title:`Eric 142.7 – Frankie 105.2`},{id:`results-w3-m6`,title:`Jamil 113.6 – Frankie 95.8`}];function Js(){return qs.map(e=>Ks(e.id,e.title))}async function Ys(e){let t=await fetch(`${as}${e}`);if(!t.ok)throw Error(`Sleeper API ${e}: ${t.status}`);return t.json()}function Xs(){return Ys(`/state/nfl`)}function Zs(e=is){return Ys(`/league/${e}`)}function Qs(e=is){return Ys(`/league/${e}/users`)}function $s(e=is){return Ys(`/league/${e}/rosters`)}function ec(e,t=is){return Ys(`/league/${t}/matchups/${e}`)}function tc(e,t=is){return Ys(`/league/${t}/transactions/${e}`)}async function nc(e,t=is){return e<1?[]:(await Promise.all(Array.from({length:e},(e,n)=>tc(n+1,t)))).flat()}async function rc(e,t=is){let n=new Map,r=Array.from({length:e},(e,t)=>t+1),i=await Promise.all(r.map(e=>ec(e,t).then(t=>({w:e,rows:t}))));for(let{w:e,rows:t}of i)t?.length&&t.some(e=>e.points>0||e.starters?.length)&&n.set(e,t);return n}var ic=[],ac=`/gwb-fe006a16/`;function oc(e,t,n){return`${ac}slides/${e}.${t}.${n}`}var sc=48,cc=`button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`;function lc({slides:e,index:t,onClose:n,onIndexChange:r,returnFocusRef:i}){let a=(0,v.useRef)(null),o=(0,v.useRef)(null),s=(0,v.useRef)(null),[c,l]=(0,v.useState)(!1),u=e[t],d=(0,v.useCallback)(()=>{t>0&&r(t-1)},[t,r]),f=(0,v.useCallback)(()=>{t<e.length-1&&r(t+1)},[t,r,e.length]);(0,v.useEffect)(()=>{let e=document.body.style.overflow;return document.body.style.overflow=`hidden`,a.current?.focus(),()=>{document.body.style.overflow=e,i?.current?.focus()}},[i]),(0,v.useEffect)(()=>{l(!1)},[u?.basename]),(0,v.useEffect)(()=>{let e=e=>{if(e.key===`Escape`)e.preventDefault(),n();else if(e.key===`ArrowLeft`)e.preventDefault(),d();else if(e.key===`ArrowRight`)e.preventDefault(),f();else if(e.key===`Tab`&&a.current){let t=[...a.current.querySelectorAll(cc)].filter(e=>!e.hasAttribute(`disabled`));if(!t.length)return;let n=t[0],r=t[t.length-1];e.shiftKey&&document.activeElement===n?(e.preventDefault(),r.focus()):!e.shiftKey&&document.activeElement===r&&(e.preventDefault(),n.focus())}};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[n,d,f]);let p=e=>{s.current=e.changedTouches[0]?.clientX??null},m=e=>{let t=s.current,n=e.changedTouches[0]?.clientX;if(s.current=null,t==null||n==null)return;let r=n-t;r>sc?d():r<-48&&f()},h=(0,v.useCallback)(async()=>{let e=o.current;if(e){try{typeof e.decode==`function`&&await e.decode()}catch{}e.naturalWidth>0&&l(!0)}},[]);if(!u)return null;let g=oc(u.basename,`full`,`webp`),_=oc(u.basename,`full`,`jpg`);return(0,V.jsxs)(`div`,{ref:a,role:`dialog`,"aria-modal":`true`,"aria-label":`Slide ${t+1} of ${e.length}: ${u.title}`,tabIndex:-1,className:`fixed inset-0 z-50 flex flex-col bg-black/92 backdrop-blur-sm`,onClick:e=>{e.target===e.currentTarget&&n()},onTouchStart:p,onTouchEnd:m,children:[(0,V.jsxs)(`div`,{className:`flex shrink-0 flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-6`,children:[(0,V.jsxs)(`p`,{className:`text-sm text-white/80`,children:[(0,V.jsxs)(`span`,{className:`block sm:inline`,children:[t+1,` / `,e.length]}),(0,V.jsxs)(`span`,{className:`mt-0.5 block truncate sm:mt-0 sm:inline`,children:[(0,V.jsx)(`span`,{className:`hidden sm:inline`,children:` · `}),u.title]})]}),(0,V.jsx)(`button`,{type:`button`,className:`self-end rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gwb-accent)] sm:self-auto`,onClick:n,"aria-label":`Close slide viewer`,children:`Close`})]}),(0,V.jsxs)(`div`,{className:`relative flex min-h-0 flex-1 items-center justify-center px-14 pb-4 pt-2 sm:px-20`,children:[(0,V.jsx)(`button`,{type:`button`,className:`absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 p-3 text-white hover:bg-black/70 disabled:opacity-30 sm:left-4`,onClick:d,disabled:t===0,"aria-label":`Previous slide`,children:(0,V.jsx)(`span`,{"aria-hidden":`true`,children:`‹`})}),(0,V.jsxs)(`div`,{className:`relative z-10 flex max-h-[min(78dvh,900px)] w-full max-w-[min(100%,720px)] items-center justify-center`,children:[!c&&(0,V.jsx)(`div`,{className:`absolute inset-0 flex items-center justify-center text-sm text-white/50`,"aria-hidden":`true`,children:`Loading slide…`}),(0,V.jsx)(`img`,{ref:o,src:_,srcSet:`${g} 1080w`,sizes:`(max-width: 720px) 100vw, 720px`,alt:u.title,width:u.width,height:u.height,decoding:`async`,fetchPriority:`high`,className:`block max-h-[min(78dvh,900px)] w-auto max-w-full object-contain transition-opacity duration-150 ${c?`opacity-100`:`opacity-0`}`,draggable:!1,onLoad:()=>{h()},onError:e=>{let t=e.currentTarget;t.src.endsWith(`.jpg`)||(t.removeAttribute(`srcset`),t.src=_)}},u.basename)]}),(0,V.jsx)(`button`,{type:`button`,className:`absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/25 bg-black/50 p-3 text-white hover:bg-black/70 disabled:opacity-30 sm:right-4`,onClick:f,disabled:t===e.length-1,"aria-label":`Next slide`,children:(0,V.jsx)(`span`,{"aria-hidden":`true`,children:`›`})})]})]})}var uc=540,dc=675;function fc({losses:e}){return(0,V.jsx)(`div`,{className:`overflow-x-auto pb-1`,children:(0,V.jsx)(`ol`,{className:`flex min-w-max gap-1.5`,"aria-label":`Winless path tracker`,children:Cs.map(t=>{let n=t===e,r=t===ss.lossesWithoutWin,i=t===ss.renameAtLosses;return(0,V.jsxs)(`li`,{className:`flex flex-col items-center rounded-lg border px-2 py-2 text-center ${n?`border-teal-400/70 bg-teal-950/40`:`border-[var(--gwb-border)] bg-[#0d1319]`}`,children:[(0,V.jsxs)(`span`,{className:`font-['Bebas Neue'] text-lg leading-none ${n?`text-teal-300`:`text-[var(--gwb-muted)]`}`,children:[`0-`,t]}),r&&(0,V.jsx)(`span`,{className:`mt-1 max-w-[4.5rem] text-[0.55rem] font-semibold uppercase leading-tight text-[var(--gwb-accent)]`,children:`Frankie's record (2015)`}),i&&(0,V.jsx)(`span`,{className:`mt-1 max-w-[4.5rem] text-[0.55rem] font-semibold uppercase leading-tight text-red-300`,children:`Zone renamed`}),n&&(0,V.jsx)(`span`,{className:`mt-1 text-[0.6rem] font-bold uppercase tracking-wide text-teal-300`,children:`Here`})]},t)})})})}function pc({collision:e}){let t=e.weeksUntil===0?`THIS WEEK`:e.weeksUntil===1?`1 WEEK TO THE COLLISION`:`${e.weeksUntil} WEEKS TO THE COLLISION`;return(0,V.jsxs)(`article`,{className:`rounded-xl border-2 border-[var(--gwb-accent)] bg-gradient-to-b from-amber-950/50 to-[var(--gwb-surface)] p-4`,children:[(0,V.jsx)(`p`,{className:`font-['Bebas Neue'] text-2xl tracking-wide text-[var(--gwb-accent)]`,children:t}),(0,V.jsxs)(`p`,{className:`mt-2 text-lg font-semibold leading-snug`,children:[e.labelA,` vs `,e.labelB]}),(0,V.jsxs)(`p`,{className:`mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--gwb-muted)]`,children:[`Week `,e.week,` they collide / Who survives?`]})]})}function mc({standings:e,teams:t,matchupsByWeek:n,selectedWeek:r,throughWeek:i,weekInProgress:a,deferralNote:o,playoffWeekStart:s,onOpenRecap:c,initialSlideId:l,onSlideUrlChange:u}){let[d,f]=(0,v.useState)(()=>zs(n)),p=(0,v.useRef)(new Set),[m,h]=(0,v.useState)(!1),[g,_]=(0,v.useState)(null),y=(0,v.useMemo)(()=>Js(),[]);(0,v.useEffect)(()=>{let e=[];for(let t of y)for(let n of[`webp`,`jpg`]){let r=document.createElement(`link`);r.rel=`preload`,r.as=`image`,r.href=oc(t.basename,`thumb`,n),document.head.appendChild(r),e.push(r)}return()=>{for(let t of e)t.remove()}},[y]),(0,v.useEffect)(()=>{f(zs(n));for(let e of n.keys())p.current.add(e)},[n]),(0,v.useEffect)(()=>{let e=!1;return h(!1),(async()=>{let t=[];for(let e=1;e<=18;e++)p.current.has(e)||t.push(e);await Promise.all(t.map(async t=>{if(!e){p.current.add(t);try{let e=await ec(t);if(!e?.length)return;f(n=>Ws(n,t,e))}catch{p.current.delete(t)}}})),e||h(!0)})(),()=>{e=!0}},[n]);let b=(0,v.useMemo)(()=>Us({standings:e,teams:t,matchupsByWeek:n,scheduleByWeek:d,throughWeek:i,selectedWeek:r,weekInProgress:a,playoffWeekStart:s}),[e,t,n,d,i,r,a,s]),x=(0,v.useMemo)(()=>{let e=new Map;return y.forEach((t,n)=>e.set(t.id,n)),e},[y]),S=(0,v.useCallback)(e=>{_(e);let t=y[e];u?.(t?.id??null)},[y,u]),C=(0,v.useCallback)(()=>{_(null),u?.(null)},[u]);(0,v.useEffect)(()=>{if(!l)return;let e=x.get(l);e!=null&&_(e)},[l,x]);let ee=(0,v.useMemo)(()=>{let e=new Map;for(let t of Oo.recaps)e.set(t.id,t.title);return e},[]);return(0,V.jsxs)(`div`,{id:`frankie-zone-section`,className:`space-y-8`,children:[o&&(0,V.jsx)(`p`,{className:`rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100`,children:o}),(0,V.jsxs)(`header`,{className:`text-center`,children:[(0,V.jsx)(`h2`,{className:`font-['Anton'] text-4xl uppercase leading-tight text-[var(--gwb-accent)] sm:text-5xl`,children:b.heroTitle}),(0,V.jsx)(`p`,{className:`mt-2 font-['Bebas Neue'] text-lg tracking-[0.12em] text-[var(--gwb-text)] sm:text-xl`,children:b.censusLine})]}),b.isEmpty?(0,V.jsx)(`div`,{className:`rounded-xl border border-dashed border-[var(--gwb-border)] p-8 text-center`,children:(0,V.jsx)(`p`,{className:`font-['Bebas Neue'] text-2xl tracking-wide text-[var(--gwb-accent)]`,children:`ZONE EMPTY · FRANKIE'S 0-7 RECORD STANDS`})}):(0,V.jsxs)(V.Fragment,{children:[(0,V.jsxs)(`section`,{"aria-labelledby":`fz-census-heading`,children:[(0,V.jsx)(`h3`,{id:`fz-census-heading`,className:`mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]`,children:`Zone census`}),(0,V.jsx)(`ul`,{className:`space-y-3`,role:`list`,children:b.residents.map(e=>(0,V.jsx)(`li`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-4 py-3`,children:(0,V.jsxs)(`div`,{className:`flex flex-wrap items-baseline justify-between gap-2`,children:[(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`p`,{className:`text-lg font-semibold`,children:us(e.rosterId,e.displayName)}),(0,V.jsxs)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:[e.teamName,(0,V.jsxs)(`span`,{className:`ml-1 text-xs`,title:`Sleeper: ${e.displayName}`,children:[`(@`,e.displayName,`)`]})]})]}),(0,V.jsxs)(`div`,{className:`text-right`,children:[(0,V.jsx)(`p`,{className:`font-['Bebas Neue'] text-2xl text-red-300`,children:e.record}),(0,V.jsxs)(`p`,{className:`text-xs text-[var(--gwb-muted)]`,children:[e.pointsFor.toFixed(2),` PF`]})]})]})},e.rosterId))})]}),(!m||b.collisions.length>0||b.moreCollisionsCount>0)&&(0,V.jsxs)(`section`,{"aria-labelledby":`fz-collisions-heading`,children:[(0,V.jsx)(`h3`,{id:`fz-collisions-heading`,className:`mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-accent)]`,children:`Collisions`}),m?b.collisions.length>0?(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`ul`,{className:`space-y-3`,role:`list`,children:b.collisions.map(e=>(0,V.jsx)(`li`,{children:(0,V.jsx)(pc,{collision:e})},`${e.week}-${e.rosterA}-${e.rosterB}`))}),b.moreCollisionsCount>0&&(0,V.jsxs)(`p`,{className:`mt-2 text-xs text-[var(--gwb-muted)]`,children:[`+`,b.moreCollisionsCount,` more zone-vs-zone games this season`]})]}):(0,V.jsx)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:`No head-to-head collisions scheduled between current residents.`}):(0,V.jsx)(`p`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-4 py-3 text-sm text-[var(--gwb-muted)]`,"data-schedule-loading":!0,children:`Loading season schedule for collision watch…`})]}),(0,V.jsxs)(`section`,{"aria-labelledby":`fz-residents-heading`,children:[(0,V.jsx)(`h3`,{id:`fz-residents-heading`,className:`mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]`,children:`You are here`}),(0,V.jsx)(`ul`,{className:`space-y-6`,role:`list`,children:b.residents.map(e=>(0,V.jsxs)(`li`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[#0d1319] p-4`,children:[(0,V.jsxs)(`p`,{className:`font-medium`,children:[us(e.rosterId,e.displayName),` · `,e.teamName]}),(0,V.jsx)(`p`,{className:`mt-1 text-xs font-semibold uppercase tracking-wide text-teal-300`,children:Vs(e.losses,!!e.nextOpponent)}),(0,V.jsx)(`div`,{className:`mt-3`,children:(0,V.jsx)(fc,{losses:e.losses})}),(0,V.jsx)(`p`,{className:`mt-3 text-sm text-[var(--gwb-muted)]`,children:Hs(e.losses)}),e.nextOpponent&&(0,V.jsxs)(`div`,{className:`mt-4 rounded-lg border border-teal-900/50 bg-teal-950/20 px-3 py-2`,children:[(0,V.jsxs)(`p`,{className:`text-xs font-semibold uppercase tracking-wide text-teal-300`,children:[`Up next · Week `,e.nextOpponent.week]}),(0,V.jsxs)(`p`,{className:`mt-1 font-medium`,children:[us(e.nextOpponent.rosterId,e.nextOpponent.displayName),` `,(0,V.jsxs)(`span`,{className:`text-[var(--gwb-muted)]`,children:[`(`,e.nextOpponent.record,`)`]})]}),(0,V.jsx)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:e.nextOpponent.teamName})]})]},e.rosterId))})]})]}),b.escapes.length>0&&(0,V.jsxs)(`section`,{"aria-labelledby":`fz-escape-heading`,children:[(0,V.jsx)(`h3`,{id:`fz-escape-heading`,className:`mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]`,children:`Escape log`}),(0,V.jsx)(`ul`,{className:`space-y-2 text-sm`,role:`list`,children:b.escapes.map(e=>(0,V.jsx)(`li`,{className:`rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2`,children:e.line},`${e.rosterId}-${e.week}`))})]}),!b.isEmpty&&(0,V.jsxs)(V.Fragment,{children:[(0,V.jsxs)(`section`,{"aria-labelledby":`fz-slides-heading`,children:[(0,V.jsx)(`h3`,{id:`fz-slides-heading`,className:`mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]`,children:`Slides`}),(0,V.jsx)(`ul`,{className:`grid grid-cols-2 gap-2 sm:grid-cols-3`,role:`list`,children:y.map((e,t)=>{let n=oc(e.basename,`thumb`,`jpg`);return(0,V.jsx)(`li`,{children:(0,V.jsxs)(`button`,{type:`button`,className:`group block w-full overflow-hidden rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] text-left transition hover:border-[var(--gwb-accent)]`,onClick:()=>S(t),"aria-label":`Open ${e.title}`,children:[(0,V.jsx)(`img`,{src:n,alt:``,width:uc,height:dc,loading:`eager`,decoding:`sync`,fetchPriority:`high`,"data-fz-slide-thumb":e.id,className:`aspect-[4/5] w-full bg-[#0d1319] object-cover`}),(0,V.jsx)(`p`,{className:`truncate px-2 py-1.5 text-xs text-[var(--gwb-muted)]`,children:e.title})]})},e.id)})})]}),(0,V.jsxs)(`section`,{"aria-labelledby":`fz-lore-heading`,children:[(0,V.jsx)(`h3`,{id:`fz-lore-heading`,className:`mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]`,children:`Zone lore`}),(0,V.jsx)(`ol`,{className:`space-y-3 border-l border-[var(--gwb-border)] pl-4`,children:ws.map(e=>(0,V.jsxs)(`li`,{className:`relative`,children:[(0,V.jsx)(`span`,{className:`absolute -left-[1.125rem] top-2 h-2 w-2 rounded-full bg-[var(--gwb-accent)]`,"aria-hidden":!0}),(0,V.jsxs)(`button`,{type:`button`,className:`w-full rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-4 py-3 text-left transition hover:border-[var(--gwb-accent)]`,onClick:()=>c(e.week,e.recapId),children:[(0,V.jsxs)(`p`,{className:`text-sm leading-snug`,children:[`“`,e.quote,`”`]}),(0,V.jsxs)(`p`,{className:`mt-2 text-xs text-[var(--gwb-muted)]`,children:[`Week `,e.week,ee.get(e.recapId)?` · ${ee.get(e.recapId)}`:``]})]})]},`${e.recapId}-${e.quote}`))})]})]}),g!==null&&(0,V.jsx)(lc,{slides:y,index:g,onClose:C,onIndexChange:e=>{_(e),u?.(y[e]?.id??null)}})]})}function hc(){return(0,V.jsxs)(`footer`,{className:`mt-10 border-t border-[var(--gwb-border)] pt-4 text-xs leading-relaxed text-[var(--gwb-muted)]`,children:[(0,V.jsx)(`p`,{className:`font-semibold text-[var(--gwb-text)]`,children:`Sound`}),(0,V.jsxs)(`p`,{children:[`"Impact Moderato", "Volatile Reaction", "Sneaky Snitch", and "Monkeys Spinning Monkeys" Kevin MacLeod (incompetech.com), licensed under Creative Commons: By Attribution 4.0,`,` `,(0,V.jsx)(`a`,{href:`https://creativecommons.org/licenses/by/4.0/`,className:`text-[var(--gwb-accent)] underline`,rel:`noopener noreferrer`,target:`_blank`,children:`https://creativecommons.org/licenses/by/4.0/`})]})]})}var gc=864e5;function _c(e){if(!e||typeof e!=`object`)return null;let t=String(e.first_name??``),n=String(e.last_name??``),r=e.full_name||`${t} ${n}`.trim()||`Unknown`;return{first_name:t,last_name:n,position:e.position??null,team:e.team??null,full_name:r}}function vc(){try{let e=localStorage.getItem(os);if(!e)return null;let t=JSON.parse(e);return Date.now()-t.fetchedAt>gc?null:t}catch{return null}}function yc(e){let t={fetchedAt:Date.now(),players:e};try{localStorage.setItem(os,JSON.stringify(t))}catch{}}async function bc(e=!1){if(!e){let e=vc();if(e)return e.players}let t=await fetch(`${as}/players/nfl`);if(!t.ok)throw Error(`Failed to load players (${t.status})`);let n=await t.json(),r={};for(let[e,t]of Object.entries(n)){let n=_c(t);n&&(r[e]=n)}return yc(r),r}function xc(e,t){let n=t[e];return n?n.position?`${n.full_name} (${n.position})`:n.full_name:e.length<8?e:`Player`}var Sc=new Set([`waiver`,`free_agent`]);function Cc(e,t){let n=e.players_points?.[t];return typeof n==`number`&&Number.isFinite(n)?n:0}function wc(e,t){return!!e?.players?.includes(t)}function Tc(e,t){return t!==`0`&&(e.starters??[]).includes(t)}function Ec(e){let t=e.roster_ids?.[0];return typeof t==`number`?t:null}function Dc(e,t){let n=new Map;for(let r=1;r<=t;r++){let t=-1;for(let n of e)n.type===`waiver`&&n.leg===r&&typeof n.status_updated==`number`&&n.status_updated>t&&(t=n.status_updated);t>=0&&n.set(r,t)}return n}function Oc(e,t){let n=e.wes??-1/0,r=t.wes??-1/0;if(r!==n)return r-n;if(t.netWaiverPoints!==e.netWaiverPoints)return t.netWaiverPoints-e.netWaiverPoints;let i=e.hitRate??-1,a=t.hitRate??-1;return a===i?e.failedClaims-t.failedClaims:a-i}function kc(e){let{transactions:t,matchupsByWeek:n,teams:r,rosters:i,scoringThrough:a,selectedWeek:o,selectedWeekComplete:s}=e,c=Dc(t,a),l=c.get(a),u=new Map;for(let e=1;e<=a;e++){let t=n.get(e);t?.length&&u.set(e,new Map(t.map(e=>[e.roster_id,e])))}let d=[],f=[],p=new Map,m=[];t.forEach((e,t)=>{if(!Sc.has(e.type))return;let n=Ec(e);if(n==null)return;let r=e.status===`failed`?`failed`:e.status===`complete`?`complete`:null;if(!r)return;let i=Object.keys(e.adds??{}),a=Object.keys(e.drops??{}),o=e.transaction_id??`${e.leg}-${e.status_updated}-${t}`,s=r===`complete`&&i.length>0&&l!=null&&e.status_updated>=l;if(r===`failed`&&p.set(n,(p.get(n)??0)+1),m.push({id:o,leg:e.leg,rosterId:n,type:e.type,status:r,statusUpdated:e.status_updated,adds:i,drops:a,notes:e.metadata?.notes??null,startedPoints:null,pending:s}),r===`complete`){for(let t of i)d.push({playerId:t,rosterId:n,time:e.status_updated,leg:e.leg,type:e.type,transactionId:o,started:0,bench:0,startWeeks:0,hit10:0,weeks:[],weeklyStarted:new Map,weeklyBench:new Map});for(let t of a)f.push({playerId:t,rosterId:n,time:e.status_updated,leg:e.leg,transactionId:o,regretByWeek:new Map})}});let h=new Map;for(let e of d){let t=`${e.rosterId}:${e.playerId}`,n=h.get(t);n?n.push(e):h.set(t,[e])}for(let e of h.values())e.sort((e,t)=>e.time-t.time);let g=[];for(let[e,t]of h){let n=Number(e.split(`:`)[0]),r=e.slice(e.indexOf(`:`)+1);for(let[e,i]of u){let a=c.get(e);if(a==null)continue;let o=i.get(n);if(!wc(o,r)||!o)continue;let s=t.filter(e=>e.time<a);if(!s.length)continue;let l=s[s.length-1],u=Cc(o,r);l.weeks.push(e),Tc(o,r)?(l.started+=u,l.startWeeks+=1,u>=10&&(l.hit10+=1),l.weeklyStarted.set(e,(l.weeklyStarted.get(e)??0)+u),g.push({week:e,playerId:r,points:u,rosterId:n})):(l.bench+=u,l.weeklyBench.set(e,(l.weeklyBench.get(e)??0)+u))}}let _=[];for(let e of f)for(let[t,n]of u){let r=c.get(t);if(r!=null&&e.time<r&&!wc(n.get(e.rosterId),e.playerId))for(let[r,i]of n){if(r===e.rosterId||!Tc(i,e.playerId))continue;let n=Cc(i,e.playerId);e.regretByWeek.set(t,(e.regretByWeek.get(t)??0)+n),_.push({week:t,playerId:e.playerId,points:n,rosterId:e.rosterId,startedByRosterId:r})}}let v=new Map;for(let e of d)v.set(e.transactionId,(v.get(e.transactionId)??0)+e.started);for(let e of m)e.status===`complete`&&e.adds.length&&(e.startedPoints=v.get(e.id)??0);let y=new Map;for(let e of i){let t=e.settings.waiver_position;y.set(e.roster_id,typeof t==`number`?t:null)}let b=new Set([...r.keys(),...d.map(e=>e.rosterId),...f.map(e=>e.rosterId)]),x=[];for(let e of b){let t=r.get(e),n=l==null?[]:d.filter(t=>t.rosterId===e&&t.time<l),i=n.filter(e=>e.weeks.length>0),c=d.filter(t=>t.rosterId===e&&l!=null&&t.time>=l).length,u=n.reduce((e,t)=>e+t.started,0),m=n.reduce((e,t)=>e+t.bench,0),h=n.reduce((e,t)=>e+t.hit10,0),g=n.reduce((e,t)=>e+t.startWeeks,0),_=f.filter(t=>t.rosterId===e),v=_.reduce((e,t)=>{let n=0;for(let e of t.regretByWeek.values())n+=e;return e+n},0),b=u-v,S=i.length?b/i.length:null,C=i.reduce((e,t)=>!e||t.started>e.started?t:e,null),ee=[],w=0;for(let e=1;e<=a;e++){for(let t of n)w+=t.weeklyStarted.get(e)??0;ee.push(w)}let T=null,E=null,D=null;s&&o>=1&&o<=a&&(T=n.reduce((e,t)=>e+(t.weeklyStarted.get(o)??0),0),E=_.reduce((e,t)=>e+(t.regretByWeek.get(o)??0),0),D=T-E),x.push({rosterId:e,displayName:t?.displayName??`Roster ${e}`,teamName:t?.teamName??`Roster ${e}`,waiverPriority:y.get(e)??null,pickupCount:n.length,rosteredPickups:i.length,pendingPickups:c,startedPoints:u,benchPoints:m,pointsPerPickup:n.length?u/n.length:null,hitHits:h,hitWeeks:g,hitRate:g?h/g:null,netWaiverPoints:b,dropRegret:v,failedClaims:p.get(e)??0,wes:S,eligible:i.length>=3,poolRank:null,bestPickup:C?{playerId:C.playerId,points:C.started}:null,weeklyStarted:T,weeklyRegret:E,weeklyNet:D,cumulativeStarted:ee})}let S=x.filter(e=>e.eligible).sort(Oc);S.forEach((e,t)=>{e.poolRank=t+1});let C=x.filter(e=>!e.eligible).sort(Oc),ee=[...S,...C],w=s&&o>=1&&o<=a?[...ee].sort((e,t)=>{let n=e.weeklyNet??0,r=t.weeklyNet??0;return r===n?(t.weeklyStarted??0)-(e.weeklyStarted??0):r-n}):[],T=s?g.filter(e=>e.week===o).sort((e,t)=>t.points-e.points)[0]??null:null,E=s?_.filter(e=>e.week===o&&e.points>0).sort((e,t)=>t.points-e.points)[0]??null:null;return m.sort((e,t)=>t.statusUpdated-e.statusUpdated),{scoringThrough:a,selectedWeek:o,selectedWeekComplete:s,managers:ee,champion:S[0]??null,cellar:S.length>=2?S[S.length-1]:null,pickupOfWeek:T,worstDropOfWeek:E,moves:m,weeklyRanking:w}}var Ac=[`#e8b923`,`#7fd1c7`,`#f2a3b3`,`#9bb7ff`,`#e08a4f`,`#c6e07a`,`#d7b4f3`,`#8fd0ff`,`#f0d38a`,`#ff8f8f`,`#b8c4ce`,`#6ee7b7`];function jc(e){return Ac[(Math.abs(e)-1)%Ac.length]??Ac[0]}function Mc(e){return e.toFixed(2)}function Nc({managers:e,scoringThrough:t}){let n=[...e].sort((e,t)=>(t.wes??-999)-(e.wes??-999));if(!n.length||t<1)return(0,V.jsx)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:`Efficiency chart appears after a completed week.`});let r=n.map(e=>e.wes??0),i=Math.min(0,...r),a=Math.max(0,...r),o=(a-i||1)*.08,s=i-o,c=a+o,l=8+n.length*36+8,u=e=>168+(e-s)/(c-s)*496,d=u(0);return(0,V.jsxs)(`svg`,{viewBox:`0 0 720 ${l}`,className:`h-auto w-full`,role:`img`,"aria-label":`Waiver efficiency through week ${t}`,children:[(0,V.jsx)(`line`,{x1:d,y1:8,x2:d,y2:l-8,stroke:`#f4f7fb`,strokeWidth:1.25}),n.map((e,t)=>{let n=8+t*36,r=e.wes??0,i=Math.min(d,u(r)),a=Math.max(d,u(r)),o=e.eligible?jc(e.rosterId):`#243040`,s=r>=0?a+6:i-6;return(0,V.jsxs)(`g`,{children:[(0,V.jsx)(`text`,{x:8,y:n+22,fill:`#f4f7fb`,fontSize:13,fontFamily:`Inter, system-ui, sans-serif`,children:e.displayName}),(0,V.jsx)(`rect`,{x:i,y:n+8,width:Math.max(a-i,1.5),height:18,rx:4,fill:o,stroke:e.eligible?`none`:`#e8b923`,strokeWidth:e.eligible?0:1.25}),(0,V.jsx)(`text`,{x:s,y:n+22,fill:`#f4f7fb`,fontSize:12,fontFamily:`Inter, system-ui, sans-serif`,textAnchor:r>=0?`start`:`end`,children:e.wes==null?`—`:Mc(e.wes)})]},e.rosterId)})]})}function Pc({managers:e,scoringThrough:t}){let[n,r]=(0,v.useState)(new Set);if(t<1)return(0,V.jsx)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:`The week-by-week line appears after a completed week.`});let i=[...e].sort((e,n)=>(n.cumulativeStarted[t-1]??0)-(e.cumulativeStarted[t-1]??0)),a=Math.max(10,...i.map(e=>Math.max(0,...e.cumulativeStarted))),o=e=>40+(t===1?334:(e-1)/(t-1)*668),s=e=>16+(1-e/a)*236,c=[0,a/2,a];return(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`svg`,{viewBox:`0 0 720 280`,className:`h-auto w-full`,role:`img`,"aria-label":`Cumulative started pickup points through week ${t}`,children:[c.map(e=>(0,V.jsxs)(`g`,{children:[(0,V.jsx)(`line`,{x1:40,y1:s(e),x2:708,y2:s(e),stroke:`#243040`}),(0,V.jsx)(`text`,{x:34,y:s(e)+4,fill:`#8fa3b8`,fontSize:11,textAnchor:`end`,fontFamily:`Inter, system-ui, sans-serif`,children:Math.round(e)})]},e)),Array.from({length:t},(e,t)=>t+1).map(e=>(0,V.jsxs)(`text`,{x:o(e),y:272,fill:`#8fa3b8`,fontSize:11,textAnchor:`middle`,fontFamily:`Inter, system-ui, sans-serif`,children:[`W`,e]},e)),i.map(e=>{if(n.has(e.rosterId))return null;let t=e.cumulativeStarted.map((e,t)=>`${t===0?`M`:`L`}${o(t+1).toFixed(1)},${s(e).toFixed(1)}`).join(` `),r=jc(e.rosterId);return(0,V.jsxs)(`g`,{children:[(0,V.jsx)(`path`,{d:t,fill:`none`,stroke:r,strokeWidth:2.4,strokeLinejoin:`round`}),e.cumulativeStarted.map((e,t)=>(0,V.jsx)(`circle`,{cx:o(t+1),cy:s(e),r:3.2,fill:r},t))]},e.rosterId)})]}),(0,V.jsx)(`div`,{className:`mt-2 flex flex-wrap gap-1.5`,children:i.map(e=>{let t=n.has(e.rosterId);return(0,V.jsxs)(`button`,{type:`button`,className:`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs ${t?`border-[var(--gwb-border)] text-[var(--gwb-muted)] opacity-50`:`border-[var(--gwb-border)] text-[var(--gwb-text)]`}`,onClick:()=>{r(t=>{let n=new Set(t);return n.has(e.rosterId)?n.delete(e.rosterId):n.add(e.rosterId),n})},children:[(0,V.jsx)(`span`,{className:`inline-block h-2.5 w-2.5 rounded-sm`,style:{background:jc(e.rosterId)}}),e.displayName]},e.rosterId)})})]})}var Fc=new Intl.DateTimeFormat(`en-US`,{timeZone:`America/New_York`,month:`short`,day:`numeric`,hour:`numeric`,minute:`2-digit`});function Ic(e){return e==null||Number.isNaN(e)?`—`:e.toFixed(2)}function Lc(e){return e.hitWeeks?`${e.hitHits}/${e.hitWeeks}`:`—`}function Rc(e){return{...e,displayName:us(e.rosterId,e.displayName),teamName:`${e.teamName} · @${e.displayName}`}}function zc(e){return{...e,managers:e.managers.map(Rc),weeklyRanking:e.weeklyRanking.map(Rc),champion:e.champion?Rc(e.champion):null,cellar:e.cellar?Rc(e.cellar):null}}function Bc(e,t){return e.managers.find(e=>e.rosterId===t)?.displayName??`Roster ${t}`}function Vc({board:e,players:t,deferralNote:n,loadError:r}){let i=(0,v.useMemo)(()=>zc(e),[e]),[a,o]=(0,v.useState)(`all`),[s,c]=(0,v.useState)(`all`),[l,u]=(0,v.useState)(`all`),[d,f]=(0,v.useState)(!1),p=(0,v.useMemo)(()=>i.moves.filter(e=>!(!d&&e.leg!==i.selectedWeek||a!==`all`&&e.rosterId!==a||s!==`all`&&e.status!==s||l!==`all`&&e.type!==l)),[d,i.moves,i.selectedWeek,l,a,s]),m=e=>xc(e,t??{});return(0,V.jsxs)(`div`,{id:`waiver-wire-panel`,className:`space-y-8`,children:[r&&(0,V.jsxs)(`p`,{className:`rounded-lg border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-200`,children:[`Waiver moves didn’t load. `,r]}),t==null&&(0,V.jsx)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:`Loading player names…`}),n&&(0,V.jsxs)(`p`,{className:`rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100`,children:[n,` Moves from Week `,i.selectedWeek,` are still in the log.`]}),(0,V.jsxs)(`div`,{className:`grid grid-cols-1 gap-3 sm:grid-cols-2`,children:[(0,V.jsx)(Hc,{board:i}),(0,V.jsx)(Uc,{board:i}),(0,V.jsx)(Wc,{board:i,name:m,managerName:e=>Bc(i,e)}),(0,V.jsx)(Gc,{board:i,name:m,managerName:e=>Bc(i,e)})]}),(0,V.jsxs)(`section`,{children:[(0,V.jsxs)(`h3`,{className:`mb-2 text-lg font-semibold`,children:[`Week `,i.selectedWeek,` on the wire`]}),i.selectedWeekComplete?(0,V.jsx)(Kc,{board:i}):(0,V.jsxs)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:[`Week `,i.selectedWeek,` is still scoring. Weekly started points, Pickup of the Week, and Worst Drop land when the week is final.`]})]}),(0,V.jsxs)(`section`,{className:`space-y-4`,children:[(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`h3`,{className:`text-lg font-semibold`,children:[`Season through Week `,i.scoringThrough]}),(0,V.jsxs)(`p`,{className:`mt-1 text-xs text-[var(--gwb-muted)]`,children:[`Waiver Efficiency Score is net started points divided by rostered pickups. The badge needs `,3,` rostered pickups. A hit is a start of`,` `,10,`+ points. Kickers and defenses count.`]})]}),(0,V.jsxs)(`div`,{className:`grid grid-cols-1 gap-4 lg:grid-cols-2`,children:[(0,V.jsxs)(`figure`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-3`,children:[(0,V.jsxs)(`figcaption`,{className:`mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--gwb-muted)]`,children:[`Efficiency through Week `,i.scoringThrough]}),(0,V.jsx)(Nc,{managers:i.managers,scoringThrough:i.scoringThrough}),(0,V.jsxs)(`p`,{className:`mt-2 text-xs text-[var(--gwb-muted)]`,children:[`Filled bars are in the championship pool. Hollow bars are under`,` `,3,` rostered pickups.`]})]}),(0,V.jsxs)(`figure`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-3`,children:[(0,V.jsx)(`figcaption`,{className:`mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--gwb-muted)]`,children:`Cumulative started points`}),(0,V.jsx)(Pc,{managers:i.managers,scoringThrough:i.scoringThrough})]})]}),(0,V.jsx)(qc,{board:i})]}),(0,V.jsxs)(`section`,{children:[(0,V.jsx)(`h3`,{className:`mb-2 text-lg font-semibold`,children:`Move log`}),(0,V.jsxs)(`div`,{className:`mb-3 flex flex-wrap gap-2`,children:[(0,V.jsxs)(`select`,{"aria-label":`Filter moves by manager`,className:`rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-2 py-2 text-sm`,value:a,onChange:e=>o(e.target.value===`all`?`all`:Number(e.target.value)),children:[(0,V.jsx)(`option`,{value:`all`,children:`All managers`}),i.managers.map(e=>(0,V.jsx)(`option`,{value:e.rosterId,children:e.displayName},e.rosterId))]}),(0,V.jsxs)(`select`,{"aria-label":`Filter moves by status`,className:`rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-2 py-2 text-sm`,value:s,onChange:e=>c(e.target.value),children:[(0,V.jsx)(`option`,{value:`all`,children:`All statuses`}),(0,V.jsx)(`option`,{value:`complete`,children:`Complete`}),(0,V.jsx)(`option`,{value:`failed`,children:`Failed`})]}),(0,V.jsxs)(`select`,{"aria-label":`Filter moves by type`,className:`rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-2 py-2 text-sm`,value:l,onChange:e=>u(e.target.value),children:[(0,V.jsx)(`option`,{value:`all`,children:`Waivers and free agents`}),(0,V.jsx)(`option`,{value:`waiver`,children:`Waivers`}),(0,V.jsx)(`option`,{value:`free_agent`,children:`Free agents`})]}),(0,V.jsx)(`button`,{type:`button`,className:`rounded-lg border px-3 py-2 text-sm ${d?`border-[var(--gwb-accent)] text-[var(--gwb-accent)]`:`border-[var(--gwb-border)] text-[var(--gwb-muted)]`}`,onClick:()=>f(e=>!e),children:d?`Showing all weeks`:`Week ${i.selectedWeek} only`})]}),p.length===0?(0,V.jsxs)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:[`No moves `,d?`match these filters`:`in Week ${i.selectedWeek}`,`.`]}):(0,V.jsx)(`ul`,{className:`space-y-2`,children:p.map(e=>(0,V.jsx)(Yc,{move:e,who:Bc(i,e.rosterId),name:m},e.id))})]})]})}function Hc({board:e}){let t=e.champion;return(0,V.jsxs)(`article`,{className:`rounded-xl border border-[var(--gwb-accent)] bg-[var(--gwb-surface)] p-4`,children:[(0,V.jsx)(`p`,{className:`text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gwb-accent)]`,children:`Waiver Wire Champion`}),t?(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`h3`,{className:`mt-1 font-['Anton'] text-3xl uppercase leading-none`,children:t.displayName}),(0,V.jsx)(`p`,{className:`mt-1 text-sm text-[var(--gwb-muted)]`,children:t.teamName}),(0,V.jsx)(`p`,{className:`mt-3 font-['Anton'] text-4xl tabular-nums text-[var(--gwb-accent)]`,children:Ic(t.wes)}),(0,V.jsxs)(`p`,{className:`mt-1 text-xs text-[var(--gwb-muted)]`,children:[t.rosteredPickups,` rostered pickups · net `,Ic(t.netWaiverPoints),` · through Week `,e.scoringThrough]})]}):(0,V.jsxs)(`p`,{className:`mt-2 text-sm text-[var(--gwb-muted)]`,children:[`No manager has `,3,` rostered pickups through Week`,` `,e.scoringThrough,`.`]})]})}function Uc({board:e}){let t=e.cellar;return(0,V.jsxs)(`article`,{className:`rounded-xl border border-red-900/50 bg-red-950/30 p-4`,children:[(0,V.jsx)(`p`,{className:`text-xs font-semibold uppercase tracking-[0.16em] text-red-200`,children:`Waiver Wire Cellar`}),t?(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`h3`,{className:`mt-1 font-['Anton'] text-3xl uppercase leading-none text-red-100`,children:t.displayName}),(0,V.jsx)(`p`,{className:`mt-1 text-sm text-red-200/80`,children:t.teamName}),(0,V.jsx)(`p`,{className:`mt-3 font-['Anton'] text-4xl tabular-nums text-red-200`,children:Ic(t.wes)}),(0,V.jsxs)(`p`,{className:`mt-1 text-xs text-red-200/70`,children:[`Last in the pool · net `,Ic(t.netWaiverPoints),` · through Week`,` `,e.scoringThrough]})]}):(0,V.jsx)(`p`,{className:`mt-2 text-sm text-red-200/80`,children:`The cellar chip appears once two managers are in the pool.`})]})}function Wc({board:e,name:t,managerName:n}){let r=e.pickupOfWeek;return(0,V.jsxs)(`article`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-4`,children:[(0,V.jsx)(`p`,{className:`text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gwb-muted)]`,children:`Pickup of the Week`}),e.selectedWeekComplete?r?(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`h3`,{className:`mt-1 text-xl font-semibold`,children:t(r.playerId)}),(0,V.jsx)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:n(r.rosterId)}),(0,V.jsx)(`p`,{className:`mt-2 text-2xl font-semibold tabular-nums text-[var(--gwb-accent)]`,children:Ic(r.points)}),(0,V.jsxs)(`p`,{className:`text-xs text-[var(--gwb-muted)]`,children:[`Started in Week `,r.week]})]}):(0,V.jsxs)(`p`,{className:`mt-2 text-sm text-[var(--gwb-muted)]`,children:[`No pickup started in Week `,e.selectedWeek,`.`]}):(0,V.jsxs)(`p`,{className:`mt-2 text-sm text-[var(--gwb-muted)]`,children:[`Week `,e.selectedWeek,` is still scoring.`]})]})}function Gc({board:e,name:t,managerName:n}){let r=e.worstDropOfWeek;return(0,V.jsxs)(`article`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-4`,children:[(0,V.jsx)(`p`,{className:`text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gwb-muted)]`,children:`Worst Drop`}),e.selectedWeekComplete?r&&r.startedByRosterId!=null?(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`h3`,{className:`mt-1 text-xl font-semibold`,children:t(r.playerId)}),(0,V.jsxs)(`p`,{className:`mt-1 text-sm`,children:[`Dropped by `,n(r.rosterId)]}),(0,V.jsxs)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:[`Started by `,n(r.startedByRosterId),` for `,Ic(r.points)]})]}):(0,V.jsxs)(`p`,{className:`mt-2 text-sm text-[var(--gwb-muted)]`,children:[`No dropped player started for someone else in Week `,e.selectedWeek,`.`]}):(0,V.jsxs)(`p`,{className:`mt-2 text-sm text-[var(--gwb-muted)]`,children:[`Week `,e.selectedWeek,` is still scoring.`]})]})}function Kc({board:e}){return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`div`,{className:`space-y-2 sm:hidden`,children:e.weeklyRanking.map((e,t)=>(0,V.jsxs)(`article`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5`,children:[(0,V.jsxs)(`div`,{className:`flex items-baseline justify-between gap-3`,children:[(0,V.jsxs)(`p`,{className:`font-medium`,children:[(0,V.jsx)(`span`,{className:`mr-2 text-[var(--gwb-accent)]`,children:t+1}),e.displayName]}),(0,V.jsx)(`p`,{className:`tabular-nums font-semibold`,children:Ic(e.weeklyNet)})]}),(0,V.jsxs)(`p`,{className:`mt-1 text-xs text-[var(--gwb-muted)]`,children:[`Started `,Ic(e.weeklyStarted),` · drop regret `,Ic(e.weeklyRegret)]})]},e.rosterId))}),(0,V.jsx)(`div`,{className:`hidden overflow-x-auto rounded-xl border border-[var(--gwb-border)] sm:block`,children:(0,V.jsxs)(`table`,{className:`w-full text-left text-sm`,children:[(0,V.jsx)(`thead`,{className:`bg-[var(--gwb-surface)] text-xs uppercase tracking-wider text-[var(--gwb-muted)]`,children:(0,V.jsxs)(`tr`,{children:[(0,V.jsx)(`th`,{className:`px-3 py-2`,children:`#`}),(0,V.jsx)(`th`,{className:`px-3 py-2`,children:`Manager`}),(0,V.jsx)(`th`,{className:`px-3 py-2 text-right`,children:`Started`}),(0,V.jsx)(`th`,{className:`px-3 py-2 text-right`,children:`Drop regret`}),(0,V.jsx)(`th`,{className:`px-3 py-2 text-right`,children:`Net`})]})}),(0,V.jsx)(`tbody`,{children:e.weeklyRanking.map((e,t)=>(0,V.jsxs)(`tr`,{className:`border-t border-[var(--gwb-border)] odd:bg-[#0d1319]`,children:[(0,V.jsx)(`td`,{className:`px-3 py-2.5 font-semibold text-[var(--gwb-accent)]`,children:t+1}),(0,V.jsxs)(`td`,{className:`px-3 py-2.5`,children:[(0,V.jsx)(`div`,{className:`font-medium`,children:e.displayName}),(0,V.jsx)(`div`,{className:`text-xs text-[var(--gwb-muted)]`,children:e.teamName})]}),(0,V.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums`,children:Ic(e.weeklyStarted)}),(0,V.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums`,children:Ic(e.weeklyRegret)}),(0,V.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums font-semibold`,children:Ic(e.weeklyNet)})]},e.rosterId))})]})})]})}function qc({board:e}){return(0,V.jsxs)(V.Fragment,{children:[(0,V.jsx)(`div`,{className:`space-y-2 sm:hidden`,children:e.managers.map(e=>(0,V.jsx)(Jc,{row:e},e.rosterId))}),(0,V.jsx)(`div`,{className:`hidden overflow-x-auto rounded-xl border border-[var(--gwb-border)] sm:block`,children:(0,V.jsxs)(`table`,{className:`w-full min-w-[880px] text-left text-sm`,children:[(0,V.jsx)(`thead`,{className:`bg-[var(--gwb-surface)] text-xs uppercase tracking-wider text-[var(--gwb-muted)]`,children:(0,V.jsxs)(`tr`,{children:[(0,V.jsx)(`th`,{className:`px-3 py-2`,children:`#`}),(0,V.jsx)(`th`,{className:`px-3 py-2`,children:`Manager`}),(0,V.jsx)(`th`,{className:`px-3 py-2 text-right`,children:`WES`}),(0,V.jsx)(`th`,{className:`px-3 py-2 text-right`,children:`Started`}),(0,V.jsx)(`th`,{className:`px-3 py-2 text-right`,children:`Bench`}),(0,V.jsx)(`th`,{className:`px-3 py-2 text-right`,children:`Pickups`}),(0,V.jsx)(`th`,{className:`px-3 py-2 text-right`,children:`Rostered`}),(0,V.jsx)(`th`,{className:`px-3 py-2 text-right`,children:`Pts/pickup`}),(0,V.jsx)(`th`,{className:`px-3 py-2 text-right`,children:`Hit`}),(0,V.jsx)(`th`,{className:`px-3 py-2 text-right`,children:`Net`}),(0,V.jsx)(`th`,{className:`px-3 py-2 text-right`,children:`Regret`}),(0,V.jsx)(`th`,{className:`px-3 py-2 text-right`,children:`Failed`}),(0,V.jsx)(`th`,{className:`px-3 py-2 text-right`,children:`Priority`})]})}),(0,V.jsx)(`tbody`,{children:e.managers.map(t=>(0,V.jsxs)(`tr`,{className:`border-t border-[var(--gwb-border)] odd:bg-[#0d1319] ${e.champion?.rosterId===t.rosterId?`outline outline-2 -outline-offset-2 outline-[var(--gwb-accent)]`:e.cellar?.rosterId===t.rosterId?`outline outline-2 -outline-offset-2 outline-red-400/70`:``}`,children:[(0,V.jsx)(`td`,{className:`px-3 py-2.5 font-semibold text-[var(--gwb-accent)]`,children:t.poolRank??`—`}),(0,V.jsxs)(`td`,{className:`px-3 py-2.5`,children:[(0,V.jsxs)(`div`,{className:`font-medium`,children:[t.displayName,` `,!t.eligible&&(0,V.jsx)(`span`,{className:`ml-1 rounded bg-[var(--gwb-border)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--gwb-muted)]`,children:`Small sample`})]}),(0,V.jsx)(`div`,{className:`text-xs text-[var(--gwb-muted)]`,children:t.teamName})]}),(0,V.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums font-semibold`,children:Ic(t.wes)}),(0,V.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums`,children:Ic(t.startedPoints)}),(0,V.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums`,children:Ic(t.benchPoints)}),(0,V.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums`,children:t.pickupCount}),(0,V.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums`,children:t.rosteredPickups}),(0,V.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums`,children:Ic(t.pointsPerPickup)}),(0,V.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums`,children:Lc(t)}),(0,V.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums`,children:Ic(t.netWaiverPoints)}),(0,V.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums`,children:Ic(t.dropRegret)}),(0,V.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums`,children:t.failedClaims}),(0,V.jsx)(`td`,{className:`px-3 py-2.5 text-right tabular-nums`,children:t.waiverPriority??`—`})]},t.rosterId))})]})})]})}function Jc({row:e}){return(0,V.jsxs)(`article`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5`,children:[(0,V.jsxs)(`div`,{className:`flex items-start justify-between gap-3`,children:[(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`p`,{className:`font-medium`,children:[e.poolRank!=null&&(0,V.jsx)(`span`,{className:`mr-2 text-[var(--gwb-accent)]`,children:e.poolRank}),e.displayName]}),(0,V.jsx)(`p`,{className:`text-xs text-[var(--gwb-muted)]`,children:e.teamName}),!e.eligible&&(0,V.jsx)(`p`,{className:`mt-1 text-[10px] uppercase tracking-wide text-[var(--gwb-muted)]`,children:`Small sample`})]}),(0,V.jsx)(`p`,{className:`font-['Anton'] text-2xl tabular-nums text-[var(--gwb-accent)]`,children:Ic(e.wes)})]}),(0,V.jsxs)(`p`,{className:`mt-2 text-xs text-[var(--gwb-muted)]`,children:[`Started `,Ic(e.startedPoints),` · `,e.pickupCount,` pickups · net `,Ic(e.netWaiverPoints),` ·`,` `,e.failedClaims,` failed`]}),(0,V.jsxs)(`p`,{className:`mt-1 text-xs text-[var(--gwb-muted)]`,children:[`Bench `,Ic(e.benchPoints),` · `,Ic(e.pointsPerPickup),` / pickup · hit `,Lc(e),` · regret `,Ic(e.dropRegret),` · priority `,e.waiverPriority??`—`]})]})}function Yc({move:e,who:t,name:n}){let r=Fc.format(new Date(e.statusUpdated)),i=e.adds.map(n).join(`, `),a=e.drops.map(n).join(`, `);return(0,V.jsxs)(`li`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5 text-sm`,children:[(0,V.jsxs)(`div`,{className:`flex flex-wrap items-baseline justify-between gap-2`,children:[(0,V.jsxs)(`p`,{className:`font-medium`,children:[i&&(0,V.jsxs)(`span`,{children:[`Added `,i]}),i&&a&&(0,V.jsx)(`span`,{className:`text-[var(--gwb-muted)]`,children:` · `}),a&&(0,V.jsxs)(`span`,{children:[`Dropped `,a]}),!i&&!a&&(0,V.jsx)(`span`,{children:`Roster move`})]}),e.status===`failed`?(0,V.jsx)(`span`,{className:`text-xs uppercase tracking-wide text-red-200`,children:`Failed`}):e.pending?(0,V.jsx)(`span`,{className:`text-xs uppercase tracking-wide text-amber-200`,children:`Pending`}):(0,V.jsx)(`span`,{className:`tabular-nums text-[var(--gwb-accent)]`,children:e.startedPoints==null?``:`${Ic(e.startedPoints)} started`})]}),(0,V.jsxs)(`p`,{className:`mt-1 text-xs text-[var(--gwb-muted)]`,children:[t,` · Week `,e.leg,` · `,e.type===`free_agent`?`Free agent`:`Waiver`,` · `,r,` ET`]}),e.status===`failed`&&e.notes&&(0,V.jsx)(`p`,{className:`mt-1 text-xs text-[var(--gwb-muted)]`,children:e.notes})]})}function Xc(e,t,n){let r=t.filter(e=>e.roster_id!==n).map(e=>e.points);return r.length===0?``:`All-play: would have beaten ${r.filter(t=>e>t).length} of ${r.length} teams.`}function Zc(e){if(!e.length)return null;let t=e[0],n=e[0],r=e[0].teamA.teamName,i=e[0].teamA.points;for(let a of e){a.margin>t.margin&&(t=a),a.margin<n.margin&&(n=a);for(let e of[a.teamA,a.teamB])e.points>i&&(i=e.points,r=e.teamName)}let a=e=>{let t=e.teamA.points>=e.teamB.points?e.teamA:e.teamB,n=e.teamA.points>=e.teamB.points?e.teamB:e.teamA;return`${t.teamName} over ${n.teamName}`};return{biggestWin:{label:a(t),margin:t.margin},closestGame:{label:a(n),margin:n.margin},highestScore:{label:r,points:i}}}function Qc({receipt:e}){return(0,V.jsxs)(`div`,{className:`rounded-xl border border-[var(--gwb-accent)]/40 bg-[#1a1608] px-4 py-3 text-sm`,children:[(0,V.jsx)(`p`,{className:`mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--gwb-accent)]`,children:`Receipt of the week`}),(0,V.jsxs)(`ul`,{className:`space-y-1 text-[var(--gwb-text)]`,children:[(0,V.jsxs)(`li`,{children:[`Biggest win: `,e.biggestWin.label,` (`,e.biggestWin.margin.toFixed(1),` pts)`]}),(0,V.jsxs)(`li`,{children:[`Closest game: `,e.closestGame.label,` (`,e.closestGame.margin.toFixed(1),` pts)`]}),(0,V.jsxs)(`li`,{children:[`High score: `,e.highestScore.label,` (`,e.highestScore.points.toFixed(1),` pts)`]})]})]})}function $c({recaps:e,week:t,hasScores:n,isLive:r,weekMatchups:i,playersLoading:a}){if(!n)return(0,V.jsxs)(`p`,{className:`rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]`,children:[`No scored matchups for Week `,t,` yet. Check back after lineups lock or try an earlier week.`]});if(a)return(0,V.jsx)(`p`,{className:`rounded-xl border border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]`,children:`Loading player names for recap details…`});let o=Zc(e);return(0,V.jsxs)(`div`,{className:`space-y-4`,children:[o&&!r&&(0,V.jsx)(Qc,{receipt:o}),!e.length&&r&&(0,V.jsx)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:`Live matchup lineups are on the Live tab — full recap cards appear when the week is final.`}),!r&&e.map(e=>(0,V.jsxs)(`article`,{className:`rounded-xl border p-4 ${e.isMatchupOfTheWeek?`border-[var(--gwb-accent)] bg-[#1a1608]`:`border-[var(--gwb-border)] bg-[var(--gwb-surface)]`}`,children:[e.isMatchupOfTheWeek&&(0,V.jsx)(`p`,{className:`mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--gwb-accent)]`,children:`Matchup of the week`}),(0,V.jsxs)(`div`,{className:`flex flex-wrap items-baseline justify-between gap-2`,children:[(0,V.jsxs)(`h3`,{className:`text-lg font-semibold`,children:[e.teamA.teamName,` `,(0,V.jsx)(`span`,{className:`text-[var(--gwb-accent)]`,children:e.teamA.points.toFixed(1)}),(0,V.jsx)(`span`,{className:`mx-2 text-[var(--gwb-muted)]`,children:`vs`}),e.teamB.teamName,` `,(0,V.jsx)(`span`,{className:`text-[var(--gwb-accent)]`,children:e.teamB.points.toFixed(1)})]}),e.tags.length>0&&(0,V.jsx)(`div`,{className:`flex gap-2`,children:e.tags.map(e=>(0,V.jsx)(`span`,{className:`rounded-full bg-[#243040] px-2 py-0.5 text-xs uppercase`,children:e},e))})]}),!r&&(0,V.jsx)(`p`,{className:`mt-2 text-sm text-[var(--gwb-muted)]`,children:e.narrative}),e.starsLine&&!r&&(0,V.jsx)(`p`,{className:`mt-1 text-sm text-[var(--gwb-text)]`,children:e.starsLine}),i&&!r&&(0,V.jsx)(`p`,{className:`mt-1 text-xs text-[var(--gwb-muted)]`,children:Xc(e.teamA.points,i,e.teamA.rosterId)}),!r&&(0,V.jsxs)(`dl`,{className:`mt-3 grid gap-2 text-sm sm:grid-cols-2`,children:[(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`dt`,{className:`text-xs uppercase text-[var(--gwb-muted)]`,children:[`Top scorer · `,e.teamA.teamName]}),(0,V.jsx)(`dd`,{children:e.teamA.topScorer?`${e.teamA.topScorer.name} · ${e.teamA.topScorer.points.toFixed(1)}`:`—`})]}),(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`dt`,{className:`text-xs uppercase text-[var(--gwb-muted)]`,children:[`Top scorer · `,e.teamB.teamName]}),(0,V.jsx)(`dd`,{children:e.teamB.topScorer?`${e.teamB.topScorer.name} · ${e.teamB.topScorer.points.toFixed(1)}`:`—`})]}),(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`dt`,{className:`text-xs uppercase text-[var(--gwb-muted)]`,children:[`Bench miss · `,e.teamA.teamName]}),(0,V.jsx)(`dd`,{children:e.teamA.benchMiss?.message??`—`})]}),(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`dt`,{className:`text-xs uppercase text-[var(--gwb-muted)]`,children:[`Bench miss · `,e.teamB.teamName]}),(0,V.jsx)(`dd`,{children:e.teamB.benchMiss?.message??`—`})]})]})]},e.matchupId))]})}var el={throughWeek:4,weekNote:``,entries:[{id:`w1-mauricio`,week:1,rosterId:2,manager:`Mauricio`,team:`Los Yajesitos`,out:{name:`A.J. Brown`,position:`WR`,points:5.6},in:{name:`Tre Tucker`,position:`WR`,points:4.7},netImpact:-.9,scoreWith:137.1,scoreWithout:138,opponentScore:124.51,opponentLabel:`Jesus`,won:!0,flipped:!1,footnote:`Won anyway; the swap actually cost 0.9.`},{id:`w2-manny`,week:2,rosterId:9,manager:`Manny`,team:`Mnny`,out:{name:`Caleb Williams`,position:`QB`,points:8.45},in:{name:`Patrick Mahomes`,position:`QB`,points:45.29},netImpact:36.84,scoreWith:183.99,scoreWithout:147.15,opponentScore:138.89,opponentLabel:`Jamil`,won:!0,flipped:!1},{id:`w2-matt`,week:2,rosterId:12,manager:`Matt`,team:`Gibbs & Grind`,out:{name:`DJ Moore`,position:`WR`,points:-.1},in:{name:`Malachi Fields`,position:`WR`,points:5},netImpact:5.1,scoreWith:130.52,scoreWithout:125.42,opponentScore:134.93,opponentLabel:`Steven`,won:!1,flipped:!1,footnote:`The first failed mulligan.`},{id:`w3-narking`,week:3,rosterId:3,manager:`NarkingR`,team:`Put em down Jeanty`,out:{name:`De'Von Achane`,position:`RB`,points:1.7,note:`knee`},in:{name:`Travis Etienne`,position:`RB`,points:9},netImpact:7.3,netImpactOverride:5.3,scoreWith:136.7,scoreWithout:131.4,opponentScore:167.66,opponentLabel:`Darkseid Jackson`,won:!1,flipped:!1},{id:`w3-danny`,week:3,rosterId:1,manager:`Santagua`,managerShort:`Danny`,team:`Lambs2Slaughter`,out:{name:`Rashod Bateman`,position:`WR`,points:5.7},in:{name:`Dontayvion Wicks`,position:`WR`,points:5.2},netImpact:-.5,scoreWith:121.69,scoreWithout:122.19,opponentScore:131.97,opponentLabel:`Hadi`,won:!1,flipped:!1},{id:`w4-jesus`,week:4,rosterId:8,manager:`kingCrooke`,managerShort:`Jesus`,team:`Darkseid Jackson`,out:{name:`Parker Washington`,position:`WR`,points:2,team:`JAX`},in:{name:`Mike Evans`,position:`WR`,points:12.6,team:`SF`},netImpact:10.6,scoreWith:121.27,scoreWithout:110.67,opponentScore:163.91,opponentLabel:`Lambs2Slaughter`,won:!1,flipped:!1},{id:`w4-kayser`,week:4,rosterId:4,manager:`powpeazy`,managerShort:`Kayser`,team:`The Special One`,out:{name:`Rashee Rice`,position:`WR`,points:0,team:`KC`,note:`hamstring`},in:{name:`Brycen Tremayne`,position:`WR`,points:5.2,team:`CAR`},netImpact:5.2,scoreWith:128.44,scoreWithout:123.24,opponentScore:127.4,opponentLabel:`Turn Your Head And Goff`,won:!0,flipped:!0,resultPending:!0,footnote:`PENDING MNF — Frankie still has Devaughn Vele (NO). Current lead 1.04; without mulligan would trail by 4.16.`}]};function tl(e){return e.settings.last_scored_leg??e.settings.leg??0}function nl(e){return e.week??e.display_week??1}function rl(e,t){let n=tl(e);if(n>0)return n;let r=nl(t);return Math.max(1,r-1)}function il(e,t,n){let r=nl(n),i=tl(t);return e>=r&&e>i}function al(e,t,n){return!il(e,t,n)&&e<=nl(n)}function ol(e,t,n){return il(e,t,n)?`LIVE`:`FINAL`}function sl(e,t,n){return il(e,t,n)?rl(t,n):e}function cl(e,t,n){return ll(e,t,n,`standings`)}function ll(e,t,n,r){return il(e,t,n)?`Week ${e} in progress, ${r} through Week ${rl(t,n)}.`:null}var ul=el,dl=ul.entries,fl={throughWeek:ul.throughWeek,weekNote:ul.weekNote};function pl(e,t){return dl.find(n=>n.rosterId===e&&n.week<=t)}function ml(e,t=1/0){let n=pl(e,t);return n?{rosterId:e,used:!0,usedDetail:`Week ${n.week} — ${Ol(n)}`}:{rosterId:e,used:!1}}function hl(e,t){if(e.in.pointsPending&&t)return{playerPoints:t}}function gl(e){return dl.filter(t=>t.week===e).sort((e,t)=>e.rosterId-t.rosterId)}function _l(e){return dl.filter(t=>t.week<=e).length}function vl(e){return dl.filter(t=>t.week<=e&&t.flipped).length}function yl(e,t){if(!e.pointsPending)return e.points;let n=e.sleeperPlayerId;return t?.playerPoints&&n&&n in t.playerPoints?t.playerPoints[n]:null}function bl(e,t){if(e.netImpactPending||e.in.pointsPending){let n=yl(e.in,t);return n===null?null:n-e.out.points}return e.netImpactOverride===void 0?e.netImpact:e.netImpactOverride}function xl(e,t){if(e.pointsPending){let n=yl(e,t);return n===null?`pending`:`${El(n)} (live)`}return El(e.points)}function Sl(e,t){let n=bl(e,t);return n===null?`pending`:Dl(n)}function Cl(e,t){let n=bl(e,t);return n===null?e.scoreWith:e.scoreWithout+n}function wl(e,t){let n=e.managerShort??e.manager,r=e.out.note?` (${e.out.note})`:``,i=e.resultPending?`TBD`:e.won?`W`:`L`,a=Cl(e,t);return`${n} · OUT ${e.out.name} ${El(e.out.points)}${r} → IN ${e.in.name} ${xl(e.in,t)} · Net ${Sl(e,t)} · ${i} ${El(a)}–${El(e.opponentScore)}`}function Tl(e){return e.used?e.usedDetail?`Used — ${e.usedDetail}`:`Used`:`Available`}function El(e){return e.toFixed(2)}function Dl(e){return`${e>=0?`+`:`−`}${El(Math.abs(e))}`}function Ol(e,t){return`${e.out.name} → ${e.in.name} (${Sl(e,t)})`}function kl(e,t){let n=fl.throughWeek;return Math.max(e,Math.min(t,n))}function Al(e,t,n,r){if(!il(e,t,n))return null;let i=kl(r,e);return i>rl(t,n)?`Week ${e} in progress. Mulligan status live through Week ${i}.`:`Week ${e} in progress, mulligan status through Week ${i}.`}function jl(e,t){let n=e.managerShort?`${e.manager} / ${e.managerShort}`:e.manager,r=e.out.note?` (${e.out.note})`:``,i=`${El(Cl(e,t))}–${El(e.opponentScore)}`,a=e.resultPending?`Result TBD`:e.won?`Won`:`Lost`,o=e.resultPending||e.won?`vs`:`to`,s=e.flipped?`Flipped result`:`No flip`,c=e.footnote?` · ${e.footnote}`:``,l=e.out.team?` ${e.out.team}`:``,u=e.in.team?` ${e.in.team}`:``;return`W${e.week} · ${n} (${e.team}) · OUT ${e.out.name} ${e.out.position}${l} ${El(e.out.points)}${r} → IN ${e.in.name} ${e.in.position}${u} ${xl(e.in,t)} · Net ${Sl(e,t)} · ${a} ${i} ${o} ${e.opponentLabel} (would've been ${El(e.scoreWithout)} without it) · ${s}${c}`}var Ml=12;function Nl({used:e}){return(0,V.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,"aria-label":`${e} of ${Ml} mulligans used`,children:[(0,V.jsx)(`div`,{className:`flex gap-1`,children:Array.from({length:Ml},(t,n)=>(0,V.jsx)(`span`,{className:`h-3 w-3 rounded-full border ${n<e?`border-amber-400 bg-amber-400`:`border-[var(--gwb-border)] bg-[#0d1319]`}`,"aria-hidden":!0},n))}),(0,V.jsxs)(`span`,{className:`text-xs text-[var(--gwb-muted)]`,children:[e,` used · `,Ml-e,` left`]})]})}function Pl({rows:e,selectedWeek:t,statusThroughWeek:n,deferralNote:r,weekMatchups:i,onNegativeMulliganOpen:a}){let o=gl(t),s=_l(n),c=vl(n),l=[...e].sort((e,t)=>e.teamName.localeCompare(t.teamName)),u=`${c} of ${s} flipped a result.`;return(0,V.jsxs)(`div`,{id:`mulligans-section`,className:`space-y-6`,children:[r&&(0,V.jsx)(`p`,{className:`rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100`,children:r}),(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`h3`,{className:`mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]`,children:`Mulligan status`}),(0,V.jsx)(Nl,{used:s}),(0,V.jsxs)(`p`,{className:`mb-3 mt-2 text-xs text-[var(--gwb-muted)]`,children:[`One per manager per season through Week `,n,`. `,u,n>=fl.throughWeek&&fl.weekNote?` ${fl.weekNote}`:``]}),(0,V.jsx)(`div`,{className:`overflow-x-auto rounded-xl border border-[var(--gwb-border)]`,children:(0,V.jsxs)(`table`,{className:`w-full min-w-[360px] text-left text-sm`,children:[(0,V.jsx)(`thead`,{className:`bg-[var(--gwb-surface)] text-[var(--gwb-muted)] uppercase text-xs tracking-wider`,children:(0,V.jsxs)(`tr`,{children:[(0,V.jsx)(`th`,{className:`px-3 py-2`,children:`Manager`}),(0,V.jsx)(`th`,{className:`px-3 py-2`,children:`Mulligan`})]})}),(0,V.jsx)(`tbody`,{children:l.map(e=>{let t=ml(e.rosterId,n);return(0,V.jsxs)(`tr`,{className:`border-t border-[var(--gwb-border)] odd:bg-[#0d1319]`,children:[(0,V.jsxs)(`td`,{className:`px-3 py-2.5`,children:[(0,V.jsx)(`div`,{className:`font-medium`,children:e.teamName}),(0,V.jsx)(`div`,{className:`text-xs text-[var(--gwb-muted)]`,children:us(e.rosterId,e.displayName)})]}),(0,V.jsx)(`td`,{className:`px-3 py-2.5 text-sm ${t.used?`text-amber-300`:`text-[var(--gwb-muted)]`}`,children:Tl(t)})]},e.rosterId)})})]})})]}),(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`h3`,{className:`mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-muted)]`,children:[`Week `,t,` mulligans`]}),o.length===0?(0,V.jsxs)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:[`No mulligans used in Week `,t,`.`]}):(0,V.jsx)(`ul`,{className:`space-y-3`,children:o.map(e=>{let t=i?.find(t=>t.roster_id===e.rosterId),n=hl(e,t?.players_points);return(0,V.jsx)(Fl,{entry:e,liveCtx:n,onOpen:a},e.id)})})]})]})}function Fl({entry:e,liveCtx:t,onOpen:n}){let r=bl(e,t),i=r!==null&&r<0;return(0,V.jsxs)(`li`,{className:`rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5 text-sm`,onClick:()=>{i&&n?.()},children:[(0,V.jsx)(`p`,{className:`font-medium text-[var(--gwb-text)]`,children:wl(e,t)}),(0,V.jsx)(`p`,{className:`mt-1 text-xs leading-snug text-[var(--gwb-muted)]`,children:jl(e,t)})]})}function Il({label:e,pressed:t,showTapHint:n,onToggle:r}){return(0,V.jsxs)(`div`,{className:`flex flex-col items-end gap-1`,children:[(0,V.jsxs)(`button`,{type:`button`,className:`inline-flex items-center gap-2 rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-1.5 text-sm font-medium text-[var(--gwb-text)] hover:border-[var(--gwb-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gwb-accent)]`,"aria-pressed":t,"aria-label":e,onClick:r,children:[(0,V.jsx)(`span`,{"aria-hidden":`true`,children:t?`🔊`:`🔇`}),e]}),n&&(0,V.jsx)(`p`,{className:`max-w-[11rem] text-right text-[10px] leading-snug text-[var(--gwb-muted)] sm:max-w-none sm:text-xs`,"aria-live":`polite`,children:`Tap anywhere for sound`})]})}var Ll={"results-w1-m1":`FINAL WIAURIUIU TAREQ II`,"results-w1-m2":`PINE MORE Prine FE`,"results-w1-m3":`FINAL WIKTT TARE II`,"results-w1-m4":`FINAL UANIL TARE Il`,"results-w1-m5":`STEVEN 199.4 — 135.4 FRANKIE`,"results-w1-m6":`FINAL WIANNY tAREO II`,"results-w2-m1":`PENME FADE PANE EE`,"results-w2-m2":`FINAL NAHRING TAREO II`,"results-w2-m3":`i Neate os SA FN.  PEE FAG FERS I`,"results-w2-m4":`riNAL- DIEVEN IANEO Il`,"results-w2-m5":`FINAL WIANNY tAREO II`,"results-w2-m6":`FINAL ENIG TARE II`,"results-w3-m1":`FINAL UHUURE TARE II`,"results-w3-m2":`HADI 132.0 — 121.7 DANNY`,"results-w3-m3":`FINAL OLEVEN IAREQ II`,"results-w3-m4":`FINAL RATOER IANEO II`,"results-w3-m5":`FINAL EMG TARE II`,"results-w3-m6":`FINAL JAIL IAREO Il`,"vs-m1-narking-steven":`NANNING VO OLEVEN`,"vs-m2-kayser-frankie":`KAYSER 3-0 vs FRANKIE 0-3`,"vs-m3-hadi-manny":`HADI 2-1 VS MANNY 2-1`,"vs-m4-jamil-matt":`64 A al   VRE A ee A PO ON WS 7 SER`,"vs-m5-mauricio-eric":`MAURICIO 1-2 vs ERIC 2-1`,"vs-m6-danny-crooke":`DANNY Vo UNUURE`,"w1-slide-01":`We are so back`,"w1-slide-02":`ONE POINT FROM200`,"w1-slide-03":`SLAUGHTER`,"w1-slide-04":`158 POINTS.`,"w1-slide-05":`Kayser 138.69. Ceremonial loss -`,"w1-slide-06":`Manny's team DOESN'T HAVE-A NAME`,"w1-slide-07":`STATE OF THE LEAGUE`,"w1-slide-08":`STEVEN 199.39`,"w1-slide-09":`MATT 175.08`,"w1-slide-10":`JAMIL 171.70`,"w1-slide-11":`Hie A ob 293 M7 ADD`,"w1-slide-12":`TAR Staak eH HK 1 27 A 4`,"w1-slide-13":`MANNY 133.22`,"w1-slide-14":`FINAL DAMAGE`,"w1-slide-15":`Sacko Watch Leader`,"w1-slide-16":`OVERREACTIONS`,"w2-slide-01":`Week 2 final report`,"w2-slide-02":`THE MULLIGAN`,"w2-slide-03":`Improved the score. STILL LOST.`,"w2-slide-04":`The Special One's statement`,"w2-slide-05":`ZERO. POINT EIGHT NINBy`,"w2-slide-06":`UNEXPLAINED`,"w2-slide-07":`STATE OF THE LEAGUE`,"w2-slide-08":`MANNY 183.99`,"w2-slide-09":`KAYSER 170.91`,"w2-slide-10":`fj EI Campeon de la Liga 151.04`,"w2-slide-11":`STEVEN 134.93`,"w2-slide-12":`Ne ee OA ed em erie Are 1419`,"w2-slide-13":`NARKING 131.93`,"w2-slide-14":`FINAL DAMAGE`,"w2-slide-15":`Mulligan of the Year so far`,"w2-slide-16":`LOOKAHEAD`,"w3-slide-01":`Week 3 final report`,"w3-slide-02":`AGAIN.`,"w3-slide-03":`THE NEGATIVE`,"w3-slide-04":`DARKSEID JACKSON. Immediately 167.66.`,"w3-slide-05":`FRANKIE CALLED`,"w3-slide-06":`STILL LOST 130.39 to 128.57.`,"w3-slide-07":`STATE OF THE LEAGUE`,"w3-slide-08":`STEVEN 199.19`,"w3-slide-09":`KAYSER 151.93`,"w3-slide-10":`CROOKE 167.66`,"w3-slide-11":`Gri OR Pe ae aT 279341 2a`,"w3-slide-12":`oT ie Po Lee 350 F&I`,"w3-slide-13":`JAMIL 113.55`,"w3-slide-14":`FINAL DAMAGE`,"w3-slide-15":`Negative Mulligan`,"w3-slide-16":`Mulligan ledger — second negative swap`,"w4-slide-01":`Waivers, injuries & panic`,"w4-slide-02":`DONE FOR THE YEAR.`,"w4-slide-03":`Jamil lands OLLIE GORDON -`,"w4-slide-04":`THE REST OF THE WIRE`,"w4-slide-05":`That's HALF THE LEAGUE swinging`,"w4-slide-06":`DULIV`,"w4-slide-07":`STATE OF THE LEAGUE`,"w4-slide-08":`NARKING vs STEVEN`,"w4-slide-09":`KAYSER VS FRANKIE`,"w4-slide-10":`EPs BO BPEPEeeee &`,"w4-slide-11":`Hurts QB5 K. Walker Bucky Puka DeVonta.`,"w4-slide-12":`MAURICIO vs ERIC`,"w4-slide-13":`Kendre Packers D NEW KICKER.`,"w4-slide-14":`Qh Thm ViEBUN`,"w4-slide-15":`HIGHEST UPSIDE`,"w4-slide-16":`THE PICKS`};function Rl(e,t){let n=Ll[e]?.trim();return!n||n===e||/^Slide \d+$/i.test(n)?t:n}var zl=new Set(ic.map(e=>e.id));function Bl(e){return e.filter(e=>!zl.has(e.id))}function Vl(e){return Hl(e).flatMap(e=>e.slides)}function Hl(e){let t=[];if(e===4){let e=Bl($l);e.length&&t.push({kind:`matchups`,heading:`Matchups`,slides:e});let n=Bl(Ql);return n.length&&t.push({kind:`report`,heading:`Report`,slides:n}),t}let n={1:Bl(eu),2:Bl(tu),3:Bl(nu)}[e];n?.length&&t.push({kind:`results`,heading:`Results`,slides:n});let r={1:Bl(ql),2:Bl(Jl),3:Bl(Yl)}[e];return r?.length&&t.push({kind:`report`,heading:`Report`,slides:r}),t}var Ul={width:1080,height:1350};function Wl(e,t){return{id:e,title:Rl(e,t),basename:e,...Ul}}function W(e,t){return Wl(e,t)}function Gl(e,t,n){return Wl(`w${e}-slide-${String(t).padStart(2,`0`)}`,n)}function Kl(e,t){return t.map((t,n)=>Gl(e,n+1,t))}var ql=Kl(1,[`We are so back`,`Slide 2`,`Slide 3`,`Slide 4`,`Slide 5`,`Slide 6`,`Slide 7`,`Slide 8`,`Slide 9`,`Slide 10`,`Slide 11`,`Slide 12`,`Slide 13`,`Slide 14`,`Slide 15`,`Slide 16`]),Jl=Kl(2,[`Week 2 final report`,`Slide 2`,`Slide 3`,`Slide 4`,`Slide 5`,`Slide 6`,`Slide 7`,`Slide 8`,`Slide 9`,`Slide 10`,`Slide 11`,`Slide 12`,`Slide 13`,`Slide 14`,`Slide 15`,`Slide 16`]),Yl=Kl(3,[`Week 3 final report`,`Slide 2`,`Slide 3`,`Slide 4`,`Slide 5`,`Slide 6`,`Slide 7`,`Slide 8`,`Slide 9`,`Slide 10`,`Slide 11`,`Slide 12`,`Slide 13`,`Slide 14`,`Slide 15`,`Slide 16`]);function Xl(e,t){return Wl(e,t)}function Zl(e,t){return Wl(e,t)}var Ql=[W(`w4-slide-01`,`Waivers, injuries & panic`),W(`w4-slide-02`,`Slide 2`),W(`w4-slide-03`,`Slide 3`),W(`w4-slide-04`,`The rest of the wire`),W(`w4-slide-05`,`Slide 5`),W(`w4-slide-06`,`Slide 6`),W(`w4-slide-07`,`Slide 7`),W(`w4-slide-08`,`Slide 8`),W(`w4-slide-09`,`Slide 9`),W(`w4-slide-10`,`Hadi vs Manny (matchup 3)`),W(`w4-slide-11`,`Slide 11`),W(`w4-slide-12`,`Slide 12`),W(`w4-slide-13`,`Slide 13`),W(`w4-slide-14`,`QB heat check`),W(`w4-slide-15`,`Waiver awards`),W(`w4-slide-16`,`Crooke's picks`)],$l=[Xl(`vs-m1-narking-steven`,`Narking vs Steven`),Xl(`vs-m2-kayser-frankie`,`Kayser vs Frankie`),Xl(`vs-m3-hadi-manny`,`Hadi vs Manny`),Xl(`vs-m4-jamil-matt`,`Jamil vs Matt`),Xl(`vs-m5-mauricio-eric`,`Mauricio vs Eric`),Xl(`vs-m6-danny-crooke`,`Danny vs Crooke`)],eu=[Zl(`results-w1-m1`,`Mauricio 137.1 – Crooke 124.5`),Zl(`results-w1-m2`,`Kayser 138.7 – Hadi 119.4`),Zl(`results-w1-m3`,`Matt 175.1 – Narking 158.2`),Zl(`results-w1-m4`,`Jamil 171.7 – Danny 111.9`),Zl(`results-w1-m5`,`Steven 199.4 – Frankie 135.4`),Zl(`results-w1-m6`,`Manny 133.2 – Eric 129.1`)],tu=[Zl(`results-w2-m1`,`Hadi 151.0 – Crooke 123.7`),Zl(`results-w2-m2`,`Narking 131.9 – Mauricio 99.8`),Zl(`results-w2-m3`,`Kayser 170.9 – Danny 143.0`),Zl(`results-w2-m4`,`Steven 134.9 – Matt 130.5`),Zl(`results-w2-m5`,`Manny 184.0 – Jamil 138.9`),Zl(`results-w2-m6`,`Eric 142.7 – Frankie 105.2`)],nu=[Zl(`results-w3-m1`,`Crooke 167.7 – Narking 136.7`),Zl(`results-w3-m2`,`Hadi 132.0 – Danny 121.7`),Zl(`results-w3-m3`,`Steven 199.2 – Mauricio 123.9`),Zl(`results-w3-m4`,`Kayser 151.9 – Manny 129.7`),Zl(`results-w3-m5`,`Eric 130.4 – Matt 128.6`),Zl(`results-w3-m6`,`Jamil 113.6 – Frankie 95.8`)],ru=540,iu=675;function G({slide:e,indexInWeek:t,onOpen:n,eager:r,buttonRef:i}){let a=oc(e.basename,`thumb`,`webp`),o=oc(e.basename,`thumb`,`jpg`);return(0,V.jsxs)(`button`,{ref:i,type:`button`,className:`group block w-full overflow-hidden rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] text-left transition hover:border-[var(--gwb-accent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gwb-accent)]`,onClick:()=>n(t),"aria-label":`Open ${e.title}`,children:[(0,V.jsx)(`img`,{src:o,srcSet:`${a} ${ru}w`,sizes:`(max-width: 1024px) 50vw, 20vw`,alt:``,width:ru,height:iu,loading:r?`eager`:`lazy`,decoding:`async`,className:`aspect-[4/5] w-full bg-[#0d1319] object-cover transition group-hover:opacity-95`}),(0,V.jsx)(`p`,{className:`truncate px-2 py-1.5 text-xs text-[var(--gwb-muted)]`,children:e.title})]})}function au({week:e,initialSlideId:t,onSlideUrlChange:n,onDeckKindChange:r}){let i=(0,v.useMemo)(()=>Hl(e),[e]),a=(0,v.useMemo)(()=>Vl(e),[e]),[o,s]=(0,v.useState)(null),c=(0,v.useRef)(null),l=(0,v.useMemo)(()=>{let e=new Map;return a.forEach((t,n)=>e.set(t.id,n)),e},[a]),u=(0,v.useCallback)(e=>{s(e);let t=a[e];n?.(t?.id??null);let o=i.find(e=>e.slides.some(e=>e.id===t?.id));r?.(o?.kind??null)},[a,n,r,i]),d=(0,v.useCallback)(()=>{s(null),n?.(null),r?.(null)},[n,r]);(0,v.useEffect)(()=>{if(!t)return;let e=l.get(t);e!=null&&u(e)},[t,l,u]);let f=t=>{let n=new URLSearchParams(window.location.search);n.set(`week`,String(e)),n.set(`tab`,`gallery`),n.set(`slide`,t.id);let r=`${window.location.origin}${window.location.pathname}?${n.toString()}`;navigator.clipboard?.writeText(r)};return i.length?(0,V.jsxs)(`div`,{className:`space-y-6`,children:[(0,V.jsxs)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:[`Week `,e,` graphics. Tap a card for full size; swipe or use arrows in the viewer. Use "Copy link" on a card to deep-link this slide.`]}),(0,V.jsx)(`div`,{className:`flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-6`,children:i.map(n=>(0,V.jsxs)(`section`,{id:`graphics-week-${e}-${n.kind}`,className:`min-w-0 flex-1`,"aria-labelledby":`graphics-heading-${e}-${n.kind}`,children:[(0,V.jsx)(`h3`,{id:`graphics-heading-${e}-${n.kind}`,className:`mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--gwb-accent)]`,children:n.heading}),(0,V.jsx)(`ul`,{className:`grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2`,role:`list`,children:n.slides.map((e,r)=>{let a=l.get(e.id)??0,o=t===e.id;return(0,V.jsxs)(`li`,{className:`space-y-1`,children:[(0,V.jsx)(G,{slide:e,indexInWeek:a,onOpen:u,eager:r<4&&n.kind===i[0]?.kind,buttonRef:o?c:void 0}),(0,V.jsx)(`button`,{type:`button`,className:`w-full text-xs text-[var(--gwb-accent)] underline`,onClick:()=>f(e),children:`Copy link`})]},e.id)})})]},n.kind))}),o!==null&&(0,V.jsx)(lc,{slides:a,index:o,onClose:d,onIndexChange:e=>{s(e);let t=a[e];n?.(t?.id??null);let o=i.find(e=>e.slides.some(e=>e.id===t?.id));r?.(o?.kind??null)},returnFocusRef:c})]}):(0,V.jsxs)(`p`,{className:`rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]`,children:[`No published graphics for Week `,e,` yet. Try another week.`]})}function ou({team:e,size:t=`md`}){let n=t===`sm`?`h-8 w-8`:`h-10 w-10`,r=cu(e),[i,a]=(0,v.useState)(!e?.avatarUrl);return(0,v.useEffect)(()=>{a(!e?.avatarUrl)},[e?.avatarUrl]),i||!e?.avatarUrl?(0,V.jsx)(`div`,{className:`${n} flex shrink-0 items-center justify-center rounded-full border border-[var(--gwb-border)] bg-[#243040] text-xs font-semibold text-[var(--gwb-muted)]`,children:r}):(0,V.jsx)(`img`,{src:e.avatarUrl,alt:``,crossOrigin:`anonymous`,referrerPolicy:`no-referrer`,className:`${n} shrink-0 rounded-full border border-[var(--gwb-border)] object-cover`,onError:()=>a(!0),onLoad:e=>{let t=e.currentTarget;if(t.naturalWidth<2||t.naturalHeight<2){a(!0);return}su(t)&&a(!0)}})}function su(e){try{let t=document.createElement(`canvas`);t.width=8,t.height=8;let n=t.getContext(`2d`,{willReadFrequently:!0});if(!n)return!1;n.drawImage(e,0,0,8,8);let{data:r}=n.getImageData(0,0,8,8),i=0;for(let e=0;e<r.length;e+=4){let t=r[e],n=r[e+1],a=r[e+2];i+=(.2126*t+.7152*n+.0722*a)/255}return i/(r.length/4)<.08}catch{return!1}}function cu(e){if(!e?.teamName)return`?`;let t=e.teamName.trim().split(/\s+/).filter(Boolean);return t.length>=2?(t[0][0]+t[1][0]).toUpperCase():e.teamName.slice(0,2).toUpperCase()}function lu(e){return{pf:e.pointsFor.toFixed(2),pa:e.pointsAgainst.toFixed(2)}}function uu({streak:e}){return e?(0,V.jsx)(`span`,{className:`min-w-[2.25rem] text-center text-xs font-semibold tabular-nums ${e.startsWith(`W`)?`text-emerald-400/90`:e.startsWith(`L`)?`text-rose-400/80`:`text-[var(--gwb-muted)]`}`,children:e}):(0,V.jsx)(`span`,{className:`min-w-[2.25rem] text-center text-xs text-[var(--gwb-muted)]`,children:`—`})}function du({rows:e,deferralNote:t,teams:n,playoffTeams:r}){let i=e.length?e[e.length-1]:null,a=r&&r>0&&r<e.length?r:null;return(0,V.jsxs)(`div`,{className:`space-y-3`,children:[t&&(0,V.jsx)(`p`,{className:`rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100`,children:t}),(0,V.jsx)(`ul`,{className:`overflow-hidden rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)]`,role:`list`,"aria-label":`League standings`,children:e.map((t,r)=>{let i=n.get(t.rosterId),{pf:o,pa:s}=lu(t),c=vs(t.streak),l=us(t.rosterId,t.displayName),u=a!==null&&t.rank===a&&r<e.length-1;return(0,V.jsxs)(`li`,{children:[(0,V.jsxs)(`div`,{className:`flex items-start gap-2.5 border-t border-[var(--gwb-border)] px-3 py-2.5 first:border-t-0 sm:items-center sm:gap-3 sm:px-4 sm:py-3 ${r%2==1?`bg-[#0d1319]/60`:``}`,children:[(0,V.jsx)(`span`,{className:`w-5 shrink-0 pt-0.5 text-center text-sm font-semibold tabular-nums text-[var(--gwb-muted)] sm:w-6 sm:pt-0`,"aria-label":`Rank ${t.rank}`,children:t.rank}),(0,V.jsx)(ou,{team:i,size:`sm`}),(0,V.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,V.jsxs)(`div`,{className:`flex items-start justify-between gap-2 sm:items-center`,children:[(0,V.jsx)(`p`,{className:`min-w-0 flex-1 text-sm font-semibold leading-snug break-words sm:truncate sm:leading-tight sm:text-[15px]`,children:t.teamName}),(0,V.jsxs)(`div`,{className:`flex shrink-0 items-center gap-2 sm:hidden`,children:[(0,V.jsx)(`p`,{className:`text-sm font-semibold tabular-nums leading-tight`,children:Ss(t)}),(0,V.jsx)(uu,{streak:c})]})]}),(0,V.jsxs)(`p`,{className:`mt-0.5 text-xs leading-snug text-[var(--gwb-muted)] sm:truncate`,children:[(0,V.jsxs)(`span`,{className:`sm:hidden`,children:[l,(0,V.jsxs)(`span`,{className:`text-[var(--gwb-muted)]/80`,children:[` `,`· `,o,` PF · `,s,` PA`]})]}),(0,V.jsxs)(`span`,{className:`hidden sm:inline`,children:[l,t.displayName?(0,V.jsxs)(`span`,{className:`text-[var(--gwb-muted)]/75`,children:[` `,`· @`,t.displayName]}):null]})]})]}),(0,V.jsxs)(`div`,{className:`hidden shrink-0 items-center gap-4 sm:flex`,children:[(0,V.jsxs)(`div`,{className:`text-right`,children:[(0,V.jsx)(`p`,{className:`text-sm font-semibold tabular-nums leading-tight`,children:Ss(t)}),(0,V.jsxs)(`p`,{className:`mt-0.5 text-xs leading-tight text-[var(--gwb-muted)]`,children:[(0,V.jsx)(`span`,{children:`PF `}),(0,V.jsx)(`span`,{className:`tabular-nums`,children:o}),(0,V.jsx)(`span`,{className:`mx-1 text-[var(--gwb-border)]`,children:`·`}),(0,V.jsx)(`span`,{children:`PA `}),(0,V.jsx)(`span`,{className:`tabular-nums`,children:s})]})]}),(0,V.jsx)(uu,{streak:c})]})]}),u&&(0,V.jsxs)(`div`,{className:`flex items-center gap-2 border-t border-[var(--gwb-accent)]/35 bg-[var(--gwb-accent)]/5 px-3 py-1.5`,role:`separator`,"aria-label":`Playoff cutoff`,children:[(0,V.jsx)(`div`,{className:`h-px flex-1 bg-[var(--gwb-accent)]/40`}),(0,V.jsx)(`span`,{className:`text-[10px] font-semibold uppercase tracking-wider text-[var(--gwb-accent)]`,children:`Playoffs`}),(0,V.jsx)(`div`,{className:`h-px flex-1 bg-[var(--gwb-accent)]/40`})]})]},t.rosterId)})}),i&&(0,V.jsxs)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:[`Sacko watch: #`,i.rank,` `,i.teamName,` (`,Ss(i),`, PF`,` `,i.pointsFor.toFixed(2),`).`]})]})}var fu={entries:[]};function pu(e){let t=new Map;for(let n of e){let e=t.get(n.matchup_id)??[];e.push(n),t.set(n.matchup_id,e)}let n=[];for(let[e,r]of t){if(r.length<2)continue;let t=[...r].sort((e,t)=>e.roster_id-t.roster_id);n.push({matchupId:e,home:t[0],away:t[1]})}return n.sort((e,t)=>e.matchupId-t.matchupId)}function mu(e){return e.filter(e=>e!==`BN`&&e!==`IR`&&e!==`TAXI`&&e!==`REC`)}function hu(e){return!e||e===`0`}function gu(e){return/^[A-Z]{2,4}$/.test(e)}function _u(e,t){if(hu(e))return`Empty`;if(gu(e))return e;let n=t[e];return n?n.full_name:`Player`}function vu(e,t){if(hu(e))return`—`;if(gu(e))return`DEF`;let n=t[e];return n?`${n.position??`—`} · ${n.team??`—`}`:`—`}function yu(e,t,n){if(hu(t))return 0;let r=e.players_points?.[t];return typeof r==`number`?r:n!==null&&e.starters_points?.[n]!=null?e.starters_points[n]??0:0}function bu(e){let t=new Set(e.starters??[]);return(e.players??[]).filter(e=>!hu(e)&&!t.has(e))}function xu(e){return bu(e).reduce((t,n)=>t+yu(e,n,null),0)}function Su(e,t){return t.get(e)?.teamName??`Team ${e}`}function Cu(e,t){return e.points>t.points?e.roster_id:t.points>e.points?t.roster_id:null}var wu=fu.entries;function Tu(e,t){return`${e}-${t}`}function Eu(e){return wu.find(t=>t.matchupKey===e)}function Du(e){try{let t=new URL(e);if(t.hostname.includes(`youtu.be`)){let e=t.pathname.replace(/^\//,``).split(`/`)[0];return e?`https://www.youtube.com/embed/${e}`:null}if(t.hostname.includes(`youtube.com`)){let e=t.searchParams.get(`v`);if(e)return`https://www.youtube.com/embed/${e}`;let n=/^\/embed\/([^/?]+)/.exec(t.pathname);if(n)return`https://www.youtube.com/embed/${n[1]}`}}catch{return null}return null}function Ou(e,t){let n=new Map;for(let r=1;r<t;r++){let t=e.get(r);if(t?.length)for(let{home:e,away:r}of pu(t)){let t=n.get(e.roster_id)??{wins:0,losses:0},i=n.get(r.roster_id)??{wins:0,losses:0};e.points>r.points?(t.wins++,i.losses++):r.points>e.points&&(i.wins++,t.losses++),n.set(e.roster_id,t),n.set(r.roster_id,i)}}return n}function ku(e,t,n,r){return r.filter(r=>r.week===e&&(r.rosterId===t||r.rosterId===n))}function Au(e){return e.scoreWithout>e.opponentScore!==e.won}function ju(e,t){if(!t.length)return 0;let n=0,r=!1;for(let r of t){r.flipped&&(n+=30);let t=bl(r);t!==null&&e<Math.abs(t)&&Au(r)&&(n+=20)}return e<15&&t.length>0&&(r=!0),r&&(n+=10),n}function Mu(e,t,n,r,i){let a=Math.abs(e.points-t.points),o=e.points+t.points,s=Math.max(0,40-a),c=o/5,l=e.points>=t.points?e.roster_id:t.roster_id,u=l===e.roster_id?t.roster_id:e.roster_id,d=r.get(l)??{wins:0,losses:0},f=r.get(u)??{wins:0,losses:0},p=Math.max(0,d.losses-f.wins),m=12*p,h=ju(a,ku(n,e.roster_id,t.roster_id,i));return{closeness:s,shootout:c,upsetUnits:p,upsetBonus:m,mulliganBonus:h,composite:s+c+m+h,margin:a,combinedPoints:o}}function Nu(e){let t=[];return e.margin<=10&&t.push(`Nail-biter`),e.combinedPoints>=270&&t.push(`Shootout`),e.upsetBonus>0&&t.push(`Upset`),e.mulliganBonus>0&&t.push(`Mulligan`),t}function Pu(e,t){return t.breakdown.composite===e.breakdown.composite?e.breakdown.margin===t.breakdown.margin?t.breakdown.combinedPoints-e.breakdown.combinedPoints:e.breakdown.margin-t.breakdown.margin:t.breakdown.composite-e.breakdown.composite}function Fu(e,t){let n=[...e].sort(Pu);return(t==null?n:n.slice(0,t)).map((e,t)=>({...e,rank:t+1}))}function Iu(e,t,n){let r=t.get(e);if(!r?.length)return[];let i=Ou(t,e),a=[];for(let{matchupId:t,home:o,away:s}of pu(r)){let r=Mu(o,s,e,i,n),c=o.points>=s.points?o.roster_id:s.roster_id,l=c===o.roster_id?s.roster_id:o.roster_id;a.push({week:e,matchupId:t,matchupKey:Tu(e,t),home:o,away:s,winnerRosterId:c,loserRosterId:l,breakdown:r,badges:Nu(r)})}return a}function Lu(e,t,n,r,i,a=3){return il(e,n,r)?[]:Fu(Iu(e,t,i),a)}function Ru(e,t,n,r){let i=rl(t,n),a=[];for(let o=i;o>=1;o--){if(il(o,t,n))continue;let i=Lu(o,e,t,n,r);i.length&&a.push({week:o,games:i})}return a}function zu({scope:e,maxWeek:t,league:n,nflState:r,onChange:i}){let a=Array.from({length:t},(e,t)=>t+1);return(0,V.jsxs)(`div`,{className:`flex flex-col gap-1`,children:[(0,V.jsx)(`span`,{className:`text-xs font-medium uppercase tracking-wide text-[var(--gwb-muted)]`,children:`Games by week`}),(0,V.jsxs)(`div`,{className:`gwb-week-scope-chips flex gap-1 overflow-x-auto rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-1`,role:`group`,"aria-label":`Filter best games by week`,children:[(0,V.jsx)(Bu,{label:`All`,active:e===`all`,onClick:()=>i(`all`)}),a.map(t=>{let a=il(t,n,r);return(0,V.jsx)(Bu,{label:a?`Week ${t} · In progress`:`Week ${t}`,active:e===t,disabled:a,onClick:()=>i(t)},t)})]})]})}function Bu({label:e,active:t,disabled:n,onClick:r}){return(0,V.jsx)(`button`,{type:`button`,disabled:n,className:t?`gwb-week-scope-chip gwb-week-scope-chip--active shrink-0 px-3 py-2 text-xs`:`gwb-week-scope-chip shrink-0 px-3 py-2 text-xs`,"aria-pressed":t,onClick:r,children:e})}function Vu({label:e}){return(0,V.jsx)(`span`,{className:`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${e===`Nail-biter`?`border-rose-400/40 bg-rose-950/40 text-rose-100`:e===`Shootout`?`border-amber-400/40 bg-amber-950/40 text-amber-100`:e===`Upset`?`border-violet-400/40 bg-violet-950/40 text-violet-100`:`border-cyan-400/40 bg-cyan-950/40 text-cyan-100`}`,children:e})}function Hu({rosterId:e,points:t,teams:n,winning:r}){let i=n.get(e),a=us(e,i?.displayName??``);return(0,V.jsxs)(`div`,{className:`flex min-w-0 flex-1 items-center gap-2 ${r?`rounded-lg ring-1 ring-[var(--gwb-accent)]/50`:``}`,children:[(0,V.jsx)(ou,{team:i,size:`sm`}),(0,V.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,V.jsx)(`p`,{className:`truncate text-sm font-semibold leading-tight`,children:i?.teamName??`Team ${e}`}),(0,V.jsx)(`p`,{className:`truncate text-xs text-[var(--gwb-muted)]`,children:a})]}),(0,V.jsx)(`p`,{className:`shrink-0 text-lg font-bold tabular-nums ${r?`text-[var(--gwb-accent)]`:`text-[var(--gwb-text)]`}`,children:t.toFixed(1)})]})}function Uu({matchup:e,team:t,slots:n,players:r}){return(0,V.jsxs)(`div`,{className:`min-w-0 flex-1 rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-bg)] p-2`,children:[(0,V.jsxs)(`div`,{className:`mb-2 flex items-center gap-2`,children:[(0,V.jsx)(ou,{team:t,size:`sm`}),(0,V.jsxs)(`div`,{className:`min-w-0`,children:[(0,V.jsx)(`p`,{className:`truncate text-sm font-semibold`,children:t?.teamName??`Team`}),(0,V.jsxs)(`p`,{className:`text-xs font-bold tabular-nums text-[var(--gwb-accent)]`,children:[e.points.toFixed(2),` pts`]})]})]}),(0,V.jsx)(`ul`,{className:`space-y-1`,children:n.map((t,n)=>{let i=e.starters?.[n]??`0`,a=yu(e,i,n);return(0,V.jsxs)(`li`,{className:`flex items-center justify-between gap-2 rounded-md border border-[var(--gwb-border)]/70 bg-[var(--gwb-surface)] px-2 py-1`,children:[(0,V.jsxs)(`div`,{className:`min-w-0`,children:[(0,V.jsx)(`p`,{className:`text-[10px] font-semibold uppercase text-[var(--gwb-muted)]`,children:t}),(0,V.jsx)(`p`,{className:`truncate text-xs font-medium`,children:_u(i,r)}),(0,V.jsx)(`p`,{className:`text-[10px] text-[var(--gwb-muted)]`,children:vu(i,r)})]}),(0,V.jsx)(`span`,{className:`shrink-0 text-sm font-semibold tabular-nums`,children:a.toFixed(2)})]},`${t}-${n}`)})})]})}function Wu({games:e,teams:t,players:n,slots:r,expandedKey:i,onToggleExpand:a,showWeekOnCard:o,listLabel:s}){return e.length?(0,V.jsx)(`ul`,{className:`overflow-hidden rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)]`,role:`list`,"aria-label":s,children:e.map((e,s)=>{let{home:c,away:l,breakdown:u}=e,d=c.points>=l.points?c.roster_id:l.roster_id,f=i===e.matchupKey,p=t.get(c.roster_id),m=t.get(l.roster_id);return(0,V.jsxs)(`li`,{children:[(0,V.jsx)(`button`,{type:`button`,className:`w-full border-t border-[var(--gwb-border)] px-3 py-3 text-left first:border-t-0 sm:px-4 ${s%2==1?`bg-[#0d1319]/60`:``}`,"aria-expanded":f,onClick:()=>a(e.matchupKey),children:(0,V.jsxs)(`div`,{className:`flex items-start gap-2`,children:[(0,V.jsx)(`span`,{className:`w-6 shrink-0 pt-0.5 text-center text-sm font-semibold tabular-nums text-[var(--gwb-muted)]`,"aria-label":`Rank ${e.rank}`,children:e.rank}),(0,V.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,V.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[o?(0,V.jsxs)(`span`,{className:`rounded-md border border-[var(--gwb-accent)]/45 bg-[var(--gwb-accent)]/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[var(--gwb-accent)]`,"aria-label":`NFL week ${e.week}`,children:[`Week `,e.week]}):null,e.badges.map(e=>(0,V.jsx)(Vu,{label:e},e))]}),(0,V.jsxs)(`div`,{className:`mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3`,children:[(0,V.jsx)(Hu,{rosterId:c.roster_id,points:c.points,teams:t,winning:d===c.roster_id}),(0,V.jsx)(`span`,{className:`hidden shrink-0 text-xs font-semibold uppercase text-[var(--gwb-muted)] sm:block`,children:`vs`}),(0,V.jsx)(Hu,{rosterId:l.roster_id,points:l.points,teams:t,winning:d===l.roster_id})]}),(0,V.jsxs)(`p`,{className:`mt-2 text-xs text-[var(--gwb-muted)]`,children:[`Score `,u.composite.toFixed(1),(0,V.jsx)(`span`,{className:`mx-1 text-[var(--gwb-border)]`,children:`·`}),u.margin.toFixed(1),` pt margin`,(0,V.jsx)(`span`,{className:`mx-1 text-[var(--gwb-border)]`,children:`·`}),u.combinedPoints.toFixed(1),` combined`]})]}),(0,V.jsx)(`span`,{className:`shrink-0 pt-1 text-[var(--gwb-muted)]`,"aria-hidden":!0,children:f?`▾`:`▸`})]})}),f&&n&&(0,V.jsxs)(`div`,{className:`border-t border-[var(--gwb-border)] bg-[#0a0e12]/90 px-3 pb-4 pt-3 sm:px-4`,children:[(0,V.jsxs)(`div`,{className:`grid gap-3 sm:grid-cols-2`,children:[(0,V.jsx)(Uu,{matchup:c,team:p,slots:r,players:n}),(0,V.jsx)(Uu,{matchup:l,team:m,slots:r,players:n})]}),(0,V.jsx)(Gu,{matchupKey:e.matchupKey})]})]},e.matchupKey)})}):null}function Gu({matchupKey:e}){let t=Eu(e);if(t?.status===`live`&&t.videoUrl){let e=Du(t.videoUrl);if(e)return(0,V.jsx)(`div`,{className:`mt-3 overflow-hidden rounded-lg border border-[var(--gwb-border)] bg-black`,children:(0,V.jsx)(`div`,{className:`relative aspect-video w-full`,children:(0,V.jsx)(`iframe`,{title:`Best game recap`,src:e,className:`absolute inset-0 h-full w-full`,allow:`accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture`,allowFullScreen:!0})})})}return(0,V.jsxs)(`div`,{className:`mt-3 rounded-lg border border-dashed border-[var(--gwb-border)] bg-[#0d1319]/80 px-4 py-6 text-center`,children:[(0,V.jsx)(`p`,{className:`text-sm font-medium text-[var(--gwb-text)]`,children:`Recap video coming soon`}),(0,V.jsx)(`p`,{className:`mt-1 text-xs text-[var(--gwb-muted)]`,children:`Motion recap lands here after commissioner review — no broadcast footage.`})]})}function Ku({matchupsByWeek:e,league:t,nflState:n,maxWeek:r,ledger:i,teams:a,players:o,playersLoading:s,ensurePlayers:c,deferralNote:l,scope:u,onScopeChange:d}){let f=rl(t,n),[p,m]=(0,v.useState)(null);(0,v.useEffect)(()=>{typeof u==`number`&&(il(u,t,n)||u>f)&&d(f)},[u,f,t,n,d]);let h=(0,v.useMemo)(()=>u===`all`?Ru(e,t,n,i):null,[u,e,t,n,i]),g=(0,v.useMemo)(()=>u===`all`?[]:Lu(u,e,t,n,i),[u,e,t,n,i]),_=u===`all`?(h?.length??0)>0:g.length>0,y=(0,v.useMemo)(()=>mu(t.roster_positions),[t.roster_positions]);(0,v.useEffect)(()=>{c()},[c]);let b=e=>{m(t=>t===e?null:e)};return!_&&u===`all`&&f<1?(0,V.jsx)(`p`,{className:`rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]`,children:`No final matchups ranked yet. Check back after the first full scoring week.`}):(0,V.jsxs)(`div`,{className:`space-y-3`,id:`best-games-panel`,children:[l&&(0,V.jsx)(`p`,{className:`rounded-lg border border-amber-600/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-100`,children:l}),(0,V.jsx)(zu,{scope:u,maxWeek:r,league:t,nflState:n,onChange:e=>{m(null),d(e)}}),(0,V.jsx)(`p`,{className:`text-xs text-[var(--gwb-muted)]`,children:u===`all`?(0,V.jsxs)(V.Fragment,{children:[`Top `,3,` final matchups per week, grouped newest week first — ranked by closeness, shootout, upset, and mulligan drama.`]}):(0,V.jsxs)(V.Fragment,{children:[`Top `,3,` matchups in Week `,u,`, ranked within the week by closeness, shootout, upset, and mulligan drama.`]})}),_?null:(0,V.jsx)(`p`,{className:`rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]`,children:typeof u==`number`&&il(u,t,n)?`Week ${u} is still in progress — rankings appear when scoring is final.`:`No scored matchups for this week yet.`}),s||!o?(0,V.jsx)(`p`,{className:`rounded-xl border border-[var(--gwb-border)] p-4 text-center text-sm text-[var(--gwb-muted)]`,children:`Loading starter lines…`}):null,u===`all`&&h&&h.length>0?(0,V.jsx)(`div`,{className:`space-y-5`,children:h.map(({week:e,games:t})=>(0,V.jsxs)(`section`,{"aria-labelledby":`best-games-week-${e}`,children:[(0,V.jsxs)(`h3`,{id:`best-games-week-${e}`,className:`mb-2 font-['Anton'] text-xl uppercase tracking-wide text-[var(--gwb-text)]`,children:[`Week `,e]}),(0,V.jsx)(Wu,{games:t,teams:a,players:o,slots:y,expandedKey:p,onToggleExpand:b,showWeekOnCard:!1,listLabel:`Best games of week ${e}`})]},e))}):null,u!==`all`&&g.length>0?(0,V.jsx)(Wu,{games:g,teams:a,players:o,slots:y,expandedKey:p,onToggleExpand:b,showWeekOnCard:!0,listLabel:`Best games of week ${u}`}):null]})}var qu=6e4;function Ju(e,t,n,r){let[i,a]=(0,v.useState)(n),[o,s]=(0,v.useState)(null),[c,l]=(0,v.useState)(!1),u=(0,v.useRef)(!0);(0,v.useEffect)(()=>{a(n)},[e,n]);let d=(0,v.useCallback)(async()=>{if(t){l(!0);try{let t=await ec(e);t?.length&&(a(t),s(new Date),r?.(e,t))}catch{}finally{l(!1)}}},[e,t,r]);return(0,v.useEffect)(()=>{if(!t)return;let e=()=>{u.current=document.visibilityState===`visible`};document.addEventListener(`visibilitychange`,e),e();let n=window.setInterval(()=>{u.current&&d()},qu);return()=>{document.removeEventListener(`visibilitychange`,e),window.clearInterval(n)}},[t,d]),(0,v.useEffect)(()=>{t&&d()},[e,t]),{matchups:i,lastUpdated:o,refreshing:c,refresh:d}}var Yu=`https://api.sleeper.app/projections/nfl`;async function Xu(e,t,n=`regular`){let r=`${Yu}/${e}/${t}?season_type=${n}`;try{let e=await fetch(r);if(!e.ok)return null;let t=await e.json(),n={};if(Array.isArray(t)){for(let e of t){let t=e.player_id;if(!t)continue;let r=e.stats?.pts_ppr??e.stats?.pts_half_ppr??e.stats?.pts_std;typeof r==`number`&&!Number.isNaN(r)&&(n[t]=r)}return Object.keys(n).length?n:null}if(t&&typeof t==`object`){for(let[e,r]of Object.entries(t)){let t=r.stats??r.pts_ppr,i=typeof t==`object`?t.pts_ppr??t.pts_std:r.pts_ppr;typeof i==`number`&&!Number.isNaN(i)&&(n[e]=i)}return Object.keys(n).length?n:null}return null}catch{return null}}var Zu=h();function Qu({team:e,className:t=`h-10 w-10`}){return e?.avatarUrl?(0,V.jsx)(`img`,{src:e.avatarUrl,alt:``,className:`${t} rounded-full border border-[var(--gwb-border)] object-cover`}):(0,V.jsx)(`div`,{className:`${t} flex items-center justify-center rounded-full border border-[var(--gwb-border)] bg-[#243040] text-xs font-semibold text-[var(--gwb-muted)]`,children:e?.teamName?.slice(0,1)??`?`})}function $u({matchup:e,team:t,slots:n,players:r,projections:i,showProjections:a,compact:o}){let[s,c]=(0,v.useState)(!1),l=bu(e),u=xu(e);return(0,V.jsxs)(`div`,{className:`min-w-0 flex-1 rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-bg)] ${o?`p-1.5`:`p-2`}`,children:[(0,V.jsxs)(`div`,{className:`mb-2 flex items-center gap-1.5 ${o?`flex-col text-center`:`gap-2`}`,children:[(0,V.jsx)(Qu,{team:t,className:o?`h-8 w-8`:`h-10 w-10`}),(0,V.jsxs)(`div`,{className:`min-w-0 w-full`,children:[(0,V.jsx)(`p`,{className:`truncate font-semibold ${o?`text-[11px] leading-tight`:``}`,children:t?.teamName??`Team`}),(0,V.jsx)(`p`,{className:`font-bold tabular-nums text-[var(--gwb-accent)] ${o?`text-lg`:`text-2xl`}`,children:e.points.toFixed(2)})]})]}),(0,V.jsx)(`ul`,{className:`space-y-1`,children:n.map((t,n)=>{let s=e.starters?.[n]??`0`,c=yu(e,s,n),l=a&&i&&!/^[A-Z]{2,4}$/.test(s)?i[s]:void 0;return o?(0,V.jsxs)(`li`,{className:`rounded-md border border-[var(--gwb-border)]/70 bg-[var(--gwb-surface)] px-1.5 py-1`,children:[(0,V.jsxs)(`div`,{className:`flex items-center justify-between gap-1`,children:[(0,V.jsx)(`span`,{className:`text-[9px] font-semibold uppercase text-[var(--gwb-muted)]`,children:t}),(0,V.jsx)(`span`,{className:`shrink-0 text-[11px] font-semibold tabular-nums`,children:c.toFixed(2)})]}),(0,V.jsx)(`p`,{className:`truncate text-[11px] font-medium leading-tight`,children:_u(s,r)}),l!=null&&(0,V.jsxs)(`p`,{className:`text-[9px] text-[var(--gwb-muted)] tabular-nums`,children:[l.toFixed(1),` proj`]})]},`${t}-${n}`):(0,V.jsxs)(`li`,{className:`grid grid-cols-[2.5rem_1fr_auto] items-center gap-2 rounded-lg border border-[var(--gwb-border)]/60 bg-[var(--gwb-surface)] px-2 py-1.5 text-sm`,children:[(0,V.jsx)(`span`,{className:`text-[10px] font-semibold uppercase text-[var(--gwb-muted)]`,children:t}),(0,V.jsxs)(`div`,{className:`min-w-0`,children:[(0,V.jsx)(`p`,{className:`truncate font-medium`,children:_u(s,r)}),(0,V.jsx)(`p`,{className:`truncate text-xs text-[var(--gwb-muted)]`,children:vu(s,r)})]}),(0,V.jsxs)(`div`,{className:`text-right tabular-nums`,children:[(0,V.jsx)(`p`,{className:`font-semibold`,children:c.toFixed(2)}),l!=null&&(0,V.jsxs)(`p`,{className:`text-[10px] text-[var(--gwb-muted)]`,children:[l.toFixed(1),` proj`]})]})]},`${t}-${n}`)})}),(0,V.jsxs)(`div`,{className:`mt-2`,children:[(0,V.jsxs)(`button`,{type:`button`,className:`flex w-full items-center justify-between rounded-lg border border-[var(--gwb-border)] bg-[#1a222c] text-left font-medium ${o?`px-2 py-1.5 text-[11px]`:`px-3 py-2 text-sm`}`,onClick:()=>c(e=>!e),"aria-expanded":s,children:[(0,V.jsx)(`span`,{children:`Bench`}),(0,V.jsxs)(`span`,{className:`tabular-nums text-[var(--gwb-muted)]`,children:[u.toFixed(2),(0,V.jsx)(`span`,{className:`ml-1 text-[var(--gwb-accent)]`,children:s?`▲`:`▼`})]})]}),s&&(0,V.jsxs)(`ul`,{className:`mt-1 space-y-1`,children:[l.length===0&&(0,V.jsx)(`li`,{className:`px-1 py-1 text-[10px] text-[var(--gwb-muted)]`,children:`No bench`}),l.map(t=>{let n=yu(e,t,null);return(0,V.jsxs)(`li`,{className:`flex items-center justify-between gap-1 rounded-md border border-[var(--gwb-border)]/40 bg-[var(--gwb-surface)] px-1.5 py-1 text-[11px]`,children:[(0,V.jsx)(`p`,{className:`min-w-0 truncate`,children:_u(t,r)}),(0,V.jsx)(`span`,{className:`shrink-0 tabular-nums font-medium`,children:n.toFixed(2)})]},t)})]})]})]})}function K({open:e,onClose:t,left:n,right:r,teams:i,rosterPositions:a,players:o,projections:s,showProjections:c}){let l=(0,v.useMemo)(()=>mu(a),[a]);if((0,v.useEffect)(()=>{if(!e)return;let n=e=>{e.key===`Escape`&&t()};return window.addEventListener(`keydown`,n),()=>window.removeEventListener(`keydown`,n)},[e,t]),(0,v.useEffect)(()=>{if(!e)return;let t=document.body.style.overflow,n=document.body.style.paddingRight,r=window.innerWidth-document.documentElement.clientWidth;return document.body.style.overflow=`hidden`,r>0&&(document.body.style.paddingRight=`${r}px`),()=>{document.body.style.overflow=t,document.body.style.paddingRight=n}},[e]),!e)return null;let u=i.get(n.roster_id),d=i.get(r.roster_id),f=(0,V.jsxs)(`div`,{className:`fixed inset-0 z-[200] flex min-h-0 flex-col bg-[var(--gwb-bg)] isolate`,role:`dialog`,"aria-modal":`true`,"aria-label":`${Su(n.roster_id,i)} vs ${Su(r.roster_id,i)}`,children:[(0,V.jsxs)(`header`,{className:`flex shrink-0 items-center gap-3 border-b border-[var(--gwb-border)] bg-[var(--gwb-bg)] px-3 py-3`,children:[(0,V.jsx)(`button`,{type:`button`,className:`rounded-lg border border-[var(--gwb-border)] px-3 py-1.5 text-sm font-medium`,onClick:t,children:`Back`}),(0,V.jsxs)(`p`,{className:`min-w-0 flex-1 truncate text-center text-sm font-semibold`,children:[Su(n.roster_id,i),` vs`,` `,Su(r.roster_id,i)]}),(0,V.jsx)(`div`,{className:`w-[4.5rem]`,"aria-hidden":!0})]}),(0,V.jsx)(`div`,{className:`min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--gwb-bg)] px-2 py-3`,"data-testid":`matchup-detail-scroll`,children:(0,V.jsxs)(`div`,{className:`mx-auto grid max-w-4xl grid-cols-2 gap-2 sm:gap-3`,children:[(0,V.jsx)($u,{matchup:n,team:u,slots:l,players:o,projections:s,showProjections:c,compact:!0}),(0,V.jsx)($u,{matchup:r,team:d,slots:l,players:o,projections:s,showProjections:c,compact:!0})]})})]});return(0,Zu.createPortal)(f,document.body)}function q(e){return e?e.toLocaleTimeString(`en-US`,{hour:`numeric`,minute:`2-digit`}):`—`}function J({week:e,league:t,nflState:n,teams:r,players:i,playersLoading:a,ensurePlayers:o,initialMatchups:s,onMatchupsUpdated:c,isActive:l}){let u=l&&(il(e,t,n)||e===n.week),{matchups:d,lastUpdated:f,refreshing:p,refresh:m}=Ju(e,u,s,c),[h,g]=(0,v.useState)(null),[_,y]=(0,v.useState)(null),[b,x]=(0,v.useState)(!1);(0,v.useEffect)(()=>{o()},[o]),(0,v.useEffect)(()=>{g(null)},[e]),(0,v.useEffect)(()=>{if(!l)return;let r=!1;return Xu(t.season,e,n.season_type).then(e=>{r||(e&&Object.keys(e).length>0?(y(e),x(!0)):(y(null),x(!1)))}),()=>{r=!0}},[e,t.season,n.season_type,l]);let S=(0,v.useMemo)(()=>d?pu(d):[],[d]),C=S.find(e=>e.matchupId===h);return!d||!Go(d)?(0,V.jsxs)(`p`,{className:`rounded-xl border border-dashed border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]`,children:[`No scored matchups for Week `,e,` yet. Check back after lineups lock or try another week.`]}):a||!i?(0,V.jsx)(`p`,{className:`rounded-xl border border-[var(--gwb-border)] p-6 text-center text-[var(--gwb-muted)]`,children:`Loading player names…`}):(0,V.jsxs)(`div`,{className:`space-y-4`,id:`live-scoreboard-panel`,children:[(0,V.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-2`,children:[(0,V.jsxs)(`p`,{className:`text-xs text-[var(--gwb-muted)]`,children:[`Last updated `,q(f),u&&(0,V.jsx)(`span`,{className:`ml-2 text-amber-300/90`,children:`· auto-refresh 60s`})]}),(0,V.jsx)(`button`,{type:`button`,className:`rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-1.5 text-sm font-medium disabled:opacity-50`,onClick:()=>m(),disabled:p,children:p?`Refreshing…`:`Refresh`})]}),(0,V.jsx)(`ul`,{className:`grid gap-3 sm:grid-cols-2`,children:S.map(({matchupId:e,home:t,away:n})=>{let i=Cu(t,n),a=r.get(t.roster_id),o=r.get(n.roster_id);return(0,V.jsx)(`li`,{children:(0,V.jsxs)(`button`,{type:`button`,className:`w-full rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-4 text-left transition hover:border-[var(--gwb-accent)]/50`,onClick:()=>g(e),children:[(0,V.jsx)(`div`,{className:`flex items-center justify-between gap-2`,children:(0,V.jsxs)(`div`,{className:`flex min-w-0 flex-1 items-center gap-2 ${i===t.roster_id?`rounded-lg ring-1 ring-[var(--gwb-accent)]/60`:``}`,children:[(0,V.jsx)(ou,{team:a,size:`sm`}),(0,V.jsx)(`span`,{className:`truncate text-sm font-medium`,children:Su(t.roster_id,r)}),(0,V.jsx)(`span`,{className:`ml-auto shrink-0 text-lg font-bold tabular-nums ${i===t.roster_id?`text-[var(--gwb-accent)]`:``}`,children:t.points.toFixed(2)})]})}),(0,V.jsx)(`p`,{className:`my-2 text-center text-[10px] font-semibold uppercase tracking-widest text-[var(--gwb-muted)]`,children:`vs`}),(0,V.jsxs)(`div`,{className:`flex items-center gap-2 ${i===n.roster_id?`rounded-lg ring-1 ring-[var(--gwb-accent)]/60`:``}`,children:[(0,V.jsx)(ou,{team:o,size:`sm`}),(0,V.jsx)(`span`,{className:`truncate text-sm font-medium`,children:Su(n.roster_id,r)}),(0,V.jsx)(`span`,{className:`ml-auto shrink-0 text-lg font-bold tabular-nums ${i===n.roster_id?`text-[var(--gwb-accent)]`:``}`,children:n.points.toFixed(2)})]})]})},e)})}),C&&(0,V.jsx)(K,{open:h!==null,onClose:()=>g(null),left:C.home,right:C.away,teams:r,rosterPositions:t.roster_positions,players:i,projections:_,showProjections:b})]})}function Y({week:e,maxWeek:t,onChange:n}){let r=Array.from({length:t},(e,t)=>t+1);return(0,V.jsxs)(`label`,{className:`flex flex-col gap-1 text-sm text-[var(--gwb-muted)]`,children:[(0,V.jsx)(`span`,{className:`font-medium uppercase tracking-wide text-xs`,children:`NFL Week`}),(0,V.jsx)(`select`,{className:`rounded-lg border border-[var(--gwb-border)] bg-[var(--gwb-surface)] px-3 py-2.5 text-[var(--gwb-text)] text-base`,value:e,onChange:e=>n(Number(e.target.value)),children:r.map(e=>(0,V.jsxs)(`option`,{value:e,children:[`Week `,e]},e))})]})}function X(){let[e,t]=(0,v.useState)(`idle`),[n,r]=(0,v.useState)(null),[i,a]=(0,v.useState)(null),[o,s]=(0,v.useState)(!1),[c,l]=(0,v.useState)(null),[u,d]=(0,v.useState)(1),f=(0,v.useCallback)((e,t)=>{l(n=>{if(!n)return n;let r=new Map(n.matchupsByWeek);return r.set(e,t),{...n,matchupsByWeek:r}})},[]),p=(0,v.useCallback)(async()=>{t(`loading`),r(null);try{let[e,n,r,i]=await Promise.all([Xs(),Zs(),Qs(),$s()]),a=nl(e),o=rl(n,e),s=Math.max(a,o),[c,u]=await Promise.all([rc(s),nc(s).then(e=>({transactions:e,waiverLoadError:null}),e=>({transactions:[],waiverLoadError:e instanceof Error?e.message:`Waiver moves did not load`}))]),f=ms(r,i),p=xs(i,f),m=p;d(a),l({league:n,nflState:e,rosters:i,matchupsByWeek:c,teams:f,standings:p,seasonStandings:m,transactions:u.transactions,waiverLoadError:u.waiverLoadError}),t(`ready`)}catch(e){r(e instanceof Error?e.message:`Failed to load league`),t(`error`)}},[]);(0,v.useEffect)(()=>{p()},[p]);let m=(0,v.useCallback)(()=>{i||o||(s(!0),bc().then(e=>a(e)).catch(()=>a({})).finally(()=>s(!1)))},[i,o]);return{state:e,error:n,data:(0,v.useMemo)(()=>{if(!c)return null;let{rosters:e,matchupsByWeek:t,teams:n,seasonStandings:r,league:a,nflState:s,transactions:l,waiverLoadError:h}=c,g=rl(a,s),_=sl(u,a,s),v=bs(t,n,_),y=cl(u,a,s),b=Al(u,a,s,_),x=t.get(u),S=bs(t,n,Math.max(0,u-1)),C=x&&Go(x)&&i?Wo(x,n,i,{rosterPositions:a.roster_positions,preWeekStandings:S,isWeekFinal:al(u,a,s)}):[],ee=il(u,a,s),w=kl(_,u),T=ol(u,a,s),E=kc({transactions:l,matchupsByWeek:t,teams:n,rosters:e,scoringThrough:_,selectedWeek:u,selectedWeekComplete:!ee}),D=ll(u,a,s,`waiver scores`);return{league:a,nflState:s,rosters:e,standings:v,seasonStandings:r,recaps:C,matchupsByWeek:t,players:i,playersLoading:o,ensurePlayers:m,teams:n,selectedWeek:u,setSelectedWeek:d,refresh:p,completedWeek:g,isSelectedWeekLive:ee,weekLabel:T,standingsThroughWeek:_,mulliganStatusThroughWeek:w,standingsDeferralNote:y,mulligansDeferralNote:b,waiverBoard:E,waiverLoadError:h,waiverDeferralNote:D,updateWeekMatchups:f}},[c,u,p,i,o,m,f]),refresh:p}}var ed=`gwb-sound`;function td(e,t=`/gwb-fe006a16/`){return`${t.endsWith(`/`)?t:`${t}/`}audio/${e.replace(/^\//,``)}`}var nd={standings:td(`impact-loop.mp3`),bestgames:td(`impact-loop.mp3`),live:td(`impact-loop.mp3`),gallery:td(`impact-loop.mp3`),recaps:td(`impact-loop.mp3`),mulligans:td(`monkeys-loop.mp3`),frankie:td(`sneaky-loop.mp3`),waiver:td(`volatile-loop.mp3`)},rd={matchups:td(`sneaky-loop.mp3`),results:td(`impact-loop.mp3`),report:td(`volatile-loop.mp3`)},id=td(`click.mp3`),ad=td(`buzzer.mp3`);function od(){try{return localStorage.getItem(ed)===`off`}catch{return!1}}function sd(e,t){let n=t.slice(t.lastIndexOf(`/`)+1);return e.src.endsWith(`/${n}`)||e.src.endsWith(n)}function cd(){let[e,t]=(0,v.useState)(()=>!od()),[n,r]=(0,v.useState)(!1),[i,a]=(0,v.useState)(!1),o=(0,v.useRef)(null),s=(0,v.useRef)(null),c=(0,v.useRef)(nd.standings),l=(0,v.useRef)(e),u=(0,v.useRef)(n);l.current=e,u.current=n;let d=(0,v.useCallback)(()=>(o.current||(o.current=new Audio,o.current.loop=!0,o.current.volume=.35,o.current.addEventListener(`playing`,()=>a(!0)),o.current.addEventListener(`pause`,()=>a(!1))),s.current||(s.current=new Audio,s.current.volume=.5),{bed:o.current,stinger:s.current}),[]),f=(0,v.useCallback)(()=>{let e=o.current;e&&(e.pause(),e.removeAttribute(`src`),e.load()),a(!1)},[]),p=(0,v.useCallback)(()=>{if(!l.current)return;let{bed:e}=d(),t=c.current;sd(e,t)||(e.src=t),e.play().then(()=>{u.current=!0,r(!0),a(!0)},()=>{(!o.current||o.current.paused)&&(u.current=!1,r(!1))})},[d]),m=(0,v.useCallback)(e=>{l.current&&(c.current=e,u.current&&p())},[p]),h=(0,v.useCallback)(()=>{let e=!l.current;t(e),l.current=e;try{e?localStorage.removeItem(ed):localStorage.setItem(ed,`off`)}catch{}e?p():(u.current=!1,r(!1),f())},[p,f]),g=(0,v.useCallback)(()=>{l.current&&!u.current&&p()},[p]),_=(0,v.useCallback)(e=>{m(nd[e])},[m]),y=(0,v.useCallback)(e=>{if(!e){_(`gallery`);return}m(rd[e])},[m,_]),b=(0,v.useCallback)(e=>{if(!l.current||!u.current)return;let{stinger:t}=d();t.src=e,t.play().catch(()=>{})},[d]),x=(0,v.useCallback)(()=>{b(id)},[b]),S=(0,v.useCallback)(()=>{b(ad)},[b]);return(0,v.useEffect)(()=>{e||(f(),u.current=!1,r(!1))},[e,f]),(0,v.useEffect)(()=>{if(!l.current)return;d(),c.current=nd.standings;let e=o.current;e&&!e.src&&(e.src=nd.standings),p()},[]),(0,v.useEffect)(()=>{if(!e||n)return;let t=()=>{if(!l.current||u.current)return;let{bed:e}=d(),t=c.current;sd(e,t)||(e.src=t),e.play().then(()=>{u.current=!0,r(!0),a(!0)},()=>{(!o.current||o.current.paused)&&(u.current=!1,r(!1))})},i={capture:!0,passive:!0};return window.addEventListener(`pointerdown`,t,i),window.addEventListener(`keydown`,t,i),window.addEventListener(`touchstart`,t,i),window.addEventListener(`click`,t,i),()=>{window.removeEventListener(`pointerdown`,t,i),window.removeEventListener(`keydown`,t,i),window.removeEventListener(`touchstart`,t,i),window.removeEventListener(`click`,t,i)}},[e,n,d]),{armed:e,unlock:h,onUserGesture:g,setTabBed:_,setDeckBed:y,playClick:x,playBuzzer:S,label:e?`Sound on`:`Sound off`,pressed:e,showTapHint:e&&!i}}var ld=[{id:`standings`,label:`Standings`},{id:`live`,label:`Live`},{id:`gallery`,label:`Graphics`},{id:`recaps`,label:`Recaps`},{id:`mulligans`,label:`Mulligans`},{id:`frankie`,label:`Frankie Zone`},{id:`waiver`,label:`Waiver Wire Champion`},{id:`bestgames`,label:`Best Games`}],ud=[`standings`,`live`,`gallery`,`recaps`,`mulligans`,`frankie`,`waiver`,`bestgames`];function dd(){let{state:e,error:t,data:n,refresh:r}=X(),[i,a]=(0,v.useState)(`standings`),[o,s]=(0,v.useState)(null),[c,l]=(0,v.useState)(null),u=cd(),[d,f]=(0,v.useState)(null),[p,m]=(0,v.useState)(1),h=(0,v.useRef)(null),g=(0,v.useRef)(!1),_=(0,v.useCallback)((e,t)=>{n&&(n.setSelectedWeek(e),l(t),s(null),f(null),a(`recaps`))},[n]),y=(0,v.useMemo)(()=>{if(!n)return ks(`Frankie`);let e=rl(n.league,n.nflState);return Us({standings:bs(n.matchupsByWeek,n.teams,e),teams:n.teams,matchupsByWeek:n.matchupsByWeek,scheduleByWeek:zs(n.matchupsByWeek),throughWeek:e,selectedWeek:e,weekInProgress:!1}).tabLabel},[n]),b=(0,v.useMemo)(()=>ld.map(e=>e.id===`frankie`?{...e,label:y}:e),[y]),x=Math.max(n?.nflState.week??18,n?.league.settings.last_scored_leg??18);(0,v.useEffect)(()=>{if(!n)return;let e=new URLSearchParams(window.location.search),t=e.get(`week`),r=e.get(`tab`),i=e.get(`slide`),o=rl(n.league,n.nflState);if(r===`bestgames`){if(t===`all`)m(`all`);else if(t){let e=Number.parseInt(t,10);m(Number.isNaN(e)?o:e)}else m(o)}else if(t){let e=Number.parseInt(t,10);Number.isNaN(e)||n.setSelectedWeek(e)}r&&ud.includes(r)&&a(r),i&&s(i)},[n?.league.league_id]),(0,v.useEffect)(()=>{if(!n)return;let e=new URLSearchParams;i===`bestgames`?e.set(`week`,p===`all`?`all`:String(p)):e.set(`week`,String(n.selectedWeek)),e.set(`tab`,i),o&&e.set(`slide`,o);let t=e.toString();window.history.replaceState(null,``,`${window.location.pathname}?${t}`)},[n?.selectedWeek,i,o,n,p]);let S=(0,v.useCallback)(e=>{let t=h.current;t&&t.querySelector(`.gwb-section-tab--active`)?.scrollIntoView({inline:`nearest`,block:`nearest`,behavior:e})},[]);(0,v.useEffect)(()=>{if(e!==`ready`||!n)return;let t=g.current?`smooth`:`instant`;g.current=!0,requestAnimationFrame(()=>S(t))},[i,e,n,S]),(0,v.useEffect)(()=>{(i===`recaps`||i===`waiver`||i===`live`||i===`bestgames`)&&n?.ensurePlayers()},[i,n]),(0,v.useEffect)(()=>{if(u.armed){if(i===`gallery`&&d){u.setDeckBed(d);return}u.setTabBed(i)}},[i,d,u]);let C=e=>{u.playClick(),a(e),e!==`gallery`&&e!==`frankie`&&s(null),e!==`gallery`&&f(null)},ee=e=>{u.playClick(),n?.setSelectedWeek(e)},w=i===`frankie`?o:null,T=i===`gallery`?o:null;return(0,V.jsxs)(`div`,{className:`mx-auto flex min-h-dvh flex-col px-4 pb-8 pt-6 ${i===`gallery`||i===`waiver`?`max-w-6xl`:`max-w-3xl`}`,children:[(0,V.jsxs)(`header`,{className:`mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between`,children:[(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`p`,{className:`text-xs font-semibold uppercase tracking-[0.2em] text-[var(--gwb-accent)]`,children:`Command Center`}),(0,V.jsxs)(`h1`,{className:`mt-1 font-['Anton'] text-4xl uppercase leading-tight sm:text-5xl`,children:[`GWB`,` League`]}),(0,V.jsx)(`p`,{className:`mt-2 text-sm text-[var(--gwb-muted)]`,children:`REDRAFT · Sleeper public data · No tracking`})]}),(0,V.jsx)(Il,{label:u.label,pressed:u.pressed,showTapHint:u.showTapHint,onToggle:()=>u.unlock()})]}),e===`loading`&&(0,V.jsxs)(`div`,{className:`flex flex-1 flex-col items-center justify-center gap-3 py-20 text-[var(--gwb-muted)]`,children:[(0,V.jsx)(`div`,{className:`h-10 w-10 animate-spin rounded-full border-2 border-[var(--gwb-accent)] border-t-transparent`}),(0,V.jsx)(`p`,{children:`Loading GWB league data…`})]}),e===`error`&&(0,V.jsxs)(`div`,{className:`rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-center`,children:[(0,V.jsx)(`p`,{className:`font-medium text-red-200`,children:`Could not load league`}),(0,V.jsx)(`p`,{className:`mt-2 text-sm text-red-300/80`,children:t}),(0,V.jsx)(`button`,{type:`button`,className:`mt-4 rounded-lg bg-[var(--gwb-accent)] px-4 py-2 font-semibold text-[#1a1200]`,onClick:()=>r(),children:`Retry`})]}),e===`ready`&&n&&(0,V.jsxs)(V.Fragment,{children:[(0,V.jsxs)(`div`,{className:`mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between`,children:[(0,V.jsx)(Y,{week:n.selectedWeek,maxWeek:x,onChange:ee}),(0,V.jsxs)(`p`,{className:`text-sm text-[var(--gwb-muted)]`,children:[`Season `,n.league.season,` · NFL Week `,n.nflState.week,n.isSelectedWeekLive&&(0,V.jsx)(`span`,{className:`ml-2 rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold uppercase text-amber-300`,children:`Live`})]})]}),(0,V.jsx)(`nav`,{ref:h,className:`gwb-section-tabs mb-6 flex gap-1 overflow-x-auto rounded-xl border border-[var(--gwb-border)] bg-[var(--gwb-surface)] p-1`,"aria-label":`Sections`,children:b.map(e=>{let t=i===e.id;return(0,V.jsx)(`button`,{type:`button`,className:t?`gwb-section-tab gwb-section-tab--active`:`gwb-section-tab`,"aria-current":t?`page`:void 0,onClick:()=>C(e.id),children:e.label},e.id)})}),i===`live`&&(0,V.jsxs)(`section`,{children:[(0,V.jsxs)(`h2`,{className:`mb-3 text-lg font-semibold`,children:[`Week `,n.selectedWeek,` scoreboard`,n.isSelectedWeekLive&&(0,V.jsx)(`span`,{className:`ml-2 text-sm font-normal text-amber-300`,children:`LIVE`})]}),(0,V.jsx)(J,{week:n.selectedWeek,league:n.league,nflState:n.nflState,teams:n.teams,players:n.players,playersLoading:n.playersLoading,ensurePlayers:n.ensurePlayers,initialMatchups:n.matchupsByWeek.get(n.selectedWeek),onMatchupsUpdated:n.updateWeekMatchups,isActive:i===`live`})]}),i===`standings`&&(0,V.jsxs)(`section`,{children:[(0,V.jsxs)(`h2`,{className:`mb-3 text-lg font-semibold`,children:[`Standings`,(0,V.jsxs)(`span`,{className:`ml-2 text-sm font-normal text-[var(--gwb-muted)]`,children:[`through Week `,n.standingsThroughWeek]})]}),(0,V.jsx)(`p`,{className:`mb-3 text-xs text-[var(--gwb-muted)]`,children:`Sorted by wins, then points for (Sleeper-style).`}),(0,V.jsx)(du,{rows:n.standings,deferralNote:n.standingsDeferralNote,teams:n.teams,playoffTeams:n.league.settings.playoff_teams??null})]}),i===`bestgames`&&(0,V.jsxs)(`section`,{children:[(0,V.jsx)(`h2`,{className:`mb-3 text-lg font-semibold`,children:`Best Games`}),(0,V.jsx)(Ku,{matchupsByWeek:n.matchupsByWeek,league:n.league,nflState:n.nflState,maxWeek:x,ledger:dl,teams:n.teams,players:n.players,playersLoading:n.playersLoading,ensurePlayers:n.ensurePlayers,deferralNote:n.standingsDeferralNote,scope:p,onScopeChange:e=>{u.playClick(),m(e)}})]}),i===`gallery`&&(0,V.jsxs)(`section`,{children:[(0,V.jsxs)(`h2`,{className:`mb-3 text-lg font-semibold`,children:[`Week `,n.selectedWeek,` graphics`]}),(0,V.jsx)(au,{week:n.selectedWeek,initialSlideId:T,onSlideUrlChange:s,onDeckKindChange:f})]}),i===`recaps`&&(0,V.jsxs)(`section`,{className:`space-y-8`,children:[(0,V.jsxs)(`div`,{children:[(0,V.jsx)(`h2`,{className:`mb-3 text-lg font-semibold`,children:`Commissioner's recaps`}),(0,V.jsx)(rs,{week:n.selectedWeek,focusRecapId:c,onFocusHandled:()=>l(null)})]}),(0,V.jsxs)(`div`,{children:[(0,V.jsxs)(`h2`,{className:`mb-3 text-lg font-semibold`,children:[`Week `,n.selectedWeek,` matchup recaps`,n.isSelectedWeekLive?` (live scores)`:``]}),(0,V.jsx)($c,{recaps:n.recaps,week:n.selectedWeek,hasScores:Go(n.matchupsByWeek.get(n.selectedWeek)),isLive:n.isSelectedWeekLive,weekMatchups:n.matchupsByWeek.get(n.selectedWeek),playersLoading:n.playersLoading})]})]}),i===`mulligans`&&(0,V.jsxs)(`section`,{children:[(0,V.jsx)(`h2`,{className:`mb-3 text-lg font-semibold`,children:`Mulligans`}),(0,V.jsx)(Pl,{rows:n.standings,selectedWeek:n.selectedWeek,statusThroughWeek:n.mulliganStatusThroughWeek,deferralNote:n.mulligansDeferralNote,weekMatchups:n.matchupsByWeek.get(n.selectedWeek),onNegativeMulliganOpen:()=>u.playBuzzer()})]}),i===`frankie`&&(0,V.jsxs)(`section`,{children:[(0,V.jsxs)(`h2`,{className:`mb-3 text-lg font-semibold`,children:[`Frankie Zone`,(0,V.jsxs)(`span`,{className:`ml-2 text-sm font-normal text-[var(--gwb-muted)]`,children:[`through Week `,n.standingsThroughWeek]})]}),(0,V.jsx)(mc,{standings:n.standings,teams:n.teams,matchupsByWeek:n.matchupsByWeek,selectedWeek:n.selectedWeek,throughWeek:n.standingsThroughWeek,weekInProgress:n.isSelectedWeekLive,deferralNote:ll(n.selectedWeek,n.league,n.nflState,`Frankie Zone`),playoffWeekStart:n.league.settings.playoff_week_start??15,onOpenRecap:_,initialSlideId:w,onSlideUrlChange:s})]}),i===`waiver`&&(0,V.jsxs)(`section`,{children:[(0,V.jsxs)(`h2`,{className:`mb-3 text-lg font-semibold`,children:[`Waiver Wire Champion`,(0,V.jsxs)(`span`,{className:`ml-2 text-sm font-normal text-[var(--gwb-muted)]`,children:[`through Week `,n.standingsThroughWeek]})]}),(0,V.jsx)(Vc,{board:n.waiverBoard,players:n.players,deferralNote:n.waiverDeferralNote,loadError:n.waiverLoadError})]}),(0,V.jsx)(hc,{})]})]})}(0,y.createRoot)(document.getElementById(`root`)).render((0,V.jsx)(v.StrictMode,{children:(0,V.jsx)(dd,{})}));