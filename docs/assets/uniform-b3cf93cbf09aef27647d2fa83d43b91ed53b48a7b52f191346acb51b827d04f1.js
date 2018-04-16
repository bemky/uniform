var Uniform=function(t){"use strict";var a=function(t){if(null==t)throw TypeError("Can't call method on  "+t);return t},d=function(t){return Object(a(t))},i={}.hasOwnProperty,v=function(t,e){return i.call(t,e)},n={}.toString,o=function(t){return n.call(t).slice(8,-1)},f=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==o(t)?t.split(""):Object(t)},c=function(t){return f(a(t))},s=Math.ceil,r=Math.floor,u=function(t){return isNaN(t=+t)?0:(0<t?r:s)(t)},p=Math.min,y=Math.max,g=Math.min;function h(t,e){return t(e={exports:{}},e.exports),e.exports}var b,w=h(function(t){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)}),l="__core-js_shared__",m=w[l]||(w[l]={}),_=function(t){return m[t]||(m[t]={})},k=0,S=Math.random(),O=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++k+S).toString(36))},C=_("keys"),x=function(t){return C[t]||(C[t]=O(t))},z=(b=!1,function(t,e,i){var n,o,s,r,a=c(t),h=0<(n=a.length)?p(u(n),9007199254740991):0,l=(s=h,(o=u(o=i))<0?y(o+s,0):g(o,s));if(b&&e!=e){for(;l<h;)if((r=a[l++])!=r)return!0}else for(;l<h;l++)if((b||l in a)&&a[l]===e)return b||l||0;return!b&&-1}),j=x("IE_PROTO"),P=function(t,e){var i,n=c(t),o=0,s=[];for(i in n)i!=j&&v(n,i)&&s.push(i);for(;e.length>o;)v(n,i=e[o++])&&(~z(s,i)||s.push(i));return s},T="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(","),M=Object.keys||function(t){return P(t,T)},L=h(function(t){var e=t.exports={version:"2.5.5"};"number"==typeof __e&&(__e=e)}),E=(L.version,function(n,o,t){if(function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!")}(n),void 0===o)return n;switch(t){case 1:return function(t){return n.call(o,t)};case 2:return function(t,e){return n.call(o,t,e)};case 3:return function(t,e,i){return n.call(o,t,e,i)}}return function(){return n.apply(o,arguments)}}),F=function(t){return"object"==typeof t?null!==t:"function"==typeof t},I=function(t){if(!F(t))throw TypeError(t+" is not an object!");return t},W=function(t){try{return!!t()}catch(t){return!0}},A=!W(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}),H=w.document,N=F(H)&&F(H.createElement),D=function(t){return N?H.createElement(t):{}},R=!A&&!W(function(){return 7!=Object.defineProperty(D("div"),"a",{get:function(){return 7}}).a}),B=function(t,e){if(!F(t))return t;var i,n;if(e&&"function"==typeof(i=t.toString)&&!F(n=i.call(t)))return n;if("function"==typeof(i=t.valueOf)&&!F(n=i.call(t)))return n;if(!e&&"function"==typeof(i=t.toString)&&!F(n=i.call(t)))return n;throw TypeError("Can't convert object to primitive value")},G=Object.defineProperty,q={f:A?Object.defineProperty:function(t,e,i){if(I(t),e=B(e,!0),I(i),R)try{return G(t,e,i)}catch(t){}if("get"in i||"set"in i)throw TypeError("Accessors not supported!");return"value"in i&&(t[e]=i.value),t}},V=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}},K=A?function(t,e,i){return q.f(t,e,V(1,i))}:function(t,e,i){return t[e]=i,t},J="prototype",Y=function(t,e,i){var n,o,s,r=t&Y.F,a=t&Y.G,h=t&Y.S,l=t&Y.P,c=t&Y.B,u=t&Y.W,d=a?L:L[e]||(L[e]={}),f=d[J],p=a?w:h?w[e]:(w[e]||{})[J];for(n in a&&(i=e),i)(o=!r&&p&&void 0!==p[n])&&v(d,n)||(s=o?p[n]:i[n],d[n]=a&&"function"!=typeof p[n]?i[n]:c&&o?E(s,w):u&&p[n]==s?function(n){var t=function(t,e,i){if(this instanceof n){switch(arguments.length){case 0:return new n;case 1:return new n(t);case 2:return new n(t,e)}return new n(t,e,i)}return n.apply(this,arguments)};return t[J]=n[J],t}(s):l&&"function"==typeof s?E(Function.call,s):s,l&&((d.virtual||(d.virtual={}))[n]=s,t&Y.R&&f&&!f[n]&&K(f,n,s)))};Y.F=1,Y.G=2,Y.S=4,Y.P=8,Y.B=16,Y.W=32,Y.U=64,Y.R=128;var Q=Y,U=function(t,e){var i=(L.Object||{})[t]||Object[t],n={};n[t]=e(i),Q(Q.S+Q.F*W(function(){i(1)}),"Object",n)};U("keys",function(){return function(t){return M(d(t))}});var X=L.Object.keys,Z={f:Object.getOwnPropertySymbols},tt={f:{}.propertyIsEnumerable},et=Object.assign,it=!et||W(function(){var t={},e={},i=Symbol(),n="abcdefghijklmnopqrst";return t[i]=7,n.split("").forEach(function(t){e[t]=t}),7!=et({},t)[i]||Object.keys(et({},e)).join("")!=n})?function(t,e){for(var i=d(t),n=arguments.length,o=1,s=Z.f,r=tt.f;o<n;)for(var a,h=f(arguments[o++]),l=s?M(h).concat(s(h)):M(h),c=l.length,u=0;u<c;)r.call(h,a=l[u++])&&(i[a]=h[a]);return i}:et;Q(Q.S+Q.F,"Object",{assign:it});var nt=L.Object.assign,ot=x("IE_PROTO"),st=Object.prototype,rt=Object.getPrototypeOf||function(t){return t=d(t),v(t,ot)?t[ot]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?st:null};U("getPrototypeOf",function(){return function(t){return rt(d(t))}});var at=L.Object.getPrototypeOf;function ht(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Q(Q.S+Q.F*!A,"Object",{defineProperty:q.f});var lt=L.Object,ct=function(t,e,i){return lt.defineProperty(t,e,i)};function ut(t,e){for(var i=0;i<e.length;i++){var n=e[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),ct(t,n.key,n)}}function dt(t,e,i){return e&&ut(t.prototype,e),i&&ut(t,i),t}var ft=K,pt=A?Object.defineProperties:function(t,e){I(t);for(var i,n=M(e),o=n.length,s=0;s<o;)q.f(t,i=n[s++],e[i]);return t},vt=w.document,yt=vt&&vt.documentElement,gt=x("IE_PROTO"),bt=function(){},wt="prototype",mt=function(){var t,e=D("iframe"),i=T.length;for(e.style.display="none",yt.appendChild(e),e.src="javascript:",(t=e.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),mt=t.F;i--;)delete mt[wt][T[i]];return mt()},$t=Object.create||function(t,e){var i;return null!==t?(bt[wt]=I(t),i=new bt,bt[wt]=null,i[gt]=t):i=mt(),void 0===e?i:pt(i,e)},_t=h(function(t){var e=_("wks"),i=w.Symbol,n="function"==typeof i;(t.exports=function(t){return e[t]||(e[t]=n&&i[t]||(n?i:O)("Symbol."+t))}).store=e}),kt=q.f,St=_t("toStringTag"),Ot=function(t,e,i){t&&!v(t=i?t:t.prototype,St)&&kt(t,St,{configurable:!0,value:e})},Ct={};K(Ct,_t("iterator"),function(){return this});var xt,zt=_t("iterator"),jt=!([].keys&&"next"in[].keys()),Pt="values",Tt=function(t,e,i,n,o,s,r){var a,h,l;h=e,l=n,(a=i).prototype=$t(Ct,{next:V(1,l)}),Ot(a,h+" Iterator");var c,u,d,f=function(t){if(!jt&&t in g)return g[t];switch(t){case"keys":case Pt:return function(){return new i(this,t)}}return function(){return new i(this,t)}},p=e+" Iterator",v=o==Pt,y=!1,g=t.prototype,b=g[zt]||g["@@iterator"]||o&&g[o],w=b||f(o),m=o?v?f("entries"):w:void 0,$="Array"==e&&g.entries||b;if($&&(d=rt($.call(new t)))!==Object.prototype&&d.next&&Ot(d,p,!0),v&&b&&b.name!==Pt&&(y=!0,w=function(){return b.call(this)}),r&&(jt||y||!g[zt])&&K(g,zt,w),o)if(c={values:v?w:f(Pt),keys:s?w:f("keys"),entries:m},r)for(u in c)u in g||ft(g,u,c[u]);else Q(Q.P+Q.F*(jt||y),e,c);return c},Mt=(xt=!0,function(t,e){var i,n,o=String(a(t)),s=u(e),r=o.length;return s<0||r<=s?xt?"":void 0:(i=o.charCodeAt(s))<55296||56319<i||s+1===r||(n=o.charCodeAt(s+1))<56320||57343<n?xt?o.charAt(s):i:xt?o.slice(s,s+2):n-56320+(i-55296<<10)+65536});Tt(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,i=this._i;return i>=e.length?{value:void 0,done:!0}:(t=Mt(e,i),this._i+=t.length,{value:t,done:!1})});for(var Lt=function(t,e){return{value:e,done:!!t}},Et=(Tt(Array,"Array",function(t,e){this._t=c(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,i=this._i++;return!t||i>=t.length?(this._t=void 0,Lt(1)):Lt(0,"keys"==e?i:"values"==e?t[i]:[i,t[i]])},"values"),_t("toStringTag")),Ft="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),It=0;It<Ft.length;It++){var Wt=Ft[It],At=w[Wt],Ht=At&&At.prototype;Ht&&!Ht[Et]&&K(Ht,Et,Wt)}var Nt={f:_t},Dt=Nt.f("iterator"),Rt=h(function(t){var i=O("meta"),e=q.f,n=0,o=Object.isExtensible||function(){return!0},s=!W(function(){return o(Object.preventExtensions({}))}),r=function(t){e(t,i,{value:{i:"O"+ ++n,w:{}}})},a=t.exports={KEY:i,NEED:!1,fastKey:function(t,e){if(!F(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!v(t,i)){if(!o(t))return"F";if(!e)return"E";r(t)}return t[i].i},getWeak:function(t,e){if(!v(t,i)){if(!o(t))return!0;if(!e)return!1;r(t)}return t[i].w},onFreeze:function(t){return s&&a.NEED&&o(t)&&!v(t,i)&&r(t),t}}}),Bt=(Rt.KEY,Rt.NEED,Rt.fastKey,Rt.getWeak,Rt.onFreeze,q.f),Gt=function(t){var e=L.Symbol||(L.Symbol={});"_"==t.charAt(0)||t in e||Bt(e,t,{value:Nt.f(t)})},qt=Array.isArray||function(t){return"Array"==o(t)},Vt=T.concat("length","prototype"),Kt={f:Object.getOwnPropertyNames||function(t){return P(t,Vt)}},Jt=Kt.f,Yt={}.toString,Qt="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],Ut={f:function(t){return Qt&&"[object Window]"==Yt.call(t)?function(t){try{return Jt(t)}catch(t){return Qt.slice()}}(t):Jt(c(t))}},Xt=Object.getOwnPropertyDescriptor,Zt={f:A?Xt:function(t,e){if(t=c(t),e=B(e,!0),R)try{return Xt(t,e)}catch(t){}if(v(t,e))return V(!tt.f.call(t,e),t[e])}},te=Rt.KEY,ee=Zt.f,ie=q.f,ne=Ut.f,oe=w.Symbol,se=w.JSON,re=se&&se.stringify,ae="prototype",he=_t("_hidden"),le=_t("toPrimitive"),ce={}.propertyIsEnumerable,ue=_("symbol-registry"),de=_("symbols"),fe=_("op-symbols"),pe=Object[ae],ve="function"==typeof oe,ye=w.QObject,ge=!ye||!ye[ae]||!ye[ae].findChild,be=A&&W(function(){return 7!=$t(ie({},"a",{get:function(){return ie(this,"a",{value:7}).a}})).a})?function(t,e,i){var n=ee(pe,e);n&&delete pe[e],ie(t,e,i),n&&t!==pe&&ie(pe,e,n)}:ie,we=function(t){var e=de[t]=$t(oe[ae]);return e._k=t,e},me=ve&&"symbol"==typeof oe.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof oe},$e=function(t,e,i){return t===pe&&$e(fe,e,i),I(t),e=B(e,!0),I(i),v(de,e)?(i.enumerable?(v(t,he)&&t[he][e]&&(t[he][e]=!1),i=$t(i,{enumerable:V(0,!1)})):(v(t,he)||ie(t,he,V(1,{})),t[he][e]=!0),be(t,e,i)):ie(t,e,i)},_e=function(t,e){I(t);for(var i,n=function(t){var e=M(t),i=Z.f;if(i)for(var n,o=i(t),s=tt.f,r=0;o.length>r;)s.call(t,n=o[r++])&&e.push(n);return e}(e=c(e)),o=0,s=n.length;o<s;)$e(t,i=n[o++],e[i]);return t},ke=function(t){var e=ce.call(this,t=B(t,!0));return!(this===pe&&v(de,t)&&!v(fe,t))&&(!(e||!v(this,t)||!v(de,t)||v(this,he)&&this[he][t])||e)},Se=function(t,e){if(t=c(t),e=B(e,!0),t!==pe||!v(de,e)||v(fe,e)){var i=ee(t,e);return!i||!v(de,e)||v(t,he)&&t[he][e]||(i.enumerable=!0),i}},Oe=function(t){for(var e,i=ne(c(t)),n=[],o=0;i.length>o;)v(de,e=i[o++])||e==he||e==te||n.push(e);return n},Ce=function(t){for(var e,i=t===pe,n=ne(i?fe:c(t)),o=[],s=0;n.length>s;)!v(de,e=n[s++])||i&&!v(pe,e)||o.push(de[e]);return o};ve||(ft((oe=function(){if(this instanceof oe)throw TypeError("Symbol is not a constructor!");var e=O(0<arguments.length?arguments[0]:void 0),i=function(t){this===pe&&i.call(fe,t),v(this,he)&&v(this[he],e)&&(this[he][e]=!1),be(this,e,V(1,t))};return A&&ge&&be(pe,e,{configurable:!0,set:i}),we(e)})[ae],"toString",function(){return this._k}),Zt.f=Se,q.f=$e,Kt.f=Ut.f=Oe,tt.f=ke,Z.f=Ce,Nt.f=function(t){return we(_t(t))}),Q(Q.G+Q.W+Q.F*!ve,{Symbol:oe});for(var xe="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),ze=0;xe.length>ze;)_t(xe[ze++]);for(var je=M(_t.store),Pe=0;je.length>Pe;)Gt(je[Pe++]);Q(Q.S+Q.F*!ve,"Symbol",{for:function(t){return v(ue,t+="")?ue[t]:ue[t]=oe(t)},keyFor:function(t){if(!me(t))throw TypeError(t+" is not a symbol!");for(var e in ue)if(ue[e]===t)return e},useSetter:function(){ge=!0},useSimple:function(){ge=!1}}),Q(Q.S+Q.F*!ve,"Object",{create:function(t,e){return void 0===e?$t(t):_e($t(t),e)},defineProperty:$e,defineProperties:_e,getOwnPropertyDescriptor:Se,getOwnPropertyNames:Oe,getOwnPropertySymbols:Ce}),se&&Q(Q.S+Q.F*(!ve||W(function(){var t=oe();return"[null]"!=re([t])||"{}"!=re({a:t})||"{}"!=re(Object(t))})),"JSON",{stringify:function(t){for(var e,i,n=[t],o=1;arguments.length>o;)n.push(arguments[o++]);if(i=e=n[1],(F(e)||void 0!==t)&&!me(t))return qt(e)||(e=function(t,e){if("function"==typeof i&&(e=i.call(this,t,e)),!me(e))return e}),n[1]=e,re.apply(se,n)}}),oe[ae][le]||K(oe[ae],le,oe[ae].valueOf),Ot(oe,"Symbol"),Ot(Math,"Math",!0),Ot(w.JSON,"JSON",!0),Gt("asyncIterator"),Gt("observable");var Te=L.Symbol;function Me(t){return(Me="function"==typeof Te&&"symbol"==typeof Dt?function(t){return typeof t}:function(t){return t&&"function"==typeof Te&&t.constructor===Te&&t!==Te.prototype?"symbol":typeof t})(t)}function Le(t){return(Le="function"==typeof Te&&"symbol"===Me(Dt)?function(t){return Me(t)}:function(t){return t&&"function"==typeof Te&&t.constructor===Te&&t!==Te.prototype?"symbol":Me(t)})(t)}function Ee(t,e){return!e||"object"!==Le(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}var Fe=function(t,e){if(I(t),!F(e)&&null!==e)throw TypeError(e+": can't set as prototype!")},Ie={set:Object.setPrototypeOf||("__proto__"in{}?function(t,i,n){try{(n=E(Function.call,Zt.f(Object.prototype,"__proto__").set,2))(t,[]),i=!(t instanceof Array)}catch(t){i=!0}return function(t,e){return Fe(t,e),i?t.__proto__=e:n(t,e),t}}({},!1):void 0),check:Fe};Q(Q.S,"Object",{setPrototypeOf:Ie.set});var We=L.Object.setPrototypeOf;Q(Q.S,"Object",{create:$t});var Ae=L.Object,He=function(t,e){return Ae.create(t,e)};function Ne(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=He(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(We?We(t,e):t.__proto__=e)}var De,Re=function(){function e(t){ht(this,e),this.eventListeners=new Array,t.el?this.$el=t.el instanceof $?t.el:$(t.el):this.$el=$("<div>"),this.el=this.$el[0],this.on=function(t,e){this.eventListeners.push({type:t,handler:e})},this.trigger=function(t){for(var e=0;e<this.eventListeners.length;e++)"*"!=this.eventListeners[e].type&&"all"!=this.eventListeners[e].type&&t!=this.eventListeners[e].type||this.eventListeners[e].handler(t,this)},this.initialize(t)}return dt(e,[{key:"pick",value:function(e,t){var i={};return t.forEach(function(t){void 0!==e[t]&&(i[t]=e[t])}),i}},{key:"initialize",value:function(){}}]),e}(),Be=function(t){function e(){return ht(this,e),Ee(this,(e.__proto__||at(e)).apply(this,arguments))}return Ne(e,Re),dt(e,[{key:"initialize",value:function(t){t=t||{},this.options={align:"center",trigger:"click",show_arrow:!0,hide_sm:!1,square:!1},nt(this.options,this.pick(t,X(this.options))),this.content=t.content,(this.$el[0].dropdown=this).$el.on(this.options.trigger,this.toggle.bind(this)),this.$el.on("mousedown",function(){this.mousedown=!0}.bind(this)),this.$el.on("mouseup",function(){this.mousedown=!1}.bind(this)),this.$el.on("focus",function(){this.mousedown||this.show()}.bind(this)),$(document).on("focus",this.outsideClick.bind(this)),$(document).on(this.options.trigger,this.outsideClick.bind(this)),$(document).on("keyup",this.keyup.bind(this)),$(window).on("resize",this.resize.bind(this))}},{key:"render",value:function(){return this.dropdown=$("<div class='uniformDropdown-dropdown absolute'>"),this.dropdown.css({minWidth:this.$el.outerWidth()}),this.options.show_arrow&&(this.dropdown.addClass("has-pointer"),this.dropdown.append("<div class='uniformDropdown-pointer'></div>")),this.dropdown.toggleClass("square",this.options.square),this.dropdown.hide(),this.dropdown.append(this.content),this.dropdown.appendTo($("body")),this.dropdown.find(".hidden").removeClass("hidden"),this.resize(),this}},{key:"resize",value:function(){if(this.dropdown){var t={top:this.$el.offset().top+this.$el.outerHeight()};"center"==this.options.align?t.left=this.$el.offset().left+this.$el.outerWidth()/2-this.dropdown.outerWidth()/2:"right"==this.options.align?t.right=$(window).width()-(this.$el.offset().left+this.$el.outerWidth()):t.left=this.$el.offset().left,t.left&&t.left+this.dropdown.outerWidth()>$(window).width()&&(t.left=$(window).width()-this.dropdown.outerWidth()),this.dropdown.css(t)}}},{key:"remove",value:function(){this.$el.remove(),this.$el.off(this.options.trigger),$(window).off("resize",this.resize.bind(this)),$(document).off(this.options.trigger,this.outsideClick.bind(this)),$(document).off("keyup",this.keyup.bind(this))}},{key:"toggle",value:function(t){this.$el.hasClass("active")?this.hide():this.show()}},{key:"show",value:function(){this.options.hide_sm&&$(window).width()<720||(this.dropdown?this.resize():this.render(),this.dropdown.show(),this.$el.addClass("active"),this.overlay=$("<div class='uniformOverlay'>"),$("body").append(this.overlay),$(window).width()<720&&(this.lastScrollPosition=$(window).scrollTop(),$("body").addClass("uniformModal-hideBody")),this.overlay.click(this.hide.bind(this)),this.trigger("shown"))}},{key:"hide",value:function(){this.dropdown&&(this.dropdown.hide(),this.$el.removeClass("active"),this.overlay&&this.overlay.remove(),$(window).width()<720&&($("body").removeClass("uniformModal-hideBody"),$(window).scrollTop(this.lastScrollPosition)),this.trigger("hidden"))}},{key:"outsideClick",value:function(t){this.dropdown&&this.dropdown.is(":visible")&&t.target!==this.el&&t.target!==this.overlay&&($.contains(this.el,t.target)||$.contains(this.dropdown[0],t.target)||this.hide())}},{key:"keyup",value:function(t){27==t.which&&this.hide()}}]),e}(),Ge=function(t){function i(){return ht(this,i),Ee(this,(i.__proto__||at(i)).apply(this,arguments))}return Ne(i,Re),dt(i,[{key:"initialize",value:function(t){this.$el.on("change",this.change.bind(this))}},{key:"render",value:function(){var t=this.$el.hasClass("uniformRadio")?"uniformRadio":"uniformCheckbox";return this.checkbox=$('<div class="'.concat(t,'-indicator">')),this.checkbox.addClass(this.$el.attr("class").replace(t,"")),this.checkbox.toggleClass("checked",this.$el.prop("checked")),this.$el.after(this.checkbox),this.checkbox.click(this.click.bind(this)),this}},{key:"click",value:function(){this.$el.prop("disabled")||(this.$el.prop("checked",!this.$el.prop("checked")),this.$el.trigger("change"),e.preventDefault())}},{key:"change",value:function(){this.checkbox.toggleClass("checked",this.$el.prop("checked"))}}]),i}(),qe=function(t){function e(){return ht(this,e),Ee(this,(e.__proto__||at(e)).apply(this,arguments))}return Ne(e,Re),dt(e,[{key:"initialize",value:function(t){this.options={klass:!1},$.extend(this.options,this.pick(t,["klass"])),this.content=t.content,this.$el.addClass("uniformModal"),$(document).on("keyup",this.keyup.bind(this)),this.$el.on("click",".uniformModal-close",this.close.bind(this))}},{key:"keyup",value:function(t){27==t.which&&this.close()}},{key:"render",value:function(){var t="function"==typeof this.content?this.content():this.content;t instanceof jQuery||(t=$("<div>").html(t)),this.highest_z_index=0,this.overlay=$('<div class="uniformModal-overlay"></div>'),this.blur=$('<div class="uniformModal-blur"></div>'),this.original_scroll=window.scrollY,this.blur.css("top",0-this.original_scroll+"px"),0<$(".uniformModal").length&&(this.highest_z_index=Math.max($(".uniformModal").map(function(){return parseInt($(this).css("zIndex"))})),this.$el.css("zIndex",this.highest_z_index+2)),this.$el.append(this.overlay),this.blur.append($("body").children()),$("body").addClass("uniformModal-active"),$("body").append(this.blur),$("body").append(this.$el);var e=$('<div class="uniformModal-container">');return e.append(t),e.append('<div class="uniformModal-close"></div>'),this.$el.css("top",$(window).scrollTop()),this.overlay.click(this.close.bind(this)),this.$el.append(e),this.options.klass&&e.addClass(this.options.klass),t instanceof $&&t.trigger("rendered"),this.trigger("rendered"),this}},{key:"close",value:function(){$(".uniformModal-active").removeClass("uniformModal-active"),$("body").append(this.blur.children()),this.blur.remove(),$(window).scrollTop(this.original_scroll),this.trigger("closed"),this.remove()}},{key:"remove",value:function(){this.overlay.remove(),this.$el.remove(),this.$el.off("click"),this.overlay.off("click"),$(document).off("keyup",this.keyup.bind(this))}}]),e}(),Ve='\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 32 32">\n<path d="M28.998 8.531l-2.134-2.134c-0.394-0.393-1.030-0.393-1.423 0l-12.795 12.795-6.086-6.13c-0.393-0.393-1.029-0.393-1.423 0l-2.134 2.134c-0.393 0.394-0.393 1.030 0 1.423l8.924 8.984c0.393 0.393 1.030 0.393 1.423 0l15.648-15.649c0.393-0.392 0.393-1.030 0-1.423z"></path>\n</svg>\n'.trim(),Ke='\n<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" viewBox="0 0 20 20">\n<path d="M2.582 5.601c-0.271-0.268-0.709-0.268-0.979 0-0.27 0.267-0.27 0.701 0 0.969l7.908 7.83c0.271 0.268 0.708 0.268 0.979 0l7.908-7.83c0.27-0.268 0.271-0.701 0-0.969s-0.71-0.268-0.979-0.001l-7.419 7.141-7.418-7.14z"></path>\n</svg>\n'.trim(),Je=function(t){function e(){return ht(this,e),Ee(this,(e.__proto__||at(e)).apply(this,arguments))}return Ne(e,Re),dt(e,[{key:"initialize",value:function(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{};this.options={class:"",showAll:function(t){return t.find(".uniformSelect-show-all").remove(),t.find("button.hide").removeClass("hide"),!1},limit:8},nt(this.options,this.pick(t,X(this.options))),this.$el.on("change",this.updateSelect.bind(this)),this.$el.on("close",this.hideOptions.bind(this)),this.$el.on("revealed",this.resize.bind(this)),this.el.uniformSelect=this.container,$(window).on("resize",this.resize.bind(this)),$(window).on("scroll",this.updatePosition.bind(this)),$(document).on("click",this.outsideClick.bind(this)),$(document).on("keyup",this.keyup.bind(this)),this.activeIcon=$("<span class='uniformSelect-option-icon'>".concat(Ve,"</span>"))}},{key:"outsideClick",value:function(t){this.showing&&t.target!==this.select_options[0]&&($.contains(this.container[0],t.target)||$.contains(this.select_options[0],t.target)||this.hideOptions())}},{key:"keyup",value:function(t){27===t.which&&this.hideOptions()}},{key:"render",value:function(){this.container=$("<div class='uniformSelect-container'></div>"),this.edit_button=$("<button type='button' class='uniformSelect-edit uniformInput outline block ".concat(this.options.class,"'></button>")),this.edit_button.append('<span class="uniformSelect-edit-icon">'.concat(Ke,"</span>")),this.container.append(this.edit_button),this.$el.attr("name")&&this.container.addClass(this.$el.attr("name").toLowerCase().replace(/[^a-z0-9\-_]+/g,"-")),this.$el.hide(),this.$el.before(this.container),this.updateSelect(),this.resize(),this.edit_button.on("click",this.showOptions.bind(this))}},{key:"resize",value:function(){var t=this.edit_button.text();this.edit_button.text(""),this.edit_button.css({width:"auto"}),this.edit_button.css({width:this.container.outerWidth()}),this.edit_button.text(t),void 0!==this.select_options&&this.select_options.css({position:"absolute",top:this.container.offset().top+this.container.outerHeight(),left:this.container.offset().left+1,minWidth:this.container.outerWidth()-1})}},{key:"renderOptions",value:function(){this.select_options=$("<div class='uniformSelect-options'>"),this.$el.attr("name")&&this.select_options.addClass(this.$el.attr("name").toLowerCase().replace(/[^a-z0-9\-_]+/g,"-")),this.select_options.css({fontSize:this.$el.css("font-size")}),this.select_options.hide(),this.select_options.appendTo("body"),this.$el.find("option").each(function(t,e){var i=$("<button type='button' class='uniformSelect-option block outline text-left'>");i[0].option=$(e),i.text($(e).text()),i.attr("value",$(e).val()),""==i.text()&&i.html("<span class='text-italic text-muted'>None</span>"),$(e).prop("selected")?(i.addClass("active"),i.append(this.activeIcon.clone())):this.options.limit&&t>this.options.limit&&i.addClass("hide"),this.select_options.append(i),i.click(this.selectOption.bind(this))}.bind(this));var t=$('<div class="uniformSelect-options-actions">');if(this.options.limit&&this.$el.find("option").length>this.options.limit){var e=$("<button type='button' class='uniformSelect-show-all block outline blue' style='border: none'>Show All</button>");e.click(function(t){return this.options.showAll(this.select_options),!1}.bind(this)),t.append(e)}if(this.$el.prop("multiple")){var i=$("<button type='button' class='uniformSelect-done block outline blue'>Done</button>");i.click(this.hideOptions.bind(this)),t.append(i)}t.is(":empty")||this.select_options.append(t),this.$el.trigger("rendered",this.select_options)}},{key:"hideOptions",value:function(){void 0!==this.select_options&&(this.showing=!1,this.select_options.hide(),this.select_options.removeClass("fixed"),this.edit_button.removeClass("active"),$("body").removeClass("uniformModal-hideBody"),this.lastScrollPosition&&$(window).scrollTop(this.lastScrollPosition),this.$el.trigger("hidden:options"))}},{key:"showOptions",value:function(){if(this.showing)return this.hideOptions(),!1;this.showing=!0,this.select_options||this.renderOptions(),this.resize(),this.select_options.show(),this.edit_button.addClass("active"),this.lastScrollPosition=$(window).scrollTop(),this.updatePosition(),$("body").addClass("uniformModal-hideBody")}},{key:"selectOption",value:function(t){this.$el.prop("multiple")||(this.$el.find("option:selected").prop("selected",!1),this.select_options.find(".uniformSelect-option.active .uniformSelect-option-icon").remove(),this.select_options.find(".uniformSelect-option.active").removeClass("active")),$(t.currentTarget).toggleClass("active"),t.currentTarget.option.prop("selected",$(t.currentTarget).hasClass("active")),$(t.currentTarget).hasClass("active")?$(t.currentTarget).append(this.activeIcon.clone()):$(t.currentTarget).find(".uniformSelect-option-icon").remove(),this.$el.trigger("change")}},{key:"updateSelect",value:function(){this.$el.prop("multiple")||this.hideOptions();var t=$.map(this.$el.find("option:selected"),function(t){return $(t).text()}).join(", ");""==t&&(t="&nbsp;"),this.edit_button.html(t)}},{key:"updatePosition",value:function(){if(this.select_options){var t=this.container.parents().filter(function(){return"fixed"==$(this).css("position")});this.select_options.hasClass("fixed")?0==t.length&&(this.select_options.css({position:"absolute",top:this.container.offset().top+this.container.outerHeight()}),this.select_options.removeClass("fixed")):0<t.length&&(this.lastScrollPosition=!1,this.select_options.css({position:"fixed"}),this.select_options.offset({top:this.container.offset().top+this.container.outerHeight(),left:this.container.offset().left}),this.select_options.addClass("fixed"))}}}]),e}(),Ye=function(t){function e(){return ht(this,e),Ee(this,(e.__proto__||at(e)).apply(this,arguments))}return Ne(e,Re),dt(e,[{key:"initialize",value:function(){this.label=this.$el.find("label"),this.input=$("#"+this.label.prop("for")),this.startingHeight,this.input.focus(this.activate.bind(this)),this.input.blur(this.deactivate.bind(this)),this.input.on("revealed",this.render.bind(this)),void 0!==this.input.val()&&""!=this.input.val()&&this.activate(),this.input.is(":focus")&&this.activate()}},{key:"render",value:function(){if(this.input.is(":visible")&&!this.$el.hasClass("enabled")){var t=parseInt(this.input.css("paddingBottom"));this.startingHeight=this.input.outerHeight(),this.$el.addClass("enabled"),this.$el.addClass("inactive"),this.input.css({paddingTop:t+t/2+"px",paddingBottom:t-t/2-2+"px"}),this.label.css({position:"absolute",top:0,left:this.label.position().left,paddingLeft:this.input.css("paddingLeft"),height:this.startingHeight,lineHeight:this.startingHeight+"px"})}}},{key:"activate",value:function(t){void 0!==t&&this.$el.addClass("active"),this.$el.hasClass("float")||(this.$el.addClass("float"),this.$el.removeClass("inactive"),this.label.css({lineHeight:this.startingHeight/2+"px"}))}},{key:"deactivate",value:function(t){void 0!==t&&this.$el.removeClass("active"),""==this.input.val()&&(this.$el.removeClass("float"),this.$el.addClass("inactive"),this.label.css({lineHeight:this.startingHeight+"px"}))}}]),e}(),Qe=function(t){function e(){return ht(this,e),Ee(this,(e.__proto__||at(e)).apply(this,arguments))}return Ne(e,Re),dt(e,[{key:"initialize",value:function(){$(window).resize(this.resize.bind(this)),$(window).trigger("resize")}},{key:"resize",value:function(){var t=this.$el.width();720<t&&!this.$el.hasClass("md-size")?this.$el.addClass("md-size"):t<720&&this.$el.hasClass("md-size")&&this.$el.removeClass("md-size"),1080<t&&!this.$el.hasClass("lg-size")?this.$el.addClass("lg-size"):t<1080&&this.$el.hasClass("lg-size")&&this.$el.removeClass("lg-size"),1440<t&&!this.$el.hasClass("xl-size")?this.$el.addClass("xl-size"):t<1440&&this.$el.hasClass("xl-size")&&this.$el.removeClass("xl-size"),console.log(t),t<720&&!this.$el.hasClass("sm-size")?this.$el.addClass("sm-size"):720<t&&this.$el.hasClass("sm-size")&&this.$el.removeClass("sm-size")}}]),e}(),Ue=function(t){function e(){return ht(this,e),Ee(this,(e.__proto__||at(e)).apply(this,arguments))}return Ne(e,Re),dt(e,[{key:"initialize",value:function(t){this.enabled=!0,this.message=t.message,(t.el.tooltip=this).$el.on("mouseenter",this.show.bind(this)),this.$el.on("mouseleave",this.hide.bind(this))}},{key:"render",value:function(){return this.popup=$('<div class="uniformTooltip-popup">'+this.message+"</div>"),this.popup.prepend("<div class='uniformTooltip-pointer'></div>"),this.$el.append(this.popup),100<this.message.length?this.popup.css({minWidth:"200px"}):this.popup.css({whiteSpace:"nowrap"}),this.popup.outerWidth(!0)+this.popup.offset().left>$(window).width()&&this.popup.css({left:$(window).width()-this.popup.outerWidth(!0)-this.popup.offset().left}),this}},{key:"remove",value:function(){this.$el.remove()}},{key:"show",value:function(){if(this.popup||this.render(),this.enabled)return this.hiding?this.show_after_hide=!0:void(this.showing||this.shown||(this.popup.css("display","block"),this.showing=!0,this.hidden=!1,this.popup.animate({bottom:"100%",opacity:1},200,function(){this.showing=!1,this.shown=!0,this.hide_after_show&&this.hide(),this.hide_after_show=!1}.bind(this)),this.popup.offset().left<0&&this.popup.css({left:0}),this.trigger("shown")))}},{key:"hide",value:function(){if(this.showing)return this.show_after_hide=!0;this.hiding||this.hidden||(this.hiding=!0,this.shown=!1,this.popup.animate({bottom:0,opacity:0},200,function(){this.popup.css("display","none"),this.hiding=!1,this.hidden=!0,this.trigger("hidden"),this.show_after_hide&&this.show(),this.show_after_hide=!1}.bind(this)))}},{key:"disable",value:function(){this.enabled=!1}},{key:"enabled",value:function(){this.enabled=!0}}]),e}(),Xe=((De=$).fn.uniformDropdown=function(){return this.each(function(){var i=De(this),t={el:this};void 0!==i.data("dropdown-align")&&(t.align=i.data("dropdown-align")),void 0!==i.data("dropdown-trigger")&&(t.trigger=i.data("dropdown-trigger")),void 0!==i.data("dropdown-show_arrow")&&(t.show_arrow=i.data("dropdown-show_arrow")),void 0!==i.data("dropdown-square")&&(t.square=i.data("dropdown-square")),void 0!==i.data("dropdown-hide_sm")&&(t.hide_sm=i.data("dropdown-hide_sm")),void 0!==i.data("dropdown-content")&&(t.content="<div class='pad'>".concat(i.data("dropdown-content"),"</div>")),void 0!==i.data("dropdown-target")&&(t.content=De(i.data("dropdown-target")));var e=new Be(t);e.on("*",function(t,e){i.trigger("dropdown-"+t,e)}),e.render()})},De.fn.uniformCheckbox=function(){return this.each(function(){De(this),new Ge({el:this}).render()})},De.fn.uniformRadio=De.fn.uniformCheckbox,De.fn.uniformFloatingLabel=function(){return this.each(function(){new Ye({el:this}).render()})},De.fn.uniformModal=function(){return this.click(function(){var i=De(this),t={klass:i.data("modal-klass"),content:i.data("modal-content")};i.data("modal-target")&&(t.content=De(i.data("modal-target")).clone(),t.content.removeClass("hidden")),new qe(t).render().on("*",function(t,e){i.trigger("modal-"+t,e)})})},De.fn.uniformResizer=function(){return this.each(function(){new Qe({el:this})})},De.fn.uniformSelect=function(){return this.each(function(){new Je({el:this}).render()})},void(De.fn.uniformTooltip=function(){return this.each(function(){var i=De(this),t=new Ue({message:i.data("tooltip-message"),el:this});t.on("*",function(t,e){i.trigger("tooltip-"+t,e)}),t.render()})}));return t.Dropdown=Be,t.Checkbox=Ge,t.Modal=qe,t.Select=Je,t.FloatingLabel=Ye,t.Resizer=Qe,t.Tooltip=Ue,t.Plugins=Xe,t}({});