import Floater from './floater';

/*
Options
-------
listeners
[Floater Options]
*/

export default class Tooltip extends Floater {
    constructor (options) {
        options = Object.assign({
            listeners: ['mouseenter', 'focusin'],
            placement: 'top',
            arrow: true
        }, options)
        super(options);
        this.classList.add('uniformTooltip');
        
        options.listeners.forEach(listener => {
            options.anchor.addEventListener(listener, () => this.show())
            const outListener = {
                mouseenter: 'mouseleave',
                focusin: 'focusout'
            }[listener]
            if (outListener) {
                options.anchor.addEventListener(outListener, () => this.hide())
            }
        })
    }
}
customElements.define('uniform-tooltip', Tooltip);