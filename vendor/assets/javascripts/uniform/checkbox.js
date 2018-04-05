import Component from 'uniform/component';

export default class Checkbox extends Component {
    initialize (options) {
        this.$el.on('change', this.change.bind(this));
    }
    
    render () {
        var type = this.$el.hasClass('uniformRadio') ? 'uniformRadio' : 'uniformCheckbox';
        this.checkbox = $(`<div class="${type}-indicator">`);
        this.checkbox.addClass(this.$el.attr('class').replace(type, ''));
        this.checkbox.toggleClass('checked', this.$el.prop('checked'));
        this.$el.after(this.checkbox);
        this.checkbox.click(this.click.bind(this));
        return this;
    }
    
    click () {
        if (this.$el.prop('disabled')) return;
        this.$el.prop('checked', !this.$el.prop('checked'));
        this.$el.trigger('change');
        e.preventDefault();
    }
    change () {
        this.checkbox.toggleClass('checked', this.$el.prop('checked'));
    }
}