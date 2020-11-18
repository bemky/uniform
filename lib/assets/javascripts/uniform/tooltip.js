import Component from './component';
import Popover from './popover';

/*
    message: html
    align: top|bottom (default: top)
    container: document.body

    methods
    ------
    enable
    disable
    hide
    show
*/
export default class Tooltip extends Component {
    initialize (options) {
        options = options || {}
        this.options = {
            align: 'top',
            container: false
        };
        Object.assign(this.options, this.pick(options, Object.keys(this.options)));
        
        this.enabled = true;
        this.message = options.message;
        options.el.tooltip = this;

        this.listenTo(this.el, 'mouseenter', this.show);
        this.listenTo(this.el, 'mouseleave', this.hide);
    }
    
    render () {
        
        return this;
    }
    
    show () {
        if(!this.enabled) return;
        clearTimeout(this.hide_timeout);
        if (this.popup) {
          this.popup.show()
        } else {
          this.popup = new Popover({
              content: `<div class="uniformTooltip-popup">
                <div class='uniformTooltip-pointer'></div>
                ${this.message}
              </div>`,
              anchor: this.el,
              align: this.options.align == "top" ? `center top` : 'center 100%',
              offset: {
                top: -7
              },
              container: this.options.container || document.body
          }).render();
        }
    }
    
    hide () {
      this.hide_timeout = setTimeout(() => {
        this.popup.remove();
        delete this.popup;
      }, 300)
    }
    
    disable () {
        this.enabled = false;
    }
    
    enabled () {
        this.enabled = true;
    }

}