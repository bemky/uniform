var Uniform=function(t){"use strict";var l=function(t){if(null==t)throw TypeError("Can't call method on  "+t);return t},d=function(t){return Object(l(t))},i={}.hasOwnProperty,v=function(t,e){return i.call(t,e)},e={}.toString,n=function(t){return e.call(t).slice(8,-1)},p=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==n(t)?t.split(""):Object(t)},u=function(t){return p(l(t))},o=Math.ceil,s=Math.floor,a=function(t){return isNaN(t=+t)?0:(0<t?s:o)(t)},f=Math.min,y=Math.max,m=Math.min;function r(t,e){return t(e={exports:{}},e.exports),e.exports}var b,g=r(function(t){var e=t.exports={version:"2.5.7"};"number"==typeof __e&&(__e=e)}),w=(g.version,r(function(t){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)})),h=r(function(t){var e="__core-js_shared__",i=w[e]||(w[e]={});(t.exports=function(t,e){return i[t]||(i[t]=void 0!==e?e:{})})("versions",[]).push({version:g.version,mode:"pure",copyright:"© 2018 Denis Pushkarev (zloirock.ru)"})}),c=0,k=Math.random(),_=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++c+k).toString(36))},S=h("keys"),L=function(t){return S[t]||(S[t]=_(t))},E=(b=!1,function(t,e,i){var n,o,s,r,l=u(t),h=0<(n=l.length)?f(a(n),9007199254740991):0,c=(s=h,(o=a(o=i))<0?y(o+s,0):m(o,s));if(b&&e!=e){for(;c<h;)if((r=l[c++])!=r)return!0}else for(;c<h;c++)if((b||c in l)&&l[c]===e)return b||c||0;return!b&&-1}),x=L("IE_PROTO"),O=function(t,e){var i,n=u(t),o=0,s=[];for(i in n)i!=x&&v(n,i)&&s.push(i);for(;e.length>o;)v(n,i=e[o++])&&(~E(s,i)||s.push(i));return s},C="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(","),z=Object.keys||function(t){return O(t,C)},T=function(n,o,t){if(function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!")}(n),void 0===o)return n;switch(t){case 1:return function(t){return n.call(o,t)};case 2:return function(t,e){return n.call(o,t,e)};case 3:return function(t,e,i){return n.call(o,t,e,i)}}return function(){return n.apply(o,arguments)}},j=function(t){return"object"==typeof t?null!==t:"function"==typeof t},M=function(t){if(!j(t))throw TypeError(t+" is not an object!");return t},P=function(t){try{return!!t()}catch(t){return!0}},N=!P(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}),A=w.document,H=j(A)&&j(A.createElement),W=function(t){return H?A.createElement(t):{}},F=!N&&!P(function(){return 7!=Object.defineProperty(W("div"),"a",{get:function(){return 7}}).a}),I=function(t,e){if(!j(t))return t;var i,n;if(e&&"function"==typeof(i=t.toString)&&!j(n=i.call(t)))return n;if("function"==typeof(i=t.valueOf)&&!j(n=i.call(t)))return n;if(!e&&"function"==typeof(i=t.toString)&&!j(n=i.call(t)))return n;throw TypeError("Can't convert object to primitive value")},q=Object.defineProperty,B={f:N?Object.defineProperty:function(t,e,i){if(M(t),e=I(e,!0),M(i),F)try{return q(t,e,i)}catch(t){}if("get"in i||"set"in i)throw TypeError("Accessors not supported!");return"value"in i&&(t[e]=i.value),t}},D=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}},R=N?function(t,e,i){return B.f(t,e,D(1,i))}:function(t,e,i){return t[e]=i,t},G="prototype",Y=function(t,e,i){var n,o,s,r=t&Y.F,l=t&Y.G,h=t&Y.S,c=t&Y.P,u=t&Y.B,a=t&Y.W,d=l?g:g[e]||(g[e]={}),p=d[G],f=l?w:h?w[e]:(w[e]||{})[G];for(n in l&&(i=e),i)(o=!r&&f&&void 0!==f[n])&&v(d,n)||(s=o?f[n]:i[n],d[n]=l&&"function"!=typeof f[n]?i[n]:u&&o?T(s,w):a&&f[n]==s?function(n){var t=function(t,e,i){if(this instanceof n){switch(arguments.length){case 0:return new n;case 1:return new n(t);case 2:return new n(t,e)}return new n(t,e,i)}return n.apply(this,arguments)};return t[G]=n[G],t}(s):c&&"function"==typeof s?T(Function.call,s):s,c&&((d.virtual||(d.virtual={}))[n]=s,t&Y.R&&p&&!p[n]&&R(p,n,s)))};Y.F=1,Y.G=2,Y.S=4,Y.P=8,Y.B=16,Y.W=32,Y.U=64,Y.R=128;var V=Y,K=function(t,e){var i=(g.Object||{})[t]||Object[t],n={};n[t]=e(i),V(V.S+V.F*P(function(){i(1)}),"Object",n)};K("keys",function(){return function(t){return z(d(t))}});var J=g.Object.keys,U={f:Object.getOwnPropertySymbols},Q={f:{}.propertyIsEnumerable},X=Object.assign,Z=!X||P(function(){var t={},e={},i=Symbol(),n="abcdefghijklmnopqrst";return t[i]=7,n.split("").forEach(function(t){e[t]=t}),7!=X({},t)[i]||Object.keys(X({},e)).join("")!=n})?function(t,e){for(var i=d(t),n=arguments.length,o=1,s=U.f,r=Q.f;o<n;)for(var l,h=p(arguments[o++]),c=s?z(h).concat(s(h)):z(h),u=c.length,a=0;a<u;)r.call(h,l=c[a++])&&(i[l]=h[l]);return i}:X;V(V.S+V.F,"Object",{assign:Z});var tt=g.Object.assign;var et=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")};V(V.S+V.F*!N,"Object",{defineProperty:B.f});var it=g.Object,nt=function(t,e,i){return it.defineProperty(t,e,i)};function ot(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),nt(t,n.key,n)}}var st=function(t,e,i){return e&&ot(t.prototype,e),i&&ot(t,i),t},rt=R,lt=N?Object.defineProperties:function(t,e){M(t);for(var i,n=z(e),o=n.length,s=0;s<o;)B.f(t,i=n[s++],e[i]);return t},ht=w.document,ct=ht&&ht.documentElement,ut=L("IE_PROTO"),at=function(){},dt="prototype",pt=function(){var t,e=W("iframe"),i=C.length;for(e.style.display="none",ct.appendChild(e),e.src="javascript:",(t=e.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),pt=t.F;i--;)delete pt[dt][C[i]];return pt()},ft=Object.create||function(t,e){var i;return null!==t?(at[dt]=M(t),i=new at,at[dt]=null,i[ut]=t):i=pt(),void 0===e?i:lt(i,e)},vt=r(function(t){var e=h("wks"),i=w.Symbol,n="function"==typeof i;(t.exports=function(t){return e[t]||(e[t]=n&&i[t]||(n?i:_)("Symbol."+t))}).store=e}),yt=B.f,mt=vt("toStringTag"),bt=function(t,e,i){t&&!v(t=i?t:t.prototype,mt)&&yt(t,mt,{configurable:!0,value:e})},gt={};R(gt,vt("iterator"),function(){return this});var wt,kt=L("IE_PROTO"),_t=Object.prototype,St=Object.getPrototypeOf||function(t){return t=d(t),v(t,kt)?t[kt]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?_t:null},Lt=vt("iterator"),Et=!([].keys&&"next"in[].keys()),xt="values",Ot=function(t,e,i,n,o,s,r){var l,h,c;h=e,c=n,(l=i).prototype=ft(gt,{next:D(1,c)}),bt(l,h+" Iterator");var u,a,d,p=function(t){if(!Et&&t in m)return m[t];switch(t){case"keys":case xt:return function(){return new i(this,t)}}return function(){return new i(this,t)}},f=e+" Iterator",v=o==xt,y=!1,m=t.prototype,b=m[Lt]||m["@@iterator"]||o&&m[o],g=b||p(o),w=o?v?p("entries"):g:void 0,k="Array"==e&&m.entries||b;if(k&&(d=St(k.call(new t)))!==Object.prototype&&d.next&&bt(d,f,!0),v&&b&&b.name!==xt&&(y=!0,g=function(){return b.call(this)}),r&&(Et||y||!m[Lt])&&R(m,Lt,g),o)if(u={values:v?g:p(xt),keys:s?g:p("keys"),entries:w},r)for(a in u)a in m||rt(m,a,u[a]);else V(V.P+V.F*(Et||y),e,u);return u},Ct=(wt=!0,function(t,e){var i,n,o=String(l(t)),s=a(e),r=o.length;return s<0||r<=s?wt?"":void 0:(i=o.charCodeAt(s))<55296||56319<i||s+1===r||(n=o.charCodeAt(s+1))<56320||57343<n?wt?o.charAt(s):i:wt?o.slice(s,s+2):n-56320+(i-55296<<10)+65536});Ot(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,i=this._i;return i>=e.length?{value:void 0,done:!0}:(t=Ct(e,i),this._i+=t.length,{value:t,done:!1})});for(var zt=function(t,e){return{value:e,done:!!t}},Tt=(Ot(Array,"Array",function(t,e){this._t=u(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,i=this._i++;return!t||i>=t.length?(this._t=void 0,zt(1)):zt(0,"keys"==e?i:"values"==e?t[i]:[i,t[i]])},"values"),vt("toStringTag")),jt="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),Mt=0;Mt<jt.length;Mt++){var Pt=jt[Mt],Nt=w[Pt],At=Nt&&Nt.prototype;At&&!At[Tt]&&R(At,Tt,Pt)}var Ht={f:vt},Wt=Ht.f("iterator"),Ft=r(function(t){var i=_("meta"),e=B.f,n=0,o=Object.isExtensible||function(){return!0},s=!P(function(){return o(Object.preventExtensions({}))}),r=function(t){e(t,i,{value:{i:"O"+ ++n,w:{}}})},l=t.exports={KEY:i,NEED:!1,fastKey:function(t,e){if(!j(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!v(t,i)){if(!o(t))return"F";if(!e)return"E";r(t)}return t[i].i},getWeak:function(t,e){if(!v(t,i)){if(!o(t))return!0;if(!e)return!1;r(t)}return t[i].w},onFreeze:function(t){return s&&l.NEED&&o(t)&&!v(t,i)&&r(t),t}}}),It=(Ft.KEY,Ft.NEED,Ft.fastKey,Ft.getWeak,Ft.onFreeze,B.f),qt=function(t){var e=g.Symbol||(g.Symbol={});"_"==t.charAt(0)||t in e||It(e,t,{value:Ht.f(t)})},Bt=Array.isArray||function(t){return"Array"==n(t)},Dt=C.concat("length","prototype"),Rt={f:Object.getOwnPropertyNames||function(t){return O(t,Dt)}},Gt=Rt.f,Yt={}.toString,Vt="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],Kt={f:function(t){return Vt&&"[object Window]"==Yt.call(t)?function(t){try{return Gt(t)}catch(t){return Vt.slice()}}(t):Gt(u(t))}},$t=Object.getOwnPropertyDescriptor,Jt={f:N?$t:function(t,e){if(t=u(t),e=I(e,!0),F)try{return $t(t,e)}catch(t){}if(v(t,e))return D(!Q.f.call(t,e),t[e])}},Ut=Ft.KEY,Qt=Jt.f,Xt=B.f,Zt=Kt.f,te=w.Symbol,ee=w.JSON,ie=ee&&ee.stringify,ne="prototype",oe=vt("_hidden"),se=vt("toPrimitive"),re={}.propertyIsEnumerable,le=h("symbol-registry"),he=h("symbols"),ce=h("op-symbols"),ue=Object[ne],ae="function"==typeof te,de=w.QObject,pe=!de||!de[ne]||!de[ne].findChild,fe=N&&P(function(){return 7!=ft(Xt({},"a",{get:function(){return Xt(this,"a",{value:7}).a}})).a})?function(t,e,i){var n=Qt(ue,e);n&&delete ue[e],Xt(t,e,i),n&&t!==ue&&Xt(ue,e,n)}:Xt,ve=function(t){var e=he[t]=ft(te[ne]);return e._k=t,e},ye=ae&&"symbol"==typeof te.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof te},me=function(t,e,i){return t===ue&&me(ce,e,i),M(t),e=I(e,!0),M(i),v(he,e)?(i.enumerable?(v(t,oe)&&t[oe][e]&&(t[oe][e]=!1),i=ft(i,{enumerable:D(0,!1)})):(v(t,oe)||Xt(t,oe,D(1,{})),t[oe][e]=!0),fe(t,e,i)):Xt(t,e,i)},be=function(t,e){M(t);for(var i,n=function(t){var e=z(t),i=U.f;if(i)for(var n,o=i(t),s=Q.f,r=0;o.length>r;)s.call(t,n=o[r++])&&e.push(n);return e}(e=u(e)),o=0,s=n.length;o<s;)me(t,i=n[o++],e[i]);return t},ge=function(t){var e=re.call(this,t=I(t,!0));return!(this===ue&&v(he,t)&&!v(ce,t))&&(!(e||!v(this,t)||!v(he,t)||v(this,oe)&&this[oe][t])||e)},we=function(t,e){if(t=u(t),e=I(e,!0),t!==ue||!v(he,e)||v(ce,e)){var i=Qt(t,e);return!i||!v(he,e)||v(t,oe)&&t[oe][e]||(i.enumerable=!0),i}},ke=function(t){for(var e,i=Zt(u(t)),n=[],o=0;i.length>o;)v(he,e=i[o++])||e==oe||e==Ut||n.push(e);return n},_e=function(t){for(var e,i=t===ue,n=Zt(i?ce:u(t)),o=[],s=0;n.length>s;)!v(he,e=n[s++])||i&&!v(ue,e)||o.push(he[e]);return o};ae||(rt((te=function(){if(this instanceof te)throw TypeError("Symbol is not a constructor!");var e=_(0<arguments.length?arguments[0]:void 0),i=function(t){this===ue&&i.call(ce,t),v(this,oe)&&v(this[oe],e)&&(this[oe][e]=!1),fe(this,e,D(1,t))};return N&&pe&&fe(ue,e,{configurable:!0,set:i}),ve(e)})[ne],"toString",function(){return this._k}),Jt.f=we,B.f=me,Rt.f=Kt.f=ke,Q.f=ge,U.f=_e,Ht.f=function(t){return ve(vt(t))}),V(V.G+V.W+V.F*!ae,{Symbol:te});for(var Se="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),Le=0;Se.length>Le;)vt(Se[Le++]);for(var Ee=z(vt.store),xe=0;Ee.length>xe;)qt(Ee[xe++]);V(V.S+V.F*!ae,"Symbol",{for:function(t){return v(le,t+="")?le[t]:le[t]=te(t)},keyFor:function(t){if(!ye(t))throw TypeError(t+" is not a symbol!");for(var e in le)if(le[e]===t)return e},useSetter:function(){pe=!0},useSimple:function(){pe=!1}}),V(V.S+V.F*!ae,"Object",{create:function(t,e){return void 0===e?ft(t):be(ft(t),e)},defineProperty:me,defineProperties:be,getOwnPropertyDescriptor:we,getOwnPropertyNames:ke,getOwnPropertySymbols:_e}),ee&&V(V.S+V.F*(!ae||P(function(){var t=te();return"[null]"!=ie([t])||"{}"!=ie({a:t})||"{}"!=ie(Object(t))})),"JSON",{stringify:function(t){for(var e,i,n=[t],o=1;arguments.length>o;)n.push(arguments[o++]);if(i=e=n[1],(j(e)||void 0!==t)&&!ye(t))return Bt(e)||(e=function(t,e){if("function"==typeof i&&(e=i.call(this,t,e)),!ye(e))return e}),n[1]=e,ie.apply(ee,n)}}),te[ne][se]||R(te[ne],se,te[ne].valueOf),bt(te,"Symbol"),bt(Math,"Math",!0),bt(w.JSON,"JSON",!0),qt("asyncIterator"),qt("observable");var Oe=g.Symbol,Ce=r(function(e){function i(t){return(i="function"==typeof Oe&&"symbol"==typeof Wt?function(t){return typeof t}:function(t){return t&&"function"==typeof Oe&&t.constructor===Oe&&t!==Oe.prototype?"symbol":typeof t})(t)}function n(t){return"function"==typeof Oe&&"symbol"===i(Wt)?e.exports=n=function(t){return i(t)}:e.exports=n=function(t){return t&&"function"==typeof Oe&&t.constructor===Oe&&t!==Oe.prototype?"symbol":i(t)},n(t)}e.exports=n});var ze=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t};var Te=function(t,e){return!e||"object"!==Ce(e)&&"function"!=typeof e?ze(t):e};K("getPrototypeOf",function(){return function(t){return St(d(t))}});var je=g.Object.getPrototypeOf,Me=function(t,e){if(M(t),!j(e)&&null!==e)throw TypeError(e+": can't set as prototype!")},Pe={set:Object.setPrototypeOf||("__proto__"in{}?function(t,i,n){try{(n=T(Function.call,Jt.f(Object.prototype,"__proto__").set,2))(t,[]),i=!(t instanceof Array)}catch(t){i=!0}return function(t,e){return Me(t,e),i?t.__proto__=e:n(t,e),t}}({},!1):void 0),check:Me};V(V.S,"Object",{setPrototypeOf:Pe.set});var Ne=g.Object.setPrototypeOf,Ae=r(function(e){function i(t){return e.exports=i=Ne?je:function(t){return t.__proto__||je(t)},i(t)}e.exports=i});V(V.S,"Object",{create:ft});var He=g.Object,We=function(t,e){return He.create(t,e)},Fe=r(function(i){function n(t,e){return i.exports=n=Ne||function(t,e){return t.__proto__=e,t},n(t,e)}i.exports=n});var Ie=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=We(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&Fe(t,e)},qe=function(){function e(t){et(this,e),t=t||{},this.eventListeners=new Array,this.el=t.el||document.createElement("div"),this.$el=$(this.el),this.on=function(t,e){this.eventListeners.push({type:t,handler:e})},this.trigger=function(t){for(var e=0;e<this.eventListeners.length;e++)"*"!=this.eventListeners[e].type&&"all"!=this.eventListeners[e].type&&t!=this.eventListeners[e].type||this.eventListeners[e].handler(t,this)},this.initialize(t)}return st(e,[{key:"pick",value:function(e,t){var i={};return t.forEach(function(t){void 0!==e[t]&&(i[t]=e[t])}),i}},{key:"extend",value:function(t,e){}},{key:"initialize",value:function(){}}]),e}();function Be(t,e){return t.classList?t.classList.contains(e):new RegExp("(^| )"+e+"( |$)","gi").test(t.className)}function De(e,t){e.classList?Ve(t.split(" "),function(t){e.classList.add(t)}):e.className+=" "+t}function Re(t,e){var i=function(t){t.classList?t.classList.remove(e):t.className=t.className.replace(new RegExp("(^|\\b)"+e.split(" ").join("|")+"(\\b|$)","gi")," ")};NodeList.prototype.isPrototypeOf(t)?Ve(t,i):i(t)}function Ge(t,e,i){if(t.classList)t.classList.toggle(e,i);else{var n=t.className.split(" "),o=n.indexOf(e);!1===i||!0!==i&&0<=o?n.splice(o,1):n.push(e),t.className=n.join(" ")}}function Ye(t,e){var i=document.createEvent("HTMLEvents");i.initEvent(e,!0,!1),t.dispatchEvent(i)}function Ve(t,e){for(var i=0;i<t.length;i++)e(t[i],i)}function Ke(t,e){return getComputedStyle(t)[e]}function $e(t){t.parentNode.removeChild(t)}function Je(t){var e=document.createElement("div");return e.innerHTML=t,e.children[0]}function Ue(t,e){var i=[];return Ve(t,function(t){e(t)&&i.push(t)}),i}function Qe(t,i,n){t.addEventListener(i,function t(e){return console.log("fn",i,t),e.target.removeEventListener(e.type,t),n(e)})}function Xe(t){var e=t.getBoundingClientRect();return{top:e.top+window.scrollY,left:e.left+window.scrollX}}var Ze=function(t){function e(){return et(this,e),Te(this,Ae(e).apply(this,arguments))}return Ie(e,qe),st(e,[{key:"initialize",value:function(t){t=t||{},this.options={align:"center",trigger:"click",show_arrow:!0,hide_sm:!1,square:!1},tt(this.options,this.pick(t,J(this.options))),this.content=t.content,(this.el.dropdown=this).el.addEventListener(this.options.trigger,this.toggle.bind(this)),this.el.addEventListener("mousedown",function(){this.mousedown=!0}.bind(this)),this.el.addEventListener("mouseup",function(){this.mousedown=!1}.bind(this)),this.el.addEventListener("focus",function(){this.mousedown||this.show()}.bind(this)),document.addEventListener("focus",this.outsideClick.bind(this)),document.addEventListener(this.options.trigger,this.outsideClick.bind(this)),document.addEventListener("keyup",this.keyup.bind(this)),window.addEventListener("resize",this.resize.bind(this))}},{key:"render",value:function(){if(this.dropdown=document.createElement("div"),De(this.dropdown,"uniformDropdown-dropdown"),De(this.dropdown,"absolute"),this.dropdown.style.minWidth=this.$el.outerWidth(),this.dropdown.innerHTML=this.content.innerHTML?this.content.innerHTML:this.content,this.options.show_arrow){De(this.dropdown,"has-pointer");var t=document.createElement("div");De(t,"uniformDropdown-pointer"),this.dropdown.appendChild(t)}return Ge(this.dropdown,"square",this.options.square),this.dropdown.style.display="none",document.body.appendChild(this.dropdown),Re(this.dropdown.querySelectorAll(".hidden"),"hidden"),this}},{key:"resize",value:function(){if(this.dropdown){var t=Xe(this.el);this.dropdown.style.top=t.top+this.el.offsetHeight+"px","center"==this.options.align?this.dropdown.style.left=t.left+this.el.offsetWidth/2-this.dropdown.offsetWidth/2+"px":"right"==this.options.align?this.dropdown.style.right=window.innerWidth-(t.left+this.el.offsetWidth)+"px":this.dropdown.style.left=t.left+"px",this.dropdown.style.left&&this.dropdown.style.left+this.dropdown.offsetWidth>window.innerWidth&&(this.dropdown.style.left=window.innerWidth-this.dropdown.offsetWidth+"px")}}},{key:"remove",value:function(){this.el.parentNode.removeChild(this.el),this.el.removeEventListener(this.options.trigger),window.removeEventListener("resize",this.resize.bind(this)),document.removeEventListener(this.options.trigger,this.outsideClick.bind(this)),document.removeEventListener("keyup",this.keyup.bind(this))}},{key:"toggle",value:function(t){Be(this.el,"active")&&"click"==t.type?this.hide():this.show()}},{key:"show",value:function(){this.options.hide_sm&&window.innerWidth<720||(this.dropdown||this.render(),this.dropdown.style.display="block",De(this.el,"active"),this.resize(),this.overlay=document.createElement("div"),De(this.overlay,"uniformOverlay"),document.body.appendChild(this.overlay),window.innerWidth<720&&(this.lastScrollPosition=window.scrollY,De(document.body,"uniformModal-hideBody")),this.overlay.addEventListener("click",this.hide.bind(this)),this.trigger("shown"))}},{key:"hide",value:function(){this.dropdown&&(this.dropdown.style.display="none",Re(this.el,"active"),this.overlay&&this.overlay.parentNode.removeChild(this.overlay),window.innerWidth<720&&(Re(document.body,"uniformModal-hideBody"),window.scrollTo(0,this.lastScrollPosition)),this.trigger("hidden"))}},{key:"outsideClick",value:function(t){this.dropdown&&null!==this.dropdown.offsetParent&&t.target!==this.el&&t.target!==this.overlay&&(this.el.contains(t.target)||this.dropdown.contains(t.target)||this.hide())}},{key:"keyup",value:function(t){27==t.which&&this.hide()}}]),e}(),ti=function(t){function e(){return et(this,e),Te(this,Ae(e).apply(this,arguments))}return Ie(e,qe),st(e,[{key:"initialize",value:function(t){this.el.addEventListener("change",this.change.bind(this))}},{key:"render",value:function(){var t=Be(this.el,"uniformRadio")?"uniformRadio":"uniformCheckbox";return this.checkbox=document.createElement("div"),De(this.checkbox,"".concat(t,"-indicator")),this.el.className&&""!=this.el.className.replace(t,"")&&De(this.checkbox,this.el.className.replace(t,"")),Ge(this.checkbox,"checked",this.el.checked),this.el.parentNode.insertBefore(this.checkbox,this.el.nextSibling),this.checkbox.addEventListener("click",this.click.bind(this)),this}},{key:"click",value:function(t){this.el.disabled||(this.el.checked=!this.el.checked,Ye(this.el,"change"),t.preventDefault())}},{key:"change",value:function(){Ge(this.checkbox,"checked",this.el.checked)}}]),e}(),ei=function(t){function e(){return et(this,e),Te(this,Ae(e).apply(this,arguments))}return Ie(e,qe),st(e,[{key:"initialize",value:function(t){this.options={},this.options.klass=t.klass||!1,this.content=t.content,De(this.el,"uniformModal"),document.addEventListener("keyup",this.keyup.bind(this)),this.el.addEventListener("click",this.checkCloseButton.bind(this))}},{key:"keyup",value:function(t){27==t.which&&this.close()}},{key:"render",value:function(){var t="function"==typeof this.content?this.content():this.content;this.highest_z_index=0,this.overlay=document.createElement("div"),De(this.overlay,"uniformModal-overlay"),this.blur=document.createElement("div"),De(this.blur,"uniformModal-blur"),this.original_scroll=window.scrollY,this.blur.style.top=0-this.original_scroll+"px",0<document.body.querySelectorAll(".uniformModal").length&&(this.highest_z_index=Math.max(Array.prototype.map.call(document.body.querySelectorAll(".uniformModal"),function(t){return parseInt(Ke(t,"zIndex"))})),this.el.style.zIndex=this.highest_z_index+2),this.el.appendChild(this.overlay);for(var e=document.body.children,i=e.length,n=0;n<i;n++)this.blur.appendChild(e[0]);De(document.body,"uniformModal-active"),document.body.appendChild(this.blur),document.body.appendChild(this.el);var o=document.createElement("div");De(o,"uniformModal-container"),o.innerHTML=t.innerHTML?t.innerHTML:t;var s=document.createElement("div");return De(s,"uniformModal-close"),o.appendChild(s),this.el.style.top=window.scrollY,this.overlay.addEventListener("click",this.close.bind(this)),this.el.appendChild(o),this.options.klass&&De(o,this.options.klass),t.innerHTML&&Ye(t,"rendered"),this.trigger("rendered"),this}},{key:"checkCloseButton",value:function(t){Be(t.target,"uniformModal-close")&&this.close()}},{key:"close",value:function(){Re(document.querySelectorAll("uniformModal-active"),"uniformModal-active");for(var t=this.blur.children,e=t.length,i=0;i<e;i++)document.body.appendChild(t[0]);this.blur.parentNode.removeChild(this.blur),window.scrollTo(0,this.original_scroll),this.trigger("closed"),this.remove()}},{key:"remove",value:function(){this.overlay.parentNode.removeChild(this.overlay),this.el.parentNode.removeChild(this.el),this.el.removeEventListener("click",this.checkCloseButton.bind(this)),this.overlay.removeEventListener("click",this.close.bind(this)),document.removeEventListener("keyup",this.keyup.bind(this))}}]),e}(),ii='\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 32 32">\n<path d="M28.998 8.531l-2.134-2.134c-0.394-0.393-1.030-0.393-1.423 0l-12.795 12.795-6.086-6.13c-0.393-0.393-1.029-0.393-1.423 0l-2.134 2.134c-0.393 0.394-0.393 1.030 0 1.423l8.924 8.984c0.393 0.393 1.030 0.393 1.423 0l15.648-15.649c0.393-0.392 0.393-1.030 0-1.423z"></path>\n</svg>\n'.trim(),ni='\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 20 20">\n<path d="M13.418 7.601c0.271-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-3.907 3.83c-0.271 0.268-0.709 0.268-0.979 0l-3.908-3.83c-0.27-0.268-0.27-0.701 0-0.969s0.708-0.268 0.979 0l3.418 3.14 3.418-3.14z"></path>\n</svg>\n'.trim(),oi=function(t){function e(){return et(this,e),Te(this,Ae(e).apply(this,arguments))}return Ie(e,qe),st(e,[{key:"initialize",value:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};this.options={label:!1,class:"",showAll:function(t){Re(t.querySelectorAll("button.hide"),"hide");var e=t.querySelector(".uniformSelect-show-all");return e.parentNode.removeChild(e),!1},limit:8},tt(this.options,this.pick(t,J(this.options))),this.el.addEventListener("change",this.updateSelect.bind(this)),this.el.addEventListener("close",this.hideOptions.bind(this)),this.el.addEventListener("revealed",this.resize.bind(this)),this.el.uniformSelect=this,window.addEventListener("resize",this.resize.bind(this)),window.addEventListener("scroll",this.updatePosition.bind(this)),document.addEventListener("click",this.outsideClick.bind(this)),document.addEventListener("keyup",this.keyup.bind(this)),this.activeIcon=document.createElement("span"),De(this.activeIcon,"uniformSelect-option-icon"),this.activeIcon.innerHTML=ii}},{key:"outsideClick",value:function(t){this.showing&&t.target!==this.select_options&&(this.container.contains(t.target)||this.select_options.contains(t.target)||this.hideOptions())}},{key:"keyup",value:function(t){27===t.which&&this.hideOptions()}},{key:"render",value:function(){this.container=document.createElement("div"),De(this.container,"uniformSelect-container"),this.edit_button=Je("<button type='button' class='uniformSelect-edit uniformInput outline block ".concat(this.options.class,'\'><span class="text-js"></span><span class="uniformSelect-edit-icon">').concat(ni,"</span></button>")),this.container.appendChild(this.edit_button),this.el.name&&De(this.container,this.name.toLowerCase().replace(/[^a-z0-9\-_]+/g,"-")),this.el.style.display="none",this.el.insertAdjacentElement("beforebegin",this.container),this.updateSelect(),this.resize(),this.edit_button.addEventListener("click",this.showOptions.bind(this))}},{key:"resize",value:function(){for(var t=[],e=this.edit_button.children.length,i=0;i<e;i++)t.push(this.edit_button.children[0]),this.edit_button.children[0].parentNode.removeChild(this.edit_button.children[0]);this.edit_button.innerHTML="",this.edit_button.style.width="auto",this.edit_button.style.width=this.container.offsetWidth+"px",Ve(t,function(t){this.edit_button.appendChild(t)}.bind(this)),void 0!==this.select_options&&(window.innerWidth<720||(this.select_options.style.position="absolute",this.select_options.style.top=Xe(this.container).top+this.container.offsetHeight+"px",this.select_options.style.left=Xe(this.container).left+1+"px",this.select_options.style.minWidth=this.container.offsetWidth-1+"px"))}},{key:"renderOptions",value:function(){this.select_options=Je("<div class='uniformSelect-options'>"),this.options.label&&this.select_options.append('<div class="uniformSelect-label hide show-sm margin-bottom text-bold">'.concat(this.options.label,"</div>")),this.el.name&&De(this.select_options,this.el.name.toLowerCase().replace(/[^a-z0-9\-_]+/g,"-")),this.select_options.style.fontSize=Ke(this.el,"font-size"),this.select_options.style.display="none",document.body.appendChild(this.select_options),Ve(this.el.querySelectorAll("option"),function(t,e){var i=Je("<button type='button' class='uniformSelect-option block outline text-left'>");i.option=t,i.textContent=t.textContent,i.value=t.value,""==i.textContent&&i.innerHTML("<span class='text-italic text-muted'>None</span>"),t.selected?(De(i,"active"),i.append(this.activeIcon.cloneNode(!0))):this.options.limit&&e>this.options.limit&&De(i,"hide"),this.select_options.append(i),i.addEventListener("click",this.selectOption.bind(this))}.bind(this));var t=Je('<div class="uniformSelect-options-actions"></div>');if(this.options.limit&&this.el.querySelectorAll("option").length>this.options.limit){var e=Je("<button type='button' class='uniformSelect-show-all outline blue' style='display: block; border: none'>Show All</button>");e.addEventListener("click",function(t){Ye(this.el,"show_all"),this.options.showAll&&this.options.showAll(this.select_options),t.preventDefault(),t.stopPropagation()}.bind(this)),t.appendChild(e)}if(this.el.multiple){var i=Je("<button type='button' class='uniformSelect-done block outline blue'>Done</button>");i.addEventListener("click",this.hideOptions.bind(this)),t.appendChild(i)}""!==t.innerHTML&&this.select_options.appendChild(t),Ye(this.el,"rendered")}},{key:"hideOptions",value:function(){void 0!==this.select_options&&(this.showing=!1,this.select_options.style.display="none",Re(this.select_options,"fixed"),Re(this.edit_button,"active"),Re(document.body,"uniformModal-hideBody"),this.lastScrollPosition&&window.innerWidth<720&&window.scrollTo(0,this.lastScrollPosition),Ye(this.el,"hidden:options"))}},{key:"showOptions",value:function(){if(this.showing)return this.hideOptions(),!1;this.showing=!0,this.select_options||this.renderOptions(),this.resize(),this.select_options.style.display="block",De(this.edit_button,"active"),this.lastScrollPosition=window.scrollY,this.updatePosition(),De(document.body,"uniformModal-hideBody")}},{key:"selectOption",value:function(t){this.el.multiple||(Ve(Ue(this.el.querySelectorAll("option"),function(t){return t.selected}),function(t){t.selected=!1}),Ve(this.select_options.querySelectorAll(".uniformSelect-option.active .uniformSelect-option-icon"),$e),Re(this.select_options.querySelectorAll(".uniformSelect-option.active"),"active")),Ge(t.currentTarget,"active"),t.currentTarget.option.selected=Be(t.currentTarget,"active"),Be(t.currentTarget,"active")?t.currentTarget.append(this.activeIcon.cloneNode(!0)):Ve(t.currentTarget.querySelectorAll(".uniformSelect-option-icon"),$e),Ye(this.el,"change")}},{key:"updateSelect",value:function(){this.el.multiple||this.hideOptions();var t=function(t,e){for(var i=[],n=0;n<t.length;n++)i.push(e(t[n],n));return i}(Ue(this.el.querySelectorAll("option"),function(t){return t.selected}),function(t){return t.textContent}).join(", ");""==t&&(t="&nbsp;"),this.edit_button.querySelector(".text-js").innerHTML=t}},{key:"updatePosition",value:function(){if(this.select_options){var t=Ue(function(t){var e=[];for(t=t.parentElement;t;)e.push(t),t=t.parentElement;return e}(this.container),function(t){return"fixed"==Ke(t,"position")});Be(this.select_options,"fixed")?0==t.length&&(this.select_options.style.position="absolute",this.select_options.style.top=Xe(this.container).top+this.container.offsetHeight+"px",Re(this.select_options,"fixed")):0<t.length&&(720<window.innerWidth&&(this.lastScrollPosition=!1),this.select_options.style.position="fixed",this.select_options.style.top=Xe(this.container).top+this.container.offsetHeight+"px",this.select_options.style.left=Xe(this.container).left+"px",De(this.select_options,"fixed"))}}}]),e}(),si=function(t){function e(){return et(this,e),Te(this,Ae(e).apply(this,arguments))}return Ie(e,qe),st(e,[{key:"initialize",value:function(){this.label=this.el.querySelector("label"),this.input=this.el.querySelector("#"+this.label.getAttribute("for")),this.startingHeight,this.input.addEventListener("focus",this.activate.bind(this)),this.input.addEventListener("blur",this.deactivate.bind(this)),this.input.addEventListener("revealed",this.render.bind(this))}},{key:"render",value:function(){if(null!==this.input.offsetParent&&!Be(this.el,"enabled")){var t,e=parseInt(Ke(this.input,"paddingBottom"));this.startingHeight=this.input.offsetHeight,De(this.el,"enabled"),De(this.el,"inactive"),this.input.style.paddingTop=e+e/2+"px",this.input.style.paddingBottom=e-e/2-2+"px",this.label.style.position="absolute",this.label.style.top=0,this.label.style.left=this.label.offsetLeft,this.label.style.paddingLeft=Ke(this.input,"paddingLeft"),this.label.style.height=this.startingHeight,this.label.style.lineHeight=this.startingHeight+"px",t=this.input,document.activeElement===t&&this.activate(),void 0!==this.input.value&&""!=this.input.value&&this.activate()}}},{key:"activate",value:function(t){void 0!==t&&De(this.el,"active"),Be(this.el,"float")||(De(this.el,"float"),Re(this.el,"inactive"),this.label.style.lineHeight=this.startingHeight/2+"px")}},{key:"deactivate",value:function(t){void 0!==t&&Re(this.el,"active"),""==this.input.value&&(Re(this.el,"float"),De(this.el,"inactive"),this.label.style.lineHeight=this.startingHeight+"px")}}]),e}(),ri=function(t){function e(){return et(this,e),Te(this,Ae(e).apply(this,arguments))}return Ie(e,qe),st(e,[{key:"initialize",value:function(){window.addEventListener("resize",this.resize.bind(this)),Ye(window,"resize")}},{key:"resize",value:function(){var t=this.el.offsetWidth;720<t&&!Be(this.el,"md-size")?(De(this.el,"md-size"),Ye(window,"resized-md")):t<720&&Be(this.el,"md-size")&&Re(this.el,"md-size"),1080<t&&!this.el.hasClass("lg-size")?(De(this.el,"lg-size"),Ye(window,"resized-lg")):t<1080&&Be(this.el,"lg-size")&&Re(this.el,"lg-size"),1440<t&&!Be(this.el,"xl-size")?(De(this.el,"xl-size"),Ye(window,"resized-xl")):t<1440&&Be(this.el,"xl-size")&&Re(this.el,"xl-size"),t<720&&!Be(this.el,"sm-size")?(De(this.el,"sm-size"),Ye(window,"resized-sm")):720<t&&Be(this.el,"sm-size")&&Re(this.el,"sm-size")}}]),e}(),li=function(t){function e(){return et(this,e),Te(this,Ae(e).apply(this,arguments))}return Ie(e,qe),st(e,[{key:"initialize",value:function(t){t=t||{},this.options={align:"top"},tt(this.options,this.pick(t,J(this.options))),this.enabled=!0,this.message=t.message,(t.el.tooltip=this).el.addEventListener("mouseenter",this.show.bind(this)),this.el.addEventListener("mouseleave",this.hide.bind(this))}},{key:"render",value:function(){return this.popup=Je('<div class="uniformTooltip-popup">'+this.message+"</div>"),this.popup.insertBefore(Je("<div class='uniformTooltip-pointer'></div>"),this.popup.firstChild),this.el.appendChild(this.popup),100<this.message.length?this.popup.style.minWidth="200px":this.popup.style.whiteSpace="nowrap",this.popup.offsetWidth+Xe(this.popup).left>window.innerWidth&&(this.popup.style.left=window.innerWidth-this.popup.offsetWidth-Xe(this.popup).left+"px"),this.popup.style.display="block",("bottom"==this.options.align||Xe(this.popup).top<0)&&De(this.popup,"-align-bottom"),this.popup.style.display="none",this}},{key:"remove",value:function(){this.el.parentNode.removeChild(this.el)}},{key:"show",value:function(){if(this.popup||this.render(),this.enabled){if(this.hiding)return this.show_after_hide=!0;if(!this.showing&&!this.shown){this.popup.style.display="block",this.showing=!0,this.hidden=!1;var t=function(t){this.trigger("shown"),this.showing=!1,this.shown=!0,this.hide_after_show&&this.hide(),this.hide_after_show=!1}.bind(this);Qe(this.popup,"transitionend",t),Qe(this.popup,"msTransitionEnd",t),Qe(this.popup,"oTransitionEnd",t),Xe(this.popup).left<0&&(this.popup.style.left="0"),De(this.el,"active"),setTimeout(function(){De(this.popup,"-reveal")}.bind(this),1)}}}},{key:"hide",value:function(){if(this.showing)return this.hide_after_show=!0;if(!this.hiding&&!this.hidden){this.hiding=!0,this.shown=!1;var t=function(t){this.trigger("hidden"),Re(this.el,"active"),this.popup.style.display="none",this.hiding=!1,this.hidden=!0,this.show_after_hide&&this.show(),this.show_after_hide=!1}.bind(this);Qe(this.popup,"transitionend",t),Qe(this.popup,"msTransitionEnd",t),Qe(this.popup,"oTransitionEnd",t),Re(this.popup,"-reveal")}}},{key:"disable",value:function(){this.enabled=!1}},{key:"enabled",value:function(){this.enabled=!0}}]),e}();return t.Dropdown=Ze,t.Checkbox=ti,t.Modal=ei,t.Select=oi,t.FloatingLabel=si,t.Resizer=ri,t.Tooltip=li,t}({});