import Component from './component';
import { offset, offsetTo, outerWidth, outerHeight, append, css } from 'dolla';

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
    container:      element to append popover to. default: document
    transition:     string (reference transition classes in utilities)

    TODO
    ---
    use https://developer.chrome.com/blog/tether-elements-to-each-other-with-css-anchor-positioning/?ck_subscriber_id=1747048115
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
            offset: {left: 0, top: 0},
            transition: false
        };
        Object.assign(this.options, this.pick(options, Object.keys(this.options)));
        this.el.removeAttribute('content');
        
        this.options.anchor.uniformPopover = this
        this.listenTo(document, 'click', this.checkFocus);
        this.listenTo(document, 'focusin', this.checkFocus);
        this.listenTo(document, 'keyup', this.checkEscape);
        this.listenTo(window, 'resize', () => {
            this.resize.bind(this)()
        });
        
        if(typeof this.options.container == "string"){
            this.options.container = this.options.anchor.closest(this.options.container)
        }
        this.options.container = this.options.container || document.body
        
    }
    
    append () {
        this.options.container.appendChild(this.el);
    }
    
    render () {
        this.showing = true;
        this.el.style.position = 'absolute';
        this.el.style.zIndex = this.options.zIndex;
        this.content = document.createElement('div')
        if (this.options.transition) {
            this.content.classList.add(this.options.transition, '-out')
        }
        append(this.el, this.content)
        append(this.content, this.options.content);
        this.append();
        this.resize();
        
        if (this.options.transition) {
            this.content.classList.remove('-out')
            this.transitionDuration = Math.max(...css(this.content, 'transition-duration').split(", ").map(x => parseFloat(x))) * 1000
        }
        
        this.trigger('shown');
        
        return this;
    }
    
    resize () {
        this.setPosition();
        let bounds = this.el.getBoundingClientRect();
        const body_bounds = document.body.getBoundingClientRect();
        const window_bounds = {
            top: 0,
            bottom: window.innerHeight,
            left: 0,
            right: window.innerWidth
        };
        
        var reposition = false;
        if (bounds.bottom > Math.max(body_bounds.bottom, window_bounds.bottom)) {
            var [leftAlign, topAlign] = this.options.align.split(" ");
            this.setPosition(`${leftAlign} top`);
            bounds = this.el.getBoundingClientRect()
            if(bounds.top < 0) {
                this.setPosition(`${leftAlign} bottom`);
            }
            bounds = this.el.getBoundingClientRect()
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
                    bounds = this.el.getBoundingClientRect()
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
        
        var container = this.options.container;
        var anchorOffset = offsetTo(this.options.anchor, container);
        if(getComputedStyle(container)['position'] == "static") container = container.offsetParent;
        if(!container) container = document.body;
        
        var position = {};
        if(leftAlign == 'left'){
            position.right = outerWidth(container) - anchorOffset.left;
        } else if(leftAlign == 'center'){
            position.left = anchorOffset.left + outerWidth(this.options.anchor) / 2;
            position.transform = "translateX(-50%)";
        } else if (leftAlign == 'right'){
            position.left = anchorOffset.left + outerWidth(this.options.anchor);
        } else if (leftAlign.includes("px")){
            position.left = anchorOffset.left + parseInt(leftAlign);
        }
        
        if(topAlign == 'top'){
            let height = outerHeight(container);
            if(container == document.body && getComputedStyle(container)['position'] == "static"){
                height = window.innerHeight;
            } else if (container == document.body) {
                height = Math.max(height, document.body.clientHeight);
            }
            position.bottom = height - anchorOffset.top;
        } else if(topAlign == 'center'){
            position.top = anchorOffset.top + outerHeight(this.options.anchor) / 2;
            position.transform = "translateY(-50%)";
        } else if (topAlign == 'bottom'){
            position.top = anchorOffset.top + outerHeight(this.options.anchor);
        } else if (topAlign.includes("px")){
            position.top = anchorOffset.top + parseInt(topAlign);
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
        this.el.classList.remove('popover-left', 'popover-right', 'popover-center', 'popover-top', 'popover-bottom');
        this.el.classList.add('popover-' + topAlign);
        this.el.classList.add('popover-' + leftAlign);
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
        if (this.persisting) return;
        this.hide();
    }
    
    checkEscape (e) {
        if(e.which != 27) return;
        if (this.persisting) return;
        this.hide();
    }
    
    isHidden() {
        return !this.showing;
    }
    
    hide (options) {
        options = options || {};
        if (!this.showing) return;

        this.content.classList.add('-out')
        this.showing = false;
        setTimeout(() => {
            this.el.remove();
            if (options.silent !== true) {
                this.trigger('hidden');
            }
        }, this.transitionDuration || 0)
    }
    
    show () {
        if(this.showing) return;

        this.append();
        this.resize();
        this.content.classList.remove('-out');
        this.showing = true;
        setTimeout(() => {
            this.trigger('shown');
        }, this.transitionDuration || 0)
    }
    
    toggle(flag) {
        flag = flag || this.showing;
        if (flag) this.hide(); else this.show();
    }
    
    persist() {
        this.persisting = true;
    }
    
    unpersist() {
        this.persisting = false;
    }
}