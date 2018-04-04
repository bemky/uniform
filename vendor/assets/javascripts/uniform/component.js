export default class Component {
    constructor(options){
        this.eventListeners = new Array();
        if (options.el) {
            this.$el = (options.el instanceof $) ? options.el : $(options.el);
        } else {
            this.$el = $('<div>');
        }
        this.el = this.$el[0]
    
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
    }
    
    pick (object, keys) {
        var newObject = {}
        keys.forEach(function(key){
            if(object[key] !== undefined) newObject[key] = object[key];
        });
        
        return newObject;
    }
    
    initialize(){}
}