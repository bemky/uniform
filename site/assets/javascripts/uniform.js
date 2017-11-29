(function() {
    uniformHelpers = {}
    
    var nativeIsArray = Array.isArray;
    var property = function(key) {
        return function(obj) {
            return obj == null ? void 0 : obj[key];
        };
    };
    var flatten = function(input, shallow, strict, startIndex) {
        var output = [], idx = 0;
        for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
            var value = input[i];
            if (isArrayLike(value) && (uniformHelpers.isArray(value) || uniformHelpers.isArguments(value))) {
                if (!shallow) value = flatten(value, shallow, strict);
                var j = 0, len = value.length;
                output.length += len;
                while (j < len) {
                    output[idx++] = value[j++];
                }
            } else if (!strict) {
                output[idx++] = value;
            }
        }
        return output;
    };
    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    var getLength = property('length');
    var isArrayLike = function(collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };
    
    uniformHelpers.has = function(obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    };
    uniformHelpers.isArguments = function(obj) {
        return uniformHelpers.has(obj, 'callee');
    };
    uniformHelpers.isArray = nativeIsArray || function(obj) {
        return toString.call(obj) === '[object Array]';
    };
    
    uniformHelpers.isFunction = function(obj) {
        return typeof obj == 'function' || false;
    };
    uniformHelpers.pick = function(object, oiteratee, context) {
        var result = {}, obj = object, iteratee, keys;
        if (obj == null) return result;
        if (uniformHelpers.isFunction(oiteratee)) {
            keys = obj.keys();
            iteratee = optimizeCb(oiteratee, context);
        } else {
            keys = flatten(arguments, false, false, 1);
            iteratee = function(value, key, obj) { return key in obj; };
            obj = Object(obj);
        }
        for (var i = 0, length = keys.length; i < length; i++) {
            var key = keys[i];
            var value = obj[key];
            if (iteratee(value, key, obj)) result[key] = value;
        }
        return result;
    };
    
}.call(this));

class UniformComponent {
    constructor (options) {
        this.eventListeners = new Array();
        this.$el = $('<div>');
        
        this.initialize(options);
    }
    
    initialize () {}
    
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
                options.content = $(el.data('dropdown-target'))
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
            minWidth: this.$el.outerWidth()
        })
        if (this.options.show_arrow) {
            this.dropdown.addClass('has-pointer');
            this.dropdown.append("<div class='uniformDropdown-pointer'></div>")
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
;
(function( $ ) {
 
    $.fn.uniformFloatingLabel = function() {
        return this.each(function(){
            var el = $(this);
            var label = el.find('label');
            var input = $("#" + label.prop('for'));
            var startingHeight;
    
            function render(e) {
                if(!input.is(":visible")) return;
                if(el.hasClass('enabled')) return;
        
                var padding = parseInt(input.css('paddingBottom'));
                startingHeight = input.outerHeight();
                el.addClass('enabled');
                el.addClass('inactive');
        
                input.css({
                    paddingTop: padding + padding/2 + "px",
                    paddingBottom: padding - padding/2 - 2 + "px"
                })

                label.css({
                    position: 'absolute',
                    top: 0,
                    left: label.position().left,
                    paddingLeft: input.css("paddingLeft"),
                    height: startingHeight,
                    lineHeight: startingHeight + "px"
                })
            }

            function activate (e) {
                if (typeof e !== "undefined") el.addClass('active');
                if (el.hasClass('float')) return;
                el.addClass('float');
                el.removeClass('inactive');
                label.css({
                    lineHeight: startingHeight / 2 + "px"
                });
            }

            function deactivate (e) {
                if (typeof e !== "undefined") el.removeClass('active');
                if (input.val() != "") return;
                el.removeClass('float');
                el.addClass('inactive');
                label.css({
                    lineHeight: startingHeight + "px"
                })
            }
    
            render();
            input.focus(activate);
            input.blur(deactivate);
            input.on('revealed', render);
            if (typeof input.val() !== "undefined" && input.val() != "") activate();
            if (input.is(":focus")) activate();
        });
    };
 
}( jQuery ));
(function( $ ) {
 
    $.fn.uniformModal = function() {
        var el = $(this);
        var options = {
            klass: el.data('modal-klass'),
            content: el.data('modal-content')
        };
        if (el.data('modal-target')) {
            options.content = $(el.data('modal-target'))
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
            this.highest_z_index = Math.max($('.uniformModal').map(function(){ return parseInt($(this).css('zIndex'))}));
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
;
/*
    options
    class: String, appended to uniformSelect-edit button as class
    limit: int | false - number of options to limit to, or false to not limit
    showAll: function(select_options) to run if/when "Show All" is clicked
*/

(function( $ ) {
    $.fn.fixedParents = function (selector) {
        return this.parents().filter(function (){
            return $(this).css('position') == 'fixed';
        })
    }
    
    $.fn.uniformSelect = function(options) {
        options = $.extend({
            class: "",
            showAll: function (select_options){
                select_options.find('.uniformSelect-show-all').remove();
                select_options.find('button.hidden').removeClass('hidden');
                return false;
            },
            limit: 8
        }, options);
        
        return this.each(function(){
            var showing, lastScrollPosition, select_options;
            var select = $(this);
            var container = $("<div class='uniformSelect-container'></div>")
            var edit_button = $("<button type='button' class='uniformSelect-edit uniformInput outline block" + options.class + "'></button>");
            container.append(edit_button);
            if (select.attr('name')) {
                container.addClass(select.attr('name').toLowerCase().replace(/[^a-z0-9\-_]+/g, '-'));
            }

            select.hide();
            select.before(container);


            function updateSelectValue() {
                if (!select.prop('multiple')) hideOptions();
                var value = $.map(select.find('option:selected'), function(el){
                    return $(el).text();
                }).join(", ");
                if (value == "") value = "&nbsp;"
                edit_button.html(value);
            }
            
            function resize () {
                // to keep button from extending beyond available width
                var text = edit_button.text();
                edit_button.text('');
                edit_button.css({
                    width: 'auto'
                })
                edit_button.css({
                    width: container.outerWidth()
                })
                edit_button.text(text);
        
                if(typeof select_options === "undefined") return;
                select_options.css({
                    position: 'absolute',
                    top: container.offset().top + container.outerHeight(),
                    left: container.offset().left,
                    minWidth: container.outerWidth()
                });
            }
            
            function renderOptions() {
                select_options = $("<div class='uniformSelect-options'>");
                if (select.attr('name')) {
                    select_options.addClass(select.attr('name').toLowerCase().replace(/[^a-z0-9\-_]+/g, '-'));
                }
                select_options.css({
                    fontSize: select.css('font-size')
                })
                select_options.hide();
                select_options.appendTo('body');
                select.find('option').each(function(index, el){
                    var button = $("<button type='button' class='uniformSelect-option block outline text-left'>");
                    button[0].option = $(el);
                    button.text($(el).text());
                    button.attr('value', $(el).val());
                    if (button.text() == "") button.html("<span class='text-italic text-muted'>None</span>");
                    if($(el).prop('selected')){
                        button.addClass('active');
                    } else if (options.limit && index > options.limit) {
                        button.addClass('hidden');
                    }
                    select_options.append(button);
                    button.click(selectOption);
                });
        
                var actions_el = $('<div class="uniformSelect-options-actions">');
                if (options.limit && select.find('option').length > options.limit) {
                    var show_all_button = $("<button type='button' class='uniformSelect-show-all block outline blue' style='border: none'>Show All</button>");
                    show_all_button.click(function(e){
                        options.showAll(select_options);
                        return false;
                    });
                    actions_el.append(show_all_button);
                }
                if (select.prop('multiple')) {
                    var done_button = $("<button type='button' class='uniformSelect-done block outline blue'>Done</button>")
                    done_button.click(hideOptions);
                    actions_el.append(done_button);
                }
                if (!actions_el.is(':empty')) {
                    select_options.append(actions_el);
                }
        
                select.trigger('rendered', select_options);
            }
            
            function hideOptions () {
                if(typeof select_options === "undefined") return;
                showing = false;
                select_options.hide();
                select_options.removeClass('fixed');
                $('body').removeClass('uniformModal-hideBody');
                if(lastScrollPosition) $(window).scrollTop(lastScrollPosition);
                select.trigger('hidden:options');
            }
            
            function showOptions() {
                if (showing){
                    hideOptions();
                    return false;
                }
                showing = true;
                if(!select_options) renderOptions();
                resize();
                select_options.show();
        
                lastScrollPosition = $(window).scrollTop();
                updatePosition();
                $('body').addClass('uniformModal-hideBody');
            }
            
            function selectOption(e) {
                if (!select.prop('multiple')) {
                    select.find("option:selected").prop('selected', false);
                    select_options.find('.uniformSelect-option.active').removeClass('active');
                }
                $(e.currentTarget).toggleClass('active');
                e.currentTarget.option.prop('selected', $(e.currentTarget).hasClass('active'));
                select.trigger('change');
            }
            
            function updatePosition () {
                if(!select_options) return;
        
                if (select_options.hasClass('fixed')) {
                    if (container.fixedParents().length == 0) {
                        select_options.css({
                            position: 'absolute',
                            top: container.offset().top + container.outerHeight(),
                        });
                        select_options.removeClass('fixed');
                    }
                } else if(container.fixedParents().length > 0) {
                    lastScrollPosition = false;
                    select_options.css({
                        position: 'fixed',
                    });
                    select_options.offset({
                        top: container.offset().top + container.outerHeight(),
                        left: container.offset().left
                    })
                    select_options.addClass('fixed');
                }
            }
            
            
            updateSelectValue();
            resize();
            
            edit_button.on('click', showOptions);
            
            select.on('change', updateSelectValue);
            select.on('close', hideOptions);
            select.on('revealed', resize);
            select[0].uniformSelect = container;

            $(window).on('resize', resize);
            $(window).on('scroll', updatePosition);
            $(document).on('click', function(e){
                if (!showing) return;
                if (e.target === select_options[0]) return;
                if ($.contains(container[0], e.target)) return;
                if ($.contains(select_options[0], e.target)) return;
                hideOptions();
            });
            $(document).on('keyup', function(e) {
                if(e.which === 27) hideOptions();
            });
        });
    };
 
}( jQuery ));
(function( $ ) {
 
    $.fn.uniformTooltip = function() {
        return this.each(function(){
            var el = $(this);
            var tooltip = new UniformTooltip({
                message: el.data('tooltip-message'),
                el: this
            });
            tooltip.on('*', function (event_type, tooltip) {
                el.trigger('tooltip-' + type, tooltip);
            });
            tooltip.render();
        });
    };
 
}( jQuery ));

class UniformTooltip extends UniformComponent {
    initialize (options) {
        this.message = options.message;
        this.$el = (options.el instanceof $) ? options.el : $(options.el);
        
        this.$el.on('mouseover', this.show.bind(this));
        this.$el.on('mouseout', this.hide.bind(this));
    }
    
    render () {
        this.popup = $('<div class="uniformTooltip-popup">' + this.message + '</div>');
        this.popup.prepend("<div class='uniformTooltip-pointer'></div>");
        this.$el.append(this.popup);
        if (this.message.length > 100) {
            this.popup.css({
                minWidth: "200px"
            })
        }
        if (this.popup.outerWidth(true) + this.popup.offset().left > $(window).width()) {
            this.popup.css({
                left: $(window).width() - this.popup.outerWidth(true) - this.popup.offset().left
            })
        }
        return this;
    }
    
    remove () {
        this.$el.remove();
    }
    
    show () {
        if(!this.popup) this.render();
        this.popup.addClass('active');
        this.trigger('shown');
    }
    
    hide () {
        this.popup.removeClass('active');
        this.trigger('hidden');
    }
}
;
