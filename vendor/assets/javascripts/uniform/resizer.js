(function( $ ) {
 
    $.fn.uniformResizer = function() {
        return this.each(function(){
            console.log(this);
            new uniformResizer({
                el: this
            });
        });
    };
 
}( jQuery ));
function uniformResizer(options){
    UniformComponent.call(this, options);
}
uniformResizer.prototype = Object.create(UniformComponent.prototype);
uniformResizer.prototype.constructor = UniformComponent;
uniformResizer.prototype.initialize = function (options) {
    this.$el = (options.el instanceof $) ? options.el : $(options.el);
    $(window).resize(this.resize.bind(this));
    $(window).trigger('resize');
}
uniformResizer.prototype.resize = function () {
    // breakpoints at 720, 1080, 1440
    var width = this.$el.width();

    if(width > 720 && !this.$el.hasClass('md-size')) {
        this.$el.addClass('md-size');
    } else if (width < 720 && this.$el.hasClass('md-size')) {
        this.$el.removeClass('md-size');
    }

    if(width > 1080 && !this.$el.hasClass('lg-size')) {
        this.$el.addClass('lg-size');
    } else if (width < 1080 && this.$el.hasClass('lg-size')) {
        this.$el.removeClass('lg-size');
    }

    if(width > 1440 && !this.$el.hasClass('xl-size')) {
        this.$el.addClass('xl-size');
    } else if (width < 1440 && this.$el.hasClass('xl-size')) {
        this.$el.removeClass('xl-size');
    }

    console.log(width);
    if(width < 720 && !this.$el.hasClass('sm-size')) {
        this.$el.addClass('sm-size');
    } else if (width > 720 && this.$el.hasClass('sm-size')) {
        this.$el.removeClass('sm-size');
    }
}