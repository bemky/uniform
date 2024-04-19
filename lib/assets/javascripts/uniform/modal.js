import Component from './component';
import {css, trigger, append, createElement} from 'dolla';

/*  UniformModal.initialize
    Options
    content:    string|$el|function
    klass:      string - classes to append to modal container
    includeClose:      boolean 

    * use blurrable to keep some elements from being blurred ie. <div blurrable="false">...</div>
*/
export default class Modal extends Component {
    
    initialize (options) {
        this.options = {};
        this.options.klass = options.klass || false;
        this.content = options.content;
        this.includeClose = options.includeClose
        this.el.removeAttribute('content');

        this.el.classList.add('uniformModal');
        this.listenTo(document, 'keyup', this.keyup);
        this.listenTo(document, 'mousedown', this.setMousedownTarget);
        this.listenTo(this.el, 'click', this.checkClose);
        this.el.modal = this;
    }
    
    keyup (e) {
        if(e.which != 27) return;
        this.close();
    }

    setMousedownTarget (e) {
        this.mousedownTarget = e.target;
    }
    
    render () {
        var that = this;

        this.highest_z_index = 0;

        if (document.body.querySelectorAll('.uniformModal').length > 0) {
            this.highest_z_index = Math.max(Array.prototype.map.call(document.body.querySelectorAll('.uniformModal'), function(el){
                return parseInt(css(el, 'zIndex'));
            }));
            this.el.style.zIndex = this.highest_z_index + 2;
        }

        document.body.classList.add('uniformModal-active');
        document.body.appendChild(this.el);
        
        const container = createElement('div', {
            class: 'uniformModal-container',
            children: this.content,
            tabindex: 0
        });
        this.el.append(container);1
        
        if (this.includeClose !== false) {
            const closeButton = createElement('div', {
                class: 'uniformModal-close-container',
                children: {
                    class: 'uniformModal-close js-modal-close'
                }
            });
            this.el.append(closeButton);
        }
        
        const focusable = container.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        if (focusable) {
            focusable.focus()
        } else {
            container.focus()
        }

        if (this.options.klass) container.classList.add(this.options.klass);
        if (this.content.innerHTML) trigger(this.content, 'rendered');
        this.trigger('rendered');

        return this;
    }
    
    checkClose (e) {
        if (e.target.matches('.js-modal-close, .uniformModal') || e.target.closest('.js-modal-close')) {
            // If the mousedown event occured inside the content a text select
            // may be happening, so don't close on the click event if the target
            // is outside the content.
            if (this.mousedownTarget == null || !this.el.querySelector('.uniformModal-container').contains(this.mousedownTarget)) {
                this.close();
            }
            this.mousedownTarget = null;
        }
    }
    
    close () {
        this.trigger('closed');
        this.remove();
        if (document.querySelectorAll('.uniformModal').length == 0) {
            document.body.classList.remove('uniformModal-active');
        }
    }
}