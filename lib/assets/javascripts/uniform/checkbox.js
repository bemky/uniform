import Component from './component';
import * as Helpers from './dom-helpers';

export class Checkbox extends Component {
    static className = "uniformCheckbox";
    
    initialize (options) {
        this.listenTo(this.el, 'change', this.change);
        this.listenTo(document, 'keyup', this.keyup);
    }
    
    render () {
        this.el.style.display = "none";
        this.checkbox = document.createElement('div');
        Helpers.addClass(this.checkbox, this.constructor.className);
        this.checkbox.tabIndex = 0;
        
        if (this.el.className && this.el.className.replace(this.constructor.className, '') != ''){
          Helpers.addClass(this.checkbox, this.el.className.replace(this.constructor.className, ''));
        }
        
        Helpers.toggleClass(this.checkbox, 'checked', this.el.checked);
        
        this.el.parentNode.insertBefore(this.checkbox, this.el.nextSibling);
        
        this.listenTo(this.checkbox, 'click', this.click);
        
        return this;
    }
    
    click (e) {
        if (this.el.disabled) return;
        this.el.checked = !this.el.checked
        Helpers.trigger(this.el, 'change');
        e.preventDefault();
    }
    
    change () {
        Helpers.toggleClass(this.checkbox, 'checked', this.el.checked);
    }
    
    keyup (e) {
        if(document.activeElement != this.checkbox) return;
        if(e.key != " " && e.key !== "Spacebar") return;
        this.click(e)
    }
}

export class Radio extends Checkbox {
  static className = "uniformRadio";
}

export class Toggle extends Checkbox {
  static className = "uniformToggle";
}