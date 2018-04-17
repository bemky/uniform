import Component from 'uniform/component';

/*. Dropdown.initialize
    content:    string|$el - content rendered in dropdown
    align:      'center'|'left'|'right| - how dropdown aligns to trigger el
    trigger:    'click'|'focus'|'mouseover' - what triggers showDropdown
    show_arrow: true\false - show dropdown arrow
    hide_sm:    true|false - don't show dropdown on mobile browsers
    square:     true|false - round corners on dropdown
*/
export default class Dropdown extends Component {
    
    initialize(options){
        options = options || {}
        this.options = {
            align: 'center',
            trigger: 'click',
            show_arrow: true,
            hide_sm: false,
            square: false
        };
        
        Object.assign(this.options, this.pick(options, Object.keys(this.options)));
        this.content = options.content;
        this.$el[0].dropdown = this;
        
        this.$el.on(this.options.trigger, this.toggle.bind(this));
        
        this.$el.on('mousedown', function (){
            this.mousedown = true;
        }.bind(this));
    
        this.$el.on('mouseup', function (){
            this.mousedown = false;
        }.bind(this));
        
        this.$el.on('focus', function (){
            if(this.mousedown) return;
            this.show();
        }.bind(this));
        
        $(document).on('focus', this.outsideClick.bind(this));
        $(document).on(this.options.trigger, this.outsideClick.bind(this));
        
        $(document).on('keyup', this.keyup.bind(this));
        
        $(window).on('resize', this.resize.bind(this));
    }
    
    render () {
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
    
    resize () {
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
    
    remove () {
        this.$el.remove();
        this.$el.off(this.options.trigger);
        $(window).off('resize', this.resize.bind(this));
        $(document).off(this.options.trigger, this.outsideClick.bind(this));
        $(document).off('keyup', this.keyup.bind(this));
    }
    
    toggle (e) {
        if (this.$el.hasClass('active') && this.options.trigger != "mouseover") {
            this.hide();
        } else {
            this.show();
        }
    }
    
    show () {
        if(this.options.hide_sm && $(window).width() < 720) return;
        if(!this.dropdown){
            this.render();
        } else {
            this.resize();
        }
        
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
        if (this.overlay) this.overlay.remove();
        if ($(window).width() < 720) {
            $('body').removeClass('uniformModal-hideBody');
            $(window).scrollTop(this.lastScrollPosition);
        }
        this.trigger('hidden');
    }
    
    outsideClick (e) {
        if (!this.dropdown || !this.dropdown.is(":visible")) return;
        if (e.target === this.el) return;
        if (e.target === this.overlay) return;
        if ($.contains(this.el, e.target)) return;
        if ($.contains(this.dropdown[0], e.target)) return;
        this.hide();
    }
    
    keyup (e) {
        if(e.which != 27) return;
        this.hide();
    }
}
