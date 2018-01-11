(function( $ ) {
 
    $.fn.uniformDropdown = function() {
        return this.each(function(){
            var el = $(this);
            var options = {
                el: this
            };
            if (el.data('dropdown-align') !== undefined)      options.align       = el.data('dropdown-align');
            if (el.data('dropdown-trigger') !== undefined)    options.trigger     = el.data('dropdown-trigger');
            if (el.data('dropdown-show_arrow') !== undefined) options.show_arrow  = el.data('dropdown-show_arrow');
            if (el.data('dropdown-square') !== undefined)     options.square  = el.data('dropdown-square');
            if (el.data('dropdown-hide_sm') !== undefined)    options.hide_sm     = el.data('dropdown-hide_sm');
            if (el.data('dropdown-content') !== undefined)    options.content     = "<div class='pad'>" + el.data('dropdown-content') + "</div>";
            if (el.data('dropdown-target') !== undefined)     options.content     = $(el.data('dropdown-target'));
            var dropdown = new UniformDropdown(options);
            dropdown.on('*', function (event_key, dropdown) {
                el.trigger('dropdown-' + event_key, dropdown);
            });
            dropdown.render();
        });
    };
 
}( jQuery ));
function UniformDropdown(options){
    UniformComponent.call(this, options);
}
UniformDropdown.prototype = Object.create(UniformComponent.prototype);
UniformDropdown.prototype.constructor = UniformComponent;
/*. UniformDropdown.initialize
    Options
    content:    string|$el - content rendered in dropdown
    align:      'center'|'left'|'right| - how dropdown aligns to trigger el
    trigger:    'click'|'focus'|'mouseover' - what triggers showDropdown
    show_arrow: true\false - show dropdown arrow
    hide_sm:    true|false - don't show dropdown on mobile browsers
    square:     true|false - round corners on dropdown
*/
UniformDropdown.prototype.initialize = function (options) {
    options = options || {}
    this.options = {
        align: 'center',
        trigger: 'click focus',
        show_arrow: true,
        hide_sm: false,
        square: false
    };
    this.options = $.extend(this.options, uniformHelpers.pick(options, Object.keys(this.options)));
    this.content = options.content;
    this.$el = (options.el instanceof $) ? options.el : $(options.el);
    options.el.dropdown = this;

    this.$el.on(this.options.trigger, this.toggle.bind(this));
    $(window).on('resize', this.resize.bind(this));
    $(document).on(this.options.trigger, this.outsideClick.bind(this));
    $(document).on('keyup', this.keyup.bind(this));
}

UniformDropdown.prototype.render = function () {
    this.dropdown = $("<div class='uniformDropdown-dropdown absolute'>");
    this.dropdown.css({
        minWidth: this.$el.outerWidth()
    })
    if (this.options.show_arrow) {
        this.dropdown.addClass('has-pointer');
        this.dropdown.append("<div class='uniformDropdown-pointer'></div>");
    }
    this.dropdown.toggleClass('square', this.options.square);
    this.dropdown.hide();
    this.dropdown.append(this.content);
    this.dropdown.appendTo($('body'));
    this.dropdown.find('.hidden').removeClass('hidden');

    this.resize();
    return this;
}


UniformDropdown.prototype.resize = function () {
    if(!this.dropdown) return;
    var position = {
        top: this.$el.offset().top + this.$el.outerHeight()
    }
    if (this.options.align == "center") {
        position.left = this.$el.offset().left + this.$el.outerWidth() / 2 - this.dropdown.outerWidth() / 2;
    } else if(this.options.align == "right") {
        position.right = $(window).width() - (this.$el.offset().left + this.$el.outerWidth());
    } else {
        position.left = this.$el.offset().left;
    }
    if (position.left && position.left + this.dropdown.outerWidth() > $(window).width()) {
        position.left = $(window).width() - this.dropdown.outerWidth();
    }
    this.dropdown.css(position);
}

UniformDropdown.prototype.remove = function () {
    this.$el.remove();
    this.$el.off(this.options.trigger);
    $(window).off('resize', this.resize.bind(this));
    $(document).off(this.options.trigger, this.outsideClick.bind(this));
    $(document).off('keyup', this.keyup.bind(this));
}

UniformDropdown.prototype.toggle = function () {
    if (this.$el.hasClass('active')) {
        this.hide();
    } else {
        this.show();
    }
}

UniformDropdown.prototype.show = function () {
    if(this.options.hide_sm && $(window).width() < 720) return;
    if(!this.dropdown) this.render();

    this.dropdown.show();
    this.$el.addClass('active');

    this.overlay = $("<div class='uniformOverlay'>");
    $('body').append(this.overlay);

    if ($(window).width() < 720) {
        this.lastScrollPosition = $(window).scrollTop();
        $('body').addClass('uniformModal-hideBody');
    }

    this.overlay.click(this.hide.bind(this));
    this.trigger('shown');
}

UniformDropdown.prototype.hide = function () {
    if(!this.dropdown) return;
    this.dropdown.hide();
    this.$el.removeClass('active');
    if (this.overlay) this.overlay.remove();
    if ($(window).width() < 720) {
        $('body').removeClass('uniformModal-hideBody');
        $(window).scrollTop(this.lastScrollPosition);
    }
    this.trigger('hidden');
}

UniformDropdown.prototype.outsideClick = function (e) {
    if (!this.dropdown || !this.dropdown.is(":visible")) return;
    if (e.target === this.$el[0]) return;
    if (e.target === this.overlay) return;
    if ($.contains(this.$el[0], e.target)) return;
    if ($.contains(this.dropdown[0], e.target)) return;
    this.hide();
}
UniformDropdown.prototype.keyup = function (e) {
    if(e.which != 27) return;
    this.hide();
}