import UniformElement from './element';
import {computePosition, offset, flip, shift, arrow, size, autoPlacement, inline, autoUpdate} from '@floating-ui/dom';
import pick from './support/pick';
import {createElement, dolla, trigger} from 'dolla';
import addOutsideEventListener from './support/addOutsideEventListener';

/*
Options
------
ancor: 
    required
    HTMLElement to anchor position too
placement: 
    default: "bottom"
    string: https://floating-ui.com/docs/computePosition#placement
strategy:
    default: "absolute"
    string: https://floating-ui.com/docs/computePosition#strategy
flip: 
    default: false, in favor of autoPlacement
    boolean, if true use default options
    {}: https://floating-ui.com/docs/flip
offset: 
    default: true
    boolean, if true use default options
    {}: https://floating-ui.com/docs/offset
shift:
    default: true
    boolean, if true use default options
    {}: https://floating-ui.com/docs/shift
arrow: 
    default: true
    boolean, if true use default options
    element, uses default options with provided element
    {}: https://floating-ui.com/docs/arrow
size: 
    default: false
    boolean, if true use default options
    {}: https://floating-ui.com/docs/size
autoPlacement: 
    default: true
    boolean, if true use default options
    {}: https://floating-ui.com/docs/autoPlacement
inline: 
    default: true
    boolean, if true use default options
    {}: https://floating-ui.com/docs/inline

Events
------
hide
show

*/

export default class Floater extends UniformElement {
    
    constructor (options) {
        options = Object.assign({
            autoPlacement: true,
            shift: true,
            strategy: 'absolute'
        }, options)
        
        super(options);
        this.cleanupCallbacks = [];
        this.style.position = options.strategy;
        
        this.positionOptions = Object.assign(pick(options, [
            'placement', 'strategy'
        ]))
        const middleware = []
        this.positionOptions.middleware = middleware
        
        if (options.arrow) {
            let arrowOptions = options.arrow
            if (arrowOptions instanceof HTMLElement) {
                arrowOptions = {element: arrowOptions}
            } else if (arrowOptions == true) {
                arrowOptions = {element: createElement({class: 'uniformArrow'})}
            }
            this.arrow = arrowOptions.element
            middleware.push(arrow(arrowOptions))
        }
        const middlewares = {
            size,
            offset,
            shift,
            autoPlacement,
            flip,
            inline
        }
        
        Object.keys(middlewares).forEach(key => {
            if (options[key]) {
                middleware.push(middlewares[key](options[key] === true ? {} : options[key]))
            }
        })
    }
    
    setPosition () {
        const options = 
        computePosition(this.options.anchor, this, this.positionOptions).then(({x, y, placement, middlewareData}) => {
            Object.assign(this.style, {
                left: `${x}px`,
                top: `${y}px`
            })
            
            if (middlewareData.arrow) {
                const {x, y} = middlewareData.arrow;
 
                const staticSide = {
                  top: 'bottom',
                  right: 'left',
                  bottom: 'top',
                  left: 'right',
                }[placement.split('-')[0]];
                
                Object.assign(this.arrow.style, {
                    left: x != null ? `${x}px` : '',
                    top: y != null ? `${y}px` : '',
                    right: '',
                    bottom: '',
                    [staticSide]: '-4px',
                });
            }
        })
    }
    
    connectedCallback () {
        this.floaterCleanup = autoUpdate(
            this.options.anchor,
            this,
            this.setPosition.bind(this)
        )
    }
    
    disconnectedCallback () {
        if (this.floaterCleanup) this.cleanupFloater();
        if (this.outsideClickCleanup) this.outsideClickCleanup();
    }
    
    setupCancelListeners () {
        this.cleanupCallbacks.push(addOutsideEventListener(this, this.hide));
        const focusListener = e => {
            if (e.target === this) return
            if (e.target === this.options.anchor) return
            if (this.contains(e.target)) return
            if (this.options.anchor.contains(e.target)) return
            this.hide()
        }
        document.addEventListener('focusin', focusListener)
        this.cleanupCallbacks.push(() => document.removeEventListener('focusin', focusListener))
        
        const keyupListener = e => {
            if (e.key == "Escape") this.hide()
        }
        document.addEventListener('keyup', keyupListener)
        this.cleanupCallbacks.push(() => document.removeEventListener('keyup', keyupListener))
    }
    
    cleanupCancelListeners () {
        this.cleanupCallbacks.forEach(callback => callback())
        this.cleanupCallbacks = []
    }
    
    isShown () {
        return this.style.display != 'none';
    }
    
    show () {
        console.log(this);
        this.style.display = 'block'
        trigger(this, 'show')
        
        // delay setup of listener, if show called by click event that event will fire this immediately
        setTimeout(this.setupCancelListeners, 0)
        return this;
    }
    
    hide () {
        this.style.display = 'none'
        trigger(this, 'hide')
        this.cleanupCancelListeners()
        
        return this;
    }
    
    toggle (force) {
        force = force == undefined ? !this.isShown() : force
        if (force) this.show()
        else this.hide()
        return this;
    }
}


customElements.define('uniform-floater', Floater);