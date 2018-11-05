import Component from './component';
import * as Helpers from './dom-helpers';

/*  UniformModal.initialize
    Options
    content:    string|$el|function
    klass:      string - classes to append to modal container
*/
export default class Modal extends Component {
    
    initialize (options) {
        this.options = {};
        this.options.klass = options.klass || false;
        this.content = options.content;

        Helpers.addClass(this.el, 'uniformModal');
        document.addEventListener('keyup', this.keyup.bind(this));
        this.el.addEventListener('click', this.checkCloseButton.bind(this));
    }
    
    keyup (e) {
        if(e.which != 27) return;
        this.close();
    }
    
    render () {
        var that = this;
        var content = typeof this.content == 'function' ? this.content() : this.content;

        this.highest_z_index = 0;
        this.overlay = document.createElement('div');
        Helpers.addClass(this.overlay, 'uniformModal-overlay');
        
        this.blur = document.createElement('div');
        Helpers.addClass(this.blur, 'uniformModal-blur');
        
        this.original_scroll = window.scrollY;
        this.blur.style.top = 0 - this.original_scroll + "px";

        if (document.body.querySelectorAll('.uniformModal').length > 0) {
            this.highest_z_index = Math.max(Array.prototype.map.call(document.body.querySelectorAll('.uniformModal'), function(el){
                return parseInt(Helpers.css(el, 'zIndex'));
            }));
            this.el.style.zIndex = this.highest_z_index + 2;
        }
        
        this.el.appendChild(this.overlay);
        
        var elements = document.body.children;
        var elementCount = elements.length
        for(var i=0; i < elementCount; i++){
            this.blur.appendChild(elements[0])
        }

        Helpers.addClass(document.body, 'uniformModal-active');
        document.body.appendChild(this.blur);
        document.body.appendChild(this.el);
        
        var container = document.createElement('div');
        Helpers.addClass(container, 'uniformModal-container');
        if (content.innerHTML) {
            container.appendChild(content)
        } else {
            container.innerHTML = content;
        }

        var closeButton = document.createElement('div');
        Helpers.addClass(closeButton, 'uniformModal-close');
        container.appendChild(closeButton);
        
        this.el.style.top = window.scrollY;
        this.overlay.addEventListener('click', this.close.bind(this));
        this.el.appendChild(container);

        if (this.options.klass) Helpers.addClass(container, this.options.klass);
        if (content.innerHTML) Helpers.trigger(content, 'rendered');
        this.trigger('rendered');

        return this;
    }
    
    checkCloseButton (e) {
        if(Helpers.hasClass(e.target, 'uniformModal-close'))
            this.close();
    }
    
    close () {
        Helpers.removeClass(document.querySelectorAll('uniformModal-active'), 'uniformModal-active');
        var elements = this.blur.children;
        var elementCount = elements.length
        for(var i=0; i < elementCount; i++){
            document.body.appendChild(elements[0]);
        }
        this.blur.parentNode.removeChild(this.blur);
        window.scrollTo(0, this.original_scroll);
        this.trigger('closed');
        this.remove();
    }
    
    remove () {
        this.overlay.parentNode.removeChild(this.overlay);
        if(this.el.parentNode) this.el.parentNode.removeChild(this.el);
        this.el.removeEventListener('click', this.checkCloseButton.bind(this));
        this.overlay.removeEventListener('click', this.close.bind(this));
        document.removeEventListener('keyup', this.keyup.bind(this));
    }
}