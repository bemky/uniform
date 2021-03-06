import Component from './component';
import {css, trigger, append, createElement} from 'dolla';

/*  UniformModal.initialize
    Options
    content:    string|$el|function
    klass:      string - classes to append to modal container

    * use blurrable to keep some elements from being blurred ie. <div blurrable="false">...</div>
*/
export default class Modal extends Component {
    
    initialize (options) {
        this.options = {};
        this.options.klass = options.klass || false;
        this.content = options.content;
        this.el.removeAttribute('content');

        this.el.classList.add('uniformModal');
        this.listenTo(document, 'keyup', this.keyup);
        this.listenTo(this.el, 'click', this.checkCloseButton);
    }
    
    keyup (e) {
        if(e.which != 27) return;
        this.close();
    }
    
    render () {
        var that = this;

        this.highest_z_index = 0;
        this.overlay = createElement('div', {class: 'uniformModal-overlay'});
        this.blur = createElement('div', {class: 'uniformModal-blur'});
        
        this.original_scroll = window.scrollY;
        this.blur.style.top = 0 - this.original_scroll + "px";

        if (document.body.querySelectorAll('.uniformModal').length > 0) {
            this.highest_z_index = Math.max(Array.prototype.map.call(document.body.querySelectorAll('.uniformModal'), function(el){
                return parseInt(css(el, 'zIndex'));
            }));
            this.el.style.zIndex = this.highest_z_index + 2;
        }
        
        let next_element = document.body.children[0]
        while(next_element){
          const element = next_element;
          next_element = element.nextElementSibling;
          if(!element.matches('[blurrable="false"]')) {
            this.blur.appendChild(element)
          }
        }

        document.body.classList.add('uniformModal-active');
        document.body.appendChild(this.blur);
        document.body.appendChild(this.el);
        
        this.el.style.top = window.scrollY;
        this.listenTo(this.overlay, 'click', this.close);
        
        const container = createElement('div', {
          class: 'uniformModal-container',
          children: this.content
        });
        
        const closeButton = createElement('div', {
          class: 'uniformModal-close-container',
          children: {
            class: 'uniformModal-close'
          }
        });
        
        this.el.append(this.overlay);
        this.el.append(container);
        this.el.append(closeButton);

        if (this.options.klass) container.classList.add(this.options.klass);
        if (this.content.innerHTML) trigger(this.content, 'rendered');
        this.trigger('rendered');

        return this;
    }
    
    checkCloseButton (e) {
        if(e.target.classList.contains('uniformModal-close')){
          this.close();
        }
    }
    
    close () {
        document.querySelectorAll('uniformModal-active').forEach(el => el.classList.remove('uniformModal-active'));
        var elements = this.blur.children;
        var elementCount = elements.length
        for(var i=0; i < elementCount; i++){
            document.body.appendChild(elements[0]);
        }
        if(this.blur.parentNode) this.blur.parentNode.removeChild(this.blur);
        window.scrollTo(0, this.original_scroll);
        this.trigger('closed');
        this.remove();
    }
    
    remove () {
        Component.prototype.remove.apply(this, arguments);
        if(this.overlay && this.overlay.parentNode) this.overlay.parentNode.removeChild(this.overlay);
        delete this.overlay;
    }
}