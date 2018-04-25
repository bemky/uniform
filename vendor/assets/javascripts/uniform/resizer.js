import Component from './component';

export default class Resizer extends Component {
    
    initialize () {
        $(window).resize(this.resize.bind(this));
        $(window).trigger('resize');
    }
    
    resize () {
        // breakpoints at 720, 1080, 1440
        var width = this.$el.width();

        if(width > 720 && !this.$el.hasClass('md-size')) {
            this.$el.addClass('md-size');
            $(window).trigger('resized-md');
        } else if (width < 720 && this.$el.hasClass('md-size')) {
            this.$el.removeClass('md-size');
        }

        if(width > 1080 && !this.$el.hasClass('lg-size')) {
            this.$el.addClass('lg-size');
            $(window).trigger('resized-lg');
        } else if (width < 1080 && this.$el.hasClass('lg-size')) {
            this.$el.removeClass('lg-size');
        }

        if(width > 1440 && !this.$el.hasClass('xl-size')) {
            this.$el.addClass('xl-size');
            $(window).trigger('resized-xl');
        } else if (width < 1440 && this.$el.hasClass('xl-size')) {
            this.$el.removeClass('xl-size');
        }

        if(width < 720 && !this.$el.hasClass('sm-size')) {
            this.$el.addClass('sm-size');
            $(window).trigger('resized-sm');
        } else if (width > 720 && this.$el.hasClass('sm-size')) {
            this.$el.removeClass('sm-size');
        }
    }
}