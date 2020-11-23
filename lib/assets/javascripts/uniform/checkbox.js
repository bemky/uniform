import Component from './component';
import {addClass, toggleClass, trigger, createElement} from 'dolla';

export class Checkbox extends Component {
    static CSSClass = "uniformCheckbox";
    static type = 'checkbox';
    
    initialize (options) {
        if(options.input instanceof Element) {
          this.input = options.input
        } else {
          this.input = createElement('input', Object.assign({}, {
            type: this.constructor.type
          }, options.input)) // TODO filter options to dolla.HTML_ATTRIBUTES
        }
        
        if(!options.tabindex) this.el.tabIndex = 0;
        addClass(this.el, this.constructor.CSSClass);

        this.listenTo(this.el, 'click', this.click);
        this.listenTo(this.input, 'change', this.change);
        this.listenTo(document, 'keyup', this.keyup);
        this.listenTo(document, 'keydown', this.keydown);
    }
    
    render () {
        this.input.style.display = "none";

        if(this.input.parentNode){
          this.input.parentNode.insertBefore(this.el, this.input.nextSibling);
        } else {
          this.el.append(this.input);
        }
        
        this.change()

        return this;
    }
    
    change () {
        toggleClass(this.el, 'checked', this.input.checked);
    }
    
    click (e) {
        if (this.input.disabled) return;
        
        this.input.checked = !this.input.checked
        trigger(this.input, 'change');
        e.preventDefault();
    }
    
    keyup (e) {
        if(document.activeElement != this.el) return;
        if(e.keyCode != 32) return;

        e.preventDefault();
        this.click(e);
    }
    
    keydown(e) {
      if(e.keyCode == 32 && document.activeElement == this.el) {
        // Prevent Page Scroll
        e.preventDefault();
      }
    }
}

export class Radio extends Checkbox {
  static CSSClass = "uniformRadio";
}

export class Toggle extends Checkbox {
  static CSSClass = "uniformToggle";
}