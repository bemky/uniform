import Component from './component';
import * as Helpers from './dom-helpers';

/*. Dropdown.initialize
    content:    string|el - content rendered in dropdown
    align:      'center'|'left'|'right| - how dropdown aligns to trigger el
    trigger:    'click'|'focus'|'mouseover' - what triggers showDropdown
    show_arrow: true\false - show dropdown arrow
    hide_sm:    true|false - don't show dropdown on mobile browsers
    square:     true|false - round corners on dropdown
    container:  node - append dropdown to
*/
export default class Dropdown extends Component {
    
    initialize(options){
        options = options || {}
        this.options = {
            align: 'center',
            trigger: 'click',
            show_arrow: true,
            hide_sm: false,
            square: false,
            container: document.body
        };
        this.options.container = this.options.container || document.body;
        
        Object.assign(this.options, this.pick(options, Object.keys(this.options)));
        this.content = options.content;
        this.el.dropdown = this;
        
        this.listenTo(this.el, this.options.trigger, this.toggle);
        
        this.listenTo(this.el, 'mousedown', function (){
            this.mousedown = true;
        });
    
        this.listenTo(this.el, 'mouseup', function (){
            this.mousedown = false;
        });
        
        this.listenTo(this.el, 'focus', function (){
            if(this.mousedown) return;
            this.show();
        });
        
        this.listenTo(document, 'focus', this.outsideClick);
        this.listenTo(document, this.options.trigger, this.outsideClick);
        this.listenTo(document, 'keyup', this.keyup);
        this.listenTo(window, 'resize', this.resize);
    }
    
    render () {
        this.dropdown = document.createElement('div');
        Helpers.addClass(this.dropdown, 'uniformDropdown-dropdown');
        Helpers.addClass(this.dropdown, 'absolute');
        this.dropdown.style.minWidth = Helpers.outerWidth(this.el);
        this.dropdown.innerHTML = this.content.innerHTML ? this.content.innerHTML : this.content;
        if (this.options.show_arrow) {
            Helpers.addClass(this.dropdown, 'has-pointer');
            var pointer = document.createElement('div');
            Helpers.addClass(pointer, 'uniformDropdown-pointer')
            this.dropdown.appendChild(pointer);
        }
        Helpers.toggleClass(this.dropdown, 'square', this.options.square);
        this.dropdown.style.display = 'none';
        this.options.container.appendChild(this.dropdown);
        Helpers.removeClass(this.dropdown.querySelectorAll('.hidden'), 'hidden');
        return this;
    }
    
    resize () {
        if(!this.dropdown) return;
        var offset = Helpers.offset(this.el);
        if(this.options.container != document.body){
            offset = {
                left: this.el.offsetLeft,
                top: this.el.offsetTop
            }
        }
        this.dropdown.style.top = offset.top + this.el.offsetHeight + "px";
        
        if (this.options.align == "center") {
            this.dropdown.style.left = offset.left + this.el.offsetWidth / 2 - this.dropdown.offsetWidth / 2 + "px";
        } else if(this.options.align == "right") {
            this.dropdown.style.right = window.innerWidth - (offset.left + this.el.offsetWidth) + "px";
        } else {
            this.dropdown.style.left = offset.left + "px";
        }
        if (this.dropdown.style.left && this.dropdown.style.left + this.dropdown.offsetWidth > window.innerWidth) {
            this.dropdown.style.left = window.innerWidth - this.dropdown.offsetWidth + "px";
        }
    }
    
    remove () {
        Component.prototype.remove.apply(this, arguments);
        if(this.dropdown.parentNode) this.dropdown.parentNode.removeChild(this.dropdown);
        delete this.dropdown;
    }
    
    toggle (e) {
        if (Helpers.hasClass(this.el, 'active') && e.type == "click") {
            this.hide();
        } else {
            this.show();
        }
    }
    
    show (options) {
        options || (options = {});
        if(this.options.hide_sm && window.innerWidth < 720) return;
        if(!this.dropdown) this.render();
        
        this.dropdown.style.display = 'block';
        Helpers.addClass(this.el, 'active');
        
        this.resize();

        this.overlay = document.createElement('div');
        Helpers.addClass(this.overlay, 'uniformOverlay');
        document.body.appendChild(this.overlay);

        if (window.innerWidth < 720) {
            this.lastScrollPosition = window.scrollY;
            Helpers.addClass(document.body, 'uniformModal-hideBody');
        }

        this.listenTo(this.overlay, 'click', this.hide);
        if(!options.silent) this.trigger('shown');
    }
    
    hide (options) {
        options || (options = {});
        if(!this.dropdown) return;
        if(!Helpers.hasClass(this.el, 'active')) return;
        this.dropdown.style.display = 'none';
        Helpers.removeClass(this.el, 'active');
        if (this.overlay && this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay)
        if (window.innerWidth < 720) {
            Helpers.removeClass(document.body, 'uniformModal-hideBody');
            window.scrollTo(0, this.lastScrollPosition);
        }
        if(!options.silent) this.trigger('hidden');
    }
    
    outsideClick (e) {
        if (!this.dropdown || this.dropdown.offsetParent === null) return;
        if (e.target === this.el) return;
        if (e.target === this.overlay) return;
        if (this.el.contains(e.target)) return;
        if (this.dropdown.contains(e.target)) return;
        this.hide();
    }
    
    keyup (e) {
        if(e.which != 27) return;
        this.hide();
    }
}
