import Component from './component';
import Popover from './popover';
import {createElement} from 'dolla';

/*.
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
    toggle
*/
export default class Dropdown extends Component {
  
  initialize (options) {
      this.el = options.anchor;
      options = options || {}
      this.options = {
          align: 'center bottom',
          container: document.body
      };
      Object.assign(this.options, this.pick(options, Object.keys(this.options)));
      
      this.enabled = true;
      this.active = false;
      this.content = options.content;
      this.el.dropdown = this;
      
      this.listenTo(this.el, 'click', this.toggle);
  }
    
  render () {
      return this;
  }
  
  toggle () {
    this.active = !this.active
    if(this.active) {
      this.show()
    } else {
      this.hide()
    }
  }
  
  show () {
    if(!this.enabled) return;
    this.active = true;
    this.el.classList.add('-active');
    if (this.popup) {
      this.popup.show()
    } else {
      this.popup = new Popover({
          content: this.content,
          anchor: this.el,
          align: this.options.align,
          container: this.options.container
      }).render();
      this.listenToOnce(this.popup, 'hidden', this.hidden)
    }
  }
  
  hide () {
    this.popup.remove();
    delete this.popup;
    this.hidden();
  }
  
  hidden () {
    this.active = false;
    this.el.classList.remove('-active');
  }
  
  disable () {
      this.enabled = false;
  }
  
  enabled () {
      this.enabled = true;
  }
}
