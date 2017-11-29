(function( $ ) {
 
    $.fn.uniformTooltip = function() {
        return this.each(function(){
            var el = $(this);
            var tooltip = new UniformTooltip({
                message: el.data('tooltip-message'),
                el: this
            });
            tooltip.on('*', function (event_type, tooltip) {
                el.trigger('tooltip-' + type, tooltip);
            });
            tooltip.render();
        });
    };
 
}( jQuery ));
function UniformTooltip(options){
    UniformComponent.call(this, options);
}
UniformTooltip.prototype = Object.create(UniformComponent.prototype);
UniformTooltip.prototype.constructor = UniformComponent;
UniformTooltip.prototype.initialize = function (options) {
    this.message = options.message;
    this.$el = (options.el instanceof $) ? options.el : $(options.el);

    this.$el.on('mouseover', this.show.bind(this));
    this.$el.on('mouseout', this.hide.bind(this));
}
UniformTooltip.prototype.render = function () {
    this.popup = $('<div class="uniformTooltip-popup">' + this.message + '</div>');
    this.popup.prepend("<div class='uniformTooltip-pointer'></div>");
    this.$el.append(this.popup);
    if (this.message.length > 100) {
        this.popup.css({
            minWidth: "200px"
        });
    }
    if (this.popup.outerWidth(true) + this.popup.offset().left > $(window).width()) {
        this.popup.css({
            left: $(window).width() - this.popup.outerWidth(true) - this.popup.offset().left
        });
    }
    return this;
}
UniformTooltip.prototype.remove = function () {
    this.$el.remove();
}
UniformTooltip.prototype.show = function () {
    if(!this.popup) this.render();
    this.popup.addClass('active');
    this.trigger('shown');
}
UniformTooltip.prototype.hide = function () {
    this.popup.removeClass('active');
    this.trigger('hidden');
}