import * as Uniform from 'uniform';

window.Uniform = Uniform;
if($) {    
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
            if (el.data('dropdown-target') !== undefined)     options.content     = $(el.data('dropdown-target'))[0];
            var dropdown = new Uniform.Dropdown(options);
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
            var checkbox = new Uniform.Checkbox({
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
            new Uniform.FloatingLabel({
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
                var target = $(el.data('modal-target')).clone()
                target.removeClass('hidden');
                options.content = target[0];
            }
            var modal = new Uniform.Modal(options).render();
        
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
            new Uniform.Resizer({
                el: this
            });
        });
    };


    /*
        Select
    */
    $.fn.uniformSelect = function() {
        return this.each(function(){
            var options = {
                el: this
            };
            Object.assign(options, $(this).data());
            new Uniform.Select(options).render();
        });
    };


    /*
        Tooltip
    */
    $.fn.uniformTooltip = function() {
        return this.each(function(){
            var el = $(this);
            var tooltip = new Uniform.Tooltip({
                message: el.data('tooltip-message'),
                el: this
            });
            tooltip.on('*', function (event_type, tooltip) {
                el.trigger('tooltip-' + event_type, tooltip);
            });
            tooltip.render();
        });
    };
    
    $.fn.uniformTristate = function () {
        return this.each(function(){
            var el = $(this);
            function updateTristateStatus(checked_input){
                if (checked_input.length == 0) {
                    el.addClass('-null');
                    $(el.find('input')[1]).prop('checked', true);
                } else {
                    var index = checked_input.index();
                    var klass = index == 0 ? "-true" : (index == 1 ? "-null" : "-false");
                    el.removeClass('-true -null -false');
                    el.addClass(klass);
                }
            }
            el.on('change', 'input', function (e) {
                updateTristateStatus($(e.currentTarget));
            });
            updateTristateStatus(el.find('input:checked'));
        });
    }
}