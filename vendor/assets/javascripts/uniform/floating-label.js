import Component from './component';
import * as Helpers from './dom-helpers';

export default class FloatingLabel extends Component {
    
    initialize(){
        this.label = this.el.querySelector('label');
        this.input = this.el.querySelector("#" + this.label.getAttribute('for'));
        this.startingHeight;
        
        this.input.addEventListener('focus', this.activate.bind(this));
        this.input.addEventListener('blur', this.deactivate.bind(this));
        this.input.addEventListener('revealed', this.render.bind(this));
    }
    
    render () {
        if(!Helpers.is_visible(this.input)) return;
        if(Helpers.hasClass(this.el, 'enabled')) return;

        var padding = parseInt(Helpers.css(this.input, 'paddingBottom'));
        this.startingHeight = this.input.offsetHeight;
        Helpers.addClass(this.el, 'enabled');
        Helpers.addClass(this.el, 'inactive');

        this.input.style.paddingTop = padding + padding/2 + "px";
        this.input.style.paddingBottom = padding - padding/2 - 2 + "px";

        this.label.style.position = 'absolute';
        this.label.style.top = 0;
        this.label.style.left = this.label.offsetLeft;
        this.label.style.paddingLeft = Helpers.css(this.input, 'paddingLeft');
        this.label.style.height = this.startingHeight;
        this.label.style.lineHeight = this.startingHeight + "px";

        if (Helpers.is_focus(this.input)) this.activate();
        if (typeof this.input.value !== "undefined" && this.input.value != "") this.activate();
    }
    
    activate (e) {
        if (typeof e !== "undefined") Helpers.addClass(this.el, 'active');
        if (Helpers.hasClass(this.el, 'float')) return;
        Helpers.addClass(this.el, 'float');
        Helpers.removeClass(this.el, 'inactive');
        this.label.style.lineHeight = this.startingHeight / 2 + "px";
    }
    
    deactivate (e) {
        if (typeof e !== "undefined") Helpers.removeClass(this.el, 'active');
        if (this.input.value != "") return;
        Helpers.removeClass(this.el, 'float');
        Helpers.addClass(this.el, 'inactive');
        this.label.style.lineHeight = this.startingHeight + "px";
    }
}