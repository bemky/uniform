(function( $ ) {
 
    $.fn.uniformModal = function() {
        var el = $(this);
        var options = {
            klass: el.data('modal-klass'),
            content: el.data('modal-content')
        };
        if (el.data('modal-target')) {
            options.content = $(el.data('modal-target'));
        }
        var modal = new UniformModal(options);
        modal.on('*', function (event_type, modal) {
            el.trigger('modal-' + type, modal);
        });
        modal.render();
    };
 
}( jQuery ));

class UniformModal extends UniformComponent {
	
    /*
        Options
        content:    string|$el|function
        klass:      string - classes to append to modal container
    */
    initialize (options) {
        this.options = {
            klass: false,
        };
        $.extend(this.options, uniformHelpers.pick(options, 'klass'));
        this.content = options.content;
        
        this.$el.addClass('uniformModal');
        $(document).on('keyup', this.keyup.bind(this));
        this.$el.on('click', '.uniformModal-close', this.close.bind(this));
    }
    
    keyup (e) {
        if(e.which != 27) return;
        this.close();
    }
    
    render () {
        var content = typeof this.content == 'function' ? this.content() : this.content;
        this.highest_z_index = 0;
        this.overlay = $('<div class="uniformModal-overlay"></div>');
        
        if ($('.uniformModal').length > 0) {
            this.highest_z_index = Math.max($('.uniformModal').map(function(){
                return parseInt($(this).css('zIndex'));
            }));
            this.overlay.css('zIndex', this.highest_z_index + 1);
            this.$el.css('zIndex', this.highest_z_index + 2);
        }
        
        $('body').children().each(_.bind(function(el){
            if($(el).hasClass('ignore-uniformModal-blur')) return;
            $(el).addClass('uniformModal-blur uniformModal-blur-' + this.highest_z_index);
        }, this));
        $('body').addClass('uniformModal-active');
        $('body').append(this.overlay);
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
    
    close () {
        $('.uniformModal-active').removeClass('uniformModal-active');
        $('.uniformModal-blur-' + this.highest_z_index).removeClass('uniformModal-blur-' + this.highest_z_index);
        $('.uniformModal-blur').each(function(){
            if($(this).attr('class').match('uniformModal-blur-')) return;
            $(this).removeClass('uniformModal-blur');
        });
        this.trigger('closed');
        this.remove();
    }
    
    remove () {
        this.overlay.remove();
        this.$el.remove();
        this.$el.off('click');
        this.overlay.off('click');
        $(document).off('keyup', this.keyup.bind(this));
    }
    
    on (type, handler) {
        this.eventListeners.push({
            type: type,
            handler: handler
        });
    }
    
    trigger (type) {
        for (var i = 0; i < this.eventListeners.length; i++) {
            if(type == "*" || type == "all" || type == this.eventListeners[i].type){
                this.eventListeners[i].handler(type, this);
            }
        }
    }
}