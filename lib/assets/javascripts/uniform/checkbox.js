import Component from './component';
import {addClass, toggleClass, trigger} from 'dolla';

export class Checkbox extends Component {
    static className = "uniformCheckbox";
    
    initialize (options) {
        this.listenTo(this.el, 'change', this.change);
        this.listenTo(document, 'keyup', this.keyup);
    }
    
    render () {
        this.el.style.display = "none";
        this.checkbox = document.createElement('div');
        addClass(this.checkbox, this.constructor.className);
        this.checkbox.tabIndex = 0;
        
        if (this.el.className && this.el.className.replace(this.constructor.className, '') != ''){
          addClass(this.checkbox, this.el.className.replace(this.constructor.className, ''));
        }
        
        toggleClass(this.checkbox, 'checked', this.el.checked);
        
        this.el.parentNode.insertBefore(this.checkbox, this.el.nextSibling);
        
        this.listenTo(this.checkbox, 'click', this.click);
        
        return this;
    }
    
    click (e) {
        if (this.el.disabled) return;
        this.el.checked = !this.el.checked
        trigger(this.el, 'change');
        e.preventDefault();
    }
    
    change () {
        toggleClass(this.checkbox, 'checked', this.el.checked);
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