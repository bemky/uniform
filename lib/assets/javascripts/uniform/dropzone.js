import Component from './component';
import { remove, append, createElement } from 'dolla';

/*  
    Options
    ===
    content:    string|$el|function
    el:         element
    zone:       element|function|html to render as the dropzon

*/
export default class Dropzone extends Component {
    
    enabled = true;
    
    initialize (options) {
        if (options.zone) {
            this.zone = options.zone;
            append(this.el, this.zone);
        } else {
            this.zone = this.el.append(createElement({
                class: 'uniformDropzone',
                content: 'Drag Here'
            }));
        }
        if (getComputedStyle(this.el)['position'] == "static") {
            this.el.classList.add('relative');
        }
        if (typeof options.enabled == "boolean") {
            this.enabled = options.enabled
        }
        
        this.windowDragEnter = this.windowDragEnter.bind(this)
        this.windowDragLeave = this.windowDragLeave.bind(this)
        this.windowDrop = this.windowDrop.bind(this)
        this.el.addEventListener('drop', this.drop.bind(this))
        this.el.addEventListener('dragover', this.dragOver.bind(this))
        this.el.addEventListener('dragenter', this.dragEnter.bind(this))
        this.el.addEventListener('dragleave', this.dragLeave.bind(this))
        window.addEventListener('dragenter', this.windowDragEnter);
        window.addEventListener('dragleave', this.windowDragLeave);
        window.addEventListener('drop', this.windowDrop);

    }
    
    remove () {
        window.removeEventListener('dragenter', this.windowDragEnter);
        window.removeEventListener('dragleave', this.windowDragLeave);
        window.removeEventListener('drop', this.windowDrop);
        super.remove()
    }
    
    /*--------------------
        This Events
    --------------------*/
    dragEnter (e) {
        if (!this.enabled) return;
        e.preventDefault();
    
        this.el.classList.add('-active');
    }
  
    dragLeave (e) {
        if (!this.enabled) return;
        e.preventDefault();
    
        // relatedTarget is what drag is going to, deals with dragging inside dropzone
        if (!this.el.contains(e.relatedTarget)) {
            this.el.classList.remove('-active');
        }
    }
  
    drop (e) {
        if (!this.enabled) return;
        e.preventDefault();
        ([...e.dataTransfer.files]).forEach(file => {
            this.trigger('drop', file)
        });
    }
  
    // Enables Dropzone
    dragOver (e) {
        if (!this.enabled) return;
        e.preventDefault();
    }
    
    
    /*--------------------
        Window Events
    --------------------*/
    windowDragEnter (e) {
        if (!this.enabled) return;
        e.preventDefault();
    
        // Meaning it came from not in window
        if (!e.relatedTarget) {
            this.el.classList.add('-show')
        }
    }

    windowDragLeave (e) {
        if (!this.enabled) return;
        e.preventDefault();
        
        // Meaning it came from not in window
        if (!e.relatedTarget) {
            this.el.classList.remove('-show')
        }
    }
    
    windowDrop (e) {
        if (!this.enabled) return;
        e.preventDefault();
        this.el.classList.remove('-show')
    }
}