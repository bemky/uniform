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
*/
export default class Popover extends Component {
    initialize (options) {
        options = options || {};
        this.options = {
            zIndex: 2,
            container: document.body,
            align: 'center bottom',
            anchor: document.body,
            content: 'needs content'
        };
        Object.assign(this.options, this.pick(options, Object.keys(this.options)));
        
        document.addEventListener('click', this.outsideClick.bind(this));
        document.addEventListener('keyup', this.checkEscape.bind(this));
        window.addEventListener('resize', this.resize.bind(this));
    }
    
    remove () {
        if(this.el.parentNode) this.el.parentNode.removeChild(this.el);
        window.removeEventListener('resize', this.resize.bind(this));
        document.removeEventListener('click', this.outsideClick.bind(this));
        document.removeEventListener('keyup', this.checkEscape.bind(this));
    }
    
    render () {
        this.el.style.position = 'absolute';
        this.el.style.zIndex = this.options.zIndex;
        
        if(this.options.content instanceof Node)
            this.el.appendChild(this.options.content);
        else
            this.el.innerHTML = this.options.content;
        
        this.options.container.appendChild(this.el);
        this.resize();
        
        return this;
    }
    
    resize () {
        this.setPosition();
        
        var align = this.options.align.split(" ");
        var reposition = false;
        if (Helpers.offset(this.el).top + Helpers.outerHeight(this.el) > document.body.offsetHeight) {
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
            position.top = offset.top - Helpers.outerHeight(this.el);
        } else if(topAlign == 'center'){
            position.top = offset.top + Helpers.outerHeight(this.options.anchor) / 2 - Helpers.outerHeight(this.el) / 2;
        } else if (topAlign == 'bottom'){
            position.top = offset.top + Helpers.outerHeight(this.options.anchor);
        } else if (topAlign.includes("%")){
            position.top = offset.top + Helpers.outerHeight(this.options.anchor) * parseInt(topAlign) / 100;
        } else if (topAlign.includes("px")){
            position.top = offset.top + Helpers.outerHeight(this.options.anchor) + parseInt(topAlign);
        }
        
        this.el.style.left = 'auto';
        this.el.style.right = 'auto';
        Object.keys(position).forEach(function(key){
            this.el.style[key] = position[key] + "px";
        }, this);
    }
    
    outsideClick (e) {
        if (e.target === this.el) return;
        if (this.el.contains(e.target)) return;
        this.hide();
    }
    
    checkEscape (e) {
        if(e.which != 27) return;
        this.hide();
    }
    
    hide () {
        this.el.style.display = 'none';
        this.trigger('hidden');
    }
    
    show () {
        this.el.style.display = 'block';
        this.trigger('shown');
    }
    
    toggle(flag) {
        flag = flag || getComputedStyle(this.el)['display'] == "none";
        if(flag) this.show(); else this.hide();
    }
}