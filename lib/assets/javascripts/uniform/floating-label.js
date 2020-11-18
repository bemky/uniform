import Component from './component';
import { isVisible, isFocus, hasClass, addClass, removeClass, css } from 'dolla';

export default class FloatingLabel extends Component {
    
    initialize(){
        this.label = this.el.querySelector('label');
        this.input = this.el.querySelector("#" + this.label.getAttribute('for'));
        this.startingHeight;
        
        this.listenTo(this.input, 'focus', this.activate);
        this.listenTo(this.input, 'blur', this.deactivate);
        this.listenTo(this.input, 'revealed', this.render);
    }
    
    render () {
        if(!isVisible(this.input)) return;
        if(hasClass(this.el, 'enabled')) return;

        var padding = parseInt(css(this.input, 'paddingBottom'));
        this.startingHeight = this.input.offsetHeight;
        addClass(this.el, 'enabled');
        addClass(this.el, 'inactive');

        this.input.style.paddingTop = padding + padding/2 + "px";
        this.input.style.paddingBottom = padding - padding/2 - 2 + "px";

        this.label.style.position = 'absolute';
        this.label.style.top = 0;
        this.label.style.left = this.label.offsetLeft;
        this.label.style.paddingLeft = css(this.input, 'paddingLeft');
        this.label.style.height = this.startingHeight;
        this.label.style.lineHeight = this.startingHeight + "px";

        if (isVisible(this.input)) this.activate();
        if (typeof this.input.value !== "undefined" && this.input.value != "") this.activate();
    }
    
    activate (e) {
        if (typeof e !== "undefined") addClass(this.el, 'active');
        if (hasClass(this.el, 'float')) return;
        addClass(this.el, 'float');
        removeClass(this.el, 'inactive');
        this.label.style.lineHeight = this.startingHeight / 2 + "px";
    }
    
    deactivate (e) {
        if (typeof e !== "undefined") removeClass(this.el, 'active');
        if (this.input.value != "") return;
        removeClass(this.el, 'float');
        addClass(this.el, 'inactive');
        this.label.style.lineHeight = this.startingHeight + "px";
    }
}