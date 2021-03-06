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
*/
export default class Tooltip extends Component {
    initialize (options) {
        this.el = options.anchor;
        options = options || {}
        this.options = {
            align: 'top',
            container: document.body
        };
        Object.assign(this.options, this.pick(options, Object.keys(this.options)));
        
        this.enabled = true;
        this.content = options.content;
        this.el.tooltip = this;

        this.listenTo(this.el, 'mouseenter', this.show);
        this.listenTo(this.el, 'mouseleave', this.hide);
    }
    
    render () {
        return this;
    }
    
    show () {
        if(!this.enabled) return;
        clearTimeout(this.hide_timeout);
        this.el.classList.add('-active');
        if (this.popup) {
          this.popup.show()
        } else {
          this.popup = new Popover({
              content: this.content,
              class: 'uniformPointer -bottom bg-gray-70 bg-opacity-85 text-white rounded pad-1/2x text-sm max-width-300-px',
              anchor: this.el,
              align: this.options.align == "top" ? `center top` : 'center 100%',
              offset: {
                top: -7
              },
              container: this.options.container
          }).render();
        }
    }
    
    hide () {
      this.hide_timeout = setTimeout(() => {
        this.popup.remove();
        this.el.classList.remove('-active');
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