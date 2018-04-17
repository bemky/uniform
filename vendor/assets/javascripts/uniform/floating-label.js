import Component from 'uniform/component';

export default class FloatingLabel extends Component {
    
    initialize(){
        this.label = this.$el.find('label');
        this.input = $("#" + this.label.prop('for'));
        this.startingHeight;
        
        this.input.focus(this.activate.bind(this));
        this.input.blur(this.deactivate.bind(this));
        this.input.on('revealed', this.render.bind(this));
        if (this.input.is(":focus")) this.activate();
    }
    
    render () {
        if(!this.input.is(":visible")) return;
        if(this.$el.hasClass('enabled')) return;

        var padding = parseInt(this.input.css('paddingBottom'));
        this.startingHeight = this.input.outerHeight();
        this.$el.addClass('enabled');
        this.$el.addClass('inactive');

        this.input.css({
            paddingTop: padding + padding/2 + "px",
            paddingBottom: padding - padding/2 - 2 + "px"
        });

        this.label.css({
            position: 'absolute',
            top: 0,
            left: this.label.position().left,
            paddingLeft: this.input.css("paddingLeft"),
            height: this.startingHeight,
            lineHeight: this.startingHeight + "px"
        });

        if (typeof this.input.val() !== "undefined" && this.input.val() != "") this.activate();
    }
    
    activate (e) {
        if (typeof e !== "undefined") this.$el.addClass('active');
        if (this.$el.hasClass('float')) return;
        this.$el.addClass('float');
        this.$el.removeClass('inactive');
        this.label.css({
            lineHeight: this.startingHeight / 2 + "px"
        });
    }
    
    deactivate (e) {
        if (typeof e !== "undefined") this.$el.removeClass('active');
        if (this.input.val() != "") return;
        this.$el.removeClass('float');
        this.$el.addClass('inactive');
        this.label.css({
            lineHeight: this.startingHeight + "px"
        });
    }
}