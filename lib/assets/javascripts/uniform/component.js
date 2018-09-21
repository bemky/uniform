export default class Component {
    constructor(options){
        options = options || {};
        this.eventListeners = new Array();
        this.el = options.el || document.createElement('div')
        
        this.$el = $(this.el);//remove
    
        this.on = function (type, handler) {
            this.eventListeners.push({
                type: type,
                handler: handler
            });
        };
        
        this.off = function (type, handler) {
            this.eventListeners = this.eventListeners.filter(function(listener){
                return !(listener.type == type && listener.handler)
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
    }
    
    pick (object, keys) {
        var newObject = {}
        keys.forEach(function(key){
            if(object[key] !== undefined) newObject[key] = object[key];
        });
        
        return newObject;
    }
    
    extend (object, objectMaster) {
        
        return
    }
    
    initialize(){}
}