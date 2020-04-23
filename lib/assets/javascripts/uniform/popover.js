import Component from './component';
import * as Helpers from './dom-helpers';

/*
    Requirements
    ---
    content:        html|node
    anchor:         node
    
    Options
    ---
    align:          [left|right|center|#px] [top|center|bottom|#px] | default: 'center bottom'
    zIndex:         # | default: unset
    offset:         {left: 0, top: 0}
*/
export default class Popover extends Component {
    initialize (options) {
        this.showing = false;
        options = options || {};
        this.options = {
            zIndex: 3,
            container: document.body,
            align: 'center bottom',
            anchor: document.body,
            content: 'needs content',
            offset: {left: 0, top: 0}
        };
        Object.assign(this.options, this.pick(options, Object.keys(this.options)));
        
        this.listenTo(document, 'click', this.checkFocus);
        this.listenTo(document, 'focusin', this.checkFocus);
        this.listenTo(document, 'keyup', this.checkEscape);
        this.listenTo(window, 'resize', () => {
          this.resize.bind(this)()
        });
        
        if(typeof this.options.container == "string"){
          this.options.container = Helpers.closest(this.options.anchor, this.options.container)
          this.options.container = this.options.container || document.body
        }
    }
    
    render () {
        this.showing = true;
        this.el.style.position = 'absolute';
        this.el.style.zIndex = this.options.zIndex;
        
        if(this.options.content instanceof Node)
            this.el.appendChild(this.options.content);
        else
            this.el.innerHTML = this.options.content;
        
        this.options.container.appendChild(this.el);
        this.resize();
        this.trigger('shown');
        
        return this;
    }
    
    resize () {
        this.setPosition();
        const bounds = this.el.getBoundingClientRect();
        const body_bounds = document.body.getBoundingClientRect();
        const window_bounds = {
          top: 0,
          bottom: window.innerHeight,
          left: 0,
          right: window.innerWidth
        };
        
        var reposition = false;
        if (bounds.bottom > body_bounds.bottom && bounds.bottom > window_bounds.bottom) {
            const difference = body_bounds.bottom - bounds.bottom
            if(this.el.style.top != null) this.el.style.top = parseInt(this.el.style.top) - difference + "px"
            if(this.el.style.bottom != null) this.el.style.bottom = parseInt(this.el.style.bottom) + difference + "px"
        }
        if (bounds.top < body_bounds.top) {
            const difference = body_bounds.top - bounds.top
            if(this.el.style.top != null) this.el.style.top = parseInt(this.el.style.top) + difference + "px"
            if(this.el.style.bottom != null) this.el.style.bottom = parseInt(this.el.style.bottom) - difference + "px"
        }
        if (bounds.left < body_bounds.left) {
            const difference = body_bounds.left - bounds.left
            if(this.el.style.left != null) this.el.style.left = parseInt(this.el.style.left) + difference + "px"
            if(this.el.style.right != null) this.el.style.right = parseInt(this.el.style.right) - difference + "px"
        }
        if (bounds.right > body_bounds.right) {
            const difference = body_bounds.right - bounds.right
            if(this.el.style.left != null) this.el.style.left = parseInt(this.el.style.left) + difference + "px"
            if(this.el.style.right != null) this.el.style.right = parseInt(this.el.style.right) - difference + "px"
        }
    }
    
    setPosition(align){
        align = align || this.options.align;
        var [leftAlign, topAlign] = align.split(" ");
        leftAlign = leftAlign || "bottom";
        
        var offset = Helpers.offset(this.options.anchor);
        var container = this.options.container;
        if(getComputedStyle(container)['position'] == "static") container = container.offsetParent;
        if(!container) container = document.body;

        var containerOffset = Helpers.offset(container);
        offset = {
            top: offset.top - containerOffset.top,
            left: offset.left - containerOffset.left
        }
        
        var position = {};
        if(leftAlign == 'left'){
            position.right = Helpers.outerWidth(container) - offset.left;
        } else if(leftAlign == 'center'){
            position.left = offset.left + Helpers.outerWidth(this.options.anchor) / 2 - Helpers.outerWidth(this.el) / 2;
        } else if (leftAlign == 'right'){
            position.left = offset.left + Helpers.outerWidth(this.options.anchor);
        } else if (leftAlign.includes("px")){
            position.left = offset.left + parseInt(leftAlign);
        }
        
        if(topAlign == 'top'){
            let height = Helpers.outerHeight(container);
            if(container == document.body && getComputedStyle(container)['position'] == "static"){
              height = window.innerHeight;
            } else if (container == document.body) {
              height = Math.max(height, document.body.clientHeight);
            }
            position.bottom = height - offset.top;
        } else if(topAlign == 'center'){
            position.top = offset.top + Helpers.outerHeight(this.options.anchor) / 2;
            position.transform = "translateY(-50%)";
        } else if (topAlign == 'bottom'){
            position.top = offset.top + Helpers.outerHeight(this.options.anchor);
        } else if (topAlign.includes("px")){
            position.top = offset.top + parseInt(topAlign);
        }
        
        if(this.options.offset.left) position.left += parseInt(this.options.offset.left);
        if(this.options.offset.left) position.right -= parseInt(this.options.offset.left);
        if(this.options.offset.top) position.top += parseInt(this.options.offset.top);
        if(this.options.offset.top) position.bottom -= parseInt(this.options.offset.top);
        
        this.el.style.left = null;
        this.el.style.right = null;
        this.el.style.top = null;
        this.el.style.bottom = null;
        this.el.style.transform = null;
        Helpers.removeClass(this.el, 'popover-left popover-right popover-center popover-top popover-bottom');
        Helpers.addClass(this.el, 'popover-' + topAlign);
        Helpers.addClass(this.el, 'popover-' + leftAlign);
        Object.keys(position).forEach(function(key){
            this.el.style[key] = position[key] + (key != "transform" ? "px" : "");
        }, this);
    }
    
    checkFocus (e) {
        if (e.defaultPrevented)             return;
        if (!this.showing)                return;
        if (e.target === this.el)           return;
        if (e.target == this.options.anchor)        return;
        if (this.el.contains(e.target))     return;
        if (this.options.anchor.contains(e.target)) return;
        this.hide();
    }
    
    checkEscape (e) {
        if(e.which != 27) return;
        this.hide();
    }
    
    isHidden() {
        return !this.showing;
    }
    
    hide (options) {
        options = options || {};
        if(!this.showing) return;
        this.el.style.display = 'none';
        this.showing = false;
        if(options.silent !== true) {
          this.trigger('hidden');
        }
    }
    
    show () {
        if(this.showing) return;
        this.el.style.display = 'block';
        this.showing = true;
        this.trigger('shown');
    }
    
    toggle(flag) {
        flag = flag || this.showing;
        if(flag) this.hide(); else this.show();
    }
}