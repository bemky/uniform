import Component from 'uniform/component';

/*  UniformModal.initialize
    Options
    content:    string|$el|function
    klass:      string - classes to append to modal container
*/
export default class Modal extends Component {
    
    initialize (options) {
        this.options = {
            klass: false,
        };
        $.extend(this.options, this.pick(options, ['klass']));
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
        var that = this;
        var content = typeof this.content == 'function' ? this.content() : this.content;
        if (!(content instanceof jQuery)) content = $("<div>").html(content);

        this.highest_z_index = 0;
        this.overlay = $('<div class="uniformModal-overlay"></div>');
        this.blur = $('<div class="uniformModal-blur"></div>');
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
    
    close () {
        $('.uniformModal-active').removeClass('uniformModal-active');
        $('body').append(this.blur.children());
        this.blur.remove();
        $(window).scrollTop(this.original_scroll);
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
}