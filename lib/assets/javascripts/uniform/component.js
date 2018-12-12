import {uniqueId} from './dom-helpers';

export default class Component {
    constructor(options){
        options = options || {};
        var that = this;
        this.eventListens = new Array();
        this.eventListeners = new Array();
        this.el = options.el || document.createElement('div')
        this.cid = uniqueId('c')
    
        this.on = function (type, handler) {
            that.eventListeners.push({
                type: type,
                handler: handler
            });
        };
        
        this.off = function (type, handler) {
            that.eventListeners = that.eventListeners.filter(function(listener){
                return !(listener.type == type && listener.handler)
            });
        };
    
        this.trigger = function (event_key) {
            for (var i = 0; i < that.eventListeners.length; i++) {
                if(that.eventListeners[i].type == "*" || that.eventListeners[i].type == "all" || event_key == that.eventListeners[i].type){
                    that.eventListeners[i].handler(event_key, that);
                }
            }
        };
        
        this.initialize(options);
    }
    
    pick (object, keys) {
        var newObject = {}
        keys.forEach(function(key){
            if(object[key] !== undefined) newObject[key] = object[key];
        });
        
        return newObject;
    }
    
    listenTo(node, event, callback, context){
        context || (context = this);
        var listen = [
            node,
            event,
            callback.bind(context)
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
        this.eventListens.forEach(function(listen){
            listen[0].removeEventListener(listen[1], listen[2]);
        });
        delete this.eventListens;
        delete this.eventListeners;
        if(this.el.parentNode) this.el.parentNode.removeChild(this.el);
        delete this.el;
    }
    
    initialize(){}
}