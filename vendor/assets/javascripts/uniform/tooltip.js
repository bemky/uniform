import Component from './component';
import * as Helpers from './dom-helpers';

/*
    message: html
    align: top|bottom (default: top)

    methods
    ------
    enable
    disable
    hide
    show
*/
export default class Tooltip extends Component {
    initialize (options) {
        options = options || {}
        this.options = {
            align: 'top',
        };
        Object.assign(this.options, this.pick(options, Object.keys(this.options)));
        
        this.enabled = true;
        this.message = options.message;
        options.el.tooltip = this;

        this.el.addEventListener('mouseenter', this.show.bind(this));
        this.el.addEventListener('mouseleave', this.hide.bind(this));
    }
    
    render () {
        this.popup = Helpers.createElement('<div class="uniformTooltip-popup">' + this.message + '</div>');
        this.popup.insertBefore(Helpers.createElement("<div class='uniformTooltip-pointer'></div>"), this.popup.firstChild);
        this.el.appendChild(this.popup);
        if (this.message.length > 100) {
            this.popup.style.minWidth = "200px";
        } else {
            this.popup.style.whiteSpace = "nowrap";
        }
        
        if (this.popup.offsetWidth + Helpers.offset(this.popup).left > window.innerWidth) {
            this.popup.style.left = window.innerWidth - this.popup.offsetWidth - Helpers.offset(this.popup).left + "px"
        }
        
        this.popup.style.display = "block";
        if (this.options.align == "bottom" || Helpers.offset(this.popup).top < 0) {
            Helpers.addClass(this.popup, '-align-bottom');
        }
        this.popup.style.display = 'none';
        
        return this;
    }
    
    remove () {
        this.el.parentNode.removeChild(this.el);
    }
    
    show () {
        if(!this.popup) this.render();
        if(!this.enabled) return;

        if (this.hiding) return this.show_after_hide = true;
        if (this.showing || this.shown) return;
        this.popup.style.display = 'block';
        this.showing = true;
        this.hidden = false;
        
        var endTransition = function (e) {
            this.trigger('shown');
            this.showing = false;
            this.shown = true;
            if (this.hide_after_show) this.hide();
            this.hide_after_show = false;
        }.bind(this);
        
        Helpers.once(this.popup, 'transitionend', endTransition);
        Helpers.once(this.popup, 'msTransitionEnd', endTransition);
        Helpers.once(this.popup, 'oTransitionEnd', endTransition);
        
        if (Helpers.offset(this.popup).left < 0) this.popup.style.left = "0";
        Helpers.addClass(this.el, 'active');
        
        // TODO remove timeout usage... Not sure why this is necessary, but doesn't do css animation if not delayed.
        setTimeout(function(){
            Helpers.addClass(this.popup, '-reveal');
        }.bind(this), 1);
    }
    
    hide () {
        if (this.showing) return this.  hide_after_show = true;
        if (this.hiding || this.hidden) return;
        this.hiding = true;
        this.shown = false;
        
        var endTransition = function (e) {
            this.trigger('hidden');
            Helpers.removeClass(this.el, 'active');
            this.popup.style.display = 'none';
            this.hiding = false;
            this.hidden = true;
            if (this.show_after_hide) this.show();
            this.show_after_hide = false;
        }.bind(this);
        
        Helpers.once(this.popup, 'transitionend', endTransition);
        Helpers.once(this.popup, 'msTransitionEnd', endTransition);
        Helpers.once(this.popup, 'oTransitionEnd', endTransition);
        
        Helpers.removeClass(this.popup, '-reveal');
    }
    
    disable () {
        this.enabled = false;
    }
    
    enabled () {
        this.enabled = true;
    }

}