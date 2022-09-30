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
	  // eslint-disable-next-line es-x/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var functionBindNative = !fails(function () {
	  // eslint-disable-next-line es-x/no-function-prototype-bind -- safe
	  var test = (function () { /* empty */ }).bind();
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return typeof test != 'function' || test.hasOwnProperty('prototype');
	});

	var FunctionPrototype$3 = Function.prototype;
	var apply = FunctionPrototype$3.apply;
	var call$2 = FunctionPrototype$3.call;

	// eslint-disable-next-line es-x/no-reflect -- safe
	var functionApply = typeof Reflect == 'object' && Reflect.apply || (functionBindNative ? call$2.bind(apply) : function () {
	  return call$2.apply(apply, arguments);
	});

	var FunctionPrototype$2 = Function.prototype;
	var bind$5 = FunctionPrototype$2.bind;
	var call$1 = FunctionPrototype$2.call;
	var uncurryThis = functionBindNative && bind$5.bind(call$1, call$1);

	var functionUncurryThis = functionBindNative ? function (fn) {
	  return fn && uncurryThis(fn);
	} : function (fn) {
	  return fn && function () {
	    return call$1.apply(fn, arguments);
	  };
	};

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	var isCallable = function (argument) {
	  return typeof argument == 'function';
	};

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails(function () {
	  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var call = Function.prototype.call;

	var functionCall = functionBindNative ? call.bind(call) : function () {
	  return call.apply(call, arguments);
	};

	var $propertyIsEnumerable$1 = {}.propertyIsEnumerable;
	// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable$1.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	var f$4 = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$1(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable$1;

	var objectPropertyIsEnumerable = {
		f: f$4
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString$1 = functionUncurryThis({}.toString);
	var stringSlice$1 = functionUncurryThis(''.slice);

	var classofRaw = function (it) {
	  return stringSlice$1(toString$1(it), 8, -1);
	};

	var Object$5 = global_1.Object;
	var split = functionUncurryThis(''.split);

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !Object$5('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split(it, '') : Object$5(it);
	} : Object$5;

	var TypeError$c = global_1.TypeError;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError$c("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it == 'object' ? it !== null : isCallable(it);
	};

	var path = {};

	var aFunction = function (variable) {
	  return isCallable(variable) ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var objectIsPrototypeOf = functionUncurryThis({}.isPrototypeOf);

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var Deno = global_1.Deno;
	var versions = process && process.versions || Deno && Deno.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us
	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	}

	// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0
	if (!version && engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	var engineV8Version = version;

	/* eslint-disable es-x/no-symbol -- required for testing */



	// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- required for testing
	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  var symbol = Symbol();
	  // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	    !Symbol.sham && engineV8Version && engineV8Version < 41;
	});

	/* eslint-disable es-x/no-symbol -- required for testing */


	var useSymbolAsUid = nativeSymbol
	  && !Symbol.sham
	  && typeof Symbol.iterator == 'symbol';

	var Object$4 = global_1.Object;

	var isSymbol = useSymbolAsUid ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn('Symbol');
	  return isCallable($Symbol) && objectIsPrototypeOf($Symbol.prototype, Object$4(it));
	};

	var String$4 = global_1.String;

	var tryToString = function (argument) {
	  try {
	    return String$4(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var TypeError$b = global_1.TypeError;

	// `Assert: IsCallable(argument) is true`
	var aCallable = function (argument) {
	  if (isCallable(argument)) return argument;
	  throw TypeError$b(tryToString(argument) + ' is not a function');
	};

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	var getMethod = function (V, P) {
	  var func = V[P];
	  return func == null ? undefined : aCallable(func);
	};

	var TypeError$a = global_1.TypeError;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	var ordinaryToPrimitive = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
	  if (isCallable(fn = input.valueOf) && !isObject(val = functionCall(fn, input))) return val;
	  if (pref !== 'string' && isCallable(fn = input.toString) && !isObject(val = functionCall(fn, input))) return val;
	  throw TypeError$a("Can't convert object to primitive value");
	};

	// eslint-disable-next-line es-x/no-object-defineproperty -- safe
	var defineProperty$8 = Object.defineProperty;

	var defineGlobalProperty = function (key, value) {
	  try {
	    defineProperty$8(global_1, key, { value: value, configurable: true, writable: true });
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store$1 = global_1[SHARED] || defineGlobalProperty(SHARED, {});

	var sharedStore = store$1;

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.22.7',
	  mode: 'pure' ,
	  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
	  license: 'https://github.com/zloirock/core-js/blob/v3.22.7/LICENSE',
	  source: 'https://github.com/zloirock/core-js'
	});
	});

	var Object$3 = global_1.Object;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object$3(requireObjectCoercible(argument));
	};

	var hasOwnProperty = functionUncurryThis({}.hasOwnProperty);

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	// eslint-disable-next-line es-x/no-object-hasown -- safe
	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject(it), key);
	};

	var id = 0;
	var postfix = Math.random();
	var toString = functionUncurryThis(1.0.toString);

	var uid = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString(++id + postfix, 36);
	};

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$3 = global_1.Symbol;
	var symbolFor = Symbol$3 && Symbol$3['for'];
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$3 : Symbol$3 && Symbol$3.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!hasOwnProperty_1(WellKnownSymbolsStore, name) || !(nativeSymbol || typeof WellKnownSymbolsStore[name] == 'string')) {
	    var description = 'Symbol.' + name;
	    if (nativeSymbol && hasOwnProperty_1(Symbol$3, name)) {
	      WellKnownSymbolsStore[name] = Symbol$3[name];
	    } else if (useSymbolAsUid && symbolFor) {
	      WellKnownSymbolsStore[name] = symbolFor(description);
	    } else {
	      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
	    }
	  } return WellKnownSymbolsStore[name];
	};

	var TypeError$9 = global_1.TypeError;
	var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	var toPrimitive = function (input, pref) {
	  if (!isObject(input) || isSymbol(input)) return input;
	  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
	  var result;
	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = functionCall(exoticToPrim, input, pref);
	    if (!isObject(result) || isSymbol(result)) return result;
	    throw TypeError$9("Can't convert object to primitive value");
	  }
	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive(input, pref);
	};

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	var toPropertyKey = function (argument) {
	  var key = toPrimitive(argument, 'string');
	  return isSymbol(key) ? key : key + '';
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS$1 = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS$1 ? document$1.createElement(it) : {};
	};

	// Thanks to IE8 for its funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	var f$3 = descriptors ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPropertyKey(P);
	  if (ie8DomDefine) try {
	    return $getOwnPropertyDescriptor$1(O, P);
	  } catch (error) { /* empty */ }
	  if (hasOwnProperty_1(O, P)) return createPropertyDescriptor(!functionCall(objectPropertyIsEnumerable.f, O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$3
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : isCallable(detection) ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var bind$4 = functionUncurryThis(functionUncurryThis.bind);

	// optional / simple context binding
	var functionBindContext = function (fn, that) {
	  aCallable(fn);
	  return that === undefined ? fn : functionBindNative ? bind$4(fn, that) : function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	// V8 ~ Chrome 36-
	// https://bugs.chromium.org/p/v8/issues/detail?id=3334
	var v8PrototypeDefineBug = descriptors && fails(function () {
	  // eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
	  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
	    value: 42,
	    writable: false
	  }).prototype != 42;
	});

	var String$3 = global_1.String;
	var TypeError$8 = global_1.TypeError;

	// `Assert: Type(argument) is Object`
	var anObject = function (argument) {
	  if (isObject(argument)) return argument;
	  throw TypeError$8(String$3(argument) + ' is not an object');
	};

	var TypeError$7 = global_1.TypeError;
	// eslint-disable-next-line es-x/no-object-defineproperty -- safe
	var $defineProperty = Object.defineProperty;
	// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
	var ENUMERABLE = 'enumerable';
	var CONFIGURABLE$1 = 'configurable';
	var WRITABLE = 'writable';

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? v8PrototypeDefineBug ? function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
	    var current = $getOwnPropertyDescriptor(O, P);
	    if (current && current[WRITABLE]) {
	      O[P] = Attributes.value;
	      Attributes = {
	        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
	        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
	        writable: false
	      };
	    }
	  } return $defineProperty(O, P, Attributes);
	} : $defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPropertyKey(P);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return $defineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError$7('Accessors not supported');
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

	var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;






	var wrapConstructor = function (NativeConstructor) {
	  var Wrapper = function (a, b, c) {
	    if (this instanceof Wrapper) {
	      switch (arguments.length) {
	        case 0: return new NativeConstructor();
	        case 1: return new NativeConstructor(a);
	        case 2: return new NativeConstructor(a, b);
	      } return new NativeConstructor(a, b, c);
	    } return functionApply(NativeConstructor, this, arguments);
	  };
	  Wrapper.prototype = NativeConstructor.prototype;
	  return Wrapper;
	};

	/*
	  options.target         - name of the target object
	  options.global         - target is the global object
	  options.stat           - export as static methods of target
	  options.proto          - export as prototype methods of target
	  options.real           - real prototype method for the `pure` version
	  options.forced         - export even if the native feature is available
	  options.bind           - bind methods to the target, required for the `pure` version
	  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
	  options.sham           - add a flag to not completely full polyfills
	  options.enumerable     - export as enumerable property
	  options.dontCallGetSet - prevent calling a getter on target
	  options.name           - the .name of the function if it does not match the key
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var PROTO = options.proto;

	  var nativeSource = GLOBAL ? global_1 : STATIC ? global_1[TARGET] : (global_1[TARGET] || {}).prototype;

	  var target = GLOBAL ? path : path[TARGET] || createNonEnumerableProperty(path, TARGET, {})[TARGET];
	  var targetPrototype = target.prototype;

	  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
	  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

	  for (key in source) {
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contains in native
	    USE_NATIVE = !FORCED && nativeSource && hasOwnProperty_1(nativeSource, key);

	    targetProperty = target[key];

	    if (USE_NATIVE) if (options.dontCallGetSet) {
	      descriptor = getOwnPropertyDescriptor(nativeSource, key);
	      nativeProperty = descriptor && descriptor.value;
	    } else nativeProperty = nativeSource[key];

	    // export native or implementation
	    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

	    if (USE_NATIVE && typeof targetProperty == typeof sourceProperty) continue;

	    // bind timers to global for call from export context
	    if (options.bind && USE_NATIVE) resultProperty = functionBindContext(sourceProperty, global_1);
	    // wrap global constructors for prevent changs in this version
	    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
	    // make static versions for prototype methods
	    else if (PROTO && isCallable(sourceProperty)) resultProperty = functionUncurryThis(sourceProperty);
	    // default case
	    else resultProperty = sourceProperty;

	    // add a flag to not completely full polyfills
	    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(resultProperty, 'sham', true);
	    }

	    createNonEnumerableProperty(target, key, resultProperty);

	    if (PROTO) {
	      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
	      if (!hasOwnProperty_1(path, VIRTUAL_PROTOTYPE)) {
	        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
	      }
	      // export virtual prototype methods
	      createNonEnumerableProperty(path[VIRTUAL_PROTOTYPE], key, sourceProperty);
	      // export real prototype methods
	      if (options.real && targetPrototype && !targetPrototype[key]) {
	        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
	      }
	    }
	  }
	};

	var ceil = Math.ceil;
	var floor$1 = Math.floor;

	// `Math.trunc` method
	// https://tc39.es/ecma262/#sec-math.trunc
	// eslint-disable-next-line es-x/no-math-trunc -- safe
	var mathTrunc = Math.trunc || function trunc(x) {
	  var n = +x;
	  return (n > 0 ? floor$1 : ceil)(n);
	};

	// `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity
	var toIntegerOrInfinity = function (argument) {
	  var number = +argument;
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return number !== number || number === 0 ? 0 : mathTrunc(number);
	};

	var max$3 = Math.max;
	var min$2 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toIntegerOrInfinity(index);
	  return integer < 0 ? max$3(integer + length, 0) : min$2(integer, length);
	};

	var min$1 = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min$1(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	// `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike
	var lengthOfArrayLike = function (obj) {
	  return toLength(obj.length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod$4 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = lengthOfArrayLike(O);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod$4(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$4(false)
	};

	var hiddenKeys = {};

	var indexOf$5 = arrayIncludes.indexOf;


	var push$3 = functionUncurryThis([].push);

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !hasOwnProperty_1(hiddenKeys, key) && hasOwnProperty_1(O, key) && push$3(result, key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (hasOwnProperty_1(O, key = names[i++])) {
	    ~indexOf$5(result, key) || push$3(result, key);
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
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es-x/no-object-keys -- safe
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// eslint-disable-next-line es-x/no-object-getownpropertysymbols -- safe
	var f$1 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$1
	};

	// eslint-disable-next-line es-x/no-object-assign -- safe
	var $assign = Object.assign;
	// eslint-disable-next-line es-x/no-object-defineproperty -- required for testing
	var defineProperty$7 = Object.defineProperty;
	var concat$1 = functionUncurryThis([].concat);

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	var objectAssign = !$assign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && $assign({ b: 1 }, $assign(defineProperty$7({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$7(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line es-x/no-symbol -- safe
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? concat$1(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || functionCall(propertyIsEnumerable, S, key)) T[key] = S[key];
	    }
	  } return T;
	} : $assign;

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	// eslint-disable-next-line es-x/no-object-assign -- required for testing
	_export({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== objectAssign }, {
	  assign: objectAssign
	});

	var assign$2 = path.Object.assign;

	var assign$1 = assign$2;

	var assign = assign$1;

	var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	var keys$3 = path.Object.keys;

	var keys$2 = keys$3;

	var keys$1 = keys$2;

	var defineProperty$6 = objectDefineProperty.f;

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	// eslint-disable-next-line es-x/no-object-defineproperty -- safe
	_export({ target: 'Object', stat: true, forced: Object.defineProperty !== defineProperty$6, sham: !descriptors }, {
	  defineProperty: defineProperty$6
	});

	var defineProperty_1 = createCommonjsModule(function (module) {
	var Object = path.Object;

	var defineProperty = module.exports = function defineProperty(it, key, desc) {
	  return Object.defineProperty(it, key, desc);
	};

	if (Object.defineProperty.sham) defineProperty.sham = true;
	});

	var defineProperty$5 = defineProperty_1;

	var defineProperty$4 = defineProperty$5;

	var defineProperty$3 = defineProperty$4;

	var defineProperty$2 = defineProperty$3;

	var defineProperty$1 = defineProperty$2;

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    defineProperty$1(obj, key, {
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

	var iterators = {};

	var functionToString = functionUncurryThis(Function.toString);

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable(sharedStore.inspectSource)) {
	  sharedStore.inspectSource = function (it) {
	    return functionToString(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap$1 = global_1.WeakMap;

	var nativeWeakMap = isCallable(WeakMap$1) && /native code/.test(inspectSource(WeakMap$1));

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$6 = global_1.TypeError;
	var WeakMap = global_1.WeakMap;
	var set, get, has;

	var enforce = function (it) {
	  return has(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError$6('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap || sharedStore.state) {
	  var store = sharedStore.state || (sharedStore.state = new WeakMap());
	  var wmget = functionUncurryThis(store.get);
	  var wmhas = functionUncurryThis(store.has);
	  var wmset = functionUncurryThis(store.set);
	  set = function (it, metadata) {
	    if (wmhas(store, it)) throw new TypeError$6(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    wmset(store, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget(store, it) || {};
	  };
	  has = function (it) {
	    return wmhas(store, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    if (hasOwnProperty_1(it, STATE)) throw new TypeError$6(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return hasOwnProperty_1(it, STATE) ? it[STATE] : {};
	  };
	  has = function (it) {
	    return hasOwnProperty_1(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var FunctionPrototype$1 = Function.prototype;
	// eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
	var getDescriptor = descriptors && Object.getOwnPropertyDescriptor;

	var EXISTS = hasOwnProperty_1(FunctionPrototype$1, 'name');
	// additional protection from minified / mangled / dropped function names
	var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
	var CONFIGURABLE = EXISTS && (!descriptors || (descriptors && getDescriptor(FunctionPrototype$1, 'name').configurable));

	var functionName = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es-x/no-object-defineproperties -- safe
	var f = descriptors && !v8PrototypeDefineBug ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var props = toIndexedObject(Properties);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], props[key]);
	  return O;
	};

	var objectDefineProperties = {
		f: f
	};

	var html = getBuiltIn('document', 'documentElement');

	/* global ActiveXObject -- old IE, WSH */








	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO$1 = sharedKey('IE_PROTO');

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
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = typeof document != 'undefined'
	    ? document.domain && activeXDocument
	      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	      : NullProtoObjectViaIFrame()
	    : NullProtoObjectViaActiveX(activeXDocument); // WSH
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO$1] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	// eslint-disable-next-line es-x/no-object-create -- safe
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties.f(result, Properties);
	};

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  // eslint-disable-next-line es-x/no-object-getprototypeof -- required for testing
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO = sharedKey('IE_PROTO');
	var Object$2 = global_1.Object;
	var ObjectPrototype = Object$2.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	var objectGetPrototypeOf = correctPrototypeGetter ? Object$2.getPrototypeOf : function (O) {
	  var object = toObject(O);
	  if (hasOwnProperty_1(object, IE_PROTO)) return object[IE_PROTO];
	  var constructor = object.constructor;
	  if (isCallable(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  } return object instanceof Object$2 ? ObjectPrototype : null;
	};

	var defineBuiltIn = function (target, key, value, options) {
	  if (options && options.enumerable) target[key] = value;
	  else createNonEnumerableProperty(target, key, value);
	  return target;
	};

	var ITERATOR$6 = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS$1 = false;

	// `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype$1, PrototypeOfArrayIteratorPrototype, arrayIterator;

	/* eslint-disable es-x/no-array-prototype-keys -- safe */
	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$1 = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$1 == undefined || fails(function () {
	  var test = {};
	  // FF44- legacy iterators case
	  return IteratorPrototype$1[ITERATOR$6].call(test) !== test;
	});

	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$1 = {};
	else IteratorPrototype$1 = objectCreate(IteratorPrototype$1);

	// `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
	if (!isCallable(IteratorPrototype$1[ITERATOR$6])) {
	  defineBuiltIn(IteratorPrototype$1, ITERATOR$6, function () {
	    return this;
	  });
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$1,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
	};

	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var test$1 = {};

	test$1[TO_STRING_TAG$3] = 'z';

	var toStringTagSupport = String(test$1) === '[object z]';

	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
	var Object$1 = global_1.Object;

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
	    : typeof (tag = tryGet(O = Object$1(it), TO_STRING_TAG$2)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && isCallable(O.callee) ? 'Arguments' : result;
	};

	// `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	var defineProperty = objectDefineProperty.f;





	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC, SET_METHOD) {
	  if (it) {
	    var target = STATIC ? it : it.prototype;
	    if (!hasOwnProperty_1(target, TO_STRING_TAG$1)) {
	      defineProperty(target, TO_STRING_TAG$1, { configurable: true, value: TAG });
	    }
	    if (SET_METHOD && !toStringTagSupport) {
	      createNonEnumerableProperty(target, 'toString', objectToString);
	    }
	  }
	};

	var IteratorPrototype = iteratorsCore.IteratorPrototype;





	var returnThis$1 = function () { return this; };

	var createIteratorConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype, { next: createPropertyDescriptor(+!ENUMERABLE_NEXT, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
	  iterators[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var String$2 = global_1.String;
	var TypeError$5 = global_1.TypeError;

	var aPossiblePrototype = function (argument) {
	  if (typeof argument == 'object' || isCallable(argument)) return argument;
	  throw TypeError$5("Can't set " + String$2(argument) + ' as a prototype');
	};

	/* eslint-disable no-proto -- safe */




	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	// eslint-disable-next-line es-x/no-object-setprototypeof -- safe
	Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    // eslint-disable-next-line es-x/no-object-getownpropertydescriptor -- safe
	    setter = functionUncurryThis(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
	    setter(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var PROPER_FUNCTION_NAME$1 = functionName.PROPER;
	var BUGGY_SAFARI_ITERATORS = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$5 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$5]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
	      iterators[TO_STRING_TAG] = returnThis;
	    }
	  }

	  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
	  if (PROPER_FUNCTION_NAME$1 && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    {
	      INCORRECT_VALUES_NAME = true;
	      defaultIterator = function values() { return functionCall(nativeIterator, this); };
	    }
	  }

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        defineBuiltIn(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
	  }

	  // define iterator
	  if ((FORCED) && IterablePrototype[ITERATOR$5] !== defaultIterator) {
	    defineBuiltIn(IterablePrototype, ITERATOR$5, defaultIterator, { name: DEFAULT });
	  }
	  iterators[NAME] = defaultIterator;

	  return methods;
	};

	objectDefineProperty.f;




	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$1 = internalState.set;
	var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.es/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.es/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.es/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.es/ecma262/#sec-createarrayiterator
	defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState$1(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
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
	// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.es/ecma262/#sec-createmappedargumentsobject
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

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  if (CollectionPrototype && classof(CollectionPrototype) !== TO_STRING_TAG) {
	    createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
	  }
	  iterators[COLLECTION_NAME] = iterators.Array;
	}

	// `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es-x/no-array-isarray -- safe
	var isArray$3 = Array.isArray || function isArray(argument) {
	  return classofRaw(argument) == 'Array';
	};

	var noop = function () { /* empty */ };
	var empty = [];
	var construct$1 = getBuiltIn('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec$2 = functionUncurryThis(constructorRegExp.exec);
	var INCORRECT_TO_STRING = !constructorRegExp.exec(noop);

	var isConstructorModern = function isConstructor(argument) {
	  if (!isCallable(argument)) return false;
	  try {
	    construct$1(noop, empty, argument);
	    return true;
	  } catch (error) {
	    return false;
	  }
	};

	var isConstructorLegacy = function isConstructor(argument) {
	  if (!isCallable(argument)) return false;
	  switch (classof(argument)) {
	    case 'AsyncFunction':
	    case 'GeneratorFunction':
	    case 'AsyncGeneratorFunction': return false;
	  }
	  try {
	    // we can't check .prototype since constructors produced by .bind haven't it
	    // `Function#toString` throws on some built-it function in some legacy engines
	    // (for example, `DOMQuad` and similar in FF41-)
	    return INCORRECT_TO_STRING || !!exec$2(constructorRegExp, inspectSource(argument));
	  } catch (error) {
	    return true;
	  }
	};

	isConstructorLegacy.sham = true;

	// `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor
	var isConstructor = !construct$1 || fails(function () {
	  var called;
	  return isConstructorModern(isConstructorModern.call)
	    || !isConstructorModern(Object)
	    || !isConstructorModern(function () { called = true; })
	    || called;
	}) ? isConstructorLegacy : isConstructorModern;

	var SPECIES$2 = wellKnownSymbol('species');
	var Array$4 = global_1.Array;

	// a part of `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesConstructor = function (originalArray) {
	  var C;
	  if (isArray$3(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (isConstructor(C) && (C === Array$4 || isArray$3(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES$2];
	      if (C === null) C = undefined;
	    }
	  } return C === undefined ? Array$4 : C;
	};

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
	};

	var push$2 = functionUncurryThis([].push);

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
	var createMethod$3 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var IS_FILTER_REJECT = TYPE == 7;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that);
	    var length = lengthOfArrayLike(self);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
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
	          case 2: push$2(target, value);      // filter
	        } else switch (TYPE) {
	          case 4: return false;             // every
	          case 7: push$2(target, value);      // filterReject
	        }
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.es/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$3(0),
	  // `Array.prototype.map` method
	  // https://tc39.es/ecma262/#sec-array.prototype.map
	  map: createMethod$3(1),
	  // `Array.prototype.filter` method
	  // https://tc39.es/ecma262/#sec-array.prototype.filter
	  filter: createMethod$3(2),
	  // `Array.prototype.some` method
	  // https://tc39.es/ecma262/#sec-array.prototype.some
	  some: createMethod$3(3),
	  // `Array.prototype.every` method
	  // https://tc39.es/ecma262/#sec-array.prototype.every
	  every: createMethod$3(4),
	  // `Array.prototype.find` method
	  // https://tc39.es/ecma262/#sec-array.prototype.find
	  find: createMethod$3(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$3(6),
	  // `Array.prototype.filterReject` method
	  // https://github.com/tc39/proposal-array-filtering
	  filterReject: createMethod$3(7)
	};

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call -- required for testing
	    method.call(null, argument || function () { return 1; }, 1);
	  });
	};

	var $forEach = arrayIteration.forEach;


	var STRICT_METHOD$2 = arrayMethodIsStrict('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	var arrayForEach = !STRICT_METHOD$2 ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	// eslint-disable-next-line es-x/no-array-prototype-foreach -- safe
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	// eslint-disable-next-line es-x/no-array-prototype-foreach -- safe
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	var entryVirtual = function (CONSTRUCTOR) {
	  return path[CONSTRUCTOR + 'Prototype'];
	};

	var forEach$3 = entryVirtual('Array').forEach;

	var forEach$2 = forEach$3;

	var ArrayPrototype$a = Array.prototype;

	var DOMIterables = {
	  DOMTokenList: true,
	  NodeList: true
	};

	var forEach$1 = function (it) {
	  var own = it.forEach;
	  return it === ArrayPrototype$a || (objectIsPrototypeOf(ArrayPrototype$a, it) && own === ArrayPrototype$a.forEach)
	    || hasOwnProperty_1(DOMIterables, classof(it)) ? forEach$2 : own;
	};

	var forEach = forEach$1;

	var $includes = arrayIncludes.includes;



	// FF99+ bug
	var BROKEN_ON_SPARSE = fails(function () {
	  return !Array(1).includes();
	});

	// `Array.prototype.includes` method
	// https://tc39.es/ecma262/#sec-array.prototype.includes
	_export({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var includes$4 = entryVirtual('Array').includes;

	var MATCH$1 = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.es/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH$1]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var TypeError$4 = global_1.TypeError;

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw TypeError$4("The method doesn't accept regular expressions");
	  } return it;
	};

	var String$1 = global_1.String;

	var toString_1 = function (argument) {
	  if (classof(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
	  return String$1(argument);
	};

	var MATCH = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (error1) {
	    try {
	      regexp[MATCH] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (error2) { /* empty */ }
	  } return false;
	};

	var stringIndexOf = functionUncurryThis(''.indexOf);

	// `String.prototype.includes` method
	// https://tc39.es/ecma262/#sec-string.prototype.includes
	_export({ target: 'String', proto: true, forced: !correctIsRegexpLogic('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~stringIndexOf(
	      toString_1(requireObjectCoercible(this)),
	      toString_1(notARegexp(searchString)),
	      arguments.length > 1 ? arguments[1] : undefined
	    );
	  }
	});

	var includes$3 = entryVirtual('String').includes;

	var ArrayPrototype$9 = Array.prototype;
	var StringPrototype$1 = String.prototype;

	var includes$2 = function (it) {
	  var own = it.includes;
	  if (it === ArrayPrototype$9 || (objectIsPrototypeOf(ArrayPrototype$9, it) && own === ArrayPrototype$9.includes)) return includes$4;
	  if (typeof it == 'string' || it === StringPrototype$1 || (objectIsPrototypeOf(StringPrototype$1, it) && own === StringPrototype$1.includes)) {
	    return includes$3;
	  } return own;
	};

	var includes$1 = includes$2;

	var includes = includes$1;

	var arraySlice = functionUncurryThis([].slice);

	var Function$2 = global_1.Function;
	var concat = functionUncurryThis([].concat);
	var join = functionUncurryThis([].join);
	var factories = {};

	var construct = function (C, argsLength, args) {
	  if (!hasOwnProperty_1(factories, argsLength)) {
	    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
	    factories[argsLength] = Function$2('C,a', 'return new C(' + join(list, ',') + ')');
	  } return factories[argsLength](C, args);
	};

	// `Function.prototype.bind` method implementation
	// https://tc39.es/ecma262/#sec-function.prototype.bind
	var functionBind = functionBindNative ? Function$2.bind : function bind(that /* , ...args */) {
	  var F = aCallable(this);
	  var Prototype = F.prototype;
	  var partArgs = arraySlice(arguments, 1);
	  var boundFunction = function bound(/* args... */) {
	    var args = concat(partArgs, arraySlice(arguments));
	    return this instanceof boundFunction ? construct(F, args.length, args) : F.apply(that, args);
	  };
	  if (isObject(Prototype)) boundFunction.prototype = Prototype;
	  return boundFunction;
	};

	// TODO: Remove from `core-js@4`



	// `Function.prototype.bind` method
	// https://tc39.es/ecma262/#sec-function.prototype.bind
	_export({ target: 'Function', proto: true, forced: Function.bind !== functionBind }, {
	  bind: functionBind
	});

	var bind$3 = entryVirtual('Function').bind;

	var FunctionPrototype = Function.prototype;

	var bind$2 = function (it) {
	  var own = it.bind;
	  return it === FunctionPrototype || (objectIsPrototypeOf(FunctionPrototype, it) && own === FunctionPrototype.bind) ? bind$3 : own;
	};

	var bind$1 = bind$2;

	var bind = bind$1;

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

	var $filter = arrayIteration.filter;


	var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('filter');

	// `Array.prototype.filter` method
	// https://tc39.es/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var filter$4 = entryVirtual('Array').filter;

	var ArrayPrototype$8 = Array.prototype;

	var filter$3 = function (it) {
	  var own = it.filter;
	  return it === ArrayPrototype$8 || (objectIsPrototypeOf(ArrayPrototype$8, it) && own === ArrayPrototype$8.filter) ? filter$4 : own;
	};

	var filter$2 = filter$3;

	var filter$1 = filter$2;

	function addEventListenerFor(el, selector, type, listener, options) {
	  el.addEventListener(type, e => {
	    if (e.target.matches(selector)) {
	      e.delegateTarget = e.target;
	      listener(e);
	    } else if (e.target.closest(selector)) {
	      e.delegateTarget = e.target.closest(selector);
	      listener(e);
	    }
	  }, options);
	}

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
	      } else {
	        return;
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

	      case 'content':
	      case 'children':
	        append(el, value);
	        return;
	    }

	    el.setAttribute(key, value);
	  });
	  return el;
	}

	function insertBefore(anchor, el) {
	  if (Array.isArray(el) || el instanceof NodeList || el instanceof HTMLCollection) {
	    Array.from(el).reverse().forEach(x => {
	      anchor = insertBefore(anchor, x);
	    });
	  } else if (Array.isArray(anchor) || anchor instanceof NodeList || anchor instanceof HTMLCollection) {
	    return insertBefore(anchor[0], el);
	  } else if (anchor.parentNode) {
	    if (!(el instanceof Node)) {
	      el = new Text(el);
	    }

	    anchor.parentNode.insertBefore(el, anchor);
	    return el;
	  } else {
	    throw 'argument of insertBefore unsupported';
	  }
	}

	function append(el, item, escape, context, method) {
	  if (!method) method = 'append';

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
	      el[method](holder);
	      new Date().getMilliseconds();
	      return item.then(resolvedItem => {
	        append(holder, resolvedItem, escape, context);
	        insertBefore(holder, holder.childNodes);
	        holder.parentNode.removeChild(holder);
	      });
	    } else if (item instanceof Element || item instanceof Node) {
	      return el[method](item);
	    } else if (item === null || item === undefined) ; else if (typeof item == "function") {
	      return append(el, item.bind(context)(el), escape, context);
	    } else if (typeof item == "object") {
	      return el[method](createElement(item));
	    } else {
	      if (escape) {
	        return el[method](item);
	      } else {
	        const container = document.createElement('div');
	        container.innerHTML = item;
	        return el[method](...container.childNodes);
	      }
	    }
	  }
	}

	function css(el, rule) {
	  return getComputedStyle(el)[rule];
	}

	function filter(nodes, predicate) {
	  const filteredNodes = [];
	  nodes.forEach(node => {
	    if (predicate(node)) filteredNodes.push(node);
	  });
	  return filteredNodes;
	}

	function getBoundingClientRect(...els) {
	  if (Array.isArray(els[0]) && els.length == 1) {
	    els = els[0];
	  }

	  let rect = els[0].getBoundingClientRect();
	  rect = {
	    left: rect.left,
	    top: rect.top,
	    right: rect.right,
	    bottom: rect.bottom
	  };
	  els.slice(1).forEach(el => {
	    const thisRect = el.getBoundingClientRect();
	    if (thisRect.left < rect.left) rect.left = thisRect.left;
	    if (thisRect.top < rect.top) rect.top = thisRect.top;
	    if (thisRect.bottom > rect.bottom) rect.bottom = thisRect.bottom;
	    if (thisRect.right > rect.right) rect.right = thisRect.right;
	  });
	  return new DOMRect(rect.left, rect.top, rect.right - rect.left, rect.bottom - rect.top);
	}

	function isEmpty(element) {
	  return element.innerHTML === "";
	}

	function isVisible(el) {
	  return el.offsetParent !== null;
	}

	function listenerElement(...args) {
	  let callback = args.pop();
	  let listener = args.pop();

	  if (typeof listener != 'string') {
	    args = args.concat(listener);
	    listener = 'click';
	  }

	  const el = createElement(...args);
	  el.addEventListener(listener, callback);
	  return el;
	}

	function offsetTo(el, target) {
	  const elRect = getBoundingClientRect(el);
	  const targetRect = target.getBoundingClientRect();
	  return {
	    top: elRect.top - targetRect.top,
	    left: elRect.left - targetRect.left,
	    right: elRect.right - targetRect.left,
	    bottom: elRect.bottom - targetRect.top
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
	  return el.dispatchEvent(event);
	}

	/*
	    TODO
	    ---
	    - call remove via Mutation Observer
	*/

	function uniqueId(prefix) {
	  window.idCounter || (window.idCounter = 0);
	  var id = ++window.idCounter + '';
	  return prefix ? prefix + id : id;
	}
	class Component {
	  constructor(options) {
	    var _context, _context2;

	    options = options || {};
	    this.eventListens = new Array();
	    this.eventListeners = new Array();
	    const htmlAttributes = {};

	    forEach(_context = keys$1(options)).call(_context, key => {
	      if (includes(HTML_ATTRIBUTES).call(HTML_ATTRIBUTES, key)) {
	        htmlAttributes[key] = options[key];
	      }
	    });

	    delete htmlAttributes.content;
	    this.el = options.el || createElement(options.tagName || this.constructor.tagName, htmlAttributes);

	    if (this.constructor.className) {
	      this.el.classList.add(...this.constructor.className.split(' '));
	    }

	    this.cid = uniqueId('c');

	    this.on = function (type, handler) {
	      this.eventListeners.push({
	        type: type,
	        handler: handler
	      });
	    };

	    this.off = bind(_context2 = function (type, handler) {
	      var _context3;

	      if (!this.eventListeners) return;
	      this.eventListeners = filter$1(_context3 = this.eventListeners).call(_context3, function (listener) {
	        return !(listener.type == type && listener.handler);
	      });
	    }).call(_context2, this);

	    this.trigger = function (event_key) {
	      var _context4;

	      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      if (!this.eventListeners) return;

	      forEach(_context4 = this.eventListeners).call(_context4, listener => {
	        if (listener.type == "*" || listener.type == "all" || event_key == listener.type) {
	          args.push(this);

	          if (event_key != listener.type) {
	            args.unshift(event_key);
	          }

	          listener.handler(...args);
	        }
	      });
	    };

	    if (options.initialize !== false) {
	      this.initialize(options);
	    }
	  }

	  addEventListener() {
	    this.on.apply(this, arguments);
	  }

	  removeEventListener() {
	    this.off.apply(this, arguments);
	  }

	  pick(object, keys) {
	    var newObject = {};

	    forEach(keys).call(keys, function (key) {
	      if (object[key] !== undefined) newObject[key] = object[key];
	    });

	    return newObject;
	  }
	  /*
	  listenTo(el, 'click', '.inner_class', f(), this)
	  listenTo(el, 'click', f(), this)
	  */


	  listenTo(node, event, scope, callback, context) {
	    var _context5;

	    // scope is optional param
	    if (typeof node == "string") {
	      context = callback;
	      callback = scope;
	      scope = event;
	      event = node;
	      node = this.el;
	    }

	    if (typeof scope != "string") {
	      context = callback;
	      callback = scope;
	      scope = false;
	    }

	    context || (context = this);
	    var listen = [node, event, bind(_context5 = function (e) {
	      if (!scope || e.target.matches(scope) || e.target.closest(scope)) {
	        return bind(callback).call(callback, context)(...arguments);
	      }
	    }).call(_context5, context)];
	    this.eventListens.push(listen);
	    node.addEventListener(event, listen[2]);
	  }

	  listenToOnce(node, event, callback, context) {
	    context || (context = this);

	    var onceCallback = function (e) {
	      node.removeEventListener(event, onceCallback);
	      return callback.apply(context, arguments);
	    };

	    var listen = [node, event, onceCallback];
	    this.eventListens.push(listen);
	    node.addEventListener(event, onceCallback);
	  }

	  remove() {
	    var _context6;

	    this.trigger('removed');
	    if (this.eventListens) forEach(_context6 = this.eventListens).call(_context6, function (listen) {
	      listen[0].removeEventListener(listen[1], listen[2]);
	    });
	    delete this.eventListens;
	    delete this.eventListeners;
	    if (this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
	    delete this.el;
	  }

	  initialize() {}

	}

	_defineProperty(Component, "tagName", 'div');

	_defineProperty(Component, "className", void 0);

	var $map = arrayIteration.map;


	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('map');

	// `Array.prototype.map` method
	// https://tc39.es/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var map$3 = entryVirtual('Array').map;

	var ArrayPrototype$7 = Array.prototype;

	var map$2 = function (it) {
	  var own = it.map;
	  return it === ArrayPrototype$7 || (objectIsPrototypeOf(ArrayPrototype$7, it) && own === ArrayPrototype$7.map) ? map$3 : own;
	};

	var map$1 = map$2;

	var map = map$1;

	// a string of all valid unicode whitespaces
	var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
	  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var replace$1 = functionUncurryThis(''.replace);
	var whitespace = '[' + whitespaces + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$2 = function (TYPE) {
	  return function ($this) {
	    var string = toString_1(requireObjectCoercible($this));
	    if (TYPE & 1) string = replace$1(string, ltrim, '');
	    if (TYPE & 2) string = replace$1(string, rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$2(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimend
	  end: createMethod$2(2),
	  // `String.prototype.trim` method
	  // https://tc39.es/ecma262/#sec-string.prototype.trim
	  trim: createMethod$2(3)
	};

	var trim$5 = stringTrim.trim;


	var charAt$3 = functionUncurryThis(''.charAt);
	var n$ParseFloat = global_1.parseFloat;
	var Symbol$2 = global_1.Symbol;
	var ITERATOR$4 = Symbol$2 && Symbol$2.iterator;
	var FORCED$2 = 1 / n$ParseFloat(whitespaces + '-0') !== -Infinity
	  // MS Edge 18- broken with boxed symbols
	  || (ITERATOR$4 && !fails(function () { n$ParseFloat(Object(ITERATOR$4)); }));

	// `parseFloat` method
	// https://tc39.es/ecma262/#sec-parsefloat-string
	var numberParseFloat = FORCED$2 ? function parseFloat(string) {
	  var trimmedString = trim$5(toString_1(string));
	  var result = n$ParseFloat(trimmedString);
	  return result === 0 && charAt$3(trimmedString, 0) == '-' ? -0 : result;
	} : n$ParseFloat;

	// `parseFloat` method
	// https://tc39.es/ecma262/#sec-parsefloat-string
	_export({ global: true, forced: parseFloat != numberParseFloat }, {
	  parseFloat: numberParseFloat
	});

	var _parseFloat$2 = path.parseFloat;

	var _parseFloat$1 = _parseFloat$2;

	var _parseFloat = _parseFloat$1;

	var trim$4 = stringTrim.trim;


	var $parseInt = global_1.parseInt;
	var Symbol$1 = global_1.Symbol;
	var ITERATOR$3 = Symbol$1 && Symbol$1.iterator;
	var hex = /^[+-]?0x/i;
	var exec$1 = functionUncurryThis(hex.exec);
	var FORCED$1 = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22
	  // MS Edge 18- broken with boxed symbols
	  || (ITERATOR$3 && !fails(function () { $parseInt(Object(ITERATOR$3)); }));

	// `parseInt` method
	// https://tc39.es/ecma262/#sec-parseint-string-radix
	var numberParseInt = FORCED$1 ? function parseInt(string, radix) {
	  var S = trim$4(toString_1(string));
	  return $parseInt(S, (radix >>> 0) || (exec$1(hex, S) ? 16 : 10));
	} : $parseInt;

	// `parseInt` method
	// https://tc39.es/ecma262/#sec-parseint-string-radix
	_export({ global: true, forced: parseInt != numberParseInt }, {
	  parseInt: numberParseInt
	});

	var _parseInt$2 = path.parseInt;

	var _parseInt$1 = _parseInt$2;

	var _parseInt = _parseInt$1;

	var TypeError$3 = global_1.TypeError;

	var validateArgumentsLength = function (passed, required) {
	  if (passed < required) throw TypeError$3('Not enough arguments');
	  return passed;
	};

	var MSIE = /MSIE .\./.test(engineUserAgent); // <- dirty ie9- check
	var Function$1 = global_1.Function;

	var wrap = function (scheduler) {
	  return MSIE ? function (handler, timeout /* , ...arguments */) {
	    var boundArgs = validateArgumentsLength(arguments.length, 1) > 2;
	    var fn = isCallable(handler) ? handler : Function$1(handler);
	    var args = boundArgs ? arraySlice(arguments, 2) : undefined;
	    return scheduler(boundArgs ? function () {
	      functionApply(fn, this, args);
	    } : fn, timeout);
	  } : scheduler;
	};

	// ie9- setTimeout & setInterval additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
	var schedulersFix = {
	  // `setTimeout` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
	  setTimeout: wrap(global_1.setTimeout),
	  // `setInterval` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
	  setInterval: wrap(global_1.setInterval)
	};

	var setInterval = schedulersFix.setInterval;

	// ie9- setInterval additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
	_export({ global: true, bind: true, forced: global_1.setInterval !== setInterval }, {
	  setInterval: setInterval
	});

	var setTimeout$2 = schedulersFix.setTimeout;

	// ie9- setTimeout additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
	_export({ global: true, bind: true, forced: global_1.setTimeout !== setTimeout$2 }, {
	  setTimeout: setTimeout$2
	});

	var setTimeout$1 = path.setTimeout;

	var setTimeout = setTimeout$1;

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
	    transition:     string (reference transition classes in utilities)
	*/

	class Popover extends Component {
	  initialize(options) {
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
	      },
	      transition: false
	    };

	    assign(this.options, this.pick(options, keys$1(this.options)));

	    this.el.removeAttribute('content');
	    this.options.anchor.popover = this;
	    this.listenTo(document, 'click', this.checkFocus);
	    this.listenTo(document, 'focusin', this.checkFocus);
	    this.listenTo(document, 'keyup', this.checkEscape);
	    this.listenTo(window, 'resize', () => {
	      var _context;

	      bind(_context = this.resize).call(_context, this)();
	    });

	    if (typeof this.options.container == "string") {
	      this.options.container = this.options.anchor.closest(this.options.container);
	    }

	    this.options.container = this.options.container || document.body;
	  }

	  append() {
	    this.options.container.appendChild(this.el);
	  }

	  render() {
	    this.showing = true;
	    this.el.style.position = 'absolute';
	    this.el.style.zIndex = this.options.zIndex;
	    this.content = document.createElement('div');

	    if (this.options.transition) {
	      this.content.classList.add(this.options.transition, '-out');
	    }

	    append(this.el, this.content);
	    append(this.content, this.options.content);
	    this.append();
	    this.resize();

	    if (this.options.transition) {
	      var _context2;

	      this.content.classList.remove('-out');
	      this.transitionDuration = Math.max(...map(_context2 = css(this.content, 'transition-duration').split(", ")).call(_context2, x => _parseFloat(x))) * 1000;
	    }

	    this.trigger('shown');
	    return this;
	  }

	  resize() {
	    this.setPosition();
	    let bounds = this.el.getBoundingClientRect();
	    const body_bounds = document.body.getBoundingClientRect();
	    const window_bounds = {
	      top: 0,
	      bottom: window.innerHeight,
	      left: 0,
	      right: window.innerWidth
	    };

	    if (bounds.bottom > Math.max(body_bounds.bottom, window_bounds.bottom)) {
	      var [leftAlign, topAlign] = this.options.align.split(" ");
	      this.setPosition(`${leftAlign} top`);
	      bounds = this.el.getBoundingClientRect();

	      if (bounds.top < 0) {
	        this.setPosition(`${leftAlign} bottom`);
	      }

	      bounds = this.el.getBoundingClientRect();
	    }

	    if (bounds.top < body_bounds.top) {
	      const difference = body_bounds.top - bounds.top;
	      if (this.el.style.top != null) this.el.style.top = _parseInt(this.el.style.top) + difference + "px";
	      if (this.el.style.bottom != null) this.el.style.bottom = _parseInt(this.el.style.bottom) - difference + "px";
	    }

	    if (bounds.left < body_bounds.left) {
	      const difference = body_bounds.left - bounds.left;
	      if (this.el.style.left != null) this.el.style.left = _parseInt(this.el.style.left) + difference + "px";
	      if (this.el.style.right != null) this.el.style.right = _parseInt(this.el.style.right) - difference + "px";
	      bounds = this.el.getBoundingClientRect();
	    }

	    if (bounds.right > body_bounds.right) {
	      const difference = body_bounds.right - bounds.right;
	      if (this.el.style.left != null) this.el.style.left = _parseInt(this.el.style.left) + difference + "px";
	      if (this.el.style.right != null) this.el.style.right = _parseInt(this.el.style.right) - difference + "px";
	    }
	  }

	  setPosition(align) {
	    var _context3;

	    align = align || this.options.align;
	    var [leftAlign, topAlign] = align.split(" ");
	    leftAlign = leftAlign || "bottom";
	    var container = this.options.container;
	    var anchorOffset = offsetTo(this.options.anchor, container);
	    if (getComputedStyle(container)['position'] == "static") container = container.offsetParent;
	    if (!container) container = document.body;
	    var position = {};

	    if (leftAlign == 'left') {
	      position.right = outerWidth(container) - anchorOffset.left;
	    } else if (leftAlign == 'center') {
	      position.left = anchorOffset.left + outerWidth(this.options.anchor) / 2;
	      position.transform = "translateX(-50%)";
	    } else if (leftAlign == 'right') {
	      position.left = anchorOffset.left + outerWidth(this.options.anchor);
	    } else if (includes(leftAlign).call(leftAlign, "px")) {
	      position.left = anchorOffset.left + _parseInt(leftAlign);
	    }

	    if (topAlign == 'top') {
	      let height = outerHeight(container);

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
	    } else if (includes(topAlign).call(topAlign, "px")) {
	      position.top = anchorOffset.top + _parseInt(topAlign);
	    }

	    if (this.options.offset.left) position.left += _parseInt(this.options.offset.left);
	    if (this.options.offset.left) position.right -= _parseInt(this.options.offset.left);
	    if (this.options.offset.top) position.top += _parseInt(this.options.offset.top);
	    if (this.options.offset.top) position.bottom -= _parseInt(this.options.offset.top);
	    this.el.style.left = null;
	    this.el.style.right = null;
	    this.el.style.top = null;
	    this.el.style.bottom = null;
	    this.el.style.transform = null;
	    this.el.classList.remove('popover-left', 'popover-right', 'popover-center', 'popover-top', 'popover-bottom');
	    this.el.classList.add('popover-' + topAlign);
	    this.el.classList.add('popover-' + leftAlign);

	    forEach(_context3 = keys$1(position)).call(_context3, function (key) {
	      this.el.style[key] = position[key] + (key != "transform" ? "px" : "");
	    }, this);
	  }

	  checkFocus(e) {
	    if (e.defaultPrevented) return;
	    if (!this.showing) return;
	    if (e.target === this.el) return;
	    if (e.target == this.options.anchor) return;
	    if (this.el.contains(e.target)) return;
	    if (this.options.anchor.contains(e.target)) return;
	    if (this.persisting) return;
	    this.hide();
	  }

	  checkEscape(e) {
	    if (e.which != 27) return;
	    if (this.persisting) return;
	    this.hide();
	  }

	  isHidden() {
	    return !this.showing;
	  }

	  hide(options) {
	    options = options || {};
	    if (!this.showing) return;
	    this.content.classList.add('-out');
	    this.showing = false;

	    setTimeout(() => {
	      this.el.remove();

	      if (options.silent !== true) {
	        this.trigger('hidden');
	      }
	    }, this.transitionDuration || 0);
	  }

	  show() {
	    if (this.showing) return;
	    this.append();
	    this.resize();
	    this.content.classList.remove('-out');
	    this.showing = true;

	    setTimeout(() => {
	      this.trigger('shown');
	    }, this.transitionDuration || 0);
	  }

	  toggle(flag) {
	    flag = flag || this.showing;
	    if (flag) this.hide();else this.show();
	  }

	  persist() {
	    this.persisting = true;
	  }

	  unpersist() {
	    this.persisting = false;
	  }

	}

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

	class Dropdown extends Component {
	  initialize(options) {
	    this.el = options.anchor;
	    options = options || {};
	    this.options = {
	      align: 'center bottom',
	      container: document.body
	    };

	    assign(this.options, this.pick(options, keys$1(this.options)));

	    this.enabled = true;
	    this.active = false;
	    this.content = options.content;
	    this.el.dropdown = this;
	    this.listenTo(this.el, 'click', this.toggle);
	  }

	  remove() {
	    if (this.popup) this.popup.remove();
	    super.remove();
	  }

	  render() {
	    return this;
	  }

	  toggle() {
	    this.active = !this.active;

	    if (this.active) {
	      this.show();
	    } else {
	      this.hide();
	    }
	  }

	  show() {
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

	    this.trigger('shown');
	  }

	  hide() {
	    this.popup.remove();
	    delete this.popup;
	    this.hidden();
	  }

	  hidden() {
	    this.active = false;
	    this.el.classList.remove('-active');
	    this.trigger('hidden');
	  }

	  disable() {
	    this.enabled = false;
	  }

	  enabled() {
	    this.enabled = true;
	  }

	}

	/*  UniformModal.initialize
	    Options
	    content:    string|$el|function
	    klass:      string - classes to append to modal container

	    * use blurrable to keep some elements from being blurred ie. <div blurrable="false">...</div>
	*/

	class Modal extends Component {
	  initialize(options) {
	    this.options = {};
	    this.options.klass = options.klass || false;
	    this.content = options.content;
	    this.el.removeAttribute('content');
	    this.el.classList.add('uniformModal');
	    this.listenTo(document, 'keyup', this.keyup);
	    this.listenTo(this.el, 'click', this.checkClose);
	    this.el.modal = this;
	  }

	  keyup(e) {
	    if (e.which != 27) return;
	    this.close();
	  }

	  render() {
	    this.highest_z_index = 0;

	    if (document.body.querySelectorAll('.uniformModal').length > 0) {
	      this.highest_z_index = Math.max(map(Array.prototype).call(document.body.querySelectorAll('.uniformModal'), function (el) {
	        return _parseInt(css(el, 'zIndex'));
	      }));
	      this.el.style.zIndex = this.highest_z_index + 2;
	    }

	    document.body.classList.add('uniformModal-active');
	    document.body.appendChild(this.el);
	    const container = createElement('div', {
	      class: 'uniformModal-container',
	      children: this.content,
	      tabindex: 0
	    });
	    const closeButton = createElement('div', {
	      class: 'uniformModal-close-container',
	      children: {
	        class: 'uniformModal-close js-modal-close'
	      }
	    });
	    this.el.append(container);
	    this.el.append(closeButton);
	    const focusable = container.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');

	    if (focusable) {
	      focusable.focus();
	    } else {
	      container.focus();
	    }

	    if (this.options.klass) container.classList.add(this.options.klass);
	    if (this.content.innerHTML) trigger(this.content, 'rendered');
	    this.trigger('rendered');
	    return this;
	  }

	  checkClose(e) {
	    if (e.target.matches('.js-modal-close, .uniformModal')) {
	      this.close();
	    }
	  }

	  close() {
	    this.trigger('closed');
	    this.remove();

	    if (document.querySelectorAll('.uniformModal').length == 0) {
	      document.body.classList.remove('uniformModal-active');
	    }
	  }

	}

	// `Array.isArray` method
	// https://tc39.es/ecma262/#sec-array.isarray
	_export({ target: 'Array', stat: true }, {
	  isArray: isArray$3
	});

	var isArray$2 = path.Array.isArray;

	var isArray$1 = isArray$2;

	var isArray = isArray$1;

	var charAt$2 = functionUncurryThis(''.charAt);
	var charCodeAt$1 = functionUncurryThis(''.charCodeAt);
	var stringSlice = functionUncurryThis(''.slice);

	var createMethod$1 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString_1(requireObjectCoercible($this));
	    var position = toIntegerOrInfinity(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = charCodeAt$1(S, position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = charCodeAt$1(S, position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING
	          ? charAt$2(S, position)
	          : first
	        : CONVERT_TO_STRING
	          ? stringSlice(S, position, position + 2)
	          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$1(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$1(true)
	};

	var charAt$1 = stringMultibyte.charAt;




	var STRING_ITERATOR = 'String Iterator';
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState(this, {
	    type: STRING_ITERATOR,
	    string: toString_1(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = charAt$1(string, index);
	  state.index += point.length;
	  return { value: point, done: false };
	});

	var iteratorClose = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject(iterator);
	  try {
	    innerResult = getMethod(iterator, 'return');
	    if (!innerResult) {
	      if (kind === 'throw') throw value;
	      return value;
	    }
	    innerResult = functionCall(innerResult, iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }
	  if (kind === 'throw') throw value;
	  if (innerError) throw innerResult;
	  anObject(innerResult);
	  return value;
	};

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	  } catch (error) {
	    iteratorClose(iterator, 'throw', error);
	  }
	};

	var ITERATOR$2 = wellKnownSymbol('iterator');
	var ArrayPrototype$6 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$6[ITERATOR$2] === it);
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPropertyKey(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var ITERATOR$1 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return getMethod(it, ITERATOR$1)
	    || getMethod(it, '@@iterator')
	    || iterators[classof(it)];
	};

	var TypeError$2 = global_1.TypeError;

	var getIterator = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod(argument) : usingIterator;
	  if (aCallable(iteratorMethod)) return anObject(functionCall(iteratorMethod, argument));
	  throw TypeError$2(tryToString(argument) + ' is not iterable');
	};

	var Array$3 = global_1.Array;

	// `Array.from` method implementation
	// https://tc39.es/ecma262/#sec-array.from
	var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject(arrayLike);
	  var IS_CONSTRUCTOR = isConstructor(this);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
	  var iteratorMethod = getIteratorMethod(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod && !(this == Array$3 && isArrayIteratorMethod(iteratorMethod))) {
	    iterator = getIterator(O, iteratorMethod);
	    next = iterator.next;
	    result = IS_CONSTRUCTOR ? new this() : [];
	    for (;!(step = functionCall(next, iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
	      createProperty(result, index, value);
	    }
	  } else {
	    length = lengthOfArrayLike(O);
	    result = IS_CONSTRUCTOR ? new this(length) : Array$3(length);
	    for (;length > index; index++) {
	      value = mapping ? mapfn(O[index], index) : O[index];
	      createProperty(result, index, value);
	    }
	  }
	  result.length = index;
	  return result;
	};

	var ITERATOR = wellKnownSymbol('iterator');
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
	  iteratorWithReturn[ITERATOR] = function () {
	    return this;
	  };
	  // eslint-disable-next-line es-x/no-array-from, no-throw-literal -- required for testing
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR] = function () {
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
	  // eslint-disable-next-line es-x/no-array-from -- required for testing
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.es/ecma262/#sec-array.from
	_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
	  from: arrayFrom
	});

	var from_1$2 = path.Array.from;

	var from_1$1 = from_1$2;

	var from_1 = from_1$1;

	var Array$2 = global_1.Array;
	var max$2 = Math.max;

	var arraySliceSimple = function (O, start, end) {
	  var length = lengthOfArrayLike(O);
	  var k = toAbsoluteIndex(start, length);
	  var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	  var result = Array$2(max$2(fin - k, 0));
	  for (var n = 0; k < fin; k++, n++) createProperty(result, n, O[k]);
	  result.length = n;
	  return result;
	};

	var floor = Math.floor;

	var mergeSort = function (array, comparefn) {
	  var length = array.length;
	  var middle = floor(length / 2);
	  return length < 8 ? insertionSort(array, comparefn) : merge(
	    array,
	    mergeSort(arraySliceSimple(array, 0, middle), comparefn),
	    mergeSort(arraySliceSimple(array, middle), comparefn),
	    comparefn
	  );
	};

	var insertionSort = function (array, comparefn) {
	  var length = array.length;
	  var i = 1;
	  var element, j;

	  while (i < length) {
	    j = i;
	    element = array[i];
	    while (j && comparefn(array[j - 1], element) > 0) {
	      array[j] = array[--j];
	    }
	    if (j !== i++) array[j] = element;
	  } return array;
	};

	var merge = function (array, left, right, comparefn) {
	  var llength = left.length;
	  var rlength = right.length;
	  var lindex = 0;
	  var rindex = 0;

	  while (lindex < llength || rindex < rlength) {
	    array[lindex + rindex] = (lindex < llength && rindex < rlength)
	      ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
	      : lindex < llength ? left[lindex++] : right[rindex++];
	  } return array;
	};

	var arraySort = mergeSort;

	var firefox = engineUserAgent.match(/firefox\/(\d+)/i);

	var engineFfVersion = !!firefox && +firefox[1];

	var engineIsIeOrEdge = /MSIE|Trident/.test(engineUserAgent);

	var webkit = engineUserAgent.match(/AppleWebKit\/(\d+)\./);

	var engineWebkitVersion = !!webkit && +webkit[1];

	var test = [];
	var un$Sort = functionUncurryThis(test.sort);
	var push$1 = functionUncurryThis(test.push);

	// IE8-
	var FAILS_ON_UNDEFINED = fails(function () {
	  test.sort(undefined);
	});
	// V8 bug
	var FAILS_ON_NULL = fails(function () {
	  test.sort(null);
	});
	// Old WebKit
	var STRICT_METHOD$1 = arrayMethodIsStrict('sort');

	var STABLE_SORT = !fails(function () {
	  // feature detection can be too slow, so check engines versions
	  if (engineV8Version) return engineV8Version < 70;
	  if (engineFfVersion && engineFfVersion > 3) return;
	  if (engineIsIeOrEdge) return true;
	  if (engineWebkitVersion) return engineWebkitVersion < 603;

	  var result = '';
	  var code, chr, value, index;

	  // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
	  for (code = 65; code < 76; code++) {
	    chr = String.fromCharCode(code);

	    switch (code) {
	      case 66: case 69: case 70: case 72: value = 3; break;
	      case 68: case 71: value = 4; break;
	      default: value = 2;
	    }

	    for (index = 0; index < 47; index++) {
	      test.push({ k: chr + index, v: value });
	    }
	  }

	  test.sort(function (a, b) { return b.v - a.v; });

	  for (index = 0; index < test.length; index++) {
	    chr = test[index].k.charAt(0);
	    if (result.charAt(result.length - 1) !== chr) result += chr;
	  }

	  return result !== 'DGBEFHACIJK';
	});

	var FORCED = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD$1 || !STABLE_SORT;

	var getSortCompare = function (comparefn) {
	  return function (x, y) {
	    if (y === undefined) return -1;
	    if (x === undefined) return 1;
	    if (comparefn !== undefined) return +comparefn(x, y) || 0;
	    return toString_1(x) > toString_1(y) ? 1 : -1;
	  };
	};

	// `Array.prototype.sort` method
	// https://tc39.es/ecma262/#sec-array.prototype.sort
	_export({ target: 'Array', proto: true, forced: FORCED }, {
	  sort: function sort(comparefn) {
	    if (comparefn !== undefined) aCallable(comparefn);

	    var array = toObject(this);

	    if (STABLE_SORT) return comparefn === undefined ? un$Sort(array) : un$Sort(array, comparefn);

	    var items = [];
	    var arrayLength = lengthOfArrayLike(array);
	    var itemsLength, index;

	    for (index = 0; index < arrayLength; index++) {
	      if (index in array) push$1(items, array[index]);
	    }

	    arraySort(items, getSortCompare(comparefn));

	    itemsLength = items.length;
	    index = 0;

	    while (index < itemsLength) array[index] = items[index++];
	    while (index < arrayLength) delete array[index++];

	    return array;
	  }
	});

	var sort$3 = entryVirtual('Array').sort;

	var ArrayPrototype$5 = Array.prototype;

	var sort$2 = function (it) {
	  var own = it.sort;
	  return it === ArrayPrototype$5 || (objectIsPrototypeOf(ArrayPrototype$5, it) && own === ArrayPrototype$5.sort) ? sort$3 : own;
	};

	var sort$1 = sort$2;

	var sort = sort$1;

	var PROPER_FUNCTION_NAME = functionName.PROPER;



	var non = '\u200B\u0085\u180E';

	// check that a method works with the correct list
	// of whitespaces and has a correct name
	var stringTrimForced = function (METHOD_NAME) {
	  return fails(function () {
	    return !!whitespaces[METHOD_NAME]()
	      || non[METHOD_NAME]() !== non
	      || (PROPER_FUNCTION_NAME && whitespaces[METHOD_NAME].name !== METHOD_NAME);
	  });
	};

	var $trim = stringTrim.trim;


	// `String.prototype.trim` method
	// https://tc39.es/ecma262/#sec-string.prototype.trim
	_export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
	  trim: function trim() {
	    return $trim(this);
	  }
	});

	var trim$3 = entryVirtual('String').trim;

	var StringPrototype = String.prototype;

	var trim$2 = function (it) {
	  var own = it.trim;
	  return typeof it == 'string' || it === StringPrototype
	    || (objectIsPrototypeOf(StringPrototype, it) && own === StringPrototype.trim) ? trim$3 : own;
	};

	var trim$1 = trim$2;

	var trim = trim$1;

	var _context, _context2, _context3;
	trim(_context = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32">
<path d="M28.998 8.531l-2.134-2.134c-0.394-0.393-1.030-0.393-1.423 0l-12.795 12.795-6.086-6.13c-0.393-0.393-1.029-0.393-1.423 0l-2.134 2.134c-0.393 0.394-0.393 1.030 0 1.423l8.924 8.984c0.393 0.393 1.030 0.393 1.423 0l15.648-15.649c0.393-0.392 0.393-1.030 0-1.423z"></path>
</svg>
`).call(_context);
	const arrow_down = trim(_context2 = `
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20">
<path d="M13.418 7.601c0.271-0.268 0.709-0.268 0.979 0s0.271 0.701 0 0.969l-3.907 3.83c-0.271 0.268-0.709 0.268-0.979 0l-3.908-3.83c-0.27-0.268-0.27-0.701 0-0.969s0.708-0.268 0.979 0l3.418 3.14 3.418-3.14z"></path>
</svg>
`).call(_context2);
	const x = trim(_context3 = `
<svg version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="64px" height="64px" viewBox="0 0 64 64" xml:space="preserve">
<g><rect x="-2.352" y="29.385" transform="matrix(0.7071 0.7071 -0.7071 0.7071 32.3545 -14.3899)" width="71.799" height="4.95"/></g>
<g><rect x="-2.374" y="29.376" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -12.7023 33.0352)" width="71.799" height="4.95"/></g>
</svg>

`).call(_context3);
	const dots = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 4" fill=\"currentColor\"><circle cx="8" cy="2" r="2"/><circle cx="14" cy="2" r="2"/><circle cx="2" cy="2" r="2"/></svg>`;
	const caretUp = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="currentColor" stroke="none"><path d="M22,17.5c0,0.271-0.1,0.505-0.297,0.703C21.505,18.4,21.271,18.5,21,18.5H7c-0.271,0-0.505-0.1-0.703-0.297  C6.099,18.005,6,17.771,6,17.5s0.099-0.505,0.297-0.703l7-7C13.495,9.599,13.729,9.5,14,9.5s0.505,0.099,0.703,0.297l7,7  C21.9,16.995,22,17.229,22,17.5z"/></svg>`;
	const caretDown = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="currentColor" stroke="none"><path d="M22,10.5c0,0.271-0.1,0.505-0.297,0.703l-7,7C14.505,18.4,14.271,18.5,14,18.5s-0.505-0.1-0.703-0.297l-7-7  C6.099,11.005,6,10.771,6,10.5s0.099-0.505,0.297-0.703C6.495,9.599,6.729,9.5,7,9.5h14c0.271,0,0.505,0.099,0.703,0.297  C21.9,9.995,22,10.229,22,10.5z"/></svg>`;

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

	class Select extends Component {
	  initialize() {
	    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    this.options = {
	      multiple: false,
	      limit: 8,
	      container: false
	    };

	    assign(this.options, this.pick(options, keys$1(this.options)));

	    this.el_options = assign({}, this.pick(options, HTML_ATTRIBUTES));
	    this.el = createElement('button', this.el_options);
	    this.el.type = "button";
	    this.el.classList.add('uniformSelect');
	    this.listenTo(this.el, 'click', this.toggleOptions);
	    this.listenTo(this.el, 'click', '.uniformSelect-remove', this.removeSelection);
	    this.listenTo(this.el, 'change', 'select', this.renderValue);
	    this.listenTo(this.el, 'close', 'select', this.removeOptions);

	    if (options.options) {
	      var _context;

	      this.htmlOptions = map(_context = options.options).call(_context, option => {
	        if (typeof option == "string") {
	          return {
	            value: option,
	            text: option
	          };
	        } else if (isArray(option)) {
	          return {
	            value: option[1],
	            text: option[0],
	            selected: option[2]
	          };
	        } else if (typeof option == "object") {
	          return option;
	        } else {
	          throw "option of unexpected type";
	        }
	      });
	    }

	    if (options.el) {
	      this.select = options.el;
	      this.el.setAttribute('class', this.select.getAttribute('class'));
	      this.el.classList.add('uniformSelect');

	      if (!this.htmlOptions) {
	        var _context2;

	        this.htmlOptions = map(_context2 = from_1(this.select.querySelectorAll('option'))).call(_context2, option => {
	          return {
	            value: option.value,
	            text: option.innerHTML,
	            selected: option.selected
	          };
	        });
	      }
	    }
	  }

	  render() {
	    var _context3, _context4, _context5;

	    this.valueEl = createElement('span');
	    this.valueEl.classList.add('uniformSelect-value');
	    this.el.append(this.valueEl);
	    this.indicatorEl = createElement('span', {
	      children: arrow_down
	    });
	    this.indicatorEl.classList.add('uniformSelect-indicator');
	    this.el.append(this.indicatorEl);

	    if (this.select) {
	      this.select.replaceWith(this.el);
	      this.select.innerHTML = '';
	    } else {
	      this.select = createElement('select', this.el_options);
	    }

	    forEach(_context3 = this.htmlOptions).call(_context3, option => {
	      this.select.append(createElement('option', assign({}, {
	        children: option.text
	      }, option)));
	    });

	    this.el.append(this.select); // Append placeholder of longest option, to set width

	    const longestText = sort(_context4 = map(_context5 = this.htmlOptions).call(_context5, x => x.text)).call(_context4, (a, b) => a.length < b.length)[0];

	    const placeholder = createElement('span', {
	      class: 'uniformSelect-placeholder',
	      children: longestText
	    });
	    this.el.append(placeholder);
	    this.renderValue();
	    return this;
	  }

	  renderValue() {
	    const selectedOptions = filter(this.select.querySelectorAll("option"), el => el.selected);

	    const html = map(selectedOptions).call(selectedOptions, el => this.options.multiple ? `
            <span class="uniformSelect-selection">
                <span>${el.textContent}</span><span class="uniformSelect-remove">${x}</span>
            </span>
        ` : el.textContent).join(" ");

	    this.valueEl.innerHTML = html;
	  }

	  selectOption(e) {
	    const makeActive = !e.target.option.selected;

	    if (!this.options.multiple && makeActive) {
	      var _context6;

	      forEach(_context6 = e.target.offsetParent.querySelectorAll('.active')).call(_context6, el => el.classList.remove('active'));
	    }

	    e.target.classList.toggle('active', makeActive);
	    e.target.option.selected = makeActive;

	    if (!this.options.multiple) {
	      this.removeOptions();
	    }

	    trigger(this.select, 'change');
	  }

	  removeSelection(e) {
	    e.preventDefault();
	    e.stopPropagation();
	    var option = filter(this.select.querySelectorAll("option"), function (el) {
	      var _context7, _context8;

	      return trim(_context7 = el.innerText).call(_context7) == trim(_context8 = e.target.closest('.uniformSelect-selection').innerText).call(_context8);
	    })[0];
	    if (!option) return;
	    option.selected = false;
	    option.button.classList.remove('active');
	    trigger(this.select, 'change');
	  }

	  toggleOptions(e) {
	    if (e && (e.target.matches('.uniformSelect-remove') || e.target.closest('.uniformSelect-remove'))) {
	      return;
	    }

	    this.el.classList.toggle('active');

	    if (this.el.classList.contains('active')) {
	      this.renderOptions();
	    } else {
	      this.popover.toggle(false);
	    }
	  }

	  renderOptions() {
	    var _context9;

	    const options = createElement("div", {
	      class: 'uniformSelect-options'
	    });
	    options.style.fontSize = css(this.el, 'font-size');

	    forEach(_context9 = this.select.querySelectorAll('option')).call(_context9, function (option, index) {
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

	      if (this.options.limit && index + 1 > this.options.limit) {
	        button.classList.add('hide');
	      }

	      options.append(button);
	    }, this);

	    this.listenTo(options, 'click', '.uniformSelect-option', this.selectOption);
	    const actions = createElement('div', {
	      class: 'uniformSelect-actions'
	    });

	    if (this.options.limit && this.htmlOptions.length > this.options.limit) {
	      var _context10;

	      const button = createElement('button', {
	        type: 'button',
	        class: 'uniformSelect-show-all',
	        children: 'Show All'
	      });
	      this.listenTo(button, 'click', bind(_context10 = this.showAllOptions).call(_context10, this));
	      actions.append(button);
	    }

	    if (this.options.multiple) {
	      var _context11;

	      const button = createElement('button', {
	        type: 'button',
	        class: 'uniformSelect-done',
	        children: ['Done']
	      });
	      this.listenTo(button, 'click', bind(_context11 = this.removeOptions).call(_context11, this));
	      actions.append(button);
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
	      container: this.options.container,
	      transition: 'transition-fade-up'
	    }).render();
	    this.listenTo(this.popover, 'hidden', this.removeOptions);
	  }

	  removeOptions() {
	    this.el.classList.remove('active');
	    if (!this.popover) return;
	    this.popover.remove();
	  }

	  showAllOptions(e) {
	    var _context12;

	    e.preventDefault();
	    e.stopPropagation();
	    if (!this.popover) return;

	    forEach(_context12 = this.popover.el.querySelectorAll('button.hide')).call(_context12, el => el.classList.remove('hide'));

	    var button = this.popover.el.querySelector('.uniformSelect-show-all');
	    button.parentNode.removeChild(button);
	  }

	}

	class FloatingLabel extends Component {
	  initialize(options) {
	    if (options.input instanceof Element) {
	      this.input = options.input;
	    } else {
	      this.input = createElement('input', assign({}, {
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

	  render() {
	    if (!isVisible(this.input)) return this;

	    let internalHeight = _parseInt(css(this.input, 'height')) - _parseInt(css(this.input, 'borderTopWidth')) - _parseInt(css(this.input, 'borderBottomWidth'));

	    this.input.style.lineHeight = 1;

	    let lineHeight = _parseInt(css(this.input, 'lineHeight'));

	    let fontSize = _parseInt(css(this.input, 'fontSize'));
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

	    return this;
	  }

	  focus(e) {
	    this.el.classList.add('present');
	  }

	  blur(e) {
	    if (this.input.value == "") {
	      this.el.classList.remove('present');
	    }
	  }

	}

	class Resizer extends Component {
	  initialize() {
	    var _context;

	    const breakpoints = getComputedStyle(window.document.body).getPropertyValue('--breakpoints');
	    this.breakpoints = {};

	    forEach(_context = breakpoints.split(",")).call(_context, breakpoint => {
	      const [key, value] = breakpoint.split("/");
	      this.breakpoints[trim(key).call(key)] = value;
	    });

	    this.listenTo(window, 'resize', this.resize);
	    this.resize();
	  }

	  resize() {
	    var _context2;

	    const width = this.el.offsetWidth;

	    forEach(_context2 = keys$1(this.breakpoints)).call(_context2, size => {
	      const query = this.breakpoints[size];
	      const css_class = size + '-container';
	      let [attribute, value] = query.split(":");

	      if (value.match("px")) {
	        value = _parseInt(value);
	      } else {
	        throw "unsupported media units";
	      }

	      if (attribute == "min-width") {
	        this.el.classList.toggle(css_class, width > value);
	      } else if (attribute == "max-width") {
	        this.el.classList.toggle(css_class, width < value);
	      } else {
	        throw "unsupported media feature";
	      }
	    });
	  }

	}

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
	    timeout
	*/

	class Tooltip extends Component {
	  initialize(options) {
	    this.anchor = options.anchor;
	    this.options = assign({
	      align: 'top'
	    }, options);
	    this.options.offset = {
	      [this.options.align]: -7
	    };
	    this.pointerDirection = {
	      top: 'bottom',
	      bottom: 'top',
	      left: 'right',
	      right: 'left'
	    }[this.options.align];
	    this.options.align = {
	      left: 'left center',
	      right: 'right center',
	      top: 'center top',
	      bottom: 'center bottom'
	    }[this.options.align];
	    this.enabled = true;
	    this.anchor.tooltip = this;
	    this.timeout = options.timeout;
	    this.listenTo(this.anchor, 'mouseenter', this.show);
	    this.listenTo(this.anchor, 'mouseleave', this.hide);
	  }

	  render() {
	    return this;
	  }

	  show() {
	    if (!this.enabled) return;
	    clearTimeout(this.hide_timeout);
	    this.anchor.classList.add('-active');

	    if (this.popup) {
	      this.popup.show();
	    } else {
	      this.popup = new Popover(assign({
	        class: `uniformPointer -${this.pointerDirection} bg-gray-70 bg-opacity-85 text-white rounded pad-1/2x text-sm max-width-300-px `
	      }, this.options)).render();
	    }
	  }

	  hide() {
	    this.hide_timeout = setTimeout(() => {
	      this.popup.remove();
	      this.anchor.classList.remove('-active');
	      delete this.popup;
	    }, this.timeout);
	  }

	  disable() {
	    this.enabled = false;
	  }

	  enabled() {
	    this.enabled = true;
	  }

	}

	/*  
	    Options
	    ===
	    content:    string|$el|function
	    el:         element
	    zone:       element|function|html to render as the dropzon

	*/

	class Dropzone extends Component {
	  constructor() {
	    super(...arguments);

	    _defineProperty(this, "enabled", true);
	  }

	  initialize(options) {
	    var _context, _context2, _context3, _context4, _context5, _context6, _context7;

	    if (options.zone) {
	      this.zone = options.zone;
	      append(this.el, this.zone);
	    } else {
	      this.zone = this.el.append(createElement({
	        class: 'uniformDropzone',
	        content: 'Drag Here'
	      }));
	    }

	    if (getComputedStyle(this.el)['position'] == "static") {
	      this.el.classList.add('relative');
	    }

	    if (typeof options.enabled == "boolean") {
	      this.enabled = options.enabled;
	    }

	    this.windowDragEnter = bind(_context = this.windowDragEnter).call(_context, this);
	    this.windowDragLeave = bind(_context2 = this.windowDragLeave).call(_context2, this);
	    this.windowDrop = bind(_context3 = this.windowDrop).call(_context3, this);
	    this.el.addEventListener('drop', bind(_context4 = this.drop).call(_context4, this));
	    this.el.addEventListener('dragover', bind(_context5 = this.dragOver).call(_context5, this));
	    this.el.addEventListener('dragenter', bind(_context6 = this.dragEnter).call(_context6, this));
	    this.el.addEventListener('dragleave', bind(_context7 = this.dragLeave).call(_context7, this));
	    window.addEventListener('dragenter', this.windowDragEnter);
	    window.addEventListener('dragleave', this.windowDragLeave);
	    window.addEventListener('drop', this.windowDrop);
	  }

	  remove() {
	    window.removeEventListener('dragenter', this.windowDragEnter);
	    window.removeEventListener('dragleave', this.windowDragLeave);
	    window.removeEventListener('drop', this.windowDrop);
	    super.remove();
	  }
	  /*--------------------
	      This Events
	  --------------------*/


	  dragEnter(e) {
	    if (!this.enabled) return;
	    e.preventDefault();
	    this.el.classList.add('-active');
	  }

	  dragLeave(e) {
	    if (!this.enabled) return;
	    e.preventDefault(); // relatedTarget is what drag is going to, deals with dragging inside dropzone

	    if (!this.el.contains(e.relatedTarget)) {
	      this.el.classList.remove('-active');
	    }
	  }

	  drop(e) {
	    var _context8;

	    if (!this.enabled) return;
	    e.preventDefault();

	    forEach(_context8 = [...e.dataTransfer.files]).call(_context8, file => {
	      this.trigger('drop', file);
	    });
	  } // Enables Dropzone


	  dragOver(e) {
	    if (!this.enabled) return;
	    e.preventDefault();
	  }
	  /*--------------------
	      Window Events
	  --------------------*/


	  windowDragEnter(e) {
	    if (!this.enabled) return;
	    e.preventDefault(); // Meaning it came from not in window

	    if (!e.relatedTarget) {
	      this.el.classList.add('-show');
	    }
	  }

	  windowDragLeave(e) {
	    if (!this.enabled) return;
	    e.preventDefault(); // Meaning it came from not in window

	    if (!e.relatedTarget) {
	      this.el.classList.remove('-show');
	    }
	  }

	  windowDrop(e) {
	    if (!this.enabled) return;
	    e.preventDefault();
	    this.el.classList.remove('-show');
	  }

	}

	var $find = arrayIteration.find;


	var FIND = 'find';
	var SKIPS_HOLES$1 = true;

	// Shouldn't skip holes
	if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES$1 = false; });

	// `Array.prototype.find` method
	// https://tc39.es/ecma262/#sec-array.prototype.find
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var find$3 = entryVirtual('Array').find;

	var ArrayPrototype$4 = Array.prototype;

	var find$2 = function (it) {
	  var own = it.find;
	  return it === ArrayPrototype$4 || (objectIsPrototypeOf(ArrayPrototype$4, it) && own === ArrayPrototype$4.find) ? find$3 : own;
	};

	var find$1 = find$2;

	var find = find$1;

	var $propertyIsEnumerable = objectPropertyIsEnumerable.f;

	var propertyIsEnumerable = functionUncurryThis($propertyIsEnumerable);
	var push = functionUncurryThis([].push);

	// `Object.{ entries, values }` methods implementation
	var createMethod = function (TO_ENTRIES) {
	  return function (it) {
	    var O = toIndexedObject(it);
	    var keys = objectKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) {
	      key = keys[i++];
	      if (!descriptors || propertyIsEnumerable(O, key)) {
	        push(result, TO_ENTRIES ? [key, O[key]] : O[key]);
	      }
	    }
	    return result;
	  };
	};

	var objectToArray = {
	  // `Object.entries` method
	  // https://tc39.es/ecma262/#sec-object.entries
	  entries: createMethod(true),
	  // `Object.values` method
	  // https://tc39.es/ecma262/#sec-object.values
	  values: createMethod(false)
	};

	var $values = objectToArray.values;

	// `Object.values` method
	// https://tc39.es/ecma262/#sec-object.values
	_export({ target: 'Object', stat: true }, {
	  values: function values(O) {
	    return $values(O);
	  }
	});

	var values$2 = path.Object.values;

	var values$1 = values$2;

	var values = values$1;

	var $findIndex = arrayIteration.findIndex;


	var FIND_INDEX = 'findIndex';
	var SKIPS_HOLES = true;

	// Shouldn't skip holes
	if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES = false; });

	// `Array.prototype.findIndex` method
	// https://tc39.es/ecma262/#sec-array.prototype.findindex
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
	  findIndex: function findIndex(callbackfn /* , that = undefined */) {
	    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var findIndex$3 = entryVirtual('Array').findIndex;

	var ArrayPrototype$3 = Array.prototype;

	var findIndex$2 = function (it) {
	  var own = it.findIndex;
	  return it === ArrayPrototype$3 || (objectIsPrototypeOf(ArrayPrototype$3, it) && own === ArrayPrototype$3.findIndex) ? findIndex$3 : own;
	};

	var findIndex$1 = findIndex$2;

	var findIndex = findIndex$1;

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('splice');

	var TypeError$1 = global_1.TypeError;
	var max$1 = Math.max;
	var min = Math.min;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

	// `Array.prototype.splice` method
	// https://tc39.es/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject(this);
	    var len = lengthOfArrayLike(O);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min(max$1(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
	    }
	    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
	      throw TypeError$1(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
	    }
	    A = arraySpeciesCreate(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty(A, k, O[from]);
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else delete O[to];
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    O.length = len - actualDeleteCount + insertCount;
	    return A;
	  }
	});

	var splice$3 = entryVirtual('Array').splice;

	var ArrayPrototype$2 = Array.prototype;

	var splice$2 = function (it) {
	  var own = it.splice;
	  return it === ArrayPrototype$2 || (objectIsPrototypeOf(ArrayPrototype$2, it) && own === ArrayPrototype$2.splice) ? splice$3 : own;
	};

	var splice$1 = splice$2;

	var splice = splice$1;

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

	var SPECIES = wellKnownSymbol('species');
	var Array$1 = global_1.Array;
	var max = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.es/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = lengthOfArrayLike(O);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray$3(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (isConstructor(Constructor) && (Constructor === Array$1 || isArray$3(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array$1 || Constructor === undefined) {
	        return arraySlice(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array$1 : Constructor)(max(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var slice$3 = entryVirtual('Array').slice;

	var ArrayPrototype$1 = Array.prototype;

	var slice$2 = function (it) {
	  var own = it.slice;
	  return it === ArrayPrototype$1 || (objectIsPrototypeOf(ArrayPrototype$1, it) && own === ArrayPrototype$1.slice) ? slice$3 : own;
	};

	var slice$1 = slice$2;

	var slice = slice$1;

	var $stringify = getBuiltIn('JSON', 'stringify');
	var exec = functionUncurryThis(/./.exec);
	var charAt = functionUncurryThis(''.charAt);
	var charCodeAt = functionUncurryThis(''.charCodeAt);
	var replace = functionUncurryThis(''.replace);
	var numberToString = functionUncurryThis(1.0.toString);

	var tester = /[\uD800-\uDFFF]/g;
	var low = /^[\uD800-\uDBFF]$/;
	var hi = /^[\uDC00-\uDFFF]$/;

	var WRONG_SYMBOLS_CONVERSION = !nativeSymbol || fails(function () {
	  var symbol = getBuiltIn('Symbol')();
	  // MS Edge converts symbol values to JSON as {}
	  return $stringify([symbol]) != '[null]'
	    // WebKit converts symbol values to JSON as null
	    || $stringify({ a: symbol }) != '{}'
	    // V8 throws on boxed symbols
	    || $stringify(Object(symbol)) != '{}';
	});

	// https://github.com/tc39/proposal-well-formed-stringify
	var ILL_FORMED_UNICODE = fails(function () {
	  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
	    || $stringify('\uDEAD') !== '"\\udead"';
	});

	var stringifyWithSymbolsFix = function (it, replacer) {
	  var args = arraySlice(arguments);
	  var $replacer = replacer;
	  if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	  if (!isArray$3(replacer)) replacer = function (key, value) {
	    if (isCallable($replacer)) value = functionCall($replacer, this, key, value);
	    if (!isSymbol(value)) return value;
	  };
	  args[1] = replacer;
	  return functionApply($stringify, null, args);
	};

	var fixIllFormed = function (match, offset, string) {
	  var prev = charAt(string, offset - 1);
	  var next = charAt(string, offset + 1);
	  if ((exec(low, match) && !exec(hi, next)) || (exec(hi, match) && !exec(low, prev))) {
	    return '\\u' + numberToString(charCodeAt(match, 0), 16);
	  } return match;
	};

	if ($stringify) {
	  // `JSON.stringify` method
	  // https://tc39.es/ecma262/#sec-json.stringify
	  _export({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
	    // eslint-disable-next-line no-unused-vars -- required for `.length`
	    stringify: function stringify(it, replacer, space) {
	      var args = arraySlice(arguments);
	      var result = functionApply(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
	      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace(result, tester, fixIllFormed) : result;
	    }
	  });
	}

	// eslint-disable-next-line es-x/no-json -- safe
	if (!path.JSON) path.JSON = { stringify: JSON.stringify };

	// eslint-disable-next-line no-unused-vars -- required for `.length`
	var stringify$2 = function stringify(it, replacer, space) {
	  return functionApply(path.JSON.stringify, null, arguments);
	};

	var stringify$1 = stringify$2;

	var stringify = stringify$1;

	/* eslint-disable es-x/no-array-prototype-indexof -- required for testing */


	var $IndexOf = arrayIncludes.indexOf;


	var un$IndexOf = functionUncurryThis([].indexOf);

	var NEGATIVE_ZERO = !!un$IndexOf && 1 / un$IndexOf([1], 1, -0) < 0;
	var STRICT_METHOD = arrayMethodIsStrict('indexOf');

	// `Array.prototype.indexOf` method
	// https://tc39.es/ecma262/#sec-array.prototype.indexof
	_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    var fromIndex = arguments.length > 1 ? arguments[1] : undefined;
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? un$IndexOf(this, searchElement, fromIndex) || 0
	      : $IndexOf(this, searchElement, fromIndex);
	  }
	});

	var indexOf$4 = entryVirtual('Array').indexOf;

	var ArrayPrototype = Array.prototype;

	var indexOf$3 = function (it) {
	  var own = it.indexOf;
	  return it === ArrayPrototype || (objectIsPrototypeOf(ArrayPrototype, it) && own === ArrayPrototype.indexOf) ? indexOf$4 : own;
	};

	var indexOf$2 = indexOf$3;

	var indexOf$1 = indexOf$2;

	// Capitalizes all the words and replaces some characters in the string to
	// create a nicer looking title. titleize is meant for creating pretty output.
	//
	// export function titleize(value: string): string
	function titleize(value) {
	  return humanize(underscore(value)).replace(/\b('?[a-z])/g, m => m.toUpperCase());
	} // Capitalizes the first word and turns underscores into spaces and strips a
	// trailing "_id", if any. Like titleize, this is meant for creating pretty
	// output.
	//
	// export function humanize(value: string): string

	function humanize(value) {
	  return capitalize(value.toLowerCase().replace(/_id$/, '').replace(/_/g, ' ').replace(/([a-z\d]*)/g, m => m.toLowerCase()));
	} // Makes an underscored, lowercase form from the expression in the string.
	//
	// Changes '.' to '/' to convert namespaces to paths.
	//
	// Examples:
	// 
	//     "ActiveModel".underscore         # => "active_model"
	//     "ActiveModel.Errors".underscore # => "active_model/errors"
	//
	// As a rule of thumb you can think of underscore as the inverse of camelize,
	// though there are cases where that does not hold:
	//
	//     "SSLError".underscore().camelize() # => "SslError"
	//
	// export function underscore(value: string): string

	function underscore(value) {
	  let result = value.replace('.', '/');
	  result = result.replace(/([A-Z\d]+)([A-Z][a-z])/g, "$1_$2");
	  result = result.replace(/([a-z\d])([A-Z])/g, "$1_$2");
	  return result.replace('-', '_').toLowerCase();
	} // Converts the first character to uppercase
	//
	// export function capitalize(value: string): string

	function capitalize(value) {
	  return value.charAt(0).toUpperCase() + slice(value).call(value, 1);
	}

	class DragOrder {
	  
	    /*
	    Due to limitations with the Drag and Drop API of javascript,
	    this uses mouseover to manage the dragging and placement of an item
	    */
	    options = {
	        drop: (items) => {},
	        dragStart: (items) => {},
	        dragEnd: (items) => {},
	        placeholder: (item) => {
	            const el = item.cloneNode(true);
	            el.style.display = item.style.display;
	            el.style.opacity = 0.5;
	            return el
	        },
	        dragholder: item => {
	            const el = item.cloneNode(true);
	            el.style.display = item.style.display;
	            el.style.width = item.offsetWidth + "px";
	            el.style.height = item.offsetHeight + "px";
	            el.style.minWidth = 'auto';
	            el.style.maxWidth = 'auto';
	            el.style.minHeight = 'auto';
	            el.style.maxHeight = 'auto';
	            el.style.position = 'fixed';
	            el.style.zIndex = 999;
	            el.style.cursor = "grabbing";
	            
	            if (this.options.handleSelector) {
	                el.querySelector(this.options.handleSelector).style.cursor = "grabbing";
	            }
	        
	            // Fix bug with table rows squishing width
	            if (el.tagName == "TR") {
	                Array.from(el.children).forEach((child, index) => {
	                    child.style.width = item.children[index].offsetWidth + "px";
	                });
	            }
	            return el
	        },
	        handleSelector: false,
	        itemSelector: false
	    }
	  
	    constructor(options){
	        this.el = options.el;
	    
	        Object.keys(this.options).forEach(key => {
	            if(options[key]) this.options[key] = options[key];
	        });
	    
	        this.keyUp = this.keyUp.bind(this);
	        this.mouseMove = this.mouseMove.bind(this);
	        this.mouseDown = this.mouseDown.bind(this);
	        this.mouseUp = this.mouseUp.bind(this);
	        this.el.addEventListener('mousedown', this.mouseDown);
	        this.el.addEventListener('mouseup', this.mouseUp);
	    }
	  
	    remove () {
	        this.el.removeEventListener('mousedown', this.mouseDown);
	        this.el.removeEventListener('mouseup', this.mouseUp);
	        this.dragEnd();
	    }
	  
	    keyUp (e) {
	        if(e.key == "Escape" && this.selectedItem !== undefined) {
	            this.dragEnd();
	        }
	    }
	  
	    mouseUp (e) {
	        if(this.dragging) this.drop();
	    }
	  
	    mouseDown (e) {
	        if(this.options.handleSelector) {
	            const matchingEl = e.target.matches(this.options.handleSelector) || e.target.closest(this.options.handleSelector);
	            if(!matchingEl) { 
	                return
	            }
	        }
	        this.dragStart(e);
	    }

	    mouseMove (e) {
	        if (this.moving) return // debounce multiple async calls
	        this.moving = true;
	        this.dragItem.style.left = e.pageX + "px";
	        this.dragItem.style.top = e.pageY + "px";
	      
	        const hoveredItem = this.getItem(e.pageX, e.pageY);
	        if (hoveredItem && this.lastPosition) {
	            const position = this.lastPosition.y > e.pageY || this.lastPosition.x > e.pageX ? 'beforebegin' : 'afterend';
	            hoveredItem.insertAdjacentElement(position, this.placeholder);
	        }
	    
	        this.lastPosition = {
	            x: e.pageX,
	            y: e.pageY
	        };
	    
	        this.moving = false;
	    }
	  
	    dragStart (e) {
	        if (this.dragging) return
	        this.dragging = true;
	        this.getItems();
	        this.selectedItem = this.getItem(e.pageX, e.pageY);
	        const itemPosition = this.selectedItem.getBoundingClientRect();
	        this.lastPosition = {
	            x: e.pageX,
	            y: e.pageY
	        };
		
	        // Render dragItem
	        this.dragItem = this.options.dragholder.call(this, this.selectedItem);
	        this.selectedItem.insertAdjacentElement('beforebegin', this.dragItem);
	        this.dragItem.style.left = e.pageX + "px";
	        this.dragItem.style.top = e.pageY + "px";
	        this.dragItem.style.marginTop = itemPosition.top - e.pageY + "px";
	        this.dragItem.style.marginLeft = itemPosition.left - e.pageX + "px";
	    
	        // Render placeholder
	        if (typeof this.options.placeholder == 'string') {
	            this.placeholder = document.createElement('div');
	            this.placeholder.innerHTML = this.options.placeholder;
	            this.placeholder = this.placeholder.children[0];
	        } else if (this.options.placeholder instanceof Element) {
	            this.placeholder = this.options.placeholder;
	        } else if (typeof this.options.placeholder == "function") {
	            this.placeholder = this.options.placeholder(this.selectedItem);
	        }
	        this.selectedItem.insertAdjacentElement('beforebegin', this.placeholder);
		
	        // Hide selectedItem
	        this.selectedItem.styleWas = {display: this.selectedItem.style.display};
	        this.selectedItem.style.display = 'none';
	    
	        window.addEventListener('mousemove', this.mouseMove);
	        window.addEventListener('keyup', this.keyUp);
	    
	        this.options.dragStart(this.items);
	    }
	  
	    dragEnd () {
	        if(!this.dragging) return;
	        Object.keys(this.selectedItem.styleWas).forEach(style => {
	            this.selectedItem.style[style] = this.selectedItem.styleWas[style];
	        });
	        this.dragItem.parentNode.removeChild(this.dragItem);
	        this.placeholder.parentNode.removeChild(this.placeholder);
	    
	        delete this.lastPosition;
	        delete this.placeholder;
	        delete this.dragItem;
	        delete this.selectedItem;
	    
	        window.removeEventListener('mousemove', this.mouseMove);
	        window.removeEventListener('keyup', this.keyUp);
	    
	        this.options.dragEnd(this.items);
	    
	        this.dragging = false;
	    }
	  
	    drop () {
	        this.placeholder.insertAdjacentElement('beforebegin', this.selectedItem);
	        this.dragEnd();
	        this.options.drop(this.getItems());
	    }
	  
	    getItem(x, y) {
	        let item;
	        this.items.forEach(i => {
	            const viewportPosition = i.getBoundingClientRect();
	            const position = {
	                left: viewportPosition.left + window.scrollX,
	                right: viewportPosition.right + window.scrollX,
	                top: viewportPosition.top + window.scrollY,
	                bottom: viewportPosition.bottom + window.scrollY
	            };
	            if (position.left <= x && position.right >= x && position.top <= y && position.bottom >= y){
	                item = i;
	            }
	        });
	        return item;
	    }
	  
	    getItems() {
	        this.items = this.options.itemSelector ? this.el.querySelectorAll(this.options.itemSelector) : Array.from(this.el.children);
	        return this.items
	    }
	 
	}

	/*  
	    Options
	    ===
	    columns: ƒ || [ƒ, {}]
	    records:
	    storeKey: string || ƒ // used to store settings in LocalStorage

	    Extendable
	    ===
	    columns
	    defaultColumns
	    tagName
	    records
	    className
	    initColumnModel(model, key) => model
	    defaultColumnRender(record, model) => element || html

	    Column Options
	    ===
	    render: record => element
	    width: integer
	    header: string
	    class: string   | css class for all cells of the column
	    order: boolean || ƒ(records, "asc"||"desc") 
	    default: if key present, table will start with columns where default: true, otherwise shows all by default
	    static: always prepend or append column ("start" or true) and exclude from settings

	    TODO
	    ===
	    - drag and drop reoder of columns via handle in header of column
	        - need to setup gridRowTemplate using record.length, so that column cells can be moved together via changing the rowTemplate
	        - dragging image is messy, but might be possible by dropping cells into a container with width of column

	*/

	class Table extends Component {
	  async initialize(options) {
	    var _context, _context2, _context3, _context4, _context5, _context6, _context7;

	    this.records = options.records;
	    this.empty = options.empty;
	    this._storeKey = options.storeKey || this.constructor._storeKey; // Column Models

	    this.columnModels = options.columns || this.constructor.columns;
	    if (typeof this.columnModels == "function") this.columnModels = this.columnModels();

	    forEach(_context = keys$1(this.columnModels)).call(_context, key => {
	      this.columnModels[key] = this.initColumnModel(this.columnModels[key], key);
	    }); // Default Columns


	    this._defaultColumns = options.defaultColumns || this.constructor._defaultColumns || keys$1(this.columnModels);
	    this.defaultOrder = options.defaultOrder || this.defaultOrder || this.constructor.defaultOrder || find(_context2 = this._defaultColumns).call(_context2, key => this.columnModels[key].order);

	    if (this.defaultOrder) {
	      if (typeof this.defaultOrder != 'object') this.defaultOrder = {
	        [this.defaultOrder]: 'asc'
	      };
	    } // Bind Instance Methods


	    this.columnResize = bind(_context3 = this.columnResize).call(_context3, this);
	    this.endColumnResize = bind(_context4 = this.endColumnResize).call(_context4, this); // Events

	    addEventListenerFor(this.el, '.uniformTableGrid-column-menu', 'click', bind(_context5 = this.showColumnPopover).call(_context5, this));
	    addEventListenerFor(this.el, '.uniformTableGrid-order-action', 'click', bind(_context6 = this.selectOrder).call(_context6, this));
	    addEventListenerFor(this.el, '.uniformTableGrid-resize-handle', 'mousedown', bind(_context7 = this.initiateColumnResize).call(_context7, this));
	    this.render();
	  }

	  initColumnModel(model, key) {
	    model.id = key;

	    if (typeof model == "function") {
	      model = {
	        render: model
	      };
	    } else if (isArray(model)) {
	      model[1].render = model[0];
	      model = model[1];
	    } else if (typeof model == "object") {
	      if (!model.render) {
	        model.render = this.defaultColumnRender;
	      }
	    } else {
	      throw 'UniformTable column in inproperly configured. Accepts function or [function, options]';
	    }

	    return model;
	  }

	  defaultColumnRender(record, model) {
	    return record[model.id];
	  }

	  async render() {
	    this.setTemplate();
	    this.el.innerHTML = '';
	    this.el.append(this.renderHead());
	    const records = await this.getRecords();
	    this.el.append(...map(records).call(records, this.renderRow, this));

	    if (records.length == 0 && this.empty) {
	      append(this.el, this.empty);
	    }

	    return this;
	  }

	  setTemplate(widths) {
	    if (!widths) {
	      var _context8;

	      widths = map(_context8 = this.getColumns()).call(_context8, col => col.width || "1fr");
	    }

	    this.el.style.gridTemplateColumns = map(widths).call(widths, width => typeof width == "number" ? width + "px" : width).join(" ");
	  }

	  renderHead() {
	    var _context9;

	    return createElement({
	      class: 'uniformTableGrid-header',
	      content: map(_context9 = this.getColumns()).call(_context9, (column, index) => {
	        const model = this.columnModels[column.id];
	        const cell = createElement({
	          class: "uniformTableGrid-header-cell col-" + column.id + " " + (model.class ? model.class : ""),
	          id: column.id,
	          content: [{
	            tag: 'span',
	            content: column.header || model.header || titleize(column.id)
	          }, {
	            class: 'uniformTableGrid-header-action',
	            content: {
	              class: 'uniformTableGrid-column-menu',
	              content: dots
	            }
	          }, {
	            class: 'uniformTableGrid-resize-handle'
	          }]
	        });

	        if (this.getColumns().length - 1 == index) {
	          cell.append(createElement({
	            class: 'uniformTableGrid-resize-handle -end'
	          }));
	        }

	        if (model.order) {
	          cell.querySelector('span').classList.add('uniformTableGrid-order-action');
	          cell.querySelector('span').append(createElement({
	            tag: 'span',
	            class: 'uniformTableGrid-order-indicator',
	            content: [caretUp, caretDown]
	          }));

	          if (column.order) {
	            cell.querySelector('span').classList.add('-active', "-active-" + column.order);
	          }
	        }

	        return cell;
	      })
	    });
	  }

	  renderRow(record) {
	    var _context10;

	    return createElement({
	      class: 'uniformTableGrid-row',
	      content: map(_context10 = this.getColumns()).call(_context10, column => {
	        const model = this.columnModels[column.id];
	        return this.renderCell(record, model);
	      })
	    });
	  }

	  renderCell(record, model) {
	    var _context11;

	    return createElement({
	      content: model.render(record, model),
	      class: filter$1(_context11 = ["uniformTableGrid-cell", "col-" + model.id, model.class]).call(_context11, x => x).join(" ")
	    });
	  }

	  async getRecords() {
	    var _context12;

	    const orderingColumn = find(_context12 = this.getColumns()).call(_context12, x => x.order);

	    if (!orderingColumn) {
	      return this.records;
	    }

	    const model = this.columnModels[orderingColumn.id];

	    if (typeof model.order == "function") {
	      return await model.order(this.records, orderingColumn.order);
	    } else if (model.order) {
	      var _context13;

	      const key = orderingColumn.id;
	      return sort(_context13 = this.records).call(_context13, (r1, r2) => {
	        if (orderingColumn.order == "asc") {
	          return r1[key] > r2[key];
	        } else {
	          return r1[key] < r2[key];
	        }
	      });
	    }
	  }

	  getColumns() {
	    if (!this._columns) {
	      var _context14, _context15, _context19;

	      this._columns = this.readColumns() || this.defaultColumns(); // Remove columns that are no longer in columnModels, because LocalStorage can persist code changes

	      this._columns = filter$1(_context14 = this._columns).call(_context14, x => this.columnModels[x.id]); // Add/Reorder static columns

	      forEach(_context15 = values(this.columnModels)).call(_context15, colModel => {
	        if (colModel.static) {
	          var _context16, _context17;

	          const index = findIndex(_context16 = this._columns).call(_context16, x => x.id == colModel.id);

	          if (index != -1) splice(_context17 = this._columns).call(_context17, index, 1);
	          const placementFunction = colModel.static == "start" ? "unshift" : "push";

	          this._columns[placementFunction]({
	            id: colModel.id
	          });
	        }

	        if (colModel.width) {
	          var _context18;

	          const model = find(_context18 = this._columns).call(_context18, x => x.id == colModel.id);

	          if (model && !model.width) model.width = colModel.width;
	        }
	      });

	      let orderingColumn = find(_context19 = this._columns).call(_context19, x => x.order);

	      if (!orderingColumn && this.defaultOrder) {
	        var _context20;

	        orderingColumn = find(_context20 = this._columns).call(_context20, x => x.id == keys$1(this.defaultOrder)[0]);

	        if (orderingColumn) {
	          orderingColumn.order = this.defaultOrder[orderingColumn.id];
	        }
	      }
	    }

	    return from_1(this._columns);
	  }

	  defaultColumns() {
	    var _context21;

	    return map(_context21 = this._defaultColumns).call(_context21, key => {
	      return {
	        id: key
	      };
	    });
	  }
	  /*
	      Store Columns
	  */


	  storeKey() {
	    var _context22;

	    return this._storeKey || ['uniform/table.v2', map(_context22 = keys$1(this.columnModels)).call(_context22, x => slice(x).call(x, 0, 1)).join('')].join('/');
	  }

	  readColumns() {
	    let savedColumns = localStorage.getItem(this.storeKey());
	    return savedColumns ? JSON.parse(savedColumns) : null;
	  }

	  updateColumns(columns) {
	    var _context23;

	    // Add/Reorder static columns
	    forEach(_context23 = values(this.columnModels)).call(_context23, model => {
	      if (model.static) {
	        const index = findIndex(columns).call(columns, x => x.id == model.id);

	        if (index != -1) splice(columns).call(columns, index, 1);
	        const placementFunction = model.static == "start" ? "unshift" : "push";
	        columns[placementFunction]({
	          id: model.id,
	          width: model.width
	        });
	      }
	    });

	    this._columns = columns;
	    this.saveColumns();
	  }

	  saveColumns() {
	    localStorage.setItem(this.storeKey(), stringify(this._columns));
	  }

	  clearColumns() {
	    localStorage.removeItem(this.storeKey());
	    this._columns = this.getColumns();
	  }
	  /*
	      Actions
	  */


	  setOrder(key, direction) {
	    var _context24, _context25;

	    const currentOrderColumn = find(_context24 = this.getColumns()).call(_context24, x => x.order);

	    const orderColumn = find(_context25 = this.getColumns()).call(_context25, x => x.id == key);

	    orderColumn.order = direction;

	    if (currentOrderColumn && currentOrderColumn != orderColumn) {
	      delete currentOrderColumn.order;
	    }

	    this.saveColumns();
	    this.render();
	  }

	  selectOrder(e) {
	    const direction = e.delegateTarget.classList.contains('-active-asc') ? "desc" : "asc";
	    this.setOrder(e.delegateTarget.closest('.uniformTableGrid-header-cell').id, direction);
	  }

	  showColumnPopover(e) {
	    var _context26;

	    const button = e.delegateTarget;

	    forEach(_context26 = this.el.querySelectorAll('.uniformTableGrid-header-cell')).call(_context26, el => el.classList.add('-disabled'));

	    button.closest('.uniformTableGrid-header').classList.add('-active');
	    button.closest('.uniformTableGrid-header-cell').classList.add('-active');
	    button.closest('.uniformTableGrid-header-cell').classList.remove('-disabled');
	    button.classList.add('-active');

	    if (!button.popover) {
	      const headerCell = button.closest('[id]');
	      const columnModel = this.columnModels[headerCell.id];
	      const popoverContent = this.renderColumnPopover(columnModel);
	      button.popover = new Popover({
	        anchor: button,
	        align: '0px bottom',
	        content: popoverContent
	      }).render();
	      popoverContent.addEventListener('actionSelected', () => {
	        button.popover.hide();
	      });
	      button.popover.addEventListener('hidden', () => {
	        var _context27;

	        forEach(_context27 = this.el.querySelectorAll('.-disabled')).call(_context27, el => el.classList.remove('-disabled'));

	        button.closest('.uniformTableGrid-header-cell').classList.remove('-active');
	        button.classList.remove('-active');
	      });
	    } else {
	      button.popover.toggle();
	    }
	  }

	  renderColumnPopover(columnModel) {
	    const popover = createElement({
	      class: 'shadow shadow-opacity-40 bg-white rounded pad-1/2x text-sm text-nowrap'
	    });
	    const actions = [listenerElement({
	      class: 'block hover:text-blue hover:bg-blue-10 rounded pad-1/2x cursor-pointer',
	      content: 'Table Settings'
	    }, e => {
	      trigger(popover, 'actionSelected');
	      this.showSettingsModal();
	    })];

	    if (!columnModel.static) {
	      actions.unshift(listenerElement({
	        class: 'block hover:text-blue hover:bg-blue-10 rounded pad-1/2x cursor-pointer',
	        content: 'Remove Column'
	      }, e => {
	        var _context28;

	        trigger(popover, 'actionSelected');
	        this.updateColumns(filter$1(_context28 = this.getColumns()).call(_context28, x => x.id != columnModel.id));
	        this.render();
	      }));
	    }

	    if (columnModel.order) {
	      actions.unshift(listenerElement({
	        class: 'block hover:text-blue hover:bg-blue-10 rounded pad-1/2x cursor-pointer',
	        content: 'Order A to Z'
	      }, e => {
	        trigger(popover, 'actionSelected');
	        button.popover.hide();
	        this.setOrder(columnModel.id, 'asc');
	      }), listenerElement({
	        class: 'block hover:text-blue hover:bg-blue-10 rounded pad-1/2x cursor-pointer',
	        content: 'Order Z to A'
	      }, e => {
	        trigger(popover, 'actionSelected');
	        this.setOrder(columnModel.id, 'desc');
	      }));
	    }

	    append(popover, actions);
	    return popover;
	  }

	  renderSettingsModalColumns(includedEl, excludedEl, columns) {
	    var _context29;

	    includedEl.innerHTML = '';
	    excludedEl.innerHTML = '';

	    forEach(columns).call(columns, column => {
	      const model = this.columnModels[column.id];
	      if (model.static) return;
	      includedEl.append(createElement({
	        class: 'text-nowrap pad-1/4x flex space-h-1/2x align-center group',
	        children: [{
	          tag: 'label',
	          class: 'flex-fill',
	          children: [{
	            tag: 'input',
	            type: 'checkbox',
	            class: 'margin-right-1/4x',
	            value: column.id,
	            checked: true
	          }, model.header || titleize(column.id)]
	        }, {
	          tag: 'span',
	          class: 'js-move cursor-move opacity-0 group-hover:opacity-100',
	          children: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.28 20" style="width:9px"><path d="M4.27,13.05a.54.54,0,0,0-.75,0,.53.53,0,0,0,0,.75l6.1,6a.54.54,0,0,0,.76,0l6.1-6a.53.53,0,0,0,0-.75.54.54,0,0,0-.75,0L10,18.56Z" transform="translate(-3.36 0)"/><path d="M15.73,6.94a.53.53,0,0,0,.75-.75l-6.1-6a.54.54,0,0,0-.76,0l-6.1,6a.53.53,0,1,0,.75.75L10,1.43Z" transform="translate(-3.36 0)"/></svg>`
	        }]
	      }));
	    });

	    forEach(_context29 = keys$1(this.columnModels)).call(_context29, key => {
	      if (find(columns).call(columns, c => key == c.id)) return;
	      const model = this.columnModels[key];
	      if (model.static) return;
	      excludedEl.append(createElement({
	        class: 'text-nowrap pad-1/4x flex space-h-1/2x align-center group',
	        children: [{
	          tag: 'label',
	          class: 'flex-fill',
	          children: [{
	            tag: 'input',
	            type: 'checkbox',
	            class: 'margin-right-1/4x',
	            value: key
	          }, model.header || titleize(key)]
	        }, {
	          tag: 'span',
	          class: 'js-move cursor-move opacity-0 group-hover:opacity-100 hide',
	          children: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.28 20" style="width:9px"><path d="M4.27,13.05a.54.54,0,0,0-.75,0,.53.53,0,0,0,0,.75l6.1,6a.54.54,0,0,0,.76,0l6.1-6a.53.53,0,0,0,0-.75.54.54,0,0,0-.75,0L10,18.56Z" transform="translate(-3.36 0)"/><path d="M15.73,6.94a.53.53,0,0,0,.75-.75l-6.1-6a.54.54,0,0,0-.76,0l-6.1,6a.53.53,0,1,0,.75.75L10,1.43Z" transform="translate(-3.36 0)"/></svg>`
	        }]
	      }));
	    });
	  }

	  showSettingsModal() {
	    let modal;

	    let columns = from_1(this.getColumns());

	    const includedEl = createElement({
	      class: 'border rounded flex-fill'
	    });
	    const excludedEl = createElement({
	      class: 'border rounded flex-fill'
	    });
	    this.renderSettingsModalColumns(includedEl, excludedEl, columns);
	    const container = createElement('div', {
	      class: 'pad-top bg-white rounded overflow-hidden min-width-300-px border-gray-20',
	      children: [{
	        tag: 'h2',
	        class: "text-center margin-bottom",
	        children: 'Customize Columns'
	      }, {
	        class: 'flex space-h-1/2x pad-h-1/2x',
	        children: [includedEl, excludedEl]
	      }, {
	        class: 'text-xs text-uppercase text-center text-bold text-gray-30 hover:text-blue',
	        content: listenerElement('button', {
	          class: "reset pad-v-1/2x",
	          content: "Restore Defaults"
	        }, e => {
	          columns = this.defaultColumns();
	          this.renderSettingsModalColumns(includedEl, excludedEl, columns);
	        })
	      }, {
	        class: "flex pad bg-gray-10 bg-opacity-50 justify-content-end space-h",
	        children: [listenerElement('button', {
	          class: 'uniformButton -clear -gray-50',
	          content: 'Cancel'
	        }, e => {
	          modal.close();
	        }), listenerElement('button', {
	          class: 'uniformButton -green',
	          content: 'Update'
	        }, e => {
	          this.updateColumns(columns);
	          this.render();
	          modal.close();
	        })]
	      }]
	    });
	    addEventListenerFor(container, 'input', 'change', e => {
	      const container = e.delegateTarget.closest('div');

	      if (e.delegateTarget.checked) {
	        columns.push({
	          id: e.delegateTarget.value
	        });
	        includedEl.append(container);
	        container.querySelector('.js-move').classList.remove('hide');
	      } else {
	        columns = filter$1(columns).call(columns, x => x.id != e.delegateTarget.value);
	        excludedEl.append(container);
	        container.querySelector('.js-move').classList.add('hide');
	      }
	    });
	    new DragOrder({
	      el: includedEl,
	      handleSelector: '.js-move',
	      itemSelector: 'div',
	      placeholder: item => {
	        const el = item.cloneNode(true);
	        el.style.display = item.style.display;
	        el.style.opacity = 0.5;
	        return el;
	      },
	      dragholder: item => {
	        const el = item.cloneNode(true);
	        el.style.display = item.style.display;
	        el.style.width = item.offsetWidth + "px";
	        el.style.height = item.offsetHeight + "px";
	        el.style.minWidth = 'auto';
	        el.style.maxWidth = 'auto';
	        el.style.minHeight = 'auto';
	        el.style.maxHeight = 'auto';
	        el.style.position = 'fixed';
	        el.style.cursor = "grabbing";
	        el.style.background = 'rgba(255,255,255,0.8)';
	        el.style.border = '1px dashed rgba(0, 0, 0, 0.5)';
	        return el;
	      },
	      drop: items => {
	        var _context30;

	        const keys = map(_context30 = from_1(items)).call(_context30, item => item.querySelector('input').value);

	        sort(columns).call(columns, (a, b) => indexOf$1(keys).call(keys, a.id) - indexOf$1(keys).call(keys, b.id));
	      }
	    });
	    modal = new Modal({
	      content: container
	    }).render();
	    return modal;
	  }
	  /*
	      Column Resizing
	  */


	  initiateColumnResize(e) {
	    var _context31, _context32, _context33, _context34;

	    forEach(_context31 = this.el.querySelectorAll('.uniformTableGrid-header-cell')).call(_context31, el => el.classList.add('-disabled'));

	    e.delegateTarget.closest('.uniformTableGrid-header-cell').classList.remove('-disabled');
	    e.delegateTarget.closest('.uniformTableGrid-header-cell').classList.add('-active');
	    e.delegateTarget.classList.add('-hover');
	    window.addEventListener('mousemove', this.columnResize);
	    window.addEventListener('mouseup', this.endColumnResize);
	    this.columnTemplate = [];

	    forEach(_context32 = this.el.querySelectorAll('.uniformTableGrid-header-cell')).call(_context32, (el, i) => {
	      this.columnTemplate.push(el.offsetWidth);
	    });

	    this.setTemplate(this.columnTemplate);
	    let resizingColumn = e.delegateTarget.closest('.uniformTableGrid-header-cell').previousElementSibling;

	    if (e.delegateTarget.classList.contains('-end')) {
	      resizingColumn = e.delegateTarget.closest('.uniformTableGrid-header-cell');
	    }

	    this.resizingIndex = indexOf$1(_context33 = from_1(this.el.querySelectorAll('.uniformTableGrid-header-cell'))).call(_context33, resizingColumn);
	    this.startPageX = e.pageX;
	    this.startWidth = this.columnTemplate[this.resizingIndex];

	    forEach(_context34 = this.el.querySelectorAll(`.col-${resizingColumn.id}`)).call(_context34, el => {
	      el.classList.add('-resizing');
	    });
	  }

	  columnResize(e) {
	    let newWidth = this.startWidth + (e.pageX - this.startPageX);
	    this.columnTemplate[this.resizingIndex] = newWidth < 0 ? 0 : newWidth;
	    this.setTemplate(this.columnTemplate);
	  }

	  endColumnResize(e) {
	    var _context35, _context37, _context38;

	    window.removeEventListener('mousemove', this.columnResize);
	    window.removeEventListener('mouseup', this.endColumnResize);

	    forEach(_context35 = this.el.querySelectorAll('.uniformTableGrid-header-cell')).call(_context35, (cell, i) => {
	      var _context36;

	      find(_context36 = this.getColumns()).call(_context36, x => x.id == cell.id).width = this.columnTemplate[i] + "px";
	    });

	    forEach(_context37 = this.el.querySelectorAll(`.-resizing`)).call(_context37, el => {
	      el.classList.remove('-resizing');
	    });

	    this.el.querySelector('.uniformTableGrid-resize-handle.-hover').classList.remove('-hover');

	    forEach(_context38 = this.el.querySelectorAll('.-disabled')).call(_context38, el => el.classList.remove('-disabled'));

	    this.el.querySelector('.uniformTableGrid-header-cell.-active').classList.remove('-active');
	    this.saveColumns();
	  }

	}

	_defineProperty(Table, "className", 'uniformTableGrid');

	_defineProperty(Table, "columns", []);

	_defineProperty(Table, "defaultOrder", null);

	_defineProperty(Table, "_storeKey", null);

	// ----
	// record: object to get and set value from
	//        if record has addEventListener, it will listen for change and update value
	//
	// attribute: attribute of record to get and set
	// {...}: all html attributes allowed
	//
	// TODO
	// ---
	// default type based on value
	//
	// array: true for checkbox / radio
	//
	// invalid

	class BoundInput extends Component {
	  constructor(options) {
	    let prototype;

	    switch (options.type) {
	      case 'button':
	        options.tagName = 'button';
	        prototype = BoundButton.prototype;
	        break;

	      case 'checkbox':
	        prototype = BoundCheckbox.prototype;
	        break;

	      case 'radio':
	        prototype = BoundRadio.prototype;
	        break;

	      case 'select':
	        options.tagName = 'select';
	        prototype = BoundSelect.prototype;
	        break;

	      case 'textarea':
	        options.tagName = 'textarea';
	        break;

	      case 'date':
	        prototype = BoundDate.prototype;
	        break;
	    }

	    options.initialize = false;
	    super(options);

	    if (prototype) {
	      this.__proto__ = prototype;
	    }

	    this.initialize(options);
	  }

	  initialize(options) {
	    var _context;

	    if (options.load) this.load = options.load;
	    if (options.dump) this.dump = options.dump;
	    this.record = options.record;
	    this.attribute = options.attribute;
	    this.el.id = uniqueId('input');
	    this.loadFromRecord();
	    this.el.addEventListener('change', bind(_context = this.changeInput).call(_context, this));
	    this.el.addEventListener('keyup', e => {
	      if (e.key == "Escape") {
	        this.loadFromRecord();
	      }
	    });

	    if (this.record.addEventListener) {
	      this.record.addEventListener('change', this.changeRecord);
	    }
	  }

	  remove() {
	    this.record.removeEventListener('change', this.changeRecord);
	    super.remove();
	  }

	  changeInput(e) {
	    if (this.loading) return;
	    this.dumping = true;
	    this.dumpToRecord();
	    this.dumping = false;
	  }

	  dumpToRecord() {
	    this.record[this.attribute] = this.dump(this.el.value);
	  }

	  dump(v) {
	    return v;
	  }

	  changeRecord() {
	    if (this.dumping) return;
	    this.loading = true;
	    this.loadFromRecord();
	    this.loading = false;
	  }

	  loadFromRecord() {
	    const value = this.load(this.record[this.attribute], this.record);
	    if (value !== undefined) this.el.value = value;
	  }

	  load(v, record) {
	    return v;
	  }

	}

	_defineProperty(BoundInput, "tagName", 'input');

	class BoundCheckbox extends BoundInput {
	  initialize(options) {
	    super.initialize(options);

	    if (options.array || options.isArray) {
	      this.isArray = true;
	    }
	  }

	  loadFromRecord() {
	    // "on" is default, indiciating value has not been set by constructor
	    if (this.el.value == "on") {
	      this.el.value = "true";
	      this.el.checked = this.load(this.record[this.attribute] === true);
	    } else {
	      this.el.checked = this.load(this.record[this.attribute] === this.el.value);
	    }
	  }

	  dumpToRecord(e) {
	    if (this.el.value === "true") {
	      this.record[this.attribute] = this.dump(this.el.checked === true);
	    } else if (this.el.checked) {
	      this.record[this.attribute] = this.dump(this.el.value);
	    } else {
	      this.record[this.attribute] = undefined;
	    }
	  }

	}
	class BoundRadio extends BoundCheckbox {}
	class BoundDate extends BoundInput {
	  load(value) {
	    if (value instanceof Date) {
	      var month = value.getMonth() + 1 + '';
	      if (month.length == 1) month = '0' + month;
	      var date = value.getDate() + '';
	      if (date.length == 1) date = '0' + date;
	      return [value.getUTCFullYear(), month, date].join("-");
	    } else {
	      return value;
	    }
	  }

	}
	class BoundButton extends BoundInput {
	  initialize(options) {
	    var _context2;

	    // options.content removed by component, TODO fix
	    const content = options.content;
	    super.initialize(options);
	    this.el.addEventListener('click', bind(_context2 = this.changeInput).call(_context2, this));

	    if (content) {
	      append(this.el, content);
	    }
	  }

	  loadRecord() {}

	}

	_defineProperty(BoundButton, "tagName", "button");

	class BoundSelect extends BoundInput {
	  initialize(options) {
	    const value = this.load(options.record[options.attribute]);

	    if (options.options) {
	      var _context3;

	      if (options.includeBlank) {
	        const el = document.createElement('option');
	        el.innerHTML = options.includeBlank === true ? "Unset" : options.includeBlank;
	        el.selected = value ? false : true;
	        el.style.fontStyle = 'italic';
	        el.setAttribute('value', null);
	        this.el.append(el);
	      }

	      forEach(_context3 = options.options).call(_context3, option => {
	        if (option instanceof Element) return this.el.append(option);
	        const el = document.createElement('option');

	        if (isArray(option)) {
	          el.setAttribute('value', option[0]);
	          el.innerHTML = option[1];
	        } else {
	          el.setAttribute('value', option);
	          el.innerHTML = option;
	        }

	        this.el.append(el);
	      });
	    }

	    super.initialize(options);
	  }

	  loadFromRecord() {
	    const value = this.load(this.record[this.attribute]) || [];

	    if (this.el.multiple) {
	      var _context4;

	      forEach(_context4 = this.el.querySelectorAll('option')).call(_context4, option => {
	        if (includes(value).call(value, option.value)) {
	          option.setAttribute('selected', true);
	        } else {
	          option.removeAttribute('selected');
	        }
	      });
	    } else {
	      super.loadFromRecord();
	    }
	  }

	  dumpToRecord(e) {
	    if (this.el.multiple) {
	      var _context5, _context6;

	      const values = map(_context5 = filter$1(_context6 = from_1(this.el.options)).call(_context6, x => x.selected)).call(_context5, x => x.value);

	      this.record[this.attribute] = this.dump(values);
	    } else {
	      let value = this.el.value;
	      if (value == "null") value = null;
	      this.record[this.attribute] = this.dump(value);
	    }
	  }

	}

	_defineProperty(BoundSelect, "tagName", 'select');

	/*  
	    Options
	    ===

	    Column Options
	    ===
	    type: text|number|date
	    options: [] if type=text renders select with options
	    input: { options for BoundInput } || function(record, done) call done when ready to rerender cell

	    use class -no-selection on cells to not allow selection

	    Extendable
	    ===
	    cellModel

	    TODO
	    ====
	    Highlight selected cells
	    Copy/Paste with selected cells

	*/

	class SpreadsheetCell {
	  constructor(options) {
	    this.options = options;
	    this.record = options.record;
	    this.id = options.id;
	    this.el = createElement(assign({}, {
	      tabindex: '0'
	    }, options));
	    this.el.classList.add('uniformTableGrid-cell', 'col-' + options.id);
	    this.el.model = this;
	  }

	  render() {
	    var _context;

	    this.el.innerHTML = '';
	    let content;

	    if (this.options.render) {
	      content = this.options.render(this.record, this);
	    } else if (this.options.input && includes(_context = ['radio', 'checkbox', 'select']).call(_context, this.options.input.type)) {
	      content = new BoundInput(assign({
	        record: this.record,
	        attribute: this.options.attribute || this.id,
	        load: this.options.load,
	        dump: this.options.dump,
	        tabindex: '-1'
	      }, this.options.input)).el;
	    } else {
	      content = this.record[this.options.attribute || this.id];
	    }

	    this.el.append(createElement('button', {
	      type: 'button',
	      class: 'uniformSpreadsheet-cellContent',
	      content
	    }));
	    return this;
	  }

	  renderInput() {
	    let input;

	    if (typeof this.options.input == 'function') {
	      var _context2;

	      input = this.options.input(this.record, bind(_context2 = this.render).call(_context2, this));
	    } else {
	      input = createElement({
	        class: 'uniformSpreadsheet-cellInput',
	        content: new BoundInput(assign({
	          record: this.record,
	          attribute: this.id,
	          style: {
	            minHeight: this.el.offsetHeight + "px"
	          }
	        }, this.options.input)).el
	      });
	    }

	    if (input) {
	      var _context3;

	      this.el.append(input);
	      input.addEventListener('focusout', bind(_context3 = this.render).call(_context3, this));
	    }

	    return input;
	  }

	  async activate(event) {
	    let input = this.el.querySelector('input, select, textarea, button:not(.uniformSpreadsheet-cellContent)');

	    if (!input) {
	      input = await this.renderInput();
	      if (input) input = input.querySelector('input, select, textarea') || input.querySelector('button');
	    } else {
	      this.el.classList.add('-active');
	    }

	    if (input) {
	      input.focus();

	      if (input.tagName == "INPUT") {
	        if (input.type == "checkbox") {
	          if (!(event && event.target == input && event.type == "mouseup")) {
	            input.checked = !input.checked;
	            input.dispatchEvent(new Event('change'));
	            event.preventDefault();
	          }

	          this.el.focus();
	        } else {
	          input.select();
	        }
	      }
	    }
	  }

	}
	class Spreadsheet extends Table {
	  initialize(options) {
	    var _context4, _context5, _context6, _context7, _context8;

	    super.initialize.call(this, options);
	    addEventListenerFor(this.el, '.uniformTableGrid-cell', 'keydown', bind(_context4 = this.keydown).call(_context4, this));
	    addEventListenerFor(this.el, '.uniformTableGrid-cell', 'keyup', bind(_context5 = this.keyup).call(_context5, this));
	    addEventListenerFor(this.el, '.uniformTableGrid-cell', 'mousedown', bind(_context6 = this.mousedownCell).call(_context6, this));
	    addEventListenerFor(this.el, '.uniformTableGrid-cell', 'mouseup', bind(_context7 = this.mouseupCell).call(_context7, this));
	    addEventListenerFor(this.el, '.uniformTableGrid-cell', 'mouseover', bind(_context8 = this.updateCellSelection).call(_context8, this));
	  }

	  initColumnModel(model, key) {
	    if (model instanceof this.constructor.cellModel) {
	      model = {
	        prototype: model
	      };
	    } else if (typeof model == "function") {
	      model = {
	        render: model,
	        prototype: model
	      };
	    } else if (isArray(model)) {
	      model = assign({
	        render: model[0],
	        prototype: this.constructor.cellModel
	      }, model[1]);
	    } else if (typeof model == "object") {
	      model.prototype = this.constructor.cellModel;
	    } else {
	      throw 'UniformTable column in inproperly configured. Accepts function or [function, options]';
	    }

	    model.id = key;
	    return model;
	  }

	  renderCell(record, model) {
	    const options = assign({
	      record
	    }, model);

	    delete options.prototype;
	    return new model.prototype(options).render().el;
	  }
	  /*
	      Mouse Events
	  */


	  mousedownCell(e) {
	    var _context9;

	    const cell = e.delegateTarget;
	    if (cell.matches('.-no-selection')) return;
	    this.previousFocus = document.activeElement;
	    this.selecting = cell;

	    if (cell != document.activeElement && !cell.querySelector(':focus')) {
	      this.deselectCells();
	      e.preventDefault();
	      e.stopPropagation();
	      cell.focus();
	    }

	    window.addEventListener('mouseup', bind(_context9 = this.endCellSelection).call(_context9, this), {
	      once: true
	    });
	  }

	  mouseupCell(e) {
	    const cell = e.delegateTarget;
	    if (cell.matches('.-no-selection')) return;

	    if (this.selecting && this.selecting == cell && this.previousFocus == cell) {
	      cell.model.activate(e);
	    }
	  }
	  /*
	      Cell Selection
	  */


	  updateCellSelection(e) {
	    if (this.selecting) {
	      var _context10;

	      const current = this.el.querySelector('.uniformTableGrid-row > *:focus, .uniformTableGrid-row > *:focus-within') || this.el.querySelector('.uniformTableGrid-row > *');
	      const target = e.delegateTarget;
	      const currentIndex = [indexOf(current), indexOf(current.parentElement)];
	      const targetIndex = [indexOf(target), indexOf(target.parentElement)];

	      forEach(_context10 = this.el.querySelectorAll('.uniformTableGrid-row > *.selecting')).call(_context10, el => el.classList.remove('selecting'));

	      let i = Math.min(currentIndex[1], targetIndex[1]);

	      while (i <= Math.max(currentIndex[1], targetIndex[1])) {
	        const row = this.el.children[i];
	        let x = Math.min(currentIndex[0], targetIndex[0]);

	        while (x <= Math.max(currentIndex[0], targetIndex[0])) {
	          row.children[x].classList.add('selecting');
	          x += 1;
	        }

	        i += 1;
	      }
	    }
	  }

	  endCellSelection(e) {
	    var _context11;

	    const cell = e.target.closest('.uniformTableGrid-row > *');

	    if (this.selecting && cell != this.selecting) {
	      this.selecting.focus();
	      const selectedCells = this.el.querySelectorAll('.uniformTableGrid-row > *.selecting');

	      if (selectedCells.length > 0) {
	        forEach(selectedCells).call(selectedCells, el => el.classList.add('selected'));

	        const offset = offsetTo(from_1(selectedCells), this.el);
	        const pad = 1;
	        this.el.append(createElement('selection', {
	          class: 'uniformSpreadsheet-selectionOutline',
	          style: {
	            left: offset.left - pad + "px",
	            top: offset.top - pad + "px",
	            width: offset.right - offset.left + pad + "px",
	            height: offset.bottom - offset.top + pad + "px"
	          }
	        }));
	      }
	    }

	    forEach(_context11 = this.el.querySelectorAll('.uniformTableGrid-row > *.selecting')).call(_context11, el => {
	      el.classList.remove('selecting');
	    });

	    delete this.selecting;
	  }

	  deselectCells() {
	    var _context12, _context13, _context14;

	    forEach(_context12 = this.el.querySelectorAll('.uniformTableGrid-cell.-active')).call(_context12, el => {
	      el.classList.remove('-active');
	    });

	    forEach(_context13 = this.el.querySelectorAll('.uniformTableGrid-cell.selected')).call(_context13, el => {
	      el.classList.remove('selected');
	    });

	    forEach(_context14 = this.el.querySelectorAll('selection')).call(_context14, el => el.parentNode.removeChild(el));
	  }

	  initiateColumnResize() {
	    this.deselectCells();
	    return super.initiateColumnResize(...arguments);
	  }
	  /*
	      Keyboard Events
	  */


	  keydown(e) {
	    if (document.activeElement == e.delegateTarget) {
	      var _context15, _context16;

	      const cell = e.delegateTarget;

	      switch (e.key) {
	        case 'Tab':
	          this.focusCell(e.shiftKey ? "left" : "right");
	          e.preventDefault();
	          e.stopPropagation();
	          return;

	        case 'ArrowRight':
	          this.focusCell('right');
	          e.preventDefault();
	          return;

	        case 'ArrowLeft':
	          this.focusCell('left');
	          e.preventDefault();
	          return;

	        case 'ArrowUp':
	          this.focusCell('up');
	          e.preventDefault();
	          return;

	        case 'ArrowDown':
	          this.focusCell('down');
	          e.preventDefault();
	          return;
	      }

	      if (!includes(_context15 = [e.metaKey, e.ctrlKey, e.altKey]).call(_context15, true) && !includes(_context16 = ['Escape', 'Meta', 'Shift', 'Alt', 'Control', 'Tab', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Enter']).call(_context16, e.key)) {
	        this.deselectCells();
	        cell.model.activate(e);
	      }
	    } else if (e.key == "Enter") {
	      e.preventDefault();
	    }
	  }

	  keyup(e) {
	    const cell = e.delegateTarget;

	    if (document.activeElement == e.delegateTarget) {
	      if (e.key == "Enter") {
	        this.deselectCells();
	        cell.model.activate(e);
	      }
	    } else {
	      if (e.key == "Enter") {
	        e.preventDefault();
	        this.focusCell('down');
	      } else if (e.key == "Escape") {
	        cell.classList.remove('-active');
	        cell.focus();
	      }
	    }
	  }

	  focusCell(direction) {
	    const current = this.el.querySelector('.uniformTableGrid-cell:focus, .uniformTableGrid-cell:focus-within') || this.el.querySelector('.uniformTableGrid-cell');
	    const action = (direction == "up" || direction == "left" ? "previous" : "next") + 'ElementSibling';

	    if (direction == "left" || direction == "right") {
	      const cell = current[action];
	      if (cell) cell.focus();
	    } else {
	      const index = indexOf(current);
	      const row = current.parentElement[action];

	      if (row) {
	        row.children.item(index).focus();
	      } else {
	        current.focus();
	      }
	    }

	    this.deselectCells();
	  }

	}

	_defineProperty(Spreadsheet, "className", "uniformTableGrid uniformSpreadsheet");

	_defineProperty(Spreadsheet, "cellModel", SpreadsheetCell);

	function indexOf(el) {
	  var _context17;

	  return indexOf$1(_context17 = from_1(el.parentNode.childNodes)).call(_context17, el);
	}

	class Checkbox extends Component {
	  initialize(options) {
	    if (options.input instanceof Element) {
	      this.input = options.input;
	    } else {
	      this.input = createElement('input', assign({}, {
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

	  render() {
	    this.input.style.display = "none";

	    if (this.input.parentNode) {
	      this.input.parentNode.insertBefore(this.el, this.input.nextSibling);
	    } else {
	      this.el.append(this.input);
	    }

	    this.change();
	    return this;
	  }

	  change() {
	    this.el.classList.toggle('checked', this.input.checked);
	  }

	  click(e) {
	    if (this.input.disabled) return;
	    this.input.checked = !this.input.checked;
	    trigger(this.input, 'change');
	    e.preventDefault();
	  }

	  keyup(e) {
	    if (document.activeElement != this.el) return;
	    if (e.keyCode != 32) return;
	    e.preventDefault();
	    this.click(e);
	  }

	  keydown(e) {
	    if (e.keyCode == 32 && document.activeElement == this.el) {
	      // Prevent Page Scroll
	      e.preventDefault();
	    }
	  }

	}

	_defineProperty(Checkbox, "CSSClass", "uniformCheckbox");

	_defineProperty(Checkbox, "type", 'checkbox');

	class Radio extends Checkbox {}

	_defineProperty(Radio, "CSSClass", "uniformRadio");

	class Toggle extends Checkbox {}

	_defineProperty(Toggle, "CSSClass", "uniformToggle");

	exports.BoundInput = BoundInput;
	exports.Checkbox = Checkbox;
	exports.Dropdown = Dropdown;
	exports.Dropzone = Dropzone;
	exports.FloatingLabelInput = FloatingLabel;
	exports.Modal = Modal;
	exports.Popover = Popover;
	exports.Radio = Radio;
	exports.Resizer = Resizer;
	exports.Select = Select;
	exports.Spreadsheet = Spreadsheet;
	exports.TableGrid = Table;
	exports.Toggle = Toggle;
	exports.Tooltip = Tooltip;

	Object.defineProperty(exports, '__esModule', { value: true });

	return exports;

})({});
