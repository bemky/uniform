import Component from './component';
import { trigger, hasClass, addClass, removeClass } from 'dolla';

export default class Resizer extends Component {
    
    initialize () {
        this.listenTo(window, 'resize', this.resize);
        trigger(window, 'resize');
    }
    
    resize () {
        // breakpoints at 720, 1080, 1440
        var width = this.el.offsetWidth;

        if(width > 720 && !hasClass(this.el, 'md-size')) {
            addClass(this.el, 'md-size');
            trigger(window, 'resized-md');
        } else if (width < 720 && hasClass(this.el, 'md-size')) {
            removeClass(this.el, 'md-size');
        }

        if(width > 1080 && !hasClass(this.el, 'lg-size')) {
            addClass(this.el, 'lg-size');
            trigger(window, 'resized-lg');
        } else if (width < 1080 && hasClass(this.el, 'lg-size')) {
            removeClass(this.el, 'lg-size');
        }

        if(width > 1440 && !hasClass(this.el, 'xl-size')) {
            addClass(this.el, 'xl-size');
            trigger(window, 'resized-xl');
        } else if (width < 1440 && hasClass(this.el, 'xl-size')) {
            removeClass(this.el, 'xl-size');
        }

        if(width < 720 && !hasClass(this.el, 'sm-size')) {
            addClass(this.el, 'sm-size');
            trigger(window, 'resized-sm');
        } else if (width > 720 && hasClass(this.el, 'sm-size')) {
            removeClass(this.el, 'sm-size');
        }
    }
}