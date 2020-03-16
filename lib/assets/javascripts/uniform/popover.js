import Component from './component';
import * as Helpers from './dom-helpers';

/*
    Requirements
    ---
    content:        html|node
    anchor:         node
    
    Options
    ---
    align:          [left|right|center|#%|#px] [top|center|bottom|#%|#px] | default: 'center bottom'
    zIndex:         # | default: unset
    offset:         {left: 0, top: 0}
*/
export default class Popover extends Component {
    initialize (options) {
        this.showing = false;
        options = options || {};
        this.options = {
            zIndex: 2,
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
        
        var align = this.options.align.split(" ");
        var reposition = false;
        if (Helpers.offset(this.el).top + Helpers.outerHeight(this.el) > Math.max(document.body.offsetHeight, window.innerHeight)) {
            align[1] = "top";
            reposition = true;
        }
        if (Helpers.offset(this.el).top < 0) {
            align[1] = "bottom";
            reposition = true;
        }
        if (Helpers.offset(this.el).left < 0) {
            align[0] = "right";
            reposition = true;
        }
        if (Helpers.offset(this.el).left + Helpers.outerWidth(this.el) > document.body.offsetWidth) {
            align[0] = "left";
            reposition = true;
        }
        // if(reposition) this.setPosition(align.join(" "))
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
        } else if (leftAlign.includes("%")){
            position.left = offset.left + Helpers.outerWidth(this.options.anchor) * parseInt(leftAlign) / 100;
        } else if (leftAlign.includes("px")){
            position.left = offset.left + Helpers.outerWidth(this.options.anchor) + parseInt(leftAlign);
        }
        
        if(topAlign == 'top'){
            let height = Helpers.outerHeight(container);
            if(container == document.body){
              height = Math.max(height, document.documentElement.scrollHeight)
            }
            position.bottom = height - offset.top;
        } else if(topAlign == 'center'){
            position.top = offset.top + Helpers.outerHeight(this.options.anchor) / 2 - Helpers.outerHeight(this.el) / 2;
        } else if (topAlign == 'bottom'){
            position.top = offset.top + Helpers.outerHeight(this.options.anchor);
        } else if (topAlign.includes("%")){
            position.top = offset.top + Helpers.outerHeight(this.options.anchor) * parseInt(topAlign) / 100;
        } else if (topAlign.includes("px")){
            position.top = offset.top + Helpers.outerHeight(this.options.anchor) + parseInt(topAlign);
        }
        
        if(this.options.offset.left) position.left += parseInt(this.options.offset.left);
        if(this.options.offset.left) position.right -= parseInt(this.options.offset.left);
        if(this.options.offset.top) position.top += parseInt(this.options.offset.top);
        if(this.options.offset.top) position.bottom -= parseInt(this.options.offset.top);
        
        this.el.style.left = 'auto';
        this.el.style.right = 'auto';
        this.el.style.top = 'auto';
        this.el.style.bottom = 'auto';
        Helpers.removeClass(this.el, 'popover-left popover-right popover-center popover-top popover-bottom');
        Helpers.addClass(this.el, 'popover-' + topAlign);
        Helpers.addClass(this.el, 'popover-' + leftAlign);
        Object.keys(position).forEach(function(key){
            this.el.style[key] = position[key] + "px";
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