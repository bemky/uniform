import UniformElement from './element';
import { createElement, trigger, append, content } from 'dolla';
import addOutsideEventListener from './support/addOutsideEventListener';


// TODO move to custom built-in element to extend HTMLDialogElement
// when supported by apple https://bugs.webkit.org/show_bug.cgi?id=182671
// - [ ] Add Close Button
// - [ ] Lock scroll on <body>
// - [x] Click backdrop to cancel

export default class Modal extends UniformElement {
    
    constructor (options) {
        super(...arguments)
        this.dialog = createElement('dialog', {
            content: this.content
        })
        
        this.dialog.addEventListener('cancel', this.dispatchEvent)
        this.dialog.addEventListener('close', e => trigger(this, 'hide', e))
        
        content(this, this.dialog)
    }
    
    connectedCallback () {
        if (this.showOnAttach) {
            this.show()
            delete this.showOnAttach
        }
    }
    
    hide () {
        this.dialog.close()
        if (this.outsideClickCleanup) {
            this.outsideClickCleanup()
            delete this.outsideClickCleanup()
        }
        return this
    }
    
    show () {
        if (this.isConnected) {
            this.dialog.showModal();
            trigger(this, 'show');
            // use setTimeout to delay event setup because show could be called be a click event
            setTimeout(() => {
                this.outsideClickCleanup = addOutsideEventListener(this.dialog, e => {
                    trigger(this, 'cancel');
                    this.hide()
                })
            }, 0)
            
        } else {
            this.showOnAttach = true
        }
        return this
    }
    
    toggle (force) {
        const show = force != undefined ? force !== false : !this.dialog.open
        if (show) this.show()
        else this.hide()
        return this
    }

}

customElements.define('uniform-modal', Modal);