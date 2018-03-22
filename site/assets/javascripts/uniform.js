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

function UniformComponent (options) {
    this.eventListeners = new Array();
    this.$el = $('<div>');
    
    this.on = function (type, handler) {
        this.eventListeners.push({
            type: type,
            handler: handler
        });
    };
    
    this.trigger = function (event_key) {
        for (var i = 0; i < this.eventListeners.length; i++) {
            if(this.eventListeners[i].type == "*" || this.eventListeners[i].type == "all" || event_key == this.eventListeners[i].type){
                this.eventListeners[i].handler(event_key, this);
            }
        }
    };
    
    this.initialize(options);
    
    return this;
}
UniformComponent.namespace = "";
UniformComponent.prototype.initialize = function () {}
;
(function( $ ) {
 
    $.fn.uniformCheckbox = function() {
        return this.each(function(){
            var el = $(this);
            var checkbox = new UniformCheckbox({
                el: this
            });
            checkbox.render();
        });
    };
    $.fn.uniformRadio = $.fn.uniformCheckbox;
 
}( jQuery ));
function UniformCheckbox(options){
    UniformComponent.call(this, options);
}
UniformCheckbox.prototype = Object.create(UniformComponent.prototype);
UniformCheckbox.prototype.constructor = UniformComponent;
UniformCheckbox.prototype.initialize = function (options) {
    this.$el = (options.el instanceof $) ? options.el : $(options.el);

    this.$el.on('change', this.change.bind(this));
}
UniformCheckbox.prototype.render = function () {
    var type = this.$el.hasClass(''+UniformComponent.namespace+'uniformRadio') ? ''+UniformComponent.namespace+'uniformRadio' : ''+UniformComponent.namespace+'uniformCheckbox';
    this.checkbox = $('<div class="'+UniformComponent.namespace+type+'-indicator">');
    this.checkbox.addClass(this.$el.attr('class').replace(type, ''));
    this.checkbox.toggleClass('checked', this.$el.prop('checked'));
    this.$el.after(this.checkbox);
    this.checkbox.click(this.click.bind(this));
    return this;
}
UniformCheckbox.prototype.click = function (e){
    if (this.$el.prop('disabled')) return;
    this.$el.prop('checked', !this.$el.prop('checked'));
    this.$el.trigger('change');
    e.preventDefault();
}
UniformCheckbox.prototype.change = function () {
    this.checkbox.toggleClass('checked', this.$el.prop('checked'));
}
;
(function( $ ) {
 
    $.fn.uniformDropdown = function() {
        return this.each(function(){
            var el = $(this);
            var options = {
                el: this
            };
            if (el.data('dropdown-align') !== undefined)      options.align       = el.data('dropdown-align');
            if (el.data('dropdown-trigger') !== undefined)    options.trigger     = el.data('dropdown-trigger');
            if (el.data('dropdown-show_arrow') !== undefined) options.show_arrow  = el.data('dropdown-show_arrow');
            if (el.data('dropdown-square') !== undefined)     options.square  = el.data('dropdown-square');
            if (el.data('dropdown-hide_sm') !== undefined)    options.hide_sm     = el.data('dropdown-hide_sm');
            if (el.data('dropdown-content') !== undefined)    options.content     = "<div class='"+UniformComponent.namespace+"pad'>" + el.data('dropdown-content') + "</div>";
            if (el.data('dropdown-target') !== undefined)     options.content     = $(el.data('dropdown-target'));
            var dropdown = new UniformDropdown(options);
            dropdown.on('*', function (event_key, dropdown) {
                el.trigger('dropdown-' + event_key, dropdown);
            });
            dropdown.render();
        });
    };
 
}( jQuery ));
function UniformDropdown(options){
    UniformComponent.call(this, options);
}
UniformDropdown.prototype = Object.create(UniformComponent.prototype);
UniformDropdown.prototype.constructor = UniformComponent;
/*. UniformDropdown.initialize
    Options
    content:    string|$el - content rendered in dropdown
    align:      'center'|'left'|'right| - how dropdown aligns to trigger el
    trigger:    'click'|'focus'|'mouseover' - what triggers showDropdown
    show_arrow: true\false - show dropdown arrow
    hide_sm:    true|false - don't show dropdown on mobile browsers
    square:     true|false - round corners on dropdown
*/
UniformDropdown.prototype.initialize = function (options) {
    options = options || {}
    this.options = {
        align: 'center',
        trigger: 'click focus',
        show_arrow: true,
        hide_sm: false,
        square: false
    };
    this.options = $.extend(this.options, uniformHelpers.pick(options, Object.keys(this.options)));
    this.content = options.content;
    this.$el = (options.el instanceof $) ? options.el : $(options.el);
    options.el.dropdown = this;

    this.$el.on(this.options.trigger, this.toggle.bind(this));
    $(window).on('resize', this.resize.bind(this));
    $(document).on(this.options.trigger, this.outsideClick.bind(this));
    $(document).on('keyup', this.keyup.bind(this));
}

UniformDropdown.prototype.render = function () {
    this.dropdown = $("<div class='"+UniformComponent.namespace+"uniformDropdown-dropdown "+UniformComponent.namespace+"absolute'>");
    this.dropdown.css({
        minWidth: this.$el.outerWidth()
    })
    if (this.options.show_arrow) {
        this.dropdown.addClass('has-pointer');
        this.dropdown.append("<div class='"+UniformComponent.namespace+"uniformDropdown-pointer'></div>");
    }
    this.dropdown.toggleClass('square', this.options.square);
    this.dropdown.hide();
    this.dropdown.append(this.content);
    this.dropdown.appendTo($('body'));
    this.dropdown.find('.hidden').removeClass('hidden');

    this.resize();
    return this;
}


UniformDropdown.prototype.resize = function () {
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

UniformDropdown.prototype.remove = function () {
    this.$el.remove();
    this.$el.off(this.options.trigger);
    $(window).off('resize', this.resize.bind(this));
    $(document).off(this.options.trigger, this.outsideClick.bind(this));
    $(document).off('keyup', this.keyup.bind(this));
}

UniformDropdown.prototype.toggle = function () {
    if (this.$el.hasClass('active')) {
        this.hide();
    } else {
        this.show();
    }
}

UniformDropdown.prototype.show = function () {
    if(this.options.hide_sm && $(window).width() < 720) return;
    if(!this.dropdown) this.render();

    this.dropdown.show();
    this.$el.addClass('active');

    this.overlay = $("<div class='"+UniformComponent.namespace+"uniformOverlay'>");
    $('body').append(this.overlay);

    if ($(window).width() < 720) {
        this.lastScrollPosition = $(window).scrollTop();
        $('body').addClass('"+UniformComponent.namespace+"uniformModal-hideBody');
    }

    this.overlay.click(this.hide.bind(this));
    this.trigger('shown');
}

UniformDropdown.prototype.hide = function () {
    if(!this.dropdown) return;
    this.dropdown.hide();
    this.$el.removeClass('active');
    if (this.overlay) this.overlay.remove();
    if ($(window).width() < 720) {
        $('body').removeClass('"+UniformComponent.namespace+"uniformModal-hideBody');
        $(window).scrollTop(this.lastScrollPosition);
    }
    this.trigger('hidden');
}

UniformDropdown.prototype.outsideClick = function (e) {
    if (!this.dropdown || !this.dropdown.is(":visible")) return;
    if (e.target === this.$el[0]) return;
    if (e.target === this.overlay) return;
    if ($.contains(this.$el[0], e.target)) return;
    if ($.contains(this.dropdown[0], e.target)) return;
    this.hide();
}
UniformDropdown.prototype.keyup = function (e) {
    if(e.which != 27) return;
    this.hide();
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
                });

                label.css({
                    position: 'absolute',
                    top: 0,
                    left: label.position().left,
                    paddingLeft: input.css("paddingLeft"),
                    height: startingHeight,
                    lineHeight: startingHeight + "px"
                });
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
                });
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
            options.content = $(el.data('modal-target')).clone();
            options.content.removeClass('hidden');
        }
        var modal = new UniformModal(options);
        modal.on('*', function (event_type, modal) {
            el.trigger('modal-' + type, modal);
        });
        modal.render();
    };
 
}( jQuery ));

function UniformModal(options){
    UniformComponent.call(this, options);
}
UniformModal.prototype = Object.create(UniformComponent.prototype);
UniformModal.prototype.constructor = UniformComponent;
/*  UniformModal.initialize
    Options
    content:    string|$el|function
    klass:      string - classes to append to modal container
*/
UniformModal.prototype.initialize = function (options) {
    this.options = {
        klass: false,
    };
    $.extend(this.options, uniformHelpers.pick(options, 'klass'));
    this.content = options.content;
    
    this.$el.addClass(UniformComponent.namespace+'uniformModal');
    $(document).on('keyup', this.keyup.bind(this));
    this.$el.on('click', '.'+UniformComponent.namespace+'uniformModal-close', this.close.bind(this));
}
UniformModal.prototype.keyup = function (e) {
    if(e.which != 27) return;
    this.close();
}
UniformModal.prototype.render = function () {
    console.log(UniformComponent.namespace);
    var that = this;
    var content = typeof this.content == 'function' ? this.content() : this.content;
    if (!(content instanceof jQuery)) content = $("<div>").html(content);
    
    this.highest_z_index = 0;
    this.overlay = $('<div class="'+UniformComponent.namespace+'uniformModal-overlay"></div>');
    this.blur = $('<div class="'+UniformComponent.namespace+'uniformModal-blur"></div>');
    this.original_scroll = window.scrollY;
    this.blur.css('top', 0 - this.original_scroll + "px")
    
    if ($('.'+UniformComponent.namespace+'uniformModal').length > 0) {
        this.highest_z_index = Math.max($('.'+UniformComponent.namespace+'uniformModal').map(function(){
            return parseInt($(this).css('zIndex'));
        }));
        this.$el.css('zIndex', this.highest_z_index + 2);
    }
    this.$el.append(this.overlay);
    this.blur.append($('body').children());
    
    $('body').addClass(''+UniformComponent.namespace+'uniformModal-active');
    $('body').append(this.blur)
    $('body').append(this.$el);
    
    var container = $('<div class="'+UniformComponent.namespace+'uniformModal-container">');
    container.append(content);
    
    container.append('<div class="'+UniformComponent.namespace+'uniformModal-close"></div>');
    this.$el.css('top', $(window).scrollTop());
    this.overlay.click(this.close.bind(this));
    this.$el.append(container);
    
    if (this.options.klass) container.addClass(this.options.klass);
    if (content instanceof $) content.trigger('rendered');
    this.trigger('rendered');
    
    return this;
}
UniformModal.prototype.close = function () {
    $('.'+UniformComponent.namespace+'uniformModal-active').removeClass(''+UniformComponent.namespace+'uniformModal-active');
    $('body').append(this.blur.children());
    this.blur.remove();
    $(window).scrollTop(this.original_scroll);
    this.trigger('closed');
    this.remove();
}
UniformModal.prototype.remove = function () {
    this.overlay.remove();
    this.$el.remove();
    this.$el.off('click');
    this.overlay.off('click');
    $(document).off('keyup', this.keyup.bind(this));
}
;
(function( $ ) {
 
    $.fn.uniformResizer = function() {
        return this.each(function(){
            console.log(this);
            new uniformResizer({
                el: this
            });
        });
    };
 
}( jQuery ));
function uniformResizer(options){
    UniformComponent.call(this, options);
}
uniformResizer.prototype = Object.create(UniformComponent.prototype);
uniformResizer.prototype.constructor = UniformComponent;
uniformResizer.prototype.initialize = function (options) {
    this.$el = (options.el instanceof $) ? options.el : $(options.el);
    $(window).resize(this.resize.bind(this));
    $(window).trigger('resize');
}
uniformResizer.prototype.resize = function () {
    // breakpoints at 720, 1080, 1440
    var width = this.$el.width();

    if(width > 720 && !this.$el.hasClass('md-size')) {
        this.$el.addClass('md-size');
    } else if (width < 720 && this.$el.hasClass('md-size')) {
        this.$el.removeClass('md-size');
    }

    if(width > 1080 && !this.$el.hasClass('lg-size')) {
        this.$el.addClass('lg-size');
    } else if (width < 1080 && this.$el.hasClass('lg-size')) {
        this.$el.removeClass('lg-size');
    }

    if(width > 1440 && !this.$el.hasClass('xl-size')) {
        this.$el.addClass('xl-size');
    } else if (width < 1440 && this.$el.hasClass('xl-size')) {
        this.$el.removeClass('xl-size');
    }

    console.log(width);
    if(width < 720 && !this.$el.hasClass('sm-size')) {
        this.$el.addClass('sm-size');
    } else if (width > 720 && this.$el.hasClass('sm-size')) {
        this.$el.removeClass('sm-size');
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
        });
    }
    
    $.fn.uniformSelect = function(options) {
        options = $.extend({
            class: "",
            showAll: function (select_options){
                select_options.find('.'+UniformComponent.namespace+'uniformSelect-show-all').remove();
                select_options.find('button.hide').removeClass('hide');
                return false;
            },
            limit: 8
        }, options);
        
        return this.each(function(){
            var showing, lastScrollPosition, select_options;
            var select = $(this);
            var container = $("<div class='"+UniformComponent.namespace+"uniformSelect-container'></div>");
            var edit_button = $("<button type='button' class='"+UniformComponent.namespace+"uniformSelect-edit "+UniformComponent.namespace+"uniformInput "+UniformComponent.namespace+"outline "+UniformComponent.namespace+"block" + options.class + "'></button>");
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
                if (value == "") value = "&nbsp;";
                edit_button.html(value);
            }
            
            function resize () {
                // to keep button from extending beyond available width
                var text = edit_button.text();
                edit_button.text('');
                edit_button.css({
                    width: 'auto'
                });
                edit_button.css({
                    width: container.outerWidth()
                });
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
                select_options = $("<div class='"+UniformComponent.namespace+"uniformSelect-options'>");
                if (select.attr('name')) {
                    select_options.addClass(select.attr('name').toLowerCase().replace(/[^a-z0-9\-_]+/g, '-'));
                }
                select_options.css({
                    fontSize: select.css('font-size')
                });
                select_options.hide();
                select_options.appendTo('body');
                select.find('option').each(function(index, el){
                    var button = $("<button type='button' class='"+UniformComponent.namespace+"uniformSelect-option "+UniformComponent.namespace+"block "+UniformComponent.namespace+"outline "+UniformComponent.namespace+"text-left'>");
                    button[0].option = $(el);
                    button.text($(el).text());
                    button.attr('value', $(el).val());
                    if (button.text() == "") button.html("<span class='"+UniformComponent.namespace+"text-italic "+UniformComponent.namespace+"text-muted'>None</span>");
                    if($(el).prop('selected')){
                        button.addClass('active');
                    } else if (options.limit && index > options.limit) {
                        button.addClass('hide');
                    }
                    select_options.append(button);
                    button.click(selectOption);
                });
        
                var actions_el = $('<div class="'+UniformComponent.namespace+'uniformSelect-options-actions">');
                if (options.limit && select.find('option').length > options.limit) {
                    var show_all_button = $("<button type='button' class='"+UniformComponent.namespace+"uniformSelect-show-all "+UniformComponent.namespace+"block "+UniformComponent.namespace+"outline "+UniformComponent.namespace+"blue' style='border: none'>Show All</button>");
                    show_all_button.click(function(e){
                        options.showAll(select_options);
                        return false;
                    });
                    actions_el.append(show_all_button);
                }
                if (select.prop('multiple')) {
                    var done_button = $("<button type='button' class='"+UniformComponent.namespace+"uniformSelect-done "+UniformComponent.namespace+"block "+UniformComponent.namespace+"outline "+UniformComponent.namespace+"blue'>Done</button>");
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
                $('body').removeClass(UniformComponent.namespace+'uniformModal-hideBody');
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
                $('body').addClass(UniformComponent.namespace+'uniformModal-hideBody');
            }
            
            function selectOption(e) {
                if (!select.prop('multiple')) {
                    select.find("option:selected").prop('selected', false);
                    select_options.find('.'+UniformComponent.namespace+'uniformSelect-option.'+UniformComponent.namespace+'active').removeClass(UniformComponent.namespace+'active');
                }
                $(e.currentTarget).toggleClass(UniformComponent.namespace+'active');
                e.currentTarget.option.prop('selected', $(e.currentTarget).hasClass(UniformComponent.namespace+'active'));
                select.trigger('change');
            }
            
            function updatePosition () {
                if(!select_options) return;
        
                if (select_options.hasClass(UniformComponent.namespace+'fixed')) {
                    if (container.fixedParents().length == 0) {
                        select_options.css({
                            position: 'absolute',
                            top: container.offset().top + container.outerHeight(),
                        });
                        select_options.removeClass(UniformComponent.namespace+'fixed');
                    }
                } else if(container.fixedParents().length > 0) {
                    lastScrollPosition = false;
                    select_options.css({
                        position: 'fixed',
                    });
                    select_options.offset({
                        top: container.offset().top + container.outerHeight(),
                        left: container.offset().left
                    });
                    select_options.addClass(UniformComponent.namespace+'fixed');
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
                el.trigger('tooltip-' + event_type, tooltip);
            });
            tooltip.render();
        });
    };
 
}( jQuery ));
function UniformTooltip(options){
    UniformComponent.call(this, options);
}
UniformTooltip.prototype = Object.create(UniformComponent.prototype);
UniformTooltip.prototype.constructor = UniformComponent;
UniformTooltip.prototype.initialize = function (options) {
    this.enabled = true;
    this.message = options.message;
    this.$el = (options.el instanceof $) ? options.el : $(options.el);
    options.el.tooltip = this;

    this.$el.on('mouseenter', this.show.bind(this));
    this.$el.on('mouseleave', this.hide.bind(this));
}
UniformTooltip.prototype.render = function () {
    this.popup = $('<div class="'+UniformComponent.namespace+'uniformTooltip-popup">' + this.message + '</div>');
    this.popup.prepend("<div class='"+UniformComponent.namespace+"uniformTooltip-pointer'></div>");
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
    return this;
}
UniformTooltip.prototype.remove = function () {
    this.$el.remove();
}
UniformTooltip.prototype.show = function (e) {
    if(!this.popup) this.render();
    if(!this.enabled) return;
    
    if (this.hiding) return this.show_after_hide = true;
    if (this.showing || this.shown) return;
    this.popup.css('display', 'block');
    this.showing = true;
    this.hidden = false;
    this.popup.animate({
        bottom: "100%",
        opacity: 1
    }, 200, (function(){
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
UniformTooltip.prototype.hide = function (e) {
    if (this.showing) return this.show_after_hide = true;
    if (this.hiding || this.hidden) return;
    this.hiding = true;
    this.shown = false;
    this.popup.animate({
        bottom: 0,
        opacity: 0
    }, 200, (function (){
        this.popup.css('display', 'none');
        this.hiding = false;
        this.hidden = true;
        this.trigger('hidden');
        if (this.show_after_hide) this.show();
        this.show_after_hide = false;
    }).bind(this))
}

UniformTooltip.prototype.disable = function () {
    this.enabled = false;
}

UniformTooltip.prototype.enable = function () {
    this.enabled = true;
}
;
