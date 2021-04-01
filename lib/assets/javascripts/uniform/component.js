import {hasClass, HTML_ATTRIBUTES, createElement} from 'dolla';

function uniqueId(prefix){
    window.idCounter || (window.idCounter = 0);
    var id = ++window.idCounter + '';
    return prefix ? prefix + id : id;
}

export default class Component {

    constructor(options){
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
        
        this.off = function (type, handler) {
            if(!this.eventListeners) return;
            this.eventListeners = this.eventListeners.filter(function(listener){
                return !(listener.type == type && listener.handler)
            });
        }.bind(this);
    
        this.trigger = function (event_key) {
            if(!this.eventListeners) return;
            this.eventListeners.forEach(function(listener){
                if(listener.type == "*" || listener.type == "all" || event_key == listener.type){
                    listener.handler(event_key, this);
                }
            })
        };
        
        this.initialize(options);
    }
    
    addEventListener () {
      this.on.apply(this, arguments);
    }
    
    removeEventListener () {
      this.off.apply(this, arguments);
    }
    
    pick (object, keys) {
        var newObject = {}
        keys.forEach(function(key){
            if(object[key] !== undefined) newObject[key] = object[key];
        });
        
        return newObject;
    }
    
    /*
        listenTo(el, 'click', '.inner_class', f(), this)
        listenTo(el, 'click', f(), this)
    */
    listenTo(node, event, scope, callback, context){
        // scope is optional param
        if(typeof scope != "string") {
            context = callback
            callback = scope
            scope = false;
        }
        context || (context = this);
        var listen = [
            node,
            event,
            function(e){
                if(!scope || (e.target.matches(scope) || e.target.closest(scope))) {
                  return callback.bind(context)(...arguments);
                }
            }.bind(context)
        ]
        this.eventListens.push(listen);
        node.addEventListener(event, listen[2]);
    }
    
    listenToOnce(node, event, callback, context){
        context || (context = this);
        var onceCallback = function(e){
            node.removeEventListener(event, onceCallback);
            return callback.apply(context, arguments);
        }
        var listen = [
            node,
            event,
            onceCallback
        ]
        this.eventListens.push(listen);
        node.addEventListener(event, onceCallback);
    }
    
    remove () {
        this.trigger('removed');
        
        if(this.eventListens) this.eventListens.forEach(function(listen){
            listen[0].removeEventListener(listen[1], listen[2]);
        });
        delete this.eventListens;
        delete this.eventListeners;
        if(this.el && this.el.parentNode) this.el.parentNode.removeChild(this.el);
        delete this.el;
    }
    
    initialize(){}
}