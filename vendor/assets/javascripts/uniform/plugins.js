import Dropdown from 'uniform/dropdown';
import Checkbox from 'uniform/checkbox';
import Modal from 'uniform/modal';
import Select from 'uniform/select';
import FloatingLabel from 'uniform/floating-label';
import Resizer from 'uniform/resizer';
import Tooltip from 'uniform/tooltip';

export default (($) => {
    
    /*
        Dropdown
    */
    $.fn.uniformDropdown = function() {
        return this.each(function(){
            var el = $(this);
            var options = {
                el: this
            };
            
            if (el.data('dropdown-align') !== undefined)      options.align       = el.data('dropdown-align');
            if (el.data('dropdown-trigger') !== undefined)    options.trigger     = el.data('dropdown-trigger');
            if (el.data('dropdown-show_arrow') !== undefined) options.show_arrow  = el.data('dropdown-show_arrow');
            if (el.data('dropdown-square') !== undefined)     options.square      = el.data('dropdown-square');
            if (el.data('dropdown-hide_sm') !== undefined)    options.hide_sm     = el.data('dropdown-hide_sm');
            if (el.data('dropdown-content') !== undefined)    options.content     = `<div class='pad'>${el.data('dropdown-content')}</div>`;
            if (el.data('dropdown-target') !== undefined)     options.content     = $(el.data('dropdown-target'));
            var dropdown = new Dropdown(options);
            dropdown.on('*', function (event_key, dropdown) {
                el.trigger('dropdown-' + event_key, dropdown);
            });
            dropdown.render();
        });
    };
    
    
    /*
        Checkbox
    */
    $.fn.uniformCheckbox = function() {
        return this.each(function(){
            var el = $(this);
            var checkbox = new Checkbox({
                el: this
            });
            checkbox.render();
        });
    };
    $.fn.uniformRadio = $.fn.uniformCheckbox;
    
    
    /*
        FloatingLabel
    */
    $.fn.uniformFloatingLabel = function() {
        return this.each(function(){
            new FloatingLabel({
                el: this
            }).render();
        });
    };
    
    
    /*
        Modal
    */
    $.fn.uniformModal = function() {
        return this.click(function(){
            var el = $(this);
            var options = {
                klass: el.data('modal-klass'),
                content: el.data('modal-content')
            };
            if (el.data('modal-target')) {
                options.content = $(el.data('modal-target')).clone();
                options.content.removeClass('hidden');
            }
            var modal = new Modal(options).render();
            
            modal.on('*', function (event_type, modal) {
                el.trigger('modal-' + event_type, modal);
            });
        })
    };
    
    
    /*
        Resizer
    */
    $.fn.uniformResizer = function() {
        return this.each(function(){
            new Resizer({
                el: this
            });
        });
    };
    
    
    /*
        Select
    */
    $.fn.uniformSelect = function() {
        return this.each(function(){
            new Select({
                el: this
            }).render();
        });
    };
    
    
    /*
        Tooltip
    */
    $.fn.uniformTooltip = function() {
        return this.each(function(){
            var el = $(this);
            var tooltip = new Tooltip({
                message: el.data('tooltip-message'),
                el: this
            });
            tooltip.on('*', function (event_type, tooltip) {
                el.trigger('tooltip-' + event_type, tooltip);
            });
            tooltip.render();
        });
    };
    
})($)


