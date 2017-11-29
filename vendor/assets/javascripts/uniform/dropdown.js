(function( $ ) {
 
    $.fn.uniformDropdown = function() {
        return this.each(function(){
            var el = $(this);
            var options = {
                align: el.data('dropdown-klass'),
                trigger: el.data('dropdown-content'),
                show_arrow: el.data('dropdown-show_arrow'),
                hide_sme: el.data('dropdown-hide_sm'),
                content: "<div class='pad'>" + el.data('dropdown-content') + "</div>",
                el: el
            };
            if (el.data('dropdown-target')) {
                options.content = $(el.data('dropdown-target'));
            }
            var dropdown = new UniformDropdown(options);
            dropdown.on('*', function (event_type, dropdown) {
                el.trigger('dropdown-' + type, dropdown);
            });
            dropdown.render();
        });
    };
 
}( jQuery ));

class UniformDropdown extends UniformComponent {
	
    /*
        Options
        content:    string|$el - content rendered in dropdown
        align:      'center'|'left'|'right| - how dropdown aligns to trigger el
        trigger:    'click'|'focus'|'mouseover' - what triggers showDropdown
        show_arrow: true\false - show dropdown arrow
        hide_sm:    true|false - don't show dropdown on mobile browsers
    */
    initialize (options) {
        this.options = {
            align: 'center',
            trigger: 'click focus',
            show_arrow: true,
            hide_sm: false
        };
        $.extend(this.options, uniformHelpers.pick(Object.keys(this.options), 'align', 'trigger', 'show_arrow', 'min_width', 'hide_sm'));
        
        this.content = options.content;
        this.$el = (options.el instanceof $) ? options.el : $(options.el);
        
        this.$el.on(this.options.trigger, this.show.bind(this));
        $(window).on('resize', this.resize.bind(this));
        $(document).on(this.options.trigger, this.outsideClick.bind(this));
        $(document).on('keyup', this.keyup.bind(this));
    }
    
    render () {
        this.dropdown = $("<div class='uniformDropdown-dropdown absolute'>");
        this.dropdown.css({
            minWidth: this.$el.outerWidth();
        })
        if (this.options.show_arrow) {
            this.dropdown.addClass('has-pointer');
            this.dropdown.append("<div class='uniformDropdown-pointer'></div>");
        }
        this.dropdown.hide();
        this.dropdown.append(this.content);
        this.dropdown.appendTo($('body'));
        this.dropdown.find('.hidden').removeClass('hidden');
        
        this.resize();
        return this;
    }
    
    // TODO add 'left' alignment
    resize () {
        if(!this.dropdown) return;
        var position = {
            top: this.$el.offset().top + this.$el.outerHeight();
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
    
    remove () {
        this.$el.remove();
        this.$el.off(this.options.trigger);
        $(window).off('resize', this.resize.bind(this));
        $(document).off(this.options.trigger, this.outsideClick.bind(this));
        $(document).off('keyup', this.keyup.bind(this));
    }
    
    show () {
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
    
    hide () {
        if(!this.dropdown) return;
        this.dropdown.hide();
        this.$el.removeClass('active');
        this.overlay.remove();
        if ($(window).width() < 720) {
            $('body').removeClass('uniformModal-hideBody');
            $(window).scrollTop(this.lastScrollPosition);
        }
        this.trigger('hidden');
    }
    
    outsideClick (e) {
        if (!this.dropdown || !this.dropdown.is(":visible")) return;
        if (e.target === this.$el[0]) return;
        if (e.target === this.overlay) return;
        if ($.contains(this.$el[0], e.target)) return;
        if ($.contains(this.dropdown[0], e.target)) return;
        this.hide();
    }
    
    keyup () {
        if(e.which != 27) return;
        this.hide();
    }
}