(function( $ ) {
 
    $.fn.uniformModal = function() {
        var el = $(this);
        var options = {
            klass: el.data('modal-klass'),
            content: el.data('modal-content')
        };
        if (el.data('modal-target')) {
            options.content = $(el.data('modal-target')).clone();
            options.content.removeClass('hidden');
        }
        var modal = new UniformModal(options);
        modal.on('*', function (event_type, modal) {
            el.trigger('modal-' + type, modal);
        });
        modal.render();
    };
 
}( jQuery ));

function UniformModal(options){
    UniformComponent.call(this, options);
}
UniformModal.prototype = Object.create(UniformComponent.prototype);
UniformModal.prototype.constructor = UniformComponent;
/*  UniformModal.initialize
    Options
    content:    string|$el|function
    klass:      string - classes to append to modal container
*/
UniformModal.prototype.initialize = function (options) {
    this.options = {
        klass: false,
    };
    $.extend(this.options, uniformHelpers.pick(options, 'klass'));
    this.content = options.content;
    
    this.$el.addClass('uniformModal');
    $(document).on('keyup', this.keyup.bind(this));
    this.$el.on('click', '.uniformModal-close', this.close.bind(this));
}
UniformModal.prototype.keyup = function (e) {
    if(e.which != 27) return;
    this.close();
}
UniformModal.prototype.render = function () {
    var that = this;
    var content = typeof this.content == 'function' ? this.content() : this.content;
    if (!(content instanceof jQuery)) content = $("<div>").html(content);
    
    this.highest_z_index = 0;
    this.overlay = $('<div class="uniformModal-overlay"></div>');
    this.blur = $("<div class='uniformModal-blur'></div>");
    this.original_scroll = window.scrollY;
    this.blur.css('top', 0 - this.original_scroll + "px")
    
    if ($('.uniformModal').length > 0) {
        this.highest_z_index = Math.max($('.uniformModal').map(function(){
            return parseInt($(this).css('zIndex'));
        }));
        this.$el.css('zIndex', this.highest_z_index + 2);
    }
    this.$el.append(this.overlay);
    this.blur.append($('body').children());
    
    $('body').addClass('uniformModal-active');
    $('body').append(this.blur)
    $('body').append(this.$el);
    
    var container = $('<div class="uniformModal-container">');
    container.append(content);
    
    container.append('<div class="uniformModal-close"></div>');
    this.$el.css('top', $(window).scrollTop());
    this.overlay.click(this.close.bind(this));
    this.$el.append(container);
    
    if (this.options.klass) container.addClass(this.options.klass);
    if (content instanceof $) content.trigger('rendered');
    this.trigger('rendered');
    
    return this;
}
UniformModal.prototype.close = function () {
    $('.uniformModal-active').removeClass('uniformModal-active');
    $('body').append(this.blur.children());
    this.blur.remove();
    $(window).scrollTop(this.original_scroll);
    this.trigger('closed');
    this.remove();
}
UniformModal.prototype.remove = function () {
    this.overlay.remove();
    this.$el.remove();
    this.$el.off('click');
    this.overlay.off('click');
    $(document).off('keyup', this.keyup.bind(this));
}