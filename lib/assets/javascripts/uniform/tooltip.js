import Component from './component';
import Popover from './popover';

/*
    anchor: element
    content: html
    align: top|bottom (default: top)
    container: document.body

    methods
    ------
    enable
    disable
    hide
    show
    timeout
*/
export default class Tooltip extends Component {
    initialize (options) {
        this.anchor = options.anchor;
        this.options = Object.assign({
            align: 'top'
        }, options)
        this.options.offset = { [this.options.align]: -7}
        this.pointerDirection = {
            top: 'bottom',
            bottom: 'top',
            left: 'right',
            right: 'left'
        }[this.options.align]
        
        this.options.align = {
            left: 'left center',
            right: 'right center',
            top: 'center top',
            bottom: 'center bottom'
        }[this.options.align]
        
        this.enabled = true;
        this.anchor.tooltip = this;
        this.timeout = options.timeout

        this.listenTo(this.anchor, 'mouseenter', this.show);
        this.listenTo(this.anchor, 'mouseleave', this.hide);
    }
    
    render () {
        return this;
    }
    
    show () {
        if(!this.enabled) return;
        clearTimeout(this.hide_timeout);
        this.anchor.classList.add('-active');
        if (this.popup) {
            this.popup.show()
        } else {
            this.popup = new Popover(Object.assign({
                class: `uniformPointer -${this.pointerDirection} bg-gray-70 bg-opacity-85 text-white rounded pad-1/2x text-sm max-width-300-px `,
            }, this.options)).render();
        }
    }
    
    hide () {
        this.hide_timeout = setTimeout(() => {
            this.popup.remove();
            this.anchor.classList.remove('-active');
            delete this.popup;
        }, this.timeout)
    }
    
    disable () {
        this.enabled = false;
    }
    
    enabled() { return this.enable(); }
    enable () {
        this.enabled = true;
    }
    toggle () {
        if (this.popup) {
            this.popup.toggle(...arguments)
        } else {
            this.show()
        }
    }
}