import { HTML_ATTRIBUTES, BOOLEAN_ATTRIBUTES, append } from 'dolla';

export default class UniformElement extends HTMLElement {
    
    static classes = []
    
    constructor (options={}) {
        super(...arguments)
        this.options = options
        
        Object.defineProperty(this, 'content', {
            configurable: true,
            enumerable: true,
            get: () => { return this.children; },
            set: (value) => { append(this, value); }
        });
        
        Object.keys(options).forEach(key => {
            if (key == "content") {
                this.content = options.content;
            } else if (BOOLEAN_ATTRIBUTES.includes(key)) {
                this.toggleAttribute(key, options[key] !== false);
            } else if (HTML_ATTRIBUTES.includes(key)) {
                this.setAttribute(key, options[key]);
            }
        })
        
        this.classList.add(...this.constructor.classes)
    }
    
}
customElements.define('uniform-element', UniformElement);