(function() {
    uniformHelpers = {}
    
    var nativeIsArray = Array.isArray;
    var property = function(key) {
        return function(obj) {
            return obj == null ? void 0 : obj[key];
        };
    };
    var flatten = function(input, shallow, strict, startIndex) {
        var output = [], idx = 0;
        for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
            var value = input[i];
            if (isArrayLike(value) && (uniformHelpers.isArray(value) || uniformHelpers.isArguments(value))) {
                if (!shallow) value = flatten(value, shallow, strict);
                var j = 0, len = value.length;
                output.length += len;
                while (j < len) {
                    output[idx++] = value[j++];
                }
            } else if (!strict) {
                output[idx++] = value;
            }
        }
        return output;
    };
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = property('length');
    var isArrayLike = function(collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };
    
    uniformHelpers.has = function(obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };
    uniformHelpers.isArguments = function(obj) {
        return uniformHelpers.has(obj, 'callee');
    };
    uniformHelpers.isArray = nativeIsArray || function(obj) {
        return toString.call(obj) === '[object Array]';
    };
    
    uniformHelpers.isFunction = function(obj) {
        return typeof obj == 'function' || false;
    };
    uniformHelpers.pick = function(object, oiteratee, context) {
        var result = {}, obj = object, iteratee, keys;
        if (obj == null) return result;
        if (uniformHelpers.isFunction(oiteratee)) {
            keys = obj.keys();
            iteratee = optimizeCb(oiteratee, context);
        } else {
            keys = flatten(arguments, false, false, 1);
            iteratee = function(value, key, obj) { return key in obj; };
            obj = Object(obj);
        }
        for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];
            var value = obj[key];
            if (iteratee(value, key, obj)) result[key] = value;
        }
        return result;
    };
    
}.call(this));

function UniformComponent (options) {
    this.eventListeners = new Array();
    this.$el = $('<div>');
    
    this.on = function (type, handler) {
        this.eventListeners.push({
            type: type,
            handler: handler
        });
    };
    
    this.trigger = function (event_key) {
        for (var i = 0; i < this.eventListeners.length; i++) {
            if(this.eventListeners[i].type == "*" || this.eventListeners[i].type == "all" || event_key == this.eventListeners[i].type){
                this.eventListeners[i].handler(event_key, this);
            }
        }
    };
    
    this.initialize(options);
    
    return this;
}
UniformComponent.prototype.initialize = function () {}