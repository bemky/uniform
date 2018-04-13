import Component from 'uniform/component';

/*
    options
    class: String, appended to uniformSelect-edit button as class
    limit: int | false - number of options to limit to, or false to not limit
    showAll: function(select_options) to run if/when "Show All" is clicked
*/
export default class Select extends Component {

    initialize (options = {}) {
        this.options = {
            class: "",
            showAll: function (select_options){
                select_options.find('.uniformSelect-show-all').remove();
                select_options.find('button.hide').removeClass('hide');
                return false;
            },
            limit: 8
        }
        
        Object.assign(this.options, this.pick(options, Object.keys(this.options)));

        var showing, lastScrollPosition, select_options;

        this.$el.on('change', this.updateSelect.bind(this));
        this.$el.on('close', this.hideOptions.bind(this));
        this.$el.on('revealed', this.resize.bind(this));
        this.el.uniformSelect = this.container;
        
        $(window).on('resize', this.resize.bind(this));
        $(window).on('scroll', this.updatePosition.bind(this));
        $(document).on('click', this.outsideClick.bind(this));
        $(document).on('keyup', this.keyup.bind(this));
        
        this.activeIcon = $(`<span class='uniformSelect-option-icon'>${}</span>`)
    }
    
    outsideClick (e) {
        if (!this.showing) return;
        if (e.target === this.select_options[0]) return;
        if ($.contains(this.container[0], e.target)) return;
        if ($.contains(this.select_options[0], e.target)) return;
        this.hideOptions();
    }
    
    keyup (e) {
        if(e.which === 27) this.hideOptions();
    }
    
    render () {
        this.container = $("<div class='uniformSelect-container'></div>");
        this.edit_button = $(`<button type='button' class='uniformSelect-edit uniformInput outline block ${this.options.class}'></button>`);
        this.container.append(this.edit_button);
        
        if (this.$el.attr('name')) {
            this.container.addClass(this.$el.attr('name').toLowerCase().replace(/[^a-z0-9\-_]+/g, '-'));
        }
        this.$el.hide()
        this.$el.before(this.container);
        this.updateSelect();
        this.resize();
        
        this.edit_button.on('click', this.showOptions.bind(this));
    }

    resize () {
        // to keep button from extending beyond available width
        var text = this.edit_button.text();
        this.edit_button.text('');
        this.edit_button.css({
            width: 'auto'
        });
        this.edit_button.css({
            width: this.container.outerWidth()
        });
        this.edit_button.text(text);

        if(typeof this.select_options === "undefined") return;
        this.select_options.css({
            position: 'absolute',
            top: this.container.offset().top + this.container.outerHeight(),
            left: this.container.offset().left + 1,
            minWidth: this.container.outerWidth() - 1
        });
    }

    renderOptions () {
        this.select_options = $("<div class='uniformSelect-options'>");
        if (this.$el.attr('name')) {
            this.select_options.addClass(this.$el.attr('name').toLowerCase().replace(/[^a-z0-9\-_]+/g, '-'));
        }
        this.select_options.css({
            fontSize: this.$el.css('font-size')
        });
        this.select_options.hide();
        this.select_options.appendTo('body');
        this.$el.find('option').each(function(index, el){
            var button = $("<button type='button' class='uniformSelect-option block outline text-left'>");
            button[0].option = $(el);
            button.text($(el).text());
            button.attr('value', $(el).val());
            if (button.text() == "") button.html("<span class='text-italic text-muted'>None</span>");
            if($(el).prop('selected')){
                button.addClass('active');
            } else if (this.options.limit && index > this.options.limit) {
                button.addClass('hide');
            }
            this.select_options.append(button);
            button.click(this.selectOption.bind(this));
        }.bind(this));

        var actions_el = $('<div class="uniformSelect-options-actions">');
        if (this.options.limit && this.$el.find('option').length > this.options.limit) {
            var show_all_button = $("<button type='button' class='uniformSelect-show-all block outline blue' style='border: none'>Show All</button>");
            show_all_button.click(function(e){
                this.options.showAll(this.select_options);
                return false;
            }.bind(this));
            actions_el.append(show_all_button);
        }
        if (this.$el.prop('multiple')) {
            var done_button = $("<button type='button' class='uniformSelect-done block outline blue'>Done</button>");
            done_button.click(this.hideOptions.bind(this));
            actions_el.append(done_button);
        }
        if (!actions_el.is(':empty')) {
            this.select_options.append(actions_el);
        }

        this.$el.trigger('rendered', this.select_options);
    }

    hideOptions () {
        if(typeof this.select_options === "undefined") return;
        this.showing = false;
        this.select_options.hide();
        this.select_options.removeClass('fixed');
        this.edit_button.removeClass('active');
        $('body').removeClass('uniformModal-hideBody');
        if(this.lastScrollPosition) $(window).scrollTop(this.lastScrollPosition);
        this.$el.trigger('hidden:options');
    }

    showOptions() {
        if (this.showing){
            this.hideOptions();
            return false;
        }
        this.showing = true;
        if(!this.select_options) this.renderOptions();
        this.resize();
        this.select_options.show();
        this.edit_button.addClass('active');

        this.lastScrollPosition = $(window).scrollTop();
        this.updatePosition();
        $('body').addClass('uniformModal-hideBody');
    }

    selectOption(e) {
        if (!this.$el.prop('multiple')) {
            this.$el.find("option:selected").prop('selected', false);
            this.select_options.find('.uniformSelect-option.active .uniformSelect-option-icon').remove();
            this.select_options.find('.uniformSelect-option.active').removeClass('active');
        }
        $(e.currentTarget).toggleClass('active');
        e.currentTarget.option.prop('selected', $(e.currentTarget).hasClass('active'));
        if ($(e.currentTarget).hasClass('active')) {
            $(e.currentTarget).append(this.optionIcon.clone());
        }
        this.$el.trigger('change');
    }
    
    updateSelect () {
        if (!this.$el.prop('multiple')) this.hideOptions();
        var value = $.map(this.$el.find('option:selected'), function(el){
            return $(el).text();
        }).join(", ");
        if (value == "") value = "&nbsp;";
        this.edit_button.html(value);
    }

    updatePosition () {
        if(!this.select_options) return;
        
        var fixedParents = this.container.parents().filter(function (){
            return $(this).css('position') == 'fixed';
        });

        if (this.select_options.hasClass('fixed')) {
            if (fixedParents.length == 0) {
                this.select_options.css({
                    position: 'absolute',
                    top: this.container.offset().top + this.container.outerHeight(),
                });
                this.select_options.removeClass('fixed');
            }
        } else if(fixedParents.length > 0) {
            this.lastScrollPosition = false;
            this.select_options.css({
                position: 'fixed',
            });
            this.select_options.offset({
                top: this.container.offset().top + this.container.outerHeight(),
                left: this.container.offset().left
            });
            this.select_options.addClass('fixed');
        }
    }
}