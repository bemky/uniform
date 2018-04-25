import Component from './component';

/*
    message: html
    align: top|bottom (default: top)
*/
export default class Tooltip extends Component {
    initialize (options) {
        options = options || {}
        this.options = {
            align: 'top',
        };
        Object.assign(this.options, this.pick(options, Object.keys(this.options)));
        
        this.enabled = true;
        this.message = options.message;
        options.el.tooltip = this;

        this.$el.on('mouseenter', this.show.bind(this));
        this.$el.on('mouseleave', this.hide.bind(this));
    }
    
    render () {
        this.popup = $('<div class="uniformTooltip-popup">' + this.message + '</div>');
        this.popup.prepend("<div class='uniformTooltip-pointer'></div>");
        this.$el.append(this.popup);
        if (this.message.length > 100) {
            this.popup.css({
                minWidth: "200px"
            });
        } else {
            this.popup.css({
                whiteSpace: "nowrap"
            })
        }
        if (this.popup.outerWidth(true) + this.popup.offset().left > $(window).width()) {
            this.popup.css({
                left: $(window).width() - this.popup.outerWidth(true) - this.popup.offset().left
            });
        }
        
        this.popup.css('display', 'block');
        if (this.options.align == "bottom" || this.popup.offset().top < 0) {
            this.popup.addClass('-align-bottom');
        }
        this.popup.css('display', 'none');
        
        return this;
    }
    
    remove () {
        this.$el.remove();
        
    }
    
    show () {
        if(!this.popup) this.render();
        if(!this.enabled) return;

        if (this.hiding) return this.show_after_hide = true;
        if (this.showing || this.shown) return;
        this.popup.css('display', 'block');
        this.showing = true;
        this.hidden = false;
        
        this.$el.addClass('active');
        
        var animation = {
            bottom: "100%",
            opacity: 1
        }
        
        if(this.popup.hasClass('-align-bottom')){
            animation = {
                top: "100%",
                opacity: 1
            }
        }
        
        this.popup.animate(animation, 200, (function(){
            this.showing = false;
            this.shown = true;
            if (this.hide_after_show) this.hide();
            this.hide_after_show = false;
        }).bind(this));

        if (this.popup.offset().left < 0) {
            this.popup.css({
                left: 0
            })
        }
        this.trigger('shown');
    }
    
    hide () {
        if (this.showing) return this.hide_after_show = true;
        if (this.hiding || this.hidden) return;
        this.hiding = true;
        this.shown = false;
        
        var animation = {
            bottom: '200%',
            opacity: 0
        }
        
        if(this.popup.hasClass('-align-bottom')){
            animation = {
                top: '200%',
                opacity: 0
            }
        }
        
        this.popup.animate(animation, 200, (function (){
            this.popup.css('display', 'none');
            this.$el.removeClass('active');
            this.hiding = false;
            this.hidden = true;
            this.trigger('hidden');
            if (this.show_after_hide) this.show();
            this.show_after_hide = false;
        }).bind(this))
    }
    
    disable () {
        this.enabled = false;
    }
    
    enabled () {
        this.enabled = true;
    }
    
    checkCursor () {
        
        setTimeout(this.checkCursor, 1000);
    }

}