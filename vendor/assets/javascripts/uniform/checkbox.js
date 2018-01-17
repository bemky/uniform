(function( $ ) {
 
    $.fn.uniformCheckbox = function() {
        return this.each(function(){
            var el = $(this);
            var checkbox = new UniformCheckbox({
                el: this
            });
            checkbox.render();
        });
    };
    $.fn.uniformRadio = $.fn.uniformCheckbox;
 
}( jQuery ));
function UniformCheckbox(options){
    UniformComponent.call(this, options);
}
UniformCheckbox.prototype = Object.create(UniformComponent.prototype);
UniformCheckbox.prototype.constructor = UniformComponent;
UniformCheckbox.prototype.initialize = function (options) {
    this.$el = (options.el instanceof $) ? options.el : $(options.el);

    this.$el.on('change', this.change.bind(this));
}
UniformCheckbox.prototype.render = function () {
    var type = this.$el.hasClass('uniformRadio') ? 'uniformRadio' : 'uniformCheckbox';
    this.checkbox = $('<div class="'+type+'-indicator">');
    this.checkbox.addClass(this.$el.attr('class').replace(type, ''));
    this.checkbox.toggleClass('checked', this.$el.prop('checked'));
    this.$el.after(this.checkbox);
    this.checkbox.click(this.click.bind(this));
    return this;
}
UniformCheckbox.prototype.click = function (e){
    if (this.$el.prop('disabled')) return;
    this.$el.prop('checked', !this.$el.prop('checked'));
    this.$el.trigger('change');
    e.preventDefault();
}
UniformCheckbox.prototype.change = function () {
    this.checkbox.toggleClass('checked', this.$el.prop('checked'));
}