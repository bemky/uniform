import Component from './component';
import * as Helpers from './dom-helpers';

export default class Resizer extends Component {
    
    initialize () {
        this.listenTo(window, 'resize', this.resize);
        Helpers.trigger(window, 'resize');
    }
    
    resize () {
        // breakpoints at 720, 1080, 1440
        var width = this.el.offsetWidth;

        if(width > 720 && !Helpers.hasClass(this.el, 'md-size')) {
            Helpers.addClass(this.el, 'md-size');
            Helpers.trigger(window, 'resized-md');
        } else if (width < 720 && Helpers.hasClass(this.el, 'md-size')) {
            Helpers.removeClass(this.el, 'md-size');
        }

        if(width > 1080 && !Helpers.hasClass(this.el, 'lg-size')) {
            Helpers.addClass(this.el, 'lg-size');
            Helpers.trigger(window, 'resized-lg');
        } else if (width < 1080 && Helpers.hasClass(this.el, 'lg-size')) {
            Helpers.removeClass(this.el, 'lg-size');
        }

        if(width > 1440 && !Helpers.hasClass(this.el, 'xl-size')) {
            Helpers.addClass(this.el, 'xl-size');
            Helpers.trigger(window, 'resized-xl');
        } else if (width < 1440 && Helpers.hasClass(this.el, 'xl-size')) {
            Helpers.removeClass(this.el, 'xl-size');
        }

        if(width < 720 && !Helpers.hasClass(this.el, 'sm-size')) {
            Helpers.addClass(this.el, 'sm-size');
            Helpers.trigger(window, 'resized-sm');
        } else if (width > 720 && Helpers.hasClass(this.el, 'sm-size')) {
            Helpers.removeClass(this.el, 'sm-size');
        }
    }
}