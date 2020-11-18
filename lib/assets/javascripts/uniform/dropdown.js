import Component from './component';
import {addClass, outerWidth, toggleClass, hasClass, removeClass, offset, outerHeight} from 'dolla';

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
            align: 'center bottom',
            trigger: 'click',
            show_arrow: true,
            hide_sm: false,
            square: false,
            container: document.body,
            offset: {}
        };
        this.options.container = this.options.container || document.body;
        
        Object.assign(this.options, this.pick(options, Object.keys(this.options)));
        this.content = options.content;
        this.dropdown = document.createElement('div');
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
        addClass(this.dropdown, 'uniformDropdown-dropdown');
        addClass(this.dropdown, 'absolute');
        this.dropdown.style.minWidth = outerWidth(this.el);
        this.dropdown.innerHTML = this.content.innerHTML ? this.content.innerHTML : this.content;
        if (this.options.show_arrow) {
            addClass(this.dropdown, 'has-pointer');
            var pointer = document.createElement('div');
            addClass(pointer, 'uniformDropdown-pointer')
            this.dropdown.appendChild(pointer);
        }
        toggleClass(this.dropdown, 'square', this.options.square);
        this.dropdown.style.display = 'none';
        this.options.container.appendChild(this.dropdown);
        removeClass(this.dropdown.querySelectorAll('.hidden'), 'hidden');
        return this;
    }
    
    resize () {
        this.setPosition();
        
        var align = this.options.align.split(" ");
        var reposition = false;
        if (offset(this.dropdown).top + outerHeight(this.dropdown) > Math.max(document.body.offsetHeight, window.innerHeight)) {
            align[1] = "top";
            reposition = true;
        }
        if (offset(this.dropdown).top < 0) {
            align[1] = "bottom";
            reposition = true;
        }
        if (offset(this.dropdown).left < 0) {
            align[0] = "right";
            reposition = true;
        }
        if (offset(this.dropdown).left + outerWidth(this.dropdown) > document.body.offsetWidth) {
            align[0] = "left";
            reposition = true;
        }
        if(reposition) this.setPosition(align.join(" "))
    }

    
    setPosition(align){
        align = align || this.options.align;
        var [leftAlign, topAlign] = align.split(" ");
        leftAlign = leftAlign || "bottom";
        topAlign = topAlign || "bottom";
        
        var offset = offset(this.el);
        var container = this.options.container;
        if(getComputedStyle(container)['position'] == "static") container = container.offsetParent;
        if(!container) container = document.body;

        var containerOffset = offset(container);
        offset = {
            top: offset.top - containerOffset.top,
            left: offset.left - containerOffset.left
        }
        
        var position = {};
        if(leftAlign == 'left'){
            position.right = outerWidth(container) - offset.left;
        } else if(leftAlign == 'center'){
            position.left = offset.left + outerWidth(this.el) / 2 - outerWidth(this.dropdown) / 2;
        } else if (leftAlign == 'right'){
            position.left = offset.left + outerWidth(this.el);
        } else if (leftAlign.includes("%")){
            position.left = offset.left + outerWidth(this.el) * parseInt(leftAlign) / 100;
        } else if (leftAlign.includes("px")){
            position.left = offset.left + outerWidth(this.el) + parseInt(leftAlign);
        }
        
        if(topAlign == 'top'){
            position.top = offset.top - outerHeight(this.dropdown);
        } else if(topAlign == 'center'){
            position.top = offset.top + outerHeight(this.el) / 2 - outerHeight(this.dropdown) / 2;
        } else if (topAlign == 'bottom'){
            position.top = offset.top + outerHeight(this.el);
        } else if (topAlign.includes("%")){
            position.top = offset.top + outerHeight(this.el) * parseInt(topAlign) / 100;
        } else if (topAlign.includes("px")){
            position.top = offset.top + outerHeight(this.el) + parseInt(topAlign);
        }
        
        if(this.options.offset.left) position.left += parseInt(this.options.offset.left);
        if(this.options.offset.top) position.top += parseInt(this.options.offset.top);
        if(this.options.offset.left) position.right -= parseInt(this.options.offset.left);
        
        this.dropdown.style.left = 'auto';
        this.dropdown.style.right = 'auto';
        removeClass(this.dropdown, 'popover-left popover-right popover-center popover-top popover-bottom');
        addClass(this.dropdown, 'popover-' + topAlign);
        addClass(this.dropdown, 'popover-' + leftAlign);
        Object.keys(position).forEach(function(key){
            this.dropdown.style[key] = position[key] + "px";
        }, this);
    }
    
    remove () {
        Component.prototype.remove.apply(this, arguments);
        if(this.dropdown.parentNode) this.dropdown.parentNode.removeChild(this.dropdown);
        delete this.dropdown;
    }
    
    toggle (e) {
        if (hasClass(this.el, 'active') && e.type == "click") {
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
        addClass(this.el, 'active');
        
        this.resize();

        this.overlay = document.createElement('div');
        addClass(this.overlay, 'uniformOverlay');
        document.body.appendChild(this.overlay);

        if (window.innerWidth < 720) {
            this.lastScrollPosition = window.scrollY;
            addClass(document.body, 'uniformModal-hideBody');
        }

        this.listenTo(this.overlay, 'click', this.hide);
        if(!options.silent) this.trigger('shown');
    }
    
    hide (options) {
        options || (options = {});
        if(!this.dropdown) return;
        if(!hasClass(this.el, 'active')) return;
        this.dropdown.style.display = 'none';
        removeClass(this.el, 'active');
        if (this.overlay && this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay)
        if (window.innerWidth < 720) {
            removeClass(document.body, 'uniformModal-hideBody');
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
