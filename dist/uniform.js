var Uniform = (function (exports) {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var path = {};

	var aFunction = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	var wrapConstructor = function (NativeConstructor) {
	  var Wrapper = function (a, b, c) {
	    if (this instanceof NativeConstructor) {
	      switch (arguments.length) {
	        case 0: return new NativeConstructor();
	        case 1: return new NativeConstructor(a);
	        case 2: return new NativeConstructor(a, b);
	      } return new NativeConstructor(a, b, c);
	    } return NativeConstructor.apply(this, arguments);
	  };
	  Wrapper.prototype = NativeConstructor.prototype;
	  return Wrapper;
	};

	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var PROTO = options.proto;

	  var nativeSource = GLOBAL ? global_1 : STATIC ? global_1[TARGET] : (global_1[TARGET] || {}).prototype;

	  var target = GLOBAL ? path : path[TARGET] || (path[TARGET] = {});
	  var targetPrototype = target.prototype;

	  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
	  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

	  for (key in source) {
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contains in native
	    USE_NATIVE = !FORCED && nativeSource && has(nativeSource, key);

	    targetProperty = target[key];

	    if (USE_NATIVE) if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(nativeSource, key);
	      nativeProperty = descriptor && descriptor.value;
	    } else nativeProperty = nativeSource[key];

	    // export native or implementation
	    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

	    if (USE_NATIVE && typeof targetProperty === typeof sourceProperty) continue;

	    // bind timers to global for call from export context
	    if (options.bind && USE_NATIVE) resultProperty = functionBindContext(sourceProperty, global_1);
	    // wrap global constructors for prevent changs in this version
	    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
	    // make static versions for prototype methods
	    else if (PROTO && typeof sourceProperty == 'function') resultProperty = functionBindContext(Function.call, sourceProperty);
	    // default case
	    else resultProperty = sourceProperty;

	    // add a flag to not completely full polyfills
	    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(resultProperty, 'sham', true);
	    }

	    target[key] = resultProperty;

	    if (PROTO) {
	      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
	      if (!has(path, VIRTUAL_PROTOTYPE)) {
	        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
	      }
	      // export virtual prototype methods
	      path[VIRTUAL_PROTOTYPE][key] = sourceProperty;
	      // export real prototype methods
	      if (options.real && targetPrototype && !targetPrototype[key]) {
	        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
	      }
	    }
	  }
	};

	var aFunction$1 = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction$1(path[namespace]) || aFunction$1(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var hiddenKeys = {};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.4',
	  mode: 'pure' ,
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var slice = [].slice;
	var factories = {};

	var construct = function (C, argsLength, args) {
	  if (!(argsLength in factories)) {
	    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
	    // eslint-disable-next-line no-new-func
	    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
	  } return factories[argsLength](C, args);
	};

	// `Function.prototype.bind` method implementation
	// https://tc39.github.io/ecma262/#sec-function.prototype.bind
	var functionBind = Function.bind || function bind(that /* , ...args */) {
	  var fn = aFunction(this);
	  var partArgs = slice.call(arguments, 1);
	  var boundFunction = function bound(/* args... */) {
	    var args = partArgs.concat(slice.call(arguments));
	    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
	  };
	  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
	  return boundFunction;
	};

	var nativeConstruct = getBuiltIn('Reflect', 'construct');

	// `Reflect.construct` method
	// https://tc39.github.io/ecma262/#sec-reflect.construct
	// MS Edge supports only 2 arguments and argumentsList argument is optional
	// FF Nightly sets third argument as `new.target`, but does not create `this` from it
	var NEW_TARGET_BUG = fails(function () {
	  function F() { /* empty */ }
	  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
	});
	var ARGS_BUG = !fails(function () {
	  nativeConstruct(function () { /* empty */ });
	});
	var FORCED = NEW_TARGET_BUG || ARGS_BUG;

	_export({ target: 'Reflect', stat: true, forced: FORCED, sham: FORCED }, {
	  construct: function construct(Target, args /* , newTarget */) {
	    aFunction(Target);
	    anObject(args);
	    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
	    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
	    if (Target == newTarget) {
	      // w/o altered newTarget, optimization for 0-4 arguments
	      switch (args.length) {
	        case 0: return new Target();
	        case 1: return new Target(args[0]);
	        case 2: return new Target(args[0], args[1]);
	        case 3: return new Target(args[0], args[1], args[2]);
	        case 4: return new Target(args[0], args[1], args[2], args[3]);
	      }
	      // w/o altered newTarget, lot of arguments case
	      var $args = [null];
	      $args.push.apply($args, args);
	      return new (functionBind.apply(Target, $args))();
	    }
	    // with altered newTarget, not support built-in constructors
	    var proto = newTarget.prototype;
	    var instance = objectCreate(isObject(proto) ? proto : Object.prototype);
	    var result = Function.apply.call(Target, instance, args);
	    return isObject(result) ? result : instance;
	  }
	});

	var construct$1 = path.Reflect.construct;

	var construct$2 = construct$1;

	var construct$3 = construct$2;

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	var keys$1 = path.Object.keys;

	var keys$2 = keys$1;

	var keys$3 = keys$2;

	var f$3 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$3
	};

	var nativeAssign = Object.assign;
	var defineProperty = Object.defineProperty;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	var objectAssign = !nativeAssign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
	    }
	  } return T;
	} : nativeAssign;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
	  assign: objectAssign
	});

	var assign = path.Object.assign;

	var assign$1 = assign;

	var assign$2 = assign$1;

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	_export({ target: 'Object', stat: true, forced: !descriptors, sham: !descriptors }, {
	  defineProperty: objectDefineProperty.f
	});

	var defineProperty_1 = createCommonjsModule(function (module) {
	var Object = path.Object;

	var defineProperty = module.exports = function defineProperty(it, key, desc) {
	  return Object.defineProperty(it, key, desc);
	};

	if (Object.defineProperty.sham) defineProperty.sham = true;
	});

	var defineProperty$1 = defineProperty_1;

	var defineProperty$2 = defineProperty$1;

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;

	    defineProperty$2(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	_export({ target: 'Object', stat: true, sham: !descriptors }, {
	  create: objectCreate
	});

	var Object$1 = path.Object;

	var create = function create(P, D) {
	  return Object$1.create(P, D);
	};

	var create$1 = create;

	var create$2 = create$1;

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  } return it;
	};

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	_export({ target: 'Object', stat: true }, {
	  setPrototypeOf: objectSetPrototypeOf
	});

	var setPrototypeOf = path.Object.setPrototypeOf;

	var setPrototypeOf$1 = setPrototypeOf;

	var setPrototypeOf$2 = setPrototypeOf$1;

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = setPrototypeOf$2 || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = create$2(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var f$4 = wellKnownSymbol;

	var wellKnownSymbolWrapped = {
		f: f$4
	};

	var defineProperty$3 = objectDefineProperty.f;

	var defineWellKnownSymbol = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!has(Symbol, NAME)) defineProperty$3(Symbol, NAME, {
	    value: wellKnownSymbolWrapped.f(NAME)
	  });
	};

	// `Symbol.iterator` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.iterator
	defineWellKnownSymbol('iterator');

	// `String.prototype.{ codePointAt, at }` methods implementation
	var createMethod$1 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING ? S.charAt(position) : first
	        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$1(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$1(true)
	};

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$1 = sharedKey('IE_PROTO');
	var ObjectPrototype = Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof
	var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectPrototype : null;
	};

	wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	// `%IteratorPrototype%` object
	// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	if (IteratorPrototype == undefined) IteratorPrototype = {};

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	var defineProperty$4 = objectDefineProperty.f;





	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC, SET_METHOD) {
	  if (it) {
	    var target = STATIC ? it : it.prototype;
	    if (!has(target, TO_STRING_TAG$2)) {
	      defineProperty$4(target, TO_STRING_TAG$2, { configurable: true, value: TAG });
	    }
	    if (SET_METHOD && !toStringTagSupport) {
	      createNonEnumerableProperty(target, 'toString', objectToString);
	    }
	  }
	};

	var iterators = {};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





	var returnThis = function () { return this; };

	var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
	  iterators[TO_STRING_TAG] = returnThis;
	  return IteratorConstructor;
	};

	var redefine = function (target, key, value, options) {
	  if (options && options.enumerable) target[key] = value;
	  else createNonEnumerableProperty(target, key, value);
	};

	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis$1 = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
	      iterators[TO_STRING_TAG] = returnThis$1;
	    }
	  }

	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    INCORRECT_VALUES_NAME = true;
	    defaultIterator = function values() { return nativeIterator.call(this); };
	  }

	  // define iterator
	  if ((FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
	    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
	  }
	  iterators[NAME] = defaultIterator;

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
	  }

	  return methods;
	};

	var charAt = stringMultibyte.charAt;



	var STRING_ITERATOR = 'String Iterator';
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState(this, {
	    type: STRING_ITERATOR,
	    string: String(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = charAt(string, index);
	  state.index += point.length;
	  return { value: point, done: false };
	});

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$1 = internalState.set;
	var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.github.io/ecma262/#sec-createarrayiterator
	defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState$1(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$1(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return { value: undefined, done: true };
	  }
	  if (kind == 'keys') return { value: index, done: false };
	  if (kind == 'values') return { value: target[index], done: false };
	  return { value: [index, target[index]], done: false };
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
	iterators.Arguments = iterators.Array;

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  if (CollectionPrototype && classof(CollectionPrototype) !== TO_STRING_TAG$3) {
	    createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG$3, COLLECTION_NAME);
	  }
	  iterators[COLLECTION_NAME] = iterators.Array;
	}

	var iterator = wellKnownSymbolWrapped.f('iterator');

	var iterator$1 = iterator;

	var iterator$2 = iterator$1;

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	_export({ target: 'Array', proto: true, forced: FORCED$1 }, {
	  concat: function concat(arg) { // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$5
	};

	var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

	var toString$1 = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return nativeGetOwnPropertyNames(it);
	  } catch (error) {
	    return windowNames.slice();
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var f$6 = function getOwnPropertyNames(it) {
	  return windowNames && toString$1.call(it) == '[object Window]'
	    ? getWindowNames(it)
	    : nativeGetOwnPropertyNames(toIndexedObject(it));
	};

	var objectGetOwnPropertyNamesExternal = {
		f: f$6
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	var createMethod$2 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push.call(target, value); // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$2(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$2(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$2(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$2(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$2(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$2(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$2(6)
	};

	var $forEach = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE$1 = 'prototype';
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
	var setInternalState$2 = internalState.set;
	var getInternalState$2 = internalState.getterFor(SYMBOL);
	var ObjectPrototype$1 = Object[PROTOTYPE$1];
	var $Symbol = global_1.Symbol;
	var $stringify = getBuiltIn('JSON', 'stringify');
	var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var nativeDefineProperty$1 = objectDefineProperty.f;
	var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
	var AllSymbols = shared('symbols');
	var ObjectPrototypeSymbols = shared('op-symbols');
	var StringToSymbolRegistry = shared('string-to-symbol-registry');
	var SymbolToStringRegistry = shared('symbol-to-string-registry');
	var WellKnownSymbolsStore$1 = shared('wks');
	var QObject = global_1.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = descriptors && fails(function () {
	  return objectCreate(nativeDefineProperty$1({}, 'a', {
	    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype$1, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[P];
	  nativeDefineProperty$1(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$1) {
	    nativeDefineProperty$1(ObjectPrototype$1, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty$1;

	var wrap = function (tag, description) {
	  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
	  setInternalState$2(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!descriptors) symbol.description = description;
	  return symbol;
	};

	var isSymbol = useSymbolAsUid ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return Object(it) instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype$1) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject(O);
	  var key = toPrimitive(P, true);
	  anObject(Attributes);
	  if (has(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty$1(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject(O);
	  var properties = toIndexedObject(Properties);
	  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
	  $forEach(keys, function (key) {
	    if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
	};

	var $propertyIsEnumerable = function propertyIsEnumerable(V) {
	  var P = toPrimitive(V, true);
	  var enumerable = nativePropertyIsEnumerable$1.call(this, P);
	  if (this === ObjectPrototype$1 && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject(O);
	  var key = toPrimitive(P, true);
	  if (it === ObjectPrototype$1 && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
	  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
	  var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype$1, key))) {
	      result.push(AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.github.io/ecma262/#sec-symbol-constructor
	if (!nativeSymbol) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
	    var tag = uid(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype$1) setter.call(ObjectPrototypeSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
	    };
	    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$1, tag, { configurable: true, set: setter });
	    return wrap(tag, description);
	  };

	  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
	    return getInternalState$2(this).tag;
	  });

	  redefine($Symbol, 'withoutSetter', function (description) {
	    return wrap(uid(description), description);
	  });

	  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
	  objectDefineProperty.f = $defineProperty;
	  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
	  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

	  wellKnownSymbolWrapped.f = function (name) {
	    return wrap(wellKnownSymbol(name), name);
	  };

	  if (descriptors) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState$2(this).description;
	      }
	    });
	  }
	}

	_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
	  Symbol: $Symbol
	});

	$forEach(objectKeys(WellKnownSymbolsStore$1), function (name) {
	  defineWellKnownSymbol(name);
	});

	_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
	  // `Symbol.for` method
	  // https://tc39.github.io/ecma262/#sec-symbol.for
	  'for': function (key) {
	    var string = String(key);
	    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = $Symbol(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry[symbol] = string;
	    return symbol;
	  },
	  // `Symbol.keyFor` method
	  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
	    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
	  },
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
	  // `Object.create` method
	  // https://tc39.github.io/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.github.io/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});

	_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // `Object.getOwnPropertySymbols` method
	  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return objectGetOwnPropertySymbols.f(toObject(it));
	  }
	});

	// `JSON.stringify` method behavior with symbols
	// https://tc39.github.io/ecma262/#sec-json.stringify
	if ($stringify) {
	  var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
	    var symbol = $Symbol();
	    // MS Edge converts symbol values to JSON as {}
	    return $stringify([symbol]) != '[null]'
	      // WebKit converts symbol values to JSON as null
	      || $stringify({ a: symbol }) != '{}'
	      // V8 throws on boxed symbols
	      || $stringify(Object(symbol)) != '{}';
	  });

	  _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
	    // eslint-disable-next-line no-unused-vars
	    stringify: function stringify(it, replacer, space) {
	      var args = [it];
	      var index = 1;
	      var $replacer;
	      while (arguments.length > index) args.push(arguments[index++]);
	      $replacer = replacer;
	      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	      if (!isArray(replacer)) replacer = function (key, value) {
	        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	        if (!isSymbol(value)) return value;
	      };
	      args[1] = replacer;
	      return $stringify.apply(null, args);
	    }
	  });
	}

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
	if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
	  createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
	}
	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag($Symbol, SYMBOL);

	hiddenKeys[HIDDEN] = true;

	// `Symbol.asyncIterator` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.asynciterator
	defineWellKnownSymbol('asyncIterator');

	// `Symbol.hasInstance` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.hasinstance
	defineWellKnownSymbol('hasInstance');

	// `Symbol.isConcatSpreadable` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable
	defineWellKnownSymbol('isConcatSpreadable');

	// `Symbol.match` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.match
	defineWellKnownSymbol('match');

	// `Symbol.matchAll` well-known symbol
	defineWellKnownSymbol('matchAll');

	// `Symbol.replace` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.replace
	defineWellKnownSymbol('replace');

	// `Symbol.search` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.search
	defineWellKnownSymbol('search');

	// `Symbol.species` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.species
	defineWellKnownSymbol('species');

	// `Symbol.split` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.split
	defineWellKnownSymbol('split');

	// `Symbol.toPrimitive` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.toprimitive
	defineWellKnownSymbol('toPrimitive');

	// `Symbol.toStringTag` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.tostringtag
	defineWellKnownSymbol('toStringTag');

	// `Symbol.unscopables` well-known symbol
	// https://tc39.github.io/ecma262/#sec-symbol.unscopables
	defineWellKnownSymbol('unscopables');

	// Math[@@toStringTag] property
	// https://tc39.github.io/ecma262/#sec-math-@@tostringtag
	setToStringTag(Math, 'Math', true);

	// JSON[@@toStringTag] property
	// https://tc39.github.io/ecma262/#sec-json-@@tostringtag
	setToStringTag(global_1.JSON, 'JSON', true);

	var symbol = path.Symbol;

	// `Symbol.asyncDispose` well-known symbol
	// https://github.com/tc39/proposal-using-statement
	defineWellKnownSymbol('asyncDispose');

	// `Symbol.dispose` well-known symbol
	// https://github.com/tc39/proposal-using-statement
	defineWellKnownSymbol('dispose');

	// `Symbol.observable` well-known symbol
	// https://github.com/tc39/proposal-observable
	defineWellKnownSymbol('observable');

	// `Symbol.patternMatch` well-known symbol
	// https://github.com/tc39/proposal-pattern-matching
	defineWellKnownSymbol('patternMatch');

	// TODO: remove from `core-js@4`


	defineWellKnownSymbol('replaceAll');

	// TODO: Remove from `core-js@4`


	var symbol$1 = symbol;

	var symbol$2 = symbol$1;

	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  if (typeof symbol$2 === "function" && typeof iterator$2 === "symbol") {
	    _typeof = function _typeof(obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function _typeof(obj) {
	      return obj && typeof symbol$2 === "function" && obj.constructor === symbol$2 && obj !== symbol$2.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	function _possibleConstructorReturn(self, call) {
	  if (call && (_typeof(call) === "object" || typeof call === "function")) {
	    return call;
	  }

	  return _assertThisInitialized(self);
	}

	var FAILS_ON_PRIMITIVES$1 = fails(function () { objectGetPrototypeOf(1); });

	// `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1, sham: !correctPrototypeGetter }, {
	  getPrototypeOf: function getPrototypeOf(it) {
	    return objectGetPrototypeOf(toObject(it));
	  }
	});

	var getPrototypeOf = path.Object.getPrototypeOf;

	var getPrototypeOf$1 = getPrototypeOf;

	var getPrototypeOf$2 = getPrototypeOf$1;

	function _getPrototypeOf(o) {
	  _getPrototypeOf = setPrototypeOf$2 ? getPrototypeOf$2 : function _getPrototypeOf(o) {
	    return o.__proto__ || getPrototypeOf$2(o);
	  };
	  return _getPrototypeOf(o);
	}

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var defineProperty$5 = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty$5(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	var $forEach$1 = arrayIteration.forEach;



	var STRICT_METHOD = arrayMethodIsStrict('forEach');
	var USES_TO_LENGTH = arrayMethodUsesToLength('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach = (!STRICT_METHOD || !USES_TO_LENGTH) ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	var entryVirtual = function (CONSTRUCTOR) {
	  return path[CONSTRUCTOR + 'Prototype'];
	};

	var forEach = entryVirtual('Array').forEach;

	var forEach$1 = forEach;

	var ArrayPrototype = Array.prototype;

	var DOMIterables = {
	  DOMTokenList: true,
	  NodeList: true
	};

	var forEach_1 = function (it) {
	  var own = it.forEach;
	  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.forEach)
	    // eslint-disable-next-line no-prototype-builtins
	    || DOMIterables.hasOwnProperty(classof(it)) ? forEach$1 : own;
	};

	var forEach$2 = forEach_1;

	var $filter = arrayIteration.filter;



	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
	// Edge 14- issue
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('filter');

	// `Array.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$1 }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var filter = entryVirtual('Array').filter;

	var ArrayPrototype$1 = Array.prototype;

	var filter_1 = function (it) {
	  var own = it.filter;
	  return it === ArrayPrototype$1 || (it instanceof Array && own === ArrayPrototype$1.filter) ? filter : own;
	};

	var filter$1 = filter_1;

	var filter$2 = filter$1;

	// `Function.prototype.bind` method
	// https://tc39.github.io/ecma262/#sec-function.prototype.bind
	_export({ target: 'Function', proto: true }, {
	  bind: functionBind
	});

	var bind = entryVirtual('Function').bind;

	var FunctionPrototype = Function.prototype;

	var bind_1 = function (it) {
	  var own = it.bind;
	  return it === FunctionPrototype || (it instanceof Function && own === FunctionPrototype.bind) ? bind : own;
	};

	var bind$1 = bind_1;

	var bind$2 = bind$1;

	const HTML_ATTRIBUTES = ['accept', 'accept-charset', 'accesskey', 'action', 'align', 'allow', 'alt', 'async', 'autocapitalize', 'autocomplete', 'autofocus', 'autoplay', 'background', 'bgcolor', 'border', 'buffered', 'capture', 'challenge', 'charset', 'checked', 'cite', 'class', 'code', 'codebase', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'contextmenu', 'controls', 'coords', 'crossorigin', 'csp', 'data', 'data-*', 'datetime', 'decoding', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'dropzone', 'enctype', 'enterkeyhint', 'for', 'form', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'icon', 'id', 'importance', 'integrity', 'intrinsicsize', 'inputmode', 'ismap', 'itemprop', 'keytype', 'kind', 'label', 'lang', 'language', 'loading', 'list', 'loop', 'low', 'manifest', 'max', 'maxlength', 'minlength', 'media', 'method', 'min', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'ping', 'placeholder', 'poster', 'preload', 'radiogroup', 'readonly', 'referrerpolicy', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'scoped', 'selected', 'shape', 'size', 'sizes', 'slot', 'span', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'summary', 'tabindex', 'target', 'title', 'translate', 'type', 'usemap', 'value', 'width', 'wrap', 'aria', 'aria-*'];
	const BOOLEAN_ATTRIBUTES = ['disabled', 'readonly', 'multiple', 'checked', 'autobuffer', 'autoplay', 'controls', 'loop', 'selected', 'hidden', 'scoped', 'async', 'defer', 'reversed', 'ismap', 'seemless', 'muted', 'required', 'autofocus', 'novalidate', 'formnovalidate', 'open', 'pubdate', 'itemscope'];

	function createElement(tagName = 'div', options = {}) {
	  if (typeof tagName == 'object') {
	    options = tagName;
	    tagName = options.tag || 'div';
	  }

	  const el = document.createElement(tagName);
	  Object.keys(options).forEach(key => {
	    if (HTML_ATTRIBUTES.filter(attribute => key.match(new RegExp(attribute))).length == 0 && key != "children") {
	      return;
	    }

	    const value = options[key];

	    if (BOOLEAN_ATTRIBUTES.includes(key)) {
	      if (value !== false) {
	        return el[key] = true;
	      }
	    }

	    switch (key) {
	      case 'tag':
	        return;

	      case 'value':
	        return el.value = value;

	      case 'data':
	        if (typeof value == 'object') {
	          return Object.keys(value).forEach(key => {
	            el.dataset[key] = typeof value[key] == "object" ? JSON.stringify(value[key]) : value[key];
	          });
	        }

	        break;

	      case 'style':
	        if (typeof value == 'object') {
	          return Object.keys(value).forEach(key => {
	            el.style[key] = value[key];
	          });
	        }

	        break;

	      case 'children':
	        append(el, value);
	        return;
	    }

	    el.setAttribute(key, value);
	  });
	  return el;
	}

	function append(el, item, escape, context) {
	  if (Array.isArray(item) || item instanceof NodeList || item instanceof HTMLCollection) {
	    Array.from(item).forEach(i => append(el, i, escape, context));
	  } else if (escape instanceof Element) {
	    const items = Array.from(arguments).slice(1).filter(x => x instanceof Element);
	    items.forEach(i => append(el, i));
	  } else {
	    if (typeof escape != "boolean") {
	      context = escape;
	      escape = undefined;
	    }

	    if (item instanceof Promise) {
	      const holder = document.createElement('span');
	      el.append(holder);
	      return item.then(resolvedItem => {
	        append(holder, resolvedItem, escape, context);
	        Array.from(holder.childNodes).forEach(child => {
	          if (child instanceof Element) {
	            holder.insertAdjacentElement('beforebegin', child);
	          } else {
	            holder.insertAdjacentText('beforebegin', child.textContent);
	          }
	        });
	        holder.parentNode.removeChild(holder);
	      });
	    } else if (item instanceof Element || item instanceof Node) {
	      return el.append(item);
	    } else if (item === null || item === undefined) ; else if (typeof item == "function") {
	      return append(el, item.bind(context)(el), escape, context);
	    } else if (typeof item == "object") {
	      return el.append(createElement(item));
	    } else if (typeof item == "string") {
	      if (escape) {
	        return el.append(item);
	      } else {
	        const container = document.createElement('div');
	        container.innerHTML = item;
	        return el.append(...container.childNodes);
	      }
	    } else {
	      throw 'item to append is unsupported';
	    }
	  }
	}

	function css(el, rule) {
	  return getComputedStyle(el)[rule];
	}

	function filter$3(nodes, predicate) {
	  const filteredNodes = [];
	  nodes.forEach(node => {
	    if (predicate(node)) filteredNodes.push(node);
	  });
	  return filteredNodes;
	}

	function isEmpty(element) {
	  return element.innerHTML === "";
	}

	function isVisible(el) {
	  return el.offsetParent !== null;
	}

	function offset(el) {
	  var rect = el.getBoundingClientRect();
	  return {
	    top: rect.top + window.scrollY,
	    left: rect.left + window.scrollX
	  };
	}

	function outerHeight(el) {
	  var style = getComputedStyle(el);
	  return el.offsetHeight + parseInt(style.marginTop) + parseInt(style.marginBottom);
	}

	function outerWidth(el) {
	  var style = getComputedStyle(el);
	  return el.offsetWidth + parseInt(style.marginLeft) + parseInt(style.marginRight);
	}

	function trigger(el, eventName) {
	  var event = document.createEvent('HTMLEvents');
	  event.initEvent(eventName, true, false);
	  el.dispatchEvent(event);
	}

	function uniqueId(prefix) {
	  window.idCounter || (window.idCounter = 0);
	  var id = ++window.idCounter + '';
	  return prefix ? prefix + id : id;
	}

	var Component = /*#__PURE__*/function () {
	  function Component(options) {
	    var _context;

	    _classCallCheck(this, Component);

	    options = options || {};
	    this.eventListens = new Array();
	    this.eventListeners = new Array();
	    this.el = options.el || createElement('div', options); //TODO filter options to HTML_ATTRIBUTES

	    this.cid = uniqueId('c');

	    this.on = function (type, handler) {
	      this.eventListeners.push({
	        type: type,
	        handler: handler
	      });
	    };

	    this.off = bind$2(_context = function _context(type, handler) {
	      var _context2;

	      if (!this.eventListeners) return;
	      this.eventListeners = filter$2(_context2 = this.eventListeners).call(_context2, function (listener) {
	        return !(listener.type == type && listener.handler);
	      });
	    }).call(_context, this);

	    this.trigger = function (event_key) {
	      var _context3;

	      if (!this.eventListeners) return;

	      forEach$2(_context3 = this.eventListeners).call(_context3, function (listener) {
	        if (listener.type == "*" || listener.type == "all" || event_key == listener.type) {
	          listener.handler(event_key, this);
	        }
	      });
	    };

	    this.initialize(options);
	  }

	  _createClass(Component, [{
	    key: "addEventListener",
	    value: function addEventListener() {
	      this.on.apply(this, arguments);
	    }
	  }, {
	    key: "removeEventListener",
	    value: function removeEventListener() {
	      this.off.apply(this, arguments);
	    }
	  }, {
	    key: "pick",
	    value: function pick(object, keys) {
	      var newObject = {};

	      forEach$2(keys).call(keys, function (key) {
	        if (object[key] !== undefined) newObject[key] = object[key];
	      });

	      return newObject;
	    }
	    /*
	        listenTo(el, 'click', '.inner_class', f(), this)
	        listenTo(el, 'click', f(), this)
	    */

	  }, {
	    key: "listenTo",
	    value: function listenTo(node, event, scope, callback, context) {
	      var _context4;

	      // scope is optional param
	      if (typeof scope != "string") {
	        context = callback;
	        callback = scope;
	        scope = false;
	      }

	      context || (context = this);
	      var listen = [node, event, bind$2(_context4 = function _context4(e) {
	        if (!scope || e.target.matches(scope) || e.target.closest(scope)) {
	          return bind$2(callback).call(callback, context).apply(void 0, arguments);
	        }
	      }).call(_context4, context)];
	      this.eventListens.push(listen);
	      node.addEventListener(event, listen[2]);
	    }
	  }, {
	    key: "listenToOnce",
	    value: function listenToOnce(node, event, callback, context) {
	      context || (context = this);

	      var onceCallback = function onceCallback(e) {
	        node.removeEventListener(event, onceCallback);
	        return callback.apply(context, arguments);
	      };

	      var listen = [node, event, onceCallback];
	      this.eventListens.push(listen);
	      node.addEventListener(event, onceCallback);
	    }
	  }, {
	    key: "remove",
	    value: function remove() {
	      var _context5;

	      this.trigger('removed');
	      if (this.eventListens) forEach$2(_context5 = this.eventListens).call(_context5, function (listen) {
	        listen[0].removeEventListener(listen[1], listen[2]);
	      });
	      delete this.eventListens;
	      delete this.eventListeners;
	      if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
	      delete this.el;
	    }
	  }, {
	    key: "initialize",
	    value: function initialize() {}
	  }]);

	  return Component;
	}();

	var $includes = arrayIncludes.includes;



	var USES_TO_LENGTH$2 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.includes
	_export({ target: 'Array', proto: true, forced: !USES_TO_LENGTH$2 }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var includes = entryVirtual('Array').includes;

	var MATCH = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw TypeError("The method doesn't accept regular expressions");
	  } return it;
	};

	var MATCH$1 = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (e) {
	    try {
	      regexp[MATCH$1] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (f) { /* empty */ }
	  } return false;
	};

	// `String.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.includes
	_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~String(requireObjectCoercible(this))
	      .indexOf(notARegexp(searchString), arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var includes$1 = entryVirtual('String').includes;

	var ArrayPrototype$2 = Array.prototype;
	var StringPrototype = String.prototype;

	var includes$2 = function (it) {
	  var own = it.includes;
	  if (it === ArrayPrototype$2 || (it instanceof Array && own === ArrayPrototype$2.includes)) return includes;
	  if (typeof it === 'string' || it === StringPrototype || (it instanceof String && own === StringPrototype.includes)) {
	    return includes$1;
	  } return own;
	};

	var includes$3 = includes$2;

	var includes$4 = includes$3;

	// a string of all valid unicode whitespaces
	// eslint-disable-next-line max-len
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$3 = function (TYPE) {
	  return function ($this) {
	    var string = String(requireObjectCoercible($this));
	    if (TYPE & 1) string = string.replace(ltrim, '');
	    if (TYPE & 2) string = string.replace(rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$3(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
	  end: createMethod$3(2),
	  // `String.prototype.trim` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
	  trim: createMethod$3(3)
	};

	var trim = stringTrim.trim;


	var $parseInt = global_1.parseInt;
	var hex = /^[+-]?0[Xx]/;
	var FORCED$2 = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22;

	// `parseInt` method
	// https://tc39.github.io/ecma262/#sec-parseint-string-radix
	var numberParseInt = FORCED$2 ? function parseInt(string, radix) {
	  var S = trim(String(string));
	  return $parseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
	} : $parseInt;

	// `parseInt` method
	// https://tc39.github.io/ecma262/#sec-parseint-string-radix
	_export({ global: true, forced: parseInt != numberParseInt }, {
	  parseInt: numberParseInt
	});

	var _parseInt = path.parseInt;

	var _parseInt$1 = _parseInt;

	var _parseInt$2 = _parseInt$1;

	// `Array.isArray` method
	// https://tc39.github.io/ecma262/#sec-array.isarray
	_export({ target: 'Array', stat: true }, {
	  isArray: isArray
	});

	var isArray$1 = path.Array.isArray;

	var isArray$2 = isArray$1;

	var isArray$3 = isArray$2;

	function _arrayWithHoles(arr) {
	  if (isArray$3(arr)) return arr;
	}

	var ITERATOR$1 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$1]
	    || it['@@iterator']
	    || iterators[classof(it)];
	};

	var getIterator = function (it) {
	  var iteratorMethod = getIteratorMethod(it);
	  if (typeof iteratorMethod != 'function') {
	    throw TypeError(String(it) + ' is not iterable');
	  } return anObject(iteratorMethod.call(it));
	};

	var getIterator_1 = getIterator;

	var getIterator$1 = getIterator_1;

	var ITERATOR$2 = wellKnownSymbol('iterator');

	var isIterable = function (it) {
	  var O = Object(it);
	  return O[ITERATOR$2] !== undefined
	    || '@@iterator' in O
	    // eslint-disable-next-line no-prototype-builtins
	    || iterators.hasOwnProperty(classof(O));
	};

	var isIterable_1 = isIterable;

	var isIterable$1 = isIterable_1;

	function _iterableToArrayLimit(arr, i) {
	  if (typeof symbol$2 === "undefined" || !isIterable$1(Object(arr))) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = getIterator$1(arr), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (error) {
	    var returnMethod = iterator['return'];
	    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
	    throw error;
	  }
	};

	var ITERATOR$3 = wellKnownSymbol('iterator');
	var ArrayPrototype$3 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$3[ITERATOR$3] === it);
	};

	// `Array.from` method implementation
	// https://tc39.github.io/ecma262/#sec-array.from
	var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject(arrayLike);
	  var C = typeof this == 'function' ? this : Array;
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var iteratorMethod = getIteratorMethod(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
	    iterator = iteratorMethod.call(O);
	    next = iterator.next;
	    result = new C();
	    for (;!(step = next.call(iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
	      createProperty(result, index, value);
	    }
	  } else {
	    length = toLength(O.length);
	    result = new C(length);
	    for (;length > index; index++) {
	      value = mapping ? mapfn(O[index], index) : O[index];
	      createProperty(result, index, value);
	    }
	  }
	  result.length = index;
	  return result;
	};

	var ITERATOR$4 = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$4] = function () {
	    return this;
	  };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$4] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.github.io/ecma262/#sec-array.from
	_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
	  from: arrayFrom
	});

	var from_1 = path.Array.from;

	var from_1$1 = from_1;

	var from_1$2 = from_1$1;

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('slice');
	var USES_TO_LENGTH$3 = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

	var SPECIES$2 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$3 }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$2];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var slice$1 = entryVirtual('Array').slice;

	var ArrayPrototype$4 = Array.prototype;

	var slice_1 = function (it) {
	  var own = it.slice;
	  return it === ArrayPrototype$4 || (it instanceof Array && own === ArrayPrototype$4.slice) ? slice$1 : own;
	};

	var slice$2 = slice_1;

	var slice$3 = slice$2;

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) {
	    arr2[i] = arr[i];
	  }

	  return arr2;
	}

	function _unsupportedIterableToArray(o, minLen) {
	  var _context;

	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);

	  var n = slice$3(_context = Object.prototype.toString.call(o)).call(_context, 8, -1);

	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return from_1$2(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}

	function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = construct$3(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !construct$3) return false; if (construct$3.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct$3(Date, [], function () {})); return true; } catch (e) { return false; } }
	/*
	    Requirements
	    ---
	    content:        html|node
	    anchor:         node
	    
	    Options
	    ---
	    align:          [left|right|center|#px] [top|center|bottom|#px] | default: 'center bottom'
	    zIndex:         # | default: unset
	    offset:         {left: 0, top: 0}
	    container:      element to append popover to. default: document
	*/

	var Popover = /*#__PURE__*/function (_Component) {
	  _inherits(Popover, _Component);

	  var _super = _createSuper(Popover);

	  function Popover() {
	    _classCallCheck(this, Popover);

	    return _super.apply(this, arguments);
	  }

	  _createClass(Popover, [{
	    key: "initialize",
	    value: function initialize(options) {
	      var _this = this;

	      this.showing = false;
	      options = options || {};
	      this.options = {
	        zIndex: 3,
	        container: document.body,
	        align: 'center bottom',
	        anchor: document.body,
	        content: 'needs content',
	        offset: {
	          left: 0,
	          top: 0
	        }
	      };

	      assign$2(this.options, this.pick(options, keys$3(this.options)));

	      this.el.removeAttribute('content');
	      this.options.anchor.popover = this;
	      this.listenTo(document, 'click', this.checkFocus);
	      this.listenTo(document, 'focusin', this.checkFocus);
	      this.listenTo(document, 'keyup', this.checkEscape);
	      this.listenTo(window, 'resize', function () {
	        var _context;

	        bind$2(_context = _this.resize).call(_context, _this)();
	      });

	      if (typeof this.options.container == "string") {
	        this.options.container = this.options.anchor.closest(this.options.container);
	      }

	      this.options.container = this.options.container || document.body;
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      this.showing = true;
	      this.el.style.position = 'absolute';
	      this.el.style.zIndex = this.options.zIndex;
	      append(this.el, this.options.content);
	      this.options.container.appendChild(this.el);
	      this.resize();
	      this.trigger('shown');
	      return this;
	    }
	  }, {
	    key: "resize",
	    value: function resize() {
	      this.setPosition();
	      var bounds = this.el.getBoundingClientRect();
	      var body_bounds = document.body.getBoundingClientRect();
	      var window_bounds = {
	        top: 0,
	        bottom: window.innerHeight,
	        left: 0,
	        right: window.innerWidth
	      };

	      if (bounds.bottom > Math.max(body_bounds.bottom, window_bounds.bottom)) {
	        var _this$options$align$s = this.options.align.split(" "),
	            _this$options$align$s2 = _slicedToArray(_this$options$align$s, 2),
	            leftAlign = _this$options$align$s2[0];
	            _this$options$align$s2[1];

	        this.setPosition("".concat(leftAlign, " top"));
	        bounds = this.el.getBoundingClientRect();

	        if (bounds.top < 0) {
	          this.setPosition("".concat(leftAlign, " bottom"));
	        }

	        bounds = this.el.getBoundingClientRect();
	      }

	      if (bounds.top < body_bounds.top) {
	        var difference = body_bounds.top - bounds.top;
	        if (this.el.style.top != null) this.el.style.top = _parseInt$2(this.el.style.top) + difference + "px";
	        if (this.el.style.bottom != null) this.el.style.bottom = _parseInt$2(this.el.style.bottom) - difference + "px";
	      }

	      if (bounds.left < body_bounds.left) {
	        var _difference = body_bounds.left - bounds.left;

	        if (this.el.style.left != null) this.el.style.left = _parseInt$2(this.el.style.left) + _difference + "px";
	        if (this.el.style.right != null) this.el.style.right = _parseInt$2(this.el.style.right) - _difference + "px";
	        bounds = this.el.getBoundingClientRect();
	      }

	      if (bounds.right > body_bounds.right) {
	        var _difference2 = body_bounds.right - bounds.right;

	        if (this.el.style.left != null) this.el.style.left = _parseInt$2(this.el.style.left) + _difference2 + "px";
	        if (this.el.style.right != null) this.el.style.right = _parseInt$2(this.el.style.right) - _difference2 + "px";
	      }
	    }
	  }, {
	    key: "setPosition",
	    value: function setPosition(align) {
	      var _context2;

	      align = align || this.options.align;

	      var _align$split = align.split(" "),
	          _align$split2 = _slicedToArray(_align$split, 2),
	          leftAlign = _align$split2[0],
	          topAlign = _align$split2[1];

	      leftAlign = leftAlign || "bottom";
	      var anchorOffset = offset(this.options.anchor);
	      var container = this.options.container;
	      if (getComputedStyle(container)['position'] == "static") container = container.offsetParent;
	      if (!container) container = document.body;
	      var containerOffset = offset(container);
	      anchorOffset = {
	        top: anchorOffset.top - containerOffset.top,
	        left: anchorOffset.left - containerOffset.left
	      };
	      var position = {};

	      if (leftAlign == 'left') {
	        position.right = outerWidth(container) - anchorOffset.left;
	      } else if (leftAlign == 'center') {
	        position.left = anchorOffset.left + outerWidth(this.options.anchor) / 2;
	        position.transform = "translateX(-50%)";
	      } else if (leftAlign == 'right') {
	        position.left = anchorOffset.left + outerWidth(this.options.anchor);
	      } else if (includes$4(leftAlign).call(leftAlign, "px")) {
	        position.left = anchorOffset.left + _parseInt$2(leftAlign);
	      }

	      if (topAlign == 'top') {
	        var height = outerHeight(container);

	        if (container == document.body && getComputedStyle(container)['position'] == "static") {
	          height = window.innerHeight;
	        } else if (container == document.body) {
	          height = Math.max(height, document.body.clientHeight);
	        }

	        position.bottom = height - anchorOffset.top;
	      } else if (topAlign == 'center') {
	        position.top = anchorOffset.top + outerHeight(this.options.anchor) / 2;
	        position.transform = "translateY(-50%)";
	      } else if (topAlign == 'bottom') {
	        position.top = anchorOffset.top + outerHeight(this.options.anchor);
	      } else if (includes$4(topAlign).call(topAlign, "px")) {
	        position.top = anchorOffset.top + _parseInt$2(topAlign);
	      }

	      if (this.options.offset.left) position.left += _parseInt$2(this.options.offset.left);
	      if (this.options.offset.left) position.right -= _parseInt$2(this.options.offset.left);
	      if (this.options.offset.top) position.top += _parseInt$2(this.options.offset.top);
	      if (this.options.offset.top) position.bottom -= _parseInt$2(this.options.offset.top);
	      this.el.style.left = null;
	      this.el.style.right = null;
	      this.el.style.top = null;
	      this.el.style.bottom = null;
	      this.el.style.transform = null;
	      this.el.classList.remove('popover-left', 'popover-right', 'popover-center', 'popover-top', 'popover-bottom');
	      this.el.classList.add('popover-' + topAlign);
	      this.el.classList.add('popover-' + leftAlign);

	      forEach$2(_context2 = keys$3(position)).call(_context2, function (key) {
	        this.el.style[key] = position[key] + (key != "transform" ? "px" : "");
	      }, this);
	    }
	  }, {
	    key: "checkFocus",
	    value: function checkFocus(e) {
	      if (e.defaultPrevented) return;
	      if (!this.showing) return;
	      if (e.target === this.el) return;
	      if (e.target == this.options.anchor) return;
	      if (this.el.contains(e.target)) return;
	      if (this.options.anchor.contains(e.target)) return;
	      if (this.persisting) return;
	      this.hide();
	    }
	  }, {
	    key: "checkEscape",
	    value: function checkEscape(e) {
	      if (e.which != 27) return;
	      if (this.persisting) return;
	      this.hide();
	    }
	  }, {
	    key: "isHidden",
	    value: function isHidden() {
	      return !this.showing;
	    }
	  }, {
	    key: "hide",
	    value: function hide(options) {
	      options = options || {};
	      if (!this.showing) return;
	      this.el.style.display = 'none';
	      this.showing = false;

	      if (options.silent !== true) {
	        this.trigger('hidden');
	      }
	    }
	  }, {
	    key: "show",
	    value: function show() {
	      if (this.showing) return;
	      this.el.style.display = 'block';
	      this.showing = true;
	      this.trigger('shown');
	    }
	  }, {
	    key: "toggle",
	    value: function toggle(flag) {
	      flag = flag || this.showing;
	      if (flag) this.hide();else this.show();
	    }
	  }, {
	    key: "persist",
	    value: function persist() {
	      this.persisting = true;
	    }
	  }, {
	    key: "unpersist",
	    value: function unpersist() {
	      this.persisting = false;
	    }
	  }]);

	  return Popover;
	}(Component);

	function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = construct$3(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !construct$3) return false; if (construct$3.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct$3(Date, [], function () {})); return true; } catch (e) { return false; } }
	/*.
	    anchor: element
	    content: html
	    align: top|bottom (default: top)
	    container: document.body

	    methods
	    ------
	    enable
	    disable
	    hide
	    show
	    toggle
	*/

	var Dropdown = /*#__PURE__*/function (_Component) {
	  _inherits(Dropdown, _Component);

	  var _super = _createSuper$1(Dropdown);

	  function Dropdown() {
	    _classCallCheck(this, Dropdown);

	    return _super.apply(this, arguments);
	  }

	  _createClass(Dropdown, [{
	    key: "initialize",
	    value: function initialize(options) {
	      this.el = options.anchor;
	      options = options || {};
	      this.options = {
	        align: 'center bottom',
	        container: document.body
	      };

	      assign$2(this.options, this.pick(options, keys$3(this.options)));

	      this.enabled = true;
	      this.active = false;
	      this.content = options.content;
	      this.el.dropdown = this;
	      this.listenTo(this.el, 'click', this.toggle);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return this;
	    }
	  }, {
	    key: "toggle",
	    value: function toggle() {
	      this.active = !this.active;

	      if (this.active) {
	        this.show();
	      } else {
	        this.hide();
	      }
	    }
	  }, {
	    key: "show",
	    value: function show() {
	      if (!this.enabled) return;
	      this.active = true;
	      this.el.classList.add('-active');

	      if (this.popup) {
	        this.popup.show();
	      } else {
	        this.popup = new Popover({
	          content: this.content,
	          anchor: this.el,
	          align: this.options.align,
	          container: this.options.container
	        }).render();
	        this.listenToOnce(this.popup, 'hidden', this.hidden);
	      }
	    }
	  }, {
	    key: "hide",
	    value: function hide() {
	      this.popup.remove();
	      delete this.popup;
	      this.hidden();
	    }
	  }, {
	    key: "hidden",
	    value: function hidden() {
	      this.active = false;
	      this.el.classList.remove('-active');
	    }
	  }, {
	    key: "disable",
	    value: function disable() {
	      this.enabled = false;
	    }
	  }, {
	    key: "enabled",
	    value: function enabled() {
	      this.enabled = true;
	    }
	  }]);

	  return Dropdown;
	}(Component);

	var $map = arrayIteration.map;



	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('map');
	// FF49- issue
	var USES_TO_LENGTH$4 = arrayMethodUsesToLength('map');

	// `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$4 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var map = entryVirtual('Array').map;

	var ArrayPrototype$5 = Array.prototype;

	var map_1 = function (it) {
	  var own = it.map;
	  return it === ArrayPrototype$5 || (it instanceof Array && own === ArrayPrototype$5.map) ? map : own;
	};

	var map$1 = map_1;

	var map$2 = map$1;

	function _createSuper$2(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$2(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = construct$3(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$2() { if (typeof Reflect === "undefined" || !construct$3) return false; if (construct$3.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct$3(Date, [], function () {})); return true; } catch (e) { return false; } }
	/*  UniformModal.initialize
	    Options
	    content:    string|$el|function
	    klass:      string - classes to append to modal container

	    * use blurrable to keep some elements from being blurred ie. <div blurrable="false">...</div>
	*/

	var Modal = /*#__PURE__*/function (_Component) {
	  _inherits(Modal, _Component);

	  var _super = _createSuper$2(Modal);

	  function Modal() {
	    _classCallCheck(this, Modal);

	    return _super.apply(this, arguments);
	  }

	  _createClass(Modal, [{
	    key: "initialize",
	    value: function initialize(options) {
	      this.options = {};
	      this.options.klass = options.klass || false;
	      this.content = options.content;
	      this.el.removeAttribute('content');
	      this.el.classList.add('uniformModal');
	      this.listenTo(document, 'keyup', this.keyup);
	      this.listenTo(this.el, 'click', this.checkCloseButton);
	    }
	  }, {
	    key: "keyup",
	    value: function keyup(e) {
	      if (e.which != 27) return;
	      this.close();
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      this.highest_z_index = 0;
	      this.overlay = document.createElement('div');
	      this.overlay.classList.add('uniformModal-overlay');
	      this.blur = document.createElement('div');
	      this.blur.classList.add('uniformModal-blur');
	      this.original_scroll = window.scrollY;
	      this.blur.style.top = 0 - this.original_scroll + "px";

	      if (document.body.querySelectorAll('.uniformModal').length > 0) {
	        this.highest_z_index = Math.max(map$2(Array.prototype).call(document.body.querySelectorAll('.uniformModal'), function (el) {
	          return _parseInt$2(css(el, 'zIndex'));
	        }));
	        this.el.style.zIndex = this.highest_z_index + 2;
	      }

	      this.el.appendChild(this.overlay);
	      var next_element = document.body.children[0];

	      while (next_element) {
	        var element = next_element;
	        next_element = element.nextElementSibling;

	        if (!element.matches('[blurrable="false"]')) {
	          this.blur.appendChild(element);
	        }
	      }

	      document.body.classList.add('uniformModal-active');
	      document.body.appendChild(this.blur);
	      document.body.appendChild(this.el);
	      var container = document.createElement('div');
	      container.classList.add('uniformModal-container');
	      append(container, this.content);
	      var closeButton = document.createElement('div');
	      closeButton.classList.add('uniformModal-close');
	      this.el.appendChild(closeButton);
	      this.el.style.top = window.scrollY;
	      this.listenTo(this.overlay, 'click', this.close);
	      this.el.appendChild(container);
	      if (this.options.klass) container.classList.add(this.options.klass);
	      if (this.content.innerHTML) trigger(this.content, 'rendered');
	      this.trigger('rendered');
	      return this;
	    }
	  }, {
	    key: "checkCloseButton",
	    value: function checkCloseButton(e) {
	      if (e.target.classList.contains('uniformModal-close')) this.close();
	    }
	  }, {
	    key: "close",
	    value: function close() {
	      var _context;

	      forEach$2(_context = document.querySelectorAll('uniformModal-active')).call(_context, function (el) {
	        return el.classList.remove('uniformModal-active');
	      });

	      var elements = this.blur.children;
	      var elementCount = elements.length;

	      for (var i = 0; i < elementCount; i++) {
	        document.body.appendChild(elements[0]);
	      }

	      if (this.blur.parentNode) this.blur.parentNode.removeChild(this.blur);
	      window.scrollTo(0, this.original_scroll);
	      this.trigger('closed');
	      this.remove();
	    }
	  }, {
	    key: "remove",
	    value: function remove() {
	      Component.prototype.remove.apply(this, arguments);
	      if (this.overlay && this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay);
	      delete this.overlay;
	    }
	  }]);

	  return Modal;
	}(Component);

	var non = '\u200B\u0085\u180E';

	// check that a method works with the correct list
	// of whitespaces and has a correct name
	var stringTrimForced = function (METHOD_NAME) {
	  return fails(function () {
	    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
	  });
	};

	var $trim = stringTrim.trim;


	// `String.prototype.trim` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.trim
	_export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
	  trim: function trim() {
	    return $trim(this);
	  }
	});

	var trim$1 = entryVirtual('String').trim;

	var StringPrototype$1 = String.prototype;

	var trim_1 = function (it) {
	  var own = it.trim;
	  return typeof it === 'string' || it === StringPrototype$1
	    || (it instanceof String && own === StringPrototype$1.trim) ? trim$1 : own;
	};

	var trim$2 = trim_1;

	var trim$3 = trim$2;

	var concat = entryVirtual('Array').concat;

	var ArrayPrototype$6 = Array.prototype;

	var concat_1 = function (it) {
	  var own = it.concat;
	  return it === ArrayPrototype$6 || (it instanceof Array && own === ArrayPrototype$6.concat) ? concat : own;
	};

	var concat$1 = concat_1;

	var concat$2 = concat$1;

	var test$1 = [];
	var nativeSort = test$1.sort;

	// IE8-
	var FAILS_ON_UNDEFINED = fails(function () {
	  test$1.sort(undefined);
	});
	// V8 bug
	var FAILS_ON_NULL = fails(function () {
	  test$1.sort(null);
	});
	// Old WebKit
	var STRICT_METHOD$1 = arrayMethodIsStrict('sort');

	var FORCED$3 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD$1;

	// `Array.prototype.sort` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.sort
	_export({ target: 'Array', proto: true, forced: FORCED$3 }, {
	  sort: function sort(comparefn) {
	    return comparefn === undefined
	      ? nativeSort.call(toObject(this))
	      : nativeSort.call(toObject(this), aFunction(comparefn));
	  }
	});

	var sort = entryVirtual('Array').sort;

	var ArrayPrototype$7 = Array.prototype;

	var sort_1 = function (it) {
	  var own = it.sort;
	  return it === ArrayPrototype$7 || (it instanceof Array && own === ArrayPrototype$7.sort) ? sort : own;
	};

	var sort$1 = sort_1;

	var sort$2 = sort$1;

	var isArray$4 = isArray$1;

	var isArray$5 = isArray$4;

	var _context, _context2, _context3;

	trim$3(_context = "\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 32 32\">\n<path d=\"M28.998 8.531l-2.134-2.134c-0.394-0.393-1.030-0.393-1.423 0l-12.795 12.795-6.086-6.13c-0.393-0.393-1.029-0.393-1.423 0l-2.134 2.134c-0.393 0.394-0.393 1.030 0 1.423l8.924 8.984c0.393 0.393 1.030 0.393 1.423 0l15.648-15.649c0.393-0.392 0.393-1.030 0-1.423z\"></path>\n</svg>\n").call(_context);

	var arrow_down = trim$3(_context2 = "\n<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" viewBox=\"0 0 20 20\">\n<path d=\"M13.418 7.601c0.271-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-3.907 3.83c-0.271 0.268-0.709 0.268-0.979 0l-3.908-3.83c-0.27-0.268-0.27-0.701 0-0.969s0.708-0.268 0.979 0l3.418 3.14 3.418-3.14z\"></path>\n</svg>\n").call(_context2);

	var x = trim$3(_context3 = "\n<svg version=\"1.2\" baseProfile=\"tiny\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" width=\"64px\" height=\"64px\" viewBox=\"0 0 64 64\" xml:space=\"preserve\">\n<g><rect x=\"-2.352\" y=\"29.385\" transform=\"matrix(0.7071 0.7071 -0.7071 0.7071 32.3545 -14.3899)\" width=\"71.799\" height=\"4.95\"/></g>\n<g><rect x=\"-2.374\" y=\"29.376\" transform=\"matrix(0.7071 -0.7071 0.7071 0.7071 -12.7023 33.0352)\" width=\"71.799\" height=\"4.95\"/></g>\n</svg>\n\n").call(_context3);

	function _createSuper$3(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$3(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = construct$3(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$3() { if (typeof Reflect === "undefined" || !construct$3) return false; if (construct$3.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct$3(Date, [], function () {})); return true; } catch (e) { return false; } }
	/*
	  options: array of html options, each item can be string | array | object
	    ex. ["Employee", "Manager", "General Manager"]
	    ex. [
	      ["Employee", "employee", false],
	      ["Manager", "manager", false],
	      ["General Manager", "general_manager", true],
	    ]
	    ex. [
	      {value: "employee", text: 'Employee', selected: false},
	      {value: "manager", text: 'Manager', selected: false},
	      {value: "general_manager", text: 'General Manager', selected: true}
	    ]
	  limit: int | false - number of options to limit to, or false to not limit
	  container: selector for where to render dropdown
	  multiple: false
	*/

	var Select = /*#__PURE__*/function (_Component) {
	  _inherits(Select, _Component);

	  var _super = _createSuper$3(Select);

	  function Select() {
	    _classCallCheck(this, Select);

	    return _super.apply(this, arguments);
	  }

	  _createClass(Select, [{
	    key: "initialize",
	    value: function initialize() {
	      var _context;

	      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      this.htmlOptions = map$2(_context = options.options).call(_context, function (option) {
	        if (typeof option == "string") {
	          return {
	            value: option,
	            text: option
	          };
	        } else if (isArray$5(option)) {
	          return {
	            value: option[1],
	            text: option[0],
	            selected: option[2]
	          };
	        } else if (_typeof(option) == "object") {
	          return option;
	        } else {
	          throw "option of unexpected type";
	        }
	      });
	      this.options = {
	        multiple: false,
	        limit: 8,
	        container: false
	      };

	      assign$2(this.options, this.pick(options, keys$3(this.options)));

	      this.el_options = assign$2({}, this.pick(options, HTML_ATTRIBUTES));
	      this.el = createElement('button', this.el_options);
	      this.el.classList.add('uniformSelect');
	      this.listenTo(this.el, 'click', this.toggleOptions);
	      this.listenTo(this.el, 'click', '.uniformSelect-remove', this.removeSelection);
	      this.listenTo(this.el, 'change', 'select', this.renderValue);
	      this.listenTo(this.el, 'close', 'select', this.removeOptions);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _context2,
	          _this = this,
	          _context3,
	          _context4;

	      this.valueEl = createElement('span');
	      this.valueEl.classList.add('uniformSelect-value');
	      this.el.append(this.valueEl);
	      this.indicatorEl = createElement('span', {
	        children: arrow_down
	      });
	      this.indicatorEl.classList.add('uniformSelect-indicator');
	      this.el.append(this.indicatorEl);
	      this.select = createElement('select', this.el_options);

	      forEach$2(_context2 = this.htmlOptions).call(_context2, function (option) {
	        _this.select.append(createElement('option', assign$2({}, {
	          children: option.text
	        }, option)));
	      });

	      this.el.append(this.select); // Append placeholder of longest option, to set width

	      var longestText = sort$2(_context3 = map$2(_context4 = this.htmlOptions).call(_context4, function (x) {
	        return x.text;
	      })).call(_context3, function (a, b) {
	        return a.length < b.length;
	      })[0];

	      var placeholder = createElement('span', {
	        class: 'uniformSelect-placeholder',
	        children: longestText
	      });
	      this.el.append(placeholder);
	      this.renderValue();
	      return this;
	    }
	  }, {
	    key: "renderValue",
	    value: function renderValue() {
	      var _this2 = this;

	      var selectedOptions = filter$3(this.select.querySelectorAll("option"), function (el) {
	        return el.selected;
	      });

	      var html = map$2(selectedOptions).call(selectedOptions, function (el) {
	        var _context5;

	        return _this2.options.multiple ? concat$2(_context5 = "\n      <span class=\"uniformSelect-selection\">\n        <span>".concat(el.textContent, "</span><span class=\"uniformSelect-remove\">")).call(_context5, x, "</span>\n      </span>\n    ") : el.textContent;
	      }).join(" ");

	      this.valueEl.innerHTML = html;
	    }
	  }, {
	    key: "selectOption",
	    value: function selectOption(e) {
	      var makeActive = !e.target.option.selected;

	      if (!this.options.multiple && makeActive) {
	        var _context6;

	        forEach$2(_context6 = e.target.offsetParent.querySelectorAll('.active')).call(_context6, function (el) {
	          return el.classList.remove('active');
	        });
	      }

	      e.target.classList.toggle('active', makeActive);
	      e.target.option.selected = makeActive;

	      if (!this.options.multiple) {
	        this.removeOptions();
	      }

	      trigger(this.select, 'change');
	    }
	  }, {
	    key: "removeSelection",
	    value: function removeSelection(e) {
	      e.preventDefault();
	      e.stopPropagation();
	      var option = filter$3(this.select.querySelectorAll("option"), function (el) {
	        var _context7, _context8;

	        return trim$3(_context7 = el.innerText).call(_context7) == trim$3(_context8 = e.target.closest('.uniformSelect-selection').innerText).call(_context8);
	      })[0];
	      if (!option) return;
	      option.selected = false;
	      option.button.classList.remove('active');
	      trigger(this.select, 'change');
	    }
	  }, {
	    key: "toggleOptions",
	    value: function toggleOptions(e) {
	      if (e && (e.target.matches('.uniformSelect-remove') || e.target.closest('.uniformSelect-remove'))) {
	        return;
	      }

	      this.el.classList.toggle('active');

	      if (this.el.contains('active')) {
	        this.renderOptions();
	      } else {
	        this.removeOptions();
	      }
	    }
	  }, {
	    key: "renderOptions",
	    value: function renderOptions() {
	      var _context9;

	      var options = createElement("div", {
	        class: 'uniformSelect-options'
	      });
	      options.style.fontSize = css(this.el, 'font-size');

	      forEach$2(_context9 = this.select.querySelectorAll('option')).call(_context9, function (option, index) {
	        var button = createElement("button", {
	          type: 'button',
	          class: 'uniformSelect-option'
	        });
	        button.option = option;
	        option.button = button;
	        button.textContent = option.textContent;
	        button.value = option.value;
	        if (button.textContent == "") button.innerHTML = "<span class='text-italic text-muted'>None</span>";
	        button.classList.toggle('active', option.selected);
	        console.log(this.options.limit, index);

	        if (this.options.limit && index + 1 > this.options.limit) {
	          button.classList.add('hide');
	        }

	        options.append(button);
	      }, this);

	      this.listenTo(options, 'click', '.uniformSelect-option', this.selectOption);
	      var actions = createElement('div', {
	        class: 'uniformSelect-actions'
	      });

	      if (this.options.limit && this.htmlOptions.length > this.options.limit) {
	        var _context10;

	        var button = createElement('button', {
	          type: 'button',
	          class: 'uniformSelect-show-all',
	          children: 'Show All'
	        });
	        this.listenTo(button, 'click', bind$2(_context10 = this.showAllOptions).call(_context10, this));
	        actions.append(button);
	      }

	      if (this.options.multiple) {
	        var _context11;

	        var _button = createElement('button', {
	          type: 'button',
	          class: 'uniformSelect-done',
	          children: ['Done']
	        });

	        this.listenTo(_button, 'click', bind$2(_context11 = this.removeOptions).call(_context11, this));
	        actions.append(_button);
	      }

	      if (!isEmpty(actions)) {
	        options.append(actions);
	      }

	      this.popover = new Popover({
	        offset: {
	          top: 1
	        },
	        align: '0px bottom',
	        anchor: this.el,
	        content: options,
	        container: this.options.container
	      }).render();
	      this.listenTo(this.popover, 'hidden', this.removeOptions);
	    }
	  }, {
	    key: "removeOptions",
	    value: function removeOptions() {
	      this.el.classList.remove('active');
	      if (!this.popover) return;
	      this.popover.remove();
	    }
	  }, {
	    key: "showAllOptions",
	    value: function showAllOptions(e) {
	      var _context12;

	      e.preventDefault();
	      e.stopPropagation();
	      if (!this.popover) return;

	      forEach$2(_context12 = this.popover.el.querySelectorAll('button.hide')).call(_context12, function (el) {
	        return el.classList.remove('hide');
	      });

	      var button = this.popover.el.querySelector('.uniformSelect-show-all');
	      button.parentNode.removeChild(button);
	    }
	  }]);

	  return Select;
	}(Component);

	function _createSuper$4(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$4(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = construct$3(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$4() { if (typeof Reflect === "undefined" || !construct$3) return false; if (construct$3.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct$3(Date, [], function () {})); return true; } catch (e) { return false; } }

	var FloatingLabel = /*#__PURE__*/function (_Component) {
	  _inherits(FloatingLabel, _Component);

	  var _super = _createSuper$4(FloatingLabel);

	  function FloatingLabel() {
	    _classCallCheck(this, FloatingLabel);

	    return _super.apply(this, arguments);
	  }

	  _createClass(FloatingLabel, [{
	    key: "initialize",
	    value: function initialize(options) {
	      if (options.input instanceof Element) {
	        this.input = options.input;
	      } else {
	        this.input = createElement('input', assign$2({}, {
	          type: this.constructor.type
	        }, options.input)); // TODO filter options to dolla.HTML_ATTRIBUTES
	      }

	      this.label = createElement('label', {
	        for: this.input.id,
	        children: [options.label]
	      });
	      this.input.setAttribute('aria-label', options.label);
	      this.el.classList.add('uniformFloatingLabelInput');
	      this.listenTo(this.input, 'focus', this.focus);
	      this.listenTo(this.input, 'blur', this.blur);
	      this.listenTo(this.input, 'revealed', this.render);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      if (!isVisible(this.input)) return;

	      var internalHeight = _parseInt$2(css(this.input, 'height')) - _parseInt$2(css(this.input, 'borderTopWidth')) - _parseInt$2(css(this.input, 'borderBottomWidth'));

	      this.input.style.lineHeight = 1;

	      var lineHeight = _parseInt$2(css(this.input, 'lineHeight'));

	      var fontSize = _parseInt$2(css(this.input, 'fontSize'));
	      this.label.style.setProperty('--font-size', css(this.input, 'fontSize'));
	      this.label.style.paddingLeft = css(this.input, 'paddingLeft');
	      this.label.style.lineHeight = lineHeight + "px";
	      this.label.style.paddingTop = internalHeight / 2 - lineHeight + "px";
	      this.label.style.paddingBottom = internalHeight / 2 - lineHeight + "px";
	      this.input.style.paddingTop = internalHeight / 2 - (lineHeight - fontSize) + "px";
	      this.input.style.paddingBottom = internalHeight / 2 - lineHeight + (lineHeight - fontSize) + "px";
	      this.input.parentNode.insertBefore(this.el, this.input.nextSibling);
	      this.el.append(this.input);
	      this.el.append(this.label);

	      if (this.input.value != "") {
	        this.focus();
	      }
	    }
	  }, {
	    key: "focus",
	    value: function focus(e) {
	      this.el.classList.add('present');
	    }
	  }, {
	    key: "blur",
	    value: function blur(e) {
	      if (this.input.value == "") {
	        this.el.classList.remove('present');
	      }
	    }
	  }]);

	  return FloatingLabel;
	}(Component);

	function _createSuper$5(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$5(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = construct$3(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$5() { if (typeof Reflect === "undefined" || !construct$3) return false; if (construct$3.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct$3(Date, [], function () {})); return true; } catch (e) { return false; } }

	var Resizer = /*#__PURE__*/function (_Component) {
	  _inherits(Resizer, _Component);

	  var _super = _createSuper$5(Resizer);

	  function Resizer() {
	    _classCallCheck(this, Resizer);

	    return _super.apply(this, arguments);
	  }

	  _createClass(Resizer, [{
	    key: "initialize",
	    value: function initialize() {
	      var _context,
	          _this = this;

	      var breakpoints = getComputedStyle(window.document.body).getPropertyValue('--breakpoints');
	      this.breakpoints = {};

	      forEach$2(_context = breakpoints.split(",")).call(_context, function (breakpoint) {
	        var _breakpoint$split = breakpoint.split("/"),
	            _breakpoint$split2 = _slicedToArray(_breakpoint$split, 2),
	            key = _breakpoint$split2[0],
	            value = _breakpoint$split2[1];

	        _this.breakpoints[trim$3(key).call(key)] = value;
	      });

	      this.listenTo(window, 'resize', this.resize);
	      this.resize();
	    }
	  }, {
	    key: "resize",
	    value: function resize() {
	      var _context2,
	          _this2 = this;

	      var width = this.el.offsetWidth;

	      forEach$2(_context2 = keys$3(this.breakpoints)).call(_context2, function (size) {
	        var query = _this2.breakpoints[size];
	        var css_class = size + '-container';

	        var _query$split = query.split(":"),
	            _query$split2 = _slicedToArray(_query$split, 2),
	            attribute = _query$split2[0],
	            value = _query$split2[1];

	        if (value.match("px")) {
	          value = _parseInt$2(value);
	        } else {
	          throw "unsupported media units";
	        }

	        if (attribute == "min-width") {
	          _this2.el.classList.toggle(css_class, width > value);
	        } else if (attribute == "max-width") {
	          _this2.el.classList.toggle(css_class, width < value);
	        } else {
	          throw "unsupported media feature";
	        }
	      });
	    }
	  }]);

	  return Resizer;
	}(Component);

	var slice$4 = [].slice;
	var MSIE = /MSIE .\./.test(engineUserAgent); // <- dirty ie9- check

	var wrap$1 = function (scheduler) {
	  return function (handler, timeout /* , ...arguments */) {
	    var boundArgs = arguments.length > 2;
	    var args = boundArgs ? slice$4.call(arguments, 2) : undefined;
	    return scheduler(boundArgs ? function () {
	      // eslint-disable-next-line no-new-func
	      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
	    } : handler, timeout);
	  };
	};

	// ie9- setTimeout & setInterval additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
	_export({ global: true, bind: true, forced: MSIE }, {
	  // `setTimeout` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
	  setTimeout: wrap$1(global_1.setTimeout),
	  // `setInterval` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
	  setInterval: wrap$1(global_1.setInterval)
	});

	var setTimeout = path.setTimeout;

	var setTimeout$1 = setTimeout;

	function _createSuper$6(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$6(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = construct$3(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$6() { if (typeof Reflect === "undefined" || !construct$3) return false; if (construct$3.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct$3(Date, [], function () {})); return true; } catch (e) { return false; } }
	/*
	    anchor: element
	    content: html
	    align: top|bottom (default: top)
	    container: document.body

	    methods
	    ------
	    enable
	    disable
	    hide
	    show
	*/

	var Tooltip = /*#__PURE__*/function (_Component) {
	  _inherits(Tooltip, _Component);

	  var _super = _createSuper$6(Tooltip);

	  function Tooltip() {
	    _classCallCheck(this, Tooltip);

	    return _super.apply(this, arguments);
	  }

	  _createClass(Tooltip, [{
	    key: "initialize",
	    value: function initialize(options) {
	      this.el = options.anchor;
	      options = options || {};
	      this.options = {
	        align: 'top',
	        container: document.body
	      };

	      assign$2(this.options, this.pick(options, keys$3(this.options)));

	      this.enabled = true;
	      this.content = options.content;
	      this.el.tooltip = this;
	      this.listenTo(this.el, 'mouseenter', this.show);
	      this.listenTo(this.el, 'mouseleave', this.hide);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      return this;
	    }
	  }, {
	    key: "show",
	    value: function show() {
	      if (!this.enabled) return;
	      clearTimeout(this.hide_timeout);
	      this.el.classList.add('-active');

	      if (this.popup) {
	        this.popup.show();
	      } else {
	        this.popup = new Popover({
	          content: this.content,
	          class: 'uniformPointer -bottom bg-gray-70 bg-opacity-85 text-white rounded pad-1/2x text-sm max-width-300-px',
	          anchor: this.el,
	          align: this.options.align == "top" ? "center top" : 'center 100%',
	          offset: {
	            top: -7
	          },
	          container: this.options.container
	        }).render();
	      }
	    }
	  }, {
	    key: "hide",
	    value: function hide() {
	      var _this = this;

	      this.hide_timeout = setTimeout$1(function () {
	        _this.popup.remove();

	        _this.el.classList.remove('-active');

	        delete _this.popup;
	      }, 300);
	    }
	  }, {
	    key: "disable",
	    value: function disable() {
	      this.enabled = false;
	    }
	  }, {
	    key: "enabled",
	    value: function enabled() {
	      this.enabled = true;
	    }
	  }]);

	  return Tooltip;
	}(Component);

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    defineProperty$2(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _createSuper$7(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$7(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = construct$3(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

	function _isNativeReflectConstruct$7() { if (typeof Reflect === "undefined" || !construct$3) return false; if (construct$3.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(construct$3(Date, [], function () {})); return true; } catch (e) { return false; } }
	var Checkbox = /*#__PURE__*/function (_Component) {
	  _inherits(Checkbox, _Component);

	  var _super = _createSuper$7(Checkbox);

	  function Checkbox() {
	    _classCallCheck(this, Checkbox);

	    return _super.apply(this, arguments);
	  }

	  _createClass(Checkbox, [{
	    key: "initialize",
	    value: function initialize(options) {
	      if (options.input instanceof Element) {
	        this.input = options.input;
	      } else {
	        this.input = createElement('input', assign$2({}, {
	          type: this.constructor.type
	        }, options.input)); // TODO filter options to dolla.HTML_ATTRIBUTES
	      }

	      if (!options.tabindex) this.el.tabIndex = 0;
	      this.el.classList.add(this.constructor.CSSClass);
	      this.listenTo(this.el, 'click', this.click);
	      this.listenTo(this.input, 'change', this.change);
	      this.listenTo(document, 'keyup', this.keyup);
	      this.listenTo(document, 'keydown', this.keydown);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      this.input.style.display = "none";

	      if (this.input.parentNode) {
	        this.input.parentNode.insertBefore(this.el, this.input.nextSibling);
	      } else {
	        this.el.append(this.input);
	      }

	      this.change();
	      return this;
	    }
	  }, {
	    key: "change",
	    value: function change() {
	      this.el.classList.toggle('checked', this.input.checked);
	    }
	  }, {
	    key: "click",
	    value: function click(e) {
	      if (this.input.disabled) return;
	      this.input.checked = !this.input.checked;
	      trigger(this.input, 'change');
	      e.preventDefault();
	    }
	  }, {
	    key: "keyup",
	    value: function keyup(e) {
	      if (document.activeElement != this.el) return;
	      if (e.keyCode != 32) return;
	      e.preventDefault();
	      this.click(e);
	    }
	  }, {
	    key: "keydown",
	    value: function keydown(e) {
	      if (e.keyCode == 32 && document.activeElement == this.el) {
	        // Prevent Page Scroll
	        e.preventDefault();
	      }
	    }
	  }]);

	  return Checkbox;
	}(Component);

	_defineProperty(Checkbox, "CSSClass", "uniformCheckbox");

	_defineProperty(Checkbox, "type", 'checkbox');

	var Radio = /*#__PURE__*/function (_Checkbox) {
	  _inherits(Radio, _Checkbox);

	  var _super2 = _createSuper$7(Radio);

	  function Radio() {
	    _classCallCheck(this, Radio);

	    return _super2.apply(this, arguments);
	  }

	  return Radio;
	}(Checkbox);

	_defineProperty(Radio, "CSSClass", "uniformRadio");

	var Toggle = /*#__PURE__*/function (_Checkbox2) {
	  _inherits(Toggle, _Checkbox2);

	  var _super3 = _createSuper$7(Toggle);

	  function Toggle() {
	    _classCallCheck(this, Toggle);

	    return _super3.apply(this, arguments);
	  }

	  return Toggle;
	}(Checkbox);

	_defineProperty(Toggle, "CSSClass", "uniformToggle");

	exports.Checkbox = Checkbox;
	exports.Dropdown = Dropdown;
	exports.FloatingLabelInput = FloatingLabel;
	exports.Modal = Modal;
	exports.Popover = Popover;
	exports.Radio = Radio;
	exports.Resizer = Resizer;
	exports.Select = Select;
	exports.Toggle = Toggle;
	exports.Tooltip = Tooltip;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

}({}));
