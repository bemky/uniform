import Component from './component';
import * as Helpers from './dom-helpers';

export default class Checkbox extends Component {
    initialize (options) {
        this.el.addEventListener('change', this.change.bind(this));
    }
    
    render () {
        var type = Helpers.hasClass(this.el, 'uniformRadio') ? 'uniformRadio' : 'uniformCheckbox';
        this.checkbox = document.createElement('div');
        Helpers.addClass(this.checkbox, `${type}-indicator`);
        
        if (this.el.className && this.el.className.replace(type, '') != '')
            Helpers.addClass(this.checkbox, this.el.className.replace(type, ''));
        Helpers.toggleClass(this.checkbox, 'checked', this.el.checked);
        this.el.parentNode.insertBefore(this.checkbox, this.el.nextSibling);
        this.checkbox.addEventListener('click', this.click.bind(this));
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
}